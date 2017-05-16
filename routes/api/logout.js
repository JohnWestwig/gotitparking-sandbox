var express = require('express');
var router = express.Router();
var expressSession = require('express-session');

module.exports = function () {
    router.all("/", function (req, res) {
        req.session.destroy(function (err) {
            if (err) {

            } else {
                res.redirect('/home');
            }
        });
    });
    return router;
};
