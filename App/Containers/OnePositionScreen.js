import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, Picker, View, TextInput } from 'react-native'
import { connect } from 'react-redux'
// Add Actions - replace 'Your' with whatever your reducer is called :)
// import YourActions from '../Redux/YourRedux'

// Components
import RoundedButton from '../Components/RoundedButton'
import DatePicker from 'react-native-datepicker'

// Styles
import styles from './Styles/OnePositionScreenStyle'
import { Colors, Metrics } from '../Themes/'

// import coins
var coins = require('../Config/Coins')['coins']

// import form
var t = require('tcomb-form-native')
const stylesheet = t.form.Form.stylesheet

// changing styles globally
stylesheet.textbox.normal.color = 'white'
stylesheet.textbox.error.color = 'red'
stylesheet.controlLabel.normal.color = 'grey'
stylesheet.dateValue.normal.color = 'white'

// create form
var Form = t.form.Form
var transaction = t.struct({
  cost_basis: t.Number,
  volume: t.Number,
  price: t.Number
})
var options = {
  fields: {
    price: {
      placeholder: "7000"
    },
    volume: {
      placeholder: "0.5"
    },
    cost_basis: {
      placeholder: "3500"
    }
  }
}

class OnePositionScreen extends Component {
  constructor(props) {
    super(props)
    const { transaction } = this.props.navigation.state.params
    this.state = {
      coin: transaction.coin,
      type: transaction.type,
      price: transaction.type === "Buy" ? transaction.buy_price : transaction.sell_price,
      volume: transaction.amount,
      cost_basis: transaction.cost_basis,
      date: transaction.type === "Buy" ? transaction.buy_date : transaction.sell_date
    }
  }

  render () {
    const { goBack } = this.props.navigation
    return (
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          <View style={{flex: 1, flexDirection: "row", margin: 0}}>
            <View style={{flex: .5, margin: 0, padding: 0}}>
              <Picker
              selectedValue={this.state.type}
              onValueChange={(itemValue, itemIndex) => this.setState({type: itemValue})}
              style={styles.picker} itemStyle={styles.pickerItem}>
                {["Buy", "Sell"].map((type,i) => (<Picker.Item label={type} key={i} value={type} color={Colors.snow}/>))}
              </Picker>
            </View>
            <View style={{flex: .5, margin: 0, padding: 0}}>
              <Picker
                selectedValue={this.state.coin}
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
                value={this.state}
              />
            </View>
            <View>
            <DatePicker
                style={{width: Metrics.screenWidth - Metrics.doubleSection, height: 100}}
                date={this.state.date}
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
                onDateChange={(date) => {this.setState({date: date})}}
/>
            </View>
          </View>
          <RoundedButton text="Update transaction" onPress={() => updateTrans()}/>
          <RoundedButton text="Save as new" onPress={() => saveNewTrans()}/>
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
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(OnePositionScreen)
