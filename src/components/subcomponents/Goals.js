import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, TextInput, ActivityIndicator } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';
import {Picker} from '@react-native-picker/picker';

import SubGoalDetails from '../common/GoalDetails';
import SubRenderGoals from '../common/RenderGoals';

const loadingGIF = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/loading-gif.gif';
const searchIcon = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png";
const hideIcon = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/hide-icon.png";

class Goals extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.toggleSearchBar = this.toggleSearchBar.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.renderManipulators = this.renderManipulators.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in projects')

    if (this.props.orgCode !== prevProps.orgCode || this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      console.log('t0 will update')
      this.retrieveData()
    } else if (this.props.passedId !== prevProps.passedId) {
      this.retrieveData()
    } else if (this.props.noOrgCode !== prevProps.noOrgCode) {
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
      if (this.props.orgCode) {
        activeOrg = this.props.orgCode
      }
      const org = activeOrg

      this.setState({ emailId, activeOrg, username, cuFirstName, cuLastName, orgFocus, loadingItems: true })

      if (activeOrg || this.props.noOrgCode) {

        let queryParams = { resLimit: 100 }
        if (activeOrg) {
          queryParams = { orgCode: activeOrg }
        } else {
          // queryParams = { orgCode: 'guidedcompass' }
          // queryParams = { isPublic: true }
        }

        queryParams['publicExtentArray'] = ['Members Only','Public']

        Axios.get('https://www.guidedcompass.com/api/logs/goals', { params: queryParams })
       .then((response) => {
         console.log('Goals query attempted', response.data);

         if (response.data.success) {
           console.log('successfully retrieved goals')

           const goals = response.data.goals
           const filteredGoals = response.data.goals
           this.setState({ goals, filteredGoals, loadingItems: false })

         } else {
           console.log('no goals data found', response.data.message)
           this.setState({ loadingItems: false })
         }

       }).catch((error) => {
           console.log('Goals query did not work', error);
           this.setState({ loadingItems: false })
       });

       if (this.props.passedId) {
         Axios.get('https://www.guidedcompass.com/api/logs/byid', { params: { _id: this.props.passedId } })
        .then((response) => {
          console.log('Goal by id query attempted', response.data);

          if (response.data.success) {
            console.log('successfully retrieved goal')

            this.setState({ modalIsOpen: true, showHelpOutWidget: true, selectedGoal: response.data.log })

          } else {
            console.log('no goals data found', response.data.message)
            this.setState({ loadingItems: false })
          }

        }).catch((error) => {
            console.log('Goal by id query did not work', error);
            this.setState({ loadingItems: false })
        });
       }

       Axios.get('https://www.guidedcompass.com/api/workoptions')
       .then((response) => {
         console.log('Work options query tried', response.data);

         if (response.data.success) {
           console.log('Work options query succeeded')

           // filter: by name, by deadline year, by type, optimized for
           // sort: by deadline

           let functionOptions = response.data.workOptions[0].functionOptions
           let industryOptions = response.data.workOptions[0].industryOptions
            let goalTypeOptions = []
            if (response.data.workOptions[0].goalTypeOptions) {
              for (let i = 1; i <= response.data.workOptions[0].goalTypeOptions.length; i++) {
                if ((orgFocus === 'academy' || orgFocus === 'School') && !response.data.workOptions[0].goalTypeOptions[i - 1].adult) {
                  goalTypeOptions.push(response.data.workOptions[0].goalTypeOptions[i - 1].description)
                } else if ((orgFocus !== 'academy' && orgFocus !== 'School')) {
                  goalTypeOptions.push(response.data.workOptions[0].goalTypeOptions[i - 1].description)
                }
              }
            }

           //filters
           const defaultFilterOption = this.state.defaultFilterOption

           // const gradeFilterOptions = [defaultFilterOption].concat(gradeOptions.slice(1, gradeOptions.length))
           const optimizeFilterOptions = [defaultFilterOption].concat(response.data.workOptions[0].optimizeOptions)
           const functionFilterOptions = [defaultFilterOption].concat(functionOptions.slice(1, functionOptions.length))
           const industryFilterOptions = [defaultFilterOption].concat(industryOptions.slice(1, industryOptions.length))
           const goalTypeFilterOptions = [defaultFilterOption].concat(goalTypeOptions)

           const itemFilters = [
             { name: 'Type', value: defaultFilterOption, options: goalTypeFilterOptions },
             { name: 'Optimize For', value: defaultFilterOption, options: optimizeFilterOptions },
             { name: 'Work Function', value: defaultFilterOption, options: functionFilterOptions },
             { name: 'Industry', value: defaultFilterOption, options: industryFilterOptions },
           ]

           //sort options
           const defaultSortOption = this.state.defaultSortOption

           const itemSorters = [
             { name: 'By Deadline', value: defaultSortOption, options: [defaultSortOption].concat(['Soonest','Latest'])},
           ]

           this.setState({ itemFilters, itemSorters });

         } else {
           console.log('no jobFamilies data found', response.data.message)
         }
       }).catch((error) => {
           console.log('query for work options did not work', error);
       })
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler = (eventName, eventValue) => {
    console.log('formChangeHandler called', eventName, eventValue)

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

      this.setState({ searchString, itemFilters, itemSorters, loadingItems: true })
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

      this.setState({ filters, itemFilters, loadingItems: true, searchString, itemSorters })

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

      this.setState({ searchString, itemFilters, itemSorters, loadingItems: true })

      this.sortResults(eventValue, field)

    } else {
      this.setState({ [eventName]: eventValue })
    }
  }

  filterResults(searchString, filterString, filters, index, search) {
    console.log('filterResults called', searchString, filterString, filters, index, search)

    // const emailId = this.state.emailId
    // const orgCode = this.state.org
    const defaultFilterOption = this.state.defaultFilterOption
    const goals = this.state.goals
    const type = this.props.type
    const emailId = this.state.emailId
    const orgCode = this.state.activeOrg

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      Axios.put('https://www.guidedcompass.com/api/goals/filter', {  searchString, filterString, filters, defaultFilterOption, index, search, goals, type, emailId, orgCode })
      .then((response) => {
        console.log('Goal filter query attempted', response.data);

          if (response.data.success) {
            console.log('goal filter query worked')

            let filteredGoals = response.data.goals
            const filterCriteriaArray = response.data.filterCriteriaArray
            const sortCriteriaArray = null

            self.setState({ filteredGoals, loadingItems: false, filterCriteriaArray, sortCriteriaArray })

          } else {
            console.log('project filter query did not work', response.data.message)
            self.setState({ loadingItems: false })
          }

      }).catch((error) => {
          console.log('Project filter query did not work for some reason', error);
          self.setState({ loadingItems: false })
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

    let goals = this.state.goals
    // let filteredProjects = []

    Axios.put('https://www.guidedcompass.com/api/goals/sort', { sortString, goals, sortName })
    .then((response) => {
      console.log('Goal sort query attempted', response.data);

        if (response.data.success) {
          console.log('project sort query worked')

          let filteredGoals = response.data.goals
          const filterCriteriaArray = null
          const sortCriteriaArray = response.data.sortCriteriaArray

          this.setState({ filteredGoals, loadingItems: false, filterCriteriaArray, sortCriteriaArray })

        } else {
          console.log('goal sort query did not work', response.data.message)
          this.setState({ loadingItems: false })
        }

    }).catch((error) => {
        console.log('Goal sort query did not work for some reason', error);
        this.setState({ loadingItems: false })
    });
  }

  closeModal() {

    this.setState({ modalIsOpen: false, showGoalDetails: false, showHelpOutWidget: false,
      selectedGoal: null
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
      let sorters = this.state.itemSorters
      console.log('show sorters: ', sorters)

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

  render() {

    return (
        <ScrollView>
          <View style={[styles.card,styles.bottomMargin30,styles.rowDirection]}>
            <View styles={[styles.calcColumn110]}>
              <Text style={[styles.headingText2]}>{(this.state.filteredGoals) ? this.state.filteredGoals.length + " " : ""}{(!this.state.activeOrg) ? " Public " : ""}Goals</Text>
            </View>
            <View styles={[styles.width50]}>
              <View style={[styles.halfSpacer]} /><View className="mini-spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
              <View style={[styles.row5,styles.rightPadding20]}>
                <TouchableOpacity onPress={() => this.toggleSearchBar('show')}>
                  <Image source={(this.state.showingSearchBar) ? { uri: hideIcon} : { uri: searchIcon}} className="image-25-fit"/>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {(this.state.showingSearchBar) && (
            <View className={filterClass} style={passedStyle2}>
              <View>
                <View >
                  <View style={[styles.halfSpacer]}/>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.width30]}>
                      <Image source={{ uri: searchIcon }} style={[styles.square20,styles.contain]} />
                    </View>
                    <View style={[styles.calcColumn90]}>
                      <TextInput
                        style={[styles.descriptionText2]}
                        onChangeText={(text) => this.formChangeHandler('search',text)}
                        value={this.state.searchString}
                        placeholder="Search goals..."
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

          {(this.state.loadingItems) ? (
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
            <View>
              <SubRenderGoals history={this.props.history} filteredGoals={this.state.filteredGoals}
                profileData={this.state.profileData} activeOrg={this.state.activeOrg}
                sortCriteriaArray={this.state.sortCriteriaArray} filterCriteriaArray={this.state.filterCriteriaArray}
              />
            </View>
          )}

          {(this.state.showGoalDetails || this.state.showHelpOutWidget) && (
            <View>
              <SubGoalDetails history={this.props.history} selectedGoal={this.state.selectedGoal} modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} showGoalDetails={this.state.showGoalDetails} showHelpOutWidget={this.state.showHelpOutWidget} profileData={this.state.profileData}
                orgCode={this.state.activeOrg}
              />
           </View>
          )}

        </ScrollView>

    )
  }

}

export default Goals;
