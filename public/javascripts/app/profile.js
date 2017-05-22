require.config({
    baseUrl: '/javascripts/libs'
});
require(['./common'], function (common) {
    require(["jquery", "app/utils/auth", "bootstrap"], function ($, Auth) {
        $(document).ready(function () {
            $("#logoutButton").on('click', function (e) {
                e.preventDefault();
                Auth.logout('/profile');
            });
        });
    });
});
