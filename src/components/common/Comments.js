import React, {Component} from 'react';
import { Text, TextInput, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator } from 'react-native';
import Axios from 'axios';

const profileIconBig = ''
const thumbsUpIconGrey = ''
const thumbsUpIconBlue = ''
const commentIconGrey = ''
const editIconGrey = ''

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

    }

    componentDidMount() {
      console.log('componentDidMount called')

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in subcomments ', this.props, prevProps)

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

    retrieveData() {
      console.log('retrieveData called within subcomments', this.props)

      const emailId = localStorage.getItem('email');
      const cuFirstName = localStorage.getItem('firstName');
      const cuLastName = localStorage.getItem('lastName');
      const orgFocus = localStorage.getItem('orgFocus');
      const roleName = localStorage.getItem('roleName');

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
      const orgLogo = this.props.orgLogo
      const employerLogo = this.props.employerLogo

      this.setState({
        emailId, cuFirstName, cuLastName, orgFocus, roleName, selectedOpportunity, activeOrg, accountCode, comments,
        postingOrgCode, postingOrgName, orgContactEmail, pictureURL, selectedGroup, selectedGroupPost, selectedCurriculumPost,
        orgLogo, employerLogo, employerName, jobTitle
      })

    }

    formChangeHandler(event) {
      console.log('formChangeHandler called')

      if (event.target.name === 'comment') {
        this.setState({ myComment: event.target.value })
      } else if (event.target.name.includes('reply')) {
        const nameArray = event.target.name.split("|")
        let myReplies = this.state.myReplies
        myReplies[Number(nameArray[1])] = event.target.value
        this.setState({ myReplies })
      } else if (event.target.name === 'myEditedComment') {
        this.setState({ myEditedComment: event.target.value })
      }
    }

    likeItem(index, type) {
      console.log('likeItem called', index, type)

      if (window.location.pathname.includes('/problem-platform')) {
        this.props.history.push({ pathname: '/problem-platform/' + this.state.selectedOpportunity._id + '/checkout', state: { selectedItem: this.state.selectedOpportunity }})
      } else {
        this.setState({ savingLike: true, serverSuccessMessage: '', serverErrorMessage: '' })

        let _id = this.state.comments[index]._id
        const emailId = this.state.emailId

        Axios.post('https://www.guidedcomapss.com/api/comments/like', { _id, emailId
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

    renderComments() {
      console.log('renderComments called', this.state.comments)

      let rows = []

      for (let i = 1; i <= this.state.comments.length; i++) {

        const index = i - 1

        let commentBackgroundColor = "comment-background-student"
        if (this.state.comments[i - 1].roleName === 'Mentor') {
          commentBackgroundColor = "comment-background-mentor"
        } else if (this.state.comments[i - 1].roleName === 'Teacher') {
          commentBackgroundColor = "comment-background-teacher"
        } else if (this.state.comments[i - 1].roleName === 'Admin') {
          commentBackgroundColor = "comment-background-admin"
        } else if (this.state.comments[i - 1].roleName === 'Employer') {
          commentBackgroundColor = "comment-background-employer"
        }

        let dateString = ''
        if (this.state.comments[i - 1].createdAt) {
          dateString = this.state.comments[i - 1].createdAt.toString().substring(0,10)
        }

        let showEditOption = false

        let mainClass = 'calc-column-offset-100'

        let smallClass = "fixed-column-100"
        if (this.state.comments[i - 1].email === this.state.emailId) {
          showEditOption = true

          mainClass = 'calc-column-offset-121'

          smallClass = "fixed-column-121"
        }

        if (this.state.onMobile) {
          mainClass = "full-width"
          smallClass = "full-width"
        }

        let commentClass = 'calc-column-offset-160'
        if (this.state.onMobile) {
          commentClass = "full-width"
        }

        let disabled = true
        if (this.state.myEditedComment) {
          disabled = false
        }

        rows.push(
          <View key={i}>
            <View className="spacer" />
            <View className="float-left right-padding-8">
              <Image src={(this.state.comments[i - 1].pictureURL) ? this.state.comments[i - 1].pictureURL : profileIconBig} alt="img" className="profile-thumbnail-2"/>
            </View>

            <View className={"comment-bubble-2 calc-column-offset-58 " + commentBackgroundColor}>
              <View className={mainClass}>
                <label className="description-text-1">{this.state.comments[i - 1].firstName} {this.state.comments[i - 1].lastName}</label>
                <View className="clear" />
                <label className="description-text-2">{this.state.comments[i - 1].roleName}</label>
                <View className="clear" />
              </View>

              {(this.state.onMobile) && (
                <View className="clear" />
              )}

              <View className={smallClass}>
                <View className="float-left">
                  <label className="description-text-3">{dateString}</label>
                </View>
                {(showEditOption) && (
                  <View className="float-left left-margin">
                    <TouchableOpacity className="btn background-button" onClick={() => this.editComment(index,'posting',true) }>
                      <Image src={editIconGrey} alt="img" className="image-auto-11" />
                    </TouchableOpacity>
                  </View>
                )}
                <View className="clear" />
              </View>

              <View className="clear" />
              <View className="spacer" /><View className="half-spacer" />

              <View className={commentClass}>
                {(this.state.editComments[index]) ? (
                  <TextInput
                    className="text-field comment-text-field"
                    onChangeText={(text) => this.formChangeHandler('myEditedComment')}
                    value={this.state.myEditedComment}
                    placeholder="Change comment..."
                    placeholderTextColor="grey"
                  />
                ) : (
                  <label className="description-text-1">{this.state.comments[i - 1].comment}</label>
                )}

              </View>

              {(this.state.editComments[index]) && (
                <View className="fixed-column-160">
                  <View className="float-left">
                    <TouchableOpacity className="btn btn-small clear-border transparent-background cta-color" onClick={() => this.editComment(index,'posting',false)}>Cancel</TouchableOpacity>
                  </View>
                  <View className="float-left left-padding-15">
                    <TouchableOpacity className={(this.state.myEditedComment) ? "btn btn-small" : "btn btn-small wash-out-2"} disabled={disabled} onClick={() => this.postComment(index, 'posting')}>Post</TouchableOpacity>
                  </View>
                </View>
              )}

              <View className="clear" />
              <View className="spacer" />
            </View>

            <View className="clear" />
            <View className="spacer" />

            <View className="left-margin-58">
              <View className="float-left right-margin">
                <TouchableOpacity className="btn background-button" disabled={this.state.savingLike} onClick={() => this.likeItem(index,'posting') }>
                  <Image src={this.state.comments[index].likes.includes(this.state.emailId) ? thumbsUpIconBlue : thumbsUpIconGrey} alt="Thumbs up icon logo" className="image-auto-25" />
                </TouchableOpacity>
              </View>
              <View className="float-left right-margin">
                <label>{this.state.comments[i - 1].likes.length} Likes</label>
              </View>

              <View className="vertical-separator" />

              <View className="float-left left-margin right-margin">
                <TouchableOpacity className="btn background-button" onClick={() => this.showReplies(index,'posting') }>
                  <Image src={commentIconGrey} alt="Thumbs up icon logo" className="image-auto-25" />
                </TouchableOpacity>
              </View>
              <View className="float-left">
                <TouchableOpacity className="btn background-button" onClick={() => this.showReplies(index,'posting') }>
                  <label>{this.state.comments[i - 1].replies.length} Replies</label>
                </TouchableOpacity>
              </View>
              <View className="clear" />
            </View>
            <View className="spacer" />
            {(this.state.comments[i - 1].showReplies) && (
              <View className="left-margin-58">
                {this.renderReplies(index,'posting')}
              </View>
            )}

            <View className="spacer" /><View className="spacer" />
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

          <View className="float-left right-margin-8">
            <View className="spacer" />
            {(window.location.pathname.includes('/organizations')) ? (
              <Image src={(this.state.orgLogo) ? this.state.orgLogo : profileIconBig} alt="img" className="image-40-fit" />
            ) : (
              <View>
                {(window.location.pathname.includes('/employers')) ? (
                  <Image src={(this.state.employerLogo) ? this.state.employerLogo : profileIconBig} alt="img" className="image-40-fit" />
                ) : (
                  <Image src={(this.state.pictureURL) ? this.state.pictureURL : profileIconBig} alt="img" className="profile-thumbnail-1" />
                )}
              </View>
            )}
          </View>
          <View className="comment-container">
            <TextInput
              className="edit-comment"
              onChangeText={(text) => this.formChangeHandler("reply|" + index)}
              value={myReply}
              placeholder="Add a reply..."
              placeholderTextColor="grey"
            />
          </View>
          <View className="clear" />
          {(this.state.myReplies[index] !== '') && (
            <View className="left-margin-67">
              <TouchableOpacity className="btn btn-small" onClick={() => this.postComment(index,postType)}>Reply</TouchableOpacity>
            </View>
          )}

          <View className="spacer" /><View className="spacer" />

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
              <View className="spacer" />
              <View className="float-left right-padding-8">
                <Image src={(replies[i - 1].pictureURL) ? replies[i - 1].pictureURL : profileIconBig} alt="img" className="profile-thumbnail-1" />
              </View>

              <View className={"comment-bubble-2 calc-column-offset-48 " + commentBackgroundColor}>
                <View className="calc-column-offset-100">
                  <label className="description-text-2 bold-text">{replies[i - 1].firstName} {replies[i - 1].lastName}</label>
                  <View className="clear" />
                  <label className="description-text-3">{replies[i - 1].roleName}</label>
                  <View className="clear" />
                </View>
                <View className="fixed-column-100">
                  <View className="float-left">
                    <label className="description-text-3">{dateString}</label>
                  </View>
                  <View className="clear" />
                </View>

                <View className="clear" />

                <View className="spacer" />
                <label className="description-text-2">{replies[i - 1].comment}</label>
                <View className="clear" />
              </View>

              <View className="clear" />
              <View className="spacer" />

            </View>
          )
        }
      }

      return rows
    }

    postComment(index, type, subCommentIndex) {
      console.log('postComment called ', index, type, subCommentIndex)

      if (window.location.pathname.includes('/problem-platform')) {
        this.props.history.push({ pathname: '/problem-platform/' + this.state.selectedOpportunity._id + '/checkout', state: { selectedItem: this.state.selectedOpportunity }})
      } else {
        this.setState({ serverErrorMessage: '', serverSuccessMessage: '', disableSubmit: true })

        //submit the selected project
        const email = this.state.emailId
        let firstName = this.state.cuFirstName
        let lastName = this.state.cuLastName
        let roleName = "Student"
        if (this.props.path && this.props.path.includes('/app')) {
          roleName = 'Student'
        } else if (window.location.pathname.includes('/organizations')) {
          firstName = this.state.postingOrgName
          lastName = ''
          roleName = "Admin"
        } else if (window.location.pathname.includes('/employers')) {
          firstName = this.state.employerName
          lastName = ''
          roleName = this.state.jobTitle
        } else {
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
          if (window.location.pathname.includes('/organizations')) {
            pictureURL = this.state.orgLogo
          } else if (window.location.pathname.includes('/employers')) {
            pictureURL = this.state.employerLogo
          }

          const reply = {
              firstName, lastName, email, roleName, comment,
              orgCode, orgName, orgContactEmail,
              pictureURL, createdAt, updatedAt
          }

          Axios.post('https://www.guidedcomapss.com/api/comments/reply', {
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
          console.log('in submission')

          let commentId = null
          const commentType = type
          let pictureURL = this.state.pictureURL
          if (window.location.pathname.includes('/organizations')) {
            pictureURL = this.state.orgLogo
          } else if (window.location.pathname.includes('/employers')) {
            pictureURL = this.state.employerLogo
          }

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
          Axios.post('https://www.guidedcomapss.com/api/comments', {
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
          console.log('in posting')

          let commentId = null
          let commentType = type
          let replies = []
          let comment = this.state.myComment

          let postingTitle = ''
          let contributorFirstName = ''
          let contributorEmail = ''

          let isGroup = false

          // console.log('going in 1', this.state.selectedOpportunity, this.state.selectedGroup)
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
          } else {

            parentPostId = this.state.selectedGroupPost._id
            postingTitle = this.state.selectedGroupPost.message
            contributorFirstName = this.state.selectedGroupPost.firstName
            contributorEmail = this.state.selectedGroupPost.email
            isGroup = true
          }

          let pictureURL = this.state.pictureURL
          if (window.location.pathname.includes('/organizations')) {
            pictureURL = this.state.orgLogo
          } else if (window.location.pathname.includes('/employers')) {
            pictureURL = this.state.employerLogo
          }

          if (index || index === 0) {
            commentId = this.state.comments[index]._id
            comment = this.state.myEditedComment
            likes = this.state.comments[index].likes
            replies = this.state.comments[index].replies
          }

          //save comment
          Axios.post('https://www.guidedcomapss.com/api/comments', {
            commentId, commentType, email, firstName, lastName, roleName, comment, pictureURL, likes, replies,
            parentPostId, parentCommentId, createdAt, updatedAt, postingTitle, contributorFirstName, contributorEmail,
            isGroup,
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
    }

    render() {

      let registerLink = '/organizations/' + this.state.activeOrg + '/student/signin'
      if (!this.state.activeOrg || this.state.activeOrg === '') {
        registerLink = '/signin'
      }

      return (
        <View>
          {(this.state.selectedOpportunity || this.state.selectedGroup || this.state.selectedGroupPost || this.state.selectedCurriculumPost) ? (
            <View>
              <View>
                <View>
                  <View className="float-left right-padding-8">
                    <View className="spacer" />
                    {(window.location.pathname.includes('/organizations')) ? (
                      <Image src={(this.state.orgLogo) ? this.state.orgLogo : profileIconBig} alt="img" className="image-50-fit" />
                    ) : (
                      <View>
                        {(window.location.pathname.includes('/employers')) ? (
                          <Image src={(this.state.employerLogo) ? this.state.employerLogo : profileIconBig} alt="img" className="image-50-fit" />
                        ) : (
                          <Image src={(this.state.pictureURL) ? this.state.pictureURL : profileIconBig} alt="img" className="profile-thumbnail-2" />
                        )}
                      </View>
                    )}
                  </View>
                  <View className="comment-container" >
                    <TextInput
                      className="text-field comment-text-field"
                      onChangeText={(text) => this.formChangeHandler('comment')}
                      value={this.state.myComment}
                      placeholder="Add a comment..."
                      placeholderTextColor="grey"
                    />
                  </View>

                  <View className="clear" />
                  {(this.state.myComment !== '') && (
                    <View className="left-margin-67">
                      <TouchableOpacity className="btn btn-primary" disabled={this.state.disableSubmit} onClick={() => this.postComment(null,'posting')}>Post</TouchableOpacity>
                    </View>
                  )}
                  <View className="spacer" /><View className="spacer" />
                </View>
                {this.renderComments()}
              </View>
            </View>
          ) : (
            <View>
              <Text className="error-message">There was an error</Text>
            </View>
          )}


        </View>
      )
    }
}

export default Comments;