/**
 * Created by Ing. Peter Petraník
 */

/* global __dirname:false */

var argv = require('yargs').argv;
var gulp = require('gulp');
var gulpUtil = require('gulp-util');
var conf = require('./conf');
var path = require('path');

var express = require('express');


gulp.task('express', ['inject'], function (callback) {
  var app = express();

  //serve .tmp folder with INDEX.HTML FILE
  app.use(express.static(path.join(__dirname, '..', conf.paths.tmp, 'serve')));

//serve and proxy libraries, source code and assets
  app.use('/bower_components', express.static(path.join(__dirname, '..', 'bower_components')));
  app.use('/app', express.static(path.join(__dirname, '..', conf.paths.src, 'app')));
  app.use('/assets', express.static(path.join(__dirname, '..', conf.paths.src, 'assets')));

  app.get('/test', function (req, res) {
    res.sendFile(path.join(__dirname, '..', conf.paths.tmp, 'serve', 'index.html'));
  });

  app.listen(3000);

  var indexFileName;
  switch (argv.platform) {
    case conf.paths.platforms.chromeExt.argv:
      indexFileName = conf.paths.platforms.chromeExt.html;
      break;
    case conf.paths.platforms.website.argv:
    default:
      indexFileName = 'index.html';
      break;
  }

  gulpUtil.log('\n');
  gulpUtil.log(gulpUtil.colors.green('Server is running on address: http://localhost:3000/' + indexFileName));
  //callback need to be specify to notify gulp that tusk is still running
});

gulp.task('express:dist', ['build'], function (callback) {
  var app = express();

  var distFolder;
  var indexFileName;
  switch (argv.platform) {
    case conf.paths.platforms.chromeExt.argv:
      distFolder = conf.paths.platforms.chromeExt.dist;
      indexFileName = conf.paths.platforms.chromeExt.html;
      break;
    case conf.paths.platforms.website.argv:
    default:
      distFolder = conf.paths.platforms.website.dist;
      indexFileName = 'index.html';
      break;
  }

  app.use(express.static(path.join(__dirname, '..', conf.paths.dist, distFolder)));

  app.listen(3000);

  gulpUtil.log('\n');
  gulpUtil.log(gulpUtil.colors.green('Server is running on address: http://localhost:3000/' + indexFileName));
  gulpUtil.log(gulpUtil.colors.green('Distribution folder folder which is served: \"' + distFolder + '\"'));
  //callback need to be specify to notify gulp that tusk is still running
});
