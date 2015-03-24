var gulp = require('gulp');
    browserify = require('browserify'),
    reactify = require('reactify'),
    source = require('vinyl-source-stream'),
    buffer = require('vinyl-buffer'),
    webserver = require('gulp-webserver'),
    concat = require('gulp-concat'),
    minifyCSS = require('gulp-minify-css'),
    rename = require('gulp-rename');

var fileOrder = [
  'css/vendor/normalize.css',
  'css/vendor/skeleton.css',
  'css/main.css'
];

gulp.task('css', function() {
    gulp.src(fileOrder)
        .pipe(concat('styles.css'))
        .pipe(minifyCSS())
        .pipe(rename('styles.min.css'))
        .pipe(gulp.dest('build'))
});

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

gulp.task('build', ['browserify', 'css']);
gulp.task('dev', ['watch', 'browserify']);
gulp.task('default', ['webserver']);
