'use strict';

angular.module('roiBigQuerySpike')
  .service('Roiservice', ['$http', '$q', function Roiservice($http, $q) {
    // TODO: this block of code repeats in each controller
    this.dateOffsetByMonth = function(offset) {
      var newDate = new Date();
      newDate.setMonth(newDate.getMonth() + offset);
      return newDate;
    };

    // AngularJS will instantiate a singleton by calling "new" on this function
    this.get10RandomBusinessNames = function() {
      return $http.get('http://localhost:9000/roi/10RandomBusinessNames');
    };

    this.fetchRecentInteractionsForBusinessByBook = function(businessName, book) {
      return $http.get('http://localhost:9000/roi/interactions/' + businessName + '/' + book);
    };

    this.fetchRecentInteractionsForBusiness = function(businessName) {
      return $http.get('http://localhost:9000/roi/interactions/' + businessName);
    };

    this.fetchRecentImpressionsForBusinessPerChannel = function(businessName) {
      return $http.get('http://localhost:9000/roi/impressions/channel/' + businessName);
    };

    this.fetchRecentInteractionsForBusinessPerChannel = function(businessName) {
      return $http.get('http://localhost:9000/roi/interactions/channel/' + businessName);
    };

    this.fetchAverageImpressionsPerChannel = function() {
      return $http.get('http://localhost:9000/roi/impressions/average/channel');
    };

    this.fetchAverageInteractionsPerChannel = function() {
      return $http.get('http://localhost:9000/roi/interactions/average/channel');
    };

    this.fetchRecentImpressionsForBusiness = function(businessName) {
      return $http.get('http://localhost:9000/roi/impressions/' + businessName);
    };

    this.fetchRecentInteractionsForBusiness = function(businessName) {
      return $http.get('http://localhost:9000/roi/interactions/' + businessName);
    };

    this.fetchAverageImpressions = function() {
      return $http.get('http://localhost:9000/roi/average/impressions');
    };

    this.fetchAverageInteractions = function() {
      return $http.get('http://localhost:9000/roi/average/interactions');
    };

    this.fetchInteractionsForBusinessByBookAndDate = function(businessName, book, year, month) {
      return $http.get('http://localhost:9000/roi/interactions/' + businessName +'/' + book + '/' + year + '/' + month);
    };

    this.fetchDataToListimpressionsPerChannelByBookFromLastMonth = function(businessName, book, year, month) {
      return $http.get('http://localhost:9000/roi/impressionsPerChannel/' + businessName + '/' + book + '/' + year + '/' + month);
    };

    this.fetchRecentImpressionsForBusinessByBook = function(businessName, book) {
      return $http.get('http://localhost:9000/roi/impressions/' + businessName + '/' + book);
    };

    this.fetchRecentImpressionsForBusiness = function(businessName) {
      return $http.get('http://localhost:9000/roi/impressions/' + businessName);
    };

    this.fetchSearchImpressionsByLocationForBusiness = function(businessName, limit) {
      limit = limit || 8;
      return $http.get('http://localhost:9000/roi/searchImpressionLocations/' + businessName + "/" + limit);
    };

    this.fetchSearchImpressionsByTimeForBusiness = function(businessName) {
      return $http.get('http://localhost:9000/roi/searchImpressionTimes/' + businessName);
    };

    this.fetchDirectImpressionsByTimeForBusiness = function (businessName) {
      return $http.get('http://localhost:9000/roi/directImpressionTimes/' + businessName);
    };

    this.fetchActionsByTimeForBusiness = function (businessName) {
      return $http.get('http://localhost:9000/roi/actionTimes/' + businessName);
    };

    this.fetchDataForStateRollupReport = function(businessName, state, year, month) {
      return $q.all([
             $http.get('http://localhost:9000/roi/interactionsPerBook/' + businessName + '/' + state + '/' + year + '/' + month),
             $http.get('http://localhost:9000/roi/impressionsPerBook/' + businessName + '/' + state + '/' + year + '/' + month)
          ]);
    };

    this.makeChartData = function(chartType) {
      return {
        "type": chartType,
        "displayed": true,
        "cssStyle": "height:600px; width:100%;",
        "data": {},
        "options": {
          "titleTextStyle": { "color": "#7F8C8D"},
          "legend": {position: 'right', textStyle: {color: '#aaa', fontSize: 16}},
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
            "duration": 200,
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
