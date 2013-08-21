'use strict';

angular.module('roiBigQuerySpike')
  .filter('capacity', function() {
    var KILO = 1024
      , MEGA = 1024 * KILO
      , GIGA = 1024 * MEGA;
    return function(inputInBytes, unit) {
      var result;
      switch (unit) {
        case 'GB':
          result = inputInBytes / GIGA;
          break;
        case 'MB':
          result = inputInBytes / MEGA;
          break;
        case 'KB':
          result = inputInBytes / KILO;
          break;
        default:
          result = inputInBytes / KILO;
      }
      return (result).toFixed(3);
    };
  });
