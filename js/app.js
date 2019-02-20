/* $('body').scrollspy({
    target: '#collapse_target'
}); */

new WOW().init();

if (navigator.serviceWorker) {
    navigator.serviceWorker.register('/sw.js');
}