import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';
import Modal from 'react-native-modal';

const profileIconGrey = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/profile-icon-grey.png';
const deniedIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/denied-icon.png';
const addIncomingIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-incoming-icon.png';
const addOutgoingIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/add-outgoing-icon.png';
const confidentialityIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/confidentiality-icon.png';

import SubEndorsementDetails from '../common/EndorsementDetails';
import SubRequestEndorsements from './RequestEndorsements';

class Endorsements extends Component {
  constructor(props) {
    super(props)
    this.state = {

      showOutgoing: false,
      showSubEndorsementDetails: true,

      areEndorsements: false,
      endorsements: [],
      filteredEndorsements: [],
      detailIndex: 0,

      categorySelected: 0,//endorsements for me
      searchString: '',
      direction: 'Any',
      status: 'Any',
      relationship: 'Any',
      skill: 'Any'
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.closeModal = this.closeModal.bind(this)
    this.renderEndorsements = this.renderEndorsements.bind(this)
    this.renderFilteredEndorsements = this.renderFilteredEndorsements.bind(this)
    this.approveEndorsement = this.approveEndorsement.bind(this)
    this.deleteEndorsement = this.deleteEndorsement.bind(this)
    this.handleChange = this.handleChange.bind(this)
    this.renderSkillTraits = this.renderSkillTraits.bind(this)
    this.renderSpecificSkillTraits = this.renderSpecificSkillTraits.bind(this)
    this.removeEndorsement = this.removeEndorsement.bind(this)

  }

  componentDidMount() {
    console.log('endorsements component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called ', this.props.activeOrg, prevProps)

    if (this.props.activeOrg !== prevProps.activeOrg || this.props.accountCode !== prevProps.accountCode) {
      console.log('t0 will update')
      this.retrieveData()
    // } else if (this.props.employers && this.props.employers.length !== prevProps.employers.length) {
    //   this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {

      console.log('this is causing the error')
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
        console.log('what is the email of this user', emailId);

        this.setState({ emailId, username, cuFirstName, cuLastName, firstName: cuFirstName, lastName: cuLastName,
          roleName, activeOrg, orgFocus, orgName, remoteAuth
        })

        Axios.get('https://www.guidedcompass.com/api/story', { params: { emailId } })
          .then((response) => {
              console.log('Endorsement query worked', response.data);

              if (response.data.success) {

                if (response.data.stories) {
                  const areEndorsements = true
                  const endorsements = response.data.stories
                  const filteredEndorsements = endorsements
                  this.setState({ areEndorsements, endorsements, filteredEndorsements })
                }
              }

        }).catch((error) => {
            console.log('Story query did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  handleChange(e) {
    console.log('handleChange');
    //search using searchString

    let searchString = this.state.searchString
    let relationship = this.state.relationship

    if (e.target.name === 'search') {
      console.log('search was called')
      searchString = e.target.value
      // this.setState({ searchString: e.target.value })
    // } else if (e.target.name === 'direction') {
    //   console.log('direction was called')
    //   this.setState({ direction: e.target.value })
    } else if (e.target.name === 'relationship') {
      relationship = e.target.value
      // this.setState({ relationship: e.target.value })
    }

    let filteredEndorsements = []
    for (let i = 1; i <= this.state.endorsements.length; i++) {

      let iSearch = false

      let iRelationship = false

      let fullTerm = ''
      if (this.state.endorsements[i - 1].recipientFirstName) {
        fullTerm = fullTerm + this.state.endorsements[i - 1].recipientFirstName
      }

      if (this.state.endorsements[i - 1].recipientLastName) {
        fullTerm = fullTerm + ' ' + this.state.endorsements[i - 1].recipientLastName
      }

      // if (this.state.endorsements[i - 1].recipientEmail) {
      //   fullTerm + this.state.endorsements[i - 1].recipientEmail
      // }

      if (this.state.endorsements[i - 1].senderFirstName) {
        fullTerm = fullTerm + ' ' + this.state.endorsements[i - 1].senderFirstName
      }

      if (this.state.endorsements[i - 1].senderLastName) {
        fullTerm = fullTerm + ' ' + this.state.endorsements[i - 1].senderLastName
      }
      console.log('show search: ', fullTerm, 'break', searchString, this.state.endorsements[i - 1])
      if (searchString === '' || fullTerm.toLowerCase().includes(searchString.toLowerCase())) {
        console.log('we upin')
        iSearch = true
      }

      if (relationship === '' || relationship === 'Any') {
        iRelationship = true
      } else if (relationship === this.state.endorsements[i - 1].relationship) {
        iRelationship = true
      }

      // console.log('lets see values ', iSearch, iRelationship)
      if (iSearch && iRelationship) {
        filteredEndorsements.push(this.state.endorsements[i - 1])
      }
    }
    // console.log('show final value ', filteredAdvisees.length)
    this.setState({ searchString, relationship, filteredEndorsements })
  }

  approveEndorsement(endorsementId, index, isApproved) {
    console.log('approveEndorsement clicked');

    let endorsements = this.state.endorsements

    if (isApproved.isApproved) {
      endorsements[index.index].isDecided = true
      endorsements[index.index].isApproved = isApproved.isApproved
    } else {
      endorsements[index.index].isDecided = true
      endorsements[index.index].isApproved = isApproved.isApproved
    }
    console.log('value of endorsements', endorsements, !isApproved.isApproved)

    Axios.put('https://www.guidedcompass.com/api/story/is-approved', {
      senderEmail: this.state.emailId, storyId: endorsementId.endorsementId, isApproved: isApproved.isApproved, isDenied: !isApproved.isApproved })
    .then((response) => {

      if (response.data.success) {
        console.log('Endorsement update worked', response.data);
        this.setState({
          endorsements: endorsements
        })
      }

    }).catch((error) => {
        console.log('endorsement send did not work', error);
    });

  }

  deleteEndorsement(index) {
    console.log('deleteEndorsement', index)

    const _id = this.state.endorsements[index]._id

    // delete endorsements attached to profile
    Axios.delete('https://www.guidedcompass.com/api/endorsements/' + _id)
    .then((response) => {
      console.log('tried to delete', response.data)
      if (response.data.success) {
        //save values
        console.log('Post delete worked');

        let endorsements = []
        for (let i = 1; i <= this.state.endorsements.length; i++) {
          const tempIndex = i - 1
          if (index !== tempIndex) {
            endorsements.push(this.state.endorsements[i - 1])
          }
        }
        console.log('show endorsements: ', this.state.endorsements.length, endorsements.length)

        const filteredEndorsements = endorsements

        const searchString = ''
        const relationship = 'Any'

        const serverSuccessMessage = 'Endorsement was deleted successfully!'
        const confirmDelete = false
        const modalIsOpen = false

        this.setState({ endorsements, filteredEndorsements, searchString, relationship,
          serverSuccessMessage, confirmDelete, modalIsOpen })

        // const emailId = this.state.emailId
        // const endorsementId = _id
        //
        // // delete endorsements attached to applications
        // Axios.put('https://www.guidedcompass.com/api/endorsements/remove-from-applications', { emailId, endorsementId })
        // .then((response) => {
        //
        //   if (response.data.success) {
        //     console.log('Endorsements were successfully deleted from relevant applications', response.data);
        //
        //     this.setState({ serverSuccessMessage: 'Endorsements were successfully deleted from profile and applications' })
        //
        //   } else {
        //     console.log('there was an error')
        //     this.setState({ serverSuccessMessage: response.data.message })
        //   }
        //
        // }).catch((error) => {
        //     console.log('endorsement send did not work', error);
        // });

      } else {
        console.error('there was an error deleting the endorsement');
        this.setState({ serverErrorMessage: response.data.message })
      }
    }).catch((error) => {
        console.log('The deleting did not work', error);
        this.setState({ serverErrorMessage: error })
    });
  }

  closeModal() {
    this.setState({ modalIsOpen: false, showRequestEndorsements: false, showSubEndorsementDetails: false });
  }

  renderEndorsements() {
    console.log('renderEndosements called');

    let rows = [];
    for (let i = 1; i <= this.state.filteredEndorsements.length; i++) {
      console.log(i);
      this.renderFilteredEndorsements(i , rows)
    }

    return rows;
  }

  renderFilteredEndorsements(i, rows) {
    console.log('filteredEndorsements called');

    const detailIndex = i - 1
    const filteredEndorsements = this.state.filteredEndorsements

    //format date
    let createdAt = filteredEndorsements[i - 1].createdAt
    let year = createdAt.substring(0,4);
    let subCA = createdAt.substring(5,10);
    let replacedCA = subCA.replace("-","/")
    let formattedCA = replacedCA + "/" + year

    //determine anonymity value.
    //ideally this is determined on back-end.
    let incoming = true
    if (filteredEndorsements[i - 1].recipientEmail === this.state.emailId) {
      incoming = true
    } else {
      incoming = false
    }

    let name = '';
    if (filteredEndorsements[i - 1].isAnonymousContribution === true) {
      name = 'Anonymous';
    } else if (filteredEndorsements[i - 1].senderFirstName && filteredEndorsements[i - 1].senderLastName) {
      if (incoming) {
        name = filteredEndorsements[i - 1].senderFirstName + ' ' + filteredEndorsements[i - 1].senderLastName
      } else {
        name = filteredEndorsements[i - 1].recipientFirstName + ' ' + filteredEndorsements[i - 1].recipientLastName
      }
    } else if (incoming) {
      name = filteredEndorsements[i - 1].senderEmail
    } else {
      name = filteredEndorsements[i - 1].recipientEmail
    }

    let relationship = '';
    if (!filteredEndorsements[i - 1].relationship) {
        relationship = 'Anonymous';
    } else if (filteredEndorsements[i - 1].relationship === 'Anonymous') {
        relationship = 'Anonymous';
    } else {
      relationship = filteredEndorsements[i - 1].relationship
    }

    let endorsementClass = [styles.flex1]
    if (this.props.fromApply) {
      endorsementClass = [styles.flex1,styles.leftMargin]
    }

    rows.push(
      <View key={i}>
        <View style={[styles.rowDirection,styles.card,styles.topMargin30]}>
          {(this.props.fromApply) && (
            <View style={[styles.leftMarginNegative3,styles.topMarginNegative12,styles.bottomMarginNegative12,styles.relativePosition,styles.zIndex1]}>
              <TouchableOpacity onPress={() => this.removeEndorsement(i)}>
                <Image source={{ uri: deniedIcon}} style={[styles.square20,styles.contain]} />
              </TouchableOpacity>
            </View>
          )}

          <TouchableOpacity style={endorsementClass} onPress={() => this.setState({ modalIsOpen: true, showRequestEndorsements: false, showSubEndorsementDetails: true, detailIndex })}>
            <View style={[styles.mediumShadow]}>
              <View style={[styles.padding30,styles.calcColumn60,styles.bottomPadding5,styles.rowDirection]}>
                <View style={[styles.width50]}>
                  <Image source={{ uri: profileIconGrey}} style={[styles.square50,styles.contain]}/>
                </View>
                <View style={[styles.calcColumn210,styles.leftPadding20]}>
                  <Text style={[styles.headingText6,styles.curtailText]}>{name}</Text>
                  <Text style={[styles.descriptionText2,styles.curtailText]}>{relationship}  |  {filteredEndorsements[i - 1].pathway}</Text>
                </View>

                <View style={[styles.width100]}>
                  <Text style={[styles.descriptionText3]}>{formattedCA}</Text>
                </View>
              </View>

              <View style={[styles.spacer]} />
              <View style={[styles.horizontalLine,styles.horizontalMargin30]} />
              <View style={[styles.spacer]} />

              {(filteredEndorsements[i - 1].isTransparent) ? (
                <View>
                  <View style={[styles.topPadding5,styles.bottomPadding20,styles.horizontalPadding30,styles.rowDirection,styles.flexWrap]}>
                    {this.renderSkillTraits(i - 1)}
                  </View>
                </View>
              ) : (
                <View style={[styles.row10,styles.horizontalPadding30]}>
                  <Text style={[styles.descriptionText2]}>This endorsement has been marked confidential by the endorser. It will be imported into applications.</Text>
                </View>
              )}

              <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    )

    return rows;
  }

  removeEndorsement(i) {
    console.log('removeEndorsement called', i)

    let filteredEndorsements = this.state.filteredEndorsements
    filteredEndorsements.splice(i - 1, 1)
    this.setState({ filteredEndorsements })
    this.props.passData('endorsements', filteredEndorsements, null)

  }

  renderSkillTraits(index) {
    console.log('renderEndorsedSkills called', index)

    let rows = []

    let competencies = []
    if (this.state.filteredEndorsements[index].competencies && this.state.filteredEndorsements[index].competencies.length > 0) {
      competencies = this.state.filteredEndorsements[index].competencies
    } else {
      competencies = this.state.filteredEndorsements[index].skillTraits
    }

    if (competencies) {

      for (let i = 1; i <= competencies.length; i++) {

        rows.push(
          <View key={i.toString() + 'skills'} style={[styles.topPadding,styles.rightPadding]}>
            <View style={[styles.row5,styles.horizontalPadding15,styles.roundedCorners,styles.ctaBorder,styles.descriptionText2,styles.ctaBackgroundColor]} >
              <Text style={[styles.whiteColor]}>{competencies[i - 1].name} | {competencies[i - 1].rating}</Text>
            </View>
          </View>
        )
      }
    }

    return rows
  }

  renderSpecificSkillTraits(index) {
    console.log('renderSpecificSkillTraits called', index)

    let rows = []

    let competencies = []
    if (this.state.endorsements[this.state.detailIndex].competencies && this.state.endorsements[this.state.detailIndex].competencies.length > 0) {
      competencies = this.state.endorsements[this.state.detailIndex].competencies
    } else {
      competencies = this.state.endorsements[this.state.detailIndex].skillTraits
    }

    if (competencies) {

      let hardSkills = []
      let softSkills = []
      let traits = []

      for (let i = 1; i <= competencies.length; i++) {
        console.log('looping competencies: ', competencies[i - 1])
        let skillTrait = competencies[i - 1]

        if (!skillTrait.rating) {
          skillTrait['rating'] = 0
        }
        if (competencies[i - 1].skillType === 'Hard Skill') {
          hardSkills.push(skillTrait)
        } else if (competencies[i - 1].skillType === 'Soft Skill') {
          softSkills.push(skillTrait)
        } else {
          traits.push(skillTrait)
        }
      }

      rows.push(
        <View key="skills">
          <Text style={[styles.bottomPadding5]}>Hard Skills</Text>
          {hardSkills.map(value =>
            <View>
              {(value.rating !== "I'm Not Sure") && (
                <View>
                  <View style={[styles.rowDirection,styles.flex1]}>
                    <View style={[styles.flex30]}>
                      <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                    </View>
                    <View style={[styles.flex65]}>
                      <View style={[styles.halfSpacer]}/>
                      <View style={[styles.progressBar,styles.ctaBorder,styles.flex1]}>
                        <View style={[styles.flex1, styles.ctaBackgroundColor,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
                      </View>
                    </View>
                    <View style={[styles.flex5]}>
                      <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                    </View>
                  </View>

                  <View style={[styles.spacer]}/>
                </View>
              )}
            </View>
          )}

          <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

          {(softSkills) && (
            <View>
              <Text style={[styles.bottomPadding5]}>Soft Skills</Text>
              {softSkills.map(value =>
                <View>
                  {(value.rating !== "I'm Not Sure") && (
                    <View>
                      <View style={[styles.rowDirection,styles.flex1]}>
                        <View style={[styles.flex30]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                        </View>
                        <View style={[styles.flex65]}>
                          <View style={[styles.halfSpacer]}/>
                          <View style={[styles.progressBar,styles.secondaryBorder,styles.flex1]}>
                            <View style={[styles.flex1, styles.secondaryBackground,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
                          </View>
                        </View>
                        <View style={[styles.flex5]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                        </View>
                      </View>

                      <View style={[styles.spacer]}/>
                    </View>
                  )}
                </View>
              )}
              <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
            </View>
          )}

          {(traits) && (
            <View>
            <Text style={[styles.bottomPadding5]}>Traits</Text>
              {traits.map(value =>
                <View>
                  {(value.rating !== "I'm Not Sure") && (
                    <View>
                      <View style={[styles.rowDirection,styles.flex1]}>
                        <View style={[styles.flex30]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                        </View>
                        <View style={[styles.flex65]}>
                          <View style={[styles.halfSpacer]}/>
                          <View style={[styles.progressBar,styles.quaternaryBorder,styles.flex1]}>
                            <View style={[styles.flex1, styles.quaternaryBackground,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
                          </View>
                        </View>
                        <View style={[styles.flex5]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                        </View>
                      </View>

                      <View style={[styles.spacer]}/>
                    </View>
                  )}

                </View>
              )}
            </View>
          )}

        </View>
      )
    }

    return rows
  }

  render() {

      return (
          <ScrollView>
            {(this.props.fromApply) ? (
              <View>
                <View style={[styles.row10]}>
                  <TouchableOpacity style={[styles.btnSquarish,styles.ctaBackgroundColor]} onPress={() => this.setState({ modalIsOpen: true, showRequestEndorsements: true, showSubEndorsementDetails: false })}>
                    <Text style={[styles.whiteColor,styles.descriptionText2]}>Request an Endorsement</Text>
                  </TouchableOpacity>
                </View>
                {this.renderEndorsements()}
              </View>
            ) : (
              <View>
                { this.state.areEndorsements ? (
                  <View>
                    <View style={[styles.card,styles.rowDirection]}>
                      <View style={[styles.calcColumn110,styles.topPadding]}>
                        {(this.state.endorsements.length > 0) ? (
                          <Text style={[styles.headingText2]}>{this.state.filteredEndorsements.length} Endorsements</Text>
                        ) : (
                          <Text style={[styles.headingText2]}>Endorsements</Text>
                        )}
                      </View>
                      {(this.state.showOutgoing) && (
                        <View style={[styles.topPadding,styles.rightPadding20]}>
                            <TouchableOpacity onPress={() => this.props.navigation.navigate('SendEndorsement')}><Image source={{ uri: addOutgoingIcon}} /></TouchableOpacity>
                        </View>
                      )}
                      <View style={[styles.width50]}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('GetEndorsements')}><Image source={{ uri: addIncomingIcon}} style={[styles.square50,styles.contain]}/></TouchableOpacity>
                      </View>
                    </View>

                    <View>
                      {(this.state.serverSuccessMessage) && <Text style={[styles.ctaColor]}>{this.state.serverSuccessMessage}</Text>}
                      {this.renderEndorsements()}
                    </View>
                  </View>
                ) : (
                  <View style={[styles.card]}>
                      <Text>Guided Compass Endorsements!</Text>
                      <Text style={[styles.topMargin20]}>Use Guided Compass to receive endorsements from employers, teachers, counselors, and advisors on competencies relevant to your preferred career pathway.</Text>

                      <Text style={[styles.topMargin20]}>Use these endorsements as a pick me up, for advisors to reference, or to import into work applications.</Text>

                      <View style={[styles.topMargin30]}>
                        <TouchableOpacity onPress={() => this.props.navigation.navigate('GetEndorsements')} style={[styles.btnPrimary,styles.ctaBackgroundColor]}><Text style={[styles.whiteColor]}>Get Endorsements</Text></TouchableOpacity>
                        {(this.state.showOutgoing) && (
                          <TouchableOpacity onPress={() => this.props.navigation.navigate('SendEndorsement')} style={[styles.btnPrimary]}><Text style={[styles.ctaColor]}>Send Endorsement</Text></TouchableOpacity>
                        )}
                      </View>

                  </View>
                )}
              </View>
            )}


            {(this.state.showSubEndorsementDetails) ? (
              <View>
                {(this.state.endorsements && this.state.endorsements.length > 0) && (
                  <SubEndorsementDetails closeModal={this.closeModal} modalIsOpen={this.state.modalIsOpen} selectedEndorsement={this.state.endorsements[this.state.detailIndex]} orgCode={this.state.activeOrg} />
                )}
              </View>
            ) : (
              <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>

               {(this.state.showRequestEndorsements) ? (
                 <View key="skillAssessment" style={[styles.calcColumn60,styles.padding20]}>
                   <SubRequestEndorsements closeModal={this.closeModal} selectedOpportunity={this.props.selectedOpportunity} />
                 </View>
               ) : (
                 <View>
                   {(this.state.endorsements && this.state.endorsements.length > 0) && (
                     <View>
                       {(this.state.confirmDelete === true && this.state.deleteIndex === this.state.detailIndex) ? (
                         <View style={[styles.padding30]}>
                          <Text style={[styles.headingText4]}>Delete {this.state.endorsements[this.state.detailIndex].senderFirstName} {this.state.endorsements[this.state.detailIndex].senderLastName}'s Endorsement</Text>
                          <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                           <View>
                             <Text style={[styles.errorColor]}>Are you sure you want to delete this endorsement? All information will be deleted forever.</Text>
                           </View>

                           <View style={[styles.spacer]}/><View style={[styles.spacer]}/>

                           <View style={[styles.rowDirection]}>
                             <View style={[styles.rightPadding20]}>
                               <TouchableOpacity style={[styles.btnPrimary,styles.errorBackgroundColor]} onPress={() => this.deleteEndorsement(this.state.detailIndex)}><Text style={[styles.whiteColor]}>Yes, Delete</Text></TouchableOpacity>
                             </View>
                             <View style={[styles.rightPadding20]}>
                               <TouchableOpacity style={[styles.btnPrimary]}  onPress={() => this.setState({ confirmDelete: false, modalIsOpen: false, showRequestEndorsements: false })}><Text style={[styles.ctaColor]}>Cancel</Text></TouchableOpacity>
                             </View>
                           </View>

                           <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                           {(this.state.serverErrorMessage) && <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>}
                         </View>
                       ) : (
                         <View>
                           {(this.state.endorsements[this.state.detailIndex].isTransparent) ? (
                             <View style={[styles.padding20]}>
                               <Text style={[styles.headingText4,styles.bottomPadding]}>Endorsement Details</Text>

                               <View key="specificEndorsement" style={[styles.row10]}>
                                 <View style={[styles.horizontalLine]} />
                                 <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />

                                 <View style={[styles.rowDirection]}>
                                   <View style={[styles.width90]}>
                                     <View style={[styles.darkBackground,styles.width90,styles.height76,styles.padding10]} className="dark-background width-90 height-76 padding-10">
                                       <Text style={[styles.headingText2,styles.whiteColor,styles.boldText,styles.centerText]}>{(this.state.endorsements[this.state.detailIndex].overallRecommendation) ? Number(this.state.endorsements[this.state.detailIndex].overallRecommendation) * 20 : "N/A"}%</Text>
                                       <Text style={[styles.descriptionText5,styles.whiteColor]}>OVERALL</Text>
                                     </View>
                                   </View>
                                   <View style={[styles.calcColumn330,styles.leftPadding]}>
                                     <Text style={[styles.headingText4]}>{this.state.endorsements[this.state.detailIndex].senderFirstName} {this.state.endorsements[this.state.detailIndex].senderLastName}</Text>
                                     <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                                     <Text style={[styles.descriptionText2]}>{this.state.endorsements[this.state.detailIndex].relationship}</Text>

                                   </View>
                                   <View style={[styles.width200,styles.rightText]}>
                                     <Text>{this.state.endorsements[this.state.detailIndex].pathway} Pathway</Text>
                                     <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
                                     <Text style={[styles.descriptionText2]}>{this.state.endorsements[this.state.detailIndex].createdAt}</Text>
                                   </View>
                                 </View>

                                 <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                                 <View>
                                   {this.renderSpecificSkillTraits()}
                                 </View>


                                 <View style={[styles.spacer]} /><View style={[styles.spacer]} />

                                 <View>
                                   <Text style={[styles.headingText6,styles.boldText]}>Examples of Above Competencies</Text>
                                   <View style={[styles.spacer]} /><View style={[styles.spacer]} />
                                   {this.state.endorsements[this.state.detailIndex].examples.map(value =>
                                     <View>
                                       <Text style={[styles.descriptionText1]}>{(value.competency) ? value.competency : value.skillTrait} Example</Text>
                                       <View style={[styles.halfSpacer]}/>
                                       <Text style={[styles.descriptionText3,styles.descriptionTextColor,styles.boldText]}>{value.example}</Text>
                                       <View style={[styles.spacer]}/><View style={[styles.spacer]}/>
                                     </View>
                                   )}

                                 </View>


                                 <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.spacer]}/>

                               </View>

                             </View>
                           ) : (
                             <View style={[styles.padding40,styles.flexCenter]}>
                               <View>
                                 <Image source={{ uri: confidentialityIcon}} style={[styles.square100,styles.verticalMargin20,styles.centerHorizontally]} />

                                 <Text style={[styles.headingText4,styles.centerText]}>This Endorsement is Confidential</Text>
                                 <View style={[styles.spacer]}/>
                                 <Text style={[styles.descriptionTextColor,styles.centerText]}>This endorsement has been marked confidential by the endorser. It will automatically be imported into internship applications.</Text>
                                 <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.spacer]}/>
                               </View>
                             </View>
                           )}
                         </View>
                       )}
                     </View>
                   )}
                 </View>
               )}

              </Modal>
            )}

          </ScrollView>

      )
  }

}

export default Endorsements;
