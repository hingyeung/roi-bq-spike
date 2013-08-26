'use strict';

angular.module('roiBigQuerySpike')
  .service('Roiservice', ['$http', function Roiservice($http) {
    // AngularJS will instantiate a singleton by calling "new" on this function
    this.get10RandomBusinessNames = function() {
      return $http.get('http://localhost:5000/roi/10RandomBusinessNames');
    };

    this.fetchRecentActionsForBusinessByBook = function(businessName, book) {
      return $http.get('http://localhost:5000/roi/interactionsByBook/' + businessName + '/' + book);
    }

    this.makeChartData = function(chartType) {
      return {
        "type": chartType,
        "displayed": true,
        "cssStyle": "height:600px; width:100%;",
        "data": {},
        "options": {
          "legend": {"position": "none"},
          "title": "",
          "isStacked": "true",
          "fill": 20,
          "displayExactValues": true,
          "hAxis": {
            "title": "Date",
            "gridlines": {
              "count": 10
            }
          },
          "animation":{
            "duration": 1000,
            "easing": 'out',
          },
          "vAxis": {
            "title": "Actions"
          }
        },
        "isDetailsExpanded": false
      };
    };

  }]);
