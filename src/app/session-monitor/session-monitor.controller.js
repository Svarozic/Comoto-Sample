/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular.module('comoto-sample.sessionMonitor')
    .controller('SessionMonitorController', SessionMonitorController);

  /** @ngInject */
  function SessionMonitorController($scope, $timeout, $log, $sce, $window, $http, ComotoConstants,
                                    SharingService, MONITOR_REFRESH_DELAY) {
    /**
     * ViewModel
     */
    var vm = this;

    //view fields
    vm.sessionsPageUrl = getSessionsPageUrl();
    vm.lastBaseUrl = SharingService.getSharedBaseUrl();
    vm.lastCreatedCollabSessionID = SharingService.getSharedCollabSessionID();
    vm.refreshIframe = false;

    //event handlers
    vm.onClickOpenSessionPage = onClickOpenSessionPage;
    vm.onClickKillLastCreatedSession = onClickKillLastCreatedSession;
    vm.onClickKillAllSessions = onClickKillAllSessions;
    vm.onClickRefreshIframe = onClickRefreshIframe;

    //ShareData Watcher > update SessionUrl
    SharingService.onChangeBaseUrl($scope, function (newBaseUrl) {
      vm.lastBaseUrl = newBaseUrl;
      vm.sessionsPageUrl = getSessionsPageUrl();
      $log.info('SessionMonitorController > urlChanged: ' + vm.sessionsPageUrl);
    });

    //ShareData Watcher > update SessionUrl
    SharingService.onChangeCollabSessionID($scope, function (newCollabSessionID) {
      vm.lastCreatedCollabSessionID = newCollabSessionID;
      $log.info('SessionMonitorController > lastCreatedCollabSessionID: ' + vm.lastCreatedCollabSessionID);
    });


    //################ FUNCTIONS ################

    function onClickOpenSessionPage() {
      $window.open(getSessionsPageUrl(), "_blank");
    }

    function onClickKillLastCreatedSession() {
      var killUrl = '';
      $log.info('SessionMonitorController > Killing last session ' + killUrl);
      $http.get(killUrl)
        .then(function onSuccess() {
          $log.info('SessionMonitorController > KILLED!!');
          $timeout(onClickRefreshIframe, MONITOR_REFRESH_DELAY);
        }, function onError(e) {
          $log.error('SessionMonitorController > ERROR');
          $log.error(e);
          $timeout(onClickRefreshIframe, MONITOR_REFRESH_DELAY);
        });
    }

    function onClickKillAllSessions() {
      var killUrl = '';
      $log.info('SessionMonitorController > Killing all sessions ' + killUrl);
      $http.get(killUrl)
        .then(function onSuccess() {
          $log.info('SessionMonitorController > KILLED!!');
          $timeout(onClickRefreshIframe, MONITOR_REFRESH_DELAY);
        }, function onError() {
          $log.error('SessionMonitorController > ERROR');
          $timeout(onClickRefreshIframe, MONITOR_REFRESH_DELAY);
        });
    }

    function onClickRefreshIframe() {
      vm.refreshIframe = true;
    }

    function getSessionsPageUrl() {
      return 'SECURITY_DATA';
    }


    $log.debug('SessionMonitorController > init');
  }//SessionMonitorController

})();
