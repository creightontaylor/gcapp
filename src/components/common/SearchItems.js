import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch, Image, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png'
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png'
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png'
const eventIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/event-icon-dark.png'
const assignmentsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/assignments-icon-dark.png'
const problemIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/problem-icon-dark.png'
const challengeIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/challenge-icon-dark.png'
const socialIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-dark.png'
const industryIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/industry-icon-dark.png'
const careerMatchesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/career-matches-icon-dark.png'
const projectsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/projects-icon-dark.png'
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png'

class SearchItems extends Component {
    constructor(props) {
        super(props)

        this.state = {
          subNavCategories: ['All','Work','Projects','Events','Career Paths','Groups','Courses','People','Mentors','Employers','Projects'],
        }

        this.retrieveData = this.retrieveData.bind(this)
        this.formChangeHandler = this.formChangeHandler.bind(this)
        this.searchItems = this.searchItems.bind(this)
        this.navigateAway = this.navigateAway.bind(this)

    }

    componentDidMount() {

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in commonEditGroup', this.props.activeOrg, prevProps)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
        console.log('t0 will update')
        this.retrieveData()
      } else if (this.props.selectedGroup !== prevProps.selectedGroup) {
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
        const orgFocus = await AsyncStorage.getItem('orgFocus');
        const roleName = await AsyncStorage.getItem('roleName');
        let pictureURL = await AsyncStorage.getItem('pictureURL');

        this.setState({ emailId, cuFirstName, cuLastName, activeOrg, orgFocus, roleName, username, pictureURL})

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    formChangeHandler(eventName,eventValue) {
      console.log('formChangeHandler called')

      this.setState({ [eventName]: eventValue, isSearching: true })
      this.searchItems(eventName,eventValue)

    }

    searchItems(eventName,searchString) {
      console.log('searchItems called')

      const self = this
      function officiallyFilter() {
        console.log('officiallyFilter called')

        self.setState({ searchResults: null })

        const searchString = self.state.searchString
        const orgCode = self.state.activeOrg
        const emailId = self.state.emailId
        const roleNames = ['Student','Career-Seeker']

        Axios.get('https://www.guidedcompass.com/api/home/search', { params: { searchString, orgCode, emailId, roleNames } })
        .then((response) => {
            console.log('Home search worked');

            if (response.data.success) {

              let searchResults = []
              if (response.data.members) {
                for (let i = 1; i <= response.data.members.length; i++) {
                  let imageURL = profileIconDark
                  if (response.data.members[i - 1].pictureURL) {
                    imageURL = response.data.members[i - 1].pictureURL
                  }
                  searchResults.push({
                    category: response.data.members[i -1 ].roleName,
                    name: response.data.members[i - 1].firstName + ' ' + response.data.members[i - 1].lastName,
                    email: response.data.members[i - 1].email,
                    imageURL,
                    url: 'Profile', passedState: { username: response.data.members[i - 1].username }
                  })
                }
              }
              if (response.data.projects) {
                for (let i = 1; i <= response.data.projects.length; i++) {
                  let imageURL = projectsIconDark
                  if (response.data.projects[i - 1].imageURL) {
                    imageURL = response.data.projects[i - 1].imageURL
                  }
                  searchResults.push({
                    category: 'Project',
                    name: response.data.projects[i - 1].name,
                    imageURL,
                    url: 'ProjectDetails', passedState: { selectedProject: response.data.projects[i - 1]}
                  })
                }
              }
              if (response.data.careers) {
                for (let i = 1; i <= response.data.careers.length; i++) {
                  let imageURL = careerMatchesIconDark
                  searchResults.push({
                    category: 'Career Path',
                    name: response.data.careers[i - 1].name, imageURL,
                    url: 'CareerDetails', passedState: { careerSelected: response.data.careers[i - 1].name }
                  })
                }
              }
              if (response.data.employers) {
                for (let i = 1; i <= response.data.employers.length; i++) {
                  let imageURL = industryIconDark
                  if (response.data.employers[i - 1].employerLogoURI) {
                    imageURL = response.data.employers[i - 1].employerLogoURI
                  }
                  searchResults.push({
                    category: 'Employer',
                    name: response.data.employers[i - 1].employerName,
                    imageURL,
                    url: 'EmployerDetails', passedState: { selectedEmployer: response.data.employers[i - 1]}
                  })
                }
              }
              if (response.data.groups) {
                for (let i = 1; i <= response.data.groups.length; i++) {
                  let imageURL = socialIconDark
                  if (response.data.groups[i - 1].pictureURL) {
                    imageURL = response.data.groups[i - 1].pictureURL
                  }
                  searchResults.push({
                    category: 'Group',
                    name: response.data.groups[i - 1].name,
                    imageURL,
                    url: 'GroupDetails', passedState: { selectedGroup: response.data.groups[i - 1]}
                  })
                }
              }
              if (response.data.postings) {
                for (let i = 1; i <= response.data.postings.length; i++) {
                  let name = response.data.postings[i - 1].title
                  let imageURL = opportunitiesIconDark
                  if (response.data.postings[i - 1].employerLogoURL) {
                    imageURL = response.data.postings[i - 1].employerLogoURL
                  } else if (response.data.postings[i - 1].postType === 'Event') {
                    imageURL = eventIconDark
                  } else if (response.data.postings[i - 1].postType === 'Assignment') {
                    imageURL = assignmentsIconDark
                  } else if (response.data.postings[i - 1].postType === 'Problem') {
                    imageURL = problemIconDark
                  } else if (response.data.postings[i - 1].postType === 'Challenge') {
                    imageURL = challengeIconDark
                  } else if (response.data.postings[i - 1].postType === 'Internship' || response.data.postings[i - 1].postType === 'Work') {
                    imageURL = opportunitiesIconDark
                  }
                  if (response.data.postings[i - 1].postType === 'Assignment' || response.data.postings[i - 1].postType === 'Problem' || response.data.postings[i - 1].postType === 'Challenge') {
                    name = response.data.postings[i - 1].name
                  }
                  searchResults.push({
                    category: response.data.postings[i - 1].postType,
                    name, imageURL,
                    url: 'OpportunityDetails', passedState: { selectedOpportunity: response.data.postings[i - 1] }
                  })
                }
              }

              self.setState({ searchResults, showSearchResults: true, isSearching: false })

            } else {
              console.log('there was an error:', response.data.message);
              self.setState({ isSearching: false, errorMessage: response.data.message })
            }
        });
      }

      const delayFilter = () => {
        console.log('delayFilter called: ')
        clearTimeout(self.state.timerId)
        self.state.timerId = setTimeout(officiallyFilter, 1000)
      }

      delayFilter();
    }

    navigateAway(url,passedState) {
      console.log('navigateAway called')

      this.props.closeModal()
      this.props.navigation.navigate(url,passedState)
    }

    render() {

      return (
          <ScrollView>
            {(this.props.modalIsOpen) && (
              <View>
                <View style={[styles.row10,styles.rowDirection,styles.topMargin20]}>
                  <View style={[styles.calcColumn140,styles.lightBackground,styles.height40,styles.rowDirection, styles.roundedCorners]}>
                    <View style={[styles.row7,styles.horizontalPadding3,styles.topMargin5,styles.leftMargin]}>
                      <Image source={{uri: searchIcon}} style={[styles.square17,styles.contain,styles.padding5]}/>
                    </View>
                    <View>
                      <TextInput
                        style={[styles.lightBackground,styles.height40,styles.leftPadding,styles.roundedCorners,styles.descriptionText2]}
                        onChangeText={(text) => this.formChangeHandler('searchString',text)}
                        value={this.state.searchString}
                        placeholder="Search..."
                        placeholderTextColor="grey"
                      />
                    </View>
                  </View>
                  <View style={[styles.width60,styles.topMargin]}>
                    <TouchableOpacity onPress={() => this.props.closeModal()}>
                      <Text style={[styles.descriptionText3,styles.ctaColor,styles.boldText,styles.rightText]}>Cancel</Text>
                    </TouchableOpacity>
                  </View>
                </View>
                <View style={[styles.lightHorizontalLine]} />
                <View style={[styles.spacer]} />
              </View>
            )}
            {/*
            <ScrollView horizontal={true} style={[styles.lightHorizontalLine]}>
              {this.state.subNavCategories.map((value, index) =>
                <View style={[styles.topPadding5,styles.bottomPadding,styles.rightPadding20]}>
                  {(this.state.subNavCategories[index] === this.state.subNavSelected) ? (
                    <View key={value} style={[styles.selectedCarouselItem,styles.height40,styles.flexCenter,styles.horizontalPadding10]}>
                      <Text>{value}</Text>
                    </View>
                  ) : (
                    <TouchableOpacity key={value} style={[styles.menuButton,styles.height40,styles.flexCenter,styles.horizontalPadding10]} onPress={() => this.subNavClicked(value)}>
                      <Text>{value}</Text>
                    </TouchableOpacity>
                  )}
                </View>
              )}
            </ScrollView>*/}
            {(this.state.isSearching) ? (
              <View style={[styles.flexCenter,styles.calcColumn60]}>
                <View>
                  <View style={[styles.superSpacer]} />

                  <ActivityIndicator
                     animating = {this.state.isSearching}
                     color = '#87CEFA'
                     size = "large"
                     style={[styles.square80, styles.centerHorizontally]}/>

                  <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                  <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Searching...</Text>

                </View>
              </View>
            ) : (
              <View>
                {(this.state.showSearchResults && this.state.searchString !== '') && (
                  <ScrollView>
                    {this.state.searchResults.map((item, index) =>
                      <View key={index} style={[styles.row7]}>
                        <View>
                          <TouchableOpacity onPress={() => this.navigateAway(item.url,item.passedState)} style={[styles.rowDirection]}>
                            <View style={[styles.width45,styles.topMargin]}>
                              <Image source={(item.imageURL) ? { uri: item.imageURL} : { uri: careerMatchesIconDark}} style={[styles.square35,styles.contain]} />
                            </View>
                            <View style={[styles.calcColumn110,styles.topPadding5]}>
                              <Text style={[styles.descriptionText1,styles.ctaColor,styles.boldText]}>{item.name}</Text><Text style={[styles.descriptionText2,styles.descriptionTextColor]}>({item.category})</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </ScrollView>
                )}

                {(this.state.errorMessage && this.state.errorMessage !== '') ? <Text style={[styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text> : <View />}
              </View>
            )}

            <View>

            </View>
          </ScrollView>
      )
    }
}

export default SearchItems
