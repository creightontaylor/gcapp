import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';

const infoIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/info-icon-dark.png';
const notificationsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/notifications-icon-dark.png';
const notificationsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/notifications-icon-dark.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-incidicator-icon.png';
const editIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/edit-icon-dark.png';
const videoIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/video-icon.png';
const imageIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/image-icon.png';
const exitIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/exit-icon-dark.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png';
const timeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-blue.png';
const targetIconOrange = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/target-icon-orange.png';
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';
const addIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon-white.png';
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
const websiteIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/website-icon-dark.png';
const calendarIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/calendar-icon-dark.png';

import {convertDateToString} from '../functions/convertDateToString';

import SubEditGroup from '../common/EditGroup';
import SubGoalDetails from '../common/GoalDetails';
import SubRenderPosts from '../common/RenderPosts';
import SubCreatePost from '../common/CreatePost';
import SubEditLog from '../subcomponents/EditLog';

class GroupDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showLeftSideBar: false,
      showRightSideBar: false,

      defaultCoverImage: 'https://guidedcompass-bucket.s3-us-west-2.amazonaws.com/headerImages/1210x311.png',
      members: [],
      groupPosts: [],
      comments: [],

      matchCriteria: 'Overall Match',

      showIndividualMeetings: false,
      inviteMethod: 'Specific Individuals',

      enableMediaPosts: false,
      tagOptions: ['Asking a Question','Giving a Shoutout','Sharing a Job Opportunity','Sharing a Resource','Trade Services','Request Feedback','Recruiting Teammates'],
      tags: [],

      subNavCategories: ['Hot','New'],
      subNavSelected: 'Hot',

      membersToInvite: [],
      inviteMethodOptions: []
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.pullOtherData = this.pullOtherData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.subNavClicked = this.subNavClicked.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.renderShareButtons = this.renderShareButtons.bind(this)
    this.itemClicked = this.itemClicked.bind(this)
    this.joinGroup = this.joinGroup.bind(this)
    this.filterResults = this.filterResults.bind(this)
    this.renderTags = this.renderTags.bind(this)
    this.removeTag = this.removeTag.bind(this)
    this.searchItemClicked = this.searchItemClicked.bind(this)
    this.addItem = this.addItem.bind(this)
    this.changeGroup = this.changeGroup.bind(this)
    this.renderGroups = this.renderGroups.bind(this)
    this.passPosts = this.passPosts.bind(this)
    this.passMeeting = this.passMeeting.bind(this)
    this.calculateMatches = this.calculateMatches.bind(this)
    this.inviteMembers = this.inviteMembers.bind(this)

  }

  componentDidMount() {
    console.log('group details component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in groupDetails ', this.props, prevProps)

    if (this.props.selectedGroup !== prevProps.selectedGroup) {
      this.retrieveData()
    } else if (this.props.groupId !== prevProps.groupId) {
      this.retrieveData()
    } else if (this.props.activeOrg !== prevProps.activeOrg) {
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
      } else if (this.props.activeOrg) {
        activeOrg = this.props.activeOrg
      }

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        const accountCode = this.props.accountCode
        // console.log('show deets: ', cuFirstName)

        let groupId = null
        if (this.props.selectedGroup) {
          console.log('show selectedGroup in props: ', this.props.selectedGroup)

          groupId = this.props.selectedGroup._id
          console.log('show id: ', groupId)

          // update group
          // Axios.get('https://www.guidedcompass.com/api/groups/byid', { params: { groupId } })
          // .then((response) => {
          //    console.log('Group detail by id query attempted', response.data);
          //
          //    if (response.data.success) {
          //      console.log('successfully retrieved posting', orgName)
          //
          //      const selectedGroup = response.data.group
          //      this.setState({ selectedGroup, emailId, username, cuFirstName, cuLastName, activeOrg, orgFocus, orgName, roleName })
          //      this.pullOtherData(selectedGroup, emailId, cuFirstName, cuLastName, activeOrg)
          //
          //    } else {
          //      console.log('there was an issue')
          //    }
          // }).catch((error) => {
          //     console.log('Group query did not work', error);
          // });

        } else if (this.props.groupId) {
          console.log('show id in props ', this.props.groupId)

          groupId = this.props.groupId

        } else {
          console.log('something went wrong')
        }

        // pull group details
        Axios.get('https://www.guidedcompass.com/api/groups/byid', { params: { groupId } })
        .then((response) => {
           console.log('Group detail by id query attempted', response.data);

           if (response.data.success) {
             console.log('successfully retrieved posting')

             const selectedGroup = response.data.group
             let inviteMethodOptions = ['','All Members', 'Specific Individuals']

             this.setState({ selectedGroup, emailId, username, cuFirstName, cuLastName, activeOrg, orgFocus, orgName, roleName, inviteMethodOptions })
             this.pullOtherData(selectedGroup, emailId, cuFirstName, cuLastName, activeOrg)

             if (selectedGroup.accountCode) {
               Axios.get('https://www.guidedcompass.com/api/account', { params: { accountCode: selectedGroup.accountCode } })
               .then((response) => {
                 console.log('Account info query attempted within sub settings', response.data);

                 if (response.data.success) {
                   console.log('account info query worked in sub settings')

                   const employerName = response.data.accountInfo.employerName
                   const employerURL = response.data.accountInfo.employerURL
                   const employerType = response.data.accountInfo.employerType
                   const employerIndustry = response.data.accountInfo.employerIndustry
                   const employeeCount = response.data.accountInfo.employeeCount
                   const employerLocation = response.data.accountInfo.employerLocation
                   const employerDescription = response.data.accountInfo.description
                   const employerCulture = response.data.accountInfo.employerCulture
                   const employerLogoURI = response.data.accountInfo.employerLogoURI

                   this.setState({
                     employerName, employerURL, employerType, employerIndustry, employeeCount, employerLocation, employerDescription,
                     employerCulture, employerLogoURI
                   });
                 }

               }).catch((error) => {
                 console.log('Account info query did not work for some reason', error);
               });
             }

           }
        }).catch((error) => {
            console.log('Group query did not work', error);
        });

        let groupsQuery = { orgCode: activeOrg, resLimit: 4, emailId }
        if (this.props.fromAdvisor) {
          groupsQuery = { orgCode: activeOrg, resLimit: 4 }
        }

        if (activeOrg || accountCode) {
          Axios.get('https://www.guidedcompass.com/api/groups', { params: groupsQuery })
          .then((response) => {
            console.log('Groups query worked', response.data);

            if (response.data.success) {

              const groups = response.data.groups

              let groupsManaged = null
              let groupsJoined = null
              if (this.props.fromAdviso) {
                groupsManaged = groups
              } else {
                if (groups) {
                  groupsManaged = []
                  groupsJoined = []
                  for (let i = 1; i <= groups.length; i++) {
                    if (groups[i - 1].creatorEmail === emailId) {
                      groupsManaged.push(groups[i - 1])
                    } else {
                      groupsJoined.push(groups[i - 1])
                    }
                  }
                }
              }
              this.setState({ groups, groupsManaged, groupsJoined })

            } else {
              console.log('no groups data found', response.data.message)
            }

          }).catch((error) => {
              console.log('Groups query did not work', error);
          });
        }

        Axios.get('https://www.guidedcompass.com/api/logs/goals', { params: { emailId } })
        .then((response) => {

            if (response.data.success) {
              console.log('Goals received query worked', response.data);

              if (response.data.goals && response.data.goals.length > 0) {

                const goals = response.data.goals
                this.setState({ goals })

              }

            } else {
              console.log('no goal data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Goal query did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  pullOtherData(selectedGroup, emailId, cuFirstName, cuLastName, activeOrg) {
    console.log('pullOtherData called', selectedGroup, emailId)

    let members = []
    if (selectedGroup.members) {
      members = selectedGroup.members
    }

    const shareURL = "https://wwww.guidedcompass.com"
    const shareTitle = 'Check Out ' + selectedGroup.name + ' On Guided Compass!'
    const shareBody = selectedGroup.name + " is a great forum to connect with like-minded individuals, mentors / mentees, and opportunities."

    this.setState({ members, shareURL, shareTitle, shareBody })

    Axios.get('https://www.guidedcompass.com/api/logs/meetings', { params: { groupId: selectedGroup._id, resLimit: 12 } })
    .then((response) => {

        if (response.data.success) {
          console.log('Meetings query worked', response.data);

          let meetings = response.data.meetings
          this.setState({ meetings })

        } else {
          console.log('no meeting data found', response.data.message)
        }

    }).catch((error) => {
        console.log('Meeting query did not work', error);
    });

    const accountabilityParams = { params: { emailId, members, resLimit: 10 }}
    // const accountabilityParam = { params: { emailId, excludeCurrentUser: true, members, resLimit: 10 }}
    Axios.get('https://www.guidedcompass.com/api/groups/accountability/goals', accountabilityParams)
    .then((response) => {

      if (response.data.success) {
        console.log('Member goals received query worked', response.data);

        if (response.data.memberGoals && response.data.memberGoals.length > 0) {

          const memberGoals = response.data.memberGoals
          this.setState({ memberGoals })

        }

      } else {
        console.log('no goal data found', response.data.message)
      }

    }).catch((error) => {
        console.log('Goal query did not work', error);
    });

    Axios.get('https://www.guidedcompass.com/api/group-posts', { params: { groupId: selectedGroup._id, orgCode: activeOrg, sortByUpvotes: true } })
    .then((response) => {
       console.log('Group posts query attempted', response.data);

       if (response.data.success) {
         console.log('successfully retrieved group posts')

         let groupPosts = []
         if (response.data.groupPosts) {
           groupPosts = response.data.groupPosts
         }

         this.setState({ groupPosts })

       } else {
         this.setState({ groupPosts: [] })
       }
    }).catch((error) => {
        console.log('Group posts query did not work', error);
        this.setState({ groupPosts: [] })
    });

    Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: emailId } })
    .then((response) => {
      console.log('User details query 1 attempted', response.data);

      if (response.data.success) {
         console.log('successfully retrieved user details')

         let profile = response.data.user
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

              if (selectedGroup.category === 'Accountability') {
                this.calculateMatches(emailId, profile, selectedGroup.members, response2.data.results.workPreferenceAnswers, response2.data.results.interestScores, response2.data.results.newSkillAnswers, response2.data.results.personalityScores, null, 'Descending')
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

    if (!selectedGroup.orgName) {
      Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: selectedGroup.orgCode } })
      .then((response) => {
        console.log('Org info query attempted for orgFocus on login', response.data);

          if (response.data.success) {
            console.log('org info query worked for orgFocus')

            selectedGroup['orgName'] = response.data.orgInfo.orgName
            selectedGroup['orgContactEmail'] = response.data.orgInfo.contactEmail
            selectedGroup['orgContactFirstName'] = response.data.orgInfo.contactFirstName
            selectedGroup['orgContactLastName'] = response.data.orgInfo.contactLastName
            this.setState({ selectedGroup })

          } else {
            console.log('org info query did not work', response.data.message)
          }

      }).catch((error) => {
          console.log('Org info query did not work for some reason', error);
      });
    }
  }

  calculateMatches(emailId, passedPartner, members, wpData, interestsResults, skillsResults, personalityResults, passedMatchCriteria, passedSortDirection) {
    console.log('calculateMatches called', emailId, passedPartner, members, wpData, interestsResults, skillsResults, personalityResults)

    let matchCriteria = this.state.matchCriteria
    if (passedMatchCriteria) {
      matchCriteria = passedMatchCriteria
    }

    let sortDirection = this.state.sortDirection
    if (passedSortDirection) {
      sortDirection = passedSortDirection
    }

    // console.log('show interest and personality results ', wpData, interestsResults, personalityResults)

    Axios.post('https://www.guidedcompass.com/api/assessment/partners/calculate', { emailId, partners: members, passedPartner, wpData, interestsResults, skillsResults, personalityResults, matchCriteria, sortDirection, orgCode: this.state.org })
    .then((response) => {
      console.log('Member match query worked', response.data);

      if (response.data.success) {

        console.log('successfully matched to members')
        let matches = response.data.matches
        if (response.data.matches) {
          for (let i = 1; i <= response.data.matches.length; i++) {
            for (let j = 1; j <= members.length; j++) {
              // console.log('show emails: ', response.data.matches[i - 1].partner.email)
              if (response.data.matches[i - 1].partner.email === members[j - 1].email) {
                let matchScore = (100 - response.data.matches[i - 1].differential).toFixed()
                if (matchScore > 0) {
                  members[j - 1].matchScore = matchScore
                }
              }
            }
          }
        }
        console.log('show matches: ', matches)
        this.setState({ members })

        // this.indicateWhetherPaired(matches, null)

      } else {
        console.log('there was an error matching partners', response.data.message)
      }

    }).catch((error) => {
        console.log('Partner match did not work', error);
    });
  }

  formChangeHandler = (eventName,eventValue) => {
    console.log('formChangeHandler called')

    if (eventName === 'searchMembers') {
      const searchString = eventValue
      this.setState({ searchString, animating: true })
      this.filterResults(eventValue, '', null, null, true, 'referee','members')
    } else if (eventName === 'searchGroups') {
      const searchString = eventValue
      this.setState({ searchString, animating: true })
      this.filterResults(eventValue, '', null, null, true, null,'groups')
    } else {
      this.setState({ [eventName]: eventValue })
    }
  }

  filterResults(searchString, filterString, filters, index, search, searchType, type) {
    console.log('filterResults called', searchString, filterString, filters, index, search, searchType, type)

    const orgCode = this.state.activeOrg
    const excludeCurrentUser = true
    const emailId = this.state.emailId
    const roleNames = ['Student','Career-Seeker']

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called', orgCode)
      self.setState({ animating: true, errorMessage: null, successMessage: null })

      if (type === 'groups') {

        Axios.get('https://www.guidedcompass.com/api/groups/search', { params: { searchString, orgCode, roleNames, excludeCurrentUser, emailId } })
        .then((response) => {
          console.log('Opportunity search query attempted', response.data);

            if (response.data.success) {
              console.log('opportunity search query worked')

              let groupOptions = response.data.groups
              self.setState({ groupOptions, filteredResults: true, animating: false })

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
        Axios.get('https://www.guidedcompass.com/api/members/search', { params: { searchString, orgCode } })
        .then((response) => {
          console.log('Members query attempted', response.data);

            if (response.data.success) {
              console.log('successfully retrieved members')

              let memberOptions = null
              if (response.data.members) {
                memberOptions = response.data.members
              }

              self.setState({ memberOptions, animating: false })

            } else {
              console.log('no member data found', response.data.message)
              self.setState({ animating: false, errorMessage: 'No courses were found that match that criteria' })
            }

        }).catch((error) => {
            console.log('Course query did not work', error);
            self.setState({ animating: false, errorMessage: 'Course query did not work for an unknown reason'})
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

  // filterResults(searchString, filterName, filterValue, search) {
  //   console.log('filterResults called', searchString, filterName, filterValue, search)
  //
  //   let roleNames = ['Student','Career-Seeker']
  //
  //   const self = this
  //   function officiallyFilter() {
  //     console.log('officiallyFilter called')
  //
  //     const orgCode = self.state.activeOrg
  //     const excludeCurrentUser = true
  //     const emailId = self.state.emailId
  //
  //     if (search) {
  //       Axios.get('https://www.guidedcompass.com/api/groups/search', { params: { searchString, orgCode, roleNames, excludeCurrentUser, emailId } })
  //       .then((response) => {
  //         console.log('Opportunity search query attempted', response.data);
  //
  //           if (response.data.success) {
  //             console.log('opportunity search query worked')
  //
  //             let groups = response.data.groups
  //             self.setState({ groups, filteredResults: true, animating: false })
  //
  //           } else {
  //             console.log('opportunity search query did not work', response.data.message)
  //
  //             let memberOptions = []
  //             self.setState({ memberOptions, animating: false })
  //
  //           }
  //
  //       }).catch((error) => {
  //           console.log('Search query did not work for some reason', error);
  //           self.setState({ animating: false })
  //       });
  //     } else {
  //       console.log('filter results: ', searchString, orgCode, filterName, filterValue)
  //
  //       const onlyPics = true
  //       const profile = self.state.profile
  //       let groups = self.state.groups
  //       // if (self.state.groups && self.state.groups[0] && self.state.groups[0].matchScore) {
  //       //   users = self.state.groups
  //       // }
  //
  //       // eventually query groups from back-end
  //       Axios.put('https://www.guidedcompass.com/api/groups/filter', { searchString, orgCode, filterName, filterValue, roleNames, onlyPics, profile, groups })
  //       .then((response) => {
  //         console.log('Groups filter query attempted', response.data);
  //
  //           if (response.data.success) {
  //             console.log('opportunity search query worked')
  //
  //             let groups = response.data.groups
  //             const filterCriteriaArray = response.data.filterCriteriaArray
  //             console.log('show filterCriteriaArray: ', filterCriteriaArray)
  //             self.setState({ groups, filterCriteriaArray, filteredResults: true, animating: false })
  //
  //           } else {
  //             console.log('opportunity search query did not work', response.data.message)
  //
  //             self.setState({ animating: false })
  //
  //           }
  //
  //       }).catch((error) => {
  //           console.log('Search query did not work for some reason', error);
  //           self.setState({ animating: false })
  //       });
  //     }
  //   }
  //
  //   const delayFilter = () => {
  //     console.log('delayFilter called: ')
  //     clearTimeout(self.state.timerId)
  //     self.state.timerId = setTimeout(officiallyFilter, 1000)
  //   }
  //
  //   delayFilter();
  // }

  searchItemClicked(passedItem, type) {
    console.log('searchItemClicked called', passedItem, type)

    const searchObject = passedItem
    let searchString = passedItem.firstName + ' ' + passedItem.lastName
    let memberOptions = null
    this.setState({ searchObject, searchString, memberOptions })

  }

  renderTags(type) {
    console.log('renderTags ', type)

    const membersToInvite = this.state.membersToInvite
    if (membersToInvite && membersToInvite.length > 0) {
      // console.log('about to in', favoritedOpportunities)
      return (
        <View key={"members"}>
          <View style={[styles.spacer]} />

          <View style={[styles.rowDirection,styles.flexWrap]}>
            {membersToInvite.map((value, optionIndex) =>
              <View key={"career|" + optionIndex}>

                <View style={[styles.topMarginNegative3,styles.rightMarginNegative12,styles.relativePosition,styles.zIndex1]} >
                  <TouchableOpacity onPress={() => this.removeTag(optionIndex,type)}>
                    <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.rightPadding5]}>
                  <View style={[styles.halfSpacer]} />
                  <View style={[styles.row7,styles.horizontalPadding20,styles.slightlyRoundedCorners,styles.transparentBorder,styles.lightBackground]}>
                    <Text style={[styles.descriptionText2]}>{value.firstName} {value.lastName}</Text>
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

  removeTag(index, type) {
    console.log('removeTag called', index, type)

    let membersToInvite = this.state.membersToInvite
    membersToInvite.splice(index, 1)
    this.setState({ membersToInvite })

  }

  addItem(type) {
    console.log('optionClicked called', type)

    this.setState({ errorMessage: null })

    if (!this.state.searchObject) {
      this.setState({ errorMessage: 'Please add a member'})
    } else {
      let membersToInvite = this.state.membersToInvite
      membersToInvite.push(this.state.searchObject)

      let searchString = ''
      let searchObject = null
      this.setState({ membersToInvite, searchString, searchObject })
    }
  }

  subNavClicked(itemSelected) {
    console.log('subNavClicked called', itemSelected)

    let groupPosts = this.state.groupPosts
    if (itemSelected === 'Hot') {
      groupPosts.sort(function(a,b) {
        return b.upvotes.length - a.upvotes.length;
      })

    } else {
      // new posts

      groupPosts.sort(function(a,b) {
        let ds1 = a.updatedAt
        let ds2 = b.updatedAt
        if (ds1 && ds2) {
          let d1 = new Date(ds1)
          let d2 = new Date(ds2)
          console.log('eh? eh?', d1, d2)
          return d2 - d1;
        }
      })

      console.log('eh? ', groupPosts)
    }

    this.setState({ subNavSelected: itemSelected, groupPosts })
  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showDescription: false, showMembers: false, showShareButtons: false,
      showInvite: false, showPost: false, sharePosting: false,
      showAddMeeting: false, showEditGroup: false, showGoalDetails: false, showHelpOutWidget: false,
      groupToEdit: false, showAllMeetings: false, showViewMeeting: false, showPicker: false
    })
  }

  joinGroupNotifications() {
    console.log('joinGroupNotifications called')

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    let groupId = this.state.selectedGroup._id
    const member = {
      firstName: this.state.cuFirstName, lastName: this.state.cuLastName,
      email: this.state.emailId, roleName: this.state.roleName, pictureURL: this.state.pictureURL,
      username: this.state.username
    }

    Axios.post('https://www.guidedcompass.com/api/groups/save', { groupId, member, changeNotifications: true })
    .then((response) => {
      console.log('attempting to save addition to groups')
      if (response.data.success) {
        console.log('saved addition to groups', response.data)

        let selectedGroup = response.data.group
        this.setState({ successMessage: response.data.message, selectedGroup, isSaving: false })

      } else {
        console.log('did not save successfully')
        this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ errorMessage: 'there was an error saving groups', isSaving: false})
    });
  }

  renderShareButtons() {
    console.log('renderShareButtons called')


  }

  itemClicked(selectedTag) {
    console.log('itemClicked called', selectedTag)

    let tags = this.state.tags
    if (tags.includes(selectedTag)) {
      const index = tags.indexOf(selectedTag)
      tags.splice(index, 1)
    } else {
      tags.push(selectedTag)
    }
    this.setState({ tags })
  }

  joinGroup(joinGroup) {
    console.log('joinGroup called', joinGroup)

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    let groupId = this.state.selectedGroup._id
    const member = {
      firstName: this.state.cuFirstName, lastName: this.state.cuLastName,
      email: this.state.emailId, roleName: this.state.roleName, pictureURL: this.state.pictureURL,
      username: this.state.username
    }
    const accessType = this.state.selectedGroup.accessType

    let leaveGroup = false
    if (!joinGroup) {
      leaveGroup = true
    }

    Axios.post('https://www.guidedcompass.com/api/groups/save', { groupId, member, accessType, joinGroup, leaveGroup })
    .then((response) => {
      console.log('attempting to save addition to groups')
      if (response.data.success) {
        console.log('saved addition to groups', response.data)

        let selectedGroup = response.data.group
        this.setState({ successMessage: response.data.message, selectedGroup, isSaving: false })

      } else {
        console.log('did not save successfully')
        this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ errorMessage: 'there was an error saving groups', isSaving: false})
    });
  }

  changeGroup(index, type) {
    console.log('changeGroup called', this.state.groupOptions, index)

    const groupOptions = null
    this.setState({ groupOptions, searchString: '' })

    let gos = this.state.groupOptions
    if (type === 'managed') {
      gos = this.state.groupsManaged
    } else if (type === 'joined') {
      gos = this.state.groupsJoined
    }

    this.props.navigation.navigate('GroupDetails', { selectedGroup: gos[index]})
  }

  passPosts(groupPosts) {
    console.log('passPosts called')
    this.setState({ groupPosts })
  }

  renderGroups(groups, passedKey) {
    console.log('renderGroups called')

    return (
      <View key={passedKey}>
        {groups && groups.map((value, index) =>
          <View key={value}>
            <View style={[styles.row5]}>
              <TouchableOpacity style={[styles.rowDirection]} onPress={() => this.changeGroup(index, passedKey)}>
                <View style={[styles.width70]}>
                  <Image source={(value.pictureURL) ? { uri: value.pictureURL} : { uri: this.state.defaultCoverImage}} style={[styles.square50,styles.contain]}/>
                </View>
                <View className="calc-column-offset-70">
                  <Text style={[styles.descriptionText1,styles.ctaColor]}>{value.name}</Text>
                  <View style={[styles.halfSpacer]} />
                </View>

              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    )

  }

  passMeeting(meeting) {
    console.log('passMeeting called', meeting)
    let meetings = this.state.meetings
    if (meetings) {
      meetings.unshift(meeting)
    } else {
      meetings = [meeting]
    }
    this.setState({ meetings })
  }

  inviteMembers() {
    console.log('inviteMembers called')

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    if (!this.state.membersToInvite || this.state.membersToInvite.length === 0) {
      this.setState({ isSaving: false, errorMessage: 'Please add at least one member' })
    } else {

      const membersToInvite = this.state.membersToInvite

      let recipientEmails = []
      let recipientFirstNames = []
      let recipientLastNames = []
      for (let i = 1; i <= membersToInvite.length; i++) {
        recipientEmails.push(membersToInvite[i - 1].email)
        recipientFirstNames.push(membersToInvite[i - 1].firstName)
        recipientLastNames.push(membersToInvite[i - 1].lastName)
      }

      const senderFirstName = this.state.cuFirstName
      const senderLastName = this.state.cuLastName
      const senderEmail = this.state.emailId

      const orgCode = this.state.activeOrg
      let orgName = null

      const accountCode = this.state.accountCode
      const employerName = this.state.employerName
      const recipientType = ''
      const message = 'Check out this group: ' + this.state.shareURL
      const type = 'Message'
      const relationship = ''
      const isApproved = false
      const isDecided = false

      const notiObject = {
        recipientEmails, recipientFirstNames, recipientLastNames,
        senderFirstName, senderLastName, senderEmail,
        orgCode, orgName, accountCode, employerName, recipientType, message, type, relationship, isApproved, isDecided
      }

      Axios.post('https://www.guidedcompass.com/api/notifications/message', notiObject)
      .then((response) => {
        console.log('attempting to save addition to groups')
        if (response.data.success) {
          console.log('saved addition to groups', response.data)

          this.setState({ successMessage: response.data.message, isSaving: false })
          this.closeModal()

        } else {
          console.log('did not save successfully')
          this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({ errorMessage: 'there was an error saving groups', isSaving: false})
      });
    }
  }

  renderMeetings(all) {
    console.log('renderMeetings called', all)

    return (
      <View>
        {this.state.meetings.map((value, index) =>
          <View key={value}>
            {(all || (!all && index < 3)) && (
              <View style={[styles.bottomPadding]}>
                {(this.props.fromAdvisor || this.state.selectedGroup.admins.some(admin => admin.email === this.state.emailId)) ? (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showAddMeeting: true, editExisting: true, logId: value._id, log: value })}>
                    <View className="fixed-column-35 height-50">
                      <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                      <Image source={{ uri: calendarIconDark}} style={[styles.square18,styles.contain]} />
                    </View>
                    <View className="calc-column-offset-35">
                      <Text style={[styles.descriptionText1]}>{convertDateToString(new Date(value.startTime),"datetime-2")} Meeting</Text>
                      <Text style={[styles.descriptionText3]}>{value.location}</Text>
                    </View>

                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showViewMeeting: true, selectedMeeting: value })}>
                    <View className="fixed-column-35 height-50">
                      <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                      <Image source={{ uri: calendarIconDark}} style={[styles.square18,styles.contain]} />
                    </View>
                    <View className="calc-column-offset-35">
                      <Text style={[styles.descriptionText1]}>{convertDateToString(new Date(value.startTime),"datetime-2")} Meeting</Text>
                      <Text style={[styles.descriptionText3]}>{value.location}</Text>
                    </View>

                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
        )}
      </View>
    )
  }

  render() {

    let browseGroupsLink = "/app/browse-groups"
    if (this.props.fromAdvisor) {
      browseGroupsLink = "/advisor/groups"
    }

    return (
        <ScrollView>
          {(this.state.selectedGroup) && (
            <View style={[styles.topMargin20]}>
              {(this.state.showLeftSideBar) && (
                <View className="relative-column-30 horizontal-padding">
                  <View style={[styles.rightPadding20]}>

                    {(!this.props.fromAdvisor) && (
                      <View className="card-clear-padding min-width-100 max-width-260 pin-right bottom-margin-20">
                        <View className="full-width height-5 primary-background" />

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfile')} className="background-button full-width standard-color">
                          <View style={[styles.topPadding20]}>
                            <View style={[styles.row10]}>
                              <Image source={(this.state.pictureURL) ? { uri: this.state.pictureURL} : { uri: profileIconDark}} className="profile-thumbnail-6 center-horizontally" />
                            </View>
                          </View>
                          <View style={[styles.row5,styles.centerText]}>
                            <Text style={[styles.headingText6]}>{this.state.cuFirstName} {this.state.cuLastName}</Text>
                          </View>
                        </TouchableOpacity>

                        <View style={[styles.row10,styles.horizontalPadding30]}>
                          <View style={[styles.ctaHorizontalLine]} />
                        </View>

                        {(this.state.goals && this.state.goals.length > 0) ? (
                          <View style={[styles.row10,styles.horizontalPadding30]}>
                            {this.state.goals.map((value, index) =>
                              <View key={value}>
                                {(index < 3) && (
                                  <View style={[styles.bottomPadding]}>
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('EditLog', { editExisting: true, log: value })}>
                                      <View style={[styles.width35]}>
                                        <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                        <Image source={{ uri: targetIconOrange}} style={[styles.square18,styles.contain]} />
                                      </View>
                                      <View className="calc-column-offset-35">
                                        <Text style={[styles.descriptionText1]}>{value.title}</Text>
                                        <Text style={[styles.descriptionText3]}>Due {value.deadline}</Text>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            )}

                            <View>
                              <View style={[styles.ctaHorizontalLine]} />
                              <View style={[styles.spacer]} />

                              <TouchableOpacity style={[styles.row5,styles.flexCenter]} onPress={() => this.props.navigation.navigate('EditLog', { editExisting: false, logType: 'Goal' })}>
                                <Text style={[styles.descriptionText2,styles.centerText,styles.row5]}>Add a Goal</Text>
                              </TouchableOpacity>
                            </View>
                          </View>
                        ) : (
                          <View style={[styles.row10]}>
                            <Image source={{ uri: targetIconOrange}} style={[styles.square38,styles.centerHorizontally]} />

                            <View style={[styles.row10,styles.centerText,styles.horizontalpadding30]}>
                              <Text style={[styles.descriptionText2]}>You're Goalless!</Text>
                              <Text style={[styles.descriptionText4,styles.row5]}>Get your life together and aim for a brighter future!</Text>
                            </View>

                            <View style={[styles.row10]}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('EditLog', { editExisting: false, logType: 'Goal' })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.centerHorizontally,styles.flexCenter]}><Text style={[styles.descriptionText2,styles.whiteColor]}>Add a Goal</Text></TouchableOpacity>
                            </View>
                          </View>
                        )}

                        <View style={[styles.spacer]} />

                      </View>
                    )}

                    <View className="card-clear-padding min-width-100 max-width-260 pin-right bottom-margin-20">
                      <View style={[styles.padding20]}>
                        <Text style={[styles.headingText3]}>Groups</Text>

                        <View className="filter-field-search full-width white-background">
                          <View className="search-icon-container">
                            <View style={[styles.miniSpacer]} />
                            <Image source={{ uri: searchIcon}} style={[styles.square18,styles.contain]} />
                          </View>
                          <View className="filter-search-container calc-column-offset-50">
                            <TextInput
                              style={styles.textInput}
                              onChangeText={(text) => this.formChangeHandler("searchGroups", text)}
                              value={this.state.searchString}
                              placeholder="Search groups..."
                              placeholderTextColor="grey"
                            />
                          </View>
                        </View>

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
                          <View className="full-width">
                            {this.renderGroups(this.state.groupOptions,'options')}
                          </View>
                        )}

                        <View style={[styles.spacer]} />

                        <View style={[styles.row10]}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('Groups')} style={[styles.flexCenter]}>
                            <View style={[styles.width30]}>
                              <Image source={{ uri: websiteIconDark}} style={[styles.square20,styles.contain]} />
                            </View>
                            <View className="calc-column-offset-30">
                              <Text>Discover other groups</Text>
                            </View>

                          </TouchableOpacity>
                        </View>
                        <View style={[styles.row10]}>
                          <TouchableOpacity style={[styles.btnSquarish,styles.flexCenter]} onPress={() => this.setState({ modalIsOpen: true, showEditGroup: true, groupToEdit: null })}>
                            <View style={[styles.width30]}>
                              <Image source={{ uri: addIconWhite}} style={[styles.square20,styles.contain,styles.padding3]} />
                            </View>
                            <View className="calc-column-offset-30">
                              <Text>Create new group</Text>
                            </View>

                          </TouchableOpacity>
                        </View>
                      </View>

                      <View style={[styles.horizontalLine]} />

                      <View style={[styles.padding20]}>
                        <Text style={[styles.headingText5]}>Groups you manage</Text>

                        {(this.state.groupsManaged && this.state.groupsManaged.length > 0) ? (
                          <View className="full-width top-margin">
                            {this.renderGroups(this.state.groupsManaged,'managed')}

                            {(this.state.groupsManaged.length > 3) && (
                              <View>
                                <View style={[styles.horizontalLine]} />

                                <View style={[styles.topMargin]}>
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Community')}>
                                    <Text style={[styles.ctaColor,styles.centerText,styles.descriptionText1]}>View All</Text>
                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View className="full-width top-margin">
                            <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>You currently aren't the admin of any groups</Text>
                          </View>
                        )}

                      </View>

                      {(!this.props.fromAdvisor) && (
                        <View>
                          <View style={[styles.horizontalLine]} />

                          <View style={[styles.padding20]}>
                            <Text style={[styles.headingText5]}>Groups you've joined</Text>

                            {(this.state.groupsJoined && this.state.groupsJoined.length > 0) ? (
                              <View className="full-width top-margin">
                                {this.renderGroups(this.state.groupsJoined,'joined')}

                                {(this.state.groupsJoined.length > 3) && (
                                  <View>
                                    <View style={[styles.horizontalLine]} />

                                    <View style={[styles.topMargin]}>
                                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Community', { editExisting: true, log: value })}>
                                        <Text style={[styles.descriptionText1,styles.ctaColor,styles.centerText]}>View All</Text>
                                      </TouchableOpacity>
                                    </View>
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View className="full-width top-margin">
                                <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>You currently haven't joined any groups</Text>
                              </View>
                            )}

                          </View>
                        </View>
                      )}

                    </View>
                  </View>
                </View>
              )}

              <View style={[styles.fullScreenWidth]}>
                <View style={[styles.cardClearPadding,styles.fullScreenWidth]}>
                  <Image source={(this.state.selectedGroup.pictureURL) ? { uri: this.state.selectedGroup.pictureURL} : { uri: this.state.defaultCoverImage}} style={[styles.fullScreenWidth,styles.height150,styles.centerHorizontally,styles.slightlyRoundedCorners]}  />
                  <View style={[styles.horizontalLine]} />
                  <View style={[styles.padding30]}>
                    <View>
                      <View style={[styles.row10]}>
                        <Text style={[styles.headingText2]}>{this.state.selectedGroup.name}</Text>
                        <Text>{this.state.selectedGroup.category}</Text>
                      </View>
                      <View style={[styles.row10]}>
                        <View style={[styles.rowDirection,styles.flexWrap]}>
                          <View style={[styles.rightPadding]}>
                            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showDescription: true })}>
                              <Image source={{ uri: infoIconDark}} style={[styles.square20,styles.contain,styles.pinRight]} />
                            </TouchableOpacity>
                          </View>

                          <View style={[styles.rightPadding]}>
                            <TouchableOpacity onPress={() => this.joinGroupNotifications()}>
                              <Image source={(this.state.selectedGroup.notifiees && this.state.selectedGroup.notifiees.some(notifiee => notifiee.email === this.state.emailId)) ? { uri: notificationsIconBlue} : { uri: notificationsIconDark}} style={[styles.square20,styles.contain,styles.pinRight]} />
                            </TouchableOpacity>
                          </View>

                          {(this.state.selectedGroup.members && this.state.selectedGroup.members.some(member => member.email === this.state.emailId)) && (
                            <View style={[styles.rightPadding]}>
                              <TouchableOpacity onPress={() => this.joinGroup(false)}>
                                <Image source={{ uri: exitIconDark}} style={[styles.square20,styles.contain,styles.pinRight]} />
                              </TouchableOpacity>
                            </View>
                          )}

                          {(this.props.fromAdvisor || this.state.selectedGroup.creatorEmail === this.state.emailId) && (
                            <View style={[styles.rightPadding]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showEditGroup: true, groupToEdit: this.state.selectedGroup })}>
                                <Image source={{ uri: editIconDark}} style={[styles.square18,styles.contain,styles.pinRight]} />
                              </TouchableOpacity>
                            </View>
                          )}

                        </View>

                      </View>

                    </View>

                    <View>
                      {(this.state.members && this.state.members.length > 0) && (
                        <View style={[styles.row10]}>
                          <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showMembers: true })} style={[styles.rowDirection]}>
                            <View style={[styles.rightPadding]}>
                              {(this.state.members) && (
                                <View style={[styles.leftPadding,styles.rowDirection,styles.flexWrap]}>
                                  {this.state.members.map((item, index) =>
                                    <View key={index}>
                                      {(index < 3) && (
                                        <Image source={(item.pictureURL) ? { uri: item.pictureURL} : { uri: profileIconDark}} style={[styles.square30,styles.contain,styles.standardBorder,styles.leftMarginNegative30, { borderRadius: 15 }]} />
                                      )}

                                    </View>
                                  )}
                                </View>
                              )}
                            </View>
                            <View style={[styles.rightPadding]}>
                              <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                              <Text style={[styles.boldText]}>{this.state.members.length} members</Text>
                            </View>
                            <View style={[styles.rightPadding]}>
                              <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square12,styles.contain,styles.pinRight]} />
                            </View>

                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    {((this.state.selectedGroup.members && this.state.selectedGroup.members.some(member => member.email === this.state.emailId))) ? (
                      <View style={[styles.topPadding20,styles.rowDirection,styles.flex1]}>
                        <View style={[styles.flex50]}>
                          <TouchableOpacity style={[styles.btnSquarish,styles.ctaBorder,styles.rightMargin5,styles.flexCenter]} onPress={() => this.setState({ modalIsOpen: true, showInvite: true })}>
                            <Text style={[styles.ctaColor,styles.descriptionText1]}>Invite</Text>
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.flex50]}>
                          <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showShareButtons: true })} style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.leftMargin5,styles.flexCenter]}>
                            <Text style={[styles.descriptionText1,styles.whiteColor]}>Share</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    ) : (
                      <View style={[styles.topPadding]}>
                        <View>
                          {(this.state.selectedGroup.accessType === 'Open') ? (
                            <TouchableOpacity style={[styles.btnSquarish,styles.ctaBorder,styles.rightMargin5,styles.flexCenter]} onPress={() => this.joinGroup(true)}>
                              <Text style={[styles.ctaColor,styles.descriptionText1]}>Join Group</Text>
                            </TouchableOpacity>
                          ) : (
                            <View>
                              {((this.state.selectedGroup.requests && this.state.selectedGroup.requests.some(request => request.email === this.state.emailId))) ? (
                                <View style={[styles.rowDirection,styles.rightMargin5]}>
                                  <View style={[styles.rightPadding]}>
                                    <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                    <Image source={{ uri: timeIconBlue}} style={[styles.square15,styles.contain]} />
                                  </View>
                                  <View>
                                    <Text style={[styles.descriptionText2,styles.boldText,styles.centerText]}>Requested Access</Text>
                                  </View>

                                </View>
                              ) : (
                                <TouchableOpacity style={[styles.btnSquarish,styles.ctaBorder,styles.rightMargin5,styles.flexCenter]} onPress={() => this.joinGroup(true)}>
                                  <Text style={[styles.ctaColor,styles.descriptionText1]}>Request</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}

                        </View>
                      </View>
                    )}

                  </View>
                </View>

                {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor,styles.centerText,styles.row5]}>{this.state.errorMessage}</Text>}
                {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor,styles.centerText,styles.row5]}>{this.state.successMessage}</Text>}

                <View style={[styles.cardClearPadding,styles.topMargin20]}>
                  <TouchableOpacity style={[styles.lightBorder,styles.row5,styles.horizontalPadding5,styles.topMargin15,styles.rightPadding]} onPress={() => this.setState({ modalIsOpen: true, showPost: true })}>
                    <View style={[styles.rowDirection]}>
                      <View style={[styles.topPadding8,styles.leftPadding3]}>
                        <Image source={{ uri: editIconDark}} style={[styles.square16,styles.contain,styles.padding5]} />
                      </View>
                      <View style={[styles.calcColumn35]}>
                        <Text style={[styles.descriptionTextColor,styles.row10,styles.leftPadding]}>Start a conversation...</Text>
                      </View>
                    </View>

                    {(this.state.enableMediaPosts) && (
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.topPadding8,styles.leftPadding3]}>
                          <Image source={{ uri: videoIcon }} style={[styles.square28,styles.contain,styles.padding5]} />
                        </View>
                        <View style={[styles.topPadding8,styles.leftPadding3]}>
                          <Image source={{ uri: imageIcon }} style={[styles.square28,styles.contain,styles.padding5]} />
                        </View>
                      </View>
                    )}
                  </TouchableOpacity>

                </View>

                <View style={[styles.cardClearPadding,styles.topMargin20]}>
                  <View>
                    <View>
                      <ScrollView style={[styles.carousel,styles.horizontalPadding20]} horizontal={true}>
                        {this.state.subNavCategories.map((value, index) =>
                          <View style={[styles.row10,styles.rightMargin30]}>
                            {(this.state.subNavCategories[index] === this.state.subNavSelected) ? (
                              <View style={[styles.selectedCarouselItem2]}>
                                <Text key={value} style={[styles.standardText]}>{value}</Text>
                              </View>
                            ) : (
                              <TouchableOpacity style={[styles.menuButton2]} onPress={() => this.subNavClicked(value)}>
                                <Text key={value} style={[styles.standardText]}>{value}</Text>
                              </TouchableOpacity>
                            )}
                          </View>
                        )}
                      </ScrollView>
                    </View>
                  </View>
                  <View style={[styles.horizontalLine]} />
                </View>

                {(this.state.groupPosts) && (
                  <View>
                    <SubRenderPosts posts={this.state.groupPosts} passedGroupPost={this.state.passedGroupPost} />
                  </View>
                )}
              </View>

              {(this.state.showRightSideBar) && (
                <View className="relative-column-30 horizontal-padding">
                  <View style={[styles.leftPadding20]}>
                    <View className="card min-width-100 max-width-260 bottom-margin-20">
                      <Text style={[styles.headingText3]}>{this.state.members.length} Members</Text>

                      {(this.state.selectedGroup.category === 'Accountability') ? (
                        <View>
                          {(this.state.members && this.state.members.length > 0) && (
                            <View style={[styles.row10]}>
                              <View>
                                {(this.state.members) && (
                                  <View>
                                    {this.state.members.map((item, index) =>
                                      <View key={index} style={[styles.row5]}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: item.username })}>
                                          <View className="fixed-column-40 right-padding">
                                            <Image source={(item.pictureURL) ? { uri: item.pictureURL} : { uri: profileIconDark}} style={[styles.square30,styles.contain,styles.standardBorder, { borderRadius: 15 }]}/>
                                          </View>
                                          <View className="calc-column-offset-40">
                                            <Text style={[styles.descriptionText1]}>{item.firstName} {item.lastName}{(this.state.selectedGroup.admins && this.state.selectedGroup.admins.some(admin => admin.email === item.email)) && " (Admin)"}</Text>
                                            {(item.matchScore) && (
                                              <Text style={[styles.descriptionText3,styles.ctaColor,styles.boldText]}>({item.matchScore}% match)</Text>
                                            )}
                                          </View>

                                        </TouchableOpacity>
                                      </View>
                                    )}
                                  </View>
                                )}
                              </View>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View style={[styles.topMargin]}>
                          {(this.state.members && this.state.members.length > 0) && (
                            <View style={[styles.row10]}>
                              <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showMembers: true })}>
                                <View className="float-left right-padding">
                                  {(this.state.members) && (
                                    <View style={[styles.leftPadding]}>
                                      {this.state.members.map((item, index) =>
                                        <View key={index} className="float-left">
                                          {(index < 3) && (
                                            <Image source={(item.pictureURL) ? { uri: item.pictureURL} : { uri: profileIconDark}} style={[styles.square30,styles.contain,styles.standardBorder,styles.leftMarginNegative30, { borderRadius: 15 }]} />
                                          )}

                                        </View>
                                      )}
                                    </View>
                                  )}
                                </View>
                                <View className="float-left right-padding">
                                  <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                  <Text><b>See all</b></Text>
                                </View>
                                <View className="float-left right-padding">
                                  <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                  <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square12,styles.contain,styles.pinRight]} />
                                </View>

                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}

                      <View style={[styles.topPadding]}>
                        <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.setState({ modalIsOpen: true, showInvite: true })}>
                          <Text style={[styles.descriptionText1,styles.whiteColor]}>Invite</Text>
                        </TouchableOpacity>
                      </View>
                    </View>

                    <View className="card min-width-100 max-width-260 bottom-margin-20">
                      <Text style={[styles.headingText3]}>About this group</Text>
                      <Text style={[styles.topPadding,styles.descriptionText1]}>{this.state.selectedGroup.description}</Text>
                      {(this.state.selectedGroup.groupGoals && this.state.selectedGroup.groupGoals.length > 0) && (
                        <View>
                          {this.state.selectedGroup.groupGoals.map((value, index) =>
                            <View key={value} className="float-left right-margin row-10 horizontal-padding-4 senary-background-light top-margin description-text-3">{value}</View>
                          )}

                        </View>
                      )}
                    </View>

                    {(this.state.selectedGroup.category === 'Employers') && (
                      <View className="card min-width-100 max-width-260 bottom-margin-20">
                        <Text style={[styles.headingText3]}>About {this.state.employerName}</Text>
                        <View style={[styles.spacer]} />
                        <TouchableOpacity style={[styles.row10,styles.descriptionText1]} onPress={() => Linking.openURL(this.state.employerURL)}><Text style={[styles.ctaColor,styles.boldText]}>About {this.state.employerURL}</Text></TouchableOpacity>

                        {(this.state.employerType) && (
                          <Text style={[styles.row10,styles.descriptionText1]}>Type: {this.state.employerType}</Text>
                        )}

                        {(this.state.employerIndustry) && (
                          <Text style={[styles.row10,styles.descriptionText1]}>Industry: {this.state.employerIndustry}</Text>
                        )}

                        {(this.state.employeeCount) && (
                          <Text style={[styles.row10,styles.descriptionText1]}>Employee Count: {this.state.employeeCount}</Text>
                        )}

                        {(this.state.employerLocation) && (
                          <Text style={[styles.row10,styles.descriptionText1]}>Employee Location: {this.state.employerLocation}</Text>
                        )}

                        {(this.state.employerDescription) && (
                          <Text style={[styles.row10,styles.descriptionText1]}>{this.state.employerDescription}</Text>
                        )}
                      </View>
                    )}

                    {((this.state.selectedGroup.members && this.state.selectedGroup.members.some(member => member.email === this.state.emailId)) || this.state.selectedGroup.creatorEmail === this.state.emailId || this.props.fromAdvisor) && (
                      <View>
                        {(this.state.selectedGroup.category === 'Accountability') && (
                          <View className="card min-width-100 max-width-260 bottom-margin-20">

                            {(this.state.showIndividualMeetings) ? (
                              <View>
                                <View>
                                  <View className="calc-column-offset-30">
                                    <Text style={[styles.headingText3]}>Meetings</Text>
                                  </View>

                                  {(this.props.fromAdvisor || this.state.selectedGroup.admins.some(admin => admin.email === this.state.emailId)) && (
                                    <View style={[styles.width30]}>
                                      <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                      <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showAddMeeting: true })}>
                                        <Image source={{ uri: addIcon}} style={[styles.square20,styles.contain]} />
                                      </TouchableOpacity>
                                    </View>
                                  )}
                                </View>

                                {(this.state.meetings && this.state.meetings.length > 0) ? (
                                  <View style={[styles.topPadding]}>
                                    {this.renderMeetings(false)}



                                    {(this.state.meetings && this.state.meetings.length > 0) && (
                                      <View>
                                        <View style={[styles.horizontalLine]} />
                                        <TouchableOpacity style={[styles.topMargin,styles.row10]} onPress={() => this.setState({ modalIsOpen: true, showAllMeetings: true })}>
                                          <Text style={[styles.ctaColor]}>See All</Text>
                                        </TouchableOpacity>
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View style={[styles.topPadding]}>
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>There are no past or upcoming meetings.</Text>
                                  </View>
                                )}
                              </View>
                            ) : (
                              <View>
                                <View style={[styles.row10]}>
                                  <Text style={[styles.headingText3]}>Meetings</Text>
                                </View>

                                <View style={[styles.row10]}>
                                  <Text style={[styles.descriptionTexg1,styles.descriptionTextColor,styles.bottomPadding5]}>Frequency</Text>
                                  <Text style={[styles.headingText6]}>{this.state.selectedGroup.meetingRepeats}</Text>
                                </View>

                                <View style={[styles.row10]}>
                                  <Text style={[styles.descriptionTexg1,styles.descriptionTextColor,styles.bottomPadding5]}>Start & End Times</Text>
                                  <Text style={[styles.headingText6]}>{convertDateToString(new Date(this.state.selectedGroup.meetingStartTime),"datetime-2")} - {convertDateToString(new Date(this.state.selectedGroup.meetingEndTime),"datetime-2")}</Text>
                                </View>

                                <View style={[styles.row10]}>
                                  <Text style={[styles.descriptionTexg1,styles.descriptionTextColor,styles.bottomPadding5]}>Method</Text>
                                  <Text style={[styles.headingText6]}>{this.state.selectedGroup.meetingMethod}</Text>
                                </View>

                                <View style={[styles.row10]}>
                                  <Text style={[styles.descriptionTexg1,styles.descriptionTextColor,styles.bottomPadding5]}>{(this.state.selectedGroup.meetingMethod === 'Remote') ? "Meeting Link" : "Location"}</Text>
                                  <Text style={[styles.headingText6]}>{this.state.selectedGroup.meetingLocation}</Text>
                                </View>

                              </View>
                            )}

                          </View>
                        )}
                      </View>
                    )}

                    {(this.state.selectedGroup.category === 'Accountability') && (
                      <View className="card min-width-100 max-width-260 bottom-margin-20">
                        <Text style={[styles.headingText3]}>Goals of Members</Text>

                        {(this.state.memberGoals && this.state.memberGoals.length > 0) ? (
                          <View style={[styles.row10]}>
                            <View style={[styles.spacer]} />
                            {this.state.memberGoals.map((value, index) =>
                              <View key={value}>
                                <View style={[styles.bottomPadding]}>
                                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showGoalDetails: true, selectedGoal: value })}>
                                    <View className="fixed-column-35 height-50">
                                      <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                      <Image source={{ uri: targetIconOrange}} style={[styles.square18,styles.contain]} />
                                    </View>
                                    <View className="calc-column-offset-35">
                                      <Text style={[styles.descriptionText1]}>{value.title}</Text>
                                      <Text style={[styles.descriptionText3]}>Due {value.deadline}</Text>
                                      <Text style={[styles.descriptionText3]}>By {value.creatorFirstName} {value.creatorLastName}</Text>
                                    </View>

                                  </TouchableOpacity>
                                </View>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View style={[styles.row10]}>
                            <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>Member of this group have not added any goals yet</Text>
                          </View>
                        )}
                      </View>
                    )}

                  </View>
                </View>
              )}
            </View>
          )}

          <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>

           {(this.state.showDescription) && (
             <View key="showDescription" style={[styles.fullScreenWidth,styles.padding20]}>
                <Text style={[styles.headingText2]}>{this.state.selectedGroup.name}</Text>
                <Text style={[styles.topPadding20]}>{this.state.selectedGroup.description}</Text>
              </View>
           )}

           {(this.state.showMembers) && (
             <ScrollView key="showMembers" style={[styles.fullScreenWidth,styles.padding20]}>
                <Text style={[styles.headingText2,styles.bottomPadding]}>Members of {this.state.selectedGroup.name}</Text>
                <View style={[styles.spacer]} />

                {this.state.members.map((item, index) =>
                  <View key={index} style={[styles.row5]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: item })}>
                      <View style={[styles.width70,styles.rightPadding]}>
                        <Image source={(item.pictureURL) ? { uri: item.pictureURL} : { uri: profileIconDark}} style={[styles.square60,styles.contain,styles.standardBorder, { borderRadius: 30 }]} />
                      </View>
                      <View className="calc-column-offset-100-static">
                        <Text style={[styles.headingText4]}>{item.firstName} {item.lastName}{(item.email === this.state.selectedGroup.creatorEmail) && " (Admin)"}</Text>
                        {(item.headline) && (
                          <Text style={[styles.descriptionText1,styles.row5]}>{item.headline}</Text>
                        )}
                        {(item.school && item.gradYear) && (
                          <Text style={[styles.descriptionText1,styles.row5]}>{item.school} {item.gradYear}</Text>
                        )}
                      </View>
                      <View style={[styles.width30]}>
                        <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square12,styles.contain,styles.pinRight]} />
                      </View>

                    </TouchableOpacity>
                  </View>
                )}

              </ScrollView>
           )}

           {(this.state.showShareButtons) && (
             <View key="showDescription" style={[styles.fullScreenWidth,styles.padding20]}>
                <Text style={[styles.headingText2,styles.centerText]}>Share {(this.state.sharePosting) ? " This Post " : this.state.selectedGroup.name} with Friends!</Text>

                <View style={[styles.topPadding20]}>
                  <Text style={[styles.standardText,styles.centerText]}>Share this link:</Text>
                  <Text style={[tyles.ctaColor,styles.boldText,styles.centerText]}>{this.state.shareURL}</Text>
                </View>

                <View style={[styles.spacer]} />

                <View style={[styles.topPadding20]}>
                  {this.renderShareButtons()}
                </View>

              </View>
           )}

           {(this.state.showInvite) && (
             <View key="showInvite" style={[styles.fullScreenWidth,styles.padding20]}>
               <View style={[styles.bottomPadding]}>
                 <Text style={[styles.headingText2]}>Select Members to Invite To {this.state.selectedGroup.name}</Text>
               </View>

               {(this.state.inviteMethod === 'Specific Individuals') && (
                 <View>
                   <View style={[styles.row10]}>
                     <View className="calc-column-offset-100-static">
                       <TextInput
                         style={styles.textInput}
                         onChangeText={(text) => this.formChangeHandler("searchMembers", text)}
                         value={this.state.searchString}
                         placeholder="Search members..."
                         placeholderTextColor="grey"
                       />
                     </View>
                     <View className="fixed-column-100 left-padding">
                       <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.addItem('member')}><Text style={[styles.descriptionText2,styles.whiteColor]}>Add</Text></TouchableOpacity>
                     </View>

                   </View>

                   {(this.state.memberOptions && this.state.searchString && this.state.searchString !== '') && (
                     <View>
                       {this.state.memberOptions.map((value, optionIndex2) =>
                         <View key={value._id}>
                           <TouchableOpacity onPress={() => this.searchItemClicked(value, 'member')}>
                             <View style={[styles.calcColumn40,styles.row5,styles.leftPadding]}>
                               <View style={[styles.width50]}>
                                 <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                 <Image source={(value.pictureURL) ? { uri: value.pictureURL} : { uri: profileIconDark}} style={[styles.square30,styles.contain,{ borderRadius: 15 }]} />
                               </View>
                               <View className="calc-column-offset-50">
                                <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                 <Text>{value.firstName} {value.lastName}</Text>
                                 {value.roleName && (
                                  <Text style={[styles.descriptionText3]}>({value.roleName})</Text>
                                 )}

                               </View>

                             </View>
                           </TouchableOpacity>
                         </View>
                       )}
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
                         <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Pulling search results...</Text>

                       </View>
                     </View>
                   ) : (
                     <View style={[styles.bottomPadding]}>
                       {this.renderTags('members')}

                     </View>
                   )}

                 </View>
               )}

               {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
               {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

               <View style={[styles.row10]}>
                 <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.inviteMembers()}>
                   <Text style={[styles.descriptionText1,styles.whiteColor]}>Invite Members</Text>
                 </TouchableOpacity>
               </View>

             </View>
           )}

           {(this.state.showPost || this.state.sharePosting) && (
             <View key="showPost" style={[styles.flex1,styles.padding20]}>
                <SubCreatePost sharePosting={this.state.sharePosting} originalPost={this.state.originalPost}  posts={this.state.groupPosts} passPosts={this.passPosts} closeModal={this.closeModal} pictureURL={this.state.pictureURL} groupId={this.state.selectedGroup._id} groupName={this.state.selectedGroup.name} />
              </View>
           )}

           {(this.state.showEditGroup) && (
             <View key="showEditGroup" style={[styles.flex1,styles.padding20]}>
                <SubEditGroup selectedGroup={this.state.groupToEdit} navigation={this.props.navigation} closeModal={this.closeModal} />
              </View>
           )}

           {(this.state.showAddMeeting) && (
             <View key="showAddMeeting" style={[styles.flex1,styles.padding20]}>
               <View style={[styles.bottomPadding]}>
                 <Text style={[styles.headingText2]}>Add a Meeting</Text>
                 <SubEditLog modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} navigation={this.props.navigation} editExisting={this.state.editExisting} log={this.state.log} logs={this.state.logs} passedLogType="Meeting" selectedAdvisor={this.state.selectedAdvisor} logId={this.state.logId} selectedGroup={this.state.selectedGroup} passMeeting={this.passMeeting}/>
                </View>
              </View>
           )}

           {(this.state.showViewMeeting) && (
             <View key="showViewMeeting" style={[styles.flex1,styles.padding20]}>
               <View style={[styles.bottomPadding]}>
                 <Text style={[styles.headingText2,styles.centerText]}>{convertDateToString(new Date(this.state.selectedMeeting.startTime),"datetime-2")} Meeting</Text>
                 <Text style={[styles.centerText,styles.topPadding]}>{this.state.selectedGroup.name}</Text>

                 <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                 <View style={[styles.row10]}>
                   <Text style={[styles.headingText6]}><Text style={[styles.boldText]}>Location:</Text> {this.state.selectedMeeting.location}</Text>
                 </View>

                 <View style={[styles.row10]}>
                   <Text style={[styles.headingText6]}><Text style={[styles.boldText]}>Description</Text></Text>
                   <Text style={[styles.headingText6]}>{this.state.selectedMeeting.description}</Text>
                 </View>
                 {(this.state.selectedMeeting.notes) && (
                   <View style={[styles.row10]}>
                     <Text style={[styles.headingText6]}><Text style={[styles.boldText]}>Meeting Minutes</Text></Text>
                     <Text style={[styles.headingText6]}>{this.state.selectedMeeting.notes}</Text>
                   </View>
                 )}

                 {(this.state.selectedMeeting.links && this.state.selectedMeeting.links.length > 0) && (
                   <View style={[styles.row10]}>
                     <Text style={[styles.headingText6]}><Text style={[styles.boldText]}>Links</Text></Text>
                     {this.state.selectedMeeting.links.map((item, optionIndex) =>
                      <View key={item} style={[styles.row5]}>
                        <TouchableOpacity onPress={() => Linking.openURL(item)}><Text style={[styles.ctaColor,styles.whiteColor]}>{item}</Text>></TouchableOpacity>
                      </View>
                     )}
                   </View>
                 )}
                 {(this.state.selectedMeeting.actionItems && this.state.selectedMeeting.actionItems.length > 0) && (
                   <View style={[styles.row10]}>
                     <Text style={[styles.headingText6]}><Text style={[styles.boldText]}>Action Items</Text></Text>
                     {this.state.selectedMeeting.actionItems.map((item, optionIndex) =>
                      <View key={item} style={[styles.row5]}>
                        <Text>{item}</Text>
                      </View>
                     )}
                   </View>
                 )}

                </View>
              </View>
           )}

           {(this.state.showGoalDetails || this.state.showHelpOutWidget) && (
             <View>
               <SubGoalDetails navigation={this.props.navigation} selectedGoal={this.state.selectedGoal} modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} showGoalDetails={this.state.showGoalDetails} showHelpOutWidget={this.state.showHelpOutWidget} profileData={this.state.profileData}/>
            </View>
           )}

           {(this.state.showAllMeetings) && (
             <View>
                <View style={[styles.row10]}>
                  <Text style={[styles.headingText2]}>Meetings</Text>
                </View>

               {this.renderMeetings(true)}
            </View>
           )}

         </Modal>
        </ScrollView>
    )
  }

}

export default GroupDetails;
