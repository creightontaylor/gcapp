import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import * as Progress from 'react-native-progress';

const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const hideIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/hide-icon.png';
const filterIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/filter-icon.png';
const filterIconSelected = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/filter-icon-selected.png';
const matchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/match-icon.png';
const matchIconSelected = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/match-icon-selected.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';
const upvoteIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-blue.png';
const upvoteIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-grey.png';
const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const appliedIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/applied-icon-blue.png';
const rsvpIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/rsvp-icon-blue.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const eventIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/event-icon-blue.png';
const assignmentsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/assignments-icon-blue.png';
const problemIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/problem-icon-blue.png';
const challengeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/challenge-icon-blue.png';
const internIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/intern-icon-blue.png';
const moneyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/money-icon-blue.png';
const checkmarkIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon-white.png';
const opportunitiesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-blue.png';

import SubPicker from '../common/SubPicker';

import {convertDateToString} from '../functions/convertDateToString';

class Opportunities extends Component {
  constructor(props) {
    super(props)
    this.state = {

        defaultFilterOption: 'All',
        defaultSortOption: 'No Sort Applied',

        showAssignments: false,
        subNavSelected: 'All',

        totalPercent: 100,

        subNavCategories: ['All','Featured','Work','Projects','Events'],
        featuredOpportunities: [],
        filteredFeaturedOpportunities: [],
        assignments: [],
        filteredAssignments: [],
        problems: [],
        filteredProblems: [],
        challenges: [],
        filteredChallenges: [],
        projectWork: [],
        filteredProjectWork: [],
        internships: [],
        filteredInternships: [],
        work: [],
        filteredWork: [],
        events: [],
        filteredEvents: [],
        upcomingEvents: [],
        filteredUpcomingEvents: [],
        pastEvents: [],
        filteredPastEvents: [],
        filteredPostings: [],
        postings: [],

        favorites: [],

        problemTypeOptions: [],
        difficultyLevelOptions: [],
        popularityOptions: [],
        postDateOptions: [],
        functionOptions: [],
        industryOptions: [],
        employerSizeOptions: [],
        employerTypeOptions: [],

        categorySelected: 0,
        searchString: '',
        problemType: '',
        difficultyLevel: '',
        popularity: '',
        postDate: '',
        workFunction: '',
        industry: '',
        employerSize: '',
        employerType: '',

        viewIndex: 0
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.retrievePostings = this.retrievePostings.bind(this)
    this.renderOpportunities = this.renderOpportunities.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.favoriteItem = this.favoriteItem.bind(this)
    this.voteOnItem = this.voteOnItem.bind(this)
    this.toggleView = this.toggleView.bind(this)
    this.toggleSearchBar = this.toggleSearchBar.bind(this)

    this.renderManipulators = this.renderManipulators.bind(this)
    this.filterResults = this.filterResults.bind(this)
    this.sortResults = this.sortResults.bind(this)
    this.subNavClicked = this.subNavClicked.bind(this)
    this.calculateMatches = this.calculateMatches.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.itemClicked = this.itemClicked.bind(this)
    this.filterPostings = this.filterPostings.bind(this)

  }

  componentDidMount() {
    console.log('SubOpportunities did mount');
    this.retrieveData()

    const opportunitiesReload = this.props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      console.log('reloadData called')
      this.retrieveData()
    });
  }

  componentWillUnmount () {
    console.log('componentWillUnmount called')
    this.props.navigation.removeListener('opportunitiesReload')
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
      const pathway = await AsyncStorage.getItem('pathway');
      const opportunitiesNavSelected = await AsyncStorage.getItem('opportunitiesNavSelected');

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

        let matchingCriteria = [
          { name: 'Work Function',  description: 'Scores careers / opportunities the highest that match your preferred work functions indicated in your work preferences assessment', value: 20 },
          { name: 'Industry',  description: 'Scores careers / opportunities the highest that match your preferred industries indicated in your work preferences assessment', value: 10 },
          { name: 'Location',  description: 'Scores careers / opportunities the highest that match your preferred location preferences indicated in your work preferences assessment', value: 0 },
          { name: 'Pay',  description: 'Scores high paying careers / opportunities highest', value: 0 },
          { name: 'Stability',  description: 'Scores careers / opportunities the highest with little variability in pay and job growth', value: 0 },
          { name: 'Interests',  description: 'Scores careers / opportunities the highest that match your interest assessment', value: 15 },
          { name: 'Personality',  description: 'Scores careers / opportunities the highest that match your personality assessment', value: 15 },
          { name: 'Values',  description: 'Scores careers / opportunities that the highest match your values assessment', value: 10 },
          { name: 'Skills',  description: 'Scores careers / opportunities that the highest match your skills assessment', value: 20 },
          { name: 'Education',  description: 'Scores careers / opportunities the highest that match your target education level indicated in work preferences', value: 0 },
          { name: 'Projects',  description: 'Scores careers / opportunities the highest that will likely value your project work the highest', value: 5 },
          { name: 'Experience',  description: 'Scores careers / opportunities the highest that will likely value your experience (that you like)', value: 5 },
        ]

        let useCases = [
          { name: 'Purpose', description: 'Optimize for opportunities that may give you the most purpose (e.g., solving a global problem, or large problem I am specifically interested in)', selected: false }, // interests
          { name: 'Stability', description: 'Optimize for opportunities where you will likely have the most job stability.', selected: false }, // job growth, company size
          { name: 'Pay', description: 'Optimize for opportunities where you will be paid the most in the short to medium term.', selected: false }, // pay
          { name: 'Recognition', description: 'Optimize for opportunities where you will be provided positive reinforcement and public praise for your accomplishments.', selected: false }, // social, artistic
          { name: 'Interests', description: 'Optimize for opportunities where you have the most long-term, genuine interest in.', selected: false }, // interests, personality
          { name: 'Competitive Advantage', description: 'Optimize for opportunities where you have the highest competitive advantage amongst candidates in your age group.', selected: false }, // skills
        ]

        Axios.get('https://www.guidedcompass.com/api/workoptions')
        .then((response) => {
          console.log('Work options query tried', response.data);

          if (response.data.success) {
            console.log('Work options query succeeded')

            const eventTypeOptions = response.data.workOptions[0].eventTypeOptions

            const postTypeOptions = ['Event','Project','Work']
            const durationOptions = response.data.workOptions[0].durationOptions
            let functionOptions = response.data.workOptions[0].functionOptions
            const industryOptions = response.data.workOptions[0].industryOptions
            const roleNameOptions = ['Mentor','Teacher','School Support','WBLC','Admin','Employer']
            const difficultyOptions = ['Very Easy','Easy','Medium','Hard','Challenger']

            const gradeLevelOptions = ['','6th - 8th','9th - 10th','11th - 12th','Freshman and Sophomore of College','Junior and Senior of College', 'All Grade Levels Are Welcome to Apply']
            const knowledgeLevelOptions = ['','Beginner','1-2 Years of Familiarity','3+ Years of Familiarity']
            const employerTypeOptions = response.data.workOptions[0].employerTypeOptions
            // const employerSizeOptions = response.data.workOptions[0].employeeCountOptions

            const payRangeOptions = response.data.workOptions[0].hourlyPayOptions
            const hoursPerWeekOptions = response.data.workOptions[0].hoursPerWeekOptions
            // const projectedInternOptions = response.data.workOptions[0].projectedInternOptions

            const hourlyPayOptions = response.data.workOptions[0].hourlyPayOptions
            const annualPayOptions = response.data.workOptions[0].annualPayOptions
            const employeeCountOptions = response.data.workOptions[0].employeeCountOptions
            const hourOptions = response.data.workOptions[0].hourOptions

            const applicationMethodOptions = ['Referral Only','Also By Email','Also By Web']

            //filters
            const defaultFilterOption = this.state.defaultFilterOption

            const eventTypeFilterOptions = [defaultFilterOption].concat(eventTypeOptions.slice(1, eventTypeOptions.length))

            const postTypeFilterOptions = [defaultFilterOption].concat(postTypeOptions.slice(1,4))
            const durationFilterOptions = [defaultFilterOption].concat(durationOptions.slice(1, durationOptions.length))
            const functionFilterOptions = [defaultFilterOption].concat(functionOptions.slice(1, functionOptions.length))
            const industryFilterOptions = [defaultFilterOption].concat(industryOptions.slice(1, industryOptions.length))
            const roleNameFilterOptions = [defaultFilterOption].concat(roleNameOptions)
            const difficultyLevelFilterOptions = [defaultFilterOption].concat(difficultyOptions)
            const gradeLevelFilterOptions = [defaultFilterOption].concat(gradeLevelOptions.slice(1, gradeLevelOptions.length))
            const knowledgeLevelFilterOptions = [defaultFilterOption].concat(knowledgeLevelOptions.slice(1, knowledgeLevelOptions.length))
            const employerTypeFilterOptions = [defaultFilterOption].concat(employerTypeOptions.slice(1, employerTypeOptions.length))

            const payRangeFilterOptions = [defaultFilterOption].concat(payRangeOptions.slice(1, payRangeOptions.length))
            const hoursPerWeekFilterOptions = [defaultFilterOption].concat(hoursPerWeekOptions.slice(1, hoursPerWeekOptions.length))
            // const projectedHiresFilterOptions = [defaultFilterOption].concat(projectedInternOptions.slice(1, projectedInternOptions.length))
            const applicationMethodFilterOptions = [defaultFilterOption].concat(applicationMethodOptions)

            const eventFilters = [
              { name: 'Event Type', value: defaultFilterOption, options: eventTypeFilterOptions},
            ]

            let projectFilters = [
              { name: 'Work Function', value: defaultFilterOption, options: functionFilterOptions },
              { name: 'Industry', value: defaultFilterOption, options: industryFilterOptions },
              { name: 'Post Type', value: defaultFilterOption, options: postTypeFilterOptions },
              { name: 'Time Commitment', value: defaultFilterOption, options: durationFilterOptions },
              { name: 'Contributor Role Name', value: defaultFilterOption, options: roleNameFilterOptions },
              { name: 'Difficulty Level', value: defaultFilterOption, options: difficultyLevelFilterOptions},
              { name: 'Grade Level', value: defaultFilterOption, options: gradeLevelFilterOptions },
              { name: 'Knowledge Level', value: defaultFilterOption, options: knowledgeLevelFilterOptions },
              { name: 'Employer Type', value: defaultFilterOption, options: employerTypeFilterOptions },
              // { name: 'Employer Size', value: defaultFilterOption, options: employerSizeFilterOptions },
              // { name: 'Employer Growth', value: defaultFilterOption, options: contributorFilterOptions },
            ]

            let workFilters = [
              { name: 'Work Function', value: defaultFilterOption, options: functionFilterOptions },
              { name: 'Industry', value: defaultFilterOption, options: industryFilterOptions },
              // { name: 'Location', value: defaultFilterOption, options: industryFilterOptions },
              { name: 'Pay Range', value: defaultFilterOption, options: payRangeFilterOptions },
              { name: 'Hours Per Week', value: defaultFilterOption, options: hoursPerWeekFilterOptions},
              // { name: 'Projected Hires', value: defaultFilterOption, options: projectedHiresFilterOptions },
              { name: 'Application Method', value: defaultFilterOption, options: applicationMethodFilterOptions },
              { name: 'Employer Type', value: defaultFilterOption, options: employerTypeFilterOptions },
              // { name: 'Employer Size', value: defaultFilterOption, options: employerSizeFilterOptions },
              // { name: 'Employer Growth', value: defaultFilterOption, options: contributorFilterOptions },
            ]

            if (activeOrg === 'c2c') {
              const politicalPartyOptions = response.data.workOptions[0].politicalAlignmentOptions
              workFilters.push({ name: 'Political Party', value: defaultFilterOption, options: [defaultFilterOption].concat(politicalPartyOptions)})
            }

            //sort options
            const defaultSortOption = this.state.defaultSortOption

            const eventSorters = []

            const projectSorters = [
              { name: 'Prize Money', value: defaultSortOption, options: [defaultSortOption].concat(['Most'])},
              // { name: 'Popularity', value: defaultSortOption, options: [defaultSortOption].concat(['Highest'])},
            ]

            const workSorters = [
              // { name: 'Match', value: defaultSortOption, options: [defaultSortOption].concat(['Highest'])},
              { name: 'Application Deadline', value: defaultSortOption, options: [defaultSortOption].concat(['Soonest'])},
              { name: 'Start Date', value: defaultSortOption, options: [defaultSortOption].concat(['Soonest'])},
            ]

            let allFilters = []
            const totalFilters = workFilters.concat(projectFilters, eventFilters)
            let filterTracker = []
            for (let i = 1; i <= totalFilters.length; i++) {
              if (!filterTracker.includes(totalFilters[i - 1].name)) {
                filterTracker.push(totalFilters[i - 1].name)
                if (totalFilters[i - 1].name === 'Post Type') {
                  allFilters.push({ name: 'Post Type', value: defaultFilterOption, options: [defaultFilterOption].concat(postTypeOptions) })
                } else {
                  allFilters.push(totalFilters[i - 1])
                }
              }
            }

            let allSorters = []
            const totalSorters = workSorters.concat(projectSorters, eventSorters)
            let sorterTracker = []
            for (let i = 1; i <= totalSorters.length; i++) {
              if (!sorterTracker.includes(totalSorters[i - 1].name)) {
                sorterTracker.push(totalSorters[i - 1].name)
                allSorters.push(totalSorters[i - 1])
              }
            }

            this.setState({
              eventFilters, eventSorters, projectFilters, projectSorters, workFilters, workSorters, allFilters, allSorters,
              hourlyPayOptions, annualPayOptions, employeeCountOptions, hourOptions
            });

            if (activeOrg === 'c2c') {
              const orgCode = activeOrg

              Axios.get('https://www.guidedcompass.com/api/benchmarks', { params: { orgCode } })
              .then((response) => {
                console.log('Benchmarks query attempted', response.data);

                  if (response.data.success) {
                    console.log('benchmark query worked')

                    if (response.data.benchmarks.length !== 0) {
                      //jobs = response.data.postings

                      functionOptions = []

                      let benchmarks = response.data.benchmarks
                      for (let i = 1; i <= benchmarks.length; i++) {
                        if (!benchmarks[i - 1].title.includes('Scholarship') && !benchmarks[i - 1].title.includes('C2C')) {
                          if (!functionOptions.includes(benchmarks[i - 1].jobFunction)) {
                            functionOptions.push(benchmarks[i - 1].jobFunction)
                          }
                        }
                      }

                      functionOptions.sort()

                      projectFilters[0]['options'] = [defaultFilterOption].concat(functionOptions)
                      workFilters[0]['options'] = [defaultFilterOption].concat(functionOptions)

                      this.setState({ projectFilters, workFilters })
                    }
                  }
              })
            }

          }
        });

        let viewIndex = 0
        if (this.props.passedViewIndex) {
          // for problem-platform
          viewIndex = this.props.passedViewIndex
        }

        let subNavSelected = 'All'
        if (this.props.passedSubNavSelected) {
          subNavSelected = this.props.passedSubNavSelected
        } else if (opportunitiesNavSelected) {
          subNavSelected = opportunitiesNavSelected
        }

        let subNavCategories = ['All','Featured','Work','Projects','Events']
        if (activeOrg !== 'unite-la') {
          subNavCategories = ['All','Featured','Work','Projects','Events','View External Jobs']
        }

        this.setState({ viewIndex, subNavSelected, subNavCategories })

        if (!email || email === '') {
          console.log('no email found')

          if (!activeOrg || activeOrg === '') {
            activeOrg = this.props.activeOrg
          }

          const pageSource = this.props.pageSource
          this.setState({ pageSource, activeOrg })

          this.retrievePostings(activeOrg, null, null, pathway)

        } else {

          let placementAgency = false
          if (activeOrg === 'bixel' || activeOrg === 'tip' || activeOrg === 'c2c' || activeOrg === 'layaw' || activeOrg === 'exp' || activeOrg === 'unite-la') {
            placementAgency = true
          }

          const problemTypeOptions = ['','Exploratory','Technical']
          const difficultyLevelOptions = ['','Very Easy','Easy','Medium','Difficult','Challenger']
          const popularityOptions = ['','More than 10','More than 50']
          const postDateOptions = ['','Within the Last Month','Within the Last Year']
          const pageSource = this.props.pageSource

          this.setState({ emailId: email, username, activeOrg, placementAgency,
            problemTypeOptions, difficultyLevelOptions, popularityOptions, postDateOptions, pageSource });

          let placementPartners = []
          Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
          .then((response) => {
            console.log('User details query attempted', response.data);

            if (response.data.success) {
               console.log('successfully retrieved user details')

               const courseIds = response.data.user.courseIds

               Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId: email } })
                .then((response2) => {
                  console.log('query for assessment results worked');

                  if (response2.data.success) {

                    console.log('actual assessment results', response2.data)

                    // let wpData = null
                    // if (response.data.results.workPreferenceAnswers) {
                    //   wpData
                    // }


                    let profile = response.data.user
                    profile['workPreferences'] = response2.data.results.workPreferenceAnswers
                    profile['interests'] = response2.data.results.interestScores
                    profile['personality'] = response2.data.results.personalityScores
                    profile['skills'] = response2.data.results.newSkillAnswers
                    profile['gravitateValues'] = response2.data.results.topGravitateValues
                    profile['employerValues'] = response2.data.results.topEmployerValues
                    profile['selectedGoal'] = this.props.selectedGoal

                    // let matchingCriteria = this.state.matchingCriteria
                    if (response.data.user.matchingPreferences && response.data.user.matchingPreferences.length > 0) {
                      matchingCriteria = response.data.user.matchingPreferences
                    }
                    if (response.data.user.matchingUseCases && response.data.user.matchingUseCases.length > 0) {
                      useCases = response.data.user.matchingUseCases
                    }

                    this.setState({ profile, matchingCriteria, useCases })

                    console.log('show pageSource here: ', this.props.pageSource)
                    if (this.props.pageSource === 'Goal') {
                      this.calculateMatches(true, true, false, [this.props.pageSource], 1000, activeOrg)
                    }

                  } else {
                    console.log('no assessment results', response2.data)

                    // let matchingCriteria = this.state.matchingCriteria
                    if (response.data.user.matchingPreferences && response.data.user.matchingPreferences.length > 0) {
                      matchingCriteria = response.data.user.matchingPreferences
                    }
                    if (response.data.user.matchingUseCases && response.data.user.matchingUseCases.length > 0) {
                      useCases = response.data.user.matchingUseCases
                    }
                    this.setState({ matchingCriteria, useCases })
                  }

               }).catch((error) => {
                  console.log('query for assessment results did not work', error);
                  // let matchingCriteria = this.state.matchingCriteria
                  if (response.data.user.matchingPreferences && response.data.user.matchingPreferences.length > 0) {
                    matchingCriteria = response.data.user.matchingPreferences
                  }
                  if (response.data.user.matchingUseCases && response.data.user.matchingUseCases.length > 0) {
                    useCases = response.data.user.matchingUseCases
                  }
                  this.setState({ matchingCriteria, useCases })
               })

               Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
               .then((response2) => {
                 console.log('Org info query attempted within nested opportunities', response2.data);

                 if (response2.data.success) {
                   console.log('org info query worked!')

                   if (response2.data.orgInfo.placementPartners) {
                     placementPartners = response2.data.orgInfo.placementPartners
                   }

                   let calculateMatches  = false
                   if (this.props.calculateMatches) {
                     calculateMatches = true
                   }

                   if (this.props.pageSource !== 'Goal') {
                     this.retrievePostings(activeOrg, placementPartners, courseIds, pathway, calculateMatches, roleName)
                   }

                 } else {
                   console.log('there was an error findign the org')

                 }
               }).catch((error) => {
                  console.log('Error finding the org', error);
               });

            } else {
             console.log('no user details data found', response.data.message)
            }

          }).catch((error) => {
             console.log('User details query did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId: email } })
          .then((response) => {
            console.log('Favorites query attempted', response.data);

             if (response.data.success) {
               console.log('successfully retrieved favorites')

               let favorites = []
               if (response.data.favorites) {
                 favorites = response.data.favorites
               }

               this.setState({ favorites })
             } else {
               console.log('no favorites data found', response.data.message)
             }

          }).catch((error) => {
             console.log('Favorites query did not work', error);
          });
        }

        Axios.get('https://www.guidedcompass.com/api/applications', { params: { emailId: email, orgCode: activeOrg } })
        .then((response) => {
          console.log('Applications query attempted', response.data);

          if (response.data.success) {
            console.log('applications query worked')

            if (response.data.applications.length !== 0) {
              let applications = response.data.applications
              //jobs.push(response.data.postings[0])
              this.setState({ applications });
            }

          } else {
            console.log('query for applications query did not work', response.data.message)
          }

        }).catch((error) => {
            console.log('Applications query did not work for some reason', error);
        });

        Axios.get('https://www.guidedcompass.com/api/rsvps', { params: { email } })
        .then((response) => {
          console.log('Rsvp query attempted', response.data);

          if (response.data.success) {
            console.log('rsvp query worked')

            let rsvps = response.data.rsvps
            this.setState({ rsvps })


          } else {
            console.log('rsvp query did not work', response.data.message)
            //there is no rsvp data

          }

        }).catch((error) => {
            console.log('Rsvp query did not work for some reason', error);
        });

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  retrievePostings(orgCode, placementPartners, courseIds, pathway, calculateMatches, roleName) {
    console.log('retrievePostings called', orgCode, placementPartners, courseIds, pathway, calculateMatches, roleName)

    let postType = undefined
    if (this.props.passedType) {
      postType = this.props.passedType
    }

    let postTypes = []
    if (this.props.passedTypes) {
      postTypes = this.props.passedTypes
    }

    let queryOrgCode = orgCode

    let accountCode = this.props.accountCode

    const recent = true
    const active = true
    const excludeUnlisted = true
    const pullPartnerPosts = true

    //only schools see this screen
    Axios.get('https://www.guidedcompass.com/api/postings/user', { params: { orgCode: queryOrgCode, placementPartners, postType, postTypes, pathway, accountCode, recent, active, excludeUnlisted, pullPartnerPosts, roleName, csWorkflow: true }})
    .then((response) => {
      console.log('Posted postings query attempted within subcomponent', response.data);

      if (response.data.success) {
        console.log('posted postings query worked')

        if (response.data.postings.length !== 0) {

          // let useFunction = true

          const allPostings = this.filterPostings(response.data.postings, courseIds)

          const featuredOpportunities = allPostings.featuredOpportunities
          const filteredFeaturedOpportunities = featuredOpportunities

          const projectWork = allPostings.projectWork
          const filteredProjectWork =  projectWork
          const internships = allPostings.internships
          const filteredInternships = internships
          const work = allPostings.work
          const filteredWork = work

          const events = allPostings.events
          const filteredEvents = events

          const upcomingEvents = allPostings.upcomingEvents
          const filteredUpcomingEvents = upcomingEvents
          const pastEvents = allPostings.pastEvents
          const filteredPastEvents = pastEvents

          const adjustedPostings = allPostings.adjustedPostings

          // this should be adjustedPostings
          // const postings = allPostings.postings
          const postings = adjustedPostings
          const filteredPostings = postings

          this.setState({ featuredOpportunities, filteredFeaturedOpportunities,
            projectWork, filteredProjectWork, internships, filteredInternships, work, filteredWork,
            events, filteredEvents, upcomingEvents, filteredUpcomingEvents, pastEvents, filteredPastEvents,
            postings, filteredPostings, adjustedPostings,
            orgCode: queryOrgCode, placementPartners, postType, postTypes, pathway
          });

          if (calculateMatches) {
            this.calculateMatches(true, true, false, null, null, queryOrgCode)
          }
        }

      } else {
        console.log('posted postings query did not work', response.data.message)
      }

    }).catch((error) => {
        console.log('Posted postings query did not work for some reason', error);
    });
  }

  filterPostings(postings, courseIds, matchScores) {
    console.log('filterPostings called. MOVE TO BACK-END!', postings)

    let adjustedPostings = []
    let featuredOpportunities = []
    let assignments = []
    let problems = []
    let challenges = []
    let projectWork = []
    let internships = []
    let work = []
    let events = []
    let upcomingEvents = []
    let pastEvents = []

    let tracks = []
    for (let i = 1; i <= postings.length; i++) {
      if (postings[i - 1].postType === 'Track' || postings[i - 1].subPostType === 'Track') {
        console.log('t2')
        tracks = postings[i - 1].tracks
      }
    }

    for (let i = 1; i <= postings.length; i++) {

      if (matchScores && postings.length === matchScores.length) {
        postings[i - 1]['matchScore'] = matchScores[i - 1]
      }

      // isChild, isActive, submissionDeadline, requestMode

      if (postings[i - 1].featured) {
        console.log('within featured')

        featuredOpportunities.push(postings[i - 1])

        // let filteredOnBackend = true
        // if (filteredOnBackend) {
        //
        // } else {
        //   if (postings[i - 1].postType === 'Individual' || postings[i - 1].postType === 'Track' || postings[i - 1].postType === 'Internship') {
        //
        //     if (postings[i - 1].isActive && !postings[i - 1].isChild) {
        //       if (!postings[i - 1].submissionDeadline || postings[i - 1].submissionDeadline === '') {
        //         featuredOpportunities.push(postings[i - 1])
        //       } else if ( new Date() < new Date(Number(postings[i - 1].submissionDeadline.substring(0,4)),Number(postings[i - 1].submissionDeadline.substring(5,7)) - 1,Number(postings[i - 1].submissionDeadline.substring(8,10)),0,0,0,0)) {
        //         featuredOpportunities.push(postings[i - 1])
        //       }
        //
        //     }
        //   } else {
        //
        //     if (postings[i - 1].requestMode === true && postings[i - 1].status === 'Approved' && postings[i - 1].isActive) {
        //       featuredOpportunities.push(postings[i - 1])
        //     } else if (!postings[i - 1].requestMode && postings[i - 1].isActive) {
        //       featuredOpportunities.push(postings[i - 1])
        //     } else {
        //       console.log('featured opp has not been approved or is not active')
        //     }
        //   }
        // }
      }
      // console.log('featuredOpp', featuredOpportunities)

      // let includeOtherWork = true
      // if (!this.state.activeOrg || this.state.activeOrg === 'guidedcompass') {
      //   if (postings[i - 1].postType === 'Work') {
      //     includeOtherWork = true
      //   }
      // }
      // console.log('work posting: ', i, postings[i - 1].title, this.state.activeOrg, includeOtherWork)
      if (postings[i - 1].postType === 'Individual' || postings[i - 1].postType === 'Track' || postings[i - 1].postType === 'Internship' || postings[i - 1].postType === 'Work') {

        if (postings[i - 1].isChild) {
          if (postings[i - 1].postType === 'Individual' || postings[i - 1].subPostType === 'Individual') {
            console.log('t3')
            if (tracks && tracks.length > 0) {
              console.log('t4')
              for (let j = 1; j <= tracks.length; j++) {
                console.log('t5')
                if (tracks[j - 1].approvedApplicants.includes(this.state.emailId)) {
                  console.log('t6')
                  if (tracks[j - 1].jobs) {
                    console.log('t7')
                    let jobs = tracks[j - 1].jobs
                    for (let k = 1; k <= jobs.length; k++) {
                      console.log('t8', jobs[k - 1]._id, postings[i - 1]._id,typeof jobs[k - 1]._id, typeof postings[i - 1]._id)
                      if (jobs[k - 1]._id === postings[i - 1]._id) {
                        console.log('t9')
                        internships.push(postings[i - 1])
                        work.push(postings[i - 1])
                        adjustedPostings.push(postings[i - 1])
                      }
                    }
                  }
                }
              }
            }
          }
        } else {
          internships.push(postings[i - 1])
          work.push(postings[i - 1])
          adjustedPostings.push(postings[i - 1])
        }

      } else if (postings[i - 1].postType === 'Assignment') {
        assignments.push(postings[i - 1])
      } else if (postings[i - 1].postType === 'Problem') {
        problems.push(postings[i - 1])
      } else if (postings[i - 1].postType === 'Challenge') {
        challenges.push(postings[i - 1])
      } else if (postings[i - 1].postType === 'Event') {
        events.push(postings[i - 1])

        let dateToTest = null
        if (postings[i - 1].endDate && new Date(postings[i - 1].endDate)) {
          dateToTest = postings[i - 1].endDate
        } else if (postings[i - 1].startDate && new Date(postings[i - 1].startDate)) {
          dateToTest = postings[i - 1].startDate
        }

        if (new Date(dateToTest).getTime() > new Date().getTime()) {
          upcomingEvents.push(postings[i - 1])
          adjustedPostings.push(postings[i - 1])

        } else {
          pastEvents.push(postings[i - 1])
          adjustedPostings.push(postings[i - 1])
        }

      } else if (postings[i - 1].postType === 'Scholarship') {
        adjustedPostings.push(postings[i - 1])
      } else {
        //perhaps scholarship
      }

      if (postings[i - 1].postType === 'Project' || postings[i - 1].postType === 'Assignment' || postings[i - 1].postType === 'Problem' || postings[i - 1].postType === 'Challenge') {
        if (postings[i - 1].attachToCourses) {
          // only for specific courses
          if (courseIds && courseIds.length > 0 && postings[i - 1].courses && postings[i - 1].courses.some(course => courseIds.includes(course._id))) {
            projectWork.push(postings[i - 1])
            adjustedPostings.push(postings[i - 1])
          }
        } else {
          // open to everyone
          console.log('listed posting ', i, postings[i - 1].name, postings[i - 1].postType, postings[i - 1].requestMode, postings[i - 1].status, postings[i - 1].isActive)
          projectWork.push(postings[i - 1])
          adjustedPostings.push(postings[i - 1])
          // if (!postings[i - 1].assigneeGroup.includes('Workers') && postings[i - 1].assigneeGroup !== 'Employed Individuals') {
          //   projectWork.push(postings[i - 1])
          //   adjustedPostings.push(postings[i - 1])
          // } else {
          //   projectWork.push(postings[i - 1])
          //   adjustedPostings.push(postings[i - 1])
          // }
        }

        // console.log('we got 1: ', postings[i - 1].postType)
      } else if (postings[i - 1].postType === 'Work' || postings[i - 1].postType === 'Internship' || postings[i - 1].postType === 'Individual' || postings[i - 1].postType === 'Track') {
        // remove this
        // if (postings[i - 1].isActive && !postings[i - 1].isChild) {
        //   work.push(postings[i - 1])
        // }
        // console.log('we got 2: ', postings[i - 1].postType)
      } else {
        // console.log('we got 3: ', postings[i - 1].postType)
      }
      // if (postings[i - 1].postType === 'Internship' && work[work.length - 1]) {
      //   console.log('show work posting deets: ', i, postings[i - 1].title, postings[i - 1].matchScore, work[work.length - 1].matchScore)
      // }
    }

    upcomingEvents.sort(function(a,b) {
      let startDateString1 = a.startDate
      let startDateString2 = b.startDate
      if (startDateString1 && startDateString2) {
        let startDate1 = new Date(startDateString1)
        let startDate2 = new Date(startDateString2)
        return startDate1 - startDate2;
      }
    })

    pastEvents.sort(function(a,b) {
      let startDateString1 = a.startDate
      let startDateString2 = b.startDate
      if (startDateString1 && startDateString2) {
        let startDate1 = new Date(startDateString1)
        let startDate2 = new Date(startDateString2)
        return startDate2 - startDate1;
      }
    })

    // console.log('finished events: ', events)

    const allPostings = { postings, adjustedPostings, featuredOpportunities, projectWork, internships, work,
      events, upcomingEvents, pastEvents
    }

    return allPostings

  }

  formChangeHandler = (eventName,eventValue) => {
    console.log('formChangeHandler called')

    if (eventName === 'search') {

      const searchString = eventValue

      //reset everything
      let type = ''

      let isEvents = false
      if (this.state.subNavSelected === 'Events') {
        isEvents = true
      } else if (this.state.viewIndex === 1) {
        isEvents = true
      }

      let isProjects = false
      if (this.state.subNavSelected === 'Projects') {
        isProjects = true
      } else if (this.state.viewIndex === 5) {
        isProjects = true
      }

      let isWork = false
      if (this.state.subNavSelected === 'Work') {
        isWork = true
      } else if (this.state.viewIndex === 7) {
        isWork = true
      }

      let isAll = false
      if (this.state.subNavSelected === 'All') {
        isAll = true
      } else if (this.state.viewIndex === 8) {
        isAll = true
      }

      if (isEvents) {
        // events
        type = 'Event'
        let eventFilters = this.state.eventFilters
        for (let i = 1; i <= eventFilters.length; i++) {
          eventFilters[i - 1]['value'] = this.state.defaultFilterOption
        }

        let eventSorters = this.state.eventSorters
        for (let i = 1; i <= eventSorters.length; i++) {
          eventSorters[i - 1]['value'] = this.state.defaultSortOption
        }

        this.setState({ searchString, eventFilters, eventSorters, animating: true })

      } else if (isProjects) {
        // projects
        type = 'Project'
        let projectFilters = this.state.projectFilters
        for (let i = 1; i <= projectFilters.length; i++) {
          projectFilters[i - 1]['value'] = this.state.defaultFilterOption
        }

        let projectSorters = this.state.projectSorters
        for (let i = 1; i <= projectSorters.length; i++) {
          projectSorters[i - 1]['value'] = this.state.defaultSortOption
        }

        this.setState({ searchString, projectFilters, projectSorters, animating: true })

      } else if (isWork) {
        // work
        type = 'Work'
        let workFilters = this.state.workFilters
        for (let i = 1; i <= workFilters.length; i++) {
          workFilters[i - 1]['value'] = this.state.defaultFilterOption
        }

        let workSorters = this.state.workSorters
        for (let i = 1; i <= workSorters.length; i++) {
          workSorters[i - 1]['value'] = this.state.defaultSortOption
        }

        this.setState({ searchString, workFilters, workSorters, animating: true })

      } else if (isAll) {
        // all
        type = 'All'
        let allFilters = this.state.allFilters
        for (let i = 1; i <= allFilters.length; i++) {
          allFilters[i - 1]['value'] = this.state.defaultFilterOption
        }

        let allSorters = this.state.allSorters
        for (let i = 1; i <= allSorters.length; i++) {
          allSorters[i - 1]['value'] = this.state.defaultSortOption
        }

        this.setState({ searchString, allFilters, allSorters, animating: true })

      }

      this.filterResults(eventValue, '', null, null, true, type)

    } else if (eventName.includes('filter|')) {

      let type = ''
      let filters = []
      let index = 0

      let isEvents = false
      if (this.state.subNavSelected === 'Events') {
        isEvents = true
      } else if (this.state.viewIndex === 1) {
        isEvents = true
      }
      let isProjects = false
      if (this.state.subNavSelected === 'Projects') {
        isProjects = true
      } else if (this.state.viewIndex === 5) {
        isProjects = true
      }

      let isWork = false
      if (this.state.subNavSelected === 'Work') {
        isWork = true
      } else if (this.state.viewIndex === 7) {
        isWork = true
      }

      let isAll = false
      if (this.state.subNavSelected === 'All') {
        isAll = true
      } else if (this.state.viewIndex === 8) {
        isAll = true
      }

      if (isEvents) {
        // events
        type = 'Event'

        let eventFilters = this.state.eventFilters
        filters = eventFilters

        const nameArray = eventName.split("|")
        const field = nameArray[1]

        for (let i = 1; i <= filters.length; i++) {
          if (filters[i - 1].name === field) {
            filters[i - 1]['value'] = eventValue
            index = i - 1
          }
        }

        //reset everything
        let searchString = ''
        for (let i = 1; i <= filters.length; i++) {
          if (filters[i - 1].name !== field) {
            filters[i - 1]['value'] = this.state.defaultFilterOption
          }
        }

        let eventSorters = this.state.eventSorters
        for (let i = 1; i <= eventSorters.length; i++) {
          eventSorters[i - 1]['value'] = this.state.defaultSortOption
        }

        eventFilters = filters

        this.setState({ filters, animating: true, searchString, eventFilters, eventSorters, selectedValue: eventValue })
      } else if (isProjects) {

        // projects
        type = 'Project'
        let projectFilters = this.state.projectFilters
        filters = projectFilters

        const nameArray = eventName.split("|")
        const field = nameArray[1]

        for (let i = 1; i <= filters.length; i++) {
          if (filters[i - 1].name === field) {
            filters[i - 1]['value'] = eventValue
            index = i - 1
          }
        }

        //reset everything
        let searchString = ''
        for (let i = 1; i <= filters.length; i++) {
          if (filters[i - 1].name !== field) {
            filters[i - 1]['value'] = this.state.defaultFilterOption
          }
        }

        let projectSorters = this.state.projectSorters
        for (let i = 1; i <= projectSorters.length; i++) {
          projectSorters[i - 1]['value'] = this.state.defaultSortOption
        }

        projectFilters = filters

        this.setState({ filters, animating: true, searchString, projectFilters, projectSorters, selectedValue: eventValue })

      } else if (isWork) {
        // work
        type = 'Work'
        let workFilters = this.state.workFilters
        filters = workFilters

        const nameArray = eventName.split("|")
        const field = nameArray[1]

        for (let i = 1; i <= filters.length; i++) {
          if (filters[i - 1].name === field) {
            filters[i - 1]['value'] = eventValue
            index = i - 1
          }
        }

        //reset everything
        let searchString = ''
        for (let i = 1; i <= filters.length; i++) {
          if (filters[i - 1].name !== field) {
            filters[i - 1]['value'] = this.state.defaultFilterOption
          }
        }

        let workSorters = this.state.workSorters
        for (let i = 1; i <= workSorters.length; i++) {
          workSorters[i - 1]['value'] = this.state.defaultSortOption
        }

        workFilters = filters

        this.setState({ filters, animating: true, searchString, workFilters, workSorters, selectedValue: eventValue })
      } else if (isAll) {
        // all
        type = 'All'
        let allFilters = this.state.allFilters
        filters = allFilters

        const nameArray = eventName.split("|")
        const field = nameArray[1]

        for (let i = 1; i <= filters.length; i++) {
          if (filters[i - 1].name === field) {
            filters[i - 1]['value'] = eventValue
            index = i - 1
          }
        }

        //reset everything
        let searchString = ''
        for (let i = 1; i <= filters.length; i++) {
          if (filters[i - 1].name !== field) {
            filters[i - 1]['value'] = this.state.defaultFilterOption
          }
        }

        let allSorters = this.state.allSorters
        for (let i = 1; i <= allSorters.length; i++) {
          allSorters[i - 1]['value'] = this.state.defaultSortOption
        }

        allFilters = filters

        this.setState({ filters, animating: true, searchString, allFilters, allSorters, selectedValue: eventValue })
      }

      this.filterResults(this.state.searchString, eventValue, filters, index, false, type)

    } else if (eventName.includes('sort|')) {

      let type = ''

      let isEvents = false
      if (this.state.subNavSelected === 'Events') {
        isEvents = true
      } else if (this.state.viewIndex === 1) {
        isEvents = true
      }
      let isProjects = false
      if (this.state.subNavSelected === 'Projects') {
        isProjects = true
      } else if (this.state.viewIndex === 5) {
        isProjects = true
      }

      let isWork = false
      if (this.state.subNavSelected === 'Work') {
        isWork = true
      } else if (this.state.viewIndex === 7) {
        isWork = true
      }

      let isAll = false
      if (this.state.subNavSelected === 'All') {
        isAll = true
      } else if (this.state.viewIndex === 8) {
        isAll = true
      }

      if (isEvents) {
        type = 'Event'

        let eventSorters = this.state.eventSorters
        const nameArray = eventName.split("|")
        const field = nameArray[1]

        // let index = 0
        for (let i = 1; i <= eventSorters.length; i++) {
          if (eventSorters[i - 1].name === field) {
            eventSorters[i - 1]['value'] = eventValue
            // index = i - 1
          }
        }

        //reset everything
        let searchString = ''
        let eventFilters = this.state.eventFilters
        for (let i = 1; i <= eventFilters.length; i++) {
          eventFilters[i - 1]['value'] = this.state.defaultFilterOption
        }

        for (let i = 1; i <= eventSorters.length; i++) {
          if (eventSorters[i - 1].name !== field) {
            eventSorters[i - 1]['value'] = this.state.defaultSortOption
          }
        }

        this.setState({ searchString, eventFilters, eventSorters, animating: true, selectedValue: eventValue })
      } else if (isProjects) {
        type = 'Project'
        let projectSorters = this.state.projectSorters
        const nameArray = eventName.split("|")
        const field = nameArray[1]

        // let index = 0
        for (let i = 1; i <= projectSorters.length; i++) {
          if (projectSorters[i - 1].name === field) {
            projectSorters[i - 1]['value'] = eventValue
            // index = i - 1
          }
        }

        //reset everything
        let searchString = ''
        let projectFilters = this.state.projectFilters
        for (let i = 1; i <= projectFilters.length; i++) {
          projectFilters[i - 1]['value'] = this.state.defaultFilterOption
        }

        for (let i = 1; i <= projectSorters.length; i++) {
          if (projectSorters[i - 1].name !== field) {
            projectSorters[i - 1]['value'] = this.state.defaultSortOption
          }
        }

        this.setState({ searchString, projectFilters, projectSorters, animating: true, selectedValue: eventValue })
      } else if (isWork) {
        type = 'Work'
        let workSorters = this.state.workSorters
        const nameArray = eventName.split("|")
        const field = nameArray[1]

        // let index = 0
        for (let i = 1; i <= workSorters.length; i++) {
          if (workSorters[i - 1].name === field) {
            workSorters[i - 1]['value'] = eventValue
            // index = i - 1
          }
        }

        //reset everything
        let searchString = ''
        let workFilters = this.state.workFilters
        for (let i = 1; i <= workFilters.length; i++) {
          workFilters[i - 1]['value'] = this.state.defaultFilterOption
        }

        for (let i = 1; i <= workSorters.length; i++) {
          if (workSorters[i - 1].name !== field) {
            workSorters[i - 1]['value'] = this.state.defaultSortOption
          }
        }

        this.setState({ searchString, workFilters, workSorters, animating: true, selectedValue: eventValue })
      } else if (isAll) {
        type = 'All'
        let allSorters = this.state.allSorters
        const nameArray = eventName.split("|")
        const field = nameArray[1]

        // let index = 0
        for (let i = 1; i <= allSorters.length; i++) {
          if (allSorters[i - 1].name === field) {
            allSorters[i - 1]['value'] = eventValue
            // index = i - 1
          }
        }

        //reset everything
        let searchString = ''
        let allFilters = this.state.allFilters
        for (let i = 1; i <= allFilters.length; i++) {
          allFilters[i - 1]['value'] = this.state.defaultFilterOption
        }

        for (let i = 1; i <= allSorters.length; i++) {
          if (allSorters[i - 1].name !== field) {
            allSorters[i - 1]['value'] = this.state.defaultSortOption
          }
        }

        this.setState({ searchString, allFilters, allSorters, animating: true, selectedValue: eventValue })
      }

      const nameArray = eventName.split("|")
      const field = nameArray[1]
      this.sortResults(eventValue, field, type)
    } else if (eventName.includes('useCase')) {
      const nameArray = eventName.split("|")
      const index = Number(nameArray[1].trim())

      let useCases = this.state.useCases
      // useCases[index]["value"] = eventValue
      for (let i = 1; i <= useCases.length; i++) {
        if (i - 1 === index) {
          useCases[index]["selected"] = true
        } else {
          useCases[index]["selected"] = false
        }
      }

      let matchingCriteria = this.state.matchingCriteria
      if (useCases[index].name === 'Interests') {
        // max interests, personality

         matchingCriteria[0]["value"] = 0 // work function
         matchingCriteria[1]["value"] = 0 // industry
         matchingCriteria[2]["value"] = 0 // location
         matchingCriteria[3]["value"] = 0 // pay
         matchingCriteria[4]["value"] = 0 // stability
         matchingCriteria[5]["value"] = 60 // interests
         matchingCriteria[6]["value"] = 40 // personality
         matchingCriteria[7]["value"] = 0 // values
         matchingCriteria[8]["value"] = 0 // skills
         matchingCriteria[9]["value"] = 0 // education
         matchingCriteria[10]["value"] = 0 // projects
         matchingCriteria[11]["value"] = 0 // experience

      } else if (useCases[index].name === 'Competitive Advantage') {
        // max rare, in-demand skills

        matchingCriteria[0]["value"] = 0 // work function
        matchingCriteria[1]["value"] = 0 // industry
        matchingCriteria[2]["value"] = 0 // location
        matchingCriteria[3]["value"] = 0 // pay
        matchingCriteria[4]["value"] = 0 // stability
        matchingCriteria[5]["value"] = 0 // interests
        matchingCriteria[6]["value"] = 0 // personality
        matchingCriteria[7]["value"] = 0 // values
        matchingCriteria[8]["value"] = 70 // skills
        matchingCriteria[9]["value"] = 10 // education
        matchingCriteria[10]["value"] = 10 // projects
        matchingCriteria[11]["value"] = 10 // experience

      } else if (useCases[index].name === 'Purpose') {
        // max interests, mission-driven opportunities
        matchingCriteria[0]["value"] = 0 // work function
        matchingCriteria[1]["value"] = 25 // industry
        matchingCriteria[2]["value"] = 0 // location
        matchingCriteria[3]["value"] = 0 // pay
        matchingCriteria[4]["value"] = 0 // stability
        matchingCriteria[5]["value"] = 50 // interests
        matchingCriteria[6]["value"] = 0 // personality
        matchingCriteria[7]["value"] = 25 // values
        matchingCriteria[8]["value"] = 0 // skills
        matchingCriteria[9]["value"] = 0 // education
        matchingCriteria[10]["value"] = 0 // projects
        matchingCriteria[11]["value"] = 0 // experience

      } else if (useCases[index].name === 'Stability') {
        // max interests
        matchingCriteria[0]["value"] = 0 // work function
        matchingCriteria[1]["value"] = 0 // industry
        matchingCriteria[2]["value"] = 0 // location
        matchingCriteria[3]["value"] = 0 // pay
        matchingCriteria[4]["value"] = 100 // stability
        matchingCriteria[5]["value"] = 0 // interests
        matchingCriteria[6]["value"] = 0 // personality
        matchingCriteria[7]["value"] = 0 // values
        matchingCriteria[8]["value"] = 0 // skills
        matchingCriteria[9]["value"] = 0 // education
        matchingCriteria[10]["value"] = 0 // projects
        matchingCriteria[11]["value"] = 0 // experience

      } else if (useCases[index].name === 'Pay') {
        // max pay
        matchingCriteria[0]["value"] = 0 // work function
        matchingCriteria[1]["value"] = 0 // industry
        matchingCriteria[2]["value"] = 0 // location
        matchingCriteria[3]["value"] = 100 // pay
        matchingCriteria[4]["value"] = 0 // stability
        matchingCriteria[5]["value"] = 0 // interests
        matchingCriteria[6]["value"] = 0 // personality
        matchingCriteria[7]["value"] = 0 // values
        matchingCriteria[8]["value"] = 0 // skills
        matchingCriteria[9]["value"] = 0 // education
        matchingCriteria[10]["value"] = 0 // projects
        matchingCriteria[11]["value"] = 0 // experience

      } else if (useCases[index].name === 'Recognition') {
        // max social, artistic, prestige, client-facing (sales)
        matchingCriteria[0]["value"] = 10 // work function
        matchingCriteria[1]["value"] = 30 // industry
        matchingCriteria[2]["value"] = 0 // location
        matchingCriteria[3]["value"] = 0 // pay
        matchingCriteria[4]["value"] = 0 // stability
        matchingCriteria[5]["value"] = 40 // interests
        matchingCriteria[6]["value"] = 0 // personality
        matchingCriteria[7]["value"] = 0 // values
        matchingCriteria[8]["value"] = 20 // skills
        matchingCriteria[9]["value"] = 0 // education
        matchingCriteria[10]["value"] = 0 // projects
        matchingCriteria[11]["value"] = 0 // experience

      }

      this.setState({ useCases, matchingCriteria })
    } else if (eventName.includes('custom')) {
      const nameArray = eventName.split("|")
      const index = Number(nameArray[1].trim())

      const ogValue = this.state.matchingCriteria[index].value
      const diff = eventValue - ogValue
      const totalPercent = this.state.totalPercent + diff

      let matchingCriteria = this.state.matchingCriteria
      matchingCriteria[index]["value"] = Number(eventValue)
      this.setState({ matchingCriteria, totalPercent })
    }
  }

  filterResults(searchString, filterString, filters, index, search, type) {
    console.log('filterResults called', searchString, filterString, filters, index, search, type)

    // const emailId = this.state.emailId
    // const orgCode = this.state.org
    const defaultFilterOption = this.state.defaultFilterOption

    let postings = []
    if (this.state.subNavSelected === 'Events') {
      postings = this.state.events
    } else if (this.state.subNavSelected === 'Projects') {
      postings = this.state.projectWork
    } else if (this.state.subNavSelected === 'Work') {
      postings = this.state.work
    } else if (this.state.subNavSelected === 'All') {
      postings = this.state.postings
    }

    const emailId = this.state.emailId
    const roleName = this.state.roleName

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      // console.log('first matchScore: ', postings[0].matchScore, postings[0].title, postings[0].name)

      Axios.put('https://www.guidedcompass.com/api/postings/filter', {  searchString, filterString, filters, defaultFilterOption, index, search, postings, type, emailId, roleName })
      .then((response) => {
        console.log('Posting filter query attempted', response.data);

          if (response.data.success) {
            console.log('posting filter query worked')

            // console.log('second matchScore: ', response.data.postings[0].matchScore, response.data.postings[0].title, response.data.postings[0].name)

            const filterCriteriaArray = response.data.filterCriteriaArray
            const sortCriteriaArray = null

            if (self.state.subNavSelected === 'Events') {

              const filteredEvents = response.data.postings
              let filteredUpcomingEvents = []
              let filteredPastEvents = []
              for (let i = 1; i <= filteredEvents.length; i++) {
                if (filteredEvents[i - 1].startDate && new Date(filteredEvents[i - 1].startDate)) {
                  if ((new Date() - new Date(filteredEvents[i - 1].startDate)) > 0) {
                    filteredPastEvents.push(postings[i - 1])
                  } else {
                    filteredUpcomingEvents.push(postings[i - 1])
                  }
                }
              }
              self.setState({ filteredEvents, filteredUpcomingEvents, filteredPastEvents, animating: false, filterCriteriaArray, sortCriteriaArray })
            } else if (self.state.subNavSelected === 'Projects') {
              const filteredProjectWork = response.data.postings
              self.setState({ filteredProjectWork, animating: false, filterCriteriaArray, sortCriteriaArray })
            } else if (self.state.subNavSelected === 'Work') {
              const filteredWork = response.data.postings
              self.setState({ filteredWork, animating: false, filterCriteriaArray, sortCriteriaArray })
            } else if (self.state.subNavSelected === 'All') {
              const filteredPostings = response.data.postings
              self.setState({ filteredPostings, animating: false, filterCriteriaArray, sortCriteriaArray })
            }

          } else {
            console.log('posting filter query did not work', response.data.message)
            self.setState({ animating: false })
          }

      }).catch((error) => {
          console.log('Posting filter query did not work for some reason', error);
          self.setState({ animating: false })
      });
    }

    const delayFilter = () => {
      console.log('delayFilter called: ')
      clearTimeout(self.state.timerId)
      self.state.timerId = setTimeout(officiallyFilter, 1000)
    }

    delayFilter();
  }

  sortResults(sortString, sortName) {
    console.log('sortResults called', sortString, sortName)

    let postings = []
    if (this.state.viewIndex === 1) {
      postings = this.state.events
    } else if (this.state.viewIndex === 5) {
      postings = this.state.projectWork
    } else if (this.state.viewIndex === 7) {
      postings = this.state.work
    } else if (this.state.viewIndex === 8) {
      postings = this.state.postings
    }

    if (sortName === 'Match') {
      console.log('in benchmark match')

      // const appEnd = postings.length - 1
      //
      // for (let i = 1; i <= postings.length; i++) {
      //   const index = i - 1
      //
      //   Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId: this.state.emailId } })
      //   .then((response) => {
      //       console.log('query for assessment results worked');
      //
      //       if (response.data.success) {
      //
      //         console.log('actual assessment results', response.data)
      //
      //         let wpData = null
      //         if (response.data.results.workPreferenceAnswers) {
      //           wpData = response.data.results.workPreferenceAnswers
      //         }
      //
      //         let interestResults = null
      //         if (response.data.results.interestScores) {
      //           interestResults = response.data.results.interestScores
      //         }
      //
      //         let personalityResults = null
      //         if (response.data.results.personalityScores) {
      //           personalityResults = response.data.results.personalityScores
      //         }
      //
      //         const skillAnswers = null
      //
      //         let application = userDetails
      //         application['workPreferenceResults'] = wpData
      //         application['interestResults'] = interestResults
      //         application['personalityResults'] = personalityResults
      //         application['skillAnswers'] = skillAnswers
      //
      //         const selectedJob = { title: sortString, postType: 'Individual' }
      //         console.log('about to add benchmark')
      //         let benchmark = null
      //         for (let j = 1; j <= this.state.benchmarks.length; j++) {
      //           console.log('compare benchmarks: ',this.state.benchmarks[j - 1].title, sortString)
      //           if (this.state.benchmarks[j - 1].title === sortString) {
      //             benchmark = this.state.benchmarks[j - 1]
      //             console.log('got it')
      //           }
      //         }
      //         console.log('show benchmark: ', benchmark)
      //
      //         let endLoop = false
      //         if (index === appEnd) {
      //           endLoop = true
      //         }
      //
      //
      //         const activeOrg = this.state.activeOrg
      //         console.log('compare index and endLoop: ', index, appEnd, endLoop, activeOrg )
      //
      //         // pull benchmark
      //         const _id = postings[index].benchmarkId
      //         Axios.get('https://www.guidedcompass.com/api/benchmarks/byid', { params: { _id } })
      //         .then((response) => {
      //           console.log('Benchmarks query attempted', response.data);
      //
      //             if (response.data.success) {
      //               console.log('benchmark query worked')
      //               const benchmark = response.data.benchmark
      //
      //               if (benchmark) {
      //
      //                 Axios.post('https://www.guidedcompass.com/api/applications/matches', {
      //                   application, selectedJob, benchmark, activeOrg })
      //                 .then((response) => {
      //                   console.log('application matches query attempted within members')
      //                   if (response.data.success) {
      //                     //save values
      //                     console.log('Application matches save worked', response.data);
      //
      //                     filteredMembers.push(response.data.application)
      //                     console.log('at the end? 1', index, appEnd, endLoop, filteredMembers.length)
      //
      //                     if (endLoop) {
      //                       filteredMembers.sort(function(a,b) {
      //                         return b.match - a.match;
      //                       })
      //                       console.log('got in')
      //                       this.setState({ filteredMembers, animating: false });
      //                     }
      //
      //                   } else {
      //                     console.log('application matches did not work', response.data.message)
      //                     console.log('at the end? 2', index, appEnd, endLoop)
      //                     if (index === appEnd) {
      //                       filteredMembers.sort(function(a,b) {
      //                         return b.match - a.match;
      //                       })
      //                       console.log('got in')
      //                       this.setState({ filteredMembers, animating: false });
      //                     }
      //                   }
      //                 }).catch((error) => {
      //                     console.log('Application matches did not work for some reason', error);
      //                     console.log('at the end? 3', index, appEnd, endLoop)
      //                     if (index === appEnd) {
      //                       filteredMembers.sort(function(a,b) {
      //                         return b.match - a.match;
      //                       })
      //                       console.log('got in')
      //                       this.setState({ filteredMembers, animating: false });
      //                     }
      //                 });
      //               }
      //
      //             }
      //         })
      //
      //       } else {
      //         console.log('error response for assessments', response.data)
      //       }
      //   }).catch((error) => {
      //       console.log('query for assessment results did not work', error);
      //   })
      // }

    } else {

      Axios.put('https://www.guidedcompass.com/api/postings/sort', { sortString, postings, sortName })
      .then((response) => {
        console.log('Postings sort query attempted', response.data);

          if (response.data.success) {
            console.log('posting sort query worked')

            // THIS IS SUPER UNNECESSARY
            const filterCriteriaArray = null
            const sortCriteriaArray = response.data.sortCriteriaArray

            let isEvents = false
            if (this.state.subNavSelected === 'Events') {
              isEvents = true
            } else if (this.state.viewIndex === 1) {
              isEvents = true
            }

            let isProjects = false
            if (this.state.subNavSelected === 'Projects') {
              isProjects = true
            } else if (this.state.viewIndex === 5) {
              isProjects = true
            }

            let isWork = false
            if (this.state.subNavSelected === 'Work') {
              isWork = true
            } else if (this.state.viewIndex === 7) {
              isWork = true
            }

            let isAll = false
            if (this.state.subNavSelected === 'All') {
              isAll = true
            } else if (this.state.viewIndex === 8) {
              isAll = true
            }

            if (isEvents) {
              const filteredEvents = response.data.postings
              let filteredUpcomingEvents = []
              let filteredPastEvents = []
              for (let i = 1; i <= filteredEvents.length; i++) {
                if (filteredEvents[i - 1].startDate && new Date(filteredEvents[i - 1].startDate)) {
                  if ((new Date() - new Date(filteredEvents[i - 1].startDate)) > 0) {
                    filteredPastEvents.push(postings[i - 1])
                  } else {
                    filteredUpcomingEvents.push(postings[i - 1])
                  }
                }
              }
              this.setState({ filteredEvents, filteredUpcomingEvents, filteredPastEvents, animating: false, filterCriteriaArray, sortCriteriaArray })
            } else if (isProjects) {
              const filteredProjectWork = response.data.postings
              this.setState({ filteredProjectWork, animating: false, filterCriteriaArray, sortCriteriaArray })
            } else if (isWork) {
              const filteredWork = response.data.postings
              this.setState({ filteredWork, animating: false, filterCriteriaArray, sortCriteriaArray })
            } else if (isAll) {
              const filteredPostings = response.data.postings
              this.setState({ filteredPostings, animating: false, filterCriteriaArray, sortCriteriaArray })
            }

          } else {
            console.log('posting sort query did not work', response.data.message)
            this.setState({ animating: false })
          }

      }).catch((error) => {
          console.log('Posting sort query did not work for some reason', error);
          this.setState({ animating: false })
      });
    }
  }

  favoriteItem(item) {
    console.log('favoriteItem called', item)

    let itemId = item._id

    let favoritesArray = this.state.favorites

    if (favoritesArray.includes(itemId)){

      let index = favoritesArray.indexOf(itemId)
      if (index > -1) {
        favoritesArray.splice(index, 1);
      }

      Axios.post('https://www.guidedcompass.com/api/favorites/save', {
        favoritesArray, emailId: this.state.emailId
      })
      .then((response) => {
        console.log('attempting to save favorites')
        if (response.data.success) {
          console.log('saved successfully', response.data)
          //clear values
          this.setState({
            serverSuccessPlan: true,
            serverSuccessMessagePlan: 'Favorite saved!'
          })
        } else {
          console.log('did not save successfully')
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'error:' + response.data.message
          })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'there was an error saving favorites'
          })
      });

    } else {

      console.log('adding item: ', favoritesArray, itemId)
      favoritesArray.push(itemId)
      Axios.post('https://www.guidedcompass.com/api/favorites/save', {
        favoritesArray, emailId: this.state.emailId
      })
      .then((response) => {
        console.log('attempting to save favorites')
        if (response.data.success) {
          console.log('saved successfully', response.data)
          //clear values
          this.setState({
            serverSuccessPlan: true,
            serverSuccessMessagePlan: 'Favorite saved!'
          })
        } else {
          console.log('did not save successfully')
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'error:' + response.data.message
          })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'there was an error saving favorites'
          })
      });
    }

    console.log('favorites', favoritesArray)
    this.setState({ favorites: favoritesArray })
  }

  voteOnItem(problem, direction, index, featured) {
    console.log('voteOnItem called', this.state.filteredProjectWork)

    let filteredProjectWork = this.state.filteredProjectWork
    let filteredFeaturedOpportunities = this.state.filteredFeaturedOpportunities

    const _id = problem._id
    const emailId = this.state.emailId
    let changeUpvote = true
    const updatedAt = new Date()

    Axios.post('https://www.guidedcompass.com/api/problems', { _id, emailId, changeUpvote, updatedAt })
    .then((response) => {

      if (response.data.success) {
        //save values
        console.log('Problem save worked', response.data);

        const serverSuccessMessage = 'Problem successfully posted!'

        let upvotes = problem.upvotes
        let downvotes = problem.downvotes

        if (direction === 'up') {
          console.log('in up')

          if (upvotes.includes(this.state.emailId)) {
            const removeIndex = upvotes.indexOf(this.state.emailId)
            if (removeIndex > -1) {
              upvotes.splice(removeIndex, 1);

              // filteredProjectWork[index]['upvotes'] = upvotes
              if (featured) {
                filteredFeaturedOpportunities[index]['upvotes'] = upvotes
                for (let i = 1; i <= filteredProjectWork.length; i++) {
                  if (filteredProjectWork[i - 1]._id === filteredFeaturedOpportunities[index]._id) {
                    filteredProjectWork[i - 1]['upvotes'] = upvotes
                  }
                }
              } else {
                for (let i = 1; i <= filteredFeaturedOpportunities.length; i++) {
                  if (filteredFeaturedOpportunities[i - 1]._id === filteredProjectWork[index]._id) {
                    filteredFeaturedOpportunities[i - 1]['upvotes'] = upvotes
                  }
                }
                filteredProjectWork[index]['upvotes'] = upvotes
              }

              this.setState({ filteredProjectWork, filteredFeaturedOpportunities, serverSuccessMessage })

            }
          } else {

            upvotes.push(this.state.emailId)

            if (downvotes.includes(this.state.emailId)) {
              const removeIndex = downvotes.indexOf(this.state.emailId)
              if (removeIndex > -1) {
                downvotes.splice(removeIndex, 1);
              }

              // filteredProjectWork[index]['upvotes'] = upvotes
              // filteredProjectWork[index]['downvotes'] = downvotes
              if (featured) {
                filteredFeaturedOpportunities[index]['upvotes'] = upvotes
                filteredFeaturedOpportunities[index]['downvotes'] = downvotes

                for (let i = 1; i <= filteredProjectWork.length; i++) {
                  if (filteredProjectWork[i - 1]._id === filteredFeaturedOpportunities[index]._id) {
                    filteredProjectWork[i - 1]['upvotes'] = upvotes
                    filteredProjectWork[i - 1]['downvotes'] = downvotes
                  }
                }
              } else {
                for (let i = 1; i <= filteredFeaturedOpportunities.length; i++) {
                  if (filteredFeaturedOpportunities[i - 1]._id === filteredProjectWork[index]._id) {
                    filteredFeaturedOpportunities[i - 1]['upvotes'] = upvotes
                    filteredFeaturedOpportunities[i - 1]['downvotes'] = downvotes
                  }
                }
                filteredProjectWork[index]['upvotes'] = upvotes
                filteredProjectWork[index]['downvotes'] = downvotes
              }

              this.setState({ filteredProjectWork, filteredFeaturedOpportunities, serverSuccessMessage })

            } else {

              if (featured) {
                filteredFeaturedOpportunities[index]['upvotes'] = upvotes

                for (let i = 1; i <= filteredProjectWork.length; i++) {
                  if (filteredProjectWork[i - 1]._id === filteredFeaturedOpportunities[index]._id) {
                    filteredProjectWork[i - 1]['upvotes'] = upvotes
                  }
                }
              } else {
                for (let i = 1; i <= filteredFeaturedOpportunities.length; i++) {
                  if (filteredFeaturedOpportunities[i - 1]._id === filteredProjectWork[index]._id) {
                    filteredFeaturedOpportunities[i - 1]['upvotes'] = upvotes
                  }
                }
                filteredProjectWork[index]['upvotes'] = upvotes
              }

              this.setState({ filteredProjectWork, filteredFeaturedOpportunities, serverSuccessMessage })
            }
          }

        } else {

          if (downvotes.includes(this.state.emailId)) {
            console.log('un-downvoting')
            const removeIndex = downvotes.indexOf(this.state.emailId)
            if (removeIndex > -1) {
              downvotes.splice(removeIndex, 1);
              for (let i = 1; i <= filteredFeaturedOpportunities.length; i++) {
                if (filteredFeaturedOpportunities[i - 1]._id === filteredProjectWork[index]._id) {
                  filteredFeaturedOpportunities[i - 1]['downvotes'] = upvotes
                }
              }
              filteredProjectWork[index]['downvotes'] = downvotes

              this.setState({ filteredProjectWork, filteredFeaturedOpportunities, serverSuccessMessage })
            }
          } else {
            console.log('initial downvote')
            downvotes.push(this.state.emailId)

            if (upvotes.includes(this.state.emailId)) {
              console.log('downvoting from previous upvote')
              const removeIndex = upvotes.indexOf(this.state.emailId)
              if (removeIndex > -1) {
                upvotes.splice(removeIndex, 1);
              }

              for (let i = 1; i <= filteredFeaturedOpportunities.length; i++) {
                if (filteredFeaturedOpportunities[i - 1]._id === filteredProjectWork[index]._id) {
                  filteredFeaturedOpportunities[i - 1]['upvotes'] = upvotes
                  filteredFeaturedOpportunities[i - 1]['downvotes'] = downvotes
                }
              }
              filteredProjectWork[index]['upvotes'] = upvotes
              filteredProjectWork[index]['downvotes'] = downvotes

              this.setState({ filteredProjectWork, filteredFeaturedOpportunities, serverSuccessMessage })
            } else {

              for (let i = 1; i <= filteredFeaturedOpportunities.length; i++) {
                if (filteredFeaturedOpportunities[i - 1]._id === filteredProjectWork[index]._id) {
                  filteredFeaturedOpportunities[i - 1]['downvotes'] = downvotes
                }
              }
              filteredProjectWork[index]['downvotes'] = downvotes
              this.setState({ filteredProjectWork, filteredFeaturedOpportunities, serverSuccessMessage })
            }
          }
        }

      } else {
        console.error('there was an error posting the talk / workshop');
        const serverErrorMessage = response.data.message
        this.setState({ serverErrorMessage })
      }
    }).catch((error) => {
        console.log('The talk post did not work', error);
    });
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

  toggleView(view) {
    console.log('toggleView called', view)

    if (view === 'featured') {
      this.setState({ viewIndex: 0 })
    } else if (view === 'events'){
      this.setState({ viewIndex: 1 })
    } else if (view === 'assignments'){
      this.setState({ viewIndex: 2 })
    } else if (view === 'problems') {
      this.setState({ viewIndex: 3 })
    } else if (view === 'challenges'){
      this.setState({ viewIndex: 4 })
    } else if (view === 'projectWork'){
      this.setState({ viewIndex: 5 })
    } else if (view === 'internships'){
      this.setState({ viewIndex: 6 })
    } else if (view === 'work'){
      this.setState({ viewIndex: 7 })
    }
  }

  renderOpportunities(type) {
    console.log('renderOpportunities called', type);

    let rows = [];

    let filteredPostings = []
    if (type === 'all') {
      filteredPostings = this.state.filteredPostings
    } else if (type === 'featured') {
      filteredPostings = this.state.filteredFeaturedOpportunities
    } else if (type === 'assignments') {
      filteredPostings = this.state.filteredAssignments
    } else if (type === 'problems') {
      filteredPostings = this.state.filteredProblems
    } else if (type === 'challenges') {
      filteredPostings = this.state.filteredChallenges
    } else if (type === 'projectWork') {
      filteredPostings = this.state.filteredProjectWork
    } else if (type === 'internships') {
      filteredPostings = this.state.filteredInternships
    } else if (type === 'work') {
      filteredPostings = this.state.filteredWork
    } else if (type === 'events') {
      filteredPostings = this.state.upcomingEvents
    }

    for (let i = 1; i <= filteredPostings.length; i++) {
      console.log(i);

      // const index = i - 1
      const posting = filteredPostings[i - 1]
      let isActive = true

      let postingIcon = opportunitiesIconBlue

      if (posting.postType === 'Event') {
        postingIcon = eventIconBlue
      } else if (posting.postType === 'Assignment' || posting.projectPromptType === 'Assignment') {
        postingIcon = assignmentsIconBlue
      } else if (posting.postType === 'Problem' || posting.projectPromptType === 'Problem') {
        postingIcon = problemIconBlue
      } else if (posting.postType === 'Challenge' || posting.projectPromptType === 'Challenge') {
        postingIcon = challengeIconBlue
      } else if (posting.postType === 'Internship') {
        if (!posting.isActive) {
          isActive = false
        }
      } else if (posting.postType === 'Work') {
        postingIcon = opportunitiesIconBlue
        if (!posting.isActive) {
          isActive = false
        }
      } else if (posting.postType === 'Scholarship') {
        postingIcon = moneyIconBlue
      }

      if (posting.imageURL) {
        postingIcon = posting.imageURL
      }

      if (isActive) {
        let title = posting.title
        if (!posting.title) {
          title = posting.name
        }

        let subtitle1 = posting.employerName

        let subtitle2 = posting.postType
        if (posting.politicalParty && posting.politicalParty !== '') {
          if (subtitle2 === '') {
            subtitle2 = posting.politicalParty
          } else {
            subtitle2 = subtitle2 + ' | ' + posting.politicalParty
          }
        }

        if (posting.field && posting.field !== '') {
          if (subtitle2 === '') {
            subtitle2 = posting.field.split("|")[0].trim()
          } else {
            subtitle2 = subtitle2 + ' | ' + posting.field.split("|")[0].trim()
          }
        }

        if (posting.industry && posting.industry !== '') {
          if (subtitle2 === '') {
            subtitle2 = posting.industry
          } else {
            subtitle2 = subtitle2 + ' | Industry: ' + posting.industry
          }
        }

        if (posting.difficultyLevel && posting.difficultyLevel !== '') {
          if (subtitle2 === '') {
            subtitle2 = posting.difficultyLevel
          } else {
            subtitle2 = subtitle2 + ' | Difficulty Level: ' + posting.difficultyLevel
          }
        }

        if (posting.submissionDeadline) {
          if (subtitle2 === '') {
            subtitle2 = 'Deadline :' + convertDateToString(new Date(posting.submissionDeadline),"datetime-2")
          } else {
            subtitle2 = subtitle2 + ' | Deadline: ' + convertDateToString(new Date(posting.submissionDeadline),"datetime-2")
          }
        }

        if (posting.startDate) {
          if (subtitle2 === '') {
            subtitle2 = convertDateToString(new Date(posting.startDate),"datetime-2")
          } else {
            subtitle2 = subtitle2 + ' | Start Date: ' + convertDateToString(new Date(posting.startDate),"datetime-2")
          }
        }

        rows.push(
          <View key={i}>
            <View style={styles.spacer} />

            <View style={[styles.rowDirection]}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: posting})} style={[styles.calcColumn110,styles.rowDirection]}>
                <View style={[styles.width50]}>
                  {(posting.matchScore) ? (
                    <View style={styles.padding5}>
                      <Progress.Circle progress={posting.matchScore / 100} size={styles.width40.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                    </View>
                  ) : (
                    <Image source={{ uri: postingIcon}} style={[styles.square40,styles.topMargin5,styles.centerItem,styles.contain]} />
                  )}
                </View>
                <View style={[styles.calcColumn160]}>
                  <Text style={[styles.headingText5]}>{title}</Text>
                  <Text style={[styles.descriptionText1]}>{subtitle1}</Text>
                  <Text style={[styles.descriptionText2]}>{subtitle2}</Text>
                  {((posting.subPostType === 'Full-Time' || posting.subPostType === 'Part-Time') && (posting.payRange)) && (
                    <View>
                      <Text style={[styles.descriptionText3,styles.ctaColor,styles.boldText,styles.topPadding5]}>{posting.payRange}</Text>
                    </View>
                  )}
                  {(posting.createdAt) && (
                    <View style={[styles.topPadding,styles.horizontalPadding5]}>
                      <Text style={[styles.descriptionText4,styles.descriptionTextColor,styles.boldText,styles.fullScreenWidth]}>Posted {convertDateToString(posting.createdAt,"daysAgo")}</Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <View>
                <View style={[styles.leftPadding,styles.rowDirection]}>
                  <View style={[styles.rightPadding]}>
                    {((this.state.applications && this.state.applications.some(app => app.postingId === posting._id)) || (posting.submissions && posting.submissions.some(sub => sub.userEmail === this.state.emailId))) ? (
                      <View style={[styles.topMargin]}>
                        <Image source={{ uri: appliedIconBlue}} style={[styles.square22,styles.contain]}/>
                      </View>
                    ) : (
                      <View>
                        {(this.state.rsvps && this.state.rsvps.some(rsvp => rsvp.postingId === posting._id)) && (
                          <View style={[styles.topMargin]}>
                            <Image source={{ uri: rsvpIconBlue}} style={[styles.square22,styles.contain,styles.pinRight]}/>
                          </View>
                        )}
                      </View>
                    )}

                    <TouchableOpacity style={[styles.topMargin]} onPress={() => this.favoriteItem(posting) }>
                      <Image source={(this.state.favorites.includes(posting._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity style={[styles.topMargin]} onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: posting})}>
                      <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain,styles.pinRight]}/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>

            {(this.state.sortCriteriaArray && this.state.sortCriteriaArray[i - 1] && this.state.sortCriteriaArray[i - 1].name) ? (
              <View style={[styles.leftPadding50]}>
                {(this.state.sortCriteriaArray.length > 0) && (
                  <View>
                    <View style={styles.halfSpacer} />
                    <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.sortCriteriaArray[i - 1].name}: {this.state.sortCriteriaArray[i - 1].criteria}</Text>
                  </View>
                )}
              </View>
            ) : (
              <View />
            )}

            {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[i - 1] && this.state.filterCriteriaArray[i - 1].name) ? (
              <View style={[styles.leftPadding50]}>
                <View style={styles.halfSpacer} />
                <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.filterCriteriaArray[i - 1].name}: {this.state.filterCriteriaArray[i - 1].criteria}</Text>
              </View>
            ) : (
              <View />
            )}
            <View style={styles.spacer} /><View style={styles.spacer} />
            <View style={[styles.horizontalLine]} />

            <View style={styles.spacer} />
          </View>
        )
      }
    }

    if (type === 'events' && this.state.filteredPastEvents && this.state.filteredPastEvents.length > 0) {
      rows.push(
        <View key="past" style={[styles.row30]}>
          <Text style={[styles.headingText3]}>Past Events</Text>
        </View>
      )

      const filteredPastEvents = this.state.filteredPastEvents
      for (let i = 1; i <= filteredPastEvents.length; i++) {
        console.log(i);

        const index = i - 1

        rows.push(
          <View key={"past|" +i}>
            <View style={styles.spacer} />
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: this.state.filteredPastEvents[index]})} style={[styles.calcColumn80,styles.rowDirection]}>
              <View style={[styles.width50]}>
                {(this.state.filteredPastEvents[index].matchScore) ? (
                  <View style={styles.padding5}>
                    <Progress.Circle progress={this.state.filteredPastEvents[index].matchScore / 100} size={styles.width40.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                  </View>
                ) : (
                  <Image source={(this.state.filteredPastEvents[index].imageURL) ? { uri: this.state.filteredPastEvents[index].imageURL} : { uri: eventIconBlue}} style={[styles.square40,styles.contain,styles.centerItem]} />
                )}
                {(this.state.filteredPastEvents[index].createdAt) && (
                  <View style={[styles.topPadding,styles.horizontalPadding5]}>
                    <Text style={[styles.descriptionText4,styles.descriptionTextColor,styles.boldText,styles.fullScreenWidth,styles.centerText]}>{convertDateToString(this.state.filteredPastEvents[index].createdAt,"daysAgo")}</Text>
                  </View>
                )}
              </View>
              <View style={[styles.calcColumn130]}>
                <Text style={[styles.headingText5]}>{filteredPastEvents[i - 1].title}</Text>
                <Text style={[styles.descriptionText1]}>{filteredPastEvents[i - 1].orgName}</Text>
                <Text style={[styles.descriptionText2]}>{convertDateToString(new Date(filteredPastEvents[i - 1].startDate),"datetime-2")} - {convertDateToString(new Date(filteredPastEvents[i - 1].endDate),"datetime-2")}</Text>
                {(this.props.pageSource === 'landingPage') && (
                  <View style={[styles.row5]}>
                    <Text style={[styles.descriptionText2]}>Hosted by <Text style={[styles.ctaColor,styles.boldText]}>{filteredPastEvents[i - 1].orgName}</Text></Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
            <View style={[styles.leftPadding,styles.rowDirection]}>
              <View>
                <View style={styles.spacer}/>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: this.state.filteredPastEvents[index]})} >
                  <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                </TouchableOpacity>
              </View>
              {(this.state.path && this.state.path.includes('/app')) && (
                <View style={[styles.rightPadding15]}>
                  {(this.state.rsvps && this.state.rsvps.some(app => app.postingId === this.state.filteredPastEvents[index]._id)) && (
                    <View>
                      <Image source={{ uri: rsvpIconBlue}} style={[styles.square22,styles.contain]} />
                    </View>
                  )}
                  <TouchableOpacity style={[styles.topMargin]} onPress={() => this.favoriteItem(this.state.filteredPastEvents[i - 1]) }>
                    <Image source={(this.state.favorites.includes(this.state.filteredPastEvents[index]._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]} />
                  </TouchableOpacity>
                </View>
              )}
            </View>

            {(this.state.filteredPastEvents[i - 1].sortCriteria || this.state.sortCriteriaArray) && (
              <View style={[styles.leftPadding70]}>
                {(this.state.sortCriteriaArray.length > 0) && (
                  <View>
                    <View style={styles.halfSpacer} />
                    <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.sortCriteriaArray[i - 1].name}: {this.state.sortCriteriaArray[i - 1].criteria}</Text>
                  </View>
                )}
              </View>
            )}
            {(this.state.filteredPastEvents[i - 1].filterCriteria || this.state.filterCriteriaArray) && (
              <View style={[styles.leftPadding70]}>
                <View style={styles.halfSpacer} />
                <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.filterCriteriaArray[i - 1].name}: {this.state.filterCriteriaArray[i - 1].criteria}</Text>
              </View>
            )}
            <View style={styles.spacer} /><View style={styles.spacer} />
            <View style={[styles.horizontalLine]} />

            <View style={styles.spacer} />
          </View>
        )
      }
    }

    return rows;
  }

  renderManipulators(type) {
    console.log('renderManipulators called')

    if (type === 'filter') {
      let filters = []
      if (this.state.subNavSelected === 'Events') {
        // events
        filters = this.state.eventFilters
      } else if (this.state.subNavSelected === 'Projects') {
        // projects
        filters = this.state.projectFilters
      } else if (this.state.subNavSelected === 'Work') {
        // work
        filters = this.state.workFilters
      } else if (this.state.subNavSelected === 'All') {
        filters = this.state.allFilters
      }

      console.log('show filters: ', filters)

      if (filters) {

        let rows = []
        for (let i = 1; i <= filters.length; i++) {
          rows.push(
            <View key={filters[i - 1] + i.toString()}>
              <View style={[styles.row10]}>
                <Text style={[styles.descriptionTextColor,styles.descriptionText3]}>{filters[i - 1].name}</Text>
                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: filters[i - 1].name, selectedIndex: i - 1, selectedName: "filter|" + filters[i - 1].name, selectedValue: filters[i - 1].value, selectedOptions: filters[i - 1].options, selectedSubKey: null })}>
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
                      {filters[i - 1].options.map(value => <Picker.Item label={value} value={value} />)}
                    </Picker>
                  </View>
                )}
              </View>
            </View>
          )
        }

        return rows

      }
    } else if (type === 'sort') {
      let sorters = []

      if (this.state.subNavSelected === 'Events') {
        // events
        sorters = this.state.eventSorters
      } else if (this.state.subNavSelected === 'Projects') {
        // projects
        sorters = this.state.projectSorters
      } else if (this.state.subNavSelected === 'Work') {
        // work
        sorters = this.state.workSorters
      } else if (this.state.subNavSelected === 'All') {
        sorters = this.state.allSorters
      }

      if (sorters) {

        let rows = []
        for (let i = 1; i <= sorters.length; i++) {
          rows.push(
            <View key={sorters[i - 1] + i.toString()}>
              <View style={[styles.row10]}>
                <Text style={[styles.descriptionTextColor,styles.descriptionText3]}>{sorters[i - 1].name}</Text>
                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: sorters[i - 1].name, selectedIndex: i - 1, selectedName: "sort|" + sorters[i - 1].name, selectedValue: sorters[i - 1].value, selectedOptions: sorters[i - 1].options, selectedSubKey: null })}>
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
                      {sorters[i - 1].options.map(value => <Picker.Item label={value} value={value} />)}
                    </Picker>
                  </View>
                )}
              </View>
            </View>
          )
        }

        return rows

      }
    }
  }

  calculateMatches(matchingView, calcMatches, newPreferences, specificCriteria, resLimit, passedOrgCode) {
    console.log('calculateMatches called', matchingView, calcMatches, newPreferences, specificCriteria, resLimit, passedOrgCode)

    if (matchingView) {

      this.setState({ matchingView: true, errorMessage: null })

      if (this.state.postings) {

        if (!this.state.profile) {
          this.setState({ animating: false, matchingView: true, errorMessage: 'Please take career assessments before receiving personalized matches' })
        } else {
          this.setState({ animating: true, modalIsOpen: false })

          // orgCode: queryOrgCode, placementPartners, postType, postTypes, pathway
          const profile = this.state.profile
          let orgCode = this.state.orgCode
          if (!orgCode && passedOrgCode) {
            orgCode = passedOrgCode
          }
          const placementPartners = this.state.placementPartners

          const pathway = this.state.pathway

          let postType = this.state.postType
          let postTypes = this.state.postTypes
          postType = null
          postTypes = null
          // if (this.state.subNavSelected === 'All') {
          //   postType = null
          //   postTypes = null
          // } else if (this.state.subNavSelected === 'Featured') {
          //   postType === 'Featured'
          // } else if (this.state.subNavSelected === 'Work') {
          //   postType = null
          //   postTypes = ['Internship','Work']
          // } else if (this.state.subNavSelected === 'Projects') {
          //   postType = null
          //   postTypes = ['Assignment','Problem','Challenge']
          // } else if (this.state.subNavSelected === 'Events') {
          //   postType = null
          //   postTypes = ['Event']
          // }

          const matchingCriteria = this.state.matchingCriteria
          const useCases = this.state.useCases

          const self = this

          function officiallyCalculate() {
            console.log('officiallyCalculate called')

            const hourlyPayOptions = self.state.hourlyPayOptions
            const annualPayOptions = self.state.annualPayOptions
            const employeeCountOptions = self.state.employeeCountOptions
            const hourOptions = self.state.hourOptions

            const queryObject = {
              profile, orgCode, placementPartners, postType, postTypes, pathway, matchingCriteria, useCases,
              annualPayOptions, hourlyPayOptions, employeeCountOptions, hourOptions, specificCriteria, resLimit
            }

            // query postings on back-end
            Axios.put('https://www.guidedcompass.com/api/opportunities/matches', queryObject)
            .then((response) => {
              console.log('Opportunity matches attempted', response.data);

                if (response.data.success) {
                  console.log('opportunity match query worked')

                  let matchScores = response.data.matchScores

                  const allPostings = self.filterPostings(response.data.postings, null, matchScores)

                  const featuredOpportunities = allPostings.featuredOpportunities
                  const filteredFeaturedOpportunities = featuredOpportunities

                  const projectWork = allPostings.projectWork
                  const filteredProjectWork =  projectWork
                  const internships = allPostings.internships
                  const filteredInternships = internships
                  const work = allPostings.work
                  const filteredWork = work

                  const events = allPostings.events
                  const filteredEvents = events

                  const upcomingEvents = allPostings.upcomingEvents
                  const filteredUpcomingEvents = upcomingEvents
                  const pastEvents = allPostings.pastEvents
                  const filteredPastEvents = pastEvents

                  const adjustedPostings = allPostings.adjustedPostings
                  const postings = adjustedPostings
                  const filteredPostings = postings

                  self.setState({ animating: false, matchingView: true, matchScores,
                    postings, filteredPostings, featuredOpportunities, filteredFeaturedOpportunities,
                    work, filteredWork, internships, filteredInternships,
                    projectWork, filteredProjectWork,
                    events, filteredEvents, upcomingEvents, filteredUpcomingEvents, pastEvents, filteredPastEvents
                  })

                } else {
                  console.log('Opportunity match did not work', response.data.message)
                  self.setState({ animating: false, matchingView: true, errorMessage: 'there was an error: ' + response.data.message })
                }

            }).catch((error) => {
                console.log('Opportunity match did not work for some reason', error);
                self.setState({ animating: false, matchingView: true, errorMessage: 'there was an error' })
            });
          }

          if (newPreferences) {
            console.log('new preferences stated')

            // totalPercent must equal 100
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
      }
    } else {
      this.setState({ matchingView: false, errorMessage: null })
    }
  }

  subNavClicked(pageName) {
    console.log('subNavClicked called', pageName)

    this.setState({ subNavSelected: pageName })
    AsyncStorage.setItem('opportunitiesNavSelected', pageName)

  }

  closeModal() {
    this.setState({ modalIsOpen: false, showPicker: false, showMatchingCriteria: false });
  }

  itemClicked(name, value) {
    console.log('itemClicked called', name, value)

    const nameArray = name.split("|")
    const index = Number(nameArray[1].trim())

    let useCases = this.state.useCases
    // useCases[index]["value"] = eventValue
    for (let i = 1; i <= useCases.length; i++) {
      console.log('compare indices: ', i - 1, index)
      if (i - 1 === index) {
        useCases[i - 1]["selected"] = true
      } else {
        useCases[i - 1]["selected"] = false
      }
    }

    let matchingCriteria = this.state.matchingCriteria
    if (useCases[index].name === 'Interest') {
      // max interests, personality

       matchingCriteria[0]["value"] = 0 // work function
       matchingCriteria[1]["value"] = 0 // industry
       matchingCriteria[2]["value"] = 0 // location
       matchingCriteria[3]["value"] = 0 // pay
       matchingCriteria[4]["value"] = 0 // stability
       matchingCriteria[5]["value"] = 60 // interests
       matchingCriteria[6]["value"] = 40 // personality
       matchingCriteria[7]["value"] = 0 // values
       matchingCriteria[8]["value"] = 0 // skills
       matchingCriteria[9]["value"] = 0 // education
       matchingCriteria[10]["value"] = 0 // projects
       matchingCriteria[11]["value"] = 0 // experience

    } else if (useCases[index].name === 'Competitive Advantage') {
      // max rare, in-demand skills

      matchingCriteria[0]["value"] = 0 // work function
      matchingCriteria[1]["value"] = 0 // industry
      matchingCriteria[2]["value"] = 0 // location
      matchingCriteria[3]["value"] = 0 // pay
      matchingCriteria[4]["value"] = 0 // stability
      matchingCriteria[5]["value"] = 0 // interests
      matchingCriteria[6]["value"] = 0 // personality
      matchingCriteria[7]["value"] = 0 // values
      matchingCriteria[8]["value"] = 70 // skills
      matchingCriteria[9]["value"] = 10 // education
      matchingCriteria[10]["value"] = 10 // projects
      matchingCriteria[11]["value"] = 10 // experience

    } else if (useCases[index].name === 'Purpose') {
      // max interests, mission-driven opportunities
      matchingCriteria[0]["value"] = 0 // work function
      matchingCriteria[1]["value"] = 25 // industry
      matchingCriteria[2]["value"] = 0 // location
      matchingCriteria[3]["value"] = 0 // pay
      matchingCriteria[4]["value"] = 0 // stability
      matchingCriteria[5]["value"] = 50 // interests
      matchingCriteria[6]["value"] = 0 // personality
      matchingCriteria[7]["value"] = 25 // values
      matchingCriteria[8]["value"] = 0 // skills
      matchingCriteria[9]["value"] = 0 // education
      matchingCriteria[10]["value"] = 0 // projects
      matchingCriteria[11]["value"] = 0 // experience

    } else if (useCases[index].name === 'Stability') {
      // max interests
      matchingCriteria[0]["value"] = 0 // work function
      matchingCriteria[1]["value"] = 0 // industry
      matchingCriteria[2]["value"] = 0 // location
      matchingCriteria[3]["value"] = 0 // pay
      matchingCriteria[4]["value"] = 100 // stability
      matchingCriteria[5]["value"] = 0 // interests
      matchingCriteria[6]["value"] = 0 // personality
      matchingCriteria[7]["value"] = 0 // values
      matchingCriteria[8]["value"] = 0 // skills
      matchingCriteria[9]["value"] = 0 // education
      matchingCriteria[10]["value"] = 0 // projects
      matchingCriteria[11]["value"] = 0 // experience

    } else if (useCases[index].name === 'Pay') {
      // max pay
      matchingCriteria[0]["value"] = 0 // work function
      matchingCriteria[1]["value"] = 0 // industry
      matchingCriteria[2]["value"] = 0 // location
      matchingCriteria[3]["value"] = 100 // pay
      matchingCriteria[4]["value"] = 0 // stability
      matchingCriteria[5]["value"] = 0 // interests
      matchingCriteria[6]["value"] = 0 // personality
      matchingCriteria[7]["value"] = 0 // values
      matchingCriteria[8]["value"] = 0 // skills
      matchingCriteria[9]["value"] = 0 // education
      matchingCriteria[10]["value"] = 0 // projects
      matchingCriteria[11]["value"] = 0 // experience

    } else if (useCases[index].name === 'Recognition') {
      // max social, artistic, prestige, client-facing (sales)
      matchingCriteria[0]["value"] = 10 // work function
      matchingCriteria[1]["value"] = 10 // industry
      matchingCriteria[2]["value"] = 0 // location
      matchingCriteria[3]["value"] = 0 // pay
      matchingCriteria[4]["value"] = 0 // stability
      matchingCriteria[5]["value"] = 40 // interests
      matchingCriteria[6]["value"] = 10 // personality
      matchingCriteria[7]["value"] = 0 // values
      matchingCriteria[8]["value"] = 30 // skills
      matchingCriteria[9]["value"] = 0 // education
      matchingCriteria[10]["value"] = 0 // projects
      matchingCriteria[11]["value"] = 0 // experience
    }

    this.setState({ useCases, matchingCriteria })
  }

  render() {
    // console.log('show style: ', Style.styles)
    let headerClass = "calc-column-offset-45"
    let searchClass = "fixed-column-45"
    if (this.state.path && this.state.path.includes('/advisor/')) {
      headerClass = "calc-column-offset-90"
      searchClass = "fixed-column-90"
    }

    let mainClass = 'standard-container-2'
    let mainStyle = {}
    let mainStyle2 = {}
    let filterBackgroundClass = "standard-container-2"

    if (this.props.pageSource === 'Goal') {
      mainClass = ''
      mainStyle = {}
      mainStyle2 = {}
    }

    let oppTitle = 'Opportunities'
    if (this.state.adjustedPostings && this.state.adjustedPostings.length > 0) {
      oppTitle = this.state.adjustedPostings.length + ' Opportunities'
    }

    if (this.state.viewIndex === 1) {
      oppTitle = this.state.filteredEvents.length + ' Events'
    } else if (this.state.viewIndex === 5) {
       oppTitle = this.state.filteredProjectWork.length + ' Project Postings'
    } else if (this.state.viewIndex === 7) {
      oppTitle = this.state.filteredWork.length + ' Work Opportunities'
    }

    let postings = []
    if (this.state.subNavSelected === "All" && this.state.postings) {
      postings = this.state.postings
    } else if (this.state.subNavSelected === "Featured" && this.state.featuredOpportunities) {
      postings = this.state.featuredOpportunities
    } else if (this.state.subNavSelected === "Work" && this.state.work) {
      postings = this.state.work
    } else if (this.state.subNavSelected === "Projects" && this.state.projectWork) {
      postings = this.state.projectWork
    } else if (this.state.subNavSelected === "Events" && this.state.events) {
      postings = this.state.events
    }

    return (
        <ScrollView>
            <View>
              {(this.props.pageSource !== 'Goal') && (
                <View>
                  <View style={[styles.row10,styles.horizontalPadding,styles.cardClearPadding,styles.bottomMargin20]}>
                    <View>
                      {(this.state.matchingView) ? (
                        <View>
                          <View>
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.calcColumn80,styles.rowDirection]}>
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
                        </View>
                      ) : (
                        <View style={styles.rowDirection}>
                          <View style={(this.state.matchingView) ? [styles.row7,styles.horizontalPadding3,styles.topMarginNegative2,styles.fullScreenWidth] : [styles.row7,styles.horizontalPadding3,styles.topMargin]}>
                            <TouchableOpacity onPress={(this.state.matchingView) ? () => this.calculateMatches(false, false, false) : () => this.calculateMatches(true, true, false)} >
                              {(this.state.matchingView) ? <Image source={{ uri: matchIconSelected}} style={[styles.square30,styles.contain,styles.rightMargin]} /> : <Image source={{ uri: matchIcon}} style={[styles.square30,styles.contain,styles.rightMargin]} />}
                            </TouchableOpacity>
                          </View>

                          {(!this.state.matchingView) && (
                            <View style={styles.rowDirection}>
                              <View style={[styles.calcColumn100,styles.lightBorder,styles.topMargin15,styles.rightMargin10, styles.rowDirection]}>
                                <View style={[styles.row7,styles.horizontalPadding3,styles.topMargin3,styles.leftMargin5]}>
                                  <Image source={{ uri: searchIcon}} style={[styles.square17,styles.contain,styles.padding5]}/>
                                </View>
                                {(Platform.OS === 'ios') ? (
                                  <View style={[styles.calcColumn130,styles.topPadding3,styles.leftPadding5]}>
                                    {(this.props.passedType) ? (
                                      <TextInput
                                        style={[styles.height30,styles.descriptionText2]}
                                        onChangeText={(text) => this.formChangeHandler('search', text)}
                                        value={this.state.searchString}
                                        placeholder={"Search " + this.props.passedType.toLowerCase() + "s..."}
                                        placeholderTextColor="grey"
                                      />
                                    ) : (
                                      <TextInput
                                        style={[styles.height30,styles.descriptionText2]}
                                        onChangeText={(text) => this.formChangeHandler('search', text)}
                                        value={this.state.searchString}
                                        placeholder={"Search " + postings.length + ' Opportunities...'}
                                        placeholderTextColor="grey"
                                      />
                                    )}
                                  </View>
                                ) : (
                                  <View style={[styles.calcColumn130,styles.topPadding3,styles.leftPadding5]}>
                                    {(this.props.passedType) ? (
                                      <TextInput
                                        style={[styles.height40,styles.descriptionText2,styles.topMarginNegative5]}
                                        onChangeText={(text) => this.formChangeHandler('search', text)}
                                        value={this.state.searchString}
                                        placeholder={"Search " + this.props.passedType.toLowerCase() + "s..."}
                                        placeholderTextColor="grey"
                                      />
                                    ) : (
                                      <TextInput
                                        style={[styles.height40,styles.descriptionText2,styles.topMarginNegative5]}
                                        onChangeText={(text) => this.formChangeHandler('search', text)}
                                        value={this.state.searchString}
                                        placeholder={"Search " + postings.length + ' Opportunities...'}
                                        placeholderTextColor="grey"
                                      />
                                    )}
                                  </View>
                                )}

                              </View>

                              <View style={[styles.row7,styles.horizontalPadding3,styles.topMargin,styles.leftPadding]}>
                                <TouchableOpacity onPress={() => this.toggleSearchBar('show')} >
                                  {(this.state.showingSearchBar) ? <Image source={{ uri: filterIconSelected}} style={[styles.square25,styles.contain]} /> : <Image source={{ uri: filterIcon}} style={[styles.square25,styles.contain]} />}
                                </TouchableOpacity>
                              </View>
                            </View>
                          )}
                        </View>
                      )}

                      <View style={[styles.fullScreenWidth]}>
                        <ScrollView horizontal={true}>
                          {this.state.subNavCategories.map((value, index) =>
                            <View style={[styles.row10,styles.rightPadding]}>
                              {(this.state.subNavCategories[index] === this.state.subNavSelected) ? (
                                <View key={value} style={[styles.selectedCarouselItem,styles.height40,styles.flexCenter,styles.horizontalPadding15]}>
                                  <Text style={[styles.descriptionText1]}>{value}</Text>
                                </View>
                              ) : (
                                <View>
                                  {(value === 'All') && (
                                    <View>
                                      {(this.state.filteredPostings.length > 0) ? (
                                        <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding5]} onPress={() => this.subNavClicked(value)}>
                                          <View style={styles.rowDirection}>
                                            <Text style={[styles.descriptionText1]}>{value}</Text>
                                            <View style={[styles.notiBubbleSmall,styles.lightBackground,styles.leftMargin3]}><Text style={styles.descriptionText6}>{this.state.filteredPostings.length}</Text></View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding5]} onPress={() => this.subNavClicked(value)}>
                                          <Text style={[styles.descriptionText1]}>{value}</Text>
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  )}
                                  {(value === 'Featured') && (
                                    <View>
                                      {(this.state.filteredFeaturedOpportunities.length > 0) ? (
                                        <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding5]} onPress={() => this.subNavClicked(value)}>
                                          <View style={styles.rowDirection}>
                                            <Text style={[styles.descriptionText1]}>{value}</Text>
                                            <View style={[styles.notiBubbleSmall,styles.unselectedBackground,styles.leftMargin3]}><Text style={styles.descriptionText6}>{this.state.filteredFeaturedOpportunities.length}</Text></View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding5]} onPress={() => this.subNavClicked(value)}>
                                          <Text style={[styles.descriptionText1]}>{value}</Text>
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  )}
                                  {(value === 'Work') && (
                                    <View>
                                      {(this.state.filteredWork.length > 0) ? (
                                        <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding5]} onPress={() => this.subNavClicked(value)}>
                                          <View style={styles.rowDirection}>
                                            <Text style={[styles.descriptionText1]}>{value}</Text>
                                            <View style={[styles.notiBubbleSmall,styles.unselectedBackground,styles.leftMargin3]}><Text style={styles.descriptionText6}>{this.state.filteredWork.length}</Text></View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding5]} onPress={() => this.subNavClicked(value)}>
                                          <Text style={[styles.descriptionText1]}>{value}</Text>
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  )}
                                  {(value === 'Projects') && (
                                    <View>
                                      {(this.state.filteredProjectWork.length > 0) ? (
                                        <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding5]} onPress={() => this.subNavClicked(value)}>
                                          <View style={styles.rowDirection}>
                                            <Text style={[styles.descriptionText1]}>{value}</Text>
                                            <View style={[styles.notiBubbleSmall,styles.unselectedBackground,styles.leftMargin3]}><Text style={styles.descriptionText6}>{this.state.filteredProjectWork.length}</Text></View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding5]} onPress={() => this.subNavClicked(value)}>
                                          <Text style={[styles.descriptionText1]}>{value}</Text>
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  )}
                                  {(value === 'Events') && (
                                    <View>
                                      {(this.state.filteredEvents.length > 0) ? (
                                        <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding5]} onPress={() => this.subNavClicked(value)}>
                                          <View style={styles.rowDirection}>
                                            <Text style={[styles.descriptionText1]}>{value}</Text>
                                            <View style={[styles.notiBubbleSmall,styles.unselectedBackground,styles.leftMargin3]}><Text style={styles.descriptionText6}>{this.state.filteredEvents.length}</Text></View>
                                          </View>
                                        </TouchableOpacity>
                                      ) : (
                                        <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding5]} onPress={() => this.subNavClicked(value)}>
                                          <Text style={[styles.descriptionText1]}>{value}</Text>
                                        </TouchableOpacity>
                                      )}
                                    </View>
                                  )}
                                  {/*
                                  {(value === 'View External Jobs') && (
                                    <View style={[styles.leftPadding50,styles.topPadding]}>
                                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Jobs')}>
                                        <Text style={[styles.errorColor,styles.descriptionText2,styles.boldText]}>{value}</Text>
                                      </TouchableOpacity>
                                    </View>
                                  )}*/}
                                </View>
                              )}
                            </View>
                          )}
                        </ScrollView>
                      </View>
                    </View>
                  </View>

                  {(this.state.showingSearchBar) && (
                    <View style={[styles.card,styles.bottomMargin20]}>
                      <View>
                        {(this.state.subNavSelected !== "Featured") && (
                          <View>

                            <Text style={[styles.standardText]}>Filter</Text>
                            <View style={styles.halfSpacer} />
                            {(this.renderManipulators('filter'))}

                            <View style={styles.spacer} />
                            <View style={[styles.horizontalLine]} />
                            <View style={styles.spacer} /><View style={styles.spacer} />
                            <Text style={[styles.standardText]}>Sort</Text>
                            <View style={styles.halfSpacer} />
                            {(this.renderManipulators('sort'))}
                          </View>
                        )}

                      </View>
                    </View>
                  )}
                </View>
              )}

              <View>
                {(this.state.animating) ? (
                  <View style={styles.fullSpace}>
                    <View>
                      <ActivityIndicator
                         animating = {this.state.animating}
                         color = '#87CEFA'
                         size = "large"
                         style={[styles.square80, styles.centerHorizontally]}/>
                      <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                      <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Calculating results...</Text>

                    </View>
                  </View>
                ) : (
                  <View>

                    {(this.state.matchingView && this.state.errorMessage && this.state.errorMessage !== '') ? (
                      <View>
                        <View style={styles.fullSpace}>
                          <View>
                            <Text style={styles.errorColor}>{this.state.errorMessage}</Text>
                          </View>
                        </View>
                      </View>
                    ) : (
                      <View>
                        {(this.state.subNavSelected === 'All') && (
                          <View style={styles.card}>
                            {this.renderOpportunities('all')}
                          </View>
                        )}

                        {(this.state.subNavSelected === 'Featured') && (
                          <View style={styles.card}>
                            {this.renderOpportunities('featured')}
                          </View>
                        )}

                        {(this.state.subNavSelected === 'Work') && (
                          <View style={styles.card}>
                            {this.renderOpportunities('work')}
                          </View>
                        )}

                        {(this.state.subNavSelected === 'Projects') && (
                          <View style={styles.card}>
                            {this.renderOpportunities('projectWork')}
                          </View>
                        )}

                        {(this.state.subNavSelected === 'Events') && (
                          <View style={styles.card}>
                            {this.renderOpportunities('events')}
                          </View>
                        )}
                      </View>
                    )}

                  </View>
                )}
              </View>

            </View>

            <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>
              {(this.state.showMatchingCriteria) && (
                <ScrollView key="showMatchingCriteria" style={[styles.calcColumn80,styles.padding20]}>
                  <Text style={[styles.headingText2]}>Adjust Matching Criteria</Text>
                  <View style={styles.spacer} />

                  <View style={[styles.row10]}>

                    <View style={[styles.flex1,styles.rowDirection,styles.calcColumn100]}>
                      <TouchableOpacity style={[styles.flex50]} onPress={() => this.setState({ customAdjustment: false })}>
                        <View style={(this.state.customAdjustment) ? [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20] : [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20,styles.ctaBackgroundColor]}>
                          <Text style={(this.state.customAdjustment) ? [styles.descriptionText1,styles.centerText] : [styles.descriptionText1,styles.whiteColor,styles.centerText]}>Adjust by Needs</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity style={[styles.flex50]} onPress={() => this.setState({ customAdjustment: true })}>
                        <View style={(this.state.customAdjustment) ? [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20,styles.ctaBackgroundColor] : [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20]}>
                          <Text style={(this.state.customAdjustment) ? [styles.descriptionText1,styles.whiteColor,styles.centerText] : [styles.descriptionText1,styles.centerText]}>Custom Adjust</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={styles.spacer} />
                  </View>

                  {(this.state.customAdjustment) ? (
                    <View>

                      {(this.state.matchingCriteria) && (
                        <View>
                          {this.state.matchingCriteria.map((value ,index) =>
                            <View key={"c" + index} className={(value.name === 'Location') && [styles.washOut2]}>
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.calcColumn140]}>
                                  <Text style={[styles.boldText]}>{index + 1}. {value.name}</Text>
                                  <View style={styles.halfSpacer} />
                                  <Text style={[styles.descriptionText3]}>{value.description}</Text>
                                </View>
                                <View style={[styles.width100,styles.rightText,styles.rowDirection]}>
                                  <View style={[styles.width70]}>
                                    <TextInput
                                      style={[styles.textInput,styles.headingText2,styles.ctaColor,styles.boldText,styles.rightText,styles.standardBorder]}
                                      onChangeText={(text) => this.formChangeHandler("custom|" + index,text)}
                                      value={value.value}
                                      placeholder="Search 1,000+ careers..."
                                      placeholderTextColor="grey"
                                      disabled={(value.name === 'Location') ? true : false}
                                      keyboardType="numeric"
                                      min="0"
                                      max="100"
                                    />
                                  </View>
                                  <View style={[styles.width30]}>
                                    <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                                    <Text style={[styles.headingText2,styles.ctaColor,styles.boldText]}>%</Text>
                                  </View>
                                </View>
                              </View>

                              <View style={styles.spacer} /><View style={styles.halfSpacer} />

                            </View>
                          )}

                          <View>
                            <View style={[styles.ctaHorizontalLine]} />
                            <View style={styles.spacer} />
                            <View style={[styles.calcColumn60,styles.rightText]}>
                              <Text style={[styles.headingText2,styles.ctaColor,styles.boldText,styles.calcColumn60,styles.rightText]}>{this.state.totalPercent}%</Text>
                            </View>

                            {(this.state.totalPercent !== 100) && (
                              <View style={[styles.calcColumn60]}>
                                <Text style={[styles.errorColor,styles.rightText]}>Please adjust percentages to equal 100%</Text>
                              </View>
                            )}
                          </View>
                        </View>
                      )}
                    </View>
                  ) : (
                    <View>

                      {(this.state.useCases) && (
                        <View>
                          {this.state.useCases.map((value ,index) =>
                            <View key={"u" + index} style={(value.name === 'Purpose') && [styles.washOut2]}>
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.calcColumn90]}>
                                  <Text style={[styles.boldText]}>{index + 1}. {value.name}</Text>
                                  <View style={styles.halfSpacer} />
                                  <Text style={[styles.descriptionText3]}>{value.description}</Text>
                                </View>
                                <View style={[styles.width50,styles.centerHorizontally,styles.centerText,styles.topPadding5]}>

                                  <TouchableOpacity disabled={(value.name === 'Purpose') ? true : false} onPress={() => this.itemClicked('useCase|' + index, true)}>
                                    {(value.selected) ? (
                                      <View style={[styles.square22,styles.ctaBorder,styles.flexCenter, { borderRadius: 11 }]}>
                                        <View style={[styles.square10,styles.ctaBackgroundColor, { borderRadius: 5 }]}/>
                                      </View>
                                    ) : (
                                      <View style={[styles.square22,styles.standardBorder,styles.flexCenter, { borderRadius: 11 }]} />
                                    )}
                                  </TouchableOpacity>
                                </View>
                              </View>

                              <View style={styles.spacer} /><View style={styles.halfSpacer} />

                            </View>
                          )}

                        </View>
                      )}
                    </View>
                  )}

                  {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor]}>{this.state.errorMessage}</Text>}

                  <View style={[styles.row20,styles.rowDirection,styles.flexCenter,styles.flex1]}>
                    <View style={[styles.flex50,styles.rightPadding5]}>
                      <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.calculateMatches(true, true, true)}><Text style={[styles.descriptionText1,styles.whiteColor]}>Apply</Text></TouchableOpacity>
                    </View>
                    <View style={[styles.flex50,styles.leftPadding5]}>
                      <TouchableOpacity style={[styles.btnSquarish,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.descriptionText1,styles.ctaColor]}>Close View</Text></TouchableOpacity>
                    </View>
                  </View>

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

        </ScrollView>

    )
  }

}

export default Opportunities;
