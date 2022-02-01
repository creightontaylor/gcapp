import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';

const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const hideIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/hide-icon.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';
const industryIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/industry-icon-dark.png';
const favoritesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-dark.png';
const favoriteIconSelected  = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorite-icon-selected.png';

import SubPicker from '../common/SubPicker';

class Employers extends Component {
  constructor(props) {
    super(props)
    this.state = {
      filteredEmployers: [],
      timerId: 0,
      favorites: [],

      defaultFilterOption: 'Everyone',
      defaultSortOption: 'No Sort Applied',

      memberFilter: '',
      applicationFilter: '',
      assessmentFilter: '',
      favoriteFilter: '',
      passionFilter: '',
      endorsementFilter: '',

      applicationFilterOptions: [],
      assessmentFilterOptions: ['','Has None','At Least One','Has All'],
      favoriteFilterOptions: ['','Has None','At Least One'],
      passionFilterOptions: ['','Has None','At Least One'],
      endorsementFilterOptions: ['','Has None','At Least One'],

      applications: [],
      filteredApplications: [],
      selectedJob: null,
      benchmark: null,
      benchmarkOptions: [],

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
    this.renderEmployers = this.renderEmployers.bind(this)
    this.closeModal = this.closeModal.bind(this)

  }

  componentDidMount() {
    console.log('employers component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ')

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      console.log('t0 will update')
      this.retrieveData()
    // } else if (this.props.employers && this.props.employers.length !== prevProps.employers.length) {
    //   this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      // console.log('this is causing the error')
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

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, org, orgFocus, orgName, remoteAuth
        })

        //filters
        const defaultFilterOption = this.state.defaultFilterOption
        const defaultSortOption = this.state.defaultSortOption

        let industryFilterOptions = []
        let politicalPartyFilterOptions = []
        let typeFilterOptions = []
        let employeeCountFilterOptions = []
        let employeeGrowthFilterOptions = []
        let foundingYearFilterOptions = []
        let activeFilterOptions = []

        //sort options
        let postSortOptions = []
        let eventSortOptions = []
        let applicationSortOptions = []
        let interviewSortOptions = []
        let hireSortOptions = []
        let projectedHireSortOptions = []

        let employerFilters = []
        let employerSorters = []

        //employerFilters
        typeFilterOptions = [defaultFilterOption]
        industryFilterOptions = [defaultFilterOption]
        employeeCountFilterOptions = [defaultFilterOption]
        employeeGrowthFilterOptions = [defaultFilterOption]
        politicalPartyFilterOptions = [defaultFilterOption]
        foundingYearFilterOptions = [defaultFilterOption,'Before 25 Years Ago','Before 10 Years Ago','Before 5 Years Ago','Before 3 Years Ago','3 Years Ago or After']
        activeFilterOptions = [defaultFilterOption,'Is Active','Is Not Active']

        employerFilters = [
          { name: 'Type', value: defaultFilterOption, options: typeFilterOptions},
          { name: 'Industry', value: defaultFilterOption, options: typeFilterOptions},
          { name: '# of Employees', value: defaultFilterOption, options: employeeCountFilterOptions},
          { name: 'Employee Growth', value: defaultFilterOption, options: employeeGrowthFilterOptions},
          { name: 'Founding Year', value: defaultFilterOption, options: foundingYearFilterOptions},
          { name: 'Active', value: defaultFilterOption, options: activeFilterOptions},
        ]

        if (org === 'c2c') {
          employerFilters.push(
            { name: 'Political Party', value: defaultFilterOption, options: politicalPartyFilterOptions}
          )
        }

        //sort
        eventSortOptions = [defaultSortOption,'Most RSVPs to Events Hosted']
        postSortOptions = [defaultSortOption,'Most Posts']
        applicationSortOptions = [defaultSortOption,'Most Applications']
        interviewSortOptions = [defaultSortOption,'Most Interviews']
        hireSortOptions = [defaultSortOption,'Most Prior Hires']
        projectedHireSortOptions = [defaultSortOption,'Most Projected Hires']

        employerSorters = [
          { name: 'Events', value: defaultSortOption, options: eventSortOptions},
          { name: 'Posts', value: defaultSortOption, options: postSortOptions},
          { name: 'Applications', value: defaultSortOption, options: applicationSortOptions},
          { name: 'Interviews', value: defaultSortOption, options: interviewSortOptions},
          { name: 'Previous Hires', value: defaultSortOption, options: hireSortOptions},
          { name: 'Projected Hires', value: defaultSortOption, options: projectedHireSortOptions}
        ]

        this.setState({ emailId: email, username, org, roleName, orgFocus,
          employerFilters, employerSorters, animating: true
        });

        Axios.get('https://www.guidedcompass.com/api/workoptions')
        .then((response) => {
          console.log('Work options query tried');

          if (response.data.success) {
            console.log('Work options query succeeded')

            let typeOptions = response.data.workOptions[0].employerTypeOptions
            typeOptions.shift()
            let industryOptions = response.data.workOptions[0].industryOptions
            industryOptions.shift()
            let employeeCountOptions = response.data.workOptions[0].employeeCountOptions
            employeeCountOptions.shift()
            let employeeGrowthOptions = response.data.workOptions[0].employeeGrowthOptions
            employeeGrowthOptions.shift()
            let politicalPartyOptions = response.data.workOptions[0].politicalAlignmentOptions


            for (let i = 1; i <= employerFilters.length; i++) {
              const name = employerFilters[i - 1].name
              if (name === 'Type') {
                typeFilterOptions = typeFilterOptions.concat(typeOptions)
                employerFilters[i - 1]['options'] = typeFilterOptions
              } else if (name === 'Industry') {
                industryFilterOptions = industryFilterOptions.concat(industryOptions)
                employerFilters[i - 1]['options'] = industryFilterOptions
              } else if (name === '# of Employees') {
                employeeCountFilterOptions = employeeCountFilterOptions.concat(employeeCountOptions)
                employerFilters[i - 1]['options'] = employeeCountFilterOptions
              } else if (name === 'Employee Growth') {
                employeeGrowthFilterOptions = employeeGrowthFilterOptions.concat(employeeGrowthOptions)
                employerFilters[i - 1]['options'] = employeeGrowthFilterOptions
              } else if (name === 'Political Party') {
                politicalPartyFilterOptions = politicalPartyFilterOptions.concat(politicalPartyOptions)
                employerFilters[i - 1]['options'] = politicalPartyFilterOptions
              }
            }

            this.setState({ employerFilters })
          }
        });

        Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId: email } })
       .then((response) => {
         console.log('Favorites query attempted');

           if (response.data.success) {
             console.log('successfully retrieved favorites')

             this.setState({ favorites: response.data.favorites })
           } else {
             console.log('no favorites data found', response.data.message)
           }

       }).catch((error) => {
           console.log('Favorites query did not work', error);
       });

       let self = this
       function pullAccounts(placementPartners) {
         console.log('pullAccounts called')

         const sortAlphabetically = true
         let resLimit = 250
         Axios.get('https://www.guidedcompass.com/api/account/partners', { params: { org, placementPartners, resLimit, sortAlphabetically } })
         .then((response) => {
           console.log('Posted employer query attempted');

           if (response.data.success) {
             console.log('posted employer query worked')

             if (response.data.employers.length !== 0) {
               const employers = response.data.employers
               const filteredEmployers = employers

               self.setState({ employers, filteredEmployers, animating: false });
             } else {
               self.setState({ animating: false })
             }

           } else {
             console.log('query for employers query did not work', response.data.message)
             self.setState({ animating: false })
           }

         }).catch((error) => {
             console.log('Employer query did not work for some reason', error);
             self.setState({ animating: false })
         });
       }

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: org } })
        .then((response) => {
          console.log('Org info query attempted');

          if (response.data.success) {
            console.log('org info query worked')

            this.setState({ orgFocus: response.data.orgInfo.orgFocus });
            pullAccounts(response.data.orgInfo.placementPartners)

          } else {
            console.log('org info query did not work', response.data.message)
            pullAccounts(null)
          }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
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
      let employerFilters = this.state.employerFilters
      for (let i = 1; i <= employerFilters.length; i++) {
        employerFilters[i - 1]['value'] = this.state.defaultFilterOption
      }
      let employerSorters = this.state.employerSorters
      for (let i = 1; i <= employerSorters.length; i++) {
        employerSorters[i - 1]['value'] = this.state.defaultSortOption
      }

      this.setState({ searchString, employerFilters, employerSorters, animating: true })

      this.filterResults(eventValue, '', null, null, true)
    } else if (eventName.includes('filter|')) {

      const filters = this.state.employerFilters

      const nameArray = eventName.split("|")
      const field = nameArray[1]

      let index = 0
      for (let i = 1; i <= filters.length; i++) {
        if (filters[i - 1].name === field) {
          filters[i - 1]['value'] = eventValue
          index = i - 1
        }
      }

      let employerFilters = filters

      //reset everything
      let searchString = ''
      for (let i = 1; i <= employerFilters.length; i++) {
        if (employerFilters[i - 1].name !== field) {
          employerFilters[i - 1]['value'] = this.state.defaultFilterOption
        }
      }
      let employerSorters = this.state.employerSorters
      for (let i = 1; i <= employerSorters.length; i++) {
        employerSorters[i - 1]['value'] = this.state.defaultSortOption
      }

      this.setState({ filters, employerFilters, animating: true, searchString, employerSorters })

      // this.resetFilters(eventName, eventValue)
      this.filterResults(this.state.searchString, eventValue, filters, index, false)
    } else if (eventName.includes('sort|')) {

      let sorters = this.state.employerSorters

      const nameArray = eventName.split("|")
      const field = nameArray[1]

      // let index = 0
      for (let i = 1; i <= sorters.length; i++) {
        if (sorters[i - 1].name === field) {
          sorters[i - 1]['value'] = eventValue
          // index = i - 1
        }
      }

      let employerSorters = sorters

      //reset everything
      let searchString = ''
      let employerFilters = this.state.employerFilters
      for (let i = 1; i <= employerFilters.length; i++) {
        employerFilters[i - 1]['value'] = this.state.defaultFilterOption
      }

      for (let i = 1; i <= employerSorters.length; i++) {
        if (employerSorters[i - 1].name !== field) {
          employerSorters[i - 1]['value'] = this.state.defaultSortOption
        }
      }

      this.setState({ searchString, employerFilters, employerSorters, animating: true })

      // this.resetFilters(eventName, eventValue)
      this.sortResults(eventValue, field)
    }
  }

  filterResults(searchString, filterString, filters, index, search) {
    console.log('filterResults called', searchString, filterString, filters, index, search)

    // const emailId = this.state.emailId
    // const orgCode = this.state.org
    const defaultFilterOption = this.state.defaultFilterOption
    const employers = this.state.employers

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      Axios.put('https://www.guidedcompass.com/api/employers/filter', {  searchString, filterString, filters, defaultFilterOption, index, search, employers })
      .then((response) => {
        console.log('Member filter query attempted');

          if (response.data.success) {
            console.log('member filter query worked')

            let filteredEmployers = response.data.employers
            const filterCriteriaArray = response.data.filterCriteriaArray
            const sortCriteriaArray = null

            self.setState({ filteredEmployers, animating: false, filterCriteriaArray, sortCriteriaArray })

          } else {
            console.log('member filter query did not work', response.data.message)
            this.setState({ animating: false })
          }

      }).catch((error) => {
          console.log('Member filter query did not work for some reason', error);
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

    let employers = this.state.employers

    Axios.put('https://www.guidedcompass.com/api/employers/sort', { sortString, employers, sortName })
    .then((response) => {
      console.log('Member sort query attempted');

        if (response.data.success) {
          console.log('member sort query worked')

          let filteredEmployers = response.data.employers
          const filterCriteriaArray = null
          const sortCriteriaArray = response.data.sortCriteriaArray

          this.setState({ filteredEmployers, animating: false, filterCriteriaArray, sortCriteriaArray })

        } else {
          console.log('member sort query did not work', response.data.message)
          this.setState({ animating: false })
        }

    }).catch((error) => {
        console.log('Member sort query did not work for some reason', error);
        this.setState({ animating: false })
    });
  }

  renderManipulators(type) {
    console.log('renderManipulators called')

    if (type === 'filter') {
      let filters = this.state.employerFilters

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
      let sorters = this.state.employerSorters

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

  favoriteItem(e, item) {
    console.log('favoriteItem called', e, item)

    // e.stopPropagation()
    e.preventDefault()

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

    console.log('show favorites: ', favoritesArray)
    this.setState({ favorites: favoritesArray })

    Axios.post('https://www.guidedcompass.com/api/favorites/save', {
      favoritesArray, emailId: this.state.emailId
    })
    .then((response) => {
      console.log('attempting to save favorites')
      if (response.data.success) {
        console.log('saved successfully')
        //clear values
        this.setState({ isSaving: false, successMessage: response.data.message })
      } else {
        console.log('did not save successfully')
        this.setState({ isSaving: false, errorMessage: 'error:' + response.data.message })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ isSaving: false, errorMessage: 'there was an error saving favorites' })
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

  renderEmployers() {
    console.log('renderMatches called', this.state.filteredEmployers)

    let rows = []

    for (let i = 1; i <= this.state.filteredEmployers.length; i++) {

      const item = this.state.filteredEmployers[i - 1]
      const index = i - 1

      let subtitle = ''

      // let passedState = { member: this.state.filteredEmployers[index] }
      let updatedAtString = ''
      if (this.state.filteredEmployers[i - 1].updatedAt) {
        updatedAtString = this.state.filteredEmployers[i - 1].updatedAt.toString()
        const year = updatedAtString.substring(0,4)
        const month = updatedAtString.substring(5,7)
        const day = updatedAtString.substring(8,10)
        const formattedMonth = this.formatMonth(month)
        updatedAtString = formattedMonth + ' ' + day + ', ' + year
        subtitle = 'Last Update: ' + updatedAtString
        if (this.state.filteredEmployers[i - 1].employerIndustry) {
          subtitle = this.state.filteredEmployers[i - 1].employerIndustry + ' | ' + subtitle
        }
      }

      let thirdTitle = null
      if (this.state.filteredEmployers[i - 1].employeeCount) {
        thirdTitle = this.state.filteredEmployers[i - 1].employeeCount
        if (!this.state.filteredEmployers[i - 1].employeeCount.includes('employees')) {
          thirdTitle = thirdTitle + ' employees'
        }
      }
      if (this.state.filteredEmployers[i - 1].employerLocation) {
        if (thirdTitle) {
          thirdTitle = thirdTitle + ' | ' + this.state.filteredEmployers[i - 1].employerLocation
        } else {
          thirdTitle = this.state.filteredEmployers[i - 1].employerLocation
        }
      }

      // if (item.orgContacts && item.orgContacts.length > 0) {
      //   orgContacts = item.orgContacts
      // }

      let mainColumnClass = "calc-column-offset-100-static"
      if (this.props.pageSource === 'BrowseEmployers') {
        mainColumnClass = "calc-column-offset-130"
      }

      rows.push(
        <View key={i}>
            <View style={[styles.topPadding20,styles.bottomPadding30]}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('EmployerDetails', { selectedEmployer: item, employers: this.state.filteredEmployers })} style={[styles.rowDirection]}>
                <View style={[styles.width70]}>
                  <Image source={(item.employerLogoURI) ? { uri: item.employerLogoURI} : { uri: industryIconDark}} style={[styles.square50,styles.contain]}/>
                </View>
                <View style={[styles.calcColumn190]}>
                  <Text style={[styles.headingText5]}>{item.employerName}</Text>
                  <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.topPadding5]}>{subtitle}</Text>
                  {(thirdTitle) && (
                    <Text style={[styles.descriptionText2,styles.errorColor,styles.topPadding5]}>{thirdTitle}</Text>
                  )}
                </View>
                {(this.props.pageSource === 'BrowseEmployers') && (
                  <View style={[styles.width30,styles.topMargin,styles.alignEnd]}>
                    <TouchableOpacity disabled={(this.state.isSaving) ? true : false} onPress={(e) => this.favoriteItem(e, item)}>
                      <Image source={(this.state.favorites.includes(item._id)) ? { uri: favoriteIconSelected} : { uri: favoritesIconDark}} style={[styles.square20,styles.contain]}/>
                    </TouchableOpacity>
                  </View>
                )}
                <View style={[styles.width30,styles.topMargin,styles.alignEnd]}>
                  <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain]}/>
                </View>
              </TouchableOpacity>
            </View>

            {(this.state.sortCriteriaArray && this.state.sortCriteriaArray[i - 1] && this.state.sortCriteriaArray[i - 1].name) && (
              <View style={[styles.leftPadding110]}>
                <View style={[styles.halfSpacer]} />
                <Text style={[styles.descriptionText2,styles.errorColor]}>{this.state.sortCriteriaArray[i - 1].name}: {this.state.sortCriteriaArray[i - 1].criteria}</Text>
              </View>
            )}
            {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[i - 1] && this.state.filterCriteriaArray[i - 1].name) && (
              <View style={[styles.leftPadding110]}>
                <View style={[styles.halfSpacer]} />
                <Text style={[styles.descriptionText2,styles.errorColor]}>{this.state.filterCriteriaArray[i - 1].name}: {this.state.filterCriteriaArray[i - 1].criteria}</Text>
              </View>
            )}
            <View style={[styles.horizontalLine]} />

        </View>
      )
    }

    return rows
  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showMatchingCriteria: false, showPicker: false })

  }

  render() {

    let passedClassName = 'main-adv-panel'
    let passedStyle = {...styles, opacity: this.state.opacity, transform: this.state.transform, marginBottom: '0px', padding: '15px 20px'}

    const passedStyle2 = {...styles, opacity: this.state.opacity, transform: this.state.transform, marginTop: '2%', padding: '20px' }
    const passedPlaceholder = 'Search employers by name...'
    let filterClass = "filter-container"

    let headerLeftColumnWidth = "calc-column-offset-70"
    let headerRightColumnWidth = "fixed-column-70"

    if (this.props.pageSource === 'BrowseEmployers') {
      passedClassName = 'standard-container-2'
      passedStyle = {}
      filterClass = 'standard-container-2'
      headerLeftColumnWidth = "calc-column-offset-25"
      headerRightColumnWidth = "fixed-column-25"
    }

    return (
        <ScrollView>
            <View>
              <View style={[styles.card,styles.topMargin20]}>
                <View style={[styles.rowDirection]}>
                  <View style={[styles.calcColumn85]}>
                    <View style={[styles.spacer]} />
                    <Text style={[styles.headingText2]}>{this.state.filteredEmployers.length} Employers</Text>
                  </View>
                  <View style={[styles.width25]}>
                    <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                    <View>
                      <View style={[styles.halfSpacer]} />
                      <TouchableOpacity onPress={() => this.toggleSearchBar('show')}>
                        <Image source={(this.state.showingSearchBar) ? { uri: hideIcon} : { uri: searchIcon}} style={[styles.square25,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {(this.state.showingSearchBar) && (
                <View style={[styles.card,styles.topMargin]}>
                  <View>
                    <View style={[styles.lightBorder,styles.row3,styles.horizontalPadding3,styles.topMargin15,styles.rightMargin,styles.calcColumn60,styles.rowDirection]}>
                      <View style={[styles.topPadding8,styles.leftPadding3]}>
                        <Image source={{ uri: searchIcon}} style={[styles.square20,styles.contain]} />
                      </View>
                      <View style={[styles.calcColumn104]}>
                        <TextInput
                          style={styles.height30}
                          onChangeText={(text) => this.formChangeHandler('search', text)}
                          value={this.state.searchString}
                          placeholder={passedPlaceholder}
                          placeholderTextColor="grey"
                        />
                      </View>
                    </View>

                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                    <View style={[styles.horizontalLine]} />
                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                    <Text>Filter</Text>
                    <View style={[styles.halfSpacer]} />
                    {(this.renderManipulators('filter'))}

                    <View style={[styles.spacer]} />
                    <View style={[styles.horizontalLine]} />

                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                    <Text>Sort</Text>
                    <View style={[styles.halfSpacer]} />
                    {(this.renderManipulators('sort'))}

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
                    <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Calculating results...</Text>

                  </View>
                </View>
              ) : (
                <View style={[styles.card,styles.topMargin20]}>
                  {this.renderEmployers()}
                </View>
              )}

            </View>

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

export default Employers;
