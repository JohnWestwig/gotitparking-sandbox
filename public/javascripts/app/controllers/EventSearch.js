require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "app/models/School", "app/views/EventList", "bootstrap", "autocomplete"], function ($, School, EventList) {
        $(document).ready(function () {
            $("#modalSearchBar").autocomplete({
                serviceUrl: "/api/schools",
                paramName: "filter",
                transformResult: function (schools) {
                    schools = JSON.parse(schools);
                    return {
                        suggestions: schools.map(function (school) {
                            return {
                                value: school.name,
                                data: school.id
                            };
                        })
                    };
                },
                autoSelectFirst: true,
                onSelect: onSchoolChosen
            });

            $('#eventResultsContainer').on('click', '.event-result-continue-button', function (e) {
                e.preventDefault();
                window.location.href = "/park?eventId=" + $(this).data('event-id');
            });
        });

        function onSchoolChosen(suggestion) {
            School.events(suggestion.data, function (events) {
                EventList.populateEventList($('#eventResultsContainer'), events);
            }, console.error);
        }
    });
});