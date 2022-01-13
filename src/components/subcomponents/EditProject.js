import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch, TextInput, Linking, Image } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import { WebView } from 'react-native-webview';

const xIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/x-icon.png';
const profileIconBig = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-big.png';
const questionMarkBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/question-mark-blue.png';
const careerPathIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-dark.png';
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';

import SubPicker from '../common/SubPicker';

class EditProject extends Component {
    constructor(props) {
        super(props)

        this.state = {
          selectedProject: {},
          selectedIndex: 0,

          projectCategoryOptions: [], dateOptions: [], collaboratorOptions: [], hourOptions: [], functionOptions: [], industryOptions: [],
          metricOptions: [{}], platformOptions: [],

          keyMetric1: 0,
          keyMetric2: 0,
          keyMetric3: 0,

          posts: [],
          follows: [],
        }

        this.retrieveData = this.retrieveData.bind(this)
        this.formChangeHandler = this.formChangeHandler.bind(this)
        this.inviteCollaborators = this.inviteCollaborators.bind(this)
        this.renderCollaborators = this.renderCollaborators.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.addItem = this.addItem.bind(this)
        this.removeItem = this.removeItem.bind(this)
        this.calculatePreviousMonth = this.calculatePreviousMonth.bind(this)
        this.searchItems = this.searchItems.bind(this)

    }

    componentDidMount() {

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in editProject', this.props, prevProps)

      if (this.props.selectedProject && !prevProps.selectedProject) {
        this.retrieveData(this.props.selectedProject, this.props.selectedIndex)
      } else if (this.props.selectedProject && this.props.selectedProject._id && prevProps.selectedProject && this.props.selectedProject._id !== prevProps.selectedProject._id) {
        this.retrieveData(this.props.selectedProject, this.props.selectedIndex)
      } else if (this.props.selectedIndex !== prevProps.selectedIndex) {
        this.retrieveData(this.props.selectedProject, this.props.selectedIndex)
      } else if (this.props.selectedOpportunity !== prevProps.selectedOpportunity) {
        this.retrieveData(this.props.selectedProject, this.props.selectedIndex)
      }
    }

    retrieveData = async() => {
      try {

        // console.log('this is causing the error')
        // const emailId = await AsyncStorage.getItem('email')
        // const username = await AsyncStorage.getItem('username');
        // const cuFirstName = await AsyncStorage.getItem('firstName');
        // const cuLastName = await AsyncStorage.getItem('lastName');
        // const orgFocus = await AsyncStorage.getItem('orgFocus');
        // const orgName = await AsyncStorage.getItem('orgName');
        // const roleName = await AsyncStorage.getItem('roleName');
        // const remoteAuth = await AsyncStorage.getItem('remoteAuth');
        //
        // let activeOrg = await AsyncStorage.getItem('activeOrg')
        // if (!activeOrg) {
        //   activeOrg = 'guidedcompass'
        // }
        // //const email = 'harry@potter.com'
        // this.setState({ emailId, postsAreLoading: true })
        //
        // if (emailId !== null) {
        //   // We have data!!
        //   console.log('what is the email of this user', emailId);
        //
        //   this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
        //     roleName, activeOrg, orgFocus, orgName, remoteAuth
        //   })
        // }

        const selectedProject = this.props.selectedProject
        const selectedIndex = this.props.selectedIndex
        const submitted = this.props.submitted
        const selectedOpportunity = this.props.selectedOpportunity

        const projectCategoryOptions = this.props.projectCategoryOptions
        const dateOptions = this.props.dateOptions
        const collaboratorOptions = this.props.collaboratorOptions
        const hourOptions = this.props.hourOptions
        const functionOptions = this.props.functionOptions
        const industryOptions = this.props.industryOptions
        const userPic = this.props.userPic

        const metricOptions = [{},{ name: 'Social Media Marketing'}]
        const platformOptions = ['','Instagram','Twitter','Snapchat','TikTok','Facebook','LinkedIn']

        // essentials
        const emailId = await AsyncStorage.getItem('email');
        const cuFirstName = await AsyncStorage.getItem('firstName');
        const cuLastName = await AsyncStorage.getItem('lastName');
        const activeOrg = await AsyncStorage.getItem('activeOrg');

        console.log('show activeOrg within EditProject: ', activeOrg)

        // unload metrics
        let posts = []
        let follows = []

        if (selectedProject.metrics) {

          selectedProject['metricSet'] = selectedProject.metrics.name
          posts = selectedProject.metrics.values.posts
          follows = selectedProject.metrics.values.follows
        }

        this.setState({
          selectedProject, selectedIndex, selectedOpportunity, submitted,
          projectCategoryOptions, dateOptions, collaboratorOptions, hourOptions, functionOptions, industryOptions, metricOptions,
          platformOptions,
          cuFirstName, cuLastName, activeOrg, emailId, userPic,
          posts, follows
        })
       } catch (error) {
         // Error retrieving data
         console.log('there was an error', error)
       }
    }

    formChangeHandler(eventName,eventValue) {
      console.log('formChangeHandler called: ')

      this.setState({ selectedValue: eventValue })

      if (!eventName) {
        // unknown error
      } else {
        if (eventName.includes('projectTitle')) {

          let selectedProject = this.state.selectedProject
          selectedProject['name'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('projectURL')) {

          let selectedProject = this.state.selectedProject
          selectedProject['url'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('projectImageURL')) {
          console.log('in imageURL')
          let selectedProject = this.state.selectedProject
          selectedProject['imageURL'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('projectVideoURL')) {
          console.log('in videoURL')
          let selectedProject = this.state.selectedProject
          selectedProject['videoURL'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('projectCategory')) {

          let selectedProject = this.state.selectedProject
          selectedProject['category'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('projectDescription')) {

          let selectedProject = this.state.selectedProject
          selectedProject['description'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('startDate')) {

          let selectedProject = this.state.selectedProject
          selectedProject['startDate'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('endDate')) {

          let selectedProject = this.state.selectedProject
          selectedProject['endDate'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('collaboratorEmail')) {
          const collaboratorEmail = eventValue
          let projectHasChanged = true
          this.setState({ collaboratorEmail, projectHasChanged })
        } else if (eventName.includes('collaboratorCount')) {

          let selectedProject = this.state.selectedProject
          selectedProject['collaboratorCount'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('collaborator')) {

          let selectedProject = this.state.selectedProject
          let collaborators = selectedProject.collaborators
          if (collaborators) {
            console.log('do we ever edit collaborators?')
            // collaborators[index] = eventValue
          } else {
            collaborators = [eventValue]
          }

          selectedProject['collaborators'] = collaborators
          console.log('show collaborators: ', selectedProject.collaborators)

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('projectHours')) {

          let selectedProject = this.state.selectedProject
          selectedProject['hours'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('projectTotalHours')) {

          let selectedProject = this.state.selectedProject
          selectedProject['totalHours'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('projectFocus')) {
          let selectedProject = this.state.selectedProject
          selectedProject['focus'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('skillTags')) {

          let selectedProject = this.state.selectedProject
          selectedProject['skillTags'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })

        } else if (eventName.includes('industryTags')) {

          let selectedProject = this.state.selectedProject
          selectedProject['industryTags'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })
        } else if (eventName.includes('projectFunction')) {

          let selectedProject = this.state.selectedProject
          selectedProject['jobFunction'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })

        } else if (eventName.includes('projectIndustry')) {

          let selectedProject = this.state.selectedProject
          selectedProject['industry'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })

        } else if (eventName === 'metricSet') {

          let selectedProject = this.state.selectedProject
          selectedProject['metricSet'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })

        } else if (eventName === 'postDate') {
          this.setState({ postDate: eventValue, projectHasChanged: true })
        } else if (eventName === 'link') {
          this.setState({ link: eventValue, projectHasChanged: true })
        } else if (eventName === 'platform') {
          this.setState({ platform: eventValue, projectHasChanged: true })
        } else if (eventName === 'views') {
          this.setState({ views: eventValue, projectHasChanged: true })
        } else if (eventName === 'likes') {
          this.setState({ likes: eventValue, projectHasChanged: true })
        } else if (eventName === 'interactions') {
          this.setState({ interactions: eventValue, projectHasChanged: true })
        } else if (eventName === 'accountFollows') {
          this.setState({ accountFollows: eventValue, projectHasChanged: true })
        } else if (eventName === 'metricStartDate') {
          this.setState({ metricStartDate: eventValue, projectHasChanged: true })
        } else if (eventName === 'metricEndDate') {
          this.setState({ metricEndDate: eventValue, projectHasChanged: true })
        } else if (eventName === 'projectCareerPath') {

          let selectedProject = this.state.selectedProject
          selectedProject['careerPath'] = eventValue

          let projectHasChanged = true
          this.setState({ selectedProject, projectHasChanged })

          this.searchItems(eventValue)
        } else {
          console.log('there was an error')
        }
      }
    }

    searchItems(searchString, type) {
      console.log('searchItems called', searchString, type)

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
    }

    changeContinual(index, change, type) {
      console.log('changeContinual called ', index, change, type)

      let selectedProject = this.state.selectedProject
      selectedProject['isContinual'] = change

      const projectHasChanged = true
      this.setState({ selectedProject, projectHasChanged })
    }

    inviteCollaborators(index) {
      console.log('inviteCollaborators called', index)

      if (this.state.collaboratorEmail && this.state.collaboratorEmail !== '') {

        this.setState({ collaboratorErrorMessage: null })

        if (!this.state.collaboratorEmail.includes('@')) {
          this.setState({ collaboratorErrorMessage: 'Please add a valid email' })
        } else {
          //check if user is on GC

          const email = this.state.collaboratorEmail
          let collaboratorEmail = ''

          const projectHasChanged = true

          this.props.fetchUserData({ email })
          .then((responseData) => {
              if (responseData) {
                if ( responseData.success === true ) {
                  // report to the user if there was a problem during registration
                  console.log('what is this', responseData);

                  const pictureURL = responseData.user.pictureURL
                  const firstName = responseData.user.firstName
                  const lastName = responseData.user.lastName
                  const roleName = responseData.user.roleName

                  let collaborators = this.state.selectedProject.collaborators
                  if (collaborators) {
                    collaborators.push({ pictureURL, firstName, lastName, email, roleName, joined: true })
                  } else {
                    collaborators = [{ pictureURL, firstName, lastName, email, roleName, joined: true }]
                  }

                  let selectedProject = this.state.selectedProject
                  selectedProject['collaborators'] = collaborators

                  this.setState({ selectedProject, collaboratorEmail, projectHasChanged })

                } else {
                  //api call was unsuccessful. responseData was defined though.
                  let collaborators = this.state.selectedProject.collaborators
                  if (collaborators) {
                    collaborators.push({ pictureURL: '', firstName: 'Collaborator', lastName: '#' + collaborators.length, email, roleName: 'Student', joined: false })
                  } else {
                    collaborators = [{ pictureURL: '', firstName: 'Collaborator', lastName: '#1', email, roleName: 'Student', joined: false }]
                  }

                  let selectedProject = this.state.selectedProject
                  selectedProject['collaborators'] = collaborators

                  this.setState({ selectedProject, collaboratorEmail, projectHasChanged })
                }
              } else {

                //api call was unsuccessful. responseData wasn't even defined.
                let collaborators = this.state.selectedProject.collaborators
                if (collaborators) {
                  collaborators.push({ pictureURL: '', firstName: 'Collaborator', lastName: '#' + (collaborators.length + 1), email, roleName: 'Student', joined: false })
                } else {
                  collaborators = [{ pictureURL: '', firstName: 'Collaborator', lastName: '#1', email, roleName: 'Student', joined: false }]
                }

                let selectedProject = this.state.selectedProject
                selectedProject['collaborators'] = collaborators

                this.setState({ selectedProject, collaboratorEmail, projectHasChanged })
              }
          })
        }
      }
    }

    renderCollaborators() {
      console.log('renderCollaborators called')

      let rows = []
      let collaborators = this.state.selectedProject.collaborators
      if (collaborators) {
        for (let i = 1; i <= collaborators.length; i++) {

          const index = i - 1

          rows.push(
            <View key={"collaborator" + i.toString()}>
              <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

              <View style={[styles.rowDirection]}>
                <View style={[styles.width50]}>
                  <Image source={collaborators[i - 1].pictureURL ? { uri: collaborators[i - 1].pictureURL} : { uri: profileIconBig}} style={[styles.square50,styles.contain, { borderRadius: 25 }]}/>
                </View>
                <View style={[styles.calcColumn160,styles.leftPadding]}>
                  <Text>{collaborators[i - 1].firstName} {collaborators[i - 1].lastName} ({collaborators[i - 1].email})</Text>
                  <View style={[styles.halfSpacer]} />
                  {(collaborators[i - 1].joined) ? (
                    <Text style={[styles.descriptionText2]}>{collaborators[i - 1].roleName}</Text>
                  ) : (
                    <Text style={[styles.descriptionText2]}>(This user has not joined Guided Compass)</Text>
                  )}
                </View>
                <View style={[styles.width50]}>
                  <View style={[styles.spacer]} />
                  <TouchableOpacity onPress={() => this.removeItem(index,'collaborator')}>
                    <Image source={{ uri: xIcon}} style={[styles.square20,styles.contain]}/>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          )
        }
      }

      return rows
    }

    saveProject() {
      console.log('saveProject', this.state.projectHasChanged)

      this.setState({ clientErrorMessage: '', serverErrorMessage: '', serverSuccessMessage: '', disableSubmit: true })

      if (!this.state.projectHasChanged && !this.state.selectedOpportunity) {
        console.log('no detected changes')
        this.props.finishedEditing(this.state.selectedIndex, false)
      } else {
        console.log('starting save')
        if (!this.state.selectedProject.name || this.state.selectedProject.name === '') {
          this.setState({ clientErrorMessage: 'please add a project name', disableSubmit: false })
        } else if (!this.state.selectedProject.url || this.state.selectedProject.url === '') {
          this.setState({ clientErrorMessage: 'please add a url / web link for this project', disableSubmit: false})
        } else if (!this.state.selectedProject.url.includes("http")) {
          this.setState({ clientErrorMessage: 'please add a valid url', disableSubmit: false})
        } else if (!this.state.selectedProject.category || this.state.selectedProject.category === '') {
          this.setState({ clientErrorMessage: 'please add a category for this project', disableSubmit: false})
        } else if (!this.state.selectedProject.startDate || this.state.selectedProject.startDate === '') {
          this.setState({ clientErrorMessage: 'please indicate when you started working on this project', disableSubmit: false})
        } else if (!this.state.selectedProject.endDate && !this.state.selectedProject.isContinual) {
          this.setState({ clientErrorMessage: 'please indicate when you stopped working on this project', disableSubmit: false})
        } else if (this.state.selectedProject.endDate === '' && !this.state.selectedProject.isContinual) {
          this.setState({ clientErrorMessage: 'please indicate when you stopped working on this project', disableSubmit: false})
        } else if (!this.state.selectedProject.hours || this.state.selectedProject.hours === '') {
          this.setState({ clientErrorMessage: 'please add the number of hours you worked on this project', disableSubmit: false})
        } else {

          const emailId = this.state.emailId
          const userFirstName = this.state.cuFirstName
          const userLastName = this.state.cuLastName
          const userPic = this.state.userPic

          const _id = this.state.selectedProject._id
          const name = this.state.selectedProject.name
          const url = this.state.selectedProject.url
          const category = this.state.selectedProject.category
          const description = this.state.selectedProject.description
          const startDate = this.state.selectedProject.startDate
          let endDate = this.state.selectedProject.endDate
          const isContinual = this.state.selectedProject.isContinual

          if (isContinual) {

            const currentMonth = new Date().getMonth()
            const year = new Date().getFullYear()

            let month = ''

            if (currentMonth === 0) {
              month = 'January'
            } else if (currentMonth === 1) {
              month = 'February'
            } else if (currentMonth === 2) {
              month = 'March'
            } else if (currentMonth === 3) {
              month = 'April'
            } else if (currentMonth === 4) {
              month = 'May'
            } else if (currentMonth === 5) {
              month = 'June'
            } else if (currentMonth === 6) {
              month = 'July'
            } else if (currentMonth === 7) {
              month = 'August'
            } else if (currentMonth === 8) {
              month = 'September'
            } else if (currentMonth === 9) {
              month = 'October'
            } else if (currentMonth === 10) {
              month = 'November'
            } else if (currentMonth === 11) {
              month = 'December'
            }

            endDate = month + ' ' + year
          }

          const collaborators = this.state.selectedProject.collaborators
          let collaboratorCount = this.state.selectedProject.collaboratorCount
          if (this.state.activeOrg !== 'c2c' && collaborators) {
            collaboratorCount = collaborators.length
          }

          const hours = this.state.selectedProject.hours
          const totalHours = this.state.selectedProject.totalHours
          const focus = this.state.selectedProject.focus
          const skillTags = this.state.selectedProject.skillTags
          //const industryTags = this.state.selectedProject.industryTags
          const careerPath = this.state.selectedProject.careerPath
          const jobFunction = this.state.selectedProject.jobFunction
          const industry = this.state.selectedProject.industry
          console.log('test 2')
          const orgCode = this.state.activeOrg
          const imageURL = this.state.selectedProject.imageURL
          const videoURL = this.state.selectedProject.videoURL

          let metrics = null
          if (this.state.selectedProject.metricSet) {
            // posts: postDate, link, platform, views, likes, interactions
            // follows: metricStartDate, metricEndDate, platform, accountFollows, interactions

            const posts = this.state.posts
            const follows = this.state.follows
            metrics = { name: this.state.selectedProject.metricSet, values: { posts, follows }}

          }

          // console.log('show projectValues: ', _id, emailId, userFirstName, userLastName, name, url, category, description, startDate, endDate, isContinual, collaborators, collaboratorCount,
          //   hours, totalHours, focus, skillTags, jobFunction, industry, orgCode, metrics)

          const projectObject = {
            _id, emailId, userFirstName, userLastName, userPic, name, url, category, description, startDate, endDate, isContinual, collaborators, collaboratorCount,
            imageURL, videoURL, hours, totalHours, focus, skillTags, careerPath, jobFunction, industry, orgCode, metrics
          }

          Axios.post('https://www.guidedcompass.com/api/projects', projectObject)
          .then((response) => {
            console.log('test 4')
            if (response.data.success) {
              //save values
              console.log('Project save worked ', response.data);
              //report whether values were successfully saved

              if (!this.state.selectedOpportunity) {
                this.setState({ disableSubmit: false })
                this.props.finishedEditing(this.state.selectedIndex, true)
                if (this.props.fromApply) {
                  this.props.passData('project', projectObject, this.state.selectedIndex)
                }
              } else {
                // submit to opportunity

                const cuFirstName = this.state.cuFirstName
                const cuLastName = this.state.cuLastName
                const contributorFirstName = this.state.selectedOpportunity.contributorFirstName
                const contributorLastName = this.state.selectedOpportunity.contributorLastName
                const contributorEmail = this.state.selectedOpportunity.contributorEmail
                const postingId = this.state.selectedOpportunity._id
                const postingName = this.state.selectedOpportunity.name
                const projectId = response.data._id
                const projectName = name
                const orgContactEmail = this.state.orgContactEmail

                const orgCode = this.state.activeOrg

                //save submission
                Axios.post('https://www.guidedcompass.com/api/projects/submit', {
                  emailId, cuFirstName, cuLastName, userPic, contributorFirstName, contributorLastName, contributorEmail,
                  postingId, postingName, projectId, projectName, orgContactEmail, totalHours, focus, metrics,
                  orgCode, url, category, description, startDate, endDate, collaborators, collaboratorCount, hours,
                  imageURL, videoURL
                })
                .then((response) => {

                  if (response.data.success) {
                    //save values
                    console.log('Project submit worked here ', response.data);

                    let serverSuccessMessage: 'Project successfully submitted!'
                    if (this.state.submitted) {
                      serverSuccessMessage = 'Project successfully updated!'
                    }

                    const selectedProject = {}

                    this.setState({ disableSubmit: false, serverSuccessMessage, selectedProject })
                    this.props.finishedSubmitting(this.state.selectedProject)

                  } else {
                    console.log('project did not save successfully')
                    this.setState({ serverErrorMessage: response.data.message, disableSubmit: false })
                  }

                }).catch((error) => {
                    console.log('Project save did not work', error);
                    this.setState({ serverErrorMessage: error, disableSubmit: false })
                });
              }

            } else {
              console.log('project did not save successfully')
              this.setState({

                  serverSuccessText: false,
                  serverErrorMessageText: response.data.message, disableSubmit: false
              })
            }

          }).catch((error) => {
              console.log('Project save did not work', error);
              this.setState({ serverSuccessText: false, serverErrorMessage: error, disableSubmit: false })
          });
        }
      }
    }

    closeModal() {

      this.setState({ modalIsOpen: false, showCareerPath: false });

    }

    addItem(type) {
      console.log('addItem called', type)

      this.setState({ errorMessage: null, successMessage: null })

      if (type === 'Social Media Posts') {
        let posts = this.state.posts

        let postDate = this.state.postDate
        let link = this.state.link
        let platform = this.state.platform
        let views = this.state.views
        let likes = this.state.likes
        let interactions = this.state.interactions

        if (!postDate || postDate === '') {
          this.setState({ errorMessage: 'Please add a post date'})
        } else if (!link || link === '') {
          this.setState({ errorMessage: 'Please add a link'})
        } else if (!platform || platform === '') {
          this.setState({ errorMessage: 'Please add a platform'})
        } else if (!views || views === '') {
          this.setState({ errorMessage: 'Please add views'})
        } else if (!likes || likes === '') {
          this.setState({ errorMessage: 'Please add likes'})
        } else if (!interactions || interactions === '') {
          this.setState({ errorMessage: 'Please add interactions'})
        } else {
          // it works

          let successMessage = 'Successfully added post. Save the project to save changes.'
          if (this.state.editIndex || this.state.editIndex === 0) {
            posts[this.state.editIndex] = { postDate, link, platform, views, likes, interactions }
            successMessage = 'Successfully edited post. Save the project to save changes.'
          } else {
            posts.push({ postDate, link, platform, views, likes, interactions })
          }

          let editIndex = null
          postDate = ''
          link = ''
          platform = ''
          views = ''
          likes = ''
          interactions = ''

          this.setState({ editIndex, posts, postDate, link, platform, views, likes, interactions, successMessage
          })
        }


        // let keyMetric1 = this.state.keyMetric1
        // let keyMetric2 = this.state.keyMetric2 + 10
        // let keyMetric3 = this.state.keyMetric3 + 10
        //
        // this.setState({ posts, keyMetric1, keyMetric2, keyMetric3 })
      } else if (type === 'Your Follows of Other Social Media Accounts') {
        let follows = this.state.follows

        let metricStartDate = this.state.metricStartDate
        let metricEndDate = this.state.metricEndDate
        let platform = this.state.platform
        let accountFollows = this.state.accountFollows
        let interactions = this.state.interactions

        if (!metricStartDate || metricStartDate === '') {
          this.setState({ errorMessage: 'Please add a start date for the date range'})
        } else if (!metricEndDate || metricEndDate === '') {
          this.setState({ errorMessage: 'Please add an end date for the date range'})
        } else if (!platform || platform === '') {
          this.setState({ errorMessage: 'Please add a platform'})
        } else if (!accountFollows || accountFollows === '') {
          this.setState({ errorMessage: 'Please add follows'})
        } else if (!interactions || interactions === '') {
          this.setState({ errorMessage: 'Please add interactions'})
        } else {
          // it works

          let successMessage = 'Successfully added follows. Save the project to save changes.'
          if (this.state.editIndex || this.state.editIndex === 0) {
            follows[this.state.editIndex] = { metricStartDate, metricEndDate, platform, accountFollows, interactions }
            successMessage = 'Successfully edited follows. Save the project to save changes.'
          } else {
            follows.push({ metricStartDate, metricEndDate, platform, accountFollows, interactions })
          }

          let editIndex = null

          metricStartDate = ''
          metricEndDate = ''
          platform = ''
          accountFollows = ''
          interactions = ''

          this.setState({ editIndex, metricStartDate, metricEndDate, platform, accountFollows, interactions, successMessage
          })

        }
      // } else if (type === 'Followers Gained By Platform') {
      //   let followers = this.state.followers
      //   followers.push({})
      //
      //   let keyMetric1 = this.state.keyMetric1 + 30
      //   let keyMetric2 = this.state.keyMetric2
      //   let keyMetric3 = this.state.keyMetric3
      //
      //   this.setState({ followers, keyMetric1, keyMetric2, keyMetric3 })
      }
    }

    removeItem(type, index) {
      console.log('removeItem called', type, index)

      this.setState({ errorMessage: null, successMessage:  null })

      if (type === 'collaborator') {
        let selectedProject = this.state.selectedProject
        let collaborators = this.state.selectedProject[index].collaborators
        collaborators.splice(index, 1)
        selectedProject['collaborators'] = collaborators
        this.setState({ selectedProject })
      } else if (type === 'Social Media Posts') {
        let posts = this.state.posts
        posts.splice(this.state.editIndex, 1)

        let editIndex = null
        let successMessage = 'Metric successfully deleted'
        this.setState({ posts, editIndex, successMessage })

      } else if (type === 'Your Follows of Other Social Media Accounts') {
        let follows = this.state.follows
        follows.splice(this.state.editIndex,1)

        let posts = this.state.posts
        posts.splice(this.state.editIndex, 1)

        let editIndex = null
        let successMessage = 'Metric successfully deleted'
        this.setState({ follows, editIndex, successMessage })
      }
    }

    calculatePreviousMonth(startDate) {
      console.log('calculatePreviousMonth called', startDate)

      // startDate is formatted November 2020
      let previousMonthDate = startDate
      let month = startDate.split(" ")[0]
      const months = ['January','Febuary','March','April','May','June','July','August','October','November','December']

      for (let i = 1; i <= months.length; i++) {
        if (month === months[i - 1]) {
          let previousIndex = i - 2
          if (previousIndex < 0) {
            previousIndex = 11
          }
          const newMonth = months[previousIndex].substring(0,3)
          previousMonthDate =  newMonth + ' ' + startDate.split(" ")[1]
        }
      }

      return previousMonthDate
    }

    searchItemClicked(passedItem, type) {
      console.log('searchItemClicked called', passedItem, type)

      if (type === 'career') {

        const searchObject = passedItem
        // const projectCareerPath = passedItem.name
        let selectedProject = this.state.selectedProject
        selectedProject['careerPath'] = passedItem.name

        const projectCareerPathReady = true
        const careerOptions = null



        this.setState({ searchObject, selectedProject, projectCareerPathReady, careerOptions })

      }
    }


    render() {

      return (
        <View>
          {(!this.state.selectedOpportunity) && (
            <View>
              <View style={[styles.rowDirection,styles.flex1]}>
                <View style={[styles.calcColumn120]}>
                  {(this.state.selectedProject.name && this.state.selectedProject.name !== '') ? (
                    <Text style={[styles.headingText5]}>Edit {this.state.selectedProject.name}</Text>
                  ) : (
                    <Text style={[styles.headingText5]}>Edit project below</Text>
                  )}
                </View>
                <View style={[styles.width60]}>
                  <TouchableOpacity onPress={() => this.saveProject()}>
                    <View>
                      <Text style={[styles.headingText5,styles.ctaColor,styles.rightText]}>Done</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
            </View>
          )}

          <View style={[styles.row10]}>
            <Text style={[styles.row10,styles.standardText]}>Project Title<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler("projectTitle", text)}
              value={this.state.selectedProject.name}
              placeholder="Project Title"
              placeholderTextColor="grey"
            />
          </View>

          <View style={[styles.row10]}>
            <Text style={[styles.row10,styles.standardText]}>Project URL<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
            <Text style={[styles.descriptionText3,styles.bottomPadding]}>Add a link from your own website or a file sharing site like Google Drive that details your project.</Text>

            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler("projectURL", text)}
              value={this.state.selectedProject.url}
              placeholder="http..."
              placeholderTextColor="grey"
            />
            <Text style={[styles.errorColor]}>Please make sure that the link allows anyone to view the contents!</Text>
            {(this.state.selectedProject.url && this.state.selectedProject.url !== '' && !this.state.selectedProject.url.startsWith('http')) ? (
              <View>
                <Text style={[styles.errorColor]}>Please start your link with http</Text>
              </View>
            ) : (
              <View />
            )}
          </View>

          <View>
            <View style={[styles.row10]}>
              <Text style={[styles.row10,styles.standardText]}>Project Header Image (Optional) (Dimensions: 600px x 250px)</Text>
              <Text style={[styles.descriptionText2,styles.bottomPadding]}>Add a link to a large landscape image that showcases or represents your project. If entered correctly, the image will appear below the entry field.</Text>

              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.formChangeHandler("projectImageURL", text)}
                value={this.state.selectedProject.imageURL}
                placeholder="http..."
                placeholderTextColor="grey"
              />

              {(this.state.selectedProject.imageURL && this.state.selectedProject.imageURL !== '') ? (
                <View style={[styles.row5]}>
                  <Image source={{ uri: this.state.selectedProject.imageURL}} style={[styles.calcColumn60,styles.height150,styles.contain]} />
                  {/*https://www.guidedcompass.com/public-server/web/full-guided-compass-logo.png*/}
                </View>
              ) : (
                <View />
              )}

              <Text style={[styles.row10,styles.standardText]}>Video URL (Optional)</Text>
              <Text style={[styles.descriptionText2,styles.bottomPadding]}>Add a link to a video demonstration of your project. Use the "Embed" version of the link. If entered correctly, the video will appear below the entry field.</Text>

              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.formChangeHandler("projectVideoURL", text)}
                value={this.state.selectedProject.videoURL}
                placeholder="http..."
                placeholderTextColor="grey"
              />

              {(this.state.selectedProject.videoURL && this.state.selectedProject.videoURL !== '') ? (
                <View style={[styles.row5]}>
                  <View>
                    <WebView
                      style={[styles.calcColumn60,styles.screenHeight20]}
                      javaScriptEnabled={true}
                      source={{uri: this.state.selectedProject.videoURL}}
                    />
                  </View>
                </View>
              ) : (
                <View />
              )}
            </View>
          </View>

          <View style={[styles.row10]}>
            <Text style={[styles.row10,styles.standardText]}>Project Description</Text>
            <TextInput
              style={styles.textArea}
              onChangeText={(text) => this.formChangeHandler("projectDescription", text)}
              value={this.state.selectedProject.description}
              placeholder="Project description..."
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={4}
            />
          </View>

          <View style={[styles.row10]}>
            <Text style={[styles.row10,styles.standardText]}>Are you still working on this project?</Text>
            <Switch
              onValueChange={(change) => this.changeContinual(this.state.selectedIndex, change,'project')}
              value={this.state.selectedProject.isContinual}
              id="isContinual"
            />
          </View>

          <View style={[styles.row10]}>
            <View style={[styles.row10]}>
              <Text style={[styles.row10,styles.standardText]}>Start Date<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
              {(Platform.OS === 'ios') ? (
                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Start Date', selectedIndex: null, selectedName: "startDate", selectedValue: this.state.selectedProject.startDate, selectedOptions: this.state.dateOptions, selectedSubKey: 'value' })}>
                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                    <View style={[styles.calcColumn115]}>
                      <Text style={[styles.descriptionText1]}>{this.state.selectedProject.startDate}</Text>
                    </View>
                    <View style={[styles.width20,styles.topMargin5]}>
                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <Picker
                  selectedValue={this.state.selectedProject.startDate}
                  onValueChange={(itemValue, itemIndex) =>
                    this.formChangeHandler("startDate",itemValue)
                  }>
                  {this.state.dateOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                </Picker>
              )}
            </View>

            {(this.state.selectedProject.isContinual) ? (
              <View style={[styles.row10]}>
                {(!this.state.isMobile) && (
                  <View>
                    <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                  </View>
                )}

                <Text style={[styles.headingText5]}>Still Working On This</Text>
              </View>
            ) : (
              <View style={[styles.row10]}>
                <Text style={[styles.row10,styles.standardText]}>End Date<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'End Date', selectedIndex: null, selectedName: "endDate", selectedValue: this.state.selectedProject.endDate, selectedOptions: this.state.dateOptions, selectedSubKey: 'value' })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{this.state.selectedProject.endDate}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={this.state.selectedProject.endDate}
                    onValueChange={(itemValue, itemIndex) =>
                      this.formChangeHandler("endDate",itemValue)
                    }>
                    {this.state.dateOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                  </Picker>
                )}

              </View>
            )}


          </View>

          <View style={[styles.row10]}>
            <View style={[styles.row10]}>
              {(this.state.activeOrg !== 'c2c') ? (
                <View>
                  <Text style={[styles.row10,styles.standardText]}>Add Collaborators</Text>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.calcColumn140]}>
                      <TextInput
                        style={styles.textInput}
                        onChangeText={(text) => this.formChangeHandler("collaboratorEmail", text)}
                        value={this.state.collaboratorEmail}
                        placeholder="Add email..."
                        placeholderTextColor="grey"
                      />
                    </View>
                    {(this.state.selectedOpportunity) ? (
                      <View style={[styles.width80,styles.leftPadding]}>
                        <TouchableOpacity style={(this.state.collaboratorEmail && this.state.collaboratorEmail !== '') ? [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter] : [styles.btnSquarish,styles.mediumBackground,styles.flexCenter]} onPress={() => this.inviteCollaborators(this.state.selectedIndex)}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
                      </View>
                    ) : (
                      <View style={[styles.width80,styles.leftPadding]}>
                        <TouchableOpacity style={(this.state.collaboratorEmail && this.state.collaboratorEmail !== '') ? [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter] : [styles.btnSquarish,styles.mediumBackground,styles.flexCenter]} disabled={this.state.isSaving} onPress={() => this.inviteCollaborators(this.state.selectedIndex)}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
                      </View>
                    )}


                  </View>

                  {(this.state.collaboratorErrorMessage) && <Text style={[styles.errorColor]}>{this.state.collaboratorErrorMessage}</Text>}

                  <View>
                    {this.renderCollaborators(this.state.selectedIndex)}
                  </View>
                </View>
              ) : (
                <View>
                  <Text style={[styles.row10,styles.standardText]}># of Collaborators (Not Including You)</Text>

                  {(Platform.OS === 'ios') ? (
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Collaborator Count', selectedIndex: null, selectedName: "collaboratorCount", selectedValue: this.state.selectedProject.collaboratorCount, selectedOptions: this.state.collaboratorOptions, selectedSubKey: 'value' })}>
                      <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                        <View style={[styles.calcColumn115]}>
                          <Text style={[styles.descriptionText1]}>{this.state.selectedProject.collaboratorCount}</Text>
                        </View>
                        <View style={[styles.width20,styles.topMargin5]}>
                          <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  ) : (
                    <Picker
                      selectedValue={this.state.selectedProject.collaboratorCount}
                      onValueChange={(itemValue, itemIndex) =>
                        this.formChangeHandler("collaboratorCount",itemValue)
                      }>
                      {this.state.collaboratorOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                    </Picker>
                  )}

                </View>
              )}
            </View>
            <View style={[styles.row10]}>
              <Text style={[styles.row10,styles.standardText]}>Number of Hours I Committed<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

              {(Platform.OS === 'ios') ? (
                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Hours', selectedIndex: null, selectedName: "projectHours", selectedValue: this.state.selectedProject.hours, selectedOptions: this.state.hourOptions, selectedSubKey: 'value' })}>
                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                    <View style={[styles.calcColumn115]}>
                      <Text style={[styles.descriptionText1]}>{this.state.selectedProject.hours}</Text>
                    </View>
                    <View style={[styles.width20,styles.topMargin5]}>
                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <Picker
                  selectedValue={this.state.selectedProject.hours}
                  onValueChange={(itemValue, itemIndex) =>
                    this.formChangeHandler("projectHours",itemValue)
                  }>
                  {this.state.hourOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                </Picker>
              )}

            </View>

          </View>

          {(this.state.selectedProject.collaborators && this.state.selectedProject.collaborators.length > 0) && (
            <View style={[styles.row10]}>
              <View style={[styles.row10]}>
                <Text style={[styles.row10,styles.standardText]}>Number of Total Hours Across Team Members<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                {(Platform.OS === 'ios') ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Total Hours', selectedIndex: null, selectedName: "projectTotalHours", selectedValue: this.state.selectedProject.totalHours, selectedOptions: this.state.hourOptions, selectedSubKey: 'value' })}>
                    <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                      <View style={[styles.calcColumn115]}>
                        <Text style={[styles.descriptionText1]}>{this.state.selectedProject.totalHours}</Text>
                      </View>
                      <View style={[styles.width20,styles.topMargin5]}>
                        <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                      </View>
                    </View>
                  </TouchableOpacity>
                ) : (
                  <Picker
                    selectedValue={this.state.selectedProject.totalHours}
                    onValueChange={(itemValue, itemIndex) =>
                      this.formChangeHandler("projectTotalHours",itemValue)
                    }>
                    {this.state.hourOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                  </Picker>
                )}
              </View>
              <View style={[styles.row10]}>
                <Text style={[styles.row10,styles.standardText]}>Did you focus on something different than team members?<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                <TextInput
                  style={styles.textInput}
                  onChangeText={(text) => this.formChangeHandler("projectFocus", text)}
                  value={this.state.selectedProject.focus}
                  placeholder="Your focus during the project..."
                  placeholderTextColor="grey"
                />
              </View>

            </View>
          )}

          <View style={[styles.row10]}>

            <View style={[styles.rowDirection]}>
              <View>
                <Text style={[styles.row10,styles.standardText]}>Skill Tags</Text>
              </View>
              <View>
                <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                <View style={[styles.leftMargin,styles.notiBubbleInfo7of9]}>
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showJobFunction: false, showIndustry: false, showMetricsInfo: false, addMetric: false, skillTagsInfo: true })}>
                    <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain]} />
                  </TouchableOpacity>
                </View>
              </View>

            </View>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler("skillTags", text)}
              value={this.state.selectedProject.skillTags}
              placeholder="add skills acquired separated by commas"
              placeholderTextColor="grey"
            />
          </View>

          <View style={[styles.row10]}>
            <View style={[styles.row10]}>
              <Text style={[styles.row10,styles.standardText]}>Project Category<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
              {(Platform.OS === 'ios') ? (
                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Category', selectedIndex: null, selectedName: "projectCategory", selectedValue: this.state.selectedProject.category, selectedOptions: this.state.projectCategoryOptions, selectedSubKey: 'value' })}>
                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                    <View style={[styles.calcColumn115]}>
                      <Text style={[styles.descriptionText1]}>{this.state.selectedProject.category}</Text>
                    </View>
                    <View style={[styles.width20,styles.topMargin5]}>
                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <Picker
                  selectedValue={this.state.selectedProject.category}
                  onValueChange={(itemValue, itemIndex) =>
                    this.formChangeHandler("projectCategory",itemValue)
                  }>
                  {this.state.projectCategoryOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                </Picker>
              )}

            </View>

            <View style={[styles.row10]}>
              <View style={[styles.rowDirection]}>
                <View>
                  <Text style={[styles.row10,styles.standardText]}>Select a Career Path</Text>
                </View>
                <View>
                  <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                  <View style={[styles.leftMargin,styles.notiBubbleInfo7of9]}>
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showCareerPath: true })}>
                      <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={[styles.standardBorder,styles.rowDirection]}>
                <View style={[styles.width35]}>
                  <View style={[styles.spacer]} />
                  <Image source={{ uri: searchIcon}} style={[styles.square18,styles.leftMargin]}/>
                </View>
                <View style={[styles.calcColumn95]}>
                  <TextInput
                    style={[styles.height40]}
                    onChangeText={(text) => this.formChangeHandler("projectCareerPath", text)}
                    value={this.state.selectedProject.careerPath}
                    placeholder="Search career path..."
                    placeholderTextColor="grey"
                  />
                </View>

              </View>

              {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
              {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

              {(this.state.searchIsAnimating) ? (
                <View style={[styles.flex1,styles.flexCenter]}>
                  <View>
                    <View style={[styles.superSpacer]} />

                    <ActivityIndicator
                       animating = {this.state.searchIsAnimating}
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
                    {(this.state.careerOptions) && (
                      <View style={[styles.card,styles.topMargin]}>
                        {this.state.careerOptions.map((value, optionIndex) =>
                          <View key={value._id} style={[styles.bottomMargin5,styles.calcColumn120]}>
                            <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value, 'career')}>
                              <View style={[styles.calcColumn120,styles.rowDirection]}>
                                <View style={[styles.width40]}>
                                  <View style={[styles.miniSpacer]} />
                                  <Image source={{ uri: careerPathIconDark}} style={[styles.square22,styles.contain]} />
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
                  {/*
                  <View>

                    {this.renderTags('career')}


                  </View>*/}

                </View>
              )}
            </View>

          </View>

          <View style={[styles.row10]}>
            <View style={[styles.row10]}>
              <View style={[styles.rowDirection]}>
                <View>
                  <Text style={[styles.row10,styles.standardText]}>Closest Job Function</Text>
                </View>
                <View>
                  <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                  <View style={[styles.leftMargin,styles.notiBubbleInfo7of9]}>
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showJobFunction: true, showIndustry: false, showMetricsInfo: false, addMetric: false })}>
                      <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              {(Platform.OS === 'ios') ? (
                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Function', selectedIndex: null, selectedName: "projectFunction", selectedValue: this.state.selectedProject.jobFunction, selectedOptions: this.state.functionOptions, selectedSubKey: 'value' })}>
                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                    <View style={[styles.calcColumn115]}>
                      <Text style={[styles.descriptionText1]}>{this.state.selectedProject.jobFunction}</Text>
                    </View>
                    <View style={[styles.width20,styles.topMargin5]}>
                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <Picker
                  selectedValue={this.state.selectedProject.jobFunction}
                  onValueChange={(itemValue, itemIndex) =>
                    this.formChangeHandler("projectFunction",itemValue)
                  }>
                  {this.state.functionOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                </Picker>
              )}

            </View>
            <View style={[styles.row10]}>
              <View style={[styles.rowDirection]}>
                <View>
                  <Text style={[styles.row10,styles.standardText]}>Closest Industry</Text>
                </View>
                <View>
                  <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                  <View style={[styles.leftMargin,styles.notiBubbleInfo7of9]}>
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showJobFunction: false, showIndustry: true, showMetricsInfo: false, addMetric: false })}>
                      <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain]} />
                    </TouchableOpacity>
                  </View>

                </View>
              </View>

              {(Platform.OS === 'ios') ? (
                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: 'Industry', selectedIndex: null, selectedName: "projectIndustry", selectedValue: this.state.selectedProject.industry, selectedOptions: this.state.industryOptions, selectedSubKey: 'value' })}>
                  <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                    <View style={[styles.calcColumn115]}>
                      <Text style={[styles.descriptionText1]}>{this.state.selectedProject.industry}</Text>
                    </View>
                    <View style={[styles.width20,styles.topMargin5]}>
                      <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                    </View>
                  </View>
                </TouchableOpacity>
              ) : (
                <Picker
                  selectedValue={this.state.selectedProject.industry}
                  onValueChange={(itemValue, itemIndex) =>
                    this.formChangeHandler("projectIndustry",itemValue)
                  }>
                  {this.state.industryOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                </Picker>
              )}

            </View>


          </View>

          {(this.state.selectedOpportunity) ? (
            <View>
              {this.state.serverSuccessMessage !== '' && <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessage}</Text>}
              {this.state.serverErrorMessage !== '' && <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>}
              <TouchableOpacity style={(this.state.disableSubmit) ? [styles.btnPrimary,styles.mediumBackground,styles.flexCenter] : [styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.disableSubmit} onPress={() => this.saveProject()}><Text style={[styles.standardText,styles.whiteColor]}>{this.state.submitted ? "Update Your Solution" : "Submit Your Solution"}</Text></TouchableOpacity>
            </View>
          ) : (
            <View>
              <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
              <View style={[styles.bottomPadding,styles.calcColumn60,styles.alignEnd]}>
                <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} disabled={this.state.disableSubmit} onPress={() => this.saveProject()}><Text style={[styles.standardText,styles.ctaColor]}>Save Project</Text></TouchableOpacity>
              </View>
            </View>
          )}


          {this.state.clientErrorMessage !== '' && <Text style={[styles.errorColor]}>{this.state.clientErrorMessage}</Text>}
          <View style={[styles.spacer]} /><View style={[styles.spacer]} />

          <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>

           {(this.state.showCareerPath) && (
             <View key="showJobFunction" style={[styles.calcColumn80,styles.padding20]}>
               <Text style={[styles.headingText2]}>Career Path</Text>
               <View style={[styles.spacer]} />
               <Text>Tagging a <Text style={[styles.boldText,styles.ctaColor]}>career path</Text>, if you make your project public, allows your project to be discoverable in each of the career path pages. <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerName: 'Chief Executives'})}>Chief Executives</TouchableOpacity>, for example.</Text>

               <View style={[styles.row20]}>
                <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close View</Text></TouchableOpacity>
               </View>
             </View>
           )}

          {(this.state.showJobFunction) && (
            <View key="showJobFunction" style={[styles.calcColumn80,styles.padding20]}>>
              <Text style={[styles.headingText2]}>Job Function</Text>
              <View style={[styles.spacer]} />
              <Text>We define <Text style={[styles.boldText,styles.ctaColor]}>job functions</Text> as a category of work that requires similar skills. It can be thought of as synonymous with "departments" within a company. Functions can be the same across different industries. Examples of functions include sales, marketing, finance, engineering, and design.</Text>

              <View style={[styles.row20]}>
               <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close View</Text></TouchableOpacity>
              </View>
            </View>
          )}

          {(this.state.showIndustry) && (
            <View key="showIndustry" style={[styles.calcColumn80,styles.padding20]}>>
              <Text style={[styles.headingText2]}>Industry</Text>
              <View style={[styles.spacer]} />
              <Text>We define <Text style={[styles.boldText,styles.ctaColor]}>industry</Text> as a category of companies that are related based on their primary business activitiees. Companies are generally grouped by their sources of revenue. For example, Nike would fall under "Fashion & Apparel" and Netflix would fall under "Other Entertainment".</Text>

              <View style={[styles.row20]}>
               <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close View</Text></TouchableOpacity>
              </View>
            </View>
          )}

          {(this.state.showMetricsInfo) && (
            <View key="showMetricsInfo" style={[styles.calcColumn80,styles.padding20]}>>
              <Text style={[styles.headingText2]}>Metrics Explained</Text>
              <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
              <Text>Companies are simply the combination of many large projects with defined roles. We think of school and personal projects this way.</Text>
              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
              <Text>This <Text style={[styles.boldText,styles.ctaColor]}>metrics</Text> section is an opportunity to align your projects with employers'. Just like employees do at companies, report the key metrics that will impress. At some point, your metrics will either be strong enough to either generate funding for a business or be strong enough to impress employers to hire you.</Text>
              <View style={[styles.spacer]} />

              <View style={[styles.row20]}>
               <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close View</Text></TouchableOpacity>
              </View>
            </View>
          )}

          {(this.state.skillTagsInfo) && (
            <View key="showIndustry" style={[styles.calcColumn80,styles.padding20]}>>
              <Text style={[styles.headingText2]}>Skill Tags Info</Text>
              <View style={[styles.spacer]} />
              <Text><Text style={[styles.boldText,styles.ctaColor]}>Skill Tags</Text> allow you to list the skills related to your project separated by commas. For example, for design project, you may want to tag wireframing, Adobe Photoshop, and flow chart. This allows the reviewer to better understand your skills and allows you to receive better recommendations.</Text>

              <View style={[styles.row20]}>
               <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close View</Text></TouchableOpacity>
              </View>
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
        </View>
      )
    }
}

export default EditProject
