import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubAddWorkspaces from './subcomponents/AddWorkspaces';

class AddWorkspaces extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.passOrgs = this.passOrgs.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount EditProfileDetails')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')
      const username = await AsyncStorage.getItem('username')

      // console.log('show me values in EditProfileDetails', email, this.props);

      if (email !== null) {
        // We have data!!

        let opportunityId = null
        let orgCode = null
        if (this.props.route && this.props.route.params) {
          // console.log('show params: ', this.props.route)
          opportunityId = this.props.route.params.opportunityId
          orgCode = this.props.route.params.orgCode
        }

        this.setState({ email, username, opportunityId, orgCode })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  passOrgs(activeOrg, myOrgs) {
    console.log('passOrgs called', activeOrg, myOrgs )

    this.setState({ activeOrg, myOrgs })
  }

  render() {
    return (
      <View>
        <SubAddWorkspaces navigation={this.props.navigation}  opportunityId={this.state.opportunityId} orgCode={this.state.orgCode} passOrgs={this.passOrgs}/>
      </View>
    )
  }
}

export default AddWorkspaces;
