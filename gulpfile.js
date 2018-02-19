const gulp = require('gulp');
const gutil = require('gulp-util');
const zip = require('gulp-zip');
const concat = require('gulp-concat');
const minify = require('gulp-minify');

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
      'public/0.e36e09b8bd3d35b09790.chunk.js',
      'public/inline.6ecd679f494696aaa2f6.bundle.js',
      'public/main.e8687f2610905402d356.bundle.js',
      'public/polyfills.35ab1ad93807931b93ad.bundle.js',
      'public/scripts.f8b3fbe1c84c9e946ba2.bundle.js',
      'public/styles.3d849224cbe100eaca29.bundle.css',
      'public/install/**/*',
      'public/resources/**/*',
      'public/editor/**/*',
      'public/themes/executive/**/*',
      'public/themes/simple/**/*',
      'public/themes/energy/**/*',
      'public/themes/serene/**/*',
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


// create a zip for the release
gulp.task('create-zip-pro', function() {

    var bundlePaths = [
      'app/**/*',
      'bootstrap/**/*',
      'database/**/*',
      'design/**/*',
      'public/app/**/*',
      'public/assets/**/*',
      'public/favicon.ico',
      'public/0.e36e09b8bd3d35b09790.chunk.js',
      'public/inline.6ecd679f494696aaa2f6.bundle.js',
      'public/main.e8687f2610905402d356.bundle.js',
      'public/polyfills.35ab1ad93807931b93ad.bundle.js',
      'public/scripts.f8b3fbe1c84c9e946ba2.bundle.js',
      'public/styles.3d849224cbe100eaca29.bundle.css',
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
  		.pipe(zip('release.pro.zip'))
  		.pipe(gulp.dest('./dist'));

});

// copy respond-ui
gulp.task('copy-respond-ui', function() {

  // copy folders
  var libs = [
      'node_modules/respond-ui/dist/**/*'
      ];

    return gulp.src(libs, {base: './node_modules/respond-ui/dist/'})
  		.pipe(gulp.dest('public'));

});


// copy js
gulp.task('copy-js', function() {

  return gulp.src([])
    .pipe(gulp.dest('public/app/libs/'));
});


// copy static files
gulp.task('copy-css', function() {

    return gulp.src([])
  		.pipe(gulp.dest('public/app/libs/'));

});

// copy
gulp.task('default', gulp.series(['copy-respond-ui']));

// create a zip file for the project in dist/release.zip
gulp.task('zip', gulp.series(['create-zip']));