import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, Linking, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';

const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const gcLogo = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/full-guided-compass-logo.png';
const easyIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/easy-icon.png';
const mediumIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/medium-icon.png';
const hardIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/hard-icon.png';
const reachIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/reach-icon.png';
const pointsIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/points-icon.png';
const industryIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/industry-icon.png';
const industryIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/industry-icon-dark.png';
const tagIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/tag-icon.png';
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';
const skillsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/skills-icon-blue.png';
const skillsIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/skills-icon.png';
const deadlineIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/deadline-icon.png';
const prizeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/prize-icon.png';
const profileIconBig = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-big.png';
const locationIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/location-icon.png';
const timeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-dark.png';
const infoIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/info-icon.png';
const linkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon.png';
const upvoteIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-blue.png';
const upvoteIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-grey.png';
const sendIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/send-icon.png';
const xIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/x-icon.png';
const timeRangeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-range-icon.png';
const calendarIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/calendar-icon-dark.png';
const subsidyIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/subsidy-icon-dark.png';
const moneyIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/money-icon-dark.png';
const checkmarkIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon-white.png';

import ProjectDetails from '../subcomponents/ProjectDetails';
import EditProject from './EditProject';
import SubSubmissions from '../common/Submissions';
import SubComments from '../common/Comments';

import {convertDateToString} from '../functions/convertDateToString';

class OpportunityDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedProject: {},

      disableSubmit: false,
      showSubEditProject: true,

      favorites: [],
      collaborators: [],
      viewIndex: 0,
      subviewIndex: 0,
      selectedIndex: 0,

      myComment: '',
      comments: [],
      myReplies: [],
      mySubmissionComments: [],
      submissionComments: [],
      summarySplit: [],

      projectCategoryOptions: [],
      dateOptions: [],
      collaboratorOptions: [],
      functionOptions: [],
      industryOptions: [],
      projectOptions: [{}],
      gradeOptions: [],
      roleNameOptions: ['Participant','Educator','Work-Based Learning Coordinator','Mentor','Other'],

      startDate: '',
      endDate: '',

      editComments: [],
      editSubmissionComments: [],

      youTubeId: '92mBt-NFx50'
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formatDate = this.formatDate.bind(this)
    this.favoriteItem = this.favoriteItem.bind(this)
    this.voteOnItem = this.voteOnItem.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.renderDetails = this.renderDetails.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.renderSkills = this.renderSkills.bind(this)
    this.renderInterests = this.renderInterests.bind(this)
    this.renderTraits = this.renderTraits.bind(this)
    this.renderTracks = this.renderTracks.bind(this)
    this.finishedSubmitting = this.finishedSubmitting.bind(this)
    this.itemClicked = this.itemClicked.bind(this)
    this.renderCollaborators = this.renderCollaborators.bind(this)
    this.removeItem = this.removeItem.bind(this)

  }

  componentDidMount() {
    console.log('opp details did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ', this.props, prevProps)

    if (!prevProps.selectedOpportunity) {
      console.log('t1')
      if (this.props.selectedOpportunity) {
        const selectedOpportunity = this.props.selectedOpportunity
        this.setState({ selectedOpportunity })
        this.retrieveData(selectedOpportunity)
      }
    } else if (prevProps.match && this.props.match && prevProps.match.params.opportunityId !== this.props.match.params.opportunityId) {
      console.log('t2')
      const opportunityId = this.props.match.params.opportunityId

      Axios.get('https://www.guidedcompass.com/api/postings/byid', { params: { _id: opportunityId } })
      .then((response) => {
         console.log('Posting detail by id query attempted', response.data);

         if (response.data.success) {
           console.log('successfully retrieved posting')

           const selectedOpportunity = response.data.posting
           this.setState({ selectedOpportunity })
           this.retrieveData(selectedOpportunity)
         }
      }).catch((error) => {
          console.log('Posting query did not work', error);
      });
    } else if (this.props.selectedOpportunity) {
      console.log('t3')
      if ( this.props.selectedOpportunity.name !== prevProps.selectedOpportunity.name ||  this.props.selectedOpportunity.title !== prevProps.selectedOpportunity.title) {
        console.log('t4')
        const selectedOpportunity = this.props.selectedOpportunity
        this.setState({ selectedOpportunity })
        this.retrieveData(selectedOpportunity)

      } else if (this.props.path !== prevProps.path) {
        console.log('t5')
        const selectedOpportunity = this.props.selectedOpportunity
        this.setState({ selectedOpportunity })
        this.retrieveData(selectedOpportunity)
      } else if (this.props.activeOrg !== prevProps.activeOrg) {
        console.log('t6')
        const selectedOpportunity = this.props.selectedOpportunity
        this.setState({ selectedOpportunity })
        this.retrieveData(selectedOpportunity)
      }
    } else {

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
      let workMode = await AsyncStorage.getItem('workMode');
      if (workMode === 'true') {
        workMode = true
      } else {
        workMode = false
      }

      let activeOrg = await AsyncStorage.getItem('activeOrg')
      if (!activeOrg) {
        activeOrg = 'guidedcompass'
      }
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      // let activeOrg = this.props.activeOrg
      // const postings = this.props.postings

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        // this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
        //   roleName, activeOrg, orgFocus, orgName, workM
        // })

        if (this.props.selectedOpportunity) {
          const selectedOpportunity = this.props.selectedOpportunity
          // if (!activeOrg || activeOrg === '') {
          //   activeOrg = this.props.activeOrg
          // }

          this.setState({ emailId: email, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
            roleName, activeOrg, selectedOpportunity, workMode
          })

          Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
          .then((response) => {
            console.log('Profile query attempted', response.data);

             if (response.data.success) {
               console.log('successfully retrieved profile information')

               let pictureURL = response.data.user.pictureURL
               const jobTitle = response.data.user.jobTitle
               const employerName = response.data.user.employerName

               this.setState({ pictureURL, jobTitle, employerName })


             } else {
               console.log('no profile data found', response.data.message)
             }

          }).catch((error) => {
             console.log('Profile query did not work', error);
          });

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

          if (selectedOpportunity.postType === 'Individual' || selectedOpportunity.postType === 'Track' || selectedOpportunity.postType === 'Internship' || selectedOpportunity.postType === 'Scholarship' || selectedOpportunity.postType === 'Work') {

            if (selectedOpportunity.orgCode) {

              Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: selectedOpportunity.orgCode } })
              .then((response) => {
                console.log('Org info query attempted', response.data);

                  if (response.data.success) {
                    console.log('org info query worked for post')

                    const postingOrgCode = response.data.orgInfo.orgCode
                    const postingOrgName = response.data.orgInfo.orgName
                    const postingOrgContactEmail = response.data.orgInfo.contactEmail

                    this.setState({ postingOrgCode, postingOrgName, postingOrgContactEmail });

                  } else {
                    console.log('org info query did not work', response.data.message)
                  }

              }).catch((error) => {
                  console.log('Org info query did not work for some reason', error);
              });
            } else {

            }

            let hasApplied = false
            if (selectedOpportunity.applicants) {
              if (selectedOpportunity.applicants.includes(email)) {
                hasApplied = true
              }
            }
            // console.log('hasApplied?', hasApplied)
            this.setState({ selectedOpportunity, hasApplied })

            if (selectedOpportunity.postType === 'Scholarship') {

              Axios.get('https://www.guidedcompass.com/api/applications', { params: { emailId: email } })
              .then((response) => {
                console.log('Applications query attempted 1', response.data);

                  if (response.data.success) {
                    console.log('successfully retrieved applications')

                    if (response.data.applications.length > 0) {
                      console.log('the array is greater than 0')
                      for (let i = 1; i <= response.data.applications.length; i++) {
                        console.log(i, 'looping through applications', response.data.applications[i - 1]);

                        if (response.data.applications[i - 1].postingId === selectedOpportunity._id) {

                          const application = response.data.applications[i - 1]
                          let resumeURL = ''
                          console.log('application: ', application)
                          if (application.resumeURL) {

                            resumeURL = application.resumeURL
                          }
                          this.setState({ application, resumeURL })
                        }
                      }
                    }

                  } else {
                    console.log('no applications data found', response.data.message)
                  }

              }).catch((error) => {
                  console.log('Applications query did not work', error);
              });
            } else {

              console.log('this is not a scholarship')

              Axios.get('https://www.guidedcompass.com/api/benchmarks/byid', { params: { _id: selectedOpportunity.benchmarkId } })
              .then((response) => {
                 console.log('Benchmark query attempted', response.data);

                 if (response.data.success) {
                   console.log('successfully retrieved benchmark')

                   const benchmark = response.data.benchmark
                   this.setState({ benchmark })

                   let isApproved = false


                   if (selectedOpportunity.postType !== 'Track') {
                     console.log('testing 0', selectedOpportunity)
                     let parentPostId = ''
                     if (selectedOpportunity.orgName === 'Bixel Exchange' || selectedOpportunity.orgCode === 'bixel') {
                       parentPostId = '5c703cc7c29ab2400a036875'
                       console.log('testing 1')
                     } else if (selectedOpportunity.orgCode === 'unite-la') {
                       parentPostId = '5ee171c929bc432630ac7a95'
                     } else if (selectedOpportunity.orgName === 'LA Promise Fund') {
                       parentPostId = ''
                     }

                     console.log('testing 2', parentPostId)
                     if (selectedOpportunity.isChild) {
                       Axios.get('https://www.guidedcompass.com/api/postings/byid', { params: { _id: parentPostId } })
                       .then((response) => {
                          console.log('Posting detail by id query attempted', response.data);

                          if (response.data.success && !selectedOpportunity.isPromotional) {
                            console.log('successfully retrieved parent posting')

                            const parentPost = response.data.posting
                            this.setState({ parentPost })

                            let parentIndex = 0
                            for (let i = 1; i <= parentPost.tracks.length; i++) {
                              console.log('testing this: ', parentPost.tracks[i - 1].benchmark.jobFunction, benchmark.jobFunction)
                              if (parentPost.tracks[i - 1].benchmark.jobFunction === benchmark.jobFunction) {
                                parentIndex = i - 1
                              }
                            }
                            console.log('testing 30', parentPost.tracks[parentIndex])
                            if (parentPost.tracks[parentIndex].approvedApplicants) {
                              console.log('testing 4 ', email, parentPost.tracks[parentIndex])
                              if (parentPost.tracks[parentIndex].approvedApplicants.includes(email)) {
                                console.log('testing 5')
                                isApproved = true
                                this.setState({ isApproved, parentIndex })

                                Axios.get('https://www.guidedcompass.com/api/applications', { params: { emailId: email } })
                                .then((response) => {
                                  console.log('Applications query attempted 2', response.data);

                                    if (response.data.success) {
                                      console.log('successfully retrieved applications')

                                      if (response.data.applications.length > 0) {
                                        console.log('the array is greater than 0')
                                        for (let i = 1; i <= response.data.applications.length; i++) {
                                          console.log(i, 'looping through applications', response.data.applications[i - 1], parentPost);

                                          if (response.data.applications[i - 1].postingId === parentPost._id) {
                                            const application = response.data.applications[i - 1]
                                            let resumeURL = ''
                                            console.log('application: ', application)
                                            if (application.resumeURL) {

                                              resumeURL = application.resumeURL
                                            }
                                            this.setState({ application, resumeURL })
                                          }
                                          // if (response.data.applications[i - 1].postingId === postingId) {
                                          //
                                          //   const application = response.data.applications[i - 1]
                                          //   let resumeURL = ''
                                          //   console.log('application: ', application)
                                          //   if (application.resumeURL) {
                                          //
                                          //     resumeURL = application.resumeURL
                                          //   }
                                          //   this.setState({ application, resumeURL })
                                          // }
                                        }
                                      }

                                    } else {
                                      console.log('no applications data found', response.data.message)
                                    }

                                }).catch((error) => {
                                    console.log('Applications query did not work', error);
                                });
                              }
                            }
                          } else {
                            console.log('no benchmark data found', response.data.message)

                            //this is the parentPost
                            Axios.get('https://www.guidedcompass.com/api/applications', { params: { emailId: email } })
                            .then((response) => {
                              console.log('Applications query attempted 3', response.data);

                                if (response.data.success) {
                                  console.log('successfully retrieved applications',response.data.applications.length)

                                  if (response.data.applications.length > 0) {
                                    console.log('the array is greater than 0')
                                    for (let i = 1; i <= response.data.applications.length; i++) {
                                      console.log('compare the two: ', i, response.data.applications[i - 1].postingId, selectedOpportunity._id)
                                      if (response.data.applications[i - 1].postingId === selectedOpportunity._id) {
                                        const application = response.data.applications[i - 1]
                                        console.log('application: ', application)
                                        if (application) {

                                          const resumeURL = application.resumeURL
                                          this.setState({ application, resumeURL })
                                        }
                                      }
                                    }
                                  }

                                } else {
                                  console.log('no applications data found', response.data.message)
                                }

                            }).catch((error) => {
                                console.log('Applications query did not work', error);
                            });
                          }

                       }).catch((error) => {
                            console.log('Benchmark query did not work', error);
                       });
                     } else {
                       //this is the parentPost
                       Axios.get('https://www.guidedcompass.com/api/applications', { params: { emailId: email } })
                       .then((response) => {
                         console.log('Applications query attempted 3', response.data);

                           if (response.data.success) {
                             console.log('successfully retrieved applications',response.data.applications.length)

                             if (response.data.applications.length > 0) {
                               console.log('the array is greater than 0')
                               for (let i = 1; i <= response.data.applications.length; i++) {
                                 console.log('compare the two: ', i, response.data.applications[i - 1].postingId, selectedOpportunity._id)
                                 if (response.data.applications[i - 1].postingId === selectedOpportunity._id) {
                                   const application = response.data.applications[i - 1]
                                   console.log('application: ', application)
                                   if (application) {

                                     const resumeURL = application.resumeURL
                                     this.setState({ application, resumeURL })
                                   }
                                 }
                               }
                             }

                           } else {
                             console.log('no applications data found', response.data.message)
                           }

                       }).catch((error) => {
                           console.log('Applications query did not work', error);
                       });
                     }
                   }
                 } else {
                   console.log('no benchmark data found: ', response.data.message)

                   //this is the parentPost
                   Axios.get('https://www.guidedcompass.com/api/applications', { params: { emailId: email } })
                   .then((response) => {
                     console.log('Applications query attempted 4', response.data);

                       if (response.data.success) {
                         console.log('successfully retrieved applications 1', response.data.applications.length)

                         if (response.data.applications.length > 0) {
                           console.log('the array is greater than 0')
                           for (let i = 1; i <= response.data.applications.length; i++) {

                             if (response.data.applications[i - 1].postingId === selectedOpportunity._id) {
                               console.log('test application: ', response.data.applications[i - 1])

                               const application = response.data.applications[i - 1]
                               console.log('application: ', application)
                               if (application.resumeURL) {
                                 const resumeURL = application.resumeURL
                                 this.setState({ application, resumeURL })
                               }
                             }
                           }
                         }

                       } else {
                         console.log('no applications data found', response.data.message)
                       }

                   }).catch((error) => {
                       console.log('Applications query did not work', error);
                   });
                 }

              }).catch((error) => {
                   console.log('Benchmark query did not work', error);
              });
            }

            // let jobOptions = [{ title: 'Select a Job'}]
            // if (postings) {
            //   for (let i = 1; i <= postings.length; i++) {
            //     console.log(i, 'show id', postings[i - 1].title, postings[i - 1].employerName);
            //
            //     if (postings[i - 1].postType !== 'Track') {
            //       jobOptions.push({
            //         _id: postings[i - 1]._id,
            //         title: postings[i - 1].title,
            //         employerName: postings[i - 1].employerName,
            //         extendedTitle: postings[i - 1].title + " | " + postings[i - 1].employerName
            //       })
            //     }
            //   }
            // }
            //
            // let tracks = [{ name: '', benchmark: {title: 'No Benchmarks Saved'}, postings: [{ extendedTitle: 'No Postings Saved'}], approvedApplicants: []}]
            // if (selectedOpportunity.tracks) {
            //   if (selectedOpportunity.tracks.length !== 0) {
            //     tracks = selectedOpportunity.tracks
            //   }
            // }
            //
            // let includeCoverLetter = false
            // let includeInterests = true
            // let includeSkills = true
            // let includeTraits = true
            // let includeEndorsements = true
            // let includeCustomAssessment = false
            //
            // let applicationComponents = selectedOpportunity.applicationComponents
            //
            // if (applicationComponents) {
            //   if (applicationComponents.includes('coverLetter')) {
            //     includeCoverLetter = true
            //   }
            //
            //   if (!applicationComponents.includes('interests')) {
            //     includeInterests = false
            //   }
            //
            //   if (!applicationComponents.includes('skills')) {
            //     includeSkills = false
            //   }
            //
            //   if (!applicationComponents.includes('personality')) {
            //     includeTraits = false
            //   }
            //
            //   if (!applicationComponents.includes('endorsements')) {
            //     includeEndorsements = false
            //   }
            //
            //   if (applicationComponents.includes('customAssessment')) {
            //     includeCustomAssessment = true
            //   }
            // }
            //
            // let functionValue = null
            // let industryValue = null
            // let fieldArray = null
            // if (selectedOpportunity.field) {
            //   fieldArray = selectedOpportunity.field.split("|")
            //   functionValue = fieldArray[0].trim()
            //   industryValue = fieldArray[1].trim()
            // }
            //
            // let usePrimaryOrgContact = true
            // if (selectedOpportunity.usePrimaryOrgContact) {
            //     usePrimaryOrgContact = selectedOpportunity.usePrimaryOrgContact
            // }
            //
            // let employerTransactionNoti = true
            // if (selectedOpportunity.employerTransactionNoti) {
            //   employerTransactionNoti = selectedOpportunity.employerTransactionNoti
            // }
            //
            // Axios.get('https://www.guidedcompass.com/api/customassessments', { params: { orgCode: activeOrg } })
            // .then((response) => {
            //   console.log('Custom assessment query attempted', response.data);
            //
            //   if (response.data.success) {
            //     console.log('custom assessment query worked')
            //
            //     if (response.data.assessments.length !== 0) {
            //
            //       let customAssessments = response.data.assessments
            //       customAssessments.unshift({ title: 'No Assessment Selected'})
            //
            //       let selectedAssessment = this.state.selectedAssessment
            //       let assessmentOptions = this.state.assessmentOptions
            //
            //       let customAssessment = { title: 'No Assessment Selected'}
            //       for (let i = 1; i <= response.data.assessments.length; i++) {
            //         console.log(i);
            //
            //         if (response.data.assessments[i - 1].type === 'Event') {
            //           assessmentOptions.push(response.data.assessments[i - 1])
            //           console.log('show event: ', selectedOpportunity.surveyId, response.data.assessments[i - 1]._id)
            //           if (selectedOpportunity.surveyId === response.data.assessments[i - 1]._id) {
            //
            //             selectedAssessment = response.data.assessments[i - 1]
            //             console.log('in event')
            //           }
            //         } else {
            //           if (response.data.assessments[i - 1]._id === selectedOpportunity.customAssessmentId) {
            //             customAssessment = { title: response.data.assessments[i - 1].title}
            //           }
            //         }
            //
            //       }
            //
            //       this.setState({
            //           customAssessment, customAssessmentOptions: customAssessments, selectedAssessment, assessmentOptions
            //       });
            //     }
            //
            //   } else {
            //     console.log('custom assessment query did not work', response.data.message)
            //   }
            //
            // }).catch((error) => {
            //   console.log('Posted postings query did not work for some reason', error);
            // });
            //
            // Axios.get('https://www.guidedcompass.com/api/benchmarks/byid', { params: { _id: selectedOpportunity.benchmarkId } })
            // .then((response) => {
            //    console.log('Benchmark query attempted', response.data);
            //
            //    if (response.data.success) {
            //      console.log('successfully retrieved benchmark')
            //
            //      const benchmark = response.data.benchmark
            //      this.setState({ benchmark })
            //    } else {
            //      console.log('no benchmark data found', response.data.message)
            //    }
            //
            // }).catch((error) => {
            //      console.log('Benchmark query did not work', error);
            // });
            //
            // //add benchmakrs to each org
            // Axios.get('https://www.guidedcompass.com/api/benchmarks', { params: { orgCode: 'general' } })
            // .then((response) => {
            //   console.log('Benchmarks query attempted', response.data);
            //
            //   if (response.data.success) {
            //     console.log('benchmark query worked')
            //
            //     if (response.data.benchmarks.length !== 0) {
            //       let benchmarkOptions = response.data.benchmarks
            //       benchmarkOptions.unshift({ title: 'No Benchmark Added'})
            //
            //       let selectedBenchmark = { title: 'No Benchmark Added' }
            //
            //       for (let i = 1; i <= response.data.benchmarks.length; i++) {
            //         console.log(i);
            //
            //         if (response.data.benchmarks[i - 1]._id === selectedOpportunity.benchmarkId) {
            //
            //           selectedBenchmark = response.data.benchmarks[i - 1]
            //
            //         }
            //       }
            //
            //       Axios.get('https://www.guidedcompass.com/api/applications/bypost', { params: { postingId: selectedOpportunity._id } })
            //       .then((response) => {
            //         console.log('Applications query attempted', response.data);
            //
            //         if (response.data.success) {
            //           console.log('applications query worked')
            //
            //           if (response.data.applications.length !== 0) {
            //
            //             this.calculateMatches(response.data.applications, selectedOpportunity, selectedBenchmark, benchmarkOptions)
            //
            //           }
            //
            //         } else {
            //           console.log('applications query did not work', response.data.message)
            //           this.setState({ selectedBenchmark, benchmarkOptions });
            //         }
            //       }).catch((error) => {
            //           console.log('Application query did not work for some reason', error);
            //
            //           this.setState({ selectedBenchmark, benchmarkOptions });
            //       });
            //     }
            //
            //   } else {
            //     console.log('benchmark query did not work', response.data.message)
            //     let selectedBenchmark = { title: 'No Benchmark Added'}
            //     this.setState({ selectedBenchmark })
            //   }
            //
            // }).catch((error) => {
            //     console.log('Benchmark query did not work for some reason', error);
            // });
            //
            // Axios.get('https://www.guidedcompass.com/api/account/partners', { params: { org: activeOrg } })
            // .then((response) => {
            //   console.log('Posted employer query attempted', response.data);
            //
            //   if (response.data.success) {
            //     console.log('posted employer query worked')
            //
            //     if (response.data.employers.length !== 0) {
            //
            //       let employerOptions = response.data.employers
            //
            //       let selectedEmployer = { employerName: 'No Employer Selected'}
            //       employerOptions.unshift(selectedEmployer)
            //
            //       if (selectedOpportunity.accountCode) {
            //         for (let i = 1; i <= employerOptions.length; i++) {
            //           if (selectedOpportunity.accountCode === employerOptions[i - 1].accountCode) {
            //             selectedEmployer = employerOptions[i - 1]
            //           }
            //         }
            //       }
            //       this.setState({ employerOptions, selectedEmployer });
            //     }
            //
            //   } else {
            //     console.log('query for employers query did not work', response.data.message)
            //   }
            //
            // }).catch((error) => {
            //     console.log('Employer query did not work for some reason', error);
            // });
            //
            // Axios.get('https://www.guidedcompass.com/api/workoptions')
            // .then((response) => {
            //   console.log('Work options query tried', response.data);
            //
            //   if (response.data.success) {
            //     console.log('Work options query succeeded')
            //
            //     this.setState({
            //       functionOptions: response.data.workOptions[0].functionOptions,
            //       industryOptions: response.data.workOptions[0].industryOptions,
            //       hoursPerWeekOptions: response.data.workOptions[0].hoursPerWeekOptions,
            //       hourlyPayRangeOptions: response.data.workOptions[0].hourlyPayOptions,
            //       annualPayRangeOptions: response.data.workOptions[0].annualPayOptions,
            //       countOptions: response.data.workOptions[0].employeeCountOptions,
            //       growthOptions: response.data.workOptions[0].employeeGrowthOptions,
            //       hireCountOptions: response.data.workOptions[0].projectedInternOptions,
            //
            //     })
            //   }
            // });
            //
            // this.setState({
            //     selectedOpportunity, jobOptions, tracks,
            //
            //     _id: selectedOpportunity._id,
            //     postType: selectedOpportunity.postType,
            //     title: selectedOpportunity.title,
            //     location: selectedOpportunity.location,
            //     type: selectedOpportunity.type,
            //     function: functionValue,
            //     payType: selectedOpportunity.payType,
            //     payRange: selectedOpportunity.payRange,
            //
            //     hoursPerWeek: selectedOpportunity.hoursPerWeek,
            //     hireCount: selectedOpportunity.hireCount,
            //     isPerpetual: selectedOpportunity.isPerpetual,
            //     startDate: selectedOpportunity.startDate,
            //     endDate: selectedOpportunity.endDate,
            //
            //     studentAttendanceLimit: selectedOpportunity.studentAttendanceLimit,
            //     mentorAttendanceLimit: selectedOpportunity.mentorAttendanceLimit,
            //
            //     orgTransactionNoti: selectedOpportunity.orgTransactionNoti,
            //     usePrimaryOrgContact, employerTransactionNoti,
            //     employerContactFirstName: selectedOpportunity.employerContactFirstName,
            //     employerContactLastName: selectedOpportunity.employerContactLastName,
            //     employerContactEmail: selectedOpportunity.employerContactEmail,
            //     employerContactPhone: selectedOpportunity.employerContactPhone,
            //     employerName: selectedOpportunity.employerName,
            //     employerURL: selectedOpportunity.employerURL,
            //     employerType: selectedOpportunity.employerType,
            //     industry: industryValue,
            //     employeeCount: selectedOpportunity.employerEmployees,
            //     employeeGrowth: selectedOpportunity.employerGrowth,
            //
            //     orgContactFirstName: selectedOpportunity.orgContactFirstName,
            //     orgContactLastName: selectedOpportunity.orgContactLastName,
            //     orgContactEmail: selectedOpportunity.orgContactEmail,
            //
            //     description: selectedOpportunity.description,
            //     summary: selectedOpportunity.summary,
            //     bio: selectedOpportunity.bio,
            //     goals: selectedOpportunity.goals,
            //     transportationDetails: selectedOpportunity.transportationDetails,
            //
            //     includeBasicInfo: true,
            //     includeResume: true,
            //     includeCoverLetter, includeInterests,
            //     includeSkills, includeTraits,
            //     includeGoals: false,
            //     includeEndorsements, includeCustomAssessment,
            //
            // });
          } else if (selectedOpportunity.postType === 'Event') {

            const startDateString = this.formatDate(selectedOpportunity.startDate)
            const endDateString = this.formatDate(selectedOpportunity.endDate)

            let eventPassed = false
            let dateToTest = null
            if (selectedOpportunity.endDate && new Date(selectedOpportunity.endDate)) {
              dateToTest = selectedOpportunity.endDate
            } else if (selectedOpportunity.startDate && new Date(selectedOpportunity.startDate)) {
              dateToTest = selectedOpportunity.startDate
            }

            if (dateToTest) {
              const startDateDate = new Date(dateToTest)
              const timeDifferenceUnadjusted = new Date().getTime() - startDateDate.getTime()
              const timeZoneDifferenceMiliseconds = (startDateDate.getTimezoneOffset()) * 60000
              const timeDifference = timeDifferenceUnadjusted - timeZoneDifferenceMiliseconds
              if (timeDifference > 0) {
                eventPassed = true
              }
            }

            this.setState({ startDateString, endDateString, eventPassed })

            Axios.get('https://www.guidedcompass.com/api/rsvps/bypost', { params: { postingId: selectedOpportunity._id } })
            .then((response) => {
              console.log('Rsvp query attempted', response.data);

              if (response.data.success) {
                console.log('rsvp query worked')

                let rsvps = response.data.rsvps
                let alreadyRSVPd = false
                for (let i = 1; i <= rsvps.length; i++) {
                  if (rsvps[i - 1].email === email) {
                    alreadyRSVPd = true
                  }
                }

                // alreadyRSVPd for events, hasRegistered for challenges

                this.setState({ alreadyRSVPd })

              } else {
                console.log('rsvp query did not work', response.data.message)
                //there is no rsvp data
              }

            }).catch((error) => {
                console.log('Rsvp query did not work for some reason', error);
            });

            Axios.get('https://www.guidedcompass.com/api/comments', { params: { parentPostId: selectedOpportunity._id } })
            .then((response) => {
              console.log('Comments query attempted', response.data);

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

          } else if (selectedOpportunity.postType === 'Assignment' || selectedOpportunity.postType === 'Problem' || selectedOpportunity.postType === 'Challenge') {

            let summarySplit = []
            if (selectedOpportunity.summary) {
              summarySplit = selectedOpportunity.summary.split('//n')
              console.log('show summarySplit: ', selectedOpportunity.summary.includes('//n'), selectedOpportunity.summary.substring(0,15), summarySplit)
            }

            //update submissions
            Axios.get('https://www.guidedcompass.com/api/postings/byid', { params: { _id: selectedOpportunity._id } })
            .then((response) => {
              console.log('Postings by id query attempted', response.data);

                if (response.data.success) {
                  console.log('successfully retrieved postings')

                  if (response.data.posting) {

                    const updatedOpportunity = response.data.posting
                    let registrationPassed = false
                    let deadlinePassed = false
                    let disableVoting = false

                    if (updatedOpportunity.submissionDeadline) {
                      const now = new Date()
                      const submissionDeadlineDate = new Date(updatedOpportunity.submissionDeadline)
                      const timeDifferenceUnadjusted = now.getTime() - submissionDeadlineDate.getTime()
                      const timeZoneDifferenceMiliseconds = (submissionDeadlineDate.getTimezoneOffset()) * 60000
                      const timeDifference = timeDifferenceUnadjusted - timeZoneDifferenceMiliseconds

                      if (timeDifference > 0) {
                        deadlinePassed = true
                      }
                      // console.log('show deadlinePassed: ', deadlinePassed, submissionDeadlineDate, new Date(), now.getTime(), submissionDeadlineDate.getTime(), submissionDeadlineDate.getTimezoneOffset())
                    }

                    if (updatedOpportunity.startDate) {
                      const now = new Date()
                      const startDate = new Date(updatedOpportunity.startDate)
                      const timeDifferenceUnadjusted = now.getTime() - startDate.getTime()
                      const timeZoneDifferenceMiliseconds = (startDate.getTimezoneOffset()) * 60000
                      const timeDifference = timeDifferenceUnadjusted - timeZoneDifferenceMiliseconds

                      if (timeDifference > 0) {
                        registrationPassed = true
                      }
                    }

                    let submitted = false

                    if (updatedOpportunity.submissions && updatedOpportunity.submissions.length > 0) {

                      let submissions = updatedOpportunity.submissions
                      for (let i = 1; i <= submissions.length; i++) {

                        //for students who already submitted
                        if (submissions[i - 1].userEmail === email) {
                          submitted = true
                        }
                      }
                      disableVoting = updatedOpportunity.disableVoting

                      submissions.sort(function(a,b) {
                        return b.upvotes.length - a.upvotes.length;
                      })

                      // console.log('show submissions: ', submissions)
                      updatedOpportunity['submissions'] = submissions
                    }

                    this.setState({
                      selectedOpportunity: updatedOpportunity, submitted,
                      summarySplit, deadlinePassed, registrationPassed, disableVoting
                    })
                  }


                } else {
                  console.log('no posting data found', response.data.message)
                }

            }).catch((error) => {
                console.log('Posting query did not work', error);
            });

            Axios.get('https://www.guidedcompass.com/api/projects', { params: { emailId: email } })
            .then((response) => {
              console.log('Projects query attempted in subcomponent', response.data);

              if (response.data.success) {
                console.log('successfully retrieved projects')

                if (response.data.projects) {

                  let projectOptions = response.data.projects
                  if (projectOptions.length > 0) {
                    console.log('the array is greater than 0')

                    projectOptions.unshift({})
                    this.setState({ projectOptions })
                    console.log('po: ', projectOptions)

                  }
                }

              } else {
                console.log('no project data found', response.data.message)
              }

            }).catch((error) => {
                console.log('Project query did not work', error);
            });

            Axios.get('https://www.guidedcompass.com/api/rsvps/bypost', { params: { postingId: selectedOpportunity._id } })
            .then((response) => {
              console.log('Rsvp query attempted', response.data);

              if (response.data.success) {
                console.log('rsvp query worked')

                let rsvps = response.data.rsvps
                let hasRegistered = false
                for (let i = 1; i <= rsvps.length; i++) {
                  if (rsvps[i - 1].email === email) {
                    hasRegistered = true
                  }
                }

                this.setState({ hasRegistered })

              } else {
                console.log('rsvp query did not work', response.data.message)
                //there is no rsvp data
              }

            }).catch((error) => {
                console.log('Rsvp query did not work for some reason', error);
            });

            const collaboratorOptions = [{value: '0'},{value: '1'},{value: '2'}, {value: '3'}, {value: '4'}, {value: '5'}]
            const hourOptions = [{value: ''}, {value: '< 10'},{value: '10 - 50'}, {value: '50 - 100'}, {value: '100 - 500'}, {value: '500 - 1000'}, {value: '1000 - 5000'}, {value: '5000 - 10000'}, {value: '10000+'}]

            let dateOptions = []

            const currentMonth = new Date().getMonth()
            const currentYear = new Date().getFullYear()

            let month = ''
            let year = currentYear - 10

            console.log('show me current stuff', currentMonth, currentYear)
            for (let i = 1; i <= 120 + currentMonth; i++) {
              console.log('show me stuff', i)
              if (i % 12 === 0) {
                month = 'January'
              } else if (i % 12 === 1) {
                month = 'February'
              } else if (i % 12 === 2) {
                month = 'March'
              } else if (i % 12 === 3) {
                month = 'April'
              } else if (i % 12 === 4) {
                month = 'May'
              } else if (i % 12 === 5) {
                month = 'June'
              } else if (i % 12 === 6) {
                month = 'July'
              } else if (i % 12 === 7) {
                month = 'August'
              } else if (i % 12 === 8) {
                month = 'September'
              } else if (i % 12 === 9) {
                month = 'October'
              } else if (i % 12 === 10) {
                month = 'November'
              } else if (i % 12 === 11) {
                month = 'December'
              }

              if (i > 12 && i <= 24) {
                if (i % 12 === 0) {
                  year = currentYear - 10 + 1 + 1
                } else {
                  year = currentYear - 10 + 1
                }
              } else if (i > 24 && i <= 36) {
                if (i % 12 === 0) {
                  year = currentYear - 10 + 2 + 1
                } else {
                  year = currentYear - 10 + 2
                }
              } else if (i > 36 && i <= 48) {
                if (i % 12 === 0) {
                  year = currentYear - 10 + 3 + 1
                } else {
                  year = currentYear - 10 + 3
                }
              } else if (i > 48 && i <= 60) {
                if (i % 12 === 0) {
                  year = currentYear - 10 + 4 + 1
                } else {
                  year = currentYear - 10 + 4
                }
              } else if (i > 60 && i <= 72) {
                if (i % 12 === 0) {
                  year = currentYear - 10 + 5 + 1
                } else {
                  year = currentYear - 10 + 5
                }
              } else if (i > 72 && i <= 84) {
                if (i % 12 === 0) {
                  year = currentYear - 10 + 6 + 1
                } else {
                  year = currentYear - 10 + 6
                }
              } else if (i > 84 && i <= 96) {
                if (i % 12 === 0) {
                  year = currentYear - 10 + 7 + 1
                } else {
                  year = currentYear - 10 + 7
                }
              } else if (i > 96 && i <= 108) {
                if (i % 12 === 0) {
                  year = currentYear - 10 + 8 + 1
                } else {
                  year = currentYear - 10 + 8
                }
              } else if (i > 108 && i <= 120) {
                if (i % 12 === 0) {
                  year = currentYear - 10 + 9 + 1
                } else {
                  year = currentYear - 10 + 9
                }
              }
              dateOptions.push({ value: month + ' ' + year})
            }

            Axios.get('https://www.guidedcompass.com/api/workoptions')
            .then((response) => {
              console.log('Work options query tried', response.data);

              if (response.data.success) {
                console.log('Work options query succeeded')

                let functionOptions = [{value: 'I am not sure'}]
                for (let i = 1; i <= response.data.workOptions[0].functionOptions.length; i++) {
                  if (i > 1) {
                    functionOptions.push({ value: response.data.workOptions[0].functionOptions[i - 1]})
                  }
                }

                let industryOptions = [{value: 'I am not sure'}]
                for (let i = 1; i <= response.data.workOptions[0].industryOptions.length; i++) {
                  if (i > 1) {
                    industryOptions.push({ value: response.data.workOptions[0].industryOptions[i - 1]})
                  }
                }

                let workDistanceOptions = [{value: '0 miles'},{value: '10 miles'}]
                for (let i = 1; i <= response.data.workOptions[0].workDistanceOptions.length; i++) {
                  if (i > 1) {
                    workDistanceOptions.push({ value: response.data.workOptions[0].workDistanceOptions[i - 1]})
                  }
                }

                let hoursPerWeekOptions = [{value: '~ 40 hours / week'}]
                for (let i = 1; i <= response.data.workOptions[0].hoursPerWeekOptions.length; i++) {
                  if (i > 1) {
                    hoursPerWeekOptions.push({ value: response.data.workOptions[0].hoursPerWeekOptions[i - 1]})
                  }
                }

                let workTypeOptions = [{value: 'Internship'}]
                for (let i = 1; i <= response.data.workOptions[0].workTypeOptions.length; i++) {
                  if (i > 1) {
                    workTypeOptions.push({ value: response.data.workOptions[0].workTypeOptions[i - 1]})
                  }
                }

                let hourlyPayOptions = [{value: 'Flexible'}]
                for (let i = 1; i <= response.data.workOptions[0].hourlyPayOptions.length; i++) {
                  if (i > 1) {
                    hourlyPayOptions.push({ value: response.data.workOptions[0].hourlyPayOptions[i - 1]})
                  }
                }

                let annualPayOptions = [{value: 'I am not sure'}]
                for (let i = 1; i <= response.data.workOptions[0].annualPayOptions.length; i++) {
                  if (i > 1) {
                    annualPayOptions.push({ value: response.data.workOptions[0].annualPayOptions[i - 1]})
                  }
                }

                let projectCategoryOptions = [{value: 'I am not sure'}]
                for (let i = 1; i <= response.data.workOptions[0].projectCategoryOptions.length; i++) {
                  if (i > 1) {
                    projectCategoryOptions.push({ value: response.data.workOptions[0].projectCategoryOptions[i - 1]})
                  }
                }

                //strongarming this for now
                const gradeOptions = ['','A+','A','A-','B+','B','B-','C+','C','C-','D+','D','D-','F']

                this.setState({ functionOptions, industryOptions,
                workDistanceOptions, hoursPerWeekOptions, workTypeOptions, hourlyPayOptions, payOptions: annualPayOptions,
                projectCategoryOptions, dateOptions, collaboratorOptions, hourOptions, gradeOptions })


              } else {
                console.log('no jobFamilies data found', response.data.message)

                const functionOptions = [{value: 'Undecided'}]
                const industryOptions = [{value: 'Undecided'}]
                //const workDistanceOptions = [{value: '0 miles'},{value: '10 miles'}]
                const hoursPerWeekOptions = [{value: '~ 40 hours / week'}]
                //const workTypeOptions = [{value: 'Internship'}]
                //const hourlyPayOptions = [{value: 'Flexible'}]
                const payOptions = [{value: 'Flexible'}]

                this.setState({ functionOptions, industryOptions, hoursPerWeekOptions, payOptions, dateOptions, collaboratorOptions, hourOptions })

              }
            }).catch((error) => {
                console.log('query for work options did not work', error);
            })

            Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: selectedOpportunity.orgCode } })
            .then((response) => {
              console.log('Org info query attempted', response.data);

                if (response.data.success) {
                  console.log('org info query worked')

                  const postingOrgCode = response.data.orgInfo.orgCode
                  const postingOrgName = response.data.orgInfo.orgName
                  const orgContactEmail = response.data.orgInfo.contactEmail

                  this.setState({ postingOrgCode, postingOrgName, orgContactEmail });

                } else {
                  console.log('org info query did not work', response.data.message)
                }

            }).catch((error) => {
                console.log('Org info query did not work for some reason', error);
            });

            Axios.get('https://www.guidedcompass.com/api/comments', { params: { parentPostId: selectedOpportunity._id } })
            .then((response) => {
              console.log('Comments query attempted', response.data);

               if (response.data.success) {
                 console.log('successfully retrieved comments')

                 if (response.data.comments && response.data.comments.length > 0) {
                   let comments = []
                   let submissionComments = []
                   for (let i = 1; i <= response.data.comments.length; i++) {
                     console.log('test 1: ', response.data.comments[i - 1])
                     if (response.data.comments[i - 1].parentSubmissionId && response.data.comments[i - 1].parentSubmissionId !== '') {
                       submissionComments.push(response.data.comments[i - 1])
                     } else if (response.data.comments[i - 1].parentPostId && response.data.comments[i - 1].parentPostId !== '') {
                       comments.push(response.data.comments[i - 1])
                     }
                   }

                   console.log('test 2: ', comments, submissionComments)
                  this.setState({ comments, submissionComments })
                 }
               } else {
                 console.log('no comments data found', response.data.message)
               }

            }).catch((error) => {
               console.log('Comments query did not work', error);
            });

          // } else if (selectedOpportunity.postType === 'Assignment') {
          //   const collaboratorOptions = [{value: '0'},{value: '1'},{value: '2'}, {value: '3'}, {value: '4'}, {value: '5'}]
          //   const hourOptions = [{value: ''}, {value: '< 10'},{value: '10 - 50'}, {value: '50 - 100'}, {value: '100 - 500'}, {value: '500 - 1000'}, {value: '1000 - 5000'}, {value: '5000 - 10000'}, {value: '10000+'}]
          //
          //   let dateOptions = []
          //
          //   const currentMonth = new Date().getMonth()
          //   const currentYear = new Date().getFullYear()
          //
          //   let month = ''
          //   let year = currentYear - 10
          //
          //   console.log('show me current stuff', currentMonth, currentYear)
          //   for (let i = 1; i <= 120 + currentMonth; i++) {
          //     console.log('show me stuff', i)
          //     if (i % 12 === 0) {
          //       month = 'January'
          //     } else if (i % 12 === 1) {
          //       month = 'February'
          //     } else if (i % 12 === 2) {
          //       month = 'March'
          //     } else if (i % 12 === 3) {
          //       month = 'April'
          //     } else if (i % 12 === 4) {
          //       month = 'May'
          //     } else if (i % 12 === 5) {
          //       month = 'June'
          //     } else if (i % 12 === 6) {
          //       month = 'July'
          //     } else if (i % 12 === 7) {
          //       month = 'August'
          //     } else if (i % 12 === 8) {
          //       month = 'September'
          //     } else if (i % 12 === 9) {
          //       month = 'October'
          //     } else if (i % 12 === 10) {
          //       month = 'November'
          //     } else if (i % 12 === 11) {
          //       month = 'December'
          //     }
          //
          //     if (i > 12 && i <= 24) {
          //       if (i % 12 === 0) {
          //         year = currentYear - 10 + 1 + 1
          //       } else {
          //         year = currentYear - 10 + 1
          //       }
          //     } else if (i > 24 && i <= 36) {
          //       if (i % 12 === 0) {
          //         year = currentYear - 10 + 2 + 1
          //       } else {
          //         year = currentYear - 10 + 2
          //       }
          //     } else if (i > 36 && i <= 48) {
          //       if (i % 12 === 0) {
          //         year = currentYear - 10 + 3 + 1
          //       } else {
          //         year = currentYear - 10 + 3
          //       }
          //     } else if (i > 48 && i <= 60) {
          //       if (i % 12 === 0) {
          //         year = currentYear - 10 + 4 + 1
          //       } else {
          //         year = currentYear - 10 + 4
          //       }
          //     } else if (i > 60 && i <= 72) {
          //       if (i % 12 === 0) {
          //         year = currentYear - 10 + 5 + 1
          //       } else {
          //         year = currentYear - 10 + 5
          //       }
          //     } else if (i > 72 && i <= 84) {
          //       if (i % 12 === 0) {
          //         year = currentYear - 10 + 6 + 1
          //       } else {
          //         year = currentYear - 10 + 6
          //       }
          //     } else if (i > 84 && i <= 96) {
          //       if (i % 12 === 0) {
          //         year = currentYear - 10 + 7 + 1
          //       } else {
          //         year = currentYear - 10 + 7
          //       }
          //     } else if (i > 96 && i <= 108) {
          //       if (i % 12 === 0) {
          //         year = currentYear - 10 + 8 + 1
          //       } else {
          //         year = currentYear - 10 + 8
          //       }
          //     } else if (i > 108 && i <= 120) {
          //       if (i % 12 === 0) {
          //         year = currentYear - 10 + 9 + 1
          //       } else {
          //         year = currentYear - 10 + 9
          //       }
          //     }
          //     dateOptions.push({ value: month + ' ' + year})
          //   }
          //
          //   Axios.get('https://www.guidedcompass.com/api/workoptions')
          //   .then((response) => {
          //     console.log('Work options query tried', response.data);
          //
          //     if (response.data.success) {
          //       console.log('Work options query succeeded')
          //
          //       let functionOptions = [{value: 'I am not sure'}]
          //       for (let i = 1; i <= response.data.workOptions[0].functionOptions.length; i++) {
          //         if (i > 1) {
          //           functionOptions.push({ value: response.data.workOptions[0].functionOptions[i - 1]})
          //         }
          //       }
          //
          //       let industryOptions = [{value: 'I am not sure'}]
          //       for (let i = 1; i <= response.data.workOptions[0].industryOptions.length; i++) {
          //         if (i > 1) {
          //           industryOptions.push({ value: response.data.workOptions[0].industryOptions[i - 1]})
          //         }
          //       }
          //
          //       let workDistanceOptions = [{value: '0 miles'},{value: '10 miles'}]
          //       for (let i = 1; i <= response.data.workOptions[0].workDistanceOptions.length; i++) {
          //         if (i > 1) {
          //           workDistanceOptions.push({ value: response.data.workOptions[0].workDistanceOptions[i - 1]})
          //         }
          //       }
          //
          //       let hoursPerWeekOptions = [{value: '~ 40 hours / week'}]
          //       for (let i = 1; i <= response.data.workOptions[0].hoursPerWeekOptions.length; i++) {
          //         if (i > 1) {
          //           hoursPerWeekOptions.push({ value: response.data.workOptions[0].hoursPerWeekOptions[i - 1]})
          //         }
          //       }
          //
          //       let workTypeOptions = [{value: 'Internship'}]
          //       for (let i = 1; i <= response.data.workOptions[0].workTypeOptions.length; i++) {
          //         if (i > 1) {
          //           workTypeOptions.push({ value: response.data.workOptions[0].workTypeOptions[i - 1]})
          //         }
          //       }
          //
          //       let hourlyPayOptions = [{value: 'Flexible'}]
          //       for (let i = 1; i <= response.data.workOptions[0].hourlyPayOptions.length; i++) {
          //         if (i > 1) {
          //           hourlyPayOptions.push({ value: response.data.workOptions[0].hourlyPayOptions[i - 1]})
          //         }
          //       }
          //
          //       let annualPayOptions = [{value: 'I am not sure'}]
          //       for (let i = 1; i <= response.data.workOptions[0].annualPayOptions.length; i++) {
          //         if (i > 1) {
          //           annualPayOptions.push({ value: response.data.workOptions[0].annualPayOptions[i - 1]})
          //         }
          //       }
          //
          //       let projectCategoryOptions = [{value: 'I am not sure'}]
          //       for (let i = 1; i <= response.data.workOptions[0].projectCategoryOptions.length; i++) {
          //         if (i > 1) {
          //           projectCategoryOptions.push({ value: response.data.workOptions[0].projectCategoryOptions[i - 1]})
          //         }
          //       }
          //
          //       this.setState({ functionOptions, industryOptions,
          //       workDistanceOptions, hoursPerWeekOptions, workTypeOptions, hourlyPayOptions, payOptions: annualPayOptions,
          //       projectCategoryOptions, dateOptions, collaboratorOptions, hourOptions })

            //   } else {
            //     console.log('no jobFamilies data found', response.data.message)
            //
            //     const functionOptions = [{value: 'Undecided'}]
            //     const industryOptions = [{value: 'Undecided'}]
            //     //const workDistanceOptions = [{value: '0 miles'},{value: '10 miles'}]
            //     const hoursPerWeekOptions = [{value: '~ 40 hours / week'}]
            //     //const workTypeOptions = [{value: 'Internship'}]
            //     //const hourlyPayOptions = [{value: 'Flexible'}]
            //     const payOptions = [{value: 'Flexible'}]
            //
            //     this.setState({ functionOptions, industryOptions, hoursPerWeekOptions, payOptions, dateOptions, collaboratorOptions, hourOptions })
            //
            //   }
            // }).catch((error) => {
            //     console.log('query for work options did not work', error);
            // })
          // } else if (selectedOpportunity.postType === 'Scholarship') {
          //
          //   this.setState({ selectedOpportunity })
          } else {
            console.log('spot check', selectedOpportunity.postType)
          }
        }
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formatDate(passedDate) {
    console.log('formatDate called', passedDate)

    if (!passedDate) {
      return null
    } else {
      const startDate = new Date(passedDate)
      const startMonth = startDate.getMonth()
      const startNumDay = startDate.getDate()
      const startYear = startDate.getFullYear()
      // let startHour = startDate.getHours()
      // let startMin = startDate.getMinutes()
      let startHour = Number(passedDate.substring(11,13))
      let startMin = Number(passedDate.substring(14,16))

      console.log('show startHour and startMin ', startHour, typeof startHour, startMin, typeof startMin )

      let calcMonth = (startMonth + 1).toString()
      if (startMonth + 1 < 10) {
        calcMonth = '0' + calcMonth
      }

      let suffix = 'AM'
      let calcHour = startHour
      if (startHour > 12) {
        calcHour = startHour - 12
        suffix = 'PM'
      } else if (startHour === 12) {
        suffix = 'PM'
      }

      let calcMin = ''
      if (startMin > 10) {
        calcMin = startMin.toString()
      } else {
        calcMin = '0' + startMin.toString()
      }

      const finalStartMonth = calcMonth
      const finalStartDay = startNumDay.toString()
      const finalStartYear = startYear.toString()
      const finalHour = calcHour.toString()
      const finalMin = calcMin
      const startDateString = finalStartMonth + "/" + finalStartDay + "/" + finalStartYear + " " + finalHour + ":" + finalMin + suffix

      passedDate = startDateString

      return passedDate
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

  voteOnItem(item, direction) {
    console.log('voteOnItem called', this.state.selectedOpportunity)

    let selectedOpportunity = this.state.selectedOpportunity
    const _id = selectedOpportunity._id
    const emailId = this.state.emailId
    let changeUpvote = true
    const updatedAt = new Date()

    Axios.post('https://www.guidedcompass.com/api/problems', { _id, emailId, changeUpvote, updatedAt })
    .then((response) => {

      if (response.data.success) {
        //save values
        console.log('Problem save worked', response.data);

        const serverSuccessMessage = 'Problem successfully posted!'


        // console.log('show work: ', selectedOpportunity)

        let upvotes = selectedOpportunity.upvotes
        let downvotes = selectedOpportunity.downvotes

        if (direction === 'up') {
          console.log('in up')

          if (upvotes.includes(this.state.emailId)) {
            const removeIndex = upvotes.indexOf(this.state.emailId)
            if (removeIndex > -1) {
              upvotes.splice(removeIndex, 1);
              selectedOpportunity['upvotes'] = upvotes
              this.setState({ selectedOpportunity, serverSuccessMessage })
            }
          } else {

            upvotes.push(this.state.emailId)

            if (downvotes.includes(this.state.emailId)) {
              const removeIndex = downvotes.indexOf(this.state.emailId)
              if (removeIndex > -1) {
                downvotes.splice(removeIndex, 1);
              }

              selectedOpportunity['upvotes'] = upvotes
              selectedOpportunity['downvotes'] = downvotes

              this.setState({ selectedOpportunity, serverSuccessMessage })
            } else {

              selectedOpportunity['upvotes'] = upvotes
              this.setState({ selectedOpportunity, serverSuccessMessage })
            }
          }

        } else {

          if (downvotes.includes(this.state.emailId)) {
            console.log('un-downvoting')
            const removeIndex = downvotes.indexOf(this.state.emailId)
            if (removeIndex > -1) {
              downvotes.splice(removeIndex, 1);
              selectedOpportunity['downvotes'] = downvotes
              this.setState({ selectedOpportunity, serverSuccessMessage })
            }
          } else {
            console.log('initial downvote')
            downvotes.push(this.state.emailId)

            if (upvotes.includes(this.state.emailId)) {
              console.log('downvoting from previous upvote')
              const removeIndex = upvotes.indexOf(this.state.emailId)
              if (removeIndex > -1) {
                upvotes.splice(removeIndex, 1);
              }

              selectedOpportunity['upvotes'] = upvotes
              selectedOpportunity['downvotes'] = downvotes

              this.setState({ selectedOpportunity, serverSuccessMessage })
            } else {
              selectedOpportunity['downvotes'] = downvotes
              this.setState({ selectedOpportunity, serverSuccessMessage })
            }
          }
        }

      } else {
        console.error('there was an error posting the talk / workshop');
        const serverErrorMessage = response.data.message
        this.setState({ serverErrorMessage })
      }
    }).catch((error) => {
        console.log('The talk post did not work', error);
    });
  }

  formChangeHandler(event) {
    console.log('formChangeHandler called')

    if (event.target.name === 'selectProject') {
      let selectedProject = {}
      let projectOptions = this.state.projectOptions
      for (let i = 1; i <= projectOptions.length; i++) {
        if (projectOptions[i - 1].name === event.target.value) {
          selectedProject = projectOptions[i - 1]
        }
      }
      this.setState({ selectedProject })
    } else {
      this.setState({ [event.target.name]: event.target.value })
    }
  }

  handleSubmit(postType, register) {
    console.log('handleSubmit in subcomponent ', postType, register)

    this.setState({ serverErrorMessage: '', serverSuccessMessage: '', errorMessage: null, disableSubmit: true })

    if (postType === 'Assignment' || postType === 'Problem' || postType === 'Challenge') {

      if (register) {
        // register for challenge

        if (!this.state.roleName || this.state.roleName === '') {
          this.setState({ errorMessage: 'Please add your role name', disableSubmit: false })
        } else if (!this.state.firstName || this.state.firstName === '') {
          this.setState({ errorMessage: 'Please add your first name', disableSubmit: false})
        } else if (!this.state.lastName || this.state.lastName === '') {
          this.setState({ errorMessage: 'Please add your last name', disableSubmit: false})
        } else if (!this.state.emailId || this.state.emailId === '') {
          this.setState({ errorMessage: 'Please add your email', disableSubmit: false})
        } else if (!this.state.emailId.includes('@')) {
          this.setState({ errorMessage: 'Please add a valid email', disableSubmit: false})
        } else {

          const postingId = this.state.selectedOpportunity._id
          const postingTitle = this.state.selectedOpportunity.name
          const postType = this.state.selectedOpportunity.postType

          let firstName = this.state.firstName
          let lastName = this.state.lastName
          let email = this.state.emailId
          const password = this.state.password
          const schoolName = this.state.school
          let jobTitle = this.state.jobTitle
          let employerName = this.state.employerName

          const orgCode = this.state.activeOrg
          const accountCode = 'N/A'
          let roleName = "Student"
          // if (this.state.roleName) {
          //   roleName = 'Student'
          // }
          const otherRoleName = this.state.otherRoleName

          const createdAt = new Date()
          const updatedAt = new Date()

          let existingUser = true
          if (this.state.password) {
            existingUser = false
          }

          const collaborators = this.state.selectedOpportunity.collaborators

          //stuff for email notification
          const orgName = this.state.selectedOpportunity.orgName
          const orgContactFirstName = this.state.selectedOpportunity.orgContactFirstName
          const orgContactLastName = this.state.selectedOpportunity.orgContactLastName
          const orgContactEmail = this.state.selectedOpportunity.orgContactEmail

          Axios.post('https://www.guidedcompass.com/api/rsvp', {
            postingId, postingTitle, postType, firstName, lastName, email, password, schoolName, jobTitle, employerName, orgCode,
            accountCode, roleName, otherRoleName, createdAt, updatedAt, existingUser, collaborators,
            orgName, orgContactFirstName, orgContactLastName, orgContactEmail })
          .then((response) => {

            if (response.data.success) {
              //save values
              console.log('Reserve worked', response.data);

              const message = 'You have successfully registered'
              this.setState({ serverPostSuccess: true, serverSuccessMessage: message, successMessage: message, disableSubmit: false, hasRegistered: true })

            } else {
              console.error('there was an error posting the wbl opportunity');
              const message = response.data.message
              this.setState({ serverPostSuccess: false, serverErrorMessage: message, errorMessage: message, disableSubmit: false
              })
            }
          }).catch((error) => {
              console.log('The postings post did not work', error);
              this.setState({ serverPostSuccess: false, serverErrorMessage: error, disableSubmit: false })
          });
        }

      } else {
        if (this.state.subviewIndex === 1 && !this.state.selectedProject.name) {
          //select a project
          this.setState({ serverErrorMessage: 'please add a project to submit', disableSubmit: false })
        } else if (this.state.subviewIndex === 1) {

          if (this.state.workMode) {
            if (!this.state.selectedProject.metrics) {
              this.setState({ serverErrorMessage: 'Please add metrics before submitting', disableSubmit: false })
              return
            } else if (!this.state.selectedProject.metrics.values) {
              this.setState({ serverErrorMessage: 'Please add metrics before submitting', disableSubmit: false })
              return
            } else if (!this.state.selectedProject.metrics.values.posts) {
              this.setState({ serverErrorMessage: 'Please add metrics before submitting', disableSubmit: false })
              return
            } else if (this.state.selectedProject.metrics.values.posts.length === 0) {
              this.setState({ serverErrorMessage: 'Please add metrics before submitting', disableSubmit: false })
              return
            }
          }

          //submit the selected project
          const emailId = this.state.emailId
          const cuFirstName = this.state.cuFirstName
          const cuLastName = this.state.cuLastName
          const contributorFirstName = this.state.selectedOpportunity.contributorFirstName
          const contributorLastName = this.state.selectedOpportunity.contributorLastName
          const contributorEmail = this.state.selectedOpportunity.contributorEmail
          const announcementDate = this.state.selectedOpportunity.announcementDate
          const postingId = this.state.selectedOpportunity._id
          const postingName = this.state.selectedOpportunity.name
          const projectId = this.state.selectedProject._id
          const projectName = this.state.selectedProject.name
          const postType = this.state.selectedOpportunity.postType
          const orgContactEmail = this.state.orgContactEmail

          let orgName = this.state.selectedOpportunity.orgName
          if (this.state.postingOrgName) {
            orgName = this.state.postingOrgName
          }

          const orgCode = this.state.activeOrg
          const url = this.state.selectedProject.url
          const category = this.state.selectedProject.category
          const description = this.state.selectedProject.description
          const startDate = this.state.selectedProject.startDate
          const endDate = this.state.selectedProject.endDate
          const collaborators = this.state.selectedProject.collaborators
          const collaboratorCount = this.state.selectedProject.collaboratorCount
          const hours = this.state.selectedProject.hours

          const isContinual = this.state.isContinual
          const totalHours = this.state.projectTotalHours
          const focus = this.state.projectFocus

          const departments = this.state.selectedOpportunity.departments

          //save submission
          Axios.post('https://www.guidedcompass.com/api/projects/submit', {
            emailId, cuFirstName, cuLastName, contributorFirstName, contributorLastName, contributorEmail,
            postingId, postingName, projectId, projectName, orgContactEmail, orgName, announcementDate, postType,
            orgCode, url, category, description, startDate, endDate, collaborators, collaboratorCount, hours,
            isContinual, totalHours, focus, departments
          })
          .then((response) => {

            if (response.data.success) {
              //save values
              console.log('Project save worked ', response.data);
              //report whether values were successfully saved

              let selectedOpportunity = this.state.selectedOpportunity
              let submissions = this.state.selectedOpportunity.submissions
              if (this.state.submitted) {
                const index = submissions.findIndex(submission => submission.userEmail === emailId )
                submissions[index] = { projectId, name: projectName, url, category, description, startDate, endDate, collaborators,
                  collaboratorCount, hours, userEmail: this.state.emailId, userFirstName: cuFirstName, userLastName: cuLastName,
                  orgCode, grades: [], upvotes: [], downvotes: [], createdAt: new Date(), updatedAt: new Date()
                }
              } else {
                submissions.push({ projectId, name: projectName, url, category, description, startDate, endDate, collaborators,
                  collaboratorCount, hours, userEmail: this.state.emailId, userFirstName: cuFirstName, userLastName: cuLastName,
                  orgCode, grades: [], upvotes: [], downvotes: [], createdAt: new Date(), updatedAt: new Date()
                })
              }

              selectedOpportunity['submissions'] = submissions

              // this.state.selectedOpportunity.submissions

              this.setState({ serverSuccessMessage: 'Project submitted successfully!', submitted: true,
                disableSubmit: false, selectedOpportunity })

            } else {
              console.log('project did not save successfully')
              this.setState({ serverErrorMessage: response.data.message, disableSubmit: false })
            }

          }).catch((error) => {
              console.log('Project save did not work', error);
              this.setState({ serverErrorMessage: error, disableSubmit: false })
          });

        } else if (this.state.subviewIndex === 0) {

          //save project first
          if (!this.state.projectTitle || this.state.projectTitle === '') {
            this.setState({ serverErrorMessage: 'please add a project title', disableSubmit: false})
          } else if (!this.state.projectURL || this.state.projectURL === '') {
            this.setState({ serverErrorMessage: 'please add a url / web link for this project', disableSubmit: false})
          } else if (!this.state.projectURL.includes("http")) {
            this.setState({ serverErrorMessage: 'please add a valid url', disableSubmit: false})
          } else if (!this.state.projectCategory || this.state.projectCategory === '') {
            this.setState({ serverErrorMessage: 'please add a category for this project', disableSubmit: false})
          } else if (!this.state.startDate || this.state.startDate === '') {
            this.setState({ serverErrorMessage: 'please indicate when you started working on this project', disableSubmit: false})
          } else if (!this.state.isContinual && this.state.endDate !== '') {
            this.setState({ serverErrorMessage: 'please indicate when you stopped working on this project', disableSubmit: false})
          } else if (!this.state.projectHours || this.state.projectHours === '') {
            this.setState({ serverErrorMessage: 'please add the number of hours you worked on this project', disableSubmit: false})
          } else {
            //
            // if (this.state.collaboratorCount > 0) {
            //   for (let i = 1; i <= this.state.collaboratorCount; i++) {
            //     if (this.state.collaborators[i - 1]) {
            //       if (this.state.collaborators[i - 1] === '') {
            //         return this.setState({ serverErrorMessage: 'please add collaborator emails for each collaborator', disableSubmit: false })
            //       }
            //     } else {
            //       return this.setState({ serverErrorMessage: 'please add collaborator emails for each collaborator', disableSubmit: false })
            //     }
            //   }
            // }

            const emailId = this.state.emailId
            const userFirstName = this.state.cuFirstName
            const userLastName = this.state.cuLastName

            const name = this.state.projectTitle
            const url = this.state.projectURL
            const category = this.state.projectCategory
            const description = this.state.projectDescription
            const startDate = this.state.startDate
            const endDate = this.state.endDate
            const collaborators = this.state.collaborators
            const collaboratorCount = this.state.collaboratorCount
            const hours = this.state.projectHours
            const skillTags = this.state.skillTags
            const jobFunction = this.state.projectFunction
            const industry = this.state.projectIndustry

            const isContinual = this.state.isContinual
            const totalHours = this.state.projectTotalHours
            const focus = this.state.projectFocus

            const orgCode = this.state.activeOrg

            const createdAt = new Date()
            const updatedAt = new Date()

            Axios.post('https://www.guidedcompass.com/api/projects', {
              emailId, userFirstName, userLastName, name, url, category, description, startDate, endDate, collaborators, collaboratorCount,
              isContinual, totalHours, focus,
              hours, skillTags, jobFunction, industry, orgCode, createdAt, updatedAt
            })
            .then((response) => {

              if (response.data.success) {
                //save values
                console.log('Project save worked ', response.data);
                //report whether values were successfully saved

                // this.setState({ serverSuccessMessage: 'Projects saved successfully!', disableSubmit: false })

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
                const url = this.state.projectURL
                const category = this.state.projectCategory
                const description = this.state.projectDescription
                const startDate = this.state.startDate
                const endDate = this.state.endDate
                const collaborators = this.state.collaborators
                const collaboratorCount = this.state.collaboratorCount
                const hours = this.state.projectHours

                //save submission
                Axios.post('https://www.guidedcompass.com/api/projects/submit', {
                  emailId, cuFirstName, cuLastName, contributorFirstName, contributorLastName, contributorEmail,
                  postingId, postingName, projectId, projectName, orgContactEmail, totalHours, focus,
                  orgCode, url, category, description, startDate, endDate, collaborators, collaboratorCount, hours
                })
                .then((response) => {

                  if (response.data.success) {
                    //save values
                    console.log('Project submit worked here ', response.data);
                    //report whether values were successfully saved

                    let selectedOpportunity = this.state.selectedOpportunity
                    let submissions = this.state.selectedOpportunity.submissions

                    if (this.state.submitted) {
                      const index = submissions.findIndex(submission => submission.userEmail === emailId )
                      submissions[index] = { projectId, name: projectName, url, category, description, startDate, endDate, collaborators,
                        collaboratorCount, hours, userEmail: this.state.emailId, userFirstName: cuFirstName, userLastName: cuLastName,
                        orgCode, grades: [], upvotes: [], downvotes: [], createdAt: new Date(), updatedAt: new Date()
                      }
                    } else {
                      submissions.push({ projectId, name: projectName, url, category, description, startDate, endDate, collaborators,
                        collaboratorCount, hours, userEmail: this.state.emailId, userFirstName: cuFirstName, userLastName: cuLastName,
                        orgCode, grades: [], upvotes: [], downvotes: [], createdAt: new Date(), updatedAt: new Date()
                      })
                    }

                    selectedOpportunity['submissions'] = submissions

                    this.setState({ serverSuccessMessage: 'Project submitted successfully!',
                      submitted: true, disableSubmit: false, selectedOpportunity,

                      projectTitle: '', projectURL: '',
                      projectCategory: '', projectDescription: '', startDate: '', endDate: '', collaborators: [],
                      collaboratorCount: undefined, projectHours: '', skillTags: '',
                      isContinual: undefined, totalHours: '', focus: '', projectFunction: '', projectIndustry: ''

                    })

                  } else {
                    console.log('project did not save successfully')
                    this.setState({ serverErrorMessage: response.data.message, disableSubmit: false })
                  }

                }).catch((error) => {
                    console.log('Project save did not work', error);
                    this.setState({ serverErrorMessage: error, disableSubmit: false })
                });

              } else {
                console.log('project did not save successfully')
                this.setState({ serverErrorMessage: response.data.message, disableSubmit: false })
              }

            }).catch((error) => {
                console.log('Project save did not work', error);
                this.setState({ serverErrorMessage: error, disableSubmit: false })
            });
          }
        }
      }

    } else if (postType === 'Event') {

      const postingId = this.state.selectedOpportunity._id
      const postingTitle = this.state.selectedOpportunity.title

      let questions = []
      let firstName = this.state.cuFirstName
      let lastName = this.state.cuLastName
      let email = this.state.emailId
      const schoolName = this.state.school
      let jobTitle = 'N/A'
      let employerName = 'N/A'

      const orgCode = this.state.activeOrg
      const accountCode = 'N/A'
      let roleName = "Student"
      // if (window.location.pathname.includes('/app')) {
      //   roleName = 'Student'
      // }

      const createdAt = new Date()
      const updatedAt = new Date()

      const existingUser = true

      //stuff for email notification
      const orgName = this.state.selectedOpportunity.orgName
      const orgContactFirstName = this.state.selectedOpportunity.orgContactFirstName
      const orgContactLastName = this.state.selectedOpportunity.orgContactLastName
      const orgContactEmail = this.state.selectedOpportunity.orgContactEmail
      const location = this.state.selectedOpportunity.location
      const startDate = this.state.startDateString
      const endDate = this.state.endDateString

      Axios.post('https://www.guidedcompass.com/api/rsvp', {
        postingId, postingTitle, questions, firstName, lastName, email, schoolName, jobTitle, employerName, orgCode,
        accountCode, roleName, createdAt, updatedAt, existingUser,
        orgName, orgContactFirstName, orgContactLastName, orgContactEmail, location, startDate, endDate })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Reserve worked', response.data);
          this.setState({ serverPostSuccess: true, serverSuccessMessage: 'You have successfully reserved your spot!', disableSubmit: false, alreadyRSVPd: true })

        } else {
          console.error('there was an error posting the wbl opportunity');
          this.setState({
            serverPostSuccess: false,
            serverErrorMessage: response.data.message, alreadyRSVPd: true, disableSubmit: false
          })
        }
      }).catch((error) => {
          console.log('The postings post did not work', error);
          this.setState({ serverPostSuccess: false, serverErrorMessage: error, disableSubmit: false })
      });
    }
  }

  finishedSubmitting = (selectedProject) => {
    console.log('finishedSubmitting called', selectedProject)

    let selectedOpportunity = this.state.selectedOpportunity
    let submissions = this.state.selectedOpportunity.submissions

    if (this.state.submitted) {
      const index = submissions.findIndex(selectedProject => selectedProject.userEmail === this.state.emailId )
      submissions[index] = selectedProject
    } else {
      submissions.push(selectedProject)
    }

    selectedOpportunity['submissions'] = submissions

    this.setState({ serverSuccessMessage: 'Project submitted successfully!',
      submitted: true, disableSubmit: false, selectedOpportunity,

      projectTitle: '', projectURL: '',
      projectCategory: '', projectDescription: '', startDate: '', endDate: '', collaborators: [],
      collaboratorCount: undefined, projectHours: '', skillTags: '',
      isContinual: undefined, totalHours: '', focus: '', projectFunction: '', projectIndustry: ''

    })
  }

  renderDetails(type) {
    console.log('renderDetails ', type)

    let rows = []

    let items = []

    if (type === 'section') {
      if (this.state.selectedOpportunity.sections) {
        items = this.state.selectedOpportunity.sections
      }
    } else if (type === 'exhibit') {
      if (this.state.selectedOpportunity.exhibits) {
        items = this.state.selectedOpportunity.exhibits
      }
    }

    const alphabet = 'abcdefghijklmnopqrstuvwxyz'

    for (let i = 1; i <= items.length; i++) {

      const index = i - 1

      rows.push(
        <View key={type + i}>
          {type === 'section' && (
            <View>
              <Text className="heading-text-4">{items[index].title}</Text>
              <Text className="description-text-1">{items[index].body}</Text>
            </View>
          )}
          {type === 'exhibit' && (
            <View className="bottom-padding">
              <Text className="heading-text-4">Exhibit {alphabet[index].toUpperCase()}</Text>
              {(items[index].link && items[index].link !== '') && (
                <TouchableOpacity onPress={() => Linking.openURL(items[index].link)}>{items[index].link}</TouchableOpacity>
              )}
            </View>
          )}
        </View>
      )
    }

    return rows

  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  renderSkills() {
    console.log('renderSkills called')

    let rows = []

    if (this.state.benchmark) {
      if (this.state.benchmark.skills) {
        for (let i = 1; i <= this.state.benchmark.skills.length; i++) {
          console.log('skills ', i)

          const rowKey = "skills" + i.toString()

          let rawSkillWeight = this.state.benchmark.skills[i - 1].weight * 50
          if (rawSkillWeight > 100) {
            rawSkillWeight = 100
          }
          const skillWeight = rawSkillWeight.toString() + '%'

          let borderClass = "primary-border"
          let backgroundClass = "primary-background"
          if (this.state.benchmark.skills[i - 1].skillType === 'Soft Skill') {
            borderClass = "secondary-border"
            backgroundClass = "secondary-background"
          }

          rows.push(
            <View key={rowKey}>
              <View className="relative-column-30" >
                <Text className="description-text-2">{this.state.benchmark.skills[i - 1].title} ({this.state.benchmark.skills[i - 1].skillType})</Text>
              </View>
              <View className="relative-column-70" >
                <View className="half-spacer"/>

                <View className={"progress-bar " + borderClass}>
                  <View className={"filler " + backgroundClass} style={{ width: skillWeight }} />
                </View>
              </View>
              <View className="clear" />
              <View className="spacer"/>
            </View>
          )
        }
      }
    }

    return rows
  }

  renderInterests() {
    console.log('renderInterests called')

    let rows = []

    if (this.state.benchmark) {
      if (this.state.benchmark.interests) {
        for (let i = 1; i <= this.state.benchmark.interests.length; i++) {
          console.log('interests ', i)

          const rowKey = "interests" + i.toString()
          const interestScore = (this.state.benchmark.interests[i - 1].score * 20).toString() + '%'

          rows.push(
            <View key={rowKey}>
              <View className="relative-column-30" >
                <Text className="description-text-2">{this.state.benchmark.interests[i - 1].title}</Text>
              </View>
              <View className="relative-column-70" >
                <View className="half-spacer"/>
                <View className={"progress-bar tertiary-border"}>
                  <View className={"filler tertiary-background"} style={{ width: interestScore }} />
                </View>
              </View>
              <View className="clear" />
              <View className="spacer"/>
            </View>
          )
        }
      }
    }

    return rows
  }

  renderTraits() {
    console.log('renderTraits called')

    let rows = []

    if (this.state.benchmark) {
      if (this.state.benchmark.traits) {
        for (let i = 1; i <= this.state.benchmark.traits.length; i++) {
          console.log('traits ', i)

          const rowKey = "traits" + i.toString()
          const traitScore = (this.state.benchmark.traits[i - 1].score * 20).toString() + '%'

          rows.push(
            <View key={rowKey}>
              <View className="relative-column-30" >
                <Text className="description-text-2">{this.state.benchmark.traits[i - 1].title}</Text>
              </View>
              <View className="relative-column-70" >
                <View className="half-spacer"/>
                <View className={"progress-bar quaternary-border"}>
                  <View className={"filler quaternary-background"} style={{ width: traitScore }} />
                </View>
              </View>
              <View className="clear" />
              <View className="spacer"/>
            </View>
          )
        }
      }
    }

    return rows
  }

  renderTracks() {
    console.log('renderTracks called')

    let rows = []

    if (this.state.selectedOpportunity.tracks) {
      for (let i = 1; i <= this.state.selectedOpportunity.tracks.length; i++) {
        console.log('tracks ', i)

        const rowKey = "tracks" + i.toString()

        rows.push(
          <View key={rowKey}>
            <TouchableOpacity onPress={() => this.props.navigation.navigate('TrackPostings', { programTitle: this.state.selectedOpportunity.title, trackName:this.state.selectedOpportunity.tracks[i - 1].name, orgName: this.state.selectedOpportunity.orgName, postings: this.state.selectedOpportunity.tracks[i - 1].jobs })}>
              <View className="relative-column-80">
               <Text className="heading-text-5">{this.state.selectedOpportunity.tracks[i - 1].name}</Text>
                <Text>{this.state.selectedOpportunity.tracks[i - 1].jobs.length} Internship Postings</Text>
              </View>
            </TouchableOpacity>
            <View className="clear" />
            <View className="spacer"/><View className="half-spacer"/>
          </View>
        )
      }
    }

    return rows
  }

  itemClicked(value, type) {
    console.log('itemClicked', value, type)

    if (type === 'roleName') {
      let roleName = value
      this.setState({ roleName })
    }
  }

  renderCollaborators() {
    console.log('renderCollaborators called')

    let rows = []
    let collaborators = this.state.selectedOpportunity.collaborators
    if (collaborators) {
      for (let i = 1; i <= collaborators.length; i++) {

        const index = i - 1

        rows.push(
          <View key={"collaborator" + i.toString()}>
            <View className="spacer" /><View className="half-spacer" />

            <View className="fixed-column-50">
              <Image source={collaborators[i - 1].pictureURL ? { uri: collaborators[i - 1].pictureURL} : { uri: profileIconBig}} className="profile-thumbnail-2"/>
            </View>
            <View className="calc-column-offset-100 left-padding">
              <Text>{collaborators[i - 1].firstName} {collaborators[i - 1].lastName} ({collaborators[i - 1].email})</Text>
              <View className="half-spacer" />
              {(collaborators[i - 1].joined) ? (
                <Text className="description-text-2">{collaborators[i - 1].roleName}</Text>
              ) : (
                <Text className="description-text-2">(This user has not joined Guided Compass)</Text>
              )}
            </View>
            <View className="fixed-column-50">
              <View className="spacer" />
              <TouchableOpacity onPress={() => this.removeItem(index)}>
                <Image source={{ uri: xIcon}} className="image-auto-20"/>
              </TouchableOpacity>
            </View>
            <View className="clear" />
          </View>
        )
      }
    }

    return rows
  }

  removeItem(index) {
    console.log('removeItem called', index)

    // collaborators
    let selectedOpportunity = this.state.selectedOpportunity
    let collaborators = this.state.selectedOpportunity.collaborators
    collaborators.splice(index, 1)
    selectedOpportunity['collaborators'] = collaborators
    this.setState({ selectedOpportunity })

  }

  inviteCollaborators() {
    console.log('inviteCollaborators called')

    if (this.state.collaboratorEmail && this.state.collaboratorEmail !== '') {

      this.setState({ collaboratorErrorMessage: null })

      if (!this.state.collaboratorEmail.includes('@')) {
        this.setState({ collaboratorErrorMessage: 'Please add a valid email' })
      } else {
        //check if user is on GC

        const email = this.state.collaboratorEmail
        let collaboratorEmail = ''

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

                let collaborators = this.state.selectedOpportunity.collaborators
                if (collaborators) {
                  collaborators.push({ pictureURL, firstName, lastName, email, roleName, joined: true })
                } else {
                  collaborators = [{ pictureURL, firstName, lastName, email, roleName, joined: true }]
                }

                let selectedOpportunity = this.state.selectedOpportunity
                selectedOpportunity['collaborators'] = collaborators

                this.setState({ selectedOpportunity, collaboratorEmail })

              } else {
                //api call was unsuccessful. responseData was defined though.
                let collaborators = this.state.selectedOpportunity.collaborators
                if (collaborators) {
                  collaborators.push({ pictureURL: '', firstName: 'Collaborator', lastName: '#' + collaborators.length, email, roleName: 'Student', joined: false })
                } else {
                  collaborators = [{ pictureURL: '', firstName: 'Collaborator', lastName: '#1', email, roleName: 'Student', joined: false }]
                }

                let selectedOpportunity = this.state.selectedOpportunity
                selectedOpportunity['collaborators'] = collaborators

                this.setState({ selectedOpportunity, collaboratorEmail })
              }
            } else {

              //api call was unsuccessful. responseData wasn't even defined.
              let collaborators = this.state.selectedOpportunity.collaborators
              if (collaborators) {
                collaborators.push({ pictureURL: '', firstName: 'Collaborator', lastName: '#' + (collaborators.length + 1), email, roleName: 'Student', joined: false })
              } else {
                collaborators = [{ pictureURL: '', firstName: 'Collaborator', lastName: '#1', email, roleName: 'Student', joined: false }]
              }

              let selectedOpportunity = this.state.selectedOpportunity
              selectedOpportunity['collaborators'] = collaborators

              this.setState({ selectedOpportunity, collaboratorEmail })
            }
        })
      }
    }
  }

  render() {

    let difficultyIcon = easyIcon
    if (this.state.selectedOpportunity) {
      if (this.state.selectedOpportunity.difficultyLevel === 'Medium') {
        difficultyIcon = mediumIcon
      } else if (this.state.selectedOpportunity.difficultyLevel === 'Hard' || this.state.selectedOpportunity.difficultyLevel === 'Very Hard') {
        difficultyIcon = hardIcon
      }
    }

    return (
        <View>

          <View>

            {(this.state.selectedOpportunity) && (
              <View>
                <View className="spacer"/><View className="spacer"/><View className="spacer"/>

                {(this.state.selectedOpportunity.postType === 'Internship' || this.state.selectedOpportunity.postType === 'Individual' || this.state.selectedOpportunity.postType === 'Track' || this.state.selectedOpportunity.postType === 'Work') && (
                  <View>

                    <View>
                      <View className="flex-container">
                        <View className="flex-10">
                          {(this.state.selectedOpportunity.imageURL) && (
                            <View className="top-padding-15">
                              <Image source={{ uri: this.state.selectedOpportunity.imageURL}} className="image-100-fit"/>
                            </View>
                          )}
                        </View>
                        <View className="flex-80">
                          {(this.state.selectedOpportunity.postType === 'Track' || this.state.selectedOpportunity.subPostType === 'Track') ? (
                            <Text style={[styles.headingText2]}>{this.state.selectedOpportunity.title}</Text>
                          ) : (
                            <Text style={[styles.headingText2]}>{this.state.selectedOpportunity.title} @ {this.state.selectedOpportunity.employerName}</Text>
                          )}
                        </View>
                        <View className="flex-10 right-text">
                          <TouchableOpacity onPress={() => this.favoriteItem(this.state.selectedOpportunity) }>
                            <Image source={(this.state.favorites.includes(this.state.selectedOpportunity._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} className="image-auto-20"/>
                          </TouchableOpacity>
                        </View>
                        <View className="clear" />
                      </View>

                      {this.state.hasApplied ? (
                        <View className="horizontal-padding-3">
                          <View className="half-spacer"/>
                          <Text className="error-color center-text bold-text">***You have already applied to this posting. If the recipient is interested, they will contact you. Look for updates via email. You can update your application at any time by resubmitting. If you have any technical questions, email creighton@guidedcompass.com.***</Text>
                          <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
                        </View>
                      ) : (
                        <View>
                          {(this.state.selectedOpportunity.orgName === 'Bixel Exchange' || this.state.selectedOpportunity.orgName === 'LA Promise Fund' || this.state.selectedOpportunity.orgCode === 'unite-la') && (
                            <View>
                              {(this.state.selectedOpportunity.postType === 'Track' || this.state.selectedOpportunity.subPostType === 'Track') ? (
                                <View>
                                  <Text className="center-text cta-color bold-color">***This is a common application. You must apply to this to apply to any roles attached to this program.***</Text>
                                  <View className="spacer"/><View className="spacer"/>
                                </View>
                              ) : (
                                <View>
                                  {(!this.state.isApproved && this.state.pageSource !== 'landingPage' && this.state.selectedOpportunity.isChild) && (
                                    <View>
                                      <Text className="error-color center-text bold-text">***This can only be applied to after you have been approved to this track attached to the {(this.state.parentPost) ? <TouchableOpacity className="secondary-link cta-color clear-border" onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: this.state.parentPost })}>{this.state.selectedOpportunity.orgName} posting</TouchableOpacity> : this.state.selectedOpportunity.orgName + " posting"}. Apply then await approval from their team administrator.***</Text>
                                      <View className="spacer"/><View className="spacer"/>
                                    </View>
                                  )}
                                </View>
                              )}
                            </View>
                          )}
                        </View>
                      )}

                      <View className="spacer"/><View className="spacer"/>

                      <View>
                        <View className="name-container">
                          <View className="left-padding-5 right-padding-5">
                            <Text className="heading-text-3">Basic Info</Text>
                            <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
                          </View>

                          <View className="edit-profile-row">
                            <View className="float-left right-margin">
                              <View className="mini-spacer" /><View className="mini-spacer" />
                              <Image source={{ uri: industryIconDark}} className="image-auto-23" />
                            </View>
                            <View className="float-left">
                              <Text>{this.state.selectedOpportunity.employerName}</Text>
                              <TouchableOpacity onPress={() => Linking.openURL(this.state.selectedOpportunity.employerURL)}><Text>{this.state.selectedOpportunity.employerURL}</Text></TouchableOpacity>
                            </View>
                            <View className="clear" />
                          </View>

                          <View className="edit-profile-row">
                            <View className="float-left right-margin">
                              <View className="mini-spacer" /><View className="mini-spacer" />
                              <Image source={{ uri: locationIcon}} className="image-auto-23 right-margin-5" />
                            </View>
                            <View className="float-left">
                              <Text>{this.state.selectedOpportunity.location}{(this.state.selectedOpportunity.location && this.state.selectedOpportunity.zipcode) && this.state.selectedOpportunity.zipcode}</Text>
                            </View>
                            <View className="clear" />
                          </View>

                          {(this.state.selectedOpportunity.createdAt && this.state.selectedOpportunity.createdAt !== '') && (
                            <View className="edit-profile-row">
                              <View>
                                <View className="float-left right-margin">
                                  <View className="mini-spacer" /><View className="mini-spacer" />
                                  <Image source={{ uri: calendarIconDark}} className="image-auto-23" />
                                </View>

                                <View className="float-left">
                                  <Text>Posted on {convertDateToString(this.state.selectedOpportunity.createdAt,'date')}</Text>
                                </View>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                          {(this.state.selectedOpportunity.startDate && this.state.selectedOpportunity.startDate !== '') && (
                            <View className="edit-profile-row">
                              <View>
                                <View className="float-left right-margin">
                                  <View className="mini-spacer" /><View className="mini-spacer" />
                                  <Image source={{ uri: timeRangeIcon}} className="image-auto-23" />
                                </View>

                                <View className="float-left">
                                  <Text>{convertDateToString(this.state.selectedOpportunity.startDate,"date")} - {this.state.selectedOpportunity.isPerpetual ? "Continual" : convertDateToString(this.state.selectedOpportunity.endDate,"date")}</Text>
                                </View>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                          {(this.state.activeOrg !== 'exp') && (
                            <View className="edit-profile-row">
                              <View className="fixed-column-33 right-padding">
                                <View className="mini-spacer" /><View className="mini-spacer" />
                                <Image source={{ uri: timeIconDark}} className="image-auto-23" />
                              </View>
                              <View className="calc-column-offset-43">
                                <Text>{this.state.selectedOpportunity.hoursPerWeek} Per Week</Text>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                          {(this.state.workFunction) && (
                            <View className="edit-profile-row">
                              <View>
                                <View className="fixed-column-33 right-padding" >
                                  <View className="mini-spacer" /><View className="mini-spacer" />
                                  <Image source={{ uri: skillsIcon}} className="image-auto-23" />
                                </View>
                                <View className="calc-column-offset-33">
                                  <Text>{this.state.workFunction}</Text>
                                </View>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                          {(this.state.industry) && (
                            <View className="edit-profile-row">
                              <View>
                                <View className="fixed-column-33 right-padding" >
                                  <View className="mini-spacer" /><View className="mini-spacer" />
                                  <Image source={{ uri: industryIconDark}} className="image-auto-23" />
                                </View>
                                <View className="calc-column-offset-33">
                                  <Text>{this.state.industry}</Text>
                                </View>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                          {(this.state.selectedOpportunity.isSubsidized || this.state.selectedOpportunity.prioritizeSubsidized) && (
                            <View className="edit-profile-row">
                              <View>
                                <View className="fixed-column-33 right-padding" >
                                  <View className="mini-spacer" /><View className="mini-spacer" />
                                  <Image source={{ uri: subsidyIconDark}} className="image-auto-23" />
                                </View>
                                <View className="calc-column-offset-33">
                                  <Text>This role is subsidized</Text>
                                  <Text className="description-text-2">***Only people 16 - 24 within Los Angeles county limits are eligible to receive subsidized internships***</Text>
                                </View>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                          {(this.state.selectedOpportunity.workType) && (
                            <View className="edit-profile-row">
                              <View>
                                <View className="fixed-column-33 right-padding" >
                                  <View className="mini-spacer" /><View className="mini-spacer" />
                                  <Image source={{ uri: skillsIcon}} className="image-auto-23" />
                                </View>
                                <View className="calc-column-offset-33">
                                  <Text>{this.state.selectedOpportunity.workType}</Text>
                                </View>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                          {(this.state.selectedOpportunity.payRange && this.state.selectedOpportunity.payRange !== '') && (
                            <View className="edit-profile-row">
                              <View>
                                <View className="fixed-column-33 right-padding" >
                                  <View className="mini-spacer" /><View className="mini-spacer" />
                                  <Image source={{ uri: moneyIconDark}} className="image-auto-23" />
                                </View>
                                <View className="calc-column-offset-33">
                                  <Text>{this.state.selectedOpportunity.payRange}</Text>
                                </View>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                          {(this.state.selectedOpportunity.supplementalPayArray && this.state.selectedOpportunity.supplementalPayArray.length > 0) && (
                            <View className="edit-profile-row">
                              <View>
                                <View className="fixed-column-33 right-padding" >
                                  <View className="mini-spacer" /><View className="mini-spacer" />
                                  <Image source={{ uri: tagIcon}} className="image-auto-23" />
                                </View>
                                <View className="calc-column-offset-33">
                                  <Text>{this.state.selectedOpportunity.supplementalPayArray.toString()}</Text>
                                </View>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                          {(this.state.selectedOpportunity.benefits && this.state.selectedOpportunity.benefits.length > 0) && (
                            <View className="edit-profile-row">
                              <View>
                                <View className="fixed-column-33 right-padding" >
                                  <View className="mini-spacer" /><View className="mini-spacer" />
                                  <Image source={{ uri: tagIcon}} className="image-auto-23" />
                                </View>
                                <View className="calc-column-offset-33">
                                  <Text>{this.state.selectedOpportunity.benefits.toString()}</Text>
                                </View>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                        </View>

                        {(this.state.selectedOpportunity.postType !== 'Track' && this.state.selectedOpportunity.subPostType !== 'Track') && (
                          <View>

                            <View className="name-container">
                              {(!this.state.selectedOpportunity.direct) && (
                                <View>
                                  <View className="left-padding-5 right-padding-5">
                                    <Text className="heading-text-3">Application Instructions</Text>
                                    <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
                                  </View>

                                  <View>

                                    {(this.state.selectedOpportunity.applicationMethod === "Applicants may be referred, but they must also apply via email") && (
                                      <View>

                                        <View>
                                          <View className="fixed-column-33 right-padding">
                                            <View className="spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                                            <Image source={{ uri: sendIcon}} className="image-auto-23" />
                                          </View>
                                          <View className="calc-column-offset-33">
                                            <Text className="heading-text-4">Apply via Email</Text>
                                            <Text><Text className="half-bold-text">Address to:</Text> {this.state.selectedOpportunity.employerContactFirstName} {this.state.selectedOpportunity.employerContactLastName}</Text>
                                            <Text><Text className="half-bold-text">Email:</Text> {this.state.selectedOpportunity.employerContactEmail}</Text>
                                            <Text><Text className="half-bold-text">Subject Line:</Text> {this.state.selectedOpportunity.subjectLine}</Text>
                                            {(this.state.selectedOpportunity.appRequirements && this.state.selectedOpportunity.appRequirements !== '') && (
                                              <View>
                                                <Text><Text className="half-bold-text">Please include:</Text> {this.state.selectedOpportunity.appRequirements}</Text>
                                              </View>
                                            )}
                                            {(this.state.selectedOpportunity.submissionDeadline && this.state.selectedOpportunity.submissionDeadline !== '') && (
                                              <View>
                                                <Text><Text className="half-bold-text">Deadline:</Text> {convertDateToString(this.state.selectedOpportunity.submissionDeadline,"date")}</Text>
                                              </View>
                                            )}
                                          </View>
                                        </View>

                                        <View className="clear" />
                                        <View className="spacer"/><View className="spacer"/>

                                        <View>
                                          <Text>AND</Text>
                                        </View>

                                      </View>
                                    )}

                                    {(this.state.selectedOpportunity.applicationMethod === "Applicants may be referred, but they must also submit to our posting" || this.state.selectedOpportunity.applicationMethod === "Applicants may be referred, but they must also apply via our website posting") && (
                                      <View>
                                        <View>
                                          <View className="spacer"/>
                                          <View>
                                            <View className="fixed-column-33 right-padding">
                                              <View className="half-spacer" />
                                              <Image source={{ uri: linkIcon}} className="image-auto-23" />
                                            </View>
                                            <View className="calc-column-offset-33">
                                              <Text className="heading-text-4">Apply via Website</Text>
                                              <TouchableOpacity onPress={() => Linking.openURL(this.state.selectedOpportunity.jobLink)}><Text>{this.state.selectedOpportunity.jobLink}</Text></TouchableOpacity>
                                            </View>
                                          </View>
                                          <View className="clear" />

                                          {(this.state.selectedOpportunity.appRequirements && this.state.selectedOpportunity.submissionDeadline) && (
                                            <View>
                                              <View className="spacer"/>
                                              <View>
                                                <View className="fixed-column-33 right-padding">
                                                  <View className="half-spacer" />

                                                </View>
                                                <View className="calc-column-offset-33">
                                                  <View className="spacer" />
                                                  {(this.state.selectedOpportunity.appRequirements !== '') && (
                                                    <View>
                                                      <Text><Text className="half-bold-text">Application Requirements:</Text> {this.state.selectedOpportunity.appRequirements}</Text>
                                                    </View>
                                                  )}
                                                  {(this.state.selectedOpportunity.submissionDeadline !== '') && (
                                                    <View>
                                                      <Text><Text className="half-bold-text">Deadline:</Text> {convertDateToString(this.state.selectedOpportunity.submissionDeadline,'datetime')}</Text>

                                                    </View>
                                                  )}
                                                </View>
                                              </View>
                                              <View className="clear" />
                                            </View>
                                          )}

                                          <View className="spacer"/><View className="spacer"/>

                                        </View>

                                        <View>
                                          <Text>AND</Text>
                                        </View>

                                      </View>
                                    )}

                                    <View className="clear" />
                                    <View className="spacer"/><View className="spacer"/>

                                    <View>
                                      <View className="float-left right-padding">
                                        <View className="spacer" /><View className="half-spacer" /><View className="half-spacer" />
                                        <Image source={{ uri: profileIconBig}} className="image-auto-23" />
                                      </View>
                                      <View className="calc-column-offset-33">
                                        <View className="spacer" />

                                        {(this.state.selectedOpportunity.submissionDeadline && new Date(this.state.selectedOpportunity.submissionDeadline) < new Date()) ? (
                                          <View>
                                            <Text className="error-color">The deadline has passed for this opportunity</Text>
                                          </View>
                                        ) : (
                                          <View>
                                            <Text className="heading-text-4">{this.state.orgName} Referral</Text>
                                            {(this.props.fromAdvisor) ? (
                                              <Text>After students apply for this position, they may request a referral from {this.state.selectedOpportunity.orgName} through their portal.</Text>
                                            ) : (
                                              <Text>After you apply for this position, request a referral from {this.state.selectedOpportunity.orgName} <TouchableOpacity onPress={() => this.props.navigation.navigate('Apply', { selectedPosting: this.state.selectedOpportunity, application: this.state.application })}><Text>here.</Text></TouchableOpacity></Text>
                                            )}
                                          </View>
                                        )}
                                      </View>
                                    </View>
                                  </View>

                                </View>
                              )}

                            </View>
                            <View className="clear" />
                          </View>
                        )}
                      </View>

                      <View className="clear" />

                      <View className="spacer"/>

                      <View className="full-width left-padding-5 right-padding-5">
                        <View className="spacer" /><View className="spacer" />

                        <Text className="description-text-2">Description</Text>
                        <Text className="heading-text-6 keep-line-breaks">{this.state.selectedOpportunity.description}</Text>

                        <View className="spacer" /><View className="spacer" />
                      </View>

                      {(this.state.activeOrg !== 'exp') && (
                        <View>
                          <View className="spacer"/><View className="spacer"/>
                          <View style={[styles.horizontalLine]} />
                          <View className="spacer"/><View className="spacer"/><View className="spacer"/>

                          {(this.state.selectedOpportunity.postType === 'Track' || this.state.selectedOpportunity.subPostType === 'Track') ? (
                            <View>
                              <View className="left-padding-5 right-padding-5">
                                <Text className="heading-text-3">Tracks</Text>
                                <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
                                <Text>{this.state.selectedOpportunity.title} has {this.state.selectedOpportunity.tracks.length} tracks. You must be accepted into a given track before you allowed to apply to any of the roles within that track. Tracks will appear as you are approved for them.</Text>
                              </View>

                              {(!this.state.emailId || this.state.emailId === '') ? (
                                <View>
                                  <View className="spacer"/><View className="half-spacer"/>
                                  <Text className="error-message">You must be logged in to view the track postings</Text>
                                </View>
                              ) : (
                                <View className="padding-20">
                                  {this.renderTracks()}
                                </View>
                              )}

                            </View>
                          ) : (
                            <View>
                              {(!this.state.selectedOpportunity.isPromotional && this.state.benchmark && this.state.selectedOpportunity.workflowType !== 'Common App') && (
                                <View>
                                  <View className="left-padding-5 right-padding-5">
                                    <Text className="heading-text-3">Ideal Candidate</Text>
                                    <View className="half-spacer"/>
                                    <Text className="description-text-1">(The below describes what the employer wants in a candidate)</Text>
                                    <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
                                  </View>

                                  <View className="left-padding-5 right-padding-5">
                                    <Text className="heading-text-6">Skills</Text>
                                    <View className="padding-20">
                                      {this.renderSkills()}
                                    </View>

                                    <Text className="heading-text-6">Interests</Text>
                                    <View className="padding-20">
                                      {this.renderInterests()}
                                    </View>

                                    <Text className="heading-text-6">Traits</Text>
                                    <View className="padding-20">
                                      {this.renderTraits()}
                                    </View>
                                  </View>
                                </View>
                              )}

                            </View>
                          )}
                        </View>
                      )}

                      {(!this.state.selectedOpportunity.isPromotional && this.state.benchmark && this.state.selectedOpportunity.workflowType !== 'Common App') && (
                        <View>
                          <View className="spacer"/><View className="spacer"/>
                          <View style={[styles.horizontalLine]} />
                          <View className="spacer"/><View className="spacer"/><View className="spacer"/>
                        </View>
                      )}

                      <View className="left-padding-5">
                        <View className="spacer"/>
                        { (this.state.sessionErrorMessage!== '') && <Text className="error-message">{this.state.sessionErrorMessage}</Text> }
                        { (this.state.serverPostSuccess) ? (
                          <Text className="success-message">{this.state.serverSuccessMessage}</Text>
                        ) : (
                          <Text className="error-message">{this.state.serverErrorMessage}</Text>
                        )}

                        {(this.props.fromAdvisor) ? (
                          <View>
                            <View className="left-padding-5 right-padding-5">
                              <Text className="heading-text-3">Endorse a Student for this Posting</Text>
                              <View className="spacer"/><View className="spacer"/>
                            </View>

                            <View>
                              <View className="spacer"/><View className="spacer"/>
                              <Text>Endorsing a student allows him / her to automatically import that endorsement into scholarship and internship applications.{(this.state.benchmark) && " Clicking the button below will auto-populate the skills and traits information relevant to this posting so that you provide a relevant endorsement."}</Text>
                              <View className="spacer"/><View className="spacer"/><View className="spacer"/><View className="spacer"/>
                            </View>

                            <TouchableOpacity onPress={() => this.props.navigation.navigate('SendEndorsement', { benchmark: this.state.benchmark })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.whiteColor]}>Endorse a Student</Text></TouchableOpacity>
                          </View>
                        ) : (
                          <View>
                            {this.state.hasApplied ? (
                              <View>
                                <Text className="error-color center-text bold-text">***You have already applied to this posting. If the recipient is interested, they will contact you. Look for updates via email. You can update your application at any time by resubmitting. If you have any technical questions, email creighton@guidedcompass.com.***</Text>
                                <View className="spacer"/><View className="spacer"/>
                                <View>
                                  {this.state.selectedOpportunity.isChild ? (
                                    <View className="flex-container flex-center">
                                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Apply', { selectedPosting: this.state.selectedOpportunity, application: this.state.application })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.whiteColor]}>Update</Text></TouchableOpacity>
                                    </View>
                                  ) : (
                                    <View className="flex-container flex-center">
                                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Apply', { selectedPosting: this.state.selectedOpportunity, application: this.state.application })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.whiteColor]}>Update</Text></TouchableOpacity>
                                    </View>
                                  )}
                                </View>
                              </View>
                            ):(
                              <View>
                                {(this.state.selectedOpportunity.isActive === false) ? (
                                  <View>
                                    <Text className="error-color">This posting has been marked inactive (i.e., it is not taking any new applications).</Text>
                                  </View>
                                ) : (
                                  <View>
                                    <View>
                                      {this.state.selectedOpportunity.isChild ? (
                                        <View>
                                          {this.state.isApproved ? (
                                            <View>
                                              <TouchableOpacity onPress={() => this.props.navigation.navigate('Apply', { selectedPosting: this.state.selectedOpportunity })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.whiteColor]}>Submit Application for Referral</Text></TouchableOpacity>
                                            </View>
                                          ) : (
                                            <View>
                                              <Text className="error-color center-text bold-text">***You must apply to the {this.state.orgName} general posting and then get approved before applying for this specific posting.***</Text>
                                              {(this.state.parentPost) && (
                                                <View className="center-text">
                                                  <View className="spacer"/><View className="spacer"/>
                                                  <TouchableOpacity className="secondary-link clear-border" onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: this.state.parentPost })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.whiteColor]}>View {this.state.selectedOpportunity.orgName} General Posting</Text></TouchableOpacity>
                                                </View>
                                              )}
                                            </View>
                                          )}
                                        </View>
                                      ) : (
                                        <View>
                                          {(this.state.selectedOpportunity.postType === 'Track' || this.state.selectedOpportunity.subPostType === 'Track') ? (
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Apply', { selectedPosting: this.state.selectedOpportunity, application: this.state.application })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.whiteColor]}>Apply</Text></TouchableOpacity>
                                          ) : (
                                            <View>
                                              {(this.state.selectedOpportunity.submissionDeadline && new Date(this.state.selectedOpportunity.submissionDeadline) < new Date()) ? (
                                                <View>
                                                  <Text className="error-color">The deadline has passed for this opportunity</Text>
                                                </View>
                                              ) : (
                                                <View>
                                                  {(this.state.selectedOpportunity.direct) ? (
                                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Apply', { selectedPosting: this.state.selectedOpportunity, application: this.state.application })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.whiteColor]}>Apply</Text></TouchableOpacity>
                                                  ) : (
                                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Apply', { selectedPosting: this.state.selectedOpportunity, application: this.state.application })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.whiteColor]}>Request a Referral</Text></TouchableOpacity>
                                                  )}
                                                </View>
                                              )}
                                            </View>
                                          )}

                                        </View>
                                      )}
                                    </View>
                                  </View>
                                )}

                              </View>
                            )}
                          </View>
                        )}

                        <View className="spacer"/><View className="spacer"/><View className="spacer"/>

                      </View>
                      {this.state.serverSuccessMessage !== '' && <Text className="success-message">{this.state.serverSuccessMessage}</Text>}
                      {this.state.serverErrorMessage !== '' && <Text className="error-message">{this.state.serverErrorMessage}</Text>}

                    </View>
                  </View>
                )}

                {(this.state.selectedOpportunity.postType === 'Assignment' || this.state.selectedOpportunity.postType === 'Problem' || this.state.selectedOpportunity.postType === 'Challenge') && (
                  <View>
                    <View className="spacer"/><View className="spacer"/><View className="spacer"/>

                    <View>
                      <View className="relative-column-80">
                        <Text className="heading-text-2">{this.state.selectedOpportunity.name}</Text>

                        <View className="clear" />
                        <View className="spacer" />

                        <View className="float-left">
                          <Text className="description-text-1">{this.state.selectedOpportunity.contributorFirstName} {this.state.selectedOpportunity.contributorLastName}, {this.state.selectedOpportunity.contributorTitle}</Text>
                        </View>

                        {(this.state.selectedOpportunity.employerName) && (
                          <View className="float-left left-padding-5">
                            {(this.state.selectedOpportunity.employerURL && this.state.selectedOpportunity.employerURL.includes('http')) ? (
                              <Text className="description-text-1">@ <TouchableOpacity onPress={() => Linking.openURL(this.state.selectedOpportunity.employerURL)}>{this.state.selectedOpportunity.employerName}</TouchableOpacity></Text>
                            ) : (
                              <Text className="description-text-1">@ {this.state.selectedOpportunity.employerName}</Text>
                            )}
                          </View>
                        )}

                        <View className="clear" />
                      </View>

                      <View className="relative-column-20 right-text">
                        {(this.state.selectedOpportunity.postType === 'Challenge' && this.state.selectedOpportunity.prizes && this.state.selectedOpportunity.prizes[0]) ? (
                          <View>
                            <Text className="heading-text-2 cta-color">${this.state.selectedOpportunity.prizes[0]}</Text>
                          </View>
                        ) : (
                          <View className="float-right full-width">
                            <TouchableOpacity className="background-button clear-padding display-block pin-right" onPress={() => this.voteOnItem(this.state.selectedOpportunity, 'up', 0) }>
                              <View className="standard-border rounded-corners">
                                <View className="float-left padding-7">
                                  <Image source={(this.state.selectedOpportunity.upvotes.includes(this.state.emailId)) ? { uri: upvoteIconBlue} : { uri: upvoteIconGrey}} className="image-auto-15"/>
                                </View>
                                <View className="vertical-separator-4" />
                                <View className="float-left horizontal-padding-10">
                                  <View className="half-spacer" />
                                  <Text className="description-text-2 half-bold-text">{this.state.selectedOpportunity.upvotes.length}</Text>
                                </View>
                                <View className="clear" />
                              </View>
                            </TouchableOpacity>
                          </View>
                        )}

                        <TouchableOpacity className="background-button clear-padding display-block float-right top-margin" onPress={() => this.favoriteItem(this.state.selectedOpportunity) }>
                          {(this.state.favorites.includes(this.state.selectedOpportunity._id)) ? (
                            <View className="cta-border cta-background-color rounded-corners">
                              <View className="float-left row-7 left-padding-5 right-padding-5">
                                <Image source={{ uri: checkmarkIconWhite}} className="image-auto-12"/>
                              </View>
                              <View className="float-left row-5 right-padding-10 center-text">
                                <Text className="description-text-3 half-bold-text white-text">Followed</Text>
                              </View>
                              <View className="clear" />
                            </View>
                          ) : (
                            <View className="standard-border rounded-corners">
                              {(this.state.emailId) && (
                                <View className="float-left row-5 horizontal-padding-10 center-text">
                                  <Text className="description-text-3 half-bold-text">{(this.state.emailId) ? "Follow" : "Register"}</Text>
                                </View>
                              )}

                              <View className="clear" />
                            </View>
                          )}
                        </TouchableOpacity>

                      </View>

                      <View className="clear" />
                    </View>

                    <View className="super-spacer"/>

                    <View>
                      {(this.state.selectedOpportunity.postType === 'Challenge') && (
                        <View>
                          <View className="float-left padding-five-percent-right">
                            <View className="float-left right-padding">
                              <Image source={{ uri: prizeIcon}} className="image-auto-25" />
                            </View>
                            <Text className="description-text-1">${this.state.selectedOpportunity.prizes[0]}</Text>

                            <View className="clear" />
                            <View className="spacer" /><View className="spacer" /><View className="half-spacer" />

                          </View>
                          <View className="float-left padding-five-percent-right">
                            <View className="float-left right-padding">
                              <Image source={{ uri: deadlineIcon}} className="image-auto-25" />
                            </View>
                            <Text className="description-text-1">{this.formatDate(this.state.selectedOpportunity.submissionDeadline)}</Text>

                            <View className="clear" />
                            <View className="spacer" /><View className="spacer" /><View className="half-spacer" />
                          </View>
                        </View>
                      )}

                      <View className="float-left padding-five-percent-right">
                        <View className="float-left right-padding">
                          <Image source={{ uri: difficultyIcon}} className="image-auto-25" />
                        </View>
                        <Text className="description-text-1">{this.state.selectedOpportunity.difficultyLevel}</Text>

                        <View className="clear" />
                        <View className="spacer" /><View className="spacer" /><View className="half-spacer" />
                      </View>
                      {(this.state.selectedOpportunity.upvotes && this.state.selectedOpportunity.downvotes) && (
                        <View className="float-left padding-five-percent-right">
                          <View className="float-left right-padding">
                            <Image source={{ uri: checkmarkIcon}} className="image-auto-25" />
                          </View>
                          <Text className="description-text-1">{this.state.selectedOpportunity.upvotes.length - this.state.selectedOpportunity.downvotes.length} Popularity</Text>

                          <View className="clear" />
                          <View className="spacer" /><View className="spacer" /><View className="half-spacer" />
                        </View>
                      )}

                      <View className="float-left padding-five-percent-right">
                        <View className="float-left right-padding">
                          <Image source={{ uri: industryIcon}} className="image-auto-25" />
                        </View>
                        <Text className="description-text-1">{this.state.selectedOpportunity.industry} Industry</Text>

                        <View className="clear" />
                        <View className="spacer" /><View className="spacer" /><View className="half-spacer" />
                      </View>

                      {(this.state.selectedOpportunity.knowledgeLevel) && (
                        <View className="float-left padding-five-percent-right">
                          <View className="float-left right-padding">
                            <Image source={{ uri: reachIcon}} className="image-auto-25" />
                          </View>
                          <Text className="description-text-1">{this.state.selectedOpportunity.knowledgeLevel}</Text>

                          <View className="clear" />
                          <View className="spacer" /><View className="spacer" /><View className="half-spacer" />
                        </View>
                      )}

                      {(this.state.selectedOpportunity.pointValue) && (
                        <View className="float-left padding-five-percent-right">
                          <View className="float-left right-padding">
                            <Image source={{ uri: pointsIcon}} className="image-auto-25" />
                          </View>
                          <Text className="description-text-1">{this.state.selectedOpportunity.pointValue} Points</Text>

                          <View className="clear" />
                          <View className="spacer" /><View className="spacer" /><View className="half-spacer" />
                        </View>
                      )}

                      {(this.state.selectedOpportunity.functions) && (
                        <View className="float-left padding-five-percent-right">
                          <View className="float-left right-padding">
                            <Image source={{ uri: skillsIconBlue}} className="image-auto-25" />
                            <View className="clear" />
                            <View className="spacer" /><View className="spacer" /><View className="half-spacer" />
                          </View>

                          {this.state.selectedOpportunity.functions.map((value, index) =>
                            <span>
                              {(index === this.state.selectedOpportunity.functions.length - 1) ? (
                                <Text className="description-text-1">{value}</Text>
                              ) : (
                                <Text className="description-text-1">{value}, </Text>
                              )}
                            </span>
                          )}

                          <View className="clear" />
                          <View className="spacer" /><View className="spacer" /><View className="half-spacer" />
                        </View>
                      )}

                      {(this.state.selectedOpportunity.tags) && (
                        <View className="float-left">
                          <View className="float-left right-padding">
                            <Image source={{ uri: tagIcon}} className="image-auto-25" />
                            <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
                          </View>
                          <Text className="description-text-1">{this.state.selectedOpportunity.tags}</Text>
                        </View>
                      )}

                    </View>

                    <View className="clear" />

                    <View>
                      <View>
                        <View className={(this.state.viewIndex === 0) ? "app-title-container-1-of-2-1 selected-item-container-1" : "app-title-container-1-of-2-1 unselected-item-container-1"}>
                          <Text className={(this.state.viewIndex === 0) ? "heading-text-4 cta-color" : "heading-text-4 unselected-color"}><TouchableOpacity onPress={() => this.setState({ viewIndex: 0 })}>Details</TouchableOpacity></Text>
                        </View>

                        {(this.state.roleName === 'Student') && (
                          <View className={(this.state.viewIndex === 1) ? "app-title-container-1-of-2-1 margin-five-percent-left selected-item-container-1" : "app-title-container-1-of-2-1 margin-five-percent-left unselected-item-container-1"}>
                            <Text className={(this.state.viewIndex === 1) ? "heading-text-4 cta-color" : "heading-text-4 unselected-color"}><TouchableOpacity onPress={() => this.setState({ viewIndex: 1 })}>Submit a Project</TouchableOpacity></Text>
                          </View>
                        )}

                        <View className={(this.state.viewIndex === 2) ? "app-title-container-1-of-2-1 margin-five-percent-left selected-item-container-1" : "app-title-container-1-of-2-1 margin-five-percent-left unselected-item-container-1"}>

                          { ( !this.state.selectedOpportunity.submissions || this.state.selectedOpportunity.submissions.length === 0 ) ? (
                            <Text className={(this.state.viewIndex === 2) ? "heading-text-4 cta-color" : "heading-text-4 unselected-color"}><TouchableOpacity onPress={() => this.setState({ viewIndex: 2 })}>Submissions</TouchableOpacity></Text>
                          ) : (
                            <View>
                              <Text className={(this.state.viewIndex === 2) ? "heading-text-4 cta-color float-left margin-right-3" : "heading-text-4 unselected-color float-left margin-right-3"}><TouchableOpacity onPress={() => this.setState({ viewIndex: 2 })}>Submissions</TouchableOpacity></Text>
                              {(this.state.viewIndex === 2) ? (
                                <View className="noti-bubble selected-background description-text-4 float-left">{this.state.selectedOpportunity.submissions.length}</View>
                              ) : (
                                <View className="noti-bubble unselected-background description-text-4 float-left">{this.state.selectedOpportunity.submissions.length}</View>
                              )}
                            </View>
                          )}
                        </View>

                        <View className={(this.state.viewIndex === 3) ? "app-title-container-1-of-2-1 margin-five-percent-left selected-item-container-1" : "app-title-container-1-of-2-1 margin-five-percent-left unselected-item-container-1"}>
                          { ( this.state.comments.length === 0 ) ? (
                            <Text className={(this.state.viewIndex === 3) ? "heading-text-4 cta-color" : "heading-text-4 unselected-color"}><TouchableOpacity onPress={() => this.setState({ viewIndex: 3 })}>Comments</TouchableOpacity></Text>
                          ) : (
                            <View>
                              <Text className={(this.state.viewIndex === 3) ? "heading-text-4 cta-color float-left margin-right-3" : "heading-text-4 unselected-color float-left margin-right-3"}><TouchableOpacity onPress={() => this.setState({ viewIndex: 3 })}>Comments</TouchableOpacity></Text>
                              {(this.state.viewIndex === 3) ? (
                                <View className="noti-bubble selected-background description-text-4 float-left">{this.state.comments.length}</View>
                              ) : (
                                <View className="noti-bubble unselected-background description-text-4 float-left">{this.state.comments.length}</View>
                              )}
                            </View>
                          )}
                        </View>
                        <View className="clear" />
                      </View>

                      <View className="spacer"/><View className="half-spacer"/>

                      {(this.state.viewIndex === 0) && (
                        <View>
                          {(this.state.selectedOpportunity.videoLink && this.state.selectedOpportunity.videoLink !== '') && (
                            <View>
                              <View className="spacer"/><View className="spacer"/><View className="spacer"/>

                              <View>
                                <View className="video-container">
                                  {/*
                                  <iframe
                                    title="videoLink"
                                    className="video-iframe"
                                    source={`${this.state.selectedOpportunity.videoLink}`}
                                    frameBorder="0"
                                  />*/}
                                </View>

                              </View>

                              <View className="clear" />
                              <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
                            </View>
                          )}

                          {(this.state.selectedOpportunity.summary) && (
                            <View>
                              <View>
                                <Text className="heading-text-4">Summary</Text>
                                <View className="row-5">
                                  {this.state.summarySplit.map((value, index) => <Text className="description-text-2 dark-color half-bold-text">{value}</Text>)}
                                </View>
                              </View>

                              <View className="spacer"/><View className="spacer"/>
                            </View>
                          )}

                          {(this.state.selectedOpportunity.submissionDeadline) && (
                            <View>
                              <View>
                                <Text className="heading-text-4">Submission Deadline</Text>

                                <View className="row-5">
                                  {(this.state.selectedOpportunity.submissionDeadline && this.state.selectedOpportunity.submissionDeadline !== '') ? (
                                    <Text className="keep-line-breaks description-text-2 dark-color half-bold-text">{convertDateToString(this.state.selectedOpportunity.submissionDeadline,'datetime')}</Text>
                                  ) : (
                                    <Text className="keep-line-breaks"></Text>
                                  )}
                                </View>

                              </View>

                              <View className="spacer"/><View className="spacer"/>
                            </View>
                          )}

                          {(this.state.selectedOpportunity.duration) && (
                            <View>
                              <View>
                                <Text className="heading-text-4">Duration</Text>

                                <View className="row-5">
                                  <Text className="keep-line-breaks description-text-2 dark-color half-bold-text">{this.state.selectedOpportunity.duration} Estimated Man Hours</Text>
                                </View>
                              </View>

                              <View className="spacer"/><View className="spacer"/>
                            </View>
                          )}

                          {(this.state.selectedOpportunity.isExternal && this.state.selectedOpportunity.source) ? (
                            <View>
                            <Text className="heading-text-4">External Source</Text>
                            <TouchableOpacity onPress={() => Linking.openURL(this.state.selectedOpportunity.source)}>{this.state.selectedOpportunity.source}</TouchableOpacity>
                            <View className="spacer"/><View className="spacer"/>
                            </View>
                          ) : (
                            <View>
                              {(this.state.selectedOpportunity.description) && (
                                <View>
                                  <Text className="heading-text-4">Description</Text>

                                  <View className="row-5">
                                    <Text className="keep-line-breaks description-text-2 dark-color half-bold-text">{this.state.selectedOpportunity.description}</Text>
                                  </View>

                                  <View className="spacer"/><View className="spacer"/>
                                </View>
                              )}

                              {(this.state.selectedOpportunity.richDescription) && (
                                <View>
                                  <Text className="heading-text-4">Description</Text>
                                  <View>
                                    <MyEditor showText={true} existingContent={{ blocks: this.state.selectedOpportunity.richDescription, entityMap: {}}} />
                                  </View>
                                  <View className="spacer"/><View className="spacer"/>
                                </View>
                              )}
                            </View>
                          )}

                          {(this.state.selectedOpportunity.background) && (
                            <View>
                            <Text className="heading-text-4">Background</Text>

                            <View className="row-5">
                              <Text className="keep-line-breaks description-text-2 dark-color half-bold-text">{this.state.selectedOpportunity.background}</Text>
                            </View>

                            <View className="spacer"/><View className="spacer"/>
                            </View>
                          )}

                          {(this.state.selectedOpportunity.employerInfo) && (
                            <View>
                              <Text className="heading-text-4">Employer Info</Text>

                              <View className="row-5">
                                <Text className="keep-line-breaks description-text-2 dark-color half-bold-text">{this.state.selectedOpportunity.employerInfo}</Text>
                              </View>

                            </View>
                          )}

                          <View className="spacer"/><View className="spacer"/>

                          {(this.state.selectedOpportunity.lessons) && (
                            <View>
                            <Text className="heading-text-4">Lessons</Text>

                            <View className="row-5">
                              <Text className="keep-line-breaks description-text-2 dark-color half-bold-text">{this.state.selectedOpportunity.lessons}</Text>
                            </View>

                            <View className="spacer"/><View className="spacer"/>
                            </View>
                          )}

                          {(this.state.selectedOpportunity.postType === 'Challenge') && (
                            <View>
                              <Text className="heading-text-4">Rules</Text>

                              <View className="row-5">
                                <Text className="keep-line-breaks description-text-2 dark-color half-bold-text">{this.state.selectedOpportunity.rules}</Text>
                              </View>

                              <View className="spacer"/><View className="spacer"/>
                            </View>
                          )}

                          {(this.state.selectedOpportunity.guidelines) && (
                            <View>
                              <Text className="heading-text-4">Guidelines</Text>

                              <View className="row-5">
                                <Text className="keep-line-breaks description-text-2 dark-color half-bold-text">{this.state.selectedOpportunity.guidelines}</Text>
                              </View>

                            </View>
                          )}

                          <View className="spacer"/><View className="spacer"/>

                          {(this.state.selectedOpportunity.resources && this.state.selectedOpportunity.resources.length > 0) && (
                            <View>
                            <Text className="heading-text-4">Resources</Text>

                            <View className="row-5 description-text-2">
                              {this.state.selectedOpportunity.resources.map((value, index) => <View><Text>{index + 1}. </Text><TouchableOpacity onPress={() => Linking.openURL(value)}>{value}</TouchableOpacity></View>)}
                            </View>

                            <View className="spacer"/><View className="spacer"/>
                            </View>
                          )}

                          {(this.state.selectedOpportunity.postType === 'Challenge') && (
                            <View>
                              <View>
                                <Text className="heading-text-4">Prizes</Text>

                                <View className="row-5 description-text-2">
                                  <Text><Text className="half-bold-text">1st Place Prize:</Text> ${this.state.selectedOpportunity.prizes[0]}</Text>
                                  {(this.state.selectedOpportunity.prizes[1]) && (
                                    <Text><Text className="half-bold-text">2nd Place Prize:</Text> ${this.state.selectedOpportunity.prizes[1]}</Text>
                                  )}
                                  {(this.state.selectedOpportunity.prizes[2]) && (
                                    <Text><Text className="half-bold-text">3rd Place Prize:</Text> ${this.state.selectedOpportunity.prizes[2]}</Text>
                                  )}
                                </View>

                              </View>

                              <View className="spacer"/><View className="spacer"/>
                              {/*
                              <View>
                                <Text className="heading-text-4">Evaluation Method</Text>
                                <Text>{this.state.selectedOpportunity.evaluationMethod}</Text>
                              </View>

                              <View className="spacer"/><View className="spacer"/>*/}

                              <View>
                                <Text className="heading-text-4">Timeline</Text>
                                <View style={[styles.row5]}>
                                  <View><Text style={[styles.descriptionText,styles.boldText]}>Register and follow by:</Text> {convertDateToString(this.state.selectedOpportunity.startDate,"datetime")}</View>
                                  <View><Text style={[styles.descriptionText,styles.boldText]}>Submission Deadline:</Text> {convertDateToString(this.state.selectedOpportunity.submissionDeadline,"datetime")}</View>
                                  <View><Text style={[styles.descriptionText,styles.boldText]}>Winner Announcement Date:</Text> {convertDateToString(this.state.selectedOpportunity.announcementDate,"datetime")}</View>
                                </View>
                              </View>

                              <View className="spacer"/><View className="spacer"/>
                            </View>
                          )}

                          <View>
                            {this.renderDetails('section')}
                          </View>

                          <View>
                            {this.renderDetails('exhibit')}
                          </View>

                          <View className="clear" />

                          <View className="spacer"/><View className="spacer"/><View className="spacer"/>
                          <View style={[styles.ctaHorizontalLine]} />

                          <View className="spacer"/><View className="half-spacer"/>

                          {(this.state.selectedOpportunity.postType === 'Challenge') && (
                            <View>
                              {(this.state.registrationPassed || this.state.hasRegistered) ? (
                                <View>

                                  {(this.state.hasRegistered) ? (
                                    <Text className="cta-color">You have already registered for this challenge.</Text>
                                  ) : (
                                    <Text className="error-color">Registration has passed for this challenge.</Text>
                                  )}

                                  <View className="spacer"/><View className="spacer"/>
                                  <View style={[styles.ctaHorizontalLine]} />
                                  <View className="spacer"/><View className="spacer"/>
                                </View>
                              ) : (
                                <View>
                                  {(this.state.emailId || (this.state.selectedOpportunity.isPublic && !this.state.emailId)) && (
                                    <View>
                                      <View className="top-padding-20">
                                        <Text className="heading-text-3">Register for Challenge</Text>
                                      </View>

                                      <View className="row-5">
                                        <View className="row-10">
                                          <View>
                                            <View className="calc-column-offset-45">
                                              <Text className="profile-label">Which best describes you?<Text className="error-color">*</Text></Text>
                                            </View>
                                            <View className="fixed-column-45 left-padding">
                                              <View className="half-spacer" /><View className="mini-spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                                            </View>
                                            <View className="clear" />
                                          </View>

                                          {this.state.roleNameOptions.map((value, index) =>
                                            <View key={value} className="float-left">
                                              <View className="float-left row-5 right-padding">
                                                <TouchableOpacity onPress={() => this.itemClicked(value,'roleName')}>
                                                  {(this.state.roleName === value) ? (
                                                    <View className="tag-container-4">
                                                      <Text className="description-text-2 white-text half-bold-text">{value}</Text>
                                                    </View>
                                                  ) : (
                                                    <View className="tag-container-inactive-2">
                                                      <Text className="description-text-2 cta-color half-bold-text">{value}</Text>
                                                    </View>
                                                  )}
                                                </TouchableOpacity>
                                              </View>
                                            </View>
                                          )}
                                          <View className="clear" />
                                        </View>

                                        {(this.state.roleName === 'Other') && (
                                          <View className="row-10">
                                            <Text className="profile-label">You selected "other". Please write your role:<Text className="error-color">*</Text></Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("otherRoleName", text)}
                                              value={this.state.otherRoleName}
                                              placeholder="Other Role Name..."
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                        )}

                                        <View className="row-10">
                                          <View className="container-left">
                                            <Text className="profile-label">First Name<Text className="error-color">*</Text></Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("firstName", text)}
                                              value={this.state.firstName}
                                              placeholder="e.g., Joe..."
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                          <View className="container-right">
                                            <Text className="profile-label">Last Name<Text className="error-color">*</Text></Text>
                                            <TextInput
                                              style={styles.textInput}
                                              onChangeText={(text) => this.formChangeHandler("lastName", text)}
                                              value={this.state.lastName}
                                              placeholder="e.g., Smith..."
                                              placeholderTextColor="grey"
                                            />
                                          </View>
                                          <View className="clear" />
                                        </View>

                                        {(this.state.roleName && this.state.roleNameOptions.includes(this.state.roleName)) && (
                                          <View>
                                            <View className="row-10">
                                              <View className="container-left">
                                                {(this.state.roleName === 'Participant') ? (
                                                  <View>
                                                    <Text className="profile-label">Current / Latest School Name<Text className="error-color">*</Text></Text>
                                                    <TextInput
                                                      style={styles.textInput}
                                                      onChangeText={(text) => this.formChangeHandler("school", text)}
                                                      value={this.state.school}
                                                      placeholder="e.g., Guided Compass University..."
                                                      placeholderTextColor="grey"
                                                    />
                                                  </View>
                                                ) : (
                                                  <View>
                                                    <Text className="profile-label">Employer Name<Text className="error-color">*</Text></Text>
                                                    <TextInput
                                                      style={styles.textInput}
                                                      onChangeText={(text) => this.formChangeHandler("employerName", text)}
                                                      value={this.state.employerName}
                                                      placeholder="e.g., Amazon..."
                                                      placeholderTextColor="grey"
                                                    />
                                                  </View>
                                                )}
                                              </View>
                                              <View className="container-right">
                                                {(this.state.roleName !== 'Participant') && (
                                                  <View>
                                                    <Text className="profile-label">Job Title<Text className="error-color">*</Text></Text>
                                                    <TextInput
                                                      style={styles.textInput}
                                                      onChangeText={(text) => this.formChangeHandler("jobTitle", text)}
                                                      value={this.state.jobTitle}
                                                      placeholder="e.g., Software Engineer..."
                                                      placeholderTextColor="grey"
                                                    />
                                                  </View>
                                                )}
                                              </View>
                                              <View className="clear" />
                                            </View>

                                            {(this.state.roleName === 'Educator') && (
                                              <View className="row-10">
                                                <View className="container-left">
                                                  <Text className="profile-label">School Name<Text className="error-color">*</Text></Text>
                                                  <TextInput
                                                    style={styles.textInput}
                                                    onChangeText={(text) => this.formChangeHandler("school", text)}
                                                    value={this.state.school}
                                                    placeholder="e.g., Guided Compass University..."
                                                    placeholderTextColor="grey"
                                                  />
                                                </View>
                                                <View className="clear" />
                                              </View>
                                            )}

                                            <View className="row-10">
                                              <View className="container-left">
                                                <Text className="profile-label">Email<Text className="error-color">*</Text></Text>
                                                <TextInput
                                                  style={styles.textInput}
                                                  onChangeText={(text) => this.formChangeHandler("emailId", text)}
                                                  value={this.state.emailId}
                                                  placeholder="e.g., guidedcompass@gmail.com..."
                                                  placeholderTextColor="grey"
                                                />
                                              </View>
                                              <View className="clear" />
                                            </View>

                                            {(this.state.roleName === 'Participant') && (
                                              <View>
                                                <Text className="profile-label">Add Teammates (Optional)</Text>
                                                <View>
                                                  <View className="container-left">
                                                    <View className="calc-column-offset-80">
                                                      <TextInput
                                                        style={styles.textInput}
                                                        onChangeText={(text) => this.formChangeHandler("collaboratorEmail", text)}
                                                        value={this.state.collaboratorEmail}
                                                        placeholder="e.g., collaborator@gmail.com..."
                                                        placeholderTextColor="grey"
                                                      />
                                                    </View>
                                                    <View className="fixed-column-80 left-padding">
                                                      <TouchableOpacity type="button" className={(this.state.collaboratorEmail && this.state.collaboratorEmail !== '') ? "btn btn-squarish" : "btn btn-squarish clear-border unselected-background"} onPress={() => this.inviteCollaborators()}>Add</TouchableOpacity>
                                                    </View>
                                                  </View>

                                                  <View className="clear" />
                                                </View>

                                                {(this.state.collaboratorErrorMessage) && <Text className="error-message">{this.state.collaboratorErrorMessage}</Text>}

                                                <View>
                                                  {this.renderCollaborators()}
                                                </View>
                                              </View>
                                            )}

                                          </View>
                                        )}

                                        <View className="top-padding-20 bottom-padding full-width">
                                          <TouchableOpacity className={(this.state.disableSubmit) ? "btn btn-primary disabled-background disabled-border" : "btn btn-primary"} disabled={this.state.disableSubmit} onPress={() => this.handleSubmit(this.state.selectedOpportunity.postType, 'register')}>Register</TouchableOpacity>

                                          <View className="clear" />
                                          {(this.state.errorMessage && this.state.errorMessage !== '') && <Text className="error-color top-padding full-width">{this.state.errorMessage}</Text>}
                                          {(this.state.successMessage && this.state.successMessage !== '') && <Text className="error-color top-padding full-width">{this.state.successMessage}</Text>}

                                        </View>
                                      </View>
                                    </View>
                                  )}

                                  <View className="spacer"/><View className="spacer"/>
                                  <View style={[styles.ctaHorizontalLine]} />
                                  <View className="spacer"/><View className="spacer"/>
                                </View>
                              )}
                            </View>
                          )}

                          <View>
                            {(((!this.state.registrationPassed) || (this.state.registrationPassed && !this.state.deadlinePassed && this.state.hasRegistered))) && (
                              <View>
                                <View className="spacer"/><View className="half-spacer"/>
                                <TouchableOpacity className="btn btn-primary" onPress={() => this.setState({ viewIndex: 1 })}>
                                  Submit a Project
                                </TouchableOpacity>
                              </View>
                            )}
                          </View>
                        </View>
                      )}

                      {(this.state.viewIndex === 1) && (
                        <View>
                          {(this.state.deadlinePassed || (this.state.registrationPassed && !this.state.hasRegistered)) ? (
                            <View>
                              <Text className="error-message">The deadline has passed for {this.state.selectedOpportunity.name}</Text>
                              <View className="spacer"/><View className="spacer"/><View className="spacer"/>
                            </View>
                          ) : (
                            <View>
                              <View className="bottom-padding">
                                <View className={(this.state.subviewIndex === 0) ? "app-title-container-1-of-2-1 selected-item-container-1" : "app-title-container-1-of-2-1 unselected-item-container-1"}>
                                  <Text className={(this.state.subviewIndex === 0) ? "heading-text-6 cta-color" : "heading-text-6 unselected-color"}><TouchableOpacity onPress={() => this.setState({ subviewIndex: 0 })}>Submit New Project</TouchableOpacity></Text>
                                </View>
                                <View className={(this.state.subviewIndex === 1) ? "app-title-container-1-of-2-1 margin-five-percent-left selected-item-container-1" : "app-title-container-1-of-2-1 margin-five-percent-left unselected-item-container-1"}>
                                  <Text className={(this.state.subviewIndex === 1) ? "heading-text-6 cta-color" : "heading-text-6 unselected-color"}><TouchableOpacity onPress={() => this.setState({ subviewIndex: 1 })}>Submit Project from Profile</TouchableOpacity></Text>
                                </View>
                                <View className="clear" />
                              </View>

                              {(this.state.subviewIndex === 0) ? (
                                <View>
                                  {(this.state.showSubEditProject) ? (
                                    <View>
                                      <EditProject selectedProject={{ startDate: this.state.dateOptions[this.state.dateOptions.length - 1].value, endDate: this.state.dateOptions[this.state.dateOptions.length - 1].value}}
                                        selectedIndex={undefined} selectedOpportunity={this.state.selectedOpportunity} submitted={this.state.submitted}
                                        projectCategoryOptions={this.state.projectCategoryOptions} dateOptions={this.state.dateOptions}
                                        collaboratorOptions={this.state.collaboratorOptions}  hourOptions={this.state.hourOptions}
                                        functionOptions={this.state.functionOptions}  industryOptions={this.state.industryOptions}
                                        finishedSubmitting={this.finishedSubmitting} userPic={this.state.pictureURL}
                                      />
                                    </View>
                                  ) : (
                                    <View>

                                    </View>
                                  )}
                                </View>
                              ) : (
                                <View>
                                  {(this.state.projectOptions.length > 1) ? (
                                    <View>

                                      <View className="spacer"/><View className="spacer"/>

                                      <Picker
                                        selectedValue={this.state.selectedProject.name}
                                        onValueChange={(itemValue, itemIndex) =>
                                          this.formChangeHandler("selectProject",itemValue)
                                        }>
                                        {this.state.projectOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                                      </Picker>
                                    </View>
                                  ) : (
                                    <View>
                                      <View className="spacer"/><View className="spacer"/>
                                      <Text className="error-message">You current don't have projects saved to your profile. Toggle to "Submit New Project" to submit.</Text>
                                    </View>
                                  )}
                                </View>
                              )}

                              {(this.state.subviewIndex === 1) ? (
                                <View>
                                  {(this.state.subviewIndex === 0) ? (
                                    <View>
                                      {(!this.state.showSubEditProject) && (
                                        <View>
                                          {this.state.serverSuccessMessage !== '' && <Text className="success-message">{this.state.serverSuccessMessage}</Text>}
                                          {this.state.serverErrorMessage !== '' && <Text className="error-message">{this.state.serverErrorMessage}</Text>}
                                          <TouchableOpacity className={(this.state.disableSubmit) ? "btn btn-primary disabled-background disabled-border" : "btn btn-primary"} disabled={this.state.disableSubmit} onPress={() => this.handleSubmit(this.state.selectedOpportunity.postType)}>{this.state.submitted ? "Update Your Solution" : "Submit Your Solution"}</TouchableOpacity>
                                        </View>
                                      )}
                                    </View>
                                  ) : (
                                    <View>
                                      {this.state.serverSuccessMessage !== '' && <Text className="success-message">{this.state.serverSuccessMessage}</Text>}
                                      {this.state.serverErrorMessage !== '' && <Text className="error-message">{this.state.serverErrorMessage}</Text>}
                                      <TouchableOpacity className={(this.state.disableSubmit) ? "btn btn-primary disabled-background disabled-border" : "btn btn-primary"} disabled={this.state.disableSubmit} onPress={() => this.handleSubmit(this.state.selectedOpportunity.postType)}>{this.state.submitted ? "Update Your Solution" : "Submit Your Solution"}</TouchableOpacity>
                                    </View>
                                  )}
                                </View>
                              ) : (
                                <View>

                                </View>
                              )}
                            </View>
                          )}



                        </View>
                      )}

                      {(this.state.viewIndex === 2) && (
                        <View>
                          <SubSubmissions selectedOpportunity={this.state.selectedOpportunity} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} submissionComments={this.state.submissionComments} postingOrgCode={this.state.postingOrgCode} postingOrgName={this.state.postingOrgName} orgContactEmail={this.state.orgContactEmail} pictureURL={this.state.pictureURL} gradeOptions={this.state.gradeOptions} navigation={this.props.navigation} pageSource={this.state.pageSource}/>
                        </View>
                      )}

                      {(this.state.viewIndex === 3) && (
                        <View>
                          <SubComments selectedOpportunity={this.state.selectedOpportunity} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} comments={this.state.comments} postingOrgCode={this.state.postingOrgCode} postingOrgName={this.state.postingOrgName} orgContactEmail={this.state.orgContactEmail} pictureURL={this.state.pictureURL} navigation={this.props.navigation} pageSource={this.state.pageSource} />
                        </View>
                      )}

                    </View>

                  </View>
                )}

                {(this.state.selectedOpportunity.postType === 'Event') && (
                  <View>
                    <View className="flex-container">
                      <View className="flex-90">
                        <View className="float-left right-padding">
                          <View className="spacer" />
                          <Image source={{ uri: gcLogo}} className="image-auto-48" />
                        </View>
                      </View>

                      <View className="flex-10 right-text">
                        <TouchableOpacity onPress={() => this.favoriteItem(this.state.selectedOpportunity) }>
                          <Image source={(this.state.favorites.includes(this.state.selectedOpportunity._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} className="image-auto-20"/>
                        </TouchableOpacity>
                      </View>

                      <View className="clear" />
                    </View>

                    <View className="super-spacer" />

                    <View>
                      <Text className="heading-text-2">{this.state.selectedOpportunity.title} RSVP Form</Text>
                      <View className="spacer" />

                      <View>
                        <View className={(this.state.viewIndex === 0) ? "app-title-container-1-of-2-1 selected-item-container-1" : "app-title-container-1-of-2-1 unselected-item-container-1"}>
                          <Text className={(this.state.viewIndex === 0) ? "heading-text-4 cta-color" : "heading-text-4 unselected-color"}><TouchableOpacity onPress={() => this.setState({ viewIndex: 0 })}>Details</TouchableOpacity></Text>
                        </View>
                        <View className={(this.state.viewIndex === 1) ? "app-title-container-1-of-2-1 margin-five-percent-left selected-item-container-1" : "app-title-container-1-of-2-1 margin-five-percent-left unselected-item-container-1"}>
                          { ( this.state.comments.length === 0 ) ? (
                            <Text className={(this.state.viewIndex === 1) ? "heading-text-4 cta-color" : "heading-text-4 unselected-color"}><TouchableOpacity onPress={() => this.setState({ viewIndex: 1 })}>Comments</TouchableOpacity></Text>
                          ) : (
                            <View>
                              <Text className={(this.state.viewIndex === 1) ? "heading-text-4 cta-color float-left margin-right-3" : "heading-text-4 unselected-color float-left margin-right-3"}><TouchableOpacity onPress={() => this.setState({ viewIndex: 1 })}>Comments</TouchableOpacity></Text>
                              {(this.state.viewIndex === 1) ? (
                                <View className="noti-bubble selected-background description-text-4 float-left">{this.state.comments.length}</View>
                              ) : (
                                <View className="noti-bubble unselected-background description-text-4 float-left">{this.state.comments.length}</View>
                              )}
                            </View>
                          )}
                        </View>
                        <View className="clear" />
                      </View>

                      <View className="spacer"/><View className="spacer"/>

                      {(this.state.viewIndex === 0) ? (
                        <View>
                          <View>
                            <View className="fixed-column-33 right-margin" >
                              <View className="spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                              <Image source={{ uri: profileIconBig}} className="profile-thumbnail-3" />
                            </View>
                            <View className="calc-column-offset-43">
                              <View className="half-spacer" /><View className="mini-spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                              <Text>Hosted by {this.state.selectedOpportunity.orgName}</Text>
                            </View>
                          </View>
                          <View className="clear" />
                          <View className="spacer"/>

                          <View>
                            <View className="fixed-column-33" >
                              <View className="spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                              <Image source={{ uri: locationIcon}} className="image-auto-23 right-margin-5" />
                            </View>
                            <View className="calc-column-offset-43">
                              <View className="half-spacer" /><View className="mini-spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                              <Text>Location: {this.state.selectedOpportunity.location}</Text>
                            </View>
                          </View>
                          <View className="clear" />
                          <View className="spacer"/>

                          <View>
                            <View className="fixed-column-33 right-margin" >
                              <View className="spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                              <Image source={{ uri: timeIconDark}} className="image-auto-23" />
                            </View>
                            <View className="calc-column-offset-43">
                              <View className="half-spacer" /><View className="mini-spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                              <Text>{this.state.startDateString} - {this.state.endDateString}</Text>
                            </View>
                          </View>
                          <View className="clear" />
                          <View className="spacer"/>

                          <View>
                            <View className="fixed-column-33" >
                              <View className="spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                              <Image source={{ uri: infoIcon}} className="image-auto-23" />
                            </View>
                            <View className="calc-column-offset-43">
                              <View className="half-spacer" /><View className="mini-spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                              <Text className="keep-line-break">{this.state.selectedOpportunity.summary}</Text>
                            </View>
                          </View>
                          <View className="clear" />

                          {(this.state.selectedOpportunity.links && this.state.selectedOpportunity.links.length > 0) && (
                            <View>
                              <View className="spacer"/>
                              <View>
                                <View className="fixed-column-33 right-margin" >
                                  <View className="spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                                  <Image source={{ uri: linkIcon}} className="image-auto-23" />
                                </View>
                                <View className="calc-column-offset-43">
                                  <View className="half-spacer" /><View className="mini-spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                                  {this.state.selectedOpportunity.links.map((value, index) =>
                                    <View key={index}>
                                      <Text><TouchableOpacity onPress={() => Linking.openURL(value.url)}><Text>{value.name}</Text></TouchableOpacity></Text>
                                      <View className="spacer"/>
                                    </View>
                                  )}
                                </View>
                              </View>
                              <View className="clear" />
                            </View>
                          )}

                          <View className="spacer"/><View className="spacer"/><View className="spacer"/>
                          <View style={[styles.ctaHorizontalLine]} />

                          <View>
                            {(this.state.alreadyRSVPd === true) ? (
                              <View>
                                <View className="spacer"/><View className="half-spacer"/>
                                <Text className="error-message">You have already RSVPd for this event.</Text>
                              </View>
                            ) : (
                              <View>
                                {(this.state.eventPassed === true) ?   (
                                  <View>
                                    <View className="spacer"/><View className="half-spacer"/>
                                    <Text className="error-message">This event has already passed,</Text>
                                  </View>
                                ) : (
                                  <View>
                                    {this.state.serverSuccessMessage !== '' && <Text className="success-message">{this.state.serverSuccessMessage}</Text>}
                                    {this.state.serverErrorMessage !== '' && <Text className="error-message">{this.state.serverErrorMessage}</Text>}
                                    <TouchableOpacity className={(this.state.disableSubmit) ? "btn btn-primary disabled-background disabled-border" : "btn btn-primary"} disabled={this.state.disableSubmit} onPress={() => this.handleSubmit(this.state.selectedOpportunity.postType)}>RSVP</TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>

                        </View>
                      ) : (
                        <View>
                          <SubComments selectedOpportunity={this.state.selectedOpportunity} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} comments={this.state.comments} postingOrgCode={this.state.postingOrgCode} postingOrgName={this.state.postingOrgName} orgContactEmail={this.state.orgContactEmail} pictureURL={this.state.pictureURL} pageSource={this.state.pageSource}/>
                        </View>
                      )}

                    </View>

                  </View>
                )}

                {(this.state.selectedOpportunity.postType === 'Scholarship') && (
                  <View>
                    <View className="flex-container">
                      <View className="flex-90">
                        <View className="float-left right-padding">
                          <View className="spacer" />
                          <Image source={{ uri: gcLogo}} className="image-auto-48" />
                        </View>
                      </View>

                      <View className="flex-10 right-text">
                        <TouchableOpacity onPress={() => this.favoriteItem(this.state.selectedOpportunity) }>
                          <Image source={(this.state.favorites.includes(this.state.selectedOpportunity._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} className="image-auto-20"/>
                        </TouchableOpacity>
                      </View>

                      <View className="clear" />
                    </View>

                    <View className="super-spacer"/>

                    <View>
                      <Text className="heading-text-2">{this.state.selectedOpportunity.title}</Text>
                      <View className="spacer" />

                      <Text className="description-text-1">{this.state.selectedOpportunity.orgName}</Text>
                      <View className="clear" />
                      <View className="spacer"/><View className="spacer"/>

                      <View className="edit-profile-row">
                        <Text className="heading-text-4">Description</Text>
                        <Text className="keep-line-breaks">{this.state.selectedOpportunity.description}</Text>
                        <View className="spacer"/><View className="spacer"/>
                      </View>
                    </View>

                    {(this.props.fromAdvisor) ? (
                      <View>
                        <View>
                          <View className="edit-profile-row">
                            <Text className="heading-text-4">Endorse a Student for this Posting</Text>
                            <Text>Endorsing a student allows him / her to automatically import that endorsement into scholarship and internship applications.{(this.state.benchmark) && " Clicking the button below will auto-populate the skills and traits information relevant to this posting so that you provide a relevant endorsement."}</Text>
                          </View>

                          <View className="spacer"/><View className="spacer"/>

                          <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.props.navigation.navigate('SendEndorsement', { benchmark: this.state.benchmark })}><Text style={[styles.whiteColor]}>Endorse a Student</Text></TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View>
                        {this.state.serverSuccessMessage !== '' && <Text className="success-message">{this.state.serverSuccessMessage}</Text>}
                        {this.state.serverErrorMessage !== '' && <Text className="error-message">{this.state.serverErrorMessage}</Text>}

                        {this.state.hasApplied ? (
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Apply', { selectedPosting: this.state.selectedOpportunity, application: this.state.application })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.ctaColor]}>Update</Text></TouchableOpacity>
                        ) : (
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Apply', { selectedPosting: this.state.selectedOpportunity, application: this.state.application })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]}><Text style={[styles.ctaColor]}>Apply</Text></TouchableOpacity>
                        )}
                      </View>
                    )}

                  </View>
                )}

                {(this.state.showProjectDetail) ? (
                  <View>
                    {console.log('showProjectDetail 2: ', this.state.showProjectDetail)}
                    <ProjectDetails closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedProject={this.state.selectedOpportunity.submissions[this.state.selectedIndex]} orgCode={this.state.activeOrg} />
                    {console.log('showProjectDetail 3: ', this.state.showProjectDetail)}
                  </View>
                ) : (
                  <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>

                  {(this.state.showJobFunction) && (
                    <View key="showJobFunction" className="full-width padding-20">
                      <Text className="heading-text-2">Job Function</Text>
                      <View className="spacer"/>
                      <Text>We define <Text className="half-bold-text cta-color">job functions</Text> as a category of work that requires similar skills. It can be thought of as synonymous with "departments" within a company. Functions can be the same across different industries. Examples of functions include sales, marketing, finance, engineering, and design.</Text>
                    </View>
                  )}

                  {(this.state.showIndustry) && (
                    <View key="showIndustry" className="full-width padding-20">>
                      <Text className="heading-text-2">Industry</Text>
                      <View className="spacer"/>
                      <Text>We define <Text className="half-bold-text cta-color">industry</Text> as a category of companies that are related based on their primary business activitiees. Companies are generally grouped by their sources of revenue. For example, Nike would fall under "Fashion & Apparel" and Netflix would fall under "Other Entertainment".</Text>
                    </View>
                  )}

                  <View className="row-20">
                   <TouchableOpacity className="btn btn-secondary" onPress={() => this.closeModal()}>Close View</TouchableOpacity>
                  </View>

                 </Modal>
                )}

              </View>
            )}
          </View>
        </View>
    )
  }

}

export default OpportunityDetails;
