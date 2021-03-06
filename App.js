import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image, AsyncStorage} from 'react-native';
// import Router from './src/Router';
import Axios from 'axios';
import Modal from 'react-native-modal';
const styles = require('./src/components/css/style');

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AuthLoadingScreen from './src/components/AuthLoadingScreen';
import WelcomeScreen from './src/components/WelcomeScreen';
import SignUpScreen from './src/components/SignUpScreen';
import SignInScreen from './src/components/SignInScreen';
import Walkthrough from './src/components/Walkthrough';

import Home from './src/components/Home';
import Community from './src/components/Community';
import Paths from './src/components/Paths';
import Opportunities from './src/components/Opportunities';
import EditProfile from './src/components/EditProfile';
import EditProfileDetails from './src/components/EditProfileDetails';
import Settings from './src/components/Settings';
import Notifications from './src/components/Notifications';
import Messages from './src/components/Messages';
import Assessments from './src/components/Assessments';
import AssessmentDetails from './src/components/AssessmentDetails';
import TakeAssessment from './src/components/TakeAssessment';
import Endorsements from './src/components/Endorsements';
import RequestEndorsements from './src/components/RequestEndorsements';
import Logs from './src/components/Logs';
import EditLog from './src/components/EditLog';
import MyCourses from './src/components/MyCourses';
import Favorites from './src/components/Favorites';
import Completions from './src/components/Completions';
import MySocialPosts from './src/components/MySocialPosts';
import Matches from './src/components/Matches';
import Profile from './src/components/Profile';
import ResumeBuilder from './src/components/ResumeBuilder';
import FinancialPlanner from './src/components/FinancialPlanner';
import CareerPlanBuilder from './src/components/CareerPlanBuilder';
import OpportunityDetails from './src/components/OpportunityDetails';
import Apply from './src/components/Apply';
import CareerDetails from './src/components/CareerDetails';
import EmployerDetails from './src/components/EmployerDetails';
import GroupDetails from './src/components/GroupDetails';
import ProjectDetails from './src/components/ProjectDetails';
import CreatePost from './src/components/CreatePost';
import Profiles from './src/components/Profiles';
import Goals from './src/components/Goals';
import Projects from './src/components/Projects';
import Groups from './src/components/Groups';
import Employers from './src/components/Employers';
import ChangePassword from './src/components/ChangePassword';
import AddWorkspaces from './src/components/AddWorkspaces';
import OrgDetails from './src/components/OrgDetails';
import BenchmarkDetails from './src/components/BenchmarkDetails';
import CourseDetails from './src/components/CourseDetails';

const orgLogo = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/orgLogos/full-guided-compass-logo.png"
const notificationsIconDark = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/notifications-icon-dark.png"
const chatbubblesIcon = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/chatbubbles-icon.png"
const searchIconDark = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon-dark.png"
const addIcon = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png"
const settingsIconDark = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/settings-icon-dark.png"
const homeIconDark = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/home-icon-dark.png"
const homeIconBlue = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/home-icon-blue.png"
const socialIconDark = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-dark.png"
const socialIconBlue = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/social-icon-blue.png"
const pathsIconDark = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/paths-icon-dark.png"
const pathsIconBlue = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/paths-icon-blue.png"
const opportunitiesIconDark = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png"
const opportunitiesIconBlue = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-blue.png"
const profileIconDark = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png"
const profileIconBlue = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-blue.png"
const arrowIndicatorIcon = "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png"

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {
  constructor(props) {
    super(props)
    this.state = {
    }
  }
  // componentDidMount() {
  //   console.log('componentDidMount MASTER')
  //
  //   async function retrieveData() {
  //     try {
  //
  //       // console.log('this is causing the error')
  //       const activeOrg = await AsyncStorage.getItem('activeOrg')
  //       if (activeOrg) {
  //         Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
  //         .then((response) => {
  //           console.log('Org info query attempted in SubOrgDetails', response.data);
  //
  //             if (response.data.success) {
  //               console.log('org info query worked')
  //
  //               orgLogo = response.data.orgInfo.webLogoURIColor
  //
  //
  //             } else {
  //               console.log('org info query did not work', response.data.message)
  //             }
  //
  //         }).catch((error) => {
  //             console.log('Org info query did not work for some reason', error);
  //         });
  //       }
  //
  //      } catch (error) {
  //        // Error retrieving data
  //        console.log('there was an error', error)
  //      }
  //   }
  //
  //   retrieveData()
  // }

  render() {

    const Stack = createNativeStackNavigator();
    const Tab = createBottomTabNavigator();
    // const Drawer = createDrawerNavigator();

    function Auth({ navigation }) {
      return (
        <Stack.Navigator>
          <Stack.Screen name="Welcome" component={WelcomeScreen} options={{ headerShown: false }} />
          <Stack.Screen name="SignUp" component={SignUpScreen} options={{
            headerTitle: '',
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
                <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                  <Image source={{uri: arrowIndicatorIcon }} style={[styles.square15,styles.contain,styles.whiteTintColor,styles.rotate180]} />
                </View>
              </TouchableOpacity>
            ),
          }} />
          <Stack.Screen name="SignIn" component={SignInScreen} options={{
            headerTitle: '',
            headerTransparent: true,
            headerLeft: () => (
              <TouchableOpacity onPress={() => navigation.navigate('Welcome')}>
                <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                  <Image source={{uri: arrowIndicatorIcon }} style={[styles.square15,styles.contain,styles.whiteTintColor,styles.rotate180]} />
                </View>
              </TouchableOpacity>
            ),
          }} />
          <Stack.Screen name="Walkthrough" component={Walkthrough} options={{ headerShown: false }} />
        </Stack.Navigator>
      );
    }

    let showDrawerNavigation = false

    // const CustomDrawerContent = (props) => {
    //   return (
    //     <DrawerContentScrollView {...props}>
    //       {
    //         Object.entries(props.descriptors).map(([key, descriptor], index) => {
    //           const focused = index === props.state.index
    //           return (
    //             <DrawerItem
    //               key={key}
    //               label={() => (
    //                 <Text style={focused ? styles.drawerLabelFocused : styles.drawerLabel}>
    //                   {descriptor.options.title}
    //                 </Text>
    //               )}
    //               onPress={() => descriptor.navigation.navigate(descriptor.route.name)}
    //               style={[styles.drawerItem, focused ? styles.drawerItemFocused : null]}
    //             />
    //           )
    //         })
    //       }
    //     </DrawerContentScrollView>
    //   )
    // }

    function App({ navigation }) {
      if (showDrawerNavigation) {
        // return (
        //   <Drawer.Navigator
        //     screenOptions={({ navigation }) => ({
        //       headerStyle: {
        //         backgroundColor: '#551E18',
        //         height: 50,
        //       },
        //       headerLeft: () => (
        //         <TouchableOpacity onPress={() => navigation.toggleDrawer()} style={styles.headerLeft}>
        //           <Icon name="bars" size={20} color="#fff" />
        //         </TouchableOpacity>
        //       ),
        //     })}
        //     drawerContent={(props) => <CustomDrawerContent {...props} />}
        //   >
        //     <Drawer.Screen name="Home" component={"Home"} options={{
        //       title: 'Home',
        //       headerTitle: 'Home Header Title',
        //       headerRight: () => (
        //         <View style={styles.headerRight}>
        //           <Icon name="bell" size={20} color="#fff" />
        //         </View>
        //       ),
        //     }}/>
        //     <Drawer.Screen name="Notifications" component={Notifications} options={{
        //       title: 'Notifications',
        //       headerTitle: 'My Rewards Header Title',
        //     }}/>
        //     <Drawer.Screen name="LocationsStack" component={LocationsStackNavigator} options={{
        //       title: 'Locations',
        //       headerTitle: 'Locations Header Title',
        //     }}/>
        //   </Drawer.Navigator>
        // )
      } else {
        // 0,122,255 rgb; 8e8e8f
        return (
          <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Image source={(color === '#8E8E8F') ? { uri: homeIconDark } : { uri: homeIconBlue }} style={{ width: size, height: size, resizeMode: 'contain' }} />
              ),
              headerTitle: () => (
                <TouchableOpacity onPress={() => navigation.navigate('AddWorkspaces')}>
                  <Image source={{uri: orgLogo}} style={{ width: 200, height: 32, resizeMode: 'contain' }} />
                </TouchableOpacity>
              ),
              headerLeft: () => (
                <View style={{ flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                    <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                      <Image source={{ uri: notificationsIconDark }} style={[styles.square23,styles.contain]} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
                    <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                      <Image source={{ uri: chatbubblesIcon }} style={[styles.square23,styles.contain]} />
                    </View>
                  </TouchableOpacity>
                </View>
              ),
              headerRight: () => (
                <View style={{ flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => navigation.navigate('SearchItems')}>
                    <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                      <Image source={{ uri: searchIconDark }} style={[styles.square23,styles.contain]} />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
                    <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                      <Image source={{ uri: addIcon }} style={[styles.square23,styles.contain]} />
                    </View>
                  </TouchableOpacity>
                </View>
              ),
            }}/>
            <Tab.Screen name="Community" component={Community} options={{
              tabBarLabel: 'Community',
              tabBarIcon: ({ color, size }) => (
                <Image source={(color === '#8E8E8F') ? { uri: socialIconDark } : { uri: socialIconBlue }} style={{ width: size, height: size, resizeMode: 'contain' }} />
              )
            }}/>
            <Tab.Screen name="Paths" component={Paths} options={{
              tabBarLabel: 'Paths',
              tabBarIcon: ({ color, size }) => (
                <Image source={(color === '#8E8E8F') ? { uri: pathsIconDark } : { uri: pathsIconBlue }} style={{ width: size, height: size, resizeMode: 'contain' }} />
              )
            }}/>
            <Tab.Screen name="Opportunities" component={Opportunities} options={{
              tabBarLabel: 'Opportunities',
              tabBarIcon: ({ color, size }) => (
                <Image source={(color === '#8E8E8F') ? { uri: opportunitiesIconDark } : { uri: opportunitiesIconBlue }} style={{ width: size, height: size, resizeMode: 'contain' }} />
              )
            }}/>
            <Tab.Screen name="EditProfile" component={EditProfile} options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Image source={(color === '#8E8E8F') ? { uri: profileIconDark } : { uri: profileIconBlue }} style={{ width: size, height: size, resizeMode: 'contain' }} />
              ),
              headerTitle: 'Edit Profile',
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                  <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                    <Image source={{ uri: settingsIconDark }} style={[styles.square23,styles.contain]} />
                  </View>
                </TouchableOpacity>
              ),
            }}/>

          </Tab.Navigator>
        );
      }
    }

    return (
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="AuthLoading" component={AuthLoadingScreen} options={{ headerShown: false }} />
          <Stack.Screen name="App" component={App} options={{ headerShown: false }} />
          <Stack.Screen name="Auth" component={Auth} options={{ headerShown: false }} />
          <Stack.Screen name="Notifications" component={Notifications} />
          <Stack.Screen name="Messages" component={Messages} />
          <Stack.Screen name="EditProfileDetails" component={EditProfileDetails} />
          <Stack.Screen name="Settings" component={Settings} />
          <Stack.Screen name="Assessments" component={Assessments} />
          <Stack.Screen name="AssessmentDetails" component={AssessmentDetails} />
          <Stack.Screen name="TakeAssessment" component={TakeAssessment} />
          <Stack.Screen name="Endorsements" component={Endorsements} />
          <Stack.Screen name="RequestEndorsements" component={RequestEndorsements} />
          <Stack.Screen name="Logs" component={Logs} />
          <Stack.Screen name="EditLog" component={EditLog} />
          <Stack.Screen name="MyCourses" component={MyCourses} />
          <Stack.Screen name="Favorites" component={Favorites} />
          <Stack.Screen name="Completions" component={Completions} />
          <Stack.Screen name="MySocialPosts" component={MySocialPosts} />
          <Stack.Screen name="Matches" component={Matches} />
          <Stack.Screen name="Profile" component={Profile} />
          <Stack.Screen name="ResumeBuilder" component={ResumeBuilder} />
          <Stack.Screen name="FinancialPlanner" component={FinancialPlanner} />
          <Stack.Screen name="CareerPlanBuilder" component={CareerPlanBuilder} />
          <Stack.Screen name="OpportunityDetails" component={OpportunityDetails}/>
          <Stack.Screen name="Apply" component={Apply} />
          <Stack.Screen name="CareerDetails" component={CareerDetails} />
          <Stack.Screen name="EmployerDetails" component={EmployerDetails} />
          <Stack.Screen name="GroupDetails" component={GroupDetails} />
          <Stack.Screen name="ProjectDetails" component={ProjectDetails} />
          <Stack.Screen name="CreatePost" component={CreatePost}/>
          <Stack.Screen name="Profiles" component={Profiles} />
          <Stack.Screen name="Goals" component={Goals} />
          <Stack.Screen name="Projects" component={Projects} />
          <Stack.Screen name="Groups" component={Groups} />
          <Stack.Screen name="Employers" component={Employers} />
          <Stack.Screen name="ChangePassword" component={ChangePassword} />
          <Stack.Screen name="AddWorkspaces" component={AddWorkspaces} />
          <Stack.Screen name="OrgDetails" component={OrgDetails} />
          <Stack.Screen name="Walkthrough" component={Walkthrough} options={{ headerShown: false }} />
          <Stack.Screen name="BenchmarkDetails" component={BenchmarkDetails} />
          <Stack.Screen name="CourseDetails" component={CourseDetails} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
