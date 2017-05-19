require.config({
    baseUrl: 'javascripts/libs',
    shim: {
        "bootstrap": {
            "deps": ['jquery']
        },
        'facebook': {
            exports: 'FB'
        }
    },
    paths: {
        app: '../app',
        bootstrap: 'bootstrap.min',
        jquery: '//code.jquery.com/jquery-3.2.1.min',
        facebook: '//connect.facebook.net/en_US/all'
    }
});
require(['fb']);

