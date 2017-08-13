require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "app/models/Event", "app/views/park/OfferingList", "app/views/park/OfferingMap", "app/views/park/EventHeader", "bootstrap"], function ($, Event, OfferingList, OfferingMap, EventHeader) {

        var offeringMarkers = [];

        $(document).ready(function () {
            /* Initialize views */
            const eventHeader = new EventHeader($('#eventHeaderContainer'));
            const offeringMap = new OfferingMap(map);
            const offeringList = new OfferingList($('#offeringsContainer'));

            /* Register cross-view events */
            offeringList.registerViewOnMapEvent(function (offering) {
                offeringMap.viewOffering(offering);
            });

            Event.one(eventId, function (event) {
                eventHeader.render(event);
                offeringMap.renderEvent(event);
            });
            Event.offerings(eventId, function (offerings) {
                offeringMap.renderOfferings(offerings);
                //offeringMap.viewOffering(offerings[0]);
                offeringList.render(offerings);
                offeringMap.registerDrivewayMarkerSelectedEvent(function (offering) {
                    offeringList.highlightOffering(offering);
                });
            });

            $('#searchResultsContainer').on('click', 'toggleEventSearch', function (e) {
                console.log(e);
                e.preventDefault();
                $("#searchModal").modal("show");
            });
        });
    });
});

function initMap() {
    map = new google.maps.Map(document.getElementById('mapContainer'), {
        center: {
            lat: -25.363,
            lng: 131.044
        },
        zoom: 15,
        mapTypeControl: false
    });
    directionsDisplay = new google.maps.DirectionsRenderer({
        map: map,
        suppressMarkers: true,
        preserveViewport: true
    });
    directionsService = new google.maps.DirectionsService;
}
