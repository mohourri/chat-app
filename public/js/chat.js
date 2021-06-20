const socket = io();

//elements
const $messageForm = document.querySelector("#message-form");
const $messageInput = document.querySelector("#message");
const $messageButton = document.querySelector("#message-button");
const $LocationButton = document.querySelector("#send-location");
const $messages = document.querySelector("#messages");

//Templates
const messageTemplate = document.querySelector("#message-template").innerHTML;
const linkTemplate = document.querySelector("#location-template").innerHTML;
const serverMessageTemplate = document.querySelector(
  "#serverMessageTemplate"
).innerHTML;
const sidebarTemplate = document.querySelector("#sidebar-template").innerHTML;

//Auto scroll

const autoScroll = () => {
  //new message element
  const $newMessage = $messages.lastElementChild;

  // Height of the new message
  const newMessageStyles = getComputedStyle($newMessage);
  const newMessageMargin = parseInt(newMessageStyles.marginBottom);
  const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

  // Visible height
  const visibleHeight = $messages.offsetHeight;

  // Height of messages container
  const containerHeight = $messages.scrollHeight;

  //How far have I scrolled ?
  const scrollOffset = $messages.scrollTop + visibleHeight;

  if (containerHeight - newMessageHeight <= scrollOffset) {
    $messages.scrollTop = $messages.scrollHeight;
  }
};

//get user infos
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

socket.emit("join", { username, room }, (error) => {
  if (error) {
    alert(error);
    location.href = "/";
  }
});

socket.on("message", ({ username, message, createdAt }) => {
  const html = Mustache.render(messageTemplate, {
    message,
    username,
    createdAt: moment(createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("serverMessage", ({ serverMessage }) => {
  const html = Mustache.render(serverMessageTemplate, { serverMessage });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

socket.on("locationLink", ({ username, location, createdAt }) => {
  const html = Mustache.render(linkTemplate, {
    location,
    username,
    createdAt: moment(createdAt).format("h:mm a"),
  });
  $messages.insertAdjacentHTML("beforeend", html);
  autoScroll();
});

$messageForm.addEventListener("submit", (e) => {
  e.preventDefault();
  //disable
  $messageButton.setAttribute("disabled", "true");
  const message = e.target.elements.message.value;
  socket.emit(
    "sendMessage",
    { message, createdAt: new Date().getTime() },
    (error) => {
      //ennable
      $messageButton.removeAttribute("disabled");
      $messageInput.value = "";
      $messageInput.focus();
      if (error) {
        return alert(error);
      }
    }
  );
});

socket.on("roomData", ({ room, usersList }) => {
  console.log(room + " " + usersList.length);
  const html = Mustache.render(sidebarTemplate, { room, usersList });
  document.querySelector("#sidebar").innerHTML = html;
});

$LocationButton.addEventListener("click", (e) => {
  e.preventDefault();
  if (!navigator.geolocation) {
    return alert("your navigator doesn't support geolocation !");
  }
  //disable
  $LocationButton.setAttribute("disabled", "disabled");

  navigator.geolocation.getCurrentPosition(({ coords }) => {
    socket.emit(
      "sendLocation",
      {
        lat: coords.latitude,
        long: coords.longitude,
        createdAt: new Date().getTime(),
      },
      (acknow) => {
        //ennable
        $LocationButton.removeAttribute("disabled");
      }
    );
  });
});
