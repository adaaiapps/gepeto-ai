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
          "env\\Scripts\\activate" // Untuk Windows
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
