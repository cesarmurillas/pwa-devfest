/* $('body').scrollspy({
    target: '#collapse_target'
}); */

new WOW().init();

var url = window.location.href;
var swLocation = '/pwa-devfest/sw.js';

if (navigator.serviceWorker) {

    if (url.includes('localhost')) {
        swLocation = '/sw.js';
    }
    navigator.serviceWorker.register(swLocation);
}