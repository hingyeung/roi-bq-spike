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
      return $http.get('/roi/10RandomBusinessNames');
    };

    this.fetchRecentInteractionsForBusinessByBook = function(businessName, book) {
      return $http.get('/roi/interactions/' + businessName + '/' + book);
    };

    this.fetchRecentInteractionsForBusiness = function(businessName) {
      return $http.get('/roi/interactions/' + businessName);
    };

    this.fetchRecentImpressionsForBusinessPerChannel = function(businessName) {
      return $http.get('/roi/impressions/channel/' + businessName);
    };

    this.fetchRecentInteractionsForBusinessPerChannel = function(businessName) {
      return $http.get('/roi/interactions/channel/' + businessName);
    };

    this.fetchAverageImpressionsPerChannel = function() {
      return $http.get('/roi/impressions/average/channel');
    };

    this.fetchAverageInteractionsPerChannel = function() {
      return $http.get('/roi/interactions/average/channel');
    };

    this.fetchRecentImpressionsForBusiness = function(businessName) {
      return $http.get('/roi/impressions/' + businessName);
    };

    this.fetchRecentInteractionsForBusiness = function(businessName) {
      return $http.get('/roi/interactions/' + businessName);
    };

    this.fetchAverageImpressions = function() {
      return $http.get('/roi/average/impressions');
    };

    this.fetchAverageInteractions = function() {
      return $http.get('/roi/average/interactions');
    };

    this.fetchInteractionsForBusinessByBookAndDate = function(businessName, book, year, month) {
      return $http.get('/roi/interactions/' + businessName +'/' + book + '/' + year + '/' + month);
    };

    this.fetchDataToListimpressionsPerChannelByBookFromLastMonth = function(businessName, book, year, month) {
      return $http.get('/roi/impressionsPerChannel/' + businessName + '/' + book + '/' + year + '/' + month);
    };

    this.fetchRecentImpressionsForBusinessByBook = function(businessName, book) {
      return $http.get('/roi/impressions/' + businessName + '/' + book);
    };

    this.fetchRecentImpressionsForBusiness = function(businessName) {
      return $http.get('/roi/impressions/' + businessName);
    };

    this.fetchSearchImpressionsByLocationForBusiness = function(businessName, limit) {
      limit = limit || 8;
      return $http.get('/roi/searchImpressionLocations/' + businessName + "/" + limit);
    };

    this.fetchSearchImpressionsByTimeForBusiness = function(businessName) {
      return $http.get('/roi/searchImpressionTimes/' + businessName);
    };

    this.fetchDirectImpressionsByTimeForBusiness = function (businessName) {
      return $http.get('/roi/directImpressionTimes/' + businessName);
    };

    this.fetchActionsByTimeForBusiness = function (businessName) {
      return $http.get('/roi/actionTimes/' + businessName);
    };

    this.fetchDataForStateRollupReport = function(businessName, state, year, month) {
      return $q.all([
             $http.get('/roi/interactionsPerBook/' + businessName + '/' + state + '/' + year + '/' + month),
             $http.get('/roi/impressionsPerBook/' + businessName + '/' + state + '/' + year + '/' + month)
          ]);
    };

    this.makeChartData = function(chartType) {
      return {
        "type": chartType,
        "displayed": true,
        "cssStyle": "height:600px; width:100%;",
        "data": {},
        "options": {
          "titleTextStyle": { "color": "#7F8C8D", "fontSize" : 40 },
          "legend": {position: 'right', textStyle: {color: '#aaa', fontSize: 20}},
          "title": "",
          "isStacked": "true",
          "fill": 20,
          "displayExactValues": true,
          "hAxis": {
            textStyle: {fontSize: 20},
            "title": "Date",
            "titleTextStyle": { "fontSize" : 30 },
            "gridlines": {
              "count": 10
            }
          },
          "animation":{
            "duration": 200,
            "easing": 'out',
          },
          "vAxis": {
            textStyle: {fontSize: 20},
            "title": "Actions",
            "titleTextStyle": { "fontSize" : 30 }
          }
        },
        "isDetailsExpanded": false
      };
    };

  }]);
