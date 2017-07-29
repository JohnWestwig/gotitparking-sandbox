define(['facebook'], function () {
    console.log(facebookAppId);
    FB.init({
        appId: facebookAppId,
        version: 'v2.9'
    });
});
