import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import styles from './Styles/OpenPositionCardStyle'
import { Colors } from '../Themes'

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
      return: 0
    }
  }

  render () {
    const { item } = this.props
    const isPositive = item.gain > 0 ? 1 : 0
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit'}    
    return (
      <View style={[styles.rowContainer, {backgroundColor: isPositive ? Colors.positive: Colors.negative}]}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.rowText}>BUY: {item.amount.toFixed(8)}</Text>
          <Text style={styles.rowText}>@ {item.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          <Text style={styles.rowText}>on {new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(item.date))}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.rowText}>VALUE: {item.current_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          <Text style={styles.rowText}>P/L: {item.gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({item.return.toFixed(2)}%)</Text>
        </View>
        { item.original_amount && <View>
          <View style={styles.divider}></View>
           <Text style={styles.rowText}>{"SPLIT POSITION / BUY AMOUNT: " + item.original_amount.toFixed(8)}</Text>
          </View> }
      </View>
    )
  }
}
