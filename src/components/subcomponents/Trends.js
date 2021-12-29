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

  render() {
    // console.log('show style: ', Style.styles)
    return (
      <ScrollView>
        {(this.state.historicalData && this.state.historicalData.length > 0) && (
          <View>
            <View style={[styles.topMargin15,styles.rowDirection, styles.fullScreenWidth]}>
              <View style={[styles.calcColumn80]}>
                <Text>Fastest Growing Industries</Text>
              </View>
              <View style={[styles.width80]}>
                <Text onPress={() => Linking.openURL("https://www.bls.gov")} style={[styles.descriptionText3,styles.rightText]}>Source: BLS</Text>
              </View>

            </View>

            <View style={styles.card}>

              <View style={[styles.bottomPadding,styles.rowDirection,styles.flex1]}>
                <Text style={[styles.flex6,styles.descriptionText2,styles.boldText]}>Rank</Text>
                <Text style={[styles.flex50,styles.descriptionText2,styles.boldText]}>Name</Text>
                <Text style={[styles.flex11,styles.descriptionText2,styles.boldText]}>2-Yr Gwth</Text>
                <Text style={[styles.flex11,styles.descriptionText2,styles.boldText]}>Last Mth</Text>
                <Text style={[styles.flex11,styles.descriptionText2,styles.boldText]}>Last Yr</Text>
                <Text style={[styles.flex11,styles.descriptionText2,styles.boldText]}>2 Yrs Ago</Text>
              </View>

              <View>
                {this.state.historicalData.map((value, optionIndex) =>
                  <View key={optionIndex}>
                    <View style={[styles.rowDirection,styles.flex1]}>
                      <Text style={[styles.flex6,styles.descriptionText2]}>{value.rank}</Text>
                      <Text style={[styles.flex50,styles.descriptionText2]}>{value.name}</Text>
                      <Text style={[styles.flex11,styles.descriptionText2]}>{value.twoYearGrowth}%</Text>
                      <Text style={[styles.flex11,styles.descriptionText2]}>{value.currentDate}</Text>
                      <Text style={[styles.flex11,styles.descriptionText2]}>{value.lastYear}</Text>
                      <Text style={[styles.flex11,styles.descriptionText2]}>{value.twoYearsAgo}</Text>
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
                    <View style={[styles.topMargin15,styles.rowDirection]}>
                      <View style={styles.calcColumn80}>
                        <Text>Projected {oValue.category}</Text>
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
                              <Text style={[styles.flex5,styles.descriptionText2, styles.boldText]}>Rank</Text>
                              <Text style={[styles.flex50,styles.descriptionText2, styles.boldText]}>Title</Text>
                              <Text style={[styles.flex15,styles.descriptionText2, styles.boldText]}>Year</Text>
                              <Text style={[styles.flex15,styles.descriptionText2, styles.boldText]}>Yr Wage</Text>
                              <Text style={[styles.flex15,styles.descriptionText2, styles.boldText]}>Hr Wage</Text>
                            </View>

                            <View>
                              {oValue.occupations.map((value, optionIndex) =>
                                <View key={optionIndex}>
                                  <View style={[styles.rowDirection,styles.flex2]}>
                                    <Text style={[styles.flex5,styles.descriptionText2]}>{value.rank}</Text>
                                    <Text style={[styles.flex50,styles.descriptionText2]}>{value.title}</Text>
                                    <Text style={[styles.flex15,styles.descriptionText2]}>{value.projYear}</Text>
                                    <Text style={[styles.flex15,styles.descriptionText2]}>{value.annualizedWage}</Text>
                                    <Text style={[styles.flex15,styles.descriptionText2]}>{value.hourlyWage}</Text>
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
                              <Text style={[styles.flex6,styles.descriptionText2]}>Rank</Text>
                              <Text style={[styles.flex50,styles.descriptionText2]}>Title</Text>
                              <Text style={[styles.flex11,styles.descriptionText2]}>% Change</Text>
                              <Text style={[styles.flex11,styles.descriptionText2]}>Year</Text>
                              <Text style={[styles.flex11,styles.descriptionText2]}>Emp Last Yr</Text>
                              <Text style={[styles.flex11,styles.descriptionText2]}>Emp In 10 Yrs</Text>


                            </View>

                            <View>
                              {oValue.occupations.map((value, optionIndex) =>
                                <View key={optionIndex}>
                                  <View>
                                    <Text style={[styles.flex6,styles.descriptionText2]}>{value.rank}</Text>
                                    <Text style={[styles.flex50,styles.descriptionText2]}>{value.title}</Text>
                                    <Text style={[styles.flex11,styles.descriptionText2]}>{value.percentChange}</Text>
                                    <Text style={[styles.flex11,styles.descriptionText2]}>{value.projYear}</Text>
                                    <Text style={[styles.flex11,styles.descriptionText2]}>{value.estimatedEmployment}</Text>
                                    <Text style={[styles.flex11,styles.descriptionText2]}>{value.projectedEmployment}</Text>


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

        {(this.state.competencies) && (
          <View>
            {this.state.competencies.map((value, index) =>
              <View key={index}>
                <View style={[styles.topMargin15,styles.rowDirection]}>
                  <View style={styles.calcColumn80}>
                    {(value.type && value.type.includes('Skill')) && (
                      <Text>{(value.category === 'occurrences') ? "Most Common In-Demand Skills" : "Skills That Pay The Most"}</Text>
                    )}
                    {(value.type === 'Knowledge') && (
                      <Text>{(value.category === 'occurrences') ? "Most Common In-Demand Knowledge" : "Knowledge That Pays   The Most"}</Text>
                    )}
                    {(value.type === 'Work Style') && (
                      <Text>{(value.category === 'occurrences') ? "Most Common In-Demand Work Styles" : "Work Styles That Pay The Most"}</Text>
                    )}

                  </View>
                  <View style={[styles.width80,styles.topPadding]}>
                    <Text onPress={() => Linking.openURL("https://www.bls.gov")} style={styles.descriptionText3}>Source: BLS</Text>
                  </View>

                </View>

                <View style={styles.card}>
                  <View style={[styles.boldText,styles.bottomPadding,styles.rowDirection,styles.flex1]}>
                    <Text style={[styles.flex40,styles.descriptionText2]}>Name</Text>
                    <Text style={[styles.flex20,styles.descriptionText2]}>Type</Text>
                    <Text style={[styles.flex20,styles.descriptionText2]}>Occurrences</Text>
                    <Text style={[styles.flex20,styles.descriptionText2]}>Avg. Worth</Text>

                  </View>

                  {value.competencies.map((oValue, oIndex) =>
                    <View key={oIndex}>
                      <View>
                        <View>
                          <View>
                            <View style={[styles.rowDirection,styles.flex1]}>
                              <Text style={[styles.flex40,styles.descriptionText2]}>{oValue.name}</Text>
                              <Text style={[styles.flex20,styles.descriptionText2]}>{oValue.type}</Text>
                              <Text style={[styles.flex20,styles.descriptionText2]}>{oValue.occurrences}</Text>
                              <Text style={[styles.flex20,styles.descriptionText2]}>${Number(oValue.worth.toFixed()).toLocaleString()}</Text>


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
