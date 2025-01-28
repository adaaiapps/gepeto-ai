module.exports = {
    run: [
      {
        method: "shell.run",
        params: {
          message: [
            "git clone https://github.com/pinokiocomputer/gepeto gepeto_ai",
          ],
        },
      },
      {
        method: "shell.run",
        params: {
          venv: "env",
          venv_python: "3.10",
          path: "gepeto_ai",
          message: [
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
  