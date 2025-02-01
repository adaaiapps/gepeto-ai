const { EventEmitter } = require('events');

module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.11",
        path: ".",
        message: [
          "pip install -r requirements.txt",
          "python -m pip install python-dotenv"
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