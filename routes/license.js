const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const License = require("../models/License");
const Project = require("../models/Project");
const LicenseLog = require("../models/LicenseLog");
const UIDGenerator = require("uid-generator");
const LicenseFormatter = require("../Core/LicenseFormatter");
const Logs = require("../models/Log");

const {
  GetLicenseById,
  GetOneLicense,
  GetLicenses,
  GetProjectById,
  GetOneProject,
  GetProjects,
  GetLicenseActivations,
  DeleteLicenseActivations,
  GetLicenseActivation,
  ApiKey,
} = require("../Core/DBExtractor");
const {
  AddActivation,
  AddLicenseActivation,
  AddLicense,
} = require("../Core/DBAdd");

// add license
router.get("/add", ensureAuthenticated, async (req, res) => {
  const projects = await Project.find();
  const uidgen = new UIDGenerator(UIDGenerator.BASE36);
  const uid = await uidgen.generate();
  var dashLicense = LicenseFormatter.DashFormatter(uid);
  res.render("license-add", {
    licenseKeyGen: dashLicense,
    projects: projects,
    user: req.user,
  });
});

// add license
router.post("/add", ensureAuthenticated, async (req, res) => {
  const { licensename, licenseemail, licensekey, licenseproject } = req.body;
  const activations = 0;
  const enabled = true;
  const expirable = false;
  const expiryDate = Date.now();
  const createdDate = Date.now();

  await AddLicense({
    project: licenseproject,
    licensekey: licensekey,
    name: licensename,
    email: licenseemail,
    activations: activations,
    enabled: enabled,
    expirable: expirable,
    expirydate: expiryDate,
    date: createdDate,
  });

  const newLog = new Logs({
    license: licensekey,
    logtype: "activity",
    logtext: "License created manually",
    logdate: createdDate,
    logsource: req.user.name,
  });
  await newLog.save();

  req.flash("success_msg", `License has been created`);
  res.redirect("/licenses");
});

router.post("/edit", ensureAuthenticated, async (req, res) => {
  const { licensename, licenseemail, licenseproject, enabled, _id } = req.body;

  var license = await License.findOne({
    _id: _id,
  });
  if (license == null) {
    console.log("no license found");
  }
  console.log("license enabled : " + enabled);
  license.project = licenseproject;
  license.name = licensename;
  license.email = licenseemail;
  if (enabled == "on") {
    license.enabled = true;
  } else {
    license.enabled = false;
  }

  license.save().then(() => {
    req.flash("success_msg", `License has been updated`);
    res.redirect("/licenses");
  });
});

//delete license
router.get("/delete/:id", ensureAuthenticated, (req, res) => {
  console.log(req.params.id);
  License.findByIdAndDelete(req.params.id).then((license) => {
    console.log("license key found : " + license.licensekey);
    req.flash("success_msg", "License deleted!");
    res.redirect("/licenses");
  });
});

router.get("/reset/:id", ensureAuthenticated, async (req, res) => {
  console.log(req.params.id);
  var license = await License.findByIdAndUpdate(req.params.id, {
    activations: 0,
  });
  await license.save();
  var licenseActivations = await DeleteLicenseActivations(license.licensekey);
  req.flash("success_msg", "License reset!");
  res.redirect("/license/view/" + req.params.id);
});

router.get("/disable/:id", ensureAuthenticated, async (req, res) => {
  console.log(req.params.id);
  var license = await License.findByIdAndUpdate(req.params.id, {
    enabled: false,
  });
  await license.save();
  req.flash("success_msg", "License disabled!");
  res.redirect("/license/view/" + req.params.id);
});

router.get("/enable/:id", ensureAuthenticated, async (req, res) => {
  console.log(req.params.id);
  var license = await License.findByIdAndUpdate(req.params.id, {
    enabled: true,
  });
  await license.save();
  req.flash("success_msg", "License disabled!");
  res.redirect("/license/view/" + req.params.id);
});

//edit license
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  const projects = await Project.find();
  License.findById(req.params.id).then((license) => {
    console.log("license key found : " + license.licensekey);
    res.render("license-edit", {
      license: license,
      projects: projects,
      user: req.user,
    });
  });
});

//view license
router.get("/view/:id", ensureAuthenticated, async (req, res) => {
  console.log(req.params.id);
  var license = await License.findById(req.params.id);
  var licenselog = await LicenseLog.findOne({
    licenseId: license.id,
  });
  if (licenselog == null) {
    licenselog = {
      licenseId: "",
      activeDate: "not active yet",
      lastAccessDate: "not used yet",
      lastIP: "N/A",
    };
  }
  res.render("license-view", {
    license: license,
    log: licenselog,
    user: req.user,
  });
});

module.exports = router;
