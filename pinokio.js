const path = require('path');
const { EventEmitter } = require('events');

module.exports = {
  version: "2.0",
  title: "gepeto",
  description: "Generate Pinokio Launchers, Instantly. https://gepeto.pinokio.computer",
  icon: "icon.jpeg",
  menu: async (kernel, info) => {
    const emitter = new EventEmitter();
    
    // Periksa status instalasi
    const installed = info.exists("./env");
    const running = {
      install: info.running("install.js"),
      start: info.running("start.js"),
    };

    if (running.install) {
      // Jika instalasi sedang berlangsung, tampilkan pesan instalasi
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Installing",
        href: "install.js",
      }];
    } else if (installed) {
      if (running.start) {
        // Jika proses start sedang berlangsung, tampilkan terminal
        return [{
          default: true,
          icon: 'fa-solid fa-terminal',
          text: "Terminal",
          href: "start.js",
        }];
      } else {
        // Jika sudah terinstall tapi belum start, mulai proses start
        return [{
            icon: "fa-solid fa-power-off",
            text: "Start",
            href: "start.js",
          }];
      }
    } else {
      // Jika belum terinstall, tampilkan tombol install
      return [{
        default: true,
        icon: "fa-solid fa-plug",
        text: "Install",
        href: "install.js",
      }];
    }
  }
};
