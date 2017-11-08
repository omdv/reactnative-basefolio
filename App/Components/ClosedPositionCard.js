import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, FlatList } from 'react-native'
import styles from './Styles/ClosedPositionCardStyle'
import { Colors } from '../Themes'

export default class ClosedPositionCard extends Component {
  // Prop type warnings
  static propTypes = {
    item: PropTypes.object.isRequired,
  }

  renderClosedPositions({item}) {
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit'}
    return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.rowText}>{item.amount.toFixed(8)}</Text>
          <Text style={styles.rowText}>bought @ {item.buy_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          <Text style={styles.rowText}>on {new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(item.buy_date))}</Text>          
        </View>
    )
  }
  
  render () {
    const { item } = this.props
    const isPositive = item.gain > 0 ? 1 : 0
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit'}    
    return (
      <View style={[styles.rowContainer, {backgroundColor: isPositive ? Colors.positive: Colors.negative}]}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.rowText}>SELL: {item.amount.toFixed(8)}</Text>
          <Text style={styles.rowText}>@ {item.sell_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          <Text style={styles.rowText}>on {new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(item.sell_date))}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.rowText}>COST: {item.cost_basis.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          <Text style={styles.rowText}>P/L: {item.gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({item.return.toFixed(2)}%)</Text>
        </View>
        <View style={styles.divider}></View>
        <View style={{alignItems: 'center'}}>
          <Text style={styles.rowText}>Closed the following positions</Text>
        </View>
        <FlatList
            data={item.closed_positions}
            renderItem={this.renderClosedPositions}
            keyExtractor={(item, index) => index}
            ListEmptyComponent={() => <Text style={styles.rowText}> There were no coins to sell </Text>}
          />
        {item.oversold && <Text style={styles.rowText}>There were not enough coins for full order!</Text>}
      </View>
    )
  }
}
