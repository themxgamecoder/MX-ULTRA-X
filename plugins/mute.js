const Mute = require('../mxgamecoder/mute'); // Import Mute model
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { botName, defaultPrefix } = require('../settings');

module.exports = {
  name: 'mute', // Command name
  description: 'Temporarily mute a user, preventing them from sending messages for a specified period.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user ID to mute
    const muteDuration = parseInt(commandArgs[2], 10); // The duration to mute the user (in minutes)

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

    if (!userId || isNaN(muteDuration)) {
        return bot.sendMessage(chatId, `❗ *Please provide a valid user ID and mute duration (in minutes).* Example: ${defaultPrefix}mute 123456 10`);
    }

    const userExists = await Pin.findOne({ userId });
    if (!userExists) {
      return bot.sendMessage(chatId, `❌ *User with ID ${userId} does not exist or is not registered.*`);
    }

    try {
      const muteEnd = new Date(Date.now() + muteDuration * 60000); // Calculate mute end time
      const existingMute = await Mute.findOne({ userId });

      if (existingMute) {
        existingMute.muteEnd = muteEnd;
        await existingMute.save();
      } else {
        const newMute = new Mute({ userId, muteEnd });
        await newMute.save();
      }

      await bot.sendMessage(chatId, `🔇 *User with ID ${userId} has been muted for ${muteDuration} minutes.*`);
      await bot.sendMessage(userId, `🔇 You have been muted for ${muteDuration} minutes. You will be able to send messages again after ${muteEnd.toLocaleTimeString()}.\n\n👤 Bot Name: ${botName} 💖`);
    } catch (error) {
      console.error('Error muting user:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while muting the user. Please try again later.*');
    }
  },
};
