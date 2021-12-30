import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubTakeAssessment from './subcomponents/TakeAssessment';

class TakeAssessment extends Component {
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
    console.log('retrieveData  called in take assessment')
    try {
      const email = await AsyncStorage.getItem('email')

      if (email !== null) {
        // We have data!!
        console.log('params in takeAssessment parent', this.props.route.params);

        const assessments = this.props.route.params.assessments
        const index = this.props.route.params.index
        const assessment = this.props.route.params.assessment
        const resultsData = this.props.route.params.resultsData

        let type = ''
        let assessmentTitle = assessment.title
        if (assessmentTitle) {
          assessmentTitle = assessmentTitle.replace(/ /g,"-").toLowerCase()
        }
        let assessmentDescription = ''

        if (assessmentTitle === 'work-preferences') {
          type = 'work preferences'
          assessmentTitle = 'Work Preferences'
          assessmentDescription = 'Self-assesses your fit to current and similar work'
        } else if (assessmentTitle === 'interest-assessment') {
          type = 'interests'
          assessmentTitle = 'Interest Assessment'
          assessmentDescription = 'Assesses what category of work you may be most interested in'
        } else if (assessmentTitle === 'skill-self-assessment') {
          type = 'skills'
          assessmentTitle = 'Skill Self-Assessment'
          assessmentDescription = 'Self-assessment of hard and soft skills associated with different career paths'
        } else if (assessmentTitle === 'personality-assessment') {
          type = 'personality'
          assessmentTitle = 'Personality Assessment'
          assessmentDescription = 'Assesses your personality type along axis relevant to different career paths'
        } else if (assessmentTitle === 'values-assessment') {
          type = 'values'
          assessmentTitle = 'Values Assessment'
          assessmentDescription = 'Assesses your values and the values of your ideal employer'
        } else {

        }

        console.log('show type: ------------------------ ', type, assessmentTitle)

        this.setState({ emailId: email, assessmentTitle,
          assessmentDescription, type, assessments, index, assessment, resultsData })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  render() {
    return (
      <View>
        <SubTakeAssessment navigation={this.props.navigation} type={this.state.type} assessmentTitle={this.state.assessmentTitle} assessments={this.state.assessments} index={this.state.index} assessment={this.state.assessment} resultsData={this.state.resultsData} assessmentDescription={this.state.assessmentDescription}/>
      </View>
    )
  }
}

export default TakeAssessment;
