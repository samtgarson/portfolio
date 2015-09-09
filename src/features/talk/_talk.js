angular.module('talk', [])
    .controller('talkController', function($scope, Stories, $timeout) {
        $scope.quotes = Stories.results.filter(function(n) {
            return n.fragments['story.quote'];
        }).map(function(n) {
            return {
                words: n.fragments['story.quote'].value,
                source: n.fragments['story.quote-source'].value,
                id: n.id
            };
        });

        // var len = $scope.quotes.length, stop = false;
        // $scope.index = -1;
        // function advance() {
        //     $scope.index = ($scope.index + 1) % len;
        //     if (!stop) $timeout(advance, 11000);
        // }
        // advance();

        // $scope.$on('$destroy', function() {
        //     stop = true;
        // });
    });