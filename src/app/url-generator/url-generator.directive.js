/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular.module('comoto-sample.urlGenerator')
    .directive('urlGenerator', UrlGenerator);

  function UrlGenerator() {
    return {
      restrict: 'E',
      templateUrl: 'app/url-generator/url-generator.html',
      controller: 'UrlGeneratorController',
      controllerAs: 'ugCtrl'
    };
  }
})();
