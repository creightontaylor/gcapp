import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubGroups from './subcomponents/Groups';

class Groups extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount groups')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')
      const activeOrg = await AsyncStorage.getItem('activeOrg')

      console.log('show me values in groups', email, this.props);

      if (email !== null) {
        // We have data!!

        // let category = null
        if (this.props) {
          // console.log('show params: ', this.props.route)

          // category = this.props.route.params.category
          // this.setState({ category })


        }

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {
    return (
      <View>
        <SubGroups navigation={this.props.navigation} pageSource="BrowseGroups"/>
      </View>
    )
  }
}

export default Groups;
