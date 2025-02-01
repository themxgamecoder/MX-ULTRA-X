const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model to check registration
const { botName, defaultPrefix} = require('../settings');

module.exports = {
  name: 'announce',
  description: 'Send an important announcement to all admins.',
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

    // Check if the user is an admin
    const isAdmin = await Admin.findOne({ userId: chatId.toString() });
    if (!isAdmin) {
      return bot.sendMessage(chatId, '🚫 *Only admins can use this command.*');
    }

    // Extract the announcement message
    const announcementMessage = userText.slice('/announce'.length).trim();

    if (!announcementMessage) {
      return bot.sendMessage(
        chatId,
        `✳️ *Please provide an announcement message.*\n\n📌 Example: ${defaultPrefix}announce Important update.`
      );
    }

    try {
      const admins = await Admin.find({});
      if (admins.length === 0) {
        return bot.sendMessage(chatId, '❌ *No admins found to send the announcement.*');
      }

      for (const admin of admins) {
        await bot.sendMessage(admin.userId, `📢 *Announcement:*\n\n${announcementMessage}`);
      }

      await bot.sendMessage(chatId, `✅ *Announcement sent successfully to all admins.*\n\n💡 Powered by *${botName}*!`);
    } catch (error) {
      console.error('Error sending announcement:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while sending the announcement. Please try again later.*');
    }
  },
};
