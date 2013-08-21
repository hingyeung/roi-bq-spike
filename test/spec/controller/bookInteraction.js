'use strict';

describe('Controller: BookinteractionCtrl', function () {

  // load the controller's module
  beforeEach(module('roiBigQuerySpike'));

  var BookinteractionCtrl,
    scope;

  // Initialize the controller and a mock scope
  beforeEach(inject(function ($controller, $rootScope) {
    scope = $rootScope.$new();
    BookinteractionCtrl = $controller('BookinteractionCtrl', {
      $scope: scope
    });
  }));

  it('should attach a list of awesomeThings to the scope', function () {
    expect(scope.awesomeThings.length).toBe(3);
  });
});
