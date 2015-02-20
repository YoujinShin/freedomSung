L.mapbox.accessToken = 'pk.eyJ1IjoibWVnZ29uYWd1bCIsImEiOiI1cFpUOE5RIn0.jooCCIM584kmRt2nkSOcHw';

// color: examples.map-i86nkdio
// grey: examples.map-20v6611k
// satellite: examples.map-2k9d7u0c
var map = L.map('map', {
    // zoomControl: false
}).setView([-26.204407,28.037939 + 1.7], 8);

var base_layer = L.mapbox.tileLayer('examples.map-20v6611k');
base_layer.setOpacity(0.7);
base_layer.addTo(map);

queue()
  .defer(d3.csv, "event.csv")
  .await(makeTimeline);

var parseDate = d3.time.format("%m/%d/%y").parse;

function makeTimeline(error, data) {
	data.forEach(function(d) {
		d.start = parseDate(d.start);
		Init(d);
	});
}

function Init(d) {
	var lat = d.start_lat;
	var lon = d.start_lon;

	var myIcon = L.icon({
	    iconUrl: '/img/texture.png',
	    iconSize: [10, 10],
	    opacity: 0.0
	});

	var marker = L.marker([ lat, lon ], { icon: myIcon });
	
    var feature = marker.feature;
    // var images = feature.properties.images
    var slideshowContent = '';

    // for(var i = 0; i < images.length; i++) {
        var img = d.pic;
        i = 0;

        slideshowContent += '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                              '<img src="' + img + '" />' +
                              '<div class="caption">' + lat +","+ lon + '</div>' +
                            '</div>';

    var popupContent = 
    					// '<div id="' + d.event + '" class="popup">' +
                            '<h2>' + d.event + '</h2>' +
                            '<div class="slideshow">' +
                                slideshowContent +
                            '</div>' +
                            '<div class="cycle">' +
                                '<a href="#" class="prev">&laquo; Previous</a>' +
                                '<a href="#" class="next">Next &raquo;</a>' +
                            '</div>'
                        // '</div>'

    marker.bindPopup(popupContent,{
        closeButton: false,
        minWidth: 320,
        maxWidth: 320
    });

    marker.openPopup();
    marker.addTo(map);
	// marker.setOpacity(0.6);

	// marker.openPopup();

	// marker.eachLayer(function(m) {
	// 	m.openPopup();
	// });
}




