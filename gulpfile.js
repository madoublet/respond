let gulp = require('gulp');
let gutil = require('gulp-util');
let zip = require('gulp-zip');
let minify = require('gulp-minify');
let cleanCSS = require('gulp-clean-css');
let concat = require('gulp-concat');
let rename = require('gulp-rename');

var themes = ['aspire', 'broadway', 'sidebar'];

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
      'public/0.959ad71af5481f6e55a8.js',
      'public/1.9ab5b33e070fd6ab3012.js',
      'public/main.8e98d912d8f42923b7f6.js',
      'public/polyfills.6fe99e701656a00f4585.js',
      'public/runtime.66f28b3f957a74dd3373.js',
      'public/scripts.87a01ae09c864179e2ec.js',
      'public/styles.779dbf5d224cd769cc97.css',
      'public/install/**/*',
      'public/resources/**/*',
      'public/editor/**/*',
      'public/themes/aspire/**/*',
      'public/themes/broadway/**/*',
      'public/themes/sidebar/**/*',
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
      .pipe(gulp.dest('public/themes/' + themes[x] + '/css'));

    // concat js
    gulp.src(['public/themes/' + themes[x] + '/js/libs.min.js', 'public/themes/' + themes[x] + '/js/site.js'], { allowEmpty: true })
      .pipe(concat('site.all.js'))
      .pipe(gulp.dest('public/themes/' + themes[x] + '/js'));

  }

  done();

});


gulp.task('themes', gulp.series(['resources', 'combine']));

// create a zip file for the project in dist/release.zip
gulp.task('zip', gulp.series(['create-zip']));

// Default tasks - executed if user types simply "gulp"
gulp.task('default', gulp.series('resources', 'combine'));
