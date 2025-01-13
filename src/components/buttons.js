const { btnText } = require("../constantsUA");
const {
  paymentInfo,
  paymentInfoMonth,
  paymentInfoThreeMonth,
} = require("../payment/dataReq");

const keyboardDefault = {
  reply_markup: {
    resize_keyboard: true,
    inline_keyboard: [
      [
        {
          text: btnText.pay,
          callback_data: "buy_btn",
          // web_app: {
          //   url: `${paymentInfo.pay_link}`,
          // },
        },
        {
          text: btnText.more,
          callback_data: "more",
        },
      ],
    ],
  },
};

const pay_btns = () => {
  if (paymentInfoMonth.pay_link && paymentInfoThreeMonth.pay_link) {
    return {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [
            {
              text: btnText.month,
              // callback_data: "buy_btn",
              web_app: {
                url: `${paymentInfoMonth.pay_link}`,
              },
            },
            {
              text: btnText.threeMonth,
              // callback_data: "buy_btn",
              web_app: {
                url: `${paymentInfoThreeMonth.pay_link}`,
              },
            },
          ],
        ],
      },
    };
  } else {
    return {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [
            {
              text: btnText.more,
              callback_data: "more",
            },
          ],
        ],
      },
    };
  }
};

// const keyboardDefault = {
//   reply_markup: {
//     resize_keyboard: true,
//     inline_keyboard: [
//       [
//         { text: btnText.days, callback_data: "st_btn" },
//         { text: btnText.vip, callback_data: "vip_btn" },
//       ],
//     ],
//   },
// };
const keyboardDefaultReplay = {
  resize_keyboard: true,
  inline_keyboard: [
    [
      { text: btnText.days, callback_data: "st_btn" },
      { text: btnText.vip, callback_data: "vip_btn" },
    ],
  ],
};

const keyboardGeneral = {
  resize_keyboard: true,

  keyboard: [
    [
      { text: btnText.tariff, callback_data: "btn_g1" },
      { text: btnText.mySubscription, callback_data: "btn_g2" },
    ],
    [
      { text: btnText.clubRules, callback_data: "btn_6" },
      { text: btnText.descriptionClub, callback_data: "btn_g2" },
    ],
  ],
};
const subscription = {
  reply_markup: {
    resize_keyboard: true,
    inline_keyboard: [
      [{ text: btnText.buySubscription, callback_data: "btn_5" }],
    ],
  },
};

const pay_btn = () => {
  if (paymentInfo.pay_link) {
    return {
      inline_keyboard: [
        [
          {
            text: btnText.buy,
            callback_data: "btn_3",
            url: paymentInfo.pay_link,
          },
        ],
        [{ text: btnText.back, callback_data: "back" }],
      ],
    };
  } else {
    return {
      inline_keyboard: [
        [
          {
            text: btnText.errPaymentBtn,
            callback_data: "back",
          },
        ],
      ],
    };
  }
};
// const pay_btn = () => {
//     return {
//       inline_keyboard: [
//         [
//           {
//             text: btnText.month,
//             callback_data: "btn_3",
//             url: paymentInfo.pay_link,
//           },
//         ],
//       ],
//     };
// };

const btnIsPayment = () => {
  return {
    inline_keyboard: [[{ text: btnText.acceptPayment, callback_data: "back" }]],
  };
};

const cancelPayment = {
  reply_markup: {
    resize_keyboard: true,
    inline_keyboard: [
      [{ text: btnText.cencelPayment, callback_data: "cancelP" }],
    ],
  },
};
const cancelSecurityPayment = {
  resize_keyboard: true,
  inline_keyboard: [
    [{ text: btnText.cencelProtectionPayment, callback_data: "cancelSP" }],
    [{ text: btnText.back, callback_data: "back" }],
  ],
};

module.exports = {
  keyboardDefault,
  keyboardDefaultReplay,
  keyboardGeneral,
  subscription,
  pay_btns,
  btnIsPayment,
  cancelPayment,
  cancelSecurityPayment,
};
