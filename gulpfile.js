'use strict';
var gulp = require('gulp');
var jscs = require('gulp-jscs');
var jshint = require('gulp-jshint');
var browserSync = require('browser-sync')
var reload = browserSync.reload;
var browserify = require('gulp-browserify');
// var gulpChild = require('./gulp-child');
// var restart = gulpChild.restart;
var rename = require('gulp-rename');

var paths = {
  scripts: ['**/*.js', '!coverage/**/*.js', '!node_modules/**/*.js', '!public/**/*.js']
};
var watchConfig = {
	app : ['app.js'],
	js : ['test.js']
};



gulp.task('build', function(){
	gulp.src('./test.js')
		.pipe(browserify({
			insertGlobals : true,
			debug : !gulp.env.production
		}))
		.pipe(rename('test_pre.js'))
		.pipe(gulp.dest('./'));
});


gulp.task('server', function() {
	browserSync.init({
		server : {
			baseDir : './'
		},
		port : 8888
	})
});

gulp.task('watch', function() {
	gulp.watch(watchConfig.app).on('change', reload)
	gulp.watch(watchConfig.js, ['build']).on('change', reload)
});

gulp.task('jshint', function() {
  return gulp.src(paths.scripts)
    .pipe(jshint())
    .pipe(jshint.reporter('default'))
    .pipe(jshint.reporter('fail'));
});

gulp.task('jscs', function() {
  return gulp.src(paths.scripts)
    .pipe(jscs())
    .pipe(jscs.reporter());
});

gulp.task('lint', ['jshint', 'jscs']);

gulp.task('default', ['server', 'watch']);

