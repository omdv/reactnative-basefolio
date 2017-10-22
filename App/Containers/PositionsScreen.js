import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View, TouchableOpacity, FlatList } from 'react-native'
import { connect } from 'react-redux'
// Components
import RoundedButton from '../Components/RoundedButton'
// Actions
import PositionsActions from '../Redux/PositionsRedux'
// Styles
import styles from './Styles/PositionsScreenStyle'
import { Colors } from '../Themes'
// react-native elements
import { Header, Icon } from 'react-native-elements'

class PositionsScreen extends Component {

  renderRow ({item}) {
    const isPositive = item.gain > 0 ? 1 : 0
    const dateOptions = { year: 'numeric', month: '2-digit', day: '2-digit'}
    return (
      <View style={[styles.rowContainer, {backgroundColor: isPositive ? Colors.positive: Colors.negative}]}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.rowText}>{item.amount.toFixed(8)}</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.rowText}>{item.buy_price.toFixed(2)}</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.rowText}>{new Intl.DateTimeFormat('en-GB', dateOptions).format(new Date(item.buy_date))}</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
        <Text style={styles.rowText}>{item.sell_price ? item.sell_price.toFixed(2) : ''}</Text>
      </View>
      <View style={{flexDirection: 'column'}}>
        <Text style={styles.rowText}>{item.sell_date ? item.sell_date : ''}</Text>
      </View>
      </View>
    )
  }

  renderEmpty = () => <Text style={styles.label}> No data </Text>
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
          <FlatList
            contentContainerStyle={styles.listContent}
            data={ positions[coin] }
            renderItem={this.renderRow}
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
