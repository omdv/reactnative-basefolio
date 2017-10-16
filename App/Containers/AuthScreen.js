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


class AuthScreen extends Component {

  static propTypes = {
    attemptAuth: PropTypes.func
  }

  static propTypes = {
    attemptAuth: PropTypes.func
  }

  constructor (props) {
    super(props)
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
        this.access_token = resp.access_token
        this.refresh_token = resp.refresh_token
        this.props.attemptAuth(this.access_token, this.refresh_token)
      })
  }

  render () {
    const { fetching } = this.props
    return (
      <ScrollView>
        <Image source={Images.logo} style={[styles.topLogo]} />
        <RoundedButton text="Auth with Coinbase" onPress={this._authCoinbase} />
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
    attemptAuth: (access_token, refresh_token) => dispatch(AuthActions.authRequest(access_token, refresh_token))
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthScreen)
