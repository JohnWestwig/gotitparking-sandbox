$(document).ready(function () {
    $(function () {
        $('[data-toggle="popover"]').popover({
            content: function() {
                return $('#loginForm').html();
            },
            html: true
        });
    });
});
