import React from 'react';
import { Text, Image, View, TouchableOpacity, StyleSheet, AsyncStorage } from 'react-native';
import Axios from 'axios';

//import { Stack, Scene, Router, Actions, Tabs } from 'react-native-router-flux';
// import { createSwitchNavigator, createStackNavigator } from 'react-navigation-stack';
// import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons'
import Icon2 from 'react-native-vector-icons/FontAwesome5'
import Icon3 from 'react-native-vector-icons/MaterialCommunityIcons'

// import HomeScreen from './components/Home';
// import WorkspaceScreen from './components/Workspace';
// import AssessmentsScreen from './components/Assessments';
// import AssessmentDetailsScreen from './components/AssessmentDetails';
// import PathwaysScreen from './components/Pathways';
// import Pathways2Screen from './components/Pathways2';
// import FavoritesScreen from './components/Favorites';
import ProfileScreen from './components/Profile';
// import SettingsScreen from './components/Settings';
// import FutureDetailsScreen from './components/FutureDetails';
// import CareerDetailsScreen from './components/CareerDetails';
// import WorkDetailsScreen from './components/WorkDetails';
// import EmployerDetailsScreen from './components/EmployerDetails';
// import SkillDetailsScreen from './components/SkillDetails';
// import InterestAssessmentScreen from './components/InterestAssessment';
// import GoalsScreen from './components/Goals';
// import DegreeScreen from './components/Degree';
// import NewSessionScreen from './components/NewSession';
// import EditSessionScreen from './components/EditSession';
// import NotificationsScreen from './components/Notifications';
// import AddAdvisorsScreen from './components/AddAdvisors';
// import EditChecklistScreen from './components/EditChecklist';
// import ViewResourceScreen from './components/ViewResource';
// import OrganizationScreen from './components/Organization';
// import ApplicationScreen from './components/Application';
// import CustomAssessmentScreen from './components/CustomAssessment';
// import TrackScreen from './components/Track';
// import EndorsementsScreen from './components/Endorsements';
// import EndorsementDetailsScreen from './components/EndorsementDetails';
// import IncomingScreen from './components/Incoming';
// import OutgoingScreen from './components/Outgoing';
// import WhyEndorseScreen from './components/WhyEndorse';
// import ChildRolesScreen from './components/ChildRoles';
// import ChildDetailsScreen from './components/ChildDetails';
// import ChangePasswordScreen from './components/ChangePassword';
// import OrgMentorsScreen from './components/OrgMentors';
// import MentorProfileScreen from './components/MentorProfile';

import AuthLoadingScreen from './components/AuthLoadingScreen';
import WelcomeScreen from './components/WelcomeScreen';
import SignInScreen from './components/SignInScreen';
import SignUpScreen from './components/SignUpScreen';
import WalkthroughScreen from './components/WalkthroughScreen';

// const TrendsStackNavigator = createStackNavigator({
//     Pathways2: {
//       screen: Pathways2Screen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Pathways`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     FutureDetails: {
//       screen: FutureDetailsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Future Details`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     Notifications: {
//       screen: NotificationsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Notifications`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     Advising: {
//       screen: WorkspaceScreen,
//       navigationOptions: ({ navigation }) => ({
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         },
//       }),
//     },
//     NewSession: {
//       screen: NewSessionScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `New Session`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     EditSession: {
//       screen: EditSessionScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Edit Session`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     AddAdvisors: {
//       screen: AddAdvisorsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Add Advisors`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     EditChecklist: {
//       screen: EditChecklistScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Edit Checklist`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     ViewResource: {
//       screen: ViewResourceScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `View Resource`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     CareerDetails: {
//       screen: CareerDetailsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Career Details`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     WorkDetails: {
//       screen: WorkDetailsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Work Details`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     EmployerDetails: {
//       screen: EmployerDetailsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Employer Details`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     SkillDetails: {
//       screen: SkillDetailsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Skill Details`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     Trends: {
//       screen: HomeScreen,
//       navigationOptions: ({ navigation }) => ({
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         },
//       }),
//     },
//     Application: {
//       screen: ApplicationScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Application`,
//         tabBarVisible: false,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     CustomAssessment: {
//       screen: CustomAssessmentScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Custom Assessment`,
//         tabBarVisible: false,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     Track: {
//       screen: TrackScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Track`,
//         tabBarVisible: false,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     ChildRoles: {
//       screen: ChildRolesScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Track Roles`,
//         tabBarVisible: false,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     ChildDetails: {
//       screen: ChildDetailsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Child Details`,
//         tabBarVisible: false,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     OrgMentors: {
//       screen: OrgMentorsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Mentors`,
//         tabBarVisible: false,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     MentorProfile: {
//       screen: MentorProfileScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Mentor Profile`,
//         tabBarVisible: false,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//   })
//
//   TrendsStackNavigator.navigationOptions = ({ navigation }) => {
//     let tabBarVisible = true
//     /*
//     if (navigation.state.index > 0) {
//       tabBarVisible = false;
//     }*/
//     return { tabBarVisible }
//   }
//
//   const FavoritesStackNavigator = createStackNavigator({
//       Favorites: {
//         screen: FavoritesScreen,
//         navigationOptions: ({ navigation }) => ({
//           tabBarVisible: true,
//           headerTitleStyle: { fontSize: 22 },
//           headerTintColor: 'white',
//           headerStyle: {
//             backgroundColor: '#73BAE6'
//           },
//         }),
//       },
//       Notifications: {
//         screen: NotificationsScreen,
//         navigationOptions: ({ navigation }) => ({
//           title: `Notifications`,
//           tabBarVisible: true,
//           headerTitleStyle: { fontSize: 22 },
//           headerTintColor: 'white',
//           headerStyle: {
//             backgroundColor: '#73BAE6'
//           }
//         }),
//       },
//       InterestAssessment: {
//         screen: InterestAssessmentScreen,
//         navigationOptions: ({ navigation }) => ({
//           title: `InterestAssessment`,
//           tabBarVisible: true,
//           headerTitleStyle: { fontSize: 22 },
//           headerTintColor: 'white',
//           headerStyle: {
//             backgroundColor: '#73BAE6'
//           }
//         }),
//       },
//       WorkDetails: {
//         screen: WorkDetailsScreen,
//         navigationOptions: ({ navigation }) => ({
//           title: `Work Details`,
//           tabBarVisible: true,
//           headerTitleStyle: { fontSize: 22 },
//           headerTintColor: 'white',
//           headerStyle: {
//             backgroundColor: '#73BAE6'
//           }
//         }),
//       },
//       CareerDetails: {
//         screen: CareerDetailsScreen,
//         navigationOptions: ({ navigation }) => ({
//           title: `Career Details`,
//           tabBarVisible: true,
//           headerTitleStyle: { fontSize: 22 },
//           headerTintColor: 'white',
//           headerStyle: {
//             backgroundColor: '#73BAE6'
//           }
//         }),
//       },
//       EmployerDetails: {
//         screen: EmployerDetailsScreen,
//         navigationOptions: ({ navigation }) => ({
//           title: `Employer Details`,
//           tabBarVisible: true,
//           headerTitleStyle: { fontSize: 22 },
//           headerTintColor: 'white',
//           headerStyle: {
//             backgroundColor: '#73BAE6'
//           }
//         }),
//       },
//       SkillDetails: {
//         screen: SkillDetailsScreen,
//         navigationOptions: ({ navigation }) => ({
//           title: `Skill Details`,
//           tabBarVisible: true,
//           headerTitleStyle: { fontSize: 22 },
//           headerTintColor: 'white',
//           headerStyle: {
//             backgroundColor: '#73BAE6'
//           }
//         }),
//       },
//     })
//
//     FavoritesStackNavigator.navigationOptions = ({ navigation }) => {
//       let tabBarVisible = true
//       /*
//       if (navigation.state.index > 0) {
//         tabBarVisible = false;
//       }*/
//       return { tabBarVisible }
//     }
//
//
// const InputsStackNavigator = createStackNavigator({
//     Inputs: {
//       screen: AssessmentsScreen,
//       navigationOptions: ({ navigation }) => ({
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         },
//       }),
//     },
//     AssessmentDetails: {
//       screen: AssessmentDetailsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Assessment Details`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     InterestAssessment: {
//       screen: InterestAssessmentScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `InterestAssessment`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     Notifications: {
//       screen: NotificationsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Notifications`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     Goals: {
//       screen: GoalsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Goals`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     Degree: {
//       screen: DegreeScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Degree`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     NewSession: {
//       screen: NewSessionScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `New Session`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     EditSession: {
//       screen: EditSessionScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Edit Session`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     EditChecklist: {
//       screen: EditChecklistScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Edit Checklist`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     ViewResource: {
//       screen: ViewResourceScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `View Resource`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//     CareerDetails: {
//       screen: CareerDetailsScreen,
//       navigationOptions: ({ navigation }) => ({
//         title: `Career Details`,
//         tabBarVisible: true,
//         headerTitleStyle: { fontSize: 22 },
//         headerTintColor: 'white',
//         headerStyle: {
//           backgroundColor: '#73BAE6'
//         }
//       }),
//     },
//   })
//
//   InputsStackNavigator.navigationOptions = ({ navigation }) => {
//     let tabBarVisible = true
//     /*
//     if (navigation.state.index > 0) {
//       tabBarVisible = false;
//     }*/
//     return { tabBarVisible }
//   }

  // const AdvisingStackNavigator = createStackNavigator({
  //     Endorsements: {
  //       screen: EndorsementsScreen,
  //       navigationOptions: ({ navigation }) => ({
  //         title: `Endorsements`,
  //         tabBarVisible: false,
  //         headerTitleStyle: { fontSize: 22 },
  //         headerTintColor: 'white',
  //         headerStyle: {
  //           backgroundColor: '#73BAE6'
  //         }
  //       }),
  //     },
  //     EndorsementDetails: {
  //       screen: EndorsementDetailsScreen,
  //       navigationOptions: ({ navigation }) => ({
  //         title: `Your Endorsement`,
  //         tabBarVisible: false,
  //         headerTitleStyle: { fontSize: 22 },
  //         headerTintColor: 'white',
  //         headerStyle: {
  //           backgroundColor: '#73BAE6'
  //         }
  //       }),
  //     },
  //     Incoming: {
  //       screen: IncomingScreen,
  //       navigationOptions: ({ navigation }) => ({
  //         title: `Incoming`,
  //         tabBarVisible: false,
  //         headerTitleStyle: { fontSize: 22 },
  //         headerTintColor: 'white',
  //         headerStyle: {
  //           backgroundColor: '#73BAE6'
  //         }
  //       }),
  //     },
  //     Outgoing: {
  //       screen: OutgoingScreen,
  //       navigationOptions: ({ navigation }) => ({
  //         title: `Outgoing`,
  //         tabBarVisible: false,
  //         headerTitleStyle: { fontSize: 22 },
  //         headerTintColor: 'white',
  //         headerStyle: {
  //           backgroundColor: '#73BAE6'
  //         }
  //       }),
  //     },
  //     WhyEndorse: {
  //       screen: WhyEndorseScreen,
  //       navigationOptions: ({ navigation }) => ({
  //         title: `Why Endorse`,
  //         tabBarVisible: false,
  //         headerTitleStyle: { fontSize: 22 },
  //         headerTintColor: 'white',
  //         headerStyle: {
  //           backgroundColor: '#73BAE6'
  //         }
  //       }),
  //     },
  //     Notifications: {
  //       screen: NotificationsScreen,
  //       navigationOptions: ({ navigation }) => ({
  //         title: `Notifications`,
  //         tabBarVisible: true,
  //         headerTitleStyle: { fontSize: 22 },
  //         headerTintColor: 'white',
  //         headerStyle: {
  //           backgroundColor: '#73BAE6'
  //         }
  //       }),
  //     },
  //   })
  //
  //   AdvisingStackNavigator.navigationOptions = ({ navigation }) => {
  //     let tabBarVisible = true
  //     /*
  //     if (navigation.state.index > 0) {
  //       tabBarVisible = false;
  //     }*/
  //     return { tabBarVisible }
  //   }

    const ProfileStackNavigator = createStackNavigator({
        Profile: {
          screen: ProfileScreen,
          navigationOptions: ({ navigation }) => ({
            tabBarVisible: true,
            headerTintColor: 'white',
            headerTitleStyle: { fontSize: 22 },
            headerStyle: {
              backgroundColor: '#73BAE6'
            },
          }),
        },
        // Settings: {
        //   screen: SettingsScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     title: `Settings`,
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     }
        //   }),
        // },
        // Notifications: {
        //   screen: NotificationsScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     title: `Notifications`,
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     }
        //   }),
        // },
        // Trends: {
        //   screen: HomeScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     },
        //   }),
        // },
        // Organization: {
        //   screen: OrganizationScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     title: `Organization`,
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     }
        //   }),
        // },
        // Advising: {
        //   screen: WorkspaceScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     },
        //   }),
        // },
        // NewSession: {
        //   screen: NewSessionScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     title: `New Session`,
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     }
        //   }),
        // },
        // EditSession: {
        //   screen: EditSessionScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     title: `Edit Session`,
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     }
        //   }),
        // },
        // AddAdvisors: {
        //   screen: AddAdvisorsScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     title: `Add Advisors`,
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     }
        //   }),
        // },
        // EditChecklist: {
        //   screen: EditChecklistScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     title: `Edit Checklist`,
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     }
        //   }),
        // },
        // ViewResource: {
        //   screen: ViewResourceScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     title: `View Resource`,
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     }
        //   }),
        // },
        // ChangePassword: {
        //   screen: ChangePasswordScreen,
        //   navigationOptions: ({ navigation }) => ({
        //     title: `Change Password`,
        //     tabBarVisible: true,
        //     headerTitleStyle: { fontSize: 22 },
        //     headerTintColor: 'white',
        //     headerStyle: {
        //       backgroundColor: '#73BAE6'
        //     }
        //   }),
        // },
      })

  ProfileStackNavigator.navigationOptions = ({ navigation }) => {
    let tabBarVisible = true
    /*
    if (navigation.state.index > 0) {
      tabBarVisible = false;
    }*/
    return { tabBarVisible }
  }


const AppTabNavigator = createBottomTabNavigator({
    ProfileStack: {
      screen: ProfileStackNavigator,
      navigationOptions: {
        tabBarLabel: 'Profile',
        tabBarIcon: ({ tintColor }) => (
          <Icon name="ios-contact" size={24} color={tintColor} />
        )
      }
    },
  }, {
    navigationOptions: {

      tabBarVisible: true
    },
    tabBarOptions: {
      activeTintColor: '#73BAE6',
      inactiveTintColor: 'grey',
      showLabel: false
    }
  })

  AppTabNavigator.navigationOptions = ({ navigation }) => {

  };﻿

  const AuthStackNavigator = createStackNavigator({
    Welcome: WelcomeScreen,
    SignIn: SignInScreen,
    SignUp: SignUpScreen,
    Walkthrough: WalkthroughScreen
  })

  const RouterComponent = createSwitchNavigator({
    AuthLoading: AuthLoadingScreen,
    Auth: AuthStackNavigator,
    App: AppTabNavigator
  })

export default RouterComponent;
