module.exports = {
    run: [
      {
        method: "shell.run",
        params: {
          path: "gepeto_ai",
          message: "git pull",
        },
      },
      {
        method: "notify",
        params: {
          html: "App updated!",
        },
      },
    ],
  };
  