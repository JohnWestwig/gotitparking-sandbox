var jwt = require('jsonwebtoken');

module.exports = function (app, strict) {
    var jwt_secret = process.env.JWT_SECRET;
    return function (req, res, next) {
        var token = (req.body && req.body.token) || (req.query && req.query.token) || req.headers['x-token'];
        if (token) {
            jwt.verify(token, jwt_secret, function (error, decoded) {
                if (error) {
                    if (strict) {
                        res.end('Token error; ' + error, 400);
                    } else {
                        next();
                    }
                } else {
                    req.body.userId = decoded.id;
                    next();
                }
            });
        } else {
            if (strict) {
                res.end('No token provided', 400);
            } else {
                next();
            }
        }
    };
}
