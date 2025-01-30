const path = require('path');

module.exports = {
  daemon: true,
  run: [
    // Langkah 1: Jalankan backend
    {
      method: "shell.run",
      params: {
        message: [
          "python {{env.PROJECT_NAME ? env.PROJECT_NAME : 'app'}}.py",
        ],
        path: "app",
        on: [{
          "event": "/Gepeto is up and running/i",
          "done": true
        }]
      }
    },
    // Langkah 2: Jalankan frontend
    {
      method: "shell.run",
      params: {
        path: "app/ui",
        message: "npm run start",
        on: [{ "event": "/http:\/\/\\S+/", "done": true }]
      }
    },
    // Langkah 3: Setel variabel lokal 'url'
    {
      method: "local.set",
      params: {
        url: "{{input.event[0]}}"
      }
    },
  ],
};
