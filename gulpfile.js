var gulp = require('gulp');
var concat = require('gulp-concat');

// concat controllers
gulp.task('ctrls', function() {
  return gulp.src('js/controllers/*.js')
    .pipe(concat('respond.controllers.js'))
    .pipe(gulp.dest('js/'));
});

gulp.task('default', ['ctrls']);

