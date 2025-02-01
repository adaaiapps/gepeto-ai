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
              "pip install -r requirements.txt"
            ]
          }
        },
        {
          method: "shell.run",
           params: {
            path: ".",
            message: [
              "conda deactivate",
              "SYSTEM_PYTHON=$(if [[ \"${os}\" == \"Windows_NT\" ]]; then where python; else which python; fi)",
              "$SYSTEM_PYTHON -m pip install python-dotenv"
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
