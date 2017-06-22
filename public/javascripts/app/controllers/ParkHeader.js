require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "app/models/Event", "app/views/EventList", "bootstrap"], function ($, Event, EventList) {
        $(document).ready(function () {
            var $eventContainer = $('#currentEvent');
            Event.one(eventId, function (event) {
                console.log(event);
                $eventContainer.find('.eventType').text(event.type);
                $eventContainer.find('.eventName').text(event.name);
                $eventContainer.find('.eventVenue').text(event.venueName);
                
            }, console.error);
        });

    });
});
