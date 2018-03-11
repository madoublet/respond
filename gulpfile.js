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
      'public/0.03209b91f414e55880bd.chunk.js',
      'public/inline.4fe9fd6922a8f85954b7.bundle.js',
      'public/main.7777ed84a5d3363179f0.bundle.js',
      'public/polyfills.35ab1ad93807931b93ad.bundle.js',
      'public/scripts.f8b3fbe1c84c9e946ba2.bundle.js',
      'public/styles.98eb654a4c41c07a2600.bundle.css',
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

// create a zip file for the project in dist/release.zip
gulp.task('zip', gulp.series(['create-zip']));