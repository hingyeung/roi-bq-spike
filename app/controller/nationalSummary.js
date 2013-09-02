'use strict';

angular.module('roiBigQuerySpike')
  .controller('NationalsummaryCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {
    var fetchRecentImpressionsForBusiness = function() {
      var promise = Roiservice.fetchRecentImpressionsForBusiness($scope.businessName);
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);
        $scope.recentTotalImpressionsChart = Roiservice.makeChartData('ColumnChart');
        $scope.recentTotalImpressionsChart.options.vAxis.title = "Total Appearences";
        var cols = [{id: "date", label: "Date", type: "string"}, {id:"count", label:"Count", type:"number"}]
          , rows = [];
        for (var idx = 0; idx < data.length; idx++) {
          rows.push({c: [ { v: data[idx].month + "/" + data[idx].year }, { v: data[idx].impression_count } ]});
        }
        $scope.recentTotalImpressionsChart.data = {rows: rows, cols: cols};
        $scope.recentTotalImpressionsChart.query = resp.query;
        $scope.recentTotalImpressionsChart.cacheHit = resp.cacheHit;
        $scope.recentTotalImpressionsChart.options.title = 'Recent Appearences for ' + $scope.businessName;
        $scope.lastMonthTotalImpressions = data[data.length - 1].impression_count;
      }).error(function(resp, status, headers, config) {
        console.log('Failed to download recent impressions');
      });
    };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.businessName) return;

      fetchRecentImpressionsForBusiness();
    });
  }]);
