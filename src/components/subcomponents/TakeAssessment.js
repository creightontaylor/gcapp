import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, TextInput } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
// import DraggableFlatList from 'react-native-draggable-flatlist'
import {Picker} from '@react-native-picker/picker';

const dragIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/drag-icon.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';
const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const questionMarkBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/question-mark-blue.png';
const skillsIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/skills-icon.png';

class TakeAssessment extends Component {
  constructor(props) {
    super(props)
    this.state = {
      excludeRankingQuestions: true,

      questions: [' '],
      descriptions: [],
      categories: [' '],
      questionIndex: 0,
      curentQuestion: '',
      option1: '',
      option2: '',
      option3: '',
      option4: '',
      option5: '',
      option1Disabled: false,
      option2Disabled: false,
      option3Disabled: false,
      option4Disabled: false,
      option5Disabled: false,
      responses: '',//'123111111111111111111111111111111111111111111111111111111125',
      optionSelected: '0',
      wpResponses: [],

      assessments: [],
      index: 0,

      answerTypes: [],
      answerChoices: [],

      gravitateValues: [],
      employerValues: [],
      topValues: [],

      pathwayOptions: [],

      done: false,
      type: 'Interest Assessment',

      animating: false,

      interestScoreData: null,
      careerMatchData: null,
      interestsData: {},
      skillsData: [],
      skillsAnswers: '',
      personalityData: [],
      resultsData: [null, null, null, null]
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)

    this.option1Clicked = this.option1Clicked.bind(this)
    this.option2Clicked = this.option2Clicked.bind(this)
    this.option3Clicked = this.option3Clicked.bind(this)
    this.option4Clicked = this.option4Clicked.bind(this)
    this.option5Clicked = this.option5Clicked.bind(this)
    this.renderAnswerChoices = this.renderAnswerChoices.bind(this)
    this.getResults = this.getResults.bind(this)

    this.nextQuestion = this.nextQuestion.bind(this)
    this.previousQuestion = this.previousQuestion.bind(this)

    this.onDragEnd = this.onDragEnd.bind(this)

    this.renderQuestions = this.renderQuestions.bind(this)
    this.itemClicked = this.itemClicked.bind(this)
    this.submitAssessment = this.submitAssessment.bind(this)

    this.renderTaggingAssessment = this.renderTaggingAssessment.bind(this)
    this.addItem = this.addItem.bind(this)
    this.removeItem = this.removeItem.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.searchCompetencies = this.searchCompetencies.bind(this)
    this.competencyClicked = this.competencyClicked.bind(this)
    this.pullRecommendationOptions = this.pullRecommendationOptions.bind(this)
    this.addToSkills = this.addToSkills.bind(this)

  }

  componentDidMount() {
    console.log('SubTakeAssessment component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in SubTakeAssessment', this.props.type)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData()
    } else if (this.props.index !== prevProps.index) {
      this.retrieveData()
    } else if (this.props.assessment !== prevProps.assessment) {
      this.retrieveData()
    } else if (this.props.resultsData !== prevProps.resultsData) {
      this.retrieveData()
    }
   }

  retrieveData = async() => {
    try {

      // console.log('this is causing the error')

      let assessmentTitle = this.props.assessmentTitle
      let type = this.props.type
      const assessments = this.props.assessments
      const index = this.props.index
      const assessment = this.props.assessment
      let resultsData = this.props.resultsData
      const assessmentDescription = this.props.assessmentDescription
      console.log('taggers type: ', type)
      const emailId = await AsyncStorage.getItem('email')
      let email = emailId
      const username = await AsyncStorage.getItem('username');
      const cuFirstName = await AsyncStorage.getItem('firstName');
      const cuLastName = await AsyncStorage.getItem('lastName');
      const orgFocus = await AsyncStorage.getItem('orgFocus');
      const orgName = await AsyncStorage.getItem('orgName');
      const roleName = await AsyncStorage.getItem('roleName');
      const remoteAuth = await AsyncStorage.getItem('remoteAuth');
      const pathway = await AsyncStorage.getItem('pathway');

      let activeOrg = await AsyncStorage.getItem('activeOrg')
      if (!activeOrg) {
        activeOrg = 'guidedcompass'
      }
      //const email = 'harry@potter.com'
      this.setState({ emailId, postsAreLoading: true })

      if (emailId !== null) {
        // We have data!!
        console.log('what is the email of this user', emailId);

        this.setState({ emailId: email, username, cuFirstName, cuLastName, activeOrg, orgFocus, assessmentTitle,
        assessmentDescription, type, assessments, index, assessment, resultsData, remoteAuth })

        Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
        .then((response) => {
          console.log('Org info query attempted');

          if (response.data.success) {
            console.log('org info query worked!')

            let placementPartners = null
            if (response.data.orgInfo.placementPartners) {
              placementPartners = response.data.orgInfo.placementPartners

            }
            let orgContactEmail = response.data.orgInfo.orgContactEmail

            this.setState({ placementPartners, orgContactEmail })
          }
        })

        Axios.get('https://www.guidedcompass.com/api/assessment/questions')
        .then((response) => {
            //console.log('O*Net worked', response.data.body, this);
            console.log('show me sub response')
            if ( response.data.success === true ) {
              console.log('sub ass query worked', type)

              let questions = []
              let categories = []
              let functions = []
              let option1: ''
              let option2: ''
              let option3: ''
              let option4: ''
              let option5: ''

              let answerTypes = []
              let answerChoices = []

              let realTechSkillsLength = 0
              let otherLength = 0

              let descriptions = []

              let gravitateValues = []
              let employerValues = []

              if (type === 'work preferences') {
                let excludeRankingQuestions = this.state.excludeRankingQuestions
                for (let i = 1; i <= response.data.assessments.workPreferenceQuestions.length; i++) {
                  console.log('show at: ', response.data.assessments.workPreferenceQuestions[i - 1].answerType)

                  if ((excludeRankingQuestions) && (response.data.assessments.workPreferenceQuestions[i - 1].answerType === 'Ranking') || (this.props.fromApply && response.data.assessments.workPreferenceQuestions[i - 1].answerType === 'Ranking')) {
                    // skip until we have a solution
                  } else {
                    questions.push(response.data.assessments.workPreferenceQuestions[i - 1].name)
                    answerTypes.push(response.data.assessments.workPreferenceQuestions[i - 1].answerType)
                    answerChoices.push(response.data.assessments.workPreferenceQuestions[i - 1].answerChoices)
                  }
                }

                //temporary - DELETE
                // questions.push('Rank your interest in the following macro-technology trends that may substantially disrupt the labor market. You may consider working on related projects and joining companies that have placed bets in these areas:')
                // answerTypes.push('Ranking')
                // answerChoices.push(['technologyTrends'])
                //
                // questions.push('Rank your interest in solving the following macro-societal problems. You may consider working on related projects and joining companies looking to solve these problems:')
                // answerTypes.push('Ranking')
                // answerChoices.push(['societalProblems'])

                //console.log('gut check', answerTypes, answerChoices)

              } else if (type === 'interests') {
                //questions = response.data.assessments.interestQuestions
                // questions = ['Realistic (The Do-Er)', 'Investigative (The Thinker)', 'Artistic (The Creator)',
                // 'Social (The Helper)', 'Enterprising (The Persuader)', 'Conventional (The Organizer)'
                // ]
                questions = ['How much do you agree that the below description describes you?', 'How much do you agree that the below description describes you?',
                  'How much do you agree that the below description describes you?', 'How much do you agree that the below description describes you?',
                  'How much do you agree that the below description describes you?','How much do you agree that the below description describes you?'
                ]
                descriptions = [
                  'You like to work with things.\n\nYou tend to be assertive and competitive, and are interested in activities requiring motor coordination, skill and strength.\n\nYou approach problem solving by doing something, rather than talking about it, or sitting and thinking about it.\n\nYou also prefer concrete approaches to problem solving, rather than abstract theory.\n\nFinally, your interests tend to focus on scientific or mechanical rather than cultural and aesthetic areas.',
                  'You tend to prefer to work with data.\n\nYou like to think and observe rather than act, to organize and understand information rather than to persuade.\n\nYou also prefer individual rather than people oriented activities.',
                  'You like to work with ideas and things.\n\nYou tend to be creative, open, inventive, original, perceptive, sensitive, independent and emotional. You rebel against structure and rules, but enjoy tasks involving people or physical skills.\n\nYou tend to be more emotional than the others.',
                  'You like to work with people and seem to satisfy their needs in teaching or helping situations.\n\nYou tend to be drawn more to seek close relationships with other people and are less apt to want to be really intellectual or physical.',
                  'You like to work with people and data.\n\nYou are likely a good talker, and use this skill to lead or persuade others.\n\nYou also value reputation, power, money and status.',
                  'You prefer to work with data and you like rules and regulations.\n\n You emphasize self-control, and you like structure and order.\n\n You dislike unstructured or unclear work and unclear interpersonal situations.\n\nYou also place value on reputation, power, or status.'
                ]
                option1 = 'Strongly Disagree'
                option2 = 'Disagree'
                option3 = 'Unsure'
                option4 = 'Agree'
                option5 = 'Strongly Agree'
                type = 'interests'
              } else if (type === 'skills') {

                console.log('about to count skill assessment', activeOrg)

                if (this.props.skillQuestions) {
                  console.log('check 2', this.props.skillQuestions)

                  const skills = this.props.skillQuestions

                  // should be
                  for (let i = 1; i <= skills.length; i++) {
                    if (skills[i - 1].title) {
                      questions.push(skills[i - 1].title)
                    } else if (skills[i - 1].name) {
                      questions.push(skills[i - 1].name)
                    }

                    categories.push(skills[i - 1].skillType)
                    functions.push(skills[i - 1].skillType)
                    descriptions.push(skills[i - 1].description)
                  }

                  option1 = '10th Percentile (Not Skilled)'
                  option2 = '30th Percentile'
                  option3 = '50th Percentile (Average Skilled)'
                  option4 = '70th Percentile'
                  option5 = '90th Percentile (Highly Skilled)'
                  type = 'skills'

                  // console.log('skills: ', skills, questions, categories, functions)
                  const currentQuestion = questions[0]
                  realTechSkillsLength = questions.length
                  // console.log('show questions 12: ', questions)

                  this.setState({
                    questions, categories, functions, currentQuestion,
                    option1, option2, option3, option4, option5, type,
                    answerTypes, answerChoices,
                    realTechSkillsLength, otherLength, descriptions
                  })

                }

                this.pullRecommendationOptions(activeOrg, null, pathway)
                // const orgCode = activeOrg
                // //questions are from benchmark
                // Axios.get('https://www.guidedcompass.com/api/benchmarks/skill-assessment', { params: { orgCode } })
                // .then((response) => {
                //
                //   if (response.data.success) {
                //     console.log('Benchmark query worked', response.data);
                //
                //     let skills = []
                //     let rawSkills = []
                //
                //     for (let i = 1; i <= response.data.benchmarks.length; i++) {
                //
                //       if (activeOrg === 'dpscd') {
                //         // console.log('inners 1', response.data.benchmarks[i - 1].pathway, pathway)
                //         if (response.data.benchmarks[i - 1].pathway === pathway) {
                //
                //           let tempSkills = response.data.benchmarks[i - 1].skills
                //           if (tempSkills && tempSkills.length > 0) {
                //             // console.log('inners 2')
                //             for (let j = 1; j <= tempSkills.length; j++) {
                //               if (tempSkills[j - 1].skillType !== 'Trait') {
                //                 if (!rawSkills.includes(tempSkills[j - 1].title)) {
                //                  skills.push({ name: tempSkills[j - 1].title, skillType: tempSkills[j - 1].skillType, benchmarkTitle: response.data.benchmarks[i - 1].title, benchmarkFunction: response.data.benchmarks[i - 1].jobFunction })
                //                  rawSkills.push(tempSkills[j - 1].title)
                //                 } else {
                //                   console.log('not include')
                //                 }
                //               }
                //             }
                //           }
                //         }
                //       } else {
                //         let tempSkills = response.data.benchmarks[i - 1].skills
                //         if (tempSkills && tempSkills.length > 0) {
                //           for (let j = 1; j <= tempSkills.length; j++) {
                //             if (tempSkills[j - 1].skillType !== 'Trait') {
                //               if (!rawSkills.includes(tempSkills[j - 1].title)) {
                //                skills.push({ name: tempSkills[j - 1].title, skillType: tempSkills[j - 1].skillType, benchmarkTitle: response.data.benchmarks[i - 1].title, benchmarkFunction: response.data.benchmarks[i - 1].jobFunction })
                //                rawSkills.push(tempSkills[j - 1].title)
                //               } else {
                //                 console.log('not include')
                //               }
                //             }
                //           }
                //         }
                //       }
                //     }
                //
                //     skills.sort(function(a,b) {
                //       return b.benchmarkFunction - a.benchmarkFunction;
                //     })
                //
                //     console.log('record skills length: ', skills.length)
                //
                //     for (let i = 1; i <= skills.length; i++) {
                //       questions.push(skills[i - 1].name)
                //       categories.push(skills[i - 1].benchmarkFunction)
                //       functions.push(skills[i - 1].benchmarkFunction)
                //       descriptions.push(skills[i - 1].description)
                //     }
                //
                //     option1 = '10th Percentile (Not Skilled)'
                //     option2 = '30th Percentile'
                //     option3 = '50th Percentile (Average Skilled)'
                //     option4 = '70th Percentile'
                //     option5 = '90th Percentile (Highly Skilled)'
                //     type = 'skills'
                //
                //     console.log('skills: ', skills, questions, categories, functions, this.state.responses)
                //     const currentQuestion = questions[0]
                //     realTechSkillsLength = questions.length
                //
                //     this.setState({
                //       questions, categories, functions, currentQuestion,
                //       option1, option2, option3, option4, option5, type,
                //       answerTypes, answerChoices,
                //       realTechSkillsLength, otherLength, descriptions
                //     })
                //
                //   } else {
                //     console.log('no benchmarks found', response.data.message)
                //
                //   }
                //
                // }).catch((error) => {
                //     console.log('Benchmark query did not work', error);
                // });

                // else if (activeOrg === 'c2c' || activeOrg === 'block' || activeOrg === 'dpscd') {
                //
                //
                // } else {
                //
                //   let generalSkills = response.data.assessments.generalSkills
                //   let socialSkills = response.data.assessments.socialSkills
                //   let techSkills = response.data.assessments.techSkills
                //
                //   /*
                //   let techSkills = [
                //     { name: 'How good are you at picking up and using tech tools efficiently (e.g. Microsoft Excel)?', category: 'Tech Tools'},
                //     { name: 'How good are you at programming with HTML, Javascript, or some other language', category: 'Programming Languages'}
                //   ]*/
                //   realTechSkillsLength = response.data.assessments.techSkills.length
                //   otherLength = generalSkills.length + socialSkills.length
                //   let questionCount = generalSkills.length + socialSkills.length + techSkills.length
                //   console.log('what does count look like', questionCount, generalSkills.length, techSkills.length)
                //
                //   let techSkillsArray = []
                //
                //   for (let i = 1; i <= questionCount; i++) {
                //     console.log('loop questions', i)
                //
                //     if (i <= generalSkills.length) {
                //       categories.push('General Skills')
                //       functions.push("")
                //     } else if (i <= generalSkills.length + socialSkills.length) {
                //       categories.push('Social Skills')
                //       functions.push("")
                //     } else {
                //       categories.push('Technical Skills')
                //       techSkillsArray.push(techSkills[i - 1 - generalSkills.length - socialSkills.length].name)
                //       functions.push(techSkills[i - 1 - generalSkills.length - socialSkills.length].function)
                //       console.log('let me see the function', techSkills[i - 1  - generalSkills.length - socialSkills.length].function)
                //     }
                //   }
                //   questions = generalSkills.concat(socialSkills, techSkillsArray)
                //
                //   option1 = '10th Percentile (Not Skilled)'
                //   option2 = '30th Percentile'
                //   option3 = '50th Percentile (Average Skilled)'
                //   option4 = '70th Percentile'
                //   option5 = '90th Percentile (Highly Skilled)'
                //   type = 'skills'
                // }

              } else if (type === 'personality') {
                let mbQuestions = response.data.assessments.mbQuestions
                let fiveFactorsQuestions = response.data.assessments.fiveFactorsQuestions

                const cultureQuestions= response.data.assessments.cultureQuestions
                const disorderQuestions= response.data.assessments.disorderQuestions

                questions = mbQuestions.concat(fiveFactorsQuestions, cultureQuestions, disorderQuestions)
                option1 = 'Strongly Disagree'
                option2 = 'Disagree'
                option3 = 'Unsure'
                option4 = 'Agree'
                option5 = 'Strongly Agree'
                type = 'personality'
              } else if (type === 'values') {

                gravitateValues = response.data.assessments.gravitateValues
                employerValues = response.data.assessments.employerValues
                questions = ['','','','']
              }

              console.log('show answer choices', answerChoices, questions, this.state.questionIndex, type)
              this.setState({
                  questions:  questions,
                  categories: categories,
                  functions: functions,
                  currentQuestion: questions[0],
                  option1: option1,
                  option2: option2,
                  option3: option3,
                  option4: option4,
                  option5: option5,
                  type: type,
                  answerTypes, answerChoices,

                  realTechSkillsLength, otherLength, descriptions,

                  gravitateValues, employerValues

              })

              Axios.get('https://www.guidedcompass.com/api/workoptions')
              .then((response) => {
                console.log('Work options query tried');

                if (response.data.success) {
                  console.log('Work options query succeeded')

                  let functionOptions = []
                  for (let i = 1; i <= response.data.workOptions[0].functionOptions.length; i++) {
                    if (i > 1) {
                      functionOptions.push(response.data.workOptions[0].functionOptions[i - 1])
                    }
                  }

                  let industryOptions = []
                  for (let i = 1; i <= response.data.workOptions[0].industryOptions.length; i++) {
                    if (i > 1) {
                      industryOptions.push(response.data.workOptions[0].industryOptions[i - 1])
                    }
                  }

                  let hoursPerWeekOptions = []
                  for (let i = 1; i <= response.data.workOptions[0].hoursPerWeekOptions.length; i++) {
                    if (i > 1) {
                      hoursPerWeekOptions.push(response.data.workOptions[0].hoursPerWeekOptions[i - 1])
                    }
                  }

                  let annualPayOptions = []
                  for (let i = 1; i <= response.data.workOptions[0].annualPayOptions.length; i++) {
                    if (i > 1) {
                      annualPayOptions.push(response.data.workOptions[0].annualPayOptions[i - 1])
                    }
                  }

                  let employeeCountOptions = []
                  for (let i = 1; i <= response.data.workOptions[0].employeeCountOptions.length; i++) {
                    if (i > 1) {
                      employeeCountOptions.push(response.data.workOptions[0].employeeCountOptions[i - 1])
                    }
                  }

                  let employerTypeOptions = []
                  for (let i = 1; i <= response.data.workOptions[0].employerTypeOptions.length; i++) {
                    if (i > 1) {
                      employerTypeOptions.push(response.data.workOptions[0].employerTypeOptions[i - 1])
                    }
                  }

                  let workDistanceOptions = []
                  for (let i = 1; i <= response.data.workOptions[0].workDistanceOptions.length; i++) {

                    if (i > 1) {
                      workDistanceOptions.push(response.data.workOptions[0].workDistanceOptions[i - 1])
                    }
                  }

                  let workStyleOptions = []
                  for (let i = 1; i <= response.data.workOptions[0].workStyleOptions.length; i++) {
                    if (i > 1) {
                      workStyleOptions.push(response.data.workOptions[0].workStyleOptions[i - 1])
                    }
                  }

                  const technologyTrends = response.data.workOptions[0].technologyTrends
                  const societalProblems = response.data.workOptions[0].societalProblems

                  for (let i = 1; i <= answerChoices.length; i++) {
                    let ac = answerChoices[i - 1]
                    console.log('looping through acs: ', ac)
                    if (ac) {
                      if (ac[0] === 'employeeCountOptions') {
                        ac = employeeCountOptions
                      }

                      if (ac[0] === 'typeOptions') {
                        ac = employerTypeOptions
                        console.log('typeOptions: ', employerTypeOptions)
                      }

                      if (ac[0] === 'hourOptions') {
                        ac = hoursPerWeekOptions
                      }

                      if (ac[0] === 'payOptions') {
                        ac = annualPayOptions
                      }

                      if (ac[0] === 'functionOptions') {
                        ac = functionOptions
                      }

                      if (ac[0] === 'industryOptions') {
                        ac = industryOptions
                      }

                      console.log('log work distance ', i, ac[0], ac, workDistanceOptions)
                      if (ac[0] === 'workDistanceOptions') {
                        ac = workDistanceOptions
                      }

                      if (ac[0] === 'workStyleOptions') {
                        ac = workStyleOptions
                      }

                      if (ac[0] === 'technologyTrends') {
                        ac = technologyTrends
                      }

                      if (ac[0] === 'societalProblems') {
                        ac = societalProblems
                      }

                      answerChoices[i - 1] = ac
                    }
                  }

                  this.setState({ answerChoices, technologyTrends, societalProblems })

                  Axios.get('https://www.guidedcompass.com/api/assessment/results', { params: { emailId: email } })
                  .then((response) => {
                      console.log('query for assessment results worked on load');

                      if (response.data.success) {

                        console.log('actual assessment results', type)

                        let responses = ''
                        let wpResponses = []
                        let optionSelected = '0'
                        let ogSkillAnswers = []
                        console.log('testing 3', this.state.type)

                        if (type === 'work preferences') {

                          // wpResponses = response.data.results.workPreferenceAnswers

                          let tempWpResponses = response.data.results.workPreferenceAnswers

                          if (tempWpResponses && tempWpResponses.length) {
                            for (let i = 1; i <= tempWpResponses.length; i++) {
                              console.log('counter 1: ', i)
                              if (tempWpResponses[i - 1][0] === '[') {
                                console.log('counter 2: ', i)
                                const removedArrayEnds = tempWpResponses[i - 1].substring(1,tempWpResponses[i - 1].length - 1).replace(/"/g,"").replace(/"/g,"")
                                let convertedArray = removedArrayEnds.split(",")

                                if (i === 1|| i === 2) {
                                  // convertedArray = removedArrayEnds.split(",")
                                  // convertedArray = removedArrayEnds.match(/(".*?"|[^\s",][^",]+[^\s",])(?=\s*,|\s*$)/g);
                                  console.log('counter 3: ', i)

                                  convertedArray = []

                                  let options = []
                                  if (i === 1) {
                                    options = functionOptions // function question
                                  } else if (i === 2) {
                                    options = industryOptions // industry question
                                  }
                                  console.log('show options: ', options)
                                  for (let j = 1; j <= options.length; j++) {
                                    console.log('compare: ', tempWpResponses[i - 1])
                                    if (options[j - 1] && options[j - 1] !== '' && tempWpResponses[i - 1].includes(options[j - 1])) {
                                      convertedArray.push(options[j - 1])
                                    }
                                  }
                                  // console.log('yeah?', convertedArray)
                                  //var arr = str.match(/(".*?"|[^\s",][^",]+[^\s",])(?=\s*,|\s*$)/g);

                                  // "["Performing and EntertainingInstalling, Repairing, and Maintenance"]"
                                }

                                // console.log('show convertedArray: ', convertedArray)

                                wpResponses.push(convertedArray)
                                //wpResponses.push(tempWpResponses[i - 1])
                              } else {

                                console.log('show string: ', tempWpResponses[i - 1])
                                let wpResponse = tempWpResponses[i - 1]
                                if (wpResponse) {
                                  if (i === 7) {

                                    // wpResponse = wpResponse.split(" ")[0] + ' miles'
                                    // if (wpResponse.split(" ")[0].length === 3) {
                                    //   wpResponse = wpResponse.substring(1,3) + ' miles'
                                    // }
                                    wpResponse = wpResponse.replace(/\"/g, "")

                                  } else if (i === 4 || i === 5 || i === 6){

                                    wpResponse = wpResponse.replace(/\\/g, "")
                                    wpResponse = wpResponse.replace(/\"/g, "")
                                    // wpResponse = wpResponse.replace(/\\/g, "")
                                    console.log('show the annoying response: ', wpResponse)

                                  }
                                }

                                wpResponses.push(wpResponse)
                              }
                            }
                          }
                        }

                        if (type === 'interests' && response.data.results && response.data.results.interestAnswers) {

                          let interestAnswers = response.data.results.interestAnswers
                          responses = interestAnswers[0] + interestAnswers[2] + interestAnswers[4] + interestAnswers[6] + interestAnswers[8] + interestAnswers[10]
                          optionSelected = responses[0]
                          console.log('lets see interest responses ', responses, optionSelected)
                        }

                        if (type === 'skills' && response.data.results && response.data.results.newSkillAnswers && response.data.results.newSkillAnswers.length > 0) {
                          let skillQuestions = this.props.skillQuestions
                          ogSkillAnswers = response.data.results.newSkillAnswers

                          responses = ''

                          if (skillQuestions) {
                            for (let i = 1; i <= skillQuestions.length; i++) {
                              if (ogSkillAnswers.some(sa => sa.name === skillQuestions[i - 1].name)) {
                                console.log('compare the questions 1: ', skillQuestions[i - 1])
                                const answerIndex = ogSkillAnswers.findIndex(sa => sa.name === skillQuestions[i - 1].name);
                                responses = responses + ogSkillAnswers[answerIndex].score
                              } else if (ogSkillAnswers.some(sa => sa.name === skillQuestions[i - 1].title)) {
                                const answerIndex = ogSkillAnswers.findIndex(sa => sa.name === skillQuestions[i - 1].title);
                                console.log('compare the questions 2: ', answerIndex, ogSkillAnswers)
                                responses = responses + ogSkillAnswers[answerIndex].score
                              } else {
                                responses = responses + '0'
                              }
                            }
                          }

                          console.log('show totalAnswers: ', responses, skillQuestions, ogSkillAnswers, response.data.results.skillsAnswers)

                          // responses = response.data.results.skillsAnswers
                          optionSelected = responses[0]

                          // refresh the data
                          resultsData[3] = response.data.results.newSkillAnswers
                        } else if (type === 'skills' && response.data.results.skillsAnswers) {
                          responses = response.data.results.skillsAnswers
                          optionSelected = responses[0]
                        }
                        console.log('t3: ', responses)
                        if (type === 'personality' && response.data.results.personalityAnswers) {
                          responses = response.data.results.personalityAnswers
                          optionSelected = responses[0]
                        }
                        console.log('t4: ', responses)
                        let topValues = this.state.topValues
                        let topGravitateValues = response.data.results.topGravitateValues
                        let topEmployerValues = response.data.results.topEmployerValues
                        if (type === 'values' && response.data.results.topGravitateValues && topEmployerValues) {
                          responses = response.data.results.topGravitateValues.concat(topEmployerValues)
                          topValues = response.data.results.topGravitateValues
                        }


                        this.setState({
                          resultsId: response.data.results._id, responses, optionSelected, wpResponses,
                          topValues, topGravitateValues, topEmployerValues,
                          ogSkillAnswers, resultsData
                        });

                      } else {
                        console.log('error response for assessments', response.data)
                        // this.setState({ resultsErrorMessage: response.data.message })
                      }

                  }).catch((error) => {
                      console.log('query for assessment results did not work', error);
                  })


                } else {
                  console.log('no work options data found', response.data.message)

                }
              }).catch((error) => {
                  console.log('query for work options did not work', error);
              })
            } else {
              console.log('Assessment question query failed', response.data.message)
            }


        }).catch((error) => {
            console.log('Assessment query did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  onDragEnd(result) {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    console.log('show result: ', result)

    if (this.state.type === 'values') {

      if (result.destination.droppableId === 'gravitate') {
        const topGravitateValues = reorder(
          this.state.topGravitateValues,
          result.source.index,
          result.destination.index
        );

        this.setState({ topGravitateValues });
      } else if (result.destination.droppableId === 'employer') {
        const topEmployerValues = reorder(
          this.state.topEmployerValues,
          result.source.index,
          result.destination.index
        );

        this.setState({ topEmployerValues });
      }
    } else {

      let index = 0
      if (result.destination.droppableId && result.destination.droppableId.split('|')) {
        index = Number(result.destination.droppableId.split('|')[1])
      }

      if (this.state.questions[index].includes('technology trends')) {
        const technologyTrends = reorder(
          this.state.technologyTrends,
          result.source.index,
          result.destination.index
        );

        let wpResponses = this.state.wpResponses
        wpResponses[index] = technologyTrends

        this.setState({ technologyTrends, wpResponses });
      } else if (this.state.questions[index].includes('societal problems')) {
        const societalProblems = reorder(
          this.state.societalProblems,
          result.source.index,
          result.destination.index
        );

        let wpResponses = this.state.wpResponses
        wpResponses[index] = societalProblems

        this.setState({ societalProblems, wpResponses });
      }
    }
  }

  pullRecommendationOptions(orgCode, pathways, pathway) {
    console.log('pullRecommendationOptions called', orgCode, pathways, pathway)

    // exceptions w/ benchmarks: dpscd, unite-la?
    orgCode = 'general'

    Axios.get('https://www.guidedcompass.com/api/benchmarks', { params: { orgCode } })
    .then((response) => {

      if (response.data.success) {
        console.log('Benchmark query worked', response.data);

        let pathwayOptions = [{ value: '' }]
        let values = []
        for (let i = 1; i <= response.data.benchmarks.length; i++) {

          let value = response.data.benchmarks[i - 1].jobFunction

          let meetsCriteria = false
          if (pathways) {
            value = response.data.benchmarks[i - 1].pathway
            for (let j = 1; j <= pathways.length; j++) {
              if (pathways[j - 1]) {
                let pathwayName = pathways[j - 1].name
                if (pathways[j - 1].school) {
                  pathwayName = pathwayName + ' | ' + pathways[j - 1].school
                }

                if ((pathwayName === value) && !values.includes(value)) {
                  meetsCriteria = true
                }
              }
            }

          } else if (!values.includes(value)) {
            meetsCriteria = true
          }

          if (meetsCriteria) {
            values.push(value)

            if (response.data.benchmarks[i - 1].competencies) {
              const competencies = response.data.benchmarks[i - 1].competencies
              pathwayOptions.push({ value, competencies })
            } else {
              let skills = response.data.benchmarks[i - 1].skills
              let skillObjects = []

              for (let j = 1; j <= skills.length; j++) {
                if (skills[j - 1].title && skills[j - 1].skillType) {
                  const name = skills[j - 1].title
                  const skillType = skills[j - 1].skillType
                  skillObjects.push({ name, skillType })

                }
              }

              pathwayOptions.push({ value, skills: skillObjects })
            }
          }
        }

        this.setState({ pathwayOptions })

      } else {
        console.log('no benchmarks found', response.data.message)

      }

    }).catch((error) => {
        console.log('Benchmark query did not work', error);
    });
  }

  formChangeHandler(eventName,eventValue) {
    console.log('formChangeHandler called' )

    let wpResponses = this.state.wpResponses
    if (eventName === 'shortResponse') {

      if (eventValue === '') {
        wpResponses[this.state.questionIndex] = null
        this.setState({ shortResponse: eventValue, wpResponses })
      } else {
        wpResponses[this.state.questionIndex] = eventValue
        this.setState({ shortResponse: eventValue, wpResponses })
      }
    } else if (eventName.includes('shortResponse')) {
      const index = Number(eventName.split('|')[1])
      if (eventValue === '') {
        wpResponses[index] = null
        this.setState({ wpResponses })
      } else {
        wpResponses[index] = eventValue
        this.setState({ wpResponses })
      }
    } else if (eventName === 'longResponse') {

      if (eventValue === '') {
        wpResponses[this.state.questionIndex] = null
        this.setState({ longResponse: eventValue, wpResponses })
      } else {
        wpResponses[this.state.questionIndex] = eventValue
        this.setState({ longResponse: eventValue, wpResponses })
      }
    } else if (eventName.includes('longResponse')) {
      const index = Number(eventName.split('|')[1])
      if (eventValue === '') {
        wpResponses[index] = null
        this.setState({ wpResponses })
      } else {
        wpResponses[index] = eventValue
        this.setState({ wpResponses })
      }
    } else if (eventName === 'multipleChoice') {
      wpResponses[this.state.questionIndex] = eventValue
      this.setState({ multipleChoice: eventValue, wpResponses })
    } else if (eventName.includes('multipleChoice')) {

      const index = Number(eventName.split('|')[1])
      if (eventValue === '') {
        wpResponses[index] = null
        this.setState({ wpResponses })
      } else {
        wpResponses[index] = eventValue
        this.setState({ wpResponses })
      }

    } else if (eventName === 'multipleAnswer') {
      // wpResponses[this.state.questionIndex] = eventValue
      // this.setState({ multipleChoice: eventValue, wpResponses })

      if (this.state.type === 'values') {

        let topValues = this.state.topValues
        if (topValues.includes(eventValue)) {
          let index = topValues.indexOf(eventValue);
          if (index > -1) {
            topValues.splice(index, 1);
          }
        } else {

          if (topValues.length < 10) {
            topValues.push(eventValue)
          } else {
            // limiting to 10 values
          }
        }

        this.setState({ multipleAnswer: topValues, topValues })

      } else {
        let thisResponseArray = wpResponses[this.state.questionIndex]
        if (Array.isArray(thisResponseArray)) {
          if (thisResponseArray.includes(eventValue)) {
            let index = thisResponseArray.indexOf(eventValue);
            if (index > -1) {
              thisResponseArray.splice(index, 1);
            }
          } else {

            thisResponseArray.push(eventValue)

          }
        } else {
          thisResponseArray = []
          thisResponseArray.push(eventValue)
        }

        wpResponses[this.state.questionIndex] = thisResponseArray
        this.setState({ multipleAnswer: thisResponseArray, wpResponses })
      }
    } else if (eventName.includes('multipleAnswer')) {
      // wpResponses[this.state.questionIndex] = eventValue
      // this.setState({ multipleChoice: eventValue, wpResponses })

      if (this.state.type === 'values') {

        let topGravitateValues = this.state.topGravitateValues
        let topEmployerValues = this.state.topEmployerValues

        let index = Number(eventName.split("|")[1])
        if (index === 0) {
          console.log('index is 0', eventValue)
          if (topGravitateValues && topGravitateValues.includes(eventValue)) {
            let index = topGravitateValues.indexOf(eventValue);
            if (index > -1) {
              topGravitateValues.splice(index, 1);
            }
          } else {

            if (!topGravitateValues) {
              topGravitateValues = [eventValue]
            } else if (topGravitateValues.length < 10) {
              console.log('adding to gravitateValues')
              topGravitateValues.push(eventValue)
            } else {
              // limiting to 10 values
            }
          }
        } else {
          console.log('index is not 0')
          if (topEmployerValues && topEmployerValues.includes(eventValue)) {
            let index = topEmployerValues.indexOf(eventValue);
            if (index > -1) {
              topEmployerValues.splice(index, 1);
            }
          } else {

            if (!topEmployerValues) {
              topEmployerValues = [eventValue]
            } else if (topEmployerValues.length < 10) {
              topEmployerValues.push(eventValue)
            } else {
              // limiting to 10 values
            }
          }
        }
        console.log('show topGravitateValues: ', topGravitateValues)
        this.setState({ topGravitateValues, topEmployerValues })

      } else {
        const firstIndex = Number(eventName.split('|')[1])
        let thisResponseArray = wpResponses[firstIndex]
        if (Array.isArray(thisResponseArray)) {
          if (thisResponseArray.includes(eventValue)) {
            let index = thisResponseArray.indexOf(eventValue);
            if (index > -1) {
              thisResponseArray.splice(index, 1);
            }
          } else {

            thisResponseArray.push(eventValue)

          }
        } else {
          thisResponseArray = []
          thisResponseArray.push(eventValue)
        }

        wpResponses[firstIndex] = thisResponseArray
        this.setState({ wpResponses })
      }
    } else if (eventName === 'boolean') {
      wpResponses[this.state.questionIndex] = eventValue
      this.setState({ boolean: eventValue, wpResponses })
    } else if (eventName === 'pathway') {
      let selectedPathway = eventValue

      let skills = []
      let competencies = []
      let questions = []
      let categories = []
      for (let i = 1; i <= this.state.pathwayOptions.length; i++) {
        if (this.state.pathwayOptions[i - 1].value === selectedPathway) {
          skills = this.state.pathwayOptions[i - 1].skills
          competencies = this.state.pathwayOptions[i - 1].competencies
        }
      }

      let responses = ''
      if (skills && skills.length > 0){
        if (skills.length !== 0) {
          for (let i = 1; i <= skills.length; i++) {
            if (skills[i - 1].skillType !== 'Trait') {
              responses = responses + '0'
              questions.push(skills[i - 1].name)
              categories.push(skills[i - 1].skillType)
            }
          }
        }
      }

      this.setState({ pathway: selectedPathway, selectedPathway, skills, competencies, responses, questions, categories })
    } else if (eventName === 'skillName') {
      this.setState({ [eventName]: eventValue })
      this.searchCompetencies(eventValue, ['General Skill','Skill','Hard Skill','Soft Skill','Work Style','Ability','Tools Used'], null)
    } else {
      this.setState({ [eventName]: eventValue })
    }
  }

  searchCompetencies(competency, types, index) {
    console.log('searchCompetencies ', competency, types, index)

    if (competency === '') {
      const competencyOptions = []
      this.setState({ competencyOptions })
    } else {
      Axios.get('https://www.guidedcompass.com/api/competency/search', { params: { searchString: competency, types } })
      .then((response) => {
        console.log('Competency search query attempted', response.data);

          if (response.data.success) {
            console.log('competency search query worked')

            const competencyOptions = response.data.competencies
            this.setState({ competencyOptions });

          } else {
            console.log('competency search query did not work', response.data.message)
          }

      }).catch((error) => {
          console.log('Competency search query did not work for some reason', error);
      });
    }
  }

  competencyClicked(optionIndex, type) {
    console.log('competencyClicked', optionIndex, type, this.state.competencyOptions[optionIndex])

    let skillName = this.state.competencyOptions[optionIndex].name

    const competencyOptions = []
    this.setState({ skillName, competencyOptions })

  }

  option1Clicked() {
    console.log('option 1 clicked');

    this.handleClick('1');
  }

  option2Clicked() {
    console.log('option 2 clicked')

    this.handleClick('2');
  }

  option3Clicked() {
    console.log('option 3 clicked')

    this.handleClick('3');
  }

  option4Clicked() {
    console.log('option 4 clicked')

    this.handleClick('4');
  }

  option5Clicked() {
    console.log('option 5 clicked')

    this.handleClick('5');
  }

  handleClick(optionSelected) {
    console.log('handleClick', optionSelected)
    if (this.state.type === 'skills') {

      let newQuestionIndex = this.state.questionIndex
      let newResponses = this.state.responses

      if (newResponses.length === this.state.questionIndex) {
        newQuestionIndex = this.state.questionIndex + 1
        newResponses = newResponses + optionSelected
        console.log('first one')
      } else if (newResponses.length > this.state.questionIndex + 1) {
        newResponses = newResponses.substring(0,this.state.questionIndex) + optionSelected + newResponses.substring(this.state.questionIndex + 1,newResponses.length)
      } else {
        newResponses = newResponses.substring(0,newResponses.length - 1) + optionSelected
      }

      console.log('compare counts', newQuestionIndex, newResponses.length, newResponses)
      this.setState({
        responses: newResponses, optionSelected
      })
    } else {

      // const newQuestionIndex = this.state.questionIndex + 1
      let newResponses = this.state.responses
      if (newResponses.length === this.state.questionIndex) {
        newResponses = newResponses + optionSelected
      } else if (newResponses.length > this.state.questionIndex + 1) {
        newResponses = newResponses.substring(0,this.state.questionIndex) + optionSelected + newResponses.substring(this.state.questionIndex + 1,newResponses.length)
      } else {
        newResponses = newResponses.substring(0,newResponses.length - 1) + optionSelected
      }

      this.setState({
        responses: newResponses, optionSelected
      })
    }
  }

  nextQuestion() {
    console.log('questionIndex called', this.state.responses, this.state.gravitateValues, this.state.topValues)

    let newQuestionIndex = this.state.questionIndex + 1
    let currentQuestion = this.state.questions[newQuestionIndex]

    if (this.state.questionIndex === this.state.questions.length - 1) {

      let totalResponses = '';
      if (this.state.type === 'interests') {
        //questions follow a pattern of pairs:
        for (let i = 1; i <= 60; i++) {
          if (i % 12 === 1 || i % 12 === 2) {
            totalResponses = totalResponses + this.state.responses.substring(0,1)
          } else if (i % 12 === 3 || i % 12 === 4) {
            totalResponses = totalResponses + this.state.responses.substring(1,2)
          } else if (i % 12 === 5 || i % 12 === 6) {
            totalResponses = totalResponses + this.state.responses.substring(2,3)
          } else if (i % 12 === 7 || i % 12 === 8) {
            totalResponses = totalResponses + this.state.responses.substring(3,4)
          } else if (i % 12 === 9 || i % 12 === 10) {
            totalResponses = totalResponses + this.state.responses.substring(4,5)
          } else {
            totalResponses = totalResponses + this.state.responses.substring(5,6)           //this.setState({ responses: this.state.responses + optionSelected })
          }
        }
      } else if (this.state.type === 'work preferences') {
        totalResponses = this.state.wpResponses
      } else if (this.state.type === 'values') {
        totalResponses = this.state.topGravitateValues.concat(this.state.topValues)
      } else {
        totalResponses = this.state.responses
      }

      this.getResults(totalResponses);

    } else {

      if (this.state.type === 'skills') {

        let newResponses = this.state.responses
        let optionSelected = this.state.optionSelected

        let option1 = '10th Percentile (Not Skilled)'
        let option2 = '30th Percentile'
        let option3 = '50th Percentile (Average Skilled)'
        let option4 = '70th Percentile'
        let option5 = '90th Percentile (Highly Skilled)'

        if (this.state.questions[newQuestionIndex].startsWith("How many hours best describes the time")) {
          option1 = '0 - 20 Hours'
          option2 = '20 - 100 Hours'
          option3 = '100 - 1,000 Hours'
          option4 = '1,000 - 5,000 Hours'
          option5 = '5,000 Hours+'
        }

        if (this.state.questions[this.state.questionIndex].startsWith("How many hours best describes the time")) {

          if (!this.state.questions[this.state.questionIndex].includes("spreadsheet")) {
            if (optionSelected === "1" || optionSelected === "2") {
              console.log('we got here 2', this.state.questions[this.state.questionIndex])
              let functionCount = 1

              for (let i = 1; i <= this.state.functions.length; i++) {
                const functionIndex = i - 1
                if (functionIndex > this.state.questionIndex) {
                  console.log('startedCount', this.state.functions[i - 1], this.state.functions[this.state.questionIndex])
                  if (this.state.functions[i - 1] === this.state.functions[this.state.questionIndex]) {
                    console.log('we got here 3', this.state.functions[i - 1], this.state.questions[i - 1])
                    functionCount = functionCount + 1

                    const tempIndex = newQuestionIndex + functionCount - 1
                    if (newResponses[tempIndex]) {
                      newResponses = newResponses.substring(0,tempIndex - 1) + "1" + newResponses.substring(tempIndex, newResponses.length)
                    } else {
                      newResponses = newResponses + "1"
                    }

                    if (this.state.questions.length !== i) {
                      newQuestionIndex = newQuestionIndex + 1
                      currentQuestion = this.state.questions[newQuestionIndex]
                    }
                  }
                }
              }
              console.log('we got here 4', this.state.questionIndex, newQuestionIndex, this.state.questions.length - 1, this.state.questions[this.state.questions.length - 1], newResponses)

              if (this.state.questions[newQuestionIndex]) {
                if (this.state.questions[newQuestionIndex].startsWith("How many hours best describes the time")) {
                  option1 = '0 - 20 Hours'
                  option2 = '20 - 100 Hours'
                  option3 = '100 Hours - 1,000 Hours'
                  option4 = '1,000 Hours - 5,000 Hours'
                  option5 = '5,000 Hours+'
                }
              }
            }
          }
        }

        optionSelected = '0'
        if (newResponses[newQuestionIndex]) {
          optionSelected = newResponses[newQuestionIndex]
        }

        this.setState({ option1, option2, option3, option4, option5, responses: newResponses,
          questionIndex: newQuestionIndex, currentQuestion, optionSelected })

      } else if (this.state.type === 'work preferences'){
        console.log('were in wp')

        let shortResponse = ''
        let longResponse = ''
        let multipleChoice = ''
        let boolean = ''

        if (this.state.wpResponses[newQuestionIndex]) {
          if (this.state.answerTypes[newQuestionIndex] === 'shortResponse') {
            shortResponse = this.state.wpResponses[newQuestionIndex]
          } else if (this.state.answerTypes[newQuestionIndex] === 'longResponse') {
            longResponse = this.state.wpResponses[newQuestionIndex]
          } else if (this.state.answerTypes[newQuestionIndex] === 'multipleChoice') {
            multipleChoice = this.state.wpResponses[newQuestionIndex]
          } else if (this.state.answerTypes[newQuestionIndex] === 'boolean') {
            boolean = this.state.wpResponses[newQuestionIndex]
          }
        }

        console.log('were in wp 2', multipleChoice)

        this.setState({ questionIndex: newQuestionIndex, currentQuestion,
          shortResponse, longResponse, multipleChoice, boolean })

      } else {

        let optionSelected = '0'
        if (this.state.responses[newQuestionIndex]) {
          optionSelected = this.state.responses[newQuestionIndex]
          console.log('and here', optionSelected, this.state.responses, newQuestionIndex)
        }

        let selectedAnswer = this.state.selectedAnswer
        // let winningAnswer = this.state.selectedAnswer
        if (this.state.type === 'values') {
          selectedAnswer = null
        }

        let topGravitateValues = this.state.topGravitateValues
        let topValues = this.state.topValues

        if (this.state.type === 'values') {
          if (this.state.questionIndex % 2 === 1) {
            if (!topGravitateValues) {
              topGravitateValues = this.state.topValues
              console.log('show gravitateValues 1: ', topGravitateValues, topValues )
            }

            if (!this.state.topEmployerValues) {
              topValues = []
            } else {
              topValues = this.state.topEmployerValues
            }

          } else {

          }
        }
        console.log('show gravitateValues 2: ', topGravitateValues, topValues )
        // let orderedValues = this.state.orderedValues
        // if (orderedValues) {
        //
        // } else {
        //   orderedValues = this.state.topValues
        // }
        // console.log('show ordereredValues: ', orderedValues)
        this.setState({ questionIndex: newQuestionIndex, currentQuestion, optionSelected, selectedAnswer,
          topGravitateValues, topValues,
        })
      }
    }
  }

  previousQuestion() {
    console.log('previousQuestion called')

    let newQuestionIndex = this.state.questionIndex - 1
    let currentQuestion = this.state.questions[newQuestionIndex]

    if (this.state.type === 'skills') {

      let newResponses = this.state.responses
      let optionSelected = this.state.optionSelected

      let option1 = '10th Percentile (Not Skilled)'
      let option2 = '30th Percentile'
      let option3 = '50th Percentile (Average Skilled)'
      let option4 = '70th Percentile'
      let option5 = '90th Percentile (Highly Skilled)'

      if (this.state.questions[newQuestionIndex].startsWith("How many hours best describes the time")) {
        option1 = '0 - 20 Hours'
        option2 = '20 - 100 Hours'
        option3 = '100 - 1,000 Hours'
        option4 = '1,000 - 5,000 Hours'
        option5 = '5,000 Hours+'
      }

      optionSelected = '0'
      if (newResponses[newQuestionIndex]) {
        optionSelected = newResponses[newQuestionIndex]
      }

      this.setState({ option1, option2, option3, option4, option5, responses: newResponses,
        questionIndex: newQuestionIndex, currentQuestion, optionSelected })

    } else if (this.state.type === 'work preferences'){
      console.log('were in wp')

      let shortResponse = ''
      let longResponse = ''
      let multipleChoice = ''
      let boolean = ''

      if (this.state.wpResponses[newQuestionIndex]) {
        if (this.state.answerTypes[newQuestionIndex] === 'shortResponse') {
          shortResponse = this.state.wpResponses[newQuestionIndex]
        } else if (this.state.answerTypes[newQuestionIndex] === 'longResponse') {
          longResponse = this.state.wpResponses[newQuestionIndex]
        } else if (this.state.answerTypes[newQuestionIndex] === 'multipleChoice') {
          multipleChoice = this.state.wpResponses[newQuestionIndex]
        } else if (this.state.answerTypes[newQuestionIndex] === 'boolean') {
          boolean = this.state.wpResponses[newQuestionIndex]
        }
      }

      console.log('were in wp 2', multipleChoice)

      this.setState({ questionIndex: newQuestionIndex, currentQuestion,
        shortResponse, longResponse, multipleChoice, boolean })

    } else {
      console.log('were in here')
      let optionSelected = '0'
      if (this.state.responses[newQuestionIndex]) {
        optionSelected = this.state.responses[newQuestionIndex]
        console.log('and here', optionSelected, this.state.responses, newQuestionIndex)
      }

      this.setState({ questionIndex: newQuestionIndex, currentQuestion, optionSelected })
    }

  }

  submitAssessment() {
    console.log('submitAssessment called')

    if (this.state.type === 'skills' && !this.props.fromApply) {

      const cuFirstName = this.state.cuFirstName
      const cuLastName = this.state.cuLastName
      const emailId = this.state.emailId
      const remoteAuth = this.state.remoteAuth

      Axios.put('https://www.guidedcompass.com/api/skills/update/direct', { cuFirstName, cuLastName, emailId, remoteAuth, newSkillAnswers: this.state.resultsData[3] })
      .then((response) => {
          console.log('query for assessment skill results attempted');

          if (response.data.success) {
            console.log('got actual assessment results', response.data)

            let resultsData = this.state.resultsData
            this.setState({ resultsData, skillsData: resultsData });

            let resultsPath = 'AssessmentDetails'
            if (this.props.fromAdvisor) {
              resultsPath = 'AssessmentDetails'
            }

            let assessment = { title: this.state.assessmentTitle }
            if (this.state.assessment) {
              assessment = this.state.assessment
            }

            this.props.navigation.navigate(resultsPath, { assessment, resultsData: this.state.resultsData, assessments: this.state.assessments, index: this.state.index })

          } else {
            console.log('error response', response.data)
            this.setState({ resultsErrorMessage: response.data.message })
          }

      }).catch((error) => {
          console.log('query for assessment results did not work', error);
      })

    } else {
      let responsesCount = this.state.responses.length
      if (this.state.type === 'work preferences') {
        responsesCount = this.state.wpResponses.length
      } else if (this.state.type === 'values') {
        if (this.state.topGravitateValues && this.state.topGravitateValues.length > 0) {
          responsesCount = 0 + 2
        }

        if (this.state.topEmployerValues && this.state.topEmployerValues.length > 0) {
          responsesCount = responsesCount + 2
        }
      }

      console.log('compare: ', responsesCount, this.state.questions.length)
      if (responsesCount !== this.state.questions.length && responsesCount < this.state.questions.length) {
        this.setState({ resultsErrorMessage: 'Please answer all of the questions' })
      } else {
        let totalResponses = '';
        let ogSkillAnswers = this.state.ogSkillAnswers

        if (this.state.type === 'interests') {
          //questions follow a pattern of pairs:
          for (let i = 1; i <= 60; i++) {
            if (i % 12 === 1 || i % 12 === 2) {
              totalResponses = totalResponses + this.state.responses.substring(0,1)
            } else if (i % 12 === 3 || i % 12 === 4) {
              totalResponses = totalResponses + this.state.responses.substring(1,2)
            } else if (i % 12 === 5 || i % 12 === 6) {
              totalResponses = totalResponses + this.state.responses.substring(2,3)
            } else if (i % 12 === 7 || i % 12 === 8) {
              totalResponses = totalResponses + this.state.responses.substring(3,4)
            } else if (i % 12 === 9 || i % 12 === 10) {
              totalResponses = totalResponses + this.state.responses.substring(4,5)
            } else {
              totalResponses = totalResponses + this.state.responses.substring(5,6)           //this.setState({ responses: this.state.responses + optionSelected })
            }
          }
        } else if (this.state.type === 'work preferences'){
          totalResponses = this.state.wpResponses
        } else if (this.state.type === 'values'){

          totalResponses = []
          for (let i = 1; i <= this.state.topGravitateValues.length; i++) {
            totalResponses.push({ value: this.state.topGravitateValues[i - 1], valueType: 'gravitate'})
          }
          for (let i = 1; i <= this.state.topEmployerValues.length; i++) {
            totalResponses.push({ value: this.state.topEmployerValues[i - 1], valueType: 'employer'})
          }
        } else {
          totalResponses = this.state.responses
        }

        this.getResults(totalResponses, ogSkillAnswers);
      }
    }
  }

  getResults(totalResponses, ogSkillAnswers) {
      console.log('get results was called', totalResponses.length, totalResponses, this.state.type, ogSkillAnswers)

      this.setState({ resultsErrorMessage: null, animating: true })

      const cuFirstName = this.state.cuFirstName
      const cuLastName = this.state.cuLastName
      const emailId = this.state.emailId
      const remoteAuth = this.state.remoteAuth
      const orgContactEmail = this.state.orgContactEmail

      Axios.put('https://www.guidedcompass.com/api/assessment/results/calculate', { questions: this.state.questions, answers: totalResponses, type: this.state.type, ogSkillAnswers, cuFirstName, cuLastName, emailId, remoteAuth, orgContactEmail })
      .then((response) => {
          console.log('query for assessment results attempted');

          if (response.data.success) {

            console.log('got actual assessment results', response.data)

            if (this.state.type === 'work preferences') {

              let resultsData = this.state.resultsData

              let index = 0
              // if (this.props.fromAdvisor) {
              //   index = 3
              // }
              resultsData[index] = totalResponses
              this.setState({ totalResponses, resultsData })
              if (this.props.fromApply) {
               this.props.passData(this.state.type, totalResponses, index)
              }

            } else if (this.state.type === 'interests') {

              let resultsData = this.state.resultsData
              let index = 1
              // if (this.props.fromAdvisor) {
              //   index = 0
              // }
              resultsData[index] = response.data.scores
              console.log('show interest resultsData: ', response.data.scores)

              this.setState({
                totalResponses: totalResponses,
                resultsData,
                interestsData: response.data.scores,
               });
               if (this.props.fromApply) {
                this.props.passData(this.state.type, response.data.scores, index)
               }
            } else if (this.state.type === 'personality'){
              //personality

              let resultsData = this.state.resultsData

              let index = 2
              // if (this.props.fromAdvisor) {
              //   index = 1
              // }
              resultsData[index] = response.data.scores

              this.setState({
                totalResponses: totalResponses,
                resultsData,
                personalityData: response.data.scores
               });
               if (this.props.fromApply) {
                this.props.passData(this.state.type, response.data.scores, index)
               }
            } else if (this.state.type === 'skills'){

              let resultsData = this.state.resultsData
              let index = 3
              // if (this.props.fromAdvisor) {
              //   index = 2
              // }
              resultsData[index] = response.data.scores

              this.setState({
                totalResponses: totalResponses,
                resultsData,
                skillsData: response.data.scores
               });
               if (this.props.fromApply) {
                this.props.passData(this.state.type, response.data.answers, index)
               }
            } else if (this.state.type === 'values'){
              console.log('show response data: ', response.data)

               let resultsData = this.state.resultsData

               let index = 4
               // if (this.props.fromAdvisor) {
               //   index = 4
               // }

               resultsData[index] = response.data.scores

               this.setState({ resultsData, valuesData: response.data.scores });
               if (this.props.fromApply) {
                this.props.passData(this.state.type, response.data.scores, index)
               }

            } else {

              console.log('type was not classified')

            }

            this.setState({ animating: false, done: true })

          } else {
            console.log('error response', response.data)
            this.setState({ resultsErrorMessage: response.data.message })
          }

      }).catch((error) => {
          console.log('query for assessment results did not work', error);
      })
  }

  renderAnswerChoices(passedIndex) {
    console.log('renderAnswerChoices called', this.state.answerTypes[this.state.questionIndex], this.state.answerChoices, this.state.answerChoices[this.state.questionIndex])

    let rows = []

    if (this.state.type === 'values') {

      if (passedIndex % 2 === 0) {
        let answerChoices = []
        let testAnswers = []
        if (passedIndex === 0) {
          answerChoices = this.state.gravitateValues
          if (this.state.topGravitateValues) {
            testAnswers = this.state.topGravitateValues
          }

        } else {
          answerChoices = this.state.employerValues
          if (this.state.topEmployerValues) {
            testAnswers = this.state.topEmployerValues
          }
        }

        rows.push(
          <View key={this.state.questions[passedIndex] + passedIndex} style={[styles.row10]}>
            {(answerChoices) && (
              <View style={[styles.rowDirection,styles.flexWrap]}>
                {answerChoices.map((value, optionIndex) =>
                  <View key={passedIndex}>
                    <View style={[styles.row5,styles.rightPadding]}>
                      {(testAnswers.includes(value)) ? (
                        <View>
                          <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder,styles.ctaBackgroundColor]} onPress={() => this.formChangeHandler( "multipleAnswer|" + passedIndex, value) }>
                            <View>
                              <Text style={[styles.descriptionText2,styles.whiteColor,styles.row10]}>{value}</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View>
                          <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder]} onPress={() => this.formChangeHandler("multipleAnswer|" + passedIndex, value) }>
                            <Text style={[styles.descriptionText2,styles.row10]}>{value}</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                  </View>
                )}

              </View>
            )}
          </View>
        )

      } else {

        let topValues = this.state.topValues
        console.log('show topValues 1: ', topValues)
        let droppableId = 'gravitate'
        if (passedIndex === 1 && this.state.gravitateValues) {
          if (this.state.topGravitateValues && this.state.topGravitateValues.length > 0) {
            topValues = this.state.topGravitateValues
          } else {
            // topValues = this.state.gravitateValues
          }

          droppableId = 'gravitate'
        } else if (passedIndex === 3 && this.state.employerValues) {
          if (this.state.topEmployerValues && this.state.topEmployerValues.length > 0) {
            topValues = this.state.topEmployerValues
          } else {
            // topValues = this.state.employerValues
          }
          droppableId = 'employer'
        }
        console.log('show topValues 2: ', topValues)

        rows.push(
          <View>
            {/*
            <DragDropContext onDragEnd={this.onDragEnd}>
              <Droppable droppableId={droppableId}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    style={getListStyle(snapshot.isDraggingOver)}
                  >
                    {topValues.map((item, index) => (
                      <Draggable key={item} draggableId={item} index={index}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            style={getItemStyle(
                              snapshot.isDragging,
                              provided.draggableProps.style
                            )}
                          >
                            <View style={[styles.rowDirection]}>
                              <View style={[styles.width60,styles.topPadding]}>
                                <Image source={{ uri: dragIcon}} style={[styles.square20,styles.contain,styles.leftPadding20]}/>
                              </View>
                              <View style={[styles.calcColumn120]}>
                                <Textstyle={[styles.row10]}>#{index + 1}: {item}</Text>
                              </View>

                            </View>
                          </View>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </View>
                )}
              </Droppable>
            </DragDropContext>*/}

            <View style={styles.spacer} />
          </View>
        )
      }

    } else {

      if (this.state.answerTypes[passedIndex] === 'Short Response') {

        let eventName = 'shortResponse|' + passedIndex

        rows.push(
          <View key={"sp" + this.state.questionIndex.toString()}>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler(eventName , text)}
              value={this.state.wpResponses[passedIndex]}
              placeholder="Write your answer..."
              placeholderTextColor="grey"
            />
          </View>
        )
      } else if (this.state.answerTypes[passedIndex] === 'Long Response') {
        console.log('long response type')

        let eventName = 'longResponse|' + passedIndex

        rows.push(
          <View key={"lr" + this.state.questionIndex.toString()}>
            <TextInput
              style={styles.textArea}
              onChangeText={(text) => this.formChangeHandler(eventName, text)}
              value={this.state.wpResponses[passedIndex]}
              placeholder="Write your answer..."
              placeholderTextColor="grey"
              multiline={true}
              numberOfLines={4}
            />
          </View>
        )
      } else if (this.state.answerTypes[passedIndex] === 'Multiple Choice') {
        console.log('multiple choice type')

        let responses = this.state.responses
        if (this.state.type === 'work preferences') {
          responses = this.state.wpResponses
        }
        console.log('show this response: ', responses[passedIndex], this.state.answerChoices[passedIndex])

        rows.push(
          <View key={this.state.questions[passedIndex] + passedIndex} style={[styles.row10]}>
            {(this.state.answerChoices[passedIndex]) && (
              <View style={[styles.rowDirection,styles.calcColumn60,styles.flexWrap]}>
                {this.state.answerChoices[passedIndex].map((value, optionIndex) =>
                  <View key={passedIndex}>
                    <View style={[styles.row5,styles.rightPadding]}>
                      {(Array.isArray(responses[passedIndex])) ? (
                        <View>
                          {(responses[passedIndex].includes(this.state.answerChoices[passedIndex][optionIndex])) ? (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder,styles.ctaBackgroundColor]} onPress={() => this.formChangeHandler( "multipleChoice|" + passedIndex, this.state.answerChoices[passedIndex][optionIndex]) }>
                                <Text style={[styles.descriptionText2,styles.whiteColor,styles.row10]}>{value}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder]} onPress={() => this.formChangeHandler("multipleChoice|" + passedIndex, this.state.answerChoices[passedIndex][optionIndex]) }>
                                <Text style={[styles.descriptionText2,styles.row10]}>{value}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      ) : (
                        <View>
                          {(responses[passedIndex] === this.state.answerChoices[passedIndex][optionIndex]) ? (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder,styles.ctaBackgroundColor]} onPress={() => this.formChangeHandler("multipleChoice|" + passedIndex, this.state.answerChoices[passedIndex][optionIndex]) }>
                                <Text style={[styles.descriptionText2,styles.whiteColor,styles.row10]}>{value}</Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View>
                              <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder]} onPress={() => this.formChangeHandler("multipleChoice|" + passedIndex, this.state.answerChoices[passedIndex][optionIndex]) }>
                                <Text style={[styles.descriptionText2,styles.row10]}>{value}</Text>
                              </TouchableOpacity>
                            </View>
                          )}
                        </View>
                      )}
                    </View>

                  </View>
                )}

              </View>
            )}
          </View>
        )

      } else if (this.state.answerTypes[passedIndex] === 'Multiple Answer') {
        console.log('multiple answer type:', this.state.answerChoices)

        let responses = this.state.responses
        if (this.state.type === 'work preferences') {
          responses = this.state.wpResponses
        }

        let eventName = 'multipleAnswer|' + passedIndex

        console.log('show responses: ', responses[passedIndex])

        rows.push(
          <View key={this.state.questions[passedIndex] + passedIndex} style={[styles.row10]}>
            {(this.state.answerChoices[passedIndex]) && (
              <View style={[styles.rowDirection,styles.calcColumn60,styles.flexWrap]}>
                {this.state.answerChoices[passedIndex].map((value, optionIndex) =>
                  <View key={passedIndex}>
                    <View style={[styles.row5,styles.rightPadding]}>
                      {(Array.isArray(responses[passedIndex]) && responses[passedIndex].includes(this.state.answerChoices[passedIndex][optionIndex])) ? (
                        <View>
                          <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder,styles.ctaBackgroundColor]} onPress={() => this.formChangeHandler(eventName,this.state.answerChoices[passedIndex][optionIndex])}>
                            <Text style={[styles.descriptionText2,styles.whiteColor,styles.row10]}>{value}</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <View>
                          <TouchableOpacity style={[styles.row5,styles.horizontalPadding20,styles.roundedCorners,styles.ctaBorder]} onPress={() => this.formChangeHandler(eventName, this.state.answerChoices[passedIndex][optionIndex])}>
                            <Text style={[styles.descriptionText2,styles.row10]}>{value}</Text>
                          </TouchableOpacity>
                        </View>
                      )}
                    </View>

                  </View>
                )}

              </View>
            )}
          </View>
        )

      } else if (this.state.answerTypes[passedIndex] === 'Ranking') {
        console.log('ranking type')

        let answerChoices = []
        let draggableId = 'techTrends' + passedIndex
        if (this.state.questions[passedIndex].includes('technology trends')) {
          draggableId = 'techTrends|' + passedIndex
          if (this.state.wpResponses[passedIndex]) {
            answerChoices = this.state.wpResponses[passedIndex]
          } else {
            answerChoices = this.state.technologyTrends
          }

        } else if (this.state.questions[passedIndex].includes('societal problems')) {
          draggableId = 'societalProblems|' + passedIndex
          if (this.state.wpResponses[passedIndex]) {
            answerChoices = this.state.wpResponses[passedIndex]
          } else {
            answerChoices = this.state.societalProblems
          }
        }

        rows.push(
          <View key="ranking">
            <View>
              <Text style={[styles.standardText]}>Please drag & drop the below options to the order you prefer.</Text>
              <View style={styles.spacer} />
            </View>

            {/*
            {(answerChoices) && (
              <DragDropContext onDragEnd={this.onDragEnd}>
                <Droppable droppableId={draggableId}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      style={getListStyle(snapshot.isDraggingOver)}
                    >
                      {answerChoices.map((item, index) => (
                        <Draggable key={item} draggableId={item} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              style={getItemStyle(
                                snapshot.isDragging,
                                provided.draggableProps.style
                              )}
                            >
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.width60,styles.topPadding]}>
                                  <Image source={{ uri: dragIcon}} style={[styles.square20,styles.contain,styles.leftPadding20]}/>
                                </View>
                                <View style={[styles.calcColumn120]}>
                                  <Textstyle={[styles.row10]}>#{index + 1}: {item}</Text>
                                </View>

                              </View>
                            </View>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </View>
                  )}
                </Droppable>
              </DragDropContext>
            )}*/}

          </View>
        )

      } else if (this.state.answerTypes[this.state.questionIndex] === 'Boolean') {
        console.log('boolean type here')

        // const answerChoices = ['Yes','No']
        // for (let i = 1; i <= answerChoices.length; i++) {
        //   console.log('counting', i)
        //   const index = i - 1
        //   const event = { target: { name: "boolean", value: answerChoices[index]}}
        //
        //   rows.push(
        //     <View key={this.state.questionIndex + index}>
        //       <TouchableOpacity onPress={() => this.formChangeHandler(event)}>
        //         <View style={ this.state.wpResponses[this.state.questionIndex] === answerChoices[i - 1] ? { backgroundColor: '#87CEFA', border: '1px solid #fff' } : { backgroundColor: 'white', border: '1px solid #87CEFA'}}>
        //           <Text style={this.state.wpResponses[this.state.questionIndex] === answerChoices[i - 1] ? {color: 'white'}: {color: '#87CEFA'}}>{answerChoices[i - 1]}</Text>
        //         </View>
        //       </TouchableOpacity>
        //     </View>
        //   )
        // }
      }
    }

    return rows
  }

  renderQuestions() {
    console.log('renderQuestions called')

    let rows = []

    if (this.state.questions) {
      for (let i = 1; i <= this.state.questions.length; i++) {
        const index = i - 1
        if (index === 0) {
          console.log('show questions 1: ', this.state.questions[index])
        }

        // console.log('show answer: ',this.state.skills[i - 1].answer, i, this.state.skills[i - 1].title)

        let lowEndText = 'Strongly Disagree'
        let highEndText = 'Strongly Agree'
        if (this.state.type === 'skills') {
          console.log('show questions: ', this.state.questions)
          if (this.state.questions[index] && this.state.questions[index].toLowerCase().includes('how many hours')) {
            lowEndText = '0 - 20 Hours'
            highEndText = '5,000 Hours+'
          } else {
            lowEndText = 'Bottom 20th Percentile'
            highEndText = 'Top 20th Percentile'
          }
        }

        rows.push(
          <View key={"question|" + i} style={[styles.row15]}>

            { (this.state.type === 'work preferences' || this.state.type === 'personality') && (
              <View>
                <Text style={[styles.capitalizeText,styles.boldText,styles.headingText4,styles.row10]}>{i}. {this.state.questions[index]}</Text>
              </View>
            )}

            { (this.state.type === 'interests') && (
              <View>
                <Text style={[styles.capitalizeText,styles.boldText,styles.headingText4,styles.row10]}>{i}. {this.state.questions[index]}</Text>
                <Text style={[styles.standardText,styles.row10]}>{this.state.descriptions[index]}</Text>
              </View>
            )}

            { (this.state.type === 'skills') && (
              <View>
                <Text style={[styles.capitalizeText,styles.boldText,styles.headingText4,styles.row10]}>{i}. {this.state.questions[index]}</Text>

                {(this.state.descriptions[index]) ? (
                  <View>
                    <Text style={[styles.descriptionText3,styles.row10]}>{this.state.descriptions[index]}</Text>
                  </View>
                ) : (
                  <View>
                    { (this.state.categories[index] === "Technical Skills") ? (
                      <Text style={[styles.descriptionText2,styles.row10]}>Function: {this.state.functions[index]}</Text>
                    ) : (
                      <Text style={[styles.descriptionText2,styles.row10]}>Category: {this.state.categories[index]}</Text>
                    )}
                  </View>
                )}

              </View>
            )}

            {(this.state.type === 'values') && (
              <View>
                {(index % 2 === 0) ? (
                  <View>
                    {(index === 0) ? (
                      <View>
                        <Text style={[styles.capitalizeText,styles.boldText,styles.headingText4]}>You gravitate toward people who are (Select 10):</Text>

                        <View style={styles.spacer} />

                        {(this.state.topGravitateValues && this.state.topGravitateValues.length > 0) && (
                          <View>
                            <Text style={[styles.descriptionText1,styles.errorColor]}>[{this.state.topGravitateValues.length} Selected]</Text>
                            <View style={styles.spacer} /><View style={styles.spacer} />
                          </View>
                        )}
                      </View>
                    ) : (
                      <View>
                        <Text style={[styles.boldText,styles.row10,styles.headingText4]}>What are the top 10 values that an employer would provide for you (Select 10):</Text>

                        {(this.state.topEmployerValues && this.state.topEmployerValues.length > 0) && (
                          <View>
                            <Text style={[styles.descriptionText1,styles.errorColor]}>[{this.state.topEmployerValues.length} Selected]</Text>

                            <View style={styles.spacer} /><View style={styles.spacer} />
                          </View>
                        )}
                      </View>
                    )}
                  </View>
                ) : (
                  <View>
                    <View>
                      <Text style={[styles.capitalizeText,styles.boldText,styles.headingText4]}>Rank the top 10 values from highest to lowest:</Text>
                    </View>

                    <View style={styles.spacer} />
                    {(index === 1) ? (
                      <View>
                        <Text style={[styles.capitalizeText]}>(according to who you gravitate towards)</Text>

                        <Text style={[styles.descriptionText2,styles.errorColor,styles.row10]}>[Drag and drop may not work effectively on some mobile and modal views. Adjust on web, non-modal view (i.e., from profile) if you face this issue.]</Text>
                      </View>
                    ) : (
                      <View>
                        <Text style={[styles.capitalizeText]}>(according to who you value in employers)</Text>

                        <Text style={[styles.descriptionText2,styles.errorColor,styles.row10]}>[Drag and drop may not work effectively on some mobile and modal views. Adjust on web, non-modal view (i.e., from profile) if you face this issue.]</Text>
                      </View>
                    )}

                    <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                  </View>
                )}
              </View>
            )}

            {(this.state.type === 'work preferences' || this.state.type === 'values') ? (
              <View>
                <View>
                  {this.renderAnswerChoices(index)}
                </View>
              </View>
            ) : (
              <View>

                <View style={[styles.centerText,styles.row10,styles.rowDirection,styles.flex1,styles.calcColumn60]}>
                  <View style={(this.state.questions[i - 1].score === 1 || this.state.responses[i - 1] === '1') ? [styles.flex20,styles.ctaBorder,styles.row15,styles.horizontalPadding10,styles.ctaBackgroundColor] : [styles.flex20,styles.ctaBorder,styles.row15,styles.horizontalPadding10]} >
                    <TouchableOpacity onPress={() => this.itemClicked(index,1)} style={[styles.flex1,styles.flexCenter]}>
                      <Text style={(this.state.questions[i - 1].score === 1 || this.state.responses[i - 1] === '1') ? [styles.whiteColor] : []}>1</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={(this.state.questions[i - 1].score === 2 || this.state.responses[i - 1] === '2') ? [styles.flex20,styles.ctaBorder,styles.row15,styles.horizontalPadding10,styles.ctaBackgroundColor] : [styles.flex20,styles.ctaBorder,styles.row15,styles.horizontalPadding10]} >
                    <TouchableOpacity onPress={() => this.itemClicked(index,2)} style={[styles.flex1,styles.flexCenter]}>
                      <Text style={(this.state.questions[i - 1].score === 2 || this.state.responses[i - 1] === '2') ? [styles.whiteColor] : []}>2</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={(this.state.questions[i - 1].score === 3 || this.state.responses[i - 1] === '3') ? [styles.flex20,styles.ctaBorder,styles.row15,styles.horizontalPadding10,styles.ctaBackgroundColor] : [styles.flex20,styles.ctaBorder,styles.row15,styles.horizontalPadding10]} >
                    <TouchableOpacity onPress={() => this.itemClicked(index,3)} style={[styles.flex1,styles.flexCenter]}>
                      <Text style={(this.state.questions[i - 1].score === 3 || this.state.responses[i - 1] === '3') ? [styles.whiteColor] : []}>3</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={(this.state.questions[i - 1].score === 4 || this.state.responses[i - 1] === '4') ? [styles.flex20,styles.ctaBorder,styles.row15,styles.horizontalPadding10,styles.ctaBackgroundColor] : [styles.flex20,styles.ctaBorder,styles.row15,styles.horizontalPadding10]} >
                    <TouchableOpacity onPress={() => this.itemClicked(index,4)} style={[styles.flex1,styles.flexCenter]}>
                      <Text style={(this.state.questions[i - 1].score === 4 || this.state.responses[i - 1] === '4') ? [styles.whiteColor] : []}>4</Text>
                    </TouchableOpacity>
                  </View>
                  <View style={(this.state.questions[i - 1].score === 5 || this.state.responses[i - 1] === '5') ? [styles.flex20,styles.ctaBorder,styles.row15,styles.horizontalPadding10,styles.ctaBackgroundColor] : [styles.flex20,styles.ctaBorder,styles.row15,styles.horizontalPadding10]} >
                    <TouchableOpacity onPress={() => this.itemClicked(index,5)} style={[styles.flex1,styles.flexCenter]}>
                      <Text style={(this.state.questions[i - 1].score === 5 || this.state.responses[i - 1] === '5') ? [styles.whiteColor] : []}>5</Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.rowDirection,styles.flex1]}>
                  <View style={[styles.flex50,styles.rightPadding]}>
                    <Text style={[styles.descriptionText3,styles.row10]}>{lowEndText}</Text>
                  </View>
                  <View style={[styles.flex50,styles.leftPadding,styles.alignEnd]}>
                    <Text style={[styles.descriptionText3,styles.row10]}>{highEndText}</Text>
                  </View>

                </View>
              </View>
            )}
          </View>
        )
      }
    }

    return rows
  }

  itemClicked(index1, index2) {
    console.log('itemClicked called', index1, index2, typeof index1, typeof index2)

    let responses = this.state.responses
    if (responses.length === index1) {
      responses = responses + index2.toString()
      console.log('option 1', responses)
    } else if (responses.length > index1 + 1) {
      responses = responses.substring(0,index1) + index2.toString() + responses.substring(index1 + 1,responses.length)
      console.log('option 2', responses)
    } else {
      responses = responses.substring(0,responses.length - 1) + index2.toString()
      console.log('option 3', responses, responses.length)
    }

    // responses[index1] = index2
    this.setState({ responses })
    //
    // if (this.state.type === 'skills') {
    //
    //
    //   // let newQuestionIndex = this.state.questionIndex
    //   // let newResponses = this.state.responses
    //   //
    //   // if (newResponses.length === this.state.questionIndex) {
    //   //   newQuestionIndex = this.state.questionIndex + 1
    //   //   newResponses = newResponses + optionSelected
    //   //   console.log('first one')
    //   // } else if (newResponses.length > this.state.questionIndex + 1) {
    //   //   newResponses = newResponses.substring(0,this.state.questionIndex) + optionSelected + newResponses.substring(this.state.questionIndex + 1,newResponses.length)
    //   // } else {
    //   //   newResponses = newResponses.substring(0,newResponses.length - 1) + optionSelected
    //   // }
    //   //
    //   // console.log('compare counts', newQuestionIndex, newResponses.length, newResponses)
    //   // this.setState({
    //   //   responses: newResponses, optionSelected
    //   // })
    //
    // } else {
    //
    //   // let newResponses = this.state.responses
    //   // if (newResponses.length === this.state.questionIndex) {
    //   //   newResponses = newResponses + optionSelected
    //   // } else if (newResponses.length > this.state.questionIndex + 1) {
    //   //   newResponses = newResponses.substring(0,this.state.questionIndex) + optionSelected + newResponses.substring(this.state.questionIndex + 1,newResponses.length)
    //   // } else {
    //   //   newResponses = newResponses.substring(0,newResponses.length - 1) + optionSelected
    //   // }
    //   //
    //   // this.setState({
    //   //   responses: newResponses, optionSelected
    //   // })
    // }
  }

  renderTaggingAssessment() {
    console.log('renderTaggingAssessment called')

    function tagBackgroundConverter(score) {
      // console.log('tagBackgroundConverter called', score)

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
        backgroundColorClass = styles.senaryBackgroundLight
      }

      return backgroundColorClass
    }

    return (
      <View key={0}>
        <View>
          <View style={[styles.calcColumn60]}>
            <Text style={[styles.standardText,styles.row10]}>Name of Skill</Text>
            <TextInput
              style={styles.textInput}
              onChangeText={(text) => this.formChangeHandler("skillName" , text)}
              value={this.state.skillName}
              placeholder="Skill name..."
              placeholderTextColor="grey"
            />
          </View>

          <View>
            <View style={[styles.calcColumn130,styles.topMargin5,styles.rowDirection]}>
              <View style={[styles.rightMargin]}>
                <Text style={[styles.standardText,styles.row10]}>Your Percentile</Text>
              </View>
              <View>
                <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                <View style={[styles.notiBubbleInfo7of9, { borderRadius: 15 }]}>
                  <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showPercentileInfo: true })}>
                    <Image source={{ uri: questionMarkBlue}} style={[styles.square14,styles.contain,styles.centerItem]} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <Picker
              selectedValue={this.state.score}
              onValueChange={(itemValue, itemIndex) =>
                this.formChangeHandler("score",itemValue)
              }>
                <Picker.Item label={""} value={""} />
                <Picker.Item label="Top 20%" value="5" />
                <Picker.Item label="Top 40%" value="4" />
                <Picker.Item label="Top 60%" value="3" />
                <Picker.Item label="Bottom 40%" value="2" />
                <Picker.Item label="Bottom 20%" value="1" />
            </Picker>
          </View>
          <View style={[styles.topMargin40]}>
            <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.addItem()}><Text style={[styles.descriptionText1,styles.whiteColor]}>Add</Text></TouchableOpacity>
          </View>

        </View>

        {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.row5,styles.errorColor]}>{this.state.errorMessage}</Text>}
        {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.row5,styles.ctaColor]}>{this.state.successMessage}</Text>}

        {(this.state.competencyOptions) && (
          <View>
            <View style={styles.spacer} />

            {this.state.competencyOptions.map((value, optionIndex) =>
              <View key={value._id} style={[styles.calcColumn60]}>
                <TouchableOpacity style={[styles.calcColumn60,styles.rowDirection]} onPress={() => this.competencyClicked(optionIndex, null)}>
                  <View style={[styles.calcColumn60]}>
                    <View style={[styles.rightPadding,styles.topMargin]}>
                      <Image source={{ uri: skillsIcon}} style={[styles.square22,styles.contain]} />
                    </View>
                    <View>
                      <Text style={[styles.ctaColor,styles.row10]}>{value.name}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}

        {(this.state.resultsData && this.state.resultsData[3] && this.state.resultsData[3].length > 0) && (
          <View style={[styles.row20, styles.rowDirection,styles.flexWrap]}>
            {this.state.resultsData[3].map((value, optionIndex) =>
              <View key={value} style={[styles.rowDirection]}>
                <View style={[styles.relativePosition,styles.rightMarginNegative12,styles.zIndex1]}>
                  <View style={[styles.miniSpacer]} />
                  <TouchableOpacity onPress={() => this.removeItem(optionIndex)}>
                    <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
                  </TouchableOpacity>
                </View>
                <View style={[styles.row15,styles.horizontalPadding5,styles.slightlyRoundedCorners,styles.rightMargin, styles.topMargin,tagBackgroundConverter(this.state.resultsData[3][optionIndex].score)]}>
                  <Text style={[styles.descriptionText2,styles.boldText]}>{this.state.resultsData[3][optionIndex].name} - {this.state.resultsData[3][optionIndex].score}</Text>
                </View>
              </View>
            )}
          </View>
        )}


      </View>
    )
  }

  addItem() {
    console.log('addItem called')

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    if (!this.state.skillName || this.state.skillName === '') {
      this.setState({ errorMessage: 'Please add a skill', isSaving: false })
    } else if (!this.state.score || this.state.score === '') {
      this.setState({ errorMessage: 'Please add a score for the skill', isSaving: false})
    } else {
      let resultsData = this.state.resultsData
      if (resultsData[3] && resultsData[3].some(s => s.name.toLowerCase().trim() === this.state.skillName.toLowerCase().trim())) {
        this.setState({ errorMessage: 'You have already added this skill', isSaving: false })
      } else {
        if (resultsData[3]) {
          resultsData[3].unshift({ name: this.state.skillName, score: Number(this.state.score) })
        } else {
          resultsData[3] = [{ name: this.state.skillName, score: Number(this.state.score) }]
        }

        let skillName = ''
        let score = ''
        // this.setState({ resultsData, skillName, score, isSaving: false })

        const cuFirstName = this.state.cuFirstName
        const cuLastName = this.state.cuLastName
        const emailId = this.state.emailId
        const remoteAuth = this.state.remoteAuth

        Axios.put('https://www.guidedcompass.com/api/skills/update/direct', { cuFirstName, cuLastName, emailId, remoteAuth, newSkillAnswers: resultsData[3] })
        .then((response) => {
            console.log('query for assessment skill results attempted');

            if (response.data.success) {
              console.log('got actual assessment results', response.data)
              this.setState({ resultsData, skillName, score, isSaving: false, successMessage: 'Saved changes to your skill bank' })

            } else {
              console.log('error response', response.data)
              this.setState({ errorMessage: response.data.message })
            }

        }).catch((error) => {
            console.log('query for assessment results did not work', error);
        })
      }
    }
  }

  removeItem(index) {
    console.log('removeItem called')

    this.setState({ isSaving: true, errorMessage: null, successMessage: null })

    let resultsData = this.state.resultsData
    resultsData[3].splice(index,1)
    // this.setState({ resultsData })

    const cuFirstName = this.state.cuFirstName
    const cuLastName = this.state.cuLastName
    const emailId = this.state.emailId
    const remoteAuth = this.state.remoteAuth

    Axios.put('https://www.guidedcompass.com/api/skills/update/direct', { cuFirstName, cuLastName, emailId, remoteAuth, newSkillAnswers: resultsData[3] })
    .then((response) => {
        console.log('query for assessment skill results attempted');

        if (response.data.success) {
          console.log('got actual assessment results', response.data)
          this.setState({ resultsData, isSaving: false, successMessage: 'Saved changes to your skill bank' })

        } else {
          console.log('error response', response.data)
          this.setState({ errorMessage: response.data.message })
        }

    }).catch((error) => {
        console.log('query for assessment results did not work', error);
    })
  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showRateByPathway: false, showPercentileInfo: false })
  }

  addToSkills() {
    console.log('addToSkills called')

    this.setState({ errorMessage: null, successMessage: null })

    let resultsData = this.state.resultsData
    if (this.state.responses && this.state.responses.length > 0) {
      for (let i = 1; i <= this.state.responses.length; i++) {
        console.log('show each response: ', this.state.responses[i - 1])
        if (this.state.responses[i - 1] && this.state.responses[i - 1] !== '0') {
          console.log('yes', i)
          if (resultsData[3].some(s => s.name.toLowerCase().trim() === this.state.questions[i - 1].toLowerCase().trim())) {
            // dont add duplicate
            const resultsIndex = resultsData[3].findIndex(s => s.name.toLowerCase().trim() === this.state.questions[i - 1].toLowerCase().trim());
            resultsData[3][resultsIndex] = { name: this.state.questions[i - 1], score: Number(this.state.responses[i - 1])}
          } else {
            resultsData[3].unshift({ name: this.state.questions[i - 1], score: Number(this.state.responses[i - 1])})
          }

          // resultsData[3].unshift({ name: this.state.skillName, score: Number(this.state.score) })
        }
      }
      this.setState({ resultsData, modalIsOpen: false })
    } else {

      this.setState({ errorMessage: 'Something went wrong' })
    }
  }

  render() {

    let resultsPath = 'AssessmentDetails'
    if (this.props.fromAdvisor) {
      resultsPath = 'AssessmentDetails'
    }

    let assessment = { title: this.state.assessmentTitle }
    if (this.state.assessment) {
      assessment = this.state.assessment
    }

    return (
        <ScrollView style={(this.props.fromWalkthrough) ? [] : [styles.card]}>
          <View>
            {(this.state.animating) ? (
              <View style={[styles.flexCenter,styles.flex1]}>
                <View>
                  <ActivityIndicator
                     animating = {this.state.animating}
                     color = '#87CEFA'
                     size = "large"
                     style={[styles.square80, styles.centerHorizontally]}/>

                  <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                  {(this.state.orgFocus === 'Placement') ? (
                    <Text style={[styles.centerText,styles.ctaColor,styles.boldText,styles.row10]}>Calculating results...</Text>
                  ) : (
                    <Text style={[styles.centerText,styles.ctaColor,styles.boldText,styles.row10]}>Calculating results and work matches...</Text>
                  )}

                </View>
              </View>
            ) : (
              <View>
                {this.state.assessmentTitle ? (
                  <View>
                    <View style={[styles.calcColumn60,styles.centerText]}>
                      <View>
                        {!this.props.fromWalkthrough && (
                          <View>
                            {(!this.props.fromApply) && (
                              <View style={[styles.superSpacer]}/>
                            )}

                            <View style={[styles.rowDirection,styles.flex1]}>
                              <View style={[styles.flex10]}>
                                <View style={styles.spacer} /><View style={styles.spacer} />
                                {(this.props.fromApply) ? (
                                  <TouchableOpacity onPress={() => this.props.closeModal()}>
                                    <View>
                                      <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain]} />
                                    </View>
                                  </TouchableOpacity>
                                ) : (
                                  <TouchableOpacity onPress={() => this.props.navigation.navigate('AssessmentDetails', { assessments: this.state.assessments, index: this.state.index, assessment, resultsData: this.state.resultsData })}>
                                    <View>
                                      <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square20,styles.contain,styles.rotate180]} />
                                    </View>
                                  </TouchableOpacity>
                                )}
                              </View>
                              <View style={[styles.flex80]}>
                                <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} />
                                <Text style={[styles.headingText2,styles.centerText]}>{this.state.assessmentTitle}</Text>

                                <View style={[styles.halfSpacer]} />
                                {(this.state.questions && this.state.type === 'skills') && (
                                  <View>
                                    {(this.props.fromApply) && (
                                      <Text style={[styles.descriptionTextColor]}>{this.state.questions.length} Questions</Text>
                                    )}


                                    <View style={styles.spacer} />
                                    <View style={styles.spacer} />
                                  </View>
                                )}
                              </View>
                              <View style={[styles.flex10, styles.row5]}>
                              </View>

                            </View>
                          </View>
                        )}

                        { (this.state.done === true) ? (
                          <View>
                              <View>
                                <Text style={[styles.headingText6,styles.row10]}>You're done!</Text>
                              </View>

                              <View style={[styles.padding20]}>
                                <View>
                                  <View style={[styles.rowDirection,styles.flexCenter]} >
                                    <View style={[styles.calcColumn60,styles.centerText]}>

                                      {(this.props.fromApply) ? (
                                        <View>
                                          <Text style={[styles.standardText]}>Your results have been saved and imported into your application.</Text>
                                          <View style={styles.spacer} />
                                          <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor]} onPress={() => this.props.closeModal()}><Text style={[styles.whiteColor]}>Close View</Text></TouchableOpacity>
                                        </View>
                                      ) : (
                                        <View>
                                          <Text style={[styles.standardText]}>View your results on the previous screen.</Text>
                                          <View style={styles.spacer} />
                                          <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor]} onPress={() => this.props.navigation.navigate(resultsPath, { assessment, resultsData: this.state.resultsData, assessments: this.state.assessments, index: this.state.index })}><Text style={[styles.whiteColor]}>View Results</Text></TouchableOpacity>
                                        </View>
                                      )}

                                    </View>
                                  </View>
                                </View>

                                <Text style={[styles.errorColor,styles.row10]}>{this.state.resultsErrorMessage}</Text>
                              </View>
                          </View>
                        ) : (
                            <View>
                              <View>
                                {!this.props.fromWalkthrough && (
                                  <View>
                                    { (this.state.type === 'skills') && (
                                      <View style={[styles.topPadding]}>
                                        {(this.props.fromApply) ? (
                                          <View>
                                            <Text style={[styles.standardText]}>This employer desires to hire candidates who have the following skills. Compared to your peers, in what percentile would you rate yourself?</Text>
                                          </View>
                                        ) : (
                                          <View>
                                            <Text style={[styles.standardText]}>These skills serve as a comprehensive record for your reference and a resource to import into applications. Not sure what skills to add? <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showRateByPathway: true })}><Text style={[styles.boldText,styles.ctaColor]}>Click here</Text></TouchableOpacity> for suggestions by career pathway.</Text>
                                          </View>
                                        )}
                                      </View>
                                    )}

                                    <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                                  </View>
                                )}

                                {(this.state.type === 'skills' && !this.props.fromApply) ? (
                                  <View>
                                    {console.log('in it')}
                                    {this.renderTaggingAssessment()}

                                    <View style={styles.spacer} /><View style={styles.spacer} /><View style={styles.spacer} />
                                  </View>
                                ) : (
                                  <View>
                                    {this.renderQuestions()}
                                  </View>
                                )}

                                {(this.state.resultsErrorMessage) && <Text style={[styles.errorColor,styles.row10]}>{this.state.resultsErrorMessage}</Text>}

                                {(!this.props.fromWalkthrough && (this.props.fromApply || this.state.type !== 'skills')) && (
                                  <View style={[styles.flexCenter, styles.flex1]}>
                                    <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.flexCenter]} onPress={() => this.submitAssessment()}><Text style={[styles.whiteColor,styles.centerText]}>Submit</Text></TouchableOpacity>
                                  </View>
                                )}

                                <View style={[styles.superSpacer]} />

                              </View>
                            </View>
                        )}
                      </View>
                    </View>
                  </View>
                ) : (
                  <View />
                )}
              </View>
            )}
          </View>

          <Modal isVisible={this.state.modalIsOpen} style={(this.state.showPicker) ? [] : [styles.modal]}>
           <View key="info" style={[styles.flex1,styles.padding40]}>

            {(this.state.showPercentileInfo) && (
              <View>
                <View style={[styles.rowDirection,styles.topMargin20]}>
                  <View style={[styles.calcColumn130]}>
                    <Text style={[styles.headingText6,styles.row10]}>Percentile Info</Text>
                  </View>
                  <View style={[styles.width50,styles.topMargin15]}>
                    <TouchableOpacity onPress={() => this.closeModal()}>
                      <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain,styles.pinRight]} />
                    </TouchableOpacity>
                  </View>
                </View>

                <View style={[styles.lightHorizontalLine]} />

                <View style={styles.spacer} /><View style={styles.spacer} />
                <Text style={[styles.standardText]}>Choose what percentile you would rate yourself compared to your peers. For example, if you rate yourself in the top 20% in Microsoft Excel, you are saying that you are more skilled than four of five people, on average, in your age group.</Text>
              </View>
            )}

            {(this.state.showRateByPathway) && (
              <View>
                <View style={[styles.rowDirection]}>
                  <View style={[styles.calcColumn110]}>
                    <Text style={[styles.headingText2,styles.row10]}>Rate Yourself By Pathway</Text>
                  </View>
                  <View style={[styles.width50]}>
                    <TouchableOpacity onPress={() => this.closeModal()}>
                      <Image source={{ uri: closeIcon}} style={[styles.square15,styles.contain,styles.pinRight]} />
                    </TouchableOpacity>
                  </View>

                </View>
                <View style={styles.spacer} /><View style={styles.spacer} />

                <View style={[styles.row10]}>
                  <Text style={[styles.standardText,styles.row10]}>Select a Pathway</Text>
                  <Picker
                    selectedValue={this.state.selectedPathway}
                    onValueChange={(itemValue, itemIndex) =>
                      this.formChangeHandler("pathway",itemValue)
                    }>
                    {this.state.pathwayOptions.map(value => <Picker.Item key={value.value} label={value.value} value={value.value} />)}
                  </Picker>
                </View>

                <View style={[styles.row10]}>
                  {(this.state.selectedPathway && this.state.selectedPathway !== '') && (
                    <View>
                      {this.renderQuestions()}

                      <View style={styles.spacer} /><View style={styles.spacer} />

                      {(this.state.errorMessage && this.state.errorMessage !== '') && <Text style={[styles.row5,styles.errorColor]}>{this.state.errorMessage}</Text>}
                      {(this.state.successMessage && this.state.successMessage !== '') && <Text style={[styles.row5,styles.ctaColor]}>{this.state.successMessage}</Text>}

                      <TouchableOpacity style={[styles.btnPrimary,styles.ctaBackgroundColor,styles.rightMargin]} onPress={() => this.addToSkills()}><Text style={[styles.whiteColor]}>Bulk Add to Skills Bank</Text></TouchableOpacity>
                      <TouchableOpacity style={[styles.btnPrimary]} onPress={() => this.closeModal()}><Text style={[styles.ctaColor]}>Cancel</Text></TouchableOpacity>
                    </View>
                  )}
                </View>
              </View>
            )}
           </View>
         </Modal>
        </ScrollView>

    )
  }

}

export default TakeAssessment;
