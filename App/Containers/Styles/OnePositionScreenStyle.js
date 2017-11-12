import { StyleSheet, Platform } from 'react-native'
import { ApplicationStyles, Colors, Metrics, Fonts } from '../../Themes/'

var LABEL_COLOR = "grey";
var INPUT_COLOR = "white";
var ERROR_COLOR = "#a94442";
var HELP_COLOR = "#999999";
var BORDER_COLOR = "#cccccc";
var DISABLED_COLOR = "#777777";
var DISABLED_BACKGROUND_COLOR = "#eeeeee";
var FONT_SIZE = 17;
var FONT_WEIGHT = "500";

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
  },
  formText: {
    color: 'white',
    fontSize: 17,
    height: 36,
    paddingVertical: Platform.OS === "ios" ? 7 : 0,
    paddingHorizontal: 7,
    borderRadius: 4,
    borderColor: "#cccccc",
    borderWidth: 1,
    marginBottom: 5,
    backgroundColor: "#222222"
  },
  formLabel: {
    color: 'grey',
    fontSize: 17,
    marginBottom: 7,
    fontWeight: "500"
  },
})
