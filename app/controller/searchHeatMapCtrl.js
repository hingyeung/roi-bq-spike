'use strict';

angular.module('roiBigQuerySpike')
  .controller('SearchHeatMapCtrl', ['$scope', 'Roiservice', function ($scope, Roiservice) {

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
      var promise = Roiservice.fetchSearchImpressionsByLocationForBusiness($scope.businessName, 1000);
      $scope.isLoadingInteractionsByBook = true;
      promise.success(function(resp, status, headers, config) {
      console.log("promise came back with " + resp.list.length + " results");  

        //var geocoder = new google.maps.Geocoder();

        

resp.list.map( function(suburbInfo) {
     var address = suburbInfo.suburb + ", " + suburbInfo.state + ", Australia";

     // console.log("adding " + address + "with count " + suburbInfo.impression_count );
     //geocoder.geocode({ 'address': suburbInfo.suburb}, addLocationToHeatMap.bind(suburbInfo));
})
        $scope.searchHeatMapData = "data";
        $scope.isLoadingSearchImpressionLocations = false;
        initializeMap();
        
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
