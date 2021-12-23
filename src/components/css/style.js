'use strict';
import { StyleSheet, Dimensions } from 'react-native';

const primaryColor = '#52A6E5'
const primaryColorLight = 'rgba(82,166,229,0.2)'
const backupPrimaryColor = '#52A6E5'
const backupPrimaryColorLight = 'rgba(82,166,229,0.2)'
const standardColor = '#1e1e1e'
const unselectedColor = 'grey'
const faintColor = '#D2D2D2'
const slightFaintColor = '#BEBEBE'
const extremelyFaintColor = '#F5F5F5'
const errorColor = '#F5A623'
const mainFont = "Tisa"
const baseFontSize = 20

module.exports = StyleSheet.create({

  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: primaryColorLight
  },
  miniSpacer: {
    height: 1
  },
  halfSpacer: {
    height: 5
  },
  spacer: {
    height: 10
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerHorizontally: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  fullSpace: {
    width: '100%',
    height: '100%'
  },
  contain: {
    resizeMode: 'contain'
  },
  pinRight: {
    marginRight: 'auto'
  },
  square8: {
    height: 8,
    width: 8
  },
  square10: {
    height: 10,
    width: 10
  },
  square11: {
    height: 11,
    width: 11
  },
  square15: {
    height: 15,
    width: 15
  },
  square18: {
    height: 18,
    width: 18
  },
  square20: {
    height: 20,
    width: 20
  },
  square40: {
    height: 40,
    width: 40
  },
  square50: {
    height: 50,
    width: 50
  },
  square60: {
    height: 60,
    width: 60
  },
  square80: {
    height: 80,
    width: 80
  },
  profileThumbnail43: {
    height: 43,
    width: 43,
    objectFit: 'contain',
    borderRadius: (43/2)
  },
  profileThumbnail50: {
    height: 50,
    width: 50,
    objectFit: 'contain',
    borderRadius: (50/2)
  },
  profileThumbnail25: {
    height: 25,
    width: 25,
    objectFit: 'contain',
    borderRadius: (25/2)
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },
  verticalSeparator: {
    width: 1,
    height: 30,
    backgroundColor: slightFaintColor
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    boxShadow: '3px 3px 10px rgba(0,0,0,0.2)'
  },
  topMargin20: {
    marginTop: 20
  },
  topMarginNegative36: {
    marginTop: -36
  },
  rightMargin: {
    marginRight: 10
  },
  topPadding: {
    paddingTop: 10
  },
  topPadding5: {
    paddingTop: 5
  },
  topPadding20: {
    paddingTop: 20
  },
  bottomPadding5: {
    paddingBottom: 5
  },
  bottomPadding: {
    paddingBottom: 10
  },
  rightPadding: {
    paddingRight: 10
  },
  leftPadding: {
    paddingLeft: 10
  },
  padding7: {
    padding: 7
  },
  padding20: {
    padding: 20
  },
  horizontalPadding5: {
    paddingLeft: 5,
    paddingRight: 5
  },
  horizontalPadding: {
    paddingLeft: 10,
    paddingRight: 10
  },
  horizontalPadding30: {
    paddingLeft: 30,
    paddingRight: 30
  },
  row5: {
    paddingTop: 5,
    paddingRight: 5
  },
  row10: {
    paddingTop: 10,
    paddingRight: 10
  },
  row15: {
    paddingTop: 10,
    paddingRight: 10
  },
  row20: {
    paddingTop: 10,
    paddingRight: 10
  },
  headingText1: {
    fontSize: (3 * baseFontSize)
  },
  headingText2: {
    fontSize: (1.8 * baseFontSize)
  },
  headingText3: {
    fontSize: (1.3 * baseFontSize)
  },
  headingText4: {
    fontSize: (1.25 * baseFontSize)
  },
  headingText5: {
    fontSize: (1.2 * baseFontSize)
  },
  headingText6: {
    fontSize: (1.1 * baseFontSize)
  },
  descriptionText1: {
    fontSize: (0.9 * baseFontSize)
  },
  descriptionText2: {
    fontSize: (0.8 * baseFontSize)
  },
  descriptionText3: {
    fontSize: (0.7 * baseFontSize)
  },
  descriptionText4: {
    fontSize: (0.6 * baseFontSize)
  },
  descriptionText5: {
    fontSize: (0.5 * baseFontSize)
  },
  boldText: {
    fontWeight: 'bold'
  },
  width40: {
    width: 40
  },
  width60: {
    width: 60
  },
  width70: {
    width: 70
  },
  width80: {
    width: 80
  },
  flexGrow: {
    flexGrow: 1
  },
  rowDirection: {
    flexDirection: 'row'
  },
  standardBorder: {
    border: '1px solid ' + faintColor
  },
  ctaBorder: {
    border: '1px solid ' + primaryColor
  },
  roundedCorners: {
    borderRadius: 10
  },
  fullWidth: {
    width: Dimensions.get('window').width
  },
  progressBar: {
    position: 'relative',
    height: 12,
    width: Dimensions.get('window').width,
    borderRadius: 50,
    border: '1px solid ' + primaryColor
  },
  progressBarThin: {
    position: 'relative',
    height: '6',
    width: Dimensions.get('window').width,
    borderRadius: 50,
    border: '1px solid ' + primaryColor
  },
  progressBarFat: {
    position: 'relative',
    width: Dimensions.get('window').width,
    border: '1px solid ' + primaryColor
  },
  filler: {
    background: primaryColor,
    height: Dimensions.get('window').height,
    borderRadius: 'inherit',
    transition: 'width .2s ease-in'
  },
  fillerError: {
    background: errorColor,
    height: Dimensions.get('window').height,
    borderRadius: 'inherit',
    transition: 'width .2s ease-in'
  },
  leftText: {
    textAlign: 'left'
  },
  centerText: {
    textAlign: 'center'
  },
  rightText: {
    textAlign: 'right'
  },
  imageFullAuto: {
    width: '100%',
    height: 'auto'
  },
  videoContainer: {
    position: 'relative',
    paddingBottom: '56.25%',
    paddingTop: 25,
    height: 0
  },
  videoIframe: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%'
  },
  descriptionTextColor: {
    color: unselectedColor
  },
  btnSquarish: {
    height: 40,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 8
  },
  ctaColor: {
    color: primaryColor
  },
  errorColor: {
    color: errorColor
  },
  whiteColor: {
    color: 'white'
  },
  ctaBackgroundColor: {
    backgroundColor: primaryColor
  },
  errorBackgroundColor: {
    backgroundColor: errorColor
  }

});
