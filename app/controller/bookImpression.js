'use strict';

angular.module('roiBigQuerySpike')
  .controller('BookimpressionCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {
    $scope.isLoadingImpressionsPerChannelByBook = false;
    $scope.isLoadingImpressionsByBook = false;
    var fetchDataToListimpressionsPerChannelByBookFromLastMonth = function() {
      var lastMonth = Roiservice.dateOffsetByMonth(-1)
        , promise = Roiservice.fetchDataToListimpressionsPerChannelByBookFromLastMonth($scope.businessName, $scope.book, lastMonth.getFullYear(), lastMonth.getMonth() + 1);
        $scope.isLoadingImpressionsPerChannelByBook = true;

        promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);

        $scope.impressionAndChannelByBook = data;
        $scope.miscReportOptions = { month: lastMonth.getMonth() + 1, year: lastMonth.getFullYear()};
        $scope.isLoadingImpressionsPerChannelByBook = false;
      }).error(function(data, status, headers, config) {
        console.log('Failed to download impressions per channel by book');
      });

    };

    var fetchRecentImpressionsForBusinessByBook = function() {
      var promise = Roiservice.fetchRecentImpressionsForBusinessByBook($scope.businessName, $scope.book);
      $scope.isLoadingImpressionsByBook = true;
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);
        $scope.recentTotalImpressionsByBookChart = Roiservice.makeChartData('ColumnChart');
        $scope.recentTotalImpressionsByBookChart.options.vAxis.title = "Total Appearences";
        var cols = [{id: "date", label: "Date", type: "string"}, {id:"count", label:"Count", type:"number"}]
          , rows = [];
        for (var idx = 0; idx < data.length; idx++) {
          rows.push({c: [ { v: data[idx].month + "/" + data[idx].year }, { v: data[idx].impression_count } ]});
        }
        $scope.recentTotalImpressionsByBookChart.data = {rows: rows, cols: cols};
        $scope.recentTotalImpressionsByBookChart.query = resp.query;
        $scope.recentTotalImpressionsByBookChart.cacheHit = resp.cacheHit;
        $scope.recentTotalImpressionsByBookChart.totalBytesProcessed = resp.totalBytesProcessed;
        $scope.recentTotalImpressionsByBookChart.options.title = 'Recent Appearences for ' + $scope.businessName + ' from ' + $scope.book;
        $scope.isLoadingImpressionsByBook = false;
      }).error(function(resp, status, headers, config) {
        console.log('Failed to download recent impressions by book');
      });
    };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.book || !$scope.businessName) return;
      fetchRecentImpressionsForBusinessByBook();
      fetchDataToListimpressionsPerChannelByBookFromLastMonth();
    });

    $scope.$watch('book', function() {
      if (!$scope.book || !$scope.businessName) return;
      fetchRecentImpressionsForBusinessByBook();
      fetchDataToListimpressionsPerChannelByBookFromLastMonth();
    });

    
  }]);
