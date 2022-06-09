import React, {Component} from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, Linking } from 'react-native';

import Axios from 'axios';

import {requestConnection} from '../services/FriendRoutes';

const styles = require('../css/style');

const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';

class RenderProfiles extends Component {
    constructor(props) {
      super(props)

      this.state = {
      }

      this.renderProfiles = this.renderProfiles.bind(this)
      this.viewItem = this.viewItem.bind(this)
      this.followPerson = this.followPerson.bind(this)

    }

    componentDidMount() {
      //see if user is logged in

      this.retrieveData()

    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in renderPosts')

      if (this.props.activeOrg !== prevProps.activeOrg) {
        this.retrieveData()
      } else if (this.props.favorites !== prevProps.favorites || this.props.members !== prevProps.members || this.props.friends !== prevProps.friends) {
        this.retrieveData()
      } else if (this.props.filterCriteriaArray !== prevProps.filterCriteriaArray) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in renderPosts')

        let emailId = await AsyncStorage.getItem('email');
        const username = await AsyncStorage.getItem('username');
        const cuFirstName = await AsyncStorage.getItem('firstName');
        const cuLastName = await AsyncStorage.getItem('lastName');
        let activeOrg = await AsyncStorage.getItem('activeOrg');
        if (!activeOrg) {
          activeOrg = 'guidedcompass'
        }
        const orgName = await AsyncStorage.getItem('orgName');
        // const roleName = await AsyncStorage.getItem('roleName');
        // let pictureURL = await AsyncStorage.getItem('pictureURL');

        const favorites = this.props.favorites
        const members = this.props.members
        const friends = this.props.friends
        const headerImageURL = this.props.headerImageURL

        this.setState({ favorites, members, friends, headerImageURL })

        if (emailId) {

          this.setState({ emailId, cuFirstName, cuLastName, username, activeOrg, orgName })

          Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: emailId } })
          .then((response) => {
            console.log('User details query 1 attempted');

            if (response.data.success) {
               console.log('successfully retrieved user details')

               const pictureURL = response.data.user.pictureURL
               const headline = response.data.user.headline

               const jobTitle = response.data.user.jobTitle
               const employerName = response.data.user.employerName
               const notificationPreferences = response.data.user.notificationPreferences

               let schoolName = response.data.user.school

               if (response.data.user.education && response.data.user.education.length > 0) {
                 schoolName = response.data.user.education[0].name
                 if (response.data.user.education.length > 1) {
                   for (let i = 1; i <= response.data.user.education.length; i++) {
                     if (response.data.user.education[i - 1] && this.state.education[i - 1].isContinual) {
                       schoolName = response.data.user.education[i - 1].name
                     }
                   }
                 }
               }

               this.setState({ pictureURL, headline, jobTitle, employerName, schoolName,
                 notificationPreferences
               });


            } else {
             console.log('no user details data found', response.data.message)
            }

          }).catch((error) => {
             console.log('User details query did not work', error);
          });
        }

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    followPerson(e, person) {
      console.log('followPerson called')

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

      const senderJobTitle = this.state.jobTitle
      const senderEmployerName = this.state.employerName
      const senderSchoolName = this.state.schoolName
      const accompanyingMessage = this.state.accompanyingMessage
      // let unsubscribed = null
      // if (this.state.notificationPreferences && this.state.notificationPreferences.length > 0) {
      //   for (let i = 1; i <= this.state.notificationPreferences.length; i++) {
      //     if (this.state.notificationPreferences[i - 1].slug === 'friend-requests' && this.state.notificationPreferences[i - 1].enabled === false) {
      //       unsubscribed = true
      //     }
      //   }
      // }

      const headerImageURL = this.state.headerImageURL

      let friend = {
        senderPictureURL, senderEmail, senderFirstName, senderLastName, senderUsername, senderHeadline,
        senderJobTitle, senderEmployerName, senderSchoolName,
        recipientPictureURL, recipientEmail, recipientFirstName, recipientLastName, recipientUsername, recipientHeadline,
        relationship, orgCode, orgName, accompanyingMessage, headerImageURL
      }

      const self = this
      async function asyncFollowPerson(unsubscribed) {
        console.log('asyncFollowPerson called')

        friend['unsubscribed'] = unsubscribed

        const returnedValue = await requestConnection(friend)
        console.log('show returnedValue: ', returnedValue)

        if (returnedValue.success) {
          friend['active'] = false
          friend['friend2Email'] = recipientEmail

          let friends = self.state.friends
          if (self.state.friends) {
            friends.push(friend)
          } else {
            friends = [friend]
          }

          // console.log('show friends: ', friends)
          self.setState({ successMessage: returnedValue.message, friends })
        } else {
          self.setState({ errorMessage: returnedValue.message })
        }
      }

      // pull notification preferences of the owner
      Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: recipientEmail } })
      .then((response) => {
        console.log('Profile query for notipreferences attempted');

         if (response.data.success) {
           console.log('successfully retrieved profile information')
           const notificationPreferences = response.data.user.notificationPreferences

           let unsubscribed = null
           if (notificationPreferences && notificationPreferences.length > 0) {
             for (let i = 1; i <= notificationPreferences.length; i++) {
               if (notificationPreferences[i - 1].slug === 'incoming-comments' && notificationPreferences[i - 1].enabled === false) {
                 unsubscribed = true
               }
             }
           }

           asyncFollowPerson(unsubscribed)

         } else {
           console.log('no profile data found', response.data.message)

           asyncFollowPerson()
         }

      }).catch((error) => {
         console.log('Profile query did not work', error);
      });
    }

    renderProfiles() {
      console.log('renderProfiles called')

      return (
        <View key="profiles">
          {(this.state.members) && (
            <View>
              {this.state.members.map((item, optionIndex) =>
                <View key={item + optionIndex}>
                  <View>
                    <TouchableOpacity onPress={() => this.viewItem('profile',item)}>
                      <View style={[styles.card,styles.standardBorder,styles.calcColumn40,styles.centerHorizontally]}>
                        <View style={[styles.rowDirection]}>
                          <View style={[styles.flex15]}>
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
                          <View style={[styles.flex70,styles.flexCenter]}>
                            {(item.pictureURL) ? (
                              <Image source={{ uri: item.pictureURL }} style={[styles.profileThumbnail80,styles.centerItem]} />
                            ) : (
                              <Image source={{uri: profileIconDark}} style={[styles.square60,styles.contain,styles.centerItem]} />
                            )}
                          </View>
                          <View style={[styles.flex15,styles.height30]} />

                        </View>

                        <Text style={[styles.calcColumn100,styles.centerText,styles.headingText6,styles.topPadding]}>{item.firstName} {item.lastName}</Text>
                        {(item.school) ? (
                          <Text style={[styles.calcColumn100,styles.centerText,styles.descriptionText3,styles.topPadding]}>{item.school}{item.gradYear && " '" + item.gradYear}</Text>
                        ) : (
                          <View />
                        )}
                        {(item.major) ? (
                          <Text style={[styles.calcColumn100,styles.centerText,styles.descriptionText3,styles.topPadding5]}>{item.major}</Text>
                        ) : (
                          <View />
                        )}

                        <View style={[styles.topPadding20]}>
                          <View style={[styles.calcColumn100]}>
                            {/*
                            {(item.active || item.activeRequest) ? (
                              <View>
                                {(item.active) ? (
                                  <TouchableOpacity onPress={() => this.viewItem('messages', item)} style={[styles.calcColumn100,styles.btnSquarish,styles.ctaBackgroundColor, styles.whiteColor,styles.descriptionText3,styles.leftMargin5,styles.flexCenter]}>
                                      <Text style={styles.whiteColor}>Message</Text>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.calcColumn100,styles.btnSquarish,styles.descriptionText1,styles.mediumBackground,styles.flexCenter]} disabled={true}><Text style={styles.whiteColor}>Pending</Text></View>
                                )}
                              </View>
                            ) : (
                              <TouchableOpacity style={[styles.calcColumn100,styles.btnSquarish,styles.descriptionText1,styles.ctaBackgroundColor,styles.whiteColor,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={(e) => this.followPerson(e,item,optionIndex)}><Text style={styles.whiteColor}>Connect</Text></TouchableOpacity>
                            )}*/}

                            {(this.state.friends && this.state.friends.some(friend => (friend.friend1Email === item.email) || friend.friend2Email === item.email)) ? (
                              <View>
                                {(this.state.friends.some(friend => (friend.friend1Email === item.email || friend.friend2Email === item.email) && friend.active)) ? (
                                  <TouchableOpacity onPress={() => this.viewItem('messages', item)} style={[styles.calcColumn100,styles.btnSquarish,styles.ctaBackgroundColor, styles.whiteColor,styles.descriptionText3,styles.leftMargin5,styles.flexCenter]}>
                                      <Text style={styles.whiteColor}>Message</Text>
                                  </TouchableOpacity>
                                ) : (
                                  <View style={[styles.calcColumn100,styles.btnSquarish,styles.descriptionText1,styles.mediumBackground,styles.flexCenter]} disabled={true}><Text style={styles.whiteColor}>Pending</Text></View>
                                )}
                              </View>
                            ) : (
                              <TouchableOpacity style={[styles.calcColumn100,styles.btnSquarish,styles.descriptionText1,styles.ctaBackgroundColor,styles.whiteColor,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={(e) => this.followPerson(e,item,optionIndex)}><Text style={styles.whiteColor}>Connect</Text></TouchableOpacity>
                            )}
                          </View>
                        </View>
                        <View style={styles.spacer} />
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View style={styles.spacer} /><View style={styles.spacer} />
                </View>
              )}
            </View>
          )}
        </View>
      )

    }

    viewItem(type,item,items) {
      console.log('viewItem called')

      if (type === 'profile') {
        this.props.navigation.navigate('Profile', { username: item.username, matchScore: item.matchScore })
      } else if (type == 'project') {
        this.props.navigation.navigate('ProjectDetails', { _id: item._id, selectedProject: item })
      } else if (type === 'group') {
        this.props.navigation.navigate('GroupDetails', { selectedGroup: item })
      } else if (type === 'employer') {
        this.props.navigation.navigate('EmployerDetails', { _id: item._id, selectedEmployer: item, employers: items })
      } else if (type === 'messages') {
        this.props.navigation.navigate('Messages', { recipient: item })
      }
    }

    render() {

      return (
        <View>
          {this.renderProfiles()}
        </View>
      )
    }
}

export default RenderProfiles;
