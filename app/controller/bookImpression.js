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

    // TODO: this block of code repeats in each controller
    // var promise = $http.get('http://localhost:5000/roi/10RandomBusinessNames');
    // promise.success(function(data, status, headers, config) {
    //   $scope.businessNames = data;
    // }).error(function(data, status, headers, config) {
    //   $scope.businessName = [];
    //   console.log('Failed to download business names');
    // });
    // return only 1 busines name for debugging purpose
    $scope.businessNames = ['Sed Neque Inc.'];

    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function() {
      if (!$scope.book || !$scope.businessName) return;

      fetchDataToListimpressionsPerChannelByBookFromLastMonth();
    });

    $scope.$watch('book', function() {
      if (!$scope.book || !$scope.businessName) return;
      
      fetchDataToListimpressionsPerChannelByBookFromLastMonth();
    });

    // TODO: this function is repeated in every controller
    $scope.bothBusNameAndBookAreSelected = function() {
      return $scope.book && $scope.businessName;
    };
  }]);
