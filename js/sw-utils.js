// Saving in dynamic cache
function updateDynamicCache(dynamicCache, request, response) {

    if (response.ok) {
        caches.open(dynamicCache)
            .then(cache => {
                cache.put(request, response.clone());
                console.log('Llegó a sw-utils.js');
                return response.clone();
            });
    } else {
        return response;
    }
}

// Cache with network update
function updateStaticCache(staticCache, req, APP_SHELL_INMUTABLE) {

    if (APP_SHELL_INMUTABLE.includes(req.url)) {
        // No hace falta actualizar el inmutable
        // console.log('existe en inmutable', req.url );
    } else {
        // console.log('actualizando', req.url );
        return fetch(req)
            .then(res => {
                return updateDynamicCache(staticCache, req, res);
            });
    }
}

function limpiarCache(cacheName, numeroItems) {
    caches.open(cacheName)
        .then(cache => {
            return cache.keys()
                .then(keys => {
                    if (keys.length > numeroItems) {
                        cache.delete(keys[0])
                            .then(limpiarCache(cacheName, numeroItems));
                    }
                });
        });
}