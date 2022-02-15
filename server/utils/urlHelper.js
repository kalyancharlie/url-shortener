const APP_URL = process.env.APP_URL || "http://localhost:3000";

const completeUrl = (shortUrl) => {
  return APP_URL + "/" + shortUrl;
};
module.exports = completeUrl;
