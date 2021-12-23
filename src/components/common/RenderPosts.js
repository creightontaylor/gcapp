import React, {Component} from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, Linking } from 'react-native';
import Axios from 'axios';
import Modal from 'react-native-modal';
const styles = require('../css/style');

// import {
//   EmailShareButton,FacebookShareButton,LinkedinShareButton, PinterestShareButton,RedditShareButton,
//   TwitterShareButton,WhatsappShareButton,WorkplaceShareButton,
//
//   EmailIcon,FacebookIcon,LinkedinIcon, PinterestIcon,RedditIcon,TwitterIcon,WhatsappIcon, WorkplaceIcon
// } from "react-share";

const experienceIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/experience-icon.png'
const educationIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/education-icon.png'
const favoritesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-dark.png'
const trendsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/trends-icon-dark.png'
const likeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/like-icon-blue.png'
const likeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/like-icon-dark.png'
const commentIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/comment-icon-dark.png'
const shareIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/share-icon-dark.png'
const sendIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/send-icon-dark.png'
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png'
const careerMatchesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-dark.png'
const projectsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-dark.png'
const menuIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/menu-icon-dark.png'
const reportIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/report-icon-dark.png'
const hideIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/hide-icon-dark.png'
const checkboxEmpty = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkbox-empty.png'
const checkboxChecked = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkbox-checked.png'
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png'
const dropdownArrow = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/drowdown-arrow.png'
const targetIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/target-icon.png'
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png'
const pinIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/pin-icon.png'
const upvoteIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-blue.png'
const upvoteIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/upvote-icon-grey.png'

import SubComments from '../common/Comments';
import SubCreatePost from '../common/CreatePost';

import {convertDateToString} from '../functions/convertDateToString';

class RenderPosts extends Component {
    constructor(props) {
        super(props)

        this.state = {
          adjustFeedPreferenceOptions: [
            "I'm not interested in the author",
            "I'm not interested in this topic",
            "I've seen too many posts on this topic",
            "I've seen this post before",
            "This post is old",
            "It's something else",
          ],
          reportOptions: [
            "Suspicious or fake",
            "Harassment or hateful speech",
            "Violence or physical harm",
            "Adult content",
            "Intellectual property infringement or defamation",
          ],
        }

        this.renderPost = this.renderPost.bind(this)
        this.calculateWidth = this.calculateWidth.bind(this)
        this.renderOriginalPost = this.renderOriginalPost.bind(this)
        this.selectAnswer = this.selectAnswer.bind(this)
        this.retrieveComments = this.retrieveComments.bind(this)
        this.retrieveLikes = this.retrieveLikes.bind(this)
        this.togglePostMenu = this.togglePostMenu.bind(this)
        this.renderShareButtons = this.renderShareButtons.bind(this)
        this.voteOnItem = this.voteOnItem.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.itemClicked = this.itemClicked.bind(this)
        this.submitReport = this.submitReport.bind(this)
        this.showPollDetails = this.showPollDetails.bind(this)
        this.renderTaggedItem = this.renderTaggedItem.bind(this)
        this.passPosts = this.passPosts.bind(this)

    }

    componentDidMount() {
      //see if user is logged in

      this.retrieveData()

    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in renderPosts', this.props, prevProps)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode || this.props.posts !== prevProps.posts  || this.props.passedGroupPost !== prevProps.passedGroupPost) {
        this.retrieveData()
      }
    }

    retrieveData() {
      console.log('retrieveData called in renderPosts')

      let emailId = AsyncStorage.getItem('email');
      const username = AsyncStorage.getItem('username');
      const cuFirstName = AsyncStorage.getItem('firstName');
      const cuLastName = AsyncStorage.getItem('lastName');
      let activeOrg = AsyncStorage.getItem('activeOrg');
      if (!activeOrg) {
        activeOrg = 'guidedcompass'
      }
      const orgFocus = AsyncStorage.getItem('orgFocus');
      const roleName = AsyncStorage.getItem('roleName');
      let pictureURL = AsyncStorage.getItem('pictureURL');
      if (this.props.pictureURL && !pictureURL) {
        pictureURL = this.props.pictureURL
      }

      const posts = this.props.posts
      const passedGroupPost = this.props.passedGroupPost
      let modalIsOpen = false
      if (passedGroupPost) {
        modalIsOpen = true
      }
      const accountCode = this.props.accountCode

      this.setState({ emailId, cuFirstName, cuLastName, activeOrg, orgFocus, roleName, username, posts,
        passedGroupPost, modalIsOpen, pictureURL, accountCode })

    }

    closeModal() {

      this.setState({ modalIsOpen: false, showMessageWidget: false, showUpvotes: false, showComments: false, showShareButtons: false,
        sharePosting: false, adjustFeedPreferences: false, reportPostView: false, showDeletePost: false, showReports: false, originalPost: null
      });
    }

    favoriteItem(item, type) {
      console.log('favoriteItem called', item, type)

      this.setState({ errorMessage: null, successMessage: null, isSaving: true })

      let itemId = item._id

      let favoritesArray = this.state.favorites
      if (favoritesArray.includes(itemId)) {
        const index = favoritesArray.indexOf(itemId)
        favoritesArray.splice(index, 1)
      } else {
        favoritesArray.push(itemId)
      }

      Axios.post('https://www.guidedcomapss.com/api/favorites/save', {
        favoritesArray, emailId: this.state.emailId
      })
      .then((response) => {
        console.log('attempting to save addition to favorites')
        if (response.data.success) {
          console.log('saved addition to favorites', response.data)

          this.setState({ successMessage: 'Saved as a favorite!', favorites: favoritesArray, isSaving: false })

        } else {
          console.log('did not save successfully')
          this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false})
      });
    }

    calculateWidth(item, answer) {
      console.log('calculateWidth called', item, answer)

      let width = '0%'

      let aValue = 0
      if (item.aVotes) {
        aValue = item.aVotes.length
      }

      let bValue = 0
      if (item.bVotes) {
        bValue = item.bVotes.length
      }

      let totalValue = aValue + bValue
      if (totalValue > 0) {
        let numRawValue = 0
        if (answer === 'a') {
          numRawValue = (aValue / (aValue + bValue)) * 100
        } else {
          numRawValue = (bValue / (bValue + aValue)) * 100
        }
        if (numRawValue) {
          const roundedValue = numRawValue.toFixed()
          width = (roundedValue).toString() + '%'
        }
      }


      return width
    }

    renderPost(value, index, inModal, passedGroupPost) {
      console.log('renderPost called', passedGroupPost, value)

      if (value) {
        let defaultProfileItemIcon = projectsIconDark
        if (value.profileItem) {
          if (value.profileItem === 'Experience') {
            defaultProfileItemIcon = experienceIcon
          } else if (value.profileItem === 'Education') {
            defaultProfileItemIcon = educationIcon
          } else if (value.profileItem === 'Career Goal') {
            defaultProfileItemIcon = targetIcon
          } else if (value.profileItem === 'Passion') {
            defaultProfileItemIcon = favoritesIconDark
          }
        }

        let profileLink = "Profile"
        let isDisabled = false
        let newTab = false

        if (value.employerId) {
          profileLink = "EmployerProfile"
        }
        if (value.roleName === 'Admin') {
          profileLink = "OrgProfile"
        } else if (value.roleName === 'Teacher' || value.roleName === 'School Support' || value.roleName === 'Counselor' || value.roleName === 'WBLC' || value.roleName === 'Work-Based Learning Coordinator') {
          profileLink = "AdisorProfile"
          isDisabled = true
        }
        // if (this.props.fromAdvisor) {
        //   profileLink = '/advisor/advisees/' + value.email
        //   if (value.employerId) {
        //     profileLink = '/advisor/employers/' + value.employerId
        //   }
        //   if (value.roleName === 'Admin') {
        //     profileLink = '/advisor/orgs/' + value.orgCode
        //   } else if (value.roleName === 'Teacher' || value.roleName === 'School Support' || value.roleName === 'Counselor' || value.roleName === 'WBLC' || value.roleName === 'Work-Based Learning Coordinator') {
        //     profileLink = '/advisor/advisors/' + value.username
        //     isDisabled = true
        //   }
        // } else if (this.props.fromOrg) {
        //   profileLink = '/organizations/' + this.state.activeOrg + '/students/' + value.email
        //   if (value.employerId) {
        //     profileLink = '/organizations/' + this.state.activeOrg + '/employer-details/' + value.employerId
        //   }
        //   if (value.roleName === 'Admin') {
        //     profileLink = '/organizations/' + this.state.activeOrg + '/orgs/' + value.orgCode
        //   } else if (value.roleName === 'Teacher' || value.roleName === 'School Support' || value.roleName === 'Counselor' || value.roleName === 'WBLC' || value.roleName === 'Work-Based Learning Coordinator') {
        //     profileLink = '/organizations/' + this.state.activeOrg + '/advisors/' + value.username
        //     isDisabled = true
        //   }
        // } else if (this.props.fromEmployer) {
        //   profileLink = '/employers/' + this.state.accountCode + '/career-seekers/' + value.email
        //   if (value.employerId) {
        //     profileLink = '/employers/pages/' + this.state.accountCode
        //     newTab = true
        //   }
        //   if (value.roleName === 'Admin') {
        //     profileLink = '/organizations/' + this.state.activeOrg + '/orgs/' + value.orgCode
        //   } else if (value.roleName === 'Teacher' || value.roleName === 'School Support' || value.roleName === 'Counselor' || value.roleName === 'WBLC' || value.roleName === 'Work-Based Learning Coordinator') {
        //     profileLink = '/organizations/' + this.state.activeOrg + '/advisors/' + value.username
        //     isDisabled = true
        //   }
        // }

        return (
          <View key={value + index}>
            <View style={(!inModal) && [styles.card, styles.topMargin20]}>
              <View style={styles.rowDirection}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value.username })} style={[styles.rowDirection, styles.flexGrow]}>
                  <View style={[styles.width70, styles.rightPadding]}>
                    <Image source={(value.pictureURL) ? { uri: value.pictureURL} : { uri: profileIconDark}} style={[styles.profileThumbnail50,styles.standardBorder]} alt="GC" />
                  </View>
                  <View style={[styles.flexGrow,styles.rowDirection]} >
                    <View style={styles.flexGrow}>
                      <View style={styles.rowDirection}>
                        <Text style={[styles.headingText5, styles.boldText,styles.flexGrow]}>{value.firstName} {value.lastName}</Text>
                        {(value.pinned) && (
                          <View style={[styles.width25,styles.topPadding5,styles.leftPadding]}>
                            <Image source={{ uri: pinIcon}} style={[styles.square10,styles.contain]} alt="GC" />
                          </View>
                        )}

                        <Text style={[styles.descriptionText4,styles.descriptionTextColor,styles.width60]}>{convertDateToString(value.createdAt,"daysAgo")}</Text>
                      </View>


                      <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />

                      {(value.headline && value.headline !== '') ? (
                        <View>
                          <Text style={[styles.descriptionText3]}>{value.headline}</Text>
                        </View>
                      ) : (
                        <View>
                          {(value.education && value.education[0] && value.education[0].name && value.education[0].isContinual) ? (
                            <View>
                              {console.log('show edu: ', value.education)}
                              <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>Student @ {value.education[0].name}</Text>
                            </View>
                          ) : (
                            <View>
                              <View>
                                <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{this.state.orgName} Member</Text>
                              </View>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                  </View>
                </TouchableOpacity>

                <View style={styles.width80, styles.rightPadding}>
                  <TouchableOpacity onClick={(e) => this.voteOnItem(e, value, 'up', index) }>
                    <View style={[styles.standardBorder, styles.roundedCorners, styles.rowDirection]}>
                      <View style={styles.padding7}>
                        <Image source={(value.upvotes && value.upvotes.includes(this.state.emailId)) ? { uri: upvoteIconBlue} : { uri: upvoteIconGrey}} alt="GC" style={[styles.square15,styles.contain]}/>
                      </View>
                      <View style={styles.verticalSeparator} />
                      <View style={styles.horizontalPadding}>
                        <View style={styles.halfSpacer} />
                        <Text style={[styles.descriptionText2,styles.boldText]}>{(value.upvotes) ? value.upvotes.length : '0'}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={styles.row10}>
                <Text style={(value.postType !== 'alternatives') && styles.descriptionText2}>{value.message}</Text>
                {(value.url) && (
                  <Text onPress={() => Linking.openURL(value.url)} style={[styles.descriptionText3,styles.topPadding,styles.boldText]}>{value.url}</Text>
                )}

                {(value.postType === 'alternatives') && (
                  <View style={styles.topPadding}>

                    <View style={styles.row10}>
                      <TouchableOpacity style={styles.fullWidth} onClick={() => this.showPollDetails(value, index)}>
                        <View style={styles.rowDirection}>
                          <View>
                            <Text style={[styles.descriptionText3, styles.ctaColor]}>{(value.showPollDetails) ? "Collapse Details" : "Expand Details"}</Text>
                          </View>
                          <View style={[styles.leftPadding,styles.topPadding5]}>
                            <Image source={{ uri: dropdownArrow }} alt="GC" style={[styles.square8, styles.contain, styles.pinRight]} />
                          </View>
                        </View>
                      </TouchableOpacity>

                      {(value.showPollDetails) && (
                        <View>
                          <View style={styles.row10}>

                            {(value.aItem) && (
                              <View>
                                <View>
                                  {(value.comparisonType === 'Projects') && (
                                    <View>
                                      {this.renderTaggedItem(value, 'project', 'a')}
                                    </View>
                                  )}
                                  {(value.comparisonType === 'Careers') && (
                                    <View>
                                      {this.renderTaggedItem(value, 'career','a')}
                                    </View>
                                  )}
                                  {(value.comparisonType === 'Competencies') && (
                                    <View>
                                      {this.renderTaggedItem(value, 'competency','a')}
                                    </View>
                                  )}
                                  {(value.comparisonType === 'Jobs') && (
                                    <View>
                                      {this.renderTaggedItem(value, 'work','a')}
                                    </View>
                                  )}
                                </View>
                              </View>
                            )}
                            <Text style={styles.descriptionText3}>{value.aCase}</Text>
                          </View>

                          <View style={styles.row10}>
                            {(value.bItem) && (
                              <View>
                                <View>
                                  {(value.comparisonType === 'Projects') && (
                                    <View>
                                      {this.renderTaggedItem(value,'project','b')}
                                    </View>
                                  )}
                                  {(value.comparisonType === 'Careers') && (
                                    <View>
                                      {this.renderTaggedItem(value, 'career','b')}
                                    </View>
                                  )}
                                  {(value.comparisonType === 'Competencies') && (
                                    <View>
                                      {this.renderTaggedItem(value, 'competency','b')}
                                    </View>
                                  )}
                                  {(value.comparisonType === 'Jobs') && (
                                    <View>
                                      {this.renderTaggedItem(value, 'work','b')}
                                    </View>
                                  )}
                                </View>
                              </View>
                            )}
                            <Text style={styles.descriptionText3}>{value.bCase}</Text>
                          </View>
                        </View>
                      )}
                    </View>

                    {((value.aVotes && value.aVotes.includes(this.state.emailId)) || (value.bVotes && value.bVotes.includes(this.state.emailId))) ? (
                      <View>
                        <TouchableOpacity style={styles.fullWidth} onClick={() => this.selectAnswer(value, index,'a')}>
                          <View>
                            <View style={styles.progressBarFat} >
                              <View style={[styles.fillerError, { width: this.calculateWidth(value, 'a'), zIndex: -1, height: '36px' }]} />
                              <View style={[styles.row10, styles.horizontalPadding30, styles.topMarginNegative36, styles.rowDirection]}>
                                <View style={[styles.flexGrow]}>
                                  <Text style={styles.descriptionText2}>{value.aName}</Text>
                                </View>
                                <View style={[styles.width40, styles.rightText]} >
                                  <Text style={styles.descriptionText2}>{this.calculateWidth(value, 'a')}</Text>
                                </View>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.fullWidth} onClick={() => this.selectAnswer(value, index,'b')}>
                          <View>
                            <View style={styles.progressBarFat} >
                              <View style={[styles.fillerError, { width: this.calculateWidth(value, 'b'), zIndex: -1, height: '36px' }]} />
                              <View style={[styles.row10, styles.horizontalPadding30, styles.topMarginNegative36, styles.rowDirection]}>
                                <View style={[styles.flexGrow]}>
                                  <Text style={styles.descriptionText2}>{value.bName}</Text>
                                </View>
                                <View style={[styles.width40, styles.rightText]} >
                                  <Text style={styles.descriptionText2}>{this.calculateWidth(value, 'b')}</Text>
                                </View>

                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <TouchableOpacity style={styles.fullWidth} onClick={() => this.selectAnswer(value, index,'a')}>
                          <View style={[styles.row10,styles.horizontalPadding30, styles.ctaBorder]} style={[styles.row10,styles.horizontalPadding30,styles.ctaBorder]}>
                            <Text style={styles.descriptionText2}>{value.aName}</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.fullWidth} onClick={() => this.selectAnswer(value, index,'b')}>
                          <View style={[styles.row10, styles.horizontalPadding30, styles.ctaBorder]}>
                            <Text style={styles.descriptionText2}>{value.bName}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

              </View>

              {(value.imageURL) && (
                <View style={styles.row10}>
                  <Image source={{ uri: value.imageURL}} alt="GC" style={styles.imageFullAuto} />
                </View>
              )}

              {(value.videoURL) && (
                <View style={styles.row10}>
                  <View style={styles.spacer}/>

                  <View>
                    <View style={styles.videoContainer}>
                      <iframe
                        title="videoLink"
                        style={styles.videoIframe}
                        src={`${value.videoURL}`}
                        frameBorder="0"
                      />
                    </View>

                  </View>

                  <View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.halfSpacer}/>
                </View>
              )}

              {(value.profileItem) && (
                <View style={styles.bottomPadding}>
                  <View style={styles.ctaBorder}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('profile', { profileId: value.profileItem.objectId })} style={[styles.padding20, styles.fullWidth]}>
                      <View style={[styles.padding20, styles.rowDirection]}>
                        <View style={styles.width60}>
                          <Image source={(value.profileItem.imageURL) ? { uri: value.profileItem.imageURL } : { uri: defaultProfileItemIcon}} alt="GC" style={styles.square50} />
                        </View>
                        <View style={styles.flexGrow}>
                          <Text>{value.profileItem.name}</Text>
                          {(value.profileItem.category === 'Project') && (
                            <Text style={[styles.descriptionText3, styles.descriptionTextColor]} >{value.profileItem.category} | {value.profileItem.hours} Hours</Text>
                          )}
                          {(value.profileItem.category === 'Experience') && (
                            <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.profileItem.startDate} - {value.profileItem.endDate}</Text>
                          )}
                          {(value.profileItem.category === 'Education') && (
                            <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.profileItem.startDate} - {value.profileItem.endDate}</Text>
                          )}
                          {(value.profileItem.category === 'Career Goal') && (
                            <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>Deadline: {value.profileItem.deadline}</Text>
                          )}
                          {(value.profileItem.category === 'Passion') && (
                            <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>Last Updated {value.profileItem.updatedAt}</Text>
                          )}

                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {(value.opportunityTags && value.opportunityTags.length > 0) && (
                <View style={[styles.bottomPadding]}>
                  <View style={[styles.ctaBorder]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { objectId: value.opportunityTags[0]._id })} style={[styles.padding20,styles.fullWidth]}>
                      <View style={[styles.padding20]}>
                        <View style={[styles.width60]}>
                          <Image source={(value.opportunityTags[0].imageURL) ? { uri: value.opportunityTags[0].imageURL} : { uri: opportunitiesIconDark}} alt="GC" style={[styles.square50]} />
                        </View>
                        <View style={[styles.flexGrow]}>
                          {(value.opportunityTags[0].title) ? (
                            <Text>{value.opportunityTags[0].title}</Text>
                          ) : (
                            <Text>{value.opportunityTags[0].name}</Text>
                          )}

                          {(value.opportunityTags[0].employerName) && (
                            <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.opportunityTags[0].employerName}</Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {(value.careerTags && value.careerTags.length > 0) && (
                <View style={[styles.bottomPadding]}>
                  <View style={[styles.ctaBorder]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { objectId: value.careerTags[0].name })} style={[styles.padding20,styles.fullWidth]}>
                      <View style={[styles.padding20,styles.rowDirection]}>
                        <View style={[styles.width60]}>
                          <Image source={(value.careerTags[0].imageURL) ? { uri: value.careerTags[0].imageURL} : { uri: careerMatchesIconDark}} alt="GC" style={[styles.square50]} />
                        </View>
                        <View style={[styles.flexGrow]}>
                          <Text>{value.careerTags[0].name}</Text>
                          <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.careerTags[0].jobFamily}</Text>

                          {(value.careerTags[0].marketData) && (
                            <Text style={[styles.descriptionText3, styles.descriptionTextColor]}> | ${Number(value.careerTags[0].marketData.pay).toLocaleString()} avg pay</Text>
                          )}
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {(value.trendTags && value.trendTags.length > 0) && (
                <View style={[styles.bottomPadding]}>
                  <View style={[styles.ctaBorder]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Paths', { subNavSelected: 'Trends'})} style={[styles.padding20,styles.fullWidth]}>
                      <View style={[styles.padding20, styles.rowDirection]}>
                        <View style={[styles.width60]}>
                          <Image source={(value.trendTags[0].imageURL) ? { uri: value.trendTags[0].imageURL} : { uri: trendsIconDark}} alt="GC" style={[styles.square50]} />
                        </View>
                        <View style={styles.flexGrow}>
                          <Text>{value.trendTags[0].name}</Text>
                          <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.trendTags[0].category}</Text>
                        </View>

                        {(value.trendTags[0].percentChange) && (
                          <View style={[styles.width60]}>
                            <Text style={[styles.headingText3,styles.fullWidth,styles.rightText]}>{Number(value.trendTags[0].percentChange).toFixed()}%</Text>
                            <Text style={[styles.descriptionText5,styles.fullWidth,styles.rightText]}>increase in U.S. jobs</Text>
                          </View>
                        )}


                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {(value.tags && value.tags.length > 0) && (
                <View style={[styles.bottomPadding,styles.rowDirection]}>
                  {value.tags.map((item2, index2) =>
                    <View key={index2} style={[styles.rightPadding,styles.topPadding]}>
                      <View style={styles.tagContainerThin}>
                        <Text style={[styles.descriptionText4]}>{item2}</Text>
                      </View>
                    </View>
                  )}

                </View>
              )}

              {(value.entityTags && value.entityTags.length > 0) && (
                <View style={[styles.topPadding, styles.rowDirection]}>
                  {value.entityTags.map((value2, optionIndex2) =>
                    <View key={value2} style={styles.rightPadding}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value2.username})}>
                        <Image source={(value2.pictureURL) ? { uri: value2.pictureURL} : { uri: profileIconDark}} alt="GC" style={[styles.profileThumbnail25]} />
                      </TouchableOpacity>
                    </View>
                  )}

                </View>
              )}

              {(value.originalPost && value.originalPost.message) && (
                <View style={[styles.ctaBorder,styles.padding20]}>
                  {this.renderOriginalPost(value)}
                </View>
              )}

              {(value.upvotes || (value.comments && value.comments.length > 0)) && (
                <View style={[styles.bottomPadding5]}>
                  <View style={styles.width160}>
                    <TouchableOpacity onClick={() => this.retrieveLikes(index)}>
                      <Text style={[styles.descriptionText4]}>{(value.upvotes) ? value.upvotes.length : 0} Upvotes</Text>
                    </TouchableOpacity>
                    <Text style={[styles.descriptionText4,styles.horizontalPadding5]}>&#8226;</Text>
                    <TouchableOpacity onClick={() => this.retrieveComments(index)}>
                      <Text style={[styles.descriptionText4]}>{(value.commentCount) ? value.commentCount : 0} Comments</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              <View style={[styles.spacer]} />
              <View style={styles.horizontalLine} />

              {(!inModal) && (
                <View style={[styles.topPadding,styles.rowDirection]}>
                  <View>
                    <TouchableOpacity style={styles.rowDirection} onClick={(e) => this.voteOnItem(e, value, 'up', index) }>
                      <View style={styles.rightPadding8}>
                        <Image source={(value.upvotes.includes(this.state.emailId))? { uri: likeIconBlue} : { uri: likeIconDark}} alt="GC" style={[styles.square18,styles.centerHorizontally]} />
                      </View>
                      <View style={styles.rightPadding20}>
                        <Text style={(value.upvotes.includes(this.state.emailId)) ? [styles.descriptionText2,styles.ctaColor,styles.boldText] : [styles.descriptionText2]}>{(value.upvotes.includes(this.state.emailId)) ? "Liked" : "Like"}</Text>
                      </View>
                    </TouchableOpacity>
                  </View>

                  <View>
                    <TouchableOpacity style={styles.rowDirection} onClick={() => this.retrieveComments(index)} disabled={this.state.isLoading}>
                      <View style={styles.rightPadding8}>
                        <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                        <Image source={{ uri: commentIconDark}} alt="GC" style={[styles.square18,styles.centerHorizontally]} />
                      </View>
                      <View style={styles.rightPadding20}>
                        <Text style={[styles.descriptionText2]}>Comment</Text>
                      </View>

                    </TouchableOpacity>
                  </View>
                  <View>
                    <TouchableOpacity style={styles.rowDirection} onClick={(value.originalPost && value.originalPost.message) ? () => this.setState({ modalIsOpen: true, sharePosting: true, originalPost: value.originalPost, selectedIndex: index }) : () => this.setState({ modalIsOpen: true, sharePosting: true, originalPost: value, selectedIndex: index })}>
                      <View style={styles.rightPadding8}>
                        <Image source={{ uri: shareIconDark}} alt="GC" style={[styles.square18,styles.centerHorizontally]} />
                      </View>
                      <View style={styles.rightPadding20}>
                        <Text style={[styles.descriptionText2]}>Share</Text>
                      </View>

                    </TouchableOpacity>
                  </View>

                  <View>
                    <TouchableOpacity style={styles.rowDirection} onPress={() => this.props.navigation.navigate('Messages', { generalPost: value })}>
                      <View style={styles.rightPadding8}>
                        <Image source={{uri: sendIconDark}} alt="GC" style={[styles.square18,styles.centerHorizontally]} />
                      </View>
                      <View style={styles.rightPadding20}>
                        <Text style={[styles.descriptionText2]}>Send</Text>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          </View>
        )
      }
    }

    renderOriginalPost(value) {
      console.log('renderOriginalPost called', value)

      let defaultProfileItemIcon = projectsIconDark
      if (value.profileItem) {
        if (value.profileItem === 'Experience') {
          defaultProfileItemIcon = experienceIcon
        } else if (value.profileItem === 'Education') {
          defaultProfileItemIcon = educationIcon
        } else if (value.profileItem === 'Career Goal') {
          defaultProfileItemIcon = targetIcon
        } else if (value.profileItem === 'Passion') {
          defaultProfileItemIcon = favoritesIconDark
        }
      }

      let profileLink = '/app/profile/' + value.originalPost.username
      if (value.originalPost.employerId) {
        profileLink = '/app/employers/' + value.originalPost.employerId
      }

      return (
        <View key="originalPost">
          <View>
            <TouchableOpacity onPress={() => this.props.navigation.navigate(profileLink)} style={[styles.flexGrow,styles.rowDirection]}>
              <View style={styles.width55}>
                {(value.originalPost.roleName === 'Admin') ? (
                  <Image source={(value.originalPost.pictureURL) ? { uri: value.originalPost.pictureURL} : { uri: profileIconDark}} style={[styles.square40]} alt="GC" />
                ) : (
                  <Image source={(value.originalPost.pictureURL) ? { uri: value.originalPost.pictureURL} : { uri: profileIconDark}} style={[styles.profileThumbnail43]} alt="GC" />
                )}
              </View>
              <View style={styles.flexGrow}>
                <View style={styles.flexGrow}>
                  <Text style={[styles.descriptionText1,styles.boldText]}>{value.originalPost.firstName} {value.originalPost.lastName}</Text>
                </View>

                <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />

                {(value.originalPost.headline && value.originalPost.headline !== '') ? (
                  <View>
                    <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.originalPost.headline}</Text>
                  </View>
                ) : (
                  <View>
                    {(value.originalPost.education && value.originalPost.education[0] && value.originalPost.education[0].name && value.originalPost.education[0].isContinual) ? (
                      <View>
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>Student @ {value.originalPost.education[0].name}</Text>
                      </View>
                    ) : (
                      <View>
                        <View>
                          <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{this.state.orgName} Member</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
                <Text style={[styles.descriptionText4,styles.descriptionTextColor]}>{convertDateToString(value.originalPost.createdAt,"daysAgo")}</Text>
              </View>
            </TouchableOpacity>

            <View style={styles.width30}>

            </View>

          </View>

          <View style={[styles.row10]}>
            <Text style={[styles.descriptionText2]}>{value.originalPost.message}</Text>

            {(value.originalPost.url) && (
              <Text onPress={() => Linking.openURL(value.originalPost.url)} style={[styles.descriptionText4,styles.topPadding,styles.boldText]}>{value.originalPost.url}</Text>
            )}
          </View>
          {(value.originalPost.imageURL) && (
            <View style={[styles.row10]}>
              <Image source={{uri: value.originalPost.imageURL}} alt="GC" style={[styles.imageFullAuto]} />
            </View>
          )}

          {(value.originalPost.videoURL) && (
            <View style={[styles.row10]}>
              <View style={[styles.spacer]}/>

              <View>
                <View style={[styles.videoContainer]}>
                  <iframe
                    title="videoLink"
                    style={[styles.videoIframe]}
                    src={`${value.originalPost.videoURL}`}
                    frameBorder="0"
                  />
                </View>

              </View>


              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
            </View>
          )}

          {(value.originalPost.profileItem) && (
            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value.originalPost.username })} style={[styles.padding20,styles.fullWidth]}>
                  <View style={[styles.padding20]}>
                    <View style={[styles.width60]}>
                      <Image source={(value.originalPost.profileItem.imageURL) ? { uri: value.originalPost.profileItem.imageURL } : { uri: defaultProfileItemIcon }} alt="GC" style={[styles.square50]} />
                    </View>
                    <View style={[styles.flexGrow]}>
                      <Text>{value.originalPost.profileItem.name}</Text>
                      {(value.originalPost.profileItem.category === 'Project') && (
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.originalPost.profileItem.category} | {value.originalPost.profileItem.hours} Hours</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Experience') && (
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.originalPost.profileItem.startDate} - {value.originalPost.profileItem.endDate}</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Education') && (
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.originalPost.profileItem.startDate} - {value.originalPost.profileItem.endDate}</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Career Goal') && (
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>Deadline: {value.originalPost.profileItem.deadline}</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Passion') && (
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>Last Updated {value.originalPost.profileItem.updatedAt}</Text>
                      )}

                    </View>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.opportunityTags && value.originalPost.opportunityTags.length > 0) && (
            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { objectId: value.originalPost.opportunityTags[0]._id})} style={[styles.padding20,styles.fullWidth]}>
                  <View style={[styles.padding20]}>
                    <View style={[styles.width60]}>
                      <Image source={(value.originalPost.opportunityTags[0].imageURL) ? { uri: value.originalPost.opportunityTags[0].imageURL } : { uri: opportunitiesIconDark }} alt="GC" style={[styles.square50]} />
                    </View>
                    <View style={[styles.flexGrow]}>
                      {(value.originalPost.opportunityTags[0].title) ? (
                        <Text>{value.originalPost.opportunityTags[0].title}</Text>
                      ) : (
                        <Text>{value.originalPost.opportunityTags[0].name}</Text>
                      )}

                      {(value.originalPost.opportunityTags[0].employerName) && (
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.originalPost.opportunityTags[0].employerName}</Text>
                      )}

                    </View>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.careerTags && value.originalPost.careerTags.length > 0) && (
            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { objectId: value.originalPost.careerTags[0].name })} style={[styles.padding20,styles.fullWidth]}>
                  <View style={[styles.padding20]}>
                    <View style={[styles.width60]}>
                      <Image source={(value.originalPost.careerTags[0].imageURL) ? { uri: value.originalPost.careerTags[0].imageURL} : { uri: careerMatchesIconDark}} alt="GC" style={[styles.square50]} />
                    </View>
                    <View style={[styles.flexGrow]}>
                      <Text>{value.originalPost.careerTags[0].name}</Text>
                      <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.originalPost.careerTags[0].jobFamily}</Text>

                      {(value.originalPost.careerTags[0].marketData) && (
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}> | ${Number(value.originalPost.careerTags[0].marketData.pay).toLocaleString()} avg pay</Text>
                      )}

                    </View>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.trendTags && value.originalPost.trendTags.length > 0) && (
            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Paths', { subNavSelected: 'Trends'})} style={[styles.padding20,styles.fullWidth]}>
                  <View style={[styles.padding20]}>
                    <View style={[styles.width60]}>
                      <Image source={(value.originalPost.trendTags[0].imageURL) ? { uri: value.originalPost.trendTags[0].imageURL} : { uri: trendsIconDark}} alt="GC" style={[styles.square50]} />
                    </View>
                    <View style={styles.flexGrow}>
                      <Text>{value.originalPost.trendTags[0].name}</Text>
                      <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{value.originalPost.trendTags[0].category}</Text>
                    </View>

                    {(value.originalPost.trendTags[0].percentChange) && (
                      <View style={[styles.width60]}>
                        <Text style={[styles.headingText3,styles.fullWidth,styles.rightText]}>{Number(value.originalPost.trendTags[0].percentChange).toFixed()}%</Text>
                        <Text style={[styles.descriptionText5,styles.fullWidth,styles.rightText]}>increase in U.S. jobs</Text>
                      </View>
                    )}


                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.tags && value.originalPost.tags.length > 0) && (
            <View style={[styles.bottomPadding,styles.rowDirection]}>
              {value.originalPost.tags.map((item2, index2) =>
                <View key={index2} style={[styles.rightPadding,styles.topPadding]}>
                  <View style={styles.tagContainerThin}>
                    <Text style={[styles.descriptionText4]}>{item2}</Text>
                  </View>
                </View>
              )}

            </View>
          )}

          {(value.originalPost.entityTags && value.originalPost.entityTags.length > 0) && (
            <View style={[styles.topPadding,styles.rowDirection]}>
              {value.originalPost.entityTags.map((value2, optionIndex2) =>
                <View key={value2} style={styles.rightPadding}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value2.username })}>
                    <Image source={(value2.pictureURL) ? { uri: value2.pictureURL} : { uri: profileIconDark}} alt="GC" style={[styles.square20,styles.contain]} />
                  </TouchableOpacity>
                </View>
              )}

            </View>
          )}

        </View>
      )
    }

    selectAnswer(value, index,answer) {
      console.log('selectAnswer', answer)

      let posts = this.state.posts
      const emailId = this.state.emailId

      // do all this on the backend
      Axios.put('https://www.guidedcomapss.com/api/group-post/poll-vote', {  _id: posts[index]._id, answer, emailId })
      .then((response) => {
        console.log('Poll vote attempted', response.data);

          if (response.data.success) {
            console.log('successfully recorded poll vote')

            posts[index] = response.data.groupPost
            this.setState({ posts })

          } else {
            console.log('there was an error saving the poll data', response.data.message)

          }

      }).catch((error) => {
          console.log('there was an error saving the poll data', error);

      });

    }

    retrieveComments(index) {
      console.log('retrieveComments called', index)

      let parentPostId = this.state.posts[index]._id
      // if (index || index === 0) {
      //   parentPostId = this.state.posts[index]._id
      // } else {
      //   parentPostId = this.state.passedGroupPost
      // }
      // pull comments
      Axios.get('https://www.guidedcomapss.com/api/comments', { params: { parentPostId } })
      .then((response) => {
        console.log('Comments query attempted', response.data);

         if (response.data.success) {
           console.log('successfully retrieved comments')

           const comments = response.data.comments
           this.setState({ modalIsOpen: true, showComments: true, selectedIndex: index, comments })

         } else {
           console.log('no comments data found', response.data.message)
           this.setState({ modalIsOpen: true, showComments: true, selectedIndex: index, comments: [] })
         }
      }).catch((error) => {
         console.log('Comments query did not work', error);
         this.setState({ modalIsOpen: true, showComments: true, selectedIndex: index, comments: [] })
      });
    }

    retrieveLikes(index) {
      console.log('retrieveLikes called', index)

      const userIds = this.state.posts[index].upvotes
      if (userIds) {
        // pull comments
        Axios.get('https://www.guidedcomapss.com/api/users', { params: { userIds } })
        .then((response) => {
          console.log('Users query attempted', response.data);

           if (response.data.success) {
             console.log('successfully retrieved users')

             const upvotes = response.data.users
             this.setState({ modalIsOpen: true, showUpvotes: true, selectedIndex: index, upvotes })

           } else {
             console.log('no upvotes data found', response.data.message)
             this.setState({ modalIsOpen: true, showUpvotes: true, selectedIndex: index, upvotes: [] })
           }
        }).catch((error) => {
           console.log('Upvotes query did not work', error);
           this.setState({ modalIsOpen: true, showUpvotes: true, selectedIndex: index, upvotes: [] })
        });
      } else {
        this.setState({ modalIsOpen: true, showUpvotes: true, selectedIndex: index, upvotes: [] })
      }
    }

    togglePostMenu(index) {
      console.log('togglePostMenu called', index)

      let posts = this.state.posts
      if (posts[index].showPostMenu) {
        posts[index]['showPostMenu'] = false
      } else {
        posts[index]['showPostMenu'] = true
      }

      this.setState({ posts })

    }

    renderShareButtons() {
      console.log('renderShareButtons called')

      const shareURL = "https://www.guidedcompass.com/app/social-posts/" + this.state.posts[this.state.selectedIndex]._id
      const shareTitle = 'Check Out My Post On Guided Compass!'
      const shareBody = "Guided Compass is a great forum to connect with like-minded individuals, mentors / mentees, and opportunities."

      // return shareButtons
    }

    voteOnItem(e, item, direction, index) {
      console.log('voteOnItem called')

      this.setState({ successMessage: null, errorMessage: null })

      const _id = item._id
      const emailId = this.state.emailId
      let changeUpvote = true
      const updatedAt = new Date()

      Axios.post('https://www.guidedcomapss.com/api/group-posts', { _id, emailId, changeUpvote, updatedAt })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Group posts save worked', response.data);

          const successMessage = 'Group posting successfully updated!'

          let upvotes = item.upvotes
          let downvotes = item.downvotes

          if (direction === 'up') {
            console.log('in up')

            if (upvotes.includes(this.state.emailId)) {
              const removeIndex = upvotes.indexOf(this.state.emailId)
              if (removeIndex > -1) {
                upvotes.splice(removeIndex, 1);
                item['upvotes'] = upvotes
                changeUpvote = true

                if (index || index === 0) {
                  let posts = this.state.posts
                  posts[index]= item
                  this.setState({ posts, successMessage })
                } else {
                  const passedGroupPost = item
                  this.setState({ passedGroupPost, successMessage })
                }
              }
            } else {

              upvotes.push(this.state.emailId)
              changeUpvote = true

              if (downvotes.includes(this.state.emailId)) {
                const removeIndex = downvotes.indexOf(this.state.emailId)
                if (removeIndex > -1) {
                  downvotes.splice(removeIndex, 1);
                }

                item['upvotes'] = upvotes
                item['downvotes'] = downvotes

                if (index || index === 0) {
                  let posts = this.state.posts
                  posts[index] = item
                  this.setState({ posts, successMessage })
                } else {
                  const passedGroupPost = item
                  this.setState({ passedGroupPost, successMessage })
                }

              } else {

                item['upvotes'] = upvotes

                if (index || index === 0) {
                  let posts = this.state.posts
                  posts[index] = item
                  this.setState({ posts, successMessage })
                } else {
                  const passedGroupPost = item
                  this.setState({ passedGroupPost, successMessage })
                }
              }
            }

          } else {

            if (downvotes.includes(this.state.emailId)) {
              console.log('un-downvoting')
              const removeIndex = downvotes.indexOf(this.state.emailId)
              if (removeIndex > -1) {
                downvotes.splice(removeIndex, 1);
                item['downvotes'] = downvotes

                if (index || index === 0) {
                  let posts = this.state.posts
                  posts[index] = item
                  this.setState({ posts, successMessage })
                } else {
                  const passedGroupPost = item
                  this.setState({ passedGroupPost, successMessage })
                }
              }
            } else {
              console.log('initial downvote')
              downvotes.push(this.state.emailId)

              if (upvotes.includes(this.state.emailId)) {
                console.log('downvoting from previous upvote')
                const removeIndex = upvotes.indexOf(this.state.emailId)
                if (removeIndex > -1) {
                  upvotes.splice(removeIndex, 1);
                  changeUpvote = true
                }

                item['upvotes'] = upvotes
                item['downvotes'] = downvotes

                if (index || index === 0) {
                  let posts = this.state.posts
                  posts[index] = item
                  this.setState({ posts, successMessage })
                } else {
                  const passedGroupPost = item
                  this.setState({ passedGroupPost, successMessage })
                }

              } else {
                item['downvotes'] = downvotes

                if (index || index === 0) {
                  let posts = this.state.posts
                  posts[index] = item
                  this.setState({ posts, successMessage })
                } else {
                  const passedGroupPost = item
                  this.setState({ passedGroupPost, successMessage })
                }
              }
            }
          }

        } else {
          console.error('there was an error posting the group post');
          const errorMessage = response.data.message
          this.setState({ errorMessage })
        }
      }).catch((error) => {
          console.log('The talk post did not work', error);
      });
    }

    itemClicked(item, type) {
      console.log('itemClicked called', item, type)

      if (type === 'adjustFeedPreferences') {
        let selectedPreferences = this.state.selectedPreferences
        if (selectedPreferences) {
          if (selectedPreferences.includes(item)) {
            const index = selectedPreferences.indexOf(item)
            selectedPreferences.splice(index,1)
          } else {
            selectedPreferences.push(item)
          }
        } else {
          selectedPreferences = [item]
        }
        this.setState({ selectedPreferences })
      } else if (type === 'report') {

        let selectedReportReasons = this.state.selectedReportReasons
        if (selectedReportReasons) {
          if (selectedReportReasons.includes(item)) {
            const index = selectedReportReasons.indexOf(item)
            selectedReportReasons.splice(index,1)
          } else {
            selectedReportReasons.push(item)
          }
        } else {
          selectedReportReasons = [item]
        }
        this.setState({ selectedReportReasons })
      } else {
        let tags = this.state.tags
        if (tags.includes(item)) {
          const index = tags.indexOf(item)
          tags.splice(index, 1)
        } else {
          tags.push(item)
        }
        this.setState({ tags })
      }
    }

    submitReport(type) {
      console.log('submitReport called', type)

      this.setState({ isSaving: true, errorMessage: null, successMessage: null })

      const postId = this.state.posts[this.state.selectedIndex]._id
      const postName = this.state.posts[this.state.selectedIndex].message
      const emailId = this.state.emailId
      const posterFirstName = this.state.cuFirstName
      const posterLastName = this.state.cuLastName

      let selectedPreferences = this.state.selectedPreferences
      if (type === 'report') {
        selectedPreferences = this.state.selectedReportReasons
      }

      Axios.post('https://www.guidedcomapss.com/api/group-posts/report', {
        postId, postName, emailId, posterFirstName, posterLastName, type, selectedPreferences
      }).then((response) => {
        console.log('attempting to remove favorites')
        if (response.data.success) {
          console.log('saved removal from favorites', response.data)

          let posts = this.state.posts
          posts.splice(this.state.selectedIndex,1)
          this.setState({ posts, successMessage: response.data.message, isSaving: false })
          this.closeModal()
        } else {
          console.log('did not save successfully')
          this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false })
      });
    }

    showPollDetails(value, index) {
      console.log('showPollDetails called', value, index)

      let posts = this.state.posts
      if (posts[index].showPollDetails) {
        posts[index]['showPollDetails'] = false
      } else {
        posts[index]['showPollDetails'] = true
      }

      this.setState({ posts })
    }

    renderTaggedItem(item, type, answer) {
      console.log('renderTaggedItem called', item, type, answer)

      let defaultProfileItemIcon = projectsIconDark
      if (type === 'project') {
        defaultProfileItemIcon = projectsIconDark
      } else if (type === 'career') {
        defaultProfileItemIcon = careerMatchesIconDark
      } else if (type === 'competency') {
        defaultProfileItemIcon = educationIcon
      } else if (type === 'work') {
        defaultProfileItemIcon = opportunitiesIconDark
      }

      let itemObject = item.aItem
      if (answer === 'b') {
        itemObject = item.bItem
      }

      if (type === 'project') {

        return (
          <View key="taggedProjectItem">
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { objectId: itemObject._id })} style={[styles.fullWidth,styles.rowDirection]}>
              <View style={styles.flexGrow}>
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View style={styles.width80}>
                {(answer === 'a') ? (
                  <View>
                    {(item.aValue) && (
                      <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.aValue}</Text>
                    )}
                  </View>
                ) : (
                  <View>
                    {(item.bValue) && (
                      <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.bValue}</Text>
                    )}
                  </View>
                )}
              </View>

            </TouchableOpacity>

            <View style={[styles.row5]}>
              <View style={[styles.bottomPadding]}>
                <View style={[styles.ctaBorder]}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { objectId: itemObject._id })} style={[styles.padding20,styles.fullWidth]}>
                    <View style={[styles.padding20]}>
                      <View style={[styles.width60]}>
                        <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} alt="GC" style={[styles.square50]} />
                      </View>
                      <View style={[styles.flexGrow]}>
                        <Text>{itemObject.name}</Text>
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{itemObject.category} | {itemObject.hours} Hours</Text>
                      </View>

                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )
      } else if (type === 'work') {
        return (
          <View key="taggedWorkItem">
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { objectId: itemObject._id })} style={[styles.padding20,styles.fullWidth,styles.rowDirection]}>
              <View style={styles.flexGrow}>
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View style={styles.width80}>
                {(answer === 'a') ? (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.aValue}</Text>
                ) : (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.bValue}</Text>
                )}
              </View>

            </TouchableOpacity>

            <View style={[styles.row5]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails',  { objectId: itemObject._id })} style={[styles.padding20,styles.fullWidth]}>
                  <View style={[styles.padding20]}>
                    <View style={styles.width50}>
                      <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL } : { uri: defaultProfileItemIcon}} alt="GC" style={[styles.square40]} />
                    </View>
                    <View style={styles.flexGrow}>
                      {(itemObject.title) ? (
                        <Text>{itemObject.title}</Text>
                      ) : (
                        <Text>{itemObject.name}</Text>
                      )}

                      {(itemObject.employerName) && (
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{itemObject.employerName}</Text>
                      )}

                    </View>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (type === 'career') {
        return (
          <View key="taggedCareerItem">
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { objectId: itemObject.name })} style={[styles.padding20,styles.fullWidth, styles.rowDirection]}>
              <View style={styles.flexGrow}>
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View style={styles.width80}>
                {(answer === 'a') ? (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.aValue}</Text>
                ) : (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.bValue}</Text>
                )}
              </View>

            </TouchableOpacity>

            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { objectId: itemObject.name })} style={[styles.padding20,styles.fullWidth]}>
                  <View style={[styles.padding20]}>
                    <View style={[styles.width60]}>
                      <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} alt="GC" style={[styles.square50]} />
                    </View>
                    <View style={[styles.flexGrow]}>
                      <Text>{itemObject.name}</Text>
                      <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{itemObject.jobFamily}</Text>

                      {(itemObject.marketData) && (
                        <Text style={[styles.descriptionText3, styles.descriptionTextColor]}> | ${Number(itemObject.marketData.pay).toLocaleString()} avg pay</Text>
                      )}
                    </View>

                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (type === 'competency') {
        return (
          <View key="taggedCompetencyItem">
            <View style={[styles.bottomPadding,styles.rowDirection]}>
              <View style={styles.flexGrow}>
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View style={styles.width80}>
                {(answer === 'a') ? (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.aValue}</Text>
                ) : (
                  <Text style={[styles.boldText,styles.rightText,styles.ctaColor]}>${item.bValue}</Text>
                )}
              </View>

            </View>

            <View style={[styles.bottomPadding]}>
              <View style={[styles.ctaBorder]}>
                <View style={[styles.padding20,styles.fullWidth]}>
                  <View>
                    <View style={[styles.width60]}>
                      <Image source={(itemObject.imageURL) ? { uri: itemObject.imageURL} : { uri: defaultProfileItemIcon}} alt="GC" style={[styles.square50]} />
                    </View>
                    <View style={[styles.flexGrow]}>
                      <Text>{itemObject.name}</Text>
                      <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{itemObject.category}</Text>

                      {(itemObject.description) && (
                        <View>

                          <Text style={[styles.descriptionText3, styles.descriptionTextColor]}>{itemObject.description}</Text>
                        </View>
                      )}
                    </View>

                  </View>
                </View>
              </View>
            </View>
          </View>
        )

      }
    }

    passPosts(posts) {
      console.log('passPosts called')
      this.setState({ posts })
    }

    deletePost() {
      console.log('deletePost called')

      this.setState({ isSaving: true, successMessage: null, errorMessage: null })
      const _id = this.state.posts[this.state.selectedIndex]._id

      Axios.delete('https://www.guidedcomapss.com/api/group-posts/' + _id)
      .then((response) => {
        console.log('tried to delete the post', response.data)
        if (response.data.success) {
          //save values
          console.log('Post delete worked');

          let posts = this.state.posts
          posts.splice(this.state.selectedIndex, 1)
          this.setState({ posts, successMessage: 'Post was successfully deleted!' })

        } else {
          console.error('there was an error deleting the course');
          this.setState({ errorMessage: 'There was an error deleting the post'})
        }
      }).catch((error) => {
        console.log('The deleting did not work', error);
        this.setState({ errorMessage: 'There was an error deleting the post: ' + error})
      });
    }

    render() {

      return (
        <View>
          {(this.state.posts) && (
            <View>
              <View>
                {this.state.posts.map((value, index) =>
                  <View key={index}>
                    <View>
                      {this.renderPost(value, index)}
                    </View>
                  </View>
                )}
              </View>

              <Modal
               isOpen={this.state.modalIsOpen}
               onAfterOpen={this.afterOpenModal}
               onRequestClose={this.closeModal}
               className="modal"
               overlayClassName="modal-overlay"
               contentLabel="Example Modal"
               ariaHideApp={false}
             >
               <View key="showShareButtons" style={[styles.fullWidth]}>

                 {(this.state.showPost || this.state.sharePosting) && (
                   <View key="showPost" style={[styles.fullWidth,styles.padding20]}>
                      <SubCreatePost sharePosting={this.state.sharePosting} originalPost={this.state.originalPost} posts={this.state.posts} passPosts={this.passPosts} closeModal={this.closeModal} />
                    </View>
                 )}

                  {(this.state.showComments) && (
                    <View key="showPost" style={[styles.fullWidth,styles.padding20]}>
                      {this.renderPost(this.state.posts[this.state.selectedIndex], this.state.selectedIndex, true)}

                      <View style={[styles.spacer]} />

                      {(this.state.posts && this.state.activeOrg) && (
                        <SubComments selectedGroup={null} selectedGroupPost={this.state.posts[this.state.selectedIndex]} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} comments={this.state.comments} postingOrgCode={this.state.activeOrg} postingOrgName={this.state.orgName} orgContactEmail={this.state.orgContactEmail} pictureURL={this.state.pictureURL} orgLogo={this.state.orgLogo} history={this.props.history} pageSource={"newsFeed"} employerLogo={this.props.employerLogo} employerName={this.props.employerName} jobTitle={this.props.jobTitle} />
                      )}
                    </View>
                  )}

                  {(this.state.passedGroupPost) && (
                    <View key="passedGroupPost" style={[styles.fullWidth]}>

                     {this.renderPost(this.state.passedGroupPost, null, true, true)}

                     <View style={[styles.spacer]} />

                     {(this.state.passedGroupPost && this.state.activeOrg) && (
                       <SubComments selectedGroup={null} selectedGroupPost={this.state.passedGroupPost} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} comments={this.state.comments} postingOrgCode={this.state.activeOrg} postingOrgName={this.state.orgName} orgContactEmail={this.state.orgContactEmail} pictureURL={this.state.pictureURL} history={this.props.history} pageSource={"newsFeed"} employerLogo={this.props.employerLogo} employerName={this.props.employerName} jobTitle={this.props.jobTitle} />
                     )}

                    </View>
                  )}

                  {(this.state.showShareButtons) && (
                     <View style={[styles.fullWidth,styles.padding20,styles.centerText]}>
                       <Text style={[styles.headingText2]}>Share This Post with Friends!</Text>

                       <View style={[styles.topPadding20]}>
                         <Text>Share this link:</Text>
                         <Text style={[styles.boldText,styles.ctaColor]}>{"https://www.guidedcompass.com/app/social-posts/" + this.state.posts[this.state.selectedIndex]._id}</Text>
                       </View>

                       <View style={[styles.spacer]} />

                       <View style={[styles.topPadding20]}>
                         {this.renderShareButtons()}
                       </View>
                     </View>
                  )}

                  {(this.state.adjustFeedPreferences) && (
                    <View key="adjustFeedPreferences" style={[styles.fullWidth,styles.padding20]}>
                       <Text style={[styles.headingText4]}>Don't want to see this</Text>
                       <View style={[styles.spacer]} />

                       <View style={[styles.row10,styles.descriptionText2]}>
                         <Text>Tell us why you don't want to see this</Text>
                         <Text style={[styles.descriptionTextColor,styles.descriptionText2]}>Your feedback will help us improve your experience</Text>
                       </View>

                       <View style={[styles.spacer]} />

                       {this.state.adjustFeedPreferenceOptions.map((item2, index2) =>
                         <View key={index2} style={[styles.row5, styles.rowDirection]}>
                           <View style={styles.width40}>
                             {(this.state.selectedPreferences && this.state.selectedPreferences.includes(item2)) ? (
                               <TouchableOpacity onClick={() => this.itemClicked(item2,'adjustFeedPreferences') }>
                                 <Image source={{ uri: checkboxChecked }} alt="GC" style={[styles.square18,styles.contain]} />
                               </TouchableOpacity>
                             ) : (
                               <TouchableOpacity onClick={() => this.itemClicked(item2,'adjustFeedPreferences')}>
                                 <Image source={{ uri: checkboxEmpty }} alt="GC" style={[styles.square18,styles.contain]} />
                               </TouchableOpacity>
                             )}
                           </View>
                           <View style={styles.flexGrow}>
                             <Text style={[styles.descriptionText2]}>{item2}</Text>
                           </View>

                         </View>
                       )}

                       <View style={[styles.spacer]} />

                       <View style={[styles.row10,styles.descriptionText2]}>
                         <Text>If you think this post goes against our Professional Community Policies, please report this post.</Text>
                       </View>

                       <View style={[styles.spacer]} />

                       <TouchableOpacity style={[styles.btnSquarish,styles.whiteColor,styles.descriptionText1,styles.rightMargin,ctaBackgroundColor]} disabled={(this.state.isSaving) ? true : false} onClick={() => this.submitReport('preference')}>Submit</TouchableOpacity>
                       <TouchableOpacity style={[styles.btnSquarish,styles.ctaColor,styles.descriptionText1]} onClick={() => this.closeModal()}>Cancel</TouchableOpacity>
                     </View>
                  )}

                  {(this.state.reportPostView) && (
                    <View key="reportPostView" style={[styles.fullWidth,styles.padding20]}>
                       <Text style={[styles.headingText4]}>Report</Text>
                       <View style={[styles.spacer]} />

                       <View style={[styles.row10,styles.descriptionText2]}>
                         <Text>Why are you reporting this?</Text>
                         <Text style={[styles.descriptionTextColor,styles.descriptionText2]}>Your feedback will help us improve your experience</Text>
                       </View>

                       <View style={[styles.spacer]} />

                       {this.state.reportOptions.map((item2, index2) =>
                         <View key={index2} style={[styles.row5]}>
                           <View style={styles.width40}>
                             {(this.state.selectedReportReasons && this.state.selectedReportReasons.includes(item2)) ? (
                               <TouchableOpacity onClick={() => this.itemClicked(item2,'report') }>
                                 <Image source={{ uri: checkboxChecked }} alt="GC" style={[styles.square18,styles.contain]} />
                               </TouchableOpacity>
                             ) : (
                               <TouchableOpacity onClick={() => this.itemClicked(item2,'report')}>
                                 <Image source={{ uri: checkboxEmpty }} alt="GC" style={[styles.square18,styles.contain]} />
                               </TouchableOpacity>
                             )}
                           </View>
                           <View style={styles.flexGrow}>
                             <Text style={[styles.descriptionText2]}>{item2}</Text>
                           </View>
                         </View>
                       )}

                       <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                       <TouchableOpacity style={[styles.btnSquarish,styles.whiteColor,styles.descriptionText1,styles.rightMargin,ctaBackgroundColor]} disabled={(this.state.isSaving) ? true : false} onClick={() => this.submitReport('report')}>Submit</TouchableOpacity>
                       <TouchableOpacity style={[styles.btnSquarish,styles.ctaColor,styles.descriptionText1]} onClick={() => this.closeModal()}>Cancel</TouchableOpacity>
                     </View>
                  )}

                  {(this.state.showDeletePost) && (
                    <View key="deletePost" style={[styles.fullWidth,styles.padding20]}>
                      <Text style={[styles.headingText4]}>Are you sure you want to delete this post?</Text>
                      <View style={[styles.spacer]} />

                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                      <TouchableOpacity style={[styles.btnSquarish,styles.whiteColor,styles.descriptionText1,styles.errorBackgroundColor, styles.rightMargin]} disabled={(this.state.isSaving) ? true : false} onClick={() => this.deletePost()}>Delete</TouchableOpacity>
                      <TouchableOpacity style={[styles.btnSquarish,styles.ctaColor,styles.descriptionText1]} onClick={() => this.closeModal()}>Cancel</TouchableOpacity>
                    </View>
                  )}

                  {(this.state.showReports) && (
                    <View key="reports" style={[styles.fullWidth,styles.padding20]}>
                      <Text style={[styles.headingText4]}>Reports on this post</Text>
                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                      <Text style={[styles.descriptionTextColor,styles.descriptionText2]}>There has not been any reports on this post</Text>

                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                      <TouchableOpacity style={[styles.btnSquarish,styles.ctaColor,styles.descriptionText1]} onClick={() => this.closeModal()}>
                        <View style={styles.rowDirection}>
                          <View style={styles.topPadding5}><Image style={[styles.square11, styles.contain]} alt="img" source={{ uri: closeIcon }} /></View>
                          <View style={styles.leftPadding}>Close View</View>

                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                  {(this.state.showUpvotes) && (
                    <View key="showPost" style={[styles.fullWidth]}>
                      <View style={[styles.bottomPadding]}>
                        <Text style={[styles.headingText2]}>Post Upvotes</Text>
                      </View>

                     <View style={[styles.spacer]} />

                     {(this.state.upvotes && this.state.upvotes.length > 0) ? (
                       <View style={[styles.topPadding]}>
                         {this.state.upvotes.map((value, optionIndex) =>
                           <View key={"upvote|" + optionIndex}>
                             <View style={styles.rowDirection}>
                               <View style={[styles.width60]}>
                                 <Image source={(value.pictureURL) ? { uri: value.pictureURL } : { uri: profileIconDark}} alt="GC" style={styles.profileThumbnail50} />
                               </View>
                               <View style={[styles.flexGrow, styles.leftPadding, styles.topPadding5]}>
                                 <Text style={[styles.headingText4]}>{value.firstName} {value.lastName}</Text>
                               </View>

                             </View>
                           </View>
                         )}
                       </View>
                     ) : (
                       <View>
                         <Text style={[styles.errorColor]}>There are no upvotes</Text>
                       </View>
                     )}

                    </View>
                  )}

                  {(this.state.showReports) && (
                    <View key="reports" style={[styles.fullWidth,styles.padding20]}>
                      <Text style={[styles.headingText4]}>Reports on this post</Text>
                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                      <Text style={[styles.descriptionTextColor,styles.descriptionText2]}>There has not been any reports on this post</Text>

                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                      <TouchableOpacity style={[styles.btnSquarish,styles.ctaColor,styles.descriptionText1]} onClick={() => this.closeModal()}>
                        <View style={styles.rowDirection}>
                          <View style={styles.topPadding5}><Image style={[styles.square11, styles.contain]} alt="img" source={{ uri: closeIcon}} /></View>
                          <View style={styles.leftPadding}>Close View</View>

                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                </View>

             </Modal>
            </View>
          )}
        </View>
      )
    }
}

export default RenderPosts;
