const TelegramBot = require("node-telegram-bot-api");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");

const { text } = require("./constantsUA");

const { requestData, paymentInfo } = require("./payment/dataReq");

const {
  keyboardDefault,
  pay_btn_month,
  pay_btn_three_month,
  buyBtn,
  keyboardTariff,
} = require("./components/buttons");

const { createUser, updateUser, getOneUserById } = require("./mongoDb/index");
const { reqWFPMonth } = require("./payment/paymentsWFP");
const { addInfoUserDB } = require("./helper");
const { generateSignature } = require("./payment/sha");
const server = require("./server");

require("dotenv").config();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });
server(bot);

bot.onText(/\/start/, async (msg) => {
  try {
    const chat_id = msg.chat.id;

    bot.sendMessage(
      chat_id,
      "👋 Привіт! Натисни кнопку «СТАРТ», щоб продовжити👇",
      {
        reply_markup: {
          keyboard: [["Старт або розпочати заново"]],
          resize_keyboard: true,
          // one_time_keyboard: true, // Приховує клавіатуру після натискання
        },
      }
    );
  } catch (error) {
    console.error(error);
  }
});

bot.on("callback_query", async (query) => {
  try {
    const nameBtn = query.data;
    const id = query.id;
    const chat_id = query.message.chat.id;
    const message_id = query.message.message_id;

    const userId = query.from.id;
    const userFirstName = query.from.first_name;
    const userLastName = query.from.last_name;
    const username = query.from.username;

    const time = Math.floor(new Date().getTime() / 1000);

    const user = await getOneUserById(userId);

    if (nameBtn === "buy_btn") {
      await bot.answerCallbackQuery(id);

      await bot.sendMessage(chat_id, text.choiceTariff, {
        ...keyboardTariff,
      });
    }

    if (nameBtn === "more") {
      await bot.answerCallbackQuery(id);

      await bot.sendMessage(chat_id, text.moreInfo, {
        reply_markup: buyBtn,
      });
    }

    if (nameBtn === "month") {
      await bot.answerCallbackQuery(id);

      const orderIdGenerate = uuidv4();

      requestData.orderReference = orderIdGenerate;
      requestData.amount = 1290;
      requestData.productName = ["Підписка на місяць"];
      requestData.productPrice = [1290];
      requestData.orderDate = time;
      requestData.month = 1;

      const merchantSignature = generateSignature({
        merchantDomainName: requestData.merchantDomainName,
        orderReference: requestData.orderReference,
        orderDate: requestData.orderDate,
        amount: requestData.amount,
        currency: requestData.currency,
        productName: requestData.productName,
        productCount: requestData.productCount,
        productPrice: requestData.productPrice,
      });

      requestData.merchantSignature = merchantSignature;

      const paymentInfoRes = await reqWFPMonth();

      paymentInfo.pay_link = paymentInfoRes.invoiceUrl;

      if (user.length === 0) {
        addInfoUserDB(
          userId,
          userFirstName,
          userLastName,
          username,
          requestData.productName[0],
          requestData.amount,
          requestData.orderReference
        );

        createUser();
      } else {
        updateUser(
          userId,
          requestData.amount,
          requestData.orderReference,
          requestData.productName[0]
        );
      }

      bot.editMessageText(text.selectedTariffMonth, {
        chat_id,
        message_id: message_id,
        ...pay_btn_month(),
      });
    }

    if (nameBtn === "three_month") {
      await bot.answerCallbackQuery(id);

      const orderIdGenerate = uuidv4();

      requestData.orderReference = orderIdGenerate;
      requestData.amount = 3500;
      requestData.productName = ["Підписка на 3 місяці"];
      requestData.productPrice = [3500];
      requestData.orderDate = time;
      requestData.month = 3;

      const merchantSignature = generateSignature({
        merchantDomainName: requestData.merchantDomainName,
        orderReference: requestData.orderReference,
        orderDate: requestData.orderDate,
        amount: requestData.amount,
        currency: requestData.currency,
        productName: requestData.productName,
        productCount: requestData.productCount,
        productPrice: requestData.productPrice,
      });

      requestData.merchantSignature = merchantSignature;

      if (user.length === 0) {
        addInfoUserDB(
          userId,
          userFirstName,
          userLastName,
          username,
          requestData.productName[0],
          requestData.amount,
          requestData.orderReference
        );
        createUser();
      } else {
        updateUser(
          userId,
          requestData.amount,
          requestData.orderReference,
          requestData.productName[0]
        );
      }

      const paymentInfoRes = await reqWFPMonth();

      paymentInfo.pay_link = paymentInfoRes.invoiceUrl;

      bot.editMessageText(text.selectedTariffThreeMonth, {
        chat_id,
        message_id: message_id,
        ...pay_btn_three_month(),
      });
    }

    if (nameBtn === "back_index") {
      await bot.answerCallbackQuery(id);
      bot.editMessageText(text.choiceTariff, {
        chat_id,
        message_id: message_id,
        ...keyboardTariff,
      });
    }
  } catch (error) {
    console.error(error);
  }
});

bot.on("message", async (msg) => {
  try {
    const chat_id = msg.chat.id;
    if (msg.text === "Старт або розпочати заново") {
      bot.sendMessage(chat_id, text.caption);
      await bot.sendMessage(chat_id, text.caption_two, {
        ...keyboardDefault,
      });
    }
  } catch (error) {
    console.error(error);
  }
});
