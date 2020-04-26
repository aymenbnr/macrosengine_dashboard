const {
  AddActivation,
  AddLicenseActivation,
  AddLicense,
  DisableLicenseByEmail,
} = require("../DBAdd");
const UIDGenerator = require("uid-generator");
const LicenseFormatter = require("../LicenseFormatter");
const SendEmail = require("../SendEmail");
const dotenv = require("dotenv");
dotenv.config();

const CreateLicense = async (order) => {
  // order object : productTitle,receipt,fullName,email,source
  const activations = 0;
  const enabled = true;
  const expirable = false;
  const expiryDate = Date.now();
  const createdDate = Date.now();

  const uidgen = new UIDGenerator(UIDGenerator.BASE36);
  const uid = await uidgen.generate();
  var dashLicense = LicenseFormatter.DashFormatter(uid);
  var licenseObject = {
    project: order.project,
    licensekey: dashLicense,
    name: order.fullname,
    email: order.email,
    activations: activations,
    enabled: enabled,
    expirable: expirable,
    expirydate: expiryDate,
    date: createdDate,
  };
  await AddLicense(licenseObject);

  const newLog = new Logs({
    license: licensekey,
    logtype: "order",
    logtext: `${order.source} SALE / receipt: ${order.receipt}`,
    logdate: createdDate,
    logsource: `${order.source}`,
  });
  await newLog.save();

  return licenseObject;
};

const DisableLicense = async (order) => {
  // order object : productTitle,receipt,fullName,email,
  await DisableLicenseByEmail(order.email, order.project);
};

const SendLicenseEmail = async (license) => {
  return await SendEmail.mailer({
    email: license.email,
    subject: `License Details For ${license.project}`,
    text: `Thank you for your order\n\n
        Below is your license details for ${license.project}\n
        License Email: ${license.email}\n
        License Key: ${license.licensekey}\n
        Download Link: ${license.installer}\n\n
        Need support? Send us an email to : ${process.env.SUPPORT_EMAIL}
        `,
    html: `<p>Thank you for your order</p><br>
        <p>Below is your license details for ${license.project}</p>
        <p><b>License Email</b>: ${license.email}</p>
        <p><b>License Key</b>: ${license.licensekey}</p>
        <p><b>Download Link</b>: ${license.installer}</p><br>
        <p>Need support? Send us an email to : ${process.env.SUPPORT_EMAIL}</p>`,
  });
};

module.exports = { CreateLicense, DisableLicense, SendLicenseEmail };
