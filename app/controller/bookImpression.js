'use strict';

angular.module('roiBigQuerySpike')
  .controller('BookimpressionCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {
    var fetchDataToListImpressionsByBookAndChannelFromLastMonth = function() {
      var lastMonth = Roiservice.dateOffsetByMonth(-1);
    }
  }]);
