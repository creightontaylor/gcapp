import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform,Linking } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

const careerMatchesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-blue.png';
const mentoringIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/mentoring-icon-blue.png';
const favoritesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-dark.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const projectsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-blue.png';
const employerIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/employer-icon.png';
const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const jobsIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/jobs-icon-grey.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const linkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon.png';
const eventIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/event-icon-blue.png';
const problemIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/problem-icon-blue.png';
const challengeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/challenge-icon-blue.png';
const internIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/intern-icon-blue.png';
const moneyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/money-icon-blue.png';
const courseIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/course-icon-blue.png';

class Favorites extends Component {
  constructor(props) {
    super(props)
    this.state = {
      favorites: [],
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.favoriteItem = this.favoriteItem.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ', this.props.activeOrg, prevProps)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData()
    }
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

        Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId } })
        .then((response) => {
          console.log('Favorites query attempted', response.data);

            if (response.data.success) {
              console.log('successfully retrieved favorites', response.data.favorites.length)

              if (response.data.favorites.length > 0) {
                console.log('the array is greater than 0', response.data.favorites.length)

                const orgCode = activeOrg

                //query info on those favorites
                Axios.get('https://www.guidedcompass.com/api/favorites/detail', { params: { favorites: response.data.favorites, orgCode, orgFocus } })
                .then((response2) => {
                  console.log('Favorites detail query attempted', response2.data);

                  if (response2.data.success) {
                    console.log('successfully retrieved favorites detail', response2.data.favorites)

                    //query info on those favorites
                    this.setState({
                      types: response2.data.types,
                      filteredTypes: response2.data.types,
                      favorites: response2.data.favorites,
                      filteredFavorites: response2.data.favorites,
                      favoriteIds: response.data.favorites
                    })

                  } else {
                    console.log('no favorites detail data found', response2.data.message)
                  }

                }).catch((error) => {
                    console.log('Favorites detail query did not work', error);
                });
              }

            } else {
              console.log('no favorites data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Favorites query did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  favoriteItem(item) {
    console.log('favoriteItem called', item, this.state.favoriteIds.length)

    let itemId = item._id

    let favoriteIds = this.state.favoriteIds
    let favorites = this.state.favorites
    let types = this.state.types

    if (favoriteIds.includes(itemId)){
      console.log('its included')
      let index = favoriteIds.indexOf(itemId)

      if (index > -1) {
        favoriteIds.splice(index, 1);
      }

      for (let i = 1; i <= favorites.length; i++) {
        if (favorites[i - 1]._id === itemId) {
          favorites.splice(i - 1, 1);
          types.splice(i - 1, 1);
        }
      }

      console.log('show favorites before save', itemId, index, favoriteIds)

      Axios.post('https://www.guidedcompass.com/api/favorites/save', {
        favoritesArray: favoriteIds, emailId: this.state.emailId
      }).then((response) => {
        console.log('attempting to remove favorites')
        if (response.data.success) {
          console.log('saved removal from favorites', response.data)
          //clear values
          this.setState({
            serverSuccessPlan: true,
            serverSuccessMessagePlan: 'Favorite saved!'
          })
        } else {
          console.log('did not save successfully')
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'error:' + response.data.message
          })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'there was an error saving favorites'
          })
      });
    }

    console.log('favorites', favoriteIds, favorites, types)
    this.setState({ favoriteIds: favoriteIds, favorites, types })
  }

  renderFavorites() {
    console.log('renderFavorites called')

    let rows = [];
    if (this.state.favorites && this.state.favorites.length > 0) {
      for (let i = 1; i <= this.state.favorites.length; i++) {

        const index = i - 1
        const item = this.state.favorites[i - 1]
        // console.log('show type: ', this.state.types[i - 1], item.name)

        if (this.state.types[i - 1] === 'course') {
          console.log('in course', this.state.types, this.state.favorites)

          // console.log('compare ids: ', this.state.favorites, item._id )

          rows.push(
            <View key={index}>
              <View style={[styles.spacer]} />

              <View style={[styles.rowDirection]}>
                <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + item.url)} style={[styles.calcColumn120,styles.rowDirection]}>
                  <View style={[styles.width70]}>
                    <Image source={{ uri: item.image_125_H}} style={[styles.square60,styles.contain]}/>
                  </View>
                  <View style={[styles.calcColumn180]}>
                    <Text style={[styles.headingText5]}>{item.title}</Text>
                    <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>{item.headline}</Text>
                    <View style={[styles.halfSpacer]} />
                  </View>
                </TouchableOpacity>

                <View style={[styles.width30,styles.topMargin,styles.centerText,styles.rightPadding]} >
                  <TouchableOpacity disabled={this.state.isSaving} onPress={() => this.favoriteItem(item,'course') }>
                    <Image source={(this.state.favoriteIds.includes(item._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                  </TouchableOpacity>
                </View>

                <View style={[styles.width25,styles.leftPadding]} >
                  <View>
                    <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                    <TouchableOpacity onPress={() => Linking.openURL(item.url)} >
                      <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>

              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
              <View style={[styles.horizontalLine]} />

              <View style={[styles.spacer]} />
            </View>
          )
        } else {
          console.log('not in course')
          if (this.props.pageSource !== 'courses') {

            let pathPrefix = '/app'
            if (this.props.fromAdvisor) {
              pathPrefix = '/advisor'
            }
            if (this.state.types[i - 1] === 'career') {

              rows.push(
                <View key={index} style={[styles.calcColumn60,styles.row20,styles.rowDirection]}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { careerSelected: item })} style={[styles.rowDirection,styles.calcColumn120]}>
                    <View style={[styles.width60]}>
                      <Image source={(item.imageURL) ? { uri: careerMatchesIconBlue} : { uri: careerMatchesIconBlue}} style={[styles.square50,styles.contain,styles.centerItem]}/>
                    </View>
                    <View style={[styles.calcColumn180,styles.leftPadding20]}>
                      <View>
                        <Text style={[styles.headingText5]}>{item.name}</Text>
                      </View>
                      <View>
                        <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.curtailText]}>{item.jobFunction}{(item.jobFunction && item.industry) && ' | ' + item.industry}{(!item.jobFunction && item.industry) && item.industry}{(item.jobFamily) && ' | ' + item.jobFamily}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.width30,styles.topMargin,styles.rightPadding]}>
                      <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                        <Image source={{ uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.width20,styles.topMargin15]}>
                      <TouchableOpacity  onPress={() => this.props.navigation.navigate('CareerDetails', { selectedCareer: item })}>
                        <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                      </TouchableOpacity>
                    </View>

                  </View>

                </View>
              )

            } else if (this.state.types[i - 1] === 'mentor') {

              let workLine = item.firstName + ' has not entered their work information yet'

              rows.push(
                <View key={index} style={[styles.row20,styles.calcColumn60]}>
                  <TouchableOpacity  onPress={() => this.props.navigation.navigate('AdvisorProfile', { selectedMentor: item })} style={[styles.rowDirection,styles.calcColumn120]}>
                    <View style={[styles.width60]}>
                      <Image source={(item.pictureURL) ? { uri: item.pictureURL} : { uri: mentoringIconBlue}} style={[styles.square50,styles.contain,styles.centerItem]}/>
                    </View>
                    <View style={[styles.calcColumn180,styles.leftPadding20]}>
                      <View>
                        <Text style={[styles.headingText5]}>{item.title}</Text>
                      </View>
                      <View>
                        <Text style={[styles.headingText6]}>{item.firstName} {item.lastName}</Text>
                        <Text>{workLine}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.width30,styles.topMargin,styles.rightPadding]}>
                      <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                        <Image source={{ uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.width22,styles.topMargin15]}>
                      <TouchableOpacity  onPress={() => this.props.navigation.navigate('AdvisorProfile', { selectedMentor: item })}>
                        <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              )
            } else if (this.state.types[i - 1] === 'student') {

              rows.push(
                <View key={index} style={[styles.row20,styles.calcColumn60,styles.rowDirection]}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('Profile', { username: item.username })} style={[styles.rowDirection, styles.calcColumn120]}>
                    <View style={[styles.width60]}>
                      <Image source={(item.pictureURL) ? { uri: item.pictureURL} : { uri: mentoringIconBlue}} style={[styles.square50,styles.contain,styles.centerItem]}/>
                    </View>
                    <View style={[styles.calcColumn180,styles.leftPadding20]}>
                      <View>
                        <Text style={[styles.headingText6]}>{item.firstName} {item.lastName}</Text>
                        <Text>{item.school} {item.gradYear}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.width30,styles.topMargin,styles.rightPadding]}>
                      <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                        <Image source={{ uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.width20,styles.topMargin15]}>
                      <TouchableOpacity  onPress={() => Linking.openURL('https://www.guidedcompass.com/' + item.username + '/profile')}>
                        <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              )
            } else if (this.state.types[i - 1] === 'problem' || item.postType === 'Assignment' || item.postType === 'Problem' || item.postType === 'Challenge') {
              let imgSrc = internIconBlue
              if (item.postType === 'Event') {
                imgSrc = eventIconBlue
              } else if (item.postType === 'Problem') {
                imgSrc = problemIconBlue
              } else if (item.postType === 'Challenge') {
                imgSrc = challengeIconBlue
              } else if (item.postType === 'Scholarship') {
                imgSrc = moneyIconBlue
              }

              if (item.imageURL) {
                imgSrc = item.imageURL
              }

              let subtitle = item.employerName + " | " + item.postType
              if (!item.employerName) {
                subtitle = item.orgName + " | " + item.postType
              }

              let path = '/app/opportunities/'
              let passedState = { selectedOpportunity: item }
              // if (this.props.fromAdvisor) {
              //   path = '/advisor/opportunities/'
              // }

              rows.push(
                <View key={index}>
                  <View style={[styles.row20,styles.calcColumn60,styles.rowDirection]}>
                    <TouchableOpacity  onPress={() => this.props.navigation.navigate('OpportunityDetails', passedState)} style={[styles.rowDirection,styles.calcColumn120]}>
                      <View style={[styles.width60]}>
                        <Image source={{ uri: imgSrc}} style={[styles.square50,styles.centerItem]}/>
                      </View>
                      <View style={[styles.calcColumn180,styles.leftPadding20]}>
                        <View>
                          {(item.name) ? (
                            <Text style={[styles.headingText5]}>{item.name}</Text>
                          ) : (
                            <Text style={[styles.headingText5]}>{item.title}</Text>
                          )}
                        </View>
                        <View>
                          <Text>{subtitle}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <View style={[styles.width30,styles.topMargin,styles.rightPadding]}>
                      <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                        <Image source={{ uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.width20,styles.topMargin]}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', passedState)}>
                        <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                      </TouchableOpacity>
                    </View>

                  </View>

                </View>
              )
            } else if (this.state.types[i - 1] === 'work') {

              let imgSrc = internIconBlue
              if (item.imageURL) {
                imgSrc = item.imageURL
              }

              let subtitle = item.employerName + " | " + item.postType
              if (!item.employerName) {
                subtitle = item.orgName + " | " + item.postType
              }

              let path = '/app/opportunities/'
              let passedState = { selectedOpportunity: item }
              if (this.props.fromAdvisor) {
                path = '/advisor/opportunities/'
              }

              if (item.isExternal) {
                rows.push(
                  <View key={index} style={[styles.row20,styles.calcColumn60]}>
                    <TouchableOpacity  onPress={() => Linking.openURL(item.jobLink)} style={[styles.rowDirection,styles.calcColumn120]}>
                      <View style={[styles.width60]}>
                        <Image source={(item.imageURL) ? { uri: item.imageURL} : { uri: jobsIconGrey}} style={[styles.square50,styles.contain]}/>
                      </View>
                      <View style={[styles.calcColumn180,styles.leftPadding20]}>
                        <View>
                          <Text>{item.title}</Text>
                        </View>
                        <View>
                          <Text>{item.employerName}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View style={[styles.leftPadding]}>
                      <View style={[styles.width30,styles.rightPadding]}>
                        <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                          <Image source={{ uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.width20,styles.topMargin15]}>
                        <TouchableOpacity  onPress={() => Linking.openURL(item.jobLink)}>
                          <Image source={{ uri: linkIcon}} style={[styles.square20,styles.contain]}/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                )
              } else {
                rows.push(
                  <View key={index}>
                    <View style={[styles.row20,styles.calcColumn60,styles.rowDirection]}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', passedState)} style={[styles.rowDirection,styles.calcColumn120]}>
                        <View style={[styles.width60]}>
                          <Image source={{ uri: imgSrc}} style={[styles.square50,styles.centerItem]}/>
                        </View>
                        <View style={[styles.calcColumn180,styles.leftPadding20]}>
                          <View>
                            {(item.name) ? (
                              <Text style={[styles.headingText5]}>{item.name}</Text>
                            ) : (
                              <Text style={[styles.headingText5]}>{item.title}</Text>
                            )}
                          </View>
                          <View>
                            <Text>{subtitle}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>

                      <View style={[styles.width30,styles.topMargin,styles.rightPadding]}>
                        <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                          <Image source={{ uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.width20,styles.topMargin]}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', passedState)}>
                          <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                        </TouchableOpacity>
                      </View>

                    </View>
                  </View>
                )
              }
            } else if (this.state.types[i - 1] === 'project') {

              let pathPrefix = '/app'
              if (this.props.fromAdvisor) {
                pathPrefix = '/advisor'
              }

              rows.push(
                <View key={index} style={[styles.row20,styles.calcColumn60,styles.rowDirection]}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('ProjectDetails', { selectedProject: item })} style={[styles.rowDirection,styles.calcColumn120]}>
                    <View style={[styles.width60]}>
                      <Image source={(item.imageURL) ? { uri: item.imageURL} : { uri: projectsIconBlue}} style={[styles.square50,styles.centerItem]}/>
                    </View>
                    <View style={[styles.calcColumn180,styles.leftPadding20]}>
                      <View>
                        <Text style={[styles.headingText5]}>{item.name}</Text>
                      </View>
                      <View>
                        <Text style={[styles.headingText6]}>{item.userFirstName} {item.userLastName}</Text>
                        <Text>{item.hours} Hours</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.width30,styles.topMargin,styles.rightPadding]}>
                      <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                        <Image source={{ uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.width20,styles.topMargin15]}>
                      <TouchableOpacity  onPress={() => this.props.navigation.navigate('ProjectDetails', { selectedProject: item })}>
                        <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              )
            } else if (this.state.types[i - 1] === 'employer') {

              let pathPrefix = '/app'
              if (this.props.fromAdvisor) {
                pathPrefix = '/advisor'
              }

              rows.push(
                <View key={index} style={[styles.row20,styles.calcColumn60,styles.rowDirection]}>
                  <TouchableOpacity  onPress={() => this.props.navigation.navigate('EmployerDetails', { selectedEmployer: item })} style={[styles.rowDirection,styles.calcColumn120]}>
                    <View style={[styles.width60]}>
                      <Image source={(item.employerLogoURI) ? { uri: item.employerLogoURI} : { uri: employerIconBlue}} style={[styles.square50,styles.centerItem]}/>
                    </View>
                    <View style={[styles.calcColumn180,styles.leftPadding20]}>
                      <View>
                        <Text style={[styles.headingText5]}>{item.employerName}</Text>
                      </View>
                      <View>
                        <Text style={[styles.standardText]}>{item.employerIndustry}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.width30,styles.topMargin,styles.rightPadding]}>
                      <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                        <Image source={{ uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.width20,styles.topMargin15]}>
                      <TouchableOpacity  onPress={() => this.props.navigation.navigate('EmployerDetails', { selectedEmployer: item })}>
                        <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              )
            } else if (this.state.types[i - 1] === 'curriculumItem') {

              rows.push(
                <View key={index} style={[styles.row20,styles.calcColumn60,styles.rowDirection]}>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('AdvisorExchange')} style={[styles.rowDirection,styles.calcColumn120]}>
                    <View style={[styles.width60]}>
                      <Image source={{ uri: courseIconBlue}} style={[styles.square50,styles.centerItem]}/>
                    </View>
                    <View style={[styles.calcColumn180,styles.leftPadding20]}>
                      <View>
                        <Text style={[styles.headingText5]}>{item.itemName}</Text>
                      </View>
                      <View>
                        <Text style={[styles.headingText6]}>by {item.firstName} {item.lastName}</Text>
                      </View>
                      <View>
                        <Text style={[styles.descriptionText2]}>Curriculum Type: {item.exchangeType}</Text>
                      </View>
                    </View>
                  </TouchableOpacity>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.width30,styles.topMargin,styles.rightPadding]}>
                      <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                        <Image source={{ uri: favoritesIconBlue}} style={[styles.square20,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.width20,styles.topMargin15]}>
                      <TouchableOpacity  onPress={() => this.props.navigation.navigate('AdvisorExchange')}>
                        <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                  </View>

                </View>
              )
            }
          }
        }
      }
    } else {
      rows.push(
        <View key={1} style={[styles.flexCenter,styles.padding30,styles.flex1]}>
          <View>
            <View style={[styles.flex1,styles.flexCenter]}>
              <Image source={{ uri: favoritesIconDark}} style={[styles.square120,styles.contain,styles.centerHorizontally]}/>
            </View>

            <Text style={[styles.headingText3,styles.centerText,styles.topMargin20]}>No Favorited Items Yet</Text>
            <Text style={[styles.topMargin20,styles.centerText,styles.topMargin]}>This are contains all things you have favorited.</Text>
          </View>
        </View>
      )
    }

    return rows

  }

  render() {

    let topPadding = [styles.topPadding40]
    let wrapper = []
    let subtitle = "Favorited career paths, courses, mentors, and work learning opportunities."
    if (this.props.pageSource === 'courses') {
      topPadding = []
      wrapper = [styles.padding20]
      subtitle = "Favorited courses"
    }

    return (
        <ScrollView style={wrapper}>
          <View style={[styles.card]}>
            <View style={topPadding}>
              <Text style={[styles.headingText2]}>Favorites</Text>
            </View>

            <View style={[styles.spacer]} />

            <Text style={[styles.descriptionText2]}>{subtitle}</Text>

            {this.renderFavorites()}


          </View>
        </ScrollView>

    )
  }

}

export default Favorites;
