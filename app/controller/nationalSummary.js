'use strict';

angular.module('roiBigQuerySpike')
  .controller('NationalsummaryCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {
    console.log('NationalsummaryCtrl');

    $scope.nationalTotalsChart = Roiservice.makeChartData('LineChart');
    $scope.nationalTotalsChart.options.vAxis.title = "Total Events";
    $scope.nationalTotalsChart.options.title = 'Please select a business';

    var chartData = new ChartData();
    $scope.nationalTotalsChart.data = chartData.transformToGoogleChartData();

    var attachStats = function(chart, resp) {
      chart.query = resp.query;
      chart.cacheHit = resp.cacheHit;
      chart.totalBytesProcessed = resp.totalBytesProcessed;
    };

    var fetchRecentImpressionsForBusiness = function() {
      var promise = Roiservice.fetchRecentImpressionsForBusiness($scope.businessName);
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;

        var impressions = [];
        for (var idx = 0; idx < data.length; idx++) {
          impressions.push({
            key: new Date(data[idx].year, data[idx].month, data[idx].day),
            value: data[idx].impression_count
          });
        }
        chartData.addColumn('impressions', 'Impressions', 'number', impressions); 

        $scope.nationalTotalsChart.data = chartData.transformToGoogleChartData();

        $scope.recentTotalImpressionsPerChannelChart = {};
        attachStats($scope.recentTotalImpressionsPerChannelChart, resp);
      });
    };

    var fetchRecentInteractionsForBusiness = function() {
      var promise = Roiservice.fetchRecentInteractionsForBusiness($scope.businessName);
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;

        var interactions = [];
        for (var idx = 0; idx < data.length; idx++) {
          interactions.push({
            key: new Date(data[idx].year, data[idx].month, data[idx].day),
            value: data[idx].action_count
          });
        }
        chartData.addColumn('interactions', 'Interactions', 'number', interactions); 

        $scope.nationalTotalsChart.data = chartData.transformToGoogleChartData();

        $scope.recentTotalInteractionsPerChannelChart = {};
        attachStats($scope.recentTotalInteractionsPerChannelChart, resp);
      });
    };

    var fetchAverageImpressions = function() {
      var promise = Roiservice.fetchAverageImpressions();
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;

        var impressions = [];
        for (var idx = 0; idx < data.length; idx++) {
          impressions.push({
            key: new Date(data[idx].year, data[idx].month, data[idx].day),
            value: data[idx].average_impressions
          });
        }
        chartData.addColumn('averageimpressions', 'Average Impressions', 'number', impressions); 

        $scope.nationalTotalsChart.data = chartData.transformToGoogleChartData();

        $scope.averageImpressionsPerChannelChart = {};
        attachStats($scope.averageImpressionsPerChannelChart, resp);
      });
    };

    var fetchAverageInteractions = function() {
      var promise = Roiservice.fetchAverageInteractions();
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;

        var interactions = [];
        for (var idx = 0; idx < data.length; idx++) {
          interactions.push({
            key: new Date(data[idx].year, data[idx].month, data[idx].day),
            value: data[idx].average_interactions
          });
        }
        chartData.addColumn('averageinteractions', 'Average Interactions', 'number', interactions); 

        $scope.nationalTotalsChart.data = chartData.transformToGoogleChartData();

        $scope.averageInteractionsPerChannelChart = {};
        attachStats($scope.averageInteractionsPerChannelChart, resp);
      });
    };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.businessName) return;
      $scope.nationalTotalsChart.options.title = 'Recent Events for ' + $scope.businessName;
      fetchRecentImpressionsForBusiness();
      fetchRecentInteractionsForBusiness();
      fetchAverageImpressions();
      fetchAverageInteractions();
    });

  }]);