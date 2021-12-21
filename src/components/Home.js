import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform } from 'react-native';
import { Card, CardSection } from './common';
import Axios from 'axios';
//import PushNotification from 'react-native-push-notification';
//import { configurePushNotifications } from '../services/PushNotifications';
import Icon from 'react-native-vector-icons/Ionicons';
//import { GoogleAnalyticsTracker } from "react-native-google-analytics-bridge";

Icon.loadFont()

class Home extends Component {
  constructor(props) {
    super(props)
    this.state = {
        futureData: null,
        badgeNumber: 2
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.segueToDetails = this.segueToDetails.bind(this)
    this.countUnreadNotifications = this.countUnreadNotifications.bind(this)

  }

  static navigationOptions = ({ navigation }) => {

    return {
      headerTitle: 'Trends'
    }
  }
  //static navigationOptions = { header: null }
  /*
  //static navigationOptions = { headerLeft: null };
  static navigationOptions = ({ navigation }) => {

    const { state } = navigation
    const { newHeaderIcon } = "params" in state && state.params

    return {
      headerRight: newHeaderIcon && newHeaderIcon()
    }
  }

  static navigationOptions = {
    headerTitle: 'hello'
  };*/

  /*
  static navigationOptions = ({ navigation }) => {
    const { params } = navigation.state;
    return params;
  };*/



  componentDidMount() {
    console.log('home component did mount');
    /*
    let tracker = new GoogleAnalyticsTracker("UA-67259774-5");
    if (Platform.OS === 'ios') {
      tracker.trackScreenView("Trends - ios");
    } else {
      tracker.trackScreenView("Trends - android");
    }*/
    //setTimeout(this.setParam, 0);

    /*
    <TouchableOpacity onPress={() => {navigation.navigate('Notifications')} } >
      <View style={styles.navContainer}>
        { (this.state.badgeNumber === 0) ? (
          <View style={styles.badgeAndIconView}>
            <Icon name={'ios-notifications-outline'} size={26} color="#fff" />
          </View>
        ) : (
          <View style={styles.badgeAndIconView}>
            <View style={styles.badgeView}>
              <Text style={styles.badgeText}>2</Text>
            </View>
            <Icon name={'ios-notifications-outline'} size={26} color="#fff" />
          </View>
        )}
      </View>
    </TouchableOpacity>
    */

    Axios.get('https://www.guidedcompass.com/api/future/data')
    .then((response) => {
    console.log('Future data request worked!', response.data.categories, response.data.categories[4].values[0].pay.replace(",000","K"));

      if (response.data.success) {

        this.setState({
            futureData: response.data.categories,
        })

      } else {
        console.log('there was an error:', response.data.message);
      }

    });

    this.retrieveData()

  }

  countUnreadNotifications(notifications) {
    console.log('countUnreadNotifications called')
    let unreadNotificationsCount = 0;

    for (let i = 1; i <= notifications.length; i++) {
      console.log(i);

      if (notifications[i - 1].isRead === false) {
        unreadNotificationsCount = unreadNotificationsCount + 1
      }
    }

    AsyncStorage.setItem('unreadNotificationsCount', unreadNotificationsCount.toString())
    //PushNotification.setApplicationIconBadgeNumber(unreadNotificationsCount)
    this.props.navigation.setParams({ badgeNumber: unreadNotificationsCount });
  }

  setParam = () => {
    this.props.navigation.setParams({
      badgeNumber: 5
     });

      console.log('props', this.props.navigation);
  };

  retrieveData = async() => {
    try {

      console.log('are is this causing the error?')
      //testing badges

      console.log('this is causing the error')
      const email = await AsyncStorage.getItem('email')
      //const email = 'harry@potter.com'
      this.setState({ emailId: email })

      const newUser = await AsyncStorage.getItem('newUser')
      if (newUser === 'true') {
        //show walkthroughs, tutorials, and ask for push notification permissions
        console.log('maybe?')
        //ask for push notification permissions
        //configurePushNotifications();

        let notiCount = 1
        AsyncStorage.setItem('unreadNotificationsCount', notiCount.toString())
        this.props.navigation.setParams({ badgeNumber: notiCount });
        PushNotification.setApplicationIconBadgeNumber(notiCount)

        AsyncStorage.setItem('newUser', 'false')

        const takeAssessment = await AsyncStorage.getItem('takeAssessment')
        if (takeAssessment === 'true') {
          this.props.navigation.navigate('InterestAssessment', {
            shortAssessment: false
          });
        }
      }

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email);
        /*
        Axios.get('https://www.guidedcompass.com/api/pathways/plan', { params: { emailId: email } })
        .then((response) => {
          console.log('Pathways query worked', response.data);

          if (response.data.success) {

            this.setState({
              pathwayValue: response.data.planData.pathway,
              goalValue: response.data.planData.goal,
              whyGoalValue: response.data.planData.fuel,
              planValue: response.data.planData.plan,
              lifestyleValue: response.data.planData.lifestyle,
            })
          } else {
            console.log('no pathways data found', response.data.message)
          }

        }).catch((error) => {
            console.log('Pathways query did not work', error);
        });*/

        Axios.get('https://www.guidedcompass.com/api/notifications', { params: { emailId: email, recipientType: 'Advisee' } })
        .then((response) => {
          console.log('Notifications query worked', response.data);

            if (response.data.success) {

              this.setState({ notifications: response.data.notifications })
              this.countUnreadNotifications(response.data.notifications)

            } else {
              console.log('no pathways data found', response.data.message)
            }

          }).catch((error) => {
              console.log('Pathways query did not work', error);
          });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error')
     }
  }

  segueToDetails(data, index) {
    console.log('button pressed');

    this.props.navigation.navigate('FutureDetails', {
      data, index
    })

  }

  render() {
    return (
      <ScrollView>
        <View>
          <Text>We're in Home!!!</Text>
        </View>
      </ScrollView>
    );
  }

}

export default Home;

var styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight:'bold',
  },
  sourceText: {
    fontSize: 14
  },
  baseText: {
    fontSize: 14,
    marginBottom: 20
  },
  baseValues: {
    fontSize: 14,
    marginBottom: 20,
    textAlign: 'right'
  },
  textWrapper: {
    flexWrap: 'wrap',
    width: '100%'
  },
  seeAllStyling: {
    textAlign: 'right',
    height: 60,
  },
  listContainer: {
    flexDirection: 'row'
  },
  listTitlesContainer: {
    flex: 0.8
  },
  listValuesContainer: {
    flex: 0.2
  },
  navContainer: {
    marginLeft: 20,
    marginRight: 20
  },
  badgeAndIconView:{
      position:'relative',
      padding:5,
      alignItems: 'center',
      justifyContent: 'center'
  },
  badgeView: {
    alignItems: 'center',
    justifyContent: 'center',
    position:'absolute',
    zIndex:10,
    top:1,
    right:1,
    padding:1,
    backgroundColor:'#E67650',
    width: 16,
    height: 16,
    borderRadius:8,
    borderWidth: 1,
    borderColor: 'transparent',
    overflow: 'hidden'

  },
  badgeText:{
    color:'#fff',
    fontSize: 11
  }
})
