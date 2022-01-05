import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';
import * as Progress from 'react-native-progress';

const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const matchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/match-icon.png';
const matchIconSelected = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/match-icon-selected.png';
const filterIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/filter-icon.png';
const filterIconSelected = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/filter-icon-selected.png';
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';
const socialIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-dark.png';

import SubSendMessage from '../../components/common/SendMessage';

class PeopleMatching extends Component {
  constructor(props) {
    super(props)
    this.state = {
      members: [],
      favorites: [],
      friends: [],

      genderOptions: [],
      raceOptions: [],
      ageRangeOptions: [],
      proximityOptions: [],

      disableCustomMatches: true
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.renderProfiles = this.renderProfiles.bind(this)
    this.calculateMatches = this.calculateMatches.bind(this)
    this.toggleSearchBar = this.toggleSearchBar.bind(this)
    this.favoriteItem = this.favoriteItem.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.followPerson = this.followPerson.bind(this)

  }

  componentDidMount() {
    console.log('peopleMatching component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ', this.props, prevProps)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      console.log('t0 will update')
      this.retrieveData()
    } else if (this.props.userType !== prevProps.userType) {
      this.retrieveData()
    } else if (this.props.selectedGoal !== prevProps.selectedGoal) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      console.log('this is causing the error')
      const emailId = await AsyncStorage.getItem('email')
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

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, orgFocus, orgName, remoteAuth
        })

        const userType = this.props.userType

        let similarityCriteria = [
          { name: 'Overall', description: 'Returns people who are overall most similar to your profile', selected: true, disabled: this.state.disableCustomMatches },
          { name: 'Career Goals', description: 'Returns people who share your career goals', selected: false, disabled: this.state.disableCustomMatches },
          { name: 'Interests', description: 'Returns people who share your interests', selected: false, disabled: this.state.disableCustomMatches },
          { name: 'Personality', description: 'Returns people who share your personality', selected: false, disabled: this.state.disableCustomMatches },
          { name: 'Values', description: 'Returns people who share your values', selected: false, disabled: this.state.disableCustomMatches },
          { name: 'Skills', description: 'Returns people who share your skills', selected: false, disabled: this.state.disableCustomMatches },
          { name: 'Functional Area', description: 'Returns people who share your interest for functional areas', selected: false, disabled: this.state.disableCustomMatches },
          { name: 'Industry', description: 'Returns people who share your interest for industries', selected: false, disabled: this.state.disableCustomMatches },
          { name: 'Cohort', description: 'Returns people who are similar in age and who are close by', selected: false, disabled: this.state.disableCustomMatches },
          { name: 'Teammates', description: 'Similar age, goals, values, and industries; Different interests, functional areas, personality, and skills.', selected: false, disabled: this.state.disableCustomMatches },
        ]

        this.setState({ emailId, activeOrg, username, cuFirstName, cuLastName, orgFocus, similarityCriteria, userType })

        let roleNames = ['Student','Career-Seeker']
        if (userType === 'Mentors') {
          roleNames = ['Mentor']
        } else if (!userType) {
          roleNames = ['Student','Career-Seeker']
        }

        const orgCode = activeOrg
        const onlyPics = true
        const limit = 100

        console.log('org: ', orgCode)

        if (this.props.pageSource !== 'Goal') {
          Axios.get('https://www.guidedcompass.com/api/org/members', { params: { orgCode, roleNames, onlyPics, limit } })
          .then((response) => {
            console.log('Members query attempted', response.data);

              if (response.data.success) {
                console.log('members query worked')

                let members = response.data.members
                this.setState({ members })

              } else {
                console.log('members query did not work', response.data.message)
              }

          }).catch((error) => {
              console.log('Members query did not work for some reason', error);
          });
        }

        Axios.get('https://www.guidedcompass.com/api/friends', { params: { orgCode: activeOrg, emailId } })
        .then((response) => {
          console.log('Friends query attempted', response.data);

            if (response.data.success) {
              console.log('friends query worked')

              const friends = response.data.friends
              this.setState({ friends })

            } else {
              console.log('friends query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Friends query did not work for some reason', error);
        })

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: emailId } })
        .then((response) => {
          console.log('User details query 1 attempted', response.data);

          if (response.data.success) {
             console.log('successfully retrieved user details')

             let profile = { firstName: cuFirstName, lastName: cuLastName, email: emailId }
             profile['zipcode'] = response.data.user.zipcode

             // pulling these out for followPerson()
             const pictureURL = response.data.user.pictureURL
             const headline = response.data.user.headline

             this.setState({ profile, pictureURL, headline });

             Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId } })
              .then((response2) => {
                console.log('query for assessment results worked');

                if (response2.data.success) {

                  console.log('actual assessment results', response2.data)

                  // let profile = { firstName: cuFirstName, lastName: cuLastName, email: emailId }
                  profile['workPreferences'] = response2.data.results.workPreferenceAnswers
                  profile['interests'] = response2.data.results.interestScores
                  profile['personality'] = response2.data.results.personalityScores
                  profile['skills'] = response2.data.results.newSkillAnswers
                  profile['gravitateValues'] = response2.data.results.topGravitateValues
                  profile['employerValues'] = response2.data.results.topEmployerValues
                  profile['selectedGoal'] = this.props.selectedGoal

                  this.setState({ profile })

                  console.log('show selectedGoal: ', this.props.selectedGoal)
                  if (this.props.pageSource === 'Goal' && this.props.selectedGoal) {
                    this.calculateMatches(true, true, false, [this.props.pageSource], 1000)
                  }

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

        Axios.get('https://www.guidedcompass.com/api/workoptions')
        .then((response) => {
          console.log('Work options query tried', response.data);

          if (response.data.success) {
            console.log('Work options query succeeded')

            let genderOptions = []
            for (let i = 1; i <= response.data.workOptions[0].genderOptions.length; i++) {
              if (response.data.workOptions[0].genderOptions[i - 1] !== 'Do not disclose') {
                genderOptions.push(response.data.workOptions[0].genderOptions[i - 1])
              }
            }
            genderOptions.unshift('Any Gender')

            let raceOptions = []
            for (let i = 1; i <= response.data.workOptions[0].raceOptions.length; i++) {
              if (response.data.workOptions[0].raceOptions[i - 1] !== 'Do not disclose') {
                raceOptions.push(response.data.workOptions[0].raceOptions[i - 1])
              }
            }
            raceOptions.unshift('Any Race')

            let ageRangeOptions = response.data.workOptions[0].ageRangeOptions
            ageRangeOptions.unshift('Any Age')
            let proximityOptions = response.data.workOptions[0].proximityOptions
            proximityOptions.unshift('Any Distance')

            this.setState({ genderOptions, raceOptions, ageRangeOptions, proximityOptions })

          }
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler = (eventName,eventValue) => {
    console.log('formChangeHandler called')

    if (eventName === 'search') {
      console.log('in search')
      const searchString = eventValue
      this.setState({ searchString, animating: true })
      this.filterResults(eventValue, null, null, true)

    } else if (eventName.includes('filter|')) {

      const nameArray = eventName.split("|")
      this.setState({ [nameArray[1]]: eventValue, animating: true })
      this.filterResults(this.state.searchString, nameArray[1], eventValue, false)

    } else if (eventName.includes('sort|')) {

      if (this.state.showFilters) {

      } else {
        let sorters = this.state.itemSorters

        const nameArray = eventName.split("|")
        const field = nameArray[1]

        for (let i = 1; i <= sorters.length; i++) {
          if (sorters[i - 1].name === field) {
            sorters[i - 1]['value'] = eventValue
          }
        }

        let itemSorters = sorters

        //reset everything
        let searchString = ''
        let itemFilters = this.state.itemFilters
        for (let i = 1; i <= itemFilters.length; i++) {
          itemFilters[i - 1]['value'] = this.state.defaultFilterOption
        }

        for (let i = 1; i <= itemSorters.length; i++) {
          if (itemSorters[i - 1].name !== field) {
            itemSorters[i - 1]['value'] = this.state.defaultSortOption
          }
        }

        this.setState({ searchString, itemFilters, itemSorters, animating: true })

        this.sortResults(eventValue, field)
      }

    }
  }

  filterResults(searchString, filterName, filterValue, search) {
    console.log('filterResults called', searchString, filterName, filterValue, search)

    let roleNames = ['Student','Career-Seeker']
    if (this.state.userType === 'Mentors') {
      roleNames = ['Mentor']
    } else if (!this.state.userType) {
      roleNames = ['Student','Career-Seeker']
    }

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      const orgCode = self.state.activeOrg
      const excludeCurrentUser = true
      const emailId = self.state.emailId

      if (search) {
        Axios.get('https://www.guidedcompass.com/api/members/search', { params: { searchString, orgCode, roleNames, excludeCurrentUser, emailId } })
        .then((response) => {
          console.log('Opportunity search query attempted', response.data);

            if (response.data.success) {
              console.log('member search query worked')

              let members = response.data.members
              self.setState({ members, filteredResults: true, animating: false })

            } else {
              console.log('opportunity search query did not work', response.data.message)

              let members = []
              self.setState({ members, animating: false })

            }

        }).catch((error) => {
            console.log('Search query did not work for some reason', error);
            self.setState({ animating: false })
        });
      } else {
        console.log('filter results: ', searchString, orgCode, filterName, filterValue)

        const onlyPics = true
        const profile = self.state.profile
        let users = self.state.members
        // if (self.state.members && self.state.members[0] && self.state.members[0].matchScore) {
        //   users = self.state.members
        // }

        // eventually query members from back-end
        Axios.put('https://www.guidedcompass.com/api/members/filter', { searchString, orgCode, filterName, filterValue, roleNames, onlyPics, profile, users })
        .then((response) => {
          console.log('Opportunity search query attempted', response.data);

            if (response.data.success) {
              console.log('opportunity search query worked')

              let members = response.data.members
              const filterCriteriaArray = response.data.filterCriteriaArray
              self.setState({ members, filterCriteriaArray, filteredResults: true, animating: false })

            } else {
              console.log('opportunity search query did not work', response.data.message)

              self.setState({ animating: false })

            }

        }).catch((error) => {
            console.log('Search query did not work for some reason', error);
            self.setState({ animating: false })
        });

      }
    }

    const delayFilter = () => {
      console.log('delayFilter called: ')
      clearTimeout(self.state.timerId)
      self.state.timerId = setTimeout(officiallyFilter, 1000)
    }

    delayFilter();
  }

  calculateMatches(matchingView, calcMatches, newPreferences, specificCriteria, resLimit) {
    console.log('calculateMatches called', matchingView, calcMatches, newPreferences, specificCriteria, resLimit)

    if (matchingView) {

      this.setState({ matchingView: true, errorMessage: null })

      if (!this.state.profile) {
        this.setState({ animating: false, matchingView: true, errorMessage: 'Please take career assessments before receiving personalized matches' })
      } else {
        this.setState({ animating: true, modalIsOpen: false })

        const profile = this.state.profile
        const matchingCriteria = this.state.matchingCriteria
        const similarityCriteria = this.state.similarityCriteria
        let roleNames = ['Student','Career-Seeker']
        if (this.state.userType === 'Mentors') {
          roleNames = ['Mentor']
        }
        const orgCode = this.state.activeOrg
        const onlyPics = true

        console.log('show our profile: ', this.state.profile)

        const self = this

        function officiallyCalculate() {
          console.log('officiallyCalculate called')

          // query postings on back-end
          Axios.put('https://www.guidedcompass.com/api/members/matches', { profile, matchingCriteria, similarityCriteria, roleNames, orgCode, onlyPics, specificCriteria, resLimit })
          .then((response) => {
            console.log('Member matches attempted', response.data);

              if (response.data.success) {
                console.log('opportunity match query worked')

                let members = response.data.members
                // let matchScores = response.data.matchScores
                self.setState({ animating: false, matchingView: true, members })

              } else {
                console.log('Career match did not work', response.data.message)
                self.setState({ animating: false, matchingView: true, errorMessage: 'there was an error: ' + response.data.message })
              }

          }).catch((error) => {
              console.log('Career match did not work for some reason', error);
              self.setState({ animating: false, matchingView: true, errorMessage: 'there was an error' })
          });
        }

        if (newPreferences) {
          console.log('new preferences stated')

          if (this.state.disableCustomMatches) {
            this.setState({ animating: false, modalIsOpen: true, matchingView: true, errorMessage: 'Ability to customize your matches is coming soon!' })
          } else {
            const emailId = this.state.emailId

            let savePrefences = false
            if (!savePrefences) {
              officiallyCalculate()
            } else {

              const matchingPreferences = matchingCriteria
              const similarityCriteria = this.state.similarityCriteria
              const updatedAt = new Date()

              Axios.post('https://www.guidedcompass.com/api/users/profile/details', {
                emailId, matchingPreferences, similarityCriteria, updatedAt })
              .then((response) => {

                if (response.data.success) {
                  console.log('successfully saved new preferences')
                  officiallyCalculate()

                } else {
                  console.log('request was not successful')
                  officiallyCalculate()
                }
              }).catch((error) => {
                  console.log('Saving the info did not work', error);
                  officiallyCalculate()
              });
            }
          }

        } else {
          officiallyCalculate()
        }
      }
    } else {
      this.setState({ matchingView: false, errorMessage: null })
    }
  }

  followPerson(e, person) {
    console.log('followPerson called', e, person)

    e.stopPropagation()
    e.preventDefault()

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

  renderProfiles() {
    console.log('renderProfiles called')

    let rows = []

    if (this.state.members) {
      for (let i = 1; i <= this.state.members.length; i++) {

        const index = i - 1

        let matchScore = this.state.members[i - 1].matchScore
        // const matchScore = 50
        // if (this.state.matchScores) {
        //   if (this.state.filteredResults) {
        //     matchScore = null
        //   } else if (this.state.matchScores[i - 1]) {
        //     matchScore = this.state.matchScores[i - 1]
        //   }
        // }

        rows.push(
          <View key={i}>
            <View>
              <TouchableOpacity onPress={(this.state.userType === 'Peers') ? () => this.props.navigation.navigate('Profile', { username: this.state.members[i - 1].username}) : () => this.props.navigation.navigate('AdvisorProfile', { username: this.state.members[i - 1].username})}>
                <View style={[styles.card,styles.centerHorizontally,styles.fullScreenWidth,styles.topMargin20]}>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.flex15]}>
                      {(matchScore) ? (
                        <View style={[styles.flex1]}>
                          <Progress.Circle progress={matchScore / 100} size={styles.width50.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                        </View>
                      ) : (
                        <View />
                      )}
                    </View>
                    <View style={[styles.flex70, styles.flexCenter]}>
                      {(this.state.members[i - 1].pictureURL) ? (
                        <Image source={{ uri: this.state.members[i - 1].pictureURL}} style={[styles.square100,styles.contain, { borderRadius: 50 }]} />
                      ) : (
                        <Image source={{ uri: profileIconDark}} style={[styles.square60,styles.contain]} />
                      )}
                    </View>
                    <View style={[styles.flex15]}>
                      {(this.props.pageSource === 'Profiles') ? (
                        <View>
                          {(this.state.members[i - 1].publicProfile) ? (
                            <View>
                              {(this.state.members[i - 1].publicProfileExtent) ? (
                                <Text style={[styles.ctaColor,styles.descriptionText4]}>{this.state.members[i - 1].publicProfileExtent}</Text>
                              ) : (
                                <Text style={[styles.ctaColor,styles.descriptionText4]}>PUBLIC</Text>
                              )}
                            </View>
                          ) : (
                            <View>
                              <Text style={[styles.errorColor,styles.descriptionText4]}>PRIVATE</Text>
                            </View>
                          )}
                        </View>
                      ) : (
                        <TouchableOpacity disabled={this.state.isSaving} onPress={() => this.favoriteItem(this.state.members[index]) } style={[styles.alignEnd]}>
                          <Image source={(this.state.favorites.includes(this.state.members[i - 1]._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>

                  <Text style={[styles.centerText,styles.headingText5,styles.topPadding]}>{this.state.members[i - 1].firstName} {this.state.members[i - 1].lastName}</Text>
                  {(this.state.members[i - 1].school) ? (
                    <Text style={[styles.centerText,styles.descriptionText2,styles.topPadding]}>{this.state.members[i - 1].school}{this.state.members[i - 1].gradYear && " '" + this.state.members[i - 1].gradYear}</Text>
                  ) : (
                    <View />
                  )}
                  {(this.state.members[i - 1].major) ? (
                    <Text style={[styles.centerText,styles.descriptionText1,styles.topPadding5]}>{this.state.members[i - 1].major}</Text>
                  ) : (
                    <View />
                  )}

                  <View style={[styles.topPadding20]}>
                    {(this.props.pageSource === 'Profiles') ? (
                      <View>
                        {(this.state.friends.some(friend => (friend.friend1Email === this.state.members[i - 1].email) || friend.friend2Email === this.state.members[i - 1].email)) ? (
                          <View>
                            {(this.state.friends.some(friend => friend.active)) ? (
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages', { recipient: this.state.members[i - 1]})}>
                                <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]}>
                                  <Text style={[styles.descriptionText1,styles.ctaColor]}>Message</Text>
                                </TouchableOpacity>
                              </TouchableOpacity>
                            ) : (
                              <TouchableOpacity style={[styles.btnSquarish,styles.mediumBackground, styles.flexCenter]} disabled={true}><Text style={[styles.whiteColor,styles.descriptionText1]}>Pending</Text></TouchableOpacity>
                            )}
                          </View>
                        ) : (
                          <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={(e) => this.followPerson(e,this.state.members[i - 1])}><Text style={[styles.descriptionText1,styles.whiteColor]}>Connect</Text></TouchableOpacity>
                        )}
                      </View>
                    ) : (
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages', { recipient: this.state.members[i - 1]})}>
                        <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]}>
                          <Text style={[styles.descriptionText1,styles.whiteColor]}>Message</Text>
                        </TouchableOpacity>
                      </TouchableOpacity>
                    )}
                  </View>

                  {(this.state.filterCriteriaArray && this.state.filterCriteriaArray.length > 0 && this.state.filterCriteriaArray.length === this.state.members.length) && (
                    <View style={[styles.topPadding]}>
                      <Text style={[styles.errorColor,styles.descriptionText2]}>{this.state.filterCriteriaArray[i - 1].name}: {this.state.filterCriteriaArray[i - 1].criteria}</Text>
                    </View>
                  )}

                  <View style={[styles.spacer]} />
                </View>
              </TouchableOpacity>
            </View>


            <View style={[styles.spacer]} />

          </View>
        )
      }
    }

    return rows

  }

  favoriteItem(item, type) {
    console.log('favoriteItem called', item, type, this.state.members)

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


  toggleSearchBar(action) {
    console.log('toggleSearchBar called ', action)

    let showingSearchBar = this.state.showingSearchBar
    if (showingSearchBar) {
      showingSearchBar = false
    } else {
      showingSearchBar = true
    }

    this.setState({ showingSearchBar })
  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showMessageWidget: false, showMatchingCriteria: false })
  }

  itemClicked(name, value) {
    console.log('itemClicked called', name, value)

    const nameArray = name.split("|")
    const index = Number(nameArray[1].trim())

    let similarityCriteria = this.state.similarityCriteria
    // similarityCriteria[index]["value"] = eventValue
    for (let i = 1; i <= similarityCriteria.length; i++) {
      console.log('compare indices: ', i - 1, index)
      if (i - 1 === index) {
        similarityCriteria[i - 1]["selected"] = true
      } else {
        similarityCriteria[i - 1]["selected"] = false
      }
    }

    this.setState({ similarityCriteria })
  }

  render() {

    return (
      <View style={[styles.topMargin20]}>

        {(this.props.pageSource !== 'Goal') && (
          <View>
            {(this.state.matchingView) ? (
              <View style={[styles.rowDirection]}>
                <View style={[styles.calcColumn50,styles.rowDirection]}>
                  <TouchableOpacity style={[styles.rightMargin]} onPress={() => this.setState({ modalIsOpen: true, showMatchingCriteria: true })}>
                    <View style={[styles.slightlyRoundedCorners,styles.row5,styles.horizontalPadding30,styles.ctaBackgroundColor,styles.ctaBorder]}>
                      <Text style={[styles.standardText,styles.whiteColor]}>Adjust</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.calculateMatches(false, false, false)}>
                    <View style={[styles.rightPadding,styles.standardBorder,styles.slightlyRoundedCorners,styles.row5,styles.horizontalPadding30]}>
                      <Text style={[styles.standardText,styles.ctaColor]}>Close</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                </View>
                <View style={[styles.topPadding8,styles.leftPadding3,styles.topMarginNegative3,styles.width50]}>
                  <TouchableOpacity onPress={() => this.calculateMatches(false, false, false)}>
                    <Image source={{ uri: matchIconSelected}} style={[styles.square30,styles.contain,styles.rightMargin]} />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View>
                <View style={[styles.fullScreenWidth,styles.row5,styles.whiteBackground,styles.standardBorder,styles.mediumShadow,styles.rowDirection]}>
                  <View style={(this.state.matchingView) ? [styles.fullScreenWidth] : [styles.width50,styles.flexCenter]}>
                    <TouchableOpacity style={(this.state.matchingView) ? [] : [styles.flex1,styles.bottomPadding,styles.flexCenter]} onPress={() => this.calculateMatches(true, true, false)}>
                      <Image source={(this.state.matchingView) ? { uri: matchIconSelected} : { uri: matchIcon}} style={[styles.square30,styles.contain,styles.rightMargin,styles.topMargin]}/>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.row3,styles.whiteBackground,styles.calcColumn100,styles.rowDirection]}>
                    <View style={[styles.topMargin15,styles.rightPadding5]}>
                      <Image source={{ uri: searchIcon}} style={[styles.square18,styles.contain,styles.padding5]}/>
                    </View>
                    <View style={[styles.calcColumn130]}>
                      <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                      <TextInput
                        style={[styles.topMargin,styles.descriptionText2]}
                        onChangeText={(text) => this.formChangeHandler("search", text)}
                        value={this.state.searchString}
                        placeholder={(this.state.userType === 'Peers') ? "Search peers and potential team members..." : "Search..."}
                        placeholderTextColor="grey"
                      />
                    </View>
                  </View>
                  <View style={[styles.width50,styles.flexCenter]}>
                    <TouchableOpacity style={[styles.flex1,styles.bottomPadding,styles.flexCenter]} onPress={() => this.toggleSearchBar('show')}>
                      <Image source={(this.state.showingSearchBar) ? { uri: filterIconSelected} : { uri: filterIcon}} style={[styles.square25,styles.topMargin]}/>
                    </TouchableOpacity>
                  </View>

                </View>
              </View>
            )}

            {(this.state.showingSearchBar) && (
              <View style={[styles.padding20,styles.standardBorder,styles.topMargin20]}>
                <View>
                  <View style={[styles.row10]}>
                    <Text style={[styles.row10]}>Filter Options</Text>

                    <View style={[styles.rowDirection,styles.flexWrap]}>
                      <View style={[styles.row10,styles.rightPadding20]}>
                        <View style={[styles.lightBorder,styles.rowDirection]}>
                          <View style={[styles.rightPadding,styles.leftPadding,styles.topMarginNegative2]}>
                            <View style={[styles.spacer]} />
                            <Text style={[styles.descriptionTextColor]}>Age Range</Text>
                          </View>
                          <View>
                            <Picker
                              selectedValue={this.state.ageRange}
                              onValueChange={(itemValue, itemIndex) =>
                                this.formChangeHandler("filter|ageRange",itemValue)
                              }>
                              {this.state.ageRangeOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                            </Picker>
                          </View>
                          <View style={[styles.topPadding17,styles.horizontalPadding3,styles.rightMargin5]}>
                            <Image source={{ uri: dropdownArrow}}/>
                          </View>
                        </View>
                      </View>

                      <View style={[styles.row10,styles.rightPadding20]}>
                        <View style={[styles.lightBorder,styles.rowDirection]}>
                          <View style={[styles.rightPadding,styles.leftPadding,styles.topMarginNegative2]}>
                            <View style={[styles.spacer]} />
                            <Text style={[styles.descriptionTextColor]}>Maximum Distance</Text>
                          </View>
                          <View>
                            <Picker
                              selectedValue={this.state.proximity}
                              onValueChange={(itemValue, itemIndex) =>
                                this.formChangeHandler("filter|proximity",itemValue)
                              }>
                              {this.state.proximityOptions.map(value => <Picker.Item key={value} label={value} value={value} />)}
                            </Picker>
                          </View>
                          <View style={[styles.topPadding17,styles.horizontalPadding3,styles.rightMargin5]}>
                            <Image source={{ uri: dropdownArrow}}/>
                          </View>
                        </View>
                      </View>
                    </View>

                  </View>
                </View>
              </View>
            )}

            {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor]}>{this.state.errorMessage}</Text>}
            <View style={[styles.spacer]} /><View style={[styles.spacer]} />
          </View>
        )}

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

            {(this.state.members && this.state.members.length > 0) ? (
              <View>
                {this.renderProfiles()}

              </View>
            ) : (
              <View>
                <View style={[styles.card]}>
                  <View style={[styles.flex1,styles.row20,styles.flexCenter]}>
                    <Image source={{ uri: socialIconDark}} style={[styles.square100,styles.contain]} />

                    <View style={[styles.row20]}>
                      <Text style={[styles.centerText,styles.headingText2]}>{(this.state.userType === 'Mentors') ? "Mentors" : "Peers"}</Text>
                      {(this.state.userType === 'Mentors') ? (
                        <View>
                          <Text style={[styles.centerText,styles.topPadding20,styles.horizontalPadding30]}>This page allows you to browse, search, filter, and match to mentors based on your profile information.</Text>
                        </View>
                      ) : (
                        <View>
                          <Text style={[styles.centerText,styles.topPadding20,styles.horizontalPadding30]}>This page allows you to browse, search, filter, and match to peers based on your profile information. This is a great way to form teams for projects and challenges</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {(this.state.inBeta) && (
                    <View style={[styles.bottomPadding]}>
                      <Text style={[styles.errorColor,styles.centerText,styles.calcColumn60]}>This feature is coming soon. It is currently being developed.</Text>
                    </View>
                  )}
                </View>
              </View>
            )}

          </View>
        )}

        <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>

          {(this.state.showMatchingCriteria) && (
            <ScrollView key="showMatchingCriteria" style={[styles.calcColumn80,styles.padding20]}>
              <View>
                <Text style={[styles.headingText2]}>Adjust Matching Criteria</Text>
                <View style={[styles.spacer]} />

                <View style={[styles.row10]}>
                  <View style={[styles.flex1,styles.rowDirection]}>
                    <TouchableOpacity style={[styles.flex1]} onPress={() => this.setState({ customAdjustment: false })}>
                      <View style={(this.state.customAdjustment) ? [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20] : [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20,styles.ctaBackgroundColor]}>
                        <Text style={(this.state.customAdjustment) ? [styles.descriptionText1,styles.centerText] : [styles.descriptionText1,styles.whiteColor,styles.centerText]}>by Similarity</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity style={[styles.flex1]} onPress={() => this.setState({ customAdjustment: true })}>
                      <View style={(this.state.customAdjustment) ? [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20,styles.ctaBackgroundColor] : [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20]}>
                        <Text style={(this.state.customAdjustment) ? [styles.descriptionText1,styles.whiteColor,styles.centerText] : [styles.descriptionText1,styles.centerText]}>{(this.state.userType === 'Peers') ? "Design Your Teammate" : "Design Your Mentor"}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.spacer]} />
                </View>

                {(this.state.customAdjustment) ? (
                  <View>
                    {(this.state.disableCustomMatches) && (
                      <View style={[styles.bottomPadding]}>
                        <Text style={[styles.errorColor]}>Ability to customize your matches is coming soon</Text>
                      </View>
                    )}

                    {(this.state.matchingCriteria) && (
                      <View>
                        {this.state.matchingCriteria.map((value ,index) =>
                          <View key={"c" + index} style={(value.name === 'Location') && [styles.washOut2]}>
                            <View style={[styles.calcColumn180]}>
                              <Text style={[styles.boldText]}>{index + 1}. {value.name}</Text>
                              <View style={[styles.halfSpacer]} />
                              <Text style={[styles.descriptionText3]}>{value.description}</Text>
                            </View>
                            <View style={[styles.width100,styles.rightText]}>
                              <View style={[styles.width70]}>
                                <TextInput
                                  style={[styles.textInput,styles.headingText1,styles.ctaColor,styles.boldText,styles.rightText,styles.standardBorder]}
                                  onChangeText={(text) => this.formChangeHandler("custom|" + index, text)}
                                  value={value.value}
                                  placeholder={(this.state.userType === 'Peers') ? "Search peers and potential team members..." : "Search..."}
                                  placeholderTextColor="grey"
                                  keyboardType="numeric"
                                  disabled={(value.name === 'Location') ? true : false}
                                  maxLength={3}
                                />
                              </View>
                              <View style={[styles.width30]}>
                                <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                                <Text style={[styles.headingText2,styles.ctaColor,styles.boldText]}>%</Text>
                              </View>
                            </View>

                            <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

                          </View>
                        )}

                        <View>
                          <View style={[styles.ctaHorizontalLine]} />
                          <View style={[styles.spacer]} />
                          <View style={[styles.calcColumn80]}>
                            <Text style={[styles.headingText2,styles.ctaColor,styles.boldText,styles.rightText]}>{this.state.totalPercent}%</Text>
                          </View>

                          {(this.state.totalPercent !== 100) && (
                            <View style={[styles.calcColumn80]}>
                              <Text style={[styles.errorColor,styles.rightText]}>Please adjust percentages to equal 100%</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <View>
                    {(this.state.similarityCriteria) && (
                      <View>
                        {(this.state.disableCustomMatches) && (
                          <View style={[styles.bottomPadding]}>
                            <Text style={[styles.errorColor]}>Ability to customize your matches is coming soon</Text>
                          </View>
                        )}

                        {this.state.similarityCriteria.map((value ,index) =>
                          <View key={"u" + index} style={(value.disabled) && [styles.washOut2]}>
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.calcColumn160]}>
                                <Text style={[styles.boldText]}>{index + 1}. {value.name}</Text>
                                <View style={[styles.halfSpacer]} />
                                <Text style={[styles.descriptionText3]}>{value.description}</Text>
                              </View>
                              <View style={[styles.width40,,styles.centerText,styles.topPadding5,styles.leftPadding]}>
                                <TouchableOpacity disabled={value.disabled} onPress={() => this.itemClicked('similarityCriteria|' + index, true)}>
                                  {(value.selected) ? (
                                    <View style={[styles.square22,styles.ctaBorder, styles.flexCenter, { borderRadius: 11 }]} >
                                      <View style={[styles.square10,styles.ctaBackgroundColor, { borderRadius: 5 }]}/>
                                    </View>
                                  ) : (
                                    <View style={[styles.square22,styles.ctaBorder, styles.flexCenter, { borderRadius: 11 }]} />
                                  )}
                                </TouchableOpacity>
                              </View>
                            </View>

                            <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

                          </View>
                        )}

                      </View>
                    )}
                  </View>
                )}

                {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor]}>{this.state.errorMessage}</Text>}

              </View>

              <View style={[styles.row20,styles.rowDirection,styles.flexCenter,styles.flex1]}>
                <View style={[styles.flex50,styles.rightPadding5]}>
                  <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.calculateMatches(true, true, true)}><Text style={[styles.descriptionText1,styles.whiteColor]}>Apply Changes</Text></TouchableOpacity>
                </View>
                <View style={[styles.flex50,styles.leftPadding5]}>
                  <TouchableOpacity style={[styles.btnSquarish,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.descriptionText1,styles.ctaColor]}>Close View</Text></TouchableOpacity>
                </View>
              </View>
            </ScrollView>
          )}

         {(this.state.showMessageWidget) && (
           <View key="showServiceDefinitions" style={[styles.calcColumn80,styles.padding20]}>
              <SubSendMessage
                profileData={{ firstName: this.state.members[this.state.selectedIndex].firstName, lastName: this.state.members[this.state.selectedIndex].lastName, email: this.state.members[this.state.selectedIndex].email}}
                navigation={this.props.navigation} closeModal={this.closeModal} source={"peopleMatching"}
                />
            </View>
         )}

       </Modal>


      </View>
    )
  }

}

export default PeopleMatching;
