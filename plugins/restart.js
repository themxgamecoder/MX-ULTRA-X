const { exec } = require('child_process');
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { botName } = require('../settings'); // Import bot settings

module.exports = {
  name: 'restart', // Command name
  description: 'Safely restart the bot.',
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

    await bot.sendMessage(chatId, `🔄 *Restarting the ${botName}...*`);

    exec('pm2 restart mx-ultra-x-bot', (error, stdout, stderr) => {
      if (error) {
        console.error(`Error restarting bot: ${stderr}`);
        return bot.sendMessage(chatId, `❌ *An error occurred while restarting the bot.*\n\nError: ${stderr}`);
      }
      console.log(`Bot restarted: ${stdout}`);
      bot.sendMessage(chatId, '✅ *Restart done.*');
    });
  },
};
