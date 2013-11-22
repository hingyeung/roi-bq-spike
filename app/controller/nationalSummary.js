'use strict';

angular.module('roiBigQuerySpike')
  .controller('NationalsummaryCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {
    console.log('NationalsummaryCtrl');

    $scope.isLoadingRecentImpressions = false;
    $scope.isLoadingRecentInteractions = false;
    $scope.forceRedraw = false;
    
    var fetchRecentImpressionsForBusiness = function() {
      $scope.isLoadingRecentImpressions = true;

      var startDate, endDate;
      if ($scope.reportBetween) {
        startDate = $scope.reportBetween.startDate;
        endDate = $scope.reportBetween.endDate;
      }

      var promise = Roiservice.fetchRecentImpressionsForBusiness($scope.businessName, startDate, endDate);
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
        $scope.lastMonthTotalImpressions = data.length > 0 ? data[data.length - 1].impression_count : 0;
        $scope.isLoadingRecentImpressions = false;
      }).error(function(resp, status, headers, config) {
        console.log('Failed to download recent impressions');
      });
    };

    var fetchRecentInteractionsForBusiness = function() {
      $scope.isLoadingRecentInteractions = true;

      var startDate, endDate;
      if ($scope.reportBetween) {
        startDate = $scope.reportBetween.startDate;
        endDate = $scope.reportBetween.endDate;
      }

      var promise = Roiservice.fetchRecentInteractionsForBusiness($scope.businessName, startDate, endDate);
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
        $scope.isLoadingRecentInteractions = false;
      }).error(function(resp, status, headers, config) {
        console.log('Failed to download recent interactions');
      });
    };

    // $scope.shouldForceRedraw = function() {
    //   return $scope.forceRedraw;
    // }

    // $scope.nextClicked = function() {
    //   console.log('next clicked');
    //   $scope.forceRedraw = true;
    // };

    // $scope.prevClicked = function() {
    //   $scope.forceRedraw = true;
    // };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.businessName) return;

      fetchRecentImpressionsForBusiness();
      fetchRecentInteractionsForBusiness();
    });

    $scope.$watch('reportBetween', function(dates, origDates) {
      if ($scope.businessName && (dates.startDate && dates.endDate) && (dates.startDate !== origDates.startDate || dates.endDate !== origDates.endDate)) {
        fetchRecentImpressionsForBusiness();
        fetchRecentInteractionsForBusiness();
      }
    }, true);

    angular.element('.carousel').bind('slide.bs.carousel', function() {
      console.log('controller got slide start event');
      $scope.$apply(function() {
        $scope.forceRedraw = true;
      });
    });

    angular.element('.carousel').bind('slid', function () {
        console.log('controller got the transistion finished event');
        $scope.$apply(function() {
          $scope.forceRedraw = false;
        });
    });
  }]);


// jQuery('.carousel').on('slid.bs.carousel', function () {
//   console.log('controller got the slide event');
// });

// jQuery('.carousel').on('slid', function () {
//   console.log('controller got the slide event');
// });

// jQuery('.navbar').on('click', function () {
//   console.log('controller got the click event');
// });

// console.log(jQuery('#myCarousel'));