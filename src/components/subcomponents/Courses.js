import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator, TextInput, Linking } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import * as Progress from 'react-native-progress';

const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';
const recommendIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/recommend-icon.png';
const dragIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/drag-icon.png';
const udemyLogo = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/udemy-logo.png';
const timeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-blue.png';
const moneyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/money-icon-blue.png';
const difficultyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/difficulty-icon-blue.png';
const linkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon.png';
const editIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/edit-icon-dark.png';
const deleteIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/delete-icon-dark.png';
const duplicateIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/duplicate-icon.png';
const checkmarkDarkGreyIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-dark-grey.png';
const checkboxChecked = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-checked.png';
const favoritesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-dark.png';
const profileIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-blue.png';
const shareIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/share-icon-dark.png';
const shareIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/share-icon-blue.png';
const ratingsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/ratings-icon-blue.png';
const calendarIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/calendar-icon-blue.png';
const careerMatchesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-blue.png';
const opportunitiesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-blue.png';
const learningObjectivesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/learning-objectives-icon-blue.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const addLessonIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-lesson-icon-blue.png';
const addLessonIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-lesson-icon-dark.png';
const matchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/match-icon.png';
const matchIconSelected = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/match-icon-selected.png';
const filterIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/filter-icon.png';
const filterIconSelected = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/filter-icon-selected.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const profileIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/learning-objectives-icon-grey.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';
const linkIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon-blue.png';
const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png';
const experienceIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/experience-icon.png';
const checkboxEmpty = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkbox-empty.png';
const courseIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/course-icon-dark.png';
const upvoteIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-blue.png';
const upvoteIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-grey.png';
const editIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/edit-icon-blue.png';
const timeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-blue.png';
const transcriptIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/transcript-icon.png';
const careerMatchesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-dark.png';
const favoriteIconSelected = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorite-icon-selected.png';
const commentIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/comment-icon-dark.png';
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';
const skillsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/skills-icon-blue.png';
const assessmentsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/assessments-icon-blue.png';
const courseIconBlue = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/course-icon-blue.png";

import SubComments from '../common/Comments';
import SubPicker from '../common/SubPicker';

class Courses extends Component {
  constructor(props) {
    super(props)
    this.state = {

        newFormat: true,
        subNavCategories: ['Schedule','Browse','Favorited','Completed','Recommended'],
        subNavSelected: 'Schedule',
        budget: 1000,

        showScheduleResults: false,
        showDragger: true,

        courses: [],
        filteredCourses: [],
        timerId: 0,

        favorites: [],
        favoritedCareers: [],
        favoritedCareerDetails: [],
        favoritedOpportunities: [],
        favoritedOpportunityDetails: [],
        favoritedCourseDetails: [],

        completions: [],
        completedCourseDetails: [],
        recommendations: [],
        recommendedCourseDetails: [],

        learningObjectives: [],
        useCases: [],
        referees: [],

        showProjectDetail: false,

        selectedIndex1: 0,
        selectedIndex2: 0,

        defaultFilterOption: 'All',
        defaultSortOption: 'No Sort Applied',

        memberFilter: '',
        applicationFilter: '',
        assessmentFilter: '',
        favoriteFilter: '',
        passionFilter: '',
        endorsementFilter: '',

        memberFilterOptions: [],
        applicationFilterOptions: [],
        assessmentFilterOptions: ['','Has None','At Least One','Has All'],
        favoriteFilterOptions: ['','Has None','At Least One'],
        passionFilterOptions: ['','Has None','At Least One'],
        endorsementFilterOptions: ['','Has None','At Least One'],
        gradeOptions: [],
        pathwayOptions: [{ name: '' }],
        priceOptions: [],
        durationOptions: [],
        difficultyLevelOptions: [],
        goalTypeOptions: [],
        entrepreneurshipGoalOptions: [],
        industryOptions: [],
        intensityOptions: [],

        categoryOptions: ['','Training Program','Course'],
        degreeTypeOptions: [],
        functionOptions: [],
        orgPathwayOptions: [],
        orgPriceOptions: ['','$0','$1 - $100','$101 - $500','$501 - $1,000','$1,001 - $5,000','$5,000+'],
        orgDurationOptions: [],

        schedule: [],
        weekTwo: [],

        goalType: { name: ''},
        applications: [],
        filteredApplications: [],
        selectedJob: null,
        benchmark: null,
        benchmarkOptions: [],
        largestSkillGaps: [],

        showFilters: true,
        unready: true,

        serverPostSuccess: true,
        serverSuccessMessage: '',
        serverErrorMessage: ''
    }

    this.retrieveData = this.retrieveData.bind(this)

    this.pullCourses = this.pullCourses.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)

    this.favoriteItem = this.favoriteItem.bind(this)
    this.toggleSearchBar = this.toggleSearchBar.bind(this)

    this.renderManipulators = this.renderManipulators.bind(this)
    this.filterResults = this.filterResults.bind(this)
    this.sortResults = this.sortResults.bind(this)
    this.markCompleted = this.markCompleted.bind(this)

    this.renderTags = this.renderTags.bind(this)
    this.removeTag = this.removeTag.bind(this)

    this.searchItems = this.searchItems.bind(this)
    this.searchItemClicked = this.searchItemClicked.bind(this)
    this.addLearningObjectiveOptions = this.addLearningObjectiveOptions.bind(this)
    this.deleteItem = this.deleteItem.bind(this)
    this.calculateMatches = this.calculateMatches.bind(this)
    this.renderBrowseCourses = this.renderBrowseCourses.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.enrollInCourse = this.enrollInCourse.bind(this)

  }

  componentDidMount() {
    console.log('courses component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within coursesTwo ', this.props.activeOrg, prevProps.activeOrg)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      console.log('were in')
      this.retrieveData()
    } else if (this.props.roleName !== prevProps.roleName) {
      this.retrieveData()
    } else if (this.props.subNavSelected !== prevProps.subNavSelected) {
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
      const courseNavSelected = AsyncStorage.getItem('courseNavSelected');

      let activeOrg = await AsyncStorage.getItem('activeOrg')
      if (!activeOrg) {
        activeOrg = 'guidedcompass'
      }
      const org = activeOrg
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (emailId !== null) {
        // We have data!!
        // console.log('what is the email of this user', emailId);

        // this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
        //   roleName, activeOrg, orgFocus, orgName, remoteAuth, courseNavSelected
        // })

        const largestSkillGaps = []
        const pathwayOptions = [{ name: '' }]

        const priceOptions = ['','Price-Paid','Price-Free']
        const durationOptions = ['','Short','Medium','Long','Extra Long']
        const difficultyLevelOptions = ['','Beginner','Intermediate','Expert']

        const goalTypeOptions = [
          { name: ''},
          { name: 'Career', description: 'Land a job within a career path (Career)'},
          { name: 'Opportunity', description: 'Get hired for a specific opportunity (Opportunity)'},
          { name: 'Entrepreneurship', description: 'Launch a business / project (Entrepreneurship)'},
          { name: 'Basics', description: 'Basics (Learn fundamental skills most employers value)'},
          { name: 'Stability', description: 'Stability (Learn mid-level+ skills that employers steadily value)'},
          { name: 'Pay', description: 'Pay (Learn mid-level+ skills that employers will pay the most for)'},
          { name: 'Interests', description: 'Interests (Learn skills based on your interest profile)'},
        ]
        // skill gaps, specialize, projects
        // { name: 'Recognition', description: 'Recognition (Learn skills that give consistent social recognition)'},

        const entrepreneurshipGoalOptions = [
          '','Overall Skills','Legal Formation','Market Research','Building a Team','Building an App MVP',
          'Selling Goods / Services Online','Marketing Your Product','Selling Your Product','Raising Funding',
          'Product Design','Forecasting and Budgeting','Other'
        ]

        const intensityOptions =  ['','Aggressive (> 40 hrs / week)','Moderately Aggressive (20 - 40 hrs / week)','Moderate (10 - 20 hrs / week)','Moderately Passive (4 - 10 hrs / week)','Passive (1 - 4 hrs / week)']

        const twoWeeksFromNow = new Date(Date.now() + 12096e5)
        const minYear = twoWeeksFromNow.getFullYear().toString()
        let minMonth = (twoWeeksFromNow.getMonth() + 1)
        if (minMonth < 10) {
          minMonth = '0' + minMonth.toString()
        } else {
          minMonth = minMonth.toString()
        }
        const minDay = twoWeeksFromNow.getDate().toString()
        const minTargetDate = minYear + '-' + minMonth + '-' + minDay

        const maxYear = (new Date().getFullYear() + 1).toString()
        let maxMonth = (new Date().getMonth() + 1)
        if (maxMonth < 10) {
          maxMonth = '0' + maxMonth.toString()
        } else {
          maxMonth = maxMonth.toString()
        }
        const maxDay = new Date().getDate().toString()
        const maxTargetDate = maxYear + '-' + maxMonth + '-' + maxDay

        const targetDate = minTargetDate

        const todayYear = (new Date().getFullYear()).toString()
        let todayMonth = (new Date().getMonth() + 1)
        if (todayMonth < 10) {
          todayMonth = '0' + todayMonth.toString()
        } else {
          todayMonth = todayMonth.toString()
        }
        const todayDay = new Date().getDate().toString()
        const today = todayYear + '/' + todayMonth + '/' + todayDay

        const oneWeekFromNowDate = new Date(new Date().getTime() + (2 * 7) * 24 * 60 * 60 * 1000);
        const futureYear = oneWeekFromNowDate.getFullYear().toString()
        let futureMonth = (oneWeekFromNowDate.getMonth() + 1)
        if (futureMonth < 10) {
          futureMonth = '0' + futureMonth.toString()
        } else {
          futureMonth = futureMonth.toString()
        }
        const futureDay = oneWeekFromNowDate.getDate().toString()
        const oneWeekFromNow = futureYear + '-' + futureMonth + '-' + futureDay

        const showScheduleResults = false
        const schedule = [
          { week: 1, courses: [
            { title: 'Fake Course', headline: 'Fake headline', duration: '1h 20m', price: '$50', difficultyLevel: 'Advanced', url: 'https://www.udemy.com'},
            { title: 'Fake Course 2', headline: 'Fake headline 2', duration: '2h 20m', price: '$100', difficultyLevel: 'Intermediate', url: 'https://www.udemy.com'}
          ]},
          { week: 2, courses: [
            { title: 'Fake Course 3', headline: 'Fake headline 3', duration: '4h 20m', price: '$150', difficultyLevel: 'Beginner', url: 'https://www.udemy.com'},
            { title: 'Fake Course 4', headline: 'Fake headline 4', duration: '5h 20m', price: '$2150', difficultyLevel: 'Beginner', url: 'https://www.udemy.com'},
          ]}

        ]
        const weekTwo = [
          { title: 'Fake Course 3', headline: 'Fake headline 3', duration: '4h 20m', price: '$150', difficultyLevel: 'Beginner', url: 'https://www.udemy.com'},
          { title: 'Fake Course 4', headline: 'Fake headline 4', duration: '5h 20m', price: '$2150', difficultyLevel: 'Beginner', url: 'https://www.udemy.com'},
        ]

        let useCases = [
          { name: 'Career', description: 'Optimize for courses that are helpful for your career path'},
          { name: 'Opportunity', description: 'Optimize for courses that help get hired for a specific opportunity'},
          { name: 'Entrepreneurship', description: 'Optimize for courses that will help you launch a successful business'},
          { name: 'Basics', description: 'Optimize for courses that teach skills that virtually all employers value', selected: false }, // skills
          { name: 'Stability', description: 'Optimize for courses that teach skills that are in constant demand', selected: false }, // job growth, company size
          { name: 'Pay', description: 'Optimize for courses that teach skills employers would pay the most for', selected: false }, // pay
          { name: 'Interests', description: 'Optimize for courses that, based on your interest assessment, you are likely interested in', selected: false }, // interests, personality
        ]

        let subNavCategories = ['Schedule','Browse','Favorited','Completed','Recommended']
        let subNavSelected = 'Schedule'
        if (this.state.newFormat) {
          subNavCategories = ['Lessons','Resources','Courses']
          subNavSelected = 'Lessons'
        }

        if (this.props.subNavSelected) {
          subNavSelected = this.props.subNavSelected
        } else if (courseNavSelected) {
          subNavSelected = courseNavSelected
        }

        if (this.props.roleName === 'Admin') {
          subNavCategories  = ['Browse','Favorited','Recommended']
          subNavSelected = 'Browse'
        }

        this.setState({ emailId: email, cuFirstName, cuLastName, username, roleName, org, orgFocus,
          largestSkillGaps, pathwayOptions, priceOptions, durationOptions, difficultyLevelOptions, subNavCategories, subNavSelected, goalTypeOptions,
          entrepreneurshipGoalOptions, intensityOptions, minTargetDate, maxTargetDate, targetDate, today, oneWeekFromNow,
          schedule, weekTwo, showScheduleResults, useCases, orgName
        })

        Axios.get('https://www.guidedcompass.com/api/workoptions')
          .then((response) => {
            console.log('Work options query tried');

            if (response.data.success) {
              console.log('Work options query succeeded')

              let industryOptions = ['']
              for (let i = 1; i <= response.data.workOptions[0].industryOptions.length; i++) {
                if (i > 1) {
                  industryOptions.push(response.data.workOptions[0].industryOptions[i - 1])
                }
              }

              let functionOptions = response.data.workOptions[0].functionOptions
              let degreeTypeOptions = response.data.workOptions[0].degreeOptions
              let orgDurationOptions = response.data.workOptions[0].durationOptions

              this.setState({ industryOptions, functionOptions, degreeTypeOptions, orgDurationOptions })

            } else {
              console.log('no industry data found', response.data.message)

            }
        }).catch((error) => {
            console.log('query for work options did not work', error);
        })

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

             Axios.get('https://www.guidedcompass.com/api/logs', { params: { emailId: email } })
             .then((response) => {
                console.log('log query attempted')
                 if (response.data.success) {
                   console.log('Logs received query worked');

                   profile['logs'] = response.data.logs
                   this.setState({ profile })

                 } else {
                   console.log('no log data found', response.data.message)
                 }

             }).catch((error) => {
                 console.log('Log query did not work', error);
             });

           } else {
             console.log('no assessment results', response2.data)

             Axios.get('https://www.guidedcompass.com/api/logs', { params: { emailId: email } })
             .then((response) => {
                console.log('log query attempted')
                 if (response.data.success) {
                   console.log('Logs received query worked');

                   let profile = { firstName: cuFirstName, lastName: cuLastName, email }
                   profile['logs'] = response.data.logs
                   this.setState({ profile })

                 } else {
                   console.log('no log data found', response.data.message)
                 }

             }).catch((error) => {
                 console.log('Log query did not work', error);
             });
           }

       }).catch((error) => {
         console.log('query for assessment results did not work', error);
       })

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: org } })
        .then((response) => {
          console.log('Org info query attempted');

          if (response.data.success) {
            console.log('org info query worked')

            const placementPartners = response.data.orgInfo.placementPartners
            this.setState({ placementPartners })

          } else {
            console.log('org info query did not work', response.data.message)
            //don't allow signups without an org affiliation
            this.setState({ error: { message: 'There was an error finding the organization' } })
          }

        }).catch((error) => {
            console.log('Emails query did not work for some reason', error);
        });

        Axios.get('https://www.guidedcompass.com/api/pathways', { params: { orgCode: org } })
        .then((response) => {
          console.log('Pathways query attempted no 1');

          if (response.data.success) {
            console.log('pathway query worked no 1')

            if (response.data.pathways.length !== 0) {

              const orgPathwayOptions = [{ title: '' }].concat(response.data.pathways)

              this.setState({ orgPathwayOptions });
            }

          } else {
            console.log('pathway query did not work', response.data.message)
          }

        }).catch((error) => {
            console.log('Pathway query did not work for some reason', error);
        });

        Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId: email } })
       .then((response) => {
         console.log('Favorites query attempted');

         if (response.data.success) {
           console.log('successfully retrieved favorites')

           const favorites = response.data.favorites

           if (favorites && favorites.length > 0) {
             Axios.get('https://www.guidedcompass.com/api/favorites/detail', { params: { favorites, orgCode: org } })
             .then((response2) => {
               console.log('Favorites detail query attempted');

               if (response2.data.success) {
                 console.log('successfully retrieved favorites detail')

                 let favoritedCareers = []
                 let favoritedCareerDetails = []
                 let favoritedOpportunities = []
                 let favoritedOpportunityDetails = []
                 let favoritedCourseDetails = []
                 // for (let i = 1; i <= favoritedCareerDetails.length; i++) {
                 //   favoritedCareers.push(favoritedCareerDetails[i - 1].name)
                 // }

                 for (let i = 1; i <= response.data.favorites.length; i++) {
                   if (response2.data.types[i - 1] && response2.data.types[i - 1] === 'career') {
                     favoritedCareers.push(response2.data.favorites[i - 1].name)
                     favoritedCareerDetails.push(response2.data.favorites[i - 1])
                   } else if (response2.data.types[i - 1] && response2.data.types[i - 1] === 'work') {
                     if (response2.data.favorites[i - 1].postType !== 'Event') {
                       if (response2.data.favorites[i - 1].title && response2.data.favorites[i - 1].title !== '') {
                         favoritedOpportunities.push(response2.data.favorites[i - 1].title)
                       } else {
                         favoritedOpportunities.push(response2.data.favorites[i - 1].name)
                       }

                       favoritedOpportunityDetails.push(response2.data.favorites[i - 1])
                     }
                   } else if (response2.data.types[i - 1] && response2.data.types[i - 1] === 'course') {
                     const favoritedCourse = response2.data.favorites[i - 1]
                     favoritedCourse['favoriteId'] = response.data.favorites[i - 1]
                     favoritedCourseDetails.push(favoritedCourse)
                   }
                 }

                 //query info on those favorites
                 this.setState({ favorites, favoritedCareers, favoritedCareerDetails, favoritedOpportunities, favoritedOpportunityDetails, favoritedCourseDetails })

               } else {
                 console.log('no favorites detail data found', response2.data.message)
               }

             }).catch((error) => {
                 console.log('Favorites detail query did not work', error);
             });
           }

         } else {
           console.log('no favorites data found', response.data.message)
         }

       }).catch((error) => {
           console.log('Favorites query did not work', error);
       });

       Axios.get('https://www.guidedcompass.com/api/completions', { params: { emailId: email } })
      .then((response) => {
        console.log('Completions query attempted');

        if (response.data.success) {
          console.log('successfully retrieved completions')

          const completions = response.data.completions

          if (completions && completions.length > 0) {
            Axios.get('https://www.guidedcompass.com/api/completions/detail', { params: { completions, orgCode: org } })
            .then((response2) => {
              console.log('Completions detail query attempted');

              if (response2.data.success) {
                console.log('successfully retrieved completions detail')

                let completedCourseDetails = []

                for (let i = 1; i <= response.data.completions.length; i++) {
                  if (response2.data.types[i - 1] && response2.data.types[i - 1] === 'course') {
                    const completedCourse = response2.data.completions[i - 1]
                    completedCourse['completionId'] = response.data.completions[i - 1]
                    completedCourseDetails.push(completedCourse)
                  }
                }

                this.setState({ completions, completedCourseDetails })

              } else {
                console.log('no completions detail data found', response2.data.message)
              }

            }).catch((error) => {
                console.log('Completions detail query did not work', error);
            });
          }

        } else {
          console.log('no completions data found', response.data.message)
        }

      }).catch((error) => {
          console.log('Favorites query did not work', error);
      });

        let orgCode = 'general'
        if (org === 'c2c' || org === 'dpscd') {
          orgCode = org
        }

        Axios.get('https://www.guidedcompass.com/api/benchmarks', { params: { orgCode } })
        .then((response) => {

          if (response.data.success) {
            console.log('Benchmark query worked');

            let pathwayOptions = [{name: '', skills: []}]
            let names = []

            for (let i = 1; i <= response.data.benchmarks.length; i++) {

              if (org === 'dpscd') {
                if (response.data.benchmarks[i - 1].pathway === pathway) {

                  // let skillTraits = response.data.benchmarks[i - 1].skills.concat(response.data.benchmarks[i - 1].traits)
                  let skills = response.data.benchmarks[i - 1].skills

                  let skillsObject = []

                  for (let j = 1; j <= skills.length; j++) {
                    if (skills[j - 1].title && skills[j - 1].skillType) {
                      const name = skills[j - 1].title
                      const skillType = skills[j - 1].skillType
                      skillsObject.push({ name, skillType })
                    } else {
                      // not adding traits for now
                      // const name = skills[j - 1].title
                      // const skillType = 'Trait'
                      // console.log('no good: ', name)
                      // skillsObject.push({ name, skillType})
                    }
                  }

                  this.setState({ skills: skillsObject })
                }
              } else {

                let name = response.data.benchmarks[i - 1].jobFunction
                // console.log('show the value 1: ', name)
                if (!names.includes(name)) {
                  names.push(name)
                  // console.log('show the value 2: ', name)
                  // let skillTraits = response.data.benchmarks[i - 1].skills.concat(response.data.benchmarks[i - 1].traits)
                  let skills = response.data.benchmarks[i - 1].skills

                  let skillsObject = []

                  for (let j = 1; j <= skills.length; j++) {
                    if (skills[j - 1].title && skills[j - 1].skillType) {
                      const name = skills[j - 1].title
                      const skillType = skills[j - 1].skillType
                      skillsObject.push({ name, skillType })
                    } else {
                      // not adding traits for now
                      // const name = skills[j - 1].title
                      // const skillType = 'Trait'
                      // console.log('no good: ', name)
                      // skillsObject.push({ name, skillType})
                    }
                  }

                  pathwayOptions.push({ name, skills: skillsObject })
                } else {


                }
                // console.log('show pathwayOptions: ', pathwayOptions)

              }
            }

            this.setState({ pathwayOptions })
          } else {
            console.log('no benchmarks found', response.data.message)

          }

        }).catch((error) => {
            console.log('Benchmark query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/courses/enrollments', { params: { emailId: email } })
        .then((response) => {
         console.log('Enrollments query attempted');

         if (response.data.success) {
           console.log('successfully retrieved enrollments')

           const enrollments = response.data.enrollments

           this.setState({ enrollments })

         } else {
           console.log('no enrollments data found', response.data.message)
         }

        }).catch((error) => {
           console.log('Enrollments query did not work', error);
        });

        if (this.props.source === 'Udemy') {
          this.pullCourses(this.state.selectedSkill, this.state.priceValue, this.state.durationValue, this.state.difficultyLevelValue, null, null, null)
        } else {
          Axios.get('https://www.guidedcompass.com/api/courses', { params: { orgCode: org, isActive: true } })
          .then((response) => {
            console.log('Org courses info query attempted-----------------------------', response.data.success, org);

            if (response.data.success && response.data.courses) {
              console.log('org courses info query worked', response.data.courses.length)

              const courses = response.data.courses
              const filteredCourses = courses
              let queryOrgCourses = true
              this.setState({ courses, queryOrgCourses })

              if (this.props.pageSource === 'Goal') {
                if (this.props.competencies && this.props.competencies.length > 0) {
                  // this.getCourseMatches(this.props.selectedGoal)
                  this.pullCourses(this.props.competencies[0].name, this.state.priceValue, this.state.durationValue, this.state.difficultyLevelValue, true, org)
                } else {
                  // this.getCourseMatches(this.props.selectedGoal)
                  this.pullCourses(this.state.selectedSkill, this.state.priceValue, this.state.durationValue, this.state.difficultyLevelValue, true, org)
                }
              } else {
                this.pullCourses(this.state.selectedSkill, this.state.priceValue, this.state.durationValue, this.state.difficultyLevelValue, true, org)
              }

            } else {
              console.log('org courses info query did not work', response.data.message)

              if (this.props.pageSource === 'Goal') {
                if (this.props.competencies && this.props.competencies.length > 0) {
                  // this.getCourseMatches(this.props.selectedGoal)
                  this.pullCourses(this.props.competencies[0].name, this.state.priceValue, this.state.durationValue, this.state.difficultyLevelValue, null, null, null)
                } else {
                  // this.getCourseMatches(this.props.selectedGoal)
                  this.pullCourses(this.state.selectedSkill, this.state.priceValue, this.state.durationValue, this.state.difficultyLevelValue, null, null, null)
                }
              } else {
                this.pullCourses(this.state.selectedSkill, this.state.priceValue, this.state.durationValue, this.state.difficultyLevelValue, null, null, null)
              }
            }

          }).catch((error) => {
              console.log('org courses query did not work for some reason', error);

              if (this.props.pageSource === 'Goal') {
                if (this.props.competencies && this.props.competencies.length > 0) {
                  // this.getCourseMatches(this.props.selectedGoal)
                  this.pullCourses(this.props.competencies[0].name, this.state.priceValue, this.state.durationValue, this.state.difficultyLevelValue, null, null, null)
                } else {
                  // this.getCourseMatches(this.props.selectedGoal)
                  this.pullCourses(this.state.selectedSkill, this.state.priceValue, this.state.durationValue, this.state.difficultyLevelValue, null, null, null)
                }
              } else {
                this.pullCourses(this.state.selectedSkill, this.state.priceValue, this.state.durationValue, this.state.difficultyLevelValue, null, null, null)
              }
          });
        }
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  pullCourses(searchValue, priceValue, durationValue, difficultyLevelValue, queryOrgCourses, orgCode, filterObject) {
    console.log('pullCourses called', searchValue, priceValue, durationValue, difficultyLevelValue, queryOrgCourses, orgCode, filterObject)

    this.setState({ animating: true, errorMessage: null, successMessage: null })

    // const searchValue = 'Excel'
    if (!searchValue) {
      searchValue = this.state.selectedSkill
    }
    const categoryValue = null
    const subcategoryValue = null
    // let priceValue = this.state.priceValue
    if (!priceValue) {
      priceValue = this.state.priceValue
    }
    let ratingValue = null
    if (!ratingValue) {
      ratingValue = 3.0
    }
    // let durationValue = this.state.durationValue
    if (!durationValue) {
      durationValue = this.state.durationValue
    }

    if (difficultyLevelValue && difficultyLevelValue.toLowerCase()) {
      difficultyLevelValue = difficultyLevelValue.toLowerCase()
    }

    Axios.get('https://www.guidedcompass.com/api/courses/search', { params: { searchValue, categoryValue, subcategoryValue, priceValue, ratingValue, durationValue, difficultyLevelValue, queryOrgCourses, orgCode, filterObject, isActive: true } })
    .then((response) => {
      console.log('Courses query attempted');

        if (response.data.success) {
          console.log('successfully retrieved courses')

          if (response.data.responseData) {

            const courses = response.data.responseData.results
            const filteredCourses = courses
            this.setState({ courses, filteredCourses, animating: false })
          }

        } else {
          console.log('no course data found', response.data.message)
          this.setState({ animating: false, errorMessage: 'Found no courses that match the criteria'})
        }

    }).catch((error) => {
        console.log('Course query did not work', error);
        this.setState({ animating: false, errorMessage: 'There was an unknown error retrieving the courses'})
    });
  }

  formChangeHandler = (eventName,eventValue) => {
    console.log('formChangeHandler called', eventName, eventValue)

    if (eventName === 'search') {
      console.log('in search')
      const searchString = eventValue
      this.setState({ searchString, animating: true })
      this.filterResults(eventValue, '', null, null, true)
    } else if (eventName === 'searchReferees') {
      const searchString = eventValue
      this.setState({ searchString, animating: true })
      this.filterResults(eventValue, '', null, null, true, 'referee')
    } else if (eventName.includes('filter|')) {

      if (this.state.showFilters) {
        const nameArray = eventName.split("|")
        if (nameArray[1] === 'price') {
          const priceValue = eventValue
          this.setState({ priceValue, selectedValue: eventValue })
          this.pullCourses(this.state.selectedSkill, priceValue.toLowerCase(), this.state.durationValue, this.state.difficultyLevelValue, this.state.queryOrgCourses, this.state.org)
        } else if (nameArray[1] === 'duration') {
          let durationValue = eventValue
          this.setState({ durationValue, selectedValue: eventValue })

          if (durationValue === 'Extra Long') {
            durationValue = 'extraLong'
          } else {
            durationValue = durationValue.toLowerCase()
          }
          this.pullCourses(this.state.selectedSkill, this.state.priceValue, durationValue, this.state.difficultyLevelValue, this.state.queryOrgCourses, this.state.org)
        } else if (nameArray[1] === 'difficultyLevel') {
          const difficultyLevelValue = eventValue
          this.setState({ difficultyLevelValue, selectedValue: eventValue })
          this.pullCourses(this.state.selectedSkill, this.state.priceValue, this.state.durationValue, difficultyLevelValue, this.state.queryOrgCourses, this.state.org)
        } else {
          this.setState({ [nameArray[1]]: eventValue, selectedValue: eventValue })
          // console.log('show me: ', this.state.degreeType)
          let filterObject = {
            selectedSkill: this.state.selectedSkill,
            priceValue: this.state.priceValue,
            durationValue: this.state.durationValue,
            difficultyLevelValue: this.state.difficultyLevelValue
          }

          filterObject[nameArray[1]] = eventValue

          this.pullCourses(this.state.selectedSkill, this.state.priceValue, this.state.durationValue, eventValue, this.state.queryOrgCourses, this.state.org, filterObject)
        }
      } else {

        let filters = this.state.itemFilters

        const nameArray = eventName.split("|")
        const field = nameArray[1]

        let index = 0
        for (let i = 1; i <= filters.length; i++) {
          if (filters[i - 1].name === field) {
            filters[i - 1]['value'] = eventValue
            index = i - 1
          }
        }

        let itemFilters = filters

        //reset everything
        let searchString = ''
        for (let i = 1; i <= itemFilters.length; i++) {
          if (itemFilters[i - 1].name !== field) {
            itemFilters[i - 1]['value'] = this.state.defaultFilterOption
          }
        }
        let itemSorters = this.state.itemSorters
        for (let i = 1; i <= itemSorters.length; i++) {
          itemSorters[i - 1]['value'] = this.state.defaultSortOption
        }

        this.setState({ filters, itemFilters, animating: true, searchString, itemSorters })

        this.filterResults(this.state.searchString, eventValue, filters, index, false)
      }

    } else if (eventName.includes('sort|')) {

      if (this.state.showFilters) {

      } else {
        let sorters = this.state.itemSorters

        const nameArray = eventName.split("|")
        const field = nameArray[1]

        // let index = 0
        for (let i = 1; i <= sorters.length; i++) {
          if (sorters[i - 1].name === field) {
            sorters[i - 1]['value'] = eventValue
            // index = i - 1
          }
        }

        let itemSorters = sorters

        //reset everything
        let searchString = ''
        let itemFilters = this.state.itemFilters
        for (let i = 1; i <= itemFilters.length; i++) {
          itemFilters[i - 1]['value'] = this.state.defaultFilterOption
        }

        for (let i = 1; i <= itemSorters.length; i++) {
          if (itemSorters[i - 1].name !== field) {
            itemSorters[i - 1]['value'] = this.state.defaultSortOption
          }
        }

        this.setState({ searchString, itemFilters, itemSorters, animating: true })

        this.sortResults(eventValue, field)
      }

    } else if (eventName === 'pathway') {

      let selectedPathway = eventValue
      let largestSkillGaps = []

      for (let i = 1; i <= this.state.pathwayOptions.length; i++) {
        if (this.state.pathwayOptions[i - 1].name === eventValue) {
          for (let j = 1; j <= this.state.pathwayOptions[i - 1].skills.length; j++) {
            // console.log('show the title: ', this.state.pathwayOptions[i - 1].skillTraits[j - 1])
            largestSkillGaps.push(this.state.pathwayOptions[i - 1].skills[j - 1].name)
          }
        }
      }

      this.setState({ selectedPathway, largestSkillGaps })
    } else if (eventName === 'goalType') {
      let goalType = { name: '' }
      for (let i = 1; i <= this.state.goalTypeOptions.length; i++) {
        if (this.state.goalTypeOptions[i - 1].description === eventValue) {
          goalType = this.state.goalTypeOptions[i - 1]
        }
      }
      this.setState({ goalType })
      if (goalType.name === 'Basics' || goalType.name === 'Stability' || goalType.name === 'Pay' || goalType.name === 'Interests') {
        this.addLearningObjectiveOptions(null, goalType.name.toLowerCase(), eventName)
      }
    } else if (eventName === 'entrepreneurshipGoal') {
      this.setState({ entrepreneurshipGoal: eventValue })
      this.addLearningObjectiveOptions(eventValue, 'entrepreneurship', eventName)
    } else if (eventName === 'entrepreneurshipIndustry') {
      this.setState({ entrepreneurshipIndustry: eventValue })
      this.addLearningObjectiveOptions(eventValue, 'entrepreneurship', eventName)
    } else if (eventName === 'targetDate') {
      this.setState({ targetDate: eventValue })
    } else if (eventName === 'intensity') {
      this.setState({ intensity: eventValue })
    } else if (eventName === 'budget') {
      this.setState({ budget: eventValue })
    } else if (eventName === 'searchCareers') {
      this.searchItems(eventValue, 'career')
    } else if (eventName === 'searchOpportunities') {
      this.searchItems(eventValue, 'opportunity')
    } else {
      this.setState({ [eventName]: eventValue })
    }
  }

  searchItems(searchString, type) {
    console.log('searchItems called', searchString, type)

    if (type === 'career') {
      if (!searchString || searchString === '') {
        this.setState({ searchString, searchIsAnimating: false, careerOptions: null })
      } else {
        this.setState({ searchString, searchIsAnimating: true })

        const search = true

        const self = this
        function officiallyFilter() {
          console.log('officiallyFilter called')

          const excludeMissingOutlookData = true
          const excludeMissingJobZone = true

          Axios.put('https://www.guidedcompass.com/api/careers/search', {  searchString, search, excludeMissingOutlookData, excludeMissingJobZone })
          .then((response) => {
            console.log('Careers query attempted', response.data);

              if (response.data.success) {
                console.log('successfully retrieved careers')

                if (response.data) {

                  let careerOptions = []
                  if (response.data.careers && response.data.careers.length > 0) {
                    careerOptions = response.data.careers
                  }

                  self.setState({ careerOptions, searchIsAnimating: false })
                }

              } else {
                console.log('no career data found', response.data.message)
                self.setState({ searchIsAnimating: false })
              }

          }).catch((error) => {
              console.log('Career query did not work', error);
              self.setState({ searchIsAnimating: false })
          });
        }

        const delayFilter = () => {
          console.log('delayFilter called: ')
          clearTimeout(self.state.timerId)
          self.state.timerId = setTimeout(officiallyFilter, 1000)
        }

        delayFilter();
      }
    } else if (type === 'opportunity') {
      if (!searchString || searchString === '') {
        this.setState({ searchStringOpportunities: searchString, searchIsAnimating: false, careerOptions: null })
      } else {
        this.setState({ searchStringOpportunities: searchString, searchIsAnimating: true })

        const self = this
        function officiallyFilter() {
          console.log('officiallyFilter called')

          const orgCode = self.state.org
          const placementPartners = self.state.placementPartners
          const accountCode = self.state.accountCode
          const search = true
          const postTypes = ['Internship','Work','Assignment','Problem','Challenge']

          Axios.get('https://www.guidedcompass.com/api/postings/search', { params: { searchString, orgCode, placementPartners, accountCode, search, postTypes } })
          .then((response) => {
            console.log('Opportunity search query attempted');

              if (response.data.success) {
                console.log('opportunity search query worked')

                let opportunityOptions = response.data.postings
                self.setState({ opportunityOptions, searchIsAnimating: false })

              } else {
                console.log('opportunity search query did not work', response.data.message)

                let opportunityOptions = []
                self.setState({ opportunityOptions, searchIsAnimating: false })

              }

          }).catch((error) => {
              console.log('Search query did not work for some reason', error);
              self.setState({ searchIsAnimating: false })
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

  filterResults(searchString, filterString, filters, index, search, searchType) {
    console.log('filterResults called', searchString, filterString, filters, index, search, searchType)

    if (searchType === 'referee') {

      const orgCode = this.state.org

      const self = this
      function officiallyFilter() {
        console.log('officiallyFilter called')
        self.setState({ animating: true, errorMessage: null, successMessage: null })

        Axios.get('https://www.guidedcompass.com/api/members/search', { params: { searchString, orgCode } })
        .then((response) => {
          console.log('Members query attempted');

            if (response.data.success) {
              console.log('successfully retrieved members')

              let memberOptions = null
              if (response.data.members) {
                memberOptions = response.data.members
              }

              self.setState({ memberOptions, animating: false })

            } else {
              console.log('no course data found', response.data.message)
              self.setState({ animating: false, errorMessage: 'No courses were found that match that criteria' })
            }

        }).catch((error) => {
            console.log('Course query did not work', error);
            self.setState({ animating: false, errorMessage: 'Course query did not work for an unknown reason'})
        });
      }

      const delayFilter = () => {
        console.log('delayFilter called: ')
        clearTimeout(self.state.timerId)
        self.state.timerId = setTimeout(officiallyFilter, 1000)
      }

      delayFilter();

    } else {

      const categoryValue = null
      const subcategoryValue = null
      const priceValue = this.state.priceValue
      let ratingValue = null
      if (!ratingValue) {
        ratingValue = 3.0
      }

      const durationValue = this.state.durationValue
      let difficultyLevelValue = this.state.difficultyLevelValue
      if (difficultyLevelValue) {
        difficultyLevelValue = difficultyLevelValue.toLowerCase()
      }

      const queryOrgCourses = this.state.queryOrgCourses
      const orgCode = this.state.org
      const filterObject = {
        selectedSkill: this.state.selectedSkill,
        priceValue: this.state.priceValue,
        durationValue: this.state.durationValue,
        difficultyLevelValue: this.state.difficultyLevelValue
      }

      const self = this
      function officiallyFilter() {
        console.log('officiallyFilter called')

        self.setState({ animating: true, errorMessage: null, successMessage: null })

        Axios.get('https://www.guidedcompass.com/api/courses/search', { params: { searchValue: searchString, categoryValue, subcategoryValue, priceValue, ratingValue, durationValue, difficultyLevelValue, queryOrgCourses, orgCode, filterObject, isActive: true } })
        .then((response) => {
          console.log('Courses query attempted');

            if (response.data.success) {
              console.log('successfully retrieved courses')

              if (response.data.responseData) {

                const courses = response.data.responseData.results
                const filteredCourses = courses
                self.setState({ courses, filteredCourses, animating: false })
              }

            } else {
              console.log('no course data found', response.data.message)
              self.setState({ animating: false, errorMessage: 'No courses were found that match that criteria' })
            }

        }).catch((error) => {
            console.log('Course query did not work', error);
            self.setState({ animating: false, errorMessage: 'Course query did not work for an unknown reason'})
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

  sortResults(sortString, sortName) {
    console.log('sortResults called', sortString, sortName)


  }


  renderManipulators(type) {
    console.log('renderManipulators called')

    if (type === 'filter') {
      let filters = this.state.itemFilters
      console.log('show filters: ', filters)

      if (filters) {

        let rows = []
        for (let i = 1; i <= filters.length; i++) {
          rows.push(
            <View key={filters[i - 1] + i.toString()}>
              <View>
                <View style={[styles.row10]}>
                  <View>
                    <View>
                      <View style={[styles.spacer]} />
                      <Text style={[styles.standardText,styles.descriptionTextColor]}>{filters[i - 1].name}</Text>
                    </View>
                    <View>
                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Filter', selectedIndex: i - 1, selectedName: "filter|" + filters[i - 1].name, selectedValue: filters[i - 1].value, selectedOptions: filters[i - 1].options, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn115]}>
                              <Text style={[styles.descriptionText1]}>{filters[i - 1].value}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={filters[i - 1].value}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("filter|" + filters[i - 1].name,itemValue)
                            }>
                            {filters[i - 1].options.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              </View>
            </View>
          )
        }

        return rows

      }
    } else if (type === 'sort') {
      let sorters = this.state.itemSorters
      console.log('show sorters: ', sorters)

      if (sorters) {

        let rows = []
        for (let i = 1; i <= sorters.length; i++) {
          rows.push(
            <View key={sorters[i - 1] + i.toString()}>
              <View>
                <View style={[styles.row10]}>
                  <View>
                    <View>
                      <View style={[styles.spacer]} />
                      <Text style={[styles.standardText,styles.descriptionTextColor]}>{sorters[i - 1].name}</Text>
                    </View>
                    <View>

                      {(Platform.OS === 'ios') ? (
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Sort', selectedIndex: i - 1, selectedName: "sort|" + sorters[i - 1].name, selectedValue: sorters[i - 1].value, selectedOptions: sorters[i - 1].options, selectedSubKey: null })}>
                          <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                            <View style={[styles.calcColumn115]}>
                              <Text style={[styles.descriptionText1]}>{sorters[i - 1].value}</Text>
                            </View>
                            <View style={[styles.width20,styles.topMargin5]}>
                              <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      ) : (
                        <View style={[styles.standardBorder]}>
                          <Picker
                            selectedValue={sorters[i - 1].value}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("sort|" + sorters[i - 1].name,itemValue)
                            }>
                            {sorters[i - 1].options.map(value => <Picker.Item key={value} label={value} value={value} />)}
                          </Picker>
                        </View>
                      )}
                    </View>

                  </View>
                </View>
              </View>
            </View>
          )
        }

        return rows

      }
    }
  }

  toggleSearchBar(action) {
    console.log('toggleSearchBar called ', action)

    let showingSearchBar = this.state.showingSearchBar
    if (showingSearchBar) {
      showingSearchBar = false
    } else {
      showingSearchBar = true
    }

    this.setState({ showingSearchBar })
  }

  searchItemClicked(passedItem, type) {
    console.log('searchItemClicked called', passedItem, type)

    if (type === 'career') {

      const searchObject = passedItem
      const searchString = passedItem.name
      const unready = false
      const careerOptions = null

      this.setState({ searchObject, searchString, unready, careerOptions })

    } else if (type === 'opportunity') {
      const searchObject = passedItem
      let searchStringOpportunities = passedItem.name
      if (passedItem.title) {
        searchStringOpportunities = passedItem.title
      }
      const unready = false
      const opportunityOptions = null
      console.log('show searchString: ', searchStringOpportunities)

      this.setState({ searchObject, searchStringOpportunities, unready, opportunityOptions })
    } else if (type === 'referee') {
      const searchObject = passedItem
      let searchString = passedItem.firstName + ' ' + passedItem.lastName
      let memberOptions = null
      this.setState({ searchObject, searchString, memberOptions })
    }
  }

  renderTags(type) {
    console.log('renderTags ', type, this.state.selectedCareer)

    if (type === 'career') {
      const favoritedCareers = this.state.favoritedCareers

      if (favoritedCareers && favoritedCareers.length > 0) {

        return (
          <View key={"favoritedCareers"}>
            <View style={[styles.spacer]} />

            <View style={[styles.rowDirection,styles.flexWrap]}>
              {favoritedCareers.map((value, optionIndex) =>
                <View key={"career|" + optionIndex}>

                  <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                    <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                      <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity style={[styles.rightPadding5]} onPress={() => this.addLearningObjectiveOptions(this.state.favoritedCareerDetails[optionIndex], type)}>
                    <View style={[styles.halfSpacer]} />
                    <View style={(this.state.selectedCareer === value) ? [styles.tagContainerBasic,styles.ctaBackgroundColor,styles.flexCenter] : [styles.tagContainerBasic,styles.mediumBackground,styles.flexCenter]}>
                      <Text style={[styles.descriptionText2,styles.whiteColor]}>{value}</Text>
                    </View>
                    <View style={[styles.halfSpacer]} />
                  </TouchableOpacity>

                </View>
              )}
            </View>

          </View>
        )
      }
    } else if (type === 'opportunity') {
      const favoritedOpportunities = this.state.favoritedOpportunities
      if (favoritedOpportunities && favoritedOpportunities.length > 0) {
        console.log('about to in', favoritedOpportunities)
        return (
          <View key={"favoritedOpportunities"}>
            <View style={[styles.spacer]} />

            <View style={[styles.rowDirection,styles.flexWrap]}>
              {favoritedOpportunities.map((value, optionIndex) =>
                <View key={"career|" + optionIndex}>

                  <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                    <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                      <Image source={{ uri: deniedIcon}}  style={[styles.square20,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                  <TouchableOpacity style={[styles.rightPadding5]} onPress={() => this.addLearningObjectiveOptions(this.state.favoritedOpportunityDetails[optionIndex], type)}>
                    <View style={[styles.halfSpacer]} />
                    <View style={(this.state.selectedOpportunity === value) ? [styles.tagContainerBasic,styles.ctaBackgroundColor,styles.flexCenter] : [styles.tagContainerBasic,styles.mediumBackground,styles.flexCenter]}>
                      <Text style={[styles.descriptionText2]}>{value}</Text>
                    </View>
                    <View style={[styles.halfSpacer]} />
                  </TouchableOpacity>

                </View>
              )}
            </View>

          </View>
        )
      }
    } else if (type === 'learningObjective') {
      // console.log('in learningObjective', this.state.learningObjectives)
      // abilities, knowledge, , soft skill, hard skil, tech skill
      const learningObjectives = this.state.learningObjectives

      if (learningObjectives && learningObjectives.length > 0) {
        console.log('compare 0')
        return (
          <View key={"learningObjectives"}>
            <View style={[styles.spacer]} />

            <View style={[styles.rowDirection,styles.flexWrap]}>
              {learningObjectives.map((value, optionIndex) =>
                <View key={"career|" + optionIndex}>

                  <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                    <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                      <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <View style={[styles.halfSpacer]} />

                    <View style={[styles.rowDirection,styles.flexWrap]}>
                      {(value.category === 'Ability') && (
                        <View style={[styles.tagContainerBasic,styles.primaryBackground]}>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</Text>
                        </View>
                      )}
                      {(value.category === 'Knowledge') && (
                        <View style={[styles.tagContainerBasic,styles.secondaryBackground]}>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</Text>
                        </View>
                      )}
                      {(value.category === 'Soft Skill') && (
                        <View style={[styles.tagContainerBasic,styles.tertiaryBackground]}>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</Text>
                        </View>
                      )}
                      {(value.category === 'General Hard Skill') && (
                        <View style={[styles.tagContainerBasic,styles.quaternaryBackground]}>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</Text>
                        </View>
                      )}
                      {(value.category === 'Tech Skill') && (
                        <View style={[styles.tagContainerBasic,styles.quinaryBackground]}>
                          <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</Text>
                        </View>
                      )}
                    </View>

                    <View style={[styles.halfSpacer]} />
                  </View>

                </View>
              )}
            </View>

          </View>
        )

      } else {
        return (
          <View key={"learningObjectives"} style={[styles.topPadding20]}>
            <Text style={[styles.descriptionText2,styles.errorColor]}>Specify a career path or opportunity above for learning objectives to populate.</Text>
          </View>
        )
      }
    } else if (type === 'referees') {
      console.log('in referees', this.state.referees)

      const referees = this.state.referees
      if (referees && referees.length > 0) {
        // console.log('about to in', favoritedOpportunities)
        return (
          <View key={"referees"}>
            <View style={[styles.spacer]} />

            <View style={[styles.rowDirection,styles.flexWrap]}>
              {referees.map((value, optionIndex) =>
                <View key={"career|" + optionIndex}>

                  <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                    <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                      <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.rightPadding5]}>
                    <View style={[styles.halfSpacer]} />
                    <View style={[styles.tagContainerBasic,sstyles.mediumBackground]}>
                      <Text style={[styles.descriptionText2,styles.whiteColor]}>{value.firstName} {value.lastName}</Text>
                    </View>
                    <View style={[styles.halfSpacer]} />
                  </View>

                </View>
              )}
            </View>

          </View>
        )
      }
    }
  }

  removeTag(index, type) {
    console.log('removeTag called', index, type)

    if (type === 'career') {
      let favoritedCareers = this.state.favoritedCareers
      favoritedCareers.splice(index, 1)

      let favoritedCareerDetails = this.state.favoritedCareerDetails
      const careerToRemove = favoritedCareerDetails[index]
      favoritedCareerDetails.splice(index, 1)
      this.setState({ favoritedCareers, favoritedCareerDetails })

      // remove as favorite
      this.favoriteItem(careerToRemove, type)
    } else if (type === 'opportunity') {
      let favoritedOpportunities = this.state.favoritedOpportunities
      favoritedOpportunities.splice(index, 1)

      let favoritedOpportunityDetails = this.state.favoritedOpportunityDetails
      const opportunityToRemove = favoritedOpportunityDetails[index]
      favoritedOpportunityDetails.splice(index, 1)
      this.setState({ favoritedOpportunities, favoritedOpportunityDetails })

      // remove as favorite
      this.favoriteItem(opportunityToRemove, type)
    } else if (type === 'learningObjective') {
      let learningObjectives = this.state.learningObjectives
      learningObjectives.splice(index, 1)
      this.setState({ learningObjectives })
    } else if (type === 'referees') {
      let referees = this.state.referees
      referees.splice(index, 1)
      this.setState({ referees })
    }
  }

  addItem(type) {
    console.log('addItem called', type)

    if (type === 'career') {
      if (this.state.favoritedCareers.includes(this.state.searchString)) {
        this.setState({ errorMessage: 'You have already added this career' })
      } else {

        const searchString = ''
        const searchObject = null
        const unready = true

        let favoritedCareers = this.state.favoritedCareers
        favoritedCareers.unshift(this.state.searchString)

        let favoritedCareerDetails = this.state.favoritedCareerDetails
        favoritedCareerDetails.unshift(this.state.searchObject)

        // const selectedCareer = this.state.searchString

        this.setState({ searchString, searchObject, unready, favoritedCareers, errorMessage: null })

        // favorite item
        this.favoriteItem(this.state.searchObject, type)
        // console.log('pre-add learning: ', this.state.searchObject)
        // populate chart
        this.addLearningObjectiveOptions(this.state.searchObject,type)
      }
    } else if (type === 'opportunity') {
      if (this.state.favoritedOpportunities.includes(this.state.searchStringOpportunities)) {
        this.setState({ errorMessage: 'You have already added this opportunity' })
      } else {

        const searchStringOpportunities = ''
        const searchObject = null
        const unready = true

        let favoritedOpportunities = this.state.favoritedOpportunities
        favoritedOpportunities.unshift(this.state.searchStringOpportunities)

        let favoritedOpportunityDetails = this.state.favoritedOpportunityDetails
        favoritedOpportunityDetails.unshift(this.state.searchObject)

        this.setState({ searchStringOpportunities, searchObject, unready, favoritedOpportunities, errorMessage: null })

        // favorite item
        this.favoriteItem(this.state.searchObject, type)

        // populate chart
        this.addLearningObjectiveOptions(this.state.searchObject,type)
      }
    } else if (type === 'goalDate') {
    } else if (type === 'referee') {
      let referees = this.state.referees
      referees.push(this.state.searchObject)

      let searchString = ''
      let searchObject = null
      this.setState({ referees, searchString, searchObject })

    }
  }

  addLearningObjectiveOptions(selectedItem, type, subType) {
    console.log('addLearningObjectiveOptions called', selectedItem, type)

    if (type === 'career') {
      const selectedCareer = selectedItem.name

      let learningObjectives = []
      // console.log('in career: ')
      if (selectedItem.abilitiesArray) {
        for (let i = 1; i <= selectedItem.abilitiesArray.length; i++) {
          learningObjectives.push({
            category: 'Ability',
            name: selectedItem.abilitiesArray[i - 1].category,
            description: selectedItem.abilitiesArray[i - 1].subcategories.toString(),
          })
        }
      }
      if (selectedItem.knowledgeArray) {
        for (let i = 1; i <= selectedItem.knowledgeArray.length; i++) {
          learningObjectives.push({
            category: 'Knowledge',
            name: selectedItem.knowledgeArray[i - 1].category,
            description: selectedItem.knowledgeArray[i - 1].subcategories.toString(),
          })
        }
      }
      if (selectedItem.personalityData && selectedItem.personalityData.workStyles) {
        for (let i = 1; i <= selectedItem.personalityData.workStyles.length; i++) {
          learningObjectives.push({
            category: 'Soft Skill',
            name: selectedItem.personalityData.workStyles[i - 1],
          })
        }
      }
      if (selectedItem.skillsArray) {
        for (let i = 1; i <= selectedItem.skillsArray.length; i++) {
          learningObjectives.push({
            category: 'General Hard Skill',
            name: selectedItem.skillsArray[i - 1].category,
            description: selectedItem.skillsArray[i - 1].subcategories.toString(),
          })
        }
      }
      if (selectedItem.technologyArray) {
        for (let i = 1; i <= selectedItem.technologyArray.length; i++) {
          learningObjectives.push({
            category: 'Tech Skill',
            name: selectedItem.technologyArray[i - 1].name,
            description: selectedItem.technologyArray[i - 1].examples.toString(),
          })
        }
      }
      console.log('show learningObjectives: ')
      this.setState({ selectedCareer, learningObjectives })
    } else if (type === 'opportunity') {
      let selectedOpportunity = null
      if (selectedItem.title && selectedItem.title !== '') {
        selectedOpportunity = selectedItem.title
      } else {
        selectedOpportunity = selectedItem.name
      }

      this.setState({ searchIsAnimating: true })

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

            let learningObjectives = []
            if (response.data.benchmark && response.data.benchmark.skills) {
              for (let i = 1; i <= response.data.benchmark.skills.length; i++) {

                let category = response.data.benchmark.skills[i - 1].skillType
                if (response.data.benchmark.skills[i - 1].skillType === 'Hard Skill') {
                  category = 'General Hard Skill'
                }

                const name = response.data.benchmark.skills[i - 1].title
                const description = response.data.benchmark.skills[i - 1].description
                console.log('show the learningObjecive: ', i, category, name, description)
                learningObjectives.push({ category, name, description })
              }
            }

            this.setState({ selectedOpportunity, learningObjectives, searchIsAnimating: false })

          } else {
            console.log('no benchmarks by id data found', response.data.message)

            this.setState({ selectedOpportunity, searchIsAnimating: false })
          }

      }).catch((error) => {
          console.log('Benchmarks query by id did not work', error);
          this.setState({ selectedOpportunity, searchIsAnimating: false })
      });
    } else if (type === 'entrepreneurship') {
      let learningObjectives = []
      let entrepreneurshipGoal = this.state.entrepreneurshipGoal
      let entrepreneurshipIndustry = this.state.entrepreneurshipIndustry

      if (subType === 'entrepreneurshipGoal') {
        entrepreneurshipGoal = selectedItem
      } else if (subType === 'entrepreneurshipIndustry') {
        entrepreneurshipIndustry = selectedItem
      }

      learningObjectives.push({ category: 'Ability', name: 'Entrepreneurship' })
      learningObjectives.push({ category: 'Soft Skill', name: 'Time Management' })
      learningObjectives.push({ category: 'General Hard Skill', name: 'Strategic Thinking' })
      learningObjectives.push({ category: 'Soft Skill', name: 'Efficiency' })
      learningObjectives.push({ category: 'Soft Skill', name: 'Resilience' })
      learningObjectives.push({ category: 'Soft Skill', name: 'Communication' })
      learningObjectives.push({ category: 'Soft Skill', name: 'Sales' })
      console.log('show entrepreneurshipGoal: ', entrepreneurshipGoal)
      if (entrepreneurshipGoal && entrepreneurshipGoal !== '') {
        learningObjectives.push({ category: 'General Hard Skill', name: entrepreneurshipGoal })
      }
      if (entrepreneurshipIndustry && entrepreneurshipIndustry !== '') {
        learningObjectives.push({ category: 'Knowledge', name: entrepreneurshipIndustry })
      }

      this.setState({ learningObjectives })
    } else if (type === 'basics') {
      let learningObjectives = []

      learningObjectives.push({ category: 'Soft Skill', name: 'Organize' })
      learningObjectives.push({ category: 'Soft Skill', name: 'Leadership' })
      learningObjectives.push({ category: 'Soft Skill', name: 'Conflict Management' })
      learningObjectives.push({ category: 'Soft Skill', name: 'Decision Making' })
      learningObjectives.push({ category: 'Soft Skill', name: 'Time Management' })
      learningObjectives.push({ category: 'Soft Skill', name: 'Communication' })
      learningObjectives.push({ category: 'Tech Skill', name: 'Microsoft Office / Google Suite' })
      learningObjectives.push({ category: 'General Hard Skill', name: 'Math' })
      learningObjectives.push({ category: 'General Hard Skill', name: 'Writing' })

      this.setState({ learningObjectives })
    } else if (type === 'stability' || type === 'pay' || type === 'interests') {

      const profile = this.state.profile

      Axios.put('https://www.guidedcompass.com/api/learning-objectives', { profile, category: type })
      .then((response) => {
        console.log('Learning objectives query attempted', response.data);

        if (response.data.success) {
          console.log('learning objectives query worked')

          const learningObjectives = response.data.learningObjectives
          this.setState({ learningObjectives })

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

  favoriteItem(item, type) {
    console.log('favoriteItem called', item, type)

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    if (type) {
      let itemId = item._id

      let favoritesArray = this.state.favorites

      if (favoritesArray.includes(itemId) || this.state.favoritedCourseDetails.some(selectedCourse => selectedCourse.url === item.url)){

        let index = favoritesArray.indexOf(itemId)
        let courseIndex = 0
        let favoritedCourseDetails = this.state.favoritedCourseDetails
        if (this.state.favoritedCourseDetails && this.state.favoritedCourseDetails.some(selectedCourse => selectedCourse.url === item.url)) {
          courseIndex = favoritedCourseDetails.findIndex(x => x.url === item.url);

          if (courseIndex > -1) {
            index = favoritesArray.indexOf(favoritedCourseDetails[courseIndex].favoriteId)
            favoritedCourseDetails.splice(courseIndex, 1);
          }

        }
        console.log('item to remove 1: ', favoritesArray, favoritesArray.length, favoritedCourseDetails.length)
        if (index > -1) {
          favoritesArray.splice(index, 1);
        }
        console.log('item to remove 2: ', favoritesArray, favoritesArray.length, favoritedCourseDetails.length)

        Axios.post('https://www.guidedcompass.com/api/favorites/save', {
          favoritesArray, emailId: this.state.emailId
        })
        .then((response) => {
          console.log('attempting to save removal from favorites')
          if (response.data.success) {
            console.log('saved removal from favorites', response.data)

            this.setState({ successMessage: 'Removed from saved favorites', favorites: favoritesArray, favoritedCourseDetails, isSaving: false })

          } else {
            console.log('did not save successfully')
            this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
          }
        }).catch((error) => {
            console.log('save did not work', error);
            this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false })
        });

      } else {

        console.log('adding item: ', favoritesArray, itemId)

        if (type === 'course') {
          // first save the course
          const courseObject = {
            source: 'Udemy', title: item.title, headline: item.headline, udemyId: item.id, url: item.url,
            image_125_H: item.image_125_H, image_240x135: item.image_240x135, image_480x270: item.image_480x270,
            is_paid: item.is_paid, price: item.price, visible_instructors: item.visible_instructors
          }

          Axios.post('https://www.guidedcompass.com/api/courses', courseObject)
          .then((response) => {
            console.log('attempting to save course')
            if (response.data.success) {
              console.log('saved course as new', response.data)
              //clear values

              itemId = response.data._id

              favoritesArray.push(itemId)
              let favoritedCourseDetails = this.state.favoritedCourseDetails
              favoritedCourseDetails.push(item)

              Axios.post('https://www.guidedcompass.com/api/favorites/save', {
                favoritesArray, emailId: this.state.emailId
              })
              .then((response) => {
                console.log('attempting to save addition to favorites')
                if (response.data.success) {
                  console.log('saved addition to favorites', response.data)

                  this.setState({
                    successMessage: 'Saved as a favorite!', favorites: favoritesArray, favoritedCourseDetails, isSaving: false
                  })

                } else {
                  console.log('did not save successfully')
                  this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
                }
              }).catch((error) => {
                  console.log('save did not work', error);
                  this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false})
              });
            } else {
              console.log('did not save successfully')

            }
          }).catch((error) => {
              console.log('save did not work', error);
              this.setState({
                serverSuccessPlan: false,
                serverErrorMessagePlan: 'there was an error saving favorites', isSaving: false
              })
          });
        } else {
          favoritesArray.push(itemId)
          Axios.post('https://www.guidedcompass.com/api/favorites/save', {
            favoritesArray, emailId: this.state.emailId
          })
          .then((response) => {
            console.log('attempting to save addition to favorites')
            if (response.data.success) {
              console.log('saved addition to favorites', response.data)

              this.setState({ successMessage: 'Saved as a favorite!', favorites: favoritesArray, isSaving: false })

            } else {
              console.log('did not save successfully')
              this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
            }
          }).catch((error) => {
              console.log('save did not work', error);
              this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false})
          });
        }
      }
    }
  }

  enrollInCourse(item, type,e,isCompleted) {
    console.log('enrollInCourse called', item, type)

    // e.preventDefault()
    // e.stopPropagation()

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    let _id = null
    let eIndex = null
    if (this.state.enrollments && this.state.enrollments.some(enrollment => enrollment.courseId === item._id)) {
      eIndex = this.state.enrollments.findIndex(enrollment => enrollment.courseId === item._id)
      _id = this.state.enrollments[eIndex]._id
    }

    if ((isCompleted) || (!_id && !isCompleted)) {
      const firstName = this.state.cuFirstName
      const lastName = this.state.cuLastName
      const email = this.state.emailId
      const username = this.state.username
      const pictureURL = this.state.pictureURL
      const courseId = item._id
      const courseImageURL = item.imageURL
      let courseName = item.name
      if (item.title) {
        courseName = item.title
      }
      const courseCategory = item.category
      const courseDegreeType = item.degreeType
      const courseSchoolName = item.schoolName
      const courseSchoolURL = item.schoolURL
      const courseDescription = item.description
      const courseEstimatedHours = item.estimatedHours
      const courseProgramMethod = item.programMethod
      const courseDifficultyLevel = item.difficultyLevel

      const orgCode = this.state.orgCode
      const orgName = this.state.orgName
      console.log('description? ', courseDescription)
      const createdAt = new Date()
      const updatedAt = new Date()

      const enrollmentObject = {
        _id, firstName, lastName, email, username, pictureURL,
        courseId, courseImageURL, courseName, courseCategory, courseDegreeType,
        courseSchoolName, courseSchoolURL, courseDescription, courseEstimatedHours, courseProgramMethod, courseDifficultyLevel,
        isCompleted, orgCode, orgName, createdAt, updatedAt
      }

      Axios.post('https://www.guidedcompass.com/api/enrollments', enrollmentObject)
      .then((response) => {
        console.log('attempting to save addition to favorites')
        if (response.data.success) {
          console.log('saved addition to favorites', response.data)

          let itemId = item._id

          let enrollments = this.state.enrollments

          if (isCompleted && eIndex > -1) {
            // enrollments[eIndex]['isCompleted'] = true

            if (enrollments) {
              enrollments.push(enrollmentObject)
            } else {
              enrollments = [enrollmentObject]
            }

            if (item.degreeType === 'Badge' || item.degreeType === 'Certificate' || item.degreeType === 'Certification') {
              // save as certificate

              const certificate = {
                courseId: item._id, name: item.name, imageURL: item.imageURL, category: item.category,
                programURL: item.programURL, schoolURL: item.schoolURL, schoolName: item.schoolName,
                degreeType: item.degreeType, programMethod: item.programMethod, location: item.location,
                estimatedHours: item.estimatedHours, description: item.description, gradeLevel: item.gradeLevel,
                knowledgeLevel: item.knowledgeLevel, functions: item.functions, pathways: item.pathways,
                price: item.price, isCompleted: true, updateCertificate: true,
                email: this.state.emailId, createdAt: new Date(), updatedAt: new Date()
              }

              Axios.post('/api/certificates', certificate)
              .then((response) => {
                console.log('attempting to post certificate')

                if (response.data.success) {
                  console.log('saved post to certificate', response.data)


                } else {
                  console.log('did not save certificate successfully')
                  this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
                }
              }).catch((error) => {
                  console.log('saving certificate did not work', error);
                  this.setState({ errorMessage: 'there was an error saving enrollment certificate', isSaving: false})
              });

            }
          } else {
            if (enrollments && enrollments.some(selectedCourse => selectedCourse.courseId === item._id)) {
              // const index = enrollments.findIndex(selectedCourse => selectedCourse.courseId === item._id)
              // enrollments.splice(index, 1)
            } else if (enrollments) {
              enrollments.push(enrollmentObject)
            } else {
              enrollments = [enrollmentObject]
            }
          }

          this.setState({ successMessage: 'Saved enrollment!', enrollments, isSaving: false })

        } else {
          console.log('did not save enrollment successfully')
          this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({ errorMessage: 'there was an error saving enrollment', isSaving: false})
      });
    } else {
      this.setState({ isSaving: false, errorMessage: 'You have already enrolled in this course/program'})
    }
  }

  deleteItem(item, parentIndex, childIndex) {
    console.log('deleteItem called', item, parentIndex, childIndex)

    let schedule = this.state.schedule
    let courses = schedule[parentIndex].courses
    courses.splice(childIndex,1)
    schedule[parentIndex]['courses'] = courses
    this.setState({ schedule })

  }

  calculateMatches(matchingView, calcMatches, newPreferences) {
    console.log('calculateMatches called', matchingView, calcMatches, newPreferences)

    if (matchingView) {

      this.setState({ matchingView: true, errorMessage: null })

      if (!this.state.profile) {
        this.setState({ animating: false, matchingView: true, errorMessage: 'Please take career assessments before receiving personalized matches' })
      } else {
        this.setState({ animating: true, modalIsOpen: false })

        const profile = this.state.profile
        const matchingCriteria = this.state.matchingCriteria
        const useCases = this.state.useCases
        const budget = this.state.budget

        const queryOrgCourses = this.state.queryOrgCourses
        const orgCode = this.state.org

        const self = this

        function officiallyCalculate() {
          console.log('officiallyCalculate called')

          // query postings on back-end
          Axios.put('https://www.guidedcompass.com/api/courses/matches', { profile, matchingCriteria, useCases, budget, queryOrgCourses, orgCode, isActive: true })
          .then((response) => {
            console.log('Course matches attempted', response.data);

              if (response.data.success) {
                console.log('course match query worked')

                const matchScores = response.data.matchScores
                const courses = response.data.courses
                const filteredCourses = response.data.courses
                self.setState({ animating: false, matchingView: true, matchScores, courses, filteredCourses })

              } else {
                console.log('Course match did not work', response.data.message)
                self.setState({ animating: false, matchingView: true, errorMessage: 'there was an error: ' + response.data.message })
              }

          }).catch((error) => {
              console.log('Course match did not work for some reason', error);
              self.setState({ animating: false, matchingView: true, errorMessage: 'there was an error' })
          });
        }

        if (newPreferences) {
          console.log('new preferences stated')

          if (this.state.totalPercent !== 100) {
            this.setState({ animating: false, modalIsOpen: true, matchingView: true, errorMessage: 'The sum of matching criteria weights must equal 100' })
          } else {
            const emailId = this.state.emailId
            const matchingPreferences = matchingCriteria
            const matchingUseCases = useCases
            const updatedAt = new Date()

            Axios.post('https://www.guidedcompass.com/api/users/profile/details', {
              emailId, matchingPreferences, matchingUseCases, updatedAt })
            .then((response) => {

              if (response.data.success) {
                console.log('successfully saved new preferences')
                officiallyCalculate()

              } else {
                console.log('request was not successful')
                officiallyCalculate()
              }
            }).catch((error) => {
                console.log('Saving the info did not work', error);
                officiallyCalculate()
            });
          }

        } else {
          officiallyCalculate()
        }
      }
    } else {
      this.setState({ matchingView: false, errorMessage: null })
    }
  }

  renderBrowseCourses(inModal) {
    console.log('renderBrowseCourses called', inModal)

    return (
      <View key="browseCourses" style={[styles.fullScreenWidth]}>
        <View style={[styles.row20]}>

          {(this.props.pageSource !== 'Goal') && (
            <View>
              <View>
                <View>
                  {(this.state.matchingView) ? (
                    <View>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.calcColumn50,styles.rowDirection]}>
                          <TouchableOpacity style={[styles.rightMargin]} onPress={() => this.setState({ modalIsOpen: true, showMatchingCriteria: true })}>
                            <View style={[styles.slightlyRoundedCorners,styles.row5,styles.horizontalPadding30,styles.ctaBackgroundColor,styles.ctaBorder]}>
                              <Text style={[styles.standardText,styles.whiteColor]}>Adjust</Text>
                            </View>
                          </TouchableOpacity>
                          <TouchableOpacity onPress={() => this.calculateMatches(false, false, false)}>
                            <View style={[styles.rightPadding,styles.standardBorder,styles.slightlyRoundedCorners,styles.row5,styles.horizontalPadding30]}>
                              <Text style={[styles.standardText,styles.ctaColor]}>Close</Text>
                            </View>
                          </TouchableOpacity>

                          <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                        </View>
                        <View style={[styles.topPadding8,styles.leftPadding3,styles.topMarginNegative3,styles.width50]}>
                          <TouchableOpacity onPress={() => this.calculateMatches(false, false, false)}>
                            <Image source={{ uri: matchIconSelected}} style={[styles.square30,styles.contain,styles.rightMargin]} />
                          </TouchableOpacity>
                        </View>
                      </View>

                      {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorMessage]}>{this.state.errorMessage}</Text>}
                    </View>
                  ) : (
                    <View>
                      <View style={[styles.fullScreenWidth,styles.row5,styles.whiteBackground,styles.standardBorder,styles.mediumShadow,styles.rowDirection,styles.horizontalPadding]}>
                        <View style={(this.state.matchingView) ? [styles.fullScreenWidth] : [styles.width45,styles.centerItem]}>
                          <TouchableOpacity style={(this.state.matchingView) ? [] : [styles.fullScreenWidth,styles.bottomPadding]} onPress={() => this.calculateMatches(true, true, false)}>
                            <Image source={(this.state.matchingView) ? {uri: matchIconSelected} : {uri: matchIcon}} style={[styles.square30,styles.contain,styles.rightMargin,styles.topMargin]} />
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.filterFieldSearch,styles.calcColumn110,styles.whiteBackground,styles.rowDirection,styles.topMargin5]}>
                          <View style={[styles.row7,styles.horizontalPadding3]}>
                            <Image source={{uri: searchIcon}} style={[styles.square17,styles.contain,styles.padding5]}/>
                          </View>

                          {(Platform.OS === 'ios') ? (
                            <View style={[styles.calcColumn140,styles.topPadding5,styles.leftPadding5]}>
                              <TextInput
                                style={[styles.descriptionText2]}
                                onChangeText={(text) => this.formChangeHandler('search',text)}
                                value={this.state.searchString}
                                placeholder={(this.state.queryOrgCourses) ? "Search " + this.state.courses.length + " training programs & courses" : "Search 10,000+ courses..."}
                                placeholderTextColor="grey"
                              />
                            </View>
                          ) : (
                            <View style={[styles.calcColumn140,styles.topPadding3,styles.leftPadding5]}>
                              <TextInput
                                style={[styles.height40,styles.descriptionText2,styles.topMarginNegative5]}
                                onChangeText={(text) => this.formChangeHandler('search', text)}
                                value={this.state.searchString}
                                placeholder="Search 10,000+ courses..."
                                placeholderTextColor="grey"
                              />
                            </View>
                          )}
                        </View>
                        <View style={[styles.width50,styles.centerItem,styles.leftMargin]}>
                          <TouchableOpacity style={[styles.fullScreenWidth,styles.bottomPadding]} onPress={() => this.toggleSearchBar('show')}>
                            <Image source={(this.state.showingSearchBar) ? {uri: filterIconSelected} : {uri: filterIcon}} style={[styles.square25,styles.contain,styles.centerItem,styles.topMargin]} />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  )}
                </View>

              </View>

              {(this.state.showingSearchBar) && (
                <View style={[styles.card,styles.topMargin20]}>
                  <View>

                  <View style={[styles.row10]}>
                    <Text style={[styles.standardText]}>Filters</Text>

                    {(this.state.queryOrgCourses) ? (
                      <View>

                          <View style={[styles.row10]}>
                            <View>
                              <View>
                                <View style={[styles.spacer]} />
                                <Text style={[styles.standardText,styles.descriptionTextColor]}>Category</Text>
                              </View>
                              <View>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Category', selectedIndex: null, selectedName: "filter|category", selectedValue: this.state.category, selectedOptions: this.state.categoryOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
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
                                        this.formChangeHandler("filter|category",itemValue)
                                      }>
                                      {this.state.categoryOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <View>
                                <View style={[styles.spacer]} />
                                <Text style={[styles.standardText,styles.descriptionTextColor]}>Degree Type</Text>
                              </View>
                              <View>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Degree Type', selectedIndex: null, selectedName: "filter|degreeType", selectedValue: this.state.degreeType, selectedOptions: this.state.degreeTypeOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
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
                                        this.formChangeHandler("filter|degreeType",itemValue)
                                      }>
                                      {this.state.degreeTypeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <View>
                                <View style={[styles.spacer]} />
                                <Text style={[styles.standardText,styles.descriptionTextColor]}>Pathway</Text>
                              </View>
                              <View>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Pathway', selectedIndex: null, selectedName: "filter|pathway", selectedValue: this.state.pathway, selectedOptions: this.state.orgPathwayOptions, selectedSubKey: 'title' })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.orgPathwayValue}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.pathway}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("filter|pathway",itemValue)
                                      }>
                                      {this.state.orgPathwayOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <View>
                                <View style={[styles.spacer]} />
                                <Text style={[styles.standardText,styles.descriptionTextColor]}>Work Function</Text>
                              </View>
                              <View>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Work Function', selectedIndex: null, selectedName: "filter|function", selectedValue: this.state.function, selectedOptions: this.state.functionOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.function}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.function}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("filter|function",itemValue)
                                      }>
                                      {this.state.functionOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <View>
                                <View style={[styles.spacer]} />
                                <Text style={[styles.standardText,styles.descriptionTextColor]}>Industry</Text>
                              </View>
                              <View>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Industry', selectedIndex: null, selectedName: "filter|industry", selectedValue: this.state.industry, selectedOptions: this.state.industryOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
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
                                        this.formChangeHandler("filter|industry",itemValue)
                                      }>
                                      {this.state.industryOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <View>
                                <View style={[styles.spacer]} />
                                <Text style={[styles.standardText,styles.descriptionTextColor]}>Teaching Method</Text>
                              </View>
                              <View>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Teaching Method', selectedIndex: null, selectedName: "filter|programMethod", selectedValue: this.state.programMethod, selectedOptions: this.state.programMethodOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.programMethod}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.programMethod}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("filter|programMethod",itemValue)
                                      }>
                                      {this.state.programMethodOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <View>
                                <View style={[styles.spacer]} />
                                <Text style={[styles.standardText,styles.descriptionTextColor]}>Price</Text>
                              </View>
                              <View>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Price', selectedIndex: null, selectedName: "filter|price", selectedValue: this.state.priceValue, selectedOptions: this.state.priceOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.priceValue}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.priceValue}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("filter|price",itemValue)
                                      }>
                                      {this.state.priceOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <View>
                                <View style={[styles.spacer]} />
                                <Text style={[styles.standardText,styles.descriptionTextColor]}>Duration</Text>
                              </View>
                              <View>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Duration', selectedIndex: null, selectedName: "filter|duration", selectedValue: this.state.durationValue, selectedOptions: this.state.durationOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.durationValue}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.durationValue}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("filter|duration",itemValue)
                                      }>
                                      {this.state.durationOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>

                          <View style={[styles.row10]}>
                            <View>
                              <View>
                                <View style={[styles.spacer]} />
                                <Text style={[styles.standardText,styles.descriptionTextColor]}>Difficulty Level</Text>
                              </View>
                              <View>
                                {(Platform.OS === 'ios') ? (
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Difficulty Level', selectedIndex: null, selectedName: "filter|difficultyLevel", selectedValue: this.state.difficultyLevelValue, selectedOptions: this.state.difficultyLevelOptions, selectedSubKey: null })}>
                                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                      <View style={[styles.calcColumn115]}>
                                        <Text style={[styles.descriptionText1]}>{this.state.difficultyLevelValue}</Text>
                                      </View>
                                      <View style={[styles.width20,styles.topMargin5]}>
                                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.standardBorder]}>
                                    <Picker
                                      selectedValue={this.state.difficultyLevelValue}
                                      onValueChange={(itemValue, itemIndex) =>
                                        this.formChangeHandler("filter|price",itemValue)
                                      }>
                                      {this.state.difficultyLevelOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                    </Picker>
                                  </View>
                                )}
                              </View>
                            </View>
                          </View>
                      </View>
                    ) : (
                      <View>
                        <View style={[styles.row10]}>
                          <View>
                            <View>
                              <View style={[styles.spacer]} />
                              <Text style={[styles.standardText,styles.descriptionTextColor]}>Price</Text>
                            </View>
                            <View>
                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Price', selectedIndex: null, selectedName: "filter|price", selectedValue: this.state.priceValue, selectedOptions: this.state.priceOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={[styles.calcColumn115]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.priceValue}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.priceValue}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("filter|price",itemValue)
                                    }>
                                    {this.state.priceOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>

                        <View style={[styles.row10]}>
                          <View>
                            <View>
                              <View style={[styles.spacer]} />
                              <Text style={[styles.standardText,styles.descriptionTextColor]}>Duration</Text>
                            </View>
                            <View>
                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Duration', selectedIndex: null, selectedName: "filter|duration", selectedValue: this.state.durationValue, selectedOptions: this.state.durationOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={[styles.calcColumn115]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.durationValue}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.durationValue}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("filter|duration",itemValue)
                                    }>
                                    {this.state.durationOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>

                        <View style={[styles.row10]}>
                          <View>
                            <View>
                              <View style={[styles.spacer]} />
                              <Text style={[styles.standardText,styles.descriptionTextColor]}>Difficulty Level</Text>
                            </View>
                            <View>
                              {(Platform.OS === 'ios') ? (
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Difficulty Level', selectedIndex: null, selectedName: "filter|difficultyLevel", selectedValue: this.state.difficultyLevelValue, selectedOptions: this.state.difficultyLevelOptions, selectedSubKey: null })}>
                                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                    <View style={[styles.calcColumn115]}>
                                      <Text style={[styles.descriptionText1]}>{this.state.difficultyLevelValue}</Text>
                                    </View>
                                    <View style={[styles.width20,styles.topMargin5]}>
                                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              ) : (
                                <View style={[styles.standardBorder]}>
                                  <Picker
                                    selectedValue={this.state.difficultyLevelValue}
                                    onValueChange={(itemValue, itemIndex) =>
                                      this.formChangeHandler("filter|price",itemValue)
                                    }>
                                    {this.state.difficultyLevelOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                  </Picker>
                                </View>
                              )}
                            </View>
                          </View>
                        </View>
                      </View>
                    )}

                  </View>

                  </View>
                </View>
              )}

              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
            </View>
          )}

          {(this.state.animating) ? (
            <View style={[styles.flex1, styles.flexCenter]}>
              <View>
                <ActivityIndicator
                   animating = {this.state.animating}
                   color = '#87CEFA'
                   size = "large"
                   style={[styles.square80, styles.centerHorizontally]}/>

                <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                <Text style={[styles.centerText,styles.ctaColor,styles.boldText,styles.standardText]}>Pulling results...</Text>

              </View>
            </View>
          ) : (
            <View style={[styles.card]}>
              {this.state.filteredCourses && this.state.filteredCourses.map((value, index) =>
                <View>
                  <View key={index}>
                    <View style={[styles.spacer]} />

                    <View style={[styles.rowDirection]}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('CourseDetails', { selectedCourse: value, courseId: value._id })} style={[styles.calcColumn120,styles.rowDirection]}>
                        <View style={[styles.width50]}>
                          {(value.matchScore) ? (
                            <View style={[styles.padding5]}>
                              <Progress.Circle progress={value.matchScore / 100} size={styles.width40.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                            </View>
                          ) : (
                            <Image source={(value.imageURL) ? { uri: value.imageURL } : (value.image_125_H) ? { uri: value.image_125_H } : { uri: courseIconBlue }} style={[styles.square40,styles.contain]}/>

                          )}

                        </View>
                        <View style={[styles.calcColumn170]}>
                          <Text style={[styles.headingText5]}>{(value.name) ? value.name : value.title}</Text>
                          {(value.schoolName) && (
                            <Text style={[styles.descriptionText3,styles.bottomMargin,styles.topMargin5]}>by {value.schoolName}</Text>
                          )}
                          <Text style={[styles.descriptionText1,styles.descriptionText1]}>{value.headline}</Text>

                          <View style={[styles.halfSpacer]} />

                          <View style={[styles.rowDirection,styles.flexWrap]}>
                            {(value.category) && (
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.rightMargin]}>
                                  <Image source={{ uri: courseIconBlue}} style={[styles.square15,styles.contain]}/>
                                </View>
                                <View style={[styles.rightMargin]}>
                                  <Text style={[styles.descriptionText3]}>{value.category}</Text>
                                </View>
                              </View>
                            )}

                            {(value.duration) && (
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.rightMargin]}>
                                  <Image source={{ uri: timeIconBlue}} style={[styles.square15,styles.contain]}/>
                                </View>
                                <View style={[styles.rightMargin]}>
                                  <Text style={[styles.descriptionText3]}>{value.duration}</Text>
                                </View>
                              </View>
                            )}

                            {(value.estimatedHours) && (
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.rightMargin]}>
                                  <Image source={{ uri: timeIconBlue}} style={[styles.square15,styles.contain]}/>
                                </View>
                                <View style={[styles.rightMargin]}>
                                  <Text style={[styles.descriptionText3]}>{value.estimatedHours}</Text>
                                </View>
                              </View>
                            )}

                            {(value.price) && (
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.rightMargin]}>
                                  <Image source={{ uri: moneyIconBlue}} style={[styles.square15,styles.contain]}/>
                                </View>
                                <View style={[styles.rightMargin]}>
                                  <Text style={[styles.descriptionText3]}>{(value.price && value.price.startsWith('$')) ? value.price : '$' + value.price}</Text>
                                </View>
                              </View>
                            )}

                            {(value.degreeType) && (
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.rightMargin]}>
                                  <Image source={{ uri: ratingsIconBlue}} style={[styles.square15,styles.contain]}/>
                                </View>
                                <View style={[styles.rightMargin]}>
                                  <Text style={[styles.descriptionText3]}>{value.degreeType}</Text>
                                </View>
                              </View>
                            )}

                            {(value.programMethod) && (
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.rightMargin]}>
                                  <Image source={{ uri: profileIconBlue}} style={[styles.square15,styles.contain]}/>
                                </View>
                                <View style={[styles.rightMargin]}>
                                  <Text style={[styles.descriptionText3]}>{value.programMethod}</Text>
                                </View>
                              </View>
                            )}

                            {(value.gradeLevel) && (
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.rightMargin]}>
                                  <Image source={{ uri: profileIconBlue}} style={[styles.square15,styles.contain]}/>
                                </View>
                                <View style={[styles.rightMargin]}>
                                  <Text style={[styles.descriptionText3]}>{value.gradeLevel}</Text>
                                </View>
                              </View>
                            )}

                            {(value.difficultyLevel) && (
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.rightMargin]}>
                                  <Image source={{ uri: difficultyIconBlue}} style={[styles.square15,styles.contain]}/>
                                </View>
                                <View style={[styles.rightMargin]}>
                                  <Text style={[styles.descriptionText3]}>{value.difficultyLevel ? value.difficultyLevel : "Beginner"}</Text>
                                </View>
                              </View>
                            )}

                            {(value.rating && value.ratingCount) && (
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.rightMargin]}>
                                  <Image source={{ uri: ratingsIconBlue}} style={[styles.square15,styles.contain]}/>
                                </View>
                                <View style={[styles.rightMargin]}>
                                  <Text style={[styles.descriptionText3]}>{value.rating} / 5.0 - {value.ratingCount} Ratings</Text>
                                </View>
                              </View>
                            )}

                            {(value.studentCount) && (
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.rightMargin]}>
                                  <Image source={{ uri: profileIconBlue}} style={[styles.square15,styles.contain]}/>
                                </View>
                                <View style={[styles.rightMargin]}>
                                  <Text style={[styles.descriptionText3]}>{value.studentCount} Students</Text>
                                </View>
                              </View>
                            )}
                          </View>

                          <View style={[styles.halfSpacer]} />
                        </View>
                      </TouchableOpacity>

                      <View style={[styles.rowDirection,styles.width60]}>
                        <View style={[styles.width30,styles.topMargin5,styles.alignCenter]} >
                          {(value.source === 'Udemy' && !value.orgCode) ? (
                            <TouchableOpacity onPress={() => this.markCompleted(value, 'course')}>
                              <Image source={(this.state.completions.includes(value._id) || this.state.completedCourseDetails.some(selectedCourse => selectedCourse.url === value.url)) ? { uri: checkboxChecked} : { uri: checkmarkDarkGreyIcon}} style={[styles.square15,styles.contain]}/>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity onPress={(e) => this.enrollInCourse(value,'course',e,true)}>
                              <Image source={(this.state.enrollments && this.state.enrollments.some(enrollment => enrollment.courseId === value._id && enrollment.isCompleted && value._id)) ? { uri: checkboxChecked} : { uri: checkmarkDarkGreyIcon}} style={[styles.square15,styles.contain]}/>
                            </TouchableOpacity>
                          )}

                          {(value.source === 'Udemy' && !value.orgCode) ? (
                            <TouchableOpacity style={[styles.topMargin]} disabled={this.state.isSaving} onPress={() => this.favoriteItem(value,'course') }>
                              <Image source={(this.state.favorites.includes(value._id) || this.state.favoritedCourseDetails.some(selectedCourse => selectedCourse.url === value.url)) ? { uri: favoritesIconBlue} : { uri: favoritesIconDark}} style={[styles.square15,styles.contain]}/>
                            </TouchableOpacity>
                          ) : (
                            <TouchableOpacity style={[styles.topMargin]} disabled={this.state.isSaving} onPress={() => this.enrollInCourse(value,'course') }>
                              <Image source={(this.state.enrollments && this.state.enrollments.some(enrollment => enrollment.courseId === value._id && value._id)) ? { uri: addLessonIconBlue} : { uri: addLessonIconDark}} style={[styles.square15,styles.contain]}/>
                            </TouchableOpacity>
                          )}
                        </View>

                        <View style={[styles.width30,styles.leftPadding]} >
                          <View>
                            <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + value.url)}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    </View>

                    {(this.state.sortCriteriaArray && this.state.sortCriteriaArray[index] && this.state.sortCriteriaArray[index].name) && (
                      <View style={[styles.leftPadding50]}>
                        <View style={[styles.halfSpacer]} />
                        <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.sortCriteriaArray[index].name}: {this.standardizeValue('sort',index, this.state.sortCriteriaArray[index].criteria)}</Text>
                      </View>
                    )}
                    {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[index] && this.state.filterCriteriaArray[index].name) && (
                      <View style={[styles.leftPadding50]}>
                        <View style={[styles.halfSpacer]} />
                        <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.filterCriteriaArray[index].name}: {this.state.filterCriteriaArray[index].criteria}</Text>
                      </View>
                    )}
                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                    <View style={[styles.horizontalLine]} />

                    <View style={[styles.spacer]} />
                  </View>

                </View>
              )}

            </View>
          )}

        </View>
      </View>
    )
  }

  markCompleted(item, type) {
    console.log('markCompleted called', item, type)

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    if (type) {
      let itemId = item._id

      let completions = this.state.completions

      if (completions.includes(itemId) || this.state.completedCourseDetails.some(selectedCourse => selectedCourse.url === item.url)){

        let index = completions.indexOf(itemId)
        let courseIndex = 0
        let completedCourseDetails = this.state.completedCourseDetails
        if (this.state.completedCourseDetails && this.state.completedCourseDetails.some(selectedCourse => selectedCourse.url === item.url)) {
          courseIndex = completedCourseDetails.findIndex(x => x.url === item.url);

          if (courseIndex > -1) {
            index = completions.indexOf(completedCourseDetails[courseIndex].completionId)
            completedCourseDetails.splice(courseIndex, 1);
          }

        }
        // console.log('item to remove 1: ', completions, favoritesArray.length, favoritedCourseDetails.length)
        if (index > -1) {
          completions.splice(index, 1);
        }
        // console.log('item to remove 2: ', favoritesArray, favoritesArray.length, favoritedCourseDetails.length)

        Axios.post('https://www.guidedcompass.com/api/completions/save', {
          completions, emailId: this.state.emailId
        })
        .then((response) => {
          console.log('attempting to save removal from completions')
          if (response.data.success) {
            console.log('saved removal from completions', response.data)

            this.setState({ successMessage: 'Removed from saved completions', completions, completedCourseDetails, isSaving: false })

          } else {
            console.log('did not save successfully')
            this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
          }
        }).catch((error) => {
            console.log('save did not work', error);
            this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false })
        });

      } else {

        // console.log('adding item: ', favoritesArray, itemId)

        if (type === 'course') {
          // first save the course
          const courseObject = {
            source: 'Udemy', title: item.title, headline: item.headline, udemyId: item.id, url: item.url,
            image_125_H: item.image_125_H, image_240x135: item.image_240x135, image_480x270: item.image_480x270,
            is_paid: item.is_paid, price: item.price, visible_instructors: item.visible_instructors
          }

          Axios.post('https://www.guidedcompass.com/api/courses', courseObject)
          .then((response) => {
            console.log('attempting to save course')
            if (response.data.success) {
              console.log('saved course as new', response.data)
              //clear values

              itemId = response.data._id

              completions.push(itemId)
              let completedCourseDetails = this.state.completedCourseDetails
              completedCourseDetails.push(item)

              Axios.post('https://www.guidedcompass.com/api/completions/save', {
                completions, emailId: this.state.emailId
              })
              .then((response) => {
                console.log('attempting to save addition to completions')
                if (response.data.success) {
                  console.log('saved addition to completions', response.data)

                  this.setState({
                    successMessage: 'Saved as a completion!', completions, completedCourseDetails, isSaving: false
                  })

                } else {
                  console.log('did not save successfully')
                  this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
                }
              }).catch((error) => {
                  console.log('save did not work', error);
                  this.setState({ errorMessage: 'there was an error saving completions', isSaving: false})
              });
            } else {
              console.log('did not save successfully')

            }
          }).catch((error) => {
              console.log('save did not work', error);
              this.setState({
                serverSuccessPlan: false,
                serverErrorMessagePlan: 'there was an error saving completions', isSaving: false
              })
          });
        } else {
          completions.push(itemId)
          Axios.post('https://www.guidedcompass.com/api/completions/save', {
            completions, emailId: this.state.emailId
          })
          .then((response) => {
            console.log('attempting to save addition to completions')
            if (response.data.success) {
              console.log('saved addition to completions', response.data)

              this.setState({ successMessage: 'Saved as a completion!', completions, isSaving: false })

            } else {
              console.log('did not save successfully')
              this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
            }
          }).catch((error) => {
              console.log('save did not work', error);
              this.setState({ errorMessage: 'there was an error saving completions', isSaving: false})
          });
        }
      }
    }
  }

  renderScheduleSetup(type) {
    console.log('renderScheduleSetup called', type)

    return (
      <View key="subScheduleSetup">
        <View style={[styles.row40]}>
          <Text style={[styles.headingText5]}>1. Select a Goal</Text>

          <View style={[styles.row10]}>
            <View>
              <Text style={[styles.row10,styles.standardText]}>Select a Goal Type</Text>
              {(Platform.OS === 'ios') ? (
                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Goal Type', selectedIndex: null, selectedName: "goalType", selectedValue: this.state.goalType.description, selectedOptions: this.state.goalTypeOptions, selectedSubKey: 'value' })}>
                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                    <View style={[styles.calcColumn115]}>
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
                    {this.state.goalTypeOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                  </Picker>
                </View>
              )}

            </View>
          </View>

          {(this.state.goalType.name === 'Career') && (
            <View>
              <View>
                <Text style={[styles.row10,styles.standardText]}>Select a Career Path</Text>

                <View style={[styles.rowDirection]}>
                  <View style={[styles.calcColumn130]}>
                    <TextInput
                      style={[styles.textInput]}
                      onChangeText={(text) => this.formChangeHandler("searchCareers",text)}
                      value={this.state.searchString}
                      placeholder="Search 1,000+ career paths..."
                      placeholderTextColor="grey"
                    />
                  </View>
                  <View style={[styles.width70,styles.leftPadding]}>
                    <TouchableOpacity style={(this.state.unready) ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.unready} onPress={() => this.addItem('career')}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
                  </View>
                </View>

              </View>


              {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
              {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

              {(this.state.searchIsAnimating) ? (
                <View style={[styles.flex1,styles.flexCenter]}>
                  <View>
                    <View style={[styles.superSpacer]} />

                    <ActivityIndicator
                       animating = {this.state.animating}
                       color = '#87CEFA'
                       size = "large"
                       style={[styles.square80, styles.centerHorizontally]}/>

                    <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                    <Text style={[styles.centerText,styles.ctaColor,styles.boldText,styles.standardText]}>Searching...</Text>

                  </View>
                </View>
              ) : (
                <View>
                  <View>
                    {(this.state.careerOptions) && (
                      <View style={[styles.card,styles.topMargin]}>
                        {this.state.careerOptions.map((value, optionIndex) =>
                          <View key={value._id} style={[styles.bottomMargin5]}>
                            <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'career')}>
                              <View>
                                <View style={[styles.width40]}>
                                  <View style={[styles.miniSpacer]} />
                                  <Image source={{ uri: experienceIcon}} style={[styles.square22,styles.contain]} />
                                </View>
                                <View style={[styles.calcColumn160]}>
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
          )}
          {(this.state.goalType.name === 'Opportunity') && (
            <View>
              <View>
                <Text style={[styles.row10,styles.standardText]}>Select an Opportunity</Text>

                <View style={[styles.rowDirection]}>
                  <View style={[styles.calcColumn130]}>
                    <TextInput
                      style={[styles.textInput]}
                      onChangeText={(text) => this.formChangeHandler("searchOpportunities",text)}
                      value={this.state.searchStringOpportunities}
                      placeholder="Search work opportunities..."
                      placeholderTextColor="grey"
                    />
                  </View>
                  <View style={[styles.width70,styles.leftPadding]}>
                    <TouchableOpacity style={(this.state.unready) ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.unready} onPress={() => this.addItem('opportunity')}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
                  </View>
                </View>

              </View>


              {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
              {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

              {(this.state.searchIsAnimating) ? (
                <View style={[styles.flex1,styles.flexCenter]}>
                  <View>
                    <View style={[styles.superSpacer]} />

                    <ActivityIndicator
                       animating = {this.state.animating}
                       color = '#87CEFA'
                       size = "large"
                       style={[styles.square80, styles.centerHorizontally]}/>

                    <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                    <Text style={[styles.centerText,styles.ctaColor,styles.boldText,styles.standardText]}>Searching...</Text>

                  </View>
                </View>
              ) : (
                <View>
                  <View>
                    {(this.state.opportunityOptions) && (
                      <View style={[styles.card,styles.topMargin]}>
                        {this.state.opportunityOptions.map((value, optionIndex) =>
                          <View key={value._id} style={[styles.bottomMargin5]}>
                            <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'opportunity')}>
                              <View>
                                <View style={[styles.width40]}>
                                  <View style={[styles.miniSpacer]} />
                                  <Image source={{ uri: experienceIcon}} style={[styles.square22,styles.contain]} />
                                </View>
                                <View style={[styles.calcColumn160]}>
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
          )}
          {(this.state.goalType.name === 'Entrepreneurship') && (
            <View style={[styles.row10]}>
              <View>
                <Text style={[styles.row10,styles.standardText]}>What area do you need help with?</Text>
                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Entrepreneurship Goal', selectedIndex: null, selectedName: "entrepreneurshipGoal", selectedValue: this.state.entrepreneurshipGoal, selectedOptions: this.state.entrepreneurshipGoalOptions, selectedSubKey: null })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
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

              <View>
                <Text style={[styles.row10,styles.standardText]}>Which industry is your business in?</Text>
                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Entrepreneurship Industry', selectedIndex: null, selectedName: "entrepreneurshipIndustry", selectedValue: this.state.entrepreneurshipIndustry, selectedOptions: this.state.industryOptions, selectedSubKey: null })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{this.state.entrepreneurshipIndustry}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <View style={[styles.standardBorder]}>
                    <Picker
                      selectedValue={this.state.entrepreneurshipIndustry}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("entrepreneurshipIndustry",itemValue)
                      }>
                      {this.state.industryOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                    </Picker>
                  </View>
                )}
              </View>

            </View>
          )}



        </View>

        <View style={[styles.horizontalLine]} />

        <View style={[styles.row40]}>
          <Text style={[styles.headingText5]}>2. Modify Learning Objectives</Text>
          <Text style={[styles.descriptionText2]}>Based on your profile, goals, and skill gaps, we recommend you acquire the following skills and knowledge:</Text>

          <View>
            {this.renderTags('learningObjective')}

          </View>
        </View>

        <View style={[styles.horizontalLine]} />

        <View style={[styles.topPadding40]}>
          <Text style={[styles.headingText5]}>3. Specify your Budget</Text>

          <View style={[styles.row10,styles.rowDirection]}>
            <View style={[styles.lightBackground,styles.standardBorder,styles.width22,styles.height40]}>
              <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
              <Text style={[styles.headingText4,styles.ctaColor,styles.boldText,styles.centerText]}>$</Text>
            </View>
            <View style={[styles.width85]}>
              <TextInput
                style={[styles.textInput,styles.standardText,styles.ctaColor,styles.boldText]}
                onChangeText={(text) => this.formChangeHandler("budget",text)}
                value={this.state.budget}
                placeholder="0"
                placeholderTextColor="grey"
                keyboardType="numeric"
              />
            </View>

          </View>
        </View>

        {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
        {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

        <View style={[styles.row30]}>
          <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.getCourseMatches()}><Text style={[styles.standardText,styles.whiteColor]}>Get Recommended Courses</Text></TouchableOpacity>
        </View>

      </View>
    )
  }

  getCourseMatches(selectedGoal) {
    console.log('getCourseMatches called', selectedGoal)

    this.setState({ animating: true, errorMessage: null, successMessage: null, modalIsOpen: false })

    if (!this.state.goalType.name || this.state.goalType.name === '') {
      this.setState({ animating: false, errorMessage: 'Please add a goal type' })
    } else if (this.state.goalType.name === 'Career' && !this.state.selectedCareer) {
      this.setState({  animating: false, errorMessage: 'Please select a career or choose another goal type' })
    } else if (this.state.goalType.name === 'Opportunity' && !this.state.selectedOpportunity) {
      this.setState({  animating: false, errorMessage: 'Please select an opportunity or choose another goal type' })
    } else if (this.state.goalType.name === 'Entrepreneurship' && !this.state.entrepreneurshipGoal) {
      this.setState({  animating: false, errorMessage: 'Please select your primary goal within entrepreneurship or choose another goal type' })
    } else if (this.state.goalType.name === 'Entrepreneurship' && !this.state.entrepreneurshipIndustry) {
      this.setState({  animating: false, errorMessage: 'Please select your primary industry for your venture or choose another goal type' })
    } else if (!this.state.learningObjectives || this.state.learningObjectives.length === 0) {
      this.setState({  animating: false, errorMessage: 'Please select a career or opportunity that populates learning objectives. We cannot accept custom learning objectives at this time.' })
    } else if (!this.state.budget || this.state.budget === '') {
      this.setState({  animating: false, errorMessage: 'Please detail your course budget' })
    } else {

      const goalType = this.state.goalType
      const selectedCareer = this.state.selectedCareer
      const selectedOpportunity = this.state.selectedOpportunity
      const entrepreneurshipGoal = this.state.entrepreneurshipGoal
      const entrepreneurshipIndustry = this.state.entrepreneurshipIndustry
      const learningObjectives = this.state.learningObjectives
      const budget = this.state.budget

      Axios.put('https://www.guidedcompass.com/api/schedule/matches', {
        goalType, selectedCareer, selectedOpportunity, entrepreneurshipGoal, entrepreneurshipIndustry,
        learningObjectives, budget
      })
      .then((response) => {
        console.log('Course matches attempted', response.data);

          if (response.data.success) {
            console.log('successfully retrieved course matches')

            if (response.data.courses) {

              const courses = response.data.courses
              const filteredCourses = courses

              this.setState({ animating: false, courses, filteredCourses, modalIsOpen: false  })

            } else {
              this.setState({ animating: false, errorMessage: 'Unknown error after pulling courses' })
            }

          } else {
            console.log('failed to calculate courses', response.data.message)
            this.setState({ animating: false, errorMessage: 'There was an error: ' + response.data.message })
          }

      }).catch((error) => {
          console.log('Course calculation did not work', error);
          this.setState({ animating: false, errorMessage: 'Course recommendation calculation did not work for some reason' })
      });
    }
  }

  closeModal() {
    console.log('closeModal in projects: ', this.state.showProjectDetail)

    this.setState({modalIsOpen: false, startRecommendation: false, selectedCourse: null, showMatchingCriteria: false,
      showBrowseCourses: false, showScheduleSetup: false, selectedIndex1: null, selectedIndex2: null, showPicker: false  });

  }

  render() {

    return (
        <ScrollView>
          {this.renderBrowseCourses()}
          <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>

            {(this.state.showMatchingCriteria) && (
              <View key="showMatchingCriteria" style={[styles.flex1,styles.padding20]}>
                <Text style={[styles.headingText4]}>Adjust Matching Criteria</Text>

                {this.renderScheduleSetup('course')}

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

           </Modal>
        </ScrollView>
    )
  }

}

export default Courses;
