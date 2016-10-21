'use strict';

var argv = require('yargs').argv;
var conf = require('./conf');
var gulp = require('gulp');
var path = require('path');

var $ = require('gulp-load-plugins')({
  pattern: ['gulp-*', 'main-bower-files', 'uglify-save-license', 'del']
});

gulp.task('partials', function () {
  return gulp.src([
    path.join(conf.paths.src, '/app/**/*.html'),
    path.join(conf.paths.tmp, '/serve/app/**/*.html')
  ])
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true
    }))
    .pipe($.angularTemplatecache('templateCacheHtml.js', {
      module: 'comoto-sample',
      root: 'app'
    }))
    .pipe(gulp.dest(conf.paths.tmp + '/partials/'));
});

gulp.task('html', ['inject', 'partials'], function () {
  var partialsInjectFile = gulp.src(path.join(conf.paths.tmp, '/partials/templateCacheHtml.js'), {read: false});
  var partialsInjectOptions = {
    starttag: '<!-- inject:partials -->',
    ignorePath: path.join(conf.paths.tmp, '/partials'),
    addRootSlash: false
  };


  var chosenHtmlTmpl;
  var outputDistDir;

  //choose platform to build
  switch (argv.platform) {
    case conf.paths.platforms.chromeExt.argv:
      chosenHtmlTmpl = 'serve/' + conf.paths.platforms.chromeExt.html;
      outputDistDir = conf.paths.platforms.chromeExt.dist;
      break;
    case conf.paths.platforms.website.argv:
    default:
      chosenHtmlTmpl = 'serve/index.html';
      outputDistDir = conf.paths.platforms.website.dist;
      break;
  }
  $.util.log($.util.colors.yellow(
    'Platform \"' + (argv.platform ? argv.platform : 'website') + '\" was chosen ! ' +
    'Output directory: /dist/' + outputDistDir
  ));

  var htmlFilter = $.filter('*.html', {restore: true});
  var jsFilter = $.filter('**/*.js', {restore: true});
  var cssFilter = $.filter('**/*.css', {restore: true});
  var assets;


  return gulp.src(path.join(conf.paths.tmp, path.sep, chosenHtmlTmpl))
    .pipe($.inject(partialsInjectFile, partialsInjectOptions))
    .pipe(assets = $.useref.assets())
    .pipe($.rev())
    .pipe(jsFilter)
    .pipe($.sourcemaps.init())
    .pipe($.ngAnnotate())
    .pipe($.uglify({preserveComments: $.uglifySaveLicense})).on('error', conf.errorHandler('Uglify'))
    .pipe($.sourcemaps.write('maps'))
    .pipe(jsFilter.restore)
    .pipe(cssFilter)
    .pipe($.sourcemaps.init())
    .pipe($.replace('../../bower_components/material-design-iconfont/iconfont/', '../fonts/'))
    .pipe($.minifyCss({processImport: false}))
    .pipe($.sourcemaps.write('maps'))
    .pipe(cssFilter.restore)
    .pipe(assets.restore())
    .pipe($.useref())
    .pipe($.revReplace())
    .pipe(htmlFilter)
    .pipe($.minifyHtml({
      empty: true,
      spare: true,
      quotes: true,
      conditionals: true
    }))
    .pipe(htmlFilter.restore)
    .pipe(gulp.dest(path.join(conf.paths.dist, outputDistDir, path.sep)))
    .pipe($.size({title: path.join(conf.paths.dist, outputDistDir, path.sep), showFiles: true}));
});

// Only applies for fonts from bower dependencies
// Custom fonts are handled by the "other" task
gulp.task('fonts', function () {
  //choose platform to build
  var outputDistDir = conf.paths.distWeb;
  switch (argv.platform) {
    case conf.paths.platforms.chromeExt.argv:
      outputDistDir = conf.paths.platforms.chromeExt.dist;
      break;
    case conf.paths.platforms.website.argv:
    default:
      outputDistDir = conf.paths.platforms.website.dist;
      break;
  }

  return gulp.src($.mainBowerFiles().concat('bower_components/material-design-iconfont/iconfont/*'))
    .pipe($.filter('**/*.{eot,svg,ttf,woff,woff2}'))
    .pipe($.flatten())
    .pipe(gulp.dest(path.join(conf.paths.dist, outputDistDir, '/fonts/')));
});

gulp.task('other', function () {
  var fileFilter = $.filter(function (file) {
    return file.stat.isFile();
  });

  var otherFiles = [
    path.join(conf.paths.src, '/**/*'),
    path.join('!' + conf.paths.src, '/**/*.{html,css,js}')
  ];

  //choose platform to build
  var outputDistDir;
  switch (argv.platform) {
    case conf.paths.platforms.chromeExt.argv:
      outputDistDir = conf.paths.platforms.chromeExt.dist
      otherFiles.push(path.join(conf.paths.platforms.chromeExt.manifest));
      otherFiles.push(path.join('!' + conf.paths.src, '/**/favicons/*'));
      break;
    case conf.paths.platforms.website.argv:
    default:
      outputDistDir = conf.paths.platforms.website.dist
      otherFiles.push(path.join('!' + conf.paths.src, '/**/chrome-ext-icons/*'));
      break;
  }

  return gulp.src(otherFiles)
    .pipe(fileFilter)
    .pipe($.rename(renameManifestFile))
    .pipe(gulp.dest(path.join(conf.paths.dist, outputDistDir, path.sep)));
});

gulp.task('clean', function () {
  return $.del([path.join(conf.paths.dist, path.sep), path.join(conf.paths.tmp, path.sep)]);
});

gulp.task('build', ['html', 'fonts', 'other']);

/**
 * gulp-rename filter
 * @param file
 */
function renameManifestFile(file) {
  var extManifestName = conf.paths.platforms.chromeExt.manifest.substring(0, conf.paths.platforms.chromeExt.manifest.length - 5);
  if (file.basename === extManifestName) {
    file.basename = 'manifest';
  }
}
