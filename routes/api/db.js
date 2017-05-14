var express = require('express');
var mysql = require('mysql');
const Sequelize = require('sequelize');

function connectToDatabase(app) {
    var dbConfig = app.locals.config.db;
    var connection = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database
    });

    connection.connect();
    return connection;
}

module.exports = {
    connect: connectToDatabase
};
