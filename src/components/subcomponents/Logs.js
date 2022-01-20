import React, { Component } from 'react';
import { ScrollView, View, Text, TouchableOpacity, AsyncStorage, Image } from 'react-native';
import Modal from 'react-native-modal';
import Axios from 'axios';
const styles = require('../css/style');
const logIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/log-icon-dark.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const addIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-icon.png';

import {convertDateToString} from '../functions/convertDateToString';
import SubEditLog from '../subcomponents/EditLog';

class Logs extends Component {
  constructor(props) {
    super(props)
    this.state = {
      sessions: [],
      logs: [],
      subNavCategories: ['All','Goals','Advising Sessions','Applications','Interviews','Offers','Passions'],
      subNavSelected: 'All',

      sessionErrorMessage: '',
      serverPostSuccess: false,
      serverErrorMessage: '',
      serverSuccessMessage: ''
    }

    this.reloadData = this.reloadData.bind(this)
    this.retrieveData = this.retrieveData.bind(this)
    this.renderLogs = this.renderLogs.bind(this)
    this.subNavClicked = this.subNavClicked.bind(this)
    this.segueToLink = this.segueToLink.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.reloadScreen = this.reloadScreen.bind(this)
  }

  componentDidMount() {
    console.log('componentDidMount pathways')

    this.retrieveData()
  }

  reloadData() {
    console.log('reloadData called')

    this.retrieveData()
  }

  retrieveData = async() => {
    try {
      const email = await AsyncStorage.getItem('email')
      const cuFirstName = await AsyncStorage.getItem('firstName');
      const cuLastName = await AsyncStorage.getItem('lastName');
      const username = await AsyncStorage.getItem('username');
      const activeOrg = await AsyncStorage.getItem('activeOrg');
      const orgFocus = await AsyncStorage.getItem('orgFocus');

      if (email !== null) {
        // We have data!!
        console.log('what is the email of this user', email);
        this.setState({ emailId: email, cuFirstName, cuLastName, username, activeOrg, orgFocus, logs: [] });

        this.props.navigation.setOptions({
          headerTitle: 'Logs',
          headerRight: () => (
            <TouchableOpacity onPress={() => this.props.navigation.navigate('EditLog', { editExisting: false, logs: [], reloadData: this.reloadData })}>
              <Image source={{ uri: addIcon}} style={[styles.square20,styles.contain]}/>
            </TouchableOpacity>
        )})

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
        .then((response) => {
          console.log('Org info query attempted', response.data);

            if (response.data.success) {
              console.log('org info query worked')

              const orgName = response.data.orgInfo.orgName
              this.setState({ orgName });

            } else {
              console.log('org info query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
        });

        if (this.props.logType !== 'Goal') {
          Axios.get('https://www.guidedcompass.com/api/counseling/session', { params: { emailId: email, type: 'Advisee' } })
          .then((response) => {

              if (response.data.success) {
                console.log('Session query worked', response.data);

                let logs = this.state.logs

                let sessions = response.data.sessions
                if (sessions.length > 0) {
                  let logType = 'Session'
                  if (activeOrg === 'any') {
                    logType = 'Check In'
                  }
                  for (let i = 1; i <= sessions.length; i++) {
                    sessions[i - 1]["logType"] = logType
                  }
                  logs = logs.concat(sessions)
                }

                let filteredLogs = logs
                this.setState({ sessions, logs, filteredLogs })

                // this.sortSessions(response.data.sessions)

              } else {
                console.log('no session data found', response.data.message)
                this.setState({
                  serverPostSuccess: false,
                  serverErrorMessage: response.data.message,
                })
              }

          }).catch((error) => {
              console.log('Resource query did not work', error);
          });
        }

        Axios.get('https://www.guidedcompass.com/api/logs/goals', { params: { emailId: email } })
        .then((response) => {

            if (response.data.success) {
              console.log('Goals received query worked', response.data);

              let goals = response.data.goals
              let logs = this.state.logs

              // for (let i = 1; i <= goals.length; i++) {
              //   goals[i - 1]["logType"] = "Goal"
              // }

              logs = logs.concat(goals)
              let filteredLogs = logs

              this.setState({ goals, logs, filteredLogs })

            } else {
              console.log('no goal data found', response.data.message)
            }

        }).catch((error) => {
            console.log('Goal query did not work', error);
        });

        if (this.props.logType !== 'Goal') {
          Axios.get('https://www.guidedcompass.com/api/logs/meetings', { params: { emailId: email } })
          .then((response) => {

              if (response.data.success) {
                console.log('Applications received query worked', response.data);

                let meetings = response.data.meetings
                let logs = this.state.logs

                for (let i = 1; i <= meetings.length; i++) {
                  meetings[i - 1]["logType"] = "Meeting"
                }

                logs = logs.concat(meetings)
                let filteredLogs = logs

                this.setState({ meetings, logs, filteredLogs })

              } else {
                console.log('no application data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Application query did not work', error);
          });


          Axios.get('https://www.guidedcompass.com/api/logs/applications', { params: { emailId: email } })
          .then((response) => {

              if (response.data.success) {
                console.log('Applications received query worked', response.data);

                let applications = response.data.applications
                let logs = this.state.logs

                for (let i = 1; i <= applications.length; i++) {
                  applications[i - 1]["logType"] = "Application"
                }

                logs = logs.concat(applications)
                let filteredLogs = logs

                this.setState({ applications, logs, filteredLogs })

              } else {
                console.log('no application data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Application query did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/logs/interviews', { params: { emailId: email } })
          .then((response) => {

              if (response.data.success) {
                console.log('Interviews received query worked', response.data);

                let interviews = response.data.interviews
                let logs = this.state.logs

                for (let i = 1; i <= interviews.length; i++) {
                  interviews[i - 1]["logType"] = "Interview"
                }

                logs = logs.concat(interviews)
                let filteredLogs = logs

                this.setState({ interviews, logs, filteredLogs })

              } else {
                console.log('no interview data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Interview query did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/logs/offers', { params: { emailId: email } })
          .then((response) => {

              if (response.data.success) {
                console.log('Offers received query worked', response.data);

                let offers = response.data.offers
                let logs = this.state.logs

                for (let i = 1; i <= offers.length; i++) {
                  offers[i - 1]["logType"] = "Offer"
                }

                logs = logs.concat(offers)
                let filteredLogs = logs

                this.setState({ offers, logs, filteredLogs })

              } else {
                console.log('no offer data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Offer query did not work', error);
          });

          Axios.get('https://www.guidedcompass.com/api/logs/passions', { params: { emailId: email } })
          .then((response) => {

              if (response.data.success) {
                console.log('Passions received query worked', response.data);

                let passions = response.data.passions
                let logs = this.state.logs

                for (let i = 1; i <= passions.length; i++) {
                  passions[i - 1]["logType"] = "Passion"
                }

                logs = logs.concat(passions)
                let filteredLogs = logs

                this.setState({ passions, logs, filteredLogs })

              } else {
                console.log('no passion data found', response.data.message)
              }

          }).catch((error) => {
              console.log('Passion query did not work', error);
          });
        }

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error: ', error)
     }
  }

  renderLogs() {
    console.log('renderLogs called')

    let rows = [];
    if ( this.state.logs.length !== 0 ) {

      for (let i = 1; i <= this.state.logs.length; i++) {
        console.log(i);

        const index = i - 1

        let createdAtString = ''
        if (this.state.logs[i - 1] && this.state.logs[i - 1].createdAt) {
          createdAtString = " | " + convertDateToString(this.state.logs[i - 1].createdAt,"date")
        }

        //starting assuming a session
        let title = this.state.logs[i - 1].advisorFirstName
        let subtitle = this.state.logs[i - 1].category + " " + this.state.logs[i - 1].logType + createdAtString

        if (this.state.logs[i - 1].logType === 'Session' || this.state.logs[i - 1].logType === 'Check In') {
          if (this.state.logs[i - 1].advisorLastName) {
            title = this.state.logs[i - 1].advisorFirstName + " " + this.state.logs[i - 1].advisorLastName
          }
        } else if (this.state.logs[i - 1].logType === 'Meeting') {
          title = convertDateToString(new Date(this.state.logs[i - 1].startTime),"datetime-2") + ' Meeting in ' + this.state.logs[i - 1].groupName
          subtitle = this.state.logs[i - 1].location
        } else if (this.state.logs[i - 1].logType === 'Goal') {
          title = this.state.cuFirstName + ' ' + this.state.cuLastName + ' Goal'
          if (this.state.logs[i - 1].title) {
            title = this.state.logs[i - 1].title
          } else if (this.state.logs[i - 1].description) {
            title = this.state.logs[i - 1].description
          }

          subtitle = this.state.logs[i - 1].logType + " | " + convertDateToString(this.state.logs[i - 1].deadline,"datetime") + " | " + convertDateToString(this.state.logs[i - 1].createdAt,"datetime")
        } else if (this.state.logs[i - 1].logType === 'Application') {
          title = this.state.logs[i - 1].positionTitle
          subtitle = this.state.logs[i - 1].logType + " | " + this.state.logs[i - 1].employerName + " | " + convertDateToString(this.state.logs[i - 1].createdAt,"datetime")
        } else if (this.state.logs[i - 1].logType === 'Interview') {
          title = this.state.logs[i - 1].associatedApplicationPositionTitle
          subtitle = this.state.logs[i - 1].logType + " | " + this.state.logs[i - 1].associatedApplicationEmployerName + " | " + this.state.logs[i - 1].fitRating
        } else if (this.state.logs[i - 1].logType === 'Offer') {
          title = this.state.logs[i - 1].associatedApplicationPositionTitle
          subtitle = this.state.logs[i - 1].logType + " | " + this.state.logs[i - 1].associatedApplicationEmployerName + " | " + this.state.logs[i - 1].createdAt
        } else if (this.state.logs[i - 1].logType === 'Passion') {
          title = this.state.logs[i - 1].passionTitle
          subtitle = this.state.logs[i - 1].logType + " | " + this.state.logs[i - 1].passionReason + " | " + convertDateToString(this.state.logs[i - 1].createdAt,"datetime")
        } else if (this.state.logs[i - 1].logType === 'Native Application') {
          title = this.state.logs[i - 1].postingTitle
          subtitle = this.state.logs[i - 1].logType + " | " + this.state.logs[i - 1].postingEmployerName + " | " + convertDateToString(this.state.logs[i - 1].createdAt,"datetime")
        } else if (this.state.logs[i - 1].logType === 'Native Offer') {
          title = this.state.logs[i - 1].title
          subtitle = this.state.logs[i - 1].logType + " | " + this.state.logs[i - 1].employerName + " | " + convertDateToString(this.state.logs[i - 1].createdAt,"datetime")
        }

        let showLog = false
        if (this.state.subNavSelected === 'All') {
          showLog = true
        } else if (this.state.subNavSelected === 'Meetings') {
          showLog = true
        } else if (this.state.subNavSelected === 'Advising Sessions' && this.state.logs[i - 1].logType === 'Session') {
          showLog = true
        } else if (this.state.subNavSelected === 'Goals' && this.state.logs[i - 1].logType === 'Goal') {
          showLog = true
        } else if (this.state.subNavSelected === 'Applications' && this.state.logs[i - 1].logType === 'Application') {
          showLog = true
        } else if (this.state.subNavSelected === 'Interviews' && this.state.logs[i - 1].logType === 'Interview') {
          showLog = true
        } else if (this.state.subNavSelected === 'Offers' && this.state.logs[i - 1].logType === 'Offer') {
          showLog = true
        } else if (this.state.subNavSelected === 'Passions' && this.state.logs[i - 1].logType === 'Passion') {
          showLog = true
        }

        if (showLog) {
          rows.push(
            <View key={this.state.logs[i - 1]._id} style={(this.props.fromWalkthrough) ? [styles.fullScreenWidth,styles.row10] : [styles.calcColumn60,styles.row10]}>
              <TouchableOpacity style={(this.props.fromWalkthrough) ? [styles.fullScreenWidth,styles.ctaColor,styles.rowDirection] : [styles.calcColumn60,styles.ctaColor,styles.rowDirection]} onPress={() => this.segueToLink('EditLog', index)}>
                <View style={(this.props.fromWalkthrough) ? [styles.calcColumn100] : [styles.calcColumn90]}>
                  <View style={[styles.headingText6]}>
                      <Text style={[styles.standardText,styles.ctaColor,styles.boldText]}>{title}</Text>
                  </View>

                  <Text style={[styles.descriptionText2]}>{subtitle}</Text>
                </View>
                <View style={[styles.width30]}>
                    <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.leftMargin]}/>
                </View>
              </TouchableOpacity>

            </View>
          )
        }

      }
    } else {

      if (!this.props.fromWalkthrough) {
        rows.push(
          <View key={1} style={[styles.flexCenter,styles.flex1,styles.padding30,styles.flexCenter]}>
            <View>
              <View style={[styles.flex1,styles.flexCenter]}>
                <Image source={{ uri: logIconDark}} style={[styles.square100,styles.contain]}/>
              </View>

              <Text style={[styles.headingText3,styles.centerText,styles.topMargin20]}>No Logs Yet</Text>
              <Text style={[styles.standardText,styles.descriptionTextColor,styles.centerText,styles.topMargin]}>Log information (e.g. goals, advising sessions, work applications) so that mentors and {this.state.orgName} staff can better help.</Text>

              <TouchableOpacity onPress={() => this.props.navigation.navigate('EditLog', { editExisting: false, logs: this.state.logs, reloadData: this.reloadData })} style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter,styles.topMargin30]}><Text style={[styles.standardText,styles.whiteColor]}>Add New Log</Text></TouchableOpacity>
            </View>
          </View>
        )
      }
    }

    return rows;
  }

  segueToLink(logLink, index) {
    console.log('segueToLink called')

    if (this.props.fromWalkthrough) {
      this.setState({ modalIsOpen: true, showGoal: true, logLink, selectedIndex: index })
    } else {
      this.props.navigation.navigate(logLink, { editExisting: true, logs: this.state.logs, log: this.state.logs[index], reloadData: this.reloadData })
    }
  }

  subNavClicked(pageName) {
    console.log('subNavClicked called', pageName)

    this.setState({ subNavSelected: pageName })
  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showGoal: false, showPicker: false })

  }

  reloadScreen() {
    console.log('reloadScreen called')

    this.retrieveData()
  }

  render() {

      return (
          <ScrollView>
            <View style={(this.props.fromWalkthrough) ? [] : [styles.cardClearPadding]}>

                {(!this.props.fromWalkthrough) && (
                  <View>
                    {/*
                    <View style={[styles.row20,styles.rowDirection]}>
                      <View style={[styles.calcColumn80]}>
                        <Text style={[styles.headingText2]}>Logs</Text>
                      </View>
                      <View style={[styles.width50,styles.topPadding5]}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('EditLog', { editExisting: false, logs: this.state.logs, reloadData: this.reloadData })}>
                          <Image source={{ uri: addIcon}} style={[styles.square25,styles.contain]}/>
                        </TouchableOpacity>
                      </View>
                    </View>*/}

                    {(this.state.logs && this.state.logs.length > 0) && (
                      <View>
                        <ScrollView style={[styles.carousel,styles.rowDirection,styles.leftPadding30,styles.ctaHorizontalLine]} horizontal={true}>
                          {this.state.subNavCategories.map((value, index) =>
                            <View style={[styles.row15,styles.rightPadding20]}>
                              {(this.state.subNavCategories[index] === this.state.subNavSelected) ? (
                                <View style={[styles.selectedCarouselItem]}>
                                  <Text key={value} style={[styles.standardText]}>{value}</Text>
                                </View>
                              ) : (
                                <TouchableOpacity style={[styles.menuButton]} onPress={() => this.subNavClicked(value)}>
                                  <Text key={value} style={[styles.standardText]}>{value}</Text>
                                </TouchableOpacity>
                              )}
                            </View>
                          )}
                        </ScrollView>
                      </View>
                    )}
                  </View>
                )}

                {(this.props.fromWalkthrough) && (
                  <View style={[styles.spacer]}/>
                )}

                <View style={(this.props.fromWalkthrough) ? [] : [styles.padding30]}>
                  {this.renderLogs()}
                </View>
            </View>

            {(this.state.showGoal) && (
              <Modal isVisible={this.state.modalIsOpen} style={[styles.modal]}>
                <SubEditLog modalIsOpen={this.state.modalIsOpen} closeModal={this.closeModal} navigation={this.props.navigation} editExisting={true} log={this.state.logs[this.state.selectedIndex]} logs={this.state.logs} passedLogType="Goal" selectedAdvisor={this.state.selectedAdvisor} logId={this.state.logs[this.state.selectedIndex]._id} reloadScreen={this.reloadScreen} modalView={this.props.modalView} />
              </Modal>
            )}
          </ScrollView>

      )
  }
}

export default Logs;
