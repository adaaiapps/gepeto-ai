const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.11",
        path: ".",
        message: (async () => {
          // Install dependencies using pip
          await execAsync("pip install -r requirements.txt");
        })()
      }
    },
    {
      method: "shell.run",
      params: {
        path: ".",
        message: (async () => {
          const platform = os.platform();
          let pythonPath = '';

          // Mendapatkan path Python sesuai OS
          if (platform === 'win32') {
            // Untuk Windows
            const wherePy = await execAsync('where py');
            pythonPath = wherePy.stdout.trim();
          } else {
            // Untuk macOS dan Linux
            const whichPy = await execAsync('which python');
            pythonPath = whichPy.stdout.trim();
          }

          // Install python-dotenv menggunakan Python yang ditemukan
          await execAsync(`${pythonPath} -m pip install python-dotenv`);
        })()
      }
    },
    {
      method: "notify",
      params: {
        html: "Instalasi selesai! Klik tombol Start untuk memulai."
      }
    }
  ],
  emitter: new EventEmitter()
};

// Helper function untuk menjalankan command
async function execAsync(command) {
  return new Promise((resolve, reject) => {
    exec(command, (error, stdout, stderr) => {
      if (error) {
        reject(error);
      } else {
        resolve(stdout);
      }
    });
  });
}