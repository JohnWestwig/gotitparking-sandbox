require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "app/utils/auth", "bootstrap"], function ($, Auth) {
        $(document).ready(function () {
            $('#navbarLogin').popover({
                content: function () {
                    var $loginForm = $('.loginForm').clone();
                    $loginForm.addClass('visible').attr('id', "loginForm");
                    return $loginForm[0].outerHTML;
                },
                html: true
            });

            $('#navbarLogin').on('inserted.bs.popover', function () {
                Auth.initLogin(
                    $('#loginForm').find('.loginButton'),
                    $('#loginForm').find('.loginEmail'),
                    $('#loginForm').find('.loginPassword'),
                    $('#loginForm').find('.loginErrors'));

                Auth.initLoginFacebook($('#loginForm').find('.loginFacebookButton'));
            });

            $('#navbarLogout').on('click', function () {
                Auth.logout();
            });
        });
    });
});
