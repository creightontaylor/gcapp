import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubGroupDetails from './subcomponents/GroupDetails';

class GroupDetails extends Component {
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

      console.log('show me values in GroupDetails')

      if (email !== null) {
        // We have data!!

        let employerSelected = null
        let groupId = null
        if (this.props.route && this.props.route.params) {
          // console.log('show params: ', this.props.route)

          selectedGroup = this.props.route.params.selectedGroup
          groupId = this.props.route.params.objectId

        }

        this.setState({ selectedGroup, groupId })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within groupDetails ')

    if (this.props.route.params && this.props.route.params.selectedGroup !== prevProps.route.params.selectedGroup) {
      // console.log('new career selected in parent')
      this.setState({ selectedGroup: this.props.route.params.selectedGroup})
    }
  }

  render() {
    return (
      <View>
        <SubGroupDetails navigation={this.props.navigation} selectedGroup={this.state.selectedGroup} groupId={this.state.groupId} />
      </View>
    )
  }
}

export default GroupDetails
