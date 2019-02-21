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