import fs from 'fs';
import path from 'path'
import Sequelize from 'sequelize'
import config from '../config/index'
import debug from 'debug'

const basename = path.basename(module.filename);
const DB = new Sequelize(config.DB.database, config.DB.username, config.DB.password, config.DB);

const db = {};

const logPath = `${__dirname.split('/').reverse()[0]}/${__filename.slice(__dirname.length + 1, -3)}`;
const log = debug(`${logPath}:log`);
// const loginfo = debug(logPath + ':info');
const logerr = debug(`${logPath}:error`);

DB
	.authenticate()
	.then((t) => {
		log('Connection has been established successfully to db.');
	})
	.catch((err) => {
		logerr(err);
	});

fs
	.readdirSync(__dirname)
	.filter(file => (file.indexOf('.') !== 0) && (file !== basename))
	.forEach((file) => {
        const model = DB.import(path.join(__dirname, file));
		db[model.name] = model;
	});

Object.keys(db).forEach(function (modelName) {
	if ("associate" in db[modelName]) {
		db[modelName].associate(db);
	}
});

db.DB = DB;
module.exports = db;