import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform } from 'react-native';
import Axios from 'axios';
// const styles = require('./css/style');
import NewsFeed from './subcomponents/NewsFeed';
//import { configurePushNotifications } from '../services/PushNotifications';
//import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";

class MySocialPosts extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  retrieveData = async() => {
    try {

      console.log('this is causing the error')
      const email = await AsyncStorage.getItem('email')

     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  render() {
    // console.log('show style: ', Style.styles)
    return (
      <ScrollView>
        <NewsFeed navigation={this.props.navigation} mySocialPosts={true} />
      </ScrollView>
    );
  }

}

export default MySocialPosts;
