import React, { Component } from 'react';
import { View, Text, ImageBackground, StyleSheet, ActivityIndicator, AsyncStorage } from 'react-native';

class AuthLoadingScreen extends Component {
  constructor() {
    super()

    // this.loadApp()
    this.loadApp = this.loadApp.bind(this)

  }

  componentDidMount() {
    console.log('componentDidMount in AuthLoadingScreen')

    this.loadApp();
    // this.willFocusSubscription = this.props.navigation.addListener(
    //   'willFocus',
    //   () => {
    //     this.loadApp();
    //   }
    // );
  }

  // componentWillUnmount() {
  //   this.willFocusSubscription();
  // }

  componentDidUpdate(prevProps) {
  console.log('componentDidUpdate called in AuthLoadingScreen ', this.props, prevProps)

  if (this.props.route.params !== prevProps.route.params) {
    console.log('load the app')
    this.loadApp()
  }
}

  loadApp = async() => {
    console.log('loadApp called')

    const userToken = await AsyncStorage.getItem('username')

    this.props.navigation.navigate(userToken? 'App' : 'Auth');
  }

  render() {
    return (
      <ImageBackground resizeMode='cover' source={{uri: 'https://www.guidedcompass.com/public-server/mobile-app/compass-launch-screen.png'}} style={styles.imageStyle}>
        <View style={styles.container}>
            <ActivityIndicator />
        </View>
      </ImageBackground>
    );
  }

}

export default AuthLoadingScreen;

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
  }
})
