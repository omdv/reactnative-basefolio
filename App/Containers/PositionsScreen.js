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

class PositionsScreen extends Component {

  renderRowOpen ({item}) {
    const isPositive = item.gain > 0 ? 1 : 0
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit'}
    return (
      <View style={[styles.rowContainer, {backgroundColor: isPositive ? Colors.positive: Colors.negative}]}>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.rowText}>BUY: {item.amount.toFixed(8)}</Text>
          <Text style={styles.rowText}>@ {item.buy_price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          <Text style={styles.rowText}>on {new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(item.buy_date))}</Text>
        </View>
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.rowText}>VALUE: {item.current_value.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
          <Text style={styles.rowText}>P/L: {item.gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })} ({item.return.toFixed(2)}%)</Text>
        </View>
      </View>
    )
  }

  renderClosedPositions({item}) {
    return (
        <View style={{flex: 1, flexDirection: 'row', justifyContent: 'space-between'}}>
          <Text style={styles.rowText}>{item.buy_price}</Text>
          <Text style={styles.rowText}>{item.buy_date}</Text>
        </View>
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
    const { positions } = this.props
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header} >
          <View style={{width: 50}}><Icon name='chevron-left' color={Colors.navigation} onPress={() => goBack()}/></View>
          <View><Text style={styles.titleText}>Positions for {coin}</Text></View>
          <View style={{width: 50}}></View> 
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
          <View><Text style={styles.sectionHeader}>Closed positions</Text></View>
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
    positions: state.positions.positions
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    savePositions: (positions) => dispatch(PositionsActions.savePositions(positions))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(PositionsScreen)
