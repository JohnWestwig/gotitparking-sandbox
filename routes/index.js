var express = require('express');
var router = express.Router();

module.exports = function (app) {
    var apiRouter = require('./api')(app)

    router.use('/api', apiRouter)

    router.get('/', function (req, res, next) {
        res.render('index', {
            title: 'Express'
        });
    });

    router.get('/login', function (req, res, next) {
        res.render('login', {

        });
    })

    var home = require('./home')
    router.use('/home', home);
    return router;
};
