'use strict';
import DiaryentryListComponent from '../diaryentry-list.component';
import * as types from '../action-types';
import diaryentry from '../diaryentry-actions';

describe('Diaryentry List', function() {

  beforeEach(angular.mock.module('ripple-ui'));

  let scope,
    ctrl,
    controller,
    template,
    stateParams,
    state,
    ngRedux,
    diaryentriesActions,
    serviceRequests,
    usSpinnerService,
    fakeCall,
    actions;

  beforeEach(inject(($injector, $controller, _$state_, _$stateParams_, _$ngRedux_, _diaryentriesActions_, _serviceRequests_, _usSpinnerService_) => {
    controller = $controller;
    scope = $injector.get('$rootScope').$new();
    state = _$state_;
    serviceRequests = _serviceRequests_;
    ngRedux = _$ngRedux_;
    stateParams = _$stateParams_;
    diaryentriesActions = _diaryentriesActions_;
    usSpinnerService = _usSpinnerService_;

    template = DiaryentryListComponent.template;

    ctrl = controller(DiaryentryListComponent.controller, {
      $scope: scope,
      $state: state,
      $stateParams: stateParams,
      $ngRedux: ngRedux,
      diaryentriesActions: diaryentriesActions,
      serviceRequests: serviceRequests,
      usSpinnerService: usSpinnerService
    });

    actions = $injector.get('diaryentriesActions');
    // scope.$digest();
  }));

  beforeEach(function() {
    fakeCall = {
      calldiaryentry: diaryentry
    };

    spyOn(fakeCall, 'calldiaryentry');

    spyOn(ctrl, 'actionLoadList');
    spyOn(ctrl, 'create');
    spyOn(ctrl, 'go');
    spyOn(ctrl, 'setCurrentPageData');

    fakeCall.calldiaryentry({}, types.DIATY_ENTRIES);

    ctrl.actionLoadList();
    ctrl.create();
    ctrl.go();
    ctrl.setCurrentPageData();
  });

  it('Template exist', function() {
    expect(template).toBeDefined();
  });
  it('Controller exist', function() {
    expect(ctrl).toBeDefined();
  });
  it('Include diaryentriesActions in index actions file', function() {
    expect(actions).toBeDefined();
  });
  it('Diaryentry reducer was called', function() {
    expect(fakeCall.calldiaryentry).toHaveBeenCalled();
  });

  it('actionLoadList was called', function() {
    expect(ctrl.actionLoadList).toHaveBeenCalled();
  });
  it('create was called', function() {
    expect(ctrl.create).toHaveBeenCalled();
  });
  it('go was called', function() {
    expect(ctrl.go).toHaveBeenCalled();
  });
  it('setCurrentPageData was called', function() {
    expect(ctrl.setCurrentPageData).toHaveBeenCalled();
  });
});
