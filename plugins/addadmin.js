const { botName } = require('../settings'); // Import bot name
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { Pin } = require('../mxgamecoder/pin'); // Import Pin model to check registration

module.exports = {
  name: 'addadmin', // Command name
  description: 'Add a user as an admin.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const commandArgs = userText.split(' ');
    const userId = commandArgs[1]; // The user to add as an admin

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
      const existingAdmin = await Admin.findOne({ userId });
      if (existingAdmin) {
        await bot.sendMessage(chatId, `⚠️ *User with ID ${userId} is already an admin.*`);
      } else {
        const newAdmin = new Admin({ userId });
        await newAdmin.save();
        await bot.sendMessage(chatId, `✅ *User with ID ${userId} has been added as an admin.*`);
        await bot.sendMessage(userId, `✅ *Congratulations! You have been added as an admin of ${botName}.*`);
      }
    } catch (error) {
      console.error('Error adding admin:', error);
      await bot.sendMessage(chatId, `❌ *An error occurred while adding the admin. Please try again later.*`);
    }
  },
};
