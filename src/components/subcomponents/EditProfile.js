import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Linking, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont()

const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/interests-icon.png';
const logIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/log-icon-dark.png';
const socialIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-dark.png';
const moneyIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/money-icon-dark.png';
const targetIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/target-icon.png';
const courseIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/course-icon-dark.png';
const addProfilePhotoIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-profile-photo-icon.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png';
const abilitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/abilities-icon-dark.png';
const endorsementIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/endorsement-icon-dark.png';
const publicIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/public-icon.png';
const checkmarkDarkGreyIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-dark-grey.png';
const benchmarksIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/benchmarks-icon-dark.png';
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const resumeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/resume-icon-dark.png';

class EditProfile extends Component {
  constructor(props) {
    super(props)
    this.state = {
      allowMultipleFiles: true
    }

    this.retrieveData = this.retrieveData.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  retrieveData = async() => {
    try {

      console.log('this is causing the error')
      const emailId = await AsyncStorage.getItem('email')
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

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, orgFocus, orgName, remoteAuth
        })

        if (this.props.fromAdvisor) {

          this.fetchAllProfileData(emailId, null)

        } else {

          Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId } })
          .then((response) => {
            console.log('Favorites query attempted', response.data);

              if (response.data.success) {
                console.log('successfully retrieved favorites', response.data.favorites.length)

                if (response.data.favorites.length > 0) {
                  console.log('the array is greater than 0', response.data.favorites.length)

                  this.setState({ favorites: response.data.favorites })

                }

              } else {
                console.log('no favorites data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Favorites query did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/story', { params: { emailId } })
          .then((response) => {
              console.log('Endorsement query worked', response.data);

              if (response.data.success) {

                if (response.data.stories) {
                  const endorsements = response.data.stories
                  this.setState({ endorsements })
                }
              }

          }).catch((error) => {
              console.log('Story query did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/logs/user', { params: { email: emailId } })
          .then((response) => {

              if (response.data.success) {
                console.log('Logs received query worked', response.data);

                let logs = response.data.logs
                this.setState({ logs })

              } else {
                console.log('no logs data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Logs query did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId } })
           .then((response) => {
             console.log('query for assessment results worked');

             if (response.data.success) {

               console.log('actual assessment results', response.data)

               if (response.data.results) {

                 let assessmentCount = 0

                 if (response.data.results.workPreferenceAnswers && response.data.results.workPreferenceAnswers.length > 0) {
                   assessmentCount = assessmentCount + 1
                 }
                 if (response.data.results.interestScores && response.data.results.interestScores.length > 0) {
                   assessmentCount = assessmentCount + 1
                 }
                 if (response.data.results.skillsScores && response.data.results.skillsScores.length > 0) {
                   assessmentCount = assessmentCount + 1
                 }
                 if (response.data.results.personalityScores) {
                   assessmentCount = assessmentCount + 1
                 }
                 if (response.data.results.topGravitateValues && response.data.results.topGravitateValues.length > 0 && response.data.results.topEmployerValues && response.data.results.topEmployerValues.length > 0) {
                   assessmentCount = assessmentCount + 1
                 }

                 this.setState({ assessmentCount });

               }

             } else {
               console.log('error response', response.data)

               this.setState({ resultsErrorMessage: response.data.message })
             }

         }).catch((error) => {
             console.log('query for assessment results did not work', error);
         })

         this.fetchAllProfileData(emailId, null)

        }
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  fetchAllProfileData (email, orgDegree) {
    console.log('pulling profile data', email)

    Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
    .then((response) => {

        if (response.data.success) {
          console.log('User profile query worked', response.data);

          const firstNameValue = response.data.user.firstName
          const lastNameValue = response.data.user.lastName
          const pictureURL = response.data.user.pictureURL
          const schoolValue = response.data.user.school
          const gradYear = response.data.user.gradYear
          const jobTitle = response.data.user.jobTitle
          const employerName = response.data.user.employerName
          const publicProfile = response.data.user.publicProfile
          const publicProfileExtent = response.data.user.publicProfileExtent
          const oauthUid = response.data.user.oauthUid

          this.setState({
            firstNameValue, lastNameValue, pictureURL, schoolValue, gradYear, jobTitle, employerName,
            publicProfile, publicProfileExtent, oauthUid
          });

        } else {
          console.log('no user details found', response.data.message)

        }

    }).catch((error) => {
        console.log('User profile query did not work', error);
    });
  }

  formChangeHandler = event => {

    console.log('show data: ', event.target.name)

    if (event.target.name === 'profilePic') {
      console.log('profilePicSelectedHandler changed', event.target.files[0])

      // ImagePicker.showImagePicker({title: "Pick an Image", maxWidth: 300, maxHeight: 300, takePhotoButtonTitle: null}, res => {
      //   if (res.didCancel) {
      //     console.log("User cancelled!");
      //   } else if (res.error) {
      //     console.log("Error", res.error);
      //   } else {
      //     console.log('give me response:', res)
      //     this.setState({
      //       profilePicImage: { uri: res.uri },
      //       profilePicHasChanged: true
      //     });
      //   }
      // });

      if (event.target.files[0]) {
        if (event.target.files[0].size > 1 * 1024 * 1024) {
          console.log('file is too big')

          const errorMessage = 'File must be less than 1MB.'
          this.setState({ serverSuccessProfilePic: false, serverErrorMessageProfilePic: errorMessage })

        } else {
          console.log('file is small enough', event.target.files[0].size)

          let reader = new FileReader();
          reader.onload = (e) => {
              this.setState({ profilePicImage: e.target.result });
              console.log('how do i access the image', e.target.result)
          };
          reader.readAsDataURL(event.target.files[0]);
          // this.setState({ profilePicFile: event.target.files[0], profilePicHasChanged: true })
          this.saveFile(event.target.name, event.target.files[0])
        }
      }
    } else if (event.target.name === 'pictureURL') {
      //only covers Google Drive for now
      // https://drive.google.com/file/d/1x5MeSXzjC4dbmwfESGpspe7WnmkbNKLB/view?usp=sharing
      // https://drive.google.com/uc?export=view&id=1x5MeSXzjC4dbmwfESGpspe7WnmkbNKLB
      const rawPictureURL = event.target.value

      // .indexOf('<saml:Attribute Name="uid"')
      const startString = rawPictureURL.indexOf('/d/')
      const endString = rawPictureURL.indexOf('/view')

      if (startString > 0 && endString > 0 && rawPictureURL.includes('google')) {
        const pictureId = rawPictureURL.substring(startString + 3, endString)
        const pictureURL = 'https://drive.google.com/uc?export=view&id=' + pictureId

        this.setState({ rawPictureURL, pictureURL, textFormHasChanged: true })
        console.log('show pic values 1: ', rawPictureURL, pictureURL)
      } else {
        const pictureURL = ''
        this.setState({ rawPictureURL, pictureURL, textFormHasChanged: true })
        console.log('show pic values 2: ', rawPictureURL, pictureURL)
      }
    } else {
      console.log('there was an error in formChangeHandler')
      this.setState({ [event.target.name]: event.target.value })
    }
  }

  saveFile(category, passedFile) {
    console.log('saveFile called', category, passedFile)

    const emailId = this.state.emailId
    const fileName = passedFile.name
    let originalName = category + '|' + emailId + '|' + fileName + '|' + new Date()

    let fileData = new FormData();
    // const fileName = 'profileImage'
    // const fileName = 'newFile'
    fileData.append('baseFileName', passedFile, originalName)

    fetch("/api/file-upload", {
        mode: 'no-cors',
        method: "POST",
        body: fileData
    }).then(function (res) {
      console.log('what is the profile pic response');
      if (res.ok) {

        if (category === 'profilePic') {
          const serverSuccessProfilePic = true
          const serverSuccessMessageProfilePic = category.charAt(0).toUpperCase() + category.slice(1) + ' saved successfully!'
          this.setState({ serverSuccessProfilePic, serverSuccessMessageProfilePic, profilePicFile: passedFile })
        } else if (category === 'resume') {
          const serverSuccessResume = true
          const serverSuccessMessageResume = category.charAt(0).toUpperCase() + category.slice(1) + ' saved successfully!'
          this.setState({ serverSuccessResume, serverSuccessMessageResume, resumeFile: passedFile, resumeName: fileName })
        }

        const self = this

        res.json()
        .then(function(data) {
          console.log('show data: ', data)
          let newFilePath = data.filePath
          console.log('show filePath: ', newFilePath)

          let existingFilePath = null
          if (category === 'profilePic') {
            if (self.state.pictureURL) {
              existingFilePath = self.state.pictureURL
            } else if (self.state.profilePicPath) {
              existingFilePath = self.state.profilePicPath
            }
          } else if (category === 'resume') {
            existingFilePath = self.state.resumeURLValue
          }

          // remove existing file
          if (existingFilePath && !self.state.allowMultipleFiles) {
            const deleteArray = existingFilePath.split("amazonaws.com/")
            console.log('show deleteArrary: ', deleteArray)
            const deleteKey = deleteArray[1].replace(/%7C/g,"|").replace(/%40/g,"@").replace(/\+/gi,' ').replace(/%3A/g,":").replace(/%20/g," ").replace(/%28/g,"(").replace(/%29/g,")").replace(/%2B/g,"+")
            console.log('show deleteKey: ', deleteKey)

            Axios.put('https://www.guidedcompass.com/api/file', { deleteKey })
            .then((response) => {
              console.log('tried to delete', response.data)
              if (response.data.success) {
                //save values
                console.log('File delete worked');

                if (category === 'profilePic') {
                  self.setState({
                    serverPostSuccess: true,
                    serverSuccessMessage: 'File was saved successfully',
                    profilePicPath: newFilePath, pictureURL: newFilePath
                  })
                } else if (category === 'resume') {
                  self.setState({
                    serverPostSuccess: true,
                    serverSuccessMessage: 'File was saved successfully', resumeURLValue: newFilePath
                  })
                }

              } else {
                console.error('there was an error saving the file');
                self.setState({
                  serverPostSuccess: false,
                  serverErrorMessage: response.data.message,
                })
              }
            }).catch((error) => {
                console.log('The saving did not work', error);
                self.setState({
                  serverPostSuccess: false,
                  serverErrorMessage: error,
                })
            });
          }
        })

      } else if (res.status === 401) {
        //unauthorized
        this.setState({
            serverSuccessProfilePic: false,
            serverErrorMessageProfilePic: 'There was an error saving profile pic: Unauthorized save.'
        })
      }
    }.bind(this), function (e) {
      //there was an error
      this.setState({
          serverSuccessProfilePic: false,
          serverErrorMessageProfilePic: 'There was an error saving profile pic:' + e
      })
    }.bind(this));
  }

  render() {

    if (this.props.fromAdvisor) {

        return (
          <ScrollView>
            <View style={[styles.card,styles.topMargin]}>
              <View style={styles.superSpacer} />

              <View>
                <View style={styles.calcColumn60}>
                  <Text style={styles.headingText2}>Edit Profile Info</Text>
                </View>
              </View>

              <View>
                <View>
                  <View>

                    <View style={styles.spacer} />

                    <View>
                      <Text>Click below to change your profile image</Text>
                      <View style={styles.spacer} />
                    </View>

                    <View style={styles.relativePosition}>
                      <TouchableOpacity onPress={this.formChangeHandler}>
                        <View style={styles.profilePhotoContainer}>
                        <Image source={
                          this.state.profilePicImage ? ( { uri: this.state.profilePicImage} )
                          : this.state.pictureURL ? ( { uri: this.state.pictureURL} )
                          : this.state.profilePicPath ? ( { uri: this.state.profilePicPath} )
                          : ( { uri: addProfilePhotoIcon})}
                          style={[styles.square200,styles.contain]}/>
                        </View>
                      </TouchableOpacity>
                      <View style={[styles.width150,styles.relativePosition]}>
                        <View style={[styles.topMarginNegative40,styles.standardBorder,styles.square40,styles.whiteBackground,styles.pinRight]}>
                          <Image source={{ uri: addIcon}} style={[styles.square18,styles.contain,styles.centerItem]} />
                        </View>
                      </View>
                    </View>

                    <View style={styles.spacer} />
                    <Text style={styles.descriptionTextColor}>Dimensions: 200 x 200</Text>
                    <View style={styles.spacer} />

                    <View>

                      {/*<Text for="profilePic" class="custom-file-upload">Upload Profile Pic</Text>*/}

                    </View>

                    { (this.state.serverPostSuccess) ? (
                      <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessage}</Text>
                    ) : (
                      <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>
                    )}
                  </View>

                </View>

                <View>
                  <View style={styles.horizontalLine} />

                  <View style={[styles.row15]}>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Basics'})}>
                      <View style={[styles.row15,styles.rowDirection]}>
                        <View style={styles.width50}>
                          <View style={[styles.miniSpacer]} />
                          <Image source={{ uri: profileIconDark}} style={[styles.square25,styles.contain,styles.centerItem]} />
                        </View>
                        <View style={styles.calcColumn160}>
                          <Text style={[styles.headingText5]}>Basic Info</Text>
                        </View>
                        <View style={styles.width50}>
                          <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                        </View>

                      </View>
                    </TouchableOpacity>

                    {(this.state.roleName === 'Mentor') && (
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Matches')}>
                        <View style={[styles.row15,styles.rowDirection]}>
                          <View style={styles.width50}>
                            <View style={[styles.miniSpacer]} />
                            <Image source={{ uri: abilitiesIconDark}} style={[styles.square25,styles.contain,styles.centerItem]} />
                          </View>
                          <View style={styles.calcColumn160}>
                            <Text style={[styles.headingText5]}>{(this.state.assessmentCount + this.state.assessmentCount > 0) && this.state.assessmentCount + ' '}Career Assessments</Text>
                          </View>
                          <View style={styles.width50}>
                            <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                          </View>

                        </View>
                      </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Sessions', { roleName: 'Advisor'})}>
                      <View style={[styles.row15,styles.rowDirection]}>
                        <View style={styles.width50}>
                          <View style={[styles.miniSpacer]} />
                          <Image source={{ uri: logIconDark}} style={[styles.square25,styles.contain,styles.centerItem]} />
                        </View>
                        <View style={styles.calcColumn160}>
                          <Text style={[styles.headingText5]}>Advising Sessions</Text>
                        </View>
                        <View style={styles.width50}>
                          <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem]}  />
                        </View>

                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Favorites', { userType: 'Advisor'})}>
                      <View style={[styles.row15,styles.rowDirection]}>
                        <View style={styles.width50}>
                          <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                          <Image source={{ uri: favoritesIconGrey}} style={[styles.square20,styles.contain,styles.centerItem]} />
                        </View>
                        <View style={styles.calcColumn160}>
                          <Text style={[styles.headingText5]}>{(this.state.favorites && this.state.favorites.length) && this.state.favorites.length + ' '}Favorites</Text>
                        </View>
                        <View style={styles.width50}>
                          <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                        </View>

                      </View>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => this.props.navigation.navigate('Favorites', { userType: 'MySocialPosts'})}>
                      <View style={[styles.row15,styles.rowDirection]}>
                        <View style={styles.width50}>
                          <View style={[styles.miniSpacer]} />
                          <Image source={{ uri: socialIconDark}} style={[styles.square22,styles.contain,styles.centerItem]} />
                        </View>
                        <View style={styles.calcColumn160}>
                          <Text style={[styles.headingText5]}>My Social Posts</Text>
                        </View>
                        <View style={styles.width50}>
                          <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                        </View>

                      </View>
                    </TouchableOpacity>
                    {(this.state.roleName !== 'Mentor') && (
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Exchange', { category: 'My Posts'})}>
                        <View style={[styles.row15,styles.rowDirection]}>
                          <View style={styles.width50}>
                            <View style={[styles.miniSpacer]} />
                            <Image source={{ uri: courseIconDark}} style={[styles.square22,styles.contain,styles.centerItem]} />
                          </View>
                          <View style={styles.calcColumn160}>
                            <Text style={[styles.headingText5]}>My Curriculum Posts</Text>
                          </View>
                          <View style={styles.width50}>
                            <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                          </View>

                        </View>
                      </TouchableOpacity>
                    )}

                  </View>
                </View>

              </View>
            </View>
          </ScrollView>
        )
      } else {

        return (
            <ScrollView>
                <View style={[styles.card,styles.topMargin]}>
                    <View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/><View style={styles.spacer}/>

                    <View>
                      <View style={[styles.row10,styles.rowDirection]}>
                        <View style={[styles.rightPadding,styles.width180]}>
                          <View>
                            <View>
                              <View>
                                <View style={styles.spacer} />
                                <View style={styles.relativePosition}>
                                  <Text for="profilePic">
                                    <TouchableOpacity onPress={this.formChangeHandler}>
                                      <View style={styles.profilePhotoContainer}>
                                        <Image source={
                                          this.state.profilePicImage ? ( { uri: this.state.profilePicImage} )
                                          : this.state.pictureURL ? ( { uri: this.state.pictureURL} )
                                          : this.state.profilePicPath ? ( { uri: this.state.profilePicPath} )
                                          : ( { uri: addProfilePhotoIcon})}
                                          style={[styles.square200,styles.contain]}/>
                                      </View>
                                    </TouchableOpacity>
                                    <View style={[styles.width150,styles.relativePosition]}>
                                      <View style={[styles.topMarginNegative40,styles.standardBorder,styles.square40,styles.whiteBackground,styles.pinRight]}>
                                        <Image source={{ uri: addIcon}} style={[styles.square18,styles.centerItem]} />
                                      </View>
                                    </View>
                                  </Text>
                                </View>

                                <View style={styles.spacer} />
                                <Text style={[styles.descriptionText2,styles.calcColumn60,styles.centerText]}>Dimensions: 150 x 150</Text>
                                <View style={styles.spacer} />
                              </View>
                            </View>

                          </View>
                        </View>
                        <View style={styles.calcColumn180}>
                          <View style={styles.spacer} />
                          <View style={[styles.row5]}>
                            <Text style={styles.headingText2}>{this.state.firstNameValue} {this.state.lastNameValue}</Text>
                          </View>
                          <View style={[styles.row5]}>

                            <Text>Student @ {this.state.schoolValue}{(this.state.gradYear) && " '" + this.state.gradYear.substring(2,4)}</Text>
                            {(this.state.oauthUid) && (
                              <View>
                                <Text style={[styles.errorColor,styles.topMargin]}>UID: {this.state.oauthUid}</Text>
                              </View>
                            )}
                          </View>
                        </View>

                        {(this.state.publicProfile) ? (
                          <View>
                            <View style={[styles.topMargin20]}>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: this.state.username})}>
                                <View style={[styles.slightlyRoundedCorners,styles.ctaBackgroundColor,styles.mediumShadow,styles.row10,styles.horizontalPadding30,styles.rightMargin]}>
                                  <Text style={[styles.whiteColor,styles.descriptionText2]}>Preview Profile in Portal</Text>
                                </View>
                              </TouchableOpacity>

                              {(this.state.publicProfileExtent === 'Public') && (
                                <View>

                                  <View style={styles.spacer} />
                                  <TouchableOpacity onPress={() => Linking.openURL('https://www.guidedcompass.com/' + this.state.username + '/profile')}>
                                    <View style={[styles.slightlyRoundedCorners,styles.ctaBorder,styles.mediumShadow,styles.row10,styles.horizontalPadding30]}>
                                      <Text style={[styles.ctaColor,styles.descriptionText2]}>Preview Public Profile</Text>
                                    </View>
                                  </TouchableOpacity>
                                </View>
                              )}
                            </View>
                          </View>
                        ) : (
                          <View>
                            {(!this.state.remoteAuth) && (
                              <View style={[styles.topPadding20,styles.descriptionText2]}>
                                <Text>Your profile is currently private. To change your preferences, <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Visibility Preferences'})}><Text>click here</Text></TouchableOpacity></Text>
                              </View>
                            )}
                          </View>
                        )}

                        { (this.state.serverSuccessProfilePic) ? (
                          <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessageProfilePic}</Text>
                        ) : (
                          <Text style={[styles.errorColor]}>{this.state.serverErrorMessageProfilePic}</Text>
                        )}
                      </View>

                      <View style={styles.horizontalLine} />

                      <View style={[styles.row15]}>
                        <View style={[styles.row15]}>
                          <Text style={[styles.headingText4]}>Application Materials</Text>
                        </View>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Basics'})}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: profileIconDark}} style={[styles.square25,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>Basic Info <Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>
                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Profile Details'})}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                              <Image source={{ uri: opportunitiesIconDark}} style={[styles.square25,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>Projects, Experience, & Other Details <Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>

                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Assessments')}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: abilitiesIconDark}} style={[styles.square25,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>{(this.state.assessmentCount + this.state.assessmentCount > 0) && this.state.assessmentCount + ' '}Career Assessments <Text style={[styles.errorColor,styles.boldText]}>*</Text></Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>

                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Endorsements', { category: 'Visibility Preferences'})}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: endorsementIconDark}} style={[styles.square25,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>{(this.state.endorsements && this.state.endorsements.length > 0) && this.state.endorsements.length + ' '}Competency Endorsements</Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>
                          </View>
                        </TouchableOpacity>
                      </View>

                      <View style={[styles.row15]}>
                        <View style={[styles.row15]}>
                          <Text style={[styles.headingText4]}>Other Profile Items</Text>
                        </View>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditProfileDetails', { category: 'Visibility Preferences'})}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: publicIcon}} style={[styles.square25,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>Profile Visibility Preferences</Text>
                            </View>

                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>


                            {(this.state.publicPreferencesErrorMessage && this.state.publicPreferencesErrorMessage !== '') && <Text style={[styles.descriptionText2,styles.errorColor,styles.boldText,styles.leftPadding]}>{this.state.publicPreferencesErrorMessage}</Text>}
                            {(this.state.publicPreferencesSuccessMessage && this.state.publicPreferencesSuccessMessage !== '') && <Text style={[styles.descriptionText2,styles.ctaColor,styles.boldText,styles.leftPadding]}>{this.state.publicPreferencesSuccessMessage}</Text>}

                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Logs')}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: logIconDark}} style={[styles.square25,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>{(this.state.logs && this.state.logs.length > 0) && this.state.logs.length + ' '}Career Goals & Other Logs</Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>

                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Favorites')}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                              <Image source={{ uri: favoritesIconGrey}} style={[styles.square20,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>{(this.state.favorites && this.state.favorites.length) && this.state.favorites.length + ' '}Favorites</Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>

                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Completions')}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: checkmarkDarkGreyIcon}} style={[styles.square22,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>Completed Items</Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>

                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('My Social Posts')}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: socialIconDark}} style={[styles.square22,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>My Social Posts</Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>

                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Matches')}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: benchmarksIconDark}} style={[styles.square22,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>My Top Matches</Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>

                          </View>
                        </TouchableOpacity>

                      </View>

                      <View style={[styles.row15]}>
                        <View style={[styles.row15]}>
                          <Text style={[styles.headingText4]}>Tools</Text>
                        </View>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Resume Builder')}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: resumeIconDark}} style={[styles.square25,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>Resume Builder</Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>

                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Financial Planner')}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: moneyIconDark}} style={[styles.square25,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>Financial Planner</Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>

                          </View>
                        </TouchableOpacity>

                        <TouchableOpacity onPress={() => this.props.navigation.navigate('Career Plan Builder')}>
                          <View style={[styles.row15,styles.rowDirection]}>
                            <View style={styles.width50}>
                              <View style={[styles.miniSpacer]} />
                              <Image source={{ uri: targetIcon}} style={[styles.square25,styles.contain,styles.centerItem]} />
                            </View>
                            <View style={styles.calcColumn160}>
                              <Text style={[styles.headingText5]}>Career Plan Builder</Text>
                            </View>
                            <View style={styles.width50}>
                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.centerItem,styles.pinRight]} />
                            </View>

                          </View>
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>

            </ScrollView>
        )
      }
  }

}

export default EditProfile;
