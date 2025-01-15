const express = require("express");
const exphbs = require("express-handlebars");

const {
  updateUserForPay,
  getAllUsers,
  updateUserStatusPay,
} = require("./mongoDb/index");
const { timeEditPay } = require("./helper");
const { getStatus, getColorStatus } = require("./components/helperHbs");

const app = express();

require("dotenv").config();

app.use(express.json());

const server = () => {
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
      const rawData = req.body; // Отримуємо raw data
      console.log(res.body);
      console.log("Received raw data:", rawData); // Виводимо дані вейФорПей про оплату користувача

      res
        .status(200)
        .send(
          "тут після успішного прийому відповіді від вейФорПей з даними користувача про оплату я маю надати відповдь ВейФоПей"
        );
    } catch (err) {
      console.error("Error parsing JSON:", err);
      res.status(400).send("Invalid JSON");
    }

    // if (response.order_status === "approved") {
    //   await updateUserForPay(
    //     response.payment_id,
    //     response.sender_email,
    //     response.order_id,
    //     response.order_status,
    //     response.rectoken,
    //     timeEditPay(response.order_time),
    //     response.amount,
    //     response.payment_system,
    //     response.card_type
    //   );

    //   res.status(200).send("HTTP 200 OK");
    //   res.end();
    // }
    // if (response.order_status === "declined") {
    //   await updateUserStatusPay(
    //     response.payment_id,
    //     response.order_status,
    //     response.payment_system,
    //     response.card_type
    //   );
    //   res.status(500).send("HTTP 500 OK");
    //   res.end();
    // }
    // if (response.order_status === "processing") {
    //   await updateUserStatusPay(
    //     response.payment_id,
    //     response.order_status,
    //     response.payment_system,
    //     response.card_type
    //   );
    //   res.status(500).send("HTTP 500 OK");
    //   res.end();
    // }
  });

  app.listen(process.env.PORT, "127.0.0.1", () => {
    console.log(`Example app listening on port ${process.env.PORT}`);
  });
};

module.exports = server;
