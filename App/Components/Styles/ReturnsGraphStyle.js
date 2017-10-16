import { StyleSheet } from 'react-native'
import { Fonts, Colors, Metrics } from '../../Themes/'

export default StyleSheet.create({
  container: {
    flex: 1,
    height: 200,
    backgroundColor: "#ffffff"
  },
  label: {
    fontWeight: 'bold',
    alignSelf: 'center',
    color: Colors.snow,
    textAlign: 'center',
    margin: 4,
    fontSize: Fonts.size.medium
  }
})
