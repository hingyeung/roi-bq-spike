'use strict';

google.setOnLoadCallback(function () {
    angular.bootstrap(document.body, ['yeomanTestDeleteMeApp']);
});
google.load('visualization', '1', {packages: ['corechart']});

angular.module('yeomanTestDeleteMeApp', ['googlechart.directives'])
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
