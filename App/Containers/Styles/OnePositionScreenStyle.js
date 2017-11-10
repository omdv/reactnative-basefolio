import { StyleSheet } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

export default StyleSheet.create({
  ...ApplicationStyles.screen,
  container: {
    flex: 1,
    backgroundColor: Colors.background
  },
  picker: {
    marginVertical: 0,
    paddingVertical: Metrics.smallMargin,
    width: Metrics.screenWidth/2,
  },
  pickerItem: {
    marginVertical: Metrics.smallMargin,
    color: Colors.snow,
    fontSize: 20
  },
  formText: {
    fontSize: Fonts.size.h4,
    color: Colors.snow
  },
  textInput: {
    color: Colors.snow,
    fontSize: 20
  }
})
