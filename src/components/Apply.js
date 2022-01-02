import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubApply from './subcomponents/Apply';

class Apply extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.passActiveOrg = this.passActiveOrg.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount Apply')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      console.log('show me values in Apply', email, this.props);

      if (email !== null) {
        // We have data!!

        let cuFirstName = AsyncStorage.getItem('firstName');
        let cuLastName = AsyncStorage.getItem('lastName');
        let username = AsyncStorage.getItem('username');
        let activeOrg = AsyncStorage.getItem('activeOrg');
        let orgFocus = AsyncStorage.getItem('orgFocus');

        let selectedPosting = null
        let passedTasks = null
        let customAssessmentResponses = null
        let caQuestions = null
        let application = null

        if (this.props) {

          selectedPosting = this.props.route.params.selectedPosting
          passedTasks = this.props.route.params.passedTasks
          customAssessmentResponses = this.props.route.params.customAssessmentResponses
          caQuestions = this.props.route.params.caQuestions
          application = this.props.route.params.application

        }

        let newCustomAssessmentResponses = null
        if (application) {
          if (application.customAssessmentResults && !customAssessmentResponses) {
            console.log('pass application customAssessmentResponses')
            customAssessmentResponses = application.customAssessmentResults
          } else if (application.newCustomAssessmentResults && !customAssessmentResponses) {
            newCustomAssessmentResponses = application.newCustomAssessmentResults
          }
        }

        this.setState({ activeOrg, emailId: email, cuFirstName, cuLastName, username, orgFocus, selectedPosting, passedTasks,
          customAssessmentResponses, newCustomAssessmentResponses, caQuestions, application })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  passActiveOrg(activeOrg) {
    console.log('passActiveOrg called', activeOrg)

    this.setState({ activeOrg })
  }

  render() {
    return (
      <View>
        <SubApply navigation={this.props.navigation} category={this.state.category}
          selectedPosting={this.state.selectedPosting} activeOrg={this.state.activeOrg}  passActiveOrg={this.passActiveOrg}
          passedTasks={this.state.passedTasks}
          customAssessmentResponses={this.state.customAssessmentResponses} caQuestions={this.state.caQuestions}
          application={this.state.application}
        />
      </View>
    )
  }
}

export default Apply;
