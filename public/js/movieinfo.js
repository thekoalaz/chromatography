'use strict';

var MovieInfoController = {
  frameElementName: "frame"
  ,paletteElementName: "palette"
  ,barcodeElementName: "barcode"
  ,searchElementName: "search"
  ,searchBtnElementName: "searchBtn"
  ,movieLinkBaseElementName: "movielink"
  ,numberOfMoviesElementName: "numberofmovies"
  ,characterFrameElementName: "characterFrame"
  ,titleElementName: "title"

  ,frame: null
  ,palette: null
  ,barcode: null
  ,search: null
  ,searchBtn: null
  ,movieLinks: null
  ,numberOfMovies: null
  ,barcodeStrokeWidth: null
  ,palleteSqureWidth: null
  ,numOfFrames: 200
  ,barcodeContainer: null
  ,paletteContainer: null
  ,title: null
  ,frameData: null
  ,characterFrame: null

  ,componentToHex: function(u) {
    var c = Math.round(u);
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex: hex;
  }

  ,rgbToHex: function(r, g, b) {
  	var base = this;
    return "#" + base.componentToHex(r) + base.componentToHex(g) + base.componentToHex(b);
  }

  ,findElements: function() {
    var base = this;

    base.frame = document.getElementById(base.frameElementName);
    base.palette = $("#"+base.paletteElementName);
    base.barcode = $("#"+base.barcodeElementName);
    base.search = document.getElementById(base.searchElementName);
    base.searchBtn = document.getElementById(base.searchBtnElementName);
    base.title = document.getElementById(base.titleElementName);
    base.movieLinks = [];
    base.numberOfMovies = document.getElementById(base.numberOfMoviesElementName).value;
    for (var i = 0; i < base.numberOfMovies; ++i) {
      base.movieLinks.push(document.getElementById(base.movieLinkBaseElementName+i));
    }
    base.barcodeStrokeWidth = base.frame.offsetWidth/(base.numOfFrames+1);
    base.paletteSqureWidth = 30; // Heuristics
    base.characterFrame = document.getElementById(base.characterFrameElementName);

    console.log("base.barcodeStrokeWidth: "+base.barcodeStrokeWidth);
    console.log("base.frame.width: "+base.frame.width);
    return base;
  }

  ,draw_palette: function(j) {
  	var base = this;
    var palette_colors = {};
    var k_string;

    $.each(base.frameData[j].palette, function(k, color) {
      k_string = k.toString();
      palette_colors.k_string = $.map(color, function(element, index) {return index});
      base.paletteContainer.append("line")
      .attr("x1", base.paletteSqureWidth*k+base.paletteSqureWidth*k+1.5*base.paletteSqureWidth) // 3.3*squre_width was determined by heuristics
      .attr("x2", base.paletteSqureWidth*k+base.paletteSqureWidth*k+1.5*base.paletteSqureWidth)
      .attr("y1", base.paletteSqureWidth)
      .attr("y2", 0)
      .attr("stroke", palette_colors.k_string)
      .attr("stroke-width", base.paletteSqureWidth);
    });
  }

  ,shadow: function(d, j) {
  	var base = this;
   // filters go in defs element
    var defs = base.barcodeContainer.append("defs");

    // create filter with id #drop-shadow
    // height=130% so that the shadow is not clipped
    var filter = defs.append("filter")
                .attr("id", "drop-shadow")
                .style("stroke-width", 0)
                .attr("height", "130%");

    // SourceAlpha refers to opacity of graphic that this filter will be applied to
    // convolve that with a Gaussian with standard deviation 3 and store result
    // in blur
    filter.append("feGaussianBlur")
          .attr("in", "SourceAlpha")
          .attr("stdDeviation", 5)
          .attr("result", "blur");

    // translate output of Gaussian blur to the right and downwards with 2px
    // store result in offsetBlur
    filter.append("feOffset")
          .attr("in", "blur")
          .attr("dx", 2)
          .attr("dy", 2)
          .attr("result", "offsetBlur");

    // overlay original SourceGraphic over translated blurred opacity by using
    // feMerge filter. Order of specifying inputs is important!
    var feMerge = filter.append("feMerge");

    feMerge.append("feMergeNode")
          .attr("in", "offsetBlur")
    feMerge.append("feMergeNode")
          .attr("in", "SourceGraphic");

    // for each rendered node, apply #drop-shadow filter
    var item = base.barcodeContainer.select("rect"+j)
															      .style("filter", "url(#drop-shadow)")
															      .attr("transform", function(d) { 
															        return "translate("+d.x+","+d.y+")"; 
															      });

    //var div_img = document.getElementById("img"+i);
    //div_img.innerHTML = "<img class=\"center fit\" src=\"data/"+movie.frames[j].file+"\" style=\"height: 120px; width: 100%; position: relative;\" id=\""+"img"+j+"\" /><br>";
    base.frame.innerHTML = "<img class=\"center fit\" src=\""+base.frameData[j].file+"\" style=\"height: 240px; position: relative;\" /><br>";
    base.draw_palette(j);    
  }

  ,recreateSVGs: function() {
  	var base = this;
    // first remove the exisiting color barcode
    d3.select("#"+base.barcodeElementName).select("svg").remove();

    base.barcodeContainer = d3.select("#"+base.barcodeElementName)
                             .attr("align", "center")
                             .append("svg")
                             .attr("width", "100%")
                             .attr("height", 200);

    // first remove the existing color palette
    d3.select("#"+base.paletteElementName).select("svg").remove();

    base.paletteContainer = d3.select("#"+base.paletteElementName)
													   .attr("align", "center")
													   .append("svg")
													   .attr("width", "100%")
													   .attr("height", base.palleteSqureWidth);

		return base;
  }

  ,visualizeBarcode: function() {
    var base = this;

    var bar_items = [];
    $.each(base.frameData, function(j, frame) {
      bar_items.push({x: base.barcodeStrokeWidth*j+1.5*base.barcodeStrokeWidth, y: 100, frame: frame});
    });

    base.barcodeContainer
    		.selectAll("rect")
		    .data(bar_items)// 1.5*base.barcodeStrokeWidth was determined by heuristics
		    .enter().append("rect", function(d, j) {
		      return "rect"+j;
		    })
		    .attr("id", function(d, j) {
		      return "rect"+j; 
		    })
		    .attr("width", base.barcodeStrokeWidth)  
		    .attr("height", 100)
		    .style("fill", function(d) {
		      return base.rgbToHex(
		        d.frame.averageColorRGB[0],
		        d.frame.averageColorRGB[1],
		        d.frame.averageColorRGB[2]);
		    })
		    .attr("transform", function(d) { 
		      return "translate("+d.x+","+d.y+")"; 
		    });

		return base;
  }

  ,displayInformation: function(movieIndex) {
    console.log("displayInformation: "+movieIndex);
    var base = this;
    $.getJSON("/data/data.json", function(data) {
  		base.title.innerHTML = "Movie title: "+"<b>"+data.movies[movieIndex].title+"</b>";

      $.getJSON("/data/"+data.movies[movieIndex].path_to_the_frames, function() {
      })
      .success(function(frames) {
      	base.frameData = frames;
      	base.visualizeBarcode().addInteractivity();
      })
      .error(function() {
      	alert("We are currently developing more movie data. Please try it next time");
      });
    });
  }

  ,addInteractivity: function() {
  	var base = this;
    //base.barcodeContainer.selectAll("rect")
    //base.barcodeContainer.selectAll("rect")
    base.barcodeContainer.selectAll("rect")
    .on({
      "mouseover": function(d, j) {
        console.log('mouseover:', j);
      	base.shadow(d,j);
      }
      ,"mouseout": function(d, j) {
        base.barcodeContainer.selectAll("rect").style("filter", null);
      }
      ,"click": function(d, j) {
      	console.log("click: "+j);
      }
    });

    return base;
  }

  ,addEvents: function() {
    var base = this;

    base.movieLinks.map(function(link, i) {
      link.onclick = function(e) {
        e.preventDefault();
        base.recreateSVGs().displayInformation(i);
        base.characterFrame.src = "https://hyeonsu.shinyapps.io/"+link.text.split(" ").join("");
      };
	    base.barcode.on({
	    	"mouseover": function(e) {
	    		base.addInteractivity();
	    	}
	    	,"click": function(e) {
	    		base.addInteractivity();
	    	}
	    });
    });

    return base;
  }

  ,initialize: function() {
    var base = this;
    return base.findElements().addEvents();
  }
};

var MovieInfoController = MovieInfoController || {};

$(document).ready(function() {
  MovieInfoController.initialize();
});

/* NOTE to myself. 

Q1. How to add event handlers to HTML components:

HTML:
<input id='btnRemoveDummy' type="button" value="Remove DUMMY"/>


Javascript:
function removeDummy() {
    var elem = document.getElementById('dummy');
    elem.parentNode.removeChild(elem);
    return false;
}
function pageInit() {
    // Hook up the "remove dummy" button
    var btn = document.getElementById('btnRemoveDummy');
    if (btn.addEventListener) {
        // DOM2 standard
        btn.addEventListener('click', removeDummy, false);
    }
    else if (btn.attachEvent) {
        // IE (IE9 finally supports the above, though)
        btn.attachEvent('onclick', removeDummy);
    }
    else {
        // Really old or non-standard browser, try DOM0
        btn.onclick = removeDummy;
    }
}

Q2. How to remove an attribute to d3 element?

From the API documentation for attr

A null value will remove the specified attribute
So it looks like you want .attr('disabled', null).

Q3. How to give a hierarchy among the d3 elements (something equivalent to z-scores?)

As explained in the other answers, SVG does not have a notion of a z-index. Instead, the order of elements in the document determines the order in the drawing.

Apart from reordering the elements manually, there is another way for certain situations:

Working with D3 you often have certain types of elements that should always be drawn on top of other types of elements.

For example, when laying out graphs, links should always be placed below nodes. More generally, some background elements usually need to be placed below everything else, while some highlights and overlays should be placed above.

If you have this kind of situation, I found that creating parent group elements for those groups of elements is the best way to go. In SVG, you can use the g element for that. For example, if you have links that should be always placed below nodes, do the following:

svg.append("g").attr("id", "links")
svg.append("g").attr("id", "nodes")
Now, when you paint your links and nodes, select as follows (the selectors starting with # reference the element id):

svg.select("#links").selectAll(".link")
// add data, attach elements and so on

svg.select("#nodes").selectAll(".node")
// add data, attach elements and so on
Now, all links will always be appended structurally before all node elements. Thus, the SVG will show all links below all nodes, no matter how often and in what order you add or remove elements. Of course, all elements of the same type (i.e. within the same container) will still be subject to the order in which they were added.


*/
