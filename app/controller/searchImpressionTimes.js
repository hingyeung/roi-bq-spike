'use strict';

angular.module('roiBigQuerySpike')
    .controller('SearchImpressionTimesCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {
      $scope.isLoadingSearchImpressionLocations = false;
      var timeSpent = 0;
      var expectedTimeToLoad = 4.5;
      var loaded = false;
      var searchImpressionData, directImpressionData, actionData;

      var fetchAndDisplaySomeInfo = function () {


        var interval = setInterval(function () {
          timeSpent += 0.1;
          $(".progress-bar").css("width", (timeSpent / expectedTimeToLoad) * 100 + "%");
          console.log(loaded, timeSpent > 100);
          if (searchImpressionData &&
              directImpressionData &&
              actionData && (timeSpent / expectedTimeToLoad) > 1.2) {
            $scope.isLoadingSearchImpressionLocations = false;
            $("#times_chart_div_container").css("display", "block");
            clearInterval(interval);
            $(".progress-bar").css("display", "none");
            loadChart();
          }
        }, 100);

        var searchPromise = Roiservice.fetchSearchImpressionsByTimeForBusiness($scope.businessName);
        var directPromise = Roiservice.fetchDirectImpressionsByTimeForBusiness($scope.businessName);
        var actionPromise = Roiservice.fetchActionsByTimeForBusiness($scope.businessName);

        $scope.isLoadingSearchImpressionLocations = true;


        searchPromise.success(function (resp, status, headers, config) {
          searchImpressionData = resp.list
        }).error(function (data, status, headers, config) {
              console.log('Failed to download search interactions');
            });

        directPromise.success(function (resp, status, headers, config) {
          directImpressionData = resp.list
        }).error(function (data, status, headers, config) {
              console.log('Failed to download search interactions');
            });

        actionPromise.success(function (resp, status, headers, config) {
          actionData = resp.list
        }).error(function (data, status, headers, config) {
              console.log('Failed to download search interactions');
            });
      }
      // TODO: the following two watches are repeated in every controller
      $scope.$watch('businessName', function () {
        if (!$scope.businessName) return;
        fetchAndDisplaySomeInfo();
      });


      var loadChart = function () {
        var chartData = [
          ['Type', 'Search Impressions', 'Direct Impressions', 'Actions', { role: 'annotation' } ]
        ];

        for (var x = 0; x < directImpressionData.length; x++) {
          chartData.push([
            time(searchImpressionData[x].hour),
            parseInt(searchImpressionData[x].impression_count, 10),
            parseInt(directImpressionData[x].impression_count, 10),
            parseInt(actionData[x].impression_count, 10),
            ''
          ]);
        }

        var data = google.visualization.arrayToDataTable(chartData);


        var options = {'title': 'All types of interactions for "' + $scope.businessName + '"',
          'width': 1400,
          'height': 600,
          isStacked: true,
          vAxis: {
            textStyle: {
              fontSize: 20
            }
          },
          legend: { position: 'top', maxLines: 3 }
        };

        var chart = new google.visualization.ColumnChart($("#times_chart_div")[0]);
        chart.draw(data, options);
        loaded = true;
      }

      var time = function (timeString) {
        return (parseInt(timeString, 10) < 10 ? "0" + timeString : timeString ) + ":00";
//        return {
//            0 : "12am",
//            1 : "01am",
//            2 : "02am",
//            3 : "03am",
//            4 : "04am",
//            5 : "05am",
//            6 : "06am",
//            7 : "07am",
//            8 : "08am",
//            9 : "09am",
//            10 : "10am",
//            11 : "11am",
//            12 : "12pm",
//            13 : "01pm",
//            14 : "02pm",
//            15 : "03pm",
//            16 : "04pm",
//            17 : "05pm",
//            18 : "06pm",
//            19 : "07pm",
//            20 : "08pm",
//            21 : "09pm",
//            22 : "10pm",
//            23 : "11pm"
//        }[timeString];
      }
    }]);
