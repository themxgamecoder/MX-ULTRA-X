const TelegramBot = require('node-telegram-bot-api');
const mongoose = require('mongoose');
const { handleUserInput } = require('./mxgamecoder/UltraMX_bot'); // Import functions
const Mute = require('./mxgamecoder/mute'); // Import Mute model
const { botName } = require('./settings'); // Import botName from settings
require('dotenv').config();

// Connect to MongoDB
const { MONGODB_URI } = process.env;

mongoose.connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected successfully'))
  .catch((error) => console.log('MongoDB connection error:', error));

// Create a new bot instance
const bot = new TelegramBot(process.env.BOT_TOKEN, { polling: true });

// Handle user input (username and PIN)
bot.on('message', async (msg) => {
  await handleUserInput(bot, msg); // Use handleUserInput from UltraMX_bot.js
});

// Function to check and remove expired mutes
async function checkAndRemoveExpiredMutes() {
  const now = new Date();
  const expiredMutes = await Mute.find({ muteEnd: { $lt: now } });

  for (const mute of expiredMutes) {
    await bot.sendMessage(mute.userId, `🔊 *You have been automatically unmuted and can now send messages again.*\n\n👤 Bot Name: ${botName} 💖`);
    await Mute.deleteOne({ userId: mute.userId });
  }
}

// Run the mute checker every minute
setInterval(checkAndRemoveExpiredMutes, 60000); // Pass bot instance to mute checker
