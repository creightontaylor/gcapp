import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

 const searchIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/search-icon.png';
 const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png';
 const skillsIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/skills-icon.png';
 const experienceIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/experience-icon.png';
 const profileIconDark = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-dark.png';

 import SubEndorsementDetails from '../common/EndorsementDetails';

class RequestEndorsements extends Component {
  constructor(props) {
    super(props)
    this.state = {
      enableRequestEndorsement: 'No',

      goalType: { name: ''},

      goalTypeOptions: [],
      recipients: [],

      recipientFirstName: '',
      recipientLastName: '',
      recipientEmail: '',

      relationship: '',

      pathwayOptions: [{value: 'Custom'}],
      skillTypeOptions: ['','Hard Skill','Soft Skill'],
      yesOrNoOptions: ['Yes or No','Yes','No'],
      hoursOptions: ['0 - 20 Hours','20 - 100 Hours','100 - 1,000 Hours','1,000 - 5,000 Hours',
      '5,000 - 10,000 Hours','10,000 Hours+'],

      selectedPathway: 'Custom',
      skillTraits: [],
      examples: [{ skillTrait: 'Select a Skill', example: '' }],
      competencies: [],

      skillOptions: [],
      traitOptions: [],

      checked: [],
      exampleChecked: [],

      favorites: [],
      favoritedCareers: [],
      favoritedCareerDetails: [],
      favoritedOpportunities: [],
      favoritedOpportunityDetails: [],

      hasStudied: 'No',
      hoursStudied: '0 - 20 Hours',
      hasWorked: 'No',
      hoursWorked: '0 - 20 Hours',
      hasManaged: 'No',
      hoursManaged: '0 - 20 Hours',
      hasTaught: 'No',
      hoursTaught: '0 - 20 Hours',

      showDelete: false,

      successMessage: '',
      errorMessage: ''
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this)
    this.sendInvite = this.sendInvite.bind(this)

    this.renderSkills = this.renderSkills.bind(this)
    this.renderTraits = this.renderTraits.bind(this)
    this.renderExamples = this.renderExamples.bind(this)

    this.addSkillTrait = this.addSkillTrait.bind(this)

    this.addExample = this.addExample.bind(this)
    this.removeSkillTraits = this.removeSkillTraits.bind(this)
    this.removeExample = this.removeExample.bind(this)

    this.skillTraitClicked = this.skillTraitClicked.bind(this)
    this.searchItemClicked = this.searchItemClicked.bind(this)
    this.searchSkillTraits = this.searchSkillTraits.bind(this)

    this.favoriteItem = this.favoriteItem.bind(this)
    this.addCompetencies = this.addCompetencies.bind(this)
    this.addItem = this.addItem.bind(this)
    this.removeTag = this.removeTag.bind(this)
    this.renderTags = this.renderTags.bind(this)
    this.prepareExampleEndorsement = this.prepareExampleEndorsement.bind(this)
    this.closeModal = this.closeModal.bind(this)

  }

  componentDidMount() {
    console.log('endorsements component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ', this.props.activeOrg, prevProps)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      console.log('this is causing the error')
      const emailId = await AsyncStorage.getItem('email')
      const email = emailId
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
        console.log('what is the email of this user', emailId);

        let skillTraits = []
        let checked = []

        const senderFirstName = cuFirstName
        const senderLastName = cuLastName
        const senderEmail = email

        let placementAgency = false
        if (activeOrg === 'bixel' || activeOrg === 'tip' || activeOrg === 'exp' || activeOrg === 'c2c' || activeOrg === 'unite-la') {
          placementAgency = true
        }

        let goalTypeOptions = [
          { name: ''},
          { name: 'Career', description: 'Land a job within a career path (Career)'},
          { name: 'Opportunity', description: 'Get hired for a specific opportunity (Opportunity)'},
        ]

        let enableRequestEndorsement = this.state.enableRequestEndorsement
        if (this.props.enableRequestEndorsement) {
          enableRequestEndorsement = this.props.enableRequestEndorsement
        }

        this.setState({ skillTraits, checked, email, emailId: email, username,
        cuFirstName, cuLastName, activeOrg, senderFirstName, senderLastName, senderEmail, enableRequestEndorsement,
        placementAgency, orgFocus, pathway, goalTypeOptions })

        Axios.get('/api/favorites', { params: { emailId: email } })
       .then((response) => {
         console.log('Favorites query attempted', response.data);

         if (response.data.success) {
           console.log('successfully retrieved favorites')

           const favorites = response.data.favorites

           if (favorites && favorites.length > 0) {
             Axios.get('/api/favorites/detail', { params: { favorites, orgCode: activeOrg } })
             .then((response2) => {
               console.log('Favorites detail query attempted', response2.data);

               if (response2.data.success) {
                 console.log('successfully retrieved favorites detail', response2.data.favorites)

                 let favoritedCareers = []
                 let favoritedCareerDetails = []
                 let favoritedOpportunities = []
                 let favoritedOpportunityDetails = []
                 let oppAlreadyFavorited = false

                 for (let i = 1; i <= response.data.favorites.length; i++) {
                   if (response2.data.types[i - 1] && response2.data.types[i - 1] === 'career') {
                     favoritedCareers.push(response2.data.favorites[i - 1].name)
                     favoritedCareerDetails.push(response2.data.favorites[i - 1])
                   } else if (response2.data.types[i - 1] && response2.data.types[i - 1] === 'work') {
                     if (response2.data.favorites[i - 1].postType !== 'Event') {
                       if (response2.data.favorites[i - 1].title && response2.data.favorites[i - 1].title !== '') {
                         favoritedOpportunities.push(response2.data.favorites[i - 1].title)
                       } else {
                         favoritedOpportunities.push(response2.data.favorites[i - 1].name)
                       }

                       favoritedOpportunityDetails.push(response2.data.favorites[i - 1])
                     }

                     if (this.props.selectedOpportunity && this.props.selectedOpportunity._id === response2.data.favorites[i - 1]._id) {
                       oppAlreadyFavorited = true
                     }
                   }
                 }

                 let goalType = this.state.goalType
                 if (this.props.selectedOpportunity) {
                   if (!oppAlreadyFavorited) {
                     this.favoriteItem(this.props.selectedOpportunity,'opportunity')
                   }

                   goalType = { name: 'Opportunity', description: 'Get hired for a specific opportunity (Opportunity)'}
                   pathway = "Custom"
                   this.addCompetencies(this.props.selectedOpportunity,'opportunity')
                 }

                 // console.log('faveOpps 2: ', favoritedOpportunities)
                 //query info on those favorites
                 this.setState({ favorites, favoritedCareers, favoritedCareerDetails, favoritedOpportunities, favoritedOpportunityDetails,
                   goalType, pathway
                 })

               } else {
                 console.log('no favorites detail data found', response2.data.message)
               }

             }).catch((error) => {
                 console.log('Favorites detail query did not work', error);
             });
           }

         } else {
           console.log('no favorites data found', response.data.message)
         }

       }).catch((error) => {
           console.log('Favorites query did not work', error);
       });

        Axios.get('/api/org', { params: { orgCode: activeOrg } })
        .then((response) => {
          console.log('Org info query attempted', response.data);

            if (response.data.success) {
              console.log('org info query worked')

              const orgName = response.data.orgInfo.orgName
              const orgProgramName = response.data.orgInfo.orgProgramName
              const orgFocus = response.data.orgInfo.orgFocus
              const orgContactEmail = response.data.orgInfo.contactEmail
              const orgURL = response.data.orgInfo.orgURL

              this.setState({ orgName, orgProgramName, orgFocus, orgContactEmail, orgURL });

            } else {
              console.log('org info query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Org info query did not work for some reason', error);
        });

        let orgCode = 'general'
        if (activeOrg === 'c2c' || activeOrg === 'dpscd') {
          orgCode = activeOrg
        }

        Axios.get('/api/benchmarks', { params: { orgCode } })
        .then((response) => {

          if (response.data.success) {
            console.log('Benchmark query worked', response.data);

            let pathwayOptions = [{value: 'Custom', skillTraits: []}]
            let values = []

            for (let i = 1; i <= response.data.benchmarks.length; i++) {

              if (activeOrg === 'dpscd') {
                if (response.data.benchmarks[i - 1].pathway === pathway) {

                  let skillTraits = response.data.benchmarks[i - 1].skills

                  let skillTraitsObject = []

                  for (let j = 1; j <= skillTraits.length; j++) {
                    if (skillTraits[j - 1].title && skillTraits[j - 1].skillType) {
                      const name = skillTraits[j - 1].title
                      const skillType = skillTraits[j - 1].skillType
                      skillTraitsObject.push({ name, skillType })
                    } else {
                      const name = skillTraits[j - 1].title
                      const skillType = 'Trait'
                      console.log('no good: ', name)
                      skillTraitsObject.push({ name, skillType})
                    }
                  }

                  let competencies = []
                  if (response.data.benchmarks[i - 1].skills && response.data.benchmarks[i - 1].skills.length > 0) {
                    for (let j = 1; j <= response.data.benchmarks[i - 1].skills.length; j++) {
                      if (response.data.benchmarks[i - 1].skills[i - 1]) {
                        const name = response.data.benchmarks[i - 1].skills[j - 1].title
                        const category = response.data.benchmarks[i - 1].skills[j - 1].skillType
                        competencies.push({ name, category })
                      }
                    }
                  }

                  if (response.data.benchmarks[i - 1].abilities && response.data.benchmarks[i - 1].abilities.length > 0) {
                    for (let j = 1; j <= response.data.benchmarks[i - 1].abilities.length; j++) {
                      if (response.data.benchmarks[i - 1].abilities[i - 1]) {
                        const name = response.data.benchmarks[i - 1].abilities[j - 1].title
                        const category = "Ability"
                        competencies.push({ name, category })
                      }
                    }
                  }
                  if (response.data.benchmarks[i - 1].knowledge && response.data.benchmarks[i - 1].knowledge.length > 0) {
                    for (let j = 1; j <= response.data.benchmarks[i - 1].knowledge.length; j++) {
                      if (response.data.benchmarks[i - 1].knowledge[i - 1]) {
                        const name = response.data.benchmarks[i - 1].knowledge[j - 1].title
                        const category = "Knowledge"
                        competencies.push({ name, category })
                      }
                    }
                  }

                  this.setState({ skillTraits: skillTraitsObject, competencies })
                }
              } else {

                let value = response.data.benchmarks[i - 1].jobFunction
                console.log('show the value 1: ', value)
                if (!values.includes(value)) {
                  values.push(value)
                  console.log('show the value 2: ', value)
                  let skillTraits = response.data.benchmarks[i - 1].skills

                  let skillTraitsObject = []

                  for (let j = 1; j <= skillTraits.length; j++) {
                    if (skillTraits[j - 1].title && skillTraits[j - 1].skillType) {
                      const name = skillTraits[j - 1].title
                      const skillType = skillTraits[j - 1].skillType
                      skillTraitsObject.push({ name, skillType })
                    } else {
                      const name = skillTraits[j - 1].title
                      const skillType = 'Trait'
                      console.log('no good: ', name)
                      skillTraitsObject.push({ name, skillType})
                    }
                  }

                  let competencies = []
                  if (response.data.benchmarks[i - 1].skills && response.data.benchmarks[i - 1].skills.length > 0) {
                    for (let j = 1; j <= response.data.benchmarks[i - 1].skills.length; j++) {
                      if (response.data.benchmarks[i - 1].skills[j - 1]) {
                        const name = response.data.benchmarks[i - 1].skills[j - 1].title
                        const category = response.data.benchmarks[i - 1].skills[j - 1].skillType
                        competencies.push({ name, category })
                      }
                    }
                  }

                  if (response.data.benchmarks[i - 1].abilities && response.data.benchmarks[i - 1].abilities.length > 0) {
                    for (let j = 1; j <= response.data.benchmarks[i - 1].abilities.length; j++) {
                      if (response.data.benchmarks[i - 1].abilities[i - 1]) {
                        const name = response.data.benchmarks[i - 1].abilities[j - 1].title
                        const category = "Ability"
                        competencies.push({ name, category })
                      }
                    }
                  }
                  if (response.data.benchmarks[i - 1].knowledge && response.data.benchmarks[i - 1].knowledge.length > 0) {
                    for (let j = 1; j <= response.data.benchmarks[i - 1].knowledge.length; j++) {
                      if (response.data.benchmarks[i - 1].knowledge[i - 1]) {
                        const name = response.data.benchmarks[i - 1].knowledge[j - 1].title
                        const category = "Knowledge"
                        competencies.push({ name, category })
                      }
                    }
                  }
                  console.log('show lol: ', skillTraitsObject, competencies)
                  pathwayOptions.push({ value, skillTraits: skillTraitsObject, competencies })
                } else {


                }
                console.log('show pathwayOptions: ', pathwayOptions)

              }
            }

            this.setState({ pathwayOptions })
          } else {
            console.log('no benchmarks found', response.data.message)

          }

        }).catch((error) => {
            console.log('Benchmark query did not work', error);
        });

        Axios.get('/api/users/profile/details', { params: { email } })
        .then((response) => {
          console.log('Profile query attempted', response.data);

           if (response.data.success) {
             console.log('successfully retrieved profile information')

             if (response.data.user.remoteAuth) {
               let controlledRequest = true
               this.setState({ controlledRequest })
             }

           } else {
             console.log('no profile data found, recipient external', response.data.message)
             this.sendInvite(false)
           }

        }).catch((error) => {
           console.log('There was an error retrieving data, recipient is external', error);
           this.sendInvite(false)
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler(event) {

    if (event.target.name === 'anonymousCheckmark') {
      const value = event.target.type === 'checkbox' ? event.target.checked : event.target.value;
      this.setState({ isAnonymousContribution: value });
    } else if (event.target.name === 'firstName') {
      this.setState({ recipientFirstName: event.target.value })
    } else if (event.target.name === 'lastName') {
      this.setState({ recipientLastName: event.target.value })
    } else if (event.target.name === 'email') {
      this.setState({ recipientEmail: event.target.value })
    } else if (event.target.name === 'relationship') {
      this.setState({ relationship: event.target.value })
    } else if (event.target.name === 'senderFirstName') {
      this.setState({ senderFirstName: event.target.value })
    } else if (event.target.name === 'senderLastName') {
      this.setState({ senderLastName: event.target.value })
    } else if (event.target.name === 'senderEmail') {
      this.setState({ senderEmail: event.target.value })
    } else if (event.target.name === 'pathway') {
      let selectedPathway = event.target.value

      let skillTraits = []
      let competencies = []

      for (let i = 1; i <= this.state.pathwayOptions.length; i++) {
        if (this.state.pathwayOptions[i - 1].value === selectedPathway) {
          skillTraits = this.state.pathwayOptions[i - 1].skillTraits
          competencies = this.state.pathwayOptions[i - 1].competencies
        }
      }

      let checked = []
      if (skillTraits.length !== 0) {
        for (let i = 1; i <= skillTraits.length; i++) {
          checked.push(false)
        }
      }
      if (competencies.length !== 0) {
        for (let i = 1; i <= competencies.length; i++) {
          checked.push(false)
        }
      }

      this.setState({ selectedPathway, skillTraits, competencies, checked })

    } else if (event.target.name.includes('skillName')) {
      console.log('show me what were working with', this.state.skillTraits)
      let skillTraits = this.state.skillTraits
      const nameArray = event.target.name.split("|")
      const index = Number(nameArray[1]) - 1

      const name = event.target.value
      const skillType = skillTraits[index].skillType
      const rating = skillTraits[index].rating
      skillTraits[index] = { name, skillType, rating }
      this.setState({ skillTraits })

      if (skillType !== 'Trait') {
        this.searchSkillTraits(event.target.value, skillTraits[index].skillType, index)
      }

    } else if (event.target.name.includes('skillType')) {
      let skillTraits = this.state.skillTraits
      const nameArray = event.target.name.split("|")
      const index = Number(nameArray[1]) - 1
      skillTraits[index] = { name: skillTraits[index].name, skillType: event.target.value, rating: skillTraits[index].rating }
      this.setState({ skillTraits })
    } else if (event.target.name.includes('skillRating')) {
      let skillTraits = this.state.skillTraits
      const nameArray = event.target.name.split("|")
      const index = Number(nameArray[1]) - 1
      skillTraits[index]['rating'] = event.target.value
      this.setState({ skillTraits })
    } else if (event.target.name.includes('exampleSkillTrait')) {
      let examples = this.state.examples
      const nameArray = event.target.name.split("|")
      const index = Number(nameArray[1]) - 1
      examples[index] = { skillTrait: event.target.value, example: examples[index].example }
      this.setState({ examples })
    } else if (event.target.name.includes('exampleExample')) {
      let examples = this.state.examples
      const nameArray = event.target.name.split("|")
      const index = Number(nameArray[1]) - 1
      examples[index] = { skillTrait: examples[index].skillTrait, example: event.target.value }
      this.setState({ examples })
    } else if (event.target.name === 'goalType') {
      let goalType = { name: '' }
      for (let i = 1; i <= this.state.goalTypeOptions.length; i++) {
        if (this.state.goalTypeOptions[i - 1].description === event.target.value) {
          goalType = this.state.goalTypeOptions[i - 1]
        }
      }
      let pathway = this.state.pathway
      if (goalType.name !== 'Career') {
        pathway = 'Custom'
      }
      this.setState({ goalType, pathway })
    } else if (event.target.name === 'searchCareers') {
      this.searchItems(event.target.value, 'career')
    } else if (event.target.name === 'searchOpportunities') {
      this.searchItems(event.target.value, 'opportunity')
    } else if (event.target.name === 'searchCompetencies') {
      this.searchItems(event.target.value, 'competency')
    } else if (event.target.name === 'searchMembers') {
      this.searchItems(event.target.value, 'member')
    } else {
      this.setState({ [event.target.name]: event.target.value })
    }
  }

  searchItems(searchString, type) {
    console.log('searchItems called', searchString, type)

    if (type === 'career') {
      if (!searchString || searchString === '') {
        this.setState({ searchString, searchIsAnimating: false, careerOptions: null })
      } else {
        this.setState({ searchString, searchIsAnimating: true })

        const search = true

        const self = this
        function officiallyFilter() {
          console.log('officiallyFilter called')

          const excludeMissingOutlookData = true
          const excludeMissingJobZone = true

          Axios.put('/api/careers/search', {  searchString, search, excludeMissingOutlookData, excludeMissingJobZone })
          .then((response) => {
            console.log('Careers query attempted', response.data);

              if (response.data.success) {
                console.log('successfully retrieved careers')

                if (response.data) {

                  let careerOptions = []
                  if (response.data.careers && response.data.careers.length > 0) {
                    careerOptions = response.data.careers
                  }

                  self.setState({ careerOptions, searchIsAnimating: false })
                }

              } else {
                console.log('no career data found', response.data.message)
                self.setState({ searchIsAnimating: false })
              }

          }).catch((error) => {
              console.log('Career query did not work', error);
              self.setState({ searchIsAnimating: false })
          });
        }

        const delayFilter = () => {
          console.log('delayFilter called: ')
          clearTimeout(self.state.timerId)
          self.state.timerId = setTimeout(officiallyFilter, 1000)
        }

        delayFilter();
      }
    } else if (type === 'opportunity') {
      if (!searchString || searchString === '') {
        this.setState({ searchStringOpportunities: searchString, searchIsAnimating: false, careerOptions: null })
      } else {
        this.setState({ searchStringOpportunities: searchString, searchIsAnimating: true })

        const self = this
        function officiallyFilter() {
          console.log('officiallyFilter called')

          const orgCode = self.state.activeOrg
          const placementPartners = self.state.placementPartners
          const accountCode = self.state.accountCode
          const search = true
          const postTypes = ['Internship','Work','Assignment','Problem','Challenge']

          // console.log('show the params: ', searchString, orgCode, placementPartners, accountCode, search, postTypes)
          Axios.get('/api/postings/search', { params: { searchString, orgCode, placementPartners, accountCode, search, postTypes } })
          .then((response) => {
            console.log('Opportunity search query attempted', response.data);

              if (response.data.success) {
                console.log('opportunity search query worked')

                let opportunityOptions = response.data.postings
                self.setState({ opportunityOptions, searchIsAnimating: false })

              } else {
                console.log('opportunity search query did not work', response.data.message)

                let opportunityOptions = []
                self.setState({ opportunityOptions, searchIsAnimating: false })

              }

          }).catch((error) => {
              console.log('Search query did not work for some reason', error);
              self.setState({ searchIsAnimating: false })
          });
        }

        const delayFilter = () => {
          console.log('delayFilter called: ')
          clearTimeout(self.state.timerId)
          self.state.timerId = setTimeout(officiallyFilter, 1000)
        }

        delayFilter();
      }
    } else if (type === 'competency') {
      if (!searchString || searchString === '') {
        this.setState({ searchStringCompetencies: searchString, searchIsAnimating: false, careerOptions: null })
      } else {
        this.setState({ searchStringCompetencies: searchString, searchIsAnimating: true })

        const search = true

        const self = this
        function officiallyFilter() {
          console.log('officiallyFilter called')

          const types = ['General Skill','Hard Skill','Soft Skill','Ability','Knowledge','Work Style']

          Axios.get('/api/competency/search', { params: { searchString, search, types } })
          .then((response) => {
            console.log('Opportunity search query attempted', response.data);

              if (response.data.success) {
                console.log('opportunity search query worked')

                let competencyOptions = response.data.competencies
                self.setState({ competencyOptions, searchIsAnimating: false })

              } else {
                console.log('opportunity search query did not work', response.data.message)

                let competencyOptions = []
                self.setState({ competencyOptions, searchIsAnimating: false })

              }

          }).catch((error) => {
              console.log('Search query did not work for some reason', error);
              self.setState({ searchIsAnimating: false })
          });
        }

        const delayFilter = () => {
          console.log('delayFilter called: ')
          clearTimeout(self.state.timerId)
          self.state.timerId = setTimeout(officiallyFilter, 1000)
        }

        delayFilter();
      }
    } else if (type === 'member') {
      if (!searchString || searchString === '') {
        this.setState({ searchStringMembers: searchString, searchIsAnimating: false, careerOptions: null })
      } else {
        this.setState({ searchStringMembers: searchString, searchIsAnimating: true })

        const self = this
        function officiallyFilter() {
          console.log('officiallyFilter called')

          const orgCode = self.state.activeOrg
          const roleNames = null
          const excludeCurrentUser = true
          const emailId = self.state.emailId

          Axios.get('/api/members/search', { params: { searchString, orgCode, roleNames, excludeCurrentUser, emailId } })
          .then((response) => {
            console.log('Opportunity search query attempted', response.data);

              if (response.data.success) {
                console.log('opportunity search query worked')

                let memberOptions = response.data.members
                self.setState({ memberOptions, searchIsAnimating: false })

              } else {
                console.log('opportunity search query did not work', response.data.message)

                let memberOptions = []
                self.setState({ memberOptions, searchIsAnimating: false })

              }

          }).catch((error) => {
              console.log('Search query did not work for some reason', error);
              self.setState({ searchIsAnimating: false })
          });
        }

        const delayFilter = () => {
          console.log('delayFilter called: ')
          clearTimeout(self.state.timerId)
          self.state.timerId = setTimeout(officiallyFilter, 1000)
        }

        delayFilter();
      }
    }
  }

  searchSkillTraits(skillTrait, type, index) {
    console.log('searchSkillTraits ', skillTrait, type, index)

    if (type === 'Trait') {
      console.log('this is an error. We are not turning on this functionality now')
    } else {
      if (skillTrait === '') {
        const skillOptions = []
        this.setState({ skillOptions })
      } else {
        Axios.get('/api/skilltrait/search', { params: { skillTrait, type } })
        .then((response) => {
          console.log('Skilltrait search query attempted', response.data);

            if (response.data.success) {
              console.log('skillTrait search query worked')

              const skillOptions = response.data.skills
              const selectedIndex = index
              this.setState({ skillOptions, selectedIndex });

            } else {
              console.log('skilltrait search query did not work', response.data.message)
            }

        }).catch((error) => {
            console.log('Employer search query did not work for some reason', error);
        });
      }
    }
  }

  handleSubmit(event) {
      console.log('handleSubmit called')

      //validate forms
      // if (!this.state.placementAgency && this.state.recipients.length === 0) {
      //   this.setState({ errorMessage: 'please add at least one recipient' })
      // } else if (this.state.placementAgency && this.state.recipientFirstName === '') {
      //   this.setState({ errorMessage: "please add the requested endorser's first name" })
      // } else if (this.state.placementAgency && this.state.recipientLastName === '') {
      //   this.setState({ errorMessage: "please add the requested endorser's last name" })
      // } else if (this.state.placementAgency && this.state.recipientEmail === '') {
      //   this.setState({ errorMessage: "please add the requested endorser's email" })
      // console.log('show relationship: ', this.state.relationship)
      if (this.state.recipientFirstName === '') {
        this.setState({ errorMessage: "please add the requested endorser's first name" })
      } else if (this.state.recipientLastName === '') {
        this.setState({ errorMessage: "please add the requested endorser's last name" })
      } else if (this.state.recipientEmail === '') {
        this.setState({ errorMessage: "please add the requested endorser's email" })
      } else if (this.state.senderFirstName === '') {
        this.setState({ errorMessage: 'please add your first name' })
      } else if (this.state.senderLastName === '') {
        this.setState({ errorMessage: 'please add your last name' })
      } else if (!this.state.relationship || this.state.relationship === '') {
        this.setState({ errorMessage: 'please add your relationship to the endorser' })
      } else if (!this.state.goalType || this.state.goalType.name === '') {
        this.setState({ errorMessage: 'please add a goal for your endorsement request' })
      } else if (this.state.competencies.length === 0) {
        this.setState({ errorMessage:'please add at least one competency'})
      } else {

          //check if invite someone who can provide an endorsement in the portal
          Axios.get('/api/users/profile/details', { params: { email: this.state.recipientEmail } })
          .then((response) => {
            console.log('Profile query attempted', response.data);

             if (response.data.success) {
               console.log('successfully retrieved profile information')

               let recipientRole = response.data.user.roleName
               if (recipientRole === 'Teacher' || recipientRole === 'Mentor' || recipientRole === 'Counselor' || recipientRole === 'Student') {
                 console.log('recipient is internal')
                 this.sendInvite(true, recipientRole)
               } else {
                 console.log('recipient is external')
                 this.sendInvite(false)
               }

             } else {
               console.log('no profile data found, recipient external', response.data.message)
               this.sendInvite(false)
             }

          }).catch((error) => {
             console.log('There was an error retrieving data, recipient is external', error);
             this.sendInvite(false)
          });
      }
  }

  sendInvite(isInternal, recipientRole) {
    console.log('sendInvite called ', isInternal, recipientRole)

    const competencies = this.state.competencies
    let skillTraits = []
    let listedCompetencies = ''
    for (let i = 1; i <= competencies.length; i++) {
      if (competencies[i - 1].name === '' || competencies[i - 1].category === '') {
        return this.setState({ errorMessage:'please add a name and category to each competency'})
      }

      skillTraits.push({ name: competencies[i - 1].name, skillType: competencies[i - 1].category})

      if (competencies.length > 2 && competencies.length === i) {
        listedCompetencies = listedCompetencies + 'and ' + competencies[i - 1].name
      } else if (competencies.length > 2) {
        listedCompetencies = listedCompetencies + competencies[i - 1].name + ', '
      } else if (competencies.length === 2) {
        if (i === competencies.length) {
          listedCompetencies = listedCompetencies + ' and ' + competencies[i - 1].name
        } else {
          listedCompetencies = competencies[i - 1].name
        }
      } else {
        listedCompetencies = competencies[i - 1].name
      }

    }

    const goalType = this.state.goalType
    const pathway = this.state.selectedPathway

    let opportunityId = null
    if (this.props.selectedOpportunity) {
      opportunityId = this.props.selectedOpportunity._id
    }

    const recipientFirstName = this.state.recipientFirstName
    const recipientLastName = this.state.recipientLastName
    const recipientEmail = this.state.recipientEmail

    // let recipientFirstName = ''
    // let recipientLastName = ''
    // let recipientEmail = ''
    //
    // if (this.state.placementAgency) {
    //   recipientFirstName = this.state.recipientFirstName
    //   recipientLastName = this.state.recipientLastName
    //   recipientEmail = this.state.recipientEmail
    // } else {
    //   recipientFirstName = this.state.recipients[0].firstName
    //   recipientLastName = this.state.recipients[0].lastName
    //   recipientEmail = this.state.recipients[0].email
    // }

    const toEmails = [recipientEmail]

    let senderFirstName = this.state.senderFirstName
    let senderLastName = this.state.senderLastName
    let senderEmail = this.state.senderEmail

    let relationship = this.state.relationship
    let invitationMessage = ''
    if (pathway === 'Custom') {

      if (this.state.activeOrg && this.state.activeOrg !== '' && this.state.orgFocus === 'Placement') {
        invitationMessage = 'I am applying through ' + this.state.orgName + ' for career / work opportunties. To further highlight my skills and knowledge, I would appreciate it if you would endorse me on the following competencies: ' + listedCompetencies
      } else {
        invitationMessage = 'Would you mind endorsing me on the following competencies: ' + listedCompetencies
      }

    } else {
      if (this.state.activeOrg && this.state.activeOrg !== '' && this.state.orgFocus === 'Placement') {
        invitationMessage = 'I am applying through ' + this.state.orgName + ' for career / work opportunties. To further highlight my skills and knowledge, I would appreciate it if you would endorse my competencies for the ' + pathway + ' pathway'
      } else {
        invitationMessage = this.state.senderFirstName + ' has requested that you endorse their competencies for the ' + pathway + ' pathway'
      }
    }

    const type = 'request'
    const orgCode = this.state.activeOrg
    const orgName = this.state.orgName
    const orgProgramName = this.state.orgProgramName
    const orgContactEmail = this.state.orgContactEmail
    const orgURL = this.state.orgURL

    let createdAt = new Date();
    let updatedAt = createdAt

    Axios.post('/api/story/request', {
      senderFirstName, senderLastName, senderEmail, toEmails, isApproved: false, isDenied: false,
      recipientFirstName, recipientLastName, relationship, orgCode, orgName, orgProgramName, isInternal, recipientRole,
      orgContactEmail, orgURL,
      invitationMessage, type, goalType, pathway, opportunityId, skillTraits, competencies, createdAt, updatedAt })
    .then((response) => {

      if (response.data.success) {
        //clear values
        this.setState({
          recipients: [],
          recipientFirstName: '',
          recipientLastName: '',
          recipientEmail: '',
          searchStringMembers: '',

          successMessage: 'Endorsement request sent successfully!',
          errorMessage: ''
        })
      } else {
        this.setState({
          successMessage: '',
          errorMessage: response.data.message,
        })
      }
    }).catch((error) => {
        console.log('endorsement send did not work', error);
    });
  }

  removeSkillTraits(index, skillTrait) {
    console.log('removeSkillTraits called')

    let skillTraits = this.state.skillTraits
    if (skillTraits[index]) {
      skillTraits.splice(index, 1)
    }

    this.setState({ skillTraits })

  }

  renderSkills() {
    console.log('renderSkills called')

    let rows = []

    for (let i = 1; i <= this.state.skillTraits.length; i++) {

      if (this.state.skillTraits[i - 1].skillType.includes('Skill')) {
        const index = i - 1

        let nameName = "skillName|" + i.toString()
        let typeName = "skillType|" + i.toString()
        // let ratingName = "skillRating|" + i.toString()

        rows.push(
          <div key={i}>
            <div>
              <div className="fixed-column-40">
                  <button className="background-button float-left" onClick={() => this.removeSkillTraits(index,'skill')}>
                    <img src={deniedIcon} alt="Compass tap icon" className="image-auto-30 float-left right-margin padding-3 top-margin-5"/>
                  </button>
               </div>
               <div className="calc-column-offset-40-of-75">
                 <input type="text" className="text-field capitalize-text" placeholder="Skill Name" name={nameName} value={this.state.skillTraits[i - 1].name} onChange={this.formChangeHandler} />
               </div>
               <div className="relative-column-1 height-20"/>
               <div className="relative-column-24">
                 <select name={typeName} value={this.state.skillTraits[i - 1].skillType} className="dropdown" onChange={this.formChangeHandler}>
                   {this.state.skillTypeOptions.map(value =>
                     <option key={value.key} value={value}>{value}</option>
                   )}
                 </select>
               </div>
               <div className="clear" />
               <div className="spacer"/>
               {(this.state.selectedIndex === index && this.state.skillOptions.length > 0) && (
                 <div className="full-width">
                   <div className="spacer"/>
                   {this.state.skillOptions.map((value, optionIndex) =>
                     <div key={value._id} className="left-text bottom-margin-5 full-width">
                       <button className="background-button" onClick={() => this.skillTraitClicked(index, optionIndex, 'skill')}>
                         <div className="horizontal-padding-50 full-width">
                           <div className="float-left right-padding top-margin">
                             <img src={skillsIcon} alt="Compass employer icon icon" className="image-auto-22" />
                           </div>
                           <div className="float-left">
                             <p className="cta-color">{value.name}</p>
                           </div>
                         </div>
                       </button>
                     </div>
                   )}
                 </div>
               )}
            </div>
          </div>
        )
      }
    }

    return rows
  }

  renderTraits() {
    console.log('renderTraits called')

    let rows = []

    for (let i = 1; i <= this.state.skillTraits.length; i++) {

      const index = i - 1

      if (this.state.skillTraits[i - 1].skillType === 'Trait') {
        // const index = i - 1

        let nameName = "skillName|" + i.toString()
        // let ratingName = "skillRating|" + i.toString()

        rows.push(
          <div key={i}>
            <div>
              <div className="fixed-column-40">
                  <button className="background-button float-left" onClick={() => this.removeSkillTraits(index,'skill')}>
                    <img src={deniedIcon} alt="Compass tap icon" className="image-auto-30 float-left right-margin padding-3 top-margin-5"/>
                  </button>
               </div>
               <div className="calc-column-offset-40">
                 <select name={nameName} value={this.state.skillTraits[i - 1].name} className="dropdown capitalize-text" onChange={this.formChangeHandler}>
                   {this.state.traitOptions.map(value =>
                     <option key={value.key} value={value}>{value}</option>
                   )}
                 </select>
               </div>
               <div className="clear" />
               <div className="spacer"/>

            </div>
          </div>
        )
      }
    }

    return rows
  }

  addSkillTrait(type) {
    console.log('add SkillTrait called')

    let skillTraits = this.state.skillTraits
    if (type === 'Trait') {
      skillTraits.push({ name: '', skillType: 'Trait', rating: '1'})
    } else {
      skillTraits.push({ name: '', skillType: 'Hard Skill', rating: '1'})
    }

    let checked = this.state.checked
    checked.push(false)
    this.setState({ skillTraits, checked })
  }

  skillTraitClicked(index, optionIndex, type) {
    console.log('skillTraitClicked', index, optionIndex, type, this.state.skillOptions)

    if (type === 'trait') {
      console.log('this is an error. This is now a dropdown.')
    } else {
      const name = this.state.skillOptions[optionIndex].name
      const skillType = this.state.skillOptions[optionIndex].type
      const rating = ''
      const skillOptions = []
      let skillTraits = this.state.skillTraits
      skillTraits[index] = { name, skillType, rating }
      this.setState({ skillTraits, skillOptions })
    }
  }

  renderExamples() {
    console.log('renderExamples called')

    let rows = []

    let skillOptions = []
    skillOptions.push("Select a Skill")
    for (let i = 1; i <= this.state.skillTraits.length; i++) {
      skillOptions.push(this.state.skillTraits[i - 1].name)
    }

    for (let i = 1; i <= this.state.examples.length; i++) {

      // const index = i - 1

      const exampleSkillTrait = "exampleSkillTrait|" + i.toString()
      const exampleExample = "exampleExample|" + i.toString()

      rows.push(
        <div key={i}>
          <select name={exampleSkillTrait} value={this.state.examples[i - 1].skillTrait} className="dropdown" onChange={this.formChangeHandler}>
            {skillOptions.map(value =>
              <option key={value.key} value={value}>{value}</option>
            )}
          </select>
          <textarea type="text" className="text-field" placeholder="Share an example where the endorsee exceptionally demonstrated this skill…." name={exampleExample}value={this.state.examples[i - 1].example} onChange={this.formChangeHandler}></textarea>
        </div>
      )
    }

    return rows
  }

  addExample() {
    console.log('addExample called')

    let examples = this.state.examples
    examples.push({ skillTrait: 'Select a Skill', example: '' })

    let checked = this.state.checked
    checked.push(false)
    this.setState({ examples, checked })
  }

  removeExample() {
    console.log('removeExample called')

    let examples = this.state.examples
    let exampleChecked = this.state.exampleChecked
    for (let i = 1; i <= examples.length; i++) {
      if (this.state.exampleChecked[ i - 1]) {
        console.log('we got in here')
        examples.splice(i - 1, 1)
        exampleChecked.splice(i - 1, 1)
        console.log('what happened to values', examples, exampleChecked)
      }
    }

    this.setState({ examples, exampleChecked, showExampleDelete: false })
  }

  searchItemClicked(passedItem, type) {
    console.log('searchItemClicked called', passedItem, type)

    if (type === 'career') {

      const searchObject = passedItem
      const searchString = passedItem.name
      const unready = false
      const careerOptions = null

      this.setState({ searchObject, searchString, unready, careerOptions })

    } else if (type === 'opportunity') {
      const searchObject = passedItem
      let searchStringOpportunities = passedItem.name
      if (passedItem.title) {
        searchStringOpportunities = passedItem.title
      }
      const unready = false
      const opportunityOptions = null
      console.log('show searchString: ', searchStringOpportunities)

      this.setState({ searchObject, searchStringOpportunities, unready, opportunityOptions })

    } else if (type === 'competency') {

      const searchObject = passedItem
      let searchStringCompetencies = passedItem.name
      if (passedItem.title) {
        searchStringCompetencies = passedItem.title
      }
      const unready = false
      const competencyOptions = null
      // console.log('show searchString: ', searchStringCompetencies, searchObject)

      this.setState({ searchObject, searchStringCompetencies, unready, competencyOptions })

    } else if (type === 'member') {

      const recipientFirstName = passedItem.firstName
      const recipientLastName = passedItem.lastName
      const recipientEmail = passedItem.email

      let searchStringMembers = passedItem.firstName + ' ' + passedItem.lastName

      const unready = false
      const memberOptions = null
      console.log('show searchString: ', searchStringMembers)

      this.setState({ recipientFirstName, recipientLastName, recipientEmail, searchStringMembers, unready, memberOptions })

    }
  }

  renderTags(type) {
    console.log('renderTags ', type, this.state.selectedCareer)

    if (type === 'career') {
      const favoritedCareers = this.state.favoritedCareers

      if (favoritedCareers && favoritedCareers.length > 0) {

        return (
          <div key={"favoritedCareers"}>
            <div className="spacer" />
            {favoritedCareers.map((value, optionIndex) =>
              <div key={"career|" + optionIndex} className="float-left">

                <div className="close-button-container-1" >
                  <button className="background-button" onClick={() => this.removeTag(optionIndex,type)}>
                    <img src={deniedIcon} alt="Compass target icon" className="image-auto-20" />
                  </button>
                </div>

                <button className="background-button float-left right-padding-5" onClick={() => this.addCompetencies(this.state.favoritedCareerDetails[optionIndex], type)}>
                  <div className="half-spacer" />
                  <div className={(this.state.selectedCareer === value) ? "tag-container-active" : "tag-container-inactive"}>
                    <p className="description-text-2">{value}</p>
                  </div>
                  <div className="half-spacer" />
                </button>

              </div>
            )}
          </div>
        )
      }
    } else if (type === 'opportunity') {
      const favoritedOpportunities = this.state.favoritedOpportunities
      if (favoritedOpportunities && favoritedOpportunities.length > 0) {
        console.log('about to in', favoritedOpportunities)
        return (
          <div key={"favoritedOpportunities"}>
            <div className="spacer" />
            {favoritedOpportunities.map((value, optionIndex) =>
              <div key={"career|" + optionIndex} className="float-left">

                <div className="close-button-container-1" >
                  <button className="background-button" onClick={() => this.removeTag(optionIndex,type)}>
                    <img src={deniedIcon} alt="Compass target icon" className="image-auto-20" />
                  </button>
                </div>
                <button className="background-button float-left right-padding-5" onClick={() => this.addCompetencies(this.state.favoritedOpportunityDetails[optionIndex], type)}>
                  <div className="half-spacer" />
                  <div className={(this.state.selectedOpportunity === value) ? "tag-container-active" : "tag-container-inactive"}>
                    <p className="description-text-2">{value}</p>
                  </div>
                  <div className="half-spacer" />
                </button>

              </div>
            )}
          </div>
        )
      }
    } else if (type === 'competency') {

      // abilities, knowledge, , soft skill, hard skil, tech skill
      const competencies = this.state.competencies

      if (competencies && competencies.length > 0) {
        console.log('compare 0')
        return (
          <div key={"competencies"}>
            <div className="spacer" />
            {competencies.map((value, optionIndex) =>
              <div key={"career|" + optionIndex} className="float-left">

                <div className="close-button-container-1" >
                  <button className="background-button" onClick={() => this.removeTag(optionIndex,type)}>
                    <img src={deniedIcon} alt="Compass target icon" className="image-auto-20" />
                  </button>
                </div>
                <div>
                  <div className="half-spacer" />
                  {(value.category === 'Ability') && (
                    <div className="tag-container-8 primary-background primary-border white-text">
                      <p className="description-text-2">{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</p>
                    </div>
                  )}
                  {(value.category === 'Knowledge') && (
                    <div className="tag-container-8 secondary-background secondary-border white-text">
                      <p className="description-text-2">{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</p>
                    </div>
                  )}
                  {(value.category === 'Soft Skill' || value.category === 'Work Style') && (
                    <div className="tag-container-8 tertiary-background tertiary-border white-text">
                      <p className="description-text-2">{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</p>
                    </div>
                  )}
                  {(value.category === 'Hard Skill' || value.category === 'Tech Skill' || value.category === 'General Skill') && (
                    <div className="tag-container-8 quaternary-background quaternary-border white-text">
                      <p className="description-text-2">{value.category}: {value.name}{(value.description) && " (" + value.description + ")"}</p>
                    </div>
                  )}

                  <div className="half-spacer" />
                </div>
                {console.log('compare 1: ',optionIndex, this.state.selectedCareer, value)}

              </div>
            )}
          </div>
        )

      } else {
        return (
          <div key={"competencies"} className="top-padding-20">
            {/*<p className="description-text-2 error-color">Specify a career path or opportunity above for learning objectives to populate.</p>*/}
          </div>
        )
      }
    }
  }

  removeTag(index, type) {
    console.log('removeTag called', index, type)

    if (type === 'career') {
      let favoritedCareers = this.state.favoritedCareers
      favoritedCareers.splice(index, 1)

      let favoritedCareerDetails = this.state.favoritedCareerDetails
      const careerToRemove = favoritedCareerDetails[index]
      favoritedCareerDetails.splice(index, 1)
      this.setState({ favoritedCareers, favoritedCareerDetails })

      // remove as favorite
      this.favoriteItem(careerToRemove, type)
    } else if (type === 'opportunity') {
      let favoritedOpportunities = this.state.favoritedOpportunities
      favoritedOpportunities.splice(index, 1)

      let favoritedOpportunityDetails = this.state.favoritedOpportunityDetails
      const opportunityToRemove = favoritedOpportunityDetails[index]
      favoritedOpportunityDetails.splice(index, 1)
      this.setState({ favoritedOpportunities, favoritedOpportunityDetails })

      // remove as favorite
      this.favoriteItem(opportunityToRemove, type)
    } else if (type === 'competency') {
      let competencies = this.state.competencies
      competencies.splice(index, 1)
      this.setState({ competencies })
    }
  }

  addItem(type) {
    console.log('optionClicked called', type)

    if (type === 'career') {
      if (this.state.favoritedCareers.includes(this.state.searchString)) {
        this.setState({ errorMessage: 'You have already added this career' })
      } else {

        const searchString = ''
        const searchObject = null
        const unready = true

        let favoritedCareers = this.state.favoritedCareers
        favoritedCareers.unshift(this.state.searchString)

        let favoritedCareerDetails = this.state.favoritedCareerDetails
        favoritedCareerDetails.unshift(this.state.searchObject)

        // const selectedCareer = this.state.searchString

        this.setState({ searchString, searchObject, unready, favoritedCareers, errorMessage: null })

        // favorite item
        this.favoriteItem(this.state.searchObject, type)
        // console.log('pre-add learning: ', this.state.searchObject)
        // populate chart
        this.addCompetencies(this.state.searchObject,type)
      }
    } else if (type === 'opportunity') {
      if (this.state.favoritedOpportunities.includes(this.state.searchStringOpportunities)) {
        this.setState({ errorMessage: 'You have already added this opportunity' })
      } else {

        const searchStringOpportunities = ''
        const searchObject = null
        const unready = true

        let favoritedOpportunities = this.state.favoritedOpportunities
        favoritedOpportunities.unshift(this.state.searchStringOpportunities)

        let favoritedOpportunityDetails = this.state.favoritedOpportunityDetails
        favoritedOpportunityDetails.unshift(this.state.searchObject)

        this.setState({ searchStringOpportunities, searchObject, unready, favoritedOpportunities, errorMessage: null })

        // favorite item
        this.favoriteItem(this.state.searchObject, type)

        // populate chart
        this.addCompetencies(this.state.searchObject,type)
      }
    } else if (type === 'competency') {
      if (this.state.competencies.some(competency => competency.name === this.state.searchStringCompetencies)) {
        this.setState({ errorMessage: 'You have already added this competency' })
      } else {

        const searchStringCompetencies = ''
        const unready = true

        let searchObject = this.state.searchObject
        let competencies = this.state.competencies
        if (this.state.searchObject && this.state.searchObject.type) {
          searchObject['category'] = searchObject.type
        }
        competencies.push(searchObject)

        searchObject = null

        console.log('show object: ', this.state.searchObject)

        this.setState({ searchStringCompetencies, searchObject, competencies, unready, errorMessage: null })


        // populate chart
        // this.addCompetencies(this.state.searchObject,type)
      }

    }
  }

  addCompetencies(selectedItem, type, subType) {
    console.log('addCompetencies called', selectedItem, type)

    if (type === 'career') {
      const selectedCareer = selectedItem.name

      let competencies = []
      // console.log('in career: ')
      if (selectedItem.abilitiesArray) {
        for (let i = 1; i <= selectedItem.abilitiesArray.length; i++) {
          competencies.push({
            category: 'Ability',
            name: selectedItem.abilitiesArray[i - 1].category,
            description: selectedItem.abilitiesArray[i - 1].subcategories.toString(),
          })
        }
      }
      if (selectedItem.knowledgeArray) {
        for (let i = 1; i <= selectedItem.knowledgeArray.length; i++) {
          competencies.push({
            category: 'Knowledge',
            name: selectedItem.knowledgeArray[i - 1].category,
            description: selectedItem.knowledgeArray[i - 1].subcategories.toString(),
          })
        }
      }
      if (selectedItem.personalityData && selectedItem.personalityData.workStyles) {
        for (let i = 1; i <= selectedItem.personalityData.workStyles.length; i++) {
          competencies.push({
            category: 'Soft Skill',
            name: selectedItem.personalityData.workStyles[i - 1],
          })
        }
      }
      if (selectedItem.skillsArray) {
        for (let i = 1; i <= selectedItem.skillsArray.length; i++) {
          competencies.push({
            category: 'Hard Skill',
            name: selectedItem.skillsArray[i - 1].category,
            description: selectedItem.skillsArray[i - 1].subcategories.toString(),
          })
        }
      }
      if (selectedItem.technologyArray) {
        for (let i = 1; i <= selectedItem.technologyArray.length; i++) {
          competencies.push({
            category: 'Tech Skill',
            name: selectedItem.technologyArray[i - 1].name,
            description: selectedItem.technologyArray[i - 1].examples.toString(),
          })
        }
      }
      console.log('show competencies: ')
      this.setState({ selectedCareer, competencies })
    } else if (type === 'opportunity') {
      let selectedOpportunity = null
      if (selectedItem.title && selectedItem.title !== '') {
        selectedOpportunity = selectedItem.title
      } else {
        selectedOpportunity = selectedItem.name
      }

      this.setState({ searchIsAnimating: true })

      let benchmarkId = null
      let jobFunction = null
      if (selectedItem.benchmarkId) {
        benchmarkId = selectedItem.benchmarkId
      } else {
        if (selectedItem.jobFunction) {
          jobFunction = selectedItem.jobFunction
        } else if (selectedItem.workFunction) {
          jobFunction = selectedItem.workFunction
        } else if (selectedItem.functions && selectedItem.functions[0]) {
          jobFunction = selectedItem.functions[0]
        } else if (selectedItem.field && selectedItem.field.split("|")) {
          jobFunction = selectedItem.field.split("|")[0].trim()
        }
      }

      Axios.get('/api/benchmarks/byid', { params: { _id: benchmarkId, jobFunction } })
      .then((response) => {
        console.log('Benchmarks query by id attempted', response.data);

          if (response.data.success) {
            console.log('successfully retrieved benchmarks for individual')

            let competencies = []
            if (response.data.benchmark && response.data.benchmark.skills) {
              for (let i = 1; i <= response.data.benchmark.skills.length; i++) {

                let category = response.data.benchmark.skills[i - 1].skillType
                if (response.data.benchmark.skills[i - 1].skillType === 'Hard Skill') {
                  category = 'Hard Skill'
                }

                const name = response.data.benchmark.skills[i - 1].title
                const description = response.data.benchmark.skills[i - 1].description
                console.log('show the learningObjecive: ', i, category, name, description)
                competencies.push({ category, name, description })
              }
            }

            this.setState({ selectedOpportunity, competencies, searchIsAnimating: false })

          } else {
            console.log('no benchmarks by id data found', response.data.message)

            this.setState({ selectedOpportunity, searchIsAnimating: false })
          }

      }).catch((error) => {
          console.log('Benchmarks query by id did not work', error);
          this.setState({ selectedOpportunity, searchIsAnimating: false })
      });
    } else if (type === 'entrepreneurship') {
      let competencies = []
      let entrepreneurshipGoal = this.state.entrepreneurshipGoal
      let entrepreneurshipIndustry = this.state.entrepreneurshipIndustry

      if (subType === 'entrepreneurshipGoal') {
        entrepreneurshipGoal = selectedItem
      } else if (subType === 'entrepreneurshipIndustry') {
        entrepreneurshipIndustry = selectedItem
      }

      competencies.push({ category: 'Ability', name: 'Entrepreneurship' })
      competencies.push({ category: 'Soft Skill', name: 'Time Management' })
      competencies.push({ category: 'Hard Skill', name: 'Strategic Thinking' })
      competencies.push({ category: 'Soft Skill', name: 'Efficiency' })
      competencies.push({ category: 'Soft Skill', name: 'Resilience' })
      competencies.push({ category: 'Soft Skill', name: 'Communication' })
      competencies.push({ category: 'Soft Skill', name: 'Sales' })
      console.log('show entrepreneurshipGoal: ', entrepreneurshipGoal)
      if (entrepreneurshipGoal && entrepreneurshipGoal !== '') {
        competencies.push({ category: 'Hard Skill', name: entrepreneurshipGoal })
      }
      if (entrepreneurshipIndustry && entrepreneurshipIndustry !== '') {
        competencies.push({ category: 'Knowledge', name: entrepreneurshipIndustry })
      }

      this.setState({ competencies })
    } else if (type === 'basics') {
      let competencies = []

      competencies.push({ category: 'Soft Skill', name: 'Organize' })
      competencies.push({ category: 'Soft Skill', name: 'Leadership' })
      competencies.push({ category: 'Soft Skill', name: 'Conflict Management' })
      competencies.push({ category: 'Soft Skill', name: 'Decision Making' })
      competencies.push({ category: 'Soft Skill', name: 'Time Management' })
      competencies.push({ category: 'Soft Skill', name: 'Communication' })
      competencies.push({ category: 'Tech Skill', name: 'Microsoft Office / Google Suite' })
      competencies.push({ category: 'Hard Skill', name: 'Math' })
      competencies.push({ category: 'Hard Skill', name: 'Writing' })

      this.setState({ competencies })
    } else if (type === 'stability' || type === 'pay' || type === 'interests') {

      const profile = this.state.profile

      Axios.put('/api/learning-objectives', { profile, category: type })
      .then((response) => {
        console.log('Learning objectives query attempted', response.data);

        if (response.data.success) {
          console.log('learning objectives query worked')

          const competencies = response.data.competencies
          this.setState({ competencies })

        } else {
          console.log('learning objectives query did not work', response.data.message)
          //don't allow signups without an org affiliation
          this.setState({ error: { message: 'There was an error finding the learning objectives' } })
        }

      }).catch((error) => {
          console.log('Learning objectives query did not work for some reason', error);
      });
    }
  }

  favoriteItem(item, type) {
    console.log('favoriteItem called in requestEndorsements', item, type)

    this.setState({ errorMessage: null, successMessage: null, isSaving: true })

    if (type) {
      let itemId = item._id

      let favoritesArray = this.state.favorites

      if (favoritesArray.includes(itemId)){

        let index = favoritesArray.indexOf(itemId)

        if (index > -1) {
          favoritesArray.splice(index, 1);
        }
        // console.log('item to remove 2: ', favoritesArray, favoritesArray.length, favoritedCourseDetails.length)

        Axios.post('/api/favorites/save', {
          favoritesArray, emailId: this.state.emailId
        })
        .then((response) => {
          console.log('attempting to save removal from favorites')
          if (response.data.success) {
            console.log('saved removal from favorites', response.data)

            this.setState({ successMessage: 'Removed from saved favorites', favorites: favoritesArray, isSaving: false })

          } else {
            console.log('did not save successfully')
            this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
          }
        }).catch((error) => {
            console.log('save did not work', error);
            this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false })
        });

      } else {

        console.log('adding item: ', favoritesArray, itemId, this.state.emailId)

        favoritesArray.push(itemId)
        Axios.post('/api/favorites/save', {
          favoritesArray, emailId: this.state.emailId
        })
        .then((response) => {
          console.log('attempting to save addition to favorites')
          if (response.data.success) {
            console.log('saved addition to favorites', response.data)

            this.setState({ successMessage: 'Saved as a favorite!', favorites: favoritesArray, isSaving: false })

          } else {
            console.log('did not save successfully')
            this.setState({ errorMessage: 'error:' + response.data.message, isSaving: false })
          }
        }).catch((error) => {
            console.log('save did not work', error);
            this.setState({ errorMessage: 'there was an error saving favorites', isSaving: false})
        });
      }
    }
  }

  prepareExampleEndorsement() {
    console.log('prepareExampleEndorsement')

    const skillTraits = [
      { name: 'Critical Thinking', skillType: 'Hard Skill', rating: 5 },
      { name: 'Analytical or scientific software', skillType: 'Hard Skill', rating: 5 },
      { name: 'Management or financial resources', skillType: 'Hard Skill', rating: 5 },
      { name: 'Reading comprehension', skillType: 'Hard Skill', rating: 5 },
      { name: 'Systems analysis', skillType: 'Hard Skill', rating: 5 },
      { name: 'Spreadsheet software', skillType: 'Hard Skill', rating: 5 },
      { name: 'Critical Thinking', skillType: 'Hard Skill', rating: 5 },
      { name: 'Complex Problem Solving', skillType: 'Soft Skill', rating: 5 },
      { name: 'Active Listening', skillType: 'Soft Skill', rating: 5 },
      { name: 'Persuasion', skillType: 'Soft Skill', rating: 5 },
      { name: 'Active Learning', skillType: 'Soft Skill', rating: 5 },
      { name: 'Analytical Thinking', skillType: 'Soft Skill', rating: 5 },
      { name: 'Achievement / Effort', skillType: 'Soft Skill', rating: 5 },
      { name: 'Business', skillType: 'Knowledge', rating: 5 },
      { name: 'Strategy', skillType: 'Knowledge', rating: 5 },
      { name: 'Operations', skillType: 'Knowledge', rating: 5 },
      { name: 'Health', skillType: 'Knowledge', rating: 5 },
      { name: 'Wellness', skillType: 'Knowledge', rating: 5 },
      { name: 'E-Commerce', skillType: 'Knowledge', rating: 5 },
    ] // name, skillType, rating
    const competencies = [
      { name: 'Critical Thinking', category: 'Hard Skill', rating: 5 },
      { name: 'Analytical or scientific software', category: 'Hard Skill', rating: 5 },
      { name: 'Management or financial resources', category: 'Hard Skill', rating: 5 },
      { name: 'Reading comprehension', category: 'Hard Skill', rating: 5 },
      { name: 'Systems analysis', category: 'Hard Skill', rating: 5 },
      { name: 'Spreadsheet software', category: 'Hard Skill', rating: 5 },
      { name: 'Critical Thinking', category: 'Hard Skill', rating: 5 },
      { name: 'Complex Problem Solving', category: 'Soft Skill', rating: 5 },
      { name: 'Active Listening', category: 'Soft Skill', rating: 5 },
      { name: 'Persuasion', category: 'Soft Skill', rating: 5 },
      { name: 'Active Learning', category: 'Soft Skill', rating: 5 },
      { name: 'Analytical Thinking', category: 'Soft Skill', rating: 5 },
      { name: 'Achievement / Effort', category: 'Soft Skill', rating: 5 },
      { name: 'Business', category: 'Knowledge', rating: 5 },
      { name: 'Strategy', category: 'Knowledge', rating: 5 },
      { name: 'Operations', category: 'Knowledge', rating: 5 },
      { name: 'Health', category: 'Knowledge', rating: 5 },
      { name: 'Wellness', category: 'Knowledge', rating: 5 },
      { name: 'E-Commerce', category: 'Knowledge', rating: 5 },
    ] // name, category, rating
    let examples = [] // skillTrait, example
    examples.push({
      skillTrait: 'Critical Thinking',
      example: "I've worked with this student for 3 years on a project. Never in my 20 years of teaching having I seen someone demonstrate a mastery of critical thinking with little-to-no experience.",
    })


    const selectedEndorsement = {
      senderFirstName: 'Jon', senderLastName: 'Doe', senderEmail: 'jondoe@gmail.com',
      recipientFirstName: 'Jon', recipientLastName: 'Doe', recipientEmail: 'jondoe@gmail.com',
      relationship: 'Teacher', pathway: "Strategy & Operations", skillTraits, competencies,
      examples, overallRecommendation: 5, isTransparent: true,
      createdAt: new Date(), updatedAt: new Date()
    }

    this.setState({ modalIsOpen: true, showEndorsementDetails: true, selectedEndorsement })
  }

  closeModal() {
    console.log('closeModal called')

    this.setState({ modalIsOpen: false, showEndorsementDetails: false })
  }

  render() {

      return (
          <div>
              <div>
                  <div className="row-20">
                    {(!window.location.pathname.includes('/app/walkthrough')) && (
                      <p className="heading-text-2">Request an Endorsement</p>
                    )}
                    <p className="row-5 description-text-1">Request endorsements, where endorsers (e.g., teachers, supervisors, mentors) score you on skills relevant to specific career pathways or opportunities. The endorsements can be imported into applications, showcased to employers, and used for recommending opportunities. <button className="background-button cta-color underline-text offset-underline description-text-1" onClick={() => this.prepareExampleEndorsement()}>See Example Endorsement</button></p>
                  </div>

                  {(window.location.pathname.includes('/app/walkthrough')) && (
                    <div className="row-10">
                      <div className="container-left">
                        <label className="profile-label">Would you like to request an endorsement?<label className="error-color">*</label></label>
                        <select name="enableRequestEndorsement" value={this.state.enableRequestEndorsement} onChange={this.formChangeHandler} className="dropdown">
                          {['','Yes','No'].map(value =>
                            <option key={value} value={value}>{value}</option>
                          )}
                        </select>
                      </div>
                      <div className="clear" />
                    </div>
                  )}

                  {(this.state.enableRequestEndorsement === 'Yes' || !window.location.pathname.includes('/app/walkthrough')) && (
                    <div>
                      {(this.state.controlledRequest) ? (
                        <div>
                          <div>
                            <div className="row-10">
                              <div className="container-left">
                                <p className="profile-label">Search Portal<label className="error-color">*</label></p>
                                <div className="standard-border float-left full-width row-3 horizontal-padding-7">
                                  <div className="search-icon-container">
                                    <img src={searchIcon} alt="Compass search icon"/>
                                  </div>
                                  <div className="filter-search-container width-80-percent" >
                                    <input type="text" className="text-field clear-border" placeholder="Search members of the portal..." name="searchMembers" autoComplete="off" value={this.state.searchStringMembers} onChange={this.formChangeHandler}/>
                                  </div>
                                </div>

                                {(this.state.searchIsAnimating) ? (
                                  <div className="flex-container flex-center full-space">
                                    <div>
                                      <div className="super-spacer" />

                                      <img src={loadingGIF} alt="Compass loading gif icon" className="image-auto-80 center-horizontally"/>
                                      <div className="spacer" /><div className="spacer" /><div className="spacer" />
                                      <p className="center-text cta-color bold-text">Searching...</p>

                                    </div>
                                  </div>
                                ) : (
                                  <div>
                                    {(this.state.memberOptions && this.state.memberOptions.length > 0) && (
                                      <div>
                                        {this.state.memberOptions.map((value, optionIndex) =>
                                          <div key={value._id} className="left-text bottom-margin-5 full-width">
                                            <button className="background-button" onClick={() => this.searchItemClicked(value, 'member',optionIndex)}>
                                              <div className="left-padding full-width top-padding">
                                                <div className="float-left right-padding">
                                                  <img src={profileIconDark} alt="Compass employer icon icon" className="image-auto-22" />
                                                </div>
                                                <div className="float-left">
                                                  <p className="cta-color">{value.firstName} {value.lastName}</p>
                                                  <p className="description-text-3 left-text">{value.roleName}</p>
                                                </div>
                                              </div>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>
                                )}

                              </div>
                              <div className="container-right">
                                <p className="profile-label">Relationship<label className="error-color">*</label></p>
                                <select name="relationship" value={this.state.relationship} className="dropdown" onChange={this.formChangeHandler}>
                                    <option />
                                    <option value="Friend">Friend</option>
                                    <option value="Relative">Relative</option>
                                    <option value="Classmate">Classmate</option>
                                    <option value="Work Colleague">Work Colleague</option>
                                    <option value="Project Teammate">Project Teammate</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Direct Supervisor">Direct Supervisor</option>
                                    <option value="Counselor">Counselor</option>
                                    <option value="Mentor">Mentor</option>
                                    <option value="Other">Other</option>
                                    <option value="Anonymous">Anonymous</option>
                                </select>
                              </div>
                              <div className="clear" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div>
                            <div className="row-10">
                              <div className="container-left">
                                <label className="profile-label">Endorser First Name<label className="error-color">*</label></label>
                                <input type="text" className="text-field" placeholder="Endorser first name..." name="firstName" value={this.state.recipientFirstName} onChange={this.formChangeHandler}></input>
                              </div>
                              <div className="container-right">
                                <label className="profile-label">Endorser Last Name<label className="error-color">*</label></label>
                                <input type="text" className="text-field" placeholder="Endorser last name..." name="lastName" value={this.state.recipientLastName} onChange={this.formChangeHandler}></input>
                              </div>
                              <div className="clear" />
                            </div>

                            <div className="edit-profile-row">
                              <div className="container-left">
                                <label className="profile-label">Endorser Email<label className="error-color">*</label></label>
                                <input type="text" className="text-field" placeholder="Endorser email..." name="email" value={this.state.recipientEmail} onChange={this.formChangeHandler}></input>
                              </div>
                              <div className="container-right">
                                <p className="profile-label">Relationship<label className="error-color">*</label></p>
                                <select name="relationship" value={this.state.relationship} className="dropdown" onChange={this.formChangeHandler}>
                                    <option />
                                    <option value="Friend">Friend</option>
                                    <option value="Relative">Relative</option>
                                    <option value="Classmate">Classmate</option>
                                    <option value="Work Colleague">Work Colleague</option>
                                    <option value="Project Teammate">Project Teammate</option>
                                    <option value="Teacher">Teacher</option>
                                    <option value="Direct Supervisor">Direct Supervisor</option>
                                    <option value="Counselor">Counselor</option>
                                    <option value="Mentor">Mentor</option>
                                    <option value="Other">Other</option>
                                    <option value="Anonymous">Anonymous</option>
                                </select>
                              </div>
                              <div className="clear" />
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="row-10">
                        <div className="container-left">
                          <label className="profile-label">Select a Goal Type<label className="error-color">*</label></label>
                          <select name="goalType" value={this.state.goalType.description} onChange={this.formChangeHandler} className="dropdown">
                            {this.state.goalTypeOptions.map(value =>
                              <option key={value.description} value={value.description}>{value.description}</option>
                            )}
                          </select>
                          <div className="clear" />
                        </div>
                        <div className="container-right">
                          {(this.state.goalType.name === 'Career') && (
                            <div>
                              <p className="profile-label">Pathway<label className="error-color">*</label></p>
                              {(this.state.activeOrg === 'dpscd' && this.state.pathway) ? (
                                <div>
                                  <p className="heading-text-5 description-text-color">{this.state.pathway}</p>
                                </div>
                              ) : (
                                <div>
                                  <select name="pathway" value={this.state.selectedPathway} className="dropdown" onChange={this.formChangeHandler}>
                                    {this.state.pathwayOptions.map(value =>
                                      <option key={value.key} value={value.value}>{value.value}</option>
                                    )}
                                  </select>
                                </div>
                              )}
                            </div>
                          )}
                          {(this.state.goalType.name === 'Opportunity') && (
                            <div>
                              <label className="profile-label">Select an Opportunity</label>
                              <div className="calc-column-offset-70">
                                <input type="text" className="text-field" placeholder="Search work opportunities..." name="searchOpportunities" value={this.state.searchStringOpportunities} onChange={this.formChangeHandler}></input>
                              </div>
                              <div className="fixed-column-70 left-padding">
                                <button className={(this.state.unready) ? "btn btn-squarish medium-background standard-border" : "btn btn-squarish"} disabled={this.state.unready} onClick={() => this.addItem('opportunity')}>Add</button>
                              </div>
                              <div className="clear" />

                              {(this.state.searchIsAnimating) ? (
                                <div className="flex-container flex-center full-space">
                                  <div>
                                    <div className="super-spacer" />

                                    <img src={loadingGIF} alt="Compass loading gif icon" className="image-auto-80 center-horizontally"/>
                                    <div className="spacer" /><div className="spacer" /><div className="spacer" />
                                    <p className="center-text cta-color bold-text">Searching...</p>

                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <div>
                                    {(this.state.opportunityOptions) && (
                                      <div className="card top-margin">
                                        {this.state.opportunityOptions.map((value, optionIndex) =>
                                          <div key={value._id} className="left-text bottom-margin-5 full-width">
                                            <button className="background-button full-width row-5 left-text" onClick={() => this.searchItemClicked(value, 'opportunity')}>
                                              <div className="full-width">
                                                <div className="fixed-column-40">
                                                  <div className="mini-spacer" />
                                                  <img src={experienceIcon} alt="Compass employer icon icon" className="image-auto-22" />
                                                </div>
                                                <div className="calc-column-offset-40">
                                                  <p className="cta-color">{(value.title) ? value.title : value.name}{value.employerName && " | " + value.employerName}</p>
                                                </div>
                                              </div>
                                            </button>
                                          </div>
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  <div>

                                    {this.renderTags('opportunity')}
                                    <div className="clear" />

                                  </div>

                                </div>
                              )}
                            </div>
                          )}

                        </div>
                        <div className="clear" />
                        {(this.state.errorMessage && this.state.errorMessage !== '') && <p className="description-text-2 error-color row-5">{this.state.errorMessage}</p>}
                        {(this.state.successMessage && this.state.successMessage !== '') && <p className="description-text-2 cta-color row-5">{this.state.successMessage}</p>}
                        {/*
                        {(this.state.orgFocus === 'Placement') ? (
                          <div>
                            <p className="description-text-2 cta-color half-bold-text bottom-padding-5">Selecting a career, pathway, or opportunity allows you to pre-fill skills based on the pathway you're targeting, but you can always add or remove skills yourself!</p>
                          </div>
                        ) : (
                          <div>
                            <p className="description-text-2 cta-color half-bold-text bottom-padding-5">Selecting a career, pathway, or opportunity allows you to pre-fill skills based on the pathway you're targeting, but you can always add or remove skills yourself!</p>
                          </div>
                        )}*/}
                      </div>


                      <div>

                        <div className="row-10">
                          <div className="container-left">
                            <label className="profile-label">Add a Competency</label>
                            <div className="calc-column-offset-70">
                              <input type="text" className="text-field" placeholder="Search competencies..." name="searchCompetencies" value={this.state.searchStringCompetencies} onChange={this.formChangeHandler}></input>
                            </div>
                            <div className="fixed-column-70 left-padding">
                              <button className={(this.state.unready) ? "btn btn-squarish medium-background standard-border" : "btn btn-squarish"} disabled={this.state.unready} onClick={() => this.addItem('competency')}>Add</button>
                            </div>
                            <div className="clear" />
                          </div>
                          <div className="clear" />

                          {(this.state.competencyOptions && this.state.competencyOptions.length > 0) && (
                            <div>
                              {this.state.competencyOptions.map((value, optionIndex) =>
                                <div key={value._id} className="left-text bottom-margin-5 full-width">
                                  <button className="background-button" onClick={() => this.searchItemClicked(value, 'competency',optionIndex)}>
                                    <div className="left-padding full-width top-padding">
                                      <div className="float-left right-padding">
                                        <img src={skillsIcon} alt="Compass employer icon icon" className="image-auto-22" />
                                      </div>
                                      <div className="float-left">
                                        <p className="cta-color">{value.name}</p>
                                        {(value.type) && (
                                          <p className="description-text-3 left-text">{value.type}</p>
                                        )}
                                      </div>
                                    </div>
                                  </button>
                                </div>
                              )}
                            </div>
                          )}
                        </div>

                        {(this.state.competencies.length > 0) && (
                          <div>
                            <div className="top-padding">
                              <label className="profile-label">Competencies You Are Requesting to be endorsed:</label>
                            </div>

                            {this.renderTags('competency')}
                          </div>
                        )}

                        <div className="clear" />
                      </div>

                      <div className="clear" />

                      { (this.state.successMessage!== '') && <p className="success-message">{this.state.successMessage}</p> }
                      { (this.state.errorMessage!== '') && <p className="error-message">{this.state.errorMessage}</p> }

                      <div className="row-30">
                        <div className="spacer" />
                        <button className="btn btn-primary" onClick={() => this.handleSubmit()}>Request Endorsement</button>
                      </div>
                    </div>
                  )}

                  {(this.state.showEndorsementDetails) && (
                    <div>
                      <SubEndorsementDetails closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedEndorsement={this.state.selectedEndorsement} orgCode={this.state.activeOrg} />
                    </div>
                  )}

              </div>
          </div>

      )
  }

}

export default RequestEndorsements;
