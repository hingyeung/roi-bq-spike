'use strict';

angular.module('roiBigQuerySpike')
  .controller('ChannelsCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {
    console.log('ChannelsCtrl');

    $scope.channelsChart = Roiservice.makeChartData('LineChart');
    $scope.channelsChart.options.vAxis.title = "Total Events";
    $scope.channelsChart.options.title = 'Please select a business';

    var chartData = new ChartData();
    $scope.channelsChart.data = chartData.transformToGoogleChartData();

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

        $scope.channelsChart.data = chartData.transformToGoogleChartData();

        $scope.impressionsForBusinessPerChannelChart = {};
        attachStats($scope.impressionsForBusinessPerChannelChart, resp);
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

        $scope.channelsChart.data = chartData.transformToGoogleChartData();

        $scope.interactionsForBusinessPerChannelChart = {};
        attachStats($scope.interactionsForBusinessPerChannelChart, resp);
      });
    };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.businessName) return;
      $scope.channelsChart.options.title = 'Recent Events for ' + $scope.businessName;
      fetchRecentImpressionsForBusinessPerChannel();
      fetchRecentInteractionsForBusinessPerChannel();
    });

  }]);