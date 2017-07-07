require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "bootstrap"], function ($) {
        $(document).ready(function () {
            $(".nextArrow").click(function () {
                console.log($(this).parent().offset());
                $('html,body').animate({
                    scrollTop: $(this).parent().offset().top - 50
                }, "medium");
            });
        });
    });
});
