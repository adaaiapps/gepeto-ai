const fs = require('fs');
const path = require('path');

// Baca file ENVIRONMENT
const env = fs.readFileSync('ENVIRONMENT', 'utf8');
const envLines = env.split('\n');

// Pilih variabel yang dibutuhkan
let GIT_URL = '';
let API_KEY = '';
let LLM_TYPE = 'openai';
let PINOKIO_HOME = '/PINOKIO_HOME';
let PROJECT_NAME = '';
let ICON_URL = '';

envLines.forEach(line => {
  if (line.startsWith('GIT_URL=')) {
    GIT_URL = line.replace('GIT_URL=', '').trim();
  } else if (line.startsWith('API_KEY=')) {
    API_KEY = line.replace('API_KEY=', '').trim();
  } else if (line.startsWith('LLM_TYPE=')) {
    LLM_TYPE = line.replace('LLM_TYPE=', '').trim();
  } else if (line.startsWith('PINOKIO_HOME=')) {
    PINOKIO_HOME = line.replace('PINOKIO_HOME=', '').trim();
  } else if (line.startsWith('PROJECT_NAME=')) {
    PROJECT_NAME = line.replace('PROJECT_NAME=', '').trim();
  } else if (line.startsWith('ICON_URL=')) {
    ICON_URL = line.replace('ICON_URL=', '').trim();
  }
});

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
          `git clone ${GIT_URL} app`
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
}
