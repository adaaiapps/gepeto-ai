const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        message: `python gepeto_ai.py`,
        env: {
          GIT_URL: process.env.GIT_URL,
          API_KEY: process.env.API_KEY,
          LLM_TYPE: process.env.LLM_TYPE,
          PINOKIO_HOME: process.env.PINOKIO_HOME,
          PROJECT_NAME: process.env.PROJECT_NAME,
          ICON_URL: process.env.ICON_URL
        }
      },
    }
  ],
};