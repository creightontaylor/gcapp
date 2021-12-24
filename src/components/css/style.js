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
  superSpacer: {
    height: 50
  },
  flexCenter: {
    alignItems: 'center',
    justifyContent: 'center'
  },
  centerHorizontally: {
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  centerItem: {
    margin: 'auto',
  },
  fullSpace: {
    width: '100%',
    height: '100%'
  },
  alignEnd: {
    alignItems: 'flex-end'
  },
  justifyEnd: {
    justifyContent: 'flex-end'
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
  square9: {
    height: 9,
    width: 9
  },
  square10: {
    height: 10,
    width: 10
  },
  square11: {
    height: 11,
    width: 11
  },
  square12: {
    height: 12,
    width: 12
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
  square22: {
    height: 22,
    width: 22
  },
  square25: {
    height: 25,
    width: 25
  },
  square28: {
    height: 28,
    width: 28
  },
  square30: {
    height: 30,
    width: 30
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
  square70: {
    height: 70,
    width: 70
  },
  square80: {
    height: 80,
    width: 80
  },
  square100: {
    height: 100,
    width: 100
  },
  profileThumbnail25: {
    height: 25,
    width: 25,
    objectFit: 'contain',
    borderRadius: (25/2)
  },
  profileThumbnail40: {
    height: 40,
    width: 40,
    objectFit: 'contain',
    borderRadius: (40/2)
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
  profileThumbnail80: {
    height: 80,
    width: 80,
    objectFit: 'contain',
    borderRadius: (80/2)
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
  mediumShadow: {
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  card: {
    backgroundColor: 'white',
    padding: 30,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  cardClearPadding: {
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  topMargin: {
    marginTop: 10
  },
  topMargin15: {
    marginTop: 15
  },
  topMargin20: {
    marginTop: 20
  },
  topMarginNegative2: {
    marginTop: -2
  },
  topMarginNegative36: {
    marginTop: -36
  },
  rightMargin: {
    marginRight: 10
  },
  leftMargin: {
    marginLeft: 10
  },
  leftMargin: {
    marginLeft: 10
  },
  leftMargin58: {
    marginLeft: 58
  },
  leftMargin67: {
    marginLeft: 67
  },
  bottomMargin20: {
    marginBottom: 20
  },
  verticalMargin10: {
    marginTop: 10,
    marginBottom: 10
  },
  topPadding: {
    paddingTop: 10
  },
  topPadding5: {
    paddingTop: 5
  },
  topPadding15: {
    paddingTop: 15
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
  bottomPadding30: {
    paddingBottom: 30
  },
  rightPadding5: {
    paddingRight: 5
  },
  rightPadding8: {
    paddingRight: 8
  },
  rightPadding: {
    paddingRight: 10
  },
  rightPadding20: {
    paddingRight: 20
  },
  leftPadding: {
    paddingLeft: 10
  },
  leftPadding15: {
    paddingLeft: 15
  },
  leftPadding70: {
    paddingLeft: 70
  },
  padding7: {
    padding: 7
  },
  padding10: {
    padding: 10
  },
  padding20: {
    padding: 20
  },
  padding30: {
    padding: 30
  },
  horizontalPadding3: {
    paddingLeft: 3,
    paddingRight: 3
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
  row7: {
    paddingTop: 7,
    paddingRight: 7
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
  width25: {
    width: 25
  },
  width30: {
    width: 30
  },
  width35: {
    width: 35
  },
  width40: {
    width: 40
  },
  width50: {
    width: 50
  },
  width55: {
    width: 55
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
  width100: {
    width: 100
  },
  width120: {
    width: 120
  },
  width140: {
    width: 140
  },
  width150: {
    width: 150
  },
  width160: {
    width: 160
  },
  width190: {
    width: 190
  },
  width210: {
    width: 210
  },
  height5: {
    height: 5
  },
  height30: {
    height: 30
  },
  height40: {
    height: 40
  },
  height150: {
    height: 150
  },
  calcColumn40: {
    width: Dimensions.get('window').width - 40
  },
  calcColumn60: {
    width: Dimensions.get('window').width - 60
  },
  calcColumn80: {
    width: Dimensions.get('window').width - 80
  },
  calcColumn100: {
    width: Dimensions.get('window').width - 100
  },
  calcColumn105: {
    width: Dimensions.get('window').width - 105
  },
  calcColumn108: {
    width: Dimensions.get('window').width - 108
  },
  calcColumn110: {
    width: Dimensions.get('window').width - 110
  },
  calcColumn118: {
    width: Dimensions.get('window').width - 118
  },
  calcColumn120: {
    width: Dimensions.get('window').width - 120
  },
  calcColumn125: {
    width: Dimensions.get('window').width - 125
  },
  calcColumn130: {
    width: Dimensions.get('window').width - 130
  },
  calcColumn140: {
    width: Dimensions.get('window').width - 140
  },
  calcColumn150: {
    width: Dimensions.get('window').width - 150
  },
  calcColumn160: {
    width: Dimensions.get('window').width - 160
  },
  calcColumn170: {
    width: Dimensions.get('window').width - 170
  },
  calcColumn190: {
    width: Dimensions.get('window').width - 190
  },
  calcColumn200: {
    width: Dimensions.get('window').width - 200
  },
  calcColumn208: {
    width: Dimensions.get('window').width - 200
  },
  calcColumn60Of50: {
    width: (Dimensions.get('window').width / 2) - 60
  },
  flexGrow: {
    flexGrow: 1
  },
  rowDirection: {
    flexDirection: 'row'
  },
  flex1: {
    flex: 1
  },
  flex5: {
    flex: 5
  },
  flex6: {
    flex: 6
  },
  flex10: {
    flex: 10
  },
  flex11: {
    flex: 11
  },
  flex15: {
    flex: 15
  },
  flex33: {
    flex: 33
  },
  flex50: {
    flex: 50
  },
  flex70: {
    flex: 70
  },
  flex80: {
    flex: 80
  },
  standardBorder: {
    borderWidth: 1,
    borderColor: faintColor,
  },
  ctaBorder: {
    borderWidth: 1,
    borderColor: primaryColor,
  },
  errorBorder: {
    borderWidth: 1,
    borderColor: errorColor,
  },
  lightBorder: {
    borderWidth: 1,
    borderColor: faintColor,
  },
  whiteBorder: {
    borderWidth: 1,
    borderColor: 'white',
  },
  transparentBorder: {
    borderWidth: 1,
    borderColor: 'transparent',
  },
  roundedCorners: {
    borderRadius: 10
  },
  slightlyRoundedCorners: {
    borderRadius: 5
  },
  fullWidth: {
    width: null
  },
  fullScreenWidth: {
    width: Dimensions.get('window').width
  },
  progressBar: {
    position: 'relative',
    height: 12,
    width: Dimensions.get('window').width,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: primaryColor,
  },
  progressBarThin: {
    position: 'relative',
    height: '6',
    width: Dimensions.get('window').width,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: primaryColor,
  },
  progressBarFat: {
    position: 'relative',
    width: Dimensions.get('window').width,
    borderWidth: 1,
    borderColor: primaryColor,
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
  btnPrimary: {
    height: 40,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 8
  },
  btnSquarish: {
    height: 40,
    paddingTop: 3,
    paddingBottom: 3,
    paddingRight: 15,
    paddingLeft: 15,
    borderRadius: 8
  },
  btnSmall: {
    height: 30,
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
  },
  darkBackground: {
    backgroundColor: 'rgba(90,90,90,1)'
  },
  darkishBackground: {
    backgroundColor: 'rgba(150,150,150,1)'
  },
  mediumBackground: {
    backgroundColor: slightFaintColor
  },
  faintBackground: {
    backgroundColor: faintColor
  },
  lightBackground: {
    backgroundColor: extremelyFaintColor
  },
  whiteBackground: {
    backgroundColor: 'white'
  },
  tagContainerThin: {
    paddingTop: 4,
    paddingBottom: 4,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 2,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(230,230,230,1)'
  },
  tagContainer7: {
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 20,
    paddingRight: 20,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: 'transparent',
    backgroundColor: 'rgba(230,230,230,1)'
  },
  borderRadius10: {
    borderRadius: 10
  },
  commentBubble2: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: 'transparent',
    padding: 15
  },
  commentBackgroundStudent: {
    backgroundColor: extremelyFaintColor
  },
  commentBackgroundMentor: {
    backgroundColor: 'rgba(254, 216,177,0.5);'
  },
  commentBackgroundEmployer: {
    backgroundColor: 'rgba(254, 216,177,0.5);'
  },
  commentBackgroundTeacher: {
    backgroundColor: 'rgba(254, 216,177,0.5);'
  },
  commentBackgroundAdmin: {
    backgroundColor: 'rgba(135,206,250,0.25);'
  },
  verticalSeparator: {
    width: 1,
    height: 25,
    backgroundColor: slightFaintColor
  },
  verticalSeparator30: {
    width: 1,
    height: 30,
    backgroundColor: slightFaintColor
  },
  commentTextField: {
    height: 48,
    width: null,
    marginTop: 1,
    borderRadius: 5
  },
  editComment: {
    height: 38,
    width: null,
    marginTop: 1,
    borderRadius: 5,
    paddingLeft: 10
  },
  washOut: {
    opacity: 0.25
  },
  washOut2: {
    opacity: 0.4
  },
  elevatedBox: {
    borderWidth: 1,
    borderColor: slightFaintColor,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    margin: '10px 2%',
    paddingBottom: 30,
  },
  relativePosition: {
    position: 'relative'
  },
  absolutePosition: {
      position: 'absolute'
  },
  absoluteTop5: {
    top: '5%'
  },
  absoluteLeft5: {
    left: '5%'
  },
  absoluteRight5: {
    right: '5%'
  },
  nowrap: {
    whiteSpace: 'nowrap'
  },
  carousel: {
    overflow: 'scroll',
    whiteSpace: 'nowrap'
  },
  selectedCarouselItem2: {
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: 'rgba(135,206,250,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderBottomColor: primaryColor,
    borderBottomWidth: 1
  },
  menuButton2: {
    paddingTop: 15,
    paddingBottom: 15,
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    border: 0,
    borderRadius: 3,
    transition: 'background-color 0.2s, border 0.2s, color 0.2s'
  },
  filterFieldSearch: {
    borderWidth: 1,
    borderColor: faintColor,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5,
    width: 250,
    marginTop: 15,
    marginRight: 10
  }

});
