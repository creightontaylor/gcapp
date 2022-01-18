import Axios from 'axios';
import { AsyncStorage } from 'react-native';

export const signUp = async(firstName, lastName, email, password, gradYear, jobTitle, employerName, orgCode, roleName, otherRoleName, courseId, workId, school, schoolDistrict, accountCode, studentBenefits, teacherBenefits, mentorBenefits, employerBenefits, confirmEmail, passedOrgName, passedOrgURL, passedOrgRegion, passedOrgDescription, employerURL, employerLocation, employerDescription)=>{
  console.log('signUp called', firstName, lastName, email, password, gradYear, jobTitle, employerName, orgCode, roleName, otherRoleName, courseId, workId, school, schoolDistrict, accountCode, studentBenefits, teacherBenefits, mentorBenefits, employerBenefits, confirmEmail, passedOrgName, passedOrgURL, passedOrgRegion, passedOrgDescription, employerURL, employerLocation, employerDescription)

  let createdAt = new Date();
  let updatedAt = new Date();
  let platform = 'web'

  if (!firstName || firstName === '') {
    return { error: { message: 'please enter your first name' }}
  } else if (!lastName || lastName === '') {
    return { error: { message: 'please enter your last name' }}
  } else if (!email || email === '') {
    return { error: { message: 'please enter your email' }}
  } else if (!email.includes('@')) {
    return { error: { message: 'email invalid. please enter a valid email' }}
  } else if (!password || password === '') {
    return { error: { message: 'please enter a password' }}
  } else if (!orgCode || orgCode === '') {
    return { error: { message: 'please add the code affiliated with a Guided Compass partner' }}
  } else if (!roleName) {
    return { error: { message: 'please indicate the closest answer to your role' }}
  } else if (roleName.toLowerCase() === 'student' && gradYear === '') {
    return { error: { message: 'please enter your expected graduation year' }}
  } else if (password.length < 7) {
    return { error: { message: 'please enter a password over 6 characters' }}
  } else if (roleName.toLowerCase() === 'mentor' && jobTitle === '') {
    return { error: { message: 'please enter your job title' }}
  } else if (roleName.toLowerCase() === 'mentor' && employerName === '') {
    return { error: { message: 'please enter the name of your employer' }}
  } else {

    console.log('about to try to save')

    //we will assume username is unique for now
    let combinedNames = firstName + lastName
    let username = combinedNames.toLowerCase();

    let activeOrg = orgCode.toLowerCase()

    return await Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
    .then(async(response) => {
      console.log('Org info query attempted', response.data);

        if (response.data.success) {
          console.log('org info query worked', email)

          email = email.toLowerCase()
          let orgName = response.data.orgInfo.orgName
          if (passedOrgName) {
            orgName = passedOrgName
          }
          const orgFocus = response.data.orgInfo.orgFocus
          const orgContactFirstName = response.data.orgInfo.contactFirstName
          const orgContactLastName = response.data.orgInfo.contactLastName
          const orgContactEmail = response.data.orgInfo.contactEmail
          const studentAlias = response.data.orgInfo.studentAlias
          const headerImageURL = response.data.orgInfo.headerImageURL
          const publicOrg = response.data.orgInfo.isPublic
          const placementPartners = response.data.orgInfo.placementPartners

          const myOrgs = [activeOrg]
          const courseIds = [courseId]
          const workIds = [workId]

          let workMode = false
          if (roleName && roleName.toLowerCase() === 'worker') {
            roleName = 'Student'
            workMode = true
          }

          if (orgFocus === 'Placement') {
            school = ''
          }

          let isAdvisor = false
          let isOrganization = false
          let isEmployer = false

          let benefits = undefined
          if (roleName === 'Student') {
            jobTitle = 'Student'
            employerName = 'None'
            benefits = studentBenefits
          } else if (roleName === 'Teacher') {
            isAdvisor = true
            jobTitle = 'Teacher'
            employerName = school
            benefits = teacherBenefits
          } else if (roleName === 'Admin' || roleName === 'admin') {
            isOrganization = true
          } else if (roleName === 'Mentor') {
            isAdvisor = true
            if (!accountCode) {
              accountCode = employerName.replace('"','').replace("<","").replace(">","").replace("%","").replace("{","").replace("}","").replace("|","").replace("^","").replace("~","").replace("[","").replace("]","").replace("`","").replace(/ /g,"").replace(/,/g,"").toLowerCase()
            }
            benefits = mentorBenefits
          } else if (roleName === 'Employer') {
            isEmployer = true
            if (!accountCode) {
              accountCode = employerName.replace('"','').replace("<","").replace(">","").replace("%","").replace("{","").replace("}","").replace("|","").replace("^","").replace("~","").replace("[","").replace("]","").replace("`","").replace(/ /g,"").replace(/,/g,"").toLowerCase()
            }
            benefits = employerBenefits
          }

          if (benefits) {
            for (let i = 1; i <= benefits.length; i++) {
              benefits[i - 1]['detail'] = benefits[i - 1].detail.replace(/{{orgName}}/g,orgName)
            }
          }

          const openToMentoring = true
          const orgURL = passedOrgURL
          const orgRegion = passedOrgRegion
          const orgDescription = passedOrgDescription

          return await Axios.post('https://www.guidedcompass.com/api/users/register', {
            firstName,lastName, username, email, password, gradYear, orgName, courseIds, workIds,
            orgContactFirstName, orgContactLastName, orgContactEmail,
            activeOrg, myOrgs, roleName, otherRoleName, school, schoolDistrict, jobTitle, employerName, accountCode,
            createdAt, updatedAt, platform, openToMentoring, benefits, headerImageURL,
            isAdvisor, isOrganization, isEmployer, confirmEmail, workMode,
            orgURL, orgRegion, orgDescription,
            employerURL, employerLocation, employerDescription
            })
          .then((response) => {
              console.log('Register users', response.data);

              if (response.data.success) {
                console.log('Register query worked')

                AsyncStorage.setItem('email', email)//this.props.auth.email
                AsyncStorage.setItem('username', username)
                AsyncStorage.setItem('firstName', firstName)
                AsyncStorage.setItem('lastName', lastName)
                // AsyncStorage.setItem('isAdvisor', 'false')
                // AsyncStorage.setItem('isAdvisee', 'true')
                AsyncStorage.setItem('unreadNotificationsCount', 0)
                AsyncStorage.setItem('orgAffiliation', '')
                AsyncStorage.setItem('activeOrg', activeOrg)
                AsyncStorage.setItem('orgFocus', orgFocus)
                AsyncStorage.setItem('myOrgs', JSON.stringify(myOrgs))
                AsyncStorage.setItem('orgName', orgName)
                AsyncStorage.setItem('roleName', roleName)
                AsyncStorage.setItem('publicOrg', publicOrg)
                if (placementPartners) {
                  AsyncStorage.setItem('placementPartners', JSON.stringify(placementPartners))
                }

                if (accountCode) {
                  AsyncStorage.setItem('emp', accountCode)
                }

                if (roleName.toLowerCase() === 'worker') {
                  AsyncStorage.setItem('workMode', 'true')
                }

                if (studentAlias) {
                  AsyncStorage.setItem('studentAlias', studentAlias)
                } else {
                  AsyncStorage.removeItem('studentAlias')
                }

                return { success: true, message: 'New user created', user: response.data.user }

              } else {
                console.log('register query did not work', response.data.message)
                return { error: { message: response.data.message }}

              }

          }).catch((error) => {
              console.log('Register query did not work for some reason', error);
              return { error: { message: error }}
          });

        } else {
          console.log('org info query did not work', response.data.message)
          //don't allow signups without an org affiliation
          return { error: { message: response.data.message }}

        }

    }).catch((error) => {
        console.log('Org info query did not work for some reason', error);
        return { error: { message: error }}
    });
  }
}

export const signIn = async(email, password, orgFocus)=>{
  console.log('signIn called', email, password, orgFocus)

  if (email === '') {
    return { error: { message: 'please enter your email' }}
  } else if (password === '') {
    return { error: { message: 'please enter your password' }}
  } else {

    return await Axios.post('https://www.guidedcompass.com/api/users/login', { email, password })
    .then((response) => {
      console.log('Login attempted', response.data);

        if (response.data.success) {
          console.log('Login worked', email)

          AsyncStorage.setItem('email', email)
          AsyncStorage.setItem('username', response.data.user.username)
          AsyncStorage.setItem('firstName', response.data.user.firstName)
          AsyncStorage.setItem('lastName', response.data.user.lastName)
          AsyncStorage.setItem('unreadNotificationsCount', 0)

          if (response.data.user.workMode === true) {
            AsyncStorage.setItem('workMode', 'true')
          } else {
            AsyncStorage.setItem('workMode', 'false')
          }

          if (response.data.user.isAdvisor) {
            AsyncStorage.setItem('isAdvisor', 'true')
          } else {
            AsyncStorage.setItem('isAdvisor', 'false')
            AsyncStorage.setItem('isAdvisee', 'true')
          }

          if (response.data.user.orgAffiliation) {
            if (response.data.user.orgAffiliation === 'admin') {
              AsyncStorage.setItem('orgAffiliation', 'admin')
            } else {
              AsyncStorage.setItem('orgAffiliation', '')
            }
          } else {
            AsyncStorage.setItem('orgAffiliation', '')
          }
          if (response.data.user.myOrgs) {
            AsyncStorage.setItem('myOrgs', JSON.stringify(response.data.user.myOrgs))
          }

          if (response.data.user.activeOrg) {
            AsyncStorage.setItem('activeOrg', response.data.user.activeOrg)
            AsyncStorage.setItem('orgFocus', orgFocus)
          }
          console.log('show roleName on signin: ', response.data.user.roleName)
          if (response.data.user.roleName) {
            AsyncStorage.setItem('roleName', response.data.user.roleName)
          }

          if (this.props.fromAdvisor) {
            // mentor or teacher

            if (response.data.user.roleName !== 'Student') {

              return { success: true, message: 'successfully logged in as advisor', user: response.data.user }
            } else {
              // error - students can't view
              this.setState({ error: { message: 'Error, you dont have permission to view this portal'}})
            }

          } else {

            return { success: true, message: 'successfully logged in as student', user: response.data.user }
          }

        } else {
          console.log('login did not work', response.data.message)
          //don't allow signups without an org affiliation
          // return { error: { message: response.data.message }}
          return { success: false, message: response.data.message }

        }

    }).catch((error) => {
        console.log('Login did not work for some reason', error);
        return { error: { message: error }}
    });
  }
}

export const signOut = async(email, activeOrg, orgFocus, accountCode, roleName, navigation)=>{
  console.log('signOut called', email, activeOrg, orgFocus, accountCode, roleName, navigation)

  let logoutLink = '/signin'
  if (this.props.fromAdvisor) {
    logoutLink = '/advisor/signin'
    if (orgFocus && orgFocus === 'Placement' && roleName) {
        //organizations
        logoutLink = '/organizations/' + activeOrg + '/' + roleName.toLowerCase() + '/signin'
    } else {
      // schools
      if (roleName) {
        logoutLink = '/schools/' + activeOrg + '/' + roleName.toLowerCase() + '/signin'
      }
    }
  } else {
    // student
    if (orgFocus && orgFocus === 'Placement') {
        //organizations
        logoutLink = '/organizations/' + activeOrg + '/student/signin'
    } else {
      // schools
      logoutLink = '/schools/' + activeOrg + '/student/signin'
    }
  }

  return await Axios.post('https://www.guidedcompass.com/api/users/logout', { email })
  .then((response) => {
    console.log('Logout attempted', response.data);

    if (response.data.success) {
      console.log('Logout worked', email)

      AsyncStorage.clear()
      this.props.navigation.navigate('AuthLoading', { reloadScreen: true });

    } else {
      console.log('logout did not work', response.data.message)
      //don't allow signups without an org affiliation
      return { success: false, message: response.data.message }

    }

  }).catch((error) => {
      console.log('Logout did not work for some reason', error);
      return { error: { message: error }}
  });
}
