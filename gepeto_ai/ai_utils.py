import os
import json
import subprocess
from dotenv import load_dotenv
from langchain.chat_models import ChatOpenAI, ChatAnthropic, ChatGooglePalm, ChatDeepseek
from langchain.prompts import ChatPromptTemplate
from langchain.schema import BaseOutputParser

load_dotenv()

class JsonOutputParser(BaseOutputParser):
    def parse(self, text: str):
        try:
            return json.loads(text)
        except json.JSONDecodeError:
            return None

def analyze_repo(repo_url):
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

        # Choose LLM based on environment variables
        llm_type = os.getenv("LLM_TYPE", "openai")
        if llm_type == "openai":
            llm = ChatOpenAI(
                openai_api_key=os.getenv("OPENAI_API_KEY"),
                model="gpt-4o",
                temperature=0.2,
            )
        elif llm_type == "anthropic":
            llm = ChatAnthropic(
                anthropic_api_key=os.getenv("ANTHROPIC_API_KEY"),
                model="claude-3-opus-20240229",
                temperature=0.2,
            )
        elif llm_type == "google":
            llm = ChatGooglePalm(
                google_api_key=os.getenv("GOOGLE_API_KEY"),
                model="models/text-bison-001",
                temperature=0.2,
            )
        elif llm_type == "deepseek":
            llm = ChatDeepseek(
                deepseek_api_key=os.getenv("DEEPSEEK_API_KEY"),
                model="deepseek-chat",
                temperature=0.2,
            )
        else:
            raise ValueError(f"Invalid LLM type: {llm_type}")

        prompt = ChatPromptTemplate.from_messages([
            ("system", """
                You are an expert in analyzing GitHub repositories and generating Pinokio scripts.
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
        special_instructions = repo_data.get("special_instructions", "")
        use_torch = "torch" in dependencies or "pytorch" in dependencies
        use_link = True # You can add logic to detect if link is needed
        repo_name = repo_data.get("repo_name", "app")
        repo_url = repo_data.get("repo_url", "")

        template_dir = "template1" if not use_torch else "template2"

        install_script = open(f"{template_dir}/install.js", "r").read()
        start_script = open(f"{template_dir}/start.js", "r").read()
        update_script = open(f"{template_dir}/update.js", "r").read()
        reset_script = open(f"{template_dir}/reset.js", "r").read()
        pinokio_script = open(f"{template_dir}/pinokio.js", "r").read()

        install_script = install_script.replace("<GIT_REPOSITORY>", repo_url)
        install_script = install_script.replace("<INSTALL_FILE>", "requirements.txt" if language == "Python" else "package.json")

        start_script = start_script.replace("<START_FILE>", run_command)

        pinokio_script = pinokio_script.replace("<TITLE>", repo_name)
        pinokio_script = pinokio_script.replace("<ICON>", "icon.png")

        scripts = {
            "install.js": install_script,
            "start.js": start_script,
            "update.js": update_script,
            "reset.js": reset_script,
            "pinokio.js": pinokio_script,
        }

        if use_torch:
            scripts["torch.js"] = open("template2/torch.js", "r").read()
        if use_link:
            scripts["link.js"] = open("template2/link.js", "r").read()
        if template_dir == "template2":
            scripts["app.py"] = open("template2/app.py", "r").read()
            scripts["requirements.txt"] = open("template2/requirements.txt", "r").read()

        return scripts
    except Exception as e:
        raise Exception(f"Error generating Pinokio scripts: {e}")
