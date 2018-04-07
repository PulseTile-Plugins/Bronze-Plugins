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

import { bindActionCreators } from 'redux';
import * as types from './action-types';

export function clear() {
  return { type: types.DIATY_ENTRIES__CLEAR }
}
export function all(patientId) {
  return {
    types: [types.DIATY_ENTRIES, types.DIATY_ENTRIES_SUCCESS, types.DIATY_ENTRIES_ERROR],

    shouldCallAPI: (state) => !state.diaryentries.response,

    config: {
      method: 'get',
      url: '/api/patients/' + patientId + '/diaryentries'
    },

    meta: {
      patientId: patientId,
      timestamp: Date.now()
    }
  };
}
export function get(patientId, compositionId, source) {
  return {
    types: [types.DIATY_ENTRIES_GET, types.DIATY_ENTRIES_GET_SUCCESS, types.DIATY_ENTRIES_GET_ERROR],

    shouldCallAPI: (state) => !state.diaryentries.response,

    config: {
      method: 'get',
      url: '/api/patients/' + patientId + '/diaryentries/' + compositionId
    },

    meta: {
      timestamp: Date.now()
    }
  };
}
export function create(patientId, composition) {
  return {
    types: [types.DIATY_ENTRIES_CREATE, types.DIATY_ENTRIES_CREATE_SUCCESS, types.DIATY_ENTRIES_CREATE_ERROR],

    shouldCallAPI: (state) => !state.diaryentries.response,

    config: {
      method: 'post',
      url: '/api/patients/' + patientId + '/diaryentries',
      data: composition
    },

    meta: {
      timestamp: Date.now()
    }
  };
}
export function update(patientId, sourceId, composition) {
  return {
    types: [types.DIATY_ENTRIES_UPDATE, types.DIATY_ENTRIES_UPDATE_SUCCESS, types.DIATY_ENTRIES_UPDATE_ERROR],

    shouldCallAPI: (state) => !state.diaryentries.response,

    config: {
      method: 'put',
      url: '/api/patients/' + patientId + '/diaryentries/' + sourceId,
      data: composition
    },

    meta: {
      timestamp: Date.now()
    }
  };
}

export default function diaryentriesActions($ngRedux) {
  let actionCreator = {
    all, clear, get, create, update
  };

  return bindActionCreators(actionCreator, $ngRedux.dispatch);
}

diaryentriesActions.$inject = ['$ngRedux'];
