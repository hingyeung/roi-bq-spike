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
            value: data[idx].impression_count });
        }
        chartData.addColumn("impressions", "Impressions", "number", impressions);

        $scope.nationalTotalsChart.data = chartData.transformToGoogleChartData();

        $scope.recentTotalImpressionsChart = {};
        attachStats($scope.recentTotalImpressionsChart, resp);

      }).error(function(resp, status, headers, config) {
        console.log('Failed to download recent impressions');
      });
    };

    var fetchRecentImpressionsForBusinessPerChannel = function() {
      var promise = Roiservice.fetchRecentImpressionsForBusinessPerChannel($scope.businessName);
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        
        var channels = {};
        for (var idx = 0; idx < data.length; idx++) {
          if (!channels.hasOwnProperty(data[idx].channel)) {
            channels[data[idx].channel] = {
              id: data[idx].channel.toLowerCase(),
              label: data[idx].channel,
              type: "number",
              rows: []
            };
          }
          channels[data[idx].channel].rows.push({
            key: new Date(data[idx].year, data[idx].month, data[idx].day),
            value: data[idx].impression_count
          });
        }

        for (var chKey in channels) {
          if (channels.hasOwnProperty(chKey)) {
            var channel = channels[chKey];
            chartData.addColumn(channel.id, channel.label, channel.type, channel.rows); 
          }
        }

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
            value: data[idx].action_count });
        }
        chartData.addColumn("interactions", "Interactions", "number", interactions);

        $scope.nationalTotalsChart.data = chartData.transformToGoogleChartData();

        $scope.recentTotalInteractionsChart = {};
        attachStats($scope.recentTotalInteractionsChart, resp);

      }).error(function(resp, status, headers, config) {
        console.log('Failed to download recent interactions');
      });
    };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.businessName) return;
      $scope.nationalTotalsChart.options.title = 'Recent Events for ' + $scope.businessName;
      fetchRecentImpressionsForBusiness();
      fetchRecentInteractionsForBusiness();
      fetchRecentImpressionsForBusinessPerChannel();
    });

  }]);