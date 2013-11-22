'use strict';

angular.module('roiBigQuerySpike')
  .controller('MainCtrl', ['$scope', '$location', function ($scope, $location) {
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
    $scope.reportBetween = {};

    var startDate, endDate;

    startDate = $('#start-date').datepicker({
        viewMode: 'years',
        minViewMode: 'months'
    }).on('changeDate', function(e) {
        if (e.date.valueOf() >= endDate.date.valueOf()) {
            var newDate = new Date(e.date)
            newDate.setDate(newDate.getDate());
            newDate.setMonth(newDate.getMonth() + 1);
            endDate.setValue(newDate);
            $scope.reportBetween.endDate = endDate.date;
        }
        if (startDate.viewMode === 1) {
            startDate.hide();
            $scope.reportBetween.startDate = startDate.date;
            $scope.$apply();
        }
    }).data('datepicker');
    
    endDate = $('#end-date').datepicker({
        viewMode: 'years',
        minViewMode: 'months'
    }).on('changeDate', function(e) {
        if (endDate.viewMode === 1) {
            endDate.hide();
            $scope.reportBetween.endDate = endDate.date;
            $scope.$apply();
        }
    }).data('datepicker');


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
    };

    $scope.setBook = function(book) {
        $scope.book = book;
    };

    $scope.books = [];
    for (var idx = 0; idx < 10; idx++) {
        $scope.books.push('BOOK' + idx);
    }
  }]);
