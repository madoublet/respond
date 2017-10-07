const gulp = require('gulp');
const gutil = require('gulp-util');
const zip = require('gulp-zip');
const sourcemaps  = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const cachebust = require('gulp-cache-bust');

// copy node modules (no longer needed with new build)
gulp.task('copy-nm', function() {

    var src, dest;

    src = 'node_modules/**/*';
    dest = 'public/';

    return gulp.src(src, {base:"."})
        .pipe(gulp.dest(dest));
});

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
      'public/inline.bd69b818b81dd60f4de7.bundle.js',
      'public/main.27ee93ffa90c2ede0c3c.bundle.js',
      'public/polyfills.74137c19008bd44200e0.bundle.js',
      'public/scripts.b691de4aa2544c1b38f2.bundle.js',
      'public/styles.3497dde262ff5634f835.bundle.css',
      'public/vendor.35bf790ca7d2559a448b.bundle.js',
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

  return gulp.src([
      'node_modules/moment/min/moment-with-locales.min.js',
      'node_modules/dropzone/dist/min/dropzone.min.js',
      'node_modules/ace-builds/src-min/ace.js',
      'node_modules/ace-builds/src-min/ext-searchbox.js',
      'node_modules/ace-builds/src-min/mode-html.js',
      'node_modules/ace-builds/src-min/mode-css.js',
      'node_modules/ace-builds/src-min/mode-php.js',
      'node_modules/ace-builds/src-min/mode-javascript.js',
      'node_modules/ace-builds/src-min/theme-chrome.js',
      'node_modules/ace-builds/src-min/worker-html.js',
      'node_modules/ace-builds/src-min/worker-css.js',
      'node_modules/ace-builds/src-min/worker-javascript.js',
      'node_modules/ace-builds/src-min/worker-php.js'
    ])
    .pipe(gulp.dest('public/app/libs/'));
});


// copy static files
gulp.task('copy-css', function() {

    return gulp.src([
      'node_modules/dropzone/dist/min/dropzone.min.css',
      'node_modules/hashedit/dist/hashedit-min.css'
      ])
  		.pipe(gulp.dest('public/app/libs/'));

});

// bust-cache
gulp.task('cache-bust', function () {

  var cachebust = require('gulp-cache-bust');

  return gulp.src('public/index.html')
      .pipe(cachebust({
          type: 'timestamp'
      }))
      .pipe(gulp.dest('public/', {overwrite:true}));

});

// copy
gulp.task('default', gulp.series(['copy-folders', 'copy-js', 'copy-css', 'copy-respond-ui']));

// create a zip file for the project in dist/release.zip
gulp.task('zip', gulp.series(['create-zip']));