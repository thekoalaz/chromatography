var frames = [];
var count = 10, padding = 2;
var barcodeContainer = d3.select("#barcode");

function drawBarcode() {
  barcodeContainer.append("svg")
                  .attr("width", 960)
                  .attr("height", 200)

	$.getJSON('data/vertigo/frames.json', function(data) {
		$.each(data.frame, function(i, f) {
			for(var i = 0; i < count; ++i) {
			    barcodeContainer.append("line")
								.attr("x1", padding*i)
								.attr("x2", padding*i)
								.attr("y1", 100)
								.attr("y2", 0)
								.attr("stroke", f.fc)
								.attr("stroke-width", 2)
			}
		});
	});
}
