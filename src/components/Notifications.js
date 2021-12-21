import React, { Component } from 'react';
import { View, Text, TextInput, FlatList, TouchableOpacity, AsyncStorage } from 'react-native';
import Axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont()

class Notifications extends Component {
  constructor(props) {
    super(props)
    this.state = {
      selectedIndex: 0,
      originalNotifications: null,
      notifications: [{ showChevron: false, showCTAs: false, icon: null, title: 'Welcome to Guided Compass!', subtitle: 'Guided Compass allows you take career assessments, receive skill endorsements, receive career and job recommendations, and apply directly for jobs.' }],
      advisors: [],
      emailId: '',
      cuFirstName: '',
      cuLastName: '',

      serverPostSuccess: false,
      serverErrorMessage: '',
      serverSuccessMessage: ''
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formatNotifications = this.formatNotifications.bind(this)
    this.renderTableViewCells = this.renderTableViewCells.bind(this)
    this.rowTapped = this.rowTapped.bind(this)

    this.retrieveAdvisors = this.retrieveAdvisors.bind(this)
    this.retrieveSession = this.retrieveSession.bind(this)
    this.retrieveChecklist = this.retrieveChecklist.bind(this)
    this.retrieveResource = this.retrieveResource.bind(this)

    this.acceptRequest = this.acceptRequest.bind(this)
    this.denyRequest = this.denyRequest.bind(this)
    this.updateRequestStatus = this.updateRequestStatus.bind(this)
  }

  static navigationOptions = ({ navigation }) => {

    return {
      headerLeft: (
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
            <Icon name={'ios-arrow-back'} size={25} color='white' />
          </View>
        </TouchableOpacity>
      ),
    }
  }

  acceptRequest(index) {
    console.log('acceptRequest', index)
    this.updateRequestStatus(index, 'accept')
  }

  denyRequest(index) {
    console.log('denyRequest', index)
    this.updateRequestStatus(index, 'deny')

  }

  updateRequestStatus(index, decision) {
    console.log('updateRequestStatus called', this.state.notifications[index])

    Axios.put('https://www.guidedcompass.com/api/partner/request', {
      emailId: this.state.emailId, recipientFirstName: this.state.cuFirstName, recipientLastName: this.state.cuLastName,
      request: this.state.originalNotifications[index - 1], decision: decision
    }).then((response) => {

        if (response.data.success) {
          console.log('Request status updated', response.data.message);

          let notifications = this.state.notifications
          notifications.splice(index, 1)
          /*
          if ( decision === 'accept' ) {
            notifications[index].showChevron = true
            notifications[index].subtitle = 'You accepted this request'
          } else {
            notifications[index].showChevron = false
            notifications[index].subtitle = 'You denied this request'
          }

          this.setState({
            notifications: notifications,

            serverPostSuccess: true,
            serverPostSuccess: response.data.message
          })*/

        } else {
          console.log('Request status update failed', response.data)
          this.setState({
            serverPostSuccess: false,
            serverErrorMessage: response.data.message,
          })
        }

    }).catch((error) => {
        console.log('Request status update failed', error)

    });
  }

  rowTapped(notification) {
    console.log('called rowTapped', notification)

    //do stuff when row is tapped
    if (notification.type === 'Session Added') {
      //send session with segue
      let advisors = this.retrieveAdvisors(false)
      let session = this.retrieveSession(notification.objectId, 'EditSession')

    } else if (notification.type === 'Session Edited') {
      //send session with segue
      let advisors = this.retrieveAdvisors(false)
      let session = this.retrieveSession(notification.objectId, 'EditSession')

    } else if (notification.type === 'Checklist Assigned') {
      //send checklist with segue
      let advisors = this.retrieveAdvisors(false)
      let checklist = this.retrieveChecklist(notification.objectId, 'EditChecklist')

    } else if (notification.type === 'Resource Received') {
      //send resource with segue
      let advisors = this.retrieveAdvisors(false)
      let resource = this.retrieveResource(notification.objectId, 'ViewResource')

    } else if (notification.type === 'Advisee Request' && notification.showChevron === true) {
      let advisors = this.retrieveAdvisors(true)
    } //more to come
  }

  retrieveAdvisors = async(navigateOnSuccess) => {
    console.log('retrieveAdvisors called')

    Axios.get('https://www.guidedcompass.com/api/partner/advisors', { params: { emailId: this.state.emailId } })
    .then((response) => {

        if (response.data.success) {
          console.log('Advisor query worked', response.data);

          let advisors = response.data.advisors
          advisors.unshift({
            iconName: 'ios-done-all',
            firstName: 'All'
          })
          advisors.push({
            iconName: 'ios-add-circle-outline',
            firstName: 'Add'
          })

          if (navigateOnSuccess) {
            this.props.navigation.navigate('Advising', {
              advisors: response.data.advisors
            })
          } else {
            this.setState({ advisors })
          }


        } else {
          console.log('no advisors found', response.data.message)

          let advisors = [{ iconName: 'ios-add-circle-outline', firstName: 'Add' }]
          this.setState({ advisors })
        }

    }).catch((error) => {
        console.log('Advisor query did not work', error);
        let advisors = [{ iconName: 'ios-add-circle-outline', firstName: 'Add' }]
        this.setState({ advisors })
    });
  }

  retrieveSession = async(sessionId, route) => {
    console.log('retrieveSession called', sessionId)

    Axios.get('https://www.guidedcompass.com/api/counseling/session/' + sessionId)
    .then((response) => {

        if (response.data.success) {
          console.log('Session query worked', response.data);

          this.props.navigation.navigate(route, {
            advisors: this.state.advisors, session: response.data.session
          })

        } else {
          console.log('no session data found', response.data.message)
          this.props.navigation.navigate(route, {
            advisors: this.state.advisors, session: {}
          })
        }

    }).catch((error) => {
        console.log('Session query did not work', error);
        this.props.navigation.navigate(route, {
          advisors: this.state.advisors, session: {}
        })
    });
  }

  retrieveChecklist = async(checklistId, route) => {
    console.log('retrieveChecklist called', checklistId)

    //pull received checklists
    Axios.get('https://www.guidedcompass.com/api/checklists/' + checklistId)
    .then((response) => {

        if (response.data.success) {
          console.log('Checklists received query worked', response.data);

          this.props.navigation.navigate(route, {
            advisors: this.state.advisors, selectedChecklist: response.data.checklist
          })

        } else {
          console.log('no checklist data found', response.data.message)
          this.props.navigation.navigate(route, {
            advisors: this.state.advisors, selectedChecklist: {}
          })
        }

    }).catch((error) => {
        console.log('Checklist query did not work', error);
        this.props.navigation.navigate(route, {
          advisors: this.state.advisors, selectedChecklist: {}
        })
    });
  }

  retrieveResource = async(resourceId, route) =>  {
    console.log('retrieveResource called', resourceId)

    //pull received resources
    Axios.get('https://www.guidedcompass.com/api/resources/' + resourceId)
    .then((response) => {

        if (response.data.success) {
          console.log('Resources received query worked', response.data);

          this.props.navigation.navigate(route, {
            advisors: this.state.advisors, selectedResource: response.data.resource
          })

        } else {
          console.log('no resource data found', response.data.message)
          this.props.navigation.navigate(route, {
            advisors: this.state.advisors, selectedResource: {}
          })
        }

    }).catch((error) => {
        console.log('Resource query did not work', error);
        this.props.navigation.navigate(route, {
          advisors: this.state.advisors, selectedResource: {}
        })
    });
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

  formatNotifications(notifications) {
    console.log('formatNotifications called')

    let formattedNotifications = [];
    let unreadNotificationIds = [];

    for (let i = 1; i <= notifications.length; i++) {
      console.log(i);

      if (notifications[i - 1].type === 'Message') {
        formattedNotifications.push(
          { showChevron: false, showCTAs: false, icon: <Icon name="ios-contact" size={50} color="grey" />, title: 'A New Message from ' + notifications[i - 1].senderFirstName, subtitle: notifications[i - 1].message, originalNotificationIndex: [i - 1], type: notifications[i - 1].type }
        )
      } else if (notifications[i - 1].type === 'Session Added') {
        formattedNotifications.push(
          { showChevron: true, showCTAs: false, icon: <Icon name="ios-contact" size={50} color="grey" />, title: 'Session Added by ' + notifications[i - 1].senderFirstName, subtitle: notifications[i - 1].message, originalNotificationIndex: [i - 1], type: notifications[i - 1].type, objectId: notifications[i - 1].objectId }
        )
      } else if (notifications[i - 1].type === 'Session Edited') {
        formattedNotifications.push(
          { showChevron: true, showCTAs: false, icon: <Icon name="ios-contact" size={50} color="grey" />, title: 'Session Edited by ' + notifications[i - 1].senderFirstName, subtitle: notifications[i - 1].message, originalNotificationIndex: [i - 1], type: notifications[i - 1].type, objectId: notifications[i - 1].objectId }
        )
      } else if (notifications[i - 1].type === 'Checklist Assigned') {
        formattedNotifications.push(
          { showChevron: true, showCTAs: false, icon: <Icon name="ios-contact" size={50} color="grey"/>, title: 'Checklist Assigned by ' + notifications[i - 1].senderFirstName, subtitle: notifications[i - 1].message, originalNotificationIndex: [i - 1], type: notifications[i - 1].type, objectId: notifications[i - 1].objectId }
        )
      } else if (notifications[i - 1].type === 'Resource Received') {
        formattedNotifications.push(
          { showChevron: true, showCTAs: false, icon: <Icon name="ios-contact" size={50} color="grey" />, title: 'Resource Sent from ' + notifications[i - 1].senderFirstName, subtitle: notifications[i - 1].message, originalNotificationIndex: [i - 1], type: notifications[i - 1].type, objectId: notifications[i - 1].objectId }
        )
      } else if (notifications[i - 1].type === 'Advisee Request') {
        let showChevron = false
        let showCTAs = true
        let subtitle = 'Would you like to accept this request?'
        if ( notifications[i - 1].isDecided === true ) {
            showCTAs = false
            console.log('notification is decided on')
            if ( notifications[i - 1].isApproved === true ) {
              showChevron = true
              subtitle = 'You accepted this request'
            } else {
              showChevron = false
              subtitle = 'You denied this request'
            }
        }
        formattedNotifications.push(
          { showChevron: showChevron, showCTAs: showCTAs, icon: <Icon name="ios-contact" size={50} color="grey" />, title: 'Advisee Request from ' + notifications[i - 1].senderFirstName, subtitle: notifications[i - 1].message, originalNotificationIndex: [i - 1], type: notifications[i - 1].type, objectId: notifications[i - 1]._id }
        )
      } else if (notifications[i - 1].type === 'Request Accepted') {
        formattedNotifications.push(
          { showChevron: false, showCTAs: false, icon: <Icon name="ios-contact" size={50} color="grey" />, title: notifications[i - 1].senderFirstName + 'accepted your request!', subtitle: notifications[i - 1].message, originalNotificationIndex: [i - 1], type: notifications[i - 1].type, objectId: notifications[i - 1]._id }
        )
      } else if (notifications[i - 1].type === 'Suggestion') {
        formattedNotifications.push(
          { showChevron: false, showCTAs: false, icon: <Icon name="ios-contact" size={50} color="grey" />, title: 'A New Suggestion from ' + notifications[i - 1].senderFirstName, subtitle: notifications[i - 1].message, originalNotificationIndex: [i - 1], type: notifications[i - 1].type }
        )
      }//more to come

      if (notifications[i - 1].isRead === false) {
        unreadNotificationIds.push(notifications[i - 1]._id)
      }
    }

    console.log('gimme formattedNoti', formattedNotifications)
    for (let i = 1; i <= unreadNotificationIds.length; i++) {
      console.log(i);

      Axios.put('https://www.guidedcompass.com/api/notifications/read', {
        notificationIds: unreadNotificationIds })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('Notification update worked', response.data);
          /*
          AsyncStorage.setItem('unreadNotificationsCount', '0')
          PushNotification.setApplicationIconBadgeNumber(0)
          this.props.navigation.setParams({ badgeNumber: Number(0) });*/

        } else {
          console.log('there was an error updating the notifications', response.data.message);
        }
      }).catch((error) => {
          console.log('Notification update did not work', error);
      });
    }

    formattedNotifications.push({ showChevron: false, showCTAs: false, icon: null, title: 'Welcome to Guided Compass!', subtitle: 'Guided Compass allows you take career assessments, receive skill endorsements, receive career and job recommendations, and apply directly for jobs.' })

    this.setState({ notifications: formattedNotifications })
  }

  renderTableViewCells(item, index) {
    console.log('renderTableViewCells called', item, index)
    //onPress={() => this.matchTapped(item.title)}

    if (index === this.state.notifications.length - 1) {
      return (
        <View key={index}>
          <View style={styles.tableViewCell}>
              { (item.icon) && (
                <View style={styles.tableViewCellIconContainer}>
                  {item.icon}
                </View>
              )}
              <View style={styles.tableViewCellTextContainer}>
                <View style={styles.tableViewCellTitleContainer}>
                  <Text style={styles.tableViewCellTitle} key={index} numberOfLines={null}>{item.title}</Text>
                </View>
                <View style={styles.tableViewCellSubtitleContainer}>
                  <Text style={styles.tableViewCellSubtitle} key={index} numberOfLines={null}>{item.subtitle}</Text>
                </View>
              </View>
              { (item.showChevron) && (
                <View style={styles.tableViewCellCTAContainer}>
                  <Icon name="ios-arrow-forward" size={24} color='#87CEFA' />
                </View>
              )}
              { (item.showCTAs) && (
                <View style={styles.tableViewCellCTAContainer}>
                  <TouchableOpacity onPress={() => this.acceptRequest(index)}>
                    <View style={styles.tableViewCellCTA1Container}>
                      <Icon name="ios-checkmark" size={44} color='grey' />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => this.denyRequest(index)}>
                    <View style={styles.tableViewCellCTA2Container}>
                      <Icon name="ios-exit" size={25} color='grey' />
                    </View>
                  </TouchableOpacity>
                </View>
              )}
              { (this.state.serverPostSuccess) ? (
                <View>
                  { (this.state.serverSuccessMessage !== '') && (
                    <Text style={styles.successMessage}>{this.state.serverSuccessMessage}</Text>
                  )}
                </View>
              ) : (
                <View>
                  { (this.state.serverErrorMessage !== '') && (
                    <Text style={styles.errorMessage}>{this.state.serverErrorMessage}</Text>
                  )}
                </View>
              )}
          </View>
        </View>
      )
    } else {
      return (
        <View key={index}>
          <TouchableOpacity onPress={() => this.rowTapped(item)}>
            <View style={styles.tableViewCell}>
                { (item.icon) && (
                  <View style={styles.tableViewCellIconContainer}>
                    {item.icon}
                  </View>
                )}
                <View style={styles.tableViewCellTextContainer}>
                  <View style={styles.tableViewCellTitleContainer}>
                    <Text style={styles.tableViewCellTitle} key={index} numberOfLines={null}>{item.title}</Text>
                  </View>
                  <View style={styles.tableViewCellSubtitleContainer}>
                    <Text style={styles.tableViewCellSubtitle} key={index} numberOfLines={null}>{item.subtitle}</Text>
                  </View>
                </View>
                { (item.showChevron) && (
                  <View style={styles.tableViewCellCTAContainer}>
                    <Icon name="ios-arrow-forward" size={24} color='#87CEFA' />
                  </View>
                )}
                { (item.showCTAs) && (
                  <View style={styles.tableViewCellCTAContainer}>
                    <TouchableOpacity onPress={() => this.acceptRequest(index)}>
                      <View style={styles.tableViewCellCTA1Container}>
                        <Icon name="ios-checkmark" size={44} color='grey' />
                      </View>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => this.denyRequest(index)}>
                      <View style={styles.tableViewCellCTA2Container}>
                        <Icon name="ios-exit" size={25} color='grey' />
                      </View>
                    </TouchableOpacity>
                  </View>
                )}
                { (this.state.serverPostSuccess) ? (
                  <View>
                    { (this.state.serverSuccessMessage !== '') && (
                      <Text style={styles.successMessage}>{this.state.serverSuccessMessage}</Text>
                    )}
                  </View>
                ) : (
                  <View>
                    { (this.state.serverErrorMessage !== '') && (
                      <Text style={styles.errorMessage}>{this.state.serverErrorMessage}</Text>
                    )}
                  </View>
                )}
            </View>
          </TouchableOpacity>
        </View>
      )
    }
  }

  render() {
    return (
      <View style={styles.tableView}>
        <FlatList
          data={this.state.notifications}
          keyExtractor={item => item.title}
          renderItem={({ item, index }) => this.renderTableViewCells(item, index)}
        />
      </View>
    )
  }
}

export default Notifications;

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
