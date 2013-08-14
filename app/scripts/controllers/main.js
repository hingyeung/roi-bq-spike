'use strict';

angular.module('yeomanTestDeleteMeApp')
  .controller('MainCtrl', ['$scope', '$http', function ($scope, $http) {
    $scope.businessName = "";
    $scope.businessNames = [];

    var createColumnChart = function() {
      return {
        "type": "ColumnChart",
        "displayed": true,
        "cssStyle": "height:600px; width:100%;",
        "data": {},
        "options": {
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
        }
      };
    };

    var fetchDataToDrawTotalActionChart = function() {
      var promise = $http.get('http://localhost:5000/roi/allActions/' + $scope.businessName);
      promise.success(function(data, status, headers, config) {
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
      }).error(function(data, status, headers, config) {
        console.log('Failed to download total actions.');
      });
    };

    var fetchDataToDrawTotalImpressionChart = function() {
      var promise = $http.get('http://localhost:5000/roi/allImpressions/' + $scope.businessName);
      promise.success(function(data, status, headers, config) {
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

    $scope.$watch('businessName', function() {
      if ($scope.businessName === '') return;
      fetchDataToDrawTotalActionChart();
      fetchDataToDrawTotalImpressionChart();
    });
  }]);
