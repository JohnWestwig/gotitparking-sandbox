var express = require('express'),
    router = express.Router(),
    apiError = require('./apiError');

module.exports = function (app, db) {
    router.get('/', function (req, res) {
        getVehicles(req.body.user.id, function (vehicles) {
            res.status(200).json(vehicles);
        }, function (errors) {
            apiError.send(res, errors);
        });
    });

    router.post('/', function (req, res) {
        var make = req.body.make,
            model = req.body.model,
            color = req.body.color,
            plate = req.body.plate,
            isDefault = req.body.isDefault
        addVehicle(req.body.user.id, make, model, color, plate, isDefault, function () {
            res.sendStatus(200)
        }, function (errors) {
            apiError.send(res, errors);
        });
    })

    router.get('/:vehicleId', function (req, res) {
        getVehicles(req.body.user.id, function (vehicle) {
            res.status(200).json(vehicle);
        }, function (errors) {
            apiError.send(res, errors);
        }, req.params.vehicleId);
    });

    router.put('/:vehicleId', function (req, res) {
        var make = req.body.make,
            model = req.body.model,
            color = req.body.color,
            plate = req.body.plate,
            isDefault = req.body.isDefault
        updateVehicle(req.body.user.id, req.params.vehicleId, make, model, color, plate, isDefault, function () {
            res.sendStatus(200);
        }, function (errors) {
            apiError.send(res, errors);
        });
    });
    
    router.delete('/:vehicleId', function (req, res) {
        deleteVehicle(req.body.user.id, req.params.vehicleId, function () {
            res.sendStatus(200);
        }, function (errors) {
            apiError.send(res, errors);
        });
    });

    function getVehicles(userId, successHandler, errorHandler, vehicleId) {
        db('vehicles')
            .select('id', 'make', 'model', 'color', 'plate', 'is_default AS isDefault')
            .where('user_id', userId)
            .modify(function (qb) {
                if (vehicleId) {
                    qb.where('id', vehicleId).first();
                    qb.then(function (row) {
                        console.log("row", row);
                        if (!row) {
                            errorHandler([5000]);
                        } else {
                            successHandler(row);
                        }
                    });
                } else {
                    qb.then(successHandler);
                }
            })
            .catch(function (error) {
                console.log(error);
                errorHandler([5000]);
            });
    }

    function addVehicle(userId, make, model, color, plate, isDefault, successHandler, errorHandler) {
        db('vehicles')
            .insert({
                user_id: userId,
                make: make,
                model: model,
                color: color,
                plate: plate,
                is_default: isDefault
            })
            .then(successHandler)
            .catch(function (error) {
                console.log(error);
                errorHandler([5000]);
            })
    }

    function updateVehicle(userId, vehicleId, make, model, color, plate, isDefault, successHandler, errorHandler) {
        db('vehicles')
            .update({
                make: make,
                model: model,
                color: color,
                plate: plate,
                is_default: isDefault
            })
            .where({
                user_id: userId,
                id: vehicleId
            })
            .then(successHandler)
            .catch(function (error) {
                errorHandler([5000]);
            });
    }

    function deleteVehicle(userId, vehicleId, successHandler, errorHandler) {
        db('vehicles')
            .where({
                user_id: userId,
                id: vehicleId
            })
            .del()
            .then(successHandler)
            .catch(function (error) {
                errorHandler([5000]);
            });
    }

    return router;
}
