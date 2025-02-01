import os
    import json
    import subprocess
    from dotenv import load_dotenv
    from langchain_community.chat_models import ChatOpenAI, ChatAnthropic
    from langchain_google_genai import ChatGoogleGenerativeAI
    from langchain.prompts import ChatPromptTemplate
    from langchain.schema import BaseOutputParser

    class JsonOutputParser(BaseOutputParser):
        def parse(self, text: str):
            try:
                return json.loads(text)
            except json.JSONDecodeError:
                return None

    # Load file environment
    load_dotenv()

    # Ambil variabel lingkungan
    ENVIRONMENT_FILE = "_ENVIRONMENT"

    def load_environment_variables():
        env_vars = {}
        if os.path.exists(ENVIRONMENT_FILE):
            with open(ENVIRONMENT_FILE, "r") as f:
                for line in f:
                    line = line.strip()
                    if line and not line.startswith("#") and "=" in line:
                        key, value = line.split("=", 1)
                        env_vars[key.strip()] = value.strip()
        return env_vars

    def analyze_repo(repo_url, api_key, llm_type):
        try:
            # Clone repo
            repo_name = repo_url.split("/")[-1].replace(".git", "")
            subprocess.run(["git", "clone", repo_url, repo_name], check=True)

            repo_path = os.path.abspath(repo_name)

            # Baca README.md
            readme_content = ""
            readme_path = os.path.join(repo_path, "README.md")
            if os.path.exists(readme_path):
                with open(readme_path, "r", encoding="utf-8") as f:
                    readme_content = f.read()

            # Baca requirements.txt
            requirements_content = ""
            requirements_path = os.path.join(repo_path, "requirements.txt")
            if os.path.exists(requirements_path):
                with open(requirements_path, "r", encoding="utf-8") as f:
                    requirements_content = f.read()

            # Baca package.json
            package_content = ""
            package_path = os.path.join(repo_path, "package.json")
            if os.path.exists(package_path):
                with open(package_path, "r", encoding="utf-8") as f:
                    package_content = f.read()

            # Load dokumentasi
            docs_path = os.path.abspath("ada_docs.md")
            docs_content = ""
            if os.path.exists(docs_path):
                with open(docs_path, "r", encoding="utf-8") as f:
                    docs_content = f.read()

            # Pilih model LLM
            if llm_type == "openai":
                llm = ChatOpenAI(api_key=api_key, model="gpt-4", temperature=0.2)
            elif llm_type == "anthropic":
                llm = ChatAnthropic(api_key=api_key, model="claude-3-opus-20240229", temperature=0.2)
            elif llm_type == "google":
                llm = ChatGoogleGenerativeAI(api_key=api_key, model="gemini-pro", temperature=0.2)
            else:
                raise ValueError(f"Jenis LLM tidak valid: {llm_type}")

            # Buat prompt
            prompt = ChatPromptTemplate.from_messages([
                ("system", f"""
                    Anda adalah ahli dalam analisis repositori GitHub.
                    {docs_content}
                    Analisis informasi ini:
                    - Bahasa pemrograman
                    - Dependencies
                    - Cara menjalankan aplikasi
                    - Instruksi dari README.md
                    Kembalikan dalam format JSON.
                """),
                ("user", f"""
                    URL: {repo_url}
                    README.md: {readme_content}
                    requirements.txt: {requirements_content}
                    package.json: {package_content}
                """)
            ])

            # Eksekusi chain
            chain = prompt | llm | JsonOutputParser()
            result = chain.invoke({
                "repo_url": repo_url,
                "readme_content": readme_content,
                "requirements_content": requirements_content,
                "package_content": package_content,
            })

            return result

        except subprocess.CalledProcessError as e:
            print(f"Kesalahan saat cloning repo: {e}")
            return None
        except Exception as e:
            print(f"Kesalahan analisis repo: {e}")
            return None

    def main():
        env_vars = load_environment_variables()
        git_url = env_vars.get("GIT_URL")
        api_key = env_vars.get("API_KEY")
        llm_type = env_vars.get("LLM_TYPE")

        if not git_url:
            print("❌ GIT_URL tidak diatur di _ENVIRONMENT.")
            return
        if not api_key:
            print("❌ API_KEY tidak diatur di _ENVIRONMENT.")
            return
        if not llm_type:
            print("❌ LLM_TYPE tidak diatur di _ENVIRONMENT.")
            return

        try:
            repo_data = analyze_repo(git_url, api_key, llm_type)
            print("Hasil Analisis Repo:", json.dumps(repo_data, indent=4))
        except Exception as e:
            print(f"Terjadi kesalahan: {e}")

    if __name__ == "__main__":
        main()
