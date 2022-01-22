import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform } from 'react-native';
import { Card, CardSection } from './common';
import Axios from 'axios';
const styles = require('./css/style');
//import PushNotification from 'react-native-push-notification';
//import { configurePushNotifications } from '../services/PushNotifications';

import SubBenchmarks from './subcomponents/Benchmarks';
import SubCareers from './subcomponents/Careers';
import SubFinancials from './subcomponents/Financials';
import SubTrends from './subcomponents/Trends';

class Paths extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showBenchmarks: true,

      subNavCategories: [],
      subNavSelected: 'Careers',
      favorites: [],
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.subNavClicked = this.subNavClicked.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()
    // this.props.navigation.addListener('retrieveData', this.retrieveData)
  }

  retrieveData = async() => {
    try {
      console.log('retrieving data in parent paths')
      //testing badges

      const explorationNavSelected = await AsyncStorage.getItem('explorationNavSelected');

      let subNavSelected = 'Careers'
      let calculateMatches = false
      let selectedGoal = null

      if (this.props.route && this.props.route.params) {

        if (this.props.route.params.subNavSelected) {
          subNavSelected = this.props.route.params.subNavSelected
        } else if (explorationNavSelected) {
          subNavSelected = explorationNavSelected
        }

        if (this.props.route.params.calculateMatches) {
          calculateMatches = this.props.route.params.calculateMatches
        }

        selectedGoal = this.props.route.params.selectedGoal

      }

      // console.log('show me the money: ', subNavSelected,this.props.route.params)
      let subNavCategories = ['Careers','Trends']

      if (this.state.showBenchmarks) {
        subNavCategories = ['Benchmarks','Careers','Trends']
        subNavSelected = 'Benchmarks'
      }

      this.setState({ subNavSelected,calculateMatches,selectedGoal,subNavCategories})
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

        {(this.state.subNavSelected === 'Benchmarks') && (
          <View>
            <SubBenchmarks navigation={this.props.navigation} calculateMatches={this.state.calculateMatches} selectedGoal={this.state.selectedGoal} />
          </View>
        )}

        {(this.state.subNavSelected === 'Careers') && (
          <View>
            <SubCareers navigation={this.props.navigation} calculateMatches={this.state.calculateMatches} selectedGoal={this.state.selectedGoal} />
          </View>
        )}
        {(this.state.subNavSelected === 'Financial Planner') && (
          <View>
            <View>
              <SubFinancials navigation={this.props.navigation} />
            </View>
          </View>
        )}
        {(this.state.subNavSelected === 'Trends') && (
          <View>
            <SubTrends navigation={this.props.navigation} />
          </View>
        )}
      </ScrollView>
    );
  }

}

export default Paths;
