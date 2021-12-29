import React, { Component } from 'react';
import { View, Text, TextInput, Image, ImageBackground, StyleSheet, ScrollView,
  TouchableOpacity, AsyncStorage, Picker, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Axios from 'axios';
import Swiper from 'react-native-swiper';
import { Dropdown } from 'react-native-material-dropdown';

//import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";

class WalkthroughScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      email1: '',
      email2: '',
      email3: '',

      orgMode: false,
      activeOrg: '',
      orgName: '',
      orgLogoURI: '',

      careerTrack: '', cohortYear: '4', mentorCoachFirstName: '', mentorCoachLastName: '', mentorCoachEmail: '',

      targetFunction: 'Undecided',
      targetIndustry: 'Undecided',

      targetFunctions: [],
      targetIndustries: [],

      studyFields: '',
      careerInterests: '',
      school: '', degree: '', gradYear: '',

      phoneNumber: '', dateOfBirth: '', linkedInURL: '', resumeURL: '', customWebsiteURL: '',

      race: '', gender: '', veteran: '', workAuthorization: '',

      raceOptions: [{value: ""},{value: 'American Indian or Alaska Native'}, {value: 'Asian-American'},
        {value: "Black or African American"}, {value: "Hispanic or Latino"}, {value: "Native Hawaiian or Other Pacific Islander"},
        {value: "Two or More Races"}, {value: "White"},{value: "Do not disclose"}
      ],
      genderOptions: [{value: ""},{value: "Female"},{value: "Male"},{value: "Do Not Disclose"}],
      veteranOptions: [{value: ""},{value: "I am a protected veteran"},{value: "I am an unprotected veteran"},{value: "I am not a veteran"},{value: 'Do not disclose'}],
      workAuthorizationOptions: [{value: ""},{value: "Yes"},{value: "No"}],
      degreeOptions: [{value:"Middle School"},{value: "High School"},{value:"Associate's Degree"},
      {value:"Bachelor's Degree"},{value:"Master's Degree"},{value:"Doctoral Degree"}],
      careerTrackOptions: [{value: ""}],
      gradYearOptions: [{value: ""}],
      functionOptions: [{value: ""}],
      industryOptions: [{value: ""}],
      numberOptions: [{value:""},{value:"1"},{value:"2"},{value:"3"},{value:"4"},{value:"5"},{value:"6"},{value:"7"}],

      formHasChanged: false,

      errorMessage: '',

      emailId: '',
      cuFirstName: '',
      cuLastName: ''
    }

    this.renderSwiperViews = this.renderSwiperViews.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.saveProfile = this.saveProfile.bind(this)

  }

  static navigationOptions = { header: null };

  componentDidMount() {
    console.log('walkthrough componentDidMount called');
    /*
    let tracker = new GoogleAnalyticsTracker("UA-67259774-5");
    if (Platform.OS === 'ios') {
      tracker.trackScreenView("Walkthrough - ios");
    } else {
      tracker.trackScreenView("Walkthrough - android");
    }*/

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')
      const firstName = await AsyncStorage.getItem('firstName')
      const lastName = await AsyncStorage.getItem('lastName')
      const activeOrg = await AsyncStorage.getItem('activeOrg')

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email, firstName, lastName, 'check');

        let orgMode = false
        let orgLogoURI = ''

        if (!activeOrg || activeOrg === '') {
          orgMode = false
        } else {
          orgMode = true
        }

        console.log('show me orgMode', activeOrg, orgMode)
        //calculate current year

        let startingYear = new Date().getFullYear()
        console.log('show me year', startingYear)
        let gradYearOptions = [
          { value: startingYear}, {value: startingYear + 1}, {value: startingYear + 2},
          { value: startingYear + 3 }, { value: startingYear + 4 }, { value: startingYear + 5 }
        ]


        this.setState({
          emailId: email,
          cuFirstName: firstName,
          cuLastName: lastName,
          orgMode, activeOrg, gradYearOptions,
        })

        Axios.get('https://www.guidedcompass.com/api/workoptions')
        .then((response) => {
          console.log('Work options query tried', response.data);

          if (response.data.success) {
            console.log('Work options query succeeded')

            let functionOptions = [{value: 'Undecided'}]
            for (let i = 1; i <= response.data.workOptions[0].functionOptions.length; i++) {
              if (i > 1) {
                functionOptions.push({ value: response.data.workOptions[0].functionOptions[i - 1]})
              }
            }

            let industryOptions = [{value: 'Undecided'}]
            for (let i = 1; i <= response.data.workOptions[0].industryOptions.length; i++) {
              if (i > 1) {
                industryOptions.push({ value: response.data.workOptions[0].industryOptions[i - 1]})
              }
            }

            this.setState({ functionOptions, industryOptions })

          } else {
            console.log('no jobFamilies data found', response.data.message)
          }
        }).catch((error) => {
            console.log('query for work options did not work', error);
        })

        const fetchDetailsURL = 'https://www.guidedcompass.com/api/users/profile/details/' + email
        //fetch profile details
        Axios.get(fetchDetailsURL)
        .then((response) => {
          if (response.data) {

            console.log('Details fetch worked in walkthrough', response.data);

            // let targetFunction = ''
            // if (response.data.user.targetFunction) {
            //   targetFunction = response.data.user.targetFunction
            // }
            //
            // let targetIndustry = ''
            // if (response.data.user.targetIndustry) {
            //   targetIndustry = response.data.user.targetIndustry
            // }

            let targetFunctions = []
            if (response.data.user.targetFunctions) {
              targetFunctions = response.data.user.targetFunctions
            }

            let targetIndustries  = []
            if (response.data.user.targetIndustries) {
              targetIndustries = response.data.user.targetIndustries
            }

            let studyFields = ''
            if (response.data.user.studyFields) {
              studyFields = response.data.user.studyFields
            }

            let careerInterests = ''
            if (response.data.user.careerInterests) {
              careerInterests = response.data.user.careerInterests
            }

            //education info
            let school = ''
            if (response.data.user.school) {
              school = response.data.user.school
            }

            let degree = ''
            if (response.data.user.degree) {
              degree = response.data.user.degree
            }

            let gradYear = ''
            if (response.data.user.gradYear) {
              gradYear = response.data.user.gradYear
            }

            //personal info
            let phoneNumber = ''
            if (response.data.user.phoneNumber) {
              phoneNumber = response.data.user.phoneNumber
            }

            let dateOfBirth = ''
            if (response.data.user.dateOfBirth) {
              dateOfBirth = response.data.user.dateOfBirth
            }

            let linkedInURL = ''
            if (response.data.user.linkedInURL) {
              linkedInURL = response.data.user.linkedInURL
            }

            let resumeURL = ''
            if (response.data.user.resumeURL) {
              resumeURL = response.data.user.resumeURL
            }

            let customWebsiteURL = ''
            if (response.data.user.customWebsiteURL) {
              customWebsiteURL = response.data.user.customWebsiteURL
            }

            let race = ''
            if (response.data.user.race) {
              race = response.data.user.race
            }

            let gender = ''
            if (response.data.user.gender) {
              gender = response.data.user.gender
            }

            let veteran = ''
            if (response.data.user.veteran) {
              veteran = response.data.user.veteran
            }

            let workAuthorization = ''
            if (response.data.user.workAuthorization) {
              workAuthorization = response.data.user.workAuthorization
            }

            let careerTrack = ''
            if (response.data.user.careerTrack) {
              careerTrack = response.data.user.careerTrack
            }

            let cohortYear = '4'
            if (response.data.user.cohortYear) {
              cohortYear = response.data.user.cohortYear

            }
            console.log('show me cohortYear', response.data.user.cohortYear, ' testing ', cohortYear)

            let mentorCoachFirstName = ''
            if (response.data.user.mentorCoachFirstName) {
              mentorCoachFirstName = response.data.user.mentorCoachFirstName
            }

            let mentorCoachLastName = ''
            if (response.data.user.mentorCoachLastName) {
              mentorCoachLastName = response.data.user.mentorCoachLastName
            }

            let mentorCoachEmail = ''
            if (response.data.user.mentorCoachEmail) {
              mentorCoachEmail = response.data.user.mentorCoachEmail
            }

            this.setState({
              targetFunctions, targetIndustries, studyFields, careerInterests,
              school, degree, gradYear,
              careerTrack, cohortYear, mentorCoachFirstName, mentorCoachLastName, mentorCoachEmail,
              phoneNumber, dateOfBirth, linkedInURL, resumeURL, customWebsiteURL,
              race, gender, veteran, workAuthorization
            })

          }
        }).catch((error) => {
            console.log('Profile info fetch did not work in walkthrough', error);
        });

        if (orgMode) {
          Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
          .then((response) => {
            console.log('Org info query attempted', response.data);

            if (response.data.success) {
              console.log('org info query worked')

              let orgName = ''
              if (response.data.orgInfo.orgName) {
                orgName = response.data.orgInfo.orgName
                AsyncStorage.setItem('orgName', orgName)
              }

              let orgProgramName = ''
              if (response.data.orgInfo.orgProgramName) {
                orgProgramName = response.data.orgInfo.orgProgramName
                AsyncStorage.setItem('orgProgramName', orgProgramName)
              }

              let activeOrgWorkId = ''
              if (response.data.orgInfo.activeOrgWorkId) {
                activeOrgWorkId = response.data.orgInfo.activeOrgWorkId
                AsyncStorage.setItem('activeOrgWorkId', activeOrgWorkId)
              }

              let orgLogoURI = ''
              if (response.data.orgInfo.mobileLogoURI) {
                orgLogoURI = response.data.orgInfo.mobileLogoURI
                AsyncStorage.setItem('orgLogoURI', orgLogoURI)
              }

              let orgFocus = 'Placement'
              if (response.data.orgInfo.orgFocus) {
                orgFocus = response.data.orgInfo.orgFocus
                AsyncStorage.setItem('orgFocus', response.data.orgInfo.orgFocus)
              }

              let careerTrackOptions = [{value: ""}]
              if (response.data.orgInfo.careerTracks) {
                for (let i = 1; i <= response.data.orgInfo.careerTracks.length; i++) {
                  careerTrackOptions.push({ value: response.data.orgInfo.careerTracks[i - 1]})
                }
              }

              this.setState({

                orgName, orgProgramName,
                orgDescription: response.data.orgInfo.orgDescription,
                orgURL: response.data.orgInfo.orgURL,
                orgType: response.data.orgInfo.orgType,
                orgMission: response.data.orgInfo.orgMission,

                contactFirstName: response.data.orgInfo.contactFirstName,
                contactLastName: response.data.orgInfo.contactLastName,
                contactTitle: response.data.orgInfo.contactTitle,
                contactEmail: response.data.orgInfo.contactEmail,

                activeOrgWorkId, orgLogoURI, orgFocus, careerTrackOptions

              });
            } else {
              console.log('org info query did not work', response.data.message)
            }

          }).catch((error) => {
              console.log('Org info query did not work for some reason', error);
          });
        }
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler(value, field) {
    console.log('formChangeHandler called', value, field)

    if (field === 'careerTrack') {
      this.setState({ careerTrack: value, formHasChanged: true })
    } else if (field === 'cohortYear') {
      this.setState({ cohortYear: value, formHasChanged: true })
    } else if (field === 'gradYear') {
      this.setState({ gradYear: value, formHasChanged: true })
    // } else if (field === 'targetFunction') {
    //   this.setState({ targetFunction: value, formHasChanged: true })
    // } else if (field === 'targetIndustry') {
    //   this.setState({ targetIndustry: value, formHasChanged: true })
    } else if (field === 'race') {
      this.setState({ race: value, formHasChanged: true })
    } else if (field === 'gender') {
      this.setState({ gender: value, formHasChanged: true })
    } else if (field === 'veteran') {
      this.setState({ veteran: value, formHasChanged: true })
    } else if (field === 'workAuthorization') {
      this.setState({ workAuthorization: value, formHasChanged: true })
    } else if (field === 'degree') {
      this.setState({ degree: value, formHasChanged: true })
    } else if (field === 'dateOfBirth') {

      let dateOfBirth = value
      if (dateOfBirth.length === 2 || dateOfBirth.length === 5) {
        dateOfBirth = dateOfBirth + "/"
        this.setState({ dateOfBirth, formHasChanged: true })
      } else if (dateOfBirth.length === 11) {
        //do nothing
      } else {
        this.setState({ dateOfBirth, formHasChanged: true })
      }
    } else if (field === 'targetFunctions') {

      let targetFunctions = this.state.targetFunctions
      if (targetFunctions.includes(value)) {
        let index = targetFunctions.indexOf(value);
        if (index > -1) {
          targetFunctions.splice(index, 1);
        }
      } else {
        targetFunctions.push(value)
      }

      this.setState({ targetFunctions, formHasChanged: true })
    /*} else if (field === 'targetIndustry') {

      let targetIndustry = value
      this.setState({ targetIndustry, textFormHasChanged: true })*/
    } else if (field === 'targetIndustries') {

      let targetIndustries = this.state.targetIndustries
      if (targetIndustries.includes(value)) {
        let index = targetIndustries.indexOf(value);
        if (index > -1) {
          targetIndustries.splice(index, 1);
        }
      } else {
        targetIndustries.push(value)
      }

      this.setState({ targetIndustries, formHasChanged: true })
    }
  }

  saveProfile(destination) {
    console.log('saveProfile called', destination)

    this.setState({ errorMessage: '' })

    if (this.state.formHasChanged) {
      console.log('form has indeed changed')
      const emailId = this.state.emailId

      const careerTrack = this.state.careerTrack
      const cohortYear = this.state.cohortYear
      const mentorCoachFirstName = this.state.mentorCoachFirstName
      const mentorCoachLastName = this.state.mentorCoachLastName
      const mentorCoachEmail = this.state.mentorCoachEmail

      const targetFunctions = this.state.targetFunctions
      const targetIndustries = this.state.targetIndustries

      // const targetFunction = this.state.targetFunction
      // const targetIndustry = this.state.targetIndustry
      const studyFields = this.state.studyFields
      const careerInterests = this.state.careerInterests

      //education
      const school = this.state.school
      const degree = this.state.degree
      const gradYear = this.state.gradYear

      //personal
      const phoneNumber = this.state.phoneNumber
      const dateOfBirth = this.state.dateOfBirth

      let liu = ''
      if (this.state.linkedInURL) {
        liu = this.state.linkedInURL
        const prefix = liu.substring(0,4);

        if (prefix !== "http") {
          liu = "http://" + liu
        }
      }

      let ru = ''
      if (this.state.resumeURL) {
        ru = this.state.resumeURL
        const prefix = ru.substring(0,4);

        if (prefix !== "http") {
          ru = "http://" + ru
        }
      }

      let cwu = ''
      if (this.state.customWebsiteURL) {

        cwu = this.state.customWebsiteURL
        const prefix = cwu.substring(0,4);

        if (prefix !== "http") {
          cwu = "http://" + cwu
        }
      }

      const linkedInURL = liu
      const resumeURL = ru
      const customWebsiteURL = cwu

      const race = this.state.race
      const gender = this.state.gender
      const veteran = this.state.veteran
      const workAuthorization = this.state.workAuthorization

      const updatedAt = new Date()

      console.log('show me mento values', mentorCoachEmail, mentorCoachFirstName, mentorCoachLastName)
      if (mentorCoachEmail !== '') {

        const requesterEmail = this.state.emailId
        const advisorEmail = mentorCoachEmail
        const adviseeEmail = this.state.emailId
        const relationship = 'Mentor'
        const isPrimary = true

        const senderFirstName = this.state.cuFirstName
        const senderLastName = this.state.cuLastName
        const senderEmail = this.state.emailId
        const recipientFirstName = mentorCoachFirstName
        const recipientLastName = mentorCoachLastName
        const recipientEmail = mentorCoachEmail

        Axios.post('https://www.guidedcompass.com/api/partner', {
          requesterEmail, advisorEmail, adviseeEmail, relationship, isPrimary,
          senderFirstName, senderLastName, senderEmail,
          recipientFirstName, recipientLastName, recipientEmail
        })
        .then((response) => {

          if (response.data.success) {
            //save values
            console.log('Mentor coach save send worked', response.data);
            //report whether values were successfully saved

          } else {
            console.log('mentor coach save was not successful', response.data)
          }

        }).catch((error) => {
            console.log('Mentor coach save did not work', error);
        });
      }

      Axios.post('https://www.guidedcompass.com/api/users/profile/details', {
        emailId, careerTrack, cohortYear, mentorCoachFirstName, mentorCoachLastName, mentorCoachEmail,
        targetFunctions, targetIndustries, studyFields, careerInterests,
        school, degree, gradYear, phoneNumber, dateOfBirth,
        linkedInURL, resumeURL, customWebsiteURL,
        race, gender, veteran, workAuthorization,
        updatedAt
      })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Save send worked', response.data);
          //report whether values were successfully saved

          AsyncStorage.setItem('destination', destination)
          this.props.navigation.navigate('App')
          /*
          if (destination === 'Home') {
            this.props.navigation.navigate('App', { takeAssessment: false })
          } else if (destination === 'Assessments') {
            this.props.navigation.navigate('Asssessments')
          } else if (destination === 'Endorsements') {
            this.props.navigation.navigate('Endorsements')
          } else if (destination === 'WorkDetails') {
            this.props.navigation.navigate('Work Details', { takeAssessment: false })
          }*/

        } else {
          console.log('save was not successful')
          AsyncStorage.setItem('destination', destination)
          this.props.navigation.navigate('App')
        }

      }).catch((error) => {
          console.log('Profile save did not work', error);
          AsyncStorage.setItem('destination', destination)
          this.props.navigation.navigate('App')
      });
    } else {
      //simply segue away
      AsyncStorage.setItem('destination', destination)
      this.props.navigation.navigate('App')
    }
  }

  renderTags(tagType) {
    console.log('renderTags called', tagType)

    let rows = []
    if (tagType === 'function') {

      let backgroundColor = 'rgba(190,190,190,1)'
      let iconName = 'ios-add'

      for (let i = 1; i <= this.state.functionOptions.length; i++) {

        const functionIndex = i - 1

        if (this.state.targetFunctions.includes(this.state.functionOptions[i - 1].value)) {
          backgroundColor = '#87CEFA'
          iconName = 'ios-checkmark'
        } else {
          backgroundColor = 'rgba(190,190,190,1)'
          iconName = 'ios-add'
        }

        rows.push(
          <View key={i} style={{ paddingRight: 5, marginBottom: 8 }}>
            <TouchableOpacity onPress={() => this.formChangeHandler(this.state.functionOptions[functionIndex].value, 'targetFunctions')}>
              <View style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 10, paddingLeft: 10, backgroundColor: backgroundColor, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(1,1,1,0)' }}>
                <View style={{ flex: 1, flexDirection: 'row'}}>
                  <Text style={{ color: 'white'}}>{this.state.functionOptions[i - 1].value}</Text>
                  <View style={{ width: 10, height: 3 }}/>
                  <Icon name={iconName} size={15} color='white' />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )
      }
    } else if (tagType === 'industry') {
      let backgroundColor = 'rgba(190,190,190,1)'
      let iconName = 'ios-add'

      for (let i = 1; i <= this.state.industryOptions.length; i++) {

        const industryIndex = i - 1

        if (this.state.targetIndustries.includes(this.state.industryOptions[i - 1].value)) {
          backgroundColor = '#87CEFA'
          iconName = 'ios-checkmark'
        } else {
          backgroundColor = 'rgba(190,190,190,1)'
          iconName = 'ios-add'
        }

        rows.push(
          <View key={i} style={{ paddingRight: 5, marginBottom: 8 }}>
            <TouchableOpacity onPress={() => this.formChangeHandler(this.state.industryOptions[industryIndex].value, 'targetIndustries')}>
              <View style={{ paddingTop: 5, paddingBottom: 5, paddingRight: 10, paddingLeft: 10, backgroundColor: backgroundColor, borderRadius: 10, borderWidth: 1, borderColor: 'rgba(1,1,1,0)' }}>
                <View style={{ flex: 1, flexDirection: 'row'}}>
                  <Text style={{ color: 'white'}}>{this.state.industryOptions[i - 1].value}</Text>
                  <View style={{ width: 10, height: 3 }}/>
                  <Icon name={iconName} size={15} color='white' />
                </View>
              </View>
            </TouchableOpacity>
          </View>
        )
      }
    }

    return rows
  }

  renderSwiperViews() {
    console.log('renderSwiperViews called')

    if (this.state.orgMode) {

      if (this.state.activeOrg === 'bixel') {
        return (
          <Swiper style={styles.wrapper} key={0} loop={false}>
            <View style={styles.slide}>
              <ScrollView>
                <ImageBackground resizeMode='cover' source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-landscape-image.png'}} style={{ width: null, height: 150, backgroundColor: '#EBEBEB', flexDirection: 'row', alignItems: 'flex-end' }}>
                  <View style={{ flex: 1, padding: 20, flexDirection: 'row' }}>
                    <Image source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/guided-compass-image-logo.png'}} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: 30, height: 50 }}>
                      <Icon name={'ios-add'} size={25} color="white" />
                    </View>
                    <Image source={{uri: this.state.orgLogoURI }} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                  </View>
                </ImageBackground>
                <View style={{ height: 30 }}/>

                <View style={{ paddingLeft: 40, paddingRight: 40 }}>
                  <Text style={styles.sliderHeaderText}>Welcome to the {this.state.orgName} Portal!</Text>
                  <View style={{ height: 30 }}/>
                  <View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                        <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                      </View>
                      <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 22 }}>Add profile info</Text>
                      </View>
                    </View>
                    <View style={{ height: 15 }}/>
                    <View style={{ flex: 1, flexDirection: 'row'}}>
                      <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                        <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                      </View>
                      <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 22 }}>Take career assessments</Text>
                      </View>
                    </View>
                    <View style={{ height: 15 }}/>

                    <View style={{ flex: 1, flexDirection: 'row'}}>
                      <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                        <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                      </View>
                      <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 22 }}>Request and receive endorsements</Text>
                      </View>
                    </View>
                    <View style={{ height: 15 }}/>

                    <View style={{ flex: 1, flexDirection: 'row'}}>
                      <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                        <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                      </View>
                      <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 22 }}>Apply to {this.state.orgName}</Text>
                      </View>
                    </View>
                    <View style={{ height: 15 }}/>

                    <View style={{ flex: 1, flexDirection: 'row'}}>
                      <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                        <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                      </View>
                      <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 22 }}>Match to tech internships</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ height: 10 }}/>
              </ScrollView>
            </View>
            <View style={styles.slide}>
              <View>
                <ScrollView>
                  <ImageBackground resizeMode='cover' source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-landscape-image.png'}} style={{ width: null, height: 150, backgroundColor: '#EBEBEB', flexDirection: 'row', alignItems: 'flex-end' }}>
                    <View style={{ flex: 1, padding: 20, flexDirection: 'row' }}>
                      <Image source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/guided-compass-image-logo.png'}} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                      <View style={{ alignItems: 'center', justifyContent: 'center', width: 30, height: 50 }}>
                        <Icon name={'ios-add'} size={25} color="white" />
                      </View>
                      <Image source={{uri: this.state.orgLogoURI }} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                    </View>
                  </ImageBackground>
                  <View style={{ height: 30 }}/>
                  <View style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 40, flex: 1 }}>
                    <Text style={styles.sliderHeaderText}>Add Some Basic Info</Text>
                    <View style={{ height: 30 }}/>
                    <KeyboardAvoidingView style={styles.textInputContainer} behavior="padding">

                      {(this.state.orgFocus === 'Placement' || this.state.orgFocus === 'School') && (
                        <View>
                          <View>
                            <Text style={styles.categoryTitle}>{this.state.activeOrg.toUpperCase()} Career Track</Text>
                            <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.careerTrack} data={this.state.careerTrackOptions} onChangeText={(value) => this.formChangeHandler(value, 'careerTrack')}/>
                          </View>

                          <View style={{ height: 20 }}/>
                          <View style={{ height: 5, borderBottomWidth: 1, borderBottomColor: 'grey' }}/>
                          <View style={{ height: 15 }}/>
                        </View>
                      )}
                      {/*
                      <Text style={styles.categoryTitle}>Target Function</Text>
                      <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.targetFunction} data={this.state.functionOptions} onChangeText={(value) => this.formChangeHandler(value, 'targetFunction')}/>

                      <View style={{ height: 5 }}/>

                      <Text style={styles.categoryTitle}>Target Industry</Text>
                      <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.targetIndustry} data={this.state.industryOptions} onChangeText={(value) => this.formChangeHandler(value, 'targetIndustry')}/>
                      */}
                      <Text style={{ fontSize: 14 }}>Job Functions of Interest<Text style={{ color: 'orange', fontWeight: 'bold'}}>*</Text></Text>
                      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                        {this.renderTags('function')}
                      </View>

                      <View style={{ height: 15 }}/>

                      <Text style={{ fontSize: 14 }}>Industries of Interest<Text style={{ color: 'orange', fontWeight: 'bold'}}>*</Text></Text>
                      <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                        {this.renderTags('industry')}
                      </View>

                      <View style={{ height: 5 }}/>

                      <Text style={styles.categoryTitle}>Educational Fields of Interest</Text>
                      <TextInput
                        style={styles.textArea}
                        onChangeText={(text) => this.setState({ studyFields: text, formHasChanged: true })}
                        value={this.state.studyFields}
                        autoCapitalize="none"
                        placeholder="list majors, minors, and fields of study separated by commas"
                        placeholderTextColor="grey"
                        multiline={true}
                        numberOfLines={4}
                      />

                      <View style={{ height: 5 }}/>

                      <Text style={styles.categoryTitle}>Career Fields of Interest</Text>
                      <TextInput
                        style={styles.textArea}
                        onChangeText={(text) => this.setState({ careerInterests: text, formHasChanged: true })}
                        value={this.state.careerInterests}
                        autoCapitalize="none"
                        placeholder="list career fields separated by commas"
                        placeholderTextColor="grey"
                        multiline={true}
                        numberOfLines={4}
                      />

                      <View style={{ height: 20 }}/>
                      <View style={{ height: 5, borderBottomWidth: 1, borderBottomColor: 'grey' }}/>
                      <View style={{ height: 20 }}/>
                      <Text style={{ fontSize: 22, color: '#6E6E6E'}}>Education Info</Text>
                      <View style={{ height: 10 }}/>

                        <Text style={styles.categoryTitle}>School Name</Text>
                        <View style={{ height: 3 }}/>
                        <TextInput
                          style={styles.textInput}
                          onChangeText={(text) => this.setState({school: text, formHasChanged: true})}
                          value={this.state.school}
                          autoCorrect={false}
                          placeholder="school name*"
                          placeholderTextColor="#6E6E6E"
                        />

                        <Text style={styles.categoryTitle}>Degree Type</Text>
                        <View style={{ height: 3 }}/>
                        <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.degree} data={this.state.degreeOptions} onChangeText={(value) => this.formChangeHandler(value, 'degree')}/>

                        <Text style={styles.categoryTitle}>Graduation Year</Text>
                        <View style={{ height: 3 }}/>
                        <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.gradYear} data={this.state.gradYearOptions} onChangeText={(value) => this.formChangeHandler(value, 'gradYear')}/>

                    </KeyboardAvoidingView>
                  </View>

                  <View style={{ height: 250 }}/>
                </ScrollView>
                <View style={{ height: 250 }}/>
              </View>
            </View>
            <View style={styles.slide}>
              <ScrollView>
                <ImageBackground resizeMode='cover' source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-landscape-image.png'}} style={{ width: null, height: 150, backgroundColor: '#EBEBEB', flexDirection: 'row', alignItems: 'flex-end' }}>
                  <View style={{ flex: 1, padding: 20, flexDirection: 'row' }}>
                    <Image source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/guided-compass-image-logo.png'}} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: 30, height: 50 }}>
                      <Icon name={'ios-add'} size={25} color="white" />
                    </View>
                    <Image source={{uri: this.state.orgLogoURI }} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                  </View>
                </ImageBackground>
                <View style={{ height: 30 }}/>
                <View style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 40, flex: 1 }}>
                  <Text style={styles.sliderHeaderText}>Add Some Details</Text>
                  <View style={{ height: 30 }}/>

                  <Text style={{ fontSize: 22, color: '#6E6E6E'}}>Personal Info</Text>
                  <View style={{ height: 10 }}/>
                  <KeyboardAvoidingView style={styles.textInputContainer} behavior="padding">
                    <Text style={styles.categoryTitle}>Phone Number</Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.setState({phoneNumber: text, formHasChanged: true })}
                      value={this.state.phoneNumber}
                      autoCapitalize="none"
                      placeholder="555-555-5555"
                      placeholderTextColor="grey"
                      keyboardType = "number-pad"
                    />

                    <Text style={styles.categoryTitle}>Date of Birth</Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.formChangeHandler(text,"dateOfBirth")}
                      value={this.state.dateOfBirth}
                      autoCapitalize="none"
                      placeholder="05/05/2002"
                      placeholderTextColor="grey"
                      keyboardType = "number-pad"
                    />

                    <Text style={styles.categoryTitle}>LinkedIn URL</Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.setState({linkedInURL: text, formHasChanged: true })}
                      value={this.state.linkedInURL}
                      autoCapitalize="none"
                      placeholder="linkedin url"
                      placeholderTextColor="grey"
                    />

                    <Text style={styles.categoryTitle}>Resume URL</Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.setState({resumeURL: text, formHasChanged: true })}
                      value={this.state.resumeURL}
                      autoCapitalize="none"
                      placeholder="resume url"
                      placeholderTextColor="grey"
                    />

                    <Text style={styles.categoryTitle}>Portfolio Website URL</Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.setState({customWebsiteURL: text, formHasChanged: true })}
                      value={this.state.customWebsiteURL}
                      autoCapitalize="none"
                      placeholder="portfolio website url"
                      placeholderTextColor="grey"
                    />

                    <View style={{ height: 20 }}/>
                    <View style={{ height: 5, borderBottomWidth: 1, borderBottomColor: 'grey' }}/>
                    <View style={{ height: 25 }}/>

                    <Text style={{ fontSize: 22, color: '#6E6E6E'}}>Self-Identification Info</Text>
                    <View style={{ height: 10 }}/>

                    <Text style={styles.categoryTitle}>Race</Text>
                    <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.race} data={this.state.raceOptions} onChangeText={(value) => this.formChangeHandler(value, 'race')}/>
                    <View style={{ height: 10 }}/>
                    <Text style={styles.categoryTitle}>Gender</Text>
                    <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.gender} data={this.state.genderOptions} onChangeText={(value) => this.formChangeHandler(value, 'gender')}/>
                    <View style={{ height: 10 }}/>
                    <Text style={styles.categoryTitle}>Veteran Status</Text>
                    <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.veteran} data={this.state.veteranOptions} onChangeText={(value) => this.formChangeHandler(value, 'veteran')}/>
                    <View style={{ height: 10 }}/>
                    <Text style={styles.categoryTitle}>Work Authorization Status</Text>
                    <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.workAuthorization} data={this.state.workAuthorizationOptions} onChangeText={(value) => this.formChangeHandler(value, 'workAuthorization')}/>

                  </KeyboardAvoidingView>
                  <View style={{ height: 250 }}/>
                </View>
              </ScrollView>
            </View>
            <View style={styles.slide}>
              <ScrollView>
                <ImageBackground resizeMode='cover' source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-landscape-image.png'}} style={{ width: null, height: 150, backgroundColor: '#EBEBEB', flexDirection: 'row', alignItems: 'flex-end' }}>
                  <View style={{ flex: 1, padding: 20, flexDirection: 'row' }}>
                    <Image source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/guided-compass-image-logo.png'}} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: 30, height: 50 }}>
                      <Icon name={'ios-add'} size={25} color="white" />
                    </View>
                    <Image source={{uri: this.state.orgLogoURI }} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                  </View>
                </ImageBackground>
                <View style={{ height: 30 }}/>
                <View style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 40, flex: 1 }}>
                  <Text style={styles.sliderHeaderText}>Get Started</Text>
                  <View style={{ height: 30 }}/>

                  <TouchableOpacity onPress={() => this.saveProfile("Inputs")}>
                    <View style={{ height: 20 }}/>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 95 }}>
                        <Text style={{ fontSize: 20 }}>Take core career assessments</Text>
                      </View>
                      <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                        <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                      </View>
                    </View>
                    <View style={{ height: 20 }}/>
                  </TouchableOpacity>

                  <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>


                  <TouchableOpacity onPress={() => this.saveProfile("Endorsements")}>
                    <View style={{ height: 20 }}/>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 95 }}>
                        <Text style={{ fontSize: 20 }}>Get endorsements (optional)</Text>
                      </View>
                      <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                        <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                      </View>
                    </View>
                    <View style={{ height: 20 }}/>
                  </TouchableOpacity>

                  <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>

                  <TouchableOpacity onPress={() => this.saveProfile("WorkDetails")}>
                    <View style={{ height: 20 }}/>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 95 }}>
                        <Text style={{ fontSize: 20 }}>Apply to {this.state.orgName}</Text>
                      </View>
                      <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                        <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                      </View>
                    </View>
                    <View style={{ height: 20 }}/>
                  </TouchableOpacity>

                  <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>


                  <View style={{ height: 50 }}/>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => this.saveProfile('Home')}>
                      <View style={styles.primaryButtonView}>
                        <Text style={styles.primaryButtonText}>Go to Home</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {(this.state.errorMessage !== "") && (<Text style={styles.errorMessage}>{this.state.errorMessage}</Text>)}
                </View>
              </ScrollView>
            </View>
          </Swiper>
        )

      } else {
        return (
          <Swiper style={styles.wrapper} key={0}>
            <View style={styles.slide}>
              <ScrollView>
                <ImageBackground resizeMode='cover' source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-landscape-image.png'}} style={{ width: null, height: 150, backgroundColor: '#EBEBEB', flexDirection: 'row', alignItems: 'flex-end' }}>
                  <View style={{ flex: 1, padding: 20, flexDirection: 'row' }}>
                    <Image source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/guided-compass-image-logo.png'}} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: 30, height: 50 }}>
                      <Icon name={'ios-add'} size={25} color="white" />
                    </View>
                    <Image source={{uri: this.state.orgLogoURI }} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                  </View>
                </ImageBackground>
                <View style={{ height: 30 }}/>

                <View style={{ paddingLeft: 40, paddingRight: 40 }}>
                  <Text style={styles.sliderHeaderText}>Welcome to the {this.state.orgName} Portal!</Text>
                  <View style={{ height: 30 }}/>
                  <View>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                        <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                      </View>
                      <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 22 }}>Collaborate with mentor coaches</Text>
                      </View>
                    </View>
                    <View style={{ height: 15 }}/>
                    <View style={{ flex: 1, flexDirection: 'row'}}>
                      <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                        <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                      </View>
                      <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 22 }}>Take and store career assessments</Text>
                      </View>
                    </View>
                    <View style={{ height: 15 }}/>

                    <View style={{ flex: 1, flexDirection: 'row'}}>
                      <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                        <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                      </View>
                      <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 22 }}>Explore and clarify career goals</Text>
                      </View>
                    </View>
                    <View style={{ height: 15 }}/>

                    <View style={{ flex: 1, flexDirection: 'row'}}>
                      <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                        <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                      </View>
                      <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 22 }}>Request and receive endorsements</Text>
                      </View>
                    </View>
                    <View style={{ height: 15 }}/>

                    <View style={{ flex: 1, flexDirection: 'row'}}>
                      <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                        <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                      </View>
                      <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                        <Text style={{ fontSize: 22 }}>Match to internship opportunities</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={{ height: 10 }}/>
              </ScrollView>
            </View>
            <View style={styles.slide}>
              <ScrollView>
                <ImageBackground resizeMode='cover' source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-landscape-image.png'}} style={{ width: null, height: 150, backgroundColor: '#EBEBEB', flexDirection: 'row', alignItems: 'flex-end' }}>
                  <View style={{ flex: 1, padding: 20, flexDirection: 'row' }}>
                    <Image source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/guided-compass-image-logo.png'}} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                    <View style={{ alignItems: 'center', justifyContent: 'center', width: 30, height: 50 }}>
                      <Icon name={'ios-add'} size={25} color="white" />
                    </View>
                    <Image source={{uri: this.state.orgLogoURI }} style={{ width: 50, height: 50, resizeMode: 'contain'}} />
                  </View>
                </ImageBackground>
                <View style={{ height: 30 }}/>

                <View style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 40, flex: 1 }}>
                  <Text style={styles.sliderHeaderText}>Add Some Basic Info</Text>
                  <View style={{ height: 30 }}/>
                  <KeyboardAvoidingView style={styles.textInputContainer} behavior="padding">
                    {(this.state.orgFocus === 'Mentor') && (
                      <View>
                        <View>
                          <Text style={styles.categoryTitle}>{this.state.activeOrg.toUpperCase()} Career Track</Text>
                          <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.careerTrack} data={this.state.careerTrackOptions} onChangeText={(value) => this.formChangeHandler(value, 'careerTrack')}/>
                        </View>

                        <View style={{ height: 5 }}/>

                        <View>
                          <Text style={styles.categoryTitle}>{this.state.activeOrg.toUpperCase()} Cohort</Text>
                          <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.cohortYear} data={this.state.numberOptions} onChangeText={(value) => this.formChangeHandler(value, 'cohortYear')}/>
                        </View>

                        <View style={{ height: 5 }}/>

                        <View>
                          <Text style={styles.categoryTitle}>{this.state.activeOrg.toUpperCase()} Mentor Coach First Name</Text>
                          <View style={{ height: 3 }}/>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.setState({mentorCoachFirstName: text, formHasChanged: true})}
                            value={this.state.mentorCoachFirstName}
                            autoCorrect={false}
                            placeholder="mentor coach first name*"
                            placeholderTextColor="#6E6E6E"
                          />
                        </View>

                        <View style={{ height: 5 }}/>

                        <View>
                          <Text style={styles.categoryTitle}>{this.state.activeOrg.toUpperCase()} Mentor Coach Last Name</Text>
                          <View style={{ height: 3 }}/>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.setState({mentorCoachLastName: text, formHasChanged: true})}
                            value={this.state.mentorCoachLastName}
                            autoCorrect={false}
                            placeholder="mentor coach last name*"
                            placeholderTextColor="#6E6E6E"
                          />
                        </View>

                        <View style={{ height: 5 }}/>

                        <View>
                          <Text style={styles.categoryTitle}>{this.state.activeOrg.toUpperCase()} Mentor Coach Email</Text>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.setState({mentorCoachEmail: text, formHasChanged: true})}
                            value={this.state.mentorCoachEmail}
                            autoCorrect={false}
                            autoCapitalize="none"
                            placeholder="mentor coach email*"
                            placeholderTextColor="#6E6E6E"
                          />
                        </View>

                        <View style={{ height: 20 }}/>
                        <View style={{ height: 5, borderBottomWidth: 1, borderBottomColor: 'grey' }}/>
                        <View style={{ height: 15 }}/>
                      </View>
                    )}

                    <View style={{ height: 5 }}/>

                    <Text style={{ fontSize: 14 }}>Job Functions of Interest<Text style={{ color: 'orange', fontWeight: 'bold'}}>*</Text></Text>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                      {this.renderTags('function')}
                    </View>

                    <View style={{ height: 15 }}/>

                    <Text style={{ fontSize: 14 }}>Industries of Interest<Text style={{ color: 'orange', fontWeight: 'bold'}}>*</Text></Text>
                    <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                      {this.renderTags('industry')}
                    </View>
                    {/*
                    <Text style={styles.categoryTitle}>Target Function</Text>
                    <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.targetFunction} data={this.state.functionOptions} onChangeText={(value) => this.formChangeHandler(value, 'targetFunction')}/>

                    <View style={{ height: 5 }}/>

                    <Text style={styles.categoryTitle}>Target Industry</Text>
                    <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.targetIndustry} data={this.state.industryOptions} onChangeText={(value) => this.formChangeHandler(value, 'targetIndustry')}/>
                    */}
                    <View style={{ height: 5 }}/>

                    <Text style={styles.categoryTitle}>Educational Fields of Interest</Text>
                    <View style={{ height: 3 }}/>
                    <TextInput
                      style={styles.textArea}
                      onChangeText={(text) => this.setState({ studyFields: text, formHasChanged: true })}
                      value={this.state.studyFields}
                      autoCapitalize="none"
                      placeholder="list majors, minors, and fields of study separated by commas"
                      placeholderTextColor="grey"
                      multiline={true}
                      numberOfLines={4}
                    />

                    <View style={{ height: 5 }}/>

                    <Text style={styles.categoryTitle}>Career Fields of Interest</Text>
                    <View style={{ height: 3 }}/>
                    <TextInput
                      style={styles.textArea}
                      onChangeText={(text) => this.setState({ careerInterests: text, formHasChanged: true })}
                      value={this.state.careerInterests}
                      autoCapitalize="none"
                      placeholder="list career fields separated by commas"
                      placeholderTextColor="grey"
                      multiline={true}
                      numberOfLines={4}
                    />

                    <View style={{ height: 20 }}/>
                    <View style={{ height: 5, borderBottomWidth: 1, borderBottomColor: 'grey' }}/>
                    <View style={{ height: 20 }}/>
                    <Text style={{ fontSize: 22, color: '#6E6E6E'}}>Education Info</Text>

                    <View style={{ height: 10 }}/>

                    <Text style={styles.categoryTitle}>School Name</Text>
                    <View style={{ height: 3 }}/>

                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.setState({school: text, formHasChanged: true})}
                      value={this.state.school}
                      autoCorrect={false}
                      placeholder="school name*"
                      placeholderTextColor="#6E6E6E"
                    />

                    <View style={{ height: 5 }}/>

                    <Text style={styles.categoryTitle}>Degree Type</Text>
                    <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.degree} data={this.state.degreeOptions} onChangeText={(value) => this.formChangeHandler(value, 'degree')}/>

                    <View style={{ height: 5 }}/>

                    <Text style={styles.categoryTitle}>Graduation Year</Text>
                    <View style={{ height: 3 }}/>
                    <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.gradYear} data={this.state.gradYearOptions} onChangeText={(value) => this.formChangeHandler(value, 'gradYear')}/>

                  </KeyboardAvoidingView>
                </View>
                <View style={{ height: 250 }}/>
              </ScrollView>
            </View>
            <View style={styles.slide}>
              <View>
                <ScrollView>
                  <Image source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/process-header-image.png'}} style={styles.headerImage}/>
                  <View style={{ height: 30 }}/>
                  <View style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 40, flex: 1 }}>
                    <Text style={styles.sliderHeaderText}>Get Started</Text>
                    <View style={{ height: 30 }}/>

                    <TouchableOpacity onPress={() => this.saveProfile("AddAdvisors")}>
                      <View style={{ height: 20 }}/>
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 95 }}>
                          <Text style={{ fontSize: 20 }}>Add mentor coaches</Text>
                        </View>
                        <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                          <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                        </View>
                      </View>
                      <View style={{ height: 20 }}/>
                    </TouchableOpacity>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>

                    <TouchableOpacity onPress={() => this.saveProfile("Inputs")}>
                      <View style={{ height: 20 }}/>
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 95 }}>
                          <Text style={{ fontSize: 20 }}>Take core career assessments</Text>
                        </View>
                        <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                          <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                        </View>
                      </View>
                      <View style={{ height: 20 }}/>
                    </TouchableOpacity>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>

                    <TouchableOpacity onPress={() => this.saveProfile("Advising")}>
                      <View style={{ height: 20 }}/>
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 95 }}>
                          <Text style={{ fontSize: 20 }}>Log sessions and tasks</Text>
                        </View>
                        <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                          <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                        </View>
                      </View>
                      <View style={{ height: 20 }}/>
                    </TouchableOpacity>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>

                    <TouchableOpacity onPress={() => this.saveProfile("Endorsements")}>
                      <View style={{ height: 20 }}/>
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 95 }}>
                          <Text style={{ fontSize: 20 }}>Get endorsements (optional)</Text>
                        </View>
                        <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                          <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                        </View>
                      </View>
                      <View style={{ height: 20 }}/>
                    </TouchableOpacity>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>

                    <TouchableOpacity onPress={() => this.saveProfile("Work")}>
                      <View style={{ height: 20 }}/>
                      <View style={{ flex: 1, flexDirection: 'row' }}>
                        <View style={{ flex: 95 }}>
                          <Text style={{ fontSize: 20 }}>Apply to work opportunities</Text>
                        </View>
                        <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                          <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                        </View>
                      </View>
                      <View style={{ height: 20 }}/>
                    </TouchableOpacity>

                    <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>


                    <View style={{ height: 50 }}/>
                    <View style={styles.buttonContainer}>
                      <TouchableOpacity onPress={() => this.saveProfile('Home')}>
                        <View style={styles.primaryButtonView}>
                          <Text style={styles.primaryButtonText}>Go to Home</Text>
                        </View>
                      </TouchableOpacity>
                    </View>

                    {(this.state.errorMessage !== "") && (<Text style={styles.errorMessage}>{this.state.errorMessage}</Text>)}
                  </View>
                </ScrollView>
              </View>
            </View>
          </Swiper>
        )
      }

    } else {

      return (
        <Swiper style={styles.wrapper} key={0}>
          <View style={styles.slide}>
            <Image source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-landscape-image.png'}} style={styles.headerImage}/>

            <View style={{ height: 30 }}/>
            <View style={{ flex: 1, paddingLeft: 40, paddingRight: 40 }}>
              <Text style={styles.sliderHeaderText}>Welcome to Guided Compass!</Text>
              <View style={{ height: 30 }}/>
              <View style={{ flex: 1 }}>
                <View style={{ flex: 1, flexDirection: 'row' }}>
                  <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                    <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                  </View>
                  <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                    <Text style={{ fontSize: 22 }}>Take & store career assessments</Text>
                  </View>
                </View>
                <View style={{ height: 10 }}/>
                <View style={{ flex: 1, flexDirection: 'row'}}>
                  <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                    <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                  </View>
                  <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                    <Text style={{ fontSize: 22 }}>Request & receive endorsements</Text>
                  </View>
                </View>
                <View style={{ height: 10 }}/>

                <View style={{ flex: 1, flexDirection: 'row'}}>
                  <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                    <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                  </View>
                  <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                    <Text style={{ fontSize: 22 }}>Collaborate with mentors</Text>
                  </View>
                </View>
                <View style={{ height: 10 }}/>

                <View style={{ flex: 1, flexDirection: 'row'}}>
                  <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                    <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                  </View>
                  <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                    <Text style={{ fontSize: 22 }}>Match to career pathways</Text>
                  </View>
                </View>
                <View style={{ height: 10 }}/>

                <View style={{ flex: 1, flexDirection: 'row'}}>
                  <View style={{ flex: 10, alignItems: 'flex-end', paddingRight: 10 }}>
                    <Icon name={'ios-checkmark-circle-outline'} size={40} color="#87CEFA" />
                  </View>
                  <View style={{ flex: 90, paddingTop: 4, paddingLeft: 10 }}>
                    <Text style={{ fontSize: 22 }}>Match to internships</Text>
                  </View>
                </View>
              </View>
            </View>
            <View style={{ height: 10 }}/>
          </View>
          <View style={styles.slide}>
            <ScrollView>
              <Image source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-landscape-image.png'}} style={styles.headerImage}/>
              <View style={{ height: 30 }}/>
              <View style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 40, flex: 1 }}>
                <Text style={styles.sliderHeaderText}>Add Some Basic Info</Text>
                <View style={{ height: 30 }}/>
                <KeyboardAvoidingView style={styles.textInputContainer} behavior="padding">

                  <Text style={{ fontSize: 14 }}>Job Functions of Interest<Text style={{ color: 'orange', fontWeight: 'bold'}}>*</Text></Text>
                  <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                    {this.renderTags('function')}
                  </View>

                  <View style={{ height: 15 }}/>

                  <Text style={{ fontSize: 14 }}>Industries of Interest<Text style={{ color: 'orange', fontWeight: 'bold'}}>*</Text></Text>
                  <View style={{ flex: 1, flexDirection: 'row', flexWrap: 'wrap', marginTop: 10 }}>
                    {this.renderTags('industry')}
                  </View>

                  {/*
                  <Text style={styles.categoryTitle}>Target Function</Text>
                  <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.targetFunction} data={this.state.functionOptions} onChangeText={(value) => this.formChangeHandler(value, 'targetFunction')}/>

                  <View style={{ height: 5 }}/>

                  <Text style={styles.categoryTitle}>Target Industry</Text>
                  <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.targetIndustry} data={this.state.industryOptions} onChangeText={(value) => this.formChangeHandler(value, 'targetIndustry')}/>
                  */}

                  <View style={{ height: 5 }}/>

                  <Text style={styles.categoryTitle}>Educational Fields of Interest</Text>
                  <TextInput
                    style={styles.textArea}
                    onChangeText={(text) => this.setState({ studyFields: text, formHasChanged: true })}
                    value={this.state.studyFields}
                    autoCapitalize="none"
                    placeholder="list majors, minors, and fields of study separated by commas"
                    placeholderTextColor="grey"
                    multiline={true}
                    numberOfLines={4}
                  />

                  <View style={{ height: 5 }}/>

                  <Text style={styles.categoryTitle}>Career Fields of Interest</Text>
                  <TextInput
                    style={styles.textArea}
                    onChangeText={(text) => this.setState({ careerInterests: text, formHasChanged: true })}
                    value={this.state.careerInterests}
                    autoCapitalize="none"
                    placeholder="list career fields separated by commas"
                    placeholderTextColor="grey"
                    multiline={true}
                    numberOfLines={4}
                  />

                  <View style={{ height: 20 }}/>
                  <View style={{ height: 5, borderBottomWidth: 1, borderBottomColor: 'grey' }}/>
                  <View style={{ height: 20 }}/>
                  <Text style={{ fontSize: 22, color: '#6E6E6E'}}>Education Info</Text>
                  <View style={{ height: 10 }}/>

                    <Text style={styles.categoryTitle}>School Name</Text>
                    <View style={{ height: 3 }}/>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.setState({school: text, formHasChanged: true})}
                      value={this.state.school}
                      autoCorrect={false}
                      placeholder="school name*"
                      placeholderTextColor="#6E6E6E"
                    />

                    <Text style={styles.categoryTitle}>Degree Type</Text>
                    <View style={{ height: 3 }}/>
                    <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.degree} data={this.state.degreeOptions} onChangeText={(value) => this.formChangeHandler(value, 'degree')}/>

                    <Text style={styles.categoryTitle}>Graduation Year</Text>
                    <View style={{ height: 3 }}/>
                    <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.gradYear} data={this.state.gradYearOptions} onChangeText={(value) => this.formChangeHandler(value, 'gradYear')}/>

                </KeyboardAvoidingView>
              </View>
              <View style={{ height: 250 }}/>
            </ScrollView>
          </View>
          <View style={styles.slide}>
            <View>
              <ScrollView>
                <Image source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/process-header-image.png'}} style={styles.headerImage}/>
                <View style={{ height: 30 }}/>
                <View style={{ paddingLeft: 40, paddingRight: 40, paddingBottom: 40, flex: 1 }}>
                  <Text style={styles.sliderHeaderText}>Get Started</Text>
                  <View style={{ height: 30 }}/>

                  <TouchableOpacity onPress={() => this.saveProfile("Inputs")}>
                    <View style={{ height: 20 }}/>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 95 }}>
                        <Text style={{ fontSize: 20 }}>Take core career assessments</Text>
                      </View>
                      <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                        <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                      </View>
                    </View>
                    <View style={{ height: 20 }}/>
                  </TouchableOpacity>

                  <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>

                  <TouchableOpacity onPress={() => this.saveProfile("Endorsements")}>
                    <View style={{ height: 20 }}/>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 95 }}>
                        <Text style={{ fontSize: 20 }}>Get endorsements (optional)</Text>
                      </View>
                      <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                        <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                      </View>
                    </View>
                    <View style={{ height: 20 }}/>
                  </TouchableOpacity>

                  <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>

                  <TouchableOpacity onPress={() => this.saveProfile("Work")}>
                    <View style={{ height: 20 }}/>
                    <View style={{ flex: 1, flexDirection: 'row' }}>
                      <View style={{ flex: 95 }}>
                        <Text style={{ fontSize: 20 }}>Apply to work opportunities</Text>
                      </View>
                      <View style={{ flex: 5, alignItems: 'flex-end', marginTop: 3 }}>
                        <Icon name={'ios-arrow-forward'} size={25} color="#6E6E6E" />
                      </View>
                    </View>
                    <View style={{ height: 20 }}/>
                  </TouchableOpacity>

                  <View style={{ borderBottomWidth: 1, borderBottomColor: 'grey', height: 1 }}/>


                  <View style={{ height: 50 }}/>
                  <View style={styles.buttonContainer}>
                    <TouchableOpacity onPress={() => this.saveProfile('Home')}>
                      <View style={styles.primaryButtonView}>
                        <Text style={styles.primaryButtonText}>Go to Home</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  {(this.state.errorMessage !== "") && (<Text style={styles.errorMessage}>{this.state.errorMessage}</Text>)}
                </View>
              </ScrollView>
            </View>
          </View>
        </Swiper>
      )
    }
  }

  render() {

    return this.renderSwiperViews()
  }

}

export default WalkthroughScreen;

const styles = StyleSheet.create({
  wrapper: {
  },
  slide: {
    flex: 1,
    backgroundColor: '#fff'
  },
  text: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
  },
  headerImage: {
    width: null,
    height: 200
  },
  headerText: {
    fontSize: 30,
    fontWeight: 'bold',
    color: 'rgba(78,78,78,1)',
    textAlign: 'center',
    paddingBottom: 5
  },
  bodyContainer: {
    flex: 1,
    paddingLeft: 40,
    paddingRight: 40,
    paddingBottom: 50,
  },
  quote1: {
    fontSize: 24,
    fontStyle: 'italic',
    color: 'rgba(115,186,230,1)',
    textAlign: 'left',
    marginBottom: 15
  },
  citation1: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'rgba(115,186,230,1)',
    textAlign: 'left'
  },
  quote2: {
    fontSize: 24,
    fontStyle: 'italic',
    color: 'rgba(115,186,230,1)',
    textAlign: 'right',
    marginBottom: 15
  },
  citation2: {
    fontSize: 16,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'rgba(115,186,230,1)',
    textAlign: 'right'
  },
  horizontalLine: {
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(190,190,190,1)',
    marginTop: 30,
    marginBottom: 30
  },
  descriptionText: {
    fontSize: 16,
    color: 'rgba(180,180,180, 1)'
  },
  subheaderText: {
    fontSize: 22,
    fontStyle: 'italic',
    fontWeight: 'bold',
    color: 'rgba(115,186,230,1)',
    paddingBottom: 5
  },
  headerContainer: {
    marginTop: 20,
    marginBottom: 20,
    paddingLeft: 40,
    paddingRight: 40
  },
  questionContainer: {
    marginTop: 5,
    marginBottom: 5,
  },
  assessmentButtonView: {
    width: 200,
    height: 34,
    backgroundColor: '#87CEFA',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  assessmentButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 16
  },
  primaryButtonView: {
    width: 200,
    paddingLeft: 20,
    paddingRight: 20,
    paddingTop: 8,
    paddingBottom: 8,
    backgroundColor: '#87CEFA',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5
  },
  primaryButtonText: {
    color: '#fff',
    textAlign: 'center',
    fontSize: 22
  },
  secondaryButtonView: {
    width: 155,
    height: 34,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#87CEFA',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 5
  },
  secondaryButtonText: {
    color: '#87CEFA',
    textAlign: 'center',
    fontSize: 16
  },
  rowContainer: {
    flexDirection: 'row'
  },
  buttonContainer: {
    flexDirection: 'row',
    flex: 1,
    alignItems: 'center'
  },
  descriptionContainer: {
    marginTop: 15,
    marginBottom: 25
  },
  textInput: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 20,
    paddingLeft: 10,
    paddingRight: 10
  },
  successMessage: {
    fontSize: 20,
    color: '#73BAE6',
    marginTop: 5
  },
  errorMessage: {
    fontSize: 20,
    color: '#FF8C00',
  },
  textInput: {
    height: 40,
    width: '100%',
    backgroundColor: '#fff',
    borderColor: '#4E4E4E',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  textInputContainer: {
    flex: 1
  },
  categoryTitle: {
    fontSize: 16,
    color: '#969696'
  },
  textArea: {
    height: 80,
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  sliderHeaderText: {
    fontSize: 26, color: '#6E6E6E'
  }
})
