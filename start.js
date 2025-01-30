const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

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
    // Mengecek dan membuat file _ENVIRONMENT jika belum ada
    {
      method: "shell.run",
      params: {
        path: ".", // Direktori utama proyek
        message: [
          "echo GIT_URL=your_repository_url > _ENVIRONMENT",
          "echo API_KEY=your_api_key >> _ENVIRONMENT",
          "echo LLM_TYPE=openai >> _ENVIRONMENT", // (opsional, default: openai)
          "echo PINOKIO_HOME=/path/to/pinokio/home >> _ENVIRONMENT", // (opsional, default: /PINOKIO_HOME)
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
