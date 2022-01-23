import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubBenchmarkDetails from './subcomponents/BenchmarkDetails';

class BenchmarkDetails extends Component {
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

      console.log('show me values in BenchmaarkDetails', email, this.props);

      if (email !== null) {
        // We have data!!

        let benchmarksId = null
        if (this.props.route && this.props.route.params) {
          // console.log('show params: ', this.props.route)
          if (this.props.route.params.selectedBenchmark) {
            benchmarkId = this.props.route.params.selectedBenchmark._id
          }

          // console.log('show careerSelected: ', careerSelected)
        }

        this.setState({ benchmarkId })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within BenchmarkDetails ')

    if (this.props.route.params && this.props.route.params.selectedBenchmark !== prevProps.route.params.selectedBenchmark) {
      console.log('new benchmark selected in parent')
      this.setState({ benchmarkId: this.props.route.params.selectedBenchmark._id })
    }
  }

  render() {
    return (
      <View>
        <SubBenchmarkDetails navigation={this.props.navigation} benchmarkId={this.state.benchmarkId} />
      </View>
    )
  }
}

export default BenchmarkDetails;
