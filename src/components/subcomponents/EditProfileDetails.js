import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, TextInput, Image, Platform, Switch } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from "react-native-modal";
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';
// import { DocumentPicker, DocumentPickerUtil } from 'react-native-document-picker';
import DocumentPicker from 'react-native-document-picker';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const addProfilePhotoIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-profile-photo-icon.png';
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';
const editIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/edit-icon-dark.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';
const confidentialityIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/confidentiality-icon.png';
const feedbackIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/feedback-icon-blue.png';
const questionMarkBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/question-mark-blue.png';
const detailsIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/details-icon-grey.png';
const reachIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/reach-icon.png';
const prizeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/prize-icon.png';
const settingsIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/settings-icon.png';
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';
const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png';
const deleteIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/delete-icon-dark.png';
const skillsIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/skills-icon.png';
const courseIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/course-icon-dark.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';

import ProjectDetails from './ProjectDetails';
import EditProject from './EditProject';
import SwitchOrgs from '../common/SwitchOrgs';
import SubPicker from '../common/SubPicker';
import {signOut} from '../services/AuthRoutes'

import {convertDateToString} from '../functions/convertDateToString';
import {convertStringToDate} from '../functions/convertStringToDate';

class EditProfileDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allowMultipleFiles: true,
      extraPaddingForKeyboard: true,

      profilePicFile: null,
      profilePicImage: null,
      profilePicPath: null,
      coverPicFile: null,
      coverPicImage: null,
      coverPicPath: null,
      firstNameValue: '',
      lastNameValue: '',
      careerGoalValue: '',
      linkedInURL: '',
      resumeURLValue: '',
      customWebsiteURL: '',

      degree: '',
      major: '',
      gradYear: '',
      race: '',
      gender: '',
      veteranStatus: '',
      workAuthorization: '',
      collaborators: [],

      profilePicHasChanged: false,
      coverPicHasChanged: false,
      textFormHasChanged: false,
      isWaiting: false,

      dateOptions: [],
      educationDateOptions: [],
      functionOptions: [],
      industryOptions: [],
      payOptions: [],
      hoursPerWeekOptions: [],
      hourOptions: [],
      projectCategoryOptions: [],
      binaryOptions: ['', 'Yes','No'],
      collaboratorOptions: [],
      raceOptions: ["","American Indian or Alaska Native","Asian-American","Black or African American","Hispanic or Latino","Native Hawaiian or Other Pacific Islander","Two or more races","White","Do not disclose"],
      genderOptions: ["","Female","Male","Non-binary","Do not disclose"],
      veteranStatusOptions: ["","I am a protected veteran","I am an unprotected veteran","I am not a veteran","Do not disclose"],
      workAuthorizationOptions: ["","Yes","No","Do not disclose"],
      registrationOptions: [],
      hometownOptions: [],
      schoolOptions: [],
      pathwayOptions: [],
      gradYearOptions: [],
      degreeOptions: [],
      basicCountOptions: [],
      householdIncomeOptions: [],
      fosterYouthOptions: [],
      homelessOptions: [],
      incarceratedOptions: [],
      adversityListOptions: [],
      tenureOptions: [{value: '0 - 1 Year'}, {value: '1 - 2 Years'},{value: '2 -4 Years'},{value: '4 - 6 Years'},{value: '6 - 10 Years'},{value: '10+ Years'}],
      ratingOptions: [{value: ''},{value: '0'},{value: '1'},{value: '2'},{value: '3'},{value: '4'},{value: '5'}],
      politicalAlignmentOptions: ['','Liberal','Moderately Liberal','Conservative','Moderately Conservative','Independent'],
      publicPreferenceOptions: ['','All','Some','None'],
      publicProfileExtentOptions: ['','Only Connections','Only Connections and Members','Public'],
      workInterestOptions: [
        { label: "", value: ""},
        { label: "I'm Super Passionate About This", value: "5"},
        { label: "I Like It a Lot", value: "4"},
        { label: "It Was Okay", value: "3"},
        { label: "Not My Cup of Tea", value: "2"},
        { label: "I Just Did it For the Money", value: "1"},
      ],
      workSkillOptions: [
        { label: "", value: ""},
        { label: "I am and will be world-class", value: "5"},
        { label: "I think I'm top 10% compared to my peers", value: "4"},
        { label: "I'm average", value: "3"},
        { label: "I have a lot of work to do compared to peers", value: "2"},
        { label: "I don't think this is my calling", value: "1"},
      ],
      teamInterestOptions: [
        { label: "", value: ""},
        { label: "The team felt like friends and/or family", value: "5"},
        { label: "The team was a good fit", value: "4"},
        { label: "The team was a mixed bag", value: "3"},
        { label: "The team didn't mesh well with me", value: "2"},
        { label: "Avoiding teams like this at all costs", value: "1"},
      ],
      employerInterestOptions: [
        { label: "", value: ""},
        { label: "Yes", value: "5"},
        { label: "Slightly", value: "4"},
        { label: "Not sure", value: "3"},
        { label: "I don't think so", value: "2"},
        { label: "No", value: "1"},
      ],
      payInterestOptions: [
        { label: "", value: ""},
        { label: "Initial pay and career trajectory pay provide a solid cushion", value: "5"},
        { label: "Initial pay and career trajectory pay provide be comfortable", value: "4"},
        { label: "Initial pay and career trajectory pay provide are doable", value: "3"},
        { label: "Initial pay and career trajectory pay are a little low", value: "2"},
        { label: "Initial pay and career trajectory pay are likely far too low", value: "1"},
      ],
      overallFitOptions: [
        { label: "", value: ""},
        { label: "Perfect", value: "5"},
        { label: "Great", value: "4"},
        { label: "Good", value: "3"},
        { label: "Not Ideal", value: "2"},
        { label: "Avoiding employers like this at all costs", value: "1"},
      ],

      postOptions: [],
      projectOptions: [],
      goalOptions: [],
      passionOptions: [],
      assessmentOptions: [],
      endorsementOptions: [],
      careerGoalOptions: [],
      resumeOptions: [],

      projects: [],
      experience: [],
      isEditingProjectsArray: [],
      isEditingExperienceArray: [],
      isEditingExtracurricularArray: [],
      isEditingAwardArray: [],

      projectHasChanged: false,
      projectHasChangedArray: [],
      experienceHasChanged: false,
      experienceHasChangedArray: [],
      extracurricularHasChangedArray: [],
      awardHasChangedArray: [],

      extracurriculars: [],
      awards: [],

      publicPosts: [],
      publicProjects: [],
      publicGoals: [],
      publicPassions: [],
      publicAssessments: [],
      publicEndorsements: [],
      careerGoals: [],

      clientErrorMessage: '',
      serverSuccessText: false,
      serverErrorMessageText: '',
      serverSuccessMessageText: '',
      serverSuccessProfilePic: false,
      serverErrorMessageProfilePic: '',
      serverSuccessMessageProfilePic: '',
      serverSuccessCoverPic: false,
      serverErrorMessageCoverPic: '',
      serverSuccessMessageCoverPic: '',
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.addItem = this.addItem.bind(this)
    this.mobileNav = this.mobileNav.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.fetchAllProfileData = this.fetchAllProfileData.bind(this)
    this.renderProjects = this.renderProjects.bind(this)
    this.renderExperience = this.renderExperience.bind(this)
    this.renderExtras = this.renderExtras.bind(this)
    this.saveProject = this.saveProject.bind(this)
    this.saveExperience = this.saveExperience.bind(this)
    this.changeContinual = this.changeContinual.bind(this)
    this.deleteItem = this.deleteItem.bind(this)

    this.closeModal = this.closeModal.bind(this)
    this.renderTags = this.renderTags.bind(this)
    this.removeTag = this.removeTag.bind(this)
    this.verifyLegalAge = this.verifyLegalAge.bind(this)

    this.switchPreferences = this.switchPreferences.bind(this)
    this.savePreferences = this.savePreferences.bind(this)
    this.itemSelected = this.itemSelected.bind(this)

    this.imgError = this.imgError.bind(this)
    this.passData = this.passData.bind(this)

    this.searchSchools = this.searchSchools.bind(this)
    this.segueToApp = this.segueToApp.bind(this)
    this.convertRating = this.convertRating.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
  console.log('componentDidUpdate called within editProfileDetails ')

  if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
    this.retrieveData()
  } else if (this.props.category !== prevProps.category) {
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
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, orgFocus, orgName, remoteAuth
        })

        if (this.props.fromAdvisor) {

          if (activeOrg) {
            this.fetchAllProfileData(email, null)
          }

          Axios.get('https://www.guidedcompass.com/api/workoptions')
            .then((response) => {
              console.log('Work options query tried', response.data);

              if (response.data.success) {
                console.log('Work options query succeeded')

                let functionOptions = ['']
                for (let i = 1; i <= response.data.workOptions[0].functionOptions.length; i++) {
                  if (i > 1) {
                    functionOptions.push(response.data.workOptions[0].functionOptions[i - 1])
                  }
                }

                let industryOptions = []
                for (let i = 1; i <= response.data.workOptions[0].industryOptions.length; i++) {
                  if (i > 1) {
                    industryOptions.push({ value: response.data.workOptions[0].industryOptions[i - 1]})
                  }
                }

                let degreeOptions = []
                for (let i = 1; i <= response.data.workOptions[0].degreeOptions.length; i++) {
                  if (i > 1) {
                    degreeOptions.push(response.data.workOptions[0].degreeOptions[i - 1])
                  }
                }

                let politicalAlignmentOptions = ['']
                if (response.data.workOptions[0].individualPoliticalAlignmentOptions) {
                  for (let i = 1; i <= response.data.workOptions[0].individualPoliticalAlignmentOptions.length; i++) {
                    politicalAlignmentOptions.push(response.data.workOptions[0].individualPoliticalAlignmentOptions[i - 1])
                  }
                }

                let registrationOptions = ['']
                if (response.data.workOptions[0].unitedStateOptions) {
                  for (let i = 1; i <= response.data.workOptions[0].unitedStateOptions.length; i++) {
                    registrationOptions.push(response.data.workOptions[0].unitedStateOptions[i - 1])
                  }
                }

                let hometownOptions = registrationOptions

                this.setState({ functionOptions, industryOptions, degreeOptions, politicalAlignmentOptions, registrationOptions, hometownOptions })

                if (activeOrg === 'c2c') {
                  Axios.get('https://www.guidedcompass.com/api/benchmarks', { params: { orgCode: activeOrg } })
                  .then((response) => {
                    console.log('Benchmarks query attempted', response.data);

                      if (response.data.success) {
                        console.log('benchmark query worked')

                        if (response.data.benchmarks.length !== 0) {
                          //jobs = response.data.postings

                          let benchmarkOptions = response.data.benchmarks
                          functionOptions = ['']

                          for (let i = 1; i <= benchmarkOptions.length; i++) {
                            if (!benchmarkOptions[i - 1].title.includes('Scholarship') && !benchmarkOptions[i - 1].title.includes('C2C')) {
                              functionOptions.push(benchmarkOptions[i - 1].title)
                            }
                          }

                          this.setState({ functionOptions })
                        }
                      }
                  })
                }
              } else {
                console.log('no jobFamilies data found', response.data.message)

              }
          }).catch((error) => {
              console.log('query for work options did not work', error);
          })

        } else {

          const objectId = this.props.objectId

          let placementAgency = false
          if (activeOrg === 'bixel' || activeOrg === 'c2c' || activeOrg === 'exp' || activeOrg === 'unite-la') {
            placementAgency = true
          } else if (orgFocus === 'Placement') {
            placementAgency = true
          }

          this.setState({ emailId: email, username, activeOrg, orgFocus, placementAgency });

          const collaboratorOptions = [{value: '0'}, {value: '1'},{value: '2'}, {value: '3'}, {value: '4'}, {value: '5'}]
          // const hourOptions = [{value: ''}, {value: '< 10'},{value: '10 - 50'}, {value: '50 - 100'}, {value: '100 - 500'}, {value: '500 - 1000'}, {value: '1000 - 5000'}, {value: '5000 - 10000'}, {value: '10000+'}]

          let dateOptions = []
          let educationDateOptions = []

          const currentMonth = new Date().getMonth()
          const currentYear = new Date().getFullYear()

          let numberOfYears = 25
          let educationBump = 5
          let month = ''
          let year = currentYear - numberOfYears

          // console.log('show me current stuff', currentMonth, currentYear)
          for (let i = 1; i <= ((numberOfYears + educationBump) * 12); i++) {
            // console.log('show me stuff', i, (i + currentMonth + 1) % 12)
            if ((i + currentMonth + 1) % 12 === 2) {
              month = 'January'
            } else if ((i + currentMonth + 1) % 12 === 3) {
              month = 'February'
            } else if ((i + currentMonth + 1) % 12 === 4) {
              month = 'March'
            } else if ((i + currentMonth + 1) % 12 === 5) {
              month = 'April'
            } else if ((i + currentMonth + 1) % 12 === 6) {
              month = 'May'
            } else if ((i + currentMonth + 1) % 12 === 7) {
              month = 'June'
            } else if ((i + currentMonth + 1) % 12 === 8) {
              month = 'July'
            } else if ((i + currentMonth + 1) % 12 === 9) {
              month = 'August'
            } else if ((i + currentMonth + 1) % 12 === 10) {
              month = 'September'
            } else if ((i + currentMonth + 1) % 12 === 11) {
              month = 'October'
            } else if ((i + currentMonth + 1) % 12 === 0) {
              month = 'November'
            } else if ((i + currentMonth + 1) % 12 === 1) {
              month = 'December'
            }

            if (month === 'January') {
              year = year + 1
            }

            // dateOptions.push({ value: month + ' ' + year})
            if (i <= (numberOfYears * 12)) {
              dateOptions.push({ value: month + ' ' + year})
            }
            educationDateOptions.push({ value: month + ' ' + year })

          }

          const startDate = dateOptions[dateOptions.legnth - 1]
          const endDate = dateOptions[dateOptions.length - 1]

          Axios.get('https://www.guidedcompass.com/api/projects', { params: { emailId: email, includeCollaborations: true } })
          .then((response) => {
            console.log('Projects query attempted', response.data);

              if (response.data.success) {
                console.log('successfully retrieved projects')

                if (response.data.projects) {

                  const projects = response.data.projects
                  if (projects.length > 0) {
                    console.log('the array is greater than 0')

                    let isEditingProjectsArray = []
                    let projectHasChangedArray = []

                    let showGrade = false
                    let modalIsOpen = false
                    let selectedIndex = 0

                    let collaboratorProjects = []

                    for (let i = 0; i < projects.length; i++) {
                      console.log('let see iteration', i)
                      isEditingProjectsArray.push(false)
                      projectHasChangedArray.push(false)

                      // lets not worry about this now
                      // if (projects[i].collaborators && projects[i].collaborators.length > 0) {
                      //   for (let j = 0; j < projects[i].collaborators.length; j++) {
                      //     if (!projects[i].collaborators[j].joined) {
                      //       let projectToAdd = projects[i]
                      //       projectToAdd['collaboratorEmail'] = projects[i].collaborators[j].email
                      //       collaboratorProjects.push(projectToAdd)
                      //     }
                      //   }
                      // }

                      //if coming from notifications
                      if (objectId) {

                        // let objectId = this.props.location.state.objectId
                        let localObjectId = AsyncStorage.getItem('objectId');

                        console.log('compare projectids: ', projects[i]._id, objectId)
                        if (localObjectId && projects[i]._id === objectId) {

                          showGrade = true
                          modalIsOpen = true
                          selectedIndex = i
                        }
                      }
                    }

                    const projectOptions = [{ name: 'Select a project' }].concat(projects)

                    //need to save to AsyncStorage instead, and turn it off when closeModal is tapped
                    this.setState({
                      projects, isEditingProjectsArray, projectHasChangedArray,
                      showGrade, modalIsOpen, selectedIndex, projectOptions
                    })

                    // update collaborators
                    console.log('show collaboratorProjects: ', collaboratorProjects.length)

                    // pull info by collaboratorEmail
                    // lets not worry about this now

                  }
                }

              } else {
                console.log('no project data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Project query did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/experience', { params: { emailId: email } })
          .then((response) => {
            console.log('Experience query attempted', response.data);

              if (response.data.success) {
                console.log('successfully retrieved experience')

                if (response.data.experience) {

                  const experience = response.data.experience
                  if (experience.length > 0) {
                    console.log('the array is greater than 0')

                    let isEditingExperienceArray = []
                    let experienceHasChangedArray = []

                    for (let i = 0; i < experience.length; i++) {
                      console.log('let see iteration', i)
                      isEditingExperienceArray.push(false)
                      experienceHasChangedArray.push(false)
                    }

                    this.setState({ experience, isEditingExperienceArray, experienceHasChangedArray })

                  }
                }

              } else {
                console.log('no experience data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Experience query did not work', error);
          });

          // console.log('about to extra')
          Axios.get('https://www.guidedcompass.com/api/extras', { params: { emailId: email } })
          .then((response) => {
            console.log('Extras query attempted', response.data);

            if (response.data.success) {
              console.log('successfully retrieved extras')

              if (response.data.extras) {

                const extras = response.data.extras
                if (extras.length > 0) {
                  console.log('the array is greater than 0')

                  let extracurriculars = []
                  let isEditingExtracurricularArray = []
                  let extracurricularHasChangedArray = []

                  let awards = []
                  let isEditingAwardArray = []
                  let awardHasChangedArray = []

                  for (let i = 0; i < extras.length; i++) {
                    if (extras[i].type === 'Extracurricular') {
                      extracurriculars.push(extras[i])
                      isEditingExtracurricularArray.push(false)
                      extracurricularHasChangedArray.push(false)
                    } else if (extras[i].type === 'Award') {
                      awards.push(extras[i])
                      isEditingAwardArray.push(false)
                      awardHasChangedArray.push(false)
                    }
                  }

                  this.setState({
                    extracurriculars, isEditingExtracurricularArray, extracurricularHasChangedArray,
                    awards,isEditingAwardArray, awardHasChangedArray
                  })

                }
              }

            } else {
              console.log('no experience data found', response.data.message)
            }

          }).catch((error) => {
              console.log('Experience query did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
          .then((response) => {
            console.log('Org info query attempted cc', response.data);

              if (response.data.success) {
                console.log('org info query worked')

                let schoolOptions = []
                if (response.data.orgInfo.schools) {
                  schoolOptions = response.data.orgInfo.schools
                  schoolOptions.unshift('')
                }

                let pathwayOptions = []
                if (response.data.orgInfo.pathways) {
                  pathwayOptions = response.data.orgInfo.pathways
                  pathwayOptions.unshift({ name: ''})
                }

                let gradYearOptions = []
                if (response.data.orgInfo.gradYearOptions) {
                  gradYearOptions = response.data.orgInfo.gradYearOptions
                  gradYearOptions.unshift('')
                }

                let projectCategoryOptions = [{value: 'I am not sure'}]
                if (activeOrg === 'c2c') {
                  if (response.data.orgInfo.projectCategories) {
                    for (let i = 1; i <= response.data.orgInfo.projectCategories.length; i++) {
                      if (i > 1) {
                        projectCategoryOptions.push({ value: response.data.orgInfo.projectCategories[i - 1]})
                      }
                    }
                  }
                }

                const degree = response.data.orgInfo.degreeType
                this.fetchAllProfileData(email, degree)

                const requirePersonalInfo = response.data.orgInfo.requirePersonalInfo
                this.setState({ requirePersonalInfo })

                Axios.get('https://www.guidedcompass.com/api/workoptions')
                .then((response) => {
                  console.log('Work options query tried', response.data);

                  if (response.data.success) {
                    console.log('Work options query succeeded')

                    let functionOptions = [{value: 'I am not sure'}]
                    for (let i = 1; i <= response.data.workOptions[0].functionOptions.length; i++) {
                      if (i > 1) {
                        functionOptions.push({ value: response.data.workOptions[0].functionOptions[i - 1]})
                      }
                    }

                    let industryOptions = [{value: 'I am not sure'}]
                    for (let i = 1; i <= response.data.workOptions[0].industryOptions.length; i++) {
                      if (i > 1) {
                        industryOptions.push({ value: response.data.workOptions[0].industryOptions[i - 1]})
                      }
                    }

                    let workDistanceOptions = [{value: '0 miles'},{value: '10 miles'}]
                    for (let i = 1; i <= response.data.workOptions[0].workDistanceOptions.length; i++) {
                      if (i > 1) {
                        workDistanceOptions.push({ value: response.data.workOptions[0].workDistanceOptions[i - 1]})
                      }
                    }

                    let hoursPerWeekOptions = [{value: ''}]
                    for (let i = 1; i <= response.data.workOptions[0].hoursPerWeekOptions.length; i++) {
                      if (i > 1) {
                        hoursPerWeekOptions.push({ value: response.data.workOptions[0].hoursPerWeekOptions[i - 1]})
                      }
                    }

                    let hourOptions = [{value: ''}]
                    for (let i = 1; i <= response.data.workOptions[0].hourOptions.length; i++) {
                      if (i > 1) {
                        hourOptions.push({ value: response.data.workOptions[0].hourOptions[i - 1]})
                      }
                    }

                    let workTypeOptions = [{value: 'Internship'}]
                    for (let i = 1; i <= response.data.workOptions[0].workTypeOptions.length; i++) {
                      if (i > 1) {
                        workTypeOptions.push({ value: response.data.workOptions[0].workTypeOptions[i - 1]})
                      }
                    }

                    let hourlyPayOptions = [{value: 'Flexible'}]
                    for (let i = 1; i <= response.data.workOptions[0].hourlyPayOptions.length; i++) {
                      if (i > 1) {
                        hourlyPayOptions.push({ value: response.data.workOptions[0].hourlyPayOptions[i - 1]})
                      }
                    }

                    let annualPayOptions = [{value: 'I am not sure'}]
                    for (let i = 1; i <= response.data.workOptions[0].annualPayOptions.length; i++) {
                      if (i > 1) {
                        annualPayOptions.push({ value: response.data.workOptions[0].annualPayOptions[i - 1]})
                      }
                    }

                    const degreeOptions = response.data.workOptions[0].degreeOptions

                    // let gradYearOptions = []
                    const startingPoint = new Date().getFullYear() - 6
                    for (let i = 1; i <= 10; i++) {
                      gradYearOptions.push(startingPoint + i)
                    }

                    // let projectCategoryOptions = [{value: 'I am not sure'}]
                    for (let i = 1; i <= response.data.workOptions[0].projectCategoryOptions.length; i++) {
                      if (i > 1) {
                        projectCategoryOptions.push({ value: response.data.workOptions[0].projectCategoryOptions[i - 1]})
                      }
                    }

                    // gradYearOptions.push('Other')

                    let politicalAlignmentOptions = ['']
                    if (response.data.workOptions[0].individualPoliticalAlignmentOptions) {
                      for (let i = 1; i <= response.data.workOptions[0].individualPoliticalAlignmentOptions.length; i++) {
                        politicalAlignmentOptions.push(response.data.workOptions[0].individualPoliticalAlignmentOptions[i - 1])
                      }
                    }

                    let registrationOptions = ['']
                    if (response.data.workOptions[0].unitedStateOptions) {
                      for (let i = 1; i <= response.data.workOptions[0].unitedStateOptions.length; i++) {
                        registrationOptions.push(response.data.workOptions[0].unitedStateOptions[i - 1])
                      }
                    }

                    let hometownOptions = registrationOptions

                    const basicCountOptions = ['','1','2','3','4','5','6','7','8','9','10']
                    let householdIncomeOptions = response.data.workOptions[0].lowIncomeOptions
                    householdIncomeOptions.unshift('')
                    let fosterYouthOptions = response.data.workOptions[0].fosterYouthOptions
                    fosterYouthOptions.unshift('')
                    let homelessOptions = response.data.workOptions[0].homelessOptions
                    homelessOptions.unshift('')
                    let incarceratedOptions = response.data.workOptions[0].incarceratedOptions
                    incarceratedOptions.unshift('')

                    const adversityListOptions = ['LGBQIA','ADA','First Generation Immigrant','First Generation College Student','Receiving Free or Reduced-Price Lunch','Receiving Food Stamps','Receiving TANF','None']
                    const careerGoalOptions = response.data.workOptions[0].careerGoalOptions

                    this.setState({ functionOptions, industryOptions, gradYearOptions, pathwayOptions,
                      workDistanceOptions, hoursPerWeekOptions, workTypeOptions, hourlyPayOptions, payOptions: annualPayOptions,
                      projectCategoryOptions, dateOptions,educationDateOptions, collaboratorOptions, hourOptions, degreeOptions,
                      politicalAlignmentOptions, registrationOptions, hometownOptions, schoolOptions,
                      basicCountOptions, householdIncomeOptions, fosterYouthOptions, homelessOptions, incarceratedOptions,
                      adversityListOptions, careerGoalOptions
                    })

                  } else {
                    console.log('no jobFamilies data found', response.data.message)

                    const functionOptions = [{value: 'Undecided'}]
                    const industryOptions = [{value: 'Undecided'}]
                    //const workDistanceOptions = [{value: '0 miles'},{value: '10 miles'}]
                    const hoursPerWeekOptions = [{value: '~ 40 hours / week'}]
                    //const workTypeOptions = [{value: 'Internship'}]
                    //const hourlyPayOptions = [{value: 'Flexible'}]
                    const payOptions = [{value: 'Flexible'}]
                    const hourOptions = [{value: ''}]

                    this.setState({ functionOptions, industryOptions, hoursPerWeekOptions, payOptions, dateOptions, collaboratorOptions, hourOptions, startDate, endDate })

                  }
                }).catch((error) => {
                    console.log('query for work options did not work', error);
                })

              } else {
                console.log('org info query did not work', response.data.message)
              }

          }).catch((error) => {
              console.log('Org info query did not work for some reason', error);
          });

          if (this.props.category === 'Public') {
            // goalOptions for public profile
            Axios.get('https://www.guidedcompass.com/api/logs/goals', { params: { emailId: email } })
            .then((response) => {

                if (response.data.success) {
                  console.log('Goals received query worked', response.data);

                  let goalOptions = [{ title: 'Select a goal'}].concat(response.data.goals)
                  this.setState({ goalOptions })

                } else {
                  console.log('no goal data found', response.data.message)
                }

            }).catch((error) => {
                console.log('Goal query did not work', error);
            });

            // passionOptions for public profile
            Axios.get('https://www.guidedcompass.com/api/logs/passions', { params: { emailId: email } })
            .then((response) => {

                if (response.data.success) {
                  console.log('Passions received query worked', response.data);

                  let passionOptions = [{ passionTitle: 'Select a passion'}].concat(response.data.passions)
                  this.setState({ passionOptions })

                } else {
                  console.log('no passion data found', response.data.message)
                }

            }).catch((error) => {
                console.log('Passion query did not work', error);
            });

            Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId: email } })
             .then((response) => {
               console.log('query for assessment results worked');

               if (response.data.success) {

                 console.log('actual assessment results', response.data)

                 if (response.data.results) {

                   let assessmentOptions = ["Select an Assessment"]
                   // const updatedAt = response.data.results.updatedAt
                   if (response.data.results.workPreferenceAnswers && response.data.results.workPreferenceAnswers.length > 0) {
                     assessmentOptions.push('Work Preferences')
                   }
                   if (response.data.results.interestScores && response.data.results.interestScores.length > 0) {
                     assessmentOptions.push('Interests')
                   }
                   if (response.data.results.skillsScores && response.data.results.skillsScores.length > 0) {
                     assessmentOptions.push('Skills')
                   }
                   if (response.data.results.personalityScores) {
                     assessmentOptions.push('Personality')
                   }
                   if (response.data.results.topGravitateValues && response.data.results.topGravitateValues.length > 0 && response.data.results.topEmployerValues && response.data.results.topEmployerValues.length > 0) {
                     assessmentOptions.push('Values')
                   }

                   this.setState({ assessmentOptions });
                 }

               } else {
                 console.log('error response', response.data)

                 this.setState({ resultsErrorMessage: response.data.message })
               }

           }).catch((error) => {
               console.log('query for assessment results did not work', error);
           })

            // retrieve endorsements
            Axios.get('https://www.guidedcompass.com/api/story', { params: { emailId: email } })
            .then((response) => {
                console.log('Story query worked', response.data);

                if (response.data.success) {

                  const endorsementOptions = [{ senderFirstName: 'Select an Endorsement' }].concat(response.data.stories)
                  this.setState({ endorsementOptions })
                }

            }).catch((error) => {
                console.log('Story query did not work', error);
            });
          }

        }
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  fetchAllProfileData (email, orgDegree) {
    console.log('about to fetchAllProfileData', email)

    Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
    .then((response) => {

        if (response.data.success) {
          console.log('User profile query worked', response.data);

          let resumeName = null
          const resumeURLValue = response.data.user.resumeURL
          if (resumeURLValue) {
            if (resumeURLValue.split("%7C")[2]) {
              resumeName = resumeURLValue.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
            } else {
              resumeName = 'Resume uploaded'
            }
          }

          let resumes  = response.data.user.resumes
          let resumeNames = []
          if (resumes && resumes.length > 0) {
            for (let i = 1; i <= resumes.length; i++) {
              if (resumes[i - 1].split("%7C")[2]) {
                resumeNames.push(resumes[i - 1].split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+"))
              } else {
                resumeNames.push('Resume File #' + i)
              }
            }
          } else {
            if (resumeURLValue) {
              resumes.push(resumeURLValue)
              resumeNames.push(resumeName)
            }
          }

          let degree = ''
          if (response.data.user.degree) {
            degree = response.data.user.degree
          } else if (orgDegree) {
            degree = orgDegree
          }

          let confirmUsername = true
          if (response.data.user.uniqueUsername) {
            confirmUsername = false
          }

          const publicProfile = response.data.user.publicProfile
          const publicProfileExtent = response.data.user.publicProfileExtent
          const publicPreferences = response.data.user.publicPreferences
          const headline = response.data.user.headline

          // eventually render publicPreferences directly
          let postPublicPreference = null
          let publicPosts = []
          let projectPublicPreference = null
          let publicProjects = []
          let goalPublicPreference = null
          let publicGoals = []
          let passionPublicPreference = null
          let publicPassions = []
          let assessmentPublicPreference = null
          let publicAssessments = []
          let endorsementPublicPreference = null
          let publicEndorsements = []
          let resumePublicPreference = null
          let publicResume = null
          let publicResumeName = null

          if (publicPreferences) {
            for (let i = 1; i <= publicPreferences.length; i++) {
              if (publicPreferences[i - 1].name === 'Post') {
                postPublicPreference = publicPreferences[i - 1].value
                publicPosts = publicPreferences[i - 1].publicItems
              } else if (publicPreferences[i - 1].name === 'Project') {
                projectPublicPreference = publicPreferences[i - 1].value
                publicProjects = publicPreferences[i - 1].publicItems
              } else if (publicPreferences[i - 1].name === 'Goal') {
                goalPublicPreference = publicPreferences[i - 1].value
                publicGoals = publicPreferences[i - 1].publicItems
              } else if (publicPreferences[i - 1].name === 'Passion') {
                passionPublicPreference = publicPreferences[i - 1].value
                publicPassions = publicPreferences[i - 1].publicItems
              } else if (publicPreferences[i - 1].name === 'Assessment') {
                assessmentPublicPreference = publicPreferences[i - 1].value
                publicAssessments = publicPreferences[i - 1].publicItems
              } else if (publicPreferences[i - 1].name === 'Endorsement') {
                endorsementPublicPreference = publicPreferences[i - 1].value
                publicEndorsements = publicPreferences[i - 1].publicItems
              } else if (publicPreferences[i - 1].name === 'Resume') {
                resumePublicPreference = publicPreferences[i - 1].value
                if (publicPreferences[i - 1].publicItems && publicPreferences[i - 1].publicItems.length > 0) {
                  publicResume = publicPreferences[i - 1].publicItems[0]
                  publicResumeName = publicPreferences[i - 1].publicItems[0].split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
                }
              }
            }
          }

          this.setState({
              firstNameValue: response.data.user.firstName,
              lastNameValue: response.data.user.lastName,
              linkedInURL: response.data.user.linkedInURL,
              resumeURLValue, resumeName,
              resumes, resumeNames,
              customWebsiteURL: response.data.user.customWebsiteURL,
              videoResumeURL: response.data.user.videoResumeURL,
              education: response.data.user.education,
              school: response.data.user.school,
              schoolName: response.data.user.school,
              schoolDistrict: response.data.user.schoolDistrict,
              degree, orgDegree,
              degreeAttained: response.data.user.degree,
              major: response.data.user.major,
              pathway: response.data.user.pathway,
              gradYear: response.data.user.gradYear,
              race: response.data.user.race,
              gender: response.data.user.gender,
              veteranStatus: response.data.user.veteran,
              workAuthorization: response.data.user.workAuthorization,
              rawPictureURL: response.data.user.rawPictureURL,
              pictureURL: response.data.user.pictureURL,
              profilePicPath: response.data.user.profilePicPath,
              remoteAuth: response.data.user.remoteAuth,
              politicalAlignment: response.data.user.politicalAlignment,
              stateRegistration: response.data.user.stateRegistration,
              currentCongressionalDistrict: response.data.user.currentCongressionalDistrict,
              hometown: response.data.user.hometown,
              homeCongressionalDistrict: response.data.user.homeCongressionalDistrict,
              dacaStatus: response.data.user.dacaStatus,
              successDefined: response.data.user.successDefined,

              dateOfBirth: response.data.user.dateOfBirth,
              phoneNumber: response.data.user.phoneNumber,
              address: response.data.user.address,
              city: response.data.user.city,
              numberOfMembers: response.data.user.numberOfMembers,
              householdIncome: response.data.user.householdIncome,
              fosterYouth: response.data.user.fosterYouth,
              homeless: response.data.user.homeless,
              incarcerated: response.data.user.incarcerated,
              adversityList: response.data.user.adversityList,

              jobTitle: response.data.user.jobTitle,
              employerName: response.data.user.employerName,
              zipcode: response.data.user.zipcode,
              workTenure: response.data.user.workTenure,
              overallFit: response.data.user.overallFit,
              studyFields: response.data.user.studyFields,
              careerTrack: response.data.user.careerTrack,
              homeNumber: response.data.user.homeNumber,
              lastOfSocialSecurity: response.data.user.lastOfSocialSecurity,
              IEPPlan: response.data.user.IEPPlan,
              parentName: response.data.user.parentName,
              parentRelationship: response.data.user.parentRelationship,
              parentPhone: response.data.user.parentPhone,
              parentEmail: response.data.user.parentEmail,
              emergencyContactName: response.data.user.emergencyContactName,
              emergencyContactRelationship: response.data.user.emergencyContactRelationship,
              emergencyContactPhone: response.data.user.emergencyContactPhone,
              emergencyContactEmail: response.data.user.emergencyContactEmail,

              careerGoals: response.data.user.careerGoals,
              oauthUid: response.data.user.oauthUid,
              location: response.data.user.location,

              confirmUsername, publicProfile, publicProfileExtent, publicPreferences,
              postPublicPreference, publicPosts,
              projectPublicPreference, publicProjects,
              goalPublicPreference, publicGoals,
              passionPublicPreference, publicPassions,
              assessmentPublicPreference, publicAssessments,
              endorsementPublicPreference, publicEndorsements,
              resumePublicPreference, publicResume, publicResumeName,
              headline

          });

        } else {
          console.log('no user details found', response.data.message)

        }

    }).catch((error) => {
        console.log('User profile query did not work', error);
    });
  }

  mobileNav (event) {
      console.log('mobile nav clicked')
      if (this.state.mobileNavClass === "side-nav") {
          this.setState({
              mobileNavClass: 'side-nav-mobile',
              isVisible: false
          })
      } else {
          this.setState({
              mobileNavClass: 'side-nav',
              isVisible: true
          })
      }
  }

  componentDidCatch(error, info) {
    console.log('componentDidCatch called:', error, info)
  }

  formChangeHandler = (eventName,eventValue, dateEvent) => {
    console.log('formChangeHandler called: ', eventName, eventValue, dateEvent)

    // for all pickers
    if (eventValue && !dateEvent) {
      this.setState({ selectedValue: eventValue })
    }

    if (dateEvent && Platform.OS === 'android') {
      console.log('in dateEvent', dateEvent)
      //{"nativeEvent": {}, "type": "dismissed"}
      // {"nativeEvent": {"timestamp": 2022-01-15T23:17:05.451Z}, "type": "set"}
      if (eventName.includes('awardDate')) {
        if (eventValue) {

          eventValue = convertDateToString(new Date(eventValue),'hyphenatedDate')

          const nameArray = eventName.split("|")
          const index = nameArray[1]

          let awards = this.state.awards
          awards[index]['awardDate'] = eventValue

          let awardHasChangedArray = this.state.awardHasChangedArray
          awardHasChangedArray[index] = true

          let awardHasChanged = true

          this.setState({ awards, awardHasChanged, awardHasChangedArray,  selectedValue: eventValue, textFormHasChanged: true, showDateTimePicker: false, modalIsOpen: false })
        } else {
          this.setState({ showDateTimePicker: false, modalIsOpen: false })
        }
      } else {
        if (eventValue) {
          eventValue = convertDateToString(new Date(eventValue),'hyphenatedDate')
          console.log('is this working? ', eventValue)
          this.setState({ [eventName]: eventValue,  selectedValue: eventValue, textFormHasChanged: true, showDateTimePicker: false, modalIsOpen: false })
        } else {
          this.setState({ showDateTimePicker: false, modalIsOpen: false })
        }
      }

    } else if (eventName === 'profilePic') {
      console.log('profilePicSelectedHandler changed')

      const options = {
        selectionLimit: 1,
        mediaType: 'photo',
        includeBase64: false,
      };

      // const launch = async () => {
      //   const result = await launchImageLibrary(options?);
      //   console.log('show result: ', result)
      // }
      //
      // launch()
      const self = this
      function pickedImage(callbackObject) {
        console.log('callback called, ', callbackObject)

        if (callbackObject && callbackObject.assets && callbackObject.assets[0]) {
          const file = callbackObject.assets[0]
          const mbLimit = 10
          if (file.fileSize > mbLimit * 1024 * 1024) {
            console.log('file is too big')

            const errorMessage = 'File must be less than ' + mbLimit + 'MB. This file is ' + (file.fileSize / (1024 * 1024)).toFixed() + 'MB'
            self.setState({ serverSuccessProfilePic: false, serverErrorMessageProfilePic: errorMessage })

          } else {
            console.log('file is small enough')

            self.setState({ profilePicFile: file, profilePicImage: file.uri })
            // let reader = new FileReader();
            // reader.onload = (e) => {
            //     self.setState({ profilePicImage: file.uri });
            //     console.log('how do i access the image', e.target.result)
            // };
            // reader.readAsDataURL(file);
            // // this.setState({ profilePicFile: event.target.files[0], profilePicHasChanged: true })
            self.saveFile(eventName, file)
          }
        }
      }
      launchImageLibrary(options,pickedImage);
      // const result = await launchImageLibrary(options?);
      // console.log('show result: ', result)

      // if (event.target.files[0]) {
      //   if (event.target.files[0].size > 1 * 1024 * 1024) {
      //     console.log('file is too big')
      //
      //     const errorMessage = 'File must be less than 1MB.'
      //     this.setState({ serverSuccessProfilePic: false, serverErrorMessageProfilePic: errorMessage })
      //
      //   } else {
      //     console.log('file is small enough', event.target.files[0].size)
      //
      //     let reader = new FileReader();
      //     reader.onload = (e) => {
      //         this.setState({ profilePicImage: e.target.result });
      //         console.log('how do i access the image', e.target.result)
      //     };
      //     reader.readAsDataURL(event.target.files[0]);
      //     // this.setState({ profilePicFile: event.target.files[0], profilePicHasChanged: true })
      //     this.saveFile(eventName, event.target.files[0])
      //   }
      // }

    } else if (eventName === 'pictureURL') {
      //only covers Google Drive for now
      // https://drive.google.com/file/d/1x5MeSXzjC4dbmwfESGpspe7WnmkbNKLB/view?usp=sharing
      // https://drive.google.com/uc?export=view&id=1x5MeSXzjC4dbmwfESGpspe7WnmkbNKLB
      const rawPictureURL = eventValue

      // .indexOf('<saml:Attribute Name="uid"')
      const startString = rawPictureURL.indexOf('/d/')
      const endString = rawPictureURL.indexOf('/view')

      if (startString > 0 && endString > 0 && rawPictureURL.includes('google')) {
        const pictureId = rawPictureURL.substring(startString + 3, endString)
        const pictureURL = 'https://drive.google.com/uc?export=view&id=' + pictureId

        this.setState({ rawPictureURL, pictureURL, textFormHasChanged: true })
        console.log('show pic values 1: ', rawPictureURL, pictureURL)

        if (this.props.fromApply) {
          this.props.passData('pictureURL', eventValue, null, 'basic')
        }
      } else {
        const pictureURL = ''
        this.setState({ rawPictureURL, pictureURL, textFormHasChanged: true })
        console.log('show pic values 2: ', rawPictureURL, pictureURL)

        if (this.props.fromApply) {
          this.props.passData('pictureURL', eventValue, null, 'basic')
        }
      }

    } else if (eventName === 'coverPic') {
        console.log('coverPicSelectedHandler changed', event.target.files[0])

        if (event.target.files[0]) {
            let reader = new FileReader();
            console.log('entered the file reader stage')
            reader.onload = (e) => {
                this.setState({ coverPicImage: e.target.result });
                console.log('how do i access the cover image', e.target.result)
            };
            reader.readAsDataURL(event.target.files[0]);
            this.setState({ coverPicFile: event.target.files[0], coverPicHasChanged: true })
        }
    } else if (eventName.includes('education|')) {

      const name = eventName.split("|")[1]
      const index = Number(eventName.split("|")[2])

      let education = this.state.education
      education[index][name] = eventValue
      this.setState({ education, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData('education', eventValue, null, 'basic')
      }
      if (name === 'name') {
        this.searchSchools(eventValue)
      }
    } else if (eventName === 'firstName') {
      this.setState({ firstNameValue: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData('firstName', eventValue, null, 'basic')
      }
    } else if (eventName === 'lastName') {
      this.setState({ lastNameValue: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData('lastName', eventValue, null, 'basic')
      }

    } else if (eventName === 'linkedInURL') {
      this.setState({ linkedInURL: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData('linkedInURL', eventValue, null, 'basic')
      }
    } else if (eventName === 'resumeURL') {
      console.log('resumeURLSelectedHandler changed', event)
      this.setState({ resumeURLValue: eventValue, textFormHasChanged: true })
    } else if (eventName === 'resume') {
      // console.log('profilePicSelectedHandler changed')

      // DocumentPicker.pickSingleFile({
      //   filetype: [DocumentPickerUtil.allFiles()],
      // },(error,res) => {
      //   // Android
      //   console.log(
      //      res.uri,
      //      res.type, // mime type
      //      res.fileName,
      //      res.fileSize
      //   );
      // });
      const self = this
      const openDocumentPicker = async ()=>{
          // Pick a single file
          try {
            const res = await DocumentPicker.pick({
                type: [DocumentPicker.types.allFiles],
            });
            console.log('output' + JSON.stringify(res));

            const mbLimit = 10
            if (res.size > mbLimit * 1024 * 1024) {
              console.log('file is too big')

              const errorMessage = 'File must be less than ' + mbLimit + 'MB. This file is ' + (file.fileSize / (1024 * 1024)).toFixed() + 'MB'
              self.setState({ serverSuccessProfilePic: false, serverErrorMessageProfilePic: errorMessage })

            } else {
              console.log('file is small enough')

              let file = res[0]
              file['fileName'] = file.name
              file['fileSize'] = file.size
              file['uri'] = file.uri
              file['type'] = file.type
              console.log('show me the uri: ', file.uri)
              self.saveFile(eventName, file)
            }

          } catch (err) {
            if (DocumentPicker.isCancel(err)) {
                // User cancelled the picker, exit any dialogs or menus and move on
            } else {
                throw err
            }
          }
      }

      openDocumentPicker()

      // if (event.target.files[0]) {
      //   if ( event.target.files[0].size > 1 * 1024 * 1024) {
      //     console.log('file is too big')
      //
      //     const errorMessage = 'File must be less than 1MB.'
      //     this.setState({ serverSuccessResume: false, serverErrorMessageResume: errorMessage, serverSuccessMessageResume: null })
      //
      //   } else {
      //     console.log('file is small enough', event.target.files[0].size)
      //
      //     let reader = new FileReader();
      //     reader.onload = (e) => {
      //
      //       // const resumeName = e.target.result
      //       // this.setState({ profilePicImage: e.target.result });
      //       // console.log('how do i access the image', event.target.files[0].name)
      //     };
      //     reader.readAsDataURL(event.target.files[0]);
      //     // this.setState({ profilePicFile: event.target.files[0], profilePicHasChanged: true })
      //     console.log('how do i access the image', event.target.files[0].name)
      //     this.saveFile(eventName, event.target.files[0])
      //   }
      // }
    } else if (eventName === 'customWebsiteURL') {
      console.log('customWebsiteURLSelectedHandler changed', event)
      this.setState({ customWebsiteURL: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData('customWebsiteURL', eventValue, null, 'basic')
      }
    } else if (eventName === 'school') {
      this.setState({ schoolName: eventValue, textFormHasChanged: true })
      this.searchSchools(eventValue)
    } else if (eventName === 'schoolName') {
      this.setState({ schoolName: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData(eventName, eventValue, null, 'basic')
      }
      this.searchSchools(eventValue)
    } else if (eventName === 'degree') {
      this.setState({ degree: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData(eventName, eventValue, null, 'basic')
      }
    } else if (eventName === 'degreeAttained') {
      this.setState({ degreeAttained: eventValue, textFormHasChanged: true })
    } else if (eventName === 'major') {
      this.setState({ major: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData(eventName, eventValue, null, 'basic')
      }
    } else if (eventName === 'pathway') {
      this.setState({ pathway: eventValue, textFormHasChanged: true })
    } else if (eventName === 'gradYear') {
      this.setState({ gradYear: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData(eventName, eventValue, null, 'basic')
      }
    } else if (eventName === 'race') {
      this.setState({ race: eventValue, textFormHasChanged: true })
    } else if (eventName === 'gender') {
      this.setState({ gender: eventValue, textFormHasChanged: true })
    } else if (eventName === 'veteranStatus') {
      this.setState({ veteranStatus: eventValue, textFormHasChanged: true })
    } else if (eventName === 'workAuthorization') {
      this.setState({ workAuthorization: eventValue, textFormHasChanged: true })
    } else if (eventName === 'overallFit') {
      this.setState({ overallFit: eventValue, textFormHasChanged: true })
    } else if (eventName.includes('projectTitle')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['name'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('projectURL')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['url'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('projectCategory')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['category'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('projectDescription')) {

      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['description'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('startDate')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['startDate'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('endDate')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['endDate'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('collaboratorEmail')) {
      const collaboratorEmail = eventValue
      let projectHasChanged = true
      this.setState({ collaboratorEmail, projectHasChanged })
    } else if (eventName.includes('collaboratorCount')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['collaboratorCount'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('collaborator')) {
      const nameArray = eventName.split("|")
      const macroIndex = nameArray[1]
      const microIndex = nameArray[2]

      let projects = this.state.projects
      let collaborators = projects[macroIndex].collaborators
      if (collaborators) {
        collaborators[microIndex] = eventValue
      } else {
        collaborators = [eventValue]
      }

      projects[macroIndex]['collaborators'] = collaborators
      console.log('show collaborators: ', projects[macroIndex].collaborators)

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[macroIndex] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('projectHours')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['hours'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('projectTotalHours')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['totalHours'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('projectFocus')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['focus'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('skillTags')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['skillTags'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })

    } else if (eventName.includes('industryTags')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['industryTags'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('projectFunction')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['jobFunction'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })

    } else if (eventName.includes('projectIndustry')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let projects = this.state.projects
      projects[index]['industry'] = eventValue

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (eventName.includes('isEditingProjectsArray')) {

      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let isEditingProjectsArray = this.state.isEditingProjectsArray
      if (isEditingProjectsArray[index]) {
        isEditingProjectsArray[index] = false
      } else {
        isEditingProjectsArray[index] = true
      }
      this.setState({ isEditingProjectsArray })
    } else if (eventName.includes('isEditingExperienceArray')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let isEditingExperienceArray = this.state.isEditingExperienceArray
      if (isEditingExperienceArray[index]) {
        isEditingExperienceArray[index] = false
      } else {
        isEditingExperienceArray[index] = true
      }
      this.setState({ isEditingExperienceArray })

    } else if (eventName.includes('isEditingExtracurricularArray')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let isEditingExtracurricularArray = this.state.isEditingExtracurricularArray
      if (isEditingExtracurricularArray[index]) {
        isEditingExtracurricularArray[index] = false
      } else {
        isEditingExtracurricularArray[index] = true
      }
      this.setState({ isEditingExtracurricularArray })
    } else if (eventName.includes('isEditingAwardArray')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let isEditingAwardArray = this.state.isEditingAwardArray
      if (isEditingAwardArray[index]) {
        isEditingAwardArray[index] = false
      } else {
        isEditingAwardArray[index] = true
      }
      this.setState({ isEditingAwardArray })

    } else if (eventName.includes('jobTitle|')) {

      const nameArray = eventName.split("|")
      const index = nameArray[1]
      console.log('we in here??? job title', this.state.experience, index)
      let experience = this.state.experience
      experience[index]['jobTitle'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('employerName|')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['employerName'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('experienceStartDate')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['startDate'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('experienceEndDate')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['endDate'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('jobFunction')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['jobFunction'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('jobIndustry')) {

      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['industry'] = eventValue
      console.log('show industry ', nameArray, index, experience)
      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })

    } else if (eventName.includes('payInterest')) {
      console.log('in payInterest')
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['payInterest'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })

    } else if (eventName.includes('pay')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['pay'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('wasPaid')) {

      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['wasPaid'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('hoursPerWeek')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['hoursPerWeek'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('experienceSkillTags')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['skillTags'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('experienceSupervisorFirstName')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['supervisorFirstName'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('experienceSupervisorLastName')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['supervisorLastName'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('experienceSupervisorTitle')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['supervisorTitle'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('experienceSupervisorEmail')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['supervisorEmail'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })

    } else if (eventName.includes('experienceDescription')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['description'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('workInterest')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['workInterest'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('workSkill')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['workSkill'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('teamInterest')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['teamInterest'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('employerInterest')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['employerInterest'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })

    } else if (eventName.includes('overallFit')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let experience = this.state.experience
      experience[index]['overallFit'] = eventValue

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (eventName.includes('activityName')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let extracurriculars = this.state.extracurriculars
      extracurriculars[index]['activityName'] = eventValue

      let extracurricularHasChangedArray = this.state.extracurricularHasChangedArray
      extracurricularHasChangedArray[index] = true

      let extracurricularHasChanged = true
      this.setState({ extracurriculars, extracurricularHasChanged, extracurricularHasChangedArray })
    } else if (eventName.includes('roleName')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let extracurriculars = this.state.extracurriculars
      extracurriculars[index]['roleName'] = eventValue

      let extracurricularHasChangedArray = this.state.extracurricularHasChangedArray
      extracurricularHasChangedArray[index] = true

      let extracurricularHasChanged = true
      this.setState({ extracurriculars, extracurricularHasChanged, extracurricularHasChangedArray })
    } else if (eventName.includes('extracurricularStartDate')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let extracurriculars = this.state.extracurriculars
      extracurriculars[index]['startDate'] = eventValue

      let extracurricularHasChangedArray = this.state.extracurricularHasChangedArray
      extracurricularHasChangedArray[index] = true

      let extracurricularHasChanged = true
      this.setState({ extracurriculars, extracurricularHasChanged, extracurricularHasChangedArray })
    } else if (eventName.includes('extracurricularEndDate')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let extracurriculars = this.state.extracurriculars
      extracurriculars[index]['endDate'] = eventValue

      let extracurricularHasChangedArray = this.state.extracurricularHasChangedArray
      extracurricularHasChangedArray[index] = true

      let extracurricularHasChanged = true
      this.setState({ extracurriculars, extracurricularHasChanged, extracurricularHasChangedArray })
    } else if (eventName.includes('extracurricularHoursPerWeek')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let extracurriculars = this.state.extracurriculars
      extracurriculars[index]['hoursPerWeek'] = eventValue

      let extracurricularHasChangedArray = this.state.extracurricularHasChangedArray
      extracurricularHasChangedArray[index] = true

      let extracurricularHasChanged = true
      this.setState({ extracurriculars, extracurricularHasChanged, extracurricularHasChangedArray })
    } else if (eventName.includes('extracurricularDescription')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let extracurriculars = this.state.extracurriculars
      extracurriculars[index]['description'] = eventValue

      let extracurricularHasChangedArray = this.state.extracurricularHasChangedArray
      extracurricularHasChangedArray[index] = true

      let extracurricularHasChanged = true
      this.setState({ extracurriculars, extracurricularHasChanged, extracurricularHasChangedArray })
    } else if (eventName.includes('awardName')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let awards = this.state.awards
      awards[index]['name'] = eventValue

      let awardHasChangedArray = this.state.awardHasChangedArray
      awardHasChangedArray[index] = true

      let awardHasChanged = true
      this.setState({ awards, awardHasChanged, awardHasChangedArray })

    } else if (eventName.includes('awardDate')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let awards = this.state.awards
      awards[index]['awardDate'] = convertDateToString(new Date(eventValue),'hyphenatedDate')

      let awardHasChangedArray = this.state.awardHasChangedArray
      awardHasChangedArray[index] = true

      let awardHasChanged = true
      this.setState({ awards, awardHasChanged, awardHasChangedArray })

    } else if (eventName.includes('awardDescription')) {
      const nameArray = eventName.split("|")
      const index = nameArray[1]

      let awards = this.state.awards
      awards[index]['description'] = eventValue

      let awardHasChangedArray = this.state.awardHasChangedArray
      awardHasChangedArray[index] = true

      let awardHasChanged = true
      this.setState({ awards, awardHasChanged, awardHasChangedArray })

    } else if (eventName === 'politicalAlignment') {
      this.setState({ politicalAlignment: eventValue, textFormHasChanged: true })
    } else if (eventName === 'stateRegistration') {
      this.setState({ stateRegistration: eventValue, textFormHasChanged: true })
    } else if (eventName === 'currentCongressionalDistrict') {
      this.setState({ currentCongressionalDistrict: eventValue, textFormHasChanged: true })
    } else if (eventName === 'hometown') {
      this.setState({ hometown: eventValue, textFormHasChanged: true })
    } else if (eventName === 'homeCongressionalDistrict') {
      this.setState({ homeCongressionalDistrict: eventValue, textFormHasChanged: true })
    } else if (eventName === 'dacaStatus') {
      this.setState({ dacaStatus: eventValue, textFormHasChanged: true })
    } else if (eventName === 'dateOfBirth') {
      // console.log('dateOfBirth called: ', convertDateToString(new Date(eventValue),'hyphenatedDate'))

      this.setState({ dateOfBirth: convertDateToString(new Date(eventValue),'hyphenatedDate'), textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData(eventName, eventValue, null, 'basic')
      }
    } else if (eventName === 'phoneNumber') {
      this.setState({ phoneNumber: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData(eventName, eventValue, null, 'basic')
      }
    } else if (eventName === 'address') {
      this.setState({ address: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData(eventName, eventValue, null, 'basic')
      }
    } else if (eventName === 'city') {
      this.setState({ city: eventValue, textFormHasChanged: true })
    } else if (eventName === 'numberOfMembers') {
      this.setState({ numberOfMembers: eventValue, textFormHasChanged: true })
    } else if (eventName === 'householdIncome') {
      this.setState({ householdIncome: eventValue, textFormHasChanged: true })
    } else if (eventName === 'fosterYouth') {
      this.setState({ fosterYouth: eventValue, textFormHasChanged: true })
    } else if (eventName === 'homeless') {
      this.setState({ homeless: eventValue, textFormHasChanged: true })
    } else if (eventName === 'incarcerated') {
      this.setState({ incarcerated: eventValue, textFormHasChanged: true })
    } else if (eventName === 'adversityList') {
      this.setState({ adversityList: eventValue, textFormHasChanged: true })
    } else if (eventName === 'jobTitle') {
      this.setState({ jobTitle: eventValue, textFormHasChanged: true })
    } else if (eventName === 'employerName') {
      this.setState({ employerName: eventValue, textFormHasChanged: true })
    } else if (eventName === 'zipcode') {
      this.setState({ zipcode: eventValue, textFormHasChanged: true })
      if (this.props.fromApply) {
        this.props.passData(eventName, eventValue, null, 'basic')
      }
    } else if (eventName === 'workTenure') {
      this.setState({ workTenure: eventValue, textFormHasChanged: true })
    } else if (eventName === 'studyFields') {
      this.setState({ studyFields: eventValue, textFormHasChanged: true })
    } else if (eventName === 'careerTrack') {
      this.setState({ careerTrack: eventValue, textFormHasChanged: true })
    } else if (eventName === 'homeNumber') {
      this.setState({ homeNumber: eventValue, textFormHasChanged: true })
    } else if (eventName === 'lastOfSocialSecurity') {
      this.setState({ lastOfSocialSecurity: eventValue, textFormHasChanged: true })
    } else if (eventName === 'IEPPlan') {
      this.setState({ IEPPlan: eventValue, textFormHasChanged: true })
    } else if (eventName === 'parentName') {
      this.setState({ parentName: eventValue, textFormHasChanged: true })
    } else if (eventName === 'parentRelationship') {
      this.setState({ parentRelationship: eventValue, textFormHasChanged: true })
    } else if (eventName === 'parentPhone') {
      this.setState({ parentPhone: eventValue, textFormHasChanged: true })
    } else if (eventName === 'parentEmail') {
      this.setState({ parentEmail: eventValue, textFormHasChanged: true })
    } else if (eventName === 'emergencyContactName') {
      this.setState({ emergencyContactName: eventValue, textFormHasChanged: true })
    } else if (eventName === 'emergencyContactRelationship') {
      this.setState({ emergencyContactRelationship: eventValue, textFormHasChanged: true })
    } else if (eventName === 'emergencyContactPhone') {
      this.setState({ emergencyContactPhone: eventValue, textFormHasChanged: true })
    } else if (eventName === 'emergencyContactEmail') {
      this.setState({ emergencyContactEmail: eventValue, textFormHasChanged: true })
    } else if (eventName === 'projectPublicPreference') {
      this.setState({ projectPublicPreference: eventValue })
    } else if (eventName === 'goalPublicPreference') {
      this.setState({ goalPublicPreference: eventValue })
    } else if (eventName === 'passionPublicPreference') {
      this.setState({ passionPublicPreference: eventValue })
    } else if (eventName === 'assessmentPublicPreference') {
      this.setState({ assessmentPublicPreference: eventValue })
    } else if (eventName === 'endorsementPublicPreference') {
      this.setState({ endorsementPublicPreference: eventValue })
    } else if (eventName === 'resumePublicPreference') {
      let selectedResume = this.state.selectedResume
      if (this.state.resumes && this.state.resumes.length > 0) {
        selectedResume = this.state.resumeNames[this.state.resumeNames.length - 1]
      }
      this.setState({ resumePublicPreference: eventValue, selectedResume })
    } else if (eventName === 'selectedProject') {
      this.setState({ selectedProject: eventValue })
    } else if (eventName === 'selectedGoal') {
      this.setState({ selectedGoal: eventValue })
    } else if (eventName === 'selectedPassion') {
      this.setState({ selectedPassion: eventValue })
    } else if (eventName === 'selectedAssessment') {
      this.setState({ selectedAssessment: eventValue })
    } else if (eventName === 'selectedEndorsement') {
      this.setState({ selectedEndorsement: eventValue })
    } else {
      console.log('there was an error in formChangeHandler')
      this.setState({ [eventName]: eventValue, textFormHasChanged: true })
    }
  }

  saveFile(category, passedFile) {
    console.log('saveFile called', category, passedFile)

    this.setState({ serverErrorMessageResume: null, serverSuccessMessageResume: null })

    const emailId = this.state.emailId
    const fileName = passedFile.fileName
    let originalName = category + '|' + emailId + '|' + fileName + '|' + new Date()

    // console.log('show passedFile uri: ', passedFile.uri)

    //adjust file
    passedFile['name'] = originalName
    passedFile['size'] = passedFile.fileSize
    passedFile['uri'] = passedFile.uri
    if (Platform.OS === 'ios') {
      passedFile['uri'] = passedFile.uri.replace('file://', '')
    }
    // passedFile['lastModified'] = passedFile.fileSize
    // passedFile['lastModifiedDate'] = passedFile.fileSize
    // passedFile['buffer'] = pas
    let fileData = new FormData();
    // const fileName = 'profileImage'
    // const fileName = 'newFile'
    fileData.append('baseFileName', passedFile, originalName)

    fetch("https://www.guidedcompass.com/api/file-upload", {
        mode: 'no-cors',
        method: "POST",
        body: fileData
    }).then(function (res) {
      console.log('what is the profile pic response', res);
      if (res.ok) {
        console.log('is ok?', category)

        if (category === 'profilePic') {
          const serverSuccessProfilePic = true
          const serverSuccessMessageProfilePic = category.charAt(0).toUpperCase() + category.slice(1) + ' saved successfully!'
          this.setState({ serverSuccessProfilePic, serverSuccessMessageProfilePic, profilePicFile: passedFile })
        } else if (category === 'resume') {
          const serverSuccessResume = true
          const serverSuccessMessageResume = category.charAt(0).toUpperCase() + category.slice(1) + ' saved successfully!'
          this.setState({ serverSuccessResume, serverSuccessMessageResume, resumeFile: passedFile, resumeName: fileName })
        }

        const self = this

        res.json()
        .then(function(data) {
          console.log('show data: ', data)

          if (!data.success) {
            // console.log('category??', category)
            if (category === 'profilePic') {
              self.setState({ serverSuccessProfilePic: false, serverErrorMessageProfilePic: 'There was an error: ' + data.message.message })
            } else if (category === 'resume') {
              self.setState({ serverSuccessResume: false, serverErrorMessageResume: 'There was an error: ' + data.message.message })
            }

          } else {
            let newFilePath = data.filePath
            console.log('show filePath: ', newFilePath)

            if (self.props.fromApply && category === 'profilePic') {
              self.props.passData('pictureURL', newFilePath, null, 'basic')
            }

            let existingFilePath = null
            if (category === 'profilePic') {
              if (self.state.pictureURL) {
                existingFilePath = self.state.pictureURL
              } else if (self.state.profilePicPath) {
                existingFilePath = self.state.profilePicPath
              }
            } else if (category === 'resume') {
              existingFilePath = self.state.resumeURLValue

              let resumes = self.state.resumes
              let resumeNames = self.state.resumeNames
              if (resumes && resumes.length > 0) {
                resumes.push(newFilePath)
                if (newFilePath.split("%7C")[2]) {
                  resumeNames.push(newFilePath.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+"))
                } else {
                  resumeNames.push('Resume File #' + resumes.length)
                }
              } else {
                resumes = [newFilePath]
                if (newFilePath.split("%7C")[2]) {
                  resumeNames = [newFilePath.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")]
                } else {
                  resumeNames = ['Resume File #1']
                }
              }

              self.setState({
                serverPostSuccess: true,
                serverSuccessMessage: 'File was saved successfully', resumeURLValue: newFilePath, resumes, resumeNames
              })
            }

            // remove existing file
            if (existingFilePath && !self.state.allowMultipleFiles) {
              const deleteArray = existingFilePath.split("amazonaws.com/")
              console.log('show deleteArrary: ', deleteArray)
              const deleteKey = deleteArray[1].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
              console.log('show deleteKey: ', deleteKey)

              Axios.put('https://www.guidedcompass.com/api/file', { deleteKey })
              .then((response) => {
                console.log('tried to delete', response.data)
                if (response.data.success) {
                  //save values
                  console.log('File delete worked');

                  if (category === 'profilePic') {
                    self.setState({
                      serverPostSuccess: true,
                      serverSuccessMessage: 'File was saved successfully',
                      profilePicPath: newFilePath, pictureURL: newFilePath
                    })
                  } else if (category === 'resume') {

                    let resumes = this.state.resumes
                    let resumeNames = this.state.resumes
                    if (resumes && resumes.length > 0) {
                      resumes.push(newFilePath)
                      if (newFilePath.split("%7C")[2]) {
                        resumeNames.push(newFilePath.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+"))
                      } else {
                        resumeNames.push('Resume File #' + resumes.length)
                      }
                    } else {
                      resumes = [newFilePath]
                      if (newFilePath.split("%7C")[2]) {
                        resumeNames = [newFilePath.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")]
                      } else {
                        resumeNames = ['Resume File #1']
                      }
                    }

                    self.setState({
                      serverPostSuccess: true,
                      serverSuccessMessage: 'File was saved successfully', resumeURLValue: newFilePath, resumes, resumeNames
                    })
                  }

                } else {
                  console.error('there was an error saving the file: ', response.data.message);
                  self.setState({
                    serverPostSuccess: false,
                    serverErrorMessage: response.data.message,
                  })
                }
              }).catch((error) => {
                  console.log('The saving did not work', error);
                  self.setState({
                    serverPostSuccess: false,
                    serverErrorMessage: error,
                  })
              });
            }
          }
        })

      } else if (res.status === 401) {
        //unauthorized

        console.error('there was an error saving the file: unauthorized');

        this.setState({
            serverSuccessProfilePic: false,
            serverErrorMessageProfilePic: 'There was an error saving profile pic: Unauthorized save.'
        })
      } else if (res.status === 413) {
        //too large

        const errorMessage = 'payload too large'
        console.error(errorMessage);

        this.setState({
            serverSuccessProfilePic: false,
            serverErrorMessageProfilePic: errorMessage
        })
      }
    }.bind(this), function (e) {
      //there was an error

      console.error('there was an error saving the file: ', e);

      this.setState({
          serverSuccessProfilePic: false,
          serverErrorMessageProfilePic: 'There was an error saving profile pic:' + e
      })
    }.bind(this));
  }

  switchPreferences(change) {
    console.log('switchPreferences called', change)

    if (change) {

      if (this.state.confirmUsername) {
        this.savePreferences(false, true)
      } else {
        this.savePreferences(false, false, false)
      }
    } else {

      this.savePreferences(true, null)
    }
  }

  segueToApp() {
    console.log('segueToApp called')

    if (this.props.opportunityId) {
      this.props.navigation.navigate('OpportunityDetails', { objectId: this.props.opportunityId })
    } else {
      this.props.navigation.navigate('App')
    }
  }

  savePreferences(makePrivate, confirmUsername, segue) {
    console.log('savePreferences called', makePrivate, confirmUsername, segue)

    this.setState({ isSaving: true, publicPreferencesErrorMessage: null, publicPreferencesSuccessMessage: null })

    if (makePrivate) {
      // save profile as profile
      console.log('save profile as private')

      const emailId = this.state.emailId
      Axios.post('https://www.guidedcompass.com/api/profile/public-preferences', { emailId, makePrivate })
      .then((response) => {

        if (response.data.success) {
          //save values

          console.log('Public preferences save worked ', response.data);
          this.setState({ publicProfile: false, publicPreferencesSuccessMessage: 'Public preferences saved successfully', isSaving: false })

        } else {
          console.log('preferenes did not save successfully')
          this.setState({ publicPreferencesErrorMessage: response.data.message, isSaving: false })
        }

      }).catch((error) => {
          console.log('Preferences save did not work', error);
          this.setState({ publicPreferencesErrorMessage: 'Something went wrong saving preferences', isSaving: false })
      });

    } else {

      if (confirmUsername) {
        // check uniqueness of username, create unique username, create profile link
        console.log('create unique username')

        if (!this.state.dateOfBirth) {
          // verify over 18
          this.setState({ isSaving: false, modalIsOpen: true, showProjectDetail: false, showGrade: false, showJobFunction: false, showIndustry: false, skillTagsInfo: false, showSettings: false, showBirthdate: true })

        } else {

          let birthdate = this.state.dateOfBirth
          console.log('show birthdate: ', birthdate, new Date(birthdate))
          // 2021-04-01

          let legalBirthdate = new Date()
          legalBirthdate.setFullYear(new Date().getFullYear() - 18)

          // console.log('compare: ', birthdate, legalBirthdate)

          if (new Date(birthdate) < legalBirthdate) {
            const emailId = this.state.emailId
            const username = this.state.username

            Axios.get('https://www.guidedcompass.com/api/profile/confirm-unique-username', { params: { emailId, username } })
            .then((response) => {
              console.log('Confirm unique username query attempted', response.data);

                if (response.data.success) {
                  console.log('unique username query worked')

                  const username = response.data.username
                  AsyncStorage.setItem('username', username)

                  this.setState({ publicProfile: true, isSaving: false, username, confirmUsername: false })
                  if (this.props.fromWalkthrough) {
                    this.segueToApp()
                  }

                } else {
                  console.log('there was an error')
                  this.setState({ publicPreferencesErrorMessage: 'There was an error creating your username', isSaving: false })
                }
            })
          } else {

            this.setState({ isSaving: false, publicPreferencesErrorMessage: 'You are under the age limit to share your profile publicly.', modalIsOpen: true, showProjectDetail: false, showGrade: false, showJobFunction: false, showIndustry: false, skillTagsInfo: false, showSettings: false, showBirthdate: true })
          }
        }

      } else {
        console.log('save specific preferences')

        if (this.state.publicProfile && !this.state.projectPublicPreference) {
          this.setState({ publicPreferencesErrorMessage: 'Please add which projects you want public', isSaving: false})
        } else if (this.state.publicProfile && !this.state.goalPublicPreference) {
          this.setState({ publicPreferencesErrorMessage: 'Please add which goals you want public', isSaving: false})
        } else if (this.state.publicProfile && !this.state.passionPublicPreference) {
          this.setState({ publicPreferencesErrorMessage: 'Please add which passions you want public', isSaving: false})
        } else if (this.state.publicProfile && !this.state.assessmentPublicPreference) {
          this.setState({ publicPreferencesErrorMessage: 'Please add which assessments you want public', isSaving: false})
        } else if (this.state.publicProfile && !this.state.endorsementPublicPreference) {
          this.setState({ publicPreferencesErrorMessage: 'Please add which endorsements you want public', isSaving: false})
        } else {

          const emailId = this.state.emailId
          const publicProfileExtent = this.state.publicProfileExtent

          let publicResume = null
          if (this.state.publicResumeName) {
            if (this.state.resumes && this.state.resumes.length > 0) {
              for (let i = 1; i <= this.state.resumes.length; i++) {
                if (this.state.resumes[i - 1].split("%7C")[2] && this.state.resumes[i - 1].split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+") === this.state.publicResumeName) {
                  publicResume = this.state.resumes[i - 1]
                }
              }
            }
          }

          const publicPreferences = [
            { name: 'Post', value: this.state.postPublicPreference, publicItems: this.state.publicPosts },
            { name: 'Project', value: this.state.projectPublicPreference, publicItems: this.state.publicProjects },
            { name: 'Goal', value: this.state.goalPublicPreference, publicItems: this.state.publicGoals },
            { name: 'Passion', value: this.state.passionPublicPreference, publicItems: this.state.publicPassions },
            { name: 'Assessment', value: this.state.assessmentPublicPreference, publicItems: this.state.publicAssessments },
            { name: 'Endorsement', value: this.state.endorsementPublicPreference, publicItems: this.state.publicEndorsements },
            { name: 'Resume', value: this.state.resumePublicPreference, publicItems: publicResume },
          ]

          const headline = this.state.headline

          let doNotPublicize = false
          let completedOnboarding = false
          if (segue) {
            doNotPublicize = true
            completedOnboarding = true
          }

          // save public profile preferences to user profile
          Axios.post('https://www.guidedcompass.com/api/profile/public-preferences', { emailId, publicProfileExtent, publicPreferences, headline, doNotPublicize, completedOnboarding })
          .then((response) => {

            if (response.data.success) {
              //save values

              console.log('Public preferences save worked ', response.data);
              this.setState({ publicProfile: true, publicPreferencesSuccessMessage: 'Public preferences saved successfully', isSaving: false })
              if (this.props.fromWalkthrough && segue) {
                this.segueToApp()
              }

            } else {
              console.log('preferenes did not save successfully')
              this.setState({ publicPreferencesErrorMessage: response.data.message, isSaving: false })
            }

          }).catch((error) => {
              console.log('Preferences save did not work', error);
              this.setState({ publicPreferencesErrorMessage: 'Something went wrong saving preferences', isSaving: false })
          });

        }
      }
    }
  }

  verifyLegalAge() {
    console.log('verifyLegalAge called')

    this.setState({ isSaving: true, publicPreferencesErrorMessage: null, publicPreferencesSuccessMessage: null })

    if (!this.state.dateOfBirth) {
      // verify over 18
      this.setState({ isSaving: false, publicPreferencesErrorMessage: 'Please add your birthdate' })
    } else {

      let self = this
      function finishPublicSetup(birthdate) {
        console.log('finishPublicSetup called', birthdate)
        // save dateOfBirth and call savePreferences

        const emailId = self.state.emailId
        const dateOfBirth = birthdate
        const updatedAt = new Date()

        Axios.post('/api/users/profile/details', userObject)
        .then((response) => {

          if (response.data.success) {
            console.log('successfully saved profile')

            self.setState({ isSaving: false, modalIsOpen: false })
            self.savePreferences(false, true)

          } else {
            console.log('profile save was not successful')

            this.setState({ isWaiting: false, textFormHasChanged: false,

                serverSuccessText: false,
                serverErrorMessageText: response.data.message,
            })
          }
        }).catch((error) => {
            console.log('Saving the info did not work', error);

        });
      }

      let birthdate = this.state.dateOfBirth
      console.log('show birthdate: ', birthdate, new Date(birthdate))
      // 2021-04-01

      let legalBirthdate = new Date()
      legalBirthdate.setFullYear(new Date().getFullYear() - 18)

      console.log('compare: ', birthdate, legalBirthdate)

      if (new Date(birthdate) < legalBirthdate) {
        finishPublicSetup(birthdate)
      } else {
        this.setState({ isSaving: false, publicPreferencesErrorMessage: 'You are under the age limit to share your profile publicly.' })
      }
    }
  }

  handleSubmit() {
    console.log('handleSubmit called in EditProfileDetails')

    this.setState({
      serverSuccessText: false,
      serverErrorMessageText: '',
      serverSuccessMessageText: '',
    })

    // if (this.state.profilePicHasChanged === true) {
    //   console.log('used has changed profile pic just now!!!')
    //
    //   if (this.state.profilePicImage) {
    //       console.log('profile pic was uploaded')
    //       let profilePicData = new FormData();
    //       profilePicData.append('profileImage', { uri: this.state.profilePicImage.uri, name: emailId, type: 'image/png'})
    //
    //       fetch("https://www.guidedcompass.com/api/users/profile/profile-pic", {
    //         mode: 'no-cors',
    //         method: "POST",
    //         body: profilePicData
    //       }).then(function (res) {
    //         console.log('what is the profile pic response', res.body);
    //         if (res.ok) {
    //           console.log('response was ok')
    //           //success
    //           this.setState({
    //               serverSuccessProfilePic: true,
    //               serverSuccessMessageProfilePic: 'Profile pic saved successfully!'
    //           })
    //         } else if (res.status === 401) {
    //           console.log('response was unauthorized')
    //           //unauthorized
    //           this.setState({
    //               serverSuccessProfilePic: false,
    //               serverErrorMessageProfilePic: 'There was an error saving profile pic: Unauthorized save.'
    //           })
    //         }
    //       }.bind(this), function (e) {
    //         console.log('response was an error', e)
    //         //there was an error
    //         this.setState({
    //             serverSuccessProfilePic: false,
    //             serverErrorMessageProfilePic: 'There was an error saving profile pic:' + e
    //         })
    //       }.bind(this));
    //
    //   }
    // }

    const emailId = this.state.emailId
    let updatedAt = new Date();

    if (this.state.textFormHasChanged || this.props.fromWalkthrough) {
        console.log('used has changed the text portions of the form!!!')

        if (this.state.firstNameValue === '') {
          this.setState({ serverErrorMessageText: 'Please add your first name'})
        } else if (this.state.lastNameValue === '') {
          this.setState({ serverErrorMessageText: 'Please add your last name'})
        } else if (this.state.requirePersonalInfo && (!this.state.address || this.state.address === '')) {
          this.setState({ serverErrorMessageText: 'Please add your address for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.city || this.state.city === '')) {
          this.setState({ serverErrorMessageText: 'Please add your city for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.zipcode || this.state.zipcode === '')) {
          this.setState({ serverErrorMessageText: 'Please add your zip code for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.phoneNumber || this.state.phoneNumber === '')) {
          this.setState({ serverErrorMessageText: 'Please add your phone number for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.dateOfBirth || this.state.dateOfBirth === '')) {
          this.setState({ serverErrorMessageText: 'Please add your date of birth for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.race || this.state.race === '')) {
          this.setState({ serverErrorMessageText: 'Please add your race for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.gender || this.state.gender === '')) {
          this.setState({ serverErrorMessageText: 'Please add your gender for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.workAuthorization || this.state.workAuthorization === '')) {
          this.setState({ serverErrorMessageText: 'Please add your work authorization for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.numberOfMembers || this.state.numberOfMembers === '')) {
          this.setState({ serverErrorMessageText: 'Please add the number of members in your household last name'})
        } else if (this.state.requirePersonalInfo && (!this.state.householdIncome || this.state.householdIncome === '')) {
          this.setState({ serverErrorMessageText: 'Please add your household income for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.fosterYouth || this.state.fosterYouth === '')) {
          this.setState({ serverErrorMessageText: 'Please add whether you are a foster youth for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.homeless || this.state.homeless === '')) {
          this.setState({ serverErrorMessageText: 'Please add whether you were homeless for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.incarcerated || this.state.incarcerated === '')) {
          this.setState({ serverErrorMessageText: 'Please add whether you were incarcerated for program and matching purposes.'})
        } else if (this.state.requirePersonalInfo && (!this.state.adversityList || this.state.adversityList.length === 0)) {
          this.setState({ serverErrorMessageText: 'Please "designate all that apply" for program and matching purposes.'})
        } else {
          let liu = ''

          if (this.state.linkedInURL) {
            liu = this.state.linkedInURL
            const prefix = liu.substring(0,4);

            if (prefix !== "http") {
              liu = "http://" + liu
            }
          }

          let ru = ''
          if (this.state.resumeURLValue) {
            ru = this.state.resumeURLValue
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

          const rawPictureURL = this.state.rawPictureURL
          const pictureURL = this.state.pictureURL
          const firstNameValue = this.state.firstNameValue.trim()
          const lastNameValue = this.state.lastNameValue.trim()
          const linkedInURL = liu
          const resumeURL = ru
          const customWebsiteURL = cwu
          const videoResumeURL = this.state.videoResumeURL
          const headline = this.state.headline

          let school = this.state.schoolName
          if (this.props.fromAdvisor) {
            school = this.state.schoolName
          }
          let degree = this.state.degree
          if (this.props.fromAdvisor) {
            degree = this.state.degreeAttained
          }
          let major = this.state.major
          let pathway = this.state.pathway
          let gradYear = this.state.gradYear
          const education = this.state.education
          if (education && education.length > 0) {
            let selectedEducation = null
            for (let i = 1; i <= education.length; i++) {
              if (education[i - 1].isContinual) {
                selectedEducation = education[i - 1]
              } else if (education[i - 1].endDate && education[i - 1].endDate.split(" ")) {
                const endYear = Number(education[i - 1].endDate.split(" ")[1])
                console.log('show endYear: ', endYear)
                if (!selectedEducation) {
                  selectedEducation = education[i - 1]
                } else if (endYear > Number(selectedEducation.endDate.split(" ")[1])) {
                  selectedEducation = education[i - 1]
                }
              }
            }
            if (selectedEducation) {
              school = selectedEducation.name
              degree = selectedEducation.degree
              major = selectedEducation.major
              if (selectedEducation.endDate) {
                const endYear = Number(selectedEducation.endDate.split(" ")[1])
                gradYear = endYear
                console.log('show gradYear: ', gradYear)
              }
            }
          }

          const race = this.state.race
          const gender = this.state.gender
          const veteran = this.state.veteranStatus
          const workAuthorization = this.state.workAuthorization
          const politicalAlignment = this.state.politicalAlignment
          const stateRegistration = this.state.stateRegistration
          const currentCongressionalDistrict = this.state.currentCongressionalDistrict
          const hometown = this.state.hometown
          const homeCongressionalDistrict = this.state.homeCongressionalDistrict
          const dacaStatus = this.state.dacaStatus

          const dateOfBirth = this.state.dateOfBirth
          const phoneNumber = this.state.phoneNumber
          const address = this.state.address
          const city = this.state.city

          const numberOfMembers = this.state.numberOfMembers
          const householdIncome = this.state.householdIncome
          const fosterYouth = this.state.fosterYouth
          const homeless = this.state.homeless
          const incarcerated = this.state.incarcerated
          const adversityList = this.state.adversityList

          const jobTitle = this.state.jobTitle
          const employerName = this.state.employerName
          const zipcode = this.state.zipcode
          const workTenure = this.state.workTenure
          const overallFit = this.state.overallFit
          const studyFields = this.state.studyFields
          const careerTrack = this.state.careerTrack
          const successDefined = this.state.successDefined

          console.log('linkedIn value check: ', linkedInURL)

          const homeNumber = this.state.homeNumber
          const lastOfSocialSecurity = this.state.lastOfSocialSecurity
          const IEPPlan = this.state.IEPPlan
          const parentName = this.state.parentName
          const parentRelationship = this.state.parentRelationship
          const parentPhone = this.state.parentPhone
          const parentEmail = this.state.parentEmail

          const emergencyContactName = this.state.emergencyContactRelationship
          const emergencyContactRelationship = this.state.emergencyContactRelationship
          const emergencyContactPhone = this.state.emergencyContactPhone
          const emergencyContactEmail = this.state.emergencyContactEmail
          const careerGoals = this.state.careerGoals
          const location = this.state.location

          const userObject = {
            emailId, rawPictureURL, pictureURL,
            firstNameValue, lastNameValue,
            linkedInURL, resumeURL, customWebsiteURL, videoResumeURL, headline, education, school,
            dateOfBirth, phoneNumber, address, city,
            degree, major, pathway, gradYear, race, gender, veteran, workAuthorization,
            politicalAlignment, stateRegistration, currentCongressionalDistrict, hometown, homeCongressionalDistrict, dacaStatus,
            numberOfMembers, householdIncome, fosterYouth, homeless, incarcerated, adversityList,
            jobTitle, employerName, zipcode, workTenure, overallFit,
            studyFields, careerTrack, successDefined,
            homeNumber, lastOfSocialSecurity, IEPPlan,
            parentName, parentRelationship, parentPhone, parentEmail,
            emergencyContactName, emergencyContactRelationship, emergencyContactPhone, emergencyContactEmail,
            careerGoals, location,
            updatedAt
          }

          Axios.post('https://www.guidedcompass.com/api/users/profile/details', userObject)
          .then((response) => {

            if (response.data.success) {
              console.log('successfully saved profile')

              AsyncStorage.setItem('firstName', firstNameValue)
              AsyncStorage.setItem('lastName', lastNameValue)
              if (pictureURL) {
                AsyncStorage.setItem('pictureURL', pictureURL)
              }

              // console.log('saved lastName: ', lastNameValue)

              if (this.props.fromWalkthrough) {
                this.props.movePage(true)
              } else {
                this.setState({ isWaiting: false, textFormHasChanged: false,
                  serverSuccessText: true,
                  serverSuccessMessageText: 'Profile details saved successfully!!!!!!'
                })
              }

            } else {
              console.log('profile save was not successful')

              this.setState({ isWaiting: false, textFormHasChanged: false,

                  serverSuccessText: false,
                  serverErrorMessageText: response.data.message,
              })
            }
          }).catch((error) => {
              console.log('Saving the info did not work', error);

          });
        }

    } else {
      console.log('testing 123')
      this.setState({ clientErrorMessage: 'No changes detected on the profile' })
    }

    if (!this.props.fromAdvisor) {

      if (this.state.isEditingProjectsArray.includes(true)) {
        const index = this.state.isEditingProjectsArray.indexOf(true) + 1
        const rowKey = "project|" + index
        this.saveProject(rowKey)
      }
      if (this.state.isEditingExperienceArray.includes(true)) {
        const index = this.state.isEditingExperienceArray.indexOf(true) + 1
        const rowKey = "experience|" + index
        this.saveExperience(rowKey)
      }
    }
  }

  saveProject(nameKey) {
    console.log('saveProject', nameKey, this.state.projectHasChangedArray)

    this.setState({ clientErrorMessage: ''})

    const nameArray = nameKey.split("|")
    const index = Number(nameArray[1]) - 1
    console.log('show nameArray: ', nameArray, index)

    if (!this.state.projectHasChangedArray[index]) {
      let isEditingProjectsArray = this.state.isEditingProjectsArray
      isEditingProjectsArray[index] = false
      this.setState({ clientErrorMessage: 'Tried to save, but no changes detected on project', isEditingProjectsArray })
    } else {

      for (let i = 1; i <= this.state.projects.length; i++) {

        if (this.state.projectHasChangedArray[i - 1]) {

          if (!this.state.projects[i - 1].name || this.state.projects[i - 1].name === '') {
            this.setState({ clientErrorMessage: 'please add a project name'})
          } else if (!this.state.projects[i - 1].url || this.state.projects[i - 1].url === '') {
            this.setState({ clientErrorMessage: 'please add a url / web link for this project'})
          } else if (!this.state.projects[i - 1].url.includes("http")) {
            this.setState({ clientErrorMessage: 'please add a valid url'})
          } else if (!this.state.projects[i - 1].category || this.state.projects[i - 1].category === '') {
            this.setState({ clientErrorMessage: 'please add a category for this project'})
          } else if (!this.state.projects[i - 1].startDate || this.state.projects[i - 1].startDate === '') {
            this.setState({ clientErrorMessage: 'please indicate when you started working on this project'})
          } else if (!this.state.projects[i - 1].endDate && !this.state.projects[i - 1].isContinual) {
            this.setState({ clientErrorMessage: 'please indicate when you stopped working on this project'})
          } else if (this.state.projects[i - 1].endDate === '' && !this.state.projects[i - 1].isContinual) {
            this.setState({ clientErrorMessage: 'please indicate when you stopped working on this project'})
          } else if (!this.state.projects[i - 1].hours || this.state.projects[i - 1].hours === '') {
            this.setState({ clientErrorMessage: 'please add the number of hours you worked on this project'})
          } else {

            // console.log('show collaboratorCount 1: ', typeof this.state.projects[i - 1].collaboratorCount, this.state.projects[i - 1].collaboratorCount)
            // if (this.state.projects[i - 1].collaboratorCount) {
            //   if (Number(this.state.projects[i - 1].collaboratorCount) > 0) {
            //     console.log('show collaboratorCount 2: ', typeof this.state.projects[i - 1].collaboratorCount, this.state.projects[i - 1].collaboratorCount)
            //     const tempCollaboratorCount = Number(this.state.projects[i - 1].collaboratorCount)
            //     for (let j = 1; j <= tempCollaboratorCount; j++) {
            //       if (this.state.projects[i - 1].collaborators[j - 1]) {
            //         if (this.state.projects[i - 1].collaborators[j - 1] === '') {
            //           return this.setState({ clientErrorMessage: 'please add collaborator emails for each collaborator' })
            //         }
            //       } else {
            //         return this.setState({ clientErrorMessage: 'please add collaborator emails for each collaborator' })
            //       }
            //     }
            //   }
            // }
            // console.log('test 1')
            const emailId = this.state.emailId
            const userFirstName = this.state.cuFirstName
            const userLastName = this.state.cuLastName

            const _id = this.state.projects[i - 1]._id
            const name = this.state.projects[i - 1].name
            const url = this.state.projects[i - 1].url
            const category = this.state.projects[i - 1].category
            const description = this.state.projects[i - 1].description
            const startDate = this.state.projects[i - 1].startDate
            let endDate = this.state.projects[i - 1].endDate
            const isContinual = this.state.projects[i - 1].isContinual

            if (isContinual) {

              const currentMonth = new Date().getMonth()
              const year = new Date().getFullYear()

              let month = ''

              if (currentMonth === 0) {
                month = 'January'
              } else if (currentMonth === 1) {
                month = 'February'
              } else if (currentMonth === 2) {
                month = 'March'
              } else if (currentMonth === 3) {
                month = 'April'
              } else if (currentMonth === 4) {
                month = 'May'
              } else if (currentMonth === 5) {
                month = 'June'
              } else if (currentMonth === 6) {
                month = 'July'
              } else if (currentMonth === 7) {
                month = 'August'
              } else if (currentMonth === 8) {
                month = 'September'
              } else if (currentMonth === 9) {
                month = 'October'
              } else if (currentMonth === 10) {
                month = 'November'
              } else if (currentMonth === 11) {
                month = 'December'
              }

              endDate = month + ' ' + year
            }

            const collaborators = this.state.projects[i - 1].collaborators
            let collaboratorCount = this.state.projects[i - 1].collaboratorCount
            if (this.state.activeOrg !== 'c2c' && collaborators) {
              collaboratorCount = collaborators.length
            }

            const hours = this.state.projects[i - 1].hours
            const totalHours = this.state.projects[i - 1].totalHours
            const focus = this.state.projects[i - 1].focus
            const skillTags = this.state.projects[i - 1].skillTags
            //const industryTags = this.state.projects[i - 1].industryTags
            const jobFunction = this.state.projects[i - 1].jobFunction
            const industry = this.state.projects[i - 1].industry
            console.log('test 2')
            const orgCode = this.state.activeOrg

            const index = i - 1

            const projectObject = {
              _id, emailId, userFirstName, userLastName, name, url, category, description, startDate, endDate, isContinual, collaborators, collaboratorCount,
              hours, totalHours, focus, skillTags, jobFunction, industry, orgCode
            }

            Axios.post('https://www.guidedcompass.com/api/projects', projectObject)
            .then((response) => {
              console.log('test 4')
              if (response.data.success) {
                //save values
                console.log('Project save worked ', response.data);
                //report whether values were successfully saved

                let projectHasChangedArray = this.state.projectHasChangedArray
                projectHasChangedArray[index] = false

                let isEditingProjectsArray = this.state.isEditingProjectsArray
                isEditingProjectsArray[index] = false

                this.setState({
                  projectHasChangedArray, isEditingProjectsArray,

                  serverSuccessText: true,
                  serverSuccessMessageText: 'Projects saved successfully!'
                })

                if (this.props.fromApply) {
                  this.props.passData('project', projectObject, index)
                }

              } else {
                console.log('project did not save successfully')
                this.setState({

                    serverSuccessText: false,
                    serverErrorMessageText: response.data.message,
                })
              }

            }).catch((error) => {
                console.log('Project save did not work', error);
            });
          }
        }
      }
    }
  }

  saveExperience(nameKey) {
    console.log('saveExperience', nameKey)

    this.setState({ clientErrorMessage: ''})

    const nameArray = nameKey.split("|")
    const index = Number(nameArray[1]) - 1

    if (!this.state.experienceHasChangedArray[index]) {

      let isEditingExperienceArray = this.state.isEditingExperienceArray
      isEditingExperienceArray[index] = false
      this.setState({ clientErrorMessage: 'Tried to save, but no changes detected on experience', isEditingExperienceArray })

    } else {

      for (let i = 1; i <= this.state.experience.length; i++) {

        if (this.state.experienceHasChangedArray[i - 1]) {

          if (!this.state.experience[i - 1].jobTitle || this.state.experience[i - 1].jobTitle === '') {
            this.setState({ clientErrorMessage: 'please add a job title for your experience'})
          } else if (!this.state.experience[i - 1].employerName || this.state.experience[i - 1].employerName === '') {
            this.setState({ clientErrorMessage: 'please add an employer name for your experience'})
          } else if (!this.state.experience[i - 1].jobFunction || this.state.experience[i - 1].jobFunction === '') {
            this.setState({ clientErrorMessage: 'please add a job function for your experience'})
          } else if (!this.state.experience[i - 1].industry || this.state.experience[i - 1].industry  === '') {
            this.setState({ clientErrorMessage: 'please add an industry for your experience'})
          } else if (!this.state.experience[i - 1].wasPaid || this.state.experience[i - 1].wasPaid  === '') {
            this.setState({ clientErrorMessage: 'please indicate whether your experience was paid'})
          } else if (!this.state.experience[i - 1].startDate || this.state.experience[i - 1].startDate  === '') {
            this.setState({ clientErrorMessage: 'please add your start date for the experience'})
          } else if (!this.state.experience[i - 1].endDate && !this.state.experience[i - 1].isContinual) {
            this.setState({ clientErrorMessage: 'please add your end date for the experience'})
          } else if (this.state.experience[i - 1].endDate === '' && !this.state.experience[i - 1].isContinual) {
            this.setState({ clientErrorMessage: 'please add your end date for the experience'})
          } else if (!this.state.experience[i - 1].hoursPerWeek || this.state.experience[i - 1].hoursPerWeek  === '') {
            this.setState({ clientErrorMessage: 'please indicate the average number of hours per week you worked'})
          } else if (!this.state.experience[i - 1].overallFit || this.state.experience[i - 1].overallFit  === '') {
            this.setState({ clientErrorMessage: 'please indicate how you feel your experience was an overall fit'})
          } else {

            const emailId = this.state.emailId
            const _id = this.state.experience[i - 1]._id
            const jobTitle = this.state.experience[i - 1].jobTitle
            const employerName = this.state.experience[i - 1].employerName
            const startDate = this.state.experience[i - 1].startDate
            let endDate = this.state.experience[i - 1].endDate
            const isContinual = this.state.experience[i - 1].isContinual

            if (isContinual) {

              const currentMonth = new Date().getMonth()
              const year = new Date().getFullYear()

              let month = ''

              if (currentMonth === 0) {
                month = 'January'
              } else if (currentMonth === 1) {
                month = 'February'
              } else if (currentMonth === 2) {
                month = 'March'
              } else if (currentMonth === 3) {
                month = 'April'
              } else if (currentMonth === 4) {
                month = 'May'
              } else if (currentMonth === 5) {
                month = 'June'
              } else if (currentMonth === 6) {
                month = 'July'
              } else if (currentMonth === 7) {
                month = 'August'
              } else if (currentMonth === 8) {
                month = 'September'
              } else if (currentMonth === 9) {
                month = 'October'
              } else if (currentMonth === 10) {
                month = 'November'
              } else if (currentMonth === 11) {
                month = 'December'
              }

              endDate = month + ' ' + year
            }

            const jobFunction = this.state.experience[i - 1].jobFunction
            const industry = this.state.experience[i - 1].industry
            // const pay = this.state.experience[i - 1].pay
            const wasPaid = this.state.experience[i - 1].wasPaid
            const hoursPerWeek = this.state.experience[i - 1].hoursPerWeek
            const skillTags = this.state.experience[i - 1].skillTags

            const supervisorFirstName = this.state.experience[i - 1].supervisorFirstName
            const supervisorLastName = this.state.experience[i - 1].supervisorLastName
            const supervisorTitle = this.state.experience[i - 1].supervisorTitle
            const supervisorEmail = this.state.experience[i - 1].supervisorEmail

            const description = this.state.experience[i - 1].description

            const workInterest = this.state.experience[i - 1].workInterest
            const workSkill = this.state.experience[i - 1].workSkill
            const teamInterest = this.state.experience[i - 1].teamInterest
            const employerInterest = this.state.experience[i - 1].employerInterest
            const payInterest = this.state.experience[i - 1].payInterest
            const overallFit = this.state.experience[i - 1].overallFit

            const index = i - 1

            const orgCode = this.state.activeOrg

            const createdAt = new Date()
            const updatedAt = new Date()

            const experienceObject = {
              _id, emailId, jobTitle, employerName, startDate, endDate, isContinual, jobFunction, industry, wasPaid, hoursPerWeek,
              skillTags, supervisorFirstName, supervisorLastName, supervisorTitle, supervisorEmail, description,
              workInterest, workSkill, teamInterest, employerInterest, payInterest, overallFit, orgCode,
              createdAt, updatedAt
            }

            Axios.post('https://www.guidedcompass.com/api/experience', experienceObject)
            .then((response) => {

              if (response.data.success) {
                //save values
                console.log('Experience save worked worked', response.data);
                //report whether values were successfully saved

                let experienceHasChangedArray = this.state.experienceHasChangedArray
                experienceHasChangedArray[index] = false

                let isEditingExperienceArray = this.state.isEditingExperienceArray
                isEditingExperienceArray[index] = false

                this.setState({
                  experienceHasChangedArray, isEditingExperienceArray,

                  serverSuccessText: true,
                  serverSuccessMessageText: 'Experience saved successfully!'
                })

                if (this.props.fromApply) {
                  this.props.passData('experience', experienceObject, index)
                }

              } else {
                console.log('experience did not save successfully')
                this.setState({

                    serverSuccessText: false,
                    serverErrorMessageText: response.data.message,
                })
              }

            }).catch((error) => {
                console.log('Experience save did not work', error);
            });
          }
        }
      }
    }
  }

  saveExtras(nameKey, type) {
    console.log('saveExtras', nameKey)

    this.setState({ clientErrorMessage: ''})

    const nameArray = nameKey.split("|")
    const index = Number(nameArray[1]) - 1

    if (!this.state.extracurricularHasChangedArray[index] && !this.state.awardHasChangedArray[index]) {

      if (type === 'extracurricular') {
        let isEditingExtracurricularArray = this.state.isEditingExtracurricularArray
        isEditingExtracurricularArray[index] = false
        this.setState({ clientErrorMessage: 'Tried to save, but no changes detected on extracurriculars', isEditingExtracurricularArray })
      } else if (type === 'award') {
        let isEditingAwardArray = this.state.isEditingAwardArray
        isEditingAwardArray[index] = false
        this.setState({ clientErrorMessage: 'Tried to save, but no changes detected on award', isEditingAwardArray })
      }

    } else {

      if (type === 'extracurricular') {
        for (let i = 1; i <= this.state.extracurriculars.length; i++) {

          if (this.state.extracurricularHasChangedArray[i - 1]) {

            if (!this.state.extracurriculars[i - 1].activityName || this.state.extracurriculars[i - 1].activityName === '') {
              this.setState({ clientErrorMessage: 'please add a name for your extracurricular'})
            } else if (!this.state.extracurriculars[i - 1].roleName || this.state.extracurriculars[i - 1].roleName === '') {
              this.setState({ clientErrorMessage: 'please add your role with the extracurricular'})
            } else if (!this.state.extracurriculars[i - 1].startDate || this.state.extracurriculars[i - 1].startDate === '') {
              this.setState({ clientErrorMessage: 'please add a start date for your extracurricular'})
            } else if (!this.state.extracurriculars[i - 1].endDate && !this.state.extracurriculars[i - 1].isContinual) {
              this.setState({ clientErrorMessage: 'please add your end date for the extracurricular'})
            } else if (this.state.extracurriculars[i - 1].endDate === '' && !this.state.extracurriculars[i - 1].isContinual) {
              this.setState({ clientErrorMessage: 'please add your end date for the extracurricular'})
            } else if (!this.state.extracurriculars[i - 1].hoursPerWeek || this.state.extracurriculars[i - 1].hoursPerWeek  === '') {
              this.setState({ clientErrorMessage: 'please indicate the average number of hours per week you did this extracurricular'})
            } else if (!this.state.extracurriculars[i - 1].description || this.state.extracurriculars[i - 1].description  === '') {
              this.setState({ clientErrorMessage: 'please add a description for the extracurricular'})
            } else {

              const type = 'Extracurricular'
              const emailId = this.state.emailId
              const _id = this.state.extracurriculars[i - 1]._id
              const activityName = this.state.extracurriculars[i - 1].activityName
              const roleName = this.state.extracurriculars[i - 1].roleName
              const startDate = this.state.extracurriculars[i - 1].startDate
              let endDate = this.state.extracurriculars[i - 1].endDate
              const isContinual = this.state.extracurriculars[i - 1].isContinual

              if (isContinual) {

                const currentMonth = new Date().getMonth()
                const year = new Date().getFullYear()

                let month = ''

                if (currentMonth === 0) {
                  month = 'January'
                } else if (currentMonth === 1) {
                  month = 'February'
                } else if (currentMonth === 2) {
                  month = 'March'
                } else if (currentMonth === 3) {
                  month = 'April'
                } else if (currentMonth === 4) {
                  month = 'May'
                } else if (currentMonth === 5) {
                  month = 'June'
                } else if (currentMonth === 6) {
                  month = 'July'
                } else if (currentMonth === 7) {
                  month = 'August'
                } else if (currentMonth === 8) {
                  month = 'September'
                } else if (currentMonth === 9) {
                  month = 'October'
                } else if (currentMonth === 10) {
                  month = 'November'
                } else if (currentMonth === 11) {
                  month = 'December'
                }

                endDate = month + ' ' + year
              }

              const hoursPerWeek = this.state.extracurriculars[i - 1].hoursPerWeek
              const description = this.state.extracurriculars[i - 1].description

              const index = i - 1

              const orgCode = this.state.activeOrg

              const createdAt = new Date()
              const updatedAt = new Date()

              const extraObject = {
                _id, type, emailId, activityName, roleName, startDate, endDate, isContinual, hoursPerWeek, description,
                orgCode,
                createdAt, updatedAt
              }

              Axios.post('https://www.guidedcompass.com/api/extras', extraObject)
              .then((response) => {

                if (response.data.success) {
                  //save values
                  console.log('Extracurricular save worked worked', response.data);
                  //report whether values were successfully saved

                  let extracurricularHasChangedArray = this.state.extracurricularHasChangedArray
                  extracurricularHasChangedArray[index] = false

                  let isEditingExtracurricularArray = this.state.isEditingExtracurricularArray
                  isEditingExtracurricularArray[index] = false

                  this.setState({
                    extracurricularHasChangedArray, isEditingExtracurricularArray,

                    serverSuccessText: true,
                    serverSuccessMessageText: 'Extracurricular saved successfully!'
                  })

                  if (this.props.fromApply) {
                    this.props.passData('extra', extraObject, index)
                  }

                } else {
                  console.log('extracurricular did not save successfully')
                  this.setState({

                      serverSuccessText: false,
                      serverErrorMessageText: response.data.message,
                  })
                }

              }).catch((error) => {
                  console.log('Extracurricular save did not work', error);
              });
            }
          }
        }
      } else if (type === 'award') {

        for (let i = 1; i <= this.state.awards.length; i++) {
          if (this.state.awardHasChangedArray[i - 1]) {

            if (!this.state.awards[i - 1].name || this.state.awards[i - 1].name === '') {
              this.setState({ clientErrorMessage: 'please add a name for your award'})
            } else if (!this.state.awards[i - 1].awardDate || this.state.awards[i - 1].awardDate === '') {
              this.setState({ clientErrorMessage: 'please add the date you awarded this'})
            } else if (!this.state.awards[i - 1].description || this.state.awards[i - 1].description === '') {
              this.setState({ clientErrorMessage: 'please add a description of your award'})
            } else {

              const type = 'Award'
              const emailId = this.state.emailId
              const _id = this.state.awards[i - 1]._id
              const name = this.state.awards[i - 1].name
              const awardDate = this.state.awards[i - 1].awardDate
              const description = this.state.awards[i - 1].description

              const index = i - 1

              const orgCode = this.state.activeOrg

              const createdAt = new Date()
              const updatedAt = new Date()

              const extraObject = {
                _id, type, emailId, name, awardDate, description, orgCode,
                createdAt, updatedAt
              }

              Axios.post('https://www.guidedcompass.com/api/extras', extraObject)
              .then((response) => {

                if (response.data.success) {
                  //save values
                  console.log('Award save worked worked', response.data);
                  //report whether values were successfully saved

                  let awardHasChangedArray = this.state.awardHasChangedArray
                  awardHasChangedArray[index] = false

                  let isEditingAwardArray = this.state.isEditingAwardArray
                  isEditingAwardArray[index] = false

                  this.setState({
                    awardHasChangedArray, isEditingAwardArray,

                    serverSuccessText: true,
                    serverSuccessMessageText: 'Award saved successfully!'
                  })

                  if (this.props.fromApply) {
                    this.props.passData('extra', extraObject, index)
                  }

                } else {
                  console.log('award did not save successfully')
                  this.setState({

                      serverSuccessText: false,
                      serverErrorMessageText: response.data.message,
                  })
                }

              }).catch((error) => {
                  console.log('Award save did not work', error);
              });
            }
          }
        }
      }
    }
  }

  addItem(type) {
    console.log('addItem called', type)

    if (type === 'projects') {
      let projects = this.state.projects
      if (this.state.dateOptions[this.state.dateOptions.length - 1]) {
        projects.unshift({ startDate: this.state.dateOptions[this.state.dateOptions.length - 1].value, endDate: this.state.dateOptions[this.state.dateOptions.length - 1].value})
      } else {
        projects.unshift([])
      }

      let isEditingProjectsArray = this.state.isEditingProjectsArray
      for (let i = 1; i <= isEditingProjectsArray.length; i++) {

        isEditingProjectsArray[i - 1] = false
      }

      isEditingProjectsArray.unshift(true)

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray.unshift(false)

      this.setState({ projects, isEditingProjectsArray, projectHasChangedArray })

    } else if (type === 'experience') {
      let experience = this.state.experience
      if (this.state.dateOptions[this.state.dateOptions.length - 1]) {
        experience.unshift({ startDate: this.state.dateOptions[this.state.dateOptions.length - 1].value, endDate: this.state.dateOptions[this.state.dateOptions.length - 1].value})
      } else {
        experience.unshift([])
      }

      let isEditingExperienceArray = this.state.isEditingExperienceArray
      for (let i = 1; i <= isEditingExperienceArray.length; i++) {
        isEditingExperienceArray[i - 1] = false
      }
      isEditingExperienceArray.unshift(true)

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray.unshift(false)

      this.setState({ experience, isEditingExperienceArray, experienceHasChangedArray })

    } else if (type === 'extracurricular') {
      let extracurriculars = this.state.extracurriculars
      if (this.state.dateOptions[this.state.dateOptions.length - 1]) {
        extracurriculars.unshift({ startDate: this.state.dateOptions[this.state.dateOptions.length - 1].value, endDate: this.state.dateOptions[this.state.dateOptions.length - 1].value})
      } else {
        extracurriculars.unshift([])
      }

      let isEditingExtracurricularArray = this.state.isEditingExtracurricularArray
      for (let i = 1; i <= isEditingExtracurricularArray.length; i++) {
        isEditingExtracurricularArray[i - 1] = false
      }
      isEditingExtracurricularArray.unshift(true)

      let extracurricularHasChangedArray = this.state.extracurricularHasChangedArray
      extracurricularHasChangedArray.unshift(false)

      this.setState({ extracurriculars, isEditingExtracurricularArray, extracurricularHasChangedArray })
    } else if (type === 'award') {
      let awards = this.state.awards
      if (this.state.dateOptions[this.state.dateOptions.length - 1]) {
        awards.unshift({ startDate: this.state.dateOptions[this.state.dateOptions.length - 1].value, endDate: this.state.dateOptions[this.state.dateOptions.length - 1].value})
      } else {
        awards.unshift([])
      }

      let isEditingAwardArray = this.state.isEditingAwardArray
      for (let i = 1; i <= isEditingAwardArray.length; i++) {
        isEditingAwardArray[i - 1] = false
      }
      isEditingAwardArray.unshift(true)

      let awardHasChangedArray = this.state.awardHasChangedArray
      awardHasChangedArray.unshift(false)

      this.setState({ awards, isEditingAwardArray, awardHasChangedArray })
    } else if (type === 'education') {

      let education = this.state.education
      if (education) {
        education.unshift({ name: '' })
      } else {
        education = [{ name: '' }]
      }

      this.setState({ education })

    } else {
      console.log('there was an error')
    }
  }

  finishedEditing = (index, saved) => {
    console.log('finishedEditing called', index, saved)

    let isEditingProjectsArray = this.state.isEditingProjectsArray
    isEditingProjectsArray[index] = false

    if (saved) {
      const serverSuccessText = true
      const serverSuccessMessageText = 'Projects saved successfully!'

      this.setState({ isEditingProjectsArray, serverSuccessText, serverSuccessMessageText })
    } else {
      const serverSuccessText = false
      const serverErrorMessageText = 'Tried to save, but no changes detected on project'

      this.setState({ isEditingProjectsArray, serverSuccessText, serverErrorMessageText })
    }
  }

  renderProjects() {
    console.log('renderProjects called')

    let rows = []

    for (let i = 1; i <= this.state.projects.length; i++) {

      const index = i - 1
      const rowKey = 'project|' + i.toString()

      if (this.state.isEditingProjectsArray[i - 1]) {
        rows.push(
          <View key={rowKey}>
            <View>
              {i > 1 && <View><View style={styles.spacer}/><View style={styles.halfSpacer}/></View>}
              <EditProject selectedProject={this.state.projects[i - 1]} selectedIndex={index}
                projectCategoryOptions={this.state.projectCategoryOptions} dateOptions={this.state.dateOptions}
                collaboratorOptions={this.state.collaboratorOptions}  hourOptions={this.state.hourOptions}
                functionOptions={this.state.functionOptions}  industryOptions={this.state.industryOptions}
                finishedEditing={this.finishedEditing} userPic={this.state.pictureURL} passData={this.passData}
              />
            </View>
          </View>
        )
      } else {
        // console.log('testing before hours ', hourArray)
        let hoursShorthand = 'N/A'

        let hourArray = this.state.projects[i - 1].hours
        if (hourArray) {
          if (hourArray.includes('<')) {
            hoursShorthand = hourArray.replace("<","").replace(" ","")
          } else if (hourArray.includes('+')) {
            hoursShorthand = hourArray.replace("+","")
          } else {
            hourArray = this.state.projects[i - 1].hours.split(' - ')
            let firstValue = Number(hourArray[0])
            let lastValue = Number(hourArray[1])
            console.log('f & l:', firstValue, lastValue)
            hoursShorthand = (firstValue + lastValue) / 2
          }
        }

        rows.push(
          <View key={rowKey} style={styles.rowDirection}>
            <View style={[styles.width70,styles.rightPadding]}>
              <Text numberOfLines={1} style={[styles.headingText2,styles.ctaColor]}>{hoursShorthand}</Text>
              <Text numberOfLines={1} style={styles.descriptionText1}>hours</Text>
            </View>
            <View style={[styles.rightPadding,styles.calcColumn170]}>
              <Text style={styles.headingText5}>{this.state.projects[i - 1].name}</Text>
              <Text style={styles.descriptionText1}>{this.state.projects[i - 1].startDate} - {this.state.projects[i - 1].endDate}</Text>

              <View>
                <View style={styles.spacer} />

                <View style={[styles.rowDirection,styles.bottomMargin20]}>
                  <TouchableOpacity style={[styles.btnPrimary,styles.standardBorder,styles.rowDirection,styles.flexCenter]} onPress={() => this.setState({ modalIsOpen: true, showProjectDetail: true, showGrade: false, selectedIndex: index, showJobFunction: false, showIndustry: false, skillTagsInfo: false, showSettings: false, showBirthdate: false }) }>
                    <View style={styles.rightMargin}>
                      <Image source={{ uri: detailsIconGrey}} style={[styles.square17,styles.contain]} />
                    </View>
                    <View style={styles.topMarginNegative4}>
                      <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>Preview</Text>
                    </View>
                  </TouchableOpacity>

                  {(this.state.projects[i - 1].grades && this.state.projects[i - 1].grades.length > 0) && (
                    <View style={styles.rowDirection}>
                      <View style={[styles.width10,styles.height30]} />

                      <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.rowDirection,styles.flexCenter]} onPress={() => this.setState({ showGrade: true, modalIsOpen: true, selectedIndex: index, showJobFunction: false, showIndustry: false, showProjectDetail: false, skillTagsInfo: false, showSettings: false, showBirthdate: false }) }>
                        <View style={styles.rightPadding5}>
                          <Image source={{ uri: feedbackIconBlue}} style={[styles.square28,styles.contain]} />
                        </View>
                        <View>
                          <Text style={[styles.descriptionText3,styles.ctaColor]}>Feedback</Text>
                        </View>
                      </TouchableOpacity>

                    </View>
                  )}
                </View>

              </View>
            </View>

            {(this.state.projects[i - 1].emailId === this.state.emailId) ? (
              <View style={[styles.width30]}>
                <View>
                  <TouchableOpacity onPress={() => this.formChangeHandler("isEditingProjectsArray|" + index,'')} style={[styles.rightPadding]}>
                    <Image source={{ uri: editIconDark}} style={[styles.square15,styles.contain]} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.topPadding]}>
                  <TouchableOpacity onPress={() => this.deleteItem('project', index)}>
                    <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                  </TouchableOpacity>
                </View>

              </View>
            ) : (
              <View style={[styles.width30]}>
                <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.lightBorder,styles.lightBackground]}>
                  <Text style={[styles.descriptionText3,styles.boldText]}>COL</Text>
                </View>
              </View>
            )}

            <View style={styles.spacer} /><View style={styles.halfSpacer} />
          </View>
        )
      }
    }

    return rows
  }

  passData(name, value, index) {
    console.log('passData', name, value, index)

    this.props.passData(name, value, index)

  }

  inviteCollaborators(index) {
    console.log('inviteCollaborators called', index)

    if (this.state.collaboratorEmail && this.state.collaboratorEmail !== '') {

      this.setState({ collaboratorErrorMessage: null })

      if (!this.state.collaboratorEmail.includes('@')) {
        this.setState({ collaboratorErrorMessage: 'Please add a valid email' })
      } else {
        //check if user is on GC

        const email = this.state.collaboratorEmail
        let collaboratorEmail = ''

        let projectHasChangedArray = this.state.projectHasChangedArray
        projectHasChangedArray[index] = true

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
        .then((response) => {

            if (response.data.success) {
              console.log('User profile query worked', response.data);

              const pictureURL = response.data.user.pictureURL
              const firstName = response.data.user.firstName
              const lastName = response.data.user.lastName
              const roleName = response.data.user.roleName

              let collaborators = this.state.projects[index].collaborators
              if (collaborators) {
                collaborators.push({ pictureURL, firstName, lastName, email, roleName, joined: true })
              } else {
                collaborators = [{ pictureURL, firstName, lastName, email, roleName, joined: true }]
              }

              let projects = this.state.projects
              projects[index]['collaborators'] = collaborators

              this.setState({ projects, collaboratorEmail, projectHasChangedArray })

            } else {
              console.log('no user details found', response.data.message)

              let collaborators = this.state.projects[index].collaborators
              if (collaborators) {
                collaborators.push({ pictureURL: '', firstName: 'Collaborator', lastName: '#' + collaborators.length, email, roleName: 'Student', joined: false })
              } else {
                collaborators = [{ pictureURL: '', firstName: 'Collaborator', lastName: '#1', email, roleName: 'Student', joined: false }]
              }

              let projects = this.state.projects
              projects[index]['collaborators'] = collaborators

              this.setState({ projects, collaboratorEmail, projectHasChangedArray })
            }

        }).catch((error) => {
            console.log('User profile query did not work', error);

            let collaborators = this.state.projects[index].collaborators
            if (collaborators) {
              collaborators.push({ pictureURL: '', firstName: 'Collaborator', lastName: '#' + collaborators.length, email, roleName: 'Student', joined: false })
            } else {
              collaborators = [{ pictureURL: '', firstName: 'Collaborator', lastName: '#1', email, roleName: 'Student', joined: false }]
            }

            let projects = this.state.projects
            projects[index]['collaborators'] = collaborators

            this.setState({ projects, collaboratorEmail, projectHasChangedArray })
        });

      }

    }

  }

  renderExperience() {
    console.log('renderExperience called')

    let rows = []

    for (let i = 1; i <= this.state.experience.length; i++) {

      const rowKey = 'experience|' + i.toString()
      const index = i - 1

      if (this.state.isEditingExperienceArray[i - 1]) {

        rows.push(
          <View key={rowKey}>
            {i > 1 && <View><View style={styles.spacer} /><View style={styles.halfSpacer} /></View>}
            <View style={[styles.rowDirection]}>
              <View style={[styles.flex75]}>
                {(this.state.experience[i - 1].jobTitle && this.state.experience[i - 1].jobTitle !== '') ? (
                  <Text style={styles.headingText5}>Edit {this.state.experience[i - 1].jobTitle}</Text>
                ) : (
                  <Text style={styles.headingText5}>Edit experience below</Text>
                )}
              </View>
              <View style={[styles.flex25,styles.rightText,styles.rightPadding20,styles.alignEnd]}>
                <TouchableOpacity onPress={() => this.saveExperience(rowKey)}>
                  <View>
                    <Text style={[styles.headingText5,styles.ctaColor]}>Done</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={styles.spacer} /><View style={styles.halfSpacer} />

            <View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Job Title<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.formChangeHandler("jobTitle|" + index, text)}
                  value={this.state.experience[i - 1].jobTitle}
                  placeholder="e.g. Software Engineer"
                  placeholderTextColor="grey"
                />
              </View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Employer Name<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.formChangeHandler("employerName|" + index, text)}
                  value={this.state.experience[i - 1].employerName}
                  placeholder="e.g. Software Engineer"
                  placeholderTextColor="grey"
                />
              </View>
            </View>

            <View style={[styles.row10]}>
              <Text style={[styles.standardText,styles.row10]}>Are you still working here?</Text>
              <Switch
                 onValueChange = {(value) => this.changeContinual(index, value,'experience')}
                 value = {this.state.experience[i - 1].isContinual}
              />
            </View>

            <View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Start Date<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Start Date', selectedIndex: index, selectedName: "experienceStartDate|" + index, selectedValue: this.state.experience[i - 1].startDate, selectedOptions: this.state.dateOptions, selectedSubKey: 'value' })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{this.state.experience[i - 1].startDate}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].startDate}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("experienceStartDate|" + index,itemValue)
                      }>
                      {this.state.dateOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                    </Picker>
                  </View>
                )}

              </View>

              {(this.state.experience[i - 1].isContinual) ? (
                <View style={[styles.row10]}>
                  {(!this.state.isMobile) && (
                    <View>
                      <View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/>
                    </View>
                  )}
                  <Text style={styles.headingText5}>Still Working On This</Text>
                </View>
              ) : (
                <View style={[styles.row10]}>
                  <Text style={[styles.standardText,styles.row10]}>End Date<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'End Date', selectedIndex: index, selectedName: "experienceEndDate|" + index, selectedValue: this.state.experience[i - 1].endDate, selectedOptions: this.state.dateOptions, selectedSubKey: 'value' })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn115]}>
                          <Text style={[styles.descriptionText1]}>{this.state.experience[i - 1].endDate}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.experience[i - 1].endDate}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("experienceEndDate|" + index,itemValue)
                        }>
                        {this.state.dateOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                      </Picker>
                    </View>
                  )}

                </View>
              )}


            </View>

            <View >
              <View style={[styles.row10]}>
                <View style={[styles.rowDirection]}>
                  <View>
                    <Text style={[styles.standardText,styles.row10]}>Job Function<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                  </View>
                  <View>
                    <View style={styles.halfSpacer} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                    <View style={[styles.leftMargin,styles.row7,styles.horizontalPadding10,styles.ctaBorder, { borderRadius: 11 }]}>
                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showGrade: false, showJobFunction: true, showIndustry: false, showProjectDetail: false, skillTagsInfo: false, showSettings: false, showBirthdate: false })}>
                        <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain,styles.centerItem]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Job Function', selectedIndex: index, selectedName: "jobFunction|" + index, selectedValue: this.state.experience[i - 1].jobFunction, selectedOptions: this.state.dateOptions, selectedSubKey: 'value' })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{this.state.experience[i - 1].jobFunction}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].jobFunction}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("jobFunction|" + index,itemValue)
                      }>
                      {this.state.functionOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                    </Picker>
                  </View>
                )}

              </View>
              <View style={[styles.row10]}>
                <View style={[styles.rowDirection]}>
                  <View>
                    <Text style={[styles.standardText,styles.row10]}>Job Industry<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                  </View>
                  <View>
                    <View style={styles.halfSpacer} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                    <View style={[styles.leftMargin,styles.row7,styles.horizontalPadding10,styles.ctaBorder, { borderRadius: 11 }]}>
                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showGrade: false, showJobFunction: false, showIndustry: true, showProjectDetail: false, skillTagsInfo: false, showSettings: false, showBirthdate: false })}>
                        <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain,styles.centerItem]} />
                      </TouchableOpacity>
                    </View>

                  </View>
                </View>

                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Job Industry', selectedIndex: index, selectedName: "jobIndustry|" + index, selectedValue: this.state.experience[i - 1].industry, selectedOptions: this.state.dateOptions, selectedSubKey: 'value' })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{this.state.experience[i - 1].industry}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].industry}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("jobIndustry|" + index,itemValue)
                      }>
                      {this.state.industryOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                    </Picker>
                  </View>
                )}
              </View>

            </View>

            <View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Were you paid?<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Was Paid', selectedIndex: index, selectedName: "wasPaid|" + index, selectedValue: this.state.experience[i - 1].wasPaid, selectedOptions: this.state.binaryOptions, selectedSubKey: null })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{this.state.experience[i - 1].wasPaid}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].wasPaid}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("wasPaid|" + index,itemValue)
                      }>
                      {this.state.binaryOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                    </Picker>
                  </View>
                )}

              </View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Hours per Week<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Hours Per Week', selectedIndex: index, selectedName: "hoursPerWeek|" + index, selectedValue: this.state.experience[i - 1].hoursPerWeek, selectedOptions: this.state.hoursPerWeekOptions, selectedSubKey: 'value' })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{this.state.experience[i - 1].hoursPerWeek}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].hoursPerWeek}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("hoursPerWeek|" + index,itemValue)
                      }>
                      {this.state.hoursPerWeekOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                    </Picker>
                  </View>
                )}

              </View>

            </View>

            <View style={[styles.row10,styles.flex1]}>
              <View style={[styles.rowDirection]}>
                <View>
                  <Text style={[styles.standardText,styles.row10]}>Skill Tags</Text>
                </View>
                <View>
                  <View style={styles.halfSpacer} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                  <View style={[styles.leftMargin,styles.row7,styles.horizontalPadding10,styles.ctaBorder, { borderRadius: 11 }]}>
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showGrade: false, showJobFunction: false, showIndustry: false, showProjectDetail: false, skillTagsInfo: true, showSettings: false, showBirthdate: false })}>
                      <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain,styles.centerItem]} />
                    </TouchableOpacity>
                  </View>

                </View>

              </View>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.formChangeHandler("experienceSkillTags|" + index, text)}
                value={this.state.experience[i - 1].skillTags}
                placeholder="add skills you acquired separated by commas"
                placeholderTextColor="grey"
              />
            </View>

            {(this.state.activeOrg === 'exp') && (
              <View>
                <View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>Supervisor First Name<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.formChangeHandler("experienceSupervisorFirstName|" + index, text)}
                      value={this.state.experience[i - 1].supervisorFirstName}
                      placeholder="e.g., Jon"
                      placeholderTextColor="grey"
                    />
                  </View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>Supervisor Last Name<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.formChangeHandler("experienceSupervisorLastName|" + index, text)}
                      value={this.state.experience[i - 1].supervisorLastName}
                      placeholder="e.g., Majorson"
                      placeholderTextColor="grey"
                    />
                  </View>

                </View>

                <View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>Supervisor Title<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.formChangeHandler("experienceSupervisorTitle|" + index, text)}
                      value={this.state.experience[i - 1].supervisorTitle}
                      placeholder="e.g., Engineering Manager"
                      placeholderTextColor="grey"
                    />
                  </View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>Supervisor Email<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.formChangeHandler("experienceSupervisorEmail|" + index, text)}
                      value={this.state.experience[i - 1].supervisorEmail}
                      placeholder="e.g., jon@gmail.com"
                      placeholderTextColor="grey"
                    />
                  </View>

                </View>

              </View>
            )}

            <View style={[styles.row10]}>
              <Text style={[styles.standardText,styles.row10]}>Description of Your Work<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
              <TextInput
                style={styles.textArea}
                onChangeText={(text) => this.formChangeHandler("experienceDescription|" + index, text)}
                value={this.state.experience[i - 1].description}
                placeholder="Add a description"
                placeholderTextColor="grey"
                multiline={true}
                numberOfLines={4}
              />
            </View>

            <View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Did you like the work?</Text>

                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Work Interest', selectedIndex: index, selectedName: "workInterest|" + index, selectedValue: this.state.experience[i - 1].workInterest, selectedOptions: this.state.workInterestOptions, selectedSubKey: null, differentLabels: true })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{(this.state.experience[i - 1].workInterest) ? this.convertRating("workInterest",this.state.experience[i - 1].workInterest) : ""}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].workInterest}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("workInterest|" + index,itemValue)
                      }>
                      {this.state.workInterestOptions.map(value => <Picker.Item key={value.label} label={value.label} value={value.value} />)}
                    </Picker>
                  </View>
                )}

                <Text style={[styles.descriptionText2]}>Note: this answer is not shared with employers; it's used for career advising.</Text>
              </View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Do you think you are skilled in this work?</Text>

                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Work Skill', selectedIndex: index, selectedName: "workSkill|" + index, selectedValue: this.state.experience[i - 1].workSkill, selectedOptions: this.state.workSkillOptions, selectedSubKey: null, differentLabels: true })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{(this.state.experience[i - 1].workSkill) ? this.convertRating("workSkill",this.state.experience[i - 1].workSkill) : ""}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].workSkill}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("workSkill|" + index,itemValue)
                      }>
                      {this.state.workSkillOptions.map(value => <Picker.Item key={value.label} label={value.label} value={value.value} />)}
                    </Picker>
                  </View>
                )}

                <Text style={[styles.descriptionText2]}>Note: this answer is not shared with employers; it's used for career advising.</Text>
              </View>

            </View>

            <View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Did you like the team?</Text>

                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Interest in Team', selectedIndex: index, selectedName: "teamInterest|" + index, selectedValue: this.state.experience[i - 1].teamInterest, selectedOptions: this.state.teamInterestOptions, selectedSubKey: null, differentLabels: true })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{(this.state.experience[i - 1].teamInterest) ? this.convertRating("teamInterest",this.state.experience[i - 1].teamInterest) : ""}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].teamInterest}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("teamInterest|" + index,itemValue)
                      }>
                      {this.state.teamInterestOptions.map(value => <Picker.Item key={value.label} label={value.label} value={value.value} />)}
                    </Picker>
                  </View>
                )}

                <Text style={[styles.descriptionText2]}>Note: this answer is not shared with employers; it's used for career advising.</Text>
              </View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Did you like the employer?</Text>

                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Interest in Employer', selectedIndex: index, selectedName: "employerInterest|" + index, selectedValue: this.state.experience[i - 1].employerInterest, selectedOptions: this.state.employerInterestOptions, selectedSubKey: null, differentLabels: true })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{(this.state.experience[i - 1].employerInterest) ? this.convertRating("employerInterest",this.state.experience[i - 1].employerInterest) : ""}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].employerInterest}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("employerInterest|" + index,itemValue)
                      }>
                        {this.state.employerInterestOptions.map(value => <Picker.Item key={value.label} label={value.label} value={value.value} />)}
                    </Picker>
                  </View>
                )}

                <Text style={[styles.descriptionText2]}>Note: this answer is not shared with employers; it's used for career advising.</Text>
              </View>

            </View>

            <View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Would the pay be acceptable if full-time?</Text>

                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Interest in Pay', selectedIndex: index, selectedName: "payInterest|" + index, selectedValue: this.state.experience[i - 1].payInterest, selectedOptions: this.state.payInterestOptions, selectedSubKey: null, differentLabels: true })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{(this.state.experience[i - 1].payInterest) ? this.convertRating("payInterest",this.state.experience[i - 1].payInterest) : ""}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].payInterest}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("payInterest|" + index,itemValue)
                      }>
                        {this.state.payInterestOptions.map(value => <Picker.Item key={value.label} label={value.label} value={value.value} />)}
                    </Picker>
                  </View>
                )}

                <Text style={[styles.descriptionText2]}>Note: this answer is not shared with employers; it's used for career advising.</Text>
              </View>
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>What do you rate the overall fit?<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Overall Fit', selectedIndex: index, selectedName: "overallFit|" + index, selectedValue: this.state.experience[i - 1].overallFit, selectedOptions: this.state.overallFitOptions, selectedSubKey: null, differentLabels: true })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{(this.state.experience[i - 1].overallFit) ? this.convertRating("overallFit",this.state.experience[i - 1].overallFit) : ""}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.experience[i - 1].overallFit}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("overallFit|" + index,itemValue)
                      }>
                        {this.state.overallFitOptions.map(value => <Picker.Item key={value.label} label={value.label} value={value.value} />)}
                    </Picker>
                  </View>
                )}

                <Text style={[styles.descriptionText2]}>Note: this answer is not shared with employers; it's used for career advising.</Text>
              </View>

            </View>

            <View style={[styles.calcColumn60,styles.alignEnd,styles.justifyEnd]}>
              <TouchableOpacity onPress={() => this.saveExperience(rowKey)} style={[styles.btnPrimary,styles.ctaBorder,styles.whiteBackground,styles.flexCenter]}><Text style={[styles.ctaColor,styles.standardText]}>Save Experience</Text></TouchableOpacity>
            </View>

            {this.state.clientErrorMessage !== '' && <Text style={[styles.standardText,styles.errorColor]}>{this.state.clientErrorMessage}</Text>}
            <View style={styles.spacer} />
          </View>
        )

      } else {

        rows.push(
          <View key={rowKey} style={[styles.rowDirection,styles.bottomMargin20]}>
            <View style={[styles.width70,styles.rightPadding]}>
              <Text numberOfLines={1} style={[styles.headingText2,styles.ctaColor,styles.centerText]}>{this.state.experience[i - 1].overallFit}</Text>
              <Text style={[styles.descriptionText2,styles.centerText]}>of 5 match</Text>
            </View>
            <View style={[styles.rightPadding,styles.calcColumn170]}>
              <Text style={styles.headingText5}>{this.state.experience[i - 1].jobTitle}</Text>
              <Text style={styles.descriptionText1}>{this.state.experience[i - 1].employerName}</Text>
              <Text style={styles.descriptionText2}>{this.state.experience[i - 1].startDate} - {this.state.experience[i - 1].endDate}</Text>
            </View>
            <View style={[styles.width30]}>
              <View>
                <TouchableOpacity onPress={() => this.formChangeHandler("isEditingExperienceArray|" + index,'')} style={[styles.rightPadding20]} name={"isEditingExperienceArray|" + index}>
                  <Image source={{ uri: editIconDark}} style={[styles.square15,styles.contain]} />
                </TouchableOpacity>
              </View>
              <View style={[styles.topMargin]}>
                <TouchableOpacity onPress={() => this.deleteItem('experience', index)}>
                  <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.spacer} /><View style={styles.halfSpacer} />
          </View>
        )
      }
    }

    return rows
  }

  renderExtras(type) {
    console.log('renderExtras called', type)

    let rows = []

    if (type === 'extracurriculars') {
      console.log('in extras')
      for (let i = 1; i <= this.state.extracurriculars.length; i++) {

        const rowKey = 'extracurricular|' + i.toString()
        const index = i - 1

        if (this.state.isEditingExtracurricularArray[i - 1]) {

          rows.push(
            <View key={rowKey}>
              {i > 1 && <View><View style={styles.spacer} /><View style={styles.halfSpacer} /></View>}
              <View style={[styles.rowDirection]}>
                <View style={[styles.flex75]}>
                  {(this.state.extracurriculars[i - 1].name && this.state.extracurriculars[i - 1].name !== '') ? (
                    <Text style={styles.headingText5}>Edit {this.state.extracurriculars[i - 1].name}</Text>
                  ) : (
                    <Text style={styles.headingText5}>Edit extracurricular below</Text>
                  )}
                </View>
                <View style={[styles.flex25,styles.rightText,styles.rightPadding20,styles.alignEnd]}>
                  <TouchableOpacity onPress={() => this.saveExtras(rowKey,"extracurricular")}>
                    <View>
                      <Text style={[styles.headingText5,styles.ctaColor]}>Done</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.spacer} /><View style={styles.halfSpacer} />

              <View>
                <View style={[styles.row10]}>
                  <Text style={[styles.standardText,styles.row10]}>Activity Name<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.formChangeHandler("activityName|" + index, text)}
                    value={this.state.extracurriculars[i - 1].activityName}
                    placeholder="e.g., Basketball"
                    placeholderTextColor="grey"
                  />
                </View>
                <View style={[styles.row10]}>
                  <Text style={[styles.standardText,styles.row10]}>Your Role<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.formChangeHandler("roleName|" + index, text)}
                    value={this.state.extracurriculars[i - 1].roleName}
                    placeholder="e.g., Captain"
                    placeholderTextColor="grey"
                  />
                </View>

              </View>

              <View>
                <View style={[styles.row10]}>
                  <Text style={[styles.standardText,styles.row10]}>Start Date<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Start Date', selectedIndex: index, selectedName: "extracurricularStartDate|" + index, selectedValue: this.state.extracurriculars[i - 1].startDate, selectedOptions: this.state.dateOptions, selectedSubKey: 'value' })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn115]}>
                          <Text style={[styles.descriptionText1]}>{this.state.extracurriculars[i - 1].startDate}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.extracurriculars[i - 1].startDate}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("extracurricularStartDate|" + index,itemValue)
                        }>
                        {this.state.dateOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                      </Picker>
                    </View>
                  )}

                </View>

                {(this.state.extracurriculars[i - 1].isContinual) ? (
                  <View style={[styles.row10]}>
                    {(!this.state.isMobile) && (
                      <View>
                        <View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/>
                      </View>
                    )}
                    <Text style={styles.headingText5}>Still Working On This</Text>
                  </View>
                ) : (
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>End Date<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                    {(Platform.OS === 'ios') ? (
                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'End Date', selectedIndex: index, selectedName: "extracurricularEndDate|" + index, selectedValue: this.state.extracurriculars[i - 1].endDate, selectedOptions: this.state.dateOptions, selectedSubKey: 'value' })}>
                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                          <View style={[styles.calcColumn115]}>
                            <Text style={[styles.descriptionText1]}>{this.state.extracurriculars[i - 1].endDate}</Text>
                          </View>
                          <View style={[styles.width20,styles.topMargin5]}>
                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View style={[styles.standardBorder]}>
                        <Picker
                          selectedValue={this.state.extracurriculars[i - 1].endDate}
                          onValueChange={(itemValue, itemIndex) =>
                            this.formChangeHandler("extracurricularEndDate|" + index,itemValue)
                          }>
                          {this.state.dateOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                        </Picker>
                      </View>
                    )}

                  </View>
                )}
              </View>

              <View>
                <View style={[styles.row10]}>
                  <Text style={[styles.standardText,styles.row10]}>Hours per Week<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Hours per Week', selectedIndex: index, selectedName: "extracurricularHoursPerWeek|" + index, selectedValue: this.state.extracurriculars[i - 1].hoursPerWeek, selectedOptions: this.state.hoursPerWeekOptions, selectedSubKey: 'value' })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn115]}>
                          <Text style={[styles.descriptionText1]}>{this.state.extracurriculars[i - 1].hoursPerWeek}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.extracurriculars[i - 1].hoursPerWeek}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("extracurricularHoursPerWeek|" + index,itemValue)
                        }>
                        {this.state.hoursPerWeekOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                      </Picker>
                    </View>
                  )}

                </View>
              </View>

              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Description<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                <TextInput
                  style={styles.textArea}
                  onChangeText={(text) => this.formChangeHandler("extracurricularDescription|" + index, text)}
                  value={this.state.extracurriculars[i - 1].description}
                  placeholder="Add a description of your extracurricular.."
                  placeholderTextColor="grey"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <View style={[styles.calcColumn60,styles.alignEnd,styles.justifyEnd]}>
                <TouchableOpacity onPress={() => this.saveExtras(rowKey,"extracurricular")} style={[styles.btnPrimary,styles.ctaBorder,styles.whiteBackground,styles.flexCenter]}><Text style={[styles.ctaColor]}>Save Extracurricular</Text></TouchableOpacity>
              </View>

              {this.state.clientErrorMessage !== '' && <Text style={[styles.standardText,styles.errorColor]}>{this.state.clientErrorMessage}</Text>}
              <View style={styles.spacer} />
            </View>
          )

        } else {

          rows.push(
            <View key={rowKey}>
              <View style={[styles.rowDirection]}>
                <View style={[styles.width70,styles.rightPadding]}>
                  <Image source={{ uri: reachIcon}} style={[styles.square50,styles.contain]} />
                </View>
                <View style={[styles.rightPadding,styles.calcColumn170]}>
                  <Text style={styles.headingText5}>{this.state.extracurriculars[i - 1].activityName}</Text>
                  <Text style={styles.descriptionText1}>{this.state.extracurriculars[i - 1].roleName}</Text>
                  <Text style={styles.descriptionText2}>{this.state.extracurriculars[i - 1].startDate} - {this.state.extracurriculars[i - 1].endDate}</Text>
                </View>
                <View style={[styles.width30]}>
                  <View>
                    <TouchableOpacity onPress={() => this.formChangeHandler("isEditingExtracurricularArray|" + index,'')} style={[styles.rightPadding20]} name={"isEditingExtracurricularArray|" + index}>
                      <Image source={{ uri: editIconDark}} style={[styles.square15,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.topMargin]}>
                    <TouchableOpacity onPress={() => this.deleteItem('extracurricular', index)}>
                      <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                    </TouchableOpacity>
                  </View>

                </View>
              </View>

              <View style={styles.spacer} /><View style={styles.halfSpacer} />
            </View>
          )
        }
      }
    } else if (type === 'awards') {
      for (let i = 1; i <= this.state.awards.length; i++) {

        const rowKey = 'award|' + i.toString()
        const index = i - 1

        if (this.state.isEditingAwardArray[i - 1]) {

          rows.push(
            <View key={rowKey}>
              {i > 1 && <View><View style={styles.spacer} /><View style={styles.halfSpacer} /></View>}
              <View style={[styles.rowDirection]}>
                <View style={[styles.flex75]}>
                  {(this.state.awards[i - 1].name && this.state.awards[i - 1].name !== '') ? (
                    <Text style={styles.headingText5}>Edit {this.state.awards[i - 1].name}</Text>
                  ) : (
                    <Text style={styles.headingText5}>Edit award below</Text>
                  )}
                </View>
                <View style={[styles.flex25,styles.rightText,styles.rightPadding20,styles.alignEnd]}>
                  <TouchableOpacity onPress={() => this.saveExtras(rowKey,"award")}>
                    <View>
                      <Text style={[styles.headingText5,styles.ctaColor]}>Done</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.spacer} /><View style={styles.halfSpacer} />

              <View>
                <View style={[styles.row10]}>
                  <Text style={[styles.standardText,styles.row10]}>Name of Award<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.formChangeHandler("awardName|" + index, text)}
                    value={this.state.awards[i - 1].name}
                    placeholder="e.g., Honor Roll"
                    placeholderTextColor="grey"
                  />
                </View>
                <View style={[styles.row10]}>
                  {(Platform.OS === 'ios') ? (
                    <View style={[styles.rowDirection]}>
                      <View style={[styles.calcColumn180]}>
                        <Text style={[styles.standardText,styles.row10]}>Date Awarded<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                      </View>
                      <View style={[styles.width120,styles.topPadding5]}>
                        <DateTimePicker
                          testID="dateAwarded"
                          value={(this.state.awards[i - 1].awardDate) ? convertStringToDate(this.state.awards[i - 1].awardDate,'dateOnly') : new Date()}
                          mode={'date'}
                          is24Hour={true}
                          display="default"
                          onChange={(e, d) => this.formChangeHandler("awardDate|" + index,d)}
                        />
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View style={[styles.row5]}>
                        <Text style={[styles.standardText,styles.row10]}>Date Awarded{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                      </View>
                      <View>
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Date Awarded', selectedIndex: null, selectedName: "awardDate|" + index, selectedValue: this.state.awards[i - 1].awardDate })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn115]}>
                              <Text style={[styles.descriptionText1]}>{this.state.awards[i - 1].awardDate}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>

                    </View>
                  )}

                </View>

              </View>

              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>Description of the Award<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                <TextInput
                  style={styles.textArea}
                  onChangeText={(text) => this.formChangeHandler("awardDescription|" + index, text)}
                  value={this.state.awards[i - 1].description}
                  placeholder="Add a description of your award.."
                  placeholderTextColor="grey"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>

              <View style={[styles.calcColumn60,styles.alignEnd,styles.justifyEnd]}>
                <TouchableOpacity onPress={() => this.saveExtras(rowKey,"award")} style={[styles.btnPrimary,styles.ctaBorder,styles.whiteBackground,styles.flexCenter]}><Text style={[styles.ctaColor]}>Save Award</Text></TouchableOpacity>
              </View>

              {this.state.clientErrorMessage !== '' && <Text style={[styles.standardText,styles.errorColor]}>{this.state.clientErrorMessage}</Text>}
              <View style={styles.spacer} />
            </View>
          )

        } else {

          rows.push(
            <View key={rowKey}>
              <View style={[styles.rowDirection]}>
                <View style={[styles.width70,styles.rightPadding]}>
                  <Image source={{ uri: prizeIcon}} style={[styles.square50,styles.contain]} />
                </View>
                <View style={[styles.rightPadding,styles.calcColumn170]}>
                  <Text style={styles.headingText5}>{this.state.awards[i - 1].name}</Text>
                  <Text style={styles.descriptionText1}>{this.state.awards[i - 1].awardDate}</Text>
                </View>
                <View style={[styles.width30]}>
                  <View>
                    <TouchableOpacity onPress={() => this.formChangeHandler("isEditingAwardArray|" + index,'')} style={[styles.rightPadding20]} name={"isEditingAwardArray|" + index}>
                      <Image source={{ uri: editIconDark}} style={[styles.square15,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.topMargin]}>
                    <TouchableOpacity onPress={() => this.deleteItem('award', index)}>
                      <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={styles.spacer} /><View style={styles.halfSpacer} />
            </View>
          )
        }
      }
    }

    return rows
  }

  changeContinual(index, change, type) {
    console.log('changeContinual called ', index, change, type)

    if (type === 'project') {
      // let projects = this.state.projects
      // projects[index]['isContinual'] = change
      //
      // let projectHasChangedArray = this.state.projectHasChangedArray
      // projectHasChangedArray[index] = true
      //
      // this.setState({ projects, projectHasChangedArray })
    } else if (type === 'education') {
      let education = this.state.education
      education[index]['isContinual'] = change
      this.setState({ education })
    } else {
      // experience
      let experience = this.state.experience
      experience[index]['isContinual'] = change

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      this.setState({ experience, experienceHasChangedArray })
    }
  }

  deleteItem(type, index) {
    console.log('deleteItem called', type, index)

    if (type === 'project') {
      let projects = this.state.projects
      let deleteId = projects[index]._id

      Axios.put('https://www.guidedcompass.com/api/projects', { deleteId })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Project delete worked ', response.data);

          projects.splice(index, 1)
          this.setState({ projects, serverSuccessText: true, serverSuccessMessageText: 'Projects saved successfully!' })

        } else {
          console.log('project delete did not save successfully')
          this.setState({

              serverSuccessText: false,
              serverErrorMessageText: response.data.message,
          })
        }

      }).catch((error) => {
          console.log('Project save did not work', error);
      });

    } else if (type === 'experience') {
      let experience = this.state.experience
      let deleteId = experience[index]._id

      Axios.put('https://www.guidedcompass.com/api/experience', { deleteId })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Experience delete worked ', response.data);

          experience.splice(index, 1)
          this.setState({ experience, serverSuccessText: true, serverSuccessMessageText: 'Projects saved successfully!' })

        } else {
          console.log('experience delete did not save successfully')
          this.setState({

              serverSuccessText: false,
              serverErrorMessageText: response.data.message,
          })
        }

      }).catch((error) => {
          console.log('Experience save did not work', error);
      });
    } else if (type === 'extracurricular' || type === 'award') {
      let extras = []
      if (type === 'extracurricular') {
        extras = this.state.extracurriculars
      } else if (type === 'award') {
        extras = this.state.awards
      }
      let deleteId = extras[index]._id

      Axios.put('https://www.guidedcompass.com/api/extras', { deleteId })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Extra delete worked ', response.data);

          if (type === 'extracurricular') {
            extras.splice(index, 1)
            const extracurriculars = extras
            this.setState({ extracurriculars, serverSuccessText: true, serverSuccessMessageText: 'Extra saved successfully!' })
          } else if (type === 'award') {
            extras.splice(index, 1)
            const awards = extras
            this.setState({ awards, serverSuccessText: true, serverSuccessMessageText: 'Extra saved successfully!' })
          }

        } else {
          console.log('experience delete did not save successfully')
          this.setState({

              serverSuccessText: false,
              serverErrorMessageText: response.data.message,
          })
        }

      }).catch((error) => {
          console.log('Experience save did not work', error);
      });
    } else if (type === 'education') {
      let education = this.state.education
      education.splice(index,1)
      this.setState({ education })
    } else if (type === 'resume') {

      const emailId = this.state.emailId
      const originalURL = this.state.resumes[index]
      const deleteArray = this.state.resumes[index].split("amazonaws.com/")
      console.log('show deleteArrary: ', deleteArray)
      const deleteKey = deleteArray[1].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
      console.log('show deleteKey: ', deleteKey)

      Axios.put('https://www.guidedcompass.com/api/file', { emailId, originalURL, deleteKey })
      .then((response) => {
        console.log('tried to delete', response.data)
        if (response.data.success) {
          //save values
          console.log('File delete worked');

          let resumes = this.state.resumes
          let resumeNames = this.state.resumeNames
          resumes.splice(index,1)
          resumeNames.splice(index,1)

          this.setState({ serverSuccessMessageResume: 'File was deleted successfully', resumes, resumeNames })

        } else {
          console.error('there was an error saving the file');
          this.setState({ serverErrorMessageResume: response.data.message })
        }
      }).catch((error) => {
          console.log('The saving did not work', error);
          this.setState({ serverErrorMessageResume: error })
      });
    }
  }

  // renderCollaborators(passedIndex) {
  //   console.log('renderCollaborators called', passedIndex)
  //
  //   let rows = []
  //   let collaborators = this.state.projects[passedIndex].collaborators
  //   if (collaborators) {
  //     for (let i = 1; i <= collaborators.length; i++) {
  //
  //       const index = i - 1
  //
  //       rows.push(
  //         <View key={"collaborator" + i.toString()}>
  //           <View style={styles.spacer} />
  //
  //           <View style={styles.width50}>
  //             <Image source={collaborators[i - 1].pictureURL ? { uri: collaborators[i - 1].pictureURL} : { uri: profileIconBig}} style={[styles.square50,styles.contain,{ borderRadius: 25 }]}/>
  //           </View>
  //           <View style={[styles.calcColumn160,styles.leftPadding]}>
  //             <Text style={[styles.standardText]}>{collaborators[i - 1].firstName} {collaborators[i - 1].lastName} ({collaborators[i - 1].email})</Text>
  //             <View style={styles.halfSpacer} />
  //             {(collaborators[i - 1].joined) ? (
  //               <Text style={[styles.descriptionText2]}>{collaborators[i - 1].roleName}</Text>
  //             ) : (
  //               <Text style={[styles.descriptionText2]}>(This user has not joined Guided Compass)</Text>
  //             )}
  //           </View>
  //           <View style={styles.width50}>
  //               <View style={styles.spacer} />
  //             <a onPress={() => this.removeItem(passedIndex, index)}>
  //               <Image source={{ uri: xIcon}} style={[styles.square20,styles.contain]}/>
  //             </a>
  //           </View>
  //
  //         </View>
  //       )
  //     }
  //   }
  //
  //   return rows
  // }

  removeItem(index1, index2) {
    console.log('removeItem called', index1, index2)

    // collaborators
    let projects = this.state.projects
    let collaborators = this.state.projects[index1].collaborators
    collaborators.splice(index2, 1)
    projects[index1]['collaborators'] = collaborators
    this.setState({ projects })
  }

  closeModal() {

    this.setState({ modalIsOpen: false, showPublicProfileExtentInfo: false, showGrade: false, showJobFunction: false,
      showIndustry: false, showProjectDetail: false, skillTagsInfo: false, showSettings: false, showBirthdate: false,
      showPicker: false, showDateTimePicker: false
    });

    // remove object
    AsyncStorage.removeItem('objectId')
  }

  imgError(image) {
    console.log('imgError called: ', image, image.target, image.target.error)

  }

  searchSchools(searchString) {
    console.log('searchSchools ', searchString)

    this.setState({ schoolsAreLoading: true })

    if (searchString === '') {
      const schoolOptions = []
      this.setState({ schoolOptions, schoolsAreLoading: false })
    } else {
      Axios.get('https://www.guidedcompass.com/api/schools/search', { params: { searchString } })
      .then((response) => {
        console.log('Schools search query attempted', response.data);

          if (response.data.success) {
            console.log('schools search query worked')

            const schoolOptions = response.data.schools
            this.setState({ schoolOptions, schoolsAreLoading: false });

          } else {
            console.log('school search query did not work', response.data.message)
            this.setState({ schoolsAreLoading: false })
          }

      }).catch((error) => {
          console.log('School search query did not work for some reason', error);
          this.setState({ schoolsAreLoading: false })
      });
    }
  }

  optionClicked(optionIndex, type, value) {
    console.log('optionClicked called', optionIndex, type)

    if (type === 'adversityList') {
      let adversityList = this.state.adversityList
      if (adversityList && adversityList.length > 0) {
        if (adversityList.includes(this.state.adversityListOptions[optionIndex])) {
          const removeIndex = adversityList.indexOf(this.state.adversityListOptions[optionIndex])
          adversityList.splice(removeIndex, 1)

        } else {
          adversityList.push(this.state.adversityListOptions[optionIndex])
        }
      } else {
        adversityList = [this.state.adversityListOptions[optionIndex]]
      }

      this.setState({ adversityList })

    } else if (type === 'project') {
      if (value && value !== '' && value !== 'Select a Project' && !this.state.publicProjects.includes(value)) {

        let publicProjects = this.state.publicProjects
        publicProjects.push(value)
        this.setState({ publicProjects, selectedProject: 'Select a Project' })
      }
    } else if (type === 'goal') {
      if (value && value !== '' && value !== 'Select a Goal' && !this.state.publicGoals.includes(value)) {
        let publicGoals = this.state.publicGoals
        publicGoals.push(value)
        this.setState({ publicGoals, selectedGoal: 'Select a Goal' })
      }
    } else if (type === 'passion') {
      if (value && value !== '' && value !== 'Select a Passion' && !this.state.publicPassions.includes(value)) {
        let publicPassions = this.state.publicPassions
        publicPassions.push(value)
        this.setState({ publicPassions, selectedPassion: 'Select a Passion' })
      }
    } else if (type === 'assessment' && value !== 'Select an Assessment') {
      if (value && value !== '' && value !== 'Select an Assessment' && !this.state.publicAssessments.includes(value)) {
        let publicAssessments = this.state.publicAssessments
        publicAssessments.push(value)
        this.setState({ publicAssessments, selectedAssessment: 'Select an Assessment' })
      }
    } else if (type === 'endorsement' && value !== 'Select an Endorsement') {
      if (value && value !== '' && value !== 'Select an Endorsement' && !this.state.publicEndorsements.includes(value)) {
        let publicEndorsements = this.state.publicEndorsements
        publicEndorsements.push(value)
        this.setState({ publicEndorsements, selectedEndorsement: 'Select an Endorsement' })
      }
    } else if (type === 'school') {
      const schoolOptions = []
      let school = this.state.schoolOptions[optionIndex]
      this.setState({ schoolOptions, school })
    } else if (type.includes('education|')) {
      console.log('in school 1')
      const index = Number(type.split("|")[2])
      let education = this.state.education
      console.log('in school 2', education, index, optionIndex)
      education[index]['name'] = this.state.schoolOptions[optionIndex]
      const schoolOptions = []
      console.log('in school 3')
      this.setState({ education, schoolOptions })

    } else if (type === 'resume') {
      console.log('show selectedResume: ', this.state.selectedResume)
      let publicResumeName = this.state.selectedResume
      this.setState({ publicResumeName })
    }

  }

  renderTags(type, passedArray) {
    console.log('renderTags ', type, passedArray)

    if (type === 'resume') {
      if (this.state.publicResumeName) {
        passedArray = [this.state.publicResumeName]
      } else {
        passedArray = []
      }
    }

    // if (type === 'project') {
      return (
        <View key={type + "|0"} style={styles.rowDirection}>
          <View style={styles.spacer} />
          {passedArray.map((value, optionIndex) =>
            <View key={type + "|" + optionIndex} style={styles.rowDirection}>
              <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                <TouchableOpacity onPress={() => this.removeTag(type, optionIndex)}>
                  <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                </TouchableOpacity>
              </View>
              <View style={styles.rightPadding5}>
                <View style={styles.halfSpacer} />
                <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.lightBorder,styles.lightBackground]}>
                  <Text style={[styles.descriptionText2]}>{value}</Text>
                </View>
                <View style={styles.halfSpacer} />
              </View>
            </View>
          )}
        </View>
      )
    // }
  }

  removeTag(type, index) {
    console.log('removeTag called', type, index)

    if (type === 'project') {
      let publicProjects = this.state.publicProjects
      publicProjects.splice(index, 1)
      this.setState({ publicProjects })
    } else if (type === 'goal') {
      let publicGoals = this.state.publicGoals
      publicGoals.splice(index, 1)
      this.setState({ publicGoals })
    } else if (type === 'passion') {
      let publicPassions = this.state.publicPassions
      publicPassions.splice(index, 1)
      this.setState({ publicPassions })
    } else if (type === 'assessment') {
      let publicAssessments = this.state.publicAssessments
      publicAssessments.splice(index, 1)
      this.setState({ publicAssessments })
    } else if (type === 'endorsement') {
      let publicEndorsements = this.state.publicEndorsements
      publicEndorsements.splice(index, 1)
      this.setState({ publicEndorsements })
    } else if (type === 'resume') {
      let publicResumeName = null
      this.setState({ publicResumeName })
    }
  }

  itemSelected(item) {
    console.log('itemSelected called')

    let careerGoals = this.state.careerGoals
    if (careerGoals.includes(item)) {
      const index = careerGoals.indexOf(item)
      careerGoals.splice(index,1)
    } else {
      careerGoals.push(item)
    }

    this.setState({ careerGoals, textFormHasChanged: true })
  }

  convertRating(type,rawRating) {
    console.log('convertRating called', type,rawRating)

    let options = []
    if (type === 'workInterest') {
      options = this.state.workInterestOptions
    } else if (type === 'workSkill') {
      options = this.state.workSkillOptions
    } else if (type === 'teamInterest') {
      options = this.state.teamInterestOptions
    } else if (type === 'employerInterest') {
      options = this.state.employerInterestOptions
    } else if (type === 'payInterest') {
      options = this.state.payInterestOptions
    } else if (type === 'overallFit') {
      options = this.state.overallFitOptions
    }

    return options[6 - Number(rawRating)].label

  }

  render() {

    // console.log('show the props: ', this.props)

    if (this.props.fromAdvisor) {

      return (
        <ScrollView style={[styles.card]}>
            {/*
            <View style={styles.superSpacer} />

            <View style={[styles.rowDirection]}>
              <View style={styles.calcColumn110}>
                {(this.props.category === 'Basics') && (
                  <View>
                    <Text style={[styles.headingText2]}>Edit Basic Info</Text>
                  </View>
                )}
                {(this.props.category === 'Details') && (
                  <View>
                    <Text style={[styles.headingText2]}>Edit Projects, Experience, & Other Details</Text>
                  </View>
                )}
                {(this.props.category === 'Visibility Preferences') && (
                  <View>
                    <Text style={[styles.headingText2]}>Profile Visibility Preferences</Text>
                  </View>
                )}
              </View>


            </View>

            <View style={[styles.row10]}>
              <View>
                <View style={[styles.calcColumn60]}>
                  <View style={styles.relativePosition}>
                    <TouchableOpacity onPress={() => this.formChangeHandler("profilePic",null)} style={[styles.rowDirection,styles.centerHorizontally]}>
                      <Image source={
                        this.state.profilePicImage ? ( { uri: this.state.profilePicImage} )
                        : this.state.pictureURL ? ( { uri: this.state.pictureURL} )
                        : this.state.profilePicPath ? ( { uri: this.state.profilePicPath})
                        : ( { uri: addProfilePhotoIcon})}
                      style={(this.state.profilePicImage || this.state.profilePicPath || this.state.pictureURL) ? [styles.square150,styles.contain,styles.centerItem,{ borderRadius: (150/2)}] : [styles.square150,styles.contain,styles.centerItem]}/>
                      {(this.state.profilePicImage || this.state.profilePicPath || this.state.pictureURL) && (
                        <View style={[styles.absolutePosition,styles.justifyEnd, styles.absoluteBottom0, styles.absoluteRight0]}>
                          <View style={[styles.marginTopNegative40,styles.padding10,styles.square40,styles.whiteBackground,{ borderRadius: (20)}]}>
                            <Image source={{ uri: addIcon}} style={[styles.square18,styles.contain,styles.centerItem]}/>
                          </View>
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={styles.spacer} />
                <Text style={[styles.descriptionTextColor,styles.descriptionText2]}>Dimensions: 150 x 150</Text>

                { (this.state.serverSuccessProfilePic) ? (
                  <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageProfilePic}</Text>
                ) : (
                  <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageProfilePic}</Text>
                )}
              </View>

            </View>

            <View style={[styles.row10]}>
                <Text style={[styles.headingText3]}>Basic Info</Text>
            </View>

            <View>
                <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>First Name</Text>
                    <input className="text-field" type="text" placeholder="First Name" name="firstName" value={this.state.firstNameValue} onChange={this.formChangeHandler} />
                </View>
                <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>Last Name</Text>
                    <input className="text-field" type="text" placeholder="Last Name" name="lastName" value={this.state.lastNameValue} onChange={this.formChangeHandler}/>
                </View>

            </View>

            {(this.state.roleName === 'Mentor') && (
              <View style={[styles.row10]}>
                <Text style={[styles.standardText,styles.row10]}>LinkedIn URL (Optional)</Text>
                <input className="text-field" type="text" placeholder="LinkedIn Profile URL" name="linkedInURL" value={this.state.linkedInURL} onChange={this.formChangeHandler} />
                {(this.state.linkedInURL && this.state.linkedInURL !== '' && !this.state.linkedInURL.startsWith('http')) && (
                  <View>
                    <Text style={[styles.standardText,styles.errorColor]}>Please start your link with http</Text>
                  </View>
                )}
              </View>
            )}

            {(this.state.roleName === 'Mentor') && (
              <View>
                <View style={[styles.row10]}>
                  <Text style={[styles.standardText,styles.row10]}>Resume URL (Optional)</Text>
                  <input className="text-field" type="text" placeholder="Google Drive Link? Website Link?" name="resumeURL" value={this.state.resumeURLValue} onChange={this.formChangeHandler}/>
                  {(this.state.resumeURLValue && this.state.resumeURLValue !== '' && !this.state.resumeURLValue.startsWith('http')) && (
                    <View>
                      <Text style={[styles.standardText,styles.errorColor]}>Please start your link with http</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.row10]}>
                  <Text style={[styles.standardText,styles.row10]}>Custom Website URL (Optional)</Text>
                  <input className="text-field" type="text" placeholder="Custom Website URL" name="customWebsiteURL" value={this.state.customWebsiteURL} onChange={this.formChangeHandler}/>
                  {(this.state.customWebsiteURL && this.state.customWebsiteURL !== '' && !this.state.customWebsiteURL.startsWith('http')) && (
                    <View>
                      <Text style={[styles.standardText,styles.errorColor]}>Please start your link with http</Text>
                    </View>
                  )}
                </View>

                <View style={styles.spacer} />
                <View style={styles.spacer} />

                <View style={styles.horizontalLine} />
              </View>
            )}

            {(this.state.roleName === 'Mentor') ? (
              <View>
                <View style={styles.spacer} />

                <View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>Current Job Title</Text>
                    <input className="text-field" type="text" placeholder="Job Title" name="jobTitle" value={this.state.jobTitle} onChange={this.formChangeHandler}/>
                  </View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>Employer Name{(this.state.activeOrg === 'c2c') && " Or Congressional Office"}</Text>
                    <input className="text-field" type="text" placeholder="Employer Name" name="employerName" value={this.state.employerName} onChange={this.formChangeHandler}/>
                  </View>


                </View>

                {(this.state.activeOrg === 'c2c') && (
                  <View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.row10]}>Is there a career track below that you want to advise {(this.state.studentAlias && this.state.studentAlias !== '') ? this.state.studentAlias + 's' : 'students'} in?</Text>
                      <select name="careerTrack" value={this.state.careerTrack} onChange={this.formChangeHandler} className="dropdown">
                        {this.state.functionOptions.map(value =>
                          <option key={value} value={value}>{value}</option>
                        )}
                      </select>
                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.row10]}>Political Alignment</Text>
                      <select name="politicalAlignment" className="dropdown" value={this.state.politicalAlignment} onChange={this.formChangeHandler}>
                          {this.state.politicalAlignmentOptions.map(value => <option key={value} value={value}>{value}</option>)}
                      </select>
                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.row10]}>Current U.S. State Registered to Vote</Text>
                      <select name="stateRegistration" className="dropdown" value={this.state.stateRegistration} onChange={this.formChangeHandler}>
                          {this.state.registrationOptions.map(value => <option key={value} value={value}>{value}</option>)}
                      </select>
                    </View>

                    <View style={[styles.row10]}>
                        <Text style={[styles.standardText,styles.row10]}>Current Congressional District</Text>
                        <input className="text-field" type="text" placeholder="e.g. 12" name="currentCongressionalDistrict" value={this.state.currentCongressionalDistrict} onChange={this.formChangeHandler}/>
                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.row10]}>Hometown (U.S. State)</Text>
                      <select name="hometown" className="dropdown" value={this.state.hometown} onChange={this.formChangeHandler}>
                          {this.state.hometownOptions.map(value => <option key={value} value={value}>{value}</option>)}
                      </select>
                    </View>

                    <View style={[styles.row10]}>
                        <Text style={[styles.standardText,styles.row10]}>Hometown Congressional District</Text>
                        <input className="text-field" type="text" placeholder="e.g. 12" name="homeCongressionalDistrict" value={this.state.homeCongressionalDistrict} onChange={this.formChangeHandler}/>
                    </View>

                  </View>
                )}
                <View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>What zipcode do you work in? (Optional)</Text>
                    <input className="text-field" type="text" placeholder="Zipcode" name="zipcode" value={this.state.zipcode} onChange={this.formChangeHandler}/>
                  </View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>How long have you been this field? (Optional)</Text>
                    <select name="workTenure" className="dropdown" value={this.state.workTenure} onChange={this.formChangeHandler}>
                        {this.state.tenureOptions.map(value => <option key={value.value} value={value.value}>{value.value}</option>)}
                    </select>
                  </View>

                </View>

                <View style={[styles.row10,styles.rowDirection,styles.flex1]}>
                  <View style={[styles.rightPadding]}>
                    <Text style={[styles.standardText,styles.row10]}>Highest Degree Attained (Optional)</Text>
                    <select name="degreeAttained" className="dropdown" value={this.state.degreeAttained} onChange={this.formChangeHandler}>
                        {this.state.degreeOptions.map(value => <option key={value} value={value}>{value}</option>)}
                    </select>
                  </View>
                  <View style={[styles.leftPadding]}>
                    <Text style={[styles.standardText,styles.row10]}>Add The Last School You Attended(Optional)</Text>
                    <input className="text-field" type="text" placeholder="Add your school name..." name="schoolName" value={this.state.schoolName} onChange={this.formChangeHandler}/>
                  </View>

                </View>

                <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>Study Area Tags (Optional)</Text>
                    <input className="text-field" type="text" placeholder="Tag your areas of study in school, separated by commas..." name="studyFields" value={this.state.studyFields} onChange={this.formChangeHandler}/>
                </View>
                <View style={styles.spacer} /><View style={styles.spacer} />
              </View>
            ) : (
              <View>
                <View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>Role Name</Text>
                    <Text style={[styles.standardText]}>{this.state.roleName}</Text>
                  </View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText,styles.row10]}>School Name</Text>
                    <Text style={[styles.standardText]}>{this.state.schoolName}</Text>
                  </View>

                </View>

                {(this.state.schoolDistrict) && (
                  <View>
                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.row10]}>School District</Text>
                      <Text style={[styles.standardText]}>{this.state.schoolDistrict}</Text>
                    </View>

                    <View style={styles.spacer} /><View style={styles.spacer} />
                  </View>
                )}

                <View style={[styles.row10]}>
                  <Text style={[styles.standardText,styles.row10]}>Define Success with Guided Compass</Text>
                  <TextInput
                    style={styles.textArea}
                    onChangeText={(text) => this.formChangeHandler("successDefined", text)}
                    value={this.state.successDefined}
                    placeholder="How would you define success using Guided Compass? What do you want out of it? What should students get out of it?"
                    placeholderTextColor="grey"
                    multiline={true}
                    numberOfLines={4}
                  />
                </View>
                </View>

                <View style={styles.spacer} /><View style={styles.spacer} />


              </View>
            )}

            <TouchableOpacity onPress={this.handleSubmit} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.whiteColor]}>Save Changes</TouchableOpacity>
            { (this.state.serverSuccessText) ? (
              <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageText}</Text>
            ) : (
              <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageText}</Text>
            )}
            { (this.state.serverSuccessProfilePic) ? (
              <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageProfilePic}</Text>
            ) : (
              <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageProfilePic}</Text>
            )}
            { (this.state.serverSuccessCoverPic) ? (
              <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageCoverPic}</Text>
            ) : (
              <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageCoverPic}</Text>
            )}*/}
            {/*
            <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>

            {(this.state.showGrade) && (
              <View key="gradeProject" style={[styles.calcColumn60,styles.padding20]}>
                {(this.state.projects) && (
                  <View>
                    <Text style={[styles.headingText2]}>Feedback for {this.state.projects[this.state.selectedIndex].name}</Text>

                    <View style={styles.spacer} /><View style={styles.spacer} />

                    {this.state.projects[this.state.selectedIndex].grades.map((value, index) =>
                      <View key={value}>
                        <View style={[styles.row10]}>
                          {(value.isTransparent) ? (
                            <View>
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.width60,styles.headingText2,styles.ctaColor,styles.boldText]}>
                                  {(value.grade) ? (
                                    <Text style={[styles.standardText]}>{value.grade}</Text>
                                  ) : (
                                    <Text style={[styles.standardText]}>N/A</Text>
                                  )}
                                </View>
                                <View style={[styles.calcColumn60]}>
                                  <Text style={[styles.descriptionText2]}>{value.contributorFirstName} {value.contributorLastName}</Text>
                                  <Text style={[styles.headingText6]}>{value.feedback}</Text>
                                </View>

                              </View>
                            </View>
                          ) : (
                            <View>
                              <View style={[styles.width60,styles.headingText2]}>
                                <View style={styles.halfSpacer} />
                                <Image source={{ uri: confidentialityIcon}} style={[styles.square40,styles.contain]} />
                              </View>
                              <View style={styles.calcColumn60}>
                                <Text style={[styles.standardText]}>This feedback has been marked confidential by {value.contributorFirstName} {value.contributorLastName}. They need to unlock this feedback for you to view.</Text>
                              </View>

                            </View>
                          )}
                        </View>

                        <View style={styles.spacer}/><View style={styles.spacer}/>
                        <View style={styles.horizontalLine} />

                      </View>
                    )}

                    <View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/>
                    <Text style={[styles.descriptionText3,styles.boldText,styles.ctaColor]}>Note: You may view feedback by clicking the feedback icon under each of your projects. The feedback icon will not be visible if you have not received feedback for that project.</Text>
                    <View style={styles.spacer}/><View style={styles.spacer}/>
                  </View>
                )}
              </View>
            )}

            {(this.state.showJobFunction) && (
              <View key="showJobFunction" style={[styles.calcColumn60,styles.padding20]}>
                <Text style={[styles.headingText2]}>Job Function</Text>
                <View style={styles.spacer} />
                <Text style={[styles.standardText]}>We define <Text style={[styles.boldText,styles.ctaColor]}>job functions</Text> as a category of work that requires similar skills. It can be thought of as synonymous with "departments" within a company. Functions can be the same across different industries. Examples of functions include sales, marketing, finance, engineering, and design.</Text>
              </View>
            )}

            {(this.state.showIndustry) && (
              <View key="showIndustry" style={[styles.calcColumn60,styles.padding20]}>
                <Text style={[styles.headingText2]}>Industry</Text>
                <View style={styles.spacer} />
                <Text style={[styles.standardText]}>We define <Text style={[styles.boldText,styles.ctaColor]}>industry</Text> as a category of companies that are related based on their primary business activitiees. Companies are generally grouped by their sources of revenue. For example, Nike would fall under "Fashion & Apparel" and Netflix would fall under "Other Entertainment".</Text>
              </View>
            )}

            {(this.state.skillTagsInfo) && (
              <View key="showIndustry" style={[styles.calcColumn60,styles.padding20]}>
                <Text style={[styles.headingText2]}>Skill Tags Info</Text>
                <View style={styles.spacer} />
                <Text style={[styles.standardText]}><Text style={[styles.boldText,styles.ctaColor]}>Skill Tags</Text> allow you to list the skills related to your experience separated by commas. For example, for design experience, you may want to tag wireframing, Adobe Photoshop, and flow chart. This allows the reviewer to better understand your skills and allows you to receive better recommendations.</Text>
              </View>
            )}

            {(this.state.showSettings) && (
              <View key="showIndustry" style={[styles.calcColumn60,styles.padding20]}>
                <Text style={[styles.headingText2]}>Settings</Text>
                <View style={styles.spacer} />

                <View>
                  <EditSubscription />
                </View>

                <View>
                  <SwitchOrgs
                    emailId={this.state.emailId} activeOrg={this.state.activeOrg} myOrgs={this.state.myOrgs}
                    sharePartners={this.state.sharePartners} roleName={this.state.roleName}
                    academies={this.state.academies} academyCodes={this.state.academyCodes}
                    accountCode={this.state.accountCode}
                  />
                </View>

                <View style={[styles.row10]}>
                  <TouchableOpacity style={[styles.btnPrimary,styles.ctaColor,styles.ctaBorder,styles.whiteBackground]} onPress={() => signOut(
                    this.state.email, this.state.activeOrg, this.state.orgFocus,
                    this.state.accountCode, this.state.roleName, this.props.navigation
                  )}>Sign Out</TouchableOpacity>
                </View>

              </View>
            )}

            <View style={[styles.row20]}>
             <TouchableOpacity style={[styles.btnPrimary,styles.ctaColor,styles.ctaBorder,styles.whiteBackground]} onPress={() => this.closeModal()}>Close View</TouchableOpacity>
            </View>
           </Modal>*/}
        </ScrollView>
      )

    } else {

      return (
          <ScrollView style={(this.props.fromWalkthrough) ? [] : [styles.card]}>
              <View>
                  {(!this.props.fromApply) && (
                    <View style={[styles.rowDirection]}>
                      <View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/>

                      <View style={styles.calcColumn110}>
                        {(this.props.category === 'Basics') && (
                          <View>
                            <Text style={[styles.headingText2,styles.calcColumn60,styles.centerText]}>Edit Basic Info</Text>
                          </View>
                        )}
                        {(this.props.category === 'Details') && (
                          <View>
                            <Text style={[styles.headingText2,styles.calcColumn60,styles.centerHorizontally,styles.centerText]}>Edit Projects, Experience, & Other Details</Text>
                          </View>
                        )}
                        {(this.props.category === 'Visibility Preferences') && (
                          <View>
                            <Text style={[styles.headingText2,styles.calcColumn60,styles.centerText]}>Profile Visibility Preferences</Text>
                          </View>
                        )}
                      </View>
                    </View>
                  )}
              </View>

              {(this.props.category === 'Basics' || this.props.passedType === 'Basic') && (
                <View>
                  <View style={styles.row10}>
                    <View>
                      <View style={styles.row10}>
                        <View>
                          <View style={[styles.flex1]}>
                            <View style={[styles.relativePosition,styles.flexCenter]}>
                              <TouchableOpacity onPress={() => this.formChangeHandler("profilePic",null)} style={[styles.rowDirection,styles.centerHorizontally]}>
                                <Image source={
                                  this.state.profilePicImage ? ( { uri: this.state.profilePicImage} )
                                  : this.state.pictureURL ? ( { uri: this.state.pictureURL} )
                                  : this.state.profilePicPath ? ( { uri: this.state.profilePicPath})
                                  : ( { uri: addProfilePhotoIcon})}
                                style={(this.state.profilePicImage || this.state.profilePicPath || this.state.pictureURL) ? [styles.square150,styles.contain,styles.centerItem,{ borderRadius: (150/2)}] : [styles.square150,styles.contain,styles.centerItem]}/>
                                {(this.state.profilePicImage || this.state.profilePicPath || this.state.pictureURL) && (
                                  <View style={[styles.absolutePosition,styles.justifyEnd, styles.absoluteBottom0, styles.absoluteRight0]}>
                                    <View style={[styles.marginTopNegative40,styles.padding10,styles.square40,styles.whiteBackground,{ borderRadius: (20)}]}>
                                      <Image source={{ uri: addIcon}} style={[styles.square18,styles.contain,styles.centerItem]}/>
                                    </View>
                                  </View>
                                )}
                              </TouchableOpacity>
                            </View>
                          </View>


                          <View style={styles.spacer} />
                          <Text style={[styles.descriptionTextColor,styles.descriptionText2,styles.calcColumn60,styles.centerText]}>Dimensions: 150 x 150</Text>

                          {(this.state.oauthUid) && (
                            <View>
                              <Text style={[styles.errorColor,styles.descriptionText2,styles.topMargin]}>UID: {this.state.oauthUid}</Text>
                            </View>
                          )}

                          { (this.state.serverSuccessProfilePic) ? (
                            <Text style={[styles.ctaColor,styles.calcColumn60,styles.centerText,styles.boldText]}>{this.state.serverSuccessMessageProfilePic}</Text>
                          ) : (
                            <Text style={[styles.errorColor,styles.calcColumn60,styles.centerText,styles.boldText]}>{this.state.serverErrorMessageProfilePic}</Text>
                          )}
                        </View>

                      </View>

                    </View>
                  </View>

                  {(!this.props.fromApply) && (
                    <View style={[styles.row10]}>
                      <Text style={[styles.headingText3]}>Basic Info</Text>
                    </View>
                  )}

                  <View>
                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.row10]}>First Name<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => this.formChangeHandler('firstName', text)}
                        value={this.state.firstNameValue}
                        placeholder="first name"
                        placeholderTextColor="grey"
                      />
                    </View>
                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.row10]}>Last Name<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => this.formChangeHandler('lasttName', text)}
                        value={this.state.lastNameValue}
                        placeholder="last name"
                        placeholderTextColor="grey"
                      />
                    </View>

                  </View>

                  {(!this.props.fromApply) && (
                    <View>
                      <View style={[styles.row10]}>
                        <Text style={[styles.standardText,styles.row10]}>Headline (Optional) (70 chars max)</Text>
                        <TextInput
                          style={styles.textInput}
                          onChangeText={(text) => this.formChangeHandler('headline', text)}
                          value={this.state.headline}
                          placeholder="A sentence that describes who you are or what you're doing..."
                          placeholderTextColor="grey"
                          maxLength={70}
                        />
                      </View>
                      <View style={[styles.row10]}>
                        <Text style={[styles.standardText,styles.row10]}>Current Location</Text>
                        <TextInput
                          style={styles.textInput}
                          onChangeText={(text) => this.formChangeHandler('location', text)}
                          value={this.state.location}
                          placeholder="Los Angeles, CA..."
                          placeholderTextColor="grey"
                        />
                      </View>

                    </View>
                  )}

                  <View>
                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.row10]}>LinkedIn URL (Optional)</Text>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => this.formChangeHandler('linkedInURL', text)}
                        value={this.state.linkedInURL}
                        placeholder="https://www.linkedin.com"
                        placeholderTextColor="grey"
                      />
                      {(this.state.linkedInURL && this.state.linkedInURL !== '' && !this.state.linkedInURL.startsWith('http')) ? (
                        <View>
                          <Text style={[styles.standardText,styles.errorColor]}>Please start your link with http</Text>
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.row10]}>Portfolio URL / Personal Website (Optional)</Text>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => this.formChangeHandler("customWebsiteURL", text)}
                        value={this.state.customWebsiteURL}
                        placeholder="https://www.guidedcompass/joeschmo/profile"
                        placeholderTextColor="grey"
                      />


                      <Text style={[styles.descriptionText3,styles.row5]}>If you make your profile public, you can use it as your portfolio</Text>

                      {(this.state.customWebsiteURL && this.state.customWebsiteURL !== '' && !this.state.customWebsiteURL.startsWith('http')) ? (
                        <View>
                          <Text style={[styles.standardText,styles.errorColor]}>Please start your link with http</Text>
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>

                  </View>

                  {(!this.props.fromApply) ? (
                    <View>

                      <View style={styles.spacer} /><View style={styles.spacer} />
                      <View style={styles.horizontalLine} />

                      <View style={styles.spacer}/><View style={styles.halfSpacer}/>

                      <View>
                        <View style={[styles.row10]}>
                          <View style={styles.rowDirection}>
                            <Text style={[styles.headingText3]}>Resumes</Text>
                            <View style={[styles.leftPadding]}>
                              <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                              <TouchableOpacity style={[styles.padding7,styles.standardBorder, {borderRadius: 13 }]} onPress={() => this.formChangeHandler('resume',null)}>
                                <Image source={{ uri: addIcon}} style={[styles.square12,styles.contain]}/>
                              </TouchableOpacity>

                              {/*<input type="file" id="resumeUpload" name="resume" onChange={this.formChangeHandler} accept="application/pdf" />*/}
                            </View>
                          </View>
                        </View>

                        <View style={[styles.topPadding]}>
                          <Text style={[styles.descriptionText2,styles.row5]}>(Only PDF files are accepted. Please convert Word files to PDF.)</Text>
                        </View>

                        {(!this.props.fromWalkthrough) ? (
                          <View style={[styles.row10]}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('ResumeBuilder')} style={styles.rowDirection}>
                              <View style={styles.width30}>
                                <View style={styles.halfSpacer} /><View style={[styles.miniSpacer]} />
                                <Image source={{ uri: skillsIcon}} style={[styles.square15,styles.contain]} />
                              </View>
                              <View style={styles.calcColumn90}>
                                <Text style={[styles.descriptionText3,styles.ctaColor,styles.boldText,styles.row5]}>Need help? Use our resume builder. <Text style={[styles.ctaColor,styles.boldText,styles.headingText6,styles.leftPadding5]}>>></Text></Text>
                              </View>

                            </TouchableOpacity>
                          </View>
                        ) : (
                          <View />
                        )}

                      </View>

                      <View style={[styles.topPadding5,styles.bottomPadding]}>
                        {(this.state.resumes && this.state.resumes.length > 0) ? (
                          <View>
                            {this.state.resumes.map((item, optionIndex) =>
                              <View key={item}>
                                <View style={[styles.bottomPadding20,styles.rowDirection]}>
                                  <View style={[styles.calcColumn90,styles.rowDirection]}>
                                    <Text style={[styles.rightPadding]}>{optionIndex + 1}.</Text>
                                    <TouchableOpacity onPress={() => Linking.openURL(item)}><Text style={[styles.standardText]}>{this.state.resumeNames[optionIndex]}</Text></TouchableOpacity>
                                  </View>
                                  <View style={styles.width20}>
                                    <TouchableOpacity style={[styles.calcColumn60,styles.rightText]} onPress={() => this.deleteItem('resume', optionIndex)}>
                                      <Image source={{ uri: deleteIconDark}} style={[styles.square15,styles.contain,styles.pinRight]} />
                                    </TouchableOpacity>
                                  </View>


                                </View>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View>
                            <Text style={[styles.errorColor,styles.descriptionText2]}>No resumes have been uploaded yet</Text>
                          </View>
                        )}
                      </View>

                      {(this.state.serverSuccessMessageResume && this.state.serverSuccessMessageResume !== '') ? <Text style={[styles.descriptionText2,styles.ctaColor]}>{this.state.serverSuccessMessageResume}</Text> : <View />}
                      {(this.state.serverErrorMessageResume && this.state.serverErrorMessageResume !== '') ? <Text style={[styles.descriptionText2,styles.ctaColor]}>{this.state.serverErrorMessageResume}</Text> : <View />}

                    </View>
                  ) : (
                    <View />
                  )}

                  {(this.state.activeOrg === 'yearup') ? (
                    <View>
                      <View style={styles.spacer} /><View style={styles.spacer} />
                      <View style={styles.horizontalLine} />

                      <View style={styles.spacer}/><View style={styles.halfSpacer}/>

                      <View style={[styles.row10,styles.rowDirection]}>

                        <View>
                          <Text style={[styles.headingText3]}>Video Resume</Text>
                        </View>

                      </View>

                      <View>
                        <View style={[styles.row10]}>
                          <Text style={[styles.standardText,styles.row10]}>Add a link to your video</Text>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("videoResumeURL" , text)}
                            value={this.state.videoResumeURL}
                            placeholder="https..."
                            placeholderTextColor="grey"
                          />
                          {(this.state.videoResumeURL && this.state.videoResumeURL !== '' && !this.state.videoResumeURL.startsWith('http')) ? (
                            <View>
                              <Text style={[styles.standardText,styles.errorColor]}>Please start your link with http</Text>
                            </View>
                          ) : (
                            <View />
                          )}
                        </View>
                      </View>
                    </View>
                  ) : (
                    <View />
                  )}

                  <View>
                    <View style={styles.spacer} /><View style={styles.spacer} />
                    <View style={styles.horizontalLine} />

                    <View style={styles.spacer}/><View style={styles.halfSpacer}/>

                    <View style={[styles.row10,styles.rowDirection]}>

                      <View>
                        <Text style={[styles.headingText3]}>Education</Text>
                      </View>
                      <View style={styles.leftPadding}>
                        <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                        <TouchableOpacity onPress={() => this.addItem('education')} style={[styles.padding7,styles.standardBorder, {borderRadius: 13 }]}>
                          <Image source={{ uri: addIcon}} style={[styles.square12,styles.contain]}/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                  <View>
                    {(this.state.education) ? (
                      <View>
                        {this.state.education.map((item, optionIndex) =>
                          <View key={optionIndex}>
                            <View style={styles.spacer} />
                            <View style={[styles.row10,styles.rowDirection]}>
                              <View style={[styles.calcColumn80]}>
                                <Text style={[styles.headingText6]}>Education #{optionIndex + 1}{(item.name) ? ": " + item.name : ""}</Text>
                              </View>
                              <View style={styles.width20}>
                                <TouchableOpacity style={[styles.calcColumn60,styles.rightText]} onPress={() => this.deleteItem('education', optionIndex)}>
                                  <Image source={{ uri: deleteIconDark}} style={[styles.square15,styles.contain,styles.pinRight]} />
                                </TouchableOpacity>
                              </View>
                            </View>

                            <View>
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10]}>{(this.state.activeOrg === 'dpscd') ? "Current School Name" : "Current / Latest School Name"}<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                {(this.state.activeOrg === 'exp') ? (
                                  <View>
                                    {(Platform.OS === 'ios') ? (
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'School Name', selectedIndex: optionIndex, selectedName: "education|name|" + optionIndex, selectedValue: item.name, selectedOptions: this.state.schoolOptions, selectedSubKey: null })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={[styles.calcColumn115]}>
                                            <Text style={[styles.descriptionText1]}>{item.name}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    ) : (
                                      <View style={[styles.standardBorder]}>
                                        <Picker
                                          selectedValue={item.name}
                                          onValueChange={(itemValue, itemIndex) =>
                                            this.formChangeHandler("education|name|" + optionIndex,itemValue)
                                          }>
                                          {this.state.schoolOptions.map(value => <Picker.Item label={value} value={value} />)}
                                        </Picker>
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => this.formChangeHandler("education|name|" + optionIndex , text)}
                                    value={item.name}
                                    placeholder="e.g. Compass High School"
                                    placeholderTextColor="grey"
                                  />
                                )}

                                {(this.state.schoolsAreLoading) ? (
                                  <View style={[styles.flexCenter,styles.calcColumn60]}>
                                    <View>
                                      <View style={[styles.superSpacer]} />

                                      <ActivityIndicator
                                         animating = {this.state.schoolsAreLoading}
                                         color = '#87CEFA'
                                         size = "large"
                                         style={[styles.square80, styles.centerHorizontally]}/>

                                      <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                                      <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                    </View>
                                  </View>
                                ) : (
                                  <View>

                                    <View style={styles.spacer}/>

                                    {(this.state.schoolOptions && this.state.schoolOptions.length > 0) ? (
                                      <View style={styles.calcColumn60}>
                                        <View style={styles.spacer}/>
                                        {this.state.schoolOptions.map((value2, optionIndex2) =>
                                          <View key={value2._id} style={[styles.bottomPadding]}>
                                            {(value2 && value2 !== '') ? (
                                              <View style={[styles.calcColumn60]}>
                                                <TouchableOpacity onPress={() => this.optionClicked(optionIndex2, "education|name|" + optionIndex)}>
                                                  <View style={[styles.calcColumn60,styles.rowDirection]}>
                                                    <View style={styles.rightPadding}>
                                                      <Image source={{ uri: courseIconDark}} style={[styles.square22,styles.contain]} />
                                                    </View>
                                                    <View>
                                                      <Text style={[styles.ctaColor]}>{value2}</Text>
                                                    </View>
                                                  </View>
                                                </TouchableOpacity>
                                              </View>
                                            ) : (
                                              <View />
                                            )}
                                          </View>
                                        )}
                                      </View>
                                    ) : (
                                      <View />
                                    )}
                                  </View>
                                )}
                              </View>
                              <View style={[styles.row10]}>
                                {(!this.state.orgDegree) ? (
                                  <View>
                                    <Text style={[styles.standardText,styles.row10]}>Degree Type<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                                    {(Platform.OS === 'ios') ? (
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Degree', selectedIndex: optionIndex, selectedName: "education|degree|" + optionIndex, selectedValue: item.degree, selectedOptions: this.state.degreeOptions, selectedSubKey: null })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={[styles.calcColumn115]}>
                                            <Text style={[styles.descriptionText1]}>{item.degree}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    ) : (
                                      <View style={[styles.standardBorder]}>
                                        <Picker
                                          selectedValue={item.degree}
                                          onValueChange={(itemValue, itemIndex) =>
                                            this.formChangeHandler("education|degree|" + optionIndex,itemValue)
                                          }>
                                          {this.state.degreeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                        </Picker>
                                      </View>
                                    )}

                                  </View>
                                ) : (
                                  <View />
                                )}
                              </View>

                            </View>

                            <View>
                              <View style={[styles.row10]}>
                                {(this.state.activeOrg === 'dpscd') ? (
                                  <View>
                                    <Text style={[styles.standardText,styles.row10]}>Career Pathway<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                                    {(Platform.OS === 'ios') ? (
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Pathway', selectedIndex: optionIndex, selectedName: "education|pathway|" + optionIndex, selectedValue: item.pathway, selectedOptions: this.state.pathwayOptions, selectedSubKey: 'name' })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={[styles.calcColumn115]}>
                                            <Text style={[styles.descriptionText1]}>{item.pathway}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    ) : (
                                      <Picker
                                        selectedValue={item.pathway}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("education|pathway|" + optionIndex,itemValue)
                                        }>
                                        {this.state.pathwayOptions.map(value => <Picker.Item key={value.name} label={value.name} value={value.name} />)}
                                      </Picker>
                                    )}
                                  </View>
                                ) : (
                                  <View>
                                    <Text style={[styles.standardText,styles.row10]}>School Major / Pathway<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                    {(this.state.activeOrg === 'exp') ? (
                                      <View>
                                        {(Platform.OS === 'ios') ? (
                                          <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Major', selectedIndex: optionIndex, selectedName: "education|major|" + optionIndex, selectedValue: item.major, selectedOptions: this.state.pathwayOptions, selectedSubKey: 'name' })}>
                                            <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                              <View style={[styles.calcColumn115]}>
                                                <Text style={[styles.descriptionText1]}>{item.major}</Text>
                                              </View>
                                              <View style={[styles.width20,styles.topMargin5]}>
                                                <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                              </View>
                                            </View>
                                          </TouchableOpacity>
                                        ) : (
                                          <Picker
                                            selectedValue={item.major}
                                            onValueChange={(itemValue, itemIndex) =>
                                              this.formChangeHandler("education|major|" + optionIndex,itemValue)
                                            }>
                                            {this.state.pathwayOptions.map(value => <Picker.Item key={value.name} label={value.name} value={value.name} />)}
                                          </Picker>
                                        )}
                                      </View>
                                    ) : (
                                      <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) => this.formChangeHandler("education|major|" + optionIndex , text)}
                                        value={item.major}
                                        placeholder="e.g. Business Management"
                                        placeholderTextColor="grey"
                                      />
                                    )}
                                  </View>
                                )}
                              </View>
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10]}>Location</Text>
                                <TextInput
                                  style={styles.textInput}
                                  onChangeText={(text) => this.formChangeHandler("education|location|" + optionIndex , text)}
                                  value={item.location}
                                  placeholder="(e.g., Los Angeles, CA)"
                                  placeholderTextColor="grey"
                                />
                              </View>

                            </View>

                            <View style={[styles.row10]}>
                              <Text style={[styles.standardText,styles.row10]}>Are you still at this school?</Text>
                              <Switch
                                 onValueChange = {(value) => this.changeContinual(optionIndex, value,'education')}
                                 value = {this.state.isContinual}
                              />
                            </View>

                            <View>
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10]}>Start Date<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Start Date', selectedIndex: optionIndex, selectedName: "education|startDate|" + optionIndex, selectedValue: item.startDate, selectedOptions: this.state.dateOptions, selectedSubKey: 'value' })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{item.startDate}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={item.startDate}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("education|startDate|" + optionIndex,itemValue)
                                      }>
                                      {this.state.dateOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10]}>Grad Year / End Date<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                {(this.state.activeOrg === 'exp' || this.state.orgFocus === 'School' || this.state.orgFocus === 'Academy') ? (
                                  <View>
                                    {(Platform.OS === 'ios') ? (
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Grad Year', selectedIndex: optionIndex, selectedName: "education|gradYear|" + optionIndex, selectedValue: item.gradYear, selectedOptions: this.state.gradYearOptions, selectedSubKey: null })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={[styles.calcColumn115]}>
                                            <Text style={[styles.descriptionText1]}>{item.gradYear}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    ) : (
                                      <View style={[styles.standardBorder]}>
                                        <Picker
                                          selectedValue={item.gradYear}
                                          onValueChange={(itemValue, itemIndex) =>
                                            this.formChangeHandler("education|gradYear|" + optionIndex,itemValue)
                                          }>
                                          {this.state.gradYearOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                        </Picker>
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View>
                                    {(Platform.OS === 'ios') ? (
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'End Year', selectedIndex: optionIndex, selectedName: "education|endYear|" + optionIndex, selectedValue: item.endYear, selectedOptions: this.state.educationDateOptions, selectedSubKey: 'value' })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={[styles.calcColumn115]}>
                                            <Text style={[styles.descriptionText1]}>{item.endDate}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    ) : (
                                      <View style={[styles.standardBorder]}>
                                        <Picker
                                          selectedValue={item.endDate}
                                          onValueChange={(itemValue, itemIndex) =>
                                            this.formChangeHandler("education|endDate|" + optionIndex,itemValue)
                                          }>
                                          {this.state.educationDateOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                                        </Picker>
                                      </View>
                                    )}
                                  </View>
                                )}
                              </View>


                            </View>

                            <View style={styles.row30}>
                              <Text style={[styles.standardText,styles.row10]}>Summary</Text>
                              <TextInput
                                style={styles.textArea}
                                onChangeText={(text) => this.formChangeHandler("education|summary|" + optionIndex, text)}
                                value={item.summary}
                                placeholder="Education summary"
                                placeholderTextColor="grey"
                                multiline={true}
                                numberOfLines={4}
                              />
                            </View>

                            {(this.state.education[optionIndex + 1]) ? (
                              <View style={[styles.row10,styles.horizontalPadding30]}>
                                <View style={styles.horizontalLine} />
                              </View>
                            ) : (
                              <View />
                            )}

                          </View>
                        )}
                      </View>
                    ) : (
                      <View />
                    )}

                    {(this.props.fromApply) ? (
                      <View style={[styles.topMargin20]}>
                        <View style={styles.horizontalLine} />
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>

                  {(!this.props.fromApply) ? (
                    <View>
                      {((this.props.fromWalkthrough && this.state.requirePersonalInfo) || !this.props.fromWalkthrough) ? (
                        <View>
                          <View style={styles.spacer} /><View style={styles.spacer} />
                          <View style={styles.horizontalLine} />

                          <View style={[styles.row10]}>
                            <View style={styles.spacer}/><View style={styles.halfSpacer}/>
                            <Text style={[styles.headingText3]}>Self-Identification / Personal Info</Text>
                            <Text style={[styles.standardText,styles.topMargin20]}>This private information is included for program reporting and opportunity matching purposes. Employers, teachers, and fellow students do not see this information. For more detail, please review our <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/privacy-policy')}><Text style={[styles.standardText,styles.ctaColor,styles.boldText]}>Privacy Policy</Text></TouchableOpacity> or reach out to us with questions.</Text>
                          </View>

                          <View>
                            <View style={[styles.row10]}>
                              <Text style={[styles.standardText,styles.row10]}>Street Address{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                              <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.formChangeHandler('address', text)}
                                value={this.state.address}
                                placeholder="e.g. 111 Business Lane"
                                placeholderTextColor="grey"
                              />
                            </View>
                            <View style={[styles.row10]}>
                              <Text style={[styles.standardText,styles.row10]}>City{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                              <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.formChangeHandler('city', text)}
                                value={this.state.city}
                                placeholder="e.g. Los Angeles"
                                placeholderTextColor="grey"
                              />
                            </View>

                          </View>

                          <View>
                            <View style={[styles.row10]}>
                              <Text style={[styles.standardText,styles.row10]}>Zip Code{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                              <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.formChangeHandler('zipcode', text)}
                                value={this.state.zipcode}
                                placeholder="e.g. 90210"
                                placeholderTextColor="grey"
                              />
                            </View>
                            <View style={[styles.row10]}>
                              <Text style={[styles.standardText,styles.row10]}>Phone Number{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                              <TextInput
                                style={styles.textInput}
                                onChangeText={(text) => this.formChangeHandler('phoneNumber', text)}
                                value={this.state.phoneNumber}
                                placeholder="e.g. (555) 555-5555"
                                placeholderTextColor="grey"
                              />
                            </View>

                          </View>

                          <View>
                            <View style={[styles.row10]}>
                              {(Platform.OS === 'ios') ? (
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn180]}>
                                    <Text style={[styles.standardText,styles.row10]}>Date of Birth{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                  </View>
                                  <View style={[styles.width120,styles.topPadding5]}>
                                    <DateTimePicker
                                      testID="DateTimePicker"
                                      value={(this.state.dateOfBirth) ? convertStringToDate(this.state.dateOfBirth,'dateOnly') : new Date()}
                                      mode={'date'}
                                      is24Hour={true}
                                      display="default"
                                      onChange={(e, d) => this.formChangeHandler("dateOfBirth",d)}
                                      minimumDate={new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate())}
                                      maximumDate={new Date(new Date().getFullYear() - 12, new Date().getMonth(), new Date().getDate())}
                                    />
                                  </View>
                                </View>
                              ) : (
                                <View>
                                  <View style={[styles.row5]}>
                                    <Text style={[styles.standardText,styles.row10]}>Date of Birth{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                  </View>
                                  <View>
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Date of Birth', selectedIndex: null, selectedName: "dateOfBirth", selectedValue: this.state.dateOfBirth, minimumDate: new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate()), maximumDate: new Date(new Date().getFullYear() - 12, new Date().getMonth(), new Date().getDate()) })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                        <View style={[styles.calcColumn115]}>
                                          <Text style={[styles.descriptionText1]}>{this.state.dateOfBirth}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              )}

                            </View>

                          </View>

                          {(this.state.activeOrg === 'exp') ? (
                            <View>
                              <View>
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.row10]}>Last 4 Digits of Social Security Number{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                  <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => this.formChangeHandler("lastOfSocialSecurity", text)}
                                    value={this.state.lastOfSocialSecurity}
                                    placeholder="e.g. 1234"
                                    placeholderTextColor="grey"
                                  />
                                </View>
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.row10]}>IEP or 504 Plan{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                  <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => this.formChangeHandler("IEPPlan", text)}
                                    value={this.state.IEPPlan}
                                    placeholder="e.g. IEP or 504 Plan"
                                    placeholderTextColor="grey"
                                  />
                                </View>

                              </View>

                              <View style={styles.contrastingContainer1}>
                                <View style={[styles.row10]}>
                                  <Text style={[styles.headingText4]}>Parent/Guardian Information</Text>
                                </View>

                                <View>
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.standardText,styles.row10]}>Parent/Guardian First Name and Last Name{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("parentName", text)}
                                      value={this.state.parentName}
                                      placeholder="e.g. Jonnie Appleseed"
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.standardText,styles.row10]}>Parent/Guardian Relationship to Student{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("parentRelationship", text)}
                                      value={this.state.parentRelationship}
                                      placeholder="e.g. Father"
                                      placeholderTextColor="grey"
                                    />
                                  </View>

                                </View>

                                <View>
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.standardText,styles.row10]}>Parent/Guardian Phone Number{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("parentPhone", text)}
                                      value={this.state.parentPhone}
                                      placeholder="e.g. (555) 555-5555"
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.standardText,styles.row10]}>Parent/Guardian Email Address{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("parentEmail", text)}
                                      value={this.state.parentEmail}
                                      placeholder="e.g. jonnie@gmail.com"
                                      placeholderTextColor="grey"
                                    />
                                  </View>

                                </View>
                              </View>

                              <View style={styles.contrastingContainer2}>
                                <View style={[styles.row10]}>
                                  <Text style={[styles.headingText4]}>Emergency Contact Information</Text>
                                </View>

                                <View>
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.standardText,styles.row10]}>Emergency Contact First Name and Last Name{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("emergencyContactName", text)}
                                      value={this.state.emergencyContactName}
                                      placeholder="e.g. Jonnie Appleseed"
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.standardText,styles.row10]}>Emergency Contact Relationship to Student{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("emergencyContactRelationship", text)}
                                      value={this.state.emergencyContactRelationship}
                                      placeholder="e.g. Father"
                                      placeholderTextColor="grey"
                                    />
                                  </View>

                                </View>

                                <View>
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.standardText,styles.row10]}>Emergency Contact Phone Number{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("emergencyContactPhone", text)}
                                      value={this.state.emergencyContactPhone}
                                      placeholder="e.g. (555) 555-5555"
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.standardText,styles.row10]}>Emergency Contact Email Address{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("emergencyContactEmail", text)}
                                      value={this.state.emergencyContactEmail}
                                      placeholder="e.g. jonnie@gmail.com"
                                      placeholderTextColor="grey"
                                    />
                                  </View>

                                </View>
                              </View>

                            </View>
                          ) : (
                            <View />
                          )}

                          <View>
                            <View style={[styles.row10]}>
                              <Text style={[styles.standardText,styles.row10]}>Race{(this.state.requirePersonalInfo) ? <Text style={[styles.errorColor,styles.boldText]}> *</Text> : ""}</Text>

                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Race', selectedIndex: null, selectedName: "race", selectedValue: this.state.race, selectedOptions: this.state.raceOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={[styles.calcColumn115]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.race}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.race}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("race",itemValue)
                                    }>
                                    {this.state.raceOptions.map(value => <Picker.Item label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}
                            </View>
                            <View style={[styles.row10]}>
                              <Text style={[styles.standardText,styles.row10]}>Gender{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>

                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Gender', selectedIndex: null, selectedName: "gender", selectedValue: this.state.gender, selectedOptions: this.state.genderOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={[styles.calcColumn115]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.gender}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.gender}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("gender",itemValue)
                                    }>
                                    {this.state.genderOptions.map(value => <Picker.Item label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}

                            </View>

                          </View>

                          <View>
                            <View style={[styles.row10]}>
                              <Text style={[styles.standardText,styles.row10]}>Authorized to work in the U.S.?{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                              {(this.state.activeOrg === 'exp') && (
                                <Text style={[styles.descriptionText2,styles.row5]}>Note: You will not be automatically rejected from the program if you are not authorized.</Text>
                              )}

                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Work Authorization', selectedIndex: null, selectedName: "workAuthorization", selectedValue: this.state.workAuthorization, selectedOptions: this.state.workAuthorizationOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={[styles.calcColumn115]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.workAuthorization}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.workAuthorization}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("workAuthorization",itemValue)
                                    }>
                                    {this.state.workAuthorizationOptions.map(value => <Picker.Item label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}

                            </View>
                            {(!this.state.remoteAuth && this.state.activeOrg !== 'unite-la') && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10]}>Veteran Status{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Veteran Status', selectedIndex: null, selectedName: "veteranStatus", selectedValue: this.state.veteranStatus, selectedOptions: this.state.veteranStatusOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.veteranStatus}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.veteranStatus}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("veteranStatus",itemValue)
                                      }>
                                      {this.state.veteranStatusOptions.map(value => <Picker.Item label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}

                              </View>
                            )}


                          </View>

                          {(this.state.activeOrg === 'c2c') && (
                            <View style={[styles.row10]}>
                              <Text style={[styles.standardText,styles.row10]}>Do you have DACA status?{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'DACA Status', selectedIndex: null, selectedName: "dacaStatus", selectedValue: this.state.dacaStatus, selectedOptions: this.state.binaryOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={[styles.calcColumn115]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.dacaStatus}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.dacaStatus}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("dacaStatus",itemValue)
                                    }>
                                    {this.state.binaryOptions.map(value => <Picker.Item label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}

                            </View>
                          )}

                          {(this.state.activeOrg === 'unite-la' || this.state.activeOrg === 'guidedcompass') && (
                            <View>
                              <View>
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.row10]}>Number of Members in Household{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                  {(Platform.OS === 'ios') ? (
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Members in Household', selectedIndex: null, selectedName: "numberOfMembers", selectedValue: this.state.numberOfMembers, selectedOptions: this.state.basicCountOptions, selectedSubKey: null })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                        <View style={[styles.calcColumn115]}>
                                          <Text style={[styles.descriptionText1]}>{this.state.numberOfMembers}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View style={[styles.standardBorder]}>
                                      <Picker
                                        selectedValue={this.state.numberOfMembers}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("numberOfMembers",itemValue)
                                        }>
                                        {this.state.basicCountOptions.map(value => <Picker.Item label={value} value={value} />)}
                                      </Picker>
                                    </View>
                                  )}

                                </View>
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.row10]}>Estimated Household Income{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                  {(Platform.OS === 'ios') ? (
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Household Income', selectedIndex: null, selectedName: "householdIncome", selectedValue: this.state.householdIncome, selectedOptions: this.state.householdIncomeOptions, selectedSubKey: null })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                        <View style={[styles.calcColumn115]}>
                                          <Text style={[styles.descriptionText1]}>{this.state.householdIncome}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View style={[styles.standardBorder]}>
                                      <Picker
                                        selectedValue={this.state.householdIncome}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("householdIncome",itemValue)
                                        }>
                                        {this.state.householdIncomeOptions.map(value => <Picker.Item label={value} value={value} />)}
                                      </Picker>
                                    </View>
                                  )}

                                </View>

                              </View>

                              <View>
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.row10]}>Have you ever been a foster youth?{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>

                                  {(Platform.OS === 'ios') ? (
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Foster Youth', selectedIndex: null, selectedName: "fosterYouth", selectedValue: this.state.fosterYouth, selectedOptions: this.state.fosterYouthOptions, selectedSubKey: null })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                        <View style={[styles.calcColumn115]}>
                                          <Text style={[styles.descriptionText1]}>{this.state.fosterYouth}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View style={[styles.standardBorder]}>
                                      <Picker
                                        selectedValue={this.state.fosterYouth}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("fosterYouth",itemValue)
                                        }>
                                        {this.state.fosterYouthOptions.map(value => <Picker.Item label={value} value={value} />)}
                                      </Picker>
                                    </View>
                                  )}

                                </View>
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.row10]}>Are you currently or formerly homeless?{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>

                                  {(Platform.OS === 'ios') ? (
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Homeless', selectedIndex: null, selectedName: "homeless", selectedValue: this.state.homeless, selectedOptions: this.state.homelessOptions, selectedSubKey: null })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                        <View style={[styles.calcColumn115]}>
                                          <Text style={[styles.descriptionText1]}>{this.state.homeless}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View style={[styles.standardBorder]}>
                                      <Picker
                                        selectedValue={this.state.homeless}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("homeless",itemValue)
                                        }>
                                        {this.state.homelessOptions.map(value => <Picker.Item label={value} value={value} />)}
                                      </Picker>
                                    </View>
                                  )}

                                </View>

                              </View>

                              <View>
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.row10]}>Were you previously incarcerated?{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                  {(Platform.OS === 'ios') ? (
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Incarcerated', selectedIndex: null, selectedName: "incarcerated", selectedValue: this.state.incarcerated, selectedOptions: this.state.incarceratedOptions, selectedSubKey: null })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                        <View style={[styles.calcColumn115]}>
                                          <Text style={[styles.descriptionText1]}>{this.state.incarcerated}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View style={[styles.standardBorder]}>
                                      <Picker
                                        selectedValue={this.state.incarcerated}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("incarcerated",itemValue)
                                        }>
                                        {this.state.incarceratedOptions.map(value => <Picker.Item label={value} value={value} />)}
                                      </Picker>
                                    </View>
                                  )}

                                </View>

                              </View>

                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10]}>Designate all that apply.{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>

                                {this.state.adversityListOptions.map((value, optionIndex) =>
                                  <View key={value + optionIndex} style={styles.rowDirection}>
                                    <View style={[styles.rightPadding,styles.topPadding]}>
                                      {(this.state.adversityList && this.state.adversityList.includes(value)) ? (
                                        <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners, styles.ctaBorder,styles.ctaBackgroundColor]} onPress={() => this.optionClicked(optionIndex,'adversityList')}>
                                          <View>
                                            <View>
                                              <Text style={[styles.descriptionText2,styles.whiteColor,styles.nowrap]}>{value}</Text>
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners, styles.lightBorder,styles.lightBackground]} onPress={() => this.optionClicked(optionIndex,'adversityList')}>
                                          <View>
                                            <View>
                                              <Text style={[styles.descriptionText2,styles.nowrap]}>{value}</Text>
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

                          {(this.state.activeOrg === 'c2c') && (
                            <View>

                              <View style={styles.spacer} /><View style={styles.spacer} />
                              <View style={styles.horizontalLine} />

                              <View style={[styles.row10]}>
                                  <View style={styles.spacer}/><View style={styles.halfSpacer}/>
                                  <Text style={[styles.headingText3]}>Political Information</Text>
                              </View>

                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10]}>Political Alignment<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Political Alignment', selectedIndex: null, selectedName: "politicalAlignment", selectedValue: this.state.politicalAlignment, selectedOptions: this.state.politicalAlignmentOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.politicalAlignment}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.politicalAlignment}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("politicalAlignment",itemValue)
                                      }>
                                      {this.state.politicalAlignmentOptions.map(value => <Picker.Item label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}

                              </View>

                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10]}>U.S. State Registered to Vote<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'State Registration', selectedIndex: null, selectedName: "stateRegistration", selectedValue: this.state.stateRegistration, selectedOptions: this.state.registrationOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.stateRegistration}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.stateRegistration}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("stateRegistration",itemValue)
                                      }>
                                      {this.state.registrationOptions.map(value => <Picker.Item label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}

                              </View>

                              <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.row10]}>Current Congressional District<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                                  <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => this.formChangeHandler("currentCongressionalDistrict", text)}
                                    value={this.state.currentCongressionalDistrict}
                                    placeholder="e.g. 12"
                                    placeholderTextColor="grey"
                                  />

                              </View>

                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.row10]}>Hometown (U.S. State)<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Hometown', selectedIndex: null, selectedName: "hometown", selectedValue: this.state.hometown, selectedOptions: this.state.hometownOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.hometown}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.hometown}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("hometown",itemValue)
                                      }>
                                      {this.state.hometownOptions.map(value => <Picker.Item label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}

                              </View>

                              <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.row10]}>Hometown Congressional District<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                  <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => this.formChangeHandler("homeCongressionalDistrict", text)}
                                    value={this.state.homeCongressionalDistrict}
                                    placeholder="e.g. 12"
                                    placeholderTextColor="grey"
                                  />
                              </View>

                            </View>
                          )}
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>
                  ) : (
                    <View />
                  )}

                  {(!this.props.fromApply) && (
                    <View>
                      <View style={styles.spacer} /><View style={styles.spacer} />

                      {this.state.clientErrorMessage !== '' && <Text style={[styles.standardText,styles.errorColor]}>{this.state.clientErrorMessage}</Text>}

                      { (this.state.serverSuccessText) ? (
                        <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageText}</Text>
                      ) : (
                        <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageText}</Text>
                      )}
                      { (this.state.serverSuccessProfilePic) ? (
                        <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageProfilePic}</Text>
                      ) : (
                        <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageProfilePic}</Text>
                      )}
                      { (this.state.serverSuccessCoverPic) ? (
                        <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageCoverPic}</Text>
                      ) : (
                        <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageCoverPic}</Text>
                      )}

                      {(this.props.fromWalkthrough) ? (
                        <View style={[styles.flex1,styles.topMargin50]}>
                          <View style={styles.horizontalLine} />

                          <View style={[styles.rowDirection,styles.flex1,styles.topMargin]}>
                            <View style={[styles.flex50,styles.rightPadding5]}>
                              <TouchableOpacity style={[styles.btnPrimary,styles.mediumBackground,styles.standardBorder,styles.flexCenter]} onPress={() => this.props.movePage(false)}><Text style={[styles.standardText,styles.whiteColor]}>Back</Text></TouchableOpacity>
                            </View>
                            <View style={[styles.flex50,styles.leftPadding5]}>
                              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.handleSubmit()}><Text style={[styles.standardText,styles.whiteColor]}>Next step</Text></TouchableOpacity>
                            </View>

                          </View>
                        </View>
                      ) : (
                        <View style={[styles.row10]}>
                          <TouchableOpacity onPress={this.handleSubmit} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.whiteColor]}>Save Profile Changes</Text></TouchableOpacity>
                        </View>
                      )}

                      <View style={[styles.superSpacer]} />

                    </View>
                  )}
                </View>
              )}

              {(this.props.category === 'Details' || this.props.passedType === 'Details') && (
                <View>
                  <View style={[styles.row10,styles.rowDirection]}>
                    <View style={[styles.calcColumn110]}>
                      <View style={styles.spacer} /><View style={styles.halfSpacer} />
                      <Text style={[styles.headingText3]}>Projects (Optional)</Text>
                      <View style={styles.halfSpacer} />
                      <Text style={[styles.descriptionText2,styles.bottomPadding5]}>Add school, personal or professional projects relevant to employment. Examples include research papers, design projects, engineering projects, science projects, and business case studies.</Text>

                      {(this.state.projects.length > 0 && this.state.publicProfile) && (
                        <View style={styles.row5}>
                          <Text style={styles.descriptionText2}>Your portfolio: <Text onPress={() => Linking.openURL("https://www.guidedcompass.com/" + this.state.username + "/projects")} style={[styles.standardText,styles.ctaColor,styles.boldText]}>https://www.guidedcompass.com/{this.state.username}/projects</Text></Text>
                        </View>
                      )}
                    </View>
                    <View style={[styles.width50,styles.rightPadding,styles.topMargin20]}>
                      <TouchableOpacity onPress={() => this.addItem('projects')}>
                        <Image source={{ uri: addIcon}} style={[styles.square25,styles.contain]}/>
                      </TouchableOpacity>
                    </View>

                  </View>

                  {this.state.clientErrorMessage !== '' ? <Text style={[styles.standardText,styles.errorColor]}>{this.state.clientErrorMessage}</Text> : <View />}

                  { (this.state.serverSuccessText) ? (
                    <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageText}</Text>
                  ) : (
                    <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageText}</Text>
                  )}
                  { (this.state.serverSuccessProfilePic) ? (
                    <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageProfilePic}</Text>
                  ) : (
                    <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageProfilePic}</Text>
                  )}
                  { (this.state.serverSuccessCoverPic) ? (
                    <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageCoverPic}</Text>
                  ) : (
                    <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageCoverPic}</Text>
                  )}

                  {(this.state.projects.length > 0) && (
                    <View style={[styles.row10]}>
                      {this.renderProjects()}
                    </View>
                  )}

                  <View>
                    <View style={styles.spacer} /><View style={styles.spacer} />
                    <View style={styles.horizontalLine} />

                    <View style={[styles.row10,styles.rowDirection]}>
                      <View style={styles.calcColumn110}>
                        <View style={styles.spacer} /><View style={styles.halfSpacer} />
                        <Text style={[styles.headingText3]}>Experience (Optional)</Text>
                        <View style={styles.halfSpacer} />
                        <Text style={[styles.descriptionText2,styles.bottomPadding5]}>{(this.state.activeOrg === 'c2c') ? "Provide information about current or past jobs and experiences relevant to interning on Capitol Hill. This should include any leadership, political, government, customer service, or volunteer experiences from your resume that you want to highlight." : "Provide information about current or past jobs and experiences relevant to your target internships. This should include any leadership, volunteer, or paid experiences from your resume that you want to highlight."}</Text>
                      </View>
                      <View style={[styles.width50,styles.rightPadding,styles.topMargin20]}>
                        <TouchableOpacity onPress={() => this.addItem('experience')}>
                          <Image source={{ uri: addIcon}} style={[styles.square25,styles.contain]}/>
                        </TouchableOpacity>
                      </View>

                    </View>

                    {(this.state.experience.length > 0) && (
                      <View style={[styles.row10]}>
                        {this.renderExperience()}
                      </View>
                    )}
                  </View>

                  <View style={styles.spacer} /><View style={styles.spacer} />
                  <View style={styles.horizontalLine} />

                  {(this.state.activeOrg === 'exp' || this.state.activeOrg === 'unite-la' || this.state.activeOrg === 'guidedcompass') ? (
                    <View>
                      <View style={[styles.row10,styles.rowDirection]}>
                        <View style={styles.calcColumn110}>
                          <View style={styles.spacer} /><View style={styles.halfSpacer} />
                          <Text style={[styles.headingText3]}>Extracurriculars (Optional)</Text>
                          <View style={styles.halfSpacer} />
                          <Text style={[styles.descriptionText2,styles.bottomPadding5]}>List all activities, clubs, or teams that you are / were involved in.</Text>
                        </View>
                        <View style={[styles.width50,styles.rightPadding,styles.topMargin20]}>
                          <TouchableOpacity onPress={() => this.addItem('extracurricular')}>
                            <Image source={{ uri: addIcon}} style={[styles.square25,styles.contain]}/>
                          </TouchableOpacity>
                        </View>

                      </View>

                      {(this.state.extracurriculars.length > 0) && (
                        <View style={[styles.row10]}>
                          {this.renderExtras('extracurriculars')}
                        </View>
                      )}

                      <View style={styles.spacer} /><View style={styles.spacer} />
                      <View style={styles.horizontalLine} />

                      <View style={[styles.row10,styles.rowDirection]}>
                        <View style={[styles.calcColumn110]}>
                          <View style={styles.spacer} /><View style={styles.halfSpacer} />
                          <Text style={[styles.headingText3]}>Awards (Optional)</Text>
                          <View style={styles.halfSpacer} />
                          <Text style={[styles.descriptionText2,styles.bottomPadding5]}>List any awards or special recognition earned in high school (Student of the Month, Perfect Attendance, Honor Roll, Citizenship, etc.) and the year received.</Text>
                        </View>
                        <View style={[styles.width50,styles.rightPadding,styles.topMargin20]}>
                          <TouchableOpacity onPress={() => this.addItem('award')}>
                            <Image source={{ uri: addIcon}} style={[styles.square25,styles.contain]}/>
                          </TouchableOpacity>
                        </View>

                      </View>

                      {(this.state.awards.length > 0) && (
                        <View style={[styles.row10]}>
                          {this.renderExtras('awards')}
                        </View>
                      )}
                    </View>
                  ) : (
                    <View />
                  )}

                  {this.state.clientErrorMessage !== '' && <Text style={[styles.standardText,styles.errorColor]}>{this.state.clientErrorMessage}</Text>}

                  { (this.state.serverSuccessText) ? (
                    <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageText}</Text>
                  ) : (
                    <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageText}</Text>
                  )}
                  { (this.state.serverSuccessProfilePic) ? (
                    <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageProfilePic}</Text>
                  ) : (
                    <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageProfilePic}</Text>
                  )}
                  { (this.state.serverSuccessCoverPic) ? (
                    <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageCoverPic}</Text>
                  ) : (
                    <Text style={[styles.standardText,styles.errorColor]}>{this.state.serverErrorMessageCoverPic}</Text>
                  )}
                </View>
              )}

              {(this.props.category === 'Visibility Preferences' || this.props.passedType === 'Public') && (
                <View>

                  {(!this.props.fromAdvisor) && (
                    <View style={[styles.row10]}>
                      <Text style={[styles.standardText,styles.row10]}>Making your profile visible allows you to use the link as a portfolio link, add the link to your resume, connect with others, get feedback from mentors, and get shortlisted by employers for work opportunities.*</Text>
                      <Text style={[styles.row10,styles.descriptionText2]}>* Note that this is separate from applying to opportunities. In that case, only your application is shared with the reviewers.</Text>

                      <View>
                        <View style={[styles.row20]}>
                          <View style={styles.spacer}/><View style={styles.halfSpacer}/>
                          <Text style={[styles.headingText4]}>Can Others View Your Profile?</Text>

                          <View style={[styles.row10,styles.rowDirection]}>
                            <View style={styles.rightPadding}>
                              <Switch
                                 onValueChange = {(value) => this.switchPreferences(value)}
                                 value = {this.state.publicProfile}
                                 disabled={this.state.isSaving}
                              />
                            </View>

                            <View style={styles.topMargin3}>{(this.state.publicProfile) ? <Text style={[styles.ctaColor,styles.descriptionText2,styles.boldText]}>(Open)</Text> : <Text style={[styles.descriptionText2]}>(Private)</Text>}</View>


                          </View>

                          {(this.state.publicPreferencesErrorMessage) && <Text style={[styles.errorColor,styles.descriptionText2]}>{this.state.publicPreferencesErrorMessage}</Text>}
                          {(this.state.publicPreferencesSuccessMessage) && <Text style={[styles.descriptionText2,styles.ctaColor]}>{this.state.publicPreferencesSuccessMessage}</Text>}

                          {(this.state.publicProfile) ? (
                            <View style={[styles.row10]}>

                              <View style={[styles.row10]}>
                                <View style={styles.rowDirection}>
                                  <View>
                                    <Text style={styles.headingText5}>Who Can View Your Profile?</Text>
                                  </View>
                                  <View>
                                    <View style={[styles.leftMargin,styles.row7,styles.horizontalPadding10,styles.ctaBorder, { borderRadius: 11 }]}>
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPublicProfileExtentInfo: true })}>
                                        <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain,styles.centerItem]} />
                                      </TouchableOpacity>
                                    </View>

                                  </View>

                                </View>

                                <View style={styles.spacer} />

                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Public Profile Extent', selectedIndex: null, selectedName: "publicProfileExtent", selectedValue: this.state.publicProfileExtent, selectedOptions: this.state.publicProfileExtentOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.publicProfileExtent}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.publicProfileExtent}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("publicProfileExtent",itemValue)
                                      }>
                                      {this.state.publicProfileExtentOptions.map(value => <Picker.Item label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}

                                <View style={styles.spacer} />
                              </View>

                              <View>
                                <View style={[styles.row10]}>
                                  <Text style={styles.headingText5}>Profile Link (Within Portal)</Text>
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.username })}><Text style={[styles.standardText]}>Preview in Portal</Text></TouchableOpacity>
                                  <View style={styles.spacer} />
                                </View>
                                {(this.state.publicProfileExtent === 'Public') ? (
                                  <View style={[styles.row10]}>
                                    <Text style={styles.headingText5}>Public Profile Link</Text>
                                    <TouchableOpacity onPress={() => Linking.openURL("https://www.guidedcompass.com/" + this.state.username + "/profile")}><Text style={[styles.standardText]}>https://www.guidedcompass.com/ + {this.state.username} + /profile</Text></TouchableOpacity>
                                    <View style={styles.spacer} />
                                  </View>
                                ) : (
                                  <View />
                                )}

                              </View>

                              {(!this.props.fromWalkthrough) ? (
                                <View style={[styles.row10]}>
                                  <View style={[styles.bottomPadding]}>
                                    <Text style={styles.headingText5}>Headline</Text>
                                  </View>
                                  <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => this.formChangeHandler("headline", text)}
                                    value={this.state.headline}
                                    placeholder="e.g. I like building stuff that matters"
                                    placeholderTextColor="grey"
                                  />
                                </View>
                              ) : (
                                <View />
                              )}

                              <View style={styles.spacer} />

                              <View style={[styles.topPadding]}>
                                <Text style={[styles.standardText]}>What would you like public?</Text>
                              </View>

                              <View style={[styles.row10]}>
                                <View style={[styles.row5,styles.rowDirection]}>
                                  <View style={styles.calcColumn160}>
                                    <Text style={[styles.standardText,styles.topPadding]}>1. Posts</Text>
                                  </View>
                                  <View style={styles.width100}>
                                    {(Platform.OS === 'ios') ? (
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Post Public Preference', selectedIndex: null, selectedName: "postPublicPreference", selectedValue: this.state.postPublicPreference, selectedOptions: ['','All','None'], selectedSubKey: null })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={[styles.calcColumn115]}>
                                            <Text style={[styles.descriptionText1]}>{this.state.postPublicPreference}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    ) : (
                                      <View style={[styles.standardBorder]}>
                                        <Picker
                                          selectedValue={this.state.postPublicPreference}
                                          onValueChange={(itemValue, itemIndex) =>
                                            this.formChangeHandler("postPublicPreference",itemValue)
                                          }>
                                          {['','All','None'].map(value => <Picker.Item label={value} value={value} />)}
                                        </Picker>
                                      </View>
                                    )}
                                  </View>


                                  {(this.state.postPublicPreference === 'Some') && (
                                    <View style={styles.rowDirection}>
                                      {(!this.state.postOptions || this.state.postOptions.length === 0) ? (
                                        <View>
                                          <Text style={[styles.standardText,styles.errorColor]}>You have no posts to publicize. Add a post to the news feed.</Text>
                                        </View>
                                      ) : (
                                        <View style={[styles.calcColumn60]}>
                                          <View style={styles.halfSpacer} />
                                          <View>
                                            {(Platform.OS === 'ios') ? (
                                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Selected Post', selectedIndex: null, selectedName: "selectedPost", selectedValue: this.state.selectedPost, selectedOptions: this.state.postOptions, selectedSubKey: 'title' })}>
                                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                                  <View style={[styles.calcColumn115]}>
                                                    <Text style={[styles.descriptionText1]}>{this.state.selectedPost}</Text>
                                                  </View>
                                                  <View style={[styles.width20,styles.topMargin5]}>
                                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                                  </View>
                                                </View>
                                              </TouchableOpacity>
                                            ) : (
                                              <View style={[styles.standardBorder]}>
                                                <Picker
                                                  selectedValue={this.state.selectedPost}
                                                  onValueChange={(itemValue, itemIndex) =>
                                                    this.formChangeHandler("selectedPost",itemValue)
                                                  }>
                                                  {this.state.postOptions.map(value => <Picker.Item key={value.title} label={value.title} value={value.title} />)}
                                                </Picker>
                                              </View>
                                            )}

                                          </View>
                                          <View>
                                            <TouchableOpacity style={[styles.btnSquarish,styles.descriptionText1,styles.ctaBackgroundColor,styles.whiteColor,styles.flexCenter]} onPress={() => this.optionClicked(null, 'post', this.state.selectedPost)}><Text style={[styles.standardText]}>Add</Text></TouchableOpacity>
                                          </View>
                                        </View>
                                      )}

                                      {this.renderTags('post', this.state.publicPosts)}

                                    </View>
                                  )}
                                </View>

                                <View style={[styles.row5]}>

                                  <View style={[styles.row5,styles.rowDirection]}>
                                    <View style={styles.calcColumn160}>
                                      <Text style={[styles.standardText,styles.topPadding]}>2. Projects</Text>
                                    </View>
                                    <View style={styles.width100}>
                                      {(Platform.OS === 'ios') ? (
                                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Project Preference', selectedIndex: null, selectedName: "projectPublicPreference", selectedValue: this.state.projectPublicPreference, selectedOptions: this.state.publicPreferenceOptions, selectedSubKey: null })}>
                                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                            <View style={[styles.calcColumn115]}>
                                              <Text style={[styles.descriptionText1]}>{this.state.projectPublicPreference}</Text>
                                            </View>
                                            <View style={[styles.width20,styles.topMargin5]}>
                                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <View style={[styles.standardBorder]}>
                                          <Picker
                                            selectedValue={this.state.projectPublicPreference}
                                            onValueChange={(itemValue, itemIndex) =>
                                              this.formChangeHandler("projectPublicPreference",itemValue)
                                            }>
                                            {this.state.publicPreferenceOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                          </Picker>
                                        </View>
                                      )}

                                    </View>
                                  </View>



                                  {(this.state.projectPublicPreference !== 'None') && (
                                    <View style={[styles.row10,styles.descriptionText2,styles.boldText]}>
                                      <Text style={[styles.rightPadding,styles.standardText]}>Portfolio Link:</Text>
                                      <TouchableOpacity onPress={() => Linking.openURL("https://www.guidedcompass.com/" + this.state.username + "/projects")}><Text style={[styles.standardText,styles.ctaColor,styles.boldText]}>https://www.guidedcompass.com/ + {this.state.username} + /projects</Text></TouchableOpacity>
                                    </View>
                                  )}

                                  {(this.state.projectPublicPreference === 'Some') && (
                                    <View style={styles.rowDirection}>
                                      {(!this.state.projects || this.state.projects.length === 0) ? (
                                        <View>
                                          <Text style={[styles.standardText,styles.errorColor]}>You have no projects to publicize. Add projects below.</Text>
                                        </View>
                                      ) : (
                                        <View style={styles.calcColumn60}>
                                          <View style={styles.halfSpacer} />
                                          <View>
                                            {(Platform.OS === 'ios') ? (
                                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Selected Project', selectedIndex: null, selectedName: "selectedProject", selectedValue: this.state.selectedProject, selectedOptions: this.state.projectOptions, selectedSubKey: 'title' })}>
                                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                                  <View style={[styles.calcColumn115]}>
                                                    <Text style={[styles.descriptionText1]}>{this.state.selectedProject}</Text>
                                                  </View>
                                                  <View style={[styles.width20,styles.topMargin5]}>
                                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                                  </View>
                                                </View>
                                              </TouchableOpacity>
                                            ) : (
                                              <View style={[styles.standardBorder]}>
                                                <Picker
                                                  selectedValue={this.state.selectedProject}
                                                  onValueChange={(itemValue, itemIndex) =>
                                                    this.formChangeHandler("selectedProject",itemValue)
                                                  }>
                                                  {this.state.projectOptions.map(value => <Picker.Item key={value.title} label={value.title} value={value.title} />)}
                                                </Picker>
                                              </View>
                                            )}

                                          </View>
                                          <View>
                                            <TouchableOpacity style={[styles.btnSquarish,styles.descriptionText1,styles.ctaBackgroundColor,styles.whiteColor,styles.flexCenter]} onPress={() => this.optionClicked(null, 'project', this.state.selectedProject)}><Text style={[styles.standardText]}>Add</Text></TouchableOpacity>
                                          </View>

                                        </View>
                                      )}


                                      {this.renderTags('project', this.state.publicProjects)}

                                    </View>
                                  )}
                                </View>

                                <View style={[styles.row5]}>
                                  <View style={[styles.rowDirection]}>
                                    <View style={styles.calcColumn160}>
                                      <Text style={[styles.standardText,styles.topPadding]}>3. Goals</Text>
                                    </View>
                                    <View style={styles.width100}>
                                      {(Platform.OS === 'ios') ? (
                                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Goal Preference', selectedIndex: null, selectedName: "goalPublicPreference", selectedValue: this.state.goalPublicPreference, selectedOptions: this.state.publicPreferenceOptions, selectedSubKey: null })}>
                                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                            <View style={[styles.calcColumn115]}>
                                              <Text style={[styles.descriptionText1]}>{this.state.goalPublicPreference}</Text>
                                            </View>
                                            <View style={[styles.width20,styles.topMargin5]}>
                                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <View style={[styles.standardBorder]}>
                                          <Picker
                                            selectedValue={this.state.goalPublicPreference}
                                            onValueChange={(itemValue, itemIndex) =>
                                              this.formChangeHandler("goalPublicPreference",itemValue)
                                            }>
                                            {this.state.publicPreferenceOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                          </Picker>
                                        </View>
                                      )}

                                    </View>
                                  </View>

                                  {(this.state.goalPublicPreference === 'Some') && (
                                    <View>
                                      {(!this.state.goalOptions || this.state.goalOptions.length === 0) ? (
                                        <View>
                                          <Text style={[styles.standardText,styles.errorColor]}>You have no goals to publicize. Add goals in the career goals tab.</Text>
                                        </View>
                                      ) : (
                                        <View style={styles.calcColumn60}>
                                          <View style={styles.halfSpacer} />
                                          <View>
                                            {(Platform.OS === 'ios') ? (
                                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Selected Goal', selectedIndex: null, selectedName: "selectedGoal", selectedValue: this.state.selectedGoal, selectedOptions: this.state.goalOptions, selectedSubKey: 'title' })}>
                                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                                  <View style={[styles.calcColumn115]}>
                                                    <Text style={[styles.descriptionText1]}>{this.state.selectedGoal}</Text>
                                                  </View>
                                                  <View style={[styles.width20,styles.topMargin5]}>
                                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                                  </View>
                                                </View>
                                              </TouchableOpacity>
                                            ) : (
                                              <View style={[styles.standardBorder]}>
                                                <Picker
                                                  selectedValue={this.state.selectedGoal}
                                                  onValueChange={(itemValue, itemIndex) =>
                                                    this.formChangeHandler("selectedGoal",itemValue)
                                                  }>
                                                  {this.state.goalOptions.map(value => <Picker.Item key={value.title} label={value.title} value={value.title} />)}
                                                </Picker>
                                              </View>
                                            )}

                                          </View>
                                          <View>
                                            <TouchableOpacity style={[styles.btnSquarish,styles.descriptionText1,styles.ctaBackgroundColor,styles.whiteColor,styles.flexCenter]} onPress={() => this.optionClicked(null, 'goal', this.state.selectedGoal)}><Text style={[styles.standardText]}>Add</Text></TouchableOpacity>
                                          </View>

                                        </View>
                                      )}


                                      {this.renderTags('goal', this.state.publicGoals)}

                                    </View>
                                  )}
                                </View>

                                <View style={[styles.row5]}>
                                  <View style={styles.rowDirection}>
                                    <View style={styles.calcColumn160}>
                                      <Text style={[styles.standardText,styles.topPadding]}>4. Passions</Text>
                                    </View>
                                    <View style={styles.width100}>
                                      {(Platform.OS === 'ios') ? (
                                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Passion Preference', selectedIndex: null, selectedName: "passionPublicPreference", selectedValue: this.state.passionPublicPreference, selectedOptions: this.state.publicPreferenceOptions, selectedSubKey: null })}>
                                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                            <View style={[styles.calcColumn115]}>
                                              <Text style={[styles.descriptionText1]}>{this.state.passionPublicPreference}</Text>
                                            </View>
                                            <View style={[styles.width20,styles.topMargin5]}>
                                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <View style={[styles.standardBorder]}>
                                          <Picker
                                            selectedValue={this.state.passionPublicPreference}
                                            onValueChange={(itemValue, itemIndex) =>
                                              this.formChangeHandler("passionPublicPreference",itemValue)
                                            }>
                                            {this.state.publicPreferenceOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                          </Picker>
                                        </View>
                                      )}

                                    </View>

                                  </View>

                                  {(this.state.passionPublicPreference === 'Some') && (
                                    <View>
                                      {(!this.state.passionOptions || this.state.passionOptions.length === 0) ? (
                                        <View>
                                          <Text style={[styles.standardText,styles.errorColor]}>You have no passions to publicize. Add passions in the career goals tab.</Text>
                                        </View>
                                      ) : (
                                        <View style={styles.calcColumn60}>
                                          <View style={styles.halfSpacer} />
                                          <View>
                                            {(Platform.OS === 'ios') ? (
                                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Selected Passion', selectedIndex: null, selectedName: "selectedPassion", selectedValue: this.state.selectedPassion, selectedOptions: this.state.passionOptions, selectedSubKey: 'passionTitle' })}>
                                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                                  <View style={[styles.calcColumn115]}>
                                                    <Text style={[styles.descriptionText1]}>{this.state.selectedPassion}</Text>
                                                  </View>
                                                  <View style={[styles.width20,styles.topMargin5]}>
                                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                                  </View>
                                                </View>
                                              </TouchableOpacity>
                                            ) : (
                                              <View style={[styles.standardBorder]}>
                                                <Picker
                                                  selectedValue={this.state.selectedPassion}
                                                  onValueChange={(itemValue, itemIndex) =>
                                                    this.formChangeHandler("selectedPassion",itemValue)
                                                  }>
                                                  {this.state.passionOptions.map(value => <Picker.Item key={value.passionTitle} label={value.passionTitle} value={value.passionTitle} />)}
                                                </Picker>
                                              </View>
                                            )}

                                          </View>
                                          <View>
                                            <TouchableOpacity style={[styles.btnSquarish,styles.descriptionText1,styles.ctaBackgroundColor,styles.whiteColor,styles.flexCenter]} onPress={() => this.optionClicked(null, 'passion', this.state.selectedPassion)}><Text style={[styles.standardText]}>Add</Text></TouchableOpacity>
                                          </View>

                                        </View>
                                      )}

                                      {this.renderTags('passion', this.state.publicPassions)}

                                    </View>
                                  )}
                                </View>

                                <View style={[styles.row5]}>
                                  <View style={styles.rowDirection}>
                                    <View style={styles.calcColumn160}>
                                      <Text style={[styles.standardText,styles.topPadding]}>5. Career Assessments</Text>
                                    </View>
                                    <View style={styles.width100}>
                                      {(Platform.OS === 'ios') ? (
                                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Assessment Preference', selectedIndex: null, selectedName: "assessmentPublicPreference", selectedValue: this.state.assessmentPublicPreference, selectedOptions: this.state.publicPreferenceOptions, selectedSubKey: null })}>
                                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                            <View style={[styles.calcColumn115]}>
                                              <Text style={[styles.descriptionText1]}>{this.state.assessmentPublicPreference}</Text>
                                            </View>
                                            <View style={[styles.width20,styles.topMargin5]}>
                                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <View style={[styles.standardBorder]}>
                                          <Picker
                                            selectedValue={this.state.assessmentPublicPreference}
                                            onValueChange={(itemValue, itemIndex) =>
                                              this.formChangeHandler("assessmentPublicPreference",itemValue)
                                            }>
                                            {this.state.publicPreferenceOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                          </Picker>
                                        </View>
                                      )}

                                    </View>

                                  </View>

                                  {(this.state.assessmentPublicPreference === 'Some') && (
                                    <View>
                                      {(!this.state.assessmentOptions || this.state.assessmentOptions.length === 0) ? (
                                        <View>
                                          <Text style={[styles.standardText,styles.errorColor]}>You have no assessment results to publicize. Take assessments in the assessments tab.</Text>
                                        </View>
                                      ) : (
                                        <View style={styles.calcColumn60}>
                                          <View style={styles.halfSpacer} />
                                          <View>
                                            {(Platform.OS === 'ios') ? (
                                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Selected Assessment', selectedIndex: null, selectedName: "selectedAssessment", selectedValue: this.state.selectedAssessment, selectedOptions: this.state.assessmentOptions, selectedSubKey: null })}>
                                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                                  <View style={[styles.calcColumn115]}>
                                                    <Text style={[styles.descriptionText1]}>{this.state.selectedAssessment}</Text>
                                                  </View>
                                                  <View style={[styles.width20,styles.topMargin5]}>
                                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                                  </View>
                                                </View>
                                              </TouchableOpacity>
                                            ) : (
                                              <View style={[styles.standardBorder]}>
                                                <Picker
                                                  selectedValue={this.state.selectedAssessment}
                                                  onValueChange={(itemValue, itemIndex) =>
                                                    this.formChangeHandler("selectedAssessment",itemValue)
                                                  }>
                                                  {this.state.assessmentOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                                </Picker>
                                              </View>
                                            )}

                                          </View>
                                          <View>
                                            <TouchableOpacity style={[styles.btnSquarish,styles.descriptionText1,styles.ctaBackgroundColor,styles.whiteColor,styles.flexCenter]} onPress={() => this.optionClicked(null, 'assessment', this.state.selectedAssessment)}><Text style={[styles.standardText]}>Add</Text></TouchableOpacity>
                                          </View>

                                        </View>
                                      )}

                                      {this.renderTags('assessment', this.state.publicAssessments)}

                                    </View>
                                  )}
                                </View>

                                <View style={[styles.row5]}>
                                  <View style={styles.rowDirection}>
                                    <View style={styles.calcColumn160}>
                                      <Text style={[styles.standardText,styles.topPadding]}>6. Skill & Knowledge Endorsements</Text>
                                    </View>
                                    <View style={styles.width100}>
                                      {(Platform.OS === 'ios') ? (
                                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Endorsement Preference', selectedIndex: null, selectedName: "endorsementPublicPreference", selectedValue: this.state.endorsementPublicPreference, selectedOptions: this.state.publicPreferenceOptions, selectedSubKey: null })}>
                                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                            <View style={[styles.calcColumn115]}>
                                              <Text style={[styles.descriptionText1]}>{this.state.endorsementPublicPreference}</Text>
                                            </View>
                                            <View style={[styles.width20,styles.topMargin5]}>
                                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                            </View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <View style={[styles.standardBorder]}>
                                          <Picker
                                            selectedValue={this.state.endorsementPublicPreference}
                                            onValueChange={(itemValue, itemIndex) =>
                                              this.formChangeHandler("endorsementPublicPreference",itemValue)
                                            }>
                                            {this.state.publicPreferenceOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                          </Picker>
                                        </View>
                                      )}

                                    </View>

                                  </View>

                                  {(this.state.endorsementPublicPreference === 'Some') && (
                                    <View>
                                      {(!this.state.endorsementOptions || this.state.endorsementOptions.length === 0) ? (
                                        <View>
                                          <Text style={[styles.standardText,styles.errorColor]}>You have no skill endorsements to publicize. Request endorsements in the endorsements tab.</Text>
                                        </View>
                                      ) : (
                                        <View style={styles.calcColumn60}>
                                          <View style={styles.halfSpacer} />
                                          <View>
                                            {(Platform.OS === 'ios') ? (
                                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Selected Endorsement', selectedIndex: null, selectedName: "selectedEndorsement", selectedValue: this.state.selectedEndorsement, selectedOptions: this.state.endorsementOptions, selectedSubKey: 'senderEmail' })}>
                                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                                  <View style={[styles.calcColumn115]}>
                                                    <Text style={[styles.descriptionText1]}>{this.state.selectedEndorsement}</Text>
                                                  </View>
                                                  <View style={[styles.width20,styles.topMargin5]}>
                                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                                  </View>
                                                </View>
                                              </TouchableOpacity>
                                            ) : (
                                              <View style={[styles.standardBorder]}>
                                                <Picker
                                                  selectedValue={this.state.selectedEndorsement}
                                                  onValueChange={(itemValue, itemIndex) =>
                                                    this.formChangeHandler("selectedEndorsement",itemValue)
                                                  }>
                                                  {this.state.endorsementOptions.map(value => <Picker.Item key={value.senderEmail} label={value.senderEmail} value={value.senderEmail} />)}
                                                </Picker>
                                              </View>
                                            )}

                                          </View>
                                          <View>
                                            <TouchableOpacity style={[styles.btnSquarish,styles.descriptionText1,styles.ctaBackgroundColor,styles.whiteColor,styles.flexCenter]} onPress={() => this.optionClicked(null, 'endorsement', this.state.selectedEndorsement)}><Text style={[styles.standardText]}>Add</Text></TouchableOpacity>
                                          </View>

                                        </View>
                                      )}


                                      {this.renderTags('endorsement', this.state.publicEndorsements)}

                                    </View>
                                  )}
                                </View>

                                {(!this.state.remoteAuth) && (
                                  <View style={[styles.row5]}>
                                    <View style={styles.rowDirection}>
                                      <View style={[styles.calcColumn160]}>
                                        <Text style={[styles.standardText,styles.topPadding]}>7. Primary Resume</Text>
                                      </View>
                                      <View style={styles.width100}>
                                        {(Platform.OS === 'ios') ? (
                                          <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Resume Preference', selectedIndex: null, selectedName: "resumePublicPreference", selectedValue: this.state.resumePublicPreference, selectedOptions: ['','Yes','No'], selectedSubKey: null })}>
                                            <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                              <View style={[styles.calcColumn115]}>
                                                <Text style={[styles.descriptionText1]}>{this.state.resumePublicPreference}</Text>
                                              </View>
                                              <View style={[styles.width20,styles.topMargin5]}>
                                                <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                              </View>
                                            </View>
                                          </TouchableOpacity>
                                        ) : (
                                          <View style={[styles.standardBorder]}>
                                            <Picker
                                              selectedValue={this.state.resumePublicPreference}
                                              onValueChange={(itemValue, itemIndex) =>
                                                this.formChangeHandler("resumePublicPreference",itemValue)
                                              }>
                                              {['','Yes','No'].map(value => <Picker.Item key={value} label={value} value={value} />)}
                                            </Picker>
                                          </View>
                                        )}
                                      </View>

                                    </View>

                                    {(this.state.resumePublicPreference === 'Yes') && (
                                      <View>
                                        {(!this.state.resumes || this.state.resumes.length === 0) ? (
                                          <View>
                                            <Text style={[styles.standardText,styles.errorColor]}>You have no resumes to publicize. Add resumes in the "Basic Info" section of your profile or by using the Resume Builder.</Text>
                                          </View>
                                        ) : (
                                          <View style={[styles.calcColumn60,styles.row10]}>
                                            <View style={styles.halfSpacer} />
                                            <View style={[styles.rowDirection],styles.rowDirection}>
                                              <View style={[styles.calcColumn130]}>
                                                {(Platform.OS === 'ios') ? (
                                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Selected Resumes', selectedIndex: null, selectedName: "selectedResume", selectedValue: this.state.selectedResume, selectedOptions: this.state.resumeNames, selectedSubKey: null })}>
                                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                                      <View style={[styles.calcColumn180]}>
                                                        <Text style={[styles.descriptionText1]}>{this.state.selectedResume}</Text>
                                                      </View>
                                                      <View style={[styles.width20,styles.topMargin5]}>
                                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                                      </View>
                                                    </View>
                                                  </TouchableOpacity>
                                                ) : (
                                                  <View style={[styles.standardBorder]}>
                                                    <Picker
                                                      selectedValue={this.state.selectedResume}
                                                      onValueChange={(itemValue, itemIndex) =>
                                                        this.formChangeHandler("selectedResume",itemValue)
                                                      }>
                                                      {this.state.resumeNames.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                                    </Picker>
                                                  </View>
                                                )}
                                              </View>
                                              <View style={[styles.width70,styles.leftPadding]}>
                                                <TouchableOpacity style={[styles.btnSquarish,styles.descriptionText1,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.optionClicked(null, 'resume', this.state.selectedResume)}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
                                              </View>
                                            </View>

                                          </View>
                                        )}

                                        {this.renderTags('resume', null)}

                                      </View>
                                    )}
                                  </View>
                                )}

                              </View>

                              <View style={[styles.row10]}>
                                <View>
                                  <Text style={[styles.standardText]}>Automatically Included:</Text>
                                </View>

                                <View style={[styles.row10]}>
                                  <View >
                                    <View style={[styles.rowDirection]}><Image source={{ uri: checkmarkIcon}} style={[styles.square20,styles.contain,styles.centerItem]} /><Text style={[styles.descriptionText2,styles.boldText,styles.topMargin3]}>Portfolio Link</Text></View>
                                    <View style={[styles.rowDirection]}><Image source={{ uri: checkmarkIcon}} style={[styles.square20,styles.contain,styles.centerItem]} /><Text style={[styles.descriptionText2,styles.boldText,styles.topMargin3]}>LinkedIn</Text></View>
                                  </View>
                                </View>
                              </View>

                              {(this.state.publicPreferencesErrorMessage) && <Text style={[styles.errorColor,styles.descriptionText2]}>{this.state.publicPreferencesErrorMessage}</Text>}
                              {(this.state.publicPreferencesSuccessMessage) && <Text style={[styles.descriptionText2,styles.ctaColor]}>{this.state.publicPreferencesSuccessMessage}</Text>}

                              {(!this.props.fromWalkthrough) && (
                                <View style={[styles.row10]}>
                                  <TouchableOpacity style={[styles.btnPrimary,styles.ctaColor,styles.ctaBorder,styles.whiteBackground,styles.flexCenter]} disabled={this.state.isSaving} onPress={() => this.savePreferences(false, false)}><Text style={[styles.ctaColor,styles.standardText]}>Save Profile Visibility Preferences</Text></TouchableOpacity>
                                </View>
                              )}

                            </View>
                          ) : (
                            <View />
                          )}

                          {(this.props.fromWalkthrough) ? (
                            <View style={[styles.calcColumn60,styles.topMargin30]}>
                              <View style={styles.horizontalLine} />

                              <View style={[styles.calcColumn60,styles.topMargin30,styles.rowDirection]}>
                                <View style={[styles.flex50,styles.rightPadding5]}>
                                  <TouchableOpacity style={[styles.btnPrimary,styles.mediumBackground,styles.standardBorder,styles.flexCenter]} onPress={() => this.props.movePage(false)}><Text style={[styles.standardText,styles.whiteColor]}>Back</Text></TouchableOpacity>
                                </View>

                                <View style={[styles.flex50,styles.leftPadding5]}>
                                  <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.isSaving} onPress={() => this.savePreferences(false, false, true)}><Text style={[styles.standardText,styles.whiteColor]}>Get Started</Text></TouchableOpacity>
                                </View>

                              </View>
                            </View>
                          ) : (
                            <View />
                          )}
                        </View>
                      </View>
                    </View>
                  )}
                </View>
              )}

              {(this.state.extraPaddingForKeyboard) && (
                <View>
                  <View style={[styles.superSpacer]} /><View style={[styles.superSpacer]} />
                  <View style={[styles.superSpacer]} /><View style={[styles.superSpacer]} />
                </View>
              )}

              {(this.state.showProjectDetail) ? (
                <View>
                  {console.log('showProjectDetail 2: ', this.state.showProjectDetail)}
                  <ProjectDetails closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedProject={this.state.projects[this.state.selectedIndex]} orgCode={this.state.activeOrg} private={true} />
                  {console.log('showProjectDetail 3: ', this.state.showProjectDetail)}
                </View>
              ) : (
                <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>

                  {(this.state.showGrade) && (
                    <View key="gradeProject" style={[styles.calcColumn60,styles.padding20]}>
                      {(this.state.projects) && (
                        <View>
                          <Text style={[styles.headingText2]}>Feedback for {this.state.projects[this.state.selectedIndex].name}</Text>

                          <View style={styles.spacer} /><View style={styles.spacer} />

                          {this.state.projects[this.state.selectedIndex].grades.map((value, index) =>
                            <View key={value}>
                              <View style={[styles.row10]}>
                                {(value.isTransparent) ? (
                                  <View>
                                    <View style={styles.rowDirection}>
                                      <View style={[styles.width60,styles.headingText2,styles.ctaColor,styles.boldText]}>
                                        {(value.grade) ? (
                                          <Text style={[styles.standardText]}>{value.grade}</Text>
                                        ) : (
                                          <Text style={[styles.standardText]}>N/A</Text>
                                        )}
                                      </View>
                                      <View style={styles.calcColumn120}>
                                        <Text style={[styles.descriptionText2]}>{value.contributorFirstName} {value.contributorLastName}</Text>
                                        <Text style={[styles.headingText6]}>{value.feedback}</Text>
                                      </View>

                                    </View>
                                  </View>
                                ) : (
                                  <View style={styles.rowDirection}>
                                    <View style={[styles.width60,styles.headingText2]}>
                                      <View style={styles.halfSpacer} />
                                      <Image source={{ uri: confidentialityIcon}} style={[styles.square40,styles.contain]} />
                                    </View>
                                    <View style={styles.calcColumn120}>
                                      <Text style={[styles.standardText]}>This feedback has been marked confidential by {value.contributorFirstName} {value.contributorLastName}. They need to unlock this feedback for you to view.</Text>
                                    </View>

                                  </View>
                                )}
                              </View>

                              <View style={styles.spacer}/><View style={styles.spacer}/>
                              <View style={styles.horizontalLine} />

                            </View>
                          )}

                          <View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/>
                          <Text style={[styles.descriptionText3,styles.boldText,styles.ctaColor]}>Note: You may view feedback by clicking the feedback icon under each of your projects. The feedback icon will not be visible if you have not received feedback for that project.</Text>
                          <View style={styles.spacer}/><View style={styles.spacer}/>
                        </View>
                      )}

                      <View style={[styles.row20]}>
                       <TouchableOpacity style={[styles.btnPrimary,styles.ctaColor,styles.ctaBorder,styles.whiteBackground]} onPress={() => this.closeModal()}>Close View</TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {(this.state.showJobFunction) && (
                    <View key="showJobFunction" style={[styles.calcColumn60,styles.padding20]}>
                      <Text style={[styles.headingText2]}>Job Function</Text>
                      <View style={styles.spacer} />
                      <Text style={[styles.standardText]}>We define <Text style={[styles.boldText,styles.ctaColor]}>job functions</Text> as a category of work that requires similar skills. It can be thought of as synonymous with "departments" within a company. Functions can be the same across different industries. Examples of functions include sales, marketing, finance, engineering, and design.</Text>

                      <View style={[styles.row20]}>
                       <TouchableOpacity style={[styles.btnPrimary,styles.ctaColor,styles.ctaBorder,styles.whiteBackground]} onPress={() => this.closeModal()}>Close View</TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {(this.state.showIndustry) && (
                    <View key="showIndustry" style={[styles.calcColumn60,styles.padding20]}>
                      <Text style={[styles.headingText2]}>Industry</Text>
                      <View style={styles.spacer} />
                      <Text style={[styles.standardText]}>We define <Text style={[styles.boldText,styles.ctaColor]}>industry</Text> as a category of companies that are related based on their primary business activitiees. Companies are generally grouped by their sources of revenue. For example, Nike would fall under "Fashion & Apparel" and Netflix would fall under "Other Entertainment".</Text>

                      <View style={[styles.row20]}>
                       <TouchableOpacity style={[styles.btnPrimary,styles.ctaColor,styles.ctaBorder,styles.whiteBackground]} onPress={() => this.closeModal()}>Close View</TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {(this.state.skillTagsInfo) && (
                    <View key="showIndustry" style={[styles.calcColumn60,styles.padding20]}>
                      <Text style={[styles.headingText2]}>Skill Tags Info</Text>
                      <View style={styles.spacer} />
                      <Text style={[styles.standardText]}><Text style={[styles.boldText,styles.ctaColor]}>Skill Tags</Text> allow you to list the skills related to your experience separated by commas. For example, for design experience, you may want to tag wireframing, Adobe Photoshop, and flow chart. This allows the reviewer to better understand your skills and allows you to receive better recommendations.</Text>

                      <View style={[styles.row20]}>
                       <TouchableOpacity style={[styles.btnPrimary,styles.ctaColor,styles.ctaBorder,styles.whiteBackground]} onPress={() => this.closeModal()}>Close View</TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {(this.state.showPublicProfileExtentInfo) && (
                    <View key="showPublicProfileExtentInfo" style={[styles.flex1,styles.padding20]}>
                      <View style={[styles.rowDirection,styles.calcColumn80,styles.row10]}>
                        <View style={[styles.width30,styles.topPadding]}>
                          <TouchableOpacity onPress={() => this.closeModal()}>
                            <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                          </TouchableOpacity>
                        </View>

                        <View style={styles.calcColumn140}>
                          <Text style={[styles.headingText4,styles.centerText,styles.calcColumn140]}>Who Can See Your Profile?</Text>
                        </View>
                        <View style={[styles.width30,styles.height30]}>
                        </View>
                      </View>

                      <View style={styles.lightHorizontalLine} />

                      <View style={styles.spacer} /><View style={styles.spacer} />

                      <View style={[styles.row10]}>
                        <Text style={[styles.standardText]}><Text style={[styles.boldText,styles.ctaColor]}>Only Connections</Text> means that only those who you are connected with on Guided Compass can view the items you select as public.</Text>
                      </View>

                      <View style={[styles.row10]}>
                        <Text style={[styles.standardText]}><Text style={[styles.boldText,styles.ctaColor]}>Only Connections and Members</Text> means that only those who you are either connected with on Guided Compass or those who are part of the {this.state.orgName} community can view the items you select as public.</Text>
                      </View>

                      <View style={[styles.row10]}>
                        <Text style={[styles.standardText]}><Text style={[styles.boldText,styles.ctaColor]}>Public</Text> means that not only connections and the {this.state.orgName} community can view the items you select as public, others can view as well. Just share your public profile link with whomever you like. This also means that the Guided Compass team can share your public profile with employers.</Text>
                      </View>

                    </View>
                  )}

                  {(this.state.showSettings) && (
                    <View key="showIndustry" style={[styles.calcColumn60,styles.padding20]}>
                      <Text style={[styles.headingText2]}>Settings</Text>
                      <View style={styles.spacer} />

                      <View>
                        <EditSubscription />
                      </View>

                      <View>
                        <SwitchOrgs
                          emailId={this.state.emailId} activeOrg={this.state.activeOrg} myOrgs={this.state.myOrgs}
                          sharePartners={this.state.sharePartners} roleName={this.state.roleName}
                          academies={this.state.academies} academyCodes={this.state.academyCodes}
                          accountCode={this.state.accountCode}
                        />
                      </View>

                      <View style={[styles.row10]}>
                        <TouchableOpacity style={[styles.btnPrimary,styles.ctaColor,styles.ctaBorder,styles.whiteBackground]} onPress={() => signOut(
                          this.state.email, this.state.activeOrg, this.state.orgFocus,
                          this.state.accountCode, this.state.roleName, this.props.navigatioin
                        )}>Sign Out</TouchableOpacity>
                      </View>


                    </View>
                  )}

                  {(this.state.showBirthdate) && (
                    <View key="showIndustry" style={[styles.calcColumn60,styles.padding20]}>
                      <Text style={[styles.headingText2]}>Are you over 18?</Text>
                      <View style={styles.spacer} />
                      <Text style={[styles.standardText]}>Currently, you must be over 18 to set your profile to public.</Text>

                      <View style={[styles.row10]}>

                        {(Platform.OS === 'ios') ? (
                          <View style={[styles.rowDirection]}>
                            <View style={[styles.calcColumn180]}>
                              <Text style={[styles.standardText,styles.row10]}>Date of Birth</Text>
                            </View>
                            <View style={[styles.width120,styles.topPadding5]}>
                              <DateTimePicker
                                testID="dateOfBirth"
                                value={(this.state.dateOfBirth) ? convertStringToDate(this.state.dateOfBirth,'dateOnly') : new Date()}
                                mode={'date'}
                                is24Hour={true}
                                display="default"
                                onChange={(e, d) => this.formChangeHandler("dateOfBirth",d)}
                                minimumDate={new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate())}
                                maximumDate={new Date(new Date().getFullYear() - 12, new Date().getMonth(), new Date().getDate())}
                              />
                            </View>
                          </View>
                        ) : (
                          <View>
                            <View style={[styles.row5]}>
                              <Text style={[styles.standardText,styles.row10]}>Date of Birth{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                            </View>
                            <View>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Date of Birth', selectedIndex: null, selectedName: "dateOfBirth", selectedValue: this.state.dateOfBirth, minimumDate: new Date(new Date().getFullYear() - 100, new Date().getMonth(), new Date().getDate()), maximumDate: new Date(new Date().getFullYear() - 12, new Date().getMonth(), new Date().getDate()) })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.dateOfBirth) ? convertStringToDate(this.state.dateOfBirth,'dateOnly').toString() : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}
                      </View>

                      {(this.state.publicPreferencesErrorMessage) && <Text style={[styles.errorColor,styles.descriptionText2]}>{this.state.publicPreferencesErrorMessage}</Text>}

                      <View style={[styles.row20,styles.rowDirection]}>
                        <View style={styles.rightPadding}>
                          <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.whiteColor]} onPress={() => this.verifyLegalAge()}>Make Profile Public</TouchableOpacity>
                        </View>
                        <View>
                          <TouchableOpacity style={[styles.btnPrimary,styles.ctaColor,styles.ctaBorder,styles.whiteBackground]} onPress={() => this.closeModal()}>Close View</TouchableOpacity>
                        </View>


                      </View>
                    </View>
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
                        mode={'date'}
                        is24Hour={true}
                        display="default"
                        onChange={(e, d) => this.formChangeHandler(this.state.selectedName,d,e)}
                        minimumDate={this.state.minimumDate}
                        maximumDate={this.state.maximumDate}
                      />
                    </View>
                  )}

               </Modal>
              )}

          </ScrollView>
      )
    }
  }

}

export default EditProfileDetails;
