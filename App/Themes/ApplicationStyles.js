import Fonts from './Fonts'
import Metrics from './Metrics'
import Colors from './Colors'

// This file is for a reusable grouping of Theme items.
// Similar to an XML fragment layout in Android

const ApplicationStyles = {
  screen: {
    mainContainer: {
      flex: 1,
      backgroundColor: Colors.transparent
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      bottom: 0,
      right: 0
    },
    container: {
      flex: 1,
      paddingTop: Metrics.baseMargin,
      backgroundColor: Colors.transparent
    },
    section: {
      margin: Metrics.smallMargin,
      padding: Metrics.baseMargin,
      backgroundColor: Colors.section_background,
      borderRadius: 5
    },
    sectionText: {
      ...Fonts.style.normal,
      paddingVertical: Metrics.smallMargin,
      color: Colors.snow,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center'
    },
    sectionTextLink: {
      ...Fonts.style.normal,
      paddingVertical: Metrics.smallMargin,
      color: Colors.snow,
      marginVertical: Metrics.smallMargin,
      textAlign: 'center',
      textDecorationLine: 'underline'
    },
    sectionTitle: {
      ...Fonts.style.h4,
      color: Colors.snow,
      textAlign: 'center'
    },
    subtitle: {
      color: Colors.snow,
      padding: Metrics.smallMargin,
      marginBottom: Metrics.smallMargin,
      marginHorizontal: Metrics.smallMargin
    },
    titleText: {
      ...Fonts.style.h2,
      fontSize: 14,
      color: Colors.text,
      paddingTop: 4
    },
    header: {
      marginTop: Metrics.baseMargin*3,
      flexDirection: 'row',
      justifyContent: 'space-between'
    },
    content: {
      flex: 1,
    },
    positionsRowContainer: {
      borderRadius: 5,
      marginVertical: Metrics.baseMargin,
      marginHorizontal: Metrics.doubleBaseMargin,
      backgroundColor: Colors.background
    },
    positionsRowText: {
      alignSelf: 'center',
      color: Colors.background,
      textAlign: 'center',
      margin: 3,
      fontSize: Fonts.size.small
    },
  },
  darkLabelContainer: {
    padding: Metrics.smallMargin,
    paddingBottom: Metrics.doubleBaseMargin,
    borderBottomColor: Colors.border,
    borderBottomWidth: 1,
    marginBottom: Metrics.baseMargin
  },
  darkLabel: {
    fontFamily: Fonts.type.bold,
    color: Colors.snow
  },
  groupContainer: {
    margin: Metrics.smallMargin,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center'
  },
  sectionTitle: {
    ...Fonts.style.h4,
    color: Colors.coal,
    backgroundColor: Colors.ricePaper,
    padding: Metrics.smallMargin,
    marginTop: Metrics.smallMargin,
    marginHorizontal: Metrics.baseMargin,
    borderWidth: 1,
    borderColor: Colors.ember,
    alignItems: 'center',
    textAlign: 'center'
  },
  formatValues: '$0.00a',
  formatPercent: '0.00a%',
  formatPrices: '$0.000a'
}

export default ApplicationStyles
