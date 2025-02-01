const { execSync } = require('child_process');
const os = require('os');

// Fungsi untuk mendapatkan path Python
function getPythonPath() {
  const platform = os.platform();
  let pythonPath = '';

  try {
    if (platform === 'win32') {
      // Untuk Windows
      pythonPath = execSync('where py').toString().trim();
    } else {
      // Untuk macOS dan Linux
      pythonPath = execSync('which python').toString().trim();
    }
    console.log("✅ Path Python ditemukan:", pythonPath);
  } catch (error) {
    console.error("❌ Gagal mendapatkan path Python:", error);
    throw error; // Melempar error agar proses berhenti jika Python tidak ditemukan
  }

  return pythonPath;
}

try {
  const pythonPath = "C:\\pinokio\\api\\gepeto-ai.git\\env\\Scripts\\python.exe";

  // Ekspor konfigurasi untuk Pinokio
  module.exports = {
    daemon: true,
    run: [
      {
        method: "shell.run",
        params: {
          message: [
            "conda deactivate", // Nonaktifkan environment Conda jika ada
            "conda activate base", // Aktifkan environment base
            `"${pythonPath}" gepeto_ai.py` // Jalankan script Python
          ],
          env: {
            GIT_URL: process.env.GIT_URL || "",
            API_KEY: process.env.API_KEY || "",
            LLM_TYPE: process.env.LLM_TYPE || "",
            PINOKIO_HOME: process.env.PINOKIO_HOME || "/PINOKIO_HOME",
            PROJECT_NAME: process.env.PROJECT_NAME || "",
            ICON_URL: process.env.ICON_URL || ""
          }
        }
      }
    ]
  };
} catch (error) {
  console.error("❌ Error dalam menyiapkan script:", error);

  // Jika terjadi error, tampilkan notifikasi di Pinokio
  module.exports = {
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
