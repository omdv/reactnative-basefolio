import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, KeyboardAvoidingView, Picker, View, TextInput } from 'react-native'
import { connect } from 'react-redux'

// Actions
import PositionsActions from '../Redux/PositionsRedux'

// Components
import RoundedButton from '../Components/RoundedButton'
import DatePicker from 'react-native-datepicker'

// Styles
import styles from './Styles/OnePositionScreenStyle'
import { Colors, Metrics } from '../Themes/'

// react-native elements
import { Icon } from 'react-native-elements'

// import coins
var coins = require('../Config/Coins')['coins']

// import form
var t = require('tcomb-form-native')
const stylesheet = t.form.Form.stylesheet

// changing styles globally
stylesheet.textbox.normal.color = 'white'
stylesheet.textbox.error.color = 'red'
stylesheet.textbox.notEditable.backgroundColor = '#222222'
stylesheet.controlLabel.normal.color = 'grey'
stylesheet.dateValue.normal.color = 'white'

// create form
var Form = t.form.Form
var transaction = t.struct({
  cost_basis: t.Number,
  amount: t.Number,
  // price: t.Number
})
var options = {
  fields: {
    // price: {
    //   editable: false
    // }
  }
}

class OnePositionScreen extends Component {
  static propTypes = {
    transaction: PropTypes.object,
    ifUpdate: PropTypes.bool
  }

  defaultTrans = {
    coin: 'BTC',
    type: 'Buy',
    price: '5000',
    amount: '1',
    cost_basis: '5000',
    date: new Date(),
    id: -1
  }

  constructor(props) {
    super(props)
    const { transaction } = this.props.navigation.state.params

    // if split transaction - start from original amount
    try {
      transaction.amount = transaction.original_amount
    } catch(err)
    { }
    
    this.state = transaction ? transaction : defaultTrans

    this.onChange = this.onChange.bind(this)
    this.updateTransAndExit = this.updateTransAndExit.bind(this)
    this.saveNewTransAndExit = this.saveNewTransAndExit.bind(this)
  }
  
  onChange(value) {
    try {
      value.cost_basis = Number(value.cost_basis)
      value.amount = Number(value.amount)
    } catch(err) {
    }

    if (value.amount > 0) {
      value.price = value.cost_basis / value.amount
      if (value.price > 0 && value.price !== Infinity) {
        this.setState(value)
      }
    }
    let t = true
  }

  updateTransAndExit() {
    this.props.updateTrans(this.state)
    this.props.navigation.goBack()
  }

  saveNewTransAndExit() {
    this.props.saveNewTrans(this.state)
    this.props.navigation.goBack()
  }

  render () {
    var trans = Object.assign({},this.state)
    try {
      trans.amount = trans.original_amount
    } catch(err) {}
    const { goBack } = this.props.navigation
    const { ifUpdate } = this.props.navigation.state.params
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header} >
          <View style={{width: 50}}><Icon name='chevron-left' color={Colors.navigation} onPress={() => goBack()}/></View>
          <View><Text style={styles.titleText}>{ifUpdate ? "Edit transaction" : "Create transaction"}</Text></View>
          <View style={{width: 50}}></View> 
        </View>
        <View style={styles.content}>
          <View style={{flex: 1, flexDirection: "row", margin: 0}}>
            <View style={{flex: .5, margin: 0, padding: 0}}>
              <Picker
              selectedValue={trans.type}
              onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}
              style={styles.picker} itemStyle={styles.pickerItem}>
                {["Buy", "Sell"].map((type,i) => (<Picker.Item label={type} key={i} value={type} color={Colors.snow}/>))}
              </Picker>
            </View>
            <View style={{flex: .5, margin: 0, padding: 0}}>
              <Picker
                selectedValue={trans.coin}
                onValueChange={(itemValue, itemIndex) => this.setState({coin: itemValue})}
                style={styles.picker} itemStyle={styles.pickerItem}>
                {coins.map((coin,i) => (<Picker.Item label={coin} key={i} value={coin} color={Colors.snow}/>))}
              </Picker>
            </View>
          </View>
          <View style={{flex: 1, flexDirection: "column"}}>
            <View style={{paddingHorizontal: Metrics.doubleSection, justifyContent: "center"}}>
              <Form
                ref="form"
                type={transaction}
                options={options}
                value={trans}
                onChange={this.onChange}
              />
            </View>
            <View style={{paddingHorizontal: Metrics.doubleSection, justifyContent: "center"}}>
              <Text style={styles.formLabel}>Price</Text>
              <Text style={styles.formText}>{trans.price.toLocaleString('en-US', { style: 'currency', currency: 'USD' })}</Text>              
            </View>
            <View>
            <DatePicker
                style={{width: Metrics.screenWidth - Metrics.doubleSection, height: 100}}
                date={trans.date}
                mode="date"
                format="YYYY-MM-DD"
                confirmBtnText="Confirm"
                cancelBtnText="Cancel"
                showIcon={false}
                customStyles={{
                  dateInput: {
                    borderColor: 'black',
                    borderWidth: 1,
                    borderRadius: 4,
                    marginLeft: Metrics.doubleSection,
                    marginTop: 20,
                  },
                  placeholderText: {
                    fontSize: 18,
                    color: '#000000'
                  },
                  dateText:{
                    color: '#ffffff',
                    justifyContent: 'flex-start',
                    fontSize: 18
                  }
                }}
                onDateChange={(date) => this.setState({date: date})} />
            </View>
          </View>
          <RoundedButton text="Update transaction" onPress={() => this.updateTransAndExit()}/>
          {ifUpdate && <RoundedButton text="Save as new" onPress={() => this.saveNewTransAndExit()}/>}
          <RoundedButton text="Cancel" onPress={() => goBack()} />
        </View>
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateTrans: (transaction) => dispatch(PositionsActions.onePositionUpdate(transaction)),
    saveNewTrans: (transaction) => dispatch(PositionsActions.onePositionAdd(transaction))    
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnePositionScreen)
