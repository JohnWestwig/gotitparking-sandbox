var express = require('express'),
    router = express.Router(),
    apiError = require('./apiError');

module.exports = function (app, db) {
    router.get('/', function (req, res) {
        getSchools(undefined, req.query.filter ? req.query.filter : undefined, function (schools) {
            res.status(200).json(schools);
        }, function (errors) {
            apiError.send(res, errors);
        });
    });

    router.get('/:schoolId', function (req, res) {
        getSchools(req.params.schoolId, undefined, function (school) {
            res.status(200).json(school);
        }, function (errors) {
            apiError.send(res, errors);
        }, req.params.vehicleId);
    });

    router.get('/:schoolId/events', function (req, res) {
        getEvents(req.params.schoolId, function (events) {
            res.status(200).json(events);
        }, function (errors) {
            apiError.send(res, errors);
        });
    });

    function getSchools(schoolId, filter, successHandler, errorHandler) {
        db('schools')
            .select('id', 'name')
            .modify(function (qb) {
                if (schoolId) {
                    qb.where('id', schoolId).first();
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
            
                if (filter) {
                    qb.where('name', 'like', '%' + filter + '%');
                }
            })
            .catch(function (error) {
                errorHandler([5000]);
            });
    }

    function getEvents(schoolId, successHandler, errorHandler) {
        db('events')
            .join('venues', 'venues.id', 'events.venue_id')
            .select('events.id', 'events.name', 'start_time AS startTime', 'end_time AS endTime', 'type', 'venues.name AS venueName')
            .where('venues.school_id', schoolId)
            .orderBy('start_time')
            .then(successHandler)
            .catch(function (error) {
                errorHandler([5000]);
            })
    }

    return router;
}
