var gulp = require('gulp');
var concat = require('gulp-concat');

gulp.task('scripts', function()
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
