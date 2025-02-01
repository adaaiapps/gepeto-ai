const { EventEmitter } = require('events');

module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env", // Buat virtual environment (opsional)
        path: ".",   // Path ke direktori proyek
        message: [
          "pip install -r requirements.txt", // Instal dependensi dari requirements.txt
          "python -m pip install python-dotenv" // Instal python-dotenv secara manual
        ]
      }
    },
    {
      method: "notify",
      params: {
        html: "Instalasi selesai! Klik tombol Start untuk memulai."
      }
    }
  ],
  emitter: new EventEmitter()
};