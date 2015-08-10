angular.module('states', [])

    // When app is first run;
    // Checks if user is logged in with Cookies
    .run (function($rootScope, $state) {

    })
    .config(function($stateProvider, $stickyStateProvider, $urlRouterProvider, $locationProvider, $httpProvider) {

        $httpProvider.interceptors.push(function($q, $rootScope, $location) {
            return {
                'request': function(config) {
                    $rootScope.$broadcast('ajaxStart', config);
                    return config;
                },
                'response': function(config) {
                    $rootScope.$broadcast('ajaxEnd', config);
                    return config;
                },
                'responseError': function(config) {
                    $rootScope.$broadcast('ajaxEnd', config);
                    return config;
                }
            };
        });

        $urlRouterProvider
            .otherwise("/"); 
            
        $locationProvider.html5Mode(true);

        $stickyStateProvider.enableDebug(true);

        // Function to generate template urls
        function templater (page, child) {
            if (angular.isUndefined(child)) child = page;
            return 'features/' + page + '/_' + child + '.html';
        }

        $stateProvider
            // Misc States
            .state('home', {
                'url'               : '/',
                'templateUrl': templater('home'), 
                'controller': 'homeController'
            })
            .state('stories', {
                'url'               : '/stories',
                'templateUrl': templater('stories'), 
                'controller': 'storiesController',
                'resolve': {
                    'Stories': function(Prismic) {
                        return Prismic.query('[[:d = at(document.type, "story")]][my.story.date desc]');
                    }
                },
            })
            .state('talk', {
                'url'               : '/about',
                'templateUrl': templater('talk'), 
                'controller': 'talkController'
            })
            .state('story', {
                'url'               : '/:id',
                'templateUrl': templater('story'), 
                'controller': 'storyController',
                'resolve': {
                    'Stories': function(Prismic) {
                        return Prismic.query('[[:d = at(document.type, "story")]][my.story.date desc]');
                    }
                }
            });
    });
