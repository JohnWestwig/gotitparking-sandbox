require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery"], function ($) {
        $(document).ready(function () {
            console.log("document is ready");
        });
    });
});
