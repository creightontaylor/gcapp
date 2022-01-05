import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

import SubMessages from './subcomponents/Messages';

class Messages extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount pathways')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email);

        let loadPage = true
        let newMessage = false

        let threadId = null
        let groupPost = null
        let generalPost = null
        let recipient = null

        if (this.props.route) {

          threadId = this.props.route.params.threadId
          groupPost = this.props.route.params.groupPost
          generalPost = this.props.route.params.generalPost
          recipient = this.props.route.params.recipient

          if (groupPost || generalPost) {
            newMessage = true
          }

        }

        this.setState({ threadId, groupPost, generalPost, recipient, loadPage, newMessage })
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  render() {
    return (
      <View>
      {(this.state.loadPage) && (
        <SubMessages navigation={this.props.navigation} groupPost={this.state.groupPost} generalPost={this.state.generalPost} newMessage={this.state.newMessage} recipient={this.state.recipient} />
      )}
      </View>
    )
  }
}

export default Messages;
