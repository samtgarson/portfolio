angular.module('home', [])
    .controller('homeController', function($scope, Stories, scroll) {
        $scope.stories = Stories.results.filter(function(s) {
            return !s.fragments['story.hidden'] || s.fragments['story.hidden'].value != 'true';
            // return true;
        });
        $scope.to_stories = function () {
            var st = $("ol.stories-list").offset().top - 150;
            $("html, body").animate({ scrollTop: st }, 1000);
        };
        scroll.bind();
        $scope.$on('scroll', function(event, data){
            var perc = ( $('ol.stories-list').offset().top - $(window).scrollTop() ) / $(window).height();
            $scope.spinner = (215 * Math.min(Math.max(perc, 0), 1)) - 90;
        });
    });