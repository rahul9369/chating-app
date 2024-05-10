const express = require("express");
const router = express.Router();
const User = require("../models/user");
const passport = require("passport");

router.get("/register", async (req, res) => {
  res.render("auth/signup");
});

router.post("/register", async (req, res) => {
  try {
    const user = new User({
      username: req.body.username,
      email: req.body.email,
    });
    const newUser = await User.register(user, req.body.password);
    req.flash("success", "Registered successfully");
    res.redirect("/chat");
  } catch (e) {
    req.flash("error", "Please Enter Unique Username");
    res.redirect("/register");
  }
});

router.get("/login", async (req, res) => {
  res.render("auth/login");
});

router.post(
  "/login",
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true,
  }),
  function (req, res) {
    try {
      req.flash("success", `Welcome back!! ${req.user.username}`);
      res.redirect("/chat");
    } catch (e) {
      req.flash("error", "Please enter the correct username and password");
    }
  }
);

router.get("/logout", (req, res, next) => {
  req.logout(function (err) {
    if (err) {
      return next(err);
    }
    req.flash("success", "logged out successfully");
    res.redirect("/login");
  });
});

module.exports = router;
