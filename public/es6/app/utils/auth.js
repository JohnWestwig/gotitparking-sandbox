define(['jquery', 'app/utils/apiRequest', 'app/utils/tokenManager', 'facebook'], function ($, ApiRequest, TokenManager, FB) {
    var onLoginSuccess = function (token, destination) {
        TokenManager.setToken(token);
        if (destination) {
            window.location.href = destination;
        } else {
            window.location.reload();
        }
    };
    var onRegisterSuccess = function ($messageContainer) {
        $messageContainer.empty();
        $messageContainer.append($('<p></p>').addClass('text-success').text("A confirmation email has been sent to you.  Please click the link to finish registering."));
    }
    var onAuthError = function ($messageContainer, errors) {
        console.log(errors);
        errors.forEach(function (error) {
            $messageContainer.empty();
            $messageContainer.append($('<p></p>').addClass('text-danger').text(error.error.msg));
        });
    };

    return {
        initLogin: function ($loginButton, $emailField, $passwordField, $messageContainer, destination) {
            $loginButton.on('click', function (e) {
                e.preventDefault();
                ApiRequest.send('login', 'post', {
                    email: $emailField.val(),
                    password: $passwordField.val()
                }, function (data) {
                    onLoginSuccess(data.token, destination);
                }, function (errors) {
                    onAuthError($messageContainer, errors);
                });
            });
        },
        initLoginFacebook: function ($loginFacebookButton, destination) {
            $loginFacebookButton.on('click', function (e) {
                e.preventDefault();
                FB.login(function (response) {
                    if (response.authResponse) {
                        console.log(response.authResponse);
                        ApiRequest.send('login/facebook', 'post', {
                            facebookId: response.authResponse.userID,
                        }, function (data) {
                            onLoginSuccess(data.token, destination);
                        }, function (errors) {
                            onAuthError($messageContainer, errors);
                        });
                    }
                });
            });
        },
        logout: function (destination) {
            var next = function () {
                if (destination) {
                    window.location.href = destination;
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
        },
        initRegister: function ($registerButton, $emailField, $passwordField, $firstNameField, $lastNameField, $messageContainer) {
            $registerButton.on('click', function (e) {
                e.preventDefault();
                ApiRequest.send('register', 'post', {
                    email: $emailField.val(),
                    password: $passwordField.val(),
                    firstName: $firstNameField.val(),
                    lastName: $lastNameField.val()
                }, function () {
                    onRegisterSuccess($messageContainer);
                }, function (errors) {
                    onAuthError($messageContainer, errors);
                })
            })
        },
        initRegisterFacebook: function ($registerFacebookButton, $messageContainer) {
            $registerFacebookButton.on('click', function (e) {
                e.preventDefault();
                FB.login(function (response) {
                    if (response.authResponse) {
                        FB.api('/me?fields=email,first_name,last_name', function (me) {
                            ApiRequest.send('register/facebook', 'post', {
                                facebookId: me.id,
                                email: me.email,
                                firstName: me.first_name,
                                lastName: me.last_name
                            }, function (data) {
                                window.location.href = '/home';
                            }, function (errors) {
                                onAuthError($messageContainer, errors);
                            });
                        });
                    }
                }, {
                    scope: 'email, public_profile',
                });
            });
        }
    };
});
