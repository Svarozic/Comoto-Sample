/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular.module('comoto-sample.sessionMonitor')
    .directive('refreshableIframe', RefreshableIframeDirective);

  function RefreshableIframeDirective() {
    return {
      restrict: 'A',
      scope: {
        refresh: "=refreshableIframe"
      },
      link: function (scope, element) {
        var refreshMe = function () {
          element.attr('src', element.attr('src'));
        };


        scope.$watch(function () {
          return scope.refresh;
        }, function () {
          if (scope.refresh) {
            scope.refresh = false;
            refreshMe();
          }
        });
      }
    };
  }//RefreshableIframe

})();
