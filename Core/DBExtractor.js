const License = require("../models/License");
const Project = require("../models/Project");
const Version = require("../models/Version");
const LicenseLog = require("../models/LicenseLog");
const Activation = require("../models/Activation");
const UIDGenerator = require("uid-generator");
const LicenseFormatter = require("../Core/LicenseFormatter");
const messages = require("../config/messages");
const Settings = require("../models/Setting");
var fs = require("fs");
var JSZip = require("jszip");
const { saveAs } = require("file-saver");
const DateFormatter = require("../Core/DateFormatter");

//Licenses functions
async function GetLicenseById(id) {
  return await License.findById(id);
}

async function GetOneLicense(license) {
  return await License.findOne({ licensekey: license });
}

async function GetLicenses() {
  return await License.find();
}

//Projects functions

async function GetProjectById(id) {
  return await Project.findById(id);
}

async function GetOneProject(objValue) {
  return await Project.findOne(objValue);
}

async function GetProjects() {
  return await Project.find();
}

//Activations Functions

async function GetLicenseActivation(license, hwid) {
  return await Activation.findOne({
    hardwareId: hwid,
    licensekey: license,
  });
}

async function GetLicenseActivations(license) {
  return await Activation.find({
    licensekey: license,
  });
}

async function DeleteLicenseActivations(license) {
  await Activation.deleteMany({
    licensekey: license,
  });
}

//Extract API Settings

async function GetApiKey() {
  return await Settings.findOne({ name: "apikey" });
}

async function CreateZipBackup() {
  var zip = new JSZip();
  var licenses = await License.find();
  var projects = await Project.find();
  var versions = await Version.find();
  var licenselogs = await LicenseLog.find();
  var activations = await Activation.find();
  // Add a top-level, arbitrary text file with contents
  zip.file("licenses.json", JSON.stringify(licenses));
  zip.file("projects.json", JSON.stringify(projects));
  zip.file("versions.json", JSON.stringify(versions));
  zip.file("licenselogs.json", JSON.stringify(licenselogs));
  zip.file("activations.json", JSON.stringify(activations));
  return zip.generateAsync({ type: "base64" }).then(function (base64) {
    return "data:application/zip;base64," + base64;
  });
}

async function SaveBlobBackup() {
  var zip = new JSZip();
  var licenses = await License.find();
  var projects = await Project.find();
  var versions = await Version.find();
  var licenselogs = await LicenseLog.find();
  var activations = await Activation.find();
  // Add a top-level, arbitrary text file with contents
  zip.file("licenses.json", JSON.stringify(licenses));
  zip.file("projects.json", JSON.stringify(projects));
  zip.file("versions.json", JSON.stringify(versions));
  zip.file("licenselogs.json", JSON.stringify(licenselogs));
  zip.file("activations.json", JSON.stringify(activations));
  var todayDate = DateFormatter.GetDateOnly(new Date());
  var backupfile = `backup-${todayDate}.zip`;
  zip.generateAsync({ type: "blob" }).then(function (content) {
    // see FileSaver.js
    saveAs(content, backupfile);
  });
}

module.exports = {
  GetLicenseById: GetLicenseById,
  GetOneLicense: GetOneLicense,
  GetLicenses: GetLicenses,
  GetProjectById: GetProjectById,
  GetOneProject: GetOneProject,
  GetProjects: GetProjects,
  GetLicenseActivation: GetLicenseActivation,
  GetLicenseActivations: GetLicenseActivations,
  DeleteLicenseActivations: DeleteLicenseActivations,
  ApiKey: GetApiKey,
  CreateZipBackup: CreateZipBackup,
  SaveBlobBackup: SaveBlobBackup,
};
