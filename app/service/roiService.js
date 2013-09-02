'use strict';

angular.module('roiBigQuerySpike')
  .service('Roiservice', ['$http', function Roiservice($http) {
    // TODO: this block of code repeats in each controller
    this.dateOffsetByMonth = function(offset) {
      var newDate = new Date();
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    };

    // AngularJS will instantiate a singleton by calling "new" on this function
    this.get10RandomBusinessNames = function() {
      return $http.get('http://localhost:5000/roi/10RandomBusinessNames');
    };

    this.fetchRecentActionsForBusinessByBook = function(businessName, book) {
      return $http.get('http://localhost:5000/roi/interactionsByBook/' + businessName + '/' + book);
    };

    this.fetchActionsForBusinessByBook = function(businessName, book, year, month) {
      return $http.get('http://localhost:5000/roi/interactionsByBook/' + businessName +'/' + book + '/' + year + '/' + month);
    };

    this.fetchDataToListimpressionsPerChannelByBookFromLastMonth = function(businessName, book, year, month) {
      return $http.get('http://localhost:5000/roi/impressionsPerChannelByBook/' + businessName + '/' + book + '/' + year + '/' + month);
    };

    this.fetchRecentImpressionsForBusinessByBook = function(businessName, book) {
      return $http.get('http://localhost:5000/roi/impressions/' + businessName + '/' + book);
    }

    this.fetchRecentImpressionsForBusiness = function(businessName) {
      return $http.get('http://localhost:5000/roi/impressions/' + businessName);
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
