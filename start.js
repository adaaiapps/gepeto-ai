const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');
const os = require('os');

// Helper function untuk menjalankan command shell
async function execAsync(command) {
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

// Fungsi untuk mendapatkan path Python
async function getPythonPath() {
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

  return pythonPath;
}

// Fungsi utama untuk menjalankan script
async function main() {
  try {
    const pythonPath = await getPythonPath();

    // Perintah shell yang akan dijalankan
    const commands = [
      "conda deactivate",
      "conda deactivate",
      "conda deactivate",
      "timeout /t 1 > nul", // Untuk Windows
      "conda activate base",
      "timeout /t 1 > nul", // Untuk Windows
      `"${pythonPath}" gepeto_ai.py` // Jalankan script Python
    ];

    console.log("📜 Perintah shell yang akan dijalankan:", commands);

    // Kembalikan konfigurasi untuk Pinokio
    return {
      daemon: true,
      run: [
        {
          method: "shell.run",
          params: {
            message: commands
          },
          env: {
            GIT_URL: process.env.GIT_URL || "",
            API_KEY: process.env.API_KEY || "",
            LLM_TYPE: process.env.LLM_TYPE || "openai",
            PINOKIO_HOME: process.env.PINOKIO_HOME || "/PINOKIO_HOME",
            PROJECT_NAME: process.env.PROJECT_NAME || "Default Project Name",
            ICON_URL: process.env.ICON_URL || ""
          }
        }
      ]
    };
  } catch (error) {
    console.error("❌ Error:", error);
    return {
      daemon: true,
      run: [
        {
          method: "notify",
          params: {
            html: "Gagal memulai aplikasi. Periksa log untuk detailnya."
          }
        }
      ]
    };
  }
}

// Jalankan fungsi utama dan ekspor hasilnya
main().then((config) => {
  console.log("⚙️ Konfigurasi yang diekspor:", config);
  module.exports = config;
});