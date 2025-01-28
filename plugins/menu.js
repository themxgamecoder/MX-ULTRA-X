const { botName } = require('../settings'); // Import botName from settings
const { handlePrefixError } = require('../mxgamecoder/prefix'); // Import prefix error handling function
const path = require('path'); // Import the path module to resolve file path
const sharp = require('sharp'); // Import sharp for image resizing
const fs = require('fs'); // Import fs to check file existence

module.exports = {
  name: 'menu', // Command name
  description: 'Displays the main menu with various categories and options.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text;

    // Check if the user is registered before allowing the command
    const isErrorHandled = await handlePrefixError(bot, msg, chatId, userText);
    if (isErrorHandled) return; // Stop further processing if the error was handled

    // Main menu message with emoji-filled and romantic text
    const menuMessage = `
💖 *Hello, dearest friend!* 💖  
🌟 Welcome to the magical world of *${botName}*! ✨  
💌 I'm here to brighten your day with endless love and fun! 😘  

🏠 *Main Menu:*  
▢ 1️⃣ Download Menu 📥  
▢ 2️⃣ Text Pro Menu ✍️  
▢ 3️⃣ Anime Menu 🍿  
▢ 4️⃣ Bot Menu 🤖  
▢ 5️⃣ Info Menu ℹ️  
▢ 6️⃣ Quotes Menu 💡  
▢ 7️⃣ Tools Menu 🛠️  
▢ 8️⃣ Images Menu 🃏  
▢ 9️⃣ 📋 *Menu*  

🍿 *Anime Menu:*  
▢ 1. Akira  
▢ 2. Akiyama  
▢ 3. Anna  
▢ 4. Asuna  
▢ 5. Ayuzawa  
▢ 6. Boruto  
▢ 7. Chiho  
▢ 8. Chitoge  
▢ 9. Deidara  
▢ 10. Erza  
▢ 11. Elaina  
▢ 12. Eba  
▢ 13. Emilia  
▢ 14. Hestia  
▢ 15. Hinata  
▢ 16. Inori  
▢ 17. Isuzu  
▢ 18. Itachi  
▢ 19. Itori  
▢ 20. Kaga  
▢ 21. Kotori  
▢ 22. Mikasa  
▢ 23. Miku  
▢ 24. Naruto  
▢ 25. Nezuko  
▢ 26. Sagiri  
▢ 27. Sasuke  
▢ 28. Sakura  

🤖 *Bot Menu:*  
▢ 1. Info  
▢ 2. Alive  
▢ 3. Echo  
▢ 4. Menu  
▢ 5. Update  
▢ 6. Shutdown  

ℹ️ *Info Menu:*  
▢ 1. Gstalk  
▢ 2. Igstalk  
▢ 3. Npmstalk  
▢ 4. GetID  
▢ 5. Weather  
▢ 6. Wikipedia  
▢ 7. Wastalk  

💡 *Quotes Menu:*  
▢ 1. Funfacts  
▢ 2. Techtips  
▢ 3. Programmingtips  
▢ 4. Motivational  
▢ 5. Lifehacks  
▢ 6. Islamicquotes  
▢ 7. Quotes  

🛠️ *Tools Menu:*  
▢ 1. Echo  
▢ 2. QR Code Generator  
▢ 3. GetID  
▢ 4. Shutdown  
▢ 5. Translate  
▢ 6. Trends  
▢ 7. YouTube Search  

🃏 *Images Menu:*  
▢ 1. Gimage  
▢ 2. Pinterest  
▢ 3. Blackpink  
▢ 4. Cyberspace  
▢ 5. Technology  
▢ 6. Islamic  
▢ 7. Gamewallp  
▢ 8. Mountain  
▢ 9. Programming  

📥 *Downloads:*  
▢ 1. Gimage  
▢ 2. Gitclone  
▢ 3. Gitdl  
▢ 4. Mediafire  
▢ 5. Mega  
▢ 6. Twitter  
▢ 7. Audio  
▢ 8. Video  
▢ 9. Fbdl  

📥 *TextPro Menu:*  
▢ 1. Papercut  
▢ 2. Logomaker  
▢ 3. BP Style  
▢ 4. Write Text  
▢ 5. Glossy  
▢ 6. Cartoon  
▢ 7. Pixel Glitch  
▢ 8. Advanced Glow  
▢ 9. Light Effect  
▢ 10. Text Effect  
▢ 11. Galaxy  
▢ 12. Beach  
▢ 13. Clouds  

✨ I’m just a command away, ready to make your wishes come true! 🥰💌  
💞 *Stay awesome, because you're loved!* 🌹  
`;

    try {
      // Resize the image
      const imagePath = path.resolve(__dirname, '../UltraMX_bot_assest/mx.jpeg');
      const resizedImagePath = path.resolve(__dirname, '../UltraMX_bot_assest/mx_resized.jpeg');

      // Resize the image using sharp
      await sharp(imagePath)
        .resize(1024, 1024) // Adjust size to fit well with the message (optional)
        .toFile(resizedImagePath);

      // Check if the resized image file exists
      if (!fs.existsSync(resizedImagePath)) {
        console.error('Resized image file not found');
        await bot.sendMessage(chatId, `😢 Oops! The image could not be found! 💔`);
        return;
      }

      // Send the resized image and menu message with inline keyboard
      await bot.sendPhoto(chatId, resizedImagePath);

      const options = {
        parse_mode: 'Markdown',
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: 'Join My Telegram Channel 💬',
                url: 'https://t.me/mxgamecoderr',
              },
            ],
          ],
        },
      };

      await bot.sendMessage(chatId, menuMessage, options);
    } catch (error) {
      console.error('Error sending menu message:', error);
      await bot.sendMessage(
        chatId,
        `😢 Oops! I couldn’t load the menu right now. Please try again later! 💔`
      );
    }
  },
};
