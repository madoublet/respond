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
      'public/0.a9271393cee4eadde776.chunk.js',
      'public/inline.2a85d62a1fc469d5c57c.bundle.js',
      'public/main.a337fef880d63fb8b5ba.bundle.js',
      'public/polyfills.a3edfa5e652bca13d8b6.bundle.js',
      'public/scripts.93d1f5955ab6e697cc00.bundle.js',
      'public/styles.6cfdffb333348d0a866e.bundle.css',
      'public/install/**/*',
      'public/themes/bootstrap/**/*',
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
      'vendor/alchemy/**/*',
      'vendor/autoload.php',
      'vendor/composer/**/*',
      'vendor/doctrine/**/*',
      'vendor/firebase/**/*',
      'vendor/google/**/*',
      'vendor/guzzlehttp/**/*',
      'vendor/illuminate/**/*',
      'vendor/laravel/**/*',
      'vendor/monolog/**/*',
      'vendor/mtdowling/**/*',
      'vendor/nesbot/**/*',
      'vendor/nikic/**/*',
      'vendor/paragonie/**/*',
      'vendor/phpmailer/**/*',
      'vendor/psr/**/*',
      'vendor/sunra/**/*',
      'vendor/symfony/**/*',
      'vendor/twig/**/*',
      'vendor/vlucas/**/*',
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
      'public/0.f30eac957856b247362d.chunk.js',
      'public/inline.492664516c90d92f6c4b.bundle.js',
      'public/main.5000d8c96b7ca0524803.bundle.js',
      'public/polyfills.35ab1ad93807931b93ad.bundle.js',
      'public/scripts.2984d6f1578c3464f303.bundle.js',
      'public/styles.8a6a7f1c14ebea1598d0.bundle.css',
      'public/install/**/*',
      'public/themes/bootstrap/**/*',
      'public/themes/foundation/**/*',
      'public/themes/material/**/*',
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

// copy folders
gulp.task('copy-folders', function() {

  // copy folders
  var libs = [
      'node_modules/hashedit/**/*'
      ];

    return gulp.src(libs, {base: './node_modules/'})
  		.pipe(gulp.dest('public/app/libs'));

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
gulp.task('default', gulp.series(['copy-folders', 'copy-respond-ui']));

// create a zip file for the project in dist/release.zip
gulp.task('zip', gulp.series(['create-zip']));