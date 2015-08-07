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

    .controller('appController', function ($scope, $filter, $state, $previousState) {
        $scope.hello = 'hello world';
        
        $scope.title = "Sam Garson";
        $scope.$on('$stateChangeSuccess', function(e, toState) {
            var split = toState.name.split('.').length > 1?toState.name.split('.')[1]:toState.name;
            $scope.title = $filter('titlecase')(split) + ' | Sam Garson';
            $scope.page = split.toLowerCase();
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

