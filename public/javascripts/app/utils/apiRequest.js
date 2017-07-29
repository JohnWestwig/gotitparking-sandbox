define(['jquery', 'app/utils/tokenManager'], function ($, TokenManager) {
    return {
        send: function (url, method, data, success, failure) {
            var url = '/api/' + url;
            var method = method.toUpperCase();
            var token = TokenManager.getToken();
            console.log(method + " " + url, data);
            $.ajax({
                url: url,
                method: method,
                headers: {
                    'x-token': token
                },
                contentType: "application/json",
                data: JSON.stringify(data),
                success: function (data) {
                    success(data);
                },
                error: function (xhr, textStatus, errorThrown) {
                    failure(xhr.responseJSON.errors);
                }
            });
        }
    };
});