'use strict';

describe('Controller: BookimpressionCtrl', function () {

  // load the controller's module
  beforeEach(module('roiBigQuerySpikeApp'));

  var BookimpressionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BookimpressionCtrl = $controller('BookimpressionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
