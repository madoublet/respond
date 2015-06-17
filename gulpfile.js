var gulp = require('gulp');
var concat = require('gulp-concat');

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

gulp.task('default', ['controllers', 'factories']);

