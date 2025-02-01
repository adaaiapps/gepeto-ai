const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

module.exports = {
  daemon: true,
  run: [
    {
      method: "shell.run",
      params: {
        message: (async () => {
          // Detect OS
          const platform = os.platform();
          
          let pythonPath = '';
          if (platform === 'win32') {
            // Untuk Windows
            const wherePy = await execAsync('where py');
            pythonPath = wherePy.stdout.trim();
          } else {
            // Untuk macOS dan Linux
            const whichPy = await execAsync('which python');
            pythonPath = whichPy.stdout.trim();
          }

          return [
            "conda deactivate",
            `conda deactivate`,
            `conda deactivate`,
            `timeout /t 1 > nul`,
            `conda activate base`,
            `timeout /t 1 > nul`,
            `"${pythonPath} gepeto_ai.py"`
          ];
        })()
      },
      env: {
        GIT_URL: process.env.GIT_URL,
        API_KEY: process.env.API_KEY,
        LLM_TYPE: process.env.LLM_TYPE,
        PINOKIO_HOME: process.env.PINOKIO_HOME,
        PROJECT_NAME: process.env.PROJECT_NAME,
        ICON_URL: process.env.ICON_URL
      }
    }
  ]
};

// Helper function untuk menjalankan command
function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve({ stdout, stderr });
      }
    });
  });
}