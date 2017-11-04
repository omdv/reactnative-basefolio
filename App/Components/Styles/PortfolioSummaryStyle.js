import { StyleSheet } from 'react-native'
import { Colors, Metrics, Fonts } from '../../Themes'


export default StyleSheet.create({
  container: {
    flex: 1
  },
  rowSummary: {
    flex:1,
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  colSummary: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'space-between'
  },
  textSummary: {
    alignSelf: 'center',
    color: Colors.summaryText,
    textAlign: 'center',
    margin: 4,
    fontSize: Fonts.size.small
  }
})
