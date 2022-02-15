const mongoose = require('mongoose');
const dotenv = require('dotenv');
dotenv.config()
const log = require('../../utils/logger');

class MongoDB {
    constructor(url, options) {
        this.url = url;
        this.options = options;
    }
    
    connect() {
        return mongoose
        .connect(this.url, this.options)
        .then(() => {
            log("MongoDB Connected");
        })
        .catch((err) => log(err));
    }
}

const mongoOptions = {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    autoIndex: true,
}

const mongo = new MongoDB(process.env.MONGODB_URI, mongoOptions);

module.exports = mongo