'use strict';

angular.module('roiBigQuerySpike')
  .controller('SearchImpressionLocationCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {

    console.log('Search impression location controller started');

    $scope.isLoadingSearchImpressionLocations = false;

    var fetchAndDisplaySomeInfo = function () {
      var timeSpent = 0;
      var expectedTimeToLoad = 4.5;
      var loaded = false;

      var interval = setInterval(function() {
        timeSpent += 0.1;
        $(".progress-bar").css("width", (timeSpent / expectedTimeToLoad)  * 100 + "%");
        console.log(loaded, timeSpent > 100);
        if(loaded && (timeSpent / expectedTimeToLoad) > 1.2) {
          $scope.isLoadingSearchImpressionLocations = false;
          $("#locations_chart_div_container").css("display","block");
          clearInterval(interval);
          $(".progress-bar").css("display", "none");
        }
      }, 100);

      $scope.isLoadingSearchImpressionLocations = true;
      var promise = Roiservice.fetchSearchImpressionsByLocationForBusiness($scope.businessName);
      $scope.isLoadingInteractionsByBook = true;
      promise.success(function(resp, status, headers, config) {
        var chartData = [];

        for(var x = 0; x < resp.list.length; x++) {
          chartData.push([resp.list[x].suburb + ', ' + resp.list[x].state, parseInt(resp.list[x].impression_count, 10)]);
        }

        drawChart();

        function drawChart() {
          // Create the data table.
          var data = new google.visualization.DataTable();
          data.addColumn('string', 'Suburb');
          data.addColumn('number', 'Impressions');
          data.addRows(chartData);

          var options = {'title': 'Top 8 most common search locations users are searching in, for"' + $scope.businessName + '"',
            titleTextStyle: {fontSize: 14},
            'width': 800,
            legend : {textStyle: {fontSize: 20}},
            hAxis : {textStyle: {fontSize: 20}},
            VAxis : {textStyle: {fontSize: 20}},
            'height': 600};

          var chart = new google.visualization.PieChart($("#locations_chart_div")[0]);
          chart.draw(data, options);
          loaded = true;
        }
      }).error(function(data, status, headers, config) {
        console.log('Failed to download search interactions');
      });
    }

//        fetchSearchImpressionsByLocationForBusiness


    // TODO: the following two watches are repeated in every controller
    $scope.$watch('businessName', function(newValue, oldValue) {
      if (!$scope.businessName) return;
        $("#locations_chart_div_container").css("display","none");
        fetchAndDisplaySomeInfo();
    }, true);

    $scope.$watch('state', function(newValue, oldValue) {
      if ($scope.state && $scope.businessName && newValue != oldValue) {
        fetchAndDisplaySomeInfo();
      }
    }, true);
  }]);
