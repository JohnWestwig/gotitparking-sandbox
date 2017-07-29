define(['jquery', 'app/utils/apiRequest'], function ($, ApiRequest) {
    return {
        search: function (pattern, success, error) {
            //ApiRequest.send('schools/')
        },
        events: function (schoolId, success, error) {
            ApiRequest.send('schools/' + schoolId + '/events', 'get', undefined, success, error);
        }
    };
});
