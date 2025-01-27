const { botName } = require('../settings');
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Import the prefix error handling function

module.exports = {
  name: 'support', // Command name
  description: 'Share WhatsApp channel, Telegram group links, and contact Telegram.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text;

    // Check if the user is registered before allowing the command
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, userText);
    if (isErrorHandled) return; // If an error was handled, stop further processing

    const message = `
✨ *Hey there, amazing human!* ✨  
💌 Here are some exclusive links to stay connected with *${botName}* and my awesome creator, *@mxgamecoder*! 💖  

🌐 *Join my official channels*:  
📢 *WhatsApp Channel*: [Click here to join](https://whatsapp.com/channel/0029Vavz0e6E50Ugp30Z6z0W) 🟢  
📢 *Telegram Group*: [Click here to join](https://t.me/mxgamecoderr) 🔵  

💬 *Need help or want to chat?*  
Feel free to contact me directly on Telegram: [@mxgamecoder](https://t.me/mxgamecoder) 📨  

💬 Can't wait to see you there! Let's create magic together! 🎉  
❤️ Love, hugs, and coding vibes,  
_${botName}_ 🌹
    `;

    // Send the links message
    await bot.sendMessage(chatId, message, {
      parse_mode: 'Markdown'
    });
  }
};