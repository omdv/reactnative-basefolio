import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    margin: 10,
    flexDirection: 'column',
  },
  totalValue: {
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    margin: 4,
    fontSize: Fonts.size.h4,
    },
  returnValue: {
    fontWeight: 'bold',
    alignSelf: 'center',
    textAlign: 'center',
    margin: 4,
    fontSize: Fonts.size.h6,
    }
})
