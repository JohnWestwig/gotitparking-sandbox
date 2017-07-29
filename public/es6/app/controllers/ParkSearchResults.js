require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "app/models/Event", "app/views/SidebarOffering", "bootstrap"], function ($, Event, SidebarOffering) {

        var offeringMarkers = [];

        $(document).ready(function () {
            Event.one(eventId, displayEventInfo);
            Event.offerings(eventId, displayOfferings);
            
            $('#offeringsContainer').on('click', '.sidebar-offering-view-on-map', function (e) {
                e.preventDefault();
                var offeringId = $(this).closest('.sidebar-offering').data('offering-id');
                var marker = offeringMarkers.filter(function (m) {
                    return m.offering.id == offeringId;
                })[0];

                var infoWindow = new google.maps.InfoWindow({
                    content: SidebarOffering.createSidebarOffering(marker.offering)[0].outerHTML
                });

                infoWindow.open(map, marker.marker);
            });

            $('#offeringsContainer').on('click', '.sidebar-offering-see-more', function (e) {
                e.preventDefault();
                $(this).closest('.sidebar-offering').toggleClass('detailed');
                $(this).text($(this).closest('.sidebar-offering').hasClass('detailed') ? "See less" : "See more");
            });
            
            $('#searchResultsContainer').on('click', 'toggleEventSearch', function (e) {
                console.log(e);
                e.preventDefault();
                $("#searchModal").modal("show");
            });
        });

        function displayEventInfo(event) {
            var $eventContainer = $('#eventInfoContainer');
            $eventContainer.find('.eventType').text(event.type);
            $eventContainer.find('.eventName').text(event.name);
            $eventContainer.find('.eventVenue').text(event.venueName);
            var eventLocation = new google.maps.LatLng(event.venueLocation.x, event.venueLocation.y);

            var venueIcon = {
                url: "/images/map_icons/ic_pin_drop_black_48px.svg",
                anchor: new google.maps.Point(25, 50),
                scaledSize: new google.maps.Size(50, 50)
            };

            new google.maps.Marker({
                position: eventLocation,
                animation: google.maps.Animation.DROP,
                map: map,
                icon: venueIcon
            });

            var walkingTiers = [{
                time: 10,
                color: "#0000FF"
            }, {
                time: 5,
                color: "#00FF00"
            }];

            for (var i = 0; i < walkingTiers.length; i++) {
                var tier = walkingTiers[i];
                new google.maps.Circle({
                    strokeColor: tier.color,
                    strokeOpacity: 0.20,
                    strokeWeight: 1,
                    fillColor: tier.color,
                    fillOpacity: 0.20,
                    map: map,
                    center: eventLocation,
                    radius: 1609 * tier.time / 20
                });
            }

            map.setCenter(eventLocation);
        }

        function displayOfferings(offerings) {
            displayOfferingsInSidebar(offerings);
            displayOfferingsOnMap(offerings);
        }

        function displayOfferingsInSidebar(offerings) {
            var offeringsContainer = $("#offeringsContainer");
            console.log(offerings);
            offerings.forEach(function (offering) {
                offeringsContainer.append(SidebarOffering.createSidebarOffering(offering));
            });
        }

        function displayOfferingsOnMap(offerings) {
            var offeringIcon = {
                url: "/images/map_icons/ic_place_black_48px.svg",
                anchor: new google.maps.Point(20, 40),
                scaledSize: new google.maps.Size(40, 40),
                fillColor: '#FF00FF'
            };

            offerings.forEach(function (offering) {
                var marker = new google.maps.Marker({
                    position: new google.maps.LatLng(offering.location.x, offering.location.y),
                    map: map,
                    icon: offeringIcon,
                    offering: offering
                });
                offeringMarkers.push(marker);
                marker.addListener('click', function () {
                    highlightOffering(this.offering);
                });
            });
            console.log(offeringMarkers);
        }

        function highlightOffering(offering) {
            var sidebarOffering = $('.sidebar-offering[data-offering-id="' + offering.id + '"]');

        }
    });
});


function initMap() {
    map = new google.maps.Map(document.getElementById('mapContainer'), {
        zoom: 4,
        center: {
            lat: -25.363,
            lng: 131.044
        },
        zoom: 14,
        mapTypeControl: false
    });
}
