import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubCourseDetails from './subcomponents/CourseDetails';

class CourseDetails extends Component {
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

      console.log('show me values in parentCourseDetails');

      if (email !== null) {
        // We have data!!

        let courseId = null
        if (this.props.route && this.props.route.params) {
          // console.log('show params: ', this.props.route)
          if (this.props.route.params.selectedCourse) {
            courseId = this.props.route.params.selectedCourse.id
          }

          console.log('show params: ', this.props.route.params)
        }

        this.setState({ courseId })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within CourseDetails ')

    if (this.props.route.params && this.props.route.params.selectedCourse !== prevProps.route.params.selectedCourse) {
      console.log('new benchmark selected in parent')
      this.setState({ courseId: this.props.route.params.selectedCourse.id })
    }
  }

  render() {
    return (
      <View>
        <SubCourseDetails navigation={this.props.navigation} courseId={this.state.courseId} />
      </View>
    )
  }
}

export default CourseDetails;
