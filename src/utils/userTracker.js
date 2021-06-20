var users = [];

const addUser = ({ id, username, room }) => {
  username = username.trim().toLowerCase();
  room = room.trim().toLowerCase();
  if (!username || !room) {
    return { error: "the username and room are required !" };
  }

  const existingUser = users.find(
    (user) => user.username === username && user.room === room
  );
  if (existingUser) {
    return { error: "user already exists !" };
  }
  const user = { id, username, room };
  users.push(user);
  return { user };
};

const removeUser = (id) => {
  const index = users.findIndex((user) => user.id === id);

  if (index !== -1) {
    return { user: users.splice(index, 1)[0] };
  } else {
    return (user = {});
  }
};

const getUser = (id) => {
  const user = users.find((user) => user.id === id);
  if (!user) {
    return { error: "user not exist !" };
  }

  return { user };
};

getRoomUsers = (room) => {
  room = room.trim().toLowerCase();
  return users.filter((user) => user.room === room);
};

module.exports = {
  addUser,
  removeUser,
  getUser,
  getRoomUsers,
};

//*******************************testing
// console.log(
//   "adding user: " +
//     addUser({ id: 11, username: "mohourri", room: "room1" }).username
// );
// console.log(
//   "adding user: " +
//     addUser({ id: 12, username: "uhourri", room: "room1" }).username
// );
// console.log(
//   "adding user: " +
//     addUser({ id: 13, username: "uness", room: "room1" }).username
// );
// console.log("total users: " + users.length);
// console.log("removing user: " + removeUser(11).room);
// console.log("total users: " + users.length);
