import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
  },
  totalValue: {
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    margin: Metrics.smallMargin,
    fontSize: Fonts.size.h4,
    },
  returnValue: {
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    margin: Metrics.smallMargin,
    fontSize: Fonts.size.medium,
    }
})
