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
            
            $("#settings-sublinks").on('hide.bs.collapse show.bs.collapse', function () {
                $('a[data-target="#settings-sublinks"] i').toggleClass('hidden');
            });
            
            if ($("#settings-sublinks a.active").length) {
                $('#settings-sublinks').collapse('show');
            }
        });
    });
});
