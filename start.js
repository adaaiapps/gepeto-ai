const path = require('path');
const fs = require('fs');

module.exports = {
  daemon: true,
  run: [
    // Langkah 1: Cari file python utama
    {
      method: "shell.run",
      params: {
        message: [
          "ls app"
        ],
      },
    },
    {
      method: "local.set",
      params: {
        main_py: "{{input.stdout.split('\\n').find(file => file.endsWith('.py')) || 'app.py'}}"
      }
    },
    // Langkah 2: Jalankan backend
    {
      method: "shell.run",
      params: {
        message: [
          "python {{local.main_py}}",
        ],
        path: "app",
        on: [{
          "event": "/Devika is up and running/i",
          "done": true
        }]
      }
    },
    // Langkah 3: Jalankan frontend
    {
      method: "shell.run",
      params: {
        path: "app/ui",
        message: "npm run start",
        on: [{ "event": "/http:\/\/\\S+/", "done": true }]
      }
    },
    // Langkah 4: Setel variabel lokal 'url'
    {
      method: "local.set",
      params: {
        url: "{{input.event[0]}}"
      }
    },
  ],
};
