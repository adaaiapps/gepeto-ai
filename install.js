module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          "git clone https://github.com/adaaiapps/gepeto-ai.git app",
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.10",
        path: "app/gepeto_ai",
        message: [
          "uv pip install -r requirements.txt",
        ],
      },
    },
    {
      method: "fs.link",
      params: {
        venv: "app/env"
      }
    },
    {
      method: "notify",
      params: {
        html: "Click the 'start' tab to get started!",
      },
    },
  ],
};
