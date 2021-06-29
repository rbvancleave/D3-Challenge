/********************************************************/
const datafile = "./assets/data/data.csv";
/********************************************************/
// Define SVG area dimensions
const svgWidth = 960;
const svgHeight = 660;
/********************************************************/
// Define the chart's margins as an object
const chartMargin = {
  top: 30,
  right: 40,
  bottom: 80,
  left: 100,
};
/********************************************************/
// Define dimensions of the chart area
const chartWidth = svgWidth - chartMargin.left - chartMargin.right;
const chartHeight = svgHeight - chartMargin.top - chartMargin.bottom;
/********************************************************/
// Select body, append SVG area to it, and set the dimensions
const svg = d3.select("#scatter").append("svg").attr("height", svgHeight).attr("width", svgWidth);
/********************************************************/
const chartGroup = svg
  .append("g")
  .attr("transform", `translate(${chartMargin.left}, ${chartMargin.top})`);
/********************************************************/
d3.csv(datafile, rowUpdate).then(createChart);
/********************************************************/
function rowUpdate(row) {
  row.healthcare = +row.healthcare;
  row.poverty = +row.poverty;
  return row;
}
/********************************************************/
function createChart(data) {
  console.table(data, ["abbr", "poverty", "healthcare"]);
  let yNumHitsScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.healthcare)])
    .range([chartHeight, 0]);
  let xHairLengthScale = d3
    .scaleLinear()
    .domain([0, d3.max(data, (d) => d.poverty)])
    .range([0, chartWidth]);
  //comment these lines to add the axis
  let bottomAxis = d3.axisBottom(xHairLengthScale);
  let leftAxis = d3.axisLeft(yNumHitsScale);
  chartGroup.append("g").call(leftAxis);
  chartGroup.append("g").call(bottomAxis).attr("transform", `translate(0, ${chartHeight})`);
  chartGroup
    .append("text")
    .attr("class", "axisText")
    .text("Lacks Healthcare (%)")
    .attr("transform", ` translate(-40, ${chartHeight / 2}) rotate(-90) scale(1.2) `);
  chartGroup
    .append("text")
    .attr("x", chartWidth / 2)
    .attr("y", chartHeight + chartMargin.top + 20)
    .attr("class", "axisText")
    .text("In Poverty (%)");
    
    chartGroup
    .selectAll(".morningcircle")
    .data(data)
    .enter()
    .append("circle")
    .classed("morningcircle", true)
    .attr("cx", (d) => xHairLengthScale(d.healthcare))
    .attr("cy", (d) => yNumHitsScale(d.poverty))
    .attr("r", 15)
    .attr("fill","pink")
    .attr("opacity",".5")
    .attr("text",(d) => d.abbr);

    chartGroup.append("g")
    .selectAll('text')
    .data(data)
    .enter()
    .append("text")
    .text(d=>d.abbr)
    .attr("x", (d) => xHairLengthScale(d.healthcare))
    .attr("y", (d) => yNumHitsScale(d.poverty))
    .classed(".stateText", true)
    .attr("font-family", "sans-serif")
    .attr("text-anchor", "middle")
    .attr("fill", "black")
    .attr("font-size", "10px")
    .attr("alignment-baseline", "central");
};