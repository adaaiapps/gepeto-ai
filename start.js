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
    // Mengaktifkan virtual environment dan menginstal dependensi menggunakan uv pip
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "gepeto_ai",
        message: [
          "uv pip install --upgrade pip", 
          "uv pip install -r requirements.txt", 
          "uv pip install python-dotenv", 
          "uv pip install langchain_community"
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
          "python gepeto_ai.py"
        ],
      },
    },
  ],
};
