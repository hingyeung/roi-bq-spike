'use strict';

describe('Service: roiService', function () {

  // load the service's module
  beforeEach(module('roiBigQuerySpikeApp'));

  // instantiate service
  var roiService;
  beforeEach(inject(function (_roiService_) {
    roiService = _roiService_;
  }));

  it('should do something', function () {
    expect(!!roiService).toBe(true);
  });

});
