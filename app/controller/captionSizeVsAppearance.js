angular.module('roiBigQuerySpike')
  .controller('CaptionSizeVsAppearance', ['$scope', 'Roiservice', function ($scope, Roiservice) {
  	console.log('CaptionSizeVsAppearance');

  	var fetchCaptionSizeVsAppearance = function() {
  		var promise = Roiservice.fetchCaptionSizeVsAppearance();

  		promise.success(function(resp, status, headers, config) {
  			
        var cols = [{id: "captionSize", label: "Caption Size", type: "number"}, {id:"count", label:"Appearances", type:"number"}]
          , rows = []
          , data = resp.list;
        console.log(data);
        // for (var idx = 0; idx < data.length; idx++) {
        //   rows.push({c: [ { v: data[idx].caption_size }, { v: data[idx].appearance_count } ]});
        // }
        // $scope.sizeMattersChart = Roiservice.makeChartData('ColumnChart');
        // $scope.sizeMattersChart.options.vAxis.title = "Total Appearences";
        // $scope.sizeMattersChart.data = {rows: rows, cols: cols};
        // $scope.sizeMattersChart.query = resp.query;
        // $scope.sizeMattersChart.cacheHit = resp.cacheHit;
        // $scope.sizeMattersChart.totalBytesProcessed = resp.totalBytesProcessed;
        // $scope.sizeMattersChart.options.title = 'Caption Size vs No. of Appearance'
        // $scope.sizeMattersChart.options.hAxis.title = 'Caption Size';

        function drawChart() {
          rows.push(['Caption Size', 'Appearances']);
          for (var idx = 0; idx < data.length; idx++) {
            rows.push([parseInt(data[idx].caption_size), parseInt(data[idx].appearance_count)]);
          }
          console.log(rows);

          var options = {
            title: 'Caption Size vs Appearances',
            hAxis: {title: 'Caption Size'}
          };

          var chart = new google.visualization.ColumnChart(document.getElementById('dashboard'));
          chart.draw(google.visualization.arrayToDataTable(rows), options);
        }

        drawChart();
  		}).error(function(resp, status, headers, config) {
        console.log('Failed to download catpion size vs appearance');
      });

  	};

    fetchCaptionSizeVsAppearance();
	}]);