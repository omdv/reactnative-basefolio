import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text, ART } from 'react-native'
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import * as d3Array from 'd3-array'
// Graph Fnunctions
import * as graphUtils from '../Transforms/GraphUtils'
// Styles
import styles from './Styles/SparkLineStyle'
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

export default class SparkLine extends Component {
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
    const { datum, xAccessor, yAccessor, width, height } = this.props
    const graph = datum ? graphUtils.createSparkLine(datum,yAccessor,width,height) : {path: null}
    return (
      <View style={styles.container}>
        <Surface width={width} height={height}>
          <Group x={0} y={0}>
            <Shape
              d={graph.path}
              stroke={Colors.sparkline}
              strokeWidth={1}
            />
          </Group>
        </Surface>
      </View>
    );
  }
}
