import React, { Component } from 'react';
import { View } from 'react-native';
import Axios from 'axios';

import SubEndorsements from './subcomponents/Endorsements';

class Endorsements extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount endorsements')

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
        <SubEndorsements navigation={this.props.navigation} />
      </View>
    )
  }
}

export default Endorsements;
