// emoji pack
// import { EmojiButton } from "./node_modules/@joeattardi/emoji-button/dist/index";
// util
var stringToHTML = function (str) {
  var parser = new DOMParser();
  var doc = parser.parseFromString(str, "text/html");
  // console.log(doc.body);
  return doc.body;
};
const capitalize = (text) => {
  text = text.split(" ");
  let converted = ``;

  for (let i = 0; i < text.length; i++) {
    text[i] = `${text[i].charAt(0).toUpperCase()}${text[i].substr(1)}`;
  }

  for (let t of text) {
    converted += `${t} `;
  }

  converted = converted.trim();
  return converted;
};

var t = document.querySelector(".input textarea");
// var trigger = document.getElementById("trigger");
// const picker = new EmojiButton({
//   theme: "auto",
//   autoHide: false,
//   showPreview: false,
//   position: "top-end",
//   // position:'bottom-start',
//   autoFocusSearch: false,
//   //   for mobile
//   emojiSize: "1.4em",
// });
// picker.on("emoji", (selection) => {

//   t.value += selection.emoji;

// });

// trigger.addEventListener("click", () => picker.togglePicker(trigger));

// url
var parsedUrl = new URL(window.location.href);
var query = {
  usr: parsedUrl.searchParams.get("usr"),
  room: parsedUrl.searchParams.get("room"),
};
// socket
var socket = io();
// on connection
socket.on("connect", function () {
  console.log("new user connected");
  document.querySelector("body > div.intro > div.roomName").innerHTML =
    query.room;
  socket.emit("join", query, function (err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log(query.usr + " joined");
    }
  });
});
// participate
socket.on("updateUsersList", function (user) {
  // update users number
  var no=document.querySelector("body > div.intro > div.part > div.no > span");
  no.innerHTML=user.length+" "
  let template = document.getElementById("member").innerHTML;
  var member = document.querySelector(
    "body > div.intro > div.part > div.member"
  );
  if (member.innerHTML != "") {
    member.innerHTML = "";
  }
  // console.log(user);
  user.forEach((element) => {
    if (element !== query.usr) {
      let rendered = Mustache.render(template, {
        name: capitalize(element),
      });
      let res = stringToHTML(rendered);
      member.prepend(res.getElementsByTagName("div")[0]);
    }
  });
});
// from server
socket.on("serverMsg", (msg) => {
  let template = document.getElementById("greet").innerHTML;
  let rendered = Mustache.render(template, {
    // from: msg.from,
    text: msg.text,
    // time: msg.time,
  });
  let res = stringToHTML(rendered);
  document.querySelector(".main").append(res.getElementsByTagName("div")[0]);
});
// server disconnection
socket.on("disconnect", function () {
  alert(" server disconnected");
});
// reciving msg
socket.on('other',function(msg){
  let template = document.getElementById("otherMsg").innerHTML;
  let rendered = Mustache.render(template, {
    name:capitalize(msg.from),
    msg: msg.text,
    time: moment().format("LT"),
  });
  let res = stringToHTML(rendered);
  document.querySelector(".main").append(res.getElementsByTagName("div")[0]);
})
// sending msg to server
document.querySelector("body > span").onclick = function (e) {
  // to server
  if (t.value != "") {
    socket.emit("createmsg", {
      from: parsedUrl.searchParams.get("usr"),
      text: t.value,
      room: parsedUrl.searchParams.get("room"),
    });
    // rendering
    let template = document.getElementById("meMsg").innerHTML;
    let rendered = Mustache.render(template, {
      msg: t.value,
      time: moment().format("LT"),
    });
    let res = stringToHTML(rendered);
    document.querySelector(".main").append(res.getElementsByTagName("div")[0]);
    t.value = "";
  }
};

