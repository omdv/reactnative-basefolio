import { StyleSheet } from 'react-native'
import { ApplicationStyles, Metrics, Colors } from '../../Themes'

export default StyleSheet.create({
  overlay: {
    position: 'absolute',
    left: 0,
    top: -100,
    backgroundColor: 'transparent',
    width: Metrics.screenWidth,
    zIndex: 100,
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlay_view: {
    alignSelf: 'center',
    padding: 10,
    opacity: 0.8,
    backgroundColor: Colors.cloud,
    borderRadius: 10
  }
})
