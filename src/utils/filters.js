angular.module('filters', [])
    .filter('titlecase', function() {
        return function(s) {
            s = ( s === undefined || s === null ) ? '' : s;
            return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
                return ch.toUpperCase();
            });
        };
    })
    .directive('rando', function() {
        return {
            restrict: 'C',
            scope: {
                switcher: '='
            },
            link: function(scope, el, attr) {
                var $el= $(el), t = $el.html().trim().split('').map(function(l) {
                    return '<span>' + l + '</span>';
                }), pos, x, y, w = $el.width(), h = $el.height();
                $el.html(t);

                $el.find('span').each(function(i, e) {
                    pos = $(e).position();
                    perc = {
                        left: (pos.left / w) * 100,
                        top: (pos.top / h) * 100,
                    };
                    x = rand(5); 
                    y = rand(60);
                    $(e).css({left: limit(perc.left + x) + '%', top: (pos.top + y) + 'px'});
                });
                $el.find('span').each(function(i, e) {
                    $(e).css({position: 'absolute'});
                });

                scope.$watch('switcher', function(b) {
                    if (b) $el.addClass('on');
                    else $el.removeClass('on');
                });


                function rand (x) {
                    return Math.floor(Math.random()*x*2) - (x);
                }
                function limit (n) {
                    return n > 93?93:n < 5?5:n;
                }
            }
        };
    });
