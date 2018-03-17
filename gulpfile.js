let gulp = require('gulp');
let gutil = require('gulp-util');
let zip = require('gulp-zip');
let minify = require('gulp-minify');
let cleanCSS = require('gulp-clean-css');
let concat = require('gulp-concat');
let rename = require('gulp-rename');

var themes = ['aspire', 'base', 'broadway', 'energy', 'executive', 'highrise', 'market', 'serene', 'sidebar', 'simple', 'stark'];

// create a zip for the release
gulp.task('create-zip', function() {

    var bundlePaths = [
      'bootstrap/**/*',
      'database/**/*',
      'design/**/*',
      'app/Console/**/*',
      'app/Events/**/*',
      'app/Exceptions/**/*',
      'app/Http/**/*',
      'app/Jobs/**/*',
      'app/Listeners/**/*',
      'app/Providers/**/*',
      'app/Respond/**/*',
      'app/Providers/**/*',
      'app/User.php',
      'public/assets/**/*',
      'public/favicon.ico',
      'public/0.2cfd8f09dbd76522fb54.chunk.js',
      'public/1.92342f5501d273fefee9.chunk.js',
      'public/inline.f63a0b0ad6de90669498.bundle.js',
      'public/main.30af6ffe26989537f012.bundle.js',
      'public/polyfills.a5e3dedee9c7ea856948.bundle.js',
      'public/scripts.f8b3fbe1c84c9e946ba2.bundle.js',
      'public/styles.71c66f6b324890e0a9a5.bundle.css',
      'public/install/**/*',
      'public/resources/**/*',
      'public/editor/**/*',
      'public/themes/aspire/**/*',
      'public/themes/base/**/*',
      'public/themes/broadway/**/*',
      'public/themes/energy/**/*',
      'public/themes/executive/**/*',
      'public/themes/highrise/**/*',
      'public/themes/market/**/*',
      'public/themes/serene/**/*',
      'public/themes/sidebar/**/*',
      'public/themes/simple/**/*',
      'public/themes/stark/**/*',
      'public/.htaccess',
      'public/index.html',
      'public/index.php',
      'resources/default/**/*',
      'resources/emails/**/*',
      'resources/plugins/**/*',
      'resources/views/**/*',
      'resources/white-label/**/*',
      'storage/**/*',
      'tests/**/*',
      'typings/**/*',
      'vendor/**/*',
      '.env.example',
      'artisan',
      'LICENSE'
    ];

    return gulp.src(bundlePaths, {base: './', follow: true})
  		.pipe(zip('release.zip'))
  		.pipe(gulp.dest('./dist'));

});


// copy public/resources/themes to all themes
gulp.task('resources', function(done) {

  var x;

  // walk through the themes
  for(x=0; x<themes.length; x++) {

    // copy shared directory to themes
    gulp.src(['public/resources/themes/**/*']).pipe(gulp.dest('public/themes/' + themes[x]));

  }

  done();

});

// combine css/js files
gulp.task('combine', function(done) {

  var x;

  // walk through the themes
  for(x=0; x<themes.length; x++) {

    // concat css
    gulp.src(['public/themes/' + themes[x] + '/css/libs.min.css', 'public/themes/' + themes[x] + '/css/site.css', 'public/themes/' + themes[x] + '/css/utilities.css'], { allowEmpty: true })
      .pipe(concat('site.all.css'))
      .pipe(cleanCSS())
      .pipe(rename('site.min.css'))
      .pipe(gulp.dest('src/' + themes[x] + '/css'));

    // concat js
    gulp.src(['public/themes/' + themes[x] + '/js/libs.min.js', 'public/themes/' + themes[x] + '/js/site.js'], { allowEmpty: true })
      .pipe(concat('site.all.js'))
      .pipe(gulp.dest('src/' + themes[x] + '/js'));

  }

  done();

});


gulp.task('themes', gulp.series(['resources', 'combine']));

// create a zip file for the project in dist/release.zip
gulp.task('zip', gulp.series(['create-zip']));