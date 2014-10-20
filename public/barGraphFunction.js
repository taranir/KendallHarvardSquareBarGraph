function createBarGraph (listLatLong,listType){

	var h = 400;
	var w = 600;
	var padding = 60;
	var allPlacesData = [];
	for (var m=0;m<listLatLong.length*listType.length;m++){
		allPlacesData.push(-1);
	}
	for (var i=0;i<listLatLong.length;i++){
		var latPoint = listLatLong[i][0];
		var longPoint = listLatLong[i][1];
			
		for (var j=0;j<listType.length;j++){
			var currentListType = listType[j];
			url = "./Data/"+latPoint+longPoint+currentListType+".json";

			d3.json(url,makeCallBack(i*listType.length+j));
		}
	}


	function makeCallBack(index) {
		return function(placesData){
			//console.log([""+latPoint+","+longPoint],currentListType,i,j);
			allPlacesData[index]=placesData["results"].length;
			var isFull = true;
			for (var n=0;n<allPlacesData.length;n++){
				if (allPlacesData[n]==-1){
					isFull = false;
				}
			}
			if (isFull){
				makeBarGraph(allPlacesData);
			}
		}
	}

	function makeBarGraph(dataset){
			var xScale = d3.scale.ordinal()
							.domain(d3.range(dataset.length))
							.rangeRoundBands([padding, w-padding], 0.05);
			var xScale2List = [];
	        for (var x=0;x<listLatLong.length;x++){
	        	xScale2List.push(listLatLong[x][0]+","+listLatLong[x][1]);
	        }
	        var xScale2 = d3.scale.ordinal()
	                              .domain(xScale2List)
	                              .rangeRoundBands([padding,w-padding],0.05);

			var yScale = d3.scale.linear()
							.domain([0, d3.max(dataset)])
							.range([0, h-padding*2]);

			var yScale2 = d3.scale.linear()
                              .domain([0,d3.max(dataset,function(d){
                                return d;
                              })])
                              .range([h-padding,padding]);
			//Create SVG element
			var svg = d3.select("body")
						.append("svg")
						.attr("width", w)
						.attr("height", h);

			//Create bars
	        var xAxis = d3.svg.axis()
	                          .scale(xScale2)
	                          .orient("bottom")
	                          .ticks(2);
	                          

	        var yAxis = d3.svg.axis()
	                          .scale(yScale2)
	                          .orient("left")
	                          .ticks(8);

			svg.selectAll("rect")
			   .data(dataset)
			   .enter()
			   .append("rect")
			   .attr("x", function(d, i) {
			   		return xScale(i);
			   })
			   .attr("y", function(d) {
			   		return h - padding;
			   })
			   .attr("width", xScale.rangeBand())
			   .attr("height", function(d) {
			   		return 0;
			   })
			   .attr("fill","#1f77b4");

	        svg.selectAll("rect")
	            .data(dataset)
	            .transition()
	            .duration(1000)
	            .attr("y",function(d){
	              return h-yScale(d)-padding;
	            })
	            .attr("height",function(d){
	              return yScale(d);
	            })
	        svg.selectAll("rect")
	            .data(dataset)
	            .on("mouseover", function(d) {
	            var xPosition = parseFloat(d3.select(this).attr("x"))+5;
	            var yPosition = parseFloat(d3.select(this).attr("y"))+h/20;

	            d3.select("#tooltip")
	              .style("left", xPosition + "px")
	              .style("top", yPosition + "px")           
	              .select("#value")
	              .text(d);

	            d3.select("#tooltip").classed("hidden", false);
	           	})
	           	.on("mouseout", function() {
	            	d3.select("#tooltip").classed("hidden", true);
	           	})
		    svg.append("g")
	            .attr("class","axis")
	            .attr("transform","translate(0,"+(h-padding)+")")
	            .call(xAxis);
	        svg.append("g")
	            .attr("class","axis")
	            .attr("id","yaxis")
	            .attr("transform","translate(0"+padding+",0)")
	            .call(yAxis);
	        svg.append("text")
	          .attr("x", (w / 2))             
	          .attr("y", 30)
	          .attr("text-anchor", "middle")  
	          .style("font-size", "30px") 
	          .style("text-decoration", "underline");
			//Create labels
			svg.selectAll("text")
			   .data(dataset)
			   .enter()
			   .append("text")
			   .text(function(d) {
			   		return d;
			   })
			   .attr("text-anchor", "middle")
			   .attr("x", function(d, i) {
			   		return xScale(i) + xScale.rangeBand() / 2;
			   })
			   .attr("y", function(d) {
			   		return h - yScale(d) + 14;
			   })
			   .attr("font-family", "sans-serif")
			   .attr("font-size", "11px")
			   .attr("fill", "white");
			svg.append("text")
		        .attr("x", ((w-padding)/ 2))             
		        .attr("y", padding/2)
		        .attr("text-anchor", "middle")  
		        .style("font-size", "24px") 
		        .style("text-decoration", "underline")  
		        .text("Kendall and Harvard Square");

		/**
		var xScale = d3.scale.ordinal()
                              .domain(d3.range(listLatLong.length*listType.length))
                              .rangeRoundBands([padding,w-padding],0.05);
        var xScale2List = [];
        for (var x=0;x<listLatLong.length;x++){
        	xScale2List.push(listLatLong[x][0]+","+listLatLong[x][1]);
        }
        var xScale2 = d3.scale.ordinal()
                              .domain(xScale2List)
                              .rangeRoundBands([padding,w-padding],0.05);


        var yScale = d3.scale.linear()
                              .domain([0,d3.max(dataset,function(d){
                                return d.value;
                              })])
                              .range([0,h-padding*2]);

        var yScale2 = d3.scale.linear()
                              .domain([0,d3.max(dataset,function(d){
                                return d.value;
                              })])
                              .range([h-padding,padding]);
        var key = function(d){
          return d.key;
        }

        var svg = d3.select("body")
                    .append("svg")
                    .attr("width",w)
                    .attr("height",h)

        var xAxis = d3.svg.axis()
                          .scale(xScale2)
                          .orient("bottom")
                          .ticks(2);
                          

        var yAxis = d3.svg.axis()
                          .scale(yScale2)
                          .orient("left")
                          .ticks(8);


        svg.selectAll("rect")
            .data(dataset)
            .enter()
            .append("rect")
            .attr("x",function(d,i){
              return xScale(i);
            })
            .attr("y",function(d){
              return h-padding;
            })
            .attr("width",xScale.rangeBand())

            .attr("height",function(d){
              return 0;
            })
            .attr("fill","#1f77b4");

        svg.selectAll("rect")
            .data(dataset)
            .transition()
            .duration(1000)
            .attr("y",function(d){
              return h-yScale(d)-padding;
            })
            .attr("height",function(d){
              return yScale(d);
            })

        svg.selectAll("rect")
            .data(dataset)
            .on("mouseover", function(d) {
            var xPosition = parseFloat(d3.select(this).attr("x"))+5;
            var yPosition = parseFloat(d3.select(this).attr("y"))+h/20;

            d3.select("#tooltip")
              .style("left", xPosition + "px")
              .style("top", yPosition + "px")           
              .select("#value")
              .text(d);

            d3.select("#tooltip").classed("hidden", false);

           })
           .on("mouseout", function() {

            d3.select("#tooltip").classed("hidden", true);

           })
        svg.append("g")
            .attr("class","axis")
            .attr("transform","translate(0,"+(h-padding)+")")
            .call(xAxis);

        svg.append("g")
            .attr("class","axis")
            .attr("id","yaxis")
            .attr("transform","translate(0"+padding+",0)")
            .call(yAxis);

        svg.append("text")
          .attr("x", (w / 2))             
          .attr("y", 30)
          .attr("text-anchor", "middle")  
          .style("font-size", "30px") 
          .style("text-decoration", "underline");
**/
	}
}

