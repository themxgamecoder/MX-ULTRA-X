const { botName, adminChatId } = require('../settings'); // Import bot name and adminChatId
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model to check registration

module.exports = {
  name: 'removeadmin', // Command name
  description: 'Remove a user as an admin.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user to remove as an admin

    const isAdmin = await Admin.findOne({ userId: chatId.toString() }); // Check if the sender is in the admin list
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, msg.text.trim());
    if (isErrorHandled) return; // Stop execution if the error is handled

    if (!isAdmin) {
      console.log(`User ${chatId} is not an admin.`); // Debug log
      return await bot.sendMessage(chatId, `❌ *You are not authorized to use this command.*`);
    }

    const userExists = await Pin.findOne({ userId });
    if (!userExists) {
      return await bot.sendMessage(chatId, `❌ *User with ID ${userId} does not exist or is not registered.*`);
    }

    try {
      // Prevent removing main admin (adminChatId)
      if (userId === adminChatId) {
        return await bot.sendMessage(chatId, `❌ *This admin cannot be removed.*`);
      }

      // Allow removal only if the request comes from the main admin (adminChatId)
      if (chatId.toString() !== adminChatId) {
        return await bot.sendMessage(chatId, `❌ *Only the main admin (${adminChatId}) can remove admins.*`);
      }

      const adminToRemove = await Admin.findOne({ userId });
      if (adminToRemove) {
        await Admin.deleteOne({ userId });
        await bot.sendMessage(chatId, `❌ *User with ID ${userId} has been removed from admins.*`);
        await bot.sendMessage(userId, `❌ *You have been removed as an admin of ${botName}.*`);
      } else {
        await bot.sendMessage(chatId, `⚠️ *User with ID ${userId} is not an admin.*`);
      }
    } catch (error) {
      console.error('Error removing admin:', error);
      await bot.sendMessage(chatId, `❌ *An error occurred while removing the admin. Please try again later.*`);
    }
  },
};
