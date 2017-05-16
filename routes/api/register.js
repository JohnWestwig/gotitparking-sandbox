var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var apiError = require('./apiError');
var jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');


module.exports = function (app, db) {
    var jwtSecret = app.locals.config.jwt.secret;
    router.post('/', function (req, res) {
        var email = req.body.email,
            password = req.body.password,
            firstName = req.body.firstName,
            lastName = req.body.lastName;

        if (!email) {
            apiError.send(res, [4001])
        } else if (!password) {
            apiError.send(res, [4002]);
        } else if (!firstName) {
            apiError.send(res, [4005]);
        } else if (!lastName) {
            apiError.send(res, [4006]);
        } else {
            register(firstName, lastName, email, password, function (userId) {
                console.log("user id", userId);
                var token = jwt.sign({
                    id: userId
                }, jwtSecret, {
                    expiresIn: '1h'
                });
                sendRegistrationEmail(app.locals.config.email.address, app.locals.config.email.password, email, token);
                res.send(200);
            }, function (codes) {
                apiError.send(res, codes);
            });
        }
    });

    router.get('/verify/:verificationCode', function (req, res) {
        console.log("hello");
        jwt.verify(req.params.verificationCode, jwtSecret, function (error, decoded) {
            if (error) {
                apiError.send([4009]);
            } else {
                var userId = decoded.id;
                makeVerified(userId, function () {
                    res.redirect('/login');
                }, function (codes) {
                    apiError.send(res, codes);
                });
            }
        });
    });

    function register(firstName, lastName, email, password, successHandler, errorHandler) {
        bcrypt.hash(password, null, null, function (error, hash) {
            if (error) {
                errorHandler([5001])
            } else {
                /* TODO: check email before inserting user cols */
                var query = {
                    sql: 'INSERT INTO users (first_name, last_name) VALUES (?, ?);' +
                        'SET @user_id = LAST_INSERT_ID();' +
                        'INSERT INTO auths (user_id, email, password) VALUES (@user_id, ?, ?);' +
                        'SELECT @user_id AS user_id;',
                    values: [firstName, lastName, email, hash]
                };
                db.query(query.sql, query.values, function (error, results) {
                    if (error) {
                        switch (error.errno) {
                            case 1062:
                                errorHandler([4008]);
                                break;
                            default:
                                errorHandler([5000]);
                        }
                    } else {
                        //Send email
                        successHandler(results[3][0].user_id);
                    }
                });
            }
        });
    }

    function makeVerified(userId, successHandler, errorHandler) {
        var query = {
            sql: 'UPDATE auths SET verified = 1 WHERE user_id = ?',
            values: [userId]
        };
        db.query(query.sql, query.values, function (error, results) {
            if (error) {
                console.log(error);
                errorHandler([5000]);
            } else {
                successHandler(results);
            }
        });
    }

    return router;
}



function sendRegistrationEmail(senderAddress, senderPassword, destAddress, token, successHandler, errorHandler) {
    var transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: senderAddress,
            pass: senderPassword
        }
    });
    var mailOptions = {
        from: '"GotIt! Dev" <dev.john.westwig@gmail.com>',
        to: destAddress,
        subject: 'GotIt! Parking Registration Verification',
        html: '<a href="http://localhost:3000/api/register/verify/' + token + '">Verify your email address</a>'
    };

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log("Couldn't send email", error);
            errorHandler();
        } else {
            successHandler();
        }
    });
}
