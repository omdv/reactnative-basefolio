import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors, Fonts } from '../../Themes'


export default StyleSheet.create({
  container: {
    flex: 1
  },
  rowContainer: {
    flexDirection: 'column',
    borderRadius: 5,
    margin: Metrics.baseMargin,
    backgroundColor: Colors.background
  },
  rowText: {
    alignSelf: 'center',
    color: Colors.background,
    textAlign: 'center',
    margin: 4,
    fontSize: Fonts.size.small
  },
  divider: {
    borderBottomColor: Colors.background,
    borderBottomWidth: 2,
  }
})
