import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, Linking, TextInput,Keyboard,KeyboardAvoidingView,TouchableWithoutFeedback } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const industryIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/industry-icon-grey.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';
const addIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon-white.png';
const timeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-blue.png';
const fullStar = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/full-star.png';
const emptyStar = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/empty-star.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';

import SubPicker from '../common/SubPicker';

import {convertDateToString} from '../functions/convertDateToString';
import {convertStringToDate} from '../functions/convertStringToDate';
import {requestAccessToWorkspace} from '../services/ProfileRoutes';

class OrgDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      inModal: false
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.submitRequest = this.submitRequest.bind(this)
    this.submitReview = this.submitReview.bind(this)
    this.renderSignUpField = this.renderSignUpField.bind(this)
    this.submitSignUpFields = this.submitSignUpFields.bind(this)
    this.optionClicked = this.optionClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in orgDetails ')

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData()
    } else if (this.props.orgId !== prevProps.orgId) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      console.log('this is causing the error')
      const emailId = await AsyncStorage.getItem('email')
      const email = emailId
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

      if (emailId !== null) {
        // We have data!!
        let accountCode = this.props.accountCode

        this.setState({ emailId: email, cuFirstName, cuLastName, username, accountCode, isAnimating: true })

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: this.props.orgId } })
        .then((response) => {
          console.log('Org info query attempted in SubOrgDetails');

            if (response.data.success) {
              console.log('org info query worked')

              let orgSelected = response.data.orgInfo
              let cta = 'Request Access'
              if (orgSelected.waitlist) {
                cta = 'Join Waitlist'
              } else if (orgSelected.isOpen) {
                cta = 'Join Workspace'
              }
              orgSelected['cta'] = cta
              this.setState({ orgSelected });

              let ratingSelected = null
              let reviewSelected = null
              if (orgSelected.careerSeekerReviews && orgSelected.careerSeekerReviews.length > 0) {
                for (let i = 1; i <= orgSelected.careerSeekerReviews.length; i++) {
                  if (orgSelected.careerSeekerReviews[i - 1].email === this.state.emailId) {
                    ratingSelected = orgSelected.careerSeekerReviews[i - 1].rating
                    reviewSelected = orgSelected.careerSeekerReviews[i - 1].review
                  }
                }
              }

              this.setState({ ratingSelected, reviewSelected })

              Axios.get('https://www.guidedcompass.com/api/org/members/count', { params: { orgCode: orgSelected.orgCode }})
              .then((response) => {
                 console.log('Org member count query attempted');

                 if (response.data.success) {
                   console.log('successfully retrieved org member count')

                   let stats = orgSelected['stats']
                   if (stats) {
                     stats['memberCount'] = response.data.memberCount
                   } else {
                     stats = { memberCount: response.data.memberCount }
                   }

                   orgSelected['stats'] = stats
                   this.setState({ orgSelected })

                 } else {
                   console.log('no org member count found', response.data.message)
                 }

              }).catch((error) => {
                   console.log('Org member account query did not work', error);
              });

            } else {
              console.log('org info query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
        });

        if (accountCode) {
          Axios.get('https://www.guidedcompass.com/api/account', { params: { accountCode } })
          .then((response) => {
            console.log('Account info query attempted in employer dashboard');

            if (response.data.success) {
              console.log('account info query worked in sub settings')

              const employerName = response.data.accountInfo.employerName
              const employerLogo = response.data.accountInfo.employerLogoURI
              const sharePartners = response.data.accountInfo.sharePartners

              this.setState({ employerName, employerLogo, sharePartners });

            }

          }).catch((error) => {
            console.log('Account info query did not work for some reason', error);
          });
        }

        const fetchDetailsURL = 'https://www.guidedcompass.com/api/users/profile/details/' + email
        Axios.get(fetchDetailsURL)
        .then((response) => {
          if (response.data) {

            let myOrgs = response.data.user.myOrgs
            const joinRequests = response.data.user.joinRequests

            const dateOfBirth = response.data.user.dateOfBirth
            const gender = response.data.user.gender
            const race = response.data.user.race
            const address = response.data.user.address
            const phoneNumber = response.data.user.phoneNumber
            const numberOfMembers = response.data.user.numberOfMembers
            const householdIncome = response.data.user.householdIncome
            const fosterYouth = response.data.user.fosterYouth
            const homeless = response.data.user.homeless
            const incarcerated = response.data.user.incarcerated
            const adversityList = response.data.user.adversityList

            const pictureURL = response.data.user.pictureURL
            const education = response.data.user.education

            this.setState({ myOrgs, joinRequests, dateOfBirth, gender, race, address, phoneNumber, numberOfMembers,
              householdIncome, fosterYouth, homeless, incarcerated, adversityList, pictureURL, education
            })

          }
        }).catch((error) => {
            console.log('Profile pic fetch did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler(eventName,eventValue,dateEvent) {
    console.log('formChangeHandler called')

    // if (eventValue && !dateEvent) {
    //   this.setState({ selectedValue: eventValue })
    // }

    if (dateEvent && Platform.OS === 'android') {
      console.log('in dateEvent', dateEvent)
      //{"nativeEvent": {}, "type": "dismissed"}
      // {"nativeEvent": {"timestamp": 2022-01-15T23:17:05.451Z}, "type": "set"}
      if (eventValue) {
        eventValue = convertDateToString(new Date(eventValue),'hyphenatedDate')
        console.log('is this working? ', eventValue)
        this.setState({ [eventName]: eventValue,  selectedValue: eventValue, textFormHasChanged: true, showDateTimePicker: false, modalIsOpen: false })
      } else {
        this.setState({ showDateTimePicker: false, modalIsOpen: false })
      }
    } else if (this.state.showDateTimePicker) {
      this.setState({ [eventName]: convertDateToString(new Date(eventValue),'hyphenatedDate') })
    } else {
      this.setState({ [eventName]: eventValue, selectedValue: eventValue })
    }
  }

  submitSignUpFields() {
    console.log('submitSignUpFields called')

    if (!this.state.dateOfBirth || this.state.dateOfBirth === '') {
      this.setState({ errorMessage: 'Please add your date of birth' })
    } else if (!this.state.gender || this.state.gender === '') {
      this.setState({ errorMessage: 'Please add your gender' })
    } else if (!this.state.race || this.state.race === '') {
      this.setState({ errorMessage: 'Please add your race' })
    } else if (!this.state.address || this.state.address === '') {
      this.setState({ errorMessage: 'Please add your address' })
    } else if (!this.state.phoneNumber || this.state.phoneNumber === '') {
      this.setState({ errorMessage: 'Please add your phone number' })
    } else if (!this.state.numberOfMembers || this.state.numberOfMembers === '') {
      this.setState({ errorMessage: 'Please add the number of members in your household' })
    } else if (!this.state.householdIncome || this.state.householdIncome === '') {
      this.setState({ errorMessage: 'Please add your household income' })
    } else if (!this.state.fosterYouth || this.state.fosterYouth === '') {
      this.setState({ errorMessage: 'Please indicate whether you have been a foster youth' })
    } else if (!this.state.homeless || this.state.homeless === '') {
      this.setState({ errorMessage: 'Please indicate whether you have been homeless' })
    } else if (!this.state.incarcerated || this.state.incarcerated === '') {
      this.setState({ errorMessage: 'Please indicate whether you have been incarcerated' })
    } else if (!this.state.adversityList || this.state.adversityList === '') {
      this.setState({ errorMessage: 'Please add all that applies' })
    } else {

      const dateOfBirth = this.state.dateOfBirth
      const gender = this.state.gender
      const race = this.state.race
      const address = this.state.address
      const phoneNumber = this.state.phoneNumber
      const numberOfMembers = this.state.numberOfMembers
      const householdIncome = this.state.householdIncome
      const fosterYouth = this.state.fosterYouth
      const homeless = this.state.homeless
      const incarcerated = this.state.incarcerated
      const adversityList = this.state.adversityList

      const signUpFields = {
        dateOfBirth, gender, race, address, phoneNumber, numberOfMembers, householdIncome,
        fosterYouth, homeless, incarcerated, adversityList
      }

      this.submitRequest(null, this.state.orgSelected, signUpFields, false)

    }
  }

  async submitRequest(e, value, passedSignUpFields, fromButton) {
    console.log('submitRequest called')

    if (fromButton) {
      e.stopPropagation()
      e.preventDefault()
    }

    if (value.cta === 'Join Workspace') {
      if (value.signUpFields) {
        if (passedSignUpFields) {
          const returnedValue = await requestAccessToWorkspace(this.state.emailId, value.orgCode, value.orgName, value.cta, value.contactFirstName, value.contactLastName, value.contactEmail, passedSignUpFields)
          // console.log('returnedValue: ', returnedValue)
          if (returnedValue) {
            let myOrgs = this.state.myOrgs
            if (returnedValue.success) {
              if (myOrgs) {
                myOrgs.push(value.orgCode)
              } else {
                myOrgs = [value.orgCode]
              }
            }

            AsyncStorage.setItem('activeOrg', value.orgCode)
            AsyncStorage.setItem('myOrgs', JSON.stringify(myOrgs))

            this.setState({ errorMessage: returnedValue.errorMessage, successMessage: returnedValue.successMessage, myOrgs, modalIsOpen: false, showSignUpFields: false })
            this.props.passOrgs(value.orgCode, myOrgs, value.orgFocus, value.orgName, value.webLogoURIColor)

            // orgFocus, orgName, orgLogo

            if (this.props.opportunityId) {
              this.props.navigation.navigate('OpportunityDetails', { objectId: this.props.opportunityId })
            }
          } else {
            this.setState({ errorMessage: 'There was an unknown error' })
          }
        } else {
          this.setState({ modalIsOpen: true, orgSelected: value, showSignUpFields: true, showOrgDetails: false })
        }

      } else {
        const returnedValue = await requestAccessToWorkspace(this.state.emailId, value.orgCode, value.orgName, value.cta, value.contactFirstName, value.contactLastName, value.contactEmail, null)
        console.log('returnedValue: ', returnedValue)
        if (returnedValue) {
          let myOrgs = this.state.myOrgs
          if (returnedValue.success) {
            if (myOrgs) {
              myOrgs.push(value.orgCode)
            } else {
              myOrgs = [value.orgCode]
            }
          }

          AsyncStorage.setItem('activeOrg', value.orgCode)
          AsyncStorage.setItem('myOrgs', JSON.stringify(myOrgs))

          this.setState({ errorMessage: returnedValue.errorMessage, successMessage: returnedValue.successMessage, myOrgs })
          this.props.passOrgs(value.orgCode, myOrgs, value.orgFocus, value.orgName, value.webLogoURIColor)

        } else {
          this.setState({ errorMessage: 'There was an unknown error' })
        }
      }

    } else if (value.cta === 'Request Access' || value.cta === 'Join Waitlist') {
      console.log('request access')

      if (value.signUpFields) {
        if (passedSignUpFields) {
          const returnedValue = await requestAccessToWorkspace(this.state.emailId, value.orgCode, value.orgName, value.cta, value.contactFirstName, value.contactLastName, value.contactEmail, passedSignUpFields)
          // console.log('returnedValue: ', returnedValue)
          if (returnedValue) {
            let joinRequests = this.state.joinRequests
            if (returnedValue.success) {
              if (joinRequests) {
                joinRequests.push(value.orgCode)
              } else {
                joinRequests = [value.orgCode]
              }
            }

            this.setState({ errorMessage: returnedValue.errorMessage, successMessage: returnedValue.successMessage, joinRequests, modalIsOpen: false, showSignUpFields: false })
          } else {
            this.setState({ errorMessage: 'There was an unknown error' })
          }
        } else {
          this.setState({ modalIsOpen: true, orgSelected: value, showSignUpFields: false })
        }

      } else {

        const returnedValue = await requestAccessToWorkspace(this.state.emailId, value.orgCode, value.orgName, value.cta, value.contactFirstName, value.contactLastName, value.contactEmail, null)
        console.log('returnedValue: ', returnedValue)
        if (returnedValue) {
          let joinRequests = this.state.joinRequests
          if (returnedValue.success) {
            if (joinRequests) {
              joinRequests.push(value.orgCode)
            } else {
              joinRequests = [value.orgCode]
            }
          }

          this.setState({ errorMessage: returnedValue.errorMessage, successMessage: returnedValue.successMessage, joinRequests })

        } else {
          this.setState({ errorMessage: 'There was an unknown error' })
        }
      }
    }
  }

  submitReview() {
    console.log('submitReview called')

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    if (!this.state.ratingSelected || this.state.ratingSelected === '') {
      this.setState({ isSaving: false, errorMessage: 'Please select a rating'})
    } else {

      const orgCode = this.state.orgSelected.orgCode
      const orgName = this.state.orgSelected.orgName
      const orgContactEmail = this.state.orgSelected.contactEmail
      let pictureURL = this.state.pictureURL

      const emailId = this.state.emailId
      const cuFirstName = this.state.cuFirstName
      const cuLastName = this.state.cuLastName
      const jobTitle = this.state.jobTitle
      const accountCode = this.state.accountCode
      const employerName = this.state.employerName
      let headline = null

      let fromCareerSeeker = true

      if (this.state.education && this.state.education.length > 0 && this.state.education[0].name) {
        let edName = this.state.education[0].name
        let gradDate = ''
        if (this.state.education[0].endDate && !this.state.education[0].isContinual) {
          gradDate = " '" + this.state.education[0].endDate.split(" ")[1].substring(2,4)
        }
        headline = edName + gradDate
      }

      const rating = this.state.ratingSelected
      const review = this.state.reviewSelected

      Axios.post('https://www.guidedcompass.com/api/org/review', { orgCode, orgName, orgContactEmail, pictureURL, emailId, cuFirstName, cuLastName, jobTitle, accountCode, employerName, headline, fromCareerSeeker, rating, review })
      .then((response) => {
        console.log('Org review query attempted')
        if (response.data.success) {
          //save values
          console.log('Org review save worked: ', response.data);

          this.setState({ isSaving: false, successMessage: 'Successfully submitted the review', showReviewPanel: false })

        } else {
          console.log('org review did not work', response.data.message)
          this.setState({ isSaving: false, errorMessage: response.data.message, ratingSelected: '', reviewSelected: '' })
        }
      }).catch((error) => {
          console.log('Org review did not work for some reason', error);
          this.setState({ isSaving: false, errorMessage: error.toString() })
      });

    }
  }

  renderSignUpField(value, index) {
    console.log('renderSignUpField called')

    return (
      <View key="signUpField">
        <Text style={[styles.standardText,styles.row10]}>{value.name}<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
        {(value.questionType === 'Date') && (
          <View>
            {(Platform.OS === 'ios') ? (
              <DateTimePicker
                testID={value.shorthand}
                value={(this.state[value.shorthand]) ? convertStringToDate(this.state[value.shorthand],'dateOnly') : new Date()}
                mode={'date'}
                is24Hour={true}
                display="default"
                onChange={(e, d) => this.formChangeHandler(value.shorthand,d)}
              />
            ) : (
              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: this.state.shorthand, selectedIndex: null, selectedName: this.state.shorthand, selectedValue: this.state[value.shorthand] })}>
                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                  <View style={[styles.calcColumn115]}>
                    <Text style={[styles.descriptionText1]}>{this.state[value.shorthand]}</Text>
                  </View>
                  <View style={[styles.width20,styles.topMargin5]}>
                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          </View>
        )}
        {(value.questionType === 'Short Answer') && (
          <TextInput
            style={styles.textInput}
            onChangeText={(text) => this.formChangeHandler(value.shorthand, text)}
            value={this.state[value.shorthand]}
            placeholder="Your answer..."
            placeholderTextColor="grey"
          />
        )}
        {(value.questionType === 'Multiple Choice') && (
          <View>
            {(Platform.OS === 'ios') ? (
              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: value.shorthand, selectedIndex: null, selectedName: value.shorthand, selectedValue: this.state[value.shorthand], selectedOptions: [''].concat(value.answerChoices), selectedSubKey: null })}>
                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                  <View style={[styles.calcColumn115]}>
                    <Text style={[styles.descriptionText1]}>{this.state[value.shorthand]}</Text>
                  </View>
                  <View style={[styles.width20,styles.topMargin5]}>
                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                  </View>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={[styles.standardBorder]}>
                <Picker
                  selectedValue={this.state[value.shorthand]}
                  onValueChange={(itemValue, itemIndex) =>
                    this.formChangeHandler(value.shorthand,itemValue)
                  }>
                  {[''].concat(value.answerChoices).map(value => <Picker.Item key={value} label={value} value={value} />)}
                </Picker>
              </View>
            )}
          </View>
        )}
        {(value.questionType === 'Multiple Answer') && (
          <View>
            {value.answerChoices.map((value2, optionIndex) =>
              <View key={value2 + optionIndex}>
                <View style={[styles.topMargin5,styles.rightPadding]}>
                  {(this.state[value.shorthand] && this.state[value.shorthand].includes(value2)) ? (
                    <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder,styles.ctaBackgroundColor]} onPress={() => this.optionClicked(index, optionIndex, value, value2)}>
                      <View>
                        <View>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value2}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder]} onPress={() => this.optionClicked(index, optionIndex, value, value2)}>
                      <View>
                        <View>
                          <Text  style={[styles.descriptionText2]}>{value2}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            )}
          </View>
        )}


      </View>
    )
  }

  optionClicked(index, optionIndex, value, value2) {
    console.log('optionClicked called', index, optionIndex, value, value2)

    let items = this.state[value.shorthand]
    if (items) {
      if (items.includes(value2)) {
        const index = items.indexOf(value2)
        items.splice(index, 1)
      } else {
        items.push(value2)
      }

    } else {
      items = [value2]
    }

    this.setState({ [value.shorthand]: items })

  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showPicker: false, showDateTimePicker: false })
  }

  render() {

      return (
          <ScrollView>
            {(this.state.orgSelected) && (
              <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={(Platform.OS === 'ios') ? 100 : 100}>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                  <View style={[styles.row20]}>
                    <View style={[styles.card]}>
                      <View style={[styles.topPadding,styles.rowDirection]}>
                        <View style={[styles.square30 ]}/>
                        <View style={[styles.calcColumn120,styles.alignCenter]}>
                          <Image source={(this.state.orgSelected.webLogoURIColor) ? { uri: this.state.orgSelected.webLogoURIColor} : { uri: industryIconDark}} style={[styles.square80,styles.contain]} />
                        </View>

                        {(this.state.inModal) ? (
                          <View style={[styles.width30]}>
                            <TouchableOpacity onPress={() => this.closeModal()}>
                              <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={[styles.square30 ]}/>
                        )}
                      </View>
                      <View style={[styles.row10,styles.rowDirection,styles.flexCenter]}>
                        <View>
                          <Text style={[styles.headingText2,styles.centerText]}>{this.state.orgSelected.orgName}</Text>
                          <TouchableOpacity onPress={() => Linking.openURL(this.state.orgSelected.orgURL)}><Text style={[styles.standardText,styles.ctaColor,styles.boldText,styles.centerText]}>{this.state.orgSelected.orgURL}</Text></TouchableOpacity>
                        </View>

                      </View>

                      <View style={[styles.row10,styles.rowDirection]}>
                        {(this.state.orgSelected.cta === 'Join Workspace') ? (
                          <View style={[styles.bottomMargin,styles.flex50,styles.rightPadding]}>
                            <TouchableOpacity style={(this.state.myOrgs && this.state.myOrgs.includes(this.state.orgSelected.orgCode)) ? [styles.btnSquarish,styles.ctaBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.myOrgs && this.state.myOrgs.includes(this.state.orgSelected.orgCode)) ? true : false} onPress={(e) => this.submitRequest(e, this.state.orgSelected, null, true)}>
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.width30,styles.rightPadding,styles.topMargin5,styles.flexCenter]}>
                                  <Image source={(this.state.myOrgs && this.state.myOrgs.includes(this.state.orgSelected.orgCode)) ? { uri: checkmarkIcon} : { uri: addIconWhite}} style={[styles.square12,styles.contain]}/>
                                </View>
                                <View>
                                  <Text style={(this.state.myOrgs && this.state.myOrgs.includes(this.state.orgSelected.orgCode)) ? [styles.descriptionText1,styles.ctaColor] : [styles.descriptionText1,styles.whiteColor]}>{(this.state.myOrgs && this.state.myOrgs.includes(this.state.orgSelected.orgCode)) ? "Joined" : "Join" }</Text>
                                </View>

                              </View>
                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View style={[styles.bottomMargin,styles.flex50,styles.rightPadding]}>
                            <TouchableOpacity style={(this.state.joinRequests && this.state.joinRequests.includes(this.state.orgSelected.orgCode)) ? [styles.btnSquarish,styles.ctaBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.joinRequests && this.state.joinRequests.includes(this.state.orgSelected.orgCode)) ? true : false} onPress={(e) => this.submitRequest(e, this.state.orgSelected, null, true)}>
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.width30,styles.rightPadding,styles.topMargin5,styles.flexCenter]}>
                                  <Image source={(this.state.joinRequests && this.state.joinRequests.includes(this.state.orgSelected.orgCode)) ? { uri: timeIconBlue} : { uri: addIconWhite}} style={[styles.square12,styles.contain]}/>
                                </View>
                                <View>
                                  <Text style={(this.state.joinRequests && this.state.joinRequests.includes(this.state.orgSelected.orgCode)) ? [styles.descriptionText1,styles.ctaColor] : [styles.descriptionText1,styles.whiteColor]}>{(this.state.joinRequests && this.state.joinRequests.includes(this.state.orgSelected.orgCode)) ? "Requested Access" : this.state.orgSelected.cta }</Text>
                                </View>

                              </View>
                            </TouchableOpacity>
                          </View>
                        )}
                        {(!this.props.fromAdvisor) && (
                          <View style={[styles.bottomMargin,styles.flex50,styles.leftPadding]}>
                            <TouchableOpacity style={(this.state.showReviewPanel) ? [styles.btnSquarish,styles.errorBorder,styles.flexCenter] : [styles.btnSquarish,styles.errorBackgroundColor,styles.flexCenter]} onPress={(this.state.showReviewPanel) ? () => this.setState({ showReviewPanel: false }) : () => this.setState({ showReviewPanel: true })}>{(this.state.showReviewPanel) ? <Text style={[styles.descriptionText1,styles.errorColor]}>Close Review</Text> : <Text style={[styles.descriptionText1,styles.whiteColor]}>Give Review</Text>}</TouchableOpacity>
                          </View>
                        )}
                      </View>

                      {(this.state.showReviewPanel) ? (
                        <View>
                          <View style={[styles.errorBorder,styles.padding20,styles.topMargin20]}>
                            <View style={[styles.row10,styles.rowDirection]}>
                              <View style={[styles.width40]}>
                                <TouchableOpacity onPress={() => this.setState({ showReviewPanel: false })}>
                                  <Image source={{ uri: closeIcon}} style={[styles.square12,styles.contain]} />
                                </TouchableOpacity>
                              </View>
                              <View style={[styles.calcColumn140]}>
                                <Text style={[styles.headingText4,styles.centerText]}>Add a Review</Text>
                              </View>
                              <View style={[styles.square40]} />

                            </View>

                            <View style={[styles.row10]}>
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10]}>Your Rating (5 is best) <Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: "Rating", selectedIndex: null, selectedName: "ratingSelected", selectedValue: this.state.ratingSelected, selectedOptions: ['','1','2','3','4','5'], selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn150]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.ratingSelected}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.ratingSelected}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler('ratingSelected',itemValue)
                                      }>
                                      {['','1','2','3','4','5'].map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}

                              </View>

                            </View>

                            <View style={[styles.row10]}>
                              <Text style={[styles.standardText,styles.row10]}>Your Review</Text>
                              <TextInput
                                style={styles.textArea}
                                onChangeText={(text) => this.formChangeHandler("reviewSelected", text)}
                                value={this.state.reviewSelected}
                                placeholder="What do you think of them..."
                                placeholderTextColor="grey"
                                multiline={true}
                                numberOfLines={4}
                              />
                            </View>

                            {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor,styles.descriptionText2,styles.row5]}>{this.state.errorMessage}</Text>}
                            {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor,styles.descriptionText2,styles.row5]}>{this.state.successMessage}</Text>}

                            <View style={[styles.row10]}>
                              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.submitReview()}><Text style={[styles.standardText,styles.whiteColor]}>Submit</Text></TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      ) : (
                        <View>
                          <Text style={[styles.row10]}>{this.state.orgSelected.orgDescription}</Text>

                          {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor,styles.descriptionText2,styles.row5]}>{this.state.errorMessage}</Text>}
                          {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor,styles.descriptionText2,styles.row5]}>{this.state.successMessage}</Text>}

                          <ScrollView style={[styles.row10]} horizontal={true}>
                            <View style={[styles.width150,styles.standardBorder,styles.padding10]}>
                              <View>
                                <View style={[styles.flexCenter]}>
                                  <View>
                                    <View style={[styles.rowDirection,styles.flexCenter]}>
                                      <View><Image source={(this.state.orgSelected.careerSeekerRating && this.state.orgSelected.careerSeekerRating.avgRating >= 0.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                      <View><Image source={(this.state.orgSelected.careerSeekerRating && this.state.orgSelected.careerSeekerRating.avgRating >= 1.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                      <View><Image source={(this.state.orgSelected.careerSeekerRating && this.state.orgSelected.careerSeekerRating.avgRating >= 2.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                      <View><Image source={(this.state.orgSelected.careerSeekerRating && this.state.orgSelected.careerSeekerRating.avgRating >= 3.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                      <View><Image source={(this.state.orgSelected.careerSeekerRating && this.state.orgSelected.careerSeekerRating.avgRating >= 4.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                    </View>

                                    <View>
                                      <Text style={[styles.descriptionText3,styles.centerText]}><Text style={[styles.boldText]}>{(this.state.orgSelected.careerSeekerRating && this.state.orgSelected.careerSeekerRating.ratingCount) ? this.state.orgSelected.careerSeekerRating.ratingCount : 0}</Text> career-seeker ratings</Text>
                                    </View>
                                  </View>
                                </View>
                              </View>
                            </View>
                            <View style={[styles.width150,styles.standardBorder,styles.padding10]}>
                              <View>
                                <View style={[styles.flexCenter]}>
                                  <View>
                                    <Text style={[styles.headingText2,styles.boldText,styles.centerText]}>{(this.state.orgSelected.careerSeekerReviews && this.state.orgSelected.careerSeekerReviews.length > 0) ? this.state.orgSelected.careerSeekerReviews.length : '0'}</Text>
                                    <Text  style={[styles.descriptionText3,styles.centerText]}>career-seeker reviews</Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            <View style={[styles.width150,styles.standardBorder,styles.padding10]}>
                              <View>
                                <View style={[styles.flexCenter]}>
                                  <View>
                                    <Text  style={[styles.headingText2,styles.boldText,styles.centerText]}>{(this.state.orgSelected.stats && this.state.orgSelected.stats.memberCount) ? this.state.orgSelected.stats.memberCount : 0}</Text>
                                    <Text  style={[styles.descriptionText3,styles.centerText]}>members</Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            <View style={[styles.width150,styles.standardBorder,styles.padding10]}>
                              <View>
                                <View style={[styles.flexCenter]}>
                                  <View>
                                    <Text  style={[styles.headingText2,styles.boldText,styles.centerText]}>{(this.state.orgSelected.stats && this.state.orgSelected.stats.ageRange) ? this.state.orgSelected.stats.ageRange : "N/A"}</Text>
                                    <Text  style={[styles.descriptionText3,styles.centerText]}>{(this.state.orgSelected.stats && this.state.orgSelected.stats.ageRangeInterval) ? this.state.orgSelected.stats.ageRangeInterval : "N/A"} fall within this age range</Text>
                                  </View>
                                </View>
                              </View>
                            </View>
                            <View style={[styles.width150,styles.standardBorder,styles.padding10]}>
                              <View>
                                <View style={[styles.flexCenter]}>
                                  <View>
                                    <Text  style={[styles.headingText2,styles.boldText,styles.centerText]}>{(this.state.orgSelected.stats && this.state.orgSelected.stats.minorities) ? this.state.orgSelected.stats.minorities : "N/A"}</Text>
                                    <Text  style={[styles.descriptionText3,styles.centerText]}>are low-income and minorities</Text>
                                  </View>
                                </View>
                              </View>

                            </View>

                          </ScrollView>

                          <View>
                            {(this.state.orgSelected.careerSeekerReviews && this.state.orgSelected.careerSeekerReviews.length > 0) && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText]}>Career-Seeker Reviews</Text>
                                <View style={[styles.spacer]} />

                                {this.state.orgSelected.careerSeekerReviews.map((value2, optionIndex) =>
                                  <View key={value2 + optionIndex} style={[styles.lightBorder,styles.padding10]}>
                                    <View style={[styles.rowDirection]}>
                                      <View  style={[styles.width60]}>
                                        <Image source={(value2.pictureURL) ? { uri: value2.pictureURL} : { uri: profileIconDark}} style={[styles.square50,styles.contain, { borderRadius: 25 }]} />
                                      </View>
                                      <View style={[styles.calcColumn140]}>
                                        <Text style={[styles.standardText]}>{value2.firstName} {value2.lastName}</Text>
                                        {(value2.headline) && (
                                          <Text style={[styles.descriptionText3]}>{value2.headline}</Text>
                                        )}
                                      </View>

                                    </View>

                                    <View style={[styles.row10]}>
                                      <View style={[styles.rowDirection]}>
                                        <View><Image source={(value2.rating >= 0.5) ? { uri: fullStar} :{ uri:  emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                        <View><Image source={(value2.rating >= 1.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                        <View><Image source={(value2.rating >= 2.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                        <View><Image source={(value2.rating >= 3.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                        <View><Image source={(value2.rating >= 4.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                      </View>
                                    </View>

                                    <View style={[styles.row10]}>
                                      <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{convertDateToString(value2.updatedAt,"daysAgo")}</Text>
                                    </View>

                                    <View>
                                      <Text style={[styles.descriptionText2]}>{value2.review}</Text>
                                    </View>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>

                        </View>
                      )}
                    </View>

                    {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.centerText,styles.row5]}>{this.state.errorMessage}</Text>}
                    {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.centerText,styles.row5]}>{this.state.successMessage}</Text>}

                  </View>
                </TouchableWithoutFeedback>
              </KeyboardAvoidingView>
            )}

            <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>
              {(this.state.showPicker) && (
                <View style={[styles.flex1,styles.pinBottom,styles.justifyEnd]}>
                  <SubPicker
                    selectedSubKey={this.state.selectedSubKey}
                    selectedName={this.state.selectedName}
                    selectedOptions={this.state.selectedOptions}
                    selectedValue={this.state.selectedValue}
                    differentLabels={this.state.differentLabels}
                    pickerName={this.state.pickerName}
                    formChangeHandler={this.formChangeHandler}
                    closeModal={this.closeModal}
                  />
                </View>
              )}

              {(this.state.showDateTimePicker) && (
                <View style={[styles.flex1,styles.pinBottom,styles.justifyEnd]}>
                  <View style={[styles.alignCenter]}>
                    <TouchableOpacity onPress={() => this.closeModal()}>

                      <Text style={[styles.standardText,styles.centerText,styles.ctaColor]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                  <DateTimePicker
                    testID={this.state.selectedName}
                    value={(this.state.selectedValue) ? convertStringToDate(this.state.selectedValue,'dateOnly') : new Date()}
                    mode={this.state.mode}
                    is24Hour={true}
                    display="default"
                    onChange={(e, d) => this.formChangeHandler(this.state.selectedName,d,e)}
                    minimumDate={this.state.minimumDate}
                    maximumDate={this.state.maximumDate}
                  />
                </View>
              )}
           </Modal>

          </ScrollView>

      )
  }

}

export default OrgDetails;
