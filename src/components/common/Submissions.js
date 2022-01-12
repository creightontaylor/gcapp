import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch, Linking, TextInput, Image } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import {Picker} from '@react-native-picker/picker';

const profileIconBig = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-big.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const upvoteIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-blue.png';
const upvoteIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-grey.png';
const downvoteIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/downvote-icon-blue.png';
const downvoteIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/downvote-icon-grey.png';
const thumbsUpIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/thumbs-up-icon.png';
const thumbsUpIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/thumbs-up-blue-icon.png';
const commentIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/comment_icon_grey.png';
const editIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/edit-icon-grey.png';
const feedbackIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/feedback-icon-grey.png';
const feedbackIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/feedback-icon-blue.png';
const detailsIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/details-icon-grey.png';
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/dropdown-arrow.png';

import ProjectDetails from '../subcomponents/ProjectDetails';
import SubPicker from '../common/SubPicker';

class Submissions extends Component {
    constructor(props) {
        super(props)

        this.state = {
          submissionComments: [],
          mySubmissionComments: [],
          editSubmissionComments: [],
          myReplies: [],
          gradeOptions: [],

          selectedIndex: 0
        }

        this.retrieveData = this.retrieveData.bind(this)
        this.voteOnItem = this.voteOnItem.bind(this)
        this.renderSubmissions = this.renderSubmissions.bind(this)
        this.renderSubmissionComments = this.renderSubmissionComments.bind(this)
        this.renderReplies = this.renderReplies.bind(this)
        this.likeItem = this.likeItem.bind(this)
        this.editComment = this.editComment.bind(this)
        this.showReplies = this.showReplies.bind(this)
        this.showComments = this.showComments.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.formChangeHandler = this.formChangeHandler.bind(this)
        this.postComment = this.postComment.bind(this)
        this.saveFeedback = this.saveFeedback.bind(this)

    }

    componentDidMount() {

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called ', this.props.activeOrg, prevProps)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode || this.props.roleName !== prevProps.roleName) {
        this.retrieveData()
      } else if (this.props.selectedOpportunity !== prevProps.selectedOpportunity || this.props.orgFocus !== prevProps.orgFocus || this.props.activeOrg !== prevProps.activeOrg) {
        this.retrieveData()
      } else if (this.props.submissionComments !== prevProps.submissionComments) {
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
        if (this.props.activeOrg) {
          activeOrg = this.props.activeOrg
        }
        const orgFocus = await AsyncStorage.getItem('orgFocus');
        const roleName = await AsyncStorage.getItem('roleName');
        let pictureURL = await AsyncStorage.getItem('pictureURL');
        if (this.props.pictureURL) {
          pictureURL = this.props.pictureURL
        }

        const selectedOpportunity = this.props.selectedOpportunity
        const accountCode = this.props.accountCode
        const submissionComments = this.props.submissionComments

        const orgContactEmail = this.props.orgContactEmail
        const gradeOptions = this.props.gradeOptions

        let disableLinks = false
        if (selectedOpportunity) {
          const now = new Date()
          const submissionDeadlineDate = new Date(selectedOpportunity.submissionDeadline)
          const timeDifferenceUnadjusted = now.getTime() - submissionDeadlineDate.getTime()
          const timeZoneDifferenceMiliseconds = (submissionDeadlineDate.getTimezoneOffset()) * 60000
          const timeDifference = timeDifferenceUnadjusted - timeZoneDifferenceMiliseconds
          console.log('show timeDifference: ', timeDifference)
          if (timeDifference < 0) {
            disableLinks = true
          }
        }

        this.setState({ pictureURL, emailId, cuFirstName, cuLastName, orgFocus, roleName, selectedOpportunity, activeOrg,
          accountCode, submissionComments, gradeOptions, disableLinks, orgContactEmail,
        })

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    formChangeHandler(eventName,eventValue) {
      console.log('formChangeHandler called')

      if (eventName === 'comment') {
        this.setState({ myComment: eventValue })
      } else if (eventName.includes('reply')) {
        const nameArray = eventName.split("|")
        let myReplies = this.state.myReplies
        myReplies[Number(nameArray[1])] = eventValue
        this.setState({ myReplies })
      } else if (eventName.includes('submissionComment')) {
        const nameArray = eventName.split("|")
        let mySubmissionComments = this.state.mySubmissionComments
        mySubmissionComments[Number(nameArray[1])] = eventValue
        this.setState({ mySubmissionComments })
      } else if (eventName === 'myEditedComment') {
        this.setState({ myEditedComment: eventValue })
      } else if (eventName === 'myEditedSubmissionComment') {
        this.setState({ myEditedSubmissionComment: eventValue })
      } else if (eventName === 'grade') {
        let selectedOpportunity = this.state.selectedOpportunity
        selectedOpportunity['submissions'][this.state.selectedIndex1]['grades'][this.state.selectedIndex2]['grade'] = eventValue
        this.setState({ selectedOpportunity })
        console.log('show me grades: ', selectedOpportunity.submissions[this.state.selectedIndex1].grades)
      } else if (eventName === 'feedback') {
        let selectedOpportunity = this.state.selectedOpportunity
        selectedOpportunity['submissions'][this.state.selectedIndex1]['grades'][this.state.selectedIndex2]['feedback'] = eventValue
        this.setState({ selectedOpportunity })
      } else if (eventName === 'isTransparent') {
        let selectedOpportunity = this.state.selectedOpportunity
        selectedOpportunity['submissions'][this.state.selectedIndex1]['grades'][this.state.selectedIndex2]['isTransparent'] = eventValue
        console.log('show transparnet: ', eventValue, typeof eventValue)
        this.setState({ selectedOpportunity })
      }
    }

    closeModal() {
      this.setState({ modalIsOpen: false });
    }

    renderSubmissions() {
      console.log('renderSubmissions called', this.state.selectedOpportunity)

      let rows = []

      for (let i = 1; i <= this.state.selectedOpportunity.submissions.length; i++) {

        const index = i - 1
        console.log('showy: ', index, this.state.selectedOpportunity.submissions[index].downvotes, this.state.selectedOpportunity.submissions[index].upvotes)

        let userFullName = this.state.selectedOpportunity.submissions[i - 1].userFirstName + ' ' + this.state.selectedOpportunity.submissions[i - 1].userLastName
        if (this.state.selectedOpportunity.submissions[i - 1].anonymizeSubmissions) {
          userFullName = 'Anonymous Submitter'
        }

        let disabled = false
        if (this.state.selectedOpportunity.disableDownvoting === true) {
          disabled = true
        }

        let disableVoting = false
        if (this.state.disableVoting || this.state.savingVote) {
          disableVoting = this.state.disableVoting
          disabled = true

          //disable downvoting as well
          disabled = true
        }

        let submissionCommentCount = 0
        if (this.state.submissionComments) {
          for (let j = 1; j <= this.state.submissionComments.length; j++) {
            if (this.state.submissionComments[j - 1].parentSubmissionId === this.state.selectedOpportunity.submissions[index]._id) {
              submissionCommentCount = submissionCommentCount + 1
            }
          }
        }

        let existingGrade = false
        if (this.state.selectedOpportunity.submissions[index].grades) {
          for (let j = 1; j <= this.state.selectedOpportunity.submissions[index].grades.length; j++) {
            if (this.state.selectedOpportunity.submissions[index].grades[j - 1]._id && this.state.selectedOpportunity.submissions[index].grades[j - 1].contributorEmail === this.state.emailId) {
              existingGrade = true
            }
          }
        }

        let projectURL = this.state.selectedOpportunity.submissions[i - 1].url
        if (this.state.disableLinks) {
          projectURL = ""
        }

        rows.push(
          <View key={i}>

              <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />

              <View style={[styles.rowDirection]}>
                <View style={[styles.width30,styles.alignCenter]}>
                  <View>
                    <TouchableOpacity disabled={disableVoting} onPress={() => this.voteOnItem(this.state.selectedOpportunity.submissions[index], 'up', index) }>
                      {(this.state.selectedOpportunity.submissions[index].upvotes) ? (
                        <Image source={(this.state.selectedOpportunity.submissions[index].upvotes.includes(this.state.emailId)) ? { uri: upvoteIconBlue} : { uri: upvoteIconGrey}} style={(this.state.disableVoting || this.state.savingVote) ? [styles.square15,styles.contain,styles.washOut] : [styles.square15,styles.contain]}/>
                      ) : (
                        <Image source={{ uri: upvoteIconGrey}} style={(this.state.disableVoting || this.state.savingVote) ? [styles.square15,styles.contain,styles.washOut] : [styles.square15,styles.contain]}/>
                      )}
                    </TouchableOpacity>
                  </View>
                  <View>
                    {(this.state.selectedOpportunity.submissions[index].upvotes) ? (
                      <Text style={[styles.standardText]}>{this.state.selectedOpportunity.submissions[index].upvotes.length - this.state.selectedOpportunity.submissions[index].downvotes.length}</Text>
                    ) : (
                      <Text style={[styles.standardText]}>0</Text>
                    )}

                  </View>
                  <View>
                    <TouchableOpacity disabled={disabled} onPress={() => this.voteOnItem(this.state.selectedOpportunity.submissions[index], 'down', index) }>
                      {(this.state.selectedOpportunity.submissions[index].upvotes) ? (
                        <Image source={(this.state.selectedOpportunity.submissions[index].downvotes.includes(this.state.emailId)) ? { uri: downvoteIconBlue} : { uri: downvoteIconGrey}} style={(this.state.disableVoting || this.state.savingVote) ? [styles.square15,styles.contain,styles.washOut] : [styles.square15,styles.contain]}/>
                      ) : (
                        <Image source={{ uri: downvoteIconGrey}} style={(this.state.disableVoting || this.state.savingVote) ? [styles.square15,styles.contain,styles.washOut] : [styles.square15,styles.contain]}/>
                      )}
                    </TouchableOpacity>
                  </View>
                </View>
                <TouchableOpacity disabled={(this.state.disableLinks) ? true : false} onPress={(projectURL) ? () => Linking.openURL(projectURL) : () => console.log('link is invalid')} style={[styles.calcColumn90,styles.leftPadding,styles.rowDirection]}>

                  <View style={[styles.calcColumn120]}>
                    <Text style={[styles.headingText4]}>{this.state.selectedOpportunity.submissions[i - 1].name}</Text>

                    <Text style={[styles.descriptionText1]}>{userFullName}</Text>

                    <Text style={[styles.descriptionText1]}>{this.state.selectedOpportunity.submissions[i - 1].category} | {this.state.selectedOpportunity.submissions[i - 1].hours} Hours</Text>
                  </View>
                  <View style={[styles.width30]}>
                    <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                    <View>
                      <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]} />
                    </View>
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[styles.leftPadding30,styles.calcColumn90, styles.topPadding,styles.rowDirection]}>

                <TouchableOpacity style={[styles.rightPadding20]} onPress={() => this.showComments(index) }>


                  <View style={[styles.rowDirection]}>
                    <View style={[styles.horizontalMargin]}>
                      <Image source={{ uri: commentIconGrey}} style={[styles.square18,styles.contain]} />
                    </View>
                    <View>
                      <Text style={[styles.descriptionText2]}>{submissionCommentCount} Comments</Text>
                    </View>
                  </View>

                  <View style={[styles.halfSpacer]} />
                </TouchableOpacity>

                <View style={[styles.verticalSeparator15]} />

                <View>
                  <TouchableOpacity style={[styles.horizontalPadding20,styles.rowDirection ]} onPress={() => this.setState({ modalIsOpen: true, showProjectDetail: true, selectedIndex: index, showGrade: false, showComments: false, showJobFunction: false, showIndustry: false }) }>
                    <View style={[styles.rightMargin5]}>
                      <View>
                        <Image source={{ uri: detailsIconGrey}} style={[styles.square17,styles.contain]} />
                      </View>
                    </View>
                    <View>
                      <Text style={[styles.descriptionText2]}>View Details</Text>
                    </View>
                  </TouchableOpacity>

                  <View style={[styles.halfSpacer]} />
                </View>

              </View>


            <View style={[styles.spacer]} />
            <View style={[styles.lightHorizontalLine]} />

            <View style={[styles.spacer]} />
          </View>
        )
      }

      return rows
    }

    renderSubmissionComments(submissionIndex) {
      console.log('renderSubmissionComments called', submissionIndex, this.state.submissionComments)

      let rows = []
      let submissionComments = this.state.submissionComments

      if (submissionComments) {
        for (let i = 1; i <= submissionComments.length; i++) {
          const index = i - 1
          console.log('show submissionComment: ', submissionComments[i - 1])

          if (submissionComments[index].parentSubmissionId === this.state.selectedOpportunity.submissions[submissionIndex]._id) {

            let commentBackgroundColor = [styles.commentBackgroundStudent]
            if (submissionComments[i - 1].roleName === 'Mentor') {

              commentBackgroundColor = [styles.commentBackgroundMentor]
            } else if (submissionComments[i - 1].roleName === 'Employer') {

              commentBackgroundColor = [styles.commentBackgroundEmployer]
            } else if (submissionComments[i - 1].roleName === 'Teacher') {

              commentBackgroundColor = [styles.commentBackgroundTeacher]
            } else if (submissionComments[i - 1].roleName === 'Admin') {

              commentBackgroundColor = [styles.commentBackgroundAdmin]
            }

            let dateString = ''
            if (submissionComments[i - 1].createdAt) {
              dateString = submissionComments[i - 1].createdAt.toString().substring(0,10)
            }

            let showEditOption = false

            if (submissionComments[i - 1].email === this.state.emailId) {
              showEditOption = true
            }

            let disabled = true
            if (this.state.myEditedSubmissionComment) {
              disabled = false
            }

            rows.push(
              <View key={i}>
                <View style={[styles.spacer]} />

                <View style={[styles.rowDirection]}>
                  <View style={[styles.width48,styles.rightPadding8]}>
                    <Image source={(submissionComments[i - 1].pictureURL) ? { uri: submissionComments[i - 1].pictureURL} : { uri: profileIconBig}} style={[styles.square40,styles.contain, { borderRadius: 20 }]} />
                  </View>

                  <View style={[styles.calcColumn108, styles.roundedCorners,styles.transparentBorder,styles.padding10,commentBackgroundColor]}>
                    <View style={[styles.calcColumn108]}>
                      <Text style={[styles.descriptionText2,styles.boldText]}>{submissionComments[i - 1].firstName} {submissionComments[i - 1].lastName}</Text>
                      <Text style={[styles.descriptionText3]}>{submissionComments[i - 1].roleName}</Text>
                    </View>

                    <View style={[styles.calcColumn108,styles.rowDirection]}>
                      <View>
                        <Text style={[styles.descriptionText3]}>{dateString}</Text>
                      </View>
                      {(showEditOption) && (
                        <View style={[styles.leftMargin]}>
                          <TouchableOpacity onPress={() => this.editComment(index,'submission',true) }>
                            <Image source={{ uri: editIconGrey}} style={[styles.square11,styles.contain]} />
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                    <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

                    <View style={[styles.calcColumn108]}>
                      {(this.state.editSubmissionComments[index]) ? (
                        <TextInput
                          style={styles.textInput}
                          onChangeText={(text) => this.formChangeHandler("myEditedSubmissionComment", text)}
                          value={this.state.myEditedSubmissionComment}
                          placeholder="Change comment..."
                          placeholderTextColor="grey"
                        />
                      ) : (
                        <Text style={[styles.descriptionText1]}>{submissionComments[i - 1].comment}</Text>
                      )}
                    </View>

                    {(this.state.editSubmissionComments[index]) && (
                      <View style={[styles.rowDirection]}>
                        <View>
                          <TouchableOpacity style={[styles.btnSmall,styles.ctaBorder,styles.flexCenter]} onPress={() => this.editComment(index,'submission',false)}><Text style={[styles.descriptionText1,styles.ctaColor]}>Cancel</Text></TouchableOpacity>
                        </View>
                        <View style={[styles.leftPadding15]}>
                          <TouchableOpacity style={(this.state.myEditedSubmissionComment) ? [styles.btnSmall,styles.ctaBackgroundColor,styles.flexCenter] : [styles.btnSmall,styles.ctaBackgroundColor,styles.washOut,styles.flexCenter]} disabled={disabled} onPress={() => this.postComment(submissionIndex, 'submission', index)}><Text style={[styles.descriptionText1,styles.whiteColor]}>Post</Text></TouchableOpacity>
                        </View>
                      </View>
                    )}


                    <View style={[styles.spacer]} />
                  </View>
                </View>

                <View style={[styles.spacer]} />

                <View style={[styles.leftMargin58,styles.rowDirection]}>
                  <View style={[styles.rightMargin]}>
                    <TouchableOpacity disabled={this.state.savingLike} onPress={() => this.likeItem(index,'submission') }>
                      <Image source={submissionComments[index].likes.includes(this.state.emailId) ? { uri: thumbsUpIconBlue} : { uri: thumbsUpIconGrey}} style={[styles.square25,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                  <View style={[styles.rightMargin]}>
                    <Text style={[styles.standardText]}>{submissionComments[i - 1].likes.length} Likes</Text>
                  </View>

                  <View style={[styles.verticalSeparator]} />

                  <View style={[styles.rightMargin]}>
                    <TouchableOpacity onPress={() => this.showReplies(index,'submission') }>
                      <Image source={{ uri: commentIconGrey}} style={[styles.square25,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity onPress={() => this.showReplies(index,'submission') }>
                      <Text style={[styles.standardText]}>{submissionComments[i - 1].replies.length} Replies</Text>
                    </TouchableOpacity>
                  </View>

                </View>
                <View style={[styles.spacer]} />
                {(submissionComments[i - 1].showReplies) && (
                  <View style={[styles.leftMargin58]}>
                    {this.renderReplies(index, 'submission')}
                  </View>
                )}

                <View style={[styles.spacer]} /><View style={[styles.spacer]} />

              </View>
            )
          }
        }
      }

      return rows
    }

    likeItem(index, type) {
      console.log('likeItem called', index, type)

      this.setState({ savingLike: true, serverSuccessMessage: '', serverErrorMessage: '' })

      let _id = this.state.submissionComments[index]._id
      const emailId = this.state.emailId

      Axios.post('https://www.guidedcompass.com/api/comments/like', { _id, emailId
      }).then((response) => {

        if (response.data.success) {
          //save values
          console.log('Like save worked ', response.data);

          //report whether values were successfully saved
          const serverSuccessMessage  = 'Like submitted successfully!'
          const comment = response.data.comment

          if (type === 'submission') {
            let submissionComments = this.state.submissionComments
            for (let i = 1; i <= submissionComments.length; i++) {
              if (submissionComments[i - 1]._id === comment._id) {
                submissionComments[i - 1] = comment
              }
            }

            this.setState({ serverSuccessMessage, submissionComments, savingLike: false })

          } else {
            let comments = this.state.comments
            for (let i = 1; i <= comments.length; i++) {
              if (comments[i - 1]._id === comment._id) {
                comments[i - 1] = comment
              }
            }
            this.setState({ serverSuccessMessage, comments, savingLike: false })
          }

        } else {
          console.log('like did not save successfully')
          this.setState({ serverErrorMessage: response.data.message, savingLike: false })
        }

      }).catch((error) => {
          console.log('Like save did not work', error);
          this.setState({ serverErrorMessage: error, savingLike: false })
      });
    }

    editComment(index, type, action) {
      console.log('editComment', index, type, action)

      if (type === 'posting') {
        let editComments = this.state.editComments
        editComments[index] = action
        const myEditedComment = this.state.comments[index].comment
        this.setState({ editComments, myEditedComment })
      } else {
        let editSubmissionComments = this.state.editSubmissionComments
        editSubmissionComments[index] = action
        const myEditedSubmissionComment = this.state.submissionComments[index].comment
        this.setState({ editSubmissionComments, myEditedSubmissionComment })
      }
    }

    showReplies(index, type) {
      console.log('addReplies called', index, type)

      if (type === 'submission') {
        let submissionComments = this.state.submissionComments
        submissionComments[index]['showReplies'] = true
        this.setState({ submissionComments })
      } else if (type === 'posting'){
        let comments = this.state.comments
        comments[index]['showReplies'] = true
        this.setState({ comments })
      }
    }

    voteOnItem(submission, direction, index) {
      console.log('voteOnItem called', index)

      const _id = this.state.selectedOpportunity._id
      let selectedOpportunity = this.state.selectedOpportunity
      const emailId = this.state.emailId
      this.setState({ savingVote: true })

      Axios.post('https://www.guidedcompass.com/api/postings/submission-vote', { _id, submission, direction, emailId })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Submission vote save worked', response.data);

          const serverSuccessMessage = 'Submission vote successfully saved!'
          const submissions = response.data.submissions
          selectedOpportunity['submissions'] = submissions
          this.setState({ serverSuccessMessage, selectedOpportunity, savingVote: false })

        } else {
          console.error('there was an error posting the vote save');
          const serverErrorMessage = response.data.message
          this.setState({ serverErrorMessage, savingVote: false })
        }
      }).catch((error) => {
          console.log('The vote save did not work', error);
          this.setState({ serverErrorMessage: error, savingVote: false })
      });
    }

    showComments(index) {
      console.log('showComments ', index)
      //for the submissions section

      const modalIsOpen = true
      const selectedIndex = index
      const showComments = true
      const showGrade = false
      const showProjectDetail = false

      let disabled = false
      let opacity = 1
      let pointerEvents = 'auto'
      if (this.state.selectedOpportunity.disableDownvoting === true) {
        disabled = true
        opacity = 0.25
        pointerEvents = 'none'
      }

      let submissionCommentCount = 0
      for (let i = 1; i <= this.state.submissionComments.length; i++) {
        if (this.state.submissionComments[i - 1].parentSubmissionId === this.state.selectedOpportunity.submissions[index]._id) {
          submissionCommentCount = submissionCommentCount + 1
        }
      }

      this.setState({ modalIsOpen, selectedIndex, showComments, showGrade, disabled, opacity, pointerEvents, submissionCommentCount, showProjectDetail });
    }

    renderReplies(index, type) {
      console.log('renderReplies called', index, type)

      let rows = []
      let comments = this.state.comments
      let postType = 'reply'

      if (type === 'submission') {
        comments = this.state.submissionComments
        postType = 'submissionReply'
      }

      let replies = comments[index].replies

      let myReply = ''
      if (this.state.myReplies[index]) {
        myReply = this.state.myReplies[index]
      }

      rows.push(
        <View key={0}>
          <View style={[styles.spacer]} />

          <View style={[styles.rowDirection]}>
            <View style={[styles.rightPadding8]}>
              <Image source={(this.state.pictureURL) ? { uri: this.state.pictureURL} : { uri: profileIconBig}} style={[styles.square40,styles.contain, { borderRadius: 20 }]} />
            </View>

            <View style={[styles.calcColumn138,styles.topMarginNegative10,styles.roundedCorners,styles.transparentBorder,styles.padding10]}>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.formChangeHandler("reply|" + index, text)}
                value={myReply}
                placeholder="Add a reply..."
                placeholderTextColor="grey"
              />
            </View>
          </View>

          {(this.state.myReplies[index] !== '') && (
            <View style={[styles.leftMargin67]}>
              <TouchableOpacity style={[styles.btnSmall,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.postComment(index,postType)}><Text style={[styles.descriptionText1,styles.whiteColor]}>Reply</Text></TouchableOpacity>
            </View>
          )}
          <View style={[styles.spacer]} /><View style={[styles.spacer]} />
        </View>
      )

      if (replies) {
        for (let i = 1; i <= replies.length; i++) {

          const replyIndex = i - 1

          let commentBackgroundColor = [styles.commentBackgroundStudent]
          if (this.state.comments[i - 1].roleName === 'Mentor') {
            commentBackgroundColor = [styles.commentBackgroundMentor]
          } else if (this.state.comments[i - 1].roleName === 'Employer') {
            commentBackgroundColor = [styles.commentBackgroundEmployer]
          } else if (this.state.comments[i - 1].roleName === 'Teacher') {
            commentBackgroundColor = [styles.commentBackgroundTeacher]
          } else if (this.state.comments[i - 1].roleName === 'Admin') {
            commentBackgroundColor = [styles.commentBackgroundAdmin]
          }

          let dateString = ''
          if (replies[replyIndex]) {
            if (replies[replyIndex].createdAt) {
              dateString = replies[replyIndex].createdAt.toString().substring(0,10)
            }
          }

          rows.push(
            <View key={i}>
              <View style={[styles.spacer]} />

              <View style={[styles.rowDirection]}>
                <View style={[styles.rightPadding8]}>
                  <Image source={(replies[i - 1].pictureURL) ? { uri: replies[i - 1].pictureURL} : { uri: profileIconBig}} style={[styles.square40,styles.contain, { borderRadius: 20 }]} />
                </View>

                <View style={[styles.calcColumn108,styles.roundedCorners,styles.transparentBorder,styles.padding15,commentBackgroundColor]}>
                  <View style={[styles.calcColumn210]}>
                    <Text style={[styles.descriptionText2]}>{replies[i - 1].firstName} {replies[i - 1].lastName}</Text>

                    <Text style={[styles.descriptionText3]}>{replies[i - 1].roleName}</Text>

                  </View>
                  <View style={[styles.width100]}>
                    <View>
                      <Text style={[styles.descriptionText3]}>{dateString}</Text>
                    </View>
                  </View>

                  <View style={[styles.spacer]} />
                  <Text style={[styles.descriptionText2]}>{replies[i - 1].comment}</Text>

                </View>
              </View>

              <View style={[styles.spacer]} />

            </View>
          )
        }
      }

      return rows
    }

    postComment(index, type, subCommentIndex) {
      console.log('postComment called ', index, type, subCommentIndex)

      this.setState({ serverErrorMessage: '', serverSuccessMessage: '', disableSubmit: true })

      //submit the selected project
      const email = this.state.emailId
      const firstName = this.state.cuFirstName
      const lastName = this.state.cuLastName
      let roleName = "Student"

      let likes = []

      const orgCode = this.state.postingOrgCode
      const orgName = this.state.postingOrgName
      const orgContactEmail = this.state.orgContactEmail

      let parentPostId = null
      let parentCommentId = null

      const createdAt = new Date()
      const updatedAt = new Date()

      if (type === 'reply' || type === 'submissionReply') {
        //save reply

        let comments = this.state.comments
        if (type === 'submissionReply') {
          comments = this.state.submissionComments
        }

        let _id = comments[index]
        const comment = this.state.myReplies[index]
        parentCommentId = comments[index]._id
        // const parentCommentName = comments[index].comment
        // const parentCommentFirstName = comments[index].firstName
        // const parentCommentEmail = comments[index].email
        const pictureURL = this.state.pictureURL


        const reply = {
            firstName, lastName, email, roleName, comment,
            orgCode, orgName, orgContactEmail,
            pictureURL, createdAt, updatedAt
        }

        Axios.post('https://www.guidedcompass.com/api/comments/reply', {
          _id, firstName, lastName, email,
          orgCode, orgName, orgContactEmail,
          reply
        }).then((response) => {

          if (response.data.success) {
            //save values
            console.log('Comment save worked ', response.data);

            let myReplies = []

            let newComment = response.data.comment

            for (let i = 1; i <= comments.length; i++) {
              if (comments[i - 1]._id === newComment._id) {
                comments[i - 1] = newComment
              }
            }

            if (type === 'submissionReply') {
              this.setState({ serverSuccessMessage: 'Reply submitted successfully!', submissionComments: comments, myReplies, disableSubmit: false })
            } else {
              this.setState({ serverSuccessMessage: 'Reply submitted successfully!', comments, myReplies, disableSubmit: false })
            }

          } else {

            console.log('comment did not save successfully')
            this.setState({ serverErrorMessage: response.data.message, disableSubmit: false })
          }

        }).catch((error) => {
            console.log('Reply save did not work', error);
            this.setState({ serverErrorMessage: error, disableSubmit: false })
        });

      } else if (type === 'submission') {

        //save comment on submission
        console.log('no index found')
        let commentId = null
        const commentType = type
        const pictureURL = this.state.pictureURL
        let replies = []
        let comment = this.state.mySubmissionComments[this.state.selectedIndex]
        const parentPostId = this.state.selectedOpportunity._id
        const parentSubmissionId = this.state.selectedOpportunity.submissions[this.state.selectedIndex]._id
        let submissionName = this.state.selectedOpportunity.submissions[this.state.selectedIndex].name
        let contributorFirstName = this.state.selectedOpportunity.submissions[this.state.selectedIndex].userFirstName
        let contributorEmail = this.state.selectedOpportunity.submissions[this.state.selectedIndex].userEmail

        if (subCommentIndex || subCommentIndex === 0) {
          commentId = this.state.submissionComments[index]._id
          comment = this.state.myEditedSubmissionComment
          likes = this.state.submissionComments[index].likes
          replies = this.state.submissionComments[index].replies
        }

        //save comment
        Axios.post('https://www.guidedcompass.com/api/comments', {
          commentId, commentType, email, firstName, lastName, roleName, comment, pictureURL, likes, replies,
          parentPostId, parentSubmissionId, createdAt, updatedAt, submissionName, contributorFirstName, contributorEmail,
          orgCode, orgName, orgContactEmail
        }).then((response) => {

          if (response.data.success) {
            //save values
            console.log('Comment save worked ', response.data);

            let submissionComments = this.state.submissionComments
            let editSubmissionComments = this.state.editSubmissionComments

            if (subCommentIndex) {
              console.log('existing comment')
              submissionComments[index]['comment'] = this.state.myEditedSubmissionComment
              editSubmissionComments[index] = false
            } else {
              submissionComments.push(
                { _id: response.data._id, firstName, lastName, email, roleName, comment,
                  pictureURL, likes, replies, parentPostId, parentSubmissionId, createdAt, updatedAt }
              )
            }

            let mySubmissionComments = this.state.mySubmissionComments
            mySubmissionComments[this.state.selectedIndex] = ''

            let submissionCommentCount = 0
            if (this.state.submissionCommentCount) {
              submissionCommentCount = this.state.submissionCommentCount
            }
            submissionCommentCount = submissionCommentCount + 1

            console.log('show submissionComments: ', submissionComments, comment)

            //report whether values were successfully saved
            this.setState({ serverSuccessMessage: 'Comment submitted successfully!',
            submissionComments, mySubmissionComments, submissionCommentCount, disableSubmit: false })

          } else {
            console.log('comment did not save successfully')
            this.setState({ serverErrorMessage: response.data.message, disableSubmit: false })
          }

        }).catch((error) => {
            console.log('Comment save did not work', error);
            this.setState({ serverErrorMessage: error, disableSubmit: false })
        });
      } else if (type === 'posting') {

        //save comment on posting
        console.log('no index found')

        let commentId = null
        let commentType = type
        let replies = []
        let comment = this.state.myComment
        parentPostId = this.state.selectedOpportunity._id
        let postingTitle = this.state.selectedOpportunity.name
        let contributorFirstName = this.state.selectedOpportunity.contributorFirstName
        let contributorEmail = this.state.selectedOpportunity.contributorEmail
        if (this.state.selectedOpportunity.postType === 'Event') {
          postingTitle = this.state.selectedOpportunity.title
          contributorFirstName = this.state.selectedOpportunity.orgContactFirstName
          contributorEmail = this.state.selectedOpportunity.orgContactEmail
        }
        const pictureURL = this.state.pictureURL

        if (index || index === 0) {
          commentId = this.state.comments[index]._id
          comment = this.state.myEditedComment
          likes = this.state.comments[index].likes
          replies = this.state.comments[index].replies
        }

        //save comment
        Axios.post('https://www.guidedcompass.com/api/comments', {
          commentId, commentType, email, firstName, lastName, roleName, comment, pictureURL, likes, replies,
          parentPostId, parentCommentId, createdAt, updatedAt, postingTitle, contributorFirstName, contributorEmail,
          orgCode, orgName, orgContactEmail
        }).then((response) => {

          if (response.data.success) {
            //save values
            console.log('Comment save worked ', response.data, index, createdAt);
            let comments = this.state.comments
            let editComments = this.state.editComments

            if (index || index === 0) {
              console.log('existing comment', comments.length)
              comments[index]['comment'] = this.state.myEditedComment
              editComments[index] = false
            } else {
              console.log('new comment', comments.length)
              comments.push(
                { _id: response.data._id, firstName, lastName, email, roleName, comment,
                  pictureURL, likes, replies, parentPostId, parentCommentId, createdAt, updatedAt }
              )
            }
            console.log('show comments: ', comments)

            //report whether values were successfully saved
            this.setState({ serverSuccessMessage: 'Comment submitted successfully!',
              comments, myComment: '', myEditedComment: '', editComments, disableSubmit: false })

          } else {
            console.log('comment did not save successfully')
            this.setState({ serverErrorMessage: response.data.message, disableSubmit: false })
          }

        }).catch((error) => {
            console.log('Comment save did not work', error);
            this.setState({ serverErrorMessage: error, disableSubmit: false })
        });
      }
    }

    saveFeedback() {
      console.log('saveFeedback called')

      const grade = this.state.selectedOpportunity.submissions[this.state.selectedIndex1].grades[this.state.selectedIndex2].grade
      const feedback = this.state.selectedOpportunity.submissions[this.state.selectedIndex1].grades[this.state.selectedIndex2].feedback
      const isTransparent = this.state.selectedOpportunity.submissions[this.state.selectedIndex1].grades[this.state.selectedIndex2].isTransparent

      //must set transparency level and give grade or feedback
      if (!grade && !feedback) {
        this.setState({ serverErrorMessage: 'please add a grade or provide feedback'})
      } else if (isTransparent === '') {
        this.setState({ serverErrorMessage: 'please indicate whether this feedback is transparent to the student '})
      } else {

        //submit the selected project
        // const emailId = this.state.emailId
        // const postingId = this.state.selectedOpportunity._id
        // const submissions = this.state.selectedOpportunity.submissions
        // const selectedIndex = this.state.selectedIndex1
        // const gradeObject = submissions[this.state.selectedIndex1].grades[this.state.selectedIndex2]
        // const updatedAt = new Date()

        const emailId = this.state.emailId
        const postingId = this.state.selectedOpportunity._id
        const submissionId = this.state.selectedOpportunity.submissions[this.state.selectedIndex1]._id
        const gradeObject = this.state.selectedOpportunity.submissions[this.state.selectedIndex1].grades[this.state.selectedIndex2]

        console.log('show titles 2: ', gradeObject)

        //save submission to opportunity + project

        Axios.post('https://www.guidedcompass.com/api/projects/feedback', { emailId, postingId, submissionId, gradeObject })
        .then((response) => {

          if (response.data.success) {
            //save values
            console.log('Project feedback save worked ', response.data);
            //report whether values were successfully saved
            this.setState({ serverSuccessMessage: 'Project feedback successfully sent!', modalIsOpen: false })

          } else {
            console.log('project feedback did not save successfully')
            this.setState({ serverErrorMessage: response.data.message })
          }

        }).catch((error) => {
            console.log('Project feedback save did not work', error);
            this.setState({ serverErrorMessage: error })
        });
      }
    }

    render() {

      return (
        <View>
          {(this.state.selectedOpportunity) ? (
            <View>
              {(this.state.selectedOpportunity.submissions && this.state.selectedOpportunity.submissions.length > 0) ? (
                <View>
                  <View style={[styles.spacer]} />

                  {this.renderSubmissions()}

                  {this.state.serverSuccessMessage !== '' && <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessage}</Text>}
                  {this.state.serverErrorMessage !== '' && <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>}
                </View>
              ) : (
                <View>
                  <View style={[styles.spacer]} />
                  <View style={[styles.spacer]} />

                  <Text style={[styles.errorColor]}>No participants have submitted a project solution yet.</Text>

                  <View style={[styles.spacer]} />
                  <View style={[styles.spacer]} />

                </View>
              )}
            </View>
          ) : (
            <View>
              <Text style={[styles.errorColor]}>There was an error</Text>
            </View>
          )}

          {(this.state.showProjectDetail) ? (
            <View>
              <ProjectDetails closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedProject={this.state.selectedOpportunity.submissions[this.state.selectedIndex]} orgCode={this.state.activeOrg} navigation={this.props.navigation} />
            </View>
          ) : (
            <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>
              {(this.state.showComments) && (
                <View key="submissionDetail">
                 {(this.state.selectedOpportunity && this.state.selectedOpportunity.submissions && this.state.selectedOpportunity.submissions.length > 0) && (
                   <View style={[styles.rowDirection]}>
                     <View style={[styles.width50]}>
                       <View style={[styles.halfSpacer]} />
                       <View>
                         <TouchableOpacity disabled={(this.state.disabledVoting || this.state.savingVote) ? true : false} onPress={() => this.voteOnItem(this.state.selectedOpportunity.submissions[this.state.selectedIndex], 'up', this.state.selectedIndex) }>
                           <Image source={(this.state.selectedOpportunity.submissions[this.state.selectedIndex].upvotes.includes(this.state.emailId)) ? { uri: upvoteIconBlue} : { uri: upvoteIconGrey}} style={[styles.square15,styles.contain]} />
                         </TouchableOpacity>
                       </View>
                       <View>
                         <Text style={[styles.standardText,styles.centerText]}>{this.state.selectedOpportunity.submissions[this.state.selectedIndex].upvotes.length - this.state.selectedOpportunity.submissions[this.state.selectedIndex].downvotes.length}</Text>

                       </View>
                       <View>
                         <TouchableOpacity disabled={this.state.disabled} onPress={() => this.voteOnItem(this.state.selectedOpportunity.submissions[this.state.selectedIndex], 'down', this.state.selectedIndex) }>
                           <Image source={(this.state.selectedOpportunity.submissions[this.state.selectedIndex].downvotes.includes(this.state.emailId)) ? { uri: downvoteIconBlue} : { uri: downvoteIconGrey}} style={(this.state.selectedOpportunity.disableDownvoting === true) ? [styles.square15,styles.contain,styles.washOut] : [styles.square15,styles.contain]} />
                         </TouchableOpacity>
                       </View>
                     </View>

                     <TouchableOpacity onPress={(this.state.disableLinks) ? console.log('disabled') : () => Linking.openURL(this.state.selectedOpportunity.submissions[this.state.selectedIndex].url)} style={(this.state.disableLinks) ? [styles.calcColumn110,styles.leftPadding,styles.rowDirection] : [styles.calcColumn110,styles.leftPadding,styles.rowDirection]}>
                       <View style={[styles.calcColumn140]}>
                         <Text style={[styles.headingText4]}>{this.state.selectedOpportunity.submissions[this.state.selectedIndex].name}</Text>

                         <Text style={[styles.descriptionText1]}>{(this.state.selectedOpportunity.submissions[this.state.selectedIndex].anonymizeSubmissions) ? "Anonymous Submitter" : this.state.selectedOpportunity.submissions[this.state.selectedIndex].userFirstName + " " + this.state.selectedOpportunity.submissions[this.state.selectedIndex].userLastName}</Text>

                         <Text style={[styles.descriptionText1]}>{this.state.selectedOpportunity.submissions[this.state.selectedIndex].category} | {this.state.selectedOpportunity.submissions[this.state.selectedIndex].hours} Hours</Text>
                       </View>
                       <View style={[styles.width30]}>
                        <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                         <View>
                           <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]} />
                         </View>
                       </View>
                     </TouchableOpacity>

                     <View style={[styles.calcColumn110,styles.leftMargin50]}>
                      <View style={[styles.spacer]} />

                      <View style={[styles.rowDirection]}>
                        <View style={[styles.rightMargin]}>
                          <Image source={{ uri: commentIconGrey}} style={[styles.square18,styles.contain]} />
                        </View>
                        <View style={[styles.topMarginNegative5]}>
                          {(this.state.submissionCommentCount) ? (
                            <Text style={[styles.descriptionText2]}>{this.state.submissionCommentCount} Comments</Text>
                          ) : (
                            <Text style={[styles.descriptionText2]}>0 Comments</Text>
                          )}
                        </View>
                      </View>

                     </View>
                     <View style={[styles.topMargin20,styles.rightMargin20,styles.bottomMargin20,styles.leftMargin50]} />

                     <View style={[styles.leftPadding50,styles.rightMargin20]}>
                      <View style={[styles.rowDirection]}>
                        <View>
                          <Image source={(this.state.pictureURL) ? { uri: this.state.pictureURL} : { uri: profileIconBig}} style={[styles.square40,styles.contain, { borderRadius: 20 }]} />
                        </View>
                        <View style={[styles.roundedCorners,styles.transparentBorder,styles.padding10,styles.topMarginNegative10, styles.calcColumn170]}>
                          <TextInput
                            style={styles.textInput}
                            onChangeText={(text) => this.formChangeHandler("submissionComment|" + this.state.selectedIndex, text)}
                            value={this.state.mySubmissionComments[this.state.selectedIndex]}
                            placeholder="Add a comment..."
                            placeholderTextColor="grey"
                          />
                        </View>
                      </View>

                       {(this.state.mySubmissionComments[this.state.selectedIndex] !== '') && (
                         <View style={[styles.leftMargin57]}>
                           <TouchableOpacity style={[styles.btnSmall,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.disableSubmit} onPress={() => this.postComment(this.state.selectedIndex, 'submission')}><Text style={[styles.descriptionText1,styles.whiteColor]}>Post</Text></TouchableOpacity>
                         </View>
                       )}
                       <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                       <View>
                        {this.renderSubmissionComments(this.state.selectedIndex)}
                       </View>
                     </View>
                   </View>
                 )}
                </View>
              )}

              {(this.state.showPicker) && (
                <View style={[styles.flex1,styles.pinBottom,styles.justifyEnd]}>
                  <SubPicker
                    selectedSubKey={this.state.selectedSubKey}
                    selectedName={this.state.selectedName}
                    selectedOptions={this.state.selectedOptions}
                    selectedValue={this.state.selectedValue}
                    differentLabels={this.state.differentLabels}
                    pickerName={this.state.pickerName}
                    formChangeHandler={this.formChangeHandler}
                    closeModal={this.closeModal}
                  />
                </View>
              )}

           </Modal>
         )}
        </View>
      )
    }
}

export default Submissions
