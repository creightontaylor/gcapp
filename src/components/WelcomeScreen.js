import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import Swiper from 'react-native-swiper';
//import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";
const styles = require('./css/style');

class WelcomeScreen extends Component {

  static navigationOptions = { header: null };

  componentDidMount() {
    console.log('componentDidMount called')
    /*
    let tracker = new GoogleAnalyticsTracker("UA-67259774-5");
    if (Platform.OS === 'ios') {
      tracker.trackScreenView("Welcome - ios");
    } else {
      tracker.trackScreenView("Welcome - android");
    }*/
  }

  render() {
    return (
      <ImageBackground resizeMode='cover' source={{uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/compass-mobile-background-image.png'}} style={[styles.absolutePosition,styles.absoluteTop0,styles.absoluteRight0,styles.absoluteBottom0,styles.absoluteLeft0]}>
        <View style={[styles.flex1,styles.flexCenter]}>
            <View style={[styles.alignCenter]}>
              <Image source={{uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/orgLogos/Compass-logo-words.png'}} style={[styles.width300,styles.height60,styles.contain]} />
              <Text style={[styles.whiteColor,styles.topMargin20,styles.bottomMargin200,styles.centerText,styles.horizontalMargin30,styles.descriptionText1]}>Your lifelong career advising and recruiting assistant</Text>
            </View>

            <View style={[styles.horizontalPadding30,styles.height200]}>
              <Swiper activeDotColor="#fff" dotColor="rgba(90,90,90,0.5)">
                <View style={[styles.flex1,styles.alignCenter,styles.transparentBackground]}>
                  <Text style={[styles.whiteColor,styles.boldText,styles.centerText,styles.bottomMargin,styles.headingText3]}>Build Your Supportive Community</Text>
                  <Text style={[styles.descriptionText2,styles.whiteColor,styles.centerText]}>
                    Connect with others, join accountability groups, attend career events, get feedback on projects, follow employers, and get support from Guided Compass staff.
                  </Text>
                </View>
                <View style={[styles.flex1,styles.alignCenter,styles.transparentBackground]}>
                  <Text style={[styles.whiteColor,styles.boldText,styles.centerText,styles.bottomMargin,styles.headingText3]}>Prepare For Your {"\n"}Best Life</Text>
                  <Text style={[styles.descriptionText2,styles.whiteColor,styles.centerText]}>
                    Set career goals, take career assessments, explore career paths, make financial plans, get personalized resources, get interview feedback, and submit projects for feedback.
                  </Text>
                </View>
                <View style={[styles.flex1,styles.alignCenter,styles.transparentBackground]}>
                  <Text style={[styles.whiteColor,styles.boldText,styles.centerText,styles.bottomMargin,styles.headingText3]}>Land Paid Work Opportunities</Text>
                  <Text style={[styles.descriptionText2,styles.whiteColor,styles.centerText]}>
                    Activities in your portal strengthen your candidacy, and make it easier to recommend you for specific opportunities. Import your profile to apply for paid work opportunities.
                  </Text>
                </View>
              </Swiper>
            </View>

            <View>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                <View style={[styles.btnPrimary,styles.whiteBackground,styles.flexCenter,styles.ctaBorder]}>
                  <Text style={[styles.standardText,styles.ctaColor]}>Get Started</Text>
                </View>
              </TouchableOpacity>
            </View>
            <View style={[styles.topMargin20]}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')}>
                <View>
                  <Text style={[styles.descriptionText1,styles.whiteColor,styles.centerText]}>Sign In</Text>
                </View>
              </TouchableOpacity>
            </View>
            {/*
            <View style={styles.rowContainer}>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('SignUp')}>
                <View style={styles.primaryButtonView}>
                  <Text style={styles.primaryButtonText}>Sign Up</Text>
                </View>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => this.props.navigation.navigate('SignIn')}>
                <View style={styles.secondaryButtonView}>
                  <Text style={styles.secondaryButtonText}>Sign In</Text>
                </View>
              </TouchableOpacity>
            </View>*/}
        </View>
      </ImageBackground>
    );
  }
}

export default WelcomeScreen;

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     alignItems: 'center',
//     justifyContent: 'center'
//   },
//   imageStyle: {
//     position: 'absolute',
//     top: 0,
//     left: 0,
//     bottom: 0,
//     right: 0,
//   },
//   logoStyle: {
//     width: 300,
//     height: 60,
//     resizeMode: 'contain'
//   },
//   subtitleStyle: {
//     color: 'white',
//     marginTop: 20,
//     marginBottom: 200,
//     textAlign: 'center'
//   },
//   primaryButtonView: {
//     width: 100,
//     height: 30,
//     backgroundColor: 'white',
//     borderRadius: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginRight: 10
//   },
//   primaryButtonText: {
//     color: 'black',
//     textAlign: 'center'
//   },
//   secondaryButtonView: {
//     width: 100,
//     height: 30,
//     backgroundColor: 'transparent',
//     borderWidth: 0.5,
//     borderColor: '#fff',
//     borderRadius: 15,
//     alignItems: 'center',
//     justifyContent: 'center',
//     marginLeft: 10
//   },
//   secondaryButtonText: {
//     color: 'white',
//     textAlign: 'center'
//   },
//   rowContainer: {
//     flexDirection: 'row'
//   },
//   swiperWrapper: {
//     width: 320,
//     height: 200
//   },
//   wrapper: {
//
//   },
//   slide1: {
//     flex: 1,
//     alignItems: 'center',
//     color: '#fff',
//     backgroundColor: 'transparent',
//   },
//   slide2: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//   },
//   slide3: {
//     flex: 1,
//     alignItems: 'center',
//     backgroundColor: 'transparent',
//   },
//   headerText: {
//     color: '#fff',
//     fontSize: 30,
//     fontWeight: 'bold',
//     textAlign: 'center',
//     marginBottom: 10
//   },
//   text: {
//     color: '#fff',
//     fontSize: 16,
//     textAlign: 'center'
//   }
// })
