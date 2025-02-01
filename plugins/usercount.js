const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling

module.exports = {
  name: 'usercount', // Command name
  description: 'Check and display the number of users in the bot.',
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

    try {
      const userCount = await Pin.countDocuments({});
      await bot.sendMessage(chatId, `👥 *Total number of users in the bot: ${userCount}*`);
    } catch (error) {
      console.error('Error counting users:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while counting the users. Please try again later.*');
    }
  },
};
