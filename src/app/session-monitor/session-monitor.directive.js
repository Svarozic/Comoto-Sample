/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular.module('comoto-sample.sessionMonitor')
    .directive('sessionMonitor', SessionMonitor);

  function SessionMonitor() {
    return {
      restrict: 'E',
      templateUrl: 'app/session-monitor/session-monitor.html',
      controller: 'SessionMonitorController',
      controllerAs: 'smCtrl'
    };
  }
})();
