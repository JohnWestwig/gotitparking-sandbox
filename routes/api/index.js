var express = require('express');
var router = express.Router();



module.exports = function (app) {
    var db = require('./db').connect(app);

    //var authRouter = require('./auth')(app, db);

    router.get('/', function (req, res) {
        console.log(req.session);
        res.json({
            session: req.session
        });
    });
    
    function validateUser(req, res, next) {
        if (req.session.userId) {
            next();
        } else {
            res.redirect('/login');
        }
    }

    router.use('/login', require('./auth')(app, db));
    router.use('/logout', require('./logout')());
    router.use('/register', require('./register')(app, db));
    
    router.get('/test', validateUser, function(req, res) {
        res.json({
            hello: "world"
        });
    });
    
    return router;
};
