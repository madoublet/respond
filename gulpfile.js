const gulp = require('gulp');
const gutil = require('gulp-util');
const zip = require('gulp-zip');
const Builder = require('systemjs-builder');
const ts = require('gulp-typescript');
const sourcemaps  = require('gulp-sourcemaps');
const concat = require('gulp-concat');
const minify = require('gulp-minify');
const inlineNg2Template = require('gulp-inline-ng2-template');

const php = require('gulp-connect-php');
const webpack = require("webpack");
const webpackConfig = require("./webpack.config.js");

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
      'public/i18n/**/*',
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

// copy dependencies
gulp.task('copy-libs', function() {

  // copy folders
  var libs = [
      'node_modules/rxjs/**/*',
      'node_modules/angular2-in-memory-web-api/**/*',
      'node_modules/@angular/**/*',
      'node_modules/ng2-translate/**/*'
      ];

    return gulp.src(libs, {base: './node_modules/'})
  		.pipe(gulp.dest('public/dev/libs'));

});

// copy js
gulp.task('copy-files', function() {

  return gulp.src([])
    .pipe(gulp.dest('public/dev/libs/'));
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
      'node_modules/dropzone/dist/min/dropzone.min.js'
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

// copy static files
gulp.task('copy-static', function() {

    var bundlePaths = [
      'public/src/**/*.js',
      'public/src/**/*.css',
      'public/src/**/*.png'
    ];

    return gulp.src(bundlePaths, {base: 'public/src'})
  		.pipe(gulp.dest('public/app'));

});


// #ref http://stackoverflow.com/questions/35280582/angular2-too-many-file-requests-on-load/37082199#37082199
var tsProject = ts.createProject('tsconfig.json');

gulp.task('ts', function() {
    return gulp.src(['public/src/**/*.ts'])
        .pipe(inlineNg2Template({ UseRelativePaths: true, indent: 0, removeLineBreaks: true, base: 'public/src'}))
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/app'));
});

// bundle project
gulp.task('bundle', function() {
    // optional constructor options
    // sets the baseURL and loads the configuration file
    var builder = new Builder('public', 'public/systemjs.config.js');

    /*
       the parameters of the below buildStatic() method are:
           - your transcompiled application boot file (the one wich would contain the bootstrap(MyApp, [PROVIDERS]) function - in my case 'dist/app/boot.js'
           - the output (file into which it would output the bundled code)
           - options {}
    */
    return builder
        .buildStatic('app/main.js', 'public/app/bundle.js', { minify: true, sourceMaps: true})
        .then(function() {
            console.log('Build complete');
        })
        .catch(function(err) {
            console.log('Build error');
            console.log(err);
        });
});

gulp.task('webpack:build', function (callback) {
    webpack(webpackConfig, function (err, stats) {
        if (err)
            throw new gutil.PluginError('webpack:build', err);
        callback();
    });
});

gulp.task('serve', function() {
    php.server({
        base: './public'
    });

});

// copy
gulp.task('default', gulp.series(['copy-libs', 'copy-folders', 'copy-js', 'copy-css', 'copy-static', 'ts', 'bundle']));

// dev-build
gulp.task('dev-build', gulp.series(['copy-static', 'ts']));

// build
gulp.task('build', gulp.series(['copy-static', 'ts', 'bundle']));

// create a zip file for the project in dist/release.zip
gulp.task('zip', gulp.series(['create-zip']));