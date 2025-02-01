const { Ban } = require('../mxgamecoder/admin'); // Import Ban model
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model to check registration
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model

module.exports = {
  name: 'unban', // Command name
  description: 'Unban a user with a reason.',
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
    const userId = commandArgs[1]; // The user to unban
    const reason = commandArgs.slice(2).join(' '); // The reason for unbanning

    try {
      if (!userId || !reason) {
        return await bot.sendMessage(chatId, `❗ *Please provide a valid user ID and reason.* Example: .unban 7150558583 he is forgiven`);
      }

      const userExists = await Pin.findOne({ userId });
      if (!userExists) {
        return await bot.sendMessage(chatId, `❌ *User with ID ${userId} does not exist or is not registered.*`);
      }

      const banToRemove = await Ban.findOne({ userId });
      if (banToRemove) {
        await Ban.deleteOne({ userId });
        await bot.sendMessage(chatId, `✅ *User with ID ${userId} has been unbanned.* Reason: ${reason}`);
        await bot.sendMessage(userId, `✅ *You have been unbanned.* Reason: ${reason}`);
      } else {
        await bot.sendMessage(chatId, `⚠️ *User with ID ${userId} is not banned.*`);
      }
    } catch (error) {
      console.error('Error unbanning user:', error);
      await bot.sendMessage(chatId, `❌ *An error occurred while unbanning the user. Please try again later.*`);
    }
  },
};
