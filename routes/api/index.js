var express = require('express');
var router = express.Router();
var jwt = require('jsonwebtoken');

module.exports = function (app) {
    var db = require('./db').connect(app);

    router.get('/', function (req, res) {
        res.sendStatus(200);
    });

    function validateUser (req, res, next) {
        /* TODO: decide where the fuck this token should be */
        console.log(req.body);
        if (req.body.user) {
            next();
        } else {
            res.sendStatus(401);
        }
    }

    router.use('/login', require('./login')(app, db));
    router.use('/register', require('./register')(app, db));
    router.use('/vehicles', validateUser, require('./vehicles')(app, db));

    router.get('/test', validateUser, function (req, res) {
        res.json({
            user: req.body.user
        });
    });

    return router;
};
