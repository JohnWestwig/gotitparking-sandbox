var express = require('express');
var router = express.Router();
var bcrypt = require('bcrypt-nodejs');
var apiError = require('./apiError');
var expressSession = require('express-session');

var passport = require('passport'),
    LocalStrategy = require('passport-local').Strategy,
    FacebookStrategy = require('passport-facebook').Strategy;

module.exports = function (app, db) {
    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });

    passport.deserializeUser(function (id, done) {
        var query = {
            sql: 'SELECT id, first_name AS firstName, last_name AS lastName FROM users WHERE id = ?',
            values: [id]
        }
        db.query(query.sql, query.values, function (err, results) {
            if (err) {
                done(err);
            } else {
                done(null, results[0]);
            }
        });
    });

    passport.use(new LocalStrategy({
        usernameField: "email",
        passwordField: "password"
    }, function (email, password, done) {
        login(email, password, function (user) {
            console.log(user);
            done(null, user);
        }, function (codes) {
            console.log("codes", codes);
            done(codes);
        })
    }));

    /* TODO: make callbackURL relative */
    passport.use(new FacebookStrategy({
            clientID: app.locals.config.facebook.appId,
            clientSecret: app.locals.config.facebook.appSecret,
            callbackURL: "http://localhost:3000/api/login/facebook/callback",
            profileFields: ['id', 'first_name', 'last_name', 'email']
        },
        function (accessToken, refreshToken, profile, done) {
            console.log(profile);
            loginFacebook(profile, function (user) {
                done(null, user);
            }, function (codes) {
                done(codes);
            });
        }
    ));

    router.post('/', function (req, res, next) {
        passport.authenticate('local', authenticationComplete(req, res, next))(req, res, next);
    });

    router.get('/facebook', passport.authenticate('facebook', {
        scope: ['email']
    }));

    router.get('/facebook/callback', passport.authenticate('facebook', {
        successReturnToOrRedirect: '/home',
        failureRedirect: '/login'
    }));

    function authenticationComplete(req, res, next) {
        return function (err, user, info) {
            if (err) {
                apiError.send(res, err);
            } else if (!user) {
                apiError.send(res, [4007]);
            } else {
                req.logIn(user, function (err) {
                    if (err) {
                        apiError.send(res, [5000])
                    } else {
                        res.sendStatus(200);
                    }
                });
            }
        }
    }

    function login(email, password, successHandler, errorHandler) {
        var query = {
            sql: 'SELECT users.id, first_name, last_name, password, verified FROM auths JOIN users ON users.id = auths.user_id WHERE email = ?',
            values: [email]
        }
        db.query(query.sql, query.values, function (error, results) {
            if (error) {
                errorHandler([5000]);
            } else if (results.length == 0) {
                errorHandler([4003]);
            } else if (results[0].verified == 0) {
                errorHandler([4007]);
            } else {
                bcrypt.compare(password, results[0].password, function (error, result) {
                    if (error) {
                        errorHandler([5001]);
                    } else {
                        if (result == false) {
                            errorHandler([4004]);
                        } else {
                            successHandler(results[0]);
                        }
                    }
                });
            }
        });
    }

    function loginFacebook(profile, successHandler, errorHandler) {
        var query = {
            sql: "SELECT users.id, first_name, last_name FROM auths JOIN users ON users.id = auths.user_id WHERE facebook_id = ?",
            values: [profile.id]
        };
        db.query(query.sql, query.values, function (error, results) {
            if (error) {
                errorHandler([5000]);
            } else if (results.length == 0) {
                registerFacebook(profile, successHandler, errorHandler);
            } else {
                successHandler(results[0]);
            }
        });
    }

    function registerFacebook(profile, successHandler, errorHandler) {
        /* TODO: merge accounts if email in use */
        var query = {
            sql: 'INSERT INTO users (first_name, last_name) VALUES (?, ?);' +
                'SET @user_id = LAST_INSERT_ID();' +
                'INSERT INTO auths (user_id, email, facebook_id, verified) VALUES (@user_id, ?, ?, 1);' +
                'SELECT @user_id AS user_id;',
            values: [profile.name.givenName, profile.name.familyName, profile.emails[0].value, profile.id]
        };
        db.query(query.sql, query.values, function (err, results) {
            if (err) {
                errorHandler([5000]);
            } else {
                successHandler(results[3][0].user_id);
            }
        })

    }

    return router;
}
