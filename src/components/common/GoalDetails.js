import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch, Linking, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';

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
            <Link to={'/app/projects/' + itemObject._id} className="background-button standard-color full-width">
              {(answer === 'a') ? (
                <View>
                  <View className="calc-column-offset-80 heading-text-5 right-text">
                    <Text>A: {item.aName}</Text>
                  </View>
                  <View className="fixed-column-80 heading-text-5">
                    {(item.aValue) && (
                      <Text className="bold-text right-text cta-color">${item.aValue}</Text>
                    )}
                  </View>
                </View>
              ) : (
                <View>
                  <View className="fixed-column-80 heading-text-5">
                    {(item.bValue) ? (
                      <Text className="bold-text cta-color">${item.bValue}</Text>
                    ) : (
                      <View className="width-40 height-30" />
                    )}
                  </View>
                  <View className="calc-column-offset-80 heading-text-5">
                    <Text className="full-width right-text">B: {item.bName}</Text>
                  </View>
                </View>
              )}

              <View className="clear" />
            </Link>

            <View className="row-5">
              <View className="bottom-padding">
                <View className="cta-border">
                  <Link to={'/app/projects/' + itemObject._id} className={(answer === 'a') ? "background-button standard-color padding-20 full-width" : "background-button standard-color padding-20 full-width right-text"}>
                    {(answer === 'a') ? (
                      <View className="padding-20">
                        <View className="fixed-column-60">
                          <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} className="image-50-fit" />
                        </View>
                        <View className="calc-column-offset-60">
                          <Text>{itemObject.name}</Text>
                          <Text className="description-text-3 description-text-color">{itemObject.category} | {itemObject.hours} Hours</Text>
                        </View>
                        <View className="clear" />
                      </View>
                    ) : (
                      <View className="padding-20">
                        <View className="calc-column-offset-60 right-padding">
                          <Text>{itemObject.name}</Text>
                          <Text className="description-text-3 description-text-color">{itemObject.category} | {itemObject.hours} Hours</Text>
                        </View>
                        <View className="fixed-column-60">
                          <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} className="image-50-fit" />
                        </View>
                        <View className="clear" />
                      </View>
                    )}
                  </Link>
                </View>
              </View>
            </View>
          </View>
        )
      } else if (type === 'work') {
        return (
          <View key="taggedWorkItem">
            <Link to={'/app/opportunities/' + itemObject._id} className="background-button standard-color padding-20 full-width">
              <View className="calc-column-offset-80">
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View className="fixed-column-80">
                {(answer === 'a') ? (
                  <Text className="bold-text right-text cta-color">${item.aValue}</Text>
                ) : (
                  <Text className="bold-text right-text cta-color">${item.bValue}</Text>
                )}
              </View>
              <View className="clear" />
            </Link>

            <View className="row-5">
              <View className="cta-border">
                <Link to={'/app/opportunities/' + itemObject._id} className="background-button standard-color padding-20 full-width">
                  <View className="padding-20">
                    <View className="fixed-column-50">
                      <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} className="image-40-fit" />
                    </View>
                    <View className="calc-column-offset-50">
                      {(itemObject.title) ? (
                        <Text>{itemObject.title}</Text>
                      ) : (
                        <Text>{itemObject.name}</Text>
                      )}

                      {(itemObject.employerName) && (
                        <Text className="description-text-3 description-text-color">{itemObject.employerName}</Text>
                      )}

                    </View>
                    <View className="clear" />
                  </View>
                </Link>
              </View>
            </View>
          </View>
        )
      } else if (type === 'career') {
        return (
          <View key="taggedCareerItem">
            <Link to={'/app/careers/' + itemObject.name} className="background-button standard-color padding-20 full-width">
              <View className="calc-column-offset-80">
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View className="fixed-column-80">
                {(answer === 'a') ? (
                  <Text className="bold-text right-text cta-color">${item.aValue}</Text>
                ) : (
                  <Text className="bold-text right-text cta-color">${item.bValue}</Text>
                )}
              </View>
              <View className="clear" />
            </Link>

            <View className="bottom-padding">
              <View className="cta-border">
                <Link to={'/app/careers/' + itemObject.name} className="background-button standard-color padding-20 full-width">
                  <View className="padding-20">
                    <View className="fixed-column-60">
                      <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} className="image-50-fit" />
                    </View>
                    <View className="calc-column-offset-60">
                      <Text>{itemObject.name}</Text>
                      <Text className="description-text-3 description-text-color">{itemObject.jobFamily}</Text>

                      {(itemObject.marketData) && (
                        <Text className="description-text-3 description-text-color"> | ${Number(itemObject.marketData.pay).toLocaleString()} avg pay</Text>
                      )}
                    </View>
                    <View className="clear" />
                  </View>
                </Link>
              </View>
            </View>
          </View>
        )
      } else if (type === 'competency') {
        return (
          <View key="taggedCompetencyItem">
            <View className="bottom-padding">
              <View className="calc-column-offset-80">
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View className="fixed-column-80">
                {(answer === 'a') ? (
                  <Text className="bold-text right-text cta-color">${item.aValue}</Text>
                ) : (
                  <Text className="bold-text right-text cta-color">${item.bValue}</Text>
                )}
              </View>
              <View className="clear" />
            </View>

            <View className="bottom-padding">
              <View className="cta-border">
                <View className="standard-color padding-20 full-width">
                  <View>
                    <View className="fixed-column-60">
                      <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} className="image-50-fit" />
                    </View>
                    <View className="calc-column-offset-60">
                      <Text>{itemObject.name}</Text>
                      <Text className="description-text-3 description-text-color">{itemObject.category}</Text>

                      {(itemObject.description) && (
                        <View>
                          <View className="clear" />
                          <Text className="description-text-3 description-text-color">{itemObject.description}</Text>
                        </View>
                      )}
                    </View>
                    <View className="clear" />
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
          backgroundColorClass = 'primary-background-light'
        } else if (type === 'opportunities') {
          backgroundColorClass = 'secondary-background-light'
        } else if (type === 'competencies') {
          backgroundColorClass = 'tertiary-background-light'
        } else if (type === 'hours') {
          backgroundColorClass = 'quaternary-background-light'
        } else if (type === 'payRanges') {
          backgroundColorClass = 'quinary-background-light'
        } else if (type === 'schools') {
          backgroundColorClass = 'senary-background-light'
        } else if (type === 'majors') {
          backgroundColorClass = 'septary-background-light'
        }

        return (
          <View key={type + "|0"} className={(inModal) && "display-inline center-text"}>
            <View className={(inModal) ? "display-inline center-text" : "top-margin"}>
              {passedArray.map((value, optionIndex) =>
                <View key={type + "|" + optionIndex} className={(inModal) ? "display-inline center-text" : "float-left"}>
                  {(optionIndex < 3) && (
                    <View>
                      {(editMode) && (
                        <View className="close-button-container-1" >
                          <TouchableOpacity className="background-button" onPress={() => this.removeItem(type, optionIndex)}>
                            <Image source={{ uri: deniedIcon}} className="image-auto-20" />
                          </TouchableOpacity>
                        </View>
                      )}
                      <View className={(inModal) ? "display-inline right-padding-5 center-text" : "float-left right-padding-5"}>
                        <View className="half-spacer" />
                        <View className={"rounded-corners row-7 horizontal-padding-5 " + backgroundColorClass}>
                          {(typeof value === 'object') ? (
                            <View>
                              {(value.title) && (
                                <Text className="description-text-2">{value.title}</Text>
                              )}
                              {(value.name) && (
                                <Text className="description-text-2">{value.name}</Text>
                              )}
                            </View>
                          ) : (
                            <Text className="description-text-2">{value}</Text>
                          )}
                        </View>
                        <View className="half-spacer" />
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

    render() {

      return (
        <View>
          {(this.state.selectedGoal) && (
            <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
             <ScrollView key="showShareButtons" style={[styles.flex1]}>
                {(this.state.showGoalDetails) && (
                  <View className="full-width padding-20">
                     <Text className="heading-text-2 center-text">{this.state.selectedGoal.title}</Text>

                     {(this.state.selectedGoal.goalType) && (
                       <Text className="full-width center-text top-margin description-text-1">{this.state.selectedGoal.goalType.describe} Goal by <Link to={this.configureLink(this.state.selectedGoal)} target="_blank">{this.state.selectedGoal.creatorFirstName} {this.state.selectedGoal.creatorLastName}</Link></Text>
                     )}

                     {(this.state.selectedGoal.startDate) ? (
                       <Text className="full-width center-text top-margin description-text-2">{this.formatStartDate(this.state.selectedGoal.startDate)} - {convertDateToString(new Date(this.state.selectedGoal.deadline),"date-2")}</Text>
                     ) : (
                       <Text className="full-width center-text top-margin description-text-2">Deadline: {convertDateToString(new Date(this.state.selectedGoal.deadline),"date-2")}</Text>
                     )}

                     {(this.state.selectedGoal.description) && (
                       <Text className="top-margin-20 full-width center-text">{this.state.selectedGoal.description}</Text>
                     )}

                     {(this.state.selectedGoal.goalType && this.state.selectedGoal.goalType.name === 'Alternatives') && (
                       <View>
                         {(this.state.selectedGoal.pollQuestion) && (
                           <Text className="heading-text-4 top-margin-40 full-width center-text">{this.state.selectedGoal.pollQuestion}</Text>
                         )}

                         <View className="top-margin-40">
                           <View className="calc-column-offset-30-of-50">

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
                                 <Text className="top-margin">Relevant Links</Text>
                                 {this.state.selectedGoal.aLinks.map((item, optionIndex) =>
                                   <View>
                                     <Text style={[styles.ctaColor,styles.boldText]} onPress={() => Linking.openURL(item)}>{optionIndex + 1}. {item}</Text>
                                   </View>
                                 )}
                               </View>
                             )}

                             <Text className="top-margin-20">{this.state.selectedGoal.aCase}</Text>

                           </View>
                           <View className="fixed-column-60">
                             <Text className="full-width center-text heading-text-2">VS</Text>
                           </View>
                           <View className="calc-column-offset-30-of-50">
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
                                 <Text className="top-margin full-width right-text">Relevant Links</Text>
                                 {this.state.selectedGoal.bLinks.map((item, optionIndex) =>
                                   <View className="full-width right-text">
                                     <Text style={[styles.ctaColor,styles.boldText]} onPress={() => Linking.openURL(item)}>{optionIndex + 1}. {item}</Text>
                                   </View>
                                 )}
                               </View>
                             )}

                             <Text className="top-margin-20 full-width right-text">{this.state.selectedGoal.bCase}</Text>
                           </View>
                           <View className="clear" />
                         </View>
                       </View>
                     )}

                     <View className="full-width center-text display-inline top-margin-20">
                       {this.renderTags(this.state.selectedGoal.selectedCareers, 'careers', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedOpportunities, 'opportunities', null, true)}
                       {this.renderTags(this.state.selectedGoal.competencies, 'competencies', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedFunctions, 'functions', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedIndustries, 'industries', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedHours, 'hours', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedPayRanges, 'payRanges', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedSchools, 'schools', null, true)}
                       {this.renderTags(this.state.selectedGoal.selectedMajors, 'majors', null, true)}
                       <View className="clear" />
                     </View>

                     <View>
                       {(this.state.selectedGoal.intensity) && (
                         <View className="top-margin-20 relative-column-33 center-text">
                           <Text className="description-text-2 description-text-color row-10">Intensity</Text>
                           <Text>{this.state.selectedGoal.intensity}</Text>
                         </View>
                       )}

                       {(this.state.selectedGoal.budget) && (
                         <View className="top-margin-20 relative-column-33 center-text">
                           <Text className="description-text-2 description-text-color row-10">Budget</Text>
                           <Text>{this.state.selectedGoal.budget}</Text>
                         </View>
                       )}

                       {(this.state.selectedGoal.status) && (
                         <View className="top-margin-20 relative-column-33 center-text">
                           <Text className="description-text-2 description-text-color row-10">Status</Text>
                           <Text>{this.state.selectedGoal.status}</Text>
                         </View>
                       )}
                       <View className="clear" />
                     </View>

                     {(this.state.selectedGoal.successDefined) && (
                       <View className="top-margin-20">
                         <Text className="description-text-2 description-text-color row-10">Success Defined</Text>
                         <Text>{this.state.selectedGoal.successDefined}</Text>
                       </View>
                     )}

                     {(this.state.selectedGoal.strategies && this.state.selectedGoal.strategies.length > 0) && (
                       <View className="standard-border padding-20 top-margin-20">
                        <Text className="heading-text-6">Strategies & Tactics</Text>
                        {this.state.selectedGoal.strategies.map((item, optionIndex) =>
                          <View key={ item.name} className="row-10">
                            <Text className="description-text-1">Strategy #{optionIndex + 1}: {item.name}</Text>
                            {(item.tactics && item.tactics.length > 0) && (
                              <View className="row-10 left-padding-40">
                                {item.tactics.map((item2, optionIndex2) =>
                                  <View key={item2}>
                                    <Text className="description-text-3">Tactic #{optionIndex2 + 1}: {item2}</Text>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        )}

                       </View>
                     )}

                     {(this.state.selectedGoal.progress && this.state.selectedGoal.progress.length > 0) && (
                       <View className="standard-border padding-20 top-margin-20">
                        <Text className="heading-text-6">Progress</Text>
                        {this.state.selectedGoal.progress.map((item, optionIndex) =>
                          <View key={item.value} className="row-10">
                            <View className="fixed-column-120">
                              <Text className="description-text-1">{item.date}</Text>
                            </View>
                            <View className="calc-column-offset-120 left-padding">
                              <Text className="description-text-1">{item.value}</Text>
                            </View>
                            <View className="clear" />

                          </View>
                        )}

                       </View>
                     )}

                     <View className="top-margin-40 center-text">
                       <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter,styles.rightMargin]} onPress={() => this.setState({ showGoalDetails: false, showHelpOutWidget: true })}><Text style={[styles.standardText,styles.whiteColor]}>Help Out</Text></TouchableOpacity>
                       <TouchableOpacity style={[styles.btnPrimary, styles.ctaBorder, styles.flexCenter,styles.leftMargin]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Cancel</Text></TouchableOpacity>
                     </View>
                  </View>
                )}

                {(this.state.showHelpOutWidget) && (
                  <View key="showHelpOutWidget" className="full-width padding-20">

                    {(this.state.showConfirmation) ? (
                      <View className="flex-container flex-center full-space">
                        <View>
                          <View className="super-spacer" />

                          <Image source={{ uri: celebrationIcon}} className={"image-auto-100 center-horizontally"} style={(this.state.wallow) ? { transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative', transform: 'translate(50%)' } : { transition: 'all 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)', position: 'relative', transform: 'translate(10%)' }}/>

                          <View className="spacer" /><View className="spacer" /><View className="spacer" />

                          <View className="horizontal-padding">
                            <Text className="heading-text-1 center-text cta-color bold-text">You're Awesome!</Text>
                            <Text className="center-text bold-text row-20 description-text-color">Thanks for helping {this.state.profileData.firstName} out! We sent an email to both of you with details and your suggestion will be pinned to their goal profile for future reference.</Text>
                          </View>

                          <View className="spacer" /><View className="spacer" /><View className="spacer" />

                          <View className="full-width center-text">
                            {(this.state.wallowing) ? (
                              <TouchableOpacity style={[styles.btnPrimary,styles.rightMargin,styles.errorBackgroundColor,styles.flexCenter]} onPress={() => this.stopWallowing()}><Text style={[styles.standardText,styles.whiteColor]}>Stop this Nonsense</Text></TouchableOpacity>
                            ) : (
                              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter,styles.rightMargin]} onPress={() => this.startWallowing()}><Text style={[styles.standardText,styles.whiteColor]}>Wallow in Pride</Text></TouchableOpacity>
                            )}

                            <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.leftMargin,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Help Others</Text></TouchableOpacity>
                          </View>

                          <View className="spacer" /><View className="spacer" /><View className="spacer" />

                        </View>
                      </View>
                    ) : (
                      <View>
                        {(this.state.profileData) && (
                          <View>
                            <Text className="heading-text-2 full-width center-text">Help {this.state.profileData.firstName} {this.state.profileData.lastName} Achieve Their Goal</Text>
                            <Text className="heading-text-5 top-margin description-text-color full-width center-text">{this.state.selectedGoal.title} by {convertDateToString(new Date(this.state.selectedGoal.deadline),"datetime-2")}</Text>
                            <View className="spacer" /><View className="spacer" />

                            <Text className="heading-text-5 row-20">Click an icon to provide a resource <Text className="error-color bold-text">*</Text></Text>

                            <View className="row-10">
                              <View className="float-left">
                                <TouchableOpacity className="background-button" onPress={(this.state.showPeople) ? () => this.setState({ showPeople: false }) : () => this.setState({ showPeople: true })}>
                                  <Image source={(this.state.showPeople) ? { uri: addPeopleIconBlue} : { uri: addPeopleIconDark}} className="image-auto-20" />
                                </TouchableOpacity>
                              </View>
                              <View className="float-left left-padding-20">
                                <TouchableOpacity className="background-button" onPress={(this.state.showLink) ? () => this.setState({ showLink: false }) : () => this.setState({ showLink: true })}>
                                  <Image source={(this.state.showLink) ? { uri: linkIconBlue} : { uri: linkIcon}} className="image-auto-20"/>
                                </TouchableOpacity>
                              </View>
                              <View className="float-left left-padding-20">
                                <TouchableOpacity className="background-button" onPress={(this.state.showSchedule) ? () => this.setState({ showSchedule: false }) : () => this.setState({ showSchedule: true })}>
                                  <Image source={(this.state.showSchedule) ? { uri: phoneIconBlue} : { uri: phoneIconDark}} className="image-auto-20" />
                                </TouchableOpacity>
                              </View>
                              <View className="float-left left-padding-20">
                                <TouchableOpacity className="background-button" onPress={(this.state.showProject) ? () => this.setState({ showProject: false }) : () => this.setState({ showProject: true })}>
                                  <Image source={(this.state.showProject) ? { uri: projectsIconBlue} : { uri: projectsIconDark}} className="image-auto-20" />
                                </TouchableOpacity>
                              </View>
                              <View className="float-left left-padding-20">
                                <TouchableOpacity className="background-button" onPress={(this.state.showPaths) ? () => this.setState({ showPaths: false }) : () => this.setState({ showPaths: true })}>
                                  <Image source={(this.state.showPaths) ? { uri: pathsIconBlue} : { uri: pathsIconDark}} className="image-auto-20 float-left" />
                                  <Image source={(this.state.showPaths) ? { uri: tagIconBlue} : { uri: tagIconDark}} className="image-auto-9 float-left right-margin-negative-24 right-margin-2" />
                                  <View className="clear" />
                                </TouchableOpacity>
                              </View>

                              <View className="clear" />
                              <ReactTooltip />
                            </View>

                            {(this.state.showPeople) && (
                              <View className="row-10">
                                <View>
                                  <View className="float-left">
                                    <Text className="heading-text-5 bottom-margin-20">Suggest People Who Can Help</Text>
                                  </View>
                                  <View className="float-left left-padding">
                                    <TouchableOpacity className="background-button" onPress={() => this.addItem('entity')}>
                                      <View className="cta-border padding-7 circle-corners">
                                        <Image source={{ uri: addIcon}} className="image-auto-15" />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  <View className="clear" />
                                  <ReactTooltip />
                                </View>

                                <View className="half-spacer" />

                                {(this.state.selectedPeople && this.state.selectedPeople.length > 0) ? (
                                  <View>
                                    {this.state.selectedPeople.map((item, optionIndex) =>
                                      <View key={item}>
                                        <View className="top-margin-15">
                                          <View className="float-left">
                                            <Text className="heading-text-6">Contact #{optionIndex + 1}</Text>
                                          </View>
                                          <View className="float-left left-padding">
                                            <TouchableOpacity className="background-button" onPress={() => this.removeItem('entity', optionIndex)}>
                                              <View className="error-border padding-7 circle-corners">
                                                <Image source={{ uri: closeIcon}} className="image-auto-10" />
                                              </View>
                                            </TouchableOpacity>
                                          </View>
                                          <View className="clear" />
                                          <ReactTooltip />
                                        </View>

                                        <View className="row-10">
                                          <View className="container-left">
                                            <Text className="profile-label">First Name</Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("people|firstName|" + optionIndex, text)}
                                              value={item.firstName}
                                              placeholder="(e.g., Jon)"
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                          <View className="container-right">
                                            <Text className="profile-label">Last Name</Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("people|lastName|" + optionIndex, text)}
                                              value={item.lastName}
                                              placeholder="(e.g., Doe)"
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                          <View className="clear" />
                                        </View>
                                        <View className="row-10">
                                          <View className="container-left">
                                            <Text className="profile-label">Email</Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("people|email|" + optionIndex, text)}
                                              value={item.email}
                                              placeholder="(e.g., jondoe@gmail.com)"
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                          <View className="container-right">
                                            <Text className="profile-label">Relationship</Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("people|relationship|" + optionIndex, text)}
                                              value={item.relationship}
                                              placeholder="What is your relationship with this person?"
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                          <View className="clear" />
                                        </View>
                                        <View className="row-10">
                                          <Text className="profile-label">Why are you connecting {this.state.profileData.firstName} to this person?</Text>
                                          <textarea type="text" className="text-field" placeholder="How can this peron help?" name={"people|reason|" + optionIndex} value={item.reason} onChange={this.formChangeHandler}/>
                                        </View>

                                        <View style={[styles.horizontalLine]} />
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View>
                                   <View className="spacer" /><View className="spacer" />
                                   <View style={[styles.horizontalLine]} />
                                  </View>
                                )}

                              </View>
                            )}

                            {(this.state.showLink) && (
                              <View className="row-10">
                                <View>
                                  <View className="float-left">
                                    <Text className="heading-text-5 bottom-margin-20">Share a Link to a Video, Event, Course, Article, Report, or Job Opportunity</Text>
                                  </View>
                                  <View className="float-left left-padding">
                                    <TouchableOpacity className="background-button" onPress={() => this.addItem('link')}>
                                      <View className="cta-border padding-7 circle-corners">
                                        <Image source={{ uri: addIcon}} className="image-auto-15" />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  <View className="clear" />
                                  <ReactTooltip />
                                </View>

                                <View className="half-spacer" />

                                {(this.state.selectedLinks && this.state.selectedLinks.length > 0) ? (
                                  <View>
                                    {this.state.selectedLinks.map((item, optionIndex) =>
                                      <View key={item}>

                                        <View className="top-margin-15">
                                          <View className="float-left">
                                            <Text className="heading-text-6">Link Resource #{optionIndex + 1}</Text>
                                          </View>
                                          <View className="float-left left-padding">
                                            <TouchableOpacity className="background-button" onPress={() => this.removeItem('link', optionIndex)}>
                                              <View className="error-border padding-7 circle-corners">
                                                <Image source={{ uri: closeIcon}} className="image-auto-10"/>
                                              </View>
                                            </TouchableOpacity>
                                          </View>
                                          <View className="clear" />
                                          <ReactTooltip />
                                        </View>

                                        <View className="bottom-padding">
                                          <View className="container-left">
                                            <Text className="profile-label">Which type of resource is this?</Text>
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
                                          <View className="container-right">
                                            <Text className="profile-label">Paste the actual link below</Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("link|url|" + optionIndex, text)}
                                              value={item.url}
                                              placeholder="Http..."
                                              placeholderTextColor="grey"
                                            />
                                            {(item.url && !item.url.startsWith('http')) && (
                                              <View className="row-5">
                                                <Text className="error-color bold-text description-text-2">The link must start with http</Text>
                                              </View>
                                            )}
                                          </View>
                                          <View className="clear" />
                                          <View className="spacer" />
                                        </View>

                                        <View style={[styles.horizontalLine]} />
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View>
                                   <View className="spacer" /><View className="spacer" />
                                   <View style={[styles.horizontalLine]} />
                                  </View>
                                )}
                              </View>
                            )}

                            {(this.state.showSchedule) && (
                              <View className="row-10">
                                <View>
                                  <View className="float-left">
                                    <Text className="heading-text-5 bottom-margin-20">Offer Some Times You Are Available to Chat</Text>
                                  </View>
                                  <View className="float-left left-padding">
                                    <TouchableOpacity className="background-button" onPress={() => this.addItem('time')}>
                                      <View className="cta-border padding-7 circle-corners">
                                        <Image source={{ uri: addIcon}} className="image-auto-15" />
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  <View className="clear" />
                                  <ReactTooltip />
                                </View>

                                <View className="half-spacer" />

                                {(this.state.selectedTimes && this.state.selectedTimes.length > 0) ? (
                                  <View>
                                    {this.state.selectedTimes.map((item, optionIndex) =>
                                      <View key={item}>
                                        <View className="row-10">
                                          <View className="fixed-column-40">
                                            <View className="mini-spacer" /><View className="mini-spacer" />
                                            <TouchableOpacity className="background-button" onPress={() => this.removeItem('time', optionIndex)}>
                                              <View className="error-border padding-10 circle-corners">
                                                <Image source={{ uri: closeIcon}} className="image-auto-13" />
                                              </View>
                                            </TouchableOpacity>
                                          </View>
                                          <View className="calc-column-offset-40">
                                            <input type="datetime-local" className="date-picker" placeholder="Time to chat" name={"time|time|" + optionIndex} value={item.time} onChange={this.formChangeHandler} />
                                            {/*
                                            {(Platform.OS === 'ios') ? (
                                              <View style={[styles.rowDirection]}>
                                                <View style={[styles.calcColumn180]}>
                                                  <Text style={[styles.standardText,styles.row10]}>Time to Chat</Text>
                                                </View>
                                                <View style={[styles.width120,styles.topPadding5]}>
                                                  <DateTimePicker
                                                    testID="DateTimePicker"
                                                    value={(this.state.dateOfBirth) ? convertStringToDate(item.ti,'dateOnly') : new Date()}
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
                                            )}*/}
                                          </View>
                                          <View className="clear" />
                                          <ReactTooltip />
                                        </View>

                                        <View style={[styles.horizontalLine]} />
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View>
                                   <View className="spacer" /><View className="spacer" />
                                   <View style={[styles.horizontalLine]} />
                                  </View>
                                )}
                              </View>
                            )}

                            {(this.state.showProject) && (
                              <View className="row-10">
                                <View>
                                  <View className="float-left">
                                    <Text className="heading-text-5 bottom-margin-20">Suggest Projects to Work On</Text>
                                  </View>
                                  <View className="float-left left-padding">
                                    <TouchableOpacity className="background-button" onPress={() => this.addItem('project')}>
                                      <View className="cta-border padding-7 circle-corners">
                                        <Image source={{ uri: addIcon}} className="image-auto-15"/>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                  <View className="clear" />
                                  <ReactTooltip />
                                </View>

                                <View className="half-spacer" />

                                {(this.state.selectedProjects && this.state.selectedProjects.length > 0) ? (
                                  <View>
                                    {this.state.selectedProjects.map((item, optionIndex) =>
                                      <View key={item}>
                                        <View className="top-margin-15">
                                          <View className="float-left">
                                            <Text className="heading-text-6">Suggested Project #{optionIndex + 1}</Text>
                                          </View>
                                          <View className="float-left left-padding">
                                            <TouchableOpacity className="background-button" onPress={() => this.removeItem('project', optionIndex)}>
                                              <View className="error-border padding-7 circle-corners">
                                                <Image source={{ uri: closeIcon}} className="image-auto-10"/>
                                              </View>
                                            </TouchableOpacity>
                                          </View>
                                          <View className="clear" />
                                          <ReactTooltip />
                                        </View>

                                        <View className="row-10">
                                          <Text className="profile-label">Name</Text>
                                          <TextInput
                                            style={styles.textInput}
                                            onChangeText={(text) => this.formChangeHandler("project|name|" + optionIndex, text)}
                                            value={item.name}
                                            placeholder="Name of project..."
                                            placeholderTextColor="grey"
                                          />
                                        </View>
                                        <View className="row-10">
                                          <Text className="profile-label">Description</Text>
                                          <TextInput
                                            style={styles.textInput}
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
                                   <View className="spacer" /><View className="spacer" />
                                   <View style={[styles.horizontalLine]} />
                                  </View>
                                )}

                              </View>
                            )}

                            {(this.state.showPaths) && (
                              <View className="row-10">
                                <Text className="heading-text-5 bottom-margin-20">Suggest Career Paths</Text>
                                <View className="spacer" />

                                <View>
                                  <View className="calc-column-offset-70">
                                    <TextInput
                                      style={styles.textInput}
                                      onChangeText={(text) => this.formChangeHandler("searchCareers", text)}
                                      value={this.state.searchCareers}
                                      placeholder="Search over 1,100 career paths..."
                                      placeholderTextColor="grey"
                                    />
                                  </View>
                                  <View className="fixed-column-70 left-padding">
                                    <TouchableOpacity style={(this.state.unready) ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.unready} onPress={() => this.addItem('career')}><Text style={[styles.standardText,styles.whiteColor]}>Add</Text></TouchableOpacity>
                                  </View>
                                  <View className="clear" />
                                </View>

                                <View className="spacer" />

                                {(this.state.errorMessage && this.state.errorMessage !== '') && <Text className="description-text-2 error-color row-5">{this.state.errorMessage}</Text>}
                                {(this.state.successMessage && this.state.successMessage !== '') && <Text className="description-text-2 cta-color row-5">{this.state.successMessage}</Text>}

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
                                        <View className="card top-margin">
                                          {this.state.careerOptions.map((value, optionIndex) =>
                                            <View key={value._id} className="left-text bottom-margin-5 full-width">
                                              <TouchableOpacity className="background-button full-width row-5 left-text" onPress={() => this.searchItemClicked(value, 'career')}>
                                                <View className="full-width">
                                                  <View className="fixed-column-40">
                                                    <View className="mini-spacer" />
                                                    <Image source={{ uri: careerMatchesIconDark}} className="image-auto-22" />
                                                  </View>
                                                  <View className="calc-column-offset-40">
                                                    <Text className="cta-color">{value.name}</Text>
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
                                      <View className="clear" />
                                    </View>

                                    <View>
                                     <View className="spacer" /><View className="spacer" />
                                     <View style={[styles.horizontalLine]} />
                                    </View>
                                  </View>
                                )}
                              </View>
                            )}

                            <Text className="heading-text-5 row-20">Share an accompanying message <Text className="error-color bold-text">*</Text></Text>
                            <textarea className="text-field" type="text" placeholder="Add a message" name="message" value={this.state.message} onChange={this.formChangeHandler} />

                            {(!this.state.loggedIn) && (
                              <View className="top-margin-20">
                                <View style={[styles.horizontalLine]} />

                                <View className="row-20">
                                  <Text className="heading-text-5">Your Information</Text>

                                  <View className="row-10">
                                    <View className="container-left">
                                      <Text className="profile-label">First Name</Text>
                                      <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) => this.formChangeHandler("cuFirstName", text)}
                                        value={this.state.cuFirstName}
                                        placeholder="Your first name"
                                        placeholderTextColor="grey"
                                      />
                                    </View>
                                    <View className="container-right">
                                      <Text className="profile-label">Last Name</Text>
                                      <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) => this.formChangeHandler("cuLastName", text)}
                                        value={this.state.cuLastName}
                                        placeholder="Your last name"
                                        placeholderTextColor="grey"
                                      />
                                    </View>
                                    <View className="clear" />
                                  </View>
                                  <View className="row-10">
                                    <View className="container-left">
                                      <Text className="profile-label">Email</Text>
                                      <TextInput
                                        style={styles.textInput}
                                        onChangeText={(text) => this.formChangeHandler("emailId", text)}
                                        value={this.state.emailId}
                                        placeholder="Your email"
                                        placeholderTextColor="grey"
                                      />
                                    </View>
                                    <View className="clear" />
                                  </View>

                                </View>

                              </View>
                            )}

                            {(this.state.errorMessage && this.state.errorMessage !== '') && <Text className="description-text-1 row-5 error-color">{this.state.errorMessage}</Text>}
                            {(this.state.successMessage && this.state.successMessage !== '') && <Text className="description-text-1 row-5 cta-color">{this.state.successMessage}</Text>}

                            <View className="top-padding-20">
                              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter,styles.rightMargin]} onPress={() => this.sendResource()}><Text style={[styles.standardText,styles.whiteColor]}>Send Resource(s)</Text></TouchableOpacity>
                              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Cancel</Text></TouchableOpacity>
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
