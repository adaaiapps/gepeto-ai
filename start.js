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
    // Mengaktifkan virtual environment dan menambahkan API Key ke file .env
    {
      method: "shell.run",
      params: {
        path: ".", // Direktori utama proyek
        message: [
          "echo API_KEY={{api_key}} >> .env",
          "echo LLM_TYPE={{llm_type}} >> .env",
        ],
      },
    },
    // Menginstal dependensi dan menjalankan aplikasi
    {
      method: "shell.run",
      params: {
        venv: "env", // Virtual environment yang dibuat di direktori utama
        path: ".", // Direktori utama
        message: [
          "python -m pip install --upgrade pip",
          "python -m pip install -r requirements.txt",
        ],
      },
    },
    {
      method: "shell.run",
      params: {
        venv: "env",
        path: ".",
        message: "python gepeto_ai.py",
      },
    },
  ],
};
