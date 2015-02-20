var margin = { top: 30, right: 10, left: 10, bottom: 30 };

var width = 100,
	width = width - margin.left - margin.right,
	height = 500,
	hegiht = height - margin.top - margin.bottom;

var width2 = 300,
	height2 = 300;

var y = d3.time.scale()
	.range([0, height]);

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.innerTickSize([20])
	.ticks(12);

// var smallScale = 128;
// var largeScale = 1269;
var smallScale = 110;
var largeScale = 1000;

var scrollScale = d3.scale.linear()
	.domain([smallScale, largeScale])
	.range([0,height]);

var tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip");

var cityname = d3.select("body")
  .append("div")
  .attr("id", "cityname");

var date = d3.select("body")
  .append("div")
  .attr("id", "date");

var svg_black = d3.select("#black").append("svg")
		.attr("width", 200)
		.attr("height",  screen.height)
	.append("g")
		.attr("transform", "translate("+0+","+0+")");

var svg = d3.select("#timeline").append("svg")
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");

var dot = svg.append("circle")
		.attr("cx", width/2)
		.attr("cy", 0)
		.attr("r", 3)
		.style("fill", "rgba(255,255,255,1")
		.style("visibility", "hidden");

var events;
var axis;
var current;
var current2;

// For the map
var proj = d3.geo.mercator()
  .center([ 28.05097, -26.20192 ]) // center [lon, lat]
  .scale(14000) // 6500
  .translate([width2/2, height2/2]);

var path = d3.geo.path().projection(proj);

var svg_city = d3.select("#citymap").append("svg")
		.attr("width", width2 + margin.left + margin.right)
		.attr("height", height2 + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");

// var g = svg_city.append("g")
//       	.attr("class", "boundary")
// 		.append("path")
//       	.attr("d", path);

function makeTimeline(data, city) {
	// console.log(city.features);

    svg_city.append("g")
      .attr("class", "boundary")
      .selectAll("path")
        .data(city.features) // geojson
	  .enter().append("path")
      	.attr("d", path);

    current = svg_city.append("circle")
     .style("fill", "white")
     .attr("class", "circle")
     .style("opacity", 1)
     .attr("r", 3 )
     .attr("transform", function(d) {
      return "translate("+
        proj([ 28.05097, -26.20192  ])  // lon, lat
      + ")"
     });

     current2 = svg_city.append("circle")
     .attr("class", "circle")
     .style("fill", "white")
     .style("opacity", 0.4)
     .attr("r", 12 )
     .attr("transform", function(d) {
      return "translate("+
        proj([ 28.05097, -26.20192  ])  // lon, lat
      + ")"
     });


	data.forEach(function(d) {
		d.date = d.start;
		d.start = parseDate(d.start);
	});

	y.domain(d3.extent(data, function(d) { return d.start; }));

	svg.append("rect")
		.attr("x", -margin.left)
		.attr("y", -margin.top)
		.attr("width", width + margin.left + margin.right)
		.attr("height", height + margin.top + margin.bottom)
		.style("fill", "#000")
		.style("opacity", 0);

	// svg_black.append("rect")
	// 	.attr("x", 0)
	// 	.attr("y", 0)
	// 	.attr("width", 200)
	// 	.attr("height", screen.height)
	// 	.style("fill", "#000")
	// 	.style("opacity", 0.9);

	events = svg.selectAll(".dot")
			.data(data)
		.enter().append("line")
			// .attr("class", "line")
			.attr("x1", function(d) { return width/2-7; })
			.attr("y1", function(d) { return y(d.start); })
			.attr("x2", function(d) { return width/2+7; })
			.attr("y2", function(d) { return y(d.start); })
			.attr("y2", function(d) { return y(d.start); })
			.style("stroke", "#fff")
			.style("stroke-width", "2px")
			.style("visibility", "hidden");

	var temp = width/2 + 10;

	// axis = svg.append("g")
	// 	.attr("class", "axis")
	// 	.attr("transform", "translate("+ temp +", 0)")
	// 	.style("visibility", "hidden")
	// 	.style("text-anchor", "start")
	// 	.call(yAxis);
}

function hideTimeline() {
	dot.style("visibility", "hidden");
	events.style("visibility", "hidden");
	// axis.style("visibility", "hidden");
}

var eventname = 'test';

function updateTimeline(d) {
	if(d<smallScale) {  d = smallScale; } 
	if(d>largeScale) { d = largeScale; }

	var mouseY = scrollScale(d);

	dot.attr("cy", mouseY); 
	dot.style("visibility", "visible");
	events.style("visibility", "visible");
	// axis.style("visibility", "visible");

	svg.selectAll("line").each(function(e) {
		var distance = Math.abs( d3.select(this).attr("y2") - mouseY );
		if(distance < 1.2) {
			// console.log('selected!');
			d3.select(this).attr("x1", width/2 - 23);

			var t = mouseY + 123;
			tooltip.style("visibility", "hidden");
			tooltip.text(e.event);
			// tooltip.text(e.event);
			// tooltip.style("top", 47+"%").style("left",50.5+"%");
			// tooltip.style("top", t+"px").style("left",110+"px");

			date.style("visibility", "visible");
    		date.text(e.date);
    		date.style("top", t+"px").style("right",90+"px");

    		if(e.event != eventname) {
    			// console.log('change');
				tempMarker.setLatLng([e.start_lat, e.start_lon ]);
				// circleMarker.setLatLng([e.start_lat, e.start_lon ]);
				// circleMarker.setLatLng(L.latLng(e.start_lat, e.start_lon));
				// map.setView([e.start_lat - (-0.00), e.start_lon - (-0.01)], 11); // 12, 16
				// var diff = e.start_lat + 0.008;
				map.setView([e.start_lat, e.start_lon], 11); // 16, 9

				openImg(e);
				eventname = e.event;

				// current.attr("transform", "translate("+0+","+0+")");
				var current_position = proj([ e.start_lon, e.start_lat ]); // lon, lat
				current.attr("transform", "translate("+ current_position +")");
				current2.attr("transform", "translate("+ current_position +")");
			}
		} else {
			d3.select(this).attr("x1", width/2 - 7);
			// tooltip.style("visibility", "hidden");
		}
	});
}

function openImg(d) {
	// $('#image').empty().append('<img id="myImg" src="'+d.pic+'"width="300px">');
	// console.log(d.type);
	
    var slideshowContent;

    if(d.type == 'pic') {

    	var temp_pic = '\''+d.pic+'\'';

    	slideshowContent =
    					'<h3>' + d.event + '</h3>' + 
    					'<img src="' + d.pic + '"'
    						+ ' style="cursor:pointer" '
    						+ 'onclick="showImage('+ temp_pic+');"'
    					+ ' />' 
    					+'<div class="caption">' + '</div>';

    }else if(d.type == 'video') {
    	slideshowContent = '<h3>' + d.event + '</h3>' + d.video;
    }
    // '<img src="1_small.jpeg" style="cursor:pointer" onclick="showImage('1_large.jpeg');" />

    var popupContent = slideshowContent;

    tempMarker.bindPopup(popupContent,{
        closeButton: false,
        minWidth: 460,
        maxWidth: 800
        // maxWidth: 300
    });

    tempMarker.openPopup();
}

