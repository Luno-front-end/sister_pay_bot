const userInfo = {
  first_name: String,
  last_name: String,
  username: String,
  user_id: Number,
  pay: null,
  subscribe: null,
  order_id: null,
  order_desc: null,
  payment_id: null,
  title: null,
  deleteDate: null,
  addDate: null,
  payment: {
    amount: null,
    sender_email: null,
    order_id: null,
    order_status: null,
    rectoken: null,
    datePay: null,
    dateEnd: null,
    payment_system: null,
    card_type: null,
  },
};

module.exports = userInfo;
