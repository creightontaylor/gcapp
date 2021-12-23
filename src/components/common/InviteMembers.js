import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator } from 'react-native';

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

    retrieveData() {
      console.log('retrieveData called within switchOrgs', this.props.accountCode)

      let emailId = localStorage.getItem('email');
      let username = localStorage.getItem('username');
      let cuFirstName = localStorage.getItem('firstName');
      let cuLastName = localStorage.getItem('lastName');
      let roleName = localStorage.getItem('roleName');
      let activeOrg = localStorage.getItem('activeOrg');
      let orgName = localStorage.getItem('orgName');
      if (this.props.orgName && !orgName) {
        orgName = this.props.orgName
      }

      let inviteLink = window.location.protocol + "//" + window.location.host + "/organizations/" + activeOrg + "/student/join"

      this.setState({ emailId, username, cuFirstName, cuLastName, roleName, activeOrg, orgName, inviteLink })

      Axios.get('/api/org/members', { params: { orgCode: activeOrg, limit: 1000 } })
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

    }

    formChangeHandler(event) {
      console.log('formChangeHandler called')

      this.setState({ [event.target.name]: event.target.value })
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

          Axios.post('/api/members/invite', {
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
        <div>
          <div className="bottom-padding">
            <div className="calc-column-offset-30">
              <p className="heading-text-2">Invite People to {this.state.orgName}</p>
            </div>
            <div className="fixed-column-30 top-padding-5">
              <button className="background-button" onClick={() => this.props.closeModal()}>
                <img src={closeIcon} alt="GC" className="image-auto-20" />
              </button>
            </div>

            <div className="clear" />
          </div>

          <div className="spacer" /><div className="spacer" />

          <p className="description-text-2 bold-text bottom-padding-5">To:</p>
          <textarea className="text-field" type="text" placeholder="name@gmail.com" name="recipientEmail" value={this.state.recipientEmail} onChange={this.formChangeHandler} />

          <div className="spacer" />

          {(this.state.successMessage) && <p className="row-5 cta-color description-text-2">{this.state.successMessage}</p>}
          {(this.state.errorMessage) && <p className="row-5 error-color description-text-2">{this.state.errorMessage}</p>}

          <div className="top-padding-30">
            <div className="container-left-static top-padding">
              <button className="background-button" onClick={() => this.copyLink()}>
                <div className="fixed-column-30">
                  <img src={linkIconBlue} alt="GC" className="image-auto-20" />
                </div>
                <div className="calc-column-offset-30">
                  <p>Copy invite link</p>
                </div>
                <div className="clear" />
              </button>
            </div>
            <div className="container-right-static">
              <button className={(this.state.recipientEmail && this.state.recipientEmail !== '') ? "btn btn-squarish float-right" : "btn btn-squarish float-right medium-background standard-color standard-border no-pointers"} onClick={() => this.sendInvite()}>
                <p>Send</p>
              </button>
              <div className="clear" />
            </div>
            <div className="clear" />
          </div>
        </div>
      )
    }
}

export default InviteMembers
