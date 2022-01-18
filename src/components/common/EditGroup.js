import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch, Image, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import DateTimePicker from '@react-native-community/datetimepicker';
import {launchCamera, launchImageLibrary} from 'react-native-image-picker';

const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png'
const imageIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/image-icon.png'
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png'
const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png'
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png'
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';

import {convertDateToString} from '../functions/convertDateToString';
import {convertStringToDate} from '../functions/convertStringToDate';

import SubPicker from '../common/SubPicker';

class EditGroup extends Component {
    constructor(props) {
        super(props)

        this.state = {
          categoryOptions: [],
          accessTypeOptions: [],
          roleNameOptions: ['Career-Seeker','Mentor','Employer'],
          goalTypeOptions: ['Land a Job', 'Become a freelancer','Start a business','Grow a business','Explore careers','Find my purpose','Learn new skill(s)','Earn an educational degree','Develop a robust network','Solve a social problem'],
          repeatOptions: ['Every Day','Every Week','Every 2 Weeks','Every Month','Every Year'],
          reminderOptions: ['None','At time of event','5 minutes before','10 minutes before','15 minutes before','30 minutes before','1 hour before','2 hous before','1 day before','2 days before','1 week before'],
          meetingMethodOptions: ['','In Person','Remote'],

          meetingRepeats: 'Every Week',
          groupGoals: [],
          selectedRoleNames: [],
          groupMembers: [],
          invites: [],
          unready: true

        }

        this.retrieveData = this.retrieveData.bind(this)
        this.formChangeHandler = this.formChangeHandler.bind(this)
        this.editGroup = this.editGroup.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.deleteGroup = this.deleteGroup.bind(this)
        this.optionClicked = this.optionClicked.bind(this)
        this.finishGroupSave = this.finishGroupSave.bind(this)

        this.searchItems = this.searchItems.bind(this)
        this.searchItemClicked = this.searchItemClicked.bind(this)
        this.renderTags = this.renderTags.bind(this)
        this.removeTag = this.removeTag.bind(this)
        this.addItem = this.addItem.bind(this)
        this.itemClicked = this.itemClicked.bind(this)

    }

    componentDidMount() {

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in commonEditGroup')

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
        console.log('t0 will update')
        this.retrieveData()
      } else if (this.props.selectedGroup !== prevProps.selectedGroup) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in commonEditGroup')

        const accountCode = this.props.accountCode

        const emailId = await AsyncStorage.getItem('email');
        const username = await AsyncStorage.getItem('username');
        const cuFirstName = await AsyncStorage.getItem('firstName');
        const cuLastName = await AsyncStorage.getItem('lastName');
        const pictureURL = await AsyncStorage.getItem('pictureURL');
        const activeOrg = await AsyncStorage.getItem('activeOrg');
        const orgFocus = await AsyncStorage.getItem('orgFocus');
        const orgName = await AsyncStorage.getItem('orgName');

        const categoryOptions = ['','Location','Age','Interests','Skills & Abilities','Values','Career Goals','Tech Trends','Societal Problems','Employers','Popular Career Areas','Organizations']
        const accessTypeOptions = ['','Open','Request']

        let _id = null
        let groupPictureURL = null
        let groupName = null
        let groupCategory = null
        let groupPathway = null
        let groupDescription = null
        let featured = null
        let isActive = true
        let groupAccessType = null
        let selectedRoleNames = []
        let groupMembers = []
        let groupGoals = []
        let meetingMethod = null
        let meetingLocation = null
        let meetingStartTime = null
        let meetingEndTime = null
        let meetingRepeats = 'Every Week'
        let invites =  []

        let selectedGroup = null

        if (this.props.selectedGroup) {
          console.log('passed selectedGroup')

          _id = this.props.selectedGroup._id
          groupPictureURL = this.props.selectedGroup.pictureURL
          groupName = this.props.selectedGroup.name
          groupCategory = this.props.selectedGroup.category
          groupPathway = this.props.selectedGroup.pathway
          groupDescription = this.props.selectedGroup.description
          featured = this.props.selectedGroup.featured
          isActive = this.props.selectedGroup.isActive
          groupAccessType = this.props.selectedGroup.accessType
          selectedRoleNames = this.props.selectedGroup.roleNamesToAccess
          groupMembers = this.props.selectedGroup.members
          groupGoals = this.props.selectedGroup.groupGoals
          meetingMethod = this.props.selectedGroup.meetingMethod
          meetingLocation = this.props.selectedGroup.meetingLocation
          if (this.props.selectedGroup.meetingStartTime) {
            meetingStartTime = convertDateToString(new Date(this.props.selectedGroup.meetingStartTime),"hyphenatedDateTime")
          }
          if (this.props.selectedGroup.meetingEndTime) {
            meetingEndTime = convertDateToString(new Date(this.props.selectedGroup.meetingEndTime),"hyphenatedDateTime")
          }
          console.log('show meeting times: ', meetingStartTime,meetingEndTime)

          meetingRepeats = this.props.selectedGroup.meetingRepeats
          invites = this.props.selectedGroup.invites
0
          selectedGroup = this.props.selectedGroup
        }

        groupCategory = 'Accountability'
        groupAccessType = 'Request'
        selectedRoleNames = ['Career-Seeker']

        this.setState({
          pictureURL, emailId, username, cuFirstName, cuLastName, activeOrg, orgFocus, orgName, accountCode,
          categoryOptions, accessTypeOptions,
          _id, groupPictureURL, groupName, groupCategory, groupPathway, groupDescription, featured, isActive,
          groupGoals, meetingMethod, meetingLocation, meetingStartTime, meetingEndTime, meetingRepeats, invites,
          groupAccessType, selectedRoleNames, groupMembers, selectedGroup
        })

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
        .then((response) => {
          console.log('Org info query attempted one');

          if (response.data.success) {
            console.log('org info query worked')

            const orgContactEmail = response.data.orgInfo.contactEmail
            const placementPartners = response.data.orgInfo.placementPartners

            this.setState({ orgContactEmail, placementPartners });

          } else {
            console.log('org info query did not work', response.data.message)
          }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
        });

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    formChangeHandler = (eventName,eventValue, dateEvent, changeDateTime, mode) => {
      console.log('formChangeHandler called')

      if (eventValue && !dateEvent) {
        this.setState({ selectedValue: eventValue })
      }

      if (dateEvent && Platform.OS === 'android') {
        console.log('in dateEvent', dateEvent, this.state.mode)
        //{"nativeEvent": {}, "type": "dismissed"}
        // {"nativeEvent": {"timestamp": 2022-01-15T23:17:05.451Z}, "type": "set"}
        if (this.state.mode === 'datetime') {
          if (eventValue) {
            eventValue = convertDateToString(new Date(eventValue),'hyphenatedDate')
            if (this.state[eventName] && this.state[eventName].split("T")) {
              eventValue = eventValue + "T" + this.state[eventName].split("T")[1]
            }
            this.setState({ [eventName]: eventValue,  selectedValue: eventValue, textFormHasChanged: true, showDateTimePicker: false, modalIsOpen: false })
          } else {
            this.setState({ showDateTimePicker: false, modalIsOpen: false })
          }
        } else if (this.state.mode === 'time') {
          if (eventValue) {

            eventValue = convertDateToString(new Date(eventValue),'hyphenatedDateTime')
            eventValue = eventValue.split("T")[1]
            console.log('is this working? ', eventValue, eventName, this.state[eventName])
            if (this.state[eventName] && this.state[eventName].split("T")) {
              eventValue = this.state[eventName].split("T")[0] + "T" + eventValue

            }
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
      } else if (eventName === 'groupCoverImage') {

        const options = {
          selectionLimit: 1,
          mediaType: 'photo',
          includeBase64: false,
        };

        // const launch = async () => {
        //   const result = await launchImageLibrary(options?);
        //   console.log('show result: ', result)
        // }
        //
        // launch()
        const self = this
        function pickedImage(callbackObject) {
          console.log('callback called, ', callbackObject)

          if (callbackObject && callbackObject.assets && callbackObject.assets[0]) {
            const file = callbackObject.assets[0]
            const mbLimit = 10
            if (file.fileSize > mbLimit * 1024 * 1024) {
              console.log('file is too big')

              const errorMessage = 'File must be less than ' + mbLimit + 'MB. This file is ' + (file.fileSize / (1024 * 1024)).toFixed() + 'MB'
              self.setState({ serverSuccessProfilePic: false, serverErrorMessageProfilePic: errorMessage })

            } else {
              console.log('file is small enough')

              self.setState({ groupImageFile: file, groupCoverImage: file.uri, saveGroupImage: true })
              // let reader = new FileReader();
              // reader.onload = (e) => {
              //     self.setState({ profilePicImage: file.uri });
              //     console.log('how do i access the image', e.target.result)
              // };
              // reader.readAsDataURL(file);
              // // this.setState({ profilePicFile: event.target.files[0], profilePicHasChanged: true })
              // self.saveFile(eventName, file)
            }
          }
        }
        launchImageLibrary(options,pickedImage);
        // if (event.target.files[0]) {
        //   let reader = new FileReader();
        //   reader.onload = (e) => {
        //       this.setState({ groupCoverImage: e.target.result, saveGroupImage: true });
        //       console.log('how do i access the image', e.target.result)
        //   };
        //   reader.readAsDataURL(event.target.files[0]);
        //   this.setState({ groupImageFile: event.target.files[0] })
        //   // this.setState({ profilePicFile: event.target.files[0], profilePicHasChanged: true })
        //   // this.saveFile(eventName, event.target.files[0])
        // }
      } else if (eventName === 'searchMembers') {
        this.searchItems(eventValue,'member')

      } else if (changeDateTime) {
        if (mode === 'date') {
          console.log('view date 1: ', eventValue)
          eventValue = convertDateToString(new Date(eventValue),'hyphenatedDate')
          console.log('view date 2: ', eventValue)
          this.setState({ [eventName]: eventValue })
        } else if (mode === 'datetime') {
          //date component
          console.log('show eventValue 1: ', eventValue)
          const timeDifference = new Date(eventValue).getTimezoneOffset() / 60
          let adjustedDate = new Date(eventValue)
          adjustedDate.setHours(adjustedDate.getHours() + timeDifference);

          eventValue = convertDateToString(adjustedDate,'hyphenatedDateTime')
          console.log('show eventValue 2: ', adjustedDate, eventValue)
          this.setState({ [eventName]: eventValue })
        }
      } else {
        this.setState({ [eventName]: eventValue })
      }
    }

    searchItems(searchString, type) {
      console.log('searchItems called', searchString, type)

      if (type === 'member') {
        if (!searchString || searchString === '') {
          this.setState({ searchString, searchIsAnimating: false, careerOptions: null })
        } else {
          this.setState({ searchString, searchIsAnimating: true })

          const excludeCurrentUser = true
          const emailId = this.state.emailId
          const orgCode = this.state.activeOrg
          let roleNames = ['Student','Career-Seeker']
          if (this.props.fromAdviso) {
            roleNames = ['Student','Career-Seeker','Mentor','Employer']
          }

          const self = this
          function officiallyFilter() {
            console.log('officiallyFilter called')

            Axios.get('https://www.guidedcompass.com/api/members/search', {  params: {searchString, excludeCurrentUser, emailId, roleNames, orgCode }})
            .then((response) => {
              console.log('Careers query attempted');

                if (response.data.success) {
                  console.log('successfully retrieved careers')

                  if (response.data) {

                    let memberOptions = []
                    if (response.data.members && response.data.members.length > 0) {
                      memberOptions = response.data.members
                    }

                    self.setState({ memberOptions, searchIsAnimating: false })
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
    }

    searchItemClicked(passedItem, type) {
      console.log('searchItemClicked called', passedItem, type)

      if (type === 'member') {

        const searchObject = passedItem
        const searchString = passedItem.firstName + ' ' + passedItem.lastName
        const unready = false
        const memberOptions = null

        this.setState({ searchObject, searchString, unready, memberOptions })

      }
    }

    renderTags(type) {
      console.log('renderTags ', type)

      if (type === 'member' || type === 'invite') {
        let items = []
        if (type === 'member') {
          items = this.state.groupMembers
        } else if (type === 'invite') {
          items = this.state.invites
        }

        if (items && items.length > 0) {

          return (
            <View key={"items"}>
              <View style={styles.spacer} />

              <View style={[styles.rowDirection,styles.flexWrap]}>
                {items.map((value, optionIndex) =>
                  <View key={"items|" + optionIndex}>

                    <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                      <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                        <Image source={deniedIcon} style={[styles.square20,styles.contain]} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.rightPadding5]}>
                      <View style={[styles.halfSpacer]} />
                      <View style={(value.roleName === 'Mentor' || value.roleName === 'Employer') ? [styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.transparent,styles.errorBackgroundColor,styles.topMargin5] : [styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.transparent,styles.lightBackground,styles.topMargin5]}>
                        <Text style={[styles.descriptionText2]}>{value.firstName} {value.lastName}</Text>
                        <Text style={[styles.descriptionText5]}>({value.email})</Text>
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

      if (type === 'member') {
        let groupMembers = this.state.groupMembers
        groupMembers.splice(index, 1)
        this.setState({ groupMembers })
      } else if (type === 'invite') {
        let invites = this.state.invites
        invites.splice(index, 1)
        this.setState({ invites })
      }
    }

    addItem(type) {
      console.log('addItem called', type)

      if (type === 'member') {
        if (this.state.groupMembers.some(member => member.email === this.state.searchObject.email)) {
          this.setState({ errorMessage: 'You have already added this member'})
        } else {

          const searchString = ''
          const searchObject = null
          const unready = true

          let groupMembers = this.state.groupMembers
          groupMembers.unshift(this.state.searchObject)
          this.setState({ searchString, searchObject, unready, groupMembers, errorMessage: null })

        }
      } else if (type === 'invite') {
        if (this.state.invites.some(invite => invite.email === this.state.searchObject.email)) {
          this.setState({ errorMessage: 'You have already added this invite'})
        } else {

          const searchString = ''
          const searchObject = null
          const unready = true

          let invites = this.state.invites

          let tempObject = this.state.searchObject
          tempObject['read'] = false
          invites.unshift(tempObject)
          this.setState({ searchString, searchObject, unready, invites, errorMessage: null })
        }
      }
    }

    itemClicked(item, type) {
      console.log('itemClicked called', item, type)

      let groupGoals = this.state.groupGoals
      if (groupGoals.includes(item)) {
        const index = groupGoals.indexOf(item)
        groupGoals.splice(index,1)
      } else {
        groupGoals.push(item)
      }

      this.setState({ groupGoals })

    }

    closeModal() {
      console.log('closeModal called')

      this.setState({ modalIsOpen: false, showPicker: false, showDateTimePicker: false })

    }

    deleteGroup() {
      console.log('deleteGroup called')

      this.setState({ isSaving: true, errorMessage: null, successMessage: null })

      const _id = this.state.selectedGroup._id

      Axios.delete('https://www.guidedcompass.com/api/groups/' + _id)
      .then((response) => {
        console.log('tried to  delete', response.data)
        if (response.data.success) {
          //save values
          console.log('Group delete worked');

          this.setState({ successMessage: response.data.message, confirmDelete: false, isSaving: false })
          if (this.props.fromAdvisor) {
            this.props.navigation.navigate('Groups')
          } else if (this.props.fromWalkthrough) {
            this.props.passGroup(this.state.selectedGroup, false)
          } else {
            this.props.navigation.navigate('Community')
          }

        } else {
          console.error('there was an error deleting the group');
          this.setState({ errorMessage: response.data.message, isSaving: false })
        }
      }).catch((error) => {
          console.log('The deleting did not work', error);
          this.setState({ errorMessage: error, isSaving: false })
      });
    }

    editGroup() {
      console.log('editGroup called')

      this.setState({ isSaving: true, errorMessage: null, successMessage: null })

      if (!this.state.groupName || this.state.groupName === '') {
        this.setState({ errorMessage: 'please add a group name', isSaving: false })
      } else if (!this.state.groupCategory || this.state.groupCategory === '') {
        this.setState({ errorMessage: 'please add a group category', isSaving: false })
      } else if (!this.state.groupDescription || this.state.groupDescription === '') {
        this.setState({ errorMessage: 'please add a group description', isSaving: false })
      } else if (!this.state.groupAccessType || this.state.groupAccessType === '') {
        this.setState({ errorMessage: 'please add an access type', isSaving: false })
      } else if (!this.state.selectedRoleNames || this.state.selectedRoleNames.length === 0) {
        this.setState({ errorMessage: 'please add at least one role name', isSaving: false })
      } else if (this.state.groupCategory === 'Accountability' && (!this.state.meetingRepeats || this.state.meetingRepeats === '')) {
        this.setState({ errorMessage: 'please add a meeting repeat frequency', isSaving: false })
      } else if (this.state.groupCategory === 'Accountability' && (!this.state.meetingMethod || this.state.meetingMethod === '')) {
        this.setState({ errorMessage: 'please add a primary meeting method', isSaving: false })
      } else if (this.state.groupCategory === 'Accountability' && (!this.state.meetingLocation || this.state.meetingLocation === '')) {
        this.setState({ errorMessage: 'please add a primary meeting location', isSaving: false })
      } else if (this.state.groupCategory === 'Accountability' && (!this.state.meetingStartTime || this.state.meetingStartTime === '')) {
        this.setState({ errorMessage: 'please add a meeting start time', isSaving: false })
      } else if (this.state.groupCategory === 'Accountability' && (!this.state.meetingEndTime || this.state.meetingEndTime === '')) {
        this.setState({ errorMessage: 'please add a meeting end time', isSaving: false })
      } else {
        console.log('about to save')
        let _id = this.state._id
        if (!_id) {
          _id = null
        }
        // const pictureURL = this.state.groupCoverImage
        const name = this.state.groupName
        const category = this.state.groupCategory
        const pathway = this.state.groupPathway
        const description = this.state.groupDescription
        const featured = this.state.featured
        const isActive = this.state.isActive
        const accessType = this.state.groupAccessType
        const roleNamesToAccess = this.state.selectedRoleNames
        let members = this.state.groupMembers
        let memberCount = 1
        if (!this.props.selectedGroup && category === 'Accountability') {
          members = [{ pictureURL: this.state.pictureURL, firstName: this.state.cuFirstName, lastName: this.state.cuLastName, email: this.state.emailId, username: this.state.username }]
          memberCount = members.length
        }

        const groupGoals = this.state.groupGoals
        const meetingMethod = this.state.meetingMethod
        const meetingLocation = this.state.meetingLocation
        const meetingStartTime = this.state.meetingStartTime
        const meetingEndTime = this.state.meetingEndTime
        const meetingRepeats = this.state.meetingRepeats
        const invites = this.state.invites

        // const userTypes = []
        // const keyInfo = []
        // const roleNamesToAccess = []
        const admins = [{ pictureURL: this.state.pictureURL, firstName: this.state.cuFirstName, lastName: this.state.cuLastName, email: this.state.emailId, username: this.state.username }]
        const creatorFirstName = this.state.cuFirstName
        const creatorLastName = this.state.cuLastName
        const creatorEmail = this.state.emailId

        const orgCode = this.state.activeOrg
        const orgName = this.state.orgName
        const orgContactEmail = this.state.orgContactEmail
        const placementPartners = this.state.placementPartners

        const accountCode = this.state.accountCode

        const createdAt = new Date()
        const updatedAt = new Date()

        let saveNewGroup = true
        if (_id) {
          saveNewGroup = false
        }
        console.log('show stuff: ', _id, meetingStartTime, meetingEndTime)
        let posting = {
          _id, name, category, pathway, description, featured, isActive, accessType, roleNamesToAccess, members, memberCount,
          admins, creatorFirstName, creatorLastName, creatorEmail,
          groupGoals, meetingMethod, meetingLocation, meetingStartTime, meetingEndTime, meetingRepeats, invites,
          orgCode, orgName, orgContactEmail, placementPartners, accountCode,
          createdAt, updatedAt, saveNewGroup
        }

        Axios.post('https://www.guidedcompass.com/api/groups', posting)
        .then((response) => {
          console.log('attempted to save group')
          if (response.data.success) {
            //save values
            console.log('Group save worked', response.data);

            const successMessage = response.data.message

            if (this.state.saveGroupImage) {
              // save groupImage

              let groupId = _id
              if (!groupId) {
                groupId = response.data._id
              }

              // pull id if no id
              if (!groupId) {

                Axios.get('https://www.guidedcompass.com/api/groups/byid', { params: { name } })
                .then((response) => {
                  console.log('Group name query attempted one', response.data);

                  if (response.data.success) {
                    console.log('group name query worked')

                    const groupId = response.data.group._id

                    this.finishGroupSave(groupId, saveNewGroup, posting)

                  } else {
                    console.log('group name query did not work', response.data.message)
                    this.finishGroupSave(groupId, saveNewGroup, posting)
                  }

                }).catch((error) => {
                    console.log('Group name query did not work for some reason', error);
                    this.finishGroupSave(groupId, saveNewGroup, posting)
                });
              } else {
                this.finishGroupSave(groupId, saveNewGroup, posting)
              }

            } else {
              if (_id) {
                this.setState({ successMessage, isSaving: false })
              } else {

                this.setState({ successMessage, isSaving: false, groupName: '', groupCategory: '',
                groupDescription: '', groupAccessType: '', selectedRoleNames: [], groupMembers: []
                })

                this.props.closeModal()
                if (this.props.fromAdvisor) {
                  this.props.navigation.navigate('GroupDetails', { selectedGroup: posting })
                } else if (this.props.fromWalkthrough) {
                  posting['_id'] = response.data._id
                  this.props.passGroup(posting, true)
                } else {
                  posting['_id'] = response.data._id
                  this.props.navigation.navigate('GroupDetails', { selectedGroup: posting })
                }
              }
            }

          } else {
            console.error('there was an error creating the group', response.data.message);
            this.setState({ errorMessage: response.data.message, isSaving: false })

          }
        }).catch((error) => {
            console.log('there was an error creating the group', error);
            this.setState({ errorMessage: 'There was an error creating the group', isSaving: false })
        });
      }
    }

    finishGroupSave(groupId, saveNewGroup, group) {
      console.log('finishGroupSave called', groupId, saveNewGroup, group)

      const fileCategory = 'groupImage'
      const passedFile = this.state.groupImageFile

      // const emailId = this.state.emailId
      const fileName = passedFile.fileName
      let originalName = fileCategory + '|' + groupId + '|' + fileName + '|' + new Date()

      passedFile['name'] = originalName
      passedFile['size'] = passedFile.fileSize
      passedFile['uri'] = passedFile.uri
      if (Platform.OS === 'ios') {
        passedFile['uri'] = passedFile.uri.replace('file://', '')
      }

      let fileData = new FormData();
      // const fileName = 'profileImage'
      // const fileName = 'newFile'
      console.log('saved file: ', originalName)
      fileData.append('baseFileName', passedFile, originalName)

      fetch("https://www.guidedcompass.com/api/file-upload", {
          mode: 'no-cors',
          method: "POST",
          body: fileData
      }).then(function (res) {
        console.log('what is the file response');
        if (res.ok) {
          console.log('success on save')
          if (fileCategory === 'groupImage') {
            if (!saveNewGroup) {
              this.setState({ successMessage: 'Group created successfully', isSaving: false, groupPicFile: passedFile })
            } else {
              this.setState({ successMessage: 'Group created successfully', isSaving: false,
                groupName: '', groupCategory: '', groupDescription: '', groupAccessType: '', selectedRoleNames: [], groupPicFile: passedFile
              })
            }
          }

          const self = this

          res.json()
          .then(function(data) {
            console.log('show data: ', data)
            let newFilePath = data.filePath
            console.log('show filePath: ', newFilePath)

            let existingFilePath = null
            if (fileCategory === 'groupImage') {
              if (self.state.groupPictureURL) {
                existingFilePath = self.state.groupPictureURL
              }
            }

            // remove existing file
            if (existingFilePath && !self.state.allowMultipleFiles) {
              const deleteArray = existingFilePath.split("amazonaws.com/")
              console.log('show deleteArrary: ', deleteArray)
              const deleteKey = deleteArray[1].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
              console.log('show deleteKey: ', deleteKey)

              Axios.put('https://www.guidedcompass.com/api/file', { deleteKey })
              .then((response) => {
                console.log('tried to delete', response.data)
                if (response.data.success) {
                  //save values
                  console.log('File delete worked');

                  if (fileCategory === 'groupImage') {
                    self.setState({ successMessage: 'File was saved successfully',
                      groupPicPath: newFilePath, groupPictureURL: newFilePath,
                      isSaving: false, groupName: '', groupCategory: '', groupDescription: '',
                      groupAccessType: '', selectedRoleNames: [], groupMembers: []
                    })
                    self.props.closeModal()
                    if (self.props.fromAdvisor) {
                      self.props.navigation.navigate('GroupDetails', { selectedGroup: group })
                    } else if (self.props.fromWalkthrough) {
                      group['_id'] = groupId
                      self.props.passGroup(group, true)
                    } else {
                      self.props.navigation.navigate('GroupDetails', { selectedGroup: group })
                    }
                  }

                } else {
                  console.error('there was an error saving the file');

                  self.setState({ isSaving: false, groupName: '', groupCategory: '', groupDescription: '',
                  groupAccessType: '', selectedRoleNames: [], groupMembers: [], errorMessage: response.data.message
                  })
                  self.props.closeModal()
                  if (self.props.fromAdvisor) {
                    self.props.navigation.navigate('GroupDetails', { selectedGroup: group })
                  } else if (self.props.fromWalkthrough) {
                    group['_id'] = groupId
                    self.props.passGroup(group, true)
                  } else {
                    self.props.navigation.navigate('GroupDetails', { selectedGroup: group })
                  }
                }
              }).catch((error) => {
                  console.log('The saving did not work', error);
                  // self.setState({ errorMessage: error })

                  self.setState({ isSaving: false, groupName: '', groupCategory: '',
                    groupDescription: '', groupAccessType: '', selectedRoleNames: [], groupMembers: [],
                    errorMessage: error
                  })
                  self.props.closeModal()
                  if (self.props.fromAdvisor) {
                    self.props.navigation.navigate('GroupDetails', { selectedGroup: group })
                  } else if (self.props.fromWalkthrough) {
                    group['_id'] = groupId
                    self.props.passGroup(group, true)
                  } else {
                    self.props.navigation.navigate('GroupDetails', { selectedGroup: group })
                  }
              });
            } else {
              self.setState({ isSaving: false, groupName: '', groupCategory: '', groupDescription: '',
              groupAccessType: '', selectedRoleNames: [], groupMembers: [], errorMessage: 'Successfully created a group'
              })
              self.props.closeModal()
              if (self.props.fromAdvisor) {
                self.props.navigation.navigate('GroupDetails', { selectedGroup: group })
              } else if (self.props.fromWalkthrough) {
                group['_id'] = groupId
                self.props.passGroup(group, true)
              } else {
                self.props.navigation.navigate('GroupDetails', { selectedGroup: group })
              }
            }
          })

        } else if (res.status === 401) {
          //unauthorized
          if (groupId) {
            this.setState({ successMessage: 'Group created successfully', isSaving: false })
          } else {
            this.setState({ successMessage: 'Group created successfully', isSaving: false,
              groupName: '', groupCategory: '', groupDescription: '', groupAccessType: '', selectedRoleNames: []
            })
            this.props.closeModal()
            if (self.props.fromAdvisor) {
              self.props.navigation.navigate('GroupDetails', { selectedGroup: group })
            } else if (self.props.fromWalkthrough) {
              group['_id'] = groupId
              self.props.passGroup(group, true)
            } else {
              self.props.navigation.navigate('GroupDetails', { selectedGroup: group })
            }
          }
        }
      }.bind(this), function (e) {
        //there was an error
        if (groupId) {
          this.setState({ successMessage: 'Group created successfully', isSaving: false })
        } else {
          this.setState({ successMessage: 'Group created successfully', isSaving: false,
            groupName: '', groupCategory: '', groupDescription: '', groupAccessType: '', selectedRoleNames: []
          })
          this.props.closeModal()
          if (this.props.fromAdvisor) {
            this.props.navigation.navigate('GroupDetails', { selectedGroup: group })
          } else if (this.props.fromWalkthrough) {
            group['_id'] = groupId
            this.props.passGroup(group, true)
          } else {
            this.props.navigation.navigate('GroupDetails', { selectedGroup: group })
          }
        }
      }.bind(this));
    }

    optionClicked(value, index) {
      console.log('optionClicked called')

      let selectedRoleNames = this.state.selectedRoleNames
      if (selectedRoleNames && selectedRoleNames.length > 0) {

        if (selectedRoleNames.includes(value)) {

          const removeIndex = selectedRoleNames.indexOf(value)
          selectedRoleNames.splice(removeIndex, 1)

        } else {
          selectedRoleNames.push(value)
        }
      } else {
        selectedRoleNames.push(value)
      }

      this.setState({ selectedRoleNames })

    }

    render() {

      return (
          <ScrollView>
            <View key="addOrgGroup" style={[styles.calcColumn80]}>
                {(this.props.fromAdvisor) ? (
                  <View>
                    {(this.state.selectedGroup) ? (
                      <Text style={[styles.headingText2,styles.bottomPadding]}>Edit {this.state.selectedGroup.name}</Text>
                    ) : (
                      <View>
                        {(this.state.orgName) ? (
                          <Text style={[styles.headingText2,styles.bottomPadding]}>Add a Group to {this.state.orgName}</Text>
                        ) : (
                          <Text style={[styles.headingText2,styles.bottomPadding]}>Create a Group</Text>
                        )}
                      </View>
                    )}

                    <View style={styles.spacer} /><View style={styles.spacer} />
                  </View>
                ) : (
                  <View style={(this.props.modalIsOpen) ? [styles.rowDirection] : []}>
                    <View style={(this.props.modalIsOpen) ? [styles.calcColumn110] : []}>
                      <Text style={[styles.headingText2,styles.bottomPadding]}>Create an Acccountability Group</Text>
                      <Text style={[styles.topPadding]}>An accountability group is a small group of like-minded people (6 max) who meet regularly to support each other toward reaching their goals.</Text>
                      <View style={styles.spacer} /><View style={styles.spacer} />
                    </View>
                    {(this.props.modalIsOpen) ? (
                      <View style={[styles.topMargin]}>
                        <TouchableOpacity onPress={() => this.props.closeModal()}>
                          <Image source={{ uri: closeIcon }} style={[styles.square20,styles.leftMargin]} />
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View />
                    )}
                  </View>
                )}

                {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

               {(this.state.isSaving) ? (
                 <View style={[styles.flex1,styles.flexCenter]}>
                   <View>
                     <View style={[styles.superSpacer]} />

                     <ActivityIndicator
                        animating = {this.state.isSaving}
                        color = '#87CEFA'
                        size = "large"
                        style={styles.square80, styles.centerHorizontally}/>
                     <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                     <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                   </View>
                 </View>
               ) : (
                 <View>
                   <View style={[styles.row15]}>
                     <View>
                       <View style={styles.spacer} />
                       <View>
                         <Text style={[styles.headingText6]}>Group Cover Image</Text>
                         <View style={styles.spacer} />
                       </View>

                       <View style={styles.relativePosition}>
                         <TouchableOpacity onPress={() => this.formChangeHandler("groupCoverImage",null)} style={[styles.rowDirection,styles.centerHorizontally]}>
                           <Image source={ this.state.groupCoverImage ? ( { uri: this.state.groupCoverImage} )
                             : this.state.groupPictureURL ? ( { uri: this.state.groupPictureURL} )
                             : ( { uri: imageIcon})}
                           style={(this.state.groupCoverImage || this.state.groupPictureURL) ? [styles.square150,styles.contain,styles.centerItem,{ borderRadius: (150/2)}] : [styles.square150,styles.contain,styles.centerItem]}/>
                           {(this.state.groupCoverImage || this.state.groupPictureURL) && (
                             <View style={[styles.absolutePosition,styles.justifyEnd, styles.absoluteBottom0, styles.absoluteRight0]}>
                               <View style={[styles.marginTopNegative40,styles.padding10,styles.square40,styles.whiteBackground,{ borderRadius: (20)}]}>
                                 <Image source={{ uri: addIcon}} style={[styles.square18,styles.contain,styles.centerItem]}/>
                               </View>
                             </View>
                           )}
                         </TouchableOpacity>
                         {/*<input type="file" id="profilePic" name="profilePic" onChange={this.formChangeHandler} accept="image/*" />*/}
                       </View>

                       <View style={styles.spacer} />
                       <Text style={[styles.descriptionTextColor]}>Dimensions: 600 x 360</Text>

                       { (this.state.serverPostSuccess) ? (
                         <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessage}</Text>
                       ) : (
                         <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>
                       )}
                     </View>
                   </View>

                   <View style={[styles.row15]}>
                     <View style={[styles.row10]}>
                       <Text style={[styles.headingText6]}>Group Name<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                       <View style={styles.spacer} />
                       <TextInput
                         style={styles.textInput}
                         onChangeText={(text) => this.formChangeHandler("groupName", text)}
                         value={this.state.groupName}
                         placeholder="Add group name..."
                         placeholderTextColor="grey"
                       />
                     </View>
                     {/*
                     {(this.props.fromAdvisor) && (
                       <View>
                         <View style={[styles.row10]}>
                           <Text style={[styles.headingText6]}>Group Category<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                           <View style={styles.spacer} />
                           <Picker
                             selectedValue={this.state.groupCategory}
                             onValueChange={(itemValue, itemIndex) =>
                               this.formChangeHandler("groupCategory",itemValue)
                             }>
                             {this.state.categoryOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                           </Picker>
                         </View>
                       </View>
                     )}*/}
                   </View>

                   <View style={[styles.row15]}>
                     <Text style={[styles.headingText6]}>Group Description<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                     <View style={styles.spacer} />
                     <TextInput
                       style={styles.textArea}
                       onChangeText={(text) => this.formChangeHandler("groupDescription", text)}
                       value={this.state.groupDescription}
                       placeholder="Add description..."
                       placeholderTextColor="grey"
                       multiline={true}
                       numberOfLines={4}
                     />
                   </View>

                   {(this.state.groupCategory === 'Accountability') && (
                     <View>
                       <View style={[styles.row15]}>
                         <Text style={[styles.headingText6]}>Tag the Relevant Goals of this Group</Text>
                         <View style={styles.spacer} />

                         <View style={[styles.rowDirection,styles.flexWrap]}>
                           {this.state.goalTypeOptions.map((value, optionIndex) =>
                             <View key={"items|" + optionIndex}>
                               <TouchableOpacity onPress={() => this.itemClicked(value,'goal')}>
                                 <View style={[styles.rightPadding5]}>
                                    {(this.state.groupGoals && this.state.groupGoals.includes(value)) ? (
                                      <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.standardBorder,styles.topMargin5,styles.ctaBackgroundColor]}>
                                        <Text style={[styles.standardText,styles.whiteColor]}>{value}</Text>
                                      </View>
                                    ) : (
                                      <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.standardBorder,styles.topMargin5,styles.lightBackground]}>
                                        <Text style={[styles.standardText]}>{value}</Text>
                                      </View>
                                    )}
                                 </View>
                               </TouchableOpacity>
                             </View>
                           )}

                         </View>

                       </View>

                       <View style={[styles.row15]}>
                         <Text style={[styles.headingText6]}>Meetings</Text>
                         <View style={styles.spacer} />

                         <View style={[styles.row5]}>
                           <View style={[styles.row10]}>
                             <Text style={[styles.row10]}>Repeats<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                             {(Platform.OS === 'ios') ? (
                               <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: "Repeats", selectedIndex: null, selectedName: "meetingRepeats", selectedValue: this.state.meetingRepeats, selectedOptions: this.state.repeatOptions, selectedSubKey: null })}>
                                 <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                   <View style={[styles.calcColumn140]}>
                                     <Text style={[styles.descriptionText1]}>{this.state.meetingRepeats}</Text>
                                   </View>
                                   <View style={[styles.width20,styles.topMargin5]}>
                                     <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                   </View>
                                 </View>
                               </TouchableOpacity>
                             ) : (
                               <View style={[styles.standardBorder]}>
                                 <Picker
                                   selectedValue={this.state.meetingRepeats}
                                   onValueChange={(itemValue, itemIndex) =>
                                     this.formChangeHandler("meetingRepeats",itemValue)
                                   }>
                                   {this.state.repeatOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                 </Picker>
                               </View>
                             )}

                           </View>

                         </View>

                         <View style={[styles.row5]}>
                           <View style={[styles.row10]}>
                             <Text style={[styles.row10]}>{this.state.logType} Method<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>

                             {(Platform.OS === 'ios') ? (
                               <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: "Meeting Method", selectedIndex: null, selectedName: "meetingMethod", selectedValue: this.state.meetingMethod, selectedOptions: this.state.meetingMethodOptions, selectedSubKey: null })}>
                                 <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                   <View style={[styles.calcColumn140]}>
                                     <Text style={[styles.descriptionText1]}>{this.state.meetingMethod}</Text>
                                   </View>
                                   <View style={[styles.width20,styles.topMargin5]}>
                                     <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                   </View>
                                 </View>
                               </TouchableOpacity>
                             ) : (
                               <View style={[styles.standardBorder]}>
                                 <Picker
                                   selectedValue={this.state.meetingMethod}
                                   onValueChange={(itemValue, itemIndex) =>
                                     this.formChangeHandler("meetingMethod",itemValue)
                                   }>
                                    {this.state.meetingMethodOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                 </Picker>
                               </View>
                             )}

                           </View>

                           <View style={[styles.row10]}>
                             <Text style={[styles.row10]}>{(this.state.meetingMethod === "In Person") ? "Location" : "Meeting Link"}<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                             <TextInput
                               style={styles.textInput}
                               onChangeText={(text) => this.formChangeHandler("meetingLocation", text)}
                               value={this.state.meetingLocation}
                               placeholder={(this.state.meetingMethod === "In Person") ? "Address..." : "Http..."}
                               placeholderTextColor="grey"
                             />
                             {(this.state.meetingMethod === "Remote") && this.state.meetingLocation && this.state.meetingLocation !== '' && !this.state.meetingLocation.startsWith('http') && (
                               <View style={[styles.topPadding5]}>
                                 <Text style={[styles.errorColor,styles.descriptionText2]}>Please add a valid link that starts with http</Text>
                               </View>
                             )}
                           </View>


                         </View>

                         <View style={[styles.row5]}>
                           <View style={[styles.row10]}>
                             {(Platform.OS === 'ios') ? (
                               <View style={[styles.rowDirection]}>
                                 <View style={[styles.calcColumn260]}>
                                   <Text style={[styles.row10]}>Starts<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                 </View>
                                 <View style={[styles.width200,styles.topPadding5]}>
                                   <DateTimePicker
                                     testID={"1"}
                                     value={(this.state.meetingStartTime) ? convertStringToDate(this.state.meetingStartTime,'toLocal') : new Date()}
                                     mode={'datetime'}
                                     is24Hour={true}
                                     display="default"
                                     onChange={(e, d) => this.formChangeHandler("meetingStartTime",d,null,true,'datetime')}
                                   />
                                 </View>
                               </View>
                             ) : (
                               <View>
                                 <View style={[styles.row5]}>
                                   <Text style={[styles.row10]}>Starts<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                 </View>
                                 <View style>
                                   <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Meeting Start Time', selectedIndex: null, selectedName: "meetingStartTime", selectedValue: this.state.meetingStartTime, mode: 'datetime' })}>
                                     <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                       <View style={[styles.calcColumn115]}>
                                         <Text style={[styles.descriptionText1]}>{this.state.meetingStartTime}</Text>
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
                           <View style={[styles.row10]}>
                             {(Platform.OS === 'ios') ? (
                               <View style={[styles.rowDirection]}>
                                 <View style={[styles.calcColumn260]}>
                                   <Text style={[styles.row10]}>Ends<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                 </View>
                                 <View style={[styles.width200,styles.topPadding5]}>
                                   <DateTimePicker
                                     testID={"2"}
                                     value={(this.state.meetingEndTime) ? convertStringToDate(this.state.meetingEndTime,'toLocal') : new Date()}
                                     mode={'datetime'}
                                     is24Hour={true}
                                     display="default"
                                     onChange={(e, d) => this.formChangeHandler("meetingEndTime",d,null,true,'datetime')}
                                   />
                                 </View>
                               </View>
                             ) : (
                               <View>
                                 <View style={[styles.row5]}>
                                   <Text style={[styles.row10]}>Ends<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                                 </View>
                                 <View style>
                                   <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDateTimePicker: true, pickerName: 'Meeting End Time', selectedIndex: null, selectedName: "meetingEndTime", selectedValue: this.state.meetingEndTime, mode: 'datetime' })}>
                                     <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                       <View style={[styles.calcColumn115]}>
                                         <Text style={[styles.descriptionText1]}>{this.state.meetingEndTime}</Text>
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

                         </View>
                       </View>
                     </View>
                   )}

                   {(this.props.fromAdvisor) && (
                     <View>
                       <View style={[styles.row15]}>
                         <View style={[styles.row10]}>
                           <Text style={[styles.headingText6]}>Visible?</Text>

                           <View style={styles.spacer} /><View style={[styles.halfSpacer]}/>
                           <Switch
                             onValueChange={(change) => this.setState({ isActive: change, formHasChanged: true })}
                             value={this.state.isActive}
                           />
                         </View>
                         <View style={[styles.row10]}>

                         </View>

                       </View>

                       <View>
                         <View style={[styles.row15]}>
                           <View style={[styles.row10]}>
                             <Text style={[styles.headingText6]}>Access Type<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                             <View style={styles.spacer} />

                             {(Platform.OS === 'ios') ? (
                               <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: "Access Type", selectedIndex: null, selectedName: "groupAccessType", selectedValue: this.state.groupAccessType, selectedOptions: this.state.accessTypeOptions, selectedSubKey: null })}>
                                 <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                   <View style={[styles.calcColumn140]}>
                                     <Text style={[styles.descriptionText1]}>{this.state.groupAccessType}</Text>
                                   </View>
                                   <View style={[styles.width20,styles.topMargin5]}>
                                     <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                   </View>
                                 </View>
                               </TouchableOpacity>
                             ) : (
                               <View style={[styles.standardBorder]}>
                                 <Picker
                                   selectedValue={this.state.groupAccessType}
                                   onValueChange={(itemValue, itemIndex) =>
                                     this.formChangeHandler("groupAccessType",itemValue)
                                   }>
                                   {this.state.accessTypeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                                 </Picker>
                               </View>
                             )}
                           </View>

                         </View>

                         <View style={[styles.row15]}>
                           <Text style={[styles.headingText6]}>Roles Who Can Access<Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                           <View style={styles.spacer} />

                           <View style={[styles.rowDirection,styles.flexWrap]}>
                             {this.state.roleNameOptions.map((value, optionIndex) =>
                               <View key={optionIndex}>
                                 <View style={[styles.bottomPadding5,styles.rightPadding]}>
                                   {(this.state.selectedRoleNames.includes(value)) ? (
                                     <TouchableOpacity style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.ctaBackgroundColor,styles.ctaBorder,styles.leftMargin5]} onPress={() => this.optionClicked(value, optionIndex)}>
                                       <View>
                                         <View >
                                           <Text style={[styles.descriptionText2,styles.whiteColor]}>{value}</Text>
                                         </View>
                                       </View>
                                     </TouchableOpacity>
                                   ) : (
                                     <TouchableOpacity style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.ctaBackgroundColor,styles.ctaBorder]} onPress={() => this.optionClicked(value, optionIndex)}>
                                       <View>
                                         <View>
                                           <Text style={[styles.descriptionText2]}>{value}</Text>
                                         </View>
                                       </View>
                                     </TouchableOpacity>
                                   )}
                                 </View>
                               </View>
                             )}
                           </View>

                         </View>
                       </View>

                     </View>
                   )}

                   <View style={[styles.row15]}>
                     <Text style={[styles.headingText6]}>Invite People</Text>
                     <Text style={[styles.descriptionText2,styles.bottomPadding,styles.topPadding5]}>Note: acountablity groups are limited to 6 people</Text>
                    <View style={[styles.spacer]} />
                     <View style={[styles.rowDirection,styles.row10]}>
                        <View style={[styles.calcColumn160]}>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("searchMembers", text)}
                            value={this.state.searchString}
                            placeholder="Search members..."
                            placeholderTextColor="grey"
                          />
                        </View>
                        <View style={[styles.width80,styles.leftPadding]}>
                          <TouchableOpacity style={(this.state.unready) ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter]: [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.unready}  onPress={() => this.addItem('invite')}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
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
                              style={styles.square80, styles.centerHorizontally}/>
                           <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                           <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                         </View>
                       </View>
                     ) : (
                       <View>
                         <View>
                           {(this.state.memberOptions) && (
                             <View style={[styles.card,styles.topMargin]}>
                               {this.state.memberOptions.map((value, optionIndex) =>
                                 <View key={value._id} style={[styles.bottomMargin5,styles.calcColumn140]}>
                                   <TouchableOpacity style={[styles.row5]} onPress={() => this.searchItemClicked(value,'member')}>
                                     <View style={[styles.rowDirection]}>
                                       <View style={[styles.width40]}>
                                        <View style={[styles.halfSpacer]} />
                                         <Image source={(value.pictureURL) ? value.pictureURL : profileIconDark} style={[styles.square25,styles.contain, { borderRadius: 12.5 }]} />
                                       </View>
                                       <View style={[styles.calcColumn180]}>
                                         <Text style={[styles.ctaColor]}>{value.firstName} {value.lastName}</Text>
                                         <Text style={[styles.descriptionText3]}>{value.roleName}</Text>
                                       </View>
                                     </View>
                                   </TouchableOpacity>
                                 </View>
                               )}
                             </View>
                           )}
                         </View>

                         <View>

                           {this.renderTags('invite')}


                         </View>

                       </View>
                     )}
                   </View>

                   {(this.state.selectedGroup) && (
                     <View style={[styles.row15]}>
                       <Text style={[styles.headingText6]}>Manage Members</Text>
                       <View style={styles.spacer} />

                       <View>
                         {(this.props.fromAdvisor) && (
                           <View>
                             <View>
                              <View style={[styles.row10]}>
                                <TextInput
                                  style={styles.textInput}
                                  onChangeText={(text) => this.formChangeHandler("searchMembers", text)}
                                  value={this.state.searchString}
                                  placeholder="Search members..."
                                  placeholderTextColor="grey"
                                />
                              </View>
                              <View style={[styles.row10]}>
                                <TouchableOpacity style={(this.state.unready) ? [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.unready}  onPress={() => this.addItem('member')}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
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
                                      style={styles.square80, styles.centerHorizontally}/>
                                   <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                                   <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                                 </View>
                               </View>
                             ) : (
                               <View>
                                 <View>
                                   {(this.state.memberOptions) && (
                                     <View style={[styles.card,styles.topMargin]}>
                                       {this.state.memberOptions.map((value, optionIndex) =>
                                         <View key={value._id} style={[styles.bottomMargin5]}>
                                           <TouchableOpacity style={[styles.row5,styles.calcColumn140]} onPress={() => this.searchItemClicked(value,'member')}>
                                             <View>
                                               <View style={[styles.width40]}>
                                                <View style={[styles.halfSpacer]} />
                                                 <Image source={(value.pictureURL) ? value.pictureURL : profileIconDark} style={[styles.square25,styles.contain, { borderRadius: 12.5 }]} />
                                               </View>
                                               <View style={[styles.calcColumn180]}>
                                                 <Text style={[styles.ctaColor]}>{value.firstName} {value.lastName}</Text>
                                                 <Text style={[styles.descriptionText3]}>{value.roleName}</Text>
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
                         )}

                         <View>
                           {this.renderTags('member')}

                         </View>
                       </View>
                     </View>
                   )}

                   {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}
                   {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}

                   <View style={[styles.row15]}>
                     <View style={styles.spacer} />

                     {(this.state.confirmDelete) ? (
                       <View>
                        <Text style={[styles.bottomMargin,styles.errorColor]}>Are you sure you want to delete this group?</Text>

                        <View style={[styles.rowDirection]}>
                          <TouchableOpacity style={[styles.btnSquarish,styles.errorBackgroundColor,styles.standardBorder,styles.rightMargin,styles.flexCenter]} onPress={() => this.deleteGroup()}><Text style={[styles.descriptionText1,styles.whiteColor]}>Confirm & Delete</Text></TouchableOpacity>
                          <TouchableOpacity style={[styles.btnSquarish,styles.ctaBorder,styles.flexCenter]} onPress={() => this.setState({ confirmDelete: false })}><Text style={[styles.descriptionText1,styles.ctaColor]}>Cancel</Text></TouchableOpacity>
                        </View>

                       </View>
                     ) : (
                       <View>
                        <View style={[styles.rowDirection]}>
                          <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.rightMargin,styles.flexCenter,styles.topMargin]} disabled={this.state.isSaving} onPress={() => this.editGroup()}><Text style={[styles.standardText,styles.whiteColor]}>{(this.state.selectedGroup) ? "Save & Edit Group" : "Save & Add Group"}</Text></TouchableOpacity>
                          <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter,styles.topMargin]} onPress={() => this.props.closeModal()}><Text style={[styles.descriptionText1,styles.ctaColor]}>Close View</Text></TouchableOpacity>
                          {(this.state._id) && (
                            <TouchableOpacity style={[styles.btnPrimary, styles.errorBackgroundColor,styles.flexCenter,styles.topMargin]} onPress={() => this.setState({ confirmDelete: true })}><Text style={[styles.descriptionText1,styles.whiteColor]}>Delete Group</Text></TouchableOpacity>
                          )}
                        </View>
                       </View>
                     )}
                   </View>
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

                {(this.state.showDateTimePicker) && (
                  <View style={[styles.flex1,styles.pinBottom,styles.justifyEnd]}>
                    <View style={[styles.alignCenter]}>
                      <TouchableOpacity onPress={() => this.closeModal()}>

                        <Text style={[styles.standardText,styles.centerText,styles.ctaColor]}>Cancel</Text>
                      </TouchableOpacity>
                    </View>
                    <DateTimePicker
                      testID={this.state.selectedName}
                      value={(this.state.selectedValue) ? convertStringToDate(this.state.selectedValue,'dateOnly') : new Date()}
                      mode={'date'}
                      is24Hour={true}
                      display="default"
                      onChange={(e, d) => this.formChangeHandler(this.state.selectedName,d,e)}
                      minimumDate={this.state.minimumDate}
                      maximumDate={this.state.maximumDate}
                    />
                  </View>
                )}


            </Modal>

          </ScrollView>

      )
    }
}

export default EditGroup
