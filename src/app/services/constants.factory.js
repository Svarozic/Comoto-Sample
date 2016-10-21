/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular.module('comoto-sample.ConstantsFactory', [])
    .factory('ComotoConstants', ConstantsFactory);

  /** @ngInject */
  function ConstantsFactory($log) {
    $log.debug('ConstantsFactory init');
    return {
      /*url parameters*/
      SECURITY_DATA: 'SECURITY_DATA'
    };
  }

})();
