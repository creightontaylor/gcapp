import Axios from 'axios';
import { AsyncStorage, Platform } from 'react-native';

export const saveAnalytics = async(emailId, eventName)=>{
  console.log('saveAnalytics called', emailId, eventName)

  try {

    const activeOrg = await AsyncStorage.getItem('activeOrg')
    const platform = Platform.OS
    // console.log('testers: ', emailId, eventName, activeOrg, platform)
    console.log('about to post to analytics')
    
    Axios.post('https://www.guidedcompass.com/api/analytics', { emailId, eventName, activeOrg, platform })
    .then((response) => {
      console.log('Analytics save attempted', response.data);

      if (response.data.success) {
        console.log('Analytics save worked')

      }

    }).catch((error) => {
        console.log('Analytics save did not work for some reason', error);
        return { error: { message: error }}
    });

  } catch (error) {
   // Error retrieving data
   console.log('there was an error saving analytics', error)
  }

  // return await Axios.post('https://www.guidedcompass.com/api/users/logout', { email })
  // .then((response) => {
  //   console.log('Logout attempted', response.data);
  //
  //   if (response.data.success) {
  //     console.log('Logout worked', email)
  //
  //     AsyncStorage.clear()
  //     this.props.navigation.navigate('AuthLoading', { reloadScreen: true });
  //
  //   } else {
  //     console.log('logout did not work', response.data.message)
  //     //don't allow signups without an org affiliation
  //     return { success: false, message: response.data.message }
  //
  //   }
  //
  // }).catch((error) => {
  //     console.log('Logout did not work for some reason', error);
  //     return { error: { message: error }}
  // });
}
