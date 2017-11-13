import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/SummarySheetStyle'
import { Colors } from '../Themes'

export default class SummarySheet extends Component {
  static propTypes = {
    summary: PropTypes.object,
  }

  render () {
    const { summary } = this.props
    const isPositive = summary.gain_period > 0 ? true : false
    return (
      <View style={styles.container}>
          <View>
            <Text style={[styles.totalValue, {"color": isPositive ? Colors.positive : Colors.negative}]}>{summary.current_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          </View>
          <View>
            <Text style={[styles.returnValue, {"color": isPositive ? Colors.positive : Colors.negative}]}>
              {summary.gain_period.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({summary.return_period.toFixed(2)}%)
            </Text>
          </View>
      </View>
    )
  }
}


