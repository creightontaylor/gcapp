import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform, ActivityIndicator } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';
import { WebView } from 'react-native-webview';

const benchmarksIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/benchmarks-icon-dark.png';
const approvedIconBlue = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/approved-icon-blue.png';
const arrowIndicatorIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/arrow-indicator-icon.png';

import SubEndorsementDetails from '../common/EndorsementDetails';

class BenchmarkDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
      viewMode: 'List',
      subNavSelected: 'All',
      totalPercent: 100,
      // benchmarkCategories: ['Overall Weights','Work Preferences','Interests','Personality','Values','Skills','Endorsements','Education','Projects','Experience','Interview'],
      benchmarkCategories: ['All','Weights','Work Preferences SA','Interests SA','Personality SA','Values SA','Skills SA','Endorsements','Education','Projects','Experience','Interview','Diversity'],
      viewOptions: ['','List','Profile Card'],
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

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ')

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
      this.setState({ emailId, postsAreLoading: true })

      const accountCode = this.props.accountCode
      let isLoading = true

      this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
        roleName, activeOrg, orgFocus, orgName, remoteAuth,
        accountCode, isLoading
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

      Axios.get('https://www.guidedcompass.com/api/account', { params: { accountCode } })
      .then((response) => {
        console.log('Account info query attempted within sub settings');

        if (response.data.success) {
          console.log('account info query worked in sub settings')

          const employerName = response.data.accountInfo.employerName
          const employerLogoURI = response.data.accountInfo.employerLogoURI
          this.setState({ employerName, employerLogoURI });

        }

      }).catch((error) => {
        console.log('Account info query did not work for some reason', error);
      });

      if (this.props.benchmarkId) {
        Axios.get('https://www.guidedcompass.com/api/benchmarks/byid', { params: { _id: this.props.benchmarkId } })
        .then((response) => {
          console.log('Benchmarks query attempted');

          if (response.data.success) {
            console.log('benchmark query worked')

            const selectedBenchmark = response.data.benchmark
            this.setState({ selectedBenchmark, isLoading: false })

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

            Axios.get('https://www.guidedcompass.com/api/benchmarks', { params: { accountCode, pathwayLevel: true } })
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
    console.log('renderTags: ', type, passedArray, limit)

    let backgroundColorClass = "primary-background"
    if (type === 'gravitateValues') {
      backgroundColorClass = "secondary-background"
    } else if (type === 'employerValues') {
      backgroundColorClass = "tertiary-background"
    } else if (type === 'hardSkills') {
      backgroundColorClass = "quaternary-background"
    } else if (type === 'softSkills') {
      backgroundColorClass = "quinary-background"
    } else if (type === 'workPreferenceTags') {
      backgroundColorClass = "nonary-background"
    } else if (type === 'knowledge') {
      backgroundColorClass = "denary-background"
    }
    if (passedArray) {
      return (
        <View key={type + "|0"}>
          <View className="spacer" />
          {passedArray.map((value, optionIndex) =>
            <View key={type + "|" + optionIndex} className="float-left">
              {(!limit || (limit && optionIndex < limit)) && (
                <View className="float-left right-padding-5">
                  <View className="half-spacer" />
                  <View className={"tag-container-basic " + backgroundColorClass}>
                    <Text className="description-text-2 white-text">{value}</Text>
                  </View>
                  <View className="half-spacer" />
                </View>
              )}
            </View>
          )}
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
            <View className="row-10">
              <View className="calc-column-offset-70">
                <Text className="heading-text-6">{i}. {weights[i - 1].name}</Text>
                <View className="half-spacer" /><View className="mini-spacer" /><View className="mini-spacer" />
                <Text className="description-text-2">{weights[i - 1].description}</Text>
              </View>
              <View className="fixed-column-70">
                <View className="mini-spacer"/><View className="mini-spacer"/>
                <Text className="heading-text-2 cta-color bold-text full-width right-text">{(weights[i - 1].value) ? weights[i - 1].value : "0"}%</Text>
              </View>
              <View className="clear" />
            </View>
          </TouchableOpacity>
        </View>
      )
    }

    return rows

  }

  returnColorClass(index,type) {
    console.log('returnColorClass called', index, type)

    let colorClass = "nonary-background"
    if (type === 'text') {
      if (index === 0) {
        colorClass = 'nonary-text'
      } else if (index === 1) {
        colorClass = 'primary-text'
      } else if (index === 2) {
        colorClass = 'twelve-text'
      } else if (index === 3) {
        colorClass = 'denary-text'
      } else if (index === 4) {
        colorClass = 'thirteen-text'
      } else if (index === 5) {
        colorClass = 'secondary-text'
      }
    } else if (type === 'background') {
      if (index === 0) {
        colorClass = 'nonary-background'
      } else if (index === 1) {
        colorClass = 'primary-background'
      } else if (index === 2) {
        colorClass = 'twelve-background'
      } else if (index === 3) {
        colorClass = 'denary-background'
      } else if (index === 4) {
        colorClass = 'thirteen-background'
      } else if (index === 5) {
        colorClass = 'secondary-background'
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
    this.setState({ modalIsOpen: false, showEndorsementDetails: false  })
  }

  subNavClicked(subNavSelected) {
    console.log('subNavClicked called', subNavSelected)

    this.setState({ subNavSelected })

  }

  questionFilterClicked(questionFilterSelected, type) {
    console.log('questionFilterClicked called', questionFilterSelected, type)

    if (type === 'question') {
      this.setState({ questionFilterSelected })
      if (questionFilterSelected === 'Hot') {
        this.pullGroupPosts(this.state.careerDetails._id, this.state.activeOrg, true)
      } else {
        // new
        this.pullGroupPosts(this.state.careerDetails._id, this.state.activeOrg, false)
      }
    } else if (type === 'project') {
      this.setState({ projectFilterSelected: questionFilterSelected })
      if (questionFilterSelected === 'Hot') {
        this.pullProjects(this.state.careerDetails.name, this.state.activeOrg, true)
      } else {
        // new
        this.pullProjects(this.state.careerDetails.name, this.state.activeOrg, false)
      }
    }
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

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, howShareButtons: false, addQuestion: false, addProject: false, showUpvotes: false, showComments: false })
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
                  <View className="flex-container flex-center full-space">
                    <View>
                      <View className="super-spacer" />

                      <ActivityIndicator
                         animating = {this.state.animating}
                         color = '#87CEFA'
                         size = "large"
                         style={[styles.square80, styles.centerHorizontally]}/>

                      <View className="spacer" /><View className="spacer" /><View className="spacer" />
                      <Text className="center-text cta-color bold-text">Loading...</Text>

                    </View>
                  </View>
                ) : (
                  <View>
                    <View className="full-width">
                      <View>
                        <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally top-margin-40">
                          <View className="full-width height-5 primary-background" />
                          <View className="padding-40">
                            <View className="row-10">
                              <View className="fixed-column-90">
                                <TouchableOpacity onPress={() => this.props.navigation.navigate('EmployerDetails', { objectId: this.state.selectedBenchmark.accountCode })}>
                                  <Image source={(this.state.employerLogoURI) ? { uri: this.state.employerLogoURI} : { uri: benchmarksIconDark}} className="image-auto-80" />
                                </TouchableOpacity>
                              </View>
                              <View className="calc-column-offset-140 left-padding top-padding-5">
                                <Text className="heading-text-2">{this.state.selectedBenchmark.title}</Text>
                                <Text className="top-padding">The ideal candidate to join {(this.state.selectedBenchmark.jobFunction && this.state.selectedBenchmark.jobFunction !== 'Other') && ' the ' + this.state.selectedBenchmark.jobFunction.toLowerCase() + ' team at '}{this.state.employerName}. </Text>
                                <Text className="profile-descriptor top-padding-15">Note: The "perfect candidate" will not be guaranteed a job. This is meant to be a guide for career-seekers, educators, and workforce professionals.</Text>
                              </View>
                              <View className="fixed-column-50">
                                <Image source={{ uri: approvedIconBlue}} className="image-auto-25 center-horizontally" />

                                <Text className="description-text-2 full-width center-text top-margin-5">{this.state.employerName} Verified!</Text>
                              </View>
                              <View className="clear" />
                            </View>
                          </View>
                        </View>

                        {(this.state.viewMode === 'List') && (
                          <View>
                            <View className="medium-shadow slightly-rounded-corners width-94-percent max-width-1400 center-horizontally top-margin-40 ">
                              <View className="carousel-3 white-background" onScroll={this.handleScroll}>
                                {this.state.benchmarkCategories.map((value, index) =>
                                  <View className="carousel-item-container">
                                    {(value === this.state.subNavSelected) ? (
                                      <View className="selected-carousel-item">
                                        <Text key={value}>{value}</Text>
                                      </View>
                                    ) : (
                                      <TouchableOpacity className="menu-button" onPress={() => this.setState({ subNavSelected: value })}>
                                        <Text key={value}>{value}</Text>
                                      </TouchableOpacity>
                                    )}
                                  </View>
                                )}
                              </View>
                            </View>

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Weights') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                                <View className="row-10">
                                  <Text className="heading-text-3">Weights</Text>
                                  <Text className="description-text-1 description-text-color top-padding">How much does each category matter?</Text>
                                  <View className="spacer" />
                                </View>

                                {this.renderAllocation()}

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Work Preferences SA') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                                <View className="row-10">
                                  <View className="float-left">
                                    <Text className="heading-text-3">Work Preferences (Self-Assessment)</Text>
                                  </View>
                                  <View className="float-left left-padding">
                                    <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.workPreferenceWeight) ? "(" + this.state.selectedBenchmark.workPreferenceWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                  <View className="clear" />
                                  <Text className="description-text-1 description-text-color top-padding">What the ideal candidate explicitly says they want in their work, work style, and work environment</Text>
                                </View>

                                {(this.state.workPreferenceTags && this.state.workPreferenceTags.length > 0) && (
                                  <View className="row-10">
                                    {this.renderTags('workPreferenceTags', this.state.workPreferenceTags)}
                                    <View className="clear" />
                                  </View>
                                )}

                                {(this.state.selectedBenchmark.workPreferencesMessage) && (
                                  <View className="row-10">
                                    <Text className="italicize-text">"{this.state.selectedBenchmark.workPreferencesMessage}"</Text>
                                  </View>
                                )}

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Interests SA') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                              <View className="row-10">
                                <View className="float-left">
                                  <Text className="heading-text-3">Interests (Self-Assessment)</Text>
                                </View>
                                <View className="float-left left-padding">
                                  <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.interestsWeight) ? "(" + this.state.selectedBenchmark.interestsWeight + "%)" : "(0%)"}</Text>
                                </View>
                                <View className="clear" />
                                <Text className="description-text-1 description-text-color top-padding">Candidate general interests and strong interest inventory</Text>
                              </View>

                              {(this.state.selectedBenchmark.generalInterests && this.state.selectedBenchmark.generalInterests.length > 0) && (
                                <View className="row-10">
                                  {this.renderTags('generalInterests', this.state.selectedBenchmark.generalInterests)}
                                  <View className="clear" />
                                </View>
                              )}

                              {(this.state.interests && this.state.interests.length > 0) && (
                                <View className="standard-border padding-30 top-margin-20">
                                  <Text className="heading-text-5">Strong Interest Inventory Results</Text>
                                  <Text className="row-5 description-text-2">Strong Interest Inventory is a popular interest assessment used by career counselors. Learn more <Text style={[styles.standardText,styles.ctaColor,styles.boldText]} onPress={() => Linking.openURL("https://en.wikipedia.org/wiki/Strong_Interest_Inventory")}>here</Text>.</Text>
                                  <View className="spacer" /><View className="spacer" />
                                  {this.state.interests.map((value, optionIndex) =>
                                    <View key={value}>
                                      <View className="fixed-column-130">
                                        <Text className={this.returnColorClass(optionIndex,'text')}>{value.title}</Text>
                                      </View>
                                      <View className="calc-column-offset-190 top-padding-5">
                                        <View className="mini-spacer" />
                                        <View className="progress-bar clear-border" >
                                          <View className={"filler " + this.returnColorClass(optionIndex,'background')} style={(value.score) ? { width: (value.score * 20).toString() + '%' }: { width: '0%' }} />
                                        </View>
                                      </View>
                                      <View className="fixed-column-60">
                                        <Text className={"full-width right-text " + this.returnColorClass(optionIndex,'text')}>{(value.score) ? (value.score * 20).toString() + '%' : '0%'}</Text>
                                      </View>
                                      <View className="clear" />
                                      {(optionIndex + 1 !== this.state.interests.length) && (
                                        <View className="row-10">
                                          <View style={[styles.horizontalLine]} />
                                        </View>
                                      )}
                                    </View>
                                  )}
                                  <View className="clear" />
                                </View>
                              )}

                              <View className="spacer" />

                              {(this.state.selectedBenchmark.interestsMessage) && (
                                <View className="row-10">
                                  <Text className="italicize-text">"{this.state.selectedBenchmark.interestsMessage}"</Text>
                                </View>
                              )}

                              <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Personality SA') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                              <View className="row-10">
                                <View className="float-left">
                                  <Text className="heading-text-3">Personality (Self-Assessment)</Text>
                                </View>
                                <View className="float-left left-padding">
                                  <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.personalityWeight) ? "(" + this.state.selectedBenchmark.personalityWeight + "%)" : "(0%)"}</Text>
                                </View>
                                <View className="clear" />
                                <Text className="description-text-1 description-text-color top-padding">The big five, 16 personalities, and other personality traits</Text>
                              </View>

                              {(this.state.selectedBenchmark.additionalTraits && this.state.selectedBenchmark.additionalTraits.length > 0) && (
                                <View className="row-10">
                                  {this.renderTags('additionalTraits', this.state.selectedBenchmark.additionalTraits)}
                                  <View className="clear" />
                                </View>
                              )}

                              {(this.state.selectedBenchmark.myersBriggs) && (
                                <View className="standard-border padding-30 top-margin-20">
                                  <Text className="heading-text-5">16 Personalities Results</Text>
                                  <Text className="row-5 description-text-2">16 personalities / myers briggs is a popular way for career counselors to distinguish how people have different personalities. Learn more <Text style={[styles.standardText,styles.ctaColor,styles.boldText]} onPress={() => Linking.openURL("https://en.wikipedia.org/wiki/Myers–Briggs_Type_Indicator")}>here</Text>.</Text>
                                  <View className="spacer" />
                                  <Text className="heading-text-2 cta-color">{this.state.selectedBenchmark.myersBriggs}</Text>
                                  <View className="clear" />
                                </View>
                              )}

                              {(this.state.traits && this.state.traits.length > 0) && (
                                <View className="standard-border padding-30 top-margin-20">
                                  <Text className="heading-text-5">Big Five Results</Text>
                                  <Text className="row-5 description-text-2">The Big Five personality traits is a popular way for career counselors and psychologists to distinguish how people have different personalities. Learn more <Text style={[styles.standardText,styles.ctaColor,styles.boldText]} onPress={() => Linking.openURL("https://en.wikipedia.org/wiki/Big_Five_personality_traits")}>here</Text>.</Text>
                                  <View className="spacer" /><View className="spacer" />
                                  {this.state.traits.map((value, optionIndex) =>
                                    <View key={value}>
                                      <View className="full-width">
                                        <Text className={this.returnColorClass(optionIndex,'text')}>{value.title}</Text>
                                      </View>
                                      <View className="full-width top-padding-5">
                                        <View className="mini-spacer" />
                                        <View className="progress-bar clear-border" >
                                          <View className={"filler " + this.returnColorClass(optionIndex,'background')} style={(value.score) ? { width: (value.score * 20).toString() + '%' }: { width: '0%' }} />
                                        </View>
                                      </View>
                                      <View className="fixed-column-60">
                                        <Text className={"full-width " + this.returnColorClass(optionIndex,'text')}>{(value.score) ? (value.score * 20).toString() + '%' : '0%'}</Text>
                                      </View>
                                      <View className="clear" />
                                      {(optionIndex + 1 !== this.state.traits.length) && (
                                        <View className="row-10">
                                          <View style={[styles.horizontalLine]} />
                                        </View>
                                      )}
                                    </View>
                                  )}
                                  <View className="clear" />
                                </View>
                              )}

                              {(this.state.selectedBenchmark.personalityMessage) && (
                                <View className="row-10">
                                  <Text className="italicize-text">"{this.state.selectedBenchmark.personalityMessage}"</Text>
                                </View>
                              )}

                              <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Values SA') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                              <View className="row-10">
                                <View className="float-left">
                                  <Text className="heading-text-3">Values (Self-Assessment)</Text>
                                </View>
                                <View className="float-left left-padding">
                                  <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.valuesWeight) ? "(" + this.state.selectedBenchmark.valuesWeight + "%)" : "(0%)"}</Text>
                                </View>
                                <View className="clear" />
                                <Text className="description-text-1 description-text-color top-padding">Ranked values on who candidate gravitates towards and what their employer prefers</Text>
                                <View className="spacer" /><View className="spacer" />
                              </View>

                              {(this.state.selectedBenchmark.gravitateValues && this.state.selectedBenchmark.gravitateValues.length > 0) && (
                                <View className="row-10">
                                  <Text style={[styles.standardText]}>The ideal{(this.state.selectedBenchmark.jobFunction) && " " + this.state.selectedBenchmark.jobFunction.toLowerCase()} candidate gravitates toward people who are:</Text>
                                  {this.renderTags('gravitateValues', this.state.selectedBenchmark.gravitateValues, 5)}
                                  <View className="clear" />
                                </View>
                              )}
                              {(this.state.selectedBenchmark.employerValues && this.state.selectedBenchmark.employerValues.length > 0) && (
                                <View className="row-10">
                                  <Text style={[styles.standardText]}>The ideal{(this.state.selectedBenchmark.jobFunction) && " " + this.state.selectedBenchmark.jobFunction.toLowerCase()} candidate wants to work with employers that provide:</Text>
                                  {this.renderTags('employerValues', this.state.selectedBenchmark.employerValues, 5)}
                                  <View className="clear" />
                                </View>
                              )}

                              {(this.state.selectedBenchmark.valuesMessage) && (
                                <View className="row-10">
                                  <Text className="italicize-text">"{this.state.selectedBenchmark.valuesMessage}"</Text>
                                </View>
                              )}

                              <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Skills SA') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                              <View className="row-10">
                                <View className="float-left">
                                  <Text className="heading-text-3">Skills (Self-Assessment)</Text>
                                </View>
                                <View className="float-left left-padding">
                                  <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.skillsWeight) ? "(" + this.state.selectedBenchmark.skillsWeight + "%)" : "(0%)"}</Text>
                                </View>
                                <View className="clear" />
                                <Text className="description-text-1 description-text-color top-padding">The top skills that matter</Text>
                                <View className="spacer" />
                              </View>

                              <View className="row-10">
                                <View className="container-left">
                                  {((this.state.selectedBenchmark.highPriorityHardSkills && this.state.selectedBenchmark.highPriorityHardSkills.length > 0) || (this.state.selectedBenchmark.lowPriorityHardSkills && this.state.selectedBenchmark.lowPriorityHardSkills.length > 0)) && (
                                    <View className="row-10">
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
                                      <View className="clear" />
                                    </View>
                                  )}
                                </View>
                                <View className="container-right">
                                  {((this.state.selectedBenchmark.highPrioritySoftSkills && this.state.selectedBenchmark.highPrioritySoftSkills.length > 0) || (this.state.selectedBenchmark.lowPrioritySoftSkills && this.state.selectedBenchmark.lowPrioritySoftSkills.length > 0)) && (
                                    <View className="row-10">
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
                                      <View className="clear" />
                                    </View>
                                  )}
                                </View>
                                <View className="clear" />
                              </View>

                              {(this.state.selectedBenchmark.skillCourses && this.state.selectedBenchmark.skillCourses.length > 0) && (
                                <View className="row-10">
                                  <Text className="bold-text">Suggested Courses: </Text>

                                  {this.state.selectedBenchmark.skillCourses.map((value, optionIndex) =>
                                    <View key={value} className="right-padding">
                                      <Text onPress={() => Linking.openURL(value.url)} style={[styles.standardText]}>{value.name}</Text>
                                      {(optionIndex + 1 !== this.state.selectedBenchmark.skillCourses.length) && (
                                        <Text style={[styles.standardText]}>,</Text>
                                      )}
                                    </View>
                                  )}
                                </View>
                              )}

                              {(this.state.selectedBenchmark.skillCertifications && this.state.selectedBenchmark.skillCertifications.length > 0) && (
                                <View className="row-10">
                                  <Text className="bold-text">Suggested Certifications / Badges: </Text>

                                  {this.state.selectedBenchmark.skillCertifications.map((value, optionIndex) =>
                                    <View key={value} className="right-padding">
                                      <Text onPress={() => Linking.openURL(value.url)} style={[styles.standardText]}>{value.name}</Text>
                                      {(optionIndex + 1 !== this.state.selectedBenchmark.skillCertifications.length) && (
                                        <Text style={[styles.standardText]}>,</Text>
                                      )}
                                    </View>
                                  )}
                                </View>
                              )}

                              {(this.state.selectedBenchmark.skillsMessage) && (
                                <View className="row-10">
                                  <Text className="italicize-text">"{this.state.selectedBenchmark.skillsMessage}"</Text>
                                </View>
                              )}

                              <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Education') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                                <View className="row-10">
                                  <View className="float-left">
                                    <Text className="heading-text-3">Education</Text>
                                  </View>
                                  <View className="float-left left-padding">
                                    <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.educationWeight) ? "(" + this.state.selectedBenchmark.educationWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                  <View className="clear" />
                                  <Text className="description-text-1 description-text-color top-padding">The educational components that matter</Text>

                                </View>

                                {(this.state.knowledge && this.state.knowledge.length > 0) ? (
                                  <View className="row-10">
                                    {this.renderTags('knowledge', this.state.knowledge)}
                                    <View className="clear" />
                                  </View>
                                ) : (
                                  <View />
                                )}

                                <View className="spacer"/>

                                {(this.state.selectedBenchmark.degreeRequirements) ? (
                                  <View className="row-10">
                                    <Text style={[styles.standardText]}><Text className="bold-text">Degree Requirements:</Text> {this.state.selectedBenchmark.degreeRequirements}</Text>
                                  </View>
                                ) : (
                                  <View />
                                )}

                                {(this.state.selectedBenchmark.idealMajors && this.state.selectedBenchmark.idealMajors.length > 0) ? (
                                  <View className="row-10">
                                    <Text style={[styles.standardText]}><Text className="bold-text">Ideal Majors:</Text> {this.state.selectedBenchmark.idealMajors.toString().replace(/,/g,", ")}</Text>
                                  </View>
                                ) : (
                                  <View />
                                )}

                                {(this.state.selectedBenchmark.gpaRange && this.state.selectedBenchmark.gpaRange !== '') ? (
                                  <View className="row-10">
                                    <Text style={[styles.standardText]}><Text className="bold-text">GPA Range:</Text> {this.state.selectedBenchmark.gpaRange}</Text>
                                  </View>
                                ) : (
                                  <View />
                                )}

                                {(this.state.selectedBenchmark.gradYearRange && this.state.selectedBenchmark.gradYearRange !== '') ? (
                                  <View className="row-10">
                                    <Text style={[styles.standardText]}><Text className="bold-text">Grad Year Range:</Text> {this.state.selectedBenchmark.gradYearRange}</Text>
                                  </View>
                                ) : (
                                  <View />
                                )}

                                {(this.state.selectedBenchmark.testScores && this.state.selectedBenchmark.testScores !== '') ? (
                                  <View className="row-10">
                                    <Text style={[styles.standardText]}><Text className="bold-text">Standardized Test Scores:</Text> {this.state.selectedBenchmark.testScores}</Text>
                                  </View>
                                ) : (
                                  <View />
                                )}

                                {(this.state.selectedBenchmark.courseHours && this.state.selectedBenchmark.courseHours !== '') ? (
                                  <View className="row-10">
                                    <Text style={[styles.standardText]}><Text className="bold-text">Hours of Relevant Coursework Completed:</Text> {this.state.selectedBenchmark.courseHours}</Text>
                                  </View>
                                ) : (
                                  <View />
                                )}

                                {(this.state.selectedBenchmark.courses && this.state.selectedBenchmark.courses.length > 0) ? (
                                  <View className="row-10">
                                    <Text className="bold-text">Suggested Courses: </Text>

                                    {this.state.selectedBenchmark.courses.map((value, optionIndex) =>
                                      <View key={value} className="right-padding">
                                        <Text onPress={() => Linking.openURL(value.url)} style={[styles.standardText]}>{value.name}</Text>
                                        {(optionIndex + 1 !== this.state.selectedBenchmark.courses.length) && (
                                          <Text style={[styles.standardText]}>,</Text>
                                        )}
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View />
                                )}

                                {(this.state.selectedBenchmark.certifications && this.state.selectedBenchmark.certifications.length > 0) ? (
                                  <View className="row-10">
                                    <Text className="bold-text">Suggested Certifications / Badges: </Text>

                                    {this.state.selectedBenchmark.certifications.map((value, optionIndex) =>
                                      <View key={value} className="right-padding">
                                        <Text onPress={() => Linking.openURL(value.url)} style={[styles.standardText]}>{value.name}</Text>
                                        {(optionIndex + 1 !== this.state.selectedBenchmark.certifications.length) && (
                                          <Text style={[styles.standardText]}>,</Text>
                                        )}
                                      </View>
                                    )}
                                  </View>
                                ) : (
                                  <View />
                                )}

                                <View className="spacer"/>

                                {(this.state.selectedBenchmark.educationMessage) ? (
                                  <View className="row-10">
                                    <Text className="italicize-text">"{this.state.selectedBenchmark.educationMessage}"</Text>
                                  </View>
                                ) : (
                                  <View />
                                )}

                                <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Endorsements') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                              <View className="row-10">
                                <View className="float-left">
                                  <Text className="heading-text-3">Endorsements</Text>
                                </View>
                                <View className="float-left left-padding">
                                  <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.endorsementWeight) ? "(" + this.state.selectedBenchmark.endorsementWeight + "%)" : "(0%)"}</Text>
                                </View>
                                <View className="clear" />
                                <Text className="description-text-1 description-text-color top-padding">Importance of 3rd party skill and knowledge endorsements</Text>
                              </View>

                              {(this.state.selectedBenchmark.endorsementsMessage) && (
                                <View className="row-10">
                                  <Text className="italicize-text">"{this.state.selectedBenchmark.endorsementsMessage}"</Text>
                                </View>
                              )}

                              <View className="row-10">
                                <TouchableOpacity onPress={() => this.prepareEndorsement()}><Text style={[styles.ctaColor,styles.underlineText,styles.offsetUnderline]}>See Example Endorsement</Text></TouchableOpacity>
                              </View>

                              <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Projects') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                              <View className="row-10">
                                <View className="float-left">
                                  <Text className="heading-text-3">Projects</Text>
                                </View>
                                <View className="float-left left-padding">
                                  <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.projectWeight) ? "(" + this.state.selectedBenchmark.projectWeight + "%)" : "(0%)"}</Text>
                                </View>
                                <View className="clear" />
                                <Text className="description-text-1 description-text-color top-padding">Importance of relevant projects, and what type of project work</Text>
                              </View>

                              {(this.state.projectTags && this.state.projectTags.length > 0) && (
                                <View className="row-10">
                                  {this.renderTags('projectTags', this.state.projectTags)}
                                  <View className="clear" />
                                </View>
                              )}

                              {(this.state.selectedBenchmark.projectHours && this.state.selectedBenchmark.projectHours !== '') && (
                                <View className="row-10">
                                  <Text style={[styles.standardText]}><Text className="bold-text">Recommended Invested Hours:</Text> {this.state.selectedBenchmark.projectHours}</Text>
                                </View>
                              )}

                              {(this.state.selectedBenchmark.exampleProjects && this.state.selectedBenchmark.exampleProjects.length > 0) && (
                                <View className="row-10">
                                  <Text className="bold-text">Example Impressive Projects: </Text>

                                  {this.state.selectedBenchmark.exampleProjects.map((value, optionIndex) =>
                                    <View key={value} className="right-padding">
                                      <Text onPress={() => Linking.openURL(value.url)} style={[styles.standardText]}>{value.name}</Text>
                                      {(optionIndex + 1 !== this.state.selectedBenchmark.exampleProjects.length) && (
                                        <Text style={[styles.standardText]}>,</Text>
                                      )}
                                    </View>
                                  )}
                                </View>
                              )}

                              {(this.state.selectedBenchmark.projectsMessage) && (
                                <View className="row-10">
                                  <Text className="italicize-text">"{this.state.selectedBenchmark.projectsMessage}"</Text>
                                </View>
                              )}

                              <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Experience') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                                <View className="row-10">
                                  <View className="float-left">
                                    <Text className="heading-text-3">Experience</Text>
                                  </View>
                                  <View className="float-left left-padding">
                                    <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.experienceWeight) ? "(" + this.state.selectedBenchmark.experienceWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                  <View className="clear" />
                                  <Text className="description-text-1 description-text-color top-padding">Importance of relevant experience, and what type of experience</Text>
                                </View>

                                {(this.state.selectedBenchmark.experienceMessage) && (
                                  <View className="row-10">
                                    <Text className="italicize-text">"{this.state.selectedBenchmark.experienceMessage}"</Text>
                                  </View>
                                )}

                                <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Resume') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                                <View className="row-10">
                                  <View className="float-left">
                                    <Text className="heading-text-3">Resume</Text>
                                  </View>
                                  <View className="float-left left-padding">
                                    <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.resumeWeight) ? "(" + this.state.selectedBenchmark.resumeWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                  <View className="clear" />
                                  <Text className="description-text-1 description-text-color top-padding">What matters on the ideal candidate's resume</Text>
                                </View>

                                {(this.state.selectedBenchmark.resumeMessage) && (
                                  <View className="row-10">
                                    <Text className="italicize-text">"{this.state.selectedBenchmark.resumeMessage}"</Text>
                                  </View>
                                )}

                                <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Cover Letter') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                                <View className="row-10">
                                  <View className="float-left">
                                    <Text className="heading-text-3">Cover Letter</Text>
                                  </View>
                                  <View className="float-left left-padding">
                                    <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.coverLetterWeight) ? "(" + this.state.selectedBenchmark.coverLetterWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                  <View className="clear" />
                                  <Text className="description-text-1 description-text-color top-padding">What matters on the ideal candidate's cover letter</Text>
                                </View>

                                {(this.state.selectedBenchmark.coverLetterMessage) && (
                                  <View className="row-10">
                                    <Text className="italicize-text">"{this.state.selectedBenchmark.coverLetterMessage}"</Text>
                                  </View>
                                )}

                                <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Interview') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                                <View className="row-10">
                                  <View className="float-left">
                                    <Text className="heading-text-3">Interview</Text>
                                  </View>
                                  <View className="float-left left-padding">
                                    <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.interviewWeight) ? "(" + this.state.selectedBenchmark.interviewWeight + "%)" : "(0%)"}</Text>
                                  </View>
                                  <View className="clear" />
                                  <Text className="description-text-1 description-text-color top-padding">What matters in the ideal candidate's interview</Text>
                                </View>

                                <View className="spacer"/>

                                {(this.state.selectedBenchmark.interviewRubric && this.state.selectedBenchmark.interviewRubric.length > 0) && (
                                  <View className="row-20">
                                    <Text className="heading-text-5">Interview Rubric</Text>
                                    <View className="spacer"/>

                                    <View className="standard-border">
                                      <View className="bold-text standard-border-bottom ">
                                        <View className="relative-column-33 padding-20">
                                          <Text style={[styles.standardText]}>Criteria</Text>
                                        </View>
                                        <View className="relative-column-33 padding-20">
                                          <Text style={[styles.standardText]}>Sample Questions</Text>
                                        </View>
                                        <View className="relative-column-33 padding-20">
                                          <Text style={[styles.standardText]}>Qualities of Great Scores</Text>
                                        </View>
                                        <View className="clear" />
                                      </View>

                                      {this.state.selectedBenchmark.interviewRubric.map((value, optionIndex) =>
                                        <View key={value}>
                                          <View className="standard-border-bottom">
                                            <View className="relative-column-33 padding-20">
                                              <Text className="bold-text">{optionIndex + 1}. {value.criterion}</Text>
                                            </View>
                                            <View className="relative-column-33 padding-20">
                                              {value.questions.map((value2, optionIndex2) =>
                                                <View>
                                                  <Text style={[styles.standardText]}>{value2}</Text>
                                                </View>
                                              )}
                                            </View>
                                            <View className="relative-column-33 padding-20">
                                              {value.answers.map((value2, optionIndex2) =>
                                                <View>
                                                  <Text style={[styles.standardText]}>{value2}</Text>
                                                </View>
                                              )}
                                            </View>
                                            <View className="clear" />
                                          </View>
                                        </View>
                                      )}
                                    </View>

                                  </View>
                                )}

                                {(this.state.selectedBenchmark.interviewMessage) && (
                                  <View className="row-10">
                                    <Text className="italicize-text">"{this.state.selectedBenchmark.interviewMessage}"</Text>
                                  </View>
                                )}

                                <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            {(this.state.subNavSelected === 'All' || this.state.subNavSelected === 'Diversity') && (
                              <View className="card-clear-padding slightly-rounded-corners width-94-percent max-width-1400 center-horizontally padding-40 top-margin-40">
                              <View className="row-10">
                                <View className="float-left">
                                  <Text className="heading-text-3">Diversity</Text>
                                </View>
                                <View className="float-left left-padding">
                                  <Text className="heading-text-3 cta-color bold-text">{(this.state.selectedBenchmark.adversityScoreWeight) ? "(" + this.state.selectedBenchmark.adversityScoreWeight + "%)" : "(0%)"}</Text>
                                </View>
                                <View className="clear" />
                                <Text className="description-text-1 description-text-color top-padding">What valuable diverse candidates look like to us</Text>
                              </View>

                              {(this.state.selectedBenchmark.adversityScoreMessage) && (
                                <View className="row-10">
                                  <Text className="italicize-text">"{this.state.selectedBenchmark.adversityScoreMessage}"</Text>
                                </View>
                              )}

                              <View className="spacer"/><View className="spacer"/><View className="half-spacer"/>

                              </View>
                            )}

                            <View className="spacer"/><View className="spacer"/><View className="spacer"/>

                          </View>
                        )}
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
        </ScrollView>

    )
  }

}

export default BenchmarkDetails;
