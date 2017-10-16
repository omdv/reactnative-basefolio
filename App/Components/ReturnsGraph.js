import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, ART } from 'react-native'
import styles from './Styles/ReturnsGraphStyle'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import * as d3Array from 'd3-array'

const {
  Surface,
  Group,
  Shape,
} = ART

const d3 = {
  scale,
  shape,
};

export default class ReturnsGraph extends Component {
  // Prop type warnings
  static propTypes = {
    width: PropTypes.number,
    height: PropTypes.number
  }

  constructor(props) {
    super(props)
  }
  
  createScaleX(start, end, width) {
    return d3.scale.scaleTime()
      .domain([new Date(start), new Date(end)])
      .range([0, width]);
  }

  createScaleY(minY, maxY, height) {
    return d3.scale.scaleLinear()
      .domain([minY, maxY]).nice()
      // We invert our range so it outputs using the axis that React uses.
      .range([height, 0]);
  }

  getPath (width, height) {
    data = [
      {time: new Date(2000, 1, 1), value: 83.24},
      {time: new Date(2000, 1, 2), value: 85.35},
      {time: new Date(2000, 1, 3), value: 98.84},
      {time: new Date(2000, 1, 4), value: 79.92},
      {time: new Date(2000, 1, 5), value: 83.80},
      {time: new Date(2000, 1, 6), value: 88.47},
      {time: new Date(2000, 1, 7), value: 94.47},
    ]

      // Get last item in the array.
    lastDatum = data[data.length - 1];

    // Create our x-scale.
    scaleX = this.createScaleX(
      data[0].time,
      lastDatum.time,
      width
    );

    // Collect all y values.
    allYValues = data.reduce((all, datum) => {
      all.push(datum.value);
      return all;
    }, []);

    // Get the min and max y value.
    extentY = d3Array.extent(allYValues);

    // Create our y-scale.
    scaleY = this.createScaleY(extentY[0], extentY[1], height);

    // Use the d3-shape line generator to create the `d={}` attribute value.
    lineShape = d3.shape.line()
      // to the range value.
      .x((d) => scaleX(d.time))
      .y((d) => scaleY(d.value));

    return lineShape(data)
  }

  path = this.getPath(200, 100)

  render() {
    return (
      <Surface width={this.props.width} height={this.props.height}>
        <Group x={0} y={0}>
          <Shape
            d={this.path}
            stroke="#fff"
            strokeWidth={5}
          />
        </Group>
      </Surface>
    );
  }
}
