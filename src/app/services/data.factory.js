/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';
  angular.module('comoto-sample.DataFactory', [])
    .factory('ComotoData', DataFactory);

  /** @ngInject */
  function DataFactory($log) {
    $log.debug('DataFactory init');
    return {
      /**
       * ALLOW EVERY URL ADDRESS IN index.config.js FOR $sceDelegateProvider
       */
      servers: [
        ["SENSITIVE", "DATA", "DELETED"],
        ["SENSITIVE", "DATA", "DELETED"],
        ["SENSITIVE", "DATA", "DELETED"],
        ["SENSITIVE", "DATA", "DELETED"],
        ["SENSITIVE", "DATA", "DELETED"],
        ["SENSITIVE", "DATA", "DELETED"],
        ["SENSITIVE", "DATA", "DELETED"]
      ],
      studies: [
        ["SESITIVE_DATA", "DELETED"],
        ["SESITIVE_DATA", "DELETED"],
        ["SESITIVE_DATA", "DELETED"],
        ["SESITIVE_DATA", "DELETED"],
        ["SESITIVE_DATA", "DELETED"],
        ["SESITIVE_DATA", "DELETED"],
        ["SESITIVE_DATA", "DELETED"]
      ],
      templates: [
        ["SESITIVE_DATA", "DELETED"],
        ["SESITIVE_DATA", "DELETED"],
        ["SESITIVE_DATA", "DELETED"],
        ["SESITIVE_DATA", "DELETED"],
        ["SESITIVE_DATA", "DELETED"]
      ],
      gwtLogLevels: [
        'NONE',
        'SEVERE',
        'WARNING',
        'INFO',
        'FINE',
        'FINER',
        'FINEST'
      ]
    };
  }

})();
