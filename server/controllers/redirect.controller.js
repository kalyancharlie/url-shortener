const log = require("../utils/logger");
const { redisConn } = require("../app");
const { Url, Counter } = require("../models/url.model");
const completeUrl = require("../utils/urlHelper");
const { encode } = require("../utils/base62");

const redisClient = redisConn.getClient();

module.exports = {
  // Get Short Url from Long URL in Redis
  getLongUrl: async (shortUrl) => {
    try {
        // Redis Offline
      if (!redisClient) {
        log("Running in non cache mode", true);
        console.time('MONGODB FETCH TIME');
        const url = await Url.findOne({ shortUrl }, { longUrl: 1 });
        console.timeEnd('MONGODB FETCH TIME');
        if (!url) return null;
        return url.longUrl;
      }
      // Redis Online
      console.time('REDIS FETCH TIME');
      const redisLongUrl = await redisClient.get(shortUrl)
      console.timeEnd('REDIS FETCH TIME');
      // Short Not Cached / Not Found
      if (!redisLongUrl) {
        console.time('MONGODB FETCH TIME');
        const url = await Url.findOne({ shortUrl }, { longUrl: 1 });
        console.timeEnd('MONGODB FETCH TIME');
        if (!url) return null;
        console.time('REDIS CACHE SET TIME');
        await redisClient.set(shortUrl, url.longUrl);
        console.timeEnd('REDIS CACHE SET TIME');
        return url.longUrl;
      }
      return redisLongUrl;
    } catch (e) {
      log("getlongurl error");
      log(e);
      return null;
    }
  },

  // Add Long URL to Mongo DB
  addUrlToDb: async (longUrl) => {
    try {
      // Check if Long Url is already in Redis
      const url = await Url.findOne({ longUrl });
      // Url not Shortened
      if (!url) {
        const newUrl = new Url({
          countId: 0,
          longUrl,
          count: 0,
          shortUrl: null,
        });
        const savedUrl = await newUrl.save();
        return {
          status: true,
          statusCode: 200,
          message: "Successfully shortened url",
          data: { shortUrl: completeUrl(savedUrl.shortUrl) },
        };
      }
      // URL already Shortened
      return {
        status: true,
        statusCode: 200,
        message: "Url already shortened",
        data: { shortUrl: completeUrl(url.shortUrl) },
      };
    } catch (e) {
        log('addUrlToDb error');
      log(e);
      return {
        status: false,
        statusCode: 500,
        message: "Internal Server Error",
        data: { shortUrl: null },
      };
    }
  },

  // Get Top 10 URLs from Mongo DB with/without current one
  getTopUrls: async () => {
    try {
      const topUrls = await Url.find({}).sort({ count: -1 }).limit(10);
      return topUrls
        ? topUrls.map((url) => ({
            longUrl: url.longUrl,
            shortUrl: completeUrl(url.shortUrl),
            count: url.count,
          }))
        : null;
    } catch (error) {
      log("top urls fetch error");
      log(error);
      return null;
    }
  },

  // Update Hit Count in Mongo DB
  updateUrlHitCount: async (shortUrl) => {
    try {
      await Url.findOneAndUpdate({ shortUrl }, { $inc: { count: 1 } });
      return true;
    } catch (error) {
      log("url hit counter update error");
      log(error);
      return false;
    }
  },
};
