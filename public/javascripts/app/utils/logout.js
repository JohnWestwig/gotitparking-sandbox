$(document).ready(function () {
    $(document).on('click', '.logout', function (e) {
        e.preventDefault();
        logout();
    });
});

function logout() {
    Cookies.remove('token');
    FB.logout(function () {
        window.location.reload();
    });
}
