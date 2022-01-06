import React, { Component } from 'react';
import { View, Text, SectionList, Linking, AsyncStorage, Share, TouchableOpacity, ScrollView, Image, Switch } from 'react-native';
import Axios from 'axios';
import Modal from 'react-native-modal';
const styles = require('./css/style');
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';


import SwitchOrgs from './common/SwitchOrgs';
// import {signOut} from '../services/AuthRoutes';

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      myOrgs: [],
      dataToShare: [],

      typeOptions: ['','For-Profit','Non-Profit','Public Sector'],
      postOptions: [],
      cteModelStandardsOptions: [],
      cteModelStandards: ['Arts, Media, and Entertainment','Information and Communication Technologies','Public Services','Education, Child Development, and Family Services'],
      wblPreferenceOptions: ['Mentors','Career Events','Projects','Work'],
      wblPreferences: [],

      pathwayOptions: [],
      pathways: [],

      editPathwayMode: false,
      careerTrackOptions: [],
      availableAssessments: [],
      standardAssessments: [],
      industryOptions: [],
      countOptions: [],
      growthOptions: [],

      binaryOptions: ['','Yes','No'],
      maybeOptions: ['','Yes','Maybe','No'],
      officeTypeOptions: [],
      politicalAlignmentOptions: [],
      registrationOptions: [],
      timeframeOptions: [],

    }

    this.signOut = this.signOut.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.saveSettings = this.saveSettings.bind(this)

    this.closeModal = this.closeModal.bind(this)

    this.renderDataToShare = this.renderDataToShare.bind(this)

    this.shareApp = this.shareApp.bind(this)

    this.exportToCSV = this.exportToCSV.bind(this)
    this.savePreferences = this.savePreferences.bind(this)
    this.savePersonalInfo = this.savePersonalInfo.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount in settings')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      console.log('retrieveData called in settings')

      const emailId = await AsyncStorage.getItem('email');
      const email = emailId
      const username = await AsyncStorage.getItem('username');
      const cuFirstName = await AsyncStorage.getItem('firstName');
      const cuLastName = await AsyncStorage.getItem('lastName');
      let activeOrg = await AsyncStorage.getItem('activeOrg');
      if (!activeOrg) {
        activeOrg = 'guidedcompass'
      }
      const accountCode = AsyncStorage.getItem('accountCode')
      const orgFocus = await AsyncStorage.getItem('orgFocus');
      const roleName = await AsyncStorage.getItem('roleName');
      let pictureURL = await AsyncStorage.getItem('pictureURL');

      let dataToShare = [
        'Name', 'Profile Photo','Resume URL','LinkedIn URL','Portfolio URL','School','Major / Pathway','Graduation Year','Race','Gender','Veteran Status','Work Authorization','Projects','Experience','Career Assessments','Endorsements'
      ]

      let showWalkthrough = true

      let availableAssessments = []
      let timeframeOptions = []

      let problemPlatformOrg = false
      let problemPlatformEmployer = false

      this.setState({ emailId: email, accountCode, activeOrg, orgFocus, roleName, dataToShare, showWalkthrough,
        availableAssessments, timeframeOptions });

      if (this.props.fromAdvisor) {

        // Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
        // .then((response) => {
        //   console.log('Org info query attempted', response.data);
        //
        //     if (response.data.success) {
        //       console.log('org info query worked')
        //
        //       const orgName = response.data.orgInfo.orgName
        //       const academies = response.data.orgInfo.academies
        //       let includeGuidedCompass = false
        //       if (response.data.orgInfo.placementPartners && response.data.orgInfo.placementPartners.includes('guidedcompass')) {
        //         includeGuidedCompass = true
        //       }
        //       const wblPreferences = response.data.orgInfo.wblPreferences
        //
        //
        //       console.log('show academies: ', academies)
        //       let academyCodes = []
        //       if (academies && academies.length > 0) {
        //         for (let i = 1; i <= academies.length; i++) {
        //           academyCodes.push(academies[i - 1].orgCode)
        //         }
        //       }
        //
        //       this.setState({ orgName, academies, academyCodes, includeGuidedCompass, wblPreferences });
        //
        //       // let courses = []
        //       // if (response.data.orgInfo.courseIds && response.data.orgInfo.courseIds.length > 0) {
        //       //   console.log('courses exist')
        //       //
        //       // }
        //
        //     } else {
        //       console.log('org info query did not work', response.data.message)
        //     }
        //
        // }).catch((error) => {
        //     console.log('Org info query did not work for some reason', error);
        // });
        //
        // Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
        // .then((response) => {
        //
        //     if (response.data.success) {
        //       console.log('User profile query worked', response.data);
        //
        //       const user = response.data.user
        //       const firstNameValue = response.data.user.firstName
        //       const lastNameValue = response.data.user.lastName
        //       const linkedInURLValue = response.data.user.linkedInURL
        //       const resumeURLValue = response.data.user.resumeURL
        //       const customWebsiteURLValue = response.data.user.customWebsiteURL
        //       const jobTitle = response.data.user.jobTitle
        //       const employerName = response.data.user.employerName
        //       const workZipcode = response.data.user.workZipcode
        //       const workTenure = response.data.user.workTenure
        //       const overallFit = response.data.user.overallFit
        //       const degreeAttained = response.data.user.degreeAttained
        //       const schoolName = response.data.user.schoolName
        //       const studyFields = response.data.user.studyFields
        //       const myOrgs = response.data.user.myOrgs
        //
        //       this.setState({
        //         user, firstNameValue, lastNameValue, linkedInURLValue, resumeURLValue, customWebsiteURLValue,
        //         jobTitle, employerName, workZipcode, workTenure, overallFit, degreeAttained, schoolName, studyFields,
        //         myOrgs
        //       });
        //
        //       const courseIds = response.data.user.courseIds
        //
        //       if (courseIds && courseIds.length > 0) {
        //         // pull from courses
        //
        //         Axios.get('https://www.guidedcompass.com/api/courses', { params: { courseIds } })
        //         .then((response) => {
        //
        //             if (response.data.success) {
        //               console.log('Courses query worked', response.data);
        //
        //               const courses = response.data.courses
        //               this.setState({ courses })
        //
        //             } else {
        //               console.log('no course details found', response.data.message)
        //             }
        //
        //         }).catch((error) => {
        //             console.log('course query did not work', error);
        //         });
        //
        //         Axios.get('https://www.guidedcompass.com/api/grades', { params: { orgCode: activeOrg, courseIds } })
        //         .then((response) => {
        //           console.log('Grades query attempted', response.data);
        //
        //             if (response.data.success) {
        //               console.log('grades query worked')
        //
        //               const grades = response.data.grades
        //               const students = response.data.students
        //               const projectNames = response.data.projectNames
        //
        //               this.setState({ grades, students, projectNames })
        //
        //             } else {
        //               console.log('grades query did not work', response.data.message)
        //             }
        //
        //         }).catch((error) => {
        //             console.log('Grades query did not work for some reason', error);
        //         });
        //
        //       }
        //
        //     } else {
        //       console.log('no user details found', response.data.message)
        //
        //     }
        //
        // }).catch((error) => {
        //     console.log('User profile query did not work', error);
        // });

      } else {
        // student

        Axios.get('https://www.guidedcompass.com/api/work', { params: { workerEmail: email, onlyCurrent: true } })
        .then((response) => {
          console.log('Work query attempted within employer dashboard', response.data);

          if (response.data.success) {
            console.log('account info query worked in sub settings')

            if (response.data.workArray && response.data.workArray.length > 0) {
              this.setState({ isWorking: true });
            }
          }

        }).catch((error) => {
          console.log('Account info query did not work for some reason', error);
        });

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
        .then((response) => {
          console.log('Org query attempted', response.data);

           if (response.data.success) {
             console.log('successfully retrieved org')

             const orgName = response.data.orgInfo.orgName
             const academies = response.data.orgInfo.academies

             console.log('show academies: ', academies)
             let academyCodes = []
             if (academies && academies.length > 0) {
               for (let i = 1; i <= academies.length; i++) {
                 academyCodes.push(academies[i - 1].orgCode)
               }
             }

             const disableWeeklyEmails = response.data.orgInfo.disableWeeklyEmails
             this.setState({ orgName, academies, academyCodes, disableWeeklyEmails });

           } else {
             console.log('no org data found', response.data.message)
             // this.setState({ serverErrorMessage: 'No org found'})
           }

        }).catch((error) => {
           console.log('Org query did not work', error);
           // this.setState({ serverErrorMessage: 'No org found'})
        });

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
        .then((response) => {

            if (response.data.success) {
              console.log('User profile query worked', response.data);

              const user = response.data.user
              const roleName = response.data.user.roleName
              const remoteAuth = response.data.user.remoteAuth
              const activeOrg = response.data.user.activeOrg
              const myOrgs = response.data.user.myOrgs
              const openToMentoring = response.data.user.openToMentoring
              const workMode = response.data.user.workMode
              let subscribed = true
              if (response.data.user.unsubscribed) {
                subscribed = false
              }

              const firstNameValue = response.data.user.firstName
              const lastNameValue = response.data.user.lastName
              const publicProfile = response.data.user.publicProfile

              this.setState({
                user, roleName, remoteAuth, activeOrg, myOrgs, openToMentoring, workMode, subscribed,
                firstNameValue, lastNameValue, publicProfile
              });

            } else {
              console.log('no user details found', response.data.message)

            }

        }).catch((error) => {
            console.log('User profile query did not work', error);
        });
      }

    } catch (error) {
     // Error retrieving data
     console.log('there was an error', error)
    }
  }

  formChangeHandler(eventName, eventValue) {
    console.log('formChangeHandler called', eventName, eventValue)

    if (eventName === 'search') {
      this.setState({ searchString: eventValue, textFormHasChanged: true })
    } else if (eventName === 'orgCode') {
      this.setState({ orgCode: eventValue })
    } else if (eventName === 'firstName') {
      this.setState({ firstNameValue: eventValue, textFormHasChanged: true })
    } else if (eventName === 'lastName') {
      this.setState({ lastNameValue: eventValue, textFormHasChanged: true })
    } else if (eventName === 'linkedInURL') {
      this.setState({ linkedInURLValue: eventValue, textFormHasChanged: true })
    } else if (eventName === 'resumeURL') {
      this.setState({ resumeURLValue: eventValue, textFormHasChanged: true })
    } else if (eventName === 'customWebsiteURL') {
      this.setState({ customWebsiteURLValue: eventValue, textFormHasChanged: true })
    } else if (eventName === 'subscribed') {
      this.setState({ [eventName]: eventValue, textFormHasChanged: true })
      this.savePersonalInfo(eventValue)
    } else {
      this.setState({ [eventName]: eventValue, textFormHasChanged: true })
    }
  }

  savePersonalInfo(subscribed) {
    console.log('savePersonalInfo', subscribed)

    this.setState({ serverSuccessMessage: null, serverErrorMessage: null })

    if (!this.state.firstNameValue || this.state.firstNameValue === '') {
      this.setState({ serverPostSuccess: false, serverErrorMessage: 'Please add your first name'})
    } else if (!this.state.lastNameValue || this.state.lastNameValue === '') {
      this.setState({ serverPostSuccess: false, serverErrorMessage: 'Please add your last name'})
    } else {
      console.log('saving profile')
      const emailId = this.state.emailId
      const firstNameValue = this.state.firstNameValue
      const lastNameValue = this.state.lastNameValue
      let unsubscribed = false
      if (!subscribed) {
        unsubscribed = true
      }

      const updatedAt = new Date()

      Axios.post('https://www.guidedcompass.com/api/users/profile/details', {  emailId, firstNameValue, lastNameValue, unsubscribed, updatedAt })
      .then((response) => {
        console.log('Saving email preferences attempted', response.data);

        if (response.data.success) {
          console.log('work mode query worked')

          // AsyncStorage.setItem('workMode', workMode)
          // this.setState({ workMode, isSaving: false })

        } else {
          console.log('work mode query did not work', response.data.message)
        }

      }).catch((error) => {
          console.log('Work mode query did not work for some reason', error);
      });
    }

  }

  closeModal() {
    this.setState({ modalIsOpen: false, showExportData: false, showGrades: false, showWBLPreferences: false, showInviteMembersWidget: false });
  }

  renderDataToShare(passedIndex) {
    console.log('renderDataToShare called', passedIndex)

    let rows = []
    for (let i = 1; i <= this.state.dataToShare.length; i++) {
      const index = i - 1
      // console.log('log index: ', index)
      const remainder = index % 3
      console.log('show modulo: ', index, remainder)

      if (passedIndex === remainder) {
        if (this.state.dataToShare[index]) {
          rows.push(
            <View key={i.toString + "dataToShare"} style={[styles.rowDirection]}>
              <View style={styles.rightMargin}>
                <Image src={{ uri: checkmarkIcon}} style={[styles.square20,styles.contain]} />
              </View>
              <View>
                <Text>{this.state.dataToShare[index]}</Text>
              </View>

              <View style={styles.halfSpacer} />
            </View>
          )
        }
      }
    }

    return rows
  }

  saveSettings(change) {
    console.log('saveSettings called', change)

    if (this.props.fromAdvisor) {
      // this.setState({
      //   serverSuccessText: false,
      //   serverErrorMessageText: '',
      //   serverSuccessMessageText: ''
      // })
      //
      // const emailId = this.state.emailId
      //
      // let updatedAt = new Date();
      //
      // if (this.state.textFormHasChanged === true) {
      //     console.log('used has changed the text portions of the form!!!')
      //
      //     let liu = ''
      //     console.log('show linkedinURLValue:', this.state.linkedInURLValue)
      //     if (this.state.linkedInURLValue) {
      //       liu = this.state.linkedInURLValue
      //       const prefix = liu.substring(0,4);
      //
      //       if (prefix !== "http") {
      //         liu = "http://" + liu
      //       }
      //     }
      //
      //     let ru = ''
      //     if (this.state.resumeURLValue) {
      //       ru = this.state.resumeURLValue
      //       const prefix = ru.substring(0,4);
      //
      //       if (prefix !== "http") {
      //         ru = "http://" + ru
      //       }
      //     }
      //
      //     let cwu = ''
      //     if (this.state.customWebsiteURLValue) {
      //
      //       cwu = this.state.customWebsiteURLValue
      //       const prefix = cwu.substring(0,4);
      //
      //       if (prefix !== "http") {
      //         cwu = "http://" + cwu
      //       }
      //     }
      //
      //     const firstNameValue = this.state.firstNameValue
      //     const lastNameValue = this.state.lastNameValue
      //     const careerGoalValue = this.state.careerGoalValue
      //     const linkedInURLValue = liu
      //     const resumeURLValue = ru
      //     const customWebsiteURLValue = cwu
      //     const myersBriggsValue = this.state.myersBriggsValue
      //
      //     const jobTitle = this.state.jobTitle
      //     const employerName = this.state.employerName
      //     const zipcode = this.state.workZipcode
      //     const workTenure = this.state.workTenure
      //     const overallFit = this.state.overallFit
      //     const degree = this.state.degreeAttained
      //     const school = this.state.schoolName
      //     const studyFields = this.state.studyFields
      //     const targetFunctions = this.state.targetFunctions
      //     const targetIndustries = this.state.targetIndustries
      //
      //     console.log('show me the monies: ', zipcode, targetFunctions, targetIndustries, degree, school)
      //
      //     this.props.saveProfileDetails({
      //         emailId, firstNameValue,lastNameValue,careerGoalValue,
      //         linkedInURLValue,resumeURLValue,customWebsiteURLValue,myersBriggsValue,
      //         jobTitle, employerName, zipcode, workTenure, overallFit,
      //         degree, school, studyFields, targetFunctions, targetIndustries,
      //         updatedAt
      //     })
      //     .then((responseData) => {
      //
      //         if (response.data.success) {
      //
      //             //report whether values were successfully saved
      //             this.setState({
      //                 isWaiting: false,
      //                 textFormHasChanged: false,
      //
      //                 serverSuccessText: true,
      //                 serverSuccessMessageText: 'Profile details saved successfully!'
      //             })
      //
      //         } else {
      //
      //             console.log('request was not successful')
      //             this.setState({
      //                 isWaiting: false,
      //                 textFormHasChanged: false,
      //
      //                 serverSuccessText: false,
      //                 serverErrorMessageText: response.data.message,
      //             })
      //         }
      //     })
      //
      // }
    } else {
      // student
      const emailId = this.state.emailId
      const openToMentoring = change
      const updatedAt = new Date()

      this.setState({ openToMentoring })

      this.props.saveProfileDetails({ emailId, openToMentoring, updatedAt })
      .then((responseData) => {

        if (response.data.success) {

          //report whether values were successfully saved
          this.setState({
              isWaiting: false,
              textFormHasChanged: false,

              serverSuccessText: true,
              serverSuccessMessageText: 'Profile details saved successfully!'
          })

        } else {

          console.log('request was not successful')
          this.setState({
              isWaiting: false,
              textFormHasChanged: false,

              serverSuccessText: false,
              serverErrorMessageText: response.data.message,
          })
        }
      })
    }
  }

  switchMode(change) {
    console.log('switchMode called', change)

    this.setState({ isSaving: true })

    const emailId = this.state.emailId
    const workMode = change

    Axios.post('https://www.guidedcompass.com/api/users/profile/details', {  emailId, workMode })
    .then((response) => {
      console.log('Work mode attempted', response.data);

        if (response.data.success) {
          console.log('work mode query worked')

          AsyncStorage.setItem('workMode', workMode.toString())
          this.setState({ workMode, isSaving: false })

        } else {
          console.log('work mode query did not work', response.data.message)
        }

    }).catch((error) => {
        console.log('Work mode query did not work for some reason', error);
    });
  }

  shareApp = async() => {
    console.log('shareOpening called')

    try {
      const result = await Share.share({
        message:
          'Guided Compass | Clarify and Achieve Your Career Goals',
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('activity type')
        } else {
          // shared
          console.log('shared')
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('dismissed')
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  savePreferences() {
    console.log('savePreferences called')

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    const orgCode = this.state.activeOrg
    const includeGuidedCompass = this.state.includeGuidedCompass
    let wblPreferences = this.state.wblPreferences
    const updatedAt = new Date()

    Axios.post('https://www.guidedcompass.com/api/org/update', {
      orgCode, includeGuidedCompass, wblPreferences, updatedAt
     })
    .then((response) => {

      if (response.data.success) {
        //save values
        console.log('Org info update worked', response.data);
        this.setState({ successMessage: 'Org information saved successfully!' })

      } else {
        console.error('there was an error updating the org info');
        this.setState({ errorMessage: response.data.message })
      }
    }).catch((error) => {
        console.log('Org info save did not work', error);
        if (error) {
          this.setState({ errorMessage: error.toString() })
        }
    });
  }

  exportToCSV(reportType) {
    console.log('exportToCSV called')

    this.setState({ serverErrorMessage: 'There was an error exporting to CSV. Please email creighton@guidedcompass.com immediately!', isLoading: true })

    let csvData = []
    if (reportType === 'grades') {

      console.log('pull postings')

      csvData.push(
        [ "Post Date","Grade","Project Name","Student First Name","Student Last Name","Student Email","Industry Rep. First Name","Industry Rep. Last Name","Industry Rep. Email","Is Transparent","Feedback"]
      )

      const grades = this.state.grades
      if (grades && grades.length > 0) {
        for (let i = 1; i <= grades.length; i++) {
          console.log(i, grades[i - 1])

          //replace commas
          let commaStartingValue = /,/g
          let commaReplacementValue = ";"

          const postDate = grades[i - 1].updatedAt
          let grade = grades[i - 1].grade
          if (!grade) {
            grade = 'N/A'
          }
          let projectName = this.state.projectNames[i - 1]
          let studentFirstName = this.state.students[i - 1].studentFirstName
          let studentLastName = this.state.students[i - 1].studentLastName
          let studentEmail = this.state.students[i - 1].studentEmail
          let industryFirstName = this.state.grades[i - 1].contributorFirstName
          let industryLastName = this.state.grades[i - 1].industryLastName
          let industryEmail = this.state.grades[i - 1].industyEmail
          let isTransparent = this.state.grades[i - 1].isTransparent

          let feedback = this.state.grades[i - 1].feedback.replace(commaStartingValue,commaReplacementValue)
          if (!feedback) {
            feedback = ''
          }

          csvData.push([
            postDate, grade, projectName, studentFirstName, studentLastName, studentEmail,
            industryFirstName, industryLastName, industryEmail, isTransparent, feedback
          ])
        }

        let csvContent = "data:text/csv;charset=utf-8,";
        csvData.forEach(function(rowArray){
           let row = rowArray.join(",");
           csvContent += row + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", "grades-report.csv");
        document.body.appendChild(link); // Required for FF

        link.click();

        this.setState({ isLoading: false })

      } else {
        this.setState({ clientErrorMessage: 'There is no data to export', isLoading: false })
      }
    } else if (reportType === 'basicInfo') {

      // firstName, lastName, username, phoneNumber, oauthUid, schoolDistrict
      // school, major, gradYear,
      // resumeURL, coverLetterURL, letterOfRecommendationURL, transcriptURL, linkedInURL, customWebsiteURL
      // favoritesArray,
      // race, gender, veteran, workAuthorization

      // numberOfMembers, householdIncome, fosterYouth, homeless, incarcerated, adversityList,
      // matchingPreferences, matchingUseCases

      console.log('user: ', this.state.user)

      const user = this.state.user
      if (user) {

        csvData.push(
          [ "First Name","Last Name","Username","Phone Number","oAuth ID","School District","School","Major / Pathway","Grad Year","Resume URL","LinkedIn URL","Portfolio URL","Favorites [Ids]"]
        )

        //replace commas
        let commaStartingValue = /,/g
        let commaReplacementValue = ";"

        // firstName, lastName, username, phoneNumber, oauthUid, schoolDistrict
        // school, major, gradYear,
        // resumeURL, coverLetterURL, letterOfRecommendationURL, transcriptURL, linkedInURL, customWebsiteURL
        // favoritesArray,

        const firstName = user.firstName
        const lastName = user.lastName
        const username = user.username
        const phoneNumber = user.phoneNumber
        const oauthUid = user.oauthUid
        let schoolDistrict = ''
        if (user.schoolDistrict) {
          schoolDistrict = user.schoolDistrict.replace(commaStartingValue,commaReplacementValue)
        }

        let school = ''
        if (user.school) {
          school = user.school.replace(commaStartingValue,commaReplacementValue)
        }

        let major = ''
        if (user.major) {
          major = user.major.replace(commaStartingValue,commaReplacementValue)
        }

        const gradYear = user.gradYear

        let resumeURL = ''
        if (user.resumeURL) {
          resumeURL = user.resumeURL.replace(/#/g,'')
        }

        let linkedInURL = ''
        if (user.linkedInURL) {
          linkedInURL = user.linkedInURL.replace(/#/g,'')
        }

        let portfolioURL = ''
        if (user.customWebsiteURL) {
          portfolioURL = user.customWebsiteURL.replace(/#/g,'')
        }
        let favorites = user.favoritesArray.toString()
        if (user.favoritesArray) {
          favorites = user.favoritesArray.toString().replace(commaStartingValue,commaReplacementValue)
        }

        csvData.push([
          firstName, lastName, username, phoneNumber, oauthUid, schoolDistrict, school, major, gradYear,
          resumeURL, linkedInURL, portfolioURL, favorites
        ])

        let csvContent = "data:text/csv;charset=utf-8,";
        csvData.forEach(function(rowArray){
           let row = rowArray.join(",");
           csvContent += row + "\r\n";
        });

        const encodedUri = encodeURI(csvContent);
        const link = document.createElement("a");
        link.setAttribute("href", encodedUri);
        link.setAttribute("download", reportType + ".csv");
        document.body.appendChild(link); // Required for FF

        link.click();

        this.setState({ isLoading: false })

      } else {
        this.setState({ clientErrorMessage: 'There is no data to export', isLoading: false })
      }
    } else if (reportType === 'resume') {

      // const preHtml = "<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'><head><meta charset='utf-8'><title>Export HTML To Doc</title></head><body>";
      // const postHtml = "</body></html>";
      // const html = preHtml+document.getElementById('exportContent').innerHTML+postHtml;
      //
      // const blob = new Blob(['\ufeff', html], {
      //     type: 'application/msword'
      // });
      //
      // // Specify link url
      // const url = 'data:application/vnd.ms-word;charset=utf-8,' + encodeURIComponent(html);
      //
      // // Specify file name
      // const cuFirstName = AsyncStorage.getItem('firstName');
      // const cuLastName = AsyncStorage.getItem('lastName');
      //
      // const filename = cuFirstName + ' ' + cuLastName + '.doc'
      //
      // // Create download link element
      // const downloadLink = document.createElement("a");
      //
      // document.body.appendChild(downloadLink);
      //
      // if (navigator.msSaveOrOpenBlob ){
      //     navigator.msSaveOrOpenBlob(blob, filename);
      // } else{
      //     // Create a link to the file
      //     downloadLink.href = url;
      //
      //     // Setting the file name
      //     downloadLink.download = filename;
      //
      //     //triggering the function
      //     downloadLink.click();
      // }
      //
      // document.body.removeChild(downloadLink);

    }
  }

  signOut() {
    console.log('signOut called')

    AsyncStorage.clear()
    this.props.navigation.navigate('AuthLoading', { reloadScreen: true });
  }

  render() {

    if (this.props.fromAdvisor) {

      // return (
      //   <View>
      //     <View>
      //
      //         {(this.state.roleName === 'Academy Lead' || this.state.roleName === 'Teacher' || this.state.roleName === 'School Support') && (
      //           <View>
      //
      //             {(this.state.courses && this.state.courses.length > 0) && (
      //               <View style={styles.row10}>
      //                 <Text>Courses</Text>
      //                 <View style={styles.spacer} />
      //                 {this.renderCourses()}
      //
      //               </View>
      //             )}
      //
      //             <View style={styles.spacer}/><View style={styles.halfSpacer}/>
      //             <View style={styles.lightHorizontalLine} />
      //             <View style={styles.spacer}/><View style={styles.halfSpacer}/>
      //
      //             {(this.state.academies) && (
      //               <View>
      //                 <View style={[styles.row10,styles.rowDirection,styles.flex1]}>
      //                   <View style={[styles.flex50,styles.rightPadding]}>
      //                     <Text>Role</Text>
      //                     <Text>{this.state.roleName ? this.state.roleName : "No first name added"}</Text>
      //                   </View>
      //                   <View style={[styles.flex50,styles.leftPadding]>
      //                     <Text>Academy Name</Text>
      //                     <Text>{this.state.orgName}</Text>
      //                   </View>
      //
      //                 </View>
      //
      //                 <SwitchOrgs
      //                   emailId={this.state.emailId} activeOrg={this.state.activeOrg} myOrgs={this.state.myOrgs}
      //                   sharePartners={this.state.sharePartners} roleName={this.state.roleName}
      //                   academies={this.state.academies} academyCodes={this.state.academyCodes}
      //                   accountCode={this.state.emp}
      //                 />
      //               </View>
      //             )}
      //
      //             {(this.state.roleName === 'Teacher' || this.state.roleName === 'School Staff') && (
      //               <View>
      //                 <View>
      //                   <TouchableOpacity target="_blank" rel="noopener noreferrer" href="https://docs.google.com/document/d/1oJfMa46Sqzf7U--ImBk-Rc41r9aqqc4FOW160F6ECPU/edit?usp=sharing">
      //                     <Text>View Lesson Plans</Text>
      //                   </TouchableOpacity>
      //                 </View>
      //                 <View style={styles.spacer}/><View style={styles.halfSpacer}/>
      //                 <View style={[styles.lightHorizontalLine]} />
      //                 <View style={styles.spacer} />
      //               </View>
      //             )}
      //
      //             {(this.state.roleName === 'Teacher' || this.state.roleName === 'School Staff') && (
      //               <View>
      //                 <View>
      //                   <TouchableOpacity style={[styles.ctaColor]} onPress={() => this.setState({ modalIsOpen: true, showWBLPreferences: true })}>
      //                     <Text>PBL & WBL Preferences</Text>
      //                   </TouchableOpacity>
      //                 </View>
      //                 <View style={styles.spacer}/><View style={styles.halfSpacer}/>
      //                 <View style={[styles.lightHorizontalLine]} />
      //                 <View style={styles.spacer} />
      //               </View>
      //             )}
      //
      //             {(this.state.roleName === 'Teacher' || this.state.roleName === 'School Staff') && (
      //               <View>
      //                 <View>
      //                   <TouchableOpacity style={[styles.ctaColor]} onPress={() => this.setState({ modalIsOpen: true, showGrades: true })}>
      //                     <Text>View Grades</Text>
      //                   </TouchableOpacity>
      //                 </View>
      //                 <View style={styles.spacer}/><View style={styles.halfSpacer}/>
      //                 <View style={[styles.lightHorizontalLine]} />
      //                 <View style={styles.spacer} />
      //               </View>
      //             )}
      //
      //
      //             <TouchableOpacity onPress={() => this.props.navigation.navigate('Home', { passedRoleName: 'Student'})}>
      //               <View>
      //                 <Text>View Student Portal</Text>
      //               </View>
      //
      //             </TouchableOpacity>
      //
      //             {(!this.state.remoteAuth) && (
      //               <View>
      //                 <View style={styles.spacer}/><View style={styles.halfSpacer}/>
      //                 <View style={styles.lightHorizontalLine} />
      //                 <View style={styles.spacer}/><View style={styles.halfSpacer}/>
      //
      //                 <TouchableOpacity onPress={() => this.props.navigation.navigate('Change Password')}>
      //                   <View>
      //                     <Text>Change Password</Text>
      //                   </View>
      //                 </TouchableOpacity>
      //               </View>
      //             )}
      //
      //
      //             <View style={styles.spacer}/><View style={styles.halfSpacer}/>
      //             <View style={styles.lightHorizontalLine} />
      //             <View style={styles.spacer}/><View style={styles.halfSpacer}/>
      //
      //           </View>
      //         )}
      //
      //         {(this.state.orgFocus === 'Mentor' || this.state.roleName === 'Mentor') && (
      //           <View>
      //             <SwitchOrgs
      //               emailId={this.state.emailId} activeOrg={this.state.activeOrg} myOrgs={this.state.myOrgs}
      //               sharePartners={this.state.sharePartners} roleName={this.state.roleName}
      //               academies={this.state.academies} academyCodes={this.state.academyCodes}
      //               accountCode={this.state.emp}
      //             />
      //
      //             <View style={styles.topPadding}>
      //               <TouchableOpacity onPress={() => this.props.navigation.navigate('Walkthrough')}>
      //                 <View>
      //                   <Text>Change Password</Text>
      //                 </View>
      //               </TouchableOpacity>
      //             </View>
      //
      //             <View style={styles.topPadding}>
      //               <View style={styles.lightHorizontalLine} />
      //             </View>
      //           </View>
      //         )}
      //
                // <TouchableOpacity onPress={() => this.signOut()} style={[styles.btnPrimary,styles.ctaBorder]}>
                //   <Text style={[styles.ctaColor]}>Log Out</Text>
                // </TouchableOpacity>
      //     </View>
      //
      // <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
      //
      //     {(this.state.showGrades) && (
      //       <View key="grades" style={[styles.calcColumn60,styles.padding40]}>
      //         <View>
      //
      //           <View style={[styles.descriptionText2,styles.rowDirection]}>
      //             <View style={[styles.width40,styles.row10]}>
      //               <Text>No.</Text>
      //             </View>
      //             <View style={[styles.width60,styles.row10]}>
      //               <Text>Grade</Text>
      //             </View>
      //             <View style={[styles.width100,styles.row10]}>
      //               <Text>Project Name</Text>
      //             </View>
      //             <View style={[styles.width150,styles.row10]}>
      //               <Text>Student Name</Text>
      //             </View>
      //             <View style={[styles.width150,styles.row10]}>
      //               <Text>Ind. Rep. Name</Text>
      //             </View>
      //             <View style={[styles.width80,styles.row10]}>
      //               <Text>Ind. Rep. Email</Text>
      //             </View>
      //
      //
      //             <View style={styles.spacer} />
      //             <View style={styles.lightHorizontalLine} />
      //             <View style={styles.spacer} />
      //
      //           </View>
      //
      //          {(this.state.grades && this.state.grades.length > 0) ? (
      //            <View>
      //              {this.state.grades.map((value, index) =>
      //                <View>
      //                  <View style={[styles.descriptionText2,styles.rowDirection]}>
      //                    <View style={[styles.width40,styles.topMargin5]}>
      //                      <Text>#{index + 1}.</Text>
      //                    </View>
      //                    <View style={[styles.width60,styles.headingText2,styles.ctaColor, styles.boldText]}>
      //                      {(value.grade) ? (
      //                        <Text>{value.grade}</Text>
      //                      ) : (
      //                        <Text>N/A</Text>
      //                      )}
      //                    </View>
      //                    <View style={[styles.width100,styles.topMargin5]}>
      //                      <Text style={[styles.curtailText]}>{this.state.projectNames[index]}</Text>
      //                    </View>
      //
      //                    <View style={[styles.width150,styles.topMargin5]}>
      //                      <Text style={[styles.curtailText]}>{this.state.students[index].studentFirstName} {this.state.students[index].studentLastName}</Text>
      //                    </View>
      //                    <View style={[styles.width150,styles.topMargin5]}>
      //                      <Text style={[styles.curtailText]}>{value.contributorFirstName} {value.contributorLastName}</Text>
      //                    </View>
      //                    <View style={[styles.width180,styles.topMargin5]}>
      //                      <Text style={[styles.curtailText]}>{value.contributorEmail}</Text>
      //                    </View>
      //
      //
      //                  </View>
      //
      //                  <View style={styles.spacer}/>
      //
      //                  {(value.feedback) && (
      //                    <View style={[styles.leftPadding40]}>
      //                      <Text style={[styles.descriptionText2]}>{value.feedback}</Text>
      //                    </View>
      //                  )}
      //
      //                  <View style={styles.spacer}/><View style={styles.spacer}/>
      //                </View>
      //              )}
      //
      //
      //              <View style={styles.spacer}/><View style={styles.spacer}/>
      //
      //              <View style={[styles.rowDirection]}>
      //               <View>
      //                 <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor]} onPress={() => this.exportToCSV('grades')}><Text style={[styles.whiteColor,styles.descriptionText1]}>Export to CSV</Text></TouchableOpacity >
      //               </View>
      //               <View style={[styles.leftPadding]}>
      //                 <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder]} onPress={() => this.closeModal()}><Text style={[styles.whiteColor,styles.descriptionText1]}>Close View</Text></TouchableOpacity >
      //               </View>
      //
      //              </View>
      //
      //              {(this.state.serverErrorMessage && this.state.serverErrorMessage !== '') && <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>}
      //            </View>
      //          ) : (
      //            <View>
      //              <View style={styles.spacer}/><View style={styles.spacer}/>
      //              <Text style={[styles.errorColor]}>There are no student grades on projects available to export.</Text>
      //            </View>
      //          )}
      //
      //         </View>
      //       </View>
      //     )}
      //
      //     {(this.state.showSettings) && (
      //       <View key="showIndustry" style={[styles.calcColumn60,styles.padding20]}>
      //         <Text style={[styles.headingText2]}>Settings</Text>
      //         <View style={styles.spacer} />
      //
      //         <View>
      //           <EditSubscription />
      //         </View>
      //
      //         <View style={[styles.row10]}>
                // <TouchableOpacity onPress={() => this.signOut()} style={[styles.btnPrimary,styles.ctaBorder]}>
                //   <Text style={[styles.ctaColor]}>Log Out</Text>
                // </TouchableOpacity>
      //         </View>
      //
      //         <View style={[styles.row20]}>
      //          <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder]} onPress={() => this.closeModal()}>Close View</TouchableOpacity >
      //         </View>
      //
      //       </View>
      //     )}
      //
      //     {(this.state.showWBLPreferences) && (
      //       <View key="showIndustry" style={[styles.calcColumn60,styles.padding20]}>
      //         <Text style={[styles.headingText2]}>PBL & WBL Preferences</Text>
      //
      //         <View style={[styles.row10]}>
      //           <Text style={[styles.row10]}>Would you like to automatically include project-based learning and work-based learning opportunities from the broader Guided Compass community?</Text>
                    // <Switch
                    //    onValueChange = {(value) => this.setState({ includeGuidedCompass: value })}
                    //    value = {this.state.includeGuidedCompass}
                    // />
      //         </View>
      //
      //         {(this.state.includeGuidedCompass) && (
      //           <View style={[styles.row10]}>
      //               <Text style={[styles.row10]}>What types of opportunities would you like to include?</Text>
      //               {this.state.wblPreferenceOptions.map((value, optionIndex) =>
      //                 <View key={optionIndex} style={styles.rowDirection}>
      //                   <View style={[styles.row10,styles.rightPadding]}>
      //                     {(this.state.wblPreferences.some(sa => sa === value)) ? (
      //                       <TouchableOpacity style={[styles.ctaBackgroundColor,styles.row7,styles.horizontalPadding20,styles.topMargin5,styles.leftMargin5]} onPress={() => this.optionClicked('wblPreference',value, optionIndex)}>
      //                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value}</Text>
      //                       </TouchableOpacity >
      //                     ) : (
      //                       <TouchableOpacity style={[styles.ctaBorder,styles.row7,styles.horizontalPadding20,styles.topMargin5,styles.leftMargin5]} onPress={() => this.optionClicked('wblPreference',value, optionIndex)}>
      //                           <Text style={[styles.descriptionText2]}>{value}</Text>
      //                       </TouchableOpacity >
      //                     )}
      //                   </View>
      //                 </View>
      //               )}
      //           </View>
      //         )}
      //
      //         {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor]}>{this.state.errorMessage}</Text>}
      //         {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor]}>{this.state.successMessage}</Text>}
      //
      //         <View style={[styles.row20]}>
      //           <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor]} onPress={() => this.savePreferences()}><Text style={[styles.whiteColor]}>Save Preferences</Text></TouchableOpacity>
      //           <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder]} onPress={() => this.closeModal()}>Close View</TouchableOpacity >
      //         </View>
      //
      //       </View>
      //     )}
      //
      //    </Modal>
      //   </View>
      // )

    } else {

      // student
      return (
          <ScrollView style={styles.card}>
              <View>
                  { (this.state.orgFocus === 'School' && this.state.roleName !== 'Student') && (
                    <View style={[styles.row10]}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Home', { passedRoleName: 'Advisor' })}><Text>Switch to Advisor App</Text></TouchableOpacity>
                      <View style={styles.lightHorizontalLine} />
                    </View>
                  )}

                  {(this.state.activeOrg === 'c2c') && (
                    <View style={[styles.rowDirection,styles.flex1,styles.row10]}>
                      <View style={styles.flex80}>
                        <Text>Are you open to being mentored?</Text>
                      </View>
                      <View style={styles.flex20}>
                        <View style={styles.halfSpacer}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                        <Switch
                           onValueChange = {(value) => this.saveSettings(value)}
                           value = {this.state.openToMentoring}
                        />
                      </View>

                      <View style={styles.spacer}/><View style={styles.spacer}/>
                      <View style={styles.lightHorizontalLine} />
                      <View style={styles.spacer}/><View style={styles.spacer}/>

                    </View>
                  )}

                  {(this.state.academies) && (
                    <View style={[styles.row10]}>
                      <SwitchOrgs
                        emailId={this.state.emailId} activeOrg={this.state.activeOrg} myOrgs={this.state.myOrgs}
                        sharePartners={this.state.sharePartners} roleName={this.state.roleName}
                        academies={this.state.academies} academyCodes={this.state.academyCodes}
                        accountCode={this.state.emp}
                      />
                    </View>
                  )}

                  {(this.state.isWorking || this.state.workMode) && (
                    <View style={[styles.row10]}>
                      <Text style={[styles.row10]}>Switch to Work Mode?</Text>
                      <Switch
                         onValueChange = {(value) => this.switchMode(value)}
                         value = {this.state.workMode}
                         disabled={this.state.isSaving}
                      />

                      <View style={[styles.spacer]} />
                      <View style={styles.lightHorizontalLine} />
                    </View>
                  )}

                  {(!this.state.disableWeeklyEmails && !this.state.remoteAuth) && (
                    <View>
                      <View style={[styles.row15]}>
                        <View style={styles.bottomPadding10}>
                          <Text>Email Preferences</Text>
                        </View>

                        <View style={[styles.rowDirection]}>
                          <View style={[styles.width60]}>
                            <Switch
                               onValueChange = {(value) => this.formChangeHandler('subscribed',value)}
                               value = {this.state.subscribed}
                            />
                          </View>
                          <View style={[styles.calcColumn120]}>
                            <Text style={[styles.descriptionText3]}>Receive weekly emails of event, project, and work opportunities based on your interests.</Text>
                          </View>
                        </View>

                        {(this.state.serverErrorMessage && this.state.serverErrorMessage !== '') && <Text style={[styles.descriptionText3,styles.boldText,styles.errorColor]}>{this.state.serverErrorMessage}</Text>}
                      </View>

                      <View style={styles.lightHorizontalLine} />

                      <View style={[styles.row15]}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Visibility Preferences'})}><Text>{(this.state.publicProfile) ? "Make Your Profile Private" : "Make Your Profile Public"}</Text></TouchableOpacity>
                      </View>

                      <View style={styles.lightHorizontalLine} />
                    </View>
                  )}

                  <View style={[styles.row15]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Paths', { subNavSelected: 'Trends' })}><Text>View Labor Market Trends</Text></TouchableOpacity>
                  </View>

                  <View style={styles.lightHorizontalLine} />

                  {(this.state.showWalkthrough) && (
                    <View style={[styles.row10]}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Walkthrough')}><Text>View Walk-through</Text></TouchableOpacity>
                      <View style={[styles.spacer]} />
                      <View style={styles.lightHorizontalLine} />
                    </View>
                  )}

                  {(this.state.orgFocus === 'Placement') && (
                    <View style={[styles.row10]}>
                      <SwitchOrgs
                        emailId={this.state.emailId} activeOrg={this.state.activeOrg} myOrgs={this.state.myOrgs}
                        sharePartners={this.state.sharePartners} roleName={this.state.roleName}
                        academies={this.state.academies} academyCodes={this.state.academyCodes}
                        accountCode={this.state.emp}
                      />
                    </View>
                  )}

                  {(!this.state.remoteAuth) && (
                    <View>
                      <View style={[styles.row15]}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('ChangePassword')}><Text>Change Password</Text></TouchableOpacity>
                      </View>

                      <View style={styles.lightHorizontalLine} />

                      <View style={[styles.row15]}>
                        <TouchableOpacity onPress={() => this.shareApp()}>
                          <View>
                            <Text style={[styles.ctaColor]}>Invite People to Join</Text>
                          </View>
                        </TouchableOpacity >
                      </View>

                      <View style={styles.lightHorizontalLine} />
                    </View>
                  )}

                  <View style={[styles.row15]}>
                    <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/contact')}><Text>Contact Us > ></Text></TouchableOpacity >
                  </View>

                  <View style={styles.lightHorizontalLine} />

                  <View style={[styles.row15]}>
                    <TouchableOpacity onPress={() => this.signOut()} style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]}>
                      <Text style={[styles.ctaColor,styles.centerText]}>Log Out</Text>
                    </TouchableOpacity>
                  </View>

              </View>

              <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>

                {(this.state.showExportData) && (
                  <View key="export" style={[styles.calcColumn60,styles.padding40]}>
                    <Text style={[styles.headingText2,styles.bottomPadding]}>Export your Data</Text>

                    <View style={[styles.row10,styles.rowDirection]}>
                      <View style={[styles.calcColumn160,styles.topPadding5]}>
                        <Text style={[styles.headingText5]}>Basic Info</Text>
                      </View>
                      <View style={[styles.width100]}>
                        <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor]} disabled={this.state.isLoading} onPress={() => this.exportToCSV('basicInfo')}><Text style={[styles.whiteColor,styles.descriptionText1]}>Export</Text></TouchableOpacity >
                      </View>

                    </View>
                  </View>
                )}

                {(this.state.showInviteMembersWidget) && (
                  <View key="export" style={[styles.calcColumn60,styles.padding20]}>
                    <SubInviteMembers orgName={this.state.orgName} closeModal={this.closeModal} />
                  </View>
                )}

              </Modal>
          </ScrollView>

      )
    }
  }
}

export default Settings;
