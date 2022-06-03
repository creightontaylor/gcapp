import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator, Linking } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

const benchmarksIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/benchmarks-icon-dark.png';
const approvedIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/approved-icon-blue.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';
const favoritesIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-grey.png';
const favoritesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-blue.png';
const favoritesIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/favorites-icon-white.png';
const shareIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/share-icon-dark.png';
const questionMarkBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/question-mark-blue.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';
const checkmarkIconWhite = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/checkmark-icon-white.png';
const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';
const moneyIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/money-icon-blue.png';
const linkIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/link-icon.png';
const internIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/intern-icon-blue.png';
const assignmentsIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/assignments-icon-blue.png';
const problemIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/problem-icon-blue.png';
const challengeIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/challenge-icon-blue.png';
const opportunitiesIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/opportunities-icon-blue.png';

import SubEndorsementDetails from '../common/EndorsementDetails';
import SubRenderProfiles from '../common/RenderProfiles';

import {convertDateToString} from '../functions/convertDateToString';

class BenchmarkDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      friends: [],
      favorites: [],
      subNavSelected: 'Ideal Profile',
      totalPercent: 100,
      // benchmarkCategories: ['Overall Weights','Work Preferences','Interests','Personality','Values','Skills','Endorsements','Education','Projects','Experience','Interview'],
      benchmarkCategories: ['All','Weights','Work Preferences SA','Interests SA','Personality SA','Values SA','Skills SA','Endorsements','Education','Projects','Experience','Interview','Diversity'],

      subNavCategories: ['Ideal Profile','About','People','Courses','Work','Similar']
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this)
    this.renderTags = this.renderTags.bind(this)
    this.translateValue = this.translateValue.bind(this)
    this.translateWeight = this.translateWeight.bind(this)
    this.translateTraits = this.translateTraits.bind(this)
    this.renderAllocation = this.renderAllocation.bind(this)
    this.returnColorClass = this.returnColorClass.bind(this)
    this.prepareEndorsement = this.prepareEndorsement.bind(this)
    this.closeModal = this.closeModal.bind(this)

    this.pullCourses = this.pullCourses.bind(this)
    this.renderCourses = this.renderCourses.bind(this)
    this.renderOpportunities = this.renderOpportunities.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called SubBenchmarkDetails')

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData()
    } else if (this.props.selectedTemplate !== prevProps.selectedTemplate) {
      // if (!prevProps.selectedTemplate) {
      //   this.retrieveData()
      // } else if (this.props.selectedTemplate.title !== prevProps.selectedTemplate) {
      //   this.retrieveData()
      // }
    } else if (this.props.benchmarkId !== prevProps.benchmarkId) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      console.log('this is causing the error')
      const emailId = await AsyncStorage.getItem('email')
      let email = emailId
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
      // this.setState({ emailId, postsAreLoading: true })
      const isLoading = true
      this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
        roleName, activeOrg, orgFocus, orgName, remoteAuth, isLoading
      })

      Axios.get('https://www.guidedcompass.com/api/favorites', { params: { emailId: email } })
      .then((response) => {
        console.log('Favorites query attempted');

         if (response.data.success) {
           console.log('successfully retrieved favorites')

           let favorites = []
           if (response.data.favorites) {
             favorites = response.data.favorites
           }

           this.setState({ favorites })
         } else {
           console.log('no favorites data found', response.data.message)
         }

      }).catch((error) => {
         console.log('Favorites query did not work', error);
      });

      Axios.get('https://www.guidedcompass.com/api/users/profile/details', { params: { email } })
      .then((response) => {
        console.log('User details query 1 attempted');

        if (response.data.success) {
           console.log('successfully retrieved user details')

           let headline = response.data.user.headline
           let pictureURL = response.data.user.pictureURL
           this.setState({ headline, pictureURL });

        } else {
         console.log('no user details data found', response.data.message)
        }

      }).catch((error) => {
         console.log('User details query did not work', error);
      });

      Axios.get('https://www.guidedcompass.com/api/friends', { params: { orgCode: activeOrg, emailId } })
      .then((response) => {
        console.log('Friends query attempted');

          if (response.data.success) {
            console.log('friends query worked')

            const friends = response.data.friends
            this.setState({ friends })

          } else {
            console.log('friends query did not work', response.data.message)
          }

      }).catch((error) => {
          console.log('Friends query did not work for some reason', error);
      })

      if (this.props.benchmarkId) {
        Axios.get('https://www.guidedcompass.com/api/benchmarks/byid', { params: { _id: this.props.benchmarkId } })
        .then((response) => {
          console.log('Benchmarks query attempted');

          if (response.data.success) {
            console.log('benchmark query worked')

            const selectedBenchmark = response.data.benchmark
            const shareURL = 'https://guidedcompass.com/employers/pages/' + selectedBenchmark.accountCode + '/benchmarks/' + selectedBenchmark._id
            this.setState({ selectedBenchmark, isLoading: false, shareURL })
            this.props.navigation.setOptions({ headerTitle: selectedBenchmark.title })

            let selectedApplication = null
            let selectedJob = null
            const _id = selectedBenchmark._id
            const firstName = 'Jon'
            const lastName = 'Doe'
            const email = 'fakeemail@email.com'
            const schoolName = 'Sample School'
            const gradYear = new Date().getFullYear()
            const pictureURL = 'https://drive.google.com/uc?export=view&id=1x5MeSXzjC4dbmwfESGpspe7WnmkbNKLB'
            const major = 'Business - Sample'

            let paidExperienceHours = 0
            if (selectedBenchmark.experienceHours) {
              if (Number(selectedBenchmark.experienceHours)) {
                paidExperienceHours = Number(selectedBenchmark.experienceHours)
              } else if (selectedBenchmark.experienceHours.includes('-')){
                const nameArray = selectedBenchmark.experienceHours.split('-')
                const num1 = Number(nameArray[0].trim().replace(/,/g,""))
                const num2 = Number(nameArray[1].trim().replace(/,/g,""))
                let avg = (num1 + num2) / 2
                console.log('show avg', avg, nameArray, num1, num2)
                paidExperienceHours = avg
              } else if (selectedBenchmark.experienceHours.includes('+')){
                const nameArray = selectedBenchmark.experienceHours.split('+')
                paidExperienceHours = Number(nameArray[0].trim().replace(/,/g,""))
              }
            }

            let volunteerHours = 0
            if (selectedBenchmark.volunteerHours) {
              if (Number(selectedBenchmark.volunteerHours)) {
                volunteerHours = Number(selectedBenchmark.volunteerHours)
              } else if (selectedBenchmark.volunteerHours.includes('-')){
                const nameArray = selectedBenchmark.volunteerHours.split('-')
                const num1 = Number(nameArray[0].trim().replace(/,/g,""))
                const num2 = Number(nameArray[1].trim().replace(/,/g,""))
                let avg = (num1 + num2) / 2
                volunteerHours = avg
              } else if (selectedBenchmark.volunteerHours.includes('+')){
                const nameArray = selectedBenchmark.volunteerHours.split('+')
                volunteerHours = Number(nameArray[0].trim().replace(/,/g,""))
              }
            }

            const experienceHours = paidExperienceHours
            let projectHours = 0
            if (selectedBenchmark.totalHours) {
              if (Number(selectedBenchmark.projectHours)) {
                projectHours = Number(selectedBenchmark.projectHours)
              } else if (selectedBenchmark.projectHours.includes('-')){
                const nameArray = selectedBenchmark.projectHours.split('-')
                const num1 = Number(nameArray[0].trim().replace(/,/g,""))
                const num2 = Number(nameArray[1].trim().replace(/,/g,""))
                let avg = (num1 + num2) / 2
                projectHours = avg
              } else if (selectedBenchmark.projectHours.includes('+')){
                const nameArray = selectedBenchmark.projectHours.split('+')
                projectHours = Number(nameArray[0].trim().replace(/,/g,""))
              }
            }

            const totalHours = experienceHours + projectHours + experienceHours
            console.log('show hors: ', totalHours, experienceHours, projectHours, volunteerHours, selectedBenchmark.experienceHours)

            const paidExperienceCount = 2
            const volunteerExperienceCount = 2
            const projectCount = 2

            const interview = selectedBenchmark.interview
            const interviewDetails = selectedBenchmark.interviewDetails

            let workPreferenceResults = null
            let interestResults = selectedBenchmark.interests
            let personalityResults = selectedBenchmark.traits
            let skillScores = []
            let skillTraits = []

            let intangiblesText = ''
            const passions = selectedBenchmark.passions

            //workPreferenceResults
            workPreferenceResults = ["['Design']","['Retail','Music', 'Information','Food Services','Fashion']","['Work for a startup or small-sized company']","Graphic Design Intern, Design Intern","n/a","Yes","15 miles","['~ 20 Miles']"]
            workPreferenceResults[6] = selectedBenchmark.proximityRequirements
            workPreferenceResults[7] = selectedBenchmark.maxPay

            interestResults = []
            for (let i = 1; i <= selectedBenchmark.interests.length; i++) {
              const name = selectedBenchmark.interests[i - 1].title
              const description = selectedBenchmark.interests[i - 1].description
              const tempScore = Number(selectedBenchmark.interests[i - 1].score)
              // const score = Math.ceil(tempScore/5)*5
              const score = tempScore * 20 * 0.4

              interestResults.push({ name, description, score })
            }

            let tempOpennessScore = selectedBenchmark.traits[0].score
            let opennessScore = tempOpennessScore * 20 * (16/100)

            const conscientiousnessScore = selectedBenchmark.traits[1].score * 20 * (16/100)
            const extraversionScore = selectedBenchmark.traits[2].score * 20 * (16/100)
            const agreeablenessScore = selectedBenchmark.traits[3].score * 20 * (16/100)
            const neuroticismScore = selectedBenchmark.traits[4].score * 20 * (16/100)

            let myersBriggs = 'ENTJ'
            if (selectedBenchmark.myersBriggs) {
              myersBriggs = selectedBenchmark.myersBriggs
            }

            personalityResults = {
              myersBriggs, fiveFactors: {
                opennessScore, conscientiousnessScore, extraversionScore, agreeablenessScore, neuroticismScore
              }
            }

            intangiblesText = 'This person is most interested in engineering careers and least interested in design careers. Their personality is high in openness and low in emotional stability.'

            if (selectedBenchmark.skills && selectedBenchmark.skills.length > 0) {
              skillScores = []
              let hardSkillCounter = 0
              let softSkillCounter = 0
              for (let i = 1; i <= selectedBenchmark.skills.length; i++) {
                let selectedSkill = selectedBenchmark.skills[i - 1]
                console.log('show selectedSkill: ', selectedSkill)
                skillScores.push({ title: selectedSkill.title, skillType: selectedSkill.skillType, score: 5 })
                if (selectedSkill.skillType === 'Hard Skill') {
                  hardSkillCounter = hardSkillCounter + 1
                  if (hardSkillCounter < 7) {
                    skillTraits.push({ name: selectedSkill.title, skillType: selectedSkill.skillType, rating: 5 })
                  }
                } else {
                  softSkillCounter = softSkillCounter + 1
                  if (hardSkillCounter < 7) {
                    skillTraits.push({ name: selectedSkill.title, skillType: selectedSkill.skillType, rating: 5 })
                  }
                }
              }
            }
            // console.log('show skillTraits: ', skillScores)

            if (selectedBenchmark.traits && selectedBenchmark.traits.length > 0) {
              for (let i = 1; i <= selectedBenchmark.traits.length; i++) {
                let selectedTrait = selectedBenchmark.traits[i - 1]
                // console.log('show selectedSkill: ', selectedSkill)
                skillTraits.push({ name: selectedTrait.title, skillType: 'Trait', rating: 5 })
              }
            }

            let endorsements = []

            //education
            const degreeRequirements = selectedBenchmark.degreeRequirements
            // const idealMajors = selectedBenchmark.idealMajors  pullfromabove
            const gpaRange = selectedBenchmark.gpaRange
            const gradYearRange = selectedBenchmark.gradYearRange
            const testScores = selectedBenchmark.testScores
            const courseHours = selectedBenchmark.courseHours
            // const courses = selectedBenchmark.courses  pullfromabove
            // const certifications = selectedBenchmark.certifications  pullfromabove

            //politics
            const politicalParties = selectedBenchmark.politicalParties //
            const politicalAlignment = selectedBenchmark.politicalAlignment
            const hometown = selectedBenchmark.hometown
            const homeCongressionalDistrict = selectedBenchmark.homeCongressionalDistrict

            //diversity
            const gender = selectedBenchmark.gender
            const race = selectedBenchmark.race
            const veteran = selectedBenchmark.veteran
            const lowIncome = selectedBenchmark.lowIncome
            const fosterYouth = selectedBenchmark.fosterYouth
            const homeless = selectedBenchmark.homeless
            const incarcerated = selectedBenchmark.incarcerated
            const lgbtqia = selectedBenchmark.lgbtqia
            const disability = selectedBenchmark.disability
            const firstGenImmigrant = selectedBenchmark.firstGenImmigrant
            const firstGenCollegeStudent = selectedBenchmark.firstGenCollegeStudent

            const match = 100

            const createdAt = new Date()
            const updatedAt = new Date()

            selectedApplication = {
              _id, firstName, lastName, email, schoolName, pictureURL, endorsements, interview, interviewDetails,
              politicalAlignment, hometown, homeCongressionalDistrict, match, createdAt, updatedAt,
              gradYear, major, skillScores,
              paidExperienceCount, volunteerExperienceCount, projectCount,
              experienceHours, paidExperienceHours, volunteerHours, projectHours, totalHours, intangiblesText,
              personalityResults, passions, degreeRequirements, gpaRange, gradYearRange, testScores, courseHours,
              politicalParties, gender, race, veteran, lowIncome, fosterYouth, homeless, incarcerated, lgbtqia,
              disability, firstGenImmigrant, firstGenCollegeStudent
            }

            selectedJob = { title: selectedBenchmark.jobTitle, workFunction: selectedBenchmark.jobFunction }
            // console.log('show the title: ', selectedJob.title)

            // let cat2 = 'Work Preferences (0%)'
            // if (selectedBenchmark.workPreferenceWeight) {
            //   cat2 = 'Work Preferences (' + selectedBenchmark.workPreferenceWeight + '%)'
            // }
            //
            // let cat3 = 'Work Preferences (0%)'
            // if (selectedBenchmark.workPreferenceWeight) {
            //   cat3 = 'Work Preferences (' + selectedBenchmark.workPreferenceWeight + '%)'
            // }
            //
            // const benchmarkCategories = [
            //   'All', cat2,
            //   'Interests',
            //   'Personality',
            //   'Values',
            //   'Skills','Endorsements','Education','Projects','Experience','Interview'
            // ]
            // let weights = [
            //   { name: 'Work Preferences', description: 'Candidates interested in relevant industries and employer attributes are awarded maximum points.', ref: 'preferencesPercent', value: this.state.selectedBenchmark.workPreferenceWeight },
            //   { name: 'Work Interests', description: 'Candidates interested in careers that require relevant skills are awarded maximum points.', ref: 'interestsPercent', value: this.state.selectedBenchmark.interestsWeight },
            //   { name: 'Personality', description: 'Candidates whose personality most matches the sought after type are awarded maximum points.', ref: 'traitsPercent', value: this.state.selectedBenchmark.personalityWeight },
            //   { name: 'Values', description: 'Candidates whose values match your preferences are awarded maximum points.', ref: 'valuesPercent', value: this.state.selectedBenchmark.valuesWeight },
            //   { name: 'Skills', description: 'Candidates who self-assess for the relevant skills are awarded maximum points.', ref: 'skillsPercent', value: this.state.selectedBenchmark.skillsWeight },
            //   { name: 'Education', description: 'Candidates with the target level and focus of education are awarded maximum points.', ref: 'educationPercent', value: this.state.selectedBenchmark.educationWeight },
            //   { name: 'Endorsements', description: 'Candidates with high skill/trait endorsement ratings from close, experts are awarded maximum points.', ref: 'endorsementsPercent', value: this.state.selectedBenchmark.endorsementWeight },
            //   { name: 'Projects', description: 'Candidates with 1+ years working on projects building relevant skills are awarded maximum points.', ref: 'projectsPercent', value: this.state.selectedBenchmark.projectWeight },
            //   { name: 'Experience', description: 'Candidates who have 1+ years of paid expereience building relevant skills are awarded maximum points.', ref: 'experiencePercent', value: this.state.selectedBenchmark.experienceWeight },
            //   { name: 'Resume', description: 'Ideal resume...', ref: 'experiencePercent', value: this.state.selectedBenchmark.resumeWeight },
            //   { name: 'Cover Letter', description: 'Ideal cover letter...', ref: 'experiencePercent', value: this.state.selectedBenchmark.coverLetterWeight },
            //   { name: 'Interview', description: 'Candidates who perform well on the internal interview are awarded maximum points.', ref: 'interviewPercent', value: this.state.selectedBenchmark.interviewWeight },
            //   // { name: 'Adversity Score', description: 'Candidates who are in higher need of financial aid or who have overcome adversity are awarded extra points.', ref: 'adversityScorePercent', value: this.state.selectedBenchmark.adversityScoreWeight },
            //   // { name: 'Political Preference', description: 'Candidates who align with high demand, low supply political preferences are awarded extra points.', ref: 'politicalPreferencePercent', value: this.state.selectedBenchmark.politicalScoreWeight },
            // ]
            let workPreferenceTags = []
            if (selectedBenchmark.functionsOfInterest && selectedBenchmark.functionsOfInterest.length > 0) {
              workPreferenceTags = workPreferenceTags.concat(selectedBenchmark.functionsOfInterest)
            }
            if (selectedBenchmark.industriesOfInterest && selectedBenchmark.industriesOfInterest.length > 0) {
              workPreferenceTags = workPreferenceTags.concat(selectedBenchmark.industriesOfInterest)
            }
            if (selectedBenchmark.technologyTrends && selectedBenchmark.technologyTrends.length > 0) {
              workPreferenceTags = workPreferenceTags.concat(selectedBenchmark.technologyTrends)
            }
            if (selectedBenchmark.additionalTechnologyTrends && selectedBenchmark.additionalTechnologyTrends.length > 0) {
              workPreferenceTags = workPreferenceTags.concat(selectedBenchmark.additionalTechnologyTrends)
            }
            if (selectedBenchmark.societalProblems && selectedBenchmark.societalProblems.length > 0) {
              workPreferenceTags = workPreferenceTags.concat(selectedBenchmark.societalProblems)
            }
            if (selectedBenchmark.additionalSocietalProblems && selectedBenchmark.additionalSocietalProblems.length > 0) {
              workPreferenceTags = workPreferenceTags.concat(selectedBenchmark.additionalSocietalProblems)
            }
            if (selectedBenchmark.maxPay && selectedBenchmark.maxPay !== '') {
              if (selectedBenchmark.maxPay === 'Wide Range') {
                workPreferenceTags = workPreferenceTags.concat(selectedBenchmark.maxPay + ' of Pay')
              } else {
                workPreferenceTags = workPreferenceTags.concat(selectedBenchmark.maxPay)
              }
            }

            // sort interests
            let interests = []
            if (selectedBenchmark.interests && selectedBenchmark.interests.length > 0) {
              interests = selectedBenchmark.interests
              interests.sort(function(a,b) {
                return b.score - a.score;
              })
            }

            // sort traits
            let traits = []
            if (selectedBenchmark.traits && selectedBenchmark.traits.length > 0) {
              traits = selectedBenchmark.traits
              traits.sort(function(a,b) {
                return b.score - a.score;
              })
            }

            let knowledge = []
            if (selectedBenchmark.knowledge && selectedBenchmark.knowledge.length > 0) {
              for (let i = 1; i <= selectedBenchmark.knowledge.length; i++) {
                knowledge.push(selectedBenchmark.knowledge[i - 1].title)
              }
            }
            // console.log('show ir: ', selectedBenchmark)
            this.setState({ selectedApplication, selectedJob, workPreferenceTags, interests, traits, knowledge });

            this.pullCourses(selectedBenchmark.jobFunction, null, null, null)

            Axios.get('https://www.guidedcompass.com/api/benchmarks', { params: { accountCode: selectedBenchmark.accountCode, pathwayLevel: true } })
            .then((response) => {
              console.log('Benchmarks query within employerDetails attempted');

              if (response.data.success) {
                console.log('benchmark query worked')

                if (response.data.benchmarks.length !== 0) {
                  //jobs = response.data.postings
                  console.log('set the benchmark to state')

                  let benchmarks = []
                  if (response.data.benchmarks && response.data.benchmarks.length > 0) {
                    for (let i = 1; i <= response.data.benchmarks.length; i++) {
                      if (response.data.benchmarks[i - 1].title !== selectedBenchmark.title) {
                        benchmarks.push(response.data.benchmarks[i - 1])
                      }
                    }
                  }
                  this.setState({ benchmarks });
                }

              }

            }).catch((error) => {
                console.log('Benchmark query did not work for some reason', error);
            });

            if (selectedBenchmark.accountCode) {
              Axios.get('https://www.guidedcompass.com/api/account', { params: { accountCode: selectedBenchmark.accountCode } })
              .then((response) => {
                console.log('Account info query attempted within sub settings');

                if (response.data.success) {
                  console.log('account info query worked in sub settings')

                  const selectedEmployer = response.data.accountInfo
                  const employerId = response.data.accountInfo._id
                  const employerName = response.data.accountInfo.employerName
                  const employerLogoURI = response.data.accountInfo.employerLogoURI
                  this.setState({ selectedEmployer, employerId, employerName, employerLogoURI });

                }

              }).catch((error) => {
                console.log('Account info query did not work for some reason', error);
              });
            }

            const resLimit = 50
            Axios.get('https://www.guidedcompass.com/api/get-followers', { params: { _id: selectedBenchmark._id, resLimit } })
            .then((response) => {
              console.log('Followers query attempted');

              if (response.data.success) {
                console.log('followers query worked in sub settings')

                const followers = response.data.followers
                this.setState({ followers })
              }

            }).catch((error) => {
              console.log('Followers query did not work for some reason', error);
            });

            if (selectedBenchmark.jobFunction) {

              const search = true
              const searchString = selectedBenchmark.jobFunction
              const excludeMissingOutlookData = true
              const excludeMissingJobZone = true
              console.log('show search string: ', searchString)
              Axios.put('https://www.guidedcompass.com/api/careers/search', { search, searchString, excludeMissingOutlookData, excludeMissingJobZone  })
              .then((response) => {
                  console.log('Career details query attempted 2');

                  if (response.data.success) {

                    if (response.data.careers && response.data.careers.length > 0) {
                      const selectedCareer = response.data.careers[0]
                      this.setState({ selectedCareer })
                    }

                  } else {
                    console.log('there was an error from back-end, message:');
                  }
              });
            }

            Axios.get('https://www.guidedcompass.com/api/org', { params: { orgCode: activeOrg } })
            .then((response) => {
              console.log('Org info query attempted', response.data);

                if (response.data.success) {
                  console.log('org info query worked')

                  // const orgName = response.data.orgInfo.orgName

                  const orgCode = activeOrg
                  let placementPartners = []
                  if (response.data.orgInfo.placementPartners) {
                    placementPartners = response.data.orgInfo.placementPartners
                  }
                  const postType = null
                  const postTypes = ['Assignment','Problem','Challenge','Internship','Individual','Work']
                  const pathway = null
                  const accountCode = null
                  const recent = true
                  const active = true
                  const pullPartnerPosts = true
                  const csWorkflow = true
                  const benchmarkId = selectedBenchmark._id

                  //only schools see this screen
                  Axios.get('https://www.guidedcompass.com/api/postings/user', { params: { orgCode, placementPartners, postType, postTypes, pathway, accountCode, recent, active, pullPartnerPosts, csWorkflow, benchmarkId }})
                  .then((response) => {
                    console.log('Posted postings query attempted within subcomponent');

                    if (response.data.success) {
                      console.log('posted postings query worked')

                      if (response.data.postings.length !== 0) {

                        let projectOpportunities = []
                        let work = []
                        for (let i = 1; i <= response.data.postings.length; i++) {
                          if (response.data.postings[i - 1].postType === 'Assignment' || response.data.postings[i - 1].postType === 'Problem' || response.data.postings[i - 1].postType === 'Work') {
                            projectOpportunities.push(response.data.postings[i - 1])
                          } else {
                            work.push(response.data.postings[i - 1])
                          }
                        }

                        this.setState({ projectOpportunities, work })

                      }

                    } else {
                      console.log('posted postings query did not work', response.data.message)
                    }

                  }).catch((error) => {
                      console.log('Posted postings query did not work for some reason', error);
                  });

                } else {
                  console.log('org info query did not work', response.data.message)
                }

            }).catch((error) => {
                console.log('Org info query did not work for some reason', error);
            });

          } else {
            console.log('benchmark query did not work', response.data.message)
          }

        }).catch((error) => {
            console.log('Benchmark query did not work for some reason', error);
        });

      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  pullCourses(searchValue, priceValue, durationValue, difficultyLevelValue) {
    console.log('pullCourses called', searchValue, priceValue, durationValue, difficultyLevelValue)

    this.setState({ animating: true, errorMessage: null, successMessage: null })

    // const searchValue = 'Excel'
    if (!searchValue) {
      searchValue = this.state.selectedSkill
    }
    const categoryValue = null
    const subcategoryValue = null
    // let priceValue = this.state.priceValue
    if (!priceValue) {
      priceValue = this.state.priceValue
    }
    let ratingValue = null
    if (!ratingValue) {
      ratingValue = 3.0
    }
    // let durationValue = this.state.durationValue
    if (!durationValue) {
      durationValue = this.state.durationValue
    }

    if (difficultyLevelValue) {
      difficultyLevelValue = difficultyLevelValue.toLowerCase()
    }

    Axios.get('https://www.guidedcompass.com/api/courses/search', { params: { searchValue, categoryValue, subcategoryValue, priceValue, ratingValue, durationValue, difficultyLevelValue } })
    .then((response) => {
      console.log('Courses query attempted');

        if (response.data.success) {
          console.log('successfully retrieved courses')

          if (response.data.responseData) {

            const courses = response.data.responseData.results
            this.setState({ courses, animating: false })
          }

        } else {
          console.log('no course data found', response.data.message)
          this.setState({ animating: false, errorMessage: 'Found no courses that match the criteria'})
        }

    }).catch((error) => {
        console.log('Course query did not work', error);
        this.setState({ animating: false, errorMessage: 'There was an unknown error retrieving the courses'})
    });
  }

  renderCourses() {
    console.log('renderBrowseCourses called')

    return (
      <View key="browseCourses">
        <View style={[styles.row20]}>

          {(this.state.animating) ? (
            <View style={[styles.flex1,styles.flexCenter]}>
              <View>
                <ActivityIndicator
                   animating = {this.state.animating}
                   color = '#87CEFA'
                   size = "large"
                   style={[styles.square80, styles.centerHorizontally]}/>

                <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Pulling results...</Text>

              </View>
            </View>
          ) : (
            <View>
                {this.state.courses && this.state.courses.map((value, index) =>
                  <View>
                    <View key={index}>
                      <View style={[styles.spacer]} />

                      <View style={[styles.rowDirection]}>
                        <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + value.url)} style={[styles.calcColumn92,styles.rowDirection]}>
                          <View style={[styles.width70]}>
                            <Image source={{ uri: value.image_125_H}} style={[styles.square60,styles.contain]}/>
                          </View>
                          <View style={[styles.calcColumn162]}>
                            <Text style={[styles.headingText5]}>{value.title}</Text>
                            <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>{value.headline}</Text>

                            <View style={[styles.halfSpacer]} />

                            <View style={[styles.rowDirection]}>
                              {(value.duration) && (
                                <View style={[styles.descriptionText3,styles.rowDirection]}>
                                  <View style={[styles.rightMargin]}>
                                    <Image source={{ uri: timeIconBlue}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.rightMargin]}>
                                    <Text style={[styles.standardText]}>{value.duration}</Text>
                                  </View>
                                </View>
                              )}

                              {(value.price) && (
                                <View style={[styles.descriptionText3,styles.rowDirection]}>
                                  <View style={[styles.rightMargin]}>
                                    <Image source={{ uri: moneyIconBlue}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.rightMargin]}>
                                    <Text style={[styles.standardText]}>{value.price}</Text>
                                  </View>
                                </View>
                              )}

                              {(value.difficultyLevel) && (
                                <View style={[styles.descriptionText3,styles.rowDirection]}>
                                  <View style={[styles.rightMargin]}>
                                    <Image source={{ uri: difficultyIconBlue}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.rightMargin]}>
                                    <Text style={[styles.standardText]}>{value.difficultyLevel ? value.difficultyLevel : "Beginner"}</Text>
                                  </View>
                                </View>
                              )}

                              {(value.rating && value.ratingCount) && (
                                <View style={[styles.descriptionText3,styles.rowDirection]}>
                                  <View style={[styles.rightMargin]}>
                                    <Image source={{ uri: ratingsIconBlue}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.rightMargin]}>
                                    <Text style={[styles.standardText]}>{value.rating} / 5.0 - {value.ratingCount} Ratings</Text>
                                  </View>
                                </View>
                              )}

                              {(value.studentCount) && (
                                <View style={[styles.descriptionText3,styles.rowDirection]}>
                                  <View style={[styles.rightMargin]}>
                                    <Image source={{ uri: profileIconBlue}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.rightMargin]}>
                                    <Text style={[styles.standardText]}>{value.studentCount} Students</Text>
                                  </View>
                                </View>
                              )}
                            </View>

                            <View style={[styles.halfSpacer]} />
                          </View>
                        </TouchableOpacity>

                        <View style={[styles.leftPadding]} >
                          <View>
                            <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                            <TouchableOpacity onPress={() => Linking.openURL('https://www.udemy.com' + value.url)}>
                              <Image source={{ uri: linkIcon}} style={[styles.square22,styles.contain]}/>
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>

                      <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                      <View style={[styles.horizontalLine]} />

                      <View style={[styles.spacer]} />
                    </View>

                  </View>
                )}

            </View>
          )}

        </View>
      </View>
    )
  }

  renderOpportunities(type) {
    console.log('renderOpportunities called', type);

    let rows = [];

    let filteredPostings = []
    if (type === 'project' && this.state.projectOpportunities) {
      filteredPostings = this.state.projectOpportunities
    } else if (type === 'work' && this.state.work) {
      filteredPostings = this.state.work
    }

    if (!filteredPostings || filteredPostings.length === 0) {
      rows.push(
        <View key={type} style={[styles.row30]}>
          <Text style={[styles.standardText,styles.centerText]}>No {type} opportunities found with this benchmark attached.</Text>
        </View>
      )
    } else {
      for (let i = 1; i <= filteredPostings.length; i++) {
        console.log(i);

        // const index = i - 1
        const posting = filteredPostings[i - 1]
        let isActive = true

        let postingIcon = internIconBlue

        if (posting.postType === 'Assignment') {
          postingIcon = assignmentsIconBlue
        } else if (posting.postType === 'Problem') {
          postingIcon = problemIconBlue
        } else if (posting.postType === 'Challenge') {
          postingIcon = challengeIconBlue
        } else if (posting.postType === 'Internship') {
          if (!posting.isActive) {
            isActive = false
          }
        } else if (posting.postType === 'Work') {
          postingIcon = opportunitiesIconBlue
          if (!posting.isActive) {
            isActive = false
          }
        }

        if (posting.imageURL) {
          postingIcon = posting.imageURL
        }

        if (isActive) {
          let title = posting.title
          if (!posting.title) {
            title = posting.name
          }

          let subtitle1 = posting.employerName

          let subtitle2 = posting.postType
          if (posting.politicalParty && posting.politicalParty !== '') {
            if (subtitle2 === '') {
              subtitle2 = posting.politicalParty
            } else {
              subtitle2 = subtitle2 + ' | ' + posting.politicalParty
            }
          }

          if (posting.field && posting.field !== '') {
            if (subtitle2 === '') {
              subtitle2 = posting.field.split("|")[0].trim()
            } else {
              subtitle2 = subtitle2 + ' | ' + posting.field.split("|")[0].trim()
            }
          }

          if (posting.industry && posting.industry !== '') {
            if (subtitle2 === '') {
              subtitle2 = posting.industry
            } else {
              subtitle2 = subtitle2 + ' | Industry: ' + posting.industry
            }
          }

          if (posting.difficultyLevel && posting.difficultyLevel !== '') {
            if (subtitle2 === '') {
              subtitle2 = posting.difficultyLevel
            } else {
              subtitle2 = subtitle2 + ' | Difficulty Level: ' + posting.difficultyLevel
            }
          }

          if (posting.submissionDeadline) {
            if (subtitle2 === '') {
              subtitle2 = 'Deadline :' + convertDateToString(new Date(posting.submissionDeadline),"datetime-2")
            } else {
              subtitle2 = subtitle2 + ' | Deadline: ' + convertDateToString(new Date(posting.submissionDeadline),"datetime-2")
            }
          }

          if (posting.startDate) {
            if (subtitle2 === '') {
              subtitle2 = convertDateToString(new Date(posting.startDate),"datetime-2")
            } else {
              subtitle2 = subtitle2 + ' | Start Date: ' + convertDateToString(new Date(posting.startDate),"datetime-2")
            }
          }

          rows.push(
            <View key={i}>
              <View style={styles.spacer} />

              <View style={[styles.rowDirection]}>
                <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: posting})} style={[styles.calcColumn110,styles.rowDirection]}>
                  <View style={[styles.width50]}>
                    {(posting.matchScore) ? (
                      <View style={styles.padding5}>
                        <Progress.Circle progress={posting.matchScore / 100} size={styles.width40.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                      </View>
                    ) : (
                      <Image source={{ uri: postingIcon}} style={[styles.square40,styles.topMargin5,styles.centerItem,styles.contain]} />
                    )}
                  </View>
                  <View style={[styles.calcColumn160]}>
                    <Text style={[styles.headingText5]}>{title}</Text>
                    <Text style={[styles.descriptionText1]}>{subtitle1}</Text>
                    <Text style={[styles.descriptionText2]}>{subtitle2}</Text>
                    {((posting.subPostType === 'Full-Time' || posting.subPostType === 'Part-Time') && (posting.payRange)) && (
                      <View>
                        <Text style={[styles.descriptionText3,styles.ctaColor,styles.boldText,styles.topPadding5]}>{posting.payRange}</Text>
                      </View>
                    )}
                    {(posting.createdAt) && (
                      <View style={[styles.topPadding,styles.horizontalPadding5]}>
                        <Text style={[styles.descriptionText4,styles.descriptionTextColor,styles.boldText,styles.fullScreenWidth]}>Posted {convertDateToString(posting.createdAt,"daysAgo")}</Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
                <View>
                  <View style={[styles.leftPadding,styles.rowDirection]}>
                    <View style={[styles.rightPadding]}>
                      {((this.state.applications && this.state.applications.some(app => app.postingId === posting._id)) || (posting.submissions && posting.submissions.some(sub => sub.userEmail === this.state.emailId))) ? (
                        <View style={[styles.topMargin]}>
                          <Image source={{ uri: appliedIconBlue}} style={[styles.square22,styles.contain]}/>
                        </View>
                      ) : (
                        <View>
                          {(this.state.rsvps && this.state.rsvps.some(rsvp => rsvp.postingId === posting._id)) && (
                            <View style={[styles.topMargin]}>
                              <Image source={{ uri: rsvpIconBlue}} style={[styles.square22,styles.contain,styles.pinRight]}/>
                            </View>
                          )}
                        </View>
                      )}

                      <TouchableOpacity style={[styles.topMargin]} onPress={() => this.favoriteItem(posting) }>
                        <Image source={(this.state.favorites.includes(posting._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]}/>
                      </TouchableOpacity>
                    </View>
                    <View>
                      <TouchableOpacity style={[styles.topMargin]} onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: posting})}>
                        <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square18,styles.contain,styles.pinRight]}/>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </View>

              {(posting.sortCriteria || this.state.sortCriteriaArray) ? (
                <View style={[styles.leftPadding70]}>
                  {(this.state.sortCriteriaArray.length > 0) && (
                    <View>
                      <View style={styles.halfSpacer} />
                      <Text style={[styles.descriptionText2,styles.errorColor,styles.row5]}>{this.state.sortCriteriaArray[i - 1].name}: {this.state.sortCriteriaArray[i - 1].criteria}</Text>
                    </View>
                  )}
                </View>
              ) : (
                <View />
              )}

              <View style={styles.spacer} /><View style={styles.spacer} />
              <View style={[styles.horizontalLine]} />

              <View style={styles.spacer} />
            </View>
          )
        }
      }

      if (type === 'events' && this.state.filteredPastEvents && this.state.filteredPastEvents.length > 0) {
        rows.push(
          <View key="past" style={[styles.row30]}>
            <Text style={[styles.headingText3]}>Past Events</Text>
          </View>
        )

        const filteredPastEvents = this.state.filteredPastEvents
        for (let i = 1; i <= filteredPastEvents.length; i++) {
          console.log(i);

          const index = i - 1

          rows.push(
            <View key={"past|" +i}>
              <View style={styles.spacer} />
              <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: this.state.filteredPastEvents[index]})} style={[styles.calcColumn80,styles.rowDirection]}>
                <View style={[styles.width50]}>
                  {(this.state.filteredPastEvents[index].matchScore) ? (
                    <View style={styles.padding5}>
                      <Progress.Circle progress={this.state.filteredPastEvents[index].matchScore / 100} size={styles.width40.width} showsText={true} animated={false} color={styles.ctaColor.color}/>
                    </View>
                  ) : (
                    <Image source={(this.state.filteredPastEvents[index].imageURL) ? { uri: this.state.filteredPastEvents[index].imageURL} : { uri: eventIconBlue}} style={[styles.square40,styles.contain,styles.centerItem]} />
                  )}
                  {(this.state.filteredPastEvents[index].createdAt) && (
                    <View style={[styles.topPadding,styles.horizontalPadding5]}>
                      <Text style={[styles.descriptionText4,styles.descriptionTextColor,styles.boldText,styles.fullScreenWidth,styles.centerText]}>{convertDateToString(this.state.filteredPastEvents[index].createdAt,"daysAgo")}</Text>
                    </View>
                  )}
                </View>
                <View style={[styles.calcColumn130]}>
                  <Text style={[styles.headingText5]}>{filteredPastEvents[i - 1].title}</Text>
                  <Text style={[styles.descriptionText1]}>{filteredPastEvents[i - 1].orgName}</Text>
                  <Text style={[styles.descriptionText2]}>{convertDateToString(new Date(filteredPastEvents[i - 1].startDate),"datetime-2")} - {convertDateToString(new Date(filteredPastEvents[i - 1].endDate),"datetime-2")}</Text>
                  {(this.props.pageSource === 'landingPage') && (
                    <View style={[styles.row5]}>
                      <Text style={[styles.descriptionText2]}>Hosted by <Text style={[styles.ctaColor,styles.boldText]}>{filteredPastEvents[i - 1].orgName}</Text></Text>
                    </View>
                  )}
                </View>
              </TouchableOpacity>
              <View style={[styles.leftPadding,styles.rowDirection]}>
                <View>
                  <View style={styles.spacer}/>
                  <TouchableOpacity onPress={() => this.props.navigation.navigate('OpportunityDetails', { selectedOpportunity: this.state.filteredPastEvents[index]})} >
                    <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                  </TouchableOpacity>
                </View>
                {(this.state.path && this.state.path.includes('/app')) && (
                  <View style={[styles.rightPadding15]}>
                    {(this.state.rsvps && this.state.rsvps.some(app => app.postingId === this.state.filteredPastEvents[index]._id)) && (
                      <View>
                        <Image source={{ uri: rsvpIconBlue}} style={[styles.square22,styles.contain]} />
                      </View>
                    )}
                    <TouchableOpacity style={[styles.topMargin]} onPress={() => this.favoriteItem(this.state.filteredPastEvents[i - 1]) }>
                      <Image source={(this.state.favorites.includes(this.state.filteredPastEvents[index]._id)) ? { uri: favoritesIconBlue} : { uri: favoritesIconGrey}} style={[styles.square20,styles.contain]} />
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View style={styles.spacer} /><View style={styles.spacer} />
              <View style={[styles.horizontalLine]} />

              <View style={styles.spacer} />
            </View>
          )
        }
      }
    }

    return rows;
  }

  formChangeHandler(eventName,eventValue) {
    console.log('formChangeHandler called')

    this.setState({ [eventName]: eventValue })

  }

  translateValue(score, toWords) {
    console.log('translateValue called', score, toWords)

    //interests
    if (toWords) {
      let value = ''

      if (Number(score) >= 5) {
        value = 'Highly Interested'
      } else if (Number(score) >= 4) {
        value = 'Interested'
      } else if (Number(score) >= 3) {
        value = 'Somewhat Interested'
      } else if (Number(score) >= 2) {
        value = 'Uninterested'
      } else if (Number(score) >= 1) {
        value = 'Highly Uninterested'
      } else if (Number(score) < 1) {
        value = 'Not a Factor'
      }

      return value
    } else {
      console.log('show score: ', score)
      let value = 0
      if (score === 'Highly Interested') {
        value = 5
      } else if (score === 'Interested') {
        value = 4
      } else if (score === 'Somewhat Interested') {
        value = 3
      } else if (score === 'Uninterested') {
        value = 2
      } else if (score === 'Highly Uninterested') {
        value = 1
      } else if (score === 'Not a Factor') {
        value = 0
      }

      return value
    }
  }

  translateWeight(weight, toWords) {
    console.log('translateWeight called ', weight, toWords)

    if (toWords) {
      let value = ''
      if (Number(weight) >= 4) {
        value = 'Super Important'
      } else if (Number(weight) >= 4) {
        value = 'Very Important'
      } else if (Number(weight) >= 3) {
        value = 'Important'
      } else if (Number(weight) >= 2) {
        value = 'Somewhat Important'
      } else if (Number(weight) >= 1) {
        value = 'Slightly Important'
      } else if (Number(weight) < 1) {
        value = 'Not a Factor'
      }

      return value
    } else {
      let value = 0

      if (weight === 'Super Important') {
        value = 5
      } else if (weight === 'Very Important') {
        value = 4
      } else if (weight === 'Important') {
        value = 3
      } else if (weight === 'Somewhat Important') {
        value = 2
      } else if (weight === 'Slightly Important') {
        value = 1
      } else if (weight === 'Not a Factor') {
        value = 0
      }
      console.log('show score in translate: ', weight, value)
      return value
    }
  }

  translateTraits(score, toWords) {
    console.log('translateTraits called', score, toWords)

    if (toWords) {
      let value = ''
      if (Number(score) >= 5) {
        value = 'Very High'
      } else if (Number(score) >= 4) {
        value = 'High'
      } else if (Number(score) >= 3) {
        value = 'Moderate'
      } else if (Number(score) >= 2) {
        value = 'Low'
      } else if (Number(score) >= 1) {
        value = 'Very Low'
      } else if (Number(score) < 1) {
        value = 'Not a Factor'
      }

      return value
    } else {
      let value = 0
      if (score === 'Very High') {
        value = 5
      } else if (score === 'High') {
        value = 4
      } else if (score === 'Moderate') {
        value = 3
      } else if (score === 'Low') {
        value = 2
      } else if (score === 'Very Low') {
        value = 1
      } else if (score === 'Not a Factor') {
        value = 0
      }

      return value

    }
  }

  renderTags(type, passedArray, limit) {
    console.log('renderTags: ')

    let backgroundColorClass = styles.primaryBackground
    if (type === 'gravitateValues') {
      backgroundColorClass = styles.secondaryBackground
    } else if (type === 'employerValues') {
      backgroundColorClass = styles.tertiaryBackground
    } else if (type === 'hardSkills') {
      backgroundColorClass = styles.quaternaryBackground
    } else if (type === 'softSkills') {
      backgroundColorClass = styles.quinaryBackground
    } else if (type === 'workPreferenceTags') {
      backgroundColorClass = styles.nonaryBackground
    } else if (type === 'knowledge') {
      backgroundColorClass = styles.denaryBackground
    }
    if (passedArray) {
      return (
        <View key={type + "|0"}>
          <View style={[styles.spacer]} />

          <View style={[styles.rowDirection,styles.flexWrap]}>
            {passedArray.map((value, optionIndex) =>
              <View key={type + "|" + optionIndex}>
                {(!limit || (limit && optionIndex < limit)) && (
                  <View style={[styles.rightPadding5]}>
                    <View style={[styles.halfSpacer]} />
                    <View style={[styles.tagContainerBasic,backgroundColorClass]}>
                      <Text style={[styles.descriptionText2,styles.whiteColor]}>{value}</Text>
                    </View>
                    <View style={[styles.halfSpacer]} />
                  </View>
                )}
              </View>
            )}
          </View>

        </View>
      )
    }
  }

  renderAllocation() {
    console.log('renderAllocation called')

    let rows = []

    let weights = [
      { name: 'Work Preferences (Self-Assessment)', urlKey: 'Work Preferences SA', description: 'Candidates interested in relevant industries and employer attributes are awarded maximum points.', value: this.state.selectedBenchmark.workPreferenceWeight },
      { name: 'Interests (Self-Assessment)', urlKey: 'Interests SA', description: 'Candidates interested in careers that require relevant skills are awarded maximum points.', value: this.state.selectedBenchmark.interestsWeight },
      { name: 'Personality (Self-Assessment)', urlKey: 'Personality SA', description: 'Candidates whose personality most matches the sought after type are awarded maximum points.', value: this.state.selectedBenchmark.personalityWeight },
      { name: 'Values (Self-Assessment)', urlKey: 'Values SA', description: 'Candidates whose values match your preferences are awarded maximum points.', value: this.state.selectedBenchmark.valuesWeight },
      { name: 'Skills (Self-Assessment)', urlKey: 'Skills SA', description: 'Candidates who self-assess for the relevant skills are awarded maximum points.', value: this.state.selectedBenchmark.skillsWeight },
      { name: 'Education', urlKey: 'Education', description: 'Candidates with the target level and focus of education are awarded maximum points.', value: this.state.selectedBenchmark.educationWeight },
      { name: 'Endorsements', urlKey: 'Endorsements', description: 'Candidates with high skill/trait endorsement ratings from close, experts are awarded maximum points.', value: this.state.selectedBenchmark.endorsementWeight },
      { name: 'Projects', urlKey: 'Projects', description: 'Candidates who can showcase impressive, metrics-driven projects building relevant skills are awarded maximum points.', value: this.state.selectedBenchmark.projectWeight },
      { name: 'Experience', urlKey: 'Experience', description: 'Candidates who have strong, relevant, paid expereience building relevant skills are awarded maximum points.', value: this.state.selectedBenchmark.experienceWeight },
      { name: 'Resume', urlKey: 'Resume', description: 'Candidates who have strong resumes will be awarded maximum points', value: this.state.selectedBenchmark.resumeWeight },
      { name: 'Cover Letter', urlKey: 'Cover Letter', description: 'Candidates who have strong cover letters will be awarded maximum points', value: this.state.selectedBenchmark.coverLetterWeight },
      { name: 'Interview', urlKey: 'Interview', description: 'Candidates who perform well on the internal interview are awarded maximum points.', value: this.state.selectedBenchmark.interviewWeight },
      { name: 'Diversity', urlKey: 'Diversity', description: 'Candidates who provide diversity of through to our ogranizion in a positive way are awarded maximum points.', value: this.state.selectedBenchmark.adversityScoreWeight }
    ]

    if (this.state.selectedBenchmark.thirdPartyAssessmentWeight) {
      const thirdPartyAssessmentWeight = { name: 'Third Party Assessments', description: 'Candidates who complete the third party assessments at a satisfactory level are awarded maximum points.', ref: 'thirdPartyAssessmentPercent', value: this.state.selectedBenchmark.thirdPartyAssessmentWeight }
      weights.splice(5,0,thirdPartyAssessmentWeight)
    }

    for (let i = 1; i <= weights.length; i++) {
      console.log('iterate: ', i)

      rows.push(
        <View key={"weights|" + i}>
          <TouchableOpacity onPress={() => this.setState({ subNavSelected: weights[i - 1].urlKey })}>
            <View style={[styles.row10,styles.rowDirection]}>
              <View style={[styles.calcColumn140,styles.rightPadding]}>
                <Text style={[styles.headingText6]}>{i}. {weights[i - 1].name}</Text>
                <View style={[styles.halfSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                <Text style={[styles.descriptionText2]}>{weights[i - 1].description}</Text>
              </View>
              <View style={[styles.width80]}>
                <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                <Text style={[styles.headingText2,styles.ctaColor,styles.boldText,styles.rightText]}>{(weights[i - 1].value) ? weights[i - 1].value : "0"}%</Text>
              </View>

            </View>
          </TouchableOpacity>
        </View>
      )
    }

    return rows

  }

  returnColorClass(index,type) {
    console.log('returnColorClass called', index, type)

    let colorClass = styles.nonaryBackground
    if (type === 'text') {
      if (index === 0) {
        colorClass = styles.nonaryColor
      } else if (index === 1) {
        colorClass = styles.primaryColor
      } else if (index === 2) {
        colorClass = styles.twelveColor
      } else if (index === 3) {
        colorClass = styles.denaryColor
      } else if (index === 4) {
        colorClass = styles.thirteenColor
      } else if (index === 5) {
        colorClass = styles.secondaryColor
      }
    } else if (type === 'background') {
      if (index === 0) {
        colorClass = styles.nonaryBackground
      } else if (index === 1) {
        colorClass = styles.primaryBackground
      } else if (index === 2) {
        colorClass =  styles.twelveBackground
      } else if (index === 3) {
        colorClass = styles.denaryBackground
      } else if (index === 4) {
        colorClass = styles.thirteenBackground
      } else if (index === 5) {
        colorClass = styles.secondaryBackground
      }
    }
    return colorClass
  }

  prepareEndorsement() {
    console.log('prepareEndorsement called')

    let skillTraits = [] // name, skillType, rating
    let competencies = [] // name, category, rating
    let examples = [] // skillTrait, example

    if (this.state.selectedBenchmark.skills && this.state.selectedBenchmark.skills.length > 0) {
      // benchmarkSkills - title
      for (let i = 1; i <= this.state.selectedBenchmark.skills.length; i++) {
        skillTraits.push({
          name: this.state.selectedBenchmark.skills[i - 1].title,
          skillType: this.state.selectedBenchmark.skills[i - 1].skillType,
          rating: 5
        })
        competencies.push({
          name: this.state.selectedBenchmark.skills[i - 1].title,
          category: this.state.selectedBenchmark.skills[i - 1].skillType,
          rating: 5
        })
        if (i === 1) {
          examples.push({
            skillTrait: this.state.selectedBenchmark.skills[i - 1].title,
            example: "I've worked with this student for 3 years on a project. Never in my 20 years of teaching having I seen someone demonstrate a mastery of " + this.state.selectedBenchmark.skills[i - 1].title.toLowerCase() + " with little-to-no experience.",
          })
        }
      }
    }
    if (this.state.selectedBenchmark.knowledge && this.state.selectedBenchmark.knowledge.length > 0) {
      // benchmarkSkills - title
      for (let i = 1; i <= this.state.selectedBenchmark.knowledge.length; i++) {
        skillTraits.push({
          name: this.state.selectedBenchmark.knowledge[i - 1].title,
          skillType: 'Knowledge',
          rating: 5
        })
        competencies.push({
          name: this.state.selectedBenchmark.knowledge[i - 1].title,
          category: 'Knowledge',
          rating: 5
        })
        if (i === 1) {
          examples.push({
            skillTrait: this.state.selectedBenchmark.knowledge[i - 1].title,
            example: "I've worked with this student for 3 years on a project. Never in my 20 years of teaching having I seen someone demonstrate a mastery of " + this.state.selectedBenchmark.knowledge[i - 1].title.toLowerCase() + " with little-to-no experience.",
          })
        }
      }
    }

    const selectedEndorsement = {
      senderFirstName: 'Jon', senderLastName: 'Doe', senderEmail: 'jondoe@gmail.com',
      recipientFirstName: 'Jon', recipientLastName: 'Doe', recipientEmail: 'jondoe@gmail.com',
      relationship: 'Teacher', pathway: this.state.selectedBenchmark.jobFunction, skillTraits, competencies,
      examples, overallRecommendation: 5, isTransparent: true,
      createdAt: new Date(), updatedAt: new Date()
    }

    this.setState({ modalIsOpen: true, showEndorsementDetails: true, selectedEndorsement })
  }

  closeModal() {
    console.log('closeModal called')
    this.setState({ modalIsOpen: false, showEndorsementDetails: false, showShareButtons: false, showApprovedInfo: false, showBenchmarkInfo: false  })
  }

  subNavClicked(subNavSelected) {
    console.log('subNavClicked called', subNavSelected)

    this.setState({ subNavSelected })

  }

  favoriteItem(item) {
    console.log('favoriteItem called', item)

    let itemId = item._id

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

  render() {

    let benchmarkLinkPrefix = ''
    if (this.state.selectedBenchmark) {
      benchmarkLinkPrefix = '/app/employers/' + this.state.selectedBenchmark.accountCode
    }

    return (
        <ScrollView>
          <View>
            {(this.state.selectedBenchmark) && (
              <View>
                {(this.state.isLoading) ? (
                  <View style={[styles.flexCenter,styles.flex1]}>
                    <View>
                      <View style={[styles.superSpacer]} />

                      <ActivityIndicator
                         animating = {this.state.animating}
                         color = '#87CEFA'
                         size = "large"
                         style={[styles.square80, styles.centerHorizontally]}/>

                      <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />
                      <Text style={[styles.centerText,styles.ctaColor,styles.boldText]}>Loading...</Text>

                    </View>
                  </View>
                ) : (
                  <View>
                    <View>
                      <View>
                        <View style={[styles.cardClearPadding,styles.fullScreenWidth,styles.topMargin30]}>
                          <View style={[styles.height5,styles.primaryBackground]} />
                          <View style={[styles.padding30]}>
                            <View style={[styles.row10,styles.rowDirection,styles.flex1]}>
                              <View style={[styles.width50]}>
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showApprovedInfo: true })}>
                                  <Image source={{ uri: approvedIconBlue}} style={[styles.square25,styles.contain]}/>
                                </TouchableOpacity>
                              </View>
                              <View style={[styles.calcColumn160,styles.flexCenter]}>
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('EmployerDetails', { objectId: this.state.employerId })}>
                                  <Image source={(this.state.employerLogoURI) ? { uri: this.state.employerLogoURI} : { uri: benchmarksIconDark}} style={[styles.square80,styles.contain]} />
                                </TouchableOpacity>
                              </View>
                              <View style={[styles.width50,styles.alignEnd]}>
                                <TouchableOpacity onPress={() => this.setState({ modalIsOpen: true, showBenchmarkInfo: true })}>
                                  <Image source={{ uri: questionMarkBlue}} style={[styles.square20,styles.contain]}/>
                                </TouchableOpacity>
                              </View>
                            </View>
                            <View style={[styles.row10,styles.rowDirection]}>
                              <View>
                                <Text style={[styles.headingText2,styles.centerText]}>{this.state.selectedBenchmark.title}</Text>
                                <Text style={[styles.topPadding,styles.centerText]}>The ideal candidate to join {(this.state.selectedBenchmark.jobFunction && this.state.selectedBenchmark.jobFunction !== 'Other') && ' the ' + this.state.selectedBenchmark.jobFunction.toLowerCase() + ' team at '}{this.state.employerName}. </Text>
                                <Text style={[styles.descriptionText2,styles.topPadding15,styles.bottomPadding5,styles.centerText]}>Note: The "perfect candidate" will not be guaranteed a job. This is meant to be a guide for career-seekers, educators, and workforce professionals.</Text>
                              </View>
                            </View>
                            <View style={[styles.topPadding20,styles.centerText,styles.rowDirection,styles.flex1]}>
                              <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor,styles.rightMargin5,styles.rowDirection,styles.flexCenter,styles.flex50]} onPress={() => this.favoriteItem(this.state.selectedBenchmark)}>
                                <View>
                                  <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                  {(this.state.favorites.includes(this.state.selectedBenchmark._id)) ? <Image source={{ uri: checkmarkIconWhite}} style={[styles.square15,styles.contain]} /> : <Image source={{ uri: favoritesIconWhite}} style={[styles.square15,styles.contain]} />}
                                </View>
                                <View style={[styles.leftPadding]}>
                                  <Text style={[styles.standardText,styles.whiteColor]}>{(this.state.favorites.includes(this.state.selectedBenchmark._id)) ? "Favorited" : "Favorite"}</Text>
                                </View>

                              </TouchableOpacity>

                              <TouchableOpacity style={[styles.btnSquarish,styles.whiteBackground,styles.ctaBorder,styles.leftMargin5,styles.rowDirection, styles.flexCenter,styles.flex50]} onPress={() => this.setState({ modalIsOpen: true, showShareButtons: true })}>
                                <View>
                                  <View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} /><View style={[styles.miniSpacer]} />
                                  <Image source={{ uri: shareIconDark}} style={[styles.square15,styles.contain]} />
                                </View>
                                <View style={[styles.leftPadding]}><Text style={[styles.standardText,styles.ctaColor]}>Share</Text></View>

                              </TouchableOpacity>
                            </View>
                          </View>
                        </View>

                        <View>
                          <View style={[styles.cardClearPadding,styles.fullScreenWidth,styles.topMargin30]}>
                            <ScrollView style={[styles.carousel]} horizontal={true} style={[styles.horizontalPadding30]}>
                              {this.state.subNavCategories.map((value, index) =>
                                <View style={[styles.row15,styles.rightPadding30]}>
                                  {(value === this.state.subNavSelected) ? (
                                    <View style={[styles.selectedCarouselItem]}>
                                      <Text key={value} style={[styles.headingText6]}>{value}</Text>
                                    </View>
                                  ) : (
                                    <TouchableOpacity style={[styles.menuButton]} onPress={() => this.setState({ subNavSelected: value })}>
                                      <Text key={value} style={[styles.headingText6]}>{value}</Text>
                                    </TouchableOpacity>
                                  )}
                                </View>
                              )}
                            </ScrollView>
                          </View>
                          {/*
                          <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                            <View style={[styles.row10]}>
                              <Text style={[styles.headingText3]}>Benchmark Details</Text>
                              <View style={[styles.spacer]} />
                            </View>

                            {this.state.benchmarkCategories.map((value, optionIndex) =>
                              <View key={value}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.width30,styles.topPadding5]}>
                                    <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square15,styles.contain]}/>
                                  </View>
                                  <View style={[styles.width40]}>
                                    <Text style={[styles.headingText4,styles.ctaColor]}>{optionIndex + 1}.</Text>
                                  </View>
                                  <View style={[styles.calcColumn130]}>
                                    <Text style={[styles.headingText4,styles.ctaColor]}>{value}</Text>
                                  </View>
                                </View>

                              </View>
                            )}

                          </View>*/}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Weights') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <Text style={[styles.headingText3]}>Weights</Text>
                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>How much does each category matter?</Text>
                                <View style={[styles.spacer]} />
                              </View>

                              {this.renderAllocation()}

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Work Preferences SA') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn140]}>
                                    <Text style={[styles.headingText3]}>Work Preferences (Self-Assessment)</Text>
                                  </View>
                                  <View style={[styles.width80]}>
                                    <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.workPreferenceWeight) ? "(" + this.state.selectedBenchmark.workPreferenceWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                </View>

                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>What the ideal candidate explicitly says they want in their work, work style, and work environment</Text>
                              </View>

                              {(this.state.workPreferenceTags && this.state.workPreferenceTags.length > 0) && (
                                <View style={[styles.row10]}>
                                  {this.renderTags('workPreferenceTags', this.state.workPreferenceTags)}

                                </View>
                              )}

                              {(this.state.selectedBenchmark.workPreferencesMessage) && (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.workPreferencesMessage}"</Text>
                                </View>
                              )}

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Interests SA') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                            <View style={[styles.row10]}>
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.calcColumn140]}>
                                  <Text style={[styles.headingText3]}>Interests (Self-Assessment)</Text>
                                </View>
                                <View style={[styles.width80]}>
                                  <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.interestsWeight) ? "(" + this.state.selectedBenchmark.interestsWeight + "%)" : "(0%)"}</Text>
                                </View>
                              </View>

                              <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>Candidate general interests and strong interest inventory</Text>
                            </View>

                            {(this.state.selectedBenchmark.generalInterests && this.state.selectedBenchmark.generalInterests.length > 0) && (
                              <View style={[styles.row10]}>
                                {this.renderTags('generalInterests', this.state.selectedBenchmark.generalInterests)}

                              </View>
                            )}

                            {(this.state.interests && this.state.interests.length > 0) && (
                              <View style={[styles.standardBorder,styles.padding30,styles.topMargin20]}>
                                <Text style={[styles.headingText5]}>Strong Interest Inventory Results</Text>
                                <Text style={[styles.row5,styles.descriptionText2]}>Strong Interest Inventory is a popular interest assessment used by career counselors. Learn more <Text style={[styles.descriptionText2,styles.ctaColor,styles.boldText]} onPress={() => Linking.openURL("https://en.wikipedia.org/wiki/Strong_Interest_Inventory")}>here</Text>.</Text>
                                <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                {this.state.interests.map((value, optionIndex) =>
                                  <View key={value}>
                                    <View style={[styles.rowDirection]}>
                                      <View style={[styles.calcColumn190]}>
                                        <Text style={this.returnColorClass(optionIndex,'text')}>{value.title}</Text>
                                      </View>
                                      <View style={[styles.width70,styles.alignEnd]}>
                                        <Text style={[styles.rightText,this.returnColorClass(optionIndex,'text')]}>{(value.score) ? (value.score * 20).toString() + '%' : '0%'}</Text>
                                      </View>
                                    </View>
                                    <View style={[styles.calcColumn120,styles.topPadding5]}>
                                      <View style={[styles.miniSpacer]} />
                                      <View style={[styles.progressBar]} >
                                        <View style={[styles.filler,this.returnColorClass(optionIndex,'background'), (value.score) ? { flex: value.score * 20 } : { flex: 0 }]} />
                                      </View>
                                    </View>

                                    {(optionIndex + 1 !== this.state.interests.length) && (
                                      <View style={[styles.row10]}>
                                        <View style={[styles.horizontalLine]} />
                                      </View>
                                    )}
                                  </View>
                                )}

                              </View>
                            )}

                            <View style={[styles.spacer]} />

                            {(this.state.selectedBenchmark.interestsMessage) && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.interestsMessage}"</Text>
                              </View>
                            )}

                            <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Personality SA') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn140]}>
                                    <Text style={[styles.headingText3]}>Personality (Self-Assessment)</Text>
                                  </View>
                                  <View style={[styles.width80]}>
                                    <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.personalityWeight) ? "(" + this.state.selectedBenchmark.personalityWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                </View>

                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>The big five, 16 personalities, and other personality traits</Text>
                              </View>

                              {(this.state.selectedBenchmark.additionalTraits && this.state.selectedBenchmark.additionalTraits.length > 0) ? (
                                <View style={[styles.row10]}>
                                  {this.renderTags('additionalTraits', this.state.selectedBenchmark.additionalTraits)}
                                </View>
                              ) : (
                                <View />
                              )}

                              {(this.state.selectedBenchmark.myersBriggs) ? (
                                <View style={[styles.standardBorder,styles.padding30,styles.topMargin20]}>
                                  <Text style={[styles.headingText5]}>16 Personalities Results</Text>
                                  <Text style={[styles.row5,styles.descriptionText2]}>16 personalities / myers briggs is a popular way for career counselors to distinguish how people have different personalities. Learn more <Text style={[styles.descriptionText2,styles.ctaColor,styles.boldText]} onPress={() => Linking.openURL("https://en.wikipedia.org/wiki/Myers–Briggs_Type_Indicator")}>here</Text>.</Text>
                                  <View style={[styles.spacer]} />
                                  <Text style={[styles.headingText2,styles.ctaColor]}>{this.state.selectedBenchmark.myersBriggs}</Text>

                                </View>
                              ) : (
                                <View />
                              )}

                              {(this.state.traits && this.state.traits.length > 0) ? (
                                <View style={[styles.standardBorder,styles.padding30,styles.topMargin20]}>
                                  <Text style={[styles.headingText5]}>Big Five Results</Text>
                                  <Text style={[styles.row5,styles.descriptionText2]}>The Big Five personality traits is a popular way for career counselors and psychologists to distinguish how people have different personalities. Learn more <Text style={[styles.descriptionText2,styles.ctaColor,styles.boldText]} onPress={() => Linking.openURL("https://en.wikipedia.org/wiki/Big_Five_personality_traits")}>here</Text>.</Text>
                                  <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                  {this.state.traits.map((value, optionIndex) =>
                                    <View key={value}>
                                      <View style={[styles.rowDirection]}>
                                        <View style={[styles.calcColumn190]}>
                                          <Text style={this.returnColorClass(optionIndex,'text')}>{value.title}</Text>
                                        </View>
                                        <View style={[styles.width70,styles.alignEnd]}>
                                          <Text style={[this.returnColorClass(optionIndex,'text')]}>{(value.score) ? (value.score * 20).toString() + '%' : '0%'}</Text>
                                        </View>
                                      </View>
                                      <View>

                                      </View>
                                      <View style={[styles.topPadding5]}>
                                        <View style={[styles.miniSpacer]} />
                                        <View style={[styles.progressBar]} >
                                          <View style={[styles.filler,this.returnColorClass(optionIndex,'background'),(value.score) ? { flex: value.score } : { flex: 0 }]} />
                                        </View>
                                      </View>

                                      {(optionIndex + 1 !== this.state.traits.length) && (
                                        <View style={[styles.row10]}>
                                          <View style={[styles.horizontalLine]} />
                                        </View>
                                      )}
                                    </View>
                                  )}

                                </View>
                              ) : (
                                <View />
                              )}

                              {(this.state.selectedBenchmark.personalityMessage) ? (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.personalityMessage}"</Text>
                                </View>
                              ) : (
                                <View />
                              )}

                              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Values SA') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                            <View style={[styles.row10]}>
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.calcColumn140]}>
                                  <Text style={[styles.headingText3]}>Values (Self-Assessment)</Text>
                                </View>
                                <View style={[styles.width80]}>
                                  <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.valuesWeight) ? "(" + this.state.selectedBenchmark.valuesWeight + "%)" : "(0%)"}</Text>
                                </View>
                              </View>

                              <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>Ranked values on who candidate gravitates towards and what their employer prefers</Text>
                              <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                            </View>

                            {(this.state.selectedBenchmark.gravitateValues && this.state.selectedBenchmark.gravitateValues.length > 0) && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText]}>The ideal{(this.state.selectedBenchmark.jobFunction) && " " + this.state.selectedBenchmark.jobFunction.toLowerCase()} candidate gravitates toward people who are:</Text>
                                {this.renderTags('gravitateValues', this.state.selectedBenchmark.gravitateValues, 5)}

                              </View>
                            )}
                            {(this.state.selectedBenchmark.employerValues && this.state.selectedBenchmark.employerValues.length > 0) && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText]}>The ideal{(this.state.selectedBenchmark.jobFunction) && " " + this.state.selectedBenchmark.jobFunction.toLowerCase()} candidate wants to work with employers that provide:</Text>
                                {this.renderTags('employerValues', this.state.selectedBenchmark.employerValues, 5)}

                              </View>
                            )}

                            {(this.state.selectedBenchmark.valuesMessage) && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.valuesMessage}"</Text>
                              </View>
                            )}

                            <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Skills SA') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                            <View style={[styles.row10]}>
                              <View style={[styles.rowDirection]}>
                                <View style={[styles.calcColumn140]}>
                                  <Text style={[styles.headingText3]}>Skills (Self-Assessment)</Text>
                                </View>
                                <View style={[styles.width80]}>
                                  <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.skillsWeight) ? "(" + this.state.selectedBenchmark.skillsWeight + "%)" : "(0%)"}</Text>
                                </View>
                              </View>

                              <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>The top skills that matter</Text>
                              <View style={[styles.spacer]} />
                            </View>

                            <View>
                              <View style={[styles.row10]}>
                                {((this.state.selectedBenchmark.highPriorityHardSkills && this.state.selectedBenchmark.highPriorityHardSkills.length > 0) || (this.state.selectedBenchmark.lowPriorityHardSkills && this.state.selectedBenchmark.lowPriorityHardSkills.length > 0)) && (
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.standardText]}>Top hard skills:</Text>

                                    {(this.state.selectedBenchmark.lowPriorityHardSkills) ? (
                                      <View>
                                        {this.renderTags('hardSkills', this.state.selectedBenchmark.highPriorityHardSkills.concat(this.state.selectedBenchmark.lowPriorityHardSkills), 6)}
                                      </View>
                                    ) : (
                                      <View>
                                        {this.renderTags('hardSkills', this.state.selectedBenchmark.highPriorityHardSkills, 6)}
                                      </View>
                                    )}

                                  </View>
                                )}
                              </View>

                              <View style={[styles.row10]}>
                                {((this.state.selectedBenchmark.highPrioritySoftSkills && this.state.selectedBenchmark.highPrioritySoftSkills.length > 0) || (this.state.selectedBenchmark.lowPrioritySoftSkills && this.state.selectedBenchmark.lowPrioritySoftSkills.length > 0)) && (
                                  <View style={[styles.row10]}>
                                    <Text style={[styles.standardText]}>Top soft skills:</Text>

                                    {(this.state.selectedBenchmark.lowPrioritySoftSkills) ? (
                                      <View>
                                        {this.renderTags('softSkills', this.state.selectedBenchmark.highPrioritySoftSkills.concat(this.state.selectedBenchmark.lowPrioritySoftSkills), 6)}
                                      </View>
                                    ) : (
                                      <View>
                                        {this.renderTags('softSkills', this.state.selectedBenchmark.highPrioritySoftSkills, 6)}
                                      </View>
                                    )}

                                  </View>
                                )}
                              </View>

                            </View>

                            {(this.state.selectedBenchmark.skillCourses && this.state.selectedBenchmark.skillCourses.length > 0) && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.boldText]}>Suggested Courses: </Text>

                                <View style={[styles.rowDirection,styles.flexWrap]}>
                                  {this.state.selectedBenchmark.skillCourses.map((value, optionIndex) =>
                                    <View key={value} style={[styles.rightPadding,styles.rowDirection]}>
                                      <Text onPress={() => Linking.openURL(value.url)} style={[styles.standardText,styles.ctaColor,styles.underlineText]}>{value.name}</Text>
                                      {(optionIndex + 1 !== this.state.selectedBenchmark.skillCourses.length) && (
                                        <Text style={[styles.standardText]}>,</Text>
                                      )}
                                    </View>
                                  )}
                                </View>

                              </View>
                            )}

                            {(this.state.selectedBenchmark.skillCertifications && this.state.selectedBenchmark.skillCertifications.length > 0) && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.boldText]}>Suggested Certifications / Badges: </Text>

                                <View style={[styles.rowDirection,styles.flexWrap]}>
                                  {this.state.selectedBenchmark.skillCertifications.map((value, optionIndex) =>
                                    <View key={value} style={[styles.rightPadding,styles.rowDirection]}>
                                      <Text onPress={() => Linking.openURL(value.url)} style={[styles.standardText,styles.ctaColor,styles.underlineText]}>{value.name}</Text>
                                      {(optionIndex + 1 !== this.state.selectedBenchmark.skillCertifications.length) && (
                                        <Text style={[styles.standardText]}>,</Text>
                                      )}
                                    </View>
                                  )}
                                </View>

                              </View>
                            )}

                            {(this.state.selectedBenchmark.skillsMessage) && (
                              <View style={[styles.row10]}>
                                <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.skillsMessage}"</Text>
                              </View>
                            )}

                            <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Education') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn140]}>
                                    <Text style={[styles.headingText3]}>Education</Text>
                                  </View>
                                  <View style={[styles.width80]}>
                                    <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.educationWeight) ? "(" + this.state.selectedBenchmark.educationWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                </View>

                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>The educational components that matter</Text>

                              </View>

                              {(this.state.knowledge && this.state.knowledge.length > 0) ? (
                                <View style={[styles.row10]}>
                                  {this.renderTags('knowledge', this.state.knowledge)}

                                </View>
                              ) : (
                                <View />
                              )}

                              <View style={[styles.spacer]}/>

                              {(this.state.selectedBenchmark.degreeRequirements) ? (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText]}><Text style={[styles.boldText]}>Degree Requirements:</Text> {this.state.selectedBenchmark.degreeRequirements}</Text>
                                </View>
                              ) : (
                                <View />
                              )}

                              {(this.state.selectedBenchmark.idealMajors && this.state.selectedBenchmark.idealMajors.length > 0) ? (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText]}><Text style={[styles.boldText]}>Ideal Majors:</Text> {this.state.selectedBenchmark.idealMajors.toString().replace(/,/g,", ")}</Text>
                                </View>
                              ) : (
                                <View />
                              )}

                              {(this.state.selectedBenchmark.gpaRange && this.state.selectedBenchmark.gpaRange !== '') ? (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText]}><Text style={[styles.boldText]}>GPA Range:</Text> {this.state.selectedBenchmark.gpaRange}</Text>
                                </View>
                              ) : (
                                <View />
                              )}

                              {(this.state.selectedBenchmark.gradYearRange && this.state.selectedBenchmark.gradYearRange !== '') ? (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText]}><Text style={[styles.boldText]}>Grad Year Range:</Text> {this.state.selectedBenchmark.gradYearRange}</Text>
                                </View>
                              ) : (
                                <View />
                              )}

                              {(this.state.selectedBenchmark.testScores && this.state.selectedBenchmark.testScores !== '') ? (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText]}><Text style={[styles.boldText]}>Standardized Test Scores:</Text> {this.state.selectedBenchmark.testScores}</Text>
                                </View>
                              ) : (
                                <View />
                              )}

                              {(this.state.selectedBenchmark.courseHours && this.state.selectedBenchmark.courseHours !== '') ? (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText]}><Text style={[styles.boldText]}>Hours of Relevant Coursework Completed:</Text> {this.state.selectedBenchmark.courseHours}</Text>
                                </View>
                              ) : (
                                <View />
                              )}

                              {(this.state.selectedBenchmark.courses && this.state.selectedBenchmark.courses.length > 0) ? (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.boldText]}>Suggested Courses: </Text>

                                  <View style={[styles.rowDirection,styles.flexWrap]}>
                                    {this.state.selectedBenchmark.courses.map((value, optionIndex) =>
                                      <View key={value} style={[styles.rightPadding,styles.rowDirection]}>
                                        <Text onPress={() => Linking.openURL(value.url)} style={[styles.standardText,styles.ctaColor,styles.underlineText]}>{value.name}</Text>
                                        {(optionIndex + 1 !== this.state.selectedBenchmark.courses.length) && (
                                          <Text style={[styles.standardText]}>,</Text>
                                        )}
                                      </View>
                                    )}
                                  </View>

                                </View>
                              ) : (
                                <View />
                              )}

                              {(this.state.selectedBenchmark.certifications && this.state.selectedBenchmark.certifications.length > 0) ? (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.boldText]}>Suggested Certifications / Badges: </Text>

                                  <View style={[styles.rowDirection,styles.flexWrap]}>
                                    {this.state.selectedBenchmark.certifications.map((value, optionIndex) =>
                                      <View key={value} style={[styles.rightPadding,styles.rowDirection]}>
                                        <Text onPress={() => Linking.openURL(value.url)} style={[styles.standardText,styles.ctaColor,styles.underlineText]}>{value.name}</Text>
                                        {(optionIndex + 1 !== this.state.selectedBenchmark.certifications.length) && (
                                          <Text style={[styles.standardText]}>,</Text>
                                        )}
                                      </View>
                                    )}
                                  </View>
                                </View>
                              ) : (
                                <View />
                              )}

                              <View style={[styles.spacer]}/>

                              {(this.state.selectedBenchmark.educationMessage) ? (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.educationMessage}"</Text>
                                </View>
                              ) : (
                                <View />
                              )}

                              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Endorsements') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn140]}>
                                    <Text style={[styles.headingText3]}>Endorsements</Text>
                                  </View>
                                  <View style={[styles.width80]}>
                                    <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.endorsementWeight) ? "(" + this.state.selectedBenchmark.endorsementWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                </View>

                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>Importance of 3rd party skill and knowledge endorsements</Text>
                              </View>

                              {(this.state.selectedBenchmark.endorsementsMessage) && (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.endorsementsMessage}"</Text>
                                </View>
                              )}

                              <View style={[styles.row10]}>
                                <TouchableOpacity onPress={() => this.prepareEndorsement()}><Text style={[styles.standardText,styles.ctaColor,styles.underlineText,styles.offsetUnderline]}>See Example Endorsement</Text></TouchableOpacity>
                              </View>

                              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Projects') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn140]}>
                                    <Text style={[styles.headingText3]}>Projects</Text>
                                  </View>
                                  <View style={[styles.width80]}>
                                    <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.projectWeight) ? "(" + this.state.selectedBenchmark.projectWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                </View>

                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>Importance of relevant projects, and what type of project work</Text>
                              </View>

                              {(this.state.projectTags && this.state.projectTags.length > 0) && (
                                <View style={[styles.row10]}>
                                  {this.renderTags('projectTags', this.state.projectTags)}

                                </View>
                              )}

                              {(this.state.selectedBenchmark.projectHours && this.state.selectedBenchmark.projectHours !== '') && (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText]}><Text style={[styles.boldText]}>Recommended Invested Hours:</Text> {this.state.selectedBenchmark.projectHours}</Text>
                                </View>
                              )}

                              {(this.state.selectedBenchmark.exampleProjects && this.state.selectedBenchmark.exampleProjects.length > 0) && (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.boldText]}>Example Impressive Projects: </Text>

                                  <View style={[styles.rowDirection,styles.flexWrap]}>
                                    {this.state.selectedBenchmark.exampleProjects.map((value, optionIndex) =>
                                      <View key={value} style={[styles.rightPadding,styles.rowDirection]}>
                                        <Text onPress={() => Linking.openURL(value.url)} style={[styles.standardText,styles.ctaColor,styles.underlineText]}>{value.name}</Text>
                                        {(optionIndex + 1 !== this.state.selectedBenchmark.exampleProjects.length) && (
                                          <Text style={[styles.standardText]}>,</Text>
                                        )}
                                      </View>
                                    )}
                                  </View>

                                </View>
                              )}

                              {(this.state.selectedBenchmark.projectsMessage) && (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.projectsMessage}"</Text>
                                </View>
                              )}

                              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Experience') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn140]}>
                                    <Text style={[styles.headingText3]}>Experience</Text>
                                  </View>
                                  <View style={[styles.width80]}>
                                    <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.experienceWeight) ? "(" + this.state.selectedBenchmark.experienceWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                </View>

                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>Importance of relevant experience, and what type of experience</Text>
                              </View>

                              {(this.state.selectedBenchmark.experienceMessage) && (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.experienceMessage}"</Text>
                                </View>
                              )}

                              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Resume') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn140]}>
                                    <Text style={[styles.headingText3]}>Resume</Text>
                                  </View>
                                  <View style={[styles.width80]}>
                                    <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.resumeWeight) ? "(" + this.state.selectedBenchmark.resumeWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                </View>

                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>What matters on the ideal candidate's resume</Text>
                              </View>

                              {(this.state.selectedBenchmark.resumeMessage) && (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.resumeMessage}"</Text>
                                </View>
                              )}

                              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Cover Letter') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn140]}>
                                    <Text style={[styles.headingText3]}>Cover Letter</Text>
                                  </View>
                                  <View style={[styles.width80]}>
                                    <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.coverLetterWeight) ? "(" + this.state.selectedBenchmark.coverLetterWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                </View>

                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>What matters on the ideal candidate's cover letter</Text>
                              </View>

                              {(this.state.selectedBenchmark.coverLetterMessage) && (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.coverLetterMessage}"</Text>
                                </View>
                              )}

                              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Interview') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn140]}>
                                    <Text style={[styles.headingText3]}>Interview</Text>
                                  </View>
                                  <View style={[styles.width80]}>
                                    <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.interviewWeight) ? "(" + this.state.selectedBenchmark.interviewWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                </View>

                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>What matters in the ideal candidate's interview</Text>
                              </View>

                              <View style={[styles.spacer]}/>

                              {(this.state.selectedBenchmark.interviewRubric && this.state.selectedBenchmark.interviewRubric.length > 0) && (
                                <View style={[styles.row20]}>
                                  <Text style={[styles.headingText5]}>Interview Rubric</Text>
                                  <View style={[styles.spacer]}/>

                                  <View style={[styles.standardBorder]}>
                                    <View style={[styles.horizontalLine,styles.flex1,styles.rowDirection]}>
                                      <View style={[styles.flex33,styles.padding20]}>
                                        <Text style={[styles.standardText,styles.boldText]}>Criteria</Text>
                                      </View>
                                      <View style={[styles.flex33,styles.padding20]}>
                                        <Text style={[styles.standardText,styles.boldText]}>Sample Questions</Text>
                                      </View>
                                      <View style={[styles.flex33,styles.padding20]}>
                                        <Text style={[styles.standardText,styles.boldText]}>Qualities of Great Scores</Text>
                                      </View>

                                    </View>

                                    {this.state.selectedBenchmark.interviewRubric.map((value, optionIndex) =>
                                      <View key={value}>
                                        <View style={[styles.horizontalLine,styles.flex1,styles.rowDirection]}>
                                          <View style={[styles.flex33,styles.padding20]}>
                                            <Text style={[styles.boldText]}>{optionIndex + 1}. {value.criterion}</Text>
                                          </View>
                                          <View style={[styles.flex33,styles.padding20]}>
                                            {value.questions.map((value2, optionIndex2) =>
                                              <View>
                                                <Text style={[styles.standardText]}>{value2}</Text>
                                              </View>
                                            )}
                                          </View>
                                          <View style={[styles.flex33,styles.padding20]}>
                                            {value.answers.map((value2, optionIndex2) =>
                                              <View>
                                                <Text style={[styles.standardText]}>{value2}</Text>
                                              </View>
                                            )}
                                          </View>

                                        </View>
                                      </View>
                                    )}
                                  </View>

                                </View>
                              )}

                              {(this.state.selectedBenchmark.interviewMessage) && (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.interviewMessage}"</Text>
                                </View>
                              )}

                              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Ideal Profile' || this.state.subNavSelected === 'Diversity') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              <View style={[styles.row10]}>
                                <View style={[styles.rowDirection]}>
                                  <View style={[styles.calcColumn140]}>
                                    <Text style={[styles.headingText3]}>Diversity</Text>
                                  </View>
                                  <View style={[styles.width80]}>
                                    <Text style={[styles.headingText3,styles.ctaColor,styles.boldText]}>{(this.state.selectedBenchmark.adversityScoreWeight) ? "(" + this.state.selectedBenchmark.adversityScoreWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                </View>

                                <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.topPadding]}>What valuable diverse candidates look like to us</Text>
                              </View>

                              {(this.state.selectedBenchmark.adversityScoreMessage) && (
                                <View style={[styles.row10]}>
                                  <Text style={[styles.standardText,styles.italicizeText]}>"{this.state.selectedBenchmark.adversityScoreMessage}"</Text>
                                </View>
                              )}

                              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'About') && (
                            <View style={[styles.card,styles.fullScreenWidth,styles.topMargin30]}>
                              {(this.state.selectedEmployer) && (
                                <View>

                                  <Text style={[styles.headingText3,styles.bottomPadding]}>About {this.state.employerName}</Text>

                                  {(this.state.selectedEmployer.videos && this.state.selectedEmployer.videos.length > 0) ? (
                                    <View>
                                      {this.state.selectedEmployer.videos.map((value, index) =>
                                        <View key={value}>
                                          <View>
                                            <View style={[styles.topMargin20]}>
                                              <View>
                                                <View>
                                                  <WebView
                                                    style={[styles.calcColumn60,styles.screenHeight20]}
                                                    javaScriptEnabled={true}
                                                    source={{uri: value}}
                                                  />

                                                </View>

                                              </View>
                                            </View>
                                          </View>
                                        </View>
                                      )}

                                    </View>
                                  ) : (
                                    <View>
                                      <Text style={[styles.standardText,styles.descriptionTextColor]}>No Videos Yet</Text>
                                    </View>
                                  )}

                                  <View style={[styles.spacer]} />

                                  {(this.state.selectedEmployer.description) && (
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor,styles.row10]}>{this.state.selectedEmployer.description}</Text>
                                  )}

                                  {(this.state.selectedEmployer.employerCulture) && (
                                    <Text style={[styles.descriptionText1,styles.descriptionTextColor]}>{this.state.selectedEmployer.employerCulture}</Text>
                                  )}

                                  {(this.state.selectedEmployer.employerType) && (
                                    <Text style={[styles.descriptionText1,styles.row10]}><Text style={[styles.boldText]}>Type:</Text> {this.state.selectedEmployer.employerType}</Text>
                                  )}

                                  {(this.state.selectedEmployer.employeeCount) && (
                                    <Text style={[styles.descriptionText1,styles.row10]}><Text style={[styles.boldText]}>Employees:</Text> {this.state.selectedEmployer.employeeCount}</Text>
                                  )}

                                  {(this.state.selectedEmployer.employeeGrowth) && (
                                    <Text style={[styles.descriptionText1,styles.row10]}><Text style={[styles.boldText]}>Growth:</Text> {this.state.selectedEmployer.employeeGrowth}</Text>
                                  )}

                                  {(this.state.selectedEmployer.employerLocation) && (
                                    <Text style={[styles.descriptionText1,styles.row10]}><Text style={[styles.boldText]}>Location:</Text> {this.state.selectedEmployer.employerLocation}</Text>
                                  )}

                                  <View style={[styles.row10]}>
                                    <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.props.navigation.navigate("EmployerDetails", { objectId: this.state.employerId })}>
                                      <Text style={[styles.standardText,styles.ctaColor]}>View the {this.state.employerName} Profile</Text>
                                    </TouchableOpacity>
                                  </View>

                                </View>
                              )}

                              {(this.state.selectedCareer) && (
                                <View>

                                  {(this.state.selectedEmployer) && (
                                    <View style={[styles.row30]}>
                                      <View style={[styles.ctaHorizontalLine]} />
                                    </View>
                                  )}

                                  <Text style={[styles.headingText3,styles.bottomPadding,styles.centerText]}>About {this.state.selectedCareer.name}</Text>

                                  {(this.state.selectedCareer.overview) ? (
                                    <View style={[styles.row15]}>
                                      <Text style={[styles.descriptionText1,styles.centerText]}>{this.state.selectedCareer.overview.summary}</Text>
                                    </View>
                                  ) : (
                                    <View />
                                  )}

                                  { (this.state.selectedCareer.marketData) && (
                                    <View>
                                      <View style={[styles.topPadding20,styles.bottomPadding5]}>
                                        <Text style={[styles.headingText6,styles.underlineText]}>Market Data</Text>
                                      </View>
                                      <View style={[styles.rowDirection]}>
                                        <View style={[styles.width160]}>
                                          <Text style={[styles.descriptionText1]}>Pay</Text>
                                        </View>
                                        <View style={[styles.calcColumn220,styles.leftPadding]}>
                                          <Text style={[styles.descriptionText1,styles.rightText]}>${Number(this.state.selectedCareer.marketData.pay).toLocaleString()}</Text>
                                        </View>

                                      </View>
                                      <View style={[styles.rowDirection]}>
                                        <View style={[styles.width160]}>
                                          <Text style={[styles.descriptionText1]}>Total Employment</Text>
                                        </View>
                                        <View style={[styles.calcColumn220,styles.leftPadding]}>
                                          <Text style={[styles.descriptionText1,styles.rightText]}>{this.state.selectedCareer.marketData.totalEmployment}</Text>
                                        </View>

                                      </View>
                                      <View style={[styles.rowDirection]}>
                                        <View style={[styles.width160]}>
                                          <Text style={[styles.descriptionText1]}>Growth</Text>
                                        </View>
                                        <View style={[styles.calcColumn220,styles.leftPadding]}>
                                          <Text style={[styles.descriptionText1,styles.rightText]}>{this.state.selectedCareer.marketData.growth}</Text>
                                        </View>

                                      </View>
                                      <View style={[styles.rowDirection]}>
                                        <View style={[styles.width160]}>
                                          <Text style={[styles.descriptionText1]}>New Jobs</Text>
                                        </View>
                                        <View style={[styles.calcColumn220,styles.leftPadding]}>
                                          <Text style={[styles.descriptionText1,styles.rightText]}>{Number(this.state.selectedCareer.marketData.newJobs).toLocaleString()}</Text>
                                        </View>

                                      </View>
                                    </View>
                                  )}

                                  <View style={[styles.row10,styles.topMargin20]}>

                                    <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.props.navigation.navigate("CareerDetails", { careerSelected: this.state.selectedCareer })}>
                                      <Text style={[styles.standardText,styles.ctaColor,styles.centerText]}>View Career Profile</Text>
                                    </TouchableOpacity>
                                  </View>

                                </View>
                              )}

                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'People') && (
                            <View>
                              {(this.state.followers && this.state.followers.length > 0) ? (
                                <View>
                                  <SubRenderProfiles
                                    favorites={this.state.favorites} members={this.state.followers} friends={this.state.friends}
                                    pageSource={this.props.pageSource} navigation={this.props.navigation} userType="Peers"
                                  />
                                </View>
                              ) : (
                                <View />
                              )}
                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Courses') && (
                            <View style={[styles.card,styles.topMargin30]}>
                              {this.renderCourses()}
                            </View>
                          )}
                          {/*
                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Projects') && (
                            <View style={[styles.card,styles.topMargin30]}>
                              {this.renderOpportunities('project')}
                            </View>
                          )}*/}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Work') && (
                            <View style={[styles.card,styles.topMargin30]}>
                              {this.renderOpportunities('work')}
                            </View>
                          )}

                          {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Similar') && (
                            <View style={[styles.card,styles.topMargin30]}>
                                <Text style={[styles.headingText5]}>Other {this.state.employerName} Benchmarks</Text>

                                <View style={[styles.spacer]} /><View style={[styles.halfSpacer]} />

                                {this.state.benchmarks.map((item, index) =>
                                  <View key={item}>
                                    {(index < 3) && (
                                      <View style={[styles.bottomPadding]}>
                                        <View style={[styles.spacer]} />

                                        <View style={[styles.rowDirection]}>
                                          <TouchableOpacity onPress={() => this.props.navigation.navigate('BenchmarkDetails',{ selectedBenchmark: item })} style={[styles.rowDirection]}>
                                            <View style={[styles.width50]}>
                                              <Image source={(this.state.employerLogoURI) ? { uri: this.state.employerLogoURI } : { uri: benchmarksIconDark}} style={[styles.square40,styles.contain]}/>
                                            </View>
                                            <View style={[styles.calcColumn150]}>
                                              <Text style={[styles.standardText,styles.ctaColor]}>{item.title}</Text>
                                              <Text style={[styles.descriptionText2]}>{item.jobFunction} | {item.jobType}</Text>
                                            </View>
                                          </TouchableOpacity>
                                          <View style={[styles.width40,styles.alignEnd]}>
                                            <View style={[styles.spacer]}/>
                                            <TouchableOpacity onPress={() => this.props.navigation.navigate('BenchmarkDetails',{ selectedBenchmark: item })}>
                                              <Image source={{ uri: arrowIndicatorIcon}} style={[styles.square22,styles.contain]}/>
                                            </TouchableOpacity>
                                          </View>
                                        </View>

                                        <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                        <View style={[styles.horizontalLine]} />

                                        <View style={[styles.spacer]} />
                                      </View>
                                    )}
                                  </View>
                                )}
                            </View>
                          )}

                          <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.spacer]}/>

                        </View>
                      </View>
                    </View>

                    {(this.state.showEndorsementDetails) && (
                      <View>
                        <SubEndorsementDetails closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedEndorsement={this.state.selectedEndorsement} orgCode={this.state.activeOrg} />
                      </View>
                    )}
                  </View>
                )}

              </View>
            )}
          </View>

          <Modal isVisible={this.state.modalIsOpen} style={styles.modal} key="Modal">
           {(this.state.showShareButtons) && (
             <View style={[styles.flex1,styles.padding20,styles.centerText]}>
                <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                <View style={[styles.row10]}>
                  <Text style={[styles.headingText4,styles.centerText]}>Share the {this.state.selectedBenchmark.title} Benchmark with Friends!</Text>
                </View>

                <View style={[styles.row30]}>
                  <Text style={[styles.descriptionText1,styles.centerText]}>Share this link:</Text>
                  <TouchableOpacity onPress={() => Linking.openURL(this.state.shareURL)}><Text style={[styles.standardText,styles.ctaColor,styles.boldText,styles.centerText]}>{this.state.shareURL}</Text></TouchableOpacity>
                </View>

                <View style={[styles.spacer]} />

                <View style={[styles.topPadding20]}>
                  <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close View</Text></TouchableOpacity>
                </View>

              </View>
           )}

           {(this.state.showApprovedInfo) && (
             <ScrollView style={[styles.flex1,styles.padding20]}>
                <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                <View style={[styles.row10]}>
                  <Text style={[styles.headingText4,styles.centerText]}>{this.state.selectedBenchmark.title} has been approved by {this.state.employerName}</Text>
                </View>

                <View style={[styles.row30,styles.rowDirection]}>
                  <Text style={[styles.descriptionText1,styles.centerText]}>{this.state.employerName} has indicated that this benchmark is relective of how they evaluate candidates for the {this.state.selectedBenchmark.pathway} pathway. This benchmark may be even attached to some of their postings. However, {this.state.employerName} is not legally bound to use this criteria when evaluating candidates.</Text>
                </View>

                <View style={[styles.row10]}>
                  <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close View</Text></TouchableOpacity>
                </View>

              </ScrollView>
           )}

           {(this.state.showBenchmarkInfo) && (
             <ScrollView style={[styles.flex1,styles.padding20]}>
              {console.log('showApprovedInfo: ', this.state.showApprovedInfo)}
               <View style={[styles.spacer]} /><View style={[styles.spacer]} />

               <View style={[styles.row10]}>
                 <Text style={[styles.headingText4,styles.centerText]}>What is a Benchmark?</Text>
               </View>

               <View style={[styles.row30,styles.rowDirection]}>
                 <Text style={[styles.descriptionText1,styles.centerText]}>Benchmarks are "ideal candidate profiles" and serve as the foundation for Guided Compass. Employers and workforce programs define benchmarks (i.e., ideal candidates in terms of skills, knowledge, interests, and more) and attach them to work opportunities, project opportunities, programs and more. Our algorithms use benchmarks to recommend opportunities to you and your applications to them. Learn more about our benchmarks <Text onPress={() => Linking.openURL('https://guidedcompass.com/benefits/transparent-pathways')} style={[styles.descriptionText1,styles.ctaColor,styles.underlineText]}>here</Text>.</Text>
               </View>

               <View style={[styles.row10]}>
                 <TouchableOpacity style={[styles.btnPrimary,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.standardText,styles.ctaColor]}>Close View</Text></TouchableOpacity>
               </View>

              </ScrollView>
           )}

         </Modal>
        </ScrollView>

    )
  }

}

export default BenchmarkDetails;
