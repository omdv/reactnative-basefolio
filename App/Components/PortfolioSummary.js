import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text } from 'react-native'
import styles from './Styles/PortfolioSummaryStyle'

export default class PortfolioSummary extends Component {
  // Prop type warnings
  static propTypes = {
    summary: PropTypes.object,
  }
  
  render () {
    const {summary} = this.props
    return (
      <View style={styles.container}>
        {/* <View style={styles.rowSummary}>
          <View style={styles.colSummary}>
            <Text style={styles.textSummary}>Cost Basis</Text>
            <Text style={styles.textSummary}>{summary.cost_basis.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          </View>
          <View style={styles.colSummary}>
            <Text style={styles.textSummary}>Current Value</Text>
            <Text style={styles.textSummary}>{summary.current_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          </View>
        </View> */}
        <View style={styles.rowSummary}>
          <View style={styles.colSummary}>
            <Text style={styles.textSummary}>Open P/L</Text>
            <Text style={styles.textSummary}>{summary.open_gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          </View>
          <View style={styles.colSummary}>
            <Text style={styles.textSummary}>Closed P/L</Text>
            <Text style={styles.textSummary}>{summary.closed_gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          </View>
          <View style={styles.colSummary}>
            <Text style={styles.textSummary}>Total P/L</Text>
            <Text style={styles.textSummary}>{summary.gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          </View>
        </View>
      </View>
    )
  }
}
