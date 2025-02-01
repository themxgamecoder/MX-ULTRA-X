const { exec } = require('child_process');
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling

module.exports = {
  name: 'update', // Command name
  description: 'Update the bot\'s repository and install dependencies.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();

    // Check for prefix-related errors before proceeding
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, userText);
    if (isErrorHandled) return; // Stop execution if the error is handled
    
    // Check if the user is registered
    const isRegistered = await Pin.findOne({ userId: chatId.toString() });
    if (!isRegistered) {
      return bot.sendMessage(chatId, '🚫 *You are not registered. Register first to use this command.*');
    }

    // Check if the user is an admin
    const isAdmin = await Admin.findOne({ userId: chatId.toString() });
    if (!isAdmin) {
      return bot.sendMessage(chatId, '🚫 *Only admins can use this command.*');
    }

    await bot.sendMessage(chatId, '⬇️ *Updating the bot...*');
    
    exec('git pull && npm install', { cwd: path.join(__dirname, '../plugins') }, (error, stdout, stderr) => {
      if (error) {
        console.error(`Error updating bot: ${stderr}`);
        return bot.sendMessage(chatId, `❌ *An error occurred while updating the bot.*\n\nError: ${stderr}`);
      }
      console.log(`Bot updated: ${stdout}`);
      bot.sendMessage(chatId, '✅ *Bot updated successfully.*');
    });
  },
};
