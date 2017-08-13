define(["jquery", "underscore"], function ($, _) {
    return function (map, event) {
        const venueIcon = {
            url: "/images/stadium_icon.png",
            anchor: new google.maps.Point(20, 20),
            scaledSize: new google.maps.Size(40, 40)
        };

        const offeringIcon = {
            url: "/images/map_icons/ic_place_black_48px.svg",
            anchor: new google.maps.Point(20, 40),
            scaledSize: new google.maps.Size(40, 40),
            fillColor: '#FF00FF'
        };

        const infoWindow = new google.maps.InfoWindow({
            content: "test"
        });
        const offeringMarkers = [];
        var venueMarker;

        const offeringMap = {
            renderEvent: function (event) {
                map.setCenter(new google.maps.LatLng(event.venueLocation.x, event.venueLocation.y));
                venueMarker = new google.maps.Marker({
                    position: new google.maps.LatLng(event.venueLocation.x, event.venueLocation.y),
                    map: map,
                    icon: venueIcon
                });
            },
            renderOfferings: function (offerings) {
                const bounds = new google.maps.LatLngBounds();
                offerings.forEach(offering => {
                    const offeringMarker = new google.maps.Marker({
                        position: new google.maps.LatLng(offering.location.x, offering.location.y),
                        map: map,
                        animation: google.maps.Animation.DROP,
                        icon: offeringIcon,
                        offering: offering
                    });
                    offeringMarker.addListener('click', () => offeringMap.viewOffering(offering));
                    bounds.extend(offeringMarker.position);
                    offeringMarkers.push(offeringMarker);
                });
                map.fitBounds(bounds);
            },
            viewOffering: function (offering) {
                //map.setCenter(venueMarker.position);
                //infoWindow.setContent("Id: " + offering.id);
                //infoWindow.open(map, offeringMarkers.find(marker => marker.offering === offering));
                
                directionsService.route({
                    origin: new google.maps.LatLng(offering.location.x, offering.location.y),
                    destination: venueMarker.position,
                    travelMode: 'WALKING'
                }, function (response, status) {
                    if (status === 'OK') {
                        directionsDisplay.setDirections(response);
                    }
                });
            },
            registerDrivewayMarkerSelectedEvent: function (onEvent) {
                offeringMarkers.forEach(marker => marker.addListener('click', () => onEvent(marker.offering)));
            }
        };
        return offeringMap;
    }
});
