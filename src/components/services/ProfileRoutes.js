import Axios from 'axios';

export const requestAccessToWorkspace = async(email, orgCode, orgName, requestType, orgContactFirstName, orgContactLastName, orgContactEmail, signUpFields, accountCode, employerName, sharePartners)=>{
  console.log('requestAccessToWorkspace called', email, orgCode, orgName, requestType, orgContactFirstName, orgContactLastName, orgContactEmail, signUpFields, accountCode, employerName, sharePartners)

  if (!email || email === '') {
    return { errorMessage: 'Please add your email' }
  } else if (!orgCode || orgCode === '') {
    return { errorMessage: 'please add your org code' }
  } else if (!requestType || requestType === '') {
    return { errorMessage: 'there was an error determing the request type' }
  } else {

    console.log('about to try to save')

    if (accountCode) {
      // adjust employers training partners
      return await Axios.post('https://www.guidedcompass.com/api/account/update', { accountCode, activeOrg: orgCode, keepActiveOrg: true })
      .then((response) => {
        console.log('Attempting to add training organization', response.data);

        if (response.data.success) {
          console.log('Added training organization worked', email)

          return { success: true, successMessage: response.data.message }

        } else {
          console.log('Adding training organization did not work', response.data.message)
          //don't allow signups without an org affiliation
          return { success: false, errorMessage: response.data.message }

        }

      }).catch((error) => {
          console.log('Adding training organization did not work for some reason', error);
          return { success: false, errorMessage: error }
      });
    } else {
      return await Axios.get('https://www.guidedcompass.com/api/request-access-to-workspace', { params: { email, orgCode, orgName, requestType, orgContactFirstName, orgContactLastName, orgContactEmail, signUpFields }})
      .then((response) => {
        console.log('Request to access workspace attempted', response.data);

        if (response.data.success) {
          console.log('Request to access workspace worked', email)

          return { success: true, successMessage: response.data.message }

        } else {
          console.log('Request to access workspace did not work', response.data.message)
          //don't allow signups without an org affiliation
          return { success: false, errorMessage: response.data.message }

        }

      }).catch((error) => {
          console.log('Request to access workspace did not work for some reason', error);
          return { success: false, errorMessage: error }
      });
    }
  }
}
