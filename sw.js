// Imports
importScripts('js/sw-utils.js');

const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';
const INMUTABLE_CACHE = 'inmutable-v1';

const DYNAMIC_CACHE_LIMIT = 100;

const APP_SHELL = [
    '/',
    'index.html',
    'images/favicon.ico',
    'images/content/no-img.jpg',
    'images/content/alejandro-sotelo.png',
    'images/content/Alvaro-Perez.png',
    'images/content/Ana-María-Franco.png',
    'images/content/Andres-Coronado.png',
    'images/content/andres-garcia.png',
    'images/content/bg-devfest.jpg',
    'images/content/bg-footer.jpg',
    'images/content/bg-gallery.jpg',
    'images/content/bg-place.png',
    'images/content/catalina-taborda.png',
    'images/content/charla1Espacio1.png',
    'images/content/charla1Espacio2.png',
    'images/content/charla1Espacio3.png',
    'images/content/charla1Espacio4.png',
    'images/content/charla1Espacio5.png',
    'images/content/charla2Espacio1.png',
    'images/content/charla2Espacio2.png',
    'images/content/charla2Espacio3.png',
    'images/content/charla2Espacio4.png',
    'images/content/charla2Espacio5.png',
    'images/content/charla3Espacio1.png',
    'images/content/charla3Espacio2.png',
    'images/content/charla3Espacio3.png',
    'images/content/charla3Espacio4.png',
    'images/content/charla3Espacio5.png',
    'images/content/charla4Espacio1.png',
    'images/content/charla4Espacio2.png',
    'images/content/charla4Espacio3.png',
    'images/content/charla4Espacio4.png',
    'images/content/charla4Espacio5.png',
    'images/content/Daniela-Arango-Chica.png',
    'images/content/Elizabeth-Berrio.png',
    'images/content/espacio1.png',
    'images/content/espacio2.png',
    'images/content/espacio3.png',
    'images/content/espacio4.png',
    'images/content/espacio5.png',
    'images/content/footer-logo.png',
    'images/content/Froilan-Ruiz-Echavarrria.png',
    'images/content/Guillermo-Díaz-Villegas.png',
    'images/content/img-dev.png',
    'images/content/img-explora.png',
    'images/content/John-Alberto-Sanchez.png',
    'images/content/jorge-aguilar.png',
    'images/content/jorge-moreno.png',
    'images/content/Jose-Alfredo-Fernandez.png',
    'images/content/Juan-Esteban-Castano.png',
    'images/content/Juan-Pablo-Botero.png',
    'images/content/Juan-Pablo-Osorio.png',
    'images/content/Marcela-Barrera.png',
    'images/content/Maria-Paula-Camacho.png',
    'images/content/milena-ocampo.png',
    'images/content/refrigerio.png',
    'images/content/Ricardo-Jose-Dominguez-Carrillo.png',
    'images/content/Roger-Perez.png',
    'images/content/Yuliana-Cañas-Cifuentes.png',
    'images/icon/facebook.png',
    'images/icon/icon-calendar.png',
    'images/icon/icon-location.png',
    'images/icon/linkedin.png',
    'images/icon/menu.svg',
    'images/icon/twitter.png',
    'js/app.js',
    'js/sw-utils.js',
    'js/libs/plugins/mdtoast.min.css',
    'js/libs/plugins/mdtoast.min.js'
];

const APP_SHELL_INMUTABLE = [
    'css/animate.css',
    'css/bootstrap.css',
    'css/bootstrap.min.css',
    'css/main.css',
    'https://fonts.googleapis.com/css?family=Montserrat:300,400,600,700,900',
    'https://code.jquery.com/jquery-3.3.1.slim.min.js',
    'https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.3/umd/popper.min.js',
    'https://stackpath.bootstrapcdn.com/bootstrap/4.1.3/js/bootstrap.min.js',
    'js/bootstrap.js',
    'js/bootstrap.js.map',
    'js/bootstrap.min.js',
    'js/bootstrap.min.js.map',
    'js/jquery-3.3.1.min.js',
    'js/wow.min.js',
];

self.addEventListener('install', e => {

    const cacheStatic = caches.open(STATIC_CACHE)
        .then(cache => cache.addAll(APP_SHELL))
        .catch(error => console.log('Error en cacheStatic:' + error));

    const cacheInmutable = caches.open(INMUTABLE_CACHE)
        .then(cache => cache.addAll(APP_SHELL_INMUTABLE))
        .catch(error => console.log('Error en cacheInmutable:' + error));

    e.waitUntil(Promise.all([cacheStatic, cacheInmutable]));
});

self.addEventListener('activate', e => {

    const respond = caches.keys()
        .then(keys => {
            keys.forEach(key => {
                if (key !== STATIC_CACHE && key.includes('static')) {
                    return caches.delete(key);
                }
                if (key !== DYNAMIC_CACHE && key.includes('dynamic')) {
                    return caches.delete(key);
                }
            });
        });

    e.waitUntil(respond);
});

self.addEventListener('fetch', e => {

    // Estrategias del Cache

    // 1. Cache Only. Todo sale del cache
    // e.respondWith(caches.match(e.request));

    // 2. Cache with Network Fallback. Primero busca en cache, sino lo encuentra busca en la red
    /* const respuesta = caches.match(e.request)
        .then(res => {
            if (res) {
                return res;
            } else {
                // No existe el archivo. Toca ir a la web
                console.log('No existe', e.request.url);
                return fetch(e.request)
                    .then(newResp => {
                        caches.open(DYNAMIC_CACHE)
                            .then(cache => {
                                cache.put(e.request, newResp);
                                limpiarCache(DYNAMIC_CACHE, DYNAMIC_CACHE_LIMIT);
                            });
                        return newResp.clone();
                    });
            }
        });
    e.respondWith(respuesta); */

    // 5. Cache And Network Race
    /* const response = new Promise((resolve, reject) => {
        let rejected = false;
        const failedOnce = () => {
            if (rejected) {
                if (/\.(png|jpg)$/i.test(e.request.url)) {
                    resolve(caches.match('images/content/no-img.jpg'));
                } else {
                    reject('Response');
                }
            } else {
                rejected = true;
            }
        };
        fetch(e.request)
            .then(res => {
                // res.ok ? resolve(res) : failedOnce;
                if (res.ok) {
                    updateDynamicCache(DYNAMIC_CACHE, e.request, res);
                    //resolve(res);
                } else {
                    failedOnce;
                }
            }).catch(err => failedOnce);

        caches.match(e.request)
            .then(res => {
                res ? resolve(res) : failedOnce;
            }).catch(err => failedOnce);
    });
    e.respondWith(response); */

    const respond = caches.match(e.request)
        .then(res => {
            if (res) {
                updateStaticCache(STATIC_CACHE, e.request, APP_SHELL_INMUTABLE);
                return res;
            } else {
                return fetch(e.request)
                    .then(newRes => {
                        return updateDynamicCache(DYNAMIC_CACHE, e.request, newRes);
                    });
            }
        });

    e.waitUntil(respond);
});