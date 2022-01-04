import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

import {convertDateToString} from '../functions/convertDateToString';

class EditProject extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }

        this.retrieveData = this.retrieveData.bind(this)

    }

    componentDidMount() {
      document.body.style.backgroundColor = "#F5F5F5";

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in commonEditGroup', this.props.activeOrg, prevProps)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
        console.log('t0 will update')
        this.retrieveData()
      } else if (this.props.selectedGroup !== prevProps.selectedGroup) {
        this.retrieveData()
      }
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

      return (
          <ScrollView>
            <View>In Edit Project</View>
          </ScrollView>

      )
    }
}

export default EditProject
