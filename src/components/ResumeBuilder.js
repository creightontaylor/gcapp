import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TextInput, FlatList, TouchableOpacity, AsyncStorage, Linking } from 'react-native';
import Axios from 'axios';
const styles = require('./css/style');

class ResumeBuilder extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount ResumeBuilder')

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

              <Text style={[styles.descriptionText2,styles.topMargin20,styles.centerText]}>Use the web-based resume builder to import your profile into a resume, import skills from your target career paths / opportunities, and generate a resume document.</Text>

              <View style={[styles.topMargin30]}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/app/resume-builder')} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}>
                  <Text style={[styles.headingText6,styles.whiteColor]}>Use the Web App</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>

      )
  }
}

export default ResumeBuilder;
