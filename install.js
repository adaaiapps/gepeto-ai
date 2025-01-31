const { EventEmitter } = require('events');

module.exports = {
  run: [
    // Edit this step with your custom install commands
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
        message: [
          "pip install -r requirements.txt"
        ]
      }
    },
    //  Uncomment this step to add automatic venv deduplication (Experimental)
    //  {
    //    method: "fs.link",
    //    params: {
    //      venv: "env"
    //    }
    //  },
    {
      method: "notify",
      params: {
        html: "Instalasi selesai! Aplikasi akan dimulai secara otomatis."
      }
    }
  ],
  // Event emitter untuk memberikan sinyal bahwa instalasi selesai
  emitter: new EventEmitter()
};
