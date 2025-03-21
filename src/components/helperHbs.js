const getStatus = (status) => {
  if (status === "approved") {
    return "Оплачено";
  } else if (status === null) {
    return "Не оплачено";
  } else if (status === "declined") {
    return "ВІДХИЛЕНО";
  } else if (status === "inprocessing") {
    return "Платіж відправлений, але не отриманий (очікується підтвердження)";
  } else if (status === "deleted") {
    return "Відписався";
  }
};

const getColorStatus = (status) => {
  if (status === "approved") {
    return "user-list-ok";
  } else if (status === null) {
    return "user-list-null";
  } else if (status === "declined") {
    return "user-list-declined";
  } else if (status === "inprocessing") {
    return "user-list-processing";
  } else if (status === "deleted") {
    return "user-list-dell";
  }
};

module.exports = { getStatus, getColorStatus };
