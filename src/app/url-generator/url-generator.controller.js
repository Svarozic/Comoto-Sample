/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular.module('comoto-sample.urlGenerator')
    .controller('UrlGeneratorController', UrlGeneratorController);

  /** @ngInject */
  function UrlGeneratorController($scope, $http, $sce, $log, ComotoData, ComotoConstants, SharingService, PlatformService, localStorageService, $mdDialog) {
    var vm = this;

    var activePrettyUrlType = ComotoConstants.SECURITY_DATA;

    //data
    vm.serverValues = ComotoData.servers;
    vm.studyValues = ComotoData.studies;
    vm.templateValues = ComotoData.templates;
    vm.gwtLogLevelValues = ComotoData.gwtLogLevels;

    //view fields
    vm.collabSessionID = getFromLocalStorage('SECURITY_DATA', createCollabSessionID());
    vm.isPredefinedServer = getFromLocalStorage('SECURITY_DATA', true);
    vm.serverOptionCustom = getFromLocalStorage('SECURITY_DATA', '');
    vm.serverOption = getFromLocalStorage('SECURITY_DATA', 0);
    vm.isPredefinedDataLoadingServer = getFromLocalStorage('SECURITY_DATA', true);
    vm.dataloadingServerOptionCustom = getFromLocalStorage('SECURITY_DATA', '');
    vm.dataloadingServerOption = getFromLocalStorage('SECURITY_DATA', 0);
    //Mitch study by default
    vm.studyOption = getFromLocalStorage('SECURITY_DATA', vm.studyValues[3][1]);
    vm.studyIdsOption = getFromLocalStorage('SECURITY_DATA', []);
    vm.isPredefinedStudy = getFromLocalStorage('SECURITY_DATA', true);
    vm.isAdvancedVisible = getFromLocalStorage('SECURITY_DATA', true);
    vm.modalities = getFromLocalStorage('SECURITY_DATA', []);
    vm.bodyParts = getFromLocalStorage('SECURITY_DATA', []);
    vm.templateOption = getFromLocalStorage('SECURITY_DATA', vm.templateValues[0][1]);
    vm.customParameters = getFromLocalStorage('SECURITY_DATA', []);
    vm.logLevelOption = getFromLocalStorage('SECURITY_DATA', vm.gwtLogLevelValues[0]);
    vm.isDevelopment = getFromLocalStorage('SECURITY_DATA', false);
    vm.isHttps = getFromLocalStorage('SECURITY_DATA', false);
    vm.isWaitForStart = getFromLocalStorage('SECURITY_DATA', false);
    vm.isUrlShowcaseFormated = getFromLocalStorage('SECURITY_DATA', false);

    //generated
    vm.urlShowcase = getPrettyShareSessionUrl(activePrettyUrlType);
    vm.qrcodeLink = '';

    //notify monitor at startup
    SharingService.sendMessageToMonitor(getBaseUrl(), vm.collabSessionID);

    //btns flags
    vm.isLinkBtnOpen = false;
    vm.isQRBtnOpen = false;

    //#################################################
    //# EVENT HANDLERS
    //#################################################
    vm.onClickCollabSessionID = onClickCollabSessionID;
    vm.onClickPrepare = onClickPrepare;
    vm.onClickJoin = onClickJoin;
    vm.onClickPrepareAndJoin = onClickPrepareAndJoin;
    vm.onClickPrepareQR = onClickPrepareQR;
    vm.onClickJoinQR = onClickJoinQR;
    vm.onClickPrepareAndJoinQR = onClickPrepareAndJoinQR;
    vm.onClickKillLastCreatedSession = onClickKillLastCreatedSession;
    vm.onClickPrettyPrepareAndJoin = onClickPrettyPrepareAndJoin;
    vm.onClickPrettyJoin = onClickPrettyJoin;
    vm.onClickPrettyPrepare = onClickPrettyPrepare;
    vm.getPrettyPrepareAndJoinStyle = getPrettyPrepareAndJoinStyle;
    vm.getPrettyJoinStyle = getPrettyJoinStyle;
    vm.getPrettyPrepareStyle = getPrettyPrepareStyle;


    //#################################################
    //# WATCHERS
    //#################################################

    //Form Change watcher > change URL
    var watchedFields = [
      'ugCtrl.collabSessionID',
      'ugCtrl.isPredefinedServer',
      'ugCtrl.serverOptionCustom',
      'ugCtrl.serverOption',
      'ugCtrl.isPredefinedDataLoadingServer',
      'ugCtrl.dataloadingServerOptionCustom',
      'ugCtrl.dataloadingServerOption',
      'ugCtrl.studyOption',
      'ugCtrl.studyIdsOption.length',
      'ugCtrl.isPredefinedStudy',
      'ugCtrl.isAdvancedVisible',
      'ugCtrl.modalities.length',
      'ugCtrl.bodyParts.length',
      'ugCtrl.templateOption',
      'ugCtrl.customParameters.length',
      'ugCtrl.logLevelOption',
      'ugCtrl.isDevelopment',
      'ugCtrl.isHttps',
      'ugCtrl.isWaitForStart'
    ];
    for (var i = 0; i < watchedFields.length; i++) {
      createFormChangeWatcher($scope, watchedFields[i]);
    }

    //Form Change watcher > Shared daba : baseUrl + collabSessionID
    var sharedDataEffectFields = [
      'ugCtrl.collabSessionID',
      'ugCtrl.isPredefinedServer',
      'ugCtrl.serverOptionCustom',
      'ugCtrl.serverOption',
      'ugCtrl.isHttps'
    ];
    for (var j = 0; j < sharedDataEffectFields.length; j++) {
      $scope.$watch(sharedDataEffectFields[j], function (newValue, oldValue) {
        if (newValue !== oldValue) {
          SharingService.sendMessageToMonitor(getBaseUrl(), vm.collabSessionID);
        }
      }, true);
    }

    //Server Change watcher > change solutionServer
    $scope.$watch('ugCtrl.serverOption', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        vm.dataloadingServerOption = vm.serverOption;
      }
    }, true);

    //Pretty URLShowcase watcher > render prettyUrlShowcase
    $scope.$watch('ugCtrl.isUrlShowcaseFormated', function (newValue, oldValue) {
      if (newValue !== oldValue) {
        vm.urlShowcase = getPrettyShareSessionUrl(activePrettyUrlType);
      }
      localStorageService.set('isUrlShowcaseFormated', newValue);
    }, true);

    //#################################################
    //# FUNCTIONS
    //#################################################

    function onClickCollabSessionID() {
      vm.collabSessionID = createCollabSessionID();
    }

    function onClickPrepare() {
      var urlLink = getCreateShareSessionUrl(ComotoConstants.SECURITY_DATA);
      $log.info('UrlGeneratorController > URL: ' + urlLink);
      PlatformService.onPrepareSession(urlLink);
    }

    function onClickJoin() {
      var urlLink = getCreateShareSessionUrl(ComotoConstants.SECURITY_DATA);
      $log.info('UrlGeneratorController > URL: ' + urlLink);
      PlatformService.onJoinSession(urlLink);
    }

    function onClickPrepareAndJoin() {
      var urlLink = getCreateShareSessionUrl(ComotoConstants.SECURITY_DATA);
      $log.info('UrlGeneratorController > URL: ' + urlLink);
      PlatformService.onPrepareAndJoin(urlLink);
    }

    function onClickPrepareQR(e) {
      vm.qrcodeLink = getCreateShareSessionUrl(ComotoConstants.SECURITY_DATA);
      $log.info('UrlGeneratorController > QR-URL: ' + vm.qrcodeLink);
      showDialog(e);
    }

    function onClickJoinQR(e) {
      vm.qrcodeLink = getCreateShareSessionUrl(ComotoConstants.SECURITY_DATA);
      $log.info('UrlGeneratorController > QR-URL: ' + vm.qrcodeLink);
      showDialog(e);
    }

    function onClickPrepareAndJoinQR(e) {
      vm.qrcodeLink = getCreateShareSessionUrl(ComotoConstants.SECURITY_DATA);
      $log.info('UrlGeneratorController > QR-URL: ' + vm.qrcodeLink);
      showDialog(e);
    }

    function onClickKillLastCreatedSession() {
      var killUrl = 'SECURITY_DATA';
      $http.get(killUrl)
        .then(function onSuccess() {
          $log.info('UrlGeneratorController > KILLED!!');
        }, function onError(e) {
          $log.error('UrlGeneratorController > ERROR');
          $log.error(e);
        });
    }

    function onClickPrettyPrepareAndJoin() {
      activePrettyUrlType = ComotoConstants.SECURITY_DATA;
      vm.urlShowcase = getPrettyShareSessionUrl(activePrettyUrlType);
    }

    function onClickPrettyJoin() {
      activePrettyUrlType = ComotoConstants.SECURITY_DATA;
      vm.urlShowcase = getPrettyShareSessionUrl(activePrettyUrlType);
    }

    function onClickPrettyPrepare() {
      activePrettyUrlType = ComotoConstants.SECURITY_DATA;
      vm.urlShowcase = getPrettyShareSessionUrl(activePrettyUrlType);
    }

    function getPrettyJoinStyle() {
      return activePrettyUrlType === ComotoConstants.SECURITY_DATA ? 'active' : '';
    }

    function getPrettyPrepareAndJoinStyle() {
      return activePrettyUrlType === ComotoConstants.SECURITY_DATA ? 'active' : '';
    }

    function getPrettyPrepareStyle() {
      return activePrettyUrlType === ComotoConstants.SECURITY_DATA ? 'active' : '';
    }

    function showDialog(e) {
      $mdDialog.show({
        templateUrl: 'app/url-generator/url-generator_qrcode-dialog.html',
        controller: (function () {
          var link = vm.qrcodeLink;
          return function () {
            var vm = this;
            vm.qrcodeLink = link;
          };
        })(),
        controllerAs: 'dialogCtrl',
        clickOutsideToClose: true,
        targetEvent: e
      });
    }

    /**
     * Check if key is in localStorage (null check), if not return default value
     * @param localStorageKey key
     * @param defaultValue backup value
     */
    function getFromLocalStorage(localStorageKey, defaultValue) {
      var localStorageValue = localStorageService.get(localStorageKey);
      return (localStorageValue !== null) ? localStorageValue : defaultValue;
    }

    function createFormChangeWatcher(scope, fieldName) {
      scope.$watch(fieldName, function (newValue, oldValue) {
        //generate output only on change
        if (newValue !== oldValue) {
          vm.urlShowcase = getPrettyShareSessionUrl(activePrettyUrlType);
        }

        //store base value, in init and also on change
        var localStorageKey;
        var localStorageValue = newValue;
        var indexOfLengthString = fieldName.lastIndexOf('.length');
        if (indexOfLengthString > -1) {
          localStorageKey = fieldName.substring(7, indexOfLengthString);
          localStorageValue = vm[localStorageKey];
        } else {
          localStorageKey = fieldName.substring(7);
        }
        localStorageService.set(localStorageKey, localStorageValue);
      }, true);
    }

    function getBaseUrl() {
      var protocol = vm.isHttps ? 'https' : 'http';
      var port = vm.isHttps ? 'SECURITY_DATA' : 'SECURITY_DATA';
      var server;
      if (vm.isPredefinedServer) {
        server = vm.serverValues[vm.serverOption][1];
      } else {
        server = vm.serverOptionCustom;
      }
      return protocol + '://' + server + ':' + port + ComotoConstants.SECURITY_DATA;
    }

    function getParamStudyUID() {
      return vm.isPredefinedStudy ? vm.studyOption : encodeURIComponent(vm.studyIdsOption.join(','));
    }

    function getParamWaitForStart() {
      return vm.isWaitForStart ? 'true' : 'false';
    }

    function getParamBodyParts() {
      return encodeURIComponent(vm.bodyParts.join(','));
    }

    function getParamModalities() {
      return encodeURIComponent(vm.modalities.join(','));
    }

    function getPrettyShareSessionUrl(type) {
      var htmlVar = getBaseUrl() + ComotoConstants.SECURITY_DATA;
      htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
      htmlVar += '?' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, type);
      htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
      htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, ComotoConstants.SECURITY_DATA);
      htmlVar += vm.isUrlShowcaseFormated ? '</br></br>' : '';
      htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, vm.collabSessionID);

      if (type === ComotoConstants.SECURITY_DATA || type === ComotoConstants.SECURITY_DATA) {
        htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
        htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, ComotoConstants.SECURITY_DATA);

        var solutionServer = vm.isPredefinedDataLoadingServer ? vm.serverValues[vm.dataloadingServerOption][1] : vm.dataloadingServerOptionCustom;
        htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
        htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, solutionServer);
        htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
        htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, solutionServer);
        htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
        htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, ComotoConstants.SECURITY_DATA);

        htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
        htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, (vm.isPredefinedServer ? vm.serverValues[vm.serverOption][2] : 'SECURITY_DATA'));
        htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
        htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, ComotoConstants.SECURITY_DATA);
        htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
        htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, ComotoConstants.SECURITY_DATA);

        htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
        htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, ComotoConstants.SECURITY_DATA);

        var studyId = getParamStudyUID();
        if (studyId) {
          htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
          htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, studyId);
        }

        if (vm.modalities.length > 0) {
          htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
          htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, getParamModalities());
        }
        if (vm.bodyParts.length > 0) {
          htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
          htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, getParamBodyParts());
        }

        if (vm.templateOption !== 'SECURITY_DATA') {
          htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
          htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, vm.templateOption);
        }

        if (vm.customParameters.length > 0) {
          htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
          var params = getCustomParamsPairs();
          for (var iParams = 0; iParams < params.length; iParams++) {
            var paramPair = params[iParams];
            htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
            htmlVar += '&' + createPrettyParamHtml(paramPair.key, paramPair.value);
          }
        }

      }

      if (type !== ComotoConstants.SECURITY_DATA) {
        if (vm.logLevelOption !== 'NONE') {
          htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
          htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, vm.logLevelOption);
        }
        if (vm.isDevelopment) {
          htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
          htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, ComotoConstants.SECURITY_DATA);
        }
        if (vm.isWaitForStart) {
          htmlVar += vm.isUrlShowcaseFormated ? '</br>' : '';
          htmlVar += '&' + createPrettyParamHtml(ComotoConstants.SECURITY_DATA, getParamWaitForStart());
        }
      }

      return $sce.trustAsHtml(htmlVar);
    }

    function getCreateShareSessionUrl(type) {
      var urlLink = getBaseUrl() + ComotoConstants.SECURITY_DATA;
      urlLink += '?' + ComotoConstants.SECURITY_DATA + '=' + type;
      urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + ComotoConstants.SECURITY_DATA;
      urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + vm.collabSessionID;

      if (type === ComotoConstants.SECURITY_DATA || type === ComotoConstants.SECURITY_DATA) {

        urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + ComotoConstants.SECURITY_DATA;

        var solutionServer = vm.isPredefinedDataLoadingServer ? vm.serverValues[vm.dataloadingServerOption][1] : vm.dataloadingServerOptionCustom;
        urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + solutionServer;
        urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + solutionServer;
        urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + ComotoConstants.SECURITY_DATA;

        urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + (vm.isPredefinedServer ? vm.serverValues[vm.serverOption][2] : 'SECURITY_DATA');
        urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + ComotoConstants.SECURITY_DATA;
        urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + ComotoConstants.SECURITY_DATA;

        urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + ComotoConstants.SECURITY_DATA;

        var studyId = getParamStudyUID();
        if (studyId) {
          urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + studyId;
        }

        if (vm.modalities.length > 0) {
          urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + getParamModalities();
        }
        if (vm.bodyParts.length > 0) {
          urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + getParamBodyParts();
        }

        if (vm.templateOption !== 'SECURITY_DATA') {
          urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + vm.templateOption;
        }

        if (vm.customParameters.length > 0) {
          var params = getCustomParamsPairs();
          for (var iParams = 0; iParams < params.length; iParams++) {
            var paramPair = params[iParams];
            urlLink += '&' + paramPair.key + '=' + paramPair.value;
          }
        }
      }

      if (type !== ComotoConstants.SECURITY_DATA) {
        if (vm.logLevelOption !== 'SECURITY_DATA') {
          urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + vm.logLevelOption;
        }
        if (vm.isDevelopment) {
          urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + ComotoConstants.SECURITY_DATA;
        }
        if (vm.isWaitForStart) {
          urlLink += '&' + ComotoConstants.SECURITY_DATA + '=' + getParamWaitForStart();
        }
      }

      return urlLink
    }

    function getCustomParamsPairs() {
      var pairs = [];
      for (var i = 0; i < vm.customParameters.length; i++) {
        var chipString = vm.customParameters[i];
        var dividerIndex = chipString.indexOf('=');
        var rawPair = chipString.split('=');
        if (rawPair.length === 2 && 0 < dividerIndex && dividerIndex < (chipString.length - 1)) {
          pairs.push({
            key: rawPair[0],
            value: rawPair[1]
          })
        }
      }
      return pairs;
    }

    $log.debug('UrlGeneratorController init');
  } //UrlGeneratorController

  function createCollabSessionID() {
    return Math.random().toString(36);
  }

  function createPrettyParamHtml(name, value) {
    return '<b class=\'param\'>' + name + '</b>=' + value;
  }

})();
