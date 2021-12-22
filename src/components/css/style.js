'use strict';
import { StyleSheet } from 'react-native';

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
  square80: {
    height: 80,
    width: 80
  },
  horizontalLine: {
    borderBottomColor: 'black',
    borderBottomWidth: 1
  }
});
