import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, FlatList, TouchableOpacity } from 'react-native'
import styles from './Styles/ClosedPositionCardStyle'
import { ApplicationStyles, Metrics, Colors } from '../Themes/index';
// output
var numeral = require('numeral')
// svg
import SvgUri from 'react-native-svg-uri'

export default class ClosedPositionCard extends Component {
  // Prop type warnings
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  constructor(props) {
    super(props)
    this.renderClosedPositions = this.renderClosedPositions.bind(this)

  }

  formatAmount(amount) {
    whole = Math.ceil(Math.log10(amount))
    deci = whole > 0 ? 9 - whole : 8
    return amount.toFixed(deci)
  }

  renderClosedPositions({item}) {
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit'}
    return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.positionsRowText}>{this.formatAmount(item.amount)}</Text>
          <Text style={styles.positionsRowText}>bought @ {numeral(item.price).format(ApplicationStyles.formatPrices)}</Text>
          <Text style={styles.positionsRowText}>on {new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(item.date))}</Text>          
        </View>
    )
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
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={styles.positionsRowText}>SELL: {this.formatAmount(item.amount)}</Text>
          <Text style={styles.positionsRowText}>@ {numeral(item.price).format(ApplicationStyles.formatPrices)}</Text>
          <Text style={styles.positionsRowText}>on {new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(item.date))}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
          <Text style={styles.positionsRowText}>COST: {numeral(item.cost_basis).format(ApplicationStyles.formatValues)}</Text>
          <Text style={styles.positionsRowText}>{isPositive ? "+":""}{numeral(item.gain).format(ApplicationStyles.formatValues)} ({numeral(item.return).format(ApplicationStyles.formatPercent)})</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.positionsRowText}>Closed positions</Text>
        </View>
        <FlatList
            data={item.closed_positions}
            renderItem={this.renderClosedPositions}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={() => <Text style={styles.positionsRowText}> There were no coins to sell </Text>}
          />
        {item.oversold && <Text style={styles.positionsRowText}>There were not enough coins for full order!</Text>}
      </View>
    )
  }
}
