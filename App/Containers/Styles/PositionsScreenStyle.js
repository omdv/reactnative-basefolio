import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  divider: {
    height: Metrics.baseMargin,
    borderBottomColor: Colors.charcoal,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  sectionHeaderRow: {
    paddingHorizontal: Metrics.doubleSection,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  rowContainer: {
    height: Metrics.doubleBaseMargin*2,
    flexDirection: 'column',
    borderRadius: 5,
    margin: Metrics.baseMargin,
    backgroundColor: Colors.background
  },
  rowClosedContainer: {
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
    backgroundColor: Colors.header_background,
  },
  sectionHeaderText: {
    fontSize: Fonts.size.medium,
    color: Colors.text,
    textAlign: 'center'
  }
})
