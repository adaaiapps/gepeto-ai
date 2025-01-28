module.exports = {
    daemon: true,
    run: [
      {
        method: "shell.run",
        params: {
          venv: "env",
          path: "gepeto_ai",
          message: [
            "python gepeto_ai.py",
          ],
        },
      },
    ],
  };
  