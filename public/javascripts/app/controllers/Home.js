require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "bootstrap"], function ($) {
        $(document).ready(function () {
            $(".nextArrow").click(function () {
                $('html,body').animate({
                    scrollTop: $(this).parent().offset().top
                }, 'slow');
            });
        });
    });
});
