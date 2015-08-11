var gulp            = require('gulp'),
    gulpLoadPlugins = require('gulp-load-plugins'),
    $               = gulpLoadPlugins(),
    argv            = require('yargs').argv,
    bower           = require('bower'),
    mainBowerFiles  = require('main-bower-files'),
    browserSync     = require('browser-sync'),
    reload          = browserSync.reload;


// Define main 
var jsexp = new RegExp(/^.*\.js$/);
var cssexp = new RegExp(/^.*\.css$/);
var jsFiles = mainBowerFiles({filter: jsexp}).concat(['src/templates.js', 'src/*/**/*.js', 'src/app.js']);
var cssFiles = mainBowerFiles({filter: cssexp}).concat(['src/**/*.scss']);

gulp.task('print', function() {
    console.log(jsFiles);
});

// Run a local web server
gulp.task('connect', function() {
  $.connect.server({
    root: ['build'],
    fallback: 'build/index.html'
  });
});

// Task for live injection
gulp.task('browser-sync', function() {
    return browserSync({
      proxy: 'localhost:8080',
      open: false,
      minify: false,
      files: ['build/index.html', 'build/script.js'],
      injectChanges: true
    });
});
// Generate slim templates
gulp.task('tpl', function () {
    gulp.src(["src/**/*.slim", "!src/index.slim"])
        .pipe($.plumber({
            errorHandler: $.notify.onError("<%= error.message %>")}))
        .pipe($.slim({
            pretty: true,
            options: "attr_list_delims={'(' => ')', '[' => ']'}"
        }))
        .pipe($.angularTemplatecache({'standalone': true}))
        .pipe(gulp.dest('./src/'));
});

// Generate index slim
gulp.task('slim_index', function () {
    gulp.src("src/index.slim")
        .pipe($.plumber({
            errorHandler: $.notify.onError("<%= error.message %>")}))
        .pipe($.slim({
            pretty: true,
            options: ":attr_list_delims={'(' => ')', '[' => ']'}"
        }))
        .pipe(gulp.dest('./build'));
});

// Javascript build
gulp.task('js:build', function() {
    gulp.src(jsFiles)
        .pipe($.ngAnnotate())
        // .pipe($.angularFilesort())
        .pipe($.uglify())
        .pipe($.concat('script.js'))
        .pipe(gulp.dest('build/'));
});

// Javascript build development
gulp.task('js:development', function() {
    gulp.src(jsFiles)
        // .pipe($.angularFilesort())
        .pipe($.uglify({
            'mangle': false,
            'compress': false,
            'output': {
                'beautify': true
            }
        }))
        .pipe($.concat('script.js'))
        .pipe(gulp.dest('build/'));
});



// SASS build
gulp.task('sass:build', function () {
    gulp.src(cssFiles)
        .pipe($.cssGlobbing({
            extensions: ['.css', '.scss']
        }))
        .pipe($.sass())
        .pipe($.concat('style.css'))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe($.minifyCss())
        .pipe(gulp.dest('build/'));
});

// SASS Development
gulp.task('sass:development', function () {
    gulp.src(cssFiles)
        .pipe($.plumber({
            errorHandler: $.notify.onError("<%= error.message %>")}))
        .pipe($.cssGlobbing({
            extensions: ['.css', '.scss']
        }))
        .pipe($.sass())
        .pipe($.concat('style.css'))
        .pipe($.autoprefixer({
            browsers: ['last 2 versions'],
            cascade: false
        }))
        .pipe(gulp.dest('build/'))
        .pipe($.filter('*.css'))
        .pipe(browserSync.reload({stream:true}));
});

// Set up watchers
gulp.task('default', ['connect', 'slim_index', 'sass:development', 'tpl', 'js:development', 'browser-sync'], function() {
    gulp.watch('./src/**/*.scss', ['sass:development']);
    gulp.watch('src/**/*.slim', ['tpl']);
    gulp.watch('src/index.slim', ['slim_index']);
    gulp.watch(jsFiles, ['js:development']);
});

// Build JS and SASS
gulp.task('build', ['tpl', 'slim_index', 'js:build', 'sass:build'], function () {
    gulp.src(['./build/**/*', './src/**/*'])
        .pipe($.git.commit('BUILD'))
        .pipe($.git.push());
});

// Create new feature with --name
gulp.task('newfeature', function() {
    var name = argv.name;
    gulp.src('src/features/_feature/*')
        .pipe($.clone())
        .pipe($.template({'name': name, 'bigname': name.charAt(0).toUpperCase() + name.slice(1)}))
        .pipe($.rename(function(path) {
            path.dirname = name;
            path.basename = '_' + name;
        }))
        .pipe(gulp.dest('src/features/'));
});
