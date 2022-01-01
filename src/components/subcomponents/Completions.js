import React, { Component } from 'react';
import { ScrollView, View, Text, Image, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';
const styles = require('../css/style');

const checkmarkDarkGreyIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-dark-grey.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const checkboxChecked = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkbox-checked.png';

import {convertDateToString} from '../functions/convertDateToString';

class Completions extends Component {
  constructor(props) {
    super(props)
    this.state = {
      completions: [],
      subNavCategories: [],
      subNavSelected: 'All',

      sessionErrorMessage: '',
      serverPostSuccess: false,
      serverErrorMessage: '',
      serverSuccessMessage: ''
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.subNavClicked = this.subNavClicked.bind(this)
    this.renderCompletions = this.renderCompletions.bind(this)
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
        // console.log('what is the email of this user', email);

        let cuFirstName = await AsyncStorage.getItem('firstName');
        let cuLastName = await AsyncStorage.getItem('lastName');
        let username = await AsyncStorage.getItem('username');
        let activeOrg = await AsyncStorage.getItem('activeOrg');
        let orgFocus = await AsyncStorage.getItem('orgFocus');

        let subNavCategories = ['All','RSVPs','Project Submissions','Applications','Offers','Internships / Work','Courses']
        if (this.props.pageSource === 'courses') {
          subNavCategories = ['All', 'Courses']
        }

        this.setState({ emailId: email, cuFirstName, cuLastName, username, activeOrg, orgFocus, subNavCategories });

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
        .then((response) => {
          console.log('Org info query attempted', response.data);

            if (response.data.success) {
              console.log('org info query worked')

              const orgName = response.data.orgInfo.orgName
              this.setState({ orgName });

            } else {
              console.log('org info query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
        });

        // submissions, rsvps, work
        const orgCode = activeOrg
        Axios.get('https://www.guidedcompass.com/api/users/rsvps', { params: { emailId: email, orgCode } })
        .then((response) => {

            if (response.data.success) {
              console.log('Rsvps query worked', response.data);

              let rsvps = response.data.rsvps
              let completions = this.state.completions

              for (let i = 1; i <= rsvps.length; i++) {
                rsvps[i - 1]["completionType"] = "RSVP"
              }

              completions = completions.concat(rsvps)
              let filteredCompletions = completions

              this.setState({ rsvps, completions, filteredCompletions })

            } else {
              console.log('no rsvp data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Passion query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/users/submissions', { params: { emailId: email, orgCode } })
        .then((response) => {

            if (response.data.success) {
              console.log('Submissions query worked', response.data);

              let postings = response.data.postings
              let completions = this.state.completions

              for (let i = 1; i <= postings.length; i++) {
                postings[i - 1]["completionType"] = "Submission"
              }

              completions = completions.concat(postings)
              let filteredCompletions = completions

              this.setState({ postings, completions, filteredCompletions })

            } else {
              console.log('no posting data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Submissions query did not work', error);
        });


        Axios.get('https://www.guidedcompass.com/api/applications', { params: { emailId: email, orgCode } })
        .then((response) => {
            if (response.data.success) {
              console.log('Applications submitted query worked', response.data);

              let applications = response.data.applications
              let completions = this.state.completions

              for (let i = 1; i <= applications.length; i++) {
                applications[i - 1]["completionType"] = "Application"
              }

              completions = completions.concat(applications)
              let filteredCompletions = completions

              this.setState({ applications, completions, filteredCompletions })

            } else {
              console.log('no application data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Application query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/offers/byuser', { params: { emailId: email, orgCode } })
        .then((response) => {

            if (response.data.success) {
              console.log('Offers received query worked', response.data);

              let offers = response.data.offers
              let completions = this.state.completions

              for (let i = 1; i <= offers.length; i++) {
                offers[i - 1]["completionType"] = "Offer"
              }

              completions = completions.concat(offers)
              let filteredCompletions = completions

              this.setState({ offers, completions, filteredCompletions })

            } else {
              console.log('no offer data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Passion query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/work', { params: { workerEmail: email, orgCode } })
        .then((response) => {

            if (response.data.success) {
              console.log('Work received query worked', response.data);

              let workArray = response.data.workArray
              let completions = this.state.completions

              for (let i = 1; i <= workArray.length; i++) {
                workArray[i - 1]["completionType"] = "Work"
              }

              completions = completions.concat(workArray)
              let filteredCompletions = completions

              this.setState({ workArray, completions, filteredCompletions })

            } else {
              console.log('no offer data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Passion query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/completions', { params: { emailId: email } })
       .then((response) => {
         console.log('Completions query attempted', response.data);

         if (response.data.success) {
           console.log('successfully retrieved completions')

           let completions = response.data.completions

           if (completions && completions.length > 0) {
             Axios.get('https://www.guidedcompass.com/api/completions/detail', { params: { completions, orgCode } })
             .then((response2) => {
               console.log('Completions detail query attempted', response2.data);

               if (response2.data.success) {
                 console.log('successfully retrieved completions detail', response2.data.completions)

                 let newCompletions = []
                 for (let i = 1; i <= response2.data.completions.length; i++) {
                   let newCompletion = response2.data.completions[i - 1]
                   newCompletion["completionType"] = "Course"
                   newCompletions.push(newCompletion)
                 }

                 newCompletions = this.state.completions.concat(newCompletions)
                 const filteredCompletions = newCompletions

                 this.setState({ completions: newCompletions, filteredCompletions })

               } else {
                 console.log('no completions detail data found', response2.data.message)
               }

             }).catch((error) => {
                 console.log('Completions detail query did not work', error);
             });
           }

         } else {
           console.log('no completions data found', response.data.message)
         }

       }).catch((error) => {
           console.log('Favorites query did not work', error);
       });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  renderCompletions() {
    console.log('renderCompletions called', this.props.pageSource)

    let rows = [];
    if ( this.state.completions.length !== 0 ) {

      for (let i = 1; i <= this.state.completions.length; i++) {
        console.log(i);

        const index = i - 1
        // console.log('show pageSource: ', this.props.pageSource)
        if (this.props.pageSource === 'courses' && this.state.completions[i - 1].completionType === 'Course') {
          console.log('up in courses')

          const value = this.state.completions[index]

          rows.push(
            <View key={index}>
              <View style={[styles.spacer]} />

              <View style={[styles.rowDirection]}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + value.url)} style={[styles.calcColumn125]}>
                  <View style={[styles.width70]}>
                    <Image source={{ uri: value.image_125_H}} style={[styles.square60,styles.contain]}/>
                  </View>
                  <View style={[styles.calcColumn195]}>
                    <Text style={[styles.headingText5]}>{value.title}</Text>
                    <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>{value.headline}</Text>
                    <View style={[styles.halfSpacer]} />
                  </View>
                </TouchableOpacity>

                <View style={[styles.width40,styles.topMargin,styles.centerText]} >
                  <View>
                    <TouchableOpacity style={[styles.padding5,styles.centerItem]} onPress={() => this.markCompleted(value, 'course')}>
                      <Image source={(this.state.completions.includes(value._id)) ? { uri: checkboxChecked} : { uri: checkmarkDarkGreyIcon}} style={[styles.square15,styles.contain]}/>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.width25,styles.leftPadding5]} >
                  <View>
                    <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                    <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + value.url)}>
                      <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
              <View style={[styles.horizontalLine]} />

              <View style={[styles.spacer]} />
            </View>
          )
        } else if (this.props.pageSource !== 'courses') {
          //starting assuming an application

          let title = this.state.completions[i - 1].postingTitle
          let subtitle = this.state.completions[i - 1].completionType + " | " + this.state.completions[i - 1].postingEmployerName + " | " + convertDateToString(this.state.completions[i - 1].createdAt,"datetime")
          let completionLink = 'OpportunityDetails'
          let passedState = null
          let disabledLink = false

          if (this.state.completions[i - 1].completionType === 'Offer') {
            title = this.state.completions[i - 1].title
            subtitle = this.state.completions[i - 1].completionType + " | " + this.state.completions[i - 1].employerName + " | " + convertDateToString(this.state.completions[i - 1].createdAt,"datetime")
            completionLink = 'EditLog'
            passedState = { objectId: this.state.completions[i - 1]._id }
            disabledLink = false
          } else if (this.state.completions[i - 1].completionType === 'RSVP') {
            title = this.state.completions[i - 1].postingTitle
            subtitle = this.state.completions[i - 1].completionType + " | " + convertDateToString(this.state.completions[i - 1].createdAt,"datetime")
            completionLink = 'OpportunityDetails'
            passedState = null
            disabledLink = false
          } else if (this.state.completions[i - 1].completionType === 'Submission') {
            title = ''
            // suboptimal
            for (let j = 1; j <= this.state.completions[i - 1].submissions.length; j++) {
              if (this.state.completions[i - 1].submissions[j - 1].userEmail === this.state.emailId) {
                title = this.state.completions[i - 1].submissions[j - 1].name
              }
            }
            subtitle = this.state.completions[i - 1].completionType + " | Submitted to: " + this.state.completions[i - 1].name + ' on ' + convertDateToString(this.state.completions[i - 1].createdAt,"datetime")
            completionLink = 'OpportunityDetails'
            passedState = null
            disabledLink = false
          } else if (this.state.completions[i - 1].completionType === 'Work') {
            title = this.state.completions[i - 1].title + ' @ ' + this.state.completions[i - 1].employerName
            subtitle = this.state.completions[i - 1].completionType + " | " + convertDateToString(this.state.completions[i - 1].createdAt,"datetime")
            completionLink = 'OpportunityDetails'
            passedState = null
            disabledLink = true
          }

          let showCompletion = false
          if (this.state.subNavSelected === 'All') {
            showCompletion = true
          } else if (this.state.subNavSelected === 'RSVPs' && this.state.completions[i - 1].completionType === 'RSVP') {
            showCompletion = true
          } else if (this.state.subNavSelected === 'Project Submissions' && this.state.completions[i - 1].completionType === 'Submission') {
            showCompletion = true
          } else if (this.state.subNavSelected === 'Applications' && this.state.completions[i - 1].completionType === 'Application') {
            showCompletion = true
          } else if (this.state.subNavSelected === 'Offers' && this.state.completions[i - 1].completionType === 'Offer') {
            showCompletion = true
          } else if (this.state.subNavSelected === 'Internships / Work' && this.state.completions[i - 1].completionType === 'Work') {
            showCompletion = true
          } else if (this.state.subNavSelected === 'Course' && this.state.completions[i - 1].completionType === 'Course') {
            showCompletion = true
          }

          if (showCompletion) {
            console.log('show completion: ')
            if (this.state.completions[i - 1].completionType === 'Course') {
              rows.push(
                <View key={index}>
                  <View style={[styles.spacer]} />

                  <View style={[styles.rowDirection]}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + this.state.completions[i - 1].url)} style={[styles.calcColumn125]}>
                      <View style={[styles.width70]}>
                        <Image source={{ uri: this.state.completions[i - 1].image_125_H}} style={[styles.square60,styles.contain]}/>
                      </View>
                      <View style={[styles.calcColumn195]}>
                        <Text style={[styles.headingText5]}>{this.state.completions[i - 1].title}</Text>
                        <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>{this.state.completions[i - 1].headline}</Text>
                        <View style={[styles.halfSpacer]} />
                      </View>
                    </TouchableOpacity>

                    {(this.props.pageSource !== 'landingPage') && (
                      <View style={[styles.width40,styles.topMargin,styles.centerText]} >
                        <View>
                          <TouchableOpacity style={[styles.padding5,styles.centerItem]} onPress={() => this.markCompleted(this.state.completions[i - 1], 'course')}>
                            <Image source={(this.state.completions.includes(this.state.completions[i - 1]._id)) ? { uri: checkboxChecked} : { uri: checkmarkDarkGreyIcon}} style={[styles.square15,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}

                    <View style={[styles.width25,styles.leftPadding5]} >
                      <View>
                        <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + this.state.completions[i - 1].url)}>
                          <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                  <View style={[styles.horizontalLine]} />

                  <View style={[styles.spacer]} />
                </View>
              )
            } else {
              rows.push(
                <View key={this.state.completions[i - 1]._id} style={[styles.row10]}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate(completionLink, passedState)} style={[styles.calcColumn60,styles.rowDirection]}>
                    <View style={[styles.calcColumn80]}>
                      <View>
                        <Text style={[styles.headingText6]}>{title}</Text>
                      </View>

                      <Text style={[styles.descriptionText2]}>{subtitle}</Text>
                    </View>
                    <View style={[styles.width20]}>
                      <Image source={{ uri: arrowIndicatorIcon}} style={[styles.width18,styles.contain]}/>
                    </View>
                  </TouchableOpacity>

                </View>
              )
            }
          }
        }
      }
    } else {

      rows.push(
        <View key={1} style={[styles.flexCenter,styles.centerText,styles.padding30]}>
          <View style={[styles.horizontalPadding30]} >
            <Image source={{ uri: checkmarkDarkGreyIcon}} style={[styles.square120,styles.contain,styles.centerHorizontally]}/>
            <Text style={[styles.headingText3]}>No Completed Items Yet</Text>
            <Text style={[styles.topMargin20,styles.centerText]}>This are contains all things you have completed, including RSVPs to events, submissions to projects, applications for work, offers, work experience, and other things you can accomplish through the platform.</Text>
          </View>
        </View>
      )
    }

    return rows;
  }

  subNavClicked(pageName) {
    console.log('subNavClicked called', pageName)

    this.setState({ subNavSelected: pageName })
  }

  render() {

      return (
          <ScrollView>
            <View style={[styles.card]}>
              <View style={[styles.row20]}>
                <Text style={[styles.headingText2]}>Completions</Text>
              </View>

              {(this.state.completions && this.state.completions.length > 0) && (
                <View>
                  <ScrollView style={[styles.carousel,styles.lightBackground]} horizontal={true}>
                    {this.state.subNavCategories.map((value, index) =>
                      <View style={[styles.row10,styles.rightPadding20]}>
                        {(this.state.subNavCategories[index] === this.state.subNavSelected) ? (
                          <View style={[styles.selectedCarouselItem]}>
                            <Text key={value} style={[styles.headingText6]}>{value}</Text>
                          </View>
                        ) : (
                          <TouchableOpacity style={[styles.menuButton]} onPress={() => this.subNavClicked(value)}>
                            <Text key={value} style={[styles.headingText6]}>{value}</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </ScrollView>
                </View>
              )}

              <View style={[styles.spacer]}/>
              {this.renderCompletions()}
            </View>
          </ScrollView>

      )
  }
}

export default Completions;
