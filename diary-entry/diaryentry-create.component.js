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

let entryTypes = require('./entry-types');
let templateDiaryentriesCreate = require('./diaryentry-create.html');

class DiaryentriesCreateController {
  constructor($scope, $state, $stateParams, $ngRedux, diaryentriesActions, serviceRequests, serviceFormatted) {
    $scope.actionLoadList = diaryentriesActions.all;
    $scope.actionCreateDetail = diaryentriesActions.create;

    $scope.diaryEntryTypes = entryTypes.defaultEntryTypes;

    $scope.diaryentry = {};
    $scope.diaryentry.dateCreated = new Date().toISOString().slice(0, 10);
    $scope.recognitionStarted = false;
    $scope.hasSpeechRecognition = false;

    try {
      let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.recognition.lang = 'en-US';
      this.recognition.continuous = true;
      $scope.hasSpeechRecognition = true;
    } catch(error) {
      console.error(error);
    }

    if ($scope.hasSpeechRecognition) {
      this.recognition.onstart = function() {
        console.log('Voice recognition activated. Try speaking into the microphone.');
      }

      this.recognition.onspeechend = function() {
        console.log('You were quiet for a while so voice recognition turned itself off.');
      }

      this.recognition.onerror = function(event) {
        if(event.error == 'no-speech') {
          console.log('No speech was detected. Try again.');
        }
      }

      this.recognition.onresult = function(event) {
        var current = event.resultIndex;
        var transcript = event.results[current][0].transcript;

        if (!$scope.diaryentryEdit || !$scope.diaryentryEdit.notes) {
          $scope.diaryentryEdit.notes = '';
        }
        $scope.diaryentryEdit.notes += transcript;
        $scope.$apply();
      }
    }

    $scope.startSpeach = () => {
      if ($scope.hasSpeechRecognition && !$scope.recognitionStarted) {
        $scope.recognitionStarted = true;
        this.recognition.start();
      }
    }

    $scope.stopSpeach = () => {
      if ($scope.hasSpeechRecognition && $scope.recognitionStarted) {
        $scope.recognitionStarted = false;
        this.recognition.stop();
      }
    }

    this.goList = function () {
      $state.go('diaryentries', {
        patientId: $stateParams.patientId,
        reportType: $stateParams.reportType,
        searchString: $stateParams.searchString,
        queryType: $stateParams.queryType
      });
    };

    this.cancel = function () {
      this.goList();
    };

    $scope.create = function (diaryentryForm, diaryentries) {
      $scope.formSubmitted = true;

      if (diaryentryForm.$valid) {
        let toAdd = {
          noteType: diaryentries.noteType,
          notes: diaryentries.notes,
          dateCreated: diaryentries.dateCreated,
          author: diaryentries.author,
          source: 'openehr'
        };
        serviceFormatted.propsToString(toAdd, 'dateCreated');
        $scope.actionCreateDetail($stateParams.patientId, toAdd);
      }
    }.bind(this);

    this.setCurrentPageData = function (data) {
      if (data.diaryentries.dataCreate !== null) {
        $scope.actionLoadList($stateParams.patientId);
        this.goList();
      }
      if (serviceRequests.currentUserData) {
        $scope.currentUser = serviceRequests.currentUserData;
        $scope.diaryentry.author = $scope.currentUser.email;
      }
    };

    let unsubscribe = $ngRedux.connect(state => ({
      getStoreData: this.setCurrentPageData(state)
    }))(this);
    $scope.$on('$destroy', unsubscribe);
  }
}

const DiaryentriesCreateComponent = {
  template: templateDiaryentriesCreate,
  controller: DiaryentriesCreateController
};

DiaryentriesCreateController.$inject = ['$scope', '$state', '$stateParams', '$ngRedux', 'diaryentriesActions', 'serviceRequests', 'serviceFormatted'];
export default DiaryentriesCreateComponent;
