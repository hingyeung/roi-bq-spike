'use strict';

describe('Controller: StaterollupCtrl', function () {

  // load the controller's module
  beforeEach(module('roiBigQuerySpikeApp'));

  var StaterollupCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    StaterollupCtrl = $controller('StaterollupCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
