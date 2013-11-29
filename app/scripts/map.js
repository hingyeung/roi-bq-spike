var map;

//limiting min and max zoom
var zoom_change_callback = function() {
  if (map.getZoom() > MAX_ZOOM)
  {
    map.setZoom(MAX_ZOOM);
  }

  if (map.getZoom() < MIN_ZOOM)
  {
    map.setZoom(MIN_ZOOM);
  }
};

var MIN_ZOOM = 4;
var MAX_ZOOM = 12;


//over-riding google maps styling to make the map background less noisy
var mapStyles = [
    {
      stylers: [
        { hue: "#00ffe6" },
        { saturation: -20 }
      ]
    },{
      featureType: "road",
      elementType: "geometry",
      stylers: [
        { lightness: 100 },
        { visibility: "simplified" }
      ]
    },{
      featureType: "road",
      elementType: "labels",
      stylers: [
        { visibility: "off" }
      ]
    }
  ];

function initializeMap(heatMapData) {

console.log("initialize map");
console.log(heatMapData);

//create the map
map = new google.maps.Map(document.getElementById('map-canvas'), {
  center: new google.maps.LatLng(-24.846565, 132.789001),
  zoom: MIN_ZOOM,
  styles: mapStyles
});
//heatmap.set('dissipate', true);

setTimeout(function(){
  var heatmap = new google.maps.visualization.HeatmapLayer({
  data: heatMapData
});

  heatmap.set('radius', 20);
  heatmap.set('dissipating', true);
  heatmap.setMap(map);
  
  google.maps.event.addListener(map, 'zoom_changed', zoom_change_callback);

  debugMap = map;
  debugHeatMap = heatmap;

}, 0);
}

google.maps.event.addDomListener(window, 'load', initializeMap);

console.log("my javascript got executed from the js");
