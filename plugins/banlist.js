const Ban = require('../mxgamecoder/admin'); // Import Ban model
/*const { Admin } = require('../mxgamecoder/admin');*/ // Import Admin model
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling

module.exports = {
  name: 'banlist', // Command name
  description: 'View a list of banned users.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user ID whose ban status is to be viewed (optional)

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
      const bannedUsers = await Ban.find({});
      if (bannedUsers.length === 0) {
        await bot.sendMessage(chatId, '✅ *No users are currently banned.*');
      } else {
        let bannedUsersList = `🚫 *List of banned users:*\n`;
        bannedUsers.forEach((ban, index) => {
          bannedUsersList += `\n${index + 1}. User ID: ${ban.userId} - Reason: ${ban.reason}`;
        });
        await bot.sendMessage(chatId, bannedUsersList);
      }
    } catch (error) {
      console.error('Error retrieving banned users:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while retrieving banned users. Please try again later.*');
    }
  },
};
