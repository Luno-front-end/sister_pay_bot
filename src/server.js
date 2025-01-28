const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const { generateSignatureRes } = require("./payment/sha");
const { text, btnText } = require("./constantsUA");
const { dateSubs } = require("./helper");
// const TelegramBot = require("node-telegram-bot-api");

const {
  updateUserForPay,
  getAllUsers,
  updateUserStatusPay,
  getOneUsersByPayId,
} = require("./mongoDb/index");
const { timeEditPay } = require("./helper");
const { getStatus, getColorStatus } = require("./components/helperHbs");

const app = express();

require("dotenv").config();

// const channelInviteLink = process.env.CHANNEL_INVITE_LINK;
app.use(bodyParser.text({ type: "*/*" }));

const server = (bot) => {
  const hbs = exphbs.create({
    defaultLayout: "main",
    extname: "hbs",
    layoutsDir: __dirname + "/views/layouts/",
    partialsDir: __dirname + "/views/partials",
    helpers: { getStatus: getStatus, getColorStatus: getColorStatus },
  });

  app.engine("hbs", hbs.engine);
  app.set("view engine", "hbs");
  app.set("views", "./views");

  app.use(express.static(__dirname + "/views/public"));

  const channelId = process.env.CHANNEL_ID;

  const createInviteLink = async (chatId, expireDate, memberLimit) => {
    try {
      const inviteLink = await bot.createChatInviteLink(chatId, {
        expire_date: expireDate,
        member_limit: memberLimit,
      });
      return inviteLink.invite_link;
    } catch (error) {
      console.error("Помилка при створенні інвайт-посилання:", error.message);
      throw error;
    }
  };
  const sendInviteToUser = async (userId, message, statusPay, link_pay) => {
    const expireDate = Math.floor(Date.now() / 1000) + 900; // Лінк активний 15 хвилин
    const memberLimit = 1;
    const inviteLink = await createInviteLink(
      channelId,
      expireDate,
      memberLimit
    );

    try {
      if (statusPay) {
        await bot.sendMessage(userId, message, {
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Правила!", callback_data: "regulations" },
                { text: "Перейти в канал", url: inviteLink },
              ],
            ],
          },
        });
      } else {
        await bot.sendMessage(userId, message, {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Повторити оплату",
                  web_app: {
                    url: `${link_pay}`,
                  },
                },
              ],
            ],
          },
        });
      }
    } catch (error) {
      console.error(
        `Помилка при надсиланні посилання користувачу ${userId}:`,
        error.message
      );
    }
  };

  bot.on("callback_query", async (query) => {
    try {
      const { data: nameBtn, id, message } = query;
      const { chat, message_id } = message;
      const chat_id = chat.id;

      if (nameBtn === "regulations") {
        await bot.editMessageText(text.regulations, {
          chat_id,
          message_id,
          reply_markup: {
            inline_keyboard: [
              [{ text: btnText.back, callback_data: "back_server" }],
            ],
          },
        });
      }

      if (nameBtn === "back_server") {
        await bot.answerCallbackQuery(id);
        const expireDate = Math.floor(Date.now() / 1000) + 900;
        const memberLimit = 1;
        const inviteLink = await createInviteLink(
          channelId,
          expireDate,
          memberLimit
        );

        await bot.editMessageText(text.successPayment, {
          chat_id,
          message_id,
          reply_markup: {
            inline_keyboard: [
              [
                { text: "Правила!", callback_data: "regulations" },
                { text: "Перейти в канал", url: inviteLink },
              ],
            ],
          },
        });
      }
    } catch (error) {
      console.error("Помилка в обробці callback_query:", error);
    }
  });

  app.get("/users", async (req, res) => {
    const allUsers = await getAllUsers();
    res.render(__dirname + "/views/index", {
      allUsers: allUsers,
    });
  });

  app.post("/statusPay", async (req, res) => {
    try {
      const rawData = req.body;
      const jsonData =
        typeof rawData === "string" ? JSON.parse(rawData) : rawData;

      console.log("Received raw data:", jsonData);

      const user = await getOneUsersByPayId(jsonData.orderReference);

      if (jsonData.transactionStatus === "Approved") {
        await updateUserForPay(
          jsonData.email,
          jsonData.orderReference,
          jsonData.transactionStatus.toLowerCase(),
          jsonData.phone,
          timeEditPay(jsonData.createdDate),
          jsonData.amount,
          jsonData.paymentSystem,
          jsonData.cardType,
          user[0].month === 1 ? dateSubs().dateEndOne : dateSubs().dateEndTwo
        );

        res.status(200).send({
          orderReference: jsonData?.orderReference,
          status: "accept",
          time: jsonData?.createdDate,
          signature: generateSignatureRes({
            orderReference: jsonData?.orderReference,
            status: "accept",
            time: jsonData?.createdDate,
          }),
        });
        res.end();
        user.length > 0 &&
          (await sendInviteToUser(user[0].user_id, text.successPayment, true));
      } else {
        await updateUserForPay(
          null,
          jsonData.orderReference,
          jsonData.transactionStatus.toLowerCase(),
          null,
          timeEditPay(jsonData.createdDate),
          null,
          null,
          null,
          null
        );

        res.status(200).send({
          orderReference: jsonData?.orderReference,
          status: "accept",
          time: jsonData?.createdDate,
          signature: generateSignatureRes({
            orderReference: jsonData?.orderReference,
            status: "accept",
            time: jsonData?.createdDate,
          }),
        });
        res.end();
        //   user.length > 0 &&
        //  await sendInviteToUser(
        //    user[0].user_id,
        //    `Оплату відхилено, статус оплати "${jsonData.transactionStatus}".
        //   Повторіть оплату натиснувши кнопку нижче.`,
        //    false,
        //    "https://google.com"
        //  );
        user.length > 0 &&
          (await sendInviteToUser(
            "382298066",
            `Оплату відхилено, статус оплати Скасовано.
Повторіть оплату натиснувши кнопку нижче.`,
            false,
            jsonData?.repayUrl
          ));
      }
    } catch (err) {
      console.error("Error parsing JSON:", err);
      res.status(400).send("Invalid JSON");
    }
  });

  app.listen(process.env.PORT, "127.0.0.1", () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
  });
};

module.exports = server;
