/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular.module('comoto-sample.chromeSwitcher')
    .directive('chromeSwitcher', ChromeSwitcher);

  function ChromeSwitcher() {
    return {
      restrict: 'E',
      templateUrl: 'app/chrome-switcher/chrome-switcher.html',
      controller: 'ChromeSwitcherController',
      controllerAs: 'csCtrl'
    };
  }

})();
