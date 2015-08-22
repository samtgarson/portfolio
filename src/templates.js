angular.module("templates", []).run(["$templateCache", function($templateCache) {$templateCache.put("utils/scrollable.html","<div ng-mouseenter=\"hover=true\" ng-mouseleave=\"hover=false\">\n  <span ng-if=\"!hover\">{{perc | number: 0}}%</span><span ng-if=\"hover\">&uarr; Top</span>\n</div>\n");
$templateCache.put("features/_feature/_feature.html","\n");
$templateCache.put("features/home/_home.html","<section>\n  <b>Sam turns great ideas into great products.</b>\n  <p>\n    You’ve probably seen some.\n  </p>\n  <ul>\n    <li>\n      British Airways \n    </li>\n    <li>\n      Converse \n    </li>\n    <li>\n      Cannes Lions \n    </li>\n    <li>\n      Protein \n    </li>\n    <li>\n      Microsoft\n    </li>\n  </ul>\n  <br /><a ui-sref=\"parent.about\">More about Sam &rarr;</a><br /><br /><a ui-sref=\"parent.stories\">Case studies &rarr;</a><br /><br /><a href=\"mailto:samtgarson@gmail.com\" target=\"_blank\">samtgarson@gmail.com &rarr;</a>\n</section>\n");
$templateCache.put("features/story/_story.html","<h1 class=\"title rando\" multiplier=\".2\" ng-bind=\"story.fragments[&#39;story.title&#39;].value[0].text\"></h1>\n<img class=\"cover\" ng-src=\"{{story.fragments[&#39;story.cover&#39;].value.main.url}}\" />\n<ul class=\"tags\">\n  <h6>\n    {{story.fragments[\'story.date\'].value | amDateFormat : \'MMMM YYYY\' }}\n  </h6>\n  <h6 ng-repeat=\"tag in story.tags\">\n    {{tag}}\n  </h6>\n</ul>\n<p class=\"standfirst\">\n  {{story.fragments[\'story.standfirst\'].value[0].text}}\n</p>\n<prismic-html class=\"content\" fragment=\"story.fragments[&#39;story.content&#39;]\"></prismic-html>\n<h3 class=\"testimonial\" ng-if=\"story.fragments[&#39;story.quote&#39;]\">\n  {{story.fragments[\'story.quote\'].value}}\n</h3>\n<h6 class=\"source\" ng-if=\"story.fragments[&#39;story.quote-source&#39;]\">\n  {{story.fragments[\'story.quote-source\'].value}}\n</h6>\n<div class=\"next no-link\" ng-if=\"nextStory\" ui-sref=\"parent.story({id: nextStory.id})\">\n  <h6>\n    next story\n  </h6>\n  <h1>\n    {{nextStory.fragments[\'story.title\'].value[0].text}}\n  </h1>\n  <img ng-src=\"{{nextStory.fragments[&#39;story.cover&#39;].value.main.url}}\" />\n</div>\n");
$templateCache.put("features/stories/_stories.html","<ol class=\"stories-list\">\n  <li class=\"no-link\" ng-repeat=\"story in stories\" ui-sref=\"parent.story({id: story.id})\">\n    <h1 class=\"title\">\n      {{story.fragments[\'story.title\'].value[0].text}}\n    </h1>\n    <img class=\"cover\" ng-src=\"{{story.fragments[&#39;story.cover&#39;].value.main.url}}\" />\n    <h6>\n      {{story.fragments[\'story.date\'].value | amDateFormat : \'MMMM YYYY\' }}\n    </h6>\n  </li>\n</ol>\n");
$templateCache.put("features/talk/_talk.html","<img class=\"face\" src=\"img/face.png\" />\n<section>\n  <h1 class=\"heart rando\" multiplier=\".3\">\n    Sam &#10084; product\n  </h1>\n  <b>I\'m a holistic designer, problem solver and full stack web developer living in London, specialising in rapid product innovation.</b>\n  <p>\n    I\'m currently helping a few small startups and big brands build products and engage their audiences.\n  </p>\n  <p>\n    I\'m available to hire, full-time or freelance—always looking to work with passionate people shipping awesome product. \n  </p>\n  <p>\n    Take a look at some of my <a ui-sref=\"parent.stories\">work &rarr;</a>\n  </p>\n  <p>\n    Or <a href=\"mailto:samtgarson@gmail.com\" target=\"_blank\">get in touch &rarr;</a>\n  </p>\n  <p>\n    Yours, <b>Sam Garson</b>\n  </p>\n  <p>\n    <a class=\"back\" ui-sref=\"parent.home\">&larr; Back</a>\n  </p>\n  <ul class=\"quotes\">\n    <li class=\"see\">\n      See the Case Study &rarr;\n    </li>\n    <li class=\"no-link\" ng-class=\"{&#39;show&#39;: index == $index}\" ng-repeat=\"quote in quotes\" ui-sref=\"parent.story({id: quote.id})\">\n      <h3 class=\"testimonial\">\n        {{quote.words}}\n      </h3>\n      <h6 class=\"source\">\n        {{quote.source}}\n      </h6>\n    </li>\n  </ul>\n  <p class=\"social\">\n    See my professional profile<br /><a href=\"http://linkedin.com/in/samtgarson\" target=\"_blank\">LinkedIn </a>\n  </p>\n  <p class=\"social\">\n    My occasional thought<br /><a href=\"http://twitter.com/samtgarson\" target=\"_blank\">Twitter</a>\n  </p>\n  <p class=\"social\">\n    My pretentious photos<br /><a href=\"http://instagram.com/samtgarson\" target=\"_blank\">Instagram</a>\n  </p>\n</section>\n");}]);