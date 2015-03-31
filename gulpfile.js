var gulp = require('gulp');
var react = require('gulp-react');
var rename = require('gulp-rename');
var watch = require('gulp-watch');

gulp.task('watch', function () {
    return gulp.src('./script.jsx')
        .pipe(watch('./script.jsx'))
        .pipe(react())
        .pipe(rename('script.js'))
        .pipe(gulp.dest('./'));
});

gulp.task('callback', function () {
    watch('./script.jsx', function () {
        gulp.src('./script.jsx')
            .pipe(watch('./script.jsx'));
    });
});