'use strict';

var argv = require('yargs').argv;
var conf = require('./conf');
var gulp = require('gulp');
var path = require('path');

var $ = require('gulp-load-plugins')();

var wiredep = require('wiredep').stream;
var _ = require('lodash');

gulp.task('inject', ['scripts'], function () {
  var injectStyles = gulp.src([
    path.join(conf.paths.src, '/app/**/*.css')
  ], {read: false});

  var jsScriptsToInject = [
    path.join(conf.paths.src, '/app/**/*.module.js'),
    path.join(conf.paths.src, '/app/**/*.js'),
    path.join('!' + conf.paths.src, '/app/**/*.spec.js'),
    path.join('!' + conf.paths.src, '/app/**/*.mock.js')
  ];

  var htmlTemplateToBuild;

  //exclude not used platform service and scripts from injection process
  $.util.log($.util.colors.yellow('AngularJS service for platform \"' + (argv.platform ? argv.platform : conf.paths.platforms.website.argv) + '\" was chosen !'));
  switch (argv.platform) {
    case conf.paths.platforms.chromeExt.argv:
      jsScriptsToInject.push('!' + conf.paths.src + '/app/**/' + conf.paths.platforms.website.service);
      htmlTemplateToBuild = conf.paths.platforms.chromeExt.html;
      break;
    case conf.paths.platforms.website.argv:
    default:
      jsScriptsToInject.push('!' + conf.paths.src + '/app/**/' + conf.paths.platforms.chromeExt.service);
      htmlTemplateToBuild = conf.paths.platforms.website.html;
      break;
  }

  var injectScripts = gulp.src(jsScriptsToInject)
    .pipe($.angularFilesort()).on('error', conf.errorHandler('AngularFilesort'));

  var injectOptions = {
    ignorePath: [conf.paths.src, path.join(conf.paths.tmp, '/serve')],
    addRootSlash: false
  };

  return gulp.src(path.join(conf.paths.src, path.sep, htmlTemplateToBuild))
    .pipe($.inject(injectStyles, injectOptions))
    .pipe($.inject(injectScripts, injectOptions))
    .pipe(wiredep(_.extend({}, conf.wiredep)))
    .pipe($.rename(renameWebisteHtmlTemplate))
    .pipe(gulp.dest(path.join(conf.paths.tmp, '/serve')));
});

/**
 * gulp-rename filter
 * @param file
 */
function renameWebisteHtmlTemplate(file) {
  //substract basename from conf
  var websiteHtmlName = conf.paths.platforms.website.html.substring(0, conf.paths.platforms.website.html.length - 5)
  if (file.basename === websiteHtmlName) {
    file.basename = 'index';
  }
}
