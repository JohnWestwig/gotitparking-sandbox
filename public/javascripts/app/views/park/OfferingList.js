define(["jquery", "underscore", "text!app/views/templates/offering.html"], function ($, _, offeringTemplate) {
    return function (container) {
        var m_offerings = [];

        function getOfferingById(offeringId) {
            console.log(m_offerings);
            return m_offerings.find(offering => offering.id === offeringId);
        }

        var offeringList = {
            render: function (offerings) {
                m_offerings = offerings;
                m_offerings.forEach(function (offering, index) {
                    container.append(_.template(offeringTemplate)({
                        offering: offering
                    }));
                });

                container.on('click', '.sidebar-offering-see-more', function (e) {
                    e.preventDefault();
                    $(this).closest('.sidebar-offering').toggleClass('detailed');
                    $(this).text($(this).closest('.sidebar-offering').hasClass('detailed') ? "See less" : "See more");
                });
            },
            highlightOffering: function (offering) {
                var offeringElement = container.find("*[data-offering-id='" + offering.id + "']");
                offeringElement.prependTo(container);
                container.find('.highlighted').removeClass('highlighted');
                offeringElement.addClass('highlighted');
            },
            registerViewOnMapEvent: function (onEvent) {
                container.on('click', '.sidebar-offering-view-on-map', function (e) {
                    var offeringId = $(this).closest('.sidebar-offering').data('offeringId');
                    console.log(getOfferingById(offeringId));
                    onEvent(getOfferingById(offeringId))
                });
            }
        };
        return offeringList;
    };
});
