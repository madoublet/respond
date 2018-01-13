const gulp = require('gulp');
const gutil = require('gulp-util');
const zip = require('gulp-zip');
const concat = require('gulp-concat');
const minify = require('gulp-minify');


// create a zip for the release
gulp.task('create-zip', function() {

    var bundlePaths = [
      'app/**/*',
      'bootstrap/**/*',
      'database/**/*',
      'design/**/*',
      'public/app/**/*',
      'public/assets/**/*',
      'public/favicon.ico',
      'public/inline.46a703d2d28a5bc1f465.bundle.js',
      'public/main.0f89cbc80238ee5e7d6b.bundle.js',
      'public/polyfills.670184bbc1da14b1de67.bundle.js',
      'public/scripts.f4b7c9895a1886684c5e.bundle.js',
      'public/styles.e1308664689d3e858888.bundle.css',
      'public/install/**/*',
      'public/themes/bootstrap/**/*',
      'public/themes/foundation/**/*',
      'public/themes/material/**/*',
      'public/.htaccess',
      'public/index.html',
      'public/index.php',
      'resources/emails/**/*',
      'resources/views/**/*',
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