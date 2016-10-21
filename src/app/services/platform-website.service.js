/**
 * Created by Ing. Peter Petraník
 * WebSite platform service. Open generated links in new tab
 */

/*eslint angular/on-watch:0*/
(function () {
  'use strict';

  angular.module('comoto-sample.PlatformService', [])
    .service('PlatformService', WebSiteService);

  /** @ngInject */
  function WebSiteService($log, $window) {
    $log.debug('Website PlatformService init');
    return {
      onPrepareSession: function (prepareUrl) {
        $window.open(prepareUrl, '_blank');
      },
      onJoinSession: function (joinUrl) {
        $window.open(joinUrl, '_blank');
      },
      onPrepareAndJoin: function (prepareAndJoinUrl) {
        $window.open(prepareAndJoinUrl, '_blank');
      }
    };
  }

})();
