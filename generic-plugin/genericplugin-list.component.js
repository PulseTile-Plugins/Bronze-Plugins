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

let templateGenericpluginList = require('./genericplugin-list.html');

class GenericpluginListController {
  constructor($scope, $state, $stateParams, $ngRedux, genericpluginActions, serviceRequests, usSpinnerService, serviceFormatted) {
    serviceRequests.publisher('routeState', {state: $state.router.globals.current.views, breadcrumbs: $state.router.globals.current.breadcrumbs, name: 'patients-details'});
    serviceRequests.publisher('headerTitle', {title: 'Patients Details'});
    genericpluginActions.clear();
    this.actionLoadList = genericpluginActions.all;

    this.isShowCreateBtn = $state.router.globals.$current.name !== 'genericplugin-create';
    this.isShowExpandBtn = $state.router.globals.$current.name !== 'genericplugin';


    this.create = function () {
      $state.go('genericplugin-create', {
        patientId: $stateParams.patientId
      });
    };
    
    this.go = function (id, source) {
      $state.go('genericplugin-detail', {
        patientId: $stateParams.patientId,
        detailsIndex: id,
        page: $scope.currentPage || 1,
        source: source
      });
    };

    this.setCurrentPageData = function (store) {
      const state = store.genericplugins;
      const pagesInfo = store.pagesInfo;
      const pluginName = 'genericPlugin';

      if (serviceRequests.checkIsCanLoadingListData(state, pagesInfo, pluginName, $stateParams.patientId)) {
        this.actionLoadList($stateParams.patientId);
        serviceRequests.setPluginPage(pluginName);
        usSpinnerService.spin('list-spinner');
      }
      if (state.data) {
        this.genericplugins = state.data;

        serviceFormatted.formattingTablesDate(this.genericplugins, ['dateCreated'], serviceFormatted.formatCollection.DDMMMYYYY);
        serviceFormatted.filteringKeys = ['noteType', 'author', 'dateCreated', 'source'];
      }
      if (state.data || state.error) {
        usSpinnerService.stop('list-spinner');
        setTimeout(() => { usSpinnerService.stop('list-spinner') }, 0);
      }
      if (serviceRequests.currentUserData) {
        this.currentUser = serviceRequests.currentUserData;
      }
    };

    let unsubscribe = $ngRedux.connect(state => ({
      getStoreData: this.setCurrentPageData(state)
    }))(this);
    $scope.$on('$destroy', unsubscribe);
  }
}

const GenericpluginListComponent = {
  template: templateGenericpluginList,
  controller: GenericpluginListController
};

GenericpluginListController.$inject = ['$scope', '$state', '$stateParams', '$ngRedux', 'genericpluginActions', 'serviceRequests', 'usSpinnerService', 'serviceFormatted'];
export default GenericpluginListComponent;