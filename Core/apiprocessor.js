const {
  GetLicenseById,
  GetOneLicense,
  GetLicenses,
  GetProjectById,
  GetOneProject,
  GetProjects,
  GetLicenseActivations,
  GetLicenseActivation,
  ApiKey,
  GetLatestVersion,
} = require("../Core/DBExtractor");
const { AddActivation, AddLicenseActivation } = require("../Core/DBAdd");
const messages = require("../config/messages");
const UIDGenerator = require("uid-generator");
const LicenseFormatter = require("../Core/LicenseFormatter");
var nJwt = require("njwt");

async function ProcessApiRequest(endpoint, req, res) {
  const { token } = req.body;
  const apikey = await ApiKey();
  if (apikey) {
    console.log("api key " + apikey.value);
    console.log("calling endpoint : " + endpoint);
    nJwt.verify(token, apikey.value, "HS256", async (error, payload) => {
      var claims = {
        random: payload.body.random,
        res: "n/a",
        message: "n/a",
      };

      if (error) {
        claims.res = "error";
        claims.message = error;
      } else {
        if (endpoint == "verify") {
          var resp = await VerifyEndpoint(payload);
          console.log(resp);
          claims.res = resp.status;
          claims.message = resp.message.value;
        }

        if (endpoint == "latest") {
          var resp = await LatestEndpoint(payload);
          console.log(resp);
          claims.res = resp.status;
          claims.message = resp.message;
        }

        var jwt = nJwt.create(claims, apikey.value, "HS256");
        var token = jwt.compact();
        res.send(token);
      }
    });
  } else {
    res.send("error");
  }
}

async function LatestEndpoint(payload) {
  var { secretkey } = payload.body;
  const getProject = await GetOneProject({ secretkey: secretkey });
  if (getProject) {
    const getVersion = await GetLatestVersion(getProject);
    var updateUrl = getProject.updateurl;
    if (getVersion.updateurl != "") {
      updateUrl = getVersion.updateurl;
    }
    var msg = {
      version: getVersion.version,
      update_url: updateUrl,
      releasedate: getVersion.releasedate,
      changelog: getVersion.changelog,
    };
    return { status: "OK", message: msg };
  } else {
    return {
      status: "ERROR",
      message: "a project with the same secret key is non existant!",
    };
  }
}

async function VerifyEndpoint(payload) {
  var { secretkey, license, hwid } = payload.body;
  var respstatus = "error";
  var respmsg = await messages.failed();
  var projectname = "n/a";
  const getProject = await GetOneProject({ secretkey: secretkey });

  if (getProject) {
    projectname = getProject.name;
    const getLicense = await GetOneLicense(license);
    if (getLicense) {
      if (getLicense.enabled) {
        const getActivation = await GetLicenseActivation(license, hwid);
        if (getActivation) {
          console.log("activation found");
          var respstatus = "success";
          var respmsg = await messages.success();
          return { status: respstatus, message: respmsg };
        } else {
          console.log("activation not found");
          const getActivations = await GetLicenseActivations(license);
          const getActivationCount = getActivations.length;
          console.log("total available activations : " + getActivationCount);
          console.log(
            `project activations are ${getProject.activations} for project name : ${getProject.name}`
          );
          if (getActivationCount >= getProject.activations) {
            var respstatus = "failed";
            var respmsg = await messages.exceeded();
            return { status: respstatus, message: respmsg };
          } else {
            var respstatus = "success";
            var respmsg = await messages.success();
            await AddActivation(license, hwid);
            await AddLicenseActivation(license);
            return { status: respstatus, message: respmsg };
          }
        }
      } else {
        var respstatus = "failed";
        var respmsg = await messages.failed();
        return { status: respstatus, message: respmsg };
      }
    } else {
      var respstatus = "failed";
      var respmsg = await messages.deactivated();
      return { status: respstatus, message: respmsg };
    }
  }
}

module.exports = { ProcessApiRequest };
