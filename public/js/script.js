var parsedUrl = new URL(window.location.href);
var socket = io();
socket.on("connect", function () {
  console.log("new user connected");
//  var parsedUrl = new URL(window.location.href);
  var query = {
    usr: parsedUrl.searchParams.get("usr"),
    room: parsedUrl.searchParams.get("room")
  };
  socket.emit("join", query, function (err) {
    if (err) {
      alert(err);
      window.location.href = "/";
    } else {
      console.log("fwg3g");
    }
  });
 
});
socket.on('updateUsersList',function(user){
  console.log(user);
})
// from server
socket.on("serverMsg", (msg) => {
  var template = document.getElementById("temp").innerHTML;
  var rendered = Mustache.render(template, {
    from: msg.from,
    text: msg.text,
    time: msg.time,
  });
  var h = document.createElement("div");
  h.innerHTML = rendered;
  document.body.append(h);
  // var item=document.createElement('li')
  // item.innerText=`from:${msg.from} msg:${msg.text} time:${msg.time}`
  // document.body.appendChild(item)
});
// server disconnection
socket.on("disconnect", function () {
  console.log(" server disconnected");
});
document.querySelector("#send").onclick = function (e) {
  e.preventDefault();
  // to server
  if (document.forms[0].msg.value != "") {
    socket.emit("createmsg", {
      from: parsedUrl.searchParams.get("usr"),
      text: document.forms[0].msg.value,
      room: parsedUrl.searchParams.get("room")
    });
    document.forms[0].reset();
  }
};
