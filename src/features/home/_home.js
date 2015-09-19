angular.module('home', [])
    .controller('homeController', function($scope, Stories) {
          $scope.stories = Stories.results;
          $scope.to_stories = function () {
            var st = $("ol.stories-list").position().top;
            $("html, body").animate({ scrollTop: st }, 1000);
        };
    });