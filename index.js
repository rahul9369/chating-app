const express = require("express");
const session = require("express-session");
const app = express();
const path = require("path");
const http = require("http");
const socketio = require("socket.io");
const server = http.createServer(app);
const io = socketio(server);
const passport = require("passport");
const localStrategy = require("passport-local");
const authRoutes = require("./router/auth");
const User = require("./models/user");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const { isLoggedIn } = require("./middleware");

require("dotenv").config();

mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log("db connect");
  })
  .catch((e) => {
    console.log(e.message);
  });
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(express.urlencoded({ extended: true }));

app.use(
  session({
    secret: "weneedssomebettersecret",
    resave: false,
    saveUninitialized: true,
  })
);

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

const users = {};

io.on("connection", (socket) => {
  socket.on("login", (data) => {
    // console.log(data.id);
    users[socket.id] = data.name;
  });

  socket.on("send_msg", (data) => {
    console.log(data);
    io.emit("recieved_msg", {
      msg: data.msg,
      // id: socket.id,
      // name: users[socket.id],
      name: data.name,
    });
  });
});

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  res.locals.currentUser = req.user?.username;
  next();
});

app.get("/", (req, res) => {
  res.render("products/landing");
});
app.get("/chat", isLoggedIn, (req, res) => {
  res.render("products/chat");
});

app.use(authRoutes);

server.listen(3001, () => {
  console.log("server running at port 3001");
});
