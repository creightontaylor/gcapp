import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator, Linking } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';

const linkIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon-white.png';
const udemyLogo = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/udemy-logo.png';
const courseIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/course-icon-blue.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const appliedIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/applied-icon-blue.png';
const rsvpIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/rsvp-icon-blue.png';
const eventIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/event-icon-blue.png';
const assignmentsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/assignments-icon-blue.png';
const problemIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/problem-icon-blue.png';
const challengeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/challenge-icon-blue.png';
const internIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/intern-icon-blue.png';
const moneyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/money-icon-blue.png';
const opportunitiesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-blue.png';
const upvoteIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-blue.png';
const upvoteIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-grey.png';
const checkmarkIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon-white.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const favoritesIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-white.png';
const addLessonIconWhite = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-lesson-icon-white.png";
const shareIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/share-icon-dark.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';

import {convertDateToString} from '../functions/convertDateToString';
import SubComments from '../common/Comments';
import SubRenderProfiles from '../common/RenderProfiles';

class CourseDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subNavSelected: 'All',
      totalPercent: 100,
      subNavCategories: ['All','Reviews','Comments','People','Similar'],

      favorites: [],
      favoritedCourseDetails: [],
      completions: [],
      completedCourseDetails: []
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.pullCourses = this.pullCourses.bind(this)
    this.favoriteItem = this.favoriteItem.bind(this)

    this.markCompleted = this.markCompleted.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in SubCourseDetails')

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData()
    } else if (this.props.courseId !== prevProps.courseId) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      console.log('retrieveData called in EditLog')

      const emailId = await AsyncStorage.getItem('email')
      const email = emailId
      const username = await AsyncStorage.getItem('username');
      const cuFirstName = await AsyncStorage.getItem('firstName');
      const cuLastName = await AsyncStorage.getItem('lastName');
      const orgFocus = await AsyncStorage.getItem('orgFocus');
      const orgName = await AsyncStorage.getItem('orgName');
      const roleName = await AsyncStorage.getItem('roleName');
      const remoteAuth = await AsyncStorage.getItem('remoteAuth');
      const pictureURL = await AsyncStorage.getItem('pictureURL');

      let activeOrg = await AsyncStorage.getItem('activeOrg')
      if (!activeOrg) {
        activeOrg = 'guidedcompass'
      }
      const org = activeOrg
      if (emailId !== null) {
        // We have data!!

        this.setState({
            emailId: email, cuFirstName, cuLastName, username, roleName, remoteAuth, activeOrg, org, pictureURL
        });

        Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId: email } })
         .then((response) => {
           console.log('Favorites query attempted');

           if (response.data.success) {
             console.log('successfully retrieved favorites')

             const favorites = response.data.favorites

             if (favorites && favorites.length > 0) {
               Axios.get('https://www.guidedcompass.com/api/favorites/detail', { params: { favorites, orgCode: org } })
               .then((response2) => {
                 console.log('Favorites detail query attempted');

                 if (response2.data.success) {
                   console.log('successfully retrieved favorites detail')

                   let favoritedCourseDetails = []

                   for (let i = 1; i <= response.data.favorites.length; i++) {
                     if (response2.data.types[i - 1] && response2.data.types[i - 1] === 'course') {
                       const favoritedCourse = response2.data.favorites[i - 1]
                       favoritedCourse['favoriteId'] = response.data.favorites[i - 1]
                       favoritedCourseDetails.push(favoritedCourse)
                     }
                   }

                   //query info on those favorites
                   this.setState({ favorites, favoritedCourseDetails })

                 } else {
                   console.log('no favorites detail data found', response2.data.message)
                 }

               }).catch((error) => {
                   console.log('Favorites detail query did not work', error);
               });
             }

           } else {
             console.log('no favorites data found', response.data.message)
           }

         }).catch((error) => {
             console.log('Favorites query did not work', error);
         });

         Axios.get('https://www.guidedcompass.com/api/completions', { params: { emailId: email } })
        .then((response) => {
          console.log('Completions query attempted');

          if (response.data.success) {
            console.log('successfully retrieved completions')

            const completions = response.data.completions

            if (completions && completions.length > 0) {
              Axios.get('https://www.guidedcompass.com/api/completions/detail', { params: { completions, orgCode: org } })
              .then((response2) => {
                console.log('Completions detail query attempted');

                if (response2.data.success) {
                  console.log('successfully retrieved completions detail', response2.data.completions)

                  let completedCourseDetails = []

                  for (let i = 1; i <= response.data.completions.length; i++) {
                    if (response2.data.types[i - 1] && response2.data.types[i - 1] === 'course') {
                      const completedCourse = response2.data.completions[i - 1]
                      completedCourse['completionId'] = response.data.completions[i - 1]
                      completedCourseDetails.push(completedCourse)
                    }
                  }

                  this.setState({ completions, completedCourseDetails })

                } else {
                  console.log('no completions detail data found', response2.data.message)
                }

              }).catch((error) => {
                  console.log('Completions detail query did not work', error);
              });
            }

          } else {
            console.log('no completions data found', response.data.message)
          }

        }).catch((error) => {
            console.log('Favorites query did not work', error);
        });
        console.log('got courseId???', this.props.courseId)
        if (this.props.courseId) {

          Axios.get('https://www.guidedcompass.com/api/courses/byid', { params: { _id: this.props.courseId, source: 'Udemy', saveCourse: true } })
          .then((response) => {
            console.log('Course query attempted');

            if (response.data.success) {
              console.log('course query worked')

              let selectedCourse = response.data.course
              if (selectedCourse.udemyId) {
                selectedCourse['id'] = selectedCourse.udemyId
              }
              // selectedCourse['_id'] = selectedCourse.id

              let shareURL = "https://www.guidedcompass.com/courses/" + selectedCourse.id

              const shareTitle = 'Check Out ' + selectedCourse.title + ' Course On Guided Compass!'
              let shareBody = 'Check out the ' + selectedCourse.title + ' course on Guided Compass'

              this.setState({ selectedCourse, isLoading: false, shareURL, shareTitle, shareBody })

              this.pullCourses(selectedCourse.title, null, null, null, selectedCourse)

              Axios.get('https://www.guidedcompass.com/api/comments', { params: { parentPostId: selectedCourse._id } })
              .then((response) => {
                console.log('Comments query attempted');

                 if (response.data.success) {
                   console.log('successfully retrieved comments')

                   if (response.data.comments && response.data.comments.length > 0) {

                     this.setState({ comments: response.data.comments })
                   }
                 } else {
                   console.log('no comments data found', response.data.message)
                 }

              }).catch((error) => {
                 console.log('Comments query did not work', error);
              });

              Axios.get('https://www.guidedcompass.com/api/courses/reviews', { params: { _id: selectedCourse.id, source: 'Udemy' } })
              .then((response) => {
                console.log('Course reviews query attempted');

                if (response.data.success) {
                  console.log('course reviews query worked in sub settings')

                  const reviews = response.data.reviews.results
                  this.setState({ reviews })
                }

              }).catch((error) => {
                console.log('Coures reviews query did not work for some reason', error);
              });

              // Axios.get('https://www.guidedcompass.com/api/courses/byid', { params: { udemyId: selectedCourse.id } })
              // .then((response) => {
              //   console.log('Get course saved in database query attempted');
              //
              //   if (response.data.success) {
              //     console.log('course saved in database query worked in sub settings')
              //
              //     // const followers = response.data.followers
              //     // this.setState({ followers })
              //     const resLimit = 50
              //     Axios.get('https://www.guidedcompass.com/api/get-followers', { params: { _id: response.data.course._id, resLimit } })
              //     .then((response) => {
              //       console.log('Followers query attempted');
              //
              //       if (response.data.success) {
              //         console.log('followers query worked in sub settings')
              //
              //         const followers = response.data.followers
              //         this.setState({ followers })
              //       }
              //
              //     }).catch((error) => {
              //       console.log('Followers query did not work for some reason', error);
              //     });
              //   }
              //
              // }).catch((error) => {
              //   console.log('Course saved in database query did not work for some reason', error);
              // });

              const resLimit = 50
              Axios.get('https://www.guidedcompass.com/api/get-followers', { params: { _id: response.data.course._id, resLimit } })
              .then((response) => {
                console.log('Followers query attempted');

                if (response.data.success) {
                  console.log('followers query worked in sub settings')

                  const followers = response.data.followers
                  this.setState({ followers })
                }

              }).catch((error) => {
                console.log('Followers query did not work for some reason', error);
              });

              if (selectedCourse.jobFunction) {

                const search = true
                const searchString = selectedCourse.jobFunction
                const excludeMissingOutlookData = true
                const excludeMissingJobZone = true
                // console.log('show search string: ', searchString)
                Axios.put('https://www.guidedcompass.com/api/careers/search', { search, searchString, excludeMissingOutlookData, excludeMissingJobZone  })
                .then((response) => {
                    console.log('Career details query attempted 2');

                    if (response.data.success) {
                      console.log('found careers: ', response.data.careers)
                      if (response.data.careers && response.data.careers.length > 0) {
                        const selectedCareer = response.data.careers[0]
                        this.setState({ selectedCareer })
                      }

                    } else {
                      console.log('there was an error from back-end, message:');
                    }
                });
              }

              Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: org } })
              .then((response) => {
                console.log('Org info query attempted 2');

                  if (response.data.success) {
                    console.log('org info query worked 2')

                    const orgContactEmail = response.data.orgInfo.orgContactEmail
                    this.setState({ orgContactEmail })

                    const orgCode = org
                    let placementPartners = []
                    if (response.data.orgInfo.placementPartners) {
                      placementPartners = response.data.orgInfo.placementPartners
                    }
                    const postType = null
                    const postTypes = ['Assignment','Problem','Challenge','Internship','Individual','Work']
                    const pathway = null
                    const accountCode = null
                    const recent = true
                    const active = true
                    const pullPartnerPosts = true
                    const csWorkflow = true

                    //only schools see this screen
                    Axios.get('https://www.guidedcompass.com/api/postings/user', { params: { orgCode, placementPartners, postType, postTypes, pathway, accountCode, recent, active, pullPartnerPosts, csWorkflow }})
                    .then((response) => {
                      console.log('Posted postings query attempted within subcomponent');

                      if (response.data.success) {
                        console.log('posted postings query worked')

                        if (response.data.postings.length !== 0) {

                          let projectOpportunities = []
                          let work = []
                          for (let i = 1; i <= response.data.postings.length; i++) {
                            if (response.data.postings[i - 1].postType === 'Assignment' || response.data.postings[i - 1].postType === 'Problem' || response.data.postings[i - 1].postType === 'Work') {
                              projectOpportunities.push(response.data.postings[i - 1])
                            } else {
                              work.push(response.data.postings[i - 1])
                            }
                          }

                          this.setState({ projectOpportunities, work })

                        }

                      } else {
                        console.log('posted postings query did not work', response.data.message)
                      }

                    }).catch((error) => {
                        console.log('Posted postings query did not work for some reason', error);
                    });

                  } else {
                    console.log('org info query did not work', response.data.message)
                  }

              }).catch((error) => {
                  console.log('Org info query did not work for some reason', error);
              });

            } else {
              console.log('course query did not work', response.data.message)
            }

          }).catch((error) => {
              console.log('Course query did not work for some reason', error);
          });
        }
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler(event) {
    console.log('formChangeHandler called')

    this.setState({ [event.target.name]: event.target.value })
  }

  pullCourses(searchValue, priceValue, durationValue, difficultyLevelValue, selectedCourse) {
    console.log('pullCourses called', searchValue, priceValue, durationValue, difficultyLevelValue, selectedCourse)

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
      console.log('Courses query attempted');

        if (response.data.success) {
          console.log('successfully retrieved courses')

          if (response.data.responseData) {

            let courses = []
            for (let i = 1; i <= response.data.responseData.results.length; i++) {
              if (response.data.responseData.results[i - 1].title !== selectedCourse.title) {
                courses.push(response.data.responseData.results[i - 1])

              }
            }
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

  closeModal() {
    console.log('closeModal called')
    this.setState({ modalIsOpen: false, showShareButtons: false  })
  }

  favoriteItem(item, type,e) {
    console.log('favoriteItem called', item, type, this.state.members)

    // e.preventDefault()
    // e.stopPropagation()

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    if (type === 'course') {
      let itemId = item._id

      let favoritesArray = this.state.favorites

      if (favoritesArray.includes(itemId) || this.state.favoritedCourseDetails.some(selectedCourse => selectedCourse.url === item.url)){

        let index = favoritesArray.indexOf(itemId)
        let courseIndex = 0
        let favoritedCourseDetails = this.state.favoritedCourseDetails
        if (this.state.favoritedCourseDetails && this.state.favoritedCourseDetails.some(selectedCourse => selectedCourse.url === item.url)) {
          courseIndex = favoritedCourseDetails.findIndex(x => x.url === item.url);

          if (courseIndex > -1) {
            index = favoritesArray.indexOf(favoritedCourseDetails[courseIndex].favoriteId)
            favoritedCourseDetails.splice(courseIndex, 1);
          }

        }
        console.log('item to remove 1: ', favoritesArray, favoritesArray.length, favoritedCourseDetails.length)
        if (index > -1) {
          favoritesArray.splice(index, 1);
        }
        console.log('item to remove 2: ', favoritesArray, favoritesArray.length, favoritedCourseDetails.length)

        Axios.post('https://www.guidedcompass.com/api/favorites/save', {
          favoritesArray, emailId: this.state.emailId
        })
        .then((response) => {
          console.log('attempting to save removal from favorites')
          if (response.data.success) {
            console.log('saved removal from favorites', response.data)

            this.setState({ successMessage: 'Removed from saved favorites', favorites: favoritesArray, favoritedCourseDetails, isSaving: false })

          } else {
            console.log('did not save successfully')
            this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
          }
        }).catch((error) => {
            console.log('save did not work', error);
            this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false })
        });

      } else {

        console.log('adding item: ', favoritesArray, itemId)

        if (type === 'course') {
          // first save the course
          const courseObject = {
            source: 'Udemy', title: item.title, headline: item.headline, udemyId: item.id, url: item.url,
            image_125_H: item.image_125_H, image_240x135: item.image_240x135, image_480x270: item.image_480x270,
            is_paid: item.is_paid, price: item.price, visible_instructors: item.visible_instructors
          }

          Axios.post('https://www.guidedcompass.com/api/courses', courseObject)
          .then((response) => {
            console.log('attempting to save course')
            if (response.data.success) {
              console.log('saved course as new', response.data)
              //clear values

              itemId = response.data._id

              favoritesArray.push(itemId)
              let favoritedCourseDetails = this.state.favoritedCourseDetails
              favoritedCourseDetails.push(item)

              Axios.post('https://www.guidedcompass.com/api/favorites/save', {
                favoritesArray, emailId: this.state.emailId
              })
              .then((response) => {
                console.log('attempting to save addition to favorites')
                if (response.data.success) {
                  console.log('saved addition to favorites', response.data)

                  this.setState({
                    successMessage: 'Saved as a favorite!', favorites: favoritesArray, favoritedCourseDetails, isSaving: false
                  })

                } else {
                  console.log('did not save successfully')
                  this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
                }
              }).catch((error) => {
                  console.log('save did not work', error);
                  this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false})
              });
            } else {
              console.log('did not save successfully')

            }
          }).catch((error) => {
              console.log('save did not work', error);
              this.setState({
                serverSuccessPlan: false,
                serverErrorMessagePlan: 'there was an error saving favorites', isSaving: false
              })
          });
        } else {
          favoritesArray.push(itemId)
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
      }
    } else {
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
  }

  markCompleted(item, type) {
    console.log('markCompleted called', item, type)

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    if (type) {
      let itemId = item._id

      let completions = this.state.completions

      if (completions.includes(itemId) || this.state.completedCourseDetails.some(selectedCourse => selectedCourse.url === item.url)){

        let index = completions.indexOf(itemId)
        let courseIndex = 0
        let completedCourseDetails = this.state.completedCourseDetails
        if (this.state.completedCourseDetails && this.state.completedCourseDetails.some(selectedCourse => selectedCourse.url === item.url)) {
          courseIndex = completedCourseDetails.findIndex(x => x.url === item.url);

          if (courseIndex > -1) {
            index = completions.indexOf(completedCourseDetails[courseIndex].completionId)
            completedCourseDetails.splice(courseIndex, 1);
          }

        }
        // console.log('item to remove 1: ', completions, favoritesArray.length, favoritedCourseDetails.length)
        if (index > -1) {
          completions.splice(index, 1);
        }
        // console.log('item to remove 2: ', favoritesArray, favoritesArray.length, favoritedCourseDetails.length)

        Axios.post('https://www.guidedcompass.com/api/completions/save', {
          completions, emailId: this.state.emailId
        })
        .then((response) => {
          console.log('attempting to save removal from completions')
          if (response.data.success) {
            console.log('saved removal from completions', response.data)

            this.setState({ successMessage: 'Removed from saved completions', completions, completedCourseDetails, isSaving: false })

          } else {
            console.log('did not save successfully')
            this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
          }
        }).catch((error) => {
            console.log('save did not work', error);
            this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false })
        });

      } else {

        // console.log('adding item: ', favoritesArray, itemId)

        if (type === 'course') {
          // first save the course
          const courseObject = {
            source: 'Udemy', title: item.title, headline: item.headline, udemyId: item.id, url: item.url,
            image_125_H: item.image_125_H, image_240x135: item.image_240x135, image_480x270: item.image_480x270,
            is_paid: item.is_paid, price: item.price, visible_instructors: item.visible_instructors
          }

          Axios.post('https://www.guidedcompass.com/api/courses', courseObject)
          .then((response) => {
            console.log('attempting to save course')
            if (response.data.success) {
              console.log('saved course as new', response.data)
              //clear values

              itemId = response.data._id

              completions.push(itemId)
              let completedCourseDetails = this.state.completedCourseDetails
              completedCourseDetails.push(item)

              Axios.post('https://www.guidedcompass.com/api/completions/save', {
                completions, emailId: this.state.emailId
              })
              .then((response) => {
                console.log('attempting to save addition to completions')
                if (response.data.success) {
                  console.log('saved addition to completions', response.data)

                  this.setState({
                    successMessage: 'Saved as a completion!', completions, completedCourseDetails, isSaving: false
                  })

                } else {
                  console.log('did not save successfully')
                  this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
                }
              }).catch((error) => {
                  console.log('save did not work', error);
                  this.setState({ errorMessage: 'there was an error saving completions', isSaving: false})
              });
            } else {
              console.log('did not save successfully')

            }
          }).catch((error) => {
              console.log('save did not work', error);
              this.setState({
                serverSuccessPlan: false,
                serverErrorMessagePlan: 'there was an error saving completions', isSaving: false
              })
          });
        } else {
          completions.push(itemId)
          Axios.post('https://www.guidedcompass.com/api/completions/save', {
            completions, emailId: this.state.emailId
          })
          .then((response) => {
            console.log('attempting to save addition to completions')
            if (response.data.success) {
              console.log('saved addition to completions', response.data)

              this.setState({ successMessage: 'Saved as a completion!', completions, isSaving: false })

            } else {
              console.log('did not save successfully')
              this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
            }
          }).catch((error) => {
              console.log('save did not work', error);
              this.setState({ errorMessage: 'there was an error saving completions', isSaving: false})
          });
        }
      }
    }
  }

  render() {

    return (
        <ScrollView>
          {(this.state.selectedCourse) && (
            <View>
              {(this.state.isLoading) ? (
                <View style={[styles.flex1,styles.flexCenter]}>
                  <View>
                    <View style={[styles.superSpacer]} />

                    <ActivityIndicator
                       animating = {this.state.animating}
                       color = '#87CEFA'
                       size = "large"
                       style={[styles.square80, styles.centerHorizontally]}/>

                    <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                    <Text style={[styles.centerText,styles.ctaColor,styles.boldText,styles.standardText]}>Loading...</Text>

                  </View>
                </View>
              ) : (
                <View>
                  <View>
                    <View>
                      <View style={[styles.cardClearPadding,styles.fullScreenWidth,styles.topMargin30]}>
                        <View style={[styles.height5,styles.primaryBackground]} />
                        <View style={[styles.padding30]}>
                          <View style={[styles.bottomPadding]}>
                            <View style={[styles.flex1,styles.rowDirection]}>
                              <View style={[styles.flex15,styles.topMargin20]}>
                                <Text style={[styles.ctaColor,styles.boldText,styles.descriptionText1]}>{this.state.selectedCourse.price}</Text>
                              </View>
                              <View style={[styles.flex70,styles.alignCenter]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('CourseDetails', { selectedCourse: this.state.selectedCourse })}>
                                  <Image source={(this.state.selectedCourse.image_480x270) ? { uri: this.state.selectedCourse.image_480x270} : { uri: courseIconBlue}} style={[styles.width150,styles.height80,styles.contain]} />
                                </TouchableOpacity>
                              </View>
                              <View style={[styles.flex15]}>
                                <View style={[styles.topMargin20]}>
                                  <TouchableOpacity onPress={() => Linking.openURL("https://www.udemy.com")}>
                                    <Image source={{ uri: udemyLogo}} style={[styles.square30,styles.contain]} />
                                  </TouchableOpacity>
                                </View>
                              </View>
                            </View>
                            <View style={[styles.topPadding]}>
                              <Text style={[styles.headingText3,styles.centerText]}>{this.state.selectedCourse.title}</Text>
                              <Text style={[styles.topPadding,styles.centerText]}>{this.state.selectedCourse.description}.</Text>
                              {(this.state.selectedCourse.visible_instructors && this.state.selectedCourse.visible_instructors.length > 0) && (
                                <View style={[styles.topPadding15,styles.bottomPadding5,styles.rowDirection,styles.flexWrap,styles.alignCenter]}>
                                  <Text style={[styles.descriptionText2,styles.rightPadding5]}>Created by</Text>
                                  {this.state.selectedCourse.visible_instructors.map((value2, index2) =>
                                    <TouchableOpacity onPress={() => Linking.openURL("https://www.udemy.com" + value2.url)} style={[styles.rowDirection]}>
                                      <Text style={[styles.descriptionText2,styles.ctaColor]}>{value2.display_name}</Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              )}

                              <View style={[styles.topPadding,styles.rowDirection,styles.flexWrap]}>
                                <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter,styles.rightMargin,styles.topMargin]} onPress={() => Linking.openURL("https://www.udemy.com" + this.state.selectedCourse.url)}>
                                  <View style={[styles.rowDirection]}>
                                    <View>
                                      <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                      <Image source={{ uri: linkIconWhite}} style={[styles.square15,styles.contain]} />
                                    </View>
                                    <View style={[styles.leftPadding]}><Text style={[styles.descriptionText1]}>Take the Course</Text></View>
                                  </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.btnSquarish,styles.quaternaryBackground,styles.rightMargin,styles.topMargin,styles.rowDirection,styles.flexCenter]} onPress={() => this.favoriteItem(this.state.selectedCourse,'course')}>
                                  <View>
                                    <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                    {(this.state.favorites.includes(this.state.selectedCourse._id) || this.state.favoritedCourseDetails.some(selectedCourse => selectedCourse.url === this.state.selectedCourse.url)) ? <Image source={{ uri: checkmarkIconWhite}} style={[styles.square15,styles.contain]} /> : <Image source={{ uri: favoritesIconWhite}} style={[styles.square15,styles.contain]} />}
                                  </View>
                                  <View style={[styles.leftPadding]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.favorites.includes(this.state.selectedCourse._id) || this.state.favoritedCourseDetails.some(selectedCourse => selectedCourse.url === this.state.selectedCourse.url)) ? "Favorited" : "Favorite"}</Text>
                                  </View>
                                </TouchableOpacity>
                                <TouchableOpacity style={[styles.btnSquarish,styles.quinaryBackground,styles.rightMargin,styles.topMargin,styles.rowDirection,styles.flexCenter]} onPress={() => this.markCompleted(this.state.selectedCourse,'course')}>
                                  <View>
                                    <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                    <Image source={{ uri: checkmarkIconWhite}} style={[styles.square15,styles.contain]} />
                                  </View>
                                  <View style={[styles.leftPadding]}>
                                    <Text style={[styles.descriptionText1]}>{(this.state.completions.includes(this.state.selectedCourse._id) || this.state.completedCourseDetails.some(selectedCourse => selectedCourse.url === this.state.selectedCourse.url)) ? "Completed!" : "Mark Completed"}</Text>
                                  </View>
                                </TouchableOpacity>

                                <TouchableOpacity style={[styles.btnSquarish,styles.ctaBorder,styles.rightMargin,styles.topMargin,styles.rowDirection,styles.flexCenter]} onPress={() => this.setState({ modalIsOpen: true, showShareButtons: true })}>
                                  <View>
                                    <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                    <Image source={{ uri: shareIconDark}} style={[styles.square15,styles.contain]} />
                                  </View>
                                  <View style={[styles.leftPadding]}><Text style={[styles.descriptionText1,styles.ctaColor]}>Share</Text></View>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>

                        </View>
                      </View>

                      <View>
                        <View style={[styles.cardClearPadding,styles.fullScreenWidth,styles.topMargin30]}>
                          <ScrollView style={[styles.carousel]} horizontal={true} style={[styles.horizontalPadding30]}>
                            {this.state.subNavCategories.map((value, index) =>
                              <View style={[styles.row15,styles.rightPadding30]}>
                                {(value === this.state.subNavSelected) ? (
                                  <View style={[styles.selectedCarouselItem]}>
                                    <Text key={value} style={[styles.headingText6]}>{value}</Text>
                                  </View>
                                ) : (
                                  <TouchableOpacity style={[styles.menuButton]} onPress={() => this.setState({ subNavSelected: value })}>
                                    <Text key={value} style={[styles.headingText6]}>{value}</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}
                          </ScrollView>
                        </View>

                        {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Reviews') && (
                          <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                            <View style={[styles.row10]}>
                              <Text style={[styles.headingText3]}>Reviews</Text>
                              <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>Reviews of {this.state.selectedCourse.title}</Text>
                              <View style={[styles.spacer]} />

                              {(this.state.reviews && this.state.reviews.length > 0) ? (
                                <View>
                                  {this.state.reviews.map((value, index) =>
                                    <View>
                                      <View key={index}>
                                        <View style={[styles.spacer]} />

                                        <View style={[styles.rowDirection]}>
                                          <View style={[styles.width70]}>
                                            <Text style={[styles.headingText3,styles.ctaColor,styles.centerText]}>{value.rating}</Text>
                                            <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.centerText]}>/ 5.0</Text>
                                          </View>
                                          <View style={[styles.calcColumn130]}>
                                            <Text style={[styles.headingText5]}>{value.user.display_name}</Text>
                                            {(value.content) ? (
                                              <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding5]}>{value.content}</Text>
                                            ) : (
                                              <View />
                                            )}
                                            {(value.created) ? (
                                              <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding5]}>{convertDateToString(value.created,'daysAgo')}</Text>
                                            ) : (
                                              <View />
                                            )}

                                            <View style={[styles.halfSpacer]} />
                                            <View style={[styles.halfSpacer]} />
                                          </View>
                                        </View>

                                        <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                        <View style={[styles.horizontalLine]} />

                                        <View style={[styles.spacer]} />
                                      </View>

                                    </View>
                                  )}
                                </View>
                              ) : (
                                <View />
                              )}

                            </View>

                          </View>
                        )}

                        <View>
                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Comments') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <SubComments selectedCourse={this.state.selectedCourse} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} comments={this.state.comments}  orgContactEmail={this.state.orgContactEmail} pictureURL={this.state.pictureURL} pageSource={this.state.pageSource}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'People') && (
                            <View>
                              {(this.state.followers && this.state.followers.length > 0) ? (
                                <View>
                                  <SubRenderProfiles
                                    favorites={this.state.favorites} members={this.state.followers} friends={this.state.friends}
                                    pageSource={this.props.pageSource} navigation={this.props.navigation} userType="Peers"
                                  />
                                </View>
                              ) : (
                                <View />
                              )}

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Similar') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View>

                                {(this.state.courses && this.state.courses.length > 0) && (
                                  <View style={[styles.bottomMargin20]}>
                                    <View>
                                      <Text style={[styles.headingText5]}>Related Courses</Text>

                                      <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

                                      {this.state.courses.map((item, index) =>
                                        <View key={item}>
                                          {(index < 3) && (
                                            <View style={[styles.bottomPadding]}>
                                              <View style={[styles.spacer]} />
                                              <View style={[styles.rowDirection]}>
                                                <TouchableOpacity style={[styles.rowDirection]} onPress={() => this.props.navigation.navigate('CourseDetails', { selectedCourse: item })}>
                                                  <View style={[styles.width50]}>
                                                    <Image source={(item.image_480x270) ? { uri: item.image_480x270} : { uri: courseIconBlue}} style={[styles.square50,styles.contain]}/>
                                                  </View>
                                                  <View style={[styles.calcColumn150,styles.leftPadding5]}>
                                                    <Text style={[styles.standardText]}>{item.title}</Text>
                                                    <Text style={[styles.descriptionText2]}>{item.headline}</Text>
                                                  </View>
                                                </TouchableOpacity>
                                                <View style={[styles.leftPadding]}>
                                                  <View style={[styles.spacer]}/>
                                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('CourseDetails', { selectedCourse: item })}>
                                                    <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                                                  </TouchableOpacity>
                                                </View>

                                              </View>

                                              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                              <View style={[styles.horizontalLine]} />

                                              <View style={[styles.spacer]} />
                                            </View>
                                          )}
                                        </View>
                                      )}

                                      {(this.state.courses.length > 0) && (
                                        <View>
                                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Courses', { selectedCourse: null })}>
                                            <Text style={[styles.descriptionText2,styles.ctaColor]}>See More <Text style={[styles.descriptionText2,styles.leftPadding5]}>></Text></Text>
                                          </TouchableOpacity>
                                        </View>
                                      )}
                                    </View>
                                  </View>
                                )}
                              </View>
                            </View>
                          )}
                        </View>

                        <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.spacer]}/>

                      </View>
                    </View>
                  </View>


                </View>
              )}

              <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>

               {(this.state.showShareButtons) && (
                 <View key="showDescription" style={[styles.flex1,styles.padding20,styles.centerText]}>
                    <View style={[styles.rowDirection,styles.flex1]}>
                      <View style={[styles.flex5]}>
                        <TouchableOpacity onPress={() => this.closeModal()}>
                          <Image source={{uri: closeIcon }} style={[styles.square15,styles.contain]} />
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.flex90]}>
                        <Text style={[styles.headingText4]}>Share the {this.state.selectedCourse.title} Course with Friends!</Text>

                        <Text style={[styles.standardText,styles.topPadding20,styles.ctaColor]}>Share this link:</Text>
                        <TouchableOpacity onPress={() => Linking.openURL(this.state.shareURL)}><Text style={[styles.standardText]}>{this.state.shareURL}</Text></TouchableOpacity>
                      </View>
                      <View style={[styles.flex5]}>
                      </View>
                    </View>


                  </View>
               )}

             </Modal>

            </View>
          )}
        </ScrollView>

    )
  }
}

export default CourseDetails;
