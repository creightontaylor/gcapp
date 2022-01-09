import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, Image, TextInput } from 'react-native';
import Axios from 'axios';
const styles = require('../css/style');
import { WebView } from 'react-native-webview';
import {Picker} from '@react-native-picker/picker';

const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png'
const profileIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-blue.png'
const addPeopleIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-people-icon-dark.png'
const addPeopleIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-people-icon-blue.png'
const linkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon.png'
const linkIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon-blue.png'
const infoIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/info-icon.png'
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png'

const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png'
const experienceIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/experience-icon.png'
const educationIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/education-icon.png'
const targetIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/target-icon.png'
const favoritesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-dark.png'

const imageIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/image-icon-dark.png'
const imageIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/image-icon-blue.png'
const tagIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/tag-icon-dark.png'
const tagIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/tag-icon-blue.png'
const pathsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/paths-icon-dark.png'
const pathsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/paths-icon-blue.png'
const videoIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/video-icon-dark.png'
const videoIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/video-icon-blue.png'
const trendsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/trends-icon-dark.png'
const trendsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/trends-icon-blue.png'
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png'
const opportunitiesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-blue.png'
const careerMatchesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-dark.png'
const projectsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-dark.png'

import {convertDateToString} from '../functions/convertDateToString';

class CreatePost extends Component {
    constructor(props) {
        super(props)

        this.state = {
          posts: [],
          profileItemOptions: [],
          profileItemTypeOptions: ['Select an Item Type','Project','Career Goal','Passion'],

          selectedCareers: [],
          selectedCareerDetails: [],
          selectedOpportunities: [],
          selectedOpportunityDetails: [],
          selectedEntities: [],
          selectedEntityDetails: [],
          selectedTrends: [],
          selectedTrendDetails: [],
        }

        this.retrieveData = this.retrieveData.bind(this)
        this.formChangeHandler = this.formChangeHandler.bind(this)
        this.searchItemClicked = this.searchItemClicked.bind(this)
        this.renderTags = this.renderTags.bind(this)
        this.addItem = this.addItem.bind(this)
        this.removeTag = this.removeTag.bind(this)
        this.searchItems = this.searchItems.bind(this)
        this.pullItems = this.pullItems.bind(this)
        this.saveFile = this.saveFile.bind(this)

    }

    componentDidMount() {
      //see if user is logged in
      console.log('profilePage just mounted')

      this.retrieveData()

    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in SubExternalProfile', this.props, prevProps)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode || this.props.posts !== prevProps.posts) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in renderPosts')

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
        if (this.props.pictureURL && !pictureURL) {
          pictureURL = this.props.pictureURL
        }

        const sharePosting = this.props.sharePosting
        const originalPost = this.props.originalPost
        const posts = this.props.posts
        const groupId = this.props.groupId
        const groupName = this.props.groupName
        const jobTitle = this.props.jobTitle

        console.log('gimme values: ', cuFirstName,cuLastName)

        this.setState({ emailId, cuFirstName, cuLastName, activeOrg, orgFocus, roleName, username, pictureURL,
          sharePosting, originalPost, posts, groupId, groupName, jobTitle
        })

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
        .then((response) => {
          console.log('Org info query attempted for orgFocus on login');

            if (response.data.success) {
              console.log('org info query worked for orgFocus')

              const orgLogo = response.data.orgInfo.webLogoURIColor
              const orgName = response.data.orgInfo.orgName

              this.setState({ orgLogo, orgName })

            } else {
              console.log('org info query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
        });

        if (this.props.accountCode) {
          Axios.get('https://www.guidedcompass.com/api/account', { params: { accountCode: this.props.accountCode } })
          .then((response) => {
            console.log('Account info query attempted in employer dashboard');

            if (response.data.success) {
              console.log('account info query worked in sub settings')

              const employerId = response.data.accountInfo._id
              const employerName = response.data.accountInfo.employerName
              const employerLogo = response.data.accountInfo.employerLogoURI
              const employerURL = response.data.accountInfo.employerURL
              const accountCode = response.data.accountInfo.accountCode
              const sharePartners = response.data.accountInfo.sharePartners

              this.setState({ employerId, employerName, employerLogo, employerURL, accountCode, pictureURL, sharePartners });

            }

          }).catch((error) => {
            console.log('Account info query did not work for some reason', error);
          });
        }

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    formChangeHandler = (eventName,eventValue) => {
      console.log('formChangeHandler called')

      if (eventName === 'profileItemType') {
        let profileItemOptions = []
        this.setState({ [eventName]: eventValue, profileItemOptions })
        // console.log('t0', eventValue)
        if (eventValue !== '' && eventValue !== 'Select an Item Type') {
          // console.log('t1', eventValue)
          this.pullItems(eventValue)
        }
      } else if (eventName === 'searchEntities' || eventName === 'searchOpportunities' || eventName === 'searchCareers' || eventName === 'searchTrends') {
        this.searchItems(eventValue, eventName)
      } else if (eventName === 'postImage') {
        // console.log('profilePicSelectedHandler changed', event.target.files[0])
        this.setState({ errorMessage: null, successMessage: null })

        if (event.target.files[0]) {
          if (event.target.files[0].size > 1 * 1024 * 1024) {
            console.log('file is too big')

            const errorMessage = 'File must be less than 1MB.'
            this.setState({ errorMessage })

          } else {
            console.log('file is small enough', event.target.files[0].size)

            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({ postImage: e.target.result, savePostImage: true });
                console.log('how do i access the image', e.target.result)
            };
            reader.readAsDataURL(event.target.files[0]);
            this.setState({ postImageFile: event.target.files[0] })
            // this.setState({ profilePicFile: event.target.files[0], profilePicHasChanged: true })
            // this.saveFile(eventName, event.target.files[0])
          }
        }
      } else {
        this.setState({ [eventName]: eventValue })
      }
    }

    searchItems(searchString, type) {
      console.log('searchItems called', type)

      if (type === 'searchCareers') {
        if (!searchString || searchString === '') {
          this.setState({ searchCareers: searchString, searchIsAnimating: false, careerOptions: null })
        } else {
          this.setState({ searchCareers: searchString, searchIsAnimating: true })

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
      } else if (type === 'searchOpportunities') {
        if (!searchString || searchString === '') {
          this.setState({ searchOpportunities: searchString, searchIsAnimating: false, careerOptions: null })
        } else {
          this.setState({ searchOpportunities: searchString, searchIsAnimating: true })

          const self = this
          function officiallyFilter() {
            console.log('officiallyFilter called')

            const orgCode = self.state.activeOrg
            const placementPartners = self.state.placementPartners
            const accountCode = self.state.accountCode
            const search = true
            const postTypes = ['Internship','Work','Assignment','Problem','Challenge','Event']

            Axios.get('https://www.guidedcompass.com/api/postings/search', { params: { searchString, orgCode, placementPartners, accountCode, search, postTypes } })
            .then((response) => {
              console.log('Opportunity search query attempted', response.data);

                if (response.data.success) {
                  console.log('opportunity search query worked')

                  let opportunityOptions = response.data.postings
                  self.setState({ opportunityOptions, searchIsAnimating: false })

                } else {
                  console.log('opportunity search query did not work', response.data.message)

                  let opportunityOptions = []
                  self.setState({ opportunityOptions, searchIsAnimating: false })

                }

            }).catch((error) => {
                console.log('Search query did not work for some reason', error);
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

      } else if (type === 'searchEntities') {
        if (!searchString || searchString === '') {
          this.setState({ searchEntities: searchString, searchIsAnimating: false, entityOptions: null })
        } else {
          this.setState({ searchEntities: searchString, searchIsAnimating: true })

          const search = true

          const self = this
          function officiallyFilter() {
            console.log('officiallyFilter called')

            const emailId = self.state.emailId
            const excludeCurrentUser = true
            const orgCode = self.state.activeOrg

            Axios.get('https://www.guidedcompass.com/api/entities/search', {  params: { searchString, search, emailId, excludeCurrentUser, orgCode }})
            .then((response) => {
              console.log('Entities query attempted', response.data);

                if (response.data.success) {
                  console.log('successfully retrieved entities')

                  if (response.data) {

                    let entityOptions = []
                    if (response.data.entities && response.data.entities.length > 0) {
                      entityOptions = response.data.entities
                    }

                    self.setState({ entityOptions, searchIsAnimating: false })
                  }

                } else {
                  console.log('no entity data found', response.data.message)
                  self.setState({ searchIsAnimating: false })
                }

            }).catch((error) => {
                console.log('Entity query did not work', error);
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
      } else if (type === 'searchTrends') {
        if (!searchString || searchString === '') {
          this.setState({ searchTrends: searchString, searchIsAnimating: false, entityOptions: null })
        } else {
          this.setState({ searchTrends: searchString, searchIsAnimating: true })

          const search = true

          const self = this
          function officiallyFilter() {
            console.log('officiallyFilter called')

            Axios.get('https://www.guidedcompass.com/api/trends/search', {  params: { searchString, search }})
            .then((response) => {
              console.log('Trends query attempted', response.data);

                if (response.data.success) {
                  console.log('successfully retrieved trends')

                  if (response.data) {

                    let trendOptions = []
                    if (response.data.trends && response.data.trends.length > 0) {
                      trendOptions = response.data.trends
                    }

                    self.setState({ trendOptions, searchIsAnimating: false })
                  }

                } else {
                  console.log('no trend data found', response.data.message)
                  self.setState({ searchIsAnimating: false })
                }

            }).catch((error) => {
                console.log('Trend query did not work', error);
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

    pullItems(value) {
      console.log('pullItems called', value)

      const emailId = this.state.emailId

      if (value === 'Project') {
        Axios.get('https://www.guidedcompass.com/api/projects', { params: { emailId, includeCollaborations: true } })
        .then((response) => {
          console.log('Projects query attempted', response.data);

            if (response.data.success) {
              console.log('successfully retrieved projects for profile items', response.data.projects)

              if (response.data.projects && response.data.projects.length > 0) {

                const profileItemOptions = [{ name: 'Select a project' }].concat(response.data.projects)
                this.setState({ profileItemOptions })
                console.log('asdsdf', profileItemOptions)
              }

            } else {
              console.log('no project data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Project query did not work', error);
        });

      } else if (value === 'Experience') {
        Axios.get('https://www.guidedcompass.com/api/experience', { params: { emailId } })
        .then((response) => {
          console.log('Experience query attempted for profile items', response.data);

            if (response.data.success) {
              console.log('successfully retrieved experience')

              if (response.data.experience && response.data.experience.length > 0) {

                let profileItemOptions = [{ name: 'Select experience' }]
                for (let i = 1; i <= response.data.experience.length; i++) {
                  let experience = response.data.experience[i - 1]
                  experience['name'] = response.data.experience[i - 1].jobTitle + ' | ' + response.data.experience[i - 1].employerName
                  profileItemOptions.push(experience)
                }

                this.setState({ profileItemOptions })
              }

            } else {
              console.log('no experience data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Experience query did not work', error);
        });
      } else if (value === 'Education') {

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: emailId } })
        .then((response) => {
          console.log('User details query 1 attempted', response.data);

          if (response.data.success) {
             console.log('successfully retrieved user details')

             if (response.data.user.education && response.data.user.education.length > 0) {

               const profileItemOptions = [{ name: 'Select education' }].concat(response.data.user.education)
               this.setState({ profileItemOptions })
             }

          } else {
           console.log('no user details data found', response.data.message)
          }

        }).catch((error) => {
           console.log('User details query did not work', error);
        });
      } else if (value === 'Career Goal') {

        Axios.get('https://www.guidedcompass.com/api/logs/goals', { params: { emailId } })
        .then((response) => {

            if (response.data.success) {
              console.log('Goals received query worked', response.data);

              if (response.data.goals && response.data.goals.length > 0) {

                let profileItemOptions = [{ name: 'Select a goal' }]
                for (let i = 1; i <= response.data.goals.length; i++) {
                  let goal = response.data.goals[i - 1]
                  goal['name'] = response.data.goals[i - 1].title
                  profileItemOptions.push(goal)
                }

                this.setState({ profileItemOptions })
              }

            } else {
              console.log('no goal data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Goal query did not work', error);
        });

      } else if (value === 'Passion') {
        Axios.get('https://www.guidedcompass.com/api/logs/passions', { params: { emailId } })
        .then((response) => {

            if (response.data.success) {
              console.log('Passions received query worked', response.data);

              if (response.data.passions && response.data.passions.length > 0) {

                let profileItemOptions = [{ name: 'Select a passion' }]
                for (let i = 1; i <= response.data.passions.length; i++) {
                  let passion = response.data.passions[i - 1]
                  passion['name'] = response.data.passions[i - 1].passionTitle
                  profileItemOptions.push(passion)
                }
                this.setState({ profileItemOptions })
              }

            } else {
              console.log('no passion data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Passion query did not work', error);
        });
      }
    }

    postPost() {
      console.log('postPost called')

      this.setState({ errorMessage: null, successMessage: null, isSaving: true })
      if (!this.state.postMessage || this.state.postMessage === '') {
        this.setState({ errorMessage: 'Please add a message', isSaving: false })
      } else {

        const postMessage = this.state.postMessage
        const postLink = this.state.postLink
        const tags = this.state.tags

        let firstName = this.state.cuFirstName
        let lastName = this.state.cuLastName
        let pictureURL = this.state.pictureURL
        let roleName = this.state.roleName
        let headline = this.state.headline
        let placementPartners = []
        let employerId = null

        const entityTags = this.state.selectedEntityDetails
        const opportunityTags = this.state.selectedOpportunityDetails
        const careerTags = this.state.selectedCareerDetails
        const trendTags = this.state.selectedTrendDetails

        const imageURL = this.state.imageURL
        const videoURL = this.state.videoURL
        let profileItem = null
        if (this.state.profileItem) {
          if (this.state.profileItem !== 'Select a project') {
            for (let i = 1; i <= this.state.profileItemOptions.length; i++) {
              if (this.state.profileItemOptions[i - 1].name === this.state.profileItem) {
                profileItem = this.state.profileItemOptions[i - 1]
                profileItem['category'] = this.state.profileItemType
                profileItem['objectId'] = this.state.profileItemOptions[i - 1]._id
              }
            }
          }
        }

        let originalPost = null
        if (this.state.originalPost) {
          originalPost = {
            pictureURL: this.state.originalPost.pictureURL,
            firstName: this.state.originalPost.firstName,
            lastName: this.state.originalPost.lastName,
            email: this.state.originalPost.email,
            username: this.state.originalPost.username,
            roleName: this.state.originalPost.rolrName,
            headline: this.state.originalPost.headline,
            url: this.state.originalPost.url,
            message: this.state.originalPost.message,

            entityTags: this.state.originalPost.entityTags,
            opportunityTags: this.state.originalPost.opportunityTags,
            careerTags: this.state.originalPost.careerTags,
            trendTags: this.state.originalPost.trendTags,
            imageURL: this.state.originalPost.imageURL,
            videoURL: this.state.originalPost.videoURL,
            profileItem: this.state.originalPost.profileItem,
            createdAt: this.state.originalPost.createdAt
          }
        }

        let postObject = {
          groupId: this.state.groupId, groupName: this.state.groupName,
          firstName, lastName, email: this.state.emailId,
          pictureURL, username: this.state.username,
          roleName, headline,
          message: postMessage, url: postLink, tags, upvotes: [], downvotes: [], commentCount: 0,
          orgCode: this.state.activeOrg, orgName: this.state.orgName, accountCode: this.state.accountCode,
          employerId,
          placementPartners,
          entityTags, opportunityTags, careerTags, trendTags,
          imageURL, videoURL, profileItem, originalPost,
          createdAt: new Date(), updatedAt: new Date()
        }

        Axios.post('https://www.guidedcompass.com/api/group-posts', postObject)
        .then((response) => {
          console.log('attempting to save addition to groups')
          if (response.data.success) {
            console.log('saved addition to groups', response.data)

            if (this.state.savePostImage) {
              // save groupImage

              postObject['imageURL'] = this.state.postImage

              let posts = this.state.posts
              if (posts) {
                posts.unshift(postObject)
              } else {
                posts = [postObject]
              }
              this.setState({ posts, isSaving: false })
              this.props.passPosts(posts)
              this.props.closeModal()

              const postId = response.data._id
              const saveNewPost = true // no pre-existing id

              // pull id if no id
              if (!postId) {

                const saveNewPost = true

                Axios.get('https://www.guidedcompass.com/api/group-posts/byid', { params: { _id: postId } })
                .then((response) => {
                  console.log('Post query attempted one', response.data);

                  if (response.data.success) {
                    console.log('post name query worked')

                    const postId = response.data.group._id

                    this.saveFile(postId, saveNewPost,'postImage')

                  } else {
                    console.log('post query did not work', response.data.message)
                    this.saveFile(postId, saveNewPost,'postImage')
                  }

                }).catch((error) => {
                    console.log('Post query did not work for some reason', error);
                    this.saveFile(postId, saveNewPost,'postImage')
                });
              } else {
                this.saveFile(postId, saveNewPost,'postImage')
              }

            } else {

              let posts = this.state.posts
              if (posts) {
                posts.unshift(postObject)
              } else {
                posts = [postObject]
              }

              this.setState({ posts, isSaving: false })
              this.props.passPosts(posts)
              this.props.closeModal()
            }

          } else {
            console.log('did not save successfully')
            this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
          }
        }).catch((error) => {
            console.log('save did not work', error);
            this.setState({ errorMessage: 'there was an error saving the post', isSaving: false})
        });
      }
    }

    searchItemClicked(passedItem, type) {
      console.log('searchItemClicked called', passedItem, type)

      if (type === 'career') {

        const searchObject = passedItem
        const searchCareers = passedItem.name
        const unready = false
        const careerOptions = null

        this.setState({ searchObject, searchCareers, unready, careerOptions })

      } else if (type === 'opportunity') {
        const searchObject = passedItem
        let searchOpportunities = passedItem.name
        if (passedItem.title) {
          searchOpportunities = passedItem.title
        }
        const unready = false
        const opportunityOptions = null

        this.setState({ searchObject, searchOpportunities, unready, opportunityOptions })
      } else if (type === 'entity') {
        const searchObject = passedItem
        let searchEntities = passedItem.firstName + ' ' + passedItem.lastName
        // if (passedItem.name) {
        //   searchEntities = passedItem.name
        // } else if (passedItem.employerName) {
        //   searchEntities = passedItem.employerName
        // }
        const unready = false
        const entityOptions = null
        console.log('show entity values: ', searchEntities, passedItem)

        this.setState({ searchObject, searchEntities, unready, entityOptions })
      } else if (type === 'trend') {
        const searchObject = passedItem
        let searchTrends = passedItem.name

        const unready = false
        const trendOptions = null

        this.setState({ searchObject, searchTrends, unready, trendOptions })
      }
    }


    renderTags(type) {
      console.log('renderTags ', type, this.state.selectedCareer)

      if (type === 'career') {
        const selectedCareers = this.state.selectedCareers

        if (selectedCareers && selectedCareers.length > 0) {

          return (
            <View key={"selectedCareers"}>
              <View style={styles.spacer} />

              <View style={[styles.rowDirection,styles.flexCenter]}>
                {selectedCareers.map((value, optionIndex) =>
                  <View key={"career|" + optionIndex}>
                    <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.positionRelative,styles.zIndex1]} >
                      <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                        <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.rightPadding5]}>
                      <View style={[styles.halfSpacer]} />
                      <View style={(this.state.selectedCareer === value) ? [styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.ctaBackgroundColor,styles.transparentBorder] : [styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.mediumBackground,styles.transparentBorder]}>
                        <Text style={[styles.descriptionText2,styles.whiteColor]}>{value}</Text>
                      </View>
                      <View style={[styles.halfSpacer]} />
                    </View>
                  </View>
                )}
              </View>
            </View>
          )
        }
      } else if (type === 'opportunity') {
        const selectedOpportunities = this.state.selectedOpportunities
        if (selectedOpportunities && selectedOpportunities.length > 0) {

          return (
            <View key={"selectedOpportunities"}>
              <View style={styles.spacer} />

              <View style={[styles.rowDirection,styles.flexCenter]}>
                {selectedOpportunities.map((value, optionIndex) =>
                  <View key={"career|" + optionIndex}>

                    <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.positionRelative,styles.zIndex1]} >
                      <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                        <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.rightPadding5]}>
                      <View style={[styles.halfSpacer]} />
                      <View style={(this.state.selectedOpportunity === value) ? [styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.ctaBackgroundColor,styles.transparentBorder] : [styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.mediumBackground,styles.transparentBorder]}>
                        <Text style={[styles.descriptionText2,styles.whiteColor]}>{value}</Text>
                      </View>
                      <View style={[styles.halfSpacer]} />
                    </View>

                  </View>
                )}
              </View>

            </View>
          )
        }
      } else if (type === 'entity') {
        const selectedEntities = this.state.selectedEntities
        if (selectedEntities && selectedEntities.length > 0) {

          return (
            <View key={"selectedEntities"}>
              <View style={styles.spacer} />

              <View style={[styles.rowDirection,styles.flexCenter]}>
                {selectedEntities.map((value, optionIndex) =>
                  <View key={"entity|" + optionIndex}>

                    <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.positionRelative,styles.zIndex1]} >
                      <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                        <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.rightPadding5]}>
                      <View style={[styles.halfSpacer]} />
                      <View style={(this.state.selectedEntity === value) ? [styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.ctaBackgroundColor,styles.transparentBorder] : [styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.mediumBackground,styles.transparentBorder]}>
                        <Text style={[styles.descriptionText2,styles.whiteColor]}>{value}</Text>
                      </View>
                      <View style={[styles.halfSpacer]} />
                    </View>

                  </View>
                )}
              </View>

            </View>
          )
        }
      } else if (type === 'trend') {
        const selectedTrends = this.state.selectedTrends
        if (selectedTrends && selectedTrends.length > 0) {

          return (
            <View key={"selectedTrends"}>
              <View style={styles.spacer} />

              <View style={[styles.rowDirection,styles.flexCenter]}>
                {selectedTrends.map((value, optionIndex) =>
                  <View key={"entity|" + optionIndex}>

                    <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.positionRelative,styles.zIndex1]} >
                      <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                        <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.rightPadding5]}>
                      <View style={[styles.halfSpacer]} />
                      <View style={(this.state.selectedTrend === value) ? [styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.ctaBackgroundColor,styles.transparentBorder] : [styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.mediumBackground,styles.transparentBorder]}>
                        <Text style={[styles.descriptionText2,styles.whiteColor]}>{value}</Text>
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

      if (type === 'career') {
        let selectedCareers = this.state.selectedCareers
        selectedCareers.splice(index, 1)

        let selectedCareerDetails = this.state.selectedCareerDetails
        // const careerToRemove = selectedCareerDetails[index]
        selectedCareerDetails.splice(index, 1)
        this.setState({ selectedCareers, selectedCareerDetails })

      } else if (type === 'opportunity') {
        let selectedOpportunities = this.state.selectedOpportunities
        selectedOpportunities.splice(index, 1)

        let selectedOpportunityDetails = this.state.selectedOpportunityDetails
        // const opportunityToRemove = selectedOpportunityDetails[index]
        selectedOpportunityDetails.splice(index, 1)
        this.setState({ selectedOpportunities, selectedOpportunityDetails })
      } else if (type === 'entity') {
        let selectedEntities = this.state.selectedEntities
        selectedEntities.splice(index, 1)

        let selectedEntityDetails = this.state.selectedEntityDetails
        // const entityToRemove = selectedEntityDetails[index]
        selectedEntityDetails.splice(index, 1)
        this.setState({ selectedEntities, selectedEntityDetails })

      } else if (type === 'trend') {
        let selectedTrends = this.state.selectedTrends
        selectedTrends.splice(index, 1)

        let selectedTrendDetails = this.state.selectedTrendDetails
        // const trendToRemove = selectedTrendDetails[index]
        selectedTrendDetails.splice(index, 1)
        this.setState({ selectedTrends, selectedTrendDetails })

      }
    }

    addItem(type) {
      console.log('addItem called', type)

      if (type === 'career') {
        if (this.state.selectedCareers.length > 0) {
          this.setState({ errorMessage: 'We are currently limiting to one career tag per post, but you can add other tags.' })
        } else {

          const searchCareers = ''
          const searchObject = null
          const unready = true

          let selectedCareers = this.state.selectedCareers
          selectedCareers.unshift(this.state.searchCareers)

          let selectedCareerDetails = this.state.selectedCareerDetails
          selectedCareerDetails.unshift(this.state.searchObject)

          // const selectedCareer = this.state.searchString

          this.setState({ searchCareers, searchObject, unready, selectedCareers, errorMessage: null })

        }
      } else if (type === 'opportunity') {
        if (this.state.selectedOpportunities.length > 0) {
          this.setState({ errorMessage: 'We are currently limiting to one opportunity tag per post, but you can add other tags.' })
        } else {

          const searchOpportunities = ''
          const searchObject = null
          const unready = true

          let selectedOpportunities = this.state.selectedOpportunities
          selectedOpportunities.unshift(this.state.searchOpportunities)

          let selectedOpportunityDetails = this.state.selectedOpportunityDetails
          selectedOpportunityDetails.unshift(this.state.searchObject)

          this.setState({ searchOpportunities, searchObject, unready, selectedOpportunities, errorMessage: null })

        }
      } else if (type === 'entity') {

        const searchEntities = ''
        const searchObject = null
        const unready = true

        let selectedEntities = this.state.selectedEntities
        selectedEntities.unshift(this.state.searchEntities)

        let selectedEntityDetails = this.state.selectedEntityDetails
        selectedEntityDetails.unshift(this.state.searchObject)

        this.setState({ searchEntities, searchObject, unready, selectedEntities, errorMessage: null })

      } else if (type === 'trend') {

        const searchTrends = ''
        const searchObject = null
        const unready = true

        let selectedTrends = this.state.selectedTrends
        selectedTrends.unshift(this.state.searchTrends)

        let selectedTrendDetails = this.state.selectedTrendDetails
        selectedTrendDetails.unshift(this.state.searchObject)

        this.setState({ searchTrends, searchObject, unready, selectedTrends, errorMessage: null })

      }
    }

    renderOriginalPost(value) {
      console.log('renderOriginalPost called', value)

      let defaultProfileItemIcon = projectsIconDark
      if (value.profileItem) {
        if (value.profileItem === 'Experience') {
          defaultProfileItemIcon = experienceIcon
        } else if (value.profileItem === 'Education') {
          defaultProfileItemIcon = educationIcon
        } else if (value.profileItem === 'Career Goal') {
          defaultProfileItemIcon = targetIcon
        } else if (value.profileItem === 'Passion') {
          defaultProfileItemIcon = favoritesIconDark
        }
      }

      return (
        <View key="originalPost">
          <View style={styles.rowDirection}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value.originalPost.username})} style={[styles.rowDirection,styles.fullScreenWidth]}>
              <View style={styles.width55}>
                {(value.originalPost.roleName === 'Admin') ? (
                  <Image source={(value.originalPost.pictureURL) ? { uri: value.originalPost.pictureURL} : { uri: profileIconDark}} style={[styles.square40,styles.contain]} />
                ) : (
                  <Image source={(value.originalPost.pictureURL) ? { uri: value.originalPost.pictureURL} : { uri: profileIconDark}} style={[styles.profileThumbnail43]} />
                )}
              </View>
              <View style={[styles.calcColumn125,styles.rowDirection]}>
                <View style={styles.calcColumn125}>
                  <Text style={[styles.descriptionText1,styles.boldText]}>{value.originalPost.firstName} {value.originalPost.lastName}</Text>
                </View>

                <View style={styles.miniSpacer} /><View style={styles.miniSpacer} />

                {(value.originalPost.headline && value.originalPost.headline !== '') ? (
                  <View>
                    <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{value.originalPost.headline}</Text>
                  </View>
                ) : (
                  <View>
                    {(value.originalPost.education && value.originalPost.education[0] && value.originalPost.education[0].name && value.originalPost.education[0].isContinual) ? (
                      <View>
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>Student @ {value.originalPost.education[0].name}</Text>
                      </View>
                    ) : (
                      <View>
                        <View>
                          <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{this.state.orgName} Member</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
                <Text style={[styles.descriptionText4,styles.descriptionTextColor]}>{convertDateToString(value.originalPost.createdAt,"daysAgo")}</Text>
              </View>
            </TouchableOpacity>

          </View>

          <View style={[styles.row10]}>
            <Text style={[styles.descriptionText2]}>{value.originalPost.message}</Text>

            {(value.originalPost.url) && (
              <Text onPress={() => Linking.openURL(value.originalPost.url)} style={[styles.descriptionText3,styles.topPadding,styles.boldText]}>{value.originalPost.url}</Text>
            )}
          </View>
          {(value.originalPost.imageURL) && (
            <View style={[styles.row10]}>
              <Image source={{ uri: value.originalPost.imageURL}} style={[styles.imageFullAuto]} />
            </View>
          )}

          {(value.originalPost.videoURL) && (
            <View style={[styles.row10]}>
              <View style={[styles.spacer]}/>

              <View>
                <View>
                  <WebView
                    style={[styles.calcColumn80,styles.screenHeight20]}
                    javaScriptEnabled={true}
                    source={{uri: value.originalPost.videoURL}}
                  />
                </View>

              </View>


              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
            </View>
          )}

          {(value.originalPost.profileItem) && (
            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value.originalPost.profileItem.objectId})} style={[styles.padding20,styles.calcColumn80]}>
                  <View style={[styles.padding20,styles.rowDirection]}>
                    <View style={styles.width60}>
                      <Image source={(value.originalPost.profileItem.imageURL) ? { uri: value.originalPost.profileItem.imageURL} : { uri: defaultProfileItemIcon }} style={[styles.square50,styles.contain]} />
                    </View>
                    <View style={styles.calcColumn160}>
                      <Text>{value.originalPost.profileItem.name}</Text>
                      {(value.originalPost.profileItem.category === 'Project') && (
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{value.originalPost.profileItem.category} | {value.originalPost.profileItem.hours} Hours</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Experience') && (
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{value.originalPost.profileItem.startDate} - {value.originalPost.profileItem.endDate}</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Education') && (
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{value.originalPost.profileItem.startDate} - {value.originalPost.profileItem.endDate}</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Career Goal') && (
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>Deadline: {value.originalPost.profileItem.deadline}</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Passion') && (
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>Last Updated {value.originalPost.profileItem.updatedAt}</Text>
                      )}

                    </View>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.opportunityTags && value.originalPost.opportunityTags.length > 0) && (
            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { username: value.originalPost.opportunityTags[0]._id})} style={[styles.padding20,styles.calcColumn80]}>
                  <View style={[styles.padding20,styles.rowDirection]}>
                    <View style={styles.width60}>
                      <Image source={(value.originalPost.opportunityTags[0].imageURL) ? { uri: value.originalPost.opportunityTags[0].imageURL} : { uri: opportunitiesIconDark}} style={[styles.square50,styles.contain]} />
                    </View>
                    <View style={styles.calcColumn160}>
                      {(value.originalPost.opportunityTags[0].title) ? (
                        <Text>{value.originalPost.opportunityTags[0].title}</Text>
                      ) : (
                        <Text>{value.originalPost.opportunityTags[0].name}</Text>
                      )}

                      {(value.originalPost.opportunityTags[0].employerName) && (
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{value.originalPost.opportunityTags[0].employerName}</Text>
                      )}

                    </View>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.careerTags && value.originalPost.careerTags.length > 0) && (
            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { objectId: value.originalPost.careerTags[0].name})} style={[styles.padding20,styles.calcColumn80]}>
                  <View style={[styles.padding20,styles.rowDirection,styles.flexWrap]}>
                    <View style={[styles.width60]}>
                      <Image source={(value.originalPost.careerTags[0].imageURL) ? { uri: value.originalPost.careerTags[0].imageURL} : { uri: careerMatchesIconDark}} style={[styles.square50,styles.contain]} />
                    </View>
                    <View style={[styles.calcColumn180]}>
                      <Text>{value.originalPost.careerTags[0].name}</Text>
                      <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{value.originalPost.careerTags[0].jobFamily}</Text>

                      {(value.originalPost.careerTags[0].marketData) && (
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}> | ${Number(value.originalPost.careerTags[0].marketData.pay).toLocaleString()} avg pay</Text>
                      )}

                    </View>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.trendTags && value.originalPost.trendTags.length > 0) && (
            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Paths', { subNavSelected: 'Trends' })} style={[styles.padding20,styles.calcColumn80]}>
                  <View style={[styles.padding20]}>
                    <View style={[styles.rowDirection,styles.flexWrap]}>
                      <View style={[styles.width60]}>
                        <Image source={(value.originalPost.trendTags[0].imageURL) ? { uri: value.originalPost.trendTags[0].imageURL} : { uri: trendsIconDark}} style={[styles.square50,styles.contain]} />
                      </View>
                      <View style={[styles.calcColumn180]}>
                        <Text>{value.originalPost.trendTags[0].name}</Text>
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{value.originalPost.trendTags[0].category}</Text>
                      </View>
                    </View>

                    {(value.originalPost.trendTags[0].percentChange) && (
                      <View style={[styles.width60]}>
                        <Text style={[styles.headingText3,styles.ctaColor,styles.calcColumn80,styles.rightText]}>{Number(value.originalPost.trendTags[0].percentChange).toFixed()}%</Text>
                        <Text style={[styles.headingText5,styles.calcColumn80,styles.rightText]}>increase in U.S. jobs</Text>
                      </View>
                    )}


                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.tags && value.originalPost.tags.length > 0) && (
            <View style={[styles.bottomPadding,styles.rowDirection,styles.flexWrap]}>
              {value.originalPost.tags.map((item2, index2) =>
                <View key={index2} style={[styles.rightPadding,styles.topPadding]}>
                  <View style={[styles.tagContainerThin]}>
                    <Text style={[styles.descriptionText4]}>{item2}</Text>
                  </View>
                </View>
              )}

            </View>
          )}

          {(value.originalPost.entityTags && value.originalPost.entityTags.length > 0) && (
            <View style={[styles.topPadding]}>
              {value.originalPost.entityTags.map((value2, optionIndex2) =>
                <View key={value2} style={[styles.rightPadding]}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value2.username})}>
                    <Image source={(value2.pictureURL) ? { uri: value2.pictureURL} : { uri: profileIconDark}} style={[styles.square20,styles.contain]} />
                  </TouchableOpacity>
                </View>
              )}

            </View>
          )}

        </View>
      )
    }

    saveFile(postId, saveNewPost, group) {
      console.log('saveFile called', postId, saveNewPost, group)
      // postId, saveNewPost,'postImage'

      const fileCategory = 'postImage'
      const passedFile = this.state.postImageFile

      // const emailId = this.state.emailId
      const fileName = passedFile.name
      let originalName = fileCategory + '|' + postId + '|' + fileName + '|' + new Date()

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

          if (fileCategory === 'postImage') {
            if (!saveNewPost) {
              this.setState({ successMessage: 'Post created successfully', isSaving: false, postImageile: passedFile })
            } else {
              this.setState({ successMessage: 'Post created successfully', isSaving: false, postImageFile: passedFile })
            }
          }

          const self = this

          res.json()
          .then(function(data) {
            console.log('show data: ', data)
            let newFilePath = data.filePath
            console.log('show filePath: ', newFilePath)

            let existingFilePath = null
            if (fileCategory === 'postImage') {
              if (self.state.imageURL) {
                existingFilePath = self.state.imageURL
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

                  self.setState({ successMessage: 'File was saved successfully', imageURL: newFilePath,isSaving: false })

                } else {
                  console.error('there was an error saving the file');

                  self.setState({ isSaving: false, errorMessage: response.data.message })
                }
              }).catch((error) => {
                  console.log('The saving did not work', error);
                  // self.setState({ errorMessage: error })

                  self.setState({ isSaving: false, errorMessage: error })

              });
            } else {
              self.setState({ isSaving: false, errorMessage: 'Successfully created a post image' })
            }
          })

        } else if (res.status === 401) {
          //unauthorized
          if (postId) {
            this.setState({ successMessage: 'Post image created successfully', isSaving: false })
          } else {
            this.setState({ successMessage: 'Post image created successfully', isSaving: false })
          }
        }
      }.bind(this), function (e) {
        //there was an error
        if (postId) {
          this.setState({ successMessage: 'Post image created successfully', isSaving: false })
        } else {
          this.setState({ successMessage: 'Post image created successfully', isSaving: false })
        }
      }.bind(this));
    }

    render() {

      return (
        <View>
          {(this.props.modalIsOpen) && (
            <View style={[styles.row10,styles.rowDirection,styles.flex1]}>
              <View style={[styles.flex5]}>
                <TouchableOpacity onPress={() => this.props.closeModal()}>
                  <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                </TouchableOpacity>
              </View>
              <View style={[styles.flex95]}>
              </View>
            </View>
          )}

          <View>
            <View key="showPost" style={(this.props.modalIsOpen) ? [styles.calcColumn80,styles.padding20] : [styles.calcColumn40,styles.padding20]}>
               <View style={[styles.row10,styles.rowDirection]}>
                 <View style={[styles.width60,styles.rightPadding]}>
                  {(this.state.pictureURL) ? (
                    <Image source={{ uri: this.state.pictureURL}} style={[styles.square40,styles.standardBorder, { borderRadius: 20 }]} />
                  ) : (
                    <Image source={{ uri: profileIconDark}} style={[styles.square40,styles.standardBorder, { borderRadius: 20 }]} />
                  )}
                 </View>

                 <View style={(this.props.modalIsOpen) ? [styles.calcColumn200,styles.topPadding5] : [styles.calcColumn160,styles.topPadding5]}>
                   <View>
                    <Text style={[styles.headingText3]}>{this.state.cuFirstName} {this.state.cuLastName}</Text>
                   </View>
                 </View>
                 <View style={[styles.width30,styles.rightPadding]}>
                   <TouchableOpacity onPress={(this.state.showTips) ? () => this.setState({ showTips: false }) : () => this.setState({ showTips: true })}>
                     <Image source={{ uri: infoIcon}} style={[styles.square20,styles.contain]} />
                   </TouchableOpacity>
                 </View>

               </View>

               {(this.state.showTips) && (
                 <View style={[styles.row10,styles.horizontalPadding10,styles.errorBorder,styles.verticalMargin10]}>
                   <Text style={[styles.errorColor,styles.descriptionText2,styles.bottomPadding5]}>Some ideas to post about:</Text>

                   <View style={styles.rowDirection}>
                     <View style={[styles.flex50,styles.errorColor,styles.descriptionText2]}>
                       <View style={styles.leftPadding20}>
                         <Text>Ask a question</Text>
                         <Text>Give a shoutout</Text>
                         <Text>Share a job opportunity</Text>
                         <Text>Share a resource</Text>
                       </View>
                     </View>
                     <View style={styles.flex50}>
                       <View style={styles.leftPadding20}>
                         <Text>Trade services / feedback</Text>
                         <Text>Request feedback</Text>
                         <Text>Recruit a teammate</Text>
                         <Text>Share an update</Text>
                       </View>
                     </View>

                   </View>
                 </View>
               )}

               <View style={[styles.row10]}>
                 <TextInput
                   style={styles.textInput}
                   onChangeText={(text) => this.formChangeHandler("postMessage", text)}
                   value={this.state.postMessage}
                   placeholder="Start a conversation..."
                   placeholderTextColor="grey"
                   multiline={true}
                   numberOfLines={4}
                 />
               </View>

               {(this.state.sharePosting && this.state.originalPost) ? (
                 <View style={[styles.ctaBorder,styles.padding20]}>
                   {this.renderOriginalPost({ originalPost: this.state.originalPost })}
                 </View>
               ) : (
                 <View>
                   <View style={[styles.row10,styles.rowDirection,styles.flexWrap]}>
                     <View style={[styles.rightPadding20]}>
                       <TouchableOpacity onPress={(this.state.showPeople) ? () => this.setState({ showPeople: false }) : () => this.setState({ showPeople: true })}>
                         <Image source={(this.state.showPeople) ? { uri: addPeopleIconBlue} : { uri: addPeopleIconDark}} style={[styles.square20,styles.contain]} />
                       </TouchableOpacity>
                     </View>
                     <View style={[styles.rightPadding20]}>
                       <TouchableOpacity onPress={(this.state.showLink) ? () => this.setState({ showLink: false }) : () => this.setState({ showLink: true })}>
                         <Image source={(this.state.showLink) ? { uri: linkIconBlue} : { uri: linkIcon}} style={[styles.square20,styles.contain]}/>
                       </TouchableOpacity>
                     </View>
                     <View style={[styles.rightPadding20]}>
                       <TouchableOpacity onPress={(this.state.showImage) ? () => this.setState({ showImage: false }) : () => this.setState({ showImage: true })}>
                         <Image source={(this.state.showImage) ? { uri: imageIconBlue} : { uri: imageIconDark}} style={[styles.square20,styles.contain]} />
                       </TouchableOpacity>
                     </View>
                     <View style={[styles.rightPadding20]}>
                       <TouchableOpacity onPress={(this.state.showVideo) ? () => this.setState({ showVideo: false }) : () => this.setState({ showVideo: true })}>
                         <Image source={(this.state.showVideo) ? { uri: videoIconBlue} : { uri: videoIconDark}} style={[styles.square20,styles.contain]} />
                       </TouchableOpacity>
                     </View>
                     <View style={[styles.rightPadding20]}>
                       <TouchableOpacity onPress={(this.state.showProfileItems) ? () => this.setState({ showProfileItems: false }) : () => this.setState({ showProfileItems: true })}>
                         <Image source={(this.state.showProfileItems) ? { uri: profileIconBlue} : { uri: profileIconDark}} style={[styles.square20,styles.contain]}/>
                         <Image source={(this.state.showProfileItems) ? { uri: tagIconBlue} : { uri: tagIconDark}} style={[styles.square9,styles.contain]}/>
                       </TouchableOpacity>
                     </View>

                     <View style={[styles.rightPadding20]}>
                       <TouchableOpacity onPress={(this.state.showOpportunity) ? () => this.setState({ showOpportunity: false }) : () => this.setState({ showOpportunity: true })} style={styles.rowDirection}>
                         <Image source={(this.state.showOpportunity) ? { uri: opportunitiesIconBlue} : { uri: opportunitiesIconDark}} style={[styles.square20,styles.contain]} />
                         <Image source={(this.state.showOpportunity) ? { uri: tagIconBlue} : { uri: tagIconDark}} style={[styles.square9,styles.contain]} />

                       </TouchableOpacity>
                     </View>

                     <View style={[styles.rightPadding20]}>
                       <TouchableOpacity onPress={(this.state.showPaths) ? () => this.setState({ showPaths: false }) : () => this.setState({ showPaths: true })} style={styles.rowDirection}>
                         <Image source={(this.state.showPaths) ? { uri: pathsIconBlue} : { uri: pathsIconDark}} style={[styles.square20,styles.contain]} />
                         <Image source={(this.state.showPaths) ? { uri: tagIconBlue } : { uri: tagIconDark}} style={[styles.square9,styles.contain]} />

                       </TouchableOpacity>
                     </View>
                     <View style={[styles.rightPadding20]}>
                       <TouchableOpacity onPress={(this.state.showTrends) ? () => this.setState({ showTrends: false }) : () => this.setState({ showTrends: true })}>
                         <Image source={(this.state.showTrends) ? { uri: trendsIconBlue} : { uri: trendsIconDark}} style={[styles.square20,styles.contain]}/>
                         <Image source={(this.state.showTrends) ? { uri: tagIconBlue} : { uri: tagIconDark}} style={[styles.square9,styles.contain]} />

                       </TouchableOpacity>
                     </View>

                   </View>

                   {(this.state.showPeople) && (
                     <View style={[styles.row10]}>
                       <Text style={[styles.descriptionText3]}>Tag People and/or Orgs (Optional)</Text>
                       <View style={[styles.halfSpacer]} />

                       <View style={styles.rowDirection}>
                         <View style={styles.calcColumn150}>
                           <TextInput
                             style={styles.textInput}
                             onChangeText={(text) => this.formChangeHandler("searchEntities", text)}
                             value={this.state.searchEntities}
                             placeholder="Search a person or org..."
                             placeholderTextColor="grey"
                           />
                         </View>
                         <View style={[styles.width70,styles.leftPadding]}>
                           <TouchableOpacity style={(this.state.unready) ? [styles.btnSquarish,styles.ctaBackgroundColor,styles.standardBorder,styles.mediumBackground,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.unready} onPress={() => this.addItem('entity')}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
                         </View>
                       </View>

                       <View style={styles.spacer} />

                       {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                       {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                       {(this.state.searchIsAnimating) ? (
                         <View style={[styles.flexCenter,styles.fullSpace]}>
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
                             {(this.state.entityOptions && this.state.entityOptions.length > 0) && (
                               <View style={[styles.card,styles.topMargin]}>
                                 {this.state.entityOptions.map((value, optionIndex) =>
                                   <View key={value._id} style={[styles.bottomMargin5,styles.calcColumn80]}>
                                     <TouchableOpacity style={[styles.row7,styles.calcColumn60]} onPress={() => this.searchItemClicked(value, 'entity')}>
                                       <View style={[styles.calcColumn80,styles.rowDirection]}>
                                         <View style={styles.width40}>
                                           <View style={styles.miniSpacer} />
                                           <Image source={(value.pictureURL) ? { uri: value.pictureURL} : { uri: profileIconDark}} style={[styles.square25,styles.contain, { borderRadius: 12.5}]} />
                                         </View>
                                         <View style={styles.calcColumn120}>
                                           <Text style={[styles.ctaColor,styles.headingText6]}>{value.firstName} {value.lastName}</Text>
                                         </View>
                                       </View>
                                     </TouchableOpacity>
                                   </View>
                                 )}
                               </View>
                             )}
                           </View>

                           <View>
                             {this.renderTags('entity')}
                           </View>

                         </View>
                       )}
                     </View>
                   )}

                   {(this.state.showLink) && (
                     <View style={[styles.row10]}>
                       <Text style={[styles.descriptionText3]}>Share a Link (Optional)</Text>
                       <View style={[styles.halfSpacer]} />
                       <TextInput
                         style={styles.textInput}
                         onChangeText={(text) => this.formChangeHandler("postLink", text)}
                         value={this.state.postLink}
                         placeholder="Add a link..."
                         placeholderTextColor="grey"
                       />
                       {(this.state.postLink && !this.state.postLink.startsWith('http')) && (
                         <View style={[styles.row5]}>
                           <Text style={[styles.errorColor,styles.boldText,styles.descriptionText2]}>The link must start with http</Text>
                         </View>
                       )}
                     </View>
                   )}

                   {(this.state.showImage) && (
                     <View style={[styles.row10]}>
                       <Text style={[styles.descriptionText3]}>Add an Image (Optional)</Text>

                       <View style={[styles.row10]}>
                         {(this.state.postImage) ? (
                           <View>
                             <Image source={
                               this.state.postImage ? ( { uri: this.state.postImage} )
                               : this.state.imageURL ? ( { uri: this.state.imageURL} )
                               : this.state.profilePicPath ? ( { uri: this.state.profilePicPath} )
                               : ( { uri: profileIconDark})}
                             for="postImage" style={[styles.square100,styles.contain]}/>
                           </View>
                         ) : (
                           <View>
                             <Text style={[styles.errorColor,styles.descriptionText2]}>No image uploaded</Text>
                           </View>
                         )}
                       </View>

                       <View style={[styles.halfSpacer]} />
                       {/*
                       <Text for={"file-upload-image"} class="custom-file-upload-squarish">Upload</Text>
                       <input type="file" id={"file-upload-image"} name="postImage" onChange={this.formChangeHandler} accept="image/*" />*/}

                       <View style={styles.spacer} />
                     </View>
                   )}

                   {(this.state.showVideo) && (
                     <View style={[styles.row10]}>
                       <Text style={[styles.descriptionText3]}>Embed a YouTube Video (Optional)</Text>

                       <View style={[styles.row10]}>
                         {(this.state.videoURL) ? (
                           <View>
                           </View>
                         ) : (
                           <View>
                             <Text style={[styles.errorColor,styles.descriptionText2]}>No video uploaded</Text>
                           </View>
                         )}
                       </View>

                       <View style={[styles.halfSpacer]} />

                       <TextInput
                         style={styles.textInput}
                         onChangeText={(text) => this.formChangeHandler("videoLink", text)}
                         value={this.state.videoLink}
                         placeholder="(e.g., https://www.youtube.com/embed/92mBt-NFx50)"
                         placeholderTextColor="grey"
                       />
                        <Text style={[styles.errorColor,styles.descriptionText2,styles.boldText]}>Make sure to use the "embed" version of the link. Add the id after "https://www.youtube.com/embed/"</Text>
                       {/*
                       <Text for={"file-upload-video"} class="custom-file-upload-squarish">Upload</Text>
                       <input type="file" id={"file-upload-image"} name="videoURL" onChange={this.formChangeHandler} accept="image/*" />*/}

                       <View style={styles.spacer} />
                     </View>
                   )}

                   {(this.state.showProfileItems) && (
                     <View style={[styles.row10]}>
                       <Text style={[styles.descriptionText3]}>Tag Items On Your Profile (Optional)</Text>
                       <View style={[styles.halfSpacer]} />

                       <View>
                         <View style={[styles.row10]}>
                           <Picker
                             selectedValue={this.state.profileItemType}
                             onValueChange={(itemValue, itemIndex) =>
                               this.formChangeHandler("profileItemType",itemValue)
                             }>
                             {this.state.profileItemTypeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                           </Picker>
                         </View>
                         {(this.state.profileItemType && this.state.profileItemType !== '') && (
                           <View>
                             {(this.state.profileItemOptions.length > 0) ? (
                               <View style={[styles.row10]}>
                                 <Picker
                                   selectedValue={this.state.profileItem}
                                   onValueChange={(itemValue, itemIndex) =>
                                     this.formChangeHandler("profileItem",itemValue)
                                   }>
                                   {this.state.profileItemTypeOptions.map(value => <Picker.Item key={value.name} label={value.name} value={value.name} />)}
                                 </Picker>
                               </View>
                             ) : (
                               <View style={[styles.row10]}>
                                 <Text style={[styles.descriptionText3,styles.errorColor]}>Well this is awkward. No profile items found. Add to your profile <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile')}><Text style={[styles.ctaColor,styles.boldText]}>here</Text></TouchableOpacity> and then return to post.</Text>
                               </View>
                             )}
                           </View>
                         )}


                       </View>
                     </View>
                   )}

                   {(this.state.showOpportunity) && (
                     <View style={[styles.row10]}>
                       <Text style={[styles.descriptionText3]}>Tag an Opportunity (Optional)</Text>
                       <View style={[styles.halfSpacer]} />

                       <View style={[styles.flexDirection]}>
                         <View style={[styles.calcColumn150]}>
                           <TextInput
                             style={styles.textInput}
                             onChangeText={(text) => this.formChangeHandler("searchOpportunities", text)}
                             value={this.state.searchOpportunities}
                             placeholder="Search event, project, and work opportunities..."
                             placeholderTextColor="grey"
                           />
                         </View>
                         <View style={[styles.width70,styles.leftPadding]}>
                           <TouchableOpacity style={(this.state.unready) ? [styles.btnSquarish,styles.ctaBackgroundColor,styles.standardBorder,styles.mediumBackground,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.unready} onPress={() => this.addItem('opportunity')}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
                         </View>

                       </View>

                       <View style={styles.spacer} />

                       {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                       {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                       {(this.state.searchIsAnimating) ? (
                         <View style={[styles.flexCenter,styles.fullSpace]}>
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
                             {(this.state.opportunityOptions && this.state.opportunityOptions.length > 0) && (
                               <View style={[styles.card,styles.topMargin]}>
                                 {this.state.opportunityOptions.map((value, optionIndex) =>
                                   <View key={value._id} style={[styles.bottomMargin5,styles.calcColumn80]}>
                                     <TouchableOpacity style={[styles.calcColumn80,styles.row5]} onPress={() => this.searchItemClicked(value, 'opportunity')}>
                                       <View style={[styles.calcColumn80,styles.rowDirection]}>
                                         <View style={styles.width40}>
                                           <View style={styles.miniSpacer} />
                                           <Image source={{ uri: opportunitiesIconDark}} style={[styles.square22,styles.contain]} />
                                         </View>
                                         <View style={styles.calcColumn120}>
                                           <Text style={[styles.ctaColor]}>{(value.title) ? value.title : value.name}{value.employerName && " | " + value.employerName}</Text>
                                         </View>
                                       </View>
                                     </TouchableOpacity>
                                   </View>
                                 )}
                               </View>
                             )}
                           </View>

                           <View>
                             {this.renderTags('opportunity')}
                           </View>

                         </View>
                       )}
                     </View>
                   )}

                   {(this.state.showPaths) && (
                     <View style={[styles.row10]}>
                       <Text style={[styles.descriptionText3]}>Tag a Career Path (Optional)</Text>
                       <View style={[styles.halfSpacer]} />

                       <View style={[styles.rowDirection]}>
                         <View style={[styles.calcColumn150]}>
                           <TextInput
                             style={styles.textInput}
                             onChangeText={(text) => this.formChangeHandler("searchCareers", text)}
                             value={this.state.searchCareers}
                             placeholder="Search over 1,000 career paths..."
                             placeholderTextColor="grey"
                           />
                         </View>
                         <View style={[styles.width70,styles.leftPadding]}>
                           <TouchableOpacity style={(this.state.unready) ? [styles.btnSquarish,styles.ctaBackgroundColor,styles.standardBorder,styles.mediumBackground,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.unready} onPress={() => this.addItem('career')}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
                         </View>

                       </View>

                       <View style={styles.spacer} />

                       {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                       {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                       {(this.state.searchIsAnimating) ? (
                         <View style={[styles.flexCenter,styles.fullSpace]}>
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
                             {(this.state.careerOptions && this.state.careerOptions.length > 0) && (
                               <View style={[styles.card,styles.topMargin]}>
                                 {this.state.careerOptions.map((value, optionIndex) =>
                                   <View key={value._id} style={[styles.bottomMargin5,styles.calcColumn80]}>
                                     <TouchableOpacity style={[styles.calcColumn80,styles.row5]} onPress={() => this.searchItemClicked(value, 'career')}>
                                       <View style={[styles.calcColumn80,styles.rowDirection]}>
                                         <View style={styles.width40}>
                                           <View style={styles.miniSpacer} />
                                           <Image source={{ uri: careerMatchesIconDark}} style={[styles.square22,styles.contain]} />
                                         </View>
                                         <View style={styles.calcColumn120}>
                                           <Text style={[styles.ctaColor]}>{value.name}</Text>
                                         </View>
                                       </View>
                                     </TouchableOpacity>
                                   </View>
                                 )}
                               </View>
                             )}
                           </View>

                           <View>

                             {this.renderTags('career')}


                           </View>

                         </View>
                       )}
                     </View>
                   )}

                   {(this.state.showTrends) && (
                     <View style={[styles.row10]}>
                       <Text style={[styles.descriptionText3]}>Tag a Labor Market Trend (Optional)</Text>
                       <View style={[styles.halfSpacer]} />

                       <View style={styles.rowDirection}>
                         <View style={styles.calcColumn150}>
                           <TextInput
                             style={styles.textInput}
                             onChangeText={(text) => this.formChangeHandler("searchTrends", text)}
                             value={this.state.searchTrends}
                             placeholder="Search labor market trends..."
                             placeholderTextColor="grey"
                           />
                         </View>
                         <View style={[styles.width70,styles.leftPadding]}>
                           <TouchableOpacity style={(this.state.unready) ? [styles.btnSquarish,styles.ctaBackgroundColor,styles.standardBorder,styles.mediumBackground,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.unready} onPress={() => this.addItem('trend')}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
                         </View>

                       </View>

                       <View style={styles.spacer} />

                       {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                       {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                       {(this.state.searchIsAnimating) ? (
                         <View style={[styles.flexCenter,styles.fullSpace]}>
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
                             {(this.state.trendOptions && this.state.trendOptions.length > 0) && (
                               <View style={[styles.card,styles.topMargin]}>
                                 {this.state.trendOptions.map((value, optionIndex) =>
                                   <View key={value._id} style={[styles.bottomMargin5,styles.calcColumn80]}>
                                     <TouchableOpacity style={[styles.calcColumn80,styles.row5]} onPress={() => this.searchItemClicked(value, 'trend')}>
                                       <View style={[styles.calcColumn80,styles.rowDirection]}>
                                         <View style={styles.width40}>
                                           <View style={styles.miniSpacer} />
                                           <Image source={{ uri: trendsIconDark}} style={[styles.square22,styles.contain]} />
                                         </View>
                                         <View style={styles.calcColumn120}>
                                           <Text>{value.name}</Text>
                                         </View>
                                         {(value.percentChange && Number(value.percentChange)) && (
                                           <View style={styles.width60}>
                                             {(Number(value.percentChange) > 0) ? (
                                               <Text style={[styles.ctaColor]}>{Number(value.percentChange).toFixed()}%</Text>
                                             ) : (
                                               <Text style={[styles.errorColor]}>{Number(value.percentChange).toFixed()}%</Text>
                                             )}
                                           </View>
                                         )}

                                       </View>
                                     </TouchableOpacity>
                                   </View>
                                 )}
                               </View>
                             )}
                           </View>

                           <View>
                             {this.renderTags('trend')}
                           </View>

                         </View>
                       )}
                     </View>
                   )}
                 </View>
               )}

               {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor]}>{this.state.errorMessage}</Text>}
               {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor]}>{this.state.successMessage}</Text>}

               <View style={[styles.row10]}>
                 <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.isSaving} onPress={() => this.postPost()}><Text style={[styles.descriptionText1,styles.whiteColor]}>Post</Text></TouchableOpacity>
               </View>

             </View>
          </View>
        </View>
      )
    }
}

export default CreatePost;
