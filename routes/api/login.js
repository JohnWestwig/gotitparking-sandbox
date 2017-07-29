var express = require('express'),
    router = express.Router(),
    apiError = require('./apiError'),
    bcrypt = require('bcrypt-nodejs'),
    jwt = require('jsonwebtoken');

module.exports = function (app, db) {
    function onLoginSuccess(res, user) {
        var token = jwt.sign({
            id: user.id,
            name: {
                first: user.first_name,
                last: user.last_name
            }
        }, process.env.JWT_SECRET, {
            expiresIn: process.env.JWT_EXPIRY_TIME_API
        });
        res.status(200).json({
            token: token
        });
    }

    router.post('/', function (req, res, next) {
        var email = req.body.email,
            password = req.body.password;
        if (!email) {
            apiError.send(res, [4001]);
        } else if (!password) {
            apiError.send(res, [4002]);
        } else {
            login(email, password, function (user) {
                onLoginSuccess(res, user);
            }, function (errors) {
                apiError.send(res, errors);
            });
        }
    });

    router.post('/facebook', function (req, res) {
        var facebookId = req.body.facebookId;

        if (!facebookId) {
            apiError.send(res, [4000]);
        } else {
            loginFacebook(facebookId, function (user) {
                onLoginSuccess(res, user)
            }, function (errors) {
                apiError.send(res, errors);
            });
        }
    });

    function login(email, password, successHandler, errorHandler) {
        db('users')
            .first('users.id', 'first_name', 'last_name', 'password', 'verified')
            .join('auths', 'users.id', 'auths.user_id')
            .where({
                email: email,
                verified: 1
            })
            .then(function (row) {
                if (row) {
                    bcrypt.compare(password, row.password, function (error, result) {
                        if (error) {
                            errorHandler([5001]);
                        } else {
                            if (result == false) {
                                errorHandler([4004]);
                            } else {
                                successHandler(row);
                            }
                        }
                    });
                } else {
                    errorHandler([4003]);
                }
            })
            .catch(function (error) {
                errorHandler([5000]);
            });
    }

    function loginFacebook(facebookId, successHandler, errorHandler) {
        db('users')
            .first('users.id', 'first_name', 'last_name', 'facebook_id')
            .join('auths_facebook', 'users.id', 'auths_facebook.user_id')
            .where({
                facebook_id: facebookId
            })
            .then(function (row) {
                if (row) {
                    successHandler(row);
                } else {
                    errorHandler([4004]);
                }
            })
            .catch(function (error) {
                console.log(error);
                errorHandler([5000]);
            });
    }

    return router;
}
