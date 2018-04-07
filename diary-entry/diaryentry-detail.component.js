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
let templateDiaryentriesDetail = require('./diaryentry-detail.html');

class DiaryentriesDetailController {
  constructor($scope, $state, $stateParams, $ngRedux, diaryentriesActions, serviceRequests, usSpinnerService, serviceFormatted) {
    this.actionLoadList = diaryentriesActions.all;
    this.actionLoadDetail = diaryentriesActions.get;
    $scope.actionUpdateDetail = diaryentriesActions.update;

    $scope.diaryEntryTypes = entryTypes.defaultEntryTypes;

    usSpinnerService.spin('detail-spinner');
    this.actionLoadDetail($stateParams.patientId, $stateParams.detailsIndex);

    //Edit Diary Entry
    $scope.isEdit = false;

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

    /* istanbul ignore next  */
    this.edit = function () {
      $scope.isEdit = true;
      $scope.diaryentryEdit = Object.assign({}, this.diaryentry);

      $scope.diaryentryEdit.dateCreated = new Date(this.diaryentry.dateCreated);
    };

    this.cancelEdit = function () {
      $scope.isEdit = false;
    };

    $scope.confirmEdit = function (diaryentryForm, diaryEntries) {
      $scope.formSubmitted = true;

      /* istanbul ignore if  */
      if (diaryentryForm.$valid) {
        let toUpdate = {
          noteType: diaryEntries.noteType,
          notes: diaryEntries.notes,
          author: diaryEntries.author,
          source: diaryEntries.source,
          sourceId: diaryEntries.sourceId,
          dateCreated: new Date().getTime()
        };

        $scope.isEdit = false;
        serviceFormatted.propsToString(toUpdate, 'dateCreated');
        $scope.actionUpdateDetail($stateParams.patientId, diaryEntries.sourceId, toUpdate);
      }
    };

    this.setCurrentPageData = function (store) {
      const state = store.diaryentries;
      const { patientId, detailsIndex } = $stateParams;

      // TODO: remove this
      state.dataGet = {
        sourceId: 1,
        author: "bob.smith@gmail.com",
        dateCreated: "2018-04-07",
        noteType: "Exam Report",
        notes: "qwe",
        source: "openehr"
      };

      // Get Details data
      if (state.dataGet) {
        this.diaryentry = state.dataGet;
        this.dateCreated = moment(this.diaryentry.dateCreated).format('DD-MMM-YYYY');
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

const DiaryentriesDetailComponent = {
  template: templateDiaryentriesDetail,
  controller: DiaryentriesDetailController
};

DiaryentriesDetailController.$inject = ['$scope', '$state', '$stateParams', '$ngRedux', 'diaryentriesActions', 'serviceRequests', 'usSpinnerService', 'serviceFormatted'];
export default DiaryentriesDetailComponent;
