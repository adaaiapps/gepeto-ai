const path = require('path')
module.exports = {
  version: "2.0",
  title: "Gepeto AI",
  description: "AI-powered app launcher generator for Pinokio.",
  icon: "icon.jpeg",
  menu: async (kernel, info) => {
    let running = {
      start: info.running("start.js"),
      update: info.running("update.js"),
      reset: info.running("reset.js")
    }
    if (running.start) {
      let local = info.local("start.js")
      if (local && local.url) {
        return [{
          default: true,
          icon: "fa-solid fa-rocket",
          text: "Open Web UI",
          href: local.url,
        }, {
          icon: 'fa-solid fa-terminal',
          text: "Terminal",
          href: "start.js",
        }]
      } else {
        return [{
          default: true,
          icon: 'fa-solid fa-terminal',
          text: "Terminal",
          href: "start.js",
        }]
      }
    } else if (running.update) {
      return [{
        default: true,
        icon: 'fa-solid fa-terminal',
        text: "Updating",
        href: "update.js",
      }]
    } else if (running.reset) {
      return [{
        default: true,
        icon: 'fa-solid fa-terminal',
        text: "Resetting",
        href: "reset.js",
      }]
    } else {
      return [{
        default: true,
        icon: "fa-solid fa-power-off",
        text: "Start",
        href: "start.js",
      }, {
        icon: "fa-solid fa-plug",
        text: "Update",
        href: "update.js",
      }, {
        icon: "fa-regular fa-circle-xmark",
        text: "Reset",
        href: "reset.js",
      }]
    }
  }
}
