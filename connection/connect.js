

var mysql = require('mysql')
var EventEmitter = require('events');
const Config = require('../config/database');

const Connection = mysql.createConnection({
    host: Config.dbHost,
    user: Config.dbUser,
    password: Config.dbPass,
    database: Config.dbName,
  });

module.exports = Connection;