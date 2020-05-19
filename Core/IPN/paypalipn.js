var ipn = require("pp-ipn");
const {
  CreateLicense,
  DisableLicense,
  SendLicenseEmail,
} = require("./LicenseFactory");

const paypalIpn = async (req) => {
  ipn.verify(req.body, async function callback(err, msg) {
    if (err) {
      console.error(err);
    } else {
      if (req.body.payment_status == "Completed") {
        // Payment has been confirmed as completed
        const {
          item_name,
          first_name,
          last_name,
          payer_email,
          txn_type,
        } = req.body;
        if (txn_type == "subscr_signup" || txn_type == "web_accept") {
          var license = await CreateLicense({
            project: item_name,
            fullname: `${first_name} ${last_name}`,
            email: payer_email,
            source: "paypal",
          });
        }
      }
    }
  });
};

module.exports = { paypalIpn };
