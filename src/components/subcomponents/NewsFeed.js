import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

import SubRenderPosts from '../common/RenderPosts';

class NewsFeed extends Component {
  constructor(props) {
    super(props)
    this.state = {
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

      let activeOrg = await AsyncStorage.getItem('activeOrg')

      if (!activeOrg) {
        activeOrg = 'guidedcompass'
      }
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        const resLimit = 4
        const self = this
        const baseURL = 'https://www.guidedcompass.com'

        function pullAdditionalInfo(friendIds, activeFriendIds) {
           console.log('pullAdditionalInfo called', friendIds, activeFriendIds)

           Axios.get(baseURL + '/api/users/profile/details/' + emailId, { params: { emailId } })
            .then((response) => {
              console.log('query for profile data worked in newsfeed');

              if (response.data.success) {

                console.log('profile data received', response.data)

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

                Axios.get(baseURL + '/api/group-posts', { params: postQueryParams })
                .then((response) => {
                   console.log('Group posts query attempted in newsfeed', response.data);

                   if (response.data.success) {
                     console.log('successfully retrieved group posts in newsfeed')

                     let posts = []
                     if (response.data.groupPosts) {
                       posts = response.data.groupPosts
                       const pinnedIndex = posts.findIndex(x => x.pinned === true);
                       const pinnedPost = posts[pinnedIndex]
                       posts.splice(pinnedIndex,1)
                       posts.unshift(pinnedPost)
                       // console.log('show pinnedPost: ', pinnedPost)
                     }
                     console.log('got the posts? ')
                     self.setState({ posts, postsAreLoading: false })

                     if (self.props.passedPostId) {

                       Axios.get(baseURL + '/api/group-posts/byid', { params: { _id: passedPostId } })
                       .then((response) => {
                          console.log('Group post query attempted', response.data);

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
                         console.log('Comments query attempted', response.data);

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
                     self.setState({ postsAreLoading: false })
                   }
                }).catch((error) => {
                    console.log('Group posts query did not work', error);
                });

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
           console.log('Friends query attempted', response.data);

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
           console.log('Org info query attempted for orgFocus on login', response.data);

           if (response.data.success) {
             console.log('org info query worked for orgFocus')

             const orgContactEmail = response.data.orgInfo.contactEmail
             const orgLogo = response.data.orgInfo.webLogoURIColor
             const orgName = response.data.orgInfo.orgName
             const orgMission = response.data.orgInfo.orgMission
             self.setState({ orgContactEmail, orgLogo, orgName, orgMission })

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

  render() {
    // console.log('show style: ', Style.styles)
    return (
      <ScrollView>
        {(this.state.posts && this.state.posts.length > 0) && (
          <View>
            {/*
            {(!window.location.pathname.includes('/my-social-posts')) && (
              <div>
                <div className="top-padding-20">
                  <div className="calc-column-offset-165 top-padding-5">
                    <hr />
                  </div>
                  <div className="fixed-column-150-static description-text-4 curtail-text">
                    <button className="background-button full-width clear-margin clear-padding top-margin-negative-10" onClick={(this.state.showPostFilterMenu) ? () => this.setState({ showPostFilterMenu: false }) : () => this.setState({ showPostFilerMenu: true })}>
                      <p className="full-width right-text">Filter: Posts from <label className="bold-text">{(this.state.postFilterValue === 'Admin') ? this.state.orgName : this.state.postFilterValue}</label></p>
                    </button>
                  </div>
                  <div className="fixed-column-15 top-margin-negative-5">
                    <button className="background-button full-width" onClick={(this.state.showPostFilterMenu) ? () => this.setState({ showPostFilterMenu: false }) : () => this.setState({ showPostFilterMenu: true })}>
                      <img src={dropdownArrow} alt="GC" className="image-auto-8 pin-right" />
                    </button>
                  </div>
                  <div className="clear" />
                </div>

                {(this.state.showPostFilterMenu) && (
                  <div className="menu-bottom-2 description-text-3">
                    <div>
                      <button className="background-button full-width left-text" onClick={() => this.filterPosts('Everyone', null, this.state.activeOrg, this.state.excludePostIds, this.state.activeFriendIds, this.state.emailId)}>
                        <div className="row-5">
                          <div className="fixed-column-25">
                            <img src={socialIconDark} alt="GC" className="image-auto-15" />
                          </div>
                          <div className="calc-column-offset-25">
                            <p>Everyone</p>
                          </div>
                          <div className="clear" />
                        </div>
                      </button>
                      <button className="background-button full-width left-text" onClick={() => this.filterPosts('Connections', null, this.state.activeOrg, this.state.excludePostIds, this.state.activeFriendIds, this.state.emailId)}>
                        <div className="row-5">
                          <div className="fixed-column-25">
                            <img src={assigneeIconDark} alt="GC" className="image-auto-15" />
                          </div>
                          <div className="calc-column-offset-25">
                            <p>Connections</p>
                          </div>
                          <div className="clear" />
                        </div>
                      </button>
                      <button className="background-button full-width left-text" onClick={() => this.filterPosts('Admin', null, this.state.activeOrg, this.state.excludePostIds, this.state.activeFriendIds, this.state.emailId)}>
                        <div className="row-5">
                          <div className="fixed-column-25">
                            <img src={(this.state.orgLogo) ? this.state.orgLogo : industryIconDark} alt="GC" className="image-15-fit" />
                          </div>
                          <div className="calc-column-offset-25">
                            <p>{this.state.orgName}</p>
                          </div>
                          <div className="clear" />
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}*/}

            {(this.state.postsAreLoading) ? (
              <View style={[styles.flexCenter, styles.fullSpace]}>
                <View>
                 <ActivityIndicator
                    animating = {this.state.animating}
                    color = '#87CEFA'
                    size = "large"
                    style={[styles.square80, styles.centerHorizontally]}/>
                  <View style={{ height: 10 }}/>
                  <Text style={{ fontSize: 26, color: '#87CEFA', textAlign: 'center' }}>Saving results and calculating matches...</Text>
                </View>
              </View>
            ) : (
              <View>
                <SubRenderPosts posts={this.state.posts} passedGroupPost={this.state.passedGroupPost} />
              </View>
            )}

          </View>
        )}
      </ScrollView>
    );
  }

}

export default NewsFeed;
