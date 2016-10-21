'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var $ = require('gulp-load-plugins')();

gulp.task('scripts', function (callback) {

  var browserSync = null;
  try {
    browserSync = require('browser-sync');
  } catch (err) {
    conf.browerSyncWarning('Skipping browserSync reload');
  }


  var gulpRef = gulp.src(path.join(conf.paths.src, '/app/**/*.js'))
    .pipe($.eslint())
    .pipe($.eslint.format());

  if (browserSync !== null) {
    gulpRef.pipe(browserSync.reload({stream: true}));
  }

  gulpRef.pipe($.size());

  callback();
});
