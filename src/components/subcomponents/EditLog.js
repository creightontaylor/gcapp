import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, TextInput, AsyncStorage, Image, Platform, Switch, ActivityIndicator, Linking } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from "react-native-modal";
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png'
const addCircleOutlineIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-circle-outline-icon.png'
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png'
const exitIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/exit-icon.png'
const experienceIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/experience-icon.png'
const skillsIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/skills-icon.png'
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png'
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png'
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';
const addIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon-blue.png';
const questionMarkBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/question-mark-blue.png';
const feedbackIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/feedback-icon-dark.png';
const feedbackIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/feedback-icon-blue.png';
const thumbsUpIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/thumbs-up-icon.png';
const thumbsUpBlueIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/thumbs-up-blue-icon.png';
const thumbsDownIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/thumbs-down-icon.png';
const thumbsDownOrangeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/thumbs-down-orange-icon.png';

import SubPeopleMatching from '../subcomponents/PeopleMatching';
import SubCourses from '../subcomponents/Courses';
import SubCareers from '../subcomponents/Careers';
import SubOpportunities from '../subcomponents/Opportunities';
import SubPicker from '../common/SubPicker';

import {convertDateToString} from '../functions/convertDateToString';
import {convertStringToDate} from '../functions/convertStringToDate';

class EditLog extends Component {
  constructor(props) {
    super(props)
    this.state = {
      goalType: { name: ''},
      showModule: true,
      pollConnections: true,
      extraPaddingForKeyboard: true,

      selectedCareers: [],
      selectedCareerDetails: [],
      selectedOpportunities: [],
      selectedOpportunityDetails: [],
      selectedSkills: [],
      selectedSkillDetails: [],
      selectedCompetencyDetails: [],
      selectedMembers: [],
      selectedMemberDetails: [],
      selectedSchools: [],
      selectedMajors: [],

      firstName: '',
      lastName: '',
      email: '',
      sessionDate: '',
      category: '',
      notes: '',
      sessionMethod: '',

      logId: '',

      goalId: '',
      goalTitle: '',
      goalDescription: '',
      goalDeadline: '',
      tasks: [],
      requestedMentorSupport: '',
      goalStatus: '',
      goalNotes: '',

      taskId: '',
      taskName: '',
      taskDeadline: '',
      associatedGoal: '',

      applicationId: '',
      employerName: '',
      employerURL: '',
      employerType: '',
      employerIndustry: '',
      employeeCount: '',
      positionTitle: '',
      workType: '',
      positionFunction: '',
      positionLink: '',
      timeframe: '',
      applicationDeadline: '',
      reviewedMaterials: '',

      interviewId: '',
      associatedApplication: { name: 'Attach a Saved Application'},
      positionRating: '',
      companyRating: '',
      fitRating: '',

      offerId: '',
      offerAssociatedApplication: { name: 'Attach a Saved Application'},
      offerPayType: 'Hourly',
      offerPay: '',
      hasBonus: false,
      bonusDescription: '',
      offerBenefits: '',
      offeredEquity: false,
      equityPercentage: '',
      companyValuation: '',
      offerStartDate: '',
      offerDecision: '',
      decisionReason: '',

      passionId: '',
      passionTitle: '',
      passionReason: '',

      interviews: [],
      editExisting: false,

      mcPracticedInterviewing: false,
      wasPrepared: false,
      passed: false,
      interviewDate: '',
      repeats: 'Every Week',

      logType: 'Goal',
      questionsAsked: [],
      questionsAnswered: [],

      logTypeOptions: [],
      employerTypeOptions: [],
      industryOptions: [],
      employeeCountOptions: [],
      functionOptions: [],
      binaryOptions: ['','Yes','No'],
      applicationOptions: [],
      ratingOptions: ['','1','2','3','4','5'],
      payTypeOptions: [],
      hourlyPayOptions: [],
      annualPayOptions: [],
      equityPercentageOptions: [],
      valuationOptions: [],
      workTypeOptions: [],
      timeframeOptions: ['','Summer','Fall','Winter','Spring'],
      interviewRoundOptions: ['','Round 1','Round 2','Round 3','Round 4 or More'],
      numberOfInterviewsOptions: ['','1','2','3','4','5 or More'],
      interviewLengthOptions: ['','Fewer than 15 Minutes','15 Minutes','30 Minutes','45 Minutes','60 Minutes','More than 60 Minutes'],
      entrepreneurshipStageOptions: ['','Idea','Development','Early','Growth','Expansion','Maturity'],
      projectOptions: [{ name: '' }],
      entrepreneurshipProject: { name: '' },
      goalTypeOptions: [{ name: ''}],
      optimizeOptions: ['','Stability','Mission','Interest / Passion','Prestige / Recognition','Pay'],
      hoursPerWeekOptions: [],
      degreeOptions: [],
      skillPreferenceOptions: [],
      societalProblemOptions: [],
      comparisonTypeOptions: ['','Careers','Competencies','Projects','Jobs'],
      repeatOptions: ['Never','Every Day','Every Week','Every 2 Weeks','Every Month','Every Year'],
      reminderOptions: ['None','At time of event','5 minutes before','10 minutes before','15 minutes before','30 minutes before','1 hour before','2 hous before','1 day before','2 days before','1 week before'],
      goalStatusOptions: [],
      methodOptions: [],
      sessionMethodOptions: [],
      categoryOptions: [],

      repeat: 'Never',
      reminder: 'None',
      currentPage: 'Details',
      subNavCategories: ['Details','Suggestions','People','Courses','Events','Projects','Work'],

      selectedFunctions: [],
      selectedIndustries: [],
      selectedHours: [],
      selectedPayRanges: [],
      selectedOptimizeOptions: [],

      recipients: [],
      competencies: [],

      stageIndex: 1,
      stageCount: 20,

      clientErrorMessage: '',
      serverPostSuccess: true,
      serverSuccessMessage: '',
      serverErrorMessage: ''
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.saveLog = this.saveLog.bind(this)
    this.deleteLog = this.deleteLog.bind(this)
    this.addRemoveItems = this.addRemoveItems.bind(this)
    this.toggleEditMode = this.toggleEditMode.bind(this)

    this.renderItems = this.renderItems.bind(this)

    this.renderTags = this.renderTags.bind(this)
    this.addItem = this.addItem.bind(this)
    this.removeTag = this.removeTag.bind(this)

    this.searchItems = this.searchItems.bind(this)
    this.searchItemClicked = this.searchItemClicked.bind(this)
    this.adjustCoreCompetencies = this.adjustCoreCompetencies.bind(this)
    this.subNavClicked = this.subNavClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.renderDetails = this.renderDetails.bind(this)
    this.prepareDate = this.prepareDate.bind(this)
    this.renderSuggestion = this.renderSuggestion.bind(this)
    this.itemClicked = this.itemClicked.bind(this)
    this.saveSuggestion = this.saveSuggestion.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ')

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData()
    } else if (this.props.log !== prevProps.log || this.props.logId !== prevProps.logId) {
      this.retrieveData()
    } else if (this.props.modalIsOpen !== prevProps.modalIsOpen || this.props.modalIsOpen !== prevProps.modalIsOpen) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      console.log('retrieveData called in EditLog')

      const emailId = await AsyncStorage.getItem('email')
      const email = emailId
      const username = await AsyncStorage.getItem('username');
      const cuFirstName = await AsyncStorage.getItem('firstName');
      const cuLastName = await AsyncStorage.getItem('lastName');
      // const pictureURL = await AsyncStorage.getItem('pictureURL');
      const orgFocus = await AsyncStorage.getItem('orgFocus');
      const orgName = await AsyncStorage.getItem('orgName');
      const roleName = await AsyncStorage.getItem('roleName');
      const remoteAuth = await AsyncStorage.getItem('remoteAuth');

      let activeOrg = await AsyncStorage.getItem('activeOrg')
      // if (!activeOrg) {
      //   activeOrg = 'guidedcompass'
      // }
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (activeOrg) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        let logType = 'Goal'
        let logTypeOptions = ['Goal','Session','Application','Interview','Offer','Passion']

        const editExisting = this.props.editExisting
        let log = this.props.log
        const logs = this.props.logs
        const selectedAdvisor = this.props.selectedAdvisor
        const passedLogType = this.props.passedLogType
        const logId = this.props.logId
        // const modalIsOpen = this.props.modalIsOpen
        const selectedGroup = this.props.selectedGroup

        let applicationOptions = ['']
        if (logs) {
          for (let i = 1; i <= logs.length; i++) {
            console.log('show the count', logs[i - 1].logType)
            if (logs[i - 1].logType === 'Application') {
              applicationOptions.push(logs[i - 1].positionTitle + " | " + logs[i - 1].employerName )
            }
          }
        }

        const payTypeOptions = ['Hourly','Annual']
        const equityPercentageOptions = ['< 0.1%','0.1% - 0.5%','0.5% - 1%','1% - 5%','5% - 10%',
          '10% - 20%','20% - 30%','30% - 50%','> 50%'
        ]
        const valuationOptions = ['< $1MM','$1MM - $5MM','$5MM - $10MM','$10MM - $50MM','$50MM - $100MM',
          '$100MM - $500MM','$500MM - $1B','$1B - $10B','$10B - $100B','> $100B'
        ]

        let tempRecipients = []
        if (selectedAdvisor) {
          console.log('show advisor: ', selectedAdvisor)
          tempRecipients.push({ firstName: selectedAdvisor.advisorFirstName, lastName: selectedAdvisor.advisorLastName, email: selectedAdvisor.advisorEmail })
        }

        let pathNameVariable = 'postings'
        if (this.state.showModule) {
          pathNameVariable = 'opportunities'
        }

        // let goalTypeOptions = [
        //   { name: ''},
        //   { name: 'Alternatives', description: 'Choose from alternatives'},
        //   { name: 'Career', description: 'Land a job'},
        //   { name: 'Freelance', description: 'Become a freelancer'},
        //   { name: 'Entrepreneurship - Start', description: 'Start a business'},
        //   { name: 'Entrepreneurship', description: 'Grow a business'},
        //   { name: 'Explore', description: 'Explore careers'},
        //   { name: 'Purpose', description: 'Find my purpose'},
        //   { name: 'Learn New Skills', description: 'Learn new skill(s)'},
        //   { name: 'Degree', description: 'Earn an educational degree'},
        //   { name: 'Network', description: 'Develop a robust network'},
        //   { name: 'Social Problem', description: 'Solve a social problem'},
        //   { name: 'Personal', description: 'Personal'},
        // ]
        //
        // let includesAdults = false
        // if (includesAdults) {
        //   goalTypeOptions = [
        //     { name: ''},
        //     { name: 'Alternatives', description: 'Choose from alternatives'},
        //     { name: 'Career', description: 'Land a job'},
        //     { name: 'Switch', description: 'Make a career switch'},
        //     { name: 'Freelance', description: 'Become a freelancer'},
        //     { name: 'Entrepreneurship - Start', description: 'Start a business'},
        //     { name: 'Entrepreneurship', description: 'Grow a business'},
        //     { name: 'Explore', description: 'Explore careers'},
        //     { name: 'Purpose', description: 'Find my purpose'},
        //     { name: 'Learn New Skills', description: 'Learn new skill(s)'},
        //     { name: 'Degree', description: 'Earn an educational degree'},
        //     { name: 'Leadership', description: 'Reach a leadership position'},
        //     { name: 'Expert', description: 'Become an expert in a field'},
        //     { name: 'Promotion', description: 'Land a promotion'},
        //     { name: 'Award', description: 'Win an industry award'},
        //     { name: 'Pay', description: 'Increase earnings'},
        //     { name: 'Efficient', description: 'Become more efficient'},
        //     { name: 'Work-Life Balance', description: 'Increase work-life balance'},
        //     { name: 'Network', description: 'Develop a robust network'},
        //     { name: 'Social Problem', description: 'Solve a social problem'},
        //     { name: 'Personal', description: 'Personal'},
        //   ]
        // }
        //

        // goalTypeOptions.sort(function(a,b) {
        //   return b.description - a.description;
        // })

        const skillPreferenceOptions = ['','Basics','Stability','Pay','Your Interests']

        const entrepreneurshipGoalOptions = [
          '','Overall Skills','Legal Formation','Market Research','Building a Team','Building an App MVP',
          'Selling Goods / Services Online','Marketing Your Product','Selling Your Product','Raising Funding',
          'Product Design','Forecasting and Budgeting','Other'
        ]

        const intensityOptions =  ['','Aggressive (> 40 hrs / week)','Moderately Aggressive (20 - 40 hrs / week)','Moderate (10 - 20 hrs / week)','Moderately Passive (4 - 10 hrs / week)','Passive (1 - 4 hrs / week)']

        const goalStatusOptions = ["","Have Not Begun","Partially Complete","Complete"]
        const methodOptions = ["","In Person","Remote"]
        const sessionMethodOptions = ["","In Person","Video Call","Phone Call","Text Message / Chat","Email"]
        const categoryOptions = ["","General","Career Exploration","Goal Specification","Achievement Strategy","Resume Review","Mock Interview","Other"]

        this.setState({
            emailId: email, cuFirstName, cuLastName, username, roleName, remoteAuth, selectedGroup,
            sessionDate: new Date(), activeOrg, logType, logTypeOptions,
            applicationOptions, payTypeOptions, equityPercentageOptions, valuationOptions,
            editExisting, log, logs, recipients: tempRecipients, pathNameVariable,
            entrepreneurshipGoalOptions, intensityOptions, skillPreferenceOptions,
            goalStatusOptions,methodOptions,sessionMethodOptions,categoryOptions
        });

        let headerTitle = 'Create Log'
        if (editExisting) {
          headerTitle = 'Edit ' + log.logType
        }

        this.props.navigation.setOptions({ headerTitle })

        Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId: email } })
         .then((response2) => {
           console.log('query for assessment results worked');

           if (response2.data.success) {

             console.log('actual assessment results')

             let profile = { firstName: cuFirstName, lastName: cuLastName, email }
             profile['workPreferences'] = response2.data.results.workPreferenceAnswers
             profile['interests'] = response2.data.results.interestScores
             profile['personality'] = response2.data.results.personalityScores
             profile['skills'] = response2.data.results.newSkillAnswers
             profile['gravitateValues'] = response2.data.results.topGravitateValues
             profile['employerValues'] = response2.data.results.topEmployerValues

             this.setState({ profile })

           } else {
             console.log('no assessment results', response2.data)
           }

       }).catch((error) => {
         console.log('query for assessment results did not work', error);
       })

        Axios.get('https://www.guidedcompass.com/api/projects', { params: { emailId: email, includeCollaborations: true } })
        .then((response) => {
          console.log('Projects query attempted');

            if (response.data.success) {
              console.log('successfully retrieved projects')

              if (response.data.projects) {

                const projects = response.data.projects
                const projectOptions = [{ name: 'Select a project' }].concat(projects)

                this.setState({ projectOptions })

              }

            } else {
              console.log('no project data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Project query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
        .then((response) => {
          console.log('Org info query attempted');

            if (response.data.success) {
              console.log('org info query worked')

              const orgName = response.data.orgInfo.orgName
              const orgContactEmail = response.data.orgInfo.contactEmail

              this.setState({ orgName, orgContactEmail });

            } else {
              console.log('org info query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
        });

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
        .then((response) => {
          console.log('User profile query attempted');

          if (response.data.success) {
            console.log('successfully retrieved profile')

            const pictureURL = response.data.user.pictureURL
            const headline = response.data.user.headline
            const publicProfile = response.data.user.publicProfile
            const publicProfileExtent = response.data.user.publicProfileExtent
            const publicPreferences = response.data.user.publicPreferences

            this.setState({ pictureURL, headline, publicProfile, publicProfileExtent, publicPreferences })

          } else {
            console.log('user profile data found', response.data.message)
          }

        }).catch((error) => {
            console.log('User profile query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/workoptions')
       .then((response) => {
         console.log('Work options query tried');

         if (response.data.success) {
           console.log('Work options query succeeded')

           let functionOptions = ['']
           for (let i = 1; i <= response.data.workOptions[0].functionOptions.length; i++) {
             if (i > 1) {
               functionOptions.push(response.data.workOptions[0].functionOptions[i - 1])
             }
           }

           let industryOptions = ['']
           for (let i = 1; i <= response.data.workOptions[0].industryOptions.length; i++) {
             if (i > 1) {
               industryOptions.push(response.data.workOptions[0].industryOptions[i - 1])
             }
           }


           let hoursPerWeekOptions = ['']
           for (let i = 1; i <= response.data.workOptions[0].hoursPerWeekOptions.length; i++) {
             if (i > 1) {
               hoursPerWeekOptions.push(response.data.workOptions[0].hoursPerWeekOptions[i - 1])
             }
           }

           let workTypeOptions = ['']
           for (let i = 1; i <= response.data.workOptions[0].workTypeOptions.length; i++) {
             if (i > 1) {
               workTypeOptions.push(response.data.workOptions[0].workTypeOptions[i - 1])
             }
           }

           let employerTypeOptions = ['']
           for (let i = 1; i <= response.data.workOptions[0].employerTypeOptions.length; i++) {
             if (i > 1) {
               employerTypeOptions.push(response.data.workOptions[0].employerTypeOptions[i - 1])
             }
           }

           let employeeCountOptions = ['']
           for (let i = 1; i <= response.data.workOptions[0].employeeCountOptions.length; i++) {
             if (i > 1) {
               employeeCountOptions.push(response.data.workOptions[0].employeeCountOptions[i - 1])
             }
           }

           let hourlyPayOptions = ['']
           for (let i = 1; i <= response.data.workOptions[0].hourlyPayOptions.length; i++) {
             if (i > 1) {
               hourlyPayOptions.push(response.data.workOptions[0].hourlyPayOptions[i - 1])
             }
           }

           let annualPayOptions = ['']
           for (let i = 1; i <= response.data.workOptions[0].annualPayOptions.length; i++) {
             if (i > 1) {
               annualPayOptions.push(response.data.workOptions[0].annualPayOptions[i - 1])
             }
           }

           let degreeOptions = ['']
           for (let i = 1; i <= response.data.workOptions[0].degreeOptions.length; i++) {
             if (i > 1) {
               degreeOptions.push(response.data.workOptions[0].degreeOptions[i - 1])
             }
           }

           let societalProblemOptions = ['']
           for (let i = 1; i <= response.data.workOptions[0].societalProblems.length; i++) {
             if (i > 1) {
               societalProblemOptions.push(response.data.workOptions[0].societalProblems[i - 1])
             }
           }

           let optimizeOptions = [''].concat(response.data.workOptions[0].optimizeOptions)
           let goalTypeOptions = [{ name: ''}]
           for (let i = 1; i <= response.data.workOptions[0].goalTypeOptions.length; i++) {
              if ((orgFocus === 'academy' || orgFocus === 'School') && !response.data.workOptions[0].goalTypeOptions[i - 1].adult) {
                goalTypeOptions.push(response.data.workOptions[0].goalTypeOptions[i - 1])
              } else if ((orgFocus !== 'academy' && orgFocus !== 'School')){
                goalTypeOptions.push(response.data.workOptions[0].goalTypeOptions[i - 1])
              }
            }


           this.setState({ functionOptions, industryOptions, hourlyPayOptions, annualPayOptions,
             hoursPerWeekOptions, workTypeOptions, employerTypeOptions, employeeCountOptions, degreeOptions,
             societalProblemOptions, optimizeOptions, goalTypeOptions
           })


         } else {
           console.log('no jobFamilies data found', response.data.message)

           const functionOptions = []
           const industryOptions = []
           const workDistanceOptions = []
           const hoursPerWeekOptions = []
           const workTypeOptions = []
           const hourlyPayOptions = []
           const annualPayOptions = []

           this.setState({ functionOptions, industryOptions,
           workDistanceOptions, hoursPerWeekOptions, workTypeOptions, hourlyPayOptions, annualPayOptions })

         }
       }).catch((error) => {
           console.log('query for work options did not work', error);
       })

        if (logId !== 'new') {
          if (editExisting) {
            console.log('in editExisting')

            let advisorFirstName = ''
            let advisorLastName = ''
            let advisorEmail = ''
            let selectedMembers = []
            let selectedMemberDetails = []

            if (log) {
              advisorFirstName = log.advisorFirstName
              advisorLastName = log.advisorLastName
              advisorEmail = log.advisorEmail
              selectedMembers = [log.advisorFirstName + ' ' + log.advisorLastName]
              selectedMemberDetails = [
                { firstName: log.advisorFirstName, lastName: log.advisorLastName, email: log.advisorEmail}
              ]
            }

            logType = log.logType

            if (logType === 'Session' || logType === 'Check In') {
              let notes = ''
              if (log.notes) {
                notes = log.notes
              }

              let sessionDate = null
              if (log.sessionDate) {
                if (Platform.OS === 'ios') {
                  sessionDate = log.sessionDate
                } else {
                  sessionDate = log.sessionDate
                  // sessionDate = new Date(log.sessionDate)
                  // const newSessionDate = new Date(sessionDate.getTime() + new Date().getTimezoneOffset()*60000)
                  // sessionDate = convertDateToString(newSessionDate,"hyphenatedDateTime")
                }
              }

              this.setState({
                _id: log._id, sessionId: log._id, advisorFirstName, advisorLastName, advisorEmail,
                sessionDate, category: log.category,
                notes, sessionMethod: log.sessionMethod, createdAt: log.createdAt, selectedMembers, selectedMemberDetails
              })
            } else if (logType === 'Meeting') {
              const meetingId = log._id

              let startTime = null
              if (log.startTime) {
                if (Platform.OS === 'ios') {
                  startTime = log.startTime
                } else {
                  startTime = log.startTime
                }
              }

              // const endTime = convertDateToString(new Date(log.endTime),"rawDateTimeForInput")
              let endTime = null
              if (log.endTime) {
                if (Platform.OS === 'ios') {
                  endTime = log.endTime
                } else {
                  endTime = log.endTime
                }
              }

              const method = log.method
              const location = log.location
              const repeats = log.repeats
              const reminder = log.reminder

              let selectedMembers = this.state.selectedMembers
              let selectedMemberDetails = this.state.selectedMemberDetails
              if (log.selectedMembers) {
                for (let i = 1; i <= log.selectedMembers.length; i++) {
                  selectedMemberDetails.push(log.selectedMembers[i - 1])
                  selectedMembers.push(log.selectedMembers[i - 1].firstName + ' ' + log.selectedMembers[i - 1].lastName)
                }
              }

              const description = log.description
              const links = log.links
              const notes = log.notes
              const actionItems = log.actionItems
              const selectedGroup = { _id: log.groupId, name: log.groupName }

              this.setState({ meetingId, startTime, endTime, method, location, repeats, reminder, selectedMembers,
                selectedMemberDetails, description, links, notes, actionItems, selectedGroup
              })

            } else if (logType === 'Goal') {

              let tasks = []
              if (log.tasks) {
                tasks = log.tasks
              }

              let requestedMentorSupport = ''
              if (log.requestedMentorSupport) {
                requestedMentorSupport = log.requestedMentorSupport
              }

              let notes = ''
              if (log.notes) {
                notes = log.notes
              }

              let goalType = this.state.goalType
              if (log.goalType) {
                goalType = log.goalType
              }

              let selectedCareers = []
              let selectedCareerDetails = []
              if (log.selectedCareers) {
                for (let i = 1; i <= log.selectedCareers.length; i++) {
                  selectedCareerDetails.push(log.selectedCareers[i - 1])
                  selectedCareers.push(log.selectedCareers[i - 1].name)
                }
              }

              let selectedOpportunities = []
              let selectedOpportunityDetails = []
              if (log.selectedOpportunities) {
                console.log('show length: ', log)
                for (let i = 1; i <= log.selectedOpportunities.length; i++) {
                  console.log('show each opportunity: ', i, log.selectedOpportunities[i - 1], selectedOpportunities)
                  selectedOpportunityDetails.push(log.selectedOpportunities[i - 1])
                  if (log.selectedOpportunities[i - 1].title) {
                    selectedOpportunities.push(log.selectedOpportunities[i - 1].title)
                  } else if (log.selectedOpportunities[i - 1].name) {
                    selectedOpportunities.push(log.selectedOpportunities[i - 1].name)
                  }
                }
              }
              console.log('gimme opportunities: ', selectedOpportunities)

              let entrepreneurshipStage = this.state.entrepreneurshipStage
              if (log.entrepreneurshipStage) {
                entrepreneurshipStage = log.entrepreneurshipStage
              }

              let entrepreneurshipGoal = this.state.entrepreneurshipGoal
              if (log.entrepreneurshipGoal) {
                entrepreneurshipGoal = log.entrepreneurshipGoal
              }

              let entrepreneurshipProject = this.state.entrepreneurshipProject
              if (log.entrepreneurshipProject) {
                entrepreneurshipProject = log.entrepreneurshipProject
              }

              let intensity = null
              if (log.intensity) {
                intensity = log.intensity
              }

              let budget = null
              if (log.budget) {
                budget = log.budget
              }

              let competencies = []
              if (log.competencies) {
                competencies = log.competencies
              }

              let selectedFunctions = []
              if (log.selectedFunctions) {
                selectedFunctions = log.selectedFunctions
              }

              let selectedIndustries = []
              if (log.selectedIndustries) {
                selectedIndustries = log.selectedIndustries
              }

              let selectedHours = []
              if (log.selectedHours) {
                selectedHours = log.selectedHours
              }

              let selectedPayRanges = []
              if (log.selectedPayRanges) {
                selectedPayRanges = log.selectedPayRanges
              }

              let selectedOptimizeOptions = []
              if (log.selectedOptimizeOptions) {
                selectedOptimizeOptions = log.selectedOptimizeOptions
              }

              let selectedSkills = []
              if (log.selectedSkills) {
                selectedSkills = log.selectedSkills
              }

              let selectedSchools = []
              if (log.selectedSchools) {
                selectedSchools = log.selectedSchools
              }

              let selectedMajors = []
              if (log.selectedMajors) {
                selectedMajors = log.selectedMajors
              }

              let selectedMembers = []
              let selectedMemberDetails = []
              if (log.selectedMembers) {
                for (let i = 1; i <= log.selectedMembers.length; i++) {
                  selectedMemberDetails.push(log.selectedMembers[i - 1])
                  selectedMembers.push(log.selectedMembers[i - 1].firstName + ' ' + log.selectedMembers[i - 1].lastName)
                }
              }

              const successDefined = log.successDefined
              const degreeType = log.degreeType
              const skillPreference = log.skillPreference
              const societalProblem = log.societalProblem

              const comparisonType = log.comparisonType
              const pollConnections = log.pollConnections
              const pollQuestion = log.pollQuestion
              const aName = log.aName
              const aValue = log.aValue
              const aCase = log.aCase
              const aLinks = log.aLinks
              const aItem = log.aItem
              const bName = log.bName
              const bValue = log.bValue
              const bCase = log.bCase
              const bLinks = log.bLinks
              const bItem = log.bItem
              const progress = log.progress
              const strategies = log.strategies

              this.setState({
                _id: log._id,
                goalId: log._id, goalTitle: log.title, goalDescription: log.description, goalStartDate: log.startDate,
                goalDeadline: log.deadline,
                tasks, requestedMentorSupport, notes, goalStatus: log.status, goalDecision: log.decision,
                createdAt: log.createdAt,
                goalType, selectedCareers, selectedOpportunities, entrepreneurshipStage, entrepreneurshipGoal, entrepreneurshipProject,
                intensity, budget, competencies,
                selectedFunctions, selectedIndustries, selectedHours, selectedPayRanges, selectedOptimizeOptions, selectedSkills, selectedMembers, selectedMemberDetails,
                selectedSchools, selectedMajors,
                successDefined, skillPreference, societalProblem, degreeType,
                comparisonType, pollConnections, pollQuestion, aName, aValue, aCase, aLinks, bName, bValue, bCase, bLinks,
                aItem, bItem, progress, strategies,
                selectedGoal: log
              })

              Axios.get('https://www.guidedcompass.com/api/suggestions', { params: { emailId: email, goalId: log._id } })
               .then((response) => {
                 console.log('query for suggestions worked');

                 if (response.data.success) {

                   console.log('suggestion results: ')
                   const suggestions = response.data.suggestions
                   this.setState({ suggestions })

                 } else {
                   console.log('no suggestions', response.data)
                 }

             }).catch((error) => {
               console.log('query for assessment results did not work', error);
             })

            } else if (logType === 'Application') {

              let applicationDeadline = ''
              if (log.applicationDeadline) {
                if (Platform.OS === 'ios') {
                  applicationDeadline = log.applicationDeadline
                } else {
                  applicationDeadline = log.applicationDeadline
                  // applicationDeadline = new Date(log.applicationDeadline)
                  // const newApplicationDeadline = new Date(applicationDeadline.getTime() + new Date().getTimezoneOffset()*60000)
                  // applicationDeadline = convertDateToString(newApplicationDeadline,"hyphenatedDateTime")
                }
              }

              let reviewedMaterials = ''
              if (log.reviewedMaterials) {
                reviewedMaterials = log.reviewedMaterials
              }

              this.setState({
                _id: log._id,
                applicationId: log._id, employerName: log.employerName, employerURL: log.employerURL,
                employerType: log.employerType, industry: log.employerIndustry, employeeCount: log.employerSize,
                positionTitle: log.positionTitle, positionLink: log.positionLink, jobFunction: log.jobFunction,
                workType: log.workType, timeframe: log.timeframe, applicationDeadline, reviewedMaterials, createdAt: log.createdAt
              })

            } else if (logType === 'Interview') {

              let associatedApplication = {
                _id: log.associatedApplicationId,
                positionTitle: log.associatedApplicationPositionTitle,
                employerName: log.associatedApplicationEmployerName,
                name: log.associatedApplicationPositionTitle + " | " + log.associatedApplicationEmployerName
              }

              let interviewDate = null
              if (log.interviewDate) {
                if (Platform.OS === 'ios') {
                  interviewDate = log.interviewDate
                } else {
                  interviewDate = log.interviewDate
                  // interviewDate = new Date(log.interviewDate)
                  // const newInterviewDate = new Date(interviewDate.getTime() + new Date().getTimezoneOffset()*60000)
                  // interviewDate = convertDateToString(newInterviewDate,"hyphenatedDateTime")
                }
              }

              this.setState({
                _id: log._id,
                interviewId: log._id, interviewDate, interviewRound: log.interviewRound,
                numberOfInterviews: log.numberOfInterviews, interviewLength: log.interviewLength,
                interviews: log.interviews, mcPracticedInterviewing: log.mcPracticedInterviewing,
                wasPrepared: log.wasPrepared, questionsAsked: log.questionsAsked,
                questionsAnswered: log.questionsAnswered, unrelatedTopics: log.unrelatedTopics,
                positionRating: log.positionRating, thoughtsOnPosition: log.thoughtsOnPosition,
                companyRating: log.companyRating, thoughtsOnCompany: log.thoughtsOnCompany,
                fitRating: log.fitRating, thoughtsOnFit: log.thoughtsOnFit,
                employerFeedback: log.employerFeedback, passed: log.passed, associatedApplication,
                createdAt: log.createdAt
              })

            } else if (logType === 'Offer') {

              let offerAssociatedApplication = {
                _id: log.associatedApplicationId,
                positionTitle: log.associatedApplicationPositionTitle,
                employerName: log.associatedApplicationEmployerName,
                name: log.associatedApplicationPositionTitle + " | " + log.associatedApplicationEmployerName
              }

              let offerStartDate = null
              if (log.startDate) {
                offerStartDate = log.startDate
              }

              this.setState({
                _id: log._id,
                offerId: log._id, offerAssociatedApplication,
                offerPayType: log.payType, offerPay: log.pay, hasBonus: log.hasBonus, bonusDescription: log.bonusDescription,
                offerBenefits: log.benefits, offeredEquity: log.offeredEquity, equityPercentage: log.equityPercentage,
                companyValuation: log.companyValuation, offerStartDate, offerDecision: log.decision, decisionReason: log.decisionReason,
                createdAt: log.createdAt
              })

            } else if (logType === 'Passion') {

              this.setState({
                passionId: log._id, passionTitle: log.passionTitle, passionReason: log.passionReason,
                createdAt: log.createdAt
              })
            }

            this.setState({
            advisorFirstName, advisorLastName, advisorEmail,
            log, logs, editExisting, logType })

          } else {
            console.log('not editingExisting', logId)

            this.setState({ logType: passedLogType })

            if (passedLogType === 'Native Application') {
              Axios.get('https://www.guidedcompass.com/api/applications/byid', { params: { applicationId: logId } })
              .then((response) => {

                if (response.data.success) {
                  console.log('Application query worked');

                  if (response.data.application) {
                    this.setState({ log: response.data.application })
                  }

                } else {
                  console.log('no application found', response.data.message)
                }

              }).catch((error) => {
                  console.log('Application query did not work', error);
              });
            }
          }
        }
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler(eventName, eventValue, dateEvent, changeDateTime, mode) {
    console.log('formChangeHandler clicked', eventName, eventValue, dateEvent, changeDateTime);

    // if (eventValue && !dateEvent) {
    //   this.setState({ selectedValue: eventValue })
    // }

    if (dateEvent && Platform.OS === 'android') {
      console.log('in dateEvent', dateEvent, this.state.mode)
      //{"nativeEvent": {}, "type": "dismissed"}
      // {"nativeEvent": {"timestamp": 2022-01-15T23:17:05.451Z}, "type": "set"}
      if (this.state.mode === 'datetime') {
        if (eventValue) {
          // eventValue = convertDateToString(new Date(eventValue),'hyphenatedDate')
          // if (this.state[eventName] && this.state[eventName].split("T")) {
          //   eventValue = eventValue + "T" + this.state[eventName].split("T")[1]
          // }
          this.setState({ [eventName]: eventValue,  selectedValue: eventValue, textFormHasChanged: true, showDateTimePicker: false, modalIsOpen: false })
        } else {
          this.setState({ showDateTimePicker: false, modalIsOpen: false })
        }
      } else if (this.state.mode === 'time') {
        if (eventValue) {

          // let eventValueDate = new Date()
          // eventValueDate.setHours(eventValueDate.getHours() - 1);
          // console.log('show eventValueDate: ', eventValueDate)
          // eventValue = convertDateToString(eventValueDate,'hyphenatedDateTime')

          // eventValue = convertDateToString(new Date(eventValue),'hyphenatedDateTime')
          // eventValue = eventValue.split("T")[1]
          // console.log('is this working? ', eventValue, eventName, this.state[eventName])
          // if (this.state[eventName] && this.state[eventName].split("T")) {
          //   eventValue = this.state[eventName].split("T")[0] + "T" + eventValue
          //
          // }
          this.setState({ [eventName]: eventValue,  selectedValue: eventValue, textFormHasChanged: true, showDateTimePicker: false, modalIsOpen: false })
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
    } else if (eventName === 'associatedApplication') {

      let associatedApplication = null
      for (let i = 1; i <= this.state.logs.length; i++) {
        if (this.state.logs[i - 1].logType === 'Application') {
          let comparedValue = this.state.logs[i - 1].positionTitle + " | " + this.state.logs[i - 1].employerName
          if (eventValue === comparedValue) {
            associatedApplication = this.state.logs[i - 1]
            associatedApplication["name"] = eventValue
            break;
          }
          //applicationOptions.push({ value: logs[i - 1].positionTitle + " | " + logs[i - 1].employerName })
        }
      }
      this.setState({ associatedApplication, selectedValue: eventValue })

    } else if (eventName === 'numberOfInterviews') {

      let interviews = []
      if (eventValue=== '5 or more') {

        for (let i = 1; i <= 5; i++) {
          if (this.state.interviews[i - 1]) {
            interviews.push(this.state.interviews[i - 1])
          } else {
            interviews.push({ name: '', rating: ''})
          }
        }
      } else if (Number(eventValue)){

        for (let i = 1; i <= Number(eventValue); i++) {
          if (this.state.interviews[i - 1]) {
            interviews.push(this.state.interviews[i - 1])
          } else {
            interviews.push({ name: '', rating: ''})
          }
        }
      }

      this.setState({ numberOfInterviews: eventValue, interviews, selectedValue: eventValue })

    } else if (eventName.includes('interviewerName')) {
      const nameArray = eventName.split("|")
      const index = Number(nameArray[1])

      let interviews = this.state.interviews
      interviews[index] = { name: eventValue, rating: this.state.interviews[index].rating }
      this.setState({ interviews, selectedValue: eventValue })

    } else if (eventName.includes('interviewRating')) {
      const nameArray = eventName.split("|")
      const index = Number(nameArray[1])

      let interviews = this.state.interviews
      interviews[index] = { name: this.state.interviews[index].name, rating: eventValue}
      this.setState({ interviews, selectedValue: eventValue })

    } else if (eventName.includes('task|')) {
      const nameArray = eventName.split("|")
      const type = nameArray[0]
      const index = Number(nameArray[1])
      const name = nameArray[2]
      // console.log('keepers: ', type, index, name, nameArray)
      let tasks = this.state.tasks
      tasks[index][name] = eventValue
      this.setState({ tasks, selectedValue: eventValue })
    } else if (eventName.includes('item')) {
      // console.log('step 1')
      const nameArray = eventName.split("|")
      const type = nameArray[1]
      const index = Number(nameArray[2])
      // console.log('step 2', type)
      if (type === 'Asked') {

        let questionsAsked = this.state.questionsAsked
        questionsAsked[index] = eventValue
        this.setState({ questionsAsked, selectedValue: eventValue })
        // console.log('step 3', questionsAsked)
      } else if (type === 'Answered') {
        let questionsAnswered = this.state.questionsAnswered
        questionsAnswered[index] = eventValue
        this.setState({ questionsAnswered, selectedValue: eventValue })
      }
    } else if (eventName === 'offerAssociatedApplication') {

      let offerAssociatedApplication = null
      for (let i = 1; i <= this.state.logs.length; i++) {
        if (this.state.logs[i - 1].logType === 'Application') {
          let comparedValue = this.state.logs[i - 1].positionTitle + " | " + this.state.logs[i - 1].employerName
          if (eventValue === comparedValue) {
            offerAssociatedApplication = this.state.logs[i - 1]
            offerAssociatedApplication["name"] = eventValue
            break;
          }
          //applicationOptions.push({ value: logs[i - 1].positionTitle + " | " + logs[i - 1].employerName })
        }
      }

      this.setState({ offerAssociatedApplication, selectedValue: eventValue })

    } else if (eventName === 'goalType') {
      let goalType = { name: '' }
      for (let i = 1; i <= this.state.goalTypeOptions.length; i++) {
        if (this.state.goalTypeOptions[i - 1].description === eventValue) {
          goalType = this.state.goalTypeOptions[i - 1]
        }
      }
      this.setState({ goalType, selectedValue: eventValue })
      if (goalType.name === 'Basics' || goalType.name === 'Stability' || goalType.name === 'Pay' || goalType.name === 'Interests') {
        this.adjustCoreCompetencies(null, goalType.name.toLowerCase(), eventName, true)
      }
    } else if (eventName === 'skillPreference') {
      this.setState({ [eventName]: eventValue, selectedValue: eventValue })
      if (eventValue && eventValue !== '') {
        this.adjustCoreCompetencies(null, eventValue.toLowerCase(), eventName, true)
      }
    } else if (eventName === 'entrepreneurshipGoal') {
      this.setState({ entrepreneurshipGoal: eventValue, selectedValue: eventValue })
      this.adjustCoreCompetencies(eventValue, 'entrepreneurship', eventName, true)
    } else if (eventName === 'entrepreneurshipIndustry') {
      this.setState({ entrepreneurshipIndustry: eventValue, selectedValue: eventValue })
      this.adjustCoreCompetencies(eventValue, 'entrepreneurship', eventName, true)
    } else if (eventName === 'entrepreneurshipProject') {

      let entrepreneurshipProject = null
      for (let i = 1; i <= this.state.projectOptions.length; i++) {
        if (this.state.projectOptions[i - 1].name === eventValue) {
          entrepreneurshipProject = this.state.projectOptions[i - 1]
        }
      }
      this.setState({ entrepreneurshipProject, selectedValue: eventValue })
    } else if (eventName === 'aItemProject') {

      let aItem = null
      for (let i = 1; i <= this.state.projectOptions.length; i++) {
        if (this.state.projectOptions[i - 1].name === eventValue) {
          aItem = this.state.projectOptions[i - 1]
        }
      }
      this.setState({ aItem, selectedValue: eventValue })

    } else if (eventName === 'bItemProject') {

      let bItem = null
      for (let i = 1; i <= this.state.projectOptions.length; i++) {
        if (this.state.projectOptions[i - 1].name === eventValue) {
          bItem = this.state.projectOptions[i - 1]
        }
      }
      this.setState({ bItem, selectedValue: eventValue })
    } else if (eventName === 'searchCareers') {
      this.searchItems(eventValue, 'career')
    } else if (eventName === 'searchCareersA') {
      this.searchItems(eventValue, 'careerA')
    } else if (eventName === 'searchCareersB') {
      this.searchItems(eventValue, 'careerB')
    } else if (eventName === 'searchOpportunities') {
      this.searchItems(eventValue, 'opportunity')
    } else if (eventName === 'searchOpportunitiesA') {
      this.searchItems(eventValue, 'opportunityA')
    } else if (eventName === 'searchOpportunitiesB') {
      this.searchItems(eventValue, 'opportunityB')
    } else if (eventName === 'searchSkills') {
      this.searchItems(eventValue, 'skill')
    } else if (eventName === 'searchSkillsA') {
      this.searchItems(eventValue, 'skillA')
    } else if (eventName === 'searchSkillsB') {
      this.searchItems(eventValue, 'skillB')
    } else if (eventName === 'searchAdvisors') {
      this.searchItems(eventValue, 'advisor')
    } else if (eventName === 'searchMembers') {
      this.searchItems(eventValue, 'member')
    } else if (eventName.includes("actionItem|")) {
      let actionItems = this.state.actionItems
      const index = Number(eventName.split("|")[1])
      actionItems[index] = eventValue
      this.setState({ actionItems, selectedValue: eventValue })
    } else if (eventName.includes("link|")) {
      let links = this.state.links
      const index = Number(eventName.split("|")[1])
      links[index] = eventValue
      this.setState({ links, selectedValue: eventValue })
    } else if (eventName.includes('aLink|')) {
      const index = Number(eventName.split("|")[1])
      let aLinks = this.state.aLinks
      aLinks[index] = eventValue
      this.setState({ aLinks, selectedValue: eventValue })
    } else if (eventName.includes('bLink|')) {
      const index = Number(eventName.split("|")[1])
      let bLinks = this.state.bLinks
      bLinks[index] = eventValue
      this.setState({ bLinks, selectedValue: eventValue })
    } else if (eventName === 'comparisonType') {
      let pollQuestion = null
      if (eventValue === 'Careers') {
        pollQuestion = 'Which career path should I choose? Why?'
      } else if (eventValue === 'Competencies') {
        pollQuestion = 'Which competency should I focus on? Why?'
      } else if (eventValue === 'Projects') {
        pollQuestion = 'Which project should I focus on? Why?'
      } else if (eventValue === 'Jobs') {
        pollQuestion = 'Which job should I take? Why?'
      }
      this.setState({ [eventName]: eventValue, pollQuestion, selectedValue: eventValue })
    } else if (eventName.includes("progress|")) {
      let progress = this.state.progress
      const name = eventName.split("|")[1]
      const index = Number(eventName.split("|")[2])
      progress[index][name] = eventValue

      this.setState({ progress })
    } else if (eventName.includes("strategy|")) {
      let strategies = this.state.strategies
      const name = eventName.split("|")[1]
      const index = Number(eventName.split("|")[2])
      // console.log('gimme values: ', progress, name, index)
      strategies[index][name] = eventValue

      this.setState({ strategies })
    } else if (eventName.includes("tactic|")) {
      let strategies = this.state.strategies

      const index = Number(eventName.split("|")[1])
      const index2 = Number(eventName.split("|")[2])

      strategies[index]['tactics'][index2] = eventValue
      this.setState({ strategies })
    } else if (eventName === 'feedback') {
      let selectedSuggestion = this.state.selectedSuggestion
      selectedSuggestion['feedback'] = eventValue
      this.setState({ selectedSuggestion })
    } else if (changeDateTime) {
      console.log('changeDateTime foo')
      if (mode === 'date') {
        // console.log('view date 1: ', eventValue)
        eventValue = convertDateToString(new Date(eventValue),'hyphenatedDate')
        // console.log('view date 2: ', eventValue)
        this.setState({ [eventName]: eventValue })
      } else if (mode === 'datetime') {
        //date component

        // eventValue = convertDateToString(eventValue,'hyphenatedDateTime')
        this.setState({ [eventName]: eventValue })
      }
    } else {
      console.log('in regular')
      this.setState({ [eventName]: eventValue, selectedValue: eventValue })
    }
  }

  searchItems(searchString, type) {
    console.log('searchItems called', searchString, type)

    if (type.includes('career')) {
      if (!searchString || searchString === '') {
        this.setState({ searchString, searchStringA: searchString, searchStringB: searchString,
          searchIsAnimatingCareers: false, careerOptions: null,
          searchIsAnimatingCareersA: false, careerOptionsA: null,
          searchIsAnimatingCareersB: false, careerOptionsB: null,
        })
      } else {

        // let searchString = this.state.searchString
        let searchIsAnimatingCareers = false
        let searchStringA = this.state.searchStringA
        let searchIsAnimatingCareersA = false
        let searchStringB = this.state.searchStringB
        let searchIsAnimatingCareersB = false
        if (type === 'career') {
          // searchString = searchString
          searchIsAnimatingCareers = true
        } else if (type === 'careerA') {
          searchStringA = searchString
          searchIsAnimatingCareersA = true
        } else if (type === 'careerB') {
          searchStringB = searchString
          searchIsAnimatingCareersB = true
        }
        this.setState({ searchString, searchIsAnimatingCareers, searchStringA, searchIsAnimatingCareersA,
          searchStringB, searchIsAnimatingCareersB
        })

        const search = true

        const self = this
        function officiallyFilter() {
          console.log('officiallyFilter called')

          const excludeMissingOutlookData = true
          const excludeMissingJobZone = true

          Axios.put('https://www.guidedcompass.com/api/careers/search', {  searchString, search, excludeMissingOutlookData, excludeMissingJobZone })
          .then((response) => {
            console.log('Careers query attempted');

              if (response.data.success) {
                console.log('successfully retrieved careers')

                if (response.data) {

                  let careerOptions = []
                  let careerOptionsA = []
                  let careerOptionsB = []
                  if (response.data.careers && response.data.careers.length > 0) {
                    if (type === 'career') {
                      careerOptions = response.data.careers
                    } else if (type === 'careerA') {
                      careerOptionsA = response.data.careers
                    } else if (type === 'careerB') {
                      careerOptionsB = response.data.careers
                    }
                  }

                  self.setState({
                    careerOptions, careerOptionsA, careerOptionsB,
                    searchIsAnimatingCareers: false, searchIsAnimatingCareersA: false, searchIsAnimatingCareersB: false
                  })
                }

              } else {
                console.log('no career data found', response.data.message)
                let careerOptions = []
                let careerOptionsA = []
                let careerOptionsB = []
                self.setState({ careerOptions, careerOptionsA, careerOptionsB,
                  searchIsAnimatingCareers: false, searchIsAnimatingCareersA: false, searchIsAnimatingCareersB: false
                })
              }

          }).catch((error) => {
              console.log('Career query did not work', error);

              let careerOptions = []
              let careerOptionsA = []
              let careerOptionsB = []
              self.setState({ careerOptions, careerOptionsA, careerOptionsB,
                searchIsAnimatingCareers: false, searchIsAnimatingCareersA: false, searchIsAnimatingCareersB: false
              })
          });
        }

        const delayFilter = () => {
          console.log('delayFilter called: ')
          clearTimeout(self.state.timerId)
          self.state.timerId = setTimeout(officiallyFilter, 1000)
        }

        delayFilter();
      }
    } else if (type.includes('opportunity')) {
      if (!searchString || searchString === '') {
        this.setState({ searchStringOpportunities: searchString, searchStringOpportunitiesA: searchString, searchStringOpportunitiesB: searchString,
          searchIsAnimatingOpportunities: false, careerOptions: null,
          searchIsAnimatingOpportunitiesA: false, careerOptionsA: null,
          searchIsAnimatingOpportunitiesB: false, careerOptionsB: null,
        })
      } else {

        let searchStringOpportunities = this.state.searchStringOpportunities
        let searchIsAnimatingOpportunities = false
        let searchStringOpportunitiesA = this.state.searchStringOpportunitiesA
        let searchIsAnimatingOpportunitiesA = false
        let searchStringOpportunitiesB = this.state.searchStringOpportunitiesB
        let searchIsAnimatingOpportunitiesB = false
        if (type === 'opportunity') {
          searchStringOpportunities = searchString
          searchIsAnimatingOpportunities = true
        } else if (type === 'opportunityA') {
          searchStringOpportunitiesA = searchString
          searchIsAnimatingOpportunitiesA = true
        } else if (type === 'opportunityB') {
          searchStringOpportunitiesB = searchString
          searchIsAnimatingOpportunitiesB = true
        }
        this.setState({ searchStringOpportunities, searchStringOpportunitiesA, searchStringOpportunitiesB,
          searchIsAnimatingOpportunities, searchIsAnimatingOpportunitiesA, searchIsAnimatingOpportunitiesB
        })

        const self = this
        function officiallyFilter() {
          console.log('officiallyFilter called')

          const orgCode = self.state.activeOrg
          const placementPartners = self.state.placementPartners
          const accountCode = self.state.accountCode
          const search = true
          const postTypes = ['Internship','Work','Assignment','Problem','Challenge']

          Axios.get('https://www.guidedcompass.com/api/postings/search', { params: { searchString, orgCode, placementPartners, accountCode, search, postTypes } })
          .then((response) => {
            console.log('Opportunity search query attempted');

              if (response.data.success) {
                console.log('opportunity search query worked')

                let opportunityOptions = []
                let opportunityOptionsA = []
                let opportunityOptionsB = []
                if (type === 'opportunity') {
                  opportunityOptions = response.data.postings
                } else if (type === 'opportunityA') {
                  opportunityOptionsA = response.data.postings
                } else if (type === 'opportunityB') {
                  opportunityOptionsB = response.data.postings
                }
                self.setState({ opportunityOptions, opportunityOptionsA, opportunityOptionsB,
                  searchIsAnimatingOpportunities: false, searchIsAnimatingOpportunitiesA: false, searchIsAnimatingOpportunitiesB: false,
                })

              } else {
                console.log('opportunity search query did not work', response.data.message)

                let opportunityOptions = []
                let opportunityOptionsA = []
                let opportunityOptionsB = []
                self.setState({ opportunityOptions, opportunityOptionsA, opportunityOptionsB,
                  searchIsAnimatingOpportunities: false, searchIsAnimatingOpportunitiesA: false, searchIsAnimatingOpportunitiesB: false
                })

              }

          }).catch((error) => {
              console.log('Search query did not work for some reason', error);
              let opportunityOptions = []
              let opportunityOptionsA = []
              let opportunityOptionsB = []
              self.setState({ opportunityOptions, opportunityOptionsA, opportunityOptionsB,
                searchIsAnimatingOpportunities: false, searchIsAnimatingOpportunitiesA: false, searchIsAnimatingOpportunitiesB: false
              })
          });
        }

        const delayFilter = () => {
          console.log('delayFilter called: ')
          clearTimeout(self.state.timerId)
          self.state.timerId = setTimeout(officiallyFilter, 1000)
        }

        delayFilter();

      }
    } else if (type.includes('skill')) {
      if (!searchString || searchString === '') {
        this.setState({ searchStringCompetencies: searchString, searchStringCompetenciesA: searchString, searchStringCompetenciesB: searchString,
          searchIsAnimatingCompetencies: false, competencyOptions: null,
          searchIsAnimatingCompetenciesA: false, competencyOptionsA: null,
          searchIsAnimatingCompetenciesB: false, competencyOptionsB: null,
        })
      } else {

        let searchStringCompetencies = this.state.searchStringCompetencies
        let searchIsAnimatingCompetencies = false
        let searchStringCompetenciesA = this.state.searchStringCompetenciesA
        let searchIsAnimatingCompetenciesA = false
        let searchStringCompetenciesB = this.state.searchStringCompetenciesB
        let searchIsAnimatingCompetenciesB = false
        if (type === 'skill') {
          searchStringCompetencies = searchString
          searchIsAnimatingCompetencies = true
        } else if (type === 'skillA') {
          searchStringCompetenciesA = searchString
          searchIsAnimatingCompetenciesA = true
        } else if (type === 'skillB') {
          searchStringCompetenciesB = searchString
          searchIsAnimatingCompetenciesB = true
        }
        this.setState({ searchStringCompetencies, searchStringCompetenciesA, searchStringCompetenciesB,
          searchIsAnimatingCompetencies, searchIsAnimatingCompetenciesA, searchIsAnimatingCompetenciesB
        })

        const self = this
        function officiallyFilter() {
          console.log('officiallyFilter called', searchString)

          // const orgCode = self.state.org
          // const placementPartners = self.state.placementPartners
          // const accountCode = self.state.accountCode
          // const search = true
          // const postTypes = ['Internship','Work','Assignment','Problem','Challenge']

          Axios.get('https://www.guidedcompass.com/api/competency/search', { params: { searchString } })
          .then((response) => {
            console.log('Competencies search query attempted');

              if (response.data.success) {
                console.log('competency search query worked')

                let competencyOptions = []
                let searchIsAnimatingCompetencies = false
                let competencyOptionsA = []
                let searchIsAnimatingCompetenciesA = false
                let competencyOptionsB = []
                let searchIsAnimatingCompetenciesB = false
                if (type === 'skill') {
                  competencyOptions = response.data.competencies
                } else if (type === 'skillA') {
                  competencyOptionsA = response.data.competencies
                } else if (type === 'skillB') {
                  competencyOptionsB = response.data.competencies
                }
                self.setState({ competencyOptions, searchIsAnimatingCompetencies,
                  competencyOptionsA, searchIsAnimatingCompetenciesA,
                  competencyOptionsB, searchIsAnimatingCompetenciesB,
                })

              } else {
                console.log('opportunity search query did not work', response.data.message)

                let competencyOptions = []
                let searchIsAnimatingCompetencies = false
                let competencyOptionsA = []
                let searchIsAnimatingCompetenciesA = false
                let competencyOptionsB = []
                let searchIsAnimatingCompetenciesB = false
                self.setState({ competencyOptions, searchIsAnimatingCompetencies,
                  competencyOptionsA, searchIsAnimatingCompetenciesA,
                  competencyOptionsB, searchIsAnimatingCompetenciesB,
                })

              }

          }).catch((error) => {
              console.log('Search query did not work for some reason', error);
              let competencyOptions = []
              let searchIsAnimatingCompetencies = false
              let competencyOptionsA = []
              let searchIsAnimatingCompetenciesA = false
              let competencyOptionsB = []
              let searchIsAnimatingCompetenciesB = false
              self.setState({ competencyOptions, searchIsAnimatingCompetencies,
                competencyOptionsA, searchIsAnimatingCompetenciesA,
                competencyOptionsB, searchIsAnimatingCompetenciesB,
              })
          });
        }

        const delayFilter = () => {
          console.log('delayFilter called: ')
          clearTimeout(self.state.timerId)
          self.state.timerId = setTimeout(officiallyFilter, 1000)
        }

        delayFilter();

      }
    } else if (type === 'member' || type === 'advisor') {
      if (!searchString || searchString === '') {
        this.setState({ searchStringMembers: searchString, searchIsAnimatingMembers: false, memberOptions: null })
      } else {
        this.setState({ searchStringMembers: searchString, searchIsAnimatingMembers: true })

        let roleNames = null
        if (type === 'advisor') {
          roleNames = ['Teacher','Counselor','Support Staff','Mentor','Admin']
        }

        const self = this
        function officiallyFilter() {
          console.log('officiallyFilter called', searchString)

          const orgCode = self.state.activeOrg

          //school district orgs
          Axios.get('https://www.guidedcompass.com/api/members/search', { params: { roleNames, searchString, orgCode } })
          .then((response) => {

              if (response.data.success) {
                console.log('Member query worked');

                self.setState({ memberOptions: response.data.members, searchIsAnimatingMembers: false })

              } else {
                console.log('no members found', response.data.message)
              }

          }).catch((error) => {
              console.log('Members query did not work', error);
          });
        }

        const delayFilter = () => {
          console.log('delayFilter called: ')
          clearTimeout(self.state.timerId)
          self.state.timerId = setTimeout(officiallyFilter, 1000)
        }

        delayFilter();

      }
    }
  }

  adjustCoreCompetencies(selectedItem, type, subType, add) {
    console.log('adjustCoreCompetencies called', selectedItem, type, add)

    if (type === 'career') {

      if (selectedItem) {

        let competencies = this.state.competencies
        // console.log('in career: ')
        if (selectedItem.abilitiesArray) {
          for (let i = 1; i <= selectedItem.abilitiesArray.length; i++) {

            if (add) {
              competencies.push({
                category: 'Ability',
                name: selectedItem.abilitiesArray[i - 1].category,
                description: selectedItem.abilitiesArray[i - 1].subcategories.toString(),
              })
            } else {
              const compIndex = competencies.findIndex(x => x.name === selectedItem.abilitiesArray[i - 1].category)
              if (compIndex > -1) {
                competencies.splice(compIndex,1)
              }
            }
          }
        }
        if (selectedItem.knowledgeArray) {
          for (let i = 1; i <= selectedItem.knowledgeArray.length; i++) {
            if (add) {
              competencies.push({
                category: 'Knowledge',
                name: selectedItem.knowledgeArray[i - 1].category,
                description: selectedItem.knowledgeArray[i - 1].subcategories.toString(),
              })
            } else {
              const compIndex = competencies.findIndex(x => x.name === selectedItem.knowledgeArray[i - 1].category)
              if (compIndex > -1) {
                competencies.splice(compIndex,1)
              }
            }

          }
        }
        if (selectedItem.personalityData && selectedItem.personalityData.workStyles) {
          for (let i = 1; i <= selectedItem.personalityData.workStyles.length; i++) {
            if (add) {
              competencies.push({
                category: 'Soft Skill',
                name: selectedItem.personalityData.workStyles[i - 1],
              })
            } else {
              const compIndex = competencies.findIndex(x => x.name === selectedItem.personalityData.workStyles[i - 1])
              if (compIndex > -1) {
                competencies.splice(compIndex,1)
              }
            }

          }
        }
        if (selectedItem.skillsArray) {
          for (let i = 1; i <= selectedItem.skillsArray.length; i++) {
            if (add) {
              competencies.push({
                category: 'General Hard Skill',
                name: selectedItem.skillsArray[i - 1].category,
                description: selectedItem.skillsArray[i - 1].subcategories.toString(),
              })
            } else {
              const compIndex = competencies.findIndex(x => x.name === selectedItem.skillsArray[i - 1].category)
              if (compIndex > -1) {
                competencies.splice(compIndex,1)
              }
            }

          }
        }
        if (selectedItem.technologyArray) {
          for (let i = 1; i <= selectedItem.technologyArray.length; i++) {
            if (add) {
              competencies.push({
                category: 'Tech Skill',
                name: selectedItem.technologyArray[i - 1].name,
                description: selectedItem.technologyArray[i - 1].examples.toString(),
              })
            } else {
              const compIndex = competencies.findIndex(x => x.name === selectedItem.technologyArray[i - 1].name)
              if (compIndex > -1) {
                competencies.splice(compIndex,1)
              }
            }

          }
        }
        console.log('in competencies: ', competencies)
        this.setState({ competencies })
      }

    } else if (type === 'opportunity') {

      if (selectedItem) {

        let benchmarkId = null
        let jobFunction = null
        if (selectedItem.benchmarkId) {
          benchmarkId = selectedItem.benchmarkId
        } else {
          if (selectedItem.jobFunction) {
            jobFunction = selectedItem.jobFunction
          } else if (selectedItem.workFunction) {
            jobFunction = selectedItem.workFunction
          } else if (selectedItem.functions && selectedItem.functions[0]) {
            jobFunction = selectedItem.functions[0]
          } else if (selectedItem.field && selectedItem.field.split("|")) {
            jobFunction = selectedItem.field.split("|")[0].trim()
          }
        }

        Axios.get('https://www.guidedcompass.com/api/benchmarks/byid', { params: { _id: benchmarkId, jobFunction } })
        .then((response) => {
          console.log('Benchmarks query by id attempted');

            if (response.data.success) {
              console.log('successfully retrieved benchmarks for individual')

              let competencies = this.state.competencies
              if (response.data.benchmark && response.data.benchmark.skills) {
                for (let i = 1; i <= response.data.benchmark.skills.length; i++) {

                  let category = response.data.benchmark.skills[i - 1].skillType
                  if (response.data.benchmark.skills[i - 1].skillType === 'Hard Skill') {
                    category = 'General Hard Skill'
                  }

                  const name = response.data.benchmark.skills[i - 1].title
                  const description = response.data.benchmark.skills[i - 1].description

                  if (add) {
                    competencies.push({ category, name, description })
                  } else {
                    const compIndex = competencies.findIndex(x => x.name === name)
                    if (compIndex > -1) {
                      competencies.splice(compIndex,1)
                    }
                  }
                }
              }

              this.setState({ competencies })

            } else {
              console.log('no benchmarks by id data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Benchmarks query by id did not work', error);
        });
      }

    } else if (type === 'entrepreneurship') {
      let competencies = []
      let entrepreneurshipGoal = this.state.entrepreneurshipGoal
      let entrepreneurshipIndustry = this.state.entrepreneurshipIndustry

      if (subType === 'entrepreneurshipGoal') {
        entrepreneurshipGoal = selectedItem
      } else if (subType === 'entrepreneurshipIndustry') {
        entrepreneurshipIndustry = selectedItem
      }

      competencies.push({ category: 'Ability', name: 'Entrepreneurship' })
      competencies.push({ category: 'Soft Skill', name: 'Time Management' })
      competencies.push({ category: 'General Hard Skill', name: 'Strategic Thinking' })
      competencies.push({ category: 'Soft Skill', name: 'Efficiency' })
      competencies.push({ category: 'Soft Skill', name: 'Resilience' })
      competencies.push({ category: 'Soft Skill', name: 'Communication' })
      competencies.push({ category: 'Soft Skill', name: 'Sales' })
      console.log('show entrepreneurshipGoal: ', entrepreneurshipGoal)
      if (entrepreneurshipGoal && entrepreneurshipGoal !== '') {
        competencies.push({ category: 'General Hard Skill', name: entrepreneurshipGoal })
      }
      if (entrepreneurshipIndustry && entrepreneurshipIndustry !== '') {
        competencies.push({ category: 'Knowledge', name: entrepreneurshipIndustry })
      }

      this.setState({ competencies })
    } else if (type === 'skill') {
      let selectedSkill = null
      if (selectedItem) {
        selectedSkill = selectedItem.name
      } else if (this.state.searchStringCompetencies && this.state.searchStringCompetencies !== ''){
        selectedSkill = this.state.searchStringCompetencies
      }

      if (selectedSkill) {
        let competencies = this.state.competencies

        if (add) {
          competencies.push(selectedItem)
        } else {
          // const compIndex = competencies.findIndex(x => x.name === selectedItem.abilitiesArray[i - 1].category)
          const compIndex = competencies.indexOf(selectedSkill)
          if (compIndex > -1) {
            competencies.splice(compIndex,1)
          }
        }

        console.log('in competencies: ', competencies)
        this.setState({ competencies })
      }
    } else if (type === 'basics') {
      let competencies = []

      competencies.push({ category: 'Soft Skill', name: 'Organize' })
      competencies.push({ category: 'Soft Skill', name: 'Leadership' })
      competencies.push({ category: 'Soft Skill', name: 'Conflict Management' })
      competencies.push({ category: 'Soft Skill', name: 'Decision Making' })
      competencies.push({ category: 'Soft Skill', name: 'Time Management' })
      competencies.push({ category: 'Soft Skill', name: 'Communication' })
      competencies.push({ category: 'Tech Skill', name: 'Microsoft Office / Google Suite' })
      competencies.push({ category: 'General Hard Skill', name: 'Math' })
      competencies.push({ category: 'General Hard Skill', name: 'Writing' })

      this.setState({ competencies })
    } else if (type === 'stability' || type === 'pay' || type === 'interests'  || type === 'your interests') {

      const profile = this.state.profile

      Axios.put('https://www.guidedcompass.com/api/learning-objectives', { profile, category: type })
      .then((response) => {
        console.log('Learning objectives query attempted');

        if (response.data.success) {
          console.log('learning objectives query worked')

          const competencies = response.data.learningObjectives
          this.setState({ competencies })

        } else {
          console.log('learning objectives query did not work', response.data.message)
          //don't allow signups without an org affiliation
          this.setState({ error: { message: 'There was an error finding the learning objectives' } })
        }

      }).catch((error) => {
          console.log('Learning objectives query did not work for some reason', error);
      });
    }
  }

  saveLog() {
    console.log('saveLog clicked');

    this.setState({
      clientErrorMessage: ''
    })

    if (this.state.logType === 'Session' || this.state.logType === 'Check In') {

      if (this.state.remoteAuth && (!this.state.selectedMemberDetails || this.state.selectedMemberDetails.length === 0)) {
        this.setState({ clientErrorMessage: 'please add an advisor' })
      } else if (this.state.remoteAuth && (!this.state.selectedMemberDetails[0].firstName || !this.state.selectedMemberDetails[0].firstName === '')) {
        this.setState({ clientErrorMessage: 'there was an error retrieving the advisor first name' })
      } else if (this.state.remoteAuth && (!this.state.selectedMemberDetails[0].lastName || !this.state.selectedMemberDetails[0].lastName === '')) {
        this.setState({ clientErrorMessage: 'there was an error retrieving the advisor last name' })
      } else if (this.state.remoteAuth && (!this.state.selectedMemberDetails[0].email || !this.state.selectedMemberDetails[0].email === '')) {
        this.setState({ clientErrorMessage: 'there was an error retrieving the advisor email' })
      } else if (!this.state.remoteAuth && (!this.state.advisorFirstName || !this.state.advisorFirstName === '')) {
        this.setState({ clientErrorMessage: 'please add a first name' })
      } else if (!this.state.remoteAuth && (!this.state.advisorLastName || !this.state.advisorLastName === '')) {
        this.setState({ clientErrorMessage: 'please add a last name' })
      } else if (!this.state.remoteAuth && (!this.state.advisorEmail || !this.state.advisorEmail === '')) {
        this.setState({ clientErrorMessage: 'please add an email' })
      } else if (!this.state.remoteAuth && !this.state.advisorEmail.includes('@')) {
        this.setState({ clientErrorMessage: 'please add a valid email' })
      } else if (this.state.sessionDate === '') {
        this.setState({ clientErrorMessage: 'please select a session date for the session' })
      } else if (this.state.sessionMethod === '') {
        this.setState({ clientErrorMessage: 'please select a meeting method for the session' })
      } else if (this.state.category === '') {
        this.setState({ clientErrorMessage: 'please select a category from the session' })
      } else if (this.state.notes === '') {
        this.setState({ clientErrorMessage: 'please add some notes from the session' })
      } else {

        const sessionId = this.state.sessionId
        let advisorFirstName = this.state.advisorFirstName
        let advisorLastName = this.state.advisorLastName
        let advisorEmail = this.state.advisorEmail
        if (this.state.remoteAuth) {
          advisorFirstName = this.state.selectedMemberDetails[0].firstName
          advisorLastName = this.state.selectedMemberDetails[0].lastName
          advisorEmail = this.state.selectedMemberDetails[0].email.trim()
        }

        const orgContactEmail = this.state.orgContactEmail
        const orgName = this.state.orgName
        const remoteAuth = this.state.remoteAuth

        Axios.post('https://www.guidedcompass.com/api/counseling/session', { //sessions: sessions
          creatorEmail: this.state.emailId, _id: sessionId, advisorFirstName, advisorLastName, advisorEmail,
          adviseeFirstName: this.state.cuFirstName, adviseeLastName: this.state.cuLastName,
          adviseeEmail: this.state.emailId, sessionDate: this.state.sessionDate, category: this.state.category, notes: this.state.notes,
          orgCode: this.state.activeOrg, sessionMethod: this.state.sessionMethod, remoteAuth,
          orgContactEmail, orgName, logType: 'Session',
          createdAt: new Date(), updatedAt: new Date() })
        .then((response) => {

          if (response.data.success) {
            //save values
            console.log('Session save worked');

            let selectedMemberDetails = this.state.selectedMemberDetails
            let firstName = this.state.firstName
            let lastName = this.state.lastName
            let email = this.state.email
            let sessionDate = this.state.sessionDate
            let sessionMethod = this.state.sessionMethod
            let category = this.state.category
            let notes = this.state.notes
            if (!this.state.editExisting) {
              selectedMemberDetails = []
              firstName = ''
              lastName = ''
              email = ''
              sessionDate = ''
              sessionMethod = ''
              category = ''
              notes = ''
            }

            this.setState({
              selectedMemberDetails, firstName, lastName, email, sessionDate, sessionMethod, category, notes,

              serverPostSuccess: true,
              serverSuccessMessage: 'Session saved successfully!'
            })

            this.props.reloadData()

          } else {
            console.error('there was an error saving the session');
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: response.data.message,
            })
          }
        }).catch((error) => {
            console.log('Session save did not work', error);
        });
      }
    } else if (this.state.logType === 'Meeting') {

      if (!this.state.method || this.state.method === '') {
        this.setState({ clientErrorMessage: 'please add a meeting method' })
      } else if (!this.state.location || this.state.location === '') {
        this.setState({ clientErrorMessage: 'please add a location for the meeting' })
      } else if (!this.state.startTime || this.state.startTime === '') {
        this.setState({ clientErrorMessage: 'please add a start time for the meeting' })
      } else if (!this.state.endTime || this.state.endTime === '') {
        this.setState({ clientErrorMessage: 'please add an end time for the meeting' })
      } else if (!this.state.description || this.state.description === '') {
        this.setState({ clientErrorMessage: 'please add a description for the meeting' })
      } else {

        let _id = this.state.meetingId
        let method = this.state.method
        let location = this.state.location
        let startTime = this.state.startTime
        let endTime = this.state.endTime
        let repeats = this.state.repeats
        let reminder = this.state.reminder
        let selectedMembers = this.state.selectedMemberDetails
        let description = this.state.description
        let links = this.state.links
        let notes = this.state.notes
        let actionItems = this.state.actionItems

        const creatorEmail = this.state.emailId
        const logType = 'Meeting'
        const orgCode = this.state.activeOrg
        const groupId = this.state.selectedGroup._id
        const groupName = this.state.selectedGroup.name
        const createdAt = new Date()
        const updatedAt = new Date()

        let meeting = {
          _id, method, location, startTime, endTime, repeats, reminder, selectedMembers, description,
          links, notes, actionItems, creatorEmail, logType, orgCode, groupId, groupName,
          createdAt, updatedAt
        }

        Axios.post('https://www.guidedcompass.com/api/logs/meetings', meeting)
        .then((response) => {

          if (response.data.success) {
            //save values
            console.log('Meeting save worked');

            selectedMembers = this.state.selectedMembers
            let selectedMemberDetails = this.state.selectedMemberDetails

            if (!this.state.editExisting) {
              if (this.props.fromGroups) {
                meeting[_id] = response.data._id
                this.props.passMeeting(meeting)
                this.closeModal()
              }
              selectedMembers = []
              selectedMemberDetails = []

              _id = null
              method = ''
              location = ''
              startTime = null
              endTime = null
              repeats = ''
              reminder = ''
              description = ''
              links = []
              notes = ''
              actionItems = []
            }

            this.setState({
              selectedMembers, selectedMemberDetails, _id, method, location, startTime, endTime,
              repeats, reminder, description, links, notes, actionItems,

              serverPostSuccess: true,
              serverSuccessMessage: 'Meeting saved successfully!'
            })
          } else {
            console.error('there was an error saving the meeting');
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: response.data.message,
            })
          }
        }).catch((error) => {
            console.log('Meeting save did not work', error);
        });
      }
    } else if (this.state.logType === 'Goal') {

      if (this.state.goalTitle === '') {
        this.setState({ clientErrorMessage: 'please add a title of your goal' })
      } else if (this.state.goalDeadline === '') {
        this.setState({ clientErrorMessage: 'please add a deadline for your goal' })
      } else {

        let goalId = this.state.goalId
        const creatorEmail = this.state.emailId
        const creatorFirstName = this.state.cuFirstName
        const creatorLastName = this.state.cuLastName
        const creatorUsername = this.state.username
        const creatorPictureURL = this.state.pictureURL

        const title = this.state.goalTitle
        let description = this.state.goalDescription
        const startDate = this.state.goalStartDate
        const deadline = this.state.goalDeadline

        let tasks = this.state.tasks
        let requestedMentorSupport = this.state.requestedMentorSupport
        let notes = this.state.notes
        let status = this.state.goalStatus
        let decision = this.state.goalDecision
        let orgCode = ''
        if (this.state.activeOrg) {
          orgCode = this.state.activeOrg
        }
        const orgContactEmail = this.state.orgContactEmail
        const goalType = this.state.goalType
        const selectedCareers = this.state.selectedCareerDetails
        const selectedOpportunities = this.state.selectedOpportunityDetails
        const entrepreneurshipStage = this.state.entrepreneurshipStage
        const entrepreneurshipType = this.state.entrepreneurshipType
        const entrepreneurshipGoal = this.state.entrepreneurshipGoal
        const entrepreneurshipProject = this.state.entrepreneurshipProject
        const intensity = this.state.intensity
        const budget = this.state.budget
        const competencies = this.state.competencies
        const degreeType = this.state.degreeType

        const selectedFunctions = this.state.selectedFunctions
        const selectedIndustries = this.state.selectedIndustries
        const selectedHours = this.state.selectedHours
        const selectedPayRanges = this.state.selectedPayRanges
        const selectedOptimizeOptions = this.state.selectedOptimizeOptions
        const selectedSkills = this.state.selectedSkills
        const selectedMembers = this.state.selectedMemberDetails
        const selectedSchools = this.state.selectedSchools
        const selectedMajors = this.state.selectedMajors
        const skillPreference = this.state.skillPreference
        const societalProblem = this.state.societalProblem
        const successDefined = this.state.successDefined
        const progress = this.state.progress
        const strategies = this.state.strategies

        const comparisonType = this.state.comparisonType
        const pollConnections = this.state.pollConnections
        const pollQuestion = this.state.pollQuestion
        const aName = this.state.aName
        const aValue = this.state.aValue
        const aItem = this.state.aItem
        const aCase = this.state.aCase
        const aLinks = this.state.aLinks
        const bName = this.state.bName
        const bValue = this.state.bValue
        const bItem = this.state.bItem
        const bCase = this.state.bCase
        const bLinks = this.state.bLinks

        const pictureURL = this.state.pictureURL
        const username = this.state.username
        const roleName = this.state.roleName
        const headline = this.state.headline
        const remoteAuth = this.state.remoteAuth

        let isPublic = false
        if (this.state.publicProfileExtent === 'Public') {
          isPublic = true
        }

        // console.log('show aItem: ', aItem, pollQuestion)
        let selectedGoal = {
          _id: goalId, creatorEmail, creatorFirstName, creatorLastName, creatorUsername, creatorPictureURL,
          title, description, startDate, deadline, tasks,
          goalType, selectedCareers, selectedOpportunities, entrepreneurshipStage, entrepreneurshipType, entrepreneurshipGoal,
          entrepreneurshipProject, intensity, budget, competencies, degreeType,
          comparisonType, pollConnections, pollQuestion, aName, aValue, aCase, aLinks, bName, bValue, bCase, bLinks,
          aItem, bItem,
          selectedFunctions, selectedIndustries, selectedHours, selectedPayRanges, selectedOptimizeOptions, selectedSkills, selectedMembers,
          selectedSchools, selectedMajors, progress, strategies,
          requestedMentorSupport, notes, logType: 'Goal', skillPreference, societalProblem, successDefined,
          pictureURL, username, roleName, headline, remoteAuth, isPublic,
          status, decision, createdAt: new Date(), orgContactEmail, orgCode, updatedAt: new Date()
        }

        //save goals
        Axios.post('https://www.guidedcompass.com/api/logs/goals', selectedGoal)
        .then((response) => {

          if (response.data.success) {
            //save values
            console.log('Goal save worked');

            let currentPage = 'Details'
            if (!this.state.editExisting) {

              currentPage = 'Suggestions'
              goalId = response.data._id
              selectedGoal['_id'] = goalId
            }
            // console.log('goalId here: ', goalId)

            if (this.props.fromWalkthrough) {
              this.props.closeModal()
              this.props.passGoal(selectedGoal)
            } else {
              this.setState({ goalId, editExisting: true, currentPage, selectedGoal,

                serverPostSuccess: true,
                serverSuccessMessage: 'Thank you for adding your goal!'
              })
              console.log('show possibilities: ', this.props.navigation.state, this.props.route)
              this.props.reloadData()
            }

          } else {
            console.error('there was an error the goal the goal', response.data.message);
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: response.data.message,
            })
          }
        }).catch((error) => {
            console.log('Goal save did not work', error);
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: error,
            })
        });

      }
    } else if (this.state.logType === 'Application') {

      if (this.state.employerName === '') {
        this.setState({ clientErrorMessage: 'please add the employer name' })
      } else if (this.state.employerURL === '') {
        this.setState({ clientErrorMessage: 'please add the employer url' })
      } else if (this.state.employerType === '') {
        this.setState({ clientErrorMessage: 'please add the employer type' })
      } else if (this.state.industry === '') {
        this.setState({ clientErrorMessage: 'please add the employer industry' })
      } else if (this.state.positionTitle === '') {
        this.setState({ clientErrorMessage: 'please add the position title' })
      } else if (this.state.jobFunction === '') {
        this.setState({ clientErrorMessage: 'please add the job function' })
      } else if (this.state.workType === '') {
        this.setState({ clientErrorMessage: 'please add the work type' })
      } else if (this.state.timeframe === '') {
        this.setState({ clientErrorMessage: 'please add the timeframe' })
      } else {

        const applicationId = this.state.applicationId
        const creatorEmail = this.state.emailId
        const creatorFirstName = this.state.cuFirstName
        const creatorLastName = this.state.cuLastName
        const creatorUsername = this.state.username
        const creatorPictureURL = this.state.pictureURL

        let employerName = this.state.employerName
        let employerURL = this.state.employerURL
        let employerType = this.state.employerType
        let employerIndustry = this.state.industry
        let employerSize = this.state.employeeCount
        let positionTitle = this.state.positionTitle
        let positionLink = this.state.positionLink
        let jobFunction = this.state.jobFunction
        let workType = this.state.workType
        let timeframe = this.state.timeframe
        let applicationDeadline = this.state.applicationDeadline
        let reviewedMaterials = this.state.reviewedMaterials
        let orgCode = ''
        if (this.state.activeOrg) {
          orgCode = this.state.activeOrg
        }

        //save application
        Axios.post('https://www.guidedcompass.com/api/logs/applications', {
          _id: applicationId, creatorEmail, creatorFirstName, creatorLastName, creatorUsername, creatorPictureURL,
          employerName, employerURL,
          employerType, employerIndustry, employerSize, logType: 'Application',
          positionTitle, positionLink, jobFunction, workType, timeframe, applicationDeadline,
          reviewedMaterials, orgCode, createdAt: new Date(), updatedAt: new Date() })
        .then((response) => {

          if (response.data.success) {
            //save values
            console.log('Application save worked');

            if (!this.state.editExisting) {
              employerName = ''
              employerURL = ''
              employerType = ''
              employerIndustry = ''
              employerSize = ''
              positionTitle = ''
              positionLink = ''
              jobFunction = ''
              workType = ''
              timeframe = ''
              applicationDeadline = ''
              reviewedMaterials = ''
            }

            this.setState({
              employerName, employerURL, employerType, industry: employerIndustry,
              employeeCount: employerSize, positionTitle, positionLink,
              jobFunction, workType, timeframe, applicationDeadline, reviewedMaterials,

              serverPostSuccess: true,
              serverSuccessMessage: 'Application saved successfully!'
            })

            this.props.reloadData()

          } else {
            console.error('there was an error saving the application', response.data.message);
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: response.data.message,
            })
          }
        }).catch((error) => {
            console.log('Application save did not work', error);
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: error,
            })
        });
      }

    } else if (this.state.logType === 'Interview') {

      if (this.state.interviewDate === '') {
        this.setState({ clientErrorMessage: 'please add the interview round' })
      } else if (this.state.interviewRound === '') {
        this.setState({ clientErrorMessage: 'please add the interview round' })
      } else if (this.state.numberOfInterviews === '') {
        this.setState({ clientErrorMessage: 'please add the number of interviews' })
      } else if (this.state.interviewLength === '') {
        this.setState({ clientErrorMessage: 'please add the interview length' })
      } else if (this.state.fitRating === '') {
        this.setState({ clientErrorMessage: 'please rate your fit' })
      } else {

        const interviewId = this.state.interviewId
        const creatorEmail = this.state.emailId
        const creatorFirstName = this.state.cuFirstName
        const creatorLastName = this.state.cuLastName
        const creatorUsername = this.state.username
        const creatorPictureURL = this.state.pictureURL

        let associatedApplicationId = this.state.associatedApplication._id
        let associatedApplicationPositionTitle = this.state.associatedApplication.positionTitle
        let associatedApplicationEmployerName = this.state.associatedApplication.employerName
        let interviewDate = this.state.interviewDate
        let interviewRound = this.state.interviewRound
        let numberOfInterviews = this.state.numberOfInterviews
        let interviewLength = this.state.interviewLength
        let interviews = this.state.interviews
        let mcPracticedInterviewing = this.state.mcPracticedInterviewing
        let wasPrepared = this.state.wasPrepared
        let questionsAsked = this.state.questionsAsked
        let questionsAnswered = this.state.questionsAnswered
        let unrelatedTopics = this.state.unrelatedTopics
        let positionRating = this.state.positionRating
        let thoughtsOnPosition = this.state.thoughtsOnPosition
        let companyRating = this.state.companyRating
        let thoughtsOnCompany = this.state.thoughtsOnCompany
        let fitRating = this.state.fitRating
        let thoughtsOnFit = this.state.thoughtsOnFit
        let employerFeedback = this.state.employerFeedback
        let passed = this.state.passed
        let orgCode = ''
        if (this.state.activeOrg) {
          orgCode = this.state.activeOrg
        }

        //save application
        Axios.post('https://www.guidedcompass.com/api/logs/interviews', {
          _id: interviewId, creatorEmail, creatorFirstName, creatorLastName, creatorUsername, creatorPictureURL,
          associatedApplicationId, associatedApplicationPositionTitle, associatedApplicationEmployerName,
          interviewDate, interviewRound, numberOfInterviews, logType: 'Interview',
          interviewLength, interviews, mcPracticedInterviewing, wasPrepared, questionsAsked, questionsAnswered,
          unrelatedTopics, positionRating, thoughtsOnPosition, companyRating, thoughtsOnCompany,
          fitRating, thoughtsOnFit, employerFeedback, passed, orgCode,
          createdAt: new Date(), updatedAt: new Date() })
        .then((response) => {

          if (response.data.success) {
            //save values
            console.log('Interview save worked');

            let associatedApplication = this.state.associatedApplication

            if (!this.state.editExisting) {
              associatedApplication = { name: 'Attach a Saved Application'}
              interviewDate = ''
              interviewRound = ''
              numberOfInterviews = ''
              interviews = []
              interviewLength = ''
              mcPracticedInterviewing = false
              wasPrepared = false
              questionsAsked = []
              questionsAnswered = []
              unrelatedTopics = ''
              positionRating = ''
              thoughtsOnPosition = ''
              companyRating = ''
              thoughtsOnCompany = ''
              fitRating = ''
              thoughtsOnFit = ''
              employerFeedback = ''
              passed = false
            }

            this.setState({
              associatedApplication,
              interviewDate, interviewRound, numberOfInterviews: '',
              interviewLength, mcPracticedInterviewing, wasPrepared,
              questionsAsked, questionsAnswered, unrelatedTopics, positionRating,
              thoughtsOnPosition, companyRating, thoughtsOnCompany, fitRating,
              thoughtsOnFit, employerFeedback, passed,

              serverPostSuccess: true,
              serverSuccessMessage: 'Interview saved successfully!'
            })

            this.props.reloadData()

          } else {
            console.error('there was an error saving the interview', response.data.message);
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: response.data.message,
            })
          }
        }).catch((error) => {
            console.log('Interview save did not work', error);
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: error,
            })
        });
      }
    } else if (this.state.logType === 'Offer') {

      if (this.state.offerPayType === '') {
        this.setState({ clientErrorMessage: 'please add the pay type' })
      } else if (this.state.offerPay === '') {
        this.setState({ clientErrorMessage: 'please add the pay' })
      } else if (this.state.offerStartDate === '') {
        this.setState({ clientErrorMessage: 'please add the start date' })
      } else if (this.state.offerDecision === '') {
        this.setState({ clientErrorMessage: 'please add your decision' })
      } else if (this.state.decisionReason === '') {
        this.setState({ clientErrorMessage: 'please add a reason for your decision' })
      } else {

        const offerId = this.state.offerId
        const creatorEmail = this.state.emailId
        const creatorFirstName = this.state.cuFirstName
        const creatorLastName = this.state.cuLastName
        const creatorUsername = this.state.username
        const creatorPictureURL = this.state.pictureURL

        let associatedApplicationId = this.state.offerAssociatedApplication._id

        let associatedApplicationPositionTitle = this.state.offerAssociatedApplication.positionTitle
        let associatedApplicationEmployerName = this.state.offerAssociatedApplication.employerName
        let payType = this.state.offerPayType
        let pay = this.state.offerPay
        let hasBonus = this.state.hasBonus
        let bonusDescription = this.state.bonusDescription
        let benefits = this.state.offerBenefits
        let offeredEquity = this.state.offeredEquity
        let equityPercentage = this.state.equityPercentage
        let companyValuation = this.state.companyValuation
        let startDate = this.state.offerStartDate
        let decision = this.state.offerDecision
        let decisionReason = this.state.decisionReason

        let orgCode = ''
        if (this.state.activeOrg) {
          orgCode = this.state.activeOrg
        }

        console.log('audit stuff', startDate)

        //save offer
        Axios.post('https://www.guidedcompass.com/api/logs/offers', {
          _id: offerId, creatorEmail, creatorFirstName, creatorLastName, creatorUsername, creatorPictureURL,
          associatedApplicationId, associatedApplicationPositionTitle, associatedApplicationEmployerName,
          payType, pay, hasBonus, bonusDescription, benefits, offeredEquity, equityPercentage,
          companyValuation, startDate, decision, decisionReason, orgCode, logType: 'Offer',
          createdAt: new Date(), updatedAt: new Date() })
        .then((response) => {
          console.log('testing ')
          if (response.data.success) {
            //save values
            console.log('Offer save worked');

            let offerAssociatedApplication = this.state.offerAssociatedApplication

            if (!this.state.editExisting) {
              offerAssociatedApplication = { name: 'Attach a Saved Application'}
              payType = ''
              pay = ''
              hasBonus = ''
              bonusDescription = ''
              benefits = ''
              offeredEquity = ''
              equityPercentage = ''
              companyValuation = ''
              startDate = ''
              decision = ''
              decisionReason = ''

            }

            this.setState({
              offerAssociatedApplication,
              offerPayType: payType, offerPay: pay, hasBonus, bonusDescription,
              offerBenefits: benefits, offeredEquity, equityPercentage, companyValuation,
              offerStartDate: startDate, offerDecision: decision, decisionReason,

              serverPostSuccess: true,
              serverSuccessMessage: 'Offer saved successfully!'
            })

            this.props.reloadData()

          } else {
            console.error('there was an error saving the interview', response.data.message);
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: response.data.message,
            })
          }
        }).catch((error) => {
            console.log('Offer save did not work', error);
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: error,
            })
        });
      }
    } else if (this.state.logType === 'Passion') {

      if (this.state.passionTitle === '') {
        this.setState({ clientErrorMessage: 'please name your passion' })
      } else if (this.state.passionReason === '') {
        this.setState({ clientErrorMessage: 'please add a reason for your passion' })
      } else {

        const passionId = this.state.passionId
        const creatorEmail = this.state.emailId
        const creatorFirstName = this.state.cuFirstName
        const creatorLastName = this.state.cuLastName
        const creatorUsername = this.state.username
        const creatorPictureURL = this.state.pictureURL

        let passionTitle = this.state.passionTitle
        let passionReason = this.state.passionReason

        let orgCode = ''
        if (this.state.activeOrg) {
          orgCode = this.state.activeOrg
        }

        //save passion
        Axios.post('https://www.guidedcompass.com/api/logs/passions', {
          _id: passionId, creatorEmail, creatorFirstName, creatorLastName, creatorUsername, creatorPictureURL,
          logType: 'Passion',
          passionTitle, passionReason, orgCode,
          createdAt: new Date(), updatedAt: new Date() })
        .then((response) => {

          if (response.data.success) {
            //save values
            console.log('Passion save worked');

            if (!this.state.editExisting) {
              passionTitle = ''
              passionReason = ''
            }

            this.setState({
              passionTitle, passionReason,

              serverPostSuccess: true,
              serverSuccessMessage: 'Passion saved successfully!'
            })

            this.props.reloadData()

          } else {
            console.error('there was an error saving the interview', response.data.message);
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: response.data.message,
            })
          }
        }).catch((error) => {
            console.log('Passion save did not work', error);
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: error,
            })
        });
      }
    }
  }

  deleteLog() {
    console.log('deleteLog called')

    const _id = this.state.log._id

    Axios.delete('https://www.guidedcompass.com/api/logs/' + _id)
    .then((response) => {
      console.log('tried to delete', response.data)
      if (response.data.success) {
        //save values
        console.log('Log delete worked');

        if (this.props.fromWalkthrough) {
          this.closeModal()
          this.props.reloadScreen()
        } else {
          this.props.navigation.navigate('Logs')
        }

        // this.setState({
        //   serverPostSuccess: true,
        //   serverSuccessMessage: 'Log was successfully deleted', confirmDelete: false
        // })

      } else {
        console.error('there was an error deleting the log');
        this.setState({
          serverPostSuccess: false,
          serverErrorMessage: response.data.message,
        })
      }
    }).catch((error) => {
        console.log('The deleting did not work', error);
        this.setState({
          serverPostSuccess: false,
          serverErrorMessage: error,
        })
    });
  }

  renderItems(type) {
    console.log('renderItems called', type)

    let rows = []

    let items = []
    let placeholder = "Add a question..."

    if (type === 'Asked') {
      items = this.state.questionsAsked
    } else if (type === 'Answered') {
      items = this.state.questionsAnswered
    }

    for (let i = 1; i <= items.length; i++) {

      const index = i - 1
      const nameField = "item|" + type + "|" + index

      rows.push(
        <View key={i}>
          <View style={[styles.spacer,styles.rowDirection,styles.flex1]}/>
          <View style={[styles.flex90]}>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler(nameField, text)}
              value={items[index]}
              placeholder={placeholder}
              placeholderTextColor="grey"
            />
          </View>
          <View style={[styles.flex10,styles.leftPadding,styles.topPadding5]}>
            <TouchableOpacity onPress={() => this.addRemoveItems('Remove',index,type)}>
              <Image source={{ uri: exitIcon}} style={[styles.square30,styles.contain]}/>
            </TouchableOpacity>
          </View>

        </View>
      )
    }

    return rows
  }

  toggleEditMode(index) {
    console.log('toggleEditMode called', index)

    let editModes = this.state.editModes
    if (editModes[index]) {
      editModes[index] = false
    } else {
      editModes[index] = true
    }

    this.setState({ editModes })
  }

  addRemoveItems(action, index, type, index2) {
    console.log('addRemoveItems called')

    if (type === 'Asked') {
      let questionsAsked = this.state.questionsAsked
      if (action === 'Add') {
        questionsAsked.push("")
      } else {
        if (index > -1) {
          questionsAsked.splice(index, 1);
        }
      }

      this.setState({ questionsAsked })

    } else if (type === 'Answered') {

      let questionsAnswered = this.state.questionsAnswered
      if (action === 'Add') {
        questionsAnswered.push("")
      } else {
        if (index > -1) {
          questionsAnswered.splice(index, 1);
        }
      }

      this.setState({ questionsAnswered })
    } else if (type === 'task') {
      if (action === 'Remove') {
        let tasks = this.state.tasks
        tasks.splice(index, 1)
        this.setState({ tasks })
      }
    } else if (type === 'link') {
      let links = this.state.links
      links.splice(index,1)
      this.setState({ links })
    } else if (type === 'aLink') {
      let aLinks = this.state.aLinks
      aLinks.splice(index,1)
      this.setState({ aLinks })
    } else if (type === 'bLink') {
      let bLinks = this.state.bLinks
      bLinks.splice(index,1)
      this.setState({ bLinks })
    } else if (type === 'actionItem') {
      let actionItems = this.state.actionItems
      actionItems.splice(index,1)
      this.setState({ actionItems })
    } else if (type === 'progress') {
      let progress = this.state.progress
      progress.splice(index,1)
      this.setState({ progress })
      } else if (type === 'strategy') {
      let strategies = this.state.strategies
      strategies.splice(index,1)
      this.setState({ strategies })
    } else if (type === 'tactic') {
      let strategies = this.state.strategies
      let tactics = this.state.strategies[index].tactics
      tactics.splice(index2,1)
      strategies[index]['tactics'] = tactics
      this.setState({ strategies })
    }
  }

  searchItemClicked(passedItem, type) {
    console.log('searchItemClicked called', passedItem, type)

    if (type.includes('career')) {

      let searchObject = null
      let searchString = null
      let careerOptions = null
      let searchObjectA = null
      let searchStringA = null
      let careerOptionsA = null
      let searchObjectB = null
      let searchStringB = null
      let careerOptionsB = null
      if (type === 'career') {
        searchObject = passedItem
        searchString = passedItem.name
        careerOptions = null
      } else if (type === 'careerA') {
        searchObjectA = passedItem
        searchStringA = passedItem.name
        careerOptionsA = null
      } else if (type === 'careerB') {
        searchObjectB = passedItem
        searchStringB = passedItem.name
        careerOptionsB = null
      }

      this.setState({ searchObject, searchString, careerOptions, searchObjectA, searchStringA, careerOptionsA,
        searchObjectB, searchStringB, careerOptionsB
      })

    } else if (type.includes('opportunity')) {
      let searchObject = null
      let searchStringOpportunities = null
      let opportunityOptions = null
      let searchObjectA = null
      let searchStringOpportunitiesA = null
      let opportunityOptionsA = null
      let searchObjectB = null
      let searchStringOpportunitiesB = null
      let opportunityOptionsB = null
      if (type === 'opportunity') {
        searchObject = passedItem
        searchStringOpportunities = passedItem.name
        if (passedItem.title) {
          searchStringOpportunities = passedItem.title
        }
        opportunityOptions = null
      } else if (type === 'opportunityA') {
        searchObjectA = passedItem
        searchStringOpportunitiesA = passedItem.name
        if (passedItem.title) {
          searchStringOpportunitiesA = passedItem.title
        }
        opportunityOptionsA = null
      } else if (type === 'opportunityB') {
        searchObjectB = passedItem
        searchStringOpportunitiesB = passedItem.name
        if (passedItem.title) {
          searchStringOpportunitiesB = passedItem.title
        }
        opportunityOptionsB = null
      }

      this.setState({ searchObject, searchStringOpportunities, opportunityOptions,
        searchObjectA, searchStringOpportunitiesA, opportunityOptionsA,
        searchObjectB, searchStringOpportunitiesB, opportunityOptionsB,
      })
    } else if (type.includes('competency')) {
      let searchObject = null
      let searchStringCompetencies = null
      let competencyOptions = null
      let searchObjectA = null
      let searchStringCompetenciesA = null
      let competencyOptionsA = null
      let searchObjectB = null
      let searchStringCompetenciesB = null
      let competencyOptionsB = null
      if (type === 'competency') {
        searchObject = passedItem
        searchStringCompetencies = passedItem.name
        competencyOptions = null
      } else if (type === 'competencyA') {
        searchObjectA = passedItem
        searchStringCompetenciesA = passedItem.name
        competencyOptionsA = null
      } else if (type === 'competencyB') {
        searchObjectB = passedItem
        searchStringCompetenciesB = passedItem.name
        competencyOptionsB = null
      }

      this.setState({
        searchObject, searchStringCompetencies, competencyOptions,
        searchObjectA, searchStringCompetenciesA, competencyOptionsA,
        searchObjectB, searchStringCompetenciesB, competencyOptionsB,
      })
    } else if (type === 'member') {
      const searchObject = passedItem
      let searchStringMembers = passedItem.firstName + ' ' + passedItem.lastName

      const memberOptions = null

      this.setState({ searchObject, searchStringMembers, memberOptions })

    }
  }

  renderTags(type) {
    console.log('renderTags called')

    if (type.includes('career')) {
      if (type === 'career') {
        const selectedCareers = this.state.selectedCareers
        if (selectedCareers && selectedCareers.length > 0) {

          return (
            <View key={"selectedCareers"}>
              <View style={[styles.spacer,styles.rowDirection,styles.flexWrap]} />
              {selectedCareers.map((value, optionIndex) =>
                <View key={"career|" + optionIndex} style={[styles.rowDirection]}>

                  <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                    <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                      <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.rightPadding5]}>
                    <View style={[styles.halfSpacer]} />
                    <View style={[styles.row7,styles.horizontalPadding20,styles.standardBorder,styles.lightBackground]}>
                      <Text style={[styles.descriptionText2]}>{value}</Text>
                    </View>
                    <View style={[styles.halfSpacer]} />
                  </View>

                </View>
              )}
            </View>
          )
        }
      } else {
        let item = null
        if (type === 'careerA') {
          item = this.state.aItem
        } else if (type === 'careerB') {
          item = this.state.bItem
        }

        if (item) {
          return (
            <View key={"selectedCareer"}>
              <View style={[styles.spacer,styles.rowDirection,styles.flexWrap]} />
              <View key={"career"}>

                <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                  <TouchableOpacity onPress={() => this.removeTag(null,type)}>
                    <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                  </TouchableOpacity>
                </View>

                <View style={[styles.rightPadding5]}>
                  <View style={[styles.halfSpacer]} />
                  <View style={[styles.row7,styles.horizontalPadding20,styles.standardBorder,styles.lightBackground]}>
                    <Text style={[styles.descriptionText2]}>{(item.name) ? item.name : item.title}</Text>
                  </View>
                  <View style={[styles.halfSpacer]} />
                </View>

              </View>

            </View>
          )
        }
      }

    } else if (type.includes('opportunity')) {
      if (type === 'opportunity') {
        const selectedOpportunities = this.state.selectedOpportunities
        if (selectedOpportunities && selectedOpportunities.length > 0) {
          // console.log('about to in', selectedOpportunities)
          return (
            <View key={"selectedOpportunities"}>
              <View style={[styles.spacer,styles.rowDirection,styles.flexWrap]} />
              {selectedOpportunities.map((value, optionIndex) =>
                <View key={"career|" + optionIndex} style={[styles.rowDirection]}>

                  <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                    <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                      <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.rightPadding5]}>
                    <View style={[styles.halfSpacer]} />
                    <View style={[styles.row7,styles.horizontalPadding20,styles.standardBorder,styles.lightBackground]}>
                      <Text style={[styles.descriptionText2]}>{value}</Text>
                    </View>
                    <View style={[styles.halfSpacer]} />
                  </View>

                </View>
              )}
            </View>
          )
        }
      } else {
        let item = null
        if (type === 'opportunityA') {
          item = this.state.aItem
        } else if (type === 'opportunityB') {
          item = this.state.bItem
        }

        if (item) {
          return (
            <View key={"selectedOpportunity"}>
              <View style={[styles.spacer,styles.rowDirection,styles.flexWrap]} />
              <View key={"career"} style={[styles.rowDirection]}>

                <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                  <TouchableOpacity onPress={() => this.removeTag(null,type)}>
                    <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.rightPadding5]}>
                  <View style={[styles.halfSpacer]} />
                  <View style={[styles.row7,styles.horizontalPadding20,styles.standardBorder,styles.lightBackground]}>
                    <Text style={[styles.descriptionText2]}>{(item.name) ? item.name : item.title}</Text>
                  </View>
                  <View style={[styles.halfSpacer]} />
                </View>
              </View>

            </View>
          )
        }
      }

    } else if (type === 'learningObjective') {
      // console.log('in learningObjective', this.state.learningObjectives)
      // abilities, knowledge, , soft skill, hard skil, tech skill
      const competencies = this.state.competencies

      if (competencies && competencies.length > 0) {
        console.log('compare 0')
        return (
          <View key={"competency"}>
            <View style={[styles.spacer,styles.rowDirection,styles.flexWrap]} />
            {competencies.map((value, optionIndex) =>
              <View key={"career|" + optionIndex}>
                {(value) && (
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                      <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                        <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                      </TouchableOpacity>
                    </View>
                    <View>
                      <View style={[styles.halfSpacer]} />
                      {(value.category === 'Ability') && (
                        <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.transparentBorder,styles.topMargin5,styles.leftMargin5,styles.primaryBackground,styles.primaryBorder]}>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</Text>
                        </View>
                      )}

                      {(value.category === 'Knowledge') && (
                        <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.transparentBorder,styles.topMargin5,styles.leftMargin5,styles.secondaryBackground,styles.secondaryBorder]}>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</Text>
                        </View>
                      )}
                      {(value.category === 'Soft Skill') && (
                        <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.transparentBorder,styles.topMargin5,styles.leftMargin5,styles.tertiaryBackground,styles.tertiaryBorder]}>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</Text>
                        </View>
                      )}
                      {(value.category === 'General Hard Skill') && (
                        <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.transparentBorder,styles.topMargin5,styles.leftMargin5,styles.quaternaryBackground,styles.quaternaryBorder]}>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</Text>
                        </View>
                      )}
                      {(value.category === 'Tech Skill') && (
                        <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.transparentBorder,styles.topMargin5,styles.leftMargin5,styles.quinaryBackground,styles.quinaryBorder]}>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</Text>
                        </View>
                      )}

                      <View style={[styles.halfSpacer]} />
                    </View>
                  </View>
                )}

              </View>
            )}
          </View>
        )

      }
    } else if (type.includes('skill')) {
      if (type === 'skill') {
        const selectedSkills = this.state.selectedSkills
        if (selectedSkills && selectedSkills.length > 0) {

          return (
            <View key={"selectedSkills"}>
              <View style={[styles.spacer,styles.rowDirection,styles.flexWrap]} />
              {selectedSkills.map((value, optionIndex) =>
                <View key={"career|" + optionIndex} style={[styles.rowDirection]}>

                  <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                    <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                      <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.rightPadding5]}>
                    <View style={[styles.halfSpacer]} />
                    <View style={[styles.row7,styles.horizontalPadding20,styles.standardBorder,styles.lightBackground]}>
                      <Text style={[styles.descriptionText2]}>{value}</Text>
                    </View>
                    <View style={[styles.halfSpacer]} />
                  </View>

                </View>
              )}
            </View>
          )
        }
      } else {
        let item = null
        if (type === 'skillA') {
          item = this.state.aItem
        } else if (type === 'skillB') {
          item = this.state.bItem
        }
        // console.log('show item: ', item, type)
        if (item) {
          return (
            <View key={"selectedSkill"} style={[styles.rowDirection,styles.flexWrap]}>
              <View style={[styles.spacer]} />
              <View key={"career"}>

                <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                  <TouchableOpacity onPress={() => this.removeTag(null,type)}>
                    <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                  </TouchableOpacity>
                </View>

                <View style={[styles.rightPadding5]}>
                  <View style={[styles.halfSpacer]} />
                  <View style={[styles.row7,styles.horizontalPadding20,styles.standardBorder,styles.lightBackground]}>
                    <Text style={[styles.descriptionText2]}>{(item.name) ? item.name : item.title}</Text>
                  </View>
                  <View style={[styles.halfSpacer]} />
                </View>

              </View>

            </View>
          )
        }
      }

    } else if (type === 'member') {
      const selectedMembers = this.state.selectedMembers
      if (selectedMembers && selectedMembers.length > 0) {
        console.log('show selectedMembers: ', selectedMembers)
        return (
          <View key={"selectedMembers"}>
            <View style={[styles.spacer,styles.rowDirection,styles.flexWrap]} />
            {selectedMembers.map((value, optionIndex) =>
              <View key={"career|" + optionIndex} style={[styles.rowDirection]}>

                <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                  <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                    <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.rightPadding5]}>
                  <View style={[styles.halfSpacer]} />
                  <View style={[styles.row7,styles.horizontalPadding20,styles.standardBorder,styles.lightBackground]}>
                    <Text style={[styles.descriptionText2]}>{value}</Text>
                  </View>
                  <View style={[styles.halfSpacer]} />
                </View>

              </View>
            )}
          </View>
        )
      }
    } else {

      let tags = []
      if (type === 'function') {
        tags = this.state.selectedFunctions
      } else if (type === 'industry') {
        tags = this.state.selectedIndustries
      } else if (type === 'hoursPerWeek') {
        tags = this.state.selectedHours
      } else if (type === 'payRange') {
        tags = this.state.selectedPayRanges
      } else if (type === 'optimize') {
        tags = this.state.selectedOptimizeOptions
      } else if (type === 'school') {
        tags = this.state.selectedSchools
      } else if (type === 'major') {
        tags = this.state.selectedMajors
      }

      if (tags && tags.length > 0) {
        console.log('about to in', tags)
        return (
          <View key={type}>
            <View style={[styles.spacer,styles.rowDirection,styles.flexWrap]} />
            {tags.map((value, optionIndex) =>
              <View key={type + "|" + optionIndex} style={[styles.rowDirection]}>
                <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                  <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                    <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.rightPadding5]}>
                  <View style={[styles.halfSpacer]} />
                  <View style={[styles.row7,styles.horizontalPadding20,styles.standardBorder,styles.lightBackground]}>
                    <Text style={[styles.descriptionText2]}>{value}</Text>
                  </View>
                  <View style={[styles.halfSpacer]} />
                </View>

              </View>
            )}
          </View>
        )
      }
    }
  }

  removeTag(index, type) {
    console.log('removeTag called', index, type)

    if (type.includes('career')) {
      if (type === 'career') {
        let selectedCareers = this.state.selectedCareers
        selectedCareers.splice(index, 1)

        let selectedCareerDetails = this.state.selectedCareerDetails
        const careerToRemove = selectedCareerDetails[index]
        selectedCareerDetails.splice(index, 1)
        this.setState({ selectedCareers, selectedCareerDetails })
        this.adjustCoreCompetencies(careerToRemove,type, null, false)
      } else if (type === 'careerA') {
        this.setState({ aItem: null })
      } else if (type === 'careerB') {
        this.setState({ bItem: null })
      }
    } else if (type.includes('opportunity')) {
      if (type === 'opportunity') {
        let selectedOpportunities = this.state.selectedOpportunities
        selectedOpportunities.splice(index, 1)

        let selectedOpportunityDetails = this.state.selectedOpportunityDetails
        const opportunityToRemove = selectedOpportunityDetails[index]
        selectedOpportunityDetails.splice(index, 1)
        this.setState({ selectedOpportunities, selectedOpportunityDetails })
        this.adjustCoreCompetencies(opportunityToRemove,type, null, false)
      } else if (type === 'opportunityA') {
        this.setState({ aItem: null })
      } else if (type === 'opportunityB') {
        this.setState({ bItem: null })
      }
    } else if (type === 'function') {
      let selectedFunctions = this.state.selectedFunctions
      selectedFunctions.splice(index, 1)
      this.setState({ selectedFunctions })
    } else if (type === 'industry') {
      let selectedIndustries = this.state.selectedIndustries
      selectedIndustries.splice(index, 1)
      this.setState({ selectedIndustries })
    } else if (type === 'hoursPerWeek') {
      let selectedHours = this.state.selectedHours
      selectedHours.splice(index, 1)
      this.setState({ selectedHours })
    } else if (type === 'payRange') {
      let selectedPayRanges = this.state.selectedPayRanges
      selectedPayRanges.splice(index, 1)
      this.setState({ selectedPayRanges })
    } else if (type === 'optimize') {
      let selectedOptimizeOptions = this.state.selectedOptimizeOptions
      selectedOptimizeOptions.splice(index, 1)
      this.setState({ selectedOptimizeOptions })

    } else if (type === 'learningObjective') {
      let competencies = this.state.competencies
      competencies.splice(index, 1)
      this.setState({ competencies })
    } else if (type === 'member') {
      let selectedMembers = this.state.selectedMembers
      selectedMembers.splice(index, 1)

      let selectedMemberDetails = this.state.selectedMemberDetails
      // const memberToRemove = selectedMemberDetails[index]
      selectedMemberDetails.splice(index, 1)
      this.setState({ selectedMembers, selectedMemberDetails })
    } else if (type.includes('skill')) {
      if (type === 'skill') {
        let selectedSkills = this.state.selectedSkills
        selectedSkills.splice(index, 1)
        this.setState({ selectedSkills })
      } else if (type === 'skillA') {
        this.setState({ aItem: null })
      } else if (type === 'skillB') {
        this.setState({ bItem: null })
      }
    } else if (type === 'school') {
      let selectedSchools = this.state.selectedSchools
      selectedSchools.splice(index, 1)
      this.setState({ selectedSchools })
    } else if (type === 'major') {
      let selectedMajors = this.state.selectedMajors
      selectedMajors.splice(index, 1)
      this.setState({ selectedMajors })
    }
  }

  addItem(type,index) {
    console.log('addItem called', type)

    if (type.includes('career')) {
      if (this.state.selectedCareers.includes(this.state.searchString)) {
        this.setState({ errorMessage: 'You have already added this career' })
      } else {

        if (type === 'career') {
          if (!this.state.searchObject) {
            return this.setState({ errorMessage: 'Please select a career from search suggestions' })
          }

          const searchString = ''
          const searchObject = null

          let selectedCareers = this.state.selectedCareers
          selectedCareers.unshift(this.state.searchString)

          let selectedCareerDetails = this.state.selectedCareerDetails
          selectedCareerDetails.unshift(this.state.searchObject)

          // const selectedCareer = this.state.searchString

          this.setState({ searchString, searchObject, selectedCareers, selectedCareerDetails, errorMessage: null, careerOptions: [] })
          this.adjustCoreCompetencies(this.state.searchObject,type, null, true)
        } else if (type === 'careerA') {
          if (!this.state.searchObjectA) {
            return this.setState({ errorMessage: 'Please select a career from search suggestions' })
          }

          const searchStringA = ''
          const searchObjectA = null
          const aItem = this.state.searchObjectA

          this.setState({ searchStringA, searchObjectA, aItem, errorMessageA: null, careerOptionsA: [] })
        } else if (type === 'careerB') {
          if (!this.state.searchObjectB) {
            return this.setState({ errorMessage: 'Please select a career from search suggestions' })
          }

          const searchStringB = ''
          const searchObjectB = null
          const bItem = this.state.searchObjectB

          this.setState({ searchStringB, searchObjectB, bItem, errorMessageB: null, careerOptionsB: [] })
        }
      }
    } else if (type.includes('opportunity')) {
      if (this.state.selectedOpportunities.includes(this.state.searchStringOpportunities)) {
        this.setState({ errorMessage: 'You have already added this opportunity' })
      } else {

        if (type === 'opportunity') {

          if (!this.state.searchObject) {
            return this.setState({ errorMessage: 'Please select an opportunity from search suggestions' })
          }

          const searchStringOpportunities = ''
          const searchObject = null

          let selectedOpportunities = this.state.selectedOpportunities
          selectedOpportunities.unshift(this.state.searchStringOpportunities)

          let selectedOpportunityDetails = this.state.selectedOpportunityDetails
          selectedOpportunityDetails.unshift(this.state.searchObject)

          this.setState({ searchStringOpportunities, searchObject, selectedOpportunities, selectedOpportunityDetails, errorMessage: null, opportunityOptions: [] })
          this.adjustCoreCompetencies(this.state.searchObject,type, null, true)
        } else if (type === 'opportunityA') {
          if (!this.state.searchObjectA) {
            return this.setState({ errorMessage: 'Please select an opportunity from search suggestions' })
          }

          const searchStringOpportunitiesA = ''
          const searchObjectA = null
          const aItem = this.state.searchObjectA

          this.setState({ searchStringOpportunitiesA, searchObjectA, aItem, errorMessageA: null, opportunityOptionsA: [] })
        } else if (type === 'opportunityB') {
          if (!this.state.searchObjectB) {
            return this.setState({ errorMessage: 'Please select an opportunity from search suggestions' })
          }

          const searchStringOpportunitiesB = ''
          const searchObjectB = null
          const bItem = this.state.searchObjectB

          this.setState({ searchStringOpportunitiesB, searchObjectB, bItem, errorMessageB: null, opportunityOptionsB: [] })
        }

      }
    } else if (type === 'function') {

      if (this.state.selectedFunctions.includes(this.state.selectedFunction)) {
        this.setState({ errorMessage: 'You have already added this' })
      } else {

        const selectedFunction = ''

        let selectedFunctions = this.state.selectedFunctions
        selectedFunctions.unshift(this.state.selectedFunction)

        this.setState({ selectedFunction, selectedFunctions, errorMessage: null })

      }
    } else if (type === 'industry') {

      if (this.state.selectedIndustries.includes(this.state.selectedIndustry)) {
        this.setState({ errorMessage: 'You have already added this' })
      } else {

        const selectedIndustry = ''

        let selectedIndustries = this.state.selectedIndustries
        selectedIndustries.unshift(this.state.selectedIndustry)

        this.setState({ selectedIndustry, selectedIndustries, errorMessage: null })

      }
    } else if (type === 'hoursPerWeek') {

      if (this.state.selectedHours.includes(this.state.selectedHoursPerWeek)) {
        this.setState({ errorMessage: 'You have already added this' })
      } else {

        const selectedHoursPerWeek = ''

        let selectedHours = this.state.selectedHours
        selectedHours.unshift(this.state.selectedHoursPerWeek)

        this.setState({ selectedHoursPerWeek, selectedHours, errorMessage: null })

      }
    } else if (type === 'payRange') {

      if (this.state.selectedPayRanges.includes(this.state.selectedPayRange)) {
        this.setState({ errorMessage: 'You have already added this' })
      } else {

        const selectedPayRange = ''

        let selectedPayRanges = this.state.selectedPayRanges
        selectedPayRanges.unshift(this.state.selectedPayRange)

        this.setState({ selectedPayRange, selectedPayRanges, errorMessage: null, hourlyPayOptions: []  })
      }
    } else if (type === 'optimize') {

      if (this.state.selectedOptimizeOptions.includes(this.state.selectedOptimize)) {
        this.setState({ errorMessage: 'You have already added this' })
      } else {

        const selectedOptimize = ''

        let selectedOptimizeOptions = this.state.selectedOptimizeOptions
        selectedOptimizeOptions.unshift(this.state.selectedOptimize)

        this.setState({ selectedOptimize, selectedOptimizeOptions, errorMessage: null, optimizeOptions: [] })

      }
    } else if (type.includes('skill')) {
      if (this.state.selectedSkills.includes(this.state.searchStringCompetencies)) {
        this.setState({ errorMessage: 'You have already added this competency' })
      } else {

        if (type === 'skill') {
          if (!this.state.searchObject) {
            return this.setState({ errorMessage: 'Please select a skill from search suggestions' })
          }

          const searchStringCompetencies = ''
          const searchObject = null

          let competencies = this.state.competencies

          let category = this.state.searchObject.type
          if (this.state.searchObject.type === 'General Skill') {
            category = 'General Hard Skill'
          } else if (this.state.searchObject.type === 'Work Style') {
            category = 'Soft Skill'
          }

          competencies.unshift({
            category,
            name: this.state.searchObject.name,
            description: this.state.searchObject.description,
          })

          this.setState({ searchStringCompetencies, searchObject, competencies, errorMessage: null, competencyOptions: null })
        } else if (type === 'skillA') {
          if (!this.state.searchObjectA) {
            return this.setState({ errorMessage: 'Please select a skill from search suggestions' })
          }

          const searchStringCompetenciesA = ''
          const searchObjectA = null


          let category = this.state.searchObjectA.type
          if (this.state.searchObjectA.type === 'General Skill') {
            category = 'General Hard Skill'
          } else if (this.state.searchObjectA.type === 'Work Style') {
            category = 'Soft Skill'
          }

          const aItem = {
            category,
            name: this.state.searchObjectA.name,
            description: this.state.searchObjectA.description,

          }

          this.setState({ searchStringCompetenciesA, searchObjectA, aItem, errorMessageA: null, competencyOptionsA: null })

        } else if (type === 'skillB') {
          if (!this.state.searchObjectB) {
            return this.setState({ errorMessage: 'Please select a skill from search suggestions' })
          }

          const searchStringCompetenciesB = ''
          const searchObjectB = null


          let category = this.state.searchObjectB.type
          if (this.state.searchObjectB.type === 'General Skill') {
            category = 'General Hard Skill'
          } else if (this.state.searchObjectB.type === 'Work Style') {
            category = 'Soft Skill'
          }

          const bItem = {
            category,
            name: this.state.searchObjectB.name,
            description: this.state.searchObjectB.description,
          }
          // console.log('show bItem: ', bItem)
          this.setState({ searchStringCompetenciesB, searchObjectB, bItem, errorMessageB: null, competencyOptionsB: null })
        }
      }
    } else if (type === 'member' || type === 'advisor') {
      if (this.state.selectedMembers.includes(this.state.searchStringMembers)) {
        this.setState({ errorMessage: 'You have already added this member' })
      } else if (!this.state.searchObject) {
        this.setState({ errorMessage: 'Please select a member from search suggestions' })
      } else {

        const searchStringMembers = ''
        const searchObject = null

        let selectedMembers = this.state.selectedMembers
        selectedMembers.unshift(this.state.searchStringMembers)

        let selectedMemberDetails = this.state.selectedMemberDetails
        selectedMemberDetails.unshift(this.state.searchObject)

        if (type === 'advisor') {
          selectedMembers = [this.state.searchStringMembers]
          selectedMemberDetails = [this.state.searchObject]
        }

        this.setState({ searchStringMembers, searchObject, selectedMembers, selectedMemberDetails, errorMessage: null, memberOptions: [] })

      }
    } else if (type === 'task') {
      let tasks = this.state.tasks
      if (tasks) {
        tasks.push({ name: "", deadline: "", status: ""})
      } else {
        tasks = [{ name: "", deadline: "", status: ""}]
      }
      this.setState({ tasks })
    } else if (type === 'link') {
      let links = this.state.links
      if (links) {
        links.push('')
      } else {
        links = ['']
      }
      this.setState({ links })
    } else if (type === 'aLink') {
      let aLinks = this.state.aLinks
      if (aLinks) {
        aLinks.push('')
      } else {
        aLinks = ['']
      }
      this.setState({ aLinks })
    } else if (type === 'bLink') {
      let bLinks = this.state.bLinks
      if (bLinks) {
        bLinks.push('')
      } else {
        bLinks = ['']
      }
      this.setState({ bLinks })
    } else if (type === 'school') {
      console.log('in school')
      let selectedSchools = this.state.selectedSchools
      selectedSchools.push(this.state.schoolName)

      const schoolName = ''
      this.setState({ schoolName, selectedSchools })
    } else if (type === 'major') {
      let selectedMajors = this.state.selectedMajors
      selectedMajors.push(this.state.major)

      const major = ''
      this.setState({ major, selectedMajors })
    } else if (type === 'actionItem') {
      let actionItems = this.state.actionItems
      if (actionItems) {
        actionItems.push('')
      } else {
        actionItems = ['']
      }
      this.setState({ actionItems })
    } else if (type === 'progress') {
      let progress = this.state.progress
      if (progress) {
        progress.push({ date: null, value: null })
      } else {
        progress = [{ date: null, value: null }]
      }
      this.setState({ progress })
    } else if (type === 'strategy') {
      let strategies = this.state.strategies
      if (strategies) {
        strategies.push({ name: '' })
      } else {
        strategies = [{ name: '' }]
      }
      this.setState({ strategies })
    } else if (type === 'tactic') {
      let strategies = this.state.strategies
      let tactics = this.state.strategies[index].tactics
      if (tactics) {
        tactics.push('')
      } else {
        tactics = ['']
      }
      strategies[index]['tactics'] = tactics
      this.setState({ strategies })
    }
  }

  subNavClicked(currentPage) {
    console.log('subNavClicked called', currentPage)

    this.setState({ currentPage })

  }

  closeModal() {
    console.log('closeModal called in SubEditLog')

    this.setState({ modalIsOpen: false, showSmartDefinition: false,
      showPicker: false, showDateTimePicker: false, showStrategyDefinition: false,
      showFeedback: false, selectedSuggestion: null, selectedIndex: null
    })

    // if (this.props.closeModal) {
    //   this.props.closeModal()
    // }
  }

  renderDetails() {
    console.log('renderDetails called in SubEditLog')

    return (
      <View key="everythingLogs">
        <View>
          <View>
            {(this.props.modalIsOpen) && (
              <View style={[styles.row10,styles.rowDirection]}>
                <View style={[styles.calcColumn120]}>
                  {this.state.editExisting ? (
                    <View>
                      <Text style={[styles.headingText2]}>Edit {this.state.logType}</Text>
                    </View>
                  ) : (
                    <View>
                      {(this.state.logType && this.state.logType !== '') ? (
                        <Text style={[styles.headingText2]}>New {(this.state.selectedGroup) && this.state.selectedGroup.name + " "}{this.state.logType}</Text>
                      ) : (
                        <Text style={[styles.headingText2]}>New Log</Text>
                      )}
                    </View>
                  )}
                </View>
                {(this.props.modalIsOpen) && (
                  <View style={[styles.width40,styles.topMargin]}>
                    <TouchableOpacity onPress={() => this.props.closeModal()}>
                      <Image source={{ uri: closeIcon}} style={[styles.square20,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>
            )}

            {(!this.props.fromWalkthrough) && (
              <View>
                {(!this.state.editExisting && !this.props.fromGoals  && !this.props.fromGroups) && (
                  <View style={[styles.row10]}>
                    <Text style={[styles.row10,styles.standardText]}>Log Type<Text style={[styles.errorColor]}>*</Text></Text>
                    {(Platform.OS === 'ios') ? (
                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Log Type', selectedIndex: null, selectedName: "logType", selectedValue: this.state.logType, selectedOptions: this.state.logTypeOptions, selectedSubKey: null })}>
                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                          <View style={[styles.calcColumn115]}>
                            <Text style={[styles.descriptionText1]}>{this.state.logType}</Text>
                          </View>
                          <View style={[styles.width20,styles.topMargin5]}>
                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                          </View>
                        </View>
                      </TouchableOpacity>
                    ) : (
                      <View style={[styles.standardBorder]}>
                        <Picker
                          selectedValue={this.state.logType}
                          onValueChange={(itemValue, itemIndex) =>
                            this.formChangeHandler("logType",itemValue)
                          }>
                          {this.state.logTypeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                        </Picker>
                      </View>
                    )}

                    {(!this.props.fromWalkthrough) && (
                      <View style={[styles.row10]}>
                        {(this.state.logType === 'Goal') && (
                          <Text style={[styles.descriptionText1]}>Set <Text style={[styles.standardText,styles.ctaColor,styles.underlineText,styles.offsetUnderline]} onPress={() => this.setState({ modalIsOpen: true, showSmartDefinition: true })}>S.M.A.R.T.</Text> career goals to get suggestions, get resources, and make use of accountability groups.</Text>
                        )}
                        {(this.state.logType === 'Meeting') && (
                          <Text style={[styles.descriptionText1]}>Add meetings and associated meeting minutes within accountability groups.</Text>
                        )}
                        {(this.state.logType === 'Session') && (
                          <Text style={[styles.descriptionText1]}>Add advising sessions with counselors, mentors, and other advisors discussing paths, opportunities, resume reviews, mock interviews, etc....</Text>
                        )}
                        {(this.state.logType === 'Application') && (
                          <Text style={[styles.descriptionText1]}>Add your applications to work opportunities you've submitted outside of Guided Compass, for your record and to share with advisors.</Text>
                        )}
                        {(this.state.logType === 'Interview') && (
                          <Text style={[styles.descriptionText1]}>Add notes from interviews you've had for work opportunities, for your record and to share with advisors.</Text>
                        )}
                        {(this.state.logType === 'Offer') && (
                          <Text style={[styles.descriptionText1]}>Add offer details you've had for work opportunities, for your record and to share with advisors.</Text>
                        )}
                        {(this.state.logType === 'Passion') && (
                          <Text style={[styles.descriptionText1]}>Add passions you have, for your record, for creating a career plan, for recommending opportunities, and to share with advisors.</Text>
                        )}
                      </View>
                    )}

                    <View style={[styles.spacer]} />

                    <View style={[styles.horizontalLine]} />
                  </View>
                )}
              </View>
            )}

            {(this.state.logType === 'Goal') && (
              <View>

                {(this.state.currentPage === 'Details') && (
                  <View>
                    <View style={[styles.spacer]} />

                    {(this.state.editExisting && !this.state.remoteAuth) && (
                      <View style={[styles.row10]}>

                        {(this.state.publicProfile && this.state.publicProfileExtent && this.state.publicPreferences && this.state.publicPreferences[2] && (this.state.publicPreferences[2].value === 'All' || this.state.publicPreferences[2].value === 'Some')) ? (
                          <View style={[styles.standardBorder,styles.padding40]}>
                            <Text style={[styles.topMargin]}>Share this link to crowdsource resources for this goal: <Text onPress={() => Linking.openURL('https://www/guidedcompass.com/goals/' + this.state.goalId)} style={[styles.ctaColor,styles.boldText]}>{'https://www/guidedcompass.com/goals/' + this.state.goalId}</Text>. If you want to make your goal private, you can do so <Text onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Visibility Preferences'})} style={[styles.ctaColor,styles.boldText]}>here</Text>.</Text>
                          </View>
                        ) : (
                          <View style={[styles.standardBorder,styles.padding40]}>
                            <Text style={[styles.topMargin]}>To crowdsource resources for this goal, make it public <Text onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Visibility Preferences'})} style={[styles.ctaColor,styles.boldText]}>here</Text>, then share this link: <Text onPress={() => Linking.openURL('https://www/guidedcompass.com/goals/' + this.state.goalId)} style={[styles.ctaColor,styles.boldText]}>{'https://www/guidedcompass.com/goals/' + this.state.goalId}</Text>.</Text>
                          </View>
                        )}
                      </View>
                    )}

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Title<Text style={[styles.errorColor]}>*</Text></Text>
                      <TextInput
                        style={[styles.textInput]}
                        onChangeText={(text) => this.formChangeHandler("goalTitle", text)}
                        value={this.state.goalTitle}
                        placeholder="Write the title of your goal..."
                        placeholderTextColor="grey"
                      />
                    </View>

                    <View style={[styles.row10]}>
                      <View>
                        <Text style={[styles.row10,styles.standardText]}>Select a Goal Type<Text style={[styles.errorColor]}>*</Text></Text>
                        {(Platform.OS === 'ios') ? (
                          <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Goal Type', selectedIndex: null, selectedName: "goalType", selectedValue: this.state.goalType.description, selectedOptions: this.state.goalTypeOptions, selectedSubKey: 'description' })}>
                            <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                              <View style={(this.props.modalIsOpen) ? [styles.calcColumn155] : [styles.calcColumn115]}>
                                <Text style={[styles.descriptionText1]}>{this.state.goalType.description}</Text>
                              </View>
                              <View style={[styles.width20,styles.topMargin5]}>
                                <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                              </View>
                            </View>
                          </TouchableOpacity>
                        ) : (
                          <View style={[styles.standardBorder]}>
                            <Picker
                              selectedValue={this.state.goalType.description}
                              onValueChange={(itemValue, itemIndex) =>
                                this.formChangeHandler("goalType",itemValue)
                              }>
                              {this.state.goalTypeOptions.map(value => <Picker.Item key={value.description} label={value.description} value={value.description} />)}
                            </Picker>
                          </View>
                        )}

                      </View>

                      {(this.state.goalType.name === 'Alternatives') ? (
                        <View>

                          <View style={[styles.topPadding20]}>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>What type of comparison?</Text>

                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Comparison Type', selectedIndex: null, selectedName: "comparisonType", selectedValue: this.state.comparisonType, selectedOptions: this.state.comparisonTypeOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn155] : [styles.calcColumn115]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.comparisonType}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.comparisonType}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("comparisonType",itemValue)
                                    }>
                                    {this.state.comparisonTypeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}

                            </View>
                            <View>
                              <View>
                                <View style={[styles.bottomPadding5]}>
                                  <Text style={[styles.row10,styles.standardText]}>Would you like to poll your connections?</Text>
                                  {/*<Text style={[styles.descriptionText2,styles.bottomPadding5]}>This allows people to vote on what you should do and explain why</Text>*/}

                                </View>

                                <View style={[styles.alignStart]}>
                                  <Switch
                                    onValueChange={(change) => {
                                      console.log('show change: ', change, typeof change)
                                      this.setState({ pollConnections: change, formHasChanged: true })}
                                    }
                                    value={this.state.pollConnections}
                                    id="pollConnections"
                                  />
                                </View>

                              </View>
                            </View>

                          </View>

                          {(this.state.pollConnections && this.state.pollQuestion) && (
                            <View style={[styles.topPadding20]}>
                              <Text style={[styles.row10,styles.descriptionTextColor]}>Poll Questions: <Text style={[styles.errorColor]}>{this.state.pollQuestion}</Text></Text>
                            </View>
                          )}

                          <View style={[styles.topPadding20]}>
                            <View>
                              <View style={[styles.standardBorder,styles.padding20]}>
                                <Text style={[styles.headingText6]}>Option A</Text>

                                <View style={[styles.row10]}>
                                  <Text style={[styles.row10,styles.standardText]}>Name<Text style={[styles.errorColor]}>*</Text></Text>
                                  <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => this.formChangeHandler("aName", text)}
                                    value={this.state.aName}
                                    placeholder="Option A name"
                                    placeholderTextColor="grey"
                                  />
                                </View>

                                {(this.state.comparisonType === 'Careers') && (
                                  <View>
                                    <View style={[styles.row10]}>
                                      <Text style={[styles.row10,styles.standardText]}>Tag a Career Path</Text>

                                      <View style={[styles.rowDirection]}>
                                        <View style={[styles.calcColumn170]}>
                                          <TextInput
                                            style={styles.textInput}
                                            onChangeText={(text) => this.formChangeHandler("searchCareersA", text)}
                                            value={this.state.searchStringA}
                                            placeholder="Search 1,000+ career paths..."
                                            placeholderTextColor="grey"
                                          />
                                        </View>
                                        <View style={[styles.width70,styles.leftPadding]}>
                                          <TouchableOpacity style={(!this.state.searchStringA || this.state.searchStringA === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringA || this.state.searchStringA === '') ? true : false} onPress={() => this.addItem('careerA')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                        </View>
                                      </View>

                                    </View>

                                    {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                                    {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                                    {(this.state.searchIsAnimatingCareersA) ? (
                                      <View style={[styles.flexCenter,styles.flex1]}>
                                        <View>
                                          <View style={[styles.superSpacer]} />

                                          <ActivityIndicator
                                             animating = {this.state.searchIsAnimatingCareersA}
                                             color = '#87CEFA'
                                             size = "large"
                                             style={[styles.square80, styles.centerHorizontally]}/>

                                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                          <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                        </View>
                                      </View>
                                    ) : (
                                      <View>
                                        <View>
                                          {(this.state.careerOptionsA && this.state.careerOptionsA.length > 0) && (
                                            <View style={[styles.card,styles.topMargin]}>
                                              {this.state.careerOptionsA.map((value, optionIndex) =>
                                                <View key={value._id} style={[styles.bottomMargin5]}>
                                                  <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'careerA')}>
                                                    <View style={[styles.calcColumn60,styles.rowDirection]}>
                                                      <View style={[styles.width40]}>
                                                        <View style={[styles.miniSpacer]} />
                                                        <Image source={{ uri: experienceIcon}} style={[styles.square22,styles.contain]} />
                                                      </View>
                                                      <View style={[styles.calcColumn100]}>
                                                        <Text style={[styles.ctaColor]}>{value.name}</Text>
                                                      </View>
                                                    </View>
                                                  </TouchableOpacity>
                                                </View>
                                              )}
                                            </View>
                                          )}
                                        </View>

                                        <View>

                                          {this.renderTags('careerA')}


                                        </View>

                                      </View>
                                    )}

                                  </View>
                                )}

                                {(this.state.comparisonType === 'Jobs') && (
                                  <View>
                                    <View style={[styles.row10]}>
                                      <Text style={[styles.row10,styles.standardText]}>Tag a Job</Text>

                                      <View style={[styles.rowDirection]}>
                                        <View style={[styles.calcColumn170]}>
                                          <TextInput
                                            style={styles.textInput}
                                            onChangeText={(text) => this.formChangeHandler("searchOpportunitiesA", text)}
                                            value={this.state.searchStringOpportunitiesA}
                                            placeholder="Search work opportunities..."
                                            placeholderTextColor="grey"
                                          />
                                        </View>
                                        <View style={[styles.width70,styles.leftPadding]}>
                                          <TouchableOpacity style={(!this.state.searchStringOpportunitiesA || this.state.searchStringOpportunitiesA === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringOpportunitiesA || this.state.searchStringOpportunitiesA === '') ? true : false} onPress={() => this.addItem('opportunityA')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                        </View>
                                      </View>

                                    </View>



                                    {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                                    {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                                    {(this.state.searchIsAnimatingOpportunitiesA) ? (
                                      <View style={[styles.flexCenter,styles.flex1]}>
                                        <View>
                                          <View style={[styles.superSpacer]} />

                                          <ActivityIndicator
                                             animating = {this.state.searchIsAnimatingOpportunitiesA}
                                             color = '#87CEFA'
                                             size = "large"
                                             style={[styles.square80, styles.centerHorizontally]}/>

                                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                          <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                        </View>
                                      </View>
                                    ) : (
                                      <View>
                                        <View>
                                          {(this.state.opportunityOptionsA && this.state.opportunityOptionsA.length > 0) && (
                                            <View style={[styles.card,styles.topMargin]}>
                                              {this.state.opportunityOptionsA.map((value, optionIndex) =>
                                                <View key={value._id} style={[styles.bottomMargin5]}>
                                                  <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'opportunityA')}>
                                                    <View style={[styles.calcColumn60,styles.rowDirection]}>
                                                      <View style={[styles.width40]}>
                                                        <View style={[styles.miniSpacer]} />
                                                        <Image source={{ uri: experienceIcon}} style={[styles.square22,styles.contain]} />
                                                      </View>
                                                      <View style={[styles.calcColumn100]}>
                                                        <Text style={[styles.ctaColor]}>{(value.title) ? value.title : value.name}{value.employerName && " | " + value.employerName}</Text>
                                                      </View>
                                                    </View>
                                                  </TouchableOpacity>
                                                </View>
                                              )}
                                            </View>
                                          )}
                                        </View>

                                        <View>

                                          {this.renderTags('opportunityA')}


                                        </View>

                                      </View>
                                    )}

                                  </View>
                                )}

                                {(this.state.comparisonType === 'Competencies') && (
                                  <View>
                                    <Text style={[styles.row10,styles.standardText]}>Tag a Competency</Text>

                                    <View style={[styles.rowDirection]}>
                                      <View style={[styles.calcColumn170]}>
                                        <TextInput
                                          style={styles.textInput}
                                          onChangeText={(text) => this.formChangeHandler("searchSkillsA", text)}
                                          value={this.state.searchStringCompetenciesA}
                                          placeholder="Search competencies..."
                                          placeholderTextColor="grey"
                                        />
                                      </View>
                                      <View style={[styles.width70,styles.leftPadding]}>
                                        <TouchableOpacity style={(!this.state.searchStringCompetenciesA || this.state.searchStringCompetenciesA === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringCompetenciesA || this.state.searchStringCompetenciesA === '') ? true : false} onPress={() => this.addItem('skillA')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                      </View>
                                    </View>

                                    {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                                    {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                                    {(this.state.searchIsAnimatingCompetenciesA) ? (
                                      <View style={[styles.flexCenter,styles.flex1]}>
                                        <View>
                                          <View style={[styles.superSpacer]} />

                                          <ActivityIndicator
                                             animating = {this.state.searchIsAnimatingCompetenciesA}
                                             color = '#87CEFA'
                                             size = "large"
                                             style={[styles.square80, styles.centerHorizontally]}/>

                                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                          <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                        </View>
                                      </View>
                                    ) : (
                                      <View>
                                        <View>
                                          {(this.state.competencyOptionsA && this.state.competencyOptionsA.length > 0) && (
                                            <View style={[styles.card,styles.topMargin]}>
                                              {this.state.competencyOptionsA.map((value, optionIndex) =>
                                                <View key={value._id} style={[styles.bottomMargin5]}>
                                                  <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'competencyA')}>
                                                    <View style={[styles.calcColumn60,styles.rowDirection]}>
                                                      <View style={[styles.width40]}>
                                                        <View style={[styles.halfSpacer]} />
                                                        <Image source={{ uri: skillsIcon}} style={[styles.square22,styles.contain]} />
                                                      </View>
                                                      <View style={[styles.calcColumn100]}>
                                                        <Text style={[styles.ctaColor]}>{value.name}</Text>
                                                        <Text style={[styles.descriptionText2,styles.descriptionTextColor]}>{value.type}</Text>
                                                      </View>
                                                    </View>
                                                  </TouchableOpacity>
                                                </View>
                                              )}
                                            </View>
                                          )}
                                        </View>

                                        <View>

                                          {this.renderTags('skillA')}


                                        </View>

                                      </View>
                                    )}


                                  </View>
                                )}

                                {(this.state.comparisonType === 'Projects') && (
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.row10,styles.standardText]}>Select one of your projects</Text>

                                    {(Platform.OS === 'ios') ? (
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Project A Name', selectedIndex: null, selectedName: "aItemProject", selectedValue: (this.state.aItem) ? this.state.aItem.name : null, selectedOptions: this.state.projectOptions, selectedSubKey: 'name' })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={(this.props.modalIsOpen) ? [styles.calcColumn190] : [styles.calcColumn150]}>
                                            <Text style={[styles.descriptionText1]}>{(this.state.aItem) && this.state.aItem.name}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    ) : (
                                      <View style={[styles.standardBorder]}>
                                        <Picker
                                          selectedValue={(this.state.aItem) && this.state.aItem.name}
                                          onValueChange={(itemValue, itemIndex) =>
                                            this.formChangeHandler("aItemProject",itemValue)
                                          }>
                                          {this.state.projectOptions.map(value => <Picker.Item key={value.name} label={value.name} value={value.name} />)}
                                        </Picker>
                                      </View>
                                    )}

                                    <Text style={[styles.descriptionText2,styles.bottomPadding5]}>You can add projects to your profile <Text onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Details'})} style={[styles.decriptionText2,styles.ctaColor,styles.boldText]}>here</Text></Text>

                                  </View>
                                )}

                                <View style={[styles.row10]}>
                                  <Text style={[styles.row10,styles.standardText]}>Annualized Market Value / Pay</Text>

                                  <View style={[styles.rowDirection]}>
                                    <View style={[styles.standardBorder,styles.lightBackground,styles.width22,styles.centerText,styles.height40]}>
                                      <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                                      <Text style={[styles.headingText4,styles.ctaColor,styles.boldText,styles.flex1,styles.centerText]}>$</Text>
                                    </View>
                                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                      <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) => this.formChangeHandler("aValue", text)}
                                        value={this.state.aValue}
                                        placeholder="0"
                                        placeholderTextColor="grey"
                                        keyboardType='numeric'
                                      />
                                    </View>
                                  </View>

                                </View>

                                <View style={[styles.row10]}>
                                  <Text style={[styles.row10,styles.standardText]}>The Case for Option A</Text>
                                  <TextInput
                                    style={styles.textArea}
                                    onChangeText={(text) => this.formChangeHandler("aCase", text)}
                                    value={this.state.aCase}
                                    placeholder="Make the case for this option..."
                                    placeholderTextColor="grey"
                                    multiline={true}
                                    numberOfLines={4}
                                  />
                                </View>

                                <View style={[styles.row10]}>
                                  <View style={[styles.rowDirection]}>
                                    <View>
                                      <Text style={[styles.row10,styles.standardText]}>Relevant Links to Decide</Text>
                                    </View>
                                    <View style={[styles.leftPadding,styles.topPadding15]}>
                                      <TouchableOpacity onPress={() => this.addItem('aLink')}>
                                        <Image source={{ uri: addIcon}} style={[styles.square15,styles.contain]} />
                                      </TouchableOpacity>
                                    </View>

                                  </View>

                                  {(this.state.aLinks) && (
                                    <View>
                                      {this.state.aLinks.map((value, optionIndex) =>
                                        <View key={'aLink|' + optionIndex} style={[styles.bottomPadding5,styles.rowDirection]}>
                                          <View style={[styles.width30,styles.topPadding]}>
                                            <TouchableOpacity onPress={() => this.addRemoveItems('Remove', optionIndex,'aLink')}>
                                              <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                                            </TouchableOpacity>
                                          </View>
                                          <View style={(this.props.modalIsOpen) ? [styles.calcColumn180] : [styles.calcColumn140]}>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("aLink|" + optionIndex + "|name", text)}
                                              value={value}
                                              placeholder="Add a link..."
                                              placeholderTextColor="grey"
                                            />

                                            {(value !== '' && !value.startsWith('http')) && (
                                              <View style={[styles.topPadding5]}>
                                                <Text style={[styles.errorColor,styles.descriptionText2]}>Please add a valid link that starts with http</Text>
                                              </View>
                                            )}
                                          </View>

                                        </View>
                                      )}
                                    </View>
                                  )}

                                </View>

                              </View>

                              <View style={[styles.standardBorder,styles.padding20]}>
                                <Text style={[styles.headingText6]}>Option B</Text>

                                <View style={[styles.row10]}>
                                  <Text style={[styles.row10,styles.standardText]}>Name<Text style={[styles.errorColor]}>*</Text></Text>
                                  <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => this.formChangeHandler("bName", text)}
                                    value={this.state.bName}
                                    placeholder="Option B name..."
                                    placeholderTextColor="grey"
                                  />
                                </View>

                                {(this.state.comparisonType === 'Careers') && (
                                  <View>
                                    <View style={[styles.row10]}>
                                      <Text style={[styles.row10,styles.standardText]}>Tag a Career Path</Text>

                                      <View style={[styles.rowDirection]}>
                                        <View style={[styles.calcColumn170]}>
                                          <TextInput
                                            style={styles.textInput}
                                            onChangeText={(text) => this.formChangeHandler("searchCareersB", text)}
                                            value={this.state.searchStringB}
                                            placeholder="Search 1,000+ career paths..."
                                            placeholderTextColor="grey"
                                          />
                                        </View>
                                        <View style={[styles.width70,styles.leftPadding]}>
                                          <TouchableOpacity style={(!this.state.searchStringB || this.state.searchStringB === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringB || this.state.searchStringB === '') ? true : false} onPress={() => this.addItem('careerB')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                        </View>
                                      </View>

                                    </View>

                                    {(this.state.errorMessageB && this.state.errorMessageB !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessageB}</Text>}
                                    {(this.state.successMessageB && this.state.successMessageB !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessageB}</Text>}

                                    {(this.state.searchIsAnimatingCareersB) ? (
                                      <View style={[styles.flexCenter,styles.flex1]}>
                                        <View>
                                          <View style={[styles.superSpacer]} />

                                          <ActivityIndicator
                                             animating = {this.state.searchIsAnimatingCareersB}
                                             color = '#87CEFA'
                                             size = "large"
                                             style={[styles.square80, styles.centerHorizontally]}/>

                                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                          <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                        </View>
                                      </View>
                                    ) : (
                                      <View>
                                        <View>
                                          {(this.state.careerOptionsB && this.state.careerOptionsB.length > 0) && (
                                            <View style={[styles.card,styles.topMargin]}>
                                              {this.state.careerOptionsB.map((value, optionIndex) =>
                                                <View key={value._id} style={[styles.bottomMargin5]}>
                                                  <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'careerB')}>
                                                    <View style={[styles.calcColumn60,styles.rowDirection]}>
                                                      <View style={[styles.width40]}>
                                                        <View style={[styles.miniSpacer]} />
                                                        <Image source={{ uri: experienceIcon}} style={[styles.square22,styles.contain]} />
                                                      </View>
                                                      <View style={[styles.calcColumn100]}>
                                                        <Text style={[styles.ctaColor]}>{value.name}</Text>
                                                      </View>
                                                    </View>
                                                  </TouchableOpacity>
                                                </View>
                                              )}
                                            </View>
                                          )}
                                        </View>

                                        <View>

                                          {this.renderTags('careerB')}


                                        </View>

                                      </View>
                                    )}

                                  </View>
                                )}

                                {(this.state.comparisonType === 'Jobs') && (
                                  <View>
                                    <View style={[styles.row10]}>
                                      <Text style={[styles.row10,styles.standardText]}>Tag a Job</Text>

                                      <View style={[styles.rowDirection]}>
                                        <View style={[styles.calcColumn170]}>
                                          <TextInput
                                            style={styles.textInput}
                                            onChangeText={(text) => this.formChangeHandler("searchOpportunitiesB", text)}
                                            value={this.state.searchStringOpportunitiesB}
                                            placeholder="Search work opportunities..."
                                            placeholderTextColor="grey"
                                          />
                                        </View>
                                        <View style={[styles.width70,styles.leftPadding]}>
                                          <TouchableOpacity style={(!this.state.searchStringOpportunitiesB || this.state.searchStringOpportunitiesB === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringOpportunitiesB || this.state.searchStringOpportunitiesB === '') ? true : false} onPress={() => this.addItem('opportunityB')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                        </View>
                                      </View>

                                    </View>



                                    {(this.state.errorMessageB && this.state.errorMessageB !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessageB}</Text>}
                                    {(this.state.successMessageB && this.state.successMessageB !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessageB}</Text>}

                                    {(this.state.searchIsAnimatingOpportunitiesB) ? (
                                      <View style={[styles.flexCenter,styles.flex1]}>
                                        <View>
                                          <View style={[styles.superSpacer]} />

                                          <ActivityIndicator
                                             animating = {this.state.searchIsAnimatingOpportunitiesB}
                                             color = '#87CEFA'
                                             size = "large"
                                             style={[styles.square80, styles.centerHorizontally]}/>

                                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                          <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                        </View>
                                      </View>
                                    ) : (
                                      <View>
                                        <View>
                                          {(this.state.opportunityOptionsB && this.state.opportunityOptionsB.length > 0) && (
                                            <View style={[styles.card,styles.topMargin]}>
                                              {this.state.opportunityOptionsB.map((value, optionIndex) =>
                                                <View key={value._id} style={[styles.bottomMargin5]}>
                                                  <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'opportunityB')}>
                                                    <View style={[styles.calcColumn60,styles.rowDirection]}>
                                                      <View style={[styles.width40]}>
                                                        <View style={[styles.miniSpacer]} />
                                                        <Image source={{ uri: experienceIcon}} style={[styles.square22,styles.contain]} />
                                                      </View>
                                                      <View style={[styles.calcColumn100]}>
                                                        <Text style={[styles.ctaColor]}>{(value.title) ? value.title : value.name}{value.employerName && " | " + value.employerName}</Text>
                                                      </View>
                                                    </View>
                                                  </TouchableOpacity>
                                                </View>
                                              )}
                                            </View>
                                          )}
                                        </View>

                                        <View>

                                          {this.renderTags('opportunityB')}


                                        </View>

                                      </View>
                                    )}

                                  </View>
                                )}

                                {(this.state.comparisonType === 'Competencies') && (
                                  <View>
                                    <Text style={[styles.row10,styles.standardText]}>Tag a Competency</Text>

                                    <View style={[styles.rowDirection]}>
                                      <View style={[styles.calcColumn170]}>
                                        <TextInput
                                          style={styles.textInput}
                                          onChangeText={(text) => this.formChangeHandler("searchSkillsB", text)}
                                          value={this.state.searchStringCompetenciesB}
                                          placeholder="Search competencies..."
                                          placeholderTextColor="grey"
                                        />
                                      </View>
                                      <View style={[styles.width70,styles.leftPadding]}>
                                        <TouchableOpacity style={(!this.state.searchStringCompetenciesB || this.state.searchStringCompetenciesB === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringCompetenciesB || this.state.searchStringCompetenciesB === '') ? true : false} onPress={() => this.addItem('skillB')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                      </View>
                                    </View>

                                    {(this.state.errorMessageB && this.state.errorMessageB !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessageB}</Text>}
                                    {(this.state.successMessageB && this.state.successMessageB !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessageB}</Text>}

                                    {(this.state.searchIsAnimatingCompetenciesB) ? (
                                      <View style={[styles.flexCenter,styles.flex1]}>
                                        <View>
                                          <View style={[styles.superSpacer]} />

                                          <ActivityIndicator
                                             animating = {this.state.searchIsAnimatingCompetenciesB}
                                             color = '#87CEFA'
                                             size = "large"
                                             style={[styles.square80, styles.centerHorizontally]}/>

                                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                          <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                        </View>
                                      </View>
                                    ) : (
                                      <View>
                                        <View>
                                          {(this.state.competencyOptionsB && this.state.competencyOptionsB.length > 0) && (
                                            <View style={[styles.card,styles.topMargin]}>
                                              {this.state.competencyOptionsB.map((value, optionIndex) =>
                                                <View key={value._id} style={[styles.bottomMargin5]}>
                                                  <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'competencyB')}>
                                                    <View style={[styles.calcColumn60,styles.rowDirection]}>
                                                      <View style={[styles.width40]}>
                                                        <View style={[styles.halfSpacer]} />
                                                        <Image source={{ uri: skillsIcon}} style={[styles.square22,styles.contain]} />
                                                      </View>
                                                      <View style={[styles.calcColumn100]}>
                                                        <Text style={[styles.ctaColor]}>{value.name}</Text>
                                                        <Text style={[styles.descriptionText2,styles.descriptionTextColor]}>{value.type}</Text>
                                                      </View>
                                                    </View>
                                                  </TouchableOpacity>
                                                </View>
                                              )}
                                            </View>
                                          )}
                                        </View>

                                        <View>

                                          {this.renderTags('skillB')}


                                        </View>

                                      </View>
                                    )}


                                  </View>
                                )}

                                {(this.state.comparisonType === 'Projects') && (
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.row10,styles.standardText]}>Select one of your projects</Text>
                                    {(Platform.OS === 'ios') ? (
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Project B Name', selectedIndex: null, selectedName: "bItemProject", selectedValue: (this.state.bItem) ? this.state.bItem.name : null, selectedOptions: this.state.projectOptions, selectedSubKey: 'name' })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={(this.props.modalIsOpen) ? [styles.calcColumn190] : [styles.calcColumn150]}>
                                            <Text style={[styles.descriptionText1]}>{(this.state.bItem) && this.state.bItem.name}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    ) : (
                                      <View style={[styles.standardBorder]}>
                                        <Picker
                                          selectedValue={(this.state.bItem) && this.state.bItem.name}
                                          onValueChange={(itemValue, itemIndex) =>
                                            this.formChangeHandler("bItemProject",itemValue)
                                          }>
                                          {this.state.projectOptions.map(value => <Picker.Item key={value.name} label={value.name} value={value.name} />)}
                                        </Picker>
                                      </View>
                                    )}

                                    <Text style={[styles.descriptionText2,styles.bottomPadding5]}>You can add projects to your profile <Text onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Details'})} style={[styles.decriptionText2,styles.ctaColor,styles.boldText]}>here</Text></Text>

                                  </View>
                                )}

                                <View style={[styles.row10]}>
                                  <Text style={[styles.row10,styles.standardText]}>Annualized Market Value / Pay</Text>

                                  <View style={[styles.rowDirection]}>
                                    <View style={[styles.standardBorder,styles.lightBackground,styles.width22,styles.centerText,styles.height40]}>
                                      <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                                      <Text style={[styles.headingText4,styles.ctaColor,styles.boldText,styles.flex1,styles.centerText]}>$</Text>
                                    </View>
                                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                      <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) => this.formChangeHandler("bValue", text)}
                                        value={this.state.bValue}
                                        placeholder="0"
                                        placeholderTextColor="grey"
                                        keyboardType='numeric'
                                      />
                                    </View>
                                  </View>

                                </View>

                                <View style={[styles.row10]}>
                                  <Text style={[styles.row10,styles.standardText]}>The Case for Option B</Text>
                                  <TextInput
                                    style={styles.textArea}
                                    onChangeText={(text) => this.formChangeHandler("bCase", text)}
                                    value={this.state.bCase}
                                    placeholder="Make the case for this option..."
                                    placeholderTextColor="grey"
                                    multiline={true}
                                    numberOfLines={4}
                                  />
                                </View>

                                <View style={[styles.row10]}>
                                  <View style={[styles.rowDirection]}>
                                    <View>
                                      <Text style={[styles.row10,styles.standardText]}>Relevant Links to Decide</Text>
                                    </View>
                                    <View style={[styles.leftPadding,styles.topPadding15]}>
                                      <TouchableOpacity onPress={() => this.addItem('bLink')}>
                                        <Image source={{ uri: addIcon}} style={[styles.square15,styles.contain]} />
                                      </TouchableOpacity>
                                    </View>

                                  </View>

                                  {(this.state.bLinks) && (
                                    <View>
                                      {this.state.bLinks.map((value, optionIndex) =>
                                        <View key={'bLink|' + optionIndex} style={[styles.bottomPadding5,styles.rowDirection]}>
                                          <View style={[styles.width30,styles.topPadding]}>
                                            <TouchableOpacity onPress={() => this.addRemoveItems('Remove', optionIndex,'aLink')}>
                                              <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                                            </TouchableOpacity>
                                          </View>
                                          <View style={(this.props.modalIsOpen) ? [styles.calcColumn180] : [styles.calcColumn140]}>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("bLink|" + optionIndex + "|name", text)}
                                              value={value}
                                              placeholder="http..."
                                              placeholderTextColor="grey"
                                            />

                                            {(value !== '' && !value.startsWith('http')) && (
                                              <View style={[styles.topPadding5]}>
                                                <Text style={[styles.errorColor,styles.descriptionText2]}>Please add a valid link that starts with http</Text>
                                              </View>
                                            )}
                                          </View>

                                        </View>
                                      )}
                                    </View>
                                  )}

                                </View>

                              </View>

                            </View>
                          </View>
                        </View>
                      ) : (
                        <View />
                      )}

                      {(this.state.goalType.name === 'Degree') && (
                        <View>
                          <View style={[styles.row10]}>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>Degree Type</Text>

                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Degree Type', selectedIndex: null, selectedName: "degreeType", selectedValue: this.state.degreeType, selectedOptions: this.state.degreeOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn155] : [styles.calcColumn115]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.degreeType}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.degreeType}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("degreeType",itemValue)
                                    }>
                                    {this.state.degreeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}

                            </View>

                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <View style={[styles.row10]}>
                                <Text style={[styles.row10,styles.standardText]}>School / University Name(s)</Text>

                                <View style={[styles.rowDirection]}>
                                  <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("schoolName", text)}
                                      value={this.state.schoolName}
                                      placeholder="Add a school..."
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View style={[styles.width70,styles.leftPadding]}>
                                    <TouchableOpacity style={(!this.state.schoolName || this.state.schoolName === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.schoolName || this.state.schoolName === '') ? true : false} onPress={() => this.addItem('school')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                  </View>
                                </View>

                              </View>

                              <View>
                                {this.renderTags('school')}

                              </View>

                            </View>

                            <View>
                              <View style={[styles.row10]}>
                                <Text style={[styles.row10,styles.standardText]}>Major(s)</Text>

                                <View style={[styles.rowDirection]}>
                                  <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("major", text)}
                                      value={this.state.major}
                                      placeholder="Add a major..."
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View style={[styles.width70,styles.leftPadding]}>
                                    <TouchableOpacity style={(!this.state.major || this.state.major === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.major || this.state.major === '') ? true : false} onPress={() => this.addItem('major')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                  </View>
                                </View>

                              </View>

                              <View>
                                {this.renderTags('major')}

                              </View>

                            </View>

                          </View>
                        </View>
                      )}

                      {(this.state.goalType.name === 'Social Problem') && (
                        <View>
                          <View style={[styles.row10]}>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>Problem Type</Text>
                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Societal Problem', selectedIndex: null, selectedName: "societalProblem", selectedValue: this.state.societalProblem, selectedOptions: this.state.societalProblemOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn155] : [styles.calcColumn115]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.societalProblem}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.societalProblem}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("societalProblem",itemValue)
                                    }>
                                    {this.state.societalProblemOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}

                            </View>
                          </View>
                        </View>
                      )}

                      {(this.state.goalType.name === 'Career' || this.state.goalType.name === 'Switch' || this.state.goalType.name === 'Freelance' || this.state.goalType.name === 'Explore' || this.state.goalType.name === 'Leadership' || this.state.goalType.name === 'Expert' || this.state.goalType.name === 'Promotion'  || this.state.goalType.name === 'Award') && (
                        <View>
                          <View style={[styles.row10,styles.flex1]}>
                            <View>
                              <View style={[styles.row10]}>
                                <Text style={[styles.row10,styles.standardText]}>Tag Career Path(s)</Text>

                                <View style={[styles.rowDirection]}>
                                  <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("searchCareers", text)}
                                      value={this.state.searchString}
                                      placeholder="Search 1,000+ career paths..."
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View style={[styles.width70,styles.leftPadding]}>
                                    <TouchableOpacity style={(!this.state.searchString || this.state.searchString === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchString || this.state.searchString === '') ? true : false} onPress={() => this.addItem('career')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                  </View>
                                </View>
                              </View>

                              {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                              {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                              {(this.state.searchIsAnimatingCareers) ? (
                                <View style={[styles.flexCenter,styles.flex1]}>
                                  <View>
                                    <View style={[styles.superSpacer]} />

                                    <ActivityIndicator
                                       animating = {this.state.searchIsAnimatingCareers}
                                       color = '#87CEFA'
                                       size = "large"
                                       style={[styles.square80, styles.centerHorizontally]}/>

                                    <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                    <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                  </View>
                                </View>
                              ) : (
                                <View>
                                  <View>
                                    {(this.state.careerOptions && this.state.careerOptions.length > 0) && (
                                      <View style={[styles.card,styles.topMargin]}>
                                        {this.state.careerOptions.map((value, optionIndex) =>
                                          <View key={value._id} style={[styles.bottomMargin5]}>
                                            <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'career')}>
                                              <View style={[styles.calcColumn60,styles.rowDirection]}>
                                                <View style={[styles.width40]}>
                                                  <View style={[styles.miniSpacer]} />
                                                  <Image source={{ uri: experienceIcon}} style={[styles.square22,styles.contain]} />
                                                </View>
                                                <View style={[styles.calcColumn100]}>
                                                  <Text style={[styles.ctaColor]}>{value.name}</Text>
                                                </View>
                                              </View>
                                            </TouchableOpacity>
                                          </View>
                                        )}
                                      </View>
                                    )}
                                  </View>

                                  <View>

                                    {this.renderTags('career')}


                                  </View>

                                </View>
                              )}

                            </View>

                            <View>
                              <View style={[styles.row10]}>
                                <Text style={[styles.row10,styles.standardText]}>Tag Specific Opportunities</Text>

                                <View style={[styles.rowDirection]}>
                                  <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("searchOpportunities", text)}
                                      value={this.state.searchStringOpportunities}
                                      placeholder="Search work opportunities..."
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View style={[styles.width70,styles.leftPadding]}>
                                    <TouchableOpacity style={(!this.state.searchStringOpportunities || this.state.searchStringOpportunities === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringOpportunities || this.state.searchStringOpportunities === '') ? true : false} onPress={() => this.addItem('opportunity')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                  </View>
                                </View>

                              </View>

                              {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                              {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                              {(this.state.searchIsAnimatingOpportunities) ? (
                                <View style={[styles.flexCenter,styles.flex1]}>
                                  <View>
                                    <View style={[styles.superSpacer]} />

                                    <ActivityIndicator
                                       animating = {this.state.searchIsAnimatingOpportunities}
                                       color = '#87CEFA'
                                       size = "large"
                                       style={[styles.square80, styles.centerHorizontally]}/>

                                    <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                    <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                  </View>
                                </View>
                              ) : (
                                <View>
                                  <View>
                                    {(this.state.opportunityOptions && this.state.opportunityOptions.length > 0) && (
                                      <View style={[styles.card,styles.topMargin]}>
                                        {this.state.opportunityOptions.map((value, optionIndex) =>
                                          <View key={value._id} style={[styles.bottomMargin5]}>
                                            <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'opportunity')}>
                                              <View style={[styles.calcColumn60,styles.rowDirection]}>
                                                <View style={[styles.width40]}>
                                                  <View style={[styles.miniSpacer]} />
                                                  <Image source={{ uri: experienceIcon}} style={[styles.square22,styles.contain]} />
                                                </View>
                                                <View style={[styles.calcColumn100]}>
                                                  <Text style={[styles.ctaColor]}>{(value.title) ? value.title : value.name}{value.employerName && " | " + value.employerName}</Text>
                                                </View>
                                              </View>
                                            </TouchableOpacity>
                                          </View>
                                        )}
                                      </View>
                                    )}
                                  </View>

                                  <View>

                                    {this.renderTags('opportunity')}


                                  </View>

                                </View>
                              )}

                            </View>
                          </View>

                          <View style={[styles.row10,styles.flex1]}>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>Tag Functions of Interest</Text>

                              <View style={[styles.rowDirection]}>
                                <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                  {(Platform.OS === 'ios') ? (
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Job Function', selectedIndex: null, selectedName: "selectedFunction", selectedValue: this.state.selectedFunction, selectedOptions: this.state.functionOptions, selectedSubKey: null })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                        <View style={(this.props.modalIsOpen) ? [styles.calcColumn220] : [styles.calcColumn180]}>
                                          <Text style={[styles.descriptionText1]}>{this.state.selectedFunction}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View style={[styles.standardBorder]}>
                                      <Picker
                                        selectedValue={this.state.selectedFunction}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("selectedFunction",itemValue)
                                        }>
                                        {this.state.functionOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                      </Picker>
                                    </View>
                                  )}

                                </View>
                                <View style={[styles.width70,styles.leftPadding]}>
                                  <TouchableOpacity style={(!this.state.selectedFunction || this.state.selectedFunction === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.selectedFunction || this.state.selectedFunction === '') ? true : false} onPress={() => this.addItem('function')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                </View>
                              </View>

                              <View>
                                {this.renderTags('function')}

                              </View>
                            </View>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>Tag Industries of Interests</Text>

                              <View style={[styles.rowDirection]}>
                                <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                  {(Platform.OS === 'ios') ? (
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Industry', selectedIndex: null, selectedName: "selectedIndustry", selectedValue: this.state.selectedIndustry, selectedOptions: this.state.industryOptions, selectedSubKey: null })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                        <View style={(this.props.modalIsOpen) ? [styles.calcColumn220] : [styles.calcColumn180]}>
                                          <Text style={[styles.descriptionText1]}>{this.state.selectedIndustry}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View style={[styles.standardBorder]}>
                                      <Picker
                                        selectedValue={this.state.selectedIndustry}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("selectedIndustry",itemValue)
                                        }>
                                        {this.state.industryOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                      </Picker>
                                    </View>
                                  )}

                                </View>
                                <View style={[styles.width70,styles.leftPadding]}>
                                  <TouchableOpacity style={(!this.state.selectedIndustry || this.state.selectedIndustry === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.selectedIndustry || this.state.selectedIndustry === '') ? true : false} onPress={() => this.addItem('industry')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                </View>
                              </View>

                              <View>
                                {this.renderTags('industry')}

                              </View>
                            </View>

                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>Hours / Week</Text>

                              <View style={[styles.rowDirection]}>
                                <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                  {(Platform.OS === 'ios') ? (
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Hours Per Week', selectedIndex: null, selectedName: "selectedHoursPerWeek", selectedValue: this.state.selectedHoursPerWeek, selectedOptions: this.state.hoursPerWeekOptions, selectedSubKey: null })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                        <View style={(this.props.modalIsOpen) ? [styles.calcColumn220] : [styles.calcColumn180]}>
                                          <Text style={[styles.descriptionText1]}>{this.state.selectedHoursPerWeek}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View style={[styles.standardBorder]}>
                                      <Picker
                                        selectedValue={this.state.selectedHoursPerWeek}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("selectedHoursPerWeek",itemValue)
                                        }>
                                        {this.state.hoursPerWeekOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                      </Picker>
                                    </View>
                                  )}

                                </View>
                                <View style={[styles.width70,styles.leftPadding]}>
                                  <TouchableOpacity style={(!this.state.selectedHoursPerWeek || this.state.selectedHoursPerWeek === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.selectedHoursPerWeek || this.state.selectedHoursPerWeek === '') ? true : false} onPress={() => this.addItem('hoursPerWeek')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                </View>
                              </View>

                              <View>
                                {this.renderTags('hoursPerWeek')}

                              </View>
                            </View>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>Annualized Pay Range</Text>

                              <View style={[styles.rowDirection]}>
                                <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                  {(Platform.OS === 'ios') ? (
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Pay Range', selectedIndex: null, selectedName: "selectedPayRange", selectedValue: this.state.selectedPayRange, selectedOptions: this.state.annualPayOptions, selectedSubKey: null })}>
                                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                        <View style={(this.props.modalIsOpen) ? [styles.calcColumn220] : [styles.calcColumn180]}>
                                          <Text style={[styles.descriptionText1]}>{this.state.selectedPayRange}</Text>
                                        </View>
                                        <View style={[styles.width20,styles.topMargin5]}>
                                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  ) : (
                                    <View style={[styles.standardBorder]}>
                                      <Picker
                                        selectedValue={this.state.selectedPayRange}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("selectedPayRange",itemValue)
                                        }>
                                        {this.state.annualPayOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                      </Picker>
                                    </View>
                                  )}
                                </View>
                                <View style={[styles.width70,styles.leftPadding]}>
                                  <TouchableOpacity style={(!this.state.selectedPayRange || this.state.selectedPayRange === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.selectedPayRange || this.state.selectedPayRange === '') ? true : false} onPress={() => this.addItem('payRange')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                </View>
                              </View>

                              <View>
                                {this.renderTags('payRange')}
                              </View>
                            </View>

                          </View>

                          <View style={[styles.row10]}>
                            <Text style={[styles.row10,styles.standardText]}>What do you want to optimize for?</Text>

                            <View style={[styles.rowDirection]}>
                              <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Optimize', selectedIndex: null, selectedName: "selectedOptimize", selectedValue: this.state.selectedOptimize, selectedOptions: this.state.optimizeOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={(this.props.modalIsOpen) ? [styles.calcColumn220] : [styles.calcColumn180]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.selectedOptimize}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.selectedOptimize}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("selectedOptimize",itemValue)
                                      }>
                                      {this.state.optimizeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}

                              </View>
                              <View style={[styles.width70,styles.leftPadding]}>
                                <TouchableOpacity style={(!this.state.selectedOptimize || this.state.selectedOptimize === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.selectedOptimize || this.state.selectedOptimize === '') ? true : false} onPress={() => this.addItem('optimize')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                              </View>
                            </View>

                            <View>
                              {this.renderTags('optimize')}

                            </View>
                          </View>
                        </View>
                      )}

                      {(this.state.goalType.name === 'Entrepreneurship' || this.state.goalType.name === 'Entrepreneurship - Start') && (
                        <View>
                          <View style={[styles.row10]}>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>What stage is your business in?<Text style={[styles.errorColor]}>*</Text></Text>
                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Entrepreneurship Stage', selectedIndex: null, selectedName: "entrepreneurshipStage", selectedValue: this.state.entrepreneurshipStage, selectedOptions: this.state.entrepreneurshipStageOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn160] : [styles.calcColumn120]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.entrepreneurshipStage}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.entrepreneurshipStage}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("entrepreneurshipStage",itemValue)
                                    }>
                                    {this.state.entrepreneurshipStageOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}
                            </View>

                            <View>
                              <Text style={[styles.row10,styles.standardText]}>Is this organization for profit or nonprofit?</Text>
                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Entrepreneurship Type', selectedIndex: null, selectedName: "entrepreneurshipType", selectedValue: this.state.entrepreneurshipType, selectedOptions: ['','For-Profit','Non-Profit'], selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn160] : [styles.calcColumn120]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.entrepreneurshipType}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.entrepreneurshipType}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("entrepreneurshipType",itemValue)
                                    }>
                                    {['','For-Profit','Non-Profit'].map(value => <Picker.Item key={value} label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}

                            </View>

                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>Add your business as a project (Optional)</Text>
                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Entrepreneurship Project', selectedIndex: null, selectedName: "entrepreneurshipProject", selectedValue: this.state.entrepreneurshipProject.name, selectedOptions: this.state.projectOptions, selectedSubKey: 'name' })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn160] : [styles.calcColumn120]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.entrepreneurshipProject.name}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.entrepreneurshipProject.name}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("entrepreneurshipProject",itemValue)
                                    }>
                                    {this.state.projectOptions.map(value => <Picker.Item key={value.name} label={value.name} value={value.name} />)}
                                  </Picker>
                                </View>
                              )}

                              <Text style={[styles.descriptionText2,styles.bottomPadding5]}>You can add projects to your profile <Text onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Details'})} style={[styles.decriptionText2,styles.ctaColor,styles.boldText]}>here</Text></Text>

                            </View>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>What area do you need help with?</Text>
                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Entrepreneurship Goal', selectedIndex: null, selectedName: "entrepreneurshipGoal", selectedValue: this.state.entrepreneurshipGoal, selectedOptions: this.state.entrepreneurshipGoalOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn160] : [styles.calcColumn120]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.entrepreneurshipGoal}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.entrepreneurshipGoal}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("entrepreneurshipGoal",itemValue)
                                    }>
                                    {this.state.entrepreneurshipGoalOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}

                            </View>

                          </View>
                        </View>
                      )}

                      {(this.state.goalType && this.state.goalType.name !== 'Alternatives') && (
                        <View>
                          <View style={[styles.row10]}>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>Tag Relevant Skills & Knowledge</Text>

                              <View style={[styles.rowDirection]}>
                                <View style={(this.props.modalIsOpen) ? [styles.calcColumn170] : [styles.calcColumn130]}>
                                  <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => this.formChangeHandler("searchSkills", text)}
                                    value={this.state.searchStringCompetencies}
                                    placeholder="Search competencies..."
                                    placeholderTextColor="grey"
                                  />
                                </View>
                                <View style={[styles.width70,styles.leftPadding]}>
                                  <TouchableOpacity style={(!this.state.searchStringCompetencies || this.state.searchStringCompetencies === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringCompetencies || this.state.searchStringCompetencies === '') ? true : false} onPress={() => this.addItem('skill')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                                </View>
                              </View>

                            </View>
                            {(this.state.goalType.name === 'Learn New Skills') && (
                              <View>
                                <Text style={[styles.row10,styles.standardText]}>Competencies to Prioritize</Text>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Skill Preference', selectedIndex: null, selectedName: "skillPreference", selectedValue: this.state.skillPreference, selectedOptions: this.state.skillPreferenceOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={(this.props.modalIsOpen) ? [styles.calcColumn160] : [styles.calcColumn120]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.skillPreference}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.skillPreference}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("skillPreference",itemValue)
                                      }>
                                      {this.state.skillPreferenceOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}

                              </View>
                            )}

                            {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                            {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                            {(this.state.searchIsAnimatingCompetencies) ? (
                              <View style={[styles.flexCenter,styles.flex1]}>
                                <View>
                                  <View style={[styles.superSpacer]} />

                                  <ActivityIndicator
                                     animating = {this.state.searchIsAnimatingCompetencies}
                                     color = '#87CEFA'
                                     size = "large"
                                     style={[styles.square80, styles.centerHorizontally]}/>

                                  <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                  <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                </View>
                              </View>
                            ) : (
                              <View>
                                <View>
                                  {(this.state.competencyOptions) && (
                                    <View style={[styles.card,styles.topMargin]}>
                                      {this.state.competencyOptions.map((value, optionIndex) =>
                                        <View key={value._id} style={[styles.bottomMargin5]}>
                                          <TouchableOpacity style={[styles.calcColumn60,styles.row5]} onPress={() => this.searchItemClicked(value, 'competency')}>
                                            <View style={[styles.rowDirection]}>
                                              <View style={[styles.width40]}>
                                                <View style={[styles.halfSpacer]} />
                                                <Image source={{ uri: skillsIcon}} style={[styles.square22,styles.contain]} />
                                              </View>
                                              <View style={[styles.calcColumn100]}>
                                                <Text style={[styles.ctaColor]}>{value.name}</Text>
                                                <Text style={[styles.descriptionText2,styles.descriptionTextColor]}>{value.type}</Text>
                                              </View>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      )}
                                    </View>
                                  )}
                                </View>

                              </View>
                            )}


                          </View>

                          <View>
                            {this.renderTags('learningObjective')}

                          </View>
                        </View>
                      )}

                      {(this.state.goalType.name && this.state.goalType !== '') ? (
                        <View>
                          <View>
                            <View style={[styles.row10]}>
                              {(Platform.OS === 'ios') ? (
                                <View>
                                  <View style={[styles.flex1,styles.row10]}>
                                    <Text style={[styles.standardText]}>When You'll Start Working Toward This<Text style={[styles.errorColor]}>*</Text></Text>
                                  </View>
                                  <View style={[styles.flex1, styles.standardBorder, styles.padding10]}>
                                    <DateTimePicker
                                      testID="goalStartDate"
                                      value={(this.state.goalStartDate) ? new Date(this.state.goalStartDate) : new Date()}
                                      mode={'datetime'}
                                      is24Hour={true}
                                      display="default"
                                      onChange={(e, d) => this.formChangeHandler("goalStartDate",d,null,true,'datetime')}
                                    />
                                  </View>
                                </View>
                              ) : (
                                <View>
                                  <View style={[styles.row5]}>
                                    <Text style={[styles.row10,styles.standardText]}>When You'll Start Working Toward This<Text style={[styles.errorColor]}>*</Text></Text>
                                  </View>
                                  <View style={[styles.flex1,styles.rowDirection]}>
                                    <View style={[styles.flex50,styles.rightPadding]}>
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Goal Start Date', selectedIndex: null, selectedName: "goalStartDate", selectedValue: this.state.goalStartDate, mode: 'datetime' })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={[styles.calcColumn115]}>
                                            <Text style={[styles.descriptionText1]}>{(this.state.goalStartDate) ? this.prepareDate(this.state.goalStartDate,"date") : ""}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                    <View style={[styles.flex50,styles.leftPadding]}>
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Goal Start Date', selectedIndex: null, selectedName: "goalStartDate", selectedValue: this.state.goalStartDate, mode: 'time' })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={[styles.calcColumn115]}>
                                            <Text style={[styles.descriptionText1]}>{(this.state.goalStartDate) ? this.prepareDate(this.state.goalStartDate,"time") : ""}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              )}

                            </View>
                            <View style={[styles.row10]}>
                              {(Platform.OS === 'ios') ? (
                                <View>
                                  <View style={[styles.flex1,styles.row10]}>
                                    <Text style={[styles.standardText]}>Deadline to Reach Your Goal<Text style={[styles.errorColor]}>*</Text></Text>
                                  </View>
                                  <View style={[styles.flex1, styles.standardBorder, styles.padding10]}>
                                    <DateTimePicker
                                      testID="goalDeadline"
                                      value={(this.state.goalDeadline) ? new Date(this.state.goalDeadline) : new Date()}
                                      mode={'datetime'}
                                      is24Hour={true}
                                      display="default"
                                      onChange={(e, d) => this.formChangeHandler("goalDeadline",d,null,true,'datetime')}
                                      minimumDate={new Date()}
                                    />
                                  </View>
                                </View>
                              ) : (
                                <View>
                                  <View style={[styles.row5]}>
                                    <Text style={[styles.row10,styles.standardText]}>Deadline to Reach Your Goal<Text style={[styles.errorColor]}>*</Text></Text>
                                  </View>
                                  <View style={[styles.flex1,styles.rowDirection]}>
                                    <View style={[styles.flex50,styles.rightPadding]}>
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Goal Deadline', selectedIndex: null, selectedName: "goalDeadline", selectedValue: this.state.goalDeadline, mode: 'datetime' })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={[styles.calcColumn115]}>
                                            <Text style={[styles.descriptionText1]}>{(this.state.goalDeadline) ? this.prepareDate(this.state.goalDeadline,"date") : ""}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                    <View style={[styles.flex50,styles.leftPadding]}>
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Goal Deadline', selectedIndex: null, selectedName: "goalDeadline", selectedValue: this.state.goalDeadline, mode: 'time' })}>
                                        <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                          <View style={[styles.calcColumn115]}>
                                            <Text style={[styles.descriptionText1]}>{(this.state.goalDeadline) ? this.prepareDate(this.state.goalDeadline,"time") : ""}</Text>
                                          </View>
                                          <View style={[styles.width20,styles.topMargin5]}>
                                            <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                </View>
                              )}
                            </View>

                          </View>

                          {(this.state.goalType.name !== 'Alternatives') && (
                            <View style={[styles.row10]}>
                              <View>
                                <Text style={[styles.row10,styles.standardText]}>Intensity</Text>

                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Intensity', selectedIndex: null, selectedName: "intensity", selectedValue: this.state.intensity, selectedOptions: this.state.intensityOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={(this.props.modalIsOpen) ? [styles.calcColumn160] : [styles.calcColumn120]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.intensity}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.intensity}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("intensity",itemValue)
                                      }>
                                      {this.state.intensityOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}

                              </View>

                            </View>
                          )}
                        </View>
                      ) : (
                        <View />
                      )}

                    </View>

                    {(this.state.goalType.name !== '' && this.state.goalType.name !== 'Alternatives') && (
                      <View>
                        {(this.state.goalType && this.state.goalType.name !== '') && (
                          <View>
                            <View style={[styles.row10]}>
                              <Text style={[styles.row10,styles.standardText]}>Description<Text style={[styles.errorColor]}>*</Text></Text>
                              <TextInput
                                style={styles.textArea}
                                onChangeText={(text) => this.formChangeHandler("goalDescription", text)}
                                value={this.state.goalDescription}
                                placeholder="describe the goal"
                                placeholderTextColor="grey"
                                multiline={true}
                                numberOfLines={4}
                              />
                            </View>

                            <View style={[styles.row10]}>
                              <Text style={[styles.row10,styles.standardText]}>Define Success<Text style={[styles.errorColor]}>*</Text></Text>
                              <TextInput
                                style={styles.textArea}
                                onChangeText={(text) => this.formChangeHandler("successDefined", text)}
                                value={this.state.successDefined}
                                placeholder="How do you define success?"
                                placeholderTextColor="grey"
                                multiline={true}
                                numberOfLines={4}
                              />
                            </View>

                            <View style={[styles.row10]}>
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.calcColumn90,styles.rowDirection]}>
                                  <View>
                                    <Text style={[styles.row10]}>Strategies & Tactics</Text>
                                  </View>
                                  <View style={[styles.leftPadding,styles.topPadding]}>
                                    <TouchableOpacity onPress={() => this.addItem('strategy')}>
                                      <View style={[styles.padding5,styles.ctaBorder, { borderRadius: 10 }]}>
                                        <Image source={{ uri: addIcon}} style={[styles.square10,styles.contain]} />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                </View>
                                <View style={[styles.width30]}>
                                  <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                  <View style={[styles.leftMargin,styles.padding7]}>
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showStrategyDefinition: true })}>
                                      <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain]} />
                                    </TouchableOpacity>
                                  </View>
                                </View>
                              </View>

                              {(this.state.strategies && this.state.strategies.length > 0) && (
                                <View>
                                  {this.state.strategies.map((item, index) =>
                                    <View style={[styles.topMargin,styles.bottomMargin]}>
                                      <View style={[styles.rowDirection]}>
                                        <View style={[styles.width30,styles.topPadding]}>
                                          <TouchableOpacity onPress={() => this.addRemoveItems('Remove', index,'strategy')}>
                                            <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                                          </TouchableOpacity>
                                        </View>
                                        <View style={[styles.calcColumn90,styles.leftPadding]}>
                                          <TextInput
                                            style={styles.textInput}
                                            onChangeText={(text) => this.formChangeHandler("strategy|name|" + index, text)}
                                            value={item.name}
                                            placeholder={"Add a strategy (e.g., create regular habits to make progress)"}
                                            placeholderTextColor="grey"
                                          />
                                        </View>

                                      </View>

                                      {(item.tactics && item.tactics.length > 0) && (
                                        <View>
                                          {item.tactics.map((item2, index2) =>
                                            <View style={[styles.leftPadding40,styles.topMargin,styles.bottomMargin]}>
                                              <View style={[styles.rowDirection]}>
                                                <View style={[styles.width30,styles.topPadding]} >
                                                  <TouchableOpacity onPress={() => this.addRemoveItems('Remove', index,'tactic',index2)}>
                                                    <Image source={{ uri: deniedIcon }} style={[styles.square20,styles.contain]} />
                                                  </TouchableOpacity>
                                                </View>
                                                <View style={[styles.calcColumn130,styles.leftPadding]}>
                                                  <TextInput
                                                    style={styles.textInput}
                                                    onChangeText={(text) => this.formChangeHandler("tactic|" + index + "|" + index2, text)}
                                                    value={item2}
                                                    placeholder={"Add a tactic (e.g., do 5 math problems a day after I work out each morning)"}
                                                    placeholderTextColor="grey"
                                                  />
                                                </View>

                                              </View>

                                            </View>
                                          )}
                                        </View>
                                      )}

                                      <View style={[styles.leftPadding40,styles.topMargin,styles.bottomMargin]}>
                                        <TouchableOpacity onPress={() => this.addItem('tactic',index)} style={[styles.padding5]}>
                                          <Image source={{ uri: addIconBlue }} style={[styles.square20,styles.contain,styles.ctaBorder,styles.whiteBackground,styles.bottomMarginNegative18, { borderRadius: 12.5 }]} />
                                        </TouchableOpacity>

                                        <View style={[styles.ctaBorder,styles.leftMargin30]} />
                                      </View>

                                      <View style={[styles.spacer]} />
                                    </View>
                                  )}
                                  <View style={[styles.spacer]} />
                                </View>
                              )}
                            </View>

                            <View>
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText]}>Tag Supporters</Text>
                                <Text style={[styles.descriptionText2,styles.bottomPadding5]}>Supporters of your goal will be notified as you make progress, and can provide resources/advice.</Text>
                                <View style={[styles.halfSpacer]} />
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn130]}>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("searchMembers", text)}
                                      value={this.state.searchStringMembers}
                                      placeholder={"Search members..."}
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View style={[styles.width70,styles.leftPadding]}>
                                    <TouchableOpacity style={(!this.state.searchStringMembers || this.state.searchStringMembers === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringMembers || this.state.searchStringMembers === '') ? true : false} onPress={() => this.addItem('member')}><Text style={[styles.whiteColor,styles.descriptionText1]}>Add</Text></TouchableOpacity>
                                  </View>
                                </View>

                                {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                                {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                                {(this.state.searchIsAnimatingMembers) ? (
                                  <View style={[styles.flexCenter,styles.flex1]}>
                                    <View>
                                      <View style={[styles.superSpacer]} />

                                      <ActivityIndicator
                                         animating = {this.state.searchIsAnimatingMembers}
                                         color = '#87CEFA'
                                         size = "large"
                                         style={[styles.square80, styles.centerHorizontally]}/>

                                      <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                      <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                    </View>
                                  </View>
                                ) : (
                                  <View>
                                    <View>
                                      {(this.state.memberOptions && this.state.memberOptions.length > 0) && (
                                        <View style={[styles.card,styles.topMargin]}>
                                          {this.state.memberOptions.map((value, optionIndex) =>
                                            <View key={value._id} style={[styles.bottomMargin5]}>
                                              <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'member')}>
                                                <View style={[styles.flex1,styles.rowDirection]}>
                                                  <View style={[styles.width40]}>
                                                    <View style={[styles.miniSpacer]} />
                                                    <Image source={profileIconDark} style={[styles.square22,styles.contain]} />
                                                  </View>
                                                  <View style={[styles.calcColumn100]}>
                                                    <Text style={[styles.ctaColor]}>{value.firstName} {value.lastName}</Text>
                                                  </View>
                                                </View>
                                              </TouchableOpacity>
                                            </View>
                                          )}
                                        </View>
                                      )}
                                    </View>

                                    <View>
                                      {this.renderTags('member')}
                                    </View>

                                  </View>
                                )}
                              </View>

                            </View>
                          </View>
                        )}
                      </View>
                    )}

                    {(this.state.editExisting) && (
                      <View>

                        <View style={[styles.row10]}>
                          <View style={[styles.rowDirection]}>
                            <View>
                              <Text style={[styles.row10]}>Add Progress</Text>
                            </View>
                            <View style={[styles.leftPadding,styles.topPadding]}>
                              <TouchableOpacity onPress={() => this.addItem('progress')}>
                                <View style={[styles.padding5,styles.ctaBorder, { borderRadius: 10 }]}>
                                  <Image source={{ uri: addIcon}} style={[styles.square10,styles.contain]} />
                                </View>
                              </TouchableOpacity>
                            </View>

                          </View>

                          {(this.state.progress && this.state.progress.length > 0) && (
                            <View>
                              {this.state.progress.map((item, index) =>
                                <View style={[styles.topMargin]}>
                                  <View style={[styles.rowDirection]}>
                                    <View style={[styles.width30,styles.topPadding]} >
                                      <TouchableOpacity onPress={() => this.addRemoveItems('Remove', index,'progress')}>
                                        <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                                      </TouchableOpacity>
                                    </View>
                                    <View >
                                      {(Platform.OS === 'ios') ? (
                                        <View style={[styles.rowDirection]}>
                                          <View style={[styles.width80,styles.topPadding5]}>
                                            <DateTimePicker
                                              testID="progressDaate"
                                              value={(item.date) ? convertStringToDate(item.date,'dateOnly') : new Date()}
                                              mode={'date'}
                                              is24Hour={true}
                                              display="default"
                                              onChange={(e, d) => this.formChangeHandler("progress|date|" + index,d)}
                                            />
                                          </View>
                                        </View>
                                      ) : (
                                        <View>
                                          <View style={[styles.row5]}>
                                            <Text style={[styles.standardText,styles.row10]}>Date Awarded{(this.state.requirePersonalInfo) && <Text style={[styles.errorColor,styles.boldText]}> *</Text>}</Text>
                                          </View>
                                          <View>
                                            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Progress Date', selectedIndex: null, selectedName: "progress|date|" + index, selectedValue: item.date })}>
                                              <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                                <View style={[styles.calcColumn115]}>
                                                  <Text style={[styles.descriptionText1]}>{item.date}</Text>
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
                                    <View style={[styles.calcColumn170,styles.leftPadding]}>
                                      <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) => this.formChangeHandler("progress|value|" + index, text)}
                                        value={item.value}
                                        placeholder={"(e.g., I got an interview from Google!)"}
                                        placeholderTextColor="grey"
                                      />
                                    </View>

                                  </View>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                        {(this.state.goalType.description === 'Choose from alternatives') ? (
                          <View>
                            <View>
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText]}>Decision</Text>
                                {(this.state.pollConnections) && (
                                  <Text style={[styles.descriptionText2,styles.errorColor,styles.bottomPadding5]}>Participants of the poll will automatically be notified of your decision at the deadline</Text>
                                )}
                              </View>

                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Goal Decision', selectedIndex: null, selectedName: "goalDecision", selectedValue: this.state.goalDecision, selectedOptions: ["","Option A: " + this.state.aName,"Option B: " + this.state.bName], selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn160] : [styles.calcColumn120]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.goalDecision}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.goalDecision}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("goalDecision",itemValue)
                                    }>
                                    <Picker.Item label={""} value={""} />
                                    <Picker.Item label={"Option A: " + this.state.aName} value={"Option A: " + this.state.aName} />
                                    <Picker.Item label={"Option B: " + this.state.bName} value={"Option B: " + this.state.bName} />
                                  </Picker>
                                </View>
                              )}

                            </View>
                          </View>
                        ) : (
                          <View>
                            <Text style={[styles.row10,styles.standardText]}>Status</Text>

                            {(Platform.OS === 'ios') ? (
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Goal Status', selectedIndex: null, selectedName: "goalStatus", selectedValue: this.state.goalStatus, selectedOptions: this.state.goalStatusOptions, selectedSubKey: null })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={(this.props.modalIsOpen) ? [styles.calcColumn160] : [styles.calcColumn120]}>
                                    <Text style={[styles.descriptionText1]}>{this.state.goalStatus}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            ) : (
                              <View style={[styles.standardBorder]}>
                                <Picker
                                  selectedValue={this.state.goalStatus}
                                  onValueChange={(itemValue, itemIndex) =>
                                    this.formChangeHandler("goalStatus",itemValue)
                                  }>
                                    {this.state.goalStatusOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                </Picker>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}

                {(this.state.currentPage === 'Suggestions') && (
                  <View>
                    <View>
                      <Text style={[styles.topMargin20,styles.bottomMargin20]}><Text style={[styles.ctaColor,styles.boldText]}>Suggestions</Text> include suggestions, resources, and other acts of help sent to help you achieve this goal</Text>
                      <View style={[styles.horizontalLine] }/>
                    </View>

                    {(this.state.suggestions && this.state.suggestions.length > 0) ? (
                      <View style={[styles.topMargin20]}>
                        {this.state.suggestions.map((item, optionIndex) =>
                          <View key={item}>
                            {this.renderSuggestion(item,optionIndex)}
                          </View>
                        )}

                      </View>
                    ) : (
                      <View>
                        <Text style={[styles.errorColor]}>You have no suggestions yet.</Text>
                        {/*
                        <Text style={[styles.topMargin20]}>People can provide suggestions for contacts, articles, videos, events, job opportunities and more if you share your goal with people: <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.username })} ><Text style={[styles.standardText,styles.ctaColor]}>{'https://www.guidedcompass.com/app/profile/' + this.state.username}</Text></TouchableOpacity>. Adjust your profile public settings according to what you want people to see by clicking on "Public Preferences" from your profile.</Text>*/}

                        {(this.state.editExisting && !this.state.remoteAuth) && (
                          <View style={[styles.row10]}>

                            {(this.state.publicProfile && this.state.publicProfileExtent && this.state.publicPreferences && this.state.publicPreferences[2] && (this.state.publicPreferences[2].value === 'All' || this.state.publicPreferences[2].value === 'Some')) ? (
                              <View style={[styles.standardBorder,styles.padding40]}>
                                <Text style={[styles.topMargin]}>Share this link to crowdsource resources for this goal: <Text onPress={() => Linking.openURL('https://www/guidedcompass.com/goals/' + this.state.goalId)} style={[styles.ctaColor,styles.boldText]}>{'https://www/guidedcompass.com/goals/' + this.state.goalId}</Text>. If you want to make your goal private, you can do so <Text onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Visibility Preferences'})} style={[styles.ctaColor,styles.boldText]}>here</Text>.</Text>
                              </View>
                            ) : (
                              <View style={[styles.standardBorder,styles.padding40]}>
                                <Text style={[styles.topMargin]}>To crowdsource resources for this goal, make it public <Text onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Visibility Preferences'})} style={[styles.ctaColor,styles.boldText]}>here</Text>, then share this link: <Text onPress={() => Linking.openURL('https://www/guidedcompass.com/goals/' + this.state.goalId)} style={[styles.ctaColor,styles.boldText]}>{'https://www/guidedcompass.com/goals/' + this.state.goalId}</Text>.</Text>
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}

                {(this.state.currentPage === 'People') && (
                  <View>
                    <View>
                      <Text style={[styles.topMargin20,styles.bottomMargin20]}><Text style={[styles.ctaColor,styles.boldText]}>People</Text>  who have similar goals</Text>
                      <View style={[styles.horizontalLine] }/>
                    </View>

                    <SubPeopleMatching navigation={this.props.navigation} userType={"Peers"} pageSource="Goal" selectedGoal={this.state.selectedGoal} />
                  </View>
                )}

                {(this.state.currentPage === 'Courses') && (
                  <View>
                    <View>
                      <Text style={[styles.topMargin20,styles.bottomMargin20]}><Text style={[styles.ctaColor,styles.boldText]}>Courses</Text>  that teach the relevant competencies tagged in your goal</Text>
                      <View style={[styles.horizontalLine] }/>
                    </View>

                    {(this.state.competencies && this.state.competencies.length > 0) ? (
                      <SubCourses navigation={this.props.navigation} activeOrg={this.state.activeOrg} selectedGoal={this.state.selectedGoal} competencies={this.state.competencies} subNavSelected="Browse" pageSource="Goal"/>
                    ) : (
                      <View>
                        <Text style={[styles.errorColor,styles.topMargin20]}>You have not tagged any competencies (skills & knowledge) in your goal</Text>
                      </View>
                    )}
                  </View>
                )}

                {(this.state.currentPage === 'Careers') && (
                  <View>
                    <View>
                      <Text style={[styles.topMargin20,styles.bottomMargin20]}><Text style={[styles.ctaColor,styles.boldText]}>Careers</Text> are any career paths that match this goal</Text>
                      <View style={[styles.horizontalLine] }/>
                    </View>

                    <SubCareers navigation={this.props.navigation} calculateMatches={this.state.calculateMatches} pageSource="Goal" selectedGoal={this.state.selectedGoal} />
                  </View>
                )}

                {(this.state.currentPage === 'Events') && (
                  <View>
                    <View>
                      <Text style={[styles.topMargin20,styles.bottomMargin20]}><Text style={[styles.ctaColor,styles.boldText]}>Events</Text> include any career events that align with this goal</Text>
                      <View style={[styles.horizontalLine] }/>
                    </View>

                    <SubOpportunities navigation={this.props.navigation} calculateMatches={this.state.calculateMatches} activeOrg={this.state.activeOrg} passedSubNavSelected={"Events"} changeSubNavSelected={this.changeSubNavSelected} pageSource="Goal" selectedGoal={this.state.selectedGoal} />
                  </View>
                )}

                {(this.state.currentPage === 'Projects') && (
                  <View>
                    <View>
                      <Text style={[styles.topMargin20,styles.bottomMargin20]}><Text style={[styles.ctaColor,styles.boldText]}>Projects</Text> include any project opportunities that align with this goal</Text>
                      <View style={[styles.horizontalLine] }/>
                    </View>

                    <SubOpportunities navigation={this.props.navigation} calculateMatches={this.state.calculateMatches} activeOrg={this.state.activeOrg} passedSubNavSelected={"Projects"} changeSubNavSelected={this.changeSubNavSelected} pageSource="Goal" selectedGoal={this.state.selectedGoal} />
                  </View>
                )}

                {(this.state.currentPage === 'Work') && (
                  <View>
                    <View>
                      <Text style={[styles.topMargin20,styles.bottomMargin20]}><Text style={[styles.ctaColor,styles.boldText]}>Work</Text> include any work opportunities that align with this goal</Text>
                      <View style={[styles.horizontalLine] }/>
                    </View>

                    <SubOpportunities navigation={this.props.navigation} calculateMatches={this.state.calculateMatches} activeOrg={this.state.activeOrg} passedSubNavSelected={"Work"} changeSubNavSelected={this.changeSubNavSelected} pageSource="Goal" selectedGoal={this.state.selectedGoal} />
                  </View>
                )}

              </View>
            )}

            {(this.state.logType === 'Meeting') && (
              <View>
                <View>
                  <View style={[styles.spacer]} />

                  <View style={[styles.row10]}>
                    <View>
                      {(Platform.OS === 'ios') ? (
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.calcColumn260]}>
                            <Text style={[styles.row10,styles.standardText]}>Starts<Text style={[styles.errorColor]}>*</Text></Text>
                          </View>
                          <View style={[styles.width200,styles.topPadding5]}>
                            <DateTimePicker
                              testID="startTime"
                              value={(this.state.startTime) ? new Date(this.state.startTime) : new Date()}
                              mode={'datetime'}
                              is24Hour={true}
                              display="default"
                              onChange={(e, d) => this.formChangeHandler("startTime",d,null,true,'datetime')}
                            />
                          </View>
                        </View>
                      ) : (
                        <View>
                          <View style={[styles.row5]}>
                            <Text style={[styles.row10,styles.standardText]}>Starts<Text style={[styles.errorColor]}>*</Text></Text>
                          </View>
                          <View style={[styles.flex1,styles.rowDirection]}>
                            <View style={[styles.flex50,styles.rightPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Start Time', selectedIndex: null, selectedName: "startTime", selectedValue: this.state.startTime, mode: 'datetime' })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.startTime) ? this.prepareDate(this.state.startTime,'date') : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={[styles.flex50,styles.leftPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Start Time', selectedIndex: null, selectedName: "startTime", selectedValue: this.state.startTime, mode: 'time' })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.startTime) ? this.prepareDate(this.state.startTime,'time') : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}

                    </View>
                    <View>
                      {(Platform.OS === 'ios') ? (
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.calcColumn260]}>
                            <Text style={[styles.row10,styles.standardText]}>Ends<Text style={[styles.errorColor]}>*</Text></Text>
                          </View>
                          <View style={[styles.width200,styles.topPadding5]}>
                            <DateTimePicker
                              testID="endTime"
                              value={(this.state.endTime) ? new Date(this.state.endTime) : new Date()}
                              mode={'datetime'}
                              is24Hour={true}
                              display="default"
                              onChange={(e, d) => this.formChangeHandler("endTime",d,null,true,'datetime')}
                            />
                          </View>
                        </View>
                      ) : (
                        <View>
                          <View style={[styles.row5]}>
                            <Text style={[styles.row10,styles.standardText]}>Ends<Text style={[styles.errorColor]}>*</Text></Text>
                          </View>
                          <View style={[styles.flex1,styles.rowDirection]}>
                            <View style={[styles.flex50,styles.rightPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'End Time', selectedIndex: null, selectedName: "endTime", selectedValue: this.state.endTime, mode: 'datetime' })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.endTime) ? this.prepareDate(this.state.endTime,'date') : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={[styles.flex50,styles.leftPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'End Time', selectedIndex: null, selectedName: "endTime", selectedValue: this.state.endTime, mode: 'time' })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.endTime) ? this.prepareDate(this.state.endTime,'time') : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}

                    </View>

                  </View>

                  <View style={[styles.row10]}>
                    <View>
                      <Text style={[styles.row10,styles.standardText]}>Meeting Method<Text style={[styles.errorColor]}>*</Text></Text>
                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Method', selectedIndex: null, selectedName: "method", selectedValue: this.state.method, selectedOptions: this.state.methodOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn130]}>
                              <Text style={[styles.descriptionText1]}>{this.state.method}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.method}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("method",itemValue)
                            }>
                            {this.state.methodOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                    </View>
                    <View>
                      <Text style={[styles.row10,styles.standardText]}>{(this.state.method === "In Person") ? "Location" : "Meeting Link"}<Text style={[styles.errorColor]}>*</Text></Text>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => this.formChangeHandler("location", text)}
                        value={this.state.location}
                        placeholder={(this.state.method === "In Person") ? "Address..." : "Http..."}
                        placeholderTextColor="grey"
                      />

                      {(this.state.method !== "In Person" && this.state.location && this.state.location !== '' && !this.state.location.startsWith('http')) && (
                        <View style={[styles.topPadding5]}>
                          <Text style={[styles.errorColor,styles.descriptionText2]}>Please add a valid link that starts with http</Text>
                        </View>
                      )}
                    </View>

                  </View>

                  <View style={[styles.row10]}>
                    <View>
                      <Text style={[styles.row10,styles.standardText]}>Repeats</Text>

                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Method', selectedIndex: null, selectedName: "repeats", selectedValue: this.state.repeats, selectedOptions: this.state.repeatOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn130]}>
                              <Text style={[styles.descriptionText1]}>{this.state.repeats}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.repeats}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("repeats",itemValue)
                            }>
                            {this.state.repeatOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                    </View>

                  </View>

                  {(this.state.editExisting) && (
                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Tag Attendees</Text>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.calcColumn130]}>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("searchMembers", text)}
                            value={this.state.searchStringMembers}
                            placeholder="Search members..."
                            placeholderTextColor="grey"
                          />
                        </View>
                        <View style={[styles.width70,styles.leftPadding]}>
                          <TouchableOpacity style={(!this.state.searchStringMembers || this.state.searchStringMembers === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringMembers || this.state.searchStringMembers === '') ? true : false} onPress={() => this.addItem('member')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                        </View>

                      </View>

                      {(this.state.searchIsAnimatingMembers) ? (
                        <View style={[styles.flexCenter,styles.flex1]}>
                          <View>
                            <View style={[styles.superSpacer]} />

                            <ActivityIndicator
                               animating = {this.state.searchIsAnimatingMembers}
                               color = '#87CEFA'
                               size = "large"
                               style={[styles.square80, styles.centerHorizontally]}/>

                            <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                            <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                          </View>
                        </View>
                      ) : (
                        <View>
                          <View>
                            {(this.state.memberOptions && this.state.memberOptions.length > 0) && (
                              <View style={[styles.card,styles.topMargin]}>
                                {this.state.memberOptions.map((value, optionIndex) =>
                                  <View key={value._id} style={[styles.bottomMargin5]}>
                                    <TouchableOpacity style={[styles.row5]}nPress={() => this.searchItemClicked(value, 'member')}>
                                      <View style={[styles.calcColumn60,styles.rowDirection]}>
                                        <View style={[styles.width40]}>
                                          <View style={[styles.miniSpacer]} />
                                          <Image source={{ uri: profileIconDark}} style={[styles.square22,styles.contain]} />
                                        </View>
                                        <View style={[styles.calcColumn100]}>
                                          <Text style={[styles.ctaColor]}>{value.firstName} {value.lastName}</Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>

                          <View>

                            {this.renderTags('member')}


                          </View>

                        </View>
                      )}
                    </View>
                  )}

                  <View style={[styles.row10]}>
                    <Text style={[styles.row10,styles.standardText]}>Description<Text style={[styles.errorColor]}>*</Text></Text>
                    <TextInput
                      style={styles.textArea}
                      onChangeText={(text) => this.formChangeHandler("description", text)}
                      value={this.state.description}
                      placeholder="Why are we having this meeting? What will we discuss?"
                      placeholderTextColor="grey"
                      multiline={true}
                      numberOfLines={4}
                    />
                  </View>

                  <View style={[styles.row10]}>
                    <View>
                      <View style={[styles.rowDirection]}>
                        <View>
                          <Text style={[styles.row10,styles.standardText]}>Links / Resources</Text>
                        </View>
                        <View style={[styles.leftPadding,styles.topPadding]}>
                          <TouchableOpacity onPress={() => this.addItem('link')}>
                            <View style={[styles.padding5,styles.ctaBorder,{ borderRadius: 10 }]}>
                              <Image source={{ uri: addIcon}} style={[styles.square10,styles.contain]} />
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>

                      {(this.state.links && this.state.links.length > 0) && (
                        <View>
                          {this.state.links.map((item, index) =>
                            <View style={[styles.topMargin]}>
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.width35,styles.topPadding]}>
                                  <TouchableOpacity onPress={() => this.addRemoveItems('Remove', index,'link')}>
                                    <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                                  </TouchableOpacity>
                                </View>
                                <View style={[styles.calcColumn95]}>
                                  <TextInput
                                    style={styles.textInput}
                                    onChangeText={(text) => this.formChangeHandler("link|" + index, text)}
                                    value={item}
                                    placeholder="http..."
                                    placeholderTextColor="grey"
                                  />

                                  {(item !== '' && !item.startsWith('http')) && (
                                    <View style={[styles.topPadding5]}>
                                      <Text style={[styles.errorColor,styles.descriptionText2]}>Please add a valid link that starts with http</Text>
                                    </View>
                                  )}
                                </View>

                              </View>
                            </View>
                          )}
                        </View>
                      )}

                    </View>
                  </View>

                  {(this.state.editExisting) && (
                    <View>
                      <View style={[styles.row10]}>
                        <Text style={[styles.row10,styles.standardText]}>Minutes</Text>
                        <TextInput
                          style={styles.textArea}
                          onChangeText={(text) => this.formChangeHandler("notes", text)}
                          value={this.state.notes}
                          placeholder="What did we did we discuss in this meeting? What are the action items?"
                          placeholderTextColor="grey"
                          multiline={true}
                          numberOfLines={4}
                        />
                      </View>

                      <View style={[styles.row10]}>
                        <View>
                          <View style={[styles.rowDirection]}>
                            <View>
                              <Text style={[styles.row10,styles.standardText]}>Action Items</Text>
                            </View>
                            <View style={[styles.leftPadding,styles.topPadding15]}>
                              <TouchableOpacity onPress={() => this.addItem('actionItem')}>
                                <Image source={{ uri: addIcon}} style={[styles.square15,styles.contain]} />
                              </TouchableOpacity>
                            </View>
                          </View>

                          {(this.state.actionItems && this.state.actionItems.length > 0) && (
                            <View>
                              {this.state.actionItems.map((item, index) =>
                                <View style={[styles.topMargin]}>
                                  <View style={[styles.rowDirection]}>
                                    <View style={[styles.width35,styles.topPadding]}>
                                      <TouchableOpacity onPress={() => this.addRemoveItems('Remove', index,'actionItem')}>
                                        <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                                      </TouchableOpacity>
                                    </View>
                                    <View style={[styles.calcColumn95]}>
                                      <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) => this.formChangeHandler("actionItem|" + index, text)}
                                        value={item}
                                        placeholder="What should we do next..."
                                        placeholderTextColor="grey"
                                      />
                                    </View>

                                  </View>
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      </View>
                    </View>
                  )}

                  <View style={[styles.spacer]} />
                  <View style={[styles.horizontalLine]} />
                  <View style={[styles.spacer]} />
                </View>
              </View>
            )}

            {(this.state.logType === 'Session' || this.state.logType === 'Check In') && (
              <View>
                <View>
                  {(this.state.remoteAuth) ? (
                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Add a Career Advisor<Text style={[styles.errorColor]}>*</Text></Text>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.calcColumn130]}>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("searchAdvisors", text)}
                            value={this.state.searchStringMembers}
                            placeholder="Search teachers, mentors, and advisors in this org..."
                            placeholderTextColor="grey"
                          />
                        </View>
                        <View style={[styles.width70,styles.leftPadding]}>
                          <TouchableOpacity style={(!this.state.searchStringMembers || this.state.searchStringMembers === '') ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(!this.state.searchStringMembers || this.state.searchStringMembers === '') ? true : false} onPress={() => this.addItem('advisor')}><Text style={[styles.whiteColor]}>Add</Text></TouchableOpacity>
                        </View>

                      </View>

                      {(this.state.searchIsAnimatingMembers) ? (
                        <View style={[styles.flexCenter,styles.flex1]}>
                          <View>
                            <View style={[styles.superSpacer]} />

                            <ActivityIndicator
                               animating = {this.state.searchIsAnimatingMembers}
                               color = '#87CEFA'
                               size = "large"
                               style={[styles.square80, styles.centerHorizontally]}/>

                            <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                            <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                          </View>
                        </View>
                      ) : (
                        <View>
                          <View>
                            {(this.state.memberOptions && this.state.memberOptions.length > 0) && (
                              <View style={[styles.card,styles.topMargin]}>
                                {this.state.memberOptions.map((value, optionIndex) =>
                                  <View key={value._id} style={[styles.bottomMargin5]}>
                                    <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'member')}>
                                      <View style={[styles.calcColumn60,styles.rowDirection]}>
                                        <View style={[styles.width40]}>
                                          <View style={[styles.miniSpacer]} />
                                          <Image source={{ uri: profileIconDark}} style={[styles.square22,styles.contain]} />
                                        </View>
                                        <View style={[styles.calcColumn100]}>
                                          <Text style={[styles.ctaColor]}>{value.firstName} {value.lastName}</Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>

                          <View>

                            {this.renderTags('member')}


                          </View>

                        </View>
                      )}
                    </View>
                  ) : (
                    <View>
                      <View style={[styles.row10]}>
                        <View>
                          <Text style={[styles.row10,styles.standardText]}>Advisor First Name<Text style={[styles.errorColor]}>*</Text></Text>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("advisorFirstName", text)}
                            value={this.state.advisorFirstName}
                            placeholder="e.g., Jon"
                            placeholderTextColor="grey"
                          />
                        </View>
                        <View>
                          <Text style={[styles.row10,styles.standardText]}>Advisor Last Name<Text style={[styles.errorColor]}>*</Text></Text>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("advisorLastName", text)}
                            value={this.state.advisorLastName}
                            placeholder="e.g., Doe"
                            placeholderTextColor="grey"
                          />
                        </View>

                      </View>

                      <View style={[styles.row10]}>
                        <View>
                          <Text style={[styles.row10,styles.standardText]}>Advisor Email<Text style={[styles.errorColor]}>*</Text></Text>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("advisorEmail", text)}
                            value={this.state.advisorEmail}
                            placeholder="e.g., jondoe@gmail.com"
                            placeholderTextColor="grey"
                          />
                        </View>

                      </View>
                    </View>
                  )}

                  {(!this.state.editExisting) && (
                    <View>
                      <View style={[styles.row10]}>
                        {(this.state.remoteAuth) ? (
                          <Text style={[styles.standardText]}><Text style={[styles.errorColor,styles.boldText]}>Note:</Text> The advisor will be notified. Additionally, the teacher, work-based learning coordinator, or mentor will be able to view / edit this session from their portal.</Text>
                        ) : (
                          <Text style={[styles.standardText]}><Text style={[styles.errorColor,styles.boldText]}>Note:</Text> The advisor will be notified. Additionally, if the advisor signs up as a teacher, work-based learning coordinator, or mentor, they will be able to view / edit this session from their portal.</Text>
                        )}
                      </View>
                      <View style={[styles.horizontalLine]} />
                    </View>
                  )}

                  <View style={[styles.row10]}>
                    <View>
                      {(Platform.OS === 'ios') ? (
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.calcColumn260]}>
                            <Text style={[styles.row10,styles.standardText]}>Session Date<Text style={[styles.errorColor]}>*</Text></Text>
                          </View>
                          <View style={[styles.width200,styles.topPadding5]}>
                            <DateTimePicker
                              testID="sessionDate"
                              value={(this.state.sessionDate) ? new Date(this.state.sessionDate) : new Date()}
                              mode={'datetime'}
                              is24Hour={true}
                              display="default"
                              onChange={(e, d) => this.formChangeHandler("sessionDate",d,null,true,'datetime')}
                            />
                          </View>
                        </View>
                      ) : (
                        <View>
                          <View style={[styles.row5]}>
                            <Text style={[styles.row10,styles.standardText]}>Session Date<Text style={[styles.errorColor]}>*</Text></Text>
                          </View>
                          <View style={[styles.flex1,styles.rowDirection]}>
                            <View style={[styles.flex50,styles.rightPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Session Date', selectedIndex: null, selectedName: "sessionDate", selectedValue: this.state.sessionDate, mode: 'datetime' })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.sessionDate) ? this.prepareDate(this.state.sessionDate,'date') : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={[styles.flex50,styles.leftPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Session Time', selectedIndex: null, selectedName: "sessionDate", selectedValue: this.state.sessionDate, mode: 'time' })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.sessionDate) ? this.prepareDate(this.state.sessionDate,'time') : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}

                    </View>

                    <View>
                      <Text style={[styles.row10,styles.standardText]}>Meeting Method<Text style={[styles.errorColor]}>*</Text></Text>

                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Method', selectedIndex: null, selectedName: "sessionMethod", selectedValue: this.state.sessionMethod, selectedOptions: this.state.sessionMethodOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn120]}>
                              <Text style={[styles.descriptionText1]}>{this.state.sessionMethod}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.sessionMethod}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("sessionMethod",itemValue)
                            }>
                            {this.state.sessionMethodOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                    </View>


                  </View>

                  <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>What category does this fall into?<Text style={[styles.errorColor]}>*</Text></Text>

                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Category', selectedIndex: null, selectedName: "category", selectedValue: this.state.category, selectedOptions: this.state.categoryOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn120]}>
                              <Text style={[styles.descriptionText1]}>{this.state.category}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.category}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("category",itemValue)
                            }>
                            {this.state.categoryOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                  </View>

                  <View style={[styles.row10]}>
                    <Text style={[styles.row10,styles.standardText]}>Notes<Text style={[styles.errorColor]}>*</Text></Text>
                    <TextInput
                      style={styles.textArea}
                      onChangeText={(text) => this.formChangeHandler("notes", text)}
                      value={this.state.notes}
                      placeholder="Add notes"
                      placeholderTextColor="grey"
                      multiline={true}
                      numberOfLines={4}
                    />
                  </View>
                </View>
              </View>
            )}

            {(this.state.logType === 'Application') && (
              <View>
                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Employer Name<Text style={[styles.errorColor]}>*</Text></Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.formChangeHandler("employerName", text)}
                    value={this.state.employerName}
                    placeholder="e.g., Google"
                    placeholderTextColor="grey"
                  />
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Employer Main Website<Text style={[styles.errorColor]}>*</Text></Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.formChangeHandler("employerURL", text)}
                    value={this.state.employerURL}
                    placeholder="e.g., https..."
                    placeholderTextColor="grey"
                  />
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Employer Type<Text style={[styles.errorColor]}>*</Text></Text>

                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Employer Type', selectedIndex: null, selectedName: "employerType", selectedValue: this.state.employerType, selectedOptions: this.state.employerTypeOptions, selectedSubKey: null })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn120]}>
                          <Text style={[styles.descriptionText1]}>{this.state.employerType}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.employerType}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("employerType",itemValue)
                        }>
                        {this.state.employerTypeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                      </Picker>
                    </View>
                  )}

                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Employer Industry<Text style={[styles.errorColor]}>*</Text></Text>
                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Industry', selectedIndex: null, selectedName: "industry", selectedValue: this.state.industry, selectedOptions: this.state.industryOptions, selectedSubKey: null })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn120]}>
                          <Text style={[styles.descriptionText1]}>{this.state.industry}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.industry}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("industry",itemValue)
                        }>
                        {this.state.industryOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                      </Picker>
                    </View>
                  )}

                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Employer Size<Text style={[styles.errorColor]}>*</Text></Text>

                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Employee Count', selectedIndex: null, selectedName: "employeeCount", selectedValue: this.state.employeeCount, selectedOptions: this.state.employeeCountOptions, selectedSubKey: null })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn120]}>
                          <Text style={[styles.descriptionText1]}>{this.state.employeeCount}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.employeeCount}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("employeeCount",itemValue)
                        }>
                        {this.state.employeeCountOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                      </Picker>
                    </View>
                  )}

                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Position Title<Text style={[styles.errorColor]}>*</Text></Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.formChangeHandler("positionTitle", text)}
                    value={this.state.positionTitle}
                    placeholder="e.g., Software Engineer"
                    placeholderTextColor="grey"
                  />
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Position Link (Optional)</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.formChangeHandler("positionLink", text)}
                    value={this.state.positionLink}
                    placeholder="e.g., http..."
                    placeholderTextColor="grey"
                  />
                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Position Function<Text style={[styles.errorColor]}>*</Text></Text>
                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Function', selectedIndex: null, selectedName: "jobFunction", selectedValue: this.state.jobFunction, selectedOptions: this.state.functionOptions, selectedSubKey: null })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn120]}>
                          <Text style={[styles.descriptionText1]}>{this.state.jobFunction}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.jobFunction}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("jobFunction",itemValue)
                        }>
                        {this.state.functionOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                      </Picker>
                    </View>
                  )}

                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Work Type<Text style={[styles.errorColor]}>*</Text></Text>
                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Work Type', selectedIndex: null, selectedName: "workType", selectedValue: this.state.workType, selectedOptions: this.state.workTypeOptions, selectedSubKey: null })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn120]}>
                          <Text style={[styles.descriptionText1]}>{this.state.workType}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.workType}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("workType",itemValue)
                        }>
                        {this.state.workTypeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                      </Picker>
                    </View>
                  )}

                </View>

                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Timeframe<Text style={[styles.errorColor]}>*</Text></Text>
                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Time Frame', selectedIndex: null, selectedName: "timeframe", selectedValue: this.state.timeframe, selectedOptions: this.state.timeframeOptions, selectedSubKey: null })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn120]}>
                          <Text style={[styles.descriptionText1]}>{this.state.timeframe}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.timeframe}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("timeframe",itemValue)
                        }>
                        {this.state.timeframeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                      </Picker>
                    </View>
                  )}

                </View>

                <View style={[styles.row10]}>
                  {(Platform.OS === 'ios') ? (
                    <View style={[styles.rowDirection]}>
                      <View style={[styles.calcColumn260]}>
                        <Text style={[styles.row10,styles.standardText]}>Application Deadline<Text style={[styles.errorColor]}>*</Text></Text>
                      </View>
                      <View style={[styles.width200,styles.topPadding5]}>
                        <DateTimePicker
                          testID="applicationDeadline"
                          value={(this.state.applicationDeadline) ? new Date(this.state.applicationDeadline) : new Date()}
                          mode={'datetime'}
                          is24Hour={true}
                          display="default"
                          onChange={(e, d) => this.formChangeHandler("applicationDeadline",d,null,true,'datetime')}
                        />
                      </View>
                    </View>
                  ) : (
                    <View>
                      <View style={[styles.row5]}>
                        <Text style={[styles.row10,styles.standardText]}>Application Deadline<Text style={[styles.errorColor]}>*</Text></Text>
                      </View>
                      <View style={[styles.flex1,styles.rowDirection]}>
                        <View style={[styles.flex50,styles.rightPadding]}>
                          <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Application Deadline', selectedIndex: null, selectedName: "applicationDeadline", selectedValue: this.state.applicationDeadline, mode: 'datetime' })}>
                            <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                              <View style={[styles.calcColumn115]}>
                                <Text style={[styles.descriptionText1]}>{(this.state.applicationDeadline) ? this.prepareDate(this.state.applicationDeadline,'date') : ""}</Text>
                              </View>
                              <View style={[styles.width20,styles.topMargin5]}>
                                <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.flex50,styles.leftPadding]}>
                          <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Application Deadline', selectedIndex: null, selectedName: "applicationDeadline", selectedValue: this.state.applicationDeadline, mode: 'time' })}>
                            <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                              <View style={[styles.calcColumn115]}>
                                <Text style={[styles.descriptionText1]}>{(this.state.applicationDeadline) ? this.prepareDate(this.state.applicationDeadline,'time') : ""}</Text>
                              </View>
                              <View style={[styles.width20,styles.topMargin5]}>
                                <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>

                    </View>
                  )}

                </View>

                <Text style={[styles.row10,styles.standardText]}>Mentor Reviewed Materials?<Text style={[styles.errorColor]}>*</Text></Text>

                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Reviewed Materials', selectedIndex: null, selectedName: "reviewedMaterials", selectedValue: this.state.reviewedMaterials, selectedOptions: this.state.binaryOptions, selectedSubKey: null })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn120]}>
                        <Text style={[styles.descriptionText1]}>{this.state.reviewedMaterials}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.reviewedMaterials}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("reviewedMaterials",itemValue)
                      }>
                      {this.state.binaryOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                    </Picker>
                  </View>
                )}

              </View>
            )}

            {(this.state.logType === 'Interview') && (
              <View>
                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Associated External Work Application<Text style={[styles.errorColor]}>*</Text></Text>

                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Associated Application', selectedIndex: null, selectedName: "associatedApplication", selectedValue: this.state.associatedApplication.name, selectedOptions: this.state.applicationOptions, selectedSubKey: null })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn120]}>
                          <Text style={[styles.descriptionText1]}>{this.state.associatedApplication.name}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.associatedApplication.name}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("associatedApplication",itemValue)
                        }>
                        {this.state.applicationOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                      </Picker>
                    </View>
                  )}

                </View>

                {(this.state.associatedApplication.name !== 'Attach a Saved Application') && (
                  <View>
                    <View style={[styles.row10]}>
                      {(Platform.OS === 'ios') ? (
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.calcColumn260]}>
                            <Text style={[styles.row10,styles.standardText]}>Date of Interview<Text style={[styles.errorColor]}>*</Text></Text>
                          </View>
                          <View style={[styles.width200,styles.topPadding5]}>
                            <DateTimePicker
                              testID="interviewDate"
                              value={(this.state.interviewDate) ? new Date(this.state.interviewDate) : new Date()}
                              mode={'datetime'}
                              is24Hour={true}
                              display="default"
                              onChange={(e, d) => this.formChangeHandler("interviewDate",d,null,true,'datetime')}
                            />
                          </View>
                        </View>
                      ) : (
                        <View>
                          <View style={[styles.row5]}>
                            <Text style={[styles.row10,styles.standardText]}>Date of Interview<Text style={[styles.errorColor]}>*</Text></Text>
                          </View>
                          <View style={[styles.flex1,styles.rowDirection]}>
                            <View style={[styles.flex50,styles.rightPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Interview Date', selectedIndex: null, selectedName: "interviewDate", selectedValue: this.state.interviewDate, mode: 'datetime' })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.interviewDate) ? this.prepareDate(this.state.interviewDate,'date') : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={[styles.flex50,styles.leftPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Interview Date', selectedIndex: null, selectedName: "interviewDate", selectedValue: this.state.interviewDate, mode: 'time' })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.interviewDate) ? this.prepareDate(this.state.interviewDate,'time') : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}
                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Interview Round<Text style={[styles.errorColor]}>*</Text></Text>

                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Interview Round', selectedIndex: null, selectedName: "interviewRound", selectedValue: this.state.interviewRound, selectedOptions: this.state.interviewRoundOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn120]}>
                              <Text style={[styles.descriptionText1]}>{this.state.interviewRound}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.interviewRound}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("interviewRound",itemValue)
                            }>
                            {this.state.interviewRoundOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>{(Number(this.state.numberOfInterviews) === 1) ? 'Interview Length' : 'Interview Length'}<Text style={[styles.errorColor]}>*</Text></Text>

                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Interview Length', selectedIndex: null, selectedName: "interviewLength", selectedValue: this.state.interviewLength, selectedOptions: this.state.interviewLengthOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn120]}>
                              <Text style={[styles.descriptionText1]}>{this.state.interviewLength}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.interviewLength}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("interviewLength",itemValue)
                            }>
                            {this.state.interviewLengthOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                    </View>

                    { (Number(this.state.numberOfInterviews) > 0 ) && (
                      <View style={[styles.row10]}>
                        <Text style={[styles.row10,styles.standardText]}>Title of Interviewer(s) & Interview Rating(s)<Text style={[styles.errorColor]}>*</Text></Text>
                        <View style={[styles.spacer]}/>
                        {this.renderInterviews()}
                      </View>
                    )}

                    <View style={[styles.row10]}>
                      <View>
                        <View>
                          <Text style={[styles.row10,styles.standardText]}>Practiced Interviewing?</Text>

                          <View style={[styles.alignStart]}>
                            <Switch
                              onValueChange={(change) => this.setState({ mcPracticedInterviewing: change, formHasChanged: true })}
                              value={this.state.mcPracticedInterviewing}
                              id="mcPracticedInterviewing"
                            />
                          </View>

                        </View>
                        <View>
                          <Text style={[styles.row10,styles.standardText]}>Felt Prepared?</Text>

                          <View style={[styles.alignStart]}>
                            <Switch
                              onValueChange={(change) => this.setState({ wasPrepared: change, formHasChanged: true })}
                              value={this.state.wasPrepared}
                              id="wasPrepared"
                            />
                          </View>

                        </View>
                      </View>
                    </View>

                    <View style={[styles.row10]}>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.rightPadding15]}>
                          <Text style={[styles.row10,styles.standardText]}>Questions Asked of You</Text>
                        </View>
                        <View style={[styles.topPadding13]}>
                          <TouchableOpacity onPress={() => this.addRemoveItems('Add','','Answered')}>
                            <Image source={{ uri: addCircleOutlineIcon}} style={[styles.square20,styles.contain]}/>
                          </TouchableOpacity>
                        </View>

                      </View>
                      {this.renderItems('Answered')}
                    </View>

                    <View style={[styles.row10]}>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.rightPadding15]}>
                          <Text style={[styles.row10,styles.standardText]}>Questions You Asked</Text>
                        </View>
                        <View style={[styles.topPadding13]}>
                          <TouchableOpacity onPress={() => this.addRemoveItems('Add','','Asked')}>
                            <Image source={{ uri: addCircleOutlineIcon}} style={[styles.square20,styles.contain]}/>
                          </TouchableOpacity>
                        </View>

                      </View>
                      {this.renderItems('Asked')}
                    </View>
                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Rate your interest in the position, and share your thoughts.</Text>

                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Position Rating', selectedIndex: null, selectedName: "positionRating", selectedValue: this.state.positionRating, selectedOptions: this.state.ratingOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn120]}>
                              <Text style={[styles.descriptionText1]}>{this.state.positionRating}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.positionRating}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("positionRating",itemValue)
                            }>
                            {this.state.ratingOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                      <View style={[styles.halfSpacer]}/>
                      <TextInput
                        style={styles.textArea}
                        onChangeText={(text) => this.formChangeHandler("thoughtsOnPosition", text)}
                        value={this.state.thoughtsOnPosition}
                        placeholder="Write thoughts on the position..."
                        placeholderTextColor="grey"
                        multiline={true}
                        numberOfLines={4}
                      />
                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Rate your interest in the company, and share your thoughts.</Text>

                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Company Rating', selectedIndex: null, selectedName: "companyRating", selectedValue: this.state.companyRating, selectedOptions: this.state.ratingOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn120]}>
                              <Text style={[styles.descriptionText1]}>{this.state.companyRating}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.companyRating}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("companyRating",itemValue)
                            }>
                            {this.state.ratingOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                      <View style={[styles.halfSpacer]}/>
                      <TextInput
                        style={styles.textArea}
                        onChangeText={(text) => this.formChangeHandler("thoughtsOnCompany", text)}
                        value={this.state.thoughtsOnCompany}
                        placeholder="Write thoughts on the company..."
                        placeholderTextColor="grey"
                        multiline={true}
                        numberOfLines={4}
                      />
                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Rate your overall fit for the position, and share your thoughts.<Text style={[styles.errorColor]}>*</Text></Text>

                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Fit Rating', selectedIndex: null, selectedName: "fitRating", selectedValue: this.state.fitRating, selectedOptions: this.state.ratingOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn120]}>
                              <Text style={[styles.descriptionText1]}>{this.state.fitRating}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.fitRating}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("fitRating",itemValue)
                            }>
                            {this.state.ratingOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                      <View style={[styles.halfSpacer]}/>

                      <TextInput
                        style={styles.textArea}
                        onChangeText={(text) => this.formChangeHandler("thoughtsOnFit", text)}
                        value={this.state.thoughtsOnFit}
                        placeholder="Write thoughts on fit..."
                        placeholderTextColor="grey"
                        multiline={true}
                        numberOfLines={4}
                      />
                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Employer Feedback</Text>
                      <TextInput
                        style={styles.textArea}
                        onChangeText={(text) => this.formChangeHandler("employerFeedback", text)}
                        value={this.state.employerFeedback}
                        placeholder="Add any feedback from employer..."
                        placeholderTextColor="grey"
                        multiline={true}
                        numberOfLines={4}
                      />
                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Did you pass to the next round?<Text style={[styles.errorColor]}>*</Text></Text>
                      <Switch
                        onValueChange={(change) => this.setState({ passed: change, formHasChanged: true })}
                        value={this.state.passed}
                        id="passed"
                      />
                    </View>

                    <View style={[styles.spacer]}/>

                  </View>
                )}
              </View>
            )}

            { (this.state.logType === 'Offer') && (
              <View>

                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Associated External Work Application<Text style={[styles.errorColor]}>*</Text></Text>

                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Offer', selectedIndex: null, selectedName: "offerAssociatedApplication", selectedValue: this.state.offerAssociatedApplication.name, selectedOptions: this.state.applicationOptions, selectedSubKey: null })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn120]}>
                          <Text style={[styles.descriptionText1]}>{this.state.offerAssociatedApplication.name}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <View style={[styles.standardBorder]}>
                      <Picker
                        selectedValue={this.state.offerAssociatedApplication.name}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("offerAssociatedApplication",itemValue)
                        }>
                        {this.state.applicationOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                      </Picker>
                    </View>
                  )}

                </View>

                {(this.state.offerAssociatedApplication.name !== 'Attach a Saved Application') && (
                  <View>
                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Pay Type<Text style={[styles.errorColor]}>*</Text></Text>

                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Offer Pay Type', selectedIndex: null, selectedName: "offerPayType", selectedValue: this.state.offerPayType, selectedOptions: this.state.payTypeOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn120]}>
                              <Text style={[styles.descriptionText1]}>{this.state.offerPayType}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.offerPayType}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("offerPayType",itemValue)
                            }>
                            {this.state.payTypeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Pay<Text style={[styles.errorColor]}>*</Text></Text>
                      {(this.state.offerPayType === 'Hourly') ? (
                        <View>
                          {(Platform.OS === 'ios') ? (
                            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Offer Pay', selectedIndex: null, selectedName: "offerPay", selectedValue: this.state.offerPay, selectedOptions: this.state.hourlyPayOptions, selectedSubKey: null })}>
                              <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                <View style={[styles.calcColumn120]}>
                                  <Text style={[styles.descriptionText1]}>{this.state.offerPay}</Text>
                                </View>
                                <View style={[styles.width20,styles.topMargin5]}>
                                  <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                </View>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View style={[styles.standardBorder]}>
                              <Picker
                                selectedValue={this.state.offerPay}
                                onValueChange={(itemValue, itemIndex) =>
                                  this.formChangeHandler("offerPay",itemValue)
                                }>
                                {this.state.hourlyPayOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                              </Picker>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View>
                          {(Platform.OS === 'ios') ? (
                            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Offer Pay', selectedIndex: null, selectedName: "offerPay", selectedValue: this.state.offerPay, selectedOptions: this.state.annualPayOptions, selectedSubKey: null })}>
                              <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                <View style={[styles.calcColumn120]}>
                                  <Text style={[styles.descriptionText1]}>{this.state.offerPay}</Text>
                                </View>
                                <View style={[styles.width20,styles.topMargin5]}>
                                  <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                </View>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View style={[styles.standardBorder]}>
                              <Picker
                                selectedValue={this.state.offerPay}
                                onValueChange={(itemValue, itemIndex) =>
                                  this.formChangeHandler("offerPay",itemValue)
                                }>
                                {this.state.annualPayOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                              </Picker>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Do you have a bonus?</Text>
                      <View style={[styles.alignStart]}>
                        <Switch
                          onValueChange={(change) => this.setState({ hasBonus: change, formHasChanged: true })}
                          value={this.state.hasBonus}
                          id="hasBonus"
                        />
                      </View>

                    </View>

                    {(this.state.hasBonus) && (
                      <View style={[styles.row10]}>
                        <Text style={[styles.row10,styles.standardText]}>Bonus Description</Text>
                        <TextInput
                          style={styles.textArea}
                          onChangeText={(text) => this.formChangeHandler("bonusDescription", text)}
                          value={this.state.bonusDescription}
                          placeholder="Describe your bonus and the estimated amount..."
                          placeholderTextColor="grey"
                          multiline={true}
                          numberOfLines={4}
                        />
                      </View>
                    )}

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Were you offered equity?</Text>

                      <View style={[styles.alignStart]}>
                        <Switch
                          onValueChange={(change) => this.setState({ offeredEquity: change, formHasChanged: true })}
                          value={this.state.offeredEquity}
                          id="offeredEquity"
                        />
                      </View>
                    </View>

                    {(this.state.offeredEquity) && (
                      <View>
                        <View style={[styles.row10]}>
                          <Text style={[styles.row10,styles.standardText]}>Equity Percentage</Text>
                          {(Platform.OS === 'ios') ? (
                            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Equity Percentage', selectedIndex: null, selectedName: "equityPercentage", selectedValue: this.state.equityPercentage, selectedOptions: this.state.equityPercentageOptions, selectedSubKey: null })}>
                              <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                <View style={[styles.calcColumn120]}>
                                  <Text style={[styles.descriptionText1]}>{this.state.equityPercentage}</Text>
                                </View>
                                <View style={[styles.width20,styles.topMargin5]}>
                                  <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                </View>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View style={[styles.standardBorder]}>
                              <Picker
                                selectedValue={this.state.equityPercentage}
                                onValueChange={(itemValue, itemIndex) =>
                                  this.formChangeHandler("equityPercentage",itemValue)
                                }>
                                {this.state.equityPercentageOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                              </Picker>
                            </View>
                          )}

                        </View>

                        <View style={[styles.row10]}>
                          <Text style={[styles.row10,styles.standardText]}>Company Valuation</Text>

                          {(Platform.OS === 'ios') ? (
                            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Company Valuation', selectedIndex: null, selectedName: "companyValuation", selectedValue: this.state.companyValuation, selectedOptions: this.state.valuationOptions, selectedSubKey: null })}>
                              <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                <View style={[styles.calcColumn120]}>
                                  <Text style={[styles.descriptionText1]}>{this.state.companyValuation}</Text>
                                </View>
                                <View style={[styles.width20,styles.topMargin5]}>
                                  <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                </View>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View style={[styles.standardBorder]}>
                              <Picker
                                selectedValue={this.state.companyValuation}
                                onValueChange={(itemValue, itemIndex) =>
                                  this.formChangeHandler("companyValuation",itemValue)
                                }>
                                {this.state.valuationOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                              </Picker>
                            </View>
                          )}

                        </View>
                      </View>
                    )}

                    <View style={[styles.row10]}>

                      {(Platform.OS === 'ios') ? (
                        <View>
                          <View style={[styles.flex1,styles.row10]}>
                            <Text style={[styles.standardText]}>Start Date<Text style={[styles.errorColor]}>*</Text></Text>
                          </View>
                          <View style={[styles.flex1, styles.standardBorder, styles.padding10]}>
                            <DateTimePicker
                              testID="offerStartDate"
                              value={(this.state.offerStartDate) ? new Date(this.state.offerStartDate) : new Date()}
                              mode={'datetime'}
                              is24Hour={true}
                              display="default"
                              onChange={(e, d) => this.formChangeHandler("offerStartDate",d,null,true,'datetime')}
                            />
                          </View>
                        </View>
                      ) : (
                        <View>
                          <View style={[styles.row5]}>
                            <Text style={[styles.row10,styles.standardText]}>Start Date<Text style={[styles.errorColor]}>*</Text></Text>
                          </View>

                          <View style={[styles.flex1,styles.rowDirection]}>
                            <View style={[styles.flex50,styles.rightPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Offer Start Date', selectedIndex: null, selectedName: "offerStartDate", selectedValue: this.state.offerStartDate, mode: 'datetime' })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.offerStartDate) ? this.prepareDate(this.state.offerStartDate,"date") : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                            <View style={[styles.flex50,styles.leftPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Offer Start Date', selectedIndex: null, selectedName: "offerStartDate", selectedValue: this.state.offerStartDate, mode: 'time' })}>
                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                  <View style={[styles.calcColumn115]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.offerStartDate) ? this.prepareDate(this.state.offerStartDate,"time") : ""}</Text>
                                  </View>
                                  <View style={[styles.width20,styles.topMargin5]}>
                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                  </View>
                                </View>
                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>
                      )}

                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Have you accepted?<Text style={[styles.errorColor]}>*</Text></Text>
                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Offer Decision', selectedIndex: null, selectedName: "offerDecision", selectedValue: this.state.offerDecision, selectedOptions: this.state.binaryOptions, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn120]}>
                              <Text style={[styles.descriptionText1]}>{this.state.offerDecision}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={this.state.offerDecision}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("offerDecision",itemValue)
                            }>
                            {this.state.binaryOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}

                    </View>

                    <View style={[styles.row10]}>
                      <Text style={[styles.row10,styles.standardText]}>Reason for Decision<Text style={[styles.errorColor]}>*</Text></Text>
                      <TextInput
                        style={styles.textArea}
                        onChangeText={(text) => this.formChangeHandler("decisionReason", text)}
                        value={this.state.decisionReason}
                        placeholder="Why you did you make this decision..."
                        placeholderTextColor="grey"
                        multiline={true}
                        numberOfLines={4}
                      />
                    </View>
                  </View>
                )}

              </View>
            )}

            { (this.state.logType === 'Passion') && (
              <View>
                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Passion Title<Text style={[styles.errorColor]}>*</Text></Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.formChangeHandler("passionTitle", text)}
                    value={this.state.passionTitle}
                    placeholder="Write the title of your passion..."
                    placeholderTextColor="grey"
                  />
                </View>
                <View style={[styles.row10]}>
                  <Text style={[styles.row10,styles.standardText]}>Passion Reason<Text style={[styles.errorColor]}>*</Text></Text>
                  <TextInput
                    style={styles.textArea}
                    onChangeText={(text) => this.formChangeHandler("passionReason", text)}
                    value={this.state.passionReason}
                    placeholder="Why are you passionate about this..."
                    placeholderTextColor="grey"
                    multiline={true}
                    numberOfLines={4}
                  />
                </View>
              </View>
            )}

            { (this.state.clientErrorMessage!== '') && <Text style={[styles.errorColor]}>{this.state.clientErrorMessage}</Text> }
            { (this.state.serverPostSuccess) ? (
              <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessage}</Text>
            ) : (
              <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>
            )}

            {(this.state.logType === 'Goal' && this.state.currentPage !== 'Details') ? (
              <View />
            ) : (
              <View>
                {(this.state.confirmDelete) ? (
                  <View>
                    <Text style={[styles.row10,styles.standardText]}>Are you sure you want to delete this {(this.state.logType && this.state.logType !== '') ? this.state.logType.toLowerCase() : 'Log'}?</Text>
                    <View style={[styles.rowDirection]}>
                      <TouchableOpacity style={[styles.btnSquarish,styles.errorBackgroundColor,styles.leftMargin,styles.flexCenter]} onPress={() => this.deleteLog()}><Text style={[styles.whiteColor,styles.descriptionText1]}>Delete {(this.state.logType && this.state.logType !== '') ? this.state.logType : 'Log'}</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.leftMargin,styles.flexCenter]} onPress={() => this.setState({ confirmDelete: false })}><Text style={[styles.whiteColor,styles.descriptionText1]}>Cancel</Text></TouchableOpacity>
                    </View>
                  </View>
                ) : (
                  <View style={[styles.rowDirection]}>
                    <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.saveLog()}><Text style={[styles.whiteColor]}>Save {(this.state.logType && this.state.logType !== '') ? this.state.logType : 'Log'}</Text></TouchableOpacity>
                    {(this.state.editExisting) && (
                      <TouchableOpacity style={[styles.btnPrimary,styles.errorBackgroundColor,styles.leftMargin,styles.flexCenter]} onPress={() => this.setState({ confirmDelete: true })}><Text style={[styles.whiteColor]}>Delete {(this.state.logType && this.state.logType !== '') ? this.state.logType : 'Log'}</Text></TouchableOpacity>
                    )}
                  </View>
                )}
                <View style={[styles.superSpacer]} />
              </View>
            )}
          </View>
        </View>
      </View>
    )
  }

  prepareDate(passedDate,type) {
    console.log('prepareDate called', passedDate,type)

    // console.log('see date: ', new Date(passedDate), new Date(passedDate).toString())
    let returnedDate = new Date(passedDate)
    if (type === 'date') {
      returnedDate = convertDateToString(returnedDate,"hyphenatedDate")
    } else if (type === 'time') {
      returnedDate = convertDateToString(returnedDate,"hyphenatedDateTime").split("T")[1]
    }
    console.log('see date: ', returnedDate)

    return returnedDate
  }

  renderSuggestion(item,optionIndex,inModal) {
    console.log('renderSuggestion called')

    let cardClass = [styles.calcColumn60,styles.bottomMargin50,styles.standardBorder,styles.padding30]
    if (inModal) {
      cardClass = [styles.flex1,styles.bottomMargin,styles.standardBorder,styles.padding30]
    }

    return (
      <View key="suggestionKey">
        <View style={cardClass}>
          <View style={[styles.rowDirection]}>
            <View style={[styles.width60]}>
              <Image source={(item.pictureURL) ? { uri: item.pictureURL} : { uri: profileIconDark}} style={[styles.square50,styles.contain, { borderRadius: 25 }]} />
            </View>
            <View style={[styles.calcColumn180]}>
              <Text style={[styles.headingText4]}>{item.senderFirstName} {item.senderLastName}</Text>
              <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.topPadding5]}>{convertDateToString(item.createdAt,"daysAgo")}</Text>
            </View>

          </View>

          <Text style={[styles.topMargin20]}><Text style={[styles.descriptionTextColor]}>{item.senderFirstName} says:</Text> {item.message}</Text>

          {(item.selectedPeople && item.selectedPeople.length > 0) && (
            <View style={[styles.topMargin20]}>
              <Text style={[styles.headingText6,styles.row10]}>Suggested Contacts</Text>

              {item.selectedPeople.map((item2, optionIndex2) =>
                <View key={item2}>
                  <Text style={[styles.headingText2,styles.boldText]}>{optionIndex2 + 1}. {item2.firstName} {item2.lastName} ({item2.email}) [{item2.relationship}] - {item2.reason}</Text>
                </View>
              )}
            </View>
          )}

          {(item.selectedLinks && item.selectedLinks.length > 0) && (
            <View style={[styles.topMargin20]}>
              <Text style={[styles.headingText6,styles.row10]}>Links to Resources</Text>

              {item.selectedLinks.map((item2, optionIndex2) =>
                <View key={item2}>
                  <Text style={[styles.headingText2,styles.boldText]}>{optionIndex2 + 1}. <TouchableOpacity onPress={() => Linking.openURL(item2.url)}>{item2.url}</TouchableOpacity> ({item2.category})</Text>
                </View>
              )}
            </View>
          )}

          {(item.selectedTimes && item.selectedTimes.length > 0) && (
            <View style={[styles.topMargin20]}>
              <Text style={[styles.headingText6,styles.row10]}>Times to Chat / Connect</Text>

              {item.selectedTimes.map((item2, optionIndex2) =>
                <View key={item2}>
                  <Text style={[styles.headingText2,styles.boldText]}>{optionIndex2 + 1}. {convertDateToString(new Date(item2.time),"datetime-2")}</Text>
                </View>
              )}
            </View>
          )}

          {(item.selectedProjects && item.selectedProjects.length > 0) && (
            <View style={[styles.topMargin20]}>
              <Text style={[styles.headingText6,styles.row10]}>Suggested Projects to Work On</Text>

              {item.selectedProjects.map((item2, optionIndex2) =>
                <View key={item2}>
                  <Text style={[styles.headingText2,styles.boldText]}>{optionIndex2 + 1}. {item2.name}: {item2.description}</Text>
                </View>
              )}
            </View>
          )}

          {(item.selectedCareers && item.selectedCareers.length > 0) && (
            <View style={[styles.topMargin20]}>
              <Text style={[styles.headingText6,styles.row10]}>Suggested Careers to Pursue</Text>

              {item.selectedCareers.map((item2, optionIndex2) =>
                <View key={item2}>
                  <Text style={[styles.headingText2,styles.boldText]}>{optionIndex2 + 1}. {item2}</Text>
                </View>
              )}
            </View>
          )}

          {(!inModal) && (
            <View style={[styles.topMargin20]}>
              <View style={[styles.horizontalLine]} />

              <View style={[styles.topMargin,styles.rowDirection]}>
                <TouchableOpacity onPress={() => this.itemClicked(item,optionIndex,'up')}>
                  <Image source={(item.liked) ? { uri: thumbsUpBlueIcon} : { uri: thumbsUpIcon}} style={[styles.square25,styles.contain]}/>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.leftMargin15]} onPress={() => this.itemClicked(item,optionIndex,'down')}>
                  <Image source={(item.disliked) ? { uri: thumbsDownOrangeIcon} : { uri: thumbsDownIcon}} style={[styles.square25,styles.contain]} />
                </TouchableOpacity>

                <TouchableOpacity style={[styles.leftMargin15]} onPress={() => this.setState({ modalIsOpen: true, showFeedback: true, selectedSuggestion: item, selectedIndex: optionIndex })}>
                  <Image source={(item.feedback) ? { uri: feedbackIconBlue} : { uri: feedbackIconDark}} style={[styles.square25,styles.contain]} />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      </View>
    )
  }

  itemClicked(item, optionIndex,direction) {
    console.log('itemClicked called')

    let suggestions = this.state.suggestions
    if (direction === 'up') {
      if (suggestions[optionIndex].liked) {
        suggestions[optionIndex]['liked'] = false
      } else {
        suggestions[optionIndex]['liked'] = true
        suggestions[optionIndex]['disliked'] = false
      }
    } else {
      if (suggestions[optionIndex].disliked) {
        suggestions[optionIndex]['disliked'] = false
      } else {
        suggestions[optionIndex]['disliked'] = true
        suggestions[optionIndex]['liked'] = false
      }
    }

    this.setState({ suggestions })
    this.saveSuggestion(item,false)

  }

  saveSuggestion(selectedSuggestion,closeTheModal) {
    console.log('saveSuggestion called')

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })
    const _id = selectedSuggestion._id
    const liked = selectedSuggestion.liked
    const disliked = selectedSuggestion.disliked
    const feedback = selectedSuggestion.feedback

    Axios.post('https://www.guidedcompass.com/api/suggestions', {
      _id, liked, disliked, feedback
    })
    .then((response) => {
      console.log('attempting to save addition to suggestion')
      if (response.data.success) {
        console.log('saved suggestion', response.data)

        this.setState({ isSaving: false, successMessage: 'Successfully saved feedback'})
        if (closeTheModal) {
          this.closeModal()
        }

      } else {
        console.log('did not save successfully')
        this.setState({ isSaving: false, errorMessage: response.data.message })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ errorMessage: 'there was an error saving suggestion', isSaving: false})
    });
  }

  render() {

    return (
        <View>
          <ScrollView>

            {(this.state.logType === 'Goal' && this.state.editExisting && !this.props.modalIsOpen) ? (
              <View>
                <View style={[styles.fullScreenWidth,styles.ctaHorizontalLine,styles.row15,styles.whiteBackground, styles.leftPadding30]}>
                  <ScrollView style={[styles.carousel]} horizontal={true}>
                    {this.state.subNavCategories.map((value, index) =>
                      <View style={[styles.rightPadding20]}>
                        {(this.state.subNavCategories[index] === this.state.currentPage) ? (
                          <View style={[styles.selectedCarouselItem]}>
                            <Text key={value} style={[styles.standardText]}>{value}</Text>
                          </View>
                        ) : (
                          <TouchableOpacity style={[styles.menuButton]} onPress={() => this.subNavClicked(value)}>
                            <Text key={value} style={[styles.standardText]}>{value}</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </ScrollView>
                </View>
              </View>
            ) : (
              <View />
            )}

            <View style={[styles.flex1,styles.card,styles.topMargin]}>
              {this.renderDetails()}
            </View>

            {(this.state.extraPaddingForKeyboard) && (
              <View>
                <View style={[styles.superSpacer]} /><View style={[styles.superSpacer]} />
                <View style={[styles.superSpacer]} /><View style={[styles.superSpacer]} />
              </View>
            )}

          </ScrollView>

          {(this.props.modalIsOpen) ? (
            <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>
                {(this.state.showPicker || this.state.showDateTimePicker) ? (
                  <View style={[styles.flex1,styles.pinBottom,styles.justifyEnd]}>
                    {(this.state.showPicker) ? (
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
                    ) : (
                      <View>
                        <View style={[styles.alignCenter]}>
                          <TouchableOpacity onPress={() => this.props.closeModal()}>

                            <Text style={[styles.standardText,styles.centerText,styles.ctaColor]}>Cancel</Text>
                          </TouchableOpacity>
                        </View>
                        <DateTimePicker
                          testID={this.state.selectedName}
                          value={(this.state.selectedValue) ? new Date(this.state.selectedValue) : new Date()}
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
                ) : (
                  <View />
                )}

            </Modal>
          ) : (
            <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>
              {(this.state.showPicker || this.state.showDateTimePicker) ? (
                <View style={[styles.flex1,styles.pinBottom,styles.justifyEnd]}>
                  {(this.state.showPicker) ? (
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
                  ) : (
                    <View>
                      <View style={[styles.alignCenter]}>
                        <TouchableOpacity onPress={() => this.closeModal()}>

                          <Text style={[styles.standardText,styles.centerText,styles.ctaColor]}>Cancel</Text>
                        </TouchableOpacity>
                      </View>
                      <DateTimePicker
                        testID={this.state.selectedName}
                        value={(this.state.selectedValue) ? new Date(this.state.selectedValue) : new Date()}
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
              ) : (
                <ScrollView key="info" style={[styles.card,styles.fullScreenWidth]}>
                  {(this.state.showSmartDefinition) && (
                    <View>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.calcColumn100]}>
                          <Text style={[styles.headingText2]}>S.M.A.R.T. Goals Defined</Text>
                        </View>
                        <View style={[styles.width40]}>
                          <TouchableOpacity style={[styles.topMargin]} onPress={() => this.closeModal()}>
                            <Image source={{ uri: closeIcon}} style={[styles.square20,styles.contain]} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                      <Text style={[styles.headingText6]}>All goals should be:</Text>

                      <View style={[styles.row10]}>
                        <Text style={[styles.topMargin20]}><Text style={[styles.boldText,styles.headingText4]}>S</Text>pecific</Text>
                        <Text style={[styles.topMargin20]}><Text style={[styles.boldText,styles.headingText4]}>M</Text>easurable</Text>
                        <Text style={[styles.topMargin20]}><Text style={[styles.boldText,styles.headingText4]}>A</Text>chievable</Text>
                        <Text style={[styles.topMargin20]}><Text style={[styles.boldText,styles.headingText4]}>R</Text>elevant</Text>
                        <Text style={[styles.topMargin20]}><Text style={[styles.boldText,styles.headingText4]}>T</Text>ime-Bound</Text>
                      </View>
                    </View>
                  )}

                  {(this.state.showStrategyDefinition) && (
                    <View>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.calcColumn100]}>
                          <Text style={[styles.headingText2]}>Strategies & Tactics Defined</Text>
                        </View>
                        <View style={[styles.width40]}>
                          <TouchableOpacity style={[styles.topMargin]} onPress={() => this.closeModal()}>
                            <Image source={{ uri: closeIcon}} style={[styles.square20,styles.contain]} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                      <Text>In order to achieve your goals, we recommend you implement strategies & tactics. Tactics are a subset of a strategy. Here are definitions:</Text>

                      <View style={[styles.row10]}>
                        <View style={[styles.topMargin20]}>
                          <Text><Text style={[styles.boldText,styles.ctaColor]}>Strategy</Text> is defined as a plan of action or policy designed to achieve a major or overall aim. For example, in order to achieve my goal of landing a software engineering job, I need to code everyday.</Text>
                        </View>
                        <View style={[styles.topMargin20]}>
                          <Text><Text style={[styles.boldText,styles.ctaColor]}>Tactic</Text> is defined as an action carefully planned to achieve a specific end. For example, since my strategy is to code everyday, one of my tactics may be to code for 30 minutes after I exercise in the morning; another tactic may be to set a daily alarm.</Text>
                        </View>
                      </View>

                    </View>
                  )}

                  {(this.state.showFeedback) && (
                    <View>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.calcColumn100]}>
                          <Text style={[styles.headingText2]}>Was This Useful?</Text>
                        </View>
                        <View style={[styles.width40]}>
                          <TouchableOpacity style={[styles.topMargin]} onPress={() => this.closeModal()}>
                            <Image source={{ uri: closeIcon}} style={[styles.square20,styles.contain]} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                      {this.renderSuggestion(this.state.selectedSuggestion,this.state.selectedIndex,true)}

                      <View style={[styles.row10]}>
                        <View style={[styles.rowDirection]}>
                          <TouchableOpacity onPress={() => this.itemClicked(this.state.selectedSuggestion,this.state.selectedIndex,'up')}>
                            <Image source={(this.state.selectedSuggestion.liked) ? { uri: thumbsUpBlueIcon} : { uri: thumbsUpIcon}} style={[styles.square30,styles.contain]} />
                          </TouchableOpacity>
                          <TouchableOpacity style={[styles.leftMargin15]} onPress={() => this.itemClicked(this.state.selectedSuggestion,this.state.selectedIndex,'down')}>
                            <Image source={(this.state.selectedSuggestion.disliked) ? { uri: thumbsDownOrangeIcon} : { uri: thumbsDownIcon}} style={[styles.square30,styles.contain]} />
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.row10]}>
                          <TextInput
                            style={styles.textArea}
                            onChangeText={(text) => this.formChangeHandler("feedback", text)}
                            value={this.state.selectedSuggestion.feedback}
                            placeholder="How were you able to use their suggstion(s)/resource(s)?"
                            placeholderTextColor="grey"
                            multiline={true}
                            numberOfLines={4}
                          />
                        </View>
                      </View>

                      {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor,styles.descriptionText2,styles.row5]}>{this.state.errorMessage}</Text>}
                      {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor,styles.descriptionText2,styles.row5]}>{this.state.successMessage}</Text>}

                      {(this.state.selectedSuggestion.feedback) && (
                        <View style={[styles.topMargin20]}>
                          <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.saveSuggestion(this.state.selectedSuggestion,true)}><Text style={[styles.standardText,styles.whiteColor]}>Send Feedback</Text></TouchableOpacity>
                        </View>
                      )}

                    </View>
                  )}

                </ScrollView>
              )}
            </Modal>
          )}
        </View>

    )
  }

}

export default EditLog;
