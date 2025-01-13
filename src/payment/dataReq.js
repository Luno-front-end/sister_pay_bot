require("dotenv").config();

const requestDataMonth = {
  transactionType: "CREATE_INVOICE",
  merchantAccount: process.env.MERCHANT_ID,
  merchantDomainName: "https://t.me/Insight_Room2_bot",
  orderDate: Math.floor(new Date().getTime() / 1000),
  orderReference: String,
  amount: 2,
  currency: "UAH",
  productName: ["Підписка на місяць"],
  productCount: [1],
  productPrice: [2],
  merchantSignature: String,
  apiVersion: "1",
  serviceUrl: process.env.CALL_BACK_URL,
};
const requestDataThreeMonth = {
  transactionType: "CREATE_INVOICE",
  merchantAccount: process.env.MERCHANT_ID,
  merchantDomainName: "https://t.me/Insight_Room2_bot",
  orderDate: Math.floor(new Date().getTime() / 1000),
  orderReference: String,
  amount: 13500,
  currency: "UAH",
  productName: ["Підписка на 3 місяці"],
  productCount: [1],
  productPrice: [13500],
  merchantSignature: String,
  apiVersion: "1",
  serviceUrl: process.env.CALL_BACK_URL,
};

const recurringData = {
  request: {
    order_id: String,
    order_desc: String,
    currency: "USD",
    amount: Number,
    rectoken: String,
    signature: String,
    // merchant_id: process.env.MERCHANT_ID,
  },
};

const resData = {
  transactionType: "CHECK_STATUS",
  order_id: "",
  merchant_id: process.env.MERCHANT_ID,
  signature: "",
  apiVersion: "1",
};

const paymentInfoMonth = {
  pay_link: "",
};
const paymentInfoThreeMonth = {
  pay_link: "",
};

module.exports = {
  requestDataMonth,
  requestDataThreeMonth,
  resData,
  paymentInfoMonth,
  paymentInfoThreeMonth,
  recurringData,
};
