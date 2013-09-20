'use strict';

angular.module('roiBigQuerySpike')
  .controller('StateRollupCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {

    console.log('StateRollupCtrl');

    function StateReportDetail() {
      this.impressions = 0;
      this.EUC = 0;
      this.MIC = 0;
      this.PAC = 0;
      this.STM = 0;
    };

     var fetchDataForStateRollupReport = function() {
      var lastMonth = Roiservice.dateOffsetByMonth(-1)
        , promise = Roiservice.fetchDataForStateRollupReport($scope.businessName, $scope.state, lastMonth.getFullYear(), lastMonth.getMonth() + 1);
      promise.then(
        function(responses, status, headers, config) {
          var interactionsPerBookResp = responses[0].data;
          var impressionsPerBookResp = responses[1].data;

          console.log(interactionsPerBookResp);
          console.log(impressionsPerBookResp);

          var stateReport = {};

          for (var idx = 0; idx < impressionsPerBookResp.list.length; idx++) {
            var row = impressionsPerBookResp.list[idx];
            stateReport[row.book] = stateReport[row.book] || new StateReportDetail();
            stateReport[row.book].impressions = stateReport[row.book].impressions + row.impression_count;
          }

          for (var idx = 0; idx < interactionsPerBookResp.list.length; idx++) {
            var row = interactionsPerBookResp.list[idx];
            stateReport[row.book] = stateReport[row.book] || new StateReportDetail();
            stateReport[row.book][row.action]++;
          }

          console.log(stateReport);
        });
    };

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function(newValue, oldValue) {
      if ($scope.state && $scope.businessName && newValue != oldValue) {
        fetchDataForStateRollupReport();
      }
    }, true);

    $scope.$watch('state', function(newValue, oldValue) {
      if ($scope.state && $scope.businessName && newValue != oldValue) {
        fetchDataForStateRollupReport();
      }
    }, true);
  }]);
