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
import { Colors } from '../Themes'

// react-native elements
import { Icon } from 'react-native-elements'

// lodash
import * as _ from 'lodash'

class PositionsScreen extends Component {

  constructor(props) {
    super(props)
    this.renderRowOpen = this.renderRowOpen.bind(this)
    this.renderRowClosed = this.renderRowClosed.bind(this)
  }

  renderRowOpen ({item}) {
    return (
      <TouchableOpacity style={{margin: 0, padding: 0}} onPress={() => this.props.navigation.navigate('OnePositionScreen', {transaction: item, ifUpdate: true})}>
        <OpenPositionCard item={item} />      
      </TouchableOpacity>
    )
  }

  renderRowClosed ({item}) {
    return (
      <TouchableOpacity style={{margin: 0, padding: 0}} onPress={() => this.props.navigation.navigate('OnePositionScreen', {transaction: item, ifUpdate: true})}>
        <ClosedPositionCard item={item} />
      </TouchableOpacity>
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
          {/* <View style={{width: 50}}><Icon name='plus' type="entypo" color={Colors.navigation} onPress={() => this.props.navigation.navigate('OnePositionScreen', {ifUpdate: false})}/></View>  */}
        </View>
        <View style={styles.content}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>Open positions</Text>
            <Text style={styles.sectionHeaderText}>{summary[0].open_gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
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
            <Text style={styles.sectionHeaderText}>{summary[0].closed_gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>
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
