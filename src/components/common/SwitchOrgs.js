import React, {Component} from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Platform, ActivityIndicator, Switch, TextInput, Image } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';

const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png'
const addIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon-blue.png'
const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png'

class SwitchOrgs extends Component {
    constructor(props) {
        super(props)

        this.state = {
          myOrgs: [], academies: [], dataToShare: [], sharePartners: []
        }

        this.retrieveData = this.retrieveData.bind(this)
        this.formChangeHandler = this.formChangeHandler.bind(this)

        this.renderOrganizations = this.renderOrganizations.bind(this)
        this.orgClicked = this.orgClicked.bind(this)
        this.addOrg = this.addOrg.bind(this)
        this.confirmOrg = this.confirmOrg.bind(this)
        this.renderDataToShare = this.renderDataToShare.bind(this)

    }

    componentDidMount() {

      this.retrieveData()
    }

    componentDidUpdate(prevProps) {
      console.log('componentDidUpdate called ', this.props.activeOrg, prevProps)

      if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode || this.props.roleName !== prevProps.roleName) {
        this.retrieveData()
      }
    }

    retrieveData = async() => {
      try {
        console.log('retrieveData called in renderPosts')

        // const emailId = await AsyncStorage.getItem('email');
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
        //
        // this.setState({ emailId, cuFirstName, cuLastName, activeOrg, orgFocus, roleName, username, pictureURL,
        //   sharePosting, originalPost, posts, groupId, groupName, jobTitle
        // })

        const emailId = this.props.emailId
        const activeOrg = this.props.activeOrg
        let myOrgs = this.props.myOrgs
        if (!myOrgs) {
          myOrgs = ['guidedcompass']
        } else {
          if (!myOrgs.includes('guidedcompass')) {
            myOrgs.unshift('guidedcompass')
          }
        }

        let sharePartners = this.props.sharePartners
        if (!sharePartners) {
          sharePartners = []
        }

        const roleName = this.props.roleName

        let academies = this.props.academies
        if (!academies) {
          academies = []
        }

        let academyCodes = this.props.academyCodes
        if (!academyCodes) {
          academyCodes = []
        }

        const accountCode = this.props.accountCode

        let dataToShare = [
          'Name', 'Profile Photo','Resume URL','LinkedIn URL','Portfolio URL','School','Major / Pathway','Graduation Year','Race','Gender','Veteran Status','Work Authorization','Projects','Experience','Career Assessments','Endorsements'
        ]

        this.setState({ emailId, activeOrg, myOrgs, sharePartners, roleName, academies, academyCodes, accountCode, dataToShare })

        let isEmployer = false
        if (roleName === 'Employer' || roleName === 'Employer Representative') {
          isEmployer = true
        }

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
        .then((response) => {
          console.log('Org info query attempted', response.data);

            if (response.data.success) {
              console.log('org info query worked')

              const orgName = response.data.orgInfo.orgName
              const academies = response.data.orgInfo.academies

              console.log('show academies: ', academies)
              let academyCodes = []
              if (academies && academies.length > 0) {
                for (let i = 1; i <= academies.length; i++) {
                  academyCodes.push(academies[i - 1].orgCode)
                }
              }

              this.setState({ orgName, academies, academyCodes });

              // let courses = []
              // if (response.data.orgInfo.courseIds && response.data.orgInfo.courseIds.length > 0) {
              //   console.log('courses exist')
              //
              // }

            } else {
              console.log('org info query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
        });

        Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email: emailId } })
        .then((response) => {

            if (response.data.success) {
              console.log('User profile query worked', response.data);

              const firstNameValue = response.data.user.firstName
              const lastNameValue = response.data.user.lastName
              const linkedInURLValue = response.data.user.linkedInURL
              const resumeURLValue = response.data.user.resumeURL
              const customWebsiteURLValue = response.data.user.customWebsiteURL
              const jobTitle = response.data.user.jobTitle
              const employerName = response.data.user.employerName
              const workZipcode = response.data.user.workZipcode
              const workTenure = response.data.user.workTenure
              const overallFit = response.data.user.overallFit
              const degreeAttained = response.data.user.degreeAttained
              const schoolName = response.data.user.schoolName
              const studyFields = response.data.user.studyFields
              const myOrgs = response.data.user.myOrgs

              this.setState({
                firstNameValue, lastNameValue, linkedInURLValue, resumeURLValue, customWebsiteURLValue,
                jobTitle, employerName, workZipcode, workTenure, overallFit, degreeAttained, schoolName, studyFields,
                myOrgs
              });

              const courseIds = response.data.user.courseIds

              if (courseIds && courseIds.length > 0) {
                // pull from courses

                Axios.get('https://www.guidedcompass.com/api/courses', { params: { courseIds } })
                .then((response) => {

                    if (response.data.success) {
                      console.log('Courses query worked', response.data);

                      const courses = response.data.courses
                      this.setState({ courses })

                    } else {
                      console.log('no course details found', response.data.message)
                    }

                }).catch((error) => {
                    console.log('course query did not work', error);
                });

                Axios.get('https://www.guidedcompass.com/api/grades', { params: { orgCode: activeOrg, courseIds } })
                .then((response) => {
                  console.log('Grades query attempted', response.data);

                    if (response.data.success) {
                      console.log('grades query worked')

                      const grades = response.data.grades
                      const students = response.data.students
                      const projectNames = response.data.projectNames

                      this.setState({ grades, students, projectNames })

                    } else {
                      console.log('grades query did not work', response.data.message)
                    }

                }).catch((error) => {
                    console.log('Grades query did not work for some reason', error);
                });

              }

            } else {
              console.log('no user details found', response.data.message)

            }

        }).catch((error) => {
            console.log('User profile query did not work', error);
        });

      } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
      }
    }

    formChangeHandler(eventName,eventValue) {
      console.log('formChangeHandler called')

      if (eventName === 'search') {
        this.setState({ searchString: eventValue, textFormHasChanged: true })
      }
    }

    renderOrganizations(type) {
      console.log('renderOrganizations', type)

      let rows = []
      console.log('window path does not include employers: ', this.state.myOrgs, this.state.sharePartners)
      let orgOptions = []
      if (type === 'all') {
        orgOptions = this.state.myOrgs
      } else if (type === 'academies') {
        orgOptions = this.state.academies
      }

      for (let i = 1; i <= orgOptions.length; i++) {
        const index = i - 1

        rows.push(
          <View key={i} style={[styles.row5,styles.rightPadding20]}>
            <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder]} onPress={() => this.orgClicked(index, type)}>
              <View style={[styles.rowDirection]}>
                <View>
                  {(type === 'all') ? (
                    <Text>{orgOptions[i - 1]}</Text>
                  ) : (
                    <Text>{orgOptions[i - 1].name}</Text>
                  )}
                </View>
                {(type === 'all') ? (
                  <View style={[styles.leftPadding,styles.rightText]} >
                    {(this.state.activeOrg === orgOptions[i - 1]) && (
                      <Image source={{ uri: checkmarkIcon}} style={[styles.square17,styles.contain]} />
                    )}
                  </View>
                ) : (
                  <View style={[styles.leftPadding,styles.rightText]} >
                    {(this.state.activeOrg === orgOptions[i - 1].orgCode) && (
                      <Image source={{ uri: checkmarkIcon}} style={[styles.square17,styles.contain,styles]} />
                    )}
                  </View>
                )}
              </View>
            </TouchableOpacity>
          </View>
        )
      }

      return rows
    }

    orgClicked(index, type) {
      console.log('orgClicked clicked', index, type, this.state.roleName)

      let orgOptions = []
      if (type === 'all') {
        orgOptions = this.state.myOrgs
      } else if (type === 'academies') {
        orgOptions = this.state.academyCodes
      }

      let activeOrg = ''
      if (this.state.activeOrg !== orgOptions[index]) {
        activeOrg = orgOptions[index]

        this.setState({ activeOrg })
        localStorage.setItem('activeOrg', activeOrg)

        const emailId = this.state.emailId
        const updatedAt = new Date()

        Axios.post('https://www.guidedcompass.com/api/users/profile/details', {
          emailId, activeOrg, updatedAt })
        .then((response) => {

          if (response.data.success) {
            //save values
            console.log('User update worked', response.data);

            //update the orgFocus
            Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
            .then((response) => {
              console.log('Org query attempted', response.data);

               if (response.data.success) {
                 console.log('successfully retrieved org')

                 const orgFocus = response.data.orgInfo.orgFocus
                 const studentAlias = response.data.orgInfo.studentAlias

                 localStorage.setItem('orgFocus', orgFocus)
                 localStorage.setItem('studentAlias', studentAlias)

                 const serverPostSuccess = true
                 const serverSuccessMessage = 'Active org successfully changed and saved!'

                 this.setState({ orgFocus, serverPostSuccess, serverSuccessMessage })
                 // this.props.passActiveOrg(activeOrg)

               } else {
                 console.log('no org data found', response.data.message)
               }

            }).catch((error) => {
               console.log('Org query did not work', error);
               this.setState({ serverErrorMessage: 'No org found'})
            });

          } else {
            console.error('there was an error saving the new active org');
            this.setState({
              serverPostSuccess: false,
              serverErrorMessage: response.data.message,
            })
          }
        }).catch((error) => {
            console.log('Saving the active org did not work', error);
        });
      }
    }

    addOrg() {
      console.log('addOrg called')

      let orgCode = this.state.searchString
      if (orgCode && orgCode !== '') {

        orgCode = orgCode.toLowerCase()

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode } })
        .then((response) => {
          console.log('Org query attempted', response.data);

           if (response.data.success) {
             console.log('successfully retrieved org')

             const myOrgs = this.state.myOrgs
             if (myOrgs) {
               if (!myOrgs.includes(orgCode)) {
                 const orgName = response.data.orgInfo.orgName
                 const tempOrg = response.data.orgInfo
                 this.setState({ modalIsOpen: true, orgName, tempOrg })
               } else {
                 this.setState({ serverErrorMessage: 'You have already joined this organization'})
               }
             } else {
               const orgName = response.data.orgInfo.orgName
               this.setState({ modalIsOpen: true, orgName })
             }

           } else {
             console.log('no org data found', response.data.message)
             this.setState({ serverErrorMessage: 'No org found'})
           }

        }).catch((error) => {
           console.log('Org query did not work', error);
           this.setState({ serverErrorMessage: 'No org found'})
        });
      } else {
        this.setState({ serverErrorMessage: 'No org found'})
      }
    }

    confirmOrg() {
      console.log('confirmOrg called')

      this.setState({ serverSuccessMessage: null, serverErrorMessage: null })

      const emailId = this.state.emailId
      const activeOrg = this.state.searchString.toLowerCase()
      let myOrgs = this.state.myOrgs
      myOrgs.push(activeOrg)
      const updatedAt = new Date()

      Axios.post('https://www.guidedcompass.com/api/users/profile/details', {
        emailId, activeOrg, myOrgs, updatedAt })
      .then((response) => {

        if (response.data.success) {
          //save values
          console.log('User update worked', response.data);

          const orgFocus = this.state.tempOrg.orgFocus
          const studentAlias = this.state.tempOrg.studentAlias

          localStorage.setItem('activeOrg', activeOrg)
          localStorage.setItem('myOrgs', JSON.stringify(myOrgs))
          localStorage.setItem('orgFocus', orgFocus)
          localStorage.setItem('studentAlias', studentAlias)

          const searchString = ''
          const modalIsOpen = false

          this.setState({ activeOrg, myOrgs, orgFocus, searchString, modalIsOpen,

            serverPostSuccess: true,
            serverSuccessMessage: 'Organization successfully added!'
          })

          // this.props.passActiveOrg(activeOrg)

        } else {
          console.error('there was an error updating the user info');
          this.setState({
            serverPostSuccess: false,
            serverErrorMessage: response.data.message,
          })
        }
      }).catch((error) => {
          console.log('User info save did not work', error);
      });
    }

    renderDataToShare(passedIndex) {
      console.log('renderDataToShare called', passedIndex)

      let rows = []
      for (let i = 1; i <= this.state.dataToShare.length; i++) {
        const index = i - 1
        // console.log('log index: ', index)
        const remainder = index % 3
        console.log('show modulo: ', index, remainder)

        if (passedIndex === remainder) {
          if (this.state.dataToShare[index]) {
            rows.push(
              <View key={i.toString + "dataToShare"}>
                <View className="float-left right-margin">
                  <Image source={{ uri: checkmarkIcon}} className="image-auto-20" />
                </View>
                <View className="float-left">
                  <Text>{this.state.dataToShare[index]}</Text>
                </View>

                <View style={[styles.halfSpacer]} />
              </View>
            )
          }
        }
      }

      return rows
    }

    render() {

      return (
        <View>
          {(this.props.academies) ? (
            <View>
              <View className="float-left right-padding">
                <Text style={[styles.standardText,styles.row10]}>Switch Career Academies</Text>
              </View>

              {(this.state.editMode) && (
                <View>
                  <View className="filter-field-search half-width">
                    <View className="search-icon-container">
                      <Image source={{ uri: searchIcon}}/>
                    </View>
                    <View className="filter-search-container calc-column-offset-50" >
                      <TextInput
                        style={styles.height30}
                        onChangeText={(text) => this.formChangeHandler('search', text)}
                        value={this.state.searchString}
                        placeholder={"Search by org code..."}
                        placeholderTextColor="grey"
                      />
                    </View>
                  </View>

                  <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                  <View>
                    <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.addOrg()}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add Org</Text></TouchableOpacity>
                  </View>

                  {(this.state.serverSuccessMessage) && <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessage}</Text>}
                  {(this.state.serverErrorMessage) && <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>}
                  <View style={[styles.spacer]} />
                </View>
              )}

              <View style={[styles.rowDirection,styles.flexWrap]}>
                {this.renderOrganizations('academies')}
              </View>

              <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
              <View style={[styles.horizontalLine]} />
              <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
            </View>
          ) : (
            <View>
              <View>
                <View className="float-left right-padding">
                  <Text style={[styles.standardText,styles.row10]}>Manage My Organizations</Text>
                </View>
                <View className="float-left right-padding">
                  <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                  <TouchableOpacity className="background-button" onPress={() => this.setState({ editMode: true })}>
                    <Image source={{ uri: addIconBlue}} className="image-auto-20" />
                  </TouchableOpacity>
                </View>

                {(this.state.editMode) && (
                  <View>
                    <View className="filter-field-search half-width">
                      <View className="search-icon-container">
                        <Image source={{ uri: searchIcon}}/>
                      </View>
                      <View className="filter-search-container calc-column-offset-50" >
                        <input type="text" className="text-field clear-border" placeholder="Search by org code..." name="search" value={this.state.searchString} onChange={this.formChangeHandler}/>
                      </View>
                    </View>

                    <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

                    <View>
                      <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.addOrg()}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add Org</Text></TouchableOpacity>
                    </View>

                    {(this.state.serverSuccessMessage) && <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessage}</Text>}
                    {(this.state.serverErrorMessage) && <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>}
                    <View style={[styles.spacer]} />
                  </View>
                )}

                <View style={[styles.rowDirection,styles.flexWrap]}>
                  {this.renderOrganizations('all')}
                </View>

              </View>

              <View style={[styles.spacer]} />
              <View style={[styles.horizontalLine]} />
            </View>
          )}

          <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>

              <View style={[styles.flex1,styles.flexCenter,styles.padding20]}>
                {(this.state.modalIsOpen) && (
                  <View>
                    <Text style={[styles.headingText2]}>You Are About to Join the {this.state.orgName} Portal</Text>
                    <Text>But before you do, please confirm that you are willing to share the following profile data:</Text>

                    <View style={[styles.spacer]} />

                    <View style={[styles.padding20,styles.rowDirection,styles.calcColumn120]}>
                      <View style={[styles.flex33,styles.padding5]}>
                        {this.renderDataToShare(0)}
                      </View>
                      <View style={[styles.flex33,styles.padding5]}>
                        {this.renderDataToShare(1)}
                      </View>
                      <View style={[styles.flex33,styles.padding5]}>
                        {this.renderDataToShare(2)}
                      </View>
                    </View>

                    <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

                    <View style={[styles.rowDirection]}>
                     <View style={[styles.rightPadding]}>
                       <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.confirmOrg()}><Text style={[styles.descriptionText1,styles.whiteColor]}>I Agree To Share My Data with {this.state.orgName}</Text></TouchableOpacity>
                     </View>
                     <View>
                       <TouchableOpacity style={[styles.btnSquarish,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.descriptionText1,styles.ctaColor]}>Close Modal</Text></TouchableOpacity>
                     </View>

                    </View>
                  </View>
                )}
              </View>

          </Modal>
        </View>
      )
    }
}

export default SwitchOrgs
