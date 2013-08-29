'use strict';

angular.module('roiBigQuerySpike')
  .controller('Main2Ctrl', ['$scope', function ($scope) {
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

    // TODO: this function is repeated in every controller
    $scope.bothBusNameAndBookAreSelected = function() {
      return $scope.book && $scope.businessName;
    };
  }]);
