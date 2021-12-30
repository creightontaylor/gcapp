import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';

const profileIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-grey.png';
const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png';
const addIncomingIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-incoming-icon.png';
const addOutgoingIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-outgoing-icon.png';
const confidentialityIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/confidentiality-icon.png';

import SubEndorsementDetails from '../common/EndorsementDetails';
import SubRequestEndorsements from './RequestEndorsements';

class Endorsements extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)

  }

  componentDidMount() {
    console.log('endorsements component did mount');

    this.retrieveData()

  }

  retrieveData = async() => {
    try {

      console.log('this is causing the error')
      const emailId = await AsyncStorage.getItem('email')
      const username = await AsyncStorage.getItem('username');
      const cuFirstName = await AsyncStorage.getItem('firstName');
      const cuLastName = await AsyncStorage.getItem('lastName');
      const orgFocus = await AsyncStorage.getItem('orgFocus');
      const orgName = await AsyncStorage.getItem('orgName');
      const roleName = await AsyncStorage.getItem('roleName');
      const remoteAuth = await AsyncStorage.getItem('remoteAuth');

      let activeOrg = await AsyncStorage.getItem('activeOrg')
      if (!activeOrg) {
        activeOrg = 'guidedcompass'
      }
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, orgFocus, orgName, remoteAuth
        })
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  render() {
    // console.log('show style: ', Style.styles)
    return (
      <ScrollView>
        <Text>In endorsements</Text>
      </ScrollView>
    );
  }

}

export default Endorsements;
