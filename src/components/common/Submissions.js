import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

class Submissions extends Component {
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
      console.log('componentDidUpdate called in commonSubmissions', this.props.activeOrg, prevProps)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
        console.log('t0 will update')
        this.retrieveData()
      } else if (this.props.selectedGroup !== prevProps.selectedGroup) {
        this.retrieveData()
      }
    }

    retrieveData() {
      console.log('retrieveData called in commonEditGroup', this.props.selectedGroup)


    }

    render() {

      return (
          <ScrollView>
            <View>In Submissions</View>
          </ScrollView>

      )
    }
}

export default Submissions
