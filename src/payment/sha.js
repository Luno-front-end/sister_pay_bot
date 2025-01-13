sha1 = require("js-sha1");
const crypto = require("crypto");

const { requestData, recurringData } = require("../payment/dataReq");

require("dotenv").config();

const generateSignature = (data) => {
  const dataToSign = [
    process.env.MERCHANT_ID,
    data.merchantDomainName,
    data.orderReference,
    data.orderDate,
    data.amount,
    data.currency,
    ...data.productName,
    ...data.productCount,
    ...data.productPrice,
  ].join(";");

  console.log("dataToSign", dataToSign);

  return crypto
    .createHmac("md5", process.env.SECRET_KEY)
    .update(dataToSign, "utf8")
    .digest("hex");
};

const createShaRes = () => {
  const shaKey = sha1("");
  // const shaKey = sha1(
  //   `${process.env.SECRET_KEY}|${process.env.MERCHANT_ID}|${requestData.request.order_id}`
  // );

  return shaKey;
};

const createShaRecurring = () => {
  // const shaKey = sha1(
  //   `${process.env.SECRET_KEY}|${recurringData.request.amount}|${recurringData.request.currency}|${process.env.MERCHANT_ID}|${recurringData.request.order_desc}|${recurringData.request.order_id}|${recurringData.request.rectoken}`
  // );
  const shaKey = sha1("");

  return shaKey;
};

module.exports = { generateSignature, createShaRes, createShaRecurring };
