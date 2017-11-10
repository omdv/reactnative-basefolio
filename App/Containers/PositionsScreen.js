import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, TouchableOpacity, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Components
import ClosedPositionCard from '../Components/ClosedPositionCard'
// Actions
import PositionsActions from '../Redux/PositionsRedux'
// Styles
import styles from './Styles/PositionsScreenStyle'
import { Colors } from '../Themes'
// react-native elements
import { Icon } from 'react-native-elements'
// lodash
import * as _ from 'lodash'

class PositionsScreen extends Component {

  constructor(props) {
    super(props)
    this.renderRowOpen = this.renderRowOpen.bind(this)
  }

  renderRowOpen ({item}) {
    const isPositive = item.gain > 0 ? 1 : 0
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit'}
    return (
      <TouchableOpacity
        style={[styles.rowContainer, {backgroundColor: isPositive ? Colors.positive: Colors.negative}]}
        onPress={() => this.props.navigation.navigate('OnePositionScreen', {transaction: item})}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.rowText}>BUY: {item.amount.toFixed(8)}</Text>
          <Text style={styles.rowText}>@ {item.buy_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          <Text style={styles.rowText}>on {new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(item.buy_date))}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.rowText}>VALUE: {item.current_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          <Text style={styles.rowText}>P/L: {item.gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({item.return.toFixed(2)}%)</Text>
        </View>
      </TouchableOpacity>
    )
  }

  renderRowClosed ({item}) {
    return (
      <ClosedPositionCard item={item}/>
    )
  }

  renderEmpty = () => <Text style={styles.rowText}> No orders </Text>
  keyExtractor = (item, index) => index
  oneScreensWorth = 20

  render () {
    const { goBack } = this.props.navigation
    const { coin } = this.props.navigation.state.params
    const { positions, summaries } = this.props
    summary = _.filter(summaries, v => (v.coin === coin))
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header} >
          <View style={{width: 50}}><Icon name='chevron-left' color={Colors.navigation} onPress={() => goBack()}/></View>
          <View><Text style={styles.titleText}>Positions for {coin}</Text></View>
          <View style={{width: 50}}><Icon name='plus' type="entypo" color={Colors.navigation}/></View> 
        </View>
        <View style={styles.content}>
          <View><Text style={styles.sectionHeader}>Open positions</Text></View>
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
          <View>
            <Text style={styles.sectionHeader}>Closed positions</Text>
            <Text style={styles.sectionHeader}>{summary[0].closed_gain}</Text>
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
