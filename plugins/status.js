const os = require('os');
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling

module.exports = {
  name: 'status', // Command name
  description: 'Retrieve the current status of the bot.',
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

    const uptime = os.uptime();
    const cpuUsage = os.loadavg();
    const memoryUsage = process.memoryUsage();

    const statusMessage = `
    📊 *Bot Status:*
    - Uptime: ${uptime} seconds
    - CPU Usage: ${cpuUsage[0]}% (1 min avg), ${cpuUsage[1]}% (5 min avg), ${cpuUsage[2]}% (15 min avg)
    - Memory Usage: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB RSS, ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB Heap Used
    `;

    await bot.sendMessage(chatId, statusMessage);
  },
};
