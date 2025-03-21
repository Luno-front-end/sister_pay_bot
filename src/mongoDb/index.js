const mongoose = require("mongoose");
const moment = require("moment");
const SubsUsersSchema = require("./schemas");
const userInfo = require("./addUserObj");
const { dateSubs, timeEditPay } = require("../helper");

require("dotenv").config();

const connectDb = () => {
  try {
    mongoose.connect(
      process.env.URL_CONNECT,
      {
        useNewUrlParser: true,
      },
      (err, client) => {
        if (err) {
          console.log("Connection error", err);
        }
      }
    );
  } catch (error) {
    console.log(error);
  }

  return mongoose.connection;
};

const createUser = () => {
  connectDb();

  const addUsers = new SubsUsersSchema(userInfo);
  addUsers.save((err, post) => {
    if (err) {
      console.log(err);
    }
  });
  connectDb().on("error", console.log).on("disconnect", connectDb);
};

const updateUserPayInfo = (
  userId,
  subscribe,
  order_id,
  deleteDate,
  addDate
) => {
  connectDb();
  SubsUsersSchema.updateOne(
    { user_id: userId },
    {
      $set: {
        subscribe: null,
        order_id: null,
        deleteDate: null,
        addDate: null,
      },
    },
    (err, result) => {
      if (err) {
        console.log("Unable update user: ", err);
      }
    }
  );
  connectDb().on("error", console.log).on("disconnect", connectDb);
};

const updateSecureOrderUser = (userId, signature, order_id, date) => {
  connectDb();
  SubsUsersSchema.updateOne(
    { user_id: userId },
    {
      $set: {
        signature,
        order_id,
        date,
      },
    },
    (err, result) => {
      if (err) {
        console.log("Unable update user: ", err);
      }
    }
  );
  connectDb().on("error", console.log).on("disconnect", connectDb);
};

const updateUser = (userId, pay, order_id, productName, month) => {
  connectDb();
  SubsUsersSchema.updateOne(
    { user_id: userId },
    {
      $set: {
        pay: pay,
        order_id,
        order_desc: productName,
        month,
      },
    },
    (err, result) => {
      if (err) {
        console.log("Unable update user: ", err);
      }
    }
  );
  connectDb().on("error", console.log).on("disconnect", connectDb);
};

const getUserForOrderId = async (order_id, secure) => {
  connectDb();
  const user = await SubsUsersSchema.find({ payment_id: pay_id });
  connectDb().on("error", console.log).on("disconnect", connectDb);
  return user;
};

const updateUserForPay = async (
  mail,
  orderId,
  status,
  phone,
  timePay,
  amount,
  payment_system,
  card_type,
  dateEnd
) => {
  try {
    connectDb();
    const user = await getOneUsersByPayId(orderId);

    if (user.length > 0 && user[0]?.order_id === orderId) {
      SubsUsersSchema.updateOne(
        { order_id: orderId },
        {
          $set: {
            deleteDate: null,
            old_order_id: orderId,
            old_pay: amount,
            payment: {
              sender_email: mail,
              order_id: orderId,
              phone: phone,
              order_status: status,
              datePay: timePay,
              dateEnd: dateEnd,
              amount: amount,
              payment_system: payment_system,
              card_type: card_type,
            },
          },
        },
        (err, result) => {
          if (err) {
            console.log("Unable update user: ", err);
          }
        }
      );
    } else {
      console.log("Щось пішло не так");
    }

    connectDb().on("error", console.log).on("disconnect", connectDb);
  } catch (error) {
    console.log(error);
  }
};

const getAllUsers = async () => {
  connectDb();

  const allUsers = await SubsUsersSchema.find({}).lean();
  connectDb().on("error", console.log).on("disconnect", connectDb);

  return allUsers;
};
const getOneUsersByPayId = async (orderId) => {
  connectDb();
  const user = await SubsUsersSchema.find({ order_id: orderId });
  connectDb().on("error", console.log).on("disconnect", connectDb);
  return user;
};
const getOneUserById = async (user_id) => {
  connectDb();
  const user = await SubsUsersSchema.find({ user_id: user_id });
  connectDb().on("error", console.log).on("disconnect", connectDb);
  return user;
};

const recurringPayResponseDB = (res, userId, errorMessage) => {
  if (res.error_code) {
    errorMessage();
  } else {
    connectDb();
    SubsUsersSchema.updateOne(
      { user_id: userId },
      {
        $set: {
          order_id: res.order_id,
          payment_id: res.payment_id,
          deleteDate: null,
          "payment.order_status": res.order_status,
          "payment.order_id": res.order_id,
          "payment.datePay": timeEditPay(res.order_time),
          "payment.dateEnd": dateSubs().dateEndOne,
        },
      },
      (err, result) => {
        if (err) {
          console.log("Unable update user: ", err);
        }
      }
    );
    connectDb().on("error", console.log).on("disconnect", connectDb);
  }
};

const updateUserLang = (userTgId, lang) => {
  try {
    connectDb();

    SubsUsersSchema.updateOne(
      { user_id: userTgId },
      {
        $set: { lang: lang },
      },
      (err, result) => {
        if (err) {
          console.log("Unable update user: ", err);
        }
      }
    );

    connectDb().on("error", console.log).on("disconnect", connectDb);
  } catch (error) {
    console.log(error);
  }
};

const findUserByDate = async () => {
  try {
    connectDb();

    // Отримуємо сьогоднішню дату у форматі "YYYY-MM-DD"
    const today = moment().format("YYYY-MM-DD");

    console.log("Сьогоднішня дата:", today);

    return SubsUsersSchema.find({
      "payment.dateEnd": today,
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  createUser,
  updateUser,
  getAllUsers,
  getOneUserById,
  updateUserForPay,
  recurringPayResponseDB,
  updateUserLang,
  getOneUsersByPayId,
  updateSecureOrderUser,
  updateUserPayInfo,
  findUserByDate,
};
