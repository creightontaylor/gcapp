import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubEmployerDetails from './subcomponents/EmployerDetails';

class EmployerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount EmployerDetails')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      console.log('show me values in EmployerDetails', email, this.props);

      if (email !== null) {
        // We have data!!

        let selectedEmployer = null
        if (this.props) {
          // console.log('show params: ', this.props.route)

          selectedEmployer = this.props.route.params.selectedEmployer
          this.setState({ selectedEmployer })

        }

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within employerDetails ')

    if (this.props.route.params && this.props.route.params.selectedEmployer !== prevProps.route.params.selectedEmployer) {
      console.log('new career selected in parent')
      this.setState({ selectedEmployer: this.props.route.params.selectedEmployer })
    }
  }

  render() {
    return (
      <View>
        <SubEmployerDetails navigation={this.props.navigation} selectedEmployer={this.state.selectedEmployer} />
      </View>
    )
  }
}

export default EmployerDetails;
