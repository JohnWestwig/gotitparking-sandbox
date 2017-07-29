define(["jquery", "bootstrap"], function ($) {

    function createSidebarOffering(offering) {
        return $([
                "<div class='row sidebar-offering' data-offering-id=" + offering.id + " data-driveway-id=" + offering.driveway_id + ">",
                    "<div class='sidebar-offering-price'>" + ("$" + (offering.price_in_cents / 100)) + "</div>",
                    "<div class='col-md-7 col-xs-7 col-md-offset-2 col-xs-offset-2'>",
                        "<p class='sidebar-offering-address'>" + offering.line1 + "</p>",
                        //"<p class='sidebar-offering-walk-time'><i class='fa fa-clock-o'></i>" + "5 min. walk" + "</p>",
                        "<p class='sidebar-offering-walk-time'><img src='/images/walking_man.png' height=15/>" + "5 min. walk" + "</p>",
                        "<span><a class='sidebar-offering-detail sidebar-offering-see-more' href='#'>See more</a></span>",
                        "<span class='sidebar-offering-detail'>&nbsp;•&nbsp;</span>",
                        "<span><a class='sidebar-offering-detail sidebar-offering-view-on-map' href='#'>View on map</a></span>",
                    "</div>",
                    "<div class='col-md-3 col-xs-3 text-right vcenter'>",
                        "<button class='sidebar-offering-buy'>" + "Buy" + "</button>",
                    "</div>",
                "</div>",
                "<hr>"
            ].join("\n"));
    }

    return {
        createSidebarOffering: createSidebarOffering
    };
});
