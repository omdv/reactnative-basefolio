import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,  
  container: {
    flex: 1
  },
  divider: {
    borderBottomColor: Colors.background,
    borderBottomWidth: 2,
  }
})