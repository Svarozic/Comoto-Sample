/**
 * Created by Ing. Peter Petraník
 * Share data between generator and monitorby angular design pattern (shared factory and watch functions)
 */

/*eslint angular/on-watch:0*/
(function () {
  'use strict';

  angular.module('comoto-sample.SharingService', [])
    .service('SharingService', SharingService);

  /** @ngInject */
  function SharingService($log, SharedData) {
    $log.debug('SharingService init');
    return {
      sendMessageToMonitor: function (newBaseUrl, newCollabSessionID) {
        SharedData.baseUrl = newBaseUrl;
        SharedData.collabSessionID = newCollabSessionID;
      },
      onChangeCollabSessionID: function (scope, callbackFn) {
        scope.$watch(function () {
          return SharedData.collabSessionID;
        }, function () {
          callbackFn(SharedData.collabSessionID);
        });
      },
      onChangeBaseUrl: function (scope, callbackFn) {
        scope.$watch(function () {
          return SharedData.baseUrl;
        }, function () {
          callbackFn(SharedData.baseUrl);
        });
      },
      getSharedCollabSessionID: function () {
        return SharedData.collabSessionID;
      },
      getSharedBaseUrl: function () {
        return SharedData.baseUrl;
      }
    };
  }


  /**
   * inner imlementation of sharing data between two controllers on same website
   */
  angular.module('comoto-sample.SharingService')
    .factory('SharedData', SharedDataFactory);

  /** @ngInject */
  function SharedDataFactory($log) {
    $log.debug('SharedDataFactory init');
    return {
      collabSessionID: 0,
      baseUrl: ''
    };
  }

})();
