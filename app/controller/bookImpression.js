'use strict';

angular.module('roiBigQuerySpike')
  .controller('BookimpressionCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {
    var fetchDataToListimpressionsPerChannelByBookFromLastMonth = function() {
      var lastMonth = Roiservice.dateOffsetByMonth(-1)
        , promise = Roiservice.fetchDataToListimpressionsPerChannelByBookFromLastMonth($scope.businessName, $scope.book, lastMonth.getFullYear(), lastMonth.getMonth() + 1);

        promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);

        $scope.impressionAndChannelByBook = data;
        $scope.miscReportOptions = { month: lastMonth.getMonth() + 1, year: lastMonth.getFullYear()};
      }).error(function(data, status, headers, config) {
        console.log('Failed to download impressions by book');
      });

    };

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
      }).error(function(resp, status, headers, config) {
        console.log('Failed to download recent impressions');
      });
    };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.businessName) return;
      fetchRecentImpressionsForBusiness();

      if (!$scope.book || !$scope.businessName) return;
      fetchDataToListimpressionsPerChannelByBookFromLastMonth();
    });

    $scope.$watch('book', function() {
      if (!$scope.book || !$scope.businessName) return;
      fetchDataToListimpressionsPerChannelByBookFromLastMonth();
    });

    
  }]);
