const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling

module.exports = {
  name: 'getuser', // Command name
  description: 'Get information about a specific user.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user ID to retrieve information about

    // Check for prefix-related errors before proceeding
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, msg.text.trim());
    if (isErrorHandled) return; // Stop execution if the error is handled
    
    // Check if the user is registered
    const isRegistered = await Pin.findOne({ userId: chatId.toString() });
    if (!isRegistered) {
      return bot.sendMessage(chatId, '🚫 *You are not registered. Register first to use this command.*');
    }

    // Check if the user is an admin
    const isAdmin = await Admin.findOne({ userId: chatId.toString() });
    if (!isAdmin) {
      console.log(`User ${chatId} is not an admin.`); // Debug log
      return await bot.sendMessage(chatId, `❌ *You are not authorized to use this command.*`);
    }

    try {
      const user = await Pin.findOne({ userId });
      if (!user) {
        return bot.sendMessage(chatId, `❌ *User with ID ${userId} does not exist or is not registered.*`);
      }

      let message = '👤 *User Information:*\n\n';
      message += `User ID: ${user.userId}\n`;
      message += `Username: ${user.username}\n`;
      message += `Registered: ${user.registered}\n`;

      await bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error retrieving user information:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while retrieving the user information. Please try again later.*');
    }
  },
};
