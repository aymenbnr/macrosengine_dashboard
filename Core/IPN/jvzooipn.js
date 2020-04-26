const JvzooVerifier = require("jvzoo-ipn-signature-verifier");
const {
  CreateLicense,
  DisableLicense,
  SendLicenseEmail,
} = require("./LicenseFactory");

const jvZooIpn = async (secretKey, req) => {
  const verifier = new JvzooVerifier(secretKey);
  var valid = verifier.verify(req.body);
  if (valid) {
    const { cprodtitle, ccustname, ccustemail, ctransaction } = req.body;
    if (ctransaction == "SALE" || ctransaction == "TEST") {
      var license = await CreateLicense({
        project: cprodtitle,
        fullname: ccustname,
        email: ccustemail,
        source: "jvzoo",
      });
      if (license) {
        return true;
      } else {
        return false;
      }
    } else if (ctransaction == "RFND" || ctransaction == "CGBK") {
      await DisableLicense({
        project: cprodtitle,
        email: ccustemail,
      });
      return true;
    }
  } else {
    return false;
  }
};

module.exports = { jvZooIpn };
