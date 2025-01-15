const mongoose = require("mongoose");

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

// const subsUsersPost = mongoose.model("subsUsers", subsUsersSchema);

const createUser = () => {
  connectDb();
  console.log(userInfo);

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

const updateSecureOrderUser = (userId, signature, order_id) => {
  connectDb();
  SubsUsersSchema.updateOne(
    { user_id: userId },
    {
      $set: {
        signature: signature,
        order_id,
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

const updateUser = (
  userId,
  pay,
  nameBtn,
  order_id,
  payment_id,
  title,
  lang
) => {
  connectDb();
  SubsUsersSchema.updateOne(
    { user_id: userId },
    {
      $set: {
        pay: pay,
        subscribe: 1,
        order_id,
        payment_id,
        order_desc: title,
        lang: lang,
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

//   order_id: "",
//   order_status: "",
//   rectoken: "",
//   order_status: "",

const updateUserForPay = async (
  pay_id,
  mail,
  orderId,
  status,
  rectoken,
  timePay,
  amount,
  payment_system,
  card_type
) => {
  try {
    connectDb();
    const user = await getOneUsersByPayId(pay_id);
    pay_id === user[0].payment_id
      ? SubsUsersSchema.updateOne(
          { payment_id: pay_id },
          {
            $set: {
              deleteDate: null,
              payment: {
                sender_email: mail,
                order_id: orderId,
                order_status: status,
                rectoken: rectoken,
                datePay: timePay,
                dateEnd: dateSubs().dateEndOne,
                amount: Number(amount),
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
        )
      : console.log("Щось пішло не так");

    connectDb().on("error", console.log).on("disconnect", connectDb);
  } catch (error) {
    console.log(error);
  }
};
const updateUserStatusPay = async (pay_id, status, system, card) => {
  try {
    connectDb();
    const user = await getOneUsersByPayId(pay_id);
    pay_id === user[0].payment_id
      ? SubsUsersSchema.updateOne(
          { payment_id: pay_id },
          {
            $set: {
              "payment.order_status": status,
              "payment.payment_system": system,
              "payment.card_type": card,
            },
          },
          (err, result) => {
            if (err) {
              console.log("Unable update user: ", err);
            }
          }
        )
      : console.log("Щось пішло не так");

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
const getOneUsersByPayId = async (pay_id) => {
  connectDb();
  const user = await SubsUsersSchema.find({ payment_id: pay_id });
  connectDb().on("error", console.log).on("disconnect", connectDb);
  return user;
};
const getOneUserById = async (user_id) => {
  connectDb();
  const user = await SubsUsersSchema.find({ user_id: user_id });
  connectDb().on("error", console.log).on("disconnect", connectDb);
  return user;
};

const deletePayUser = (userId) => {
  connectDb();
  SubsUsersSchema.updateOne(
    { user_id: userId },
    {
      $set: {
        "payment.order_id": null,
        "payment.order_status": "deleted",
        "payment.rectoken": null,
        "payment.amount": null,
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
module.exports = {
  createUser,
  updateUser,
  getAllUsers,
  getOneUserById,
  updateUserForPay,
  deletePayUser,
  recurringPayResponseDB,
  updateUserStatusPay,
  updateUserLang,

  updateSecureOrderUser,
  updateUserPayInfo,
};
