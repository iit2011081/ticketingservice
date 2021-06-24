import config from '../config/index'
import redis from 'redis'
import coRedis from 'co-redis'

let redisConfig = config.redis;
let redisOptions = {
    host: redisConfig.host,
    port: redisConfig.port
};
if(redisConfig.password) {
	redisOptions["password"] = redisConfig.password
}
if(redisConfig.db) {
	redisOptions["db"] = redisConfig.db;
}

const redisClient = redis.createClient(redisOptions);
if (redisConfig.password) {
	redisClient.auth(redisConfig.password);
}
let coRedisClient = coRedis(redisClient);

class RedisHelper {
	async set(key, value, expiry) {
		try {
			if(expiry) {
				return coRedisClient.set(key, value, 'EX', expiry);
			} else {
				return coRedisClient.set(key, value);
			}
		} catch (err) {
			throw err;
		}
	}

	async get(key) {
		try {
			return coRedisClient.get(key);
		} catch (err) {
			throw err;
		}
	}

	async del(key) {
		try {
			return coRedisClient.del(key);
		} catch (err) {
			throw err;
		}
	}

	async hset(hashKey, key, value, expiry) {
		try {
			if(expiry) {
				return coRedisClient.hset(hashKey, key, value, 'EX', expiry);
			} else {
				return coRedisClient.set(hashKey, key, value);
			}
		} catch (err) {
			throw err;
		}
	}

	async hget(hashKey, key) {
		try {
			return coRedisClient.hget(hashKey, key);
		} catch (err) {
			throw err;
		}
	}

	async hdel(hashKey, key) {
		try {
			return coRedisClient.hdel(hashKey, key);
		} catch (err) {
			throw err;
		}
	}
}

var redisHelper = new RedisHelper();
export default redisHelper;