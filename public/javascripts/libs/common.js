require.config({
    baseUrl: '/javascripts/libs',
    shim: {
        "autocomplete": ['jquery'],
        "bootstrap": {
            "deps": ['jquery']
        },
        'facebook': {
            exports: 'FB'
        }
    },
    paths: {
        app: '../app',
        autocomplete: 'jquery.autocomplete.min',
        bootstrap: 'bootstrap.min',
        jquery: '//code.jquery.com/jquery-3.2.1.min',
        facebook: '//connect.facebook.net/en_US/all'
    }
});
require(['fb']);