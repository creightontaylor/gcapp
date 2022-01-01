import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubCompletions from './subcomponents/Completions';

class Completions extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount favorites')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      if (email !== null) {
        // We have data!!
        // console.log('what is the email of this user', email);

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {

      return (
          <View>
            <SubCompletions navigation={this.props.navigation}/>
          </View>

      )
  }
}

export default Completions;
