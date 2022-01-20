import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, Image} from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import { useIsFocused } from '@react-navigation/native';

import SubRenderPosts from '../common/RenderPosts';

// const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const assigneeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/assignee-icon-dark.png';
// const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png';
// const eventIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/event-icon-dark.png';
// const assignmentIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/assignments-icon-dark.png';
// const problemIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/problem-icon-dark.png';
// const challengeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/challenge-icon-dark.png';
// const careerMatchesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-dark.png';
// const projectsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-dark.png';
const industryIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/industry-icon-dark.png';
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';
// const targetIconOrange = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/target-icon-orange.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdownArrow.png';
const socialIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-dark.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';
const addIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon-blue.png';
const mentoringIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/mentoring-icon-blue.png';
const gcSquareLogo = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/gc-square-logo.png';
const searchIconDark = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon-dark.png"
const addIcon = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png"

import SubSearchItems from '../../components/common/SearchItems';
import SubCreatePost from '../../components/common/CreatePost';

class NewsFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.navigateAway = this.navigateAway.bind(this)
    this.workspaceClicked = this.workspaceClicked.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');
    this.retrieveData()

    const newsFeedReload = this.props.navigation.addListener('focus', () => {
      // The screen is focused
      // Call any action
      console.log('reloadData called')
      this.retrieveData()
    });
  }

  componentWillUnmount () {
    console.log('componentWillUnmount called')
    this.props.navigation.removeListener('newsFeedReload')
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

      let activeOrg = await AsyncStorage.getItem('activeOrg')

      if (!activeOrg) {
        activeOrg = 'guidedcompass'
      }
      //const email = 'harry@potter.com'


      if (emailId !== null) {
        // We have data!!
        console.log('email ', emailId);
        this.setState({ emailId, activeOrg, orgName, cuFirstName,cuLastName, username, orgFocus, roleName })

        this.props.navigation.setOptions({ headerRight: () => (
          <View style={{ flexDirection: 'row'}}>
            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showSearch: true })}>
              <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                <Image source={{ uri: searchIconDark }} style={[styles.square23,styles.contain]} />
              </View>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showCreatePost: true })}>
              <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                <Image source={{ uri: addIcon }} style={[styles.square23,styles.contain]} />
              </View>
            </TouchableOpacity>
          </View>
        )})

        const resLimit = 4
        const self = this
        const baseURL = 'https://www.guidedcompass.com'

        function pullAdditionalInfo(friendIds, activeFriendIds) {
           console.log('pullAdditionalInfo called')

           Axios.get(baseURL + '/api/users/profile/details/' + emailId, { params: { emailId } })
            .then((response) => {
              console.log('query for profile data worked in newsfeed');

              if (response.data.success) {

                console.log('profile data received')

                const pictureURL = response.data.user.pictureURL
                const headline = response.data.user.headline
                const postPreferences = response.data.user.postPreferences
                const postReports = response.data.user.postReports

                let excludePostIds = []
                if (postPreferences) {
                  for (let i = 1; i <= postPreferences.length; i++) {
                    excludePostIds.push(postPreferences[i - 1].postId)
                  }
                }
                if (postReports) {
                  for (let i = 1; i <= postReports.length; i++) {
                    excludePostIds.push(postReports[i - 1].postId)
                  }
                }

                const authType = response.data.user.authType
                const oauthUid = response.data.user.oauthUid

                self.setState({ pictureURL, headline, postPreferences, postReports, excludePostIds, activeFriendIds })

                let postQueryParams = { groupId: null, orgCode: activeOrg, excludePostIds, friendIds: activeFriendIds, emailId, authType, oauthUid }
                if (self.props.mySocialPosts) {
                  postQueryParams = { groupId: null, orgCode: activeOrg, onlyCUPosts: true, emailId }
                }
                console.log('postQueryParams: ', postQueryParams)
                Axios.get(baseURL + '/api/group-posts', { params: postQueryParams })
                .then((response) => {
                   console.log('Group posts query attempted in newsfeed');

                   if (response.data.success) {
                     console.log('successfully retrieved group posts in newsfeed')

                     let posts = []
                     if (response.data.groupPosts) {
                       posts = response.data.groupPosts

                       const pinnedIndex = posts.findIndex(x => x.pinned === true);
                       if (pinnedIndex > -1) {
                         const pinnedPost = posts[pinnedIndex]
                         posts.splice(pinnedIndex,1)
                         posts.unshift(pinnedPost)
                       }
                       // console.log('show posts: !!!!!!!!!!!!!!!!!!!!', posts )


                     }

                     self.setState({ posts, postsAreLoading: false })

                     if (self.props.passedPostId) {

                       Axios.get(baseURL + '/api/group-posts/byid', { params: { _id: passedPostId } })
                       .then((response) => {
                          console.log('Group post query attempted');

                          if (response.data.success) {
                            console.log('successfully retrieved group post')

                            if (response.data.groupPost) {
                              self.setState({ passedGroupPost: response.data.groupPost })
                            }
                          }
                       }).catch((error) => {
                           console.log('Group post query did not work', error);
                       });

                       Axios.get(baseURL + '/api/comments', { params: { parentPostId: passedPostId } })
                       .then((response) => {
                         console.log('Comments query attempted');

                          if (response.data.success) {
                            console.log('successfully retrieved comments')

                            const comments = response.data.comments
                            self.setState({ comments })

                          } else {
                            console.log('no comments data found', response.data.message)
                            self.setState({ comments: [] })
                          }
                       }).catch((error) => {
                          console.log('Comments query did not work', error);
                          self.setState({ comments: [] })
                       });
                     }

                   } else {
                     console.log('there was an issue: ', response.data.message)
                     self.setState({ postsAreLoading: false })
                   }
                }).catch((error) => {
                    console.log('Group posts query did not work', error);
                });

                if (response.data.user.myOrgs && response.data.user.myOrgs.length > 0) {
                  Axios.get('https://www.guidedcompass.com/api/orgs', { params: { orgCodes: response.data.user.myOrgs } })
                   .then((response) => {
                     console.log('Org objects info query attempted');

                     if (response.data.success) {
                       console.log('org info query worked')

                       const myOrgObjects = response.data.orgs
                       self.setState({ myOrgObjects })

                     } else {
                       console.log('org info query did not work', response.data.message)

                     }

                   }).catch((error) => {
                       console.log('Org info query did not work for some reason', error);
                   });
                }

              } else {
                console.log('error response', response.data)
              }

            }).catch((error) => {
                console.log('query for profile info did not work', error);
            })

           Axios.get(baseURL + '/api/suggested-people', { params: { orgCode: activeOrg, resLimit, emailId, roleNames: ['Student','Career-Seeker'], friendIds } })
           .then((response) => {
             console.log('Suggested people query attempted')

               if (response.data.success) {
                 console.log('suggested people query worked')

                 const suggestedPeople = response.data.users
                 self.setState({ suggestedPeople })

               } else {
                 console.log('suggested people query did not work', response.data.message)
               }

           }).catch((error) => {
               console.log('Suggested people query did not work for some reason', error);
           });
         }

         Axios.get(baseURL + '/api/friends', { params: { orgCode: activeOrg, emailId } })
         .then((response) => {
           console.log('Friends query attempted');

             if (response.data.success) {
               console.log('friends query worked')

                const friends = response.data.friends
                this.setState({ friends })

                let friendIds = []
                let activeFriendIds = []
                for (let i = 1; i <= friends.length; i++) {
                  let friendEmail = null
                  if (friends[i - 1].friend1Email === emailId) {
                      friendEmail = friends[i - 1].friend2Email
                  } else {
                    friendEmail = friends[i - 1].friend1Email
                  }

                  friendIds.push(friendEmail)
                  if (friends[i - 1].active) {
                    activeFriendIds.push(friendEmail)
                  }
                }

                let postFilterValue = this.state.postFilterValue
                if (activeFriendIds.length > 1) {
                  postFilterValue = 'Connections'
                  this.setState({ postFilterValue })
                }

                pullAdditionalInfo(friendIds, activeFriendIds)

             } else {
               console.log('friends query did not work', response.data.message)
               pullAdditionalInfo()
             }

         }).catch((error) => {
             console.log('Friends query did not work for some reason', error);
         })

         Axios.get(baseURL + '/api/org', { params: { orgCode: activeOrg } })
         .then((response) => {
           console.log('Org info query attempted for orgFocus on login');

           if (response.data.success) {
             console.log('org info query worked for orgFocus')

             const orgContactEmail = response.data.orgInfo.contactEmail
             const orgLogo = response.data.orgInfo.webLogoURIColor
             const orgName = response.data.orgInfo.orgName
             const orgMission = response.data.orgInfo.orgMission
             self.setState({ orgContactEmail, orgLogo, orgName, orgMission })

             this.props.navigation.setOptions({ headerTitle: () => (
               <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showWorkspaces: true })}>
                 <Image source={{uri: orgLogo}} style={{ width: 200, height: 32, resizeMode: 'contain' }} />
               </TouchableOpacity>
             )})

           } else {
             console.log('org info query did not work', response.data.message)
           }

       }).catch((error) => {
           console.log('Org info query did not work for some reason', error);
       });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showWorkspaces: false, showSearch: false, showCreatePost: false })

  }

  navigateAway(component) {
    console.log('navigateAway called')

    this.closeModal()
    this.props.navigation.navigate(component)
  }

  workspaceClicked(orgCode) {
    console.log('workspaceClicked called: ', orgCode)

    if (orgCode !== this.state.activeOrg) {

      this.setState({ serverSuccessMessage: null, serverErrorMessage: null })

      const emailId = this.state.emailId
      const activeOrg = orgCode
      const updatedAt = new Date()

      Axios.post('https://www.guidedcompass.com/api/users/profile/details', {
        emailId, activeOrg, updatedAt })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Org switch worked', response.data);

          AsyncStorage.setItem('activeOrg', activeOrg)
          this.setState({ activeOrg, modalIsOpen: false, showWorkspaces: false })
          // if (this.props.loadWorkspace) {
          //   this.props.loadWorkspace(activeOrg)
          // }
          this.retrieveData()

        } else {
          console.error('there was an error switching the orgs', response.data);

        }
      }).catch((error) => {
          console.log('Org switch did not work', error);
      });
    }
  }

  render() {
    // console.log('show style: ', Style.styles)
    return (
      <ScrollView>
        {(this.state.posts && this.state.posts.length > 0) && (
          <View>
            {/*
            {(!this.props.mySocialPosts) && (
              <View>
                <View style={[styles.topPadding20]}>
                  <View className="calc-column-offset-165 top-padding-5">
                    <View style={[styles.horizontalLine]} />
                  </View>
                  <View className="fixed-column-150-static description-text-4 curtail-text">
                    <TouchableOpacity className="background-button full-width clear-margin clear-padding top-margin-negative-10" onPress={(this.state.showPostFilterMenu) ? () => this.setState({ showPostFilterMenu: false }) : () => this.setState({ showPostFilerMenu: true })}>
                      <Text className="full-width right-text">Filter: Posts from <Text className="bold-text">{(this.state.postFilterValue === 'Admin') ? this.state.orgName : this.state.postFilterValue}</Text></Text>
                    </TouchableOpacity>
                  </View>
                  <View className="fixed-column-15 top-margin-negative-5">
                    <TouchableOpacity className="background-button full-width" onPress={(this.state.showPostFilterMenu) ? () => this.setState({ showPostFilterMenu: false }) : () => this.setState({ showPostFilterMenu: true })}>
                      <Image source={{ uri: dropdownArrow}} style={[styles.square8,styles.contain,styles.pinRight]} />
                    </TouchableOpacity>
                  </View>

                </View>

                {(this.state.showPostFilterMenu) && (
                  <View style={[styles.descriptionText3,styles.absolutePosition,styles.slightlyRoundedCorners,styles.mediumShadow,styles.padding20]}>
                    <View>
                      <TouchableOpacity className="background-button full-width left-text" onPress={() => this.filterPosts('Everyone', null, this.state.activeOrg, this.state.excludePostIds, this.state.activeFriendIds, this.state.emailId)}>
                        <View style={[styles.row5]}>
                          <View className="fixed-column-25">
                            <Image source={{ uri: socialIconDark}} style={[styles.square15,styles.contain]} />
                          </View>
                          <View className="calc-column-offset-25">
                            <Text>Everyone</Text>
                          </View>

                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity className="background-button full-width left-text" onPress={() => this.filterPosts('Connections', null, this.state.activeOrg, this.state.excludePostIds, this.state.activeFriendIds, this.state.emailId)}>
                        <View style={[styles.row5]}>
                          <View className="fixed-column-25">
                            <Image source={{ uri: assigneeIconDark}} style={[styles.square15,styles.contain]} />
                          </View>
                          <View className="calc-column-offset-25">
                            <Text>Connections</Text>
                          </View>

                        </View>
                      </TouchableOpacity>
                      <TouchableOpacity className="background-button full-width left-text" onPress={() => this.filterPosts('Admin', null, this.state.activeOrg, this.state.excludePostIds, this.state.activeFriendIds, this.state.emailId)}>
                        <View style={[styles.row5]}>
                          <View className="fixed-column-25">
                            <Image source={(this.state.orgLogo) ? { uri: this.state.orgLogo} : { uri: industryIconDark}} style={[styles.square15,styles.contain]} />
                          </View>
                          <View className="calc-column-offset-25">
                            <Text>{this.state.orgName}</Text>
                          </View>

                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            )}*/}

            {(this.state.postsAreLoading) ? (
              <View style={[styles.flexCenter, styles.fullSpace]}>
                <View>
                 <ActivityIndicator
                    animating = {this.state.postsAreLoading}
                    color = '#87CEFA'
                    size = "large"
                    style={[styles.square80, styles.centerHorizontally]}/>
                  <View style={{ height: 10 }}/>
                  <Text style={{ fontSize: 26, color: '#87CEFA', textAlign: 'center' }}>Saving results and calculating matches...</Text>
                </View>
              </View>
            ) : (
              <View>
                <SubRenderPosts navigation={this.props.navigation} posts={this.state.posts} passedGroupPost={this.state.passedGroupPost} />
              </View>
            )}

          </View>
        )}

        <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
          {(this.state.showWorkspaces) && (
            <ScrollView style={[styles.flex1,styles.padding20]}>
              <View style={[styles.flex1]}>
                <View style={[styles.rowDirection,styles.row20]}>
                  <View style={[styles.calcColumn110]}>
                    <Text style={[styles.headingText4]}>Switch Workspaces</Text>
                  </View>
                  <View style={[styles.width30, styles.topMargin5]}>
                    <TouchableOpacity onPress={() => this.closeModal()}>
                      <Image source={{ uri: closeIcon }} style={[styles.square15,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View>
                  <View style={[styles.row10]}>
                    <TouchableOpacity style={[styles.row5,styles.rowDirection]} onPress={() => this.workspaceClicked('guidedcompass')}>
                      <View style={[styles.rightPadding]}>
                        <Image source={{ uri: gcSquareLogo }} style={[styles.square30,styles.contain]} />
                      </View>
                      <View style={[styles.calcColumn150]}>
                        <Text style={[styles.standardText]}>Guided Compass</Text>
                      </View>

                      {(this.state.activeOrg === 'guidedcompass') && (
                        <View style={[styles.leftPadding,styles.topMargin5]}>
                          <View style={[styles.miniSpacer]} />
                          <Image source={{ uri: checkmarkIcon}} style={[styles.square20,styles.contain]} />
                        </View>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.horizontalLine]} />
                </View>

                {(this.state.myOrgObjects && this.state.myOrgObjects.length > 0) ? (
                  <View>
                    {this.state.myOrgObjects.map((org, optionIndex) =>
                      <View key={org._id}>
                        {(org.orgCode !== 'guidedcompass') && (
                          <View style={[styles.row10]}>
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.rowDirection]} onPress={() => this.workspaceClicked(org.orgCode)}>
                                <View style={[styles.rightPadding]}>
                                  <Image source={(org.webLogoURIColor) ? { uri: org.webLogoURIColor} : { uri: mentoringIconBlue}} style={[styles.square30,styles.contain]} />
                                </View>
                                <View style={[styles.calcColumn150]}>
                                  <Text style={[styles.standardText]}>{org.orgName}</Text>
                                </View>

                                {(this.state.activeOrg === org.orgCode) && (
                                  <View style={[styles.leftPadding,styles.topMargin5]}>
                                    <View style={[styles.miniSpacer]} />
                                    <Image source={{ uri: checkmarkIcon}} style={[styles.square20,styles.contain]} />
                                  </View>
                                )}
                              </TouchableOpacity>
                            </View>
                          </View>
                        )}

                        <View style={[styles.horizontalLine]} />
                      </View>
                    )}
                  </View>
                ) : (
                  <View />
                )}

                <View style={[styles.lightHorizontalLine]} />

                <View style={[styles.row20]}>
                  <TouchableOpacity onPress={() => this.navigateAway('AddWorkspaces')}>
                    <View style={[styles.rowDirection]}>
                      <View style={[styles.width25, styles.topMargin5]}>
                        <Image source={{ uri: addIconBlue }} style={[styles.square15,styles.contain ]} />
                      </View>
                      <View style={[styles.calcColumn90]}>
                        <Text style={[styles.standardText,styles.ctaColor,styles.boldText]}>Join Org Workspaces</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

            </ScrollView>
          )}

          {(this.state.showSearch) && (
            <View style={[styles.flex1,styles.padding20]}>
              <SubSearchItems navigation={this.props.navigation} modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} />
            </View>
          )}

          {(this.state.showCreatePost) && (
            <View style={[styles.flex1,styles.padding20]}>
              <SubCreatePost navigation={this.props.navigation} modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} />
            </View>
          )}

        </Modal>
      </ScrollView>
    );
  }

}

export default NewsFeed;
