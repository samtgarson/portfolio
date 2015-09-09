angular.module('filters', [])
    .filter('titlecase', function() {
        return function(s) {
            s = ( s === undefined || s === null ) ? '' : s;
            return s.toString().toLowerCase().replace( /\b([a-z])/g, function(ch) {
                return ch.toUpperCase();
            });
        };
    })
    .filter('paras', function() {
        return function(s) {
            return s.split('\n').filter(function(b) {return b.length;}).join('<br \><br \>');
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
    .directive('content', function($timeout, $http){
        // Runs during compile
        return {
            restrict: 'C',
            link: function(scope, el, attrs) {
                var tempGal = [], mini = false;
                function processGallery() {
                    $(el).children().each(function(e) {
                        var $t = $(this), t = this;
                        if ($t.hasClass('gallery') || $t.hasClass('mini-gallery')) {
                            mini = $t.hasClass('mini-gallery');
                            var $i = $t.removeClass('mini-gallery gallery').find('img')[0];
                            $($i).unwrap();
                            if (!$($i).parent().hasClass('content')) $($i).unwrap();
                            tempGal.push($i);
                        } else {
                            if (tempGal.length) {
                                $(tempGal).wrapAll('<div class="gallery-wrapper"></div>').wrapAll('<div class="gallery' + (mini?' mini-gallery':'') + '"></div>');
                                tempGal = []; 
                                type = false;
                            }

                            if ($t.hasClass('pre')) {
                                var d = $(t.innerText);
                                $t.html(d);
                                if (angular.isDefined(instgrm)) instgrm.Embeds.process();
                            }

                            if ($t.hasCaption()) {
                                $t.addClass('hasCaption');
                                var cap = $t.next(), newCap;
                                if ($t.hasClass('quote')) {
                                    newCap = $('<h6>').addClass('caption').text(cap.text());
                                    $t.after(newCap);
                                } else {
                                    newCap = cap.clone().addClass('gallery-arrows');
                                    $t.append(newCap);
                                }
                                cap.remove();
                            } 
                            
                            if ($t.has('a').length) {
                                $(t).children('a').attr('target', '_blank');
                            }
                        }
                    });

                    $('.gallery').each(function() {
                        var $gal = $(this),
                            src = $gal.children(':first').attr('src'), ratio,
                            mini = $gal.hasClass('mini-gallery'),
                            w = $(el).width() * (mini?0.4:0.95), h,
                            viewp = $(window).height();

                        $gal.children(':first').addClass('selected');

                        $("<img/>") // Make in memory copy of image to avoid css issues
                            .attr("src", src)
                            .load(function() {
                                ratio = this.height / this.width;
                                h = w * ratio;
                                if (h > viewp * 0.7) h = viewp * 0.7;
                                $gal.height(h);

                                $gal.children('img').each(function() {
                                    this.style.display = 'none';
                                    this.offsetHeight;
                                    this.style.display = 'inline-block';
                                });
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

                        if ($gal.hasCaption()) {
                            var cap = $gal.parent().next();
                            $gal.next('.gallery-arrows').prepend(cap.clone());
                            cap.remove();
                        }

                        checkArrows($gal);

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
                                    $img = $gal.children('.selected'),
                                    toMove = dir > 0 ? $img.prev() : $img.next(),
                                    dist = toMove.length ? toMove.offset().left - parseInt( toMove.css('marginLeft') ) : false;
                                if (dist) {
                                    $gal.css('marginLeft', (dist - $gal.offset().left) * -1);
                                    $img.removeClass('selected');
                                    if (dir>0) $img.prev().addClass('selected');
                                    else $img.next().addClass('selected');
                                    checkArrows($gal);
                                }
                            }
                        }

                        function checkArrows ($g) {
                            $g.next('.gallery-arrows').find('.gallery-left, .gallery-right').removeClass('disabled');
                            if ($g.find('.selected').is(':first-child')) $('.gallery-left').addClass('disabled');
                            else if ($g.find('.selected').is(':last-child')) $('.gallery-right').addClass('disabled');

                            var total = $g.find('img').length,
                                index = $g.find('.selected').index() + 1;
                            $g.next('.gallery-arrows').find('span').text(index + '/' + total);
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
                    $.fn.hasCaption=function() {
                        return this.parent().hasClass('content') ? 
                            this.next().hasClass('caption') : 
                                this.parent().length ?
                                    this.parent().hasCaption() :
                                    false;
                    };
                })(jQuery);

                $timeout(processGallery, 0);
            }
        };
    })
    .directive('scrollable', function(scroll, $analytics, $location){
        // Runs during compile
        return {
            templateUrl: "utils/scrollable.html",
            restrict: 'C',
            link: function(scope, el, attrs) {
                scope.perc = 0;
                scroll.bind();
                var events = {
                    '25': false,
                    '50': false,
                    '75': false,
                    '100': false
                },
                title = $location.$$path.substr(1);
                scope.$on('$stateChangeSuccess', function() {
                    events = events = {
                        '25': false,
                        '50': false,
                        '75': false,
                        '100': false
                    };
                    title = $location.$$path.substr(1);
                });

                scope.$on('scroll', function(event, data){
                    scope.perc = data.y / data.scrollHeight * 100;
                    if (data.directionY == 'down') {   
                        if (scope.perc >= 25 && !events['25']) {
                            events['25'] = true;
                            // console.log('25', data.directionY);
                            $analytics.eventTrack('scroll-25', { category: 'storyScroll', label: title, value: 25 });
                        }
                        if (scope.perc >= 50 && events['25'] && !events['50']) {
                            events['50'] = true;
                            // console.log('50', data.directionY);
                            $analytics.eventTrack('scroll-50', { category: 'storyScroll', label: title, value: 50 });
                        }
                        if (scope.perc >= 75 && events['25'] && events['50'] && !events['75']) {
                            events['75'] = true;
                            // console.log('75', data.directionY);
                            $analytics.eventTrack('scroll-75', { category: 'storyScroll', label: title, value: 75 });
                        }
                        if (scope.perc == 100 && events['25'] && events['50'] && events['75'] && !events['100']) {
                            events['100'] = true;
                            // console.log('100', data.directionY);
                            $analytics.eventTrack('scroll-100', { category: 'storyScroll', label: title, value: 100 });
                        }
                    }
                });
            }
        };
    });
