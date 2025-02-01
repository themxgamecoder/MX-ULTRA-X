const Warn = require('../mxgamecoder/warn'); // Import Warn model
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { botName, defaultPrefix } = require('../settings');

module.exports = {
  name: 'clearwarnings', // Command name
  description: 'Clear all warnings for a specific user.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user ID whose warnings are to be cleared

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

    if (!userId) {
      return bot.sendMessage(chatId, `❗ *Please provide a valid user ID to clear warnings for.* Example: ${defaultPrefix}clearwarnings 123456`);
    }

    const userExists = await Pin.findOne({ userId });
    if (!userExists) {
      return bot.sendMessage(chatId, `❌ *User with ID ${userId} does not exist or is not registered.*`);
    }

    try {
      await Warn.deleteMany({ userId });
      await bot.sendMessage(chatId, `✅ *All warnings for user with ID ${userId} have been cleared.*`);
      await bot.sendMessage(userId, `✅ All your warnings have been cleared.\n\n👤 Bot Name: ${botName} 💖`);
    } catch (error) {
      console.error('Error clearing warnings:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while clearing the warnings. Please try again later.*');
    }
  },
};
