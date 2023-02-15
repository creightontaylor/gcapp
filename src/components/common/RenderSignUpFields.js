import React, {Component} from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, Linking, TextInput } from 'react-native';
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
const styles = require('../css/style');

const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';
import {convertStringToDate} from '../functions/convertStringToDate';

import SubPicker from '../common/SubPicker';

class RenderSignUpFields extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }

        this.retrieveData = this.retrieveData.bind(this)
        this.renderSignUpFields = this.renderSignUpFields.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.formChangeHandler = this.formChangeHandler.bind(this)
        this.optionClicked = this.optionClicked.bind(this)
        this.submitSignUpFields = this.submitSignUpFields.bind(this)

    }

    componentDidMount() {
      //see if user is logged in

      this.retrieveData()

    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in renderSignUpFields')

      if (this.props.signUpFields !== prevProps.signUpFields || this.props.userObject !== prevProps.userObject) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in renderSignUpFields')

        if (this.props.userObject) {
          let myOrgs = this.props.userObject.myOrgs
          const joinRequests = this.props.userObject.joinRequests

          const workAuthorization = this.props.userObject.workAuthorization
          const zipcode = this.props.userObject.zipcode
          const dateOfBirth = this.props.userObject.dateOfBirth
          const gender = this.props.userObject.gender
          const race = this.props.userObject.race
          const races = this.props.userObject.races
          const selfDescribedRace = this.props.userObject.selfDescribedRace
          const address = this.props.userObject.address
          const phoneNumber = this.props.userObject.phoneNumber
          const alternativePhoneNumber = this.props.userObject.alternativePhoneNumber
          const alternativeEmail = this.props.userObject.alternativeEmail
          const numberOfMembers = this.props.userObject.numberOfMembers
          const householdIncome = this.props.userObject.householdIncome
          const fosterYouth = this.props.userObject.fosterYouth
          const homeless = this.props.userObject.homeless
          const incarcerated = this.props.userObject.incarcerated
          const adversityList = this.props.userObject.adversityList

          const pictureURL = this.props.userObject.pictureURL
          const education = this.props.userObject.education
          const educationStatus = this.props.userObject.educationStatus

          const referrerName = this.props.userObject.referrerName
          const referrerEmail = this.props.userObject.referrerEmail
          const referrerOrg = this.props.userObject.referrerOrg

          this.setState({ myOrgs, joinRequests, workAuthorization, zipcode, dateOfBirth, gender, race, races, selfDescribedRace,
            address, phoneNumber, alternativePhoneNumber, alternativeEmail, numberOfMembers,
            householdIncome, fosterYouth, homeless, incarcerated, adversityList, pictureURL, education, educationStatus,
            referrerName, referrerEmail, referrerOrg
          })
        }

        // let emailId = await AsyncStorage.getItem('email');
        // const username = await AsyncStorage.getItem('username');
        // const cuFirstName = await AsyncStorage.getItem('firstName');
        // const cuLastName = await AsyncStorage.getItem('lastName');
        // let activeOrg = await AsyncStorage.getItem('activeOrg');
        // if (!activeOrg) {
        //   activeOrg = 'guidedcompass'
        // }
        // const orgFocus = await AsyncStorage.getItem('orgFocus');
        // const roleName = await AsyncStorage.getItem('roleName');
        // let pictureURL = await AsyncStorage.getItem('pictureURL');
        // if (this.props.pictureURL && !pictureURL) {
        //   pictureURL = this.props.pictureURL
        // }
        //
        // let modalIsOpen = false
        // if (passedGroupPost) {
        //   modalIsOpen = true
        // }
        // const accountCode = this.props.accountCode
        //
        // this.setState({ emailId, cuFirstName, cuLastName, activeOrg, orgFocus, roleName, username,
        //   modalIsOpen, pictureURL, accountCode })

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    formChangeHandler(eventName,eventValue,dateEvent) {
      console.log('formChangeHandler called', eventName, eventValue)

      if (dateEvent && Platform.OS === 'android') {
        if (eventValue) {
          eventValue = convertDateToString(new Date(eventValue),'hyphenatedDate')
          console.log('is this working? ', eventValue)
          this.setState({ [eventName]: eventValue, selectedValue: eventValue, showDateTimePicker: false, modalIsOpen: false })
          this.props.passData({ [eventName]: eventValue, textFormHasChanged: true })
        } else {
          this.setState({ showDateTimePicker: false, modalIsOpen: false })
        }
      } else if (this.state.showDateTimePicker) {
        this.setState({ [eventName]: convertDateToString(new Date(eventValue),'hyphenatedDate') })
        this.props.passData({ [eventName]: convertDateToString(new Date(eventValue),'hyphenatedDate') })
      } else if (eventName.includes('education|')) {
        const name = eventName.split("|")[1]

        let education = this.state.education
        if (education && education[0]) {
          education[0][name] = eventValue
        } else {
          education = [{}]
          education[0][name] = eventValue
        }

        this.setState({ education, selectedValue: eventValue })
        this.props.passData({ education, selectedValue: eventValue })

      } else {
        this.setState({ [eventName]: eventValue, selectedValue: eventValue })
        this.props.passData({ [eventName]: eventValue })
      }
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

      // this.setState({ [value.shorthand]: items })
      this.props.passData({ [value.shorthand]: items })

    }

    renderSignUpFields() {
      console.log('renderSignUpFields called')

      const signUpFields = this.props.orgSelected.signUpFieldsRequired
      let rows = []
      // let spaceCounter = 0
      for (let i = 1; i <= signUpFields.length; i++) {
        const value = signUpFields[i - 1]
        const index = i - 1

        let showQuestion = true
        if (value.questionType !== 'Multiple Answer') {
          // console.log('in it: ', value.name, spaceCounter)
          if (value.rule) {
            if (value.rule.name === 'races' && this.state.races && this.state.races.includes(value.rule.value)) {
              // spaceCounter = spaceCounter + 1
            } else {
              showQuestion = false
            }
          }
        }

        let selectedValue = this.state[value.shorthand]
        // console.log('show selectedValue: ', selectedValue, this.state[value.shorthand])
        if (value.shorthand.includes("education|")) {
          if (this.state.education && this.state.education.length > 0) {
            selectedValue = this.state.education[0][value.shorthand.split("|")[1]]
            if (value.shorthand === 'education|endDate') {
              console.log('do something special', this.state.education, selectedValue)
            }
          }
        }
        // if (value.shorthand === 'education|endDate') {
        //   console.log('one mo gain', this.state.education, selectedValue)
        // }
        rows.push(
          <View key={'renderSignUpFields' + index}>
            {(showQuestion) && (
              <View>
                <View key="signUpField">
                  {(value.questionType !== 'Date') && (
                    <Text style={[styles.standardText,styles.row10]}>{value.name}{(value.required) && <Text style={[styles.errorColor,styles.boldText]}>*</Text>}</Text>
                  )}

                  {(value.questionType === 'Date') && (
                    <View>
                      {(Platform.OS === 'ios') ? (
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.calcColumn200]}>
                            <Text style={[styles.standardText,styles.row10]}>{value.name}{(value.required) && <Text style={[styles.errorColor,styles.boldText]}>*</Text>}</Text>
                          </View>
                          <View style={[styles.width120,styles.topPadding5]}>
                            <DateTimePicker
                              testID={value.shorthand}
                              value={(this.state[value.shorthand]) ? convertStringToDate(this.state[value.shorthand],'dateOnly') : new Date()}
                              mode={'date'}
                              is24Hour={true}
                              display="default"
                              onChange={(e, d) => this.formChangeHandler(value.shorthand,d)}
                            />
                          </View>
                        </View>
                      ) : (
                        <View>
                          <View style={[styles.row5]}>
                            <Text style={[styles.standardText,styles.row10]}>{value.name}<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                          </View>
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
                        </View>
                      )}
                    </View>
                  )}
                  {(value.questionType === 'Short Answer') && (
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.formChangeHandler(value.shorthand, text)}
                      value={this.state[value.shorthand]}
                      placeholder={(value.placeholder) ? value.placeholder : "Your answer..."}
                      placeholderTextColor="grey"
                    />
                  )}
                  {(value.questionType === 'Multiple Choice') && (
                    <View>
                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: value.name, selectedIndex: index, selectedName: value.shorthand, selectedValue, selectedOptions: [''].concat(value.answerChoices), selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn130]}>
                              <Text style={[styles.descriptionText1]}>{selectedValue}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={selectedValue}
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
                      <View style={[styles.rowDirection,styles.flexWrap]}>
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
                    </View>
                  )}

                </View>
                <View style={[styles.spacer]} />

              </View>
            )}
          </View>
        )
      }

      return rows
    }

    closeModal() {
      console.log('closeModal called')

      this.setState({ modalIsOpen: false, showPicker: false, showDateTimePicker: false })
    }

    submitSignUpFields() {
      console.log('submitSignUpFields called')

      const signUpFieldsRequired = this.props.orgSelected.signUpFieldsRequired
      // if (signUpFieldsRequired && signUpFieldsRequired.length > 0) {
      //   for (let i = 1; i <= signUpFieldsRequired.length; i++) {
      //     console.log('l1')
      //     if (signUpFieldsRequired[i - 1].required) {
      //       console.log('l2', signUpFieldsRequired[i - 1].shorthand, this.state.education, this.state[signUpFieldsRequired[i - 1].shorthand])
      //       // multiple answer is array
      //       if (signUpFieldsRequired[i - 1].questionType === 'Multiple Answer' && (!this.state[signUpFieldsRequired[i - 1].shorthand] || this.state[signUpFieldsRequired[i - 1].shorthand].length === 0)) {
      //         return this.setState({ errorMessage: 'Please add answer(s) for ' + signUpFieldsRequired[i - 1].name })
      //       } else if (!signUpFieldsRequired[i - 1].shorthand.includes("|") && (!this.state[signUpFieldsRequired[i - 1].shorthand] || !this.state[signUpFieldsRequired[i - 1].shorthand] === '')) {
      //         return this.setState({ errorMessage: 'Please add an answer for ' + signUpFieldsRequired[i - 1].name })
      //       } else if (signUpFieldsRequired[i - 1].shorthand.includes("|") && (!this.state[signUpFieldsRequired[i - 1].shorthand.split("|")[0]] || this.state[signUpFieldsRequired[i - 1].shorthand.split("|")[0]].length === 0)) {
      //         console.log('show education signUpFieldsRequired: ', signUpFieldsRequired[i - 1])
      //         return this.setState({ errorMessage: 'Please add answer(s) for the education fields' })
      //         // return this.setState({ errorMessage: 'Please add answer(s) for the ' + signUpFieldsRequired[i - 1].name + ' field' })
      //       }
      //     }
      //   }
      // }

      if (signUpFieldsRequired && signUpFieldsRequired.length > 0) {
        for (let i = 1; i <= signUpFieldsRequired.length; i++) {
          console.log('l1')
          const item = signUpFieldsRequired[i - 1]

          if (item.required) {
            console.log('l2')

            // multiple answer is array
            if (item.questionType === 'Multiple Answer' && (!this.state[item.shorthand] || this.state[item.shorthand].length === 0)) {
              return this.setState({ errorMessage: 'Please add answer(s) for ' + item.name })
            } else if (!item.shorthand.includes("|") && (!this.state[item.shorthand] || !this.state[item.shorthand] === '')) {
              return this.setState({ errorMessage: 'Please add an answer for ' + item.name })
            } else if (item.shorthand.includes("|") && (!this.state[item.shorthand.split("|")[0]] || this.state[item.shorthand.split("|")[0]].length === 0)) {
              return this.setState({ errorMessage: 'Please add answer(s) for the education fields' })
            } else if (item.shorthand.includes("|")) {
              console.log('l3')
              if (!this.state[item.shorthand.split("|")[0]] || this.state[item.shorthand.split("|")[0]].length === 0) {
                return this.setState({ errorMessage: 'Please add answer(s) for the education fields' })
              } else if (!this.state[item.shorthand.split("|")[0]][0][item.shorthand.split("|")[1]]) {
                return this.setState({ errorMessage: 'Please add answer(s) for each of the education fields' })
              }
              console.log('l4')
            }
          }
        }
      }

      const dateOfBirth = this.state.dateOfBirth
      const gender = this.state.gender
      const race = this.state.race
      const races = this.state.races
      const selfDescribedRace = this.state.selfDescribedRace
      const address = this.state.address
      const zipcode = this.state.zipcode
      const phoneNumber = this.state.phoneNumber
      const alternativePhoneNumber = this.state.alternativePhoneNumber
      const alternativeEmail = this.state.alternativeEmail
      const numberOfMembers = this.state.numberOfMembers
      const householdIncome = this.state.householdIncome
      const fosterYouth = this.state.fosterYouth
      const homeless = this.state.homeless
      const incarcerated = this.state.incarcerated
      const workAuthorization = this.state.workAuthorization
      const adversityList = this.state.adversityList
      const educationStatus = this.state.educationStatus

      let education = this.state.education
      // if (this.state.education && this.state.education[0]) {
      //   education[0]['name'] = this.state.education.name
      //   education[0]['endDate'] = this.state.education.endDate
      //   education[0]['major'] = this.state.education.major
      // }
      const referrerName = this.state.referrerName
      const referrerEmail = this.state.referrerEmail
      const referrerOrg = this.state.referrerOrg

      const signUpFields = {
        dateOfBirth, gender, race, races, selfDescribedRace, address, zipcode, phoneNumber, alternativePhoneNumber,
        alternativeEmail, numberOfMembers, householdIncome, workAuthorization,
        fosterYouth, homeless, incarcerated, adversityList, education, educationStatus,
        referrerName, referrerEmail, referrerOrg
      }

      // console.log('request submitted', education)
      // this.closeModal()
      this.props.submitRequest(null, this.props.orgSelected, signUpFields, false)
    }

    render() {

      return (
        <View>
          {(this.props.orgSelected && this.props.orgSelected.signUpFieldsRequired) && (
            <View>
              <View style={[styles.rowDirection]}>
                <View style={[styles.calcColumn115]}>
                  <Text style={[styles.headingText4]}>Sign Up Fields for {this.props.orgSelected.orgName}</Text>
                </View>
                <View style={[styles.width30,styles.topPadding,styles.alignEnd]}>
                  <TouchableOpacity onPress={() => this.props.closeModal()}>
                    <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                  </TouchableOpacity>
                </View>
              </View>

              <Text style={[styles.row10]}>{this.props.orgSelected.orgName} requires the following fields before joining their workspace</Text>

              {(this.props.opportunityId) && (
                <Text style={[styles.row10]}>After you sign up to the {this.props.orgSelected.orgName} workspace, you will be able to access this opportunity.</Text>
              )}
              <View style={[styles.spacer]} />

              {this.renderSignUpFields()}

              {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor]}>{this.state.errorMessage}</Text>}
              {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor]}>{this.state.successMessage}</Text>}

              <View style={[styles.topPadding20]}>
                <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.submitSignUpFields()}><Text style={[styles.standardText,styles.whiteColor]}>Submit</Text></TouchableOpacity>
              </View>

              <View style={[styles.superSpacer]} /><View style={[styles.superSpacer]} />
              <View style={[styles.superSpacer]} /><View style={[styles.superSpacer]} />
              <View style={[styles.superSpacer]} /><View style={[styles.superSpacer]} />

              <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>

               <View key="skillAssessment" style={[styles.flex1]}>

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
               </View>
             </Modal>
            </View>
          )}

        </View>
      )
    }
}

export default RenderSignUpFields;
