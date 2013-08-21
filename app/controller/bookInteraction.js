'use strict';

angular.module('roiBigQuerySpike')
  .controller('BookinteractionCtrl', ['$scope', '$http', function ($scope, $http) {

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

    $scope.$watch('businessName', function() {
      if ($scope.businessName === '') return;

      fetchDataToListInteractionsByBookFromLastMonth();
    });

    $scope.$watch('book', function() {
      if ($scope.book === '') return;
      
      fetchDataToListInteractionsByBookFromLastMonth();
    });

    $scope.bothBusNameAndBookAreSelected = function() {
      return $scope.book && $scope.businessName;
    };

    // TODO: this block of code repeats in each controller
    var promise = $http.get('http://localhost:5000/roi/10RandomBusinessNames');
    promise.success(function(data, status, headers, config) {
      $scope.businessNames = data;
    }).error(function(data, status, headers, config) {
      $scope.businessName = [];
      console.log('Failed to download business names');
    });

    // TODO: this block of code repeats in each controller
    var dateOffsetByMonth = function(offset) {
      var newDate = new Date();
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    }
  }]);
