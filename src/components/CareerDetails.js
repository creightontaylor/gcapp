import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubCareerDetails from './subcomponents/CareerDetails';

class CareerDetails extends Component {
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

        let careerSelected = null
        if (this.props) {
          // console.log('show params: ', this.props.route)

          careerSelected = this.props.route.params.careerSelected.name
          this.setState({ careerSelected })

        }

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within parentCareerDetails ')

    if (this.props.route.params && this.props.route.params.careerSelected !== prevProps.route.params.careerSelected) {
      console.log('new career selected in parent')
      this.setState({ careerSelected: this.props.route.params.careerSelected.name })
    }
  }

  render() {
    return (
      <View>
        <SubCareerDetails navigation={this.props.navigation} careerSelected={this.state.careerSelected}/>
      </View>
    )
  }
}

export default CareerDetails;
