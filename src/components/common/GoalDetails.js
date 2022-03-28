import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch, Linking, TextInput, Image } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import SubPicker from '../common/SubPicker';

import {convertDateToString} from '../functions/convertDateToString';

const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png';
const projectsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-dark.png';
const projectsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-blue.png';
const careerMatchesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-dark.png';
const educationIcon = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/education-icon.png";
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png';
const addPeopleIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-people-icon-dark.png';
const addPeopleIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-people-icon-blue.png';
const linkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon.png';
const linkIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon-blue.png';
const phoneIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/phone-icon-dark.png';
const phoneIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/phone-icon-blue.png';
const tagIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/tag-icon-dark.png';
const tagIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/tag-icon-blue.png';
const pathsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/paths-icon-dark.png';
const pathsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/paths-icon-blue.png';
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';
const celebrationIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/celebration-icon.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';

class GoalDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
          selectedPeople: [],
          selectedLinks: [],
          selectedTimes: [],
          selectedProjects: [],
          selectedCareers: [],
          linkCategoryOptions: ['','Video','Event','Course','Article','Report','Job Opportunity','Other']
        }

        this.retrieveData = this.retrieveData.bind(this)
        this.formChangeHandler = this.formChangeHandler.bind(this)
        this.renderTaggedItem = this.renderTaggedItem.bind(this)
        this.renderTags = this.renderTags.bind(this)
        this.addItem = this.addItem.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.sendResource = this.sendResource.bind(this)
        this.searchItems = this.searchItems.bind(this)
        this.searchItemClicked = this.searchItemClicked.bind(this)
        this.startWallowing = this.startWallowing.bind(this)
        this.formatStartDate = this.formatStartDate.bind(this)
        this.configureLink = this.configureLink.bind(this)
        this.prepareDate = this.prepareDate.bind(this)

    }

    componentDidMount() {

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in commonGoalDetails')

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
        console.log('t0 will update')
        this.retrieveData()
      } else if (this.props.selectedGroup !== prevProps.selectedGroup) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in goalDetails')

        const emailId = await AsyncStorage.getItem('email');
        const username = await AsyncStorage.getItem('username');
        const cuFirstName = await AsyncStorage.getItem('firstName');
        const cuLastName = await AsyncStorage.getItem('lastName');
        let activeOrg = await AsyncStorage.getItem('activeOrg');
        if (!activeOrg) {
          activeOrg = 'guidedcompass'
        }
        const orgFocus = await AsyncStorage.getItem('orgFocus');
        const roleName = await AsyncStorage.getItem('roleName');
        let pictureURL = await AsyncStorage.getItem('pictureURL');

        const selectedGoal = this.props.selectedGoal
        const modalIsOpen = this.props.modalIsOpen
        const showGoalDetails = this.props.showGoalDetails
        const showHelpOutWidget = this.props.showHelpOutWidget
        const profileData = this.props.profileData

        this.setState({ emailId, cuFirstName, cuLastName, activeOrg, orgFocus, roleName, username,
          pictureURL, selectedGoal, modalIsOpen, showGoalDetails,
          showHelpOutWidget, profileData
        })

        if (!this.props.profileData && this.props.selectedGoal) {
          Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: this.props.selectedGoal.creatorEmail } })
          .then((response) => {
            console.log('User details query 1 attempted', response.data);

            if (response.data.success) {
               console.log('successfully retrieved user details')

               let profileData = response.data.user
               this.setState({ profileData });

            } else {
             console.log('no user details data found', response.data.message)
            }

          }).catch((error) => {
             console.log('User details query did not work', error);
          });
        }

        if (selectedGoal && selectedGoal.orgCode) {
          // get orgContactEmail
          Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: selectedGoal.orgCode } })
          .then((response) => {
            console.log('Org info query attempted', response.data);

            if (response.data.success) {
              console.log('org info query worked')

              const goalOrgCode = selectedGoal.orgCode
              const goalOrgName = selectedGoal.orgName
              const goalOrgContactEmail = response.data.orgInfo.contactEmail
              this.setState({ goalOrgCode, goalOrgName, goalOrgContactEmail });

            } else {
              console.log('org info query did not work', response.data.message)
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

    formChangeHandler(eventName,eventValue) {
      console.log('formChangeHandler called', eventName, eventValue)

      if (eventName.includes("people|")) {
        const name = eventName.split("|")[1]
        const index = Number(eventName.split("|")[2])

        let selectedPeople = this.state.selectedPeople
        selectedPeople[index][name] = eventValue
        this.setState({ selectedPeople })
      } else if (eventName.includes("link|")) {
        const name = eventName.split("|")[1]
        const index = Number(eventName.split("|")[2])

        let selectedLinks = this.state.selectedLinks
        selectedLinks[index][name] = eventValue
        this.setState({ selectedLinks })
      } else if (eventName.includes("time|")) {
        const name = eventName.split("|")[1]
        const index = Number(eventName.split("|")[2])

        let selectedTimes = this.state.selectedTimes
        selectedTimes[index][name] = eventValue
        this.setState({ selectedTimes })
      } else if (eventName.includes("project|")) {
        const name = eventName.split("|")[1]
        const index = Number(eventName.split("|")[2])

        let selectedProjects = this.state.selectedProjects
        selectedProjects[index][name] = eventValue
        this.setState({ selectedProjects })
      } else if (eventName === 'searchCareers') {
        this.searchItems(eventValue, 'career')
      } else {
        this.setState({ [eventName]: eventValue })
      }
    }

    searchItems(searchString, type) {
      console.log('searchItems called', searchString, type)

      if (type.includes('career')) {
        if (!searchString || searchString === '') {
          this.setState({ searchCareers: searchString, searchIsAnimatingCareers: false, careerOptions: null })
        } else {

          let searchIsAnimatingCareers = true

          this.setState({ searchCareers: searchString, searchIsAnimatingCareers })

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

                    self.setState({ careerOptions, searchIsAnimatingCareers: false })
                  }

                } else {
                  console.log('no career data found', response.data.message)
                  let careerOptions = []
                  self.setState({ careerOptions, searchIsAnimatingCareers: false })
                }

            }).catch((error) => {
                console.log('Career query did not work', error);

                let careerOptions = []
                self.setState({ careerOptions, searchIsAnimatingCareers: false })
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

    searchItemClicked(passedItem, type) {
      console.log('searchItemClicked called', passedItem, type)

      if (type.includes('career')) {

        let searchObject = passedItem
        let searchCareers = passedItem.name
        let careerOptions = null
        let unready = false

        this.setState({ searchObject, searchCareers, careerOptions, unready })

      }
    }

    renderTaggedItem(item, type, answer) {
      console.log('renderTaggedItem called', item, type, answer)

      let defaultProfileItemIcon = projectsIconDark
      if (type === 'project') {
        defaultProfileItemIcon = projectsIconDark
      } else if (type === 'career') {
        defaultProfileItemIcon = careerMatchesIconDark
      } else if (type === 'competency') {
        defaultProfileItemIcon = educationIcon
      } else if (type === 'work') {
        defaultProfileItemIcon = opportunitiesIconDark
      }

      let itemObject = item.aItem
      if (answer === 'b') {
        itemObject = item.bItem
      }

      if (type === 'project') {

        return (
          <View key="taggedProjectItem">
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { selectedProject: itemObject })}>
              {(answer === 'a') ? (
                <View style={[styles.rowDirection]}>
                  <View style={[styles.calcColumn140]}>
                    <Text style={[styles.headingText5,styles.rightText]}>A: {item.aName}</Text>
                  </View>
                  <View style={[styles.width80]}>
                    {(item.aValue) && (
                      <Text style={[styles.headingText5,styles.boldText,styles.rightText,styles.ctaColor]}>${item.aValue}</Text>
                    )}
                  </View>
                </View>
              ) : (
                <View style={[styles.rowDirection]}>
                  <View style={[styles.width80]}>
                    {(item.bValue) ? (
                      <Text style={[styles.headingText5,styles.boldText,styles.ctaColor]}>${item.bValue}</Text>
                    ) : (
                      <View style={[styles.square30]} />
                    )}
                  </View>
                  <View style={[styles.calcColumn140]}>
                    <Text style={[styles.headingText5,styles.rightText]}>B: {item.bName}</Text>
                  </View>
                </View>
              )}
            </TouchableOpacity>

            <View style={[styles.row5]}>
              <View style={[styles.bottomPadding]}>
                <View style={[styles.ctaBorder]}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { selectedProject: itemObject })} style={(answer === 'a') ? [styles.padding20] : [styles.padding20]}>
                    {(answer === 'a') ? (
                      <View style={[styles.padding20,styles.rowDirection]}>
                        <View style={[styles.width60]}>
                          <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} style={[styles.square50,styles.contain]} />
                        </View>
                        <View style={[styles.calcColumn140]}>
                          <Text style={[styles.standardText]}>{itemObject.name}</Text>
                          <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{itemObject.category} | {itemObject.hours} Hours</Text>
                        </View>
                      </View>
                    ) : (
                      <View style={[styles.padding20,styles.rowDirection]}>
                        <View style={[styles.calcColumn140,styles.rightPadding]}>
                          <Text style={[styles.standardText,styles.rightText]}>{itemObject.name}</Text>
                          <Text style={[styles.descriptionText3,styles.descriptionTextColor,styles.rightText]}>{itemObject.category} | {itemObject.hours} Hours</Text>
                        </View>
                        <View style={[styles.width60]}>
                          <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} style={[styles.square50,styles.contain]} />
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )
      } else if (type === 'work') {
        return (
          <View key="taggedWorkItem">
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: itemObject })} style={[styles.rowDirection,styles.padding20]}>
              <View style={[styles.calcColumn140]}>
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View style={[styles.width80]}>
                {(answer === 'a') ? (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.aValue}</Text>
                ) : (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.bValue}</Text>
                )}
              </View>
            </TouchableOpacity>

            <View style={[styles.row5]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: itemObject })}>
                  <View style={[styles.padding20,styles.rowDirection]}>
                    <View style={[styles.width50]}>
                      <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} style={[styles.square40,styles.contain]} />
                    </View>
                    <View style={[styles.calcColumn110]}>
                      {(itemObject.title) ? (
                        <Text>{itemObject.title}</Text>
                      ) : (
                        <Text>{itemObject.name}</Text>
                      )}

                      {(itemObject.employerName) && (
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{itemObject.employerName}</Text>
                      )}

                    </View>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (type === 'career') {
        return (
          <View key="taggedCareerItem">
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerSelected: itemObject })} style={[styles.rowDirection,styles.padding20]}>
              <View style={[styles.calcColumn140]}>
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View style={[styles.width80]}>
                {(answer === 'a') ? (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.aValue}</Text>
                ) : (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.bValue}</Text>
                )}
              </View>

            </TouchableOpacity>

            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerSelected: itemObject })}>
                  <View style={[styles.padding20,styles.rowDirection]}>
                    <View style={[styles.width60]}>
                      <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} style={[styles.square50,styles.contain]} />
                    </View>
                    <View style={[styles.calcColumn120]}>
                      <Text>{itemObject.name}</Text>
                      <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{itemObject.jobFamily}</Text>

                      {(itemObject.marketData) && (
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}> | ${Number(itemObject.marketData.pay).toLocaleString()} avg pay</Text>
                      )}
                    </View>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (type === 'competency') {
        return (
          <View key="taggedCompetencyItem">
            <View style={[styles.bottomPadding,styles.rowDirection]}>
              <View style={[styles.calcColumn140]}>
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View style={[styles.width80]}>
                {(answer === 'a') ? (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.aValue}</Text>
                ) : (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.bValue}</Text>
                )}
              </View>
            </View>

            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <View style={[styles.padding20,styles.rowDirection]}>
                  <View style={[styles.width60]}>
                    <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} style={[styles.square50,styles.contain]} />
                  </View>
                  <View style={[styles.calcColumn140]}>
                    <Text>{itemObject.name}</Text>
                    <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{itemObject.category}</Text>

                    {(itemObject.description) && (
                      <View>

                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{itemObject.description}</Text>
                      </View>
                    )}
                  </View>
                </View>
              </View>
            </View>
          </View>
        )

      }
    }

    renderTags(passedArray, type, editMode, inModal) {
      // console.log('renderTags  called', passedArray, type, editMode)

      if (passedArray && passedArray.length > 0) {
        let backgroundColorClass = ''
        if (type === 'careers' || type === 'functions' || type === 'industries') {
          backgroundColorClass = [styles.primaryBackgroundLight]
        } else if (type === 'opportunities') {
          backgroundColorClass = [styles.secondaryBackgroundLight]
        } else if (type === 'competencies') {
          backgroundColorClass = [styles.tertiaryBackgroundLight]
        } else if (type === 'hours') {
          backgroundColorClass = [styles.quaternaryBackgroundLight]
        } else if (type === 'payRanges') {
          backgroundColorClass = [styles.quinaryBackgroundLight]
        } else if (type === 'schools') {
          backgroundColorClass = [styles.senaryBackgroundLight]
        } else if (type === 'majors') {
          backgroundColorClass = [styles.septaryBackgroundLight]
        }

        return (
          <View key={type + "|0"} style={(inModal) && [styles.centerText]}>
            <View style={(inModal) ? [styles.centerText,styles.rowDirection,styles.flexWrap] : [styles.topMargin,styles.rowDirection,styles.flexWrap]}>
              {passedArray.map((value, optionIndex) =>
                <View key={type + "|" + optionIndex} style={(inModal) ? [styles.centerText] : []}>
                  {(optionIndex < 3) && (
                    <View style={[styles.rowDirection]}>
                      {(editMode) && (
                        <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                          <TouchableOpacity onPress={() => this.removeItem(type, optionIndex)}>
                            <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                          </TouchableOpacity>
                        </View>
                      )}
                      <View style={(inModal) ? [styles.rightPadding5,styles.centerText] : [styles.rightPadding5]}>
                        <View style={[styles.halfSpacer]} />
                        <View style={[styles.roundedCorners,styles.row7,styles.horizontalPadding20, backgroundColorClass]}>
                          {(typeof value === 'object') ? (
                            <View>
                              {(value.title) && (
                                <Text style={[styles.descriptionText2]}>{value.title}</Text>
                              )}
                              {(value.name) && (
                                <Text style={[styles.descriptionText2]}>{value.name}</Text>
                              )}
                            </View>
                          ) : (
                            <Text style={[styles.descriptionText2]}>{value}</Text>
                          )}
                        </View>
                        <View style={[styles.halfSpacer]} />
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        )
      }
    }

    addItem(type) {
      console.log('addItem called', type)

      if (type === 'career') {
        if (this.state.selectedCareers && this.state.selectedCareers.includes(this.state.searchCareers)) {
          this.setState({ errorMessage: 'You have already added this career path' })
        } else {

          const searchCareers = ''
          const searchObject = null
          const unready = true

          let selectedCareers = this.state.selectedCareers
          selectedCareers.unshift(this.state.searchCareers)

          // let selectedCareerDetails = this.state.selectedCareerDetails
          // selectedCareerDetails.unshift(this.state.searchObject)

          // const selectedCareer = this.state.searchString
          this.setState({ searchCareers, searchObject, unready, selectedCareers, errorMessage: null })

        }
      } else if (type === 'entity') {
        let selectedPeople = this.state.selectedPeople
        selectedPeople.push({ firstName: '', lastName: '', email: '', relationship: '', reason: '' })
        this.setState({ selectedPeople })
      } else if (type === 'link') {
        let selectedLinks = this.state.selectedLinks
        selectedLinks.push({ category: '', url: '' })
        this.setState({ selectedLinks })
      } else if (type === 'time') {
        let selectedTimes = this.state.selectedTimes
        selectedTimes.push({ time: '' })
        this.setState({ selectedTimes })
      } else if (type === 'project') {
        let selectedProjects = this.state.selectedProjects
        selectedProjects.push({ name: '', description: '' })
        this.setState({ selectedProjects })

      }
    }

    removeItem(type, index) {
      console.log('removeItem called', type, index)

      if (type === 'entity') {
        let selectedPeople = this.state.selectedPeople
        selectedPeople.splice(index,1)
        this.setState({ selectedPeople })
      } else if (type === 'link') {
        let selectedLinks = this.state.selectedLinks
        selectedLinks.splice(index,1)
        this.setState({ selectedLinks })
      } else if (type === 'time') {
        let selectedTimes = this.state.selectedTimes
        selectedTimes.splice(index,1)
        this.setState({ selectedTimes })
      } else if (type === 'project') {
        let selectedProjects = this.state.selectedProjects
        selectedProjects.splice(index,1)
        this.setState({ selectedProjects })
      } else if (type === 'careers') {
        let selectedCareers = this.state.selectedCareers
        selectedCareers.splice(index,1)
        this.setState({ selectedCareers })
      }
    }

    closeModal() {
      console.log('closeModal called')

      if (this.state.intervalId) {
        clearInterval(this.state.intervalId)
      }

      this.setState({ modalIsOpen: false, selectedGoal: null, showGoalDetails: false, showHelpOutWidget: false, wallowing: false, intervalId: null });
      this.props.closeModal()

    }

    sendResource() {
      console.log('sendResource called')

      this.setState({ isSaving: true, errorMessage: null, successMessage: null })

      if (!this.state.message || this.state.message === '') {
        this.setState({ isSaving: false, errorMessage: 'Please add an accompanying message'})
      } else if (!this.state.cuFirstName || this.state.cuFirstName === '') {
        this.setState({ isSaving: false, errorMessage: 'Please add your first name'})
      } else if (!this.state.cuLastName || this.state.cuLastName === '') {
        this.setState({ isSaving: false, errorMessage: 'Please add your last name'})
      } else if (!this.state.emailId || this.state.emailId === '') {
        this.setState({ isSaving: false, errorMessage: 'Please add your email'})
      } else if (!this.state.emailId.includes('@')) {
        this.setState({ isSaving: false, errorMessage: 'Please add a valid email for your email'})
      } else {
        let selectedPeople = null
        if (this.state.selectedPeople && this.state.selectedPeople.length > 0) {
          selectedPeople = []
          for (let i = 1; i <= this.state.selectedPeople.length; i++) {
            if (this.state.selectedPeople[i - 1].firstName === '') {
              return this.setState({ isSaving: false, errorMessage: 'Please add a first name for each person you recommend'})
            } else if (this.state.selectedPeople[i - 1].lastName === '') {
              return this.setState({ isSaving: false, errorMessage: 'Please add a last name for each person you recommend'})
            } else if (this.state.selectedPeople[i - 1].email === '') {
              return this.setState({ isSaving: false, errorMessage: 'Please add an email for each person you recommend'})
            } else if (!this.state.selectedPeople[i - 1].email.includes('@')) {
              return this.setState({ isSaving: false, errorMessage: 'Please add a valid email for each person you recommend'})
            } else if (this.state.selectedPeople[i - 1].relationship === '') {
              return this.setState({ isSaving: false, errorMessage: 'Please add your relationship for each person you recommend'})
            } else if (this.state.selectedPeople[i - 1].reason === '') {
              return this.setState({ isSaving: false, errorMessage: 'Please add a reason for each person you recommend'})
            } else {
              selectedPeople.push(this.state.selectedPeople[i - 1])
            }
          }
        }

        let selectedLinks = null
        if (this.state.selectedLinks && this.state.selectedLinks.length > 0) {
          selectedLinks = []
          for (let i = 1; i <= this.state.selectedLinks.length; i++) {
            if (this.state.selectedLinks[i - 1].category === '') {
              return this.setState({ isSaving: false, errorMessage: 'Please add a category to each of your suggested links'})
            } else if (this.state.selectedLinks[i - 1].url === '') {
              return this.setState({ isSaving: false, errorMessage: 'Please add a link to each of your suggested links'})
            } else {
              selectedLinks.push(this.state.selectedLinks[i - 1])
            }
          }
        }

        let selectedTimes = null
        if (this.state.selectedTimes && this.state.selectedTimes.length > 0) {
          selectedTimes = []
          for (let i = 1; i <= this.state.selectedTimes.length; i++) {
            if (this.state.selectedTimes[i - 1].time === '') {
              return this.setState({ isSaving: false, errorMessage: 'Please select a time for each of your suggested times'})
            } else {
              selectedTimes.push(this.state.selectedTimes[i - 1])
            }
          }
        }

        let selectedProjects = null
        if (this.state.selectedProjects && this.state.selectedProjects.length > 0) {
          selectedProjects = []
          for (let i = 1; i <= this.state.selectedProjects.length; i++) {
            if (this.state.selectedProjects[i - 1].name === '') {
              return this.setState({ isSaving: false, errorMessage: 'Please add a name to each of your suggested projects'})
            } else if (this.state.selectedProjects[i - 1].description === '') {
              return this.setState({ isSaving: false, errorMessage: 'Please add a description to each of your suggested projects'})
            } else {
              selectedProjects.push(this.state.selectedProjects[i - 1])
            }
          }
        }

        let selectedCareers = null
        if (this.state.selectedCareers && this.state.selectedCareers.length > 0) {
          selectedCareers = this.state.selectedCareers
        }

        const senderPictureURL = this.state.pictureURL
        const senderFirstName = this.state.cuFirstName
        const senderLastName = this.state.cuLastName
        const senderEmail = this.state.emailId

        const recipientPictureURL = this.state.profileData.pictureURL
        const recipientFirstName = this.state.profileData.firstName
        const recipientLastName = this.state.profileData.lastName
        const recipientEmail = this.state.profileData.email

        const goalId = this.state.selectedGoal._id
        const goalTitle = this.state.selectedGoal.title
        const message = this.state.message

        const orgCode = this.state.goalOrgCode
        const orgName = this.state.goalOrgName
        const orgContactEmail = this.state.goalOrgContactEmail

        const createdAt = new Date()
        const updatedAt = new Date()

        // save and send
        Axios.post('https://www.guidedcompass.com/api/suggestions', {
          senderPictureURL, senderFirstName, senderLastName, senderEmail,
          recipientPictureURL, recipientFirstName, recipientLastName, recipientEmail,
          goalId, goalTitle, message,
          selectedPeople, selectedLinks, selectedTimes, selectedProjects, selectedCareers,
          createdAt, updatedAt
        })
        .then((response) => {
          console.log('attempting to save addition to suggestion')
          if (response.data.success) {
            console.log('saved suggestion', response.data)

            this.setState({successMessage: response.data.message, isSaving: false, message: '',
              selectedPeople: [], selectedLinks: [], selectedTimes: [], selectedProjects: [], selectedCareers: [],
              showConfirmation: true
            })

            // this.closeModal()
            window.scrollTo(0, 0)

          } else {
            console.log('did not save successfully')
            this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
          }
        }).catch((error) => {
            console.log('save did not work', error);
            this.setState({ errorMessage: 'there was an error saving suggestion', isSaving: false})
        });
      }
    }

    startWallowing() {
      console.log('startWallowing called')
      const self = this
      const intervalId = window.setInterval(function(){
        /// call your function here
        console.log('we wallowing')
        if (self.state.wallow) {
          self.setState({ wallowing: true, wallow: false, intervalId })
        } else {
          self.setState({ wallowing: true, wallow: true, intervalId })
        }
      }, 800);
    }

    stopWallowing() {
      console.log('stopWallowing called')

      clearInterval(this.state.intervalId)
      this.setState({ wallowing: false, intervalId: null })

    }

    formatStartDate(startDate) {
      console.log('formatStartDate called', startDate)

      // is string
      startDate = startDate.substring(5,7) + '/' + startDate.substring(8,10) + '/' + startDate.substring(0,4)
      return startDate
    }

    configureLink(goal) {
      console.log('configureLink')

      if (window.location.pathname.includes('/organizations')) {
        return '/organizations/' + this.state.activeOrg + '/members/' + goal.creatorUsername
      } else if (window.location.pathname.includes('/advisor')) {
        return '/advisor/members/' + goal.creatorUsername
      } else if (window.location.pathname.startsWith('/goals') || window.location.pathname.includes('/profile')) {
        return '/' + goal.creatorUsername + '/profile'
      }
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

    render() {

      return (
        <View>
          {(this.state.selectedGoal) && (
            <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
             <ScrollView key="showShareButtons" style={[styles.flex1]}>
                {(this.state.showGoalDetails) && (
                  <View style={[styles.flex1,styles.padding20]}>
                     <Text style={[styles.headingText2,styles.centerText]}>{this.state.selectedGoal.title}</Text>

                     {(this.state.selectedGoal.goalType) && (
                       <Text style={[styles.descriptionText1,styles.centerText,styles.topMargin]}>{this.state.selectedGoal.goalType.describe} Goal by <Text style={[styles.ctaColor,styles.boldText]} onPress={() => this.props.navigation.navigate('Profile', { username: this.state.selectedGoal.creatorUsername })}>{this.state.selectedGoal.creatorFirstName} {this.state.selectedGoal.creatorLastName}</Text></Text>
                     )}

                     {(this.state.selectedGoal.startDate) ? (
                       <Text style={[styles.descriptionText2,styles.centerText,styles.topMargin]}>{this.formatStartDate(this.state.selectedGoal.startDate)} - {convertDateToString(new Date(this.state.selectedGoal.deadline),"date-2")}</Text>
                     ) : (
                       <Text style={[styles.descriptionText2,styles.centerText,styles.topMargin]}>Deadline: {convertDateToString(new Date(this.state.selectedGoal.deadline),"date-2")}</Text>
                     )}

                     {(this.state.selectedGoal.description) && (
                       <Text style={[styles.topMargin20,styles.centerText]}>{this.state.selectedGoal.description}</Text>
                     )}

                     {(this.state.selectedGoal.goalType && this.state.selectedGoal.goalType.name === 'Alternatives') && (
                       <View>
                         {(this.state.selectedGoal.pollQuestion) && (
                           <Text style={[styles.headingText4,styles.centerText,styles.topMargin40]}>{this.state.selectedGoal.pollQuestion}</Text>
                         )}

                         <View style={[styles.topMargin40,styles.rowDirection]}>
                           <View style={[styles.flex45]}>

                             {(this.state.selectedGoal.aItem) && (
                               <View>
                                 <View>
                                   {(this.state.selectedGoal.comparisonType === 'Projects') && (
                                     <View>
                                       {this.renderTaggedItem(this.state.selectedGoal, 'project', 'a')}
                                     </View>
                                   )}
                                   {(this.state.selectedGoal.comparisonType === 'Careers') && (
                                     <View>
                                       {this.renderTaggedItem(this.state.selectedGoal, 'career','a')}
                                     </View>
                                   )}
                                   {(this.state.selectedGoal.comparisonType === 'Competencies') && (
                                     <View>
                                       {this.renderTaggedItem(this.state.selectedGoal, 'competency','a')}
                                     </View>
                                   )}
                                   {(this.state.selectedGoal.comparisonType === 'Jobs') && (
                                     <View>
                                       {this.renderTaggedItem(this.state.selectedGoal, 'work','a')}
                                     </View>
                                   )}
                                 </View>
                               </View>
                             )}

                             {(this.state.selectedGoal.aLinks && this.state.selectedGoal.aLinks.length > 0) && (
                               <View>
                                 <Text style={[styles.topMargin]}>Relevant Links</Text>
                                 {this.state.selectedGoal.aLinks.map((item, optionIndex) =>
                                   <View>
                                     <Text style={[styles.ctaColor,styles.boldText]} onPress={() => Linking.openURL(item)}>{optionIndex + 1}. {item}</Text>
                                   </View>
                                 )}
                               </View>
                             )}

                             <Text style={[styles.topMargin20]}>{this.state.selectedGoal.aCase}</Text>

                           </View>
                           <View style={[styles.flex10]}>
                             <Text style={[styles.headingText2,styles.centerText]}>VS</Text>
                           </View>
                           <View style={[styles.flex45]}>
                             {(this.state.selectedGoal.bItem) && (
                               <View>
                                 <View>
                                   {(this.state.selectedGoal.comparisonType === 'Projects') && (
                                     <View>
                                       {this.renderTaggedItem(this.state.selectedGoal, 'project', 'b')}
                                     </View>
                                   )}
                                   {(this.state.selectedGoal.comparisonType === 'Careers') && (
                                     <View>
                                       {this.renderTaggedItem(this.state.selectedGoal, 'career','b')}
                                     </View>
                                   )}
                                   {(this.state.selectedGoal.comparisonType === 'Competencies') && (
                                     <View>
                                       {this.renderTaggedItem(this.state.selectedGoal, 'competency','b')}
                                     </View>
                                   )}
                                   {(this.state.selectedGoal.comparisonType === 'Jobs') && (
                                     <View>
                                       {this.renderTaggedItem(this.state.selectedGoal, 'work','b')}
                                     </View>
                                   )}
                                 </View>
                               </View>
                             )}

                             {(this.state.selectedGoal.bLinks && this.state.selectedGoal.bLinks.length > 0) && (
                               <View>
                                 <Text style={[styles.topMargin,styles.rightText]}>Relevant Links</Text>
                                 {this.state.selectedGoal.bLinks.map((item, optionIndex) =>
                                   <View style={[styles.rightText]}>
                                     <Text style={[styles.ctaColor,styles.boldText]} onPress={() => Linking.openURL(item)}>{optionIndex + 1}. {item}</Text>
                                   </View>
                                 )}
                               </View>
                             )}

                             <Text style={[styles.topMargin20,styles.rightText]}>{this.state.selectedGoal.bCase}</Text>
                           </View>

                         </View>
                       </View>
                     )}

                     <View style={[styles.centerText,styles.rowDirection,styles.flexWrap,styles.topMargin20]}>
                       {this.renderTags(this.state.selectedGoal.selectedCareers, 'careers', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedOpportunities, 'opportunities', null, true)}
                       {this.renderTags(this.state.selectedGoal.competencies, 'competencies', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedFunctions, 'functions', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedIndustries, 'industries', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedHours, 'hours', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedPayRanges, 'payRanges', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedSchools, 'schools', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedMajors, 'majors', null, true)}
                     </View>

                     <View style={[styles.rowDirection,styles.flexWrap]}>
                       {(this.state.selectedGoal.intensity) && (
                         <View style={[styles.topMargin20,styles.flex33,styles.centerText]}>
                           <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.row10]}>Intensity</Text>
                           <Text style={[styles.standardText]}>{this.state.selectedGoal.intensity}</Text>
                         </View>
                       )}

                       {(this.state.selectedGoal.budget) && (
                         <View style={[styles.topMargin20,styles.flex33,styles.centerText]}>
                           <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.row10]}>Budget</Text>
                           <Text style={[styles.standardText]}>{this.state.selectedGoal.budget}</Text>
                         </View>
                       )}

                       {(this.state.selectedGoal.status) && (
                         <View style={[styles.topMargin20,styles.flex33,styles.centerText]}>
                           <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.row10]}>Status</Text>
                           <Text style={[styles.standardText]}>{this.state.selectedGoal.status}</Text>
                         </View>
                       )}
                     </View>

                     {(this.state.selectedGoal.successDefined) && (
                       <View style={[styles.topMargin20]}>
                         <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.row10]}>Success Defined</Text>
                         <Text style={[styles.standardText]}>{this.state.selectedGoal.successDefined}</Text>
                       </View>
                     )}

                     {(this.state.selectedGoal.strategies && this.state.selectedGoal.strategies.length > 0) && (
                       <View style={[styles.standardBorder,styles.padding20,styles.topMargin20]}>
                        <Text style={[styles.headingText6]}>Strategies & Tactics</Text>
                        {this.state.selectedGoal.strategies.map((item, optionIndex) =>
                          <View key={ item.name} style={[styles.row10]}>
                            <Text style={[styles.descriptionText1]}>Strategy #{optionIndex + 1}: {item.name}</Text>
                            {(item.tactics && item.tactics.length > 0) && (
                              <View style={[styles.row10,styles.leftPadding40]}>
                                {item.tactics.map((item2, optionIndex2) =>
                                  <View key={item2}>
                                    <Text style={[styles.descriptionText3]}>Tactic #{optionIndex2 + 1}: {item2}</Text>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        )}

                       </View>
                     )}

                     {(this.state.selectedGoal.progress && this.state.selectedGoal.progress.length > 0) && (
                       <View style={[styles.standardBorder,styles.padding20,styles.topMargin20]}>
                        <Text style={[styles.headingText6]}>Progress</Text>
                        {this.state.selectedGoal.progress.map((item, optionIndex) =>
                          <View key={item.value} style={[styles.row10,styles.rowDirection]}>
                            <View style={[styles.width80]}>
                              <Text style={[styles.descriptionText1]}>{item.date}</Text>
                            </View>
                            <View style={[styles.calcColumn140,styles.leftPadding]}>
                              <Text style={[styles.descriptionText1]}>{item.value}</Text>
                            </View>
                          </View>
                        )}

                       </View>
                     )}

                     <View style={[styles.topMargin40,styles.centerText,styles.rowDirection]}>
                        <View style={[styles.flex50,styles.rightPadding]}>
                          <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.setState({ showGoalDetails: false, showHelpOutWidget: true })}><Text style={[styles.standardText,styles.whiteColor]}>Help Out</Text></TouchableOpacity>
                        </View>
                        <View style={[styles.flex50,styles.leftPadding]}>
                          <TouchableOpacity style={[styles.btnPrimary, styles.ctaBorder, styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Cancel</Text></TouchableOpacity>
                        </View>
                     </View>
                  </View>
                )}

                {(this.state.showHelpOutWidget) && (
                  <View key="showHelpOutWidget" style={[styles.flex1,styles.padding20]}>

                    {(this.state.showConfirmation) ? (
                      <View style={[styles.flexCenter,styles.flex1]}>
                        <View>
                          <View style={[styles.superSpacer]} />

                          <View style={[styles.flexCenter]}>
                            <Image source={{ uri: celebrationIcon}} style={(this.state.wallow) ? [styles.square100,styles.contain,{ transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative', transform: 'translate(50%)' }] : [styles.square100,styles.contain,{ transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative', transform: 'translate(10%)' }]}/>
                          </View>

                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />

                          <View style={[styles.horizontalPadding30]}>
                            <Text style={[styles.headingText1,styles.centerText,styles.ctaColor,styles.boldText]}>You're Awesome!</Text>
                            <Text style={[styles.centerText,styles.boldText,styles.row20,styles.descriptionTextColor]}>Thanks for helping {this.state.profileData.firstName} out! We sent an email to both of you with details and your suggestion will be pinned to their goal profile for future reference.</Text>
                          </View>

                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />

                          <View style={[styles.centerText]}>
                            {(this.state.wallowing) ? (
                              <TouchableOpacity style={[styles.btnPrimary,styles.rightMargin,styles.errorBackgroundColor,styles.flexCenter]} onPress={() => this.stopWallowing()}><Text style={[styles.standardText,styles.whiteColor]}>Stop this Nonsense</Text></TouchableOpacity>
                            ) : (
                              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter,styles.rightMargin]} onPress={() => this.startWallowing()}><Text style={[styles.standardText,styles.whiteColor]}>Wallow in Pride</Text></TouchableOpacity>
                            )}

                            <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.leftMargin,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Help Others</Text></TouchableOpacity>
                          </View>

                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />

                        </View>
                      </View>
                    ) : (
                      <View>
                        {(this.state.profileData) && (
                          <View>
                            <Text style={[styles.headingText2,styles.centerText]}>Help {this.state.profileData.firstName} {this.state.profileData.lastName} Achieve Their Goal</Text>
                            <Text style={[styles.headingText5,styles.topMargin,styles.descriptionTextColor,styles.centerText]}>{this.state.selectedGoal.title} by {convertDateToString(new Date(this.state.selectedGoal.deadline),"datetime-2")}</Text>
                            <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                            <Text style={[styles.headingText5,styles.row20]}>Click an icon to provide a resource <Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                            <View style={[styles.row10,styles.rowDirection]}>
                              <View>
                                <TouchableOpacity onPress={(this.state.showPeople) ? () => this.setState({ showPeople: false }) : () => this.setState({ showPeople: true })}>
                                  <Image source={(this.state.showPeople) ? { uri: addPeopleIconBlue} : { uri: addPeopleIconDark}} style={[styles.square20,styles.contain]} />
                                </TouchableOpacity>
                              </View>
                              {/*
                              <View style={[styles.leftPadding20]}>
                                <TouchableOpacity onPress={(this.state.showLink) ? () => this.setState({ showLink: false }) : () => this.setState({ showLink: true })}>
                                  <Image source={(this.state.showLink) ? { uri: linkIconBlue} : { uri: linkIcon}} style={[styles.square20,styles.contain]}/>
                                </TouchableOpacity>
                              </View>*/}
                              <View style={[styles.leftPadding20]}>
                                <TouchableOpacity onPress={(this.state.showProject) ? () => this.setState({ showProject: false }) : () => this.setState({ showProject: true })}>
                                  <Image source={(this.state.showProject) ? { uri: projectsIconBlue} : { uri: projectsIconDark}} style={[styles.square20,styles.contain]} />
                                </TouchableOpacity>
                              </View>
                              <View style={[styles.leftPadding20]}>
                                <TouchableOpacity onPress={(this.state.showPaths) ? () => this.setState({ showPaths: false }) : () => this.setState({ showPaths: true })} style={[styles.rowDirection]}>
                                  <Image source={(this.state.showPaths) ? { uri: pathsIconBlue} : { uri: pathsIconDark}} style={[styles.square20,styles.contain]} />
                                  <Image source={(this.state.showPaths) ? { uri: tagIconBlue} : { uri: tagIconDark}} style={[styles.square9,styles.rightMargin5]} />
                                </TouchableOpacity>
                              </View>
                            </View>

                            {(this.state.showPeople) && (
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View>
                                    <Text style={[styles.headingText5,styles.bottomMargin20]}>Suggest People Who Can Help</Text>
                                  </View>
                                  <View style={[styles.leftPadding]}>
                                    <TouchableOpacity onPress={() => this.addItem('entity')}>
                                      <View style={[styles.ctaBorder,styles.padding7,{ borderRadius: 14 }]}>
                                        <Image source={{ uri: addIcon}} style={[styles.square14,styles.contain]} />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                </View>

                                <View style={[styles.halfSpacer]} />

                                {(this.state.selectedPeople && this.state.selectedPeople.length > 0) ? (
                                  <View>
                                    {this.state.selectedPeople.map((item, optionIndex) =>
                                      <View key={item}>
                                        <View style={[styles.topMargin15,styles.rowDirection]}>
                                          <View>
                                            <Text style={[styles.headingText6]}>Contact #{optionIndex + 1}</Text>
                                          </View>
                                          <View style={[styles.leftPadding]}>
                                            <TouchableOpacity onPress={() => this.removeItem('entity', optionIndex)}>
                                              <View style={[styles.errorBorder,styles.padding7, { borderRadius: 12 }]}>
                                                <Image source={{ uri: closeIcon}} style={[styles.square10,styles.contain]} />
                                              </View>
                                            </TouchableOpacity>
                                          </View>
                                        </View>

                                        <View style={[styles.row10]}>
                                          <View>
                                            <Text style={[styles.row10]}>First Name</Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("people|firstName|" + optionIndex, text)}
                                              value={item.firstName}
                                              placeholder="(e.g., Jon)"
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                          <View>
                                            <Text style={[styles.row10]}>Last Name</Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("people|lastName|" + optionIndex, text)}
                                              value={item.lastName}
                                              placeholder="(e.g., Doe)"
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                        </View>
                                        <View style={[styles.row10]}>
                                          <View>
                                            <Text style={[styles.row10]}>Email</Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("people|email|" + optionIndex, text)}
                                              value={item.email}
                                              placeholder="(e.g., jondoe@gmail.com)"
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                          <View>
                                            <Text style={[styles.row10]}>Relationship</Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("people|relationship|" + optionIndex, text)}
                                              value={item.relationship}
                                              placeholder="What is your relationship with this person?"
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                        </View>
                                        <View style={[styles.row10]}>
                                          <Text style={[styles.row10]}>Why are you connecting {this.state.profileData.firstName} to this person?</Text>
                                          <TextInput
                                            style={styles.textInput}
                                            onChangeText={(text) => this.formChangeHandler("people|reason|" + optionIndex, text)}
                                            value={item.reason}
                                            placeholder="How can this peron help?"
                                            placeholderTextColor="grey"
                                            multiline={true}
                                            numberOfLines={4}
                                          />
                                        </View>

                                        <View style={[styles.horizontalLine]} />
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View>
                                   <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                   <View style={[styles.horizontalLine]} />
                                  </View>
                                )}

                              </View>
                            )}
                            {/*
                            {(this.state.showLink) && (
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn110]}>
                                    <Text style={[styles.headingText5,styles.bottomMargin20]}>Share a Link to a Video, Event, Course, Article, Report, or Job Opportunity</Text>
                                  </View>
                                  <View style={[styles.leftPadding,styles.width40]}>
                                    <TouchableOpacity onPress={() => this.addItem('link')}>
                                      <View style={[styles.ctaBorder,styles.padding7, { borderRadius: 15 }]}>
                                        <Image source={{ uri: addIcon}} style={[styles.square15,styles.contain]} />
                                      </View>
                                    </TouchableOpacity>
                                  </View>


                                </View>

                                <View style={[styles.halfSpacer]} />

                                {(this.state.selectedLinks && this.state.selectedLinks.length > 0) ? (
                                  <View>
                                    {this.state.selectedLinks.map((item, optionIndex) =>
                                      <View key={item}>

                                        <View style={[styles.topMargin15,styles.rowDirection]}>
                                          <View>
                                            <Text style={[styles.headingText6]}>Link Resource #{optionIndex + 1}</Text>
                                          </View>
                                          <View style={[styles.leftPadding]}>
                                            <TouchableOpacity onPress={() => this.removeItem('link', optionIndex)}>
                                              <View style={[styles.errorBorder,styles.padding7, { borderRadus: 12 }]}>
                                                <Image source={{ uri: closeIcon}} style={[styles.square10,styles.contain]}/>
                                              </View>
                                            </TouchableOpacity>
                                          </View>
                                        </View>

                                        <View style={[styles.bottomPadding]}>
                                          <View>
                                            <Text style={[styles.row10]}>Which type of resource is this?</Text>
                                            {(Platform.OS === 'ios') ? (
                                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Category', selectedIndex: null, selectedName: "link|category|" + optionIndex, selectedValue: item.category, selectedOptions: this.state.linkCategoryOptions, selectedSubKey: null })}>
                                                <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                                  <View style={[styles.calcColumn115]}>
                                                    <Text style={[styles.descriptionText1]}>{item.category}</Text>
                                                  </View>
                                                  <View style={[styles.width20,styles.topMargin5]}>
                                                    <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                                  </View>
                                                </View>
                                              </TouchableOpacity>
                                            ) : (
                                              <View style={[styles.standardBorder]}>
                                                <Picker
                                                  selectedValue={item.category}
                                                  onValueChange={(itemValue, itemIndex) =>
                                                    this.formChangeHandler("link|category|" + optionIndex,itemValue)
                                                  }>
                                                  {this.state.linkCategoryOptions.map(value => <Picker.Item label={value} value={value} />)}
                                                </Picker>
                                              </View>
                                            )}
                                          </View>
                                          <View>
                                            <Text style={[styles.row10]}>Paste the actual link below</Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("link|url|" + optionIndex, text)}
                                              value={item.url}
                                              placeholder="Http..."
                                              placeholderTextColor="grey"
                                            />
                                            {(item.url && !item.url.startsWith('http')) ? (
                                              <View style={[styles.row5]}>
                                                <Text style={[styles.errorColor,styles.boldText,styles.descriptionText2]}>The link must start with http</Text>
                                              </View>
                                            ) : (
                                              <View />
                                            )}
                                          </View>

                                          <View style={[styles.spacer]} />
                                        </View>

                                        <View style={[styles.horizontalLine]} />
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View>
                                   <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                   <View style={[styles.horizontalLine]} />
                                  </View>
                                )}
                              </View>
                            )}*/}

                            {(this.state.showProject) && (
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn110]}>
                                    <Text style={[styles.headingText5,styles.bottomMargin20]}>Suggest Projects to Work On</Text>
                                  </View>
                                  <View style={[styles.leftPadding,styles.width40]}>
                                    <TouchableOpacity onPress={() => this.addItem('project')}>
                                      <View style={[styles.ctaBorder,styles.padding7, { borderRadius: 15 }]}>
                                        <Image source={{ uri: addIcon}} style={[styles.square15,styles.contain]}/>
                                      </View>
                                    </TouchableOpacity>
                                  </View>


                                </View>

                                <View style={[styles.halfSpacer]} />

                                {(this.state.selectedProjects && this.state.selectedProjects.length > 0) ? (
                                  <View>
                                    {this.state.selectedProjects.map((item, optionIndex) =>
                                      <View key={item}>
                                        <View style={[styles.topMargin15,styles.rowDirection]}>
                                          <View>
                                            <Text style={[styles.headingText6]}>Suggested Project #{optionIndex + 1}</Text>
                                          </View>
                                          <View style={[styles.leftPadding]}>
                                            <TouchableOpacity onPress={() => this.removeItem('project', optionIndex)}>
                                              <View style={[styles.errorBorder,styles.padding7, { borderRadius: 12 }]}>
                                                <Image source={{ uri: closeIcon}} style={[styles.square10,styles.contain]}/>
                                              </View>
                                            </TouchableOpacity>
                                          </View>


                                        </View>

                                        <View style={[styles.row10]}>
                                          <Text style={[styles.row10]}>Name</Text>
                                          <TextInput
                                            style={styles.textInput}
                                            onChangeText={(text) => this.formChangeHandler("project|name|" + optionIndex, text)}
                                            value={item.name}
                                            placeholder="Name of project..."
                                            placeholderTextColor="grey"
                                          />
                                        </View>
                                        <View style={[styles.row10]}>
                                          <Text style={[styles.row10]}>Description</Text>
                                          <TextInput
                                            style={styles.textArea}
                                            onChangeText={(text) => this.formChangeHandler("project|description|" + optionIndex, text)}
                                            value={item.description}
                                            placeholder="Description of project..."
                                            placeholderTextColor="grey"
                                            multiline={true}
                                            numberOfLines={4}
                                          />
                                        </View>
                                        <View style={[styles.horizontalLine]} />
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View>
                                   <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                   <View style={[styles.horizontalLine]} />
                                  </View>
                                )}

                              </View>
                            )}

                            {(this.state.showPaths) && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.headingText5,styles.bottomMargin20]}>Suggest Career Paths</Text>
                                <View style={[styles.spacer]} />

                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn130]}>
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("searchCareers", text)}
                                      value={this.state.searchCareers}
                                      placeholder="Search over 1,100 career paths..."
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View style={[styles.width70,styles.leftPadding]}>
                                    <TouchableOpacity style={(this.state.unready) ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.unready} onPress={() => this.addItem('career')}><Text style={[styles.standardText,styles.whiteColor]}>Add</Text></TouchableOpacity>
                                  </View>

                                </View>

                                <View style={[styles.spacer]} />

                                {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                                {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.successMessage}</Text>}

                                {(this.state.searchIsAnimatingCareers) ? (
                                  <View style={[styles.flexCenter,styles.flex1]}>
                                    <View>
                                      <View style={[styles.superSpacer]} />

                                      <ActivityIndicator
                                         animating = {this.state.animating}
                                         color = '#87CEFA'
                                         size = "large"
                                         style={[styles.square80, styles.centerHorizontally]}/>

                                      <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                      <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Loading...</Text>

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
                                                <View style={[styles.rowDirection]}>
                                                  <View style={[styles.width40]}>
                                                    <View style={[styles.miniSpacer]} />
                                                    <Image source={{ uri: careerMatchesIconDark}} style={[styles.square22,styles.contain]} />
                                                  </View>
                                                  <View style={[styles.calcColumn100]}>
                                                    <Text style={[styles.standardText,styles.ctaColor]}>{value.name}</Text>
                                                  </View>
                                                </View>
                                              </TouchableOpacity>
                                            </View>
                                          )}
                                        </View>
                                      )}
                                    </View>

                                    <View>
                                      {this.renderTags(this.state.selectedCareers, 'careers', true)}

                                    </View>

                                    <View>
                                     <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                     <View style={[styles.horizontalLine]} />
                                    </View>
                                  </View>
                                )}
                              </View>
                            )}

                            <Text style={[styles.headingText5,styles.row20]}>Share an accompanying message <Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                            <TextInput
                              style={styles.textArea}
                              onChangeText={(text) => this.formChangeHandler("message", text)}
                              value={this.state.message}
                              placeholder="Add a message"
                              placeholderTextColor="grey"
                              multiline={true}
                              numberOfLines={4}
                            />

                            {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText1,styles.row5,styles.errorColor]}>{this.state.errorMessage}</Text>}
                            {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText1,styles.row5,styles.ctaColor]}>{this.state.successMessage}</Text>}

                            <View style={[styles.topPadding20,styles.rowDirection]}>
                              <View style={[styles.flex50,styles.rightPadding]}>
                                <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.sendResource()}><Text style={[styles.standardText,styles.whiteColor]}>Send</Text></TouchableOpacity>
                              </View>
                              <View style={[styles.flex50,styles.leftPadding]}>
                                <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Cancel</Text></TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        )}

                      </View>
                    )}

                   </View>
                )}
              </ScrollView>
            </Modal>
          )}
        </View>
      )
    }
}

export default GoalDetails
