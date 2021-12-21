import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont()

class Opportunities extends Component {
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
      <View style={styles.tableView}>
        <Text>We're in opportunities!!!</Text>
      </View>
    )
  }
}

export default Opportunities;

const styles = {
  tableView: {
    borderWidth: 1,
    borderRadius: 2,
    borderColor: '#ddd',
    borderBottomWidth: 0,
    shadowColor: '#000',
    shadowOffset: { width: 10, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
    backgroundColor: 'white',
    marginTop: 20,
    marginLeft: 20,
    marginRight: 20
  },
  tableViewCell: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 15,
    flexDirection: 'row'
  },
  tableViewCellIconContainer: {
    flex: 15,
    paddingRight: 10
  },
  tableViewCellIcon: {
    width: 50,
    height: 50,
    padding: 5
  },
  tableViewCellTextContainer: {
    flex: 75,
    paddingRight: 10
  },
  tableViewCellTitleContainer: {
    flex: 2,
    paddingBottom: 10,
    marginBottom: -12
  },
  tableViewCellTitle: {
    fontSize: 18
  },
  tableViewCellSubtitleContainer: {
    flex: 1,
  },
  tableViewCellSubtitle: {
    fontSize: 14
  },
  tableViewCellCTAContainer: {
    flex: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableViewCellCTA1container: {
    width: 20,
    height: 20,
    marginBottom: -5
  },
  tableViewCellCTA2Container: {
    width: 20,
    height: 20,
    marginTop: -10
  },
  successMessage: {
    fontSize: 20,
    color: '#73BAE6',
    marginTop: 15
  },
  errorMessage: {
    fontSize: 20,
    color: '#FF8C00',
    marginTop: 15
  },
};
