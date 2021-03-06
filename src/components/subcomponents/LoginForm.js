import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, ImageBackground, Platform, Linking, TextInput, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Switch } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';

const employersIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/employer-icon.png';
const questionMarkBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/question-mark-blue.png';
const logoImg = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/Compass-logo-words.png';
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon-white.png';
const dropdownArrow = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png";
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';

import SubPicker from '../common/SubPicker';

class LogInForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roleName: 'Student / Career Seeker',
      rolesSupported: ['Student','Student / Career Seeker','Admin'],
      unsupportedRoleErrorMessage: 'The mobile app currently only supports students / career seekers. You can sign up for the web portal here: https://www.guidedcompass.com/join',
      firstName: '',
      lastName: '',
      username: '',
      email: '',
      password: '',
      gradYear: '',
      pathway: '',
      jobTitle: '',
      employerName: '',

      subscribed: true,
      mfaEnabled: false,

      employers: [],

      toggleLink: '/',

      gradYearOptions: [],
      pathwayOptions: [],
      roleNameOptions: [],
      acceptableRoles: ['','Student','Career-Seeker','School Support','Worker','Teacher','Counselor','WBLC','Mentor','Employer','Admin'],

      animate: false,
      opacity: 1,
      isWaiting: false,
      error: {
          message: ''
      }
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.searchEmployers = this.searchEmployers.bind(this)
    this.employerClicked = this.employerClicked.bind(this)
    this.signUp = this.signUp.bind(this)
    this.signIn = this.signIn.bind(this)
    this.completeSignIn = this.completeSignIn.bind(this)
    this.validateRoleName = this.validateRoleName.bind(this)
    this.itemClicked = this.itemClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.resendCode = this.resendCode.bind(this)
    this.submitCode = this.submitCode.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within login form ')

    if (this.props.roleName !== prevProps.roleName || this.props.orgCode !== prevProps.orgCode || this.props.courseId !== prevProps.courseId || this.props.workId !== prevProps.workId || this.props.fromExternal !== prevProps.fromExternal) {
      this.retrieveData()
    } else if (this.props.fromExternal !== prevProps.fromExternal) {
      this.retrieveData()
    } else if (this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData()
    } else if (this.props.opportunityId !== prevProps.opportunityId) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      // console.log('this is causing the error')
      // const emailId = await AsyncStorage.getItem('email')
      // const username = await AsyncStorage.getItem('username');
      // const cuFirstName = await AsyncStorage.getItem('firstName');
      // const cuLastName = await AsyncStorage.getItem('lastName');
      // const orgFocus = await AsyncStorage.getItem('orgFocus');
      // const orgName = await AsyncStorage.getItem('orgName');
      // const roleName = await AsyncStorage.getItem('roleName');
      // const remoteAuth = await AsyncStorage.getItem('remoteAuth');
      //
      // let activeOrg = await AsyncStorage.getItem('activeOrg')
      // if (!activeOrg) {
      //   activeOrg = 'guidedcompass'
      // }
      // //const email = 'harry@potter.com'
      // this.setState({ emailId, postsAreLoading: true })
      //
      // if (emailId !== null) {
      //   // We have data!!
      //   console.log('what is the email of this user', emailId);
      //
      //   this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
      //     roleName, activeOrg, orgFocus, orgName, remoteAuth
      //   })
      // }

      let verifyCode = await AsyncStorage.getItem('verifyCode')
      if (verifyCode && verifyCode === 'true') {
        const emailId = await AsyncStorage.getItem('email')
        const username = await AsyncStorage.getItem('username');
        const cuFirstName = await AsyncStorage.getItem('firstName');
        const cuLastName = await AsyncStorage.getItem('lastName');

        const showVerifyCode = true

        this.setState({ email, firstName, lastName, username, showVerifyCode })
      }

      let orgCode = this.props.orgCode
      const courseId = this.props.courseId
      const workId = this.props.workId
      const accountCode = this.props.accountCode
      let roleName = this.props.roleName
      const opportunityId = this.props.opportunityId

      // testing sort function for other components
      // let pastEvents = ['2021-10-28T16:00:00.000+00:00', new Date(), null,'2021-10-01T16:00:00.000+00:00', ]
      // pastEvents.sort(function(a,b) {
      //   let startDateString1 = a
      //   let startDateString2 = b
      //   if (startDateString1 && startDateString2) {
      //     let startDate1 = new Date(startDateString1)
      //     let startDate2 = new Date(startDateString2)
      //     return startDate2 - startDate1;
      //   } else if (startDateString1) {
      //     let startDate1 = new Date(startDateString1)
      //     let startDate2 = null
      //     return startDate1 - startDate2;
      //   } else if (startDateString2) {
      //     let startDate1 = null
      //     let startDate2 = new Date(startDateString2)
      //     return startDate2 - startDate1;
      //   } else {
      //     return null
      //   }
      // })
      // console.log('past Events: ', pastEvents)

      let toggleLink = ''
      if (this.props.type === 'SignUp') {
        toggleLink = 'SignIn'
      } else {
        toggleLink = 'SignUp'
      }

      Axios.get('https://www.guidedcompass.com/api/emails', { params: { orgCode } })
      .then((response) => {
        console.log('Emails query attempted');

          if (response.data.success) {
            console.log('emails query worked')

            const studentBenefits = response.data.benefits[0].studentBenefits
            const careerSeekerBenefits = response.data.benefits[0].studentBenefits
            const teacherBenefits = response.data.benefits[0].teacherBenefits
            const mentorBenefits = response.data.benefits[0].mentorBenefits
            const employerBenefits = response.data.benefits[0].employerBenefits

            this.setState({ studentBenefits, careerSeekerBenefits, teacherBenefits, mentorBenefits, employerBenefits });

          } else {
            console.log('emails query did not work', response.data.message)
          }

      }).catch((error) => {
          console.log('Emails query did not work for some reason', error);
      });

      if (roleName && orgCode) {
        roleName = roleName.charAt(0).toUpperCase() + roleName.slice(1)

        let isValid = false
        if (this.state.acceptableRoles.includes(roleName)) {
          if (orgCode !== '') {
            isValid = true
          }
        }

        let gradYearOptions = ['']
        const currentYear = new Date().getFullYear()
        for (let i = 1; i <= 5; i++) {

          gradYearOptions.push(currentYear + i - 1)
        }

        console.log('oppId 2: ', opportunityId)

        this.setState({ roleName, originalRoleName: true, orgCode, isValid, courseId, workId, opportunityId,
          accountCode, toggleLink, gradYearOptions })

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode} })
        .then((response) => {
          console.log('Org info query attempted', response.data);

            if (response.data.success) {
              console.log('org info query worked')

              const school = response.data.orgInfo.orgName
              const schoolDistrict = response.data.orgInfo.district
              const orgName = response.data.orgInfo.orgName
              const orgLogoURI = response.data.orgInfo.webLogoURI
              const headerImageURL = response.data.orgInfo.headerImageURL
              const orgFocus = response.data.orgInfo.orgFocus
              const publicOrg = response.data.orgInfo.isPublic
              const placementPartners = response.data.orgInfo.placementPartners

              let pathwayOptions = ['']
              let includePathway = false
              if (response.data.orgInfo.pathways && response.data.orgInfo.pathways.length > 0 && orgCode === 'dpscd') {
                pathwayOptions = pathwayOptions.concat(response.data.orgInfo.pathways)
                includePathway = true
              }

              this.setState({
                school, schoolDistrict, orgName, orgLogoURI, headerImageURL, orgFocus, pathwayOptions, includePathway,
                publicOrg, placementPartners
              });

            } else {
              console.log('org info query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
        });

        if (courseId) {
          Axios.get('https://www.guidedcompass.com/api/courses', { params: { courseIds: [courseId]} })
          .then((response) => {
            console.log('Course info query attempted', response.data);

              if (response.data.success) {
                console.log('course info query worked')

                if (response.data.courses && response.data.courses.length > 0) {
                  const courseName = response.data.courses[0].name
                  this.setState({ courseName })
                }

                // const school = response.data.orgInfo.orgName
                // const schoolDistrict = response.data.orgInfo.district
                // const orgName = response.data.orgInfo.orgName
                // const orgLogoURI = response.data.orgInfo.webLogoURI
                //
                // this.setState({ school, schoolDistrict, orgName, orgLogoURI });

              } else {
                console.log('course info query did not work', response.data.message)
              }

          }).catch((error) => {
              console.log('Course info query did not work for some reason', error);
          });
        }

      } else if (roleName) {
        // no orgCode
        this.setState({ roleName, originalRoleName: true, accountCode, toggleLink, orgCode, opportunityId })
      } else {
        // no orgCode or roleName

        const roleNameOptions = ['Student / Career Seeker','Teacher','Work-Based Learning Coordinator','Mentor','Employer Representative','Other']
        this.setState({ accountCode, toggleLink, orgCode, opportunityId, roleNameOptions })
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler(eventName,eventValue) {

    // this.setState({ selectedValue: eventValue })

    if (eventName === 'firstName') {
      let capitalizedFirstName = eventValue.charAt(0).toUpperCase() + eventValue.slice(1);
      this.setState({ firstName: capitalizedFirstName })
    } else if (eventName === 'lastName') {
      let capitalizedLastName = eventValue.charAt(0).toUpperCase() + eventValue.slice(1);
      this.setState({ lastName: capitalizedLastName})
    } else if (eventName === 'email') {
      this.setState({ email: eventValue })
    } else if (eventName === 'password') {
      this.setState({ password: eventValue })
    } else if (eventName === 'gradYear') {
      this.setState({ gradYear: eventValue })
    } else if (eventName === 'pathway') {
      this.setState({ pathway: eventValue, selectedValue: eventValue })
    } else if (eventName === 'jobTitle') {
      this.setState({ jobTitle: eventValue })
    } else if (eventName === 'employerName') {
      const employerName = eventValue
      const accountCode = null
      this.setState({ employerName, accountCode })

      this.searchEmployers(employerName)
    } else if (eventName === 'orgCode') {
      let orgCode = eventValue
      if (orgCode && orgCode !== '') {
        orgCode.toLowerCase()
      }
      this.setState({ orgCode })
    } else if (eventName === 'roleName') {
      const roleName = eventValue

      this.setState({ roleName, selectedValue: eventValue })
    } else if (eventName === 'school') {
      this.setState({ school: eventValue })
    } else if (eventName === 'otherRoleName') {
      this.setState({ otherRoleName: eventValue })
    // } else if (eventName === 'subscribed') {
    //   const value = event.target.type === 'checkbox' ? event.target.checked : eventValue;
    //   this.setState({ subscribed: value, formHasChanged: true })
    } else {
      this.setState({[eventName]: eventValue, selectedValue: eventValue })
    }
  }

  searchEmployers(employerName) {
    console.log('searchEmployers ', employerName)

    Axios.get('https://www.guidedcompass.com/api/account/search', { params: { employerName } })
    .then((response) => {
      console.log('Employer search query attempted', response.data);

        if (response.data.success) {
          console.log('employer search query worked')

          const employers = response.data.employers
          if (employers && employers.length > 0) {
            console.log('we in')
            this.setState({ employers });
          }

        } else {
          console.log('employer search query did not work', response.data.message)
        }

    }).catch((error) => {
        console.log('Employer search query did not work for some reason', error);
    });
  }

  employerClicked(employer) {
    console.log('employerClicked called ', employer)

    this.setState({ employerName: employer.employerName, employers: [], accountCode: employer.accountCode })

  }

  signUp() {
      console.log('signUp called', this.state)

      // this.setState({ isSaving: true })
      let firstName = this.state.firstName
      let lastName = this.state.lastName
      let email = this.state.email
      let password = this.state.password

      const gradYear = this.state.gradYear
      const pathway = this.state.pathway
      let jobTitle = this.state.jobTitle
      let employerName = this.state.employerName
      let school = this.state.school

      let createdAt = new Date();
      let updatedAt = new Date();
      let platform = Platform.OS

      if (!this.state.rolesSupported.includes(this.state.roleName)) {

        let errorMessage = this.state.unsupportedRoleErrorMessage
        // if (this.state.roleName === 'Teacher' || this.state.roleName === 'School Staff' || this.state.roleName === 'Counselor' || this.state.roleName === 'School Support') {
        //   errorMessage = errorMessage + ' You can sign up for the educator web portal here: https://www.guidedcompass.com/join'
        // } else if (this.state.roleName === 'WBLC' || this.state.roleName === "Work-Based Learning Coordinator") {
        // } else if (this.state.roleName === "Mentor") {
        // } else if (this.state.roleName === "Employer" || this.state.roleName === "Employer Representative") {
        //
        // }

        this.setState({ error: { message: errorMessage, isSaving: false }})
      } else if (firstName === '') {
        this.setState({ error: { message: 'please enter your first name', isSaving: false }})
      } else if (lastName === '') {
        this.setState({ error: { message: 'please enter your last name', isSaving: false }})
      } else if (email === '') {
        this.setState({ error: { message: 'please enter your email', isSaving: false }})
      } else if (!email.includes('@')) {
        this.setState({ error: { message: 'email invalid. please enter a valid email', isSaving: false }})
      } else if (password === '') {
        this.setState({ error: { message: 'please enter a password', isSaving: false }})
      // } else if (!this.state.orgCode || this.state.orgCode === '') {
      //   this.setState({ error: { message: 'please add the code affiliated with a Guided Compass partner' }})
      // } else if (this.state.roleName && this.state.roleName.toLowerCase() === 'student') {
      //   this.setState({ error: { message: 'please enter your expected graduation year' }})
      } else if (this.state.roleName && this.state.roleName.toLowerCase() === 'student' && this.state.includePathway && pathway === '') {
        this.setState({ error: { message: 'please enter your pathway', isSaving: false }})
      } else if (password.length < 7) {
        this.setState({ error: { message: 'please enter a password over 6 characters', isSaving: false }})
      } else if (this.state.roleName && this.state.roleName.toLowerCase() === 'mentor' && jobTitle === '') {
        this.setState({ error: { message: 'please enter your job title', isSaving: false }})
      } else if (this.state.roleName && this.state.roleName.toLowerCase() === 'mentor' && employerName === '') {
        this.setState({ error: { message: 'please enter the name of your employer', isSaving: false }})
      } else {

          //we will assume username is unique for now
          firstName = firstName.trim()
          lastName = lastName.trim()
          let combinedNames = firstName + lastName
          let username = combinedNames.toLowerCase().replace(/\s/g, "");

          this.setState({ isWaiting: true, username })

          let activeOrg = 'guidedcompass'
          if (this.state.orgCode && this.state.orgCode !== '') {
            activeOrg = this.state.orgCode.toLowerCase()
          }

          Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
          .then((response) => {
            console.log('Org info query attempted', response.data);

              if (response.data.success) {
                console.log('org info query worked')

                // if (!this.state.orgCode || this.state.orgCode === '') {
                //   activeOrg = this.state.orgCode.toLowerCase()
                // }

                email = email.toLowerCase()
                const orgName = response.data.orgInfo.orgName
                const orgFocus = response.data.orgInfo.orgFocus
                const orgContactFirstName = response.data.orgInfo.contactFirstName
                const orgContactLastName = response.data.orgInfo.contactLastName
                const orgContactEmail = response.data.orgInfo.contactEmail
                const studentAlias = response.data.orgInfo.studentAlias
                const headerImageURL = response.data.orgInfo.headerImageURL
                const skipWalkthrough = response.data.orgInfo.skipWalkthrough
                let publicOrg = response.data.orgInfo.isPublic
                if (activeOrg === 'guidedcompass') {
                  publicOrg = true
                }

                let placementPartners = []
                if (response.data.orgInfo.placementPartners) {
                  placementPartners = response.data.orgInfo.placementPartners
                }

                const myOrgs = [activeOrg]
                const courseIds = [this.state.courseId]
                const workIds = [this.state.workId]

                let roleName = this.state.roleName
                let otherRoleName = this.state.otherRoleName

                let workMode = false
                if (this.state.roleName.toLowerCase() === 'worker') {
                  roleName = 'Student'
                  workMode = true
                } else if (this.state.roleName === 'Student / Career Seeker') {
                  roleName = 'Student'
                } else if (this.state.roleName === 'Work-Based Learning Coordinator') {
                  roleName = 'WBLC'
                } else if (this.state.roleName === 'Employer Representative') {
                  roleName = 'Employer'
                }

                if (orgFocus === 'Placement') {
                  if (response.data.orgInfo.pathwaysTiedToSchools) {
                    if (pathway && pathway.split("|")) {
                      school = pathway.split("|")[1].trim()
                    }
                  } else {
                    if (!this.state.school) {
                      school = ''
                    }
                  }
                } else {
                  if (response.data.orgInfo.pathwaysTiedToSchools) {
                    if (pathway && pathway.split("|")) {
                      school = pathway.split("|")[1].trim()
                    }
                  }
                }

                let schoolDistrict = this.state.schoolDistrict

                let isAdvisor = false
                let isOrganization = false
                let isEmployer = false
                let accountCode = ''

                let benefits = undefined
                if (roleName && roleName.toLowerCase() === 'Student') {
                  jobTitle = 'Student'
                  employerName = 'None'
                  benefits = this.state.studentBenefits
                } else if (roleName && roleName.toLowerCase() === 'career-seeker') {
                  roleName = 'Student'
                  jobTitle = 'Student'
                  employerName = 'None'
                  benefits = this.state.studentBenefits
                } else if (roleName && roleName.toLowerCase() === 'Teacher') {
                  isAdvisor = true
                  jobTitle = 'Teacher'
                  employerName = this.state.school
                  benefits = this.state.teacherBenefits
                } else if (roleName === 'Admin' || roleName === 'admin' || roleName === 'WBLC') {
                  isOrganization = true
                } else if (roleName && roleName.toLowerCase() === 'Mentor') {
                  isAdvisor = true
                  if (this.state.accountCode) {
                    accountCode = this.state.accountCode
                  } else {
                    accountCode = employerName.replace('"','').replace("<","").replace(">","").replace("%","").replace("{","").replace("}","").replace("|","").replace("^","").replace("~","").replace("[","").replace("]","").replace("`","").replace(/ /g,"").replace(/,/g,"").toLowerCase()
                  }
                  benefits = this.state.mentorBenefits
                } else if (roleName && roleName.toLowerCase() === 'employer') {
                  isEmployer = true
                  if (this.props.accountCode) {
                    accountCode = this.props.accountCode
                  } else if (this.state.accountCode) {
                    accountCode = this.state.accountCode
                  } else {
                    accountCode = employerName.replace('"','').replace("<","").replace(">","").replace("%","").replace("{","").replace("}","").replace("|","").replace("^","").replace("~","").replace("[","").replace("]","").replace("`","").replace(/ /g,"").replace(/,/g,"").toLowerCase()
                  }
                  benefits = this.state.employerBenefits
                  console.log('role name employer!!!')
                }
                console.log('role name?!', roleName)

                if (benefits) {
                  for (let i = 1; i <= benefits.length; i++) {
                    benefits[i - 1]['detail'] = benefits[i - 1].detail.replace(/{{orgName}}/g,orgName)
                  }
                }

                const openToMentoring = true
                const mfaEnabled = this.state.mfaEnabled

                let requestAccess = false
                if (!this.state.originalRoleName && activeOrg === 'guidedcompass') {
                  // requestAccess = true
                  if (roleName === 'Employer' || roleName === 'WBLC' || roleName === 'Other') {
                    requestAccess = true
                  }
                }

                let unsubscribed = false
                if (!this.state.subscribed) {
                  unsubscribed = true
                }

                const publicProfileExtent = 'Only Connections'
                const publicPreferences = [
                  { name: 'Post', value: 'All', publicItems: []},
                  { name: 'Project', value: 'All', publicItems: []},
                  { name: 'Goal', value: 'All', publicItems: []},
                  { name: 'Passion', value: 'All', publicItems: []},
                  { name: 'Assessment', value: 'All', publicItems: []},
                  { name: 'Endorsement', value: 'All', publicItems: []},
                ]

                const verificationCode = Math.floor(Math.random() * 100000)

                const userObject = {
            			firstName,lastName, username, email, password, gradYear, pathway, orgName, courseIds, workIds,
                  orgContactFirstName, orgContactLastName, orgContactEmail,
                  activeOrg, myOrgs, roleName, otherRoleName, school, schoolDistrict, jobTitle, employerName, accountCode,
                  createdAt, updatedAt, platform, openToMentoring, benefits, headerImageURL,
                  isAdvisor, isOrganization, isEmployer, mfaEnabled, workMode, requestAccess, unsubscribed,
                  publicProfileExtent, publicPreferences, verificationCode
            		}

                Axios.post('https://www.guidedcompass.com/api/users/register', userObject)
                .then((response) => {

                  if (response.data.success) {
                    console.log('successfully saved profile')

                    const self = this
                    function completeSignUp(username) {
                      console.log('completeSignUp called')

                      //success
                      AsyncStorage.setItem('email', email)//this.props.auth.email
                      AsyncStorage.setItem('username', username)
                      AsyncStorage.setItem('firstName', firstName)
                      AsyncStorage.setItem('lastName', lastName)
                      // AsyncStorage.setItem('isAdvisor', 'false')
                      // AsyncStorage.setItem('isAdvisee', 'true')

                      AsyncStorage.setItem('orgAffiliation', '')
                      AsyncStorage.setItem('activeOrg', activeOrg)
                      AsyncStorage.setItem('orgFocus', orgFocus)
                      AsyncStorage.setItem('myOrgs', JSON.stringify(myOrgs))
                      AsyncStorage.setItem('placementPartners', JSON.stringify(placementPartners))
                      AsyncStorage.setItem('orgName', orgName)
                      AsyncStorage.setItem('roleName', roleName)
                      AsyncStorage.setItem('pathway', pathway)
                      if (publicOrg) {
                        AsyncStorage.setItem('publicOrg', publicOrg.toString())
                      }

                      if (self.state.roleName.toLowerCase() === 'worker') {
                        AsyncStorage.setItem('workMode', 'true')
                      }

                      if (studentAlias) {
                        AsyncStorage.setItem('studentAlias', studentAlias)
                      } else {
                        AsyncStorage.removeItem('studentAlias')
                      }

                      if (self.state.mfaEnabled) {
                        AsyncStorage.setItem('verifyCode', pathway)
                      }

                      self.setState({ isWaiting: false })

                      if (roleName === 'Student') {
                        if (self.state.mfaEnabled) {
                          // self.props.navigation.navigate('ConfirmEmail', { activeOrg, email })
                          self.setState({ showVerifyCode: true, isSaving: false, isWaiting: false })
                        } else {
                          if (self.state.roleName.toLowerCase() === 'worker') {
                            console.log('going to work mode immediately')
                            self.props.navigation.navigate('Home')
                          } else {
                            if (skipWalkthrough) {
                              if (self.state.opportunityId) {
                                self.props.navigation.navigate('OpportunityDetails', { objectId: self.state.opportunityId })
                              } else {
                                self.props.navigation.navigate('Home')
                              }
                            } else {
                              self.props.navigation.navigate('Walkthrough', { opportunityId: self.state.opportunityId })
                            }
                          }
                        }

                      } else if (roleName === 'Admin' || roleName === 'admin' || roleName === 'WBLC') {

                        if (requestAccess) {
                          self.setState({ successMessage: 'Your registration has been recorded. Please allow 1-2 business days for our team to determine next steps. We may need to admit you to an existing organization or create a new organization for you.' })
                        } else {
                          self.setState({ successMessage: "You have been signed up. The mobile app isn't the best user experience, so please sign on using the web app at www.guidedcompass.com"})
                        }

                      } else if (roleName === 'Employer') {
                        console.log('the role name is employer', accountCode)

                        if (requestAccess) {
                          self.setState({ successMessage: 'Your registration has been recorded. Please allow 1-2 business days for our team to determine next steps. We may need to admit you to an existing employer account or create a new employer account for you. In the meantime, you can always post at:',  successLink: 'https://www.guidedcompass.com/employers/post' })
                        } else {
                          self.setState({ successMessage: "You have been signed up. The mobile app isn't the best user experience, so please sign on using the web app at www.guidedcompass.com"})
                        }

                      } else {

                        if (requestAccess && roleName === 'Other') {
                          self.setState({ successMessage: 'Your registration has been recorded. Please allow 1-2 business days for our team to determine next steps.' })
                        } else {
                          self.setState({ successMessage: "You have been signed up. The mobile app isn't the best user experience, so please sign on using the web app at www.guidedcompass.com"})
                        }
                      }
                    }

                    // also changes publicProfile
                    Axios.get('https://www.guidedcompass.com/api/profile/confirm-unique-username', { params: { emailId: email, username } })
                    .then((response) => {
                      console.log('Confirm unique username query attempted', response.data);

                        if (response.data.success) {
                          console.log('unique username query worked')

                          const newUsername = response.data.username
                          // AsyncStorage.setItem('username', username)
                          completeSignUp(newUsername)

                        } else {
                          console.log('there was an error')
                          completeSignUp(username)
                        }
                    })

                  } else {
                    console.log('profile save was not successful')

                    this.setState({
                        error: { message: response.data.message },
                        isWaiting: false, isSaving: false
                    })
                  }
                }).catch((error) => {
                    console.log('Saving the info did not work', error);

                });

              } else {
                console.log('org info query did not work', response.data.message)
                //don't allow signups without an org affiliation
                this.setState({ error: { message: 'There was an error: we could not find a partner organization with that org code' }, isWaiting: false, isSaving: false })

              }

          }).catch((error) => {
              console.log('Org info query did not work for some reason', error);
          });
      }

  }

  signIn() {
    console.log('subSignIn called: ', this.state)

    const email = this.state.email
    const password = this.state.password

    if (email === '') {
      this.setState({ error: { message: 'please enter your email' }})
    } else if (password === '') {
      this.setState({ error: { message: 'please enter your password' }})
    } else {
      console.log('show email and pass: ', email, password)
      this.setState({ isWaiting: true })

      Axios.post('https://www.guidedcompass.com/api/users/login', { email, password })
      .then((response) => {

        if (response.data.success) {
          console.log('successfully logged in')

          const userResponseData = response.data
          if (!this.state.rolesSupported.includes(this.state.roleName)) {

            let errorMessage = 'The mobile app currently only supports students / career seekers.'
            if (userResponseData.roleName === 'Teacher' || userResponseData.roleName === 'School Staff' || userResponseData.roleName === 'Counselor' || userResponseData.roleName === 'School Support') {
              errorMessage = errorMessage + ' You can sign into the educator web portal here: https://www.guidedcompass.com/advisor/signin'
            } else if (userResponseData.roleName === 'WBLC' || userResponseData.roleName === "Work-Based Learning Coordinator") {
              errorMessage = errorMessage + ' You can sign into the admin web portal here: https://www.guidedcompass.com/organizations/' + userResponseData.activeOrg + '/signin'
            } else if (userResponseData.roleName === "Mentor") {
              errorMessage = errorMessage + ' You can sign into the mentor web portal here: https://www.guidedcompass.com/advisor/signin'
            } else if (userResponseData.roleName === "Employer" || userResponseData.roleName === "Employer Representative") {
              errorMessage = errorMessage + ' You can sign into the admin web portal here: https://www.guidedcompass.com/employers/signin'
            }
            this.setState({ error: { message: errorMessage, isSaving: false }})
          } else {
            if (!this.state.orgFocus || this.state.orgFocus === '' || !this.state.orgCode || this.state.orgCode === '') {

              const orgCode = response.data.user.activeOrg
              Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode} })
              .then((response) => {
                console.log('Org info query attempted for orgFocus on login');

                  if (response.data.success) {
                    console.log('org info query worked for after sign in')

                    const orgFocus = response.data.orgInfo.orgFocus
                    const publicOrg = response.data.orgInfo.isPublic
                    const orgName = response.data.orgInfo.orgName
                    const placementPartners = response.data.orgInfo.placementPartners

                    this.completeSignIn(email, userResponseData, orgCode, orgFocus, publicOrg, placementPartners, orgName)

                  } else {
                    console.log('org info query did not work', response.data.message)
                  }

              }).catch((error) => {
                  console.log('Org info query did not work for some reason', error);
              });

            } else {

              const orgCode = response.data.user.activeOrg
              Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode} })
              .then((response) => {
                console.log('Org info query attempted for orgFocus on login');

                  if (response.data.success) {
                    console.log('org info query worked for after sign in')

                    const orgFocus = response.data.orgInfo.orgFocus
                    const publicOrg = response.data.orgInfo.isPublic
                    const orgName = response.data.orgInfo.orgName
                    const placementPartners = response.data.orgInfo.placementPartners

                    this.completeSignIn(email, userResponseData, orgCode, orgFocus, publicOrg, placementPartners, orgName)
                    // this.completeSignIn(email, response.data, this.state.orgCode, this.state.orgFocus, this.state.publicOrg, this.state.placementPartners)

                  } else {
                    console.log('org info query did not work', response.data.message)
                  }

              }).catch((error) => {
                  console.log('Org info query did not work for some reason', error);
              });
            }
          }

        } else {
          console.log('profile save was not successful')

          console.log('what is this', response.data.message);
          this.setState({
              error: { message: response.data.message },
              isWaiting: false
          })
        }
      }).catch((error) => {
          console.log('Logging in did not work', error);

      });

    }
  }

  completeSignIn(email, responseData,orgCode, orgFocus, publicOrg, placementPartners, orgName) {
    console.log('completeSignIn called', email, orgCode, orgFocus, publicOrg, placementPartners, orgName)

    if (this.state.mfaEnabled) {

      const emailId = this.state.email
      const verificationCode = Math.floor(Math.random() * 100000)

      const postBody = { emailId, verificationCode }

      Axios.post('https://www.guidedcompass.com/api/send-verification-code', postBody)
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('New verification code sent', response.data);
          this.setState({ showVerifyCode: true })

        } else {
          console.error('there was an error sending the verification code ', response.data.message);
          this.setState({ errorMessage: response.data.message })

        }
      }).catch((error) => {
          console.log('The new verification code send did not work', error);
          this.setState({ errorMessage: error.toString() })
      });
    } else {
      AsyncStorage.setItem('email', email)
      if (responseData.user.pictureURL) {
        AsyncStorage.setItem('pictureURL', responseData.user.pictureURL)
      }

      AsyncStorage.setItem('username', responseData.user.username)
      AsyncStorage.setItem('firstName', responseData.user.firstName)
      AsyncStorage.setItem('lastName', responseData.user.lastName)
      if (responseData.user.pathway) {
        AsyncStorage.setItem('pathway', responseData.user.pathway)
      }

      if (responseData.user.workMode === true) {
        AsyncStorage.setItem('workMode', 'true')
      } else {
        AsyncStorage.setItem('workMode', 'false')
      }

      if (responseData.user.isAdvisor) {
        AsyncStorage.setItem('isAdvisor', 'true')
      } else {
        AsyncStorage.setItem('isAdvisor', 'false')
        AsyncStorage.setItem('isAdvisee', 'true')
      }

      if (responseData.user.orgAffiliation) {
        if (responseData.user.orgAffiliation === 'admin') {
          console.log('user is an admin')
          AsyncStorage.setItem('orgAffiliation', 'admin')
        } else {
          console.log('user is not an admin')
          AsyncStorage.setItem('orgAffiliation', '')
        }
      } else {
        console.log('no orgAffiliation found')
        AsyncStorage.setItem('orgAffiliation', '')
      }
      if (responseData.user.myOrgs) {
        AsyncStorage.setItem('myOrgs', JSON.stringify(responseData.user.myOrgs))
      }

      if (responseData.user.activeOrg) {
        AsyncStorage.setItem('activeOrg', responseData.user.activeOrg)
        AsyncStorage.setItem('orgName', orgName)
        if (orgFocus && orgFocus !== '') {
          AsyncStorage.setItem('orgFocus', orgFocus)
        }

        if (responseData.user.activeOrg === 'guidedcompass') {
          publicOrg = true
        }

        if (publicOrg) {
          AsyncStorage.setItem('publicOrg', JSON.stringify(publicOrg))
        }
      }

      if (placementPartners) {
        AsyncStorage.setItem('placementPartners', JSON.stringify(placementPartners))
      }

      console.log('show roleName on signin: ', responseData.user.roleName)
      if (responseData.user.roleName) {
        AsyncStorage.setItem('roleName', responseData.user.roleName)
      }

      if (responseData.user.remoteAuth) {
        AsyncStorage.setItem('remoteAuth', responseData.user.remoteAuth)
      }

      this.setState({ isWaiting: false })

      if (this.props.fromAdvisor) {
        // mentor or teacher

        if (responseData.user.roleName !== 'Student') {
          this.setState({ successMessage: "You have been signed up. The mobile app isn't the best user experience, so please sign on using the web app at www.guidedcompass.com"})
        } else {
          // error - students can't view
          this.setState({ error: { message: 'Error, you dont have permission to view this portal'}})
        }

      } else {

        console.log('show oppId and oppOrg: ', responseData, this.state.opportunityId, this.props.opportunityOrg)
        if (this.state.opportunityId) {
          if (responseData.user && responseData.user.myOrgs && !responseData.user.myOrgs.includes('unite-la') && this.props.opportunityOrg === 'unite-la') {
            this.props.navigation.navigate('AddWorkspaces', { opportunityOrg: this.props.opportunityOrg, opportunityId: this.state.opportunityId})
          } else {
            this.props.navigation.navigate('OpportunityDetails', { opportunityId: this.state.opportunityId})
          }
        } else {
          this.props.navigation.navigate('App')
        }
      }
    }
  }

  validateRoleName(roleName) {
    console.log('validateRoleName called', roleName)

    const acceptableRoles = this.state.acceptableRoles.concat(this.state.roleNameOptions)

    let returnValue = false
    for (let i = 1; i <= acceptableRoles.length; i++) {

      if (acceptableRoles[i - 1].toLowerCase() === this.state.roleName.toLowerCase()) {
        returnValue = true
      }
    }
    console.log('show returnValue: ', returnValue)

    return returnValue
  }

  itemClicked(value, type) {
    console.log('itemClicked', value, type)

    if (type === 'roleName') {
      let roleName = value
      this.setState({ roleName })
    }
  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showRoleDefinitions: false, showOrgCodeDefinition: false })

  }

  resendCode() {
    console.log('resendCode called')

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    const emailId = this.state.email
    const verificationCode = Math.floor(Math.random() * 100000)

    const postBody = { emailId, verificationCode }

    Axios.post('https://www.guidedcompass.com/api/send-verification-code', postBody)
    .then((response) => {

      if (response.data.success) {
        //save values
        console.log('New verification code sent', response.data);
        this.setState({ successMessage: response.data.message })

      } else {
        console.error('there was an error sending the verification code ', response.data.message);
        this.setState({ errorMessage: response.data.message })

      }
    }).catch((error) => {
        console.log('The new verification code send did not work', error);
        this.setState({ errorMessage: error.toString() })

    });
  }

  submitCode() {
    console.log('submitCode called')

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    const emailId = this.state.email
    const verificationCode = this.state.verificationCode

    const postBody = { emailId, verificationCode }

    Axios.post('https://www.guidedcompass.com/api/verify-code', postBody)
    .then((response) => {

      if (response.data.success) {
        //save values
        console.log('Code successfully verified ', response.data);
        // this.setState({ successMessage: response.data.message })

        AsyncStorage.removeItem('verifyCode')

        const skipWalkthrough = this.state.skipWalkthrough
        const requestAccess = this.state.requestAccess

        const activeOrg = response.data.user.activeOrg
        const firstName = response.data.user.firstName
        const lastName = response.data.user.lastName
        const email = response.data.user.email
        const roleName = response.data.user.roleName
        const otherRoleName = response.data.user.otherRoleName
        const accountCode = response.data.user.accountCode
        const jobTitle = response.data.user.jobTitle
        const employerName = response.data.user.employerName
        const workMode = response.data.user.workMode

        const createdAt = new Date()
        const updatedAt = new Date()

        if ((!this.props.modalIsOpen && this.props.type && this.props.type === 'SignUp') || (this.props.modalIsOpen && !this.state.signInPage)) {
          // sign up
          if (roleName === 'Student') {
            if (this.state.roleName.toLowerCase() === 'worker') {
              console.log('going to work mode immediately')
              this.props.navigation.navigate('Home')
            } else {
              if (skipWalkthrough) {
                if (this.state.opportunityId) {
                  this.props.navigation.navigate('OpportunityDetails', { objectId: this.state.opportunityId })
                } else {
                  this.props.navigation.navigate('Home')
                }
              } else {
                this.props.navigation.navigate('Walkthrough', { opportunityId: this.state.opportunityId })
              }
            }

          // } else if (roleName === 'Admin' || roleName === 'admin' || roleName === 'WBLC') {
          //   // this.props.history.push('/organizations/' + activeOrg + '/dashboard')
          //
          //   if (requestAccess) {
          //     this.setState({ successMessage: 'Your registration has been recorded. Please allow 1-2 business days for our team to determine next steps. We may need to admit you to an existing organization or create a new organization for you.' })
          //   } else {
          //     if (this.state.mfaEnabled) {
          //       // this.props.history.push('/organizations/' + activeOrg + '/confirm-email/' + activeOrg + '/' + email)
          //       this.setState({ showVerifyCode: true })
          //     } else {
          //       this.props.history.push('/organizations/' + activeOrg + '/dashboard')
          //     }
          //   }

          // } else if (roleName === 'Employer') {
          //   console.log('the role name is employer', accountCode)
          //   // this.props.history.push('/employers/' + accountCode + '/dashboard')
          //
          //   if (this.props.modalIsOpen) {
          //
          //     const sharePartners = [activeOrg]
          //     const contactFirstName = firstName
          //     const contactLastName = lastName
          //     const contactEmail = email
          //     const contactTitle = jobTitle
          //     const orgContacts = [{ contactFirstName, contactLastName, contactEmail, contactTitle }]
          //
          //     const accountBody = {
          //       accountCode, employerName, orgContacts,
          //       contactFirstName, contactLastName, contactTitle, contactEmail,
          //       sharePartners, activeOrg, createdAt, updatedAt
          //     }
          //
          //     Axios.post('/api/account/create', accountBody)
          //     .then((response) => {
          //
          //       if (response.data.success) {
          //         //save values
          //         console.log('Account update save worked', response.data);
          //
          //         this.props.passData({ success: true, message: response.data.message })
          //
          //       } else {
          //         console.error('there was an error saving the employer ', response.data.message);
          //         this.props.passData({ success: true, message: response.data.message })
          //       }
          //     }).catch((error) => {
          //         console.log('The employer save did not work', error);
          //         this.props.passData({ success: true, message: response.data.message })
          //     });
          //
          //   } else {
          //     if (requestAccess) {
          //       this.setState({ successMessage: 'Your registration has been recorded. Please allow 1-2 business days for our team to determine next steps. We may need to admit you to an existing employer account or create a new employer account for you. In the meantime, you can always post at:',  successLink: 'https://www.guidedcompass.com/employers/post' })
          //     } else {
          //       if (this.state.showEmployerWalkthrough) {
          //         this.props.history.push('/employers/' + accountCode + '/walkthrough')
          //       } else {
          //         this.props.history.push('/employers/' + accountCode + '/dashboard')
          //       }
          //     }
          //   }

          } else {

            if (this.props.modalIsOpen) {
              this.props.passData({ success: true, message: response.data.message })
            } else {
              if (requestAccess && roleName === 'Other') {
                this.setState({ successMessage: 'Your registration has been recorded. Please allow 1-2 business days for our team to determine next steps.' })
              } else {
                this.props.history.push('/advisor')
              }
            }
          }
        } else {
          // sign in

          AsyncStorage.setItem('email', email)
          if (response.data.user.pictureURL) {
            AsyncStorage.setItem('pictureURL', response.data.user.pictureURL)
          }

          AsyncStorage.setItem('username', response.data.user.username)
          AsyncStorage.setItem('firstName', response.data.user.firstName)
          AsyncStorage.setItem('lastName', response.data.user.lastName)
          if (response.data.user.pathway) {
            AsyncStorage.setItem('pathway', response.data.user.pathway)
          }

          if (response.data.user.workMode === true) {
            AsyncStorage.setItem('workMode', 'true')
          } else {
            AsyncStorage.setItem('workMode', 'false')
          }

          if (response.data.user.isAdvisor) {
            AsyncStorage.setItem('isAdvisor', 'true')
          } else {
            AsyncStorage.setItem('isAdvisor', 'false')
            AsyncStorage.setItem('isAdvisee', 'true')
          }

          if (response.data.user.orgAffiliation) {
            if (response.data.user.orgAffiliation === 'admin') {
              console.log('user is an admin')
              AsyncStorage.setItem('orgAffiliation', 'admin')
            } else {
              console.log('user is not an admin')
              AsyncStorage.setItem('orgAffiliation', '')
            }
          } else {
            console.log('no orgAffiliation found')
            AsyncStorage.setItem('orgAffiliation', '')
          }
          if (response.data.user.myOrgs) {
            AsyncStorage.setItem('myOrgs', JSON.stringify(response.data.user.myOrgs))
          }

          if (response.data.user.activeOrg) {
            AsyncStorage.setItem('activeOrg', response.data.user.activeOrg)
            // AsyncStorage.setItem('orgName', orgName)
            // if (orgFocus && orgFocus !== '') {
            //   AsyncStorage.setItem('orgFocus', orgFocus)
            // }

            // if (response.data.user.activeOrg === 'guidedcompass') {
            //   publicOrg = true
            // }
            //
            // if (publicOrg) {
            //   AsyncStorage.setItem('publicOrg', JSON.stringify(publicOrg))
            // }
          }

          // if (placementPartners) {
          //   AsyncStorage.setItem('placementPartners', JSON.stringify(placementPartners))
          // }

          if (response.data.user.roleName) {
            AsyncStorage.setItem('roleName', response.data.user.roleName)
          }

          if (response.data.user.remoteAuth) {
            AsyncStorage.setItem('remoteAuth', response.data.user.remoteAuth)
          }

          this.setState({ isWaiting: false })

          if (this.props.fromAdvisor) {
            // mentor or teacher

            if (response.data.user.roleName !== 'Student') {
              this.setState({ successMessage: "You have been signed up. The mobile app isn't the best user experience, so please sign on using the web app at www.guidedcompass.com"})
            } else {
              // error - students can't view
              this.setState({ error: { message: 'Error, you dont have permission to view this portal'}})
            }

          } else {

            if (this.state.opportunityId) {
              if (response.data.user && response.data.user.myOrgs && !response.data.user.myOrgs.includes('unite-la') && this.props.opportunityOrg === 'unite-la') {
                this.props.navigation.navigate('AddWorkspaces', { opportunityOrg: this.props.opportunityOrg, opportunityId: this.state.opportunityId})
              } else {
                this.props.navigation.navigate('OpportunityDetails', { opportunityId: this.state.opportunityId})
              }
            } else {
              this.props.navigation.navigate('App')
            }
          }
        }

      } else {
        console.error('there was an error verifying the verification code ', response.data.message);

        this.setState({ isSaving: false, errorMessage: response.data.message, error: { message: response.data.message }})

      }
    }).catch((error) => {
        console.log('The verification code verification did not work', error);
        this.setState({ isSaving: false, errorMessage: error.toString() })
    });
  }

  render() {

    return (

      <View>

        <ImageBackground source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-mobile-background-image.png'}} style={[styles.absolutePosition,styles.absoluteTop0,styles.absoluteLeft0,styles.absoluteRight0,styles.absoluteBottom0,styles.fullScreenWidth,styles.fullScreenHeight]}>
          <ScrollView>
            {(this.state.showVerifyCode) ? (
              <View>
                <View style={[styles.rowDirection,styles.topMargin20]}>
                  <View style={[styles.flex20]}>
                    <View style={[styles.square30]} />
                  </View>
                  <View style={[styles.flex60]}>
                    <View style={[styles.rowDirection,styles.flexCenter]}>
                      <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com')}><Image source={{ uri: logoImg}} style={[styles.horizontalPadding10,styles.width150,styles.height50,styles.contain,styles.topMargin25]} /></TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.flex20]}>
                  </View>
                </View>

                <View style={[styles.standardBorder,styles.topMargin30]}>
                  <Text style={[styles.standardText,styles.whiteColor,styles.topPadding20,styles.centerText]}>Verify Your Identity</Text>

                  <View style={[styles.padding40]}>
                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.whiteColor,styles.centerText]}>A verification code has been sent to your email. Enter the code to continue.</Text>
                    </View>

                    <View style={[styles.row10]}>

                      <TextInput
                        style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                        onChangeText={(text) => this.formChangeHandler("verificationCode", text)}
                        value={this.state.verificationCode}
                        placeholder="e.g. 123..."
                        placeholderTextColor={styles.faintColor.color}
                        keyboardType='numeric'
                      />
                    </View>

                    <View style={[styles.row15]}>
                      <TouchableOpacity style={(this.state.verificationCode) ? [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter,styles.washOut2]} disabled={(this.state.verificationCode) ? false : true} onPress={() => this.submitCode()}><Text style={[styles.descriptionText2,styles.whiteColor]}>Continue</Text></TouchableOpacity>
                    </View>

                    <View style={[styles.row5]}>
                      <TouchableOpacity onPress={() => this.resendCode()}><Text style={[styles.ctaColor,styles.boldText]}>Resend code </Text></TouchableOpacity>
                    </View>

                    {(this.state.errorMessage && this.state.errorMessage !== '') ? <Text style={[styles.descriptionText2,styles.row5,styles.errorColor]}>{this.state.errorMessage}</Text> : <View />}
                    {(this.state.successMessage && this.state.successMessage !== '') ? <Text style={[styles.descriptionText2,styles.row5,styles.ctaColor]}>{this.state.successMessage}</Text> : <View />}

                    <View style={[styles.topPadding20]}>
                      <Text style={[styles.descriptionText2,styles.whiteColor,styles.centerText]}>Need help? <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/contact')}><Text style={[styles.descriptionText2,styles.ctaColor]}>Contact us</Text></TouchableOpacity></Text>
                    </View>
                  </View>

                </View>
              </View>
            ) : (
              <View>
                <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
                  {(this.props.type && this.props.type === 'SignUp') ? (
                    <View>
                      <View style={[styles.rowDirection,styles.topMargin20]}>
                        <View style={[styles.flex20]}>
                          <View style={[styles.square30]} />
                        </View>
                        <View style={[styles.flex60]}>
                          <View style={[styles.rowDirection,styles.flexCenter]}>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com')}><Image source={{ uri: logoImg}} style={[styles.horizontalPadding10,styles.width150,styles.height50,styles.contain,styles.topMargin25]} /></TouchableOpacity>
                            {/*
                            {(this.state.orgCode && this.state.orgLogoURI) ? (
                              <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com')}><Image source={{ uri: addIcon}} style={[styles.horizontalPadding10,styles.square16,styles.contain,styles.topMargin25]} /></TouchableOpacity>
                            )}
                            {(this.state.orgCode && this.state.orgLogoURI) && (
                              <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com')}><Image source={{ uri: this.state.orgLogoURI}} style={[styles.horizontalPadding10,styles.square30,styles.contain,styles.topMargin25]} /></TouchableOpacity>
                            )}*/}
                          </View>
                        </View>
                        <View style={[styles.flex20]}>
                        </View>

                      </View>

                      <View style={[styles.padding30]}>
                        {(this.state.successMessage) ? (
                          <View style={[styles.horizontalPadding30]}>
                            <Text style={[styles.ctaColor,styles.standardText]}>{this.state.successMessage}</Text>
                            {(this.state.successLink) && (
                              <View style={[styles.topPadding20]}>
                                <TouchableOpacity onPress={() => Linking.openURL(this.state.successLink)}><Text style={[styles.ctaColor,styles.standardText,styles.boldText]}>{this.state.successLink}</Text></TouchableOpacity>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View>
                            {(!this.state.originalRoleName) && (
                              <View>
                                <View style={[styles.row10]}>
                                  <View style={[styles.rowDirection]}>
                                    <View style={[styles.calcColumn105]}>
                                      <Text style={[styles.standardText,styles.row10,styles.whiteColor]}>Which best describes you?<Text style={[styles.errorColor]}>*</Text></Text>
                                    </View>
                                    <View style={[styles.width45,styles.leftPadding]}>
                                      <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                      <View style={[styles.notiBubbleInfo7of9, { borderRadius: 15 }]}>
                                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showRoleDefinitions: true })}>
                                          <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain]} />
                                        </TouchableOpacity>
                                      </View>
                                    </View>
                                  </View>

                                  {(Platform.OS === 'ios') ? (
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: "Role Name", selectedIndex: null, selectedName: "roleName", selectedValue: this.state.roleName, selectedOptions: this.state.roleNameOptions, selectedSubKey: null })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20,styles.whiteBackground]}>
                                        <View style={[styles.calcColumn115]}>
                                          <Text style={[styles.descriptionText1,styles.white]}>{this.state.roleName}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <Picker
                                      selectedValue={this.state.roleName}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("roleName",itemValue)
                                      }>
                                      {this.state.roleNameOptions.map(value => <Picker.Item label={value} value={value} />)}
                                    </Picker>
                                  )}
                                  {/*
                                  <View style={[styles.rowDirection,styles.flexWrap]}>
                                    {this.state.roleNameOptions.map((value, index) =>
                                      <View key={value}>
                                        <View style={[styles.rightPadding,styles.bottomPadding5]}>
                                          <TouchableOpacity onPress={() => this.itemClicked(value,'roleName')}>
                                            {(this.state.roleName === value) ? (
                                              <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.whiteBorder,styles.whiteBackground]}>
                                                <Text style={[styles.descriptionText2,styles.ctaColor,styles.boldText]}>{value}</Text>
                                              </View>
                                            ) : (
                                              <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.whiteBorder]}>
                                                <Text style={[styles.descriptionText2,styles.whiteColor,styles.boldText]}>{value}</Text>
                                              </View>
                                            )}
                                          </TouchableOpacity>
                                        </View>
                                      </View>
                                    )}
                                  </View>*/}
                                </View>
                              </View>
                            )}

                            {(!this.state.rolesSupported.includes(this.state.roleName)) ? (
                              <View style={[styles.topMargin20]}>
                                <Text style={[styles.standardText,styles.whiteColor]}>{this.state.unsupportedRoleErrorMessage}</Text>
                              </View>
                            ) : (
                              <KeyboardAvoidingView behavior="padding">
                                <View style={[styles.topPadding]}>
                                  <View style={[styles.row10]}>
                                    <TextInput
                                      style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                                      onChangeText={(text) => this.formChangeHandler("firstName", text)}
                                      value={this.state.firstName}
                                      placeholder="First name..."
                                      placeholderTextColor={styles.faintColor.color}
                                    />
                                  </View>
                                  <View style={[styles.row10]}>
                                  <TextInput
                                      style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                                      onChangeText={(text) => this.formChangeHandler("lastName", text)}
                                      value={this.state.lastName}
                                      placeholder="Last name..."
                                      placeholderTextColor={styles.faintColor.color}
                                    />
                                  </View>

                                  <View style={[styles.row10]}>
                                    <TextInput
                                      style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                                      onChangeText={(text) => this.formChangeHandler("email", text)}
                                      value={this.state.email}
                                      placeholder="Email..."
                                      placeholderTextColor={styles.faintColor.color}
                                      autoCapitalize='none'
                                    />
                                  </View>

                                  <View style={[styles.row10]}>
                                    <TextInput
                                      style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                                      onChangeText={(text) => this.formChangeHandler("password", text)}
                                      value={this.state.password}
                                      placeholder="Password..."
                                      placeholderTextColor={styles.faintColor.color}
                                      autoCapitalize='none'
                                      secureTextEntry={true}
                                    />
                                  </View>

                                  <View style={[styles.row10,styles.rowDirection]}>
                                    <View style={[styles.calcColumn105]}>
                                      <TextInput
                                        style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.descriptionText1,styles.whiteUnderline,styles.offsetUnderline,styles.height40]}
                                        onChangeText={(text) => this.formChangeHandler("orgCode", text)}
                                        value={this.state.orgCode}
                                        placeholder="Org code (optional)"
                                        placeholderTextColor={styles.faintColor.color}
                                        autoCapitalize='none'
                                      />
                                    </View>
                                    <View style={[styles.width45,styles.leftPadding,styles.whiteUnderline,styles.offsetUnderline,styles.height40]}>
                                      <View style={[styles.topMargin5,styles.notiBubbleInfo7of9, { borderRadius: 15 }]}>
                                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showOrgCodeDefinition: true })}>
                                          <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain]} />
                                        </TouchableOpacity>
                                      </View>
                                    </View>

                                  </View>

                                  {(this.state.roleName && this.state.roleName.toLowerCase() === 'student') && (
                                    <View>
                                      {(this.state.includePathway) && (
                                        <View style={[styles.row10]}>
                                          <Text style={[styles.standardText,styles.row10]}>Pathway</Text>
                                          <Picker
                                            selectedValue={this.state.pathway}
                                            onValueChange={(itemValue, itemIndex) =>
                                              this.formChangeHandler("pathway",itemValue)
                                            }>
                                            {this.state.pathwayOptions.map(value => <Picker.Item key={value.title} label={value.title} value={value.title} />)}
                                          </Picker>
                                        </View>
                                      )}

                                    </View>
                                  )}

                                  {((this.state.roleName && this.state.roleName.toLowerCase() === 'mentor') || (this.state.roleName && this.state.roleName.toLowerCase() === 'employer representative')) && (
                                    <View>
                                      <View style={[styles.row10]}>
                                        <TextInput
                                          style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                                          onChangeText={(text) => this.formChangeHandler("jobTitle", text)}
                                          value={this.state.jobTitle}
                                          placeholder="Job Title..."
                                          placeholderTextColor={styles.faintColor.color}
                                        />
                                      </View>
                                      <View style={[styles.row10]}>
                                        <TextInput
                                          style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                                          onChangeText={(text) => this.formChangeHandler("employerName", text)}
                                          value={this.state.employerName}
                                          placeholder="Employer name..."
                                          placeholderTextColor={styles.faintColor.color}
                                        />
                                        {(this.state.employers.length > 0) && (
                                          <View>
                                            <View style={[styles.spacer]} />

                                            {this.state.employers.map(value =>
                                              <View key={value._id} style={[styles.row5]}>
                                                <TouchableOpacity onPress={() => this.employerClicked(value)}>
                                                  <View style={[styles.rowDirection]}>
                                                    <View style={[styles.rightPadding]}>
                                                      <Image source={{ uri: employersIconBlue}} style={[styles.square22,styles.contain]} />
                                                    </View>
                                                    <View>
                                                      <Text style={[styles.ctaColor]}>{value.employerName}</Text>
                                                    </View>
                                                  </View>
                                                </TouchableOpacity>
                                              </View>)}
                                          </View>
                                        )}
                                      </View>
                                    </View>
                                  )}

                                  {(this.state.roleName === 'Teacher' || this.state.roleName === 'Counselor' || this.state.roleName === 'Work-Based Learning Coordinator') && (
                                    <View>
                                      <View style={[styles.row10]}>
                                        <TextInput
                                          style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                                          onChangeText={(text) => this.formChangeHandler("school", text)}
                                          value={this.state.school}
                                          placeholder={(this.state.roleName === 'Work-Based Learning Coordinator') ? "Program Name" : "School Name"}
                                          placeholderTextColor={styles.faintColor.color}
                                        />
                                      </View>
                                    </View>
                                  )}
                                </View>

                                {(this.state.roleName === 'Student / Career Seeker') && (
                                  <View style={[styles.row10,styles.rowDirection]}>
                                    <View style={[styles.width80]}>
                                      <Switch
                                         onValueChange = {(value) => this.formChangeHandler("subscribed", value)}
                                         value = {this.state.subscribed}
                                      />
                                    </View>
                                    <View style={[styles.calcColumn140]}>
                                      <Text style={[styles.descriptionText3,styles.whiteColor]}>Receive weekly opportunities email based on interests.</Text>
                                    </View>

                                  </View>
                                )}

                                <View style={[styles.row10]}>
                                    <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.isSaving} onPress={() => this.signUp()}>
                                        <Text style={[styles.standardText,styles.whiteColor]}>Sign Up</Text>
                                    </TouchableOpacity>

                                    {(this.state.error && this.state.error.message) ? (
                                      <Text style={[styles.errorColor,styles.centerText,styles.standardText,styles.row5]}>{this.state.error.message}</Text>
                                    ) : (
                                      <View />
                                    )}

                                    <Text style={[styles.centerText,styles.whiteColor,styles.descriptionText2,styles.topMargin20]}>Already have an account? <Text onPress={() => this.props.navigation.navigate(this.state.toggleLink, { orgCode: this.state.orgCode, courseId: this.state.courseId, workId: this.state.workId, roleName: this.state.roleName, opportunityId: this.state.opportunityId, opportunityOrg: this.props.opportunityOrg })} style={[styles.descriptionText2,styles.ctaColor]}>Sign in instead</Text></Text>

                                    {(!this.state.orgCode || this.state.orgCode === '') ? (
                                      <View>
                                        <Text style={[styles.centerText,styles.whiteColor,styles.descriptionText2,styles.topMargin20]}>Don't know your org's org code? <Text onPress={() => Linking.openURL('https://www.guidedcompass.com/contact')} style={[styles.ctaColor,styles.boldText,styles.descriptionText2]}>Click Here</Text> to request.</Text>
                                      </View>
                                    ) : (
                                      <View />
                                    )}
                                </View>
                              </KeyboardAvoidingView>
                            )}

                          </View>
                        )}
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View style={[styles.rowDirection,styles.topMargin20]}>
                        <View style={[styles.flex20]}>
                          <View style={[styles.square30]} />
                        </View>
                        <View style={[styles.flex60]}>
                          <View style={[styles.rowDirection,styles.flexCenter]}>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com')}><Image source={{ uri: logoImg}} style={[styles.horizontalPadding10,styles.width150,styles.height50,styles.contain,styles.topMargin25]} /></TouchableOpacity>
                            {/*
                            {(this.state.orgCode && this.state.orgLogoURI) ? (
                              <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com')}><Image source={{ uri: addIcon}} style={[styles.horizontalPadding10,styles.square16,styles.contain,styles.topMargin25]} /></TouchableOpacity>
                            )}
                            {(this.state.orgCode && this.state.orgLogoURI) && (
                              <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com')}><Image source={{ uri: this.state.orgLogoURI}} style={[styles.horizontalPadding10,styles.square30,styles.contain,styles.topMargin25]} /></TouchableOpacity>
                            )}*/}
                          </View>
                        </View>
                        <View style={[styles.flex20]}>
                          {(this.state.courseName) && (
                            <View>
                              <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                              <Text style={[styles.descriptionText2,styles.rightText,styles.whiteColor]}>Course:</Text>
                              <Text style={[styles.rightText,styles.whiteColor]}>{this.state.courseName}</Text>
                            </View>
                          )}
                        </View>

                      </View>

                      <View style={[styles.padding30]}>
                          {(this.state.orgName) ? (
                            <View style={[styles.bottomMargin20]}>
                              {(this.state.roleName && this.validateRoleName(this.state.roleName)) ? (
                                <Text style={[styles.standardText,styles.whiteColor, styles.centerText]}>{this.state.orgName} {this.state.roleName} Sign In</Text>
                              ) : (
                                <View>
                                  {(this.props.type && this.props.type === 'SignUp') ? (
                                    <View>
                                      <Text style={[styles.standardText,styles.errorColor, styles.centerText]}>Invalid Role Name</Text>
                                    </View>
                                  ) : (
                                    <View />
                                  )}
                                </View>
                              )}
                            </View>
                          ) : (
                            <View style={[styles.bottomMargin20]}>
                              {(this.state.roleName) ? (
                                <View>
                                  {(this.state.roleName && this.validateRoleName(this.state.roleName)) ? (
                                    <Text style={[styles.standardText,styles.whiteColor, styles.centerText]}>{this.state.roleName} Sign In</Text>
                                  ) : (
                                    <View />
                                  )}
                                </View>
                              ) : (
                                <Text style={[styles.standardText,styles.whiteColor, styles.centerText]}>Sign In</Text>
                              )}
                            </View>
                          )}

                          <View style={[styles.screenHeight10]} />

                          <KeyboardAvoidingView behavior="padding">
                            <View>
                              <View style={[styles.row10]}>
                                <TextInput
                                  style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                                  onChangeText={(text) => this.formChangeHandler("email", text)}
                                  value={this.state.email}
                                  placeholder="Email..."
                                  placeholderTextColor={styles.faintColor.color}
                                  autoCapitalize='none'
                                />
                              </View>
                              <View style={[styles.row10]}>
                                <TextInput
                                  style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                                  onChangeText={(text) => this.formChangeHandler("password", text)}
                                  value={this.state.password}
                                  placeholder="Password..."
                                  placeholderTextColor={styles.faintColor.color}
                                  autoCapitalize='none'
                                  secureTextEntry={true}
                                />
                              </View>
                            </View>

                            <View style={[styles.row10]}>
                                <View style={[styles.topMargin]}>
                                  <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.signIn()}>
                                    <Text style={[styles.standardText,styles.whiteColor]}>Sign In</Text>
                                  </TouchableOpacity>
                                </View>

                                <View style={[styles.topMargin30]}>
                                  <Text style={[styles.standardText,styles.errorColor]}>{this.state.error.message}</Text>
                                  <Text style={[styles.descriptionText2,styles.whiteColor,styles.row5]}>Haven't created an account? <Text onPress={() => this.props.navigation.navigate(this.state.toggleLink, { orgCode: this.state.orgCode, courseId: this.state.courseId, workId: this.state.workId, roleName: this.state.roleName, opportunityId: this.state.opportunityId })} style={[styles.descriptionText2,styles.ctaColor,styles.boldText]}>Sign up instead</Text></Text>

                                  <Text style={[styles.descriptionText2,styles.whiteColor,styles.row5]}>Forgot your password? <Text onPress={() => Linking.openURL('https://www.guidedcompass.com/reset-password')} style={[styles.descriptionText2,styles.ctaColor,styles.boldText]}>Reset password</Text></Text>
                                </View>


                                <View style={[styles.spacer]}/><View style={[styles.spacer]}/>
                            </View>
                          </KeyboardAvoidingView>

                      </View>
                    </View>
                  )}
                </TouchableWithoutFeedback>
              </View>
            )}
          </ScrollView>

        </ImageBackground>

        <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>

          {(this.state.showRoleDefinitions) && (
            <ScrollView key="showRoleDefinitions" style={[styles.flex1,styles.padding20]}>
              <View style={[styles.rowDirection,styles.topMargin20]}>
                <View style={[styles.calcColumn120]}>
                  <Text style={[styles.headingText5]}>Role Definitions for Guided Compass (GC)</Text>
                </View>
                <View style={[styles.width30,styles.topMargin,styles.leftMargin,styles.alignEnd]}>
                  <TouchableOpacity onPress={() => this.closeModal()}>
                    <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                  </TouchableOpacity>
                </View>
              </View>


              <View style={[styles.row10]}>
                <View style={[styles.row10]}>
                  <Text style={[styles.descriptionText1]}>1) <Text style={[styles.boldText,styles.ctaColor]}>Student / Career Seeker</Text> refers to people in school to learn career-related skills, people seeking to start their careers, or people seeking to switch their careers. Use GC to explore careers, manage courses, RSVP to events, submit projects, and apply to work opportunities.</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.descriptionText1]}>2) <Text style={[styles.boldText,styles.ctaColor]}>Teacher</Text> refers to a teachers, instructors, professors, and trainers that teach career-releated skills. Use GC to track student progress, endorse student competencies, and oversee student projects.</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.descriptionText1]}>3) <Text style={[styles.boldText,styles.ctaColor]}>Work-Based Learning Coordinator</Text> refers to coordinators and administrators of work-based learning programs. These people act as intermediaries between career-seekers and employers / employment. Use GC to manage work-based learning postings, refer students, track placements, manage all members, and export reports.</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.descriptionText1]}>4) <Text style={[styles.boldText,styles.ctaColor]}>Counselor</Text> refers to people who coach or counsel career-seekers on career paths. Use GC to explore career paths, guide students, and oversee progress.</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.descriptionText1]}>5) <Text style={[styles.boldText,styles.ctaColor]}>Mentor</Text> refers to professionals that would like to be more active in helping career-seekers, including hosting events, providing project feedback, and conducting mock interviews.</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.descriptionText1]}>6) <Text style={[styles.boldText,styles.ctaColor]}>Employer Representative</Text> refers to HR or hiring managers interested in hands-off activities that directly benefit the employer (e.g., hiring  talent for project or full-time work).</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.descriptionText1]}>7) <Text style={[styles.boldText,styles.ctaColor]}>Other</Text> refers to anyone that does not fit neatly into the aforementioned categories.</Text>
                </View>
              </View>

              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close Modal</Text></TouchableOpacity>

              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
            </ScrollView>
          )}

          {(this.state.showOrgCodeDefinition) && (
            <ScrollView key="showOrgCodeDefinition" style={[styles.flex1,styles.padding20]}>
              <View style={[styles.rowDirection,styles.topMargin20]}>
                <View style={[styles.calcColumn120]}>
                  <Text style={[styles.headingText5]}>What is an Org Code?</Text>
                </View>
                <View style={[styles.width30,styles.topMargin,styles.leftMargin,styles.alignEnd]}>
                  <TouchableOpacity onPress={() => this.closeModal()}>
                    <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.spacer]}/><View style={[styles.spacer]}/>

              <View style={[styles.row10]}>
                <Text style={[styles.descriptionText1]}>Org Codes are the unique words that represent our education / workforce partners. By entering an org code, you will be able to enter the dedicated community / workspace for that organization.</Text>
              </View>

              <View style={[styles.row10]}>
                <Text style={[styles.descriptionText1]}>Don't know your org code? Askthe staff of the school / organization or request an org code here:</Text>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/contact')}><Text style={[styles.ctaColor,styles.boldText,styles.descriptionText1]}>https://www.guidedcompass.com/contact</Text></TouchableOpacity>
              </View>

              <View style={[styles.superSpacer]}/>

              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close Modal</Text></TouchableOpacity>

              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
            </ScrollView>
          )}

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

       </Modal>
      </View>

    )
  }
}

export default LogInForm;
