module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "gepeto_ai",
        message: [
          "uv pip install -r requirements.txt",
          "python gepeto_ai.py",
        ],
      },
    },
  ],
};
