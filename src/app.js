angular.module('app', [
    // Vendor
    'ui.router',
    'ct.ui.router.extras',
    // 'ngAnimate',
    'ngSanitize',
    'ngCachedResource',
    'prismic.io',
    'angularMoment',

    // App
    'templates',
    'states',
    'services',
    'filters',

    // Features
    'home',
    'talk',
    'stories',
    'story'
    
    // Patterns
])

    .config(function(PrismicProvider, $logProvider) {
        PrismicProvider.setApiEndpoint('https://samgarson.prismic.io/api');
        PrismicProvider.setLinkResolver(function(ctx, doc) {
            return 'stories/' + doc.id;
        });
        $logProvider.debugEnabled(true);
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
            var split = toState.name.split('.').length > 1?toState.name.split('.')[1]:toState.name;
            $scope.title = $filter('titlecase')(split) + ' | Sam Garson';
            $scope.page = split.toLowerCase();

            $timeout(function(){
                $scope.show = true;
            }, 600);
        });

        $scope.$on('$stateChangeError', function(e, toState, toParams, fromState, fromParams, error) {
            console.log(error);
        });

        $scope.goBack = function() {
            var states = {
                'story': 'stories',
                'stories': 'home',
                'talk': 'home'
            };
            $state.go(states[$state.current.name]);
        };
    });

