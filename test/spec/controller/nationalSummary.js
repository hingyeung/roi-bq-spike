'use strict';

describe('Controller: NationalsummaryCtrl', function () {

  // load the controller's module
  beforeEach(module('roiBigQuerySpikeApp'));

  var NationalsummaryCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    NationalsummaryCtrl = $controller('NationalsummaryCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
