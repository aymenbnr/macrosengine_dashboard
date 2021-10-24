

async function CreateLicenseRequest(email,project) {
    return await axios.post(process.env.API_ENDPOINT, {
        email: email,
        project: project,
        key:process.env.API_SECRET,
      });
  }
  
  module.exports = {
    CreateLicenseRequest,
  };