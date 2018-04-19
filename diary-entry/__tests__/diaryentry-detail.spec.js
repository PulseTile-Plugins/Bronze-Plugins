'use strict';
import DiaryentriesCreateComponent from '../diaryentry-detail.component';

describe('Diaryentry Details', function() {

  beforeEach(angular.mock.module('ripple-ui'));

  let scope, ctrl, controller, template, stateParams, state, ngRedux, diaryentriesActions, usSpinnerService;

  beforeEach(inject(($injector, $controller, _$state_, _$stateParams_, _$ngRedux_, _diaryentriesActions_, _usSpinnerService_) => {
    controller = $controller;
    scope = $injector.get('$rootScope').$new();
    state = _$state_;
    ngRedux = _$ngRedux_;
    stateParams = _$stateParams_;
    diaryentriesActions = _diaryentriesActions_;
    usSpinnerService = _usSpinnerService_;

    template = DiaryentriesCreateComponent.template;
    ctrl = controller(DiaryentriesCreateComponent.controller, {
      $scope: scope,
      $state: state,
      $stateParams: stateParams,
      $ngRedux: ngRedux,
      diaryentriesActions: diaryentriesActions,
      usSpinnerService: usSpinnerService
    });
  }));

  beforeEach(function() {
    spyOn(ctrl, 'actionLoadList');
    spyOn(ctrl, 'actionLoadDetail');
    spyOn(ctrl, 'edit');
    spyOn(ctrl, 'cancelEdit');
    spyOn(ctrl, 'setCurrentPageData');
    spyOn(scope, 'actionUpdateDetail');
    spyOn(scope, 'confirmEdit');

    ctrl.actionLoadList();
    ctrl.actionLoadDetail();
    ctrl.edit();
    ctrl.cancelEdit();
    ctrl.setCurrentPageData();
    scope.actionUpdateDetail();
    scope.confirmEdit();
  });

  it('Template exist', function() {
    expect(template).toBeDefined();
  });
  it('Controller exist', function() {
    expect(ctrl).toBeDefined();
  });

  it('actionLoadList was called', function() {
    expect(ctrl.actionLoadList).toHaveBeenCalled();
  });
  it('actionLoadDetail was called', function() {
    expect(ctrl.actionLoadDetail).toHaveBeenCalled();
  });
  it('edit was called', function() {
    expect(ctrl.edit).toHaveBeenCalled();
  });
  it('cancelEdit was called', function() {
    expect(ctrl.cancelEdit).toHaveBeenCalled();
  });
  it('setCurrentPageData was called', function() {
    expect(ctrl.setCurrentPageData).toHaveBeenCalled();
  });

  it('actionUpdateDetail was called', function() {
    expect(scope.actionUpdateDetail).toHaveBeenCalled();
  });
  it('confirmEdit was called', function() {
    expect(scope.confirmEdit).toHaveBeenCalled();
  });
});
