const moment = require("moment");

const userInfo = require("./mongoDb/addUserObj");
const { recurringData } = require("./payment/dataReq");

const { text, btnText } = require("./constantsUA");
const { request } = require("express");

const dateSubs = () => {
  const oneM = moment().add(1, "month").calendar();
  const sixM = moment().add(6, "month").calendar();

  const monthSix = sixM.slice(0, 2);
  const dateSix = sixM.slice(3, 5);
  const yearhSix = sixM.slice(6, 10);

  const monthOne = oneM.slice(0, 2);
  const dateOne = oneM.slice(3, 5);
  const yearhOne = oneM.slice(6, 10);
  const date = {
    // datePay: moment().format("L"),
    dateEndOne: `${dateOne}/${monthOne}/${yearhOne}`,
    dateEndTwo: `${dateSix}/${monthSix}/${yearhSix}`,
  };
  return date;
};

const priceConverter = (pay) => {
  if (pay === 5000) return 50;
  if (pay === 15000) return 150;
};

const addInfoUserDB = (
  userId,
  firstName,
  lastName,
  userName,
  order_desc,
  amount,
  orderId
  // payId,
  // title
) => {
  console.log("orderId", orderId);

  userInfo.first_name = firstName;
  userInfo.last_name = lastName;
  userInfo.username = userName;
  userInfo.user_id = userId;
  userInfo.order_desc = order_desc;
  userInfo.pay = amount;
  userInfo.morderId = orderId;
  // userInfo.subscribe = subscribe;
  // userInfo.payment_id = payId;
  // userInfo.order_desc = title;
};

const paymentStatus = (mail, orderId, status, rectoken, amount) => {
  userInfo.payment.sender_email = mail;
  userInfo.payment.order_id = orderId;
  userInfo.payment.order_status = status;
  userInfo.payment.rectoken = rectoken;
  userInfo.payment.amount = amount;
};

const recurringPayHelp = (rectoken, order_id, order_desc, amount) => {
  recurringData.request.rectoken = rectoken;
  recurringData.request.order_desc = order_desc;
  recurringData.request.amount = amount;
  recurringData.request.order_id = order_id;
};

const timePay = () => {
  const date = new Date();
  const year = date.getFullYear();

  const month = () => {
    const month = date.getMonth() + 1;
    if (month < 10) {
      return `0${month}`;
    }
    return month;
  };

  const day = () => {
    const day = date.getDate();

    if (day < 10) {
      return `0${day}`;
    }

    return day;
  };

  return `${day()}/${month()}/${year}`;
};

// const alertPrePay = () => {
//   const date = new Date();
//   const year = date.getFullYear();

//   // const dayMilliseconds = 24 * 60 * 60 * 1000;
//   const oneBackDey = 24 * 60 * 60 * 1000;
//   const twoBackDey = 48 * 60 * 60 * 1000;

//   // date.setTime(currentDate.getTime());s

//   const month = () => {
//     const month = date.getMonth() + 1;
//     if (month < 10) {
//       return `0${month}`;
//     }
//     return month;
//   };

//   const day = () => {
//     const day = date.getDate();

//     if (day < 10) {
//       return `0${day}`;
//     }

//     return day;
//   };
//   const www = date.setTime(date.getTime()) - dayMilliseconds;
//   const newDay = new Date(www);
//   return `${day()}/${month()}/${year}`;
// };

const timeEditPay = (res) => {
  const date = new Date(res * 1000);
  return date.toLocaleString();
};
// const timeEditPay = (res) => {
//   // const time = res.toString();
//   const time = "18.01.2023 21:59:37";
//   const timeEdit = time.slice(0, 10);

//   const month = timeEdit.slice(0, 2);
//   const date = timeEdit.slice(3, 5);
//   const yearh = timeEdit.slice(6, 10);

//   return `${month}/${date}/${yearh}`;
// };

const acceptedMySubscription = (subsUser) => {
  if (!subsUser[0]?.payment.order_id) {
    return text.mySubscription;
  } else {
    return `⌛️ У вас підписка на ${subsUser[0].subscribe} місяц.
Тип підписки: ${subsUser[0].pay === 50 ? btnText.days : btnText.vip}
Підписалися: ${subsUser[0].payment.datePay} 
Дата закінчення: ${subsUser[0].payment.dateEnd}`;
  }
};

module.exports = {
  addInfoUserDB,
  dateSubs,
  priceConverter,
  timePay,
  timeEditPay,
  acceptedMySubscription,
  recurringPayHelp,
};
