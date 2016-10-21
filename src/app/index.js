/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular
    .module('comoto-sample', [
      'ngMaterial',
      'LocalStorageModule',

      'comoto-sample.urlGenerator',
      'comoto-sample.sessionMonitor',
      'comoto-sample.chromeSwitcher'
    ]);

})();
