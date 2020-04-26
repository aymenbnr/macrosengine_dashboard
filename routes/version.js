const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const Project = require("../models/Project");
const Version = require("../models/Version");
const DateFormatter = require("../Core/DateFormatter");
const UIDGenerator = require("uid-generator");
var versiony = require("versiony");
//var fetch = require("isomorphic-unfetch");

// add version GET
router.get("/add/:id", ensureAuthenticated, async (req, res) => {
  var proj = await Project.findById(req.params.id);
  var versions = await Version.find({
    projectName: proj.name,
  });
  var version = "1.0.0";
  if (proj.latestVersion != "") {
    var v = versiony.version(proj.latestVersion).minor().get();
    version = v;
  }
  var releaseDate = DateFormatter.GetDateOnly(new Date());
  res.render("version-add", {
    version: version,
    projectName: proj.name,
    releaseDate: releaseDate,
    user: req.user,
  });
});

// edit version GET
router.get("/edit/:id", ensureAuthenticated, async (req, res) => {
  var proj = await Project.findById(req.params.id);
  var getVersion = await Version.findOne({
    projectName: proj.name,
    version: proj.latestVersion,
  });
  res.render("version-edit", {
    version: getVersion,
    user: req.user,
  });
});

// edit version POST
router.post("/edit/", ensureAuthenticated, async (req, res) => {
  const {
    projectname,
    version,
    updateurl,
    releasedate,
    summary,
    changelog,
  } = req.body;
  var getVersion = await Version.findOne({
    version: version,
    projectName: projectname,
  });
  if (getVersion) {
    getVersion.updateurl = updateurl;
    getVersion.releasedate = releasedate;
    getVersion.summary = summary;
    getVersion.changelog = changelog;
    await getVersion.save();
    req.flash(
      "success_msg",
      `project ${getVersion.projectName}'s version ${version} has been updated!`
    );
    res.redirect("/projects");
  } else {
    req.flash(
      "error_msg",
      `cannot update project ${getVersion.projectName}'s version ${version}!`
    );
    res.redirect("/projects");
  }
});

// add version POST
router.post("/add", ensureAuthenticated, async (req, res) => {
  const {
    projectname,
    version,
    updateurl,
    releasedate,
    summary,
    changelog,
  } = req.body;

  var getVersion = await Version.findOne({
    version: version,
    projectName: projectname,
  });

  if (getVersion) {
    let errors = [];
    errors.push({ msg: "Version already exists, use another version number" });
    res.render("version-add", {
      errors: errors,
      version: version,
      projectName: proj.name,
      releaseDate: releaseDate,
      summary: summary,
      changelog: changelog,
      user: req.user,
    });
  }

  const newVersion = new Version({
    projectName: projectname,
    version: version,
    releasedate: releasedate,
    summary: summary,
    changelog: changelog,
    updateurl: updateurl,
  });
  await newVersion.save();

  const project = await Project.findOneAndUpdate(
    { name: projectname },
    { latestVersion: version, latestRelease: releasedate }
  );

  req.flash(
    "success_msg",
    `version ${version} has been added to ${projectname}`
  );
  res.redirect("/projects");
});

// all versions GET
// show all versions for a particular project
router.get("/all/:id", ensureAuthenticated, async (req, res) => {
  var proj = await Project.findById(req.params.id);
  var versions = await Version.find({
    projectName: proj.name,
  });
  res.render("versions", {
    versions: versions,
    project: proj,
    user: req.user,
  });
});

//delete version
router.get("/delete/:id", ensureAuthenticated, (req, res) => {
  // delete project code here

  Version.findById(req.params.id).then((version) => {
    if (version) {
      Version.deleteOne(version);
      Project.findOne({ name: version.projectName }).then((project) => {
        if (project) {
          project.latestVersion = "";
          project.latestRelease = "";
          project.save().then((prj) => {
            req.flash(
              "success_msg",
              `version ${version.version} has been deleted from project ${prj.name}`
            );
            res.redirect(`/version/all/${prj.id}`);
          });
        } else {
          res.send("encountered an error : project not found");
        }
      });
    } else {
      res.send("encountered an error : version not found");
    }
  });
});

module.exports = router;
