var express = require('express'),
    router = express.Router(),
    apiError = require('./apiError');

module.exports = function (app, db) {
    router.get('/', function (req, res) {
        getEvents(undefined, req.query.filter ? req.query.filter : undefined, function (schools) {
            res.status(200).json(schools);
        }, function (errors) {
            apiError.send(res, errors);
        });
    });

    router.get('/:eventId', function (req, res) {
        getEvents(req.params.eventId, function (schools) {
            res.status(200).json(schools[0]);
        }, function (errors) {
            apiError.send(res, errors);
        });
    });
    
    router.get('/:eventId/offerings', function (req, res) {
        getOfferings(req.params.eventId, function (offerings) {
            res.status(200).json(offerings);
        }, function (errors) {
            apiError.send(res, errors);
        });
    });

    function getEvents(eventId, successHandler, errorHandler) {
        db('events')
            .join('venues', 'venues.id', 'events.venue_id')
            .select('events.id', 'events.name', 'start_time AS startTime', 'end_time AS endTime', 'type', 'venues.name AS venueName', 'venues.location AS venueLocation')
            .where('events.id', eventId)
            .orderBy('start_time')
            .then(successHandler)
            .catch(function (error) {
                console.log(error);
                errorHandler([5000]);
            });
    }
    
    function getOfferings(eventId, successHandler, errorHandler) {
        db('offerings')
            .join('driveways', 'driveways.id', 'offerings.driveway_id')
            .select('offerings.id', 'offerings.price_in_cents', 'driveways.id AS driveway_id', 'driveways.location', 'driveways.line1')
            .where('event_id', eventId)
            .then(successHandler)
            .catch(function (error) {
                console.log(error);
                errorHandler([5000]);
            });
    }

    return router;
}
