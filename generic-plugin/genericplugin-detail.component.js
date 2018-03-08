/*
  ~  Copyright 2017 Ripple Foundation C.I.C. Ltd
  ~  
  ~  Licensed under the Apache License, Version 2.0 (the "License");
  ~  you may not use this file except in compliance with the License.
  ~  You may obtain a copy of the License at
  ~  
  ~    http://www.apache.org/licenses/LICENSE-2.0

  ~  Unless required by applicable law or agreed to in writing, software
  ~  distributed under the License is distributed on an "AS IS" BASIS,
  ~  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  ~  See the License for the specific language governing permissions and
  ~  limitations under the License.
*/

let templateGenericpluginDetail = require('./genericplugin-detail.html');

class GenericpluginDetailController {
  constructor($scope, $state, $stateParams, $ngRedux, genericpluginActions, serviceRequests, usSpinnerService, serviceFormatted) {
    this.actionLoadList = genericpluginActions.all;
    this.actionLoadDetail = genericpluginActions.get;
    $scope.actionUpdateDetail = genericpluginActions.update;

    usSpinnerService.spin('detail-spinner');
    this.actionLoadDetail($stateParams.patientId, $stateParams.detailsIndex);

    //Edit Generic Plugin
    $scope.isEdit = false;

    /* istanbul ignore next  */
    this.edit = function () {
      $scope.isEdit = true;
      $scope.genericpluginEdit = Object.assign({}, this.genericplugin);
      $scope.genericpluginEdit.dateCreated = new Date(this.genericplugin.dateCreated);
    };

    this.cancelEdit = function () {
      $scope.isEdit = false;
    };

    $scope.confirmEdit = function (genericPluginForm, genericPlugin) {
      $scope.formSubmitted = true;

      /* istanbul ignore if  */
      if (genericPluginForm.$valid) {
        let toUpdate = {
          noteType: genericPlugin.noteType,
          notes: genericPlugin.notes,
          author: genericPlugin.author,
          source: genericPlugin.source,
          sourceId: genericPlugin.sourceId,
          dateCreated: new Date().getTime()
        };

        $scope.isEdit = false;
        serviceFormatted.propsToString(toUpdate, 'dateCreated');
        $scope.actionUpdateDetail($stateParams.patientId, genericPlugin.sourceId, toUpdate);
      }
    };

    this.setCurrentPageData = function (store) {
      const state = store.genericplugins;
      const { patientId, detailsIndex } = $stateParams;

      // Get Details data
      if (state.dataGet) {
        this.genericplugin = state.dataGet;
        this.dateCreated = moment(this.genericplugin.dateCreated).format('DD-MMM-YYYY');
        (detailsIndex === state.dataGet.sourceId) ? usSpinnerService.stop('detail-spinner') : null;
      }

      // Update Detail
      if (state.dataUpdate !== null) {
        // After Update we request all list firstly
        this.actionLoadList(patientId);
      }
      if (state.isUpdateProcess) {
        usSpinnerService.spin('detail-update-spinner');
        if (!state.dataGet && !state.isGetFetching) {
          // We request detail when data is empty
          // Details are cleared after request LoadAll list
          this.actionLoadDetail(patientId, detailsIndex);
        }
      } else {
        usSpinnerService.stop('detail-update-spinner');
      }
      if (serviceRequests.currentUserData) {
        this.currentUser = serviceRequests.currentUserData;
      }

      if (state.error) {
        usSpinnerService.stop('detail-spinner');
        usSpinnerService.stop('detail-update-spinner');
      }
    };

    let unsubscribe = $ngRedux.connect(state => ({
      getStoreData: this.setCurrentPageData(state)
    }))(this);
    $scope.$on('$destroy', unsubscribe);
  }
}

const GenericpluginDetailComponent = {
  template: templateGenericpluginDetail,
  controller: GenericpluginDetailController
};

GenericpluginDetailController.$inject = ['$scope', '$state', '$stateParams', '$ngRedux', 'genericpluginActions', 'serviceRequests', 'usSpinnerService'];
export default GenericpluginDetailComponent;