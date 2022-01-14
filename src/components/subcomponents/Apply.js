import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import DocumentPicker from 'react-native-document-picker';

const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';
const xIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/x-icon.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const resumeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/resume-icon-dark.png';
const coverLetterIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/cover-letter-icon-dark.png';
const transcriptIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/transcript-icon.png';
const letterOfRecIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/letter-of-rec-icon.png';
const identificationIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/identification-icon.png';
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png';
const abilitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/abilities-icon-dark.png';
const endorsementIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/endorsement-icon-dark.png';
const assessmentsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/assessments-icon-dark.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';

import SubEditProfileDetails from './EditProfileDetails';
import SubAssessments from './Assessments';
import SubEndorsements from './Endorsements';
import SubPicker from '../common/SubPicker';

class Apply extends Component {
  constructor(props) {
    super(props)
    this.state = {
      questionIndex: 0,
      responses: [],
      tpaResponses: [],
      dbResponses: [],
      rankingAnswerChoices: [],

      allowMultipleFiles: true,

      endorsements: [],
      projects: [],
      experience: [],
      extras: [],
      skills: [],
      requiredBasicValues: ['firstName','lastName'],
      requiredCareerAssessments: ['interests','skills'],

      isEditingProjectsArray: []
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.saveFile = this.saveFile.bind(this)
    this.actionTapped = this.actionTapped.bind(this)
    this.apply = this.apply.bind(this)
    this.renderTasks = this.renderTasks.bind(this)

    this.optionClicked = this.optionClicked.bind(this)
    this.switchWorkspaces = this.switchWorkspaces.bind(this)

    this.signUp = this.signUp.bind(this)
    this.signIn = this.signIn.bind(this)
    this.signOut = this.signOut.bind(this)

    this.renderQuestions = this.renderQuestions.bind(this)
    this.renderAnswerChoices = this.renderAnswerChoices.bind(this)
    this.renderRankingChoices = this.renderRankingChoices.bind(this)
    this.onDragEnd = this.onDragEnd.bind(this)
    this.expandSection = this.expandSection.bind(this)
    this.renderExpandedTask = this.renderExpandedTask.bind(this)

    this.passData = this.passData.bind(this)

    this.checkSectionCompleteness = this.checkSectionCompleteness.bind(this)
    this.closeModal = this.closeModal.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ')

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode || this.props.roleName !== prevProps.roleName) {
      this.retrieveData()
    } else if (this.props.selectedPosting && !prevProps.selectedPosting) {
      this.retrieveData()
    } else if (this.props.passedTasks && !prevProps.passedTasks) {
      this.retrieveData()
    } else if (this.props.customAssessmentResponses && !prevProps.customAssessmentResponses) {
      this.retrieveData()
    } else if (this.props.caQuestions && !prevProps.caQuestions) {
      this.retrieveData()
    } else if (this.props.application && !prevProps.application) {
      // this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      // console.log('this is causing the error')
      const emailId = await AsyncStorage.getItem('email')
      let email = emailId
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

      let selectedPosting = this.props.selectedPosting
      let passedTasks = this.props.passedTasks
      let customAssessmentResponses = this.props.customAssessmentResponses
      let caQuestions = this.props.caQuestions
      let application = this.props.application
      const pageSource = this.props.pageSource
      // console.log('we got the selectedPosting??? _________________!!!!', selectedPosting)
      let tasks = []

      if (passedTasks) {
        tasks = passedTasks
        this.checkCompleteness(tasks)
      } else {

        if (selectedPosting) {
          if (selectedPosting.appComponents && selectedPosting.appComponents.length > 0) {
            tasks = []

            for (let i = 1; i <= selectedPosting.appComponents.length; i++) {
              console.log('show component: ', selectedPosting.appComponents[i - 1])
              if (selectedPosting.appComponents[i - 1].name === 'Basic Profile Info' && selectedPosting.appComponents[i - 1].include) {
                tasks.push({ shorthand: 'basicInfo', name: 'Confirm Basic Profile Info', icon: profileIconDark, action: 'Import', message: '', isCompleted: false, required: selectedPosting.appComponents[i - 1].required })
              }
              if (selectedPosting.appComponents[i - 1].name === 'Profile Details' && selectedPosting.appComponents[i - 1].include) {
                tasks.push({ shorthand: 'profileDetails', name: 'Confirm Profile Details', icon: opportunitiesIconDark, action: 'Import', message: '', isCompleted: false, required: selectedPosting.appComponents[i - 1].required })
              }
              if (selectedPosting.appComponents[i - 1].name === 'Resume' && selectedPosting.appComponents[i - 1].include) {
                tasks.push({ shorthand: 'resume', name: 'Upload Resume', icon: resumeIconDark, action: 'Upload', message: '', isCompleted: false, required: selectedPosting.appComponents[i - 1].required })
              }
              if (selectedPosting.appComponents[i - 1].name === 'Cover Letter' && selectedPosting.appComponents[i - 1].include) {
                tasks.push({ shorthand: 'coverLetter', name: "Upload Cover Letter", icon: coverLetterIconDark, action: 'Upload', message: '', isCompleted: false, required: selectedPosting.appComponents[i - 1].required })
              }
              if (selectedPosting.appComponents[i - 1].name === 'Academic Transcript' && selectedPosting.appComponents[i - 1].include) {
                tasks.push({ shorthand: 'transcript', name: "Upload Transcript", icon: transcriptIcon, action: 'Upload', message: '', isCompleted: false, required: selectedPosting.appComponents[i - 1].required})
              }
              if (selectedPosting.appComponents[i - 1].name === 'Letter of Recommendation' && selectedPosting.appComponents[i - 1].include) {
                tasks.push({ shorthand: 'letterOfRecommendation', name: "Upload Letter of Recommendation", icon: letterOfRecIcon, action: 'Upload', message: '', isCompleted: false, required: selectedPosting.appComponents[i - 1].required })
              }
              if (selectedPosting.appComponents[i - 1].name === 'Identification' && selectedPosting.appComponents[i - 1].include) {
                tasks.push({ shorthand: 'identification', name: "Upload Driver's License or Student ID", icon: identificationIcon, action: 'Upload', message: '', isCompleted: false, required: false})
              }

              // if (selectedPosting.appComponents[i - 1].name === 'Portfolio Link' && selectedPosting.appComponents[i - 1].include) {
              //   tasks.push({ shorthand: 'portfolio', name: 'Add Portfolio Website URL', icon: opportunitiesIconDark, action: 'Import', message: '', isCompleted: false, required: selectedPosting.appComponents[i - 1].required })
              // }
              if (selectedPosting.appComponents[i - 1].name === 'Career Assessments' && selectedPosting.appComponents[i - 1].include) {
                tasks.push({ shorthand: 'careerAssessments', name: 'Take Career Assessments', icon: abilitiesIconDark, message: '', action: 'Import', isCompleted: false, required: selectedPosting.appComponents[i - 1].required })
              }

              if (selectedPosting.appComponents[i - 1].name === 'Endorsements' && selectedPosting.appComponents[i - 1].include) {
                tasks.push({ shorthand: 'endorsements', name: 'Confirm Endorsements', icon: endorsementIconDark, action: 'Import', message: 'Endorsements imported, but you can always request more!', isCompleted: true, required: selectedPosting.appComponents[i - 1].required })
              }

              if (selectedPosting.appComponents[i - 1].name === 'Custom Assessments' && selectedPosting.appComponents[i - 1].include) {
                // taken care of later
              }
            }
          // } else if (selectedPosting.useAppComponents) {
          //   tasks = []
          //   // console.log('show appComponents: ', selectedPosting.applicationComponents)
          //   if (selectedPosting.applicationComponents && selectedPosting.applicationComponents.includes('basicInfo')) {
          //     console.log('yo')
          //     tasks.push({ shorthand: 'basicInfo', name: 'Import Basic Info from Profile', icon: profileIconDark, action: 'Import', message: '', isCompleted: false, required: true })
          //   }
          } else {
            tasks.push({ shorthand: 'basicInfo', name: 'Import Basic Info from Profile', icon: profileIconDark, action: 'Import', message: '', isCompleted: false, required: true })

            if (activeOrg === 'exp' && selectedPosting.postType === 'Scholarship') {
              // skip
            } else {
              tasks.push({ shorthand: 'resume', name: 'Upload Resume', icon: resumeIconDark, action: 'Upload', message: '', isCompleted: false, required: true })
            }

            let applicationComponents = ['portfolioLink', 'projects','coverLetter','careerAssessments','customAssessment']

            if (activeOrg === 'exp' && selectedPosting.postType === 'Internship') {
              tasks.push({ shorthand: 'coverLetter', name: "Upload Cover Letter", icon: coverLetterIconDark, action: 'Upload', message: '', isCompleted: false, required: true })
            }

            // if (activeOrg !== 'c2c' && activeOrg !== 'exp') {
            //   if (applicationComponents.includes('portfolioLink')) {
            //     tasks.push({ shorthand: 'portfolio', name: 'Add Portfolio Website URL', icon: opportunitiesIconDark, action: 'Import', message: '', isCompleted: false, required: false })
            //   }
            // }

            if (activeOrg !== 'exp') {
              if (applicationComponents.includes('projects')) {
                tasks.push({ shorthand: 'profileDetails', name: 'Confirm Profile Details', icon: opportunitiesIconDark, action: 'Import', message: '', isCompleted: true, required: true })
              }

              if (applicationComponents.includes('careerAssessments')) {
                if (activeOrg === 'exp') {
                  tasks.push({ shorthand: 'careerAssessments', name: 'Take Career Assessments', icon: abilitiesIconDark, message: '', action: 'Import', isCompleted: false, required: false })
                } else {
                  tasks.push({ shorthand: 'careerAssessments', name: 'Take Career Assessments', icon: abilitiesIconDark, message: '', action: 'Import', isCompleted: false, required: true })
                }
              }

              tasks.push({ shorthand: 'endorsements', name: 'Confirm Endorsements', icon: endorsementIconDark, action: 'Import', message: '', isCompleted: false, required: false })
            }

            if (activeOrg === 'exp' && selectedPosting.postType === 'Scholarship') {
              tasks.push({ shorthand: 'transcript', name: "Upload Transcript", icon: transcriptIcon, action: 'Upload', message: '', isCompleted: false, required: false})
              tasks.push({ shorthand: 'letterOfRecommendation', name: "Upload Letter of Recommendation", icon: letterOfRecIcon, action: 'Upload', message: '', isCompleted: false, required: false })
              // tasks.push({ shorthand: 'identification', name: "Upload Driver's License or Student ID", action: 'Upload', message: '', isCompleted: false, required: false})
            }
          }

          if (selectedPosting.customAssessmentId && selectedPosting.customAssessmentId !== '') {
            let actionTitle = "Start"
            let isCompleted = false
            let message = ''
            if (application) {
              if (application.customAssessmentResults) {
                actionTitle = "Edit"
                isCompleted = true
                message = 'Application form completed!'
              } else if (application.newCustomAssessmentResults) {
                actionTitle = "Edit"
                isCompleted = true
                message = 'Application form completed!'
              }
            }
            // console.log('is completed? ', application.newCustomAssessmentResults, customAssessmentResponses)

            tasks.push({ shorthand: 'customAssessment', name: 'Complete Application Form', icon: assessmentsIconDark, action: actionTitle, message, isCompleted, required: true })
          }
        }
      }

      const profilePath = "https://www.guidedcompass.com/app/profile/" + username

      console.log('show appId ', application)
      let newCustomAssessmentResponses = null
      if (application) {
        if (application.customAssessmentResults && !customAssessmentResponses) {
          console.log('pass application customAssessmentResponses')
          customAssessmentResponses = application.customAssessmentResults
        } else if (application.newCustomAssessmentResults && !customAssessmentResponses) {
          newCustomAssessmentResponses = application.newCustomAssessmentResults
        }
      }

      let signedIn = false
      if (email) {
        signedIn = true
      }

      let responses = []
      if (customAssessmentResponses) {
        responses = customAssessmentResponses
      }

      let tpaResponses = []
      let dbResponses = []
      if (application) {
        if (application.thirdPartyAssessmentResponses) {
          for (let i = 1; i <= application.thirdPartyAssessmentResponses.length; i++) {
            tpaResponses.push(application.thirdPartyAssessmentResponses[i - 1].answer)
          }
        }
        if (application.dealBreakerResponses) {
          for (let i = 1; i <= application.dealBreakerResponses.length; i++) {
            dbResponses.push(application.dealBreakerResponses[i - 1].answer)
          }
        }
      }

      this.setState({ activeOrg, emailId: email, cuFirstName, cuLastName, username, orgFocus, selectedPosting, tasks, profilePath,
        customAssessmentResponses, newCustomAssessmentResponses, responses, caQuestions, application, pageSource, signedIn,
        tpaResponses, dbResponses
      })

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
            { category: 'basic', name: 'Date of Birth', type: 'Date', field: 'dateOfBirth', placeholder: 'e.g. 04/13/98', answer: defaultDate },
            { category: 'basic', name: 'Gender', type: 'Multiple Choice', field: 'gender', options: genderOptions },
            { category: 'basic', name: 'Race', type: 'Multiple Choice', field: 'race', options: raceOptions },
            { category: 'basic', name: 'Home Address', type: 'Short Answer', field: 'homeAddress', placeholder: 'e.g. 111 Candy Cane Lane Los Angeles, CA' },
            { category: 'basic', name: 'Phone Number', type: 'Short Answer', field: 'phoneNumber', placeholder: 'e.g. (323) 299-2991' },
            { category: 'diversity', name: 'Number of Members in Household', type: 'Multiple Choice', field: 'numberOfMembers', options: basicCountOptions },
            { category: 'diversity', name: 'Estimated Household Income', type: 'Multiple Choice', field: 'householdIncome', options: lowIncomeOptions },
            { category: 'diversity', name: 'Have you ever been a foster youth?', type: 'Multiple Choice', field: 'fosterYouth', options: fosterYouthOptions },
            { category: 'diversity', name: 'Are you currently or formerly homeless?', type: 'Multiple Choice', field: 'homeless', options: homelessOptions },
            { category: 'diversity', name: 'Were you previously incarcerated?', type: 'Multiple Choice', field: 'incarcerated', options: incarceratedOptions },
            { category: 'diversity', name: 'Designate all that apply.', type: 'Multiple Answer', field: 'adversity', options: ['LGBQIA','ADA','First Generation Immigrant','First Generation College Student','Low Income','None'] },
            { category: 'referral', name: 'Name of person who recommended you', type: 'Short Answer', field: 'referrerName', placeholder: 'e.g. John Smith' },
            { category: 'referral', name: 'Email of person who recommended you', type: 'Short Answer', field: 'referrerEmail', placeholder: 'e.g. johnsmith@love.org' },
            { category: 'referral', name: 'Name of organization that referred you', type: 'Short Answer', field: 'referrerOrg', options: [], placeholder: 'e.g. Franklin High' },
          ]

          this.setState({ questions })

        } else {
          console.log('no work options data found', response.data.message)

        }
      }).catch((error) => {
          console.log('query for work options did not work', error);
      })

      if (selectedPosting) {
        // postingOrgCode, postingOrgName, postingOrgContactEmail,
        if (selectedPosting.orgCode) {
          Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: selectedPosting.orgCode } })
          .then((response) => {
            console.log('Org info query attempted', response.data);

              if (response.data.success) {
                console.log('org info query worked for post')

                const postingOrgCode = response.data.orgInfo.orgCode
                const postingOrgName = response.data.orgInfo.orgName
                const postingOrgContactEmail = response.data.orgInfo.contactEmail
                const placementPartners = response.data.orgInfo.placementPartners

                this.setState({ postingOrgCode, postingOrgName, postingOrgContactEmail, placementPartners });

              } else {
                console.log('org info query did not work', response.data.message)
              }

          }).catch((error) => {
              console.log('Org info query did not work for some reason', error);
          });
        }

        // console.log('we going in?', selectedPosting.customAssessmentId)
        if (selectedPosting.customAssessmentId && selectedPosting.customAssessmentId !== '') {

          Axios.get('https://www.guidedcompass.com/api/customassessments/byid', { params: { _id: selectedPosting.customAssessmentId } })
          .then((response) => {
            console.log('Query custom assessment', response.data);

              if (response.data.success) {
                console.log('successfully retrieved custom assessment')

                const customAssessment = response.data.assessment
                const isCustomAssessment = true
                if (!caQuestions && customAssessment) {
                  caQuestions = []
                  for (let i = 1; i <= customAssessment.questions.length; i++) {
                    if (customAssessment.questions[i - 1]) {
                      caQuestions.push(customAssessment.questions[i - 1])
                    }
                  }
                }
                // console.log('log caQuestions: ', caQuestions)

                this.setState({ isCustomAssessment, customAssessment, caQuestions })

              } else {
                console.log('no assessment data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Assessment query did not work', error);
          });
        }
      }

      if (email) {

        const self = this

        function pullExperience() {
          console.log('pullExperience called')

          Axios.get('https://www.guidedcompass.com/api/experience', { params: { emailId: email } })
          .then((response) => {
            console.log('Experience query attempted', response.data);

              if (response.data.success) {
                console.log('successfully retrieved experience')

                if (response.data.experience) {

                  const experience = response.data.experience
                  if (experience.length > 0) {
                    console.log('the array is greater than 0')

                    const isExperience = true

                    tasks = self.state.tasks
                    for (let i = 1; i <= tasks.length; i++) {
                      if (isExperience && tasks[i - 1].shorthand === 'profileDetails') {
                        tasks[i - 1]['message'] = 'Imported projects, experience, extracurriculars, and awards!'
                        tasks[i - 1]['isCompleted'] = true
                      }
                    }
                    self.setState({
                      experience, isExperience
                    }, () => {
                      self.checkCompleteness(tasks)
                    })
                  }
                }

              } else {
                console.log('no experience data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Experience query did not work', error);
          });
        }

        function pullProjects() {
          console.log('pullProjects called')

          Axios.get('https://www.guidedcompass.com/api/projects', { params: { emailId: email } })
          .then((response) => {
            console.log('Projects query attempted', response.data);

              if (response.data.success) {
                console.log('successfully retrieved projects')

                if (response.data.projects) {

                  const projects = response.data.projects
                  if (projects.length > 0) {
                    console.log('the array is greater than 0')

                    const isProjects = true

                    tasks = self.state.tasks
                    for (let i = 1; i <= tasks.length; i++) {
                      if (isProjects && tasks[i - 1].shorthand === 'profileDetails') {
                        tasks[i - 1]['message'] = 'Imported projects, experience, extracurriculars, and awards!'
                        tasks[i - 1]['isCompleted'] = true
                      }
                    }
                    self.setState({
                      projects, isProjects
                    }, () => {
                      self.checkCompleteness(tasks)
                    })
                  }
                }

                pullExperience()

              } else {
                console.log('no project data found', response.data.message)
                pullExperience()
              }

          }).catch((error) => {
              console.log('Project query did not work', error);
          });
        }

        function pullEndorsements() {
          console.log('pullEndorsements called')

          Axios.get('https://www.guidedcompass.com/api/story', { params: { emailId: email } })
          .then((response) => {
            console.log('Endorsements query attempted', response.data);

              if (response.data.success) {
                console.log('successfully retrieved endorsements')

                if (response.data.stories.length > 0) {
                  console.log('the array is greater than 0')

                  let isEndorsements = false
                  let endorsements = []
                  for (let i = 1; i <= response.data.stories.length; i++) {
                    if (response.data.stories[i - 1].recipientEmail === email) {
                      isEndorsements = true
                      endorsements.push(response.data.stories[i - 1])
                    }
                  }

                  tasks = self.state.tasks
                  for (let i = 1; i <= tasks.length; i++) {
                    if (isEndorsements && tasks[i - 1].shorthand === 'endorsements') {
                      tasks[i - 1]['message'] = 'Imported endorsements!'
                      tasks[i - 1]['isCompleted'] = true
                    }
                  }
                  self.setState({
                    isEndorsements, endorsements
                  }, () => {
                    self.checkCompleteness(tasks)
                  })
                }

                pullProjects()

              } else {
                console.log('no endorsements data found', response.data.message)
                pullProjects()
              }

          }).catch((error) => {
              console.log('Endorsements query did not work', error);
          });
        }

        function pullAssessmentResults() {
          console.log('pullAssessmentResults called')

          Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId: email } })
          .then((response) => {
              console.log('query for assessment results worked');

              if (response.data.success) {

                console.log('actual assessment results', response.data)

                let wpData = null
                let isWPData = false
                if (response.data.results.workPreferenceAnswers) {
                  if (response.data.results.workPreferenceAnswers.length !== 0) {
                    wpData = response.data.results.workPreferenceAnswers
                    isWPData = true
                  }
                }

                let isInterestsData = false
                let interestResults = null
                if (response.data.results.interestScores) {
                  if (response.data.results.interestScores.length !== 0) {
                    isInterestsData = true
                    interestResults = response.data.results.interestScores
                  }
                }

                let isSkillsData = false
                let skillResults = null
                let skillAnswers = ''
                let newSkillAnswers = []
                if (response.data.results.skillsScores) {

                  if (response.data.results.skillsScores.length !== 0) {
                    isSkillsData = true
                    skillResults = response.data.results.skillsScores
                    skillAnswers = response.data.results.skillsAnswers
                    newSkillAnswers = response.data.results.newSkillAnswers
                  }
                }

                let isPersonalityData = false
                let personalityResults = null
                if (response.data.results.personalityScores) {
                  isPersonalityData = true
                  personalityResults = response.data.results.personalityScores
                }

                let isValuesData = false
                let topGravitateValues = []
                let topEmployerValues = []
                let valuesResults = null
                if (response.data.results.topGravitateValues && response.data.results.topEmployerValues) {
                  isValuesData = true
                  topGravitateValues = response.data.results.topGravitateValues
                  topEmployerValues = response.data.results.topEmployerValues
                  valuesResults = { topGravitateValues, topEmployerValues }
                }

                const assessments = {
                  workPreferences: wpData, interests: interestResults,
                  skills: newSkillAnswers, personality: personalityResults,
                  values: valuesResults
                }

                let requiredCareerAssessments = self.state.requiredCareerAssessments

                let ids = null
                if (selectedPosting.tracks) {
                  if (selectedPosting.tracks && selectedPosting.tracks.length > 0) {
                    console.log('track posting')
                    ids = []
                    for (let i = 1; i <= selectedPosting.tracks.length; i++) {
                      if (selectedPosting.tracks[i - 1] && selectedPosting.tracks[i - 1].benchmark) {
                        ids.push(selectedPosting.tracks[i - 1].benchmark._id)
                      }
                    }
                  }
                }

                Axios.get('https://www.guidedcompass.com/api/benchmarks/byid', { params: { _id: selectedPosting.benchmarkId, ids } })
                .then((response3) => {
                  console.log('Benchmark query attempted in subassessments', response3.data);

                  if (response3.data.success) {
                    console.log('benchmark query worked')

                    if (response3.data.benchmark && response3.data.benchmark.skills && response3.data.benchmark.skills.length > 0) {

                      const skillQuestions = response3.data.benchmark.skills
                      self.setState({ skillQuestions })

                      const isCareerAssessments = self.checkSectionCompleteness('assessment', assessments, requiredCareerAssessments, skillQuestions)

                      tasks = self.state.tasks
                      for (let i = 1; i <= tasks.length; i++) {
                        if (isCareerAssessments && tasks[i - 1].shorthand === 'careerAssessments') {
                          tasks[i - 1]['message'] = 'Career assessments were completed and imported!'
                          tasks[i - 1]['isCompleted'] = true
                        }
                      }

                      self.setState({ isWPData, isInterestsData, isSkillsData, isPersonalityData, isValuesData, resultsId: response.data.results._id,
                        wpData, interestResults, skillAnswers, newSkillAnswers, skillResults, personalityResults, isCareerAssessments,
                        valuesResults, topGravitateValues, topEmployerValues
                      }, () => {
                        self.checkCompleteness(tasks)
                      });

                      pullEndorsements()

                    } else if (response3.data.benchmarks) {
                      console.log('multiple benchmarks', response3.data.benchmarks)

                      let skillQuestions = []
                      let rawSkills = []
                      // let skillQuestions = []
                      for (let i = 1; i <= response3.data.benchmarks.length; i++) {
                        if (response3.data.benchmarks[i - 1] && response3.data.benchmarks[i - 1].skills) {

                          let tempSkills = response3.data.benchmarks[i - 1].skills
                          if (tempSkills && tempSkills.length > 0) {
                            // console.log('inners 2')
                            for (let j = 1; j <= tempSkills.length; j++) {
                              if (!rawSkills.includes(tempSkills[j - 1].title)) {
                               skillQuestions.push({
                                 name: tempSkills[j - 1].title, skillType: tempSkills[j - 1].skillType,
                                 benchmarkTitle: response3.data.benchmarks[i - 1].title, benchmarkFunction: response3.data.benchmarks[i - 1].jobFunction,
                                 score: tempSkills[j - 1].score, weight: tempSkills[j - 1].weight
                               })
                               rawSkills.push(tempSkills[j - 1].title)
                              } else {
                                console.log('not include', tempSkills[j - 1].title)
                              }
                            }
                          }
                        }
                      }

                      self.setState({ skillQuestions })

                      const isCareerAssessments = self.checkSectionCompleteness('assessment', assessments, requiredCareerAssessments, skillQuestions, true)
                      // console.log('is c: ', isCareerAssessments, assessments, requiredCareerAssessments, skillQuestions)

                      tasks = self.state.tasks
                      for (let i = 1; i <= tasks.length; i++) {
                        if (isCareerAssessments && tasks[i - 1].shorthand === 'careerAssessments') {
                          tasks[i - 1]['message'] = 'Career assessments were completed and imported!'
                          tasks[i - 1]['isCompleted'] = true
                        }
                      }

                      self.setState({ isWPData, isInterestsData, isSkillsData, isPersonalityData, isValuesData, resultsId: response.data.results._id,
                        wpData, interestResults, skillAnswers, newSkillAnswers, skillResults, personalityResults, isCareerAssessments,
                        valuesResults, topGravitateValues, topEmployerValues
                      }, () => {
                        self.checkCompleteness(tasks)
                      });

                      pullEndorsements()

                    }

                  } else {
                    console.log('benchmark query did not work', response3.data.message)

                    const isCareerAssessments = self.checkSectionCompleteness('assessment', assessments, requiredCareerAssessments)

                    tasks = self.state.tasks
                    for (let i = 1; i <= tasks.length; i++) {
                      if (isCareerAssessments && tasks[i - 1].shorthand === 'careerAssessments') {
                        tasks[i - 1]['message'] = 'Career assessments were completed and imported!'
                        tasks[i - 1]['isCompleted'] = true
                      }
                    }

                    self.setState({ isWPData, isInterestsData, isSkillsData, isPersonalityData, isValuesData, resultsId: response.data.results._id,
                      wpData, interestResults, skillAnswers, newSkillAnswers, skillResults, personalityResults, isCareerAssessments,
                      valuesResults, topGravitateValues, topEmployerValues
                    }, () => {
                      self.checkCompleteness(tasks)
                    });

                    pullEndorsements()
                  }

                }).catch((error) => {
                    console.log('Benchmark query did not work for some reason', error);

                    const isCareerAssessments = self.checkSectionCompleteness('assessment', assessments, requiredCareerAssessments)

                    tasks = self.state.tasks
                    for (let i = 1; i <= tasks.length; i++) {
                      if (isCareerAssessments && tasks[i - 1].shorthand === 'careerAssessments') {
                        tasks[i - 1]['message'] = 'Career assessments were completed and imported!'
                        tasks[i - 1]['isCompleted'] = true
                      }
                    }

                    self.setState({ isWPData, isInterestsData, isSkillsData, isPersonalityData, isValuesData, resultsId: response.data.results._id,
                      wpData, interestResults, skillAnswers, newSkillAnswers, skillResults, personalityResults, isCareerAssessments,
                      valuesResults, topGravitateValues, topEmployerValues
                    }, () => {
                      self.checkCompleteness(tasks)
                    });

                    pullEndorsements()
                });

              } else {
                console.log('error response for assessments', response.data)
                self.setState({ resultsErrorMessage: response.data.message })
                pullEndorsements()
              }

          }).catch((error) => {
              console.log('query for assessment results did not work', error);
          })
        }

        const fetchDetailsURL = 'https://www.guidedcompass.com/api/users/profile/details/' + email
        Axios.get(fetchDetailsURL)
        .then((response) => {
          if (response.data) {

            let firstName = ''
            if (response.data.user.firstName) {
              firstName = response.data.user.firstName
            }

            let lastName = ''
            if (response.data.user.lastName) {
              lastName = response.data.user.lastName
            }

            let phoneNumber = ''
            if (response.data.user.phoneNumber) {
              phoneNumber = response.data.user.phoneNumber
            }

            let education = null
            if (response.data.user.education) {
              education = response.data.user.education
            }

            let schoolName = ''
            if (response.data.user.school) {
              schoolName = response.data.user.school
            }

            let degree = ''
            if (response.data.user.degree) {
              degree = response.data.user.degree
            }

            let major = ''
            if (response.data.user.major) {
              major = response.data.user.major
            }

            let gradYear = ''
            if (response.data.user.gradYear) {
              gradYear = response.data.user.gradYear
            }

            let zipcode = ''
            if (response.data.user.zipcode) {
              zipcode = response.data.user.zipcode
            }
            // console.log('show degree and zipcode: ', degree, zipcode)

            const dateOfBirth = response.data.user.dateOfBirth
            const pathway = response.data.user.pathway
            const race = response.data.user.race
            const gender = response.data.user.gender
            const veteran = response.data.user.veteran
            const workAuthorization = response.data.user.workAuthorization
            const numberOfMembers = response.data.user.numberOfMembers
            const householdIncome = response.data.user.householdIncome
            const fosterYouth = response.data.user.fosterYouth
            const homeless = response.data.user.homeless
            const incarcerated = response.data.user.incarcerated
            const adversityList = response.data.user.adversityList

            let basicInfo = { firstName, lastName, schoolName, gradYear }
            if (education) {
              basicInfo = { firstName, lastName, schoolName, gradYear }
            }

            let requiredBasicValues = this.state.requiredBasicValues

            const isBasicInfo = this.checkSectionCompleteness('basicInfo', basicInfo, requiredBasicValues)

            let isPoliticalInfo = false
            let politicalAlignment = ''
            let stateRegistration = ''
            let currentCongressionalDistrict = ''
            let hometown = ''
            let homeCongressionalDistrict = ''
            let dacaStatus = ''

            if (activeOrg === 'c2c') {
              if (response.data.user.politicalAlignment) {
                politicalAlignment = response.data.user.politicalAlignment
              }

              if (response.data.user.stateRegistration) {
                stateRegistration = response.data.user.stateRegistration
              }

              if (response.data.user.currentCongressionalDistrict) {
                currentCongressionalDistrict = response.data.user.currentCongressionalDistrict
              }

              if (response.data.user.hometown) {
                hometown = response.data.user.hometown
              }

              if (response.data.user.homeCongressionalDistrict) {
                homeCongressionalDistrict = response.data.user.homeCongressionalDistrict
              }

              if (response.data.user.dacaStatus) {
                dacaStatus = response.data.user.dacaStatus
              }

              if (politicalAlignment !== '' && stateRegistration !== '' && currentCongressionalDistrict !== '' && hometown !== ''&& homeCongressionalDistrict !== '' && dacaStatus !== '') {
                isPoliticalInfo = true
              }
            }

            let isResume = false
            let resumeURL = ''
            let resumeName = ''
            let resumes  = response.data.user.resumes
            let resumeNames = []
            if ((response.data.user.resumeURL && response.data.user.resumeURL !== '') || (response.data.user.resumes && response.data.user.resumes.length > 0)) {
              isResume = true
            }
            console.log('yeah resume?', isResume)

            let isCoverLetter = false
            let coverLetterURL = ''
            if (response.data.user.coverLetterURL && response.data.user.coverLetterURL.split("%7C")[2]) {
              isCoverLetter = true
            }

            let isLOR = false
            let letterOfRecommendationURL = ''
            if (response.data.user.letterOfRecommendationURL && response.data.user.letterOfRecommendationURL.split("%7C")[2]) {
              isLOR = true
            }

            let isID = false
            let identificationURL = ''
            if (response.data.user.identificationURL && response.data.user.identificationURL.split("%7C")[2]) {
              isID = true
            }

            let isTranscript = false
            let transcriptURL = ''
            if (response.data.user.transcriptURL && response.data.user.transcriptURL.split("%7C")[2]) {
              isTranscript = true
            }

            let linkedInURL = ''
            if (response.data.user.linkedInURL) {
              linkedInURL = response.data.user.linkedInURL
            }

            let isPortfolio = false
            let customWebsiteURL = ''
            if (response.data.user.customWebsiteURL) {
              isPortfolio = true
              customWebsiteURL = response.data.user.customWebsiteURL
            }

            const videoResumeURL = response.data.user.videoResumeURL

            const pictureURL = response.data.user.pictureURL

            tasks = this.state.tasks
            for (let i = 1; i <= tasks.length; i++) {
              if (isBasicInfo && tasks[i - 1].shorthand === 'basicInfo') {
                tasks[i - 1]['message'] = 'Basic info completed!'
                tasks[i - 1]['isCompleted'] = true
              }
              if (isResume && tasks[i - 1].shorthand === 'resume') {

                resumeURL = response.data.user.resumeURL
                if (resumeURL.split("%7C")[2]) {
                  resumeName = resumeURL.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
                } else {
                  resumeName = 'Resume uploaded'
                }

                if (resumes && resumes.length > 0) {
                  for (let i = 1; i <= resumes.length; i++) {
                    if (resumes[i - 1].split("%7C")[2]) {
                      resumeNames.push(resumes[i - 1].split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+"))
                    } else {
                      resumeNames.push('Resume File #' + i)
                    }
                  }
                  resumeURL = resumes[resumes.length - 1]
                  resumeName = resumeNames[resumeNames.length - 1]
                } else {
                  if (resumeURL) {
                    resumes.push(resumeURL)
                    resumeNames.push(resumeName)
                  }
                }

                tasks[i - 1]['message'] = resumeName
                tasks[i - 1]['isCompleted'] = true
                console.log('show me resumename: ', resumeName)
              }
              if (isCoverLetter && tasks[i - 1].shorthand === 'coverLetter') {
                coverLetterURL = response.data.user.coverLetterURL
                let coverLetterName = response.data.user.coverLetterURL.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
                tasks[i - 1]['message'] = coverLetterName
                tasks[i - 1]['isCompleted'] = true
              }
              if (isLOR && tasks[i - 1].shorthand === 'letterOfRecommendation') {
                letterOfRecommendationURL = response.data.user.letterOfRecommendationURL
                let lorName = response.data.user.letterOfRecommendationURL.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
                tasks[i - 1]['message'] = lorName
                tasks[i - 1]['isCompleted'] = true
              }
              if (isID && tasks[i - 1].shorthand === 'identification') {
                identificationURL = response.data.user.identificationURL
                let idName = response.data.user.identificationURL.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
                tasks[i - 1]['message'] = idName
                tasks[i - 1]['isCompleted'] = true
              }
              if (isTranscript && tasks[i - 1].shorthand === 'transcript') {
                transcriptURL = response.data.user.transcriptURL
                let transcriptName = response.data.user.transcriptURL.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
                tasks[i - 1]['message'] = transcriptName
                tasks[i - 1]['isCompleted'] = true
              }
            }

            const publicProfile = response.data.user.publicProfile
            const publicProfileExtent = response.data.user.publicProfileExtent

            this.setState({ isBasicInfo, isPoliticalInfo, isResume, resumeURL, resumeName, resumes, resumeNames,
              coverLetterURL, letterOfRecommendationURL, identificationURL,
              isTranscript, transcriptURL,
              tasks, firstName, lastName, phoneNumber,
              education, schoolName, major, degree, gradYear, linkedInURL, customWebsiteURL, videoResumeURL, isPortfolio, pictureURL, zipcode,
              dateOfBirth, pathway, race, gender, veteran, workAuthorization,
              numberOfMembers, householdIncome, fosterYouth, homeless, incarcerated, adversityList,
              politicalAlignment, stateRegistration, currentCongressionalDistrict, hometown, homeCongressionalDistrict,
              dacaStatus,
              publicProfile, publicProfileExtent
            }, () => {
              this.checkCompleteness(tasks)
            })

            // if existing application, load info from that
            if (application && application.firstName && application.email) {
              console.log('update everything but custom assessment results: ', application)

              if (resumeURL) {
                resumeURL = application.resumeURL
                if (resumeURL.split("%7C")[2]) {
                  resumeName = resumeURL.split("%7C")[2].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
                } else {
                  resumeName = 'Resume uploaded'
                }
                for (let i = 1; i <= tasks.length; i++) {
                  if (isResume && tasks[i - 1].shorthand === 'resume') {
                    tasks[i - 1]['message'] = resumeName
                    tasks[i - 1]['isCompleted'] = true
                  }
                }

                this.setState({
                  resumeURL, resumeName, tasks
                })
              }
            }

            if (selectedPosting) {
              Axios.get('https://www.guidedcompass.com/api/benchmarks/byid', { params: { _id: selectedPosting.benchmarkId } })
              .then((response3) => {
                console.log('Benchmark query attempted in subapply', response3.data);

                if (response3.data.success) {
                  console.log('benchmark query worked in subapply')

                  let tasks = this.state.tasks
                  const thirdPartyAssessments = response3.data.benchmark.thirdPartyAssessments
                  if (response3.data.benchmark.thirdPartyAssessmentWeight && response3.data.benchmark.thirdPartyAssessments && response3.data.benchmark.thirdPartyAssessments.length > 0) {
                    for (let i = 1; i <= selectedPosting.appComponents.length; i++) {
                      if (selectedPosting.appComponents[i - 1].name === 'Third Party Assessments' && selectedPosting.appComponents[i - 1].include) {
                        let taskIndex = this.state.tasks.length - 1
                        if (taskIndex < 0) {
                          taskIndex = 0
                        }

                        if (tpaResponses && tpaResponses.length === thirdPartyAssessments.length) {
                          tasks.splice(taskIndex,0,{ shorthand: 'thirdPartyAssessments', name: 'Third Party Assessments Scores', icon: assessmentsIconDark, message: 'Form completed', action: 'Edit', isCompleted: true, required: selectedPosting.appComponents[i - 1].required })
                        } else {
                          tasks.splice(taskIndex,0,{ shorthand: 'thirdPartyAssessments', name: 'Third Party Assessments Scores', icon: assessmentsIconDark, message: '', action: 'Start', isCompleted: false, required: selectedPosting.appComponents[i - 1].required })
                        }
                      }
                    }
                  }

                  const dealBreakers = response3.data.benchmark.dealBreakers
                  if (response3.data.benchmark.dealBreakers && response3.data.benchmark.dealBreakers.length > 0) {
                    for (let i = 1; i <= selectedPosting.appComponents.length; i++) {
                      if (selectedPosting.appComponents[i - 1].name === 'Screening Questions (Deal Breakers)' && selectedPosting.appComponents[i - 1].include) {
                        let taskIndex = this.state.tasks.length - 1
                        if (taskIndex < 0) {
                          taskIndex = 0
                        }

                        if (dbResponses && dbResponses.length === dealBreakers.length) {
                          tasks.splice(taskIndex,0,{ shorthand: 'dealBreakers', name: 'Screening Questions', icon: assessmentsIconDark, message: 'Form completed', action: 'Edit', isCompleted: true, required: selectedPosting.appComponents[i - 1].required })
                        } else {
                          tasks.splice(taskIndex,0,{ shorthand: 'dealBreakers', name: 'Screening Questions', icon: assessmentsIconDark, message: '', action: 'Start', isCompleted: false, required: selectedPosting.appComponents[i - 1].required })
                        }
                      }
                    }
                  }

                  this.setState({ tasks, thirdPartyAssessments, dealBreakers })
                  pullAssessmentResults()

                } else {
                  console.log('benchmark query did not wor in subapply', response3.data.message)
                  pullAssessmentResults()
                }

              }).catch((error) => {
                  console.log('Benchmark query did not work for some reason', error);
              });
            }
          }
        }).catch((error) => {
            console.log('Profile pic fetch did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/extras', { params: { emailId: email } })
        .then((response) => {
          console.log('Extras query attempted', response.data);

            if (response.data.success) {
              console.log('successfully retrieved extras')

              if (response.data.extras) {

                const extras = response.data.extras
                if (extras.length > 0) {
                  console.log('the array is greater than 0')

                  const isExtras = true
                  this.setState({ extras, isExtras })

                }
              }

            } else {
              console.log('no extras data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Extras query did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  actionTapped(index, isCompleted) {
    console.log('actionTapped called ', index, this.state.tasks[index].shorthand, this.state.isBasicInfo)

    let tasks = this.state.tasks
    if (this.state.tasks[index].shorthand === 'basicInfo') {
      if (this.state.isBasicInfo) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'Name, school, and grad year successfully imported from profile!'
      } else if (isCompleted) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'All required basic info has been added!'
      } else if (isCompleted === false) {
        tasks[index]['isCompleted'] = false
        tasks[index]['message'] = 'Please add all required basic information.'
      } else {
        tasks[index]['isCompleted'] = false
        tasks[index]['message'] = 'Please add your name, school, grad year, and other info into profile to import.'
      }

      this.setState({ tasks })
      this.checkCompleteness(tasks)
    } else if (this.state.tasks[index].shorthand === 'resume') {
      if (this.state.isResume) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'Resume successfully imported from profile!'
      } else {
        tasks[index]['isCompleted'] = false
        tasks[index]['message'] = 'Please add your resume to your profile to import.'
      }
      this.setState({ tasks })
      this.checkCompleteness(tasks)
    } else if (this.state.tasks[index].shorthand === 'portfolio') {
      if (this.state.isPortfolio) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'Portfolio link successfully imported!'
      } else {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'No portfolio link found. This is not required, but it helps your application.'
      }
      this.setState({ tasks })
      this.checkCompleteness(tasks)
    } else if (this.state.tasks[index].shorthand === 'projects') {
      if (this.state.isProjects) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'Projects & experience successfully imported from profile!'
      } else {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = "Either projects and experience are missing from your profile. That's okay, you are not required to add them, but they help!"
      }
      this.setState({ tasks })
      this.checkCompleteness(tasks)
    } else if (this.state.tasks[index].shorthand === 'coverLetter') {
      // tasks[index]['isCompleted'] = true
      // this.setState({ tasks })
    } else if (this.state.tasks[index].shorthand === 'careerAssessments') {
      if (this.state.isCareerAssessments) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'Career assessments are complete!'
      } else if (isCompleted) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'All required career assessments have been completed!'
      } else if (isCompleted === false) {
        tasks[index]['isCompleted'] = false
        tasks[index]['message'] = 'Please take all required career assessments.'
      } else {
        tasks[index]['isCompleted'] = false
        tasks[index]['message'] = 'Take the career asssessments in the assessments tab to import.'
      }
      this.setState({ tasks })
      this.checkCompleteness(tasks)

    } else if (this.state.tasks[index].shorthand === 'endorsements') {
      if (this.state.isEndorsements) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'Teacher and mentor endosements successfully imported!'
      } else {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'No endorsements found. These are not required but they help your application.'
      }
      this.setState({ tasks })
      this.checkCompleteness(tasks)
    } else if (this.state.tasks[index].shorthand === 'coverLetter') {
      if (this.state.coverLetter) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'Cover letter successfully uploaded!'
      } else {
        tasks[index]['isCompleted'] = false
        tasks[index]['message'] = 'There was an error uploading your cover letter.'
      }
      this.setState({ tasks })
      this.checkCompleteness(tasks)
    } else if (this.state.tasks[index].shorthand === 'letterOfRecommendation') {
      if (this.state.letterOfRecommendation) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'Letter of recommendation successfully uploaded!'
      } else {
        tasks[index]['isCompleted'] = false
        tasks[index]['message'] = 'There was an error uploading your letter of recommendation.'
      }
      this.setState({ tasks })
      this.checkCompleteness(tasks)
    } else if (this.state.tasks[index].shorthand === 'identification') {
      if (this.state.identification) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'Identification successfully uploaded!'
      } else {
        tasks[index]['isCompleted'] = false
        tasks[index]['message'] = 'There was an error uploading your identification.'
      }
      this.setState({ tasks })
      this.checkCompleteness(tasks)
    } else if (this.state.tasks[index].shorthand === 'transcript') {
      if (this.state.transcript) {
        tasks[index]['isCompleted'] = true
        tasks[index]['message'] = 'Transcript successfully uploaded!'
      } else {
        tasks[index]['isCompleted'] = false
        tasks[index]['message'] = 'There was an error uploading your transcript.'
      }
      this.setState({ tasks })
      this.checkCompleteness(tasks)
    } else {

    }
  }

  formChangeHandler = (eventName, eventValue) => {
    console.log('show data: ')

    this.setState({ selectedValue: eventValue })

    if (eventName === 'resumeURL') {
      this.setState({ resumeURL: eventValue })
    } else if (eventName === 'resume' || eventName === 'coverLetter' || eventName === 'letterOfRecommendation' || eventName === 'identification' || eventName === 'transcript') {
      // console.log('show event name 1: ', event.target.files[0])

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

              let tasks = this.state.tasks
              const errorMessage = 'File must be less than 2MB.'
              for (let i = 1; i <= tasks.length; i++) {
                if (tasks[i - 1].shorthand === eventName) {
                  tasks[i - 1]['isCompleted'] = false
                  // tasks[i - 1]['message'] = eventName.charAt(0).toUpperCase() + eventName.slice(1) + ' was successfully uploaded'
                  tasks[i - 1]['message'] = errorMessage
                }
              }

              self.setState({ tasks })

            } else {
              console.log('file is small enough')

              let tasks = this.state.tasks
              for (let i = 1; i <= tasks.length; i++) {
                if (tasks[i - 1].shorthand === eventName) {
                  tasks[i - 1]['isCompleted'] = true
                  // tasks[i - 1]['message'] = eventName.charAt(0).toUpperCase() + eventName.slice(1) + ' was successfully uploaded'
                  tasks[i - 1]['message'] = res[0].name
                }
              }

              self.setState({ tasks })

              let file = res[0]
              file['fileName'] = file.name
              file['fileSize'] = file.size
              file['uri'] = file.uri
              file['type'] = file.type
              // console.log('show me the uri: ', file.uri)
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
      //
      //   if(event.target.files[0].size > 2 * 1024 * 1024) {
      //     console.log('file is too big')
      //
      //     let tasks = this.state.tasks
      //     const errorMessage = 'File must be less than 2MB.'
      //     for (let i = 1; i <= tasks.length; i++) {
      //       if (tasks[i - 1].shorthand === eventName) {
      //         tasks[i - 1]['isCompleted'] = false
      //         // tasks[i - 1]['message'] = eventName.charAt(0).toUpperCase() + eventName.slice(1) + ' was successfully uploaded'
      //         tasks[i - 1]['message'] = errorMessage
      //       }
      //     }
      //
      //     this.setState({ tasks })
      //
      //   } else {
      //     console.log('file is small enough', event.target.files[0].size)
      //
      //     let reader = new FileReader();
      //     reader.onload = (e) => {
      //       if (event.target) {
      //         console.log('show event name 2: ', eventName)
      //         if (eventName === 'resume') {
      //           this.setState({ resume: e.target.result });
      //         } else if (eventName === 'coverLetter') {
      //           this.setState({ coverLetter: e.target.result });
      //         } else if (eventName === 'letterOfRecommendation') {
      //           this.setState({ letterOfRecommendation: e.target.result });
      //         } else if (eventName === 'identification') {
      //           this.setState({ identification: e.target.result });
      //         } else if (eventName === 'transcript') {
      //           this.setState({ transcript: e.target.result });
      //         }
      //         console.log('how do i access the image', e.target.result)
      //       }
      //     };
      //     reader.readAsDataURL(event.target.files[0]);
      //     // this.setState({ profilePicFile: event.target.files[0], profilePicHasChanged: true })
      //     this.saveFile(eventName, event.target.files[0])
      //
      //     let tasks = this.state.tasks
      //     for (let i = 1; i <= tasks.length; i++) {
      //       if (tasks[i - 1].shorthand === eventName) {
      //         tasks[i - 1]['isCompleted'] = true
      //         // tasks[i - 1]['message'] = eventName.charAt(0).toUpperCase() + eventName.slice(1) + ' was successfully uploaded'
      //         tasks[i - 1]['message'] = event.target.files[0].name
      //       }
      //     }
      //
      //     this.setState({ tasks })
      //   }
      // }
    } else if (eventName === 'resumeName') {
      const resumeName = eventValue
      const index = this.state.resumeNames.indexOf(eventValue)
      const resumeURL = this.state.resumes[index]

      let tasks = this.state.tasks
      for (let i = 1; i <= tasks.length; i++) {
        if (tasks[i - 1].shorthand === 'resume') {
          tasks[i - 1]['isCompleted'] = true
          tasks[i - 1]['message'] = resumeName
        }
      }

      this.setState({ resumeName, resumeURL, tasks })
    } else if (eventName === 'firstName') {
      this.setState({ firstName: eventValue })
    } else if (eventName === 'lastName') {
      this.setState({ lastName: eventValue })
    } else if (eventName === 'email') {
      this.setState({ emailId: eventValue })
    } else if (eventName === 'password') {
      this.setState({ password: eventValue })
    } else if (eventName === 'schoolName') {
      this.setState({ schoolName: eventValue })
    } else if (eventName === 'major') {
      this.setState({ major: eventValue })
    } else if (eventName === 'gradYear') {
      this.setState({ gradYear: eventValue })
    } else if (eventName === 'linkedInURL') {
      this.setState({ linkedInURL: eventValue })
    } else if (eventName === 'customWebsiteURL') {
      this.setState({ customWebsiteURL: eventValue })
    } else if (eventName === 'phoneNumber') {
      this.setState({ phoneNumber: eventValue })
    } else if (eventName === 'shortAnswer') {
      let responses = this.state.responses
      if (eventValue === '') {
        responses[this.state.questionIndex] = null
        this.setState({ selectedAnswer: eventValue, responses })
      } else {
        responses[this.state.questionIndex] = eventValue
        this.setState({ selectedAnswer: eventValue, responses })
      }

    } else if (eventName === 'longAnswer') {
      let responses = this.state.responses
      if (eventValue === '') {
        responses[this.state.questionIndex] = null
        this.setState({ selectedAnswer: eventValue, responses })
      } else {
        responses[this.state.questionIndex] = eventValue
        this.setState({ selectedAnswer: eventValue, responses })
      }
    } else if (eventName === 'email') {
      let responses = this.state.responses
      if (eventValue === '') {
        responses[this.state.questionIndex] = null
        this.setState({ selectedAnswer: eventValue, responses })
      } else {
        responses[this.state.questionIndex] = eventValue
        this.setState({ selectedAnswer: eventValue, responses })
      }
    } else if (eventName === 'birthdate') {
      let responses = this.state.responses
      if (eventValue === '') {
        responses[this.state.questionIndex] = null
        this.setState({ selectedAnswer: eventValue, responses })
      } else {
        responses[this.state.questionIndex] = eventValue
        this.setState({ selectedAnswer: eventValue, responses })
      }

    } else if (eventName === 'multipleChoice') {
      let responses = this.state.responses
      responses[this.state.questionIndex] = eventValue
      this.setState({ multipleChoice: eventValue, responses })
    } else if (eventName === 'multipleAnswer') {
      let responses = this.state.responses
      let thisResponseArray = this.state.responses[this.state.questionIndex]

      if (Array.isArray(thisResponseArray)) {
        if (thisResponseArray.includes(eventValue)) {
          let index = thisResponseArray.indexOf(eventValue);
          if (index > -1) {
            thisResponseArray.splice(index, 1);
          }
        } else {

          thisResponseArray.push(eventValue)

        }
      } else {
        thisResponseArray = []
        thisResponseArray.push(eventValue)
      }

      responses[this.state.questionIndex] = thisResponseArray
      this.setState({ selectedAnswer: thisResponseArray, responses })
    } else if (eventName === 'boolean') {
      let responses = this.state.responses
      responses[this.state.questionIndex] = eventValue
      this.setState({ selectedAnswer: eventValue, responses })
    } else if (eventName.includes('listedAnswer')) {
      let responses = this.state.responses
      if (eventName.split("|")[3] === 'thirdPartyAssessments') {
        responses = this.state.tpaResponses
      } else if (eventName.split("|")[3] === 'dealBreakers') {
        responses = this.state.dbResponses
        console.log('in dbResponses 1', responses)
      }

      const type = eventName.split('|')[1]
      const index = eventName.split('|')[2]

      if (type === 'boolean') {
        responses[index] = eventValue
        this.setState({ responses })
      } else if (type === 'multipleChoice') {
        responses[index] = eventValue
        if (eventName.split("|")[3] === 'thirdPartyAssessments') {
          this.setState({ tpaResponses: responses })
        } else if (eventName.split("|")[3] === 'dealBreakers') {
          this.setState({ dbResponses: responses })
        } else {
          this.setState({ responses })
        }
      } else if (type === 'multipleAnswer') {
        let thisResponseArray = this.state.responses[index]

        if (Array.isArray(thisResponseArray)) {
          if (thisResponseArray.includes(eventValue)) {
            let index = thisResponseArray.indexOf(eventValue);
            if (index > -1) {
              thisResponseArray.splice(index, 1);
            }
          } else {

            thisResponseArray.push(eventValue)

          }
        } else {
          thisResponseArray = []
          thisResponseArray.push(eventValue)
        }

        responses[index] = thisResponseArray
        if (eventName.split("|")[3] === 'thirdPartyAssessments') {
          this.setState({ tpaResponses: responses })
        } else if (eventName.split("|")[3] === 'dealBreakers') {
          this.setState({ dbResponses: responses })
        } else {
          this.setState({ responses })
        }

      } else {
        if (eventValue === '') {
          responses[index] = null
          if (eventName.split("|")[3] === 'thirdPartyAssessments') {
            this.setState({ tpaResponses: responses })
          } else if (eventName.split("|")[3] === 'dealBreakers') {
            this.setState({ dbResponses: responses })
          } else {
            this.setState({ responses })
          }
        } else {
          responses[index] = eventValue
          if (eventName.split("|")[3] === 'thirdPartyAssessments') {
            this.setState({ tpaResponses: responses })
          } else if (eventName.split("|")[3] === 'dealBreakers') {
            this.setState({ dbResponses: responses })
          } else {
            this.setState({ responses })
          }
        }
      }

      let tasks = this.state.tasks
      let testShorthand = 'customAssessment'
      let testQuestions = []
      if (eventName.split("|")[3] === 'thirdPartyAssessments') {
        testShorthand = 'thirdPartyAssessments'
        testQuestions = this.state.thirdPartyAssessments
      } else if (eventName.split("|")[3] === 'dealBreakers') {
        testShorthand = 'dealBreakers'
        testQuestions = this.state.dealBreakers
      } else {
        if (this.state.customAssessment) {
          testQuestions = this.state.customAssessment.questions
        }
      }

      for (let i = 1; i <= tasks.length; i++) {
        if (tasks[i - 1].shorthand === testShorthand) {
          let responseCounter = 0
          for (let j = 1; j <= testQuestions.length; j++) {
            if (responses[j - 1] && responses[j - 1] !== '') {
              responseCounter = responseCounter + 1
            }
          }

          if (responseCounter === testQuestions.length) {
            tasks[i - 1]['isCompleted'] = true
            tasks[i - 1]['message'] = 'Form has been completed!'
          }
        }
      }

      this.checkCompleteness(tasks)
    } else if (eventName.includes('question')) {
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

  saveFile(category, passedFile) {
    console.log('saveFile called', category, passedFile)

    // 2.16 MB

    const emailId = this.state.emailId
    // const fileName = passedFile.name
    const fileName = passedFile.fileName
    const originalName = category + '|' + emailId + '|' + fileName + '|' + new Date()

    passedFile['name'] = originalName
    passedFile['size'] = passedFile.fileSize
    passedFile['uri'] = passedFile.uri
    if (Platform.OS === 'ios') {
      passedFile['uri'] = passedFile.uri.replace('file://', '')
    }

    let fileData = new FormData();
    // const fileName = 'profileImage'
    // const fileName = 'newFile'
    fileData.append('baseFileName', passedFile, originalName)

    fetch("https://www.guidedcompass.com/api/file-upload", {
        mode: 'no-cors',
        method: "POST",
        body: fileData
    }).then(function (res) {
      console.log('what is the response');

      if (res.ok) {

        const serverSuccessResume = true
        const serverSuccessMessageResume = category.charAt(0).toUpperCase() + category.slice(1) + ' saved successfully!'
        if (category === 'resume') {
          this.setState({ serverSuccessResume, serverSuccessMessageResume, resumeFile: passedFile, resumeName: fileName })
        } else if (category === 'coverLetter') {
          this.setState({ serverSuccessResume, serverSuccessMessageResume, coverLetterFile: passedFile, coverLetterName: fileName })
        } else if (category === 'letterOfRecommendation') {
          this.setState({ serverSuccessResume, serverSuccessMessageResume, lorFile: passedFile, lorName: fileName })
        } else if (category === 'identification') {
          this.setState({ serverSuccessResume, serverSuccessMessageResume, idFile: passedFile, idName: fileName })
        } else if (category === 'transcript') {
          this.setState({ serverSuccessResume, serverSuccessMessageResume, transcriptFile: passedFile, transcriptName: fileName })
        }

        const self = this

        res.json()
        .then(function(data) {
          console.log('show data: ', data)
          let newFilePath = data.filePath
          console.log('show filePath: ', newFilePath)

          let existingFilePath = null
          if (category === 'resume') {
            existingFilePath = self.state.resumeURL
          } else if (category === 'coverLetter') {
            existingFilePath = self.state.coverLetterURL
          } else if (category === 'letterOfRecommendation') {
            existingFilePath = self.state.letterOfRecommendationURL
          } else if (category === 'identification') {
            existingFilePath = self.state.identificationURL
          } else if (category === 'transcript') {
            existingFilePath = self.state.transcriptURL
          }

          // remove existing file
          if (existingFilePath && !self.state.allowMultipleFiles) {
            const deleteArray = existingFilePath.split("amazonaws.com/")
            console.log('show deleteArray: ', deleteArray)
            if (deleteArray[1]) {
              const deleteKey = deleteArray[1].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
              // console.log('show deleteKey: ', deleteKey, 'profilePic|creightontaylor+14@gmail.com|Tue Sep 08 2020 20:39:52 GMT-0700 (Pacific Daylight Time)')

              // profilePic|Ccreightontaylor 14@gmail.com|CTue%20Sep%2008%202020%2020:25:28%20GMT-0700%20%28Pacific%20Daylight%20Time%29
              Axios.put('https://www.guidedcompass.com/api/file/', { deleteKey })
              .then((response) => {
                console.log('tried to delete', response.data)
                if (response.data.success) {
                  //save values
                  console.log('File delete worked');

                  const serverPostSuccess = true
                  const serverSuccessMessage = 'File was saved successfully'

                  if (category === 'resume') {
                    self.setState({ serverPostSuccess, serverSuccessMessage, resumeURL: newFilePath })
                  } else if (category === 'coverLetter') {
                    self.setState({ serverPostSuccess, serverSuccessMessage, coverLetterURL: newFilePath })
                  } else if (category === 'letterOfRecommendation') {
                    self.setState({ serverPostSuccess, serverSuccessMessage, letterOfRecommendationURL: newFilePath })
                  } else if (category === 'identification') {
                    self.setState({ serverPostSuccess, serverSuccessMessage, identificationURL: newFilePath  })
                  } else if (category === 'transcript') {
                    self.setState({ serverPostSuccess, serverSuccessMessage, transcriptURL: newFilePath  })
                  }

                } else {
                  console.error('there was an error saving the file');
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
            } else {
              console.log('save new file', category, newFilePath)

              const serverPostSuccess = true
              const serverSuccessMessage = 'File was saved successfully'

              if (category === 'resume') {
                self.setState({ serverPostSuccess, serverSuccessMessage, resumeURL: newFilePath })

                let tasks = self.state.tasks
                for (let i = 1; i <= tasks.length; i++) {
                  if (tasks[i - 1].shorthand === category) {
                    tasks[i - 1]['isCompleted'] = true
                    tasks[i - 1]['message'] = fileName
                  }
                }
                self.checkCompleteness(tasks)

              } else if (category === 'coverLetter') {
                self.setState({ serverPostSuccess, serverSuccessMessage, coverLetterURL: newFilePath })

                let tasks = self.state.tasks
                for (let i = 1; i <= tasks.length; i++) {
                  if (tasks[i - 1].shorthand === category) {
                    tasks[i - 1]['isCompleted'] = true
                    tasks[i - 1]['message'] = fileName
                  }
                }
                self.checkCompleteness(tasks)
              } else if (category === 'letterOfRecommendation') {
                self.setState({ serverPostSuccess, serverSuccessMessage, letterOfRecommendationURL: newFilePath })

                let tasks = self.state.tasks
                for (let i = 1; i <= tasks.length; i++) {
                  if (tasks[i - 1].shorthand === category) {
                    tasks[i - 1]['isCompleted'] = true
                    tasks[i - 1]['message'] = fileName
                  }
                }
                self.checkCompleteness(tasks)
              } else if (category === 'identification') {
                self.setState({ serverPostSuccess, serverSuccessMessage, identificationURL: newFilePath  })

                let tasks = self.state.tasks
                for (let i = 1; i <= tasks.length; i++) {
                  if (tasks[i - 1].shorthand === category) {
                    tasks[i - 1]['isCompleted'] = true
                    tasks[i - 1]['message'] = fileName
                  }
                }
                self.checkCompleteness(tasks)
              } else if (category === 'transcript') {
                self.setState({ serverPostSuccess, serverSuccessMessage, transcriptURL: newFilePath  })

                let tasks = self.state.tasks
                for (let i = 1; i <= tasks.length; i++) {
                  if (tasks[i - 1].shorthand === category) {
                    tasks[i - 1]['isCompleted'] = true
                    tasks[i - 1]['message'] = fileName
                  }
                }
                self.checkCompleteness(tasks)
              }
            }
          } else {
            console.log('no existing file')

            const serverPostSuccess = true
            const serverSuccessMessage = 'File was saved successfully'

            if (category === 'resume') {
              self.setState({ serverPostSuccess, serverSuccessMessage, resumeURL: newFilePath })
              let tasks = self.state.tasks
              for (let i = 1; i <= tasks.length; i++) {
                if (tasks[i - 1].shorthand === category) {
                  tasks[i - 1]['isCompleted'] = true
                  tasks[i - 1]['message'] = fileName
                }
              }
              self.checkCompleteness(tasks)
            } else if (category === 'coverLetter') {
              self.setState({ serverPostSuccess, serverSuccessMessage, coverLetterURL: newFilePath })
              let tasks = self.state.tasks
              for (let i = 1; i <= tasks.length; i++) {
                if (tasks[i - 1].shorthand === category) {
                  tasks[i - 1]['isCompleted'] = true
                  tasks[i - 1]['message'] = fileName
                }
              }
              self.checkCompleteness(tasks)
            } else if (category === 'letterOfRecommendation') {
              self.setState({ serverPostSuccess, serverSuccessMessage, letterOfRecommendationURL: newFilePath })
              let tasks = self.state.tasks
              for (let i = 1; i <= tasks.length; i++) {
                if (tasks[i - 1].shorthand === category) {
                  tasks[i - 1]['isCompleted'] = true
                  tasks[i - 1]['message'] = fileName
                }
              }
              self.checkCompleteness(tasks)
            } else if (category === 'identification') {
              self.setState({ serverPostSuccess, serverSuccessMessage, identificationURL: newFilePath  })
              let tasks = self.state.tasks
              for (let i = 1; i <= tasks.length; i++) {
                if (tasks[i - 1].shorthand === category) {
                  tasks[i - 1]['isCompleted'] = true
                  tasks[i - 1]['message'] = fileName
                }
              }
              self.checkCompleteness(tasks)
            } else if (category === 'transcript') {
              self.setState({ serverPostSuccess, serverSuccessMessage, transcriptURL: newFilePath  })
              let tasks = self.state.tasks
              for (let i = 1; i <= tasks.length; i++) {
                if (tasks[i - 1].shorthand === category) {
                  tasks[i - 1]['isCompleted'] = true
                  tasks[i - 1]['message'] = fileName
                }
              }
              self.checkCompleteness(tasks)
            }
          }
        })

      } else if (res.status === 401) {
        //unauthorized
        this.setState({
            serverSuccessProfilePic: false,
            serverErrorMessageProfilePic: 'There was an error saving profile pic: Unauthorized save.'
        })
      }
    }.bind(this), function (e) {
      //there was an error
      this.setState({
          serverSuccessProfilePic: false,
          serverErrorMessageProfilePic: 'There was an error saving profile pic:' + e
      })
    }.bind(this));
  }

  signUp() {
      console.log('signUp called')

      const firstName = this.state.firstName
      const lastName = this.state.lastName
      let email = this.state.emailId
      const password = this.state.password
      const activeOrg = this.state.activeOrg
      let roleName = 'Student'

      let dateOfBirth = undefined
      if (this.state.questions && this.state.questions[0]) {
        dateOfBirth = this.state.questions[0].answer
      }

      let gender = undefined
      if (this.state.questions && this.state.questions[1]) {
        gender = this.state.questions[1].answer
      }

      let race = undefined
      if (this.state.questions && this.state.questions[2]) {
        race = this.state.questions[2].answer
      }

      let address = undefined
      if (this.state.questions && this.state.questions[3]) {
        address = this.state.questions[3].answer
      }

      let phoneNumber = undefined
      if (this.state.questions && this.state.questions[4]) {
        phoneNumber = this.state.questions[4].answer
      }

      let numberOfMembers = undefined
      if (this.state.questions && this.state.questions[5]) {
        numberOfMembers = this.state.questions[5].answer
      }

      let householdIncome = undefined
      if (this.state.questions && this.state.questions[6]) {
        householdIncome = this.state.questions[6].answer
      }

      let fosterYouth = undefined
      if (this.state.questions && this.state.questions[7]) {
        fosterYouth = this.state.questions[7].answer
      }

      let homeless = undefined
      if (this.state.questions && this.state.questions[8]) {
        homeless = this.state.questions[8].answer
      }

      let incarcerated = undefined
      if (this.state.questions && this.state.questions[9]) {
        incarcerated = this.state.questions[9].answer
      }

      let adversityList = undefined
      if (this.state.questions && this.state.questions[10]) {
        adversityList = this.state.questions[10].answer
      }

      let referrerName = undefined
      if (this.state.questions && this.state.questions[11]) {
        referrerName = this.state.questions[11].answer
      }

      let referrerEmail = undefined
      if (this.state.questions && this.state.questions[12]) {
        referrerEmail = this.state.questions[12].answer
      }

      let referrerOrg = undefined
      if (this.state.questions && this.state.questions[13]) {
        referrerOrg = this.state.questions[13].answer
      }

      let createdAt = new Date();
      let updatedAt = new Date();
      let platform = 'web'

      if (!firstName || firstName === '') {
        this.setState({ serverErrorMessage: 'please enter your first name' })
      } else if (!lastName || lastName === '') {
        this.setState({ serverErrorMessage: 'please enter your last name' })
      } else if (!email || email === '') {
        this.setState({ serverErrorMessage: 'please enter your email' })
      } else if (!email.includes('@')) {
        this.setState({ serverErrorMessage: 'email invalid. please enter a valid email' })
      } else if (!password || password === '') {
        this.setState({ serverErrorMessage: 'please enter a password' })
      } else if (!activeOrg || activeOrg === '') {
        this.setState({ serverErrorMessage: 'please add the code affiliated with a Guided Compass partner' })
      } else if (!roleName || roleName === '') {
        this.setState({ serverErrorMessage: 'please enter your role name' })
      } else if (password.length < 7) {
        this.setState({ serverErrorMessage: 'please enter a password over 6 characters' })
      } else if (this.state.activeOrg === 'unite-la' && !dateOfBirth) {
        this.setState({ serverErrorMessage: 'please add your date of birth' })
      } else if (this.state.activeOrg === 'unite-la' && !gender) {
        this.setState({ serverErrorMessage: 'please add your gender' })
      } else if (this.state.activeOrg === 'unite-la' && !race) {
        this.setState({ serverErrorMessage: 'please add your race' })
      } else if (this.state.activeOrg === 'unite-la' && !address) {
        this.setState({ serverErrorMessage: 'please add your address' })
      } else if (this.state.activeOrg === 'unite-la' && !phoneNumber) {
        this.setState({ serverErrorMessage: 'please add your phone number' })
      } else if (this.state.activeOrg === 'unite-la' && !numberOfMembers) {
        this.setState({ serverErrorMessage: 'please add number of members in your household' })
      } else if (this.state.activeOrg === 'unite-la' && !householdIncome) {
        this.setState({ serverErrorMessage: 'please add household income' })
      } else if (this.state.activeOrg === 'unite-la' && !fosterYouth) {
        this.setState({ serverErrorMessage: 'please add whether you were a foster youth' })
      } else if (this.state.activeOrg === 'unite-la' && !homeless) {
        this.setState({ serverErrorMessage: 'please add whether you were homeless' })
      } else if (this.state.activeOrg === 'unite-la' && !incarcerated) {
        this.setState({ serverErrorMessage: 'please add whether you were incarcerated' })
      } else if (this.state.activeOrg === 'unite-la' && !adversityList) {
        this.setState({ serverErrorMessage: 'please add click areas of adversity that applies' })
      } else if (this.state.activeOrg === 'unite-la' && !referrerName) {
        this.setState({ serverErrorMessage: 'please add the name of your referrer' })
      } else if (this.state.activeOrg === 'unite-la' && !referrerEmail) {
        this.setState({ serverErrorMessage: 'please add the email of your referrer' })
      } else if (this.state.activeOrg === 'unite-la' && !referrerOrg) {
        this.setState({ serverErrorMessage: 'please add the organization of your referrer' })
      } else {

          //we will assume username is unique for now
          let combinedNames = firstName + lastName
          let username = combinedNames.toLowerCase();

          this.setState({ isWaiting: true, username })

          Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
          .then((response) => {
            console.log('Org info query attempted', response.data);

              if (response.data.success) {
                console.log('org info query worked')

                email = email.toLowerCase()
                const orgName = response.data.orgInfo.orgName
                const orgFocus = response.data.orgInfo.orgFocus
                const orgContactFirstName = response.data.orgInfo.contactFirstName
                const orgContactLastName = response.data.orgInfo.contactLastName
                const orgContactEmail = response.data.orgInfo.contactEmail
                const studentAlias = response.data.orgInfo.studentAlias
                const headerImageURL = response.data.orgInfo.headerImageURL

                const myOrgs = [activeOrg]
                const courseIds = [this.state.courseId]
                const workIds = [this.state.workId]

                const education = this.state.education
                let school = this.state.school
                if (orgFocus === 'Placement') {
                  school = ''
                }

                let schoolDistrict = this.state.schoolDistrict

                let accountCode = ''

                let benefits = undefined
                if (roleName && roleName.toLowerCase() === 'Student') {
                  benefits = this.state.studentBenefits
                } else if (roleName && roleName.toLowerCase() === 'career-seeker') {
                  roleName = 'Student'
                  benefits = this.state.studentBenefits
                }

                if (benefits) {
                  for (let i = 1; i <= benefits.length; i++) {
                    benefits[i - 1]['detail'] = benefits[i - 1].detail.replace(/{{orgName}}/g,orgName)
                  }
                }

                const openToMentoring = true
                const confirmEmail = this.state.confirmEmail

                this.props.manualRegister({
                  firstName,lastName, username, email, password, orgName, courseIds, workIds,
                  orgContactFirstName, orgContactLastName, orgContactEmail,
                  activeOrg, myOrgs, roleName, education, school, schoolDistrict, accountCode,
                  createdAt, updatedAt, platform, openToMentoring, benefits, headerImageURL,
                  dateOfBirth, gender, race, address, phoneNumber, numberOfMembers, householdIncome, fosterYouth,
                  homeless, incarcerated, adversityList, referrerName, referrerEmail, referrerOrg,
                  confirmEmail
                })
                .then((responseData) => {
                  if (responseData.success) {

                    //success
                    AsyncStorage.setItem('email', email)//this.props.auth.email
                    AsyncStorage.setItem('username', username)
                    AsyncStorage.setItem('firstName', firstName)
                    AsyncStorage.setItem('lastName', lastName)
                    // AsyncStorage.setItem('isAdvisor', 'false')
                    // AsyncStorage.setItem('isAdvisee', 'true')
                    AsyncStorage.setItem('unreadNotificationsCount', 0)
                    AsyncStorage.setItem('orgAffiliation', '')
                    AsyncStorage.setItem('activeOrg', activeOrg)
                    AsyncStorage.setItem('orgFocus', orgFocus)
                    AsyncStorage.setItem('myOrgs', JSON.stringify(myOrgs))
                    AsyncStorage.setItem('orgName', orgName)
                    AsyncStorage.setItem('roleName', roleName)

                    if (studentAlias) {
                      AsyncStorage.setItem('studentAlias', studentAlias)
                    } else {
                      AsyncStorage.removeItem('studentAlias')
                    }

                    this.setState({ isWaiting: false })

                    if (roleName === 'Student') {
                      if (this.state.confirmEmail) {

                        this.setState({ signedIn: true, orgFocus, roleName, serverErrorMessage: null })

                        this.retrieveData()
                      } else {
                        this.setState({ signedIn: true, orgFocus, roleName, serverErrorMessage: null })
                        this.retrieveData()
                      }
                    }

                  } else {
                    // report to the user if there was a problem during registration
                    console.log('what is this', responseData.message );
                    this.setState({ serverErrorMessage: responseData.message })
                  }
                })

              } else {
                console.log('org info query did not work', response.data.message)
                //don't allow signups without an org affiliation
                this.setState({ serverErrorMessage: 'There was an error finding the organization' })
              }

          }).catch((error) => {
              console.log('Org info query did not work for some reason', error);
          });
      }

  }

  signIn() {
      console.log('subSignIn called: ', this.state)

      const email = this.state.emailId
      const password = this.state.password

      if (email === '') {
        this.setState({ serverErrorMessage: 'please enter your email' })
      } else if (password === '') {
        this.setState({ serverErrorMessage: 'please enter your password' })
      } else {

        this.setState({ isWaiting: true })

        this.props.manualLogin({
          email,password
        })
        .then((responseData) => {
          console.log('what we got', responseData)
          if (responseData.success) {

            if (!this.state.orgFocus || this.state.orgFocus === '' || !this.state.orgCode || this.state.orgCode === '') {
              // pull org information
              if (this.state.path && this.state.path.includes('/employers')) {
                this.completeSignIn(email, responseData, this.state.orgCode, this.state.orgFocus)
              } else {
                console.log('pull org info')
                const orgCode = responseData.user.activeOrg
                Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode} })
                .then((response) => {
                  console.log('Org info query attempted for orgFocus', response.data);

                    if (response.data.success) {
                      console.log('org info query worked for orgFocus')

                      const orgFocus = response.data.orgInfo.orgFocus

                      this.completeSignIn(email, responseData, orgCode, orgFocus)

                    } else {
                      console.log('org info query did not work', response.data.message)
                    }

                }).catch((error) => {
                    console.log('Org info query did not work for some reason', error);
                });
              }

            } else {
              this.completeSignIn(email, responseData, this.state.orgCode, this.state.orgFocus)
            }
          } else {

            // report to the user if there was a problem during registration
            console.log('what is this', responseData.message);
            this.setState({ serverErrorMessage: responseData.message })
          }
        })
      }
  }

  completeSignIn(email, responseData,orgCode, orgFocus) {
    console.log('completeSignIn called', email, orgCode, orgFocus)

    AsyncStorage.setItem('email', email)
    AsyncStorage.setItem('username', responseData.user.username)
    AsyncStorage.setItem('firstName', responseData.user.firstName)
    AsyncStorage.setItem('lastName', responseData.user.lastName)
    AsyncStorage.setItem('pathway', responseData.user.pathway)
    AsyncStorage.setItem('unreadNotificationsCount', 0)

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
        AsyncStorage.setItem('orgAffiliation', 'admin')
      } else {
        AsyncStorage.setItem('orgAffiliation', '')
      }
    } else {
      AsyncStorage.setItem('orgAffiliation', '')
    }
    if (responseData.user.myOrgs) {
      AsyncStorage.setItem('myOrgs', JSON.stringify(responseData.user.myOrgs))
    }

    if (responseData.user.activeOrg) {
      AsyncStorage.setItem('activeOrg', responseData.user.activeOrg)
      if (orgFocus && orgFocus !== '') {
        AsyncStorage.setItem('orgFocus', orgFocus)
      }
    }

    if (responseData.user.roleName) {
      AsyncStorage.setItem('roleName', responseData.user.roleName)
    }

    this.setState({ signedIn: true, orgFocus, roleName: responseData.user.roleName,
      resumeURL: responseData.user.resumeURL, firstName: responseData.user.firstName, lastName: responseData.user.lastName,
      serverErrorMessage: null
    })

    this.retrieveData()

  }

  signOut() {
    console.log('signOut called')

    Axios.post('https://www.guidedcompass.com/api/users/logout', { email: this.state.emailId })
    .then((response) => {
      console.log('Login attempted', response.data);

      if (response.data.success) {
        console.log('Login worked', this.state.emailId)

        AsyncStorage.removeItem('email')//this.props.auth.email
        AsyncStorage.removeItem('username')
        AsyncStorage.removeItem('firstName')
        AsyncStorage.removeItem('lastName')
        AsyncStorage.removeItem('isAdvisor')
        AsyncStorage.removeItem('unreadNotificationsCount')
        AsyncStorage.removeItem('orgAffiliation')
        AsyncStorage.removeItem('myOrgs')
        AsyncStorage.removeItem('activeOrg')
        AsyncStorage.removeItem('roleName')
        AsyncStorage.removeItem('orgFocus')
        AsyncStorage.removeItem('pathway')
        AsyncStorage.removeItem('studentAlias')
        AsyncStorage.removeItem('workMode')
        AsyncStorage.removeItem('isOrganization')
        AsyncStorage.removeItem('org')
        AsyncStorage.removeItem('isEmployer')
        AsyncStorage.removeItem('emp')
        AsyncStorage.removeItem('isAdvisee')
        AsyncStorage.removeItem('myOrgs')
        AsyncStorage.removeItem('studentAlias')

        this.setState({ signedIn: false })

      } else {
        console.log('login did not work', response.data.message)
        //don't allow signups without an org affiliation
        return { success: false, message: response.data.message }

      }

    }).catch((error) => {
        console.log('Login did not work for some reason', error);
        return { serverErrorMessage: error }
    });
  }

  checkSectionCompleteness(type, value, requiredComponents, skillQuestions, initialLoad) {
    console.log('checkSectionCompleteness called', type, value, requiredComponents, skillQuestions, initialLoad)

    let isCompleted = false
    if (type === 'basicInfo') {

      // const requiredBasicValues = this.state.requiredBasicValues

      let pointTracker = 0
      let incrementalPoint = (100 / requiredComponents.length) + 1

      for (let i = 1; i <= requiredComponents.length; i++) {
        // console.log('compare basicValues: ', requiredBasicValues[i - 1], value.firstName, incrementalPoint)
        if (requiredComponents[i - 1] === 'firstName' && value.firstName && value.firstName !== '') {
          pointTracker = pointTracker + incrementalPoint
        } else if (requiredComponents[i - 1] === 'lastName' && value.lastName && value.lastName !== '') {
          pointTracker = pointTracker + incrementalPoint
        } else if (requiredComponents[i - 1] === 'schoolName' && value.schoolName && value.schoolName !== '') {
          pointTracker = pointTracker + incrementalPoint
        } else if (requiredComponents[i - 1] === 'gradYear' && value.gradYear && value.gradYear !== '') {
          pointTracker = pointTracker + incrementalPoint
        }
      }

      // console.log('what is pointTracker: ', pointTracker)
      if (pointTracker > 100) {
        isCompleted = true
      }

    } else if (type === 'assessment') {
      console.log('show value: ', value)

      // console.log('is c: ', isCareerAssessments, assessments, requiredCareerAssessments, skillQuestions)

      let pointTracker = 0
      let incrementalPoint = (100 / this.state.requiredCareerAssessments.length) + 1
      console.log('t1: ', incrementalPoint)

      for (let i = 1; i <= requiredComponents.length; i++) {
        if (value) {
          if (requiredComponents[i - 1] === 'work preferences' && value.workPreferences && value.workPreferences.length > 0) {
            pointTracker = pointTracker + incrementalPoint
          }
          if (requiredComponents[i - 1] === 'interests' && value.interests && value.interests.length > 0) {
            pointTracker = pointTracker + incrementalPoint
            console.log('t2: ', pointTracker)
          }
          if (requiredComponents[i - 1] === 'skills' && value.skills && value.skills.length > 0) {
            console.log('in skill check', value.skills, this.state.skillQuestions)

            if (this.state.skillQuestions && !initialLoad) {
              skillQuestions = this.state.skillQuestions
            }
            console.log('show skillQuestions up in apply: ', skillQuestions, this.state.skillQuestions)

            let skillsStatus = 'Complete'
            if (skillQuestions && skillQuestions.length > 0) {
              console.log('t1')
              for (let i = 1; i <= skillQuestions.length; i++) {
                console.log('t2', value.skills, skillQuestions[i - 1])
                if (value.skills.some(sa => sa.name === skillQuestions[i - 1].title)) {
                  // console.log('compare the questions: ', skillQuestions[i - 1])
                } else if (value.skills.some(sa => sa.name === skillQuestions[i - 1].name)) {
                } else {
                  skillsStatus = 'Incomplete'
                  console.log('what missed here: ', i, skillQuestions[i - 1])
                }
              }
            }

            if (skillsStatus === 'Complete') {
              pointTracker = pointTracker + incrementalPoint
            }
            console.log('t3: ', pointTracker, skillsStatus)

          }
          if (requiredComponents[i - 1] === 'personality' && value.personality && value.personality.fiveFactors) {
            pointTracker = pointTracker + incrementalPoint
          }
          if (requiredComponents[i - 1] === 'values' && value.values && value.topGravitateValues && value.topGravitateValues.length > 0) {
            pointTracker = pointTracker + incrementalPoint
          }
        }
      }
      console.log('t4: ', pointTracker)
      if (pointTracker > 100) {
        isCompleted = true
      }
    }

    return isCompleted
  }

  checkCompleteness(tasks) {
    console.log('checkCompleteness called ', tasks)

    let applicationComplete = true
    if (tasks) {
      for (let i = 1; i <= tasks.length; i++) {
        console.log('compare task value: ', tasks[i - 1].shorthand, tasks[i - 1].isCompleted, tasks[i - 1].required)
        if (!tasks[i - 1].isCompleted && tasks[i - 1].required) {
          applicationComplete = false
        }
      }
    } else {
      console.log("something's wrong")
    }

    this.setState({ applicationComplete })
  }

  apply() {
    console.log('apply called')

    if (this.state.applicationComplete && this.state.emailId) {

      this.setState({ isSaving: true })

      let _id = null
      if (this.state.application) {
        if (this.state.application._id) {
          _id = this.state.application._id
        }
      }

      let email = this.state.emailId
      if (email && email !== '') {
        email = email.toLowerCase()
      }

      let username = this.state.username

      let postingEmployerName = ''
      if (this.state.selectedPosting.employerName) {
        postingEmployerName = this.state.selectedPosting.employerName
      } else {
        postingEmployerName = this.state.selectedPosting.orgName
      }

      const accountCode = this.state.selectedPosting.accountCode

      let newSkillAnswers = this.state.newSkillAnswers

      const endorsements = this.state.endorsements
      const projects = this.state.projects
      const experience = this.state.experience
      const extras = this.state.extras

      let posterEmail = ''
      if (this.state.selectedPosting.posterEmail) {
        posterEmail = this.state.selectedPosting.posterEmail
      }

      const orgCode = this.state.activeOrg

      const postingOrgCode = this.state.postingOrgCode
      const postingOrgName = this.state.postingOrgName
      const postingOrgContactEmail = this.state.postingOrgContactEmail

      const politicalAlignment = this.state.politicalAlignment
      const stateRegistration = this.state.stateRegistration
      const currentCongressionalDistrict = this.state.currentCongressionalDistrict
      const hometown = this.state.hometown
      const homeCongressionalDistrict = this.state.homeCongressionalDistrict
      const dacaStatus = this.state.dacaStatus

      let newCustomAssessmentResults = null

      let customAssessmentResponses = this.state.customAssessmentResponses
      let caQuestions = this.state.caQuestions

      if (customAssessmentResponses && caQuestions) {
        //convert to newCustomAssessmentResponses
        // console.log('show both cas: ', customAssessmentResponses, caQuestions)

        newCustomAssessmentResults = []
        for (let i = 1; i <= customAssessmentResponses.length; i++) {
          if (caQuestions[i - 1]) {
            console.log('show caResults: ', customAssessmentResponses[i - 1], caQuestions[i - 1])
            newCustomAssessmentResults.push({ question: caQuestions[i - 1].name, answer: customAssessmentResponses[i - 1] })
          } else {
            newCustomAssessmentResults.push({ question: 'Q' + i, answer: customAssessmentResponses[i - 1 ]})
          }
        }

      } else if (this.state.newCustomAssessmentResponses) {
        newCustomAssessmentResults = this.state.newCustomAssessmentResponses
      }

      let dealBreakerResponses = []
      let thirdPartyAssessmentResponses = []
      if (this.state.dealBreakers && this.state.dealBreakers.length > 0) {
        for (let i = 1; i <= this.state.dealBreakers.length; i++) {
          if (this.state.dbResponses[i - 1]) {
            dealBreakerResponses.push({
              question: this.state.dealBreakers[i - 1].name,
              answer: this.state.dbResponses[i - 1]
            })
          }
        }
      }
      if (this.state.thirdPartyAssessments && this.state.thirdPartyAssessments.length > 0) {
        for (let i = 1; i <= this.state.thirdPartyAssessments.length; i++) {
          if (this.state.tpaResponses[i - 1]) {
            thirdPartyAssessmentResponses.push({
              question: this.state.thirdPartyAssessments[i - 1].name,
              answer: this.state.tpaResponses[i - 1]
            })
          }
        }
      }

      let direct = false
      if (this.state.selectedPosting.direct) {
        direct = this.state.selectedPosting.direct
      }

      const pictureURL = this.state.pictureURL
      const firstName = this.state.firstName
      const lastName = this.state.lastName
      const resumeURL = this.state.resumeURL
      const linkedInURL = this.state.linkedInURL
      let customWebsiteURL = this.state.customWebsiteURL
      if (customWebsiteURL && customWebsiteURL.includes('guidedcompass.com') && this.state.publicProfileExtent !== 'Public') {
        customWebsiteURL = null
      }

      const videoResumeURL = this.state.videoResumeURL
      const coverLetterURL = this.state.coverLetterURL
      const letterOfRecommendationURL = this.state.letterOfRecommendationURL
      const identificationURL = this.state.identificationURL
      const transcriptURL = this.state.transcriptURL

      let schoolName = this.state.schoolName
      let degree = this.state.degree
      let major = this.state.major
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
          schoolName = selectedEducation.name
          degree = selectedEducation.degree
          major = selectedEducation.major
          if (selectedEducation.endDate) {
            const endYear = Number(selectedEducation.endDate.split(" ")[1])
            gradYear = endYear
            console.log('show gradYear: ', gradYear)
          }
        }
      }

      const zipcode = this.state.zipcode
      const phoneNumber = this.state.phoneNumber

      const dateOfBirth = this.state.dateOfBirth
      const pathway = this.state.pathway
      const race = this.state.race
      const gender = this.state.gender
      const veteran = this.state.veteran
      const workAuthorization = this.state.workAuthorization
      const numberOfMembers = this.state.numberOfMembers
      const householdIncome = this.state.householdIncome
      const fosterYouth = this.state.fosterYouth
      const homeless = this.state.homeless
      const incarcerated = this.state.incarcerated
      const adversityList = this.state.adversityList
      console.log('show expte')
      Axios.post('https://www.guidedcompass.com/api/applications', {
        _id, postingId: this.state.selectedPosting._id, postingTitle: this.state.selectedPosting.title, postingEmployerName, postingLocation: this.state.selectedPosting.location,
        pathways: this.state.selectedPosting.pathways, departments: this.state.selectedPosting.departments,
        firstName, lastName, email, username, education, schoolName, degree, major, gradYear, phoneNumber, zipcode, pictureURL,
        resumeURL, coverLetterURL, linkedInURL, customWebsiteURL, videoResumeURL, letterOfRecommendationURL, identificationURL, transcriptURL,
        dateOfBirth, pathway, race, gender, veteran, workAuthorization,
        numberOfMembers, householdIncome, fosterYouth, homeless, incarcerated, adversityList,
        customAssessmentResults: customAssessmentResponses, dealBreakerResponses, thirdPartyAssessmentResponses,
        newCustomAssessmentResults, direct,
        workPreferenceResults: this.state.wpData,
        interestResults: this.state.interestResults, skillAnswers: this.state.skillAnswers, newSkillAnswers, skillResults: this.state.skillResults, personalityResults: this.state.personalityResults,
        topGravitateValues: this.state.topGravitateValues, topEmployerValues: this.state.topEmployerValues,
        applicationComponents: this.state.selectedPosting.applicationComponents, stage: 'Applied', isActive: true,
        postType: this.state.selectedPosting.postType, subPostType: this.state.selectedPosting.subPostType,
        workflowType: this.state.selectedPosting.workflowType,
        orgCode, accountCode,
        politicalAlignment, stateRegistration, currentCongressionalDistrict, hometown, homeCongressionalDistrict, dacaStatus,
        postingOrgCode, postingOrgName, postingOrgContactEmail,
        endorsements, projects, experience, extras, posterEmail,
        createdAt: new Date(), updatedAt: new Date()
      }).then((response) => {
        console.log('attempting to save')
        if (response.data.success) {
          console.log('saved successfully', response.data.message)

          let serverSuccessMessage = 'Application submitted successfully!'

          if (_id) {
            serverSuccessMessage = 'Application successfully updated!'
          }
          // degree, zipcode

          let tasks = this.state.tasks
          for (let i = 1; i <= tasks.length; i++) {
            tasks[i - 1]['isCompleted'] = false
            tasks[i - 1]['message'] = ''
          }

          const applicationSubmitted = true

          this.setState({
            serverSuccess: true,
            serverSuccessMessage, tasks, applicationSubmitted, isSaving: false
          })

          if (this.state.basicFormHasChanged) {

            const emailId = email
            const updatedAt = new Date()

            // save to profile information
            this.props.saveProfileDetails({
              emailId, firstName, lastName, education, school: schoolName, degree, major, gradYear, phoneNumber, zipcode, pictureURL,
              resumeURL, coverLetterURL, linkedInURL, customWebsiteURL, videoResumeURL, letterOfRecommendationURL, identificationURL, transcriptURL,
              dateOfBirth, pathway, race, gender, veteran, workAuthorization,
              numberOfMembers, householdIncome, fosterYouth, homeless, incarcerated, adversityList,
              updatedAt
            })
            .then((responseData) => {

                if (responseData.success) {
                  console.log('successfully saved to profile')
                  //report whether values were successfully saved
                  // this.setState({ serverSuccess: true, serverSuccessMessage: 'Saved changes to profile'
                  // })

                } else {

                  console.log('save to profile was not successful')
                  this.setState({ serverSuccess: false, serverErrorMessage: responseData.message })
                }
            })
          }

        } else {
          console.log('did not save successfully', response.data)

          this.setState({
            serverSuccess: false,
            serverErrorMessage: 'error: ' + response.data.message.toString(), isSaving: false
          })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({
            serverSuccess: false,
            serverErrorMessage: 'There was an error submitting your application', isSaving: false
          })
      });
    } else {
      this.setState({
        serverSuccess: false,
        serverErrorMessage: 'All required information for the application has not yet been successfully imported!'
      })
    }
  }

  renderTasks() {
    console.log('renderTasks called check' )

    let rows = []

    for (let i = 1; i <= this.state.tasks.length; i++) {

      const index = i - 1

      let incompletedClass = [styles.calcColumn118,styles.rowDirection,styles.topMargin5]
      let completedClass = [styles.calcColumn118,styles.rowDirection]

      rows.push(
        <View key={i} style={[styles.row5]}>
          <View style={[styles.row10]}>
            {(this.state.tasks[i - 1].isCompleted) ? (
              <View>
                <TouchableOpacity style={[styles.rowDirection]} onPress={() => this.expandSection(index)}>
                  <View style={[styles.width25,styles.topMargin]}>
                    <Image source={{ uri: arrowIndicatorIcon}} style={(this.state.tasks[index].isExpanded) ? [styles.square15,styles.contain,styles.rotate90] : [styles.square15,styles.contain]} />
                  </View>
                  <View style={[styles.width33]}>
                    <Image source={{ uri: this.state.tasks[i - 1].icon}} style={[styles.square20,styles.contain,styles.topMargin]} />
                  </View>
                  <View style={(this.state.tasks[i - 1].isCompleted) ? completedClass : incompletedClass} >
                    <View style={[styles.calcColumn148]}>
                      <View style={[styles.halfSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                      {(this.state.tasks[i - 1].required) ? (
                        <Text style={[styles.headingText5]}>{this.state.tasks[i - 1].name} <Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                      ) : (
                        <Text style={[styles.headingText5]}>{this.state.tasks[i - 1].name}</Text>
                      )}
                    </View>
                    <View style={[styles.width30]}>
                      <View style={[styles.halfSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                      <Image source={{ uri: checkmarkIcon}} style={[styles.square22,styles.leftMargin]}/>
                    </View>

                  </View>
                </TouchableOpacity>

              </View>
            ) : (
              <View>
                <TouchableOpacity onPress={() => this.expandSection(index)} style={[styles.rowDirection]}>
                  <View style={[styles.width25,styles.topMargin]}>
                    <Image source={{ uri: arrowIndicatorIcon}} style={(this.state.tasks[index].isExpanded) ? [styles.square15,styles.contain,styles.rotate90] : [styles.square15,styles.contain]} />
                  </View>
                  <View style={[styles.width33]}>
                    <Image source={{ uri: this.state.tasks[i - 1].icon}} style={[styles.square20,styles.topMargin]} />
                  </View>
                  <View style={(this.state.tasks[i - 1].isCompleted) ? completedClass : incompletedClass} >
                    <View style={[styles.flex1]}>
                      {(this.state.tasks[i - 1].required) ? (
                        <Text style={[styles.headingText5]}>{this.state.tasks[i - 1].name} <Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                      ) : (
                        <Text style={[styles.headingText5]}>{this.state.tasks[i - 1].name}</Text>
                      )}
                    </View>

                    {(this.state.tasks[i - 1].message !== '') && (
                      <View>
                        <View style={[styles.halfSpacer]}/><View style={[styles.miniSpacer]}/>
                        <Image source={{ uri: xIcon}} style={[styles.square16,styles.leftMargin12]}/>
                      </View>
                    )}
                  </View>

                </TouchableOpacity>

              </View>
            )}


          </View>

          {(this.state.tasks[i - 1].isCompleted) ? (
            <View style={[styles.topMarginNegative10,styles.leftPadding20]}>
              {(this.state.tasks[i - 1].message !== '') && (
                <Text style={[styles.ctaColor,styles.descriptionText2,styles.boldText,styles.leftMargin30,styles.topMargin]}>{this.state.tasks[i - 1].message}</Text>
              )}
            </View>
          ) : (
            <View style={[styles.topMarginNegative10,styles.leftPadding20]}>
              {(this.state.tasks[i - 1].action === 'Upload') ? (
                <View>
                  {(this.state.tasks[i - 1].message !== '') && (
                    <Text style={[styles.errorColor,styles.descriptionText2,styles.boldText,styles.leftMargin30,styles.topMargin]}>{this.state.tasks[i - 1].message}</Text>
                  )}
                </View>
              ) : (
                <View>
                  {(this.state.tasks[i - 1].message !== '') && (
                    <Text style={[styles.errorColor,styles.descriptionText2,styles.boldText,styles.leftMargin30,styles.topMargin]}>{this.state.tasks[i - 1].message}.</Text>
                  )}
                </View>
              )}
            </View>
          )}

          {(this.state.tasks[i - 1].isExpanded) && (
            <View>
              {this.renderExpandedTask(this.state.tasks[index], index)}
            </View>
          )}

        </View>
      )
    }

    return rows
  }

  expandSection(index) {
    console.log('expandSection called', index)

    let tasks = this.state.tasks
    if (tasks[index].isExpanded) {
      tasks[index]['isExpanded'] = false
    } else {
      tasks[index]['isExpanded'] = true
    }
    this.setState({ tasks })
  }

  passData(name, value, index, source) {
    console.log('passData called', name, value, index, source)

    if (name === 'project') {
      console.log('in project')
      let projects = this.state.projects
      projects[index] = value
      this.setState({ projects })
    } else if (name === 'experience') {
      console.log('in experience')
      let experience = this.state.experience
      experience[index] = value
      this.setState({ experience })
    } else if (name === 'extra') {
      console.log('in extras')
      let extras = this.state.extras
      extras[index] = value
      this.setState({ extras })
    } else if (name === 'work preferences') {
      console.log('show wpValue: ', value)
      this.setState({ workPreferenceResults: value })

      const assessments = {
        workPreferences: value, interests: this.state.interestResults,
        skills: this.state.newSkillAnswers, personality: this.state.personalityResults,
        values: this.state.valuesResults
      }

      const isCompleted = this.checkSectionCompleteness('assessment', assessments, this.state.requiredCareerAssessments)
      const taskIndex = this.state.tasks.findIndex((element) => element.shorthand === 'careerAssessments')
      this.actionTapped(taskIndex, isCompleted)

    } else if (name === 'interests') {
      console.log('show interestsValue: ', value)
      this.setState({ interestResults: value })

      const assessments = {
        workPreferences: this.state.workPreferenceResults, interests: value,
        skills: this.state.newSkillAnswers, personality: this.state.personalityResults,
        values: this.state.valuesResults
      }

      const isCompleted = this.checkSectionCompleteness('assessment', assessments, this.state.requiredCareerAssessments)
      const taskIndex = this.state.tasks.findIndex((element) => element.shorthand === 'careerAssessments')
      this.actionTapped(taskIndex, isCompleted)
      // console.log('isCompleted called: ', isCompleted, taskIndex, this.state.tasks)

    } else if (name === 'skills') {
      console.log('show skillValue: ', value)
      this.setState({ newSkillAnswers: value })

      const assessments = {
        workPreferences: this.state.workPreferenceResults, interests: this.state.interestResults,
        skills: value, personality: this.state.personalityResults,
        values: this.state.valuesResults
      }

      const isCompleted = this.checkSectionCompleteness('assessment', assessments, this.state.requiredCareerAssessments)
      const taskIndex = this.state.tasks.findIndex((element) => element.shorthand === 'careerAssessments')
      this.actionTapped(taskIndex, isCompleted)
    } else if (name === 'personality') {
      console.log('show personalityValue: ', value)
      this.setState({ personalityResults: value })

      const assessments = {
        workPreferences: this.state.workPreferenceResults, interests: this.state.interestResults,
        skills: this.state.newSkillAnswers, personality: value,
        values: this.state.valuesResults
      }

      const isCompleted = this.checkSectionCompleteness('assessment', assessments, this.state.requiredCareerAssessments)
      const taskIndex = this.state.tasks.findIndex((element) => element.shorthand === 'careerAssessments')
      this.actionTapped(taskIndex, isCompleted)
    } else if (name === 'values') {
      console.log('show valueValue: ', value)
      if (value) {
        const topGravitateValues = value.topGravitateValues
        const topEmployerValues = value.topEmployerValues
        this.setState({ valuesResults: value, topGravitateValues, topEmployerValues })

        const assessments = {
          workPreferences: this.state.workPreferenceResults, interests: this.state.interestResults,
          skills: this.state.newSkillAnswers, personality: this.state.personalityResults,
          values: value
        }

        const isCompleted = this.checkSectionCompleteness('assessment', assessments, this.state.requiredCareerAssessments)
        const taskIndex = this.state.tasks.findIndex((element) => element.shorthand === 'careerAssessments')
        this.actionTapped(taskIndex, isCompleted)
      }
    } else {
      if (source === 'basic') {
        this.setState({ [name]: value, basicFormHasChanged: true })

        let basicInfo = {
          firstName: this.state.firstName, lastName: this.state.lastName,
          schoolName: this.state.schoolName, gradYear: this.state.gradYear, education: this.state.education
        }
        basicInfo[name] = value

        const isCompleted = this.checkSectionCompleteness('basicInfo', basicInfo, this.state.requiredBasicValues)
        const taskIndex = this.state.tasks.findIndex((element) => element.shorthand === 'basicInfo')
        this.actionTapped(taskIndex, isCompleted)


      } else {
        this.setState({ [name]: value })
      }
    }
  }

  renderExpandedTask(task, index) {
    console.log('renderExpandedTask called', task, index)

    if (task.shorthand === 'basicInfo') {
      // schoolName, major, gradYear, linkedIn, github, portfolioLink, phoneNumber,

      return (
        <View key={"expandedTask" + index} style={[styles.topPadding]}>
          <SubEditProfileDetails passedType="Basic" passData={this.passData} navigation={this.props.navigation} fromApply={true}/>
        </View>
      )
    } else if (task.shorthand === 'profileDetails') {
      return (
        <View key={"expandedTask" + index} style={[styles.topPadding]}>
          <SubEditProfileDetails passedType="Details" passData={this.passData} navigation={this.props.navigation} fromApply={true}/>
        </View>
      )

    } else if (task.shorthand === 'careerAssessments') {
      return (
        <View key={"expandedTask" + index} style={[styles.topPadding]}>
          <SubAssessments email={this.state.emailId} passData={this.passData} benchmarkId={this.state.selectedPosting.benchmarkId} tracks={this.state.selectedPosting.tracks} navigation={this.props.navigation} fromApply={true}/>
        </View>
      )
    } else if (task.shorthand === 'endorsements') {
      return (
        <View key={"expandedTask" + index} style={[styles.topPadding]}>
          <SubEndorsements email={this.state.emailId} navigation={this.props.navigation} passData={this.passData} selectedOpportunity={this.state.selectedPosting} fromApply={true}/>
        </View>
      )
    } else if (task.shorthand === 'resume') {
      return (
        <View key={"expandedTask" + index} style={[styles.topPadding]}>
          {(this.state.tasks[index].message !== '' && this.state.tasks[index].name === 'Add Resume Website URL') ? (
            <View style={[styles.rowDirection,styles.flex1]}>
              <View style={[styles.flex5]} />
              <View style={[styles.flex80]}>
                <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.formChangeHandler('resumeURL', text)}
                  value={this.state.resumeURL}
                  placeholder={value.placeholder}
                  placeholderTextColor="grey"
                />
              </View>
              <View style={[styles.flex15]} />
            </View>
          ) : (
            <View>
              <View>
                {(this.state.tasks[index].action === 'Upload') ? (
                  <View>
                    <View>
                      <Text style={[styles.row10]}>Submit New Resume</Text>

                      <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.formChangeHandler('resume',null)}>
                        <Text style={[styles.descriptionText1,styles.whiteColor]}>Upload New</Text>
                      </TouchableOpacity>
                    </View>
                    {(this.state.resumes && this.state.resumes.length > 0) && (
                      <View>
                        <View style={[styles.row10]}>
                          <Text style={[styles.boldText,styles.descriptionText3,styles.descriptionTextColor,styles.topPadding]}>OR</Text>
                        </View>
                        <View style={[styles.bottomPadding]}>
                          <Text style={[styles.row10]}>Submit Existing Resume from Profile</Text>
                          <View style={[styles.calcColumn60]}>
                            {(Platform.OS === 'ios') ? (
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: "Resume", selectedIndex: null, selectedName: "resumeName", selectedValue: this.state.resumeName, selectedOptions: this.state.resumeNames, selectedSubKey: null })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{this.state.resumeName}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            ) : (
                              <Picker
                                selectedValue={this.state.resumeName}
                                onValueChange={(itemValue, itemIndex) =>
                                  this.formChangeHandler("resumeName",itemValue)
                                }>
                                {this.state.resumeNames.map(value2 => <Picker.Item key={value2} label={value2} value={value2} />)}
                              </Picker>
                            )}

                          </View>

                        </View>
                      </View>
                    )}

                  </View>
                ) : (
                  <View style={[styles.width70,styles.rightText,styles.rightPadding]}>
                    <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor]} onPress={() => this.actionTapped(index)}><Text style={[styles.descriptionText1, styles.whiteColor]}>{this.state.tasks[index].action}</Text></TouchableOpacity>
                  </View>
                )}
              </View>

            </View>
          )}
        </View>
      )
    } else if (task.shorthand === 'coverLetter' || task.shorthand === 'identification' || task.shorthand === 'transcript' || task.shorthand === 'letterOfRecommendation' ) {
      return (
        <View key={this.state.tasks[index].shorthand + index} style={[styles.topPadding]}>
          <View>
            <View style={[styles.width70,styles.rightText,styles.rightPadding]}>
              {(this.state.tasks[index].action === 'Upload') ? (
                <View>

                  <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.formChangeHandler(task.shorthand,null)}>
                    <Text style={[styles.descriptionText1,styles.whiteColor]}>Upload New</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor]} onPress={() => this.actionTapped(index)}><Text style={[styles.descriptionText1,styles.whiteColor]}>{this.state.tasks[index].action}</Text></TouchableOpacity>
              )}
            </View>

          </View>
        </View>
      )
    } else if (task.shorthand === 'thirdPartyAssessments') {
      return (
        <View key={"expandedTask" + index} style={[styles.topPadding]}>
          <View style={[styles.row10]}>
            {this.renderQuestions(task.shorthand)}
          </View>
        </View>
      )
    } else if (task.shorthand === 'dealBreakers') {
      return (
        <View key={"expandedTask" + index} style={[styles.topPadding]}>
          <View style={[styles.row10]}>
            {this.renderQuestions(task.shorthand)}
          </View>
        </View>
      )
    } else if (task.shorthand === 'customAssessment') {
      return (
        <View key={"expandedTask" + index} style={[styles.topPadding]}>
          <View style={[styles.row10]}>
            {this.renderQuestions(task.shorthand)}
          </View>
        </View>
      )
    }
  }

  renderQuestions(taskShorthand) {
    console.log('renderQuestions called', taskShorthand)

    let items = []
    let responses = this.state.responses
    if (taskShorthand === 'thirdPartyAssessments') {
      // console.log('t0', this.state.thirdPartyAssessments)
      items = this.state.thirdPartyAssessments
      responses = this.state.tpaResponses
    } else if (taskShorthand === 'dealBreakers') {
      items = this.state.dealBreakers
      responses = this.state.dbResponses
    } else if (taskShorthand === 'customAssessment') {
      if (this.state.customAssessment) {
        items = this.state.customAssessment.questions
        responses = this.state.responses
      }
    }

    let rows = []
    if (items && items.length > 0) {
      console.log('show items: ', items)
      for (let i = 1; i <= items.length; i++) {
        const index = i - 1
        const question = items[index]
        const response = responses[index]
        // console.log('looping: ', i - 1, question, response)
        rows.push(
          <View key={"question|" + i} style={[styles.row10]}>
            {(question.prompt) && (
              <View>
                <Text style={[styles.headingText5,styles.boldText]}>{question.prompt}</Text>

                <View style={[styles.spacer]} />
                <View style={[styles.horizontalLine]} />
                <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
              </View>
            )}

            <View>
              <Text style={[styles.capitalizeText,styles.boldText]}>{i}. {question.name}</Text>

              <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
            </View>

            {(question.questionType === 'Short Answer') && (
              <View>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.formChangeHandler("listedAnswer|shortAnswer|" + index, text)}
                  value={response}
                  placeholder="Write your answer..."
                  placeholderTextColor="grey"
                />
              </View>
            )}

            {(question.questionType === 'Long Answer') && (
              <View>
                <TextInput
                  style={styles.textArea}
                  onChangeText={(text) => this.formChangeHandler("listedAnswer|longAnswer|" + index, text)}
                  value={response}
                  placeholder="Write your answer..."
                  placeholderTextColor="grey"
                  multiline={true}
                  numberOfLines={4}
                />
              </View>
            )}

            {(question.questionType === 'Email') && (
              <View>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.formChangeHandler("listedAnswer|email|" + index, text)}
                  value={response}
                  placeholder="Write your email..."
                  placeholderTextColor="grey"
                />
              </View>
            )}

            {(question.questionType === 'Birthdate') && (
              <View>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.formChangeHandler("listedAnswer|birthdate|" + index, text)}
                  value={response}
                  placeholder="Write your birthdate..."
                  placeholderTextColor="grey"
                />
              </View>
            )}

            {(question.questionType === 'Multiple Choice') && (
              <View>
                {this.renderAnswerChoices('multipleChoice', index, taskShorthand)}
              </View>
            )}

            {(question.questionType === 'Checkbox') && (
              <View>
                {this.renderAnswerChoices('checkbox', index, taskShorthand)}
              </View>
            )}

            {(question.questionType === 'Ranking') && (
              <View>
                <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>Drag and drop options into the order you like.</Text>
                <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                {this.renderRankingChoices(index)}
              </View>
            )}

            {(question.questionType === 'Number Ranges') && (
              <View>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.formChangeHandler("listedAnswer|shortAnswer|" + index + "|" + taskShorthand, text)}
                  value={response}
                  placeholder="0"
                  placeholderTextColor="grey"
                  keyboardType="numeric"
                />
              </View>
            )}

            <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
          </View>
        )
      }
    }

    return rows
  }

  renderAnswerChoices(type, passedIndex, taskShorthand) {
    console.log('renderAnswerChoices called', type, passedIndex, taskShorthand)

    let rows = []

    let questionIndex = passedIndex

    let answerChoices = []
    let screening = false
    let responses = this.state.responses

    if (taskShorthand === 'thirdPartyAssessments') {
      // console.log('t0', this.state.thirdPartyAssessments)
      screening = true
      answerChoices = this.state.thirdPartyAssessments[questionIndex].screeningAnswerChoices
      responses = this.state.tpaResponses
    } else if (taskShorthand === 'dealBreakers') {
      screening = true
      answerChoices = this.state.dealBreakers[questionIndex].screeningAnswerChoices
      responses = this.state.dbResponses
    } else if (taskShorthand === 'customAssessment') {
      if (this.state.customAssessment) {
        answerChoices = this.state.customAssessment.questions[questionIndex].answerChoices
        if (this.state.customAssessment.type === 'Screening') {
          screening = true
          answerChoices = this.state.customAssessment.questions[questionIndex].screeningAnswerChoices
          responses = this.state.responses
        }
      }
    }

    if (type === 'multipleChoice') {

      if (answerChoices) {

        rows.push(
          <View key={answerChoices + passedIndex} style={[styles.topPadding]}>
            {(answerChoices) && (
              <View style={[styles.rowDirection,styles.flexWrap]}>
                {answerChoices.map((value, optionIndex) =>
                  <View key={passedIndex}>
                    <View style={[styles.row5,styles.rightPadding]}>
                      {(screening) ? (
                        <View>
                          {(responses[passedIndex] === answerChoices[optionIndex].name) ? (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder,styles.ctaBackgroundColor]} onPress={() => this.formChangeHandler({ target: { name: "listedAnswer|multipleChoice|" + passedIndex + "|" + taskShorthand, value: answerChoices[optionIndex].name}}) }>
                                <Text style={[styles.descriptionText1,styles.whiteColor]}>{value.name}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder]} onPress={() => this.formChangeHandler({ target: { name: "listedAnswer|multipleChoice|" + passedIndex + "|" + taskShorthand, value: answerChoices[optionIndex].name }}) }>
                                <Text style={[styles.descriptionText2]}>{value.name}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View>
                          {(responses[passedIndex] === answerChoices[optionIndex]) ? (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder,styles.ctaBackgroundColor]} onPress={() => this.formChangeHandler({ target: { name: "listedAnswer|multipleChoice|" + passedIndex, value: answerChoices[optionIndex]}}) }>
                                <Text style={[styles.descriptionText1,styles.whiteColor]}>{value}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder]} onPress={() => this.formChangeHandler({ target: { name: "listedAnswer|multipleChoice|" + passedIndex, value: answerChoices[optionIndex]}}) }>
                                <Text style={[styles.descriptionText2]}>{value}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                  </View>
                )}

              </View>
            )}
          </View>
        )
      }

    } else if (type === 'checkbox') {

      if (answerChoices) {

        rows.push(
          <View key={answerChoices + passedIndex} style={[styles.topPadding]}>
            {(answerChoices) && (
              <View style={[styles.rowDirection,styles.flexWrap]}>
                {answerChoices.map((value, optionIndex) =>
                  <View key={passedIndex}>
                    <View style={[styles.row5,styles.rightPadding]}>

                      {(screening) ? (
                        <View>
                          {(Array.isArray(responses[passedIndex]) && responses[passedIndex].includes(answerChoices[optionIndex].name)) ? (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder,styles.ctaBackgroundColor]} onPress={() => this.formChangeHandler({ target: { name: "listedAnswer|multipleAnswer|" + passedIndex, value: answerChoices[optionIndex].name}}) }>
                                <Text style={[styles.descriptionText1,styles.whiteColor]}>{value.name}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder]} onPress={() => this.formChangeHandler({ target: { name: "listedAnswer|multipleAnswer|" + passedIndex, value: answerChoices[optionIndex].name}}) }>
                                <Text style={[styles.descriptionText2]}>{value.name}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View>
                          {(Array.isArray(responses[passedIndex]) && responses[passedIndex].includes(answerChoices[optionIndex])) ? (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder,styles.ctaBackgroundColor]} onPress={() => this.formChangeHandler({ target: { name: "listedAnswer|multipleAnswer|" + passedIndex, value: this.state.customAssessment.questions[passedIndex].answerChoices[optionIndex]}}) }>
                                <Text style={[styles.descriptionText1,styles.whiteColor]}>{value}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder]} onPress={() => this.formChangeHandler({ target: { name: "listedAnswer|multipleAnswer|" + passedIndex, value: answerChoices[optionIndex]}}) }>
                                <Text style={[styles.descriptionText2]}>{value}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                  </View>
                )}

              </View>
            )}
          </View>
        )
      }
    }

    return rows
  }

  renderRankingChoices(passedIndex) {
    console.log('renderRankingChoices called', passedIndex)

    let rankingAnswerChoices = this.state.rankingAnswerChoices
    let droppableId = '111'
    rankingAnswerChoices = this.state.customAssessment.questions[passedIndex].answerChoices
    droppableId = this.state.customAssessment.questions[passedIndex]._id

    if (this.state.responses[passedIndex] && Array.isArray(this.state.responses[passedIndex])) {
      rankingAnswerChoices = this.state.responses[passedIndex]
    }

    console.log('show droppableId: ', droppableId)

    return (
      <View>
        {/*
        <DragDropContext onDragEnd={this.onDragEnd}>
          <Droppable droppableId={droppableId}>
            {(provided, snapshot) => (
              <div
                ref={provided.innerRef}
                style={getListStyle(snapshot.isDraggingOver)}
              >
                {rankingAnswerChoices.map((item, index) => (
                  <Draggable key={item} draggableId={item} index={index}>
                    {(provided, snapshot) => (
                      <div
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={getItemStyle(
                          snapshot.isDragging,
                          provided.draggableProps.style
                        )}
                      >
                        {item}
                      </View>
                    )}
                  </Draggable>
                ))}
                {provided.placeholder}
              </View>
            )}
          </Droppable>
        </DragDropContext>*/}
      </View>
    )
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }
    console.log('show result: ', result)
    let answerChoices = []
    let questionIndex = 0
    for (let i = 1; i <= this.state.customAssessment.questions.length; i++) {
      console.log('compare the two: ',this.state.customAssessment.questions[i - 1]._id, result.destination.droppableId)
      if (this.state.customAssessment.questions[i - 1]._id === result.destination.droppableId) {
        answerChoices = this.state.customAssessment.questions[i - 1].answerChoices
        questionIndex = i - 1
        console.log('did this work?', answerChoices, questionIndex)
      }
    }

    const rankingAnswerChoices = reorder( answerChoices, result.source.index, result.destination.index );

    let customAssessment = this.state.customAssessment
    customAssessment['questions'][questionIndex]['answerChoices'] = rankingAnswerChoices

    let responses = this.state.responses
    responses[questionIndex] = rankingAnswerChoices

    this.setState({ customAssessment, responses })
  }

  optionClicked(index, optionIndex) {
    console.log('optionClicked called', index, optionIndex)

    let questions = this.state.questions

    if (questions[index].answer) {
      if (questions[index]['answer'].includes(questions[index].options[optionIndex])) {
        const removeIndex = questions[index]['answer'].indexOf(questions[index].options[optionIndex])
        questions[index]['answer'].splice(removeIndex, 1)

      } else {
        questions[index]['answer'].push(questions[index].options[optionIndex])
      }
    } else {
      questions[index]['answer'] = [questions[index].options[optionIndex]]
    }

    this.setState({ questions })

  }

  switchWorkspaces() {
    console.log('switchWorkspaces called')

    let myOrgs = AsyncStorage.getItem('myOrgs');
    console.log('show myOrgs: ', myOrgs)
    if (myOrgs && myOrgs.includes(this.state.selectedPosting.orgCode)) {

      this.setState({ serverSuccessMessage: null, serverErrorMessage: null })

      const emailId = this.state.emailId
      const activeOrg = this.state.selectedPosting.orgCode
      const updatedAt = new Date()

      Axios.post('https://www.guidedcompass.com/api/users/profile/details', {
        emailId, activeOrg, updatedAt })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Org switch worked', response.data);

          AsyncStorage.setItem('activeOrg', activeOrg)
          this.setState({ activeOrg })
          this.props.passActiveOrg(activeOrg)

        } else {
          console.error('there was an error switching the orgs');

        }
      }).catch((error) => {
          console.log('Org switch did not work', error);
      });
    } else {
      this.props.navigation.navigate('AddWorkspaces', { orgCode: this.state.selectedPosting.orgCode, postingId: this.state.selectedPosting._id })
    }

  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false })
  }

  render() {

      return (
          <ScrollView>
              { this.state.selectedPosting && (
                <View style={[styles.card,styles.topMargin20]}>
                    <View style={[styles.spacer]} />
                    <View>
                      {this.state.selectedPosting.postType === 'Track' ? (
                        <Text style={[styles.headingText2]}>Apply to join the {this.state.selectedPosting.title}</Text>
                      ) : (
                        <View>
                          {(this.state.selectedPosting.employerName) ? (
                            <View>
                              {(this.state.activeOrg === 'exp') ? (
                                <Text style={[styles.headingText2]}>Please Complete the {this.state.selectedPosting.title}</Text>
                              ) : (
                                <Text style={[styles.headingText2]}>{(this.state.activeOrg === 'c2c') ? "Request a referral to" : "Apply for"} {this.state.selectedPosting.title} at {this.state.selectedPosting.employerName}</Text>
                              )}
                            </View>
                          ) : (
                            <Text style={[styles.headingText2]}>Apply to {this.state.selectedPosting.title}</Text>
                          )}
                        </View>
                      )}
                    </View>

                    {(this.state.selectedPosting.orgCode === this.state.activeOrg || (this.state.placementPartners && this.state.placementPartners.includes(this.state.activeOrg)) || (this.state.postingOrgCode === 'sandbox')) ? (
                      <View>
                        {(this.state.application) && (
                          <View style={[styles.calcColumn60]}>
                            <Text cstyle={[styles.descriptionText2,styles.centerText,styles.errorColor,styles.boldText]}>You have already submitted this application, but you can update at any time. To update, you must import and confirm all parts of the application and then re-submit.</Text>
                          </View>
                        )}

                        <View style={[styles.topPadding20]}>
                          <Text style={[styles.descriptionText2]}><Text style={[styles.boldText,styles.errorColor]}>*</Text> Asterisks indicate that this component is required to submit.</Text>
                        </View>

                        <View>
                          {this.renderTasks()}
                        </View>

                        <View style={[styles.calcColumn60,styles.row20]}>
                          { (this.state.clientErrorMessage!== '') && <Text style={[styles.errorColor,styles.bottomPadding20]}>{this.state.clientErrorMessage}</Text> }
                          { (this.state.serverSuccess) ? (
                            <View>
                              {(this.state.serverSuccessMessage) && <Text style={[styles.ctaColor,styles.bottomPadding20]}>{this.state.serverSuccessMessage}</Text>}
                            </View>
                          ) : (
                            <View>
                              {(this.state.serverErrorMessage) && <Text style={[styles.errorColor,styles.bottomPadding20]}>{this.state.serverErrorMessage}</Text>}
                            </View>
                          )}

                          {(this.state.isSaving) ? (
                            <View style={[styles.leftPadding20]}>
                              <TouchableOpacity disabled={true} style={[styles.btnPrimary,styles.mediumBackground,styles.standardBorder,styles.flexCenter]} onPress={() => this.apply()}><Text style={[styles.standardText,styles.whiteColor]}>..saving...</Text></TouchableOpacity>
                            </View>
                          ) : (
                            <View>
                              {(this.state.applicationSubmitted) ? (
                                <View>
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Opportunities')}style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.descriptionText1,styles.whiteColor]}>Browse Other Postings</Text></TouchableOpacity>
                                </View>
                              ) :(
                                <View>
                                  {(this.state.applicationComplete) ? (
                                    <View>
                                      <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.apply()}><Text style={[styles.standardText,styles.whiteColor]}>{this.state.application ? "Update" : "Submit"}</Text></TouchableOpacity>
                                    </View>
                                  ) : (
                                    <View>
                                      <TouchableOpacity style={[styles.btnPrimary,styles.mediumBackground,styles.standardBorder,styles.flexCenter]} onPress={() => this.apply()}><Text style={[styles.standardText,styles.whiteColor]}>{this.state.application ? "Update" : "Submit"}</Text></TouchableOpacity>
                                    </View>
                                  )}
                                </View>
                              )}
                            </View>
                          )}

                        </View>
                      </View>
                    ) : (
                      <View style={[styles.row20]}>
                        <Text style={[styles.errorColor]}>You must apply for this opportunity in the {this.state.selectedPosting.orgName} workspace. Click <TouchableOpacity onPress={() => this.switchWorkspaces()}><Text style={[styles.standardText,styles.ctaColor]}>here</Text></TouchableOpacity> to switch workspaces.</Text>
                      </View>
                    )}

                </View>
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
             </Modal>
          </ScrollView>
      )
  }

}

export default Apply;
