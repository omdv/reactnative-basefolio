import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, TouchableOpacity, FlatList } from 'react-native'
import { connect } from 'react-redux'

// Components
import ClosedPositionCard from '../Components/ClosedPositionCard'
import OpenPositionCard from '../Components/OpenPositionCard'

// Actions
import PositionsActions from '../Redux/PositionsRedux'
// Styles
import styles from './Styles/PositionsScreenStyle'
import { Colors, Metrics } from '../Themes'

// react-native elements
import { Icon } from 'react-native-elements'

// lodash
import * as _ from 'lodash'

// Output functions
var numeral = require('numeral')

class PositionsScreen extends Component {

  constructor(props) {
    super(props)
    this.renderRowOpen = this.renderRowOpen.bind(this)
    this.renderRowClosed = this.renderRowClosed.bind(this)
  }

  renderRowOpen ({item}) {
    return (
      <View style={{margin: 0, padding: 0}}>
        <OpenPositionCard item={item} />      
      </View>
    )
  }

  renderRowClosed ({item}) {
    return (
      <View style={{margin: 0, padding: 0}}>
        <ClosedPositionCard item={item} />
      </View>
    )
  }

  renderEmpty = () => <Text style={styles.rowText}> No orders </Text>
  keyExtractor = (item, index) => index
  oneScreensWorth = 20

  render () {
    const { goBack } = this.props.navigation
    const { coin, period } = this.props.navigation.state.params
    const { positions, summaries } = this.props
    summary = _.filter(summaries, v => (v.coin === coin))
    return (
      <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <View style={styles.header} >
          <View style={{width: 50}}>
            <Icon name='chevron-left' color={Colors.navigation} onPress={() => goBack()} underlayColor={Colors.background}/></View>
          <View><Text style={styles.titleText}>Summary for {coin}</Text></View>
          <View style={{width: 50}}></View> 
        </View>
        <View style={styles.divider} />
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>Cost basis</Text>
              <Text style={styles.sectionHeaderText}>{numeral(summary[0].cost_basis).format('$0.000a')}</Text>
            </View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>Current value</Text>
              <Text style={styles.sectionHeaderText}>{numeral(summary[0].current_value).format('$0.000a')}</Text>
            </View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>Total P/L</Text>
              <Text style={styles.sectionHeaderText}>{numeral(summary[0].gain).format('$0.000a')}</Text>
            </View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>P/L over {period}</Text>
              <Text style={styles.sectionHeaderText}>{numeral(summary[0].gain_period).format('$0.000a')}</Text>
            </View>
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>Total return</Text>
              <Text style={styles.sectionHeaderText}>{numeral(summary[0].return).format('0.00%')}</Text>
            </View>   
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>Return over {period}</Text>
              <Text style={styles.sectionHeaderText}>{numeral(summary[0].return_period).format('0.00%')}</Text>
            </View>  
            <View style={styles.sectionHeaderRow}>
              <Text style={styles.sectionHeaderText}>Portfolio ratio</Text>
              <Text style={styles.sectionHeaderText}>{numeral(summary[0].ratio).format('0.00%')}</Text>
            </View>
          </View>
        </View>
        <View style={styles.divider} />
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Open positions</Text>
            <Text style={styles.sectionHeaderText}>P/L: {summary[0].open_gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          </View>
          <FlatList
            contentContainerStyle={styles.listContent}
            data={ positions[0][coin] }
            renderItem={this.renderRowOpen}
            keyExtractor={this.keyExtractor}
            initialNumToRender={this.oneScreensWorth}
            ListEmptyComponent={this.renderEmpty}
          />
        </View>
        <View style={styles.divider} />
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Closed positions</Text>
            <Text style={styles.sectionHeaderText}>P/L: {summary[0].closed_gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          </View>
          <FlatList
            contentContainerStyle={styles.listContent}
            data={ positions[1][coin] }
            renderItem={this.renderRowClosed}
            keyExtractor={this.keyExtractor}
            initialNumToRender={this.oneScreensWorth}
            ListEmptyComponent={this.renderEmpty}
          />
        </View>
      </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    positions: state.positions.positions,
    summaries: state.positions.summaries
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    savePositions: (positions) => dispatch(PositionsActions.savePositions(positions))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsScreen)
