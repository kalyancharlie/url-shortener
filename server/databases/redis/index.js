const redis = require('redis');
const dotenv = require('dotenv');
dotenv.config()
const log = require('../../utils/logger');

class RedisDB {
    constructor(url, options) {
        this.url = url;
        this.options = options || {};
        this.client = null
    }
    
    connect() {
        this.client = redis.createClient({
            url: this.url,
            ...this.options
          });
          this.client.connect()
          this.client.on('connect', () => log('Redis Connected'))
          this.client.on('error', (err) => log('Redis Client Error', err));
          this.client.on('reconnecting', (err) => log('Redis Reconnection Error', err));
    }

    getClient() {
        return this.client
    }
}

const redisOptions = {}

const redisConn = new RedisDB(process.env.REDIS_URI, redisOptions);

module.exports = redisConn