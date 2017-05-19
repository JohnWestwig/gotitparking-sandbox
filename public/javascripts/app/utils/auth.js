define(['jquery', 'app/utils/apiRequest', 'app/utils/tokenManager', 'facebook'], function ($, ApiRequest, TokenManager, FB) {
    var onLoginSuccess = function (token, destination) {
        TokenManager.setToken(token);
        window.location.href = destination ? destination : '/home';
    };
    var onLoginError = function (errors) {
        console.log(errors);
        errors.forEach(function (error) {
            $messageContainer.empty();
            $messageContainer.append($('<p></p>').addClass('text-danger').text(error.error.msg));
        });
    };
    
    return {
        init: function ($loginButton, $emailField, $passwordField, $messageContainer, destination) {
            $loginButton.on('click', function (e) {
                e.preventDefault();
                ApiRequest.send('login', 'post', {
                    email: $emailField.val(),
                    password: $passwordField.val()
                }, function (data) {
                    onLoginSuccess(data.token, destination);
                }, onLoginError);
            });
        },
        initFacebook: function ($loginFacebookButton, destination) {
            $loginFacebookButton.on('click', function (e) {
                e.preventDefault();
                FB.login(function (response) {
                    if (response.authResponse) {
                        console.log(response.authResponse);
                        ApiRequest.send('login/facebook', 'post', {
                            facebookId: response.authResponse.userID,
                        }, function (data) {
                            onLoginSuccess(data.token, destination);
                        }, onLoginError);
                    }
                });
            });
        },
        logout: function (destination) {
            var next = function () {
                if (destination) {
                    window.location.href = desintation;
                } else {
                    window.location.reload();
                }
            };
            TokenManager.clearToken();
            FB.getLoginStatus(function (response) {
                if (response && response.status === 'connected') {
                    FB.logout(next);
                } else {
                    next();
                }
            });
        }
    };
});
