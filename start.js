const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

module.exports = {
  daemon: true,
  run: [
    // Membaca variabel lingkungan dari file ENVIRONMENT
    {
      method: "shell.run",
      params: {
        message: [
          "source ENVIRONMENT"
        ],
      },
    },
    // Memeriksa apakah variabel lingkungan yang diperlukan sudah terdefinisi
    {
      method: "shell.run",
      params: {
        message: [
          "if [ -z \"$GIT_URL\" ]; then echo 'Error: GIT_URL is not defined' && exit 1; fi",
          "if [ -z \"$API_KEY\" ]; then echo 'Error: API_KEY is not defined' && exit 1; fi",
          "if [ -z \"$LLM_TYPE\" ]; then echo 'Error: LLM_TYPE is not defined' && exit 1; fi",
        ],
      },
    },
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
    // Mengaktifkan virtual environment
    {
      method: "shell.run",
      params: {
        path: ".", // Direktori utama proyek
        message: [
          "source env/bin/activate" // Untuk Unix/Linux/MacOS
          // "env\\Scripts\\activate" // Untuk Windows
        ],
      },
    },
    // Menginstal dependensi
    {
      method: "shell.run",
      params: {
        path: ".", // Direktori utama proyek
        message: [
          "python -m pip install --upgrade pip",
          "python -m pip install -r requirements.txt",
        ],
      },
    },
    // Menjalankan script Python
    {
      method: "shell.run",
      params: {
        path: ".", // Direktori utama proyek
        message: "python gepeto_ai.py",
      },
    },
  ],
};
