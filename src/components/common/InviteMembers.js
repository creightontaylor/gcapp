import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Image, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

const linkIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon-blue.png'
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png'

class InviteMembers extends Component {
    constructor(props) {
      super(props)
      this.state = {
        memberCount: 0
      }

      this.retrieveData = this.retrieveData.bind(this)
      this.formChangeHandler = this.formChangeHandler.bind(this)
      this.copyLink = this.copyLink.bind(this)
      this.sendInvite = this.sendInvite.bind(this)

    }

    componentDidMount() {
      console.log('componentDidMount called')

      this.retrieveData()

    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called ', this.props.activeOrg, prevProps)

      if (this.props.orgName !== prevProps.orgName) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in renderPosts')

        const emailId = await AsyncStorage.getItem('email');
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
        if (this.props.orgName && !orgName) {
          orgName = this.props.orgName
        }

        let inviteLink = "https://www.guidedcompass.com/organizations/" + activeOrg + "/student/join"

        this.setState({ emailId, username, cuFirstName, cuLastName, roleName, activeOrg, orgName, inviteLink })

        Axios.get('https://www.guidedcompass.com/api/org/members', { params: { orgCode: activeOrg, limit: 1000 } })
        .then((response) => {
          console.log('Org members query attempted', response.data);

            if (response.data.success) {
              console.log('org members query worked')

              if (response.data.members && response.data.members.length > 0) {
                let memberCount = response.data.members.length
                if (memberCount === 1000) {
                  memberCount = 'Over 1,000'
                  this.setState({ memberCount })
                }
              }

            } else {
              console.log('org members query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Org members query did not work for some reason', error);
        });

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    formChangeHandler(eventName,eventValue) {
      console.log('formChangeHandler called')

      this.setState({ [eventName]: eventValue })
    }

    copyLink() {
      console.log('copyLink called')

      navigator.clipboard.writeText(this.state.inviteLink)
      this.setState({ errorMessage: null, successMessage: 'Link copied!'})

    }

    sendInvite() {
      console.log('sendInvite called')

      this.setState({ errorMessage: null, successMessage: null })

      if (this.state.recipientEmail && this.state.recipient !== '') {
        if (!this.state.recipientEmail.includes('@')) {
          this.setState({ errorMessage: "Please add a valid email" })
        } else {
          console.log('send the invite')

          const senderFirstName = this.state.cuFirstName
          const senderLastName = this.state.cuLastName
          const senderEmail = this.state.emailId
          const recipientEmails = [this.state.recipientEmail]
          const recipientType = 'Student'
          const joined = false
          const active = false
          const orgCode = this.state.activeOrg
          const orgName = this.state.orgName
          const memberCount = this.state.memberCount
          const inviteLink = this.state.inviteLink

          Axios.post('https://www.guidedcompass.com/api/members/invite', {
            senderFirstName, senderLastName, senderEmail, recipientEmails, recipientType, joined, active, orgCode, orgName,
            memberCount, inviteLink })
          .then((response) => {

            if (response.data.success) {
              const successMessage = this.state.recipientEmail + ' has been invited to join the ' + orgName + ' portal. They will then be able to connect with you and participate in opportunities.'

              //clear values
              this.setState({ successMessage, recipientEmail: '' })
            } else {

              this.setState({ errorMessage: response.data.message })

            }
          }).catch((error) => {
              console.log('Invite did not work', error);
              this.setState({ errorMessage: 'There was an error inviting the members' })
          });
        }
      }
    }

    render() {

      return (
        <ScrollView>
          <View style={[styles.padding20]}>
            <View style={[styles.topPadding30,styles.bottomPadding,styles.calcColumn120,styles.rowDirection]}>
              <View style={[styles.calcColumn115]}>
                <Text style={[styles.headingText2]}>Invite People to {this.state.orgName}</Text>
              </View>
              <View style={[styles.width30,styles.topPadding,styles.alignEnd]}>
                <TouchableOpacity onPress={() => this.props.closeModal()}>
                  <Image source={{ uri: closeIcon}} style={[styles.square20,styles.contain]} />
                </TouchableOpacity>
              </View>
            </View>

            <View style={[styles.spacer]} /><View style={[styles.spacer]} />

            <Text style={[styles.descriptionText2,styles.boldText,styles.bottomPadding5]}>To:</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler("recipientEmail", text)}
              value={this.state.recipientEmail}
              placeholder="name@gmail.com"
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={4}
            />

            <View style={[styles.spacer]} />

            {(this.state.successMessage) && <Text style={[styles.row5,styles.ctaColor,styles.descriptionText2]}>{this.state.successMessage}</Text>}
            {(this.state.errorMessage) && <Text style={[styles.row5,styles.errorColor,styles.descriptionText2]}>{this.state.errorMessage}</Text>}

            <View style={[styles.topPadding30]}>
              <View style={[styles.row10]}>
                <TouchableOpacity onPress={() => this.copyLink()} style={[styles.rowDirection]}>
                  <View style={[styles.width30]}>
                    <Image source={{ uri: linkIconBlue}} style={[styles.square20,styles.contain]} />
                  </View>
                  <View style={[styles.calcColumn150]}>
                    <Text>Copy invite link</Text>
                  </View>

                </TouchableOpacity>
              </View>
              <View style={[styles.row10]}>
                <TouchableOpacity style={(this.state.recipientEmail && this.state.recipientEmail !== '') ? [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter] : [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter]} onPress={() => this.sendInvite()}>
                  <Text style={[styles.whiteColor,styles.descriptionText1]}>Send</Text>
                </TouchableOpacity>
              </View>

            </View>
          </View>
        </ScrollView>
      )
    }
}

export default InviteMembers
