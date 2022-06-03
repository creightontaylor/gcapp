import React, {Component} from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, Linking } from 'react-native';
import Axios from 'axios';
import Modal from 'react-native-modal';
import SubGoalDetails from '../common/GoalDetails';

const styles = require('../css/style');

const targetIconOrange = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/target-icon-orange.png';

import {convertDateToString} from '../functions/convertDateToString';

class RenderGoals extends Component {
    constructor(props) {
        super(props)

        this.state = {
          favorites: []
        }

        this.segueToProfile = this.segueToProfile.bind(this)
        this.renderTags = this.renderTags.bind(this)
        this.itemClicked = this.itemClicked.bind(this)
        this.closeModal = this.closeModal.bind(this)
        this.favoriteItem = this.favoriteItem.bind(this)

    }

    componentDidMount() {
      //see if user is logged in

      this.retrieveData()

    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in renderPosts')

      if (this.props.activeOrg !== prevProps.activeOrg) {
        this.retrieveData()
      } else if (this.props.profileData !== prevProps.profileData || this.props.favorites !== prevProps.favorites) {
        this.retrieveData()
      } else if (this.props.sortCriteriaArray !== prevProps.sortCriteriaArray || this.props.filterCriteriaArray !== prevProps.filterCriteriaArray) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in renderPosts')

        let emailId = await AsyncStorage.getItem('email');
        // const username = await AsyncStorage.getItem('username');
        // const cuFirstName = await AsyncStorage.getItem('firstName');
        // const cuLastName = await AsyncStorage.getItem('lastName');
        // let activeOrg = await AsyncStorage.getItem('activeOrg');
        // if (!activeOrg) {
        //   activeOrg = 'guidedcompass'
        // }
        // const orgFocus = await AsyncStorage.getItem('orgFocus');
        // const roleName = await AsyncStorage.getItem('roleName');
        // let pictureURL = await AsyncStorage.getItem('pictureURL');

        const activeOrg = this.props.activeOrg
        const favorites = this.props.favorites
        const orgName = this.props.orgName
        const orgContactEmail = this.props.orgContactEmail

        this.setState({ activeOrg, favorites, emailId, orgName, orgContactEmail })

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    segueToProfile(e, goal) {
      console.log('segueToProfile called')

      e.stopPropagation()
      e.preventDefault()

      this.props.navigation.navigate('Profile', { username: goal.creatorUsername })

    }

    renderTags(passedArray, type) {
      // console.log('renderTags  called', passedArray, type, editMode)

      if (passedArray && passedArray.length > 0) {
        let backgroundColorClass = []
        if (type === 'careers' || type === 'functions' || type === 'industries') {
          backgroundColorClass = styles.primaryBackgroundLight
        } else if (type === 'opportunities') {
          backgroundColorClass = styles.secondaryBackgroundLight
        } else if (type === 'competencies') {
          backgroundColorClass = styles.tertiaryBackgroundLight
        } else if (type === 'hours') {
          backgroundColorClass = styles.quaternaryBackgroundLight
        } else if (type === 'payRanges') {
          backgroundColorClass = styles.quinaryBackgroundLight
        } else if (type === 'schools') {
          backgroundColorClass = styles.secondaryBackgroundLight
        } else if (type === 'majors') {
          backgroundColorClass = styles.septaryBackgroundLight
        }

        return (
          <View key={type + "|0"}>
            <View style={[styles.topMargin,styles.flexDirection,styles.flexWrap]}>
              {passedArray.map((value, optionIndex) =>
                <View key={type + "|" + optionIndex}>
                  {(optionIndex < 3) && (
                    <View>
                      <View style={[styles.rightPadding5]}>
                        <View style={[styles.halfSpacer]} />
                        <View style={[styles.roundedCorners,styles.row7,styles.horizontalPadding20, backgroundColorClass]}>
                          {(typeof value === 'object') ? (
                            <View>
                              {(value.title) ? (
                                <Text style={[styles.descriptionText2]}>{value.title}</Text>
                              ) : (
                                <View />
                              )}
                              {(value.name) ? (
                                <Text style={[styles.descriptionText2]}>{value.name}</Text>
                              ) : (
                                <View />
                              )}
                            </View>
                          ) : (
                            <Text style={[styles.descriptionText2]}>{value}</Text>
                          )}
                        </View>
                        <View style={[styles.halfSpacer]} />
                      </View>
                    </View>
                  )}
                </View>
              )}
            </View>
          </View>
        )
      }
    }

    itemClicked(e, type, value) {
      console.log('itemClicked called', e, type, value)

      e.preventDefault()
      e.stopPropagation()

      this.setState({ modalIsOpen: true, showHelpOutWidget: true, selectedGoal: value })
    }

    closeModal() {

      this.setState({ modalIsOpen: false, showGoalDetails: false, showHelpOutWidget: false,
        selectedGoal: null
      });

    }

    favoriteItem(e, item) {
      console.log('favoriteItem called', e, item)

      e.stopPropagation()

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

      console.log('favorites here', favoritesArray, this.state.emailId)
      this.setState({ favorites: favoritesArray })

      Axios.post('/api/favorites/save', {
        favoritesArray, emailId: this.state.emailId
      })
      .then((response) => {
        console.log('attempting to save favorites')
        if (response.data.success) {
          console.log('saved successfully', response.data)
          //clear values
          this.setState({ successMessage: 'Favorite saved!', isSaving: false })
        } else {
          console.log('did not save successfully', response.data.message)
          this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false })
      });
    }

    render() {

      return (
        <View>
          {(this.props.filteredGoals && this.props.filteredGoals.length > 0) ? (
            <View>
              {this.props.filteredGoals.map((value, index) =>
                <View key={index} style={[styles.rowDirection,styles.flex1]}>
                  <View style={[styles.flex33,styles.bottomMargin20]}>
                    <View style={[styles.zIndex1]}>
                      <Image source={{ uri: targetIconOrange }} style={[styles.square50,styles.centerHorizontally,styles.bottomMarginNegative35,styles.relativePosition,styles.zIndex1,styles.padding10,styles.errorBorder,styles.whiteBackground, { borderRadius: 25 }]} />
                    </View>

                    <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showGoalDetails: true, selectedGoal: value })}>
                      <View style={[styles.elevatedBox,styles.whiteBackground]} >

                        <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />

                        <View style={[styles.horizontalPadding30]}>
                          <Text style={[styles.headingText5,styles.centerText]}>{value.title}</Text>

                          {(value.goalType) ?(
                            <View style={[styles.topPadding20]}>
                              <Text style={[styles.descriptionText3,styles.centerText]}>[{value.goalType.description}]</Text>
                            </View>
                          ) : (
                            <View />
                          )}

                          <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                          <View style={[styles.horizontalLine]} />

                          <View style={[styles.topPadding20]}>
                            <Text style={[styles.descriptionText3,styles.centerText]}>by <TouchableOpacity target="_blank" style={[styles.ctaColor]} onPress={(e) => this.segueToProfile(e,value)}><Text style={[styles.descriptionText3]}>{value.creatorFirstName} {value.creatorLastName}</Text></TouchableOpacity></Text>
                          </View>

                          <View style={[styles.topPadding20]}>
                            {(value.startDate) ? (
                              <Text style={[styles.descriptionText3,styles.centerText]}>{convertDateToString(new Date(value.startDate),"date-2")} - {convertDateToString(new Date(value.deadline),"date-2")}</Text>
                            ) : (
                              <Text style={[styles.descriptionText3,styles.centerText]}>Deadline: {convertDateToString(new Date(value.deadline),"date-2")}</Text>
                            )}
                          </View>

                          <View style={[styles.topPadding]}>

                            <View style={[styles.rowDirection,styles.flexWrap]}>
                              {this.renderTags(value.selectedCareers, 'careers')}
                              {this.renderTags(value.selectedOpportunities, 'opportunities')}
                              {this.renderTags(value.competencies, 'competencies')}
                              {this.renderTags(value.selectedFunctions, 'functions')}
                              {this.renderTags(value.selectedIndustries, 'industries')}
                              {this.renderTags(value.selectedHours, 'hours')}
                              {this.renderTags(value.selectedPayRanges, 'payRanges')}
                              {this.renderTags(value.selectedSchools, 'schools')}
                              {this.renderTags(value.selectedMajors, 'majors')}
                            </View>

                            {(value.description) ? (
                              <Text style={[styles.descriptionText3,styles.descriptionTextColor,styles.topMargin,styles.centerText]}>{value.description}</Text>
                            ) : (
                              <View />
                            )}

                            {(value.goalType && value.goalType.name === 'Alternatives') && (
                              <View>
                                {(value.pollQuestion) && (
                                  <Text style={[styles.headingText5,styles.topMargin20]}>{value.pollQuestion}</Text>
                                )}
                                <View style={[styles.topMargin20,styles.rowDirection]}>
                                  <View style={[styles.flex40]}>
                                    <Text>{value.aName}</Text>
                                  </View>
                                  <View style={[styles.flex20]}>
                                    <Text style={[styles.centerText,styles.headingText4]}>VS</Text>
                                  </View>
                                  <View style={[styles.flex40]}>
                                    <Text style={[styles.rightText]}>{value.bName}</Text>
                                  </View>
                                </View>
                              </View>
                            )}
                          </View>

                          <View style={[styles.topPadding20]}>
                            {(this.props.fromCommunity) ? (
                              <TouchableOpacity style={(this.state.favorites.includes(value._id)) ? [styles.btnSquarish,styles.mediumBackground,styles.flexCenter] : [styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={(e) =>  this.favoriteItem(e,value,'helpOut')}><Text style={[styles.descriptionText1,styles.whiteColor]}>{(this.state.favorites.includes(value._id)) ? "Following" : "Follow"}</Text></TouchableOpacity>
                            ) : (
                              <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} disabled={(this.state.isSaving) ? true : false} onPress={(e) =>  this.itemClicked(e,'helpOut', value)}><Text style={[styles.descriptionText1,styles.whiteColor]}>Help Out</Text></TouchableOpacity>
                            )}
                          </View>

                          {(this.props.sortCriteriaArray && this.props.sortCriteriaArray[index] && this.props.sortCriteriaArray[index].name) ? (
                            <View style={[styles.topPadding]}>
                              <View style={[styles.halfSpacer]} />
                              <Text style={[styles.errorColor,styles.descriptionText2]}>{this.props.sortCriteriaArray[index].name}: {this.props.sortCriteriaArray[index].criteria}</Text>
                            </View>
                          ) : (
                            <View />
                          )}
                          {(this.props.filterCriteriaArray && this.props.filterCriteriaArray[index] && this.props.filterCriteriaArray[index].name) ? (
                            <View style={[styles.topPadding]}>
                              <View style={[styles.halfSpacer]} />
                              <Text style={[styles.errorColor,styles.descriptionText2]}>{this.props.filterCriteriaArray[index].name}: {this.props.filterCriteriaArray[index].criteria}</Text>
                            </View>
                          ) : (
                            <View />
                          )}

                          <View style={[styles.spacer]} />
                        </View>
                      </View>
                    </TouchableOpacity>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View>
              <Text style={[styles.errorColor]}>Either goals are set to private or no goals have been added yet</Text>
            </View>
          )}

          {(this.state.showGoalDetails || this.state.showHelpOutWidget) && (
            <View>
              <SubGoalDetails navigation={this.props.navigation} selectedGoal={this.state.selectedGoal} modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} showGoalDetails={this.state.showGoalDetails} showHelpOutWidget={this.state.showHelpOutWidget} profileData={this.props.profileData}
                orgCode={this.state.activeOrg} orgName={this.state.orgName} orgContactEmail={this.state.orgContactEmail}
              />
           </View>
          )}
        </View>
      )
    }
}

export default RenderGoals;
