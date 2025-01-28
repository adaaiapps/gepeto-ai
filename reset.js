module.exports = {
    run: [
      {
        method: "shell.run",
        params: {
          message: "rm -rf gepeto_ai/node_modules && rm -rf gepeto_ai/package-lock.json",
        },
      },
      {
        method: "notify",
        params: {
          html: "App reset!",
        },
      },
    ],
  };
  