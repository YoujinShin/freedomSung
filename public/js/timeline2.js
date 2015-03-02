var margin = { top: 30, right: 10, left: 10, bottom: 30 };

var width = 80,
	width = width - margin.left - margin.right,
	height = $(window).height() * 0.75,
	hegiht = height - margin.top - margin.bottom;

var width2 = 200,
	height2 = 260;

var y = d3.time.scale()
	.range([0, height]);

var yAxis = d3.svg.axis()
	.scale(y)
	.orient("left")
	.innerTickSize([20])
	.ticks(12);

// var smallScale = 128;
// var largeScale = 1269;

var smallScale = 80;
var largeScale = 1800;

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
		.attr("r", 4)
		.style("fill", "rgba(255,255,255,1)")
		.style("visibility", "hidden");

var events;
var axis;
var current;
var current2;

// For the map
var proj = d3.geo.mercator()
  .center([ 28.05097, -26.20192 ]) // center [lon, lat]
  .scale(12000) // 6500 //14000
  .translate([width2/2, height2/2]);

var path = d3.geo.path().projection(proj);

var svg_city = d3.select("#citymap").append("svg")
		.attr("width", width2 + margin.left + margin.right)
		.attr("height", height2 + margin.top + margin.bottom)
	.append("g")
		.attr("transform", "translate("+margin.left+","+margin.top+")");

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
	.attr('stroke-width', 1)
	// .style('fill', 'rgba(0,0,0,0.3)');
	.style('fill', 'rgba(255,255,255,0.0)');

var bg_timeline;
// var guideLine;

var guideLine = svg.append("line")
			.attr("x1", 8)
			.attr("y1", 0 )
			.attr("x2", 8 )
			.attr("y2", height )
			.style("stroke", "#fff")
			.style('opacity', 1)
			.style("stroke-width", 0.5)
			// .style("stroke-dasharray", ("1, 5")) 
			.style("visibility", "hidden");

var stateLine = svg.append("line")
			.attr("x1", 8)
			.attr("y1", 0 )
			.attr("x2", 8 )
			.attr("y2", 0 )
			.style("stroke", "#FFEB3B")
			.style('opacity', 1)
			.style("stroke-width", 1.2)
			// .style("stroke-dasharray", ("1, 5")) 
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
		.attr("r", 2.3 )
		.attr("transform", function(d) {
		return "translate("+
		proj([ 28.05097, -26.20192 ])  // lon, lat
		+ ")"
     });

     current2 = svg_city.append("circle")
		.attr("class", "circle")
		.style("fill", "#FFEB3B")
		.style("opacity", 0.4)
		.attr("r", 14 )
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

	// svg.append("rect")
	// 	.attr("x", -margin.left)
	// 	.attr("y", -margin.top)
	// 	.attr("width", width + margin.left + margin.right)
	// 	.attr("height", height + margin.top + margin.bottom)
	// 	.style("fill", "#fff")
	// 	.style("opacity", 0.1);

	bg_timeline = svg.append("rect")
		.attr("x", 26)
		.attr("y", -10)
		.attr("width", width-52)
		.attr("height", height + 20)
		.style("fill", "#fff")
		.style('visibility', 'hidden')
		.style("opacity", 0.0);

	events = svg.selectAll(".dot")
			.data(data)
		.enter().append("line")
			.attr("x1", function(d) { return width/2-7; })
			.attr("y1", function(d) { return y(d.start); })
			.attr("x2", function(d) { return width/2+7; })
			.attr("y2", function(d) { return y(d.start); })
			.style("stroke", "#fff")
			.style('opacity', 1)
			.style("stroke-width", 1.2)
			.style("visibility", "hidden");

	var temp = width/2 + 10;
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

	// svg.selectAll("line").each(function(e) {
	events.each(function(e) {
		// var distance = Math.abs( d3.select(this).attr("y2") - mouseY );
		var distance = Math.abs( d3.select(this).attr("y2") - mouseY );
		if(distance < 1.2) {
			// d3.select(this).attr("x1", width/2 - 35);
			// d3.select(this).style("stroke-width", 2)

			var t = mouseY + 102;
			tooltip.style("visibility", "hidden");
			tooltip.text(e.event);

			date.style("visibility", "visible");
    		// date.text(e.date);
    		date.style("top", t+"px").style("right",90+"px");

    		$('#current_date').html(e.date);

    		var ty = d3.select(this).attr("y2");

    		stateLine.transition()
        			.duration(520).attr('y1', ty);

    		// var t_y = $(window).height() * 0.5 + 30;
    		// var t_x = 10;
    		// date.style("top",t_y+"px").style("left",132+"px");

    		if(e.event != eventname) {
				tempMarker.setLatLng([e.start_lat, e.start_lon ]);
				// console.log(e.start_lat + ','+ e.start_lon);
				
				map.setView([e.start_lat, e.start_lon], 14); // 16, 9
				// map.flyTo([e.start_lat, e.start_lon]);

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

