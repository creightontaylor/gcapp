import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, Linking, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';

const arrowIndicatorIconLeft = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/left-arrow-indicator.png';
const arrowIndicatorIconRight = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/right-arrow-indicator.png';
const partnerIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/partner-icon.png';
const eventIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/event-icon-blue.png';
const projectsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-blue.png';
const internIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/intern-icon-blue.png';
const checkboxEmpty = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkbox-empty.png';
const checkboxChecked = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkbox-checked.png';
const homeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/home-icon-blue.png';
const homeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/home-icon-dark.png';
const profileIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-blue.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const skillsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/skills-icon.png';
const skillsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/skills-icon-blue.png';
const favoritesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-dark.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const publicIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/public-icon.png';
const publicIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/public-icon-blue.png';
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const socialIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-blue.png';
const socialIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-dark.png';
const opportunitiesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-blue.png';
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png';
const careerMatchesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-dark.png';
const careerMatchesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-blue.png';
const moneyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/money-icon-dark.png';
const gcFrontImage = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/gc-front-image.png';
const industryIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/industry-icon-dark.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';
const exampleInternMatch = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/example-intern-match.png';
const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png';
const experienceIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/experience-icon.png';

import {convertDateToString} from '../functions/convertDateToString';
import SubEditProfileDetails from '../subcomponents/EditProfileDetails';
import SubTakeAssessment from '../subcomponents/TakeAssessment';
import SubRequestEndorsements from '../subcomponents/RequestEndorsements';
import SubLogs from '../subcomponents/Logs';
import SubEditLog from '../subcomponents/EditLog';
import SubEditGroup from '../common/EditGroup';
import SubGroups from '../subcomponents/Groups';
import SubRenderMyGroups from '../common/RenderMyGroups';
import SubAddWorkspaces from '../subcomponents/AddWorkspaces';

class Walkthrough extends Component {
  constructor(props) {
    super(props)
    this.state = {
      pageIndex: 0,
      isChecked: false,

      pages: [],
      autoEnrollInProgram: true,
      requireReferrer: true,

      containerWidth: '70%',
      containerPadding: '40px',
      sideContainerWidth: '15%',

      questions: [],
      departmentOptions: [],

      atsOptions: []
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.movePage = this.movePage.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.optionClicked = this.optionClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.passGoal = this.passGoal.bind(this)
    this.passGroup = this.passGroup.bind(this)
    this.passOrgs = this.passOrgs.bind(this)
    this.passPosts = this.passPosts.bind(this)
    this.saveToProfile = this.saveToProfile.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within SubWalkthrough', this.props.activeOrg, prevProps.activeOrg)

    if (this.props.accountCode !== prevProps.accountCode) {
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
        console.log('what is the email of this user', emailId);

        const accountCode = this.props.accountCode

        let pageIndex = 1
        let pages = [
          { title: 'Welcome', iconSelected: homeIconBlue, iconUnselected: homeIconDark },
          { title: 'Who you are', iconSelected: profileIconBlue, iconUnselected: profileIconDark },
          { title: "What you want", iconSelected: favoritesIconBlue, iconUnselected: favoritesIconDark },
          { title: "What you're great at", iconSelected: skillsIconBlue, iconUnselected: skillsIconDark, },
          { title: "Who can see your profile", iconSelected: publicIconBlue, iconUnselected: publicIconDark },
        ]

        let requireReferrer = true
        if (activeOrg === 'guidedcompass') {
          requireReferrer = false
        }

        let atsOptions = ['','Avature','Workable','JazzHR','Lever','Greenhouse','Breezy HR', 'iCIMS','RecruiterBox','Pinpoint','ClearCompany','Workday', 'Other',]
        atsOptions.sort()
        atsOptions.push('No ATS',"I'm Not Sure")

        this.setState({ emailId: email, cuFirstName, cuLastName, username, activeOrg, orgFocus, pageIndex, pages,
          remoteAuth, requireReferrer, atsOptions
        })

        // career-seeker
        Axios.get('https://www.guidedcompass.com/api/workoptions')
        .then((response) => {
          console.log('Work options query tried', response.data);

          if (response.data.success) {
            console.log('Work options query succeeded')

            let genderOptions = response.data.workOptions[0].genderOptions
            genderOptions.unshift('')
            let raceOptions = response.data.workOptions[0].raceOptions
            raceOptions.unshift('')
            const basicCountOptions = ['','1','2','3','4','5','6','7','8','9','10']
            let lowIncomeOptions = response.data.workOptions[0].lowIncomeOptions
            lowIncomeOptions.unshift('')
            let fosterYouthOptions = response.data.workOptions[0].fosterYouthOptions
            fosterYouthOptions.unshift('')
            let homelessOptions = response.data.workOptions[0].homelessOptions
            homelessOptions.unshift('')
            let incarceratedOptions = response.data.workOptions[0].incarceratedOptions
            incarceratedOptions.unshift('')

            const year = (new Date().getFullYear() - 18).toString()
            let month = ''
            if ((new Date().getMonth() + 1) >= 10) {
              month = (new Date().getMonth() + 1).toString()
            } else {
              month = '0' + (new Date().getMonth() + 1).toString()
            }

            const day = new Date().getDate().toString()
            const defaultDate = year + '-' + month + '-' + day

            let questions = [
              { category: 'basic', name: 'Date of Birth', type: 'Date', field: 'dateOfBirth', placeholder: 'e.g. 04/13/98', answer: defaultDate, required: true },
              { category: 'basic', name: 'Gender', type: 'Multiple Choice', field: 'gender', options: genderOptions, required: true },
              { category: 'basic', name: 'Race', type: 'Multiple Choice', field: 'race', options: raceOptions, required: true },
              { category: 'basic', name: 'Home Address (No Zip Code)', type: 'Short Answer', field: 'homeAddress', placeholder: 'e.g. 111 Candy Cane Lane Los Angeles, CA', required: true },
              { category: 'basic', name: 'Zip Code', type: 'Short Answer', field: 'zipcode', placeholder: 'e.g. 90062', required: true },
              { category: 'basic', name: 'Phone Number', type: 'Short Answer', field: 'phoneNumber', placeholder: 'e.g. (323) 299-2991', required: true },
              { category: 'diversity', name: 'Number of Members in Household', type: 'Multiple Choice', field: 'numberOfMembers', options: basicCountOptions, required: true },
              { category: 'diversity', name: 'Estimated Household Income', type: 'Multiple Choice', field: 'householdIncome', options: lowIncomeOptions, required: true },
              { category: 'diversity', name: 'Have you ever been a foster youth?', type: 'Multiple Choice', field: 'fosterYouth', options: fosterYouthOptions, required: true },
              { category: 'diversity', name: 'Are you currently or formerly homeless?', type: 'Multiple Choice', field: 'homeless', options: homelessOptions, required: true },
              { category: 'diversity', name: 'Were you previously incarcerated?', type: 'Multiple Choice', field: 'incarcerated', options: incarceratedOptions, required: true },
              { category: 'diversity', name: 'Designate all that apply.', type: 'Multiple Answer', field: 'adversity', options: ['LGBQIA','ADA','First Generation Immigrant','First Generation College Student','Low Income','None'], required: true },
              { category: 'referral', name: 'Name of person who recommended you', type: 'Short Answer', field: 'referrerName', placeholder: 'e.g. John Smith', required: false },
              { category: 'referral', name: 'Email of person who recommended you', type: 'Short Answer', field: 'referrerEmail', placeholder: 'e.g. johnsmith@love.org', required: false },
              { category: 'referral', name: 'Name of organization that referred you', type: 'Short Answer', field: 'referrerOrg', options: [], placeholder: 'e.g. Franklin High', required: false },
              { category: 'referral', name: 'To enroll in our next WorkforceReady cohort, check here!', type: 'Checkbox', field: 'autoEnrollInProgram', options: [], placeholder: '', required: false },
            ]

            this.setState({ questions })

            Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
            .then((response) => {
              console.log('Org info query attempted cc', response.data);

                if (response.data.success) {
                  console.log('org info query worked')

                  const possibleReferrers = response.data.orgInfo.possibleReferrers
                  if (questions[questions.length - 1].field === 'referrerOrg') {
                    questions[questions.length - 1]['options'] = possibleReferrers
                  }

                  const partnerStatement = response.data.orgInfo.partnerStatement
                  const partnerName = response.data.orgInfo.orgName.toLowerCase().replace(/ /g, "-")
                  const orgName = response.data.orgInfo.orgName
                  const orgLogo = response.data.orgInfo.webLogoURIColor

                  this.setState({ questions, partnerStatement, partnerName, orgName, orgLogo })

                  this.pullProfileData(email, questions)

                } else {
                  console.log('org info query did not work', response.data.message)
                }

            }).catch((error) => {
                console.log('Org info query did not work for some reason', error);
            });

          } else {
            console.log('no work options data found', response.data.message)

          }
        }).catch((error) => {
            console.log('query for work options did not work', error);
        })

        Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId: email } })
         .then((response) => {
           console.log('query for assessment results worked');

           if (response.data.success) {
             console.log('actual assessment results', response.data)

             let newSkillAnswers = null
             if (response.data.results.newSkillAnswers && response.data.results.newSkillAnswers.length > 0) {
               newSkillAnswers = response.data.results.newSkillAnswers
             }
             this.setState({ skillsData: newSkillAnswers })

           }

        }).catch((error) => {
           console.log('query for assessment results did not work', error);
        })

        Axios.get('https://www.guidedcompass.com/api/groups', { params: { orgCode: activeOrg, emailId: email, type: 'myGroups' }})
        .then((response) => {
         console.log('My groups query worked', response.data);

          if (response.data.success) {

            let groupsJoined = response.data.groups
            this.setState({ groupsJoined })

          } else {
           console.log('no my groups data found', response.data.message)
          }

        }).catch((error) => {
           console.log('My groups query did not work', error);
        });

        const containerWidth = '94%'
        const containerPadding = '20px'
        const sideContainerWidth = '3%'

        this.setState({ containerWidth, containerPadding, sideContainerWidth })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  pullProfileData(email, questions) {
    console.log('pullProfileData called ', email, questions)

    Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
    .then((response) => {

        if (response.data.success) {
          console.log('User profile query worked', response.data);

          const referrerName = response.data.user.referrerName
          const referrerEmail = response.data.user.referrerEmail
          const referrerOrg = response.data.user.referrerOrg
          let autoEnrollInProgram = response.data.user.autoEnrollInProgram
          if (!autoEnrollInProgram && autoEnrollInProgram !== false) {
            autoEnrollInProgram = true
          }

          this.setState({ referrerName, referrerEmail, referrerOrg, autoEnrollInProgram });

        } else {
          console.log('no user details found', response.data.message)

        }

    }).catch((error) => {
        console.log('User profile query did not work', error);
    });
  }

  formChangeHandler = (eventName,eventValue) => {
    console.log('formChangeHandler called ')

    if (eventName.includes('question')) {
      const index = Number(eventName.split('|')[1])
      for (let i = 1; i <= this.state.questions.length; i++) {
        console.log('compare indices: ', index, i - 1, typeof index)
        if (index === i - 1) {
          let questions = this.state.questions
          questions[index]['answer'] = eventValue
          console.log('show questions after form: ', questions)
          this.setState({ questions, formHasChanged: true })
        }
      }
    } else {
      this.setState({ [eventName]: eventValue })
    }
  }

  movePage(forward) {
    console.log('moveForward called', this.state.pageIndex)

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    if (forward) {
      if (this.state.pageIndex === 1) {
        if (this.state.requireReferrer && (!this.state.referrerName || this.state.referrerName === '')) {
          this.setState({ errorMessage: 'Please add a name of your referrer', isSaving: false })
        } else if (this.state.requireReferrer && (!this.state.referrerEmail || this.state.referrerEmail === '')) {
          this.setState({ errorMessage: 'Please add the email of your referrer', isSaving: false })
        } else if (this.state.requireReferrer && (!this.state.referrerOrg || this.state.referrerOrg === '')) {
          this.setState({ errorMessage: 'Please add the organization of your referrer', isSaving: false })
        } else {
          // save answers

          if (this.state.requireReferrer) {
            this.saveToProfile()
          } else {
            this.setState({ pageIndex: this.state.pageIndex + 1 })
          }

        }
      } else if (this.state.pageIndex === 2) {
        // this is handled by EditProfileDetails

        this.setState({ pageIndex: this.state.pageIndex + 1, isSaving: false })

        // window.scrollTo(0, 0)
        // this.setState({ pageIndex: this.state.pageIndex + 1, isSaving: false })
      } else if (this.state.pageIndex === 3) {

        this.saveToProfile()

      } else if (this.state.pageIndex === 4) {

        // window.scrollTo(0, 0)

        this.setState({ pageIndex: this.state.pageIndex + 1, isSaving: false })

      } else {
        // save and move to the app

        // window.scrollTo(0, 0)

        if (this.props.opportunityId) {
          this.props.navigation.navigate('OpportunityDetails', { objectId: this.props.opportunityId })
        } else {
          this.props.navigation.navigate('App')
        }
      }
      // this.setState({ pageIndex: this.state.pageIndex + 1 })
    } else  {
      // window.scrollTo(0, 0)
      this.setState({ pageIndex: this.state.pageIndex - 1, isSaving: false })
    }
  }

  saveToProfile(employerProfile) {
    console.log('saveToProfile called', employerProfile)

    if (employerProfile) {
      // save departments

      const accountCode = this.state.accountCode
      const departments = this.state.departments

      Axios.post('https://www.guidedcompass.com/api/account/update', { accountCode, departments })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Account update worked', response.data);

          // window.scrollTo(0, 0)
          this.setState({ successMessage: 'Account information saved successfully!', pageIndex: this.state.pageIndex + 1, isSaving: false })

        } else {
          console.error('there was an error updating the account info');
          this.setState({ errorMessage: response.data.message })
        }
      }).catch((error) => {
          console.log('Account info save did not work', error);
          this.setState({ errorMessage: error.toString() })
      });

    } else {
      const emailId = this.state.emailId
      const referrerName = this.state.referrerName
      const referrerEmail = this.state.referrerEmail
      const referrerOrg = this.state.referrerOrg
      const autoEnrollInProgram = this.state.autoEnrollInProgram
      const updatedAt = new Date()

      const userObject = { emailId, referrerName, referrerEmail, referrerOrg, autoEnrollInProgram, updatedAt }
      Axios.post('https://www.guidedcompass.com/api/users/profile/details', userObject)
      .then((response) => {

        if (response.data.success) {
          console.log('successfully saved profile')

          this.setState({ pageIndex: this.state.pageIndex + 1, isSaving: false })

        } else {
          console.log('profile save was not successful')

          console.log('request was not successful')
          this.setState({ errorMessage: 'Information was not saved successfully: ' + response.data.message, isSaving: false })

        }
      }).catch((error) => {
          console.log('Saving the info did not work', error);

      });
    }
  }

  optionClicked(index, optionIndex) {
    console.log('optionClicked called', index, optionIndex)

    let autoEnrollInProgram = this.state.autoEnrollInProgram
    if (autoEnrollInProgram) {
      this.setState({ autoEnrollInProgram: false })
    } else {
      this.setState({ autoEnrollInProgram: true })
    }
  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showGoal: false, showEditGroup: false, showSearchGroups: false,
      showAddWorkspaces: false, enlargeImage: false, showCreateBenchmark: false, showSocialPost: false, showATS: false,
      showCreateEvent: false, showCreateProject: false, showCreatePipeline: false, showCreateCommunity: false, showCreateWork: false,
      showAddWorkspaces: false
    })
  }

  passGoal(goal) {
    console.log('passGoal called', goal)

    this.setState({ passedGoal: goal })
  }

  passGroup(group, add) {
    console.log('passGroup called in walkthrough', group, add)

    let groupsJoined = this.state.groupsJoined
    if (add) {
      if (groupsJoined) {
        console.log('t0', groupsJoined)
        // groupsJoined.push(group)
        groupsJoined = [group].concat(groupsJoined)
      } else {
        groupsJoined = [group]
      }
    } else {

      if (groupsJoined) {
        let index = 0
        for (let i = 1; i <= groupsJoined.length; i++) {
          if (groupsJoined[i - 1]._id === group._id) {
            index = i - 1
          }
        }
        groupsJoined.splice(index,1)
      }
    }
    console.log('t1', groupsJoined)
    this.setState({ groupsJoined })
  }

  passOrgs(activeOrg, myOrgs, orgFocus, orgName, orgLogo) {
    console.log('passOrgs called', activeOrg, myOrgs, orgFocus, orgName, orgLogo )

    this.setState({ activeOrg, myOrgs, orgFocus, orgName, orgLogo })
    this.closeModal()

  }

  passPosts(socialPosts) {
    console.log('passPosts called')

    this.setState({ socialPosts })
  }

  render() {

    return (
      <ScrollView>
        <View style={[styles.fullScreenWidth,styles.lightBackground,styles.padding20]}>
          <View style={[styles.topMargin20,styles.fullScreenWidth,styles.alignCenter]}>
            <Image source={(this.state.orgLogo) ? { uri: this.state.orgLogo} : { uri: industryIconDark}} style={(this.state.activeOrg === 'guidedcompass') ? [styles.square50,styles.contain] : [styles.square80,styles.contain]}/>
          </View>

          <View style={[styles.topMargin20]}>
            <Text style={[styles.fullScreenWidth,styles.centerText,styles.headingText3]}>Build your profile</Text>
          </View>

          <View style={[styles.topMargin20]}>
            <Text>Step {this.state.pageIndex} of {this.state.pages.length}</Text>
            <View style={[styles.progressBarThin,styles.topMargin]} >
              {(this.state.pages.length > 0) ? (
                <View>
                  <View style={[styles.ctaBackgroundColor, styles.height6, styles.borderRadius50,{ width: Math.round((this.state.pageIndex / this.state.pages.length) * 100).toString() + '%' }]} />
                </View>
              ) : (
                <View />
              )}

            </View>
          </View>
        </View>
        <View style={[styles.flex1,styles.whiteBackground]}>
          <View style={[styles.padding30]}>
            {(this.state.pageIndex === 1) && (
              <View>
                <View>
                  <Text style={[styles.headingText2]}>Welcome to the {this.state.orgName} Portal, {this.state.cuFirstName}!</Text>

                  <View style={[styles.topMargin20]}>
                    <View style={[styles.lightHorizontalLine]} />

                    <View style={[styles.row30]}>
                      <View style={[styles.row10]}>
                        <View style={[styles.row20]}>
                          <View style={[styles.rowDirection]}>
                            <View style={[styles.width70,styles.topMargin5]}>
                              <Image source={{ uri: socialIconBlue}} style={[styles.square50,styles.contain]} />
                            </View>
                            <View style={[styles.calcColumn130]}>
                              <Text style={[styles.headingText4,styles.row5]}>Build Your Supportive Community</Text>
                              <Text style={[styles.descriptionText1]}>Connect with others, join accountability groups, attend career events, get feedback on projects, follow employers, and get support from {this.state.orgName} staff.</Text>
                            </View>

                          </View>
                        </View>

                        <View style={[styles.row20]}>
                          <View style={[styles.rowDirection]}>
                            <View style={[styles.width70,styles.topMargin5]}>
                              <Image source={{ uri: careerMatchesIconBlue}} style={[styles.square50,styles.contain]} />
                            </View>
                            <View style={[styles.calcColumn130]}>
                              <Text style={[styles.headingText4,styles.row5]}>Prepare for Your Best Life</Text>
                              <Text style={[styles.descriptionText1]}>Set career goals, take career assessments, explore career paths, make financial plans, get personalized resources, get interview feedback, and submit projects for feedback.</Text>
                            </View>

                          </View>
                        </View>

                        <View style={[styles.row20]}>
                          <View style={[styles.rowDirection]}>
                            <View style={[styles.width70,styles.topMargin5]}>
                              <Image source={{ uri: moneyIconBlue}} style={[styles.square50,styles.contain]} />
                            </View>
                            <View style={[styles.calcColumn130]}>
                              <Text style={[styles.headingText4,styles.row5]}>Land Paid Work Opportunities</Text>
                              <Text style={[styles.descriptionText1]}>Activities in your portal strengthen your candidacy, and make it easier to recommend you for specific opportunities. Import your profile to apply for paid work opportunities.</Text>
                            </View>

                          </View>
                        </View>
                      </View>
                      <View style={[styles.row10]}>
                        {/*
                        guidedcompass => looking to join one of our workforce partner workspaces?
                        clever / schoology => image showing what we do
                        unite-la => partnership definition?
                        */}

                        <View style={[styles.horizontalPadding30,styles.alignCenter]}>

                          <Image style={[styles.square300,styles.contain,styles.topMargin20]} source={{ uri: gcFrontImage}} />

                          <View style={[styles.spacer]} />

                          {(this.state.activeOrg === 'guidedcompass') && (
                            <View style={[styles.calcColumn60]}>
                              <Text style={[styles.descriptionText2,styles.centerText]}>Were you referred by one of our workforce partners?</Text>
                              <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                              <TouchableOpacity style={[styles.row5]} onPress={() => this.setState({ modalIsOpen: true, showAddWorkspaces: true })}><Text style={[styles.ctaColor,styles.underlineText,styles.offsetUnderline,styles.boldText,styles.centerText]}>Join Their Workspace</Text></TouchableOpacity>
                            </View>
                          )}
                        </View>

                      </View>


                    </View>
                  </View>

                  {(this.state.requireReferrer) && (
                    <View style={[styles.calcColumn60,styles.topMargin20]}>
                      <View style={[styles.lightHorizontalLine]} />

                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                      <View style={[styles.row10]}>
                        <Text style={[styles.headingText3]}>What brought you here?</Text>
                      </View>

                      <View style={[styles.row10]}>
                        <View style={[styles.row10]}>
                          <Text style={[styles.row10,styles.standardText]}>Name of person who recommended you (N/A if no one)<Text style={[styles.errorColor,styles.boldText]}> *</Text></Text>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("referrerName", text)}
                            value={this.state.referrerName}
                            placeholder="e.g. Jonnie Doe"
                            placeholderTextColor="grey"
                          />
                        </View>
                        <View style={[styles.row10]}>
                          <Text style={[styles.row10,styles.standardText]}>Email of person who recommended you (N/A if no one)<Text style={[styles.errorColor,styles.boldText]}> *</Text></Text>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("referrerEmail", text)}
                            value={this.state.referrerEmail}
                            placeholder="e.g. jonnie@gmail.com"
                            placeholderTextColor="grey"
                          />
                        </View>

                      </View>

                      <View style={[styles.row10]}>
                        <View style={[styles.row10]}>
                          <Text style={[styles.row10,styles.standardText]}>Name of organization that recommended you (N/A if no org)<Text style={[styles.errorColor,styles.boldText]}> *</Text></Text>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("referrerOrg", text)}
                            value={this.state.referrerOrg}
                            placeholder="e.g. Washington High School"
                            placeholderTextColor="grey"
                          />
                        </View>

                      </View>
                    </View>
                  )}
                </View>

                <View style={[styles.calcColumn60,styles.topMargin50]}>
                  <View style={[styles.lightHorizontalLine]} />

                  <View style={[styles.calcColumn60,styles.topMargin50]}>
                    {(this.state.pageIndex > 1) ? (
                      <View style={[styles.flex50,styles.rightPadding5]}>
                        <TouchableOpacity style={[styles.btnPrimary,styles.mediumBackground,styles.standardBorder,styles.flexCenter]} onPress={() => this.setState({ pageIndex: this.state.pageIndex - 1 })}><Text style={[styles.standardText,styles.whiteColor]}>Back</Text></TouchableOpacity>
                      </View>
                    ) : (
                      <View style={[styles.flex50,styles.rightPadding5]}>
                        <View style={[styles.square40]} />
                      </View>
                    )}

                    <View style={[styles.flex50,styles.leftPadding5]}>
                      <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.isSaving} onPress={() => this.movePage(true)}><Text style={[styles.standardText,styles.whiteColor]}>Next step</Text></TouchableOpacity>
                    </View>
                  </View>

                  {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor,styles.bottomPadding,styles.calcColumn60,styles.rightText]}>{this.state.errorMessage}</Text>}
                  {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor,styles.bottomPadding,styles.calcColumn60,styles.rightText]}>{this.state.successMessage}</Text>}
                </View>
              </View>
            )}

            {(this.state.pageIndex === 2) && (
              <View>
                <View>
                  <Text style={[styles.headingText2]}>Who you are</Text>

                  <View>
                    <SubEditProfileDetails activeOrg={this.state.activeOrg} navigation={this.props.navigation} location={this.props.location} passedType="Basic" movePage={this.movePage} fromWalkthrough={true} />
                  </View>
                </View>
              </View>
            )}

            {(this.state.pageIndex === 3) && (
              <View>
                <View>
                  <Text style={[styles.headingText2]}>What you want</Text>

                  <View style={[styles.topMargin50]}>
                    <View style={[styles.row10]}>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.calcColumn100]}>
                          <Text style={[styles.headingText3]}>Career Goals (Optional)</Text>
                        </View>
                        <View style={[styles.width40]}>
                          <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showGoal: true })}>
                            <Image source={{ uri: addIcon}} style={[styles.square25,styles.contain]} />
                          </TouchableOpacity>
                        </View>

                      </View>

                      <Text>Set goals to get resources and hold yourself accountable.</Text>
                      <SubLogs logType="Goal" navigation={this.props.navigation} passedGoal={this.state.passedGoal} modalView={true} fromWalkthrough={true} />
                    </View>

                    <View style={[styles.row20]}>
                      <View style={[styles.lightHorizontalLine]} />
                    </View>

                    <View style={[styles.row15]}>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.calcColumn140]}>
                          <Text style={[styles.headingText3]}>Accountability Groups (Optional)</Text>
                        </View>
                        <View style={[styles.width40]}>
                          <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showEditGroup: true })}>
                            <Image source={{ uri: addIcon}} style={[styles.square25,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.width40]}>
                          <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showSearchGroups: true })}>
                            <Image source={{ uri: searchIcon}} style={[styles.square25,styles.contain]} />
                          </TouchableOpacity>
                        </View>

                      </View>
                      <Text>Would you like to create or join accountability groups to help you accomplish your goals?</Text>
                    </View>

                    <SubRenderMyGroups navigation={this.props.navigation} groups={this.state.groupsJoined} passedCategory="Accountability" fromWalkthrough={true} />

                    {(this.state.activeOrg === 'unite-la') && (
                      <View>
                        <View style={[styles.row20]}>
                          <View style={[styles.lightHorizontalLine]} />
                        </View>

                        <View style={[styles.row15]}>

                          <View style={[styles.row10]}>
                            <Text style={[styles.headingText3]}>Partner Offerings</Text>
                          </View>

                          <View style={[styles.topPadding20]}>
                            <Text style={[styles.headingText6,styles.boldText]}>Workforce Ready</Text>
                          </View>

                          <View style={[styles.row10]}>
                            <Text>Cornerstone OnDemand has created WorkforceReady Modules to help you develop the soft skills necessary for the future of work. These are free lessons that must be completed before UNITE-LA staff refers you to internship / work opportunities.</Text>
                          </View>

                          <View style={[styles.row10,styles.rowDirection]}>
                            <View style={[styles.width30]}>
                              <TouchableOpacity onPress={() => this.optionClicked(null, null)}>
                                <Image source={this.state.autoEnrollInProgram ? { uri: checkboxChecked} : { uri: checkboxEmpty} } style={[styles.square20,styles.contain]} />
                              </TouchableOpacity>
                            </View>
                            <View style={[styles.calcColumn90]}>
                              <Text>Click the box to enroll/un-enroll in the next WorkforceReady Cohort</Text>
                            </View>

                          </View>
                        </View>
                      </View>
                    )}

                    {/*
                    <View style={[styles.row10]}>
                      <Text style={[styles.headingText3]}>Partner Workspaces</Text>
                      <Text>Would you like to join training partner workspaces to help you accomplish your goals?</Text>
                    </View>*/}
                  </View>

                  <View style={[styles.calcColumn60,styles.topMargin50]}>
                    <View style={[styles.lightHorizontalLine]} />

                    <View style={[styles.calcColumn60,styles.topMargin50,styles.rowDirection,styles.flex1]}>

                      {(this.state.pageIndex > 1) ? (
                        <View style={[styles.flex50,styles.rightPadding5]}>
                          <TouchableOpacity style={[styles.btnPrimary,styles.mediumBackground,styles.standardBorder,styles.flexCenter]} onPress={() => this.movePage(false)}><Text style={[styles.standardText,styles.whiteColor]}>Back</Text></TouchableOpacity>
                        </View>
                      ) : (
                        <View style={[styles.flex50,styles.rightPadding5]}>
                          <View style={[styles.square40]} />
                        </View>
                      )}

                      <View style={[styles.flex50,styles.leftPadding5]}>
                        <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.isSaving} onPress={() => this.movePage(true)}><Text style={[styles.standardText,styles.whiteColor]}>Next step</Text></TouchableOpacity>
                      </View>

                    </View>
                  </View>
                </View>
              </View>
            )}

            {(this.state.pageIndex === 4) && (
              <View>
                <Text style={[styles.headingText2]}>What you're great at</Text>

                <View style={[styles.topMargin30]}>
                  <Text>We're here to help. If you need help defining what you're great at, select a pathway for recommendations. These recommendations come from <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/help/what-are-benchmarks')}><Text style={[styles.ctaColor,styles.boldText]}>Guided Compass Benchmarks</Text></TouchableOpacity>, which are the ideal candidates defined by programs and employers for career pathways and opportunities. Benchmarks help us recommend opportunities to you and help us help you build a career development roadmap based on your goals.</Text>
                </View>

                <View style={[styles.topMargin30]}>
                  <Text style={[styles.headingText3]}>Skill Self-Assessment (Optional)</Text>
                  <Text style={[styles.topMargin5]}>Add some of the skills you're best at.</Text>
                  <SubTakeAssessment navigation={this.props.navigation} type="skills" assessmentTitle="Skill Self-Assessment" assessments={this.state.assessments} index={3} assessment={this.state.assessment} resultsData={[null, null, null, this.state.skillsData, null]} assessmentDescription={this.state.assessmentDescription} fromWalkthrough={true}/>
                </View>

                <View style={[styles.row20]}>
                  <View style={[styles.lightHorizontalLine]} />
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.headingText3]}>Request an Endorsement (Optional)</Text>

                  <SubRequestEndorsements enableRequestEndorsement="" />
                </View>

                <View style={[styles.calcColumn60,styles.topMargin50]}>
                  <View style={[styles.lightHorizontalLine]} />

                  <View style={[styles.calcColumn60,styles.topMargin50,styles.rowDirection,styles.flex1]}>
                    {(this.state.pageIndex > 1) ? (
                      <View style={[styles.flex50,styles.rightPadding5]}>
                        <TouchableOpacity style={[styles.btnPrimary,styles.mediumBackground,styles.standardBorder,styles.flexCenter]} onPress={() => this.movePage(false)}><Text style={[styles.standardText,styles.whiteColor]}>Back</Text></TouchableOpacity>
                      </View>
                    ) : (
                      <View style={[styles.flex50,styles.rightPadding5]}>
                        <View style={[styles.square40]} />
                      </View>
                    )}

                    <View style={[styles.flex50,styles.leftPadding5]}>
                      <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.isSaving} onPress={() => this.movePage(true)}><Text style={[styles.standardText,styles.whiteColor]}>Next step</Text></TouchableOpacity>
                    </View>

                  </View>
                </View>

              </View>
            )}

            {(this.state.pageIndex === 5) && (
              <View>
                <Text style={[styles.headingText2]}>Who can see your profile</Text>

                <SubEditProfileDetails activeOrg={this.state.activeOrg} navigation={this.props.navigation} location={this.props.location} passedType="Public" movePage={this.movePage} opportunityId={this.props.opportunityId} fromWalkthrough={true}/>

              </View>
            )}
          </View>

        </View>


        {(this.state.showGoal) && (
          <View>
            <SubEditLog modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} navigation={this.props.navigation} editExisting={this.state.editExisting} log={this.state.log} logs={this.state.logs} passedLogType="Goal" selectedAdvisor={this.state.selectedAdvisor} logId={this.state.logId} passGoal={this.passGoal} modalView={true} fromWalkthrough={true}/>
          </View>
        )}

        {(this.state.showEditGroup || this.state.showSearchGroups || this.state.showAddWorkspaces || this.state.enlargeImage || this.state.showCreateBenchmark || this.state.showATS || this.state.showSocialPost || this.state.showCreateEvent || this.state.showCreateProject || this.state.showCreatePipeline || this.state.showCreateCommunity || this.state.showCreateWork) && (
          <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
            <View key="showEditGroup" style={[styles.padding20]}>
              {(this.state.showEditGroup) && (
                <SubEditGroup selectedGroup={this.state.selectedGroup} navigation={this.props.navigation} modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} passGroup={this.passGroup} fromWalkthrough={true}/>
              )}
              {(this.state.showSearchGroups) && (
                <View>
                  <SubGroups navigation={this.props.navigation} category="Accountability" fromWalkthrough={true} modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} />
                </View>
              )}

              {(this.state.showAddWorkspaces) && (
                <SubAddWorkspaces selectedGroup={null} navigation={this.props.navigation} closeModal={this.closeModal}
                  accountCode={this.state.accountCode} employerLogoURI={this.state.employerLogoURI}
                  employerName={this.state.employerName} jobFunction={this.state.jobFunction}
                  pathway={this.state.pathway} passOrgs={this.state.passOrgs} fromWalkthrough={true}
                />
              )}

              {(this.state.enlargeImage) && (
                <View>
                  <Image source={{ uri: exampleInternMatch}} style={[styles.flex1]} />
                  <View style={[styles.row10]}>
                    <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}>
                      <Text style={[styles.standardText,styles.ctaColor,styles.centerText]}>Close View</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
              {(this.state.showCreateBenchmark) && (
                <SubEditBenchmark navigation={this.props.navigation} passData={this.passData} fromWalkthrough={true} />
              )}
              {(this.state.showSocialPost) && (
                <SubCreatePost sharePosting={this.state.sharePosting} originalPost={this.state.originalPost} posts={this.state.socialPosts} passPosts={this.passPosts} closeModal={this.closeModal} pictureURL={this.state.employerLogo} accountCode={this.state.accountCode} jobTitle={this.state.jobTitle} fromWalkthrough={true} />
              )}

              {(this.state.showCreateCommunity) && (
                <SubEditGroup selectedGroup={null} navigation={this.props.navigation} closeModal={this.closeModal}
                  accountCode={this.state.accountCode} employerLogoURI={this.state.employerLogoURI}
                  employerName={this.state.employerName} jobFunction={'Marketing'}
                  pathway={this.state.pathway} fromWalkthrough={true}
                />
              )}
             </View>
          </Modal>
        )}
      </ScrollView>
    )
  }

}

export default Walkthrough;
