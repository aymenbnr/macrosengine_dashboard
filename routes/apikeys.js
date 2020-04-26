const express = require("express");
const router = express.Router();
const Settings = require("../models/Setting");
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const ApiKeys = require("../models/ApiKey");
const UIDGenerator = require("uid-generator");

// add api key
router.post("/save", ensureAuthenticated, async (req, res) => {
  const { apikeyname } = req.body;
  Settings.findOne({ name: "apikey" }).then((key) => {
    if (key) {
      key
        .update({ value: apikeyname })
        .save()
        .then((apikey) => {
          req.flash("success_msg", `API Key Settings Saved!`);
          res.redirect("/apisettings");
        });
    } else {
      const apiKey = new Settings({
        name: "apikey",
        value: apikeyname,
      })
        .save()
        .then((apikey) => {
          req.flash("success_msg", `API Key Settings Saved!`);
          res.redirect("/apisettings");
        });
    }
  });
});

module.exports = router;
