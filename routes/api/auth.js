var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var apiError = require('./apiError');
var jwt = require('jsonwebtoken');

module.exports = function (app, db) {
    router.post('/', function (req, res) {
        var email = req.body.email,
            password = req.body.password;

        if (!email) {
            apiError.send(res, [4001])
        } else if (!password) {
            res.end("No password provided", [4002]);
        } else {
            login(email, password, function (results) {
                var token = jwt.sign({
                    id: results[0].id
                }, app.locals.config.jwt.secret, {
                    expiresIn: '24h'
                });
                res.status(200).json({
                    token: token
                });
            }, function (codes) {
                apiError.send(res, codes);
            });
        }
    });
    
    function login(email, password, successHandler, errorHandler) {
        var query = {
            sql: 'SELECT users.id, password FROM auths JOIN users ON users.id = auths.user_id WHERE email = ?',
            values: [email]
        }
        db.query(query.sql, query.values, function (error, results) {
            if (error) {
                errorHandler([5000]);
            } else if (results.length == 0) {
                errorHandler([4003]);
            } else {
                /* TODO: Fix password checking */
                /*bcrypt.compare(password, results[0].password, function (error, result) {
                    if (error) {
                        errorHandler([5001]);
                    } else {
                        if (result == false) {
                            errorHandler([4004]);
                        } else {
                            success(results);
                        }
                    }
                });*/
                successHandler(results);
            }
        });
    }

    return router;
}
