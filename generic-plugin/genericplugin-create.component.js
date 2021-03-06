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

let templateGenericpluginCreate = require('./genericplugin-create.html');

class GenericpluginCreateController {
  constructor($scope, $state, $stateParams, $ngRedux, genericpluginActions, serviceRequests, serviceFormatted) {
    $scope.actionLoadList = genericpluginActions.all;
    $scope.actionCreateDetail = genericpluginActions.create;

    $scope.genericplugin = {};
    $scope.genericplugin.dateCreated = new Date().toISOString().slice(0, 10);

    this.goList = function () {
      $state.go('genericplugin', {
        patientId: $stateParams.patientId,
        reportType: $stateParams.reportType,
        searchString: $stateParams.searchString,
        queryType: $stateParams.queryType
      });
    };
    
    this.cancel = function () {
      this.goList();
    };
    
    $scope.create = function (genericPluginForm, genericPlugin) {
      $scope.formSubmitted = true;

      if (genericPluginForm.$valid) {
        let toAdd = {
          noteType: genericPlugin.noteType,
          notes: genericPlugin.notes,
          dateCreated: genericPlugin.dateCreated,
          author: genericPlugin.author,
          source: 'openehr'
        };
        serviceFormatted.propsToString(toAdd, 'dateCreated');
        $scope.actionCreateDetail($stateParams.patientId, toAdd);
      }
    }.bind(this);

    this.setCurrentPageData = function (data) {
      if (data.genericplugin.dataCreate !== null) {
        $scope.actionLoadList($stateParams.patientId);
        this.goList();
      }
      if (serviceRequests.currentUserData) {
        $scope.currentUser = serviceRequests.currentUserData;
        $scope.genericplugin.author = $scope.currentUser.email;
      }
    };

    let unsubscribe = $ngRedux.connect(state => ({
      getStoreData: this.setCurrentPageData(state)
    }))(this);
    $scope.$on('$destroy', unsubscribe);
  }
}

const GenericpluginCreateComponent = {
  template: templateGenericpluginCreate,
  controller: GenericpluginCreateController
};

GenericpluginCreateController.$inject = ['$scope', '$state', '$stateParams', '$ngRedux', 'genericpluginActions', 'serviceRequests', 'serviceFormatted'];
export default GenericpluginCreateComponent;
