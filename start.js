module.exports = {
  daemon: true,
  run: [
    // Membuat virtual environment jika belum ada
    {
      method: "shell.run",
      params: {
        path: "gepeto_ai",
        message: [
          "python -m venv env"
        ],
      },
    },
    // Mengaktifkan virtual environment dan mengecek Python path
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "gepeto_ai",
        message: [
          "which python", 
          "python -m pip install --upgrade pip", 
          "python -m pip install python-dotenv langchain_community deepseek-ai", 
          "python -m pip install -r requirements.txt", 
          "python -m pip check", 
          "uv pip list" // Mengecek apakah dotenv benar-benar terinstal
        ],
      },
    },
    // Menjalankan aplikasi setelah verifikasi selesai
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "gepeto_ai",
        message: [
          "python -m pip check",  // Verifikasi terakhir sebelum eksekusi
          "python gepeto_ai.py"
        ],
      },
    },
  ],
};
