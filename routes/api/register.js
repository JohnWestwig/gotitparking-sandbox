var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var apiError = require('./apiError');
var jwt = require('jsonwebtoken');

const nodemailer = require('nodemailer');


module.exports = function (app, db) {
    var jwtSecret = process.env.JWT_SECRET;
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
                /* TODO: catch email errors */
                sendRegistrationEmail(process.env.EMAIL_ADDRESS, process.env.EMAIL_PASSWORD, email, token);
                res.send(200);
            }, function (codes) {
                apiError.send(res, codes);
            });
        }
    });

    router.get('/verify/:verificationCode', function (req, res) {
        jwt.verify(req.params.verificationCode, jwtSecret, function (error, decoded) {
            if (error) {
                apiError.send(res, [4009]);
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

    router.post('/facebook', function (req, res) {
        var email = req.body.email,
            firstName = req.body.firstName,
            lastName = req.body.lastName,
            facebookId = req.body.facebookId;

        if (!email) {
            apiError.send(res, [4001])
        } else if (!facebookId) {
            apiError.send(res, [4002]);
        } else if (!firstName) {
            apiError.send(res, [4005]);
        } else if (!lastName) {
            apiError.send(res, [4006]);
        } else {
            registerFacebook(firstName, lastName, email, facebookId, function () {
                res.sendStatus(200);
            }, function (errors) {
                apiError.send(res, errors);
            });
        }
    });


    function register(firstName, lastName, email, password, successHandler, errorHandler) {
        bcrypt.hash(password, null, null, function (error, hash) {
            if (error) {
                errorHandler([5001])
            } else {
                db('users')
                    .insert([{
                        first_name: firstName,
                        last_name: lastName,
                        email: email
                    }], 'id')
                    .then(function (id) {
                        return db('auths').insert([{
                            user_id: id,
                            password: hash
                        }]).then(function () {
                            successHandler(id);
                        });
                    })
                    .catch(function (error) {
                        errorHandler([5000]);
                    });
            }
        });
    }

    function makeVerified(userId, successHandler, errorHandler) {
        db('auths')
            .update({
                verified: 1
            })
            .where('user_id', userId)
            .then(successHandler)
            .catch(function (error) {
                errorHandler([5000]);
            });
    }

    function registerFacebook(firstName, lastName, email, facebookId, successHandler, errorHandler) {
        db('users')
            .insert([{
                first_name: firstName,
                last_name: lastName,
                email: email
            }], 'id')
            .then(function (id) {
                return db('auths_facebook')
                    .insert([{
                        user_id: id,
                        facebook_id: facebookId
                    }])
                    .then(function () {
                        successHandler(id);
                    });
            })
            .catch(function (error) {
                console.log(error);
                errorHandler([5000]);
            });
        /* TODO: merge accounts if email in use */
        /*var query = {
            sql: 'INSERT INTO users (first_name, last_name) VALUES (?, ?);' +
                'SET @user_id = LAST_INSERT_ID();' +
                'INSERT INTO auths (user_id, email, facebook_id, verified) VALUES (@user_id, ?, ?, 1);' +
                'SELECT users.id, first_name, last_name FROM auths JOIN users ON users.id = auths.user_id WHERE facebook_id = ?',
            values: [profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.id, profile.id]
        };
        db.query(query.sql, query.values, function (err, results) {
            if (err) {
                errorHandler([5000]);
            } else {
                successHandler(results[3][0]);
            }
        });*/
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
