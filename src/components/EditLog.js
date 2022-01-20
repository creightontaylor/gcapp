import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubEditLog from './subcomponents/EditLog';

class EditLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount edit log')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      if (email !== null) {
        // We have data!!
        console.log('retrieveData of EditLog parent', this.props);

        let editExisting = false
        let log = null
        let logs = null
        let selectedAdvisor = null
        let passedLogType = null
        let reloadData
        if (this.props.route.params) {
          editExisting = this.props.route.params.editExisting
          log = this.props.route.params.log
          logs = this.props.route.params.logs
          selectedAdvisor = this.props.route.params.selectedAdvisor
          passedLogType = this.props.route.params.passedLogType
          reloadData = this.props.route.params.reloadData
        }

        // const { logId } = this.props.match.params
        // let logId = null
        // if (this.props.match.params) {
        //   logId = this.props.match.params.logId
        // }

        this.setState({ editExisting, log, logs, passedLogType, selectedAdvisor, reloadData });

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {
    return (
      <View>
        <SubEditLog navigation={this.props.navigation} editExisting={this.state.editExisting} log={this.state.log} logs={this.state.logs} passedLogType={this.state.passedLogType} selectedAdvisor={this.state.selectedAdvisor} logId={this.state.logId} reloadData={this.state.reloadData}/>
      </View>
    )
  }
}

export default EditLog;
