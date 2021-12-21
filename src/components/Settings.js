import React, { Component } from 'react';
import { View, Text, SectionList, Linking, AsyncStorage, Share, TouchableOpacity, ScrollView } from 'react-native';
import { Card, CardSection, Button } from './common';
import { List, ListItem } from 'react-native-elements';
import Icon from 'react-native-vector-icons/Ionicons';
import Icon2 from 'react-native-vector-icons/MaterialCommunityIcons';

class Settings extends Component {
  constructor(props) {
    super(props)
    this.state = {
      settings: [{title: 'View the Walkthrough'}, { title: 'View your Advisor Dashboard'}, {title: 'Invite Career Advisors'}, {title: 'Career Trends'}, { title: 'Manage Organizations'}, {title: 'Share the App'}, {title: 'About Guided Compass'}, {title: 'Logout'}],

      exploreOptions: [{ title: 'Career Trends'}, { title: 'Advisor Dashboard'},{ title: 'Manage Organizations'}],
      shareOptions: [{ title: 'Share the App'}, { title: 'Invite Career Advisors'}],
      infoOptions: [{ title: 'View the Walkthrough'}, { title: 'About Guided Compass'}],
      accountOptions: [{ title: 'Change Password'}],
      logOutOptions: [{ title: 'Logout'}]

    }

    this.cellTapped = this.cellTapped.bind(this)

    this.renderSectionRow = this.renderSectionRow.bind(this)
    this.renderSectionHeader = this.renderSectionHeader.bind(this)
    this.listViewCellTapped = this.listViewCellTapped.bind(this)


    this.shareApp = this.shareApp.bind(this)
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

  renderSectionRow(section, index, item){
    console.log('renderSectionRow called', section, index, item)

    return (
      <View>
        <TouchableOpacity onPress={() => this.listViewCellTapped(section, index)}>
          <View style={styles.tableViewCell}>
            <View style={styles.tableViewCellIconContainer}>
              {(section.title === 'Explore') && (
                <Icon name="ios-compass" size={30} color='grey' />
              )}
              {(section.title === 'Share') && (
                <Icon name="md-share" size={30} color='grey' />
              )}
              {(section.title === 'Info') && (
                <Icon name="ios-information-circle-outline" size={30} color='grey' />
              )}
              {(section.title === 'Account') && (
                <Icon name="ios-contact" size={30} color='grey' />
              )}
              {(section.title === ' ') && (
                <Icon2 name="logout" size={30} color='grey' />
              )}
            </View>
            <View style={styles.tableViewCellTextContainer}>
              <Text style={styles.tableViewCellTitle} numberOfLines={1}>{item.title}</Text>
            </View>
            <View style={styles.tableViewCellCTAContainer}>
              <View style={styles.tableViewIconContainer}>
                <Icon name="ios-arrow-forward" size={24} color='#87CEFA' />
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    )
  }

  renderSectionHeader(title) {
    console.log('renderSectionHeader called')

    return(
      <View style={styles.tableViewHeaderContainer}>
        <Text style={styles.tableViewHeaderTitle}>{title}</Text>
      </View>
    )
  }

  listViewCellTapped(section, index) {
    console.log('listViewCellTapped', section, index)

    if (section.title === 'Explore') {
      if (index === 0) {
        this.props.navigation.navigate('Trends');
      } else if (index === 1) {
        this.props.navigation.navigate('Advising');
      } else {
        this.props.navigation.navigate('Organization');
      }
    } else if (section.title === 'Share') {
      if (index === 0) {
        this.shareApp()
      } else {
        this.props.navigation.navigate('AddAdvisors');
      }
    } else if (section.title === 'Info') {
      if (index === 0) {
        this.props.navigation.navigate('Walkthrough');
      } else {
        Linking.openURL('https://www.guidedcompass.com').catch(err => console.error('An error occurred', err));
      }
    } else if (section.title === 'Account') {
      if (index === 0) {
        this.props.navigation.navigate('ChangePassword');
      } else {
        //there was an error, there's only one item here
      }
    } else {
      //logout section
      AsyncStorage.clear()
      this.props.navigation.navigate('AuthLoading');
    }
  }

  cellTapped(index) {
    console.log('cellTapped', index);
    if (index === 0) {

      //walkthrough
      this.props.navigation.navigate('Walkthrough');
    } else if (index === 1) {
      //walkthrough
      this.props.navigation.navigate('Advising');
    } else if (index === 2) {
      //walkthrough
      this.props.navigation.navigate('AddAdvisors');
    } else if (index === 3) {
      //walkthrough
      this.props.navigation.navigate('Trends');
    } else if (index === 4) {
      //logout
      this.props.navigation.navigate('Organization');
    } else if (index === 5) {
      //share the app
      this.shareApp()
    } else if (index === 6) {
      Linking.openURL('https://www.guidedcompass.com').catch(err => console.error('An error occurred', err));
    } else if (index === 7) {
      //logout
      AsyncStorage.clear()
      this.props.navigation.navigate('AuthLoading', { reloadScreen: true });
    }
  }

  shareApp = async() => {
    console.log('shareOpening called')

    try {
      const result = await Share.share({
        message:
          'Guided Compass | Clarify and Achieve Your Career Goals',
      })

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
          console.log('activity type')
        } else {
          // shared
          console.log('shared')
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
        console.log('dismissed')
      }
    } catch (error) {
      console.log(error.message);
    }
  }

  render() {

    let section1 = [ {title: 'Explore', data: this.state.exploreOptions}]

    let section2 = [{title: 'Share', data: this.state.shareOptions}]

    let section3 = [{title: 'Info', data: this.state.infoOptions}]

    let section4 = [{title: 'Account', data: this.state.accountOptions}]

    let section5 = [{title: ' ', data: this.state.logOutOptions}]

    return (
      <ScrollView>
        <View>
          <View style={{ height: 20 }}/>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Text style={styles.subtitle}>Explore</Text>
          </View>

          <TouchableOpacity onPress={() => this.cellTapped(7)}>
            <View>
              <Text>Log Out</Text>
            </View>
          </TouchableOpacity>
          {/*
          <View style={styles.tableView}>
            <SectionList
              renderItem={({item, index, section}) => this.renderSectionRow(section, index, item)}
              renderSectionHeader={({section: {title}}) => (
                this.renderSectionHeader(title)
              )}
              sections={section1}
              keyExtractor={(item, index) => item + index}
            />
          </View>
          <View style={{ height: 20 }}/>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Text style={styles.subtitle}>Share</Text>
          </View>
          <View style={styles.tableView}>
            <SectionList
              renderItem={({item, index, section}) => this.renderSectionRow(section, index, item)}
              renderSectionHeader={({section: {title}}) => (
                this.renderSectionHeader(title)
              )}
              sections={section2}
              keyExtractor={(item, index) => item + index}
            />
          </View>
          <View style={{ height: 20 }}/>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Text style={styles.subtitle}>Info</Text>
          </View>
          <View style={styles.tableView}>
            <SectionList
              renderItem={({item, index, section}) => this.renderSectionRow(section, index, item)}
              renderSectionHeader={({section: {title}}) => (
                this.renderSectionHeader(title)
              )}
              sections={section3}
              keyExtractor={(item, index) => item + index}
            />
          </View>
          <View style={{ height: 20 }}/>
          <View style={{ paddingLeft: 20, paddingRight: 20 }}>
            <Text style={styles.subtitle}>Account</Text>
          </View>
          <View style={styles.tableView}>
            <SectionList
              renderItem={({item, index, section}) => this.renderSectionRow(section, index, item)}
              renderSectionHeader={({section: {title}}) => (
                this.renderSectionHeader(title)
              )}
              sections={section4}
              keyExtractor={(item, index) => item + index}
            />
          </View>
          <View style={{ height: 20 }}/>
          <Text style={styles.subtitle}> </Text>
          <View style={styles.tableView}>
            <SectionList
              renderItem={({item, index, section}) => this.renderSectionRow(section, index, item)}
              renderSectionHeader={({section: {title}}) => (
                this.renderSectionHeader(title)
              )}
              sections={section5}
              keyExtractor={(item, index) => item + index}
            />
          </View>*/}
        </View>
      </ScrollView>
    );
  }
}

export default Settings;

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
    marginLeft: 20,
    marginRight: 20,
    paddingBottom: 20
  },
  tableViewCell: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
    padding: 10,
    height: 50,
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
    flex: 65,
    paddingRight: 10,
    justifyContent: 'center'
  },
  tableViewCellTitle: {
    fontSize: 16,
    color: '#4D4D4D'
  },
  tableViewCellCTAContainer: {
    flex: 20,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
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
  tableViewIconContainer: {
    padding: 5
  },
  tableViewHeaderContainer: {
    height: 0,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(235,235,235,0)'
  },
  tableViewHeaderTitle: {
    fontSize: 22,
    color: '#4D4D4D'
  },
  subtitle: {
    fontSize: 22,
    color: 'grey'
  },
}
