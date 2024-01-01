const TelegramBot = require("node-telegram-bot-api");
const { TOKEN } = require("../config");
const axios = require("axios").default;

const bot = new TelegramBot(TOKEN, {
  polling: true,
});

bot.on("message", async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  try {
    if (text == "/start") {
      bot.sendMessage(
        chatId,
        `🫡 Assalamu alaykum dasturchi <b>${msg.from.first_name}</b>.`,
        {
          parse_mode: "HTML",
        }
      );
    } else {
      const { data } = await axios.get(
        `https://api.stackexchange.com/2.2/search?order=desc&sort=votes&site=stackoverflow&intitle=${text}`
      );
      const answers = data.items;
      if (answers.length > 0) {
        const answerLinks = answers
          .map((answer) => `<a href="${answer.link}">${answer.title}</a>`)
          .join("\n\n");
        bot.sendMessage(
          chatId,
          `<b>Ushbu havolaga o'tib code larni ko'rishingiz mumkin:</b>\n\n${answerLinks}`,
          {
            parse_mode: "HTML",
          }
        );
      } else {
        bot.sendMessage(chatId, "Topilmadi.");
      }
    }
  } catch (error) {
    console.error(error);
    bot.sendMessage(chatId, "Ma'lumotlarni olishda xatolik yuz berdi.");
  }
});
