import { StackNavigator } from 'react-navigation'
import AuthScreen from '../Containers/AuthScreen'

import styles from './Styles/NavigationStyles'

// Manifest of possible screens
export default StackNavigator({
  AuthScreen: {
    screen: AuthScreen,
    navigationOptions: { title: 'Login' }
  }
}, {
  // Default config for all screens
  headerMode: 'none',
  initialRouteName: 'AuthScreen',
  navigationOptions: {
    headerStyle: styles.header
  }
})
