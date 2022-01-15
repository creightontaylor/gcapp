import React, { Component } from 'react';
import { View, Text, TextInput, Image, ImageBackground, StyleSheet, ActivityIndicator,
  TouchableOpacity, AsyncStorage, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform, ScrollView} from 'react-native';
import Axios from 'axios';
//import PushNotification from 'react-native-push-notification';

//import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
//import { configurePushNotifications } from '../services/PushNotifications';
import LoginForm from './subcomponents/LoginForm';

class SignUpScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showModule: true,

      firstName: '',
      lastName: '',
      email: '',
      password: '',
      orgCode: '',

      organizations: ['bixel','any','emory'],

      isWaiting: false,
      errorMessage: ''
    }

    this.signUp = this.signUp.bind(this)
  }

  componentDidMount() {
    console.log('signUp Did Mount again');
    /*
    let tracker = new GoogleAnalyticsTracker("UA-67259774-5");
    if (Platform.OS === 'ios') {
      tracker.trackScreenView("SignUp - ios");
    } else {
      tracker.trackScreenView("SignUp - android");
    }*/
    //configurePushNotifications();

    let orgCode = null
    let opportunityId = null
    let opportunityOrg = null
    let fromExternal = null
    let roleName = null

    if (this.props.route && this.props.route.params) {
      // console.log('show params: ', this.props.route)

      orgCode = this.props.route.params.orgCode
      opportunityId = this.props.route.params.opportunityId
      opportunityOrg = this.props.route.params.opportunityOrg
      fromExternal = this.props.route.params.fromExternal
      roleName = this.props.route.params.roleName


    }

    this.setState({ orgCode, opportunityId,opportunityOrg,fromExternal,roleName})
  }

  signUp = async() => {
    console.log('signUp called')
    if (this.state.firstName === '') {
      this.setState({ errorMessage: 'please enter your first name' })
    } else if (this.state.lastName === '') {
      this.setState({ errorMessage: 'please enter your last name' })
    } else if (this.state.email === '') {
      this.setState({ errorMessage: 'please enter your email' })
    } else if (!this.state.email.includes('@')) {
      this.setState({ errorMessage: 'email invalid. please enter a valid email' })
    } else if (this.state.password === '') {
      this.setState({ errorMessage: 'please enter your password' })
    } else if (this.state.password.length < 7) {
      this.setState({ errorMessage: 'please enter a password over 6 characters' })
    } else if (this.state.orgCode !== '' && !this.state.organizations.includes(this.state.orgCode)) {
      this.setState({ errorMessage: 'that org code is not valid' })
    } else {
      /*
      PushNotification.localNotificationSchedule({
        //... You can use all the options from localNotifications
        message: "Thanks for joining Compass! What do you think? Call me: 323-620-9668 or email me: creighton@guidedcompass.com", // (required)
        date: new Date(Date.now() + (60 * 5000)) // in 5 min
      });*/

      this.setState({ isWaiting: true, errorMessage: '' })
      let firstName = this.state.firstName
      let lastName = this.state.lastName
      let email = this.state.email
      let password = this.state.password

      let orgCode = this.state.orgCode
      let myOrgs = [orgCode]
      let activeOrg = orgCode

      let username = firstName.toLowerCase() + lastName.toLowerCase()
      let createdAt = new Date(); //need to eventually make sure this is the first save
      let updatedAt = new Date();

      console.log('about to attempt signUp');

      Axios.post('https://www.guidedcompass.com/api/users/register', {
        firstName, lastName, email, password, username, createdAt, updatedAt,
        myOrgs, activeOrg, isAdvisor: false, platform: Platform.OS })
      .then((response) => {
        console.log('SignUp promise attempted');
          if (response.data.success) {
            //save values
            console.log('SignUp worked', response.data);

            this.setState({
              isWaiting: false
            })
            /*
            let tracker = new GoogleAnalyticsTracker("UA-67259774-5");
            if (Platform.OS === 'ios') {
              tracker.trackEvent("acquisition", "signedup - ios");
            } else {
              tracker.trackEvent("acquisition", "signedup - android");
            }*/

            console.log('setting variables in local storage')
            AsyncStorage.setItem('email', email)
            AsyncStorage.setItem('username', username)
            AsyncStorage.setItem('newUser', 'true')
            AsyncStorage.setItem('firstName', firstName)
            AsyncStorage.setItem('lastName', lastName)
            AsyncStorage.setItem('orgCode', orgCode)
            AsyncStorage.setItem('isAdvisor', 'false')
            AsyncStorage.setItem('myOrgs', JSON.stringify(myOrgs))
            AsyncStorage.setItem('activeOrg', activeOrg)

            console.log('variables are set in local storage')
            this.props.navigation.navigate('Walkthrough', { orgCode })

          } else {
            console.log('there was an error');
            this.setState({
              isWaiting: false,
              errorMessage: response.data.message,
            })
          }
      }).catch((error) => {
          console.log('SignUp send did not work', error);
      });
    }
  }

  render() {

    if (this.state.showModule) {
      return (
        <LoginForm roleName={this.state.roleName} opportunityId={this.state.opportunityId} opportunityOrg={this.state.opportunityOrg} orgCode={this.state.orgCode} courseId={this.state.courseId} fromExternal={this.state.fromExternal} navigation={this.props.navigation} type="SignUp" />
      )
    } else {
      return (

        <ImageBackground source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-mobile-background-image.png'}} style={{ width: '100%', height: '100%'}}>
        {/*<ImageBackground resizeMode='cover' source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-mobile-background-image.png'}} style={styles.imageStyle}>*/}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>

              <View style={styles.container}>

                <View style={{ height: 10 }}/>
                <Image source={{uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/orgLogos/Compass-logo-words.png'}} style={styles.logoStyle} />
                <Text style={styles.subtitleStyle}>Welcome to Guided Compass!</Text>
                <KeyboardAvoidingView style={styles.signUpContainer} behavior="padding">
                  <TextInput
                    style={styles.email}
                    onChangeText={(text) => this.setState({firstName: text})}
                    value={this.state.firstName}
                    placeholder="first name*"
                    placeholderTextColor="white"
                  />
                  <TextInput
                    style={styles.password}
                    onChangeText={(text) => this.setState({lastName: text})}
                    value={this.state.lastName}
                    placeholder="last name*"
                    placeholderTextColor="white"
                  />
                  <TextInput
                    style={styles.email}
                    onChangeText={(text) => this.setState({email: text})}
                    value={this.state.email}
                    autoCapitalize="none"
                    placeholder="email*"
                    placeholderTextColor="white"
                  />
                  <TextInput
                    style={styles.password}
                    onChangeText={(text) => this.setState({password: text})}
                    value={this.state.password}
                    autoCapitalize="none"
                    placeholder="password*"
                    placeholderTextColor="white"
                    secureTextEntry={true}
                  />

                  <TextInput
                    style={styles.email}
                    onChangeText={(text) => this.setState({orgCode: text.toLowerCase()})}
                    value={this.state.orgCode}
                    autoCapitalize="none"
                    placeholder="add an org code (optional)"
                    placeholderTextColor="white"
                    secureTextEntry={true}
                  />
                  { (this.state.errorMessage !== '') && (
                    <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
                  )}
                  <TouchableOpacity onPress={this.signUp}>
                    <View style={styles.primaryButtonView}>
                      <Text style={styles.primaryButtonText}>Sign Up</Text>
                    </View>
                  </TouchableOpacity>
                </KeyboardAvoidingView>

              </View>

          </TouchableWithoutFeedback>
        </ImageBackground>

      );
    }
    }
}

export default SignUpScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center'
  },
  imageStyle: {
    position: 'absolute',
    top: 0,
    left: 0,
    bottom: 0,
    right: 0,
  },
  logoStyle: {
    width: 250,
    height: 50,
    resizeMode: 'contain'
  },
  signUpContainer: {
    alignItems: 'center'
  },
  subtitleStyle: {
    color: 'white',
    marginTop: 20,
    marginBottom: 200,
    fontSize: 26
  },
  email: {
    backgroundColor: 'transparent',
    height: 40,
    width: 240,
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
    fontSize: 20
  },
  password: {
    backgroundColor: 'transparent',
    height: 40,
    width: 240,
    marginTop: 15,
    borderBottomWidth: 1,
    borderBottomColor: 'white',
    color: 'white',
    fontSize: 20
  },
  primaryButtonView: {
    width: 120,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30
  },
  primaryButtonText: {
    color: 'black',
    textAlign: 'center'
  },
  errorMessage: {
    fontSize: 20,
    color: '#FF8C00',
    marginTop: 15
  }
})
