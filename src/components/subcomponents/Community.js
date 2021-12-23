import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont()

// import CircularProgressBar from 'react-circular-progressbar';
// import Modal from 'react-modal';

const profileIconDark = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png' }
const projectsIconDark = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-dark.png' }
const industryIconDark = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/indusry-icon-dark.png'}
const socialIconDark = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-dark.png'}
const socialIconGrey = { uri:'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-grey.png' }
const favoriteIconSelected = { uri:'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorite-icon-selected.png' }
const defaultProfileBackgroundImage = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/default-profile-background-image.png'}
const favoritesIconDark = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-dark.png'}
const arrowIndicatorIcon = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png'}
const rightCarrotBlue = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/right-carrot-blue.png'}

const upvoteIconBlue = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-blue.png'}
const upvoteIconGrey = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-grey.png'}
const checkmarkIcon = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png'}
const timeIconBlue = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-blue.png'}
const addPeopleIconDark = { uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-people-icon-dark.png'}

import SubInviteMembers from '../common/InviteMembers';
import SubEditGroup from '../common/EditGroup';

class Community extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showAccountabiliyGroupCTA: true,
      favoriteIds: [],
      friends: [],
      projectFollows: [],
      employerFollows: [],
      groupsJoined: []
    }

    this.retrieveData = this.retrieveData.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  retrieveData = async() => {
    try {

      console.log('are is this causing the error?')
      //testing badges

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

        const self = this
        const resLimit = 6

        if (activeOrg && !orgName) {
          Axios.get('/api/org', { params: { orgCode: activeOrg } })
          .then((response) => {
            console.log('Org info query attempted', response.data);

              if (response.data.success) {
                console.log('org info query worked')

                const orgName = response.data.orgInfo.orgName
                this.setState({ orgName });

              } else {
                console.log('org info query did not work', response.data.message)
              }

          }).catch((error) => {
              console.log('Org info query did not work for some reason', error);
          });
        }

        Axios.get('/api/users/profile/details/' + emailId, { params: { emailId } })
         .then((response) => {
           console.log('query for profile data worked');

           if (response.data.success) {

             console.log('profile data received', response.data)
             const pictureURL = response.data.user.pictureURL
             const headline = response.data.user.headline
             this.setState({ pictureURL, headline })

           } else {
             console.log('error response', response.data)
           }

        }).catch((error) => {
             console.log('query for profile info did not work', error);
        })

        function pullSuggestedPeople(friendIds) {
          console.log('pullSuggestedPeople called')

          const roleNames = ['Student','Career-Seeker']

          Axios.get('/api/suggested-people', { params: { orgCode: activeOrg, emailId, resLimit, roleNames, friendIds } })
          .then((response) => {
            console.log('Suggested people query attempted', response.data);

              if (response.data.success) {
                console.log('suggested people query worked')

                const suggestedPeople = response.data.users
                self.setState({ suggestedPeople })

              } else {
                console.log('suggested people query did not work', response.data.message)
              }

          }).catch((error) => {
              console.log('Suggested people query did not work for some reason', error);
          })
        }

        function pullGroupNotifications(showInvitations) {
          console.log('pullGroupNotifications called', showInvitations)

          Axios.get('/api/groups/notifications', { params: { orgCode: activeOrg, emailId } })
          .then((response) => {
            console.log('Group notifications query attempted', response.data);

              if (response.data.success && response.data.groupsWithNotifications && response.data.groupsWithNotifications.length > 0) {
                console.log('group notifications query worked')

                let groupRequests = []
                let groupInvites = []

                let unreadGroups = []
                for (let i = 1; i <= response.data.groupsWithNotifications.length; i++) {

                  let tempRequests = response.data.groupsWithNotifications[i - 1].requests
                  let admins = response.data.groupsWithNotifications[i - 1].admins
                  if (tempRequests && tempRequests.length > 0 && admins && admins[0].email === emailId) {

                    let hasUnreadRequests = false
                    for (let j = 1; j <= tempRequests.length; j++) {

                      if (!tempRequests[j - 1].status) {

                        let request = tempRequests[j - 1]
                        request['groupId'] = response.data.groupsWithNotifications[i - 1]._id
                        request['groupName'] = response.data.groupsWithNotifications[i - 1].name
                        request['name'] = response.data.groupsWithNotifications[i - 1].name
                        request['category'] = response.data.groupsWithNotifications[i - 1].category
                        // request['pictureURL'] = response.data.groupsWithNotifications[i - 1].pictureURL
                        request['admins'] = response.data.groupsWithNotifications[i - 1].admins
                        request['upvotes'] = response.data.groupsWithNotifications[i - 1].upvotes
                        request['members'] = response.data.groupsWithNotifications[i - 1].members
                        groupRequests.push(request)
                        showInvitations = true
                      }
                      if (!tempRequests[j - 1].read) {

                        hasUnreadRequests = true
                      }
                    }
                    if (hasUnreadRequests) {

                      // dont add duplicate unread groups
                      if (unreadGroups.length > 0) {
                        let alreadyIncluded = false
                        for (let j = 1; j <= unreadGroups.length; j++) {
                          if (unreadGroups[j - 1]._id === response.data.groupsWithNotifications[i - 1]._id) {
                            alreadyIncluded = true
                          }
                        }
                        if (!alreadyIncluded) {
                          unreadGroups.push(response.data.groupsWithNotifications[i - 1])
                        }
                      } else {
                        unreadGroups.push(response.data.groupsWithNotifications[i - 1])
                      }
                    }
                  }

                  let tempInvites = response.data.groupsWithNotifications[i - 1].invites
                  if (tempInvites && tempInvites.length > 0) {
                    let hasUnreadInvites = false
                    for (let j = 1; j <= tempInvites.length; j++) {
                      if (tempInvites[j - 1].email === emailId) {
                        if (!tempInvites[j - 1].status) {
                          let invite = tempInvites[j - 1]
                          invite['groupId'] = response.data.groupsWithNotifications[i - 1]._id
                          invite['groupName'] = response.data.groupsWithNotifications[i - 1].name
                          invite['name'] = response.data.groupsWithNotifications[i - 1].name
                          invite['category'] = response.data.groupsWithNotifications[i - 1].category
                          invite['pictureURL'] = response.data.groupsWithNotifications[i - 1].pictureURL
                          invite['admins'] = response.data.groupsWithNotifications[i - 1].admins
                          invite['upvotes'] = response.data.groupsWithNotifications[i - 1].upvotes
                          invite['members'] = response.data.groupsWithNotifications[i - 1].members
                          groupInvites.push(invite)
                          showInvitations = true
                        }

                        if (!tempInvites[j - 1].read) {
                          hasUnreadInvites = true
                        }
                      }
                    }
                    if (hasUnreadInvites) {
                      // dont add duplicate unread groups
                      if (unreadGroups.length > 0) {
                        let alreadyIncluded = false
                        for (let j = 1; j <= unreadGroups.length; j++) {
                          if (unreadGroups[j - 1]._id === response.data.groupsWithNotifications[i - 1]._id) {
                            alreadyIncluded = true
                          }
                        }
                        if (!alreadyIncluded) {
                          unreadGroups.push(response.data.groupsWithNotifications[i - 1])
                        }
                      } else {
                        unreadGroups.push(response.data.groupsWithNotifications[i - 1])
                      }
                    }
                  }
                }
                // console.log('t6', groupInvites)
                self.setState({ groupRequests, groupInvites, showInvitations })

                if (unreadGroups && unreadGroups.length > 0) {
                  // change read to true
                  Axios.put('/api/groups/notifications/update', { emailId, unreadGroups })
                  .then((response) => {
                    console.log('Group notifications update attempted', response.data);

                      if (response.data.success) {
                        console.log('friends update notification worked')

                      } else {
                        console.log('friends update notification did not work', response.data.message)
                      }

                  }).catch((error) => {
                      console.log('Groups update notification did not work for some reason', error);
                  })
                }

              } else {
                console.log('unread notifications query did not work', response.data.message)

              }

          }).catch((error) => {
              console.log('Unread requests query did not work for some reason', error);
          })
        }

        Axios.get('/api/friends', { params: { orgCode: activeOrg, emailId } })
        .then((response) => {
          console.log('Friends query attempted', response.data);

            if (response.data.success) {
              console.log('friends query worked')

              const friends = []
              let friendIds = []
              let friendRequests = []
              let showInvitations = this.state.showInvitations
              let unreadRequests = []
              if (response.data.friends) {
                for (let i = 1; i <= response.data.friends.length; i++) {

                  let friendshipId = response.data.friends[i - 1]._id
                  let pictureURL = ''
                  let firstName = ''
                  let lastName = ''
                  let email = ''
                  let username = ''
                  let headline = ''
                  let active = response.data.friends[i - 1].active
                  let activeRequest = response.data.friends[i - 1].activeRequest
                  console.log('looping through friends: ', response.data.friends[i - 1].friend1Email, emailId)
                  if (response.data.friends[i - 1].friend1Email === emailId) {
                    pictureURL = response.data.friends[i - 1].friend2PictureURL
                    firstName = response.data.friends[i - 1].friend2FirstName
                    lastName = response.data.friends[i - 1].friend2LastName
                    email = response.data.friends[i - 1].friend2Email
                    username = response.data.friends[i - 1].friend2Username
                    headline = response.data.friends[i - 1].friend2Headline
                  } else {
                    pictureURL = response.data.friends[i - 1].friend1PictureURL
                    firstName = response.data.friends[i - 1].friend1FirstName
                    lastName = response.data.friends[i - 1].friend1LastName
                    email = response.data.friends[i - 1].friend1Email
                    username = response.data.friends[i - 1].friend1Username
                    headline = response.data.friends[i - 1].friend1Headline
                  }

                  if (response.data.friends[i - 1].activeRequest && response.data.friends[i - 1].requesterEmail !== emailId) {

                    friendRequests.push({ friendshipId, pictureURL, firstName, lastName, email, username, headline, active, activeRequest })
                    showInvitations = true

                    if (response.data.friends[i - 1].isRead === false) {
                      unreadRequests.push(response.data.friends[i - 1])
                    }

                    friendIds.push(response.data.friends[i - 1]._id)
                  } else if (response.data.friends[i - 1].active) {
                    friends.push({ friendshipId, pictureURL, firstName, lastName, email, username, headline, active, activeRequest })
                  }
                }
              }
              console.log('show them friendRequests: ', friendRequests, showInvitations)

              this.setState({ friends, friendRequests, showInvitations })

              if (unreadRequests.length > 0) {

                Axios.put('/api/friends/update', { emailId, readRequests: true })
                .then((response) => {
                  console.log('Friends update requests attempted', response.data);

                    if (response.data.success) {
                      console.log('friends update request worked')

                    } else {
                      console.log('friends update request did not work', response.data.message)
                    }

                }).catch((error) => {
                    console.log('Friends update request did not work for some reason', error);
                })
              }

              pullSuggestedPeople(friendIds)
              pullGroupNotifications(showInvitations)

            } else {
              console.log('friends query did not work', response.data.message)
              pullSuggestedPeople(null)
              pullGroupNotifications(false)
            }

        }).catch((error) => {
            console.log('Friends query did not work for some reason', error);
        })

        function pullOtherItems(favoriteIds) {
          console.log('pullOtherItems called')

          Axios.get('/api/projects', { params: { orgCode: activeOrg, resLimit, favoriteIds } })
          .then((response) => {
            console.log('Projects query attempted', response.data);

              if (response.data.success) {
                console.log('successfully retrieved projects')

                if (response.data.projects) {

                  const projects = response.data.projects
                  self.setState({ projects })
                }

              } else {
                console.log('no project data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Project query did not work', error);
          });

          Axios.get('/api/account/partners', { params: { org: activeOrg, resLimit, favoriteIds } })
          .then((response) => {
            console.log('Posted employer query attempted', response.data);

            if (response.data.success) {
              console.log('posted employer query worked')

              if (response.data.employers.length !== 0) {
                const employers = response.data.employers
                self.setState({ employers });
              }

            } else {
              console.log('query for employers query did not work', response.data.message)
            }

          }).catch((error) => {
              console.log('Employer query did not work for some reason', error);
          });
        }
        console.log('show emailId: ', emailId)
        Axios.get('/api/favorites', { params: { emailId } })
        .then((response) => {
          console.log('Favorites query attempted', response.data);

            if (response.data.success) {
              console.log('successfully retrieved favorites', response.data.favorites.length)

              if (response.data.favorites.length > 0) {
                console.log('the array is greater than 0', response.data.favorites.length)

                const orgCode = activeOrg
                const favoriteIds = response.data.favorites

                //query info on those favorites
                Axios.get('/api/favorites/detail', { params: { favorites: response.data.favorites, orgCode, orgFocus } })
                .then((response2) => {
                  console.log('Favorites detail query attempted', response2.data);

                  if (response2.data.success) {
                    console.log('successfully retrieved favorites detail', response2.data.favorites)

                    let types = response2.data.types
                    let favorites = response2.data.favorites
                    let projectFollows = []
                    let employerFollows = []

                    for (let i = 1; i <= types.length; i++) {
                      if (types[i - 1] === 'project') {
                        projectFollows.push(favorites[i - 1])
                      } else if (types[i - 1] === 'employer') {
                        employerFollows.push(favorites[i - 1])
                      }
                    }

                    //query info on those favorites
                    this.setState({
                      types, favorites,
                      favoriteIds, projectFollows, employerFollows
                    })

                    pullOtherItems(favoriteIds)

                  } else {
                    console.log('no favorites detail data found', response2.data.message)
                    pullOtherItems(favoriteIds)
                  }

                }).catch((error) => {
                    console.log('Favorites detail query did not work', error);
                    pullOtherItems(favoriteIds)
                });
              } else {
                pullOtherItems(null)
              }

            } else {
              console.log('no favorites data found', response.data.message)
              pullOtherItems(null)
            }

        }).catch((error) => {
            console.log('Favorites query did not work', error);
            pullOtherItems(null)
        });

        Axios.get('/api/groups', { params: { orgCode: activeOrg, resLimit: 9 }})
        .then((response) => {
          console.log('Groups query worked', response.data);

          if (response.data.success) {

            let groups = response.data.groups
            this.setState({ groups })

            // my groups
            Axios.get('/api/groups', { params: { orgCode: activeOrg, emailId, type: 'myGroups' }})
            .then((response) => {
              console.log('My groups query worked', response.data);

              if (response.data.success) {

                let groupsJoined = response.data.groups
                let noAccountabilityGroups = true
                if (groupsJoined) {
                  for (let i = 1; i <= groupsJoined.length; i++) {
                    if (groupsJoined[i - 1].category === 'Accountability') {
                      noAccountabilityGroups = false
                    }
                  }
                }
                this.setState({ groupsJoined, noAccountabilityGroups })

              } else {
                console.log('no my groups data found', response.data.message)
                this.setState({ noAccountabilityGroups: true })
              }

            }).catch((error) => {
                console.log('My groups query did not work', error);
            });

          } else {
            console.log('no groups data found', response.data.message)
            this.setState({ noAccountabilityGroups: true })
          }

        }).catch((error) => {
            console.log('Groups query did not work', error);
        });


      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  favoriteItem(e, item, entity) {
    console.log('favoriteItem called', e, item, entity)

    e.preventDefault()
    e.stopPropagation()

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    let itemId = item._id

    let favoritesArray = this.state.favoriteIds

    if (favoritesArray.includes(itemId)){
      let index = favoritesArray.indexOf(itemId)
      if (index > -1) {
        favoritesArray.splice(index, 1);
      }
    } else {
      // console.log('adding item: ', favoritesArray, itemId)
      favoritesArray.push(itemId)
    }

    console.log('favorites', favoritesArray)
    this.setState({ favoriteIds: favoritesArray })

    Axios.post('/api/favorites/save', {
      favoritesArray, emailId: this.state.emailId
    })
    .then((response) => {
      console.log('attempting to save favorites')
      if (response.data.success) {
        console.log('saved successfully', response.data)

        if (entity === 'employers') {
          let employerFollows = this.state.employerFollows
          employerFollows.push(item)
          this.setState({ successMessage: 'Favorite saved!', employerFollows, isSaving: false })
        } else if (entity === 'projects') {
          let projectFollows = this.state.projectFollows
          projectFollows.push(item)
          this.setState({ successMessage: 'Favorite saved!', projectFollows, isSaving: false })

        } else {
          this.setState({ successMessage: 'Favorite saved!', isSaving: false })
        }

      } else {
        console.log('did not save successfully')
        this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false })
    });
  }

  followPerson(e,person, index) {
    console.log('followPerson called', e, person, index)

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

    Axios.post('/api/friend/request', friend)
    .then((response) => {

      if (response.data.success) {

        friend['active'] = false
        friend['friend2Email'] = recipientEmail

        let friends = this.state.friends
        friends.push(friend)

        let suggestedPeople = this.state.suggestedPeople
        suggestedPeople[index]['activeRequest'] = true
        console.log('show friends: ', friends)
        this.setState({ successMessage: response.data.message, friends, suggestedPeople })

      } else {

        this.setState({ errorMessage: response.data.message })
      }
    }).catch((error) => {
        console.log('Advisee request send did not work', error);
    });
  }

  joinGroup(e, group, index, joinGroup) {
    console.log('joinGroup called', e, group, index, joinGroup)

    e.preventDefault()
    e.stopPropagation()

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    let groupId = group._id
    const member = {
      firstName: this.state.cuFirstName, lastName: this.state.cuLastName,
      email: this.state.emailId, roleName: this.state.roleName, pictureURL: this.state.pictureURL
    }
    const accessType = group.accessType

    Axios.post('/api/groups/save', { groupId, member, accessType, joinGroup })
    .then((response) => {
      console.log('attempting to save addition to groups')
      if (response.data.success) {
        console.log('saved addition to groups', response.data)

        let groups = this.state.groups
        groups[index] = response.data.group

        let groupsJoined = this.state.groupsJoined
        groupsJoined.push(response.data.group)

        this.setState({ successMessage: 'Saved as a group!', groups, groupsJoined, isSaving: false })

      } else {
        console.log('did not save successfully')
        this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ errorMessage: 'there was an error saving groups', isSaving: false})
    });
  }

  viewGroup(group) {
    console.log('viewGroup called', group)

    let groupDetailsPath = '/app/groups/' + group._id
    this.props.history.push({ pathname: groupDetailsPath, state: { selectedGroup: group }})

  }

  decideOnRequest(index, decision, type) {
    console.log('decideOnRequest called', index, decision, type)

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    if (type === 'connection') {
      let friendRequests = this.state.friendRequests
      const senderFirstName = this.state.cuFirstName
      const senderLastName = this.state.cuLastName
      const senderEmail = this.state.emailId

      Axios.put('/api/friends/update', { decidedOnRequest: true, decision, request: friendRequests[index], senderFirstName, senderLastName, senderEmail })
      .then((response) => {
        console.log('Friends update requests attempted', response.data);

          if (response.data.success) {
            console.log('friends update request worked')

            let friends = this.state.friends
            if (decision) {
              friends.push(friendRequests[index])
            }

            friendRequests.splice(index,1)

            this.setState({ friends, friendRequests, isSaving: false })

          } else {
            console.log('friends update request did not work', response.data.message)
            this.setState({ isSaving: false, errorMessage: response.data.message })
          }

      }).catch((error) => {
          console.log('Friends update request did not work for some reason', error);
      })
    } else if (type === 'groupRequest') {
      let groupRequests = this.state.groupRequests
      const _id = groupRequests[index].groupId
      const senderFirstName = this.state.cuFirstName
      const senderLastName = this.state.cuLastName
      const senderEmail = this.state.emailId

      Axios.put('/api/groups/notifications/update', { decidedOnRequest: true, decision, request: groupRequests[index], senderFirstName, senderLastName, senderEmail, _id, type: 'request' })
      .then((response) => {
        console.log('Groups update notifications attempted', response.data);

          if (response.data.success) {
            console.log('group update notification worked')

            // let groupsJoined = this.state.groupsJoined
            // if (decision) {
            //   groupsJoined.push(groupRequests[index])
            // }

            groupRequests.splice(index,1)

            this.setState({ groupRequests, isSaving: false })

          } else {
            console.log('group notifications update request did not work', response.data.message)
            this.setState({ isSaving: false, errorMessage: response.data.message })
          }

      }).catch((error) => {
          console.log('Group notifications did not work for some reason', error);
      })
    } else if (type === 'groupInvite') {
      let groupInvites = this.state.groupInvites
      const _id = groupInvites[index].groupId
      const senderFirstName = this.state.cuFirstName
      const senderLastName = this.state.cuLastName
      const senderEmail = this.state.emailId

      Axios.put('/api/groups/notifications/update', { decidedOnRequest: true, decision, request: groupInvites[index], senderFirstName, senderLastName, senderEmail, _id, type: 'invite' })
      .then((response) => {
        console.log('Groups update notifications attempted', response.data);

          if (response.data.success) {
            console.log('group update notification worked')

            let groupsJoined = this.state.groupsJoined
            if (decision) {
              let groupToJoin = groupInvites[index]
              groupToJoin['members'].push({ firstName: this.state.cuFirstName, lastName: this.state.cuLastName,
                email: this.state.email, username: this.state.username, pictureURL: this.state.pictureURL,
                roleName: this.state.roleName
              })
              groupToJoin['_id'] = groupToJoin.groupId
              groupsJoined.push(groupToJoin)
            }

            groupInvites.splice(index,1)

            this.setState({ groupInvites, isSaving: false })

          } else {
            console.log('group notifications update request did not work', response.data.message)
            this.setState({ isSaving: false, errorMessage: response.data.message })
          }

      }).catch((error) => {
          console.log('Group notifications did not work for some reason', error);
      })
    }
  }

  closeModal() {
    console.log('closeModal in projects: ')

    this.setState({ modalIsOpen: false, showPeopleYouFollow: false, showProjectsYouFollow: false, showEmployersYouFollow: false,
      showGroupsYouJoined: false, showInviteMembersWidget: false, showEditGroup: false
    });
  }

  renderItems(entity,type) {
    console.log('renderItems called')

    if (entity === 'people') {

      let items = this.state.suggestedPeople
      if (type === 'existing') {
        items = this.state.friends
      }

      return (
        <View key={entity}>
          {(items && items.length > 0) && (
            <View>
              {items.map((item, optionIndex) =>
                <View key={item + optionIndex}>
                  <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: item.username, matchScore: item.matchScore })} style={styles.fullScreenWidth}>
                      <View style={[styles.card,styles.fullScreenWidth,styles.centerHorizontally]}>
                        <View style={styles.rowDirection}>
                          <View style={styles.flex15}>
                            {(item.matchScore) && (
                              <View style={[styles.square30,styles.contain]}>
                                {/*
                                <CircularProgressBar
                                  percentage={item.matchScore}
                                  text={`${item.matchScore}%`}
                                  styles={{
                                    path: { stroke: `rgba(110, 190, 250, ${item.matchScore / 100})` },
                                    text: { fill: '#6EBEFA', fontSize: '26px' },
                                    trail: { stroke: 'transparent' }
                                  }}
                                />*/}
                              </View>
                            )}
                          </View>
                          <View style={styles.flex70}>
                            {(item.pictureURL) ? (
                              <Image source={item.pictureURL} style={[styles.profileThumbnail80,styles.centerItem]} />
                            ) : (
                              <Image source={profileIconDark} style={[styles.square60,styles.contain,styles.centerItem]} />
                            )}
                          </View>
                          <View style={styles.flex15}>

                          </View>
                        </View>

                        <Text style={[styles.fullScreenWidth,styles.centerText,styles.headingText6,styles.topPadding]}>{item.firstName} {item.lastName}</Text>
                        {(item.school) && (
                          <Text style={[styles.fullScreenWidth,styles.centerText,styles.descriptionText3,styles.topPadding]}>{item.school}{item.gradYear && " '" + item.gradYear}</Text>
                        )}
                        {(item.major) && (
                          <Text style={[styles.fullScreenWidth,styles.centerText,styles.descriptionText3,styles.topPadding5]}>{item.major}</Text>
                        )}

                        <View style={[styles.topPadding20]}>
                          <View className="display-inline full-width">
                            {(item.active || item.activeRequest) ? (
                              <View>
                                {(item.active) ? (
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages', { recipient: item })} className="background-button full-width">
                                    <TouchableOpacity className="btn btn-profile description-text-3 full-width left-margin-5">
                                      Message
                                    </TouchableOpacity>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity className="btn btn-squarish full-width medium-background clear-border no-pointers" disabled={true}>Pending</TouchableOpacity>
                                )}
                              </View>
                            ) : (
                              <TouchableOpacity className="btn btn-squarish full-width" disabled={(this.state.isSaving) ? true : false} onPress={(e) => this.followPerson(e,item,optionIndex)}>Connect</TouchableOpacity>
                            )}
                          </View>
                        </View>
                        <View style={styles.spacer} />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.spacer} />
                </View>
              )}

            </View>
          )}
        </View>
      )
    } else if (entity === 'projects') {

      let items = this.state.projects
      if (type === 'existing') {
        items = this.state.projectFollows
      }

      return (
        <View key={entity}>
          {(items && items.length > 0) && (
            <View>
              {items.map((item, optionIndex) =>
                <View key={item + optionIndex}>
                  <View>
                    <TouchableOpacity style={styles.fullScreenWidth} onPress={() => this.props.navigation.navigate('ProjectDetails', { _id: item._id })}>
                      <View className="elevated-box white-background" >
                        <View className="full-width relative-position tint">
                          <Image source={(item.imageURL) ? item.imageURL : defaultProfileBackgroundImage} className="image-full-width-150 center-horizontally"  />
                          <View className="absolute-position absolute-top-5 absolute-left-5">
                            {(item.matchScore) && (
                              <View style={[styles.square40,styles.contain]}>
                                {/*
                                <CircularProgressBar
                                  percentage={item.matchScore}
                                  text={`${item.matchScore}%`}
                                  styles={{
                                    path: { stroke: `rgba(255, 255, 255, ${item.matchScore / 100})` },
                                    text: { fill: 'white', fontSize: '26px' },
                                    trail: { stroke: 'transparent' }
                                  }}
                                />*/}
                              </View>
                            )}
                            <Text className="description-text-5 rounded-corners horizontal-padding-4 row-5 white-border white-text bold-text">{item.category}</Text>
                          </View>
                        </View>

                        <View style={styles.spacer} />

                        <View style={[styles.horizontalPadding30]}>
                          <Text style={[styles.headingText5]}>{item.name}</Text>

                          <View style={[styles.topPadding20]}>
                            <View className="fixed-column-35">
                              <Image style={[styles.profileThumbnail25]} source={(item.userPic) ? item.userPic : profileIconDark} />
                            </View>
                            <View className="calc-column-offset-35 description-text-2">
                              <Text style={[styles.headingText6]}>{item.userFirstName} {item.userLastName}</Text>
                              <label style={[styles.descriptionText2]}>{item.hours} Hours</label>
                            </View>

                          </View>

                          {(item.collaborators && item.collaborators.length > 0) && (
                            <View style={styles.topPadding}>
                              <label style={[styles.descriptionText5,styles.leftPadding5]}>|</label>
                              <label style={[styles.descriptionText5,styles.leftPadding5]}>{item.collaborators.length} Collaborators</label>
                            </View>
                          )}

                          <Text className="description-text-3 full-width left-text top-margin">{(item.startDate) && item.startDate + " - "}{(item.isContinual) ? "Present" : item.endDate}</Text>

                          {(item.skillTags) && (
                            <View>
                              <View style={styles.topPadding}>
                                {item.skillTags.split(',').map((value, optionIndex) =>
                                  <View key={value}>
                                    {(optionIndex < 3) && (
                                      <View key={value} className="float-left row-5 right-padding">
                                        <View className="tag-container-7">
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
                            <View className="display-inline full-width">
                              <TouchableOpacity className={this.state.favoriteIds.includes(item._id) ? "btn btn-profile medium-background clear-border full-width" : "btn btn-profile full-width"} disabled={(this.state.isSaving) ? true : false} onPress={(e) =>  this.favoriteItem(e, item, entity)}>{this.state.favoriteIds.includes(item._id) ? "Following" : "Follow"}</TouchableOpacity>
                            </View>
                          </View>

                          <View style={styles.spacer} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.spacer} />

                </View>
              )}
            </View>
          )}
        </View>
      )
    } else if (entity === 'employers') {

      let items = this.state.employers
      if (type === 'existing') {
        items = this.state.employerFollows
      }

      return (
        <View key={entity}>
          {(items && items.length > 0) && (
            <View>
              {items.map((item, optionIndex) =>
                <View key={item + optionIndex}>
                  <View className="top-padding-20 bottom-padding-30">
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('EmployerDetails', { _id: item._id, selectedEmployer: item, employers: items })}>
                      <View className="fixed-column-70">
                        <Image source={(item.employerLogoURI) ? item.employerLogoURI : industryIconDark} className="image-50-auto"/>
                      </View>
                      <View className={"calc-column-offset-130"}>
                        <Text style={[styles.headingText5]}>{item.employerName}</Text>
                        <Text className="description-text-2 description-text-color top-padding-5">{item.employerIndustry}</Text>
                      </View>
                      <View className="fixed-column-30 top-margin">
                        <TouchableOpacity disabled={(this.state.isSaving) ? true : false} onPress={(e) => this.favoriteItem(e, item, entity)}>
                          <Image source={(this.state.favoriteIds.includes(item._id)) ? favoriteIconSelected : favoritesIconDark} className="image-auto-20 pin-right"/>
                        </TouchableOpacity>
                      </View>
                      <View className="fixed-column-30 top-margin">
                        <Image source={arrowIndicatorIcon} className="image-auto-20 pin-right"/>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.horizontalLine} />
                </View>
              )}
            </View>
          )}
        </View>
      )
    } else if (entity === 'groups') {

      let items = this.state.groups
      if (type === 'existing') {
        items = this.state.groupsJoined
      }

      return (
        <View key={entity}>
          {(items && items.length > 0) && (
            <View>
              {items.map((item, optionIndex) =>
                <View key={item + optionIndex}>
                  {((!item.members) || (item.members.length === 0) || (!item.members.some(member => member.email === this.state.emailId) || (type === 'existing'))) && (
                    <View>
                      <View className="full-width medium-background">
                        <TouchableOpacity onPress={() => this.viewGroup(item)} className="background-button full-width">
                          <View className="elevated-box white-background" >
                            <View className="full-width relative-position tint">
                              <Image source={item.pictureURL} className="image-full-width-150 center-horizontally"  />
                              <View className="absolute-position absolute-top-5 absolute-left-5">
                                {(item.matchScore) && (
                                  <View style={[styles.square40,styles.contain]}>
                                    {/*
                                    <CircularProgressBar
                                      percentage={item.matchScore}
                                      text={`${item.matchScore}%`}
                                      styles={{
                                        path: { stroke: `rgba(255, 255, 255, ${item.matchScore / 100})` },
                                        text: { fill: 'white', fontSize: '26px' },
                                        trail: { stroke: 'transparent' }
                                      }}
                                    />*/}
                                  </View>
                                )}
                                <Text className="description-text-5 rounded-corners horizontal-padding-4 row-5 white-border white-text bold-text">{item.category}</Text>
                              </View>

                              <TouchableOpacity className="background-button clear-padding display-block absolute-position absolute-top-5 absolute-right-5 white-background rounded-corners" onPress={(e) => this.voteOnItem(e, item, 'up', optionIndex) }>
                                <View className="standard-border rounded-corners">
                                  <View className="float-left padding-7">
                                    <Image source={(item.upvotes.includes(this.state.emailId)) ? upvoteIconBlue : upvoteIconGrey} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View className="vertical-separator-4" />
                                  <View className="float-left horizontal-padding-10">
                                    <View style={[styles.halfSpacer]} />
                                    <Text style={[styles.descriptionText2,styles.boldText]}>{item.upvotes.length}</Text>
                                  </View>

                                </View>
                              </TouchableOpacity>
                            </View>

                            <View style={styles.spacer} />

                            <View style={[styles.horizontalPadding30]}>
                              <Text style={[styles.headingText5]}>{item.name}</Text>
                              <Text style={[styles.descriptionText5]}>{item.memberCount} Members</Text>

                              <View style={styles.topPadding}>

                                  {(item.members && item.members.some(member => member.email === this.state.emailId)) ? (
                                    <View>
                                      <View className="float-left right-padding">
                                        <View style={styles.miniSpacer} /><View style={styles.miniSpacer} /><View style={styles.miniSpacer} />
                                        <Image source={checkmarkIcon} style={[styles.square12,styles.contain]} />
                                      </View>
                                      <View className="float-left">
                                        <Text style={[styles.descriptionText2,styles.boldText]}>Joined</Text>
                                      </View>

                                    </View>
                                  ) : (
                                    <View>

                                      {(item.accessType === 'Open') ? (
                                        <TouchableOpacity disabled={(this.state.isSaving) ? true : false} onPress={(e) => this.joinGroup(e, item, optionIndex, true)}>
                                          <Text style={[styles.descriptionText2,styles.boldText,styles.ctaColor]}>+ Join Group</Text>
                                        </TouchableOpacity>
                                      ) : (
                                        <View>
                                          {((item.requests && item.requests.some(request => request.email === this.state.emailId))) ? (
                                            <View style={[styles.centerText,styles.fullScreenWidth,styles.rightMargin5]}>
                                              <View className="float-left right-padding">
                                                <View style={styles.miniSpacer} /><View style={styles.miniSpacer} /><View style={styles.miniSpacer} />
                                                <Image source={timeIconBlue} style={[styles.square15,styles.contain]} />
                                              </View>
                                              <View className="float-left">
                                                <Text style={[styles.descriptionText2,styles.boldText]}>Requested</Text>
                                              </View>

                                            </View>
                                          ) : (
                                            <TouchableOpacity disabled={(this.state.isSaving) ? true : false} onPress={(e) => this.joinGroup(e, item, optionIndex, true)}>
                                              <Text style={[styles.descriptionText2,styles.boldText,styles.ctaColor]}>+ Request</Text>
                                            </TouchableOpacity>
                                          )}
                                        </View>
                                      )}
                                    </View>
                                  )}
                              </View>
                            </View>

                          </View>
                        </TouchableOpacity>
                      </View>

                      <View style={styles.spacer} />
                    </View>
                  )}
                </View>
              )}
            </View>
          )}
        </View>
      )

    }
  }

  render() {
    // console.log('show style: ', Style.styles)
    return (
      <ScrollView>
        <View style={[styles.topMargin20]}>
              <View style={[styles.fullScreenWidth]}>
                <View className="card-clear-padding full-width bottom-margin-20">
                  <View className="full-width height-5 primary-background" />
                  <View style={[styles.padding20]}>
                    <Text style={[styles.headingText5]}>My Community</Text>
                    <View style={styles.spacer} /><View style={[styles.halfSpacer]} />

                    <View>
                      <View style={[styles.row10,styles.descriptionText1]}>
                        <TouchableOpacity style={[styles.fullScreenWidth]} onPress={() => this.setState({ modalIsOpen: true, showPeopleYouFollow: true })}>
                          <View className="fixed-column-30">
                            <Image source={profileIconDark} style={[styles.square20,styles.contain]} />
                          </View>
                          <View className="calc-column-offset-60">
                            <Text>Your Connections</Text>
                          </View>
                          <View className="fixed-column-30 cta-color right-text">
                            <Text>{this.state.friends.length}</Text>
                          </View>

                        </TouchableOpacity>
                      </View>

                      <View style={[styles.row10,styles.descriptionText1]}>
                        <TouchableOpacity style={[styles.fullScreenWidth]} onPress={() => this.setState({ modalIsOpen: true, showProjectsYouFollow: true })}>
                          <View className="fixed-column-30">
                            <Image source={projectsIconDark} style={[styles.square20,styles.contain]} />
                          </View>
                          <View className="calc-column-offset-60">
                            <Text>Projects you follow</Text>
                          </View>
                          <View className="fixed-column-30 cta-color right-text">
                            <Text>{this.state.projectFollows.length}</Text>
                          </View>

                        </TouchableOpacity>
                      </View>

                      <View style={[styles.row10,styles.descriptionText1]}>
                        <TouchableOpacity style={[styles.fullScreenWidth]} onPress={() => this.setState({ modalIsOpen: true, showEmployersYouFollow: true })}>
                          <View className="fixed-column-30">
                            <Image source={industryIconDark} style={[styles.square20,styles.contain]} />
                          </View>
                          <View className="calc-column-offset-60">
                            <Text>Employers you follow</Text>
                          </View>
                          <View className="fixed-column-30 cta-color right-text">
                            <Text>{this.state.employerFollows.length}</Text>
                          </View>

                        </TouchableOpacity>
                      </View>

                      <View style={[styles.row10,styles.descriptionText1]}>
                        <TouchableOpacity style={[styles.fullScreenWidth]} onPress={() => this.setState({ modalIsOpen: true, showGroupsYouJoined: true })}>
                          <View className="fixed-column-30">
                            <Image source={socialIconDark} style={[styles.square20,styles.contain]} />
                          </View>
                          <View className="calc-column-offset-60">
                            <Text>Your groups</Text>
                          </View>
                          <View className="fixed-column-30 cta-color right-text">
                            <Text>{this.state.groupsJoined.length}</Text>
                          </View>

                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                </View>

                {(this.state.showAccountabiliyGroupCTA && this.state.noAccountabilityGroups) && (
                  <View>
                    <View className="card-clear-padding full-width bottom-margin-20">
                      <View className="full-width height-5 error-background-color" />
                      <View style={[styles.padding30]}>
                        <View style={[styles.fullScreenWidth]}>
                          <View className="relative-column-10">
                            <View className="width-30 height-40" />
                          </View>
                          <View className="relative-column-80">
                            <Image source={socialIconGrey} className="image-auto-100 center-horizontally" />
                          </View>
                          <View className="relative-column-10">
                            <Text style={[styles.errorColor,styles.descriptionText3]}>NEW</Text>
                          </View>

                        </View>
                        <Text style={[styles.headingText5,styles.fullScreenWidth,styles.centerText,styles.topPadding20]}>Create an Accountability Group</Text>

                        <Text style={[styles.fullScreenWidth,styles.centerText,styles.topPadding20]}>Accountability groups are 4-6 peers that meet regularly to help one another reach their goals.</Text>

                        <View style={[styles.row10,styles.centerText]}>
                          <TouchableOpacity className="btn btn-squarish error-background-color full-width top-margin-20 error-border" onPress={() => this.setState({ modalIsOpen: true, showEditGroup: true, groupToEdit: null })}>
                            <Text>Create new group</Text>
                          </TouchableOpacity>
                        </View>

                      </View>
                    </View>
                  </View>
                )}
              </View>

              <View style={[styles.fullScreenWidth]}>

                {(this.state.showInvitations) && (
                  <View style={[styles.cardClearPadding,styles.padding20,styles.bottomMargin20]}>
                    <Text style={[styles.headingText5]}>Requests & Invitations</Text>

                    <View style={styles.spacer} /><View style={styles.spacer} />

                    {(this.state.friendRequests && this.state.friendRequests.length > 0) && (
                      <View>
                        {this.state.friendRequests.map((value2, optionIndex) =>
                          <View key={value2 + optionIndex}>
                            <View style={[styles.row10]}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value2.username })} className="background-button standard-color calc-column-offset-150 top-padding-5">
                                <View className="fixed-column-40">
                                  <Image source={(value2.pictureURL) ? value2.pictureURL : profileIconDark} className="image-auto-30" />
                                </View>
                                <View className="calc-column-offset-40 left-padding">
                                  <Text style={[styles.headingText5]}>{value2.firstName} {value2.lastName}</Text>
                                  <Text style={[styles.descriptionText2,styles.topPadding5]}>{value2.firstName} wants to connect with you</Text>
                                </View>

                              </TouchableOpacity>

                              <View className="fixed-column-150">
                                <View className="float-left">
                                  <TouchableOpacity style={styles.topPadding5} onPress={() => this.decideOnRequest(optionIndex, false,'connection')}>
                                    <Text style={styles.descriptionTextColor}>Ignore</Text>
                                  </TouchableOpacity>
                                </View>
                                <View className="float-left left-padding">
                                  <TouchableOpacity className="btn btn-small" onPress={() => this.decideOnRequest(optionIndex, true,'connection')}>Accept</TouchableOpacity>
                                </View>

                              </View>

                            </View>
                          </View>
                        )}
                      </View>
                    )}

                    {(this.state.groupRequests && this.state.groupRequests.length > 0) && (
                      <View>
                        {this.state.groupRequests.map((value2, optionIndex) =>
                          <View key={value2 + optionIndex}>
                            <View style={[styles.row10]}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('GroupDetails', { _id: value2._id })} className="background-button standard-color calc-column-offset-150 top-padding-5">
                                <View className="fixed-column-40">
                                  <Image source={(value2.pictureURL) ? value2.pictureURL : profileIconDark} style={[styles.square30,styles.contain]} />
                                </View>
                                <View className="calc-column-offset-40 left-padding">
                                  <Text style={[styles.headingText5]}>{value2.firstName} {value2.lastName}</Text>
                                  <Text style={[styles.descriptionText2,styles.topPadding5]}>{value2.firstName} wants to join {value2.groupName}</Text>
                                </View>

                              </TouchableOpacity>

                              <View className="fixed-column-150">
                                <View className="float-left">
                                  <TouchableOpacity style={styles.topPadding5} onPress={() => this.decideOnRequest(optionIndex, false,'groupRequest')}>
                                    <Text style={styles.descriptionTextColor}>Ignore</Text>
                                  </TouchableOpacity>
                                </View>
                                <View className="float-left left-padding">
                                  <TouchableOpacity className="btn btn-small" onPress={() => this.decideOnRequest(optionIndex, true,'groupRequest')}>Accept</TouchableOpacity>
                                </View>

                              </View>

                            </View>
                          </View>
                        )}

                      </View>
                    )}

                    {(this.state.groupInvites && this.state.groupInvites.length > 0) && (
                      <View>
                        {this.state.groupInvites.map((value2, optionIndex) =>
                          <View key={value2 + optionIndex}>
                            <View style={[styles.row10]}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('GroupDetails', { _id: value2._id })} className="background-button standard-color calc-column-offset-150 top-padding-5">
                                <View className="fixed-column-40">
                                  <Image source={(value2.pictureURL) ? value2.pictureURL : profileIconDark} style={[styles.square30,styles.contain]} />
                                </View>
                                <View className="calc-column-offset-40 left-padding">
                                  <Text style={[styles.headingText5]}>{value2.groupName}</Text>
                                  <Text style={[styles.descriptionText2,styles.topPadding5]}>{value2.firstName} {value2.lastName} invited you to join their accountability group: {value2.groupName}</Text>
                                </View>

                              </TouchableOpacity>

                              <View className="fixed-column-150">
                                <View className="float-left">
                                  <TouchableOpacity style={styles.topPadding5} onPress={() => this.decideOnRequest(optionIndex, false,'groupInvite')}>
                                    <Text style={styles.descriptionTextColor}>Ignore</Text>
                                  </TouchableOpacity>
                                </View>
                                <View className="float-left left-padding">
                                  <TouchableOpacity className="btn btn-small" onPress={() => this.decideOnRequest(optionIndex, true,'groupInvite')}>Accept</TouchableOpacity>
                                </View>

                              </View>

                            </View>
                          </View>
                        )}

                      </View>
                    )}

                    {(this.state.errorMessage && this.state.errorMessage !== '') && <Text className="error-color row-5">{this.state.errorMessage}</Text>}
                    {(this.state.successMessage && this.state.successMessage !== '') && <Text className="cta-color row-5">{this.state.successMessage}</Text>}

                  </View>
                )}

                <View style={[styles.cardClearPadding,styles.padding20,styles.bottomMargin20]}>
                  <View>
                    <View className="calc-column-offset-40">
                      <Text style={[styles.headingText5]}>Recommended People to Follow</Text>
                      <View style={styles.spacer} />
                    </View>
                    {(!this.state.remoteAuth) && (
                      <View className="fixed-column-40">
                        <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showInviteMembersWidget: true })}>
                          <Image source={addPeopleIconDark} style={[styles.square25,styles.pinRight]}/>
                        </TouchableOpacity>
                      </View>
                    )}

                  </View>

                  <View style={styles.spacer} /><View style={styles.spacer} />

                  {this.renderItems('people','recommended')}

                  <View style={[styles.row10]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Profiles')} style={[styles.fullScreenWidth,styles.rightText,styles.headingText5]}>
                      <View className="float-right top-margin-5">
                        <View style={styles.miniSpacer} />
                        <Image source={rightCarrotBlue} style={[styles.square15,styles.contain]} />
                      </View>
                      <View className="float-right right-padding">
                        <Text>Browse All Profiles</Text>
                      </View>

                    </TouchableOpacity>
                  </View>

                </View>

                <View style={[styles.cardClearPadding,styles.padding20,styles.bottomMargin20]}>
                  <Text style={[styles.headingText5]}>Recommended Projects to Follow</Text>

                  <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />

                  {this.renderItems('projects','recommended')}

                  <View style={[styles.row10]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Projects')} style={[styles.fullScreenWidth,styles.rightText,styles.headingText5]}>
                      <View className="float-right top-margin-5">
                        <View style={styles.miniSpacer} />
                        <Image source={rightCarrotBlue} style={[styles.square15,styles.contain]} />
                      </View>
                      <View className="float-right right-padding">
                        <Text>Browse All Projects</Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.cardClearPadding,styles.padding20,styles.bottomMargin20]}>
                  <Text style={[styles.headingText5]}>Recommended Groups to Join</Text>

                  <View style={styles.spacer} /><View style={styles.spacer} />

                  {this.renderItems('groups','recommended')}

                  <View style={[styles.row10]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Groups')} style={[styles.fullScreenWidth,styles.rightText,styles.headingText5]}>
                      <View className="float-right top-margin-5">
                        <View style={styles.miniSpacer} />
                        <Image source={rightCarrotBlue} style={[styles.square15,styles.contain]} />
                      </View>
                      <View className="float-right right-padding">
                        <Text>Browse All Groups</Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.cardClearPadding,styles.padding20,styles.bottomMargin20]}>
                  <Text style={[styles.headingText5]}>Recommended Employers to Follow</Text>

                  <View style={styles.spacer} /><View style={styles.spacer} />

                  {this.renderItems('employers','recommended')}

                  <View style={styles.spacer} />

                  <View style={[styles.row10]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Employers')} style={[styles.fullScreenWidth,styles.rightText,styles.headingText5]}>
                      <View className="float-right top-margin-5">
                        <View style={styles.miniSpacer} />
                        <Image source={rightCarrotBlue} style={[styles.square15,styles.contain]} />
                      </View>
                      <View className="float-right right-padding">
                        <Text>Browse All Employers</Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                </View>
              </View>

            </View>


            {/*
            <Modal
             isOpen={this.state.modalIsOpen}
             onAfterOpen={this.afterOpenModal}
             onRequestClose={this.closeModal}
             className="modal"
             overlayClassName="modal-overlay"
             contentLabel="Example Modal"
             ariaHideApp={false}
           >
            <View className="row-20">
              {(this.state.showPeopleYouFollow) && (
                <View>
                  <Text className="heading-text-4">Your Connections</Text>
                  <View style={styles.spacer} />
                  {this.renderItems('people','existing')}


                  <View style={styles.spacer} />
                 <TouchableOpacity className="btn btn-secondary" onPress={() => this.closeModal()}>Close View</TouchableOpacity>
                </View>
              )}
              {(this.state.showProjectsYouFollow) && (
                <View>
                  <Text className="heading-text-4">Projects You Follow</Text>
                  <View style={styles.spacer} />
                  {this.renderItems('projects','existing')}


                  <View style={styles.spacer} />
                 <TouchableOpacity className="btn btn-secondary" onPress={() => this.closeModal()}>Close View</TouchableOpacity>
                </View>
              )}
              {(this.state.showEmployersYouFollow) && (
                <View>
                  <Text className="heading-text-4">Employers You Follow</Text>
                  <View style={styles.spacer} />
                  {this.renderItems('employers','existing')}


                  <View style={styles.spacer} />
                 <TouchableOpacity className="btn btn-secondary" onPress={() => this.closeModal()}>Close View</TouchableOpacity>
                </View>
              )}
              {(this.state.showGroupsYouJoined) && (
                <View>
                  <Text className="heading-text-4">Groups You Follow</Text>
                  <View style={styles.spacer} />
                  {this.renderItems('groups','existing')}


                  <View style={styles.spacer} />
                 <TouchableOpacity className="btn btn-secondary" onPress={() => this.closeModal()}>Close View</TouchableOpacity>
                </View>
              )}

              {(this.state.showInviteMembersWidget) && (
                <View>
                  <SubInviteMembers orgName={this.state.orgName} closeModal={this.closeModal} />
                </View>
              )}

              {(this.state.showEditGroup) && (
                <View key="showEditGroup" className="full-width padding-20">
                   <SubEditGroup selectedGroup={this.state.groupToEdit} history={this.props.history} closeModal={this.closeModal} />
                 </View>
              )}

            </View>
        </Modal>*/}
      </ScrollView>
    );
  }

}

export default Community;
