var express = require('express');
var router = express.Router();

module.exports = (req, res) => {
    res.render('home', {
        title: "Home",
        loggedIn: true
    });
};
