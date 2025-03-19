const { btnText } = require("../constantsUA");
const { paymentInfo } = require("../payment/dataReq");

const keyboardDefault = {
  reply_markup: {
    resize_keyboard: true,
    inline_keyboard: [
      [
        {
          text: btnText.pay,
          callback_data: "buy_btn",
        },
        {
          text: btnText.more,
          callback_data: "more",
        },
      ],
    ],
  },
};

const keyboardTariff = {
  reply_markup: {
    resize_keyboard: true,
    inline_keyboard: [
      [
        {
          text: btnText.month,
          callback_data: "month",
        },
        {
          text: btnText.threeMonth,
          callback_data: "three_month",
        },
      ],
    ],
  },
};

const buyBtn = {
  resize_keyboard: true,
  inline_keyboard: [
    [
      {
        text: btnText.pay,
        callback_data: "buy_btn",
      },
    ],
  ],
};

const pay_btn_month = () => {
  if (paymentInfo.pay_link) {
    return {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [
            {
              text: btnText.month,
              web_app: {
                url: `${paymentInfo.pay_link}`,
              },
            },
          ],
          [{ text: btnText.back, callback_data: "back_index" }],
        ],
      },
    };
  } else {
    return {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [{ text: btnText.back, callback_data: "back_index" }],
        ],
      },
    };
  }
};

const pay_btn_three_month = () => {
  if (paymentInfo.pay_link) {
    return {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [
            {
              text: btnText.threeMonth,
              web_app: {
                url: `${paymentInfo.pay_link}`,
              },
            },
          ],
          [{ text: btnText.back, callback_data: "back_index" }],
        ],
      },
    };
  } else {
    return {
      reply_markup: {
        resize_keyboard: true,
        inline_keyboard: [
          [{ text: btnText.back, callback_data: "back_index" }],
        ],
      },
    };
  }
};

module.exports = {
  keyboardTariff,
  keyboardDefault,
  pay_btn_month,
  pay_btn_three_month,
  buyBtn,
};
