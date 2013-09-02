'use strict';

// var ACTIONS = ['EUC', 'EAC', 'EFS', 'MIC', 'CTC', 'STC', 'STF', 'GDC', 'STM', 'THC', 'SMS', 'CFE', 'SEM', 'SFB', 'STW', 'FBL', 'GPL', 'GPY', 'PNT', 'SMO', 'FLK', 'ITL', 'YTL', 'RSS', 'TWL', 'EBL', 'TWL', 'EBL', 'BLG', 'SKC', 'AMZ', 'CSL', 'LCL', 'MYS', 'TPL', 'GTM', 'FSQ', 'LND', 'GIC', 'VID', 'PGI', 'PAC'];
// var ACTIONS = [];
// for (var idx = 0; idx < 30; idx++) {
//   ACTIONS.push('ACTION' + idx);
// }
var ACTIONS = ['ACTION0', 'ACTION1', 'ACTION2'];

angular.module('roiBigQuerySpike')
  .controller('BookinteractionCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {

    var fetchDataToListInteractionsByBookFromLastMonth = function() {
      if (! $scope.bothBusNameAndBookAreSelected()) return;

      var lastMonth = Roiservice.dateOffsetByMonth(-1);
      $scope.miscReportOptions = {year: lastMonth.getFullYear(), month: lastMonth.getMonth() + 1};
      var promise = Roiservice.fetchInteractionsForBusinessByBookAndDate($scope.businessName, $scope.book, lastMonth.getFullYear(), lastMonth.getMonth());
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);

        $scope.interactionsByBook = data;
      }).error(function(data, status, headers, config) {
        console.log('Failed to download top interactions');
      });
    };

    var fetchRecentInteractionsForBusinessByBook = function() {
      if (! $scope.bothBusNameAndBookAreSelected()) return;

      var promise = Roiservice.fetchRecentInteractionsForBusinessByBook($scope.businessName, $scope.book);
      promise.success(function(resp, status, headers, config) {
        var data = resp.list;
        console.log(data);

        // $scope.recentInteractionsForBusinessByBook = data;

        // aggregate data into a line chart
        var aggregatedTable = {}
        for (var idx = 0; idx < data.length; idx++) {
          var row = data[idx];
          if (aggregatedTable[row.year + '/' + row.month] === undefined) {
            aggregatedTable[row.year + '/' + row.month] = createEmptyActionCountRow();
          }

          aggregatedTable[row.year + '/' + row.month][row.action] = parseInt(row.action_count);
        }
        // console.log(aggregatedTable);

        // convert to Google DataTable
        var cols = [{id: 'date', Label: 'Date', type: 'string'}];
        for (var idx = 0; idx < ACTIONS.length; idx++) {
          cols.push({id: ACTIONS[idx], label: ACTIONS[idx], type: 'number'});
        }
        // console.log(cols);

        var rows = [];
        for (var date in aggregatedTable) {
          var cells = [{v: date}];
          for (var actionCount in aggregatedTable[date]) {
            // Manipulate the counts to make the graph looks better. Sad!
            // REAL
            // cells.push({ v: aggregatedTable[date][actionCount]});
            // FAKE
            cells.push({ v: aggregatedTable[date][actionCount] * 20 + 10});
          }
          rows.push({c: cells});
        }
        // console.log(rows);

        $scope.impressionsByChannelAndBookChart = Roiservice.makeChartData('LineChart');
        $scope.impressionsByChannelAndBookChart.data.rows = rows;
        $scope.impressionsByChannelAndBookChart.data.cols = cols;
        $scope.impressionsByChannelAndBookChart.options.isStacked = true;
        $scope.impressionsByChannelAndBookChart.options.displayExactValues = true;
        $scope.impressionsByChannelAndBookChart.options.curveType = 'function';
        $scope.impressionsByChannelAndBookChart.options.vAxis.baseline = 0;
        $scope.impressionsByChannelAndBookChart.options.vAxis = {title: 'Action Count'};
        $scope.impressionsByChannelAndBookChart.options.hAxis = {title: 'Date'};
        $scope.impressionsByChannelAndBookChart.options.legend = {position: 'right'};
        $scope.impressionsByChannelAndBookChart.options.title = "Total Interactions - 6 month summary";
        $scope.impressionsByChannelAndBookChart.query = resp.query;
        $scope.impressionsByChannelAndBookChart.totalBytesProcessed = resp.totalBytesProcessed;
        $scope.impressionsByChannelAndBookChart.cacheHit = resp.cacheHit;
        // console.log($scope.impressionsByChannelAndBookChart.data);

      }).error(function(data, status, headers, config) {
        console.log('Failed to download recent interactions');
      });
    };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.book || !$scope.businessName) return;

      fetchDataToListInteractionsByBookFromLastMonth();
      fetchRecentInteractionsForBusinessByBook();
    });

    $scope.$watch('book', function() {
      if (!$scope.book || !$scope.businessName) return;
      
      fetchDataToListInteractionsByBookFromLastMonth();
      fetchRecentInteractionsForBusinessByBook();
    });

    // // TODO: this function is repeated in every controller
    // $scope.bothBusNameAndBookAreSelected = function() {
    //   return $scope.book && $scope.businessName;
    // };

    // // TODO: this block of code repeats in each controller
    // // var promise = $http.get('http://localhost:5000/roi/10RandomBusinessNames');
    // // promise.success(function(data, status, headers, config) {
    // //   $scope.businessNames = data;
    // // }).error(function(data, status, headers, config) {
    // //   $scope.businessName = [];
    // //   console.log('Failed to download business names');
    // // });
    // // return only 1 busines name for debugging purpose
    // $scope.businessNames = ['Sed Neque Inc.'];

    var createEmptyActionCountRow = function() {
      var emptyRow = {};
      for (var idx = 0; idx < ACTIONS.length; idx++) {
        emptyRow[ACTIONS[idx]] = 0;
      }
      return emptyRow;
    }
  }]);
