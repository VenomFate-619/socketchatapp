const express = require("express");
const app = express();
const path = require("path");
const http = require("http").createServer(app);
let io = require("socket.io")(http);
var valid = require("./public/js/validation.js");
const port = process.env.PORT || 8000;
const generator = require("./util/message");
const memeber=require('./util/user')
const users=new memeber()
// middleware
// app.use(express.static(path.join(__dirname + "public")));
app.use(express.static("public"));
var bodyparser = require("body-parser");
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));

// route
app.get("/", (req, res) => res.sendFile("html/form.html", { root: "public" }));
app.get("/chat", (req, res) =>
  res.sendFile("html/index.html", { root: "public" })
);
// io
io.on("connection", (socket) => {
  console.log("a New user just  connected");
  socket.on("join", (query, callback) => {
    if ((!valid(query.usr)) || (!valid(query.room))) {
     return  callback("name and room is required");
    }
    socket.join(query.room)
    users.removeUser(socket.id)
    users.addUser(socket.id,query.usr,query.room)
    io.to(query.room).emit('updateUsersList',users.getUserList(query.room))
    socket.emit("serverMsg", generator("Admin", "Welcome"));
    socket.broadcast.to(query.room).emit("serverMsg", generator("Admin", `${query.usr} joined`));
    callback();
  
  });

  // msg from cleint
  socket.on("createmsg", (msg) => {
    console.log("client", msg);
    // msg to all client
    // io.emit('serverMsg', {
    //   from: msg.from,
    //   text: msg.text,
    //   time: new Date()
    // })
    io.to(msg.room).emit("serverMsg", generator(msg.from, msg.text));
  });

  // disconnectin
  socket.on("disconnect", () => {
    console.log("user disconnected");
    let leave=users.removeUser(socket.id)
    if(leave)
    {
      io.to(leave.room).emit('updateUsersList',users.getUserList(leave.room))
      io.to(leave.room).emit('serverMsg',generator('Admin',`${leave.name} has left  ${leave.room} room`))
    }
  });
});
http.listen(port, () => console.log(`Example app listening on port ${port}!`));
