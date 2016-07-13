const gulp = require('gulp');
const zip = require('gulp-zip');
const Builder = require('systemjs-builder');
const ts = require('gulp-typescript');
const sourcemaps  = require('gulp-sourcemaps');

// copy node modules (no longer needed with new build)
gulp.task('copy-nm', function() {

    var src, dest;

    src = 'node_modules/**/*';
    dest = 'public/';

    gulp.src(src, {base:"."})
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
      'public/dist/**/*',
      'public/i18n/**/*',
      'public/themes/bootstrap/**/*',
      'public/themes/foundation/**/*',
      'public/themes/material/**/*',
      'public/.htaccess',
      'public/.index.html',
      'public/.index.php',
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

    gulp.src(bundlePaths, {base: './', follow: true})
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
  		.pipe(gulp.dest('./public/app/libs'));

});

// copy files
gulp.task('copy-files', function() {

  return gulp.src([
      'node_modules/angular2-jwt/angular2-jwt.js',
      'node_modules/zone.js/dist/zone.js',
      'node_modules/reflect-metadata/Reflect.js',
      'node_modules/systemjs/dist/system.src.js',
      'node_modules/moment/min/moment-with-locales.min.js',
      'node_modules/dropzone/dist/min/dropzone.min.js',
      'node_modules/dropzone/dist/min/dropzone.min.css',
      'node_modules/hashedit/dist/hashedit.min.css',
      'node_modules/hashedit/dist/hashedit.min.js',
    ])
    .pipe(gulp.dest('public/app/libs'));
});


// copy static files
gulp.task('copy-static', function() {

    var bundlePaths = [
      'public/src/**/*.html',
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
        .pipe(sourcemaps.init({
            loadMaps: true
        }))
        .pipe(ts(tsProject))
        .pipe(sourcemaps.write('.'))
        .pipe(gulp.dest('public/app'));
});


// copy
gulp.task('default', gulp.series(['copy-libs', 'copy-files', 'copy-static', 'ts']));

// build
gulp.task('build', gulp.series(['copy-static', 'ts']));

// create a zip file for the project in dist/release.zip
gulp.task('zip', gulp.series(['create-zip']));