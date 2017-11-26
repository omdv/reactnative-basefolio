import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import styles from './Styles/OpenPositionCardStyle'
import { Colors, ApplicationStyles, Metrics } from '../Themes'
// output
var numeral = require('numeral')
// svg
import SvgUri from 'react-native-svg-uri'


export default class OpenPositionCard extends Component {
  // Prop type warnings
  static propTypes = {
    item: PropTypes.object,
  }
  
  // Defaults for props
  static defaultProps = {
    item: {
      amount: 0,
      price: 0,
      date: new Date().getTime(),
      current_value: 0,
      gain: 0,
      return: 0,
      source: "Coinbase"
    }
  }

  render () {
    const { item } = this.props
    const isPositive = item.gain > 0 ? 1 : 0
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit'}
    return (
      <View style={[styles.positionsRowContainer, {backgroundColor: isPositive ? Colors.positive: Colors.negative}]}>
          {/* HACK: dynamic file naming does not work, margin adjusted */}
          <View style={{justifyContent: 'center', marginLeft: -10}}>
            {(item.source === "Coinbase") && <SvgUri
              style={{paddingVertical: 3}}
              width={Metrics.screenWidth-Metrics.doubleBaseMargin}
              height={Metrics.icons.tiny}
              source={require("../Images/coinbase.svg")}
              fill={Colors.background}
            />}
            {(item.source === "GDAX") && <SvgUri
              style={{paddingVertical: 3}}
              width={Metrics.screenWidth-Metrics.doubleBaseMargin}
              height={Metrics.icons.tiny}
              source={require("../Images/gdax.svg")}
              fill={Colors.background}
            />}
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.positionsRowText}>BUY: {item.amount.toPrecision(8)}</Text>
            <Text style={styles.positionsRowText}>@ {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
            <Text style={styles.positionsRowText}>on {new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(item.date))}</Text>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'center'}}>
            <Text style={styles.positionsRowText}>VALUE: {numeral(item.current_value).format(ApplicationStyles.formatValues)}</Text>
            <Text style={styles.positionsRowText}>{isPositive ? "+":""}{numeral(item.gain).format(ApplicationStyles.formatValues)} ({numeral(item.return).format(ApplicationStyles.formatPercent)})</Text>
          </View>
          { item.original_amount && <View>
            <View style={styles.divider}></View>
            <Text style={styles.positionsRowText}>{"SPLIT POSITION / BUY AMOUNT: " + item.original_amount.toFixed(8)}</Text>
            </View> }
      </View>
    )
  }
}
