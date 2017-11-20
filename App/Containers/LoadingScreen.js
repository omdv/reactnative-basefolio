import React, { Component } from 'react'
import { Text, View, ActivityIndicator } from 'react-native'
import { connect } from 'react-redux'

// Components
import MainScreen from '../Components/MainScreen'
import Loading from '../Components/Loading'

class LoadingScreen extends Component {
  render () {
    const {isAuthed} = this.props
    if (!isAuthed) {
      return <Loading />
    }
    else {
      return <MainScreen navigation={this.props.navigation} />
    }
  }
}

const mapStateToProps = (state) => {
  return {
    isAuthed: state.auth.is_auth_valid
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(LoadingScreen)
