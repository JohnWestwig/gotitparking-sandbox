require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "bootstrap"], function ($) {
        $(document).ready(function () {
            $("#howItWorks .nextArrow").click(function () {
                $('html,body').animate({
                    scrollTop: $("#howItWorks").offset().top
                }, 'slow');
            });
        });
    });
});
