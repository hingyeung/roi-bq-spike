'use strict';

angular.module('roiBigQuerySpike')
  .controller('MainCtrl', ['$scope', '$location', "$http", function ($scope, $location, $http) {
    // TODO: this block of code repeats in each controller
    var promise = $http.get('roi/10RandomBusinessNames');
    promise.success(function(data, status, headers, config) {
      var businesses = []
      for( var x = 0;x < 10; x++) {
        businesses.push(data.list[x].business)
      }
      $scope.businessNames = $scope.businessNames.concat(businesses);
    }).error(function(data, status, headers, config) {
       $scope.businessName = [];
       console.log('Failed to download business names');
    });
    // return only 1 busines name for debugging purpose
    $scope.businessNames = ['Mobil Oil Australia'];

    $scope.bothBusNameAndBookAreSelected = function() {
      return $scope.book && $scope.businessName;
    };

    $scope.bothBusNameAndStateAreSelected = function() {
      return $scope.state && $scope.businessName;
    };

    $scope.isActive = function(route) {
        return route === $location.path();
    };

    $scope.setBusinessName = function(businessName) {
        $scope.businessName = businessName;
    };

    $scope.setState = function(state) {
        $scope.state = state;
        $scope.books = [];
        for (var idx = 0; idx < 10; idx++) {
            $scope.books.push($scope.state + idx);
        }
    };

    $scope.setBook = function(book) {
        $scope.book = book;
    };

    $scope.books = [];
  }]);
