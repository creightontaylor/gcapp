import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage, Image, ScrollView } from 'react-native';
import Axios from 'axios';

import {convertDateToString} from './functions/convertDateToString';
const styles = require('./css/style');

const addIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon-blue.png';
const courseIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/course-icon-dark.png';
const deleteIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/delete-icon-dark.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';
const timeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-blue.png';
const difficultyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/difficulty-icon-blue.png';
const profileIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-blue.png';
const ratingsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/ratings-icon-blue.png';
const courseIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/course-icon-blue.png';

class MyCourses extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount favorites')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email);

        let cuFirstName = await AsyncStorage.getItem('firstName')
        let cuLastName = await AsyncStorage.getItem('lastName')
        let username = await AsyncStorage.getItem('username')
        let activeOrg = await AsyncStorage.getItem('activeOrg')
        let orgFocus = await AsyncStorage.getItem('orgFocus')

        // let { editExisting, log, logs, passedLogType, selectedAdvisor } = this.props.location.state;
        this.setState({ emailId: email, cuFirstName, cuLastName, username, activeOrg, orgFocus });

        Axios.get('https://www.guidedcompass.com/api/courses/enrollments', { params: { emailId: email } })
       .then((response) => {
         console.log('Enrollments query attempted', response.data);

         if (response.data.success) {
           console.log('successfully retrieved enrollments')

           const enrollments = response.data.enrollments
           this.setState({ enrollments })

         } else {
           console.log('no enrollments data found', response.data.message)
         }

       }).catch((error) => {
           console.log('Enrollments query did not work', error);
       });

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  deleteItem(item, index) {
    console.log('deleteItem called', item, index)

    const _id = item._id

    Axios.delete('https://www.guidedcompass.com/api/enrollments/' + _id)
    .then((response) => {
      console.log('tried to delete enrollment', response.data)
      if (response.data.success) {
        //save values
        console.log('Enrollment delete worked');

        let enrollments = this.state.enrollments
        enrollments.splice(index,1)
        this.setState({ enrollments, successMessage: response.data.message })

      } else {
        console.error('there was an error deleting the posting');
        this.setState({ errorMessage: response.data.message })
      }
    }).catch((error) => {
        console.log('The deleting did not work', error);
        this.setState({ errorMessage: error.toString() })
    });
  }

  render() {
    return (
      <ScrollView>
        <View style={[styles.card]}>

          <Text style={[styles.descriptionText2,styles.centerText]}>Training programs and courses that you're enrolled in or have completed.</Text>

          <View style={[styles.spacer]} /><View style={[styles.spacer]} />

          {(this.state.errorMessage && this.state.errorMessage !== '') ? <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text> : <View />}
          {(this.state.successMessage && this.state.successMessage !== '') ? <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text> : <View />}

          {(this.state.enrollments) && (
            <View>
              {this.state.enrollments.map((value, optionIndex) =>
                <View key={optionIndex} style={[styles.topMargin,styles.bottomMargin]}>
                  <View style={[styles.rowDirection]}>
                    <TouchableOpacity style={[styles.calcColumn120]} onPress={() => this.props.navigation.navigate('CourseDetails', {selectedCourse: value })}>
                      <View style={[styles.width70]}>
                        <Image source={(value.courseImageURL) ? { uri: value.courseImageURL} : { uri: courseIconDark}} style={[styles.square60,styles.contain]}/>

                        {(value.createdAt) ? (
                          <View style={[styles.topMargin,styles.horizontalPadding]}>
                            <Text style={[styles.descriptionText3,styles.centerText]}>{convertDateToString(value.createdAt,'daysAgo')}</Text>
                          </View>
                        ) : (
                          <View />
                        )}

                      </View>
                      <View style={[styles.calcColumn190]}>
                        <Text style={[styles.headingText5]}>{value.courseName}</Text>
                        {(value.courseSchoolName) && (
                          <Text style={[styles.descriptionText3,styles.centerText,styles.topMargin5,styles.bottomMargin]}>by {value.courseSchoolName}</Text>
                        )}

                        {(value.courseDescription) && (
                          <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topMargin15]}>{value.courseDescription}</Text>
                        )}

                        <View style={[styles.topMargin15,styles.rowDirection,styles.flexWrap]}>
                          {(value.courseCategory) && (
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.rightMargin]}>
                                <Image source={{ uri: courseIconBlue }} style={[styles.square15,styles.contain]}/>
                              </View>
                              <View style={[styles.rightMargin]}>
                                <Text style={[styles.descriptionText3]}>{value.courseCategory}</Text>
                              </View>
                            </View>
                          )}

                          {(value.courseEstimatedHours) && (
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.rightMargin]}>
                                <Image source={{ uri: timeIconBlue }} style={[styles.square15,styles.contain]}/>
                              </View>
                              <View style={[styles.rightMargin]}>
                                <Text style={[styles.descriptionText3]}>{value.courseEstimatedHours} Hours</Text>
                              </View>
                            </View>
                          )}

                          {(value.courseDegreeType) && (
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.rightMargin]}>
                                <Image source={{ uri: ratingsIconBlue }} style={[styles.square15,styles.contain]}/>
                              </View>
                              <View style={[styles.rightMargin]}>
                                <Text style={[styles.descriptionText3]}>{value.courseDegreeType}</Text>
                              </View>
                            </View>
                          )}

                          {(value.courseProgramMethod) && (
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.rightMargin]}>
                                <Image source={{ uri: profileIconBlue }} style={[styles.square15,styles.contain]}/>
                              </View>
                              <View style={[styles.rightMargin]}>
                                <Text style={[styles.descriptionText3]}>{value.courseProgramMethod}</Text>
                              </View>
                            </View>
                          )}

                          {(value.courseDifficultyLevel) && (
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.rightMargin]}>
                                <Image source={{ uri: difficultyIconBlue }} style={[styles.square15,styles.contain]}/>
                              </View>
                              <View style={[styles.rightMargin]}>
                                <Text style={[styles.descriptionText3]}>{value.courseDifficultyLevel}</Text>
                              </View>
                            </View>
                          )}
                        </View>

                        {(value.isCompleted) && (
                          <View style={[styles.rowDirection,styles.topMargin15]}>
                            <View style={[styles.rightPadding]}>
                              <Image source={{ uri: checkmarkIcon }} style={[styles.square18,styles.contain]} />
                            </View>
                            <View>
                              <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.bottomMargin15]}>{(value.courseCategory) && value.courseCategory + " "}Completed</Text>
                            </View>
                          </View>
                        )}

                        <View style={[styles.halfSpacer]} />
                      </View>
                    </TouchableOpacity>

                    <View style={[styles.width30]}>
                      <TouchableOpacity disabled={this.state.isSaving} onPress={() => this.deleteItem(value,optionIndex) }>
                        <Image source={{ uri: deleteIconDark }} style={[styles.square20,styles.contain,styles.rightText]} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.width30]}>
                      <TouchableOpacity to={{ pathname: '/app/courses/' + value.courseId, state: { selectedCourse: value }}} className="background-button full-width">
                        <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.rightText]}/>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={[styles.row20]}>
                    <View style={[styles.horizontalLine]} />
                  </View>

                </View>
              )}
            </View>
          )}

        </View>
      </ScrollView>
    )
  }
}

export default MyCourses;
