$(document).ready(function () {
    $(document).on('submit', '.loginForm', function (e) {
        e.preventDefault();
        $.ajax({
            url: $(this).attr('action'),
            type: "POST",
            data: $(this).serialize(),
            success: function (data) {
                if (urlParams.loginDestination) {
                    window.location.href = urlParams.loginDestination;
                } else {
                    location.reload();
                }
            },
            error: function (jXHR, textStatus, errorThrown) {
                handleLoginErrors(jXHR.responseJSON.errors);
            }
        });
    });
});

function handleLoginErrors(errors) {
    $(".loginErrors").empty();
    errors.forEach(function (error, i) {
        $(".loginErrors").append('<p class="text-danger">' + errors[i].error.msg + '</p>');
    });
}
