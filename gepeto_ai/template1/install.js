module.exports = {
    run: [
      {
        method: "shell.run",
        params: {
          message: [
            "git clone <GIT_REPOSITORY> app",
          ]
        }
      },
      {
        method: "shell.run",
        params: {
          path: "app",
          message: [
            "uv pip install -r <INSTALL_FILE>"
          ],
        }
      },
      {
        method: "notify",
        params: {
          html: "Click the 'start' tab to get started!",
        },
      },
    ]
  }
  