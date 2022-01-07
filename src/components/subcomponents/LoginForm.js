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

class LogInForm extends Component {
  constructor(props) {
    super(props)
    this.state = {
      roleName: 'Student / Career Seeker',
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
      confirmEmail: false,
      showEmployerWalkthrough: true,

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

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within login form ', this.props, prevProps)

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
    //validate strings
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
      this.setState({ pathway: eventValue })
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

      this.setState({ roleName })
    } else if (eventName === 'school') {
      this.setState({ school: eventValue })
    } else if (eventName === 'otherRoleName') {
      this.setState({ otherRoleName: eventValue })
    // } else if (eventName === 'subscribed') {
    //   const value = event.target.type === 'checkbox' ? event.target.checked : eventValue;
    //   this.setState({ subscribed: value, formHasChanged: true })
    } else {
      this.setState({[eventName]: eventValue})
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
      let platform = 'web'

      if (firstName === '') {
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
                const confirmEmail = this.state.confirmEmail

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

                const userObject = {
            			firstName,lastName, username, email, password, gradYear, pathway, orgName, courseIds, workIds,
                  orgContactFirstName, orgContactLastName, orgContactEmail,
                  activeOrg, myOrgs, roleName, otherRoleName, school, schoolDistrict, jobTitle, employerName, accountCode,
                  createdAt, updatedAt, platform, openToMentoring, benefits, headerImageURL,
                  isAdvisor, isOrganization, isEmployer, confirmEmail, workMode, requestAccess, unsubscribed,
                  publicProfileExtent, publicPreferences
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
                      AsyncStorage.setItem('publicOrg', publicOrg)

                      if (self.state.roleName.toLowerCase() === 'worker') {
                        AsyncStorage.setItem('workMode', 'true')
                      }

                      if (studentAlias) {
                        AsyncStorage.setItem('studentAlias', studentAlias)
                      } else {
                        AsyncStorage.removeItem('studentAlias')
                      }

                      self.setState({ isWaiting: false })

                      if (roleName === 'Student') {
                        if (self.state.confirmEmail) {
                          self.props.navigation.navigate('ConfirmEmail', { activeOrg, email })
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
                        // confirmEmail turned off because email isn't dynamic yet

                        if (requestAccess) {
                          self.setState({ successMessage: 'Your registration has been recorded. Please allow 1-2 business days for our team to determine next steps. We may need to admit you to an existing organization or create a new organization for you.' })
                        } else {
                          self.setState({ successMessage: "You have been signed up. The mobile app isn't the best user experience, so please sign on using the web app at www.guidedcompass.com"})
                        }

                      } else if (roleName === 'Employer') {
                        console.log('the role name is employer', accountCode)
                        // confirmEmail turned off because email isn't dynamic yet

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
                    Axios.get('https://www.guidedcompass.com/api/profile/confirm-unique-username', { params: { emailId: email, username, doNotPublicize: true } })
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
                this.setState({ error: { message: 'There was an error finding the partner organization' }, isWaiting: false, isSaving: false })

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

    AsyncStorage.setItem('email', email)
    if (responseData.user.pictureURL) {
      AsyncStorage.setItem('pictureURL', responseData.user.pictureURL)
    }

    AsyncStorage.setItem('username', responseData.user.username)
    AsyncStorage.setItem('firstName', responseData.user.firstName)
    AsyncStorage.setItem('lastName', responseData.user.lastName)
    AsyncStorage.setItem('pathway', responseData.user.pathway)

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
        // this.props.history.push('/advisor')
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

    this.setState({ modalIsOpen: false })

  }

  render() {

    return (

      <View>

        <ImageBackground source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-mobile-background-image.png'}} style={[styles.absolutePosition,styles.absoluteTop0,styles.absoluteLeft0,styles.absoluteRight0,styles.absoluteBottom0,styles.fullScreenWidth,styles.fullScreenHeight]}>
          <ScrollView>
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
                    {/*
                    {(this.state.orgName) ? (
                      <View style={[styles.bottomMargin20]}>
                        {(this.state.roleName && this.validateRoleName(this.state.roleName)) ? (
                          <Text style={[styles.standardText,styles.whiteColor]}>{this.state.orgName} {this.state.roleName} Sign Up</Text>
                        ) : (
                          <Text style={[styles.standardText,styles.errorColor,styles.whiteColor]}>Invalid Role Name</Text>
                        )}
                      </View>
                    ) : (
                      <View style={[styles.bottomMargin20]}>
                        {(this.state.roleName) ? (
                          <View>
                            {(this.state.roleName && this.validateRoleName(this.state.roleName)) ? (
                              <Text style={[styles.standardText,styles.centerText,styles.whiteColor]}>{this.state.roleName} Sign Up</Text>
                            ) : (
                              <Text style={[styles.standardText,styles.centerText,styles.whiteColor]}>Invalid Role Name</Text>
                            )}
                          </View>
                        ) : (
                          <Text style={[styles.standardText,styles.centerText,styles.whiteColor]}>Your handy career advisor</Text>
                        )}
                      </View>
                    )}*/}

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
                              </View>
                            </View>

                            {(this.state.roleName === 'Other') && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10,styles.whiteColor,styles.centerText]}>You selected "other". Please write your role:<Text style={[styles.errorColor]}>*</Text></Text>
                                <TextInput
                                  style={[styles.whiteColor,styles.bottomMargin,styles.horizontalPadding10,styles.whiteUnderline,styles.offsetUnderline, styles.height40,styles.descriptionText1]}
                                  onChangeText={(text) => this.formChangeHandler("otherRoleName", text)}
                                  value={this.state.otherRoleName}
                                  placeholder="Other role name..."
                                  placeholderTextColor={styles.faintColor.color}
                                />
                              </View>
                            )}
                          </View>
                        )}

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
                                      {this.state.pathwayOptions.map(value => <Picker.Item key={value.name} label={value.name} value={value.name} />)}
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
                            <View style={[styles.topPadding,styles.rowDirection]}>
                              <View style={[styles.width80]}>
                                <Switch
                                   onValueChange = {(value) => this.formChangeHandler("subscribed", value)}
                                   value = {this.state.subscribed}
                                />
                              </View>
                              <View style={[styles.calcColumn140]}>
                                <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                <Text style={[styles.descriptionText3,styles.whiteColor]}>Receive weekly emails of event, project, and work opportunities based on your interests.</Text>
                              </View>

                            </View>
                          )}

                          <View style={[styles.row10]}>
                              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.isSaving} onPress={() => this.signUp()}>
                                  <Text style={[styles.standardText,styles.whiteColor]}>Sign Up</Text>
                              </TouchableOpacity>

                              <Text style={[styles.errorColor,styles.centerText]}>{this.state.error.message}</Text>

                              <Text style={[styles.centerText,styles.whiteColor,styles.descriptionText2]}>Already have an account? <TouchableOpacity onPress={() => this.props.navigation.navigate(this.state.toggleLink, { orgCode: this.state.orgCode, courseId: this.state.courseId, workId: this.state.workId, roleName: this.state.roleName, opportunityId: this.state.opportunityId, opportunityOrg: this.props.opportunityOrg })}><Text style={[styles.descriptionText2,styles.ctaColor]}>Sign in instead</Text></TouchableOpacity></Text>

                              {(!this.state.orgCode || this.state.orgCode === '') ? (
                                <View>
                                  <Text style={[styles.centerText,styles.whiteColor,styles.descriptionText2]}>Joining the portal of a partner organization but don't know their org code? You can request it <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/contact')}><Text style={[styles.ctaColor,styles.boldText]}>here</Text></TouchableOpacity>.</Text>
                                </View>
                              ) : (
                                <View />
                              )}
                          </View>
                        </KeyboardAvoidingView>

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
                            <Text style={[styles.standardText,styles.errorColor, styles.centerText]}>Invalid Role Name</Text>
                          )}
                        </View>
                      ) : (
                        <View style={[styles.bottomMargin20]}>
                          {(this.state.roleName) ? (
                            <View>
                              {(this.state.roleName && this.validateRoleName(this.state.roleName)) ? (
                                <Text style={[styles.standardText,styles.whiteColor, styles.centerText]}>{this.state.roleName} Sign In</Text>
                              ) : (
                                <Text style={[styles.standardText,styles.errorColor, styles.centerText]}>Invalid Role Name</Text>
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
                              <Text style={[styles.standardText,styles.whiteColor]}>Haven't created an account? <TouchableOpacity onPress={() => this.props.navigation.navigate(this.state.toggleLink, { orgCode: this.state.orgCode, courseId: this.state.courseId, workId: this.state.workId, roleName: this.state.roleName, opportunityId: this.state.opportunityId })}><Text style={[styles.standardText,styles.ctaColor,styles.boldText]}>Sign up instead</Text></TouchableOpacity></Text>

                              <Text style={[styles.standardText,styles.whiteColor]}>Forgot your password? <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/reset-password')}><Text style={[styles.standardText,styles.ctaColor,styles.boldText]}>Reset password</Text></TouchableOpacity></Text>
                            </View>


                            <View style={[styles.spacer]}/><View style={[styles.spacer]}/>
                        </View>
                      </KeyboardAvoidingView>

                  </View>
                </View>
              )}
            </TouchableWithoutFeedback>
          </ScrollView>

        </ImageBackground>

        <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>

          {(this.state.showRoleDefinitions) && (
            <ScrollView key="showRoleDefinitions" style={[styles.flex1,styles.padding20]}>
              <Text style={[styles.headingText2]}>Role Definitions for Guided Compass (GC)</Text>

              <View style={[styles.row10,styles.descriptionText1]}>
                <View style={[styles.row10]}>
                  <Text style={[styles.standardText]}>1) <Text style={[styles.boldText,styles.ctaColor]}>Student / Career Seeker</Text> refers to people in school to learn career-related skills, people seeking to start their careers, or people seeking to switch their careers. Use GC to explore careers, manage courses, RSVP to events, submit projects, and apply to work opportunities.</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.standardText]}>2) <Text style={[styles.boldText,styles.ctaColor]}>Teacher</Text> refers to a teachers, instructors, professors, and trainers that teach career-releated skills. Use GC to track student progress, endorse student competencies, and oversee student projects.</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.standardText]}>3) <Text style={[styles.boldText,styles.ctaColor]}>Work-Based Learning Coordinator</Text> refers to coordinators and administrators of work-based learning programs. These people act as intermediaries between career-seekers and employers / employment. Use GC to manage work-based learning postings, refer students, track placements, manage all members, and export reports.</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.standardText]}>4) <Text style={[styles.boldText,styles.ctaColor]}>Counselor</Text> refers to people who coach or counsel career-seekers on career paths. Use GC to explore career paths, guide students, and oversee progress.</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.standardText]}>5) <Text style={[styles.boldText,styles.ctaColor]}>Mentor</Text> refers to professionals that would like to be more active in helping career-seekers, including hosting events, providing project feedback, and conducting mock interviews.</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.standardText]}>6) <Text style={[styles.boldText,styles.ctaColor]}>Employer Representative</Text> refers to HR or hiring managers interested in hands-off activities that directly benefit the employer (e.g., hiring  talent for project or full-time work).</Text>
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.standardText]}>7) <Text style={[styles.boldText,styles.ctaColor]}>Other</Text> refers to anyone that does not fit neatly into the aforementioned categories.</Text>
                </View>
              </View>

              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close Modal</Text></TouchableOpacity>

              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
            </ScrollView>
          )}

       </Modal>
      </View>

    )
  }
}

export default LogInForm;
