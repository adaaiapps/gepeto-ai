import os
import json
import subprocess
from langchain_community.chat_models import ChatOpenAI, ChatAnthropic, ChatGooglePalm
from langchain.prompts import ChatPromptTemplate
from langchain.schema import BaseOutputParser

# Nama file konfigurasi
CONFIG_FILE = "config.json"
ENVIRONMENT_FILE = "ENVIRONMENT"

def load_config():
    if os.path.exists(CONFIG_FILE):
        with open(CONFIG_FILE, "r") as f:
            return json.load(f)
    return {}

def save_config(data):
    with open(CONFIG_FILE, "w") as f:
        json.dump(data, f, indent=4)

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
        # Clone the repository
        repo_name = repo_url.split("/")[-1].replace(".git", "")
        subprocess.run(["git", "clone", repo_url, repo_name], check=True, capture_output=True, text=True)
        repo_path = os.path.abspath(repo_name)

        # Read README.md
        readme_path = os.path.join(repo_path, "README.md")
        readme_content = ""
        if os.path.exists(readme_path):
            with open(readme_path, "r", encoding="utf-8") as f:
                readme_content = f.read()

        # Read requirements.txt
        requirements_path = os.path.join(repo_path, "requirements.txt")
        requirements_content = ""
        if os.path.exists(requirements_path):
            with open(requirements_path, "r", encoding="utf-8") as f:
                requirements_content = f.read()

        # Read package.json
        package_path = os.path.join(repo_path, "package.json")
        package_content = ""
        if os.path.exists(package_path):
            with open(package_path, "r", encoding="utf-8") as f:
                package_content = f.read()

        # Tentukan file config.json untuk menyimpan URL secara permanen
        config_path = os.path.join(os.getcwd(), "config.json")
        config_data = {"last_repo_url": repo_url}
        with open(config_path, "w") as f:
            json.dump(config_data, f, indent=4)

        # Read documentation file
        docs_path = os.path.join(os.path.dirname(__file__), "ada_docs.md")
        docs_content = ""
        if os.path.exists(docs_path):
            with open(docs_path, "r", encoding="utf-8") as f:
                docs_content = f.read()

        # Pilih model LLM berdasarkan variabel lingkungan Pinokio
        if llm_type == "openai":
            llm = ChatOpenAI(
                openai_api_key=api_key,
                model="gpt-4",
                temperature=0.2,
            )
        elif llm_type == "anthropic":
            llm = ChatAnthropic(
                anthropic_api_key=api_key,
                model="claude-3-opus-20240229",
                temperature=0.2,
            )
        elif llm_type == "google":
            llm = ChatGooglePalm(
                google_api_key=api_key,
                model="models/text-bison-001",
                temperature=0.2,
            )
        else:
            raise ValueError(f"Invalid LLM type: {llm_type}")

        prompt = ChatPromptTemplate.from_messages([ 
            ("system", f"""
                You are an expert in analyzing GitHub repositories and generating Pinokio scripts.
                {docs_content}
                Analyze the provided repository information and extract the following:
                - Programming language (e.g., Python, Node.js, etc.)
                - Dependencies (e.g., pip packages, npm packages)
                - Command to run the app
                - Any special instructions from README.md
                Return the result in JSON format.
            """),
            ("user", """
                Repository URL: {repo_url}
                README.md: {readme_content}
                requirements.txt: {requirements_content}
                package.json: {package_content}
            """)
        ])
        chain = prompt | llm | JsonOutputParser()
        result = chain.invoke({
            "repo_url": repo_url,
            "readme_content": readme_content,
            "requirements_content": requirements_content,
            "package_content": package_content,
        })
        return result
    except subprocess.CalledProcessError as e:
        print(f"Error cloning repository: {e.stderr}")
        return None
    except Exception as e:
        print(f"Error analyzing repository: {e}")
        return None

def generate_pinokio_scripts(repo_data):
    try:
        language = repo_data.get("language", "unknown")
        dependencies = repo_data.get("dependencies", [])
        run_command = repo_data.get("command", "")
        repo_name = repo_data.get("repo_name", "app")
        repo_url = repo_data.get("repo_url", "")

        template_dir = "template1" if "torch" not in dependencies else "template2"

        install_script = open(f"{template_dir}/install.js", "r").read()
        start_script = open(f"{template_dir}/start.js", "r").read()
        pinokio_script = open(f"{template_dir}/pinokio.js", "r").read()

        install_script = install_script.replace("<GIT_REPOSITORY>", repo_url)
        install_script = install_script.replace("<INSTALL_FILE>", "requirements.txt" if language == "Python" else "package.json")
        start_script = start_script.replace("<START_FILE>", run_command)

        pinokio_script = pinokio_script.replace("<TITLE>", repo_name)
        pinokio_script = pinokio_script.replace("<ICON>", "icon.png")

        scripts = {
            "install.js": install_script,
            "start.js": start_script,
            "pinokio.js": pinokio_script,
        }

        return scripts
    except Exception as e:
        raise Exception(f"Error generating Pinokio scripts: {e}")

def main():
    config = load_config()
    env_vars = load_environment_variables()
    git_url = env_vars.get("GIT_URL")
    api_key = env_vars.get("API_KEY")
    llm_type = env_vars.get("LLM_TYPE")
    
    if not git_url:
        print("GIT_URL tidak ditemukan di file ENVIRONMENT. Pastikan untuk menyetel variabel lingkungan sebelum menjalankan script.")
        return

    if not api_key:
        print("API_KEY tidak ditemukan di file ENVIRONMENT. Pastikan untuk menyetel variabel lingkungan sebelum menjalankan script.")
        return

    if not llm_type:
        print("LLM_TYPE tidak ditemukan di file ENVIRONMENT. Pastikan untuk menyetel variabel lingkungan sebelum menjalankan script.")
        return

    try:
        repo_data = analyze_repo(git_url, api_key, llm_type)
        if repo_data:
            pinokio_scripts = generate_pinokio_scripts(repo_data)
            print("Skrip Pinokio berhasil dibuat:")

            # Tentukan lokasi Pinokio Home
            pinokio_home = os.getenv("PINOKIO_HOME", "/PINOKIO_HOME")
            app_name = "generated_app"
            app_folder = os.path.join(pinokio_home, "api", app_name)

            # Buat folder aplikasi
            os.makedirs(app_folder, exist_ok=True)

            # Simpan setiap file hasil di folder aplikasi
            for filename, content in pinokio_scripts.items():
                print(f"\n{filename}:\n{content}")
                with open(os.path.join(app_folder, filename), "w") as f:
                    f.write(content)

            print(f"\nSkrip Pinokio disimpan di folder: {app_folder}")

            # Periksa keberadaan pinokio.js
            if "pinokio.js" not in pinokio_scripts:
                print("\nPerhatian: Tidak ada file pinokio.js yang dihasilkan. Menambahkan file pinokio.js default...")
                default_pinokio_js = """
module.exports = {
  "run": [ {
    "method": "script.start",
    "params": { "uri": "start.js" }
  }]
}
"""
                with open(os.path.join(app_folder, "pinokio.js"), "w") as f:
                    f.write(default_pinokio_js)
                print("File pinokio.js default telah ditambahkan.")
        else:
            print("Gagal menganalisis repositori.")
    except Exception as e:
        print(f"Terjadi kesalahan: {e}")

if __name__ == "__main__":
    main()
