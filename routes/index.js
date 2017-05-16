var express = require('express');
var router = express.Router();

module.exports = function (app) {
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

    return router;
};

/* Send some default parameters to all layouts, merge with custom parameters. */
function render(name, params) {
    return function (req, res, next) {
        var defaultParams = {
            title: name.charAt(0).toUpperCase() + name.slice(1),
            user: req.user,
            urlParams: JSON.stringify(req.query)
        };
        Object.assign(defaultParams, params);
        res.render(name, defaultParams);
    }
}
