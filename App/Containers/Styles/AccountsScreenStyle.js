import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  topLogo: {
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  graphWrapper: {
    height: 100
  },
  divider: {
    borderBottomColor: Colors.charcoal,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})
