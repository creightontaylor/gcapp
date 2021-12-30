import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';

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
      const cuFirstName = await AsyncStorage.getItem('firstName')
      const cuLastName = await AsyncStorage.getItem('lastName')

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email);

        AsyncStorage.setItem('unreadNotificationsCount', '0')
        //PushNotification.setApplicationIconBadgeNumber(0)
        this.props.navigation.setParams({ badgeNumber: 0 });

        //get data from server here
        Axios.get('https://www.guidedcompass.com/api/notifications', { params: { emailId: email, recipientType: 'Advisee' } })
        .then((response) => {
          console.log('Notifications query worked', response.data);

          if (response.data.success) {

            this.setState({ emailId: email, cuFirstName: cuFirstName, cuLastName: cuLastName,
              originalNotifications: response.data.notifications })

            this.formatNotifications(response.data.notifications)

            //this.setState({ notifications: response.data.notifications }))

          } else {
            console.log('no notifications data found', response.data.message)
          }

        }).catch((error) => {
            console.log('Notifications query did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  render() {
    return (
      <View>
        <Text>We're in messages!</Text>
      </View>
    )
  }
}

export default Messages;
