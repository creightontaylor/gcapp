import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, TextInput, ActivityIndicator } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';
import {Picker} from '@react-native-picker/picker';

const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const hideIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/hide-icon.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';
const defaultProfileBackgroundImage = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/default-profile-background-image.png';

import ProjectDetails from './ProjectDetails';

class Projects extends Component {
  constructor(props) {
    super(props)
    this.state = {
      projects: [],
      filteredProjects: [],
      timerId: 0,

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

      applications: [],
      filteredApplications: [],
      selectedJob: null,
      benchmark: null,
      benchmarkOptions: [],
      favorites: [],

      serverPostSuccess: true,
      serverSuccessMessage: '',
      serverErrorMessage: ''
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)

    this.favoriteItem = this.favoriteItem.bind(this)
    this.toggleSearchBar = this.toggleSearchBar.bind(this)

    this.formatMonth = this.formatMonth.bind(this)
    this.renderManipulators = this.renderManipulators.bind(this)
    this.filterResults = this.filterResults.bind(this)
    this.sortResults = this.sortResults.bind(this)

    this.saveFeedback = this.saveFeedback.bind(this)

    this.showGrade = this.showGrade.bind(this)

    this.renderItems = this.renderItems.bind(this)
    this.closeModal = this.closeModal.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ', this.props.activeOrg, prevProps)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
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
      const org = activeOrg

      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, org, orgFocus, orgName, remoteAuth
        })

        Axios.get('https://www.guidedcompass.com/api/workoptions')
        .then((response) => {
          console.log('Work options query tried', response.data);

          if (response.data.success) {
            console.log('Work options query succeeded')

            let functionOptions = response.data.workOptions[0].functionOptions
            let industryOptions = response.data.workOptions[0].industryOptions
            let projectCategoryOptions = response.data.workOptions[0].projectCategoryOptions
            let hourOptions = response.data.workOptions[0].hourOptions
            const gradeOptions = ['','A+','A','A-','B+','B','B-','C+','C','C-','D+','D','D-','F']

            //filters
            const defaultFilterOption = this.state.defaultFilterOption

            // const gradeFilterOptions = [defaultFilterOption].concat(gradeOptions.slice(1, gradeOptions.length))
            const feedbackFilterOptions = [defaultFilterOption,'Has None','At Least One']
            const categoryFilterOptions = [defaultFilterOption].concat(projectCategoryOptions.slice(1, projectCategoryOptions.length))
            const functionFilterOptions = [defaultFilterOption].concat(functionOptions.slice(1, functionOptions.length))
            const industryFilterOptions = [defaultFilterOption].concat(industryOptions.slice(1, industryOptions.length))
            const hourCountFilterOptions = [defaultFilterOption].concat(hourOptions.slice(1, hourOptions.length))
            const contributorFilterOptions = [defaultFilterOption,'Only Mine']
            const activeFilterOptions = [defaultFilterOption,'Is Being Actively Worked On','Is Not Being Actively Worked On']

            const itemFilters = [
              // { name: 'Grade', value: defaultFilterOption, options: gradeFilterOptions},
              { name: 'Has Feedback', value: defaultFilterOption, options: feedbackFilterOptions},
              { name: 'Category', value: defaultFilterOption, options: categoryFilterOptions },
              { name: 'Work Function', value: defaultFilterOption, options: functionFilterOptions },
              { name: 'Industry', value: defaultFilterOption, options: industryFilterOptions },
              { name: '# of Hours', value: defaultFilterOption, options: hourCountFilterOptions },
              { name: 'Feedback Contributor', value: defaultFilterOption, options: contributorFilterOptions },
              { name: 'Active', value: defaultFilterOption, options: activeFilterOptions },
            ]

            //sort options
            const defaultSortOption = this.state.defaultSortOption

            // const gradeSortOptions = [defaultSortOption].concat(gradeOptions.slice(1, gradeOptions.length))
            // let hourCountSortOptions = [defaultSortOption].concat(hourOptions.slice(1, hourOptions.length))

            const itemSorters = [
              { name: 'Average Grade', value: defaultSortOption, options: [defaultSortOption].concat(['Highest'])},
              { name: '# of Hours', value: defaultSortOption, options: [defaultSortOption].concat(['Most'])},
            ]

            this.setState({ orgFocus, gradeOptions,itemFilters, itemSorters });

          } else {
            console.log('no jobFamilies data found', response.data.message)
          }
        }).catch((error) => {
            console.log('query for work options did not work', error);
        })

        if (roleName === 'Teacher' || roleName === 'School Support' ) {
          // pull students within courses where user is a teacher

          Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
          .then((response) => {

              if (response.data.success) {
                console.log('User profile query worked', response.data);

                const courseIds = response.data.user.courseIds

                if (courseIds && courseIds.length > 0) {
                  // pull from courses
                  console.log('there are course ids')

                  Axios.get('https://www.guidedcompass.com/api/projects', { params: { courseIds } })
                  .then((response) => {
                    console.log('Projects query attempted', response.data);

                      if (response.data.success) {
                        console.log('successfully retrieved projects')

                        if (response.data.projects) {

                          const projects = response.data.projects
                          const filteredProjects = projects
                          this.setState({ projects, filteredProjects })
                        }

                      } else {
                        console.log('no project data found', response.data.message)
                      }

                  }).catch((error) => {
                      console.log('Project query did not work', error);
                  });

                } else {
                  // pull everyone at the organization

                  const resLimit = 50
                  Axios.get('https://www.guidedcompass.com/api/projects', { params: { orgCode: org, resLimit } })
                  .then((response) => {
                    console.log('Projects query attempted teacher', response.data);

                      if (response.data.success) {
                        console.log('successfully retrieved projects')

                        if (response.data.projects) {

                          const projects = response.data.projects
                          const filteredProjects = projects
                          this.setState({ projects, filteredProjects })
                        }

                      } else {
                        console.log('no project data found', response.data.message)
                      }

                  }).catch((error) => {
                      console.log('Project query did not work', error);
                  });
                }

              } else {
                console.log('no user details found', response.data.message)

              }

          }).catch((error) => {
              console.log('User profile query did not work', error);
          });

        } else {
          // pull all students within the organization

          const resLimit = 50
          Axios.get('https://www.guidedcompass.com/api/projects', { params: { orgCode: org, resLimit } })
          .then((response) => {
            console.log('Projects query attempted', response.data);

              if (response.data.success) {
                console.log('successfully retrieved projects')

                if (response.data.projects) {

                  const projects = response.data.projects
                  const filteredProjects = projects
                  this.setState({ projects, filteredProjects })
                }

              } else {
                console.log('no project data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Project query did not work', error);
          });
        }

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: org } })
        .then((response) => {
          console.log('Org info query attempted one', response.data);

          if (response.data.success) {
            console.log('org info query worked')

            let orgContactEmail = response.data.orgInfo.contactEmail
            this.setState({ orgContactEmail })

          } else {
            console.log('org info query did not work', response.data.message)
          }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
        });

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
        .then((response) => {
          console.log('User profile query attempted', response.data);

            if (response.data.success) {
              console.log('successfully retrieved profile')

              if (response.data.user.jobTitle) {

                const cuFirstName = response.data.user.firstName
                const cuLastName = response.data.user.lastName
                const jobTitle = response.data.user.jobTitle
                const employerName = response.data.user.employerName
                this.setState({ cuFirstName, cuLastName, jobTitle, employerName })

              }
            } else {
              console.log('user profile data found', response.data.message)
            }

        }).catch((error) => {
            console.log('User profile query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId: email } })
       .then((response) => {
           console.log('Favorites query attempted', response.data);

           if (response.data.success) {
             console.log('successfully retrieved favorites')

             this.setState({ favorites: response.data.favorites })
           } else {
             console.log('no favorites data found', response.data.message)
           }

       }).catch((error) => {
           console.log('Favorites query did not work', error);
       });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler = (eventName,eventValue) => {
    console.log('formChangeHandler called')

    if (eventName === 'search') {

      const searchString = eventValue

      //reset everything
      let itemFilters = this.state.itemFilters
      for (let i = 1; i <= itemFilters.length; i++) {
        itemFilters[i - 1]['value'] = this.state.defaultFilterOption
      }
      let itemSorters = this.state.itemSorters
      for (let i = 1; i <= itemSorters.length; i++) {
        itemSorters[i - 1]['value'] = this.state.defaultSortOption
      }

      this.setState({ searchString, itemFilters, itemSorters, animating: true })

      // this.setState({ searchString: eventValue, animating: true })
      // this.resetFilters(eventName, eventValue)
      this.filterResults(eventValue, '', null, null, true)
    } else if (eventName.includes('filter|')) {

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
    } else if (eventName.includes('sort|')) {

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
    } else if (eventName === 'grade') {
      let projects = this.state.projects
      projects[this.state.selectedIndex1]['grades'][this.state.selectedIndex2]['grade'] = eventValue
      this.setState({ projects })
    } else if (eventName === 'feedback') {
      let projects = this.state.projects
      projects[this.state.selectedIndex1]['grades'][this.state.selectedIndex2]['feedback'] = eventValue
      this.setState({ projects })
    } else if (eventName === 'isTransparent') {
      let projects = this.state.projects
      projects[this.state.selectedIndex1]['grades'][this.state.selectedIndex2]['isTransparent'] = eventValue
      this.setState({ projects })
    }
  }

  filterResults(searchString, filterString, filters, index, search) {
    console.log('filterResults called', searchString, filterString, filters, index, search)

    // const emailId = this.state.emailId
    // const orgCode = this.state.org
    const defaultFilterOption = this.state.defaultFilterOption
    const projects = this.state.projects
    const type = this.props.type
    const emailId = this.state.emailId

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      Axios.put('https://www.guidedcompass.com/api/projects/filter', {  searchString, filterString, filters, defaultFilterOption, index, search, projects, type, emailId })
      .then((response) => {
        console.log('Project filter query attempted', response.data);

          if (response.data.success) {
            console.log('project filter query worked')

            let filteredProjects = response.data.projects
            const filterCriteriaArray = response.data.filterCriteriaArray
            const sortCriteriaArray = null

            self.setState({ filteredProjects, animating: false, filterCriteriaArray, sortCriteriaArray })

          } else {
            console.log('project filter query did not work', response.data.message)
            self.setState({ animating: false })
          }

      }).catch((error) => {
          console.log('Project filter query did not work for some reason', error);
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

    let projects = this.state.projects
    // let filteredProjects = []

    Axios.put('https://www.guidedcompass.com/api/projects/sort', { sortString, projects, sortName })
    .then((response) => {
      console.log('Project sort query attempted', response.data);

        if (response.data.success) {
          console.log('project sort query worked')

          let filteredProjects = response.data.projects
          const filterCriteriaArray = null
          const sortCriteriaArray = response.data.sortCriteriaArray

          this.setState({ filteredProjects, animating: false, filterCriteriaArray, sortCriteriaArray })

        } else {
          console.log('project sort query did not work', response.data.message)
          this.setState({ animating: false })
        }

    }).catch((error) => {
        console.log('Project sort query did not work for some reason', error);
        this.setState({ animating: false })
    });
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
                <View style={[styles.row10,styles.rightPadding20]}>
                  <View style={[styles.lightBorder,styles.rowDirection]}>
                    <View style={[styles.rightPadding5,styles.leftPadding,styles.topMarginNegative2]}>
                      <View style={[styles.spacer]} />
                      <Text style={[styles.descriptionTextColor]}>{filters[i - 1].name}</Text>
                    </View>
                    <View>
                      <Picker
                        selectedValue={filters[i - 1].value}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("filter|" + filters[i - 1].name,itemValue)
                        }>
                        {filters[i - 1].options.map(value => <Picker.Item label={value} value={value} />)}
                      </Picker>
                    </View>
                    <View style={[styles.topPadding17,styles.horizontalPadding3,styles.rightMargin5]}>
                      <Image source={{ uri: dropdownArrow}}/>
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
                <View style={[styles.row10,styles.rightPadding20]}>
                  <View style={[styles.lightBorder,styles.rowDirection]}>
                    <View style={[styles.rightPadding5,styles.leftPadding,styles.topMarginNegative2]}>
                      <View style={[styles.spacer]} />
                      <Text style={[styles.descriptionTextColor]}>{sorters[i - 1].name}</Text>
                    </View>
                    <View>
                      <Picker
                        selectedValue={sorters[i - 1].value}
                        onValueChange={(itemValue, itemIndex) =>
                          this.formChangeHandler("sort|" + sorters[i - 1].name,itemValue)
                        }>
                        {sorters[i - 1].options.map(value => <Picker.Item label={value} value={value} />)}
                      </Picker>
                    </View>
                    <View style={[styles.topPadding17,styles.horizontalPadding3,styles.rightMargin5]}>
                      <Image source={{ uri: dropdownArrow}}/>
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

  favoriteItem(e, item) {
    console.log('favoriteItem called', e, item)

    e.stopPropagation()

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    let itemId = item._id

    let favoritesArray = this.state.favorites

    if (favoritesArray.includes(itemId)){
      let index = favoritesArray.indexOf(itemId)
      if (index > -1) {
        favoritesArray.splice(index, 1);
      }
    } else {
      // console.log('adding item: ', favoritesArray, itemId)
      favoritesArray.push(itemId)
    }

    console.log('favorites', favoritesArray)
    this.setState({ favorites: favoritesArray })

    Axios.post('https://www.guidedcompass.com/api/favorites/save', {
      favoritesArray, emailId: this.state.emailId
    })
    .then((response) => {
      console.log('attempting to save favorites')
      if (response.data.success) {
        console.log('saved successfully', response.data)
        //clear values
        this.setState({ successMessage: 'Favorite saved!', isSaving: false })
      } else {
        console.log('did not save successfully')
        this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false })
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

  formatMonth(month) {
    console.log('formatMonth', month)

    let formattedMonth = 'January'
    if (month === '01') {
      formattedMonth = 'January'
    } else if (month === '02') {
      formattedMonth = 'February'
    } else if (month === '03') {
      formattedMonth = 'March'
    } else if (month === '04') {
      formattedMonth = 'April'
    } else if (month === '05') {
      formattedMonth = 'May'
    } else if (month === '06') {
      formattedMonth = 'June'
    } else if (month === '07') {
      formattedMonth = 'July'
    } else if (month === '08') {
      formattedMonth = 'August'
    } else if (month === '09') {
      formattedMonth = 'September'
    } else if (month === '10') {
      formattedMonth = 'October'
    } else if (month === '11') {
      formattedMonth = 'November'
    } else if (month === '12') {
      formattedMonth = 'December'
    }

    return formattedMonth
  }

  saveFeedback() {
    console.log('saveFeedback called')

    const grade = this.state.projects[this.state.selectedIndex1].grades[this.state.selectedIndex2].grade
    const feedback = this.state.projects[this.state.selectedIndex1].grades[this.state.selectedIndex2].feedback
    const isTransparent = this.state.projects[this.state.selectedIndex1].grades[this.state.selectedIndex2].isTransparent

    //must set transparency level and give grade or feedback
    if (!grade && !feedback) {
      this.setState({ serverErrorMessage: 'please add a grade or provide feedback'})
    } else if (!isTransparent || isTransparent === '') {
      this.setState({ serverErrorMessage: 'please indicate whether this feedback is transparent to the student '})
    } else {

      const emailId = this.state.emailId
      const postingId = null
      const submissionId = null
      const gradeObject = this.state.projects[this.state.selectedIndex1].grades[this.state.selectedIndex2]

      const projectId = this.state.projects[this.state.selectedIndex1]._id
      const orgContactEmail = this.state.orgContactEmail

      console.log('show titles 2: ', gradeObject)

      //save submission to opportunity + project
      Axios.post('https://www.guidedcompass.com/api/projects/feedback', { emailId, postingId, submissionId, gradeObject, projectId, orgContactEmail })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Project feedback save worked ', response.data);
          //report whether values were successfully saved
          this.setState({ serverSuccessMessage: 'Project feedback successfully saved!', modalIsOpen: false })

        } else {
          console.log('project feedback did not save successfully')
          this.setState({ serverErrorMessage: response.data.message })
        }

      }).catch((error) => {
          console.log('Project feedback save did not work', error);
          this.setState({ serverErrorMessage: error })
      });
    }
  }

  renderItems() {
    console.log('renderItems called', this.state.filteredMembers)

    let rows = []
    for (let i = 1; i <= this.state.filteredProjects.length; i++) {

      const index = i - 1

      // let pathname = '/advisor/projects/' + this.state.filteredProjects[i - 1]._id
      // let passedState = { selectedProject: this.state.filteredProjects[i - 1] }
      let tagArray = []
      if (this.state.filteredProjects[i - 1].skillTags) {
        tagArray = this.state.filteredProjects[i - 1].skillTags.split(',')
      }

      let subtitle = ''
      if (this.state.filteredProjects[i - 1].userFirstName) {
        subtitle = this.state.filteredProjects[i - 1].userFirstName + ' ' + this.state.filteredProjects[i - 1].userLastName
      }

      if (this.state.filteredProjects[i - 1].hours) {
        if (subtitle === '') {
          subtitle = this.state.filteredProjects[i - 1].hours + ' Hours'
        } else {
          subtitle = subtitle + ' | ' + this.state.filteredProjects[i - 1].hours + ' Hours'
        }
      }

      rows.push(
        <View key={index}>
          <View style={[styles.topMargin20,styles.horizontalPadding20]}>
            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showProjectDetail: true, showGrade: false, selectedIndex1: index })}>
              <View style={[styles.elevatedBox,styles.whiteBackground]} >
                <View style={[styles.calcColumn40,styles.relativePosition]}>
                  <Image source={(this.state.filteredProjects[i - 1].imageURL) ? { uri: this.state.filteredProjects[i - 1].imageURL} : { uri: defaultProfileBackgroundImage}} style={[styles.calcColumn40,styles.height150]}  />
                  <View style={[styles.darkTint]} />
                  <View style={[styles.absolutePosition,styles.absoluteTop5,styles.absoluteLeft5]}>
                    {(this.state.filteredProjects[i - 1].matchScore) && (
                      <View style={[styles.square40]}>
                        <Progress.Circle progress={this.state.filteredProjects[i - 1].matchScore/ 100} size={styles.width40.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                      </View>
                    )}
                    <Text style={[styles.roundedCorners,styles.horizontalPadding10,styles.row5,styles.whiteBorder,styles.descriptionText5,styles.whiteColor,styles.boldText]}>{this.state.filteredProjects[index].category}</Text>
                  </View>
                </View>

                <View style={[styles.spacer]} />

                <View style={[styles.padding20]}>
                  <Text style={[styles.headingText6]}>{this.state.filteredProjects[index].name}</Text>

                  <View style={[styles.topPadding20]}>
                    <View style={[styles.row10,styles.rowDirection]}>
                      <View style={[styles.width35]}>
                        <Image style={[styles.square25,styles.contain, { borderRadius: 12.5 }]} source={(this.state.filteredProjects[index].userPic) ? { uri: this.state.filteredProjects[index].userPic} : { uri: profileIconDark}} />
                      </View>
                      <View style={[styles.calcColumn155]} >
                        <Text style={[styles.descriptionText1]}>{this.state.filteredProjects[index].userFirstName} {this.state.filteredProjects[index].userLastName}</Text>
                        <Text style={[styles.descriptionText5]}>{this.state.filteredProjects[index].hours} Hours</Text>
                      </View>
                    </View>
                    <View style={[styles.row10]}>
                      <Text style={[styles.descriptionText3,styles.calcColumn120]}>{(this.state.filteredProjects[index].startDate) && this.state.filteredProjects[index].startDate + " - "}{(this.state.filteredProjects[index].isContinual) ? "Present" : this.state.filteredProjects[index].endDate}</Text>
                    </View>
                  </View>

                  {(this.state.filteredProjects[index].collaborators && this.state.filteredProjects[index].collaborators.length > 0) && (
                    <View style={[styles.topPadding,styles.rowDirection]}>
                      <Text style={[styles.descriptionText5,styles.leftPadding5]}>|</Text>
                      <Text style={[styles.descriptionText5,styles.leftPadding5]}>{this.state.filteredProjects[index].collaborators.length} Collaborators</Text>
                    </View>
                  )}

                  <View style={[styles.topPadding,styles.rowDirection,styles.flexWrap]}>
                    {tagArray.map((value, optionIndex) =>
                      <View key={value}>
                        {(optionIndex < 3) && (
                          <View key={value} style={[styles.row5,styles.rightPadding]}>
                            <View style={[styles.row5,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.transparentBorder,styles.lightBackground]}>
                              <Text style={[styles.descriptionText3]}>{value}</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                  </View>

                  <View style={[styles.topPadding20,styles.rowDirection,styles.flex1]}>
                    <View style={[styles.flex50]}>
                      <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.rightMargin5,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={() => this.setState({ modalIsOpen: true, showProjectDetail: true, showGrade: false, selectedIndex1: index })}><Text style={[styles.descriptionText3,styles.whiteColor]}>View</Text></TouchableOpacity>
                    </View>
                    <View style={[styles.flex50]}>
                      {(this.props.pageSource === 'BrowseProjects') ? (
                        <TouchableOpacity style={this.state.favorites.includes(this.state.filteredProjects[i - 1]._id) ? [styles.btnSquarish,styles.mediumBackground,styles.leftMargin5,styles.flexCenter] : [styles.btnSquarish,styles.ctaBorder,styles.leftMargin5,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={(e) =>  this.favoriteItem(e, this.state.filteredProjects[i - 1])}>{this.state.favorites.includes(this.state.filteredProjects[i - 1]._id) ? <Text style={[styles.whiteColor,styles.descriptionText3]}>Following</Text> : <Text style={[styles.ctaColor,styles.descriptionText3]}>Follow</Text>}</TouchableOpacity>
                      ) : (
                        <TouchableOpacity style={[styles.btnSquarish,styles.leftMargin5,styles.ctaBorder,styles.flexCenter]} onPress={(e) => this.showGrade(e, index) }><Text style={[styles.descriptionText3,styles.ctaColor]}>Feedback</Text></TouchableOpacity>
                      )}
                    </View>
                  </View>

                  {(this.state.sortCriteriaArray && this.state.sortCriteriaArray[i - 1] && this.state.sortCriteriaArray[i - 1].name) && (
                    <View style={[styles.topPadding]}>
                      <View style={[styles.halfSpacer]} />
                      <Text style={[styles.descriptionText2,styles.errorColor]}>{this.state.sortCriteriaArray[i - 1].name}: {this.state.sortCriteriaArray[i - 1].criteria}</Text>
                    </View>
                  )}
                  {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[i - 1] && this.state.filterCriteriaArray[i - 1].name) && (
                    <View style={[styles.topPadding]}>
                      <View style={[styles.halfSpacer]} />
                      <Text style={[styles.descriptionText2,styles.errorColor]}>{this.state.filterCriteriaArray[i - 1].name}: {this.state.filterCriteriaArray[i - 1].criteria}</Text>
                    </View>
                  )}

                </View>
              </View>
            </TouchableOpacity>
          </View>


          <View style={[styles.spacer]} />
        </View>
      )
    }

    return rows
  }

  showGrade(e, index) {
    console.log('showGrade called', e, this.state.filteredProjects[index], this.state.showProjectDetail)

    e.stopPropagation()

    const modalIsOpen = true
    const selectedIndex1 = index
    const showProjectDetail = false
    const showGrade = true

    let selectedIndex2 = 0
    let filteredProjects = this.state.filteredProjects

    const contributorFirstName = this.state.cuFirstName
    const contributorLastName = this.state.cuLastName
    const contributorEmail = this.state.emailId
    const contributorRoleName = this.props.roleName
    const contributorTitle = this.state.jobTitle
    const contributorEmployerName = this.state.employerName

    let orgCode = ''
    if (this.state.org && this.state.org !== '') {
      orgCode = this.state.org
    }

    let accountCode = ''
    if (this.state.accountCode) {
      accountCode = this.state.accountCode
    }

    const isApproved = false
    const updatedAt = new Date()

    if (filteredProjects[index].grades && filteredProjects[index].grades.length > 0) {
      //find the case where provideEmail matches this email, otherwise add to grades array
      console.log('show grades 1: ', filteredProjects[index].grades[0].contributorEmail, this.state.emailId)

      //determine selectedIndex2
      let existingGrade = false
      for (let i = 1; i <= filteredProjects[index].grades.length; i++) {
        if (filteredProjects[index].grades[i - 1].contributorEmail === this.state.emailId) {
          selectedIndex2 = i - 1
          existingGrade = true
        }
      }

      if (existingGrade === false) {
        selectedIndex2 = filteredProjects[index].grades.length
        filteredProjects[index]['grades'][selectedIndex2] =
          { contributorFirstName, contributorLastName, contributorEmail, contributorRoleName, contributorTitle, contributorEmployerName,
            isTransparent: true, orgCode, accountCode, isApproved, updatedAt }
      }
      console.log('show update: ', existingGrade, selectedIndex2)

    } else {
      console.log('no grades to be found')
      filteredProjects[index]['grades'] = [
        { contributorFirstName, contributorLastName, contributorEmail, contributorRoleName, contributorTitle, contributorEmployerName,
          isTransparent: true, orgCode, accountCode, isApproved, updatedAt }
      ]

    }
    console.log('show contributorRoleName ', contributorFirstName, contributorLastName, contributorRoleName, contributorTitle, contributorEmployerName, filteredProjects[index].grades)

    this.setState({ showProjectDetail, showGrade, modalIsOpen, selectedIndex1, selectedIndex2, filteredProjects })
  }

  closeModal() {
    console.log('closeModal in projects: ', this.state.showProjectDetail)

    this.setState({ modalIsOpen: false });
    //
    // if (this.state.showProjectDetail) {
    //   this.child.current.closeModal()
    // } else {
    //   this.setState({ modalIsOpen: false });
    // }
  }

  render() {

    let passedClassName = 'main-adv-panel'
    let passedClassName2 = 'main-adv-panel clear-background clear-shadow clear-padding'
    let passedStyle = {...styles, opacity: this.state.opacity, transform: this.state.transform, marginBottom: '0px', padding: '15px 20px'}
    // const addIconWidth = '45px'
    const passedStyle2 = {...styles, opacity: this.state.opacity, transform: this.state.transform, marginTop: '2%', padding: '20px' }
    const passedPlaceholder = 'Search projects by name or creator...'
    // const pathname = '/advisor/projects/add'
    let filterClass = "filter-container"

    if (this.props.pageSource === 'BrowseProjects') {
      passedClassName = "standard-container-2"
      passedStyle = {}
      filterClass = "standard-container-2"
      passedClassName2 = "standard-container-2 clear-background clear-shadow clear-padding"
    }

    return (
        <ScrollView>
            <View>
              <View style={[styles.card,styles.topMargin20]}>
                <View style={[styles.rowDirection]}>
                  <View style={[styles.calcColumn95]}>
                    <View style={[styles.spacer]} />
                    <Text style={[styles.headingText2]}>{this.state.filteredProjects.length} Projects</Text>
                  </View>
                  <View style={[styles.width45]}>
                    <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                    <View style={[styles.row5,styles.rightPadding20]}>
                      <TouchableOpacity onPress={() => this.toggleSearchBar('show')}>
                        <Image source={(this.state.showingSearchBar) ? { uri: hideIcon} : { uri: searchIcon}} style={[styles.square25,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
                <View style={[styles.spacer]} />
              </View>

              {(this.state.showingSearchBar) && (
                <View style={[styles.card,styles.topMargin20]}>
                  <View>
                    <View style={[styles.calcColumn60,styles.lightBorder,styles.row3,styles.horizontalPadding5,styles.topMargin15,styles.rightPadding]}>
                        <View style={[styles.halfSpacer]}/>
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.topPadding8,styles.leftPadding3]}>
                            <Image source={{ uri: searchIcon}} style={[styles.square18,styles.contain]}/>
                          </View>
                          <View style={[styles.calcColumn90]}>
                            <TextInput
                              style={styles.height30}
                              onChangeText={(text) => this.formChangeHandler('search', text)}
                              value={this.state.searchString}
                              placeholder={passedPlaceholder}
                              placeholderTextColor="grey"
                            />
                          </View>
                        </View>
                    </View>

                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                    <View style={[styles.horizontalLine]} />
                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                    <Text>Filter</Text>
                    <View style={[styles.halfSpacer]} />

                    <View style={[styles.rowDirection,styles.flexWrap]}>
                      {(this.renderManipulators('filter'))}
                    </View>


                    <View style={[styles.spacer]} />
                    <View style={[styles.horizontalLine]} />
                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                    <Text>Sort</Text>
                    <View style={[styles.halfSpacer]} />
                    <View style={[styles.rowDirection,styles.flexWrap]}>
                      {(this.renderManipulators('sort'))}
                    </View>

                  </View>
                </View>
              )}

              {(this.state.animating) ? (
                <View style={[styles.flex1,styles.flexCenter]}>
                  <View>
                    <ActivityIndicator
                       animating = {this.state.animating}
                       color = '#87CEFA'
                       size = "large"
                       style={[styles.square80, styles.centerHorizontally]}/>

                    <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                    {(this.state.orgFocus === 'Placement') ? (
                      <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Calculating results...</Text>
                    ) : (
                      <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Calculating results and work matches...</Text>
                    )}

                  </View>
                </View>
              ) : (
                <View>
                  {this.renderItems()}
                </View>
              )}

            </View>

            {(this.state.showProjectDetail) ? (
              <View>
                <ProjectDetails closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedProject={this.state.projects[this.state.selectedIndex1]} orgCode={this.state.org} />
              </View>
            ) : (
                <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>

                {(this.state.showGrade) && (
                  <View key="gradeProject" style={[styles.calcColumn80,styles.padding20]}>
                    {(this.state.projects[this.state.selectedIndex1]) && (
                      <View>
                        <View style={[styles.row10]}>
                          <Text style={[styles.headingText4]}>{this.state.projects[this.state.selectedIndex1].name} - Add Grade & Feedback</Text>
                          <View style={[styles.halfSpacer]} />
                          <Text style={[styles.descriptionText2,styles.boldText]}>Add a grade and feedback here. Browse previous feedback below.</Text>
                        </View>

                        <View style={[styles.row10]}>
                          <Text style={[styles.row10]}>Grade The Project (You Can Edit Later)</Text>
                          <Picker
                            selectedValue={this.state.projects[this.state.selectedIndex1].grades[this.state.selectedIndex2].grade}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("grade",itemValue)
                            }>
                            {this.state.gradeOptions.map(value => <Picker.Item label={value} value={value} />)}
                          </Picker>
                        </View>
                        <View style={[styles.row10]}>
                          <Text style={[styles.row10]}>Provide Constructive Feedback</Text>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("feedback", text)}
                            value={this.state.projects[this.state.selectedIndex1].grades[this.state.selectedIndex2].feedback}
                            placeholder="Project feedback..."
                            placeholderTextColor="grey"
                            multiline={true}
                            numberOfLines={4}
                          />
                        </View>

                        <View style={[styles.row10]}>
                          <Text style={[styles.row10]}>Transparency to Student</Text>
                          <Picker
                            selectedValue={this.state.projects[this.state.selectedIndex1].grades[this.state.selectedIndex2].isTransparent}
                            onValueChange={(itemValue, itemIndex) =>
                              this.formChangeHandler("isTransparent",itemValue)
                            }>
                            <Picker.Item label={"Students can see the feedback [Keep transparent]"} value={true} />
                            <Picker.Item label={"Students cannot see the feedback [Keep confidential]"} value={false} />
                          </Picker>
                          <Text style={[styles.descriptionText2]}>Note: this feedback is viewable by teachers, counselors, mentors, and work placement organizations.</Text>
                        </View>

                        <View>
                          { (this.state.clientErrorMessage!== '') && <Text style={[styles.errorColor]}>{this.state.clientErrorMessage}</Text> }
                          { (this.state.serverPostSuccess) ? (
                            <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessage}</Text>
                          ) : (
                            <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>
                          )}

                          <View style={[styles.rowDirection]}>
                            <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter,styles.rightMargin]} onPress={() => this.saveFeedback()}><Text style={[styles.standardText,styles.whiteColor]}>Save Feedback</Text></TouchableOpacity>
                            <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.setState({ modalIsOpen: false })}><Text style={[styles.standardText,styles.ctaColor]}>Cancel</Text></TouchableOpacity>
                          </View>

                        </View>

                        <View style={[styles.spacer]}/><View style={[styles.spacer]}/>
                        <View style={[styles.horizontalLine]} />
                        <View style={[styles.spacer]}/><View style={[styles.spacer]}/>

                        <Text style={[styles.headingText6]}>Other Feedback on {this.state.projects[this.state.selectedIndex1].name}</Text>
                        <View style={[styles.spacer]}/><View style={[styles.spacer]}/>

                        {this.state.projects[this.state.selectedIndex1].grades.map((value, index) =>
                          <View key={value}>
                            {(index !== this.state.selectedIndex2) && (
                              <View>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.width60]}>
                                    <Text style={[styles.headingText2,styles.ctaColor,styles.boldText]}>{value.grade}</Text>
                                  </View>
                                  <View style={[styles.calcColumn180]}>
                                    <Text style={[styles.descriptionText2]}>{value.contributorFirstName} {value.contributorLastName} ({value.contributorRoleName}) {(value.contributorTitle) && " - " + value.contributorTitle + " @ " + value.contributorEmployerName}</Text>
                                    <Text style={[styles.headingText6]}>{value.feedback}</Text>
                                  </View>

                                </View>

                                <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                              </View>
                            )}
                          </View>
                        )}

                        <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                      </View>
                    )}
                  </View>
                )}

                <View style={[styles.row20]}>
                 <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close View</Text></TouchableOpacity>
                </View>
               </Modal>
            )}

        </ScrollView>
    )
  }

}

export default Projects;
