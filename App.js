import React, {Component} from 'react';
import {Platform, StyleSheet, Text, View, TouchableOpacity, Image} from 'react-native';
// import Router from './src/Router';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator } from '@react-navigation/drawer';

import AuthLoadingScreen from './src/components/AuthLoadingScreen';
import WelcomeScreen from './src/components/WelcomeScreen';
import SignUpScreen from './src/components/SignUpScreen';
import SignInScreen from './src/components/SignInScreen';
import WalkthroughScreen from './src/components/WalkthroughScreen';

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
import Favorites from './src/components/Favorites';
import Completions from './src/components/Completions';
import MySocialPosts from './src/components/MySocialPosts';

import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont()

const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' + 'Cmd+D or shake for dev menu',
  android:
    'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});

type Props = {};
export default class App extends Component<Props> {

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
                  <Icon name={'ios-arrow-back'} size={25} color='white' />
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
                  <Icon name={'ios-arrow-back'} size={25} color='white' />
                </View>
              </TouchableOpacity>
            ),
          }} />
          <Stack.Screen name="Walkthrough" component={WalkthroughScreen} options={{ headerShown: false }} />
        </Stack.Navigator>
      );
    }

    // function HomeStack({ navigation }) {
    //   return (
    //     <Stack.Navigator>
    //       <Stack.Screen name="Home" component={Home} options={{
    //         headerTitle: '',
    //         headerLeft: () => (
    //           <TouchableOpacity onPress={() => navigation.navigate('Profile')}>
    //             <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
    //               <Icon name="person" size={25} color='black' />
    //             </View>
    //           </TouchableOpacity>
    //         ),
    //         tabBarLabel: 'Home',
    //         tabBarIcon: ({ color, size }) => (
    //           <Icon name="home" size={size} color={color} />
    //         ),
    //       }} />
    //       <Stack.Screen name="Profile" component={Profile} />
    //     </Stack.Navigator>
    //   );
    // }

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
        return (
          <Tab.Navigator>
            <Tab.Screen name="Home" component={Home} options={{
              tabBarLabel: 'Home',
              tabBarIcon: ({ color, size }) => (
                <Icon name="home" size={size} color={color} />
              ),

              headerTitle: () => (
                <Image source={{uri: "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/orgLogos/full-guided-compass-logo.png"}} style={{ width: 200, height: 32, resizeMode: 'contain' }} />
              ),
              headerLeft: () => (
                <View style={{ flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => navigation.navigate('Notifications')}>
                    <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                      <Icon name="notifications" size={25} color='black' />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('Messages')}>
                    <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                      <Icon name="chatbubbles" size={25} color='black' />
                    </View>
                  </TouchableOpacity>
                </View>
              ),
              headerRight: () => (
                <View style={{ flexDirection: 'row'}}>
                  <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                    <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                      <Icon name="search" size={25} color='black' />
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => navigation.navigate('CreatePost')}>
                    <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                      <Icon name="add-circle-outline" size={25} color='black' />
                    </View>
                  </TouchableOpacity>
                </View>
              ),
            }}/>
            <Tab.Screen name="Community" component={Community} options={{
              tabBarLabel: 'Community',
              tabBarIcon: ({ color, size }) => (
                <Icon name="people" size={size} color={color} />
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Match')}>
                  <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                    <Image source={{uri: "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/benchmarks-icon-dark.png"}} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                  </View>
                </TouchableOpacity>
              ),
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                  <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                    <Icon name="search" size={25} color='black' />
                  </View>
                </TouchableOpacity>
              ),
            }}/>
            <Tab.Screen name="Paths" component={Paths} options={{
              tabBarLabel: 'Paths',
              tabBarIcon: ({ color, size }) => (
                <Icon name="compass" size={size} color={color} />
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Match')}>
                  <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                    <Image source={{uri: "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/icons/benchmarks-icon-dark.png"}} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                  </View>
                </TouchableOpacity>
              ),
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                  <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                    <Icon name="search" size={25} color='black' />
                  </View>
                </TouchableOpacity>
              ),
            }}/>
            <Tab.Screen name="Opportunities" component={Opportunities} options={{
              tabBarLabel: 'Opportunities',
              tabBarIcon: ({ color, size }) => (
                <Icon name="briefcase" size={size} color={color} />
              ),
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Match')}>
                  <View style={{ marginLeft: 10, paddingLeft: 5, paddingRight: 5 }}>
                    <Image source={{uri: "https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/icons/benchmarks-icon-dark.png"}} style={{ width: 25, height: 25, resizeMode: 'contain' }} />
                  </View>
                </TouchableOpacity>
              ),
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Search')}>
                  <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                    <Icon name="search" size={25} color='black' />
                  </View>
                </TouchableOpacity>
              ),
            }}/>
            <Tab.Screen name="EditProfile" component={EditProfile} options={{
              tabBarLabel: 'Profile',
              tabBarIcon: ({ color, size }) => (
                <Icon name="person" size={size} color={color} />
              ),
              headerTitle: 'Edit Profile',
              headerRight: () => (
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                  <View style={{ marginRight: 10, paddingLeft: 5, paddingRight: 5 }}>
                    <Icon name="settings" size={25} color='black' />
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
          <Stack.Screen name="Favorites" component={Favorites} />
          <Stack.Screen name="Completions" component={Completions} />
          <Stack.Screen name="MySocialPosts" component={MySocialPosts} />
        </Stack.Navigator>
      </NavigationContainer>
    );
  }
}
