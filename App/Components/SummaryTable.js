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
    prices: PropTypes.object,
    yAccessor: PropTypes.func
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
      returnValLength: 6
    }

    // bind functions
    this.flipButton = this.flipButton.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.assignReturnValue = this.assignReturnValue.bind(this)
  }

  // init returnKey
  returnKey = "return"
  
  assignReturnValue () {
    let { summary } = this.props
    let newSummary = []
    let maxLength = 0
    summary.map(e => {
      e.returnVal = this.returnKey === "return" ? e.return.toFixed(2)+' %' : e.gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      newSummary.push(e)
      maxLength = e.returnVal.length > maxLength ? e.returnVal.length : maxLength
    })
    this.setState({
      summary: newSummary,
      returnValLength: maxLength
    })
  }
  
  flipButton () {
    this.returnKey = this.returnKey === "return" ? "gain" : "return"
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
    const isPositive = item.gain > 0 ? 1 : 0
    const gainButtonWidth = Math.floor(Metrics.screenWidth/3)-2*Metrics.doubleBaseMargin
    // prepare prices
    const { prices, yAccessor } = this.props
    try {
      price = prices ? prices[item.coin] : null
    } catch(err) {
      price = null
    }
    // prepare other graph props
    const graphWidth = Math.floor(Metrics.screenWidth/3) - Metrics.doubleBaseMargin
    const graphHeight = Metrics.rowHeight - Metrics.doubleBaseMargin
    // get path
    const graph = price ? graphUtils.createSparkLine(price, yAccessor, graphWidth, graphHeight) : {path: null}
    return (
      <TouchableOpacity style={styles.rowContainer} onPress={() => this.props.navigation.navigate('PositionsScreen', {coin: item.coin})}>
          <View style={{flexDirection: 'column', "width": Math.floor(Metrics.screenWidth/3)-Metrics.doubleBaseMargin}}>
            <Text style={styles.rowBoldLabel}>{item.coin}</Text>
            <Text style={styles.rowMuteLabel}>{item.amount.toFixed(8)}</Text>
          </View>
          <View style={{flexDirection: 'column'}}>
            <Surface width={graphWidth + Metrics.doubleBaseMargin} height={graphHeight+Metrics.doubleBaseMargin}>
              <Group x={0+Metrics.baseMargin} y={0+Metrics.baseMargin}>
                <Shape
                  d={graph.path}
                  stroke={Colors.graph}
                  strokeWidth={0.5}
                />
              </Group>
            </Surface>
          </View>
          <View style={{flexDirection: 'column'}}>
            <TouchableOpacity onPress={this.flipButton}>
              <View style={[
                styles.rowButtonContainer,
                {"backgroundColor": isPositive ? Colors.positive : Colors.negative},
                {"width": gainButtonWidth}
              ]}>
                <Text style={[
                  styles.rowButtonLabel,
                  {fontSize: Math.floor(1.5*gainButtonWidth/item.returnVal.length)}]}>{item.returnVal}</Text>
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

