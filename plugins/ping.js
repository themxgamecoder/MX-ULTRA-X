const { botName } = require('../settings');
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Import the prefix error handling function

module.exports = {
  name: 'ping', // Command name
  description: 'Responds with the bot’s ping in milliseconds to test responsiveness.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text;

    // Check if the user is registered before allowing the command
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, userText);
    if (isErrorHandled) return; // Stop further processing if the error was handled

    // Capture the time before responding
    const startTime = Date.now();

    // Send an initial message and calculate ping when sending the response
    const initialMessage = await bot.sendMessage(chatId, 'Pinging... 🕒');
    const endTime = Date.now();
    const ping = endTime - startTime; // Calculate ping time

    bot.editMessageText(
      `🏓 Pong!  
📡 *Ping*: \`${ping}ms\`  
✨ Bot: *${botName}* is up and running smoothly! 🚀`,
      {
        chat_id: chatId,
        message_id: initialMessage.message_id,
        parse_mode: 'Markdown',
      }
    );
  },
};