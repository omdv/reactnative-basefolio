import { StackNavigator } from 'react-navigation'
import LoginScreen from '../Containers/LoginScreen'
import AuthScreen from '../Containers/AuthScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
export default StackNavigator({
  LoginScreen: {
    screen: LoginScreen,
    navigationOptions: { title: 'Login' }
  },
  AuthScreen: {
    screen: AuthScreen,
    navigationOptions: { title: 'Coinbase Auth' }
  }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'AuthScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})
