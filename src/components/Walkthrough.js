import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubWalkthrough from './subcomponents/Walkthrough';

class Walkthrough extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount walkthrough')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      console.log('show me values in walkthrough', email, this.props);

      if (email !== null) {
        // We have data!!

        let opportunityId = null
        if (this.props.route && this.props.route.params) {
          // console.log('show params: ', this.props.route)
          opportunityId = this.props.route.params.opportunityId
          this.setState({ category })

        }

        this.setState({ opportunityId })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {
    return (
      <View>
        <SubWalkthrough navigation={this.props.navigation} opportunityId={this.state.opportunityId}/>
      </View>
    )
  }
}

export default Walkthrough;
