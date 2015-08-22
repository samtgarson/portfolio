angular.module('story', [])
    .controller('storyController', function($scope, Stories, $stateParams) {
        $scope.story = Stories.results.filter(function(s, i) {
            if (s.slugs.indexOf($stateParams.slug) > -1) {
                $scope.nextStory = Stories.results[(i+1) % Stories.results.length];
                return true;
            } else return false;
        })[0];
    });