import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TextInput, FlatList, TouchableOpacity, AsyncStorage, Linking } from 'react-native';
import Axios from 'axios';
const styles = require('./css/style');

class FinancialPlanner extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount FinancialPlanner')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      if (email !== null) {

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {

      return (
          <View>
            <View style={[styles.card]}>
              <Text style={[styles.headingText6,styles.topMargin,styles.centerText]}>For the best experience, use the web app on desktop.</Text>

              <Text style={[styles.descriptionText2,styles.topMargin20,styles.centerText]}>Use the web-based financial planner to compare pay of various career paths and project your net worth based on your estimated expenses.</Text>

              <View style={[styles.topMargin30]}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/app/exploration')} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}>
                  <Text style={[styles.headingText6,styles.whiteColor]}>Use the Web App</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>

      )
  }
}

export default FinancialPlanner;
