/**
 * Created by Ing. Peter Petraník
 * Chrome extension platform service. Open links in actual tab in Chrome browser
 */

/* global chrome:false */
/*eslint angular/on-watch:0*/
(function () {
  'use strict';

  angular.module('comoto-sample.PlatformService', [])
    .service('PlatformService', WebSiteService);

  /** @ngInject */
  function WebSiteService($log) {
    $log.debug('Chrome PlatformService init');
    return {
      onPrepareSession: function (prepareUrl) {
        fireTabReload(prepareUrl);
      },
      onJoinSession: function (joinUrl) {
        fireTabReload(joinUrl);
      },
      onPrepareAndJoin: function (prepareAndJoinUrl) {
        fireTabReload(prepareAndJoinUrl);
      }
    };

    /**
     * Fire newUrl call on active chrome tab
     * @param newUrl url to call
     */
    function fireTabReload(newUrl) {
      chrome.tabs.update({
        url: newUrl
      });
    }
  }

})();
