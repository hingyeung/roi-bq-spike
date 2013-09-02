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
        $scope.recentTotalImpressionsChart.totalBytesProcessed = resp.totalBytesProcessed;
        $scope.recentTotalImpressionsChart.options.title = 'Recent Appearences for ' + $scope.businessName;
        $scope.lastMonthTotalImpressions = data.length > 0 ? data[data.length - 1].impression_count : 0
      }).error(function(resp, status, headers, config) {
        console.log('Failed to download recent impressions');
      });
    };

    var fetchRecentInteractionsForBusiness = function() {
      var promise = Roiservice.fetchRecentInteractionsForBusiness($scope.businessName);
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);
        $scope.recentTotalInteractionsChart = Roiservice.makeChartData('ColumnChart');
        $scope.recentTotalInteractionsChart.options.vAxis.title = "Total Interactions";
        var cols = [{id: "date", label: "Date", type: "string"}, {id:"count", label:"Count", type:"number"}]
          , rows = [];
        for (var idx = 0; idx < data.length; idx++) {
          rows.push({c: [ { v: data[idx].month + "/" + data[idx].year }, { v: data[idx].action_count } ]});
        }
        $scope.recentTotalInteractionsChart.data = {rows: rows, cols: cols};
        $scope.recentTotalInteractionsChart.query = resp.query;
        $scope.recentTotalInteractionsChart.cacheHit = resp.cacheHit;
        $scope.recentTotalInteractionsChart.totalBytesProcessed = resp.totalBytesProcessed;
        $scope.recentTotalInteractionsChart.options.title = 'Recent Interactions for ' + $scope.businessName;
        $scope.lastMonthTotalInteractions = data.length > 0 ? data[data.length - 1].action_count : 0;
      }).error(function(resp, status, headers, config) {
        console.log('Failed to download recent interactions');
      });
    };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.businessName) return;

      fetchRecentImpressionsForBusiness();
      fetchRecentInteractionsForBusiness();
    });
  }]);
