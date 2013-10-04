'use strict';

describe('Service: globalState', function () {

  // load the service's module
  beforeEach(module('stylesApp'));

  // instantiate service
  var globalState;
  beforeEach(inject(function (_globalState_) {
    globalState = _globalState_;
  }));

  it('should do something', function () {
    expect(!!globalState).toBe(true);
  });

});
