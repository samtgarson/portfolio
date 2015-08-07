angular.module('filters', [])
    .filter('titlecase', function() {
        return function(s) {
            s = ( s === undefined || s === null ) ? '' : s;
            return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
                return ch.toUpperCase();
            });
        };
    })
    .directive('rando', function($timeout) {
        return {
            restrict: 'C',
            scope: {
                multiplier:"@",
                switcher: '='
            },
            link: function(scope, el, attr) {
                var $el= $(el), 
                    t, pos, 
                    x, y, 
                    w, h,
                    multiplier = scope.multiplier?parseFloat(scope.multiplier):1,
                    processed = false;

                $timeout(function(){
                    t = $el.html().trim().split('').map(function(l) {
                        return '<span>' + l + '</span>';
                    });
                    w = $el.width();
                    h = $el.height();

                    $el.html(t);

                    $el.find('span').each(function(i, e) {
                        pos = $(e).position();
                        perc = {
                            left: (pos.left / w) * 100,
                            top: (pos.top / h) * 100,
                        };
                        $(e).data('x', perc.left).data('y', perc.top);
                        $(e).css({left: perc.left + '%', top: perc.top + '%'});
                    });
                    $el.find('span').each(function(i, e) {
                        $(e).css({position: 'absolute'});
                    });
                }, 0);

                $timeout(function() {
                    if (!processed) {
                        
                        processed = true;
                    }
                    $el.find('span').each(function(i, e) {
                        x = rand(6) * multiplier; 
                        y = rand(10) * multiplier;
                        $(e).css({transform: 'translateX(' + x + 'vw) translateY(' + y + 'vh)'});
                        // $(e).css({left: perc.left + '%', top: perc.top + '%'});
                    });
                }, 0);

                function rand (x) {
                    return Math.floor(Math.random()*x*2) - (x);
                }
                function limit (n) {
                    return n > 90?90:n < 5?5:n;
                }
            }
        };
    })
    .directive('content', function($timeout){
        // Runs during compile
        return {
            restrict: 'C',
            link: function(scope, el, attrs) {
                var tempGal = [];
                function processGallery() {
                    $(el).children().each(function(e) {
                        var $t = $(this), t = this;
                        if ($t.hasClass('gallery')) {
                            var $i = $t.removeClass('gallery').find('img')[0];
                            $($i).unwrap();
                            if (!$($i).parent().hasClass('content')) $($i).unwrap();
                            tempGal.push($i);
                        } else if (tempGal.length) {
                            $(tempGal).wrapAll('<div class="gallery-wrapper"></div>').wrapAll('<div class="gallery"></div>');
                            tempGal = [];
                        }
                    });

                    $('.gallery').each(function() {
                        var $gal = $(this),
                            src = $gal.children(':first').attr('src'), ratio,
                            w = parseInt($gal.children('img:first').addClass('selected').css('maxWidth'));
                        $("<img/>") // Make in memory copy of image to avoid css issues
                            .attr("src", src)
                            .load(function() {
                                ratio = this.height / this.width;
                                $gal.height(w * ratio);
                            });
                        $gal.children('img').on('click', function(e){
                            var $img = $(this), selected = $img.hasClass('selected')?$img:$img.siblings('.selected'), 
                                pWidth = selected.innerWidth();

                            if ($img.hasClass('selected')) {
                                var pOffset = $img.offset(),
                                    x = e.pageX - pOffset.left;
                                if (pWidth/2 > x) {
                                    if ($img.is(':not(:first-child)')) advance($img.prev().innerWidth());
                                } else if ($img.is(':not(:last-child)')) advance(pWidth * -1);
                            } else if ($img.isBefore(selected)) advance(selected.prev().innerWidth());
                            else advance(pWidth * -1); 
                        }).on('mousemove mouseenter', function (e){
                            var $img = $(this); 

                            if ($img.hasClass('selected')) {
                                var pWidth = $img.innerWidth(),
                                    pOffset = $img.offset(),
                                    x = e.pageX - pOffset.left;
                                if (pWidth/2 > x) mouseFn('left');
                                else mouseFn('right');
                            }

                            function mouseFn (dir) {
                                $img.removeClass('mouse-left mouse-right').addClass('mouse-' + dir);
                            }
                        });

                    });
                }

                function advance(dist) {
                    if (dist) {
                        dist = dist>0?dist + 40:dist-40;
                        var $gal = $('.gallery'),
                            trans = parseInt($gal.css('marginLeft')),
                            $img = $gal.children('.selected');
                        if (trans + dist <= 0) {
                            $gal.css('marginLeft', trans + dist);
                            $img.removeClass('selected');
                            if (dist<0) $img.next().addClass('selected');
                            else $img.prev().addClass('selected');
                        }
                    }
                }

                (function($) {
                    $.fn.isAfter = function(sel){
                        return this.prevAll().filter(sel).length !== 0;
                    };

                    $.fn.isBefore= function(sel){
                        return this.nextAll().filter(sel).length !== 0;
                    };
                })(jQuery);

                $timeout(processGallery, 0);
            }
        };
    });
