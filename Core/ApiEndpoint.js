

async function CreateLicenseRequest(email,project,fullname) {
    return await axios.post(process.env.API_ENDPOINT, {
        email: email,
        project: project,
        fullname:fullname,
        key:process.env.API_SECRET,
      });
  }
  
  module.exports = {
    CreateLicenseRequest,
  };