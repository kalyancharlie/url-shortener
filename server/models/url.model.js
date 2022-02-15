const mongoose = require('mongoose')
const Schema = mongoose.Schema
const log = require("../utils/logger")
const {encode} = require('../utils/base62')

const CounterSchema = new Schema({
    _id: {type: String, required: true},
    count: {
        type: Number,
        default: 0
    }
})

const Counter = mongoose.model('Counter', CounterSchema)

const UrlSchema = new Schema({
    countId: {
        type: Number,
        default: 0,
        required: true
    },
    longUrl: {
        type: String,
        required: true
    },
    shortUrl: {
        type: String,
        required: true
    },
    count: {
        type: Number,
        default: 0,
        required: true
    }
}, {timestamps: true})

UrlSchema.pre('validate', async function(next) {
    try {
        const urlThis = this
        const counter = await Counter.findByIdAndUpdate(
            { _id: "url_count" },
            { $inc: { count: 1 } }, {new: true}
          ).catch((err) => {
            log("new error in counter update");
            log(err);
          });
          log('counter obj')
          log(counter)
          if (!counter) {
            const newCounter = new Counter({ _id: "url_count", count: 100000 });
            const savedCounter = await newCounter.save().catch((e) => {
                log("Error saving Initial Counter");
                log(e);
              });
              log('saved counter')
              log(savedCounter)
              urlThis.countId = savedCounter.count;
              urlThis.shortUrl = encode(savedCounter.count);
          } else {
            urlThis.countId = counter.count;
            urlThis.shortUrl = encode(counter.count);
          }
          next()
    } catch (error) {
        log('Counter Pre save error')
        log(error)
    }
})

const Url = mongoose.model('Url', UrlSchema)

module.exports = {Url, Counter}