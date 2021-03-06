define(['jquery', 'app/utils/apiRequest'], function ($, ApiRequest) {
    return {
        one: function (eventId, success, error) {
            ApiRequest.send('events/' + eventId, 'get', undefined, success, error);
        },
        offerings: function (eventId, success, error) {
            ApiRequest.send('events/' + eventId + '/offerings', 'get', undefined, success, error);
        }
    };
});