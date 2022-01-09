import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubOrgDetails from './subcomponents/OrgDetails';

class OrgDetails extends Component {
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

        let selectedOrg = null
        let orgId = null
        if (this.props.route && this.props.route.params) {
          console.log('show params: ', this.props.route.params.orgCode)
          selectedOrg = this.props.route.params.selectedOrg
          if (selectedOrg) {
            orgId = selectedOrg.orgCode
          } else if (this.props.route.params.orgCode) {
            orgId = this.props.route.params.orgCode
          }
        }

        this.setState({ selectedOrg, orgId })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {
    return (
      <View>
        <SubOrgDetails navigation={this.props.navigation} orgId={this.state.orgId} />
      </View>
    )
  }
}

export default OrgDetails;
