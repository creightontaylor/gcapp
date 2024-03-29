'use strict';
import { StyleSheet, Dimensions } from 'react-native';

const primaryColor = '#1F82CC'
const primaryColorLight = 'rgba(82,166,229,0.2)'
const backupPrimaryColor = '#52A6E5'
const backupPrimaryColorLight = 'rgba(82,166,229,0.2)'
const standardColor = '#1e1e1e'
const unselectedColor = 'grey'
const faintColor = '#D2D2D2'
const slightFaintColor = '#BEBEBE'
const extremelyFaintColor = 'rgba(178,186,191,0.2)'
const errorColor = '#F5A623'
const middleColor = '#4C0099'
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
  alignStart: {
    alignItems: 'flex-start'
  },
  justifyStart: {
    justifyContent: 'flex-start'
  },
  alignCenter: {
    alignItems: 'center'
  },
  justifyCenter: {
    justifyContent: 'center'
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
  square13: {
    height: 13,
    width: 13
  },
  square14: {
    height: 14,
    width: 14
  },
  square15: {
    height: 15,
    width: 15
  },
  square16: {
    height: 16,
    width: 16
  },
  square17: {
    height: 17,
    width: 17
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
  square23: {
    height: 23,
    width: 23
  },
  square24: {
    height: 24,
    width: 24
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
  square35: {
    height: 35,
    width: 35
  },
  square38: {
    height: 38,
    width: 38
  },
  square40: {
    height: 40,
    width: 40
  },
  square42: {
    height: 42,
    width: 42
  },
  square48: {
    height: 48,
    width: 48
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
  square90: {
    height: 90,
    width: 90
  },
  square100: {
    height: 100,
    width: 100
  },
  square120: {
    height: 120,
    width: 120
  },
  square150: {
    height: 150,
    width: 150
  },
  square200: {
    height: 200,
    width: 200
  },
  square280: {
    height: 280,
    width: 280
  },
  square300: {
    height: 300,
    width: 300
  },
  profileThumbnail25: {
    height: 25,
    width: 25,
    resizeMode: 'contain',
    borderRadius: (25/2)
  },
  profileThumbnail40: {
    height: 40,
    width: 40,
    resizeMode: 'contain',
    borderRadius: (40/2)
  },
  profileThumbnail43: {
    height: 43,
    width: 43,
    resizeMode: 'contain',
    borderRadius: (43/2)
  },
  profileThumbnail50: {
    height: 50,
    width: 50,
    resizeMode: 'contain',
    borderRadius: (50/2)
  },
  profileThumbnail80: {
    height: 80,
    width: 80,
    resizeMode: 'contain',
    borderRadius: (80/2)
  },
  lightHorizontalLine: {
    borderBottomColor: slightFaintColor,
    borderBottomWidth: 1
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1
  },
  ctaHorizontalLine: {
    borderBottomColor: primaryColor,
    borderBottomWidth: 1
  },
  verticalSeparator: {
    width: 1,
    height: 30,
    backgroundColor: slightFaintColor
  },
  darkUnderline: {
    borderBottomWidth: 2,
    borderColor: standardColor
  },
  whiteUnderline: {
    borderBottomWidth: 2,
    borderColor: '#fff'
  },
  ctaUnderline: {
    borderBottomWidth: 2,
    borderColor: primaryColor
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
  topMargin3: {
    marginTop: 3
  },
  topMargin5: {
    marginTop: 5
  },
  topMargin8: {
    marginTop: 8
  },
  topMargin: {
    marginTop: 10
  },
  topMargin12: {
    marginTop: 12
  },
  topMargin15: {
    marginTop: 15
  },
  topMargin20: {
    marginTop: 20
  },
  topMargin25: {
    marginTop: 25
  },
  topMargin30: {
    marginTop: 30
  },
  topMargin40: {
    marginTop: 40
  },
  topMargin50: {
    marginTop: 50
  },
  topMarginNegative2: {
    marginTop: -2
  },
  topMarginNegative3: {
    marginTop: -3
  },
  topMarginNegative4: {
    marginTop: -4
  },
  topMarginNegative5: {
    marginTop: -5
  },
  topMarginNegative7: {
    marginTop: -7
  },
  topMarginNegative8: {
    marginTop: -8
  },
  topMarginNegative10: {
    marginTop: -10
  },
  topMarginNegative40: {
    marginTop: -40
  },
  topMarginNegative30: {
    marginTop: -30
  },
  topMarginNegative36: {
    marginTop: -36
  },
  rightMarginNegative28: {
    marginRight: -28
  },
  rightMarginNegative12: {
    marginRight: -12
  },
  rightMargin5: {
    marginRight: 5
  },
  rightMargin: {
    marginRight: 10
  },
  rightMargin20: {
    marginRight: 20
  },
  rightMargin30: {
    marginRight: 30
  },
  rightMargin40: {
    marginRight: 40
  },
  leftMarginNegative14: {
    marginLeft: -14
  },
  leftMarginNegative30: {
    marginLeft: -30
  },
  leftMargin3: {
    marginLeft: 3
  },
  leftMargin5: {
    marginLeft: 5
  },
  leftMargin: {
    marginLeft: 10
  },
  leftMargin12: {
    marginLeft: 12
  },
  leftMargin15: {
    marginLeft: 15
  },
  leftMargin18: {
    marginLeft: 18
  },
  leftMargin20: {
    marginLeft: 20
  },
  leftMargin30: {
    marginLeft: 30
  },
  leftMargin40: {
    marginLeft: 40
  },
  leftMargin50: {
    marginLeft: 50
  },
  leftMargin58: {
    marginLeft: 58
  },
  leftMargin67: {
    marginLeft: 67
  },
  bottomMarginNegative18: {
    marginBottom: -18
  },
  bottomMarginNegative35: {
    marginBottom: -35
  },
  bottomMargin: {
    marginBottom: 10
  },
  bottomMargin20: {
    marginBottom: 20
  },
  bottomMargin30: {
    marginBottom: 30
  },
  bottomMargin50: {
    marginBottom: 50
  },
  bottomMargin200: {
    marginBottom: 200
  },
  horizontalMargin1: {
    marginLeft: 1,
    marginRight: 1
  },
  horizontalMargin5: {
    marginLeft: 5,
    marginRight: 5
  },
  horizontalMargin: {
    marginLeft: 10,
    marginRight: 10
  },
  horizontalMargin20: {
    marginLeft: 20,
    marginRight: 20
  },
  horizontalMargin30: {
    marginLeft: 30,
    marginRight: 30
  },
  verticalMargin10: {
    marginTop: 10,
    marginBottom: 10
  },
  verticalMargin20: {
    marginTop: 20,
    marginBottom: 20
  },
  verticalMargin30: {
    marginTop: 30,
    marginBottom: 30
  },
  topPadding3: {
    paddingTop: 3
  },
  topPadding5: {
    paddingTop: 5
  },
  topPadding7: {
    paddingTop: 7
  },
  topPadding8: {
    paddingTop: 8
  },
  topPadding: {
    paddingTop: 10
  },
  topPadding13: {
    paddingTop: 13
  },
  topPadding15: {
    paddingTop: 15
  },
  topPadding17: {
    paddingTop: 17
  },
  topPadding20: {
    paddingTop: 20
  },
  topPadding25: {
    paddingTop: 25
  },
  topPadding50: {
    paddingTop: 50
  },
  bottomPadding5: {
    paddingBottom: 5
  },
  bottomPadding: {
    paddingBottom: 10
  },
  bottomPadding15: {
    paddingBottom: 15
  },
  bottomPadding20: {
    paddingBottom: 20
  },
  bottomPadding30: {
    paddingBottom: 30
  },
  bottomPadding40: {
    paddingBottom: 40
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
  rightPadding15: {
    paddingRight: 15
  },
  rightPadding20: {
    paddingRight: 20
  },
  rightPadding30: {
    paddingRight: 30
  },
  rightPadding40: {
    paddingRight: 40
  },
  leftPadding3: {
    paddingLeft: 3
  },
  leftPadding5: {
    paddingLeft: 5
  },
  leftPadding: {
    paddingLeft: 10
  },
  leftPadding15: {
    paddingLeft: 15
  },
  leftPadding20: {
    paddingLeft: 20
  },
  leftPadding30: {
    paddingLeft: 30
  },
  leftPadding40: {
    paddingLeft: 40
  },
  leftPadding50: {
    paddingLeft: 50
  },
  leftPadding60: {
    paddingLeft: 60
  },
  leftPadding70: {
    paddingLeft: 70
  },
  leftPadding85: {
    paddingLeft: 85
  },
  leftPadding110: {
    paddingLeft: 110
  },
  padding3: {
    padding: 3
  },
  padding5: {
    padding: 5
  },
  padding7: {
    padding: 7
  },
  padding10: {
    padding: 10
  },
  padding15: {
    padding: 15
  },
  padding20: {
    padding: 20
  },
  padding30: {
    padding: 30
  },
  padding40: {
    padding: 40
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
  horizontalPadding10: {
    paddingLeft: 10,
    paddingRight: 10
  },
  horizontalPadding15: {
    paddingLeft: 15,
    paddingRight: 15
  },
  horizontalPadding20: {
    paddingLeft: 20,
    paddingRight: 20
  },
  horizontalPadding30: {
    paddingLeft: 30,
    paddingRight: 30
  },
  horizontalPadding50: {
    paddingLeft: 50,
    paddingRight: 50
  },
  row5: {
    paddingTop: 5,
    paddingBottom: 5
  },
  row7: {
    paddingTop: 7,
    paddingBottom: 7
  },
  row10: {
    paddingTop: 10,
    paddingBottom: 10
  },
  row15: {
    paddingTop: 15,
    paddingBottom: 15
  },
  row20: {
    paddingTop: 20,
    paddingBottom: 20
  },
  row30: {
    paddingTop: 30,
    paddingBottom: 30
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
  standardText: {
    fontSize: baseFontSize
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
  descriptionText6: {
    fontSize: (0.4 * baseFontSize)
  },
  boldText: {
    fontWeight: 'bold'
  },
  italicizeText: {
    fontStyle: 'italic'
  },
  underlineText: {
    textDecorationLine: 'underline'
  },
  offsetUnderline: {
    textUnderlineOffset: 5
  },
  width10: {
    width: 10
  },
  width20: {
    width: 20
  },
  width22: {
    width: 22
  },
  width25: {
    width: 25
  },
  width30: {
    width: 30
  },
  width33: {
    width: 33
  },
  width35: {
    width: 35
  },
  width40: {
    width: 40
  },
  width42: {
    width: 42
  },
  width45: {
    width: 45
  },
  width48: {
    width: 48
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
  width72: {
    width: 72
  },
  width80: {
    width: 80
  },
  width85: {
    width: 85
  },
  width90: {
    width: 90
  },
  width100: {
    width: 100
  },
  width110: {
    width: 110
  },
  width120: {
    width: 120
  },
  width121: {
    width: 121
  },
  width130: {
    width: 130
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
  width170: {
    width: 170
  },
  width180: {
    width: 180
  },
  width190: {
    width: 190
  },
  width200: {
    width: 200
  },
  width210: {
    width: 210
  },
  width220: {
    width: 220
  },
  width300: {
    width: 300
  },
  height5: {
    height: 5
  },
  height6: {
    height: 6
  },
  height20: {
    height: 20
  },
  height30: {
    height: 30
  },
  height40: {
    height: 40
  },
  height50: {
    height: 50
  },
  height60: {
    height: 60
  },
  height76: {
    height: 76
  },
  height80: {
    height: 80
  },
  height120: {
    height: 120
  },
  height150: {
    height: 150
  },
  height200: {
    height: 200
  },
  calcHeight500: {
    height: Dimensions.get('window').height - 500
  },
  calcColumn25: {
    width: Dimensions.get('window').width - 25
  },
  calcColumn30: {
    width: Dimensions.get('window').width - 30
  },
  calcColumn35: {
    width: Dimensions.get('window').width - 35
  },
  calcColumn40: {
    width: Dimensions.get('window').width - 40
  },
  calcColumn45: {
    width: Dimensions.get('window').width - 45
  },
  calcColumn50: {
    width: Dimensions.get('window').width - 50
  },
  calcColumn60: {
    width: Dimensions.get('window').width - 60
  },
  calcColumn65: {
    width: Dimensions.get('window').width - 65
  },
  calcColumn70: {
    width: Dimensions.get('window').width - 70
  },
  calcColumn80: {
    width: Dimensions.get('window').width - 80
  },
  calcColumn85: {
    width: Dimensions.get('window').width - 85
  },
  calcColumn90: {
    width: Dimensions.get('window').width - 90
  },
  calcColumn92: {
    width: Dimensions.get('window').width - 92
  },
  calcColumn93: {
    width: Dimensions.get('window').width - 93
  },
  calcColumn95: {
    width: Dimensions.get('window').width - 95
  },
  calcColumn100: {
    width: Dimensions.get('window').width - 100
  },
  calcColumn103: {
    width: Dimensions.get('window').width - 103
  },
  calcColumn104: {
    width: Dimensions.get('window').width - 104
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
  calcColumn115: {
    width: Dimensions.get('window').width - 115
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
  calcColumn135: {
    width: Dimensions.get('window').width - 135
  },
  calcColumn138: {
    width: Dimensions.get('window').width - 138
  },
  calcColumn140: {
    width: Dimensions.get('window').width - 140
  },
  calcColumn142: {
    width: Dimensions.get('window').width - 142
  },
  calcColumn145: {
    width: Dimensions.get('window').width - 145
  },
  calcColumn148: {
    width: Dimensions.get('window').width - 148
  },
  calcColumn150: {
    width: Dimensions.get('window').width - 150
  },
  calcColumn155: {
    width: Dimensions.get('window').width - 155
  },
  calcColumn160: {
    width: Dimensions.get('window').width - 160
  },
  calcColumn162: {
    width: Dimensions.get('window').width - 162
  },
  calcColumn165: {
    width: Dimensions.get('window').width - 165
  },
  calcColumn170: {
    width: Dimensions.get('window').width - 170
  },
  calcColumn180: {
    width: Dimensions.get('window').width - 180
  },
  calcColumn181: {
    width: Dimensions.get('window').width - 181
  },
  calcColumn185: {
    width: Dimensions.get('window').width - 185
  },
  calcColumn190: {
    width: Dimensions.get('window').width - 190
  },
  calcColumn195: {
    width: Dimensions.get('window').width - 195
  },
  calcColumn200: {
    width: Dimensions.get('window').width - 200
  },
  calcColumn202: {
    width: Dimensions.get('window').width - 202
  },
  calcColumn205: {
    width: Dimensions.get('window').width - 205
  },
  calcColumn208: {
    width: Dimensions.get('window').width - 208
  },
  calcColumn210: {
    width: Dimensions.get('window').width - 210
  },
  calcColumn220: {
    width: Dimensions.get('window').width - 220
  },
  calcColumn230: {
    width: Dimensions.get('window').width - 230
  },
  calcColumn240: {
    width: Dimensions.get('window').width - 240
  },
  calcColumn260: {
    width: Dimensions.get('window').width - 260
  },
  calcColumn280: {
    width: Dimensions.get('window').width - 280
  },
  calcColumn330: {
    width: Dimensions.get('window').width - 330
  },
  calcColumn60Of50: {
    width: (Dimensions.get('window').width / 2) - 60
  },
  flexWrap: {
    flexWrap: 'wrap'
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
  flex20: {
    flex: 20
  },
  flex25: {
    flex: 25
  },
  flex30: {
    flex: 30
  },
  flex33: {
    flex: 33
  },
  flex40: {
    flex: 40
  },
  flex45: {
    flex: 45
  },
  flex50: {
    flex: 50
  },
  flex55: {
    flex: 55
  },
  flex60: {
    flex: 60
  },
  flex65: {
    flex: 65
  },
  flex70: {
    flex: 70
  },
  flex75: {
    flex: 75
  },
  flex80: {
    flex: 80
  },
  flex90: {
    flex: 90
  },
  flex95: {
    flex: 95
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
  ctaBorderColor: {
    borderColor: primaryColor,
  },
  roundedCorners: {
    borderRadius: 10
  },
  slightlyRoundedCorners: {
    borderRadius: 5
  },
  circleRadius: {
    borderRadius: '50%'
  },
  borderRadius50: {
    borderRadius: 50
  },
  fullWidth: {
    width: null
  },
  fullScreenWidth: {
    width: Dimensions.get('window').width
  },
  fullScreenHeight: {
    height: Dimensions.get('window').height
  },
  screenHeight20: {
    height: (Dimensions.get('window').height) * 0.2
  },
  screenHeight10: {
    height: (Dimensions.get('window').height) * 0.1
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
    height: 6,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: primaryColor,
  },
  progressBarFat: {
    position: 'relative',
    borderWidth: 1,
    borderColor: primaryColor,
  },
  filler: {
    background: primaryColor,
    height: Dimensions.get('window').height,
    borderRadius: 50,
    transition: 'width .2s ease-in'
  },
  fillerError: {
    background: errorColor,
    height: Dimensions.get('window').height,
    borderRadius: 50,
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
  unselectedColor: {
    color: unselectedColor
  },
  unselectedBackgroundColor: {
    backgroundColor: unselectedColor
  },
  selectedBackground: {
    backgroundColor: primaryColor
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
  whiteTintColor: {
    tintColor: 'white'
  },
  ctaColor: {
    color: primaryColor
  },
  middleColor: {
    color: middleColor
  },
  errorColor: {
    color: errorColor
  },
  whiteColor: {
    color: 'white'
  },
  faintColor: {
    color: faintColor
  },
  extremelyFaintColor: {
    color: extremelyFaintColor
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
  transparentBackground: {
    backgroundColor: 'transparent'
  },
  whiteBackground: {
    backgroundColor: 'white'
  },
  primaryBackground: {
    backgroundColor: primaryColor
  },
  primaryBackgroundLight: {
    backgroundColor: 'rgba(82,166,229,0.5)'
  },
  primaryBackgroundSuperLight: {
    backgroundColor: primaryColorLight
  },
  primaryBorder: {
    borderWidth: 1,
    borderColor: primaryColor
  },
  primaryColor: {
    color: primaryColor
  },
  secondaryBackground: {
    backgroundColor: '#70DBDB'
  },
  secondaryBackgroundLight: {
    backgroundColor: 'rgba(112,219,219,0.5)'
  },
  secondaryBorder: {
    borderWidth: 1,
    borderColor: '#70DBDB',
  },
  secondaryColor: {
    color: '#70DBDB'
  },
  tertiaryBackground: {
    backgroundColor: 'rgba(0,190,160,1)'
  },
  tertiaryBackgroundLight: {
    backgroundColor: 'rgba(0,190,160,0.5)'
  },
  tertiaryBorder: {
    borderWidth: 1,
    borderColor: 'rgba(0,190,160,1)',
  },
  tertiaryColor: {
    color: 'rgba(0,190,160,1)'
  },
  quaternaryBackground: {
    backgroundColor: '#0d98ba'
  },
  quaternaryBackgroundLight: {
    backgroundColor: 'rgba(13,152,186,0.5)'
  },
  quaternaryBorder: {
    borderWidth: 1,
    borderColor: '#0d98ba',
  },
  quaternaryColor: {
    color: '#AFEEEE'
  },
  quinaryBackground: {
    backgroundColor: '#01796F'
  },
  quinaryBackgroundLight: {
    backgroundColor: 'rgba(1,121,111,0.5)'
  },
  quinaryBorder: {
    borderWidth: 1,
    borderColor: '#0d98ba',
  },
  quinaryColor: {
    color: '#01796F'
  },
  senaryBackground: {
    backgroundColor: '#FFC8C8'
  },
  senaryBackgroundLight: {
    backgroundColor: 'rgba(255,200,200,0.5)'
  },
  senaryColor: {
    color: '#FFC8C8'
  },
  septaryBackground: {
    backgroundColor: '#E6E6FA'
  },
  septaryBackgroundLight: {
    backgroundColor: 'rgba(230,230,250,0.5)'
  },
  septaryColor: {
    color: '#E6E6FA'
  },
  nonaryBackground: {
    backgroundColor: 'rgba(254,183,0,1)'
  },
  nonaryColor: {
    color: 'rgba(254,183,0,1)'
  },
  denaryBackground: {
    backgroundColor: 'purple'
  },
  denaryColor: {
    color: 'purple'
  },
  elevenBackground: {
    backgroundColor: 'yellow'
  },
  elevenColor: {
    color: 'yellow'
  },
  twelveBackground: {
    backgroundColor: 'green'
  },
  twelveColor: {
    color: 'green'
  },
  thirteenBackground: {
    backgroundColor: 'red'
  },
  thirteenColor: {
    color: 'red'
  },
  tagContainerBasic: {
    paddingTop: 8,
    paddingBottom: 8,
    paddingLeft: 20,
    paddingRight: 20,
    borderWidth: 1,
    borderColor: 'transparent',
    borderRadius: 5
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
  verticalSeparator15: {
    width: 1,
    height: 15,
    backgroundColor: slightFaintColor
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
    borderRadius: 5,
    borderWidth: 1,
    borderColor: faintColor,
    paddingLeft: 8,

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
    marginTop: 10,
    marginBottom: 10,
    paddingBottom: 30,
  },
  relativePosition: {
    position: 'relative'
  },
  absolutePosition: {
      position: 'absolute'
  },
  absoluteTop0: {
    top: 0
  },
  absoluteBottom0: {
    bottom: 0
  },
  absoluteRight0: {
    right: 0
  },
  absoluteLeft0: {
    left: 0
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
  pinBottom: {
    justifyContent: 'space-between'
  },
  nowrap: {

  },
  carousel: {
    overflow: 'scroll',
  },
  overflowYAuto: {
    overflowY: 'hidden'
  },
  selectedCarouselItem: {
    backgroundColor: 'rgba(135,206,250,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    borderBottomColor: primaryColor,
    borderBottomWidth: 1
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
  menuButton: {
    backgroundColor: 'rgba(0,0,0,0)',
    border: 0,
    borderRadius: 3,
    transition: 'background-color 0.2s, border 0.2s, color 0.2s'
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
  menuButtonNotiBubble: {
    padding: 10,
    margin: 0,
    backgroundColor: 'rgba(0,0,0,0)',
    border: 0,
    borderRadius: 3,
    transition: 'background-color 0.2s, border 0.2s, color 0.2s'
  },
  notiBubbleInfo7of9: {
    paddingTop: 7,
    paddingBottom: 7,
    paddingLeft: 9,
    paddingRight: 9,
    borderWidth: 1,
    borderColor: primaryColor
  },
  filterFieldSearch: {
    borderWidth: 1,
    borderColor: faintColor,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 5,
    paddingRight: 5,
    height: 38
  },
  notiBubble: {
    color: 'white',
    fontWeight: 'bold',
    width: 24,
    height: 24,
    borderRadius: 12,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'transparent',
  },
  notiBubbleSmall: {
    color: 'white',
    fontWeight: 'bold',
    width: 18,
    height: 18,
    borderRadius: 9,
    textAlign: 'center',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: faintColor,
  },
  textInput: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: faintColor,
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: (0.9 * baseFontSize)
  },
  textArea: {
    height: 100,
    backgroundColor: '#fff',
    borderColor: faintColor,
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
    fontSize: (0.9 * baseFontSize)
  },
  contrastingContainer1: {
    backgroundColor: 'rgba(135,206,250,0.2)',
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 20,
    paddingBottom: 20
  },
  contrastingContainer2: {
    backgroundColor: 'rgba(245,166,25,0.2)',
    marginTop: 20,
    marginBottom: 20,
    paddingTop: 20,
    paddingBottom: 20
  },
  zIndex1: {
    zIndex: 1
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 5
  },
  curtailText: {
    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis'
  },
  keepLineBreaks: {
    whiteSpace: 'pre-wrap'
  },
  rotate45: {
    transform: [{ rotate: '45deg'}]
  },
  rotate90: {
    transform: [{ rotate: '90deg'}]
  },
  rotate180: {
    transform: [{ rotate: '180deg'}]

  },
  rotate270: {
    transform: [{ rotate: '270deg'}]
  },
  capitalizeText: {
    textTransform: 'capitalize'
  },
  progressBar: {
    position: 'relative',
    height: 12,
    borderRadius: 50,
  },
  filler: {
    transition: 'width .2s ease-in',
    borderRadius: 50,
  },
  darkTint: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    backgroundColor: 'black',
    opacity: 0.3
  }

});
