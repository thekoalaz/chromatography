'use strict';

$(document).ready(function () {
  console.log("$(document).ready");
  initializePage();
});

function componentToHex(u) {
  var c = Math.round(u);
  var hex = c.toString(16);
  return hex.length == 1 ? "0" + hex: hex;
}

function rgbToHex(r, g, b) {
  return "#" + componentToHex(r) + componentToHex(g) + componentToHex(b);
}

var barcodeContainers = {};
var paletteContainer = {};
var num_of_frames = 51;

/*
 * Draws color barcodes for all of the movies contained in 'data'
 */
function draw_barcode_all(data) {
  console.log('function draw_barcode_all()');
  var i_string;
  $.each(data.movies, function(i, movie) {
    var stroke_width = Math.floor(document.getElementById("img" + i).offsetWidth/(num_of_frames+1));
    $("#a"+i).append("<br><h1><b>Color Barcode (avg. color of each frame)</b></h1>");
    i_string = i.toString();
    barcodeContainers.i_string = d3.select("#a" + i)
                             .attr("align", "center")
                             .append("svg")
                             .attr("width", "100%")
                             .attr("height", 200);
                              
    $.each(movie.frames, function(j, frame) {
      barcodeContainers.i_string.append("line")
                      .attr("x1", stroke_width*j + 1.5*stroke_width)  // 1.5*stroke_width was determined by heuristics
                      .attr("x2", stroke_width*j + 1.5*stroke_width)
                      .attr("y1", 100)
                      .attr("y2", 0)
                      .attr("stroke", 
                        rgbToHex(
                          frame.averageColorRGB[0],
                          frame.averageColorRGB[1],
                          frame.averageColorRGB[2]))
                      .attr("stroke-width", stroke_width);
    });
  });     
}

function draw_palette_all(data) {
  console.log('function draw_palette_all()');
  var i_string;
  $.each(data.movies, function(i, movie) {
    var stroke_width = Math.floor(document.getElementById("img" + i).offsetWidth/(num_of_frames+1));
    var square_width = stroke_width*3; // Heuristics
    $("#a"+i).append("<br><h1><b>Color Palette of Each Frame</b></h1>");
    $.each(movie.frames, function(j, frame) {
      var palette_colors = [];
      i_string = i.toString();
      barcodeContainers.i_string = d3.select("#a" + i)
                               .attr("align", "center")
                               .append("svg")
                               .attr("width", "100%")
                               .attr("height", square_width+5);
      $.each(movie.frames[j].palette, function(k, color) {
        palette_colors[k] = $.map(color, function(element, index) {return index});
        barcodeContainers.i_string.append("line")
                            .attr("x1", square_width*k+square_width*k+3.3*square_width) // 3.3*squre_width was determined by heuristics
                            .attr("x2", square_width*k+square_width*k+3.3*square_width)
                            .attr("y1", square_width)
                            .attr("y2", 0)
                            .attr("stroke", palette_colors[k])
                            .attr("stroke-width", square_width);
      });       
    }); 
  });
}

function draw_barcode(movie, i) {
  console.log('function draw_barcode()');
  var stroke_width = Math.floor(document.getElementById("a" + i).offsetWidth/(num_of_frames+1));
  var div_a = document.getElementById("a"+i);
  div_a.innerHTML = "<br><h3><b>Color Barcode (avg. color of each frame)</b></h3>";
  var i_string = i.toString();
  barcodeContainers.i_string = d3.select("#a" + i)
                           .attr("align", "center")
                           .append("svg")
                           .attr("width", "100%")
                           .attr("height", 200);
  var bar_items = [];
  $.each(movie.frames, function(j, frame) {
    bar_items.push({x: stroke_width*j+1.5*stroke_width, y: 100, frame: frame});
  });
  barcodeContainers.i_string.selectAll("rect")
  .data(bar_items)// 1.5*stroke_width was determined by heuristics
  .enter().append("rect", function(d, j) {
    return "rect"+j;
  })
  .attr("id", function(d, j) {
    return "rect"+j; 
  })
  .attr("width", stroke_width)  
  .attr("height", 100)
  .style("fill", function(d) {
    return rgbToHex(
      d.frame.averageColorRGB[0],
      d.frame.averageColorRGB[1],
      d.frame.averageColorRGB[2]);
  })
  .attr("transform", function(d) { 
    return "translate("+d.x+","+d.y+")"; 
  });

  var stroke_width = Math.floor(document.getElementById("img" + i).offsetWidth/(num_of_frames+1));
  var square_width = stroke_width*3; // Heuristics
  var div_palette = document.getElementById("palette"+i);
  div_palette.innerHTML = "<br><h3><b>Color Palette of Each Frame</b></h3>";
  var i_string = i.toString();
  paletteContainer.i_string = d3.select("#palette" + i)
                           .attr("align", "center")
                           .append("svg")
                           .attr("width", "75%")
                           .attr("height", square_width+5);

  barcodeContainers.i_string.selectAll("rect")
  .on({
    "mouseover": function(d, j) {
      // filters go in defs element
      var defs = barcodeContainers.i_string.append("defs");

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
            .attr("stdDeviation", 10)
            .attr("result", "blur");

      // translate output of Gaussian blur to the right and downwards with 2px
      // store result in offsetBlur
      filter.append("feOffset")
            .attr("in", "blur")
            .attr("dx", 0)
            .attr("dy", 0)
            .attr("result", "offsetBlur");

      // overlay original SourceGraphic over translated blurred opacity by using
      // feMerge filter. Order of specifying inputs is important!
      var feMerge = filter.append("feMerge");

      feMerge.append("feMergeNode")
            .attr("in", "offsetBlur")
      feMerge.append("feMergeNode")
            .attr("in", "SourceGraphic");

      // for each rendered node, apply #drop-shadow filter

      var item = barcodeContainers.i_string.select("#rect"+j)
                                .style("filter", "url(#drop-shadow)")
                                .attr("transform", function(d) { 
                                  return "translate("+d.x+","+d.y+")"; 
                                });

      var div_img = document.getElementById("img"+i);
      div_img.innerHTML = "<img class=\"center fit\" src=\"data/"+movie.frames[j].file+"\" style=\"width: 100%; position: relative;\" id=\""+"img"+j+"\" /><br>";
      draw_palette(movie, i, j);    
    },
    "mouseout": function(d, j) {
      barcodeContainers.i_string.selectAll("rect").style("filter", null);
    },
    "click": function(d, j) {
    },
  });
}

function draw_palette(movie, i, j) {
  var stroke_width = Math.floor(document.getElementById("img" + i).offsetWidth/(num_of_frames+1));
  var square_width = stroke_width*3; // Heuristics
  var palette_colors = {};
  var k_string;
  $.each(movie.frames[j].palette, function(k, color) {
    k_string = k.toString();
    palette_colors.k_string = $.map(color, function(element, index) {return index});
    paletteContainer.i_string.append("line")
    .attr("x1", square_width*k+square_width*k+1.5*square_width) // 3.3*squre_width was determined by heuristics
    .attr("x2", square_width*k+square_width*k+1.5*square_width)
    .attr("y1", square_width)
    .attr("y2", 0)
    .attr("stroke", palette_colors.k_string)
    .attr("stroke-width", square_width);
  });
}

function show_movie(data, i) {
  console.log('function show_movie()');
  draw_barcode(data.movies[i], i);
  //draw_palette(data.movies[i], i);
}

var hashtable_appeared = {};

function initializePage() {
  console.log('initializePage()');
  $.getJSON('/data/data.json', function(data) {
    var i_string;
    $.each(data.movies, function(i, movie) {
      $('#movielink'+i).click(function (e) {
        e.preventDefault();
        if (hashtable_appeared.i_string != "1") {
          i_string = i.toString();
          var div_a = document.getElementById('a'+i);
          div_a.innerHTML += "<h1><b>"+movie.title+"</b></h1>";
          div_a.innerHTML += "<br>";
          hashtable_appeared.i_string = "1";
          show_movie(data, i);
        } else {

        }
      });
    });
  });
}


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
