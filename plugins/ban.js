const { Ban } = require('../mxgamecoder/admin'); // Import Ban model
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model to check registration
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model

module.exports = {
  name: 'ban', // Command name
  description: 'Ban a user with a reason.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();

    // Check for prefix-related errors before proceeding
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, userText);
    if (isErrorHandled) return; // Stop execution if the error is handled

    const isAdmin = await Admin.findOne({ userId: chatId.toString() }); // Check if the sender is in the admin list
    if (!isAdmin) {
      return await bot.sendMessage(chatId, `❌ *You are not authorized to use this command.*`);
    }

    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user to ban
    const reason = commandArgs.slice(2).join(' '); // The reason for banning

    try {
      if (!userId || !reason) {
        return await bot.sendMessage(chatId, `❗ *Please provide a valid user ID and reason.* Example: .ban 7150959583 he is rude`);
      }

      const userExists = await Pin.findOne({ userId });
      if (!userExists) {
        return await bot.sendMessage(chatId, `❌ *User with ID ${userId} does not exist or is not registered.*`);
      }

      const existingBan = await Ban.findOne({ userId });
      if (existingBan) {
        await bot.sendMessage(chatId, `⚠️ *User with ID ${userId} is already banned.*`);
      } else {
        const newBan = new Ban({ userId, reason });
        await newBan.save();
        await bot.sendMessage(chatId, `🚫 *User with ID ${userId} has been banned.* Reason: ${reason}`);
        await bot.sendMessage(userId, `🚫 *You have been banned.* Reason: ${reason}`);
      }
    } catch (error) {
      console.error('Error banning user:', error);
      await bot.sendMessage(chatId, `❌ *An error occurred while banning the user. Please try again later.*`);
    }
  },
};
