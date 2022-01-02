import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TextInput, FlatList, TouchableOpacity, AsyncStorage, Linking } from 'react-native';
import Axios from 'axios';
const styles = require('./css/style');

class CareerPlanBuilder extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount CareerPlanBuilder')

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

              <Text style={[styles.descriptionText2,styles.topMargin20,styles.centerText]}>Use the web-based career plan builder to import your goals and iron out an overall plan to reach them..</Text>

              <View style={[styles.topMargin30]}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/app/career-plan-builder')} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}>
                  <Text style={[styles.headingText6,styles.whiteColor]}>Use the Web App</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>

      )
  }
}

export default CareerPlanBuilder;
