var express = require('express');
var mysql = require('mysql');
const Sequelize = require('sequelize');

function connectToDatabase(app) {
    var knex = require('knex')({
        client: 'mysql',
        connection: {
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_NAME
        }
    });
    return knex;
}

module.exports = {
    connect: connectToDatabase
};
