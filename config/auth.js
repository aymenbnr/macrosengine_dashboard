const Settings = require("../models/Setting");
const ApiKeys = require("../models/ApiKey");
var nJwt = require("njwt");

module.exports = {
  ensureAuthenticated: function (req, res, next) {
    if (req.isAuthenticated()) {
      return next();
    }
    req.flash("error_msg", "Please log in to view that resource");
    res.redirect("/users/login");
  },
  ensureAPIKeyValid: async function (req, res, next) {
    if (req.query.apikey && req.query.apikey != "") {
      const apiKeys = await ApiKeys.findOne({ key: req.query.apikey });
      var apiKeyValid = false;
      if (apiKeys) {
        apiKeyValid = true;
      }

      if (apiKeyValid) {
        return next();
      } else {
        respObject = {
          status: "error",
          message: "api key is not valid",
        };
        var jsonResponse = JSON.stringify(respObject);
        res.send(respObject);
      }
    }
    respObject = {
      status: "error",
      message: "no api key used",
    };
    var jsonResponse = JSON.stringify(respObject);
    res.send(respObject);
    //res.redirect('/users/login');
  },
  ensureTokenValid: async function (req, res, next) {
    const { token } = req.body;

    const apikey = await Settings.findOne({ name: "apikey" });
    if (apikey) {
      console.log(token);
      nJwt.verify(token, apikey.value, "HS256", (error, payload) => {
        if (error) {
          respObject = {
            status: "error",
            message: "unauthorized access",
          };
          res.json(respObject);
        } else {
          return next();
        }
      });
    }

    //res.redirect('/users/login');
  },
  forwardAuthenticated: function (req, res, next) {
    if (!req.isAuthenticated()) {
      return next();
    }
    res.redirect("/dashboard");
  },
};
