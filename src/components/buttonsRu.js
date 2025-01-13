const { btnTextRu } = require("../constantsRU");
const { paymentInfo } = require("../payment/dataReq");
// const paymentLink = paymentInfo.pay_link
const paymentLinkTest = "https://875e-78-159-35-159.ngrok-free.app";

const keyboardDefaultRu = {
  reply_markup: {
    resize_keyboard: true,
    inline_keyboard: [
      [
        {
          text: btnTextRu.month,
          // callback_data: "buy_btn",
          web_app: {
            url: `${paymentLinkTest}`,
          },
        },
        {
          text: btnTextRu.more,
          callback_data: "more",
        },
      ],
    ],
  },
};

const buyBtnRu = {
  resize_keyboard: true,
  inline_keyboard: [
    [
      {
        text: btnTextRu.month,
        callback_data: "buy_btn",
      },
    ],
  ],
};

const keyboardDefaultReplayRu = {
  resize_keyboard: true,
  inline_keyboard: [
    [
      {
        text: btnTextRu.days,
        callback_data: "st_btn",
      },
      {
        text: btnTextRu.vip,
        callback_data: "vip_btn",
      },
    ],
  ],
};

const keyboardGeneralRu = {
  resize_keyboard: true,

  keyboard: [
    [
      {
        text: btnTextRu.tariff,
        callback_data: "btn_g1",
      },
      {
        text: btnTextRu.mySubscription,
        callback_data: "btn_g2",
      },
    ],
    [
      {
        text: btnTextRu.clubRules,
        callback_data: "btn_6",
      },
      {
        text: btnTextRu.descriptionClub,
        callback_data: "btn_g2",
      },
    ],
  ],
};
const subscriptionRu = {
  reply_markup: {
    resize_keyboard: true,
    inline_keyboard: [
      [
        {
          text: btnTextRu.buySubscription,
          callback_data: "btn_5",
        },
      ],
    ],
  },
};

// const pay_btnRu = () => {
//   if (paymentInfo.pay_link) {
//     return {
//       inline_keyboard: [
//         [
//           {
//             text: btnTextRu.buy,
//             callback_data: "btn_3",
//             url: paymentInfo.pay_link,
//           },
//         ],
//         [
//           {
//             text: btnTextRu.back,
//             callback_data: "back",
//           },
//         ],
//       ],
//     };
//   } else {
//     return {
//       inline_keyboard: [
//         [
//           {
//             text: btnTextRu.errPaymentBtn,
//             callback_data: "back",
//           },
//         ],
//       ],
//     };
//   }
// };

const pay_btnRu = () => {
  return {
    inline_keyboard: [
      [
        {
          text: btnTextRu.month,
          callback_data: "btn_3",
          url: paymentInfo.pay_link,
        },
      ],
    ],
  };
};

const btnIsPaymentRu = () => {
  return {
    inline_keyboard: [
      [
        {
          text: btnTextRu.acceptPayment,
          callback_data: "back",
        },
      ],
    ],
  };
};

const cancelPaymentRu = {
  reply_markup: {
    resize_keyboard: true,
    inline_keyboard: [
      [
        {
          text: btnTextRu.cencelPayment,
          callback_data: "cancelP",
        },
      ],
    ],
  },
};

const cancelSecurityPaymentRu = {
  resize_keyboard: true,
  inline_keyboard: [
    [
      {
        text: btnTextRu.cencelProtectionPayment,
        callback_data: "cancelSP",
      },
    ],
    [
      {
        text: btnTextRu.back,
        callback_data: "back",
      },
    ],
  ],
};

module.exports = {
  keyboardDefaultRu,
  buyBtnRu,
  keyboardDefaultReplayRu,
  keyboardGeneralRu,
  subscriptionRu,
  pay_btnRu,
  btnIsPaymentRu,
  cancelPaymentRu,
  cancelSecurityPaymentRu,
};
