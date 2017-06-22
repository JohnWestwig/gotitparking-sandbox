define(['jquery', 'app/utils/apiRequest'], function ($, ApiRequest) {
    return {
        one: function (eventId, success, error) {
            ApiRequest.send('events/' + eventId, 'get', undefined, success, error);
        }
    };
});
