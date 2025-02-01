const { Pin } = require('../mxgamecoder/pin'); // Import Pin model
const { getUsername } = require('../mxgamecoder/username'); // For retrieving usernames
const { botName, defaultPrefix } = require('../settings'); // Import bot name
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Prefix error handling
const { Admin } = require('../mxgamecoder/admin'); // Import Admin model

module.exports = {
  name: 'broadcast',
  description: 'Send a broadcast message to all users in the bot.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();

    // Check if the user is registered
    const isRegistered = await Pin.findOne({ userId: chatId.toString() });
    if (!isRegistered) {
      return bot.sendMessage(chatId, '🚫 *You are not registered. Register first to use this command.*');
    }

    // Check for prefix-related errors before proceeding
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, msg.text);
    if (isErrorHandled) return; // Stop execution if the error is handled

    // Check if the user is an admin
    const isAdmin = await Admin.findOne({ userId: chatId.toString() });
    if (!isAdmin) {
      return bot.sendMessage(chatId, '🚫 *Only admins can use this command.*');
    }

    // Extract the message to broadcast
    const broadcastMessage = userText.slice(defaultPrefix.length + 'broadcast'.length).trim();

    if (!broadcastMessage) {
      return bot.sendMessage(
        chatId,
        `✳️ *Please provide a message to broadcast.*\n\n📌 Example: ${defaultPrefix}broadcast Thank you all for using ${botName}!`
      );
    }

    try {
      // Get all user IDs from the Pin model (retrieving userId from the document)
      const users = await Pin.find({}, { userId: 1, _id: 0 }); // Fetch userId only

      if (users.length === 0) {
        return bot.sendMessage(chatId, '❌ *No users found to broadcast the message.*');
      }

      // Notify admin about the broadcast process
      await bot.sendMessage(chatId, `📢 *Broadcasting message to ${users.length} users...*`);

      for (const user of users) {
        try {
          const username = await getUsername(user.userId); // Retrieve username for personalization
          const personalizedMessage = username
            ? `💌 *Hey ${username},*\n\n${broadcastMessage}`
            : `💌 *Hello,*\n\n${broadcastMessage}`;

          await bot.sendMessage(user.userId, personalizedMessage);
        } catch (err) {
          console.error(`Failed to send message to user ${user.userId}:`, err);
        }
      }

      // Confirm broadcast completion
      await bot.sendMessage(chatId, `✅ *Broadcast completed successfully to ${users.length} users.*`);
    } catch (error) {
      console.error('Error during broadcast:', error);
      await bot.sendMessage(chatId, '❌ *An error occurred while broadcasting the message.*');
    }
  },
};
