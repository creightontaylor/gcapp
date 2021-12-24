import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform } from 'react-native';
import { Card, CardSection } from './common';
import Axios from 'axios';
const styles = require('./css/style');
//import PushNotification from 'react-native-push-notification';
//import { configurePushNotifications } from '../services/PushNotifications';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont()

import SubCareers from './subcomponents/Careers';
import SubFinancials from './subcomponents/Financials';
import SubTrends from './subcomponents/Trends';

class Paths extends Component {
  constructor(props) {
    super(props)
    this.state = {
      subNavCategories: ['Careers','Financial Planner','Trends'],
      subNavSelected: 'Careers',
      favorites: [],
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.subNavClicked = this.subNavClicked.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  retrieveData = async() => {
    try {
      console.log('retrieving data in parent paths')
      //testing badges

      // if (email !== null) {
      //   // We have data!!
      //   console.log('what is the email of this user');
      //
      // }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error in parent paths: ', error)
     }
  }

  subNavClicked(itemSelected) {
    console.log('subNavClicked called', itemSelected)

    AsyncStorage.setItem('explorationNavSelected', itemSelected)
    this.setState({ subNavSelected: itemSelected })
  }

  render() {
    return (
      <ScrollView>
        <View style={[styles.fullScreenWidth,styles.whiteBorder]}>
          <View style={[styles.carousel,styles.rowDirection,styles.cardClearPadding]} onScroll={this.handleScroll}>
            {this.state.subNavCategories.map((value, index) =>
              <View style={styles.flex1} key={value}>
                {(this.state.subNavCategories[index] === this.state.subNavSelected) ? (
                  <View style={[styles.selectedCarouselItem2, styles.flex33, styles.flexCenter]}>
                    <Text key={value}>{value}</Text>
                  </View>
                ) : (
                  <TouchableOpacity style={[styles.menuButton2, styles.flex33, styles.flexCenter]} onPress={() => this.subNavClicked(value)}>
                    <Text key={value}>{value}</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          <View style={styles.horizontalLine} />
        </View>

        {(this.state.subNavSelected === 'Careers') && (
          <View>
            <SubCareers calculateMatches={this.state.calculateMatches} selectedGoal={this.state.selectedGoal} />
          </View>
        )}
        {(this.state.subNavSelected === 'Financial Planner') && (
          <View>
            <View>
              <SubFinancials />
            </View>
          </View>
        )}
        {(this.state.subNavSelected === 'Trends') && (
          <View>
            <SubTrends />
          </View>
        )}
      </ScrollView>
    );
  }

}

export default Paths;
