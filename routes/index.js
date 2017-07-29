var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

module.exports = function (app) {

    router.use(function (req, res, next) {
        var token = req.headers['x-token'] || req.cookies.token;
        console.log("token", token);
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, function (error, decoded) {
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
    router.get('/home', render("home", {}));
    router.get('/profile', function (req, res) {
        res.redirect(req.body.user ? '/profile/activity' : '/profile/privacy');
    });
    router.get('/profile/:section', render("profile", {}));
    router.get('/profile/settings/:section', render("profile", {}));
    router.get('/park', render('park', {}));

    /* Send some default parameters to all layouts, merge with custom parameters. */
    function render(name, params) {
        return function (req, res, next) {
            var defaultParams = {
                page: name,
                title: name.charAt(0).toUpperCase() + name.slice(1),
                user: req.body.user,
                urlParams: JSON.stringify(req.query),
                facebookAppId: process.env.FACEBOOK_APP_ID,
                section: req.params.section,
                eventId: req.query.eventId
            };
            Object.assign(defaultParams, params);
            res.render(name, defaultParams);
        }
    }

    return router;
};
