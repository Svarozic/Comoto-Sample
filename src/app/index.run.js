/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular
    .module('comoto-sample')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log, localStorageService) {
    if (localStorageService.isSupported) {
      $log.debug('runBlock > LocalStorage is supported');
    }
    $log.debug('runBlock end');
  }

})();
