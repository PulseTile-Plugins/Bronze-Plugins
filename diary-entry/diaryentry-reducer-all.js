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

import * as types from './action-types';

const INITIAL_STATE = {
  isFetching: false,
  error: false,
  data: null,
  dataGet: null,
  isGetFetching: false,
  dataCreate: null,
  dataUpdate: null,
  isUpdateProcess: false,
  patientId: null
};

export default function diaryentries(state = INITIAL_STATE, action) {
  const {payload} = action;

  var actions = {
    [types.DIATY_ENTRIES]: (state) => {
      state.dataCreate = null;
      state.dataUpdate = null;
      return Object.assign({}, state, {
        isFetching: true,
        error: false
      });
    },
    [types.DIATY_ENTRIES_SUCCESS]: (state) => {
      if (state.isUpdateProcess) {
        state.dataGet = null;
      }
      return Object.assign({}, state, {
        isFetching: false,
        data: payload.response,
        patientId: payload.meta.patientId,
      });
    },
    [types.DIATY_ENTRIES_ERROR]: (state) => {
      return Object.assign({}, state, {
        isFetching: false,
        error: payload.error
      });
    },
    [types.DIATY_ENTRIES__CLEAR]: (state) => {
      return Object.assign({}, state, {
        error: false,
      });
    },

    [types.DIATY_ENTRIES_GET]: (state) => {
      return Object.assign({}, state, {
        isFetching: true,
        isGetFetching: true,
        error: false
      });
    },
    [types.DIATY_ENTRIES_GET_SUCCESS]: (state) => {
      state.dataUpdate = null;
      return Object.assign({}, state, {
        isUpdateProcess: false,
        isFetching: false,
        isGetFetching: false,
        error: false,
        dataGet: payload.response
      });
    },
    [types.DIATY_ENTRIES_GET_ERROR]: (state) => {
      return Object.assign({}, state, {
        isUpdateProcess: false,
        isFetching: false,
        isGetFetching: false,
        error: payload.error
      });
    },

    [types.DIATY_ENTRIES_CREATE]: (state) => {
      return Object.assign({}, state, {
        isFetching: true,
        error: false
      });
    },
    [types.DIATY_ENTRIES_CREATE_SUCCESS]: (state) => {
      return Object.assign({}, state, {
        isFetching: false,
        dataCreate: payload.response
      });
    },
    [types.DIATY_ENTRIES_CREATE_ERROR]: (state) => {
      return Object.assign({}, state, {
        isFetching: false,
        error: payload.error
      });
    },
    [types.DIATY_ENTRIES_UPDATE]: (state) => {
      return Object.assign({}, state, {
        isUpdateProcess: true,
        isFetching: true,
        error: false
      });
    },
    [types.DIATY_ENTRIES_UPDATE_SUCCESS]: (state) => {
      return Object.assign({}, state, {
        isFetching: false,
        dataUpdate: payload.response
      });
    },
    [types.DIATY_ENTRIES_UPDATE_ERROR]: (state) => {
      return Object.assign({}, state, {
        isFetching: false,
        error: payload.error
      });
    }
  };

  return actions[action.type] ?
    actions[action.type](state) :
    state;
}
