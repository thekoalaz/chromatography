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

var barcodeContainers = [];
var num_of_frames = 50;

function draw_barcode_all(data) {
  console.log('function draw_barcode_all()');
  $.each(data.movies, function(i, movie) {
    var stroke_width = Math.floor(document.getElementById("img" + i).offsetWidth/(num_of_frames+1));
    $("#a"+i).append("<br><h1><b>Color Barcode</b></h1>");
    barcodeContainers[i] = d3.select("#a" + i)
                             .attr("align", "center")
                             .append("svg")
                             .attr("width", "100%")
                             .attr("height", 200);
                              
    $.each(movie.frames, function(j, frame) {
      barcodeContainers[i].append("line")
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
  $.each(data.movies, function(i, movie) {
    var stroke_width = Math.floor(document.getElementById("img" + i).offsetWidth/(num_of_frames+1));
    var square_width = stroke_width*3; // Heuristics
    $("#a"+i).append("<br><h1><b>Color Palette of Each Frame</b></h1>");
    $.each(movie.frames, function(j, frame) {
      var palette_colors = [];
      barcodeContainers[i] = d3.select("#a" + i)
                               .attr("align", "center")
                               .append("svg")
                               .attr("width", "100%")
                               .attr("height", square_width+5);
      $.each(movie.frames[j].palette, function(k, color) {
        palette_colors[k] = $.map(color, function(element, index) {return index});
        barcodeContainers[i].append("line")
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
  var stroke_width = Math.floor(document.getElementById("img" + i).offsetWidth/(num_of_frames+1));
  $("#a"+i).append("<br><h1><b>Color Barcode</b></h1>");
  barcodeContainers[i] = d3.select("#a" + i)
                           .attr("align", "center")
                           .append("svg")
                           .attr("width", "100%")
                           .attr("height", 200);
                            
  $.each(movie.frames, function(j, frame) {
    barcodeContainers[i].append("line")
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
}

function draw_palette(movie, i) {
  var stroke_width = Math.floor(document.getElementById("img" + i).offsetWidth/(num_of_frames+1));
  var square_width = stroke_width*3; // Heuristics
  $("#a"+i).append("<br><h1><b>Color Palette of Each Frame</b></h1>");
  $.each(movie.frames, function(j, frame) {
    var palette_colors = [];
    barcodeContainers[i] = d3.select("#a" + i)
                             .attr("align", "center")
                             .append("svg")
                             .attr("width", "100%")
                             .attr("height", square_width+5);
    $.each(movie.frames[j].palette, function(k, color) {
      palette_colors[k] = $.map(color, function(element, index) {return index});
      barcodeContainers[i].append("line")
                          .attr("x1", square_width*k+square_width*k+3.3*square_width) // 3.3*squre_width was determined by heuristics
                          .attr("x2", square_width*k+square_width*k+3.3*square_width)
                          .attr("y1", square_width)
                          .attr("y2", 0)
                          .attr("stroke", palette_colors[k])
                          .attr("stroke-width", square_width);
    });       
  }); 
}

function show_movie(data, i) {
  console.log('function show_movie()');
  draw_barcode(data.movies[i], i);
  draw_palette(data.movies[i], i);
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
          var div_a = document.getElementById('a'+i_string);
          hashtable_appeared.i_string = "1";
          div_a.innerHTML += "<h1><b>"+movie.title+"</b></h1>";
          div_a.innerHTML += "<br>";
          div_a.innerHTML += "<img class=\"center fit\" src=\"data/"+movie.frames[2].file+"\" style=\"width: 100%; position: relative;\" id=\""+"img"+i_string+"\" />";
          div_a.innerHTML += "<br>";
          show_movie(data, i);
        } else {

        }
      });
    });
  });
}