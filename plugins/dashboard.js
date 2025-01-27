const axios = require('axios'); // Import axios for API requests
const { botName, botCreator, botVersion } = require('../settings'); // Import bot settings

module.exports = function setupDashboard(bot, chatId, username) {
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
      bot.sendMessage(chatId, `🎉 *Welcome to Your Dashboard, ${username}!* 🎉\n\n` +
        `👤 *Username:* ${username}\n` +
        `🤖 *Bot Version:* ${botVersion}\n` +
        `💡 *Quote of the Moment:* "${quote}"\n` + // Display the fetched quote
        `👑 *Created By:* ${botCreator}\n\n` +
        `✨ Enjoy exploring all the awesome features!`,
        {
          parse_mode: "Markdown",
          reply_markup: {
            keyboard: [
              ["📋 Menu", "👤 Profile", "❓ Help"],
              ["📞 Contact", "📂 Menu2", "🛠️ Support"],
              ["🌀 Clone", "📁 Menu3", "✅ Alive"],
              ["📜 Random Quote"], // Added button for Random Quote
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
      } else if (msg.text === "📜 Random Quote") {
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
      }
    } catch (error) {
      console.error("Error handling button press:", error);
      bot.sendMessage(msg.chat.id, "😢 Oops! Something went wrong. Please try again later.");
    }
  });
};