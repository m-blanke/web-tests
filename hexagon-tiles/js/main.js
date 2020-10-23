// divs

$(document).ready(function(){
	
	divPopulate($("#div-width").val(),$("#div-height").val());

	$("#div-circles-in").change(function(){
		if(this.checked) {
			$("#div-grid").addClass("incircles");
		}else{
			$("#div-grid").removeClass("incircles");
		}
	});
	$("#div-circles-out").change(function(){
		if(this.checked) {
			$("#div-grid").addClass("excircles");
		}else{
			$("#div-grid").removeClass("excircles");
		}
	});

	$("#div-grid").on("mousemove", divGridMouseHandler);

	$("#div-width, #div-height").change(function(){
		divPopulate($("#div-width").val(),$("#div-height").val());
	});
});

var divGridHexagons = []; // list
var divGridIndex = {}; // index

//neighbouring ofsets
var divNeighbourOffsets = [[ //even y
	{"x": -1, "y": 0}, // left
	{"x": -1, "y": -1}, // top left
	{"x": 0, "y": -1}, // top right
	{"x": 1, "y": 0}, // right
	{"x": -1, "y": 1}, // bottom right
	{"x": 0, "y": 1}, // bottom left
],[ //odd y
	{"x": -1, "y": 0}, // left
	{"x": 0, "y": -1}, // top left
	{"x": 1, "y": -1}, // top right
	{"x": 1, "y": 0}, // right
	{"x": 1, "y": 1}, // bottom right
	{"x": 0, "y": 1}, // bottom left
]];

// create grid and populate data structures
function divPopulate(width, height){
	divGridHexagons = [];
	divGridIndex = {};
	$("#div-grid").empty();


	for(var y = 0; y < height; y++){
		var row = $("<div></div>");
		$("#div-grid").append(row);

		for(var x = 0; x < width; x++){
			var el = $("<div></div>");
			row.append(el);

			//el.html("x = " + x + "<br/>y = " + y);
			el.text(x + " / " + y);
		
			//create element for fast access and compute values that dont change on runtime
			var hexagon = {
				"center": {
					"x": el.offset().left + 0.5*el.outerHeight(),
					"y": el.offset().top + 0.5*el.outerWidth(),
				},
				"index": {
					"x": x,
					"y": y,
				},
				"object": el,
			}

			//add to list
			divGridHexagons.push(hexagon);
		
			//add to index
			divAt(x, y, hexagon);
		}
	}
}


function divAt(x, y, el = undefined){
	if(el !== undefined){ // set item
		if(divGridIndex[x] === undefined)
			divGridIndex[x] = {};
		divGridIndex[x][y] = el;
	}
	// get item
	return (divGridIndex[x] || {})[y];
}

function divFindClosest(x, y, max){
	//find maximum valid distance
	var hexagon;
	var l = Infinity;

	for(curHexagon of divGridHexagons){
		var d = distance(x,y, curHexagon.center.x, curHexagon.center.y);
		if (d < l & d < max){
			l = d;
			hexagon = curHexagon;
		}
	}
	return hexagon;
}

function divGridMouseHandler(event){
	var rMax = parseFloat($("#div-grid").css("--Rmax")); //excircle radius

	//calculate closest hexagon

	var hexagon = divFindClosest(event.pageX, event.pageY, rMax);
	if(hexagon === undefined){
		$("#div-grid > div > div.active").removeClass("active");
		$("#div-grid > div > div.neighbour").removeClass("neighbour");
		return;
	}

	//activate hexagon
	$("#div-grid > div > div.active").removeClass("active");
	hexagon.object.addClass("active");

	//set neighbours
	$("#div-grid > div > div.neighbour").removeClass("neighbour");

	for(offset of divNeighbourOffsets[hexagon.index.y % 2]){
		var neighbour = divAt(hexagon.index.x + offset.x,hexagon.index.y + offset.y);
		if(neighbour === undefined)
			continue;
		neighbour.object.addClass("neighbour");
	}
}



function distance(xa, ya, xb, yb){
	return Math.sqrt((xa - xb)*(xa - xb) + (ya - yb)*(ya - yb));
}
