import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, Linking, ActivityIndicator, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const addIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon-white.png';
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';
const timeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-blue.png';
const fullStar = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/full-star.png';
const emptyStar = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/empty-star.png';
const industryIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/industry-icon-dark.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';
const askQuestionIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/askQuestionIconDark.png';

import {requestAccessToWorkspace} from '../services/ProfileRoutes';
// import {convertDateToString} from '../functions/convertDateToString';
import {convertStringToDate} from '../functions/convertStringToDate';

class AddWorkspaces extends Component {
  constructor(props) {
    super(props)
    this.state = {
      defaultFilterOption: 'All',
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.submitRequest = this.submitRequest.bind(this)
    this.submitSignUpFields = this.submitSignUpFields.bind(this)

    this.closeModal = this.closeModal.bind(this)
    this.renderSignUpField = this.renderSignUpField.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.optionClicked = this.optionClicked.bind(this)
    this.renderManipulators = this.renderManipulators.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in addWorkspace ')

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData(this.props.assessment, this.props.index)
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
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        // this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
        //   roleName, activeOrg, orgFocus, orgName, remoteAuth
        // })

        let accountCode = this.props.accountCode

        let itemFilters = [
          { name: 'Org Type', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(['Workforce','Education']) },
          { name: 'Number of Members', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(['< 30','30 - 100','101 - 500','501 - 1,000','1,001 - 5,000','5,001+']) },
          { name: 'Diversity-Focused', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(['Yes','No']) },
          { name: 'Low-Income Focused', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(['Yes','No']) },
          { name: 'Avg Rating', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(['< 2 Stars', '2 - 3 Stars','3 - 4 Stars','4 - 5 Stars']) },
          { name: 'Review', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(['< 5 Reviews','5 - 10 Reviews','11 - 25 Reviews','24+ Reviews'])},
          { name: 'Added', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(['Yes','No']) },
        ]

        if (activeOrg || accountCode) {
          this.setState({ emailId: email, cuFirstName, cuLastName, username, activeOrg, orgFocus, accountCode, itemFilters, isAnimating: true })

          let workspaceParams = { isActive: true, isPublic: true }

          if (workspaceParams.isActive) {
            Axios.get('https://www.guidedcompass.com/api/org/all', { params: workspaceParams })
            .then((response) => {
               console.log('All orgs query attempted', response.data);

               if (response.data.success) {
                 console.log('successfully retrieved orgs')

                 let orgs = response.data.orgs
                 let orgSelected = null

                 if (orgs) {
                   for (let i = 1; i <= orgs.length; i++) {
                     let cta = 'Request Access'
                     if (orgs[i - 1].waitlist) {
                       cta = 'Join Waitlist'
                     } else if (orgs[i - 1].isOpen) {
                       cta = 'Join Workspace'
                     }
                     orgs[i - 1]['cta'] = cta

                     if (this.props.orgCode === orgs[i - 1].orgCode) {
                       orgSelected = orgs[i - 1]
                     }
                   }
                 }

                 const filteredOrgs = orgs
                 if (this.props.orgCode) {
                   this.setState({ orgs, filteredOrgs, modalIsOpen: true, orgSelected, showSignUpFields: true, showOrgDetails: false, isAnimating: false })
                 } else {
                    this.setState({ orgs, filteredOrgs, isAnimating: false })
                 }

               } else {
                 console.log('no orgs found', response.data.message)
               }

            }).catch((error) => {
                 console.log('Orgs query did not work', error);
            });

            if (accountCode) {
              Axios.get('https://www.guidedcompass.com/api/account', { params: { accountCode } })
              .then((response) => {
                console.log('Account info query attempted in employer dashboard', response.data);

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
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
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
              this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: null, objectId: this.props.opportunityId })
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

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showOrgDetails: false, showSignUpFields: false, orgSelected: null, showQuestion: false })
  }

  formChangeHandler(eventName,eventValue) {
    console.log('formChangeHandler called')

    if (eventName === 'searchString') {
      this.setState({ [eventName]: eventValue, isAnimating: true })
      this.searchOrgs(eventValue)
    } else if (eventName.includes('filter|')) {

      let itemFilters = this.state.itemFilters
      let index = 0

      const nameArray = eventName.split("|")
      const field = nameArray[1]

      for (let i = 1; i <= itemFilters.length; i++) {
        if (itemFilters[i - 1].name === field) {
          itemFilters[i - 1]['value'] = eventValue
          index = i - 1
        }
      }

      //reset everything
      let searchString = ''
      for (let i = 1; i <= itemFilters.length; i++) {
        if (itemFilters[i - 1].name !== field) {
          itemFilters[i - 1]['value'] = this.state.defaultFilterOption
        }
      }

      this.setState({ itemFilters, isAnimating: true, searchString })
      this.filterResults(this.state.searchString, eventValue, itemFilters, index, false, null)

    } else {
      this.setState({ [eventName]: eventValue })
    }
  }

  searchOrgs(orgName) {
    console.log('searchOrgs ', orgName)

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      Axios.get('https://www.guidedcompass.com/api/org/search', { params: { orgName, resLimit: 50 } })
      .then((response) => {
        console.log('Org search query attempted', response.data);

        if (response.data.success) {
          console.log('org search query worked')

          const filteredOrgs = response.data.organizations
          self.setState({ filteredOrgs, isAnimating: false });

        } else {
          console.log('organization search query did not work', response.data.message)
          self.setState({ isAnimating: false, filteredOrgs: self.state.orgs })
        }

      }).catch((error) => {
          console.log('Organization search query did not work for some reason', error);
          self.setState({ isAnimating: false, filteredOrgs: self.state.orgs })
      });
    }

    const delayFilter = () => {
      console.log('delayFilter called: ')
      clearTimeout(self.state.timerId)
      self.state.timerId = setTimeout(officiallyFilter, 1000)
    }

    delayFilter();
  }

  filterResults(searchString, filterString, filters, index, search, type) {
    console.log('filterResults called', searchString, filterString, filters, index, search, type)

    const defaultFilterOption = this.state.defaultFilterOption
    const orgs = this.state.orgs
    const sharePartners = this.state.sharePartners

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      // console.log('first matchScore: ', postings[0].matchScore, postings[0].title, postings[0].name)

      Axios.put('https://www.guidedcompass.com/api/orgs/filter', {  searchString, filterString, filters, defaultFilterOption, index, search, orgs, sharePartners })
      .then((response) => {
        console.log('Org filter query attempted', response.data);

        if (response.data.success) {
          console.log('org filter query worked')

          const filterCriteriaArray = response.data.filterCriteriaArray

          const filteredOrgs = response.data.orgs
          self.setState({ filteredOrgs, isAnimating: false, filterCriteriaArray })

        } else {
          console.log('org filter query did not work', response.data.message)
          self.setState({ isAnimating: false })
        }

      }).catch((error) => {
          console.log('Org filter query did not work for some reason', error);
          self.setState({ isAnimating: false })
      });
    }

    const delayFilter = () => {
      console.log('delayFilter called: ')
      clearTimeout(self.state.timerId)
      self.state.timerId = setTimeout(officiallyFilter, 1000)
    }

    delayFilter();
  }

  renderSignUpField(value, index) {
    console.log('renderSignUpField called')

    return (
      <View key="signUpField">
        <Text style={[styles.standardText,styles.row10]}>{value.name}<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
        {(value.questionType === 'Date') && (
          <DateTimePicker
            testID={value.shorthand}
            value={(this.state[value.shorthand]) ? convertStringToDate(this.state[value.shorthand],'dateOnly') : new Date()}
            mode={'date'}
            is24Hour={true}
            display="default"
            onChange={(e, d) => this.formChangeHandler(value.shorthand,d)}
          />
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
          <Picker
            selectedValue={this.state[value.shorthand]}
            onValueChange={(itemValue, itemIndex) =>
              this.formChangeHandler(value.shorthand,itemValue)
            }>
            {[''].concat(value.answerChoices).map(value => <Picker.Item key={value} label={value} value={value} />)}
          </Picker>
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
                          <Text style={[styles.descriptionText2]}>{value2}</Text>
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

  renderManipulators(type) {
    console.log('renderManipulators called')

    if (type === 'filter') {
      let filters = this.state.itemFilters

      // if (filters) {
      //
      //   let rows = []
      //   for (let i = 1; i <= filters.length; i++) {
      //     rows.push(
      //       <View key={filters[i - 1] + i.toString()}>
      //         <View>
      //           <View className="float-left row-10 right-padding-20">
      //             <View className="float-left light-border">
      //               <View className="float-left right-padding-5 left-padding nowrap top-margin-negative-2">
      //                 <View style={[styles.spacer]} />
      //                 <Text className="standard-color">{filters[i - 1].name}</Text>
      //               </View>
      //               <View className="float-left">
      //                 <Picker
      //                   selectedValue={filters[i - 1].value}
      //                   onValueChange={(itemValue, itemIndex) =>
      //                     this.formChangeHandler("filter|" + filters[i - 1].name,itemValue)
      //                   }>
      //                   {filters[i - 1].options.map(value => <Picker.Item key={value} label={value} value={value} />)}
      //                 </Picker>
      //               </View>
      //               <View className="dropdown-arrow-container">
      //                 <Image source={{ uri: dropdownArrow}}/>
      //               </View>
      //             </View>
      //           </View>
      //         </View>
      //       </View>
      //     )
      //   }
      //
      //   return rows
      //
      // }
    } else if (type === 'sort') {
      // let sorters = []
      //
      // if (this.state.showV2App) {
      //   if (this.state.subNavSelected === 'Events') {
      //     // events
      //     sorters = this.state.eventSorters
      //   } else if (this.state.subNavSelected === 'Projects') {
      //     // projects
      //     sorters = this.state.projectSorters
      //   } else if (this.state.subNavSelected === 'Work') {
      //     // work
      //     sorters = this.state.workSorters
      //   } else if (this.state.subNavSelected === 'All') {
      //     sorters = this.state.allSorters
      //   }
      // } else {
      //   if (this.state.viewIndex === 1) {
      //     // events
      //     sorters = this.state.eventSorters
      //   } else if (this.state.viewIndex === 5) {
      //     // projects
      //     sorters = this.state.projectSorters
      //   } else if (this.state.viewIndex === 7) {
      //     // work
      //     sorters = this.state.workSorters
      //   } else if (this.state.viewIndex === 8) {
      //     // work
      //     sorters = this.state.allSorters
      //   }
      // }
      //
      // if (sorters) {
      //
      //   let rows = []
      //   for (let i = 1; i <= sorters.length; i++) {
      //     rows.push(
      //       <View key={sorters[i - 1] + i.toString()}>
      //         <View>
      //           <View className="float-left row-10 right-padding-20">
      //             <View className="float-left light-border">
      //               <View className="float-left right-padding-5 left-padding nowrap top-margin-negative-2">
      //                 <View style={[styles.spacer]} />
      //                 <Text className="standard-color">{sorters[i - 1].name}</Text>
      //               </View>
      //               <View className="float-left">
                        // <Picker
                        //   selectedValue={sorters[i - 1].value}
                        //   onValueChange={(itemValue, itemIndex) =>
                        //     this.formChangeHandler("sort|" + sorters[i - 1].name,itemValue)
                        //   }>
                        //   {sorters[i - 1].options.map(value => <Picker.Item key={value} label={value} value={value} />)}
                        // </Picker>
      //               </View>
      //               <View className="dropdown-arrow-container">
      //                 <Image source={{ uri: dropdownArrow}}/>
      //               </View>
      //             </View>
      //           </View>
      //         </View>
      //       </View>
      //     )
      //   }
      //
      //   return rows
      //
      // }
    }
  }

  render() {

    return (
        <ScrollView>
          <View style={[styles.card,styles.topMargin20]}>
            <View style={[styles.row10]}>
              <View style={[styles.rowDirection]}>
                <View style={[styles.square40]} />
                <View style={[styles.calcColumn140]}>
                  <Text style={[styles.headingText3,styles.centerText]}>Add Workspaces</Text>
                </View>
                <View style={[styles.width40,styles.alignEnd]}>
                  <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/contact')}>
                    <Image source={{ uri: askQuestionIconDark}} style={[styles.square30,styles.contain]} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.flex1,styles.centerText,styles.topPadding]}>
                  Workspaces are personalized spaces for members of workforce programs. They help these organizations support and guide you to opportunities you love. Once you join a workspace, their logo will appear on the top-left of your screen.
              </Text>
            </View>
          </View>
          {/*
          {(this.props.fromAdvisor) && (
            <View className={(this.props.fromWalkthrough) ? "full-width" : "width-70-percent center-horizontally max-width-1400"}>
              <View className="filter-field-search full-width white-background clear-margin medium-shadow">
                <View className="search-icon-container">
                  <Image source={{ uri: searchIcon}} className="image-auto-28 padding-5" />
                </View>
                <View className="filter-search-container calc-column-offset-100-static">
                  <input type="text" className="text-field clear-border" placeholder={"Search 500+ organizations..."} name="searchString" value={this.state.searchString} onChange={this.formChangeHandler}/>
                </View>
                <View className="search-icon-container top-margin-negative-3">
                  <TouchableOpacity type="button" className="background-button" onPress={(this.state.showingSearchBar) ? () => this.setState({ showingSearchBar: false }) : () => this.setState({ showingSearchBar: true })}>
                    <View className={(this.state.showingSearchBar) ? "cta-border rounded-corners row-5 horizontal-padding-10 description-text-3 cta-background-color white-text" : "standard-border rounded-corners row-5 horizontal-padding-10 description-text-3"}>Filter</View>
                  </TouchableOpacity>
                </View>
              </View>


              {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.calcColumn30,styles.centerText,styles.row5]}>{this.state.errorMessage}</Text>}
              {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.calcColumn30,styles.centerText,styles.row5]}>{this.state.successMessage}</Text>}

              {(this.state.showingSearchBar) && (
                <View className="row box-container-1 white-background medium-shadow">
                  <View>
                    <Text className="heading-text-4">Filter Results</Text>
                    <View style={[styles.halfSpacer]} />

                    {(this.renderManipulators('filter'))}


                    <View style={[styles.spacer]} />
                  </View>
                </View>
              )}
            </View>
          )}*/}

          <View style={[styles.fullScreenWidth,styles.row20]}>
            <View>
              {(this.state.isAnimating) ? (
                <View style={[styles.flexCenter,styles.flex1]}>
                  <View>
                    <View style={[styles.superSpacer]} />

                    <ActivityIndicator
                       animating = {this.state.isAnimating}
                       color = '#87CEFA'
                       size = "large"
                       style={[styles.square80, styles.centerHorizontally]}/>

                    <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                    <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Loading...</Text>
                  </View>
                </View>
              ) : (
                <View>
                  {this.state.filteredOrgs && this.state.filteredOrgs.map((value, index) =>
                    <View key={index}>
                      <View style={[styles.bottomMargin20]}>
                        <View style={[styles.cardClearPadding]}>

                          <TouchableOpacity onPress={() => this.props.navigation.navigate('OrgDetails', { selectedOrg: value })}>
                            <View style={[styles.padding15]}>
                              <View style={[styles.bottomPadding,styles.flexCenter]}>
                                <Image source={(value.webLogoURIColor) ? { uri: value.webLogoURIColor} : { uri: industryIconDark}} style={[styles.square90,styles.contain]}/>
                              </View>
                              <Text style={[styles.headingText4,styles.centerText]}>{value.orgName}</Text>
                              <Text style={[styles.descriptionText2,styles.centerText]}>{value.orgDescription}</Text>
                              <Text style={[styles.descriptionText2,styles.topPadding,styles.descriptionTextColor,styles.centerText]}>{value.region}</Text>
                              <Text style={[styles.descriptionText2,styles.topPadding,styles.descriptionTextColor,styles.centerText]}>{value.thirdTitle}</Text>

                              <View style={[styles.bottomMargin20,styles.calcColumn30]}>
                                <View style={[styles.rowDirection,styles.flexCenter]}>
                                  <View><Image source={(value.careerSeekerRating && value.careerSeekerRating.avgRating >= 0.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                  <View><Image source={(value.careerSeekerRating && value.careerSeekerRating.avgRating >= 1.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                  <View><Image source={(value.careerSeekerRating && value.careerSeekerRating.avgRating >= 2.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                  <View><Image source={(value.careerSeekerRating && value.careerSeekerRating.avgRating >= 3.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                  <View><Image source={(value.careerSeekerRating && value.careerSeekerRating.avgRating >= 4.5) ? { uri: fullStar} : { uri: emptyStar}} style={[styles.square15,styles.contain,styles.horizontalMargin1]}/></View>
                                </View>

                                <View style={[styles.topMargin5]}>
                                  <Text style={[styles.descriptionText3,styles.centerText]}><Text style={[styles.boldText]}>{(value.careerSeekerRating && value.careerSeekerRating.ratingCount) ? value.careerSeekerRating.ratingCount : 0}</Text> ratings</Text>
                                </View>
                              </View>

                              {(value.cta === 'Join Workspace') ? (
                                <View style={[styles.bottomPadding]}>
                                  <TouchableOpacity style={(this.state.myOrgs && this.state.myOrgs.includes(value.orgCode)) ? [styles.btnSquarish,styles.ctaBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.myOrgs && this.state.myOrgs.includes(value.orgCode)) ? true : false} onPress={(e) => this.submitRequest(e, value, null, true)}>
                                    <View style={[styles.rowDirection,styles.flexCenter]}>
                                      <View style={[styles.width30,styles.rightPadding,styles.topMargin5,styles.flexCenter]}>
                                        <Image source={(this.state.myOrgs && this.state.myOrgs.includes(value.orgCode)) ? { uri: checkmarkIcon} : { uri: addIconWhite}} style={[styles.square12,styles.contain]}/>
                                      </View>
                                      <View>
                                        <Text style={(this.state.myOrgs && this.state.myOrgs.includes(value.orgCode)) ? [styles.descriptionText1,styles.ctaColor] : [styles.descriptionText1,styles.whiteColor]}>{(this.state.myOrgs && this.state.myOrgs.includes(value.orgCode)) ? "Joined" : "Join" }</Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              ) : (
                                <View style={[styles.bottomPadding]}>
                                  <TouchableOpacity style={(this.state.joinRequests && this.state.joinRequests.includes(value.orgCode)) ? [styles.btnSquarish,styles.ctaBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.joinRequests && this.state.joinRequests.includes(value.orgCode)) ? true : false} onPress={(e) => this.submitRequest(e, value, null, true)}>
                                    <View style={[styles.rowDirection,styles.flexCenter]}>
                                      <View style={[styles.width30,styles.rightPadding,styles.topMargin5,styles.flexCenter]}>
                                        <Image source={(this.state.joinRequests && this.state.joinRequests.includes(value.orgCode)) ? { uri: timeIconBlue} : { uri: addIconWhite}} style={[styles.square12,styles.contain]}/>
                                      </View>
                                      <View>
                                        <Text style={(this.state.joinRequests && this.state.joinRequests.includes(value.orgCode)) ? [styles.descriptionText1,styles.ctaColor] : [styles.descriptionText1,styles.whiteColor]}>{(this.state.joinRequests && this.state.joinRequests.includes(value.orgCode)) ? "Requested Access" : value.cta }</Text>
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              )}
                              {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[index] && this.state.filterCriteriaArray[index].name) && (
                                <View style={[styles.calcColumn30,styles.row10]}>
                                  <View style={[styles.halfSpacer]} />
                                  <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.filterCriteriaArray[index].name}: {this.state.filterCriteriaArray[index].criteria}</Text>
                                </View>
                              )}
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}

            </View>

            {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.calcColumn30,styles.centerText,styles.row5]}>{this.state.errorMessage}</Text>}
            {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.calcColumn30,styles.centerText,styles.row5]}>{this.state.successMessage}</Text>}

          </View>

          <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>

           <View key="skillAssessment" style={[styles.calcColumn80,styles.padding20]}>
            {(this.state.showSignUpFields && this.state.orgSelected) && (
              <View>
                <Text style={[styles.headingText2]}>Sign Up Fields for {this.state.orgSelected.orgName}</Text>

                <Text style={[styles.row10]}>{this.state.orgSelected.orgName} requires the following fields before joining their workspace</Text>

                {(this.props.opportunityId) && (
                  <Text style={[styles.row10]}>After you sign up to the {this.state.orgSelected.orgName} workspace, you will be able to access this opportunity.</Text>
                )}
                <View style={[styles.spacer]} />

                <View style={[styles.rowDirection,styles.flexWrap]}>
                  {this.state.orgSelected.signUpFields.map((value, index) =>
                    <View key={index} style={[style.topMargin15]}>
                      {this.renderSignUpField(value, index)}
                    </View>
                  )}
                </View>

                {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor]}>{this.state.errorMessage}</Text>}
                {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor]}>{this.state.successMessage}</Text>}

                <View style={[styles.topPadding20]}>
                  <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.submitSignUpFields()}><Text style={[styles.standardText,styles.whiteColor]}>Submit</Text></TouchableOpacity>
                </View>
              </View>
            )}

            {(this.state.showQuestion) && (
              <View>
                <Text style={[styles.headingText2]}>Request to Work With Training Provider</Text>
                <SubContact reason={"Guided Compass to Work with My Org / School"} reasonOptions={null} navigation={this.props.navigation} inModal={true} closeModal={this.closeModal} />
              </View>
            )}
           </View>
         </Modal>
        </ScrollView>

    )
  }

}

export default AddWorkspaces;
