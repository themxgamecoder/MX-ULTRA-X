const { botName } = require('../settings');
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Import the prefix error handling function

module.exports = {
  name: 'alive', // Command name
  description: 'Shows the bot status with a fun and sweet message.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text;

    // Check if the user is registered before allowing the command
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, userText);
    if (isErrorHandled) return; // Stop further processing if the error was handled

    const aliveMessage = `
✨ *Hello there, lovely human!* ✨  
🌈 I'm *${botName}* — your always-active, super-sweet companion! 💖  

💡 *Status*: I'm alive and kicking! 🚀  
🎉 Ready to serve you with a sprinkle of magic and love! 😘  

📸 *Feeling curious? Here's a picture of me just for you!* 😍  
💬 Send me a command or just say hi — I'm here to make your day brighter! 💌  

*Stay awesome and never forget, you're amazing!* 🌟  
🧡 With endless love,  
_${botName}_ 🌹
    `;

    const aliveImageUrl = 'https://i.ibb.co/WtpYwmX/C.jpg'; // The alive image URL

    try {
      // Send the alive message with the image
      const sentMessage = await bot.sendPhoto(chatId, aliveImageUrl, {
        caption: 'Loading... 🕒',
        parse_mode: 'Markdown',
      });

      // Edit the caption after sending
      await bot.editMessageCaption(aliveMessage, {
        chat_id: chatId,
        message_id: sentMessage.message_id,
        parse_mode: 'Markdown',
      });
    } catch (error) {
      console.error('Error sending alive message:', error);
      bot.sendMessage(
        chatId,
        `Oops! 😢 Something went wrong while showing my status. Please try again later. 💔`
      );
    }
  },
};
