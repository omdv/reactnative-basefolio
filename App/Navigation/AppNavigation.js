import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { StackNavigator, addNavigationHelpers } from 'react-navigation'
import LoadingScreen from '../Containers/LoadingScreen'
import OnePositionScreen from '../Containers/OnePositionScreen'
import ConfigScreen from '../Containers/ConfigScreen'
import PositionsScreen from '../Containers/PositionsScreen'
import AuthScreen from '../Containers/AuthScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
export const PrimaryNav = StackNavigator({
  LoadingScreen: { screen: LoadingScreen },
  ConfigScreen: { screen: ConfigScreen },
  PositionsScreen: { screen: PositionsScreen },
  AuthScreen: { screen: AuthScreen },
}, {
  // Default config for all screens
  headerMode: 'none',
  navigationOptions: {
    headerStyle: styles.header
  }
})

const Navigation = ({ dispatch, navigation }) => {
  return (
    <PrimaryNav
      navigation={addNavigationHelpers({ dispatch, state: navigation })}
    />
  )
}

Navigation.propTypes = {
  dispatch: PropTypes.func.isRequired,
  navigation: PropTypes.object.isRequired
}

function mapStateToProps (state) {
  return {
    navigation: state.navigation
  }
}

// export default PrimaryNav
export default connect(mapStateToProps)(Navigation)
