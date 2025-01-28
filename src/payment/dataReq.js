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

// const recurringData = {
//   request: {
//     order_id: String,
//     order_desc: String,
//     currency: "USD",
//     amount: Number,
//     rectoken: String,
//     signature: String,
//     // merchant_id: process.env.MERCHANT_ID,
//   },
// };

// const resData = {
//   transactionType: "CHECK_STATUS",
//   order_id: "",
//   merchant_id: process.env.MERCHANT_ID,
//   signature: "",
//   apiVersion: "1",
// };

const paymentInfo = {
  pay_link: "",
};

module.exports = {
  requestData,
  paymentInfo,
  // resData,
  // recurringData,
};
