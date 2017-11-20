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
    alignItems: 'center',
    borderRadius: 5
  },
	rowBoldLabel: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'center',
    marginTop: 2,
  },
	rowMuteLabel: {
    alignSelf: 'center',
    color: Colors.ricePaper,
    textAlign: 'center',
    marginTop: 2
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
    // marginLeft: 0,
    marginVertical: Metrics.baseMargin,
    borderRadius: 5
  }
})
