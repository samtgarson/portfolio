angular.module('story', [])
    .controller('storyController', function($scope, Stories, $stateParams) {
        $scope.story = Stories.results.filter(function(s, i) {
            if (s.id == $stateParams.id) {
                $scope.nextStory = Stories.results[(i+1) % Stories.results.length];
                return true;
            } else return false;
        })[0];
    });