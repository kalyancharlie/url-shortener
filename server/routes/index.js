var express = require('express');
var router = express.Router();
const {redisConn} = require('../app');

redisConn.getClient().on('connect', () => console.log('Redis Connected'))

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

module.exports = router;
