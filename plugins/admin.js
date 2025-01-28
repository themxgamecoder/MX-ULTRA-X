const { botName, botCreator, defaultPrefix } = require('../settings'); // Import bot name and creator
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Assuming prefix error handling exists
const { Admin, Ban } = require('../mxgamecoder/admin'); // Import MongoDB Admin and Ban models

module.exports = {
  name: 'admin', // Command name
  description: 'Admin commands to manage users, view dashboard, and manage bans.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text;
    const isAdmin = await Admin.findOne({ userId: chatId.toString() }); // Check if the sender is in the admin list

    // Check for prefix-related errors before proceeding
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, userText);
    if (isErrorHandled) return; // Stop execution if the error is handled

    // If user is not an admin, deny access to the command
    if (!isAdmin) {
      return await bot.sendMessage(chatId, `❌ *You are not authorized to use this command.*`);
    }

    const commandArgs = userText.split(' ');
    const action = commandArgs[1]; // The action (add, remove, check, etc.)
    const userId = commandArgs[2]; // The user to add/remove/check

    try {
      if (action === 'add' && userId) {
        // Add user to the MongoDB admin list
        const existingAdmin = await Admin.findOne({ userId });
        if (existingAdmin) {
          await bot.sendMessage(chatId, `⚠️ *User with ID ${userId} is already an admin.*`);
        } else {
          const newAdmin = new Admin({ userId });
          await newAdmin.save();
          await bot.sendMessage(chatId, `✅ *User with ID ${userId} has been added as an admin.*`);
        }
      } else if (action === 'remove' && userId) {
        // Only allow the main admin (ID: 6408716304) to remove admins
        if (chatId.toString() !== '6408716304') {
          return await bot.sendMessage(chatId, `❌ *Only the main admin (ID: 6408716304) can remove admins.*`);
        }

        // Ensure that the main admin cannot be removed
        if (userId === '6408716304') {
          return await bot.sendMessage(chatId, `❌ *You cannot remove the main admin (ID: 6408716304).*`);
        }

        // Remove user from the MongoDB admin list
        const adminToRemove = await Admin.findOne({ userId });
        if (adminToRemove) {
          await Admin.deleteOne({ userId });
          await bot.sendMessage(chatId, `❌ *User with ID ${userId} has been removed from admins.*`);
        } else {
          await bot.sendMessage(chatId, `⚠️ *User with ID ${userId} is not an admin.*`);
        }
      } else if (action === 'check' && userId) {
        // Check if the user is an admin in the MongoDB list
        const isUserAdmin = await Admin.findOne({ userId });
        if (isUserAdmin) {
          await bot.sendMessage(chatId, `✅ *User with ID ${userId} is an admin.*`);
        } else {
          await bot.sendMessage(chatId, `❌ *User with ID ${userId} is not an admin.*`);
        }
      } else if (action === 'ban' && userId) {
        // Ban user from interacting with the bot
        const bannedUser = await Ban.findOne({ userId });
        if (bannedUser) {
          await bot.sendMessage(chatId, `⚠️ *User with ID ${userId} is already banned.*`);
        } else {
          const newBan = new Ban({ userId });
          await newBan.save();
          await bot.sendMessage(chatId, `❌ *User with ID ${userId} has been banned.*`);
        }
      } else if (action === 'unban' && userId) {
        // Unban user and allow them to interact again
        const bannedUser = await Ban.findOne({ userId });
        if (!bannedUser) {
          await bot.sendMessage(chatId, `⚠️ *User with ID ${userId} is not banned.*`);
        } else {
          await Ban.deleteOne({ userId });
          await bot.sendMessage(chatId, `✅ *User with ID ${userId} has been unbanned.*`);
        }
      } else if (action === 'dashboard') {
        // Show the dashboard with available commands
        const dashboardMessage = `
        📋 *Dashboard of ${botName}* 🌟
        
        ✨ *Available Admin Commands:*
        - ${defaultPrefix}admin add <userId>   ➕ Add a user as an admin
        - ${defaultPrefix}admin remove <userId> ❌ Remove an admin
        - ${defaultPrefix}admin check <userId>  ✅ Check if a user is an admin
        - ${defaultPrefix}admin unban <userId>  🔓 Unban a user to allow interaction
        - ${defaultPrefix}admin ban <userId>    🚫 Ban a user from interacting with the bot
        
        👤 *Bot Creator:* ${botCreator} 💖 
        `;
        await bot.sendMessage(chatId, dashboardMessage);
      } else {
        await bot.sendMessage(chatId, `❗ *Invalid command.* Use 'add', 'remove', 'check', 'ban', 'unban', or 'dashboard' followed by the user ID.`);
      }
    } catch (error) {
      console.error('Error executing admin command:', error);
      await bot.sendMessage(chatId, `❌ *An error occurred while processing the request. Please try again later.*`);
    }
  },
};
