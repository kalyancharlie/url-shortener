var express = require('express');
var router = express.Router();
const createError = require('http-errors');
const {addUrlToDb, getLongUrl, getTopUrls, updateUrlHitCount} = require('../controllers/redirect.controller');
const log = require("../utils/logger");

// Create Short URL
router.post('/api/v1/shorten', async (req, res, next) => {
  try {
    const {longUrl} = req.body;
    console.time('URL ADD TIME')
    const url = await addUrlToDb(longUrl);
    console.timeEnd('URL ADD TIME')
    return res.status(url.statusCode).json({...url})
  } catch (e) {
    console.timeEnd('URL ADD TIME')
    log('Create Route Error')
    log(e)
    next(createError(500, "URL SHORTENER: Internal Server Error"))
  }
});

// Redirect Short URL to Long URL
router.get('/:url', async (req, res, next) => {
  try {
    const {url} = req.params;
    const longUrl = await getLongUrl(url)
    if (!longUrl) {
      return res.render('url-not-found', {})
    }
    console.time('HIT COUNT UPDATE TIME')
    await updateUrlHitCount(url)
    console.timeEnd('HIT COUNT UPDATE TIME')
    res.writeHead(302, {Location: longUrl}).end()
  } catch (e) {
    log('Redirect Route Error')
    log(e)
    next(createError(500, "URL SHORTENER: Internal Server Error"))
  }
});

// Get Most Visited URLS
router.get('/api/v1/popular', async (req, res, next) => {
  try {
    console.time('TOP URLS FETCH TIME')
    const urls = await getTopUrls()
    console.timeEnd('TOP URLS FETCH TIME')
    res.status(200).json({status: true, statusCode: 200, message: "Successfully retrieved top urls", data: urls})
  } catch (e) {
    log('Popular Route Error')
    log(e)
    next(createError(500, "URL SHORTENER: Internal Server Error"))
  }
})

module.exports = router;
