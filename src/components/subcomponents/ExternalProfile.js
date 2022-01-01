import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, Share,Linking } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';

const defaultProfileImage = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-big.png';
const resumeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/resume-icon-big.png';
const linkedinIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/linkedin-icon-dark.png';
const websiteIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/website-icon-dark.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';
const passionIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/passion-icon-dark.png';
const messageIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/message-icon-white.png';
const hireIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/hire-icon-blue.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const pinIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/pin-icon.png';
const experienceIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/experience-icon.png';
const educationIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/education-icon.png';
const favoritesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-dark.png';
const trendsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/trends-icon-dark.png';
const likeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/like-icon-blue.png';
const likeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/like-icon-dark.png';
const commentIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/comment-icon-dark.png';
const shareIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/share-icon-dark.png';
const sendIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/send-icon-dark.png';
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png';
const careerMatchesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-dark.png';
const projectsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-dark.png';
const menuIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/menu-icon-dark.png';
const reportIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/report-icon-dark.png';
const hideIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/hide-icon-dark.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';
const defaultProfileBackgroundImage = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/default-profile-background-image.png';
const targetIconOrange = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/target-icon-orange.png';
const softwareDeveloperIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/software-developer.png';
const abilitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/abilities-icon-dark.png';
const socialIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-dark.png';
const skillsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/skills-icon.png';
const interestsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/interests-icon-dark.png';
const endorsementIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/endorsement-icon-dark.png';
const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png';

import ProjectDetails from '../../components/subcomponents/ProjectDetails';
import AssessmentResultsDetails from '../../components/subcomponents/AssessmentResultsDetails';
import EndorsementDetails from '../../components/common/EndorsementDetails';
import SubSendMessage from '../../components/common/SendMessage';
import SubComments from '../common/Comments';
import SubRenderPosts from '../common/RenderPosts';
import SubGoalDetails from '../common/GoalDetails';

import {convertDateToString} from '../functions/convertDateToString';

class ExternalProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      includeIconLabels: true,
      profileOptions: [],
      viewIndex: 0,
      selectedIndex: 0,

      posts: [],
      projects: [],
      goals: [],
      passions: [],
      assessments: [],
      endorsements: [],
      favorites: [],
      friends: [],
      selectedPeople: [],
      selectedLinks: [],
      selectedTimes: [],
      selectedProjects: [],
      selectedCareers: [],

      linkCategoryOptions: ['','Video','Event','Course','Article','Report','Job Opportunity','Other']
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.returnCount = this.returnCount.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.passData = this.passData.bind(this)
    this.logout = this.logout.bind(this)
    this.calculateMatchScore = this.calculateMatchScore.bind(this)
    this.favoriteItem = this.favoriteItem.bind(this)
    this.followPerson = this.followPerson.bind(this)
    this.testActiveFriendship = this.testActiveFriendship.bind(this)

    this.renderPost = this.renderPost.bind(this)
    this.calculateWidth = this.calculateWidth.bind(this)
    this.renderOriginalPost = this.renderOriginalPost.bind(this)
    this.selectAnswer = this.selectAnswer.bind(this)
    this.retrieveComments = this.retrieveComments.bind(this)
    this.retrieveLikes = this.retrieveLikes.bind(this)
    this.togglePostMenu = this.togglePostMenu.bind(this)
    this.renderShareButtons = this.renderShareButtons.bind(this)
    this.renderTags = this.renderTags.bind(this)
    this.itemClicked = this.itemClicked.bind(this)
    this.sendResource = this.sendResource.bind(this)

    this.removeItem = this.removeItem.bind(this)
    this.renderTaggedItem = this.renderTaggedItem.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in SubExternalProfile', this.props, prevProps)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      console.log('t0 will update')
      let emailId = AsyncStorage.getItem('email');
      const username = this.props.username
      this.retrieveData(username, emailId)
    // } else if (this.props.employers && this.props.employers.length !== prevProps.employers.length) {
    //   this.retrieveData()
    } else if (this.props.username !== prevProps.username) {
      let emailId = AsyncStorage.getItem('email');
      const username = this.props.username
      this.retrieveData(username, emailId)
    }
  }

  retrieveData = async() => {
    try {

      console.log('this is causing the error')
      const emailId = await AsyncStorage.getItem('email')
      // const username = await AsyncStorage.getItem('username');
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
        console.log('what is the email of this user', emailId);

        const source = this.props.source
        const matchScore = this.props.matchScore
        const username = this.props.username

        let profileOptions = ['All','Posts','Projects','Goals','Passions','Assessments','Endorsements']

        let loggedIn = false
        if (cuFirstName && emailId) {
          loggedIn = true
        }

        this.setState({ emailId, cuFirstName, cuLastName, activeOrg, orgFocus, roleName, username, profileOptions, source,
          matchScore, loggedIn
        })

        if (username) {
          console.log('show username: ', username)
          Axios.get('https://www.guidedcompass.com/api/users/profile/details/temporary/' + username)
          .then((response) => {
            if (response.data) {

              console.log('User details fetch worked', response.data)
              if (response.data.success) {

                let publicProfile = response.data.user.publicProfile
                let publicProfileExtent = response.data.user.publicProfileExtent
                let publicPreferences = response.data.user.publicPreferences
                const profileData = response.data.user
                const profileEmail = response.data.user.email
                const myOrgs = response.data.user.myOrgs
                let viewableProfile = false

                if (orgFocus && orgFocus !== 'Placement' && source === 'portal') {
                  publicProfile = true
                  viewableProfile = true
                } else if (publicProfile) {
                  viewableProfile = true
                }

                let postPublicPreference = null
                let publicPosts = []
                let projectPublicPreference = null
                let publicProjects = []
                let goalPublicPreference = null
                let publicGoals = []
                let passionPublicPreference = null
                let publicPassions = []
                let assessmentPublicPreference = null
                let publicAssessments = []
                let endorsementPublicPreference = null
                let publicEndorsements = []
                let resumePublicPreference = null
                let publicResume = null

                if (publicPreferences) {
                  for (let i = 1; i <= publicPreferences.length; i++) {
                    for (let i = 1; i <= publicPreferences.length; i++) {
                      if (publicPreferences[i - 1].name === 'Post') {
                        postPublicPreference = publicPreferences[i - 1].value
                        publicPosts = publicPreferences[i - 1].publicItems
                      } else if (publicPreferences[i - 1].name === 'Project') {
                        projectPublicPreference = publicPreferences[i - 1].value
                        publicProjects = publicPreferences[i - 1].publicItems
                      } else if (publicPreferences[i - 1].name === 'Goal') {
                        goalPublicPreference = publicPreferences[i - 1].value
                        publicGoals = publicPreferences[i - 1].publicItems
                      } else if (publicPreferences[i - 1].name === 'Passion') {
                        passionPublicPreference = publicPreferences[i - 1].value
                        publicPassions = publicPreferences[i - 1].publicItems
                      } else if (publicPreferences[i - 1].name === 'Assessment') {
                        assessmentPublicPreference = publicPreferences[i - 1].value
                        publicAssessments = publicPreferences[i - 1].publicItems
                      } else if (publicPreferences[i - 1].name === 'Endorsement') {
                        endorsementPublicPreference = publicPreferences[i - 1].value
                        publicEndorsements = publicPreferences[i - 1].publicItems
                      } else if (publicPreferences[i - 1].name === 'Resume') {
                        resumePublicPreference = publicPreferences[i - 1].value
                        if (publicPreferences[i - 1].publicItems && publicPreferences[i - 1].publicItems.length > 0) {
                          publicResume = publicPreferences[i - 1].publicItems[0]
                        }
                      }
                    }
                  }
                }

                if (orgFocus && orgFocus !== 'Placement' && source === 'portal') {
                  postPublicPreference = 'All'
                  projectPublicPreference = 'All'
                  goalPublicPreference = 'All'
                  passionPublicPreference = 'All'
                  assessmentPublicPreference = 'All'
                  endorsementPublicPreference = 'All'
                  resumePublicPreference = 'Yes'
                }

                this.setState({ profileData, publicProfile, viewableProfile, publicPreferences, postPublicPreference,
                  projectPublicPreference, goalPublicPreference, passionPublicPreference, assessmentPublicPreference,
                  endorsementPublicPreference, resumePublicPreference, publicResume
                })

                Axios.get('https://www.guidedcompass.com/api/friends', { params: { orgCode: activeOrg, emailId } })
                .then((response) => {
                  console.log('Friends query attempted', response.data);

                    if (response.data.success) {
                      console.log('friends query worked')

                      const friends = response.data.friends

                      if (publicProfile) {
                        if (!publicProfileExtent || publicProfileExtent === 'Public') {
                          viewableProfile = true
                        } else if (publicProfileExtent === 'Only Connections') {
                          if (this.testActiveFriendship(friends)) {
                            viewableProfile = true
                          }
                        } else if (publicProfileExtent === 'Only Connections and Members') {
                          if (this.testActiveFriendship(friends) || (profileData.myOrgs && profileData.myOrgs.includes(activeOrg))) {
                            viewableProfile = true
                          }
                        }
                      }

                      this.setState({ friends, viewableProfile })

                    } else {
                      console.log('friends query did not work', response.data.message)
                    }

                }).catch((error) => {
                    console.log('Friends query did not work for some reason', error);
                })

                if (postPublicPreference === 'All' || postPublicPreference === 'Some') {
                  Axios.get('https://www.guidedcompass.com/api/group-posts', { params: { emailId: profileEmail, onlyCUPosts: true } })
                  .then((response) => {
                    console.log('Group posts query attempted', response.data);

                      if (response.data.success) {
                        console.log('successfully retrieved posts')

                        if (response.data.groupPosts) {

                          let posts = []
                          if (postPublicPreference === 'Some') {
                            for (let i = 1; i <= response.data.groupPosts.length; i++) {
                              for (let j = 1; j <= publicPosts.length; j++) {
                                if (response.data.groupPosts[i - 1].name === publicPosts[j - 1]) {
                                  posts.push(i - 1)
                                }
                              }
                            }
                          } else {
                            posts = response.data.groupPosts
                          }

                          this.setState({ posts })

                        }

                      } else {
                        console.log('no post data found', response.data.message)
                      }

                  }).catch((error) => {
                      console.log('Post query did not work', error);
                  });
                }

                if (projectPublicPreference === 'All' || projectPublicPreference === 'Some') {
                  Axios.get('https://www.guidedcompass.com/api/projects', { params: { emailId: profileEmail, includeCollaborations: true } })
                  .then((response) => {
                    console.log('Projects query attempted', response.data);

                      if (response.data.success) {
                        console.log('successfully retrieved projects')

                        if (response.data.projects) {

                          let projects = []
                          if (projectPublicPreference === 'Some') {
                            for (let i = 1; i <= response.data.projects.length; i++) {
                              for (let j = 1; j <= publicProjects.length; j++) {
                                if (response.data.projects[i - 1].name === publicProjects[j - 1]) {
                                  projects.push(i - 1)
                                }
                              }
                            }
                          } else {
                            projects = response.data.projects
                          }

                          this.setState({ projects })

                        }

                      } else {
                        console.log('no project data found', response.data.message)
                      }

                  }).catch((error) => {
                      console.log('Project query did not work', error);
                  });
                }

                // retrieve orgs
                if (myOrgs) {
                  Axios.get('https://www.guidedcompass.com/api/org/details', { params: { orgCodes: myOrgs } })
                  .then((response) => {
                      console.log('Org details worked', response.data);

                      if (response.data.success) {
                        const orgs = response.data.orgs
                        this.setState({ orgs })
                      }


                  }).catch((error) => {
                      console.log('Org query did not work', error);
                  });
                }

                if (goalPublicPreference === 'All' || goalPublicPreference === 'Some') {
                  Axios.get('https://www.guidedcompass.com/api/logs/goals', { params: { emailId: profileEmail } })
                  .then((response) => {

                      if (response.data.success) {
                        console.log('Goals received query worked', response.data);

                        let goals = []
                        if (goalPublicPreference === 'Some') {
                          for (let i = 1; i <= response.data.goals.length; i++) {
                            for (let j = 1; j <= publicGoals.length; j++) {
                              if (response.data.goals[i - 1].title === publicGoals[j - 1]) {
                                goals.push(response.data.goals[i - 1])
                              }
                            }
                          }
                        } else {
                          goals = response.data.goals
                        }

                        this.setState({ goals })

                      } else {
                        console.log('no goal data found', response.data.message)
                      }

                  }).catch((error) => {
                      console.log('Goal query did not work', error);
                  });
                }

                if (passionPublicPreference === 'All' || passionPublicPreference === 'Some') {
                  Axios.get('https://www.guidedcompass.com/api/logs/passions', { params: { emailId: profileEmail } })
                  .then((response) => {

                      if (response.data.success) {
                        console.log('Passions received query worked', response.data);

                        let passions = []
                        if (passionPublicPreference === 'Some') {
                          for (let i = 1; i <= response.data.passions.length; i++) {
                            for (let j = 1; j <= publicPassions.length; j++) {
                              if (response.data.passions[i - 1].passionTitle === publicPassions[j - 1]) {
                                passions.push(response.data.passions[i - 1])
                              }
                            }
                          }
                        } else {
                          passions = response.data.passions
                        }

                        this.setState({ passions })

                      } else {
                        console.log('no passion data found', response.data.message)
                      }

                  }).catch((error) => {
                      console.log('Passion query did not work', error);
                  });
                }

                if (assessmentPublicPreference === 'All' || assessmentPublicPreference === 'Some') {
                  Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId } })
                   .then((response) => {
                     console.log('query for assessment results worked');

                     if (response.data.success) {

                       console.log('actual assessment results', response.data)

                       if (response.data.results) {

                         let assessments = []
                         const updatedAt = response.data.results.updatedAt
                         if (response.data.results.workPreferenceAnswers && response.data.results.workPreferenceAnswers.length > 0) {
                           const description = 'My specific preferences on where, how, and when I work'
                           profileData['workPreferences'] = response.data.results.workPreferenceAnswers

                           if (assessmentPublicPreference === 'All') {
                             assessments.push({ category: 'Work Preferences', description, updatedAt, results: response.data.results.workPreferenceAnswers })
                           } else if (assessmentPublicPreference === 'Some'){
                             if (publicAssessments.includes('Work Preferences')) {
                               assessments.push({ category: 'Work Preferences', description, updatedAt, results: response.data.results.workPreferenceAnswers })
                             }
                           }
                         }
                         if (response.data.results.interestScores && response.data.results.interestScores.length > 0) {
                           const description = 'My strong interest inventory assessment on what type of work I may like'
                           profileData['interests'] = response.data.results.interestScores

                           if (assessmentPublicPreference === 'All') {
                             assessments.push({ category: 'Interests', description, updatedAt, results: response.data.results.interestScores })
                           } else if (assessmentPublicPreference === 'Some'){
                             if (publicAssessments.includes('Interests')) {
                               assessments.push({ category: 'Interests', description, updatedAt, results: response.data.results.interestScores })
                             }
                           }
                         }
                         if (response.data.results.skillsScores && response.data.results.skillsScores.length > 0) {
                           const description = "Skills I think I'm good at and need work at based on my pathways of interest"
                           profileData['skills'] = response.data.results.skillsScores

                           if (assessmentPublicPreference === 'All') {
                             assessments.push({ category: 'Skills', description, updatedAt, results: response.data.results.skillsScores })
                           } else if (assessmentPublicPreference === 'Some'){
                             if (publicAssessments.includes('Skills')) {
                               assessments.push({ category: 'Skills', description, updatedAt, results: response.data.results.skillsScores })
                             }
                           }
                         }
                         if (response.data.results.personalityScores) {
                           const description = "Five factor personality assessment"
                           profileData['personality'] = response.data.results.personalityScores

                           if (assessmentPublicPreference === 'All') {
                             assessments.push({ category: 'Personality', description, updatedAt, results: response.data.results.personalityScores })
                           } else if (assessmentPublicPreference === 'Some'){
                             if (publicAssessments.includes('Personality')) {
                               assessments.push({ category: 'Personality', description, updatedAt, results: response.data.results.personalityScores })
                             }
                           }
                         }
                         if (response.data.results.topGravitateValues && response.data.results.topGravitateValues.length > 0 && response.data.results.topEmployerValues && response.data.results.topEmployerValues.length > 0) {
                           const description = 'The people and employers I gravitate towards'
                           profileData['values'] = { topGravitateValues: response.data.results.topGravitateValues, topEmployerValues: response.data.results.topEmployerValues }

                           if (assessmentPublicPreference === 'All') {
                             assessments.push({ category: 'Values', description, updatedAt, results: { topGravitateValues: response.data.results.topGravitateValues, topEmployerValues: response.data.results.topEmployerValues }})
                           } else if (assessmentPublicPreference === 'Some'){
                             if (publicAssessments.includes('Values')) {
                               assessments.push({ category: 'Values', description, updatedAt, results: { topGravitateValues: response.data.results.topGravitateValues, topEmployerValues: response.data.results.topEmployerValues }})
                             }
                           }
                         }

                         this.setState({ assessments });
                         // this.calculateMatchScore(selectedMentor, cuProfile)
                       }

                     } else {
                       console.log('error response', response.data)

                       this.setState({ resultsErrorMessage: response.data.message })
                     }

                 }).catch((error) => {
                     console.log('query for assessment results did not work', error);
                 })
                }

                if (endorsementPublicPreference === 'All' || endorsementPublicPreference === 'Some') {
                  // retrieve endorsements
                  Axios.get('https://www.guidedcompass.com/api/story', { params: { emailId: profileEmail } })
                  .then((response) => {
                      console.log('Story query worked', response.data);

                      if (response.data.success) {

                        let endorsements = []
                        if (endorsementPublicPreference === 'Some') {
                          for (let i = 1; i <= response.data.stories.length; i++) {
                            for (let j = 1; j <= publicEndorsements.length; j++) {
                              const compareTerm = response.data.stories[i - 1].senderFirstName + ' ' + response.data.stories[i - 1].senderLastName + ' - ' + response.data.stories[i - 1].createdAt.substring(0,10)
                              if (compareTerm === publicEndorsements[j - 1]) {
                                endorsements.push(i - 1)
                              }
                            }
                          }
                        } else {
                          endorsements = response.data.stories
                        }

                        this.setState({ endorsements })
                      }

                  }).catch((error) => {
                      console.log('Story query did not work', error);
                  });
                }

                Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: emailId } })
                .then((response) => {
                  console.log('User details query 1 attempted', response.data);

                  if (response.data.success) {
                     console.log('successfully retrieved user details')

                     let cuProfile = {}
                     cuProfile['firstName'] = response.data.user.firstName
                     cuProfile['lastName'] = response.data.user.lastName
                     cuProfile['email'] = response.data.user.email
                     cuProfile['zipcode'] = response.data.user.zipcode

                     // pulling these out for followPerson()
                     const pictureURL = response.data.user.pictureURL
                     const headline = response.data.user.headline

                     this.setState({ cuProfile, pictureURL, headline });

                     Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId } })
                      .then((response2) => {
                        console.log('query for assessment results worked');

                        if (response2.data.success) {

                          console.log('actual assessment results', response2.data)

                          // let profile = { firstName: cuFirstName, lastName: cuLastName, email: emailId }
                          cuProfile['workPreferences'] = response2.data.results.workPreferenceAnswers
                          cuProfile['interests'] = response2.data.results.interestScores
                          cuProfile['personality'] = response2.data.results.personalityScores
                          cuProfile['skills'] = response2.data.results.newSkillAnswers
                          cuProfile['gravitateValues'] = response2.data.results.topGravitateValues
                          cuProfile['employerValues'] = response2.data.results.topEmployerValues

                          this.calculateMatchScore(profileData, cuProfile)

                        } else {
                          console.log('no assessment results', response2.data)
                        }

                    }).catch((error) => {
                      console.log('query for assessment results did not work', error);
                    })

                  } else {
                   console.log('no user details data found', response.data.message)
                  }

                }).catch((error) => {
                   console.log('User details query did not work', error);
                });
              } else {
                console.log('there was an error', response.data.message)
              }

            }
          }).catch((error) => {
              console.log('User details fetch did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId } })
         .then((response) => {
           console.log('Favorites query attempted', response.data);

           if (response.data.success) {
             console.log('successfully retrieved favorites')

             const favorites = response.data.favorites
             this.setState({ favorites })

           } else {
             console.log('no favorites data found', response.data.message)
           }

         }).catch((error) => {
             console.log('Favorites query did not work', error);
         });
        }
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  calculateMatchScore(selectedMentor,cuProfile) {
    console.log('calculateMatchScore called', selectedMentor, cuProfile)

    let roleNames = ['Mentor']
    let orgCode = null
    let onlyPics = false

    this.setState({ animating: true })

    Axios.put('https://www.guidedcompass.com/api/members/matches', { profile: cuProfile, roleNames, orgCode, onlyPics, memberId: selectedMentor._id })
    .then((response) => {
      console.log('Opportunity matches attempted', response.data);

        if (response.data.success) {
          console.log('opportunity match query worked')

          let matchScore = 0
          if (response.data.members && response.data.members.length > 0) {
            matchScore = response.data.members[0].matchScore
          }

          this.setState({ animating: false, selectedMentor, matchScore })

        } else {
          console.log('Career match did not work', response.data.message)
          this.setState({ animating: false, matchingView: true, errorMessage: 'there was an error: ' + response.data.message, selectedMentor })
        }

    }).catch((error) => {
        console.log('Career match did not work for some reason', error);
        this.setState({ animating: false, matchingView: true, errorMessage: 'there was an error', selectedMentor })
    });
  }

  returnCount(value) {
    console.log('returnCount called', value)

    if (value === 'All') {
      let allCount = 0
      if (this.state.posts) {
        allCount = allCount + this.state.posts.length
      }
      if (this.state.projects) {
        allCount = allCount + this.state.projects.length
      }
      if (this.state.passions) {
        allCount = allCount + this.state.passions.length
      }
      if (this.state.goals) {
        allCount = allCount + this.state.goals.length
      }
      if (this.state.assessments) {
        allCount = allCount + this.state.assessments.length
      }
      if (this.state.endorsements) {
        allCount = allCount + this.state.endorsements.length
      }

      return allCount
    } else if (value === 'Posts') {
      return this.state.posts.length
    } else if (value === 'Projects') {
      return this.state.projects.length
    } else if (value === 'Goals') {
      return this.state.goals.length
    } else if (value === 'Passions') {
      return this.state.passions.length
    } else if (value === 'Assessments') {
      return this.state.assessments.length
    } else if (value === 'Endorsements') {
      return this.state.endorsements.length
    }
  }

  closeModal() {

    this.setState({ modalIsOpen: false, showProjectDetail: false, showAssessmentDetail: false, showEndorsementDetail: false,
      showMessageWidget: false, showComments: false, showShareButtons: false, showGoalDetails: false, showHelpOutWidget: false,
      showPassionDetail: false, selectedPassion: null, selectedGoal: null
    });

  }

  passData(passedData) {
    console.log('passData called', passedData)

    if (passedData && passedData.success) {
      const cuFirstName = passedData.user.firstName
      const cuLastName = passedData.user.lastName
      const emailId = passedData.user.email
      const activeOrg = passedData.user.activeOrg
      const roleName = passedData.user.roleName
      const username = passedData.user.username
      const orgFocus = passedData.user.orgFocus

      this.setState({ emailId, activeOrg, orgFocus, roleName, username, cuFirstName, cuLastName })

    } else if (passedData && !passedData.success) {
      this.setState({ errorMessage: passedData.message })
    }
  }

  logout() {
    console.log('logout called')

    AsyncStorage.removeItem('email')//this.props.auth.email
    AsyncStorage.removeItem('username')
    AsyncStorage.removeItem('firstName')
    AsyncStorage.removeItem('lastName')
    AsyncStorage.removeItem('isAdvisor')
    AsyncStorage.removeItem('unreadNotificationsCount')
    AsyncStorage.removeItem('orgAffiliation')
    AsyncStorage.removeItem('myOrgs')
    AsyncStorage.removeItem('activeOrg')
    AsyncStorage.removeItem('orgName')
    AsyncStorage.removeItem('orgFocus')
    AsyncStorage.removeItem('roleName')
    AsyncStorage.removeItem('studentAlias')
    AsyncStorage.removeItem('workMode')
    AsyncStorage.removeItem('accountCode')

    const signInPage = true
    const emailId = null
    const activeOrg = null
    const orgFocus = null
    const roleName = null
    const username = null
    this.setState({ signInPage, emailId, activeOrg, orgFocus, roleName, username })

  }

  favoriteItem(e, item, type) {
    console.log('favoriteItem called', e, item, type)

    e.preventDefault()
    e.stopPropagation()

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    let itemId = item._id

    let favoritesArray = this.state.favorites
    if (favoritesArray.includes(itemId)) {
      const index = favoritesArray.indexOf(itemId)
      favoritesArray.splice(index, 1)
    } else {
      favoritesArray.push(itemId)
    }


    Axios.post('https://www.guidedcompass.com/api/favorites/save', {
      favoritesArray, emailId: this.state.emailId
    })
    .then((response) => {
      console.log('attempting to save addition to favorites')
      if (response.data.success) {
        console.log('saved addition to favorites', response.data)

        this.setState({ successMessage: 'Saved as a favorite!', favorites: favoritesArray, isSaving: false })

      } else {
        console.log('did not save successfully')
        this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false})
    });
  }

  followPerson(person) {
    console.log('followPerson called', person)

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    const senderPictureURL = this.state.pictureURL
    const senderEmail = this.state.emailId
    const senderFirstName = this.state.cuFirstName
    const senderLastName = this.state.cuLastName
    const senderUsername = this.state.username
    const senderHeadline = this.state.headline
    const recipientPictureURL = person.pictureURL
    const recipientEmail = person.email
    const recipientFirstName = person.firstName
    const recipientLastName = person.lastName
    const recipientUsername = person.username
    const recipientHeadline = person.headline
    const relationship = 'Peer'
    const orgCode = this.state.activeOrg
    const orgName = this.state.orgName

    const friend = {
      senderPictureURL, senderEmail, senderFirstName, senderLastName, senderUsername, senderHeadline,
      recipientPictureURL, recipientEmail, recipientFirstName, recipientLastName, recipientUsername, recipientHeadline,
      relationship, orgCode, orgName }

    Axios.post('https://www.guidedcompass.com/api/friend/request', friend)
    .then((response) => {

      if (response.data.success) {

        friend['active'] = false
        friend['friend2Email'] = recipientEmail

        let friends = this.state.friends
        friends.push(friend)
        console.log('show friends: ', friends)
        this.setState({ successMessage: response.data.message, friends })

      } else {

        this.setState({ errorMessage: response.data.message })
      }
    }).catch((error) => {
        console.log('Advisee request send did not work', error);
    });
  }

  testActiveFriendship(friends) {
    console.log('testActiveFriendship called', friends)

    let friendshipIsActive = false
    const index = friends.findIndex(friend => (friend.friend1Email === this.state.profileData.email) || friend.friend2Email === this.state.profileData.email);

    if (index || index === 0) {
      friendshipIsActive = true
    }

    return friendshipIsActive
  }

  calculateWidth(item, answer) {
    console.log('calculateWidth called', item, answer)

    let width = '0%'

    let aValue = 0
    if (item.aVotes) {
      aValue = item.aVotes.length
    }

    let bValue = 0
    if (item.bVotes) {
      bValue = item.bVotes.length
    }

    let totalValue = aValue + bValue
    if (totalValue > 0) {
      if (answer === 'a') {
        width = ((aValue / (aValue + bValue)) * 100).toString() + '%'
      } else {
        width = ((bValue / (bValue + aValue)) * 100).toString() + '%'
      }
    }

    return width
  }

  renderPost(value, index, inModal) {
    console.log('renderPost called', value)

    if (value) {
      let defaultProfileItemIcon = projectsIconDark
      if (value.profileItem) {
        if (value.profileItem === 'Experience') {
          defaultProfileItemIcon = experienceIcon
        } else if (value.profileItem === 'Education') {
          defaultProfileItemIcon = educationIcon
        } else if (value.profileItem === 'Career Goal') {
          defaultProfileItemIcon = targetIconOrange
        } else if (value.profileItem === 'Passion') {
          defaultProfileItemIcon = favoritesIconDark
        }
      }

      return (
        <View key={value}>

          <View className={(!inModal) && "card-clear-padding padding-20 top-margin-20"}>
            <View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value.username })} className="background-button standard-color profile-container-right calc-column-offset-30">
                <View className="fixed-column-55">
                  {(value.roleName === 'Admin') ? (
                    <Image source={(value.pictureURL) ? { uri: value.pictureURL} : { uri: profileIconDark}} className="image-40-fit" />
                  ) : (
                    <Image source={(value.pictureURL) ? { uri: value.pictureURL} : { uri: profileIconDark}} className="profile-thumbnail-43" />
                  )}
                </View>
                <View className="calc-column-offset-55">
                  <View className="calc-column-offset-25">
                    <Text className="description-text-1 bold-text">{value.firstName} {value.lastName}</Text>
                  </View>
                  {(value.pinned) && (
                    <View className="fixed-column-25 top-padding-5 left-padding">
                      <Image source={{ uri: pinIcon}} className="image-auto-10" />
                    </View>
                  )}
                  <View className="clear" />

                  <View className="mini-spacer" /><View className="mini-spacer" />

                  {(value.headline && value.headline !== '') ? (
                    <View>
                      <Text className="description-text-3 description-text-color">{value.headline}</Text>
                    </View>
                  ) : (
                    <View>
                      {(value.education && value.education[0] && value.education[0].name && value.education[0].isContinual) ? (
                        <View>
                          {console.log('show edu: ', value.education)}
                          <Text className="description-text-3 description-text-color">Student @ {value.education[0].name}</Text>
                        </View>
                      ) : (
                        <View>
                          <View>
                            <Text className="description-text-3 description-text-color">{this.state.orgName} Member</Text>
                          </View>
                        </View>
                      )}
                    </View>
                  )}
                  <Text className="description-text-4 description-text-color">{convertDateToString(value.createdAt,"daysAgo")}</Text>
                </View>
              </TouchableOpacity>

              <View className="profile-modal-right">
                <View>
                  <View className="fixed-column-55">
                    <Image source={(value.pictureURL) ? { uri: value.pictureURL} : { uri: profileIconDark}} className="profile-thumbnail-43" />
                  </View>
                  <View className="calc-column-offset-55">
                    <Text className="description-text-2 bold-text">{value.firstName} {value.lastName}</Text>

                    {(value.headline && value.headline !== '') ? (
                      <View>
                        <Text className="description-text-4 description-text-color">{value.headline}</Text>
                      </View>
                    ) : (
                      <View>
                        {(value.education && value.education[0] && value.education[0].name && value.education[0].isContinual) ? (
                          <View>
                            <Text className="description-text-4 description-text-color">Student @ {value.education[0].name}</Text>
                          </View>
                        ) : (
                          <View>
                            <View>
                              <Text className="description-text-4 description-text-color">{this.state.orgName} Member</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    )}

                    <Text className="description-text-4 description-text-color">{convertDateToString(value.createdAt,"daysAgo")}</Text>
                  </View>
                  <View className="clear" />
                </View>

                <View className="top-padding-20">
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages', { recipient: value })} className="btn btn-squarish full-width"><Text>Message</Text></TouchableOpacity>
                </View>
              </View>

              <View className="fixed-column-30">
                <TouchableOpacity onPress={(value.showPostMenu) ? () => this.togglePostMenu(index) : () => this.togglePostMenu(index)} className="background-button">
                  <View className="row-5 horizontal-padding-4">
                    <Image source={{ uri: menuIconDark}} className="image-15-auto pin-right" />
                  </View>
                </TouchableOpacity>
                {(value.showPostMenu) && (
                  <View className="menu-bottom description-text-3">
                    <TouchableOpacity className="background-button full-width left-text" onPress={() => this.setState({ modalIsOpen: true, showShareButtons: true, selectedIndex: index })}>
                      <View className="row-5">
                        <View className="fixed-column-25">
                          <Image source={{ uri: shareIconDark}} className="image-auto-15" />
                        </View>
                        <View className="calc-column-offset-25">
                          <Text>Share outside of Guided Compass</Text>
                        </View>
                        <View className="clear" />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="background-button full-width left-text" onPress={() => this.setState({ modalIsOpen: true, adjustFeedPreferences: true, selectedIndex: index })}>
                      <View className="row-5">
                        <View className="fixed-column-25">
                          <Image source={{ uri: hideIconDark}} className="image-auto-15" />
                        </View>
                        <View className="calc-column-offset-25">
                          <Text>I don't want to see this</Text>
                        </View>
                        <View className="clear" />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity className="background-button full-width left-text" onPress={() => this.setState({ modalIsOpen: true, reportPostView: true, selectedIndex: index })}>
                      <View className="row-5">
                        <View className="fixed-column-25">
                          <Image source={{ uri: reportIconDark}} className="image-auto-15" />
                        </View>
                        <View className="calc-column-offset-25">
                          <Text>Report this post</Text>
                        </View>
                        <View className="clear" />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
              <View className="clear" />
            </View>

            <View className="row-10">
              <Text className={(value.postType === 'alternatives') ? "" : "description-text-2"}>{value.message}</Text>
              {(value.url) && (
                <TouchableOpacity className="description-text-3 top-padding bold-text" onPress={() => Linking.openURL(value.url)}><Text>{value.url}</Text></TouchableOpacity>
              )}

              {(value.postType === 'alternatives') && (
                <View className="top-padding">

                  <View className="row-10">
                    <TouchableOpacity className="background-button full-width left-text" onPress={() => this.showPollDetails(value, index)}>
                      <View>
                        <View className="float-left">
                          <Text className="description-text-3 cta-color">{(value.showPollDetails) ? "Collapse Details" : "Expand Details"}</Text>
                        </View>
                        <View className="float-left left-padding top-padding-5">
                          <Image source={{ uri: dropdownArrow}} className="image-auto-8 pin-right" />
                        </View>
                        <View className="clear" />

                      </View>
                    </TouchableOpacity>

                    {(value.showPollDetails) && (
                      <View>
                        <View className="row-10">

                          {(value.aItem) && (
                            <View>
                              <View>
                                {(value.comparisonType === 'Projects') && (
                                  <View>
                                    {this.renderTaggedItem(value, 'project', 'a')}
                                  </View>
                                )}
                                {(value.comparisonType === 'Careers') && (
                                  <View>
                                    {this.renderTaggedItem(value, 'career','a')}
                                  </View>
                                )}
                                {(value.comparisonType === 'Competencies') && (
                                  <View>
                                    {this.renderTaggedItem(value, 'competency','a')}
                                  </View>
                                )}
                                {(value.comparisonType === 'Jobs') && (
                                  <View>
                                    {this.renderTaggedItem(value, 'work','a')}
                                  </View>
                                )}
                              </View>
                            </View>
                          )}
                          <Text className="description-text-3">{value.aCase}</Text>
                        </View>

                        <View className="row-10">
                          {(value.bItem) && (
                            <View>
                              <View>
                                {(value.comparisonType === 'Projects') && (
                                  <View>
                                    {this.renderTaggedItem(value,'project','b')}
                                  </View>
                                )}
                                {(value.comparisonType === 'Careers') && (
                                  <View>
                                    {this.renderTaggedItem(value, 'career','b')}
                                  </View>
                                )}
                                {(value.comparisonType === 'Competencies') && (
                                  <View>
                                    {this.renderTaggedItem(value, 'competency','b')}
                                  </View>
                                )}
                                {(value.comparisonType === 'Jobs') && (
                                  <View>
                                    {this.renderTaggedItem(value, 'work','b')}
                                  </View>
                                )}
                              </View>
                            </View>
                          )}
                          <Text className="description-text-3">{value.bCase}</Text>
                        </View>
                      </View>
                    )}
                  </View>

                  {((value.aVotes && value.aVotes.includes(this.state.emailId)) || (value.bVotes && value.bVotes.includes(this.state.emailId))) ? (
                    <View>
                      <TouchableOpacity className="background-button full-width" onPress={() => this.selectAnswer(value, index,'a')}>
                        <View>
                          <View className="progress-bar-fat" >
                            <View className="filler-error" style={{ width: this.calculateWidth(value, 'a'), zIndex: -1, height: '36px' }} />
                            <View className="row-10 horizontal-padding " style={{ marginTop: '-36px'}}>
                              <View className="calc-column-offset-40 left-text">
                                <Text className="description-text-2 curtail-text">{value.aName}</Text>
                              </View>
                              <View className="fixed-column-40 right-text">
                                <Text className="description-text-2 curtail-text">{this.calculateWidth(value, 'a')}</Text>
                              </View>
                              <View className="clear" />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity className="background-button full-width" onPress={() => this.selectAnswer(value, index,'b')}>
                        <View>
                          <View className="progress-bar-fat" >
                            <View className="filler-error" style={{ width: this.calculateWidth(value, 'b'), zIndex: -1, height: '36px' }} />
                            <View className="row-10 horizontal-padding" style={{ marginTop: '-36px'}}>
                              <View className="calc-column-offset-40 left-text">
                                <Text className="description-text-2 curtail-text">{value.bName}</Text>
                              </View>
                              <View className="fixed-column-40 right-text">
                                <Text className="description-text-2 curtail-text">{this.calculateWidth(value, 'b')}</Text>
                              </View>
                              <View className="clear" />
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View>
                      <TouchableOpacity className="background-button full-width" onPress={() => this.selectAnswer(value, index,'a')}>
                        <View className="row-10 horizontal-padding cta-border">
                          <Text className="description-text-2">{value.aName}</Text>
                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity className="background-button full-width" onPress={() => this.selectAnswer(value, index,'b')}>
                        <View className="row-10 horizontal-padding cta-border">
                          <Text className="description-text-2">{value.bName}</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}
                </View>
              )}

            </View>

            {(value.imageURL) && (
              <View className="row-10">
                <Image source={{ uri: value.imageURL}} className="image-full-auto" />
              </View>
            )}

            {(value.videoURL) && (
              <View className="row-10">
                <View className="spacer"/>

                <View>
                  <View className="video-container">
                    {/*
                    <iframe
                      title="videoLink"
                      className="video-iframe"
                      src={`${value.videoURL}`}
                      frameBorder="0"
                    />*/}
                  </View>

                </View>

                <View className="clear" />
                <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
              </View>
            )}

            {(value.profileItem) && (
              <View className="bottom-padding">
                <View className="cta-border">
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value.profileItem.username })} className="background-button standard-color padding-20 full-width">
                    <View className="padding-20">
                      <View className="fixed-column-60">
                        <Image source={(value.profileItem.imageURL) ? { uri: value.profileItem.imageURL} : { uri: defaultProfileItemIcon}} className="image-50-fit" />
                      </View>
                      <View className="calc-column-offset-60">
                        <Text>{value.profileItem.name}</Text>
                        {(value.profileItem.category === 'Project') && (
                          <Text className="description-text-3 description-text-color">{value.profileItem.category} | {value.profileItem.hours} Hours</Text>
                        )}
                        {(value.profileItem.category === 'Experience') && (
                          <Text className="description-text-3 description-text-color">{value.profileItem.startDate} - {value.profileItem.endDate}</Text>
                        )}
                        {(value.profileItem.category === 'Education') && (
                          <Text className="description-text-3 description-text-color">{value.profileItem.startDate} - {value.profileItem.endDate}</Text>
                        )}
                        {(value.profileItem.category === 'Career Goal') && (
                          <Text className="description-text-3 description-text-color">Deadline: {value.profileItem.deadline}</Text>
                        )}
                        {(value.profileItem.category === 'Passion') && (
                          <Text className="description-text-3 description-text-color">Last Updated {value.profileItem.updatedAt}</Text>
                        )}

                      </View>
                      <View className="clear" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {(value.opportunityTags && value.opportunityTags.length > 0) && (
              <View className="bottom-padding">
                <View className="cta-border">
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: value.opportunityTags[0] })} className="background-button standard-color padding-20 full-width">
                    <View className="padding-20">
                      <View className="fixed-column-60">
                        <Image source={(value.opportunityTags[0].imageURL) ? { uri: value.opportunityTags[0].imageURL} : { uri: opportunitiesIconDark}} className="image-50-fit" />
                      </View>
                      <View className="calc-column-offset-60">
                        {(value.opportunityTags[0].title) ? (
                          <Text>{value.opportunityTags[0].title}</Text>
                        ) : (
                          <Text>{value.opportunityTags[0].name}</Text>
                        )}

                        {(value.opportunityTags[0].employerName) && (
                          <Text className="description-text-3 description-text-color">{value.opportunityTags[0].employerName}</Text>
                        )}

                      </View>
                      <View className="clear" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {(value.careerTags && value.careerTags.length > 0) && (
              <View className="bottom-padding">
                <View className="cta-border">
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { selectedCareer: value.careerTags[0] })} className="background-button standard-color padding-20 full-width">
                    <View className="padding-20">
                      <View className="fixed-column-60">
                        <Image source={(value.careerTags[0].imageURL) ? { uri: value.careerTags[0].imageURL} : { uri: careerMatchesIconDark}} className="image-50-fit" />
                      </View>
                      <View className="calc-column-offset-60">
                        <Text>{value.careerTags[0].name}</Text>
                        <Text className="description-text-3 description-text-color">{value.careerTags[0].jobFamily}</Text>

                        {(value.careerTags[0].marketData) && (
                          <Text className="description-text-3 description-text-color"> | ${Number(value.careerTags[0].marketData.pay).toLocaleString()} avg pay</Text>
                        )}

                      </View>
                      <View className="clear" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {(value.trendTags && value.trendTags.length > 0) && (
              <View className="bottom-padding">
                <View className="cta-border">
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Paths', { subNavSelected: 'Trends' })} className="background-button standard-color padding-20 full-width">
                    <View className="padding-20">
                      <View className="fixed-column-60">
                        <Image source={(value.trendTags[0].imageURL) ? { uri: value.trendTags[0].imageURL} : { uri: trendsIconDark}} className="image-50-fit" />
                      </View>
                      <View className="calc-column-offset-120">
                        <Text>{value.trendTags[0].name}</Text>
                        <Text className="description-text-3 description-text-color">{value.trendTags[0].category}</Text>
                      </View>

                      {(value.trendTags[0].percentChange) && (
                        <View className="fixed-column-60">
                          <Text className="heading-text-3 cta-color full-width right-text">{Number(value.trendTags[0].percentChange).toFixed()}%</Text>
                          <Text className="description-text-5 full-width right-text">increase in U.S. jobs</Text>
                        </View>
                      )}

                      <View className="clear" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {(value.tags && value.tags.length > 0) && (
              <View className="bottom-padding">
                {value.tags.map((item2, index2) =>
                  <View key={index2} className="float-left right-padding top-padding">
                    <View className="tag-container-thin">
                      <Text className="description-text-4">{item2}</Text>
                    </View>
                  </View>
                )}
                <View className="clear" />
              </View>
            )}

            {(value.entityTags && value.entityTags.length > 0) && (
              <View className="top-padding">
                {value.entityTags.map((value2, optionIndex2) =>
                  <View key={value2} className="float-left right-padding">
                    <TouchableOpacity className="background-button standard-color" onPress={() => this.props.navigation.navigate('Profile', { username: value2.username })}>
                      <Image source={(value2.pictureURL) ? { uri: value2.pictureURL} : { uri: profileIconDark}} className="image-auto-20" />
                    </TouchableOpacity>
                  </View>
                )}
                <View className="clear" />
              </View>
            )}

            {(value.originalPost && value.originalPost.message) && (
              <View className="cta-border padding-20">
                {this.renderOriginalPost(value)}
              </View>
            )}

            {(value.upvotes || (value.comments && value.comments.length > 0)) && (
              <View className="bottom-padding-5">
                <View className="fixed-column-130">
                  <TouchableOpacity onPress={() => this.retrieveLikes(index)} className="background-button">
                    <Text className="description-text-4">{(value.upvotes) ? value.upvotes.length : 0} Upvotes</Text>
                  </TouchableOpacity>
                  <Text className="description-text-4 horizontal-padding-7">&#8226;</Text>
                  <TouchableOpacity onPress={() => this.retrieveComments(index)} className="background-button">
                    <Text className="description-text-4">{(value.commentCount) ? value.commentCount : 0} Comments</Text>
                  </TouchableOpacity>
                </View>

                <View className="clear" />

              </View>
            )}

            <View className="spacer" />
            <View style={[styles.horizontalLine]} />

            {(!inModal) && (
              <View className="top-padding">
                <View className="float-left">
                  <TouchableOpacity onPress={(e) => this.voteOnItem(e, value, 'up', index) } className="background-button">
                    <View className="float-left right-padding-8">
                      <Image source={(value.upvotes.includes(this.state.emailId))? { uri: likeIconBlue} : { uri: likeIconDark}} className="image-auto-18 center-horizontally" />
                    </View>
                    <View className="float-left right-padding-20">
                      <Text className={(value.upvotes.includes(this.state.emailId)) ? "description-text-2 cta-color bold-text" : "description-text-2"}>{(value.upvotes.includes(this.state.emailId)) ? "Liked" : "Like"}</Text>
                    </View>
                    <View className="clear" />
                  </TouchableOpacity>
                </View>

                <View className="float-left">
                  <TouchableOpacity onPress={() => this.retrieveComments(index)} className="background-button" disabled={this.state.isLoading}>
                    <View className="float-left right-padding-8">
                      <View className="mini-spacer"/><View className="mini-spacer"/><View className="mini-spacer"/>
                      <Image source={{ uri: commentIconDark}} className="image-auto-18 center-horizontally" />
                    </View>
                    <View className="float-left right-padding-20">
                      <Text className="description-text-2">Comment</Text>
                    </View>
                    <View className="clear" />
                  </TouchableOpacity>
                </View>

                <View className="float-left">
                  <TouchableOpacity onPress={(value.originalPost && value.originalPost.message) ? () => this.setState({ modalIsOpen: true, sharePosting: true, originalPost: value.originalPost, selectedIndex: index }) : () => this.setState({ modalIsOpen: true, sharePosting: true, originalPost: value, selectedIndex: index })} className="background-button">
                    <View className="float-left right-padding-8">
                      <Image source={{ uri: shareIconDark}} className="image-auto-18 center-horizontally" />
                    </View>
                    <View className="float-left right-padding-20">
                      <Text className="description-text-2">Share</Text>
                    </View>
                    <View className="clear" />
                  </TouchableOpacity>
                </View>
                <View className="float-left">
                  <TouchableOpacity className="background-button standard-color" onPress={() => this.props.navigation.navigate('Messages', { generalPost: value })}>
                    <View className="float-left right-padding-8">
                      <Image source={{ uri: sendIconDark}} className="image-auto-18 center-horizontally" />
                    </View>
                    <View className="float-left right-padding-20">
                      <Text className="description-text-2">Send</Text>
                    </View>
                    <View className="clear" />
                  </TouchableOpacity>
                </View>

                <View className="clear" />
              </View>
            )}
          </View>
        </View>
      )
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
        defaultProfileItemIcon = targetIconOrange
      } else if (value.profileItem === 'Passion') {
        defaultProfileItemIcon = favoritesIconDark
      }
    }

    return (
      <View key="originalPost">
        <View>
          <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value.originalPost.username })} className="background-button standard-color profile-container-right calc-column-offset-30">
            <View className="fixed-column-55">
              {(value.originalPost.roleName === 'Admin') ? (
                <Image source={(value.originalPost.pictureURL) ? { uri: value.originalPost.pictureURL} : { uri: profileIconDark}} className="image-40-fit" />
              ) : (
                <Image source={(value.originalPost.pictureURL) ? { uri: value.originalPost.pictureURL} : { uri: profileIconDark}} className="profile-thumbnail-43" />
              )}
            </View>
            <View className="calc-column-offset-55">
              <View className="calc-column-offset-25">
                <Text className="description-text-1 bold-text">{value.originalPost.firstName} {value.originalPost.lastName}</Text>
              </View>
              <View className="clear" />

              <View className="mini-spacer" /><View className="mini-spacer" />

              {(value.originalPost.headline && value.originalPost.headline !== '') ? (
                <View>
                  <Text className="description-text-3 description-text-color">{value.originalPost.headline}</Text>
                </View>
              ) : (
                <View>
                  {(value.originalPost.education && value.originalPost.education[0] && value.originalPost.education[0].name && value.originalPost.education[0].isContinual) ? (
                    <View>
                      <Text className="description-text-3 description-text-color">Student @ {value.originalPost.education[0].name}</Text>
                    </View>
                  ) : (
                    <View>
                      <View>
                        <Text className="description-text-3 description-text-color">{this.state.orgName} Member</Text>
                      </View>
                    </View>
                  )}
                </View>
              )}
              <Text className="description-text-4 description-text-color">{convertDateToString(value.originalPost.createdAt,"daysAgo")}</Text>
            </View>
          </TouchableOpacity>

          <View className="fixed-column-30">

          </View>
          <View className="clear" />
        </View>

        <View className="row-10">
          <Text className="description-text-2">{value.originalPost.message}</Text>

          {(value.originalPost.url) && (
            <TouchableOpacity className="description-text-3 top-padding bold-text" onPress={() => Linking.openURL(value.url)}><Text>{value.originalPost.url}</Text></TouchableOpacity>
          )}
        </View>
        {(value.originalPost.imageURL) && (
          <View className="row-10">
            <Image source={{ uri: value.originalPost.imageURL}} className="image-full-auto" />
          </View>
        )}

        {(value.originalPost.videoURL) && (
          <View className="row-10">
            <View className="spacer"/>

            <View>
              <View className="video-container">
                {/*
                <iframe
                  title="videoLink"
                  className="video-iframe"
                  src={`${value.originalPost.videoURL}`}
                  frameBorder="0"
                />*/}
              </View>

            </View>

            <View className="clear" />
            <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
          </View>
        )}

        {(value.originalPost.profileItem) && (
          <View className="bottom-padding">
            <View className="cta-border">
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { selectedProfile: value.originalPost.profileItem })} className="background-button standard-color padding-20 full-width">
                <View className="padding-20">
                  <View className="fixed-column-60">
                    <Image source={(value.originalPost.profileItem.imageURL) ? { uri: value.originalPost.profileItem.imageURL} : { uri: defaultProfileItemIcon}} className="image-50-fit" />
                  </View>
                  <View className="calc-column-offset-60">
                    <Text>{value.originalPost.profileItem.name}</Text>
                    {(value.originalPost.profileItem.category === 'Project') && (
                      <Text className="description-text-3 description-text-color">{value.originalPost.profileItem.category} | {value.originalPost.profileItem.hours} Hours</Text>
                    )}
                    {(value.originalPost.profileItem.category === 'Experience') && (
                      <Text className="description-text-3 description-text-color">{value.originalPost.profileItem.startDate} - {value.originalPost.profileItem.endDate}</Text>
                    )}
                    {(value.originalPost.profileItem.category === 'Education') && (
                      <Text className="description-text-3 description-text-color">{value.originalPost.profileItem.startDate} - {value.originalPost.profileItem.endDate}</Text>
                    )}
                    {(value.originalPost.profileItem.category === 'Career Goal') && (
                      <Text className="description-text-3 description-text-color">Deadline: {value.originalPost.profileItem.deadline}</Text>
                    )}
                    {(value.originalPost.profileItem.category === 'Passion') && (
                      <Text className="description-text-3 description-text-color">Last Updated {value.originalPost.profileItem.updatedAt}</Text>
                    )}

                  </View>
                  <View className="clear" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(value.originalPost.opportunityTags && value.originalPost.opportunityTags.length > 0) && (
          <View className="bottom-padding">
            <View className="cta-border">
              <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: value.originalPost.opportunityTags[0] })} className="background-button standard-color padding-20 full-width">
                <View className="padding-20">
                  <View className="fixed-column-60">
                    <Image source={(value.originalPost.opportunityTags[0].imageURL) ? { uri: value.originalPost.opportunityTags[0].imageURL} : { uri: opportunitiesIconDark}} className="image-50-fit" />
                  </View>
                  <View className="calc-column-offset-60">
                    {(value.originalPost.opportunityTags[0].title) ? (
                      <Text>{value.originalPost.opportunityTags[0].title}</Text>
                    ) : (
                      <Text>{value.originalPost.opportunityTags[0].name}</Text>
                    )}

                    {(value.originalPost.opportunityTags[0].employerName) && (
                      <Text className="description-text-3 description-text-color">{value.originalPost.opportunityTags[0].employerName}</Text>
                    )}

                  </View>
                  <View className="clear" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(value.originalPost.careerTags && value.originalPost.careerTags.length > 0) && (
          <View className="bottom-padding">
            <View className="cta-border">
              <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { selectedCareer: value.originalPost.careerTags[0] })} className="background-button standard-color padding-20 full-width">
                <View className="padding-20">
                  <View className="fixed-column-60">
                    <Image source={(value.originalPost.careerTags[0].imageURL) ? { uri: value.originalPost.careerTags[0].imageURL} : { uri: careerMatchesIconDark}} className="image-50-fit" />
                  </View>
                  <View className="calc-column-offset-60">
                    <Text>{value.originalPost.careerTags[0].name}</Text>
                    <Text className="description-text-3 description-text-color">{value.originalPost.careerTags[0].jobFamily}</Text>

                    {(value.originalPost.careerTags[0].marketData) && (
                      <Text className="description-text-3 description-text-color"> | ${Number(value.originalPost.careerTags[0].marketData.pay).toLocaleString()} avg pay</Text>
                    )}

                  </View>
                  <View className="clear" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(value.originalPost.trendTags && value.originalPost.trendTags.length > 0) && (
          <View className="bottom-padding">
            <View className="cta-border">
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Paths', { subNavSelected: 'Trends' })} className="background-button standard-color padding-20 full-width">
                <View className="padding-20">
                  <View className="fixed-column-60">
                    <Image source={(value.originalPost.trendTags[0].imageURL) ? { uri: value.originalPost.trendTags[0].imageURL} : { uri: trendsIconDark}} className="image-50-fit" />
                  </View>
                  <View className="calc-column-offset-120">
                    <Text>{value.originalPost.trendTags[0].name}</Text>
                    <Text className="description-text-3 description-text-color">{value.originalPost.trendTags[0].category}</Text>
                  </View>

                  {(value.originalPost.trendTags[0].percentChange) && (
                    <View className="fixed-column-60">
                      <Text className="heading-text-3 cta-color full-width right-text">{Number(value.originalPost.trendTags[0].percentChange).toFixed()}%</Text>
                      <Text className="description-text-5 full-width right-text">increase in U.S. jobs</Text>
                    </View>
                  )}

                  <View className="clear" />
                </View>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {(value.originalPost.tags && value.originalPost.tags.length > 0) && (
          <View className="bottom-padding">
            {value.originalPost.tags.map((item2, index2) =>
              <View key={index2} className="float-left right-padding top-padding">
                <View className="tag-container-thin">
                  <Text className="description-text-4">{item2}</Text>
                </View>
              </View>
            )}
            <View className="clear" />
          </View>
        )}

        {(value.originalPost.entityTags && value.originalPost.entityTags.length > 0) && (
          <View className="top-padding">
            {value.originalPost.entityTags.map((value2, optionIndex2) =>
              <View key={value2} className="float-left right-padding">
                <TouchableOpacity className="background-button standard-color" onPress={() => this.props.navigation.navigate('Profile', { username: value2.username })}>
                  <Image source={(value2.pictureURL) ? { uri: value2.pictureURL} : { uri: profileIconDark}} className="image-auto-20" />
                </TouchableOpacity>
              </View>
            )}
            <View className="clear" />
          </View>
        )}

      </View>
    )
  }

  selectAnswer(value, index,answer) {
    console.log('selectAnswer', answer)

    let posts = this.state.posts
    const emailId = this.state.emailId

    // do all this on the backend
    Axios.put('https://www.guidedcompass.com/api/group-post/poll-vote', {  _id: posts[index]._id, answer, emailId })
    .then((response) => {
      console.log('Poll vote attempted', response.data);

        if (response.data.success) {
          console.log('successfully recorded poll vote')

          posts[index] = response.data.groupPost
          this.setState({ posts })

        } else {
          console.log('there was an error saving the poll data', response.data.message)

        }

    }).catch((error) => {
        console.log('there was an error saving the poll data', error);

    });

  }

  retrieveComments(index) {
    console.log('retrieveComments called', index)

    let parentPostId = this.state.posts[index]._id
    // if (index || index === 0) {
    //   parentPostId = this.state.posts[index]._id
    // } else {
    //   parentPostId = this.state.passedGroupPost
    // }
    // pull comments
    Axios.get('https://www.guidedcompass.com/api/comments', { params: { parentPostId } })
    .then((response) => {
      console.log('Comments query attempted', response.data);

       if (response.data.success) {
         console.log('successfully retrieved comments')

         const comments = response.data.comments
         this.setState({ modalIsOpen: true, showComments: true, selectedIndex: index, comments })

       } else {
         console.log('no comments data found', response.data.message)
         this.setState({ modalIsOpen: true, showComments: true, selectedIndex: index, comments: [] })
       }
    }).catch((error) => {
       console.log('Comments query did not work', error);
       this.setState({ modalIsOpen: true, showComments: true, selectedIndex: index, comments: [] })
    });
  }

  retrieveLikes(index) {
    console.log('retrieveLikes called', index)

    const userIds = this.state.posts[index].upvotes
    if (userIds) {
      // pull comments
      Axios.get('https://www.guidedcompass.com/api/users', { params: { userIds } })
      .then((response) => {
        console.log('Users query attempted', response.data);

         if (response.data.success) {
           console.log('successfully retrieved users')

           const upvotes = response.data.users
           this.setState({ modalIsOpen: true, showUpvotes: true, selectedIndex: index, upvotes })

         } else {
           console.log('no upvotes data found', response.data.message)
           this.setState({ modalIsOpen: true, showUpvotes: true, selectedIndex: index, upvotes: [] })
         }
      }).catch((error) => {
         console.log('Upvotes query did not work', error);
         this.setState({ modalIsOpen: true, showUpvotes: true, selectedIndex: index, upvotes: [] })
      });
    } else {
      this.setState({ modalIsOpen: true, showUpvotes: true, selectedIndex: index, upvotes: [] })
    }
  }

  togglePostMenu(index) {
    console.log('togglePostMenu called', index)

    let posts = this.state.posts
    if (posts[index].showPostMenu) {
      posts[index]['showPostMenu'] = false
    } else {
      posts[index]['showPostMenu'] = true
    }

    this.setState({ posts })

  }

  renderShareButtons() {
    console.log('renderShareButtons called')

    const shareURL = "https://www.guidedcompass.com/app/social-posts/" + this.state.posts[this.state.selectedIndex]._id
    const shareTitle = 'Check Out My Post On Guided Compass!'
    const shareBody = "Guided Compass is a great forum to connect with like-minded individuals, mentors / mentees, and opportunities."

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

  itemClicked(e, type, value) {
    console.log('itemClicked called', e, type, value)

    e.preventDefault()
    e.stopPropagation()

    this.setState({ modalIsOpen: true, showHelpOutWidget: true, selectedGoal: value })
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
            selectedPeople: [], selectedLinks: [], selectedTimes: [], selectedProjects: [], selectedCareers: []
          })

          this.closeModal()

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
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { selectedProject: itemObject._id })} className="background-button standard-color full-width">
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
          </TouchableOpacity>

          <View className="row-5">
            <View className="bottom-padding">
              <View className="cta-border">
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { selectedProject: itemObject._id })} className={(answer === 'a') ? "background-button standard-color padding-20 full-width" : "background-button standard-color padding-20 full-width right-text"}>
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
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )
    } else if (type === 'work') {
      return (
        <View key="taggedWorkItem">
          <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: itemObject._id })} className="background-button standard-color padding-20 full-width">
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
          </TouchableOpacity>

          <View className="row-5">
            <View className="cta-border">
              <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: itemObject._id })} className="background-button standard-color padding-20 full-width">
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
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )
    } else if (type === 'career') {
      return (
        <View key="taggedCareerItem">
          <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { selectedCareer: itemObject })} className="background-button standard-color padding-20 full-width">
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
          </TouchableOpacity>

          <View className="bottom-padding">
            <View className="cta-border">
              <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { selectedCareer: itemObject })} className="background-button standard-color padding-20 full-width">
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
              </TouchableOpacity>
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

  render() {

    return (
      <ScrollView>
        <View>
          {(this.state.profileData) && (
            <View>

              <View className="standard-container-3">
                <View className="fixed-column-100 top-padding-5">
                  <Image source={(this.state.profileData.pictureURL) ? { uri: this.state.profileData.pictureURL} : { uri: defaultProfileImage}} className="profile-thumbnail-6"/>
                </View>

                <View className="calc-column-offset-160">
                  <Text className="heading-text-2">{this.state.profileData.firstName} {this.state.profileData.lastName}</Text>

                  <View className="description-text-1 top-margin-5">
                    {(this.state.profileData.roleName === 'Student' || this.state.profileData.roleName === 'Career-Seeker') ? (
                      <View>
                        {(this.state.profileData.jobTitle && this.state.profileData.jobTitle !== '' && this.state.profileData.jobTitle !== 'Student' && this.state.profileData.employerName) && (
                          <Text>{this.state.profileData.jobTitle} @ {this.state.profileData.employerName} | </Text>
                        )}
                        <Text>{this.state.profileData.school} {(this.state.profileData.gradYear) ? "'" + this.state.profileData.gradYear.substring(2,4) : 'Student'}</Text>
                      </View>
                    ) : (
                      <Text>{this.state.profileData.jobTitle} @ {this.state.profileData.employerName}</Text>
                    )}
                  </View>

                  {(this.state.profileData.headline) && (
                    <View className="row-5">
                      <Text className="description-text-1">{this.state.profileData.headline}</Text>
                    </View>
                  )}
                </View>

                <View className="fixed-column-60">
                  {(this.state.matchScore > 0) && (
                    <Progress.Circle progress={this.state.matchScore / 100} size={styles.width60.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                  )}

                </View>

                <View className="clear" />

                {((this.state.publicProfile || this.state.viewableProfile) || this.state.friends.some(friend => (friend.friend1Email === this.state.profileData.email) || friend.friend2Email === this.state.profileData.email)) ? (
                  <View className="top-padding float-left">

                    {(this.state.publicProfile || this.state.viewableProfile) && (
                      <View>

                        <View className="float-left row-5">
                          <View className="profile-links">
                            <View style={[styles.rowDirection]}>
                              { (this.state.resumePublicPreference === 'Yes' && this.state.publicResume) && <View><TouchableOpacity  onPress={() => Linking.openURL(this.state.publicResume)}><Image source={{ uri: resumeIconDark}} className="image-auto-30"/>{(this.state.includeIconLabels) && <Text className="description-text-5">RES</Text>}</TouchableOpacity></View> }
                              { this.state.profileData.customWebsiteURL && <View><TouchableOpacity onPress={() => Linking.openURL(this.state.profileData.customWebsiteURL)}><Image source={{ uri: websiteIconDark}} className="image-auto-30"/>{(this.state.includeIconLabels) && <Text className="description-text-5">PORT</Text>}</TouchableOpacity></View> }
                              { this.state.profileData.linkedInURL && <View><TouchableOpacity onPress={() => Linking.openURL(this.state.profileData.linkedInURL)}><Image source={{ uri: linkedinIconDark}} className="image-auto-30"/>{(this.state.includeIconLabels) && <Text className="description-text-5">LNK</Text>}</TouchableOpacity></View> }
                            </View>
                          </View>
                        </View>
                        <View className="clear" />
                      </View>
                    )}

                    {(this.testActiveFriendship(this.state.friends)) ? (
                      <View>
                        <View className="float-left right-padding">
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages', { recipient: this.state.profileData })} className="btn btn-squarish">
                            <View>
                              <View className="float-left right-padding top-padding-5">
                                <Image source={{ uri: messageIconWhite}} className="image-auto-15" />
                              </View>
                              <View className="float-left">
                                <Text>Message Me</Text>
                              </View>
                              <View className="clear" />
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View className="float-left">
                          <TouchableOpacity className="btn btn-squarish-white"onPress={(e) => this.favoriteItem(e, this.state.profileData) }>
                            <View>
                              <View className="float-left right-padding top-padding-5">
                                <Image source={(this.state.favorites.includes(this.state.profileData._id)) ? { uri: checkmarkIcon} : { uri: favoritesIconBlue}} className="image-auto-15" />
                              </View>
                              <View className="float-left">
                                <Text>{(this.state.favorites.includes(this.state.profileData._id)) ? "Following" : "Follow"}</Text>
                              </View>
                              <View className="clear" />
                            </View>
                          </TouchableOpacity>
                        </View>

                        <View className="clear" />
                      </View>
                    ) : (
                      <TouchableOpacity className="btn btn-profile description-text-3 right-margin-5 medium-background clear-border no-pointers" disabled={true}><Text>Pending</Text></TouchableOpacity>
                    )}

                  </View>
                ) : (
                  <View className="top-padding">

                    <TouchableOpacity className="btn btn-profile description-text-3 right-margin-5" disabled={(this.state.isSaving) ? true : false} onPress={() => this.followPerson(this.state.profileData)}><Text>Connect</Text></TouchableOpacity>

                    <View className="clear" />
                  </View>
                )}

                <View className="clear" />

              </View>

              {(!this.state.viewableProfile) ? (
                <View className="full-width">
                  <View className="super-spacer" />
                  <Text className="heading-text-3 full-width center-text error-color">This profile is private</Text>
                </View>
              ) : (
                <View className="full-width">

                  {(this.state.errorMessage && this.state.errorMessage !== '') && <Text className="error-color center-horizontally width-90-percent max-width-1400">{this.state.errorMessage}</Text>}
                  {(this.state.successMessage && this.state.successMessage !== '') && <Text className="cta-color center-horizontally width-90-percent max-width-1400">{this.state.successMessage}</Text>}

                  <ScrollView className="carousel-2 dark-underline medium-shadow" horizontal={true}>
                    {this.state.profileOptions.map((value, index) =>
                      <View className="carousel-item-container">
                        {(index === this.state.viewIndex) ? (
                          <View key={value} className="selected-carousel-item">
                            <TouchableOpacity key={value} className="background-button no-pointers" disabled={true} onPress={() => this.setState({ viewIndex: index })}>
                              <View>
                                <Text className="description-text-4">{value}</Text>
                                <View className="clear" />
                                <Text className="heading-text-5">{this.returnCount(value)}</Text>
                              </View>
                            </TouchableOpacity>

                          </View>
                        ) : (
                          <TouchableOpacity key={value} className="menu-button" onPress={() => this.setState({ viewIndex: index })}>
                            <View>
                              <Text className="description-text-4">{value}</Text>
                              <View className="clear" />
                              <Text className="heading-text-5">{this.returnCount(value)}</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </ScrollView>

                  <View>
                    {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Posts') && (
                      <View className="bottom-margin-20 center-horizontally width-90-percent max-width-1400" >

                        <View className="bottom-margin-20">
                          <Text className="heading-text-2">Posts</Text>
                        </View>

                        {(this.state.postPublicPreference === 'None') ? (
                          <View>
                            <Text className="error-color">Posts for this profile have been set to private</Text>
                          </View>
                        ) : (
                          <View>
                            <SubRenderPosts posts={this.state.posts} limit={(this.state.profileOptions[this.state.viewIndex] === 'All') && 3} pageSource="externalProfile" />
                            {/*
                            {this.state.posts.map((value, index) =>
                              <View key={index}>
                                {this.renderPost(value, index)}
                              </View>
                            )}*/}
                          </View>
                        )}
                        <View className="clear" />
                      </View>
                    )}
                  </View>

                  {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Projects') && (
                    <View className="bottom-margin-20 center-horizontally width-90-percent max-width-1400" >

                      <View className="bottom-margin-20">
                        <Text className="heading-text-2">Projects</Text>
                      </View>

                      {(this.state.projectPublicPreference === 'None') ? (
                        <View>
                          <Text className="error-color">Projects for this profile have been set to private</Text>
                        </View>
                      ) : (
                        <View>

                          {(this.state.projects && this.state.projects.length > 0) ? (
                            <View>
                              {this.state.projects.map((item, index) =>
                                <View key={index}>
                                  <View className="bottom-margin-20">
                                    <TouchableOpacity className="background-button full-space" type="button" onPress={() => this.setState({ modalIsOpen: true, showProjectDetail: true, showAssessmentDetail: false, showEndorsementDetail: false, selectedIndex: index, showMessageWidget: false }) }>
                                      <View className="elevated-box white-background" >
                                        <View className="full-width relative-position tint">
                                          <Image source={(item.imageURL) ? { uri: item.imageURL} : { uri: defaultProfileBackgroundImage}} className="image-full-width-150 center-horizontally"  />
                                          <View className="absolute-position absolute-top-5 absolute-left-5">
                                            {(item.matchScore) && (
                                              <Progress.Circle progress={item.matchScore / 100} size={styles.width40.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                                            )}
                                            <Text className="description-text-5 rounded-corners horizontal-padding-4 row-5 white-border white-text bold-text">{item.category}</Text>
                                          </View>
                                        </View>

                                        <View className="spacer" />

                                        <View className="horizontal-padding left-text">
                                          <Text className="heading-text-5">{item.name}</Text>

                                          <View className="top-padding">
                                            <View className="fixed-column-35">
                                              <Image className="profile-thumbnail-25" source={(item.userPic) ? { uri: item.userPic} : { uri: profileIconDark}} />
                                            </View>
                                            <View className="calc-column-offset-35 description-text-2">
                                              <Text>{item.userFirstName} {item.userLastName}</Text>
                                              <Text className="description-text-3">{item.hours} Hours</Text>
                                              <Text className="description-text-3">{(item.startDate) && item.startDate + " - "}{(item.isContinual) ? "Present" : item.endDate}</Text>
                                            </View>
                                            <View className="clear" />
                                          </View>

                                          {(item.collaborators && item.collaborators.length > 0) && (
                                            <View className="top-padding">
                                              <Text className="description-text-5 left-padding-5">|</Text>
                                              <Text className="description-text-5 left-padding-5">{item.collaborators.length} Collaborators</Text>
                                            </View>
                                          )}

                                          {(item.skillTags) && (
                                            <View>
                                              <View className="top-padding">
                                                {item.skillTags.split(',').map((value, optionIndex) =>
                                                  <View key={value}>
                                                    {(optionIndex < 3) && (
                                                      <View key={value} className="float-left row-5 right-padding">
                                                        <View className="tag-container-7">
                                                          <Text className="description-text-3">{value}</Text>
                                                        </View>
                                                      </View>
                                                    )}
                                                  </View>
                                                )}
                                                <View className="clear" />
                                              </View>
                                            </View>
                                          )}

                                          <View className="clear" />

                                          <View className="top-padding-20">
                                            <View className="display-inline full-width">
                                              <TouchableOpacity className={this.state.favorites.includes(item._id) ? "btn btn-profile medium-background clear-border full-width" : "btn btn-profile full-width"} disabled={(this.state.isSaving) ? true : false} onPress={(e) =>  this.favoriteItem(item,'project')}><Text>{this.state.favorites.includes(item._id) ? "Following" : "Follow"}</Text></TouchableOpacity>
                                            </View>
                                          </View>

                                          <View className="spacer" />
                                        </View>
                                      </View>

                                    </TouchableOpacity>
                                  </View>

                                </View>
                              )}
                            </View>
                          ) : (
                            <Text className="error-color">Either projects are set to private or no projects have been added yet</Text>
                          )}
                        </View>
                      )}
                      <View className="clear" />
                    </View>
                  )}

                  <View>
                    {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Goals') && (
                      <View className="bottom-margin-20 center-horizontally width-90-percent max-width-1400">

                        <View className="bottom-margin-20">
                          <Text className="heading-text-2">Goals</Text>
                        </View>

                        {(this.state.goalPublicPreference === 'None') ? (
                          <View>
                            <Text className="error-color">Goals for this profile have been set to private</Text>
                          </View>
                        ) : (
                          <View>

                            {(this.state.goals && this.state.goals.length > 0) ? (
                              <View>
                                {this.state.goals.map((value, index) =>
                                  <View key={index}>
                                    <View className="standard-border rounded-corners bottom-margin-20 white-background medium-shadow">
                                      <TouchableOpacity className="background-button left-text padding-20 full-space" type="button" disabled={true} onPress={() => this.setState({ modalIsOpen: true, showGoalDetails: true, selectedGoal: value }) }>
                                        <View className="fixed-column-50 height-50">
                                          <View className="mini-spacer" /><View className="mini-spacer" />
                                          <Image source={{ uri: targetIconOrange}} className="image-auto-40" />
                                        </View>
                                        <View className="calc-column-offset-50">
                                          <Text className="heading-text-4 curtail-text">{value.title}</Text>
                                          {(value.startDate) ? (
                                            <Text className="description-text-1 description-text-color curtail-text">{value.startDate} - {value.deadline}</Text>
                                          ) : (
                                            <Text className="description-text-1 description-text-color curtail-text">Deadline: {value.deadline}</Text>
                                          )}

                                        </View>
                                        <View className="clear" />

                                        {this.renderTags(value.selectedCareers, 'careers')}
                                        {this.renderTags(value.selectedOpportunities, 'opportunities')}
                                        {this.renderTags(value.competencies, 'competencies')}
                                        {this.renderTags(value.selectedFunctions, 'functions')}
                                        {this.renderTags(value.selectedIndustries, 'industries')}
                                        {this.renderTags(value.selectedHours, 'hours')}
                                        {this.renderTags(value.selectedPayRanges, 'payRanges')}
                                        {this.renderTags(value.selectedSchools, 'schools')}
                                        {this.renderTags(value.selectedMajors, 'majors')}
                                        <View className="clear" />

                                        {(value.description) ? (
                                          <View>
                                            <Text className="description-text-1 description-text-color curtail-text top-margin">{value.description}</Text>
                                          </View>
                                        ) : (
                                          <View />
                                        )}

                                        {(value.goalType && value.goalType.name === 'Alternatives') && (
                                          <View>
                                            {(value.pollQuestion) && (
                                              <Text className="heading-text-5 top-margin-20">{value.pollQuestion}</Text>
                                            )}
                                            <View className="top-margin-20">
                                              <View className="calc-column-offset-30-of-50">
                                                <Text className="">{value.aName}</Text>
                                              </View>
                                              <View className="fixed-column-60">
                                                <Text className="full-width center-text heading-text-4">VS</Text>
                                              </View>
                                              <View className="calc-column-offset-30-of-50">
                                                <Text className="full-width right-text">{value.bName}</Text>
                                              </View>
                                              <View className="clear" />
                                            </View>
                                          </View>
                                        )}

                                        <View className="top-padding-20">
                                          <View className="display-inline full-width">
                                            <TouchableOpacity className="btn btn-profile full-width" disabled={(this.state.isSaving) ? true : false} onPress={(e) =>  this.itemClicked(e,'helpOut', value)}><Text>Help Out</Text></TouchableOpacity>
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>

                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                <Text className="error-color">Either goals are set to private or no goals have been added yet</Text>
                              </View>
                            )}

                          </View>
                        )}
                        <View className="clear" />
                      </View>
                    )}

                    {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Passions') && (
                      <View className="bottom-margin-20 center-horizontally width-90-percent max-width-1400">
                        <View className="bottom-margin-20">
                          <Text className="heading-text-2">Passions</Text>
                        </View>

                        {(this.state.passionPublicPreference === 'None') ? (
                          <View>
                            <Text className="error-color">Passions for this profile have been set to private</Text>
                          </View>
                        ) : (
                          <View>
                            {(this.state.passions && this.state.passions.length > 0) ? (
                              <View>
                                {this.state.passions.map((value, index) =>
                                  <View key={index}>
                                    <View className="standard-border rounded-corners bottom-margin-20 white-background medium-shadow">
                                      <TouchableOpacity className="background-button full-space left-text padding-20" type="button" onPress={() => this.setState({ modalIsOpen: true, showPassionDetail: true, selectedPassion: value }) }>
                                        <View className="fixed-column-50 height-50">
                                          <View className="mini-spacer" /><View className="mini-spacer" />
                                          <Image source={{ uri: passionIconDark}} className="image-auto-40" />
                                        </View>
                                        <View className="calc-column-offset-50">
                                          <Text className="heading-text-4 curtail-text">{value.passionTitle}</Text>
                                          <Text className="description-text-1 description-text-color curtail-text">Created: {value.createdAt}</Text>

                                        </View>
                                        <View className="clear" />

                                        {(value.passionReason) && (
                                          <Text className="description-text-1 description-text-color curtail-text top-margin">{value.passionReason}</Text>
                                        )}
                                      </TouchableOpacity>
                                    </View>

                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                <Text className="error-color">Either passions are set to private or no passions have been added yet</Text>
                              </View>
                            )}

                          </View>
                        )}
                        <View className="clear" />
                      </View>
                    )}

                    {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Assessments') && (
                      <View className="bottom-margin-20 center-horizontally width-90-percent max-width-1400">
                        <View className="bottom-margin-20">
                          <Text className="heading-text-2">Assessments</Text>
                        </View>

                        {(this.state.assessmentPublicPreference === 'None') ? (
                          <View>
                            <Text className="error-color">Career assessments for this profile have been set to private</Text>
                          </View>
                        ) : (
                          <View>
                            {(this.state.assessments && this.state.assessments.length > 0) ? (
                              <View>
                                {this.state.assessments.map((value, index) =>
                                  <View key={index}>
                                    <View className="standard-border rounded-corners bottom-margin-20 white-background medium-shadow">
                                      <TouchableOpacity className="background-button full-space padding-20 left-text" type="button" onPress={() => this.setState({ modalIsOpen: true, showProjectDetail: false, showAssessmentDetail: true, showEndorsementDetail: false, selectedIndex: index, showMessageWidget: false }) }>
                                        <View className="fixed-column-50 height-50">
                                          <View className="mini-spacer" /><View className="mini-spacer" />
                                            {(value.category === 'Work Preferences') && (
                                              <Image source={{ uri: softwareDeveloperIcon}} className="image-auto-40" />
                                            )}
                                            {(value.category === 'Interests') && (
                                              <Image source={{ uri: interestsIconDark}} className="image-auto-40" />
                                            )}
                                            {(value.category === 'Skills') && (
                                              <Image source={{ uri: skillsIconDark}} className="image-auto-40" />
                                            )}
                                            {(value.category === 'Personality') && (
                                              <Image source={{ uri: abilitiesIconDark}} className="image-auto-40" />
                                            )}
                                            {(value.category === 'Values') && (
                                              <Image source={{ uri: socialIconDark}} className="image-auto-40" />
                                            )}
                                        </View>
                                        <View className="calc-column-offset-50">
                                          <Text className="heading-text-4 curtail-text">{value.category}</Text>
                                          <Text className="description-text-1 description-text-color curtail-text">Updated: {value.updatedAt}</Text>

                                        </View>
                                        <View className="clear" />

                                        {(value.description) && (
                                          <Text className="description-text-1 top-margin">{value.description}</Text>
                                        )}
                                      </TouchableOpacity>
                                    </View>

                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                <Text className="error-color">Either career assessments are set to private or no career assessments have been added yet</Text>
                              </View>
                            )}
                          </View>
                        )}
                        <View className="clear" />
                      </View>
                    )}

                    {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Endorsements') && (
                      <View className="bottom-margin-20 center-horizontally width-90-percent max-width-1400">

                        <View className="bottom-margin-20">
                          <Text className="heading-text-2">Endorsements</Text>
                        </View>

                        {(this.state.endorsementPublicPreference === 'None') ? (
                          <View>
                            <Text className="error-color">Endorsements for this profile have been set to private</Text>
                          </View>
                        ) : (
                          <View>
                            {(this.state.assessments && this.state.assessments.length > 0) ? (
                              <View>
                                {this.state.endorsements.map((value, index) =>
                                  <View key={index}>

                                    <View className="standard-border rounded-corners bottom-margin-20 white-background medium-shadow">
                                      <TouchableOpacity className="background-button full-space padding-10" type="button" onPress={() => this.setState({ modalIsOpen: true, showProjectDetail: false, showAssessmentDetail: false, showEndorsementDetail: true, selectedIndex: index, showMessageWidget: false }) }>
                                        <View className="fixed-column-50 height-50">
                                          <View className="mini-spacer" /><View className="mini-spacer" />
                                            <Image source={{ uri: endorsementIconDark}} className="image-auto-40" />
                                        </View>
                                        <View className="calc-column-offset-50">
                                          <Text className="heading-text-4 curtail-text">{value.senderFirstName} {value.senderLastName}</Text>
                                          <Text className="description-text-1 description-text-color curtail-text">Create: {value.createdAt}</Text>

                                        </View>
                                        <View className="clear" />

                                        {(value.category) && (
                                          <Text className="description-text-1 top-margin">{value.category}</Text>
                                        )}

                                        {(value.isTransparent) ? (
                                          <View>
                                            {(value.overallRating) && (
                                              <View className="row-10">
                                                <Text className="description-text-2 row-3"><Text className="cta-color bold-text">{value.overallRating} / 100</Text> Overall Rating</Text>
                                              </View>
                                            )}

                                            {(value.pathway && value.pathway !== '' && value.pathway !== 'Custom') && (
                                              <View className="row-10">
                                                <Text className="description-text-2">{value.pathway} Pathway</Text>
                                              </View>
                                            )}
                                          </View>
                                        ) : (
                                          <View>
                                            <Text className="description-text-2">This endorsement has been marked confidential</Text>
                                          </View>
                                        )}

                                        <View className="row-10">
                                          <Text className="description-text-2"><Text className="cta-color bold-text">{value.skillTraits.length}</Text> Skills and <Text className="cta-color bold-text">{value.examples.length}</Text> Examples</Text>
                                        </View>
                                      </TouchableOpacity>
                                    </View>

                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                <Text className="error-color">Either competency endorsements are set to private or no competency endorsements were received yet</Text>
                              </View>
                            )}
                          </View>
                        )}

                        <View className="clear" />
                      </View>
                    )}
                  </View>

                  {(this.state.showProjectDetail) && (
                    <View>
                      <ProjectDetails closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedProject={this.state.projects[this.state.selectedIndex]} orgCode={this.state.activeOrg} />
                    </View>
                  )}

                  {(this.state.showAssessmentDetail) && (
                    <View>
                      <AssessmentResultsDetails closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedAssessment={this.state.assessments[this.state.selectedIndex]} />
                    </View>
                  )}

                  {(this.state.showEndorsementDetail) && (
                    <View>
                      <EndorsementDetails closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedEndorsement={this.state.endorsements[this.state.selectedIndex]} />
                    </View>
                  )}

                  {(this.state.showMessageWidget) && (
                    <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
                     <View key="showServiceDefinitions" className="full-width padding-20">
                        <SubSendMessage profileData={this.state.profileData} history={this.props.history} closeModal={this.closeModal} />
                      </View>

                   </Modal>
                  )}

                  {(this.state.showComments) && (
                    <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
                     <View key="showPost" className="full-width">

                      {this.renderPost(this.state.posts[this.state.selectedIndex], this.state.selectedIndex, true)}

                      <View className="spacer" />

                      {(this.state.posts && this.state.activeOrg) && (
                        <SubComments selectedGroup={null} selectedGroupPost={this.state.posts[this.state.selectedIndex]} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} comments={this.state.comments} postingOrgCode={this.state.activeOrg} postingOrgName={this.state.orgName} orgContactEmail={this.state.orgContactEmail} pictureURL={this.state.pictureURL} orgLogo={this.state.orgLogo} history={this.props.history} pageSource={"newsFeed"} />
                      )}

                     </View>

                   </Modal>
                  )}

                  {(this.state.showShareButtons) && (
                    <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
                     <View key="showShareButtons" className="full-width padding-20 center-text">
                        <Text className="heading-text-2">Share This Post with Friends!</Text>

                        <View className="top-padding-20">
                          <Text>Share this link:</Text>
                          <Text className="bold-text cta-color">{"https://www.guidedcompass.com/app/social-posts/" + this.state.posts[this.state.selectedIndex]._id}</Text>
                        </View>

                        <View className="spacer" />

                        <View className="top-padding-20">
                          {this.renderShareButtons()}
                        </View>

                      </View>

                   </Modal>
                  )}

                  {(this.state.showGoalDetails || this.state.showHelpOutWidget) && (
                    <View>
                      <SubGoalDetails history={this.props.history} selectedGoal={this.state.selectedGoal} modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} showGoalDetails={this.state.showGoalDetails} showHelpOutWidget={this.state.showHelpOutWidget} profileData={this.state.profileData}/>
                   </View>
                  )}

                  {(this.state.showPassionDetail) && (
                    <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
                     <View key="showPassionDetail" className="full-width padding-20 center-text">
                        <Text className="heading-text-2">{this.state.selectedPassion.passionTitle}</Text>
                    </View>
                   </Modal>
                  )}

                </View>
              )}

            </View>
          )}
        </View>

      </ScrollView>
    )
  }

}

export default ExternalProfile;
