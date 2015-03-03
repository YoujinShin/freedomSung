// Tayo
L.mapbox.accessToken = 'pk.eyJ1Ijoib2pvbGFvIiwiYSI6IlVMbWRBRDAifQ.fGYcIjLhkNO5xFAUcXNtmw';

// color: examples.map-i86nkdio
// grey: examples.map-20v6611k
// satellite: examples.map-2k9d7u0c
// white: examples.map-8ced9urs'
// 'https://stamen-tiles-{s}.a.ssl.fastly.net/toner/{z}/{x}/{y}.png'

var map = L.map('map', {
    zoomControl: false
}).setView([-26.204407 + 8,28.037939 + 30], 4);

var scrollTop = 0;

// new L.Control.Zoom({ position: 'topright' }).addTo(map);

// Disable drag and zoom handlers.
// map.dragging.disable();
// map.touchZoom.disable();
// map.doubleClickZoom.disable();
map.scrollWheelZoom.disable();

// Disable tap handler, if present.
if (map.tap) map.tap.disable();

var base_layer = L.mapbox.tileLayer('examples.map-2k9d7u0c');
base_layer.setOpacity(1);
base_layer.addTo(map);

queue()
  // .defer(d3.csv, "event2.csv")
  .defer(d3.csv, "event_final2.csv")
  .defer(d3.json, "johannesburg.geojson")
  .await(ready);

var parseDate = d3.time.format("%m/%d/%y").parse;

var cityLayer = L.mapbox.featureLayer();
var centerLayer = L.mapbox.featureLayer();

var myIcon = L.icon({
      iconUrl: '/img/texture.png',
      iconSize: [13, 13]
});

var circleRadius = 170; //1200;

var tempMarker = L.circle([ -26.20192, 28.05097 ], circleRadius, {
    // color: 'rgba(255,0,0,1)',
    // color: '#F44336',
    color: '#FFEB3B',
    opacity: 1,
    weight: 0,
    fillOpacity: 0.0
}).addTo(cityLayer);

function ready(error, data, city) {
	data.forEach(function(d) {
		Init(d);
	});

  makeTimeline(data, city);

  var RADIUS = 300000;
  // var RADIUS = 3000;
  var filterCircle = L.circle([-26.1715215,28.0400245], RADIUS, {
      color: '#fff',
      opacity: 0,
      weight: 0,
      fillOpacity: 0.3
  }).addTo(centerLayer);

  L.circle([-26.1715215,28.0400245], RADIUS/10, {
      color: '#fff',
      opacity: 0,
      weight: 0,
      fillOpacity: 0.8
  }).addTo(centerLayer);

  var cityStyle = {
      fillColor: '#fff',
      fillOpacity:0,
      color: '#fff',
      opacity: 0,
      weight: 1
  };

  var center = L.geoJson(city, {
    style: cityStyle
  }).addTo(cityLayer); // boundary of city on the map

  centerLayer.addTo(map);
}

function Init(d) {
	var lat = d.start_lat;
	var lon = d.start_lon;

	// var marker = L.marker([ lat, lon ], { icon: myIcon });	
  var marker = L.circle([ lat, lon ], circleRadius/8, {
      // color: 'rgba(255,0,0,1)',
      // color: '#F44336',
      color: '#FFEB3B',
      opacity: 1,
      weight: 0,
      fillOpacity: 0.0
  });

  var feature = marker.feature;
  var slideshowContent = '';
  var img = d.pic;

  var slideshowContent = '<div class="image' +
                            '<img src="' + img + '" />' +
                            '<div class="caption">' + lat +","+ lon + '</div>' +
                          '</div>';

  var popupContent =      '<h2>' + d.event + '</h2>' +
                            '<div class="slideshow">' +
                                slideshowContent +
                          '</div>';

  marker.openPopup();
  marker.addTo(cityLayer);
  // marker.addTo(markerLayer);

  var textMarker = L.marker([ lat, lon ], {
    icon: L.divIcon({
        className: 'label',
        // color: #fff,
        html: d.event,
        iconSize: [180, -5]
    })
  });

  // textMarker.addTo(cityLayer);
}
var change = 0;

onscroll = function() {
  scrollTop = document.documentElement.scrollTop || document.body.scrollTop;  

  if (scrollTop < 80) {

    change = 0;

    base_layer.setOpacity(1);
    hideTimeline();

    centerLayer.addTo(map);
    // map.removeLayer(markerLayer);
    map.removeLayer(cityLayer);

    map.setView([-26.204407 + 8,28.037939 + 30], 4);

    $('#h1').css({"visibility":"visible"});
    $('#h2').css({"visibility":"visible"});
    $('#intro').css({"visibility":"visible"});
    $('#scroll').css({"visibility":"visible"});

    $('#h1_2').css({"visibility":"hidden"});
    $('#h5').css({"visibility":"hidden"});
    $('.boundary').css({"visibility":"hidden"});
    $('.circle').css({"visibility":"hidden"});

    $('#image').css({"visibility":"hidden"});
    $('#pointing').css({"visibility":"hidden"});
    $('#southAftica').css({"visibility":"hidden"});

    $('#current_date').css({"visibility":"hidden"});

    tooltip.style("visibility", "hidden");
    cityname.style("visibility", "hidden");
    bg_city.style('visibility', 'hidden');
    bg_timeline.style("visibility", "hidden");

    date.style("visibility", "hidden");

    eventname = 'test';

    if(scrollTop > 40) {
       updateTimeline(scrollTop);
    }

  } else if(scrollTop >= 80) {

    base_layer.setOpacity(0.5);

    if(change == 0) {
      tempMarker.setLatLng([-26.20192,28.05097 ]);
      map.setView([-26.20192,28.05097], 14); 

      change = 1;
    }

    map.removeLayer(centerLayer);
    cityLayer.addTo(map);
    updateTimeline(scrollTop);
    
    // map.removeLayer(markerLayer);
    // map.removeLayer(centerLayer);
    bg_timeline.style("visibility", "visible");

    cityname.style("visibility", "visible");
    // cityname.text("Johannesburg, South Africa");
    cityname.html("Johannesburg<br> South Africa");

    var pos_y = $(window).height() * 0.5 + 260;
    cityname.style("top",pos_y+"px").style("left",132+"px");
    bg_city.style('visibility', 'visible');

    // map.setView([-26.204407,28.037939+0.7], 9); // 12
    // map.setView([-26.204407,28.037939+0.3], 10);

    $('#h1').css({"visibility":"hidden"});
    $('#h2').css({"visibility":"hidden"});
    $('#intro').css({"visibility":"hidden"});
    $('#scroll').css({"visibility":"hidden"});

    $('#h1_2').css({"visibility":"visible"});
    $('#h5').css({"visibility":"visible"});
    $('.boundary').css({"visibility":"visible"});
    $('.circle').css({"visibility":"visible"});

    $('#current_date').css({"visibility":"visible"});

    $('#image').css({"visibility":"visible"});
    $('#pointing').css({"visibility":"visible"});
    $('#southAftica').css({"visibility":"visible"});
  } 
};

// Enlarge image
function showImage(imgName) {
    document.getElementById('largeImg').src = imgName;
    showLargeImagePanel();
    unselectAll();
}
function showLargeImagePanel() {
    document.getElementById('largeImgPanel').style.visibility = 'visible';
}
function unselectAll() {
    if(document.selection) document.selection.empty();
    if(window.getSelection) window.getSelection().removeAllRanges();
}
function hideMe(obj) {
    obj.style.visibility = 'hidden';
}

