import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubOpportunityDetails from './subcomponents/OpportunityDetails';

class OpportunityDetails extends Component {
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

        let selectedOpportunity = null
        let objectId = null
        if (this.props.route && this.props.route.params) {
          selectedOpportunity = this.props.route.params.selectedOpportunity
          objectId = this.props.route.params.objectId
        }

        if (selectedOpportunity) {

          let username = AsyncStorage.getItem('username');
          let cuFirstName = AsyncStorage.getItem('firstName');
          let cuLastName = AsyncStorage.getItem('lastName');
          let roleName = AsyncStorage.getItem('roleName');
          let activeOrg = AsyncStorage.getItem('activeOrg');

          this.setState({ emailId: email, username, cuFirstName, cuLastName, roleName, activeOrg, selectedOpportunity })

        } else if (objectId) {
          Axios.get('https://www.guidedcompass.com/api/postings/byid', { params: { _id: objectId } })
          .then((response) => {
             console.log('Posting detail by id query attempted', response.data);

             if (response.data.success) {
               console.log('successfully retrieved posting')

               const selectedOpportunity = response.data.posting

               let username = AsyncStorage.getItem('username');
               let cuFirstName = AsyncStorage.getItem('firstName');
               let cuLastName = AsyncStorage.getItem('lastName');
               let roleName = AsyncStorage.getItem('roleName');
               let activeOrg = AsyncStorage.getItem('activeOrg');

               this.setState({ emailId: email, username, cuFirstName, cuLastName, roleName, activeOrg, selectedOpportunity })
             }
          }).catch((error) => {
              console.log('Posting query did not work', error);
          });
        }

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {
    return (
      <View>
        <SubOpportunityDetails navigation={this.props.navigation} selectedOpportunity={this.state.selectedOpportunity} match={this.props.match}/>
      </View>
    )
  }
}

export default OpportunityDetails;
