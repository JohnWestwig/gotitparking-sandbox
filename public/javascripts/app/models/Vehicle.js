define(['jquery', 'app/utils/apiRequest'], function ($, ApiRequest) {
    return {
        add: function (make, model, color, plate, isDefault, success, error) {
            ApiRequest.send('vehicles', 'post', {
                make: make,
                model: model,
                color: color,
                plate: plate,
                isDefault: isDefault
            }, success, error);
        },
        get: function (id, success, error) {
            ApiRequest.send('vehicles/' + id, 'get', {}, success, error);
        },
        load: function (success, error) {
            ApiRequest.send('vehicles', 'get', {}, success, error);
        },
        remove: function (id, success, error) {
            ApiRequest.send('vehicles/' + id, 'delete', {}, success, error);
        },
        update: function (id, make, model, color, plate, isDefault, success, error) {
            ApiRequest.send('vehicles/' + id, 'put', {
                make: make,
                model: model,
                color: color,
                plate: plate,
                isDefault: isDefault
            }, success, error);
        }
    };
});