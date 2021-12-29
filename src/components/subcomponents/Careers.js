import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, ActivityIndicator, TextInput, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont()
import Modal from 'react-native-modal';

const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const searchIcon = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png";
const dropdownArrow = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png";
const careerIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-blue.png';
const trendingUpIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/trending-up.png';
const moneyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/money-icon-blue.png';
const membersIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/members-icon-blue.png';
const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const matchIcon = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/match-icon.png";
const matchIconSelected = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/match-icon-selected.png";
const filterIcon = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/filter-icon.png";
const filterIconSelected = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/filter-icon-selected.png";

class Careers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      careers: [],
      itemFilters: [],
      itemSorters: [],

      favorites: [],

      totalPercent: 100,

      defaultFilterOption: 'All',
      defaultSortOption: 'No Sort Applied',
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.toggleSearchBar = this.toggleSearchBar.bind(this)
    this.renderManipulators = this.renderManipulators.bind(this)
    this.standardizeValue = this.standardizeValue.bind(this)
    this.pullSimilarCareeers = this.pullSimilarCareers.bind(this)
    this.calculateMatches = this.calculateMatches.bind(this)
    this.itemClicked = this.itemClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  retrieveData = async() => {
    try {

      console.log('retrieveData called in subCareers')
      const emailId = await AsyncStorage.getItem('email')
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
        console.log('email: ', emailId);

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, orgFocus, orgName, remoteAuth
        })

        const jobFamilyOptions = ['Management','Business and Financial Operations','Computer and Mathematical','Architecture and Engineering','Life, Physical, and Social Science','Community and Social Service','Legal','Education, Training, and Library','Arts, Design, Entertainment, Sports, and Media','Healthcare Practitioners and Technical','Healthcare Support','Protective Service','Food Preparation and Serving Related','Building and Grounds Cleaning and Maintenance','Personal Care and Service','Sales and Related','Office and Administrative Support','Farming, Fishing, and Forestry','Construction and Extraction','Installation, Maintenance, and Repair','Production','Transportation and Material Moving']
        const growthOptions = ['8% or higher','5% to 7%','3% to 4%','1% to 2%','-1% or lower']
        const payOptions = ['< $30,000','$30,000 - $50,000','$50,000 - $70,000','$70,000 - $100,000','$100,000 - $150,000','$150,000 - $208,000','$208,000+']
        const employmentOptions = ['< 10,000','10,000 - 50,000','50,000 - 100,000','100,000 - 200,000','200,000 - 300,000','300,000 - 500,000','500,000+']

        const itemFilters = [
          { name: 'Job Family', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(jobFamilyOptions)},
          { name: 'Growth', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(growthOptions)},
          { name: 'Pay', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(payOptions)},
          { name: 'Employment', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(employmentOptions)},
        ]

        const itemSorters = [
          // { name: 'Growth', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(growthOptions)},
          // { name: 'Pay', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(payOptions)},
          // { name: 'Employment', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(employmentOptions)},
          { name: 'Realistic', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(['High','Low'])},
          { name: 'Investigative', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(['High','Low'])},
          { name: 'Artistic', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(['High','Low'])},
          { name: 'Social', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(['High','Low'])},
          { name: 'Enterprising', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(['High','Low'])},
          { name: 'Conventional', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(['High','Low'])},
        ]

        this.setState({ itemFilters, itemSorters, animating: true })

        const excludeMissingOutlookData = true
        const excludeMissingJobZone = true

        if (this.props.pageSource !== 'Goal' && !this.props.calculateMatches) {
          Axios.get('https://www.guidedcompass.com/api/careers', { params: { excludeMissingOutlookData, excludeMissingJobZone } })
          .then((response) => {
            console.log('Careers query worked', response.data);

            if (response.data.success) {

              const careers = response.data.careers
              this.setState({ careers, animating: false })

            } else {
              console.log('no careers data found', response.data.message)
              this.setState({ animating: false })
            }

          }).catch((error) => {
              console.log('Careers query did not work', error);
              this.setState({ animating: false })
          });
        }

        let email = localStorage.getItem('email');
        this.setState({ emailId: email })

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
          { name: 'Purpose', description: 'Optimize for careers that may give you the most purpose (e.g., solving a global problem, or large problem I am specifically interested in)', selected: false }, // interests
          { name: 'Stability', description: 'Optimize for careers where you will likely have the most job stability.', selected: false }, // job growth, company size
          { name: 'Pay', description: 'Optimize for careers where you will be paid the most in the short to medium term.', selected: false }, // pay
          { name: 'Recognition', description: 'Optimize for careers where you will be provided positive reinforcement and public praise for your accomplishments.', selected: false }, // social, artistic
          { name: 'Interests', description: 'Optimize for careers where you have the most long-term, genuine interest in.', selected: false }, // interests, personality
          { name: 'Competitive Advantage', description: 'Optimize for careers where you have the highest competitive advantage amongst candidates in your peer group.', selected: false }, // skills
        ]

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
        .then((response) => {
          console.log('User details query 1 attempted', response.data);

          if (response.data.success) {
             console.log('successfully retrieved user details')

             let favorites = []
             if (response.data.user.favoritesArray) {
               favorites = response.data.user.favoritesArray
               console.log('favorites? ', favorites)
               this.setState({ favorites })
             }

             Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId: email } })
              .then((response2) => {
                console.log('query for assessment results worked');

                if (response2.data.success) {

                  console.log('actual assessment results', response2.data)

                  let profile = response.data.user
                  profile['workPreferences'] = response2.data.results.workPreferenceAnswers
                  profile['interests'] = response2.data.results.interestScores
                  profile['personality'] = response2.data.results.personalityScores
                  profile['skills'] = response2.data.results.newSkillAnswers
                  profile['gravitateValues'] = response2.data.results.topGravitateValues
                  profile['employerValues'] = response2.data.results.topEmployerValues

                  // let matchingCriteria = this.state.matchingCriteria
                  if (response.data.user.matchingPreferences && response.data.user.matchingPreferences.length > 0) {
                    matchingCriteria = response.data.user.matchingPreferences
                  }
                  if (response.data.user.matchingUseCases && response.data.user.matchingUseCases.length > 0) {
                    useCases = response.data.user.matchingUseCases
                  }

                  this.setState({ profile, matchingCriteria, useCases })

                  console.log('show the props in subCareers: ', this.props)
                  if (this.props.calculateMatches) {
                    this.calculateMatches(true, true, false)
                  } else if (this.props.pageSource === 'Goal') {
                    if (this.props.selectedGoal && this.props.selectedGoal.selectedCareers && this.props.selectedGoal.selectedCareers.length > 0) {
                      this.pullSimilarCareers(this.props.selectedGoal.selectedCareers)
                    } else {
                      this.calculateMatches(true, true, false)
                    }
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

                  if (this.props.calculateMatches) {
                    console.log('about to calculateMatches from props', this.props)
                    this.calculateMatches(true, true, false)
                  } else if (this.props.pageSource === 'Goal') {
                    if (this.props.selectedGoal && this.props.selectedGoal.selectedCareers && this.props.selectedGoal.selectedCareers.length > 0) {
                      this.pullSimilarCareers(this.props.selectedGoal.selectedCareers)
                    } else {
                      this.calculateMatches(true, true, false)
                    }
                  }
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

                if (this.props.calculateMatches) {
                  this.calculateMatches(true, true, false)
                }
            })

            Axios.get('https://www.guidedcompass.com/api/projects', { params: { emailId: email, includeCollaborations: true } })
            .then((response2) => {
              console.log('Projects query attempted', response2.data);

                if (response2.data.success && response2.data.projects) {
                  console.log('successfully retrieved projects')

                  let profile = response.data.user
                  profile['projects'] = response2.data.projects
                  this.setState({ profile })

                } else {
                  console.log('no project data found', response2.data.message)
                }

            }).catch((error) => {
                console.log('Project query did not work', error);
            });

            Axios.get('https://www.guidedcompass.com/api/experience', { params: { emailId: email } })
            .then((response2) => {
              console.log('Experience query attempted', response2.data);

                if (response2.data.success && response2.data.experience) {
                  console.log('successfully retrieved experience')

                  let profile = response.data.user
                  profile['experience'] = response2.data.experience
                  this.setState({ profile })

                } else {
                  console.log('no experience data found', response2.data.message)
                }

            }).catch((error) => {
                console.log('Experience query did not work', error);
            });

            Axios.get('https://www.guidedcompass.com/api/story', { params: { emailId: email } })
            .then((response2) => {
                console.log('Endorsement query worked', response2.data);

                if (response2.data.success) {

                  if (response2.data.stories) {
                    let profile = response.data.user
                    profile['endorsements'] = response2.data.stories
                    this.setState({ profile })
                  }
                } else {
                  console.log('no endorsements found: ', response2.data.message)
                }

            }).catch((error) => {
                console.log('Story query did not work', error);
            });

          } else {
           console.log('no user details data found', response.data.message)
          }

        }).catch((error) => {
           console.log('User details query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/workoptions')
        .then((response) => {
          console.log('Work options query tried', response.data);

          if (response.data.success) {
            console.log('Work options query succeeded')

            const hourOptions = response.data.workOptions[0].hourOptions

            this.setState({ hourOptions });
          }
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler(name, value) {
    console.log('formChangeHandler called')

    if (name === 'search') {
      this.setState({ searchString: value, animating: true })
      this.filterResults(value, null, null, null, true)
    } else if (name.includes('filter|')) {

      let itemFilters = this.state.itemFilters

      const nameArray = name.split("|")
      const field = nameArray[1]

      let index = 0
      for (let i = 1; i <= itemFilters.length; i++) {
        if (itemFilters[i - 1].name === field) {
          itemFilters[i - 1]['value'] = value
          index = i - 1
        }
      }

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

      this.setState({ animating: true, searchString, itemFilters, itemSorters })

      this.filterResults(this.state.searchString, value, itemFilters, index, false)

    } else if (name.includes('sort|')) {

      let itemSorters = this.state.itemSorters
      const nameArray = name.split("|")
      const field = nameArray[1]

      for (let i = 1; i <= itemSorters.length; i++) {
        if (itemSorters[i - 1].name === field) {
          itemSorters[i - 1]['value'] = value
        }
      }

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


      this.sortResults(value, field)

    } else if (name.includes('useCase')) {
      const nameArray = name.split("|")
      const index = Number(nameArray[1].trim())

      let useCases = this.state.useCases
      // useCases[index]["value"] = value
      for (let i = 1; i <= useCases.length; i++) {
        if (i - 1 === index) {
          useCases[index]["selected"] = true
        } else {
          useCases[index]["selected"] = false
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
    } else if (name.includes('custom')) {
      const nameArray = name.split("|")
      const index = Number(nameArray[1].trim())

      const ogValue = this.state.matchingCriteria[index].value
      const diff = value - ogValue
      const totalPercent = this.state.totalPercent + diff

      let matchingCriteria = this.state.matchingCriteria
      matchingCriteria[index]["value"] = Number(value)
      this.setState({ matchingCriteria, totalPercent })
    }
  }

  filterResults(searchString, filterString, filters, index, search) {
    console.log('filterResults called', searchString, filterString, filters, index, search)

    // let careers = this.state.careers

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called in careers')

      const excludeMissingOutlookData = true
      const excludeMissingJobZone = true

      Axios.put('https://www.guidedcompass.com/api/careers/search', {  searchString, filterString, filters, index, search, excludeMissingOutlookData, excludeMissingJobZone })
      .then((response) => {
        console.log('Careers query attempted', response.data);

          if (response.data.success) {
            console.log('successfully retrieved careers')

            if (response.data) {

              const careers = response.data.careers

              // THIS IS SUPER UNNECESSARY
              const filterCriteriaArray = response.data.filterCriteriaArray
              const sortCriteriaArray = null

              self.setState({ careers, animating: false, filterCriteriaArray, sortCriteriaArray })
            }

          } else {
            console.log('no career data found', response.data.message)
            self.setState({ animating: false })
          }

      }).catch((error) => {
          console.log('Career query did not work', error);
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

    let careers = this.state.careers

    Axios.put('https://www.guidedcompass.com/api/careers/sort', { sortString, careers, sortName })
    .then((response) => {
      console.log('Career sort query attempted', response.data);

        if (response.data.success) {
          console.log('posting sort query worked')

          // THIS IS SUPER UNNECESSARY
          const filterCriteriaArray = null
          const sortCriteriaArray = response.data.sortCriteriaArray

          const careers = response.data.careers
          this.setState({ careers, animating: false, filterCriteriaArray, sortCriteriaArray })

        } else {
          console.log('career sort query did not work', response.data.message)
          this.setState({ animating: false })
        }

    }).catch((error) => {
        console.log('Career sort query did not work for some reason', error);
        this.setState({ animating: false })
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

  renderManipulators(type) {
    console.log('renderManipulators called')

    if (type === 'filter') {
      let filters = this.state.itemFilters

      if (filters) {

        let rows = []
        for (let i = 1; i <= filters.length; i++) {
          rows.push(
            <View key={filters[i - 1] + i.toString()}>
              <View style={styles.rowDirection}>
                <View style={[styles.row10,styles.rightPadding20]}>
                  <View style={styles.lightBorder}>
                    <View style={[styles.rightPadding5,styles.leftPadding,styles.nowrap,styles.topMarginNegative2]}>
                      <View style={styles.spacer} />
                      <Text style={[styles.descriptionTextColor]}>{filters[i - 1].name}</Text>
                    </View>
                    <View>
                      <select name={"filter|" + filters[i - 1].name} value={filters[i - 1].value} onChange={this.formChangeHandler} className="filter-select">
                        {filters[i - 1].options.map(value =>
                          <option key={value} value={value}>{value}</option>
                        )}
                      </select>
                    </View>
                    <View style={[styles.dropdownArrowContainer,styles.paddingTop15]}>
                      <Image source={{ uri: dropdownArrow}} style={[styles.square20,styles.contain]} />
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

      if (sorters) {

        let rows = []
        for (let i = 1; i <= sorters.length; i++) {
          rows.push(
            <View key={sorters[i - 1] + i.toString()}>
              <View style={styles.rowDirection}>
                <View style={[styles.row10,styles.rightPadding20]}>
                  <View style={styles.lightBorder}>
                    <View style={[styles.rightPadding5,styles.leftPadding,styles.nowrap,styles.topMarginNegative2]}>
                      <View style={styles.spacer} />
                      <Text style={[styles.descriptionTextColor]}>{sorters[i - 1].name}</Text>
                    </View>
                    <View>
                      <select name={"sort|" + sorters[i - 1].name} value={sorters[i - 1].value} onChange={this.formChangeHandler} className="filter-select">
                        {sorters[i - 1].options.map(value =>
                          <option key={value} value={value}>{value}</option>
                        )}
                      </select>
                    </View>
                    <View style={[styles.dropdownArrowContainer,styles.topPadding15]}>
                      <Image source={{ uri: dropdownArrow}} />
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

  standardizeValue(type, index, value) {
    console.log('standardize value called')

    // interests max at 7
    if (type === 'sort') {
      if (this.state.sortCriteriaArray[index].name === 'Realistic') {
        value = ((Number(this.state.sortCriteriaArray[index].criteria) / 7) * 100).toFixed().toString() + '%'
      } else if (this.state.sortCriteriaArray[index].name === 'Investigative') {
        value = ((Number(this.state.sortCriteriaArray[index].criteria) / 7) * 100).toFixed().toString() + '%'
      } else if (this.state.sortCriteriaArray[index].name === 'Artistic') {
        value = ((Number(this.state.sortCriteriaArray[index].criteria) / 7) * 100).toFixed().toString() + '%'
      } else if (this.state.sortCriteriaArray[index].name === 'Social') {
        value = ((Number(this.state.sortCriteriaArray[index].criteria) / 7) * 100).toFixed().toString() + '%'
      } else if (this.state.sortCriteriaArray[index].name === 'Enterprising') {
        value = ((Number(this.state.sortCriteriaArray[index].criteria) / 7) * 100).toFixed().toString() + '%'
      } else if (this.state.sortCriteriaArray[index].name === 'Conventional') {
        value = ((Number(this.state.sortCriteriaArray[index].criteria) / 7) * 100).toFixed().toString() + '%'
      }
    }

    return value

  }

  pullSimilarCareers(selectedCareers) {
    console.log('pullSimilarCareers called', selectedCareers)

    Axios.put('https://www.guidedcompass.com/api/careers/similar', { selectedCareers })
    .then((response) => {
      console.log('Similar careers query attempted', response.data);

        if (response.data.success) {
          console.log('similar careers query worked')

          let matchScores = response.data.matchScores
          const careers = response.data.careers

          this.setState({ animating: false, matchingView: true, matchScores, careers })

        } else {
          console.log('Career match did not work', response.data.message)
          this.setState({ animating: false, matchingView: true, errorMessage: 'there was an error: ' + response.data.message })
        }

    }).catch((error) => {
        console.log('Career match did not work for some reason', error);
        this.setState({ animating: false, matchingView: true, errorMessage: 'there was an error' })
    });
  }

  calculateMatches(matchingView, calcMatches, newPreferences) {
    console.log('calculateMatches called', matchingView, calcMatches, newPreferences)

    if (matchingView) {

      this.setState({ matchingView: true, errorMessage: null })
      // console.log('got profile? ', this.state.profile)
      if (!this.state.profile) {
        this.setState({ animating: false, matchingView: true, errorMessage: 'Please take career assessments before receiving personalized matches' })
      } else {
        this.setState({ animating: true, modalIsOpen: false })

        const profile = this.state.profile
        const matchingCriteria = this.state.matchingCriteria
        const useCases = this.state.useCases
        const hourOptions = this.state.hourOptions

        const self = this

        function officiallyCalculate() {
          console.log('officiallyCalculate called')

          const excludeMissingOutlookData = true
          const excludeMissingJobZone = true

          // query postings on back-end
          Axios.put('https://www.guidedcompass.com/api/careers/matches', { profile, matchingCriteria, useCases, excludeMissingOutlookData, excludeMissingJobZone, hourOptions })
          .then((response) => {
            console.log('Career matches attempted', response.data);

              if (response.data.success) {
                console.log('career match query worked')

                let matchScores = response.data.matchScores
                self.setState({ animating: false, matchingView: true, matchScores, careers: response.data.careers })

              } else {
                console.log('Career match did not work', response.data.message)
                self.setState({ animating: false, matchingView: true, errorMessage: 'there was an error: ' + response.data.message })
              }

          }).catch((error) => {
              console.log('Career match did not work for some reason', error);
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

  itemClicked(name, value) {
    console.log('itemClicked called', name, value)

    const nameArray = name.split("|")
    const index = Number(nameArray[1].trim())

    let useCases = this.state.useCases
    // useCases[index]["value"] = value
    for (let i = 1; i <= useCases.length; i++) {
      console.log('compare indices: ', i - 1, index)
      if (i - 1 === index) {
        useCases[i - 1]["selected"] = true
      } else {
        useCases[i - 1]["selected"] = false
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
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
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

  render() {
    // console.log('show style: ', Style.styles)
    return (
      <ScrollView>
        <View style={styles.bottompadding20}>
          <View>
            <View>
              <View>
                {(this.state.matchingView) ? (
                  <View style={styles.rowDirection}>
                    <View style={[styles.row7,styles.topMarginNegative2,styles.fullScreenWidth]} style={(this.state.matchingView) ? { ...styles2, position: 'absolute' } : { }}>
                      <TouchableOpacity onPress={() => this.calculateMatches(false, false, false)}>
                        <Image source={{ uri: matchIconSelected}} style={[styles.square30,styles.rightMargin]} />
                      </TouchableOpacity>
                    </View>
                    <View style={styles.fullScreenWidth}>
                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showMatchingCriteria: true })}>
                        <View style={[styles.rightMargin, styles.slightlyRoundedCorners,styles.row5,styles.horizontalPadding10,styles.ctaBackgroundColor,styles.ctaBorder]}>
                          <Text style={styles.whiteColor}>Adjust</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.calculateMatches(false, false, false)}>
                        <View style={[styles.rightPadding,styles.standardBorder,styles.slightlyRoundedCorners,styles.row5,styles.horizontalPadding10]}>
                          <Text>Close</Text>
                        </View>
                      </TouchableOpacity>
                      <View style={styles.halfSpacer} /><View style={styles.miniSpacer} /><View style={styles.miniSpacer} />
                    </View>
                  </View>
                ) : (
                  <View>
                    <View style={[styles.fullScreenWidth,styles.row5,styles.whiteBackground,styles.standardBorder,styles.mediumShadow,styles.rowDirection]}>
                      <View style={(this.state.matchingView) ? [styles.fullScreenWidth] : [styles.width50,styles.centerItem]}>
                        <TouchableOpacity style={(this.state.matchingView) ? [] : [styles.fullScreenWidth,styles.bottomPadding]} onPress={() => this.calculateMatches(true, true, false)}>
                          <Image source={(this.state.matchingView) ? {uri: matchIconSelected} : {uri: matchIcon}} style={[styles.square30,styles.contain,styles.rightMargin,styles.centerItem,styles.topMargin]} />
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.filterFieldSearch,styles.calcColumn100,styles.whiteBackground,styles.rowDirection,styles.topMargin3]}>
                        <View style={[styles.row7,styles.horizontalPadding3]}>
                          <Image source={{uri: searchIcon}} style={[styles.square17,styles.contain,styles.padding5]}/>
                        </View>
                        <View style={[styles.width210,styles.calcColumn100,styles.topPadding5]}>
                          <TextInput
                            onChangeText={(text) => this.formChangeHandler('search',text)}
                            value={this.state.searchString}
                            placeholder="Search 1,000+ careers..."
                            placeholderTextColor="grey"
                          />
                        </View>
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
              <View style={[styles.whiteBackground,styles.padding20,styles.standardBorder,styles.marginTop20]}>
                <View>

                <View style={styles.spacer} /><View style={styles.spacer} />
                <View style={styles.horizontalLine} />
                <View style={styles.spacer} /><View style={styles.spacer} />

                <Text>Filter</Text>
                <View style={styles.halfSpacer} />
                {(this.renderManipulators('filter'))}

                <View style={styles.spacer} />
                <View style={styles.horizontalLine} />
                <View style={styles.spacer} /><View style={styles.spacer} />
                <Text>Sort</Text>
                <View style={styles.halfSpacer} />
                {(this.renderManipulators('sort'))}

                </View>
              </View>
            )}

            <View style={styles.spacer} /><View style={styles.spacer} />
          </View>

          {(this.state.animating) ? (
            <View style={[styles.flexCenter,styles.fullSpace]}>
              <View>
                <ActivityIndicator
                   animating = {this.state.animating}
                   color = '#87CEFA'
                   size = "large"
                   style={[styles.square80, styles.centerHorizontally]}/>

                <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Pulling career matches...</Text>

              </View>
            </View>
          ) : (
            <View style={styles.card}>
                {this.state.careers.map((value, index) =>
                  <View key={index}>
                    <View>
                      <View style={styles.spacer} />

                      <View style={[styles.rowDirection]}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerSelected: value })} style={[styles.rowDirection,styles.calcColumn110]}>
                          <View style={styles.width70}>
                            {(this.state.matchScores && this.state.matchScores[index]) ? (
                              <View style={[styles.padding10]}>
                                {/*
                                <CircularProgressBar
                                  percentage={this.state.matchScores[index]}
                                  text={`${this.state.matchScores[index]}%`}
                                  styles={{
                                    path: { stroke: `rgba(110, 190, 250, ${this.state.matchScores[index] / 100})` },
                                    text: { fill: '#6EBEFA', fontSize: '26px' },
                                    trail: { stroke: 'transparent' }
                                  }}
                                />*/}
                              </View>
                            ) : (
                              <Image source={{uri: careerIcon}} style={[styles.square50,styles.contain,styles.topMargin5,styles.centerItem]}/>
                            )}

                          </View>
                          <View style={[styles.calcColumn180]}>
                            <Text style={[styles.headingText5]}>{value.name}</Text>
                            <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>{value.jobFunction}{(value.jobFunction && value.industry) && ' | ' + value.industry}{(!value.jobFunction && value.industry) && value.industry}{(value.jobFamily) && ' | ' + value.jobFamily}</Text>

                            {(value.marketData) && (
                              <View style={[styles.calcColumn110,styles.row5,styles.descriptionText2,styles.boldText, styles.rowDirection,styles.flexWrap]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={styles.rightPadding}>
                                    <Image source={{uri: trendingUpIcon}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={styles.rightPadding}>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>{value.marketData.growth}</Text>
                                  </View>
                                </View>

                                <View style={[styles.rowDirection]}>
                                  <View style={styles.rightPadding}>
                                    <Image source={{uri: moneyIconBlue}} style={[styles.square20,styles.contain]}/>
                                  </View>
                                  <View style={styles.rightPadding}>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>${Number(value.marketData.pay).toLocaleString()}</Text>
                                  </View>
                                </View>

                                <View style={[styles.rowDirection]}>
                                  <View style={styles.rightPadding}>
                                    <Image source={{uri: membersIconBlue}} style={[styles.square22,styles.contain]}/>
                                  </View>
                                  <View style={styles.rightPadding}>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>{Number(value.marketData.totalEmployment).toLocaleString()}</Text>
                                  </View>
                                </View>
                              </View>
                            )}

                            {(value.onetInterests) && (
                              <View style={[styles.calcColumn110,styles.row5,styles.descriptionText2,styles.boldText, styles.rowDirection]}>
                                <View style={[styles.rowDirection,styles.flexWrap]}>
                                  <View style={styles.rightPadding}>
                                    <Image source={{uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                                  </View>
                                  <View style={styles.rightPadding}>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>{((value.onetInterests.realistic / 7) * 100).toFixed()}% R  -</Text>
                                  </View>
                                  <View style={styles.rightPadding}>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>{((value.onetInterests.investigative / 7) * 100).toFixed()}% I  -</Text>
                                  </View>
                                  <View style={styles.rightPadding}>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>{((value.onetInterests.artistic / 7) * 100).toFixed()}% A  -</Text>
                                  </View>
                                  <View style={styles.rightPadding}>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>{((value.onetInterests.social / 7) * 100).toFixed()}% S  -</Text>
                                  </View>
                                  <View style={styles.rightPadding}>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>{((value.onetInterests.enterprising / 7) * 100).toFixed()}% E  -</Text>
                                  </View>
                                  <View>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>{((value.onetInterests.conventional / 7) * 100).toFixed()}% C</Text>
                                  </View>
                                </View>
                              </View>
                            )}
                          </View>
                        </TouchableOpacity>

                        <View style={[styles.width25,styles.topMargin15]}>
                          <TouchableOpacity onPress={() => this.favoriteItem(value) }>
                            <Image source={(this.state.favorites.includes(value._id)) ? {uri: favoritesIconBlue} : {uri: favoritesIconGrey}} style={[styles.square20,styles.contain,styles.pinRight]}/>
                          </TouchableOpacity>
                        </View>

                        <View style={[styles.width25,styles.leftPadding]}>
                          <View style={styles.alignEnd}>
                            <View style={[styles.spacer]} /><View style={[styles.halfSpacer]}/>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerSelected: value })}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.pinRight]}/>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      {(this.state.sortCriteriaArray && this.state.sortCriteriaArray[index] && this.state.sortCriteriaArray[index].name) && (
                        <View style={styles.leftPadding70}>
                          <View style={styles.halfSpacer} />
                          <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.sortCriteriaArray[index].name}: {this.standardizeValue('sort',index, this.state.sortCriteriaArray[index].criteria)}</Text>
                        </View>
                      )}
                      {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[index] && this.state.filterCriteriaArray[index].name) && (
                        <View style={styles.leftPadding70}>
                          <View style={styles.halfSpacer} />
                          <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.filterCriteriaArray[index].name}: {this.state.filterCriteriaArray[index].criteria}</Text>
                        </View>
                      )}
                      <View style={styles.spacer} /><View style={styles.spacer} />
                      <View style={styles.horizontalLine} />

                      <View style={styles.spacer} />
                    </View>

                  </View>
                )}

            </View>
          )}
          <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>

          {(this.state.showMatchingCriteria) && (
            <View key="showMatchingCriteria" className="full-width padding-20">
              <Text className="heading-text-2">Adjust Matching Criteria</Text>
              <View style={styles.spacer} />

              <View className="row-10">
                <View className="flex-container">
                  <TouchableOpacity className="background-button flex-50" onPress={() => this.setState({ customAdjustment: false })}>
                    <View className={(this.state.customAdjustment) ? "cta-border center-item row-15 horizontal-padding center-text" : "cta-border center-item row-15 horizontal-padding center-text cta-background-color white-text"}>
                      Adjust by Needs
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity className="background-button flex-50" onPress={() => this.setState({ customAdjustment: true })}>
                    <View className={(this.state.customAdjustment) ? "cta-border center-item row-15 horizontal-padding center-text cta-background-color white-text" : "cta-border center-item row-15 horizontal-padding center-text"}>
                      Custom Adjust
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
                        <View key={"c" + index} className={(value.name === 'Location') && "wash-out-2"}>
                          <View className="calc-column-offset-100-static">
                            <Text className="half-bold-text">{index + 1}. {value.name}</Text>
                            <View style={styles.halfSpacer} />
                            <Text className="description-text-3">{value.description}</Text>
                          </View>
                          <View className="fixed-column-100 right-text">
                            <View className="fixed-column-70">
                              <input disabled={(value.name === 'Location') ? true : false} type="number" className="text-field heading-text-2 cta-color bold-text full-width right-text standard-border" min="0" max="100" placeholder="0" name={"custom|" + index} value={value.value} onChange={this.formChangeHandler}></input>
                            </View>
                            <View className="fixed-column-30">
                              <View className="mini-spacer"/><View className="mini-spacer"/>
                              <Text className="heading-text-2 cta-color bold-text">%</Text>
                            </View>
                          </View>


                          <View style={styles.spacer} /><View style={styles.halfSpacer} />

                        </View>
                      )}

                      <View>
                        <hr className="cta-border-color"/>
                        <View style={styles.spacer} />
                        <View className="float-left full-width right-text">
                          <Text className="heading-text-2 cta-color bold-text">{this.state.totalPercent}%</Text>
                        </View>

                        {(this.state.totalPercent !== 100) && (
                          <View className="full-width">
                            <Text className="error-message right-text">Please adjust percentages to equal 100%</Text>
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
                        <View key={"u" + index} className={(value.name === 'Purpose') && "wash-out-2"}>
                          <View className="calc-column-offset-50">
                            <Text className="half-bold-text">{index + 1}. {value.name}</Text>
                            <View style={styles.halfSpacer} />
                            <Text className="description-text-3">{value.description}</Text>
                          </View>
                          <View className="fixed-column-50 horizontally-center center-text top-padding-5">

                            <TouchableOpacity disabled={(value.name === 'Purpose') ? true : false} onPress={() => this.itemClicked('useCase|' + index, true)} className="background-button">
                              {(value.selected) ? (
                                <View className="circle-option-container-2 cta-border center-text" >
                                  <View className="circle-selected-2"/>
                                </View>
                              ) : (
                                <View className="circle-option-container-2 standard-border center-text" />
                              )}
                            </TouchableOpacity>
                          </View>


                          <View style={styles.spacer} /><View style={styles.halfSpacer} />

                        </View>
                      )}

                    </View>
                  )}
                </View>
              )}

              {(this.state.errorMessage && this.state.errorMessage !== '') && <Text className="description-text-2 error-color">{this.state.errorMessage}</Text>}

            </View>
          )}

          <View className="row-20 center-text">
            <TouchableOpacity className="btn btn-primary right-margin" onPress={() => this.calculateMatches(true, true, true)}>Apply Changes</TouchableOpacity>

            <TouchableOpacity className="btn btn-secondary" onPress={() => this.closeModal()}>Close View</TouchableOpacity>
          </View>
         </Modal>

        </View>
      </ScrollView>
    );
  }

}

export default Careers;
