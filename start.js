const { exec } = require('child_process');
const path = require('path');
const fs = require('fs');

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
    // Langkah 1: Jalankan script Python
    {
      method: "shell.run",
      params: {
        message: `python gepeto_ai.py`,
        env: {
          GIT_URL: GIT_URL,
          API_KEY: API_KEY,
          LLM_TYPE: LLM_TYPE,
          PINOKIO_HOME: PINOKIO_HOME,
          PROJECT_NAME: PROJECT_NAME,
          ICON_URL: ICON_URL
        }
      },
    },
    // Langkah 2: Start the generated app
     {
      method: "script.start",
      params: {
        uri: `${path.join(PINOKIO_HOME, 'api', PROJECT_NAME ? PROJECT_NAME : 'generated_app', 'start.js')}`
      }
    },
    {
      method: "script.start",
      params: {
         uri: `${path.join(PINOKIO_HOME, 'api', PROJECT_NAME ? PROJECT_NAME : 'generated_app', 'pinokio.js')}`
      }
    }
  ],
};
