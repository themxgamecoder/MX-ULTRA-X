const Mute = require('../mxgamecoder/mute'); // Import Mute model
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { botName, defaultPrefix } = require('../settings');
module.exports = {
  name: 'unmute', // Command name
  description: 'Unmute a previously muted user, allowing them to send messages again.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user ID to unmute

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
        return bot.sendMessage(chatId, `❗ *Please provide a valid user ID to unmute.* Example: ${defaultPrefix}unmute 123456`);
    }

    const userExists = await Pin.findOne({ userId });
    if (!userExists) {
      return bot.sendMessage(chatId, `❌ *User with ID ${userId} does not exist or is not registered.*`);
    }

    try {
      const muteToRemove = await Mute.findOne({ userId });
      if (muteToRemove) {
        await Mute.deleteOne({ userId });
        await bot.sendMessage(chatId, `🔊 *User with ID ${userId} has been unmuted.*`);
        await bot.sendMessage(userId, `🔊 You have been unmuted and can now send messages again.\n\n👤 Bot Name: ${botName} 💖`);
      } else {
        await bot.sendMessage(chatId, `⚠️ *User with ID ${userId} is not muted.*`);
      }
    } catch (error) {
      console.error('Error unmuting user:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while unmuting the user. Please try again later.*');
    }
  },
};

