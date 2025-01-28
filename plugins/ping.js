const { botName } = require('../settings');
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Import the prefix error handling function

module.exports = {
  name: 'ping', // Command name
  description: 'Responds with the bot’s ping in milliseconds to test responsiveness.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text;

    // Check for prefix-related errors before proceeding
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, userText);
    if (isErrorHandled) return; // Stop execution if the error is handled

    try {
      // Capture the time before sending the initial message
      const startTime = Date.now();

      // Send an initial "Pinging..." message
      const initialMessage = await bot.sendMessage(chatId, 'Pinging... 🕒');

      // Capture the time after sending the message
      const endTime = Date.now();
      const ping = endTime - startTime; // Calculate the ping duration

      // Edit the message to display the ping and bot status
      await bot.editMessageText(
        `🏓 *Pong!*  
📡 *Ping*: \`${ping}ms\`  
✨ *Bot*: ${botName} is up and running smoothly! 🚀`,
        {
          chat_id: chatId,
          message_id: initialMessage.message_id,
          parse_mode: 'Markdown',
        }
      );
    } catch (error) {
      console.error('Error executing ping command:', error);

      // Inform the user about the error in a friendly way
      await bot.sendMessage(chatId, `Oops! 😔 Something went wrong while calculating the ping. Please try again!`);
    }
  },
};
