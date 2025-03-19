const moment = require("moment");

const userInfo = require("./mongoDb/addUserObj");

const dateSubs = () => {
  const oneM = moment().add(1, "month").calendar();
  const threeM = moment().add(3, "month").calendar();

  const monthThree = threeM.slice(0, 2);
  const dateThree = threeM.slice(3, 5);
  const yearThree = threeM.slice(6, 10);

  const monthOne = oneM.slice(0, 2);
  const dateOne = oneM.slice(3, 5);
  const yearOne = oneM.slice(6, 10);

  // const date = {
  //   dateEndOne: `${dateOne}-${monthOne}-${yearhOne}`,
  //   dateEndTwo: `${dateThree}-${monthThree}-${yearhThree}`,
  // };
  const date = {
    dateEndOne: `${yearOne}-${monthOne}-${dateOne}`,
    dateEndTwo: `${yearThree}-${monthThree}-${dateThree}`,
  };
  return date;
};

const addInfoUserDB = (
  userId,
  firstName,
  lastName,
  userName,
  order_desc,
  amount,
  order_id,
  month
) => {
  userInfo.first_name = firstName;
  userInfo.last_name = lastName;
  userInfo.username = userName;
  userInfo.user_id = userId;
  userInfo.order_desc = order_desc;
  userInfo.pay = amount;
  userInfo.order_id = order_id;
  userInfo.old_pay = amount;
  userInfo.old_order_id = order_id;
  userInfo.month = month;
};

const timeEditPay = (res) => {
  const date = new Date(res * 1000);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${year}-${month}-${day}`;
};

module.exports = {
  addInfoUserDB,
  dateSubs,
  timeEditPay,
};
