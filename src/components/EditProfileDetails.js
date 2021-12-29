import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubEditProfileDetails from './subcomponents/EditProfileDetails';

class EditProfileDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount EditProfileDetails')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      console.log('show me values in EditProfileDetails', email, this.props);

      if (email !== null) {
        // We have data!!

        let category = null
        if (this.props) {
          // console.log('show params: ', this.props.route)

          category = this.props.route.params.category
          this.setState({ category })


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
        <SubEditProfileDetails navigation={this.props.navigation} category={this.state.category}/>
      </View>
    )
  }
}

export default EditProfileDetails;
