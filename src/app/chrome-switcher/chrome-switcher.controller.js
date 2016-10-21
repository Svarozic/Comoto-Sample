/**
 * Created by Ing. Peter Petraník
 */

(function () {
  'use strict';

  angular.module('comoto-sample.chromeSwitcher')
    .controller('ChromeSwitcherController', ChromeSwitcherController);

  /** @ngInject */
  function ChromeSwitcherController() {
    /**
     * csCtrl
     */
    var vm = this;

    vm.isGeneratorVisible = true;

    vm.onClickSwitchBtn = onClickSwitchBtn;

    function onClickSwitchBtn() {
      vm.isGeneratorVisible = !vm.isGeneratorVisible;
    }
  }

})();
