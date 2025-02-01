const Qasim = require('api-qasim');
const { botName } = require('../settings');

module.exports = {
  name: 'npm', // Command name without prefix
  description: 'Fetches details about an npm package.',
  execute: async (bot, msg) => {
    const chatId = msg.chat.id;
    const userText = msg.text.trim();
    const query = userText.split(' ')[1]; // Extract package name from the message

    if (!query) {
      return bot.sendMessage(chatId, `✳️ Please provide an npm package name.\n\n📌 Example: ${msg.text} dog-image-api`);
    }

    try {
      await bot.sendMessage(chatId, '⏳ Fetching npm package details...');

      let res = await Qasim.npmStalk(query);

      const { name, author, description, repository, homepage, 'dist-tags': distTags, versions } = res.result;

      const versionCount = Object.keys(versions).length;

      let message = `
┌──「 STALKING NPM 
▢ 🔖Name: ${name}\n\n
▢ 🔖Creator: ${author?.name || 'Unknown'}\n\n
▢ 👥Total Versions: ${versionCount}\n\n
▢ 📌Description: ${description}\n\n
▢ 🧩Repository: ${repository?.url || 'No repository available'}\n\n
▢ 🌍Homepage: ${homepage || 'No homepage available'}\n\n
▢ 🏷️Dist Tags: Latest Version: ${distTags.latest}\n\n
▢ 🔗NPM Package Link: https://npmjs.com/package/${name}\n\n
▢  💡 Bot Name: ${botName}
└────────────`;

      await bot.sendMessage(chatId, message);

    } catch (error) {
      console.error("Error:", error);
      await bot.sendMessage(chatId, `✳️ An error occurred while processing the request: ${error.message || error}`);
    }
  },
};
