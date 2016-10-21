'use strict';

var argv = require('yargs').argv;
var path = require('path');
var gulp = require('gulp');
var conf = require('./conf');

var util = require('util');

function browserSyncInit(baseDir, browser) {

  var browserSync = require('browser-sync');
  var browserSyncSpa = require('browser-sync-spa');

  browserSync.use(browserSyncSpa({
    selector: '[ng-app]'// Only needed for angular apps
  }));

  browser = browser === undefined ? 'default' : browser;

  var routes = null;
  if (baseDir === conf.paths.src || (util.isArray(baseDir) && baseDir.indexOf(conf.paths.src) !== -1)) {
    routes = {
      '/bower_components': 'bower_components'
    };
  }

  var server = {
    baseDir: baseDir,
    routes: routes
  };

  /*
   * You can add a proxy to your backend by uncommenting the line below.
   * You just have to configure a context which will we redirected and the target url.
   * Example: $http.get('/users') requests will be automatically proxified.
   *
   * For more details and option, https://github.com/chimurai/http-proxy-middleware/blob/v0.0.5/README.md
   */
  // server.middleware = proxyMiddleware('/users', {target: 'http://jsonplaceholder.typicode.com', proxyHost: 'jsonplaceholder.typicode.com'});

  browserSync.instance = browserSync.init({
    startPath: '/',
    server: server,
    browser: browser,
    open: false
  });
}

gulp.task('serve', ['watch'], function () {
  browserSyncInit([path.join(conf.paths.tmp, '/serve'), conf.paths.src]);
});

gulp.task('serve:dist', ['build'], function () {

  var distFolder;
  switch (argv.platform) {
    case conf.paths.platforms.chromeExt.argv:
      distFolder = conf.paths.platforms.chromeExt.dist;
      break;
    case conf.paths.platforms.website.argv:
    default:
      distFolder = conf.paths.platforms.website.dist;
      break;
  }

  browserSyncInit(path.join(conf.paths.dist, distFolder));
});
