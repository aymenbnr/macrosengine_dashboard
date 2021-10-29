const express = require("express");
const router = express.Router();
const { ensureAuthenticated, forwardAuthenticated } = require("../config/auth");
const {CreateLicenseRequest} = require("../Core/ApiEndpoint")
const Project = require("../models/Project");
const Code = require("../models/Code");
const {
  CreateLicense,
  DisableLicense,
  SendLicenseEmail,
} = require("../Core/IPN/LicenseFactory");
//const UIDGenerator = require("uid-generator");
//var fetch = require("isomorphic-unfetch");
var passwordGenerator = require("password-generator")
var deepEmailValidator = require("deep-email-validator")

// add project GET
router.get("/add", ensureAuthenticated, async (req, res) => {
  const codeGenerate = passwordGenerator(12, false);
  const projects = await Project.find();
  //var test = await fetch("https://api.coindesk.com/v1/bpi/currentprice.json");
  //console.log(test.bpi.USD.rate);
  res.render("code-add", {
    projects:projects,
    licensecode: codeGenerate,
    user: req.user,
  });
});

// add project POST
router.post("/add", ensureAuthenticated, (req, res) => {
  const {
    codeproject,
    licensecode
  } = req.body;

  const newCode = new Code({
    code: licensecode,
    project: codeproject,
    used: false,
  });
  newCode.save().then((code) => {
    req.flash("success_msg", `Code ${code.code} has been created`);
    res.redirect("/codesmanager");
  });
});

router.get("/redeem", async (req, res) => {
  res.render("redeem-code");
});

// add project POST
router.post("/redeem", async (req, res) => {
  const {
    code,
    email,
    fullname
  } = req.body;

  verifyRecaptcha(req.body["g-recaptcha-response"], function(success) {
    if (success) {
            //res.end("Success!");
            req.flash("success_msg", `captcha success , now redeem code`);
            res.redirect("/code/redeem");
            // TODO: do registration using params in req.body
    } else {

            req.flash("error_msg", `Captcha failed, sorry.`);
            res.redirect("/code/redeem");
            //res.end("Captcha failed, sorry.");
            // TODO: take them back to the previous page
            // and for the love of everyone, restore their inputs
    }
});

  var validate =   await deepEmailValidator.validate ({
    email: email,
    validateRegex: true,
    validateMx: true,
    validateTypo: true,
    validateDisposable: true,
    validateSMTP: false,
  });

  if(validate.valid == false){
    req.flash("error_msg", `invalid email!`);
    res.redirect("/code/redeem");
  }

  var cpCode = Code.findOne({code:code});
  if(cpCode && cpCode.used == false)
  {

    if(process.env.LICENSE_API_ACTIVE ==true){
      var result = CreateLicenseRequest(email,code.project,fullname);
    }
    else{
      //create the license, send the email!

      var license = await CreateLicense({
        project: project,
        fullname: fullname,
        email: email,
        source: "redeem code",
        receipt: code,
      });
      var emailObj = await SendLicenseEmail(license);
      console.log("--------EMAIL RESP--------");
      console.log(JSON.stringify(emailObj));

    }
    
    // update the redeem code with license detail, mark as used!

    cpCode.used = true;
    cpCode.license = license.licensekey;
    await cpCode.save();

    req.flash("success_msg", `Code ${code} has been redeemed, check your email!`);
    res.redirect("/code/redeem");

  }
  else{

    req.flash("error_msg", `Code ${code} is invalid or has been redeemed!`);
    res.redirect("/code/redeem");

  }

});

//delete project
router.get("/delete/:id", ensureAuthenticated, (req, res) => {
  // delete project code here

  Code.findByIdAndDelete(req.params.id).then((code) => {
    if (code) {
      req.flash("success_msg", "Code deleted!");
      res.redirect("/codesmanager");
    }
  });
});

function verifyRecaptcha(key, callback) {
  https.get("https://www.google.com/recaptcha/api/siteverify?secret=" + process.env.RECAPTCHA_SECRET + "&response=" + key, function(res) {
      var data = "";
      res.on('data', function (chunk) {
                      data += chunk.toString();
      });
      res.on('end', function() {
          try {
              var parsedData = JSON.parse(data);
              console.log(parsedData);
              callback(parsedData.success);
          } catch (e) {
              callback(false);
          }
      });
  });
}

module.exports = router;
