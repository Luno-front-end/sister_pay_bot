const express = require("express");
const exphbs = require("express-handlebars");
const bodyParser = require("body-parser");
const { generateSignatureRes } = require("./payment/sha");

const {
  updateUserForPay,
  getAllUsers,
  updateUserStatusPay,
} = require("./mongoDb/index");
const { timeEditPay } = require("./helper");
const { getStatus, getColorStatus } = require("./components/helperHbs");

const app = express();

require("dotenv").config();

// app.use(express.json());
app.use(bodyParser.text({ type: "*/*" }));

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
      const rawData = req.body;
      const jsonData = JSON.parse(rawData);

      // console.log("Received raw data:", jsonData);

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
          signature: generateSignatureRes(
            jsonData?.orderReference,
            "accept",
            jsonData?.createdDate
          ),
        });
        res.end();
      }

      // res.status(200).send({
      //   orderReference: jsonData?.orderReference,
      //   status: "accept",
      //   time: jsonData?.createdDate,
      //   signature: generateSignatureRes(
      //     jsonData?.orderReference,
      //     "accept",
      //     jsonData?.createdDate
      //   ),
      // });
    } catch (err) {
      console.error("Error parsing JSON:", err);
      res.status(400).send("Invalid JSON");
    }

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
