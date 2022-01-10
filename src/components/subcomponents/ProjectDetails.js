import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch, Linking, Image } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

const profileIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-grey.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';
const linkIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon-blue.png';
const calendarIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/calendar-icon-blue.png';
const timeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/time-icon-blue.png';
const industryIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/industry-icon.png';
const tagIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/tag-icon.png';
const collaborationIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/collaboration-icon-blue.png';
const videoIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/video-icon.png';
const imageIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/image-icon.png';

import {convertDateToString} from '../functions/convertDateToString';
import {autoScaleImage} from '../functions/autoScaleImage';

class ProjectDetails extends Component {
    constructor(props) {
        super(props)

        this.state = {
          modalIsOpen: false,
          creatorProfileLink: '',
          imageIndex: 0
        }

        this.retrieveData = this.retrieveData.bind(this)
        this.closeModal = this.closeModal.bind(this)

        this.renderProject = this.renderProject.bind(this)

    }

    componentDidMount() {

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in projectDetails', this.props, prevProps)

      if (this.props.modalIsOpen !== prevProps.modalIsOpen) {
        this.retrieveData()
      } else if (this.props.selectedProject && !prevProps.selectedProject) {
        this.retrieveData()
      } else if (this.props.selectedProject && this.props.selectedProject._id && prevProps.selectedProject && this.props.selectedProject._id !== prevProps.selectedProject._id) {
        this.retrieveData()
      } else if (this.props.orgCode !== prevProps.orgCode) {
        this.retrieveData()
      } else if (this.props.objectId && !prevProps.objectId) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {

        if (!this.props.selectedProject) {
          console.log('there was an error retrieving the project')
        } else {
          let creatorProfileLink = ''
          let passedState = {}

          if (this.props.fromAdvisor && this.props.selectedProject) {

            let userEmail = ''
            if (this.props.selectedProject.emailId && this.props.selectedProject.emailId !== '') {
              userEmail = this.props.selectedProject.emailId
            } else if (this.props.selectedProject.userEmail && this.props.selectedProject.userEmail !== '') {
              userEmail = this.props.selectedProject.userEmail
            }

            creatorProfileLink = '/advisor/advisees/' + userEmail
            passedState = { member: null }

          } else {
            console.log('no link necesssary')
          }

          const modalIsOpen = this.props.modalIsOpen
          let selectedProject = this.props.selectedProject
          const orgCode = this.props.orgCode

          // console.log('show passedState: ', creatorProfileLink, passedState)


          if (this.props.objectId && !this.props.selectedProject) {

            Axios.get('https://www.guidedcompass.com/api/projects/byid', { params: { _id: this.props.objectId } })
            .then((response) => {

                if (response.data.success) {
                  console.log('Project query by query worked', response.data);

                  selectedProject = response.data.project
                  this.setState({ modalIsOpen, selectedProject, orgCode, creatorProfileLink, passedState })

                  // pull username
                  Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: selectedProject.emailId } })
                  .then((response) => {

                      if (response.data.success) {
                        console.log('User profile query worked', response.data);

                        const selectedProjectUsername = response.data.user.username
                        this.setState({ selectedProjectUsername })

                      } else {
                        console.log('no user details found', response.data.message)

                      }

                  }).catch((error) => {
                      console.log('User profile query did not work', error);
                  });

                } else {
                  console.log('no user details found', response.data.message)

                }

            }).catch((error) => {
                console.log('User profile query did not work', error);
            });

          } else {
            this.setState({ modalIsOpen, selectedProject, orgCode, creatorProfileLink, passedState })

            // pull username
            Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: selectedProject.emailId } })
            .then((response) => {

                if (response.data.success) {
                  console.log('User profile query worked', response.data);

                  const selectedProjectUsername = response.data.user.username
                  this.setState({ selectedProjectUsername })

                } else {
                  console.log('no user details found', response.data.message)

                }

            }).catch((error) => {
                console.log('User profile query did not work', error);
            });
          }

        }
       } catch (error) {
         // Error retrieving data
         console.log('there was an error', error)
       }
    }

    closeModal() {
      console.log('show closeModal in projectDetails')

      this.props.closeModal()
    }

    // calcImage(uri) {
    //   console.log('calcImage called', uri)
    //
    //   Image.getSize(uri, (width, height) => {
    //     console.log('show width and height: ', width, height)
    //       // if (this.props.width && !this.props.height) {
    //       //     this.setState({
    //       //         width: this.props.width,
    //       //         height: height * (this.props.width / width)
    //       //     });
    //       // } else if (!this.props.width && this.props.height) {
    //       //     this.setState({
    //       //         width: width * (this.props.height / height),
    //       //         height: this.props.height
    //       //     });
    //       // } else {
    //       //     this.setState({ width: width, height: height });
    //       // }
    //   });
    //
    // }

    renderProject() {
      console.log('renderProject called')

      return (
        <View key="projectDetails" style={[styles.calcColumn60]}>
          <View style={[styles.row10,styles.rowDirection]}>
            <View style={[styles.width60]}>
              <Image style={[styles.square50,styles.contain, { borderRadius: 25 }]} source={(this.props.selectedProject.userPic) ? { uri: this.props.selectedProject.userPic} : { uri: profileIconGrey}} />
            </View>
            <View style={[styles.calcColumn120]}>
              <Text style={[styles.headingText5]}>{this.props.selectedProject.name}</Text>
              <Text style={[styles.descriptionText3,styles.leftPadding5]}>by <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.selectedProjectUsername})}><Text style={[styles.ctaColor,styles.boldText,styles.topPadding5]}>{this.props.selectedProject.userFirstName} {this.props.selectedProject.userLastName}</Text></TouchableOpacity></Text>
            </View>
          </View>

          {(this.props.selectedProject.createdAt) && (
            <View style={[styles.bottomPadding,styles.leftPadding60]}>
              <Text style={[styles.descriptionText4]}>Created: {this.props.selectedProject.createdAt.substring(0,10)}</Text>
            </View>
          )}

          <View style={[styles.row10]}>
            {(this.props.selectedProject.imageURL) && (
              <View>
                {(!this.props.selectedProject.videoURL || this.state.imageIndex === 0) && (
                  <Image source={{ uri: this.props.selectedProject.imageURL}} style={[styles.flex70,styles.height150]} />
                )}
              </View>
            )}

            {(this.props.selectedProject.videoURL) && (
              <View>
                {(!this.props.selectedProject.imageURL || this.state.imageIndex === 1) && (
                  <View>
                    <WebView
                      style={[styles.calcColumn60,styles.screenHeight20]}
                      javaScriptEnabled={true}
                      source={{uri: this.props.selectedProject.videoURL}}
                    />
                  </View>
                )}
              </View>
            )}

            {(this.props.selectedProject.imageURL && this.props.selectedProject.videoURL) && (
              <View style={[styles.rowDirection,styles.flexCenter]}>
                <TouchableOpacity onPress={() => this.setState({ imageIndex: 0 })}><View style={(this.state.imageIndex === 0) ? [styles.ctaBorder,styles.padding5] : [styles.padding5]}><Image source={{ uri: imageIcon}} style={[styles.square22,styles.contain,styles.horizontalMargin5]}/></View></TouchableOpacity>
                <TouchableOpacity onPress={() => this.setState({ imageIndex: 1 })}><View style={(this.state.imageIndex === 1) ? [styles.ctaBorder,styles.padding5] : [styles.padding5]}><Image source={{ uri: videoIcon}} style={[styles.square22,styles.contain,styles.horizontalMargin5]}/></View></TouchableOpacity>
              </View>
            )}
          </View>

          <View style={[styles.row10]}>
            <View style={[styles.row10,styles.rowDirection]}>
              <View style={[styles.width30]}>
                <Image style={[styles.square17,styles.contain]} source={{ uri: linkIconBlue}} />
              </View>
              <View style={[styles.calcColumn90]}>
                <TouchableOpacity onPress={() => Linking.openURL(this.props.selectedProject.url)}><Text style={[styles.descriptionText2]}>Click Here for Details</Text></TouchableOpacity>
              </View>

            </View>

            <View style={[styles.row10,styles.rowDirection]}>
              <View style={[styles.width30]}>
                <Image style={[styles.square17,styles.contain]} source={{ uri: calendarIconBlue}} />
              </View>
              <View style={[styles.calcColumn90]}>
                <Text style={[styles.descriptionText2]}>{this.props.selectedProject.startDate} - {this.props.selectedProject.endDate}</Text>
              </View>

            </View>

            <View style={[styles.row10,styles.rowDirection]}>
              <View style={[styles.width30]}>
                <Image style={[styles.square17,styles.contain]} source={{ uri: timeIconBlue}} />
              </View>
              <View style={[styles.calcColumn90]}>
                <Text style={[styles.descriptionText2]}>{this.props.selectedProject.hours} Hours Invested</Text>
              </View>

            </View>

            <View style={[styles.row10,styles.rowDirection]}>
              <View style={[styles.width30]}>
                <Image style={[styles.square17,styles.contain]} source={{ uri: industryIcon}} />
              </View>
              <View style={[styles.calcColumn90]}>
                <Text style={[styles.descriptionText2]}>this.props.selectedProject.category}{this.props.selectedProject.jobFunction && " | " + this.props.selectedProject.jobFunction}{this.props.selectedProject.industry && " | " + this.props.selectedProject.industry}</Text>
              </View>

            </View>

            {(this.props.selectedProject.skillTags) && (
              <View style={[styles.row10,styles.rowDirection]}>
                <View style={[styles.width30]}>
                  <Image style={[styles.square17,styles.contain]} source={{ uri: tagIcon}} />
                </View>
                <View style={[styles.calcColumn90]}>
                  <Text style={[styles.descriptionText2]}>{this.props.selectedProject.skillTags}</Text>
                </View>

              </View>
            )}

            {(this.props.selectedProject.collaborators && this.props.selectedProject.collaborators.length > 0) && (
              <View style={[styles.row10,styles.rowDirection]}>
                <View style={[styles.width30]}>
                  <Image style={[styles.square17,styles.contain]} source={{ uri: collaborationIconBlue}} />
                </View>
                <View style={[styles.calcColumn90]}>
                  {this.props.selectedProject.collaborators.map((value, index) =>
                    <View key={value}>
                      <View>
                        <View>
                          <View className="fixed-column-25 heading-text-2 cta-color half-bold-text">
                            <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                            <Image style={[styles.square18,styles.contain]} source={value.pictureURL ? { uri: value.pictureURL} : { uri: profileIconGrey}} />
                          </View>
                          <View className="calc-column-offset-25">
                            <Text style={[styles.descriptionText2]}>{value.firstName} {value.lastName} ({value.roleName})</Text>
                          </View>

                        </View>

                        <View style={[styles.spacer]}/><View style={[styles.spacer]}/>
                      </View>
                    </View>
                  )}
                </View>

              </View>
            )}
          </View>

          <View style={[styles.row10]}>
            <View>
              <Text>{this.props.selectedProject.description}</Text>
            </View>

            {(this.props.private && this.props.selectedProject.grades && this.props.selectedProject.grades.length > 0) && (
              <View>

                <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                <View style={[styles.horizontalLine]} />

                <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />

                <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.boldText]}>GRADES & FEEDBACK</Text>

                <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                <View>

                  {this.props.selectedProject.grades.map((value, index) =>
                    <View key={value}>
                      {(value.grade || value.feedback) && (
                        <View>
                          <View>
                            <View style={[styles.width60]}>
                              <Text style={[styles.headingText2,styles.ctaColor,styles.boldText]}>{value.grade}</Text>
                            </View>
                            <View style={[styles.calcColumn160]}>
                              <Text style={[styles.descriptionText2]}>{value.contributorFirstName} {value.contributorLastName} ({value.contributorRoleName}) {(value.contributorTitle) && " - " + value.contributorTitle + " @ " + value.contributorEmployerName}</Text>
                              <Text style={[styles.headingText6]}>{value.feedback}</Text>
                            </View>

                          </View>

                          <View style={[styles.spacer]}/><View style={[styles.spacer]}/>
                        </View>
                      )}
                    </View>
                  )}

                  <View style={[styles.spacer]}/><View style={[styles.spacer]}/>
                </View>
              </View>
            )}
          </View>

          {(!this.props.excludeModal) && (
            <View>
              <View style={[styles.spacer]} />

              <TouchableOpacity style={[styles.btnSquarish,styles.ctaBorderColor,styles.flexCenter]} onPress={() => this.closeModal()}>
                <View style={[styles.rowDirection]}>
                  <View style={[styles.topPadding5]}><Image style={[styles.square11,styles.contain]} source={{ uri: closeIcon}} /></View>
                  <Text style={[styles.leftPadding]}>Close View</Text>

                </View>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )
    }

    render() {

      console.log('rendering projectDetails ')

      return (
          <ScrollView>
            {(this.props.selectedProject) && (
              <View>
                {(this.props.excludeModal) ? (
                  <View style={[styles.card,styles.topMargin20]}>
                    {this.renderProject()}
                  </View>
                ) : (
                  <View>
                    {this.state.modalIsOpen && (
                      <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
                        <View style={[styles.padding30]}>
                          {this.renderProject()}
                        </View>
                     </Modal>
                    )}
                  </View>
                )}
              </View>
            )}
          </ScrollView>
      )
    }
}

export default ProjectDetails
