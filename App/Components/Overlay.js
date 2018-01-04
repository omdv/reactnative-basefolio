import React, { Component } from 'react'
import PropTypes from 'prop-types'
import { View, Text } from 'react-native'
import styles from './Styles/OverlayStyle'
// timer
const timer = require('react-native-timer')

export default class Overlay extends Component {
  // Prop type warnings
  static propTypes = {
    text: PropTypes.string
  }

  state = {
    isVisible: false,
  }

  showComponent(){
    this.setState({isVisible: true}, () => timer.setTimeout(
      this, 'hideMsg', () => this.setState({isVisible: false}), 2000
    ))
  }

  componentDidMount(){
    this.showComponent()
  }

  componentWillUnmount() {
    timer.clearTimeout(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.text !== this.props.text) {
      this.showComponent()
    }
  }

  render () {
    const { text } = this.props
    const { isVisible } = this.state
    if (isVisible) {
      return <View style={styles.overlay}>
        <View style={styles.overlay_view}>
          <Text style={{color: "white", opacity: 1.0}}>{ text }</Text>
        </View>
      </View>
    } else {
      return null
    }
  }
}
