require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "app/utils/auth", "bootstrap"], function ($, Auth) {
        navbarScrollChange($(this));
        $(document).ready(function () {
            $(document).scroll(function () {
                navbarScrollChange($(this));
            });
            $('#navbarLogin').popover({
                content: function () {
                    var $loginForm = $('.loginForm').clone();
                    $loginForm.addClass('visible').attr('id', "loginForm");
                    return $loginForm[0].outerHTML;
                },
                html: true
            });

            $('#navbarLogin').on('inserted.bs.popover', function () {
                Auth.initLogin($('#loginForm').find('.loginButton'), $('#loginForm').find('.loginEmail'), $('#loginForm').find('.loginPassword'), $('#loginForm').find('.loginErrors'));
                Auth.initLoginFacebook($('#loginForm').find('.loginFacebookButton'));
            });

            $('#navbarLogout').on('click', function () {
                Auth.logout();
            });

            $('#navMenu').on('click', '.menuItem', function () {
                window.location.href = $(this).data('target') || window.location.href;
            });
        });
    });
});

function navbarScrollChange(document) {
    $('#navMenu').toggleClass('scrolling', document.scrollTop() > 30);
}