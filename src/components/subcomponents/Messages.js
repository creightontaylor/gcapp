import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator, TextInput, Keyboard, KeyboardAvoidingView,TouchableWithoutFeedback } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

const editIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/edit-icon-dark.png';
const commentIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/comment-icon-dark.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const addIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';

import {convertDateToString} from '../functions/convertDateToString';
// const scrollRef = React.createRef();
class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
      newMessage: true,
      viewIndex: 0
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.filterResults = this.filterResults.bind(this)
    this.searchItemClicked = this.searchItemClicked.bind(this)
    this.sendMessage = this.sendMessage.bind(this)
    this.selectInbox = this.selectInbox.bind(this)
    this.clearUnreadMessages = this.clearUnreadMessages.bind(this)


    // this.ScrollView = React.createRef();

  }

  componentDidMount() {
    console.log('messages component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in messaging')

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData()
    } else if (this.props.groupPost !== prevProps.groupPost || this.props.newMessage !== prevProps.newMessage) {
      this.retrieveData()
    } else if (this.props.generalPost !== prevProps.generalPost) {
      this.retrieveData()
    } else if (this.props.recipient !== prevProps.recipient) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      // console.log('this is causing the error')
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
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        // this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
        //   roleName, activeOrg, orgFocus, orgName, remoteAuth
        // })

        const groupPost = this.props.groupPost
        const generalPost = this.props.generalPost
        let passedNewMessage = true
        if (this.props.newMessage) {
          passedNewMessage = this.props.newMessage
        }

        const passedRecipient = this.props.recipient

        let messageDraft = null
        if (groupPost) {
          console.log('in group post')
          if (groupPost.groupName) {
            messageDraft = 'Check out the latest post in ' + groupPost.groupName + ': https://www.guidedcompass.com/app/groups/' + groupPost.groupId
          } else {
            messageDraft = 'Check out the latest post in https://www.guidedcompass.com/app/groups/' + groupPost.groupId
          }
        }
        if (generalPost) {
          console.log('in general post')
          messageDraft = 'Check out this post: https://www.guidedcompass.com/app/social-posts/' + generalPost._id
        }

        if (passedRecipient) {
          const searchString = passedRecipient.firstName + ' ' + passedRecipient.lastName
          this.setState({
            emailId: email, username, cuFirstName, cuLastName, roleName, activeOrg, groupPost, newMessage: true,
            messageDraft, searchString, recipient: passedRecipient, viewIndex: 1
          })
        } else {
          this.setState({
            emailId: email, username, cuFirstName, cuLastName, roleName, activeOrg, groupPost, newMessage: passedNewMessage, messageDraft
          })
        }

        this.props.navigation.setOptions({ headerRight: () => (
          <TouchableOpacity onPress={() => this.setState({ newMessage: true, recipient: null, inboxSelected: null, messages: null, searchString: '', viewIndex: 1 })}>
            <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
            <Image source={{ uri: addIconBlue }} style={[styles.square15,styles.contain]}/>
          </TouchableOpacity>
        )})

        Axios.get('https://www.guidedcompass.com/api/inboxes', { params: { emailId: email} })
        .then((response) => {
          console.log('Inboxes query attempted', response.data);

           if (response.data.success) {
             console.log('successfully retrieved inboxes')

             const inboxes = response.data.inboxes
             if (inboxes && inboxes.length > 0) {

               if (groupPost || generalPost || passedNewMessage) {
                 console.log('group post, general post, or new message')
                 this.setState({ inboxes })

               } else {
                 console.log('checkers', passedRecipient)
                 if (passedRecipient) {

                   let inboxSelected = null
                   let members = []
                   let recipient = null
                   for (let i = 1; i <= inboxes.length; i++) {
                     for (let j = 1; j <= inboxes[i - 1].members.length; j++) {
                       if (passedRecipient.email === inboxes[i - 1].members[j - 1].email) {
                         inboxSelected = i - 1
                         members = inboxes[i - 1].members
                         recipient = {
                           firstName: members[j - 1].firstName,
                           lastName: members[j - 1].lastName,
                           email: members[j - 1].email,
                           pictureURL: members[j - 1].pictureURL,
                           username: members[j - 1].username,
                           roleName: members[j - 1].roleName
                         }

                         if (inboxes[i - 1].unreadCount) {
                           this.clearUnreadMessages(inboxes[i - 1], i - 1)
                         }
                       }
                     }
                   }

                   if (recipient) {
                     console.log('current recipient sf')

                     Axios.get('https://www.guidedcompass.com/api/messages', { params: { emailId: email, members } })
                     .then((response) => {
                       console.log('Messages query attempted', response.data);

                        if (response.data.success) {
                          console.log('successfully retrieved messages')

                          const messages = response.data.messages

                          this.setState({ inboxes, inboxSelected, recipient, messages, newMessage: false })
                          this.scrollToBottom();

                        } else {
                          console.log('no messages found', response.data.message)
                          this.setState({ errorMessage: response.data.message })
                        }

                     }).catch((error) => {
                        console.log('Message query did not work', error);
                     });

                   } else {
                     console.log('attach passed recipient')
                     const searchString = passedRecipient.firstName + ' ' + passedRecipient.lastName
                     this.setState({ newMessage: true, searchString, recipient: passedRecipient, inboxes })
                   }

                 } else {
                   console.log('no recipient')

                   const inboxSelected = 0
                   const members = inboxes[inboxSelected].members
                   let recipient = null

                   for (let i = 1; i <= members.length; i++) {
                     if (members[i - 1].email !== email) {
                       recipient = {
                         firstName: members[i - 1].firstName, lastName: members[i - 1].lastName,
                         email: members[i - 1].email, pictureURL: members[i - 1].pictureURL, username: members[i - 1].username,
                         roleName: members[i - 1].roleName
                       }
                     }
                   }

                   if (inboxes[inboxSelected].unreadCount) {
                     this.clearUnreadMessages(inboxes[inboxSelected], 0)
                   }

                   Axios.get('https://www.guidedcompass.com/api/messages', { params: { emailId: email, members } })
                   .then((response) => {
                     console.log('Messages query attempted', response.data);

                      if (response.data.success) {
                        console.log('successfully retrieved messages')

                        const messages = response.data.messages
                        let newMessage = false

                        this.setState({ inboxes, inboxSelected, recipient, messages, newMessage })
                        this.scrollToBottom();

                      } else {
                        console.log('no messages found', response.data.message)
                        this.setState({ errorMessage: response.data.message })
                      }

                   }).catch((error) => {
                      console.log('Message query did not work', error);
                   });
                 }
               }
             }

           } else {
             console.log('no inboxes found', response.data.message)
             this.setState({ errorMessage: response.data.message })

           }

        }).catch((error) => {
           console.log('Inboxes query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
        .then((response) => {
          console.log('Profile query attempted', response.data);

           if (response.data.success) {
             console.log('successfully retrieved profile information')

             const pictureURL = response.data.user.pictureURL
             const headline = response.data.user.headline
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
             const jobTitle = response.data.user.jobTitle
             const employerName = response.data.user.employerName
             const notificationPreferences = response.data.user.notificationPreferences

             this.setState({ pictureURL, headline, schoolName, jobTitle, employerName, notificationPreferences })

           } else {
             console.log('no profile data found', response.data.message)
           }

        }).catch((error) => {
           console.log('Profile query did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler = (eventName,eventValue) => {
    console.log('formChangeHandler called')

    if (eventName === 'search') {
      console.log('in search')
      const searchString = eventValue
      this.setState({ searchString, recipient: null, animating: true })
      this.filterResults(eventValue, null, null, true)

    } else {
      this.setState({ [eventName]: eventValue })
    }
  }

  filterResults(searchString, filterName, filterValue, search) {
    console.log('filterResults called', searchString, filterName, filterValue, search)

    let roleNames = ['Student','Career-Seeker','Mentor']
    if (this.state.userType === 'Mentors') {
      roleNames = ['Mentor']
    }

    const self = this
    function officiallyFilter() {
      console.log('officiallyFilter called')

      const orgCode = self.state.activeOrg
      const excludeCurrentUser = true
      const emailId = self.state.emailId

      Axios.get('https://www.guidedcompass.com/api/members/search', { params: { searchString, orgCode, roleNames, excludeCurrentUser, emailId } })
      .then((response) => {
        console.log('Opportunity search query attempted', response.data);

          if (response.data.success) {
            console.log('opportunity search query worked')

            let memberOptions = response.data.members
            self.setState({ memberOptions, filteredResults: true, animating: false })

          } else {
            console.log('opportunity search query did not work', response.data.message)

            let memberOptions = []
            self.setState({ memberOptions, animating: false })

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

  searchItemClicked(passedItem, type) {
    console.log('searchItemClicked called', passedItem, type)

    if (type === 'member') {

      let searchString = passedItem.firstName + ' ' + passedItem.lastName
      const memberOptions = null

      this.setState({ recipient: passedItem, searchString, memberOptions })

      this.selectInbox(passedItem)

    }
  }

  sendMessage() {
    console.log('sendMessage called')

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    if (!this.state.recipient) {
      this.setState({ errorMessage: 'Please add a recipient', isSaving: false })
    } else {

      const emailId = this.state.emailId
      const message = this.state.messageDraft

      const senderFirstName = this.state.cuFirstName
      const senderLastName = this.state.cuLastName
      const senderEmail = this.state.emailId

      const senderPictureURL = this.state.pictureURL
      const senderHeadline = this.state.headline
      const senderUsername = this.state.username
      const senderSchoolName = this.state.schoolName
      const senderJobTitle = this.state.jobTitle
      const senderEmployerName = this.state.employerName

      const orgCode = this.state.activeOrg
      const accountCode = this.state.accountCode

      const recipients = [{
        firstName: this.state.recipient.firstName, lastName: this.state.recipient.lastName, email: this.state.recipient.email, pictureURL: this.state.recipient.pictureURL, username: this.state.recipient.username, roleName: this.state.recipient.roleName
      }]

      let members = [{ firstName: this.state.cuFirstName, lastName: this.state.cuLastName, email: this.state.emailId, pictureURL: this.state.pictureURL, username: this.state.username, roleName: this.state.roleName }]
      members = members.concat(recipients)

      let messageThreadURL = null
      if (!this.state.recipient.roleName || this.state.recipient.roleName === 'Student' || this.state.recipient.roleName === 'Career-Seeker') {
        messageThreadURL = 'https://www.guidedcompass.com/app/messaging'
      } else if (this.state.recipient.roleName === 'Advisor' || this.state.recipient.roleName === 'Teacher' || this.state.recipient.roleName === 'Mentor') {
        messageThreadURL = 'https://www.guidedcompass.com/advisor/messaging'
      } else if (this.state.recipientRoleName === 'WBLC' || this.state.recipient.roleName === 'Work-Based Learning Coordinator' || this.state.recipient.roleName === 'Admin') {
        messageThreadURL = 'https://www.guidedcompass.com/organizations/' + orgCode + '/messaging'
      } else if (this.state.recipientRoleName === 'Employer' || this.state.recipient.roleName === 'Employer Representative') {
        messageThreadURL = 'https://www.guidedcompass.com/employers/' + this.state.recipient.accountCode + '/messaging'
      }

      const createdAt = new Date()
      const updatedAt = new Date()

      const self = this
      function actuallySendMessage(unsubscribed) {
        console.log('actuallySendMessage called')

        Axios.post('https://www.guidedcompass.com/api/messages/send', {
          emailId, message, senderFirstName, senderLastName, senderEmail,
          senderPictureURL, senderHeadline, senderUsername, senderSchoolName, senderJobTitle, senderEmployerName,
          orgCode, accountCode, recipients, members, messageThreadURL, unsubscribed,
          createdAt, updatedAt
        })
        .then((response) => {
          console.log('attempting to save addition to groups', message, senderEmail)

          if (response.data.success) {
            console.log('saved addition to groups', response.data)

            const inboxObject = response.data.inboxObject
            let inboxes = self.state.inboxes
            if (inboxObject) {
              if (inboxes) {
                inboxes.unshift(inboxObject)
              } else {
                inboxes = [inboxObject]
              }
            } else {
              inboxes[self.state.inboxSelected]['lastMessage'] = message
              inboxes[self.state.inboxSelected]['senderEmail'] = self.state.emailId
            }

            const returnedMessage = response.data.messageObject
            let messages = self.state.messages
            if (returnedMessage) {
              if (messages) {
                messages.push(returnedMessage)
              } else {
                messages = [returnedMessage]
              }
            }

            self.setState({ successMessage: null, isSaving: false, messageDraft: '', newMessage: false, inboxSelected: 0, messages, inboxes })
            self.scrollToBottom();

          } else {
            console.log('did not save successfully')
            self.setState({ errorMessage: 'returned error:' + response.data.message, isSaving: false })
          }
        }).catch((error) => {
            console.log('save did not work', error);
            self.setState({ errorMessage: 'there was an sending the message', error, isSaving: false})
        });
      }

      // check/update notification preferences assuming one recipient
      Axios.get('https://www.guidedcompass.com/api/users/profile/details/' + recipients[0].email, { params: { emailId: recipients[0].email } })
       .then((response) => {
         console.log('query for profile data worked');

         if (response.data.success) {

           console.log('profile data received', response.data)

           const notificationPreferences = response.data.user.notificationPreferences
           let unsubscribed = null
           if (notificationPreferences && notificationPreferences.length > 0) {
             for (let i = 1; i <= notificationPreferences.length; i++) {
               if (notificationPreferences[i - 1].slug === 'new-suggestions' && notificationPreferences[i - 1].enabled === false) {
                 unsubscribed = true
               }
             }
           }

           recipients[0]['notificationPreferences'] = notificationPreferences
           actuallySendMessage(unsubscribed, recipients)

         } else {
           console.log('error response', response.data)

           actuallySendMessage(null)
         }

      }).catch((error) => {
           console.log('query for profile info did not work', error);
      })

    }
  }

  selectInbox(item, index) {
    console.log('selectInbox called', index)

    this.setState({ isLoading: true, errorMessage: null, successMessage: null })

    if (index > -1) {
      // const members = this.state.inboxes[index].members

      // let recipient = null
      // for (let i = 1; i <= members.length; i++) {
      //   if (members[i - 1].email !== this.state.emailId) {
      //     recipient = {
      //       firstName: members[i - 1].firstName, lastName: members[i - 1].lastName,
      //       email: members[i - 1].email, pictureURL: members[i - 1].pictureURL, username: members[i - 1].username
      //     }
      //   }
      // }

      // Axios.get('https://www.guidedcompass.com/api/messages', { params: { emailId: this.state.emailId, members } })
      // .then((response) => {
      //   console.log('Messages query attempted', response.data);
      //
      //    if (response.data.success) {
      //      console.log('successfully retrieved messages')
      //
      //      const messages = response.data.messages
      //      this.setState({ inboxSelected: index, recipient, messages, isLoading: false, newMessage: false })
      //
      //    } else {
      //      console.log('no messages found', response.data.message)
      //      this.setState({ isLoading: false })
      //    }
      //
      // }).catch((error) => {
      //    console.log('Message query did not work', error);
      //    this.setState({ isLoading: false })
      // });
    } else {
      console.log('searching for rep')
      if (this.state.inboxes) {
        console.log('t1')
        for (let i = 1; i <= this.state.inboxes.length; i++) {
          console.log('t2', item.email, this.state.inboxes[i - 1].members)
          if (this.state.inboxes[i - 1].members.some(m => m.email === item.email)) {
            console.log('t3')
            index = i - 1

          }
        }
      }
      console.log('rep: ', index)
    }

    if (index > -1) {
      console.log('show index 2: ', index)

      if (this.state.inboxes[index].unreadCount) {
        this.clearUnreadMessages(this.state.inboxes[index], index)
      }

      const members = this.state.inboxes[index].members
      let recipient = null
      for (let i = 1; i <= members.length; i++) {
        if (members[i - 1].email !== this.state.emailId) {
          recipient = {
            firstName: members[i - 1].firstName, lastName: members[i - 1].lastName,
            email: members[i - 1].email, pictureURL: members[i - 1].pictureURL, username: members[i - 1].username,
            roleName: members[i - 1].roleName
          }
        }
      }

      Axios.get('https://www.guidedcompass.com/api/messages', { params: { emailId: this.state.emailId, members } })
      .then((response) => {
        console.log('Messages query attempted', response.data);

         if (response.data.success) {
           console.log('successfully retrieved messages')

           const messages = response.data.messages
           this.setState({ inboxSelected: index, recipient, messages, viewIndex: 1, isLoading: false, newMessage: false })
           this.scrollToBottom();

         } else {
           console.log('no messages found', response.data.message)
           this.setState({ isLoading: false })
         }

      }).catch((error) => {
         console.log('Message query did not work', error);
         this.setState({ isLoading: false })
      });
    }
  }

  scrollToBottom = () => {
    console.log('scrollToBottom called')

    // this.refs.scrollView0.scrollTo(0);
    // this.ScrollView.scrollToEnd({animated: true})
    // scrollRef.current?.scrollToEnd({animated: true});
    // if (this.messagesEnd) {
    //   this.messagesEnd.scrollIntoView({ behavior: "smooth" });
    // }
  }

  clearUnreadMessages(selectedInbox, index) {
    console.log('clearUnreadMessages called', selectedInbox, index)

    const emailId = this.state.emailId

    Axios.put('https://www.guidedcompass.com/api/inboxes/clear-unread', { emailId, selectedInbox })
    .then((response) => {
      console.log('attempting to save addition to groups')

      if (response.data.success) {
        console.log('saved addition to groups', response.data)

        let inboxes = this.state.inboxes
        inboxes[index] = response.data.inbox
        this.setState({ inboxes })

      } else {
        console.log('did not save successfully')
        this.setState({ errorMessage: 'returned error:' + response.data.message })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ errorMessage: 'there was an error clearing unread messages', error })
    });
  }

  render() {

    return (
      <ScrollView>
        <KeyboardAvoidingView behavior="position" keyboardVerticalOffset={(Platform.OS === 'ios') ? 100 : 100}>
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
            <View style={[styles.whiteBackground,styles.standardBorder,styles.topMargin20,styles.flex1]}>
              <View style={[styles.rowDirection,styles.flex1,styles.ctaBorder]}>
                <View style={[styles.flex50]}>
                  <TouchableOpacity style={[styles.flex1]} onPress={() => this.setState({ viewIndex: 0 })}>
                    <View style={(this.state.viewIndex === 0) ? [styles.row10,styles.horizontalPadding10,styles.ctaBackgroundColor,styles.flexCenter] : [styles.row10,styles.horizontalPadding10,styles.flexCenter]}>
                      <Text style={(this.state.viewIndex === 0) ? [styles.standardText,styles.whiteColor] : [styles.standardText,styles.ctaColor]}>Inbox</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={[styles.flex50]}>
                  <TouchableOpacity style={[styles.flex1]} onPress={() => this.setState({ viewIndex: 1 })}>
                    <View style={(this.state.viewIndex === 1) ? [styles.row10,styles.horizontalPadding10,styles.ctaBackgroundColor,styles.flexCenter] : [styles.row10,styles.horizontalPadding10,styles.flexCenter]}>
                      <Text style={(this.state.viewIndex === 1) ? [styles.standardText,styles.whiteColor] : [styles.standardText,styles.ctaColor]}>Messages</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              {(this.state.viewIndex === 0) && (
                <View style={[styles.fullScreenWidth]}>
                  {/*
                  <View style={[styles.row10,styles.standardBorder,styles.horizontalPadding20,styles.rowDirection]}>
                    <View style={[styles.calcColumn65]}>
                      <Text style={[styles.descriptionText1,styles.boldText]}>Create New Message</Text>
                    </View>
                    <View style={[styles.width25]}>
                      <TouchableOpacity onPress={() => this.setState({ newMessage: true, recipient: null, inboxSelected: null, messages: null, searchString: '', viewIndex: 1 })}>
                        <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                        <Image source={{ uri: addIconBlue }} style={[styles.square15,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                  </View>*/}

                  <View>
                    {(this.state.inboxes && this.state.inboxes.length > 0) ? (
                      <View>
                        {this.state.inboxes.map((value, optionIndex) =>
                          <View key={value._id} style={(this.state.inboxSelected === optionIndex) ? [styles.fullScreenWidth,styles.primaryBackgroundSuperLight] : [styles.fullScreenWidth]}>
                            <TouchableOpacity style={[styles.topPadding,styles.bottomPadding20,styles.horizontalPadding10]} disabled={this.state.isLoading} onPress={() => this.selectInbox(value, optionIndex)}>
                              {(value.members.length === 2) && (
                                <View>
                                  {value.members.map((value2, optionIndex2) =>
                                    <View key={value._id}>
                                      {(value2.email !== this.state.emailId) && (
                                        <View style={[styles.leftPadding,styles.topPadding,styles.rowDirection]}>
                                          <View style={[styles.width50]}>
                                            <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                            <Image source={(value2.pictureURL) ? { uri: value2.pictureURL} : { uri: profileIconDark}} style={[styles.square40,styles.contain,{ borderRadius: 20 }]} />
                                          </View>
                                          <View style={[styles.calcColumn140]}>
                                            <Text>{value2.firstName} {value2.lastName}</Text>
                                            <Text style={[styles.descriptionText4,styles.height20,styles.descriptionTextColor]}>{(value.senderEmail === this.state.emailId) ? "You: " + value.lastMessage : value2.firstName + ': ' + value.lastMessage}</Text>
                                          </View>
                                          <View style={[styles.width50]}>
                                            <Text style={[styles.descriptionText5,styles.boldText,styles.descriptionTextColor,styles.rightText]}>{convertDateToString(value.createdAt,"daysAgo")}</Text>
                                          </View>
                                        </View>
                                      )}

                                    </View>
                                  )}
                                </View>
                              )}
                            </TouchableOpacity>

                            <View style={[styles.horizontalLine]} />
                          </View>
                        )}
                      </View>
                    ) : (
                      <View style={[styles.flex1,styles.flexCenter, styles.padding40]}>
                        <Image source={{ uri: commentIconGrey}} style={[styles.square40,styles.contain]}/>
                        <View>
                          <Text style={[styles.topPadding20,styles.descriptionText1,styles.descriptionTextColor,styles.horizontalPadding30,styles.centerText]}>No Conversations Yet</Text>
                        </View>
                      </View>
                    )}
                  </View>
                </View>
              )}
              {(this.state.viewIndex === 1) && (
                <View>
                  <View style={[styles.fullScreenWidth]}>
                    <View style={[styles.row10,styles.standardBorder,styles.horizontalPadding10]}>
                      {(this.state.newMessage) ? (
                        <Text style={[styles.descriptionText1,styles.centerText]}>New Message</Text>
                      ) : (
                        <View>
                          {(this.state.recipient) && (
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.recipient.username })} style={[styles.rowDirection]}>
                              <View style={[styles.width30]}>
                                <Image source={(this.state.recipient.pictureURL) ? { uri: this.state.recipient.pictureURL} : { uri: profileIconDark}} style={[styles.square20,styles.contain, {borderRadius: 10}]} />
                              </View>
                              <View style={[styles.calcColumn50]}>
                                <Text style={[styles.descriptionText2,styles.height20,styles.boldText]}>{this.state.recipient.firstName} {this.state.recipient.lastName}</Text>
                              </View>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </View>

                    {(this.state.newMessage) && (
                      <View style={[styles.row10,styles.standardBorder,styles.horizontalPadding10]}>
                        {(this.state.recipient) ? (
                          <View style={[styles.rowDirection]}>
                            <View style={[styles.width25]}>
                              <Image source={(this.state.recipient.pictureURL) ? { uri: this.state.recipient.pictureURL} : { uri: profileIconDark}} style={[styles.square20,styles.contain, {borderRadius: 10}]} />
                            </View>
                            <View style={[styles.calcColumn45]}>
                              <TextInput
                                style={styles.height20,styles.descriptionText3,styles.boldText}
                                onChangeText={(text) => this.formChangeHandler('search', text)}
                                value={this.state.searchString}
                                placeholder={"Type a name"}
                                placeholderTextColor="grey"
                              />
                            </View>

                          </View>
                        ) : (
                          <View>
                            <TextInput
                              style={styles.height20,styles.descriptionText3,styles.boldText}
                              onChangeText={(text) => this.formChangeHandler('search', text)}
                              value={this.state.searchString}
                              placeholder={"Type a name"}
                              placeholderTextColor="grey"
                            />
                          </View>
                        )}

                        {(this.state.animating) ? (
                          <View style={[styles.flex1,styles.flexCenter]}>
                            <View>
                              <View style={[styles.superSpacer]} />

                              <ActivityIndicator
                                 animating = {this.state.animating}
                                 color = '#87CEFA'
                                 size = "large"
                                 style={[styles.square80, styles.centerHorizontally]}/>

                              <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                              <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                            </View>
                          </View>
                        ) : (
                          <View>
                            {(this.state.memberOptions && this.state.memberOptions.length > 0) && (
                              <View>
                                {this.state.memberOptions.map((value, optionIndex) =>
                                  <View key={value._id} style={[styles.calcColumn80,styles.bottomMargin]}>
                                    <TouchableOpacity onPress={() => this.searchItemClicked(value, 'member',optionIndex)}>
                                      <View style={[styles.leftPadding,styles.calcColumn80,styles.rowDirection]}>
                                        <View style={[styles.rightPadding]}>
                                          <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                          <Image source={(value.pictureURL) ? { uri: value.pictureURL} : { uri: profileIconDark}} style={[styles.square25,styles.contain,{ borderRadius: 12.5 }]} />
                                        </View>
                                        <View>
                                          <Text style={[styles.ctaColor]}>{value.firstName} {value.lastName}</Text>
                                          <Text style={[styles.descriptionText3]}>{value.roleName}</Text>
                                        </View>
                                      </View>
                                    </TouchableOpacity>
                                  </View>
                                )}
                              </View>
                            )}
                          </View>
                        )}
                      </View>
                    )}

                    <View style={[styles.row10,styles.standardBorder,styles.horizontalPadding10,styles.calcHeight500]}>
                      {(this.state.messages && this.state.messages.length > 0) ? (
                        <ScrollView style={[styles.flex1,styles.overflowY]} ref={ref => {this.scrollView = ref}} onContentSizeChange={() => this.scrollView.scrollToEnd({animated: true})}>
                          {this.state.messages.map((value, optionIndex) =>
                            <View key={value._id} style={[styles.bottomPadding20]}>
                              {(value.senderEmail === this.state.emailId) ? (
                                <View style={[styles.leftPadding,styles.topPadding,styles.rowDirection]}>
                                  <View style={[styles.width50]}>
                                    <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.username })}>
                                      <Image source={(this.state.pictureURL) ? { uri: this.state.pictureURL} : { uri: profileIconDark}} style={[styles.square40,styles.contain,{ borderRadius: 20 }]} />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={[styles.calcColumn140]}>
                                    <View style={[styles.bottomMargin5]}>
                                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.username })}>
                                        <Text style={[styles.descriptionText2,styles.boldText]}>{this.state.cuFirstName} {this.state.cuLastName}</Text>
                                      </TouchableOpacity>
                                    </View>

                                    <Text style={[styles.descriptionText3]}>{value.message}</Text>
                                  </View>
                                  <View style={[styles.width50]}>
                                    <Text style={[styles.descriptionText5,styles.boldText,styles.descriptionTextColor,styles.topPadding,styles.rightText]}>{convertDateToString(value.createdAt,"daysAgo")}</Text>
                                  </View>

                                </View>
                              ) : (
                                <View style={[styles.leftPadding,styles.topPadding,styles.rowDirection]}>
                                  <View style={[styles.width50]}>
                                    <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.recipient.username })}>
                                      <Image source={(this.state.recipient.pictureURL) ? { uri: this.state.recipient.pictureURL} : { uri: profileIconDark}} style={[styles.square40,styles.contain,{ borderRadius: 20 }]} />
                                    </TouchableOpacity>
                                  </View>
                                  <View style={[styles.calcColumn130]}>
                                    <View style={[styles.rowDirection]}>
                                      <View style={[styles.calcColumn180]}>
                                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.recipient.username })}>
                                          <Text style={[styles.descriptionText2,styles.boldText]}>{this.state.recipient.firstName} {this.state.recipient.lastName}</Text>
                                        </TouchableOpacity>
                                      </View>
                                      <View style={[styles.width50]}>
                                        <Text style={[styles.descriptionText5,styles.boldText,styles.descriptionTextColor,styles.topPadding]}>{convertDateToString(value.createdAt,"daysAgo")}</Text>
                                      </View>

                                    </View>

                                    <Text style={[styles.descriptionText3]}>{value.message}</Text>
                                  </View>

                                </View>
                              )}
                            </View>
                          )}
                        </ScrollView>
                      ) : (
                        <View style={[styles.flex1]}>
                          {(this.state.recipient) && (
                            <View style={[styles.flex1]}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.recipient.username })} style={[styles.flex1,styles.flexCenter]}>
                                <Image source={(this.state.recipient.pictureURL) ? { uri: this.state.recipient.pictureURL} : { uri: profileIconDark}} style={[styles.square60,styles.contain, { borderRadius: 30 }]} />
                                <View>
                                  <Text style={[styles.topPadding,styles.headingText6,styles.horizontalPadding30,styles.centerText]}>{this.state.recipient.firstName} {this.state.recipient.lastName}</Text>
                                  <Text style={[styles.descriptionText3,styles.centerText,styles.topPadding]}>You two are not following each other.</Text>
                                </View>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                    <View style={[styles.row10,styles.standardBorder,styles.horizontalPadding10,styles.height120]}>
                      <TextInput
                        style={[styles.textArea,styles.descriptionText3]}
                        onChangeText={(text) => this.formChangeHandler("messageDraft", text)}
                        value={this.state.messageDraft}
                        placeholder="Write a message..."
                        placeholderTextColor="grey"
                        multiline={true}
                        numberOfLines={4}
                      />
                    </View>
                    <View style={[styles.row10,styles.standardBorder,styles.horizontalPadding10,styles.height100]}>
                      <TouchableOpacity style={(this.state.messageDraft && this.state.messageDraft !== '') ? [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter] : [styles.btnSquarish,styles.mediumBackground,styles.standardBorder,styles.flexCenter]} disabled={(this.state.messageDraft && this.state.messageDraft !== '' && !this.state.isSaving) ? false : true} onPress={() => this.sendMessage()}><Text style={[styles.descriptionText1,styles.whiteColor]}>Send</Text></TouchableOpacity>

                      {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.descriptionText3,styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                      {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.descriptionText3,styles.ctaColor,styles.row5]}>{this.state.successMessage}</Text>}

                    </View>
                  </View>

                </View>
              )}
            </View>
          </TouchableWithoutFeedback>
        </KeyboardAvoidingView>
      </ScrollView>
    )
  }

}

export default Messages;
