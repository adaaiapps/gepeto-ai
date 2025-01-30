const path = require('path')
module.exports = {
  version: "2.0",
  title: "gepeto",
  description: "Generate Pinokio Launchers, Instantly. https://gepeto.pinokio.computer",
  icon: "icon.jpeg",
  menu: async (kernel, info) => {
    let installed = info.exists("app/env")
    if (installed) {
      return [{
        icon: "fa-solid fa-power-off",
        text: "Start",
        href: "start.js",
      }]
    } else {
      return [{
        icon: "fa-solid fa-plug",
        text: "Install",
        href: "install.js",
      }]
    }
  }
}
