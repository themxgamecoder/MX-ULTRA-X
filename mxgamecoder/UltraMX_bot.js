const { saveUsername, checkUsernameExists } = require('./username');
const { savePin, validatePin, getUserPin } = require('./pin');
const { notifyNewSignup, notifyError } = require('./notifications');
const setupDashboard = require('../plugins/dashboard');
const { botName, adminChatId } = require('../settings');
const { handlePrefixError } = require('./prefix'); // Import error handling
const { loadCommands, handleCommand } = require('../plugins');
const { Ban } = require('./admin'); // Import Ban model to check ban status
const Mute = require('./mute'); // Import Mute model to check mute status

let userStates = {}; // Track users' states (username or PIN input)
let userInfo = {}; // Store user information separately for username and PIN

// Load commands during startup
loadCommands();


async function handleStart(bot, msg) {
  const chatId = msg.chat.id;

  // Check if the user is banned
  const isBanned = await Ban.findOne({ userId: chatId.toString() });
  if (isBanned) {
    bot.sendMessage(chatId, `🚫 *You are banned and cannot use any commands.* Reason: ${isBanned.reason}`);
    return;
  }

  // Check if the user is muted
  const isMuted = await Mute.findOne({ userId: chatId.toString(), muteEnd: { $gt: new Date() } });
  if (isMuted) {
    bot.sendMessage(chatId, `🔇 *You are muted and cannot use any commands until ${isMuted.muteEnd.toLocaleTimeString()}.*`);
    return;
  }


  // Check if the user is already registered by checking their PIN
  const userPin = await getUserPin(chatId);

  if (userPin) {
    bot.sendMessage(chatId, `Welcome back to ${botName}! 🎉 Please enter your PIN to log in.`, {
      reply_markup: { remove_keyboard: true }
    });
    userStates[chatId] = 'pin';
  } else {
    bot.sendMessage(chatId, `Welcome to ${botName}! 🎉 Please send your username (6-12 characters, letters and numbers only).`, {
      reply_markup: { remove_keyboard: true }
    });
    userStates[chatId] = 'username';
  }
}

async function handleUserInput(bot, msg) {
  const chatId = msg.chat.id;
  const userText = msg.text;

  // Check if the user is banned
  const isBanned = await Ban.findOne({ userId: chatId.toString() });
  if (isBanned) {
    bot.sendMessage(chatId, `🚫 *You are banned and cannot use any commands.* Reason: ${isBanned.reason}`);
    return;
  }

// Check if the user is muted
const isMuted = await Mute.findOne({ userId: chatId.toString(), muteEnd: { $gt: new Date() } });
if (isMuted) {
  bot.sendMessage(chatId, `🔇 *You are muted and cannot use any commands until ${isMuted.muteEnd.toLocaleTimeString()}.*`);
  return;
}


  // Check if userText exists
  if (!userText) {
    bot.sendMessage(chatId, "Oops! I can only understand text messages for now. 🤖 Please try again.");
    return;
  }

  // Allow /start command regardless of registration or login
  if (userText.startsWith('/start')) {
    await handleStart(bot, msg);
    return; // Return early to avoid checking prefixes
  }

  handleCommand(bot, msg);

  // Check if the user is trying to use a prefix without being registered
  const isErrorHandled = await handlePrefixError(bot, msg, chatId, userText);
  if (isErrorHandled) return; // If error was handled, return early

  // Check if the user tries to use an invalid prefix before registering or logging in
  const validPrefix = ['.', '!', '#', '$', '%', '&', '*', '+', '-', '=', '^', '@', '~', '?', '|', '<', '>', '`', ':', ',']
    .some((prefix) => userText.startsWith(prefix));

  if (validPrefix && !await getUserPin(chatId)) {
    bot.sendMessage(chatId, `Oops! 😔 You need to register or log in first before using commands with prefixes. Please send your username and PIN to proceed. 😕`);
    return; // Don't process further if the prefix is used incorrectly
  }

  if (!userText.startsWith('/')) {
    if (userStates[chatId] === 'username') {
      // Validate the username
      const usernamePattern = /^[a-zA-Z0-9]{6,12}$/;
      if (!usernamePattern.test(userText)) {
        bot.sendMessage(chatId, 'Oops! Your username should only contain letters and numbers and be 6 to 12 characters long. Try again!');
        notifyError(bot, chatId, 'Invalid Username', userText); // Notify admin about the error
        return;
      }

      // Check if the username already exists
      const usernameExists = await checkUsernameExists(userText);
      if (usernameExists) {
        bot.sendMessage(chatId, 'Oops! This username is already taken. Please choose another one. 😢');
        return;
      }

      // Save username to the database
      const isUsernameSaved = await saveUsername(chatId, userText);
      if (isUsernameSaved) {
        bot.sendMessage(chatId, `Yay! Your username "${userText}" has been saved successfully! 🎉🎉`);
        bot.sendMessage(chatId, 'Now, please send your PIN (exactly 7 digits).');
        userStates[chatId] = 'pin';
        userInfo[chatId] = { username: userText, pin: null };
      } else {
        bot.sendMessage(chatId, 'Sorry, there was an issue saving your username. Please try again later. 😢');
        notifyError(bot, chatId, 'Failed to Save Username', userText);
      }
    } else if (userStates[chatId] === 'pin') {
      // Validate the PIN
      if (!validatePin(userText)) {
        bot.sendMessage(chatId, 'Oops! Your PIN should be exactly 7 digits. Please try again!');
        notifyError(bot, chatId, 'Invalid PIN', userText);
        return;
      }

      // Save the PIN to the database
      const result = await savePin(chatId, userText);
      if (result.success) {
        bot.sendMessage(chatId, 'Yay! Your PIN has been saved successfully! 🎉🎉');
        delete userStates[chatId];

        if (!userInfo[chatId]) {
          userInfo[chatId] = { username: null, pin: null };
        }
        userInfo[chatId].pin = userText;

        notifyNewSignup(bot, chatId, userInfo[chatId].username, userInfo[chatId].pin);

        console.log("User Info:", userInfo[chatId]);

        try {
          await setupDashboard(bot, chatId, userInfo[chatId].username);
          bot.sendMessage(chatId, 'Now, you can access your dashboard! 🎉');
        } catch (error) {
          bot.sendMessage(chatId, 'Sorry, something went wrong while redirecting to the dashboard. Please try again later. 😢');
          console.error("Error setting up dashboard:", error);
        }
      } else {
        bot.sendMessage(chatId, result.message);
        notifyError(bot, chatId, 'Failed to Save PIN', userText);
      }
    }
  }
}

module.exports = { handleStart, handleUserInput };
