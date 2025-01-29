module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        message: [
          "if exist gepeto_ai (rmdir /s /q gepeto_ai)",
          "git clone https://github.com/pinokiocomputer/gepeto gepeto_ai",
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.10",
        path: "gepeto_ai",
        message: [
          "if exist env (rmdir /s /q env)",
          "pip install -r requirements.txt",
        ],
      },
    },
    {
      method: "notify",
      params: {
        html: "Click the 'start' tab to get started!",
      },
    },
  ],
};
