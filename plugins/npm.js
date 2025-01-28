const Qasim = require('api-qasim');

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
▢ 🔖Name: ${name} 
▢ 🔖Creator: ${author?.name || 'Unknown'}
▢ 👥Total Versions: ${versionCount}
▢ 📌Description: ${description}
▢ 🧩Repository: ${repository?.url || 'No repository available'}
▢ 🌍Homepage: ${homepage || 'No homepage available'}
▢ 🏷️Dist Tags: Latest Version: ${distTags.latest}
▢ 🔗Link: [NPM Package](https://npmjs.com/package/${name})
└────────────`;

      await bot.sendMessage(chatId, message);

    } catch (error) {
      console.error("Error:", error);
      await bot.sendMessage(chatId, `✳️ An error occurred while processing the request: ${error.message || error}`);
    }
  },
};
