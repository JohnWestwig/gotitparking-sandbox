define(["jquery", "underscore", "text!app/views/templates/eventHeader.html"], function ($, _, eventHeaderTemplate) {
    return function (container) {
        var eventHeader = {
            render: function (event) {
                container.append(_.template(eventHeaderTemplate)({
                    event: event
                }));
            }
        };
        return eventHeader;
    };
});
