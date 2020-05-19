const CryptoJS = require("crypto-js");
const {
  CreateLicense,
  DisableLicense,
  SendLicenseEmail,
} = require("./LicenseFactory");

const decryptIpn = (secretkey, secretParams) => {
  let encrypted = CryptoJS.enc.Base64.parse(
    decodeURIComponent(secretParams.notification)
  );
  let ive = CryptoJS.enc.Base64.parse(decodeURIComponent(secretParams.iv));

  let key = CryptoJS.enc.Utf8.parse(
    CryptoJS.SHA1(secretkey).toString().substring(0, 32)
  );

  let decrypted = CryptoJS.AES.decrypt({ ciphertext: encrypted }, key, {
    iv: ive,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  var decryptedNotification = decrypted.toString(CryptoJS.enc.Utf8);
  var notification = null;
  if (decryptedNotification) {
    notification = JSON.parse(decryptedNotification);
  }

  return notification;
};

const processIpn = async (notification) => {
  console.log("----------------");
  console.log(JSON.stringify(notification));
  console.log("customer => " + JSON.stringify(notification.customer));
  console.log("billing => " + JSON.stringify(notification.customer.billing));
  if (notification != null) {
    var [firstProject] = notification.lineItems;
    if (
      notification.transactionType == "SALE" ||
      notification.transactionType == "TEST_SALE"
    ) {
      var license = await CreateLicense({
        project: firstProject.productTitle,
        fullname: notification.customer.billing.fullName,
        email: notification.customer.billing.email,
        source: "clickbank",
      });
      await SendLicenseEmail(license);
    } else if (
      notification.transactionType == "RFND" ||
      notification.transactionType == "CGBK"
    ) {
      await DisableLicense({
        project: firstProject.productTitle,
        email: notification.billing.email,
      });
    }
  }
};

module.exports = { decryptIpn, processIpn };
