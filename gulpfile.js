var gulp = require('gulp');
var concat = require('gulp-concat');
var minifyCss = require('gulp-minify-css');
var rename = require('gulp-rename');

// concat controllers
gulp.task('controllers', function() {
  return gulp.src('js/controllers/*.js')
    .pipe(concat('respond.controllers.js'))
    .pipe(gulp.dest('js/'));
});

// concat factories
gulp.task('factories', function() {
  return gulp.src('js/factories/*.js')
    .pipe(concat('respond.factories.js'))
    .pipe(gulp.dest('js/'));
});

// concat directives
gulp.task('directives', function() {
  return gulp.src('js/directives/*.js')
    .pipe(concat('respond.directives.js'))
    .pipe(gulp.dest('js/'));
});

// concat css
gulp.task('css', function() {
  return gulp.src('css/src/*.css')
    .pipe(concat('respond.css'))
    .pipe(gulp.dest('css/'))
    .pipe(minifyCss())
    .pipe(rename('respond.min.css'))
    .pipe(gulp.dest('css/'));
});


gulp.task('default', ['controllers', 'factories', 'directives', 'css']);

