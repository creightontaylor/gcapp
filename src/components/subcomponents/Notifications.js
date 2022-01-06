import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

const storyIconBig = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/input-icon-big.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const notificationsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/notifications-icon-blue.png';

class Notifications extends Component {
  constructor(props) {
    super(props)
    this.state = {
      notifications: []
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.renderNotifications = this.renderNotifications.bind(this);
    this.clearUnreadNotifications = this.clearUnreadNotifications.bind(this);

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ', this.props.activeOrg, prevProps)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode || this.props.roleName !== prevProps.roleName) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      console.log('this is causing the error')
      const emailId = await AsyncStorage.getItem('email')
      const email = emailId
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

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, orgFocus, orgName, remoteAuth
        })

        Axios.get('https://www.guidedcompass.com/api/notifications', { params: { emailId: email } })
        .then((response) => {

            if (response.data.success) {
              console.log('Notification query worked', response.data);

              this.setState({ notifications: response.data.notifications })
              this.clearUnreadNotifications(response.data.notifications)

            } else {
              console.log('no notifications found', response.data.message)
            }

        }).catch((error) => {
            console.log('Notifications query did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  clearUnreadNotifications(notifications) {
    console.log('clearUnreadNotifications called')
    let unreadNotificationIds = [];

    for (let i = 1; i <= notifications.length; i++) {
      console.log(i);

      if (notifications[i - 1].isRead === false) {
        unreadNotificationIds.push(notifications[i - 1]._id)
      }
    }

    for (let i = 1; i <= unreadNotificationIds.length; i++) {
      console.log(i);

      Axios.put('https://www.guidedcompass.com/api/notifications/read', {
        notificationIds: unreadNotificationIds })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Notification update worked', response.data);

          AsyncStorage.setItem('unreadNotificationsCount', 0)

        } else {
          console.log('there was an error updating the notifications', response.data.message);
        }
      }).catch((error) => {
          console.log('Notification update did not work', error);
      });
    }
  }

  renderNotifications() {
    console.log('renderNotifications called')

    let rows = [];

    for (let i = 1; i <= this.state.notifications.length; i++) {
      console.log(i);

      const index = i - 1

      let message = ''
      let notiPath = 'Logs'

      let objectId = ''
      let additionalItem = ''

      let notiDate = ''
      if (this.state.notifications[i - 1].createdAt) {
        notiDate = this.state.notifications[i - 1].createdAt.substring(0,10)
      }

      let senderName = this.state.notifications[i - 1].senderFirstName + ' ' + this.state.notifications[i - 1].senderLastName
      if (this.state.notifications[i - 1].orgName) {
        senderName = this.state.notifications[i - 1].orgName
      } else if (!this.state.notifications[i - 1].senderFirstName) {
        senderName = 'Error Getting Name'
      }

      if (this.state.notifications[i - 1].type === 'Advisor Request') {

        if ( this.state.notifications[i - 1].isDecided === true ) {

          if (this.state.notifications[i - 1].isApproved === true ) {
            message = 'career advisor request was approved'
          } else {
            message = 'career advisor request was denied'
          }
        } else {
          message = 'requests to be your career advisor'
        }
      } else {

        message = this.state.notifications[i - 1].message

        if (this.state.notifications[index].type === 'Track Approval') {
          objectId = this.state.notifications[i - 1].objectId
          notiPath = 'OpportunityDetails'

          // '/app/postings/' + this.state.selectedPosting._id + '/tracks/' + approvedTracks[i - 1].name.replace(/ /g, "-").toLowerCase()
          // state: { programTitle: this.state.selectedPosting.title, trackName: approvedTracks[i - 1].name, orgName: this.state.selectedPosting.orgName, postings: approvedTracks[i - 1].jobs } }}>
        } else if (this.state.notifications[index].type === 'Offer Received') {
          objectId = this.state.notifications[i - 1].objectId
          notiPath = 'OfferDetails'
        } else if (this.state.notifications[index].type === 'Program Feedback Received') {
          objectId = this.state.notifications[i - 1].objectId
          notiPath = 'EditLog'
          additionalItem = 'Native Application'
        } else if (this.state.notifications[index].type === 'Employer Feedback Received') {
          objectId = this.state.notifications[i - 1].objectId
          notiPath = 'EditLog'
          additionalItem = 'Native Application'
        } else if (this.state.notifications[index].type === 'Endorsement Received') {
          objectId = ''
          notiPath = 'Endorsements'
          additionalItem = ''
        } else if (this.state.notifications[index].type === 'Endorsement Request') {
          objectId = this.state.notifications[index].objectId
          notiPath = 'RequestEndorsements'
          additionalItem = ''
        } else if (this.state.notifications[index].type && this.state.notifications[index].type.includes('Feedback on Project')) {
          objectId = this.state.notifications[index].objectId
          notiPath = 'EditProfile'
          additionalItem = ''
          AsyncStorage.setItem('objectId', objectId)
        } else if (this.state.notifications[index].type === 'Tagged in Post') {
          objectId = this.state.notifications[index].objectId
          notiPath = 'Home'
        }
      }

      if (this.props.fromAdvisor) {

        notiPath = 'Sessions'

        if (this.state.notifications[i - 1].type === 'Advisor Request') {

          if ( this.state.notifications[i - 1].isDecided === true ) {

            if (this.state.notifications[i - 1].isApproved === true ) {
              message = 'career advisor request was approved'
            } else {
              message = 'career advisor request was denied'
            }
          } else {
            message = 'requests to be your career advisor'
          }
        } else {

          message = this.state.notifications[i - 1].message

          if (this.state.notifications[index].type === 'Track Approval') {
            objectId = this.state.notifications[i - 1].objectId
            notiPath = 'OpportunityDetails'
          } else if (this.state.notifications[index].type === 'Endorsement Received') {
            objectId = ''
            notiPath = 'Endorsements'
            additionalItem = ''
          } else if (this.state.notifications[index].type === 'Endorsement Request') {
            objectId = this.state.notifications[index].objectId
            notiPath = 'ProvideEndorsement'
            additionalItem = ''
          } else if (this.state.notifications[index].type === 'Mentor-Mentee Pairing') {
            objectId = ''
            notiPath = 'Home'
          } else if (this.state.notifications[index].type && this.state.notifications[index].type.includes('Requested')) {
            objectId = this.state.notifications[index].objectId
            notiPath = 'OpportunityDetails'
          } else if (this.state.notifications[index].type &&this.state.notifications[index].type.includes('Status Update')) {
            objectId = this.state.notifications[index].objectId
            notiPath = 'OpportunityDetails'
          } else {
            console.log('testerson 2', this.state.notifications[index].type)
          }
        }
      }

      rows.push(
        <TouchableOpacity onPress={() => this.props.navigation.navigate(notiPath, { objectId, passedLogType: additionalItem })}>
          <View key={i} style={this.state.notifications[index].isRead ? [styles.row5,styles.lightHorizontalLine] : [styles.row5,styles.primaryBackgroundSuperLight,styles.lightHorizontalLine]} >
            <View style={[styles.spacer]} />
            <View style={[styles.rowDirection]}>
              <View style={[styles.width40]}>
                <View style={[styles.spacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                <Image source={{ uri: notificationsIconBlue}} style={[styles.square30,styles.contain]}/>
              </View>

              <View style={[styles.calcColumn130]}>
                <Text style={[styles.headingText5]}>{senderName}</Text>

                <View style={[styles.halfSpacer]} />
                <Text style={[styles.descriptionTextColor]}>{message}</Text>
              </View>

              <View style={[styles.width30]}>
                <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                <View style={[styles.alignEnd]}>
                  <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square16,styles.contain]} />
                </View>

              </View>

            </View>

            <View style={[styles.leftMargin40,styles.topPadding5]}>
              <Text style={[styles.descriptionText2,styles.descriptionTextColor]}>{notiDate}</Text>
            </View>

            <View style={[styles.spacer]} />

            <View style={[styles.spacer]} />
          </View>
        </TouchableOpacity>
      )
    }

    return rows;

  }

  render() {

    return (
        <ScrollView>
          <View>
            { (this.state.notifications.length > 0) ? (
              <View style={[styles.card,styles.topMargin20]}>
                {this.renderNotifications()}
              </View>
            ) : (
              <View style={[styles.card,styles.topMargin20,styles.flexCenter]}>
                <Image source={{ uri: storyIconBig}} style={[styles.width120,styles.contain]}/>
                <Text style={[styles.headingText3]}>No Notifications</Text>
                <Text style={[styles.standardText,styles.descriptionTextColor]}>You do not have any notifications.</Text>
              </View>
            )}
          </View>
        </ScrollView>

    )
  }
}

export default Notifications;
