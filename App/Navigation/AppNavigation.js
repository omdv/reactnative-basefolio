import React, { PropTypes } from 'react'
import { connect } from 'react-redux'
import { StackNavigator, addNavigationHelpers } from 'react-navigation'
import ConfigScreen from '../Containers/ConfigScreen'
import PositionsScreen from '../Containers/PositionsScreen'
import AccountsScreen from '../Containers/AccountsScreen'
import AuthScreen from '../Containers/AuthScreen'
import LoadingScreen from '../Containers/LoadingScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
export const PrimaryNav = StackNavigator({
  ConfigScreen: { screen: ConfigScreen },
  PositionsScreen: { screen: PositionsScreen },
  AccountsScreen: { screen: AccountsScreen },
  AuthScreen: { screen: AuthScreen },
  LoadingScreen: { screen: LoadingScreen },
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
