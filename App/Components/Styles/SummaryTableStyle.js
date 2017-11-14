import { StyleSheet } from 'react-native'
import { Metrics, Colors } from '../../Themes'


export default StyleSheet.create({
  container: {
    flex: 1
  },
  rowContainer: {
    flex: 1,
    height: Metrics.rowHeight,
    flexDirection: 'row',
    margin: Metrics.smallMargin,
    paddingHorizontal: Metrics.smallMargin,
    backgroundColor: Colors.almost_black,
    justifyContent: 'space-between',
    borderRadius: 5
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
    textAlignVertical: "center"
  },
  rowButtonContainer: {
    height: Metrics.rowHeight - Metrics.doubleBaseMargin,
    justifyContent: 'center',
    marginLeft: 0,
    marginVertical: Metrics.baseMargin,
    borderRadius: 5
  }
})
