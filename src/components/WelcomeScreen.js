import React, { Component } from 'react';
import { View, Text, Image, ImageBackground, StyleSheet, ActivityIndicator, TouchableOpacity, Platform } from 'react-native';
import Swiper from 'react-native-swiper';
//import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";

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
      <ImageBackground resizeMode='cover' source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-mobile-background-image.png'}} style={styles.imageStyle}>
        <View style={styles.container}>
            <View>
              <Image source={{uri: 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/orgLogos/Compass-logo-words.png'}} style={styles.logoStyle} />
              <Text style={styles.subtitleStyle}>The Authority on Career Pathways</Text>
            </View>

            <View style={styles.swiperWrapper}>
              <Swiper style={styles.wrapper} activeDotColor="#fff" dotColor="rgba(90,90,90,0.5)">
                <View style={styles.slide1}>
                  <Text style={styles.headerText}>Get Career Recommendations</Text>
                  <Text style={styles.text}>
                    Get customized career recommendations based on your goals, interests, skills, and market opportunitites.
                  </Text>
                </View>
                <View style={styles.slide2}>
                  <Text style={styles.headerText}>Apply to Recommended Jobs</Text>
                  <Text style={styles.text}>
                    Compass serves you top job matches. Easily import assessment & endorsements to highlight your fit.
                  </Text>
                </View>
                <View style={styles.slide3}>
                  <Text style={styles.headerText}>Work with Career Advisors</Text>
                  <Text style={styles.text}>
                    Collect customized resources, feedback, and suggestions from career advisors, mentors, and counselors you trust.
                  </Text>
                </View>
              </Swiper>
            </View>
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
            </View>
        </View>
      </ImageBackground>
    );
  }
}

export default WelcomeScreen;

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
    width: 300,
    height: 60,
    resizeMode: 'contain'
  },
  subtitleStyle: {
    color: 'white',
    marginTop: 20,
    marginBottom: 200,
    textAlign: 'center'
  },
  primaryButtonView: {
    width: 100,
    height: 30,
    backgroundColor: 'white',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10
  },
  primaryButtonText: {
    color: 'black',
    textAlign: 'center'
  },
  secondaryButtonView: {
    width: 100,
    height: 30,
    backgroundColor: 'transparent',
    borderWidth: 0.5,
    borderColor: '#fff',
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 10
  },
  secondaryButtonText: {
    color: 'white',
    textAlign: 'center'
  },
  rowContainer: {
    flexDirection: 'row'
  },
  swiperWrapper: {
    width: 320,
    height: 200
  },
  wrapper: {

  },
  slide1: {
    flex: 1,
    alignItems: 'center',
    color: '#fff',
    backgroundColor: 'transparent',
  },
  slide2: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  slide3: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: 'transparent',
  },
  headerText: {
    color: '#fff',
    fontSize: 30,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10
  },
  text: {
    color: '#fff',
    fontSize: 16,
    textAlign: 'center'
  }
})
