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

      console.log('show me values in EmployerDetails');

      if (email !== null) {
        // We have data!!

        let selectedEmployer = null
        let employerId = null
        if (this.props.route && this.props.route.params) {
          // console.log('show params: ', this.props.route)

          selectedEmployer = this.props.route.params.selectedEmployer
          employerId = this.props.route.params.objectId

          this.setState({ selectedEmployer, employerId })

        }

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within employerDetails ')

    if (this.props.route.params && (this.props.route.params.selectedEmployer !== prevProps.route.params.selectedEmployer || this.props.route.params.employerId !== prevProps.route.params.employerId)) {
      console.log('new career selected in parent')
      this.setState({
        selectedEmployer: this.props.route.params.selectedEmployer,
        employerId: this.props.route.params.objectId
      })
    }
  }

  render() {
    return (
      <View>
        <SubEmployerDetails navigation={this.props.navigation} selectedEmployer={this.state.selectedEmployer} employerId={this.state.employerId} />
      </View>
    )
  }
}

export default EmployerDetails;
