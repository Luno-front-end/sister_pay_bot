require("dotenv").config();

const requestData = {
  transactionType: "CREATE_INVOICE",
  merchantAccount: process.env.MERCHANT_ID,
  merchantDomainName: "https://t.me/Insight_Room2_bot",
  orderDate: String,
  orderReference: String,
  amount: Number,
  currency: "UAH",
  productName: Array,
  productCount: [1],
  productPrice: Array,
  merchantSignature: String,
  apiVersion: "1",
  serviceUrl: process.env.CALL_BACK_URL,
};

const paymentInfo = {
  pay_link: "",
};

module.exports = {
  requestData,
  paymentInfo,
};
