const fs = require('fs');
const path = require('path');
const { defaultPrefix } = require('./settings');

let commands = {};

function loadCommands() {
  const pluginsPath = path.join(__dirname, 'plugins');
  const pluginFiles = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));

  for (const file of pluginFiles) {
    const command = require(path.join(pluginsPath, file));
    if (command.name) {
      commands[defaultPrefix + command.name] = command.execute;
    }
  }

  console.log('Commands loaded:', Object.keys(commands));
}

function handleCommand(bot, msg) {
  const chatId = msg.chat.id;
  const userText = msg.text.trim();

  if (commands[userText]) {
    try {
      commands[userText](bot, msg);
    } catch (error) {
      bot.sendMessage(chatId, 'Oops! Something went wrong while executing the command. 😓');
      console.error('Error executing command:', error);
    }
  } else if (userText.startsWith(defaultPrefix)) {
    bot.sendMessage(chatId, `Unknown command! Use "${defaultPrefix}help" for a list of commands. 🤔`);
  }
}

module.exports = { loadCommands, handleCommand };