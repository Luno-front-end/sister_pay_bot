const axios = require("axios");
const https = require("https");
const {
  resData,
  requestData,
  recurringData,
  requestDataMonth,
  requestDataThreeMonth,
} = require("./dataReq");

const { updateUserPayInfo } = require("../mongoDb/index");

require("dotenv").config();

// const postUrl = "https://pay.fondy.eu/api/checkout/url/";
// const resUrl = "https://pay.fondy.eu/api/status/order_id";
// const recurringUrl = "https://pay.fondy.eu/api/recurring";

const baseURL = "https://api.wayforpay.com/api";

const axiosInstance = axios.create({
  timeout: 60000, //optional
  httpsAgent: new https.Agent({ keepAlive: true }),
  maxRedirects: 5, // Задати максимальну кількість перенаправлень
});

// const reqFondy = async () => {
//   return await axiosInstance
//     .post(`${baseURL}/checkout/url/`, requestData)
//     .then((res) => res.data)
//     .catch((error) => {
//       console.log(error);
//     });
// };

//  await axios
//    .post("https://api.wayforpay.com/api", requestBody, {
//      headers: {
//        "Content-Type": "application/json",
//      },
//    })
//    .then((response) => {
//      console.log("Успіх:", response.data);
//      paymentInfo.pay_link = response.data.invoiceUrl;
//    })
//    .catch((error) => {
//      console.error("Помилка:", error.response?.data || error.message);
//    });

const reqWFPMonth = async () => {
  return await axiosInstance
    .post(`${baseURL}`, requestData)
    .then((res) => res.data)
    .catch((error) => {
      console.log(error);
    });
};
const reqWFPThreeMonth = async () => {
  return await axiosInstance
    .post(`${baseURL}`, requestDataThreeMonth)
    .then((res) => res.data)
    .catch((error) => {
      console.log(error);
    });
};

const resPayment = async () => {
  return await axiosInstance
    .post(`${baseURL}`, resData)
    .then((res) => {
      // productName
      // updateUserPayInfo({
      //   userId: requestDataMonth,
      //   subscribe,
      //   order_id,
      //   deleteDate,
      //   addDate,
      // });

      return res.data;
    })
    .catch((error) => {
      console.log(error);
    });
};

const recurringPay = async () => {
  return await axiosInstance
    .post(`${baseURL}/api/recurring`, recurringData)
    .then((res) => res.data)
    .catch((error) => {
      console.log(error);
    });
};

module.exports = { reqWFPMonth, reqWFPThreeMonth, resPayment, recurringPay };
