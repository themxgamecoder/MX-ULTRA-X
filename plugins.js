const fs = require('fs');
const path = require('path');
const { defaultPrefix } = require('./settings');
const { Ban } = require('./mxgamecoder/admin'); // Import Ban model to check ban status
const Mute = require('./mxgamecoder/mute'); // Import Mute model to check mute status

let commands = {};

// Load commands dynamically from the plugins folder
function loadCommands() {
  const pluginsPath = path.join(__dirname, 'plugins');
  const pluginFiles = fs.readdirSync(pluginsPath).filter(file => file.endsWith('.js'));

  for (const file of pluginFiles) {
    const command = require(path.join(pluginsPath, file));
    if (command.name) {
      // Register the command with the prefix
      commands[defaultPrefix + command.name] = command.execute;
    }
  }

  console.log('Commands loaded:', Object.keys(commands));
}

// Handle incoming commands
async function handleCommand(bot, msg) {
  const chatId = msg.chat.id;
  const userText = msg.text.trim();

  // Check if the user is banned
  const isBanned = await Ban.findOne({ userId: chatId.toString() });
  if (isBanned) {
    bot.sendMessage(chatId, `🚫 *You are banned and cannot use any commands.* Reason: ${isBanned.reason}`);
    return;
  }

  // Check if the user is muted
  const isMuted = await Mute.findOne({ userId: chatId.toString(), muteEnd: { $gt: new Date() } });
  if (isMuted) {
    bot.sendMessage(chatId, `🔇 *You are muted and cannot use any commands until ${isMuted.muteEnd.toLocaleTimeString()}.*`);
    return;
  }

  // Check if the message starts with the default prefix
  if (userText.startsWith(defaultPrefix)) {
    // Remove the prefix to get the command name
    const commandName = userText.slice(defaultPrefix.length).split(' ')[0];  // Extract the command without the prefix

    // Execute the command if it exists
    if (commands[defaultPrefix + commandName]) {
      try {
        // Execute the command associated with the commandName
        commands[defaultPrefix + commandName](bot, msg);
      } catch (error) {
        bot.sendMessage(chatId, 'Oops! Something went wrong while executing the command. 😓');
        console.error('Error executing command:', error);
      }
    } else {
      bot.sendMessage(chatId, `Unknown command! Use "${defaultPrefix}help" for a list of commands. 🤔`);
    }
  }
}

module.exports = { loadCommands, handleCommand };
