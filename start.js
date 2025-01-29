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
    // Mengaktifkan virtual environment dan menginstal dependensi
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: "gepeto_ai",
        message: [
          "pip install --upgrade pip", 
          "pip install -r requirements.txt", 
          "pip install python-dotenv"
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
