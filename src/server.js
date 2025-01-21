const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const { generateSignatureRes } = require("./payment/sha");
const { text } = require("./constantsUA");
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

const channelInviteLink = process.env.CHANNEL_INVITE_LINK;
// app.use(express.json());
app.use(bodyParser.text({ type: "*/*" }));

// const token = process.env.BOT_TOKEN;
// const bot = new TelegramBot(token, { polling: true });

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

  // const sendMessageToUser = async (userId, message, statusPay) => {
  //   try {
  //     statusPay
  //       ? await bot.sendMessage(userId, message, {
  //           reply_markup: {
  //             inline_keyboard: [
  //               [
  //                 {
  //                   text: "Перейти в канал", // Текст на кнопці
  //                   url: channelInviteLink, // Посилання на канал
  //                 },
  //               ],
  //             ],
  //           },
  //         })
  //       : await bot.sendMessage(userId, message);
  //     console.log(`Повідомлення успішно відправлено користувачу ${userId}`);
  //   } catch (error) {
  //     console.error(
  //       `Помилка при відправці повідомлення користувачу ${userId}:`,
  //       error.message
  //     );
  //   }
  // };
  const channelId = "-1002465535663";

  const createInviteLink = async (chatId, expireDate, memberLimit) => {
    try {
      const inviteLink = await bot.createChatInviteLink(chatId, {
        expire_date: expireDate, // Таймер на закінчення посилання
        member_limit: memberLimit, // Ліміт використань (наприклад, 1)
      });
      return inviteLink.invite_link;
    } catch (error) {
      console.error("Помилка при створенні інвайт-посилання:", error.message);
      throw error;
    }
  };

  // Відправка користувачу повідомлення з унікальним посиланням
  const sendInviteToUser = async (userId) => {
    try {
      // Генерація інвайт-посилання (діє 1 година, ліміт 1 використання)
      const expireDate = Math.floor(Date.now() / 1000) + 30; // Через 1 годину
      // const expireDate = Math.floor(Date.now() / 1000) + 3600; // Через 1 годину
      const memberLimit = 1;

      const inviteLink = await createInviteLink(
        channelId,
        expireDate,
        memberLimit
      );

      // Надсилання повідомлення з кнопкою
      await bot.sendMessage(userId, "Ваше унікальне посилання на канал:", {
        reply_markup: {
          inline_keyboard: [
            [
              {
                text: "Перейти в канал", // Текст кнопки
                url: inviteLink, // Унікальне посилання
              },
            ],
          ],
        },
      });

      console.log(
        `Посилання успішно відправлено користувачу ${userId}: ${inviteLink}`
      );
    } catch (error) {
      console.error(
        `Помилка при надсиланні посилання користувачу ${userId}:`,
        error.message
      );
    }
  };

  // Приклад виклику функції

  // const sendMessageToUser = async (userId, message, statusPay) => {
  //   try {
  //     if (statusPay) {
  //       console.log("====================================");
  //       console.log(channelInviteLink);
  //       console.log("====================================");

  //       // const channelInviteLink = "https://t.me/+your_channel_invite_code"; // Замість цього додайте своє посилання
  //       await bot.sendMessage(userId, message, {
  //         reply_markup: {
  //           inline_keyboard: [
  //             [
  //               {
  //                 text: "Перейти в канал", // Текст кнопки
  //                 url: channelInviteLink, // Валідне посилання
  //               },
  //             ],
  //           ],
  //         },
  //       });

  //       bot.on("callback_query", async (callbackQuery) => {
  //         const data = callbackQuery.data;
  //         const messageId = callbackQuery.message.message_id;

  //         if (data === "go_to_channel") {
  //           // Вилучення кнопок з повідомлення після натискання
  //           await bot.editMessageReplyMarkup(
  //             { inline_keyboard: [] }, // Видалення всіх кнопок
  //             {
  //               chat_id: callbackQuery.message.chat.id,
  //               message_id: messageId,
  //             }
  //           );
  //         }

  //         // Відповісти на callback_query, щоб прибрати індикатор завантаження кнопки
  //         await bot.answerCallbackQuery(callbackQuery.id, {
  //           text: "Перехід до каналу...",
  //         });
  //       });
  //     } else {
  //       await bot.sendMessage(userId, message);
  //     }

  //     console.log(`Повідомлення успішно відправлено користувачу ${userId}`);
  //   } catch (error) {
  //     console.error(
  //       `Помилка при відправці повідомлення користувачу ${userId}:`,
  //       error.message
  //     );
  //   }
  // };

  app.get("/statusPay", async (req, res) => {
    try {
      // const rawData = req.body;
      // const jsonData = JSON.parse(rawData);

      // console.log("Received raw data:", jsonData);

      // const user = getOneUsersByPayId(jsonData.orderReference);

      // sendMessageToUser("382298066", text.successPayment, true);

      const userId = "527139022"; // ID користувача, якому потрібно відправити посилання
      // const userId = "382298066"; // ID користувача, якому потрібно відправити посилання
      sendInviteToUser(userId);
      // if (jsonData.transactionStatus === "Approved") {
      //   await updateUserForPay(
      //     jsonData.email,
      //     jsonData.orderReference,
      //     jsonData.transactionStatus.toLowerCase(),
      //     jsonData.phone,
      //     timeEditPay(jsonData.createdDate),
      //     jsonData.amount,
      //     jsonData.paymentSystem,
      //     jsonData.cardType
      //   );

      //   res.status(200).send({
      //     orderReference: jsonData?.orderReference,
      //     status: "accept",
      //     time: jsonData?.createdDate,
      //     signature: generateSignatureRes({
      //       orderReference: jsonData?.orderReference,
      //       status: "accept",
      //       time: jsonData?.createdDate,
      //     }),
      //   });
      //   res.end();
      // } else {
      //   await updateUserForPay(
      //     null,
      //     jsonData.orderReference,
      //     jsonData.transactionStatus.toLowerCase(),
      //     null,
      //     timeEditPay(jsonData.createdDate),
      //     null,
      //     null,
      //     null
      //   );

      //   sendMessageToUser(
      //     user.user_id,
      //     `Оплата відмовлена, статус оплати ${jsonData.transactionStatus}`,
      //     false
      //   );

      //   res.status(200).send({
      //     orderReference: jsonData?.orderReference,
      //     status: "accept",
      //     time: jsonData?.createdDate,
      //     signature: generateSignatureRes({
      //       orderReference: jsonData?.orderReference,
      //       status: "accept",
      //       time: jsonData?.createdDate,
      //     }),
      //   });
      //   res.end();
      // }

      res.send("dajlwhdk");
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
