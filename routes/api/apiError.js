var errors = {
    4001: {
        msg: "No email provided"
    },
    4002: {
        msg: "No password provided"
    },
    4003: {
        msg: "Email not found"
    },
    4004: {
        msg: "Incorrect password"
    },
    5000: {
        msg: "Database error (unknown)"
    },
    5001: {
        msg: "Password encryption error (unknown)"
    }
};

exports.send = function (res, errorCodes) {
    var responseCode = ((errorCodes[0] / 1000) == 4) ? 400 : 500;
    var response = [];
    errorCodes.forEach(function (val, i) {
        response.push({
            code: val,
            error: errors[val]
        });
    });

    res.status(responseCode).json({errors: response});
};