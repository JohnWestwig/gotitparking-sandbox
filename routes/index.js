var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

module.exports = function (app) {

    router.use(function (req, res, next) {
        var token = req.headers['x-token'] || req.cookies.token;
        console.log("token", token);
        if (token) {
            jwt.verify(token, app.locals.config.jwt.secret, function (error, decoded) {
                if (!error) {
                    console.log(decoded);
                    req.body.user = decoded;
                } else {
                    console.log(error);
                }
                next();
            });
        } else {
            next();
        }
    });
    /* Set up API routes */
    var apiRouter = require('./api')(app);
    router.use('/api', apiRouter);

    /* Pages */
    router.get('/', function (req, res, next) {
        res.redirect('/home');
    });

    router.get('/about', render("about", {}));
    router.get('/login', render("login", {}));
    router.get('/register', render("register", {}));
    router.get(['/home', '/home/test'], render("home", {}));
    router.get('/profile', function (req, res) {
        if (req.body.user) {
            res.redirect('/profile/activity');
        } else {
            res.redirect('/profile/privacy');
        }
    });
    router.get('/profile/:section', render("profile", {}));

    /* Send some default parameters to all layouts, merge with custom parameters. */
    function render(name, params) {
        return function (req, res, next) {
            var defaultParams = {
                page: name,
                title: name.charAt(0).toUpperCase() + name.slice(1),
                user: req.body.user,
                urlParams: JSON.stringify(req.query),
                facebookAppId: app.locals.config.facebook.appId,
                section: req.params.section
            };
            Object.assign(defaultParams, params);
            res.render(name, defaultParams);
        }
    }

    return router;
};
