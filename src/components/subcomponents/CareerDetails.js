import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

const checkmarkIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon-white.png';
const favoritesIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-white.png';
const shareIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/share-icon-dark.png';
const timeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-blue.png';
const moneyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/money-icon-blue.png';
const difficultyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/difficulty-icon-blue.png';
const ratingsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/ratings-icon-blue.png';
const profileIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-blue.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png';
const linkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon.png';
const careerMatchesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-dark.png';
const trendingUpIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/trending-up.png';
const membersIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/members-icon-blue.png';
const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';
const upvoteIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-blue.png';
const upvoteIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-grey.png';
const upvoteIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-white.png';
const likeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/like-icon-blue.png';
const likeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/like-icon-dark.png';
const commentIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/comment-icon-dark.png';
const sendIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/send-icon-dark.png';
const defaultProfileBackgroundImage = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/default-profile-background-image.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';

import SubComments from '../common/Comments';

import {convertDateToString} from '../functions/convertDateToString';

class CareerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      baseURL: 'https://www.guidedcompass.com',

      players: [],
      subNavCategories: ['All','Videos','Details','Ideal Profile','Questions','Projects','Courses','Jobs','Similar Careers'],
      subNavSelected: 'All',
      questionFilters: ['Hot','New'],
      questionFilterSelected: 'Hot',
      projectFilterSelected: 'Hot',
      favorites: [],
      completions: [],
      completedCourseDetails: [],
      favoritedCourseDetails: [],
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.favoriteItem = this.favoriteItem.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)

    this.renderKnowledge = this.renderKnowledge.bind(this)
    this.renderSkills = this.renderSkills.bind(this)
    this.renderAbilities = this.renderAbilities.bind(this)
    this.renderPersonality = this.renderPersonality.bind(this)
    this.renderTechnology = this.renderTechnology.bind(this)
    this.renderEducation = this.renderEducation.bind(this)
    this.renderOutlook = this.renderOutlook.bind(this)
    this.renderShareButtons = this.renderShareButtons.bind(this)
    this.redirectToSelf = this.redirectToSelf.bind(this)
    this.subNavClicked = this.subNavClicked.bind(this)
    this.questionFilterClicked = this.questionFilterClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.pullCourses = this.pullCourses.bind(this)
    this.pullJobs = this.pullJobs.bind(this)
    this.pullSimilarCareers = this.pullSimilarCareers.bind(this)
    this.pullGroupPosts = this.pullGroupPosts.bind(this)
    this.renderCourses = this.renderCourses.bind(this)
    this.renderJobs = this.renderJobs.bind(this)
    this.addItem = this.addItem.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.postGroupPost = this.postGroupPost.bind(this)
    this.voteOnItem = this.voteOnItem.bind(this)
    this.renderGroupPost = this.renderGroupPost.bind(this)
    this.retrieveComments = this.retrieveComments.bind(this)
    this.retrieveLikes = this.retrieveLikes.bind(this)
    this.videoCallback = this.videoCallback.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called within careerDetails ')

    if (this.props.careerSelected !== prevProps.careerSelected) {
      console.log('new career selected')
      this.retrieveData(this.props.careerSelected)
    }
  }


  retrieveData = async() => {
    try {

      console.log('this is causing the error')
      const emailId = await AsyncStorage.getItem('email')
      let email = emailId
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
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        if (this.props.careerSelected) {

          const careerSelected = this.props.careerSelected

          this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
            roleName, activeOrg, orgFocus, orgName, remoteAuth
          })

          Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId: email } })
          .then((response) => {
            console.log('Favorites query attempted', response.data);

             if (response.data.success) {
               console.log('successfully retrieved favorites')

               let favorites = []
               if (response.data.favorites) {
                 favorites = response.data.favorites
               }

               this.setState({ favorites })
             } else {
               console.log('no favorites data found', response.data.message)
             }

          }).catch((error) => {
             console.log('Favorites query did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
          .then((response) => {
            console.log('User details query 1 attempted', response.data);

            if (response.data.success) {
               console.log('successfully retrieved user details')

               let headline = response.data.user.headline
               let pictureURL = response.data.user.pictureURL
               this.setState({ headline, pictureURL });

            } else {
             console.log('no user details data found', response.data.message)
            }

          }).catch((error) => {
             console.log('User details query did not work', error);
          });

          if (this.state.directLink) {
            //the searchTerm should be the id to avoid the search
            Axios.get('https://www.guidedcompass.comapi/careers/details', { params: { searchTerm: careerSelected } })
            .then((response) => {
                console.log('Career details query attempted 1', response.data.success, response.data.career);

                if (response.data.success) {

                  this.props.navigation.setOptions({ headerTitle: response.data.career.name })

                  let careerDetailsPath = '/app/careers/' + response.data.career.name
                  if (this.props.fromAdvisor) {
                    careerDetailsPath = '/advisor/careers/' + response.data.career.name
                  }

                  const shareURL = "https://www.guidedcompass.com/careers/" + response.data.career.name
                  const shareTitle = 'Check Out ' + response.data.career.name + ' On Guided Compass!'
                  let shareBody = ''
                  if (response.data.career.overview) {
                    shareBody = response.data.career.overview.summary
                  }

                  this.setState({ careerDetails: response.data.career, careerDetailsPath, shareURL, shareTitle, shareBody })

                  let searchTerm = response.data.career.name
                  if (response.data.career.knowledgeArray && response.data.career.knowledgeArray.length > 0) {
                    searchTerm = response.data.career.knowledgeArray[0].category
                  }

                  this.pullCourses(searchTerm, null, null, null)

                  let jobSearchTerm = response.data.career.name
                  if (response.data.career.overview.alsoCalledArray && response.data.career.overview.alsoCalledArray.length > 0) {
                    jobSearchTerm = response.data.career.overview.alsoCalledArray[0]
                  }

                  this.pullJobs(jobSearchTerm, 'US', '10')

                  this.pullSimilarCareers([response.data.career])
                  this.pullGroupPosts(response.data.career.groupId, activeOrg, true)
                  this.pullProjects(response.data.career.name, activeOrg, true)

                  // pull group details for comments
                  Axios.get('https://www.guidedcompass.com/api/groups/byid', { params: { groupId: response.data.career.groupId } })
                  .then((response) => {
                     console.log('Group detail by id query attempted', response.data);

                     if (response.data.success) {
                       console.log('successfully retrieved posting')

                       const selectedGroup = response.data.group
                       this.setState({ selectedGroup })

                     } else {
                       console.log('there was an issue')
                     }
                  }).catch((error) => {
                      console.log('Group query did not work', error);
                  });
                } else {
                  console.log('there was an error on back-end:', response.data.message);
                }
            });
          } else {
            console.log('about to query', careerSelected)

            //the searchTerm should be the url param, to search the best match
            Axios.get('https://www.guidedcompass.com/api/careers/details', { params: { searchTerm: careerSelected } })
            .then((response) => {
                console.log('Career details query attempted 2');

                if (response.data.success) {

                  this.props.navigation.setOptions({ headerTitle: response.data.career.name })

                  let careerDetailsPath = '/app/careers/' + response.data.career.name
                  if (this.props.fromAdvisor) {
                    careerDetailsPath = '/advisor/careers/' + response.data.career.name
                  }

                  const shareURL = "https://www.guidedcompass.com/careers/" + response.data.career.name
                  const shareTitle = 'Check Out ' + response.data.career.name + ' On Guided Compass!'
                  let shareBody = ''
                  if (response.data.career.overview) {
                    shareBody = response.data.career.overview.summary
                  }

                  this.setState({ careerDetails: response.data.career, careerDetailsPath, shareURL, shareTitle, shareBody })

                  let searchTerm = response.data.career.name
                  if (response.data.career.knowledgeArray && response.data.career.knowledgeArray.length > 0) {
                    searchTerm = response.data.career.knowledgeArray[0].category
                  }

                  this.pullCourses(searchTerm, null, null, null)

                  let jobSearchTerm = response.data.career.name
                  if (response.data.career.overview.alsoCalledArray && response.data.career.overview.alsoCalledArray.length > 0) {
                    jobSearchTerm = response.data.career.overview.alsoCalledArray[0]
                  }

                  this.pullJobs(jobSearchTerm, 'US', '10')

                  this.pullSimilarCareers([response.data.career])
                  this.pullGroupPosts(response.data.career.groupId, activeOrg, true)
                  this.pullProjects(response.data.career.name, activeOrg, true)

                  // pull group details for comments
                  Axios.get('https://www.guidedcompass.com/api/groups/byid', { params: { groupId: response.data.career.groupId } })
                  .then((response) => {
                     console.log('Group detail by id query attempted', response.data);

                     if (response.data.success) {
                       console.log('successfully retrieved posting')

                       const selectedGroup = response.data.group
                       this.setState({ selectedGroup })

                     } else {
                       console.log('there was an issue')
                     }
                  }).catch((error) => {
                      console.log('Group query did not work', error);
                  });

                } else {
                  console.log('there was an error from back-end, message:', response.data.message);
                }
            });
          }
        }
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  pullCourses(searchValue, priceValue, durationValue, difficultyLevelValue) {
    console.log('pullCourses called', searchValue, priceValue, durationValue, difficultyLevelValue)

    this.setState({ animating: true, errorMessage: null, successMessage: null })

    // const searchValue = 'Excel'
    if (!searchValue) {
      searchValue = this.state.selectedSkill
    }
    const categoryValue = null
    const subcategoryValue = null
    // let priceValue = this.state.priceValue
    if (!priceValue) {
      priceValue = this.state.priceValue
    }
    let ratingValue = null
    if (!ratingValue) {
      ratingValue = 3.0
    }
    // let durationValue = this.state.durationValue
    if (!durationValue) {
      durationValue = this.state.durationValue
    }

    if (difficultyLevelValue) {
      difficultyLevelValue = difficultyLevelValue.toLowerCase()
    }

    Axios.get('https://www.guidedcompass.com/api/courses/search', { params: { searchValue, categoryValue, subcategoryValue, priceValue, ratingValue, durationValue, difficultyLevelValue } })
    .then((response) => {
      console.log('Courses query attempted', response.data);

        if (response.data.success) {
          console.log('successfully retrieved courses')

          if (response.data.responseData) {

            const courses = response.data.responseData.results
            this.setState({ courses, animating: false })
          }

        } else {
          console.log('no course data found', response.data.message)
          this.setState({ animating: false, errorMessage: 'Found no courses that match the criteria'})
        }

    }).catch((error) => {
        console.log('Course query did not work', error);
        this.setState({ animating: false, errorMessage: 'There was an unknown error retrieving the courses'})
    });
  }

  pullJobs(searchValue, location, radius) {
    console.log('pullJobs called', searchValue, location, radius)

    this.setState({ animating: true })
    // const searchValue = 'Excel'
    if (!searchValue) {
      searchValue = this.state.selectedJob
    }
    if (!location) {
      location = this.state.location
    }
    if (!radius) {
      radius = this.state.radius
    }

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      Axios.get('https://www.guidedcompass.com/api/external-jobs/search', { params: { searchValue, location, radius } })
      .then((response) => {
        console.log('Jobs query attempted', response.data);

          if (response.data.success) {
            console.log('successfully retrieved jobs')

            if (response.data.postings) {

              const jobs = response.data.postings
              self.setState({ jobs, animating: false })
            }

          } else {
            console.log('no job data found', response.data.message)
            self.setState({ animating: false })
          }

      }).catch((error) => {
          console.log('Job query did not work', error);
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

  pullSimilarCareers(selectedCareers) {
    console.log('pullSimilarCareers called', selectedCareers)

    Axios.put('https://www.guidedcompass.com/api/careers/similar', { selectedCareers })
    .then((response) => {
      console.log('Similar careers query attempted', response.data);

        if (response.data.success) {
          console.log('similar careers query worked')

          let matchScores = response.data.matchScores
          const similarCareers = response.data.careers

          this.setState({ animating: false, matchingView: true, matchScores, similarCareers })

        } else {
          console.log('Career match did not work', response.data.message)
          this.setState({ animating: false, matchingView: true, errorMessage: 'there was an error: ' + response.data.message })
        }

    }).catch((error) => {
        console.log('Similar careers did not work for some reason', error);
        this.setState({ animating: false, matchingView: true, errorMessage: 'there was an error' })
    });
  }

  pullGroupPosts(groupId, orgCode, sortByUpvotes) {
    console.log('pullGroupPosts called', groupId, orgCode, sortByUpvotes)

    this.setState({ groupPostsAreLoading: true })

    Axios.get('https://www.guidedcompass.com/api/group-posts', { params: { groupId, orgCode, sortByUpvotes, resLimit: 5, recent: true } })
    .then((response) => {
       console.log('Group posts query attempted', response.data);

       if (response.data.success) {
         console.log('successfully retrieved group posts')

         let groupPosts = []
         if (response.data.groupPosts) {
           groupPosts = response.data.groupPosts
         }

         this.setState({ groupPosts, groupPostsAreLoading: false })

       } else {
         this.setState({ groupPostsAreLoading: false })
       }
    }).catch((error) => {
        console.log('Group posts query did not work', error);
        this.setState({ groupPostsAreLoading: false })
    });
  }

  pullProjects(careerPath, orgCode, sortByUpvotes) {
    console.log('pullProjects called', careerPath, orgCode, sortByUpvotes)

    this.setState({ projectsAreLoading: true })

    Axios.get('https://www.guidedcompass.com/api/projects', { params: { orgCode, resLimit: 6, careerPath, sortByUpvotes, recent: true } })
    .then((response) => {
      console.log('Projects query attempted', response.data);

        if (response.data.success) {
          console.log('successfully retrieved projects')

          if (response.data.projects) {

            const projects = response.data.projects
            this.setState({ projects, projectsAreLoading: false })
          } else {
            this.setState({ projectsAreLoading: false })
          }

        } else {
          console.log('no project data found', response.data.message)
          this.setState({ projectsAreLoading: false })
        }

    }).catch((error) => {
        console.log('Project query did not work', error);
    });
  }

  formChangeHandler(eventName,eventValue) {
    console.log('formChangeHandler called')

    this.setState({ [eventName]: eventValue })

  }
  renderKnowledge() {
    console.log('renderKnowledge called');

    let rows = [];
    for (let i = 1; i <= this.state.careerDetails.knowledgeArray.length; i++) {
      console.log(i)
      rows.push(
        <View key={i}>
          <View style={[styles.row5]}>
            { (i === 1) ? <Text style={[styles.headingText6]}>Knowledge</Text> : <Text style={[styles.standardText]}> </Text>}
          </View>
          <View style={[styles.bottomPadding20,styles.rowDirection]}>
            <View style={[styles.width120]}>
                <Text style={[styles.standardText]}>{this.state.careerDetails.knowledgeArray[i - 1].category}</Text>
            </View>
            <View style={[styles.calcColumn180]}>
                <View>
                  { this.state.careerDetails.knowledgeArray[i - 1].subcategories[0] && (
                    <View><Text style={[styles.standardText]}>{this.state.careerDetails.knowledgeArray[i - 1].subcategories[0]}</Text></View>
                  )}
                  { this.state.careerDetails.knowledgeArray[i - 1].subcategories[1] && (
                    <View><Text style={[styles.standardText]}>{this.state.careerDetails.knowledgeArray[i - 1].subcategories[1]}</Text></View>
                  )}
                </View>
            </View>
          </View>
        </View>
      )
    }

    return rows

  }

  renderSkills() {
    console.log('renderSkills called');

    let rows = [];
    for (let i = 1; i <= this.state.careerDetails.skillsArray.length; i++) {
      console.log(i)
      rows.push(
        <View key={i}>
          <View style={[styles.row5]}>
              { (i === 1) ? <Text style={[styles.headingText6]}>Skills</Text> : <Text style={[styles.standardText]}> </Text>}
          </View>
          <View style={[styles.bottomPadding20,styles.rowDirection]}>
            <View style={[styles.width120]}>
                <Text style={[styles.standardText]}>{this.state.careerDetails.skillsArray[i - 1].category}</Text>
            </View>
            <View style={[styles.calcColumn180,styles.leftPadding]}>
                <View>
                  { this.state.careerDetails.skillsArray[i - 1].subcategories[0] && (
                    <View><Text style={[styles.standardText]}>{this.state.careerDetails.skillsArray[i - 1].subcategories[0]}</Text></View>
                  )}
                  { this.state.careerDetails.skillsArray[i - 1].subcategories[1] && (
                    <View><Text style={[styles.standardText]}>{this.state.careerDetails.skillsArray[i - 1].subcategories[1]}</Text></View>
                  )}
                </View>
            </View>
          </View>

        </View>
      )
    }

    return rows

  }

  renderAbilities() {
    console.log('renderAbilities called');

    let rows = [];
    for (let i = 1; i <= this.state.careerDetails.abilitiesArray.length; i++) {
      console.log(i)
      rows.push(
        <View key={i}>
          <View style={[styles.row5]}>
              { (i === 1) ? <Text style={[styles.headingText6]}>Abilities</Text> : <Text style={[styles.standardText]}> </Text>}
          </View>
          <View style={[styles.bottomPadding20,styles.rowDirection]}>
            <View style={[styles.width120]}>
                <Text style={[styles.standardText]}>{this.state.careerDetails.abilitiesArray[i - 1].category}</Text>
            </View>
            <View style={[styles.calcColumn180,styles.leftPadding]}>
                <View>
                  { this.state.careerDetails.abilitiesArray[i - 1].subcategories[0] && (
                    <View><Text style={[styles.standardText]}>{this.state.careerDetails.abilitiesArray[i - 1].subcategories[0]}</Text></View>
                  )}
                  { this.state.careerDetails.abilitiesArray[i - 1].subcategories[1] && (
                    <View><Text style={[styles.standardText]}>{this.state.careerDetails.abilitiesArray[i - 1].subcategories[1]}</Text></View>
                  )}
                </View>
            </View>
          </View>

        </View>
      )
    }

    return rows

  }

  renderPersonality() {
    console.log('renderPersonality called');

    let rows = [];

    if (this.state.careerDetails.onetInterests && this.state.careerDetails.onetInterests.enterprising) {
      rows.push(
        <View key={0}>
          <View style={[styles.row5]}>
              <Text style={[styles.standardText]}>Interests</Text>
          </View>

          <View style={[styles.bottomPadding20,styles.rowDirection]}>
            <View style={[styles.width120]}>
                <Text style={[styles.standardText]}>Realistic</Text>
                <Text style={[styles.standardText]}>Artistic</Text>
                <Text style={[styles.standardText]}>Investigative</Text>
                <Text style={[styles.standardText]}>Social</Text>
                <Text style={[styles.standardText]}>Enterprising</Text>
                <Text style={[styles.standardText]}>Conventional</Text>
            </View>
            <View style={[styles.calcColumn180,styles.leftPadding]}>
                <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.realistic / 7) * 100).toFixed()}%</Text>
                <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.artistic / 7) * 100).toFixed()}%</Text>
                <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.investigative / 7) * 100).toFixed()}%</Text>
                <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.social / 7) * 100).toFixed()}%</Text>
                <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.enterprising / 7) * 100).toFixed()}%</Text>
                <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.conventional / 7) * 100).toFixed()}%</Text>
            </View>
          </View>

        </View>
      )
    }

    return rows

  }

  renderTechnology() {
    console.log('renderTechnology called');

    let rows = [];
    for (let i = 1; i <= this.state.careerDetails.technologyArray.length; i++) {

      rows.push(
        <View key={i}>
          <View style={[styles.row5]}>
              { (i === 1) ? <Text style={[styles.headingText6]}>Technology</Text> : <Text style={[styles.standardText]}> </Text>}
          </View>
          <View style={[styles.bottomPadding20,styles.rowDirection]}>
            <View style={[styles.width120]}>
                <Text style={[styles.standardText]}>{this.state.careerDetails.technologyArray[i - 1].name}</Text>
            </View>
            <View style={[styles.calcColumn180,styles.leftPadding]}>
                <View>
                  { this.state.careerDetails.technologyArray[i - 1].examples[0] && (
                    <View><Text style={[styles.standardText]}>{this.state.careerDetails.technologyArray[i - 1].examples[0]}</Text></View>
                  )}
                  { this.state.careerDetails.technologyArray[i - 1].examples[1] && (
                    <View><Text style={[styles.standardText]}>{this.state.careerDetails.technologyArray[i - 1].examples[1]}</Text></View>
                  )}
                </View>
            </View>
          </View>

        </View>
      )
    }

    return rows

  }

  renderEducation() {
    console.log('renderEducation called');

    let rows = [];
    for (let i = 1; i <= this.state.careerDetails.educationData.education_usually_needed.length; i++) {
      rows.push(
        <View key={i}>
            <View style={[styles.row5]}>
              { (i === 1) ? <Text style={[styles.headingText6]}>Education</Text> : <Text style={[styles.standardText]}> </Text>}
          </View>
          <View style={[styles.bottomPadding20]}>
              <Text style={[styles.standardText]}>{this.state.careerDetails.educationData.education_usually_needed[i - 1]}</Text>
          </View>

        </View>
      )
    }

    return rows

  }

  renderOutlook() {
    console.log('renderOutlook called');

    return (
      <View key={0}>
        {(this.state.careerDetails.outlookData && this.state.careerDetails.outlookData.salaryMedian) && (
          <View style={[styles.topPadding20]}>
            <View style={[styles.rowDirection,styles.flex1]}>
                <View style={[styles.flex30]}>
                  {(this.state.careerDetails.outlookData.salary10thPercentile) ? (
                    <Text style={[styles.ctaColor,styles.headingText6,styles.centerText]}>${Number(this.state.careerDetails.outlookData.salary10thPercentile).toLocaleString()}</Text>
                  ) : (
                    <Text style={[styles.ctaColor,styles.headingText6,styles.centerText]}>$0</Text>
                  )}
                  <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.centerText]}>bottom 10%</Text>
                </View>
                <View style={[styles.flex5]}><Text style={[styles.standardText,styles.centerText]}>&#8212;</Text></View>
                <View style={[styles.flex30]}>
                  <Text style={[styles.ctaColor,styles.headingText6,styles.centerText]}>${Number(this.state.careerDetails.outlookData.salaryMedian).toLocaleString()}</Text>
                  <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.centerText]}>middle 50%</Text>
                </View>
                <View style={[styles.flex5]}><Text style={[styles.standardText,styles.centerText]}>&#8212;</Text></View>
                <View style={[styles.flex30]}>
                  {(this.state.careerDetails.outlookData.salarty90thPercentile) ? (
                    <Text style={[styles.ctaColor,styles.headingText6,styles.centerText]}>${Number(this.state.careerDetails.outlookData.salary90thPercentile).toLocaleString()}</Text>
                  ) : (
                    <Text style={[styles.ctaColor,styles.headingText6,styles.centerText]}>$210K+</Text>
                  )}
                  <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.centerText]}>top 90%</Text>
                </View>
            </View>
          </View>
        )}
      </View>
    )
  }

  redirectToSelf(searchString) {
    console.log('redirectToSelf called', searchString)
    this.getInitialData(searchString)
  }

  subNavClicked(subNavSelected) {
    console.log('subNavClicked called', subNavSelected)

    this.setState({ subNavSelected })

  }

  questionFilterClicked(questionFilterSelected, type) {
    console.log('questionFilterClicked called', questionFilterSelected, type)

    if (type === 'question') {
      this.setState({ questionFilterSelected })
      if (questionFilterSelected === 'Hot') {
        this.pullGroupPosts(this.state.careerDetails._id, this.state.activeOrg, true)
      } else {
        // new
        this.pullGroupPosts(this.state.careerDetails._id, this.state.activeOrg, false)
      }
    } else if (type === 'project') {
      this.setState({ projectFilterSelected: questionFilterSelected })
      if (questionFilterSelected === 'Hot') {
        this.pullProjects(this.state.careerDetails.name, this.state.activeOrg, true)
      } else {
        // new
        this.pullProjects(this.state.careerDetails.name, this.state.activeOrg, false)
      }
    }
  }

  favoriteItem(item) {
    console.log('favoriteItem called', item)

    let itemId = item._id

    let favoritesArray = this.state.favorites

    if (favoritesArray.includes(itemId)){

      let index = favoritesArray.indexOf(itemId)
      if (index > -1) {
        favoritesArray.splice(index, 1);
      }

      Axios.post('https://www.guidedcompass.com/api/favorites/save', {
        favoritesArray, emailId: this.state.emailId
      })
      .then((response) => {
        console.log('attempting to save favorites')
        if (response.data.success) {
          console.log('saved successfully', response.data)
          //clear values
          this.setState({
            serverSuccessPlan: true,
            serverSuccessMessagePlan: 'Favorite saved!'
          })
        } else {
          console.log('did not save successfully')
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'error:' + response.data.message
          })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'there was an error saving favorites'
          })
      });

    } else {
      console.log('adding item: ', favoritesArray, itemId)
      favoritesArray.push(itemId)
      Axios.post('https://www.guidedcompass.com/api/favorites/save', {
        favoritesArray, emailId: this.state.emailId
      })
      .then((response) => {
        console.log('attempting to save favorites')
        if (response.data.success) {
          console.log('saved successfully', response.data)
          //clear values
          this.setState({
            serverSuccessPlan: true,
            serverSuccessMessagePlan: 'Favorite saved!'
          })
        } else {
          console.log('did not save successfully')
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'error:' + response.data.message
          })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'there was an error saving favorites'
          })
      });
    }

    console.log('favorites', favoritesArray)
    this.setState({ favorites: favoritesArray })
  }

  renderShareButtons() {
    console.log('renderShareButtons called')


  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showShareButtons: false, addQuestion: false, addProject: false, showUpvotes: false, showComments: false })
  }

  renderCourses() {
    console.log('renderBrowseCourses called')

    return (
      <View key="browseCourses">
        <View style={[styles.row20]}>

          {(this.state.animating) ? (
            <View style={[styles.flex1,styles.flexCenter]}>
              <View>
                <ActivityIndicator
                   animating = {this.state.animating}
                   color = '#87CEFA'
                   size = "large"
                   style={[styles.square80, styles.centerHorizontally]}/>

                <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Pulling results...</Text>

              </View>
            </View>
          ) : (
            <View>
                {this.state.courses && this.state.courses.map((value, index) =>
                  <View>
                    <View key={index}>
                      <View style={[styles.spacer]} />

                      <View style={[styles.rowDirection]}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + value.url)} style={[styles.calcColumn92,styles.rowDirection]}>
                          <View style={[styles.width70]}>
                            <Image source={{ uri: value.image_125_H}} style={[styles.square60,styles.contain]}/>
                          </View>
                          <View style={[styles.calcColumn162]}>
                            <Text style={[styles.headingText5]}>{value.title}</Text>
                            <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>{value.headline}</Text>

                            <View style={[styles.halfSpacer]} />

                            <View style={[styles.rowDirection]}>
                              {(value.duration) && (
                                <View style={[styles.descriptionText3,styles.rowDirection]}>
                                  <View style={[styles.rightMargin]}>
                                    <Image source={{ uri: timeIconBlue}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.rightMargin]}>
                                    <Text style={[styles.standardText]}>{value.duration}</Text>
                                  </View>
                                </View>
                              )}

                              {(value.price) && (
                                <View style={[styles.descriptionText3,styles.rowDirection]}>
                                  <View style={[styles.rightMargin]}>
                                    <Image source={{ uri: moneyIconBlue}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.rightMargin]}>
                                    <Text style={[styles.standardText]}>{value.price}</Text>
                                  </View>
                                </View>
                              )}

                              {(value.difficultyLevel) && (
                                <View style={[styles.descriptionText3,styles.rowDirection]}>
                                  <View style={[styles.rightMargin]}>
                                    <Image source={{ uri: difficultyIconBlue}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.rightMargin]}>
                                    <Text style={[styles.standardText]}>{value.difficultyLevel ? value.difficultyLevel : "Beginner"}</Text>
                                  </View>
                                </View>
                              )}

                              {(value.rating && value.ratingCount) && (
                                <View style={[styles.descriptionText3,styles.rowDirection]}>
                                  <View style={[styles.rightMargin]}>
                                    <Image source={{ uri: ratingsIconBlue}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.rightMargin]}>
                                    <Text style={[styles.standardText]}>{value.rating} / 5.0 - {value.ratingCount} Ratings</Text>
                                  </View>
                                </View>
                              )}

                              {(value.studentCount) && (
                                <View style={[styles.descriptionText3,styles.rowDirection]}>
                                  <View style={[styles.rightMargin]}>
                                    <Image source={{ uri: profileIconBlue}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.rightMargin]}>
                                    <Text style={[styles.standardText]}>{value.studentCount} Students</Text>
                                  </View>
                                </View>
                              )}
                            </View>

                            <View style={[styles.halfSpacer]} />
                          </View>
                        </TouchableOpacity>

                        <View style={[styles.leftPadding]} >
                          <View>
                            <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + value.url)}>
                              <Image source={{ uri: linkIcon}} style={[styles.square22,styles.contain]}/>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      {(this.state.sortCriteriaArray && this.state.sortCriteriaArray[index] && this.state.sortCriteriaArray[index].name) && (
                        <View style={[styles.leftPadding70]}>
                          <View style={[styles.halfSpacer]} />
                          <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.sortCriteriaArray[index].name}: {this.standardizeValue('sort',index, this.state.sortCriteriaArray[index].criteria)}</Text>
                        </View>
                      )}
                      {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[index] && this.state.filterCriteriaArray[index].name) && (
                        <View style={[styles.leftPadding70]}>
                          <View style={[styles.halfSpacer]} />
                          <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.filterCriteriaArray[index].name}: {this.state.filterCriteriaArray[index].criteria}</Text>
                        </View>
                      )}
                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                      <View style={[styles.horizontalLine]} />

                      <View style={[styles.spacer]} />
                    </View>

                  </View>
                )}

            </View>
          )}

        </View>
      </View>
    )
  }

  renderJobs() {
    console.log('renderJobs called')

    let rows = []
    if (this.state.jobs) {
      for (let i = 1; i <= this.state.jobs.length; i++) {

        const index = i - 1

        let url = ''
        if (this.state.jobs[index].URL) {
          url = this.state.jobs[index].URL
        }

        rows.push(
          <View key={i}>
            <View>
              <View style={[styles.spacer]}/><View style={[styles.spacer]}/>

              <TouchableOpacity onPress={() => Linking.openURL(url)} style={[styles.rowDirection]}>
                <View style={[styles.width50]}>
                  <View style={[styles.halfSpacer]}/>
                  <Image source={{ uri: opportunitiesIconDark}} style={[styles.square40,styles.contain]}/>
                </View>
                <View style={[styles.calcColumn140,styles.leftPadding20]}>
                  <Text style={[styles.headingText6]}>{this.state.jobs[index].JobTitle} @ {this.state.jobs[index].Company}</Text>
                  <Text style={[styles.descriptionText2,styles.topPadding5]}>{this.state.jobs[index].Location} | Posted on {this.state.jobs[index].AccquisitionDate}</Text>
                </View>
                <View style={[styles.width30,styles.leftPadding]}>
                  <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                  <Image source={{ uri: linkIcon}} style={[styles.square22,styles.contain]}/>
                </View>

                <View style={[styles.halfSpacer]} />

              </TouchableOpacity>
            </View>

            <View style={[styles.leftPadding70]}>
              {(this.state.searchString && this.state.searchString !== '') && (
                <Text style={[styles.descriptionText2,styles.errorColor,styles.rightPadding5]}>Search Term: {this.state.searchString};</Text>
              )}
              {(this.state.location && this.state.location !== '') && (
                <Text style={[styles.descriptionText2,styles.errorColor,styles.rightPadding5]}>Location: {this.state.location};</Text>
              )}
              {(this.state.radius && this.state.radius !== '') && (
                <Text style={[styles.descriptionText2,styles.errorColor,styles]}>Radius: {this.state.radius} Miles;</Text>
              )}

            </View>

            <View style={[styles.horizontalLine]} />

            <View style={[styles.spacer]}/>
          </View>
        )
      }
    }

    return rows
  }

  addItem(type) {
    console.log('addItem called', type)

    if (type === 'question') {
      this.setState({ modalIsOpen: true, addQuestion: true })
    } else if (type === 'project') {
      this.setState({ modalIsOpen: true, addProject: true })
    }
  }

  postGroupPost() {
    console.log('postMessage called')

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })
    if (!this.state.postMessage || this.state.postMessage === '') {
      this.setState({ errorMessage: 'Please add a message', isSaving: false })
    } else {

      const postMessage = this.state.postMessage
      const postLink = this.state.postLink
      const tags = this.state.tags

      const postObject = {
        groupId: this.state.careerDetails.groupId, groupName: this.state.careerDetails.name,
        firstName: this.state.cuFirstName, lastName: this.state.cuLastName, email: this.state.emailId,
        pictureURL: this.state.pictureURL, username: this.state.username,
        roleName: this.state.roleName, headline: this.state.headline,
        message: postMessage, url: postLink, tags, upvotes: [], downvotes: [], commentCount: 0,
        orgCode: this.state.activeOrg,
        createdAt: new Date(), updatedAt: new Date()
      }

      Axios.post('https://www.guidedcompass.com/api/group-posts', postObject)
      .then((response) => {
        console.log('attempting to save addition to groups')
        if (response.data.success) {
          console.log('saved addition to groups', response.data)

          let groupPosts = this.state.groupPosts
          if (groupPosts) {
            groupPosts.unshift(postObject)
          } else {
            groupPosts = [postObject]
          }

          this.setState({ groupPosts, isSaving: false })
          this.closeModal()

        } else {
          console.log('did not save successfully')
          this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({ errorMessage: 'there was an error saving the group posts', isSaving: false})
      });
    }
  }

  voteOnItem(e, item, direction, index, type) {
    console.log('voteOnItem called', index)

    e.preventDefault()
    e.stopPropagation()

    this.setState({ successMessage: null, errorMessage: null })

    const _id = item._id
    const emailId = this.state.emailId
    let changeUpvote = true
    const updatedAt = new Date()

    if (type === 'project') {
      console.log('vote on project')
      Axios.post('https://www.guidedcompass.com/api/projects', { _id, emailId, changeUpvote, updatedAt })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Project save worked', response.data);

          const successMessage = 'Project successfully updated!'

          let projects = this.state.projects
          projects[index] = response.data.project
          this.setState({ projects, successMessage })

        } else {
          console.error('there was an error posting the project');
          const errorMessage = response.data.message
          this.setState({ errorMessage })
        }
      }).catch((error) => {
          console.log('The talk post did not work', error);
      });
    } else {
      Axios.post('https://www.guidedcompass.com/api/group-posts', { _id, emailId, changeUpvote, updatedAt })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Group posts save worked', response.data);

          const successMessage = 'Group posting successfully updated!'

          let upvotes = item.upvotes
          let downvotes = item.downvotes

          if (direction === 'up') {
            console.log('in up')

            if (upvotes.includes(this.state.emailId)) {
              const removeIndex = upvotes.indexOf(this.state.emailId)
              if (removeIndex > -1) {
                upvotes.splice(removeIndex, 1);
                item['upvotes'] = upvotes
                changeUpvote = true

                let groupPosts = this.state.groupPosts
                groupPosts[index]= item
                this.setState({ groupPosts, successMessage })
              }
            } else {

              upvotes.push(this.state.emailId)
              changeUpvote = true

              if (downvotes.includes(this.state.emailId)) {
                const removeIndex = downvotes.indexOf(this.state.emailId)
                if (removeIndex > -1) {
                  downvotes.splice(removeIndex, 1);
                }

                item['upvotes'] = upvotes
                item['downvotes'] = downvotes

                let groupPosts = this.state.groupPosts
                groupPosts[index] = item
                this.setState({ groupPosts, successMessage })
              } else {

                item['upvotes'] = upvotes

                let groupPosts = this.state.groupPosts
                groupPosts[index] = item

                this.setState({ groupPosts, successMessage })
              }
            }

          } else {

            if (downvotes.includes(this.state.emailId)) {
              console.log('un-downvoting')
              const removeIndex = downvotes.indexOf(this.state.emailId)
              if (removeIndex > -1) {
                downvotes.splice(removeIndex, 1);
                item['downvotes'] = downvotes

                let groupPosts = this.state.groupPosts
                groupPosts[index] = item

                this.setState({ groupPosts, successMessage })
              }
            } else {
              console.log('initial downvote')
              downvotes.push(this.state.emailId)

              if (upvotes.includes(this.state.emailId)) {
                console.log('downvoting from previous upvote')
                const removeIndex = upvotes.indexOf(this.state.emailId)
                if (removeIndex > -1) {
                  upvotes.splice(removeIndex, 1);
                  changeUpvote = true
                }

                item['upvotes'] = upvotes
                item['downvotes'] = downvotes

                let groupPosts = this.state.GroupPosts
                groupPosts[index] = item

                this.setState({ groupPosts, successMessage })
              } else {
                item['downvotes'] = downvotes

                let groupPosts = this.state.groupPosts
                groupPosts[index] = item
                this.setState({ groupPosts, successMessage })
              }
            }
          }

        } else {
          console.error('there was an error posting the group post');
          const errorMessage = response.data.message
          this.setState({ errorMessage })
        }
      }).catch((error) => {
          console.log('The talk post did not work', error);
      });
    }
  }

  renderGroupPost(item, index, inModal) {
    console.log('renderGroupPost called')

    return (
      <View key={index} style={(inModal) ? [] : [styles.card]}>
        <View style={[styles.padding10]}>
          <View style={[styles.rowDirection]}>
            <View style={[styles.width70,styles.rightPadding]}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: item.username })}>
                <Image source={{ uri: item.pictureURL}} style={[styles.square50,styles.contain,styles.standardBorder,{ borderRadius: 25 }]} />
              </TouchableOpacity>
            </View>
            <View style={[styles.calcColumn230]}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: item.username })}>
                <Text style={[styles.headingText5,styles.boldText]}>{item.firstName} {item.lastName}</Text>
              </TouchableOpacity>
              <Text style={[styles.descriptionText3]}>{item.headline}</Text>
              <Text style={[styles.descriptionText4,styles.descriptionTextColor,styles.boldText]}>{convertDateToString(item.createdAt,"daysAgo")}</Text>
            </View>
            <View style={[styles.width80,styles.rightPadding]}>
              <TouchableOpacity onPress={(e) => this.voteOnItem(e, item, 'up', index) }>
                <View style={[styles.standardBorder,styles.roundedCorners,styles.rowDirection]}>
                  <View style={[styles.padding7]}>
                    <Image source={(item.upvotes.includes(this.state.emailId)) ? { uri: upvoteIconBlue} : { uri: upvoteIconGrey}} style={[styles.square15,styles.contain]}/>
                  </View>
                  <View style={[styles.verticalSeparator30]} />
                  <View style={[styles.horizontalPadding10]}>
                    <View style={[styles.halfSpacer]} />
                    <Text style={[styles.descriptionText2,styles.boldText]}>{item.upvotes.length}</Text>
                  </View>

                </View>
              </TouchableOpacity>
            </View>

          </View>
          <View style={[styles.row10]}>
            <Text style={[styles.descriptionText3]}>{item.message}</Text>
            <TouchableOpacity style={[styles.topPadding]} onPress={() => Linking.openURL(item.url)}><Text style={[styles.descriptionText3,styles.boldText]}>{item.url}</Text></TouchableOpacity>
          </View>
          {(item.tags && item.tags.length > 0) && (
            <View style={[styles.bottomPadding,styles.rowDirection,styles.flexWrap]}>
              {item.tags.map((item2, index2) =>
                <View key={index2} style={[styles.rightPadding,styles.topPadding]}>
                  <View style={[styles.row5,styles.horizontalPadding10,styles.slightlyRoundedCorners,styles.transparentBorder,styles.lightBackground]}>
                    <Text style={[styles.descriptionText4]}>{item2}</Text>
                  </View>
                </View>
              )}
            </View>
          )}

          {(item.upvotes || (item.comments && item.comments.length > 0)) && (
            <View style={[styles.bottomPadding5]}>
              <TouchableOpacity onPress={() => this.retrieveLikes(index)}>
                <Text style={[styles.descriptionText3]}>{(item.upvotes) ? item.upvotes.length : 0} Upvotes</Text>
              </TouchableOpacity>
              <Text style={[styles.descriptionText3,styles.horizontalPadding5]}>&#8226;</Text>
              <TouchableOpacity onPress={() => this.retrieveComments(index)}>
                <Text style={[styles.descriptionText3]}>{(item.commentCount) ? item.commentCount : 0} Comments</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.horizontalLine]} />

        {(!inModal) && (
          <View style={[styles.row10,styles.horizontalPadding20,styles.rowDirection]}>
            <View>
              <TouchableOpacity onPress={(e) => this.voteOnItem(e, item, 'up', index) } style={[styles.rowDirection]}>
                <View style={[styles.rightPadding8]}>
                  <Image source={(item.upvotes.includes(this.state.emailId))? { uri: likeIconBlue} : { uri: likeIconDark}} style={[styles.square18,styles.contain,styles.centerHorizontally]} />
                </View>
                <View style={[styles.rightPadding15]}>
                  <Text style={(item.upvotes.includes(this.state.emailId)) ? [styles.descriptionText2,styles.ctaColor,styles.boldText] : [styles.descriptionText2]}>{(item.upvotes.includes(this.state.emailId)) ? "Liked" : "Like"}</Text>
                </View>
              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() => this.retrieveComments(index)} disabled={this.state.isLoading}  style={[styles.rowDirection]}>
                <View style={[styles.rightPadding8]}>
                  <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                  <Image source={{ uri: commentIconDark}} style={[styles.square18,styles.contain,styles.centerHorizontally]} />
                </View>
                <View style={[styles.rightPadding15]}>
                  <Text style={[styles.descriptionText2]}>Comment</Text>
                </View>

              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showShareButtons: true, sharePosting: true, selectedIndex: index })}  style={[styles.rowDirection]}>
                <View style={[styles.rightPadding8]}>
                  <Image source={{ uri: shareIconDark}} style={[styles.square18,styles.contain,styles.centerHorizontally]} />
                </View>
                <View style={[styles.rightPadding15]}>
                  <Text style={[styles.descriptionText2]}>Share</Text>
                </View>

              </TouchableOpacity>
            </View>

            <View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages', { groupPost: item })}  style={[styles.rowDirection]}>
                <View style={[styles.rightPadding8]}>
                  <Image source={{ uri: sendIconDark}} style={[styles.square18,styles.contain,styles.centerHorizontally]} />
                </View>
                <View style={[styles.rightPadding15]}>
                  <Text style={[styles.descriptionText2]}>Send</Text>
                </View>

              </TouchableOpacity>
            </View>

          </View>
        )}
      </View>
    )
  }

  retrieveComments(index) {
    console.log('retrieveComments called', index)

    // pull comments
    Axios.get('https://www.guidedcompass.com/api/comments', { params: { parentPostId: this.state.groupPosts[index]._id } })
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

    const userIds = this.state.groupPosts[index].upvotes
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

  videoCallback(event, callback) {
    console.log('videoCallback called', event, callback)

    if (callback === 'onReady') {
      const players = this.state.players;
      players.push(event.target);
      this.setState({ players });
      console.log('players: ', event.target.id)
    } else if (callback === 'onPlay') {
      this.state.players.forEach((player) => {
        if (player.id !== event.target.id) {
          player.pauseVideo();
        }
      });
    }
  }

  render() {

    let pathPrefix = '/app/careers/'
    if (this.props.fromAdvisor) {
      pathPrefix = '/advisor/careers/'
    }

    return (
        <ScrollView>
            { this.state.careerDetails && (
              <View>
                <View style={[styles.card,styles.topMargin20]}>
                  <View style={[styles.topPadding20]}>
                    <Text style={[styles.headingText2,styles.centerText]}>{this.state.careerDetails.name}</Text>
                  </View>

                  {this.renderOutlook()}

                  <View style={[styles.topPadding20,styles.centerText,styles.rowDirection,styles.flex1]}>
                    <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.rightMargin5,styles.rowDirection,styles.flexCenter,styles.flex50]} onPress={() => this.favoriteItem(this.state.careerDetails)}>
                      <View>
                        <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                        {(this.state.favorites.includes(this.state.careerDetails._id)) ? <Image source={{ uri: checkmarkIconWhite}} style={[styles.square15,styles.contain]} /> : <Image source={{ uri: favoritesIconWhite}} style={[styles.square15,styles.contain]} />}
                      </View>
                      <View style={[styles.leftPadding]}>
                        <Text style={[styles.standardText,styles.whiteColor]}>{(this.state.favorites.includes(this.state.careerDetails._id)) ? "Favorited" : "Favorite"}</Text>
                      </View>

                    </TouchableOpacity>

                    <TouchableOpacity style={[styles.btnSquarish,styles.whiteBackground,styles.ctaBorder,styles.leftMargin5,styles.rowDirection, styles.flexCenter,styles.flex50]} onPress={() => this.setState({ modalIsOpen: true, showShareButtons: true })}>
                      <View>
                        <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                        <Image source={{ uri: shareIconDark}} style={[styles.square15,styles.contain]} />
                      </View>
                      <View style={[styles.leftPadding]}><Text style={[styles.standardText,styles.ctaColor]}>Share</Text></View>

                    </TouchableOpacity>
                  </View>

                  {(this.state.careerDetails.overview) ? (
                    <View style={[styles.row20]}>
                      <Text style={[styles.standardText,styles.centerText]}>{this.state.careerDetails.overview.summary}</Text>
                    </View>
                  ) : (
                    <View />
                  )}

                </View>

                <View style={[styles.cardClearPadding,styles.topMargin20]}>
                  <View style={[styles.fullScreenWidth,styles.whiteBackground]}>
                    <View>
                      <ScrollView style={[styles.carousel]} horizontal={true} style={[styles.horizontalPadding20]}>
                        {this.state.subNavCategories.map((value, index) =>
                          <View style={[styles.row10,styles.rightPadding30]}>
                            {(this.state.subNavCategories[index] === this.state.subNavSelected) ? (
                              <View style={[styles.selectedCarouselItem]}>
                                <Text key={value} style={[styles.headingText5]}>{value}</Text>
                              </View>
                            ) : (
                              <TouchableOpacity style={[styles.menuButton]} onPress={() => this.subNavClicked(value)}>
                                <Text key={value} style={[styles.headingText5]}>{value}</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      </ScrollView>
                    </View>
                  </View>
                </View>

                {((this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Videos') && this.state.careerDetails.videos && this.state.careerDetails.videos.length > 0) && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View style={[styles.topPadding20]}>
                      <Text style={[styles.headingText3]}>Videos</Text>
                      <Text style={[styles.descriptionText1]}>Watch a day in the life of this profession, get interview tips, and learn relevant skills.</Text>
                    </View>

                    <View style={[styles.spacer]} />

                    {this.state.careerDetails.videos.map((value, index) =>
                      <View key={value}>
                        <View>
                          <View style={[styles.topMargin20]}>
                            <View style={[styles.row10]}>
                              <WebView
                                style={[styles.calcColumn60,styles.screenHeight20]}
                                javaScriptEnabled={true}
                                source={{uri: value}}
                              />
                            </View>

                          </View>
                        </View>
                      </View>
                    )}
                  </View>
                )}
                {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Details') && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View style={[styles.topPadding20]}>
                      <Text style={[styles.headingText3]}>Details</Text>
                    </View>

                    <View style={[styles.spacer]} />

                    {(this.state.careerDetails.overview && this.state.careerDetails.overview.alsoCalledArray && this.state.careerDetails.overview.alsoCalledArray[0]) && (
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.width120]}>
                            <Text style={[styles.standardText]}>Also called</Text>
                        </View>
                        <View style={[styles.calcColumn180,styles.leftPadding]}>
                          <Text style={[styles.standardText]}>{this.state.careerDetails.overview.alsoCalledArray[0]}</Text>
                          {(this.state.careerDetails.overview.alsoCalledArray[1]) && (
                            <Text style={[styles.standardText]}>, {this.state.careerDetails.overview.alsoCalledArray[1]}</Text>
                          )}
                          {(this.state.careerDetails.overview.alsoCalledArray[2]) && (
                            <Text style={[styles.standardText]}>, {this.state.careerDetails.overview.alsoCalledArray[2]}</Text>
                          )}
                        </View>
                      </View>
                    )}
                    {(this.state.careerDetails.overview && this.state.careerDetails.overview.tasks && this.state.careerDetails.overview.tasks[0]) && (
                      <View style={[styles.bottomPadding40,styles.rowDirection]}>
                        <View style={[styles.width120]}>
                            <Text style={[styles.standardText]}>Common Tasks</Text>
                        </View>
                        <View style={[styles.calcColumn180,styles.leftPadding]}>
                            <Text style={[styles.standardText]}>Task 1: {this.state.careerDetails.overview.tasks[0]}</Text>
                            {(this.state.careerDetails.overview.tasks[1]) && (
                              <View style={[styles.topPadding]}>
                                <Text style={[styles.standardText]}>Task 2: {this.state.careerDetails.overview.tasks[1]}</Text>
                              </View>
                            )}
                            {(this.state.careerDetails.overview.tasks[2]) && (
                              <View style={[styles.topPadding]}>
                                <Text style={[styles.standardText]}>Task 3: {this.state.careerDetails.overview.tasks[2]}</Text>
                              </View>
                            )}
                        </View>
                      </View>
                    )}

                    { (this.state.careerDetails.activities && this.state.careerDetails.activities.length > 0) && (
                      <View>
                        <View style={[styles.topPadding20]}>
                          <Text style={[styles.headingText6,styles.underlineText]}>Activities</Text>
                        </View>

                        {this.state.careerDetails.activities.map((value, index) =>
                          <View key={value}>
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.width120]}>
                                <Text style={[styles.standardText]}>{value.name}</Text>
                              </View>
                              <View style={[styles.calcColumn180,styles.leftPadding]}>
                                <Text style={[styles.standardText]}>{value.description}</Text>
                              </View>
                            </View>
                          </View>
                        )}

                      </View>
                    )}

                    { (this.state.careerDetails.outlookData && this.state.careerDetails.outlookData.outlook) && (
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.width120]}>
                          <Text style={[styles.standardText]}>Future Outlook</Text>
                        </View>
                        <View style={[styles.calcColumn180,styles.leftPadding]}>
                          <Text style={[styles.standardText]}>{this.state.careerDetails.outlookData.outlook}</Text>
                        </View>

                      </View>
                    )}

                    { (this.state.careerDetails.marketData) && (
                      <View>
                        <View style={[styles.topPadding20]}>
                          <Text style={[styles.headingText6,styles.underlineText]}>Market Data</Text>
                        </View>
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.width120]}>
                            <Text style={[styles.standardText]}>Pay</Text>
                          </View>
                          <View style={[styles.calcColumn180,styles.leftPadding]}>
                            <Text style={[styles.standardText]}>${Number(this.state.careerDetails.marketData.pay).toLocaleString()}</Text>
                          </View>

                        </View>
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.width120]}>
                            <Text style={[styles.standardText]}>Total Employment</Text>
                          </View>
                          <View style={[styles.calcColumn180,styles.leftPadding]}>
                            <Text style={[styles.standardText]}>{this.state.careerDetails.marketData.totalEmployment}</Text>
                          </View>

                        </View>
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.width120]}>
                            <Text style={[styles.standardText]}>Growth</Text>
                          </View>
                          <View style={[styles.calcColumn180,styles.leftPadding]}>
                            <Text style={[styles.standardText]}>{this.state.careerDetails.marketData.growth}</Text>
                          </View>

                        </View>
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.width120]}>
                            <Text style={[styles.standardText]}>New Jobs</Text>
                          </View>
                          <View style={[styles.calcColumn180,styles.leftPadding]}>
                            <Text style={[styles.standardText]}>{Number(this.state.careerDetails.marketData.newJobs).toLocaleString()}</Text>
                          </View>

                        </View>
                      </View>
                    )}

                    { (this.state.careerDetails.whereTheyWork && this.state.careerDetails.whereTheyWork.length > 0) && (
                      <View>
                        <View style={[styles.topPadding20]}>
                          <Text style={[styles.headingText6,styles.underlineText]}>Where They Work</Text>
                        </View>

                        {this.state.careerDetails.whereTheyWork.map((value, index) =>
                          <View key={value}>
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.width120]}>
                                <Text style={[styles.standardText]}>{value.title}</Text>
                              </View>
                              <View style={[styles.calcColumn180,styles.leftPadding]}>
                                <Text style={[styles.standardText]}>{value.percentEmployed}% Employed</Text>
                              </View>

                            </View>
                          </View>
                        )}

                      </View>
                    )}



                  </View>
                )}

                {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile') && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View style={[styles.topPadding20]}>
                      <Text style={[styles.headingText3]}>Ideal Candidate Profile</Text>
                    </View>

                    <View style={[styles.spacer]} />

                    { this.state.careerDetails.knowledgeArray && this.state.careerDetails.knowledgeArray.length > 0 && (
                      <View>
                        {this.renderKnowledge()}
                      </View>
                    )}
                    { this.state.careerDetails.skillsArray && this.state.careerDetails.skillsArray.length > 0 && (
                      <View>
                        {this.renderSkills()}
                      </View>
                    )}
                    { this.state.careerDetails.abilitiesArray && this.state.careerDetails.abilitiesArray.length > 0 && (
                      <View>
                        {this.renderAbilities()}
                      </View>
                    )}
                    { this.state.careerDetails.personalityData && (
                      <View>
                        {this.renderPersonality()}
                      </View>
                    )}
                    { this.state.careerDetails.technologyArray && this.state.careerDetails.technologyArray.length > 0 && (
                      <View>
                        {this.renderTechnology()}
                      </View>
                    )}
                    { this.state.careerDetails.educationData && this.state.careerDetails.educationData.education_usually_needed && (
                      <View>
                          {this.renderEducation()}
                      </View>
                    )}


                  </View>
                )}

                {((this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Courses') && (this.state.courses && this.state.courses.length > 0)) && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View style={[styles.topPadding20]}>
                      <Text style={[styles.headingText3]}>Courses</Text>
                    </View>

                    <View style={[styles.spacer]} />

                    {this.renderCourses()}


                  </View>
                )}

                {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Questions') && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View style={[styles.topPadding20,styles.rowDirection]}>
                      <View style={[styles.calcColumn100]}>
                        <Text style={[styles.headingText3]}>Questions, Answers, and Discussion</Text>
                      </View>
                      <View style={[styles.width40]}>
                        <View style={[styles.topPadding5]} onPress={() => this.addItem('question')}>
                          <Image style={[styles.square18,styles.contain]} source={{ uri: addIcon}}/>
                        </View>
                      </View>


                    </View>

                    <View style={[styles.spacer]} />

                    <View style={[styles.topPadding4,styles.calcColumn60]}>
                      <View>
                        <ScrollView style={[styles.carousel]} horizontal={true}>
                          {this.state.questionFilters.map((value, index) =>
                            <View style={[styles.row10,styles.rightPadding30]}>
                              {(this.state.questionFilters[index] === this.state.questionFilterSelected) ? (
                                <View style={[styles.selectedCarouselItem2]}>
                                  <Text key={value} style={[styles.standardText]}>{value}</Text>
                                </View>
                              ) : (
                                <TouchableOpacity style={[styles.menuButton2]} onPress={() => this.questionFilterClicked(value,'question')}>
                                  <Text key={value} style={[styles.standardText]}>{value}</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </ScrollView>

                      </View>
                    </View>
                    <View style={[styles.horizontalLine]} />

                    {(this.state.groupPostsAreLoading) ? (
                      <View style={[styles.flex1,styles.flexCenter]}>
                        <View>
                          <ActivityIndicator
                             animating = {this.state.groupPostsAreLoading}
                             color = '#87CEFA'
                             size = "large"
                             style={[styles.square80, styles.centerHorizontally]}/>

                          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                          <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Pulling results...</Text>

                        </View>
                      </View>
                    ) : (
                      <View>
                        {(this.state.groupPosts) && (
                          <View style={[styles.topPadding20]}>
                            {this.state.groupPosts.map((item, index) =>
                              <View key={index} style={[styles.bottomPadding]}>
                                {this.renderGroupPost(item, index)}
                              </View>
                            )}

                          </View>
                        )}
                      </View>
                    )}

                  </View>
                )}

                {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Projects') && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View style={[styles.topPadding20,styles.rowDirection]}>
                      <View style={[styles.calcColumn100]} >
                        <Text style={[styles.headingText3]}>Projects by Career-Seekers</Text>
                      </View>
                      <View style={[styles.width40]}>
                        <TouchableOpacity style={[styles.topPadding5]} onPress={() => this.props.navigation.navigate('EditProfile', { category: 'Details' })}>
                          <Image style={[styles.square18,styles.contain]} source={{ uri: addIcon}}/>
                        </TouchableOpacity>
                      </View>

                    </View>

                    <View style={[styles.spacer]} />

                    <View style={[styles.topPadding4,styles.calcColumn60]}>
                      <View>
                        <ScrollView style={[styles.carousel]} horizontal={true}>
                          {this.state.questionFilters.map((value, index) =>
                            <View style={[styles.row10,styles.rightPadding30]}>
                              {(this.state.questionFilters[index] === this.state.projectFilterSelected) ? (
                                <View style={[styles.selectedCarouselItem2]}>
                                  <Text key={value} style={[styles.standardText]}>{value}</Text>
                                </View>
                              ) : (
                                <TouchableOpacity style={[styles.menuButton2]} onPress={() => this.questionFilterClicked(value,'project')}>
                                  <Text key={value} style={[styles.standardText]}>{value}</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </ScrollView>

                      </View>
                    </View>
                    <View style={[styles.horizontalLine]} />

                    {(this.state.projects && this.state.projects.length > 0) && (
                      <View>
                        {(this.state.projectsAreLoading) ? (
                          <View style={[styles.flex1,styles.flexCenter]}>
                            <View>
                              <ActivityIndicator
                                 animating = {this.state.projectsAreLoading}
                                 color = '#87CEFA'
                                 size = "large"
                                 style={[styles.square80, styles.centerHorizontally]}/>

                              <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                              <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Pulling results...</Text>

                            </View>
                          </View>
                        ) : (
                          <View>
                            {this.state.projects.map((item, optionIndex) =>
                              <View key={item + optionIndex}>
                                <View>
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { selectedProject: item })}>

                                    <View style={[styles.elevatedBox,styles.whiteBackground]}>
                                      <View style={[styles.relativePosition]}>
                                        <Image source={(item.imageURL) ? { uri: item.imageURL} : { uri: defaultProfileBackgroundImage}}style={[styles.calcColumn60,styles.height150,styles.centerHorizontally]}  />
                                        <View style={[styles.absolutePosition,styles.absoluteTop5,styles.absoluteLeft5]}>
                                          <Text style={[styles.descriptionText5,styles.roundedCorners,styles.horizontalPadding4,styles.row5,styles.whiteBorder,styles.whiteColor,styles.boldText]}>{item.category}</Text>
                                        </View>
                                        <View style={[styles.absolutePosition,styles.absoluteTop5,styles.absoluteRight5]}>
                                          <TouchableOpacity onPress={(e) => this.voteOnItem(e, item, 'up', optionIndex,'project') }>
                                            <View style={[styles.standardBorder,styles.roundedCorners,styles.rowDirection]}>
                                              <View style={[styles.padding7]}>
                                                <Image source={(item.upvotes && item.upvotes.includes(this.state.emailId)) ? { uri: upvoteIconBlue} : { uri: upvoteIconWhite}} style={[styles.square15,styles.contain]}/>
                                              </View>
                                              <View style={[styles.verticalSeparator30]} />
                                              <View style={[styles.horizontalPadding10]}>
                                                <View style={[styles.halfSpacer]} />
                                                <Text style={[styles.descriptionText2,styles.boldText,styles.whiteColor]}>{(item.upvotes) ? item.upvotes.length : 0}</Text>
                                              </View>
                                            </View>
                                          </TouchableOpacity>
                                        </View>
                                      </View>

                                      <View style={[styles.spacer]} />

                                      <View style={[styles.horizontalPadding30]}>
                                        <Text style={[styles.headingText5]}>{item.name}</Text>

                                        <View style={[styles.topPadding]}>
                                          <View style={[styles.width35]}>
                                            <Image style={[styles.square25,styles.contain, { borderRadius: 12.5 }]} source={(item.userPic) ? { uri: item.userPic} : { uri: profileIconDark}} />
                                          </View>
                                          <View style={[styles.calcColumn155]}>
                                            <Text style={[styles.descriptionText2]}>{item.userFirstName} {item.userLastName}</Text>
                                            <Text style={[styles.descriptionText5]}>{item.hours} Hours</Text>
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
                                            <View style={[styles.topPadding, styles.rowDirection,styles.flexWrap]}>
                                              {item.skillTags.split(',').map((value, optionIndex) =>
                                                <View key={value}>
                                                  {(optionIndex < 3) && (
                                                    <View key={value} style={[styles.rightPadding]}>
                                                      <View style={[styles.row5,styles.horizontalPadding20,styles.transparentBorder,styles.lightBackground]}>
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
                                            <TouchableOpacity style={this.state.favorites.includes(item._id) ? [styles.btnSquarish,styles.mediumBackground] : [styles.btnSquarish,styles.ctaBackgroundColor]} disabled={(this.state.isSaving) ? true : false} onPress={(e) =>  this.favoriteItem(e, item)}><Text style={[styles.descriptionText1,styles.whiteColor]}>{this.state.favorites.includes(item._id) ? "Following" : "Follow"}</Text></TouchableOpacity>
                                          </View>
                                        </View>

                                        <View style={[styles.spacer]} />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                </View>

                                <View>

                                  <View style={[styles.spacer]} />
                                </View>
                              </View>
                            )}

                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}

                {((this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Jobs') && (this.state.jobs && this.state.jobs.length > 0)) && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View style={[styles.topPadding20]}>
                      <Text style={[styles.headingText3]}>Jobs</Text>
                      <Text style={[styles.descriptionText2,styles.bottomPadding5]}>(External to Guided Compass)</Text>
                    </View>

                    <View style={[styles.spacer]} />

                    {this.renderJobs()}


                  </View>
                )}

                {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Similar Careers') && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View style={[styles.topPadding20]}>
                      <Text style={[styles.headingText3]}>Similar Careers</Text>
                    </View>

                    <View style={[styles.spacer]} />

                    {(this.state.similarCareers) && (
                      <View>
                        {this.state.similarCareers.map((value, index) =>
                          <View>
                            <View key={index}>
                              <View style={[styles.spacer]} />

                              <View style={[styles.rowDirection]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerSelected: value })} style={[styles.rowDirection,styles.calcColumn120]}>
                                  <View style={[styles.width70]}>
                                    <Image source={{ uri: careerMatchesIconDark}} style={[styles.square50,styles.contain,styles.topMargin5,styles.flexCenter]}/>
                                  </View>
                                  <View style={[styles.calcColumn200]}>
                                    <Text style={[styles.headingText5]}>{value.name}</Text>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>{value.jobFunction}{(value.jobFunction && value.industry) && ' | ' + value.industry}{(!value.jobFunction && value.industry) && value.industry}{(value.jobFamily) && ' | ' + value.jobFamily}</Text>

                                    {(value.marketData) && (
                                      <View style={[styles.row5,styles.rowDirection,styles.flexWrap]}>
                                        <View style={[styles.rowDirection]}>
                                          <View style={[styles.rightPadding]}>
                                            <Image source={{ uri: trendingUpIcon}} style={[styles.square15,styles.contain]}/>
                                          </View>
                                          <View style={[styles.rightPadding]}>
                                            <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{value.marketData.growth}</Text>
                                          </View>
                                        </View>

                                        <View style={[styles.rowDirection]}>
                                          <View style={[styles.rightPadding]}>
                                            <Image source={{ uri: moneyIconBlue}} style={[styles.square20,styles.contain]}/>
                                          </View>
                                          <View style={[styles.rightPadding]}>
                                            <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>${Number(value.marketData.pay).toLocaleString()}</Text>
                                          </View>
                                        </View>

                                        <View style={[styles.rowDirection]}>
                                          <View style={[styles.rightPadding]}>
                                            <Image source={{ uri: membersIconBlue}} style={[styles.square22,styles.contain]}/>
                                          </View>
                                          <View style={[styles.rightPadding]}>
                                            <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{Number(value.marketData.totalEmployment).toLocaleString()}</Text>
                                          </View>
                                        </View>
                                      </View>
                                    )}

                                    {(value.onetInterests) && (
                                      <View style={[styles.row5]}>
                                        <View style={[styles.rowDirection,styles.rowDirection,styles.flexWrap]}>
                                          <View style={[styles.rightPadding]}>
                                            <Image source={{ uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                                          </View>
                                          <View style={[styles.rightPadding]}>
                                            <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{((value.onetInterests.realistic / 7) * 100).toFixed()}% R  -</Text>
                                          </View>
                                          <View style={[styles.rightPadding]}>
                                            <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{((value.onetInterests.investigative / 7) * 100).toFixed()}% I  -</Text>
                                          </View>
                                          <View style={[styles.rightPadding]}>
                                            <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{((value.onetInterests.artistic / 7) * 100).toFixed()}% A  -</Text>
                                          </View>
                                          <View style={[styles.rightPadding]}>
                                            <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{((value.onetInterests.social / 7) * 100).toFixed()}% S  -</Text>
                                          </View>
                                          <View style={[styles.rightPadding]}>
                                            <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{((value.onetInterests.enterprising / 7) * 100).toFixed()}% E  -</Text>
                                          </View>
                                          <View style={[styles.rightPadding]}>
                                            <Text style={[styles.descriptionText3,styles.descriptionTextColor]}>{((value.onetInterests.conventional / 7) * 100).toFixed()}% C</Text>
                                          </View>
                                        </View>
                                      </View>
                                    )}
                                  </View>
                                </TouchableOpacity>

                                <View style={[styles.width30,styles.topMargin15]}>
                                  <TouchableOpacity onPress={() => this.favoriteItem(value) }>
                                    <Image source={(this.state.favorites.includes(value._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                                  </TouchableOpacity>
                                </View>

                                <View style={[styles.width30,styles.leftPadding]}>
                                  <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerSelected: value })} style={[styles.pinRight]}>
                                    <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                                  </TouchableOpacity>
                                </View>
                              </View>

                              {(this.state.sortCriteriaArray && this.state.sortCriteriaArray[index] && this.state.sortCriteriaArray[index].name) && (
                                <View style={[styles.leftPadding70]}>
                                  <View style={[styles.halfSpacer]} />
                                  <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.sortCriteriaArray[index].name}: {this.standardizeValue('sort',index, this.state.sortCriteriaArray[index].criteria)}</Text>
                                </View>
                              )}
                              {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[index] && this.state.filterCriteriaArray[index].name) && (
                                <View style={[styles.leftPadding70]}>
                                  <View style={[styles.halfSpacer]} />
                                  <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.filterCriteriaArray[index].name}: {this.state.filterCriteriaArray[index].criteria}</Text>
                                </View>
                              )}
                              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                              <View style={[styles.horizontalLine]} />

                              <View style={[styles.spacer]} />
                            </View>

                          </View>
                        )}

                      </View>
                    )}

                  </View>
                )}

              </View>
            )}

            <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
             {(this.state.showShareButtons) && (
               <View key="showDescription" style={[styles.fullScreenWidth,styles.padding20,styles.centerText]}>
                  <View style={[styles.rowDirection,styles.flex1]}>
                    <View style={[styles.flex5]}>
                      <TouchableOpacity onPress={() => this.closeModal()}>
                        <Image source={{uri: closeIcon }} style={[styles.square15,styles.contain]} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.flex90]}>
                      <Text style={[styles.headingText2]}>Share the {this.state.careerDetails.name} Career Page with Friends!</Text>
                    </View>
                    <View style={[styles.flex5]}>
                    </View>
                  </View>

                  <View style={[styles.topPadding20]}>
                    <Text style={[styles.standardText]}>Share this link:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(this.state.shareURL)}><Text>{this.state.shareURL}</Text></TouchableOpacity>
                  </View>

                  <View style={[styles.spacer]} />

                  <View style={[styles.topPadding20]}>
                    {this.renderShareButtons()}
                  </View>

                </View>
             )}

             {(this.state.addQuestion) && (
               <View key="addQuestion" style={[styles.fullScreenWidth,styles.padding20]}>
                  <View style={[styles.row10,styles.rowDirection]}>
                    <View style={[styles.width70,styles.rightPadding]}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.username })}>
                        <Image source={{ uri: this.state.pictureURL}} style={[styles.square50,styles.contain,styles.standardBorder,{ borderRadius: 25 }]} />
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.calcColumn110]}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.username })}>
                        <Text style={[styles.headingText2]}>{this.state.cuFirstName} {this.state.cuLastName}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={[styles.row10]}>
                    <TextInput
                      style={styles.textArea}
                      onChangeText={(text) => this.formChangeHandler("postMessage", text)}
                      value={this.state.postMessage}
                      placeholder="Start a conversation in this group..."
                      placeholderTextColor="grey"
                      multiline={true}
                      numberOfLines={4}
                    />
                  </View>

                  <View style={[styles.row10]}>
                    <Text style={[styles.descriptionText5,styles.descriptionTextColor,styles.boldText]}>SHARE A LINK (Optional)</Text>
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
                        <Text style={[styles.errorColor,styles.boldText,styles.descriptionText2]}>Please enter a valid link</Text>
                      </View>
                    )}
                  </View>

                  {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor]}>{this.state.errorMessage}</Text>}
                  {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor]}>{this.state.successMessage}</Text>}

                  <View style={[styles.row10]}>
                    <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor]} disabled={this.state.isSaving} onPress={() => this.postGroupPost()}><Text style={[styles.standardText,styles.whiteColor]}>Post</Text></TouchableOpacity>
                  </View>

                </View>
             )}

             {(this.state.addProject) && (
               <View key="addProject" style={[styles.fullScreenWidth,styles.padding20,styles.centerText]}>
                  <Text style={[styles.headingText2]}>Add Project</Text>
                </View>
             )}

             {(this.state.showComments) && (
               <View key="showComments">
                {this.renderGroupPost(this.state.groupPosts[this.state.selectedIndex], this.state.selectedIndex, true)}

                <View style={[styles.spacer]} />

                {(this.state.selectedGroup) && (
                  <SubComments selectedGroup={this.state.selectedGroup} selectedGroupPost={this.state.groupPosts[this.state.selectedIndex]} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} comments={this.state.comments} postingOrgCode={'guidedcompass'} postingOrgName={'Guided Compass'} orgContactEmail={'creighton@guidedcompass.com'} pictureURL={this.state.pictureURL} navigation={this.props.navigation} pageSource={"groupDetails"} />
                )}

               </View>
             )}

             {(this.state.showUpvotes) && (
               <View key="showUpvotes">
                 <View style={[styles.bottomPadding]}>
                   <Text style={[styles.headingText2]}>{this.state.careerDetails.name} Upvotes</Text>
                 </View>

                 <View style={[styles.spacer]} />

                {(this.state.upvotes && this.state.upvotes.length > 0) ? (
                  <View style={[styles.topPadding]}>
                    {this.state.upvotes.map((value, optionIndex) =>
                      <View key={"upvote|" + optionIndex}>
                        <View style={[styles.fullScreenWidth,styles.rowDirection]}>
                          <View style={[styles.width60]}>
                            <Image source={{ uri: value.pictureURL}} style={[styles.square50,styles.contain, { borderRadius: 25 }]} />
                          </View>
                          <View style={[styles.calcColumn60,styles.leftPadding,styles.topPadding5]}>
                            <Text style={[styles.headingText4]}>{value.firstName} {value.lastName}</Text>
                          </View>

                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View>
                    <Text style={[styles.errorColor]}>There are no upvotes</Text>
                  </View>
                )}

               </View>
             )}

             <TouchableOpacity onPress={() => this.closeModal()} style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]}>
               <Text style={[styles.ctaColor]}>Close Modal</Text>
             </TouchableOpacity>

           </Modal>
        </ScrollView>

    )
  }

}

export default CareerDetails;
