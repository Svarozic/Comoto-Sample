/**
 * Created by Ing. Peter Petraník
 */

/* global window:false */
/*eslint angular/window-service:0*/
(function () {
  'use strict';

  angular
    .module('comoto-sample')
    .config(config);

  /** @ngInject */
  function config($logProvider, $sceDelegateProvider, $mdThemingProvider, localStorageServiceProvider) {
    // Enable log
    $logProvider.debugEnabled(true);


    //Allow External URLs
    var ALLOWED_SERVERS_REGEX = [
      new RegExp('SENSITIVE'),
      new RegExp('DATA'),
      new RegExp('WAS'),
      new RegExp('DELETED')
    ];
    var develUrls = ['self', 'http://www.slovakia.com/'];
    $sceDelegateProvider.resourceUrlWhitelist(ALLOWED_SERVERS_REGEX.concat(develUrls));


    //set angular-material theme
    $mdThemingProvider.theme('default')
      .primaryPalette('blue-grey')
      .warnPalette('teal')
      .accentPalette('red');


    //angular-local-storage setup
    localStorageServiceProvider.setPrefix('COMOTO_SESSION_GENERATOR_');


    if (window.console && window.console.log) {
      window.console.log('configBlock end')
    }
  }

})();
