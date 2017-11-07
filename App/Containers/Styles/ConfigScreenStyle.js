import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  divider: {
    borderBottomColor: Colors.charcoal,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})