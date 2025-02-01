const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model to check registration
const { botName  } = require('../settings');

module.exports = {
  name: 'listadmins', // Command name
  description: 'List all the current admins of the bot.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    
    // Check for prefix-related errors before proceeding
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, msg.text.trim());
    if (isErrorHandled) return; // Stop execution if the error is handled
    
    // Check if the user is registered
    const isRegistered = await Pin.findOne({ userId: chatId.toString() });
    if (!isRegistered) {
      return bot.sendMessage(chatId, '🚫 *You are not registered. Register first to use this command.*');
    }

    try {
      const admins = await Admin.find({});
      if (admins.length === 0) {
        return bot.sendMessage(chatId, '❌ *No admins found.*');
      }

      let message = '👥 *Current Admins:*\n\n';
      admins.forEach((admin, index) => {
        message += `${index + 1}. Admin ID: ${admin.userId}\n\n💡 Powered by *${botName}*!`;
      });

      await bot.sendMessage(chatId, message);
    } catch (error) {
      console.error('Error listing admins:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while listing the admins. Please try again later.*');
    }
  },
};
