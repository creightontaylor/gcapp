import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal'
import * as Progress from 'react-native-progress';
import {Picker} from '@react-native-picker/picker';

const matchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/match-icon.png';
const matchIconSelected = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/match-icon-selected.png';
const filterIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/filter-icon.png';
const filterIconSelected = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/filter-icon-selected.png';
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';
const socialIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-dark.png';
const upvoteIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-blue.png';
const upvoteIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-grey.png';
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';
const timeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-blue.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';

import SubPicker from '../common/SubPicker';

import SubEditGroup from '../../components/common/EditGroup';

class Groups extends Component {
  constructor(props) {
    super(props)
    this.state = {
      hideFilters: true,
      groups: [],
      favorites: [],

      genderOptions: [],
      raceOptions: [],
      ageRangeOptions: [],
      proximityOptions: [],
      groupCategoryOptions: [],
      accessTypeOptions: ['','Open'],

      itemFilters: [],
      itemSorters: [],

      defaultFilterOption: 'All',
      defaultSortOption: 'No Sort Applied',

      disableCustomMatches: true,
      inBeta: true
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.renderGroups = this.renderGroups.bind(this)
    this.calculateMatches = this.calculateMatches.bind(this)
    this.toggleSearchBar = this.toggleSearchBar.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.voteOnItem = this.voteOnItem.bind(this)
    this.joinGroup = this.joinGroup.bind(this)
    this.viewGroup = this.viewGroup.bind(this)

  }

  componentDidMount() {
    console.log('groups componentDidMount did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ')

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      console.log('t0 will update')
      this.retrieveData()
    // } else if (this.props.employers && this.props.employers.length !== prevProps.employers.length) {
    //   this.retrieveData()
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

        const categoryOptions = ['Accountability','Location','Age','Interests','Skills & Abilities','Values','Career Goals','Tech Trends','Societal Problems','Employers','Popular Career Areas','Organizations']
        const booleanOptions = ['Yes','No']
        const accessTypeOptions = ['Open','Request','Waitlist']
        const groupCategoryOptions = ['','Location','Age','Interests','Skills & Abilities','Values','Career Goals','Tech Trends','Societal Problems','Employers','Popular Career Areas','Organizations','Other']

        const itemFilters = [
          { name: 'Category', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(categoryOptions)},
          { name: 'Featured', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(booleanOptions)},
          { name: 'Access Type', value: this.state.defaultFilterOption, options: [this.state.defaultFilterOption].concat(accessTypeOptions)},
        ]

        const itemSorters = [
          { name: 'Votes', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(['High','Low'])},
          { name: 'Membership', value: this.state.defaultSortOption, options: [this.state.defaultSortOption].concat(['High','Low'])},
        ]

        const passedCategory = this.props.category

        this.setState({ emailId, activeOrg, username, cuFirstName, cuLastName, roleName, orgFocus, itemFilters, itemSorters, orgName,
          accessTypeOptions, groupCategoryOptions, passedCategory
        })

        const accountCode = this.props.accountCode

        if (activeOrg) {
          Axios.get('https://www.guidedcompass.com/api/groups', { params: { orgCode: activeOrg, resLimit: 100, category: passedCategory, accountCode }})
          .then((response) => {
            console.log('Groups query worked', response.data);

            if (response.data.success) {

              const groups = response.data.groups
              this.setState({ groups })

            } else {
              console.log('no groups data found', response.data.message)
            }

          }).catch((error) => {
              console.log('Groups query did not work', error);
          });
        }

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: emailId } })
        .then((response) => {
          console.log('User details query 1 attempted', response.data);

          if (response.data.success) {
             console.log('successfully retrieved user details')

             let profile = { firstName: cuFirstName, lastName: cuLastName, email: emailId }
             profile['zipcode'] = response.data.user.zipcode
             let pictureURL = response.data.user.pictureURL

             this.setState({ profile, pictureURL });

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

                  this.setState({ profile })

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

        Axios.get('https://www.guidedcompass.com/api/account', { params: { accountCode } })
        .then((response) => {
          console.log('Account info query attempted within sub settings', response.data);

          if (response.data.success) {
            console.log('account info query worked in sub settings')

            let employerInfo = response.data.accountInfo
            employerInfo['jobFunction'] = 'Marketing'
            this.setState({ employerInfo })

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

  formChangeHandler = (eventName, eventValue) => {
    console.log('formChangeHandler called', eventName, eventValue)

    this.setState({ selectedValue: eventValue })

    if (eventName === 'search') {
      console.log('in search')
      const searchString = eventValue
      this.setState({ searchString, animating: true })
      this.filterResults(eventValue, null, null, true)

    } else if (eventName.includes('filter|')) {
      console.log('in filter 1', eventName)
      const nameArray = eventName.split("|")
      console.log('in filter 2')
      let itemFilters = this.state.itemFilters
      const eventName = nameArray[1]
      const index = Number(nameArray[2])

      itemFilters[index]['value'] = eventValue
      console.log('show the item values: ', itemFilters, eventName, index, eventValue)

      this.setState({ itemFilters, animating: true })
      this.filterResults(this.state.searchString, eventName, eventValue, false)

    } else if (eventName.includes('sort|')) {

      const nameArray = eventName.split("|")

      let itemSorters = this.state.itemSorters
      const eventName = nameArray[1]
      const index = Number(nameArray[2])

      itemSorters[index]['value'] = eventValue
      console.log('show the item values: ', itemSorters, eventName, index, eventValue)

      this.setState({ itemSorters, animating: true })
      this.sortResults(this.state.searchString, eventName, eventValue, false)
    } else if (eventName === 'groupCoverImage') {

        if (event.target.files[0]) {
            let reader = new FileReader();
            reader.onload = (e) => {
                this.setState({ groupCoverImage: e.target.result });
                console.log('how do i access the image', e.target.result)
            };
            reader.readAsDataURL(event.target.files[0]);
            // this.setState({ profilePicFile: event.target.files[0], profilePicHasChanged: true })
            // this.saveFile(eventName, event.target.files[0])
        }
    } else {
      this.setState({ [eventName]: eventValue })
    }
  }

  filterResults(searchString, filterName, filterValue, search) {
    console.log('filterResults called', searchString, filterName, filterValue, search)

    let roleNames = ['Student','Career-Seeker']

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      const orgCode = self.state.activeOrg
      const excludeCurrentUser = true
      const emailId = self.state.emailId
      const category = self.state.passedCategory

      if (search) {
        Axios.get('https://www.guidedcompass.com/api/groups/search', { params: { searchString, orgCode, roleNames, excludeCurrentUser, emailId, category } })
        .then((response) => {
          console.log('Opportunity search query attempted', response.data);

            if (response.data.success) {
              console.log('opportunity search query worked')

              let groups = response.data.groups
              self.setState({ groups, filteredResults: true, animating: false })

            } else {
              console.log('opportunity search query did not work', response.data.message)

              let memberOptions = []
              self.setState({ memberOptions, animating: false })

            }

        }).catch((error) => {
            console.log('Search query did not work for some reason', error);
            self.setState({ animating: false })
        });
      } else {
        console.log('filter results: ', searchString, orgCode, filterName, filterValue)

        const onlyPics = true
        const profile = self.state.profile
        let groups = self.state.groups
        // if (self.state.groups && self.state.groups[0] && self.state.groups[0].matchScore) {
        //   users = self.state.groups
        // }

        // eventually query groups from back-end
        Axios.put('https://www.guidedcompass.com/api/groups/filter', { searchString, orgCode, filterName, filterValue, roleNames, onlyPics, profile, groups })
        .then((response) => {
          console.log('Groups filter query attempted', response.data);

            if (response.data.success) {
              console.log('opportunity search query worked')

              let groups = response.data.groups
              const filterCriteriaArray = response.data.filterCriteriaArray
              console.log('show filterCriteriaArray: ', filterCriteriaArray)
              self.setState({ groups, filterCriteriaArray, filteredResults: true, animating: false })

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

  sortResults(searchString, sortName, sortValue, search) {
    console.log('filterResults called', searchString, sortName, sortValue, search)

    let roleNames = ['Student','Career-Seeker']

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      const orgCode = self.state.activeOrg
      const excludeCurrentUser = true
      const emailId = self.state.emailId

      const onlyPics = true
      const profile = self.state.profile
      let groups = self.state.groups
      // if (self.state.groups && self.state.groups[0] && self.state.groups[0].matchScore) {
      //   users = self.state.groups
      // }

      // eventually query groups from back-end
      Axios.put('https://www.guidedcompass.com/api/groups/sort', { searchString, orgCode, sortName, sortValue, roleNames, onlyPics, profile, groups, excludeCurrentUser, emailId })
      .then((response) => {
        console.log('Groups sort query attempted', response.data);

          if (response.data.success) {
            console.log('sort query worked')

            let groups = response.data.groups
            self.setState({ groups, sortedResults: true, animating: false })

          } else {
            console.log('sorted query did not work', response.data.message)

            self.setState({ animating: false })

          }

      }).catch((error) => {
          console.log('Search query did not work for some reason', error);
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

  calculateMatches(matchingView, calcMatches, newPreferences) {
    console.log('calculateMatches called', matchingView, calcMatches, newPreferences)

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
        const orgCode = this.state.activeOrg
        const onlyPics = true
        const category = this.state.passedCategory

        console.log('show our profile orgCode: ', orgCode)

        const self = this

        function officiallyCalculate() {
          console.log('officiallyCalculate called')

          // query postings on back-end
          Axios.put('https://www.guidedcompass.com/api/groups/matches', { profile, matchingCriteria, similarityCriteria, roleNames, orgCode, onlyPics, category })
          .then((response) => {
            console.log('Opportunity matches attempted', response.data);

              if (response.data.success) {
                console.log('opportunity match query worked')

                let groups = response.data.groups
                // let matchScores = response.data.matchScores
                self.setState({ animating: false, matchingView: true, groups })

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

  renderGroups() {
    console.log('renderGroups called')

    let rows = []

    if (this.state.groups) {
      for (let i = 1; i <= this.state.groups.length; i++) {

        const index = i - 1

        rows.push(
          <View key={i}>
            <View style={[styles.topMargin20]}>
              <TouchableOpacity onPress={() => this.viewGroup(this.state.groups[i - 1])}>
                <View style={[styles.elevatedBox,styles.whiteBackground]} >
                  <View style={(this.props.modalIsOpen) ? [styles.calcColumn20,styles.relativePosition] : [styles.calcColumn40,styles.relativePosition]}>
                    <Image source={(this.state.groups[i - 1].pictureURL) ? { uri: this.state.groups[i - 1].pictureURL} :{ uri: "https://guidedcompass-bucket.s3-us-west-2.amazonaws.com/headerImages/1210x311.png"}} style={[styles.calcColumn40,styles.height150]}  />
                    <View style={[styles.darkTint]} />
                    <View style={[styles.absolutePosition,styles.absoluteTop5,styles.absoluteLeft5]}>
                      {(this.state.groups[i - 1].matchScore) && (
                        <View>
                          <Progress.Circle progress={this.state.groups[i - 1].matchScore / 100} size={styles.width40.width} showsText={true} animated={false} color={styles.whiteColor.color}/>
                        </View>
                      )}
                      <Text style={[styles.roundedCorners,styles.horizontalPadding10,styles.row5,styles.whiteBorder,styles.descriptionText5,styles.whiteColor,styles.boldText]}>{this.state.groups[i - 1].category}</Text>
                    </View>

                    <TouchableOpacity style={[styles.absolutePosition,styles.absoluteTop5,styles.absoluteRight5,styles.whiteBackground,styles.roundedCorners]} onPress={(e) => this.voteOnItem(e, this.state.groups[i - 1], 'up', index) }>
                      <View style={[styles.standardBorder,styles.roundedCorners,styles.rowDirection]}>
                        <View style={[styles.padding7]}>
                          <Image source={(this.state.groups[i - 1].upvotes.includes(this.state.emailId)) ? { uri: upvoteIconBlue} : { uri: upvoteIconGrey}} style={[styles.square15,styles.contain]}/>
                        </View>
                        <View style={[styles.verticalSeparator30]} />
                        <View style={[styles.horizontalPadding10]}>
                          <View style={[styles.halfSpacer]} />
                          <Text style={[styles.descriptionText2,styles.boldText]}>{this.state.groups[i - 1].upvotes.length}</Text>
                        </View>

                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={[styles.spacer]} />

                  <View style={[styles.padding20]}>
                    <Text style={[styles.headingText5]}>{this.state.groups[i - 1].name}</Text>
                    {(this.state.groups[i - 1].category === 'Accountability' && this.state.groups[i - 1].members) ? (
                      <Text style={[styles.descriptionText3,styles.topPadding5]}>{this.state.groups[i - 1].members.length + ' / 6'} Members</Text>
                    ) : (
                      <Text style={[styles.descriptionText3,styles.topPadding5]}>{this.state.groups[i - 1].memberCount} Members</Text>
                    )}

                    <View style={[styles.topPadding]}>

                        {(this.state.groups[i - 1].members && this.state.groups[i - 1].members.some(member => member.email === this.state.emailId)) ? (
                          <View style={[styles.topMargin30,styles.rowDirection]}>
                            <View style={[styles.rightPadding]}>
                              <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                              <Image source={{ uri: checkmarkIcon}} style={[styles.square12,styles.contain]} />
                            </View>
                            <View>
                              <Text style={[styles.descriptionText2,styles.boldText]}>Joined</Text>
                            </View>

                          </View>
                        ) : (
                          <View>

                            {(this.state.groups[index].accessType === 'Open') ? (
                              <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.topMargin,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={(e) => this.joinGroup(e, this.state.groups[index], index, true)}>
                                <Text style={[styles.whiteColor,styles.boldText]}>+ Join Group</Text>
                              </TouchableOpacity>
                            ) : (
                              <View>
                                {((this.state.groups[index].requests && this.state.groups[index].requests.some(request => request.email === this.state.emailId))) ? (
                                  <View style={[styles.calcColumn100,styles.rightMargin5,styles.topMargin30,styles.rowDirection]}>
                                    <View style={[styles.rightPadding]}>
                                      <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                      <Image source={{ uri: timeIconBlue}} style={[styles.square15,styles.contain]} />
                                    </View>
                                    <View>
                                      <Text style={[styles.descriptionText2,styles.boldText,styles.centerText]}>Requested</Text>
                                    </View>

                                  </View>
                                ) : (
                                  <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.topMargin, styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={(e) => this.joinGroup(e, this.state.groups[index], index, true)}>
                                    <Text style={[styles.whiteColor,styles.boldText]}>+ Request</Text>
                                  </TouchableOpacity>
                                )}
                              </View>
                            )}
                          </View>
                        )}
                    </View>
                  </View>

                  {(this.state.filterCriteriaArray && this.state.filterCriteriaArray.length > 0 && this.state.filterCriteriaArray.length === this.state.groups.length) && (
                    <View style={[styles.topPadding,styles.horizontalPadding30]}>
                      <Text style={[styles.errorColor,styles.descriptionText5,styles.boldText]}>{this.state.filterCriteriaArray[i - 1].name}: {this.state.filterCriteriaArray[i - 1].criteria}</Text>
                    </View>
                  )}

                  {(this.state.groups[i - 1].category === 'Accountability' && this.state.groups[i - 1].admins && this.state.groups[i - 1].admins.length > 0) && (
                    <View style={[styles.topPadding20,styles.horizontalPadding30]}>
                      <Text style={[styles.descriptionText3]}>Admin:</Text>
                      {this.state.groups[i - 1].admins.map((item, index) =>
                        <View key={index}>
                          <Text style={[styles.errorColor,styles.descriptionText3,styles.boldText]}>{item.firstName} {item.lastName}</Text>
                        </View>
                      )}
                    </View>
                  )}

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

  viewGroup(group) {
    console.log('viewGroup called', group)

    let groupDetailsPath = '/app/groups/' + group._id
    if (this.props.fromAdvisor) {
      groupDetailsPath = '/advisor/groups/' + group._id
    } else {
      groupDetailsPath = '/app/groups/' + group._id
    }

    if (this.props.fromWalkthrough) {
      this.props.navigation.navigate('GroupDetails', { selectedGroup: group })
    } else {
      this.props.navigation.navigate('GroupDetails', { selectedGroup: group })
    }
  }

  joinGroup(e, group, index, joinGroup) {
    console.log('joinGroup called', e, group, index, joinGroup)
    e.stopPropagation()

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    let groupId = group._id
    const member = {
      firstName: this.state.cuFirstName, lastName: this.state.cuLastName, email: this.state.emailId,
      username: this.state.username, roleName: this.state.roleName, pictureURL: this.state.pictureURL
    }

    const accessType = group.accessType

    Axios.post('https://www.guidedcompass.com/api/groups/save', { groupId, member, accessType, joinGroup })
    .then((response) => {
      console.log('attempting to save addition to groups')
      if (response.data.success) {
        console.log('saved addition to groups', response.data)

        let groups = this.state.groups
        groups[index] = response.data.group

        this.setState({ successMessage: 'Saved as a group!', groups, isSaving: false })

      } else {
        console.log('did not save successfully')
        this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ errorMessage: 'there was an error saving groups', isSaving: false})
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

    this.setState({ modalIsOpen: false, showMessageWidget: false, showMatchingCriteria: false, addOrgGroup: false })
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

  voteOnItem(e, item, direction, index) {
    console.log('voteOnItem called')

    e.stopPropagation()

    const _id = item._id
    const emailId = this.state.emailId
    let changeUpvote = true
    const updatedAt = new Date()

    Axios.post('https://www.guidedcompass.com/api/groups', { _id, emailId, changeUpvote, updatedAt })
    .then((response) => {
      console.log('attempting to save')

      if (response.data.success) {
        //save values
        console.log('Group save worked', response.data);

        const serverSuccessMessage = 'Problem successfully posted!'

        let upvotes = item.upvotes
        let downvotes = item.downvotes

        if (direction === 'up') {
          console.log('in up')

          if (upvotes.includes(this.state.emailId)) {
            const removeIndex = upvotes.indexOf(this.state.emailId)
            console.log('removing: ',removeIndex)
            if (removeIndex > -1) {
              upvotes.splice(removeIndex, 1);
              item['upvotes'] = upvotes

              let groups = this.state.groups
              groups[index]= item
              this.setState({ groups, serverSuccessMessage })
            }
          } else {
            console.log('adding: ', this.state.emailId)
            upvotes.push(this.state.emailId)

            if (downvotes.includes(this.state.emailId)) {
              const removeIndex = downvotes.indexOf(this.state.emailId)
              if (removeIndex > -1) {
                downvotes.splice(removeIndex, 1);
              }

              item['upvotes'] = upvotes
              item['downvotes'] = downvotes

              let groups = this.state.groups
              groups[index] = item
              this.setState({ groups, serverSuccessMessage })
            } else {

              item['upvotes'] = upvotes

              let groups = this.state.groups
              groups[index] = item

              this.setState({ groups, serverSuccessMessage })
            }
          }

        } else {

          if (downvotes.includes(this.state.emailId)) {
            console.log('un-downvoting')
            const removeIndex = downvotes.indexOf(this.state.emailId)
            if (removeIndex > -1) {
              downvotes.splice(removeIndex, 1);
              item['downvotes'] = downvotes

              let groups = this.state.groups
              groups[index] = item

              this.setState({ groups, serverSuccessMessage })
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

              item['upvotes'] = upvotes
              item['downvotes'] = downvotes

              let groups = this.state.groups
              groups[index] = item

              this.setState({ groups, serverSuccessMessage })
            } else {
              item['downvotes'] = downvotes

              let groups = this.state.groups
              groups[index] = item
              this.setState({ groups, serverSuccessMessage })
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

  render() {

    return (
        <ScrollView>
          <View style={[styles.topMargin20]}>
            {(this.props.modalIsOpen) && (
              <View>
                <View>
                  <View style={[styles.bottomPadding,styles.calcColumn120,styles.rowDirection]}>
                    <View style={[styles.calcColumn120]}>
                      <Text style={[styles.headingText6]}>Groups</Text>
                    </View>
                    <View style={[styles.width30,styles.topPadding,styles.alignEnd]}>
                      <TouchableOpacity onPress={() => this.props.closeModal()}>
                        <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

                <View style={styles.spacer} />
                <View style={[styles.lightHorizontalLine]} />
              </View>
            )}
            <View>
              {(this.state.matchingView) ? (
                <View>
                  {/*
                  <View className="search-icon-container top-margin-negative-3 full-width" style={(this.state.matchingView) ? { ...styles2, position: 'absolute' } : { }}>
                    <TouchableOpacity onPress={() => this.calculateMatches(false, false, false)}>
                      <Image source={{ uri: matchIconSelected}} className="image-auto-30 right-margin" />
                    </TouchableOpacity>
                  </View>
                  <View className="full-width">
                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showMatchingCriteria: true })}>
                      <View className="float-left right-margin slightly-rounded-corners row-5 horizontal-padding cta-background-color cta-border white-text">
                        <Text>Adjust</Text>
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.calculateMatches(false, false, false)}>
                      <View className="float-left right-padding standard-border slightly-rounded-corners row-5 horizontal-padding">
                        <Text>Close</Text>
                      </View>
                    </TouchableOpacity>



                    <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                  </View>*/}

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
                </View>
              ) : (
                <View>

                  <View>
                    {/*
                    <View className="full-width row-5 white-background standard-border medium-shadow">
                      <View className={(this.state.matchingView) ? "float-left full-width" : "fixed-column-50 center-item"} style={(this.state.matchingView) ? { ...styles2, position: 'absolute' } : { }}>
                        <TouchableOpacity className={(this.state.matchingView) ? "background-button float-left" : "background-button full-space bottom-padding"} onPress={() => this.calculateMatches(true, true, false)}>
                          <Image source={(this.state.matchingView) ? { uri: matchIconSelected} : { uri: matchIcon}} className="image-auto-30 right-margin center-item top-margin"/>
                        </TouchableOpacity>
                      </View>

                      <View className="filter-field-search clear-margin calc-column-offset-100-static white-background clear-border">
                        <View className="search-icon-container">
                          <Image source={{ uri: searchIcon}} className="image-auto-28 padding-5"/>
                        </View>
                        <View className="filter-search-container calc-column-offset-100-static top-padding-5">
                          <View style={[styles.calcColumn90]}>
                            <TextInput
                              style={styles.height30}
                              onChangeText={(text) => this.formChangeHandler('search', text)}
                              value={this.state.searchString}
                              placeholder={"Search groups and group organizers..."}
                              placeholderTextColor="grey"
                            />
                          </View>
                        </View>
                      </View>
                      {(!this.state.passedCategory) && (
                        <View className="fixed-column-50 center-item">
                          <TouchableOpacity className="background-button full-space bottom-padding" onPress={() => this.toggleSearchBar('show')}>
                            <Image source={(this.state.showingSearchBar) ? { uri: filterIconSelected} : { uri: filterIcon}} className="image-auto-25 center-item top-margin"/>
                          </TouchableOpacity>
                        </View>
                      )}


                    </View>*/}

                    <View style={(this.props.modalIsOpen) ? [styles.flex1,styles.row5,styles.whiteBackground,styles.standardBorder,styles.mediumShadow,styles.rowDirection] : [styles.fullScreenWidth,styles.row5,styles.whiteBackground,styles.standardBorder,styles.mediumShadow,styles.rowDirection]}>
                      {(!this.props.modalIsOpen) && (
                        <View style={(this.state.matchingView) ? [styles.fullScreenWidth] : [styles.width50,styles.flexCenter]}>
                          <TouchableOpacity style={(this.state.matchingView) ? [] : [styles.flex1,styles.bottomPadding,styles.flexCenter]} onPress={() => this.calculateMatches(true, true, false)}>
                            <Image source={(this.state.matchingView) ? { uri: matchIconSelected} : { uri: matchIcon}} style={[styles.square30,styles.contain,styles.rightMargin,styles.topMargin]}/>
                          </TouchableOpacity>
                        </View>
                      )}

                      <View style={(this.props.modalIsOpen) ? [styles.row3,styles.rowDirection] : [styles.row3,styles.whiteBackground,styles.calcColumn100,styles.rowDirection]}>
                        <View style={(this.props.modalIsOpen) ? [styles.row5,styles.rightPadding5,styles.leftPadding5] : [styles.topMargin15,styles.rightPadding5]}>
                          <Image source={{ uri: searchIcon}} style={[styles.square18,styles.contain,styles.padding5]}/>
                        </View>
                        <View style={(this.props.modalIsOpen) ? [styles.calcColumn120] : [styles.calcColumn130]}>
                          <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                          <TextInput
                            style={(this.props.modalIsOpen) ? [styles.descriptionText2] : [styles.topMargin,styles.descriptionText2]}
                            onChangeText={(text) => this.formChangeHandler("search", text)}
                            value={this.state.searchString}
                            placeholder={(this.state.userType === 'Peers') ? "Search peers and potential team members..." : "Search..."}
                            placeholderTextColor="grey"
                          />
                        </View>
                      </View>
                      {(!this.state.passedCategory) && (
                        <View style={[styles.width50,styles.flexCenter]}>
                          <TouchableOpacity style={[styles.flex1,styles.bottomPadding,styles.flexCenter]} onPress={() => this.toggleSearchBar('show')}>
                            <Image source={(this.state.showingSearchBar) ? { uri: filterIconSelected} : { uri: filterIcon}} style={[styles.square25,styles.topMargin]}/>
                          </TouchableOpacity>
                        </View>
                      )}

                    </View>
                  </View>

                </View>
              )}
            </View>

            {(this.state.showingSearchBar) && (
              <View style={[styles.card,styles.topMargin20]}>

                {(!this.state.hideFilters) && (
                  <View>
                    <Text style={[styles.row10,styles.standardText]}>Filter Options</Text>

                    <View style={[styles.row10]}>
                      {this.state.itemFilters.map((item, index) =>
                        <View key={index}>
                          <Text style={[styles.descriptionTextColor,styles.descriptionText3]}>{item.name}</Text>
                          {(Platform.OS === 'ios') ? (
                            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: item.name, selectedIndex: index, selectedName: "filter|" + item.name, selectedValue: item.value, selectedOptions: item.options, selectedSubKey: null })}>
                              <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                <View style={[styles.calcColumn115]}>
                                  <Text style={[styles.descriptionText1]}>{item.value}</Text>
                                </View>
                                <View style={[styles.width20,styles.topMargin5]}>
                                  <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                </View>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View style={[styles.standardBorder]}>
                              <Picker
                                selectedValue={item.value}
                                onValueChange={(itemValue, itemIndex) =>
                                  this.formChangeHandler("filter|" + item.name,itemValue)
                                }>
                                {filters[i - 1].options.map(value => <Picker.Item label={value} value={value} />)}
                              </Picker>
                            </View>
                          )}
                        </View>
                      )}
                    </View>


                    <View style={[styles.spacer]} />

                    <Text style={[styles.row10,styles.standardText]}>Sort Options</Text>

                    <View style={[styles.row10]}>
                      {this.state.itemSorters.map((item, index) =>
                        <View key={index}>
                          <Text style={[styles.descriptionTextColor,styles.descriptionText3]}>{item.name}</Text>
                          {(Platform.OS === 'ios') ? (
                            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPicker: true, pickerName: item.name, selectedIndex: index, selectedName: "sort|" + item.name + '|' + index, selectedValue: item.value, selectedOptions: item.options, selectedSubKey: null })}>
                              <View style={[styles.rowDirection,styles.standardBorder,styles.row10,styles.horizontalPadding20]}>
                                <View style={[styles.calcColumn115]}>
                                  <Text style={[styles.descriptionText1]}>{item.value}</Text>
                                </View>
                                <View style={[styles.width20,styles.topMargin5]}>
                                  <Image source={{ uri: dropdownArrow }} style={[styles.square12,styles.leftMargin,styles.contain]} />
                                </View>
                              </View>
                            </TouchableOpacity>
                          ) : (
                            <View style={[styles.standardBorder]}>
                              <Picker
                                selectedValue={item.value}
                                onValueChange={(itemValue, itemIndex) =>
                                  this.formChangeHandler("sort|" + filters[i - 1].name,itemValue)
                                }>
                                {filters[i - 1].options.map(value => <Picker.Item label={value} value={value} />)}
                              </Picker>
                            </View>
                          )}
                        </View>
                      )}
                    </View>
                  </View>
                )}

              </View>
            )}

            {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor]}>{this.state.errorMessage}</Text>}
            <View style={[styles.spacer]} /><View style={[styles.spacer]} />

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
              <View style={[styles.topPadding20]}>
                {(this.state.groups && this.state.groups.length > 0) ? (
                  <View style={(this.props.modalIsOpen) ? [] : [styles.horizontalPadding20]}>
                    {this.renderGroups()}

                  </View>
                ) : (
                  <View>
                    <View style={[styles.card,styles.topMargin]}>
                      <View style={[styles.flex1,styles.row20,styles.flexCenter]}>
                        <Image source={{ uri: socialIconDark}} style={[styles.square100,styles.contain]}/>

                        <View style={[styles.row20]}>
                          <Text style={[styles.centerText,styles.headingText2]}>Groups</Text>
                          <Text style={[styles.centerText,styles.topPadding20,styles.horizontalPadding30]}>Groups are communities where you can connect with peers, educators, program managers, or employers around goals, interests, purpose, and other factors.</Text>
                        </View>
                      </View>
                    </View>
                  </View>
                )}

              </View>
            )}

            <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>

              {(this.state.showMatchingCriteria) && (
                <ScrollView key="showMatchingCriteria" style={[styles.calcColumn80,styles.padding20]}>
                  <View>
                    <Text style={[styles.headingText2]}>Adjust Matching Criteria</Text>
                    <View style={[styles.spacer]} />

                    <View style={[styles.row10]}>
                      <View style={[styles.flex1,styles.rowDirection]}>
                        <TouchableOpacity style={[styles.flex1]} onPress={() => this.setState({ customAdjustment: false })}>
                          <View style={(this.state.customAdjustment) ? [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20] : [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20,styles.ctaBackgroundColor]}>
                            <Text style={(this.state.customAdjustment) ? [styles.descriptionText1,styles.centerText] : [styles.descriptionText1,styles.whiteColor,styles.centerText]}>Adjust By Similarity</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={[styles.flex1]} onPress={() => this.setState({ customAdjustment: true })}>
                          <View style={(this.state.customAdjustment) ? [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20,styles.ctaBackgroundColor] : [styles.ctaBorder,styles.flexCenter,styles.row10,styles.horizontalPadding20]}>
                            <Text style={(this.state.customAdjustment) ? [styles.descriptionText1,styles.whiteColor,styles.centerText] : [styles.descriptionText1,styles.centerText]}>Design Your Group</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.spacer]} />
                    </View>

                    {(this.state.inBeta) && (
                      <View style={[styles.bottomPadding]}>
                        <Text style={[styles.errorColor,styles.centerText,styles.calcColumn120]}>The ability to customize your matches is coming soon.</Text>
                      </View>
                    )}

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

                  {/*
                  <View key="showMatchingCriteria" style={[styles.calcColumn80,styles.padding20]}>
                    <Text className="heading-text-2">Adjust Matching Criteria</Text>
                    <View style={[styles.spacer]} />

                    <View className="row-10">
                      <View className="flex-container">
                        <TouchableOpacity className="background-button flex-50" onPress={() => this.setState({ customAdjustment: false })}>
                          <View className={(this.state.customAdjustment) ? "cta-border center-item row-15 horizontal-padding center-text" : "cta-border center-item row-15 horizontal-padding center-text cta-background-color white-text"}>
                            Adjust by Similarity
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="background-button flex-50" onPress={() => this.setState({ customAdjustment: true })}>
                          <View className={(this.state.customAdjustment) ? "cta-border center-item row-15 horizontal-padding center-text cta-background-color white-text" : "cta-border center-item row-15 horizontal-padding center-text"}>
                            Design Your Group
                          </View>
                        </TouchableOpacity>

                      </View>
                      <View style={[styles.spacer]} />
                    </View>

                    {(this.state.inBeta) && (
                      <View className="bottom-padding">
                        <Text className="error-color full-width center-text">The ability to customize your matches is coming soon.</Text>
                      </View>
                    )}

                    {(this.state.customAdjustment) ? (
                      <View>
                        {(this.state.disableCustomMatches) && (
                          <View className="bottom-padding">
                            <Text style={[styles.errorColor]}>Ability to customize your matches is coming soon</Text>
                          </View>
                        )}

                        {(this.state.matchingCriteria) && (
                          <View>
                            {this.state.matchingCriteria.map((value ,index) =>
                              <View key={"c" + index} className={(value.name === 'Location') && "wash-out-2"}>
                                <View className="calc-column-offset-100-static">
                                  <Text className="half-bold-text">{index + 1}. {value.name}</Text>
                                  <View style={[styles.halfSpacer]} />
                                  <Text className="description-text-3">{value.description}</Text>
                                </View>
                                <View className="fixed-column-100 right-text">
                                  <View className="fixed-column-70">
                                    <TextInput
                                      style={[styles.textInput,styles.headingText1,styles.ctaColor,styles.boldText,styles.rightText,styles.standardBorder]}
                                      onChangeText={(text) => this.formChangeHandler("custom|" + index, text)}
                                      value={value.value}
                                      placeholder={""}
                                      placeholderTextColor="grey"
                                      keyboardType="numeric"
                                      disabled={(value.name === 'Location') ? true : false}
                                      maxLength={3}
                                    />
                                  </View>
                                  <View className="fixed-column-30">
                                    <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                                    <Text className="heading-text-2 cta-color bold-text">%</Text>
                                  </View>
                                </View>


                                <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

                              </View>
                            )}

                            <View>
                              <View style={[styles.ctaHorizontalLine]} />
                              <View style={[styles.spacer]} />
                              <View className="float-left full-width right-text">
                                <Text className="heading-text-2 cta-color bold-text">{this.state.totalPercent}%</Text>
                              </View>

                              {(this.state.totalPercent !== 100) && (
                                <View className="full-width">
                                  <Text className="error-message right-text">Please adjust percentages to equal 100%</Text>
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
                              <View className="bottom-padding">
                                <Text style={[styles.errorColor]}>Ability to customize your matches is coming soon</Text>
                              </View>
                            )}

                            {this.state.similarityCriteria.map((value ,index) =>
                              <View key={"u" + index} className={(value.disabled) && "wash-out-2"}>
                                <View className="calc-column-offset-50">
                                  <Text className="half-bold-text">{index + 1}. {value.name}</Text>
                                  <View style={[styles.halfSpacer]} />
                                  <Text className="description-text-3">{value.description}</Text>
                                </View>
                                <View className="fixed-column-50 horizontally-center center-text top-padding-5">

                                  <TouchableOpacity disabled={value.disabled} onPress={() => this.itemClicked('similarityCriteria|' + index, true)}>
                                    {(value.selected) ? (
                                      <View className="circle-option-container-2 cta-border center-text" >
                                        <View className="circle-selected-2"/>
                                      </View>
                                    ) : (
                                      <View className="circle-option-container-2 standard-border center-text" />
                                    )}
                                  </TouchableOpacity>
                                </View>


                                <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

                              </View>
                            )}

                          </View>
                        )}
                      </View>
                    )}

                    {(this.state.errorMessage && this.state.errorMessage !== '') && <Text className="description-text-2 error-color">{this.state.errorMessage}</Text>}

                  </View>*/}
                </ScrollView>
              )}

             {(this.state.addOrgGroup) && (
               <View key="addOrgGroup" style={[styles.calcColumn80,styles.padding20]}>
                  <SubEditGroup selectedGroup={null} navigation={this.props.navigation} closeModal={this.closeModal}
                    accountCode={this.state.accountCode} employerLogoURI={this.state.employerLogoURI}
                    employerName={this.state.employerName} jobFunction={this.state.jobFunction}
                    pathway={this.state.pathway}
                  />
                </View>
             )}

             {(this.state.showPicker) && (
               <View style={[styles.flex1,styles.pinBottom,styles.justifyEnd]}>
                 <SubPicker
                   selectedSubKey={this.state.selectedSubKey}
                   selectedName={this.state.selectedName}
                   selectedOptions={this.state.selectedOptions}
                   selectedValue={this.state.selectedValue}
                   differentLabels={this.state.differentLabels}
                   pickerName={this.state.pickerName}
                   formChangeHandler={this.formChangeHandler}
                   closeModal={this.closeModal}
                 />
               </View>
             )}

           </Modal>
          </View>
        </ScrollView>

    )
  }

}

export default Groups;
