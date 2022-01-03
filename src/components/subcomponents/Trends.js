import React, { Component } from 'react';
import { Text, View, StyleSheet, ScrollView, TouchableOpacity, AsyncStorage, Image, Platform } from 'react-native';
const styles = require('../css/style');
import Axios from 'axios';

class Trends extends Component {
  constructor(props) {
    super(props)
    this.state = {
      trends: []
    }

    this.retrieveData = this.retrieveData.bind(this)
    this.formChangeHandler = this.formChangeHandler.bind(this);
    this.convertTextToNumber = this.convertTextToNumber.bind(this)

  }

  componentDidMount() {
    console.log('home component did mount');

    this.retrieveData()

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

        Axios.get('https://www.guidedcompass.com/api/trends')
        .then((response) => {

            if (response.data.success) {
              console.log('Trends query worked', response.data);

              const trends = response.data.trends

              let historicalData = []
              // calculate 2-Year Growth
              if (trends[0].data) {
                for (let i = 1; i <= trends[0].data.length; i++) {
                  if (i > 1) {
                    const currentValue = trends[0].data[i - 1].currentDate
                    const twoYearsAgoValue = trends[0].data[i - 1].twoYearsAgo
                    if (Number(currentValue) && Number(twoYearsAgoValue)) {
                      const twoYearGrowth = (((Number(currentValue) / Number(twoYearsAgoValue)) - 1) * 100).toFixed()
                      console.log('show twoYearGrowth: ', twoYearGrowth)
                      historicalData.push({
                        name: trends[0].data[i - 1].name,
                        code: trends[0].data[i - 1].code,
                        twoYearGrowth,
                        currentDate: trends[0].data[i - 1].currentDate,
                        lastYear: trends[0].data[i - 1].lastYear,
                        twoYearsAgo: trends[0].data[i - 1].twoYearsAgo,
                        annualizedWage: trends[0].data[i - 1].twoYearsAgo,
                        hourlyWage: trends[0].data[i - 1].twoYearsAgo,
                      })
                    }
                  }
                }
              }
              console.log('show historicalArray length 1: ', historicalData.length)
              historicalData.sort(function(a,b) {
                return b.twoYearGrowth - a.twoYearGrowth;
              })
              historicalData =  historicalData.slice(0,10)

              for (let i = 1; i <= historicalData.length; i++) {
                historicalData[i - 1]['rank'] = i
              }

              this.setState({ historicalData, trends })

            } else {
              console.log('no trends found', response.data.message)
            }

        }).catch((error) => {
            console.log('Trends query did not work', error);
        });

        const typesArray = [['General Skill','Hard Skill', 'Soft Skill'],['Knowledge'],['Work Style']]

        Axios.put('https://www.guidedcompass.com/api/competency/top', { typesArray })
        .then((response) => {

            if (response.data.success) {
              console.log('Top occurrence competencies query worked', response.data);

              const competencies = response.data.competencies
              if (competencies) {
                this.setState({ competencies })
              }

            } else {
              console.log('no trends found', response.data.message)
            }

        }).catch((error) => {
            console.log('Trends query did not work', error);
        });
      }
     } catch (error) {
       // Error retrieving data
       console.log('there was an error', error)
     }
  }

  formChangeHandler(event) {
    console.log('formChangeHandler called')

    if (event.target.name === 'email') {
      this.setState({ email: event.target.value })
    }
  }

  convertTextToNumber(passedText) {
    console.log('convertTextToNumber called')

    let numberVersion = Number(passedText.replace(/,/g,""))
    return numberVersion

  }

  render() {
    // console.log('show style: ', Style.styles)
    return (
      <ScrollView>
        {(this.state.historicalData && this.state.historicalData.length > 0) && (
          <View>
            <View style={[styles.topMargin30,styles.bottomMargin5,styles.rowDirection, styles.fullScreenWidth]}>
              <View style={[styles.calcColumn80]}>
                <Text style={[styles.headingText6]}>Fastest Growing Industries</Text>
              </View>
              <View style={[styles.width80]}>
                <Text onPress={() => Linking.openURL("https://www.bls.gov")} style={[styles.descriptionText3,styles.rightText]}>Source: BLS</Text>
              </View>

            </View>

            <View style={styles.card}>

              <View style={[styles.bottomPadding,styles.rowDirection,styles.flex1]}>
                <Text style={[styles.width40,styles.descriptionText2,styles.boldText]}>Rank</Text>
                <Text style={[styles.calcColumn180,styles.descriptionText2,styles.boldText]}>Name</Text>
                <Text style={[styles.width80,styles.descriptionText2,styles.boldText]}>2-Yr Gwth</Text>
                {/*
                <Text style={[styles.flex11,styles.descriptionText2,styles.boldText]}>Last Mth</Text>
                <Text style={[styles.flex11,styles.descriptionText2,styles.boldText]}>Last Yr</Text>
                <Text style={[styles.flex11,styles.descriptionText2,styles.boldText]}>2 Yrs Ago</Text>*/}
              </View>

              <View>
                {this.state.historicalData.map((value, optionIndex) =>
                  <View key={optionIndex}>
                    <View style={[styles.rowDirection,styles.flex1]}>
                      <Text style={[styles.width40,styles.descriptionText2]}>{value.rank}</Text>
                      <Text style={[styles.calcColumn180,styles.descriptionText2]}>{value.name}</Text>
                      <Text style={[styles.width80,styles.descriptionText2,styles.rightText]}>{value.twoYearGrowth}%</Text>
                    </View>
                  </View>
                )}

              </View>
            </View>

          </View>
        )}

        {(this.state.trends && this.state.trends.length > 1) && (
          <View>

            {this.state.trends.map((oValue, index) =>
              <View key={index}>

                {(index > 1) && (
                  <View>
                    {(oValue.category !== 'Most Openings') && (
                      <View>
                        <View style={[styles.topMargin30,styles.bottomMargin5,styles.rowDirection]}>
                          <View style={styles.calcColumn80}>
                            <Text style={[styles.headingText6]}>Projected {oValue.category}</Text>
                          </View>
                          <View style={[styles.width80]}>
                            <Text onPress={() => Linking.openURL("https://www.bls.gov")} style={[styles.descriptionText3, styles.rightText]}>Source: BLS</Text>
                          </View>

                        </View>

                        {(oValue.category === 'Highest Paying Careers') ? (
                          <View>
                            {(oValue.occupations && oValue.occupations.length > 0) && (
                              <View style={styles.card}>
                                <View style={[styles.bottomPadding, styles.rowDirection, styles.flex1]}>
                                  <Text style={[styles.width40,styles.descriptionText2, styles.boldText]}>Rank</Text>
                                  <Text style={[styles.calcColumn180,styles.descriptionText2, styles.boldText]}>Title</Text>
                                  <Text style={[styles.width80,styles.descriptionText2, styles.boldText,styles.rightText]}>Salary</Text>
                                </View>

                                <View>
                                  {oValue.occupations.map((value, optionIndex) =>
                                    <View key={optionIndex}>
                                      <View style={[styles.rowDirection,styles.flex1]}>
                                        <Text style={[styles.width40,styles.descriptionText2]}>{value.rank}</Text>
                                        <Text style={[styles.calcColumn185,styles.descriptionText2]}>{value.title}</Text>
                                        <Text style={[styles.width85,styles.descriptionText2,styles.rightText]}>{value.annualizedWage}</Text>
                                      </View>
                                    </View>
                                  )}

                                </View>
                              </View>
                            )}
                          </View>
                        ) : (
                          <View>

                            {(oValue.occupations && oValue.occupations.length > 0) && (
                              <View style={styles.card}>
                                <View style={[styles.boldText,styles.bottomPadding,styles.rowDirection,styles.flex1]}>
                                  <Text style={[styles.width40,styles.descriptionText2]}>Rank</Text>
                                  <Text style={[styles.calcColumn180,styles.descriptionText2]}>Title</Text>
                                  <Text style={[styles.width80,styles.descriptionText2,styles.rightText]}>{(oValue.category.includes('Largest')) ? "Employed" : "% Change"}</Text>
                                </View>

                                <View>
                                  {oValue.occupations.map((value, optionIndex) =>
                                    <View key={optionIndex}>
                                      <View style={[styles.rowDirection,styles.flex1]}>
                                        <Text style={[styles.width40,styles.descriptionText2]}>{value.rank}</Text>
                                        <Text style={[styles.calcColumn180,styles.descriptionText2]}>{value.title}</Text>
                                        <Text style={[styles.width80,styles.descriptionText2,styles.rightText]}>{(oValue.category.includes('Largest')) ? value.estimatedEmployment : value.percentChange}</Text>
                                      </View>
                                    </View>
                                  )}

                                </View>
                              </View>
                            )}

                          </View>
                        )}
                      </View>
                    )}
                  </View>
                )}
              </View>
            )}

          </View>
        )}

        {(this.state.competencies) && (
          <View>
            {this.state.competencies.map((value, index) =>
              <View key={index}>
                <View style={[styles.topMargin30,styles.rowDirection]}>
                  <View style={styles.calcColumn80}>
                    {(value.type && value.type.includes('Skill')) && (
                      <Text style={[styles.headingText6]}>{(value.category === 'occurrences') ? "Most Common In-Demand Skills" : "Skills That Pay The Most"}</Text>
                    )}
                    {(value.type === 'Knowledge') && (
                      <Text style={[styles.headingText6]}>{(value.category === 'occurrences') ? "Most Common In-Demand Knowledge" : "Knowledge That Pays   The Most"}</Text>
                    )}
                    {(value.type === 'Work Style') && (
                      <Text style={[styles.headingText6]}>{(value.category === 'occurrences') ? "Most Common In-Demand Work Styles" : "Work Styles That Pay The Most"}</Text>
                    )}

                  </View>
                  <View style={[styles.width80,styles.topPadding]}>
                    <Text onPress={() => Linking.openURL("https://www.bls.gov")} style={styles.descriptionText3}>Source: BLS</Text>
                  </View>

                </View>

                <View style={styles.card}>
                  <View style={[styles.boldText,styles.bottomPadding,styles.rowDirection,styles.flex1]}>
                    <Text style={[styles.flex55,styles.descriptionText2]}>Name</Text>
                    <Text style={[styles.flex20,styles.descriptionText2]}>Count</Text>
                    <Text style={[styles.flex25,styles.descriptionText2]}>Avg. Worth</Text>

                  </View>

                  {value.competencies.map((oValue, oIndex) =>
                    <View key={oIndex}>
                      <View>
                        <View>
                          <View>
                            <View style={[styles.rowDirection,styles.flex1]}>
                              <Text style={[styles.flex55,styles.descriptionText2]}>{oValue.name}</Text>
                              <Text style={[styles.flex20,styles.descriptionText2]}>{oValue.occurrences}</Text>
                              <Text style={[styles.flex25,styles.descriptionText2]}>${Number(oValue.worth.toFixed()).toLocaleString()}</Text>
                            </View>
                          </View>


                        </View>
                      </View>
                    </View>
                  )}

                </View>

              </View>
            )}
          </View>
        )}
      </ScrollView>
    );
  }

}

export default Trends;
