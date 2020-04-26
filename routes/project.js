const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Project = require("../models/Project");
const Version = require("../models/Version");
const UIDGenerator = require("uid-generator");
//var fetch = require("isomorphic-unfetch");

// add project GET
router.get("/add", ensureAuthenticated, async (req, res) => {
  const uidgen = new UIDGenerator(UIDGenerator.BASE16);
  const uid1 = await uidgen.generate();
  const uid2 = await uidgen.generate();

  //var test = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json");
  //console.log(test.bpi.USD.rate);
  res.render("project-add", {
    secretkey: uid1 + uid2,
    user: req.user,
  });
});

// add project POST
router.post("/add", ensureAuthenticated, (req, res) => {
  const {
    projectname,
    secretkey,
    mainupdateurl,
    installerurl,
    nbactivations,
    activetrials,
    trialsruns,
    notes,
  } = req.body;
  var demoenabled = false;
  if (activetrials == "yes") {
    demoenabled = true;
  }

  const newProject = new Project({
    name: projectname,
    secretkey: secretkey,
    updateurl: mainupdateurl,
    installerurl: installerurl,
    notes: notes,
    activations: nbactivations,
    demotries: trialsruns,
    demo: demoenabled,
    latestVersion: "",
    latestRelease: "",
  });
  newProject.save().then((project) => {
    req.flash("success_msg", `Project ${project.name} has been created`);
    res.redirect("/projects");
  });
});

// edit project GET
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  var proj = await Project.findById(req.params.id);
  var versions = await Version.find({
    projectName: proj.name,
  });
  //var test = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json");
  //console.log(test.bpi.USD.rate);
  res.render("project-edit", {
    project: proj,
    versions: versions,
    user: req.user,
  });
});

// edit project GET
router.get("/view/:id", ensureAuthenticated, async (req, res) => {
  var proj = await Project.findById(req.params.id);
  res.render("project-view", {
    project: proj,
    user: req.user,
  });
});

//delete project
router.get("/delete/:id", ensureAuthenticated, (req, res) => {
  // delete project code here

  Project.findById(req.params.id).then((project) => {
    if (project) {
      Project.deleteOne(project);
    }
  });

  req.flash("success_msg", "Project deleted!");
  res.redirect("/projects");
});

module.exports = router;
