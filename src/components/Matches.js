import React, { Component } from 'react';
import { ScrollView, View, Text, TextInput, Image, FlatList, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import Axios from 'axios';
import Modal from 'react-native-modal';
const styles = require('./css/style');
import * as Progress from 'react-native-progress';

const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const careerIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-blue.png';
const employerIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/employer-icon.png';
const courseIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/course-icon-blue.png';
const infoIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/info-icon-dark.png';

class Matches extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matchingCriteria: [
        { name: 'Work Function',  description: 'Scores careers / opportunities the highest that match your preferred work functions indicated in your work preferences assessment', value: 20 },
        { name: 'Industry',  description: 'Scores careers / opportunities the highest that match your preferred industries indicated in your work preferences assessment', value: 10 },
        { name: 'Location',  description: 'Scores careers / opportunities the highest that match your preferred location preferences indicated in your work preferences assessment', value: 0 },
        { name: 'Pay',  description: 'Scores high paying careers / opportunities highest', value: 0 },
        { name: 'Stability',  description: 'Scores careers / opportunities the highest with little variability in pay and job growth', value: 0 },
        { name: 'Interests',  description: 'Scores careers / opportunities the highest that match your interest assessment', value: 15 },
        { name: 'Personality',  description: 'Scores careers / opportunities the highest that match your personality assessment', value: 15 },
        { name: 'Values',  description: 'Scores careers / opportunities that the highest match your values assessment', value: 10 },
        { name: 'Skills',  description: 'Scores careers / opportunities that the highest match your skills assessment', value: 20 },
        { name: 'Education',  description: 'Scores careers / opportunities the highest that match your target education level indicated in work preferences', value: 0 },
        { name: 'Projects',  description: 'Scores careers / opportunities the highest that will likely value your project work the highest', value: 5 },
        { name: 'Experience',  description: 'Scores careers / opportunities the highest that will likely value your experience (that you like)', value: 5 },
      ]
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.renderMatchesView = this.renderMatchesView.bind(this)
    this.renderMatches = this.renderMatches.bind(this)
    this.calculateMatches = this.calculateMatches.bind(this)
    this.favoriteItem = this.favoriteItem.bind(this)
    this.closeModal = this.closeModal.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount editProfile')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const emailId = await AsyncStorage.getItem('email')

      if (emailId !== null) {
        // We have data!!
        // console.log('what is the email of this user', email);

        const cuFirstName = await AsyncStorage.getItem('firstName')
        const cuLastName = await AsyncStorage.getItem('lastName')
        const activeOrg = await AsyncStorage.getItem('activeOrg')
        const orgFocus = await AsyncStorage.getItem('orgFocus')

        this.setState({ emailId, cuFirstName, cuLastName, activeOrg, orgFocus })

        this.props.navigation.setOptions({ headerRight: () => (
          <View>
            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showCalcExplanation: true })}>
              <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                <Image source={{ uri: infoIconDark }} style={[styles.square23,styles.contain]} />
              </View>
            </TouchableOpacity>
          </View>
        )})

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: emailId } })
         .then((response) => {
           console.log('User details query 1 attempted', response.data);

           if (response.data.success) {
              console.log('successfully retrieved user details')

              let favorites = []
              if (response.data.user.favoritesArray) {
                favorites = response.data.user.favoritesArray
                console.log('favorites? ', favorites)
                this.setState({ favorites })
              }

              const careerPathMatches = response.data.user.topCareerMatches
              const employerMatches = response.data.user.topEmployerMatches
              const courseMatches = response.data.user.topCourseMatches
              const eventMatches = response.data.user.topEventMatches
              const projectMatches = response.data.user.topProjectMatches
              const workMatches = response.data.user.topWorkMatches
              const peerMatches = response.data.user.topPeerMatches
              const mentorMatches = response.data.user.topMentorMatches
              const groupMatches = response.data.user.topGroupMatches
              this.setState({ careerPathMatches, employerMatches, courseMatches, eventMatches,
                projectMatches, workMatches, peerMatches, mentorMatches, groupMatches
              })

              Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId } })
               .then((response2) => {
                 console.log('query for assessment results worked');

                 if (response2.data.success) {

                   console.log('actual assessment results', response2.data)

                   let profile = response.data.user
                   profile['workPreferences'] = response2.data.results.workPreferenceAnswers
                   profile['interests'] = response2.data.results.interestScores
                   profile['personality'] = response2.data.results.personalityScores
                   profile['skills'] = response2.data.results.newSkillAnswers
                   profile['gravitateValues'] = response2.data.results.topGravitateValues
                   profile['employerValues'] = response2.data.results.topEmployerValues

                   let matchingCriteria = this.state.matchingCriteria
                   let useCases = this.state.useCases
                   if (response.data.user.matchingPreferences && response.data.user.matchingPreferences.length > 0) {
                     matchingCriteria = response.data.user.matchingPreferences
                   }
                   if (response.data.user.matchingUseCases && response.data.user.matchingUseCases.length > 0) {
                     useCases = response.data.user.matchingUseCases
                   }

                   this.setState({ profile, matchingCriteria, useCases })

                 } else {
                   console.log('no assessment results', response2.data)

                   let matchingCriteria = this.state.matchingCriteria
                   let useCases = this.state.useCases
                   if (response.data.user.matchingPreferences && response.data.user.matchingPreferences.length > 0) {
                     matchingCriteria = response.data.user.matchingPreferences
                   }
                   if (response.data.user.matchingUseCases && response.data.user.matchingUseCases.length > 0) {
                     useCases = response.data.user.matchingUseCases
                   }
                   this.setState({ matchingCriteria, useCases })
                 }

             }).catch((error) => {
                 console.log('query for assessment results did not work', error);
                 let matchingCriteria = this.state.matchingCriteria
                 let useCases = this.state.useCases

                 if (response.data.user.matchingPreferences && response.data.user.matchingPreferences.length > 0) {
                   matchingCriteria = response.data.user.matchingPreferences
                 }
                 if (response.data.user.matchingUseCases && response.data.user.matchingUseCases.length > 0) {
                   useCases = response.data.user.matchingUseCases
                 }
                 this.setState({ matchingCriteria, useCases })
             })

             Axios.get('https://www.guidedcompass.com/api/projects', { params: { emailId, includeCollaborations: true } })
             .then((response2) => {
               console.log('Projects query attempted', response2.data);

                 if (response2.data.success && response2.data.projects) {
                   console.log('successfully retrieved projects')

                   let profile = response.data.user
                   profile['projects'] = response2.data.projects
                   this.setState({ profile })

                 } else {
                   console.log('no project data found', response2.data.message)
                 }

             }).catch((error) => {
                 console.log('Project query did not work', error);
             });

             Axios.get('https://www.guidedcompass.com/api/experience', { params: { emailId } })
             .then((response2) => {
               console.log('Experience query attempted', response2.data);

                 if (response2.data.success && response2.data.experience) {
                   console.log('successfully retrieved experience')

                   let profile = response.data.user
                   profile['experience'] = response2.data.experience
                   this.setState({ profile })

                 } else {
                   console.log('no experience data found', response2.data.message)
                 }

             }).catch((error) => {
                 console.log('Experience query did not work', error);
             });

             Axios.get('https://www.guidedcompass.com/api/story', { params: { emailId } })
             .then((response2) => {
                 console.log('Endorsement query worked', response2.data);

                 if (response2.data.success) {

                   if (response2.data.stories) {
                     let profile = response.data.user
                     profile['endorsements'] = response2.data.stories
                     this.setState({ profile })
                   }
                 } else {
                   console.log('no endorsements found: ', response2.data.message)
                 }

             }).catch((error) => {
                 console.log('Story query did not work', error);
             });

           } else {
            console.log('no user details data found', response.data.message)
           }

         }).catch((error) => {
            console.log('User details query did not work', error);
         });

         Axios.get('https://www.guidedcompass.com/api/workoptions')
         .then((response) => {
           console.log('Work options query tried', response.data);

           if (response.data.success) {
             console.log('Work options query succeeded')

             const hourOptions = response.data.workOptions[0].hourOptions
             const hourlyPayOptions = response.data.workOptions[0].hourlyPayOptions
             const annualPayOptions = response.data.workOptions[0].annualPayOptions
             const employeeCountOptions = response.data.workOptions[0].employeeCountOptions

             this.setState({ hourOptions, hourlyPayOptions, annualPayOptions, employeeCountOptions });
           }
         });

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  calculateMatches(type) {
    console.log('calculateMatches called')

    this.setState({ successMessage: null, errorMessage: null })
    // console.log('got profile? ', this.state.profile)
    if (!this.state.profile) {
      this.setState({ errorMessage: 'Please take career assessments before receiving personalized matches' })
    } else {

      const profile = this.state.profile
      const matchingCriteria = this.state.matchingCriteria
      const useCases = null
      const hourOptions = this.state.hourOptions
      const hourlyPayOptions = this.state.hourlyPayOptions
      const annualPayOptions = this.state.annualPayOptions
      const employeeCountOptions = this.state.employeeCountOptions

      const orgCode = this.state.activeOrg
      const placementPartners = this.state.placementPartners
      const pathway = null
      const resLimit = 3

      const self = this

      if (type === 'careerPaths') {
        this.setState({ careerPathsAnimating: true, careerPathErrorMessage: null })

        const excludeMissingOutlookData = true
        const excludeMissingJobZone = true

        // query postings on back-end
        Axios.put('https://www.guidedcompass.com/api/careers/matches', { profile, matchingCriteria, useCases, excludeMissingOutlookData, excludeMissingJobZone, hourOptions })
        .then((response) => {
          console.log('Career matches attempted', response.data);

            if (response.data.success) {
              console.log('career match query worked')

              let matchScores = response.data.matchScores
              let careerPathMatches = []
              if (response.data.careers && response.data.careers.length > 0) {
                for (let i = 1; i <= 3; i++) {
                  if (response.data.careers[i - 1] && matchScores && matchScores.length > 0) {
                    let career = response.data.careers[i - 1]
                    career['matchScore'] = matchScores[i - 1]
                    careerPathMatches.push(career)
                  }
                }
              }

              this.setState({ careerPathsAnimating: false, careerPathMatches })

            } else {
              console.log('Career match did not work', response.data.message)
              this.setState({ careerPathsAnimating: false, careerPathErrorMessage: { message: 'there was an error: ' + response.data.message }})
            }

        }).catch((error) => {
            console.log('Career match did not work for some reason', error);
            this.setState({ careerPathsAnimating: false, careerPathErrorMessage: { message: 'there was an error' }})
        });
      } else if (type === 'employers') {
        this.setState({ employersAnimating: true, employerErrorMessage: null })

        // query postings on back-end
        Axios.put('https://www.guidedcompass.com/api/employers/matches', { profile, matchingCriteria, useCases, resLimit: 1000, hourOptions, orgCode })
        .then((response) => {
          console.log('Employer matches attempted', response.data);

            if (response.data.success) {
              console.log('employer match query worked')

              let matchScores = response.data.matchScores
              let employerMatches = []
              if (response.data.employers && response.data.employers.length > 0) {
                for (let i = 1; i <= 3; i++) {
                  if (response.data.employers[i - 1] && matchScores && matchScores.length > 0) {
                    let employer = response.data.employers[i - 1]
                    employer['matchScore'] = matchScores[i - 1]
                    employerMatches.push(employer)
                  }
                }
                this.setState({ employersAnimating: false, employerMatches })
              } else {
                this.setState({ employersAnimating: false, employerMatches, errorEmployerMessage: 'Error: we could not find employer matches for you.' })
              }
            } else {
              console.log('employer did not work', response.data.message)
              this.setState({ employersAnimating: false, employerErrorMessage: { message: 'there was an error: ' + response.data.message } })
            }

        }).catch((error) => {
            console.log('Employer match did not work for some reason', error);
            this.setState({ employersAnimating: false, employerErrorMessage: { message: 'there was an unknown error'} })
        });
      } else if (type === 'courses') {
        this.setState({ coursesAnimating: true, courseErrorMessage: null })

        const learningObjectives = [{ name: 'Marketing'}]

        // query postings on back-end
        Axios.put('https://www.guidedcompass.com/api/courses/matches', { profile, matchingCriteria, useCases, learningObjectives })
        .then((response) => {
          console.log('Course matches attempted', response.data);

            if (response.data.success) {
              console.log('employer match query worked')

              if (response.data.courses && response.data.courses.length > 0) {
                let matchScores = response.data.matchScores
                let courseMatches = []
                if (response.data.courses && response.data.courses.length > 0) {
                  for (let i = 1; i <= 3; i++) {
                    if (response.data.courses[i - 1] && matchScores && matchScores.length > 0) {
                      let course = response.data.courses[i - 1]
                      course['matchScore'] = matchScores[i - 1]
                      courseMatches.push(course)
                    }
                  }
                }

                this.setState({ coursesAnimating: false, courseMatches })
              } else {
                this.setState({ coursesAnimating: false, courseErrorMessage: { message: 'Error: we could not find course matches for you.' }})
              }

            } else {
              console.log('course matches did not work', response.data.message)
              this.setState({ coursesAnimating: false, courseErrorMessage: { message: 'there was an error: ' + response.data.message }})
            }

        }).catch((error) => {
            console.log('Employer match did not work for some reason', error);
            this.setState({ careerPathsAnimating: false, courseErrorMessage: { message: 'there was an unknown error'} })
        });
      } else if (type === 'events') {
        this.setState({ eventsAnimating: true, eventErrorMessage: null })

        const postType = null
        const postTypes = ['Event']

        // query postings on back-end
        Axios.put('https://www.guidedcompass.com/api/opportunities/matches', {
          profile, orgCode, placementPartners, postType, postTypes, pathway, matchingCriteria, useCases,
          annualPayOptions, hourlyPayOptions, employeeCountOptions, hourOptions })
        .then((response) => {
          console.log('Opportunity matches attempted', response.data);

            if (response.data.success) {
              console.log('opportunity match query worked')

              let matchScores = response.data.matchScores
              let eventMatches = []
              if (response.data.postings && response.data.postings.length > 0) {
                for (let i = 1; i <= 3; i++) {
                  if (response.data.postings[i - 1] && matchScores && matchScores.length > 0) {
                    let posting = response.data.postings[i - 1]
                    posting['matchScore'] = matchScores[i - 1]
                    eventMatches.push(posting)
                  }
                }
              }

              this.setState({ eventsAnimating: false, eventMatches })

            } else {
              console.log('Opportunity match did not work', response.data.message)
              this.setState({ eventsAnimating: false, eventErrorMessage: { message: 'there was an error: ' + response.data.message }})
            }

        }).catch((error) => {
            console.log('Opportunity match did not work for some reason', error);
            this.setState({ eventsAnimating: false, eventErrorMessage: { message: 'there was an error'} })
        });

      } else if (type === 'projects') {
        this.setState({ projectsAnimating: true, projectErrorMessage: null })

        const postType = null
        const postTypes = ['Assignment','Problem','Challenge']

        // query postings on back-end
        Axios.put('https://www.guidedcompass.com/api/opportunities/matches', {
          profile, orgCode, placementPartners, postType, postTypes, pathway, matchingCriteria, useCases,
          annualPayOptions, hourlyPayOptions, employeeCountOptions, hourOptions })
        .then((response) => {
          console.log('Project matches attempted', response.data);

            if (response.data.success) {
              console.log('project match query worked')

              let matchScores = response.data.matchScores
              let projectMatches = []
              if (response.data.postings && response.data.postings.length > 0) {
                for (let i = 1; i <= 3; i++) {
                  if (response.data.postings[i - 1] && matchScores && matchScores.length > 0) {
                    let posting = response.data.postings[i - 1]
                    posting['matchScore'] = matchScores[i - 1]
                    projectMatches.push(posting)
                  }
                }
              }

              this.setState({ projectsAnimating: false, projectMatches })

            } else {
              console.log('Project match did not work', response.data.message)
              this.setState({ projectsAnimating: false, projectErrorMessage: { message: 'there was an error: ' + response.data.message }})
            }

        }).catch((error) => {
            console.log('Project match did not work for some reason', error);
            this.setState({ projectsAnimating: false, projectErrorMessage: { message: 'there was an error' }})
        });
      } else if (type === 'work') {
        this.setState({ workAnimating: true, workErrorMessage: null })

        const postType = null
        const postTypes = ['Individual','Internship','Work']

        // query postings on back-end
        Axios.put('https://www.guidedcompass.com/api/opportunities/matches', {
          profile, orgCode, placementPartners, postType, postTypes, pathway, matchingCriteria, useCases,
          annualPayOptions, hourlyPayOptions, employeeCountOptions, hourOptions })
        .then((response) => {
          console.log('Opportunity matches attempted', response.data);

            if (response.data.success) {
              console.log('opportunity match query worked')

              let matchScores = response.data.matchScores
              let workMatches = []
              if (response.data.postings && response.data.postings.length > 0) {
                for (let i = 1; i <= 3; i++) {
                  if (response.data.postings[i - 1] && matchScores[i - 1]) {
                    let posting = response.data.postings[i - 1]
                    posting['matchScore'] = matchScores[i - 1]
                    workMatches.push(posting)
                  }
                }
              }

              this.setState({ workAnimating: false, workMatches })

            } else {
              console.log('Opportunity match did not work', response.data.message)
              this.setState({ workAnimating: false, workErrorMessage: { message: 'there was an error: ' + response.data.message }})
            }

        }).catch((error) => {
            console.log('Opportunity match did not work for some reason', error);
            this.setState({ workAnimating: false, workErrorMessage: { message: 'there was an error' }})
        });
      } else if (type === 'peers') {

        this.setState({ peersAnimating: true, peerErrorMessage: null })

        let roleNames = ['Student','Career-Seeker']
        const onlyPics = true

        console.log('show our profile: ', this.state.profile)

        // query postings on back-end
        Axios.put('https://www.guidedcompass.com/api/members/matches', { profile, matchingCriteria, similarityCriteria: null, roleNames, orgCode, onlyPics, specificCriteria: null, resLimit })
        .then((response) => {
          console.log('Peer matches attempted', response.data);

            if (response.data.success) {
              console.log('peer match query worked')


              let peerMatches = response.data.members
              // let matchScores = response.data.matchScores
              self.setState({ peersAnimating: false, peerMatches })

            } else {
              console.log('Peer match did not work', response.data.message)
              self.setState({ peersAnimating: false, peerErrorMessage: { message: 'there was an error: ' + response.data.message }})
            }

        }).catch((error) => {
            console.log('Peer match did not work for some reason', error);
            self.setState({ peersAnimating: false, peerErrorMessage: { message: 'there was an error' }})
        });
      } else if (type === 'mentors') {

        this.setState({ mentorsAnimating: true, mentorErrorMessage: null })

        let roleNames = ['Mentor']

        const onlyPics = true

        console.log('show our profile: ', this.state.profile)

        // query postings on back-end
        Axios.put('https://www.guidedcompass.com/api/members/matches', { profile, matchingCriteria, similarityCriteria: null, roleNames, orgCode, onlyPics, specificCriteria: null, resLimit })
        .then((response) => {
          console.log('Mentor matches attempted', response.data);

            if (response.data.success) {
              console.log('mentor match query worked')


              let mentorMatches = response.data.members
              // let matchScores = response.data.matchScores
              self.setState({ mentorsAnimating: false, mentorMatches })

            } else {
              console.log('Mentor match did not work', response.data.message)
              self.setState({ mentorsAnimating: false, mentorErrorMessage: { message: 'there was an error: ' + response.data.message }})
            }

        }).catch((error) => {
            console.log('Member match did not work for some reason', error);
            self.setState({ mentorsAnimating: false, mentorErrorMessage: { message: 'there was an error'}})
        });
      } else if (type === 'groups') {

        this.setState({ groupsAnimating: true, groupErrorMessage: null })

        let roleNames = ['Student','Career-Seeker']

        Axios.put('https://www.guidedcompass.com/api/groups/matches', { profile, matchingCriteria, roleNames, orgCode, resLimit })
        .then((response) => {
          console.log('Group matches attempted', response.data);

            if (response.data.success) {
              console.log('group match query worked')

              let groupMatches = response.data.groups
              // let matchScores = response.data.matchScores
              self.setState({ groupsAnimating: false, groupMatches })

            } else {
              console.log('Group match did not work', response.data.message)
              self.setState({ groupsAnimating: false, groupErrorMessage: { message: 'there was an error: ' + response.data.message } })
            }

        }).catch((error) => {
            console.log('Group match did not work for some reason', error);
            self.setState({ groupsAnimating: false, groupErrorMessage: { message: 'there was an unknown error' }})
        });
      }
    }
  }

  favoriteItem(item) {
    console.log('favoriteItem called', item)

    let favoritesArray = this.state.favorites

    if (favoritesArray.includes(item._id)) {

      let index = favoritesArray.indexOf(item._id)
      if (index > -1) {
        favoritesArray.splice(index, 1);
      }

      // console.log('favorites', favoritesArray)
      this.setState({ favorites: favoritesArray, errorMessage: null, successMessage: null })

      Axios.post('https://www.guidedcompass.com/api/favorites/save', {
        favoritesArray, emailId: this.state.emailId
      })
      .then((response) => {
        console.log('attempting to save favorites')
        if (response.data.success) {
          console.log('saved successfully', response.data)
          //clear values
          this.setState({ successMessage: 'Favorite saved!'
          })
        } else {
          console.log('did not save successfully')
          this.setState({ errorMessage: 'error:' + response.data.message })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({ errorMessage: 'there was an error saving favorites' })
      });

    } else {

      console.log('adding item: ', favoritesArray, item._id)
      favoritesArray.push(item._id)

      this.setState({ favorites: favoritesArray, errorMessage: null, successMessage: null })

      Axios.post('https://www.guidedcompass.com/api/favorites/save', { favoritesArray, emailId: this.state.emailId })
      .then((response) => {
        console.log('attempting to save favorites')
        if (response.data.success) {
          console.log('saved successfully', response.data)
          //clear values
          this.setState({ successMessage: 'Favorite saved!' })
        } else {
          console.log('did not save successfully')
          this.setState({ errorMessage: 'error:' + response.data.message })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({ errorMessage: 'there was an error saving favorites' })
      });
    }
  }

  renderMatchesView() {
    console.log('renderMatchesView called')

    return (
      <View key="matchesView">
        {/*
        <View style={[styles.spacer]} /><View style={[styles.spacer]} />
        <View style={[styles.row10]}>
          <Text style={[styles.headingText2,styles.centerText]}>My Top Matches</Text>
          <Text style={[styles.centerText,styles.bottomPadding,styles.calcColumn60]}>Matches are calculated based on your <Text style={[styles.boldText]}>career assessments, endorsements, goals, favorites, projects, work experience, education, and completed items.</Text></Text>
        </View>

        <Text style={[styles.centerText,styles.bottomPadding,styles.calcColumn60]}>Matches are calculated based on your <Text style={[styles.boldText]}>career assessments, endorsements, goals, favorites, projects, work experience, education, and completed items.</Text></Text>
        <View style={[styles.spacer]} /><View style={[styles.spacer]} />*/}

        <View style={[styles.card,styles.topMargin30]}>
          <Text style={[styles.headingText4]}>Career Paths</Text>
          {this.renderMatches('careerPaths')}
        </View>

        <View style={[styles.card,styles.topMargin30]}>
          <Text style={[styles.headingText4]}>Employers</Text>
          {this.renderMatches('employers')}
        </View>

        <View style={[styles.card,styles.topMargin30]}>
          <Text style={[styles.headingText4]}>Courses</Text>
          {this.renderMatches('courses')}
        </View>

        <View style={[styles.card,styles.topMargin30]}>
          <Text style={[styles.headingText4]}>Events</Text>
          {this.renderMatches('events')}
        </View>

        <View style={[styles.card,styles.topMargin30]}>
          <Text style={[styles.headingText4]}>Projects</Text>
          {this.renderMatches('projects')}
        </View>

        <View style={[styles.card,styles.topMargin30]}>
          <Text style={[styles.headingText4]}>Work</Text>
          {this.renderMatches('work')}
        </View>

        <View style={[styles.card,styles.topMargin30]}>
          <Text style={[styles.headingText4]}>Peers</Text>
          {this.renderMatches('peers')}
        </View>

        <View style={[styles.card,styles.topMargin30]}>
          <Text style={[styles.headingText4]}>Mentors</Text>
          {this.renderMatches('mentors')}
        </View>

        <View style={[styles.card,styles.topMargin30]}>
          <Text style={[styles.headingText4]}>Groups</Text>
          {this.renderMatches('groups')}
        </View>
      </View>
    )
  }

  renderMatches(type) {
    console.log('renderMatches called', type)

    let animating = false
    if (type === 'careerPaths') {
      animating = this.state.careerPathsAnimating
    } else if (type === 'employers') {
      animating = this.state.employersAnimating
    } else if (type === 'courses') {
      animating = this.state.coursesAnimating
    } else if (type === 'events') {
      animating = this.state.eventsAnimating
    } else if (type === 'projects') {
      animating = this.state.projectsAnimating
    } else if (type === 'work') {
      animating = this.state.workAnimating
    } else if (type === 'peers') {
      animating = this.state.peersAnimating
    } else if (type === 'mentors') {
      animating = this.state.mentorsAnimating
    } else if (type === 'groups') {
      animating = this.state.groupsAnimating
    }

    if (animating) {
      return (
        <View key="animating" style={[styles.flexCenter,styles.flex1]}>
          <View style={[styles.topPadding]}>
            <ActivityIndicator
               animating = {this.state.animating}
               color = '#87CEFA'
               size = "large"
               style={[styles.square80, styles.centerHorizontally]}/>

            <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
            <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Pulling matches...</Text>

          </View>
        </View>
      )
    } else {
      let matches = []
      let errorMessage = { message: 'No matches saved', action: 'Calculate' }
      let itemIcon = careerIcon
      if (type === 'careerPaths') {
        matches = this.state.careerPathMatches
        if (this.state.careerPathErrorMessage) {
          errorMessage = this.state.careerPathErrorMessage
        }
      } else if (type === 'employers') {
        matches = this.state.employerMatches
        if (this.state.employerErrorMessage) {
          errorMessage = this.state.employerErrorMessage
        }
        itemIcon = employerIcon
      } else if (type === 'courses') {
        matches = this.state.courseMatches
        if (this.state.courseErrorMessage) {
          errorMessage = this.state.courseErrorMessage
        }
        itemIcon = courseIconBlue
      } else if (type === 'events') {
        matches = this.state.eventMatches
        if (this.state.eventErrorMessage) {
          errorMessage = this.state.eventErrorMessage
        }
      } else if (type === 'projects') {
        matches = this.state.projectMatches
        if (this.state.projectErrorMessage) {
          errorMessage = this.state.projectErrorMessage
        }
      } else if (type === 'work') {
        matches = this.state.workMatches
        if (this.state.workErrorMessage) {
          errorMessage = this.state.workErrorMessage
        }
      } else if (type === 'peers') {
        matches = this.state.peerMatches
        if (this.state.peerErrorMessage) {
          errorMessage = this.state.peerErrorMessage
        }
      } else if (type === 'mentors') {
        matches = this.state.mentorMatches
        if (this.state.mentorErrorMessage) {
          errorMessage = this.state.mentorErrorMessage
        }
      } else if (type === 'groups') {
        matches = this.state.groupMatches
        if (this.state.groupErrorMessage) {
          errorMessage = this.state.groupErrorMessage
        }
      }

      if (matches && matches.length > 0) {

        let rows = []

        for (let i = 1; i <= matches.length; i++) {
          const value = matches[i - 1]
          const index = i - 1

          let pathname = ''
          let passedState = {}
          let title = ''
          let subtitle = ''
          if (type === 'careerPaths') {
            pathname = 'CareerDetails'
            title = value.name
            subtitle = value.jobFunction
            if (value.jobFunction && value.industry) {
              subtitle = subtitle + ' | ' + value.industry
            } else if (!value.jobFunction && value.industry) {
              subtitle = value.industry
            }

            if (value.jobFamily) {
              subtitle = subtitle + ' | ' + value.jobFamily
            }
            passedState = { careerSelected: value }
          } else if (type === 'employers') {
            pathname = 'EmployerDetails'
            passedState = { selectedEmployer: value }
            title = value.employerName
            subtitle = value.employerIndustry
          } else if (type === 'courses') {
            pathname = null
          } else if (type === 'events') {
            pathname = 'OpportunityDetails'
            title = value.title
            passedState = { selectedOpportunity: value }
            if (value.employerName) {
              subtitle = value.eventType + ' @ ' +  value.employerName
            } else if (value.orgName) {
              subtitle = value.eventType + ' from ' +  value.orgName
            } else {
              subtitle = value.eventType
            }
            passedState = { selectedOpportunity: value, source: 'Student' }
          } else if (type === 'projects') {
            pathname = 'OpportunityDetails'
            passedState = { selectedOpportunity: value }
            title = value.name
            if (value.employerName) {
              subtitle = value.postType + ' from ' +  value.employerName
            } else if (value.orgName) {
              subtitle = value.postType + ' from ' +  value.orgName
            } else {
              subtitle = value.postType
            }

            if (value.duration) {
              subtitle = subtitle + ' | ' + value.duration + ' hours'
            }
          } else if (type === 'work') {
            pathname = 'OpportunityDetails'
            passedState = { selectedOpportunity: value }
            title = value.title
            subtitle = value.employerName
            subtitle = subtitle + ' - ' + value.field
            if (value.payRange && (value.subPostType === 'Full-Time' || value.subPostType === 'Part-Time')) {
              subtitle = subtitle + ' ' + value.payRange
            }

            passedState = { selectedOpportunity: value, source: 'Student' }
          } else if (type === 'peers') {
            pathname = 'Profile'
            passedState = { username: value.username }
            title = value.firstName + ' ' + value.lastName
            if (value.school) {
              subtitle = value.school
              if (value.gradYear) {
                subtitle = subtitle + " " + value.gradYear
              }
            } else {
              subtitle = value.employerName
            }

          } else if (type === 'mentors') {
            pathname = 'AdvisorProfile'
            passedState = { username: value.username }
            title = value.firstName + ' ' + value.lastName
            if (value.school) {
              subtitle = value.school
              if (value.gradYear) {
                subtitle = subtitle + " " + value.gradYear
              }
            } else {
              subtitle = value.employerName
            }

          } else if (type === 'groups') {
            pathname = 'GroupDetails'
            passedState = { selectedGroup: value }
            title = value.name
            subtitle = value.category
          }

          rows.push(
            <View key={"matches" + type + index}>
              <View style={[styles.spacer]} />

              <View style={[styles.rowDirection]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate(pathname, passedState)} style={[styles.rowDirection,styles.calcColumn105]}>
                  <View style={[styles.width60]}>
                    {(value.matchScore || value.matchScore === 0) ? (
                      <View style={[styles.rightPadding]}>
                        <Progress.Circle progress={value.matchScore / 100} size={styles.width50.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                      </View>
                    ) : (
                      <Image source={{ uri: itemIcon}} style={[styles.square50,styles.topMargin5,styles.centerItem]}/>
                    )}
                  </View>
                  <View style={[styles.calcColumn185]}>
                    <Text style={[styles.headingText5]}>{title}</Text>
                    <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>{subtitle}</Text>
                  </View>
                </TouchableOpacity>

                <View style={[styles.width30,styles.topMargin15]}>
                  <TouchableOpacity onPress={() => this.favoriteItem(value) }>
                    <Image source={(this.state.favorites.includes(value._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                  </TouchableOpacity>
                </View>

                <View style={[styles.width25,styles.leftPadding]}>
                  <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerSelected: value })}>
                    <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain,styles.pinRight]}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
              <View style={[styles.horizontalLine]} />

              <View style={[styles.spacer]} />
            </View>
          )
        }

        rows.push(
          <View key="calculateMatches" style={[styles.centerText,styles.row10]}>
            <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.calculateMatches(type) }><Text style={[styles.descriptionText1,styles.whiteColor]}>{errorMessage.action}</Text></TouchableOpacity>
          </View>
        )

        return rows

      } else {
        return (
          <View key={"matches" + type}>
            {(errorMessage) && (
              <View>
                <Text style={[styles.topPadding20,styles.errorColor]}>{errorMessage.message}</Text>
                {(errorMessage.action === 'Calculate') && (
                  <View style={[styles.row10]}>
                    <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.calculateMatches(type) }><Text style={[styles.descriptionText1,styles.whiteColor]}>{errorMessage.action}</Text></TouchableOpacity>
                  </View>
                )}
              </View>
            )}
          </View>
        )
      }
    }
  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showCalcExplanation: false })

  }

  render() {

      return (
          <ScrollView>
            <View>
              {this.renderMatchesView()}
            </View>

            <Modal isVisible={this.state.modalIsOpen} style={[styles.modal]}>
              {(this.state.showCalcExplanation) && (
                <View style={[styles.flex1,styles.padding30,styles.topMargin20]}>
                  <Text style={[styles.centerText,styles.bottomPadding,styles.calcColumn100,styles.headingText4]}>How Matches are Calculated</Text>
                  <Text style={[styles.centerText,styles.bottomPadding,styles.calcColumn100,styles.standardText,styles.topMargin20]}>Matches are calculated based on your <Text style={[styles.boldText]}>career assessments, endorsements, goals, favorites, projects, work experience, education, and completed items.</Text></Text>

                  <View style={[styles.horizontalPadding20,styles.topPadding20]}>
                    <TouchableOpacity onPress={() => this.closeModal()} style={[styles.btnSquarish,styles.ctaBorder,styles.flexCenter]}>
                      <Text style={[styles.standardText,styles.ctaColor]}>Close Modal</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </Modal>
          </ScrollView>

      )
  }
}

export default Matches;
