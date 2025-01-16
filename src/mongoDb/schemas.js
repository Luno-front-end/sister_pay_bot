const { Schema, model } = require("mongoose");

const subsUsers = new Schema({
  first_name: String,
  last_name: String,
  username: String,
  user_id: Number,
  pay: Number,
  subscribe: Number,
  order_id: String,
  order_desc: String,
  deleteDate: String,
  addDate: String,
  payment: {
    phone: String,
    sender_email: String,
    order_id: String,
    order_status: String,
    datePay: String,
    dateEnd: String,
    amount: Number,
    payment_system: String,
    card_type: String,
  },
});

module.exports = model("subsUsers", subsUsers);
