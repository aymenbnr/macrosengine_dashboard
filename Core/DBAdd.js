const License = require("../models/License");
const Project = require("../models/Project");
const User = require("../models/User");
const Version = require("../models/Version");
const LicenseLog = require("../models/LicenseLog");
const Activation = require("../models/Activation");
const UIDGenerator = require("uid-generator");
const LicenseFormatter = require("../Core/LicenseFormatter");
const messages = require("../config/messages");
const Settings = require("../models/Setting");

async function AddLicense(license) {
  const newLicense = new License({
    project: license.project,
    licensekey: license.licensekey,
    name: license.name,
    email: license.email,
    activations: 0,
    enabled: license.enabled,
    expirable: license.expirable,
    expirydate: license.expirydate,
    date: license.date,
  });
  await newLicense.save();
}

async function ImportLicenses(licenses) {
  licenses.forEach(async (license) => {
    var getLicense = await License.findOne({ licensekey: license.licensekey });
    if (!getLicense) {
      const newLicense = new License({
        project: license.project,
        licensekey: license.licensekey,
        name: license.name,
        email: license.email,
        activations: license.activations,
        enabled: license.enabled,
        expirable: license.expirable,
        expirydate: license.expirydate,
        date: license.date,
      });
      await newLicense.save();
    }
  });
}

async function ImportProjects(projects) {
  projects.forEach(async (project) => {
    var getProject = await Project.findOne({ name: project.name });
    if (!getProject) {
      const newProject = new Project({
        name: project.name,
        secretkey: project.secretkey,
        updateurl: project.updateurl,
        installerurl: project.installerurl,
        notes: project.notes,
        activations: project.activations,
        demotries: project.demotries,
        demo: project.demo,
        latestVersion: project.latestVersion,
        latestRelease: project.latestRelease,
      });
      await newProject.save();
    }
  });
}

async function ImportVersions(versions) {
  versions.forEach(async (version) => {
    var getVersion = await Version.findOne({
      version: version.version,
      projectName: version.projectName,
    });

    if (!getVersion) {
      const newVersion = new Version({
        projectName: version.projectName,
        version: version.version,
        releasedate: version.releasedate,
        summary: version.summary,
        changelog: version.changelog,
        updateurl: version.updateurl,
      });
      await newVersion.save();
    }
  });
}

async function ImportUsers(users) {
  users.forEach(async (user) => {
    var getUser = await User.findOne({
      email: user.email,
    });

    if (!getUser) {
      const newUser = new User({
        name: user.name,
        email: user.email,
        password: user.password,
        access: user.access,
      });
      await newUser.save();
    }
  });
}

async function ImportActivations(activations) {
  activations.forEach(async (activation) => {
    var getActivation = await Activation.findOne({
      licensekey: activation.licensekey,
      hardwareId: activation.hardwareId,
    });

    if (!getActivation) {
      const newActivation = new Activation({
        licensekey: licensekey,
        hardwareId: hwid,
      });
      await newActivation.save();
    }
  });
}

async function ImportLogs(logs) {
  logs.forEach(async (log) => {
    var getLog = await Log.findOne({
      logtext: log.logtext,
      logdate: log.logdate,
    });

    if (!getLog) {
      const newLog = new Log({
        license: newLog.license,
        logtype: newLog.logtype,
        logtext: newLog.logtext,
        logdate: newLog.logdate,
        logsource: newLog.logsource,
      });
      await newLog.save();
    }
  });
}

async function ImportLicenseLogs(licenselogs) {
  licenselogs.forEach(async (licenselog) => {
    var getLicenseLog = await LicenseLog.findOne({
      licenseKey: licenselog.licenseKey,
    });

    if (!getLicenseLog) {
      const newLicenseLog = new LicenseLog({
        licenseKey: licenselog.licenseKey,
        activeDate: licenselog.activeDate,
        lastAccessDate: licenselog.lastAccessDate,
        lastIP: licenselog.lastIP,
      });
      await newLicenseLog.save();
    }
  });
}

async function AddLicenseActivation(key) {
  const license = await License.findOne({
    licensekey: key,
  });
  license.activations = license.activations++;
  await license.save();
}

async function DisableLicense(key) {
  const license = await License.findOne({
    licensekey: key,
  });
  license.activations = license.activations++;
  await license.save();
}

async function DisableLicenseByEmail(email, project) {
  const license = await License.findOne({
    project: project,
    email: email,
  });
  license.activations = license.activations++;
  await license.save();
}

// add activation

async function AddActivation(licensekey, hwid) {
  const newActivation = new Activation({
    licensekey: licensekey,
    hardwareId: hwid,
  });
  await newActivation.save();
}

module.exports = {
  AddLicense,
  AddActivation,
  AddLicenseActivation,
  DisableLicenseByEmail,
  DisableLicense,
};
