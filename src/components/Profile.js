import React, { Component } from 'react';
import { Text, View, Image, TextInput, TouchableOpacity, StyleSheet, ScrollView , Picker, AsyncStorage, Platform, Switch } from 'react-native';
import { Card, CardSection, Button } from './common';
//var ImagePicker = require('react-native-image-picker');
import Axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
//import PushNotification from 'react-native-push-notification';
import { Dropdown } from 'react-native-material-dropdown';
//import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
Icon.loadFont()

class Profile extends Component {
  constructor(props) {
    super(props)
    this.state = {
        profilePicImage: null,
        profilePicPath: null,
        firstNameValue: '',
        lastNameValue: '',
        linkedInURL: '',
        resumeURL: '',
        customWebsiteURL: '',

        phoneNumber: '',
        race: '',
        gender: '',
        veteran: '',
        workAuthorization: '',
        school: '',
        degree: '',
        major: '',
        gradYear: '',

        hasPreviousSchool: false,
        school2: '',
        degree2: '',
        major2: '',
        gradYear2: '',

        projects: [],
        experience: [],
        collaborators: [],

        isEditingBasicInfo: false,
        isEditingDegree: false,
        isEditingIdentification: false,
        isEditingProjectsArray: [],
        isEditingExperienceArray: [],

        dateOptions: [],
        functionOptions: [],
        industryOptions: [],
        payOptions: [],
        hoursPerWeekOptions: [],
        projectCategoryOptions: [],
        binaryOptions: [{value: ''}, {value: 'Yes'},{value: 'No'}],

        profilePicHasChanged: false,
        textFormHasChanged: false,
        isWaiting: false,

        projectHasChanged: false,
        projectHasChangedArray: [],
        experienceHasChanged: false,
        experienceHasChangedArray: [],

        serverSuccessText: false,
        serverErrorMessageText: '',
        serverSuccessMessageText: '',
        serverSuccessProfilePic: false,
        serverErrorMessageProfilePic: '',
        serverSuccessMessageProfilePic: '',
        serverSuccessCoverPic: false,
        serverErrorMessageCoverPic: '',
        serverSuccessMessageCoverPic: '',
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.pickImageHandler = this.pickImageHandler.bind(this)
    this.closeEdit = this.closeEdit.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.addItem = this.addItem.bind(this)
    this.saveProfile = this.saveProfile.bind(this)
    this.renderProjects = this.renderProjects.bind(this)
    this.renderExperience = this.renderExperience.bind(this)

  }

  static navigationOptions = ({ navigation }) => {

    return {
      headerTitle: 'Profile',
      headerLeft: (
        <TouchableOpacity onPress={() => {navigation.navigate('Notifications')} } >
          <View style={{ marginLeft: 20, marginRight: 20 }}>
            { (navigation.state.params) ? (
              <View>
                { (navigation.state.params.badgeNumber === 0) ? (
                  <View style={{ position:'relative', padding:5, alignItems: 'center', justifyContent: 'center'}}>
                    <Icon name={'ios-notifications-outline'} size={26} color="#fff" />
                  </View>
                ) : (
                  <View style={{ position:'relative', padding:5, alignItems: 'center', justifyContent: 'center'}}>
                    <View style={{ alignItems: 'center', justifyContent: 'center', position:'absolute', zIndex:10,
                        top:1, right:1, padding:1, backgroundColor:'#E67650', width: 16, height: 16,
                        borderRadius:8, borderWidth: 1, borderColor: 'transparent', overflow: 'hidden'}}>
                      <Text style={{ color:'#fff', fontSize: 11}}>{navigation.state.params.badgeNumber}</Text>
                    </View>
                    <Icon name={'ios-notifications-outline'} size={26} color="#fff" />
                  </View>
                )}
              </View>
            ) : (
              <View style={{ position:'relative', padding:5, alignItems: 'center', justifyContent: 'center'}}>
                <Icon name={'ios-notifications-outline'} size={26} color="#fff" />
              </View>
            )}
          </View>
        </TouchableOpacity>
      ),
      headerRight: (
        <TouchableOpacity onPress={() => {navigation.navigate('Settings')} } >
          <View style={{ marginLeft: 20, marginRight: 20 }}>
            <Icon name={'ios-settings'} size={26} color="#fff"/>
          </View>
        </TouchableOpacity>
      )
    }
  }
  /*
  // More info on all the options is below in the README...just some common use cases shown here
  let options = {
    title: 'Select Avatar',
    customButtons: [
      {name: 'fb', title: 'Choose Photo from Facebook'},
    ],
    storageOptions: {
      skipBackup: true,
      path: 'images'
    }
  };

  ImagePicker.showImagePicker(options, (response) => {
    console.log('Response = ', response);

    if (response.didCancel) {
      console.log('User cancelled image picker');
    }
    else if (response.error) {
      console.log('ImagePicker Error: ', response.error);
    }
    else if (response.customButton) {
      console.log('User tapped custom button: ', response.customButton);
    }
    else {
      let source = { uri: response.uri };

      // You can also display the image using data:
      // let source = { uri: 'data:image/jpeg;base64,' + response.data };

      this.setState({
        avatarSource: source
      });
    }
  });*/

  componentDidMount() {
    console.log('profile did mount')
    /*
    let tracker = new GoogleAnalyticsTracker("UA-67259774-5");
    if (Platform.OS === 'ios') {
      tracker.trackScreenView("Profile - ios");
    } else {
      tracker.trackScreenView("Profile - android");
    }*/

    this.retrieveData()
  }

  pickImageHandler = () => {
    /*
    ImagePicker.showImagePicker({title: "Pick an Image", maxWidth: 300, maxHeight: 300, takePhotoButtonTitle: null}, res => {
      if (res.didCancel) {
        console.log("User cancelled!");
      } else if (res.error) {
        console.log("Error", res.error);
      } else {
        console.log('give me response:', res)
        this.setState({
          profilePicImage: { uri: res.uri },
          profilePicHasChanged: true
        });
      }
    });*/
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')
      //assuming we start with home, so there should always be a value

      /* turning off notifications temporarily because notifications aren't updating
      const unreadNotificationsCount = await AsyncStorage.getItem('unreadNotificationsCount')
      PushNotification.setApplicationIconBadgeNumber(Number(unreadNotificationsCount))
      this.props.navigation.setParams({ badgeNumber: Number(unreadNotificationsCount) });
      */

      //const email = 'harry@potter.com'
      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email);
        /*
        const projects = [
          { name: 'Fake Project Name', startDate: '05/15/19', endDate: '05/19/19', hours: 5000, collaboratorCount: 3, description: 'fake description...', url: 'www.fakeurl.com', skillTags: 'fake tag 1, fake tag 2', industryTags: 'fake tag 3, fake tag 4'},
          { name: 'Fake Project Name 2', startDate: '06/15/19', endDate: '06/19/19', hours: 1000}
        ]
        const isEditingProjectsArray = [false, false]
        const projectHasChangedArray = [false, false]
        //array matches length of projects

        const experience = [{ jobTitle: 'Software Developer', employerName: 'Google, Inc.', startDate: '06/15/19', endDate: '06/19/19', function: 'Software Engineering', industry: 'Internet', pay: '100000', hoursPerWeek: '40 hours / week', skillTags: 'java, empathy', workInterest: 2, workSkill: 3, teamInterest: 3, employerInterest: 4, payInterest: 3, overallFit: 4.2 }]
        const isEditingExperienceArray = [false]
        const experienceHasChangedArray = [false]
        //array matches length of experience.

        const functionOptions = []
        const industryOptions = []
        const payOptions = []
        const hoursPerWeekOptions = []
        */

        const collaboratorOptions = [{value: '1'},{value: '2'}, {value: '3'}, {value: '4'}, {value: '5'}]
        const hourOptions = [{value: '< 10'},{value: '10 - 50'}, {value: '50 - 100'}, {value: '100 - 500'}, {value: '500 - 1000'}, {value: '1000 - 5000'}, {value: '5000 - 10000'}, {value: '10000+'}]

        let dateOptions = []

        const currentMonth = new Date().getMonth()
        const currentYear = new Date().getFullYear()

        let month = ''
        let year = currentYear - 10

        console.log('show me current stuff', currentMonth, currentYear)
        for (let i = 1; i <= 120 + currentMonth; i++) {
          console.log('show me stuff', i)
          if (i % 12 === 0) {
            month = 'January'
          } else if (i % 12 === 1) {
            month = 'February'
          } else if (i % 12 === 2) {
            month = 'March'
          } else if (i % 12 === 3) {
            month = 'April'
          } else if (i % 12 === 4) {
            month = 'May'
          } else if (i % 12 === 5) {
            month = 'June'
          } else if (i % 12 === 6) {
            month = 'July'
          } else if (i % 12 === 7) {
            month = 'August'
          } else if (i % 12 === 8) {
            month = 'September'
          } else if (i % 12 === 9) {
            month = 'October'
          } else if (i % 12 === 10) {
            month = 'November'
          } else if (i % 12 === 11) {
            month = 'December'
          }

          if (i > 12 && i <= 24) {
            if (i % 12 === 0) {
              year = currentYear - 10 + 1 + 1
            } else {
              year = currentYear - 10 + 1
            }
          } else if (i > 24 && i <= 36) {
            if (i % 12 === 0) {
              year = currentYear - 10 + 2 + 1
            } else {
              year = currentYear - 10 + 2
            }
          } else if (i > 36 && i <= 48) {
            if (i % 12 === 0) {
              year = currentYear - 10 + 3 + 1
            } else {
              year = currentYear - 10 + 3
            }
          } else if (i > 48 && i <= 60) {
            if (i % 12 === 0) {
              year = currentYear - 10 + 4 + 1
            } else {
              year = currentYear - 10 + 4
            }
          } else if (i > 60 && i <= 72) {
            if (i % 12 === 0) {
              year = currentYear - 10 + 5 + 1
            } else {
              year = currentYear - 10 + 5
            }
          } else if (i > 72 && i <= 84) {
            if (i % 12 === 0) {
              year = currentYear - 10 + 6 + 1
            } else {
              year = currentYear - 10 + 6
            }
          } else if (i > 84 && i <= 96) {
            if (i % 12 === 0) {
              year = currentYear - 10 + 7 + 1
            } else {
              year = currentYear - 10 + 7
            }
          } else if (i > 96 && i <= 108) {
            if (i % 12 === 0) {
              year = currentYear - 10 + 8 + 1
            } else {
              year = currentYear - 10 + 8
            }
          } else if (i > 108 && i <= 120) {
            if (i % 12 === 0) {
              year = currentYear - 10 + 9 + 1
            } else {
              year = currentYear - 10 + 9
            }
          }
          dateOptions.push({ value: month + ' ' + year})
        }

        console.log('show date options ', dateOptions)

        // const projectCategoryOptions = [
        //   { value: 'Modeling'},{ value: 'Acting'},{ value: 'Software Development'},{ value: 'Designing'},
        //   { value: 'Ad Creative'},{ value: 'Product Management'},{ value: 'Entrepreneurship'},{ value: 'Producing'},
        //   { value: 'Directing'},{ value: 'Writing'},{ value: 'Dancing'},{ value: 'Architecture'},{ value: 'Art'},
        //   { value: 'Fashion'},{ value: 'Gaming'},{ value: 'Music'},{ value: 'Sports'},{ value: 'Other'},
        //
        // ]

        this.setState({ emailId: email,
          dateOptions, collaboratorOptions, hourOptions
          })

        Axios.get('https://www.guidedcompass.com/api/projects', { params: { emailId: email } })
        .then((response) => {
          console.log('Projects query attempted', response.data);

            if (response.data.success) {
              console.log('successfully retrieved projects')

              if (response.data.projects) {

                const projects = response.data.projects
                if (projects.length > 0) {
                  console.log('the array is greater than 0')

                  let isEditingProjectsArray = []
                  let projectHasChangedArray = []

                  for (i = 0; i < projects.length; i++) {
                    console.log('let see iteration', i)
                    isEditingProjectsArray.push(false)
                    projectHasChangedArray.push(false)
                  }

                  this.setState({ projects, isEditingProjectsArray, projectHasChangedArray })

                }
              }

            } else {
              console.log('no project data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Project query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/experience', { params: { emailId: email } })
        .then((response) => {
          console.log('Experience query attempted', response.data);

            if (response.data.success) {
              console.log('successfully retrieved experience')

              if (response.data.experience) {

                const experience = response.data.experience
                if (experience.length > 0) {
                  console.log('the array is greater than 0')

                  let isEditingExperienceArray = []
                  let experienceHasChangedArray = []

                  for (i = 0; i < experience.length; i++) {
                    console.log('let see iteration', i)
                    isEditingExperienceArray.push(false)
                    experienceHasChangedArray.push(false)
                  }

                  this.setState({ experience, isEditingExperienceArray, experienceHasChangedArray })

                }
              }

            } else {
              console.log('no experience data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Experience query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/workoptions')
        .then((response) => {
          console.log('Work options query tried', response.data);

          if (response.data.success) {
            console.log('Work options query succeeded')

            let functionOptions = [{value: 'I am not sure'}]
            for (let i = 1; i <= response.data.workOptions[0].functionOptions.length; i++) {
              if (i > 1) {
                functionOptions.push({ value: response.data.workOptions[0].functionOptions[i - 1]})
              }
            }

            let industryOptions = [{value: 'I am not sure'}]
            for (let i = 1; i <= response.data.workOptions[0].industryOptions.length; i++) {
              if (i > 1) {
                industryOptions.push({ value: response.data.workOptions[0].industryOptions[i - 1]})
              }
            }

            let workDistanceOptions = [{value: '0 miles'},{value: '10 miles'}]
            for (let i = 1; i <= response.data.workOptions[0].workDistanceOptions.length; i++) {
              if (i > 1) {
                workDistanceOptions.push({ value: response.data.workOptions[0].workDistanceOptions[i - 1]})
              }
            }

            let hoursPerWeekOptions = [{value: '~ 40 hours / week'}]
            for (let i = 1; i <= response.data.workOptions[0].hoursPerWeekOptions.length; i++) {
              if (i > 1) {
                hoursPerWeekOptions.push({ value: response.data.workOptions[0].hoursPerWeekOptions[i - 1]})
              }
            }

            let workTypeOptions = [{value: 'Internship'}]
            for (let i = 1; i <= response.data.workOptions[0].workTypeOptions.length; i++) {
              if (i > 1) {
                workTypeOptions.push({ value: response.data.workOptions[0].workTypeOptions[i - 1]})
              }
            }

            let hourlyPayOptions = [{value: 'Flexible'}]
            for (let i = 1; i <= response.data.workOptions[0].hourlyPayOptions.length; i++) {
              if (i > 1) {
                hourlyPayOptions.push({ value: response.data.workOptions[0].hourlyPayOptions[i - 1]})
              }
            }

            let annualPayOptions = [{value: 'I am not sure'}]
            for (let i = 1; i <= response.data.workOptions[0].annualPayOptions.length; i++) {
              if (i > 1) {
                annualPayOptions.push({ value: response.data.workOptions[0].annualPayOptions[i - 1]})
              }
            }

            let projectCategoryOptions = [{value: 'I am not sure'}]
            for (let i = 1; i <= response.data.workOptions[0].projectCategoryOptions.length; i++) {
              if (i > 1) {
                projectCategoryOptions.push({ value: response.data.workOptions[0].projectCategoryOptions[i - 1]})
              }
            }

            this.setState({ functionOptions, industryOptions,
            workDistanceOptions, hoursPerWeekOptions, workTypeOptions, hourlyPayOptions, payOptions: annualPayOptions, projectCategoryOptions })


          } else {
            console.log('no jobFamilies data found', response.data.message)

            const functionOptions = [{value: 'Undecided'}]
            const industryOptions = [{value: 'Undecided'}]
            //const workDistanceOptions = [{value: '0 miles'},{value: '10 miles'}]
            const hoursPerWeekOptions = [{value: '~ 40 hours / week'}]
            //const workTypeOptions = [{value: 'Internship'}]
            //const hourlyPayOptions = [{value: 'Flexible'}]
            const payOptions = [{value: 'Flexible'}]

            this.setState({ functionOptions, industryOptions, hoursPerWeekOptions, payOptions })

          }
        }).catch((error) => {
            console.log('query for work options did not work', error);
        })

        const fetchDetailsURL = 'https://www.guidedcompass.com/api/users/profile/details/' + email
        //fetch profile details
        Axios.get(fetchDetailsURL)
        .then((response) => {
          if (response.data) {

            console.log('Details fetch worked', response.data);

            let firstNameValue = ''
            if (response.data.user.firstName) {
              console.log('found a value for first name', response.data.user.firstName)
              firstNameValue = response.data.user.firstName
            }
            let lastNameValue  = ''
            if (response.data.user.lastName) {
              lastNameValue = response.data.user.lastName
            }

            let linkedInURL = ''
            if (response.data.user.linkedInURL) {
              linkedInURL = response.data.user.linkedInURL
            }

            let resumeURL = ''
            if (response.data.user.resumeURL) {
              resumeURL = response.data.user.resumeURL
            }

            let customWebsiteURL = ''
            if (response.data.user.customWebsiteURL) {
              customWebsiteURL = response.data.user.customWebsiteURL
            }

            let phoneNumber = ''
            if (response.data.user.phoneNumber) {
              phoneNumber = response.data.user.phoneNumber
            }

            let race = ''
            if (response.data.user.race) {
              race = response.data.user.race
            }

            let gender = ''
            if (response.data.user.gender) {
              gender = response.data.user.gender
            }

            let veteran = ''
            if (response.data.user.veteran) {
              veteran = response.data.user.veteran
            }

            let workAuthorization = ''
            if (response.data.user.workAuthorization) {
              workAuthorization = response.data.user.workAuthorization
            }

            let school = ''
            if (response.data.user.school) {
              school = response.data.user.school
            }

            let degree = ''
            if (response.data.user.degree) {
              degree = response.data.user.degree
            }

            let major = ''
            if (response.data.user.major) {
              major = response.data.user.major
            }

            let gradYear = ''
            if (response.data.user.gradYear) {
              gradYear = response.data.user.gradYear
            }

            let hasPreviousSchool = false
            if (response.data.user.hasPreviousSchool) {
              hasPreviousSchool = response.data.user.hasPreviousSchool
            }

            let school2 = ''
            if (response.data.user.school2) {
              school2 = response.data.user.school2
            }

            let degree2 = ''
            if (response.data.user.degree2) {
              degree2 = response.data.user.degree2
            }

            let major2 = ''
            if (response.data.user.major2) {
              major2 = response.data.user.major2
            }

            let gradYear2 = ''
            if (response.data.user.gradYear2) {
              gradYear2 = response.data.user.gradYear2
            }

            this.setState({
              firstNameValue,
              lastNameValue,
              linkedInURL,
              resumeURL,
              customWebsiteURL,
              phoneNumber,
              race,
              gender,
              veteran,
              workAuthorization,
              school,
              degree,
              major,
              gradYear,
              hasPreviousSchool, school2, degree2, major2, gradYear2
            })

          }
        }).catch((error) => {
            console.log('Profile pic fetch did not work', error);
        });

        //fetch profile pic
        Axios.get('https://www.guidedcompass.com/api/users/profile/profile-pic/', { params: { email: email} })
        .then((response) => {
          if (response.data) {

            console.log('Profile pic fetch worked', response.data.profilePicPath);
            this.setState({ profilePicPath: response.data.profilePicPath })

          }
        }).catch((error) => {
            console.log('Profile pic fetch did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error retrieving stuff', error)
     }
  }

  closeEdit(editSection) {
    console.log('closeEdit called', editSection)

    if (editSection === 'isEditingBasicInfo') {
      this.setState({ isEditingBasicInfo: false })
    } else if (editSection === 'isEditingDegree') {
      this.setState({ isEditingDegree: false })
    } else if (editSection === 'isEditingIdentification') {
      this.setState({ isEditingIdentification: false })
    } else if (editSection.includes('project')) {
      const nameArray = editSection.split('|')
      const index = Number(nameArray[1]) - 1

      let isEditingProjectsArray = this.state.isEditingProjectsArray
      isEditingProjectsArray[index] = false

      this.setState({ isEditingProjectsArray})
    } else if (editSection.includes('experience')) {
      const nameArray = editSection.split('|')
      const index = Number(nameArray[1]) - 1

      let isEditingExperienceArray = this.state.isEditingExperienceArray
      isEditingExperienceArray[index] = false
      this.setState({ isEditingExperienceArray})
    }

    this.saveProfile()
  }

  formChangeHandler(value, index, field) {
    console.log('formChangeHandler called', value, index, field)

    if (field === 'projectTitle') {
      let projects = this.state.projects
      projects[index]['name'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field === 'projectURL') {
      let projects = this.state.projects
      projects[index]['url'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field ==='projectCategory') {
      let projects = this.state.projects
      projects[index]['category'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field === 'projectDescription') {
      let projects = this.state.projects
      projects[index]['description'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field === 'startDate') {
      let projects = this.state.projects
      projects[index]['startDate'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field === 'endDate') {
      let projects = this.state.projects
      projects[index]['endDate'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field === 'collaborators') {
      let projects = this.state.projects
      projects[index]['collaboratorCount'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field === 'projectHours') {
      let projects = this.state.projects
      projects[index]['hours'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field === 'skillTags') {
      let projects = this.state.projects
      projects[index]['skillTags'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field === 'industryTags') {
      let projects = this.state.projects
      projects[index]['industryTags'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field === 'projectFunction') {
      let projects = this.state.projects
      projects[index]['jobFunction'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })

    } else if (field === 'projectIndustry') {
      let projects = this.state.projects
      projects[index]['industry'] = value

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray[index] = true

      let projectHasChanged = true
      this.setState({ projects, projectHasChanged, projectHasChangedArray })
    } else if (field === 'isEditingProjectsArray') {
      let isEditingProjectsArray = this.state.isEditingProjectsArray
      if (isEditingProjectsArray[index]) {
        isEditingProjectsArray[index] = false
      } else {
        isEditingProjectsArray[index] = true
      }
      this.setState({ isEditingProjectsArray })
    } else if (field === 'isEditingExperienceArray') {
      let isEditingExperienceArray = this.state.isEditingExperienceArray
      if (isEditingExperienceArray[index]) {
        isEditingExperienceArray[index] = false
      } else {
        isEditingExperienceArray[index] = true
      }
      this.setState({ isEditingExperienceArray })

    } else if (field === 'jobTitle') {
      let experience = this.state.experience
      experience[index]['jobTitle'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'employerName') {
      let experience = this.state.experience
      experience[index]['employerName'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'experienceStartDate') {
      let experience = this.state.experience
      experience[index]['startDate'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'experienceEndDate') {
      let experience = this.state.experience
      experience[index]['endDate'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'jobFunction') {
      let experience = this.state.experience
      experience[index]['jobFunction'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'industry') {
      let experience = this.state.experience
      experience[index]['industry'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'pay') {
      let experience = this.state.experience
      experience[index]['pay'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'wasPaid') {
      let experience = this.state.experience
      experience[index]['wasPaid'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'hoursPerWeek') {
      let experience = this.state.experience
      experience[index]['hoursPerWeek'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'experienceSkillTags') {
      let experience = this.state.experience
      experience[index]['skillTags'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'workInterest') {
      let experience = this.state.experience
      experience[index]['workInterest'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'workSkill') {
      let experience = this.state.experience
      experience[index]['workSkill'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'teamInterest') {
      let experience = this.state.experience
      experience[index]['teamInterest'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'employerInterest') {
      let experience = this.state.experience
      experience[index]['employerInterest'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'payInterest') {
      let experience = this.state.experience
      experience[index]['payInterest'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
    } else if (field === 'overallFit') {
      let experience = this.state.experience
      experience[index]['overallFit'] = value

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray[index] = true

      let experienceHasChanged = true
      this.setState({ experience, experienceHasChanged, experienceHasChangedArray })
      console.log('log experience ', experience)
    }
  }

  addItem(type) {
    console.log('addItem called', type)

    if (type === 'projects') {
      let projects = this.state.projects
      projects.push([])

      let isEditingProjectsArray = this.state.isEditingProjectsArray
      for (let i = 1; i <= isEditingProjectsArray.length; i++) {

        isEditingProjectsArray[i - 1] = false
      }

      isEditingProjectsArray.push(true)

      let projectHasChangedArray = this.state.projectHasChangedArray
      projectHasChangedArray.push(false)

      this.setState({ projects, isEditingProjectsArray, projectHasChangedArray })

    } else if (type === 'experience') {
      let experience = this.state.experience
      experience.push([])

      let isEditingExperienceArray = this.state.isEditingExperienceArray
      for (let i = 1; i <= isEditingExperienceArray.length; i++) {
        isEditingExperienceArray[i - 1] = false
      }
      isEditingExperienceArray.push(true)

      let experienceHasChangedArray = this.state.experienceHasChangedArray
      experienceHasChangedArray.push(false)

      this.setState({ experience, isEditingExperienceArray, experienceHasChangedArray })
    } else {
      console.log('there was an error')
    }
  }

  saveProfile() {
    console.log('called saveProfile')

    this.setState({
      serverSuccessText: false,
      serverErrorMessageText: '',
      serverSuccessMessageText: '',
      serverSuccessProfilePic: false,
      serverErrorMessageProfilePic: '',
      serverSuccessMessageProfilePic: '',
      serverSuccessCoverPic: false,
      serverErrorMessageCoverPic: '',
      serverSuccessMessageCoverPic: '',
    })

    const emailId = this.state.emailId

    let updatedAt = new Date();

    //only save form if field values have changed
    if (this.state.profilePicHasChanged === true) {
        console.log('used has changed profile pic just now!!!')

        if (this.state.profilePicImage) {
            console.log('profile pic was uploaded')
            let profilePicData = new FormData();
            profilePicData.append('profileImage', { uri: this.state.profilePicImage.uri, name: emailId, type: 'image/png'})

            fetch("https://www.guidedcompass.com/api/users/profile/profile-pic", {
                mode: 'no-cors',
                method: "POST",
                body: profilePicData
              }).then(function (res) {
                console.log('what is the profile pic response', res.body);
                if (res.ok) {
                  console.log('response was ok')
                  //success
                  this.setState({
                      serverSuccessProfilePic: true,
                      serverSuccessMessageProfilePic: 'Profile pic saved successfully!'
                  })
                } else if (res.status === 401) {
                  console.log('response was unauthorized')
                  //unauthorized
                  this.setState({
                      serverSuccessProfilePic: false,
                      serverErrorMessageProfilePic: 'There was an error saving profile pic: Unauthorized save.'
                  })
                }
              }.bind(this), function (e) {
                console.log('response was an error', e)
                //there was an error
                this.setState({
                    serverSuccessProfilePic: false,
                    serverErrorMessageProfilePic: 'There was an error saving profile pic:' + e
                })
              }.bind(this));

        }
    }

    if (this.state.textFormHasChanged === true) {
        console.log('used has changed the text portions of the form!!!')

        let liu = ''
        console.log('show linkedinURLValue:', this.state.linkedInURL)
        if (this.state.linkedInURL) {
          liu = this.state.linkedInURL
          const prefix = liu.substring(0,4);

          if (prefix !== "http") {
            liu = "http://" + liu
          }
        }

        let ru = ''
        if (this.state.resumeURL) {
          ru = this.state.resumeURL
          const prefix = ru.substring(0,4);

          if (prefix !== "http") {
            ru = "http://" + ru
          }
        }

        let cwu = ''
        if (this.state.customWebsiteURL) {

          cwu = this.state.customWebsiteURL
          const prefix = cwu.substring(0,4);

          if (prefix !== "http") {
            cwu = "http://" + cwu
          }
        }

        const firstNameValue = this.state.firstNameValue
        const lastNameValue = this.state.lastNameValue
        const linkedInURL = liu
        const resumeURL = ru
        const customWebsiteURL = cwu

        const phoneNumber = this.state.phoneNumber
        const race = this.state.race
        const gender = this.state.gender
        const veteran = this.state.veteran
        const workAuthorization = this.state.workAuthorization
        const school = this.state.school
        const degree = this.state.degree
        const major = this.state.major
        const gradYear = this.state.gradYear

        const hasPreviousSchool = this.state.hasPreviousSchool
        const school2 = this.state.school2
        const degree2 = this.state.degree2
        const major2 = this.state.major2
        const gradYear2 = this.state.gradYear2

        Axios.post('https://www.guidedcompass.com/api/users/profile/details', {
          emailId, firstNameValue, lastNameValue, linkedInURL,
          resumeURL, customWebsiteURL,
          phoneNumber,
          race, gender, veteran, workAuthorization, school,
          degree, major, gradYear,
          hasPreviousSchool, school2, degree2, major2, gradYear2,
          updatedAt
        })
        .then((response) => {

          if (response.data.success) {
            //save values
            console.log('Save send worked', response.data);
            //report whether values were successfully saved

            //save name to local storage
            AsyncStorage.setItem('firstName', firstNameValue)
            AsyncStorage.setItem('lastName', lastNameValue)

            this.setState({
                isWaiting: false,
                textFormHasChanged: false,

                serverSuccessText: true,
                serverSuccessMessageText: 'Profile saved successfully!'
            })

          } else {
            console.log('request was not successful')
            this.setState({
                isWaiting: false,
                textFormHasChanged: false,

                serverSuccessText: false,
                serverErrorMessageText: responseData.message,
            })
          }

        }).catch((error) => {
            console.log('Resource send did not work', error);
        });

    }

    if (this.state.projectHasChanged) {

      for (let i = 1; i <= this.state.projects.length; i++) {

        if (this.state.projectHasChangedArray[i - 1]) {

          const emailId = this.state.emailId

          const _id = this.state.projects[i - 1]._id
          const name = this.state.projects[i - 1].name
          const url = this.state.projects[i - 1].url
          const category = this.state.projects[i - 1].category
          const description = this.state.projects[i - 1].description
          const startDate = this.state.projects[i - 1].startDate
          const endDate = this.state.projects[i - 1].endDate
          const collaborators = this.state.projects[i - 1].collaborators
          const collaboratorCount = this.state.projects[i - 1].collaboratorCount
          const hours = this.state.projects[i - 1].hours
          const skillTags = this.state.projects[i - 1].skillTags
          //const industryTags = this.state.projects[i - 1].industryTags
          const jobFunction = this.state.projects[i - 1].jobFunction
          const industry = this.state.projects[i - 1].industry

          Axios.post('https://www.guidedcompass.com/api/projects', {
            _id, emailId, name, url, category, description, startDate, endDate, collaborators, collaboratorCount,
            hours, skillTags, jobFunction, industry
          })
          .then((response) => {

            if (response.data.success) {
              //save values
              console.log('Project save worked worked', response.data);
              //report whether values were successfully saved

              let projectHasChangedArray = this.state.projectHasChangedArray
              projectHasChangedArray[i - 1] = false

              this.setState({
                projectHasChangedArray,

                serverSuccessText: true,
                serverSuccessMessageText: 'Projects saved successfully!'
              })

            } else {
              console.log('project did not save successfully')
              this.setState({

                  serverSuccessText: false,
                  serverErrorMessageText: response.data.message,
              })
            }

          }).catch((error) => {
              console.log('Project save did not work', error);
          });
        }
      }
    }

    if (this.state.experienceHasChanged) {

      for (let i = 1; i <= this.state.experience.length; i++) {

        if (this.state.experienceHasChangedArray[i - 1]) {

          const emailId = this.state.emailId
          const _id = this.state.experience[i - 1]._id
          const jobTitle = this.state.experience[i - 1].jobTitle
          const employerName = this.state.experience[i - 1].employerName
          const startDate = this.state.experience[i - 1].startDate
          const endDate = this.state.experience[i - 1].endDate
          const jobFunction = this.state.experience[i - 1].jobFunction
          const industry = this.state.experience[i - 1].industry
          const pay = this.state.experience[i - 1].pay
          const wasPaid = this.state.experience[i - 1].wasPaid
          const hoursPerWeek = this.state.experience[i - 1].hoursPerWeek
          const skillTags = this.state.experience[i - 1].skillTags
          const workInterest = this.state.experience[i - 1].workInterest
          const workSkill = this.state.experience[i - 1].workSkill
          const teamInterest = this.state.experience[i - 1].teamInterest
          const employerInterest = this.state.experience[i - 1].employerInterest
          const payInterest = this.state.experience[i - 1].payInterest
          const overallFit = this.state.experience[i - 1].overallFit

          console.log('do we have employer name', employerName)

          Axios.post('https://www.guidedcompass.com/api/experience', {
            _id, emailId, jobTitle, employerName, startDate, endDate, jobFunction, industry, wasPaid, hoursPerWeek,
            skillTags, workInterest, workSkill, teamInterest, employerInterest, payInterest, overallFit
          })
          .then((response) => {

            if (response.data.success) {
              //save values
              console.log('Experience save worked worked', response.data);
              //report whether values were successfully saved

              let experienceHasChangedArray = this.state.projectHasChangedArray
              experienceHasChangedArray[i - 1] = false

              this.setState({
                experienceHasChangedArray,

                serverSuccessText: true,
                serverSuccessMessageText: 'Experience saved successfully!'
              })

            } else {
              console.log('experience did not save successfully')
              this.setState({

                  serverSuccessText: false,
                  serverErrorMessageText: response.data.message,
              })
            }

          }).catch((error) => {
              console.log('Experience save did not work', error);
          });
        }
      }
    }

    if (!this.state.profilePicHasChanged && !this.state.textFormHasChanged && !this.state.projectsHasChanged && !this.state.experienceHasChanged) {
      this.setState({
        serverSuccessText: false,
        serverErrorMessageText: 'No profile changes detected',
      })
    }
  }

  renderProjects() {
    console.log('renderProjects called')

    let rows = []

    for (let i = 1; i <= this.state.projects.length; i++) {

      const rowKey = 'project|' + i.toString()

      if (this.state.isEditingProjectsArray[i - 1]) {
        rows.push(
          <View key={rowKey} style={{ flex: 1 }}>
            {i > 1 && <View style={{ height: 15 }}/>}
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 75 }}>
                {(this.state.projects[i - 1].name !== '') ? (
                  <Text style={{ fontSize: 18, color: 'grey' }}>Edit {this.state.projects[i - 1].name}</Text>
                ) : (
                  <Text style={{ fontSize: 18, color: 'grey' }}>Edit project below</Text>
                )}
              </View>
              <View style={{ flex: 25, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => this.closeEdit(rowKey)}>
                  <View>
                    <Text style={{ fontSize: 18, color: '#5FCEFA' }}>Done</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 20 }}/>

            <Text style={styles.categoryTitle}>Project Title</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler(text, i - 1, 'projectTitle')}
              value={this.state.projects[i - 1].name}
              placeholder="project title"
              placeholderTextColor="grey"
            />

            <Text style={styles.categoryTitle}>Project URL</Text>
            <Text style={{ fontSize: 10, color: '#969696' }}>Add the link to your project from your own website or a portfolio site like www.HackHive.com</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler(text, i - 1, 'projectURL')}
              value={this.state.projects[i - 1].url}
              placeholder="project url"
              placeholderTextColor="grey"
              autoCapitalize="none"
            />

            <View style={{ height: 10 }}/>
            <Text style={styles.categoryTitle}>Project Category</Text>
            <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.projects[i - 1].category} data={this.state.projectCategoryOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'projectCategory')}/>
            <View style={{ height: 10 }}/>

            <Text style={styles.categoryTitle}>Project Description</Text>
            <TextInput
              style={styles.textArea}
              onChangeText={(text) => this.formChangeHandler(text, i - 1, 'projectDescription')}
              value={this.state.projects[i - 1].description}
              placeholder="project description"
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={4}
            />

            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Start Date</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.projects[i - 1].startDate} data={this.state.dateOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'startDate')}/>
              </View>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>End Date</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.projects[i - 1].endDate} data={this.state.dateOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'endDate')}/>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}># of Collaborators</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.projects[i - 1].collaboratorCount} data={this.state.collaboratorOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'collaborators')}/>
              </View>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Number of Hours</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.projects[i - 1].hours} data={this.state.hourOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'projectHours')}/>
              </View>
            </View>

            {/*
            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Did the project generate over $100?</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.projects[i - 1].generatedMoney} data={this.state.binaryOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'generatedMoney')}/>
              </View>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Did over 1,000 people use your product?</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.projects[i - 1].generatedUsers} data={this.state.binaryOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'generatedUsers')}/>
              </View>
            </View>
            */}

            <Text style={styles.categoryTitle}>Skill Tags</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler(text, i - 1, 'skillTags')}
              value={this.state.projects[i - 1].skillTags}
              placeholder="add skills acquired separated by commas"
              placeholderTextColor="grey"
              autoCapitalize="none"
            />

            <Text style={styles.categoryTitle}>Closest Related Job Function</Text>
            <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.projects[i - 1].jobFunction} data={this.state.functionOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'projectFunction')}/>

            <Text style={styles.categoryTitle}>Closest Related Industry</Text>
            <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.projects[i - 1].industry} data={this.state.industryOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'projectIndustry')}/>
            {/*
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler(text, i - 1, 'industryTags')}
              value={this.state.projects[i - 1].industryTags}
              placeholder="add industries separated by commas"
              placeholderTextColor="grey"
              autoCapitalize="none"
            />*/}
          </View>
        )
      } else {
        console.log('testing before hours ', hourArray)
        let hourArray = this.state.projects[i - 1].hours
        let hoursShorthand = ''
        if (hourArray) {
          if (hourArray.includes('<')) {
            hourArray = this.state.projects[i - 1].hours.split('< ')
            hoursShorthand = hourArray[0] + '+'
          } else {
            hourArray = this.state.projects[i - 1].hours.split(' - ')
            hoursShorthand = hourArray[0] + '+'
          }
        }

        rows.push(
          <View key={rowKey}>
            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 25, alignItems: 'center'}}>
                <Text numberOfLines={1} style={{ fontSize: 22, color: '#969696'}}>{hoursShorthand}</Text>
                <Text numberOfLines={1} style={{ fontSize: 10, color: '#969696'}}>hours</Text>
              </View>
              <View style={{ flex: 65}}>
                <Text numberOfLines={1} style={styles.categoryText}>{this.state.projects[i - 1].name}</Text>
                <Text numberOfLines={1} style={styles.categoryTitle}>{this.state.projects[i - 1].startDate} - {this.state.projects[i - 1].endDate}</Text>
              </View>
              <View style={{ flex: 10, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => this.formChangeHandler('', i - 1, 'isEditingProjectsArray')}>
                  <Icon name={'md-create'} size={18} color="#5FCEFA" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 15 }}/>
          </View>
        )
      }
    }

    return rows
  }

  renderExperience() {
    console.log('renderExperience called')

    let rows = []

    for (let i = 1; i <= this.state.experience.length; i++) {

      const rowKey = 'experience|' + i.toString()
      if (this.state.isEditingExperienceArray[i - 1]) {
        rows.push(
          <View key={rowKey} style={{ flex: 1 }}>
            {i > 1 && <View style={{ height: 15 }}/>}
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 75 }}>
                {(this.state.experience[i - 1].jobTitle !== '') ? (
                  <Text style={{ fontSize: 18, color: 'grey' }}>Edit {this.state.experience[i - 1].jobTitle}</Text>
                ) : (
                  <Text style={{ fontSize: 18, color: 'grey' }}>Edit experience below</Text>
                )}
              </View>
              <View style={{ flex: 25, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => this.closeEdit(rowKey)}>
                  <View>
                    <Text style={{ fontSize: 18, color: '#5FCEFA' }}>Done</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 20 }}/>

            <Text style={styles.categoryTitle}>Job Title</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler(text, i - 1, 'jobTitle')}
              value={this.state.experience[i - 1].jobTitle}
              placeholder="job title"
              placeholderTextColor="grey"
            />

            <Text style={styles.categoryTitle}>Employer Name</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler(text, i - 1, 'employerName')}
              value={this.state.experience[i - 1].employerName}
              placeholder="employer name"
              placeholderTextColor="grey"
            />

            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Start Date</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].startDate} data={this.state.dateOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'experienceStartDate')}/>
              </View>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>End Date</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].endDate} data={this.state.dateOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'experienceEndDate')}/>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Job Function</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].jobFunction} data={this.state.functionOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'jobFunction')}/>
              </View>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Job Industry</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].industry} data={this.state.industryOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'industry')}/>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Were you paid?</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].wasPaid} data={this.state.binaryOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'wasPaid')}/>
              </View>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Hours Per Week</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].hoursPerWeek} data={this.state.hoursPerWeekOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'hoursPerWeek')}/>
              </View>
            </View>

            <Text style={styles.categoryTitle}>Skill Tags</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler(text, i - 1, 'experienceSkillTags')}
              value={this.state.experience[i - 1].skillTags}
              placeholder="add skills you acquired separated by commas"
              placeholderTextColor="grey"
              autoCapitalize="none"
            />

            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Did you like the work?</Text>
                <Text style={styles.categoryTitle}>(5=max)</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].workInterest} data={this.state.collaboratorOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'workInterest')}/>
              </View>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Do you think can be skilled in this work?</Text>
                <Text style={styles.categoryTitle}>(5=max)</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].workSkill} data={this.state.collaboratorOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'workSkill')}/>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Did you like the team?</Text>
                <Text style={styles.categoryTitle}>(5=max)</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].teamInterest} data={this.state.collaboratorOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'teamInterest')}/>
              </View>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Did you like the employer?</Text>
                <Text style={styles.categoryTitle}>(5=max)</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].employerInterest} data={this.state.collaboratorOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'employerInterest')}/>
              </View>
            </View>

            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>Would the pay be acceptable?</Text>
                <Text style={styles.categoryTitle}>(5=max)</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].payInterest} data={this.state.collaboratorOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'payInterest')}/>
              </View>
              <View style={{ flex: 50}}>
                <Text style={styles.categoryTitle}>What do you rate the overall fit?</Text>
                <Text style={styles.categoryTitle}>(5=max)</Text>
                <Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.experience[i - 1].overallFit} data={this.state.collaboratorOptions} onChangeText={(value) => this.formChangeHandler(value, i - 1, 'overallFit')}/>
              </View>
            </View>

          </View>
        )
      } else {
        rows.push(
          <View key={rowKey}>
            <View style={{ flex: 1, flexDirection: 'row'}}>
              <View style={{ flex: 25, alignItems: 'center'}}>
                <Text numberOfLines={1} style={{ fontSize: 22, color: '#969696'}}>{this.state.experience[i - 1].overallFit}</Text>
                <Text numberOfLines={1} style={{ fontSize: 10, color: '#969696'}}>of 5 match</Text>
              </View>
              <View style={{ flex: 65}}>
              <Text numberOfLines={1} style={styles.categoryText}>{this.state.experience[i - 1].jobTitle}</Text>
              <Text numberOfLines={1} style={styles.categoryTitle}>{this.state.experience[i - 1].employerName}</Text>
              <Text numberOfLines={1} style={styles.categoryTitle}>{this.state.experience[i - 1].startDate} - {this.state.experience[i - 1].endDate}</Text>
              </View>
              <View style={{ flex: 10, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => this.formChangeHandler('', i - 1, 'isEditingExperienceArray')}>
                  <Icon name={'md-create'} size={18} color="#5FCEFA" />
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 15 }}/>
          </View>
        )
      }
    }

    return rows
  }

  render() {
    return (
      <ScrollView>
        <View style={styles.containerStyle} >
          {/*
          <TouchableOpacity onPress={this.pickImageHandler}>
            <View style={styles.profilePhotoContainer}>
            <Image source={ this.state.profilePicImage ? ( { uri: this.state.profilePicImage.uri } )
                : this.state.profilePicPath ? ( { uri: "https://www.guidedcompass.com/" + this.state.profilePicPath } )
                : ( {uri: 'https://www.guidedcompass.com/public-server/mobile-app/add-profile-photo-icon.png'})} style={styles.profilePhoto}/>
            </View>
          </TouchableOpacity>
          */}
          { (this.state.isEditingBasicInfo) ? (
            <View>
              <View style={{ height: 15 }}/>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 75 }}>
                  <Text style={styles.subtitle}>Basic Info</Text>
                </View>
                <View style={{ flex: 25, alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => this.closeEdit('isEditingBasicInfo')}>
                    <View>
                      <Text style={styles.subtitleBlue}>Done</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: 20 }}/>
              <Text style={styles.categoryTitle}>First Name</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({firstNameValue: text, textFormHasChanged: true})}
                value={this.state.firstNameValue}
                placeholder="first name"
                placeholderTextColor="grey"
              />

              <Text style={styles.categoryTitle}>Last Name</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({lastNameValue: text, textFormHasChanged: true})}
                value={this.state.lastNameValue}
                placeholder="last name"
                placeholderTextColor="grey"
              />

              <Text style={styles.categoryTitle}>Resume URL</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({resumeURL: text, textFormHasChanged: true})}
                value={this.state.resumeURL}
                autoCapitalize="none"
                placeholder="resume url"
                placeholderTextColor="grey"
              />

              <Text style={styles.categoryTitle}>LinkedIn URL</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({linkedInURL: text, textFormHasChanged: true})}
                value={this.state.linkedInURL}
                autoCapitalize="none"
                placeholder="linkedin url"
                placeholderTextColor="grey"
              />

              <Text style={styles.categoryTitle}>Portfolio Website URL</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({customWebsiteURL: text, textFormHasChanged: true})}
                value={this.state.customWebsiteURL}
                autoCapitalize="none"
                placeholder="portfolio website url"
                placeholderTextColor="grey"
              />

              <Text style={styles.categoryTitle}>Phone Number {'\n'}(For Work Applications Only)</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({phoneNumber: text, textFormHasChanged: true})}
                value={this.state.phoneNumber}
                autoCapitalize="none"
                placeholder="add your phone number"
                placeholderTextColor="grey"
                keyboardType = "number-pad"
              />
            </View>
          ) : (
            <View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 75 }}>
                  <Text style={styles.subtitle}>Basic Info</Text>
                </View>
                <View style={{ flex: 25, alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => this.setState({ isEditingBasicInfo: true })}>
                    <View>
                      <Icon name={'md-create'} size={22} color="#5FCEFA" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: 20 }}/>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>First Name</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.firstNameValue !== '') ? this.state.firstNameValue : 'Add First Name'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Last Name</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.lastNameValue !== '') ? this.state.lastNameValue : 'Add Last Name'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Resume URL</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.resumeURL !== '') ? this.state.resumeURL : 'Add Resume URL'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>LinkedIn URL</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.linkedInURL !== '') ? this.state.linkedInURL : 'Add LinkedIn URL'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Portfolio URL</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.customWebsiteURL !== '') ? this.state.customWebsiteURL : 'Add Portfolio URL'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Phone Number</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.phoneNumber !== '') ? this.state.phoneNumber : 'Add Phone Number'}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 20 }}/>
          <View style={styles.underline}/>
          <View style={{ height: 20 }}/>

          { (this.state.isEditingDegree) ? (
            <View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 75 }}>
                  <Text style={styles.subtitle}>Education / Degree</Text>
                </View>
                <View style={{ flex: 25, alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => this.closeEdit('isEditingDegree')}>
                    <View>
                      <Text style={styles.subtitleBlue}>Done</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: 20 }}/>

              <Text style={styles.categoryTitle}>Last School / Current School Attended</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({ school: text, textFormHasChanged: true})}
                value={this.state.school}
                placeholder="enter school name"
                placeholderTextColor="grey"
              />

              <View style={{ height: 10 }} />

              <Text style={styles.categoryTitle}>Last School / Current School Degree</Text>
              {/*<Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.degreeValue} data={this.state.degreeOptions} onChangeText={(value) => this.formChangeHandler(value, 'careerTrack')}/>*/}

              <Picker
                selectedValue={this.state.degree}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => this.setState({ degree: itemValue, textFormHasChanged: true})}>
                <Picker.Item label="" value="" />
                <Picker.Item label="Middle School" value="Middle School" />
                <Picker.Item label="High School" value="High School" />
                <Picker.Item label="Associate's Degree" value="Associate's Degree" />
                <Picker.Item label="Bachelor's Degree" value="Bachelor's Degree" />
                <Picker.Item label="Master's Degree" value="Master's Degree" />
                <Picker.Item label="Doctoral Degree" value="Doctoral Degree" />
              </Picker>

              <View style={{ height: 10 }} />

              <Text style={styles.categoryTitle}>Last School / Current School Major</Text>
              <TextInput
                style={styles.textInput}
                onChangeText={(text) => this.setState({ major: text, textFormHasChanged: true})}
                value={this.state.major}
                placeholder="enter school major / study focus"
                placeholderTextColor="grey"
              />

              <View style={{ height: 10 }} />

              <Text style={styles.categoryTitle}>Last School / Current School Grad Year</Text>
              <Picker
                selectedValue={this.state.gradYear}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => this.setState({ gradYear: itemValue, textFormHasChanged: true})}>
                <Picker.Item label="" value="" />
                <Picker.Item label="2008" value="2008" />
                <Picker.Item label="2009" value="2009" />
                <Picker.Item label="2010" value="2010" />
                <Picker.Item label="2011" value="2011" />
                <Picker.Item label="2012" value="2012" />
                <Picker.Item label="2013" value="2013" />
                <Picker.Item label="2014" value="2014" />
                <Picker.Item label="2015" value="2015" />
                <Picker.Item label="2016" value="2016" />
                <Picker.Item label="2017" value="2017" />
                <Picker.Item label="2018" value="2018" />
                <Picker.Item label="2019" value="2019" />
                <Picker.Item label="2020" value="2020" />
                <Picker.Item label="2021" value="2021" />
                <Picker.Item label="2022" value="2022" />
                <Picker.Item label="2023" value="2023" />
                <Picker.Item label="2024" value="2024" />
                <Picker.Item label="2025" value="2025" />
                <Picker.Item label="2026" value="2026" />
              </Picker>

              <View style={{ height: 30 }} />

              <Text style={styles.categoryTitle}>Do you want to add another degree?</Text>
              <Switch
                 onValueChange = {(value) => this.setState({ hasPreviousSchool: value })}
                 value = {this.state.hasPreviousSchool}
              />

              {(this.state.hasPreviousSchool) && (
                <View>
                  <View style={{ height: 20 }} />
                  <Text style={styles.categoryTitle}>Previous School Attended</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({ school2: text, textFormHasChanged: true})}
                    value={this.state.school2}
                    placeholder="enter school name"
                    placeholderTextColor="grey"
                  />

                  <Text style={styles.categoryTitle}>Previous School Degree</Text>
                  {/*<Dropdown label='' labelHeight={10} labelPadding={10} textColor='grey' value={this.state.degreeValue} data={this.state.degreeOptions} onChangeText={(value) => this.formChangeHandler(value, 'careerTrack')}/>*/}

                  <Picker
                    selectedValue={this.state.degree2}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => this.setState({ degree2: itemValue, textFormHasChanged: true})}>
                    <Picker.Item label="" value="" />
                    <Picker.Item label="Middle School" value="Middle School" />
                    <Picker.Item label="High School" value="High School" />
                    <Picker.Item label="Associate's Degree" value="Associate's Degree" />
                    <Picker.Item label="Bachelor's Degree" value="Bachelor's Degree" />
                    <Picker.Item label="Master's Degree" value="Master's Degree" />
                    <Picker.Item label="Doctoral Degree" value="Doctoral Degree" />
                  </Picker>

                  <Text style={styles.categoryTitle}>Previous School Major</Text>
                  <TextInput
                    style={styles.textInput}
                    onChangeText={(text) => this.setState({ major2: text, textFormHasChanged: true})}
                    value={this.state.major2}
                    placeholder="enter school major / study focus"
                    placeholderTextColor="grey"
                  />

                  <Text style={styles.categoryTitle}>Previous School Grad Year</Text>
                  <Picker
                    selectedValue={this.state.gradYear2}
                    style={styles.picker}
                    onValueChange={(itemValue, itemIndex) => this.setState({ gradYear2: itemValue, textFormHasChanged: true})}>
                    <Picker.Item label="" value="" />
                    <Picker.Item label="2008" value="2008" />
                    <Picker.Item label="2009" value="2009" />
                    <Picker.Item label="2010" value="2010" />
                    <Picker.Item label="2011" value="2011" />
                    <Picker.Item label="2012" value="2012" />
                    <Picker.Item label="2013" value="2013" />
                    <Picker.Item label="2014" value="2014" />
                    <Picker.Item label="2015" value="2015" />
                    <Picker.Item label="2016" value="2016" />
                    <Picker.Item label="2017" value="2017" />
                    <Picker.Item label="2018" value="2018" />
                    <Picker.Item label="2019" value="2019" />
                    <Picker.Item label="2020" value="2020" />
                    <Picker.Item label="2021" value="2021" />
                    <Picker.Item label="2022" value="2022" />
                    <Picker.Item label="2023" value="2023" />
                    <Picker.Item label="2024" value="2024" />
                    <Picker.Item label="2025" value="2025" />
                    <Picker.Item label="2026" value="2026" />
                  </Picker>
                </View>
              )}
            </View>
          ) : (
            <View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 75 }}>
                  <Text style={styles.subtitle}>Education / Degree</Text>
                </View>
                <View style={{ flex: 25, alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => this.setState({ isEditingDegree: true })}>
                    <View>
                      <Icon name={'md-create'} size={22} color="#5FCEFA" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: 20 }}/>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Name</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.school !== '') ? this.state.school : 'Add Name'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Degree Type</Text>
                </View>
                <View style={{ flex: 60}}>

                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.degree !== '') ? this.state.degree : 'Add Degree Type'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>School Major</Text>
                </View>
                <View style={{ flex: 60}}>

                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.major !== '') ? this.state.major : 'Add School Major'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Grad Year</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.gradYear !== '') ? this.state.gradYear : 'Add Grad Year'}</Text>
                </View>
              </View>

              { this.state.hasPreviousSchool && (
                <View>
                  <View style={{ height: 20 }}/>

                  <View style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={{ flex: 40}}>
                      <Text numberOfLines={1} style={styles.categoryTitle}>Name</Text>
                    </View>
                    <View style={{ flex: 60}}>
                      <Text numberOfLines={1} style={styles.categoryText}>{(this.state.school2 !== '') ? this.state.school2 : 'Add Name'}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={{ flex: 40}}>
                      <Text numberOfLines={1} style={styles.categoryTitle}>Degree Type</Text>
                    </View>
                    <View style={{ flex: 60}}>

                      <Text numberOfLines={1} style={styles.categoryText}>{(this.state.degree2 !== '') ? this.state.degree2 : 'Add Degree Type'}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={{ flex: 40}}>
                      <Text numberOfLines={1} style={styles.categoryTitle}>School Major</Text>
                    </View>
                    <View style={{ flex: 60}}>

                      <Text numberOfLines={1} style={styles.categoryText}>{(this.state.major2 !== '') ? this.state.major2 : 'Add School Major'}</Text>
                    </View>
                  </View>

                  <View style={{ flex: 1, flexDirection: 'row'}}>
                    <View style={{ flex: 40}}>
                      <Text numberOfLines={1} style={styles.categoryTitle}>Grad Year</Text>
                    </View>
                    <View style={{ flex: 60}}>
                      <Text numberOfLines={1} style={styles.categoryText}>{(this.state.gradYear2 !== '') ? this.state.gradYear2 : 'Add Grad Year'}</Text>
                    </View>
                  </View>
                </View>
              )}
            </View>
          )}

          <View style={{ height: 20 }}/>
          <View style={styles.underline}/>
          <View style={{ height: 20 }}/>

          { (this.state.isEditingIdentification) ? (
            <View>

            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 75 }}>
                <Text style={styles.subtitle}>Self-Identification Info</Text>
              </View>
              <View style={{ flex: 25, alignItems: 'flex-end' }}>
                <TouchableOpacity onPress={() => this.closeEdit('isEditingIdentification')}>
                  <View>
                    <Text style={styles.subtitleBlue}>Done</Text>
                  </View>
                </TouchableOpacity>
              </View>
            </View>

            <View style={{ height: 20 }}/>
              <Text style={styles.categoryTitle}>Race</Text>
              <Picker
                selectedValue={this.state.race}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => this.setState({ race: itemValue, textFormHasChanged: true})}>
                <Picker.Item label="" value="" />
                <Picker.Item label="American Indian or Alaska Native" value="American Indian or Alaska Native" />
                <Picker.Item label="Asian-American" value="Asian-American" />
                <Picker.Item label="Black or African American" value="Black or African American" />
                <Picker.Item label="Hispanic or Latino" value="Hispanic or Latino" />
                <Picker.Item label="Native Hawaiian or Other Pacific Islander" value="Native Hawaiian or Other Pacific Islander" />
                <Picker.Item label="Two or More Races" value="Two or More Races" />
                <Picker.Item label="White" value="White" />
                <Picker.Item label="Do not disclose" value="Do not disclose" />
              </Picker>

              <Text style={styles.categoryTitle}>Gender</Text>
              <Picker
                selectedValue={this.state.gender}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => this.setState({ gender: itemValue, textFormHasChanged: true})}>
                <Picker.Item label="" value="" />
                <Picker.Item label="Female" value="Female" />
                <Picker.Item label="Male" value="Male" />
                <Picker.Item label="Do not disclose" value="Do not disclose" />
              </Picker>

              <Text style={styles.categoryTitle}>Veteran Status</Text>
              <Picker
                selectedValue={this.state.veteran}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => this.setState({ veteran: itemValue, textFormHasChanged: true})}>
                <Picker.Item label="" value="" />
                <Picker.Item label="I am a protected veteran" value="I am a protected veteran" />
                <Picker.Item label="I am an unprotected veteran" value="I am an unprotected veteran" />
                <Picker.Item label="I am not a veteran" value="I am not a veteran" />
              </Picker>

              <Text style={styles.categoryTitle}>Authorized to Work in the U.S.?</Text>
              <Picker
                selectedValue={this.state.workAuthorization}
                style={styles.picker}
                onValueChange={(itemValue, itemIndex) => this.setState({ workAuthorization: itemValue, textFormHasChanged: true})}>
                <Picker.Item label="" value="" />
                <Picker.Item label="Yes" value="Yes" />
                <Picker.Item label="No" value="No" />
              </Picker>
            </View>
          ) : (
            <View>
              <View style={{ flex: 1, flexDirection: 'row' }}>
                <View style={{ flex: 75 }}>
                  <Text style={styles.subtitle}>Self-Identification Info</Text>
                </View>
                <View style={{ flex: 25, alignItems: 'flex-end' }}>
                  <TouchableOpacity onPress={() => this.setState({ isEditingIdentification: true })}>
                    <View>
                      <Icon name={'md-create'} size={22} color="#5FCEFA" />
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={{ height: 20 }}/>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Race</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.race !== '') ? this.state.race : 'Add Race'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Gender</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.gender !== '') ? this.state.gender : 'Add Gender'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Veteran Status</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.veteran !== '') ? this.state.veteran : 'Add Veteran Status'}</Text>
                </View>
              </View>

              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View style={{ flex: 40}}>
                  <Text numberOfLines={1} style={styles.categoryTitle}>Work Auth</Text>
                </View>
                <View style={{ flex: 60}}>
                  <Text numberOfLines={1} style={styles.categoryText}>{(this.state.workAuthorization !== '') ? this.state.workAuthorization : 'Add Work Authorization'}</Text>
                </View>
              </View>
            </View>
          )}

          <View style={{ height: 20 }}/>
          <View style={styles.underline}/>
          <View style={{ height: 20 }}/>

          <View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 75 }}>
                <Text style={styles.subtitle}>Projects</Text>
              </View>
              <View style={{ flex: 25, alignItems: 'flex-end', marginTop: -3 }}>
                <TouchableOpacity onPress={() => this.addItem('projects')}>
                  <View>
                    <Icon name={'ios-add'} size={32} color="#5FCEFA" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 20 }}/>

            {(this.state.projects.length > 0) ? (
              <View>
                {this.renderProjects()}
              </View>
            ) : (
              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View>
                  <Text numberOfLines={2} style={styles.categoryTitle}>Add school or personal projects relevant to employment.</Text>
                </View>
              </View>
            )}
          </View>

          <View style={{ height: 20 }}/>
          <View style={styles.underline}/>
          <View style={{ height: 20 }}/>

          <View>
            <View style={{ flex: 1, flexDirection: 'row' }}>
              <View style={{ flex: 75 }}>
                <Text style={styles.subtitle}>Experience</Text>
              </View>
              <View style={{ flex: 25, alignItems: 'flex-end', marginTop: -3 }}>
                <TouchableOpacity onPress={() => this.addItem('experience')}>
                  <View>
                    <Icon name={'ios-add'} size={32} color="#5FCEFA" />
                  </View>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ height: 20 }}/>

            {(this.state.experience.length > 0) ? (
              <View>
                {this.renderExperience()}
              </View>
            ) : (
              <View style={{ flex: 1, flexDirection: 'row'}}>
                <View>
                  <Text numberOfLines={2} style={styles.categoryTitle}>Provide feedback on how much your past work experience was a fit.</Text>
                </View>
              </View>
            )}
          </View>

          { (this.state.serverSuccessText) ? (
            <Text style={styles.successMessage}>{this.state.serverSuccessMessageText}</Text>
          ) : (
            <Text style={styles.errorMessage}>{this.state.serverErrorMessageText}</Text>
          )}
          { (this.state.serverSuccessProfilePic) ? (
            <Text style={styles.successMessage}>{this.state.serverSuccessMessageProfilePic}</Text>
          ) : (
            <Text style={styles.errorMessage}>{this.state.serverErrorMessageProfilePic}</Text>
          )}

          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={this.saveProfile}>
              <View style={styles.primaryButtonView}>
                <Text style={styles.primaryButtonText}>Save Changes</Text>
              </View>
            </TouchableOpacity>
          </View>

        </View>
      </ScrollView>
    );
  }
}

export default Profile;

var styles = StyleSheet.create({
  profilePhoto: {
    width: 100,
    height: 100,
  },
  profilePhotoContainer: {
    alignItems: 'center',
    marginTop: 10
  },
  containerStyle: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    marginLeft: 20,
    marginRight: 20,
    marginTop: 20,
    backgroundColor: 'white',
    padding: 20
  },
  picker: {
    height: 200,
    width: 280,
    paddingBottom: 20
  },
  textInput: {
    height: 40,
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  textArea: {
    height: 80,
    backgroundColor: '#fff',
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    paddingRight: 10
  },
  buttonContainer: {
    alignItems: 'center'
  },
  primaryButtonView: {
    width: 180,
    height: 40,
    backgroundColor: '#73BAE6',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20
  },
  primaryButtonText: {
    color: 'white',
    textAlign: 'center',
    fontSize: 22
  },
  successMessage: {
    fontSize: 20,
    color: '#73BAE6',
    marginTop: 15
  },
  errorMessage: {
    fontSize: 20,
    color: '#FF8C00',
    marginTop: 15
  },
  underline: {
    borderBottomColor: '#969696',
    borderBottomWidth: 1
  },
  title: {
    fontSize: 26,
    color: 'grey'
  },
  subtitle: {
    fontSize: 22,
    color: 'grey'
  },
  subtitleBlue: {
    fontSize: 22,
    color: '#5FCEFA'
  },
  categoryTitle: {
    fontSize: 16,
    color: '#969696'
  },
  categoryText: {
    fontSize: 16,
    color: '#696969'
  }
})
