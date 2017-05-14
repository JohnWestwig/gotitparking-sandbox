var express = require('express');
var router = express.Router();


module.exports = function (app) {
    var db = require('./db').connect(app);
    
    //var authRouter = require('./auth')(app, db);
    
    router.get('/', function (req, res) {
        res.send("GotIt! Parking API root.");
    });
    
    router.use('/login', require('./auth')(app, db));
    
    return router;
};
