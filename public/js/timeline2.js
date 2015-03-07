var margin = { top: 30, right: 5, left: 5, bottom: 30 };

var width = 50,
	width = width - margin.left - margin.right,
	height = $(window).height() * 0.6,
	hegiht = height - margin.top - margin.bottom;

var width2 = 200,
	height2 = 260;

var y = d3.time.scale()
	.range([2, height]);

var smallScale = 80;	//128
var largeScale = 1800;	//1269

var scrollScale = d3.scale.linear()
	.domain([smallScale, largeScale])
	.range([0,height]);

var tooltip = d3.select("body")
  .append("div")
  .attr("id", "tooltip");

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

var events;
var axis;
var current;
var current2;

// For the map
var proj = d3.geo.mercator()
  .center([ 28.05097, -26.20192 ]) // center [lon, lat]
  .scale(11000) // 6500 //14000
  .translate([width2/2, height2/2]);

var path = d3.geo.path().projection(proj);

var svg_city = d3.select("#citymap").append("svg")
		.attr("width", width2 + margin.left + margin.right)
		.attr("height", height2 + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");

var pos_y2 = $(window).height() * 0.15 + 85;
$('#citymap').css("top", pos_y2+"px");

var pos_y1 = $(window).height() * 0.15 + 410;
$('#current_date').css("top", pos_y1+"px");

var g = svg_city.append("g")
      	.attr("class", "boundary")
		.append("path")
      	.attr("d", path);

var bg_city = svg_city.append('rect')
	.attr('x', -margin.left)
	.attr('y', -margin.top)
	.attr('width', width2 + margin.left + margin.right)
	.attr('height', height2 + margin.top + margin.bottom)
	.style('visibility', 'hidden')
	.attr('stroke', 'rgba(255,255,255,1)')
	.attr('stroke-width', 0)
	.attr('rx', 6)
	.style('fill', 'rgba(255,255,255,0.0)');

var bg_timeline = svg.append("rect")
		.attr("x", 5)
		.attr("y", -30)
		.attr("width", width-10)
		.attr("height", height+60)
		.style("fill", "#000")
		.attr('rx', 6)
		.style('visibility', 'hidden')
		.style("opacity", 0.45);

var stateLine = svg.append("line")
			.attr("x1", width/2)
			.attr("y1", 0 )
			.attr("x2", width/2)
			.attr("y2", 0 )
			// .style("stroke", "#FFEB3B")
			.style("stroke", "#fff")
			.style('opacity', 0.4)
			.style("stroke-width", 1.2)
			.style("visibility", "hidden");

var dot = svg.append("circle")
		.attr("cx", width/2)
		.attr("cy", 0)
		.attr("r", 5.2)
		.attr('stroke', '#FFEB3B')
		.attr('stroke-width', 1.3)
		.style("fill-opacity", 0)
		.style("visibility", "hidden");

function makeTimeline(data, city) {

    svg_city.append("g")
      .attr("class", "boundary")
      .selectAll("path")
        .data(city.features) // geojson
	  .enter().append("path")
      	.attr("d", path);

    current = svg_city.append("circle")
		.style("fill", "#FFEB3B")
		.attr("class", "circle")
		.style("opacity", 1)
		.attr("r", 3.5 )
		.attr("transform", function(d) {
			return "translate("+
				proj([ 28.05097, -26.20192 ])  // lon, lat
			+ ")"
		});

     current2 = svg_city.append("circle")
		.attr("class", "circle")
		.style("fill", "#FFEB3B")
		.attr('stroke', '#FFEB3B' )
		.style('stroke-width', 1.5)
		.style("fill-opacity", 0.0)
		.attr("r", 15 )
		.attr("transform", function(d) {
			return "translate(" +
					proj([ 28.05097, -26.20192 ])  // lon, lat
				+ ")"
    });

	data.forEach(function(d) {
		d.date = d.start;
		d.start = parseDate(d.start);
	});

	y.domain(d3.extent(data, function(d) { return d.start; }));

	events = svg.selectAll(".dot")
			.data(data)
		.enter().append("circle")
			.attr("cx", function(d) { return width/2; })
			.attr("cy", function(d) { return y(d.start); })
			.attr("r", 1.5)
			.style("fill", "#FFEB3B")
			.style('opacity', 0.9)
			.style("stroke", "rgba(0,0,0,0)")
			.style("stroke-width", 0)
			.style("visibility", "hidden");

	var temp = width/2 + 10;
}

function hideTimeline() {
	dot.style("visibility", "hidden");
	events.style("visibility", "hidden");
}

var eventname = 'test';

function updateTimeline(d) {
	if(d<smallScale) {  d = smallScale; } 
	if(d>largeScale) { d = largeScale; }

	var mouseY = scrollScale(d);

	dot.attr("cy", mouseY);
	dot.style("visibility", "visible");
	events.style("visibility", "visible");

	events.each(function(e) {
		var distance = Math.abs( d3.select(this).attr("cy") - mouseY );
		if(distance < 1.2) {

			var t = mouseY + 102;
			tooltip.style("visibility", "hidden");
			tooltip.text(e.event);

			date.style("visibility", "visible");
    		// date.text(e.date);
    		date.style("top", t+"px").style("right",90+"px");

    		$('#current_date').html('<span style="color:yellow">Date : <span><span style="color:white">'
    			+e.date+"</span>");

    		var ty = d3.select(this).attr("cy");
    		stateLine.transition().duration(520).attr('y1', ty);

    		if(e.event != eventname) {
				tempMarker.setLatLng([e.start_lat, e.start_lon ]);
				// marker.properties['marker-color'] = '#ff8888';
				
				// map.setView([e.start_lat, e.start_lon], 13); // 16, 9

				var t = 0.06;

				map.fitBounds([ 
					[e.start_lat - t/2, e.start_lon -t], // southWest [y, x]
					[e.start_lat + t/2, e.start_lon + t] // northEast
				], {
					// this preserves the space from the left of the real map to 200px
					// for content. the format is [x, y]. See
					// http://leafletjs.com/reference.html#map-paddingtopleft
					// for full documentation and other options
					paddingTopLeft: [-240, 480]
				});

				openImg(e);
				eventname = e.event;

				var current_position = proj([ e.start_lon, e.start_lat ]); // lon, lat
				current.attr("transform", "translate("+ current_position +")");
				current2.attr("transform", "translate("+ current_position +")");
			}
		} else {
			d3.select(this).attr("x1", width/2 - 7);
			d3.select(this).style("stroke-width", 1.2)
			// tooltip.style("visibility", "hidden");
		}
	});
}

function openImg(d) {
	
    var slideshowContent;

    if(d.type == 'pic') {
    	var temp_pic = '\''+d.pic+'\'';
    	slideshowContent = '<h3>' + d.event + '</h3>' + 
    					'<img src="' + d.pic + '"'
    						+ ' style="cursor:pointer" '
    						+ 'onclick="showImage('+ temp_pic+');"'
    					+ ' />' 
    					+'<div class="caption">' + '</div>';
    } else if(d.type == 'video') {
    	slideshowContent = '<h3>' + d.event + '</h3>' + d.video;
    }

    var popupContent = slideshowContent;

    tempMarker.bindPopup(popupContent,{
        closeButton: false,
        minWidth: 419,
        maxWidth: 800
    });

    tempMarker.openPopup();
}

