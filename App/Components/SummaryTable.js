import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, FlatList, ART } from 'react-native'
import styles from './Styles/SummaryTableStyle'
import { Colors, Metrics } from '../Themes'
// d3 functions
import * as scale from 'd3-scale'
import * as shape from 'd3-shape'
import * as d3Array from 'd3-array'
// Graph Functions
import * as graphUtils from '../Transforms/GraphUtils'

const {
  Surface,
  Group,
  Shape,
} = ART

export default class SummaryTable extends Component {
  static propTypes = {
    summary: PropTypes.array,
    sparkline: PropTypes.object,
    current_prices: PropTypes.object,
  }

  constructor(props) {
    super(props)
    
    // init returnVal
    let { summary } = props
    let newSummary = []
    summary.map(e => {
      e.returnVal = e.return.toFixed(2)+' %'
      newSummary.push(e)
    })
    this.state = {
      summary: newSummary,
    }

    // bind functions
    this.flipButton = this.flipButton.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.assignReturnValue = this.assignReturnValue.bind(this)
  }

  // init return index
  returnIdx = 0
  maxLength = 0

  numToKey (item, num) {
    switch (num) {
      case 0:
        return (item.return_period > 0 ? "+" : "") + item.return_period.toFixed(2)+' %'
      case 1:
        return (item.gain_period > 0 ? "+" : "") + item.gain_period.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      case 2:
        return item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
    }
  }
  
  assignReturnValue () {
    let { summary } = this.props
    let newSummary = []
    summary.map(e => {
      e.returnVal = this.numToKey(e, this.returnIdx)
      this.maxLength = e.returnVal.length > this.maxLength ? e.returnVal.length : this.maxLength
      newSummary.push(e)
    })
    this.setState({
      summary: newSummary,

    })
  }
  
  flipButton () {
    this.maxLength = 0
    this.returnIdx = (this.returnIdx + 1) % 3
    this.assignReturnValue()
  }

  componentDidMount() {
    this.assignReturnValue()
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps
    this.assignReturnValue()
  }

  renderRow ({item}) {
    const isPositive = item.gain_period > 0 ? 1 : 0
    const gainButtonWidth = Math.floor(Metrics.screenWidth/3)-2*Metrics.doubleBaseMargin
    
    // prepare sparkline data
    const { sparkline } = this.props
    try {
      price = sparkline.data ? sparkline.data[item.coin] : null
    } catch(err) {
      price = null
    }
    // prepare other graph props
    const graphWidth = Math.floor(Metrics.screenWidth/3) - Metrics.doubleBaseMargin
    const graphHeight = Metrics.rowHeight - Metrics.doubleBaseMargin
    const graph = price ? graphUtils.createSparkLine(price, graphWidth, graphHeight) : {path: null}

    return (
      <TouchableOpacity style={styles.rowContainer} onPress={() => this.props.navigation.navigate('PositionsScreen', {coin: item.coin})}>
          <View style={{flexDirection: 'column', width: Math.floor(Metrics.screenWidth/3)-Metrics.doubleBaseMargin, height: Metrics.rowHeight - Metrics.doubleBaseMargin, alignItems: 'center', justifyContent: 'center'}}>
            <View><Text style={styles.rowBoldLabel}>{item.coin}</Text></View>
            <View><Text style={styles.rowMuteLabel}>{item.amount.toFixed(8)}</Text></View>
          </View>
          <View style={{flexDirection: 'column', marginHorizontal: 0}}>
            <Surface width={graphWidth + Metrics.doubleBaseMargin} height={graphHeight+Metrics.doubleBaseMargin}>
              <Group x={0+Metrics.baseMargin/2} y={0+Metrics.baseMargin}>
                <Shape
                  d={graph.path}
                  stroke={isPositive ? Colors.positive : Colors.negative}
                  strokeWidth={0.5}
                />
              </Group>
            </Surface>
          </View>
          <View style={{flexDirection: 'column'}}>
            <TouchableOpacity onPress={this.flipButton} style={{width: gainButtonWidth}}>
              <View style={[
                styles.rowButtonContainer,
                {backgroundColor: this.returnIdx == 2 ? Colors.navigation : (isPositive ? Colors.positive : Colors.negative)},
                {width: gainButtonWidth}
              ]}>
                <Text style={[
                  styles.rowButtonLabel,
                  {fontSize: Math.floor(1.5*gainButtonWidth/this.maxLength)}]}>{item.returnVal}</Text>
              </View>
            </TouchableOpacity>
          </View>
      </TouchableOpacity>
    )
  }
  
  // Show this when data is empty
  renderEmpty = () =>
    <Text style={styles.label}> No data </Text>

  keyExtractor = (item, index) => index

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 20

  render () {
    const { summary } = this.state
    return (
      <View style={styles.container}>
        <FlatList
          contentContainerStyle={styles.listContent}
          data={ summary }
          renderItem={this.renderRow}
          keyExtractor={this.keyExtractor}
          initialNumToRender={this.oneScreensWorth}
          ListEmptyComponent={this.renderEmpty}
        />
      </View>
    )
  }
}

