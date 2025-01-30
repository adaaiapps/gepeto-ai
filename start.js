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
          "echo API_KEY=<api_key> >> .env",
          "echo LLM_TYPE=<llm_type> >> .env",
        ],
        replace: {
          "<api_key>": "{{api_key}}",
          "<llm_type>": "{{llm_type}}",
        },
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
          "python -m pip install -r requirements.txt || { echo 'Invalid packages in requirements.txt'; exit 1; }",
          "python gepeto_ai.py" // Menjalankan aplikasi utama
        ],
      },
    },
  ],
};
