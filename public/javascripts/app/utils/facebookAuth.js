window.fbAsyncInit = function () {
    FB.init({
        appId: facebookAppId,
        xfbml: true,
        version: 'v2.9'
    });
    FB.AppEvents.logPageView();
};

(function (d, s, id) {
    var js, fjs = d.getElementsByTagName(s)[0];
    if (d.getElementById(id)) {
        return;
    }
    js = d.createElement(s);
    js.id = id;
    js.src = "//connect.facebook.net/en_US/sdk.js";
    fjs.parentNode.insertBefore(js, fjs);
}(document, 'script', 'facebook-jssdk'));

$(document).ready(function () {
    $(document).on('click', '.facebook-login', function (e) {
        e.preventDefault();
        FB.login(function (response) {
            if (response.authResponse) {
                apiLoginFacebook(response.authResponse.userID, function () {
                    window.location.href = urlParams.loginDestination ? urlParams.loginDestination : '/home'
                }, function (errors) {
                    
                });
            }
        });
    });
    $(document).on('click', '.facebook-register', function (e) {
        e.preventDefault();
        FB.login(function (response) {
            if (response.authResponse) {
                FB.api('/me?fields=email,first_name,last_name', function (me) {
                    makeApiRequest('/api/register/facebook', 'post', {
                        facebookId: me.id,
                        email: me.email,
                        firstName: me.first_name,
                        lastName: me.last_name
                    }, function (data) {
                        console.log(data);
                    }, function (data) {
                        console.log("ERROR", data);
                    });
                });
            } else {

            }
        }, {
            scope: 'email, public_profile',
        });
    })
});
