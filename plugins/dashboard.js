const axios = require('axios'); // Import axios for API requests
const { botName, botCreator, botVersion } = require('../settings'); // Import bot settings

module.exports = function setupDashboard(bot, chatId) {
  // Fetch a random quote from the API
  axios.get("https://mxgamecoder.onrender.com/fun/quote")
    .then((response) => {
      console.log("API Response: ", response.data); // Log the full response for debugging

      let quote = "No quote available at the moment. Try again later!"; // Default message in case of API failure

      // Check if the API response contains the quote content
      if (response.data && response.data.success && response.data.content) {
        quote = response.data.content; // Assign the actual quote from the response
      }

      // Send dashboard message with a random quote
      bot.sendMessage(chatId,  `🌟 *Hello, my dearest friend!* 🌟\n\n` +
        `💌 Life’s better when we share moments together, isn't it? 🥰 Let’s explore some magical features!\n\n` +
        `💡 *Bot Version:* ${botVersion}\n` +
        `👑 *Brought to you by:* ${botCreator}\n\n` +
        `🔮 *Quote of the Moment:* "${quote}"\n\n` + // Display the fetched quote
        `🌹 *🏠 Main Menu:* 🌹\n\n` +
        ` ▢ 1. 📥 *Download Menu*\n` +
        ` ▢ 2. ✍️ *Text Pro Menu*\n` +
        ` ▢ 3. 🎥 *Ani Menu*\n` +
        ` ▢ 4. 🤖 *Bot Menu*\n` +
        ` ▢ 5. 📜 *Info Menu*\n` +
        ` ▢ 6. 💬 *Quotes Menu*\n` +
        ` ▢ 7. 🛠️ *Tools Menu*\n` +
        ` ▢ 8. 🖼️ *Images Menu*\n\n` +
        `✨ Your wish is my command! Let’s dive in together! 💕`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            keyboard: [
              ["📋 Menu", "👤 Profile", "❓ Help"],
              ["📞 Contact", "📂 Menu2", "🛠️ Support"],
              ["🌀 Clone", "📁 Menu3", "✅ Alive"],
             // ["📜 Random Quote"], // Added button for Random Quote
            ],
            resize_keyboard: true,
            one_time_keyboard: true,
          },
        }
      );
    })
    .catch((error) => {
      console.error("Error fetching quote:", error);
      bot.sendMessage(chatId, "😢 Oops! I couldn't fetch a quote right now. Try again later.");
    });

  // Listen for button presses
  bot.on("message", async (msg) => {
    try {
      if (msg.text === "✅ Alive") {
        // Respond to "Alive" button
        await bot.sendPhoto(
          msg.chat.id,
          "https://i.ibb.co/WtpYwmX/C.jpg", // Your Alive image URL
          {
            caption: `🎉 *${botName} is alive and thriving!*\n\n` +
              `🌟 Bringing sweetness, speed, and power to our chats! 🥰💬\n` +
              `💡 Powered by *${botCreator}*!`,
            parse_mode: "Markdown",
          }
        );
      } /*else if (msg.text === "📜 Random Quote") {
        // Fetch and respond with a random quote
        const response = await axios.get("https://mxgamecoder.onrender.com/fun/quote");
        console.log("API Response (Random Quote): ", response.data); // Log the response for debugging

        let quote = "No quote available at the moment. Try again later!"; // Default message
        if (response.data && response.data.success && response.data.content) {
          quote = response.data.content;
        }

        await bot.sendMessage(msg.chat.id, `💡 *Here's your random quote!*\n\n"${quote}"`, {
          parse_mode: "Markdown",
        });
      }*/ else if (msg.text === "📞 Contact") {
        // Respond to "Contact" button with your contact information
        await bot.sendMessage(msg.chat.id, `📱 *Contact Information:*\n\n` +
          `Feel free to reach out for any queries or support!\n\n` +
          `📧 Email: support@example.com\n` +
          `🌐 Website: https://www.example.com`);
      } else if (msg.text === "🛠️ Support") {
        // Respond to "Support" button with troubleshooting info
        await bot.sendMessage(msg.chat.id, `🛠️ *Need Help?*\n\n` +
          `If you're facing any issues, feel free to ask! Here are some tips to get started:\n\n` +
          `1️⃣ If you're having trouble with commands, try typing them clearly.\n` +
          `2️⃣ If the bot is not responding, check your internet connection.\n` +
          `3️⃣ For any other issues, contact the support team via the "📞 Contact" button.`);
      } else if (msg.text === "📋 Menu") {
        // Send back the main menu if the "Menu" button is pressed
        await bot.sendMessage(msg.chat.id, `✨ *Here are some awesome features you can try:*\n\n` +
          `📋 1. *Download Menu*\n` +
          `✍️ 2. *Text Pro Menu*\n` +
          `🎥 3. *Ani Menu*\n` +
          `🤖 4. *Bot Menu*\n` +
          `📜 5. *Info Menu*\n` +
          `💬 6. *Quotes Menu*\n` +
          `🛠️ 7. *Tools Menu*\n` +
          `🖼️ 8. *Images Menu*\n\n` +
          `✨ Your wish is my command! Let’s explore together!`);
      }
    } catch (error) {
      console.error("Error handling button press:", error);
      bot.sendMessage(msg.chat.id, "😢 Oops! Something went wrong. Please try again later.");
    }
  });
};
