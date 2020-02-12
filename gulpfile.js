const gulp = require('gulp');
const concat = require('gulp-concat');

gulp.task('compress-scripts', () =>
{
  return gulp
        .src([
            './src/exceptions/exception.js',
            './src/exceptions/arguments/*.js',
            './src/jsopt_core.js',
            './src/jsopt.js'
        ])
        .pipe(concat('jsopt-all.js'))
        .pipe(gulp.dest('./dist/'));
});
