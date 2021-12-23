import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch } from 'react-native';

import Axios from 'axios';

const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png'
const imageIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/image-icon.png'
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png'
const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/deniedIcon.png'

import {convertDateToString} from '../functions/convertDateToString';

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
      document.body.style.backgroundColor = "#F5F5F5";

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in commonEditGroup', this.props.activeOrg, prevProps)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
        console.log('t0 will update')
        this.retrieveData()
      } else if (this.props.selectedGroup !== prevProps.selectedGroup) {
        this.retrieveData()
      }
    }

    retrieveData() {
      console.log('retrieveData called in commonEditGroup', this.props.selectedGroup)

      const accountCode = this.props.accountCode

      const emailId = localStorage.getItem('email');
      const username = localStorage.getItem('username');
      const cuFirstName = localStorage.getItem('firstName');
      const cuLastName = localStorage.getItem('lastName');
      const pictureURL = localStorage.getItem('pictureURL');
      const activeOrg = localStorage.getItem('activeOrg');
      const orgFocus = localStorage.getItem('orgFocus');
      const orgName = localStorage.getItem('orgName');

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

      if (window.location.pathname.includes('/employers/')) {
        // groupPictureURL = this.props.employerLogoURI
        groupName = this.props.employerName + " " + this.props.jobFunction + " Community"
        groupPathway = this.props.pathway
        groupDescription = "This talent community is for people interested in joining the " + this.props.employerName + " " + this.props.jobFunction + " team."
      }

      let selectedGroup = null

      if (this.props.selectedGroup) {
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
          meetingStartTime = convertDateToString(new Date(this.props.selectedGroup.meetingStartTime),"rawDateTimeForInput")
        }
        if (this.props.selectedGroup.meetingEndTime) {
          meetingEndTime = convertDateToString(new Date(this.props.selectedGroup.meetingEndTime),"rawDateTimeForInput")
        }

        meetingRepeats = this.props.selectedGroup.meetingRepeats
        invites = this.props.selectedGroup.invites
        // console.log('meetingStartTime: ', meetingStartTime)
        // console.log('meetingStartTime 2: ', new Date(this.props.selectedGroup.meetingStartTime))
        // console.log('meetingStartTime 3: ', convertDateToString(new Date(this.props.selectedGroup.meetingStartTime),"rawDateTimeForInput"))
        // console.log('meetingStartTime 2: ', this.props.selectedGroup.meetingStartTime.toLocaleString("en-US", {timeZone: "America/New_York"}))
        // console.log('meetingStartTime 3: ', typeof this.props.selectedGroup.meetingStartTime)
        // console.log('meetingStartTime 4: ', new Date(this.props.selectedGroup.meetingStartTime))
        // console.log('meetingStartTime 2: ', this.props.selectedGroup.meetingStartTime.toLocaleString("en-US", {timeZone: "America/Los_Angeles"}))
        // meetingStartTime = convertDateToString(meetingStartTime,"first16")
        // console.log('meetingStartTime 2: ', meetingStartTime)

        // 2021-10-30T04:32:00.000Z
        // 2021-10-12T08:55
        // 2021-010-30T19:30
        selectedGroup = this.props.selectedGroup
      }

      if (window.location.pathname.includes('/app/')) {
        // only accountability groups are allowed
        groupCategory = 'Accountability'
        groupAccessType = 'Request'
        selectedRoleNames = ['Career-Seeker']
      } else if (window.location.pathname.includes('/employers/')) {
        groupCategory = 'Employers'
        groupAccessType = "Open"
        selectedRoleNames = ['Career-Seeker','Employer']
      }

      this.setState({
        pictureURL, emailId, username, cuFirstName, cuLastName, activeOrg, orgFocus, orgName, accountCode,
        categoryOptions, accessTypeOptions,
        _id, groupPictureURL, groupName, groupCategory, groupPathway, groupDescription, featured, isActive,
        groupGoals, meetingMethod, meetingLocation, meetingStartTime, meetingEndTime, meetingRepeats, invites,
        groupAccessType, selectedRoleNames, groupMembers, selectedGroup
      })

      Axios.get('/api/org', { params: { orgCode: activeOrg } })
      .then((response) => {
        console.log('Org info query attempted one', response.data);

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
    }

    formChangeHandler = (event) => {
      console.log('formChangeHandler called', event.target.name, event.target.value)

      if (event.target.name === 'groupCoverImage') {

          if (event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({ groupCoverImage: e.target.result, saveGroupImage: true });
                console.log('how do i access the image', e.target.result)
            };
            reader.readAsDataURL(event.target.files[0]);
            this.setState({ groupImageFile: event.target.files[0] })
            // this.setState({ profilePicFile: event.target.files[0], profilePicHasChanged: true })
            // this.saveFile(event.target.name, event.target.files[0])
          }
      } else if (event.target.name === 'searchMembers') {
        this.searchItems(event.target.value,'member')
      } else {
        this.setState({ [event.target.name]: event.target.value })
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
          let roleNames = ['Student','Career-Seeker','Mentor','Employer']
          if (window.location.pathname.includes('/app/groups')) {
            roleNames = ['Student','Career-Seeker']
          }

          const self = this
          function officiallyFilter() {
            console.log('officiallyFilter called')

            Axios.get('/api/members/search', {  params: {searchString, excludeCurrentUser, emailId, roleNames, orgCode }})
            .then((response) => {
              console.log('Careers query attempted', response.data);

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
            <div key={"items"}>
              <div className="spacer" />
              {items.map((value, optionIndex) =>
                <div key={"items|" + optionIndex} className="float-left">

                  <div className="close-button-container-1" >
                    <button className="background-button" onClick={() => this.removeTag(optionIndex,type)}>
                      <img src={deniedIcon} alt="Compass target icon" className="image-auto-20" />
                    </button>
                  </div>

                  <div className="float-left right-padding-5">
                    <div className="half-spacer" />
                    <div className={(value.roleName === 'Mentor' || value.roleName === 'Employer') ? "tag-container-basic error-background-color clear-margin top-margin-5" : "tag-container-basic faint-background clear-margin top-margin-5"}>
                      <p className="description-text-2">{value.firstName} {value.lastName}</p>
                      <p className="description-text-5">({value.email})</p>
                    </div>
                    <div className="half-spacer" />
                  </div>

                </div>
              )}
            </div>
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

      this.props.closeModal()
      // this.setState({ modalIsOpen: false, showMessageWidget: false, showMatchingCriteria: false, addOrgGroup: false })
    }

    deleteGroup() {
      console.log('deleteGroup called')

      this.setState({ isSaving: true, errorMessage: null, successMessage: null })

      const _id = this.state.selectedGroup._id

      Axios.delete('/api/groups/' + _id)
      .then((response) => {
        console.log('tried to  delete', response.data)
        if (response.data.success) {
          //save values
          console.log('Group delete worked');

          this.setState({ successMessage: response.data.message, confirmDelete: false, isSaving: false })
          if (window.location.pathname.includes('/app/groups') || window.location.pathname.includes('/app/community')) {
            this.props.history.push('/app/community')
          } else if (window.location.pathname.includes('/advisor')) {
            this.props.history.push('/advisor/groups')
          } else if (window.location.pathname.includes('/organizations')) {
            this.props.history.push('/organizations/' + this.state.activeOrg + '/groups')
          } else if (window.location.pathname.includes('/app/walkthrough')) {
            this.props.passGroup(this.state.selectedGroup, false)
          } else if (window.location.pathname.includes('/employers/')) {
            this.props.history.push("/employers/" + this.state.accountCode + "/pipelines")
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

        Axios.post('/api/groups', posting)
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

                Axios.get('/api/groups/byid', { params: { name } })
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

                this.closeModal()
                if (window.location.pathname.includes('/app/groups') || window.location.pathname.includes('/app/community')) {
                  this.props.history.push("/app/groups/" + response.data._id)
                } else if (window.location.pathname.includes('/advisor/groups')) {
                  this.props.history.push("/advisor/groups/" + response.data._id)
                } else if (window.location.pathname.includes('/organizations/')) {
                  this.props.history.push("/organizations/" + this.state.activeOrg + "/groups/" + response.data._id)
                } else if (window.location.pathname.includes('/app/walkthrough')) {
                  posting['_id'] = response.data._id
                  this.props.passGroup(posting, true)
                } else if (window.location.pathname.includes('/employers/')) {
                  this.props.history.push("/employers/" + this.state.accountCode + "/groups/" + response.data._id)
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
      const fileName = passedFile.name
      let originalName = fileCategory + '|' + groupId + '|' + fileName + '|' + new Date()

      let fileData = new FormData();
      // const fileName = 'profileImage'
      // const fileName = 'newFile'
      console.log('saved file: ', originalName)
      fileData.append('baseFileName', passedFile, originalName)

      fetch("/api/file-upload", {
          mode: 'no-cors',
          method: "POST",
          body: fileData
      }).then(function (res) {
        console.log('what is the profile pic response');
        if (res.ok) {

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

              Axios.put('/api/file', { deleteKey })
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
                    self.closeModal()
                    if (window.location.pathname.includes('/app/groups') || window.location.pathname.includes('/app/community')) {
                      self.props.history.push("/app/groups/" + groupId)
                    } else if (window.location.pathname.includes('/advisor/groups')) {
                      self.props.history.push("/advisor/groups/" + groupId)
                    } else if (window.location.pathname.includes('/organizations/')) {
                      self.props.history.push("/organizations/" + self.state.activeOrg + "/groups/" + groupId)
                    } else if (window.location.pathname.includes('/app/walkthrough')) {
                      group['_id'] = groupId
                      self.props.passGroup(group, true)
                    } else if (window.location.pathname.includes('/employers/')) {
                      self.props.history.push("/employers/" + self.state.accountCode + "/groups/" + groupId)
                    }
                  }

                } else {
                  console.error('there was an error saving the file');

                  self.setState({ isSaving: false, groupName: '', groupCategory: '', groupDescription: '',
                  groupAccessType: '', selectedRoleNames: [], groupMembers: [], errorMessage: response.data.message
                  })
                  self.closeModal()
                  if (window.location.pathname.includes('/app/groups') || window.location.pathname.includes('/app/community')) {
                    self.props.history.push("/app/groups/" + groupId)
                  } else if (window.location.pathname.includes('/advisor/groups')) {
                    self.props.history.push("/advisor/groups/" + groupId)
                  } else if (window.location.pathname.includes('/organizations/')) {
                    self.props.history.push("/organizations/" + self.state.activeOrg + "/groups/" + groupId)
                  } else if (window.location.pathname.includes('/app/walkthrough')) {
                    group['_id'] = groupId
                    self.props.passGroup(group, true)
                  } else if (window.location.pathname.includes('/employers/')) {
                    self.props.history.push("/employers/" + self.state.accountCode + "/groups/" + groupId)
                  }
                }
              }).catch((error) => {
                  console.log('The saving did not work', error);
                  // self.setState({ errorMessage: error })

                  self.setState({ isSaving: false, groupName: '', groupCategory: '',
                    groupDescription: '', groupAccessType: '', selectedRoleNames: [], groupMembers: [],
                    errorMessage: error
                  })
                  self.closeModal()
                  if (window.location.pathname.includes('/app/groups') || window.location.pathname.includes('/app/community')) {
                    self.props.history.push("/app/groups/" + groupId)
                  } else if (window.location.pathname.includes('/advisor/groups')) {
                    self.props.history.push("/advisor/groups/" + groupId)
                  } else if (window.location.pathname.includes('/organizations/')) {
                    self.props.history.push("/organizations/" + this.state.activeOrg + "/groups/" + groupId)
                  } else if (window.location.pathname.includes('/app/walkthrough')) {
                    group['_id'] = groupId
                    self.props.passGroup(group, true)
                  } else if (window.location.pathname.includes('/employers/')) {
                    self.props.history.push("/employers/" + self.state.accountCode + "/groups/" + groupId)
                  }
              });
            } else {
              self.setState({ isSaving: false, groupName: '', groupCategory: '', groupDescription: '',
              groupAccessType: '', selectedRoleNames: [], groupMembers: [], errorMessage: 'Successfully created a group'
              })
              self.closeModal()
              if (window.location.pathname.includes('/app/groups') || window.location.pathname.includes('/app/community')) {
                self.props.history.push("/app/groups/" + groupId)
              } else if (window.location.pathname.includes('/advisor/groups')) {
                self.props.history.push("/advisor/groups/" + groupId)
              } else if (window.location.pathname.includes('/organizations/')) {
                self.props.history.push("/organizations/" + self.state.activeOrg + "/groups/" + groupId)
              } else if (window.location.pathname.includes('/app/walkthrough')) {
                group['_id'] = groupId
                self.props.passGroup(group, true)
              } else if (window.location.pathname.includes('/employers/')) {
                self.props.history.push("/employers/" + self.state.accountCode + "/groups/" + groupId)
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
            this.closeModal()
            if (window.location.pathname.includes('/app/groups') || window.location.pathname.includes('/app/community')) {
              this.props.history.push("/app/groups/" + groupId)
            } else if (window.location.pathname.includes('/advisor/groups')) {
              this.props.history.push("/advisor/groups/" + groupId)
            } else if (window.location.pathname.includes('/organizations/')) {
              this.props.history.push("/organizations/" + this.state.activeOrg + "/groups/" + groupId)
            } else if (window.location.pathname.includes('/app/walkthrough')) {
              group['_id'] = groupId
              this.props.passGroup(group, true)
            } else if (window.location.pathname.includes('/employers/')) {
              this.props.history.push("/employers/" + this.state.accountCode + "/groups/" + groupId)
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
          this.closeModal()
          if (window.location.pathname.includes('/app/groups') || window.location.pathname.includes('/app/community')) {
            this.props.history.push("/app/groups/" + groupId)
          } else if (window.location.pathname.includes('/advisor/groups')) {
            this.props.history.push("/advisor/groups/" + groupId)
          } else if (window.location.pathname.includes('/organizations/')) {
            this.props.history.push("/organizations/" + groupId)
          } else if (window.location.pathname.includes('/app/walkthrough')) {
            group['_id'] = groupId
            this.props.passGroup(group, true)
          } else if (window.location.pathname.includes('/employers/')) {
            this.props.history.push("/employers/" + this.state.accountCode + "/groups/" + groupId)
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
          <div>

            <div key="addOrgGroup" className="full-width padding-20">
                {(window.location.pathname.includes('/app/')) ? (
                  <div>
                    <p className="heading-text-2 bottom-padding">Create an Acccountability Group</p>
                    <p className="top-padding">An accountability group is a small group of like-minded people (6 max) who meet regularly to support each other toward reaching their goals.</p>
                    <div className="spacer" /><div className="spacer" />
                  </div>
                ) : (
                  <div>
                    {(this.state.selectedGroup) ? (
                      <p className="heading-text-2 bottom-padding">Edit {this.state.selectedGroup.name}</p>
                    ) : (
                      <div>
                        {(this.state.orgName) ? (
                          <p className="heading-text-2 bottom-padding">Add a Group to {this.state.orgName}</p>
                        ) : (
                          <p className="heading-text-2 bottom-padding">Create a Group</p>
                        )}
                      </div>
                    )}

                    <div className="spacer" /><div className="spacer" />
                  </div>
                )}

                {(this.state.errorMessage && this.state.errorMessage !== '') && <p className="description-text-2 error-color row-5">{this.state.errorMessage}</p>}
                {(this.state.successMessage && this.state.successMessage !== '') && <p className="description-text-2 cta-color row-5">{this.state.successMessage}</p>}

               {(this.state.isSaving) ? (
                 <div className="flex-container flex-center full-space">
                   <div>
                     <div className="super-spacer" />

                     <ActivityIndicator
                        animating = {this.state.animating}
                        color = '#87CEFA'
                        size = "large"
                        style={styles.square80, styles.centerHorizontally}/>
                     <div className="spacer" /><div className="spacer" /><div className="spacer" />
                     <p className="center-text cta-color bold-text">Searching...</p>

                   </div>
                 </div>
               ) : (
                 <div>
                   <div className="row-15">
                     <div className="upload-image">
                       <div className="spacer" />
                       <div>
                         <p className="heading-text-6">Group Cover Image</p>
                         <div className="spacer" />
                       </div>

                       <div className="relative-position">
                         <label for="groupCoverImage" className="profile-pic-button">
                           <img src={ this.state.groupCoverImage ? ( this.state.groupCoverImage )
                             : this.state.groupPictureURL ? ( this.state.groupPictureURL )
                             : ( imageIcon)}
                           alt="GC" for="profilePic" className="add-group-cover-image standard-border"/>

                           <div className="bottom-right-overlay-250">
                             <div className="bottom-right-subcontainer">
                               <img src={addIcon} alt="Compass add icon" className="image-auto-18 center-item" />
                             </div>
                             <div className="clear" />
                           </div>

                         </label>
                         <input type="file" id="groupCoverImage" name="groupCoverImage" onChange={this.formChangeHandler} accept="image/*" />
                       </div>

                       <div className="clear" />
                       <div className="spacer" />
                       <p className="description-text-color">Dimensions: 600 x 360</p>

                       { (this.state.serverPostSuccess) ? (
                         <p className="success-message">{this.state.serverSuccessMessage}</p>
                       ) : (
                         <p className="error-message">{this.state.serverErrorMessage}</p>
                       )}
                     </div>
                   </div>

                   <div className="row-15">
                     <div className="container-left">
                       <p className="heading-text-6">Group Name<label className="error-color bold-text">*</label></p>
                       <div className="spacer" />
                       <input type="text" className="text-field" placeholder="Add group name..." name="groupName" value={this.state.groupName} onChange={this.formChangeHandler}></input>
                     </div>
                     {(!window.location.pathname.includes('/app/')) && (
                       <div>
                          {(window.location.pathname.includes('/employers/')) ? (
                            <div className="container-right">
                              <p className="heading-text-6">Group Pathway<label className="error-color bold-text">*</label></p>
                              <div className="spacer" />
                              <input type="text" className="text-field" placeholder="Add career pathway or department..." name="groupPathway" value={this.state.groupPathway} onChange={this.formChangeHandler}></input>
                            </div>
                          ) : (
                            <div className="container-right">
                              <p className="heading-text-6">Group Category<label className="error-color bold-text">*</label></p>
                              <div className="spacer" />
                              <select name="groupCategory" value={this.state.groupCategory} onChange={this.formChangeHandler} className="dropdown">
                                {this.state.categoryOptions.map(value =>
                                  <option key={value} value={value}>{value}</option>
                                )}
                              </select>
                            </div>
                          )}
                       </div>
                     )}

                     <div className="clear" />
                   </div>

                   <div className="row-15">
                     <p className="heading-text-6">Group Description<label className="error-color bold-text">*</label></p>
                     <div className="spacer" />
                     <textarea type="text" className="text-field" placeholder="Add description..." name="groupDescription" value={this.state.groupDescription} onChange={this.formChangeHandler}></textarea>
                   </div>

                   {(this.state.groupCategory === 'Accountability') && (
                     <div>
                       <div className="row-15">
                         <p className="heading-text-6">Tag the Relevant Goals of this Group</p>
                         <div className="spacer" />
                         {this.state.goalTypeOptions.map((value, optionIndex) =>
                           <div key={"items|" + optionIndex} className="float-left">
                             <button className="background-button" onClick={() => this.itemClicked(value,'goal')}>
                               <div className="float-left right-padding-5">
                                  {(this.state.groupGoals && this.state.groupGoals.includes(value)) ? (
                                    <div className="tag-container-basic primary-background clear-margin top-margin-5 standard-border">
                                      <p className="white-text">{value}</p>
                                    </div>
                                  ) : (
                                    <div className="tag-container-basic light-background clear-margin top-margin-5 standard-border">
                                      <p>{value}</p>
                                    </div>
                                  )}
                               </div>
                             </button>
                           </div>
                         )}
                         <div className="clear" />
                       </div>

                       <div className="row-15">
                         <p className="heading-text-6">Meetings</p>
                         <div className="spacer" />

                         <div className="row-5">
                           <div className="container-left">
                             <label className="profile-label">Repeats<label className="error-color bold-text">*</label></label>
                             <select name="meetingRepeats" value={this.state.meetingRepeats} onChange={this.formChangeHandler} className="dropdown">
                               {this.state.repeatOptions.map(value =>
                                 <option key={value} value={value}>{value}</option>
                               )}
                             </select>
                           </div>
                           <div className="clear" />
                         </div>

                         <div className="row-5">
                           <div className="container-left">
                             <label className="profile-label">{this.state.logType} Method<label className="error-color bold-text">*</label></label>
                             <select className="dropdown" name="meetingMethod" value={this.state.meetingMethod} onChange={this.formChangeHandler}>
                                 <option />
                                 <option value="In Person">In Person</option>
                                 <option value="Remote">Remote</option>
                             </select>
                           </div>

                           <div className="container-right">
                             <label className="profile-label">{(this.state.meetingMethod === "In Person") ? "Location" : "Meeting Link"}<label className="error-color bold-text">*</label></label>
                             <input type="text" className="text-field" placeholder={(this.state.meetingMethod === "In Person") ? "Address..." : "Http..."} name="meetingLocation"  value={this.state.meetingLocation} onChange={this.formChangeHandler}></input>
                             {(this.state.meetingMethod === "Remote") && this.state.meetingLocation && this.state.meetingLocation !== '' && !this.state.meetingLocation.startsWith('http') && (
                               <div className="top-padding-5">
                                 <p className="error-color description-text-2">Please add a valid link that starts with http</p>
                               </div>
                             )}
                           </div>

                           <div className="clear" />
                         </div>

                         <div className="row-5">
                           <div className="container-left">
                             <label className="profile-label">Starts<label className="error-color bold-text">*</label></label>
                             <input type="datetime-local" className="date-picker" placeholder="Start date" name="meetingStartTime" value={this.state.meetingStartTime} onChange={this.formChangeHandler}></input>
                           </div>
                           <div className="container-right">
                             <label className="profile-label">Ends<label className="error-color bold-text">*</label></label>
                             <input type="datetime-local" className="date-picker" placeholder="End date" name="meetingEndTime" value={this.state.meetingEndTime} onChange={this.formChangeHandler}></input>
                           </div>
                           <div className="clear" />
                         </div>
                       </div>
                     </div>
                   )}

                   {(!window.location.pathname.includes('/app/')) && (
                     <div>
                       <div className="row-15">
                         <div className="container-left">
                           <p className="heading-text-6">Visible?</p>

                           <div className="spacer" /><div className="half-spacer"/>
                           <Switch
                             onValueChange={(change) => this.setState({ isActive: change, formHasChanged: true })}
                             value={this.state.isActive}
                           />
                         </div>
                         <div className="container-right">

                         </div>
                         <div className="clear" />
                       </div>

                       {!window.location.pathname.includes('/employers/') && (
                          <div>
                            <div className="row-15">
                              <div className="container-left">
                                <p className="heading-text-6">Access Type<label className="error-color bold-text">*</label></p>
                                <div className="spacer" />
                                <select name="groupAccessType" value={this.state.groupAccessType} onChange={this.formChangeHandler} className="dropdown">
                                  {this.state.accessTypeOptions.map(value =>
                                    <option key={value} value={value}>{value}</option>
                                  )}
                                </select>
                              </div>
                              <div className="clear" />
                            </div>

                            <div className="row-15">
                              <p className="heading-text-6">Roles Who Can Access<label className="error-color bold-text">*</label></p>
                              <div className="spacer" />
                              {this.state.roleNameOptions.map((value, optionIndex) =>
                                <div key={optionIndex}>
                                  <div className="float-left bottom-padding-5 right-padding">
                                    {(this.state.selectedRoleNames.includes(value)) ? (
                                      <button className="background-button tag-container-4 float-left top-margin-5 left-margin-5" onClick={() => this.optionClicked(value, optionIndex)}>
                                        <div>
                                          <div className="float-left left-text">
                                            <p className="description-text-2 white-text">{value}</p>
                                          </div>
                                        </div>
                                      </button>
                                    ) : (
                                      <button className="background-button tag-container-5" onClick={() => this.optionClicked(value, optionIndex)}>
                                        <div>
                                          <div className="float-left left-text">
                                            <p className="description-text-2">{value}</p>
                                          </div>
                                        </div>
                                      </button>
                                    )}
                                  </div>
                                </div>
                              )}

                              <div className="clear" />
                            </div>
                          </div>
                       )}

                     </div>
                   )}

                   {(window.location.pathname.includes('/app/')) && (
                     <div className="row-15">
                       <p className="heading-text-6">Invite People</p>
                       <p className="description-text-2 bottom-padding top-padding-5">Note: acountablity groups are limited to 6 people</p>
                      <div className='spacer' />
                       <div>
                        <div className="container-left">
                          <input type="text" className="text-field" placeholder="Search members..." name="searchMembers" value={this.state.searchString} onChange={this.formChangeHandler}></input>
                        </div>
                        <div className="container-right">
                          <button className={(this.state.unready) ? "btn btn-squarish medium-background standard-border" : "btn btn-squarish"} disabled={this.state.unready}  onClick={() => this.addItem('invite')}>Add</button>
                        </div>
                        <div className="clear" />
                       </div>

                       {(this.state.errorMessage && this.state.errorMessage !== '') && <p className="description-text-2 error-color row-5">{this.state.errorMessage}</p>}
                       {(this.state.successMessage && this.state.successMessage !== '') && <p className="description-text-2 cta-color row-5">{this.state.successMessage}</p>}

                       {(this.state.searchIsAnimating) ? (
                         <div className="flex-container flex-center full-space">
                           <div>
                             <div className="super-spacer" />

                             <ActivityIndicator
                                animating = {this.state.animating}
                                color = '#87CEFA'
                                size = "large"
                                style={styles.square80, styles.centerHorizontally}/>
                             <div className="spacer" /><div className="spacer" /><div className="spacer" />
                             <p className="center-text cta-color bold-text">Searching...</p>

                           </div>
                         </div>
                       ) : (
                         <div>
                           <div>
                             {(this.state.memberOptions) && (
                               <div className="card top-margin">
                                 {this.state.memberOptions.map((value, optionIndex) =>
                                   <div key={value._id} className="left-text bottom-margin-5 full-width">
                                     <button className="background-button full-width row-5 left-text" onClick={() => this.searchItemClicked(value,'member')}>
                                       <div className="full-width">
                                         <div className="fixed-column-40">
                                          <div className="half-spacer" />
                                           <img src={(value.pictureURL) ? value.pictureURL : profileIconDark} alt="GC" className="profile-thumbnail-25" />
                                         </div>
                                         <div className="calc-column-offset-40">
                                           <p className="cta-color">{value.firstName} {value.lastName}</p>
                                           <p className="description-text-3">{value.roleName}</p>
                                         </div>
                                       </div>
                                     </button>
                                   </div>
                                 )}
                               </div>
                             )}
                           </div>

                           <div>

                             {this.renderTags('invite')}
                             <div className="clear" />

                           </div>

                         </div>
                       )}


                     </div>
                   )}

                   {(!window.location.pathname.includes('/app/') || (window.location.pathname.includes('/app/') && this.state.selectedGroup)) && (
                     <div className="row-15">
                       <p className="heading-text-6">Manage Members</p>
                       <div className="spacer" />

                       <div>
                         {(!window.location.pathname.includes('/app/')) && (
                           <div>
                             <div>
                              <div className="container-left">
                                <input type="text" className="text-field" placeholder="Search members..." name="searchMembers" value={this.state.searchString} onChange={this.formChangeHandler}></input>
                              </div>
                              <div className="container-right">
                                <button className={(this.state.unready) ? "btn btn-squarish medium-background standard-border" : "btn btn-squarish"} disabled={this.state.unready}  onClick={() => this.addItem('member')}>Add</button>
                              </div>
                              <div className="clear" />
                             </div>

                             {(this.state.errorMessage && this.state.errorMessage !== '') && <p className="description-text-2 error-color row-5">{this.state.errorMessage}</p>}
                             {(this.state.successMessage && this.state.successMessage !== '') && <p className="description-text-2 cta-color row-5">{this.state.successMessage}</p>}

                             {(this.state.searchIsAnimating) ? (
                               <div className="flex-container flex-center full-space">
                                 <div>
                                   <div className="super-spacer" />

                                   <ActivityIndicator
                                      animating = {this.state.animating}
                                      color = '#87CEFA'
                                      size = "large"
                                      style={styles.square80, styles.centerHorizontally}/>
                                   <div className="spacer" /><div className="spacer" /><div className="spacer" />
                                   <p className="center-text cta-color bold-text">Searching...</p>

                                 </div>
                               </div>
                             ) : (
                               <div>
                                 <div>
                                   {(this.state.memberOptions) && (
                                     <div className="card top-margin">
                                       {this.state.memberOptions.map((value, optionIndex) =>
                                         <div key={value._id} className="left-text bottom-margin-5 full-width">
                                           <button className="background-button full-width row-5 left-text" onClick={() => this.searchItemClicked(value,'member')}>
                                             <div className="full-width">
                                               <div className="fixed-column-40">
                                                <div className="half-spacer" />
                                                 <img src={(value.pictureURL) ? value.pictureURL : profileIconDark} alt="GC" className="profile-thumbnail-25" />
                                               </div>
                                               <div className="calc-column-offset-40">
                                                 <p className="cta-color">{value.firstName} {value.lastName}</p>
                                                 <p className="description-text-3">{value.roleName}</p>
                                               </div>
                                             </div>
                                           </button>
                                         </div>
                                       )}
                                     </div>
                                   )}
                                 </div>

                               </div>
                             )}
                           </div>
                         )}

                         <div>
                           {this.renderTags('member')}
                           <div className="clear" />
                         </div>
                       </div>
                     </div>
                   )}

                   {/*
                   <div className="row-10">
                     <div className="container-left">
                       <label className="profile-label">Please list the admins<label className="error-color bold-text">*</label></label>
                       <select name="groupAccessType" value={this.state.groupAccessType} onChange={this.formChangeHandler} className="dropdown">
                         {this.state.accessTypeOptions.map(value =>
                           <option key={value} value={value}>{value}</option>
                         )}
                       </select>
                     </div>
                     <div className="clear" />
                   </div>*/}

                   {(this.state.successMessage && this.state.successMessage !== '') && <p className="cta-color row-5">{this.state.successMessage}</p>}
                   {(this.state.errorMessage && this.state.errorMessage !== '') && <p className="error-color row-5">{this.state.errorMessage}</p>}

                   <div className="row-15">
                     <div className="spacer" />

                     {(this.state.confirmDelete) ? (
                       <div>
                        <p className="bottom-margin error-color">Are you sure you want to delete this group?</p>
                        <button className="btn btn-squarish error-background-color standard-border right-margin" onClick={() => this.deleteGroup()}>Confirm & Delete</button>
                        <button className="btn btn-squarish white-background cta-color" onClick={() => this.setState({ confirmDelete: false })}>Cancel</button>
                       </div>
                     ) : (
                       <div>
                         <button className="btn btn-primary right-margin" disabled={this.state.isSaving} onClick={() => this.editGroup()}>{(this.state.selectedGroup) ? "Save & Edit Group" : "Save & Add Group"}</button>
                         <button className="btn btn-secondary right-margin" onClick={() => this.closeModal()}>Close View</button>
                         {(this.state._id) && (
                           <button className="btn btn-quaternary" onClick={() => this.setState({ confirmDelete: true })}>Delete Group</button>
                         )}

                       </div>
                     )}
                   </div>
                 </div>
               )}

             </div>

          </div>

      )
    }
}

export default EditGroup
