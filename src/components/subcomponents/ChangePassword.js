import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

class ChangePassword extends Component {
  constructor(props) {
    super(props)
    this.state = {
      oldPassword: '',
      newPassword: '',
      repeatedPassword: '',

      successMessage: '',
      errorMessage: ''
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.savePassword = this.savePassword.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ', this.props.activeOrg, prevProps)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode || this.props.roleName !== prevProps.roleName) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      // console.log('this is causing the error')
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
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler(eventName,eventValue) {
    console.log('formChangeHandler called')

    if (eventName === 'oldPassword') {
      this.setState({ oldPassword: eventValue })
    } else if (eventName === 'newPassword') {
      this.setState({ newPassword: eventValue })
    } else if (eventName === 'repeatedPassword') {

      if (this.state.newPassword !== '' && eventValue === this.state.newPassword) {
        this.setState({ repeatedPassword: eventValue, successMessage: 'New passwords match', errorMessage: '' })
      } else if (this.state.newPassword !== '') {
        this.setState({ repeatedPassword: eventValue, successMessage: '', errorMessage: 'New passwords do not match' })
      } else {
        this.setState({ repeatedPassword: eventValue })
      }
    }

  }

  savePassword() {
    console.log('called savePassword')

    this.setState({
      successMessage: '',
      errorMessage: ''
    })

    const oldPassword = this.state.oldPassword
    const newPassword = this.state.newPassword
    const repeatedPassword = this.state.repeatedPassword
    const emailId = this.state.emailId

    if (oldPassword === '') {
      this.setState({ errorMessage: 'Please enter your old password' })
    } else if (newPassword === '') {
      this.setState({ errorMessage: 'Please enter your new password' })
    } else if (repeatedPassword === '') {
      this.setState({ errorMessage: 'Please repeat your new password' })
    } else if (newPassword !== repeatedPassword) {
      this.setState({ errorMessage: 'Your new passwords dont match. Please double check.' })
    } else if (newPassword.length < 7) {
      this.setState({ errorMessage: 'please enter a password over 6 characters' })
    } else {

      Axios.post('https://www.guidedcompass.com/api/users/password/change', {
        emailId, oldPassword, newPassword
      })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Password changed successfully worked', response.data);

          this.setState({ successMessage: 'Password changed successfully!' })

        } else {
          console.log('request was not successful', response.data.message)
          this.setState({ errorMessage: response.data.message })
        }

      }).catch((error) => {
          console.log('Password change did not work', error);
          this.setState({ errorMessage: error })
      });
    }
  }

  render() {

      return (
          <ScrollView>

              <View style={[styles.card,styles.topMargin20]}>
                  <Text style={[styles.headingText2,styles.row10]}>Change Password</Text>
                  <View style={[styles.spacer]}/>

                  <View style={[styles.row10]}>
                    <Text style={[styles.row10,styles.standardText]}>Current Password</Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.formChangeHandler("oldPassword", text)}
                      value={this.state.oldPassword}
                      placeholder="Enter current password"
                      placeholderTextColor="grey"
                      secureTextEntry={true}
                    />
                  </View>

                  <View style={[styles.row10]}>
                    <Text style={[styles.row10,styles.standardText]}>New Password</Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.formChangeHandler("newPassword", text)}
                      value={this.state.newPassword}
                      placeholder="Enter new Password"
                      placeholderTextColor="grey"
                      secureTextEntry={true}
                    />
                  </View>

                  <View style={[styles.row10]}>
                    <Text style={[styles.row10,styles.standardText]}>Confirm New Password</Text>
                    <TextInput
                      style={styles.textInput}
                      onChangeText={(text) => this.formChangeHandler("repeatedPassword", text)}
                      value={this.state.repeatedPassword}
                      placeholder="Repeat new password"
                      placeholderTextColor="grey"
                      secureTextEntry={true}
                    />
                  </View>

                  <View style={[styles.spacer]}/><View style={[styles.spacer]}/>

                  <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.savePassword()}><Text style={[styles.standardText,styles.whiteColor]}>Save New Password</Text></TouchableOpacity>
                  { (this.state.successMessage !== '') && (
                    <Text style={[styles.ctaColor]}>{this.state.successMessage}</Text>
                  )}

                  { (this.state.errorMessage !== '') && (
                    <Text style={[styles.ctaColor]}>{this.state.errorMessage}</Text>
                  )}
              </View>
          </ScrollView>

      )
  }

}

export default ChangePassword;
