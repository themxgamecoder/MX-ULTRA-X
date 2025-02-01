const Warn = require('../mxgamecoder/warn'); // Import Warn model
/*const { Admin } = require('../mxgamecoder/admin');*/ // Import Admin model
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { botName, defaultPrefix } = require('../settings');

module.exports = {
  name: 'viewwarnings', // Command name
  description: 'View all warnings for users or a specific user.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user ID whose warnings are to be viewed (optional)

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

    if (userId) {
      const userExists = await Pin.findOne({ userId });
      if (!userExists) {
        return bot.sendMessage(chatId, `❌ *User with ID ${userId} does not exist or is not registered.*`);
      }

      try {
        const warnings = await Warn.find({ userId });

        if (warnings.length === 0) {
          await bot.sendMessage(chatId, `✅ *User with ID ${userId} has no warnings.*`);
        } else {
          let warningsList = `⚠️ *Warnings for user with ID ${userId}:*\n`;
          warnings.forEach((warn, index) => {
            warningsList += `\n${index + 1}. ${warn.message} (Issued on: ${warn.timestamp.toLocaleString()})`;
          });
          await bot.sendMessage(chatId, warningsList);
        }
      } catch (error) {
        console.error('Error retrieving warnings:', error);
        await bot.sendMessage(chatId, '❌ *An error occurred while retrieving warnings. Please try again later.*');
      }
    } else {
      try {
        const warnedUsers = await Warn.distinct('userId');
        if (warnedUsers.length === 0) {
          await bot.sendMessage(chatId, '✅ *No users have been warned.*');
        } else {
          let warnedUsersList = `⚠️ *List of warned users:*\n`;
          for (const id of warnedUsers) {
            const userWarnings = await Warn.find({ userId: id });
            warnedUsersList += `\nUser ID: ${id} - Warnings: ${userWarnings.length}`;
          }
          await bot.sendMessage(chatId, warnedUsersList);
        }
      } catch (error) {
        console.error('Error retrieving warned users:', error);
        await bot.sendMessage(chatId, '❌ *An error occurred while retrieving warned users. Please try again later.*');
      }
    }
  },
};
