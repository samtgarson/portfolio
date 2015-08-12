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
                        } else {
                            if (tempGal.length) {
                                $(tempGal).wrapAll('<div class="gallery-wrapper"></div>').wrapAll('<div class="gallery"></div>');
                                tempGal = [];
                            }

                            if ($t.hasClass('block-img') && hasCaption($t)) {
                                var cap = $t.next();
                                $t.append(cap.clone().addClass('gallery-arrows'));
                                cap.remove();
                            }
                        }
                    });

                    $('.gallery').each(function() {
                        var $gal = $(this),
                            src = $gal.children(':first').attr('src'), ratio,
                            w = $(el).width() * 0.95;

                        $gal.children(':first').addClass('selected');

                        $("<img/>") // Make in memory copy of image to avoid css issues
                            .attr("src", src)
                            .load(function() {
                                ratio = this.height / this.width;
                                $gal.height(w * ratio);
                            });

                        var left = $("<a class='gallery-left'>&larr;</a>"),
                            right = $("<a class='gallery-right'>&rarr;</a>"),
                            count = $('<span class="gallery-count">');

                        left.on('click', function() {
                            advance(1);
                        });
                        right.on('click', function() {
                            advance(-1);
                        });

                        $('<div class="gallery-arrows">').append([left, right, count]).insertAfter($gal);

                        if (hasCaption($gal)) {
                            var cap = $gal.parent().next();
                            $gal.next('.gallery-arrows').prepend(cap.clone());
                            cap.remove();
                        }

                        checkArrows();

                        $gal.children('img').on('click', function(e){
                            var $img = $(this), selected = $img.hasClass('selected')?$img:$img.siblings('.selected'), 
                                pWidth = selected.innerWidth();

                            if ($img.hasClass('selected')) {
                                var pOffset = $img.offset(),
                                    x = e.pageX - pOffset.left;
                                if (pWidth/2 > x) {
                                    if ($img.is(':not(:first-child)')) advance(1);
                                } else if ($img.is(':not(:last-child)')) advance(-1);
                            } else if ($img.isBefore(selected)) advance(1);
                            else advance(-1); 
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

                        function advance(dir) {
                            if (dir) {
                                var cur = parseInt($gal.css('marginLeft')),
                                    $img = $gal.children('.selected');
                                dist = dir > 0 ? 
                                    $img.prev().length?$img.prev().offset().left : false :
                                    $img.next().length?$img.next().offset().left : false;
                                if (dist) {
                                    $gal.css('marginLeft', (dist - $gal.offset().left) * -1);
                                    $img.removeClass('selected');
                                    if (dir>0) $img.prev().addClass('selected');
                                    else $img.next().addClass('selected');
                                    checkArrows();
                                }
                            }
                        }

                        function checkArrows () {
                            $gal.next('.gallery-arrows').find('.gallery-left, .gallery-right').removeClass('disabled');
                            if ($gal.find('.selected').is(':first-child')) $('.gallery-left').addClass('disabled');
                            else if ($gal.find('.selected').is(':last-child')) $('.gallery-right').addClass('disabled');

                            var total = $gal.find('img').length,
                                index = $gal.find('.selected').index() + 1;
                            $gal.next('.gallery-arrows').find('span').text(index + '/' + total);
                        }

                    });
                }

                (function($) {
                    $.fn.isAfter = function(sel){
                        return this.prevAll().filter(sel).length !== 0;
                    };

                    $.fn.isBefore= function(sel){
                        return this.nextAll().filter(sel).length !== 0;
                    };
                })(jQuery);

                function hasCaption (e) {
                    return $(e).parent().hasClass('content') ? $(e).next().hasClass('caption') : hasCaption($(e).parent()[0]);
                }

                $timeout(processGallery, 0);
            }
        };
    });
