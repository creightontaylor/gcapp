import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform } from 'react-native';
const styles = require('../css/style');
import Modal from 'react-native-modal';

const confidentialityIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/confidentiality-icon.png';
const closeIcon = 'https://guidedcompass-bucket.s3.us-west-2.amazonaws.com/appImages/close-icon.png';

import {convertDateToString} from '../functions/convertDateToString';

class EndorsementDetails extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.renderSpecificSkillTraits = this.renderSpecificSkillTraits.bind(this)
    this.renderEndorsement = this.renderEndorsement.bind(this)
    this.closeModal = this.closeModal.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

  }

  componentDidUpdate(prevProps) {
    console.log('componentDidUpdate called in endorsementDetails! ', this.props, prevProps)

    if (this.props.selectedEndorsement !== prevProps.selectedEndorsement) {
      console.log('t0')
      this.retrieveData()
    } else if (this.props.modalIsOpen !== prevProps.modalIsOpen) {
      console.log('t1')
      this.retrieveData()
    } else if (this.props.selectedEndorsement) {
      // look for changes in the following
      console.log('transparent compare: ', this.props.selectedEndorsement.isTransparent, prevProps.selectedEndorsement.isTransparent)

      if (this.props.selectedEndorsement.senderFirstName !== prevProps.selectedEndorsement.senderFirstName) {
        this.retrieveData()
      } else if (this.props.selectedEndorsement.senderLastName !== prevProps.selectedEndorsement.senderLastName) {
        this.retrieveData()
      } else if (this.props.selectedEndorsement.senderEmail !== prevProps.selectedEndorsement.senderEmail) {
        this.retrieveData()
      } else if (this.props.selectedEndorsement.relationship !== prevProps.selectedEndorsement.relationship) {
        this.retrieveData()
      } else if (this.props.selectedEndorsement.pathway !== prevProps.selectedEndorsement.pathway) {
        this.retrieveData()
      } else if (this.props.selectedEndorsement.overallRecommendation !== prevProps.selectedEndorsement.overallRecommendation) {
        this.retrieveData()
      } else if (this.props.selectedEndorsement.recommendationExplanation !== prevProps.selectedEndorsement.recommendationExplanation) {
        this.retrieveData()
      } else if (this.props.selectedEndorsement.isTransparent !== prevProps.selectedEndorsement.isTransparent) {
        this.retrieveData()
      } else if (this.props.selectedEndorsement.skillTraits) {
        let somethingChanged = false
        let skillTraits1 = this.props.selectedEndorsement.skillTraits
        let skillTraits2 = prevProps.selectedEndorsement.skillTraits
        for (let i = 1; i <= skillTraits1.length; i++) {
          if (skillTraits1[i - 1] && !skillTraits2) {
            somethingChanged = true
          } else if (skillTraits1[i - 1].name !== skillTraits2[i - 1].name) {
            somethingChanged = true
          } else if (skillTraits1[i - 1].skillTrait !== skillTraits2[i - 1].skillTrait) {
            somethingChanged = true
          } else if (skillTraits1[i - 1].score !== skillTraits2[i - 1].score) {
            somethingChanged = true
          }
        }
        if (somethingChanged) {
          this.retrieveData()
        }
      } else if (this.props.selectedEndorsement.competencies) {
        let somethingChanged = false
        let competencies1 = this.props.selectedEndorsement.competencies
        let competencies2 = prevProps.selectedEndorsement.competencies
        for (let i = 1; i <= competencies1.length; i++) {
          if (competencies1[i - 1] && !competencies2) {
            somethingChanged = true
          } else if (competencies1[i - 1].name !== competencies2[i - 1].name) {
            somethingChanged = true
          } else if (competencies1[i - 1].category !== competencies2[i - 1].category) {
            somethingChanged = true
          } else if (competencies1[i - 1].score !== competencies2[i - 1].score) {
            somethingChanged = true
          }
        }
        if (somethingChanged) {
          this.retrieveData()
        }
      } else if (this.props.selectedEndorsement.examples) {
        let somethingChanged = false
        let examples1 = this.props.selectedEndorsement.examples
        let examples2 = prevProps.selectedEndorsement.examples
        for (let i = 1; i <= examples1.length; i++) {
          if (examples1[i - 1] && !examples2) {
            somethingChanged = true
          } else if (examples1[i - 1].skillTrait !== examples2[i - 1].skillTrait) {
            somethingChanged = true
          } else if (examples1[i - 1].compentency !== examples2[i - 1].competency) {
            somethingChanged = true
          } else if (examples1[i - 1].example !== examples2[i - 1].example) {
            somethingChanged = true
          }
        }
        if (somethingChanged) {
          this.retrieveData()
        }
      }
      // skillTraits: name, skillType, score
      // competencies: name, category, score
      // examples: skillTrait, competency, example
      // goalType, opportunity
    } else if (this.props.endorsements !== prevProps.endorsements) {
      this.retrieveData()
    }
  }

  retrieveData = async() => {
    try {
      console.log('retrieveData called in renderPosts')

      if (this.props.selectedEndorsement) {

        const selectedEndorsement = this.props.selectedEndorsement
        const modalIsOpen = this.props.modalIsOpen

        this.setState({ selectedEndorsement, modalIsOpen })

      } else {
        console.log('user navigated directly to this screen')
      }

    } catch (error) {
     // Error retrieving data
     console.log('there was an error', error)
    }
  }

  closeModal() {
    console.log('show closeModal in projectDetails')

    this.props.closeModal()
  }

  renderSpecificSkillTraits(endorsement) {
    console.log('renderSpecificSkillTraits called', endorsement)

    let rows = []

    if (endorsement.competencies && endorsement.competencies.length > 0) {
      const competencies = endorsement.competencies

      let hardSkills = []
      let softSkills = []
      let abilities = []
      let knowledge = []
      let traits = []

      for (let i = 1; i <= competencies.length; i++) {
        console.log('looping competencies: ', competencies[i - 1])
        let competency = competencies[i - 1]

        if (!competency.rating) {
          competency['rating'] = 0
        }
        if (competencies[i - 1].category === 'Hard Skill' || competencies[i - 1].category === 'General Skill') {
          hardSkills.push(competency)
        } else if (competencies[i - 1].category === 'Soft Skill' || competencies[i - 1].category === 'Work Style') {
          softSkills.push(competency)
        } else if (competencies[i - 1].category === 'Ability') {
          abilities.push(competency)
        } else if (competencies[i - 1].category === 'Knowledge') {
          knowledge.push(competency)
        } else {
          traits.push(competency)
        }
      }

      rows.push(
        <View key="skills">
          {(hardSkills) && (
            <View>
              <Text style={[styles.bottomPadding,styles.headingText6,styles.boldText]}>Hard & General Skills</Text>
              {hardSkills.map(value =>
                <View>
                  {(value.rating !== "I'm Not Sure") && (
                    <View>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.flex80]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                        </View>
                        <View style={[styles.flex20,styles.alignEnd]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                        </View>
                      </View>
                      <View>
                        <View style={[styles.halfSpacer]}/>
                        <View style={[styles.progressBar,styles.ctaBorder]}>
                          <View style={[styles.flex1, styles.ctaBackgroundColor,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
                        </View>
                      </View>

                      <View style={[styles.spacer]}/>
                    </View>
                  )}
                </View>
              )}
            </View>
          )}

          <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

          {(softSkills) && (
            <View>
              {(softSkills && softSkills.length > 0) && (
                <View>
                  <Text style={[styles.bottomPadding,styles.headingText6,styles.boldText]}>Soft Skills & Work Styles</Text>
                  {softSkills.map(value =>
                    <View>
                      {(value.rating !== "I'm Not Sure") && (
                        <View>
                          <View style={[styles.rowDirection]}>
                            <View style={[styles.flex80]}>
                              <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                            </View>
                            <View style={[styles.flex20,styles.alignEnd]}>
                              <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                            </View>
                          </View>
                          <View>
                            <View style={[styles.halfSpacer]}/>
                            <View style={[styles.progressBar,styles.ctaBorder]}>
                              <View style={[styles.flex1, styles.ctaBackgroundColor,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
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
            </View>
          )}

          {(abilities) && (
            <View>
              {(abilities && abilities.length > 0) && (
                <View>
                  <Text style={[styles.bottomPadding,styles.headingText6,styles.boldText]}>Abilities</Text>
                  {abilities.map(value =>
                    <View>
                      {(value.rating !== "I'm Not Sure") && (
                        <View>
                          <View style={[styles.rowDirection]}>
                            <View style={[styles.flex80]}>
                              <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                            </View>
                            <View style={[styles.flex20,styles.alignEnd]}>
                              <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                            </View>
                          </View>
                          <View>
                            <View style={[styles.halfSpacer]}/>
                            <View style={[styles.progressBar,styles.ctaBorder]}>
                              <View style={[styles.flex1, styles.ctaBackgroundColor,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
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
            </View>
          )}

          {(knowledge) && (
            <View>
              {(knowledge && knowledge.length > 0) && (
                <View>
                  <Text style={[styles.bottomPadding,styles.headingText6,styles.boldText]}>Knowledge</Text>
                  {knowledge.map(value =>
                    <View>
                      {(value.rating !== "I'm Not Sure") && (
                        <View>
                          <View style={[styles.rowDirection]}>
                            <View style={[styles.flex80]}>
                              <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                            </View>
                            <View style={[styles.flex20,styles.alignEnd]}>
                              <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                            </View>
                          </View>
                          <View>
                            <View style={[styles.halfSpacer]}/>
                            <View style={[styles.progressBar,styles.ctaBorder]}>
                              <View style={[styles.flex1, styles.ctaBackgroundColor,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
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
            </View>
          )}

          {(traits && traits.length > 0) && (
            <View>
              <Text style={[styles.bottomPadding,styles.headingText6,styles.boldText]}>Traits</Text>
              {traits.map(value =>
                <View>
                  {(value.rating !== "I'm Not Sure") && (
                    <View>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.flex80]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                        </View>
                        <View style={[styles.flex20,styles.alignEnd]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                        </View>
                      </View>
                      <View>
                        <View style={[styles.halfSpacer]}/>
                        <View style={[styles.progressBar,styles.ctaBorder]}>
                          <View style={[styles.flex1, styles.ctaBackgroundColor,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
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
    } else if (endorsement.skillTraits) {
      let skillTraits = endorsement.skillTraits

      let hardSkills = []
      let softSkills = []
      let traits = []

      for (let i = 1; i <= skillTraits.length; i++) {
        console.log('looping skillTraits: ', skillTraits[i - 1])
        let skillTrait = skillTraits[i - 1]

        if (!skillTrait.rating) {
          skillTrait['rating'] = 0
        }
        if (skillTraits[i - 1].skillType === 'Hard Skill') {
          hardSkills.push(skillTrait)
        } else if (skillTraits[i - 1].skillType === 'Soft Skill') {
          softSkills.push(skillTrait)
        } else {
          traits.push(skillTrait)
        }
      }

      rows.push(
        <View key="skills">
          <Text style={[styles.bottomPadding,styles.headingText6,styles.boldText]}>Hard Skills</Text>
          {hardSkills.map(value =>
            <View>
              {(value.rating !== "I'm Not Sure") && (
                <View>
                  <View style={[styles.rowDirection]}>
                    <View style={[styles.flex80]}>
                      <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                    </View>
                    <View style={[styles.flex20,styles.alignEnd]}>
                      <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                    </View>
                  </View>
                  <View>
                    <View style={[styles.halfSpacer]}/>
                    <View style={[styles.progressBar,styles.ctaBorder]}>
                      <View style={[styles.flex1, styles.ctaBackgroundColor,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
                    </View>
                  </View>

                  <View style={[styles.spacer]}/>
                </View>
              )}
            </View>
          )}

          <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

          {(softSkills && softSkills.length > 0) && (
            <View>
              <Text style={[styles.bottomPadding,styles.headingText6,styles.boldText]}>Soft Skills</Text>
              {softSkills.map(value =>
                <View>
                  {(value.rating !== "I'm Not Sure") && (
                    <View>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.flex80]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                        </View>
                        <View style={[styles.flex20,styles.alignEnd]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                        </View>
                      </View>
                      <View>
                        <View style={[styles.halfSpacer]}/>
                        <View style={[styles.progressBar,styles.ctaBorder]}>
                          <View style={[styles.flex1, styles.ctaBackgroundColor,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
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


          {(traits && traits.length > 0) && (
            <View>
              <Text style={[styles.bottomPadding,styles.headingText6,styles.boldText]}>Traits</Text>
              {traits.map(value =>
                <View>
                  {(value.rating !== "I'm Not Sure") && (
                    <View>
                      <View style={[styles.rowDirection]}>
                        <View style={[styles.flex80]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{value.name}</Text>
                        </View>
                        <View style={[styles.flex20,styles.alignEnd]}>
                          <Text style={[styles.descriptionText2,styles.boldText]}>{(value.rating * 20).toString() + '%'}</Text>
                        </View>
                      </View>
                      <View>
                        <View style={[styles.halfSpacer]}/>
                        <View style={[styles.progressBar,styles.ctaBorder]}>
                          <View style={[styles.flex1, styles.ctaBackgroundColor,styles.filler,{ width: (value.rating * 20).toString() + '%'}]} />
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

  renderEndorsement(endorsement) {
    console.log('renderEndorsement called', this.props.modalIsOpen)

    return (
      <View key="endorsementDetail">
        <View style={[styles.rowDirection]}>
          <View style={[styles.calcColumn100]}>
            <Text style={[styles.headingText4,styles.bottomPadding]}>Endorsement Details</Text>
          </View>
          {(this.props.modalIsOpen) && (
            <View style={[styles.width40,styles.topMargin]}>
              <TouchableOpacity style={[styles.flex1]} onPress={() => this.closeModal()}>
                <Image source={{uri: closeIcon}} style={[styles.square15,styles.contain,styles.pinRight]} />
              </TouchableOpacity>
            </View>
          )}
        </View>

        <View key="specificEndorsement" style={[styles.row10]}>
          <View style={[styles.horizontalLine]} />
          <View style={[styles.spacer]} /><View style={[styles.spacer]} /><View style={[styles.spacer]} />

          <View style={[styles.rowDirection]}>
            <View style={[styles.width90]}>
              <View style={[styles.darkBackground,styles.width90,styles.height76,styles.padding10]}>
                <Text style={[styles.headingText2,styles.whiteColor,styles.boldText,styles.centerText]}>{(endorsement.overallRecommendation) ? Number(endorsement.overallRecommendation) * 20 : "N/A"}%</Text>
                <Text style={[styles.descriptionText5,styles.whiteColor]}>OVERALL</Text>
              </View>
            </View>
            <View style={[styles.calcColumn130,styles.leftPadding]}>
              <Text style={[styles.headingText4]}>{endorsement.senderFirstName} {endorsement.senderLastName}</Text>
              <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
              <Text style={[styles.descriptionText2]}>{endorsement.relationship}</Text>

              <View style={[styles.topPadding5]}>
                {(endorsement.createdAt && typeof endorsement.createdAt === 'string') ? (
                  <Text style={[styles.descriptionText3]}>{convertDateToString(endorsement.createdAt,"datetime")}</Text>
                ) : (
                  <Text style={[styles.descriptionText3]}>{convertDateToString(endorsement.createdAt,"date-2")}</Text>
                )}
              </View>
            </View>
          </View>

          <View style={[styles.row10]}>
            {(endorsement.pathway && endorsement.pathway !== '' && endorsement.pathway !== 'Custom') ? (
              <Text style={[styles.descriptionText3]}>Endorsed for the {endorsement.pathway} Pathway</Text>
            ) : (
              <View />
            )}

            <View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/><View style={[styles.miniSpacer]}/>
          </View>

          <View style={[styles.spacer]} /><View style={[styles.spacer]} />

          <View>
            {this.renderSpecificSkillTraits(endorsement)}
          </View>

          <View style={[styles.spacer]} /><View style={[styles.spacer]} />

          <View>
            <Text style={[styles.headingText6,styles.boldText]}>Examples of Above Competencies</Text>

            <View style={[styles.spacer]} /><View style={[styles.spacer]} />
            {endorsement.examples.map(value =>
              <View>
                 {(value.competency) ? (
                   <View>
                     {(value.competency && value.competency !== 'Select a Competency') && (
                       <View>
                         <Text style={[styles.descriptionText1]}>{value.competency} Example</Text>
                         <View style={[styles.halfSpacer]}/>
                         <Text style={[styles.descriptionText3,styles.descriptionTextColor,styles.boldText]}>{value.example}</Text>
                         <View style={[styles.spacer]}/><View style={[styles.spacer]}/>
                       </View>
                     )}
                   </View>
                 ) : (
                   <View>
                     {(value.skillTrait && value.skillTrait !== 'Select a Skill') && (
                       <View>
                         <Text style={[styles.descriptionText1]}>{value.skillTrait} Example</Text>
                         <View style={[styles.halfSpacer]}/>
                         <Text style={[styles.descriptionText3,styles.descriptionTextColor,styles.boldText]}>{value.example}</Text>
                         <View style={[styles.spacer]}/><View style={[styles.spacer]}/>
                       </View>
                     )}
                   </View>
                 )}
              </View>
            )}

          </View>


          <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.spacer]}/>

        </View>
      </View>
    )

  }

  render() {

      return (
          <View style={[styles.flex1]}>

            {(!this.props.selectedEndorsement && this.props.endorsements && this.props.endorsements.length > 0) && (
              <ScrollView style={[styles.flex1]}>
                {this.props.endorsements.map((value, index) =>
                  <View style={[styles.flex1]}>
                     {this.renderEndorsement(value)}
                  </View>
                )}
              </ScrollView>
            )}

            {(this.state.modalIsOpen && this.props.selectedEndorsement) && (
              <Modal isVisible={this.state.modalIsOpen} style={styles.modal}>
               {(this.state.confirmDelete === true && this.state.deleteIndex === this.state.detailIndex) ? (
                 <View style={[styles.padding30]}>
                  <Text style={[styles.headingText4]}>Delete {this.props.selectedEndorsement.senderFirstName} {this.props.selectedEndorsement.senderLastName}'s Endorsement</Text>
                  <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>

                   <View>
                     <Text style={[styles.errorColor]}>Are you sure you want to delete this endorsement? All information will be deleted forever.</Text>
                   </View>

                   <View style={[styles.spacer]}/><View style={[styles.spacer]}/>

                   <View style={[styles.rowDirection]}>
                     <View style={[styles.rightPadding20]}>
                       <TouchableOpacity style={[styles.btnPrimary, styles.errorBackgroundColor]} onPress={() => this.deleteEndorsement(this.state.detailIndex)}><Text style={[styles.whiteColor]}>Yes, Delete</Text></TouchableOpacity>
                     </View>
                     <View style={[styles.rightPadding20]}>
                       <TouchableOpacity style={[styles.btnPrimary]} onPress={() => this.setState({ confirmDelete: false, modalIsOpen: false })}><Text style={[styles.ctaColor]}>Cancel</Text></TouchableOpacity>
                     </View>
                   </View>

                   <View style={[styles.spacer]}/><View style={[styles.halfSpacer]}/>
                   {(this.state.serverErrorMessage) && <Text style={[styles.errorColor]}>{this.state.serverErrorMessage}</Text>}
                 </View>
               ) : (
                 <ScrollView style={[styles.flex1]}>
                   {(this.props.selectedEndorsement.isTransparent && this.props.selectedEndorsement.isTransparent !== 'false') ? (
                     <View style={[styles.padding20]}>
                      {this.renderEndorsement(this.props.selectedEndorsement)}
                     </View>
                   ) : (
                     <View style={[styles.padding40,styles.flexCenter]}>
                       <View style={[styles.centerText]}>
                         <Image source={{uri: confidentialityIcon}} style={[styles.square100,styles.contain,styles.verticalMargin20,styles.centerHorizontally]} />

                         <Text style={[styles.headingText4,styles.flex1,styles.centerText]}>This Endorsement is Confidential</Text>
                         <View style={[styles.spacer]}/>
                         <Text style={[styles.descriptionTextColor,styles.centerText]}>This endorsement has been marked confidential by the endorser. It will automatically be imported into internship applications.</Text>
                         <View style={[styles.spacer]}/><View style={[styles.spacer]}/><View style={[styles.spacer]}/>

                         <TouchableOpacity style={[styles.btnPrimary,styles.flex1,styles.ctaBorder,styles.flexCenter]} onPress={() => this.closeModal()}><Text style={[styles.ctaColor,styles.centerText]}>Close Modal</Text></TouchableOpacity>
                       </View>
                     </View>
                   )}
                 </ScrollView>
               )}
              </Modal>
            )}
          </View>

      )
  }

}

export default EndorsementDetails;
