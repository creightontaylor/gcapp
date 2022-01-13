import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Image, TextInput, ImageBackground } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

const notificationsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/notifications-icon-dark.png'
const chatbubblesIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/chatbubbles-icon.png'
const socialIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-dark.png'

import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont()

class RenderMyGroups extends Component {
    constructor(props) {
      super(props)
      this.state = {
      }

      this.retrieveData = this.retrieveData.bind(this)
      this.countUnreadNotifications = this.countUnreadNotifications.bind(this)
      this.updateView = this.updateView.bind(this)

    }

    componentDidMount() {
      console.log('componentDidMount called')

      this.retrieveData()

    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in RefreshNotifications')

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in RefreshNotifications')

        const emailId = await AsyncStorage.getItem('email');
        const email = emailId
        const username = await AsyncStorage.getItem('username');
        const cuFirstName = await AsyncStorage.getItem('firstName');
        const cuLastName = await AsyncStorage.getItem('lastName');
        let activeOrg = await AsyncStorage.getItem('activeOrg');
        if (!activeOrg) {
          activeOrg = 'guidedcompass'
        }
        const orgFocus = await AsyncStorage.getItem('orgFocus');
        const roleName = await AsyncStorage.getItem('roleName');
        let pictureURL = await AsyncStorage.getItem('pictureURL');
        let orgName = await AsyncStorage.getItem('orgName');

        this.setState({ emailId, username, cuFirstName, cuLastName, pictureURL, activeOrg, orgFocus, orgName })

        Axios.get('https://www.guidedcompass.com/api/inboxes', { params: { emailId: email, orgCode: activeOrg} })
        .then((response) => {
          console.log('Inboxes query attempted');

           if (response.data.success) {
             console.log('successfully retrieved inboxes')

             const inboxes = response.data.inboxes
             let unreadMessageCount = 0
             if (inboxes && inboxes.length > 0) {
               for (let i = 1; i <= inboxes.length; i++) {
                 if (inboxes[i - 1].unreadCount) {
                   unreadMessageCount = unreadMessageCount + inboxes[i - 1].unreadCount
                 }
               }
             }

             this.setState({ unreadMessageCount })
             this.updateView('Messages',unreadMessageCount)

           } else {
             console.log('no inboxes found', response.data.message)
             this.setState({ errorMessage: response.data.message })
             this.updateView('Messages',0)

           }

        }).catch((error) => {
           console.log('Inboxes query did not work', error);
        });

        if (!this.props.fromNotifications) {
          Axios.get('https://www.guidedcompass.com/api/notifications', { params: { emailId: email, orgCode: activeOrg } })
          .then((response) => {
            console.log('Notifications query tried in appNav');

            if (response.data.success) {

              // this.setState({ notifications: response.data.notifications })
              this.countUnreadNotifications(response.data.notifications)

            } else {
              console.log('no notifications found', response.data.message)
              this.updateView('Notifications',unreadNotificationsCount)
            }

          }).catch((error) => {
              console.log('Notifications query did not work', error);
          });
        }

        if (!this.props.fromCommunity) {

          const self = this
          function pullGroupRequests(unreadRequests) {
            console.log('pullGroupRequests called')

            Axios.get('https://www.guidedcompass.com/api/groups/unread-notifications', { params: { orgCode: activeOrg, emailId: email } })
            .then((response) => {
              console.log('Unread notifications query attempted');

                if (response.data.success && response.data.unreadGroups) {
                  console.log('unread notifications query worked')

                  let unreadGroupNotifications = response.data.unreadGroups
                  unreadRequests = unreadRequests + unreadGroupNotifications.length
                  console.log('show unreadRequests: ', unreadRequests)
                  self.setState({ unreadRequests })
                  self.updateView('Community',unreadRequests)
                } else {
                  console.log('unread requests query did not work', response.data.message)
                  self.setState({ unreadRequests })
                  self.updateView('Community',unreadRequests)
                }

            }).catch((error) => {
                console.log('Unread requests query did not work for some reason', error);
            })
          }

          Axios.get('https://www.guidedcompass.com/api/friends', { params: { orgCode: activeOrg, emailId: email } })
          .then((response) => {
            console.log('Friends query attempted');

              if (response.data.success) {
                console.log('friends query worked')

                let unreadRequests = 0
                if (response.data.friends) {
                  for (let i = 1; i <= response.data.friends.length; i++) {
                    // console.log('looping through the friends', response.data.friends[i - 1].requesterEmail)
                    if (response.data.friends[i - 1].activeRequest && response.data.friends[i - 1].isRead === false && response.data.friends[i - 1].requesterEmail !== email) {
                      // console.log('up in it')
                      unreadRequests = unreadRequests + 1
                    }
                  }
                }
                // this.setState({ unreadRequests })
                pullGroupRequests(unreadRequests)

              } else {
                console.log('friends query did not work', response.data.message)
                pullGroupRequests(0)
              }

          }).catch((error) => {
              console.log('Friends query did not work for some reason', error);
          })
        }

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    countUnreadNotifications(notifications) {
      console.log('countUnreadNotifications called')
      let unreadNotificationsCount = 0;

      for (let i = 1; i <= notifications.length; i++) {
        console.log(i);

        if (notifications[i - 1].isRead === false) {
          unreadNotificationsCount = unreadNotificationsCount + 1
        }
      }

      console.log('show unreadNotificationsCount', unreadNotificationsCount)

      AsyncStorage.setItem('unreadNotificationsCount', unreadNotificationsCount.toString())
      this.setState({ unreadNotificationsCount })
      this.updateView('Notifications',unreadNotificationsCount)

    }

    updateView(type,notiCount) {
      console.log('updateView called', type, notiCount)

      let unreadMessageCount = 0
      let unreadNotificationsCount = 0
      if (type === 'Messages') {
        console.log('in messages')
        unreadMessageCount = notiCount
        unreadNotificationsCount = this.state.unreadNotificationsCount
      } else if (type === 'Notifications') {
        unreadMessageCount = this.state.unreadMessageCount
        unreadNotificationsCount = notiCount
      }

      if (type === 'Community') {
        this.props.navigation.setOptions({ tabBarIcon: () => (
          <View>
            {(unreadNotificationsCount === 0 ) ? (
              <TouchableOpacity onPress={() => navigation.navigate('Community')}>
                <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                  <Icon name="people" size={25} color={'#5A5A5A'} />
                </View>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity onPress={() => navigation.navigate('Community')} style={[styles.rowDirection,styles.leftMargin20]}>
                <ImageBackground source={{uri: socialIconDark }} style={[styles.square25,styles.contain]}>
                  <View style={[styles.notiBubbleSmall, styles.errorBackgroundColor,styles.leftMargin15,styles.topMarginNegative5]}>
                    <Text style={[styles.descriptionText5]}>{notiCount}</Text>
                  </View>
                </ImageBackground>
              </TouchableOpacity>
            )}

          </View>
        )})
      } else {
        if (this.props.fromHome) {
          this.props.navigation.setOptions({ headerLeft: () => (
            <View style={{ flexDirection: 'row'}}>
              {(unreadNotificationsCount === 0 ) ? (
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                  <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                    <Icon name="notifications" size={25} color='#5A5A5A' />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate('Notifications')} style={[styles.rowDirection,styles.leftMargin20]}>
                  <ImageBackground source={{uri: notificationsIconDark }} style={[styles.square25,styles.contain]}>
                    <View style={[styles.notiBubbleSmall, styles.errorBackgroundColor,styles.leftMargin15,styles.topMarginNegative5]}>
                      <Text style={[styles.descriptionText5]}>{unreadNotificationsCount}</Text>
                    </View>
                  </ImageBackground>
                </TouchableOpacity>
              )}

              {(this.state.unreadMessageCount === 0 ) ? (
                <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
                  <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                    <Image source={{ uri: chatbubblesIcon }} style={[styles.square23,styles.contain]} />
                  </View>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => navigation.navigate('Messages')} style={[styles.rowDirection,styles.leftMargin20]}>
                  <ImageBackground source={{uri: chatbubblesIcon }} style={[styles.square23,styles.contain]}>
                    <View style={[styles.notiBubbleSmall, styles.errorBackgroundColor,styles.leftMargin15,styles.topMarginNegative5]}>
                      <Text style={[styles.descriptionText5]}>{unreadMessageCount}</Text>
                    </View>
                  </ImageBackground>
                  {/*
                  <View style={{ marginLeft: 15 }}>
                    <Icon name="chatbubbles" size={25} color='#5A5A5A' />
                  </View>
                  <View style={[styles.notiBubbleSmall, styles.errorBackgroundColor,styles.rightMarginNegative28]}>
                    <Text style={[styles.descriptionText5]}>{notiCount}</Text>
                  </View>*/}
                </TouchableOpacity>
              )}

            </View>
          )})
        }
      }
    }


    render() {

      return (
        <View />
      )
    }
}

export default RenderMyGroups
