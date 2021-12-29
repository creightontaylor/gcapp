import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform } from 'react-native';
import { Card, CardSection } from './common';
import Axios from 'axios';

import SubCommunity from './subcomponents/Community';

class Community extends Component {
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
      console.log('are is this causing the error?')
      //testing badges

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email);

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {
    // console.log('show style: ', Style.styles)
    return (
      <ScrollView>
        <SubCommunity />
      </ScrollView>
    );
  }

}

export default Community;
