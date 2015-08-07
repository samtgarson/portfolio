angular.module('stories', [])
    .controller('storiesController', function($scope, Stories) {
        $scope.stories = Stories.results;
    });