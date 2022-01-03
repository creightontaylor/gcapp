import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';

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

                  let careerDetailsPath = '/app/careers/' + response.data.career.name
                  if (this.props.pageSource === 'landingPage') {
                    careerDetailsPath = '/careers/' + response.data.career.name
                  } else if (this.props.fromAdvisor) {
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

                  let careerDetailsPath = '/app/careers/' + response.data.career.name
                  if (this.props.pageSource === 'landingPage') {
                    careerDetailsPath = '/careers/' + response.data.career.name
                  } else if (this.props.fromAdvisor) {
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

  formChangeHandler(event) {
    console.log('formChangeHandler called')

    this.setState({ [event.target.name]: event.target.value })
  }
  renderKnowledge() {
    console.log('renderKnowledge called');

    let rows = [];
    for (let i = 1; i <= this.state.careerDetails.knowledgeArray.length; i++) {
      console.log(i)
      rows.push(
        <View key={i}>
          <View className="col span-2-of-12 description-text-color">
              { (i === 1) ? <Text style={[styles.standardText]}>Knowledge</Text> : <Text style={[styles.standardText]}> </Text>}
          </View>
          <View className="col span-3-of-12">
              <Text style={[styles.standardText]}>{this.state.careerDetails.knowledgeArray[i - 1].category}</Text>
          </View>
          <View className="col span-7-of-12">
              <View>
                { this.state.careerDetails.knowledgeArray[i - 1].subcategories[0] && (
                  <View><Text style={[styles.standardText]}>{this.state.careerDetails.knowledgeArray[i - 1].subcategories[0]}</Text></View>
                )}
                { this.state.careerDetails.knowledgeArray[i - 1].subcategories[1] && (
                  <View><Text style={[styles.standardText]}>{this.state.careerDetails.knowledgeArray[i - 1].subcategories[1]}</Text></View>
                )}
              </View>
          </View>
          <View className="clear" />
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
          <View className="col span-2-of-12 description-text-color">
              { (i === 1) ? <Text style={[styles.standardText]}>Skills</Text> : <Text style={[styles.standardText]}> </Text>}
          </View>
          <View className="col span-3-of-12">
              <Text style={[styles.standardText]}>{this.state.careerDetails.skillsArray[i - 1].category}</Text>
          </View>
          <View className="col span-7-of-12">
              <View>
                { this.state.careerDetails.skillsArray[i - 1].subcategories[0] && (
                  <View><Text style={[styles.standardText]}>{this.state.careerDetails.skillsArray[i - 1].subcategories[0]}</Text></View>
                )}
                { this.state.careerDetails.skillsArray[i - 1].subcategories[1] && (
                  <View><Text style={[styles.standardText]}>{this.state.careerDetails.skillsArray[i - 1].subcategories[1]}</Text></View>
                )}
              </View>
          </View>
          <View className="clear" />
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
          <View className="col span-2-of-12 description-text-color">
              { (i === 1) ? <Text style={[styles.standardText]}>Abilities</Text> : <Text style={[styles.standardText]}> </Text>}
          </View>
          <View className="col span-3-of-12">
              <Text style={[styles.standardText]}>{this.state.careerDetails.abilitiesArray[i - 1].category}</Text>
          </View>
          <View className="col span-7-of-12">
              <View>
                { this.state.careerDetails.abilitiesArray[i - 1].subcategories[0] && (
                  <View><Text style={[styles.standardText]}>{this.state.careerDetails.abilitiesArray[i - 1].subcategories[0]}</Text></View>
                )}
                { this.state.careerDetails.abilitiesArray[i - 1].subcategories[1] && (
                  <View><Text style={[styles.standardText]}>{this.state.careerDetails.abilitiesArray[i - 1].subcategories[1]}</Text></View>
                )}
              </View>
          </View>
          <View className="clear" />
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
          <View className="col span-2-of-12 description-text-color">
              <Text style={[styles.standardText]}>Interests</Text>
          </View>
          <View className="col span-3-of-12">
              <Text style={[styles.standardText]}>Realistic</Text>
              <Text style={[styles.standardText]}>Artistic</Text>
              <Text style={[styles.standardText]}>Investigative</Text>
              <Text style={[styles.standardText]}>Social</Text>
              <Text style={[styles.standardText]}>Enterprising</Text>
              <Text style={[styles.standardText]}>Conventional</Text>
          </View>
          <View className="col span-7-of-12">
              <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.realistic / 7) * 100).toFixed()}%</Text>
              <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.artistic / 7) * 100).toFixed()}%</Text>
              <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.investigative / 7) * 100).toFixed()}%</Text>
              <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.social / 7) * 100).toFixed()}%</Text>
              <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.enterprising / 7) * 100).toFixed()}%</Text>
              <Text style={[styles.standardText]}>{((this.state.careerDetails.onetInterests.conventional / 7) * 100).toFixed()}%</Text>
          </View>
          <View className="clear" />
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
          <View className="col span-2-of-12 description-text-color">
              { (i === 1) ? <Text style={[styles.standardText]}>Technology</Text> : <Text style={[styles.standardText]}> </Text>}
          </View>
          <View className="col span-3-of-12">
              <Text style={[styles.standardText]}>{this.state.careerDetails.technologyArray[i - 1].name}</Text>
          </View>
          <View className="col span-7-of-12">
              <View>
                { this.state.careerDetails.technologyArray[i - 1].examples[0] && (
                  <View><Text style={[styles.standardText]}>{this.state.careerDetails.technologyArray[i - 1].examples[0]}</Text></View>
                )}
                { this.state.careerDetails.technologyArray[i - 1].examples[1] && (
                  <View><Text style={[styles.standardText]}>{this.state.careerDetails.technologyArray[i - 1].examples[1]}</Text></View>
                )}
              </View>
          </View>
          <View className="clear" />
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
          <View className="col span-2-of-12 description-text-color">
              { (i === 1) ? <Text style={[styles.standardText]}>Education</Text> : <Text style={[styles.standardText]}> </Text>}
          </View>
          <View className="col span-10-of-12">
              <Text style={[styles.standardText]}>{this.state.careerDetails.educationData.education_usually_needed[i - 1]}</Text>
          </View>
          <View className="clear" />
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
          <View className="top-padding-20">
            <View style={[styles.rowDirection,styles.flex1]}>
                <View style={[styles.flex40]}>
                  {(this.state.careerDetails.outlookData.salary10thPercentile) ? (
                    <Text className="cta-color heading-text-6">${Number(this.state.careerDetails.outlookData.salary10thPercentile).toLocaleString()}</Text>
                  ) : (
                    <Text className="cta-color heading-text-6">$0</Text>
                  )}
                  <Text className="field-descriptor">bottom 10%</Text>
                </View>
                <View style={[styles.flex5]}>
                  <View className="top-margin-negative-30">
                    <Text style={[styles.standardText]}>&#8212;</Text>
                  </View>
                </View>
                <View style={[styles.flex10]}>
                  <Text className="cta-color heading-text-6">${Number(this.state.careerDetails.outlookData.salaryMedian).toLocaleString()}</Text>
                  <Text className="field-descriptor">middle 50%</Text>
                </View>
                <View style={[styles.flex5]}><Text style={[styles.standardText]}>&#8212;</Text></View>
                <View style={[styles.flex40]}>
                  {(this.state.careerDetails.outlookData.salarty90thPercentile) ? (
                    <Text className="cta-color heading-text-6">${Number(this.state.careerDetails.outlookData.salary90thPercentile).toLocaleString()}</Text>
                  ) : (
                    <Text className="cta-color heading-text-6">$210K+</Text>
                  )}
                  <Text className="field-descriptor">top 90%</Text>
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

    this.setState({ modalIsOpen: false, howShareButtons: false, addQuestion: false, addProject: false, showUpvotes: false, showComments: false })
  }

  renderCourses() {
    console.log('renderBrowseCourses called')

    return (
      <View key="browseCourses">
        <View className="row-20">

          {(this.state.animating) ? (
            <View className="flex-container flex-center full-space">
              <View>
                <ActivityIndicator
                   animating = {this.state.animating}
                   color = '#87CEFA'
                   size = "large"
                   style={[styles.square80, styles.centerHorizontally]}/>

                <View className="spacer" /><View className="spacer" /><View className="spacer" />
                <Text className="center-text cta-color bold-text">Pulling results...</Text>

              </View>
            </View>
          ) : (
            <View>
                {this.state.courses && this.state.courses.map((value, index) =>
                  <View>
                    <View key={index}>
                      <View className="spacer" />
                      <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + value.url)} className={(this.props.pageSource === 'landingPage') ? "background-button calc-column-offset-25" : "background-button calc-column-offset-65"}>
                        <View className="fixed-column-70">
                          <Image source={{ uri: value.image_125_H}} className="image-60-auto"/>
                        </View>
                        <View className="calc-column-offset-70">
                          <Text className="heading-text-5">{value.title}</Text>
                          <Text className="description-text-1 description-text-color">{value.headline}</Text>

                          <View className="half-spacer" />

                          {(value.duration) && (
                            <View className="description-text-3">
                              <View className="float-left right-margin">
                                <Image source={{ uri: timeIconBlue}} className="image-auto-15 center-item"/>
                              </View>
                              <View className="float-left right-margin">
                                <Text style={[styles.standardText]}>{value.duration}</Text>
                              </View>
                            </View>
                          )}

                          {(value.price) && (
                            <View className="description-text-3">
                              <View className="float-left right-margin">
                                <Image source={{ uri: moneyIconBlue}} className="image-auto-15 center-item"/>
                              </View>
                              <View className="float-left right-margin">
                                <Text style={[styles.standardText]}>{value.price}</Text>
                              </View>
                            </View>
                          )}

                          {(value.difficultyLevel) && (
                            <View className="description-text-3">
                              <View className="float-left right-margin">
                                <Image source={{ uri: difficultyIconBlue}} className="image-auto-15 center-item"/>
                              </View>
                              <View className="float-left right-margin">
                                <Text style={[styles.standardText]}>{value.difficultyLevel ? value.difficultyLevel : "Beginner"}</Text>
                              </View>
                            </View>
                          )}

                          {(value.rating && value.ratingCount) && (
                            <View className="description-text-3">
                              <View className="float-left right-margin">
                                <Image source={{ uri: ratingsIconBlue}} className="image-auto-15 center-item"/>
                              </View>
                              <View className="float-left right-margin">
                                <Text style={[styles.standardText]}>{value.rating} / 5.0 - {value.ratingCount} Ratings</Text>
                              </View>
                            </View>
                          )}

                          {(value.studentCount) && (
                            <View className="description-text-3">
                              <View className="float-left right-margin">
                                <Image source={{ uri: profileIconBlue}} className="image-auto-15 center-item"/>
                              </View>
                              <View className="float-left right-margin">
                                <Text style={[styles.standardText]}>{value.studentCount} Students</Text>
                              </View>
                            </View>
                          )}

                          <View className="clear" />
                          <View className="half-spacer" />
                        </View>
                      </TouchableOpacity>

                      {(this.props.pageSource !== 'landingPage') && (
                        <View>
                          <View>

                            <View className="fixed-column-25 left-padding" >
                              <View>
                                <View className="spacer"/><View className="half-spacer"/>
                                <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + value.url)}>
                                  <Image source={{ uri: linkIcon}} className="image-auto-22"/>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>
                        </View>
                      )}

                      <View className="clear"/>

                      {(this.state.sortCriteriaArray && this.state.sortCriteriaArray[index] && this.state.sortCriteriaArray[index].name) && (
                        <View className="left-padding-70">
                          <View className="half-spacer" />
                          <Text className="description-text-2 error-color row-5">{this.state.sortCriteriaArray[index].name}: {this.standardizeValue('sort',index, this.state.sortCriteriaArray[index].criteria)}</Text>
                        </View>
                      )}
                      {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[index] && this.state.filterCriteriaArray[index].name) && (
                        <View className="left-padding-70">
                          <View className="half-spacer" />
                          <Text className="description-text-2 error-color row-5">{this.state.filterCriteriaArray[index].name}: {this.state.filterCriteriaArray[index].criteria}</Text>
                        </View>
                      )}
                      <View className="spacer" /><View className="spacer" />
                      <View style={[styles.horizontalLine]} />
                      <View className="clear"/>
                      <View className="spacer" />
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
              <View className="spacer"/><View className="spacer"/>

              <TouchableOpacity onPress={() => Linking.openURL(url)}>
                <View className="fixed-column-50">
                  <View className="half-spacer"/>
                  <Image source={{ uri: opportunitiesIconDark}} className="image-40-auto"/>
                </View>
                <View className="calc-column-offset-80 left-padding-20">
                  <Text className="heading-text-6">{this.state.jobs[index].JobTitle} @ {this.state.jobs[index].Company}</Text>
                  <Text className="description-text-2 top-padding-5">{this.state.jobs[index].Location} | Posted on {this.state.jobs[index].AccquisitionDate}</Text>
                </View>
                <View className="fixed-column-30 left-padding">
                  <View className="float-left">
                    <View className="spacer"/><View className="half-spacer"/>
                    <Image source={{ uri: linkIcon}} className="image-auto-22"/>
                  </View>
                </View>
                <View className="clear" />
                <View className="half-spacer" />

              </TouchableOpacity>
            </View>
            <View className="clear" />

            <View className="left-padding-70">
              {(this.state.searchString && this.state.searchString !== '') && (
                <Text className="description-text-2 error-color right-padding-5">Search Term: {this.state.searchString};</Text>
              )}
              {(this.state.location && this.state.location !== '') && (
                <Text className="description-text-2 error-color right-padding-5">Location: {this.state.location};</Text>
              )}
              {(this.state.radius && this.state.radius !== '') && (
                <Text className="description-text-2 error-color">Radius: {this.state.radius} Miles;</Text>
              )}
              <View className="clear" />
            </View>

            <View style={[styles.horizontalLine]} />
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
      <View key={index} className={(inModal) ? "" : "card"}>
        <View className="padding-10">
          <View>
            <View className="fixed-column-70 right-padding">
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: item.username })}>
                <Image source={{ uri: item.pictureURL}} className="profile-thumbnail-2 standard-border" />
              </TouchableOpacity>
            </View>
            <View className="calc-column-offset-150">
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: item.username })}>
                <Text className="heading-text-5 bold-text">{item.firstName} {item.lastName}</Text>
              </TouchableOpacity>
              <Text className="description-text-3">{item.headline}</Text>
              <Text className="description-text-4 description-text-color bold-text">{convertDateToString(item.createdAt,"daysAgo")}</Text>
            </View>
            <View className="fixed-column-80 right-padding">
              <TouchableOpacity onPress={(e) => this.voteOnItem(e, item, 'up', index) }>
                <View className="standard-border rounded-corners">
                  <View className="float-left padding-7">
                    <Image source={(item.upvotes.includes(this.state.emailId)) ? { uri: upvoteIconBlue} : { uri: upvoteIconGrey}} className="image-auto-15"/>
                  </View>
                  <View className="vertical-separator-4" />
                  <View className="float-left horizontal-padding-10">
                    <View className="half-spacer" />
                    <Text className="description-text-2 half-bold-text">{item.upvotes.length}</Text>
                  </View>
                  <View className="clear" />
                </View>
              </TouchableOpacity>
            </View>
            <View className="clear" />
          </View>
          <View className="row-10">
            <Text className="description-text-3">{item.message}</Text>
            <TouchableOpacity className="top-padding" onPress={() => Linking.openURL(item.url)}><Text style={[styles.descriptionText3,styles.boldText]}>{item.url}</Text></TouchableOpacity>
          </View>
          {(item.tags && item.tags.length > 0) && (
            <View className="bottom-padding">
              {item.tags.map((item2, index2) =>
                <View key={index2} className="float-left right-padding top-padding">
                  <View className="tag-container-thin">
                    <Text className="description-text-4">{item2}</Text>
                  </View>
                </View>
              )}
              <View className="clear" />
            </View>
          )}

          {(item.upvotes || (item.comments && item.comments.length > 0)) && (
            <View className="bottom-padding-5">
              <TouchableOpacity onPress={() => this.retrieveLikes(index)}>
                <Text className="description-text-3">{(item.upvotes) ? item.upvotes.length : 0} Upvotes</Text>
              </TouchableOpacity>
              <Text className="description-text-3 horizontal-padding-7">&#8226;</Text>
              <TouchableOpacity onPress={() => this.retrieveComments(index)}>
                <Text className="description-text-3">{(item.commentCount) ? item.commentCount : 0} Comments</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View style={[styles.horizontalLine]} />

        {(!inModal) && (
          <View className="row-10 horizontal-padding-5">
            <View className="float-left">
              <TouchableOpacity onPress={(e) => this.voteOnItem(e, item, 'up', index) }>
                <View className="float-left right-padding-8">
                  <Image source={(item.upvotes.includes(this.state.emailId))? { uri: likeIconBlue} : { uri: likeIconDark}} className="image-auto-18 center-horizontally" />
                </View>
                <View className="float-left right-padding-15">
                  <Text className={(item.upvotes.includes(this.state.emailId)) ? "description-text-2 cta-color bold-text" : "description-text-2"}>{(item.upvotes.includes(this.state.emailId)) ? "Liked" : "Like"}</Text>
                </View>
                <View className="clear" />
              </TouchableOpacity>
            </View>

            <View className="float-left">
              <TouchableOpacity onPress={() => this.retrieveComments(index)} disabled={this.state.isLoading}>
                <View className="float-left right-padding-8">
                  <View className="mini-spacer"/><View className="mini-spacer"/><View className="mini-spacer"/>
                  <Image source={{ uri: commentIconDark}} className="image-auto-18 center-horizontally" />
                </View>
                <View className="float-left right-padding-15">
                  <Text className="description-text-2">Comment</Text>
                </View>
                <View className="clear" />
              </TouchableOpacity>
            </View>

            <View className="float-left">
              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showShareButtons: true, sharePosting: true, selectedIndex: index })}>
                <View className="float-left right-padding-8">
                  <Image source={{ uri: shareIconDark}} className="image-auto-18 center-horizontally" />
                </View>
                <View className="float-left right-padding-15">
                  <Text className="description-text-2">Share</Text>
                </View>
                <View className="clear" />
              </TouchableOpacity>
            </View>

            <View className="float-left">
              <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages', { groupPost: item })}>
                <View className="float-left right-padding-8">
                  <Image source={{ uri: sendIconDark}} className="image-auto-18 center-horizontally" />
                </View>
                <View className="float-left right-padding-15">
                  <Text className="description-text-2">Send</Text>
                </View>
                <View className="clear" />
              </TouchableOpacity>
            </View>
            <View className="clear" />
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
    } else if (this.props.pageSource === 'landingPage') {
      pathPrefix = '/careers/'
    }

    return (
        <ScrollView>
            { this.state.careerDetails && (
              <View>
                <View style={[styles.card,styles.topMargin20]}>
                  <View className="top-padding-20">
                    <Text style={[styles.headingText2]}>{this.state.careerDetails.name}</Text>
                  </View>

                  {this.renderOutlook()}

                  <View className="top-padding-20 center-text">
                    <TouchableOpacity className="btn btn-squarish right-margin-5" onPress={() => this.favoriteItem(this.state.careerDetails)}>
                      <View className="float-left">
                        <View className='mini-spacer' /><View className='mini-spacer' /><View className='mini-spacer' />
                        {(this.state.favorites.includes(this.state.careerDetails._id)) ? <Image source={{ uri: checkmarkIconWhite}} className="image-auto-15" /> : <Image source={{ uri: favoritesIconWhite}} className="image-auto-15" />}
                      </View>
                      <View className="float-left left-padding">
                        <Text style={[styles.standardText]}>{(this.state.favorites.includes(this.state.careerDetails._id)) ? "Favorited" : "Favorite"}</Text>
                      </View>
                      <View className="clear" />
                    </TouchableOpacity>

                    <TouchableOpacity className="btn btn-squarish white-background cta-color left-margin-5" onPress={() => this.setState({ modalIsOpen: true, showShareButtons: true })}>
                      <View className="float-left">
                        <View className='mini-spacer' /><View className='mini-spacer' /><View className='mini-spacer' />
                        <Image source={{ uri: shareIconDark}} className="image-auto-15" />
                      </View>
                      <View className="float-left left-padding"><Text style={[styles.standardText]}>Share</Text></View>
                      <View className="clear" />
                    </TouchableOpacity>
                  </View>

                  {(this.state.careerDetails.overview) ? (
                    <View className="center-text row-20">
                      <View className="float-left">
                        <Text style={[styles.standardText]}>{this.state.careerDetails.overview.summary}</Text>
                      </View>
                      <View className="clear" />
                    </View>
                  ) : (
                    <View />
                  )}

                </View>

                <View style={[styles.cardClearPadding]}>
                  <View className="full-width white-background">
                    <View className="clear-float">
                      <View className="carousel-3" onScroll={this.handleScroll}>
                        {this.state.subNavCategories.map((value, index) =>
                          <View className="carousel-item-container heading-text-5">
                            {(this.state.subNavCategories[index] === this.state.subNavSelected) ? (
                              <View className="selected-carousel-item">
                                <Text key={value}>{value}</Text>
                              </View>
                            ) : (
                              <TouchableOpacity className="menu-button" onPress={() => this.subNavClicked(value)}>
                                <Text key={value}>{value}</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      </View>
                    </View>
                  </View>
                </View>

                {((this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Videos') && this.state.careerDetails.videos && this.state.careerDetails.videos.length > 0) && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View className="top-padding-20 full-width">
                      <Text className="heading-text-3">Videos</Text>
                      <Text className="description-text-1">Watch a day in the life of this profession, get interview tips, and learn relevant skills.</Text>
                    </View>

                    <View className="spacer" />

                    {this.state.careerDetails.videos.map((value, index) =>
                      <View key={value}>
                        <View>
                          <View className="top-margin-20">
                            <View className={(index % 2 === 0) ? "container-left" : "container-right"}>
                              {/*
                              <View className="video-container-4">
                                {(this.state.useYouTubeAPI) ? (
                                  <YouTube
                                    videoId={value.split("/embed/")[1]}
                                    id={value._id}
                                    className="video-iframe-4"
                                    containerClassName={""}
                                    opts={(e) => this.videoCallback(e,'opts')}
                                    onReady={(e) => this.videoCallback(e,'onReady')}
                                    onPlay={(e) => this.videoCallback(e,'onPlay')}
                                    onPause={(e) => this.videoCallback(e,'onPause')}
                                    onEnd={(e) => this.videoCallback(e,'onEnd')}
                                    onError={(e) => this.videoCallback(e,'onError')}
                                    onStateChange={(e) => this.videoCallback(e,'onStateChange')}
                                    onPlaybackRateChange={(e) => this.videoCallback(e,'onPlaybackRateChange')}
                                    onPlaybackQualityChange={(e) => this.videoCallback(e,'onPlaybackQualityChange')}
                                  />
                                ) : (
                                  <iframe
                                    title="videoLink"
                                    className="video-iframe"
                                    source={value}
                                    frameBorder="0"
                                  />
                                )}
                              </View>*/}
                              <View className="clear"/>
                            </View>

                            {(index % 2 === 1) && (
                              <View className="clear" />
                            )}
                          </View>
                        </View>
                      </View>
                    )}

                    <View className="clear" />

                  </View>
                )}
                {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Details') && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View className="top-padding-20 full-width">
                      <Text className="heading-text-3">Details</Text>
                    </View>

                    <View className="spacer" />

                    {(this.state.careerDetails.overview && this.state.careerDetails.overview.alsoCalledArray && this.state.careerDetails.overview.alsoCalledArray[0]) && (
                      <View>
                        <View className="col span-1-of-6 description-text-color">
                            <Text style={[styles.standardText]}>Also called</Text>
                        </View>
                        <View className="col span-5-of-6">
                          <Text style={[styles.standardText]}>{this.state.careerDetails.overview.alsoCalledArray[0]}</Text>
                          {(this.state.careerDetails.overview.alsoCalledArray[1]) && (
                            <Text style={[styles.standardText]}>, {this.state.careerDetails.overview.alsoCalledArray[1]}</Text>
                          )}
                          {(this.state.careerDetails.overview.alsoCalledArray[2]) && (
                            <Text style={[styles.standardText]}>, {this.state.careerDetails.overview.alsoCalledArray[2]}</Text>
                          )}
                          <View className="clear" />

                        </View>
                      </View>
                    )}
                    {(this.state.careerDetails.overview && this.state.careerDetails.overview.tasks && this.state.careerDetails.overview.tasks[0]) && (
                      <View className="bottom-padding-40">
                        <View className="col span-1-of-6 description-text-color">
                            <Text style={[styles.standardText]}>Common Tasks</Text>
                        </View>
                        <View className="col span-5-of-6">
                            <Text style={[styles.standardText]}>Task 1: {this.state.careerDetails.overview.tasks[0]}</Text>
                            {(this.state.careerDetails.overview.tasks[1]) && (
                              <View className="top-padding">
                                <Text style={[styles.standardText]}>Task 2: {this.state.careerDetails.overview.tasks[1]}</Text>
                              </View>
                            )}
                            {(this.state.careerDetails.overview.tasks[2]) && (
                              <View className="top-padding">
                                <Text style={[styles.standardText]}>Task 3: {this.state.careerDetails.overview.tasks[2]}</Text>
                              </View>
                            )}
                        </View>
                      </View>
                    )}

                    { (this.state.careerDetails.activities && this.state.careerDetails.activities.length > 0) && (
                      <View>
                        <View className="top-padding-20">
                          <Text className="heading-text-6 underline-text">Activities</Text>
                        </View>

                        {this.state.careerDetails.activities.map((value, index) =>
                          <View key={value}>
                            <View>
                              <View className="col span-2-of-12 description-text-color">
                                <Text style={[styles.standardText]}>{value.name}</Text>
                              </View>
                              <View className="col span-10-of-12">
                                <Text style={[styles.standardText]}>{value.description}</Text>
                              </View>
                              <View className="clear" />
                            </View>
                          </View>
                        )}

                      </View>
                    )}

                    { (this.state.careerDetails.outlookData && this.state.careerDetails.outlookData.outlook) && (
                      <View>
                        <View className="col span-2-of-12 description-text-color">
                          <Text style={[styles.standardText]}>Future Outlook</Text>
                        </View>
                        <View className="col span-10-of-12">
                          <Text style={[styles.standardText]}>{this.state.careerDetails.outlookData.outlook}</Text>
                        </View>
                        <View className="clear" />
                      </View>
                    )}

                    { (this.state.careerDetails.marketData) && (
                      <View>
                        <View className="top-padding-20">
                          <Text className="heading-text-6 underline-text">Market Data</Text>
                        </View>
                        <View>
                          <View className="col span-2-of-12 description-text-color">
                            <Text style={[styles.standardText]}>Pay</Text>
                          </View>
                          <View className="col span-10-of-12">
                            <Text style={[styles.standardText]}>${Number(this.state.careerDetails.marketData.pay).toLocaleString()}</Text>
                          </View>
                          <View className="clear" />
                        </View>
                        <View>
                          <View className="col span-2-of-12 description-text-color">
                            <Text style={[styles.standardText]}>Total Employment</Text>
                          </View>
                          <View className="col span-10-of-12">
                            <Text style={[styles.standardText]}>{this.state.careerDetails.marketData.totalEmployment}</Text>
                          </View>
                          <View className="clear" />
                        </View>
                        <View>
                          <View className="col span-2-of-12 description-text-color">
                            <Text style={[styles.standardText]}>Growth</Text>
                          </View>
                          <View className="col span-10-of-12">
                            <Text style={[styles.standardText]}>{this.state.careerDetails.marketData.growth}</Text>
                          </View>
                          <View className="clear" />
                        </View>
                        <View>
                          <View className="col span-2-of-12 description-text-color">
                            <Text style={[styles.standardText]}>New Jobs</Text>
                          </View>
                          <View className="col span-10-of-12">
                            <Text style={[styles.standardText]}>{Number(this.state.careerDetails.marketData.newJobs).toLocaleString()}</Text>
                          </View>
                          <View className="clear" />
                        </View>
                      </View>
                    )}

                    { (this.state.careerDetails.whereTheyWork && this.state.careerDetails.whereTheyWork.length > 0) && (
                      <View>
                        <View className="top-padding-20">
                          <Text className="heading-text-6 underline-text">Where They Work</Text>
                        </View>

                        {this.state.careerDetails.whereTheyWork.map((value, index) =>
                          <View key={value}>
                            <View>
                              <View className="col span-2-of-12 description-text-color">
                                <Text style={[styles.standardText]}>{value.title}</Text>
                              </View>
                              <View className="col span-10-of-12">
                                <Text style={[styles.standardText]}>{value.percentEmployed}% Employed</Text>
                              </View>
                              <View className="clear" />
                            </View>
                          </View>
                        )}

                      </View>
                    )}


                    <View className="clear" />
                  </View>
                )}

                {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile') && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View className="top-padding-20 full-width">
                      <Text className="heading-text-3">Ideal Candidate Profile</Text>
                    </View>

                    <View className="spacer" />

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

                    <View className="clear" />
                  </View>
                )}

                {((this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Courses') && (this.state.courses && this.state.courses.length > 0)) && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View className="top-padding-20 full-width">
                      <Text className="heading-text-3">Courses</Text>
                    </View>

                    <View className="spacer" />

                    {this.renderCourses()}

                    <View className="clear" />
                  </View>
                )}

                {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Questions') && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View className="top-padding-20 full-width">
                      <View className="calc-column-offset-40">
                        <Text className="heading-text-3">Questions, Answers, and Discussion</Text>
                      </View>
                      <View className="fixed-column-40">
                        <View className="background-button top-padding-5" onPress={() => this.addItem('question')}>
                          <Image className="image-auto-18" source={{ uri: addIcon}}/>
                        </View>
                      </View>
                      <View className="clear" />

                    </View>

                    <View className="spacer" />

                    <View className="full-width white-background top-padding-20">
                      <View>
                        <View className="carousel-3" onScroll={this.handleScroll}>
                          {this.state.questionFilters.map((value, index) =>
                            <View className="display-inline">
                              {(this.state.questionFilters[index] === this.state.questionFilterSelected) ? (
                                <View className="selected-carousel-item-2">
                                  <Text key={value}>{value}</Text>
                                </View>
                              ) : (
                                <TouchableOpacity className="menu-button-2" onPress={() => this.questionFilterClicked(value,'question')}>
                                  <Text key={value}>{value}</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </View>
                        <View className="clear" />
                      </View>
                    </View>
                    <View style={[styles.horizontalLine]} />

                    {(this.state.groupPostsAreLoading) ? (
                      <View className="flex-container flex-center full-space">
                        <View>
                          <ActivityIndicator
                             animating = {this.state.animating}
                             color = '#87CEFA'
                             size = "large"
                             style={[styles.square80, styles.centerHorizontally]}/>

                          <View className="spacer" /><View className="spacer" /><View className="spacer" />
                          <Text className="center-text cta-color bold-text">Pulling results...</Text>

                        </View>
                      </View>
                    ) : (
                      <View>
                        {(this.state.groupPosts) && (
                          <View className="top-padding-20">
                            {this.state.groupPosts.map((item, index) =>
                              <View key={index} className="bottom-padding">
                                {this.renderGroupPost(item, index)}
                              </View>
                            )}
                            <View className="clear" />
                          </View>
                        )}
                      </View>
                    )}

                  </View>
                )}

                {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Projects') && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View className="top-padding-20 full-width">
                      <View className="calc-column-offset-40">
                        <Text className="heading-text-3">Projects by Career-Seekers</Text>
                      </View>
                      <View className="fixed-column-40">
                        <TouchableOpacity className="background-button top-padding-5" onPress={() => this.props.navigation.navigate('EditProfile', { category: 'Details' })}>
                          <Image className="image-auto-18" source={{ uri: addIcon}}/>
                        </TouchableOpacity>
                      </View>
                      <View className="clear" />
                    </View>

                    <View className="spacer" />

                    <View className="full-width white-background top-padding-20">
                      <View>
                        <View className="carousel-3" onScroll={this.handleScroll}>
                          {this.state.questionFilters.map((value, index) =>
                            <View className="display-inline">
                              {(this.state.questionFilters[index] === this.state.projectFilterSelected) ? (
                                <View className="selected-carousel-item-2">
                                  <Text key={value}>{value}</Text>
                                </View>
                              ) : (
                                <TouchableOpacity className="menu-button-2" onPress={() => this.questionFilterClicked(value,'project')}>
                                  <Text key={value}>{value}</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </View>
                        <View className="clear" />
                      </View>
                    </View>
                    <View style={[styles.horizontalLine]} />

                    {(this.state.projects && this.state.projects.length > 0) && (
                      <View>
                        {(this.state.projectsAreLoading) ? (
                          <View className="flex-container flex-center full-space">
                            <View>
                              <ActivityIndicator
                                 animating = {this.state.animating}
                                 color = '#87CEFA'
                                 size = "large"
                                 style={[styles.square80, styles.centerHorizontally]}/>

                              <View className="spacer" /><View className="spacer" /><View className="spacer" />
                              <Text className="center-text cta-color bold-text">Pulling results...</Text>

                            </View>
                          </View>
                        ) : (
                          <View>
                            {this.state.projects.map((item, optionIndex) =>
                              <View key={item + optionIndex}>
                                <View>
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { selectedProject: item })}>

                                    <View className="elevated-box white-background" >
                                      <View className="full-width relative-position tint">
                                        <Image source={(item.imageURL) ? { uri: item.imageURL} : { uri: defaultProfileBackgroundImage}} className="image-full-width-150 center-horizontally"  />
                                        <View className="absolute-position absolute-top-5 absolute-left-5">
                                          <Text className="description-text-5 rounded-corners horizontal-padding-4 row-5 white-border white-text bold-text">{item.category}</Text>
                                        </View>
                                        <View className="absolute-position absolute-top-5 absolute-right-5">
                                          <TouchableOpacity onPress={(e) => this.voteOnItem(e, item, 'up', optionIndex,'project') }>
                                            <View className="standard-border rounded-corners">
                                              <View className="float-left padding-7">
                                                <Image source={(item.upvotes && item.upvotes.includes(this.state.emailId)) ? { uri: upvoteIconBlue} : { uri: upvoteIconWhite}} className="image-auto-15"/>
                                              </View>
                                              <View className="vertical-separator-4" />
                                              <View className="float-left horizontal-padding-10">
                                                <View className="half-spacer" />
                                                <Text className="description-text-2 half-bold-text white-text">{(item.upvotes) ? item.upvotes.length : 0}</Text>
                                              </View>
                                              <View className="clear" />
                                            </View>
                                          </TouchableOpacity>
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
                                            <Text style={[styles.standardText]}>{item.userFirstName} {item.userLastName}</Text>
                                            <Text className="description-text-3">{item.hours} Hours</Text>
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
                                            <TouchableOpacity className={this.state.favorites.includes(item._id) ? "btn btn-profile medium-background clear-border full-width" : "btn btn-profile full-width"} disabled={(this.state.isSaving) ? true : false} onPress={(e) =>  this.favoriteItem(e, item)}><Text style={[styles.standardText,styles.whiteColor]}>{this.state.favorites.includes(item._id) ? "Following" : "Follow"}</Text></TouchableOpacity>
                                          </View>
                                        </View>

                                        <View className="spacer" />
                                      </View>
                                    </View>
                                  </TouchableOpacity>
                                </View>

                                <View>
                                  <View className="clear" />
                                  <View className="spacer" />
                                </View>
                              </View>
                            )}
                            <View className="clear" />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}

                {((this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Jobs') && (this.state.jobs && this.state.jobs.length > 0)) && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View className="top-padding-20 full-width">
                      <Text className="heading-text-3">Jobs</Text>
                      <Text className="profile-descriptor">(External to Guided Compass)</Text>
                    </View>

                    <View className="spacer" />

                    {this.renderJobs()}

                    <View className="clear" />
                  </View>
                )}

                {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Similar Careers') && (
                  <View style={[styles.card,styles.topMargin20]}>
                    <View className="top-padding-20 full-width">
                      <Text className="heading-text-3">Similar Careers</Text>
                    </View>

                    <View className="spacer" />

                    {(this.state.similarCareers) && (
                      <View>
                        {this.state.similarCareers.map((value, index) =>
                          <View>
                            <View key={index}>
                              <View className="spacer" />
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerSelected: value })}>
                                <View className="fixed-column-70">
                                  <Image source={{ uri: careerMatchesIconDark}} className="image-auto-50 top-margin-5 center-item"/>
                                </View>
                                <View className={(this.props.pageSource === 'landingPage') ? "calc-column-offset-100-static" : "calc-column-offset-140-static"}>
                                  <Text className="heading-text-5">{value.name}</Text>
                                  <Text className="description-text-1 description-text-color curtail-text">{value.jobFunction}{(value.jobFunction && value.industry) && ' | ' + value.industry}{(!value.jobFunction && value.industry) && value.industry}{(value.jobFamily) && ' | ' + value.jobFamily}</Text>

                                  {(value.marketData) && (
                                    <View className="row-5 description-text-2 bold-text">
                                      <View>
                                        <View className="float-left right-padding">
                                          <Image source={{ uri: trendingUpIcon}} className="image-auto-15"/>
                                        </View>
                                        <View className="float-left right-padding">
                                          <Text className="description-text-1 description-text-color curtail-text">{value.marketData.growth}</Text>
                                        </View>
                                      </View>

                                      <View>
                                        <View className="float-left right-padding">
                                          <Image source={{ uri: moneyIconBlue}} className="image-auto-20"/>
                                        </View>
                                        <View className="float-left right-padding">
                                          <Text className="description-text-1 description-text-color curtail-text">${Number(value.marketData.pay).toLocaleString()}</Text>
                                        </View>
                                      </View>

                                      <View>
                                        <View className="float-left right-padding">
                                          <Image source={{ uri: membersIconBlue}} className="image-auto-22"/>
                                        </View>
                                        <View className="float-left right-padding">
                                          <Text className="description-text-1 description-text-color curtail-text">{Number(value.marketData.totalEmployment).toLocaleString()}</Text>
                                        </View>
                                      </View>

                                      <View className="clear" />
                                    </View>
                                  )}

                                  {(value.onetInterests) && (
                                    <View className="row-5 description-text-2 bold-text">
                                      <View>
                                        <View className="float-left right-padding">
                                          <Image source={{ uri: favoritesIconBlue}} className="image-auto-20"/>
                                        </View>
                                        <View className="float-left right-padding">
                                          <Text className="description-text-1 description-text-color curtail-text">{((value.onetInterests.realistic / 7) * 100).toFixed()}% R  -</Text>
                                        </View>
                                        <View className="float-left right-padding">
                                          <Text className="description-text-1 description-text-color curtail-text">{((value.onetInterests.investigative / 7) * 100).toFixed()}% I  -</Text>
                                        </View>
                                        <View className="float-left right-padding">
                                          <Text className="description-text-1 description-text-color curtail-text">{((value.onetInterests.artistic / 7) * 100).toFixed()}% A  -</Text>
                                        </View>
                                        <View className="float-left right-padding">
                                          <Text className="description-text-1 description-text-color curtail-text">{((value.onetInterests.social / 7) * 100).toFixed()}% S  -</Text>
                                        </View>
                                        <View className="float-left right-padding">
                                          <Text className="description-text-1 description-text-color curtail-text">{((value.onetInterests.enterprising / 7) * 100).toFixed()}% E  -</Text>
                                        </View>
                                        <View className="float-left">
                                          <Text className="description-text-1 description-text-color curtail-text">{((value.onetInterests.conventional / 7) * 100).toFixed()}% C</Text>
                                        </View>
                                      </View>
                                    </View>
                                  )}
                                </View>
                              </TouchableOpacity>

                              {(this.props.pageSource !== 'landingPage') && (
                                <View className="fixed-column-40 top-margin-15">
                                  <TouchableOpacity className="btn background-button" onPress={() => this.favoriteItem(value) }>
                                    <Image source={(this.state.favorites.includes(value._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} className="image-auto-20"/>
                                  </TouchableOpacity>
                                </View>
                              )}

                              <View className="fixed-column-25 left-padding">
                                <View className="float-right">
                                  <View className="spacer"/><View className="half-spacer"/>
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerSelected: value })}>
                                    <Image source={{ uri: arrowIndicatorIcon}} className="image-auto-22"/>
                                  </TouchableOpacity>
                                </View>
                              </View>
                              <View className="clear"/>

                              {(this.state.sortCriteriaArray && this.state.sortCriteriaArray[index] && this.state.sortCriteriaArray[index].name) && (
                                <View className="left-padding-70">
                                  <View className="half-spacer" />
                                  <Text className="description-text-2 error-color row-5">{this.state.sortCriteriaArray[index].name}: {this.standardizeValue('sort',index, this.state.sortCriteriaArray[index].criteria)}</Text>
                                </View>
                              )}
                              {(this.state.filterCriteriaArray && this.state.filterCriteriaArray[index] && this.state.filterCriteriaArray[index].name) && (
                                <View className="left-padding-70">
                                  <View className="half-spacer" />
                                  <Text className="description-text-2 error-color row-5">{this.state.filterCriteriaArray[index].name}: {this.state.filterCriteriaArray[index].criteria}</Text>
                                </View>
                              )}
                              <View className="spacer" /><View className="spacer" />
                              <View style={[styles.horizontalLine]} />
                              <View className="clear"/>
                              <View className="spacer" />
                            </View>

                          </View>
                        )}

                        <View className="clear" />
                      </View>
                    )}

                  </View>
                )}

              </View>
            )}

            <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
             {(this.state.showShareButtons) && (
               <View key="showDescription" className="full-width padding-20 center-text">
                  <Text className="heading-text-2">Share the {this.state.careerDetails.name} Career Page with Friends!</Text>

                  <View className="top-padding-20">
                    <Text style={[styles.standardText]}>Share this link:</Text>
                    <TouchableOpacity onPress={() => Linking.openURL(this.state.shareURL)}>{this.state.shareURL}</TouchableOpacity>
                  </View>

                  <View className="spacer" />

                  <View className="top-padding-20">
                    {this.renderShareButtons()}
                  </View>

                </View>
             )}

             {(this.state.addQuestion) && (
               <View key="addQuestion" className="full-width padding-20">
                  <View className="row-10">
                    <View className="fixed-column-70 right-padding">
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.username })}>
                        <Image source={{ uri: this.state.pictureURL}} className="profile-thumbnail-2 standard-border" />
                      </TouchableOpacity>
                    </View>
                    <View className="calc-column-offset-70">
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.username })}>
                        <Text className="heading-text-2">{this.state.cuFirstName} {this.state.cuLastName}</Text>
                      </TouchableOpacity>
                    </View>
                    <View className="clear" />
                  </View>

                  <View className="row-10">
                    <textarea type="text" className="text-field clear-border standard-border" placeholder="Start a conversation in this group..." name="postMessage" value={this.state.postMessage} onChange={this.formChangeHandler} />
                  </View>

                  <View className="row-10">
                    <Text className="description-text-5 description-text-color bold-text">SHARE A LINK (Optional)</Text>
                    <View className="half-spacer" />
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.formChangeHandler("postLink", text)}
                      value={this.state.postLink}
                      placeholder="Add a link..."
                      placeholderTextColor="grey"
                    />
                    {(this.state.postLink && !this.state.postLink.startsWith('http')) && (
                      <View className="row-5">
                        <Text className="error-color bold-text description-text-2">Please enter a valid link</Text>
                      </View>
                    )}
                  </View>

                  {(this.state.errorMessage && this.state.errorMessage !== '') && <Text className="error-message">{this.state.errorMessage}</Text>}
                  {(this.state.successMessage && this.state.successMessage !== '') && <Text className="error-message">{this.state.successMessage}</Text>}

                  <View className="row-10">
                    <TouchableOpacity className="btn btn-primary" disabled={this.state.isSaving} onPress={() => this.postGroupPost()}><Text style={[styles.standardText,styles.whiteColor]}>Post</Text></TouchableOpacity>
                  </View>

                </View>
             )}

             {(this.state.addProject) && (
               <View key="addProject" className="full-width padding-20 center-text">
                  <Text className="heading-text-2">Add Project</Text>
                </View>
             )}

             {(this.state.showComments) && (
               <View key="showComments" className="full-width">
                {this.renderGroupPost(this.state.groupPosts[this.state.selectedIndex], this.state.selectedIndex, true)}

                <View className="spacer" />

                {(this.state.selectedGroup) && (
                  <SubComments selectedGroup={this.state.selectedGroup} selectedGroupPost={this.state.groupPosts[this.state.selectedIndex]} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} comments={this.state.comments} postingOrgCode={'guidedcompass'} postingOrgName={'Guided Compass'} orgContactEmail={'creighton@guidedcompass.com'} pictureURL={this.state.pictureURL} history={this.props.history} pageSource={"groupDetails"} />
                )}

               </View>
             )}

             {(this.state.showUpvotes) && (
               <View key="showUpvotes" className="full-width">
                 <View className="bottom-padding">
                   <Text className="heading-text-2">{this.state.careerDetails.name} Upvotes</Text>
                 </View>

                <View className="spacer" />

                {(this.state.upvotes && this.state.upvotes.length > 0) ? (
                  <View className="top-padding">
                    {this.state.upvotes.map((value, optionIndex) =>
                      <View key={"upvote|" + optionIndex}>
                        <View>
                          <View className="fixed-column-60">
                            <Image source={{ uri: value.pictureURL}} className="profile-thumbnail-2" />
                          </View>
                          <View className="calc-column-offset-60 left-padding top-padding-5">
                            <Text className="heading-text-4">{value.firstName} {value.lastName}</Text>
                          </View>
                          <View className="clear" />
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View>
                    <Text className="error-color">There are no upvotes</Text>
                  </View>
                )}

               </View>
             )}

           </Modal>
        </ScrollView>

    )
  }

}

export default CareerDetails;
