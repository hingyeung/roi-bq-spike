'use strict';

angular.module('roiBigQuerySpike')
    .controller('SearchImpressionTimesCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {
      $scope.isLoadingSearchImpressionLocations = false;

      var fetchAndDisplaySomeInfo = function () {
        var timeSpent = 0;
        var expectedTimeToLoad = 4.5;
        var loaded = false;

        var interval = setInterval(function () {
          timeSpent += 0.1;
          $(".progress-bar").css("width", (timeSpent / expectedTimeToLoad) * 100 + "%");
          console.log(loaded, timeSpent > 100);
          if (loaded && (timeSpent / expectedTimeToLoad) > 1.2) {
            $scope.isLoadingSearchImpressionLocations = false;
            $("#times_chart_div_container").css("display", "block");
            clearInterval(interval);
            $(".progress-bar").css("display", "none");
          }
        }, 100);

        $scope.isLoadingSearchImpressionLocations = true;
        var promise = Roiservice.fetchSearchImpressionsByTimeForBusiness($scope.businessName);
        $scope.isLoadingInteractionsByBook = true;
        promise.success(function (resp, status, headers, config) {
          var chartData = [];

          for (var x = 0; x < resp.list.length; x++) {
            chartData.push([resp.list[x].hour, parseInt(resp.list[x].impression_count, 10)]);
          }

          drawChart();

          function drawChart() {
            // Create the data table.
            var data = new google.visualization.DataTable();
            data.addColumn('string', 'Hour');
            data.addColumn('number', 'Impressions');
            data.addRows(chartData);

            var options = {'title': 'User search impressions broken down by time for "' + $scope.businessName + '"',
              'width': 800,
              'height': 600};

            var chart = new google.visualization.BarChart($("#times_chart_div")[0]);
            chart.draw(data, options);
            loaded = true;
          }
        }).error(function (data, status, headers, config) {
              console.log('Failed to download search interactions');
            });
      }
      // TODO: the following two watches are repeated in every controller
      $scope.$watch('businessName', function () {
        if (!$scope.businessName) return;
        fetchAndDisplaySomeInfo();
      });
    }]);
