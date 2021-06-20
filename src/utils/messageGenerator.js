const generatMessage = (username, message) => {
  return {
    username,
    message,
    createdAt: new Date().getTime(),
  };
};

const generateLocationMessage = (username, location) => {
  return {
    username,
    location,
    createdAt: new Date().getTime(),
  };
};

const generateserverMessage = (serverMessage) => {
  return {
    serverMessage,
  };
};

module.exports = {
  generatMessage,
  generateLocationMessage,
  generateserverMessage,
};
