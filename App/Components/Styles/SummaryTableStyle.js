import { StyleSheet } from 'react-native'
import { Metrics, Colors } from '../../Themes'


export default StyleSheet.create({
  container: {
    flex: 1
  },
	listContent: {
    // marginTop: Metrics.baseMargin
  },
  rowContainer: {
    flex: 1,
    height: Metrics.rowHeight,
    flexDirection: 'row',
    margin: Metrics.baseMargin,
    backgroundColor: Colors.background
  },
	rowBoldLabel: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'center',
    margin: 4,
  },
	rowMuteLabel: {
    alignSelf: 'center',
    color: Colors.charcoal,
    textAlign: 'center',
    margin: 4
  },
 	rowButtonLabel: {
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'center',
  },
  rowButtonContainer: {
    margin: Metrics.baseMargin,
    height: Metrics.rowHeight - Metrics.doubleBaseMargin,
    justifyContent: 'center',
    marginHorizontal: Metrics.section,
    padding: 5,
    marginVertical: Metrics.baseMargin,
    backgroundColor: Colors.positive,
    borderRadius: 5
  }
})
