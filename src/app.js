angular.module('app', [
    // Vendor
    'ui.router',
    'ct.ui.router.extras',
    // 'ngAnimate',
    'ngSanitize',
    'ngCachedResource',
    'prismic.io',
    'angularMoment',
    'ngScroll',
    'angulartics', 
    'angulartics.google.analytics',

    // App
    'templates',
    'states',
    'services',
    'filters',

    // Features
    'home',
    'talk',
    'stories',
    'story',
    'testimonials'
    
    // Patterns
])

    .config(function(PrismicProvider, $logProvider, $analyticsProvider) {
        PrismicProvider.setApiEndpoint('https://samgarson.prismic.io/api');
        PrismicProvider.setLinkResolver(function(ctx, doc) {
            return 'stories/' + doc.id;
        });
        $logProvider.debugEnabled(true);
        console.log(window.location.hostname!="www.samgarson.com");
        $analyticsProvider.developerMode(window.location.hostname!="www.samgarson.com");
    })

    .controller('appController', function ($scope, $filter, $timeout, $state, $urlRouter) {
        $scope.hello = 'hello world';
        $scope.show = true;
        
        $scope.title = "Sam Garson";
        var bypass = true;
        $scope.$on('$stateChangeStart', function(e, toState, toStateParams) {
            if (!bypass) {
                $scope.show = false;
                e.preventDefault();
                $timeout(function(){
                    bypass = true;
                    $state.go(toState, toStateParams);
                }, 300);
            } else bypass = false;
        });
        $scope.$on('$stateChangeSuccess', function(e, toState) {
            var split = toState.data && toState.data.title;
            $scope.title = split ? $filter('titlecase')(split) + ' | Sam Garson' : 'Sam Garson';
            $scope.page = toState.name.split('.')[1] || toState.name;

            if ($scope.page == 'story') {
                scrollUp();
            }

            $timeout(function(){
                $scope.show = true;
            }, 600);
        });

        $scope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
            console.log(error);
        });

        $scope.$on('title', function(e, title) {
            $scope.title = $filter('titlecase')(title) + ' | Sam Garson';
        });

        $scope.goBack = function() {
            var states = {
                'parent.story': 'parent.home',
                'parent.stories': 'parent.home',
                'parent.about': 'parent.home',
                'parent.testimonials': 'parent.home'
            };
            $state.go(states[$state.current.name]);
        };
        $scope.scrollToTop = scrollUp;

        function scrollUp() {
            var st = $("html").scrollTop() > 0 ? $("html").scrollTop() : $("body").scrollTop() ? $("body").scrollTop() : 0;
            if (st > 0) $("html, body").animate({ scrollTop: "0" }, 1000);
        }
    });

