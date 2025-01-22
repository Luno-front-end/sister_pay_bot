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

  const channelId = process.env.CHANNEL_ID;
  // const channelId = "-1002465535663";

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
  // console.log("====================================");
  // console.log(process.env.LIVE_LINK_CHANNEL);
  // console.log("====================================");
  // Відправка користувачу повідомлення з унікальним посиланням
  const sendInviteToUser = async (userId, message, statusPay) => {
    try {
      // Генерація інвайт-посилання (діє 1 година, ліміт 1 використання)
      const expireDate = Math.floor(Date.now() / 1000) + 900; // Через 15 хв
      // const expireDate = Math.floor(Date.now() / 1000) + 3600; // Через 1 годину
      const memberLimit = 1;

      const inviteLink = await createInviteLink(
        channelId,
        expireDate,
        memberLimit
      );

      if (statusPay) {
        await bot.sendMessage(userId, message, {
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
      } else {
        await bot.sendMessage(userId, message);
      }
    } catch (error) {
      console.error(
        `Помилка при надсиланні посилання користувачу ${userId}:`,
        error.message
      );
    }
  };

  app.get("/users", async (req, res) => {
    const allUsers = await getAllUsers();
    res.render(__dirname + "/views/index", {
      allUsers: allUsers,
    });
  });
  app.all("/good", async (req, res) => {
    const response = await req.body;

    res.redirect(process.env.URL_GROOP_CONNECT);
    // res.status(200).send("HTTP 200 OK");

    res.end();
  });

  app.post("/statusPay", async (req, res) => {
    try {
      const rawData = req.body;
      const jsonData =
        typeof rawData === "string" ? JSON.parse(rawData) : rawData;

      console.log("Received raw data:", jsonData);

      const user = await getOneUsersByPayId(jsonData.orderReference);

      console.log("====================================");
      console.log(user);
      console.log(jsonData.orderReference);
      console.log("====================================");
      // await sendInviteToUser(user[0].user_id, text.successPayment, true);

      // sendMessageToUser("382298066", text.successPayment, true);

      // const userId = "527139022"; // ID користувача, якому потрібно відправити посилання
      // const userId = "382298066"; // ID користувача, якому потрібно відправити посилання
      if (jsonData.transactionStatus === "Approved") {
        await updateUserForPay(
          jsonData.email,
          jsonData.orderReference,
          jsonData.transactionStatus.toLowerCase(),
          jsonData.phone,
          timeEditPay(jsonData.createdDate),
          jsonData.amount,
          jsonData.paymentSystem,
          jsonData.cardType
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
        await sendInviteToUser(user[0].user_id, text.successPayment, true);
      } else {
        await updateUserForPay(
          null,
          jsonData.orderReference,
          jsonData.transactionStatus.toLowerCase(),
          null,
          timeEditPay(jsonData.createdDate),
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
        await sendInviteToUser(
          user[0].user_id,
          `Оплату відхилено, статус оплати ${jsonData.transactionStatus}`,
          false
        );
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
