define(["jquery", "bootstrap"], function ($) {

    function createEventListItem(event, hideArrow) {
        var startDate = new Date(event.startTime);
        var monthAbbrs = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];

        return $(["<div class='row event-result'>", "<div class='col-md-2 col-xs-3 text-center event-result-date'>", "<p class='event-result-date-day'>" + startDate.getDate() + "</p>", "<p class='event-result-date-month'>" + monthAbbrs[startDate.getMonth()] + "</p>", "</div>", "<div class='col-md-9 col-xs-8 event-result-content'>", "<p class='event-result-sport'>" + event.type + "</p>", "<p class='event-result-name'>" + event.name + "</p>", "<p class='event-result-venue'>" + event.venueName + "</p>", "</div>", "<div class='col-md-1 col-xs-1 event-result-continue'" + (hideArrow ? "hidden" : "") + ">", "<i class='fa fa-5x fa-chevron-right event-result-continue-button' data-event-id='" + event.id + "'></i>", "</div>", "</div>"].join("\n"));
    }

    return {
        populateEventList: function ($container, events) {
            $container.empty();
            events.forEach(event => $container.append(createEventListItem(event)));
        },
        createEventListItem: createEventListItem
    };
});