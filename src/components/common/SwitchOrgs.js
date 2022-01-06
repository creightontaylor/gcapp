import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

import {convertDateToString} from '../functions/convertDateToString';

class SwitchOrgs extends Component {
    constructor(props) {
        super(props)

        this.state = {

        }

        this.retrieveData = this.retrieveData.bind(this)

    }

    componentDidMount() {

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in commonSwitchOrgs', this.props.activeOrg, prevProps)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
        console.log('t0 will update')
        this.retrieveData()
      } else if (this.props.selectedGroup !== prevProps.selectedGroup) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in renderPosts')

        const emailId = await AsyncStorage.getItem('email');
        const username = await AsyncStorage.getItem('username');
        const cuFirstName = await AsyncStorage.getItem('firstName');
        const cuLastName = await AsyncStorage.getItem('lastName');
        let activeOrg = await AsyncStorage.getItem('activeOrg');
        if (!activeOrg) {
          activeOrg = 'guidedcompass'
        }
        const orgFocus = await AsyncStorage.getItem('orgFocus');
        const roleName = await AsyncStorage.getItem('roleName');
        let pictureURL = await AsyncStorage.getItem('pictureURL');

        this.setState({ emailId, cuFirstName, cuLastName, activeOrg, orgFocus, roleName, username, pictureURL,
          sharePosting, originalPost, posts, groupId, groupName, jobTitle
        })

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    render() {

      return (
          <ScrollView>
            <View><Text>In Switch Orgs</Text></View>
          </ScrollView>

      )
    }
}

export default SwitchOrgs
