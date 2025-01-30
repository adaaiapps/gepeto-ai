const path = require('path');

module.exports = {
  daemon: true,
  run: [
    // Langkah 1: Membuat virtual environment jika belum ada
    {
      method: "shell.run",
      params: {
        message: [
          "python -m venv env"
        ],
      },
    },
    // Langkah 2: Mengaktifkan virtual environment
    {
      method: "shell.run",
      params: {
        message: [
          "{{platform === 'win32' ? 'call env\\\\Scripts\\\\activate' : 'source env/bin/activate'}}"
        ],
      },
    },
    // Langkah 3: Clone repository GitHub
    {
      method: "shell.run",
      params: {
        message: [
          `git clone {{env.GIT_URL}} app`
        ]
      }
    },
    // Langkah 4: Instal dependencies
    {
      method: "shell.run",
      params: {
        message: [
          "python -m pip install --upgrade pip",
          "{{platform === 'win32' ? 'python -m pip install -r requirements.txt' : 'python3 -m pip install -r requirements.txt'}}"
        ],
        path: "app"
      }
    },
    // Langkah 5: Jalankan aplikasi
    {
      method: "shell.run",
      params: {
        message: [
          "python app.py"
        ],
        path: "app",
        on: [{
          "event": "/http:\/\/\\S+/",
          "done": true
        }]
      }
    },
    // Langkah 6: Setel variabel lokal 'url'
    {
      method: "local.set",
      params: {
        url: "{{input.event[0]}}"
      }
    }
  ]
};
