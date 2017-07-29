require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "app/models/Event", "app/views/EventList", "bootstrap"], function ($, Event, EventList) {
        $(document).ready(function () {});
    });
});