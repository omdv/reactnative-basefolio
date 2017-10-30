import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  divider: {
    height: Metrics.doubleBaseMargin*2,
    // borderBottomColor: Colors.charcoal,
    // borderBottomWidth: StyleSheet.hairlineWidth,
  },
  rowContainer: {
    height: Metrics.doubleBaseMargin*2,
    flexDirection: 'column',
    borderRadius: 5,
    margin: Metrics.baseMargin,
    backgroundColor: Colors.background
  },
  rowText: {
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'center',
    margin: 4,
    fontSize: Fonts.size.small
  },
  sectionHeader: {
    marginTop: Metrics.baseMargin,
    fontSize: Fonts.size.medium,
    color: Colors.text,
    backgroundColor: Colors.header_background,
    textAlign: 'center'
  }
})
