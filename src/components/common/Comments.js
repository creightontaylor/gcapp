import React, {Component} from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, Image } from 'react-native';
import Axios from 'axios';
const styles = require('../css/style');

const profileIconBig = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-big.png'
const likeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/like-icon-blue.png'
const likeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/like-icon-dark.png'
const commentIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/comment-icon-grey.png'
const editIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/edit-icon-grey.png'

class Comments extends Component {
    constructor(props) {
      super(props)
      this.state = {
        comments: [],
        editComments: [],
        myReplies: []
      }

      this.renderReplies = this.renderReplies.bind(this)
      this.likeItem = this.likeItem.bind(this)
      this.editComment = this.editComment.bind(this)
      this.showReplies = this.showReplies.bind(this)
      this.formChangeHandler = this.formChangeHandler.bind(this)
      this.postComment = this.postComment.bind(this)
      this.renderComments = this.renderComments.bind(this)
      this.navigateToProfile = this.navigateToProfile.bind(this)

    }

    componentDidMount() {
      console.log('componentDidMount called')

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in subcomments ')

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode || this.props.roleName !== prevProps.roleName) {
        this.retrieveData()
      } else if (this.props.selectedOpportunity !== prevProps.selectedOpportunity || this.props.orgFocus !== prevProps.orgFocus || this.props.activeOrg !== prevProps.activeOrg) {
        this.retrieveData()
      } else if (this.props.comments !== prevProps.comments) {
        this.retrieveData()
      } else if (this.props.selectedGroup !== prevProps.selectedGroup) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called within subcomments')

        const emailId = await AsyncStorage.getItem('email');
        const cuFirstName = await AsyncStorage.getItem('firstName');
        const cuLastName = await AsyncStorage.getItem('lastName');
        const orgFocus = await AsyncStorage.getItem('orgFocus');
        const roleName = await AsyncStorage.getItem('roleName');
        const username = await AsyncStorage.getItem('username');

        const selectedOpportunity = this.props.selectedOpportunity
        const activeOrg = this.props.activeOrg
        const accountCode = this.props.accountCode
        const employerName = this.props.employerName
        const jobTitle = this.props.jobTitle

        let comments = []
        if (this.props.comments) {
          comments = this.props.comments
        }

        const postingOrgCode = this.props.postingOrgCode
        const postingOrgName = this.props.postingOrgName
        const orgContactEmail = this.props.orgContactEmail
        const pictureURL = this.props.pictureURL
        const selectedGroup = this.props.selectedGroup
        const selectedGroupPost = this.props.selectedGroupPost
        const selectedCurriculumPost = this.props.selectedCurriculumPost
        const selectedCourse = this.props.selectedCourse
        const orgLogo = this.props.orgLogo
        const employerLogo = this.props.employerLogo

        this.setState({
          emailId, cuFirstName, cuLastName, orgFocus, roleName, selectedOpportunity, activeOrg, accountCode, comments,
          postingOrgCode, postingOrgName, orgContactEmail, pictureURL, selectedGroup, selectedGroupPost, selectedCurriculumPost, selectedCourse,
          orgLogo, employerLogo, employerName, jobTitle
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
      } else if (eventName === 'myEditedComment') {
        this.setState({ myEditedComment: eventValue })
      }
    }

    likeItem(index, type) {
      console.log('likeItem called', index, type)

      this.setState({ savingLike: true, serverSuccessMessage: '', serverErrorMessage: '' })

      let _id = this.state.comments[index]._id
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

    navigateToProfile(index) {
      console.log('navigateToProfile called', index)

      this.props.closeModal()
      this.props.navigation.navigate("Profile", { username: this.state.comments[index].username})

    }

    renderComments() {
      console.log('renderComments called', this.state.comments)

      let rows = []

      for (let i = 1; i <= this.state.comments.length; i++) {

        const index = i - 1

        let commentBackgroundColor =  styles.commentBackgroundStudent
        if (this.state.comments[i - 1].roleName === 'Mentor') {
          commentBackgroundColor = styles.commentBackgroundMentor
        } else if (this.state.comments[i - 1].roleName === 'Teacher') {
          commentBackgroundColor = styles.commentBackgroundTeacher
        } else if (this.state.comments[i - 1].roleName === 'Admin') {
          commentBackgroundColor = styles.commentBackgroundAdmin
        } else if (this.state.comments[i - 1].roleName === 'Employer') {
          commentBackgroundColor = styles.commentBackgroundEmployer
        }

        let dateString = ''
        if (this.state.comments[i - 1].createdAt) {
          dateString = this.state.comments[i - 1].createdAt.toString().substring(0,10)
        }

        let showEditOption = false

        let mainClass = "full-width"
        let smallClass = "full-width"
        if (this.state.comments[i - 1].email === this.state.emailId) {
          showEditOption = true

          mainClass = 'calc-column-offset-121'

          smallClass = "fixed-column-121"
        }

        let disabled = true
        if (this.state.myEditedComment) {
          disabled = false
        }

        rows.push(
          <View key={i}>
            <View style={styles.spacer} />

            <View style={styles.rowDirection}>
              <TouchableOpacity onPress={() => this.navigateToProfile(i - 1)} disabled={(this.state.comments[i - 1].username) ? false : true}>
                <View style={styles.rightPadding8}>
                  <Image source={(this.state.comments[i - 1].pictureURL) ? { uri: this.state.comments[i - 1].pictureURL} : { uri: profileIconBig}} style={styles.profileThumbnail50}/>
                </View>
              </TouchableOpacity>

              <View style={[styles.calcColumn118,styles.commentBubble2,commentBackgroundColor]}>
                <TouchableOpacity onPress={() => this.navigateToProfile(i - 1)} disabled={(this.state.comments[i - 1].username) ? false : true}>
                  <View style={styles.fullWidth}>
                    <Text style={styles.standardText}>{this.state.comments[i - 1].firstName} {this.state.comments[i - 1].lastName}</Text>
                    <Text style={styles.descriptionText2}>{this.state.comments[i - 1].roleName}</Text>
                  </View>
                </TouchableOpacity>

                <View style={[styles.fullWidth,styles.rowDirection]}>
                  <View>
                    <Text style={styles.descriptionText3}>{dateString}</Text>
                  </View>
                  {(showEditOption) && (
                    <View style={styles.leftMargin}>
                      <TouchableOpacity onPress={() => this.editComment(index,'posting',true) }>
                        <Image source={{ uri: editIconGrey}} style={[styles.square11,styles.contain]} />
                      </TouchableOpacity>
                    </View>
                  )}
                </View>

                <View style={styles.spacer} /><View style={styles.halfSpacer} />

                <View style={styles.fullWidth}>
                  {(this.state.editComments[index]) ? (
                    <TextInput
                      style={styles.commentTextField}
                      onChangeText={(text) => this.formChangeHandler('myEditedComment',text)}
                      value={this.state.myEditedComment}
                      placeholder="Change comment..."
                      placeholderTextColor="grey"
                    />
                  ) : (
                    <Text style={styles.descriptionText1}>{this.state.comments[i - 1].comment}</Text>
                  )}

                </View>

                {(this.state.editComments[index]) && (
                  <View style={[styles.width160,styles.rowDirection]}>
                    <View>
                      <TouchableOpacity style={[styles.btnSmall,styles.descriptionText1,styles.ctaColor]} onPress={() => this.editComment(index,'posting',false)}>Cancel</TouchableOpacity>
                    </View>
                    <View style={styles.leftPadding15}>
                      <TouchableOpacity style={(this.state.myEditedComment) ? [styles.btnSmall,styles.ctaBackgroundColor,styles.descriptionText1,styles.whiteColor] : [styles.btnSmall,styles.ctaBackgroundColor,styles.descriptionText1,styles.whiteColor,styles.washOut2]} disabled={disabled} onPress={() => this.postComment(index, 'posting')}>Post</TouchableOpacity>
                    </View>
                  </View>
                )}
                <View style={styles.spacer} />
              </View>
            </View>

            <View style={styles.spacer} />

            <View style={[styles.leftMargin58,styles.rowDirection]}>
              <View style={styles.rightMargin}>
                <TouchableOpacity disabled={this.state.savingLike} onPress={() => this.likeItem(index,'posting') }>
                  <Image source={this.state.comments[index].likes.includes(this.state.emailId) ? { uri: likeIconBlue} : { uri: likeIconDark}} style={[styles.square25,styles.contain]} />
                </TouchableOpacity>
              </View>
              <View style={styles.rightMargin}>
                <Text style={[styles.standardText]}>{this.state.comments[i - 1].likes.length} Likes</Text>
              </View>

              <View style={styles.verticalSeparator} />

              <View style={[styles.leftMargin,styles.rightMargin]}>
                <TouchableOpacity onPress={() => this.showReplies(index,'posting') }>
                  <Image source={{ uri: commentIconGrey}} style={[styles.square25,styles.contain]} />
                </TouchableOpacity>
              </View>
              <View>
                <TouchableOpacity onPress={() => this.showReplies(index,'posting') }>
                  <Text style={[styles.standardText]}>{this.state.comments[i - 1].replies.length} Replies</Text>
                </TouchableOpacity>
              </View>

            </View>
            <View style={styles.spacer} />
            {(this.state.comments[i - 1].showReplies) && (
              <View style={styles.leftMargin58}>
                {this.renderReplies(index,'posting')}
              </View>
            )}

            <View style={styles.spacer} /><View style={styles.spacer} />
          </View>
        )
      }

      return rows
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
          <View style={styles.rowDirection}>
            <View style={styles.width50}>
              <View style={styles.spacer} />
              <Image source={(this.state.pictureURL) ? { uri: this.state.pictureURL} : { uri: profileIconBig}} style={styles.profileThumbnail40} />
            </View>
            <View style={[styles.calcColumn160,styles.borderRadius10,styles.transparentBorder,styles.padding10]}>
              <TextInput
                style={[styles.textInput,styles.flex1]}
                onChangeText={(text) => this.formChangeHandler("reply|" + index,text)}
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

          <View style={styles.spacer} /><View style={styles.spacer} />

        </View>
      )

      if (replies) {
        for (let i = 1; i <= replies.length; i++) {

          const replyIndex = i - 1

          let commentBackgroundColor = "comment-background-student"
          if (replies[i - 1].roleName === 'Mentor') {
            commentBackgroundColor = "comment-background-mentor"
          } else if (replies[i - 1].roleName === 'Employer') {
            commentBackgroundColor = "comment-background-employer"
          } else if (replies[i - 1].roleName === 'Teacher') {
            commentBackgroundColor = "comment-background-teacher"
          } else if (replies[i - 1].roleName === 'Admin') {
            commentBackgroundColor = "comment-background-admin"
          }

          let dateString = ''
          if (replies[replyIndex]) {
            if (replies[replyIndex].createdAt) {
              dateString = replies[replyIndex].createdAt.toString().substring(0,10)
            }
          }

          rows.push(
            <View key={i}>
              <View style={styles.spacer} />

              <View style={styles.rowDirection}>
                <View style={styles.rightPadding8}>
                  <Image source={(replies[i - 1].pictureURL) ? { uri: replies[i - 1].pictureURL} : { uri: profileIconBig}} style={styles.profileThumbnail40} />
                </View>

                <View style={[styles.calColumn108,styles.commentBubble2,commentBackgroundColor]}>
                  <View style={styles.calcColumn208}>
                    <Text style={[styles.descriptionText2,styles.boldText]}>{replies[i - 1].firstName} {replies[i - 1].lastName}</Text>

                    <Text style={styles.descriptionText3}>{replies[i - 1].roleName}</Text>

                  </View>
                  <View style={[styles.width100,styles.rowDirection]}>
                    <View>
                      <Text style={styles.descriptionText3}>{dateString}</Text>
                    </View>

                  </View>

                  <View style={styles.spacer} />
                  <Text style={styles.descriptionText2}>{replies[i - 1].comment}</Text>

                </View>
              </View>


              <View style={styles.spacer} />

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
      const username = this.state.username
      const email = this.state.emailId
      let firstName = this.state.cuFirstName
      let lastName = this.state.cuLastName
      let roleName = "Student"
      if (this.props.fromAdvisor) {
        roleName = this.state.roleName
      }

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
        let pictureURL = this.state.pictureURL

        const reply = {
            firstName, lastName, email, username, roleName, comment,
            orgCode, orgName, orgContactEmail,
            pictureURL, createdAt, updatedAt
        }

        Axios.post('https://www.guidedcompass.com/api/comments/reply', {
          _id, firstName, lastName, email, username, pictureURL,
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
        console.log('in submission')

        let commentId = null
        const commentType = type
        let pictureURL = this.state.pictureURL

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

        const commentObject = {
          commentId, commentType, email, firstName, lastName, username, roleName, comment, pictureURL, likes, replies,
          parentPostId, parentSubmissionId, createdAt, updatedAt, submissionName, contributorFirstName, contributorEmail,
          orgCode, orgName, orgContactEmail
        }

        //save comment
        Axios.post('https://www.guidedcompass.com/api/comments', commentObject).then((response) => {

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
        console.log('in posting')

        let commentId = null
        let commentType = type
        let replies = []
        let comment = this.state.myComment

        let postingTitle = ''
        let contributorFirstName = ''
        let contributorEmail = ''

        let isGroup = false

        if (this.state.selectedOpportunity) {
          console.log('going in 2')
          parentPostId = this.state.selectedOpportunity._id
          postingTitle = this.state.selectedOpportunity.name
          contributorFirstName = this.state.selectedOpportunity.contributorFirstName
          contributorEmail = this.state.selectedOpportunity.contributorEmail

          if (this.state.selectedOpportunity.postType === 'Event') {
            postingTitle = this.state.selectedOpportunity.title
            contributorFirstName = this.state.selectedOpportunity.orgContactFirstName
            contributorEmail = this.state.selectedOpportunity.orgContactEmail
          }
        } else if (this.state.selectedGroup) {
          console.log('going in 3')
          parentPostId = this.state.selectedGroupPost._id
          postingTitle = this.state.selectedGroupPost.groupName
          contributorFirstName = this.state.selectedGroupPost.firstName
          contributorEmail = this.state.selectedGroupPost.email
          isGroup = true
        } else if (this.state.selectedCurriculumPost) {
          console.log('going in 3')
          parentPostId = this.state.selectedCurriculumPost._id
          postingTitle = this.state.selectedCurriculumPost.itemName
          contributorFirstName = this.state.selectedCurriculumPost.firstName
          contributorEmail = this.state.selectedCurriculumPost.email
          isGroup = true
        } else if (this.state.selectedCourse) {
          console.log('going in 3')
          parentPostId = this.state.selectedCourse._id
          postingTitle = this.state.selectedCourse.title
          contributorFirstName = 'Creighton'
          contributorEmail = 'creightontaylor@gmail.com'
          isGroup = true
        } else {

          parentPostId = this.state.selectedGroupPost._id
          postingTitle = this.state.selectedGroupPost.message
          contributorFirstName = this.state.selectedGroupPost.firstName
          contributorEmail = this.state.selectedGroupPost.email
          isGroup = true
        }

        let pictureURL = this.state.pictureURL

        if (index || index === 0) {
          commentId = this.state.comments[index]._id
          comment = this.state.myEditedComment
          likes = this.state.comments[index].likes
          replies = this.state.comments[index].replies
        }

        const commentObject = {
          commentId, commentType, email, firstName, lastName, username, roleName, comment, pictureURL, likes, replies,
          parentPostId, parentCommentId, createdAt, updatedAt, postingTitle, contributorFirstName, contributorEmail,
          isGroup,
          orgCode, orgName, orgContactEmail
        }

        console.log('show commentObject: ', commentObject)

        //save comment
        Axios.post('https://www.guidedcompass.com/api/comments', commentObject).then((response) => {

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

    render() {
      return (
        <ScrollView>
          {(this.state.selectedOpportunity || this.state.selectedGroup || this.state.selectedGroupPost || this.state.selectedCurriculumPost || this.state.selectedCourse) ? (
            <View>
              <View>
                <View style={styles.rowDirection}>
                  <View style={styles.rightPadding5}>
                    <View style={styles.spacer} /><View style={styles.miniSpacer} />
                    <View>
                      <Image source={(this.state.pictureURL) ? { uri: this.state.pictureURL} : { uri: profileIconBig}} style={[styles.square42,styles.contain,{ borderRadius: 21 }]} />
                    </View>
                  </View>
                  <View style={[styles.calcColumn190,styles.borderRadius10,styles.transparentBorder,styles.padding10]}>
                    <TextInput
                      style={[styles.textInput,styles.flex1]}
                      onChangeText={(text) => this.formChangeHandler('comment',text)}
                      value={this.state.myComment}
                      placeholder="Add a comment..."
                      placeholderTextColor="grey"
                    />
                  </View>

                  {(this.state.myComment !== '') && (
                    <View style={[styles.topMargin15]}>
                      <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} disabled={this.state.disableSubmit} onPress={() => this.postComment(null,'posting')}><Text style={[styles.descriptionText1,styles.whiteColor]}>Post</Text></TouchableOpacity>
                    </View>
                  )}
                  <View style={styles.spacer} /><View style={styles.spacer} />
                </View>
                {this.renderComments()}
              </View>
            </View>
          ) : (
            <View>
              <Text style={styles.errorColor}>There was an error</Text>
            </View>
          )}
        </ScrollView>
      )
    }
}

export default Comments;
