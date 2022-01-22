import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import * as Progress from 'react-native-progress';
import { WebView } from 'react-native-webview';

const industryIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/industry-icon-dark.png';
const favoritesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-dark.png';
const favoriteIconSelected  = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorite-icon-selected.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-incidicator-icon.png';
const appliedIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/applied-icon-blue.png';
const eventIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/event-icon-dark.png';
const projectsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-dark.png';
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png';
const benchmarksIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/benchmarks-icon-dark.png';

import {convertDateToString} from '../functions/convertDateToString';

class EmployerDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showBenchmarks: false,
      subNavSelected: 'Home',
      subNavCategories: [],
      favorites: []
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.subNavClicked = this.subNavClicked.bind(this)
    this.favoriteItem = this.favoriteItem.bind(this)
    this.closeModal = this.closeModal.bind(this)

  }

  componentDidMount() {
    console.log('employer details component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in employerDetails ')

    if (prevProps.employerId !== this.props.employerId || prevProps.selectedEmployer !== this.props.selectedEmployer) {
      this.retrieveData()
    } else if (prevProps.accountCode !== this.props.accountCode){
      this.retrieveData()
    } else if (prevProps.subNavSelected !== this.props.subNavSelected){
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

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

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, orgFocus, orgName, remoteAuth
        })


        let employerId = this.props.employerId
        if (this.props.selectedEmployer) {
          employerId = this.props.selectedEmployer._id
          this.props.navigation.setOptions({ headerTitle: this.props.selectedEmployer.employerName })
        }

        if (employerId || this.props.accountCode) {

          let subNavCategories = ['Home','Videos','About','Posts','Events','Projects','Work']
          if (this.state.showBenchmarks) {
            subNavCategories = ['Home','Videos','About','Posts','Events','Projects','Work','Benchmarks']
          }

          let subNavSelected = this.state.subNavSelected
          if (this.props.subNavSelected) {
            subNavSelected = this.props.subNavSelected
          }

          this.setState({ emailId: email, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
            roleName, activeOrg, accountCode: this.props.accountCode, subNavCategories, subNavSelected
          })

          let accountQuery = { _id: employerId }
          if (this.props.accountCode) {
            accountQuery = { accountCode: this.props.accountCode }
          }

          Axios.get('https://www.guidedcompass.com/api/account', { params: accountQuery })
          .then((response) => {
            console.log('Account info query attempted within employer details', response.data);

            if (response.data.success) {
              console.log('account info query worked in sub settings')

              const employer = response.data.accountInfo
              this.setState({ employer })

              Axios.get('https://www.guidedcompass.com/api/get-followers', { params: { _id: employer._id } })
              .then((response) => {
                console.log('Followers query attempted', response.data);

                if (response.data.success) {
                  console.log('followers query worked in sub settings')

                  const followers = response.data.followers
                  this.setState({ followers })
                }

              }).catch((error) => {
                console.log('Followers query did not work for some reason', error);
              });

              const accountCode = employer.accountCode
              const recent = true
              const active = true

              Axios.get('https://www.guidedcompass.com/api/postings/user', { params: { accountCode, orgCode: activeOrg,  recent, active } })
              .then((response) => {
                console.log('Sub postings query attempted now', response.data);

                if (response.data.success) {
                  console.log('posted postings query worked')

                  if (response.data.postings && response.data.postings.length !== 0) {

                    const postings = response.data.postings
                    let events = []
                    let projects = []
                    let work = []
                    for (let i = 1; i <= postings.length; i++) {
                      if (postings[i - 1].postType === 'Event') {
                        events.push(postings[i - 1])
                      } else if (postings[i - 1].postType === 'Individual' || postings[i - 1].postType === 'Internship' || postings[i - 1].postType === 'Work') {
                        work.push(postings[i - 1])
                      } else {
                        projects.push(postings[i - 1])
                      }
                    }

                    this.setState({ postings, events, projects, work });
                  }

                } else {
                  console.log('posted postings query did not work', response.data.message)
                }

              }).catch((error) => {
                  console.log('Posted postings query did not work for some reason', error);
              });

              if (this.state.showBenchmarks) {
                Axios.get('https://www.guidedcompass.com/api/benchmarks', { params: { accountCode, pathwayLevel: true } })
                .then((response) => {
                  console.log('Benchmarks query within employerDetails attempted', response.data);

                  if (response.data.success) {
                    console.log('benchmark query worked')

                    if (response.data.benchmarks.length !== 0) {
                      //jobs = response.data.postings
                      console.log('set the benchmark to state')

                      let benchmarks = response.data.benchmarks
                      this.setState({ benchmarks });
                    }

                  }

                }).catch((error) => {
                    console.log('Benchmark query did not work for some reason', error);
                });
              }
            }

          }).catch((error) => {
            console.log('Account info query did not work for some reason', error);
          });

          Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId: email } })
         .then((response) => {
             console.log('Favorites query attempted', response.data);

             if (response.data.success) {
               console.log('successfully retrieved favorites')

               this.setState({ favorites: response.data.favorites })
             } else {
               console.log('no favorites data found', response.data.message)
             }

         }).catch((error) => {
             console.log('Favorites query did not work', error);
         });
        }
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  subNavClicked(subNavSelected) {
    console.log('subNavClicked called', subNavSelected)

    this.setState({ subNavSelected })
  }

  favoriteItem(item) {
    console.log('favoriteItem called', item)

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    let itemId = item._id

    let favoritesArray = this.state.favorites

    if (favoritesArray.includes(itemId)){
      let index = favoritesArray.indexOf(itemId)
      if (index > -1) {
        favoritesArray.splice(index, 1);
      }
    } else {
      // console.log('adding item: ', favoritesArray, itemId)
      favoritesArray.push(itemId)
    }

    console.log('favorites', favoritesArray)
    this.setState({ favorites: favoritesArray })

    Axios.post('https://www.guidedcompass.com/api/favorites/save', {
      favoritesArray, emailId: this.state.emailId
    })
    .then((response) => {
      console.log('attempting to save favorites')
      if (response.data.success) {
        console.log('saved successfully', response.data)
        //clear values
        this.setState({ successMessage: 'Favorite saved!', isSaving: false })
      } else {
        console.log('did not save successfully')
        this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
      }
    }).catch((error) => {
        console.log('save did not work', error);
        this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false })
    });
  }

  closeModal() {
    console.log('closeModal in SubEmployerDetails')

    this.props.closeModal()

  }

  render() {

    let linkPrefix = '/app'
    if (this.props.fromAdvisor) {
      linkPrefix = '/advisor'
    }

    return (
        <ScrollView>
          {(!this.state.employer) ? (
            <View style={[styles.card,styles.padding40,styles.flexCenter]}>
              <Text style={[styles.standardText]}>No employer found</Text>
            </View>
          ) : (
            <View>
              <View style={(this.props.inModal) ? [] : [styles.card,styles.topMargin20]}>
                <View>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.width90]}>
                      <Image source={(this.state.employer.employerLogoURI) ? { uri: this.state.employer.employerLogoURI} : { uri: industryIconDark}} style={[styles.square80,styles.contain]} />
                    </View>
                    <View style={[styles.calcColumn150,styles.leftPadding,styles.topPadding5]}>
                      <Text style={[styles.headingText2]}>{this.state.employer.employerName}</Text>

                      <View style={[styles.topPadding5]}>
                        <Text style={[styles.standardText]}>{this.state.employer.employerIndustry}</Text>

                        <View style={[styles.rowDirection,styles.flexWrap,styles.topPadding5]}>
                          {(this.state.employer.employerLocation) && (
                            <View style={[styles.rowDirection]}>
                              <Text style={[styles.leftPadding5,styles.descriptionText2,styles.descriptionTextColor]}>{this.state.employer.employerLocation}</Text>
                            </View>
                          )}
                          {(this.state.followers && this.state.followers.length > 0) && (
                            <View style={[styles.rowDirection]}>
                              {(this.state.employer.employerLocation) && (
                                <Text style={[styles.leftPadding5,styles.descriptionText2,styles.descriptionTextColor]}>|</Text>
                              )}
                              <Text style={[styles.leftPadding5,styles.descriptionText2,styles.descriptionTextColor]}>{this.state.followers.length} Followers</Text>
                            </View>
                          )}
                        </View>
                      </View>
                    </View>

                  </View>

                  <View style={[styles.topPadding20,styles.rowDirection,styles.flex1]}>
                    <View style={[styles.flex50,styles.horizontalPadding5]}>
                      <TouchableOpacity style={(this.state.favorites.includes(this.state.employer._id)) ? [styles.btnSquarish,styles.mediumBackground,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.favoriteItem(this.state.employer)}><Text style={[styles.whiteColor,styles.descriptionText1]}>{(this.state.favorites.includes(this.state.employer._id)) ? "Following" : "+ Follow"}</Text></TouchableOpacity>
                    </View>

                    {(this.state.employer.employerURL) && (
                      <View style={[styles.flex50,styles.horizontalPadding5]}>
                        <TouchableOpacity style={[styles.btnSquarish,styles.ctaBorder,styles.flexCenter]} onPress={() => Linking.openURL(this.state.employer.employerURL)}><Text style={[styles.descriptionText1,styles.ctaColor]}>Visit website</Text></TouchableOpacity>
                      </View>
                    )}
                  </View>
                </View>
              </View>
              <View style={(this.props.inModal) ? [] : [styles.cardClearPadding,styles.topMargin20]}>
                <View>
                  <View>
                    <ScrollView style={[styles.carousel,styles.horizontalPadding20]} horizontal={true}>
                      {this.state.subNavCategories.map((value, index) =>
                        <View style={[styles.row10,styles.rightPadding30]}>
                          {(this.state.subNavCategories[index] === this.state.subNavSelected) ? (
                            <View style={[styles.selectedCarouselItem]}>
                              <Text key={value} style={[styles.headingText6]}>{value}</Text>
                            </View>
                          ) : (
                            <TouchableOpacity style={[styles.menuButton]} onPress={() => this.subNavClicked(value)}>
                              <Text key={value} style={[styles.headingText6]}>{value}</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      )}
                    </ScrollView>
                  </View>
                </View>
              </View>

              {(this.state.subNavSelected === 'Home' || this.state.subNavSelected === 'Videos') && (
                <View style={(this.props.inModal) ? [styles.card,styles.verticalMargin10] : [styles.card,styles.centerHorizontally,styles.verticalMargin30,styles.fullScreenWidth]}>
                  <View>
                    <Text style={[styles.headingText3]}>Videos</Text>
                    <Text style={[styles.descriptionText1]}>Watch a day in the life at this company, get interview tips, and learn relevant skills.</Text>
                  </View>

                  <View style={[styles.spacer]} />

                  {(this.state.employer.videos && this.state.employer.videos.length > 0) ? (
                    <View>
                      {this.state.employer.videos.map((value, index) =>
                        <View key={value}>
                          <View>
                            <View style={[styles.topMargin20]}>
                              <View>
                                <View>
                                  <WebView
                                    style={[styles.calcColumn60,styles.screenHeight20]}
                                    javaScriptEnabled={true}
                                    source={{uri: value}}
                                  />

                                </View>

                              </View>
                            </View>
                          </View>
                        </View>
                      )}

                    </View>
                  ) : (
                    <View>
                      <Text style={[styles.standardText,styles.descriptionTextColor]}>No Videos Yet</Text>
                    </View>
                  )}


                </View>
              )}

              {(this.state.subNavSelected === 'Home' || this.state.subNavSelected === 'About') && (
                <View style={(this.props.inModal) ? [styles.card,styles.topMargin,styles.bottomMargin] : [styles.card,styles.centerHorizontally,styles.verticalMargin30,styles.fullScreenWidth]}>
                  <Text style={[styles.headingText3]}>About</Text>

                  <View style={[styles.spacer]} />

                  {(this.state.employer.description) && (
                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.row10]}>{this.state.employer.description}</Text>
                  )}

                  {(this.state.employer.employerCulture) && (
                    <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>{this.state.employer.employerCulture}</Text>
                  )}

                  {(this.state.employer.employerType) && (
                    <Text style={[styles.descriptionText1,styles.row10]}><Text style={[styles.boldText]}>Type:</Text> {this.state.employer.employerType}</Text>
                  )}

                  {(this.state.employer.employeeCount) && (
                    <Text style={[styles.descriptionText1,styles.row10]}><Text style={[styles.boldText]}>Employees:</Text> {this.state.employer.employeeCount}</Text>
                  )}

                  {(this.state.employer.employeeGrowth) && (
                    <Text style={[styles.descriptionText1,styles.row10]}><Text style={[styles.boldText]}>Growth:</Text> {this.state.employer.employeeGrowth}</Text>
                  )}

                  {(this.state.employer.employerLocation) && (
                    <Text style={[styles.descriptionText1,styles.row10]}><Text style={[styles.boldText]}>Location:</Text> {this.state.employer.employerLocation}</Text>
                  )}
                </View>
              )}

              {(this.state.subNavSelected === 'Home' || this.state.subNavSelected === 'Posts') && (
                <View style={(this.props.inModal) ? [styles.card,styles.verticalMargin10,styles.fullScreenWidth] : [styles.card,styles.centerHorizontally,styles.verticalMargin30,styles.fullScreenWidth,styles.fullScreenWidth]}>
                  <Text style={[styles.headingText3]}>Posts</Text>

                  <View style={[styles.spacer]} />

                  <Text style={[styles.standardText,styles.descriptionTextColor]}>No Posts Yet</Text>
                </View>
              )}

              {(this.state.subNavSelected === 'Home' || this.state.subNavSelected === 'Events') && (
                <View style={(this.props.inModal) ? [styles.card,styles.verticalMargin10] : [styles.card,styles.centerHorizontally,styles.verticalMargin30,styles.fullScreenWidth]}>
                  <Text style={[styles.headingText3]}>Events</Text>

                  <View style={[styles.spacer]} />

                  {(!this.state.events || this.state.events.length === 0) ? (
                    <Text style={[styles.standardText,styles.descriptionTextColor]}>No active events available to your organization</Text>
                  ) : (
                    <View>
                      {this.state.events.map((item, index) =>
                        <View key={item}>
                          <View style={[styles.spacer]} />

                          <View style={[styles.rowDirection]}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails',{ selectedOpportunity: item, selectedPosting: item, postings: this.state.work, source: 'Student' })} style={[styles.rowDirection]}>
                              <View style={[styles.width70]}>
                                {(item.matchScore) ? (
                                  <View style={[styles.padding10]}>
                                    <Progress.Circle progress={item.matchScore / 100} size={styles.width50.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                                  </View>
                                ) : (
                                  <Image source={{ uri: eventIconDark}} style={[styles.square50,styles.contain]}/>
                                )}
                                {(item.createdAt) && (
                                  <View style={[styles.topPadding,styles.horizontalPadding5]}>
                                    <Text style={[styles.descriptionText4,styles.descriptionTextColor,styles.boldText,styles.centerText]}>{convertDateToString(item.createdAt,"daysAgo")}</Text>
                                  </View>
                                )}
                              </View>
                              <View style={[styles.calcColumn210]}>
                                <Text style={[styles.headingText5]}>{item.title}</Text>
                                <Text style={[styles.descriptionText1]}>{item.employerName}</Text>

                                {(item.eventType) && (
                                  <Text style={[styles.descriptionText2]}>Event Type: {item.eventType}</Text>
                                )}

                                {(item.submissionDeadline) && (
                                  <View>
                                    <Text style={[styles.descriptionText2,styles.leftPadding]}>|</Text>
                                    <Text style={[styles.descriptionText2,styles.leftPadding]}>{convertDateToString(item.submissionDeadline,"date")}</Text>
                                  </View>
                                )}
                                {(item.startDate) && (
                                  <View>
                                    <Text style={[styles.descriptionText2,styles.leftPadding]}>|</Text>
                                    <Text style={[styles.descriptionText2,styles.leftPadding]}>{convertDateToString(item.startDate,"date")}</Text>
                                  </View>
                                )}

                                {(item.location) && (
                                  <Text style={[styles.descriptionText2]}>Location: {item.location}</Text>
                                )}

                              </View>
                            </TouchableOpacity>
                            <View style={[styles.rowDirection,styles.leftPadding]}>
                              <View style={[styles.rightPadding15]}>
                                {(this.state.applications && this.state.applications.some(app => app.postingId === item._id)) && (
                                  <View style={[styles.topMargin]}>
                                    <Image source={{ uri: appliedIconBlue}} style={[styles.square22,styles.contain]}/>
                                  </View>
                                )}
                                <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                                  <Image source={(this.state.favorites.includes(item._id)) ? { uri: favoriteIconSelected} : { uri: favoritesIconDark}} style={[styles.square20,styles.contain]}/>
                                </TouchableOpacity>
                              </View>
                              <View>
                                <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/><View style={[styles.halfSpacer]}/>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails',{ selectedOpportunity: item, selectedPosting: item, postings: this.state.work, source: 'Student' })}>
                                  <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                                </TouchableOpacity>
                              </View>

                            </View>
                          </View>

                          <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                          <View style={[styles.horizontalLine]} />

                          <View style={[styles.spacer]} />
                        </View>
                      )}

                    </View>
                  )}
                </View>
              )}

              {(this.state.subNavSelected === 'Home' || this.state.subNavSelected === 'Projects') && (
                <View style={(this.props.inModal) ? [styles.card,styles.verticalMargin10] : [styles.card,styles.centerHorizontally,styles.verticalMargin30,styles.fullScreenWidth]}>
                  <Text style={[styles.headingText3]}>Project Opportunities</Text>

                  <View style={[styles.spacer]} />

                  {(!this.state.projects || this.state.projects.length === 0) ? (
                    <Text style={[styles.standardText,styles.descriptionTextColor]}>No active project opportunities available to your organization</Text>
                  ) : (
                    <View>
                      {this.state.projects.map((item, index) =>
                        <View key={item}>
                          <View style={[styles.spacer]} />

                          <View style={[styles.rowDirection]}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails',{ selectedOpportunity: item, selectedPosting: item, postings: this.state.work, source: 'Student' })} style={[styles.rowDirection]}>
                              <View style={[styles.width70]}>
                                {(item.matchScore) ? (
                                  <View style={[styles.padding10]}>
                                    <Progress.Circle progress={item.matchScore / 100} size={styles.width50.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                                  </View>
                                ) : (
                                  <Image source={{ uri: projectsIconDark}} style={[styles.square50,styles.contain]}/>
                                )}
                                {(item.createdAt) && (
                                  <View style={[styles.topPadding,styles.horizontalPadding5]}>
                                    <Text style={[styles.descriptionText4,styles.descriptionTextColor,styles.boldText,styles.centerText]}>{convertDateToString(item.createdAt,"daysAgo")}</Text>
                                  </View>
                                )}
                              </View>
                              <View style={[styles.calcColumn210]}>
                                <Text style={[styles.headingText5]}>{item.name}</Text>
                                <Text style={[styles.descriptionText1]}>{item.employerName}</Text>

                                {(item.industry) && (
                                  <Text style={[styles.descriptionText2]}>{item.industry}</Text>
                                )}
                                {(item.submissionDeadline) && (
                                  <View>
                                    <Text style={[styles.descriptionText2,styles.leftPadding]}>|</Text>
                                    <Text style={[styles.descriptionText2,styles.leftPadding]}>{convertDateToString(item.submissionDeadline,"date")}</Text>
                                  </View>
                                )}
                                {(item.startDate) && (
                                  <View>
                                    <Text style={[styles.descriptionText2,styles.leftPadding]}>|</Text>
                                    <Text style={[styles.descriptionText2,styles.leftPadding]}>{convertDateToString(item.startDate,"date")}</Text>
                                  </View>
                                )}
                              </View>
                            </TouchableOpacity>
                            <View style={[styles.rowDirection,styles.leftPadding]}>
                              <View style={[styles.rightPadding15]}>
                                {(this.state.applications && this.state.applications.some(app => app.postingId === item._id)) && (
                                  <View style={[styles.topMargin]}>
                                    <Image source={{ uri: appliedIconBlue}} style={[styles.square22,styles.contain]}/>
                                  </View>
                                )}
                                <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                                  <Image source={(this.state.favorites.includes(item._id)) ? { uri: favoriteIconSelected} : { uri: favoritesIconDark}} style={[styles.square20,styles.contain]}/>
                                </TouchableOpacity>
                              </View>
                              <View>
                                <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/><View style={[styles.halfSpacer]}/>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails',{ selectedOpportunity: item, selectedPosting: item, postings: this.state.work, source: 'Student' })}>
                                  <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                                </TouchableOpacity>
                              </View>
                            </View>
                          </View>

                          <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                          <View style={[styles.horizontalLine]} />

                          <View style={[styles.spacer]} />
                        </View>
                      )}

                    </View>
                  )}
                </View>
              )}

              {(this.state.subNavSelected === 'Home' || this.state.subNavSelected === 'Work') && (
                <View style={(this.props.inModal) ? [styles.card,styles.verticalMargin10] : [styles.card,styles.centerHorizontally,styles.verticalMargin30,styles.fullScreenWidth]}>
                  <Text style={[styles.headingText3]}>Work Opportunities</Text>

                  <View style={[styles.spacer]} />

                  {(!this.state.work || this.state.work.length === 0) ? (
                    <Text style={[styles.standardText,styles.descriptionTextColor]}>No active work opportunities available to your organization</Text>
                  ) : (
                    <View>
                      {this.state.work.map((item, index) =>
                        <View key={item}>

                          <View style={[styles.spacer]} />
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails',{ selectedOpportunity: item, selectedPosting: item, postings: this.state.work, source: 'Student' })}>
                            <View style={[styles.width70]}>
                              {(item.matchScore) ? (
                                <View style={[styles.padding10]}>
                                  <Progress.Circle progress={item.matchScore / 100} size={styles.width50.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                                </View>
                              ) : (
                                <Image source={{ uri: opportunitiesIconDark}} style={[styles.square50,styles.contain]}/>
                              )}
                              {(item.createdAt) && (
                                <View style={[styles.topPadding,styles.horizontalPadding5]}>
                                  <Text style={[styles.descriptionText4,styles.descriptionTextColor,styles.boldText,styles.centerText]}>{convertDateToString(item.createdAt,"daysAgo")}</Text>
                                </View>
                              )}
                            </View>
                            <View className="calc-column-offset-150">
                              <Text style={[styles.headingText5]}>{item.title}</Text>
                              <Text style={[styles.descriptionText1]}>{item.employerName}</Text>

                              {(item.field) && (
                                <Text style={[styles.descriptionText2]}>{item.field.split("|")[0].trim()}</Text>
                              )}
                              {(item.submissionDeadline) && (
                                <View>
                                  <Text style={[styles.descriptionText2,styles.leftPadding]}>|</Text>
                                  <Text style={[styles.descriptionText2,styles.leftPadding]}>{convertDateToString(item.submissionDeadline,"date")}</Text>
                                </View>
                              )}
                              {(item.startDate) && (
                                <View>
                                  <Text style={[styles.descriptionText2,styles.leftPadding]}>|</Text>
                                  <Text style={[styles.descriptionText2,styles.leftPadding]}>{convertDateToString(item.startDate,"date")}</Text>
                                </View>
                              )}

                              {(item.payRange && (item.subPostType === 'Full-Time' || item.subPostType === 'Part-Time')) && (
                                <Text style={[styles.descriptionText3,styles.ctaColor,styles.boldText,styles.topPadding5]}>{item.payRange}</Text>
                              )}

                            </View>
                          </TouchableOpacity>
                          <View className="float-left left-padding">
                            <View className="float-right">
                              <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/><View style={[styles.halfSpacer]}/>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails',{ selectedOpportunity: item, selectedPosting: item, postings: this.state.work, source: 'Student' })}>
                                <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                              </TouchableOpacity>
                            </View>
                            <View className="float-right right-padding-15">
                              {(this.state.applications && this.state.applications.some(app => app.postingId === item._id)) && (
                                <View style={[styles.topMargin]}>
                                  <Image source={{ uri: appliedIconBlue}} style={[styles.square22,styles.contain]}/>
                                </View>
                              )}
                              <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                                <Image source={(this.state.favorites.includes(item._id)) ? { uri: favoriteIconSelected} : { uri: favoritesIconDark}} style={[styles.square20,styles.contain]} />
                              </TouchableOpacity>
                            </View>
                          </View>


                          <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                          <View style={[styles.horizontalLine]} />

                          <View style={[styles.spacer]} />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}

              {(this.state.subNavSelected === 'Home' || this.state.subNavSelected === 'Benchmarks') && (
                <View style={(this.props.inModal) ? [styles.card,styles.verticalMargin10] : [styles.card,styles.centerHorizontally,styles.verticalMargin30]}>
                  <Text style={[styles.headingText3]}>Benchmarks</Text>

                  <View style={[styles.spacer]} />

                  {(!this.state.benchmarks || this.state.benchmarks.length === 0) ? (
                    <Text style={[styles.standardText,styles.descriptionTextColor]}>No benchmarks available to your organization</Text>
                  ) : (
                    <View>
                      {this.state.benchmarks.map((item, index) =>
                        <View key={item}>
                          <View style={[styles.spacer]} />
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('BenchmarkDetails',{ selectedBenchmark: item })}>
                            <View style={[styles.width70]}>
                              <Image source={{ uri: benchmarksIconDark}} style={[styles.square50,styles.contain]}/>
                              {(item.createdAt) && (
                                <View style={[styles.topPadding,styles.horizontalPadding5]}>
                                  <Text style={[styles.descriptionText4,styles.descriptionTextColor,styles.boldText,styles.centerText]}>{convertDateToString(item.createdAt,"daysAgo")}</Text>
                                </View>
                              )}
                            </View>
                            <View className="calc-column-offset-150">
                              <Text style={[styles.headingText5]}>{item.title}</Text>
                              <Text style={[styles.descriptionText1]}>{item.jobFunction} | {item.jobType}</Text>

                              {(item.maxPay) && (
                                <Text style={[styles.descriptionText3,styles.ctaColor,styles.boldText,styles.topPadding5]}>{item.maxPay}</Text>
                              )}

                            </View>
                          </TouchableOpacity>
                          <View className="float-left left-padding">
                            <View className="float-right">
                              <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/><View style={[styles.halfSpacer]}/>
                              <TouchableOpacity onPress={() => this.props.navigation.navigate('BenchmarkDetails',{ selectedBenchmark: item })}>
                                <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                              </TouchableOpacity>
                            </View>
                            <View className="float-right right-padding-15">
                              <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                                <Image source={(this.state.favorites.includes(item._id)) ? { uri: favoriteIconSelected} : { uri: favoritesIconDark}} style={[styles.square20,styles.contain]} />
                              </TouchableOpacity>
                            </View>
                          </View>


                          <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                          <View style={[styles.horizontalLine]} />

                          <View style={[styles.spacer]} />
                        </View>
                      )}
                    </View>
                  )}
                </View>
              )}

            </View>
          )}
        </ScrollView>
    )
  }

}

export default EmployerDetails;
