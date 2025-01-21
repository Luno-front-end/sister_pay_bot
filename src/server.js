const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const { generateSignatureRes } = require("./payment/sha");
const { text } = require("./constantsUA");
// const TelegramBot = require("node-telegram-bot-api");

const channelInviteLink = process.env.CHANNEL_INVITE_LINK;

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

  const sendMessageToUser = async (userId, message, statusPay) => {
    try {
      await bot.sendMessage(
        userId,
        message,
        statusPay && {
          reply_markup: {
            inline_keyboard: [
              [
                {
                  text: "Перейти в канал", // Текст на кнопці
                  url: channelInviteLink, // Посилання на канал
                },
              ],
            ],
          },
        }
      );
      console.log(`Повідомлення успішно відправлено користувачу ${userId}`);
    } catch (error) {
      console.error(
        `Помилка при відправці повідомлення користувачу ${userId}:`,
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
      const jsonData = JSON.parse(rawData);

      console.log("Received raw data:", jsonData);

      const user = getOneUsersByPayId(jsonData.orderReference);

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

        sendMessageToUser(user.user_id, text.successPayment, true);

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

        sendMessageToUser(
          user.user_id,
          `Оплата відмовлена, статус оплати ${jsonData.transactionStatus}`,
          false
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
