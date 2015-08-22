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

        // $stickyStateProvider.enableDebug(true);

        // Function to generate template urls
        function templater (page, child) {
            if (angular.isUndefined(child)) child = page;
            return 'features/' + page + '/_' + child + '.html';
        }

        $stateProvider
            .state('parent', {
                'url'               : '/',
                'template': '<ui-view></ui-view>', 
                'abstract': true,
                'resolve': {
                    'Stories': function(Prismic) {
                        return Prismic.query('[[:d = at(document.type, "story")]]', function(searchForm) {
                            return searchForm.orderings('[my.story.date desc]');
                        });
                    }
                }
            })
            .state('parent.home', {
                'url'               : '',
                'templateUrl': templater('home'), 
                'controller': 'homeController'
            })
            .state('parent.stories', {
                'url'               : 'stories',
                'templateUrl': templater('stories'), 
                'controller': 'storiesController'
            })
            .state('parent.about', {
                'url'               : 'about',
                'templateUrl': templater('talk'), 
                'controller': 'talkController'
            })
            .state('parent.story', {
                'url'               : ':slug',
                'templateUrl': templater('story'), 
                'controller': 'storyController'
            });
    });
