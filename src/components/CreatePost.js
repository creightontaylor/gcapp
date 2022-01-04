import React, { Component } from 'react';
import { View, Text, AsyncStorage } from 'react-native';
// import Axios from 'axios';
const styles = require('./css/style');

import SubCreatePost from './common/CreatePost';

class CreatePost extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount CreatePost')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')
      const pictureURL = await AsyncStorage.getItem('pictureURL')

      console.log('show me values in CreatePost', email, this.props);

      if (email !== null) {
        // We have data!!

        let category = null
        if (this.props) {
          // console.log('show params: ', this.props.route)

          // category = this.props.route.params.category
          this.setState({ pictureURL })

        }

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  passPosts() {
    console.log('passPosts called')
    this.props.navigation.goBack()
  }

  closeModal() {
    console.log('closeModal called')
    this.props.navigation.goBack()
  }

  render() {
    return (
      <View style={[styles.cardClearPadding,styles.padding40,styles.topMargin20,styles.horizontalMargin20]}>
        <SubCreatePost navigation={this.props.navigation} sharePosting={null} originalPost={null}  posts={[]} passPosts={this.passPosts} closeModal={this.closeModal} pictureURL={this.state.pictureURL} groupId={null} groupName={null}/>
      </View>
    )
  }
}

export default CreatePost;
