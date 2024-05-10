// Function to scroll the chat container to the bottom
function scrollToBottom() {
  var chatContainer = document.querySelector(".chat-container");
  chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Scroll to bottom when page loads
window.onload = scrollToBottom;

console.log("hii");

const username = document.getElementById("98name");
console.log(username.value);

const socket = io();
// $("#chat").hide();
// $("#login-btn").click(() => {
//   socket.emit("login", {
//     name: $("#login-inp").val(),
//   });
//   $("#login").hide();
//   $("#chat").show();
// });

$("#send-btn").click(() => {
  socket.emit("send_msg", {
    msg: $("#inp").val(),
    name: username.value,
  });
  $("#inp").val("");
});

socket.on("recieved_msg", (data) => {
  // $("#list").append(`<li>${data.id}: says - ${data.msg}</li>`);
  // console.log(socket.id);
  console.log(data);
  console.log(username.value);
  if (data.name === username.value) {
    // console.log("this side sender");
    $("#list").append(
      `<div class="sender1"><span class="message sender">${data.name} says - ${data.msg}</span></div>`
    );
  } else {
    $("#list").append(
      `<div class="reciver1"><span class="message receiver">${data.name} says - ${data.msg}</span></div>`
    );
  }
  scrollToBottom();
});
