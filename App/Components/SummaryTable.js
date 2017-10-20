import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { View, Text, TouchableOpacity, FlatList } from 'react-native'
import styles from './Styles/SummaryTableStyle'
import { Colors } from '../Themes'

export default class SummaryTable extends Component {
  static propTypes = {
    summary: PropTypes.array,
  }

  constructor(props) {
    super(props)
    
    // init returnVal
    let { summary } = props
    let newSummary = []
    summary.map(e => {
      e.returnVal = e.return.toFixed(2)+' %'
      newSummary.push(e)
    })
    this.state = {
      summary: newSummary
    }

    // bind functions
    this.flipButton = this.flipButton.bind(this)
    this.renderRow = this.renderRow.bind(this)
    this.assignReturnValue = this.assignReturnValue.bind(this)
  }

  // init returnKey
  returnKey = "return"
  
  assignReturnValue () {
    let { summary } = this.props
    let newSummary = []
    summary.map(e => {
      e.returnVal = this.returnKey === "return" ? e.return.toFixed(2)+' %' : e.gain.toLocaleString('en-US', { style: 'currency', currency: 'USD' })
      newSummary.push(e)
    })
    this.setState({
      summary: newSummary,
    })
  }
  
  flipButton () {
    this.returnKey = this.returnKey === "return" ? "gain" : "return"
    this.assignReturnValue()
  }

  componentDidMount() {
    this.assignReturnValue()
  }

  componentWillReceiveProps(nextProps) {
    this.props = nextProps
    this.assignReturnValue()
  }

  renderRow ({item}) {
    const isPositive = item.gain > 0 ? 1 : 0
    return (
      <View style={styles.rowContainer}>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.rowBoldLabel}>{item.coin}</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <Text style={styles.rowMuteLabel}>{item.amount.toFixed(8)}</Text>
        </View>
        <View style={{flexDirection: 'column'}}>
          <TouchableOpacity onPress={this.flipButton}>
            <View style={[styles.rowButtonContainer, {"backgroundColor": isPositive ? Colors.positive : Colors.negative}]}>
              <Text style={styles.rowButtonLabel}>{item.returnVal}</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )
  }
  
  // Show this when data is empty
  renderEmpty = () =>
    <Text style={styles.label}> No data </Text>

  keyExtractor = (item, index) => index

  // How many items should be kept im memory as we scroll?
  oneScreensWorth = 20

  render () {
    const { summary } = this.state
    return (
      <View style={styles.container}>
          <FlatList
            contentContainerStyle={styles.listContent}
            data={ summary }
            renderItem={this.renderRow}
            keyExtractor={this.keyExtractor}
            initialNumToRender={this.oneScreensWorth}
            ListEmptyComponent={this.renderEmpty}
          />
      </View>
    )
  }
}
