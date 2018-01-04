import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { ScrollView, Text, KeyboardAvoidingView, View, TouchableOpacity, Linking } from 'react-native'
import { connect } from 'react-redux'

// Redux Actions
import ConfigScreenActions from '../Redux/ConfigScreenRedux'
import AuthActions from '../Redux/AuthRedux'
import GdaxActions from '../Redux/GdaxRedux'

// components
import { Icon, Button } from 'react-native-elements'
import RoundedButton from '../Components/RoundedButton'

// Styles
import styles from './Styles/ConfigScreenStyle'
import { Colors, Metrics } from '../Themes/'

// SVG
import SvgUri from 'react-native-svg-uri'

// import form
var t = require('tcomb-form-native')
const stylesheet = t.form.Form.stylesheet

// changing styles globally
stylesheet.textbox.normal.color = 'white'
stylesheet.controlLabel.normal.color = 'grey'

// create form
var Form = t.form.Form
var gdax_api = t.struct({
  passphrase: t.String,
  api_key: t.String,
  api_secret: t.String
})

class ConfigScreen extends Component {
  static propTypes = {
    user_profile: PropTypes.object,
    accounts: PropTypes.array,
    coinbaseLogout: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.logout = this.logout.bind(this)
    this.state = {
      gdax: {
        passphrase: this.props.passphrase,
        api_key: this.props.api_key,
        api_secret: this.props.api_secret,
      }
    }
  }

  logout () {
    this.props.coinbaseLogout()
    this.props.navigation.navigate('AuthScreen')
  }

  onGdaxUpdate () {
    var value = this.refs.form.getValue();
    this.setState({gdax: value})
    if (value) {
      this.props.gdaxRequest(value.passphrase, value.api_key, value.api_secret)
    }
  }
  
  render () {
    const { goBack } = this.props.navigation
    const { user_profile, accounts, gdaxRequest } = this.props
    const isAuthed = user_profile ? true : false
    const { gdax_authed } = this.props
    return (
      <View style={styles.mainContainer}>
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          <View style={styles.header} >
            <View style={{width: 50}}>
              <Icon name='chevron-left'
                color={Colors.navigation}
                underlayColor={Colors.background}
                onPress={() => goBack()}/>
            </View>
          </View>
          <View style={styles.content}>
            <View style={styles.section}>
              <SvgUri
                style={{paddingVertical: 3}}
                width={Metrics.screenWidth-Metrics.doubleBaseMargin}
                height={Metrics.icons.large}
                source={require("../Images/coinbase.svg")}
              />
              {/* <Text style={styles.sectionText}>{isAuthed ? user_profile.name : null} / {isAuthed ? accounts.length : null} wallets</Text> */}
              <RoundedButton text={isAuthed ? "Log "+user_profile.name+" out" : "Not logged in"} onPress={() => this.logout()}/>
            </View>
            <View style={styles.section}>
              <SvgUri
                  style={{paddingVertical: 3}}
                  width={Metrics.screenWidth-Metrics.doubleBaseMargin}
                  height={Metrics.icons.large}
                  source={require("../Images/gdax.svg")}
                />
              <Text style={styles.sectionTextSmall}>GDAX API keys need to be copied manually. I recommend to generate them on PC and email to yourself so you can easily copy and paste them in the form below. Use the "View" only permission.</Text>
              <TouchableOpacity
                style={{backgroundColor: Colors.section_background}}
                onPress={() => Linking.openURL("https://www.gdax.com/settings/api")}>
                <Text style={styles.sectionTextLink}>Generate API keys</Text>
              </TouchableOpacity>
              <Form
                ref="form"
                type={gdax_api}
                value={this.state.gdax}
              />
              {!gdax_authed && <Text style={styles.sectionText, {color: "red"}}>Invalid GDAX keys!</Text> }
              <RoundedButton text="Save GDAX keys" onPress={() => this.onGdaxUpdate()}/>
            </View>
          </View>
        </KeyboardAvoidingView>
      </ScrollView>
      </View>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    user_profile: state.auth.user_profile,
    accounts: state.auth.accounts,
    passphrase: state.gdax.passphrase,
    api_key: state.gdax.key,
    api_secret: state.gdax.secret,
    gdax_authed: state.gdax.gdax_authed
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    coinbaseLogout: () => dispatch(AuthActions.logout()),
    gdaxRequest: (pass, key, secret) => dispatch(GdaxActions.gdaxRequest(pass, key, secret))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(ConfigScreen)
