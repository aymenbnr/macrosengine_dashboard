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
    console.log(apikey.value);
    nJwt.verify(token, apikey.value, "HS256", async (error, payload) => {
      var claims = {
        random: payload.body.random,
        res: "error",
        message: "unknown",
      };

      if (error) {
        res.send(error);
      } else {
        if (endpoint == "verify") {
          var resp = await VerifyEndpoint(payload);
          console.log(resp);
          claims.res = resp.status;
          claims.message = resp.message.value;
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

async function VerifyEndpoint(payload) {
  var { secretkey, license, hwid, random } = payload.body;
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
