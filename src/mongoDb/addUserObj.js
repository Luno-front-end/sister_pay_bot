const userInfo = {
  first_name: String,
  last_name: String,
  username: String,
  user_id: Number,
  pay: null,
  order_id: null,
  old_pay: null,
  old_order_id: null,
  order_desc: null,
  deleteDate: null,
  addDate: null,
  month: null,
  payment: {
    phone: null,
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
