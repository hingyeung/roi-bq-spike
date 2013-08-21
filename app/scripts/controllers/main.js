'use strict';

angular.module('roiBigQuerySpike')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.businessName = "";
    $scope.book= "";
    $scope.businessNames = [];
    $scope.miscReportOptions = {year: 0, month: 0};

    var createColumnChart = function() {
      return {
        "type": "ColumnChart",
        "displayed": true,
        "cssStyle": "height:600px; width:100%;",
        "data": {},
        "options": {
          "legend": {"position": "none"},
          "title": "",
          "isStacked": "true",
          "fill": 20,
          "displayExactValues": true,
          "hAxis": {
            "title": "Date",
            "gridlines": {
              "count": 10
            }
          },
          "animation":{
            "duration": 1000,
            "easing": 'out',
          },
          "vAxis": {
            "title": "Actions"
          }
        },
        "isDetailsCollapsed": true
      };
    };

    var dateOffsetByMonth = function(offset) {
      var newDate = new Date();
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    }

    var fetchDataToDrawTotalActionChart = function() {
      var promise = $http.get('http://localhost:5000/roi/allActions/' + $scope.businessName);
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);
        $scope.totalActionsChart.options.title = "Total interactions for " + $scope.businessName;

        var cols = [{
            id: "date",
            label: "Date",
            type: "string"
          },
          {
            id: "actions",
            label: "Actions",
            type: "number"
          }], rows = [];

        for (var idx = 0; idx < data.length; idx++) {
          var row = data[idx];
          rows.push({
            c: [{v: row.month + '/' + row.year}, {v: row.action_count}]
          });
        }

        $scope.totalActionsChart.data.rows = rows;
        $scope.totalActionsChart.data.cols = cols;
        $scope.totalActionsChart.totalBytesProcessed = resp.totalBytesProcessed;
        $scope.totalActionsChart.query = resp.query;
      }).error(function(data, status, headers, config) {
        console.log('Failed to download total actions.');
      });
    };

    var fetchDataToDrawImpressionsByChannelAndBookChartFromLastMonth = function() {
      if (! $scope.bothBusNameAndBookAreSelected()) return;

      var lastMonth = dateOffsetByMonth(-1);
      $scope.miscReportOptions = {year: lastMonth.getFullYear(), month: lastMonth.getMonth() + 1};
      var lastMonth = dateOffsetByMonth(-1)
        , promise = $http.get('http://localhost:5000/roi/impressionsByBook/' + $scope.businessName +'/' + $scope.book + '/' + lastMonth.getFullYear() + '/' + (lastMonth.getMonth() + 1));
      
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);

        $scope.impressionsByChannelAndBookChart.options.vAxis.title = "Impressions";
        $scope.impressionsByChannelAndBookChart.options.hAxis.title = "Channel";
        $scope.impressionsByChannelAndBookChart.options.title = "Impressions for " + $scope.businessName + " in " + $scope.miscReportOptions.month + "/" + $scope.miscReportOptions.year;
        var cols = [{
          id: "channel",
          label: "Channel",
          type: "string"
        },
        {
          id: "impressions",
          label: "Impressions",
          type: "number"
        }], rows = [];
        for (var idx = 0; idx < data.length; idx++) {
          var row = data[idx];
          rows.push({
            c: [{v: row.channel}, {v: row.impression_count}]
          });
        }

        $scope.impressionsByChannelAndBookChart.data.cols = cols;
        $scope.impressionsByChannelAndBookChart.data.rows = rows;
        $scope.impressionsByChannelAndBookChart.totalBytesProcessed = resp.totalBytesProcessed;
        $scope.impressionsByChannelAndBookChart.query = resp.query;
      }).error(function(data, status, headers, config) {
        console.log('Failed to download impressions by book');
      })
    };

    // var fetchDataToListTopInteractionsByBookFromLastMonth = function() {
    //   if (! $scope.bothBusNameAndBookAreSelected()) return;

    //   var lastMonth = dateOffsetByMonth(-1);
    //   $scope.miscReportOptions = {year: lastMonth.getFullYear(), month: lastMonth.getMonth() + 1};
    //   var promise = $http.get('http://localhost:5000/roi/topInteractions/' + $scope.businessName +'/' + $scope.book + '/' + lastMonth.getFullYear() + '/' + (lastMonth.getMonth() + 1));
    //   promise.success(function(resp, status, headers, config) {
    //     var data = resp.list;
    //     console.log(data);

    //     $scope.topInteractionsByBook = data;
    //   }).error(function(data, status, headers, config) {
    //     console.log('Failed to download top interactions');
    //   });
    // };

    var fetchDataToListInteractionsByBookFromLastMonth = function() {
      if (! $scope.bothBusNameAndBookAreSelected()) return;

      var lastMonth = dateOffsetByMonth(-1);
      $scope.miscReportOptions = {year: lastMonth.getFullYear(), month: lastMonth.getMonth() + 1};
      var promise = $http.get('http://localhost:5000/roi/interactionsByBook/' + $scope.businessName +'/' + $scope.book + '/' + lastMonth.getFullYear() + '/' + (lastMonth.getMonth() + 1));
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);

        $scope.interactionsByBook = data;
      }).error(function(data, status, headers, config) {
        console.log('Failed to download top interactions');
      });
    };

    var fetchDataToDrawTotalImpressionChart = function() {
      var promise = $http.get('http://localhost:5000/roi/allImpressions/' + $scope.businessName);
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);
        $scope.totalImpressionsChart.options.title = "Total impressions for " + $scope.businessName;
        $scope.totalImpressionsChart.options.vAxis.title = "Impressions";

        // transform big query result to google chart data format
        var cols = [{
          id: "date",
          label: "Date",
          type: "string"
        },
        {
          id: "imprssions",
          label: "Impressions",
          type: "number"
        }], rows = [];

        for (var idx = 0; idx < data.length; idx++) {
          var row = data[idx];
          rows.push({
            c: [{v: row.month + '/' + row.year}, {v: row.impression_count}]
          });
        }

        $scope.totalImpressionsChart.data.rows = rows;
        $scope.totalImpressionsChart.data.cols = cols;
        $scope.totalImpressionsChart.totalBytesProcessed = resp.totalBytesProcessed;
        $scope.totalImpressionsChart.query = resp.query;

      }).error(function(data, status, headers, config) {
        console.log('Failed to download total impressions.');
      });
    };

    var promise = $http.get('http://localhost:5000/roi/10RandomBusinessNames');
    promise.success(function(data, status, headers, config) {
      $scope.businessNames = data;
    }).error(function(data, status, headers, config) {
      $scope.businessName = [];
      console.log('Failed to download business names');
    });

    $scope.totalActionsChart = createColumnChart();
    $scope.totalImpressionsChart = createColumnChart();
    $scope.impressionsByChannelAndBookChart = createColumnChart();

    $scope.$watch('businessName', function() {
      if ($scope.businessName === '') return;

      fetchDataToDrawTotalActionChart();
      fetchDataToDrawTotalImpressionChart();
      fetchDataToListInteractionsByBookFromLastMonth();
      fetchDataToDrawImpressionsByChannelAndBookChartFromLastMonth();
    });

    $scope.$watch('book', function() {
      if ($scope.book === '') return;
      
      fetchDataToListInteractionsByBookFromLastMonth();
      fetchDataToDrawImpressionsByChannelAndBookChartFromLastMonth();
    });

    $scope.bothBusNameAndBookAreSelected = function() {
      return $scope.book && $scope.businessName;
    }
  }]);
