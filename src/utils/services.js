angular.module('services', [])
    // Some convenience services
    .constant('Endpoing', 'http://google.com')
    .factory('Api', function($cachedResource, Endpoint) {
        return function(key) {
            key = key.join? key.join('/'):key;
            return $cachedResource(key, Endpoint + key + '/:id.json', {id: "@id"});
        };
    })
    .factory('Subdomain', function($location){
        return function subdomain (isWWW, isRoute){
            var domains = $location.host().split('.');
            if ((domains.length == 2 && domains[1] != 'localhost') || domains[0] == 'www' || domains[0] == 'localhost' || domains[0] == '172') return isWWW();
            else return isRoute(domains[0]);
        };
    })
    .service('User', function(store){
        var user = {}, service = {};

        service.get = function() {
            if (user.first_name) return user;
            else {
                var u = store.get('user');
                if (u) return u;
                else return undefined;
            }
        };

        service.set = function (obj) {
            user = obj;
            store.set('user', obj);
        };

        service.clear = function () {
            store.remove('user');
            user = {};
        };

        return service;

    })
