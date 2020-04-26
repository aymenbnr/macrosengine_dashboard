const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");
// Load User model
const User = require("../models/User");
const { forwardAuthenticated, ensureAuthenticated } = require("../config/auth");

// Login Page
router.get("/login", forwardAuthenticated, (req, res) => res.render("login"));

// Register Page
router.get("/register", forwardAuthenticated, async (req, res) => {
  var masterUser = await User.findOne({ access: "master" });
  if (!masterUser) {
    res.render("register");
  } else {
    res.send("master has already been assigned");
  }
});

// Register
router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password,
          access: "master",
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash(
                  "success_msg",
                  "You are now registered and can log in"
                );
                res.redirect("/users/login");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

// Login
router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

// Logout
router.get("/logout", (req, res) => {
  req.logout();
  req.flash("success_msg", "You are logged out");
  res.redirect("/users/login");
});

// Edit User
router.post("/edit", ensureAuthenticated, async (req, res, next) => {
  const { name, email, newpass, newpass2, access } = req.body;
  let errors = [];

  if (!name || !email || !newpass || !newpass2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (newpass != newpass2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (newpass.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("users-edit", {
      errors,
      name,
      email,
      access,
      user: req.user,
    });
  } else {
    var user = await User.findOne({ email: email });
    if (user) {
      bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(newpass, salt, (err, hash) => {
          if (err) throw err;
          user.password = hash;
          user.access = access;
          user
            .save()
            .then((user) => {
              req.flash(
                "success_msg",
                `User name ${user.name} has been updated!`
              );
              res.redirect("/userslist");
            })
            .catch((err) => console.log(err));
        });
      });
    } else {
      res.send("error user non existent");
    }
  }
});

// edit user Page
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  var user = await User.findById(req.params.id);
  if (user) {
    res.render("users-edit", {
      name: user.name,
      email: user.email,
      access: user.access,
      user: req.user,
    });
  } else {
    res.send("user doesn't exist");
  }
});

// add user GET
router.get("/add", ensureAuthenticated, async (req, res) => {
  res.render("users-add", {
    name: "",
    email: "",
    password: "",
    password2: "",
    access: "user",
    user: req.user,
  });
});

// add a user POST
router.post("/add", ensureAuthenticated, (req, res) => {
  const { name, email, password, password2, access } = req.body;
  let errors = [];

  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please enter all fields" });
  }

  if (password != password2) {
    errors.push({ msg: "Passwords do not match" });
  }

  if (password.length < 6) {
    errors.push({ msg: "Password must be at least 6 characters" });
  }

  if (errors.length > 0) {
    res.render("users-add", {
      errors,
      name,
      email,
      password,
      password2,
      access,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already exists" });
        res.render("users-add", {
          errors,
          name,
          email,
          password,
          password2,
          access,
        });
      } else {
        const newUser = new User({
          name: name,
          email: email,
          password: password,
          access: access,
        });

        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(newUser.password, salt, (err, hash) => {
            if (err) throw err;
            newUser.password = hash;
            newUser
              .save()
              .then((user) => {
                req.flash("success_msg", `User ${user.name} has been added`);
                res.redirect("/userslist");
              })
              .catch((err) => console.log(err));
          });
        });
      }
    });
  }
});

module.exports = router;
