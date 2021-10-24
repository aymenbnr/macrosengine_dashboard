const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Licenses = require("../models/License");
const Settings = require("../models/Setting");
const Projects = require("../models/Project");
const Codes = require("../models/Code");
const ApiKey = require("../models/ApiKey");
const Logs = require("../models/Log");
const Version = require("../models/Version");
const Users = require("../models/User");

// Welcome Page
router.get("/", forwardAuthenticated, (req, res) => res.render("welcome"));

// Dashboard
router.get("/dashboard", ensureAuthenticated, async (req, res) => {
  const licenses = await Licenses.find();
  const projects = await Projects.find();
  var yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  var lastweek = new Date();
  lastweek.setDate(lastweek.getDate() - 7);
  var today = new Date();
  const orderstoday = await Logs.find({
    logtype: "order",
    logdate: {
      $lte: today,
      $gt: yesterday,
    },
  });

  res.render("dashboard", {
    projects: projects,
    licenses: licenses,
    orderstoday: orderstoday,
    user: req.user,
  });
});

// Licenses
router.get("/licenses", ensureAuthenticated, async (req, res) => {
  const licenseKeys = await Licenses.find();
  //res.json(licenseKeys);
  res.render("licenses", {
    licenses: licenseKeys,
    user: req.user,
  });
});

// Licenses
router.get("/apisettings", ensureAuthenticated, async (req, res) => {
  const apikey = await Settings.findOne({ name: "apikey" });
  var apiSettings = {
    apikey: "",
  };
  if (apikey) {
    apiSettings.apikey = apikey.value;
  }
  res.render("apikeys", {
    apisettings: apiSettings,
    user: req.user,
  });
});

// Licenses
router.get("/logs", ensureAuthenticated, async (req, res) => {
  const orderLogs = await Logs.find();
  res.render("orderlogs", {
    orderslogs: orderLogs,
    user: req.user,
  });
});

// projects
router.get("/projects", ensureAuthenticated, async (req, res) => {
  const projectsList = await Projects.find();
  res.render("projects", {
    projects: projectsList,
    user: req.user,
  });
});

// codes
router.get("/codesmanager", ensureAuthenticated, async (req, res) => {
  const codesList = await Codes.find();
  res.render("codesmanager", {
    codes: codesList,
    user: req.user,
  });
});

// Users
router.get("/userslist", ensureAuthenticated, async (req, res) => {
  const usersList = await Users.find();
  res.render("users", {
    userslist: usersList,
    user: req.user,
  });
});

// Settings GET
router.get("/msgconfigs", ensureAuthenticated, async (req, res) => {
  const lic_success = await Settings.findOne({
    name: "lic_success",
  });
  const lic_failed = await Settings.findOne({
    name: "lic_failed",
  });
  const lic_deactivated = await Settings.findOne({
    name: "lic_deactivated",
  });
  const lic_expired = await Settings.findOne({
    name: "lic_expired",
  });

  const lic_exceeded = await Settings.findOne({
    name: "lic_exceeded",
  });
  res.render("license-msg-settings", {
    lic_success: lic_success.value,
    lic_failed: lic_failed.value,
    lic_deactivated: lic_deactivated.value,
    lic_expired: lic_expired.value,
    lic_exceeded: lic_exceeded.value,
    user: req.user,
  });
});

// Settings GET
router.get("/mainsettings", ensureAuthenticated, async (req, res) => {
  res.render("mainsettings", {
    user: req.user,
  });
});

// Settings POST
router.post("/settings", ensureAuthenticated, async (req, res) => {
  let {
    lic_success,
    lic_failed,
    lic_deactivated,
    lic_expired,
    lic_exceeded,
  } = req.body;

  const licsuccess = await Settings.findOne({
    name: "lic_success",
  }).update({
    value: lic_success,
  });

  const licfailed = await Settings.findOne({
    name: "lic_failed",
  }).update({
    value: lic_failed,
  });

  const licdeactivated = await Settings.findOne({
    name: "lic_deactivated",
  }).update({
    value: lic_deactivated,
  });

  const licexpired = await Settings.findOne({
    name: "lic_expired",
  }).update({
    value: lic_expired,
  });

  const licexceeded = await Settings.findOne({
    name: "lic_exceeded",
  }).update({
    value: lic_exceeded,
  });

  req.flash("success_msg", `Settings has been updated!`);
  res.redirect("/settings");
});

// IPN Settings
router.post("/ipnsettings", ensureAuthenticated, async (req, res) => {
  let { cb_secret, jvzoo_secret } = req.body;

  const getcbSecret = await Settings.findOne({
    name: "cb_secret",
  }).update({
    value: cb_secret,
  });

  const getjvzooSecret = await Settings.findOne({
    name: "jvzoo_secret",
  }).update({
    value: jvzoo_secret,
  });

  req.flash("success_msg", `IPN Settings has been updated!`);
  res.redirect("/ipnsettings");
});

// IPN Settings GET
router.get("/ipnsettings", ensureAuthenticated, async (req, res) => {
  const getcbSecret = await Settings.findOne({
    name: "cb_secret",
  });
  const getjvzooSecret = await Settings.findOne({
    name: "jvzoo_secret",
  });
  res.render("ipnsettings", {
    cb_secret: getcbSecret.value,
    jvzoo_secret: getjvzooSecret.value,
    user: req.user,
  });
});

module.exports = router;
