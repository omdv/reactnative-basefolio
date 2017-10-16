import React, { Component } from 'react'
import PropTypes from 'prop-types'
import {
  View,
  ScrollView,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  Keyboard,
  LayoutAnimation,
  Linking,
  ActivityIndicator
} from 'react-native'
import { connect } from 'react-redux'
import DevscreensButton from '../../ignite/DevScreens/DevscreensButton.js'
import RoundedButton from '../../App/Components/RoundedButton'
import AuthActions from '../Redux/AuthRedux'

// Styles
import { Images } from '../Themes'
import styles from './Styles/AuthScreenStyle'

// OAuth
var credentials = require('../Config/OAuth');


class LoginScreen extends Component {

  static propTypes = {
    payload: PropTypes.object,
    fetching: PropTypes.bool,
    attemptAuth: PropTypes.func
  }

  constructor (props) {
    super(props)
    this.state = {
      token: ''
    }
    this.access_code = ''
  }

  componentDidMount() {
    Linking.addEventListener('url', this._handleOpenUrl)
  }

  componentWillUnmount() {
    Linking.removeEventListener('url', this._handleOpenUrl)
  }

  // extract the coinbase code from the returned url
  _handleOpenUrl = (event) => {
    console.log(event.url)
    this.access_code = event.url.split('code=')[1]
    this._tokenCoinbase()
  }

  // request code, code will be handled by _handleOpenUrl
  _authCoinbase = () => {
    Linking.openURL([
      'https://www.coinbase.com/oauth/authorize?response_type=code',
      '&client_id=', credentials.coinbase.client_id,
      '&redirect_uri=', credentials.coinbase.redirect_uri,
      '&scope=', credentials.coinbase.scopes,
      '&account=all'].join(''))
  }

  // exchange code for a token
  _tokenCoinbase = () => {
    let data = [
      'grant_type=authorization_code',
      '&code=',this.access_code,
      '&client_id=',credentials.coinbase.client_id,
      '&client_secret=',credentials.coinbase.client_secret,
      '&redirect_uri=',credentials.coinbase.redirect_uri].join('')
    let headers = {
      'Content-Type': 'application/x-www-form-urlencoded'
    }
    let fetchUrl = {body: data, method: "POST", headers: headers}
    let url = 'https://api.coinbase.com/oauth/token'

    fetch(url, fetchUrl)
      .then((response) => {
        resp = JSON.parse(response._bodyText)
        this.setState({'token': resp.access_token})
        this.setState({'refresh_token': resp.refresh_token})
        this.props.attemptAuth(this.state.token)
      })
  }

  render () {
    const { fetching } = this.props
    return (
      <ScrollView contentContainerStyle={{justifyContent: 'center'}} style={[styles.container, {height: this.state.visibleHeight}]} keyboardShouldPersistTaps='always'>
        <Image source={Images.logo} style={[styles.topLogo, this.state.topLogo]} />
        <RoundedButton text="Auth with Coinbase" onPress={this._authCoinbase} />
        <ActivityIndicator animating={ fetching } />
      </ScrollView>
    )
  }
}

const mapStateToProps = (state) => {
  return {
    fetching: state.login.fetching
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    attemptAuth: (access_token, refresh_token) => dispatch(AuthActions.authRequest(access_token, refresh_token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoginScreen)
