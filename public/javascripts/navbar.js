$(document).ready(function () {
    $('[data-toggle="popover"]').popover({
        content: function () {
            var $loginForm = $('.loginForm').clone();
            $loginForm.addClass('visible').attr('id', "loginForm");
            return $loginForm[0].outerHTML;
        },
        html: true
    });
});
