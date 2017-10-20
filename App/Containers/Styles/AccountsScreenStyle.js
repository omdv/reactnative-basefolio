import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    paddingTop: 30,
    backgroundColor: Colors.background
  },
  separator: {
    height: 0.2,
    backgroundColor: Colors.charcoal
  },
  label: {
    textAlign: 'center',
    color: Colors.snow
  },
  listContent: {
    // marginTop: Metrics.baseMargin
  },
  topLogo: {
    alignSelf: 'center',
    resizeMode: 'contain'
  },
  divider: {
    height: 1,
    backgroundColor: 'white',
  },
  graphWrapper: {
    height: 100
  },
  divider: {
    borderBottomColor: Colors.charcoal,
    borderBottomWidth: StyleSheet.hairlineWidth,
  }
})
