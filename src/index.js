const TelegramBot = require("node-telegram-bot-api");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const axios = require("axios");

const { text, btnText, paymentTitle } = require("./constantsUA");
// const { textRu, btnTextRu, paymentTitleRu } = require("./constantsRU");

const {
  requestDataMonth,
  requestDataThreeMonth,
  paymentInfoMonth,
  paymentInfoThreeMonth,
  recurringData,
} = require("./payment/dataReq");
const {
  keyboardDefault,
  keyboardDefaultReplay,
  keyboardGeneral,
  subscription,
  pay_btn,
  pay_btns,
  cancelPayment,
  btnIsPayment,
  cancelSecurityPayment,
} = require("./components/buttons");
const {
  keyboardDefaultRu,
  buyBtnRu,
  keyboardDefaultReplayRu,
  keyboardGeneralRu,
  subscriptionRu,
  pay_btnRu,
  btnIsPaymentRu,
  cancelPaymentRu,
  cancelSecurityPaymentRu,
} = require("./components/buttonsRu");
const {
  createUser,
  updateUser,
  getOneUserById,
  getAllUsers,
  deletePayUser,
  recurringPayResponseDB,
  updateUserLang,
} = require("./mongoDb/index");
const {
  reqWFPMonth,
  reqWFPThreeMonth,
  recurringPay,
} = require("./payment/paymentsWFP");
const {
  addInfoUserDB,
  priceConverter,
  timePay,
  acceptedMySubscription,
  recurringPayHelp,
} = require("./helper");
const {
  generateSignature,
  createShaRes,
  createShaRecurring,
} = require("./payment/sha");
const server = require("./server");

require("dotenv").config();

server();

const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, async (msg) => {
  try {
    // lang = msg.from.language_code;
    // pic = "src/img/prev.jpg";
    chat_id = msg.chat.id;
    // await bot.sendPhoto(chat_id, pic, {
    //   caption:  textRu.caption,
    //   reply_markup: keyboardGeneralRu,
    // });

    //     merchantAccount, merchantDomainName, orderReference, orderDate, amount, currency, productName [0],

    // productName [1] ..., productName [n], productCount [0], productCount [1], ..., productCount [n],
    //  productPrice [0], productPrice [1], ..., productPrice [n]

    //////////////////////////
    // const secretKey = "b626e76d19497d4f6a469f19a484230270fea10a";

    // Функція для формування підпису
    // function generateSignature(
    //   merchantAccount,
    //   merchantDomainName,
    //   orderReference,
    //   orderDate,
    //   amount,
    //   currency,
    //   productName,
    //   productCount,
    //   productPrice
    // ) {
    //   const dataToSign = [
    //     merchantAccount,
    //     merchantDomainName,
    //     orderReference,
    //     orderDate,
    //     amount,
    //     currency,
    //     ...productName,
    //     ...productCount,
    //     ...productPrice,
    //   ].join(";");

    //   console.log(dataToSign);

    //   return crypto
    //     .createHmac("md5", secretKey)
    //     .update(dataToSign, "utf8")
    //     .digest("hex");
    // }

    // Дані для запиту
    // const merchantAccount = "t_me_4c955";
    // const merchantDomainName = "https://t.me/Insight_Room2_bot";
    // const orderReference = "18273hfuawkdccdawdwdawuuddaw2hw3xy";
    // const orderDate = Math.floor(new Date().getTime() / 1000); // Поточна дата у форматі Unix timestamp
    // const amount = "400";
    // const currency = "UAH";
    // const productName = ["Підписка на місяць"];
    // const productCount = ["1"];
    // const productPrice = ["400"];
    // const serviceUrl = "https://ea9c-78-159-35-159.ngrok-free.app";

    // const merchantSignature = generateSignature(
    // merchantAccount,
    // merchantDomainName,
    // orderReference,
    // orderDate,
    // amount,
    // currency,
    // productName,
    // productCount,
    // productPrice
    // );

    // Тіло запиту
    // const requestBody = {
    //   transactionType: "CREATE_INVOICE",
    //   merchantAccount,
    //   merchantDomainName,
    //   orderReference,
    //   orderDate,
    //   amount,
    //   currency,
    //   productName,
    //   productCount,
    //   productPrice,
    //   merchantSignature,
    //   apiVersion: "1",
    //   // serviceUrl,
    //   // alternativeCurrency: ["USD", "UAH"],
    //   // alternativeAmount: ["10", "400"],
    // };

    // Відправка запиту
    // await axios
    //   .post("https://api.wayforpay.com/api", requestBody, {
    //     headers: {
    //       "Content-Type": "application/json",
    //     },
    //   })
    //   .then((response) => {
    //     console.log("Успіх:", response.data);
    //     paymentInfo.pay_link = response.data.invoiceUrl;
    //   })
    //   .catch((error) => {
    //     console.error("Помилка:", error.response?.data || error.message);
    //   });

    await bot.sendMessage(chat_id, text.caption);
    await bot.sendMessage(chat_id, text.caption_two, {
      ...keyboardDefault,
    });
    // await bot.sendMessage(chat_id, text.caption_two, {
    //   ...pay_btns(),
    // });
  } catch (error) {
    console.error(error);
  }
});

bot.on("callback_query", async (query) => {
  try {
    //chat info
    console.log(query);

    const nameBtn = query.data;
    const id = query.id;
    const chat_id = query.message.chat.id;
    // const message_id = query.message.message_id;

    const userId = query.from.id;
    const userFirstName = query.from.first_name;
    const userLastName = query.from.last_name;
    const username = query.from.username;

    // updateUserLang(userId, lang);

    const user = await getOneUserById(userId);
    console.log(user);

    if (nameBtn === "buy_btn") {
      await bot.answerCallbackQuery(id);

      // addInfoUserDB()

      // await bot.sendMessage(chat_id, text.successPayment);
      // await bot.sendMessage(chat_id, "test");

      // const generateId = uuidv4();

      if (user.length === 0) {
        addInfoUserDB(
          userId,
          userFirstName,
          userLastName,
          username
          // subscribe
          // nameBtn,
          // generateId,
          // paymentInfo.pay_id,
          // requestData.request.amount,
          // paymentTitle.titleStandart
        );
        createUser();
        // } else {
        //   // updateUser(
        //   //   userId,
        //   //   priceConverter(requestData.request.amount),
        //   //   nameBtn,
        //   //   generateId,
        //   //   paymentInfo.pay_id,
        //   //    paymentTitle.titleStandart
        //   //   lang
        //   // );
        // }
      }

      // requestDataMonth.serviceUrl = "https://ea9c-78-159-35-159.ngrok-free.app";
      requestDataMonth.orderReference = uuidv4();

      const merchantSignatureMonth = generateSignature({
        merchantDomainName: requestDataMonth.merchantDomainName,
        orderReference: requestDataMonth.orderReference,
        orderDate: requestDataMonth.orderDate,
        amount: requestDataMonth.amount,
        currency: requestDataMonth.currency,
        productName: requestDataMonth.productName,
        productCount: requestDataMonth.productCount,
        productPrice: requestDataMonth.productPrice,
      });

      requestDataThreeMonth.orderReference = uuidv4();

      const merchantSignatureThreeMonth = generateSignature({
        merchantDomainName: requestDataThreeMonth.merchantDomainName,
        orderReference: requestDataThreeMonth.orderReference,
        orderDate: requestDataThreeMonth.orderDate,
        amount: requestDataThreeMonth.amount,
        currency: requestDataThreeMonth.currency,
        productName: requestDataThreeMonth.productName,
        productCount: requestDataThreeMonth.productCount,
        productPrice: requestDataThreeMonth.productPrice,
      });

      requestDataMonth.merchantSignature = merchantSignatureMonth;
      requestDataThreeMonth.merchantSignature = merchantSignatureThreeMonth;

      // console.log(requestDataMonth);
      // console.log(requestDataThreeMonth);

      const paymentInfoRes = await reqWFPMonth();
      const paymentInfoResThree = await reqWFPThreeMonth();

      // console.log("paymentInfo", paymentInfoRes);
      // console.log("paymentInfo", paymentInfoResThree);

      paymentInfoMonth.pay_link = paymentInfoRes.invoiceUrl;
      paymentInfoThreeMonth.pay_link = paymentInfoResThree.invoiceUrl;

      // console.log(paymentInfoRes.invoiceUrl);
      // console.log(paymentInfoResThree.invoiceUrl);

      await bot.sendMessage(chat_id, text.choiceTariff, {
        ...pay_btns(),
      });

      // await bot.editMessageText(
      //   textRu.priceDays,
      //   {
      //     chat_id,
      //     message_id: message_id,
      //     reply_markup:
      //       lang === "uk" ? { ...pay_btn() } : { ...pay_btnRu() },
      //   }
      // );

      // requestData.amount = 5000;
      // requestData.request.order_id = generateId;
      // requestData.request.order_desc = paymentTitleRu.titleStandart;
      // requestData.request.signature = createShaPost();

      // await reqFondy().then((res) => {
      //   paymentInfo.pay_id = res.response.payment_id;
      //   paymentInfo.pay_link = res.response.checkout_url;
      // });

      // addInfoUserDB(
      //   userId,
      //   userFirstName,
      //   userLastName,
      //   username,
      //   nameBtn,
      //   generateId,
      //   paymentInfo.pay_id,
      //   requestData.request.amount,
      //   lang === "uk"
      //     ? paymentTitle.titleStandart
      //     : paymentTitleRu.titleStandart,
      //   lang
      // );

      // resData.request.order_id = generateId;
      // resData.request.signature = createShaRes();

      // if (!user[0]?.payment.order_id) {
      //   if (user.length === 0) {
      //     createUser();
      //   } else {
      //     updateUser(
      //       userId,
      //       priceConverter(requestData.request.amount),
      //       nameBtn,
      //       generateId,
      //       paymentInfo.pay_id,
      //       lang === "uk"
      //         ? paymentTitle.titleStandart
      //         : paymentTitleRu.titleStandart,
      //       lang
      //     );
      //   }

      //   setTimeout(async () => {
      //   await bot.editMessageText(
      //     lang === "uk" ? text.priceDays : textRu.priceDays,
      //     {
      //       chat_id,
      //       message_id: message_id,
      //       reply_markup:
      //         lang === "uk" ? { ...pay_btn() } : { ...pay_btnRu() },
      //     }
      //   );
      // }, 500);
      // } else {
      //   setTimeout(async () => {
      //     await bot.editMessageText(
      //       lang === "uk" ? text.priceDays : textRu.priceDays,
      //       {
      //         chat_id,
      //         message_id: message_id,
      //         reply_markup:
      //           lang === "uk" ? { ...btnIsPayment() } : { ...btnIsPaymentRu() },
      //       }
      //     );
      //   }, 500);
      // }
    }

    if (nameBtn === "more") {
      await bot.answerCallbackQuery(id);

      // await bot.sendMessage(chat_id, "відправив на оплату");

      // await bot.sendMessage(textRu.moreInfo, {
      //   chat_id,
      //   message_id: message_id,
      //   reply_markup: buyBtnRu,
      // });

      await bot.sendMessage(chat_id, text.moreInfo, {
        reply_markup: buyBtnRu,
      });

      // requestData.request.amount = 15000;
      // requestData.request.order_id = generateId;
      // requestData.request.order_desc =
      //   lang === "uk" ? paymentTitle.titleVIP : paymentTitleRu.titleVIP;
      // requestData.request.signature = createShaPost();

      // await reqFondy().then((res) => {
      //   paymentInfo.pay_id = res.response.payment_id;
      //   paymentInfo.pay_link = res.response.checkout_url;
      // });

      // addInfoUserDB(
      //   userId,
      //   userFirstName,
      //   userLastName,
      //   username,
      //   nameBtn,
      //   generateId,
      //   paymentInfo.pay_id,
      //   requestData.request.amount,
      //   lang === "uk" ? paymentTitle.titleVIP : paymentTitleRu.titleVIP,
      //   lang
      // );

      // resData.request.order_id = generateId;
      // resData.request.signature = createShaRes();

      // if (!user[0]?.payment.order_id) {
      //   if (user.length === 0) {
      //     createUser();
      //   } else {
      //     updateUser(
      //       userId,
      //       priceConverter(requestData.request.amount),
      //       nameBtn,
      //       generateId,
      //       paymentInfo.pay_id,
      //       lang === "uk" ? paymentTitle.titleVIP : paymentTitleRu.titleVIP,
      //       lang
      //     );
      //   }
      //   setTimeout(async () => {
      //     await bot.editMessageText(
      //       lang === "uk" ? text.priceVip : textRu.priceVip,
      //       {
      //         chat_id,
      //         message_id: message_id,
      //         reply_markup: { ...pay_btn() },
      //       }
      //     );
      //   }, 500);
      // } else {
      //   setTimeout(async () => {
      //     await bot.editMessageText(
      //       lang === "uk" ? text.priceVip : textRu.priceVip,
      //       {
      //         chat_id,
      //         message_id: message_id,
      //         reply_markup: { ...btnIsPayment() },
      //       }
      //     );
      //   }, 500);
      // }
    }

    // if (nameBtn === "btn_3") {
    //   await bot.answerCallbackQuery(id);
    //   bot.editMessageText({
    //     chat_id,
    //     message_id: message_id,
    //     // reply_markup:
    //     //   lang === "uk" ? keyboardDefaultReplay : keyboardDefaultReplayRu,
    //   });
    // }

    // if (nameBtn === "back") {
    //   await bot.answerCallbackQuery(id);
    //   bot.editMessageText(lang === "uk" ? text.choice : textRu.choice, {
    //     chat_id,
    //     message_id: message_id,
    //     reply_markup:
    //       lang === "uk" ? keyboardDefaultReplay : keyboardDefaultReplayRu,
    //   });
    // }
    // if (nameBtn === "btn_5") {
    //   await bot.answerCallbackQuery(id);
    //   bot.editMessageText(lang === "uk" ? text.choice : textRu.choice, {
    //     chat_id,
    //     message_id: message_id,
    //     reply_markup:
    //       lang === "uk" ? keyboardDefaultReplay : keyboardDefaultReplayRu,
    //   });
    // }
    // if (nameBtn === "cancelP") {
    //   await bot.answerCallbackQuery(id);
    //   const user = await getOneUserById(userId);

    //   bot.editMessageText(acceptedMySubscription(user), {
    //     chat_id,
    //     message_id: message_id,
    //     reply_markup: cancelSecurityPayment,
    //   });
    // }
    // if (nameBtn === "cancelSP") {
    //   await bot.answerCallbackQuery(id);
    //   deletePayUser(userId);
    //   bot.sendMessage(
    //     chat_id,
    //     lang === "uk"
    //       ? btnText.acceptCencelPayment
    //       : btnTextRu.acceptCencelPayment
    //   );
    // }
  } catch (error) {
    console.error(error);
  }
});

// bot.on("callback_query", async (query) => {
//   try {
//     lang = query.from.language_code;

//     //chat info
//     const nameBtn = query.data;
//     const id = query.id;
//     const chat_id = query.message.chat.id;
//     const message_id = query.message.message_id;

//     const userId = query.from.id;
//     const userFirstName = query.from.first_name;
//     const userLastName = query.from.last_name;
//     const username = query.from.username;

//     updateUserLang(userId, lang);
//     const generateId = uuidv4();
//     const user = await getOneUserById(userId);

//     if (nameBtn === "st_btn") {
//       await bot.answerCallbackQuery(id);

//       requestData.request.amount = 5000;
//       requestData.request.order_id = generateId;
//       requestData.request.order_desc =
//         lang === "uk"
//           ? paymentTitle.titleStandart
//           : paymentTitleRu.titleStandart;
//       requestData.request.signature = createShaPost();

//       await reqFondy().then((res) => {
//         paymentInfo.pay_id = res.response.payment_id;
//         paymentInfo.pay_link = res.response.checkout_url;
//       });

//       addInfoUserDB(
//         userId,
//         userFirstName,
//         userLastName,
//         username,
//         nameBtn,
//         generateId,
//         paymentInfo.pay_id,
//         requestData.request.amount,
//         lang === "uk"
//           ? paymentTitle.titleStandart
//           : paymentTitleRu.titleStandart,
//         lang
//       );

//       resData.request.order_id = generateId;
//       resData.request.signature = createShaRes();

//       if (!user[0]?.payment.order_id) {
//         if (user.length === 0) {
//           createUser();
//         } else {
//           updateUser(
//             userId,
//             priceConverter(requestData.request.amount),
//             nameBtn,
//             generateId,
//             paymentInfo.pay_id,
//             lang === "uk"
//               ? paymentTitle.titleStandart
//               : paymentTitleRu.titleStandart,
//             lang
//           );
//         }

//         setTimeout(async () => {
//           await bot.editMessageText(
//             lang === "uk" ? text.priceDays : textRu.priceDays,
//             {
//               chat_id,
//               message_id: message_id,
//               reply_markup:
//                 lang === "uk" ? { ...pay_btn() } : { ...pay_btnRu() },
//             }
//           );
//         }, 500);
//       } else {
//         setTimeout(async () => {
//           await bot.editMessageText(
//             lang === "uk" ? text.priceDays : textRu.priceDays,
//             {
//               chat_id,
//               message_id: message_id,
//               reply_markup:
//                 lang === "uk" ? { ...btnIsPayment() } : { ...btnIsPaymentRu() },
//             }
//           );
//         }, 500);
//       }
//     }

//     if (nameBtn === "vip_btn") {
//       await bot.answerCallbackQuery(id);

//       requestData.request.amount = 15000;
//       requestData.request.order_id = generateId;
//       requestData.request.order_desc =
//         lang === "uk" ? paymentTitle.titleVIP : paymentTitleRu.titleVIP;
//       requestData.request.signature = createShaPost();

//       await reqFondy().then((res) => {
//         paymentInfo.pay_id = res.response.payment_id;
//         paymentInfo.pay_link = res.response.checkout_url;
//       });

//       addInfoUserDB(
//         userId,
//         userFirstName,
//         userLastName,
//         username,
//         nameBtn,
//         generateId,
//         paymentInfo.pay_id,
//         requestData.request.amount,
//         lang === "uk" ? paymentTitle.titleVIP : paymentTitleRu.titleVIP,
//         lang
//       );

//       resData.request.order_id = generateId;
//       resData.request.signature = createShaRes();

//       if (!user[0]?.payment.order_id) {
//         if (user.length === 0) {
//           createUser();
//         } else {
//           updateUser(
//             userId,
//             priceConverter(requestData.request.amount),
//             nameBtn,
//             generateId,
//             paymentInfo.pay_id,
//             lang === "uk" ? paymentTitle.titleVIP : paymentTitleRu.titleVIP,
//             lang
//           );
//         }
//         setTimeout(async () => {
//           await bot.editMessageText(
//             lang === "uk" ? text.priceVip : textRu.priceVip,
//             {
//               chat_id,
//               message_id: message_id,
//               reply_markup: { ...pay_btn() },
//             }
//           );
//         }, 500);
//       } else {
//         setTimeout(async () => {
//           await bot.editMessageText(
//             lang === "uk" ? text.priceVip : textRu.priceVip,
//             {
//               chat_id,
//               message_id: message_id,
//               reply_markup: { ...btnIsPayment() },
//             }
//           );
//         }, 500);
//       }
//     }

//     if (nameBtn === "back") {
//       await bot.answerCallbackQuery(id);
//       bot.editMessageText(lang === "uk" ? text.choice : textRu.choice, {
//         chat_id,
//         message_id: message_id,
//         reply_markup:
//           lang === "uk" ? keyboardDefaultReplay : keyboardDefaultReplayRu,
//       });
//     }
//     if (nameBtn === "btn_5") {
//       await bot.answerCallbackQuery(id);
//       bot.editMessageText(lang === "uk" ? text.choice : textRu.choice, {
//         chat_id,
//         message_id: message_id,
//         reply_markup:
//           lang === "uk" ? keyboardDefaultReplay : keyboardDefaultReplayRu,
//       });
//     }
//     if (nameBtn === "cancelP") {
//       await bot.answerCallbackQuery(id);
//       const user = await getOneUserById(userId);

//       bot.editMessageText(acceptedMySubscription(user), {
//         chat_id,
//         message_id: message_id,
//         reply_markup: cancelSecurityPayment,
//       });
//     }
//     if (nameBtn === "cancelSP") {
//       await bot.answerCallbackQuery(id);
//       deletePayUser(userId);
//       bot.sendMessage(
//         chat_id,
//         lang === "uk"
//           ? btnText.acceptCencelPayment
//           : btnTextRu.acceptCencelPayment
//       );
//     }
//   } catch (error) {
//     console.error(error);
//   }
// });

// bot.on("message", async (msg) => {
//   try {
//     lang = msg.from.language_code;

//     const msgText = msg.text;
//     const chatId = msg.chat.id;

//     updateUserLang(chatId, lang);

//     const user = await getOneUserById(chatId);

//     switch (msgText) {
//       case lang === "uk" ? btnText.tariff : btnTextRu.tariff:
//         bot.sendMessage(
//           chatId,
//           lang === "uk" ? text.choice : textRu.choice,
//           lang === "uk"
//             ? {
//                 ...keyboardDefault,
//               }
//             : {
//                 ...keyboardDefaultRu,
//               }
//         );
//         break;
//       case lang === "uk" ? btnText.mySubscription : btnTextRu.mySubscription:
//         if (!user[0]?.payment.order_id) {
//           bot.sendMessage(
//             chatId,
//             lang === "uk" ? text.mySubscription : textRu.mySubscription,
//             lang === "uk" ? { ...subscription } : { ...subscriptionRu }
//           );
//         } else {
//           bot.sendMessage(
//             chatId,
//             acceptedMySubscription(user),
//             lang === "uk"
//               ? {
//                   ...cancelPayment,
//                 }
//               : {
//                   ...cancelPaymentRu,
//                 }
//           );
//         }

//         break;
//       case lang === "uk" ? btnText.clubRules : btnTextRu.clubRules:
//         bot.sendMessage(
//           chatId,
//           lang === "uk" ? text.clubRules : textRu.clubRules
//         );
//         break;
//       case lang === "uk" ? btnText.descriptionClub : btnTextRu.descriptionClub:
//         bot.sendMessage(
//           chatId,
//           lang === "uk" ? text.descriptionClub : textRu.descriptionClub
//         );
//         break;
//       default:
//         break;
//     }
//   } catch (error) {
//     console.error(error);
//   }
// });

// setInterval(async () => {
//   const date = timePay();
//   const users = await getAllUsers();

//   users.forEach((user) => {
//     if (user.payment.dateEnd === date && user.payment.rectoken) {
//       const generateId = uuidv4();
//       recurringPayHelp(
//         user.payment.rectoken,
//         generateId,
//         user.order_desc,
//         user.payment.amount
//       );

//       recurringData.request.signature = createShaRecurring();
//       const errorMessage = () =>
//         bot.sendMessage(
//           user.user_id,
//           user.lang === "uk" ? text.errorRePay : textRu.errorRePay
//         );
//       recurringPay().then((res) => {
//         if (
//           res.response.order_status === "declined" ||
//           res.response.order_status === "processing"
//         ) {
//           return errorMessage();
//         }
//         if (res.response.error_code) {
//           return errorMessage();
//         } else {
//           recurringPayResponseDB(res.response, user.user_id, errorMessage);
//           return bot.sendMessage(
//             user.user_id,
//             user.lang === "uk" ? text.goodSub : textRu.goodSub
//           );
//         }
//       });
//     }
//   });
// }, 10000);
// 10800000
