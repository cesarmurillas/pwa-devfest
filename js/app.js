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

// Detectar cambios de conexión
function isOnline() {
    if (navigator.onLine) {
        // Network conection
        $.mdtoast('Online', {
            interaction: true,
            interactionTimeout: 1000,
            actionText: 'Ok!',
            type: 'success'
        });
    } else {
        // No Network conection
        $.mdtoast('Offline', {
            interaction: true,
            actionText: 'Ok!',
            type: 'warning'
        });
    }
}

window.addEventListener('online', isOnline);
window.addEventListener('offline', isOnline);

isOnline();