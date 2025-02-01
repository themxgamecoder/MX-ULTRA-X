const Mute = require('../mxgamecoder/mute'); // Import Mute model
/*const { Admin } = require('../mxgamecoder/admin');*/ // Import Admin model
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling

module.exports = {
  name: 'mutelist', // Command name
  description: 'View a list of muted users.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user ID whose mute status is to be viewed (optional)

    // Check for prefix-related errors before proceeding
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, userText);
    if (isErrorHandled) return; // Stop execution if the error is handled
    
    // Check if the user is registered
    const isRegistered = await Pin.findOne({ userId: chatId.toString() });
    if (!isRegistered) {
      return bot.sendMessage(chatId, '🚫 *You are not registered. Register first to use this command.*');
    }

    // Check if the user is an admin
   /* const isAdmin = await Admin.findOne({ userId: chatId.toString() });
    if (!isAdmin) {
      return bot.sendMessage(chatId, '🚫 *Only admins can use this command.*');
    }*/

    try {
      const mutedUsers = await Mute.find({});
      if (mutedUsers.length === 0) {
        await bot.sendMessage(chatId, '✅ *No users are currently muted.*');
      } else {
        let mutedUsersList = `🔇 *List of muted users:*\n`;
        mutedUsers.forEach((mute, index) => {
          mutedUsersList += `\n${index + 1}. User ID: ${mute.userId} - Mute End: ${mute.muteEnd.toLocaleString()}`;
        });
        await bot.sendMessage(chatId, mutedUsersList);
      }
    } catch (error) {
      console.error('Error retrieving muted users:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while retrieving muted users. Please try again later.*');
    }
  },
};
