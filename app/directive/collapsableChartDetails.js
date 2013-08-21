'use strict';

angular.module('roiBigQuerySpike')
  .directive('collapsableChartDetails', function($compile) {
    // return the directive link function.
    var linker = function(scope, element, attrs) {

    };

    return {
      restrict: 'E',
      replace: true,
      link: linker,
      templateUrl: '/views/collapsableChartDetail.html',
      scope: {
        // one way bind
        data:"&data"
      }
    };
  });
