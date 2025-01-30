import os
import json
import subprocess
from langchain_community.chat_models import ChatOpenAI, ChatAnthropic, ChatGooglePalm
from langchain.prompts import ChatPromptTemplate
from langchain.schema import BaseOutputParser

class JsonOutputParser(BaseOutputParser):
    def parse(self, text: str):
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return None

ENVIRONMENT_FILE = "_ENVIRONMENT"

def load_environment_variables():
    env_vars = {}
    if os.path.exists(_ENVIRONMENT_FILE):
        with open(_ENVIRONMENT_FILE, "r") as f:
            for line in f:
                line = line.strip()
                if line and not line.startswith("#") and "=" in line:
                    key, value = line.split("=", 1)
                    env_vars[key.strip()] = value.strip()
    return env_vars

def analyze_repo(repo_url, api_key, llm_type):
    try:
        # Kloning repositori
        repo_name = repo_url.split("/")[-1].replace(".git", "")
        subprocess.run(["git", "clone", repo_url, repo_name], check=True, capture_output=True, text=True)
        repo_path = os.path.abspath(repo_name)

        # Membaca README.md
        readme_path = os.path.join(repo_path, "README.md")
        readme_content = ""
        if os.path.exists(readme_path):
            with open(readme_path, "r", encoding="utf-8") as f:
                readme_content = f.read()

        # Membaca requirements.txt
        requirements_path = os.path.join(repo_path, "requirements.txt")
        requirements_content = ""
        if os.path.exists(requirements_path):
            with open(requirements_path, "r", encoding="utf-8") as f:
                requirements_content = f.read()

        # Membaca package.json
        package_path = os.path.join(repo_path, "package.json")
        package_content = ""
        if os.path.exists(package_path):
            with open(package_path, "r", encoding="utf-8") as f:
                package_content = f.read()

        # Menyimpan URL repositori ke config.json
        config_path = os.path.join(os.getcwd(), "config.json")
        config_data = {"last_repo_url": repo_url}
        with open(config_path, "w") as f:
            json.dump(config_data, f, indent=4)

        # Membaca file dokumentasi
        docs_path = os.path.join(os.path.dirname(__file__), "ada_docs.md")
        docs_content = ""
        if os.path.exists(docs_path):
            with open(docs_path, "r", encoding="utf-8") as f:
                docs_content = f.read()

        # Memilih model LLM berdasarkan variabel lingkungan
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
            raise ValueError(f"Jenis LLM tidak valid: {llm_type}")

        # Membuat prompt untuk analisis
        prompt = ChatPromptTemplate.from_messages([ 
            ("system", f"""
                Anda adalah seorang ahli dalam menganalisis repositori GitHub dan menghasilkan skrip Pinokio.
                {docs_content}
                Analisis informasi repositori yang diberikan dan ekstrak hal-hal berikut:
                - Bahasa pemrograman (misalnya Python, Node.js, dll.)
                - Ketergantungan (misalnya paket pip, npm, dll.)
                - Perintah untuk menjalankan aplikasi
                - Instruksi khusus dari README.md
                Kembalikan hasil dalam format JSON.
            """),
            ("user", f"""
                URL Repositori: {repo_url}
                README.md: {readme_content}
                requirements.txt: {requirements_content}
                package.json: {package_content}
            """)
        ])

        # Membuat rantai proses
        chain = prompt | llm | JsonOutputParser()
        result = chain.invoke({
            "repo_url": repo_url,
            "readme_content": readme_content,
            "requirements_content": requirements_content,
            "package_content": package_content,
        })

        return result

    except subprocess.CalledProcessError as e:
        print(f"Kesalahan saat mengkloning repositori: {e.stderr}")
        return None
    except Exception as e:
        print(f"Kesalahan saat menganalisis repositori: {e}")
        return None

def generate_pinokio_scripts(repo_data):
    try:
        language = repo_data.get("language", "unknown")
        dependencies = repo_data.get("dependencies", [])
        run_command = repo_data.get("command", "")
        repo_name = repo_data.get("repo_name", "app")
        repo_url = repo_data.get("repo_url", "")

        # Menentukan direktori template berdasarkan ketergantungan
        template_dir = "template1" if "torch" not in dependencies else "template2"

        # Membaca file skrip template
        install_script = open(f"{template_dir}/install.js", "r").read()
        start_script = open(f"{template_dir}/start.js", "r").read()
        pinokio_script = open(f"{template_dir}/pinokio.js", "r").read()

        # Mengganti placeholder dengan nilai sesuai repositori
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
        raise Exception(f"Kesalahan saat menghasilkan skrip Pinokio: {e}")

def main():
    config = load_config()
    env_vars = load_environment_variables()
    git_url = env_vars.get("GIT_URL")
    api_key = env_vars.get("API_KEY")
    llm_type = env_vars.get("LLM_TYPE")
    project_name = env_vars.get("PROJECT_NAME")
    icon_url = env_vars.get("ICON_URL")
    
    if not git_url:
        print("GIT_URL tidak ditemukan di file _ENVIRONMENT. Pastikan untuk menyetel variabel lingkungan sebelum menjalankan script.")
        return

    if not api_key:
        print("API_KEY tidak ditemukan di file _ENVIRONMENT. Pastikan untuk menyetel variabel lingkungan sebelum menjalankan script.")
        return

    if not llm_type:
        print("LLM_TYPE tidak ditemukan di file _ENVIRONMENT. Pastikan untuk menyetel variabel lingkungan sebelum menjalankan script.")
        return

    try:
        repo_data = analyze_repo(git_url, api_key, llm_type)
        if repo_data:
            pinokio_scripts = generate_pinokio_scripts(repo_data)
            print("Skrip Pinokio berhasil dibuat:")

            # Menentukan lokasi Pinokio Home
            pinokio_home = os.getenv("PINOKIO_HOME", "/PINOKIO_HOME")
            app_name = project_name if project_name else "generated_app"
            app_folder = os.path.join(pinokio_home, "api", app_name)

            # Membuat folder aplikasi
            os.makedirs(app_folder, exist_ok=True)

            # Menyimpan setiap file hasil di folder aplikasi
            for filename, content in pinokio_scripts.items():
                print(f"\n{filename}:\n{content}")
                with open(os.path.join(app_folder, filename), "w") as f:
                    f.write(content)

            print(f"\nSkrip Pinokio disimpan di folder: {app_folder}")

            # Memeriksa keberadaan pinokio.js
            if "pinokio.js" not in pinokio_scripts:
                print("\nPerhatian: Tidak ada file pinokio.js yang dihasilkan. Menambahkan file pinokio.js default...")
                default_pinokio_js = f"""
module.exports = {{
  "run": [ {{
    "method": "script.start",
    "params": {{ "uri": "start.js" }}
  }}],
  "title": "{app_name}",
  "icon": "{icon_url if icon_url else 'icon.png'}"
}}
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
