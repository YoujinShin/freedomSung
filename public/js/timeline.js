var margin = { top: 30, right: 100, left: 100, bottom: 20 };

var width = parseInt(d3.select('body').style('width'), 10),
	width = width - margin.left - margin.right,
	height = 100,
	hegiht = height - margin.top - margin.bottom;

var parseDate = d3.time.format("%m/%d/%y").parse;

var x = d3.time.scale()
	.range([0, width]);

var xAxis = d3.svg.axis()
	.scale(x)
	.orient("bottom")
	.ticks(7);

var tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip");

var svg = d3.select("#timeline").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");

queue()
  .defer(d3.csv, "event.csv")
  .await(makeTimeline);

function makeTimeline(error, data) {
	// console.log(data);

	d3.select("body").append("p")
		.attr("id", "event")
		.text("Freedomsung");

	var bg = svg.append("rect")
				.datum({type: "LineString", group: "" })
				.attr("x", -margin.left)
				.attr("y", -margin.top)
				.attr("width", width + margin.left + margin.right)
				.attr("height", height + margin.top + margin.bottom)
				.style("fill", "#fff")
				.style("opacity", 0);

	data.forEach(function(d) {
		d.start = parseDate(d.start);
		// Init(d);
	});

	x.domain(d3.extent(data, function(d) { return d.start; }));

	svg.append("g")
		.attr("class", "axis")
		.attr("transform", "translate(0,"+ height/2 +")")
		.style("text-anchor", "start")
		.call(xAxis);

	var selected;

	svg.selectAll(".dot")
			.data(data)
		.enter().append("line")
			.attr("class", "dot")
			.attr("x1", function(d) { return x(d.start); })
			.attr("y1", function(d) { return 46; })
			.attr("x2", function(d) { return x(d.start); })
			.attr("y2", function(d) { return 0; })
			.on("mouseover", function(d) {
				var tempText = tooltip.text(d.event);
				tooltip.style("visibility", "visible");
				d3.select(this).attr("stroke-width", 4);
			})
			.on("mousemove", function(){
				tooltip.style("bottom", 130+"px").style("left",(event.pageX+0)+"px");
			})
			.on("mouseout", function(d) {
				d3.select(this).attr("stroke-width", 2);
				tooltip.style("visibility", "hidden");
			})
			.on("click", function(d) {
				if(d !== selected) {
					d3.select(selected).style("stroke", "rgba(255,255,255,0.8)");
				}

				// $('#event').text(d.event);

				var lat = d.start_lat-(-0.05);
				var lon = d.start_lon-(-0);

				console.log(lat+","+lon)

				// marker.setLatLng([lat, lon]);
				updateMarker(d);
				map.setView([lat, lon], 12);

				// d3.select(this).style("stroke", "rgba(255,0,0,0.7)");
				d3.select(this).style("stroke", "rgba(0,0,0,1)");
				selected = this;
			});
}

function updateMarker(d) {
	var lat = d.start_lat;
	var lon = d.start_lon;

	marker.setLatLng([lat, lon]);
	
    var feature = marker.feature;
    // var images = feature.properties.images
    var slideshowContent = '';

    // for(var i = 0; i < images.length; i++) {
        var img = d.pic;
        i = 0;

        slideshowContent += '<div class="image' + (i === 0 ? ' active' : '') + '">' +
                              '<img src="' + img + '" />' +
                            '</div>';
    // }

    // // Create custom popup content
    // var popupContent =  '<div id="' + feature.properties.id + '" class="popup">' +
    //                         '<h2>' + feature.properties.title + '</h2>' +
    //                         '<div class="slideshow">' +
    //                             slideshowContent +
    //                         '</div>' +
    //                         '<div class="cycle">' +
    //                             '<a href="#" class="prev">&laquo; Previous</a>' +
    //                             '<a href="#" class="next">Next &raquo;</a>' +
    //                         '</div>'
    //                     '</div>';

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
                        ;

    // http://leafletjs.com/reference.html#popup
    marker.bindPopup(popupContent,{
        closeButton: false,
        minWidth: 320
    });

    marker.openPopup();


    // marker.addTo(map);
	// marker.setOpacity(0.6);

	// marker.openPopup();

	// marker.eachLayer(function(m) {
	// 	m.openPopup();
	// });
}

// function Init(d) {
// 	var lat = d.start_lat;
// 	var lon = d.start_lon;

// 	var marker = L.marker([ lat, lon ], {
// 		icon: L.mapbox.marker.icon({
// 			'marker-color': '#fff'
// 		})
// 	});
	
//     var feature = marker.feature;
//     // var images = feature.properties.images
//     var slideshowContent = '';

//     // for(var i = 0; i < images.length; i++) {
//         var img = d.pic;
//         i = 0;

//         slideshowContent += '<div class="image' + (i === 0 ? ' active' : '') + '">' +
//                               '<img src="' + img + '" />' +
//                               '<div class="caption">' + 'caption' + '</div>' +
//                             '</div>';
//     // }

//     // // Create custom popup content
//     // var popupContent =  '<div id="' + feature.properties.id + '" class="popup">' +
//     //                         '<h2>' + feature.properties.title + '</h2>' +
//     //                         '<div class="slideshow">' +
//     //                             slideshowContent +
//     //                         '</div>' +
//     //                         '<div class="cycle">' +
//     //                             '<a href="#" class="prev">&laquo; Previous</a>' +
//     //                             '<a href="#" class="next">Next &raquo;</a>' +
//     //                         '</div>'
//     //                     '</div>';

//     var popupContent = 
//     					// '<div id="' + d.event + '" class="popup">' +
//                             '<h2>' + d.event + '</h2>' +
//                             '<div class="slideshow">' +
//                                 slideshowContent +
//                             '</div>' +
//                             '<div class="cycle">' +
//                                 '<a href="#" class="prev">&laquo; Previous</a>' +
//                                 '<a href="#" class="next">Next &raquo;</a>' +
//                             '</div>'
//                         // '</div>'
//                         ;

//     // http://leafletjs.com/reference.html#popup
//     marker.bindPopup(popupContent,{
//         closeButton: false,
//         minWidth: 320
//     });

//     marker.openPopup();
//     marker.addTo(map);
// 	marker.setOpacity(0.6);

// 	// marker.openPopup();

// 	// marker.eachLayer(function(m) {
// 	// 	m.openPopup();
// 	// });
// }

// marker.eachLayer(function(m) {
//   m.openPopup();
// });



