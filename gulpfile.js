var gulp = require('gulp');
var browserify = require('browserify');
var reactify = require('reactify');
var source = require('vinyl-source-stream');
var buffer = require('vinyl-buffer');
var webserver = require('gulp-webserver');

gulp.task('browserify', function() {
    return browserify('./js/app.js')
        .transform(reactify)
        .bundle()
        .pipe(source('app.js'))
        .pipe(buffer())
        .pipe(gulp.dest('./build/'));
});

gulp.task('webserver', function() {
  gulp.src('.')
    .pipe(webserver({
      livereload: true,
      directoryListing: true
    }));
});

gulp.task('watch', function() {
  gulp.watch('./js/**/*.js', ['browserify']);
});

gulp.task('build', ['browserify']);
gulp.task('dev', ['watch', 'browserify']);
gulp.task('default', ['webserver']);
