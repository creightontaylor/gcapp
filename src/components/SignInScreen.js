import React, { Component } from 'react';
import { View, Text, TextInput, Image, ImageBackground, StyleSheet, ActivityIndicator,
  TouchableOpacity, AsyncStorage, TouchableWithoutFeedback, Keyboard, KeyboardAvoidingView, Platform } from 'react-native';
import Axios from 'axios';
//import PushNotification from 'react-native-push-notification';
import Icon from 'react-native-vector-icons/Ionicons'
//import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";

class SignInScreen extends Component {
  constructor(props) {
    super(props)
    this.state = {
        email: '',
        password: '',
        isWaiting: false,
        errorMessage: ''
    }

    this.signIn = this.signIn.bind(this)
  }

  //static navigationOptions = { header: null };
  static navigationOptions = ({ navigation }) => {
    return {
      headerTitle: <Text style={{color: 'white', fontSize: 18}}> </Text>,
      headerTransparent: true,
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
            <Icon name={'ios-arrow-back'} size={25} color='white' />
          </View>
        </TouchableOpacity>
      ),
    }
  }

  componentDidMount() {
    console.log('componentDidMount called')
    /*
    let tracker = new GoogleAnalyticsTracker("UA-67259774-5");
    if (Platform.OS === 'ios') {
      tracker.trackScreenView("SignIn - ios");
    } else {
      tracker.trackScreenView("SignIn - android");
    }*/
  }

  signIn = async() => {
    console.log('signIn called')
    if (this.state.email === '') {
      this.setState({ errorMessage: 'please enter your email' })
    } else if (this.state.password === '') {
      this.setState({ errorMessage: 'please enter your password' })
    } else {

      this.setState({ isWaiting: true, errorMessage: '' })
      let email = this.state.email
      let password = this.state.password

      console.log('about to attempt signin');

      Axios.post('https://www.guidedcompass.com/api/users/login', {
        email, password })
      .then((response) => {
        console.log('SignIn promise attempted');
          if (response.data.success) {
            //save values
            console.log('Signin worked', response.data.user.username, response.data);

            this.setState({
              isWaiting: false
            })
            /*
            let tracker = new GoogleAnalyticsTracker("UA-67259774-5");
            if (Platform.OS === 'ios') {
              tracker.trackEvent("retention", "signedin - ios");
            } else {
              tracker.trackEvent("retention", "signedin - android");
            }*/

            AsyncStorage.setItem('email', email)
            AsyncStorage.setItem('username', response.data.user.username)
            AsyncStorage.setItem('firstName', response.data.user.firstName)
            AsyncStorage.setItem('lastName', response.data.user.lastName)
            if ( response.data.user.isAdvisor === true ) {
              AsyncStorage.setItem('isAdvisor', 'true')
            } else {
              AsyncStorage.setItem('isAdvisor', 'false')
            }
            AsyncStorage.setItem('newUser', 'false')
            if (response.data.user.myOrgs) {
              AsyncStorage.setItem('myOrgs', JSON.stringify(response.data.user.myOrgs))
            }
            if (response.data.user.activeOrg) {
              AsyncStorage.setItem('activeOrg', response.data.user.activeOrg)
            }

            if (response.data.user.activeOrgWorkId) {
              AsyncStorage.setItem('activeOrgWorkId', response.data.user.activeOrgWorkId)
            } else {
              AsyncStorage.setItem('activeOrgWorkId', '')
            }

            if (response.data.user.orgName) {
              AsyncStorage.setItem('orgName', response.data.user.orgName)
            } else {
              AsyncStorage.setItem('orgName', '')
            }

            if (response.data.user.orgLogoURI) {
              AsyncStorage.setItem('orgLogoURI', response.data.user.orgLogoURI)
            } else {
              AsyncStorage.setItem('orgLogoURI', '')
            }

            Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: response.data.user.activeOrg } })
            .then((response) => {
              console.log('Org info query attempted', response.data);

              if (response.data.success) {
                console.log('org info query worked')

                let orgName = ''
                if (response.data.orgInfo.orgName) {
                  orgName = response.data.orgInfo.orgName
                  AsyncStorage.setItem('orgName', orgName)
                }

                let orgProgramName = ''
                if (response.data.orgInfo.orgProgramName) {
                  orgProgramName = response.data.orgInfo.orgProgramName
                  AsyncStorage.setItem('orgProgramName', orgProgramName)
                }

                let activeOrgWorkId = ''
                if (response.data.orgInfo.activeOrgWorkId) {
                  activeOrgWorkId = response.data.orgInfo.activeOrgWorkId
                  AsyncStorage.setItem('activeOrgWorkId', activeOrgWorkId)
                }

                let orgLogoURI = ''
                if (response.data.orgInfo.mobileLogoURI) {
                  orgLogoURI = response.data.orgInfo.mobileLogoURI
                  AsyncStorage.setItem('orgLogoURI', orgLogoURI)
                }

                let orgFocus = 'Placement'
                if (response.data.orgInfo.orgFocus) {
                  orgFocus = response.data.orgInfo.orgFocus
                  AsyncStorage.setItem('orgFocus', response.data.orgInfo.orgFocus)
                }

              } else {
                console.log('org info query did not work', response.data.message)
              }

            }).catch((error) => {
                console.log('Org info query did not work for some reason', error);
            });

            this.props.navigation.navigate('App')

          } else {
            console.log('there was an error', response.data.message);

            this.setState({
              isWaiting: false,
              errorMessage: response.data.message,
            })
          }
      }).catch((error) => {
          console.log('Signin send did not work', error);
      });
    }
  }

  render() {
    return (
      <ImageBackground resizeMode='cover' source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-mobile-background-image.png'}} style={styles.imageStyle}>
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <View style={styles.container}>
            <Image source={{uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/orgLogos/Compass-logo-words.png'}} style={styles.logoStyle} />
            <Text style={styles.subtitleStyle}>Welcome Back!</Text>
            <KeyboardAvoidingView style={styles.signInContainer} behavior="padding">
              <TextInput
                style={styles.email}
                onChangeText={(text) => this.setState({email: text})}
                value={this.state.email}
                autoCapitalize="none"
                placeholder="email"
                placeholderTextColor="white"
              />
              <TextInput
                style={styles.password}
                onChangeText={(text) => this.setState({password: text})}
                value={this.state.password}
                autoCapitalize="none"
                placeholder="password"
                placeholderTextColor="white"
                secureTextEntry={true}
              />
              { (this.state.errorMessage !== '') && (
                <Text style={styles.errorMessage}>{this.state.errorMessage}</Text>
              )}
              <TouchableOpacity onPress={this.signIn}>
                <View style={styles.primaryButtonView}>
                  <Text style={styles.primaryButtonText}>Sign In</Text>
                </View>
              </TouchableOpacity>
            </KeyboardAvoidingView>
          </View>
        </TouchableWithoutFeedback>
      </ImageBackground>
    );
  }
}

export default SignInScreen;

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
  signInContainer: {
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
