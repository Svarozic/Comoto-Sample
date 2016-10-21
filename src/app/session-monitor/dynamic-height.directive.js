/**
 * Created by Ing. Peter Petraník
 * http://stackoverflow.com/questions/30547547/how-to-set-dynamically-height-to-element
 */

(function () {
  'use strict';

  angular.module('comoto-sample.DynamicHeight', [])
    .directive('dynamicHeight', DynamicHeightDirective);

  /** @ngInject */
  function DynamicHeightDirective($window) {
    return {
      link: function (scope, element, attr) {
        element.css('height', ($window.innerHeight - attr.dynamicHeight ) + 'px');

        $window.onresize = function () {
          element.css('height', ($window.innerHeight - attr.dynamicHeight ) + 'px');
        };
      }
    }
  }
})();
