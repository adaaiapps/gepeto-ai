const path = require('path')
module.exports = {
  version: "2.0",
  title: "gepeto",
  description: "Generate Pinokio Launchers, Instantly. https://gepeto.pinokio.computer",
  icon: "icon.jpeg",
   pre: [{
    title: "Git Repository URL",
    description: "The URL of the Git repository to analyze",
    env: "GIT_URL"
  }, {
    title: "API Key",
    description: "The API key for the LLM",
    env: "API_KEY"
  }, {
    title: "LLM Type",
    description: "The type of LLM to use (openai, anthropic, google)",
    env: "LLM_TYPE",
    default: "openai"
  }, {
    title: "Pinokio Home",
    description: "The Pinokio home directory",
    env: "PINOKIO_HOME",
    default: "/PINOKIO_HOME"
  }, {
    title: "Project Name",
    description: "The name of the project",
    env: "PROJECT_NAME"
  }, {
    title: "Icon URL",
    description: "The URL of the icon",
    env: "ICON_URL"
  }],
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
