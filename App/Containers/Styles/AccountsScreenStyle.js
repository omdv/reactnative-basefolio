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
    height: Metrics.screenHeight/4,
    marginTop: Metrics.baseMargin,
    marginBottom: Metrics.baseMargin
  },
  divider: {
    borderBottomColor: Colors.charcoal,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})
