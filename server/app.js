const createError = require('http-errors');
const express = require('express');
const mongoose = require("mongoose")
const mongo = require('./databases/mongodb');
const redisConn = require('./databases/redis');
const path = require('path');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const logger = require('morgan');
const dotenv = require('dotenv')
dotenv.config();

const MODE = process.env.MODE || 'prod'
const LOG_MODE = MODE === 'prod' ? 'tiny' : 'dev'

// Mongoose Connection
mongo.connect();

// Redis Connection
redisConn.connect()
module.exports.redisConn = redisConn

const app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger(LOG_MODE));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

const indexRouter = require('./routes/index')
app.use('/', indexRouter);

// Static Files Serving
if (process.env.NODE_ENV === 'production') {
  __clientDir = path.join(__dirname, '../')
  __clientBuildDir = path.join(__clientDir, '/client/build')
  console.log('Serving Files from: ', __clientBuildDir)
  app.use(express.static(__clientBuildDir))
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__clientBuildDir, 'index.html'))
  })
}

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500).json({message: err.message, statusCode: err.status || 500, status: false})
});

module.exports = {app}
