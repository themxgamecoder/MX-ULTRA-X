const Warn = require('../mxgamecoder/warn'); // Import Warn model
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { botName, defaultPrefix } = require('../settings');

module.exports = {
  name: 'warn', // Command name
  description: 'Issue a warning to a user and keep track of their warnings.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user ID to warn
    const warningMessage = commandArgs.slice(2).join(' '); // The warning message

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

    if (!userId || !warningMessage) {
      return bot.sendMessage(chatId, `❗ *Please provide a valid user ID and a warning message.* Example: ${defaultPrefix}warn 123456 This is your first warning.`);
    }

    const userExists = await Pin.findOne({ userId });
    if (!userExists) {
      return bot.sendMessage(chatId, `❌ *User with ID ${userId} does not exist or is not registered.*`);
    }

    try {
      const newWarn = new Warn({ userId, message: warningMessage });
      await newWarn.save();
      await bot.sendMessage(chatId, `⚠️ *User with ID ${userId} has been warned.*`);
      await bot.sendMessage(userId, `⚠️ *You have received a warning:* ${warningMessage}\n\n👤 Bot Name: ${botName} 💖`);
    } catch (error) {
      console.error('Error warning user:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while warning the user. Please try again later.*');
    }
  },
};
