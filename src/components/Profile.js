import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubExternalProfile from './subcomponents/ExternalProfile';

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount editProfile')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')
      const roleName = await AsyncStorage.getItem('roleName')

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email);

        let username = null
        let matchScore = null

        if (this.props.route.params) {
          username = this.props.route.params.username
          matchScore = this.props.route.params.matchScore

        }
        this.setState({ emailId: email, roleName, profileUsername: username, matchScore });

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {
    return (
      <View>
        <SubExternalProfile navigation={this.props.navigation} username={this.state.profileUsername} roleName={this.state.roleName} source="portal" matchScore={this.state.matchScore}/>
      </View>
    )
  }
}

export default Profile;
