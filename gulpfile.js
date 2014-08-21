var gulp = require('gulp');
var clean = require('gulp-clean');
var mocha = require('gulp-mocha');
var concat = require('gulp-concat');
var jshint = require('gulp-jshint');
var browserify = require('browserify');
var runSequence = require('run-sequence');
var source = require('vinyl-source-stream');
var mochaPhantomJS = require('gulp-mocha-phantomjs');


var testFiles = ['test/**/*.js'];
var srcFiles = ['index.js', 'lib/**/*.js', 'helpers/**/*.js'];
var allFiles = srcFiles.concat(testFiles);

var reporter = 'spec';

gulp.task('default', function(cb) {
  runSequence(
    ['clean', 'concat-testFiles', 'jshint'],
    ['unit-tests', 'browserify-srcFiles', 'browserify-testFiles'],
    'browser-tests', cb);
});


gulp.task('clean', function() {
  gulp.src('./build').pipe(clean());
});


gulp.task('watch', function() {
  reporter = 'dot';
  runSequence(['clean', 'jshint'], 'unit-tests');
  gulp.watch(allFiles, ['jshint', 'unit-tests']);
});


gulp.task('unit-tests', function() {
  return gulp.src(testFiles, {read: false})
    .pipe(mocha({ reporter: reporter }));
});


gulp.task('jshint', function() {
  return gulp.src(allFiles)
    .pipe(jshint({
      laxcomma: true
    }))
    .pipe(jshint.reporter('default'));
});


gulp.task('browserify-srcFiles', function() {
  return browserify({
    entries: ['./index.js'], // Entry point
    debug: false // true --> enable source maps!
  })
  .bundle()
  // Use vinyl-source-stream to make the stream gulp compatible.
  .pipe(source('mosql.js'))
  .pipe(gulp.dest('./build/'));
});

gulp.task('concat-testFiles', function() {
  return gulp.src(testFiles)
    .pipe(concat('mosql.spec.js'))
    .pipe(gulp.dest('./build/'));
});


gulp.task('browserify-testFiles', function() {
  return browserify('./build/mosql.spec.js')
    .bundle()
    .pipe(source('mosql.spec.js'))
    .pipe(gulp.dest('./build/'));
});


gulp.task('browser-tests', function() {
  return gulp
    .src('test/index.html')
    .pipe(mochaPhantomJS({ reporter: 'dot' }));
});
