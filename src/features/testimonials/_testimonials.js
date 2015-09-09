angular.module('testimonials', [])
    .controller('testimonialsController', function($scope, Stories) {
          $scope.quotes = Stories.results.filter(function(n) {
              return n.fragments['story.quote'];
          }).map(function(n) {
              return {
                  words: n.fragments['story.quote'].value,
                  source: n.fragments['story.quote-source'].value,
                  project: n.fragments['story.title'].value[0].text,
                  id: n.id
              };
          });
    });