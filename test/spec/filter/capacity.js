'use strict';

describe('Filter: capacity', function () {

  // load the filter's module
  beforeEach(module('yeomanTestDeleteMeApp'));

  // initialize a new instance of the filter before each test
  var capacity;
  beforeEach(inject(function ($filter) {
    capacity = $filter('capacity');
  }));

  it('should return the input prefixed with "capacity filter:"', function () {
    var text = 'angularjs';
    expect(capacity(text)).toBe('capacity filter: ' + text);
  });

});
