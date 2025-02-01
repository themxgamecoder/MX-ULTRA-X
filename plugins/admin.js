const { botName, botCreator } = require('../settings'); // Import bot name and creator
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling

module.exports = {
  name: 'admin', // Command name
  description: 'Launch the admin dashboard.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    console.log(`Admin dashboard requested by chat ID: ${chatId}`); // Debug log
    
    const isAdmin = await Admin.findOne({ userId: chatId.toString() }); // Check if the sender is in the admin list
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, msg.text.trim());
    if (isErrorHandled) return; // Stop execution if the error is handled

    if (!isAdmin) {
      console.log(`User ${chatId} is not an admin.`); // Debug log
      return await bot.sendMessage(chatId, `❌ *You are not authorized to use this command.*`);
    }

    const dashboardMessage = `
    📋 *Dashboard of ${botName}* 🌟
    
    ✨ *Available Admin Commands:*
    - addadmin <userId> ➕ Add a user as an admin
    - removeadmin <userId> ❌ Remove an admin
    - checkadmin <userId> ✅ Check if a user is an admin
    - ban <userId> <reason> 🚫 Ban a user (reason required)
    - unban <userId> <reason> ✅ Unban a user (reason required)
    
    👤 *Bot Creator:* ${botCreator} 💖
    `;
    await bot.sendMessage(chatId, dashboardMessage);
  },
};
