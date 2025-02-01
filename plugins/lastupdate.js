/*const fs = require('fs');
const path = require('path');
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model

module.exports = {
  name: 'lastupdate', // Command name
  description: 'Check the last update of the bot.',
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

    const logFilePath = path.join(__dirname, '../mxgamecoder/updateLog.json');
    if (!fs.existsSync(logFilePath)) {
      return bot.sendMessage(chatId, '❌ *No update log found.*');
    }

    const logData = JSON.parse(fs.readFileSync(logFilePath, 'utf-8'));
    if (logData.length === 0) {
      return bot.sendMessage(chatId, '❌ *No updates have been logged yet.*');
    }

    const lastUpdate = logData[logData.length - 1];
    const lastUpdateMessage = `
📅 *Last Update:*
- Date: ${new Date(lastUpdate.date).toLocaleString()}
- Executed By: ${lastUpdate.executedBy || 'Unknown'}
- Details: ${lastUpdate.details}
    `;

    bot.sendMessage(chatId, lastUpdateMessage);
  },
};
*/