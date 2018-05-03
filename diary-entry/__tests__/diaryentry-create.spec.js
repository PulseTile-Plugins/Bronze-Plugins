import DiaryentriesCreateComponent from '../diaryentry-create.component';

describe('Diaryentry Create', function() {

    beforeEach(angular.mock.module('ripple-ui'));

    let scope, ctrl, controller, template, state;

    beforeEach(inject(($injector, $controller, _$state_, _$stateParams_, _$ngRedux_, _diaryentriesActions_, _serviceRequests_) => {
        controller = $controller;
        scope = $injector.get('$rootScope').$new();
        state = _$state_;

        template = DiaryentriesCreateComponent.template;
        ctrl = controller(DiaryentriesCreateComponent.controller, {
            $scope: scope,
            $state: state,
            $stateParams: _$stateParams_,
            $ngRedux: _$ngRedux_,
            diaryentriesActions: _diaryentriesActions_,
            serviceRequests: _serviceRequests_
        });
    }));

    beforeEach(function() {
      spyOn(ctrl, 'goList');
      spyOn(ctrl, 'cancel');
      spyOn(ctrl, 'setCurrentPageData');
      spyOn(scope, 'actionLoadList');
      spyOn(scope, 'actionCreateDetail');
      spyOn(scope, 'create');

      ctrl.goList();
      ctrl.cancel();
      ctrl.setCurrentPageData();
      scope.actionLoadList();
      scope.actionCreateDetail();
      scope.create();
    });

    it('Template exist', function() {
      expect(template).toBeDefined();
    });
    it('goList was called', function() {
      expect(ctrl.goList).toHaveBeenCalled();
    });
    it('cancel was called', function() {
      expect(ctrl.cancel).toHaveBeenCalled();
    });
    it('setCurrentPageData was called', function() {
      expect(ctrl.setCurrentPageData).toHaveBeenCalled();
    });

    it('actionLoadList was called', function() {
      expect(scope.actionLoadList).toHaveBeenCalled();
    });
    it('actionCreateDetail was called', function() {
      expect(scope.actionCreateDetail).toHaveBeenCalled();
    });
    it('create was called', function() {
      expect(scope.create).toHaveBeenCalled();
    });
});
