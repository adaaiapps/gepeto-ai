module.exports = {
  daemon: true,
  run: [
    // Membuat virtual environment jika belum ada
    {
      method: "shell.run",
      params: {
        path: ".", // Direktori utama proyek
        message: [
          "python -m venv env"
        ],
      },
    },
    // Mengaktifkan virtual environment dan menginstal dependensi
    {
      method: "shell.run",
      params: {
        venv: "env", // Virtual environment yang dibuat di direktori utama
        path: ".", // Direktori utama
        message: [
          "which python", 
          "python -m pip install --upgrade pip", 
          "python -m pip install -r requirements.txt || { echo 'Invalid packages in requirements.txt'; exit 1; }",
          "python -m pip check", 
          "uv pip list" // Mengecek apakah dotenv benar-benar terinstal
        ],
      },
    },
    // Menjalankan aplikasi setelah semua dependensi terinstal
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: ".", // Direktori utama proyek
        message: [
          "python -m pip check", // Verifikasi akhir
          "python gepeto_ai.py" // Menjalankan aplikasi utama
        ],
      },
    },
  ],
};
