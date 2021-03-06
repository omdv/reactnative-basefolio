import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import * as d3Array from 'd3-array'

const d3 = {
  scale,
  shape,
};

/**
 * Create an x-scale.
 * @param {number} start Start time in seconds.
 * @param {number} end End time in seconds.
 * @param {number} width Width to create the scale with.
 * @return {Function} D3 scale instance.
 */
function createScaleX(start, end, width) {
  return d3.scale.scaleTime()
    .domain([new Date(start), new Date(end)])
    .range([0, width]);
}

/**
 * Create a y-scale.
 * @param {number} minY Minimum y value to use in our domain.
 * @param {number} maxY Maximum y value to use in our domain.
 * @param {number} height Height for our scale's range.
 * @return {Function} D3 scale instance.
 */
function createScaleY(minY, maxY, height) {
  return d3.scale.scaleLinear()
    .domain([minY, maxY]).nice()
    // We invert our range so it outputs using the axis that React uses.
    .range([height, 0]);
}

/**
 * Creates a line graph SVG path that we can then use to render in our
 * React Native application with ART.
 * @param {Array.<Object>} options.data Array of data we'll use to create
 *   our graphs from.
 * @param {function} yAccessor Function to access the y value from our data.
 * @param {number} width Width our graph will render to.
 * @param {number} height Height our graph will render to.
 * @return {Object} Object with data needed to render.
 */
export function createLineGraph(
  data,
  yAccessor,
  width,
  height,
) {
  const lengthDatum = data.length - 1

  // Collect all y values.
  const allYValues = data.reduce((all, datum) => {
    all.push(yAccessor(datum));
    return all;
  }, []);
  // Get the min and max y value.
  const extentY = d3Array.extent(allYValues);

  // create scales
  const scaleX = d3.scale.scaleLinear().domain([0, lengthDatum]).range([0, width])
  const scaleY = d3.scale.scaleLinear().domain([extentY[0], extentY[1]]).range([height, 0])  

  const lineShape = d3.shape.line()
    .x((d,i) => scaleX(i))
    .y(d => scaleY(yAccessor(d)))

  const lineArea = d3.shape.area()
    .x((d,i) => scaleX(i))
    .y1(d => scaleY(yAccessor(d)))
    .y0(scaleY(0))

    const lineAxis = d3.shape.line()
    .x((d,i) => scaleX(i))
    .y(d => scaleY(0))

  return {
    data,
    scale: {
      x: scaleX,
      y: scaleY,
    },
    path: lineShape(data),
    xaxis: lineAxis(data)
  };
}

/**
 * Creates a line graph SVG path that we can then use to render in our
 * React Native application with ART.
 * @param {Array} options.data Array of numbers
 * @param {number} width Width our graph will render to.
 * @param {number} height Height our graph will render to.
 * @return {Object} Object with data needed to render.
 */
export function createSparkLine(
  data,
  width,
  height,
) {
  const lengthDatum = data.length - 1

  // get Y range
  const extentY = d3Array.extent(data)

  const scaleX = d3.scale.scaleLinear().domain([0, lengthDatum]).range([0, width])
  const scaleY = d3.scale.scaleLinear().domain([extentY[0], extentY[1]]).range([height, 0])  

  const lineShape = d3.shape.line()
    .x((d,i) => scaleX(i))
    .y(d => scaleY(d))

  return {
    data,
    scale: {
      x: scaleX,
      y: scaleY,
    },
    path: lineShape(data),
  };
}