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

    var fetchRecentImpressionsForBusinessPerChannel = function() {
      var promise = Roiservice.fetchRecentImpressionsForBusinessPerChannel($scope.businessName);
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;

        var channels = {};
        for (var idx = 0; idx < data.length; idx++) {
          if (!channels.hasOwnProperty(data[idx].channel)) {
            channels[data[idx].channel] = {
              id: data[idx].channel.toLowerCase() + 'impressions',
              label: data[idx].channel + " Impressions",
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

    var fetchRecentInteractionsForBusinessPerChannel = function() {
      var promise = Roiservice.fetchRecentInteractionsForBusinessPerChannel($scope.businessName);
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;

        var channels = {};
        for (var idx = 0; idx < data.length; idx++) {
          if (!channels.hasOwnProperty(data[idx].channel)) {
            channels[data[idx].channel] = {
              id: data[idx].channel.toLowerCase() + 'interactions',
              label: data[idx].channel + " Interactions",
              type: "number",
              rows: []
            };
          }
          channels[data[idx].channel].rows.push({
            key: new Date(data[idx].year, data[idx].month, data[idx].day),
            value: data[idx].action_count
          });
        }

        for (var chKey in channels) {
          if (channels.hasOwnProperty(chKey)) {
            var channel = channels[chKey];
            chartData.addColumn(channel.id, channel.label, channel.type, channel.rows); 
          }
        }

        $scope.nationalTotalsChart.data = chartData.transformToGoogleChartData();

        $scope.recentTotalInteractionsPerChannelChart = {};
        attachStats($scope.recentTotalInteractionsPerChannelChart, resp);
      });
    };

    var fetchAverageImpressionsPerChannel = function() {
      var promise = Roiservice.fetchAverageImpressionsPerChannel();
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;

        var channels = {};
        for (var idx = 0; idx < data.length; idx++) {
          if (!channels.hasOwnProperty(data[idx].channel)) {
            channels[data[idx].channel] = {
              id: data[idx].channel.toLowerCase() + 'averageimpressions',
              label: 'Average ' + data[idx].channel + " Impressions",
              type: "number",
              rows: []
            };
          }
          channels[data[idx].channel].rows.push({
            key: new Date(data[idx].year, data[idx].month, data[idx].day),
            value: data[idx].average_impressions
          });
        }

        for (var chKey in channels) {
          if (channels.hasOwnProperty(chKey)) {
            var channel = channels[chKey];
            chartData.addColumn(channel.id, channel.label, channel.type, channel.rows); 
          }
        }

        $scope.nationalTotalsChart.data = chartData.transformToGoogleChartData();

        $scope.averageImpressionsPerChannelChart = {};
        attachStats($scope.averageImpressionsPerChannelChart, resp);
      });
    };

    var fetchAverageInteractionsPerChannel = function() {
      var promise = Roiservice.fetchAverageInteractionsPerChannel();
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;

        var channels = {};
        for (var idx = 0; idx < data.length; idx++) {
          if (!channels.hasOwnProperty(data[idx].channel)) {
            channels[data[idx].channel] = {
              id: data[idx].channel.toLowerCase() + 'averageinteractions',
              label: 'Average ' + data[idx].channel + " Interactions",
              type: "number",
              rows: []
            };
          }
          channels[data[idx].channel].rows.push({
            key: new Date(data[idx].year, data[idx].month, data[idx].day),
            value: data[idx].average_interactions
          });
        }

        for (var chKey in channels) {
          if (channels.hasOwnProperty(chKey)) {
            var channel = channels[chKey];
            chartData.addColumn(channel.id, channel.label, channel.type, channel.rows); 
          }
        }

        $scope.nationalTotalsChart.data = chartData.transformToGoogleChartData();

        $scope.averageInteractionsPerChannelChart = {};
        attachStats($scope.averageInteractionsPerChannelChart, resp);
      });
    };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.businessName) return;
      $scope.nationalTotalsChart.options.title = 'Recent Events for ' + $scope.businessName;
      fetchRecentImpressionsForBusinessPerChannel();
      fetchRecentInteractionsForBusinessPerChannel();
      fetchAverageImpressionsPerChannel();
      fetchAverageInteractionsPerChannel();
    });

  }]);