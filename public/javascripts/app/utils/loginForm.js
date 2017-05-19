$(document).ready(function () {
    $(document).on('submit', '.loginForm', function (e) {
        e.preventDefault();
        apiLogin($(this).find('input[name="email"]').val(), $(this).find('input[name="password"]').val(), function () {
            window.location.href = urlParams.loginDestination ? urlParams.loginDestination : '/home'
        }, function (errors) {
            $(".loginErrors").empty();
            errors.forEach(function (error, i) {
                $(".loginErrors").append('<p class="text-danger">' + errors[i].error.msg + '</p>');
            });
        })
    });
});

