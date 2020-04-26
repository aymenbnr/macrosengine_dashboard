const express = require("express");
const router = express.Router();
const Logs = require("../models/Log");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");

// add api key
router.get("/clear", ensureAuthenticated, async (req, res) => {
  Logs.deleteMany({}, function (err, result) {
    if (err) {
      res.send(err);
    } else {
      req.flash("success_msg", `logs has been cleared!`);
      res.redirect("/logs");
    }
  });
});

module.exports = router;
