import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, Share,Linking } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import * as Progress from 'react-native-progress';

const defaultProfileImage = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-big.png';
const resumeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/resume-icon-dark.png';
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
    console.log('componentDidUpdate called in SubExternalProfile')

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

              console.log('User details fetch worked')
              if (response.data.success) {

                this.props.navigation.setOptions({ headerTitle: response.data.user.firstName + ' ' + response.data.user.lastName })

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
                  console.log('Friends query attempted');

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
                    console.log('Group posts query attempted');

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
                    console.log('Projects query attempted');

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
                      console.log('Org details worked');

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
                        console.log('Goals received query worked');

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
                        console.log('Passions received query worked');

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

                       console.log('actual assessment results')

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
                      console.log('Story query worked');

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
                  console.log('User details query 1 attempted');

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

                          console.log('actual assessment results')

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
           console.log('Favorites query attempted');

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
    console.log('testActiveFriendship called')

    let friendshipIsActive = false
    const index = friends.findIndex(friend => (friend.friend1Email === this.state.profileData.email || friend.friend2Email === this.state.profileData.email) && friend.active);
    console.log('show index in test: ', index)
    if (index > -1) {
      friendshipIsActive = true
    }

    return friendshipIsActive
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
      let backgroundColorClass = styles.primaryBackgroundLight
      if (type === 'careers' || type === 'functions' || type === 'industries') {
        backgroundColorClass = styles.primaryBackgroundLight
      } else if (type === 'opportunities') {
        backgroundColorClass = styles.secondaryBackgroundLight
      } else if (type === 'competencies') {
        backgroundColorClass = styles.tertiaryBackgroundLight
      } else if (type === 'hours') {
        backgroundColorClass = styles.quaternaryBackgroundLight
      } else if (type === 'payRanges') {
        backgroundColorClass = styles.quinaryBackgroundLight
      } else if (type === 'schools') {
        backgroundColorClass = styles.senaryBackgroundLight
      } else if (type === 'majors') {
        backgroundColorClass = styles.septaryBackgroundLight
      }

      return (
        <View key={type + "|0"} style={(inModal) && [styles.centerText]}>
          <View style={(inModal) ? [styles.centerText,styles.rowDirection,styles.flexWrap] : [styles.topMargin]}>
            {passedArray.map((value, optionIndex) =>
              <View key={type + "|" + optionIndex} style={(inModal) ? [styles.centerText,styles.rowDirection] : [styles.rowDirection]}>
                {(optionIndex < 3) && (
                  <View>
                    {(editMode) && (
                      <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                        <TouchableOpacity onPress={() => this.removeItem(type, optionIndex)}>
                          <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                        </TouchableOpacity>
                      </View>
                    )}
                    <View style={(inModal) ? [styles.rightPadding5,styles.centerText] : [styles.rightPadding5]}>
                      <View style={[styles.halfSpacer]} />
                      <View style={[styles.roundedCorners,styles.row7,styles.horizontalPadding20,backgroundColorClass]}>
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
          <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { selectedProject: itemObject._id })}>
            {(answer === 'a') ? (
              <View style={[styles.rowDirection]}>
                <View style={[styles.calcColumn140,styles.headingText5,styles.rightText]}>
                  <Text>A: {item.aName}</Text>
                </View>
                <View style={[styles.width80,styles.headingText5]}>
                  {(item.aValue) && (
                    <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.aValue}</Text>
                  )}
                </View>
              </View>
            ) : (
              <View>
                <View style={[styles.width80,styles.headingText5]}>
                  {(item.bValue) ? (
                    <Text style={[styles.boldText,styles.ctaColor]}>${item.bValue}</Text>
                  ) : (
                    <View style={[styles.width40,styles.height30]} />
                  )}
                </View>
                <View style={[styles.calcColumn140,styles.headingText5]}>
                  <Text style={[styles.flex1,styles.rightText]}>B: {item.bName}</Text>
                </View>
              </View>
            )}
          </TouchableOpacity>

          <View style={[styles.row5]}>
            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { selectedProject: itemObject._id })} style={(answer === 'a') ? [styles.padding20] : [styles.padding20,styles.rightText]}>
                  {(answer === 'a') ? (
                    <View style={[styles.padding20]}>
                      <View style={[styles.width60]}>
                        <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} style={[styles.square50,styles.contain]} />
                      </View>
                      <View style={[styles.calcColumn120]}>
                        <Text>{itemObject.name}</Text>
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{itemObject.category} | {itemObject.hours} Hours</Text>
                      </View>

                    </View>
                  ) : (
                    <View style={[styles.padding20]}>
                      <View style={[styles.calcColumn120,styles.rightPadding]}>
                        <Text>{itemObject.name}</Text>
                        <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{itemObject.category} | {itemObject.hours} Hours</Text>
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
          <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: itemObject._id })} style={[styles.padding20,styles.rowDirection]}>
            <View style={[styles.calcColumn160]}>
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
              <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: itemObject._id })} style={[styles.padding20]}>
                <View style={[styles.padding20,styles.rowDirection]}>
                  <View style={[styles.width50]}>
                    <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} style={[styles.square40,styles.contain]} />
                  </View>
                  <View style={[styles.calcColumn150]}>
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
          <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { selectedCareer: itemObject })} style={[styles.padding20,styles.rowDirection]}>
            <View style={[styles.calcColumn180]}>
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
              <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { selectedCareer: itemObject })}>
                <View style={[styles.padding20,styles.rowDirection]}>
                  <View style={[styles.width60]}>
                    <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} style={[styles.square50,styles.contain]} />
                  </View>
                  <View style={[styles.calcColumn160]}>
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
              <View style={[styles.padding20]}>
                <View>
                  <View style={[styles.width60]}>
                    <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} style={[styles.square50,styles.contain]} />
                  </View>
                  <View style={[styles.calcColumn160]}>
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
              <View style={[styles.card]}>
                <View style={[styles.rowDirection]}>
                  <View style={[styles.width85,styles.topPadding5]}>
                    <View>
                      <Image source={(this.state.profileData.pictureURL) ? { uri: this.state.profileData.pictureURL} : { uri: defaultProfileImage}} style={[styles.square70,styles.contain, { borderRadius: 40 }]}/>
                      {(this.testActiveFriendship(this.state.friends)) ? (
                        <View style={[styles.rowDirection,styles.topMargin]}>
                          <View>
                            <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                            <Image source={{ uri: checkmarkIcon }} style={[styles.square10,styles.contain]} />
                          </View>

                          <Text style={[styles.descriptionText4,styles.ctaColor,styles.leftMargin3]}>Connected</Text>
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>

                    {(this.state.publicProfile || this.state.viewableProfile) ? (
                      <View>
                        <View style={[styles.topPadding20]}>
                          <View>
                            <View style={[styles.rowDirection,styles.flexWrap]}>
                              {(this.state.resumePublicPreference === 'Yes' && this.state.publicResume) && (
                                <View>
                                  <TouchableOpacity onPress={() => Linking.openURL(this.state.publicResume)}>
                                    <Image source={{ uri: resumeIconDark}} style={[styles.square30,styles.contain]}/>
                                    {(this.state.includeIconLabels) && (
                                      <Text style={[styles.descriptionText5]}>RES</Text>
                                    )}
                                  </TouchableOpacity>
                                </View>
                              )}
                              { this.state.profileData.customWebsiteURL && <View><TouchableOpacity onPress={() => Linking.openURL(this.state.profileData.customWebsiteURL)}><Image source={{ uri: websiteIconDark}} style={[styles.square30,styles.contain]}/>{(this.state.includeIconLabels) && <Text style={[styles.descriptionText5]}>PORT</Text>}</TouchableOpacity></View> }
                              { this.state.profileData.linkedInURL && <View><TouchableOpacity onPress={() => Linking.openURL(this.state.profileData.linkedInURL)}><Image source={{ uri: linkedinIconDark}} style={[styles.square30,styles.contain]}/>{(this.state.includeIconLabels) && <Text style={[styles.descriptionText5]}>LNK</Text>}</TouchableOpacity></View> }
                            </View>
                          </View>
                        </View>

                      </View>
                    ) : (
                      <View />
                    )}
                  </View>

                  <View style={[styles.calcColumn205]}>
                    <Text style={[styles.headingText3]}>{this.state.profileData.firstName} {this.state.profileData.lastName}</Text>

                    <View style={[styles.topMargin5]}>
                      {(this.state.profileData.roleName === 'Student' || this.state.profileData.roleName === 'Career-Seeker') ? (
                        <View>
                          {(this.state.profileData.jobTitle && this.state.profileData.jobTitle !== '' && this.state.profileData.jobTitle !== 'Student' && this.state.profileData.employerName) ? (
                            <Text style={[styles.descriptionText2]}>{this.state.profileData.jobTitle} @ {this.state.profileData.employerName} | </Text>
                          ) : (
                            <View />
                          )}
                          <Text style={[styles.descriptionText2]}>{this.state.profileData.school} {(this.state.profileData.gradYear) ? "'" + this.state.profileData.gradYear.substring(2,4) : 'Student'}</Text>
                        </View>
                      ) : (
                        <Text style={[styles.descriptionText2]}>{this.state.profileData.jobTitle} @ {this.state.profileData.employerName}</Text>
                      )}
                    </View>

                    {(this.state.profileData.headline) && (
                      <View style={[styles.row5]}>
                        <Text style={[styles.descriptionText2]}>{this.state.profileData.headline}</Text>
                      </View>
                    )}
                  </View>

                  <View style={[styles.width60]}>
                    {(this.state.matchScore > 0) && (
                      <Progress.Circle progress={this.state.matchScore / 100} size={styles.width60.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                    )}

                  </View>
                </View>

                {((this.state.publicProfile || this.state.viewableProfile) || this.state.friends.some(friend => (friend.friend1Email === this.state.profileData.email) || friend.friend2Email === this.state.profileData.email)) ? (
                  <View style={[styles.topPadding,styles.leftPadding85]}>

                    {(this.testActiveFriendship(this.state.friends)) ? (
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.rightPadding]}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages', { recipient: this.state.profileData })} style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]}>
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.rightPadding,styles.topPadding5]}>
                                <Image source={{ uri: messageIconWhite}} style={[styles.square15,styles.contain]} />
                              </View>
                              <View>
                                <Text style={[styles.whiteColor,styles.descriptionText1]}>Message Me</Text>
                              </View>

                            </View>
                          </TouchableOpacity>
                        </View>
                        {/*
                        <View>
                          <TouchableOpacity style={[styles.btnSquarish,styles.whiteBackground,styles.ctaBorder,styles.flexCenter]} onPress={(e) => this.favoriteItem(e, this.state.profileData) }>
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.rightPadding,styles.topPadding5]}>
                                <Image source={(this.state.favorites.includes(this.state.profileData._id)) ? { uri: checkmarkIcon} : { uri: favoritesIconBlue}} style={[styles.square15,styles.contain]} />
                              </View>
                              <View>
                                <Text style={[styles.ctaColor]}>{(this.state.favorites.includes(this.state.profileData._id)) ? "Following" : "Follow"}</Text>
                              </View>
                            </View>
                          </TouchableOpacity>
                        </View>*/}


                      </View>
                    ) : (
                      <View>
                        {(this.state.friends.some(friend => (friend.friend1Email === this.state.profileData.email) || friend.friend2Email === this.state.profileData.email)) ? (
                          <View>
                            <TouchableOpacity style={[styles.btnSquarish,styles.mediumBackground,styles.flexCenter]} disabled={true}><Text style={[styles.descriptionText1,styles.whiteColor]}>Pending</Text></TouchableOpacity>
                          </View>
                        ) : (
                          <View>
                            <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={() => this.followPerson(this.state.profileData)}><Text style={[styles.whiteColor,styles.descriptionText1]}>Connect</Text></TouchableOpacity>
                          </View>
                        )}
                      </View>

                    )}

                  </View>
                ) : (
                  <View style={[styles.topPadding]}>
                    <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={() => this.followPerson(this.state.profileData)}><Text style={[styles.whiteColor,styles.descriptionText1]}>Connect</Text></TouchableOpacity>
                  </View>
                )}
              </View>

              {(!this.state.viewableProfile) ? (
                <View style={[styles.calcColumn60]}>
                  <View style={[styles.superSpacer]} />
                  <Text style={[styles.headingText3,styles.calcColumn60,styles.centerText,styles.errorColor]}>This profile is private</Text>
                </View>
              ) : (
                <View style={[styles.fullScreenWidth]}>

                  {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor,styles.centerHorizontally]}>{this.state.errorMessage}</Text>}
                  {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor,styles.centerHorizontally]}>{this.state.successMessage}</Text>}

                  <ScrollView style={[styles.carousel,styles.darkUnderline,styles.cardClearPadding,styles.topMargin20,styles.horizontalPadding20]} horizontal={true}>
                    {this.state.profileOptions.map((value, index) =>
                      <View style={[styles.row15, styles.rightPadding30]}>
                        {(index === this.state.viewIndex) ? (
                          <View key={value} style={[styles.selectedCarouselItem]}>
                            <TouchableOpacity key={value} disabled={true} onPress={() => this.setState({ viewIndex: index })} style={[styles.flexCenter]}>
                              <View>
                                <Text style={[styles.descriptionText4,styles.centerText]}>{value}</Text>

                                <Text style={[styles.headingText5,styles.centerText]}>{this.returnCount(value)}</Text>
                              </View>
                            </TouchableOpacity>

                          </View>
                        ) : (
                          <TouchableOpacity key={value} style={[styles.menuButton,styles.flexCenter]} onPress={() => this.setState({ viewIndex: index })}>
                            <View>
                              <Text style={[styles.descriptionText4,styles.centerText]}>{value}</Text>

                              <Text style={[styles.headingText5,styles.centerText]}>{this.returnCount(value)}</Text>
                            </View>
                          </TouchableOpacity>
                        )}
                      </View>
                    )}
                  </ScrollView>

                  {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Posts') && (
                    <View style={[styles.topMargin20]}>
                      <View style={[styles.bottomMargin20]}>
                        <Text style={[styles.headingText2]}>Posts</Text>
                      </View>

                      {(this.state.postPublicPreference === 'None') ? (
                        <View style={[styles.bottomMargin20]} >
                          <Text style={[styles.errorColor]}>Posts for this profile have been set to private</Text>
                        </View>
                      ) : (
                        <View style={[styles.bottomMargin20,styles.centerHorizontally]} >
                          <SubRenderPosts posts={this.state.posts} limit={(this.state.profileOptions[this.state.viewIndex] === 'All') && 3} pageSource="externalProfile" />
                        </View>
                      )}
                    </View>
                  )}

                  {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Projects') && (
                    <View style={[styles.row20,styles.centerHorizontally]} >

                      <View style={[styles.bottomMargin20]}>
                        <Text style={[styles.headingText2]}>Projects</Text>
                      </View>

                      {(this.state.projectPublicPreference === 'None') ? (
                        <View>
                          <Text style={[styles.errorColor]}>Projects for this profile have been set to private</Text>
                        </View>
                      ) : (
                        <View>
                          {(this.state.projects && this.state.projects.length > 0) ? (
                            <View>
                              {this.state.projects.map((item, index) =>
                                <View key={index}>
                                  <View style={[styles.bottomMargin20,styles.cardClearPadding]}>
                                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showProjectDetail: true, showAssessmentDetail: false, showEndorsementDetail: false, selectedIndex: index, showMessageWidget: false }) }>
                                      <View style={[styles.lightBorder,styles.mediumShadow,styles.verticalMargin10,styles.bottomPadding30,styles.centerHorizontally]} >
                                        <View style={[styles.fullScreenWidth,styles.relativePosition]}>
                                          <Image source={(item.imageURL) ? { uri: item.imageURL} : { uri: defaultProfileBackgroundImage}} style={[styles.fullScreenWidth,styles.height150,styles.centerHorizontally]}  />
                                          <View style={[styles.absolutePosition,styles.absoluteTop5,styles.absoluteLeft5]}>
                                            {(item.matchScore) && (
                                              <Progress.Circle progress={item.matchScore / 100} size={styles.width40.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                                            )}
                                            <Text style={[styles.descriptionText5,styles.roundedCorners,styles.horizontalPadding10,styles.row5,styles.whiteBorder,styles.whiteColor,styles.boldText]}>{item.category}</Text>
                                          </View>
                                        </View>

                                        <View style={[styles.spacer]} />

                                        <View style={[styles.horizontalPadding30]}>
                                          <Text style={[styles.headingText5]}>{item.name}</Text>

                                          <View style={[styles.topPadding,styles.rowDirection]}>
                                            <View style={[styles.width35]}>
                                              <Image style={[styles.square25,styles.contain, { borderRadius: 12.5 }]} source={(item.userPic) ? { uri: item.userPic} : { uri: profileIconDark}} />
                                            </View>
                                            <View style={[styles.calcColumn100]}>
                                              <Text style={[styles.descriptionText2]}>{item.userFirstName} {item.userLastName}</Text>
                                              <Text style={[styles.descriptionText5]}>{item.hours} Hours</Text>
                                              <Text style={[styles.descriptionText5]}>{(item.startDate) && item.startDate + " - "}{(item.isContinual) ? "Present" : item.endDate}</Text>
                                            </View>

                                          </View>

                                          {(item.collaborators && item.collaborators.length > 0) && (
                                            <View style={[styles.topPadding]}>
                                              <Text style={[styles.descriptionText5,styles.leftPadding5]}>|</Text>
                                              <Text style={[styles.descriptionText5,styles.leftPadding5]}>{item.collaborators.length} Collaborators</Text>
                                            </View>
                                          )}

                                          {(item.skillTags) && (
                                            <View>
                                              <View style={[styles.topPadding,styles.rowDirection,styles.flexWrap]}>
                                                {item.skillTags.split(',').map((value, optionIndex) =>
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
                                            </View>
                                          )}



                                          <View style={[styles.topPadding20]}>
                                            <View>
                                              <TouchableOpacity style={this.state.favorites.includes(item._id) ?  [styles.btnSquarish,styles.mediumBackground,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={(e) =>  this.favoriteItem(item,'project')}><Text style={[styles.descriptionText1,styles.whiteColor]}>{this.state.favorites.includes(item._id) ? "Following" : "Follow"}</Text></TouchableOpacity>
                                            </View>
                                          </View>

                                          <View style={[styles.spacer]} />
                                        </View>
                                      </View>

                                    </TouchableOpacity>
                                  </View>

                                </View>
                              )}
                            </View>
                          ) : (
                            <Text style={[styles.errorColor]}>Either projects are set to private or no projects have been added yet</Text>
                          )}
                        </View>
                      )}

                    </View>
                  )}

                  <View>
                    {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Goals') && (
                      <View style={[styles.row20,styles.centerHorizontally]}>

                        <View style={[styles.bottomMargin20]}>
                          <Text style={[styles.headingText2]}>Goals</Text>
                        </View>

                        {(this.state.goalPublicPreference === 'None') ? (
                          <View>
                            <Text style={[styles.errorColor]}>Goals for this profile have been set to private</Text>
                          </View>
                        ) : (
                          <View>

                            {(this.state.goals && this.state.goals.length > 0) ? (
                              <View>
                                {this.state.goals.map((value, index) =>
                                  <View key={index}>

                                    <View style={[styles.bottomMargin20]}>
                                      <View style={[styles.flexCenter, styles.zIndex1]}>
                                        <View style={[styles.square50,styles.flexCenter,styles.whiteBackground,styles.bottomMarginNegative35,styles.errorBorder,styles.padding10, { borderRadius: 25 }]}>
                                          <Image source={{ uri: targetIconOrange }} style={[styles.square30,styles.contain]} />
                                        </View>
                                      </View>

                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showGoalDetails: true, selectedGoal: value })}>
                                        <View style={[styles.elevatedBox,styles.whiteBackground]} >

                                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />

                                          <View style={[styles.horizontalPadding30]} >
                                            <Text style={[styles.headingText5,styles.centerText]}>{value.title}</Text>

                                            {(value.goalType) && (
                                              <View style={[styles.topPadding20]}>
                                                <Text style={[styles.descriptionText3,styles.centerText]}>[{value.goalType.description}]</Text>
                                              </View>
                                            )}

                                            <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                                            <View style={[styles.horizontalLine]} />

                                            <View style={[styles.topPadding20]}>
                                              <Text style={[styles.descriptionText3,styles.centerText]}>by  <Text onPress={() => this.props.navigation.navigate('Profile', { username: value.creatorUsername })} style={[styles.ctaColor,styles.boldText]}>{value.creatorFirstName} {value.creatorLastName}</Text></Text>
                                            </View>

                                            <View style={[styles.topPadding20]}>
                                              {(value.startDate) ? (
                                                <Text style={[styles.descriptionText3,styles.centerText]}>{convertDateToString(new Date(value.startDate),"date-2")} - {convertDateToString(new Date(value.deadline),"date-2")}</Text>
                                              ) : (
                                                <Text style={[styles.descriptionText3,styles.centerText]}>Deadline: {convertDateToString(new Date(value.deadline),"date-2")}</Text>
                                              )}
                                            </View>

                                            <View style={[styles.topPadding]}>
                                              {this.renderTags(value.selectedCareers, 'careers')}
                                              {this.renderTags(value.selectedOpportunities, 'opportunities')}
                                              {this.renderTags(value.competencies, 'competencies')}
                                              {this.renderTags(value.selectedFunctions, 'functions')}
                                              {this.renderTags(value.selectedIndustries, 'industries')}
                                              {this.renderTags(value.selectedHours, 'hours')}
                                              {this.renderTags(value.selectedPayRanges, 'payRanges')}
                                              {this.renderTags(value.selectedSchools, 'schools')}
                                              {this.renderTags(value.selectedMajors, 'majors')}

                                              {(value.description) ? (
                                                <Text style={[styles.descriptionText3,styles.descriptionTextColor,styles.topMargin,styles.centerText]}>{value.description}</Text>
                                              ) : (
                                                <View />
                                              )}

                                              {(value.goalType && value.goalType.name === 'Alternatives') ? (
                                                <View>
                                                  {(value.pollQuestion) ? (
                                                    <Text style={[styles.headingText5,styles.topMargin20]}>{value.pollQuestion}</Text>
                                                  ) : (
                                                    <View />
                                                  )}
                                                  <View style={[styles.topMargin20,styles.rowDirection]}>
                                                    <View style={[styles.flex45]}>
                                                      <Text style={[styles.standardText]}>{value.aName}</Text>
                                                    </View>
                                                    <View style={[styles.flex10]}>
                                                      <Text style={[styles.centerText,styles.headingText4]}>VS</Text>
                                                    </View>
                                                    <View style={[styles.flex45]}>
                                                      <Text style={[styles.rightText,styles.standardText]}>{value.bName}</Text>
                                                    </View>
                                                  </View>
                                                </View>
                                              ) : (
                                                <View />
                                              )}
                                            </View>

                                            <View style={[styles.topPadding20]}>
                                              <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={(e) =>  this.itemClicked(e,'helpOut', value)}><Text style={[styles.descriptionText1,styles.whiteColor]}>Help Out</Text></TouchableOpacity>
                                            </View>

                                            {(this.state.sortCriteriaArray && this.state.sortCriteriaArray[index] && this.state.sortCriteriaArray[index].name) && (
                                              <View style={[styles.topPadding]}>
                                                <View style={[styles.halfSpacer]} />
                                                <Text style={[styles.errorColor,styles.descriptionText2]}>{this.state.sortCriteriaArray[index].name}: {this.state.sortCriteriaArray[index].criteria}</Text>
                                              </View>
                                            )}
                                            {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[index] && this.state.filterCriteriaArray[index].name) && (
                                              <View style={[styles.topPadding]}>
                                                <View style={[styles.halfSpacer]} />
                                                <Text style={[styles.errorColor,styles.descriptionText2]}>{this.state.filterCriteriaArray[index].name}: {this.state.filterCriteriaArray[index].criteria}</Text>
                                              </View>
                                            )}

                                            <View style={[styles.spacer]} />
                                          </View>
                                        </View>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                <Text style={[styles.errorColor]}>Either goals are set to private or no goals have been added yet</Text>
                              </View>
                            )}

                          </View>
                        )}

                      </View>
                    )}

                    {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Passions') && (
                      <View style={[styles.row20,styles.centerHorizontally]}>
                        <View style={[styles.bottomMargin20]}>
                          <Text style={[styles.headingText2]}>Passions</Text>
                        </View>

                        {(this.state.passionPublicPreference === 'None') ? (
                          <View>
                            <Text style={[styles.errorColor]}>Passions for this profile have been set to private</Text>
                          </View>
                        ) : (
                          <View>
                            {(this.state.passions && this.state.passions.length > 0) ? (
                              <View>
                                {this.state.passions.map((value, index) =>
                                  <View key={index}>
                                    <View style={[styles.standardBorder,styles.roundedCorners,styles.bottomMargin20,styles.whiteBackground,styles.mediumShadow]}>
                                      <TouchableOpacity style={[styles.padding20]} onPress={() => this.setState({ modalIsOpen: true, showPassionDetail: true, selectedPassion: value }) }>

                                        <View style={[styles.rowDirection]}>
                                          <View style={[styles.width50]}>
                                            <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                                            <Image source={{ uri: passionIconDark}} style={[styles.square40,styles.contain]} />
                                          </View>
                                          <View style={[styles.calcColumn90]}>
                                            <Text style={[styles.headingText4,styles.curtailText]}>{value.passionTitle}</Text>
                                            <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>Created: {value.createdAt}</Text>
                                          </View>
                                        </View>

                                        {(value.passionReason) && (
                                          <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText,styles.topMargin]}>{value.passionReason}</Text>
                                        )}
                                      </TouchableOpacity>
                                    </View>

                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                <Text style={[styles.errorColor]}>Either passions are set to private or no passions have been added yet</Text>
                              </View>
                            )}

                          </View>
                        )}

                      </View>
                    )}

                    {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Assessments') && (
                      <View style={[styles.row20,styles.centerHorizontally]}>
                        <View style={[styles.bottomMargin20]}>
                          <Text style={[styles.headingText2]}>Assessments</Text>
                        </View>

                        {(this.state.assessmentPublicPreference === 'None') ? (
                          <View>
                            <Text style={[styles.errorColor]}>Career assessments for this profile have been set to private</Text>
                          </View>
                        ) : (
                          <View>
                            {(this.state.assessments && this.state.assessments.length > 0) ? (
                              <View>
                                {this.state.assessments.map((value, index) =>
                                  <View key={index}>
                                    <View style={[styles.standardBorder,styles.roundedCorners,styles.bottomMargin20,styles.whiteBackground,styles.mediumShadow]}>
                                      <TouchableOpacity style={[styles.padding20]} onPress={() => this.setState({ modalIsOpen: true, showProjectDetail: false, showAssessmentDetail: true, showEndorsementDetail: false, selectedIndex: index, showMessageWidget: false }) }>

                                        <View style={[styles.rowDirection]}>
                                          <View style={[styles.width50]}>
                                            <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                                              {(value.category === 'Work Preferences') && (
                                                <Image source={{ uri: softwareDeveloperIcon}} style={[styles.square40,styles.contain]} />
                                              )}
                                              {(value.category === 'Interests') && (
                                                <Image source={{ uri: interestsIconDark}} style={[styles.square40,styles.contain]} />
                                              )}
                                              {(value.category === 'Skills') && (
                                                <Image source={{ uri: skillsIconDark}} style={[styles.square40,styles.contain]} />
                                              )}
                                              {(value.category === 'Personality') && (
                                                <Image source={{ uri: abilitiesIconDark}} style={[styles.square40,styles.contain]} />
                                              )}
                                              {(value.category === 'Values') && (
                                                <Image source={{ uri: socialIconDark}} style={[styles.square40,styles.contain]} />
                                              )}
                                          </View>
                                          <View style={[styles.calcColumn150]}>
                                            <Text style={[styles.headingText4,styles.curtailText]}>{value.category}</Text>
                                            <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>Updated: {value.updatedAt}</Text>
                                          </View>

                                        </View>

                                        {(value.description) && (
                                          <Text style={[styles.descriptionText1,styles.topMargin]}>{value.description}</Text>
                                        )}
                                      </TouchableOpacity>
                                    </View>

                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                <Text style={[styles.errorColor]}>Either career assessments are set to private or no career assessments have been added yet</Text>
                              </View>
                            )}
                          </View>
                        )}

                      </View>
                    )}

                    {(this.state.profileOptions[this.state.viewIndex] === 'All' || this.state.profileOptions[this.state.viewIndex] === 'Endorsements') && (
                      <View style={[styles.row20,styles.centerHorizontally]}>

                        <View style={[styles.bottomMargin20]}>
                          <Text style={[styles.headingText2]}>Endorsements</Text>
                        </View>

                        {(this.state.endorsementPublicPreference === 'None') ? (
                          <View>
                            <Text style={[styles.errorColor]}>Endorsements for this profile have been set to private</Text>
                          </View>
                        ) : (
                          <View>
                            {(this.state.assessments && this.state.assessments.length > 0) ? (
                              <View>
                                {this.state.endorsements.map((value, index) =>
                                  <View key={index}>

                                    <View style={[styles.standardBorder,styles.roundedCorners,styles.bottomMargin20,styles.whiteBackground,styles.mediumShadow]}>
                                      <TouchableOpacity style={[styles.padding20,styles.fullScreenWidth]} onPress={() => this.setState({ modalIsOpen: true, showProjectDetail: false, showAssessmentDetail: false, showEndorsementDetail: true, selectedIndex: index, showMessageWidget: false }) }>
                                        <View style={[styles.rowDirection]}>
                                          <View style={[styles.width50]}>
                                            <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                                              <Image source={{ uri: endorsementIconDark}} style={[styles.square40,styles.contain]} />
                                          </View>
                                          <View style={[styles.calcColumn90]}>
                                            <Text style={[styles.headingText4,styles.curtailText]}>{value.senderFirstName} {value.senderLastName}</Text>
                                            <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>Create: {value.createdAt}</Text>
                                          </View>
                                        </View>

                                        {(value.category) && (
                                          <Text style={[styles.descriptionText1,styles.topMargin]}>{value.category}</Text>
                                        )}

                                        {(value.isTransparent) ? (
                                          <View>
                                            {(value.overallRating) && (
                                              <View style={[styles.row10]}>
                                                <Text style={[styles.descriptionText2,styles.row3]}><Text style={[styles.ctaColor,styles.boldText]}>{value.overallRating} / 100</Text> Overall Rating</Text>
                                              </View>
                                            )}

                                            {(value.pathway && value.pathway !== '' && value.pathway !== 'Custom') && (
                                              <View style={[styles.row10]}>
                                                <Text style={[styles.descriptionText2]}>{value.pathway} Pathway</Text>
                                              </View>
                                            )}
                                          </View>
                                        ) : (
                                          <View>
                                            <Text style={[styles.descriptionText2]}>This endorsement has been marked confidential</Text>
                                          </View>
                                        )}

                                        <View style={[styles.row10]}>
                                          <Text style={[styles.descriptionText2]}><Text style={[styles.ctaColor,styles.boldText]}>{value.skillTraits.length}</Text> Skills and <Text style={[styles.ctaColor,styles.boldText]}>{value.examples.length}</Text> Examples</Text>
                                        </View>
                                      </TouchableOpacity>
                                    </View>

                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                <Text style={[styles.errorColor]}>Either competency endorsements are set to private or no competency endorsements were received yet</Text>
                              </View>
                            )}
                          </View>
                        )}


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
                     <View key="showServiceDefinitions" style={[styles.padding20,styles.calcColumn40]}>
                        <SubSendMessage profileData={this.state.profileData} navigation={this.props.navigation} closeModal={this.closeModal} />
                      </View>

                   </Modal>
                  )}

                  {(this.state.showShareButtons) && (
                    <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
                     <View key="showShareButtons" style={[styles.fullScreenWidth,styles.padding20,styles.centerText]}>
                        <Text style={[styles.headingText2]}>Share This Post with Friends!</Text>

                        <View style={[styles.topPadding20]}>
                          <Text>Share this link:</Text>
                          <Text style={[styles.boldText,styles.ctaColor]}>{"https://www.guidedcompass.com/app/social-posts/" + this.state.posts[this.state.selectedIndex]._id}</Text>
                        </View>

                        <View style={[styles.spacer]} />

                        <View style={[styles.topPadding20]}>
                          {this.renderShareButtons()}
                        </View>

                      </View>

                   </Modal>
                  )}

                  {(this.state.showGoalDetails || this.state.showHelpOutWidget) && (
                    <View>

                      <SubGoalDetails navigation={this.props.navigation} selectedGoal={this.state.selectedGoal} modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} showGoalDetails={this.state.showGoalDetails} showHelpOutWidget={this.state.showHelpOutWidget} profileData={this.state.profileData}/>
                   </View>
                  )}

                  {(this.state.showPassionDetail) && (
                    <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
                     <View key="showPassionDetail" style={[styles.fullScreenWidth,styles.padding20,styles.centerText]}>
                        <Text style={[styles.headingText2]}>{this.state.selectedPassion.passionTitle}</Text>
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
