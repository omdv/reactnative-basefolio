import React, { Component } from 'react'
import { ScrollView, Text, KeyboardAvoidingView, View } from 'react-native'
import { connect } from 'react-redux'

// Redux Actions
import ConfigScreenActions from '../Redux/ConfigScreenRedux'

// react-native elements
import { Icon } from 'react-native-elements'

// Styles
import styles from './Styles/ConfigScreenStyle'
import { Colors } from '../Themes/'


class ConfigScreen extends Component {
  
  render () {
    const { goBack } = this.props.navigation
    return (
      <ScrollView style={styles.container}>
        <KeyboardAvoidingView behavior='position'>
          <View style={styles.header} >
            <View style={{width: 50}}><Icon name='chevron-left' color={Colors.navigation} onPress={() => goBack()}/></View>
            <View><Text style={styles.titleText}>Settings</Text></View>
            <View style={{width: 50}}></View> 
          </View>
        </KeyboardAvoidingView>
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

export default connect(mapStateToProps, mapDispatchToProps)(ConfigScreen)
