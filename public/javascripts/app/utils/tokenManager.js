define(['cookie'], function (Cookies) {
    var tokenId = 'token';
    return {
        getToken: function () {
            Cookies.get(tokenId);
        },
        setToken: function (token) {
            Cookies.set(tokenId, token);
        },
        clearToken: function () {
            Cookies.remove(tokenId);
        }
    };
});
