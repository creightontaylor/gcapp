import React, {Component} from 'react';
import { Text, View, Image, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, ActivityIndicator, Linking } from 'react-native';
const styles = require('../css/style');

// const experienceIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/experience-icon.png'

class TableView extends Component {
    constructor(props) {
        super(props)

        this.state = {
        }

        this.retrieveData = this.retrieveData.bind(this)

    }

    componentDidMount() {
      //see if user is logged in

      this.retrieveData()

    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called in TableView')

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode || this.props.posts !== prevProps.posts  || this.props.passedGroupPost !== prevProps.passedGroupPost) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in TableView')

        // let emailId = await AsyncStorage.getItem('email');
        // const username = await AsyncStorage.getItem('username');
        // const cuFirstName = await AsyncStorage.getItem('firstName');
        // const cuLastName = await AsyncStorage.getItem('lastName');
        // let activeOrg = await AsyncStorage.getItem('activeOrg');
        // if (!activeOrg) {
        //   activeOrg = 'guidedcompass'
        // }
        // const orgFocus = await AsyncStorage.getItem('orgFocus');
        // const roleName = await AsyncStorage.getItem('roleName');
        // let pictureURL = await AsyncStorage.getItem('pictureURL');
        // if (this.props.pictureURL && !pictureURL) {
        //   pictureURL = this.props.pictureURL
        // }
        //
        // this.setState({ emailId, cuFirstName, cuLastName, activeOrg, orgFocus, roleName, username })

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    render() {

      return (
        <View>
          {(this.props.tableData) ? (
            <View>
              {this.props.tableData.map((item, index) =>
                <View key={"tableData" + index}>
                  <View key={index} style={[styles.calcColumn60,styles.row20,styles.rowDirection]}>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate(item.pathname, item.passedState)} style={[styles.rowDirection,styles.calcColumn120]}>
                      <View style={[styles.width50]}>
                        <Image source={{ uri: item.imageURL }} style={[styles.square40,styles.contain,styles.centerItem]}/>
                      </View>
                      <View style={[styles.calcColumn170,styles.horizontalPadding3]}>
                        <View>
                          <Text style={[styles.headingText6]}>{item.title}</Text>
                        </View>
                        <View>
                          <Text style={[styles.descriptionText2,styles.descriptionTextColor,styles.curtailText]}>{item.subtitle1}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>

                    <View style={[styles.rowDirection]}>
                      {(item.rightButton1) && (
                        <View style={[styles.width30,styles.topMargin,styles.rightPadding]}>
                          <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                          <TouchableOpacity onPress={() => item.rightButton1.buttonPressed }>
                            <Image source={{ uri: item.rightButton1.imageURL }} style={[styles.square20,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                      )}
                      {(item.rightButton2) && (
                        <View style={[styles.width20,styles.topMargin15]}>
                          <TouchableOpacity onPress={() => this.props.navigation.navigate(item.pathname, item.passedState)}>
                            <Image source={{ uri: item.rightButton2.imageURL }} style={[styles.square20,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>
                  </View>
                </View>
              )}
            </View>
          ) : (
            <View />
          )}
        </View>
      )
    }
}

export default TableView;
