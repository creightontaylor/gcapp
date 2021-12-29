import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, ActivityIndicator, TextInput, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Icon from 'react-native-vector-icons/Ionicons';
Icon.loadFont()
import Modal from 'react-native-modal';

const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const checkmarkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon.png';

import SubTakeAssessment from './TakeAssessment';

class Assessments extends Component {
  constructor(props) {
    super(props)
    this.state = {
      matchCriteria: 'Overall Match',
      sortDirection: 'Descending',

      matchOptions: ['Overall Match','Work Match','Interest Match','Personality Match','Skill Match'],
      directionOptions: ['Descending','Ascending'],

      assessments: [],
      viewIndex: 0
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderAssessments = this.renderAssessments.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.passData = this.passData.bind(this)
    this.configureAssessments = this.configureAssessments.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  retrieveData = async() => {
    try {

      console.log('retrieveData called in subCareers')
      const emailId = await AsyncStorage.getItem('email')
      const username = await AsyncStorage.getItem('username');
      const cuFirstName = await AsyncStorage.getItem('firstName');
      const cuLastName = await AsyncStorage.getItem('lastName');
      const orgFocus = await AsyncStorage.getItem('orgFocus');
      const orgName = await AsyncStorage.getItem('orgName');
      const roleName = await AsyncStorage.getItem('roleName');
      const remoteAuth = await AsyncStorage.getItem('remoteAuth');

      let activeOrg = await AsyncStorage.getItem('activeOrg')
      if (!activeOrg) {
        activeOrg = 'guidedcompass'
      }
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (emailId !== null) {
        // We have data!!
        console.log('email: ', emailId);

        let placementAgency = false
        if (orgFocus === 'Placement') {
          placementAgency = true
        }

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, orgFocus, orgName, remoteAuth, placementAgency
        })

        if (this.props.fromAdvisor) {
          Axios.get('https://www.guidedcompass.com/api/users/profile/details/' + emailId)
          .then((response) => {

              if (response.data.success) {
                console.log('Advisee query worked', response.data);

                this.setState({ cuProfile:  response.data.user });

              } else {
                console.log('no advisees found', response.data.message)

              }

          }).catch((error) => {
              console.log('User profile query not work', error);
          });
        }

        Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId } })
       .then((response) => {
         console.log('query for assessment results worked');

         if (response.data.success) {

           console.log('actual assessment results', response.data)

           this.configureAssessments(activeOrg, response.data.results)

         } else {
           console.log('error response', response.data)

           this.configureAssessments(activeOrg, null)
           this.setState({ resultsErrorMessage: response.data.message })
         }

       }).catch((error) => {
           console.log('query for assessment results did not work', error);
       })
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  configureAssessments(activeOrg, results) {
    console.log('configureAssessments called', activeOrg, results)

    let assessments = []

    if (!results) {
      assessments = [
        {title: 'Work Preferences', status: 'Incomplete', questionCount: 10, required: true },
        {title: 'Interest Assessment', status: 'Incomplete', questionCount: 6, required: true},
        {title: 'Personality Assessment', status: 'Incomplete', questionCount: 48, required: true},
      ]
      if (!this.props.fromApply) {
        assessments.push({title: 'Values Assessment', status: 'Incomplete', questionCount: 4 })
      }
      if (!this.props.fromApply) {
        assessments.push({title: 'Skill Self-Assessment', status: 'Incomplete', questionCount: 'Variable'})
      }
    } else {
      let wpData = null
      let wpStatus = 'Incomplete'
      if (results.workPreferenceAnswers) {
        if (results.workPreferenceAnswers.length > 0) {
          wpData = results.workPreferenceAnswers
          wpStatus = 'Complete'
        }
      }

      let isInterestsData = false
      let interestsStatus = 'Incomplete'
      if (results.interestScores) {
        if (results.interestScores.length !== 0) {
          isInterestsData = true
          interestsStatus = 'Complete'
        }
      }

      let isSkillsData = false
      let skillsStatus = 'Incomplete'
      if (results.newSkillAnswers && results.newSkillAnswers.length > 0) {
        isSkillsData = true
        skillsStatus = 'Complete'
      }

      let isPersonalityData = false
      let personalityStatus = 'Incomplete'
      if (results.personalityScores) {
        isPersonalityData = true
        personalityStatus = 'Complete'
      }

      let isValuesData = false
      let valuesStatus = 'Incomplete'
      if (results.topGravitateValues && results.topGravitateValues.length > 0) {
        isValuesData = true
        valuesStatus = 'Complete'
      }

      const interestsData = results.interestScores
      let skillsData = results.newSkillAnswers
      if (skillsData && skillsData.length > 0) {
        skillsData.sort(function(a,b) {
          return b.score - a.score;
        })
      }

      const skillsAnswers = results.skillsAnswers
      const personalityData = results.personalityScores
      let valuesData = null
      if (results.topGravitateValues && results.topEmployerValues){
        // valuesData = response.data.results.topGravitateValues.concat(response.data.results.topEmployerValues)

        valuesData = []
        const topGravitateValues = results.topGravitateValues
        const topEmployerValues = results.topEmployerValues
        // valuesData = topGravitateValues.concat(topEmployerValues)

        for (let i = 1; i <= topGravitateValues.length; i++) {
          console.log('lopping gravitate')
          valuesData.push({ value: topGravitateValues[i - 1], valueType: 'gravitate'})
        }
        for (let i = 1; i <= topEmployerValues.length; i++) {
          console.log('lopping employers')
          valuesData.push({ value: topEmployerValues[i - 1], valueType: 'employer'})
        }
      }

      console.log('show valuesData: ', valuesData)

      this.setState({
        isInterestsData, isSkillsData, isPersonalityData, isValuesData,
        wpData, interestsData, skillsData, skillsAnswers, personalityData, valuesData
      });

      assessments = [
        {title: 'Work Preferences', status: wpStatus, questionCount: 10},
        {title: 'Interest Assessment', status: interestsStatus, questionCount: 6},
        {title: 'Personality Assessment', status: personalityStatus, questionCount: 48},
      ]
      if (!this.props.fromApply) {
        assessments.push({title: 'Values Assessment', status: valuesStatus, questionCount: 4 })
      }
      if (!this.props.fromApply) {
        assessments.push({title: 'Skill Self-Assessment', status: skillsStatus, questionCount: 'Variable'})
      }
    }

    //this.calculateMatches(email, scholars, wpData, interestsData, skillsAnswers, personalityData, null, null)
    Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
    .then((response2) => {
      console.log('Org info query attempted 1', response2.data);

      if (response2.data.success) {
        console.log('org info query worked now!')

        if (response2.data.orgInfo.excludeAssessments && response2.data.orgInfo.excludeAssessments.length > 0) {
          for (let i = 1; i <= assessments.length; i++) {
            // console.log('compare: ', response2.data.excludeAssessments, assessments[i - 1])
            if (response2.data.orgInfo.excludeAssessments.includes(assessments[i - 1].title)) {
              assessments.splice(i - 1,1)
            }
          }
          this.setState({ assessments })
        } else {
          this.setState({ assessments })
        }

         // console.log('show tracks: ', this.props.tracks)
        let skillsStatus = 'Incomplete'

        if ((this.props.benchmarkId) || (this.props.tracks)) {
          console.log('pull it')

          let ids = null
          if (this.props.tracks && this.props.tracks.length > 0) {
            console.log('track posting')
            ids = []
            for (let i = 1; i <= this.props.tracks.length; i++) {
              if (this.props.tracks[i - 1] && this.props.tracks[i - 1].benchmark) {
                ids.push(this.props.tracks[i - 1].benchmark._id)
              }
            }
          }

          Axios.get('https://www.guidedcompass.com/api/benchmarks/byid', { params: { _id: this.props.benchmarkId, ids } })
          .then((response3) => {
            console.log('Benchmark query attempted in subassessments', response3.data);

            if (response3.data.success) {
              console.log('benchmark query worked')

              if (response3.data.benchmark && response3.data.benchmark.skills && response3.data.benchmark.skills.length > 0) {

                const skillQuestions = response3.data.benchmark.skills

                let ogSkillAnswers = []
                if (results) {
                  ogSkillAnswers = results.newSkillAnswers
                }

                // console.log('ogSkillAnswers: ', ogSkillAnswers)
                skillsStatus = 'Complete'
                if (ogSkillAnswers && ogSkillAnswers.length > 0) {
                  for (let i = 1; i <= skillQuestions.length; i++) {
                    if (ogSkillAnswers.some(sa => sa.name === skillQuestions[i - 1].title)) {
                      // console.log('compare the questions: ', skillQuestions[i - 1])
                    } else {
                      skillsStatus = 'Incomplete'
                      console.log('what missed: ', i, skillQuestions[i - 1])
                    }
                  }
                } else {
                  skillsStatus = 'Incomplete'
                }

                console.log('totals: ', skillQuestions.length, skillQuestions, ogSkillAnswers)

                // evaluate whether complete
                assessments.push({title: 'Skill Self-Assessment', disclaimer: 'Tailored to Job', status: skillsStatus, questionCount: 'Variable'})
                this.setState({ skillQuestions, assessments })

              } else if (response3.data.benchmarks) {
                console.log('multiple benchmarks', response3.data.benchmarks)

                // let skillQuestions = []
                // for (let i = 1; i <= response3.data.benchmarks.length; i++) {
                //   if (response3.data.benchmarks[i - 1] && response3.data.benchmarks[i - 1].skills) {
                //
                //     for (let j = 1; j <= response3.data.benchmarks[i - 1].skills.length; j++) {
                //       console.log('looping: ', response3.data.benchmarks[i - 1].skills[j - 1], skillQuestions)
                //       if (response3.data.benchmarks[i - 1].skills[j - 1] && (skillQuestions.length === 0 || skillQuestions.some(sq => sq.title !== response3.data.benchmarks[i - 1].skills[j - 1].title))) {
                //         console.log('checkers')
                //         skillQuestions.push({
                //           title: response3.data.benchmarks[i - 1].skills[j - 1].title,
                //           skillType: response3.data.benchmarks[i - 1].skills[j - 1].skillType,
                //           description: response3.data.benchmarks[i - 1].skills[j - 1].description,
                //           score: response3.data.benchmarks[i - 1].skills[j - 1].score,
                //           weight: response3.data.benchmarks[i - 1].skills[j - 1].weight,
                //         })
                //       }
                //     }
                //   }
                // }
                let skills = []
                let rawSkills = []
                // let skillQuestions = []
                for (let i = 1; i <= response3.data.benchmarks.length; i++) {
                  if (response3.data.benchmarks[i - 1] && response3.data.benchmarks[i - 1].skills) {

                    let tempSkills = response3.data.benchmarks[i - 1].skills
                    if (tempSkills && tempSkills.length > 0) {
                      // console.log('inners 2')
                      for (let j = 1; j <= tempSkills.length; j++) {
                        if (!rawSkills.includes(tempSkills[j - 1].title)) {
                         skills.push({
                           title: tempSkills[j - 1].title, skillType: tempSkills[j - 1].skillType,
                           description: tempSkills[i - 1].description,
                           benchmarkTitle: response3.data.benchmarks[i - 1].title, benchmarkFunction: response3.data.benchmarks[i - 1].jobFunction,
                           score: tempSkills[j - 1].score, weight: tempSkills[j - 1].weight
                         })
                         rawSkills.push(tempSkills[j - 1].title)
                        } else {
                          console.log('not include')
                        }
                      }
                    }
                    // for (let j = 1; j <= response3.data.benchmarks[i - 1].skills.length; j++) {
                    //   console.log('looping: ', response3.data.benchmarks[i - 1].skills[j - 1], skillQuestions)
                    //   if (response3.data.benchmarks[i - 1].skills[j - 1] && (skillQuestions.length === 0 || skillQuestions.some(sq => sq.title !== response3.data.benchmarks[i - 1].skills[j - 1].title))) {
                    //     console.log('checkers')
                    //     skillQuestions.push({
                    //       title: response3.data.benchmarks[i - 1].skills[j - 1].title,
                    //       skillType: response3.data.benchmarks[i - 1].skills[j - 1].skillType,
                    //       description: response3.data.benchmarks[i - 1].skills[j - 1].description,
                    //       score: response3.data.benchmarks[i - 1].skills[j - 1].score,
                    //       weight: response3.data.benchmarks[i - 1].skills[j - 1].weight,
                    //     })
                    //   }
                    // }
                  }
                }


                skills.sort(function(a,b) {
                  return b.benchmarkFunction - a.benchmarkFunction;
                })
                const skillQuestions = skills

                console.log('show skillQuestions: ', skillQuestions)

                const ogSkillAnswers = results.newSkillAnswers

                skillsStatus = 'Complete'
                if (ogSkillAnswers && ogSkillAnswers.length > 0) {
                  for (let i = 1; i <= skillQuestions.length; i++) {
                    if (ogSkillAnswers.some(sa => sa.name === skillQuestions[i - 1].name )) {
                      console.log('compare the questions: ', skillQuestions[i - 1])
                    } else {
                      console.log('incomplete: ', skillQuestions[i - 1])
                      skillsStatus = 'Incomplete'
                    }
                  }
                }
                // console.log('skill questions: ', skillQuestions)

                // evaluate whether complete
                assessments.push({title: 'Skill Self-Assessment', status: skillsStatus, questionCount: 'Variable'})
                this.setState({ skillQuestions, assessments })

              }

            } else {
              console.log('benchmark query did not work', response3.data.message)

            }

          }).catch((error) => {
              console.log('Benchmark query did not work for some reason', error);
          });
        }

      } else {
        console.log('org info query did not work, but results were found: ', response2.data.message)
        // this.configureAssessments(assessments, null, response.data.results)
      }

    }).catch((error) => {
        console.log('Org info query did not work for some reason 1', error);
    });
  }

  calculateMatches(emailId, scholars, interestsResults, skillsResults, personalityResults, passedMatchCriteria, passedSortDirection, valuesResults) {
    console.log('calculateMatches called', emailId, scholars, interestsResults, skillsResults, personalityResults, valuesResults)

    let matchCriteria = this.state.matchCriteria
    if (passedMatchCriteria) {
      matchCriteria = passedMatchCriteria
    }

    let sortDirection = this.state.sortDirection
    if (passedSortDirection) {
      sortDirection = passedSortDirection
    }

    const cuProfile = this.state.cuProfile
    console.log('let see cuProfile', cuProfile)

    Axios.post('https://www.guidedcompass.com/api/assessment/partners/calculate', { emailId, partners: scholars, cuProfile, interestsResults, skillsResults, personalityResults, matchCriteria, sortDirection, valuesResults })
    .then((response) => {
      console.log('Scholar match query worked', response.data);

      if (response.data.success) {

        console.log('successfully matched to mentors')
        this.setState({ matches: response.data.matches })

      } else {
        console.log('there was an error matching partners', response.data.message)
      }

    }).catch((error) => {
        console.log('Partner match did not work', error);
    });

  }

  handleChange(event) {
    console.log('handleChange called')

    if (event.target.name === 'matchCriteria') {

      const matchCriteria = event.target.value
      this.setState({ matchCriteria })

      this.calculateMatches(this.state.emailId, this.state.scholars, this.state.interestsData, this.state.skillsAnswers, this.state.personalityData, matchCriteria, null, this.state.valuesData )
    } else if (event.target.name === 'sortDirection') {
      const sortDirection = event.target.value
      this.setState({ sortDirection })

      this.calculateMatches(this.state.emailId, this.state.scholars, this.state.interestsData, this.state.skillsAnswers, this.state.personalityData, null, sortDirection, this.state.valuesData )
    }
  }

  renderAssessments() {
    console.log('renderAssessments called')

    let rows = [];
    if ( this.state.assessments.length !== 0 ) {
      for (let i = 1; i <= this.state.assessments.length; i++) {
        console.log(i);

        let resultsData = [this.state.wpData, this.state.interestsData, this.state.personalityData, this.state.skillsData, this.state.valuesData]

        let type = ''
        const assessmentTitle = this.state.assessments[i - 1].title
        const assessments = this.state.assessments
        const index = [i - 1]
        const assessment = this.state.assessments[i - 1]
        let assessmentDescription = ''
        if (assessmentTitle === 'Work Preferences') {
          type = 'work preferences'
          assessmentDescription = 'Self-assesses your fit to current and similar work'
        } else if (assessmentTitle === 'Interest Assessment') {
          type = 'interests'
          assessmentDescription = 'Assesses what category of work you may be most interested in'
        } else if (assessmentTitle === 'Skill Self-Assessment') {
          type = 'skills'
          assessmentDescription = 'Self-assessment of hard and soft skills associated with different career paths'
        } else if (assessmentTitle === 'Personality Assessment') {
          type = 'personality'
          assessmentDescription = 'Assesses your personality type along axis relevant to different career paths'
        } else if (assessmentTitle === 'Values Assessment') {
          type = 'values'
          assessmentDescription = 'Assesses your values and the values of your ideal employer'
        }

        rows.push(
          <View key={i}>
            {(this.props.fromApply) ? (
              <View>
                <TouchableOpacity style={[styles.calcColumn60,styles.row10,styles.rowDirection]} onPress={() => this.setState({ modalIsOpen: true, type, assessmentTitle, assessments, index, assessment, resultsData, assessmentDescription })}>
                  <View style={[styles.calcColumn130]}>
                    <View>
                      <Text style={[styles.headingText5,styles.ctaColor]}>{this.state.assessments[i - 1].title}{(this.state.assessments[i - 1].disclaimer) && <Text style={styles.errorColor}> ({this.state.assessments[i - 1].disclaimer})</Text>}<Text style={styles.errorColor}> *</Text></Text>
                    </View>
                    <Text style={[styles.descriptionText1,styles.curtailText,styles.topMargin5]}>{this.state.assessments[i - 1].status} | {this.state.assessments[i - 1].questionCount} Questions</Text>
                  </View>
                  {(this.state.assessments[i - 1].status === 'Complete') && (
                    <View style={[styles.width35,styles.rightPadding]}>
                      <Image source={{ uri: checkmarkIcon}} style={[styles.square22,styles.contain,styles.leftMargin]}/>
                    </View>
                  )}
                  <View style={[styles.width35,styles.leftPadding]}>
                    <View>
                      <View style={[styles.btnSquarish,styles.ctaBackgroundColor]}><Text style={[styles.descriptionText2,styles.whiteColor]}>Take</Text></View>
                    </View>
                  </View>

                </TouchableOpacity>
              </View>
            ) : (
              <View style={[styles.row10]}>
                <TouchableOpacity style={[styles.calcColumn60,styles.rowDirection]} onPress={() => this.props.navigation.navigate('Assessment Details', { assessments: this.state.assessments, index: i - 1, assessment: this.state.assessments[i - 1], resultsData })} >
                  <View style={[styles.calcColumn130]}>
                    <View>
                      <Text style={styles.headingText5}>{this.state.assessments[i - 1].title}{(this.state.assessments[i - 1].required) && <Text style={styles.errorColor}> *</Text>}</Text>
                    </View>
                    <Text style={[styles.descriptionText1,styles.curtailText,styles.topMargin5]}>{this.state.assessments[i - 1].status} | {this.state.assessments[i - 1].questionCount} Questions</Text>
                  </View>
                  {(this.state.assessments[i - 1].status === 'Complete') && (
                    <View style={[styles.width35,styles.rightPadding]}>
                      <Image source={{ uri: checkmarkIcon}} style={[styles.square22,styles.contain,styles.leftMargin]}/>
                    </View>
                  )}
                  <View style={[styles.width35,styles.leftPadding]}>
                    <View>
                      <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                    </View>
                  </View>

                </TouchableOpacity>
              </View>
            )}
          </View>
        )
      }
    } else {
      //show empty state screen
      console.log('no assessments rendered')
    }

    return rows;
  }

  closeModal() {
    this.setState({ modalIsOpen: false });
  }

  passData(name, value, index) {
    console.log('passData called - show intermediate value: ', name, value, index)

    let assessments = this.state.assessments
    if (assessments) {
      for (let i = 1; i <= assessments.length; i++) {
        // console.log('compare: ', assessments[i - 1], name)
        if (assessments[i - 1]) {
          // assessment type
          if (assessments[i - 1].title === 'Work Preferences' && name === 'work preferences') {
            assessments[i - 1]['status'] = 'Complete'
          } else if (assessments[i - 1].title === 'Interest Assessment' && name === 'interests') {
            assessments[i - 1]['status'] = 'Complete'
          } else if (assessments[i - 1].title === 'Skill Self-Assessment' && name === 'skills') {
            assessments[i - 1]['status'] = 'Complete'
          } else if (assessments[i - 1].title === 'Personality Assessment' && name === 'personality') {
            assessments[i - 1]['status'] = 'Complete'
          } else if (assessments[i - 1].title === 'Values Assessment' && name === 'values') {
            assessments[i - 1]['status'] = 'Complete'
          }
        }
      }
    }
    // console.log('show final assessment: ', assessments)
    this.setState({ assessments })
    this.props.passData(name, value, index)
  }

  render() {
    return (
      <ScrollView style={styles.card}>

        {(this.props.fromApply) ? (
          <View>
            {this.renderAssessments()}


            <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
             <View key="skillAssessment" style={[styles.calcColumn60,styles.padding20]}>
              <SubTakeAssessment history={this.props.history} type={this.state.type} assessmentTitle={this.state.assessmentTitle} assessments={this.state.assessments} index={this.state.index} assessment={this.state.assessment} resultsData={this.state.resultsData} assessmentDescription={this.state.assessmentDescription} closeModal={this.closeModal} passData={this.passData} skillQuestions={this.state.skillQuestions} />
             </View>
           </Modal>
          </View>
        ) : (
          <View>
            <View style={[styles.topPadding40]}>
              <Text style={[styles.headingText2]}>Assessments</Text>
            </View>
            <View style={[styles.spacer]} />
            <Text style={[styles.descriptionTextColor]}>Take career assessments to match with career paths, employers, events, projects, and work opportunities.</Text>
            <View style={[styles.topPadding20]}>
              {this.renderAssessments()}
            </View>


            <View style={[styles.spacer]} /><View style={[styles.spacer]} />
          </View>
        )}
      </ScrollView>

    )
  }
}

export default Assessments;
