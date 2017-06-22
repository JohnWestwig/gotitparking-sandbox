require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "bootstrap"], function ($) {
        $(document).ready(function () {

        });


    });
});

function initMap() {
    var map = new google.maps.Map(document.getElementById('mapContainer'), {
        zoom: 4,
        center: {lat: -25.363, lng: 131.044},
        mapTypeControl: false
    });
}
