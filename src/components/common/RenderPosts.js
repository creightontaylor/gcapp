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

const experienceIcon = ''
const educationIcon = ''
const favoritesIconDark = ''
const trendsIconDark = ''
const likeIconBlue = ''
const likeIconDark = ''
const commentIconDark = ''
const shareIconDark = ''
const sendIconDark = ''
const opportunitiesIconDark = ''
const careerMatchesIconDark = ''
const projectsIconDark = ''
const menuIconDark = ''
const reportIconDark = ''
const hideIconDark = ''
const checkboxEmpty = ''
const checkboxChecked = ''
const closeIcon = ''
const dropdownArrow = ''
const targetIcon = ''
const profileIconDark = ''
const pinIcon = ''
const upvoteIconBlue = ''
const upvoteIconGrey = ''

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
            <View className={(!inModal) && "card top-margin-20"}>
              <View>
                <TouchableOpacity onPress={() => console.log('go to profile')} className="background-button left-text standard-color profile-container-right calc-column-offset-80">
                  <View className="fixed-column-70 right-padding">
                    {(value.roleName === 'Admin') ? (
                      <Image src={(value.pictureURL) ? value.pictureURL : profileIconDark} className="image-60-fit" alt="GC" />
                    ) : (
                      <Image src={(value.pictureURL) ? value.pictureURL : profileIconDark} className="profile-thumbnail-2 standard-border" alt="GC" />
                    )}
                  </View>
                  <View className="calc-column-offset-70">
                    <View className="calc-column-offset-25">
                      <Text className="heading-text-5 bold-text">{value.firstName} {value.lastName}</Text>
                    </View>
                    {(value.pinned) && (
                      <View className="fixed-column-25 top-padding-5 left-padding">
                        <Image src={pinIcon} className="image-auto-10" alt="GC" />
                      </View>
                    )}
                    <View className="clear" />

                    <View className="mini-spacer" /><View className="mini-spacer" />

                    {(value.headline && value.headline !== '') ? (
                      <View>
                        <Text className="description-text-3">{value.headline}</Text>
                      </View>
                    ) : (
                      <View>
                        {(value.education && value.education[0] && value.education[0].name && value.education[0].isContinual) ? (
                          <View>
                            {console.log('show edu: ', value.education)}
                            <Text className="description-text-3 description-text-color">Student @ {value.education[0].name}</Text>
                          </View>
                        ) : (
                          <View>
                            <View>
                              <Text className="description-text-3 description-text-color">{this.state.orgName} Member</Text>
                            </View>
                          </View>
                        )}
                      </View>
                    )}
                    <Text className="description-text-4 description-text-color">{convertDateToString(value.createdAt,"daysAgo")}</Text>
                  </View>
                </TouchableOpacity>

                <View className="profile-modal-right">
                  <View>
                    <View className="fixed-column-55">
                      <Image src={(value.pictureURL) ? value.pictureURL : profileIconDark} className="profile-thumbnail-43" alt="GC" />
                    </View>
                    <View className="calc-column-offset-55">
                      <Text className="description-text-2 bold-text">{value.firstName} {value.lastName}</Text>

                      {(value.headline && value.headline !== '') ? (
                        <View>
                          <Text className="description-text-4 description-text-color">{value.headline}</Text>
                        </View>
                      ) : (
                        <View>
                          {(value.education && value.education[0] && value.education[0].name && value.education[0].isContinual) ? (
                            <View>
                              <Text className="description-text-4 description-text-color">Student @ {value.education[0].name}</Text>
                            </View>
                          ) : (
                            <View>
                              <View>
                                <Text className="description-text-4 description-text-color">{this.state.orgName} Member</Text>
                              </View>
                            </View>
                          )}
                        </View>
                      )}

                      <Text className="description-text-4 description-text-color">{convertDateToString(value.createdAt,"daysAgo")}</Text>
                    </View>
                    <View className="clear" />
                  </View>

                  <View className="top-padding-20">
                    <TouchableOpacity onPress={() => this.props.navigation.navigate("Messages", { recipient: value })} className="background-button full-width"><TouchableOpacity className="btn btn-squarish full-width"><Text>Message</Text></TouchableOpacity></TouchableOpacity>
                  </View>
                </View>

                <View className="fixed-column-80 right-padding">
                  <TouchableOpacity className="background-button" onClick={(e) => this.voteOnItem(e, value, 'up', index) }>
                    <View className="standard-border rounded-corners">
                      <View className="float-left padding-7">
                        <Image src={(value.upvotes && value.upvotes.includes(this.state.emailId)) ? upvoteIconBlue : upvoteIconGrey} alt="GC" className="image-auto-15"/>
                      </View>
                      <View className="vertical-separator-4" />
                      <View className="float-left horizontal-padding-10">
                        <View className="half-spacer" />
                        <Text className="description-text-2 half-bold-text">{(value.upvotes) ? value.upvotes.length : '0'}</Text>
                      </View>
                      <View className="clear" />
                    </View>
                  </TouchableOpacity>
                </View>

                <View className="clear" />
              </View>

              <View className="row-10">
                <Text className={(value.postType === 'alternatives') ? "" : "description-text-2"}>{value.message}</Text>
                {(value.url) && (
                  <Text onPress={() => Linking.openURL(value.url)} className="description-text-3 top-padding bold-text" target="_blank">{value.url}</Text>
                )}

                {(value.postType === 'alternatives') && (
                  <View className="top-padding">

                    <View className="row-10">
                      <TouchableOpacity className="background-button full-width left-text" onClick={() => this.showPollDetails(value, index)}>
                        <View>
                          <View className="float-left">
                            <Text className="description-text-3 cta-color">{(value.showPollDetails) ? "Collapse Details" : "Expand Details"}</Text>
                          </View>
                          <View className="float-left left-padding top-padding-5">
                            <Image src={dropdownArrow} alt="GC" className="image-auto-8 pin-right" />
                          </View>
                          <View className="clear" />

                        </View>
                      </TouchableOpacity>

                      {(value.showPollDetails) && (
                        <View>
                          <View className="row-10">

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
                            <Text className="description-text-3">{value.aCase}</Text>
                          </View>

                          <View className="row-10">
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
                            <Text className="description-text-3">{value.bCase}</Text>
                          </View>
                        </View>
                      )}
                    </View>

                    {((value.aVotes && value.aVotes.includes(this.state.emailId)) || (value.bVotes && value.bVotes.includes(this.state.emailId))) ? (
                      <View>
                        <TouchableOpacity className="background-button full-width" onClick={() => this.selectAnswer(value, index,'a')}>
                          <View>
                            <View className="progress-bar-fat" >
                              <View className="filler-error" style={{ width: this.calculateWidth(value, 'a'), zIndex: -1, height: '36px' }} />
                              <View className="row-10 horizontal-padding " style={{ marginTop: '-36px'}}>
                                <View className="calc-column-offset-40 left-text">
                                  <Text className="description-text-2 curtail-text">{value.aName}</Text>
                                </View>
                                <View className="fixed-column-40 right-text">
                                  <Text className="description-text-2 curtail-text">{this.calculateWidth(value, 'a')}</Text>
                                </View>
                                <View className="clear" />
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="background-button full-width" onClick={() => this.selectAnswer(value, index,'b')}>
                          <View>
                            <View className="progress-bar-fat" >
                              <View className="filler-error" style={{ width: this.calculateWidth(value, 'b'), zIndex: -1, height: '36px' }} />
                              <View className="row-10 horizontal-padding" style={{ marginTop: '-36px'}}>
                                <View className="calc-column-offset-40 left-text">
                                  <Text className="description-text-2 curtail-text">{value.bName}</Text>
                                </View>
                                <View className="fixed-column-40 right-text">
                                  <Text className="description-text-2 curtail-text">{this.calculateWidth(value, 'b')}</Text>
                                </View>
                                <View className="clear" />
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>
                    ) : (
                      <View>
                        <TouchableOpacity className="background-button full-width" onClick={() => this.selectAnswer(value, index,'a')}>
                          <View className="row-10 horizontal-padding cta-border">
                            <Text className="description-text-2">{value.aName}</Text>
                          </View>
                        </TouchableOpacity>
                        <TouchableOpacity className="background-button full-width" onClick={() => this.selectAnswer(value, index,'b')}>
                          <View className="row-10 horizontal-padding cta-border">
                            <Text className="description-text-2">{value.bName}</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                    )}
                  </View>
                )}

              </View>
              {/*
              {(value.imageURL) && (
                <View className="row-10">
                  <Image src={value.imageURL} alt="GC" className="image-full-auto" />
                </View>
              )}

              {(value.videoURL) && (
                <View className="row-10">
                  <View className="spacer"/>

                  <View>
                    <View className="video-container">
                      <iframe
                        title="videoLink"
                        className="video-iframe"
                        src={`${value.videoURL}`}
                        frameBorder="0"
                      />
                    </View>

                  </View>

                  <View className="clear" />
                  <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
                </View>
              )}

              {(value.profileItem) && (
                <View className="bottom-padding">
                  <View className="cta-border">
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('profile', { profileId: value.profileItem.objectId })} className="background-button standard-color padding-20 full-width">
                      <View className="padding-20">
                        <View className="fixed-column-60">
                          <Image src={(value.profileItem.imageURL) ? value.profileItem.imageURL : defaultProfileItemIcon} alt="GC" className="image-50-fit" />
                        </View>
                        <View className="calc-column-offset-60">
                          <Text>{value.profileItem.name}</Text>
                          {(value.profileItem.category === 'Project') && (
                            <Text className="description-text-3 description-text-color">{value.profileItem.category} | {value.profileItem.hours} Hours</Text>
                          )}
                          {(value.profileItem.category === 'Experience') && (
                            <Text className="description-text-3 description-text-color">{value.profileItem.startDate} - {value.profileItem.endDate}</Text>
                          )}
                          {(value.profileItem.category === 'Education') && (
                            <Text className="description-text-3 description-text-color">{value.profileItem.startDate} - {value.profileItem.endDate}</Text>
                          )}
                          {(value.profileItem.category === 'Career Goal') && (
                            <Text className="description-text-3 description-text-color">Deadline: {value.profileItem.deadline}</Text>
                          )}
                          {(value.profileItem.category === 'Passion') && (
                            <Text className="description-text-3 description-text-color">Last Updated {value.profileItem.updatedAt}</Text>
                          )}

                        </View>
                        <View className="clear" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {(value.opportunityTags && value.opportunityTags.length > 0) && (
                <View className="bottom-padding">
                  <View className="cta-border">
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { objectId: value.opportunityTags[0]._id })} className="background-button standard-color padding-20 full-width">
                      <View className="padding-20">
                        <View className="fixed-column-60">
                          <Image src={(value.opportunityTags[0].imageURL) ? value.opportunityTags[0].imageURL : opportunitiesIconDark} alt="GC" className="image-50-fit" />
                        </View>
                        <View className="calc-column-offset-60">
                          {(value.opportunityTags[0].title) ? (
                            <Text>{value.opportunityTags[0].title}</Text>
                          ) : (
                            <Text>{value.opportunityTags[0].name}</Text>
                          )}

                          {(value.opportunityTags[0].employerName) && (
                            <Text className="description-text-3 description-text-color">{value.opportunityTags[0].employerName}</Text>
                          )}

                        </View>
                        <View className="clear" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {(value.careerTags && value.careerTags.length > 0) && (
                <View className="bottom-padding">
                  <View className="cta-border">
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { objectId: value.careerTags[0].name })} className="background-button standard-color padding-20 full-width">
                      <View className="padding-20">
                        <View className="fixed-column-60">
                          <Image src={(value.careerTags[0].imageURL) ? value.careerTags[0].imageURL : careerMatchesIconDark} alt="GC" className="image-50-fit" />
                        </View>
                        <View className="calc-column-offset-60">
                          <Text>{value.careerTags[0].name}</Text>
                          <Text className="description-text-3 description-text-color">{value.careerTags[0].jobFamily}</Text>

                          {(value.careerTags[0].marketData) && (
                            <Text className="description-text-3 description-text-color"> | ${Number(value.careerTags[0].marketData.pay).toLocaleString()} avg pay</Text>
                          )}

                        </View>
                        <View className="clear" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {(value.trendTags && value.trendTags.length > 0) && (
                <View className="bottom-padding">
                  <View className="cta-border">
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Paths', { subNavSelected: 'Trends'})} className="background-button standard-color padding-20 full-width">
                      <View className="padding-20">
                        <View className="fixed-column-60">
                          <Image src={(value.trendTags[0].imageURL) ? value.trendTags[0].imageURL : trendsIconDark} alt="GC" className="image-50-fit" />
                        </View>
                        <View className="calc-column-offset-120">
                          <Text>{value.trendTags[0].name}</Text>
                          <Text className="description-text-3 description-text-color">{value.trendTags[0].category}</Text>
                        </View>

                        {(value.trendTags[0].percentChange) && (
                          <View className="fixed-column-60">
                            <Text className="heading-text-3 cta-color full-width right-text">{Number(value.trendTags[0].percentChange).toFixed()}%</Text>
                            <Text className="description-text-5 full-width right-text">increase in U.S. jobs</Text>
                          </View>
                        )}

                        <View className="clear" />
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}

              {(value.tags && value.tags.length > 0) && (
                <View className="bottom-padding">
                  {value.tags.map((item2, index2) =>
                    <View key={index2} className="float-left right-padding top-padding">
                      <View className="tag-container-thin">
                        <Text className="description-text-4">{item2}</Text>
                      </View>
                    </View>
                  )}
                  <View className="clear" />
                </View>
              )}

              {(value.entityTags && value.entityTags.length > 0) && (
                <View className="top-padding">
                  {value.entityTags.map((value2, optionIndex2) =>
                    <View key={value2} className="float-left right-padding">
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value2.username})} className="background-button standard-color">
                        <Image src={(value2.pictureURL) ? value2.pictureURL : profileIconDark} alt="GC" className="profile-thumbnail-25" />
                      </TouchableOpacity>
                    </View>
                  )}
                  <View className="clear" />
                </View>
              )}

              {(value.originalPost && value.originalPost.message) && (
                <View className="cta-border padding-20">
                  {this.renderOriginalPost(value)}
                </View>
              )}

              {(value.upvotes || (value.comments && value.comments.length > 0)) && (
                <View className="bottom-padding-5">
                  <View className="fixed-column-160">
                    <TouchableOpacity onClick={() => this.retrieveLikes(index)} className="background-button">
                      <Text className="description-text-4">{(value.upvotes) ? value.upvotes.length : 0} Upvotes</Text>
                    </TouchableOpacity>
                    <Text className="description-text-4 horizontal-padding-7">&#8226;</Text>
                    <TouchableOpacity onClick={() => this.retrieveComments(index)} className="background-button">
                      <Text className="description-text-4">{(value.commentCount) ? value.commentCount : 0} Comments</Text>
                    </TouchableOpacity>
                  </View>

                  <View className="clear" />

                </View>
              )}

              <View className="spacer" />
              <View style={styles.horizontalLine} />

              {(!inModal) && (
                <View className="top-padding">
                  <View className="float-left">
                    <TouchableOpacity onClick={(e) => this.voteOnItem(e, value, 'up', index) } className="background-button">
                      <View className="float-left right-padding-8">
                        <Image src={(value.upvotes.includes(this.state.emailId))? likeIconBlue : likeIconDark} alt="GC" className="image-auto-18 center-horizontally" />
                      </View>
                      <View className="float-left right-padding-20">
                        <Text className={(value.upvotes.includes(this.state.emailId)) ? "description-text-2 cta-color bold-text" : "description-text-2"}>{(value.upvotes.includes(this.state.emailId)) ? "Liked" : "Like"}</Text>
                      </View>
                      <View className="clear" />
                    </TouchableOpacity>
                  </View>

                  <View className="float-left">
                    <TouchableOpacity onClick={() => this.retrieveComments(index)} className="background-button" disabled={this.state.isLoading}>
                      <View className="float-left right-padding-8">
                        <View className="mini-spacer"/><View className="mini-spacer"/><View className="mini-spacer"/>
                        <Image src={commentIconDark} alt="GC" className="image-auto-18 center-horizontally" />
                      </View>
                      <View className="float-left right-padding-20">
                        <Text className="description-text-2">Comment</Text>
                      </View>
                      <View className="clear" />
                    </TouchableOpacity>
                  </View>
                  <View className="float-left">
                    <TouchableOpacity onClick={(value.originalPost && value.originalPost.message) ? () => this.setState({ modalIsOpen: true, sharePosting: true, originalPost: value.originalPost, selectedIndex: index }) : () => this.setState({ modalIsOpen: true, sharePosting: true, originalPost: value, selectedIndex: index })} className="background-button">
                      <View className="float-left right-padding-8">
                        <Image src={shareIconDark} alt="GC" className="image-auto-18 center-horizontally" />
                      </View>
                      <View className="float-left right-padding-20">
                        <Text className="description-text-2">Share</Text>
                      </View>
                      <View className="clear" />
                    </TouchableOpacity>
                  </View>

                  <View className="float-left">
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Messages', { generalPost: value })} className="background-button standard-color">
                      <View className="float-left right-padding-8">
                        <Image src={sendIconDark} alt="GC" className="image-auto-18 center-horizontally" />
                      </View>
                      <View className="float-left right-padding-20">
                        <Text className="description-text-2">Send</Text>
                      </View>
                      <View className="clear" />
                    </TouchableOpacity>
                  </View>

                  <View className="clear" />
                </View>
              )}*/}
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate(profileLink)} className="background-button standard-color profile-container-right calc-column-offset-30">
              <View className="fixed-column-55">
                {(value.originalPost.roleName === 'Admin') ? (
                  <Image src={(value.originalPost.pictureURL) ? value.originalPost.pictureURL : profileIconDark} className="image-40-fit" alt="GC" />
                ) : (
                  <Image src={(value.originalPost.pictureURL) ? value.originalPost.pictureURL : profileIconDark} className="profile-thumbnail-43" alt="GC" />
                )}
              </View>
              <View className="calc-column-offset-55">
                <View className="calc-column-offset-25">
                  <Text className="description-text-1 bold-text">{value.originalPost.firstName} {value.originalPost.lastName}</Text>
                </View>
                <View className="clear" />

                <View className="mini-spacer" /><View className="mini-spacer" />

                {(value.originalPost.headline && value.originalPost.headline !== '') ? (
                  <View>
                    <Text className="description-text-3 description-text-color">{value.originalPost.headline}</Text>
                  </View>
                ) : (
                  <View>
                    {(value.originalPost.education && value.originalPost.education[0] && value.originalPost.education[0].name && value.originalPost.education[0].isContinual) ? (
                      <View>
                        <Text className="description-text-3 description-text-color">Student @ {value.originalPost.education[0].name}</Text>
                      </View>
                    ) : (
                      <View>
                        <View>
                          <Text className="description-text-3 description-text-color">{this.state.orgName} Member</Text>
                        </View>
                      </View>
                    )}
                  </View>
                )}
                <Text className="description-text-4 description-text-color">{convertDateToString(value.originalPost.createdAt,"daysAgo")}</Text>
              </View>
            </TouchableOpacity>

            <View className="fixed-column-30">

            </View>
            <View className="clear" />
          </View>

          <View className="row-10">
            <Text className="description-text-2">{value.originalPost.message}</Text>

            {(value.originalPost.url) && (
              <Text onPress={() => Linking.openURL(value.originalPost.url)} className="description-text-3 top-padding bold-text" target="_blank">{value.originalPost.url}</Text>
            )}
          </View>
          {(value.originalPost.imageURL) && (
            <View className="row-10">
              <Image source={{uri: value.originalPost.imageURL}} alt="GC" className="image-full-auto" />
            </View>
          )}

          {(value.originalPost.videoURL) && (
            <View className="row-10">
              <View className="spacer"/>

              <View>
                <View className="video-container">
                  <iframe
                    title="videoLink"
                    className="video-iframe"
                    src={`${value.originalPost.videoURL}`}
                    frameBorder="0"
                  />
                </View>

              </View>

              <View className="clear" />
              <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>
            </View>
          )}

          {(value.originalPost.profileItem) && (
            <View className="bottom-padding">
              <View className="cta-border">
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value.originalPost.username })} className="background-button standard-color padding-20 full-width">
                  <View className="padding-20">
                    <View className="fixed-column-60">
                      <Image source={(value.originalPost.profileItem.imageURL) ? { uri: value.originalPost.profileItem.imageURL } : { uri: defaultProfileItemIcon }} alt="GC" className="image-50-fit" />
                    </View>
                    <View className="calc-column-offset-60">
                      <Text>{value.originalPost.profileItem.name}</Text>
                      {(value.originalPost.profileItem.category === 'Project') && (
                        <Text className="description-text-3 description-text-color">{value.originalPost.profileItem.category} | {value.originalPost.profileItem.hours} Hours</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Experience') && (
                        <Text className="description-text-3 description-text-color">{value.originalPost.profileItem.startDate} - {value.originalPost.profileItem.endDate}</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Education') && (
                        <Text className="description-text-3 description-text-color">{value.originalPost.profileItem.startDate} - {value.originalPost.profileItem.endDate}</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Career Goal') && (
                        <Text className="description-text-3 description-text-color">Deadline: {value.originalPost.profileItem.deadline}</Text>
                      )}
                      {(value.originalPost.profileItem.category === 'Passion') && (
                        <Text className="description-text-3 description-text-color">Last Updated {value.originalPost.profileItem.updatedAt}</Text>
                      )}

                    </View>
                    <View className="clear" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.opportunityTags && value.originalPost.opportunityTags.length > 0) && (
            <View className="bottom-padding">
              <View className="cta-border">
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { objectId: value.originalPost.opportunityTags[0]._id})} className="background-button standard-color padding-20 full-width">
                  <View className="padding-20">
                    <View className="fixed-column-60">
                      <Image source={(value.originalPost.opportunityTags[0].imageURL) ? { uri: value.originalPost.opportunityTags[0].imageURL } : { uri: opportunitiesIconDark }} alt="GC" className="image-50-fit" />
                    </View>
                    <View className="calc-column-offset-60">
                      {(value.originalPost.opportunityTags[0].title) ? (
                        <Text>{value.originalPost.opportunityTags[0].title}</Text>
                      ) : (
                        <Text>{value.originalPost.opportunityTags[0].name}</Text>
                      )}

                      {(value.originalPost.opportunityTags[0].employerName) && (
                        <Text className="description-text-3 description-text-color">{value.originalPost.opportunityTags[0].employerName}</Text>
                      )}

                    </View>
                    <View className="clear" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.careerTags && value.originalPost.careerTags.length > 0) && (
            <View className="bottom-padding">
              <View className="cta-border">
                <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { objectId: value.originalPost.careerTags[0].name })} className="background-button standard-color padding-20 full-width">
                  <View className="padding-20">
                    <View className="fixed-column-60">
                      <Image src={(value.originalPost.careerTags[0].imageURL) ? value.originalPost.careerTags[0].imageURL : careerMatchesIconDark} alt="GC" className="image-50-fit" />
                    </View>
                    <View className="calc-column-offset-60">
                      <Text>{value.originalPost.careerTags[0].name}</Text>
                      <Text className="description-text-3 description-text-color">{value.originalPost.careerTags[0].jobFamily}</Text>

                      {(value.originalPost.careerTags[0].marketData) && (
                        <Text className="description-text-3 description-text-color"> | ${Number(value.originalPost.careerTags[0].marketData.pay).toLocaleString()} avg pay</Text>
                      )}

                    </View>
                    <View className="clear" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.trendTags && value.originalPost.trendTags.length > 0) && (
            <View className="bottom-padding">
              <View className="cta-border">
                <TouchableOpacity onPress={() => this.props.navigation.navigate('Paths', { subNavSelected: 'Trends'})} className="background-button standard-color padding-20 full-width">
                  <View className="padding-20">
                    <View className="fixed-column-60">
                      <Image src={(value.originalPost.trendTags[0].imageURL) ? value.originalPost.trendTags[0].imageURL : trendsIconDark} alt="GC" className="image-50-fit" />
                    </View>
                    <View className="calc-column-offset-120">
                      <Text>{value.originalPost.trendTags[0].name}</Text>
                      <Text className="description-text-3 description-text-color">{value.originalPost.trendTags[0].category}</Text>
                    </View>

                    {(value.originalPost.trendTags[0].percentChange) && (
                      <View className="fixed-column-60">
                        <Text className="heading-text-3 cta-color full-width right-text">{Number(value.originalPost.trendTags[0].percentChange).toFixed()}%</Text>
                        <Text className="description-text-5 full-width right-text">increase in U.S. jobs</Text>
                      </View>
                    )}

                    <View className="clear" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {(value.originalPost.tags && value.originalPost.tags.length > 0) && (
            <View className="bottom-padding">
              {value.originalPost.tags.map((item2, index2) =>
                <View key={index2} className="float-left right-padding top-padding">
                  <View className="tag-container-thin">
                    <Text className="description-text-4">{item2}</Text>
                  </View>
                </View>
              )}
              <View className="clear" />
            </View>
          )}

          {(value.originalPost.entityTags && value.originalPost.entityTags.length > 0) && (
            <View className="top-padding">
              {value.originalPost.entityTags.map((value2, optionIndex2) =>
                <View key={value2} className="float-left right-padding">
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: value2.username })} className="background-button standard-color">
                    <Image src={(value2.pictureURL) ? value2.pictureURL : profileIconDark} alt="GC" className="image-auto-20" />
                  </TouchableOpacity>
                </View>
              )}
              <View className="clear" />
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

      // return (
      //   <View key="renderShareButtons">
      //     <EmailShareButton url={shareURL} subject={shareTitle} body={shareBody} className="horizontal-margin-5" >
      //       <EmailIcon size={32} round />
      //     </EmailShareButton>
      //
      //     <FacebookShareButton url={shareURL} quote={shareTitle} className="horizontal-margin-5">
      //       <FacebookIcon size={32} round />
      //     </FacebookShareButton>
      //
      //     <LinkedinShareButton url={shareURL} title={shareTitle} summary={shareBody} source={window.location.protocol + "//" + window.location.host} className="horizontal-margin-5" >
      //       <LinkedinIcon size={32} round />
      //     </LinkedinShareButton>
      //
      //     <PinterestShareButton url={shareURL} description={shareTitle} className="horizontal-margin-5" >
      //       <PinterestIcon size={32} round />
      //     </PinterestShareButton>
      //
      //     <WhatsappShareButton url={shareURL} title={shareTitle} className="horizontal-margin-5">
      //       <WhatsappIcon size={32} round />
      //     </WhatsappShareButton>
      //
      //     <WorkplaceShareButton url={shareURL} quote={shareTitle} className="horizontal-margin-5" >
      //       <WorkplaceIcon size={32} round />
      //     </WorkplaceShareButton>
      //
      //     <TwitterShareButton url={shareURL} title={shareTitle} className="horizontal-margin-5" >
      //       <TwitterIcon size={32} round />
      //     </TwitterShareButton>
      //
      //     <RedditShareButton url={shareURL} title={shareTitle} className="horizontal-margin-5">
      //       <RedditIcon size={32} round />
      //     </RedditShareButton>
      //
      //     <View className="clear" />
      //
      //   </View>
      // )
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { objectId: itemObject._id })} className="background-button standard-color full-width">
              <View className="calc-column-offset-80">
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View className="fixed-column-80">
                {(answer === 'a') ? (
                  <View>
                    {(item.aValue) && (
                      <Text className="bold-text right-text cta-color">${item.aValue}</Text>
                    )}
                  </View>
                ) : (
                  <View>
                    {(item.bValue) && (
                      <Text className="bold-text right-text cta-color">${item.bValue}</Text>
                    )}
                  </View>
                )}
              </View>
              <View className="clear" />
            </TouchableOpacity>

            <View className="row-5">
              <View className="bottom-padding">
                <View className="cta-border">
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { objectId: itemObject._id })} className="background-button standard-color padding-20 full-width">
                    <View className="padding-20">
                      <View className="fixed-column-60">
                        <Image src={(itemObject.imageURL) ? itemObject.imageURL : defaultProfileItemIcon} alt="GC" className="image-50-fit" />
                      </View>
                      <View className="calc-column-offset-60">
                        <Text>{itemObject.name}</Text>
                        <Text className="description-text-3 description-text-color">{itemObject.category} | {itemObject.hours} Hours</Text>
                      </View>
                      <View className="clear" />
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
            <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { objectId: itemObject._id })} className="background-button standard-color padding-20 full-width">
              <View className="calc-column-offset-80">
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View className="fixed-column-80">
                {(answer === 'a') ? (
                  <Text className="bold-text right-text cta-color">${item.aValue}</Text>
                ) : (
                  <Text className="bold-text right-text cta-color">${item.bValue}</Text>
                )}
              </View>
              <View className="clear" />
            </TouchableOpacity>

            <View className="row-5">
              <View className="cta-border">
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails',  { objectId: itemObject._id })} className="background-button standard-color padding-20 full-width">
                  <View className="padding-20">
                    <View className="fixed-column-50">
                      <Image src={(itemObject.imageURL) ? itemObject.imageURL : defaultProfileItemIcon} alt="GC" className="image-40-fit" />
                    </View>
                    <View className="calc-column-offset-50">
                      {(itemObject.title) ? (
                        <Text>{itemObject.title}</Text>
                      ) : (
                        <Text>{itemObject.name}</Text>
                      )}

                      {(itemObject.employerName) && (
                        <Text className="description-text-3 description-text-color">{itemObject.employerName}</Text>
                      )}

                    </View>
                    <View className="clear" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (type === 'career') {
        return (
          <View key="taggedCareerItem">
            <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { objectId: itemObject.name })} className="background-button standard-color padding-20 full-width">
              <View className="calc-column-offset-80">
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View className="fixed-column-80">
                {(answer === 'a') ? (
                  <Text className="bold-text right-text cta-color">${item.aValue}</Text>
                ) : (
                  <Text className="bold-text right-text cta-color">${item.bValue}</Text>
                )}
              </View>
              <View className="clear" />
            </TouchableOpacity>

            <View className="bottom-padding">
              <View className="cta-border">
                <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { objectId: itemObject.name })} className="background-button standard-color padding-20 full-width">
                  <View className="padding-20">
                    <View className="fixed-column-60">
                      <Image src={(itemObject.imageURL) ? itemObject.imageURL : defaultProfileItemIcon} alt="GC" className="image-50-fit" />
                    </View>
                    <View className="calc-column-offset-60">
                      <Text>{itemObject.name}</Text>
                      <Text className="description-text-3 description-text-color">{itemObject.jobFamily}</Text>

                      {(itemObject.marketData) && (
                        <Text className="description-text-3 description-text-color"> | ${Number(itemObject.marketData.pay).toLocaleString()} avg pay</Text>
                      )}
                    </View>
                    <View className="clear" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )
      } else if (type === 'competency') {
        return (
          <View key="taggedCompetencyItem">
            <View className="bottom-padding">
              <View className="calc-column-offset-80">
                {(answer === 'a') ? (
                  <Text>A: {item.aName}</Text>
                ) : (
                  <Text>B: {item.bName}</Text>
                )}
              </View>
              <View className="fixed-column-80">
                {(answer === 'a') ? (
                  <Text className="bold-text right-text cta-color">${item.aValue}</Text>
                ) : (
                  <Text className="bold-text right-text cta-color">${item.bValue}</Text>
                )}
              </View>
              <View className="clear" />
            </View>

            <View className="bottom-padding">
              <View className="cta-border">
                <View className="standard-color padding-20 full-width">
                  <View>
                    <View className="fixed-column-60">
                      <Image src={(itemObject.imageURL) ? itemObject.imageURL : defaultProfileItemIcon} alt="GC" className="image-50-fit" />
                    </View>
                    <View className="calc-column-offset-60">
                      <Text>{itemObject.name}</Text>
                      <Text className="description-text-3 description-text-color">{itemObject.category}</Text>

                      {(itemObject.description) && (
                        <View>
                          <View className="clear" />
                          <Text className="description-text-3 description-text-color">{itemObject.description}</Text>
                        </View>
                      )}
                    </View>
                    <View className="clear" />
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
                    {(this.props.pageSource === 'externalProfile') ? (
                      <View>

                        <View className="relative-column-33">
                          {(this.props.limit && (this.props.limit < (index + 1))) ? (
                            <View />
                          ) : (
                            <View>
                              {this.renderPost(value, index)}
                            </View>
                          )}
                        </View>
                        <View className="clear" />
                      </View>
                    ) : (
                      <View>
                        {this.renderPost(value, index)}
                      </View>
                    )}
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
               <View key="showShareButtons" className="full-width">

                 {(this.state.showPost || this.state.sharePosting) && (
                   <View key="showPost" className="full-width padding-20">
                      <SubCreatePost sharePosting={this.state.sharePosting} originalPost={this.state.originalPost} posts={this.state.posts} passPosts={this.passPosts} closeModal={this.closeModal} />
                    </View>
                 )}

                  {(this.state.showComments) && (
                    <View key="showPost" className="full-width padding-20">
                      {this.renderPost(this.state.posts[this.state.selectedIndex], this.state.selectedIndex, true)}

                      <View className="spacer" />

                      {(this.state.posts && this.state.activeOrg) && (
                        <SubComments selectedGroup={null} selectedGroupPost={this.state.posts[this.state.selectedIndex]} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} comments={this.state.comments} postingOrgCode={this.state.activeOrg} postingOrgName={this.state.orgName} orgContactEmail={this.state.orgContactEmail} pictureURL={this.state.pictureURL} orgLogo={this.state.orgLogo} history={this.props.history} pageSource={"newsFeed"} employerLogo={this.props.employerLogo} employerName={this.props.employerName} jobTitle={this.props.jobTitle} />
                      )}
                    </View>
                  )}

                  {(this.state.passedGroupPost) && (
                    <View key="passedGroupPost" className="full-width">

                     {this.renderPost(this.state.passedGroupPost, null, true, true)}

                     <View className="spacer" />

                     {(this.state.passedGroupPost && this.state.activeOrg) && (
                       <SubComments selectedGroup={null} selectedGroupPost={this.state.passedGroupPost} activeOrg={this.state.activeOrg} accountCode={this.state.accountCode} comments={this.state.comments} postingOrgCode={this.state.activeOrg} postingOrgName={this.state.orgName} orgContactEmail={this.state.orgContactEmail} pictureURL={this.state.pictureURL} history={this.props.history} pageSource={"newsFeed"} employerLogo={this.props.employerLogo} employerName={this.props.employerName} jobTitle={this.props.jobTitle} />
                     )}

                    </View>
                  )}

                  {(this.state.showShareButtons) && (
                     <View className="full-width padding-20 center-text">
                       <Text className="heading-text-2">Share This Post with Friends!</Text>

                       <View className="top-padding-20">
                         <Text>Share this link:</Text>
                         <Text className="bold-text cta-color">{"https://www.guidedcompass.com/app/social-posts/" + this.state.posts[this.state.selectedIndex]._id}</Text>
                       </View>

                       <View className="spacer" />

                       <View className="top-padding-20">
                         {this.renderShareButtons()}
                       </View>
                     </View>
                  )}

                  {(this.state.adjustFeedPreferences) && (
                    <View key="adjustFeedPreferences" className="full-width padding-20">
                       <Text className="heading-text-4">Don't want to see this</Text>
                       <View className="spacer" />

                       <View className="row-10 description-text-2">
                         <Text>Tell us why you don't want to see this</Text>
                         <Text className="description-text-2 description-text-color">Your feedback will help us improve your experience</Text>
                       </View>

                       <View className="spacer" />

                       {this.state.adjustFeedPreferenceOptions.map((item2, index2) =>
                         <View key={index2} className="row-5">
                           <View className="fixed-column-40">
                             {(this.state.selectedPreferences && this.state.selectedPreferences.includes(item2)) ? (
                               <TouchableOpacity className="background-button" onClick={() => this.itemClicked(item2,'adjustFeedPreferences') }>
                                 <Image src={checkboxChecked} alt="GC" className="image-auto-18" />
                               </TouchableOpacity>
                             ) : (
                               <TouchableOpacity className="background-button" onClick={() => this.itemClicked(item2,'adjustFeedPreferences')}>
                                 <Image src={checkboxEmpty} alt="GC" className="image-auto-18" />
                               </TouchableOpacity>
                             )}
                           </View>
                           <View className="calc-column-offset-40">
                             <Text className="description-text-2">{item2}</Text>
                           </View>
                           <View className="clear" />
                         </View>
                       )}

                       <View className="spacer" />

                       <View className="row-10 description-text-2">
                         <Text>If you think this post goes against our Professional Community Policies, please report this post.</Text>
                       </View>

                       <View className="spacer" />

                       <TouchableOpacity className="btn btn-squarish right-margin" disabled={(this.state.isSaving) ? true : false} onClick={() => this.submitReport('preference')}>Submit</TouchableOpacity>
                       <TouchableOpacity className="btn btn-squarish white-background cta-color" onClick={() => this.closeModal()}>Cancel</TouchableOpacity>
                     </View>
                  )}

                  {(this.state.reportPostView) && (
                    <View key="reportPostView" className="full-width padding-20">
                       <Text className="heading-text-4">Report</Text>
                       <View className="spacer" />

                       <View className="row-10 description-text-2">
                         <Text>Why are you reporting this?</Text>
                         <Text className="description-text-2 description-text-color">Your feedback will help us improve your experience</Text>
                       </View>

                       <View className="spacer" />

                       {this.state.reportOptions.map((item2, index2) =>
                         <View key={index2} className="row-5">
                           <View className="fixed-column-40">
                             {(this.state.selectedReportReasons && this.state.selectedReportReasons.includes(item2)) ? (
                               <TouchableOpacity className="background-button" onClick={() => this.itemClicked(item2,'report') }>
                                 <Image src={checkboxChecked} alt="GC" className="image-auto-18" />
                               </TouchableOpacity>
                             ) : (
                               <TouchableOpacity className="background-button" onClick={() => this.itemClicked(item2,'report')}>
                                 <Image src={checkboxEmpty} alt="GC" className="image-auto-18" />
                               </TouchableOpacity>
                             )}
                           </View>
                           <View className="calc-column-offset-40">
                             <Text className="description-text-2">{item2}</Text>
                           </View>
                           <View className="clear" />
                         </View>
                       )}

                       <View className="spacer" /><View className="spacer" />

                       <TouchableOpacity className="btn btn-squarish right-margin" disabled={(this.state.isSaving) ? true : false} onClick={() => this.submitReport('report')}>Submit</TouchableOpacity>
                       <TouchableOpacity className="btn btn-squarish white-background cta-color" onClick={() => this.closeModal()}>Cancel</TouchableOpacity>
                     </View>
                  )}

                  {(this.state.showDeletePost) && (
                    <View key="deletePost" className="full-width padding-20">
                      <Text className="heading-text-4">Are you sure you want to delete this post?</Text>
                      <View className="spacer" />

                      <View className="spacer" /><View className="spacer" />

                      <TouchableOpacity className="btn btn-squarish error-background-color clear-border right-margin" disabled={(this.state.isSaving) ? true : false} onClick={() => this.deletePost()}>Delete</TouchableOpacity>
                      <TouchableOpacity className="btn btn-squarish white-background cta-color" onClick={() => this.closeModal()}>Cancel</TouchableOpacity>
                    </View>
                  )}

                  {(this.state.showReports) && (
                    <View key="reports" className="full-width padding-20">
                      <Text className="heading-text-4">Reports on this post</Text>
                      <View className="spacer" /><View className="spacer" />

                      <Text className="description-text-color description-text-2">There has not been any reports on this post</Text>

                      <View className="spacer" /><View className="spacer" />

                      <TouchableOpacity className="btn btn-squarish white-background cta-color" onClick={() => this.closeModal()}>
                        <View>
                          <View className="float-left top-padding-5"><Image className="image-auto-11" alt="img" src={closeIcon} /></View>
                          <View className="float-left left-padding">Close View</View>
                          <View className="clear" />
                        </View>
                      </TouchableOpacity>
                    </View>
                  )}

                  {(this.state.showUpvotes) && (
                    <View key="showPost" className="full-width">
                      <View className="bottom-padding">
                        <Text className="heading-text-2">Post Upvotes</Text>
                      </View>

                     <View className="spacer" />

                     {(this.state.upvotes && this.state.upvotes.length > 0) ? (
                       <View className="top-padding">
                         {this.state.upvotes.map((value, optionIndex) =>
                           <View key={"upvote|" + optionIndex}>
                             <View>
                               <View className="fixed-column-60">
                                 <Image src={(value.pictureURL) ? value.pictureURL : profileIconDark} alt="GC" className="profile-thumbnail-2" />
                               </View>
                               <View className="calc-column-offset-60 left-padding top-padding-5">
                                 <Text className="heading-text-4">{value.firstName} {value.lastName}</Text>
                               </View>
                               <View className="clear" />
                             </View>
                           </View>
                         )}
                       </View>
                     ) : (
                       <View>
                         <Text className="error-color">There are no upvotes</Text>
                       </View>
                     )}

                    </View>
                  )}

                  {(this.state.showReports) && (
                    <View key="reports" className="full-width padding-20">
                      <Text className="heading-text-4">Reports on this post</Text>
                      <View className="spacer" /><View className="spacer" />

                      <Text className="description-text-color description-text-2">There has not been any reports on this post</Text>

                      <View className="spacer" /><View className="spacer" />

                      <TouchableOpacity className="btn btn-squarish white-background cta-color" onClick={() => this.closeModal()}>
                        <View>
                          <View className="float-left top-padding-5"><Image className="image-auto-11" alt="img" src={closeIcon} /></View>
                          <View className="float-left left-padding">Close View</View>
                          <View className="clear" />
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
