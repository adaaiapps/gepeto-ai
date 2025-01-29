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
    // Memperbarui pip dan menginstal dependensi utama secara eksplisit
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "gepeto_ai",
        message: [
          "uv pip install --upgrade pip", 
          "uv pip install python-dotenv langchain_community deepseek-ai", 
          "uv pip install -r requirements.txt", 
          "python -m pip check"  // Mengecek apakah semua dependensi terinstal dengan benar
        ],
      },
    },
    // Menjalankan aplikasi setelah instalasi selesai
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
