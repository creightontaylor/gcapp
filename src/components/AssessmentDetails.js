import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubAssessmentDetails from './subcomponents/AssessmentDetails';

class AssessmentDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount assessments')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user');

        // {"navigation": {"addListener": [Function addListener], "canGoBack": [Function canGoBack], "dispatch": [Function dispatch], "getParent": [Function getParent], "getState": [Function anonymous], "goBack": [Function anonymous], "isFocused": [Function isFocused], "navigate": [Function anonymous], "pop": [Function anonymous], "popToTop": [Function anonymous], "push": [Function anonymous], "removeListener": [Function removeListener], "replace": [Function anonymous], "reset": [Function anonymous], "setOptions": [Function setOptions], "setParams": [Function anonymous]}, "route": {"key": "AssessmentDetails-MyZdRYpmwocCBH7Y9OYfU", "name": "AssessmentDetails", "params": {"assessment": [Object], "assessments": [Array], "index": 1, "resultsData": [Array]}, "path": undefined}}

        const assessments = this.props.route.params.assessments
        const index = this.props.route.params.index
        const assessment = this.props.route.params.assessment
        const resultsData = this.props.route.params.resultsData

        console.log('show assessment name ', assessments, index, assessment, resultsData)

        if (assessment) {

          if (resultsData && resultsData[index] && resultsData[index].length !== undefined && resultsData[index].length === 0) {
            resultsData[index] = null
          }

          this.setState({ resultsData, assessments, index, assessment })

        } else {
          console.log('user navigated directly to this screen')
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
        <SubAssessmentDetails navigation={this.props.navigation} assessments={this.state.assessments} index={this.state.index} assessment={this.state.assessment} resultsData={this.state.resultsData}/>
      </View>
    )
  }
}

export default AssessmentDetails;
