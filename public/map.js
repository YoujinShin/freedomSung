// var population = new L.LayerGroup(); // population layer

// populcation data
var rateById = d3.map();

var quantize = d3.scale.quantize()
	.domain([0, 3300])
	.range(d3.range(9).map(function(i) { return "q"+i+"-9"; }));


queue() // upload data using queue 
	// .defer(d3.json, "skorea-provinces-topo.json")
	.defer(d3.csv, "event_loc.csv")
	.await(ready);


function ready(error, locs) {
	// console.log(locs);
	locs.forEach(function(d) {
		// console.log(d.start_lat);
		var lat = d.start_lat;
		var lon = d.start_lon;

		var marker = L.marker([lat, lon]).addTo(map);

		// var circle = L.circle([lat, lon], 1000, {
		//     color: 'red',
		//     weight: 1,
		//     fillColor: '#f03',
		//     fillOpacity: 0.5,
		//     opacity: 1
		// }).addTo(map);
	});
	// console.log("geographic data uploaded");

	// // var municipalities = topojson.object(kor, kor.objects['skorea-municipalities-geo']);
	// // var geometries = municipalities.geometries;
	
	// var provinces = topojson.object(kor, kor.objects['skorea-provinces-geo']);
	// var geometries = provinces.geometries;

	// L.geoJson(geometries, {
	// 	style: function(feature) {
	// 		// console.log(feature.geometry.properties.NAME_1);
	// 		var name = feature.geometry.properties.NAME_1;
	// 		// console.log(name);
	// 		var c = getColor( quantize( rateById.get(name) ) );

	// 		return {
	// 			color: 'white',
	// 			weight: 2,
	// 			fillColor: c,
	// 			fillOpacity: 0.9
	// 		};
	// 	},
	// 	onEachFeature: onEachFeature
	// }).addTo(map);
}


//  maps
var mbUrl = 'https://{s}.tiles.mapbox.com/v3/{id}/{z}/{x}/{y}.png';

var grayscale   = L.tileLayer(mbUrl, {id: 'examples.map-20v6611k'}),
	streets  = L.tileLayer(mbUrl, {id: 'examples.map-i875mjb7'});

var map = L.map('map', {
	center: [ -26.2575162, 27.9332975 ],
	zoom: 9,
	layers: grayscale
});


// layers
var baseLayers = {
	"Grayscale": grayscale
	// "Streets": streets
};

// L.control.layers(baseLayers).addTo(map);


function getColor(d) {
	switch(d) {
		case 'q0-9': return "rgb(247,251,255)";
		case 'q1-9': return "rgb(222,235,247)";
		case 'q2-9': return "rgb(198,219,239)";
		case 'q3-9': return "rgb(158,202,225)";
		case 'q4-9': return "rgb(107,174,214)";
		case 'q5-9': return "rgb(66,146,198)";
		case 'q6-9': return "rgb(33,113,181)";
		case 'q7-9': return "rgb(8,81,156)";
		case 'q8-9': return "rgb(8,48,107)";
	}
}
