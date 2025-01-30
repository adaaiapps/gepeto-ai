module.exports = {
  version: "2.0",
  title: "Gepeto",
  description: "Generate Pinokio Launchers, Instantly. https://gepeto.pinokio.computer",
  icon: "icon.jpeg",
  menu: async (kernel, info) => {
    let running = info.running("start.js")
    if (running) {
      // display html button
      // display start.js button
      return [{
        icon: 'fa-solid fa-terminal',
        text: "Terminal",
        href: "start.js",
      }]
    } else {
      // display html button
      return [{
        icon: "fa-solid fa-rocket",
        text: "Gepeto",
        href: "start.js",
      }, {
        icon: "fa-solid fa-plug",
        text: "Update",
        href: "update.js"
      }]
    }
  }
}
