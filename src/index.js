const express = require("express");
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const Filter = require("bad-words");
const {
  generatMessage,
  generateLocationMessage,
  generateserverMessage,
} = require("./utils/messageGenerator");
const {
  addUser,
  removeUser,
  getUser,
  getRoomUsers,
} = require("./utils/userTracker");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const PORT = process.env.PORT || 3000;

const publiDir = path.join(__dirname, "../public");
app.use(express.static(publiDir));

io.on("connection", (socket) => {
  //
  //
  socket.on("sendMessage", ({ message }, callback) => {
    const { error, user } = getUser(socket.id);
    if (error) {
      callback(error);
    }
    const wordfilter = new Filter();
    if (wordfilter.isProfane(message)) {
      return callback("Orfane message !");
    }
    io.to(user.room).emit("message", generatMessage(user.username, message));
    callback();
  });

  socket.on("join", (options, callback) => {
    //
    const { error, user } = addUser({
      id: socket.id,
      ...options,
    });

    if (error) {
      return callback(error);
    }

    socket.join(user.room);
    socket.broadcast
      .to(user.room)
      .emit(
        "serverMessage",
        generateserverMessage(`${user.username} has joined.`)
      );
    socket.emit(
      "serverMessage",
      generateserverMessage(`welcome to ${user.room} !`)
    );
    io.to(user.room).emit("roomData", {
      room: user.room,
      usersList: getRoomUsers(user.room),
    });

    callback();
  });

  socket.on("disconnect", (callback) => {
    const { user } = removeUser(socket.id);

    io.to(user.room).emit(
      "serverMessage",
      generateserverMessage(`${user.username} has left !`)
    );
    io.to(user.room).emit("roomData", {
      room: user.room,
      usersList: getRoomUsers(user.room),
    });
    callback();
  });

  socket.on("sendLocation", ({ lat, long }, callback) => {
    const { error, user } = getUser(socket.id);
    if (error) {
      callback(error);
    }
    io.to(user.room).emit(
      "locationLink",
      generateLocationMessage(
        user.username,
        `https://www.google.com/maps?q=${lat},${long}`
      )
    );
    callback();
  });
});

server.listen(PORT, () => {
  console.log(`serever is up in port ${PORT}`);
});
