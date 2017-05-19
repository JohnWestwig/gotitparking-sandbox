var express = require('express');
var mysql = require('mysql');
const Sequelize = require('sequelize');

/*function connectToDatabase(app) {
    var dbConfig = app.locals.config.db;
    var connection = mysql.createConnection({
        host: dbConfig.host,
        user: dbConfig.user,
        password: dbConfig.password,
        database: dbConfig.database,
        multipleStatements: true
    });

    connection.connect();
    return connection;
}*/

function connectToDatabase(app) {
    var knex = require('knex')({
        client: 'mysql',
        connection: {
            host: app.locals.config.db.host,
            user: app.locals.config.db.user,
            password: app.locals.config.db.password,
            database: app.locals.config.db.database
        }
    });
    return knex;
}

module.exports = {
    connect: connectToDatabase
};
