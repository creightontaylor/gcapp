import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubNotifications from './subcomponents/Notifications';

class Notifications extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount pathways')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email);

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }


  render() {
    return (
      <View>
        <SubNotifications navigation={this.props.navigation} />
      </View>
    )
  }
}

export default Notifications;
