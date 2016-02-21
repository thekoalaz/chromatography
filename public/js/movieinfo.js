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

function draw_barcode() {
  console.log('function draw_barcode()');

  $.getJSON('/data/data.json', function(data) {

    $.each(data.movies, function(i, movie) {
      var stroke_width = Math.floor(document.getElementById("img" + i).offsetWidth/51);
      var square_width = stroke_width*3;
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
  });
}

function draw_palette() {
  console.log('function draw_palette()');

  $.getJSON('/data/data.json', function(data) {

    $.each(data.movies, function(i, movie) {
      var square_width = Math.floor(document.getElementById("img" + i).offsetWidth/17);
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
  });

}

function initializePage() {
  var titles = [ "budapest", "cabin", "eyeswideshut", "fightclub", "magnolia", "otherguys", "shawshank", "sincity", "watchmen" ];
  draw_barcode();
  draw_palette();
}