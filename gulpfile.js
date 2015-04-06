var gulp = require('gulp'),
    concat = require('gulp-concat'),
    webserver = require('gulp-webserver'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename');

var fileOrder = [
  'css/vendor/bootstrap.min.css',
  'css/main.css'
];

gulp.task('css', function() {
    gulp.src(fileOrder)
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('build'))
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true,
      open: '/index.html'
    }));
});

gulp.task('watch', function() {
  gulp.watch('./css/**/*.css', ['css']);
});

gulp.task('build', ['css']);
gulp.task('default', ['webserver']);
