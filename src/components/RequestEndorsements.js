import React, { Component } from 'react';
import { View, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubRequestEndorsements from './subcomponents/RequestEndorsements';

class RequestEndorsements extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount RequestEndorsements')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      console.log('show me values in RequestEndorsements', email, this.props);

      if (email !== null) {
        // We have data!!

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {
    return (
      <View>
        <SubRequestEndorsements navigation={this.props.navigation}/>
      </View>
    )
  }
}

export default RequestEndorsements;
