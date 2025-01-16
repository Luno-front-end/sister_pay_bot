const TelegramBot = require("node-telegram-bot-api");
const { v1: uuidv1, v4: uuidv4 } = require("uuid");
const axios = require("axios");

const { text, btnText, paymentTitle } = require("./constantsUA");
// const { textRu, btnTextRu, paymentTitleRu } = require("./constantsRU");

const {
  requestData,
  paymentInfo,
  paymentInfoMonth,
  paymentInfoThreeMonth,
  recurringData,
} = require("./payment/dataReq");
const {
  keyboardDefault,
  keyboardDefaultReplay,
  keyboardGeneral,
  subscription,
  pay_btn_month,
  pay_btn_three_month,
  pay_btns,
  cancelPayment,
  btnIsPayment,
  cancelSecurityPayment,
  buyBtn,
  keyboardTariff,
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
  updateSecureOrderUser,
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

    await bot.sendMessage(chat_id, text.caption);
    await bot.sendMessage(chat_id, text.caption_two, {
      ...keyboardDefault,
    });
  } catch (error) {
    console.error(error);
  }
});

bot.on("callback_query", async (query) => {
  try {
    //chat info
    // console.log(query);

    const nameBtn = query.data;
    const id = query.id;
    const chat_id = query.message.chat.id;
    const message_id = query.message.message_id;

    const userId = query.from.id;
    const userFirstName = query.from.first_name;
    const userLastName = query.from.last_name;
    const username = query.from.username;

    const user = await getOneUserById(userId);
    // console.log(user);

    if (nameBtn === "buy_btn") {
      await bot.answerCallbackQuery(id);

      // addInfoUserDB()

      // await bot.sendMessage(chat_id, text.successPayment);
      // await bot.sendMessage(chat_id, "test");

      // const generateId = uuidv4();

      await bot.sendMessage(chat_id, text.choiceTariff, {
        ...keyboardTariff,
      });

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
        reply_markup: buyBtn,
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

    if (nameBtn === "month") {
      await bot.answerCallbackQuery(id);

      const orderIdGenerate = uuidv4();

      const time = Math.floor(new Date().getTime() / 1000);

      requestData.orderReference = orderIdGenerate;
      requestData.amount = 2;
      requestData.productName = ["Підписка на місяць"];
      requestData.productPrice = [2];
      requestData.orderDate = time;

      const merchantSignature = generateSignature({
        merchantDomainName: requestData.merchantDomainName,
        orderReference: requestData.orderReference,
        orderDate: requestData.orderDate,
        amount: requestData.amount,
        currency: requestData.currency,
        productName: requestData.productName,
        productCount: requestData.productCount,
        productPrice: requestData.productPrice,
      });

      requestData.merchantSignature = merchantSignature;

      const paymentInfoRes = await reqWFPMonth();

      paymentInfo.pay_link = paymentInfoRes.invoiceUrl;

      if (user.length === 0) {
        addInfoUserDB(
          userId,
          userFirstName,
          userLastName,
          username,
          requestData.productName[0],
          requestData.amount
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
        //   // );
        // }
      }

      bot.editMessageText(text.selectedTariffMonth, {
        chat_id,
        message_id: message_id,
        ...pay_btn_month(),
      });
    }

    if (nameBtn === "three_month") {
      await bot.answerCallbackQuery(id);

      const orderIdGenerate = uuidv4();

      requestData.orderReference = orderIdGenerate;
      requestData.amount = 3500;
      requestData.productName = ["Підписка на 3 місяці"];
      requestData.productPrice = [3500];

      const merchantSignature = generateSignature({
        merchantDomainName: requestData.merchantDomainName,
        orderReference: requestData.orderReference,
        orderDate: requestData.orderDate,
        amount: requestData.amount,
        currency: requestData.currency,
        productName: requestData.productName,
        productCount: requestData.productCount,
        productPrice: requestData.productPrice,
      });

      requestData.merchantSignature = merchantSignature;

      const paymentInfoRes = await reqWFPMonth();

      paymentInfo.pay_link = paymentInfoRes.invoiceUrl;

      if (user.length === 0) {
        addInfoUserDB(
          userId,
          userFirstName,
          userLastName,
          username,
          requestData.productName[0],
          requestData.amount
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
        //   // );
        // }
      }

      bot.editMessageText(text.selectedTariffMonth, {
        chat_id,
        message_id: message_id,
        ...pay_btn_three_month(),
      });
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

    if (nameBtn === "back") {
      await bot.answerCallbackQuery(id);
      bot.editMessageText(text.choiceTariff, {
        chat_id,
        message_id: message_id,
        ...keyboardTariff,
      });
    }
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

// bot.on("message", (msg) => {
//   const chatId = msg.chat.id;
//   bot.sendMessage(chatId, "Привіт! Я ваш бот.");
// });

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
