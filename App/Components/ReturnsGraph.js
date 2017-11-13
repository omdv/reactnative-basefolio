import React, { Component } from 'react'
import { connect } from 'react-redux'
import PropTypes from 'prop-types'
import { View, Text, ART } from 'react-native'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import * as d3Array from 'd3-array'
// Graph Functions
import * as graphUtils from '../Transforms/GraphUtils'
// Styles
import styles from './Styles/ReturnsGraphStyle'
import { Colors } from '../Themes/'



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
    datum: PropTypes.array,
    yAccessor: PropTypes.func,
    width: PropTypes.number,
    height: PropTypes.number
  }
  
  constructor(props) {
    super(props)
  }
  
  render() {
    const { datum, yAccessor, width, height } = this.props
    const graph = datum ? graphUtils.createLineGraph(datum,yAccessor,width,height) : {path: null}
    return (
      <View style={styles.container}>
        <Surface width={width} height={height}>
          <Group x={0} y={0}>
            <Shape
              d={graph.path}
              stroke={Colors.graph}
              strokeWidth={1}
            />
            <Shape
              d={graph.xaxis}
              stroke={Colors.graph}
              strokeWidth={0.2}
            />
          </Group>
        </Surface>
      </View>
    );
  }
}