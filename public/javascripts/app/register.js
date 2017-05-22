require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "app/utils/auth", "bootstrap"], function ($, Auth) {
        $(document).ready(function () {
            Auth.initRegister(
                $('.registerButton'),
                $('.registerEmail'),
                $('.registerPassword'),
                $('.registerFirstName'),
                $('.registerLastName'),
                $('.registerErrors')
            );

            Auth.initRegisterFacebook(
                $('.registerFacebookButton'),
                $('.registerErrors')
            );
        });
    });
});
