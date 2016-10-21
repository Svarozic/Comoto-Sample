/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular.module('comoto-sample.urlGenerator', [
    'ngMaterial',
    'ja.qr',

    'comoto-sample.ConstantsFactory',
    'comoto-sample.DataFactory',
    'comoto-sample.PlatformService',
    'comoto-sample.SharingService'
  ]);

})();
