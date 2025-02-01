const { EventEmitter } = require('events');

module.exports = {
  run: [
    {
      method: "shell.run",
      params: {
        venv: "env",
        venv_python: "3.11",
        path: ".",  // Atur ke current directory (root folder)
        message: [
          "pip install -r requirements.txt"
        ]
      }
    },
    {
      method: "shell.run",
      params: {
        path: ".",
        message: [
          "pip install python-dotenv"
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
