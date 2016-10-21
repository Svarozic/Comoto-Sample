'use strict';

var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');


function isOnlyChange(event) {
  return event.type === 'changed';
}

gulp.task('watch', ['inject'], function () {

  var browserSync = null;
  try {
    browserSync = require('browser-sync');
  } catch (err) {
    conf.browerSyncWarning('Skipping browserSync reload');
  }

  gulp.watch([path.join(conf.paths.src, '/*.html'), 'bower.json'], ['inject']);

  gulp.watch(path.join(conf.paths.src, '/app/**/*.css'), function (event) {
    if (isOnlyChange(event) && browserSync !== null) {
      browserSync.reload(event.path);
    } else {
      gulp.start('inject');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.js'), function (event) {
    if (isOnlyChange(event)) {
      gulp.start('scripts');
    } else {
      gulp.start('inject');
    }
  });

  gulp.watch(path.join(conf.paths.src, '/app/**/*.html'), function (event) {
    if (browserSync !== null) {
      browserSync.reload(event.path);
    }
  });
});
