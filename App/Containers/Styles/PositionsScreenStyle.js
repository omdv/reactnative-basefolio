import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  divider: {
    borderBottomColor: Colors.charcoal,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowContainer: {
    height: 10,
    flexDirection: 'row',
    margin: Metrics.baseMargin,
    backgroundColor: Colors.background
  },
  rowText: {
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'left',
    margin: 4,
    fontSize: Fonts.size.small
  }
})
