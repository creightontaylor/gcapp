import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, ActivityIndicator, TextInput, Platform, Linking } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

// const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';

const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';

const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const linkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon.png';
const pathsIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/paths-icon-dark.png';
const opportunitiesIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-dark.png';

class AssessmentDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewIndex: 0,
      subIndex: 1,
      returnLimit: 30,

      nextIndex: 0,
      assessments: [],

      assessmentQuestions: [],
      favorites: []
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.favoriteItem = this.favoriteItem.bind(this)
    this.renderWPData = this.renderWPData.bind(this);
    this.renderMatches = this.renderMatches.bind(this);
    this.segueToNext = this.segueToNext.bind(this);

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData(this.props.assessment, this.props.index)

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in assDetails ', this.props.resultsData, prevProps)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData(this.props.assessment, this.props.index)
    } else if (this.props.index !== prevProps.index) {
      this.retrieveData(this.props.assessment, this.props.index)
    } else if (this.props.assessment !== prevProps.assessment) {
      this.retrieveData(this.props.assessment, this.props.index)
    } else if (this.props.resultsData !== prevProps.resultsData) {
      this.retrieveData(this.props.assessment, this.props.index)
    }
  }

  retrieveData = async(assessment, index) => {
    try {

      const assessments = this.props.assessments
      const resultsData = this.props.resultsData

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

        let assessmentTitle = assessment.title
        let assessmentDescription = ''
        // let interestsData = null
        // let skillsData = null
        // let personalityData = null

        if (assessmentTitle === 'Work Preferences') {
          assessmentDescription = 'Self-assesses your fit to current and similar work'
        } else if (assessmentTitle === 'Interest Assessment') {
          assessmentDescription = 'Assesses what category of work you may be most interested in'
        } else if (assessmentTitle === 'Skill Self-Assessment') {
          assessmentDescription = 'Self-assessment of hard and soft skills associated with different career paths'
        } else if (assessmentTitle === 'Personality Assessment') {
          assessmentDescription = 'Assesses your personality type relative to different career paths'
        } else if (assessmentTitle === 'Values Assessment') {
          assessmentDescription = 'Assesses your values and the values of your ideal employer'
        }

        let nextIndex = index + 1
        if (nextIndex > assessments.length - 1) {
          nextIndex = 0
        }

        if (resultsData && resultsData[index] && resultsData[index].length !== undefined && resultsData[index].length === 0) {
          resultsData[index] = null
        }

        console.log('show assessment: ', assessment)

        // console.log('in assessment: ', assessmentTitle)
        // this.setState({ emailId: email, username, cuFirstName, cuLastName, activeOrg, orgFocus, assessmentTitle, assessmentDescription,
        // resultsData, assessments, index, nextIndex, assessment })

        this.setState({ emailId, username, cuFirstName, cuLastName,
          roleName, activeOrg, orgFocus, orgName, remoteAuth, placementAgency,
          assessmentTitle, assessmentDescription, resultsData, assessments, index, nextIndex, assessment
        })

        Axios.get('https://www.guidedcompass.com/api/assessment/questions')
        .then((response) => {
            //console.log('O*Net worked', response.data.body, this);
            console.log('show me response', response.data)
            if ( response.data.success === true ) {
              console.log('assessment query worked')

              let assessmentQuestions = []

              for (let i = 1; i <= response.data.assessments.workPreferenceQuestions.length; i++) {
                assessmentQuestions.push(response.data.assessments.workPreferenceQuestions[i - 1].name)
              }

              this.setState({ assessmentQuestions })

            } else {
              console.log('Assessment question query failed', response.data.message)
            }

        }).catch((error) => {
            console.log('Assessment question query did not work', error);
        });

        Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId: email } })
       .then((response) => {
         console.log('Favorites query attempted', response.data);

           if (response.data.success) {
             console.log('successfully retrieved favorites')

             this.setState({ favorites: response.data.favorites })
           } else {
             console.log('no favorites data found', response.data.message)
           }

       }).catch((error) => {
           console.log('Favorites query did not work', error);
       });

        Axios.get('https://www.guidedcompass.com/api/assessment/careers', { params: { emailId: email } })
        .then((response) => {
          console.log('Career matches query tried from database, assessmentDetails screen');

          if (response.data.success) {
            console.log('Career matches query succeeded from database, assessmentDetails screen', response.data)

            let matches = null
            let employerMatches = null
            let workMatches = null

            if (assessmentTitle === 'Work Preferences') {
              if (response.data.matches.arePreferenceCareerMatches) {
                matches = response.data.matches.preferenceCareerMatches
                employerMatches = response.data.matches.preferenceEmployerMatches
                console.log('show employerMatches ', response.data.matches.preferencesWorkMatches)
                if (response.data.matches.preferencesWorkMatches) {
                  if (typeof response.data.matches.preferenceWorkMatches[0].work === 'string') {
                    console.log('this work match a string ', response.data.matches.preferenceWorkMatches[0].work)

                    workMatches = []
                    for (let i = 0; i < response.data.matches.preferenceWorkMatches.length; i++) {
                      const workObject = JSON.parse(response.data.matches.preferenceWorkMatches[i].work)
                      workMatches.push({ work: workObject, differential: response.data.matches.preferenceWorkMatches[i].differential})
                    }
                    //workMatches = response.data.matches.interestWorkMatches
                  } else if (response.data.matches.preferenceWorkMatches[0].work) {
                    console.log('is there preferenceWorkmatches? ', response.data.matches.preferenceWorkMatches)
                    workMatches = response.data.matches.preferenceWorkMatches
                  }
                }
              }
            } else if (assessmentTitle === 'Interest Assessment') {
              if (response.data.matches.areInterestCareerMatches) {
                matches = response.data.matches.interestCareerMatches
                employerMatches = response.data.matches.interestEmployerMatches

                if (typeof response.data.matches.interestWorkMatches[0].work === 'string') {
                  console.log('this work match a string ', response.data.matches.interestWorkMatches[0].work)

                  workMatches = []
                  for (let i = 0; i < response.data.matches.interestWorkMatches.length; i++) {
                    const workObject = JSON.parse(response.data.matches.interestWorkMatches[i].work)
                    workMatches.push({ work: workObject, differential: response.data.matches.interestWorkMatches[i].differential})
                  }
                  //workMatches = response.data.matches.interestWorkMatches
                } else if (response.data.matches.interestWorkMatches[0].work) {
                  console.log('is there interestWorkmatches? ', response.data.matches.interestWorkMatches)
                  workMatches = response.data.matches.interestWorkMatches
                }
              }
            } else if (assessmentTitle === 'Skill Self-Assessment') {
              if (response.data.matches.areSkillCareerMatches) {
                matches = response.data.matches.skillCareerMatches
                employerMatches = response.data.matches.skillEmployerMatches
                workMatches = response.data.matches.skillWorkMatches
              }
            } else if (assessmentTitle === 'Personality Assessment') {
              if (response.data.matches.arePersonalityCareerMatches) {
                matches = response.data.matches.personalityCareerMatches
                employerMatches = response.data.matches.personalityEmployerMatches
                workMatches = response.data.matches.personalityWorkMatches
              }

            }

            this.setState({ matches, employerMatches, workMatches })

          } else {
            console.log('no career match data found', response.data.message)

          }
        }).catch((error) => {
            console.log('query for assessment career matches did not work from database', error);
        })

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  favoriteItem(item) {
    console.log('favoriteItem called', item)

    let itemId = ''
    if (this.state.viewIndex === 0) {
      itemId = item.partner._id
    } else if (this.state.viewIndex === 1) {
      itemId = item.career._id
    } else if (this.state.viewIndex === 2) {
      itemId = item.pathway._id
    } else if (this.state.viewIndex === 3) {
      console.log('show employer info: ', item.employer)
      itemId = item.employer._id
    } else if (this.state.viewIndex === 4) {
      itemId = item.work._id
    }

    let favoritesArray = this.state.favorites

    if (favoritesArray.includes(itemId)){

      let index = favoritesArray.indexOf(itemId)
      if (index > -1) {
        favoritesArray.splice(index, 1);
      }

      Axios.post('https://www.guidedcompass.com/api/favorites/save', {
        favoritesArray, emailId: this.state.emailId
      })
      .then((response) => {
        console.log('attempting to save favorites')
        if (response.data.success) {
          console.log('saved successfully', response.data)
          //clear values
          this.setState({
            serverSuccessPlan: true,
            serverSuccessMessagePlan: 'Favorite saved!'
          })
        } else {
          console.log('did not save successfully')
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'error:' + response.data.message
          })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'there was an error saving favorites'
          })
      });

    } else {
      console.log('adding item: ', favoritesArray, itemId)
      favoritesArray.push(itemId)
      Axios.post('https://www.guidedcompass.com/api/favorites/save', {
        favoritesArray, emailId: this.state.emailId
      })
      .then((response) => {
        console.log('attempting to save favorites')
        if (response.data.success) {
          console.log('saved successfully', response.data)
          //clear values
          this.setState({
            serverSuccessPlan: true,
            serverSuccessMessagePlan: 'Favorite saved!'
          })
        } else {
          console.log('did not save successfully')
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'error:' + response.data.message
          })
        }
      }).catch((error) => {
          console.log('save did not work', error);
          this.setState({
            serverSuccessPlan: false,
            serverErrorMessagePlan: 'there was an error saving favorites'
          })
      });
    }

    console.log('favorites', favoritesArray)
    this.setState({ favorites: favoritesArray })
  }

  renderResults() {
    console.log('renderResults called', this.state.assessmentTitle, this.state.resultsData)

    let rows = []

    if (this.state.resultsData) {

      if (this.state.assessmentTitle === 'Work Preferences') {
          console.log('testing 4')
          if (this.state.resultsData[0]) {
            rows.push(
              <View key={0}>
                <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                {this.renderWPData(this.state.resultsData[0])}
              </View>
            )
          } else {
            console.log('there is no data')
            rows.push(
              <View key={0}>
                <Text style={[styles.centerText]}>View your results here after you take the assessment</Text>
              </View>
            )
          }
      } else if (this.state.assessmentTitle === 'Interest Assessment') {
        console.log('gimme results', this.state.resultsData)

        if (this.state.resultsData[1]) {
          if (this.state.resultsData[1].length !== 0) {
            //const totalScore = Number(this.state.results[0].score) + Number(this.state.results[1].score) + Number(this.state.results[2].score) + Number(this.state.results[3].score) + Number(this.state.results[4].score) + Number(this.state.results[5].score)
            rows.push(
              <View key={0}>
                <View style={[styles.spacer]} /><View style={[styles.spacer]} />
              </View>
            )
            for (let i = 0; i < this.state.resultsData[1].length; i++) {
              console.log('gimme i value for filters', i)
              let relativeScore = ((Number(this.state.resultsData[1][i].score) / 40).toFixed(2) * 100).toString() + '%'
              rows.push(
                <View key={i} style={[styles.row20]}>
                  <Text style={[styles.headingText5,styles.bottomPadding]}>{this.state.resultsData[1][i].name}</Text>

                  <Text style={[styles.headingText2,styles.ctaColor,styles.bottomPadding]}>{relativeScore}</Text>
                  <Text>{this.state.resultsData[1][i].description}</Text>
                </View>
              )
            }
          }
        } else {
          console.log('there is no data')
          rows.push(
            <View key={0}>
              <Text style={[styles.centerText]}>View your results here after you take the assessment</Text>
            </View>
          )
        }
      } else if (this.state.assessmentTitle === 'Personality Assessment'){
        //personality assessments
        console.log('in personality assessment')
        if (this.state.resultsData[2]) {
          rows.push(
            <View key={0} style={[styles.row20]}>
              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
              <Text style={[styles.headingText4,styles.bottomPadding]}>16 Personalities</Text>
              <Text>Learn about your type here: <TouchableOpacity onPress={() => Linking.openURL("https://www.16personalities.com/" + this.state.resultsData[2].myersBriggs + "-personality")}>https://www.16personalities.com/{this.state.resultsData[2].myersBriggs}-personality</TouchableOpacity></Text>
              <Text style={[styles.headingText2,styles.ctaColor]}>{this.state.resultsData[2].myersBriggs}</Text>

              <View style={[styles.spacer]} />

              <Text style={[styles.headingText4,styles.row10]}>Five Factors</Text>
              <Text>Learn about the big five personality traits: <TouchableOpacity onPress={() => Linking.openURL("https://en.wikipedia.org/wiki/Big_Five_personality_traits")}>https://en.wikipedia.org/wiki/Big_Five_personality_traits</TouchableOpacity></Text>
              <Text style={[styles.headingText6,styles.row10]}>Extraversion Score: <Text style={[styles.ctaColor]}>{((this.state.resultsData[2].fiveFactors.extraversionScore / 16)*100).toString() + '%'}</Text></Text>
              <Text style={[styles.headingText6,styles.row10]}>Openness Score: <Text style={[styles.ctaColor]}>{((this.state.resultsData[2].fiveFactors.opennessScore / 16)*100).toString() + '%'}</Text></Text>
              <Text style={[styles.headingText6,styles.row10]}>Conscientiousness Score: <Text style={[styles.ctaColor]}>{((this.state.resultsData[2].fiveFactors.conscientiousnessScore / 16)*100).toString() + '%'}</Text></Text>
              <Text style={[styles.headingText6,styles.row10]}>Agreeableness Score: <Text style={[styles.ctaColor]}>{((this.state.resultsData[2].fiveFactors.agreeablenessScore / 16)*100).toString() + '%'}</Text></Text>
              <Text style={[styles.headingText6,styles.row10]}>Neuroticism Score: <Text style={[styles.ctaColor]}>{((this.state.resultsData[2].fiveFactors.neuroticismScore / 16)*100).toString() + '%'}</Text></Text>
            </View>
          )
        } else {
          console.log('there is no data')
          rows.push(
            <View key={0}>
              <Text style={[styles.centerText]}>View your results here after you take the assessment</Text>
            </View>
          )
        }
      } else if (this.state.assessmentTitle === 'Values Assessment') {
        console.log('gimme results', this.state.resultsData)

        if (this.state.resultsData[4]) {
          if (this.state.resultsData[4].length !== 0) {
            console.log('in values')
            //const totalScore = Number(this.state.results[0].score) + Number(this.state.results[1].score) + Number(this.state.results[2].score) + Number(this.state.results[3].score) + Number(this.state.results[4].score) + Number(this.state.results[5].score)
            rows.push(
              <View key={0}>
                <View style={[styles.spacer]}/><View style={[styles.spacer]}/>
              </View>
            )
            rows.push(
              <View key={"gravitateValuesTitle"}>
                <Text style={[styles.headingText4]}>Top Types of People You Gravitate Towards</Text>
              </View>
            )

            let gravitateCounter = 1
            function renderValue(passedData, index) {
              console.log('called renderValue 1')
              if (passedData.valueType) {
                if (passedData.valueType === 'gravitate') {
                  rows.push(
                    <View key={"gravitateValues" + index} style={[styles.row5,styles.headingText6]}>
                      <Text>{gravitateCounter}. {passedData.value}</Text>
                    </View>
                  )
                  gravitateCounter = gravitateCounter + 1
                }
              }
            }

            for (let i = 0; i < this.state.resultsData[4].length; i++) {
              console.log('looping values 1', i, typeof this.state.resultsData[4][i])

              if (typeof this.state.resultsData[4][i] === 'string') {
                renderValue(JSON.parse(this.state.resultsData[4][i]),i)
              } else {
                renderValue(this.state.resultsData[4][i],i)
              }
            }

            rows.push(
              <View key={"employerValuesTitle"}>
                <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                <Text style={[styles.headingText4]}>Top Things You Value In Employers</Text>
              </View>
            )

            let employerCounter = 1
            function renderValueTwo(passedData, index) {
              console.log('called renderValue 2')
              if (passedData.valueType) {
                if (passedData.valueType === 'employer') {
                  rows.push(
                    <View key={"employerValues" + index} style={[styles.row5,styles.headingText6]}>
                      <Text>{employerCounter}. {passedData.value}</Text>
                    </View>
                  )
                  employerCounter = employerCounter + 1
                }
              }
            }

            for (let i = 0; i < this.state.resultsData[4].length; i++) {
              console.log('looping values 2', i, this.state.resultsData[4][i].valueType)

              if (typeof this.state.resultsData[4][i] === 'string') {
                renderValueTwo(JSON.parse(this.state.resultsData[4][i]), i)
              } else {
                renderValueTwo(this.state.resultsData[4][i],i)
              }
            }
          }
        } else {
          console.log('there is no data')
          rows.push(
            <View key={0}>
              <Text style={[styles.centerText]}>View your results here after you take the assessment</Text>
            </View>
          )
        }
      } else if (this.state.assessmentTitle === 'Skill Self-Assessment') {
        console.log('testing 3')
        if (this.state.resultsData[3] && this.state.resultsData[3].length > 0) {

          function tagBackgroundConverter(score) {
            console.log('tagBackgroundConverter called', score)

            let backgroundColorClass = styles.quinaryBackground
            if (score === 1) {
              backgroundColorClass = styles.quinaryBackgroundLight
            } else if (score === 2) {
              backgroundColorClass = styles.tertiaryBackgroundLight
            } else if (score === 3) {
              backgroundColorClass = styles.secondaryBackgroundLight
            } else if (score === 4) {
              backgroundColorClass = styles.primaryBackgroundLight
            } else if (score === 5) {
              backgroundColorClass = styles.sendaryBackgroundLight
            }

            return backgroundColorClass
          }
          rows.push(
            <View key={0}>
              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
              <Text style={[styles.headingText5]}>Top Skills</Text>
              <Text style={[styles.descriptionTextColor,styles.descriptionText1]}>(Ranked from best to worst)</Text>

              <View style={[styles.topPadding,styles.rowDirection]}>
                {this.state.resultsData[3].map((value, optionIndex) =>
                  <View key={value}>
                    {(this.state.resultsData[3][optionIndex].score && this.state.resultsData[3][optionIndex].score > 0) && (
                      <View style={[styles.row15,styles.horizontalPadding5,styles.slightlyRoundedCorners,styles.rightMargin,styles.topMargin,tagBackgroundConverter(this.state.resultsData[3][optionIndex].score)]}>
                        <Text style={[styles.descriptionText2,styles.boldText]}>{this.state.resultsData[3][optionIndex].name} - {this.state.resultsData[3][optionIndex].score}</Text>
                      </View>
                    )}
                  </View>
                )}
              </View>

            </View>
          )
        } else {
          console.log('there is no data')
          rows.push(
            <View key={0}>
              <Text style={[styles.centerText]}>View your results here after you take the assessment</Text>
            </View>
          )
        }
      } else {
        console.log('there is some other assessmentTitle: ', this.state.assessmentTitle)
      }
    }

    return rows
  }

  renderWPData(wp) {
    console.log('renderWPData called', wp)

    let rows = []

    for (let i = 0; i < wp.length; i++) {

      let answer = ''
      if (wp[i]) {
        if (wp[i][0] === '[') {
          console.log('test 1er')
          const removedArrayEnds = wp[i].substring(1,wp[i].length - 1).replace(/"/g,"").replace(/"/g,"").replace(/,/g,", ")
          answer = removedArrayEnds
        } else if (typeof wp[i] === 'object') {
          console.log('test 3er', typeof wp[i], wp[i])
          answer = wp[i].join(", ")
        } else {
          console.log('test 2er', typeof wp[i], wp[i])
          answer = wp[i]
        }

        rows.push(
          <View key={'wpData' + i.toString()} style={[styles.row5]}>
            {(this.state.assessmentQuestions[i] && wp[i]) && (
              <View>
                <Text style={styles.descriptionText2}>{this.state.assessmentQuestions[i]}</Text>

                <View style={[styles.halfSpacer]} />
                <Text>{answer}</Text>
                <View style={[styles.spacer]} /><View style={[styles.spacer]} />
              </View>
            )}
          </View>
        )
      }
    }

    return rows
  }

  renderMatches() {
    console.log('renderMatches called')

    let rows = []

    if (this.state.subIndex === 0) {
      //mentors
      if (this.state.mentorMatches) {
        for (let i = 1; i <= this.state.mentorMatches.length; i++) {
          console.log(i);

          let match = 'N/A'
          if (Math.sign(100 - this.state.mentorMatches[i - 1].differential) !== -1) {
            match = (100 - Number(this.state.mentorMatches[i - 1].differential)).toFixed(0).toString() + '%'
          }

          let workLine = ''
          if (this.state.mentorMatches[i - 1].partner.targetJobTitle) {
            if (workLine === '') {
              workLine = this.state.mentorMatches[i - 1].partner.targetJobTitle
            } else {
              workLine = workLine + ' | ' + this.state.mentorMatches[i - 1].partner.targetJobTitle
            }
          }

          if (this.state.mentorMatches[i - 1].partner.targetEmployerName) {
            if (workLine === '') {
              workLine = this.state.mentorMatches[i - 1].partner.targetEmployerName
            } else {
              workLine = workLine + ' | ' + this.state.mentorMatches[i - 1].partner.targetEmployerName
            }
          }

          if (workLine === '') {
            workLine = this.state.mentorMatches[i - 1].partner.firstName + ' has not entered their work information yet'
          }

          rows.push(
            <View key={i}>
              <View style={[styles.spacer]} />

              <TouchableOpacity onPress={() => this.props.navigation.navigate('AdvisorProfile', { selectedMentor: this.state.mentorMatches[i - 1], source: 'Student' })} style={[styles.rowDirection]}>
                <View style={[styles.width60]}>
                  <Text style={[styles.headingText2,styles.ctaColor]}>{match}</Text>
                </View>
                <View style={[styles.curtailText,styles.calcColumn200]}>
                  <View style={[styles.curtailText,styles.headingText5]}>
                    <Text style={styles.headingText6}>{this.state.mentorMatches[i - 1].partner.firstName} {this.state.mentorMatches[i - 1].partner.lastName}</Text>
                  </View>
                  <View>
                    <Text style={[styles.descriptionText1,styles.curtailText]}>{workLine}</Text>
                  </View>
                </View>
              </TouchableOpacity>
              <View style={[styles.rowDirection]}>
                <View style={[styles.width50]}>
                  <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                  <TouchableOpacity onPress={() => this.favoriteItem(this.state.mentorMatches[i - 1]) }>
                    <Image source={(this.state.favorites.includes(this.state.mentorMatches[i - 1].partner._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                  </TouchableOpacity>
                </View>
                <View style={[styles.width30]}>
                  <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('AdvisorProfile', { selectedMentor: this.state.mentorMatches[i - 1], source: 'Student' })}>
                    <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
              <View style={[styles.horizontalLine]} />

              <View style={[styles.spacer]} />
            </View>
          )
        }
      }
    } else if (this.state.subIndex === 1) {
      //careers
      if (this.state.matches) {

        for (let i = 1; i <= this.state.matches.length; i++) {

          const index = i - 1
          const item = this.state.matches[index]

          if (item) {

            if (i < this.state.returnLimit) {
              const matchScore = (100 - item.differential).toFixed(0) + '%'

              rows.push(
                <View key={index}>
                  <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                  <View>
                    <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { selectedCareer: item.career })} style={[styles.rowDirection]}>
                      <View style={[styles.width60]}>
                        <Text style={[styles.headingText2]}>{matchScore}</Text>
                      </View>
                      <View style={[styles.curtailText,styles.calcColumn200]}>
                        <View style={[styles.curtailText,styles.headingText5]}>
                          <Text>{item.career.name}</Text>
                        </View>
                        <View>
                          <Text style={[styles.descriptionText1,styles.curtailText]}>{item.career.jobFamily}</Text>
                        </View>
                      </View>
                    </TouchableOpacity>
                    <View style={[styles.rowDirection]}>
                      <View style={[styles.width50]}>
                        <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                        <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                          <Image source={(this.state.favorites.includes(item.career._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]} />
                        </TouchableOpacity>
                      </View>
                      <View style={[styles.width30]}>
                        <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('CareerDetails', { selectedCareer: item.career })} >
                          <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>

                </View>
              )
            }
          } else {
            console.log('there is no item for some reason: ', item)
          }
        }
      }
    } else if (this.state.subIndex === 2) {
      //employers
      if (this.state.employerMatches) {
        for (let i = 1; i <= this.state.employerMatches.length; i++) {

          const index = i - 1
          const item = this.state.employerMatches[index]

          if (item) {
            const matchScore = (100 - item.differential).toFixed(0) + '%'

            if (i < this.state.returnLimit) {

              if (item.employer.isExternal) {
                rows.push(
                  <View key={index}>
                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                    <View>
                      <TouchableOpacity onPress={() => Linking.openURL(item.employer.url)} style={[styles.rowDirection]}>
                        <View style={[styles.width60]}>
                          <Text style={[styles.headingText2]}>{matchScore}</Text>
                        </View>
                        <View style={[styles.curtailText,styles.calcColumn200]}>
                          <View style={[styles.curtailText,styles.headingText5]}>
                            <Text>{item.employer.name}</Text>
                          </View>
                          <View>
                            <Text style={[styles.descriptionText1,styles.curtailText]}>{item.employer.url}</Text>
                          </View>

                        </View>
                      </TouchableOpacity>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.width50]}>
                          <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                          <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                            <Image source={(this.state.favorites.includes(item.employer._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.width30]}>
                          <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                          <TouchableOpacity href={item.employer.url}>
                            <Image source={{ uri: linkIcon}} style={[styles.square22,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              } else {

                rows.push(
                  <View key={index}>
                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                    <View>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('EmployerDetails', { employerDetails: item, selectedEmployer: item })} style={[styles.rowDirection]}>
                        <View style={[styles.width60]}>
                          <Text style={[styles.headingText2]}>{matchScore}</Text>
                        </View>
                        <View style={[styles.curtailText,styles.calcColumn200]}>
                          <View style={[styles.curtailText,styles.headingText5]}>
                            <Text>{item.employer.name}</Text>
                          </View>


                          <View>
                            <Text style={[styles.descriptionText1,styles.curtailText]}>{item.employer.url}</Text>
                          </View>>
                        </View>
                      </TouchableOpacity>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.width50]}>
                          <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                          <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                            <Image source={(this.state.favorites.includes(item.employer._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.width30]}>
                          <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('EmployerDetails', { employerDetails: item, selectedEmployer: item })}>
                            <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>


                  </View>
                )
              }
            }
          }
        }
      }
    } else if (this.state.subIndex === 3) {
      //internships
      if (this.state.workMatches) {
        for (let i = 1; i <= this.state.workMatches.length; i++) {

          const index = i - 1
          const item = this.state.workMatches[index]
          console.log('show combined work matches ', this.state.workMatches[i - 1])
          if (item) {
            const matchScore = (100 - item.differential).toFixed(0) + '%'

            if (i < this.state.returnLimit) {

              if (item.work.isExternal) {
                rows.push(
                  <View key={index}>
                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                    <View>
                      <TouchableOpacity onPress={() => Linking.openURL(item.work.jobLink)} style={[styles.rowDirection]}>
                        <View style={[styles.width50]}>
                          <Text style={[styles.headingText2]}>{matchScore}</Text>
                        </View>
                        <View style={[styles.curtailText,styles.calcColumn190]}>
                          <View style={[styles.curtailText,styles.headingText5]}>
                            <Text>{item.work.title}</Text>
                          </View>
                          <View>
                            <Text style={[styles.descriptionText1,styles.curtailText]}>{item.work.employerName}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.width50]}>
                          <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                          <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                            <Image source={(this.state.favorites.includes(item.work._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.width30]}>
                          <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                          <TouchableOpacity href={item.work.jobLink}>
                            <Image source={{ uri: linkIcon}} style={[styles.square22,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                  </View>
                )
              } else {

                rows.push(
                  <View key={index}>
                    <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                    <View>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: item.work })} style={[styles.rowDirection]}>
                        <View style={[styles.width60]}>
                          <Text style={[styles.headingText2]}>{matchScore}</Text>
                        </View>
                        <View style={[styles.curtailText,styles.calcColumn200]}>
                          <View style={[styles.curtailText,styles.headingText5]}>
                            <Text>{item.work.title}</Text>
                          </View>
                          <View>
                            <Text style={[styles.descriptionText1,styles.curtailText]}>{item.work.employerName}</Text>
                          </View>
                        </View>
                      </TouchableOpacity>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.width50]}>
                          <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                          <TouchableOpacity onPress={() => this.favoriteItem(item) }>
                            <Image source={(this.state.favorites.includes(item.work._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                        <View style={[styles.width30]}>
                          <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: item.work })}>
                            <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>

                  </View>
                )
              }
            }
          }
        }
      }
    }

    return rows
  }

  segueToNext() {
    console.log('segueToNext called', this.state.assessments[this.state.nextIndex])

    this.retrieveData(this.state.assessments[this.state.nextIndex], this.state.nextIndex)
  }

  render() {

    return (
      <ScrollView style={styles.card}>
        <View>
          {this.state.assessmentTitle ? (
            <View>
              <View>
                <View style={[styles.spacer]} />

                <View style={[styles.rowDirection,styles.flex1]}>
                  <View style={[styles.rowDirection,styles.flex50]}>
                    <View>
                      <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} />
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Assessments')}>
                        <View>
                          <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square14,styles.contain,styles.rotate180]}/>
                        </View>
                      </TouchableOpacity>
                    </View>

                    <View>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Assessments')}>
                        <View>
                          <Text style={[styles.descriptionText1]}>Back</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                  <View style={[styles.rowDirection,styles.flex50,styles.justifyEnd]}>
                    <View>
                      <TouchableOpacity onPress={() => this.segueToNext()}>
                        <View>
                          <Text style={[styles.descriptionText1,styles.rightPadding]}>Next</Text>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                      <TouchableOpacity onPress={() => this.segueToNext()}>
                        <View>
                          <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square14,styles.contain]}/>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>

              </View>

              <View style={[styles.calcColumn60,styles.centerText]}>
                <View>
                  <View style={[styles.superSpacer]}/>
                  <Text style={[styles.centerText,styles.headingText2]}>{this.state.assessmentTitle}</Text>
                  <Text style={[styles.centerText,styles.row10]}>{this.state.assessmentDescription}</Text>

                  <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

                  <View style={[styles.centerHorizontally, styles.flexCenter]}>
                    <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.props.history.push({ pathname: assessmentDetailsPath + '/' + this.state.assessmentTitle.replace(" ", "-").toLowerCase(), state: { assessments: this.state.assessments, index: this.state.index, assessment: this.state.assessments[this.state.index], resultsData: this.state.resultsData }})}><Text style={[styles.whiteColor]}>{(this.state.resultsData && this.state.resultsData[this.state.index]) ? "Edit" : "Start"}</Text></TouchableOpacity>
                  </View>
                  <View style={[styles.centerHorizontally,styles.row10,styles.rowDirection,styles.flex1]}>
                    <View style={[styles.flex50,styles.alignEnd, styles.rightPadding]}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Paths', { subNavSelected: 'Careers', calculateMatches: true })}>
                        <View style={[styles.padding10,styles.horizontalMargin5,styles.ctaBorder, styles.width42, { borderRadius: 21}]}>
                          <Image source={{ uri: pathsIconDark}} style={[styles.square22,styles.contain]}/>
                        </View>
                      </TouchableOpacity>
                    </View>
                    <View style={[styles.flex50, styles.leftPadding]}>
                      <TouchableOpacity onPress={() => this.props.navigation.navigate('Opportunities', { calculateMatches: true })}>
                        <View style={[styles.padding10,styles.horizontalMargin5,styles.ctaBorder, styles.width42, { borderRadius: 21}]}>
                          <Image source={{ uri: opportunitiesIconDark}} style={[styles.square22,styles.contain]}/>
                        </View>
                      </TouchableOpacity>
                    </View>
                  </View>

                  <View style={[styles.superSpacer]}/>
                </View>
              </View>

              <View style={[styles.horizontalLine,styles.ctaBorderColor]} />

              {this.state.resultsData && (
                <View>
                  {(this.state.matchesByAssessment) ? (
                    <View style={[styles.calcColumn60,styles.topMarginNegative4,styles.rowDirection,styles.flex1]}>
                      <View style={(this.state.viewIndex === 0) ? [styles.flex50,styles.ctaBackgroundColor] : [styles.flex50]}>
                        <TouchableOpacity onPress={() => this.setState({ viewIndex: 0 })}>
                          <View style={[styles.row15]}>
                            <Text style={(this.state.viewIndex === 0) ? [styles.whiteColor] : []}>Results</Text>
                          </View>
                        </TouchableOpacity>
                      </View>
                      <View style={(this.state.viewIndex === 1) ? [styles.flex50,styles.ctaBackgroundColor] : [styles.flex50]}>
                        <TouchableOpacity onPress={() => this.setState({ viewIndex: 1})}>
                          <View style={[styles.row15]}>
                            <Text style={(this.state.viewIndex === 0) ? [styles.whiteColor] : []}>Matches</Text>
                          </View>
                        </TouchableOpacity>
                      </View>

                    </View>
                  ) : (
                    <View style={[styles.calcColumn60,styles.topMarginNegaative4]}>
                      <View style={[styles.calcColumn60,styles.ctaBackgroundColor]}>
                        <View style={[styles.row15]}>
                          <Text style={[styles.whiteColor]}>Results</Text>
                        </View>
                      </View>

                    </View>
                  )}

                  {(this.state.viewIndex === 0) && (
                    <View>
                      {this.renderResults()}
                    </View>
                  )}

                  {(this.state.viewIndex === 1) && (
                    <View>
                      <View style={[styles.spacer]} />
                      <View style={[styles.calcColumn60]}>
                        <View style={(this.state.subIndex === 1) ? [styles.horizontalPadding20,styles.ctaBackgroundColor] : [styles.horizontalPadding20]}>
                          <TouchableOpacity onPress={() => this.setState({ subIndex: 1})} style={styles.flex1}>
                            <View style={[styles.flex1,styles.flexCenter]}>
                              <Text>Careers</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={(this.state.subIndex === 2) ? [styles.horizontalPadding20,styles.ctaBackgroundColor] : [styles.horizontalPadding20]}>
                          <TouchableOpacity onPress={() => this.setState({ subIndex: 2})}  style={styles.flex1}>
                            <View style={[styles.flex1,styles.flexCenter]}>
                              <Text>Employers</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                        <View style={(this.state.subIndex === 3) ? [styles.horizontalPadding20,styles.ctaBackgroundColor] : [styles.horizontalPadding20]}>
                          <TouchableOpacity onPress={() => this.setState({ subIndex: 3})} style={styles.flex1}>
                            <View style={[styles.flex1,styles.flexCenter]}>
                              <Text>Internships</Text>
                            </View>
                          </TouchableOpacity>
                        </View>

                      </View>
                      {this.renderMatches()}

                    </View>
                  )}
                </View>
              )}
            </View>
          ) : (
            <View />
          )}

        </View>

      </ScrollView>

    )
  }
}

export default AssessmentDetails;
