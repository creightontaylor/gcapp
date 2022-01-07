import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Image, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png'
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png'

class RenderMyGroups extends Component {
    constructor(props) {
      super(props)
      this.state = {
      }

      this.retrieveData = this.retrieveData.bind(this)
      this.confirmDelete = this.confirmDelete.bind(this)
      this.leaveGroup = this.leaveGroup.bind(this)

    }

    componentDidMount() {
      console.log('componentDidMount called')

      this.retrieveData()

    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in RenderMyGroups', this.props.groups)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
        console.log('a0 will update')
        this.retrieveData()
      } else if (this.props.groups !== prevProps.groups) {
        console.log('a1 will update')
        this.retrieveData()
      } else if (this.props.groups && prevProps.groups) {
        console.log('a2 will update', this.props.groups.length, prevProps.groups.length)
        if (this.props.groups.length !== prevProps.groups.length) {
          console.log('a5 will update')
          this.retrieveData()
        }
      } else if (this.props.passedCategory !== prevProps.passedCategory) {
        console.log('a3 will update')
        this.retrieveData()
      } else {
        console.log('a4 wont update')
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
        let orgName = await AsyncStorage.getItem('orgName');
        if (this.props.orgName && !orgName) {
          orgName = this.props.orgName
        }

        const groups = this.props.groups

        this.setState({ emailId, username, cuFirstName, cuLastName, pictureURL, activeOrg, orgFocus, orgName,
          groups
        })

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    confirmDelete(index,confirm) {
      console.log('confirmDelete called')

      let groups = this.state.groups
      if (confirm) {
        groups[index]['confirmDelete'] = true
      } else {
        groups[index]['confirmDelete'] = false
      }

      this.setState({ groups })
    }

    leaveGroup(index) {
      console.log('leaveGroup called')

      this.setState({ errorMessage: null, successMessage: null, isSaving: true })

      let groupId = this.state.groups[index]._id
      const emailId = this.state.emalId
      const member = { email: this.state.emailId }
      const leaveGroup = true

      Axios.post('https://www.guidedcompass.com/api/groups/save', { groupId, emailId, member, leaveGroup })
      .then((response) => {
        console.log('attempting to save addition to groups')
        if (response.data.success) {
          console.log('saved addition to groups', response.data)

          let groups = this.state.groups
          groups.splice(index,1)

          this.setState({ successMessage: 'Saved changes', groups, isSaving: false })

        } else {
          console.log('did not save successfully')
          this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({ errorMessage: 'there was an error saving groups', isSaving: false})
      });
    }

    render() {

      return (
          <View>
            {(this.state.groups && this.state.groups.length > 0) && (
              <View style={[styles.row20]}>
                {this.state.groups.map((item, index) =>
                  <View key={index}>
                    {((!this.props.passedCategory) || (this.props.passedCategory === 'Accountability' && item.category === 'Accountability')) && (
                      <View style={[styles.topMargin,styles.rowDirection]}>
                        <View style={[styles.width90]}>
                          <Image source={(item.pictureURL) ? { uri: item.pictureURL} : { uri: "https://guidedcompass-bucket.s3-us-west-2.amazonaws.com/headerImages/1210x311.png"}} style={[styles.square70,styles.contain]}  />
                        </View>
                        <View style={[styles.calcColumn230]}>
                          <Text style={[styles.headingText5]}>{item.name}</Text>
                          <Text style={[styles.descriptionText1,styles.topPadding5]}>{item.category} | {(item.category === 'Accountability') ? item.members.length + ' / 6' : item.memberCount} Members</Text>
                          <View style={[styles.topMargin,styles.rowDirection]}>
                            <View style={[styles.rightPadding]}>
                              <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                              <Image source={{ uri: checkmarkIcon}} style={[styles.square12,styles.contain]} />
                            </View>
                            <View>
                              <Text style={[styles.descriptionText2]}>Joined</Text>
                            </View>

                          </View>
                        </View>
                        <View style={[styles.width80,styles.alignEnd]}>
                          {(item.confirmDelete) ? (
                            <View>
                              <Text style={[styles.descriptionText1,styles.rightText]}>You sure?</Text>
                              <TouchableOpacity style={[styles.btnSquarish,styles.errorBackgroundColor,styles.topMargin,styles.flexCenter]} onPress={() => this.leaveGroup(index)}><Text style={[styles.descriptionText1,styles.whiteColor]}>Leave</Text></TouchableOpacity>
                              <TouchableOpacity style={[styles.btnSquarish,styles.topMargin,styles.flexCenter]} onPress={() => this.confirmDelete(index,false)}><Text style={[styles.descriptionText1,styles.ctaColor]}>Cancel</Text></TouchableOpacity>
                            </View>
                          ) : (
                            <TouchableOpacity onPress={() => this.confirmDelete(index,true)}>
                              <View style={[styles.padding10,styles.standardBorder, { borderRadius: 17.5 }]}>
                                <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]}  />
                              </View>
                            </TouchableOpacity>
                          )}
                        </View>

                      </View>
                    )}
                  </View>
                )}

                {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.errorColor,styles.row5]}>{this.state.errorMessage}</Text>}
                {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.errorColor,styles.row5]}>{this.state.successMessage}</Text>}

              </View>
            )}
          </View>

      )
    }
}

export default RenderMyGroups
