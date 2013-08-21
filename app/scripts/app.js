'use strict';

google.setOnLoadCallback(function () {
    angular.bootstrap(document.body, ['roiBigQuerySpike']);
});
google.load('visualization', '1', {packages: ['corechart']});

angular.module('roiBigQuerySpike', ['googlechart.directives', 'ui.bootstrap'])
  .config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
