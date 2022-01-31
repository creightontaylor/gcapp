import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform } from 'react-native';
import Axios from 'axios';
// const styles = require('./css/style');
import NewsFeed from './subcomponents/NewsFeed';
//import { configurePushNotifications } from '../services/PushNotifications';
//import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
import {saveAnalytics} from './services/Analytics';

import RefreshNotifications from './common/RefreshNotifications';


class Home extends Component {
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
      //const email = 'harry@potter.com'

      const newUser = await AsyncStorage.getItem('newUser')
      if (newUser === 'true') {
        //show walkthroughs, tutorials, and ask for push notification permissions
        console.log('maybe?')
        //ask for push notification permissions
        //configurePushNotifications();

        // let notiCount = 1
        // AsyncStorage.setItem('unreadNotificationsCount', notiCount.toString())
        // this.props.navigation.setParams({ badgeNumber: notiCount });
        // PushNotification.setApplicationIconBadgeNumber(notiCount)
        //
        // AsyncStorage.setItem('newUser', 'false')
        //
        // const takeAssessment = await AsyncStorage.getItem('takeAssessment')
        // if (takeAssessment === 'true') {
        //   this.props.navigation.navigate('InterestAssessment', {
        //     shortAssessment: false
        //   });
        // }
      }

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email);
        // const activeOrg = await AsyncStorage.getItem('activeOrg')
        // saveAnalytics(email,this.constructor.name,activeOrg,Platform.OS)
        saveAnalytics(email,this.constructor.name)

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  render() {
    // console.log('show style: ', Style.styles)
    return (
      <ScrollView>
        <RefreshNotifications navigation={this.props.navigation} fromHome={true} />
        <NewsFeed navigation={this.props.navigation} />
      </ScrollView>
    );
  }

}

export default Home;
